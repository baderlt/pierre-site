import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { locales } from '../apps/web/src/lib/locales';
import { productCopy } from '../apps/web/src/lib/product-copy';
import { getProduct, configurationFromParams, validConfiguration, productUrl } from '../apps/web/src/lib/product';
import { parseCatalogueQuery } from '../apps/web/src/lib/catalogue';

for (const locale of locales) test(`${locale}: product SSR, gallery, finishes, quotation and accessible navigation`, async ({ page, request }) => {
  const c = productCopy[locale];
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await request.get(`/${locale}/products/sample-1?color=beige&sort=name_desc&page=2`);
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain(c.specNote);
  await page.goto(`/${locale}/products/sample-1?color=beige&sort=name_desc&page=2`);
  await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.locator('.gallery-thumbnails button').nth(1).click();
  await expect(page.locator('.gallery-thumbnails button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: c.finishNames[1], exact: true }).click();
  await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_finish=polished/);
  await page.locator('.product-configuration summary').click();
  await expect(page.locator('.shape-options button')).toHaveCount(1);
    await page.locator('.shape-options button').first().click();
  await page.locator('input[name="thickness"]').fill('42');
  await page.getByRole('button', { name: c.update, exact: true }).click();
  await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_thickness=42/);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.locator('.product-quote-panel a').click();
  await expect(page).toHaveURL(/\/quote\?/);
  await expect(page.locator('.quotation-form')).toBeVisible();
  await expect(page.locator('main')).toContainText('180 × 120 × 42 cm');
  await expect(page.locator('.quotation-form')).toHaveCount(1);
  await page.locator('.quote-return').click();
  await expect(page).toHaveURL(/\/products\/sample-1\?color=beige&sort=name_desc&page=2/);
  await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_thickness=42/);
  await page.locator('.locale-picker select').selectOption(locale === 'ar' ? 'fr' : 'ar');
  await expect(page).toHaveURL(/\/products\/sample-1\?color=beige&sort=name_desc&page=2/);
  await page.locator('.product-back').click();
  const api=process.env.QA_API_URL||'http://127.0.0.1:8000';const filtered=await request.get(`${api}/api/v1/products?color=beige&sort=name_desc&per_page=12`);expect(filtered.ok()).toBe(true);const lastPage=(await filtered.json()).meta.last_page;
  await expect(page).toHaveURL(new RegExp('/products\\?color=beige&sort=name_desc'+(lastPage>=2?'&page=2':'')+'#results'));
  expect(errors).toEqual([]);
});

test('product data contracts reject unsafe configuration and unknown products', async ({ request }) => {
  const product = (await getProduct('fr', 'sample-1'))!;
  expect(product.dimensions_verified).toBe(false);
  expect(product.verified_specifications).toEqual([]);
  expect(product.uploaded_model).toBeNull();
  expect(product.supported_finishes).toEqual(['honed', 'polished', 'rough']);
  expect(product.formats.map(f => f.geometry)).toEqual(['slab', 'block', 'tile']);
  expect(await getProduct('en', 'invalid')).toBeNull();
  expect((await request.get('/fr/products/not-a-product')).status()).toBe(404);
  expect((await request.get('/fr/quote?product=not-a-product')).status()).toBe(404);
  for (const value of [0, 501, NaN, Infinity]) expect(validConfiguration({ ...product.saved_3d_configuration, thickness: value })).toBe(false);
  expect(configurationFromParams({ v_shape: 'injected', v_width: '9999999' }, product.saved_3d_configuration)).toEqual(product.saved_3d_configuration);
  expect(productUrl('ar', product.id, parseCatalogueQuery({ return: '//evil.invalid', q: '<script>' }))).toBe('/ar/products/sample-1?q=%3Cscript%3E');
});

test('product width matrix, screenshots and no initial 3D payload', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Complete matrix once.');
  test.setTimeout(360000);
  await mkdir('docs/qa/milestone-3', { recursive: true });
  for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/products/sample-1`);
    await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    const initialResources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
    expect(initialResources.some(url => url.includes('/media/')&&url.includes('/texture'))).toBe(true); // CSS finish swatches only.
    await page.screenshot({ path: `docs/qa/milestone-3/product-${locale}-${width}.png`, scale: 'css' });
    if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-3/product-${locale}-${width}-full.png`, fullPage: true, scale: 'css' });
  }
});

test('product photos, details and quotation destination work without JavaScript', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop', 'SSR native navigation once.');
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/ar/products/sample-1?category=limestone');
  await expect(page.locator('noscript .product-note')).toHaveText(productCopy.ar.noScript);
  await expect(page.locator('.studio-activate')).toBeHidden();
  await page.locator('.product-quote-panel a').click();
  await expect(page.locator('.quotation-form')).toBeVisible();
  await context.close();
});
