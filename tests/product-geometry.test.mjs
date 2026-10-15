import test from 'node:test';
import assert from 'node:assert/strict';
import {geometryDimensions,outline,validParameters,validSelection} from '../apps/web/src/lib/geometry.ts';
import {createProductResources} from '../apps/web/src/components/stone-engine/geometry.js';
const cases={square:{side:80,thickness:3},circle:{diameter:120,thickness:3},hexagon:{diameter:120,thickness:3},triangle:{width:120,height:80,thickness:3},trapezoid:{width:120,top_width:80,height:80,thickness:3},sector:{radius:60,angle:270,thickness:3},annular:{outer_radius:90,inner_radius:60,angle:180,thickness:3},polygon:{vertices:[[0,0],[100,0],[120,60],[50,40],[0,80]],thickness:3}};
const makeAsset=id=>({color:{width:512,height:512,id},bump:{width:256,height:256,id}});
const base={version:1,shape:'slab',finish:'honed',scale:1,rotation:0,roughness:.6,bump:.05};
for(const [shape,parameters]of Object.entries(cases))test(`${shape}: real extruded outline, normalized bounds, normals, UVs and bounded draw groups`,()=>{
 assert.equal(validParameters(shape,parameters),true);const dims=geometryDimensions(shape,parameters),asset=makeAsset('top');
 const r=createProductResources({top:asset,bottom:asset,side:asset},{...base,...dims,geometry:{version:2,source:'procedural',shape,parameters,revision:1},referenceWidth:dims.width,referenceHeight:dims.height});
 r.geometry.computeBoundingBox();const box=r.geometry.boundingBox,actual=[box.max.x-box.min.x,box.max.y-box.min.y,box.max.z-box.min.z];
 Object.values(dims).forEach((d,i)=>assert.ok(Math.abs(actual[i]-d/100)<.00011));assert.equal(r.geometry.groups.length,3);assert.ok(r.geometry.attributes.position.count<4000);assert.ok(r.geometry.attributes.position.count>12);
 for(const a of [r.geometry.attributes.position,r.geometry.attributes.normal,r.geometry.attributes.uv])assert.ok(Array.from(a.array).every(Number.isFinite));
 let disposed=0;r.geometry.addEventListener('dispose',()=>disposed++);r.dispose();assert.equal(disposed,1);
});
test('different broad and edge materials keep independent transforms and reuse each image source',()=>{
 const assets={top:makeAsset('top'),bottom:makeAsset('bottom'),side:makeAsset('side')};const r=createProductResources(assets,{...base,width:180,height:120,thickness:3});
 assert.equal(r.materials[4].map.image.id,'top');assert.equal(r.materials[5].map.image.id,'bottom');assert.equal(r.materials[0].map.image.id,'side');assert.equal(r.materials[0].map.source,r.materials[1].map.source);assert.notEqual(r.materials[0].map,r.materials[1].map);assert.notEqual(r.materials[4].map.source,r.materials[5].map.source);
 let textures=0,materials=0;for(const m of r.materials){m.map.addEventListener('dispose',()=>textures++);m.bumpMap.addEventListener('dispose',()=>textures++);m.addEventListener('dispose',()=>materials++);}r.dispose();assert.equal(textures,12);assert.equal(materials,6);
});
test('planar UV coverage grows with dimensions instead of stretching the stone photograph',()=>{
 const asset=makeAsset('stone');const build=width=>createProductResources({top:asset,bottom:asset,side:asset},{...base,...geometryDimensions('triangle',{width,height:80,thickness:3}),referenceWidth:120,referenceHeight:80,geometry:{version:2,revision:1,source:'procedural',shape:'triangle',parameters:{width,height:80,thickness:3}}});
 const a=build(120),b=build(180),maxU=r=>{const g=r.geometry.groups.find(g=>g.materialIndex===4);let max=-Infinity;for(let i=g.start;i<g.start+g.count;i++)max=Math.max(max,r.geometry.attributes.uv.getX(i));return max;};assert.equal(maxU(a),1);assert.equal(maxU(b),1.5);a.dispose();b.dispose();
});
test('rejects self crossings, degenerate edges, invalid sectors and unsupported parameters',()=>{
 assert.equal(validParameters('polygon',{vertices:[[0,0],[100,100],[0,100],[100,0]],thickness:3}),false);
 assert.equal(validParameters('polygon',{vertices:[[0,0],[50,0],[100,0]],thickness:3}),false);
 assert.equal(validParameters('annular',{outer_radius:60,inner_radius:60,angle:90,thickness:3}),false);
 assert.equal(validParameters('sector',{radius:60,angle:360,thickness:3}),false);
 assert.equal(validParameters('sector',{radius:30,angle:.5,thickness:3}),false);
 assert.equal(validParameters('circle',{diameter:120,thickness:3,width:120}),false);
 assert.equal(outline('circle',cases.circle).length,64);
});
test('server-provided fixed parameters, ranges, steps and configuration revision constrain selections',()=>{
 const v={revision:3,source:'procedural',shape:'circle',parameters:cases.circle,customizable:true,limits:{diameter:{min:60,max:180,default:120,step:10}}},s={version:2,revision:3,source:'procedural',shape:'circle',parameters:{diameter:130,thickness:3}};
 assert.equal(validSelection(s,v),true);assert.equal(validSelection({...s,revision:2},v),false);assert.equal(validSelection({...s,parameters:{diameter:135,thickness:3}},v),false);assert.equal(validSelection({...s,parameters:{diameter:130,thickness:4}},v),false);assert.equal(validSelection(s,{...v,customizable:false}),false);
});
