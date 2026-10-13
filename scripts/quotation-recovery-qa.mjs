import {chromium,expect as baseExpect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const expect=baseExpect.configure({timeout:30000}),base='http://127.0.0.1:3001',out='docs/qa/milestone-6';
const browser=await chromium.launch();const context=await browser.newContext();const p=await context.newPage();p.setDefaultNavigationTimeout(90000);const result={checks:[]};
try{
 await p.goto(base+'/fr/quote');await p.locator('#quote-name').fill('QA ONLY M6 timeout');await p.locator('#quote-email').fill('qa-m6-timeout@example.test');await p.locator('#quote-country').selectOption('MA');await p.locator('#quote-location').fill('QA ONLY');await p.locator('#quote-description').fill('QA ONLY response-delivery failure test');await p.locator('#quote-privacy').check();
 let firstKey='',firstReference='',posts=0;
 const handler=async route=>{if(route.request().method()!=='POST'){await route.continue();return;}posts++;firstKey=route.request().headers()['idempotency-key'];const response=await route.fetch();expect(response.status()).toBe(201);firstReference=(await response.json()).reference;await new Promise(r=>setTimeout(r,14000));try{await route.fulfill({response});}catch{}};
 await p.route('**/api/quotations',handler);await p.locator('.quotation-form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});await expect(p.locator('.quotation-form [role=status]').first()).toContainText('Envoi non confirmé',{timeout:25000});await expect(p.locator('.quote-success')).toHaveCount(0);await expect(p.locator('#quote-name')).toHaveValue('QA ONLY M6 timeout');await expect(p.locator('#quote-name')).toBeDisabled();await p.unroute('**/api/quotations',handler);
 result.checks.push('Rapid repeated submissions generate only one POST');
 result.checks.push('Real Laravel persistence with delayed response beyond the browser timeout: no success and retained input');
 const response=p.waitForResponse(r=>r.url().endsWith('/api/quotations')&&r.request().method()==='POST');await p.locator('.quote-submit').click();const retry=await response;expect(retry.request().headers()['idempotency-key']).toBe(firstKey);expect(retry.status()).toBe(200);expect((await retry.json()).duplicate).toBe(true);await expect(p.locator('.quote-success bdi')).toHaveText(firstReference);expect(posts).toBe(1);
 result.reference=firstReference;result.checks.push('Exact retry reuses the idempotency key and returns the existing reference');
 expect(await p.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);result.checks.push('No personal data in localStorage or sessionStorage');result.passed=true;
}catch(e){result.passed=false;result.failure=e.message;throw e;}finally{await writeFile(out+'/network-recovery.json',JSON.stringify(result,null,2));await browser.close();}console.log(result);
