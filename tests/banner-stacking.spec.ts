import {qaOutput} from './qa-output';
import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

for(const locale of ['fr','en','ar'])test(`${locale}: banner text and controls are actually painted above responsive images`,async({page},info)=>{
  test.setTimeout(180000);
  const widths=info.project.name==='desktop'?[1024,1536]:info.project.name==='tablet'?[768]:[320,390,430];
  const out=process.env.QA_CORRECTIONS_DIR||qaOutput('docs/qa/milestone-6-final/corrections');
  await mkdir(out+'/screenshots',{recursive:true});const evidence=[];
  for(const width of widths)for(const route of ['products','about','applications','contact','quote','applications/stairs']){
    await page.setViewportSize({width,height:900});await page.goto(`/${locale}/${route}`);
    const hero=page.locator('.catalogue-hero,.page-hero');await expect(hero).toHaveCount(1);
    await hero.locator('img').evaluate(async img=>{await (img as HTMLImageElement).decode();await document.fonts.ready;});
    const result=await hero.evaluate(element=>{
      const text=[...element.querySelectorAll('h1,p,a,button')].filter(node=>node.textContent?.trim());
      const painted=text.map(node=>{const box=node.getBoundingClientRect();const top=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);return {tag:node.tagName,painted:top===node||!!(top&&node.contains(top))};});
      const background=element.querySelector(':scope > picture,:scope > img');
      const gradient=element.querySelector('.page-hero-shade');
      return {painted,backgroundZ:background?getComputedStyle(background).zIndex:null,gradientZ:gradient?getComputedStyle(gradient).zIndex:getComputedStyle(element,'::after').zIndex,gradient:gradient?getComputedStyle(gradient).backgroundImage:getComputedStyle(element,'::after').backgroundImage,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    expect(result.painted.length).toBeGreaterThan(1);expect(result.painted.every(node=>node.painted),`${locale}/${route}/${width}`).toBe(true);
    expect(Number(result.backgroundZ)).toBeLessThan(Number(result.gradientZ));expect(result.gradient).not.toBe('none');expect(result.overflow).toBe(false);
    await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
    evidence.push({locale,route,width,...result});
    if([390,1536].includes(width))await page.screenshot({path:`${out}/screenshots/banner-${route.replace('/','-')}-${locale}-${width}.png`});
  }
  await writeFile(`${out}/stacking-${locale}-${info.project.name}.json`,JSON.stringify(evidence,null,2));
});
