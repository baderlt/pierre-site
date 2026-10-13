import { CanvasTexture, MeshPhysicalMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const SHAPES = {
  slab: { label: 'Slab', dimensions: { width: 120, height: 180, thickness: 3 } },
  block: { label: 'Block', dimensions: { width: 100, height: 80, thickness: 60 } },
  tile: { label: 'Tile', dimensions: { width: 60, height: 60, thickness: 1.5 } },
};
export const FINISHES = {
  honed: { label: 'Honed', roughness: 0.55, bump: 0.22, clearcoat: 0.04, description: 'Soft, matte & naturally understated.' },
  polished: { label: 'Polished', roughness: 0.18, bump: 0.08, clearcoat: 0.32, description: 'Smooth to the eye. A subtle, reflective sheen.' },
  rough: { label: 'Rough', roughness: 0.92, bump: 0.72, clearcoat: 0, description: 'Tactile character with a textured, mineral finish.' },
};
export const DEMOS = [
  { id: 'marble_rock_01', name: 'Veined marble', family: 'Marble', src: '/textures/marble_rock_01.jpg', crop: null },
  { id: 'marble_01', name: 'Warm marble', family: 'Marble', src: '/textures/marble_01.jpg', crop: [0.39, 0.73, 0.20, 0.20] },
  { id: 'granite_tile_02', name: 'Copper granite', family: 'Granite', src: '/textures/granite_tile_02.jpg', crop: [0.05, 0.055, 0.095, 0.12] },
];
export const INITIAL = { shape: 'slab', ...SHAPES.slab.dimensions, finish: 'honed', roughness: 0.55, bump: 0.22, scale: 1, rotation: 0 };

export function dimensionsInMeters(settings) {
  return [settings.width, settings.height, settings.thickness].map(value => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0.5 || number > 500) throw new Error('Dimensions must be between 0.5 and 500 cm.');
    return number / 100;
  });
}

// Face order follows Three.js BoxGeometry: right, left, top, bottom, front, back.
// Side UVs sample narrow strips of the photograph; they are illustrative, not measured.
export function faceRepeats([width, height, depth], scale) {
  return [[depth / width, 1], [depth / width, 1], [1, depth / height], [1, depth / height], [1, 1], [1, 1]]
    .map(([x, y]) => [x * scale, y * scale]);
}

export function createStoneResources(asset, settings, anisotropy = 4) {
  const dimensions = dimensionsInMeters(settings);
  const radius = Math.min(0.003, Math.min(...dimensions) * 0.12);
  const geometry = new RoundedBoxGeometry(...dimensions, 3, radius);
  const maps = faceRepeats(dimensions, settings.scale).map((repeat, face) => {
    const map = new CanvasTexture(asset.color);
    map.colorSpace = SRGBColorSpace;
    const bumpMap = new CanvasTexture(asset.bump);
    for (const texture of [map, bumpMap]) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(...repeat);
      texture.center.set(0.5, 0.5);
      texture.rotation = settings.rotation * Math.PI / 180;
      texture.anisotropy = anisotropy;
      if (face !== 4) texture.offset.set(face === 5 ? 0.13 : 0.07, 0.03);
    }
    return { map, bumpMap };
  });
  const materials = maps.map(({ map, bumpMap }, face) => new MeshPhysicalMaterial({
    name: face === 4 ? 'Photographed surface' : 'Approximated surface',
    map, bumpMap,
    roughness: settings.roughness,
    bumpScale: settings.bump * 0.003,
    metalness: 0,
    clearcoat: FINISHES[settings.finish].clearcoat,
    clearcoatRoughness: 0.22,
    envMapIntensity: settings.finish === 'polished' ? 0.9 : 0.6,
  }));
  return {
    geometry, materials, dimensions,
    dispose() {
      geometry.dispose();
      materials.forEach(material => material.dispose());
      maps.forEach(({ map, bumpMap }) => { map.dispose(); bumpMap.dispose(); });
    },
  };
}
