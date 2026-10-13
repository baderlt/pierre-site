import {apiOrigin} from '@/lib/api';
export const dynamic='force-dynamic';
export async function GET(){try{const r=await fetch(`${apiOrigin()}/api/v1/quotation-challenge`,{cache:'no-store',signal:AbortSignal.timeout(8000),headers:{Accept:'application/json'}});if(!r.ok)throw new Error();return Response.json(await r.json(),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({message:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export async function POST(request:Request){const headers={'Cache-Control':'private, no-store'};const origin=request.headers.get('Origin');if(!origin||origin!==new URL(process.env.SITE_URL||request.url).origin)return Response.json({message:'origin'},{status:403,headers});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return Response.json({message:'type'},{status:415,headers});
 const key=request.headers.get('Idempotency-Key')||'';if(!/^[a-f0-9-]{36}$/i.test(key))return Response.json({message:'identifier'},{status:422,headers});
 // Bound streaming input even when Content-Length is absent.
 const reader=request.body?.getReader();let bytes=0;const chunks:Uint8Array[]=[];if(!reader)return Response.json({message:'empty'},{status:400,headers});
 while(true){const result=await reader.read();if(result.done)break;bytes+=result.value.length;if(bytes>65536){await reader.cancel();return Response.json({message:'size'},{status:413,headers});}chunks.push(result.value);}
 const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
 try{JSON.parse(new TextDecoder().decode(body));}catch{return Response.json({message:'json'},{status:400,headers});}
 try{const r=await fetch(`${apiOrigin()}/api/v1/quotations`,{method:'POST',body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(Number(process.env.API_TIMEOUT_MS)||8000),headers:{Accept:'application/json','Content-Type':'application/json','Idempotency-Key':key,...(process.env.QUOTATION_PROXY_SECRET?{'X-Time-Stone-Proxy':process.env.QUOTATION_PROXY_SECRET,'X-Time-Stone-Client':(process.env.TRUST_PROXY_HEADERS==='true'?(request.headers.get('X-Forwarded-For')||'local'):'local').split(',')[0].trim().slice(0,64)}:{})}});const data=await r.json();const retry=r.headers.get('Retry-After')||'';const responseHeaders=r.status===429&&/^\d+$/.test(retry)&&Number(retry)>0&&Number(retry)<=3600?{...headers,'Retry-After':retry}:headers;return Response.json(r.ok?{reference:data.reference,duplicate:data.duplicate}:{message:'submission_failed',...(r.status===422?{errors:data.errors}:{})},{status:r.status,headers:responseHeaders});}
 catch{return Response.json({message:'uncertain'}, {status:503,headers});}
}
