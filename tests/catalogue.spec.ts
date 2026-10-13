import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { catalogueCopy, getCatalogue, parseCatalogueQuery } from '../apps/web/src/lib/catalogue';
import { locales } from '../apps/web/src/lib/locales';

for (const locale of locales) {
  test(`${locale}: catalogue SSR, accessible controls, navigation and samples`, async ({ page, request }, info) => {
    const c = catalogueCopy[locale];
    const apiOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
    const live=async(query='')=>{const response=await request.get(`${apiOrigin}/api/v1/products?locale=${locale}&per_page=12${query}`);expect(response.ok()).toBe(true);return response.json();};
    const firstPage=await live(),secondPage=await live('&page=2');
    expect(firstPage.meta.total,'Pagination regression requires at least two pages of published QA content').toBeGreaterThan(12);
    const firstCount=firstPage.data.length,secondCount=secondPage.data.length;
    const marble=await live('&category=marble&sort=name_desc'),beige=await live('&color=beige&sort=name_desc');
    expect(marble.data.length).toBeGreaterThan(0);expect(beige.data.length).toBeGreaterThan(0);

    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const html = await request.get(`/${locale}/products`);
    expect(html.status()).toBe(200);
    expect(await html.text()).toContain(c.title);
    await page.goto(`/${locale}/products`);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('.product-card')).toHaveCount(firstCount);
    await expect(page.locator('.catalogue-pagination bdi')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('h1')).toHaveText(c.title);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.locator('a[rel="next"]').click();
    await expect(page.locator('.product-card')).toHaveCount(secondCount);
    await expect(page).toHaveURL(/page=2/);
    await page.reload();
    await expect(page.locator('.product-card')).toHaveCount(secondCount);
    await page.goBack();
    await expect(page.locator('.product-card')).toHaveCount(firstCount);
    await page.goForward();
    await expect(page.locator('.product-card')).toHaveCount(secondCount);
    await page.locator('.product-card a').first().click();
    await expect(page).toHaveURL(new RegExp('/products/'+secondPage.data[0].slug+'\\?page=2'));
    await expect(page.locator('.product-gallery')).toBeVisible();
    await page.locator('.product-back').click();
    await expect(page).toHaveURL(/\/products\?page=2#results/);
    await expect(page.locator('.product-card')).toHaveCount(secondCount);
    await page.goto(`/${locale}/products?category=marble&sort=name_desc`);
    await expect(page.locator('.product-card')).toHaveCount(marble.data.length);
    await page.locator('select[aria-label]').selectOption(locale === 'ar' ? 'fr' : 'ar');
    await expect(page).toHaveURL(/\/products\?category=marble&sort=name_desc/);
    await page.goto(`/${locale}/products?color=beige`);
    await page.locator('#catalogue-sort').selectOption('name_desc');
    await page.locator('.catalogue-sort button').click();
    await expect(page).toHaveURL(/sort=name_desc/);
    await expect(page).toHaveURL(/color=beige/);
    await expect(page.locator('.product-card')).toHaveCount(beige.data.length);
    if (info.project.name !== 'desktop') {
      await page.goto(`/${locale}/products`);
      const opener = page.locator('.filter-toggle');
      await opener.click();
      const drawer = page.locator('.catalogue-drawer');
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Shift+Tab');
      expect(await drawer.evaluate(element => element.contains(document.activeElement))).toBe(true);
      await drawer.locator('select[name="color"]').selectOption('beige');
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
      await expect(page).not.toHaveURL(/color=/);
      await opener.click();
      await drawer.getByRole('button', { name: c.apply, exact: true }).click();
      await expect(page).toHaveURL(/color=beige/);
      await page.reload();
      await opener.click();
      await expect(drawer.locator('select[name="color"]')).toHaveValue('beige');
      await drawer.getByRole('link', { name: c.clear, exact: true }).click();
      await expect(page.locator('.product-card')).toHaveCount(firstCount);
      await expect(page).not.toHaveURL(/color=/);
    }
    await page.goto(`/${locale}/products?q=zzzznomatch`);
    await expect(page.locator('.catalogue-empty')).toContainText(c.empty);
    await page.goto(`/${locale}/products`);
    const search=firstPage.data[0].name;const searchResult=await live('&q='+encodeURIComponent(search));expect(searchResult.data.some((p:{slug:string})=>p.slug===firstPage.data[0].slug)).toBe(true);await page.getByRole('searchbox').fill(search);
    await page.getByRole('search').getByRole('button').click();
    await expect(page.locator('.product-card')).toHaveCount(searchResult.data.length);
    expect(await page.locator('.product-card h2').allTextContents()).toEqual(searchResult.data.map((p:{name:string})=>p.name));
    expect(errors).toEqual([]);
  });
}

test('catalogue fixture adapter validates inputs, combines filters and sorts', async () => {
  const invalid = parseCatalogueQuery({ page: '-1', sort: 'popular', category: 'invalid', q: 'x'.repeat(120), color: ['grey', 'beige'] });
  expect(invalid.page).toBe(1); expect(invalid.sort).toBe('featured'); expect(invalid.category).toBe('invalid'); expect(invalid.q).toHaveLength(100); expect(invalid.color).toBe('');
  const query = parseCatalogueQuery({ category: 'limestone', color: 'beige', sort: 'name_desc', page: '999999' });
  const result = await getCatalogue('en', query);
  expect(result.meta.current_page).toBe(1);
  expect(result.meta.total).toBe(4);
  expect(result.data.every(p => p.category === 'limestone' && p.color === 'beige')).toBe(true);
  expect(result.data.map(p => p.id)).toEqual(['sample-16', 'sample-11', 'sample-6', 'sample-1']);
});

test('catalogue width matrix and screenshots in three languages', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Run the complete matrix once.');
  test.setTimeout(360000);
  await mkdir('docs/qa/milestone-2', { recursive: true });
  for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/products`);
    await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}.png`, scale: 'css' });
    if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}-full.png`, scale: 'css', fullPage: true });
  }
});

test('catalogue works without client JavaScript', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop', 'Native GET forms covered once.');
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/fr/products');
  await page.getByRole('searchbox').fill('Marbre');
  await page.getByRole('search').getByRole('button').click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.locator('noscript details').getByText('Filtres', { exact: true }).click();
  await page.locator('#noscript-color').selectOption('beige');
  await page.locator('noscript form').getByRole('button', { name: 'Appliquer' }).click();
  await expect(page).toHaveURL(/color=beige/);
  await context.close();
});
