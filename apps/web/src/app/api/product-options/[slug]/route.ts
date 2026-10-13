import {getProduct} from '@/lib/product-data';
import {isLocale} from '@/lib/locales';
import {quotationOption} from '@/lib/quotation';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lang=new URL(request.url).searchParams.get('locale')||'fr';if(!isLocale(lang))return new Response(null,{status:422});try{const p=await getProduct(lang,slug);return Response.json(p?quotationOption(p):null,{status:p?200:404,headers:{'Cache-Control':'no-store'}});}catch{return Response.json(null,{status:503,headers:{'Cache-Control':'no-store'}});}}
