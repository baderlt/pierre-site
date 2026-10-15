import {test,expect} from '@playwright/test';

test('mobile hero crops preserve responsive selection without downloading desktop banners',async({page})=>{
  for(const locale of ['fr','en','ar'])for(const width of [320,390,430,479,480,767,768,1024,1536]){
    await page.setViewportSize({width,height:844});
    const transfers:string[]=[];
    const track=(request:{url():string})=>transfers.push(request.url());
    page.on('requestfinished',track);
    await page.goto(`/${locale}`);
    const image=page.locator('.hero-art img');
    await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.naturalHeight)).toBeGreaterThan(1);
    const current=await image.evaluate((i:HTMLImageElement)=>i.currentSrc);
    expect(current).toMatch(width<480?/\/hero_mobile$/:width<768?/\/preview$/:/\/banner$/);
    if(width<480){expect(transfers.some(url=>/\/media\/31\/(preview|banner)$/.test(url))).toBe(false);expect(await image.evaluate((i:HTMLImageElement)=>i.naturalHeight)).toBe(1280);}
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    page.off('requestfinished',track);
  }
});

test('deferred homepage imagery loads on approach and works without JavaScript',async({page,browser,baseURL})=>{
  await page.setViewportSize({width:390,height:844});
  const transfers:string[]=[];page.on('request',request=>transfers.push(request.url()));
  await page.goto('/fr',{waitUntil:'networkidle'});
  expect(transfers.some(url=>/\/media\/(18|32|61)\//.test(url))).toBe(false);
  for(const selector of ['.category-card:last-child img','.quarry-photo img','.architecture-photo img']){
    const image=page.locator(selector);await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.currentSrc.startsWith('http')&&i.complete&&i.naturalWidth>1)).toBe(true);
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844},baseURL});
  const fallback=await context.newPage();await fallback.goto('/fr');
  const image=fallback.locator('.category-card:last-child img').last();await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>1)).toBe(true);
  await context.close();
});

test('static product finishes use thumbnails before activation',async({page})=>{
  const images:string[]=[];page.on('request',request=>{if(request.resourceType()==='image')images.push(request.url());});
  await page.goto('/fr/products/sample-1',{waitUntil:'networkidle'});
  await expect(page.locator('canvas')).toHaveCount(0);
  const backgrounds=await page.locator('.finish-swatch').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundImage));
  expect(backgrounds.length).toBeGreaterThan(0);
  expect(backgrounds.every(value=>value.includes('/thumb'))).toBe(true);
  expect(images.some(url=>/\/media\/12\/texture$/.test(url))).toBe(false);
});

test('catalogue defers offscreen photos and restores them on approach and without JavaScript',async({page,browser,baseURL})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/fr/products',{waitUntil:'networkidle'});
  const banner=page.locator('.catalogue-custom img').first();
  expect(await banner.evaluate((image:HTMLImageElement)=>image.currentSrc.startsWith('data:'))).toBe(true);
  const last=page.locator('.product-card img').last();
  expect(await last.evaluate((image:HTMLImageElement)=>image.currentSrc.startsWith('data:'))).toBe(true);
  for(const image of [last,banner]){
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>1&&node.currentSrc.startsWith('http'))).toBe(true);
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844},baseURL});
  try{
    const fallback=await context.newPage();await fallback.goto('/fr/products');
    const image=fallback.locator('.product-card').last().locator('noscript img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>1)).toBe(true);
  }finally{await context.close();}
});

test('catalogue selects a sharp mobile derivative using the actual card width',async({browser,baseURL})=>{
  const context=await browser.newContext({viewport:{width:412,height:823},deviceScaleFactor:1.75,isMobile:true,baseURL});
  try{
    const page=await context.newPage();await page.goto('/fr/products');
    const image=page.locator('.product-card img').first();await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.currentSrc.startsWith('http'))).toBe(true);
    const selected=await image.evaluate(async(node:HTMLImageElement)=>{
      const bitmap=await createImageBitmap(await(await fetch(node.currentSrc)).blob());
      const result={src:node.currentSrc,width:bitmap.width,required:node.getBoundingClientRect().width*devicePixelRatio};bitmap.close();return result;
    });
    expect(selected.src).toMatch(/\/media\/\d+\/thumb$/);
    expect(selected.width).toBeGreaterThanOrEqual(Math.ceil(selected.required));
  }finally{await context.close();}
});
