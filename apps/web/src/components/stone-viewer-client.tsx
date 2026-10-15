'use client';

import { forwardRef, useEffect, useState } from 'react';
import StoneViewer, { type ViewerApi } from './stone-engine/StoneViewer';
import { prepareImage, type PreparedImage } from './stone-engine/images';
import type { StoneConfiguration } from '@/lib/product';
import type { ViewerConfiguration } from '@/lib/geometry';
import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {LoadingManager,type Material,type Texture,type Mesh} from 'three';

const presets = { honed: { roughness: 0.55, bump: 0.22 }, polished: { roughness: 0.18, bump: 0.08 }, rough: { roughness: 0.92, bump: 0.72 } };
function disposeModel(model:GLTF){const geometries=new Set<Mesh['geometry']>(),materials=new Set<Material>(),textures=new Set<Texture>(),images=new Set<{close?:()=>void}>();model.scene.traverse(o=>{const m=o as Mesh;if(m.isMesh){geometries.add(m.geometry);for(const material of Array.isArray(m.material)?m.material:[m.material])materials.add(material);}});for(const m of materials)for(const value of Object.values(m))if(value&&typeof value==='object'&&value.isTexture)textures.add(value);for(const t of textures){if(t.image)images.add(t.image);t.dispose();}for(const im of images)im.close?.();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}
async function loadModel(v:ViewerConfiguration,signal:AbortSignal){
 const spec=v.model;if(!spec||!/^\/media\/[1-9]\d*\/model$/.test(spec.url))throw Error('Invalid model URL');
 const r=await fetch(spec.url,{signal,cache:'no-store',redirect:'error'});if(!r.ok||!r.headers.get('Content-Type')?.startsWith('model/gltf-binary')||Number(r.headers.get('Content-Length')||0)>8388608)throw Error('Model unavailable');
 const reader=r.body?.getReader();if(!reader)throw Error('Missing model');const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8388608){await reader.cancel();throw Error('Model budget exceeded');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==spec.sha256||size!==spec.bytes)throw Error('Model integrity mismatch');
 const manager=new LoadingManager();manager.setURLModifier(url=>{if(!url.startsWith('blob:'))throw Error('External model resource forbidden');return url;});
 return new GLTFLoader(manager).parseAsync(bytes.buffer,'');
}
export default forwardRef<ViewerApi, { texture: string; settings: StoneConfiguration;viewer?:ViewerConfiguration|null;referenceWidth?:number;referenceHeight?:number; material?:{roughness:number;metalness:number;bump_strength:number;preset:string}|null; visible: boolean; onReady(): void; onFailure(): void }>(function StoneViewerClient({ texture, settings, viewer,referenceWidth,referenceHeight, material, visible, onReady, onFailure }, ref) {
  const [asset, setAsset] = useState<{top:PreparedImage;bottom:PreparedImage;side:PreparedImage}|null>(null);
  const [model,setModel]=useState<GLTF|null>(null);
  useEffect(() => {
    let cancelled = false;
    const prepared:PreparedImage[]=[];let loaded:GLTF|undefined;const controller=new AbortController();const timer=setTimeout(()=>{controller.abort();if(!cancelled)onFailure();},8000);
    // R3F initialization is asynchronous: detect unavailable WebGL before mounting Canvas.
    // Release the probe before creating the single studio context.
    try {
      const probe = document.createElement('canvas');
      const context = probe.getContext('webgl2');
      if (!context) { clearTimeout(timer);onFailure(); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
      probe.width = probe.height = 1;
    } catch { clearTimeout(timer);onFailure(); return; }
    if(viewer?.source==='glb')loadModel(viewer,controller.signal).then(result=>{if(cancelled){disposeModel(result);return;}loaded=result;setModel(result);}).catch(()=>{if(!cancelled)onFailure();}).finally(()=>clearTimeout(timer));
    else {const urls={top:viewer?.materials.top||texture,bottom:viewer?.materials.bottom||texture,side:viewer?.materials.side||texture},cache=new Map<string,Promise<PreparedImage>>();for(const url of Object.values(urls))if(!cache.has(url))cache.set(url,prepareImage(url).then(result=>{if(cancelled)result.dispose();else prepared.push(result);return result;}));Promise.all([...cache].map(async([url,promise])=>[url,await promise] as const)).then(entries=>{const assets=new Map(entries);if(!cancelled)setAsset({top:assets.get(urls.top)!,bottom:assets.get(urls.bottom)!,side:assets.get(urls.side)!});}).catch(()=>{if(!cancelled)onFailure();}).finally(()=>clearTimeout(timer));}
    return () => { cancelled = true;clearTimeout(timer);controller.abort();prepared.forEach(p=>p.dispose());if(loaded)disposeModel(loaded); };
  }, [texture, viewer, onFailure]);
  return (asset||model) && <StoneViewer ref={ref} asset={asset} model={model} settings={{ ...settings,referenceWidth,referenceHeight,edgeFinish:viewer?.edge_finish, ...presets[settings.finish],...(material?{roughness:material.roughness,metalness:material.metalness,bump:material.bump_strength,preset:material.preset}:{metalness:0,preset:'studio'}) }} visible={visible} onReady={onReady} onFailure={onFailure} />;
});
