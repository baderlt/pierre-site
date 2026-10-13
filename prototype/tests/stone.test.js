import test from 'node:test';
import assert from 'node:assert/strict';
import { dimensionsInMeters, faceRepeats, createStoneResources, INITIAL, SHAPES, FINISHES } from '../src/stone.js';
import { validateUpload } from '../src/images.js';

test('centimeter dimensions produce proportional meter geometry for every shape', () => {
  for (const shape of Object.values(SHAPES)) {
    const settings = { ...INITIAL, ...shape.dimensions };
    const resource = createStoneResources({ color: {}, bump: {} }, settings);
    resource.geometry.computeBoundingBox();
    const bounds = resource.geometry.boundingBox;
    const actual = ['x', 'y', 'z'].map(axis => bounds.max[axis] - bounds.min[axis]);
    const expected = dimensionsInMeters(settings);
    actual.forEach((size, index) => assert.ok(Math.abs(size - expected[index]) < 0.00001));
    assert.equal(resource.geometry.groups.length, 6);
    assert.equal(resource.materials.length, 6);
    resource.dispose();
  }
});

test('invalid and extreme dimensions cannot enter the geometry pipeline', () => {
  for (const width of [0, -1, 501, Infinity, NaN, '', 'abc']) {
    assert.throws(() => dimensionsInMeters({ ...INITIAL, width }));
  }
  assert.deepEqual(dimensionsInMeters({ width: 0.5, height: 500, thickness: 1.5 }), [0.005, 5, 0.015]);
});

test('front covers the photograph and edges use proportionally narrow strips', () => {
  const repeats = faceRepeats([1.2, 1.8, 0.03], 1);
  assert.deepEqual(repeats[4], [1, 1]);
  assert.deepEqual(repeats[0], [0.025, 1]);
  assert.ok(Math.abs(repeats[2][1] - 1 / 60) < 1e-10);
  assert.deepEqual(faceRepeats([1, 1, 1], 2)[4], [2, 2]);
});

test('PBR finish presets change roughness, restrained bump and clearcoat', () => {
  for (const [finish, preset] of Object.entries(FINISHES)) {
    const resource = createStoneResources({ color: {}, bump: {} }, { ...INITIAL, finish, roughness: preset.roughness, bump: preset.bump });
    const material = resource.materials[4];
    assert.equal(material.metalness, 0);
    assert.equal(material.roughness, preset.roughness);
    assert.equal(material.clearcoat, preset.clearcoat);
    assert.ok(material.bumpScale <= 0.003);
    assert.equal(material.map.colorSpace, 'srgb');
    resource.dispose();
  }
  assert.ok(FINISHES.polished.roughness < FINISHES.honed.roughness);
  assert.ok(FINISHES.rough.bump > FINISHES.honed.bump);
});

test('all geometry, material and texture resources are disposed on replacement', () => {
  for (let upload = 0; upload < 20; upload++) {
    const resource = createStoneResources({ color: {}, bump: {} }, INITIAL);
    let disposed = 0;
    const resources = [resource.geometry, ...resource.materials, ...resource.materials.flatMap(material => [material.map, material.bumpMap])];
    resources.forEach(item => item.addEventListener('dispose', () => disposed++));
    resource.dispose();
    assert.equal(disposed, 19);
  }
});

test('uploads require real JPEG/PNG signatures and obey the size limit', async () => {
  await validateUpload(new File([new Uint8Array([255, 216, 255, 224])], 'stone.jpg', { type: 'image/jpeg' }));
  await validateUpload(new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'stone.png', { type: 'image/png' }));
  await assert.rejects(() => validateUpload(new File(['hello'], 'stone.jpg', { type: 'image/jpeg' })), /not a valid/);
  await assert.rejects(() => validateUpload(new File(['<svg/>'], 'stone.svg', { type: 'image/svg+xml' })), /JPEG or PNG/);
  await assert.rejects(() => validateUpload(new File([new Uint8Array(21 * 1024 * 1024)], 'large.png', { type: 'image/png' })), /20 MB/);
});
