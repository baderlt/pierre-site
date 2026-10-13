import 'server-only';
import { cache } from 'react';
import {notFound} from 'next/navigation';
export class ApiError extends Error { constructor(public status: number, public reason='http') { super('Content service unavailable'); } }
export function logApiFailure(path:string,started:number,error:unknown,status=503,requestId:string|null=null){
 const name=error instanceof Error?error.name:'';
 const cause=error instanceof Error?error.cause:undefined;
 const code=cause&&typeof cause==='object'&&'code'in cause?String(cause.code):'';
 const reason=error instanceof ApiError?error.reason:name==='TimeoutError'?'timeout':name==='SyntaxError'?'invalid_json':'transport';
 // Paths are reduced to route templates. Never log query text, payloads, origins or headers.
 const route=path.split('?')[0].replace(/^(products|pages|applications)\/[^/]+/,'$1/:key');
 console.error(JSON.stringify({event:'content_api_failure',route,elapsed_ms:Math.round(performance.now()-started),status,reason,...(/^[A-Z0-9_]{1,48}$/.test(code)?{code}:{}),...(/^[a-f0-9-]{36}$/i.test(requestId||'')?{request_id:requestId}:{})}));
}
export function apiOrigin() { const value=process.env.LARAVEL_API_URL; if(!value) throw new ApiError(503); const u=new URL(value); if(!['http:','https:'].includes(u.protocol)) throw new ApiError(503); return u.origin; }
export const apiGet=cache(async(path:string):Promise<unknown>=>{
 const started=performance.now();let requestId:string|null=null;
 try { const response=await fetch(`${apiOrigin()}/api/v1/${path}`,{cache:'no-store',signal:AbortSignal.timeout(Number(process.env.API_TIMEOUT_MS)||8000),headers:{Accept:'application/json',...(process.env.QUOTATION_PROXY_SECRET?{'X-Time-Stone-Proxy':process.env.QUOTATION_PROXY_SECRET}:{})}});requestId=response.headers.get('X-Request-ID');if(!response.ok)throw new ApiError(response.status);
  const data=await response.json();if(process.env.CONTENT_DIAGNOSTICS==='true')console.info(JSON.stringify({event:'content_api_timing',route:path.split('?')[0].replace(/^(products|pages|applications)\/[^/]+/,'$1/:key'),elapsed_ms:Math.round(performance.now()-started),status:response.status}));return data;
 }
 catch(e){const status=e instanceof ApiError?e.status:e instanceof SyntaxError?502:503;if(status>=500||status===429)logApiFailure(path,started,e,status,requestId);if(e instanceof ApiError)throw e;throw new ApiError(status,e instanceof Error&&e.name==='TimeoutError'?'timeout':'transport');}
});
export function record(v:unknown):Record<string,unknown>{if(!v||typeof v!=='object'||Array.isArray(v))throw new ApiError(502);return v as Record<string,unknown>;}
export function list(v:unknown):unknown[]{if(!Array.isArray(v)||v.length>500)throw new ApiError(502);return v;}
export function str(v:unknown,max=10000):string{if(typeof v!=='string'||v.length>max)throw new ApiError(502);return v;}
export function optional(v:unknown):string{return v==null?'':str(v);}
export function number(v:unknown,min=0,max=1000000):number{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new ApiError(502);return v;}
export function media(v:unknown):string { if(!v)return '';const u=new URL(str(v));const approved=new URL(process.env.PUBLIC_MEDIA_ORIGIN||apiOrigin());if(u.origin!==approved.origin||!/^\/media\/[1-9]\d*\/(thumb|preview|texture|banner)$/.test(u.pathname)||u.search)throw new ApiError(502);return u.pathname; }
export const getPage=cache(async(locale:string,key:string)=>{let raw;try{raw=await apiGet(`pages/${key}?locale=${locale}`);}catch(e){if(e instanceof ApiError&&e.status===404)notFound();throw e;}const result=record(raw);const data=record(result.data);return {key:str(data.key),title:optional(data.title),description:optional(data.description),seo:{title:optional(record(data.seo).title),description:optional(record(data.seo).description),image:media(record(data.seo).image)},sections:list(data.sections).map(v=>{const s=record(v);const link=optional(s.link_path);if(link&&!/^\/(fr|en|ar)(?:\/[a-z0-9/#?=&%-]*)?$/.test(link))throw new ApiError(502);return {key:str(s.key),type:str(s.type),title:optional(s.title),body:optional(s.body),cta:optional(s.cta_label),link,image:media(s.image)};})};});
export const getSite=cache(async(locale:string)=>{const v=record(record(await apiGet(`site?locale=${locale}`)).data);const c=v.contacts?record(v.contacts):{};return {brand:optional(v.brand_name),logo:media(v.logo),favicon:media(v.favicon),contacts:{phone:optional(c.phone),whatsapp:optional(c.whatsapp),email:optional(c.email),location:optional(c.address),instagram:optional(c.instagram),linkedin:optional(c.linkedin)}};});
