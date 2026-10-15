import {qaOutput} from './qa-output';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { homeContent } from '../apps/web/src/lib/home-content';
import { locales, localizedPath } from '../apps/web/src/lib/locales';

const fullPageStyle = '#materials, #craft, #applications, #contact { content-visibility: visible; contain-intrinsic-size: none; }';

async function visitDeferredSections(page: Page) {
  for (const id of ['materials', 'craft', 'applications', 'contact']) {
    const heading=page.locator(`#${id} h2`).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeInViewport();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.site-header')).toHaveAttribute('data-scrolled', 'false');
}

for (const locale of locales) {
  test(`${locale}: responsive homepage, semantics, local assets and screenshot`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page).toHaveTitle(homeContent[locale].meta.title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#contact .home-quote-page-link')).toHaveAttribute('href', `/${locale}/quote`);
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).fontFamily.split(',')[0])).not.toMatch(/Arial|Georgia/);
    const fontResources = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.name.includes('.woff2')).length);
    expect(fontResources).toBeGreaterThanOrEqual(2);
    // Reveal lazy images before capturing a complete, stable page.
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = 'eager';
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute('href')!.slice(1))))).toBe(true);
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
    const mapSource=await page.locator('.magasin-map iframe').getAttribute('src').catch(()=>null);
    expect(resources.every(url => new URL(url).origin === locationOrigin(resources)||url===mapSource)).toBe(true);
    expect(resources.some(url => /three|GLTF|fiber/.test(url))).toBe(false);
    expect(errors).toEqual([]);
    await visitDeferredSections(page);
    await mkdir(qaOutput('docs/qa'), { recursive: true });
    await page.screenshot({ path: qaOutput(`docs/qa/home-${locale}-${testInfo.project.name}.png`), scale: 'css', animations: 'disabled' });
    await page.screenshot({ path: qaOutput(`docs/qa/home-${locale}-${testInfo.project.name}-full.png`), scale: 'css', fullPage: true, animations: 'disabled', style: fullPageStyle });
  });

  test(`${locale}: WCAG A/AA automated scan`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test(`${locale}: material dialog, selection, Escape and focus restoration`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const opener = page.getByRole('button', { name: homeContent[locale].hero.preview, exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const choice=dialog.locator('.material-options button').nth(1);
    const label=await choice.textContent();
    await choice.click();
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.locator('img')).toHaveAttribute('alt',label!.trim());
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  });
}

function locationOrigin(resources: string[]) {
  return new URL(resources.find(url => url.includes('/_next/')) ?? 'http://127.0.0.1:3000').origin;
}

test('language switching preserves query and section and supports all three languages', async ({ page }) => {
  await page.goto('/fr?preview=1#applications');
  for (const locale of ['ar', 'en', 'fr'] as const) {
    await page.locator('.site-header select').selectOption(locale);
    const expectedUrl=`${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/${locale}?preview=1#applications`;
    await page.waitForURL(expectedUrl,{waitUntil:'domcontentloaded',timeout:60000});
    expect(page.url()).toBe(expectedUrl);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('#applications')).toBeInViewport();
  }
});

test('mobile/tablet menu traps focus, navigates and closes with Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Desktop uses the visible navigation.');
  await page.goto('/ar');
  const opener = page.getByRole('button', { name: homeContent.ar.menu });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await dialog.getByRole('link', { name: homeContent.ar.nav[2], exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/\/ar\/applications$/);
  await opener.click();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('French redirect, unsupported locale, keyboard skip link and reduced motion', async ({ page, request }) => {
  const root = await request.get('/', { maxRedirects: 0 });
  expect(root.status()).toBe(307);
  expect(root.headers().location).toBe('/fr');
  expect((await request.get('/de')).status()).toBe(404);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: homeContent.fr.skip })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.category-image img').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test('locale path helper retains nested pages for later milestones', () => {
  expect(localizedPath('/en/products/sample', 'ar', '?finish=honed', '#details')).toBe('/ar/products/sample?finish=honed#details');
  expect(localizedPath('/unknown', 'fr')).toBe('/fr');
});

test('requested widths preserve hero space, typography and layout in every language', async ({ page }, testInfo) => {
  test.setTimeout(360000);
  test.skip(testInfo.project.name !== 'desktop', 'Additional widths are covered once.');
  for (const locale of locales) {
    for (const width of [320, 390, 430, 768, 1024, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('h1')).toBeVisible();
      const hero = await page.locator('.hero').boundingBox();
      const copy = await page.locator('.hero-copy').boundingBox();
      const title = await page.locator('h1').boundingBox();
      const swatches = await page.locator('.material-swatches').boundingBox();
      expect(hero && copy && title && swatches).toBeTruthy();
      expect(await page.locator('h1').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      if (width < 768) {
        // Keep a clear area below the copy and a separate, usable swatch column.
        expect(hero!.y + hero!.height - copy!.y - copy!.height).toBeGreaterThanOrEqual(100);
        expect(locale === 'ar' ? copy!.x >= swatches!.x + swatches!.width : copy!.x + copy!.width <= swatches!.x).toBe(true);
        expect(title!.height).toBeLessThan(150);
        expect(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(28);
      }
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      await visitDeferredSections(page);
      await mkdir(qaOutput('docs/qa/refinement'), { recursive: true });
      await page.screenshot({ path: qaOutput(`docs/qa/refinement/home-${locale}-${width}.png`), scale: 'css', animations: 'disabled' });
      if ([390, 1536].includes(width)) await page.screenshot({ path: qaOutput(`docs/qa/refinement/home-${locale}-${width}-full.png`), scale: 'css', fullPage: true, animations: 'disabled', style: fullPageStyle });
    }
  }
});
