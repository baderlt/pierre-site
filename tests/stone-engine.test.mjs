import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createStoneResources, dimensionsInMeters, INITIAL, FINISHES } from '../apps/web/src/components/stone-engine/stone.js';

test('integrated geometry and image pipelines remain identical to the original prototype', async () => {
  for (const file of ['stone.js', 'images.js']) assert.equal(await readFile(`apps/web/src/components/stone-engine/${file}`, 'utf8'), await readFile(`prototype/src/${file}`, 'utf8'));
});
test('integrated engine preserves six-face PBR materials, meter dimensions and GPU disposal', () => {
  for (const finish of Object.keys(FINISHES)) {
    const settings = { ...INITIAL, width: 180, height: 120, thickness: 3, finish, ...FINISHES[finish] };
    const resource = createStoneResources({ color: {}, bump: {} }, settings);
    assert.deepEqual(dimensionsInMeters(settings), [1.8, 1.2, 0.03]);
    assert.equal(resource.materials.length, 6);
    assert.equal(resource.materials[4].clearcoat, FINISHES[finish].clearcoat);
    let disposed = 0;
    [resource.geometry, ...resource.materials, ...resource.materials.flatMap(m => [m.map, m.bumpMap])].forEach(item => item.addEventListener('dispose', () => disposed++));
    resource.dispose();
    assert.equal(disposed, 19);
  }
});
