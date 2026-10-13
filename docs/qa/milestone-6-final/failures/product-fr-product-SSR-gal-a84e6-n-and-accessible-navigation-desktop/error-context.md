# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product.spec.ts >> fr: product SSR, gallery, finishes, quotation and accessible navigation
- Location: tests\product.spec.ts:9:35

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('.product-back')

```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - alert [ref=f3e2]:
    - heading "المحتوى غير متاح" [level=1] [ref=f3e3]
    - paragraph [ref=f3e4]: يرجى المحاولة مجددًا.
    - button "إعادة المحاولة" [ref=f3e5] [cursor=pointer]
  - alert [ref=f3e6]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { mkdir } from 'node:fs/promises';
  4  | import { locales } from '../apps/web/src/lib/locales';
  5  | import { productCopy } from '../apps/web/src/lib/product-copy';
  6  | import { getProduct, configurationFromParams, validConfiguration, productUrl } from '../apps/web/src/lib/product';
  7  | import { parseCatalogueQuery } from '../apps/web/src/lib/catalogue';
  8  | 
  9  | for (const locale of locales) test(`${locale}: product SSR, gallery, finishes, quotation and accessible navigation`, async ({ page, request }) => {
  10 |   const c = productCopy[locale];
  11 |   const errors: string[] = [];
  12 |   page.on('pageerror', error => errors.push(error.message));
  13 |   const response = await request.get(`/${locale}/products/sample-1?color=beige&sort=name_desc&page=2`);
  14 |   expect(response.status()).toBe(200);
  15 |   expect(await response.text()).toContain(c.specNote);
  16 |   await page.goto(`/${locale}/products/sample-1?color=beige&sort=name_desc&page=2`);
  17 |   await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  18 |   await expect(page.locator('canvas')).toHaveCount(0);
  19 |   await expect(page.locator('h1')).toHaveCount(1);
  20 |   await page.locator('.gallery-thumbnails button').nth(1).click();
  21 |   await expect(page.locator('.gallery-thumbnails button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  22 |   await page.getByRole('button', { name: c.finishNames[1], exact: true }).click();
  23 |   await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_finish=polished/);
  24 |   await page.locator('.product-configuration summary').click();
  25 |   await expect(page.locator('.shape-options button')).toHaveCount(1);
  26 |     await page.locator('.shape-options button').first().click();
  27 |   await page.locator('input[name="thickness"]').fill('42');
  28 |   await page.getByRole('button', { name: c.update, exact: true }).click();
  29 |   await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_thickness=42/);
  30 |   expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  31 |   await page.locator('.product-quote-panel a').click();
  32 |   await expect(page).toHaveURL(/\/quote\?/);
  33 |   await expect(page.locator('.quotation-form')).toBeVisible();
  34 |   await expect(page.locator('main')).toContainText('180 × 120 × 42 cm');
  35 |   await expect(page.locator('.quotation-form')).toHaveCount(1);
  36 |   await page.locator('.quote-return').click();
  37 |   await expect(page).toHaveURL(/\/products\/sample-1\?color=beige&sort=name_desc&page=2/);
  38 |   await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href', /v_thickness=42/);
  39 |   await page.locator('.locale-picker select').selectOption(locale === 'ar' ? 'fr' : 'ar');
  40 |   await expect(page).toHaveURL(/\/products\/sample-1\?color=beige&sort=name_desc&page=2/);
> 41 |   await page.locator('.product-back').click();
     |                                       ^ Error: locator.click: Test timeout of 180000ms exceeded.
  42 |   // Ten beige records fit on one server-paginated page: the invalid page 2 returns to page 1.
  43 |   await expect(page).toHaveURL(/\/products\?color=beige&sort=name_desc#results/);
  44 |   expect(errors).toEqual([]);
  45 | });
  46 | 
  47 | test('product data contracts reject unsafe configuration and unknown products', async ({ request }) => {
  48 |   const product = (await getProduct('fr', 'sample-1'))!;
  49 |   expect(product.dimensions_verified).toBe(false);
  50 |   expect(product.verified_specifications).toEqual([]);
  51 |   expect(product.uploaded_model).toBeNull();
  52 |   expect(product.supported_finishes).toEqual(['honed', 'polished', 'rough']);
  53 |   expect(product.formats.map(f => f.geometry)).toEqual(['slab', 'block', 'tile']);
  54 |   expect(await getProduct('en', 'invalid')).toBeNull();
  55 |   expect((await request.get('/fr/products/not-a-product')).status()).toBe(404);
  56 |   expect((await request.get('/fr/quote?product=not-a-product')).status()).toBe(404);
  57 |   for (const value of [0, 501, NaN, Infinity]) expect(validConfiguration({ ...product.saved_3d_configuration, thickness: value })).toBe(false);
  58 |   expect(configurationFromParams({ v_shape: 'injected', v_width: '9999999' }, product.saved_3d_configuration)).toEqual(product.saved_3d_configuration);
  59 |   expect(productUrl('ar', product.id, parseCatalogueQuery({ return: '//evil.invalid', q: '<script>' }))).toBe('/ar/products/sample-1?q=%3Cscript%3E');
  60 | });
  61 | 
  62 | test('product width matrix, screenshots and no initial 3D payload', async ({ page }, info) => {
  63 |   test.skip(info.project.name !== 'desktop', 'Complete matrix once.');
  64 |   test.setTimeout(360000);
  65 |   await mkdir('docs/qa/milestone-3', { recursive: true });
  66 |   for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
  67 |     await page.setViewportSize({ width, height: 900 });
  68 |     await page.goto(`/${locale}/products/sample-1`);
  69 |     await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
  70 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  71 |     await expect(page.locator('canvas')).toHaveCount(0);
  72 |     expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  73 |     const initialResources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
  74 |     expect(initialResources.some(url => url.includes('/media/')&&url.includes('/texture'))).toBe(true); // CSS finish swatches only.
  75 |     await page.screenshot({ path: `docs/qa/milestone-3/product-${locale}-${width}.png`, scale: 'css' });
  76 |     if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-3/product-${locale}-${width}-full.png`, fullPage: true, scale: 'css' });
  77 |   }
  78 | });
  79 | 
  80 | test('product photos, details and quotation destination work without JavaScript', async ({ browser }, info) => {
  81 |   test.skip(info.project.name !== 'desktop', 'SSR native navigation once.');
  82 |   const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  83 |   const page = await context.newPage();
  84 |   await page.goto('/ar/products/sample-1?category=limestone');
  85 |   await expect(page.locator('noscript .product-note')).toHaveText(productCopy.ar.noScript);
  86 |   await expect(page.locator('.studio-activate')).toBeHidden();
  87 |   await page.locator('.product-quote-panel a').click();
  88 |   await expect(page.locator('.quotation-form')).toBeVisible();
  89 |   await context.close();
  90 | });
  91 | 
```