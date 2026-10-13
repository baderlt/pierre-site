import { test, expect } from '@playwright/test';
import { publicCopy } from '../apps/web/src/lib/public-content';

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: shared gallery images keep distinct cards and dialog selection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error' && /same key|unique.*key|non-unique/i.test(message.text())) errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${locale}/applications`);
    const cards = page.locator('.illustration-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);
    const c = publicCopy[locale];
    for (let index = 0; index < count; index++) {
      const opener = cards.nth(index);
      const title = await opener.locator('h3').innerText();
      await opener.click();
      const dialog = page.locator('.illustration-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('h2')).toHaveText(title);
      await expect(dialog.locator('[aria-live]')).toContainText(`${index + 1} / ${count}`);
      await dialog.getByRole('button', { name: c.next, exact: true }).click();
      await expect(dialog.locator('[aria-live]')).toContainText(`${(index + 1) % count + 1} / ${count}`);
      await dialog.getByRole('button', { name: c.previous, exact: true }).click();
      await expect(dialog.locator('h2')).toHaveText(title);
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
    }
    const detail = await page.locator('.application-tile').first().getAttribute('href');
    await page.goto(detail!);
    await page.locator('.illustration-card').first().click();
    await expect(page.locator('.illustration-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });
}
