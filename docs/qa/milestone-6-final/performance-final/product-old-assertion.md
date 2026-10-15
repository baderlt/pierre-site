# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product.spec.ts >> product width matrix, screenshots and no initial 3D payload
- Location: tests\product.spec.ts:62:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - link "Aller au contenu" [ref=e3] [cursor=pointer]:
      - /url: "#main"
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "TIME STONE MARBRE & PIERRE" [ref=e6] [cursor=pointer]:
          - /url: /fr
          - generic [ref=e7]:
            - generic [ref=e10]: TIME STONE
            - generic [ref=e11]: MARBRE & PIERRE
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: Choisir la langue
            - combobox "Choisir la langue" [ref=e15] [cursor=pointer]:
              - option "Français" [selected]
              - option "English"
              - option "العربية"
          - button "Ouvrir le menu" [ref=e16] [cursor=pointer]
    - main [ref=e20]:
      - navigation "Explorer" [ref=e21]:
        - link "Retour aux résultats" [ref=e22] [cursor=pointer]:
          - /url: /fr/products#results
          - generic [aria-hidden] [ref=e23]: ←
          - text: Retour aux résultats
        - generic [aria-hidden] [ref=e24]: /
        - generic [ref=e25]: Calcaire · 01
      - generic [ref=e26]:
        - region "Galerie de la matière" [ref=e27]:
          - generic [ref=e28]:
            - img "Illustration temporaire" [ref=e29]
            - generic: Échantillon provisoire
            - button "Explorer en 3D" [ref=e30] [cursor=pointer]:
              - text: Explorer en 3D
              - generic [aria-hidden] [ref=e31]: ◇
          - generic "Galerie de la matière" [ref=e32]:
            - button "Illustration temporaire" [pressed] [ref=e33] [cursor=pointer]
            - button "Illustration temporaire" [ref=e34] [cursor=pointer]
          - paragraph [ref=e35]: "Simulation illustrative : côtés et dos approximés à partir d’une image. Relief, couleur et finitions non mesurés."
        - region [ref=e36]:
          - paragraph [ref=e37]: Échantillon provisoire
          - heading "Calcaire · 01" [level=1] [ref=e38]
          - paragraph [ref=e39]: ÉCHANTILLON DE PRÉSENTATION
          - heading "La matière en détail" [level=2] [ref=e40]
          - generic [ref=e41]:
            - generic [ref=e42]:
              - term [ref=e43]: Famille illustrative
              - definition [ref=e44]: Calcaire
            - generic [ref=e45]:
              - term [ref=e46]: Nuance illustrative
              - definition [ref=e47]: Beige
            - generic [ref=e48]:
              - term [ref=e49]: Provenance
              - definition [ref=e50]: À confirmer
          - generic [ref=e51]:
            - heading "Caractéristiques techniques" [level=2] [ref=e52]
            - paragraph [ref=e53]: Aucune caractéristique technique vérifiée n’est disponible pour cet échantillon. Dimensions réelles, résistance, porosité et aptitude à l’usage doivent être validées.
            - paragraph [ref=e54]: Images de référence et données provisoires. Cet échantillon n’est pas une référence commerciale vérifiée.
        - region [ref=e55]:
          - heading "Explorer les finitions" [level=2] [ref=e56]
          - generic [ref=e57]:
            - button "Adoucie" [pressed] [ref=e58] [cursor=pointer]
            - button "Polie" [ref=e60] [cursor=pointer]
            - button "Brute" [ref=e62] [cursor=pointer]
          - paragraph [ref=e64]: Simulations de surface, sans confirmation de disponibilité. La finition brossée du catalogue n’est pas simulée ici.
          - group [ref=e65]:
            - generic "Formats illustratifs" [ref=e66] [cursor=pointer]
          - link "Préparer un devis" [ref=e67] [cursor=pointer]:
            - /url: /fr/quote?v_shape=slab&v_finish=honed&v_width=180&v_height=120&v_thickness=3&product=sample-1&format_id=1
            - text: Préparer un devis
            - generic [aria-hidden] [ref=e68]: →
        - region [ref=e69]:
          - heading "Inspirations & applications" [level=2] [ref=e70]
          - region "Inspirations & applications" [ref=e71]:
            - figure [ref=e72]:
              - generic [ref=e73]:
                - link "Sols intérieurs":
                  - /url: /fr/applications/interior-flooring
                  - img "Sols intérieurs" [ref=e74] [cursor=pointer]
              - link "Sols intérieurs" [ref=e76] [cursor=pointer]:
                - /url: /fr/applications/interior-flooring
          - paragraph [ref=e77]: Images d’inspiration provisoires. Chaque usage nécessite une validation technique.
        - complementary [ref=e78]:
          - generic [ref=e79]:
            - heading "Votre projet, votre pierre" [level=2] [ref=e80]
            - paragraph [ref=e81]: Choisissez une intention de format et de finition pour préparer votre échange.
            - paragraph [ref=e82]:
              - text: Dalle · Adoucie
              - generic [ref=e83]: 180 × 120 × 3 cm
            - link "Préparer un devis" [ref=e84] [cursor=pointer]:
              - /url: /fr/quote?v_shape=slab&v_finish=honed&v_width=180&v_height=120&v_thickness=3&product=sample-1&format_id=1
              - text: Préparer un devis
              - generic [aria-hidden] [ref=e85]: →
            - paragraph [ref=e86]: Préparez votre demande. Elle sera enregistrée uniquement après confirmation de l’envoi.
            - generic [ref=e87]:
              - heading "Documentation technique" [level=3] [ref=e88]
              - paragraph [ref=e89]: Fiche technique et documents vérifiés à fournir. Aucun téléchargement disponible.
      - region [ref=e90]:
        - heading "Poursuivre la découverte" [level=2] [ref=e91]
        - generic [ref=e92]:
          - link "Carreaux · 03 Découvrir →" [ref=e93] [cursor=pointer]:
            - /url: /fr/products/sample-3
            - heading "Carreaux · 03" [level=3] [ref=e95]
            - generic [ref=e96]: Découvrir →
          - link "Blocs · 04 Découvrir →" [ref=e97] [cursor=pointer]:
            - /url: /fr/products/sample-4
            - heading "Blocs · 04" [level=3] [ref=e99]
            - generic [ref=e100]: Découvrir →
          - link "Sur mesure · 05 Découvrir →" [ref=e101] [cursor=pointer]:
            - /url: /fr/products/sample-5
            - heading "Sur mesure · 05" [level=3] [ref=e103]
            - generic [ref=e104]: Découvrir →
    - contentinfo [ref=e105]:
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e110]: TIME STONE
          - generic [ref=e111]: MARBRE & PIERRE
        - paragraph [ref=e112]: Images de référence et données provisoires. Cet échantillon n’est pas une référence commerciale vérifiée.
        - link "Retour aux résultats" [ref=e113] [cursor=pointer]:
          - /url: /fr/products#results
  - alert [ref=e114]
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
  41 |   await page.locator('.product-back').click();
  42 |   const api=process.env.QA_API_URL||'http://127.0.0.1:8000';const filtered=await request.get(`${api}/api/v1/products?color=beige&sort=name_desc&per_page=12`);expect(filtered.ok()).toBe(true);const lastPage=(await filtered.json()).meta.last_page;
  43 |   await expect(page).toHaveURL(new RegExp('/products\\?color=beige&sort=name_desc'+(lastPage>=2?'&page=2':'')+'#results'));
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
> 74 |     expect(initialResources.some(url => url.includes('/media/')&&url.includes('/texture'))).toBe(true); // CSS finish swatches only.
     |                                                                                             ^ Error: expect(received).toBe(expected) // Object.is equality
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