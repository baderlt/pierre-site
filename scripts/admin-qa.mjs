import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const credentials = JSON.parse(await readFile(process.env.QA_CREDENTIALS_FILE || '.tools/qa-credentials.json', 'utf8'));
const output = 'docs/qa/milestone-5';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [], result = { checks: [], layouts: [], accessibility: [] };
page.on('pageerror', error => errors.push(error.message));
const base = process.env.QA_API_URL || 'http://127.0.0.1:8000';
const externalRequests = new Set();
page.on('request', request => { if (request.url().startsWith('http') && !request.url().startsWith(base)) externalRequests.add(new URL(request.url()).origin); });
page.setDefaultNavigationTimeout(60000);
const productSlug = `qa-browser-product-${Date.now()}`;
const field = name => page.locator(`[id="form.${name}"]`);
async function checkLayout(name) {
  for (const width of [320, 390, 430, 768, 1024, 1536]) {
    await page.setViewportSize({ width, height: 1024 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    result.layouts.push({ page: name, width, overflow: false });
    if ([390, 1536].includes(width)) await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true });
  }
}
async function scan(name) {
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  result.accessibility.push({ page: name, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })) });
  expect(scan.violations, `${name}: automated WCAG A/AA scan`).toEqual([]);
}
try {
  await page.goto(`${base}/admin/login`);
  await page.locator('input[type=email]').fill(credentials.email);
  await page.locator('input[type=password]').fill(credentials.password);
  await page.locator('button[type=submit]').click();
  await page.waitForURL(`${base}/admin`);
  result.checks.push('login');
  await expect(page.getByText('Total products', { exact: true })).toBeVisible();
  await expect(page.getByText('Recent content changes', { exact: true })).toBeVisible();
  await checkLayout('dashboard'); await scan('dashboard');
  await page.goto(`${base}/admin/products/create`);
  await field('slug').fill(productSlug);
  await field('translations.fr.name').fill('QA ONLY · Pierre de démonstration');
  await page.getByRole('tab', { name: 'English', exact: true }).click();
  await field('translations.en.name').fill('QA ONLY · Demonstration stone');
  await page.getByRole('tab', { name: 'العربية', exact: true }).click();
  await field('translations.ar.name').fill('اختبار فقط · حجر توضيحي');
  await expect(field('translations.ar.name')).toHaveAttribute('dir', 'rtl');
  await field('category_id').selectOption({ label: 'limestone' });
  await field('stone_type_id').selectOption({ label: 'limestone' });
  await field('finishes').click();
  await page.getByRole('option', { name: 'honed', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.locator('select[id^="form.format_options."][id$=".format_id"]').selectOption({ label: 'slab' });
  await page.locator('button[type=submit]').filter({ hasText: /Créer|Create/ }).first().click();
  await page.waitForURL(/\/admin\/products\/\d+\/edit/);
  result.checks.push('product creation', 'three translation tabs', 'Arabic RTL input', 'allowed finish and format');
  await field('configuration.scale').fill('1.25');
  await field('configuration.rotation').fill('45');
  await field('configuration.thickness').fill('4');
  await page.locator('input[type=file]').nth(0).setInputFiles('apps/web/public/images/product-studio.webp');
  await expect(page.locator('.filepond--file-status-main').nth(0)).toContainText(/effectué|complete/i, { timeout: 30000 });
  await page.locator('input[type=file]').nth(1).setInputFiles('apps/web/public/images/product-beige-texture.webp');
  await expect(page.locator('.filepond--file-status-main').nth(1)).toContainText(/effectué|complete/i, { timeout: 30000 });
  await field('status').selectOption('published');
  await page.locator('button[type=submit]').filter({ hasText: /Sauvegarder|Enregistrer|Save/ }).first().click();
  await expect(page.getByText(/Sauvegardé|Enregistré|Saved/, { exact: true })).toBeVisible({ timeout: 30000 });
  const api = await (await page.request.get(`${base}/api/v1/products/${productSlug}?locale=ar`)).json();
  expect(api.data.saved_3d_configuration.scale).toBe(1.25); expect(api.data.saved_3d_configuration.thickness).toBe(4);
  expect(api.data.name).toBe('اختبار فقط · حجر توضيحي'); expect(api.data.texture.src).toContain('/media/');
  result.productSlug = productSlug;
  result.checks.push('image and texture upload', '3D configuration save', 'publish', 'published Arabic API');
  await checkLayout('product-editor'); await scan('product-editor');
  await page.goto(`${base}/admin/quotation-requests/${credentials.quote_id}/edit`);
  await expect(page.getByText('QA ONLY · Illustrative stone', { exact: true })).toBeVisible();
  await field('status').selectOption('in_review');
  await field('internal_notes').fill('QA ONLY · Browser review, no customer request.');
  await page.locator('button[type=submit]').filter({ hasText: /Sauvegarder|Enregistrer|Save/ }).first().click();
  await expect(page.getByText(/Sauvegardé|Enregistré|Saved/, { exact: true })).toBeVisible();
  await page.reload(); await expect(field('status')).toHaveValue('in_review');
  await scan('quotation'); await page.screenshot({ path: `${output}/quotation-1536.png`, fullPage: true });
  result.checks.push('quotation snapshot view', 'quotation status and private note persistence');
  await page.goto(`${base}/admin/media`); await scan('media-library');
  await page.screenshot({ path: `${output}/media-library-1536.png`, fullPage: true });
  expect((await page.request.post(`${base}/admin/logout`)).status()).toBe(419);
  result.checks.push('media library', 'real HTTP CSRF rejection');
  await page.getByRole('button', { name: 'Menu utilisateur', exact: true }).click();
  await page.getByText('Déconnexion', { exact: true }).click();
  await page.waitForURL(`${base}/admin/login`);
  result.checks.push('browser logout'); result.externalRequests = [...externalRequests]; result.errors = errors;
  expect(result.externalRequests).toEqual([]);
  if (errors.length) throw new Error('Browser errors: ' + errors.join('; '));
  result.passed = true;
} catch (error) {
  result.passed = false; result.failure = error.message;
  await page.screenshot({ path: `${output}/admin-failure.png`, fullPage: true });
  throw error;
} finally {
  await writeFile(`${output}/admin-browser-results.json`, JSON.stringify(result, null, 2));
  await browser.close();
}
console.log(JSON.stringify(result, null, 2));
