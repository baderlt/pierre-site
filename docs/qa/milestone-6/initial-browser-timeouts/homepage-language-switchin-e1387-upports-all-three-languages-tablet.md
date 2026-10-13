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

Expected: "http://127.0.0.1:3001/fr?preview=1#applications"
Received: ""
Timeout:  20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    - waiting for "http://127.0.0.1:3001/fr?preview=1" navigation to finish...

```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - link "Aller au contenu" [ref=f3e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f3e3]:
    - generic [ref=f3e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=f3e5] [cursor=pointer]:
        - /url: /fr
        - generic [ref=f3e6]:
          - generic [ref=f3e9]: TIME STONE
          - generic [ref=f3e10]: MARBRE & PIERRE
      - generic [ref=f3e11]:
        - generic [ref=f3e12]:
          - generic [ref=f3e17]: Choisir la langue
          - combobox "Choisir la langue" [ref=f3e18] [cursor=pointer]:
            - option "Français" [selected]
            - option "English"
            - option "العربية"
        - button "Ouvrir le menu" [ref=f3e19] [cursor=pointer]
  - main [ref=f3e22]:
    - region [ref=f3e23]:
      - generic [ref=f3e27]:
        - paragraph [ref=f3e28]: PIERRE NATURELLE · MAROC
        - heading "La pierre intemporelle. L’architecture de demain." [level=1] [ref=f3e29]
        - paragraph [ref=f3e30]: Des textures singulières, des nuances naturelles. Imaginez une nouvelle place pour la pierre dans votre projet.
        - generic [ref=f3e31]:
          - link "Demander un devis" [ref=f3e32] [cursor=pointer]:
            - /url: "#collection"
          - generic "Une première rencontre avec la matière" [ref=f3e36]:
            - 'button "Matière sélectionnée : Calcaire · 01" [ref=f3e37] [cursor=pointer]'
            - 'button "Matière sélectionnée : Marbre · 02" [ref=f3e38] [cursor=pointer]'
            - 'button "Matière sélectionnée : Carreaux · 03" [ref=f3e39] [cursor=pointer]'
          - button "Voir les matières" [ref=f3e40] [cursor=pointer]
      - generic [ref=f3e43]:
        - link "Découvrir" [ref=f3e44] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=f3e46]: Visuel illustratif · provisoire
    - region "PIERRE NATURELLE · MAROC" [ref=f3e47]:
      - generic [ref=f3e48]:
        - generic [ref=f3e53]:
          - heading "Pierre naturelle" [level=2] [ref=f3e54]
          - paragraph [ref=f3e55]: La matière à l’origine
        - generic [ref=f3e60]:
          - heading "Nuances & textures" [level=2] [ref=f3e61]
          - paragraph [ref=f3e62]: Un caractère singulier
        - generic [ref=f3e67]:
          - heading "Formats à explorer" [level=2] [ref=f3e68]
          - paragraph [ref=f3e69]: Dalles, blocs et carreaux
        - generic [ref=f3e74]:
          - heading "Idées d’espaces" [level=2] [ref=f3e75]
          - paragraph [ref=f3e76]: Intérieur et extérieur
        - generic [ref=f3e81]:
          - heading "Votre projet" [level=2] [ref=f3e82]
          - paragraph [ref=f3e83]: Des besoins à préciser
        - generic [ref=f3e88]:
          - heading "Un échange direct" [level=2] [ref=f3e89]
          - paragraph [ref=f3e90]: Des contacts à confirmer
    - region [ref=f3e91]:
      - generic [ref=f3e92]:
        - generic [ref=f3e93]:
          - paragraph [ref=f3e94]: NOTRE COLLECTION
          - heading "Explorez la pierre naturelle" [level=2] [ref=f3e95]
          - paragraph [ref=f3e96]: "Calcaire, marbre et formats architecturaux : une première découverte de la matière."
        - link "Découvrir les sélections" [ref=f3e97] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=f3e100]:
        - link [ref=f3e101] [cursor=pointer]:
          - /url: /fr/products?category=limestone
          - img "Calcaire" [ref=f3e103]
          - generic [ref=f3e105]:
            - heading "Calcaire" [level=3] [ref=f3e106]
            - paragraph [ref=f3e107]: Collection illustrative
        - link [ref=f3e111] [cursor=pointer]:
          - /url: /fr/products?category=marble
          - img "Marbre" [ref=f3e113]
          - generic [ref=f3e115]:
            - heading "Marbre" [level=3] [ref=f3e116]
            - paragraph [ref=f3e117]: Collection illustrative
        - link [ref=f3e121] [cursor=pointer]:
          - /url: /fr/products?category=tiles
          - img "Carreaux" [ref=f3e123]
          - generic [ref=f3e125]:
            - heading "Carreaux" [level=3] [ref=f3e126]
            - paragraph [ref=f3e127]: Collection illustrative
        - link [ref=f3e131] [cursor=pointer]:
          - /url: /fr/products?category=blocks
          - img "Blocs" [ref=f3e133]
          - generic [ref=f3e135]:
            - heading "Blocs" [level=3] [ref=f3e136]
            - paragraph [ref=f3e137]: Collection illustrative
        - link [ref=f3e141] [cursor=pointer]:
          - /url: /fr/products?category=custom
          - img "Sur mesure" [ref=f3e143]
          - generic [ref=f3e145]:
            - heading "Sur mesure" [level=3] [ref=f3e146]
            - paragraph [ref=f3e147]: Collection illustrative
    - region [ref=f3e151]:
      - generic [ref=f3e152]:
        - img "Illustration de carrière · lieu non vérifié" [ref=f3e153]
        - generic [ref=f3e154]: Illustration de carrière · lieu non vérifié
      - generic [ref=f3e155]:
        - paragraph [ref=f3e156]: DE LA CARRIÈRE À LA MATIÈRE
        - heading "Une histoire façonnée par la pierre" [level=2] [ref=f3e157]
        - paragraph [ref=f3e158]: La matière brute, le geste, la transformation. Un aperçu visuel de l’univers de la pierre, en attendant les images et le récit de TIME STONE.
        - link "Explorer le savoir-faire" [ref=f3e159] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=f3e162]:
          - generic [ref=f3e163]: La sélection de la matière
          - generic [ref=f3e167]: La découpe & les proportions
          - generic [ref=f3e171]: La finition de surface
    - generic [ref=f3e175]:
      - generic [ref=f3e176]:
        - paragraph [ref=f3e177]: L’ESPRIT TIME STONE
        - heading "Une matière naturelle. Une vision architecturale." [level=2] [ref=f3e178]
        - paragraph [ref=f3e179]: "Ce showroom est conçu pour rapprocher la pierre de votre projet : découvrir les textures, comparer les formats et préparer un échange autour de vos besoins."
        - link "Imaginer votre espace" [ref=f3e180] [cursor=pointer]:
          - /url: "#applications"
      - figure "Visuel illustratif · provisoire" [ref=f3e183]:
        - img "Façades extérieures" [ref=f3e184]
    - generic [ref=f3e187]:
      - generic [ref=f3e189]:
        - paragraph [ref=f3e190]: ÉTUDES DE MATIÈRE
        - heading "Le détail fait la différence" [level=2] [ref=f3e191]
        - paragraph [ref=f3e192]: Trois inspirations visuelles. Les produits, finitions et dimensions réels seront confirmés avec TIME STONE.
      - generic [ref=f3e193]:
        - article [ref=f3e194]:
          - generic [ref=f3e195]:
            - img "Illustration temporaire" [ref=f3e196]
            - generic [ref=f3e197]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=f3e198]:
            - paragraph [ref=f3e199]: limestone
            - heading [level=3] [ref=f3e200]:
              - link "Calcaire · 01" [ref=f3e201] [cursor=pointer]:
                - /url: /fr/products/sample-1
        - article [ref=f3e202]:
          - generic [ref=f3e203]:
            - img "Illustration temporaire" [ref=f3e204]
            - generic [ref=f3e205]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=f3e206]:
            - paragraph [ref=f3e207]: marble
            - heading [level=3] [ref=f3e208]:
              - link "Marbre · 02" [ref=f3e209] [cursor=pointer]:
                - /url: /fr/products/sample-2
        - article [ref=f3e210]:
          - generic [ref=f3e211]:
            - img "Illustration temporaire" [ref=f3e212]
            - generic [ref=f3e213]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=f3e214]:
            - paragraph [ref=f3e215]: tiles
            - heading [level=3] [ref=f3e216]:
              - link "Carreaux · 03" [ref=f3e217] [cursor=pointer]:
                - /url: /fr/products/sample-3
    - generic [ref=f3e218]:
      - generic [ref=f3e219]:
        - paragraph [ref=f3e220]: LE SAVOIR-FAIRE
        - heading "Du bloc à l’espace" [level=2] [ref=f3e221]
        - paragraph [ref=f3e222]: Une lecture illustrative des étapes de transformation. Le procédé réel et les finitions disponibles restent à documenter.
      - list [ref=f3e223]:
        - listitem [ref=f3e224]:
          - generic [ref=f3e225]: "01"
          - heading "La sélection de la matière" [level=3] [ref=f3e226]
        - listitem [ref=f3e229]:
          - generic [ref=f3e230]: "02"
          - heading "La découpe & les proportions" [level=3] [ref=f3e231]
        - listitem [ref=f3e234]:
          - generic [ref=f3e235]: "03"
          - heading "La finition de surface" [level=3] [ref=f3e236]
        - listitem [ref=f3e239]:
          - generic [ref=f3e240]: "04"
          - heading "Le détail architectural" [level=3] [ref=f3e241]
    - generic [ref=f3e244]:
      - generic [ref=f3e246]:
        - paragraph [ref=f3e247]: LES APPLICATIONS
        - heading "La pierre dans chaque espace" [level=2] [ref=f3e248]
        - paragraph [ref=f3e249]: Des inspirations architecturales pour envisager votre projet.
      - generic [ref=f3e250]:
        - link [ref=f3e251] [cursor=pointer]:
          - /url: /fr/applications/exterior-facades
          - img "Façades extérieures" [ref=f3e252]
          - generic [ref=f3e253]: Façades extérieures
        - link [ref=f3e256] [cursor=pointer]:
          - /url: /fr/applications/interior-flooring
          - img "Sols intérieurs" [ref=f3e257]
          - generic [ref=f3e258]: Sols intérieurs
        - link [ref=f3e261] [cursor=pointer]:
          - /url: /fr/applications/wall-cladding
          - img "Revêtement mural" [ref=f3e262]
          - generic [ref=f3e263]: Revêtement mural
        - link [ref=f3e266] [cursor=pointer]:
          - /url: /fr/applications/stairs
          - img "Escaliers et marches" [ref=f3e267]
          - generic [ref=f3e268]: Escaliers et marches
      - paragraph [ref=f3e271]: Visuel illustratif · provisoire
    - generic [ref=f3e273]:
      - generic [ref=f3e274]:
        - paragraph [ref=f3e275]: CHOISIR EN CONNAISSANCE
        - heading "Chaque projet commence par les bonnes questions." [level=2] [ref=f3e276]
        - paragraph [ref=f3e277]: L’usage, la finition et les dimensions guident le choix. Les caractéristiques techniques seront publiées après validation.
      - list [ref=f3e278]:
        - listitem [ref=f3e279]:
          - generic [ref=f3e280]: "01"
          - text: Quel usage pour votre pierre ?
        - listitem [ref=f3e281]:
          - generic [ref=f3e282]: "02"
          - text: Quelle finition pour votre espace ?
        - listitem [ref=f3e283]:
          - generic [ref=f3e284]: "03"
          - text: Quelles dimensions pour votre projet ?
    - region [ref=f3e285]:
      - paragraph [ref=f3e286]: CONSTRUISONS LA SUITE
      - heading "Votre projet commence ici." [level=2] [ref=f3e287]
      - paragraph [ref=f3e288]: Une idée, une matière, un besoin particulier. Préparez les dimensions, les quantités et le lieu de livraison pour votre future demande.
      - paragraph [ref=f3e293]: Le formulaire de devis et les coordonnées officielles seront disponibles après validation. Aucune demande n’est envoyée depuis cette présentation.
  - complementary "ÉCHANTILLON DE PRÉSENTATION" [ref=f3e294]:
    - paragraph [ref=f3e298]: "Présentation provisoire : images illustratives et contenu à valider. Aucun projet ni produit présenté n’est une référence commerciale confirmée."
  - contentinfo [ref=f3e299]:
    - generic [ref=f3e300]:
      - generic [ref=f3e301]:
        - link "TIME STONE MARBRE & PIERRE" [ref=f3e302] [cursor=pointer]:
          - /url: /fr
          - generic [ref=f3e303]:
            - generic [ref=f3e306]: TIME STONE
            - generic [ref=f3e307]: MARBRE & PIERRE
        - paragraph [ref=f3e308]: La matière. Le temps. L’architecture.
      - generic [ref=f3e309]:
        - heading "Explorer" [level=2] [ref=f3e310]
        - navigation "Explorer" [ref=f3e311]:
          - link "Accueil" [ref=f3e312] [cursor=pointer]:
            - /url: "#home"
          - link "Collection" [ref=f3e313] [cursor=pointer]:
            - /url: "#collection"
          - link "Applications" [ref=f3e314] [cursor=pointer]:
            - /url: "#applications"
          - link "À propos" [ref=f3e315] [cursor=pointer]:
            - /url: "#about"
          - link "Carrière" [ref=f3e316] [cursor=pointer]:
            - /url: "#quarry"
          - link "Contact" [ref=f3e317] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=f3e318]:
        - heading "Les matières" [level=2] [ref=f3e319]
        - navigation "Les matières" [ref=f3e320]:
          - link "Calcaire" [ref=f3e321] [cursor=pointer]:
            - /url: /fr/products?category=limestone
          - link "Marbre" [ref=f3e322] [cursor=pointer]:
            - /url: /fr/products?category=marble
          - link "Carreaux" [ref=f3e323] [cursor=pointer]:
            - /url: /fr/products?category=tiles
          - link "Blocs" [ref=f3e324] [cursor=pointer]:
            - /url: /fr/products?category=blocks
          - link "Sur mesure" [ref=f3e325] [cursor=pointer]:
            - /url: /fr/products?category=custom
      - generic [ref=f3e326]:
        - heading "Langues" [level=2] [ref=f3e327]
        - navigation "Langues" [ref=f3e328]:
          - link "Français" [ref=f3e329] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=f3e330] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=f3e331] [cursor=pointer]:
            - /url: /ar
    - generic [ref=f3e332]:
      - paragraph [ref=f3e333]: TIME STONE · Présentation de développement
      - paragraph [ref=f3e334]: Images temporaires issues des maquettes approuvées. Informations commerciales à confirmer.
  - alert [ref=f3e335]
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
> 85  |     await expect(page).toHaveURL(`${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/${locale}?preview=1#applications`);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  86  |     await expect(page.locator('html')).toHaveAttribute('lang', locale);
  87  |     await expect(page.locator('#applications')).toBeInViewport();
  88  |   }
  89  | });
  90  | 
  91  | test('mobile/tablet menu traps focus, navigates and closes with Escape', async ({ page }, testInfo) => {
  92  |   test.skip(testInfo.project.name === 'desktop', 'Desktop uses the visible navigation.');
  93  |   await page.goto('/ar');
  94  |   const opener = page.getByRole('button', { name: homeContent.ar.menu });
  95  |   await opener.click();
  96  |   const dialog = page.getByRole('dialog');
  97  |   await expect(dialog).toBeVisible();
  98  |   await page.keyboard.press('Shift+Tab');
  99  |   expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  100 |   await dialog.getByRole('link', { name: homeContent.ar.nav[2], exact: true }).click();
  101 |   await expect(dialog).not.toBeVisible();
  102 |   await expect(page).toHaveURL(/\/ar\/applications$/);
  103 |   await opener.click();
  104 |   await page.keyboard.press('Escape');
  105 |   await expect(dialog).not.toBeVisible();
  106 |   await expect(opener).toBeFocused();
  107 | });
  108 | 
  109 | test('French redirect, unsupported locale, keyboard skip link and reduced motion', async ({ page, request }) => {
  110 |   const root = await request.get('/', { maxRedirects: 0 });
  111 |   expect(root.status()).toBe(307);
  112 |   expect(root.headers().location).toBe('/fr');
  113 |   expect((await request.get('/de')).status()).toBe(404);
  114 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  115 |   await page.goto('/fr');
  116 |   await page.keyboard.press('Tab');
  117 |   await expect(page.getByRole('link', { name: homeContent.fr.skip })).toBeFocused();
  118 |   await page.keyboard.press('Enter');
  119 |   await expect(page.locator('main')).toBeFocused();
  120 |   expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  121 |   expect(await page.locator('.category-image img').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  122 | });
  123 | 
  124 | test('locale path helper retains nested pages for later milestones', () => {
  125 |   expect(localizedPath('/en/products/sample', 'ar', '?finish=honed', '#details')).toBe('/ar/products/sample?finish=honed#details');
  126 |   expect(localizedPath('/unknown', 'fr')).toBe('/fr');
  127 | });
  128 | 
  129 | test('requested widths preserve hero space, typography and layout in every language', async ({ page }, testInfo) => {
  130 |   test.setTimeout(360000);
  131 |   test.skip(testInfo.project.name !== 'desktop', 'Additional widths are covered once.');
  132 |   for (const locale of locales) {
  133 |     for (const width of [320, 390, 430, 768, 1024, 1280, 1536]) {
  134 |       await page.setViewportSize({ width, height: 900 });
  135 |       await page.goto(`/${locale}`);
  136 |       await page.evaluate(() => document.fonts.ready);
  137 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  138 |       await expect(page.locator('h1')).toBeVisible();
  139 |       const hero = await page.locator('.hero').boundingBox();
  140 |       const copy = await page.locator('.hero-copy').boundingBox();
  141 |       const title = await page.locator('h1').boundingBox();
  142 |       const swatches = await page.locator('.material-swatches').boundingBox();
  143 |       expect(hero && copy && title && swatches).toBeTruthy();
  144 |       expect(await page.locator('h1').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  145 |       if (width < 768) {
  146 |         // Keep a clear area below the copy and a separate, usable swatch column.
  147 |         expect(hero!.y + hero!.height - copy!.y - copy!.height).toBeGreaterThanOrEqual(100);
  148 |         expect(locale === 'ar' ? copy!.x >= swatches!.x + swatches!.width : copy!.x + copy!.width <= swatches!.x).toBe(true);
  149 |         expect(title!.height).toBeLessThan(150);
  150 |         expect(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(28);
  151 |       }
  152 |       await page.evaluate(async () => {
  153 |         for (const image of document.images) image.loading = 'eager';
  154 |         await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  155 |       });
  156 |       await visitDeferredSections(page);
  157 |       await mkdir('docs/qa/refinement', { recursive: true });
  158 |       await page.screenshot({ path: `docs/qa/refinement/home-${locale}-${width}.png`, scale: 'css', animations: 'disabled' });
  159 |       if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/refinement/home-${locale}-${width}-full.png`, scale: 'css', fullPage: true, animations: 'disabled', style: fullPageStyle });
  160 |     }
  161 |   }
  162 | });
  163 | 
```