# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogue.spec.ts >> en: catalogue SSR, accessible controls, navigation and samples
- Location: tests\catalogue.spec.ts:8:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.product-card')
Expected: 12
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
- generic [active] [ref=f3e1]:
  - alert [ref=f3e2]:
    - heading "Content unavailable" [level=1] [ref=f3e3]
    - paragraph [ref=f3e4]: Please retry.
    - button "Retry" [ref=f3e5] [cursor=pointer]
  - alert [ref=f3e6]
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
  10  |     const apiOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
  11  |     const live=async(query='')=>{const response=await request.get(`${apiOrigin}/api/v1/products?locale=${locale}&per_page=12${query}`);expect(response.ok()).toBe(true);return response.json();};
  12  |     const firstPage=await live(),secondPage=await live('&page=2');
  13  |     expect(firstPage.meta.total,'Pagination regression requires at least two pages of published QA content').toBeGreaterThan(12);
  14  |     const firstCount=firstPage.data.length,secondCount=secondPage.data.length;
  15  |     const marble=await live('&category=marble&sort=name_desc'),beige=await live('&color=beige&sort=name_desc');
  16  |     expect(marble.data.length).toBeGreaterThan(0);expect(beige.data.length).toBeGreaterThan(0);
  17  | 
  18  |     const errors: string[] = [];
  19  |     page.on('pageerror', error => errors.push(error.message));
  20  |     const html = await request.get(`/${locale}/products`);
  21  |     expect(html.status()).toBe(200);
  22  |     expect(await html.text()).toContain(c.title);
  23  |     await page.goto(`/${locale}/products`);
  24  |     await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  25  |     await expect(page.locator('.product-card')).toHaveCount(firstCount);
  26  |     await expect(page.locator('.catalogue-pagination bdi')).toHaveAttribute('dir', 'ltr');
  27  |     await expect(page.locator('h1')).toHaveText(c.title);
  28  |     const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  29  |     expect(accessibility.violations).toEqual([]);
  30  |     await page.locator('a[rel="next"]').click();
  31  |     await expect(page.locator('.product-card')).toHaveCount(secondCount);
  32  |     await expect(page).toHaveURL(/page=2/);
  33  |     await page.reload();
  34  |     await expect(page.locator('.product-card')).toHaveCount(secondCount);
  35  |     await page.goBack();
> 36  |     await expect(page.locator('.product-card')).toHaveCount(firstCount);
      |                                                 ^ Error: expect(locator).toHaveCount(expected) failed
  37  |     await page.goForward();
  38  |     await expect(page.locator('.product-card')).toHaveCount(secondCount);
  39  |     await page.locator('.product-card a').first().click();
  40  |     await expect(page).toHaveURL(new RegExp('/products/'+secondPage.data[0].slug+'\\?page=2'));
  41  |     await expect(page.locator('.product-gallery')).toBeVisible();
  42  |     await page.locator('.product-back').click();
  43  |     await expect(page).toHaveURL(/\/products\?page=2#results/);
  44  |     await expect(page.locator('.product-card')).toHaveCount(secondCount);
  45  |     await page.goto(`/${locale}/products?category=marble&sort=name_desc`);
  46  |     await expect(page.locator('.product-card')).toHaveCount(marble.data.length);
  47  |     await page.locator('select[aria-label]').selectOption(locale === 'ar' ? 'fr' : 'ar');
  48  |     await expect(page).toHaveURL(/\/products\?category=marble&sort=name_desc/);
  49  |     await page.goto(`/${locale}/products?color=beige`);
  50  |     await page.locator('#catalogue-sort').selectOption('name_desc');
  51  |     await page.locator('.catalogue-sort button').click();
  52  |     await expect(page).toHaveURL(/sort=name_desc/);
  53  |     await expect(page).toHaveURL(/color=beige/);
  54  |     await expect(page.locator('.product-card')).toHaveCount(beige.data.length);
  55  |     if (info.project.name !== 'desktop') {
  56  |       await page.goto(`/${locale}/products`);
  57  |       const opener = page.locator('.filter-toggle');
  58  |       await opener.click();
  59  |       const drawer = page.locator('.catalogue-drawer');
  60  |       await expect(drawer).toBeVisible();
  61  |       await page.keyboard.press('Shift+Tab');
  62  |       expect(await drawer.evaluate(element => element.contains(document.activeElement))).toBe(true);
  63  |       await drawer.locator('select[name="color"]').selectOption('beige');
  64  |       await page.keyboard.press('Escape');
  65  |       await expect(opener).toBeFocused();
  66  |       await expect(page).not.toHaveURL(/color=/);
  67  |       await opener.click();
  68  |       await drawer.getByRole('button', { name: c.apply, exact: true }).click();
  69  |       await expect(page).toHaveURL(/color=beige/);
  70  |       await page.reload();
  71  |       await opener.click();
  72  |       await expect(drawer.locator('select[name="color"]')).toHaveValue('beige');
  73  |       await drawer.getByRole('link', { name: c.clear, exact: true }).click();
  74  |       await expect(page.locator('.product-card')).toHaveCount(firstCount);
  75  |       await expect(page).not.toHaveURL(/color=/);
  76  |     }
  77  |     await page.goto(`/${locale}/products?q=zzzznomatch`);
  78  |     await expect(page.locator('.catalogue-empty')).toContainText(c.empty);
  79  |     await page.goto(`/${locale}/products`);
  80  |     const search=firstPage.data[0].name;const searchResult=await live('&q='+encodeURIComponent(search));expect(searchResult.data.some((p:{slug:string})=>p.slug===firstPage.data[0].slug)).toBe(true);await page.getByRole('searchbox').fill(search);
  81  |     await page.getByRole('search').getByRole('button').click();
  82  |     await expect(page.locator('.product-card')).toHaveCount(searchResult.data.length);
  83  |     expect(await page.locator('.product-card h2').allTextContents()).toEqual(searchResult.data.map((p:{name:string})=>p.name));
  84  |     expect(errors).toEqual([]);
  85  |   });
  86  | }
  87  | 
  88  | test('catalogue fixture adapter validates inputs, combines filters and sorts', async () => {
  89  |   const invalid = parseCatalogueQuery({ page: '-1', sort: 'popular', category: 'invalid', q: 'x'.repeat(120), color: ['grey', 'beige'] });
  90  |   expect(invalid.page).toBe(1); expect(invalid.sort).toBe('featured'); expect(invalid.category).toBe('invalid'); expect(invalid.q).toHaveLength(100); expect(invalid.color).toBe('');
  91  |   const query = parseCatalogueQuery({ category: 'limestone', color: 'beige', sort: 'name_desc', page: '999999' });
  92  |   const result = await getCatalogue('en', query);
  93  |   expect(result.meta.current_page).toBe(1);
  94  |   expect(result.meta.total).toBe(4);
  95  |   expect(result.data.every(p => p.category === 'limestone' && p.color === 'beige')).toBe(true);
  96  |   expect(result.data.map(p => p.id)).toEqual(['sample-16', 'sample-11', 'sample-6', 'sample-1']);
  97  | });
  98  | 
  99  | test('catalogue width matrix and screenshots in three languages', async ({ page }, info) => {
  100 |   test.skip(info.project.name !== 'desktop', 'Run the complete matrix once.');
  101 |   test.setTimeout(360000);
  102 |   await mkdir('docs/qa/milestone-2', { recursive: true });
  103 |   for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
  104 |     await page.setViewportSize({ width, height: 900 });
  105 |     await page.goto(`/${locale}/products`);
  106 |     await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
  107 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  108 |     expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  109 |     await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}.png`, scale: 'css' });
  110 |     if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}-full.png`, scale: 'css', fullPage: true });
  111 |   }
  112 | });
  113 | 
  114 | test('catalogue works without client JavaScript', async ({ browser }, info) => {
  115 |   test.skip(info.project.name !== 'desktop', 'Native GET forms covered once.');
  116 |   const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  117 |   const page = await context.newPage();
  118 |   await page.goto('/fr/products');
  119 |   await page.getByRole('searchbox').fill('Marbre');
  120 |   await page.getByRole('search').getByRole('button').click();
  121 |   await expect(page.locator('.product-card')).toHaveCount(4);
  122 |   await page.locator('noscript details').getByText('Filtres', { exact: true }).click();
  123 |   await page.locator('#noscript-color').selectOption('beige');
  124 |   await page.locator('noscript form').getByRole('button', { name: 'Appliquer' }).click();
  125 |   await expect(page).toHaveURL(/color=beige/);
  126 |   await context.close();
  127 | });
  128 | 
```