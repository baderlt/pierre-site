import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
import {qaOutput} from './qa-output';
import {validMapsLocation} from '../apps/web/src/lib/magasin';

const out=()=>qaOutput('docs/qa/homepage-targeted/after');

for(const locale of ['fr','en','ar'])test(`${locale}: targeted sections at six widths, lazy form, RTL and accessibility`,async({page,request})=>{
  await mkdir(out(),{recursive:true});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  let formCode=false;const pending:Promise<void>[]=[];
  page.on('response',response=>{if(response.url().includes('/_next/')&&response.url().endsWith('.js'))pending.push(response.text().then(text=>{if(text.includes('quote-product-search')&&text.includes('Idempotency-Key'))formCode=true;}).catch(()=>{}));});
  const reads:string[]=[];page.on('request',r=>{if(r.url().includes('/api/quotations'))reads.push(r.method());});
  await page.goto(`/${locale}`);await page.evaluate(()=>document.fonts.ready);await Promise.all(pending);
  expect(formCode).toBe(false);expect(reads).toEqual([]);
  const settings=await request.get(`${process.env.QA_API_URL||'http://127.0.0.1:8000'}/api/v1/site?locale=${locale}`);
  expect(settings.ok()).toBe(true);
  const contacts=(await settings.json()).data.contacts;
  const visible=!!contacts?.address?.trim()&&validMapsLocation(contacts?.maps_directions_url||'');
  await expect(page.locator('.home-location')).toHaveCount(visible?1:0);
  if(visible)await expect(page.locator('.magasin-card a')).toHaveAttribute('href',contacts.maps_directions_url);
  await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  const craftTitle=(await page.locator('#craft h2').textContent())!.trim();
  expect(craftTitle).not.toBe('');
  await page.locator('#contact').scrollIntoViewIfNeeded();await expect(page.locator('#quote-name')).toBeVisible();await Promise.all(pending);expect(formCode).toBe(true);
  await page.locator('#quote-name').fill('QA ONLY unsent input');
  for(const width of [320,390,430,768,1024,1536]){
    await page.setViewportSize({width,height:1024});
    await expect(page.locator('#quote-name')).toHaveValue('QA ONLY unsent input');
    await expect(page.locator('#craft h2')).toHaveText(craftTitle);await expect(page.locator('#craft .process-steps li')).toHaveCount(4);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for(const id of ['craft','contact']){
      const section=page.locator('#'+id);await section.scrollIntoViewIfNeeded();
      await section.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})))});
      await section.screenshot({path:`${out()}/${locale}-${width}-${id}.png`,animations:'disabled',style:'.site-header,.skip-link{visibility:hidden!important}'});
    }
  }
  await page.setViewportSize({width:390,height:844});await page.locator('#contact').scrollIntoViewIfNeeded();
  expect((await new AxeBuilder({page}).include('#craft').include('#contact').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('#craft li').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  expect(errors).toEqual([]);
});

test('lazy quotation loading preserves the placeholder space',async({page})=>{
  let release!:()=>void;
  const waiting=new Promise<void>(resolve=>{release=resolve;});
  let blocked=false;
  await page.route('**/_next/static/chunks/*.js',async route=>{
    const response=await route.fetch();
    const body=await response.text();
    if(body.includes('quote-product-search')&&body.includes('Idempotency-Key')){
      blocked=true;await waiting;
    }
    await route.fulfill({response,body});
  });
  try{
    await page.goto('/fr');await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(()=>blocked).toBe(true);
    const width=page.viewportSize()!.width;
    expect((await page.locator('.home-quote-active').boundingBox())!.height).toBeGreaterThanOrEqual(width<=767?1450:900);
  }finally{release();}
  await expect(page.locator('#quote-name')).toBeVisible();
});

test('same quotation validation, product selection and duplicate-safe uncertain recovery',async({page})=>{
  await page.goto('/fr#contact');await expect(page.locator('#quote-name')).toBeVisible();
  await page.locator('.quote-submit').click();await expect(page.locator('.quote-errors')).toBeFocused();
  await page.locator('.quote-errors a[href="#quote-email"]').click();await expect(page.locator('#quote-email')).toBeFocused();
  await expect(page.locator('#quote-product option')).not.toHaveCount(1);
  const product=await page.locator('#quote-product option').nth(1).getAttribute('value');
  await page.locator('#quote-product').selectOption(product!);await expect(page.locator('#quote-width')).toBeVisible();
  await page.setViewportSize({width:390,height:844});await expect(page.locator('#quote-product')).toHaveValue(product!);
  await page.locator('#quote-product').selectOption('');await expect(page.locator('#quote-width')).toHaveCount(0);
  await page.locator('#quote-name').fill('QA ONLY browser mock');await page.locator('#quote-email').fill('qa-only@example.test');
  await page.locator('#quote-country').selectOption('MA');await page.locator('#quote-location').fill('QA ONLY');await page.locator('#quote-description').fill('QA ONLY synthetic browser submission; intercepted before the backend.');await page.locator('#quote-privacy').check();
  const posts:{key:string|undefined;body:unknown}[]=[];
  await page.route('**/api/quotations',async route=>{
    if(route.request().method()!=='POST')return route.continue();
    posts.push({key:route.request().headers()['idempotency-key'],body:route.request().postDataJSON()});
    if(posts.length===1)return route.fulfill({status:503,json:{message:'uncertain'}});
    if(posts.length===2)return route.fulfill({status:429,headers:{'Retry-After':'1'},json:{message:'submission_failed'}});
    return route.fulfill({status:200,json:{reference:'TS-ABCDEFGHIJKLMNOP',duplicate:true}});
  });
  await page.locator('.quote-submit').click();await expect(page.locator('#quote-name')).toBeDisabled();
  await page.locator('.quote-submit').click();await expect.poll(()=>posts.length).toBe(2);await expect(page.locator('#quote-name')).toBeDisabled();
  await page.locator('.quote-submit').click();await expect(page.locator('.quote-success')).toBeFocused();await expect(page.locator('.quote-success')).toContainText('TS-ABCDEFGHIJKLMNOP');
  expect(posts).toHaveLength(3);expect(posts[1]).toEqual(posts[0]);expect(posts[2]).toEqual(posts[0]);
  expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});

test('location fixture: directions safety, translated layouts, keyboard and reduced motion',async({page})=>{
  const fixture=process.env.QA_LOCATION_URL;
  test.skip(!fixture,'Provide QA_LOCATION_URL backed by tests/fixtures/magasin-proxy.mjs; never overwrite real location settings.');
  for(const locale of ['fr','en','ar']){
    await page.goto(`${fixture}/${locale}`);const section=page.locator('.home-location');await section.scrollIntoViewIfNeeded();
    await expect(section).toContainText('QA ONLY — synthetic location, not TIME STONE’s address');
    const link=section.locator('.magasin-card a');await expect(link).toHaveAttribute('href','https://www.google.com/maps?q=QA+ONLY+NONBUSINESS+TEST+LOCATION');await expect(link).toHaveAttribute('rel','noopener noreferrer');
    await link.focus();await expect(link).toBeFocused();await expect(section.locator('iframe')).toHaveCount(0);await expect(section.locator('.magasin-map-fallback')).toBeVisible();
    for(const width of [320,390,430,768,1024,1536]){
      await page.setViewportSize({width,height:1024});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await section.screenshot({path:`${out()}/location-QA-ONLY-${locale}-${width}.png`,animations:'disabled',style:'.site-header,.skip-link{visibility:hidden!important}'});
    }
    expect((await new AxeBuilder({page}).include('.home-location').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    await page.emulateMedia({reducedMotion:'reduce'});await expect(section.locator('.magasin-plane')).toHaveCount(0);
  }
});

test('without JavaScript the homepage keeps the dedicated quotation destination',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto(`${process.env.QA_BASE_URL||'http://127.0.0.1:3000'}/ar#contact`);await expect(page.locator('#contact a[href="/ar/quote"]')).toBeVisible();
  await expect(page.locator('#contact form')).toHaveCount(0);await context.close();
});

test('manual keyboard activation when automatic mounting is suppressed focuses the existing form',async({page})=>{
  await page.addInitScript(()=>{const Native=window.IntersectionObserver;window.IntersectionObserver=class extends Native {observe(target:Element){if(!target.classList.contains('home-quote-mount'))super.observe(target);}};});
  await page.goto('/fr#contact');const button=page.locator('.home-quote-placeholder button');await button.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#quote-product-search')).toBeFocused();
});
