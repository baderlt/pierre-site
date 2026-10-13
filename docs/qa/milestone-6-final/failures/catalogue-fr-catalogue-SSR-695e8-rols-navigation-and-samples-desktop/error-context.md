# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogue.spec.ts >> fr: catalogue SSR, accessible controls, navigation and samples
- Location: tests\catalogue.spec.ts:8:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.product-card')
Expected: 6
Received: 0
Timeout:  20000ms

Call log:
  - Expect "toHaveCount" locator('.product-card') with timeout 20000ms
  - waiting for locator('.product-card')
    43 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - alert [ref=f2e2]:
    - heading "Contenu indisponible" [level=1] [ref=f2e3]
    - paragraph [ref=f2e4]: Veuillez réessayer.
    - button "Réessayer" [ref=f2e5] [cursor=pointer]
  - alert [ref=f2e6]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | import { mkdir } from 'node:fs/promises';
  4   | import { catalogueCopy, getCatalogue, parseCatalogueQuery } from '../apps/web/src/lib/catalogue';
  5   | import { locales } from '../apps/web/src/lib/locales';
  6   | 
  7   | for (const locale of locales) {
  8   |   test(`${locale}: catalogue SSR, accessible controls, navigation and samples`, async ({ page, request }, info) => {
  9   |     const c = catalogueCopy[locale];
  10  |     const errors: string[] = [];
  11  |     page.on('pageerror', error => errors.push(error.message));
  12  |     const html = await request.get(`/${locale}/products`);
  13  |     expect(html.status()).toBe(200);
  14  |     expect(await html.text()).toContain(c.title);
  15  |     await page.goto(`/${locale}/products`);
  16  |     await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  17  |     await expect(page.locator('.product-card')).toHaveCount(12);
  18  |     await expect(page.locator('.catalogue-pagination bdi')).toHaveAttribute('dir', 'ltr');
  19  |     await expect(page.locator('h1')).toHaveText(c.title);
  20  |     const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  21  |     expect(accessibility.violations).toEqual([]);
  22  |     await page.locator('a[rel="next"]').click();
  23  |     await expect(page.locator('.product-card')).toHaveCount(6);
  24  |     await expect(page).toHaveURL(/page=2/);
  25  |     await page.reload();
> 26  |     await expect(page.locator('.product-card')).toHaveCount(6);
      |                                                 ^ Error: expect(locator).toHaveCount(expected) failed
  27  |     await page.goBack();
  28  |     await expect(page.locator('.product-card')).toHaveCount(12);
  29  |     await page.goForward();
  30  |     await expect(page.locator('.product-card')).toHaveCount(6);
  31  |     await page.locator('.product-card a').first().click();
  32  |     await expect(page).toHaveURL(/\/products\/sample-\d+\?page=2/);
  33  |     await expect(page.locator('.product-gallery')).toBeVisible();
  34  |     await page.locator('.product-back').click();
  35  |     await expect(page).toHaveURL(/\/products\?page=2#results/);
  36  |     await expect(page.locator('.product-card')).toHaveCount(6);
  37  |     await page.goto(`/${locale}/products?category=marble&sort=name_desc`);
  38  |     await expect(page.locator('.product-card')).toHaveCount(4);
  39  |     await page.locator('select[aria-label]').selectOption(locale === 'ar' ? 'fr' : 'ar');
  40  |     await expect(page).toHaveURL(/\/products\?category=marble&sort=name_desc/);
  41  |     await page.goto(`/${locale}/products?color=beige`);
  42  |     await page.locator('#catalogue-sort').selectOption('name_desc');
  43  |     await page.locator('.catalogue-sort button').click();
  44  |     await expect(page).toHaveURL(/sort=name_desc/);
  45  |     await expect(page).toHaveURL(/color=beige/);
  46  |     await expect(page.locator('.product-card')).toHaveCount(10);
  47  |     if (info.project.name !== 'desktop') {
  48  |       await page.goto(`/${locale}/products`);
  49  |       const opener = page.locator('.filter-toggle');
  50  |       await opener.click();
  51  |       const drawer = page.locator('.catalogue-drawer');
  52  |       await expect(drawer).toBeVisible();
  53  |       await page.keyboard.press('Shift+Tab');
  54  |       expect(await drawer.evaluate(element => element.contains(document.activeElement))).toBe(true);
  55  |       await drawer.locator('select[name="color"]').selectOption('beige');
  56  |       await page.keyboard.press('Escape');
  57  |       await expect(opener).toBeFocused();
  58  |       await expect(page).not.toHaveURL(/color=/);
  59  |       await opener.click();
  60  |       await drawer.getByRole('button', { name: c.apply, exact: true }).click();
  61  |       await expect(page).toHaveURL(/color=beige/);
  62  |       await page.reload();
  63  |       await opener.click();
  64  |       await expect(drawer.locator('select[name="color"]')).toHaveValue('beige');
  65  |       await drawer.getByRole('link', { name: c.clear, exact: true }).click();
  66  |       await expect(page.locator('.product-card')).toHaveCount(12);
  67  |       await expect(page).not.toHaveURL(/color=/);
  68  |     }
  69  |     await page.goto(`/${locale}/products?q=zzzznomatch`);
  70  |     await expect(page.locator('.catalogue-empty')).toContainText(c.empty);
  71  |     await page.goto(`/${locale}/products`);
  72  |     await page.getByRole('searchbox').fill(c.categoryNames[1]);
  73  |     await page.getByRole('search').getByRole('button').click();
  74  |     await expect(page.locator('.product-card')).toHaveCount(4);
  75  |     expect(errors).toEqual([]);
  76  |   });
  77  | }
  78  | 
  79  | test('catalogue fixture adapter validates inputs, combines filters and sorts', async () => {
  80  |   const invalid = parseCatalogueQuery({ page: '-1', sort: 'popular', category: 'invalid', q: 'x'.repeat(120), color: ['grey', 'beige'] });
  81  |   expect(invalid.page).toBe(1); expect(invalid.sort).toBe('featured'); expect(invalid.category).toBe('invalid'); expect(invalid.q).toHaveLength(100); expect(invalid.color).toBe('');
  82  |   const query = parseCatalogueQuery({ category: 'limestone', color: 'beige', sort: 'name_desc', page: '999999' });
  83  |   const result = await getCatalogue('en', query);
  84  |   expect(result.meta.current_page).toBe(1);
  85  |   expect(result.meta.total).toBe(4);
  86  |   expect(result.data.every(p => p.category === 'limestone' && p.color === 'beige')).toBe(true);
  87  |   expect(result.data.map(p => p.id)).toEqual(['sample-16', 'sample-11', 'sample-6', 'sample-1']);
  88  | });
  89  | 
  90  | test('catalogue width matrix and screenshots in three languages', async ({ page }, info) => {
  91  |   test.skip(info.project.name !== 'desktop', 'Run the complete matrix once.');
  92  |   test.setTimeout(360000);
  93  |   await mkdir('docs/qa/milestone-2', { recursive: true });
  94  |   for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
  95  |     await page.setViewportSize({ width, height: 900 });
  96  |     await page.goto(`/${locale}/products`);
  97  |     await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
  98  |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  99  |     expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  100 |     await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}.png`, scale: 'css' });
  101 |     if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}-full.png`, scale: 'css', fullPage: true });
  102 |   }
  103 | });
  104 | 
  105 | test('catalogue works without client JavaScript', async ({ browser }, info) => {
  106 |   test.skip(info.project.name !== 'desktop', 'Native GET forms covered once.');
  107 |   const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  108 |   const page = await context.newPage();
  109 |   await page.goto('/fr/products');
  110 |   await page.getByRole('searchbox').fill('Marbre');
  111 |   await page.getByRole('search').getByRole('button').click();
  112 |   await expect(page.locator('.product-card')).toHaveCount(4);
  113 |   await page.locator('noscript details').getByText('Filtres', { exact: true }).click();
  114 |   await page.locator('#noscript-color').selectOption('beige');
  115 |   await page.locator('noscript form').getByRole('button', { name: 'Appliquer' }).click();
  116 |   await expect(page).toHaveURL(/color=beige/);
  117 |   await context.close();
  118 | });
  119 | 
```