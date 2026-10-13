import 'server-only';
import {cache} from 'react';
import {apiGet,ApiError,record,list,str,optional,number,media} from './api';
import {card} from './catalogue-data';
import {validConfiguration,geometryDefaults,type ProductDetailDTO,type StoneConfiguration,type GeometryType,type StoneFinish} from './product';
import type {Locale} from './locales';
export const getProduct=cache(async(locale:Locale,slug:string):Promise<ProductDetailDTO|null>=>{
 if(!/^[a-z0-9-]{1,100}$/.test(slug))return null;
 let raw;try{raw=await apiGet(`products/${slug}?locale=${locale}`);}catch(e){if(e instanceof ApiError&&e.status===404)return null;throw e;}
 const p=record(record(raw).data);const cfg=p.saved_3d_configuration?record(p.saved_3d_configuration):null;
 const fallback:StoneConfiguration={version:1,shape:'slab',finish:'honed',...geometryDefaults.slab,scale:1,rotation:0};
 const configuration=(cfg||fallback) as StoneConfiguration;
 if(!validConfiguration(configuration))throw new ApiError(502);
 const supported=list(p.supported_finishes).map(v=>{const f=str(v);if(!['honed','polished','rough'].includes(f))throw new ApiError(502);return f as StoneFinish;});
 const formats=list(p.formats).map(v=>{const f=record(v);const d=record(f.dimensions_cm);const geometry=str(f.geometry) as GeometryType;if(!['slab','block','tile'].includes(geometry))throw new ApiError(502);return {id:str(f.id),name:str(f.name),geometry,dimensions_cm:{width:number(d.width,.5,500),height:number(d.height,.5,500),thickness:number(d.thickness,.5,500)},verified:f.verified===true,allow_custom:f.allow_custom===true};});
 if(cfg&&(!supported.includes(configuration.finish)||!formats.some(f=>f.geometry===configuration.shape)))throw new ApiError(502);
 const m=p.material_parameters?record(p.material_parameters):null;
 const material=m?{roughness:number(m.roughness,0,1),metalness:number(m.metalness,0,1),bump_strength:number(m.bump_strength,0,1),preset:str(m.preset)}:null;if(material&&!['studio','neutral'].includes(material.preset))throw new ApiError(502);
 const texture=p.texture?record(p.texture):null;
 return {...card(p),applications:list(p.applications).map(v=>str(v,100)),images:list(p.images).map(v=>{const i=record(v);const role=str(i.role) as 'studio'|'texture'|'application';if(!['studio','texture','application'].includes(role))throw new ApiError(502);return {src:media(i.src),alt:optional(i.alt)||str(p.name),role,temporary:i.temporary===true};}),texture:{src:texture?media(texture.src):'',max_resolution:texture?number(texture.max_resolution,1,2048):2048,temporary:p.temporary===true},viewer_available:!!cfg&&!!texture&&!!material,geometry_type:configuration.shape,dimensions_cm:{width:configuration.width,height:configuration.height,thickness:configuration.thickness},dimensions_verified:p.dimensions_verified===true,supported_finishes:supported,formats,uploaded_model:null,saved_3d_configuration:configuration,material_parameters:material,
 finish_options:list(p.finish_options).map(v=>{const f=record(v);return {id:str(f.id),slug:str(f.slug),name:str(f.name),simulation:optional(f.simulation)};}),verified_specifications:list(p.verified_specifications).map(v=>{const s=record(v);return {label:str(s.label),value:str(s.value)};}),seo:{...record(p.seo),image:media(record(p.seo).image)}};
});
