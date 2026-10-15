import type {Locale} from './locales';

/** Only Google Maps location links; never fetch or resolve pasted URLs on the server. */
export function validMapsLocation(value: string): boolean {
  if (!value || value.length > 2048 || /[\s\\]|%0[ad]/i.test(value)) return false;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.hash || /:\d+(?:\/|$)/.test(value.slice(8))) return false;
    const shareQuery=[...u.searchParams.keys()].every(k=>['g_st','g_ep'].includes(k));
    if (u.hostname === 'maps.app.goo.gl') return /^\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname) && shareQuery;
    if (u.hostname === 'goo.gl') return /^\/maps\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname) && shareQuery;
    if (!['www.google.com', 'google.com', 'maps.google.com'].includes(u.hostname)
      || (!/^\/maps(?:\/|$)/.test(u.pathname) && !(u.hostname === 'maps.google.com' && ['', '/'].includes(u.pathname)))) return false;
    if (['url', 'continue', 'redirect', 'next'].some(k => u.searchParams.has(k))) return false;
    return /^\/maps\/(?:place|dir|search)\/[^/]+/.test(u.pathname)
      || ['q', 'query', 'destination', 'cid'].some(k => !!u.searchParams.get(k)?.trim());
  } catch { return false; }
}

/** Use an explicit pin, never the @lat,lon camera centre or a geocoded business guess. */
export function locationMapEmbed(value:string):string|null {
  if(!validMapsLocation(value))return null;
  try {
    const url=new URL(value);
    const pins=[...decodeURIComponent(url.pathname).matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)].map(m=>[Number(m[1]),Number(m[2])]);
    if(pins.length===0){
      const q=url.searchParams.get('destination')||url.searchParams.get('q')||url.searchParams.get('query')||'';
      const match=q.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if(match)pins.push([Number(match[1]),Number(match[2])]);
    }
    if(!pins.length||pins.some(p=>p[0]!==pins[0][0]||p[1]!==pins[0][1]))return null;
    const [lat,lon]=pins[0];
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>85||Math.abs(lon)>180)return null;
    const bbox=[Math.max(-180,lon-.008),Math.max(-85,lat-.005),Math.min(180,lon+.008),Math.min(85,lat+.005)].map(n=>Number(n.toFixed(7))).join(',');
    return `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({bbox,layer:'mapnik',marker:`${lat},${lon}`})}`;
  }catch{return null;}
}

export const homepageAdditions: Record<Locale, {store: string; locationTitle: string; address: string; directions: string; mapTitle:string; mapNote:string; mapFallback:string; openForm: string; loading: string; quotePage: string}> = {
  fr: {store:'Le magasin',locationTitle:'Retrouvons-nous autour de la pierre.',address:'Adresse du magasin',directions:'Itinéraire',mapTitle:'Carte du magasin TIME STONE',mapNote:'Carte interactive fournie par OpenStreetMap.',mapFallback:'Consultez l’emplacement exact sur Google Maps.',openForm:'Afficher le formulaire',loading:'Chargement du formulaire…',quotePage:'Ouvrir la page Devis'},
  en: {store:'The store',locationTitle:'Let’s meet around natural stone.',address:'Store address',directions:'Get directions',mapTitle:'TIME STONE store map',mapNote:'Interactive map provided by OpenStreetMap.',mapFallback:'View the exact location on Google Maps.',openForm:'Show the enquiry form',loading:'Loading the form…',quotePage:'Open the quotation page'},
  ar: {store:'المتجر',locationTitle:'لنلتقِ حول الحجر الطبيعي.',address:'عنوان المتجر',directions:'الاتجاهات',mapTitle:'خريطة متجر TIME STONE',mapNote:'خريطة تفاعلية مقدمة من OpenStreetMap.',mapFallback:'اطّلع على الموقع الدقيق في خرائط Google.',openForm:'إظهار نموذج الطلب',loading:'جارٍ تحميل النموذج…',quotePage:'فتح صفحة طلب عرض السعر'},
};
