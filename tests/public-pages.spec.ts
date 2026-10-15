import {qaOutput} from './qa-output';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { publicCopy, applicationSlugs } from '../apps/web/src/lib/public-content';
import { quotationCopy,getQuotationCopy, validateQuotation, buildQuotationDraft, quotationSelectionFromParams, type QuotationFields } from '../apps/web/src/lib/quotation';
const locales = ['fr', 'en', 'ar'] as const;
const routes = ['applications', 'about', 'contact', 'quote', 'applications/stairs'];

for (const locale of locales) test(`${locale}: public pages, gallery focus and demo quotation`, async ({ page }) => {
  const c = publicCopy[locale]; const q = getQuotationCopy(locale);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  for (const route of routes) {
    await page.goto(`/${locale}/${route}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
  await page.goto(`/${locale}/applications`);
  const opener = page.locator('.illustration-card').first(); await opener.click();
  const dialog = page.locator('.illustration-dialog'); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: c.next, exact: true }).click();
  await expect(dialog.locator('[aria-live]')).toContainText('2 / 8');
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  await page.goto(`/${locale}/quote?product=sample-1&color=beige&page=2&v_shape=slab&v_finish=polished&v_width=100&v_height=80&v_thickness=42&quantity=25&unit=piece`);
  await expect(page.locator('#quote-quantity')).toHaveValue('25');
  await expect(page.locator('#quote-unit')).toHaveValue('piece');
  await page.locator('#quote-unit').selectOption('m2');
  await expect(page.locator('#quote-thickness')).toHaveValue('42');
  await page.locator('.locale-picker select').selectOption(locale === 'ar' ? 'en' : 'ar');
  await expect(page.locator('#quote-thickness')).toHaveValue('42');
  await page.locator('.locale-picker select').selectOption(locale);
  await page.locator('#quote-unit').selectOption('m2');
  await page.locator('.quote-submit').click(); await expect(page.locator('.quote-errors')).toBeFocused();
  await expect(page.locator('#quote-email')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('.quote-errors a[href="#quote-email"]').click(); await expect(page.locator('#quote-email')).toBeFocused();
  for (const [key, value] of Object.entries({ quantity: '12.5', name: 'QA ONLY M6 Regression', email: 'qa-m6-regression@example.test', location: 'Demo city', description: 'Illustrative interior project for testing only.' })) await page.locator(`#quote-${key}`).fill(value);
  await page.locator('#quote-country').selectOption('MA');
  await page.locator('#quote-privacy').check();
  const submissions: string[] = []; page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()); });
  await page.locator('.quote-submit').click(); await expect(page.locator('.quote-success')).toBeFocused();
  await expect(page.locator('.quote-success')).toContainText(q.successBody);
  expect(submissions.some(url=>url.endsWith('/api/quotations'))).toBe(true); expect(page.url()).not.toContain('demo%40');
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await expect(page.locator('.quote-success')).toContainText(/TS-[A-Z0-9]{16}/);
  await page.reload(); await expect(page.locator('#quote-name')).toHaveValue('');
  expect(errors).toEqual([]);
});

test('public page viewport matrix and screenshots', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop'); test.setTimeout(900000);
  await mkdir(qaOutput('docs/qa/milestone-4'), { recursive: true });
  for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) for (const route of routes) {
    await page.setViewportSize({ width, height: 900 }); await page.goto(`/${locale}/${route}`);
    await page.evaluate(async () => { await document.fonts.ready; for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${route}/${width}`).toBe(true);
    expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.screenshot({ path: qaOutput(`docs/qa/milestone-4/${route.replace('/', '-')}-${locale}-${width}.png`), scale: 'css' });
    if ([390, 1536].includes(width)) await page.screenshot({ path: qaOutput(`docs/qa/milestone-4/${route.replace('/', '-')}-${locale}-${width}-full.png`), fullPage: true, scale: 'css' });
  }
});

test('SSR routes, paginated application products, no-script safety and validation bounds', async ({ browser, request }, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const locale of locales) for (const slug of applicationSlugs) expect((await request.get(`/${locale}/applications/${slug}`)).status()).toBe(200);
  expect((await request.get('/fr/applications/unknown')).status()).toBe(404);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto('/ar/quote'); await expect(page.locator('.quote-submit')).toBeDisabled();
  await expect(page.locator('.quotation-form [name]')).toHaveCount(0);
  await expect(page.locator('noscript .content-note')).toHaveText(getQuotationCopy('ar').noScript);
  await page.goto('/en/applications/stairs?page=2'); await expect(page.locator('.application-pagination')).toHaveCount(0);
  await expect(page.locator('.public-product-grid>a')).toHaveCount(0); await context.close();
  const fields: QuotationFields = { product: '', shape: 'slab', finish: 'honed', width: '180', height: '120', thickness: '3', quantity: '1', unit: 'm2', name: 'Demo', email: 'qa-m6-regression@example.test', phone: '', country: 'MA', location: 'Demo', description: 'Demo', privacy: true };
  expect(validateQuotation(fields, [], quotationCopy.en)).toEqual({});
  expect(quotationSelectionFromParams({ quantity: '25', unit: 'piece' })).toEqual({ quantity: '25', unit: 'piece' });
  expect(quotationSelectionFromParams({ quantity: '-3', unit: 'invalid' })).toEqual({ quantity: '', unit: 'm2' });
  expect(quotationSelectionFromParams({ quantity: '1.5', unit: 'piece' }).quantity).toBe('');
  const option = { id: 'sample-1', name: 'Demo', image: 'product-studio', configuration: { version: 1 as const, shape: 'slab' as const, finish: 'honed' as const, width: 180, height: 120, thickness: 3, scale: 1, rotation: 0 }, formats: ['slab' as const], finishes: ['honed' as const] };
  expect(validateQuotation({ ...fields, product: option.id, shape: 'block' }, [option], quotationCopy.en)).toHaveProperty('shape');
  expect(validateQuotation({ ...fields, product:option.id,unit: 'piece', quantity: '1.5' }, [option], quotationCopy.en)).toHaveProperty('quantity');
  const draft = buildQuotationDraft('en', { ...fields, product: option.id }, [option], quotationCopy.en);
  const realOption={...option,format_options:[{id:'10',name:'Large slab',geometry:'slab' as const,dimensions_cm:{width:180,height:120,thickness:3},verified:false},{id:'11',name:'Small slab',geometry:'slab' as const,dimensions_cm:{width:90,height:60,thickness:2},verified:false}],finish_options:[{id:'20',slug:'honed',name:'Honed',simulation:'honed'}]};
  const realDraft=buildQuotationDraft('en',{...fields,product:option.id,format_id:'11',width:'90',height:'60',thickness:'2'},[realOption],quotationCopy.en);expect(realDraft.items[0].format_id).toBe('11');expect(realDraft.items[0].custom_dimensions_requested).toBe(false);
  expect(draft.delivery.country_code).toBe('MA'); expect(draft.items[0].format_id).toBe('slab'); expect(draft.website).toBe('');
  expect(buildQuotationDraft('en', fields, [], quotationCopy.en).items).toEqual([]);
  for (const [key, value] of Object.entries({ product: 'unknown', shape: 'unsafe', finish: 'unknown', width: '501', thickness: '0', quantity: 'Infinity', email: 'invalid', phone: 'abc', unit: 'unknown', privacy: false })) expect(validateQuotation({ ...fields,product:option.id, [key]: value }, [option], quotationCopy.en)).toHaveProperty(key);
});

test('localized keyboard retry refetches public content after an API outage', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'desktop', 'Controlled desktop/mobile recovery matrix runs once against the shared local outage fixture.');
  test.skip(!process.env.QA_FAILURE_BASE_URL, 'Requires the isolated API failure/recovery fixture.');
  const origin = process.env.QA_FAILURE_BASE_URL!;
  expect(new URL(origin).hostname).toBe('127.0.0.1');
  const headings = { fr: 'Contenu indisponible', en: 'Content unavailable', ar: 'المحتوى غير متاح' };
  for (const width of [390, 1536]) for (const locale of ['fr', 'en', 'ar'] as const) {
    await page.setViewportSize({ width, height: 844 });
    await request.post('http://127.0.0.1:8041/qa/fail');
    const response = await page.goto(`${origin}/${locale}`);
    expect(response?.status()).toBe(500);
    await expect(page.locator('h1')).toHaveText(headings[locale]);
    await expect(page.locator('main[role="alert"]')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('.quote-success')).toHaveCount(0);
    await request.post('http://127.0.0.1:8041/qa/recover');
    await page.getByRole('button').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('main[role="alert"]')).toHaveCount(0);
  }
});

