import {getCatalogue} from '@/lib/catalogue-data';
import {parseCatalogueQuery} from '@/lib/catalogue';
import {isLocale} from '@/lib/locales';
export async function GET(request:Request){const u=new URL(request.url);const l=u.searchParams.get('locale')||'fr';if(!isLocale(l))return Response.json(null,{status:422});try{return Response.json(await getCatalogue(l,parseCatalogueQuery(Object.fromEntries(u.searchParams))),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json(null,{status:503,headers:{'Cache-Control':'no-store'}});}}
