import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { productCopy } from '../apps/web/src/lib/product-copy';
import { locales } from '../apps/web/src/lib/locales';

// Explicit software WebGL for reproducible headless acceptance; not physical mobile GPU evidence.
test.use({ launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }, reducedMotion: 'reduce' });

test('3D controls, formats, finishes, demand rendering, exports and resource budgets', async ({ page }, info) => {
  test.skip(info.project.name === 'tablet', 'Desktop and mobile cover the same engine.');
  test.setTimeout(180000);
  await mkdir('docs/qa/milestone-3', { recursive: true });
  const c = productCopy.fr;
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');
  const heap = async () => { const result = await client.send('Performance.getMetrics'); return Object.fromEntries(result.metrics.filter(m => ['JSHeapUsedSize', 'JSHeapTotalSize', 'TaskDuration', 'ScriptDuration'].includes(m.name)).map(m => [m.name, m.value])); };
  await page.goto('/fr/products/sample-1?category=limestone');
  const initialMetrics = await heap();
  const initialScripts = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => (r as PerformanceResourceTiming).initiatorType === 'script').map(r => r.name));
  const initialBodies = await Promise.all(initialScripts.map(async url => (await page.request.get(url)).text()));
  expect(initialBodies.some(body => body.includes('THREE.WebGLRenderer'))).toBe(false);
  const started = Date.now();
  await page.getByRole('button', { name: c.activate, exact: true }).click();
  await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state', 'ready', { timeout: 45000 });
  const activationMs = Date.now() - started;
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute('data-render-count', /\d+/);
  await page.waitForTimeout(1500); // Allow shader/environment setup to settle before measuring idle rendering.
  const activatedMetrics = await heap();
  const activationScripts = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => (r as PerformanceResourceTiming).initiatorType === 'script').map(r => ({ url: r.name, bytes: (r as PerformanceResourceTiming).encodedBodySize })));
  const baseline = await canvas.evaluate(node => ({ ...node.dataset }));
  expect(Number(baseline.dpr)).toBeLessThanOrEqual(1.5);
  const count = Number(baseline.renderCount);
  await page.waitForTimeout(600);
  expect(Number(await canvas.getAttribute('data-render-count')) - count).toBeLessThanOrEqual(1);
  for (const label of [c.rotateLeft, c.rotateRight, c.zoomIn, c.zoomOut, c.edge, c.reset]) await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: c.finishNames[1], exact: true }).click();
  await page.locator('.product-configuration summary').click();
  for (let i = 0; i < 9; i++) {
    await expect(page.locator('.shape-options button')).toHaveCount(1);
    await page.locator('.shape-options button').first().click();
    await page.getByRole('button', { name: c.finishNames[i % 3], exact: true }).click();
  }
  await page.locator('.gallery-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const replaced = await canvas.evaluate(node => ({ ...node.dataset }));
  expect(Number(replaced.textures)).toBeLessThanOrEqual(Number(baseline.textures) + 2);
  expect(Number(replaced.geometries)).toBeLessThanOrEqual(Number(baseline.geometries) + 1);
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(a11y.violations).toEqual([]);
  await page.locator('.product-related').scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-paused', 'true');
  await page.waitForTimeout(200); // Settle the one pending frame while Canvas changes its frameloop.
  const hiddenCount = Number(await canvas.getAttribute('data-render-count'));
  await page.waitForTimeout(500);
  expect(Number(await canvas.getAttribute('data-render-count'))).toBe(hiddenCount);
  await page.locator('.gallery-stage').scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-paused', 'false');
  const frameBeforeDrag = Number(await canvas.getAttribute('data-render-count'));
  const bounds = (await canvas.boundingBox())!;
  const dragStart = Date.now();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * .8, bounds.y + bounds.height * .55, { steps: 30 });
  await page.mouse.up();
  const dragDurationMs = Date.now() - dragStart;
  const dragRenderCount = Number(await canvas.getAttribute('data-render-count')) - frameBeforeDrag;
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  for (const kind of ['png', 'glb'] as const) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: new RegExp(kind.toUpperCase()) }).click();
    const download = await downloadPromise;
    const path = `docs/qa/milestone-3/demo-${info.project.name}.${kind}`;
    await download.saveAs(path);
    const bytes = await readFile(path);
    if (kind === 'png') expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    else {
      expect(bytes.subarray(0, 4).toString()).toBe('glTF');
      const jsonLength = bytes.readUInt32LE(12);
      const json = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString().trim());
      expect(json.images.length).toBeGreaterThan(0);
      expect(json.images.every((image: { bufferView?: number; uri?: string }) => image.bufferView !== undefined && !image.uri)).toBe(true);
      expect(json.nodes[0].extras.note).toContain('approximated');
      expect(json.materials.some((material: { pbrMetallicRoughness: { metallicFactor: number } }) => material.pbrMetallicRoughness.metallicFactor === 0)).toBe(true);
    }
  }
  await page.screenshot({ path: `docs/qa/milestone-3/viewer-${info.project.name}.png`, scale: 'css' });
  const activatedScripts = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => (r as PerformanceResourceTiming).initiatorType === 'script').map(r => ({ url: r.name, bytes: (r as PerformanceResourceTiming).encodedBodySize })));
  expect(activatedScripts.some(r => !initialScripts.includes(r.url))).toBe(true);
  await page.getByRole('button', { name: c.static, exact: true }).click();
  await expect(canvas).toHaveCount(0);
  await client.send('HeapProfiler.collectGarbage');
  const disposedMetrics = await heap();
  await writeFile(`docs/qa/milestone-3/viewer-metrics-${info.project.name}.json`, JSON.stringify({ environment: 'Headless Chromium / SwiftShader; emulated viewport, not physical mobile', activationMs, initialMetrics, activatedMetrics, disposedMetrics, baseline, replaced, dragDurationMs, dragRenderCount, initialScriptCount: initialScripts.length, activatedScriptCount: activationScripts.length, activatedOnlyScriptBytes: activationScripts.filter(r => !initialScripts.includes(r.url)).reduce((sum, r) => sum + r.bytes, 0), exportOnlyScriptBytes: activatedScripts.filter(r => !activationScripts.some(a => a.url === r.url)).reduce((sum, r) => sum + r.bytes, 0) }, null, 2));
  await page.getByRole('button', { name: c.activate, exact: true }).click();
  await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state', 'ready', { timeout: 30000 });
  await expect(canvas).toHaveCount(1);
  await canvas.evaluate(node => { const gl = node.getContext('webgl2'); gl?.getExtension('WEBGL_lose_context')?.loseContext(); });
  await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state', 'failed');
  await expect(canvas).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.retry, exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test('3D responsive and RTL activation matrix', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Complete matrix once.');
  test.setTimeout(240000);
  for (const locale of locales) for (const width of [320, 390, 430, 768, 1024, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/products/sample-1`);
    await page.getByRole('button', { name: productCopy[locale].activate, exact: true }).click();
    await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state', 'ready', { timeout: 30000 });
    await expect(page.locator('canvas')).toHaveCount(1);
    await expect(page.locator('canvas')).toHaveAttribute('data-render-count', /\d+/);
    await page.getByRole('button', { name: productCopy[locale].edge, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([390, 1536].includes(width)) await page.screenshot({ path: `docs/qa/milestone-3/viewer-${locale}-${width}.png`, scale: 'css' });
    await page.getByRole('button', { name: productCopy[locale].static, exact: true }).click();
    await expect(page.locator('canvas')).toHaveCount(0);
  }
});

test('WebGL initialization failure returns an accessible static preview', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Failure mode once.');
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto('/ar/products/sample-1');
  await page.getByRole('button', { name: productCopy.ar.activate, exact: true }).click();
  await expect(page.locator('.gallery-stage')).toHaveAttribute('data-viewer-state', 'failed', { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.studio-status')).toHaveText(productCopy.ar.failure);
});
