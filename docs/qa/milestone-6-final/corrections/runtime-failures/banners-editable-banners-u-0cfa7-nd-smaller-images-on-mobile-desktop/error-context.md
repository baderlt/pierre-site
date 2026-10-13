# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: banners.spec.ts >> editable banners use high resolution on desktop and smaller images on mobile
- Location: tests\banners.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.catalogue-hero img')
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.catalogue-hero img') with timeout 20000ms
  - waiting for locator('.catalogue-hero img')

```

```yaml
- alert:
  - heading "Contenu indisponible" [level=1]
  - paragraph: Veuillez réessayer.
  - button "Réessayer"
- alert
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
  25 |     await expect(page).toHaveURL(/filters\[banners\]\[isActive\]=1/);
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
> 44 |       await expect(hero).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  45 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  46 |       const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  47 |       expect(src).toMatch(width < 768 ? /\/preview$/ : /\/banner$/);
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