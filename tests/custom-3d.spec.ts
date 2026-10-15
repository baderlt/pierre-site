import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {productCopy} from '../apps/web/src/lib/product-copy';
import {geometryCopy} from '../apps/web/src/lib/geometry';
import type {Locale} from '../apps/web/src/lib/locales';
import {qaOutput} from './qa-output';

test.use({launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']},reducedMotion:'reduce'});
const api=process.env.QA_API_URL||'http://127.0.0.1:8028';
const path=(file:string)=>qaOutput(`docs/qa/custom-3d/${file}`);
async function loginAdmin(page:Page){const account=JSON.parse(await readFile('.tools/custom-3d/account.json','utf8'));await page.goto(api+'/admin/login');await page.locator('input[type="email"]').fill(account.email);await page.locator('input[type="password"]').fill(account.password);await page.locator('button[type="submit"]').last().click();await expect(page).toHaveURL(api+'/admin');}
test.beforeEach(async()=>{test.skip(!process.env.QA_CUSTOM_3D,'Requires feature-only synthetic products in the isolated local database.');await mkdir(path('screenshots'),{recursive:true});});

for(const locale of ['fr','en','ar'] as Locale[])test(`${locale}: optional 3D, responsive controls, static payload and RTL`,async({page,request},info)=>{
  test.skip(info.project.name!=='desktop','The complete six-width matrix runs once.');
  test.setTimeout(240000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const shape of ['disabled','circle','glb']){
    const reads:string[]=[];const onRequest=(r:{url():string})=>reads.push(r.url());page.on('request',onRequest);
    const response=await page.goto(`/${locale}/products/qa-custom3d-${shape}`);expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
    await expect(page.locator('canvas')).toHaveCount(0);
    if(shape==='disabled'){
      await expect(page.locator('.studio-activate,.studio-controls,.studio-loading,.product-configuration')).toHaveCount(0);
      const product=await request.get(`${api}/api/v1/products/qa-custom3d-disabled?locale=${locale}`);const dto=(await product.json()).data;
      expect(dto.viewer_available).toBe(false);expect(dto.viewer).toBeNull();expect(dto.uploaded_model).toBeNull();expect(dto.texture).toBeNull();
    }else{
      await expect(page.getByRole('button',{name:productCopy[locale].activate,exact:true})).toBeVisible();
      await page.locator('.product-configuration summary').click();
      if(shape==='circle')await expect(page.locator('input[data-parameter="diameter"]')).toBeEditable();
      else await expect(page.locator('.product-configuration input')).toHaveCount(0);
    }
    for(const width of [320,390,430,768,1024,1536]){
      await page.setViewportSize({width,height:1024});await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if([390,1536].includes(width)){await page.locator('.product-gallery').scrollIntoViewIfNeeded();await page.screenshot({path:path(`screenshots/${shape}-${locale}-${width}.png`),fullPage:true});}
    }
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    expect(reads.filter(url=>/\/media\/\d+\/(model|texture)(?:\?|$)/.test(url))).toEqual([]);
    const resources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>(r as PerformanceResourceTiming).initiatorType==='script').map(r=>r.name));
    for(const url of resources){const body=await (await page.request.get(url)).text();expect(body.includes('THREE.WebGLRenderer')).toBe(false);expect(body.includes('class GLTFLoader')).toBe(false);}
    page.off('request',onRequest);
    if(shape==='circle'){
      await page.locator('input[data-parameter="diameter"]').fill('150');await page.getByRole('button',{name:productCopy[locale].update,exact:true}).click();
      const link=page.locator('.product-quote-panel a');await expect(link).toHaveAttribute('href',/v_geometry=/);await link.click();
      await expect(page.locator('#quote-width')).toHaveValue('150');await expect(page.locator('#quote-height')).toHaveValue('150');await expect(page.locator('#quote-width')).toHaveAttribute('readonly','');
      await expect(page.locator('.quote-configuration-summary')).toContainText(geometryCopy[locale].circle);
      await page.locator('.quote-return').click();await page.locator('.product-configuration summary').click();await expect(page.locator('input[data-parameter="diameter"]')).toHaveValue('150');
    }
  }expect(errors).toEqual([]);
});

test('procedural examples, GLB materials, exports, repeated disposal and measured mobile cost',async({page},info)=>{
 test.skip(info.project.name==='tablet','Desktop and mobile cover the engine; six-width layout matrix covers tablet.');test.setTimeout(360000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const c=productCopy.fr;
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 const heap=async()=>{const {metrics}=await cdp.send('Performance.getMetrics');return Object.fromEntries(metrics.filter(m=>['JSHeapUsedSize','JSHeapTotalSize','TaskDuration','ScriptDuration'].includes(m.name)).map(m=>[m.name,m.value]));};
 const metrics:unknown[]=[];
 for(const shape of info.project.name==='mobile'?['circle','annular','polygon','glb']:['square','circle','hexagon','triangle','trapezoid','sector','annular','polygon','glb']){
  await page.goto(`/fr/products/qa-custom3d-${shape}`);const initial=await heap();
  const initialScripts=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>(r as PerformanceResourceTiming).initiatorType==='script').map(r=>r.name));
  const start=Date.now();await page.getByRole('button',{name:c.activate,exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state','ready',{timeout:45000});await expect(page.locator('canvas')).toHaveCount(1);
  const activationMs=Date.now()-start;await expect(page.locator('canvas')).toHaveAttribute('data-geometries',/\d+/);
  const activated=await heap();const budget=await page.locator('canvas').evaluate(n=>({...n.dataset}));
  // Existing lighting/shadow helpers allocate 16 renderer geometries; these fixtures add at most two.
  expect(Number(budget.dpr)).toBeLessThanOrEqual(1.5);expect(Number(budget.geometries)).toBeLessThanOrEqual(18);expect(Number(budget.drawCalls)).toBeLessThanOrEqual(12);
  await page.waitForTimeout(700);const frames=Number(await page.locator('canvas').getAttribute('data-render-count'));await page.waitForTimeout(500);expect(Number(await page.locator('canvas').getAttribute('data-render-count'))-frames).toBeLessThanOrEqual(1);
  await page.getByRole('button',{name:c.edge,exact:true}).click();await page.getByRole('button',{name:c.reset,exact:true}).click();
  await page.screenshot({path:path(`screenshots/geometry-${shape}-${info.project.name}.png`)});
  if(['circle','glb'].includes(shape))for(const kind of ['png','glb']){
   const waiting=page.waitForEvent('download');await page.getByRole('button',{name:kind==='png'?c.png+' ↓':c.glb+' ↓',exact:true}).click();const download=await waiting;
   const output=path(`${shape}-${info.project.name}.${kind}`);await download.saveAs(output);const bytes=await readFile(output);
   if(kind==='glb'){expect(bytes.subarray(0,4).toString()).toBe('glTF');const j=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString().trim());if(shape==='glb'){expect(j.materials.map((m:{name:string})=>m.name).sort()).toEqual(['Edge limestone','Top red']);expect(j.meshes.flatMap((m:{primitives:unknown[]})=>m.primitives).length).toBe(2);}else expect(j.nodes[0].extras.geometry.shape).toBe('circle');}
   else expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
  }
  const transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({url:r.name,bytes:(r as PerformanceResourceTiming).encodedBodySize})));
  await page.getByRole('button',{name:c.static,exact:true}).click();await expect(page.locator('canvas')).toHaveCount(0);await cdp.send('HeapProfiler.collectGarbage');const disposed=await heap();
  metrics.push({shape,activationMs,initial,activated,disposed,budget,activationScriptBytes:transfers.filter(r=>r.url.includes('/_next/')&&r.url.endsWith('.js')&&!initialScripts.includes(r.url)).reduce((n,r)=>n+r.bytes,0),modelTextureBytes:transfers.filter(r=>/\/media\/\d+\/(model|texture)$/.test(r.url)).reduce((n,r)=>n+r.bytes,0)});
  if(['circle','glb'].includes(shape))for(let i=0;i<3;i++){await page.getByRole('button',{name:c.activate,exact:true}).click();await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state','ready');await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('canvas')).toHaveAttribute('data-geometries',/\d+/);expect(Number(await page.locator('canvas').getAttribute('data-geometries'))).toBeLessThanOrEqual(Number(budget.geometries));await page.getByRole('button',{name:c.static,exact:true}).click();await expect(page.locator('canvas')).toHaveCount(0);}
 }
 await writeFile(path(`runtime-${info.project.name}.json`),JSON.stringify({environment:'Headless Chromium, SwiftShader, reduced motion; emulated viewport, not physical mobile GPU',metrics},null,2));expect(errors).toEqual([]);
});

test('real geometry quotation, immutable snapshot and duplicate retry',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Real persistence workflow runs once.');
 test.skip(!process.env.QA_CUSTOM_3D,'Requires the synthetic isolated database.');
 await page.goto('/fr/products/qa-custom3d-circle');await page.locator('.product-configuration summary').click();await page.locator('[data-parameter="diameter"]').fill('150');await page.getByRole('button',{name:productCopy.fr.update,exact:true}).click();await page.locator('.product-quote-panel a').click();
 for(const [key,value]of Object.entries({quantity:'2',name:'QA ONLY Custom 3D',email:'qa-custom3d@example.test',location:'QA ONLY local fixture',description:'QA ONLY geometry verification; no business request.'}))await page.locator('#quote-'+key).fill(value);
 await page.locator('#quote-country').selectOption('MA');await page.locator('#quote-privacy').check();
 const sent=page.waitForRequest(r=>r.url().endsWith('/api/quotations')&&r.method()==='POST');const result=page.waitForResponse(r=>r.url().endsWith('/api/quotations')&&r.request().method()==='POST');await page.locator('.quote-submit').click();
 const payload=await sent;const response=await result;expect(response.status()).toBe(201);await expect(page.locator('.quote-success')).toBeVisible();
 const data=payload.postDataJSON();expect(data.items[0].geometry.parameters.diameter).toBe(150);expect(data.items[0].geometry.shape).toBe('circle');expect(data.items[0].configuration.geometry).toBeUndefined();
 const duplicate=await page.request.post('/api/quotations',{headers:{'Content-Type':'application/json','Idempotency-Key':payload.headers()['idempotency-key'],'Origin':new URL(page.url()).origin},data});expect(duplicate.ok()).toBe(true);expect((await duplicate.json()).reference).toBe((await response.json()).reference);
 await page.screenshot({path:path('screenshots/quotation-success.png'),fullPage:true});
});

test('active procedural dimensions rebuild without accumulating GPU resources',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Live rebuild is covered once; mobile activation is covered separately.');
 const c=productCopy.fr;await page.goto('/fr/products/qa-custom3d-circle');await page.locator('.product-configuration summary').click();await page.getByRole('button',{name:c.activate,exact:true}).click();await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state','ready');await expect(page.locator('canvas')).toHaveAttribute('data-geometries',/\d+/);
 const baseline=Number(await page.locator('canvas').getAttribute('data-geometries'));
 for(const diameter of [130,140,150]){const renders=Number(await page.locator('canvas').getAttribute('data-render-count'));await page.locator('[data-parameter="diameter"]').fill(String(diameter));await page.getByRole('button',{name:c.update,exact:true}).click();await expect(page.locator('.product-quote-panel a')).toHaveAttribute('href',new RegExp('v_width='+diameter));await page.locator('.gallery-stage').scrollIntoViewIfNeeded();await expect(page.locator('canvas')).toHaveAttribute('data-paused','false');await expect.poll(async()=>Number(await page.locator('canvas').getAttribute('data-render-count'))).toBeGreaterThan(renders);expect(Number(await page.locator('canvas').getAttribute('data-geometries'))).toBeLessThanOrEqual(baseline+1);expect(Number(await page.locator('canvas').getAttribute('data-textures'))).toBeLessThanOrEqual(8);}
 const waiting=page.waitForEvent('download');await page.getByRole('button',{name:c.glb+' ↓',exact:true}).click();const download=await waiting,output=path('resized-circle.glb');await download.saveAs(output);const bytes=await readFile(output),j=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString().trim());expect(j.nodes[0].extras.dimensionsCm.width).toBe(150);expect(j.nodes[0].extras.geometry.parameters.diameter).toBe(150);
 await page.locator('.gallery-stage').screenshot({path:path('screenshots/resized-circle.png')});await page.getByRole('button',{name:c.static,exact:true}).click();await expect(page.locator('canvas')).toHaveCount(0);
});

test('Filament translated controls and responsive layouts',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Admin language and desktop/mobile matrix runs once.');
 test.skip(!process.env.QA_CUSTOM_3D,'Requires a synthetic admin and isolated products.');test.setTimeout(180000);
 const fixtures=JSON.parse(await readFile('.tools/custom-3d/fixtures.json','utf8'));await loginAdmin(page);
 for(const locale of ['fr','en','ar']){
  await page.goto(api+'/admin/products/create');await page.waitForLoadState('networkidle');await page.locator('#admin-locale').selectOption(locale);await Promise.all([page.waitForNavigation(),page.locator('.admin-language-switcher button').click()]);
  await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  const enabled=page.locator('[id="form.viewer_enabled"]');await expect(enabled).toHaveAttribute('aria-checked','false');await expect(page.locator('[id="form.configuration.source"]')).toHaveCount(0);
  await page.goto(`${api}/admin/products/${fixtures.circle.id}/edit`);await expect(page.locator('[id="form.viewer_enabled"]')).toHaveAttribute('aria-checked','true');
  for(const width of [390,1536]){await page.setViewportSize({width,height:1024});await page.locator('[id="form.viewer_enabled"]').scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);await page.screenshot({path:path(`screenshots/admin-${locale}-${width}.png`),fullPage:true});await page.getByRole('region',{name:locale==='fr'?'Configuration 3D du produit':locale==='ar'?'إعداد العرض ثلاثي الأبعاد للمنتج':'3D Product Configuration',exact:true}).screenshot({path:path(`screenshots/admin-controls-${locale}-${width}.png`)});}
  const a11y=await new AxeBuilder({page}).analyze();expect(a11y.violations.filter(v=>['serious','critical'].includes(v.impact||''))).toEqual([]);
 }
});

test('Filament GLB rejection, replacement and immediate disable protection',async({page,request},info)=>{
 test.skip(info.project.name!=='desktop','Model publication lifecycle runs once against isolated fixtures.');
 const fixtures=JSON.parse(await readFile('.tools/custom-3d/fixtures.json','utf8'));await loginAdmin(page);
 await page.goto(`${api}/admin/products/${fixtures.glb.id}/edit`);await page.waitForLoadState('networkidle');await page.locator('#admin-locale').selectOption('en');await Promise.all([page.waitForNavigation(),page.locator('.admin-language-switcher button').click()]);
 if(await page.locator('[id="form.viewer_enabled"]').getAttribute('aria-checked')==='false'){await page.locator('[id="form.viewer_enabled"]').click();await expect(page.locator('[id="form.configuration.source"]')).toBeVisible();await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect.poll(async()=> (await (await request.get(`${api}/api/v1/products/${fixtures.glb.slug}`)).json()).data.viewer_available).toBe(true);await page.reload();}
 const previousModelUrl=(await (await request.get(`${api}/api/v1/products/${fixtures.glb.slug}`)).json()).data.viewer.model.url;
 const file=page.locator('input[type="file"]').last();await file.setInputFiles({name:'invalid.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('not a model')});await expect(page.locator('.filepond--file-status-main')).toHaveText('Upload complete');
 await page.locator('form[wire\\:submit="save"] button[type="submit"]').first().click();await expect(page.getByText('The upload GLB Model field must be a file of type: model/gltf-binary, application/octet-stream.',{exact:true})).toBeVisible();
 await page.reload();const malformed=await readFile('.tools/custom-3d/two-materials.glb');malformed[20]=91;await page.locator('input[type="file"]').last().setInputFiles({name:'malformed.glb',mimeType:'model/gltf-binary',buffer:malformed});await expect(page.locator('.filepond--file-status-main')).toHaveText('Upload complete');await page.locator('form[wire\\:submit="save"] button[type="submit"]').first().click();await expect(page.getByText('Malformed glTF JSON.',{exact:true})).toBeVisible();
 await page.reload();await page.locator('input[type="file"]').last().setInputFiles('.tools/custom-3d/two-materials.glb');await expect(page.locator('.filepond--file-status-main')).toHaveText('Upload complete');await page.locator('form[wire\\:submit="save"] button[type="submit"]').first().click();await expect(page.getByText('Saved',{exact:true})).toBeVisible();
 const published=(await (await request.get(`${api}/api/v1/products/${fixtures.glb.slug}`)).json()).data;const modelUrl=published.viewer.model.url;expect(published.viewer.model.validated).toBe(true);expect(modelUrl).not.toBe(previousModelUrl);expect((await request.get(previousModelUrl)).status()).toBe(404);
 await page.reload();await expect(page.locator('[id="form.viewer_enabled"]')).toHaveAttribute('aria-checked','true');
 await page.locator('[id="form.viewer_enabled"]').click();await expect(page.locator('[id="form.configuration.source"]')).toHaveCount(0);await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect.poll(async()=> (await (await request.get(`${api}/api/v1/products/${fixtures.glb.slug}`)).json()).data.viewer_available).toBe(false);
 expect((await request.get(modelUrl)).status()).toBe(404);
 const dto=await request.get(`${api}/api/v1/products/${fixtures.glb.slug}`);expect((await dto.json()).data.viewer).toBeNull();
 await page.locator('[id="form.viewer_enabled"]').click();await expect(page.locator('[id="form.configuration.source"]')).toBeVisible();await page.getByRole('button',{name:'Save changes',exact:true}).click();
 await expect.poll(async()=> (await request.get(modelUrl)).status()).toBe(200);
 await writeFile(path('admin-model.json'),JSON.stringify({validated:true,replaced:true,disabled_download_status:404,reenabled_download_status:200,original_private:true},null,2));
});

test('Filament displays the persisted geometry quotation snapshot',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Private snapshot visibility runs once.');await loginAdmin(page);await page.waitForLoadState('networkidle');await page.locator('#admin-locale').selectOption('en');await Promise.all([page.waitForNavigation(),page.locator('.admin-language-switcher button').click()]);
 await page.goto(api+'/admin/quotation-requests');await page.locator('input[type="search"]').last().fill('qa-custom3d@example.test');const row=page.locator('tbody tr').filter({hasText:'qa-custom3d@example.test'}).first();await expect(row).toBeVisible();await row.getByRole('link',{name:'Edit',exact:true}).click();
 await expect(page.locator('main')).toContainText('"diameter":150');await expect(page.locator('main')).toContainText('"shape":"circle"');await page.screenshot({path:path('screenshots/admin-quotation-snapshot.png'),fullPage:true});
});
