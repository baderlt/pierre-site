import {test,expect} from '@playwright/test';

for(const [locale,message]of [['fr','Réessayez dans 17 secondes.'],['en','Retry in 17 seconds.'],['ar','أعد المحاولة بعد 17 ثانية.']])test(`${locale}: quotation throttling explains the server retry duration without claiming success`,async({page})=>{
  await page.goto(`/${locale}/quote`);
  await page.locator('#quote-name').fill('QA ONLY throttle UI');await page.locator('#quote-email').fill('qa-only@example.test');
  await page.locator('#quote-country').selectOption('MA');await page.locator('#quote-location').fill('QA ONLY');await page.locator('#quote-description').fill('Synthetic throttling interface test');await page.locator('#quote-privacy').check();
  let posts=0;await page.route('**/api/quotations',async route=>{if(route.request().method()!=='POST'){await route.continue();return;}posts++;await route.fulfill({status:429,contentType:'application/json',headers:{'Retry-After':'17'},body:JSON.stringify({message:'submission_failed'})});});
  await page.locator('.quote-submit').click();await expect(page.locator('.quotation-form [role=status]')).toContainText(message);
  await expect(page.locator('.quote-success')).toHaveCount(0);await expect(page.locator('#quote-name')).toHaveValue('QA ONLY throttle UI');expect(posts).toBe(1);
});
