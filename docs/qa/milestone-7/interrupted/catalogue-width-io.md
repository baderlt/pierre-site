# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogue.spec.ts >> catalogue width matrix and screenshots in three languages
- Location: tests\catalogue.spec.ts:99:5

# Error details

```
Error: UNKNOWN: unknown error, open 'C:\Users\DELL 7420\Desktop\time-stone\docs\qa\milestone-2\catalogue-en-1536.png'
```

# Page snapshot

```yaml
- generic [active] [ref=f11e1]:
  - generic [ref=f11e2]:
    - link "Skip to content" [ref=f11e3] [cursor=pointer]:
      - /url: "#main"
    - banner [ref=f11e4]:
      - generic [ref=f11e5]:
        - link "TIME STONE MARBRE & PIERRE" [ref=f11e6] [cursor=pointer]:
          - /url: /en
          - generic [ref=f11e7]:
            - generic [ref=f11e10]: TIME STONE
            - generic [ref=f11e11]: MARBRE & PIERRE
        - navigation "Explore" [ref=f11e12]:
          - link "Home" [ref=f11e13] [cursor=pointer]:
            - /url: /en
          - link "Collection" [ref=f11e14] [cursor=pointer]:
            - /url: /en/products
          - link "Applications" [ref=f11e15] [cursor=pointer]:
            - /url: /en/applications
          - link "About" [ref=f11e16] [cursor=pointer]:
            - /url: /en/about
          - link "Quarry" [ref=f11e17] [cursor=pointer]:
            - /url: /en/about#quarry
          - link "Contact" [ref=f11e18] [cursor=pointer]:
            - /url: /en/contact
        - generic [ref=f11e19]:
          - generic [ref=f11e20]:
            - generic [ref=f11e25]: Choose language
            - combobox "Choose language" [ref=f11e26] [cursor=pointer]:
              - option "Français"
              - option "English" [selected]
              - option "العربية"
          - link "Request a quote" [ref=f11e27] [cursor=pointer]:
            - /url: /en/quote
    - main [ref=f11e31]:
      - region [ref=f11e32]:
        - generic [ref=f11e34]:
          - paragraph [ref=f11e35]: OUR STONES
          - heading "Natural Stone Collection" [level=1] [ref=f11e36]
          - paragraph [ref=f11e37]: Materials, tones and architectural inspiration. An illustrative collection to explore.
          - text: Illustrative image · temporary
      - generic [ref=f11e38]:
        - complementary "Filters" [ref=f11e39]:
          - heading "Categories" [level=2] [ref=f11e40]
          - navigation "Categories" [ref=f11e41]:
            - link "Limestone 4" [ref=f11e42] [cursor=pointer]:
              - /url: /en/products?category=limestone#results
              - text: Limestone
              - generic [ref=f11e43]: "4"
            - link "Marble 5" [ref=f11e44] [cursor=pointer]:
              - /url: /en/products?category=marble#results
              - text: Marble
              - generic [ref=f11e45]: "5"
            - link "Tiles 4" [ref=f11e46] [cursor=pointer]:
              - /url: /en/products?category=tiles#results
              - text: Tiles
              - generic [ref=f11e47]: "4"
            - link "Blocks 3" [ref=f11e48] [cursor=pointer]:
              - /url: /en/products?category=blocks#results
              - text: Blocks
              - generic [ref=f11e49]: "3"
            - link "Custom 3" [ref=f11e50] [cursor=pointer]:
              - /url: /en/products?category=custom#results
              - text: Custom
              - generic [ref=f11e51]: "3"
          - generic [ref=f11e52]:
            - generic [ref=f11e53]: Categories
            - combobox "Categories" [ref=f11e54]:
              - option "All stones" [selected]
              - option "Limestone"
              - option "Marble"
              - option "Tiles"
              - option "Blocks"
              - option "Custom"
            - generic [ref=f11e55]:
              - generic [ref=f11e56]: Stone type
              - combobox "Stone type" [ref=f11e57]:
                - option "All stones" [selected]
                - option "Limestone"
                - option "Marble"
            - generic [ref=f11e58]:
              - generic [ref=f11e59]: Proposed finish
              - combobox "Proposed finish" [ref=f11e60]:
                - option "All stones" [selected]
                - option "Honed"
                - option "Polished"
                - option "Rough"
                - option "Brushed"
            - generic [ref=f11e61]:
              - generic [ref=f11e62]: Illustrative tone
              - combobox "Illustrative tone" [ref=f11e63]:
                - option "All stones" [selected]
                - option "Beige"
                - option "Grey"
                - option "White"
            - generic [ref=f11e64]:
              - generic [ref=f11e65]: Proposed use
              - combobox "Proposed use" [ref=f11e66]:
                - option "All stones" [selected]
                - option "Exterior facades"
                - option "Interior flooring"
                - option "Wall cladding"
                - option "Stairs & steps"
                - option "Landscaping"
                - option "Custom designs"
            - button "Apply" [ref=f11e67] [cursor=pointer]
            - link "Clear all" [ref=f11e68] [cursor=pointer]:
              - /url: /en/products#results
        - region "Natural Stone Collection" [ref=f11e69]:
          - search [ref=f11e71]:
            - generic [ref=f11e72]: Search for stone
            - searchbox "Search for stone" [ref=f11e73]
            - button "Search for stone" [ref=f11e74] [cursor=pointer]: ⌕
          - navigation "Categories" [ref=f11e75]:
            - link "All stones" [ref=f11e76] [cursor=pointer]:
              - /url: /en/products#results
            - link "Limestone" [ref=f11e77] [cursor=pointer]:
              - /url: /en/products?category=limestone#results
            - link "Marble" [ref=f11e78] [cursor=pointer]:
              - /url: /en/products?category=marble#results
            - link "Tiles" [ref=f11e79] [cursor=pointer]:
              - /url: /en/products?category=tiles#results
            - link "Blocks" [ref=f11e80] [cursor=pointer]:
              - /url: /en/products?category=blocks#results
            - link "Custom" [ref=f11e81] [cursor=pointer]:
              - /url: /en/products?category=custom#results
          - generic [ref=f11e82]:
            - paragraph [ref=f11e83]: 19 samples
            - generic [ref=f11e84]:
              - generic [ref=f11e85]: Sort by
              - combobox "Sort by" [ref=f11e86]:
                - option "Featured" [selected]
                - option "Latest samples"
                - option "Name A–Z"
                - option "Name Z–A"
              - button "Apply" [ref=f11e87] [cursor=pointer]
          - navigation "Filters"
          - paragraph [ref=f11e88]: "Temporary samples: images and filter associations are illustrative. Products, finishes and specifications require confirmation. No stock availability is claimed."
          - generic [ref=f11e89]:
            - article [ref=f11e90]:
              - 'link "View sample : Limestone · 01" [ref=f11e91] [cursor=pointer]':
                - /url: /en/products/sample-1
                - generic [ref=f11e92]:
                  - img "Temporary illustration" [ref=f11e93]
                  - generic [ref=f11e94]: Illustrative sample
                - generic [ref=f11e95]:
                  - heading "Limestone · 01" [level=2] [ref=f11e96]
                  - paragraph [ref=f11e97]: Limestone
                  - generic [aria-hidden] [ref=f11e98]: →
            - article [ref=f11e99]:
              - 'link "View sample : Marble · 02" [ref=f11e100] [cursor=pointer]':
                - /url: /en/products/sample-2
                - generic [ref=f11e101]:
                  - img "Temporary illustration" [ref=f11e102]
                  - generic [ref=f11e103]: Illustrative sample
                - generic [ref=f11e104]:
                  - heading "Marble · 02" [level=2] [ref=f11e105]
                  - paragraph [ref=f11e106]: Marble
                  - generic [aria-hidden] [ref=f11e107]: →
            - article [ref=f11e108]:
              - 'link "View sample : Tiles · 03" [ref=f11e109] [cursor=pointer]':
                - /url: /en/products/sample-3
                - generic [ref=f11e110]:
                  - img "Temporary illustration" [ref=f11e111]
                  - generic [ref=f11e112]: Illustrative sample
                - generic [ref=f11e113]:
                  - heading "Tiles · 03" [level=2] [ref=f11e114]
                  - paragraph [ref=f11e115]: Tiles
                  - generic [aria-hidden] [ref=f11e116]: →
            - article [ref=f11e117]:
              - 'link "View sample : piere grie taza" [ref=f11e118] [cursor=pointer]':
                - /url: /en/products/piere-grie
                - img "piere grie taza" [ref=f11e120]
                - generic [ref=f11e121]:
                  - heading "piere grie taza" [level=2] [ref=f11e122]
                  - paragraph [ref=f11e123]: Marble
                  - generic [aria-hidden] [ref=f11e124]: →
            - article [ref=f11e125]:
              - 'link "View sample : Blocks · 04" [ref=f11e126] [cursor=pointer]':
                - /url: /en/products/sample-4
                - generic [ref=f11e127]:
                  - img "Temporary illustration" [ref=f11e128]
                  - generic [ref=f11e129]: Illustrative sample
                - generic [ref=f11e130]:
                  - heading "Blocks · 04" [level=2] [ref=f11e131]
                  - paragraph [ref=f11e132]: Blocks
                  - generic [aria-hidden] [ref=f11e133]: →
            - article [ref=f11e134]:
              - 'link "View sample : Custom · 05" [ref=f11e135] [cursor=pointer]':
                - /url: /en/products/sample-5
                - generic [ref=f11e136]:
                  - img "Temporary illustration" [ref=f11e137]
                  - generic [ref=f11e138]: Illustrative sample
                - generic [ref=f11e139]:
                  - heading "Custom · 05" [level=2] [ref=f11e140]
                  - paragraph [ref=f11e141]: Custom
                  - generic [aria-hidden] [ref=f11e142]: →
            - article [ref=f11e143]:
              - 'link "View sample : Limestone · 06" [ref=f11e144] [cursor=pointer]':
                - /url: /en/products/sample-6
                - generic [ref=f11e145]:
                  - img "Temporary illustration" [ref=f11e146]
                  - generic [ref=f11e147]: Illustrative sample
                - generic [ref=f11e148]:
                  - heading "Limestone · 06" [level=2] [ref=f11e149]
                  - paragraph [ref=f11e150]: Limestone
                  - generic [aria-hidden] [ref=f11e151]: →
            - article [ref=f11e152]:
              - 'link "View sample : Marble · 07" [ref=f11e153] [cursor=pointer]':
                - /url: /en/products/sample-7
                - generic [ref=f11e154]:
                  - img "Temporary illustration" [ref=f11e155]
                  - generic [ref=f11e156]: Illustrative sample
                - generic [ref=f11e157]:
                  - heading "Marble · 07" [level=2] [ref=f11e158]
                  - paragraph [ref=f11e159]: Marble
                  - generic [aria-hidden] [ref=f11e160]: →
            - article [ref=f11e161]:
              - 'link "View sample : Tiles · 08" [ref=f11e162] [cursor=pointer]':
                - /url: /en/products/sample-8
                - generic [ref=f11e163]:
                  - img "Temporary illustration" [ref=f11e164]
                  - generic [ref=f11e165]: Illustrative sample
                - generic [ref=f11e166]:
                  - heading "Tiles · 08" [level=2] [ref=f11e167]
                  - paragraph [ref=f11e168]: Tiles
                  - generic [aria-hidden] [ref=f11e169]: →
            - article [ref=f11e170]:
              - 'link "View sample : Blocks · 09" [ref=f11e171] [cursor=pointer]':
                - /url: /en/products/sample-9
                - generic [ref=f11e172]:
                  - img "Temporary illustration" [ref=f11e173]
                  - generic [ref=f11e174]: Illustrative sample
                - generic [ref=f11e175]:
                  - heading "Blocks · 09" [level=2] [ref=f11e176]
                  - paragraph [ref=f11e177]: Blocks
                  - generic [aria-hidden] [ref=f11e178]: →
            - article [ref=f11e179]:
              - 'link "View sample : Custom · 10" [ref=f11e180] [cursor=pointer]':
                - /url: /en/products/sample-10
                - generic [ref=f11e181]:
                  - img "Temporary illustration" [ref=f11e182]
                  - generic [ref=f11e183]: Illustrative sample
                - generic [ref=f11e184]:
                  - heading "Custom · 10" [level=2] [ref=f11e185]
                  - paragraph [ref=f11e186]: Custom
                  - generic [aria-hidden] [ref=f11e187]: →
            - article [ref=f11e188]:
              - 'link "View sample : Limestone · 11" [ref=f11e189] [cursor=pointer]':
                - /url: /en/products/sample-11
                - generic [ref=f11e190]:
                  - img "Temporary illustration" [ref=f11e191]
                  - generic [ref=f11e192]: Illustrative sample
                - generic [ref=f11e193]:
                  - heading "Limestone · 11" [level=2] [ref=f11e194]
                  - paragraph [ref=f11e195]: Limestone
                  - generic [aria-hidden] [ref=f11e196]: →
          - navigation "Page" [ref=f11e197]:
            - generic [ref=f11e198]:
              - text: Page
              - generic [ref=f11e199]: 1 / 2
            - link "Next" [ref=f11e200] [cursor=pointer]:
              - /url: /en/products?page=2#results
      - generic [ref=f11e203]:
        - heading "Need a Custom Solution?" [level=2] [ref=f11e204]
        - paragraph [ref=f11e205]: Explore the possibilities of stone for your project. Actual formats and finishes remain to be confirmed.
        - link "Prepare your project" [ref=f11e206] [cursor=pointer]:
          - /url: /en/quote
          - text: Prepare your project
          - generic [aria-hidden] [ref=f11e207]: →
      - generic [ref=f11e208]:
        - figure "The material Illustrative sample" [ref=f11e209]:
          - generic [ref=f11e211]:
            - text: The material
            - generic [ref=f11e212]: Illustrative sample
        - figure "The formats Illustrative sample" [ref=f11e213]:
          - generic [ref=f11e215]:
            - text: The formats
            - generic [ref=f11e216]: Illustrative sample
        - figure "Your space Illustrative sample" [ref=f11e217]:
          - generic [ref=f11e219]:
            - text: Your space
            - generic [ref=f11e220]: Illustrative sample
    - contentinfo [ref=f11e221]:
      - generic [ref=f11e222]:
        - generic [ref=f11e223]:
          - generic [ref=f11e226]: TIME STONE
          - generic [ref=f11e227]: MARBRE & PIERRE
        - paragraph [ref=f11e228]: "Temporary samples: images and filter associations are illustrative. Products, finishes and specifications require confirmation. No stock availability is claimed."
        - link "Home" [ref=f11e229] [cursor=pointer]:
          - /url: /en
  - alert [ref=f11e230]
```

# Test source

```ts
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
  36  |     await expect(page.locator('.product-card')).toHaveCount(firstCount);
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
> 109 |     await page.screenshot({ path: `docs/qa/milestone-2/catalogue-${locale}-${width}.png`, scale: 'css' });
      |     ^ Error: UNKNOWN: unknown error, open 'C:\Users\DELL 7420\Desktop\time-stone\docs\qa\milestone-2\catalogue-en-1536.png'
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