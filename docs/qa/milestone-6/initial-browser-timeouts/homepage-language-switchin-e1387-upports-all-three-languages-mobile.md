# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> language switching preserves query and section and supports all three languages
- Location: tests\homepage.spec.ts:81:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://127.0.0.1:3001/en?preview=1#applications"
Received: ""
Timeout:  20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    - waiting for "http://127.0.0.1:3001/en?preview=1" navigation to finish...

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - link "Skip to content" [ref=f2e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f2e3]:
    - generic [ref=f2e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=f2e5] [cursor=pointer]:
        - /url: /en
        - generic [ref=f2e6]:
          - generic [ref=f2e9]: TIME STONE
          - generic [ref=f2e10]: MARBRE & PIERRE
      - generic [ref=f2e11]:
        - generic [ref=f2e12]:
          - generic [ref=f2e17]: Choose language
          - combobox "Choose language" [ref=f2e18] [cursor=pointer]:
            - option "Français"
            - option "English" [selected]
            - option "العربية"
        - button "Open menu" [ref=f2e19] [cursor=pointer]
  - main [ref=f2e22]:
    - region [ref=f2e23]:
      - generic [ref=f2e27]:
        - paragraph [ref=f2e28]: NATURAL STONE · MOROCCO
        - heading "Timeless Stone for Modern Architecture" [level=1] [ref=f2e29]
        - paragraph [ref=f2e30]: Distinctive textures. Natural tones. Imagine a new place for stone in your next architectural project.
        - generic [ref=f2e31]:
          - link "Demander un devis" [ref=f2e32] [cursor=pointer]:
            - /url: "#collection"
          - generic "A closer look at the material" [ref=f2e36]:
            - 'button "Selected material : Limestone · 01" [ref=f2e37] [cursor=pointer]'
            - 'button "Selected material : Marble · 02" [ref=f2e38] [cursor=pointer]'
            - 'button "Selected material : Tiles · 03" [ref=f2e39] [cursor=pointer]'
          - button "Explore the materials" [ref=f2e40] [cursor=pointer]
      - generic [ref=f2e43]:
        - link "Discover" [ref=f2e44] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=f2e46]: Illustrative image · temporary
    - region "NATURAL STONE · MOROCCO" [ref=f2e47]:
      - generic [ref=f2e48]:
        - generic [ref=f2e53]:
          - heading "Natural stone" [level=2] [ref=f2e54]
          - paragraph [ref=f2e55]: It begins with the material
        - generic [ref=f2e60]:
          - heading "Tones & textures" [level=2] [ref=f2e61]
          - paragraph [ref=f2e62]: Individual character
        - generic [ref=f2e67]:
          - heading "Explore the formats" [level=2] [ref=f2e68]
          - paragraph [ref=f2e69]: Slabs, blocks and tiles
        - generic [ref=f2e74]:
          - heading "Ideas for spaces" [level=2] [ref=f2e75]
          - paragraph [ref=f2e76]: Indoors and outdoors
        - generic [ref=f2e81]:
          - heading "Your project" [level=2] [ref=f2e82]
          - paragraph [ref=f2e83]: Define your requirements
        - generic [ref=f2e88]:
          - heading "A direct conversation" [level=2] [ref=f2e89]
          - paragraph [ref=f2e90]: Contacts to be confirmed
    - region [ref=f2e91]:
      - generic [ref=f2e92]:
        - generic [ref=f2e93]:
          - paragraph [ref=f2e94]: OUR COLLECTION
          - heading "Explore Our Natural Stone" [level=2] [ref=f2e95]
          - paragraph [ref=f2e96]: Limestone, marble and architectural formats. A first encounter with the possibilities of stone.
        - link "Discover the selections" [ref=f2e97] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=f2e100]:
        - link [ref=f2e101] [cursor=pointer]:
          - /url: /en/products?category=limestone
          - img "Limestone" [ref=f2e103]
          - generic [ref=f2e105]:
            - heading "Limestone" [level=3] [ref=f2e106]
            - paragraph [ref=f2e107]: Illustrative collection
        - link [ref=f2e111] [cursor=pointer]:
          - /url: /en/products?category=marble
          - img "Marble" [ref=f2e113]
          - generic [ref=f2e115]:
            - heading "Marble" [level=3] [ref=f2e116]
            - paragraph [ref=f2e117]: Illustrative collection
        - link [ref=f2e121] [cursor=pointer]:
          - /url: /en/products?category=tiles
          - img "Tiles" [ref=f2e123]
          - generic [ref=f2e125]:
            - heading "Tiles" [level=3] [ref=f2e126]
            - paragraph [ref=f2e127]: Illustrative collection
        - link [ref=f2e131] [cursor=pointer]:
          - /url: /en/products?category=blocks
          - img "Blocks" [ref=f2e133]
          - generic [ref=f2e135]:
            - heading "Blocks" [level=3] [ref=f2e136]
            - paragraph [ref=f2e137]: Illustrative collection
        - link [ref=f2e141] [cursor=pointer]:
          - /url: /en/products?category=custom
          - img "Custom" [ref=f2e143]
          - generic [ref=f2e145]:
            - heading "Custom" [level=3] [ref=f2e146]
            - paragraph [ref=f2e147]: Illustrative collection
    - region [ref=f2e151]:
      - generic [ref=f2e152]:
        - img "Quarry illustration · location unverified" [ref=f2e153]
        - generic [ref=f2e154]: Quarry illustration · location unverified
      - generic [ref=f2e155]:
        - paragraph [ref=f2e156]: FROM QUARRY TO MATERIAL
        - heading "A story shaped by stone" [level=2] [ref=f2e157]
        - paragraph [ref=f2e158]: Raw material, skilled hands, transformation. A visual introduction to the world of stone while TIME STONE’s own images and story are prepared.
        - link "Discover the craft" [ref=f2e159] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=f2e162]:
          - generic [ref=f2e163]: Selecting the material
          - generic [ref=f2e167]: Cutting & proportion
          - generic [ref=f2e171]: Finishing the surface
    - generic [ref=f2e175]:
      - generic [ref=f2e176]:
        - paragraph [ref=f2e177]: THE SPIRIT OF TIME STONE
        - heading "Natural material. Architectural possibility." [level=2] [ref=f2e178]
        - paragraph [ref=f2e179]: "A showroom designed to bring stone closer to your project: explore textures, compare formats and prepare a conversation around what you need."
        - link "Imagine your space" [ref=f2e180] [cursor=pointer]:
          - /url: "#applications"
      - figure "Illustrative image · temporary" [ref=f2e183]:
        - img "Exterior façades" [ref=f2e184]
    - generic [ref=f2e187]:
      - generic [ref=f2e189]:
        - paragraph [ref=f2e190]: MATERIAL STUDIES
        - heading "Beauty is in the detail" [level=2] [ref=f2e191]
        - paragraph [ref=f2e192]: Three visual inspirations. Actual products, finishes and dimensions will be confirmed with TIME STONE.
      - generic [ref=f2e193]:
        - article [ref=f2e194]:
          - generic [ref=f2e195]:
            - img "Temporary illustration" [ref=f2e196]
            - generic [ref=f2e197]: PRESENTATION SAMPLE
          - generic [ref=f2e198]:
            - paragraph [ref=f2e199]: limestone
            - heading [level=3] [ref=f2e200]:
              - link "Limestone · 01" [ref=f2e201] [cursor=pointer]:
                - /url: /en/products/sample-1
        - article [ref=f2e202]:
          - generic [ref=f2e203]:
            - img "Temporary illustration" [ref=f2e204]
            - generic [ref=f2e205]: PRESENTATION SAMPLE
          - generic [ref=f2e206]:
            - paragraph [ref=f2e207]: marble
            - heading [level=3] [ref=f2e208]:
              - link "Marble · 02" [ref=f2e209] [cursor=pointer]:
                - /url: /en/products/sample-2
        - article [ref=f2e210]:
          - generic [ref=f2e211]:
            - img "Temporary illustration" [ref=f2e212]
            - generic [ref=f2e213]: PRESENTATION SAMPLE
          - generic [ref=f2e214]:
            - paragraph [ref=f2e215]: tiles
            - heading [level=3] [ref=f2e216]:
              - link "Tiles · 03" [ref=f2e217] [cursor=pointer]:
                - /url: /en/products/sample-3
    - generic [ref=f2e218]:
      - generic [ref=f2e219]:
        - paragraph [ref=f2e220]: THE CRAFT
        - heading "From block to space" [level=2] [ref=f2e221]
        - paragraph [ref=f2e222]: An illustrative look at the stages of transformation. The actual process and available finishes remain to be documented.
      - list [ref=f2e223]:
        - listitem [ref=f2e224]:
          - generic [ref=f2e225]: "01"
          - heading "Selecting the material" [level=3] [ref=f2e226]
        - listitem [ref=f2e229]:
          - generic [ref=f2e230]: "02"
          - heading "Cutting & proportion" [level=3] [ref=f2e231]
        - listitem [ref=f2e234]:
          - generic [ref=f2e235]: "03"
          - heading "Finishing the surface" [level=3] [ref=f2e236]
        - listitem [ref=f2e239]:
          - generic [ref=f2e240]: "04"
          - heading "The architectural detail" [level=3] [ref=f2e241]
    - generic [ref=f2e244]:
      - generic [ref=f2e246]:
        - paragraph [ref=f2e247]: APPLICATIONS
        - heading "Stone for Every Space" [level=2] [ref=f2e248]
        - paragraph [ref=f2e249]: Architectural inspiration to help you imagine your project.
      - generic [ref=f2e250]:
        - link [ref=f2e251] [cursor=pointer]:
          - /url: /en/applications/exterior-facades
          - img "Exterior facades" [ref=f2e252]
          - generic [ref=f2e253]: Exterior facades
        - link [ref=f2e256] [cursor=pointer]:
          - /url: /en/applications/interior-flooring
          - img "Interior flooring" [ref=f2e257]
          - generic [ref=f2e258]: Interior flooring
        - link [ref=f2e261] [cursor=pointer]:
          - /url: /en/applications/wall-cladding
          - img "Wall cladding" [ref=f2e262]
          - generic [ref=f2e263]: Wall cladding
        - link [ref=f2e266] [cursor=pointer]:
          - /url: /en/applications/stairs
          - img "Stairs & steps" [ref=f2e267]
          - generic [ref=f2e268]: Stairs & steps
      - paragraph [ref=f2e271]: Illustrative image · temporary
    - generic [ref=f2e273]:
      - generic [ref=f2e274]:
        - paragraph [ref=f2e275]: AN INFORMED CHOICE
        - heading "Every project starts with the right questions." [level=2] [ref=f2e276]
        - paragraph [ref=f2e277]: Use, finish and dimensions guide the selection. Technical characteristics will be published after verification.
      - list [ref=f2e278]:
        - listitem [ref=f2e279]:
          - generic [ref=f2e280]: "01"
          - text: How will the stone be used?
        - listitem [ref=f2e281]:
          - generic [ref=f2e282]: "02"
          - text: Which finish suits your space?
        - listitem [ref=f2e283]:
          - generic [ref=f2e284]: "03"
          - text: What dimensions does your project need?
    - region [ref=f2e285]:
      - paragraph [ref=f2e286]: LET’S BUILD WHAT’S NEXT
      - heading "Your project starts here." [level=2] [ref=f2e287]
      - paragraph [ref=f2e288]: An idea, a material, a particular requirement. Gather your dimensions, quantities and delivery location for a future quotation request.
      - paragraph [ref=f2e293]: The quotation form and official contact details will be available after confirmation. This presentation does not send any requests.
  - complementary "PRESENTATION SAMPLE" [ref=f2e294]:
    - paragraph [ref=f2e298]: "Temporary presentation: illustrative images and draft content. No project or product shown is a confirmed commercial reference."
  - contentinfo [ref=f2e299]:
    - generic [ref=f2e300]:
      - generic [ref=f2e301]:
        - link "TIME STONE MARBRE & PIERRE" [ref=f2e302] [cursor=pointer]:
          - /url: /en
          - generic [ref=f2e303]:
            - generic [ref=f2e306]: TIME STONE
            - generic [ref=f2e307]: MARBRE & PIERRE
        - paragraph [ref=f2e308]: Material. Time. Architecture.
      - generic [ref=f2e309]:
        - heading "Explore" [level=2] [ref=f2e310]
        - navigation "Explore" [ref=f2e311]:
          - link "Home" [ref=f2e312] [cursor=pointer]:
            - /url: "#home"
          - link "Collection" [ref=f2e313] [cursor=pointer]:
            - /url: "#collection"
          - link "Applications" [ref=f2e314] [cursor=pointer]:
            - /url: "#applications"
          - link "About" [ref=f2e315] [cursor=pointer]:
            - /url: "#about"
          - link "Quarry" [ref=f2e316] [cursor=pointer]:
            - /url: "#quarry"
          - link "Contact" [ref=f2e317] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=f2e318]:
        - heading "Materials" [level=2] [ref=f2e319]
        - navigation "Materials" [ref=f2e320]:
          - link "Limestone" [ref=f2e321] [cursor=pointer]:
            - /url: /en/products?category=limestone
          - link "Marble" [ref=f2e322] [cursor=pointer]:
            - /url: /en/products?category=marble
          - link "Tiles" [ref=f2e323] [cursor=pointer]:
            - /url: /en/products?category=tiles
          - link "Blocks" [ref=f2e324] [cursor=pointer]:
            - /url: /en/products?category=blocks
          - link "Custom" [ref=f2e325] [cursor=pointer]:
            - /url: /en/products?category=custom
      - generic [ref=f2e326]:
        - heading "Languages" [level=2] [ref=f2e327]
        - navigation "Languages" [ref=f2e328]:
          - link "Français" [ref=f2e329] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=f2e330] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=f2e331] [cursor=pointer]:
            - /url: /ar
    - generic [ref=f2e332]:
      - paragraph [ref=f2e333]: TIME STONE · Development presentation
      - paragraph [ref=f2e334]: Temporary imagery from the approved mockups. Commercial information awaits confirmation.
  - alert [ref=f2e335]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | import { mkdir } from 'node:fs/promises';
  4   | import { homeContent } from '../apps/web/src/lib/home-content';
  5   | import { locales, localizedPath } from '../apps/web/src/lib/locales';
  6   | 
  7   | const fullPageStyle = '#materials, #craft, #applications, #contact { content-visibility: visible; contain-intrinsic-size: none; }';
  8   | 
  9   | async function visitDeferredSections(page: Page) {
  10  |   for (const id of ['materials', 'craft', 'applications', 'contact']) {
  11  |     await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  12  |     await expect(page.locator(`#${id} h2`)).toBeInViewport();
  13  |     await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  14  |   }
  15  |   await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  16  |   await expect(page.locator('.site-header')).toHaveAttribute('data-scrolled', 'false');
  17  | }
  18  | 
  19  | for (const locale of locales) {
  20  |   test(`${locale}: responsive homepage, semantics, local assets and screenshot`, async ({ page }, testInfo) => {
  21  |     const errors: string[] = [];
  22  |     page.on('pageerror', error => errors.push(error.message));
  23  |     const response = await page.goto(`/${locale}`);
  24  |     expect(response?.status()).toBe(200);
  25  |     await expect(page.locator('html')).toHaveAttribute('lang', locale);
  26  |     await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  27  |     await expect(page).toHaveTitle(homeContent[locale].meta.title);
  28  |     await expect(page.locator('h1')).toHaveCount(1);
  29  |     await expect(page.locator('#contact')).toContainText(homeContent[locale].contact.status);
  30  |     expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  31  |     await page.evaluate(() => document.fonts.ready);
  32  |     expect(await page.locator('body').evaluate(element => getComputedStyle(element).fontFamily.split(',')[0])).not.toMatch(/Arial|Georgia/);
  33  |     const fontResources = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.name.includes('.woff2')).length);
  34  |     expect(fontResources).toBeGreaterThanOrEqual(2);
  35  |     // Reveal lazy images before capturing a complete, stable page.
  36  |     await page.evaluate(async () => {
  37  |       for (const image of document.images) image.loading = 'eager';
  38  |       await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  39  |     });
  40  |     const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
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
> 85  |     const expectedUrl=`${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/${locale}?preview=1#applications`;
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  141 |       const hero = await page.locator('.hero').boundingBox();
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