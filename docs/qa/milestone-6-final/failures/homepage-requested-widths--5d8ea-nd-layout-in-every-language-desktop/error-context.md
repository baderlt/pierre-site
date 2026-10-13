# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> requested widths preserve hero space, typography and layout in every language
- Location: tests\homepage.spec.ts:131:5

# Error details

```
Test timeout of 360000ms exceeded.
```

```
Error: locator.boundingBox: Test timeout of 360000ms exceeded.
Call log:
  - waiting for locator('.hero')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]:
    - heading "Contenu indisponible" [level=1] [ref=e3]
    - paragraph [ref=e4]: Veuillez réessayer.
    - button "Réessayer" [ref=e5] [cursor=pointer]
  - alert [ref=e6]
```

# Test source

```ts
  41  |     expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  42  |     expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  43  |     expect(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute('href')!.slice(1))))).toBe(true);
  44  |     const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
  45  |     expect(resources.every(url => new URL(url).origin === locationOrigin(resources))).toBe(true);
  46  |     expect(resources.some(url => /three|GLTF|fiber/.test(url))).toBe(false);
  47  |     expect(errors).toEqual([]);
  48  |     await visitDeferredSections(page);
  49  |     await mkdir('docs/qa', { recursive: true });
  50  |     await page.screenshot({ path: `docs/qa/home-${locale}-${testInfo.project.name}.png`, scale: 'css', animations: 'disabled' });
  51  |     await page.screenshot({ path: `docs/qa/home-${locale}-${testInfo.project.name}-full.png`, scale: 'css', fullPage: true, animations: 'disabled', style: fullPageStyle });
  52  |   });
  53  | 
  54  |   test(`${locale}: WCAG A/AA automated scan`, async ({ page }) => {
  55  |     await page.goto(`/${locale}`);
  56  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  57  |     expect(results.violations).toEqual([]);
  58  |   });
  59  | 
  60  |   test(`${locale}: material dialog, selection, Escape and focus restoration`, async ({ page }) => {
  61  |     await page.goto(`/${locale}`);
  62  |     const opener = page.getByRole('button', { name: homeContent[locale].hero.preview, exact: true });
  63  |     await opener.click();
  64  |     const dialog = page.getByRole('dialog');
  65  |     await expect(dialog).toBeVisible();
  66  |     const choice=dialog.locator('.material-options button').nth(1);
  67  |     const label=await choice.textContent();
  68  |     await choice.click();
  69  |     await expect(choice).toHaveAttribute('aria-pressed', 'true');
  70  |     await expect(dialog.locator('img')).toHaveAttribute('alt',label!.trim());
  71  |     await page.keyboard.press('Escape');
  72  |     await expect(dialog).not.toBeVisible();
  73  |     await expect(opener).toBeFocused();
  74  |   });
  75  | }
  76  | 
  77  | function locationOrigin(resources: string[]) {
  78  |   return new URL(resources.find(url => url.includes('/_next/')) ?? 'http://127.0.0.1:3000').origin;
  79  | }
  80  | 
  81  | test('language switching preserves query and section and supports all three languages', async ({ page }) => {
  82  |   await page.goto('/fr?preview=1#applications');
  83  |   for (const locale of ['ar', 'en', 'fr'] as const) {
  84  |     await page.locator('select').selectOption(locale);
  85  |     const expectedUrl=`${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/${locale}?preview=1#applications`;
  86  |     await page.waitForURL(expectedUrl,{waitUntil:'domcontentloaded',timeout:60000});
  87  |     expect(page.url()).toBe(expectedUrl);
  88  |     await expect(page.locator('html')).toHaveAttribute('lang', locale);
  89  |     await expect(page.locator('#applications')).toBeInViewport();
  90  |   }
  91  | });
  92  | 
  93  | test('mobile/tablet menu traps focus, navigates and closes with Escape', async ({ page }, testInfo) => {
  94  |   test.skip(testInfo.project.name === 'desktop', 'Desktop uses the visible navigation.');
  95  |   await page.goto('/ar');
  96  |   const opener = page.getByRole('button', { name: homeContent.ar.menu });
  97  |   await opener.click();
  98  |   const dialog = page.getByRole('dialog');
  99  |   await expect(dialog).toBeVisible();
  100 |   await page.keyboard.press('Shift+Tab');
  101 |   expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  102 |   await dialog.getByRole('link', { name: homeContent.ar.nav[2], exact: true }).click();
  103 |   await expect(dialog).not.toBeVisible();
  104 |   await expect(page).toHaveURL(/\/ar\/applications$/);
  105 |   await opener.click();
  106 |   await page.keyboard.press('Escape');
  107 |   await expect(dialog).not.toBeVisible();
  108 |   await expect(opener).toBeFocused();
  109 | });
  110 | 
  111 | test('French redirect, unsupported locale, keyboard skip link and reduced motion', async ({ page, request }) => {
  112 |   const root = await request.get('/', { maxRedirects: 0 });
  113 |   expect(root.status()).toBe(307);
  114 |   expect(root.headers().location).toBe('/fr');
  115 |   expect((await request.get('/de')).status()).toBe(404);
  116 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  117 |   await page.goto('/fr');
  118 |   await page.keyboard.press('Tab');
  119 |   await expect(page.getByRole('link', { name: homeContent.fr.skip })).toBeFocused();
  120 |   await page.keyboard.press('Enter');
  121 |   await expect(page.locator('main')).toBeFocused();
  122 |   expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  123 |   expect(await page.locator('.category-image img').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  124 | });
  125 | 
  126 | test('locale path helper retains nested pages for later milestones', () => {
  127 |   expect(localizedPath('/en/products/sample', 'ar', '?finish=honed', '#details')).toBe('/ar/products/sample?finish=honed#details');
  128 |   expect(localizedPath('/unknown', 'fr')).toBe('/fr');
  129 | });
  130 | 
  131 | test('requested widths preserve hero space, typography and layout in every language', async ({ page }, testInfo) => {
  132 |   test.setTimeout(360000);
  133 |   test.skip(testInfo.project.name !== 'desktop', 'Additional widths are covered once.');
  134 |   for (const locale of locales) {
  135 |     for (const width of [320, 390, 430, 768, 1024, 1280, 1536]) {
  136 |       await page.setViewportSize({ width, height: 900 });
  137 |       await page.goto(`/${locale}`);
  138 |       await page.evaluate(() => document.fonts.ready);
  139 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  140 |       await expect(page.locator('h1')).toBeVisible();
> 141 |       const hero = await page.locator('.hero').boundingBox();
      |                                                ^ Error: locator.boundingBox: Test timeout of 360000ms exceeded.
  142 |       const copy = await page.locator('.hero-copy').boundingBox();
  143 |       const title = await page.locator('h1').boundingBox();
  144 |       const swatches = await page.locator('.material-swatches').boundingBox();
  145 |       expect(hero && copy && title && swatches).toBeTruthy();
  146 |       expect(await page.locator('h1').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  147 |       if (width < 768) {
  148 |         // Keep a clear area below the copy and a separate, usable swatch column.
  149 |         expect(hero!.y + hero!.height - copy!.y - copy!.height).toBeGreaterThanOrEqual(100);
  150 |         expect(locale === 'ar' ? copy!.x >= swatches!.x + swatches!.width : copy!.x + copy!.width <= swatches!.x).toBe(true);
  151 |         expect(title!.height).toBeLessThan(150);
  152 |         expect(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(28);
  153 |       }
  154 |       await page.evaluate(async () => {
  155 |         for (const image of document.images) image.loading = 'eager';
  156 |         await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  157 |       });
  158 |       await visitDeferredSections(page);
  159 |       await mkdir('docs/qa/refinement', { recursive: true });
  160 |       await page.screenshot({ path: `docs/qa/refinement/home-${locale}-${width}.png`, scale: 'css', animations: 'disabled' });
  161 |       if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/refinement/home-${locale}-${width}-full.png`, scale: 'css', fullPage: true, animations: 'disabled', style: fullPageStyle });
  162 |     }
  163 |   }
  164 | });
  165 | 
```