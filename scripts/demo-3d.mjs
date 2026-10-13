import { chromium } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';

const directory = process.env.QA_OUTPUT_DIR || 'docs/qa/milestone-3';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 850 }, reducedMotion: 'reduce', recordVideo: { dir: 'test-results/recordings', size: { width: 1280, height: 850 } } });
const page = await context.newPage();
try {
  await page.goto(`${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/fr/products/sample-1`);
  await page.locator('.studio-activate').click();
  await page.locator('.gallery-stage[data-viewer-state="ready"]').waitFor({ timeout: 30000 });
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * .4, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .7, box.y + box.height * .55, { steps: 40 });
  await page.mouse.up();
  for (const label of ['Agrandir', 'Voir l’épaisseur', 'Réinitialiser la caméra']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.waitForTimeout(600);
  }
  await page.locator('.product-configuration summary').click();
  const finishCount=await page.locator('.finish-options button').count();
  const formatCount=await page.locator('.shape-options button').count();
  for (let index = 0; index < finishCount; index++) {
    await page.locator('.finish-options button').nth(index).click();
    await page.locator('.shape-options button').nth(index % formatCount).click();
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }
  await page.locator('.shape-options button').first().click();
  await page.getByRole('button', { name: 'Réinitialiser la caméra', exact: true }).click();
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${directory}/3d-demonstration.png`, scale: 'css' });
  await page.locator('.studio-photo-button').click();
  await page.waitForTimeout(500);
} finally {
  const video = page.video();
  await context.close();
  if (video) await rename(await video.path(), `${directory}/3d-demonstration.webm`);
  await browser.close();
}
