# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> fr: public pages, gallery focus and demo quotation
- Location: tests\public-pages.spec.ts:9:35

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('.quote-success')
Expected: focused
Received: inactive
Timeout:  20000ms

Call log:
  - Expect "toBeFocused" locator('.quote-success') with timeout 20000ms
  - waiting for locator('.quote-success')
    40 × locator resolved to <div role="status" tabindex="-1" class="quote-success">…</div>
       - unexpected value "inactive"

```

```yaml
- status:
  - heading "Demande enregistrée" [level=2]
  - paragraph: Votre demande a été enregistrée. Conservez cette référence pour vos échanges. Elle ne constitue ni une commande ni une offre commerciale.
  - paragraph: TS-M6D6XLCAN350SZY4
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { mkdir } from 'node:fs/promises';
  4  | import { publicCopy, applicationSlugs } from '../apps/web/src/lib/public-content';
  5  | import { quotationCopy,getQuotationCopy, validateQuotation, buildQuotationDraft, quotationSelectionFromParams, type QuotationFields } from '../apps/web/src/lib/quotation';
  6  | const locales = ['fr', 'en', 'ar'] as const;
  7  | const routes = ['applications', 'about', 'contact', 'quote', 'applications/stairs'];
  8  | 
  9  | for (const locale of locales) test(`${locale}: public pages, gallery focus and demo quotation`, async ({ page }) => {
  10 |   const c = publicCopy[locale]; const q = getQuotationCopy(locale);
  11 |   const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  12 |   for (const route of routes) {
  13 |     await page.goto(`/${locale}/${route}`);
  14 |     await expect(page.locator('h1')).toHaveCount(1);
  15 |     await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  16 |     expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  17 |   }
  18 |   await page.goto(`/${locale}/applications`);
  19 |   const opener = page.locator('.illustration-card').first(); await opener.click();
  20 |   const dialog = page.locator('.illustration-dialog'); await expect(dialog).toBeVisible();
  21 |   await dialog.getByRole('button', { name: c.next, exact: true }).click();
  22 |   await expect(dialog.locator('[aria-live]')).toContainText('2 / 8');
  23 |   await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  24 |   await page.goto(`/${locale}/quote?product=sample-1&color=beige&page=2&v_shape=slab&v_finish=polished&v_width=100&v_height=80&v_thickness=42&quantity=25&unit=piece`);
  25 |   await expect(page.locator('#quote-quantity')).toHaveValue('25');
  26 |   await expect(page.locator('#quote-unit')).toHaveValue('piece');
  27 |   await page.locator('#quote-unit').selectOption('m2');
  28 |   await expect(page.locator('#quote-thickness')).toHaveValue('42');
  29 |   await page.locator('.locale-picker select').selectOption(locale === 'ar' ? 'en' : 'ar');
  30 |   await expect(page.locator('#quote-thickness')).toHaveValue('42');
  31 |   await page.locator('.locale-picker select').selectOption(locale);
  32 |   await page.locator('#quote-unit').selectOption('m2');
  33 |   await page.locator('.quote-submit').click(); await expect(page.locator('.quote-errors')).toBeFocused();
  34 |   await expect(page.locator('#quote-email')).toHaveAttribute('aria-invalid', 'true');
  35 |   await page.locator('.quote-errors a[href="#quote-email"]').click(); await expect(page.locator('#quote-email')).toBeFocused();
  36 |   for (const [key, value] of Object.entries({ quantity: '12.5', name: 'QA ONLY M6 Regression', email: 'qa-m6-regression@example.test', location: 'Demo city', description: 'Illustrative interior project for testing only.' })) await page.locator(`#quote-${key}`).fill(value);
  37 |   await page.locator('#quote-country').selectOption('MA');
  38 |   await page.locator('#quote-privacy').check();
  39 |   const submissions: string[] = []; page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()); });
> 40 |   await page.locator('.quote-submit').click(); await expect(page.locator('.quote-success')).toBeFocused();
     |                                                                                             ^ Error: expect(locator).toBeFocused() failed
  41 |   await expect(page.locator('.quote-success')).toContainText(q.successBody);
  42 |   expect(submissions.some(url=>url.endsWith('/api/quotations'))).toBe(true); expect(page.url()).not.toContain('demo%40');
  43 |   expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  44 |   expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  45 |   await expect(page.locator('.quote-success')).toContainText(/TS-[A-Z0-9]{16}/);
  46 |   await page.reload(); await expect(page.locator('#quote-name')).toHaveValue('');
  47 |   expect(errors).toEqual([]);
  48 | });
  49 | 
  50 | test('public page viewport matrix and screenshots', async ({ page }, info) => {
  51 |   test.skip(info.project.name !== 'desktop'); test.setTimeout(900000);
  52 |   await mkdir('docs/qa/milestone-4', { recursive: true });
  53 |   for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) for (const route of routes) {
  54 |     await page.setViewportSize({ width, height: 900 }); await page.goto(`/${locale}/${route}`);
  55 |     await page.evaluate(async () => { await document.fonts.ready; for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
  56 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${route}/${width}`).toBe(true);
  57 |     expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  58 |     await expect(page.locator('canvas')).toHaveCount(0);
  59 |     await page.screenshot({ path: `docs/qa/milestone-4/${route.replace('/', '-')}-${locale}-${width}.png`, scale: 'css' });
  60 |     if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-4/${route.replace('/', '-')}-${locale}-${width}-full.png`, fullPage: true, scale: 'css' });
  61 |   }
  62 | });
  63 | 
  64 | test('SSR routes, paginated application products, no-script safety and validation bounds', async ({ browser, request }, info) => {
  65 |   test.skip(info.project.name !== 'desktop');
  66 |   for (const locale of locales) for (const slug of applicationSlugs) expect((await request.get(`/${locale}/applications/${slug}`)).status()).toBe(200);
  67 |   expect((await request.get('/fr/applications/unknown')).status()).toBe(404);
  68 |   const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  69 |   await page.goto('/ar/quote'); await expect(page.locator('.quote-submit')).toBeDisabled();
  70 |   await expect(page.locator('.quotation-form [name]')).toHaveCount(0);
  71 |   await expect(page.locator('noscript .content-note')).toHaveText(getQuotationCopy('ar').noScript);
  72 |   await page.goto('/en/applications/stairs?page=2'); await expect(page.locator('.application-pagination')).toHaveCount(0);
  73 |   await expect(page.locator('.public-product-grid>a')).toHaveCount(0); await context.close();
  74 |   const fields: QuotationFields = { product: '', shape: 'slab', finish: 'honed', width: '180', height: '120', thickness: '3', quantity: '1', unit: 'm2', name: 'Demo', email: 'qa-m6-regression@example.test', phone: '', country: 'MA', location: 'Demo', description: 'Demo', privacy: true };
  75 |   expect(validateQuotation(fields, [], quotationCopy.en)).toEqual({});
  76 |   expect(quotationSelectionFromParams({ quantity: '25', unit: 'piece' })).toEqual({ quantity: '25', unit: 'piece' });
  77 |   expect(quotationSelectionFromParams({ quantity: '-3', unit: 'invalid' })).toEqual({ quantity: '', unit: 'm2' });
  78 |   expect(quotationSelectionFromParams({ quantity: '1.5', unit: 'piece' }).quantity).toBe('');
  79 |   const option = { id: 'sample-1', name: 'Demo', image: 'product-studio', configuration: { version: 1 as const, shape: 'slab' as const, finish: 'honed' as const, width: 180, height: 120, thickness: 3, scale: 1, rotation: 0 }, formats: ['slab' as const], finishes: ['honed' as const] };
  80 |   expect(validateQuotation({ ...fields, product: option.id, shape: 'block' }, [option], quotationCopy.en)).toHaveProperty('shape');
  81 |   expect(validateQuotation({ ...fields, product:option.id,unit: 'piece', quantity: '1.5' }, [option], quotationCopy.en)).toHaveProperty('quantity');
  82 |   const draft = buildQuotationDraft('en', { ...fields, product: option.id }, [option], quotationCopy.en);
  83 |   const realOption={...option,format_options:[{id:'10',name:'Large slab',geometry:'slab' as const,dimensions_cm:{width:180,height:120,thickness:3},verified:false},{id:'11',name:'Small slab',geometry:'slab' as const,dimensions_cm:{width:90,height:60,thickness:2},verified:false}],finish_options:[{id:'20',slug:'honed',name:'Honed',simulation:'honed'}]};
  84 |   const realDraft=buildQuotationDraft('en',{...fields,product:option.id,format_id:'11',width:'90',height:'60',thickness:'2'},[realOption],quotationCopy.en);expect(realDraft.items[0].format_id).toBe('11');expect(realDraft.items[0].custom_dimensions_requested).toBe(false);
  85 |   expect(draft.delivery.country_code).toBe('MA'); expect(draft.items[0].format_id).toBe('slab'); expect(draft.website).toBe('');
  86 |   expect(buildQuotationDraft('en', fields, [], quotationCopy.en).items).toEqual([]);
  87 |   for (const [key, value] of Object.entries({ product: 'unknown', shape: 'unsafe', finish: 'unknown', width: '501', thickness: '0', quantity: 'Infinity', email: 'invalid', phone: 'abc', unit: 'unknown', privacy: false })) expect(validateQuotation({ ...fields,product:option.id, [key]: value }, [option], quotationCopy.en)).toHaveProperty(key);
  88 | });
  89 | 
  90 | 
```