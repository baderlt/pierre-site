import { test, expect } from '@playwright/test';
const adminOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

test('admin languages, relationship edit pages and mobile RTL', async ({ page }) => {
  test.skip(!process.env.QA_ADMIN_LOCALE_CREDENTIALS, 'Requires a disposable local admin account.');
  page.setDefaultTimeout(15000);
  const account = JSON.parse(await readFile(process.env.QA_ADMIN_LOCALE_CREDENTIALS!, 'utf8'));
  const output = 'docs/qa/admin-languages';
  await mkdir(output, { recursive: true });
  const checks: unknown[] = [];
  const failures: string[] = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 500) failures.push(`${response.status()} ${response.url()}`); });
  const locales = [
    { code: 'fr', dir: 'ltr', total: 'Total des produits', identity: 'Identité et publication', required: 'obligatoire' },
    { code: 'en', dir: 'ltr', total: 'Total products', identity: 'Identity & publication', required: 'required' },
    { code: 'ar', dir: 'rtl', total: 'إجمالي المنتجات', identity: 'الهوية والنشر', required: 'مطلوب' },
  ];
  const switchLanguage = async (code: string) => {
    await page.locator('#admin-locale').selectOption(code);
    await Promise.all([page.waitForNavigation(), page.locator('.admin-language-switcher button').click()]);
    await expect(page.locator('html')).toHaveAttribute('lang', code);
  };
  await page.goto(adminOrigin+'/admin/login');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  for (const locale of locales) {
    await switchLanguage(locale.code);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
    const a11y = await new AxeBuilder({ page }).analyze();
    checks.push({ page: 'login', locale: locale.code, violations: a11y.violations.map(v => ({ id: v.id, impact: v.impact })) });
    expect(a11y.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  }
  await page.locator('input[type="email"]').fill(account.email);
  await page.locator('input[type="password"]').fill(account.password);
  await page.locator('button[type="submit"]').last().click();
  await expect(page).toHaveURL(adminOrigin+'/admin');

  for (const locale of locales) {
    await page.goto(`${adminOrigin}/admin/stone-types/${account.material_id}/edit?qa=locale`);
    const target = page.url();
    await switchLanguage(locale.code);
    expect(page.url()).toBe(target);
    await expect(page.getByText(locale.identity, { exact: true })).toBeVisible();
    const name = page.locator('input[id="form.translations.fr.name"]');
    await name.fill('');
    // Trigger a real Livewire request; validation must remain in the session locale.
    await page.locator('form[wire\\:submit="save"]').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await expect(page.getByText(new RegExp(locale.required)).first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
    await page.reload(); // Discard the unsaved validation fixture.
    for (const width of [320, 390, 1536]) {
      await page.setViewportSize({ width, height: width === 1536 ? 1024 : 844 });
      await expect(page.locator('#admin-locale')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      checks.push({ page: 'material edit', locale: locale.code, width, overflow: false });
    }
    await page.goto(`${adminOrigin}/admin/categories/${account.category_id}/edit`);
    await expect(page.getByText(locale.identity, { exact: true })).toBeVisible();
    await page.goto(adminOrigin+'/admin');
    await expect(page.getByText(locale.total, { exact: true })).toBeVisible();
    for (const width of [320, 390, 1536]) {
      await page.setViewportSize({ width, height: width === 1536 ? 1024 : 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (width !== 320) await page.screenshot({ path: `${output}/dashboard-${locale.code}-${width}.png`, fullPage: true });
      checks.push({ page: 'dashboard', locale: locale.code, width, overflow: false });
    }
    const a11y = await new AxeBuilder({ page }).analyze();
    checks.push({ page: 'dashboard', locale: locale.code, violations: a11y.violations.map(v => ({ id: v.id, impact: v.impact })) });
    expect(a11y.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  }
  expect(failures).toEqual([]);
  await writeFile(`${output}/browser-results.json`, JSON.stringify({ passed: true, checks, browserErrors: failures }, null, 2));
});
