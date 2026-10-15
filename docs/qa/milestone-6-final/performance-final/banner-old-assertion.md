# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: banners.spec.ts >> editable banners use high resolution on desktop and smaller images on mobile
- Location: tests\banners.spec.ts:5:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /filters\[banners\]\[isActive\]=1/
Received string:  "http://127.0.0.1:8011/admin/page-sections?filters[banners][isActive]=true"
Timeout: 20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    37 × locator resolved to <html lang="fr" dir="ltr" class="fi">…</html>
       - unexpected value "http://127.0.0.1:8011/admin/page-sections?filters[banners][isActive]=true"

```

```yaml
- link "Aller au contenu":
  - /url: "#fi-main-content"
- navigation "Barre supérieure":
  - button "Agrandir la barre latérale"
  - button "Menu utilisateur":
    - img "Avatar de QA ONLY · Admin languages"
  - form "Langue de l’administration":
    - text: Langue
    - combobox "Langue":
      - option "Français" [selected]
      - option "English"
      - option "العربية"
    - button "Appliquer"
- banner:
  - link "TIME STONE · Administration":
    - /url: http://127.0.0.1:8011/admin
- navigation "Navigation latérale":
  - list:
    - listitem:
      - list:
        - listitem:
          - link "Tableau de bord":
            - /url: http://127.0.0.1:8011/admin
    - listitem:
      - text: Contenu
      - button "Contenu" [expanded]
      - list:
        - listitem:
          - link "Applications":
            - /url: http://127.0.0.1:8011/admin/applications
        - listitem:
          - link "Médiathèque":
            - /url: http://127.0.0.1:8011/admin/media
        - listitem:
          - link "Pages":
            - /url: http://127.0.0.1:8011/admin/pages
        - listitem:
          - link "Sections de page":
            - /url: http://127.0.0.1:8011/admin/page-sections
    - listitem:
      - text: Catalogue
      - button "Catalogue" [expanded]
      - list:
        - listitem:
          - link "Catégories":
            - /url: http://127.0.0.1:8011/admin/categories
        - listitem:
          - link "Couleurs":
            - /url: http://127.0.0.1:8011/admin/colors
        - listitem:
          - link "Finitions":
            - /url: http://127.0.0.1:8011/admin/finishes
        - listitem:
          - link "Formats":
            - /url: http://127.0.0.1:8011/admin/formats
        - listitem:
          - link "Produits":
            - /url: http://127.0.0.1:8011/admin/products
        - listitem:
          - link "Matériaux":
            - /url: http://127.0.0.1:8011/admin/stone-types
    - listitem:
      - text: Demandes
      - button "Demandes" [expanded]
      - list:
        - listitem:
          - link "Demandes de devis":
            - /url: http://127.0.0.1:8011/admin/quotation-requests
    - listitem:
      - text: Administration
      - button "Administration" [expanded]
      - list:
        - listitem:
          - link "Paramètres du site":
            - /url: http://127.0.0.1:8011/admin/site-settings
        - listitem:
          - link "Administrateurs":
            - /url: http://127.0.0.1:8011/admin/users
- main:
  - navigation "Fil d'Ariane":
    - list:
      - listitem:
        - link "Sections De Page":
          - /url: http://127.0.0.1:8011/admin/page-sections
      - listitem: Liste
  - heading "Sections De Page" [level=1]
  - link "Créer":
    - /url: http://127.0.0.1:8011/admin/page-sections/create
  - text: Rechercher
  - searchbox "Rechercher"
  - button "Filtre": "1"
  - button "Basculer les colonnes"
  - text: Filtres actifs
  - list:
    - listitem:
      - text: Images et bannières
      - button "Supprimer le filtre"
  - button "Supprimer tous les filtres"
  - status: filament-tables::table.result_count
  - status: filament-tables::table.loading
  - table "Sections de page":
    - rowgroup:
      - row "Image Page Clé Titre Ordre d’affichage Dernière modification Actions":
        - columnheader "Image"
        - columnheader "Page"
        - columnheader "Clé":
          - button "Clé"
        - columnheader "Titre"
        - columnheader "Ordre d’affichage":
          - button "Ordre d’affichage"
        - columnheader "Dernière modification":
          - button "Dernière modification"
        - columnheader "Actions"
    - rowgroup:
      - row "about · Une histoire de matière hero Une histoire de matière 0 oct. 13, 2026 12:40:15 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "about · Une histoire de matière":
          - link "about · Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "hero":
          - link "hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "Une histoire de matière":
          - link "Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "0":
          - link "0":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "oct. 13, 2026 12:40:15":
          - link "oct. 13, 2026 12:40:15":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/10/edit
          - button "Supprimer"
      - row "shared · TIME STONE catalogue-cta Bannière catalogue · catalogue-cta 100 oct. 13, 2026 01:32:28 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "shared · TIME STONE":
          - link "shared · TIME STONE":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "catalogue-cta":
          - link "catalogue-cta":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "Bannière catalogue · catalogue-cta":
          - link "Bannière catalogue · catalogue-cta":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "100":
          - link "100":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "oct. 13, 2026 01:32:28":
          - link "oct. 13, 2026 01:32:28":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/47/edit
          - button "Supprimer"
      - row "shared · TIME STONE catalogue-hero Bannière catalogue · catalogue-hero 100 oct. 13, 2026 01:32:27 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "shared · TIME STONE":
          - link "shared · TIME STONE":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "catalogue-hero":
          - link "catalogue-hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "Bannière catalogue · catalogue-hero":
          - link "Bannière catalogue · catalogue-hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "100":
          - link "100":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "oct. 13, 2026 01:32:27":
          - link "oct. 13, 2026 01:32:27":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/46/edit
          - button "Supprimer"
      - row "about · Une histoire de matière stage-3 Revue de qualité 108 oct. 12, 2026 21:16:15 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "about · Une histoire de matière":
          - link "about · Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "stage-3":
          - link "stage-3":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "Revue de qualité":
          - link "Revue de qualité":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "108":
          - link "108":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "oct. 12, 2026 21:16:15":
          - link "oct. 12, 2026 21:16:15":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/45/edit
          - button "Supprimer"
      - row "about · Une histoire de matière stage-2 Finition 108 oct. 12, 2026 21:16:15 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "about · Une histoire de matière":
          - link "about · Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "stage-2":
          - link "stage-2":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "Finition":
          - link "Finition":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "108":
          - link "108":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "oct. 12, 2026 21:16:15":
          - link "oct. 12, 2026 21:16:15":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/44/edit
          - button "Supprimer"
      - row "about · Une histoire de matière stage-1 Découpe et préparation 108 oct. 12, 2026 21:16:14 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "about · Une histoire de matière":
          - link "about · Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "stage-1":
          - link "stage-1":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "Découpe et préparation":
          - link "Découpe et préparation":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "108":
          - link "108":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "oct. 12, 2026 21:16:14":
          - link "oct. 12, 2026 21:16:14":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/43/edit
          - button "Supprimer"
      - row "about · Une histoire de matière stage-0 Sélection de la pierre 108 oct. 12, 2026 21:16:14 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "about · Une histoire de matière":
          - link "about · Une histoire de matière":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "stage-0":
          - link "stage-0":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "Sélection de la pierre":
          - link "Sélection de la pierre":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "108":
          - link "108":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "oct. 12, 2026 21:16:14":
          - link "oct. 12, 2026 21:16:14":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/42/edit
          - button "Supprimer"
      - row "quote · Votre demande professionnelle hero Donnons forme à votre projet 0 oct. 12, 2026 21:16:13 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "quote · Votre demande professionnelle":
          - link "quote · Votre demande professionnelle":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "hero":
          - link "hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "Donnons forme à votre projet":
          - link "Donnons forme à votre projet":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "0":
          - link "0":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "oct. 12, 2026 21:16:13":
          - link "oct. 12, 2026 21:16:13":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/21/edit
          - button "Supprimer"
      - row "contact · Votre projet commence ici hero Votre projet commence ici 0 oct. 12, 2026 21:16:13 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "contact · Votre projet commence ici":
          - link "contact · Votre projet commence ici":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "hero":
          - link "hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "Votre projet commence ici":
          - link "Votre projet commence ici":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "0":
          - link "0":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "oct. 12, 2026 21:16:13":
          - link "oct. 12, 2026 21:16:13":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/19/edit
          - button "Supprimer"
      - row "applications · La pierre naturelle, pour chaque espace hero La pierre naturelle, pour chaque espace 0 oct. 12, 2026 21:16:13 Modifier Supprimer":
        - cell:
          - link:
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "applications · La pierre naturelle, pour chaque espace":
          - link "applications · La pierre naturelle, pour chaque espace":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "hero":
          - link "hero":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "La pierre naturelle, pour chaque espace":
          - link "La pierre naturelle, pour chaque espace":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "0":
          - link "0":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "oct. 12, 2026 21:16:13":
          - link "oct. 12, 2026 21:16:13":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
        - cell "Modifier Supprimer":
          - link "Modifier":
            - /url: http://127.0.0.1:8011/admin/page-sections/16/edit
          - button "Supprimer"
  - navigation "Navigation par pagination":
    - text: par page
    - combobox "par page":
      - option "10" [selected]
      - option "25"
      - option "50"
    - button "Suivant"
- status
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | const adminOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
  3  | import { readFile, mkdir, writeFile } from 'node:fs/promises';
  4  | 
  5  | test('editable banners use high resolution on desktop and smaller images on mobile', async ({ page, request }) => {
  6  |   test.skip(!process.env.QA_ADMIN_LOCALE_CREDENTIALS, 'Requires a disposable local admin account.');
  7  |   test.setTimeout(180000);
  8  |   page.setDefaultTimeout(15000);
  9  |   const output = 'docs/qa/banners';
  10 |   await mkdir(output, { recursive: true });
  11 |   const account = JSON.parse(await readFile(process.env.QA_ADMIN_LOCALE_CREDENTIALS!, 'utf8'));
  12 |   const errors: string[] = [];
  13 |   const checks: unknown[] = [];
  14 |   page.on('pageerror', e => errors.push(e.message));
  15 |   await page.goto(adminOrigin+'/admin/login');
  16 |   await page.locator('input[type=email]').fill(account.email);
  17 |   await page.locator('input[type=password]').fill(account.password);
  18 |   await page.locator('button[type=submit]').last().click();
  19 |   await expect(page).toHaveURL(adminOrigin+'/admin');
  20 |   for (const [locale, label, upload] of [['fr', 'Gérer les bannières', 'Importer une image de bannière'], ['en', 'Manage banners', 'Upload banner image'], ['ar', 'إدارة صور البانر', 'رفع صورة بانر']]) {
  21 |     await page.goto(adminOrigin+'/admin');
  22 |     await page.locator('#admin-locale').selectOption(locale);
  23 |     await Promise.all([page.waitForNavigation(), page.locator('.admin-language-switcher button').click()]);
  24 |     await page.getByRole('link', { name: label, exact: true }).click();
> 25 |     await expect(page).toHaveURL(/filters\[banners\]\[isActive\]=1/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  26 |     await expect(page.getByText('catalogue-hero', { exact: true })).toBeVisible();
  27 |     expect(await page.locator('table img').count()).toBeGreaterThan(0);
  28 |     if (locale === 'ar') await page.screenshot({ path: `${output}/admin-banners-ar.png`, fullPage: true });
  29 |     const api = await request.get(`${adminOrigin}/api/v1/pages/shared?locale=${locale}`);
  30 |     expect(api.ok()).toBe(true);
  31 |     const section = (await api.json()).data.sections.find((s: {key: string}) => s.key === 'catalogue-hero');
  32 |     expect(section.image).toMatch(/\/media\/\d+\/banner$/);
  33 |     const listing = await page.getByText('catalogue-hero', { exact: true }).locator('xpath=ancestor::tr').locator('a').first().getAttribute('href');
  34 |     expect(listing).toBeTruthy();
  35 |     await page.goto(listing!);
  36 |     await expect(page.getByText(upload, { exact: true })).toBeVisible();
  37 |     for (const width of [390, 1536]) {
  38 |       await page.setViewportSize({ width, height: 900 });
  39 |       const requested: string[] = [];
  40 |       const listener = (r: {url(): string}) => requested.push(r.url());
  41 |       page.on('requestfinished', listener);
  42 |       await page.goto(`/${locale}/products`);
  43 |       const hero = page.locator('.catalogue-hero img');
  44 |       await expect(hero).toBeVisible();
  45 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  46 |       const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  47 |       expect(src).toMatch(width < 480 ? /\/banner_mobile$/ : width < 768 ? /\/preview$/ : /\/banner$/);
  48 |       if (width < 768) expect(requested.some(url => url.endsWith(new URL(section.image).pathname))).toBe(false);
  49 |       page.off('requestfinished', listener);
  50 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  51 |       await page.screenshot({ path: `${output}/catalogue-${locale}-${width}.png`, fullPage: false });
  52 |       checks.push({ locale, width, currentImage: src });
  53 |     }
  54 |     for (const path of ['', '/about', '/applications', '/contact', '/quote']) {
  55 |       await page.goto(`/${locale}${path}`);
  56 |       const hero = page.locator(path ? '.page-hero img' : '.hero-art img');
  57 |       await expect(hero).toBeVisible();
  58 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  59 |       checks.push({ locale, page: path || '/', loaded: true });
  60 |     }
  61 |   }
  62 |   expect(errors).toEqual([]);
  63 |   await writeFile(`${output}/results.json`, JSON.stringify({ passed: true, checks, browserErrors: errors }, null, 2));
  64 | });
  65 | 
  66 | test('Application banners preserve the first gallery image at desktop and mobile sizes', async ({ page, request }) => {
  67 |   const list = await request.get(adminOrigin+'/api/v1/applications?locale=fr');
  68 |   expect(list.ok()).toBe(true);
  69 |   const slug = (await list.json()).data[0].slug;
  70 |   for (const locale of ['fr', 'en', 'ar']) {
  71 |     const api = await request.get(`${adminOrigin}/api/v1/applications/${slug}?locale=${locale}`);
  72 |     const image = new URL((await api.json()).data.gallery[0]).pathname;
  73 |     for (const width of [390, 1536]) {
  74 |       await page.setViewportSize({ width, height: 900 });
  75 |       await page.goto(`/${locale}/applications/${slug}`);
  76 |       const hero = page.locator('.page-hero img');
  77 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  78 |       const source = await hero.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  79 |       expect(source).toBe(width < 768 ? image.replace(/\/(banner|texture)$/, '/preview') : image);
  80 |     }
  81 |   }
  82 | });
  83 | 
```