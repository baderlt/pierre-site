import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
import {qaOutput} from './qa-output';

for(const locale of ['fr','en','ar'])test(`${locale}: configured simple map, mobile layout and directions`,async({page})=>{
  let tileLoaded=false;
  page.on('response',r=>{if(new URL(r.url()).hostname==='tile.openstreetmap.org'&&r.status()===200)tileLoaded=true;});
  await page.goto(`/${locale}`);
  const section=page.locator('.home-location');
  test.skip(await section.count()===0,'No approved public magasin location is configured.');
  await section.scrollIntoViewIfNeeded();
  const iframe=section.locator('iframe');
  test.skip(await iframe.count()===0,'Configured link has no unambiguous coordinates; Google Maps fallback is shown.');
  await expect(iframe).toHaveAttribute('loading','lazy');
  await expect(iframe).toHaveAttribute('referrerpolicy','no-referrer');
  expect(await iframe.getAttribute('title')).toBeTruthy();
  const src=new URL((await iframe.getAttribute('src'))!);
  expect(src.origin).toBe('https://www.openstreetmap.org');
  expect(src.pathname).toBe('/export/embed.html');
  if(process.env.QA_EXPECT_MAP_PIN)expect(src.searchParams.get('marker')).toBe(process.env.QA_EXPECT_MAP_PIN);
  await expect(section.locator('.magasin-plane')).toHaveCount(0);
  const directions=section.locator('.magasin-card a');await directions.focus();await expect(directions).toBeFocused();await expect(directions).toHaveAttribute('rel','noopener noreferrer');
  // The lazy quotation section above can expand after a direct jump to the map.
  // Wait for that layout, then expose the iframe before testing real tile delivery.
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#quote-name')).toBeVisible();
  await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toBeInViewport({ratio:0.9});
  // Real provider verification, not mocked tiles or a fabricated map image.
  await expect(page.frameLocator('.magasin-map iframe').locator('canvas, .leaflet-map-pane').first()).toBeVisible();
  await expect(page.frameLocator('.magasin-map iframe').locator('.maplibregl-marker, .leaflet-marker-icon').first()).toBeVisible();
  await expect.poll(()=>tileLoaded,{timeout:20000}).toBe(true);
  const output=qaOutput('docs/qa/simple-map');
  await mkdir(output,{recursive:true});
  for(const width of [320,390,768,1536]){
    await page.setViewportSize({width,height:1024});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await section.screenshot({path:`${output}/${locale}-${width}.png`,animations:'disabled',style:'.site-header,.skip-link{visibility:hidden!important}'});
  }
  // Parent accessibility remains our responsibility; cross-origin provider UI is separate.
  expect((await new AxeBuilder({page}).include('.home-location').disableRules(['frame-tested']).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(section.locator('.magasin-plane')).toHaveCount(0);
});
