import {qaOutput} from './qa-output';
import { test, expect } from '@playwright/test';
const adminOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

test('editable banners use high resolution on desktop and smaller images on mobile', async ({ page, request }) => {
  test.skip(!process.env.QA_ADMIN_LOCALE_CREDENTIALS, 'Requires a disposable local admin account.');
  test.setTimeout(180000);
  page.setDefaultTimeout(15000);
  const output = qaOutput('docs/qa/banners');
  await mkdir(output, { recursive: true });
  const account = JSON.parse(await readFile(process.env.QA_ADMIN_LOCALE_CREDENTIALS!, 'utf8'));
  const errors: string[] = [];
  const checks: unknown[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(adminOrigin+'/admin/login');
  await page.locator('input[type=email]').fill(account.email);
  await page.locator('input[type=password]').fill(account.password);
  await page.locator('button[type=submit]').last().click();
  await expect(page).toHaveURL(adminOrigin+'/admin');
  for (const [locale, label, upload] of [['fr', 'Gérer les bannières', 'Importer une image de bannière'], ['en', 'Manage banners', 'Upload banner image'], ['ar', 'إدارة صور البانر', 'رفع صورة بانر']]) {
    await page.goto(adminOrigin+'/admin');
    await page.locator('#admin-locale').selectOption(locale);
    await Promise.all([page.waitForNavigation(), page.locator('.admin-language-switcher button').click()]);
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(url => url.pathname==='/admin/page-sections'&&['1','true'].includes(url.searchParams.get('filters[banners][isActive]')||''));
    await expect(page.getByText('catalogue-hero', { exact: true })).toBeVisible();
    expect(await page.locator('table img').count()).toBeGreaterThan(0);
    if (locale === 'ar') await page.screenshot({ path: `${output}/admin-banners-ar.png`, fullPage: true });
    const api = await request.get(`${adminOrigin}/api/v1/pages/shared?locale=${locale}`);
    expect(api.ok()).toBe(true);
    const section = (await api.json()).data.sections.find((s: {key: string}) => s.key === 'catalogue-hero');
    expect(section.image).toMatch(/\/media\/\d+\/banner$/);
    const listing = await page.getByText('catalogue-hero', { exact: true }).locator('xpath=ancestor::tr').locator('a').first().getAttribute('href');
    expect(listing).toBeTruthy();
    await page.goto(listing!);
    await expect(page.getByText(upload, { exact: true })).toBeVisible();
    for (const width of [390, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      const requested: string[] = [];
      const listener = (r: {url(): string}) => requested.push(r.url());
      page.on('requestfinished', listener);
      await page.goto(`/${locale}/products`);
      const hero = page.locator('.catalogue-hero img');
      await expect(hero).toBeVisible();
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
      expect(src).toMatch(width < 480 ? /\/banner_mobile$/ : width < 768 ? /\/preview$/ : /\/banner$/);
      if (width < 768) expect(requested.some(url => url.endsWith(new URL(section.image).pathname))).toBe(false);
      page.off('requestfinished', listener);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${output}/catalogue-${locale}-${width}.png`, fullPage: false });
      checks.push({ locale, width, currentImage: src });
    }
    for (const path of ['', '/about', '/applications', '/contact', '/quote']) {
      await page.goto(`/${locale}${path}`);
      const hero = page.locator(path ? '.page-hero img' : '.hero-art img');
      await expect(hero).toBeVisible();
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      checks.push({ locale, page: path || '/', loaded: true });
    }
  }
  expect(errors).toEqual([]);
  await writeFile(`${output}/results.json`, JSON.stringify({ passed: true, checks, browserErrors: errors }, null, 2));
});

test('Application banners preserve the first gallery image at desktop and mobile sizes', async ({ page, request }) => {
  const list = await request.get(adminOrigin+'/api/v1/applications?locale=fr');
  expect(list.ok()).toBe(true);
  const slug = (await list.json()).data[0].slug;
  for (const locale of ['fr', 'en', 'ar']) {
    const api = await request.get(`${adminOrigin}/api/v1/applications/${slug}?locale=${locale}`);
    const image = new URL((await api.json()).data.gallery[0]).pathname;
    for (const width of [390, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/applications/${slug}`);
      const hero = page.locator('.page-hero img');
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      const source = await hero.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
      expect(source).toBe(width < 768 ? image.replace(/\/(banner|texture)$/, '/preview') : image);
    }
  }
});
