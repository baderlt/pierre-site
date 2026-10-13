'use client';
import {imageSource} from '@/lib/media';

import Image from './media-image';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { CatalogueQuery } from '@/lib/catalogue';
import { geometryDefaults, productUrl, type StoneConfiguration } from '@/lib/product';
import type { ProductCopy } from '@/lib/product-copy';
import { buildQuotationDraft,buildQuotationItem,submissionMessages,quotationRateMessage,quotationConfiguration, quotationUnits, validateQuotation, type QuotationCopy, type QuotationField, type QuotationFields, type QuotationProductOption,type QuotationDraftDTO } from '@/lib/quotation';
import { Icon } from './icon';

export function QuotationForm({ locale, products:initialProducts, initialProductId, initialConfiguration, query, initialFormatId, initialSelection, countryOptions, c, stone }: { locale: Locale; products: QuotationProductOption[]; initialProductId: string; initialConfiguration: StoneConfiguration; query: CatalogueQuery; initialFormatId?:string; initialSelection: { quantity: string; unit: string }; countryOptions: { code: string; label: string }[]; c: QuotationCopy; stone: ProductCopy }) {
  const [products,setProducts]=useState(initialProducts);const [search,setSearch]=useState('');const [matches,setMatches]=useState<{id:string;slug:string;name:string}[]>([]);
  const [basket,setBasket]=useState<{name:string;item:QuotationDraftDTO['items'][number]}[]>([]);
  useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>{fetch(`/api/catalogue?locale=${locale}&q=${encodeURIComponent(search)}`,{signal:controller.signal}).then(r=>r.json()).then(v=>{if(v?.data)setMatches(v.data);}).catch(()=>{});},300);return()=>{clearTimeout(timer);controller.abort();};},[search,locale]);
  const [fields, setFields] = useState<QuotationFields>({ product: initialProductId, format_id: initialFormatId||initialProducts.find(p=>p.id===initialProductId)?.format_options?.find(f=>f.geometry===initialConfiguration.shape)?.id, shape: initialConfiguration.shape, finish: initialProducts.find(p=>p.id===initialProductId)?.finish_options?.find(f=>f.simulation===initialConfiguration.finish)?.slug||initialConfiguration.finish, width: String(initialConfiguration.width), height: String(initialConfiguration.height), thickness: String(initialConfiguration.thickness), quantity: initialSelection.quantity, unit: initialSelection.unit, name: '', email: '', phone: '', country: '', location: '', description: '', privacy: false });
  const [errors, setErrors] = useState<Partial<Record<QuotationField, string>>>({});
  const [checked, setChecked] = useState(false);
  const [reference,setReference]=useState('');const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);
  const key=useRef('');const challenge=useRef('');const inFlight=useRef(false);const uncertain=useRef(false);const challengeIssued=useRef(0);const website=useRef<HTMLInputElement>(null);
  useEffect(()=>{key.current=crypto.randomUUID();fetch('/api/quotations',{cache:'no-store'}).then(r=>r.json()).then(v=>{challenge.current=v.challenge||'';challengeIssued.current=Date.now();}).catch(()=>{});},[]);
  const [ready, setReady] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);
  useEffect(() => { if (checked && reference) success.current?.focus(); }, [checked, reference]);
  useEffect(() => setReady(true), []);
  const selected = products.find(item => item.id === fields.product);
  const configuration = quotationConfiguration(fields, fields.product === initialProductId ? initialConfiguration : selected?.configuration);
  const back = selected ? productUrl(locale, selected.slug||selected.id, query, configuration||undefined)+(fields.format_id?'&format_id='+encodeURIComponent(fields.format_id):'') : `/${locale}/products`;
  const formats = selected?.formats ?? ['slab', 'block', 'tile'];
  const finishes = selected?.finishes ?? ['honed', 'polished', 'rough'];
  function update<K extends QuotationField>(key: K, value: QuotationFields[K]) {
    if(uncertain.current)return;
    setFields(old => ({ ...old, [key]: value }));
    setErrors(old => { const next = { ...old }; delete next[key]; return next; });
    setChecked(false);
  }
  async function productChanged(id: string) {
    if(uncertain.current||busy||checked)return;
    let option=products.find(p=>p.id===id);
    if(id&&!option){const match=matches.find(p=>p.id===id);if(!match)return;try{const response=await fetch(`/api/product-options/${match.slug}?locale=${locale}`);if(!response.ok)throw new Error();option=await response.json();if(!option)throw new Error();setProducts(old=>[...old,option!]);}catch{setStatus(submissionMessages[locale].failed);return;}}

    const next = option?.configuration ?? { ...geometryDefaults.slab, shape: 'slab', finish: 'honed' };
    setFields(old => ({ ...old, product: id, format_id:option?.format_options?.find(f=>f.geometry===next.shape)?.id, shape: next.shape, finish: option?.finish_options?.find(f=>f.simulation===next.finish)?.slug||next.finish, width: String(next.width), height: String(next.height), thickness: String(next.thickness) }));
    setErrors({}); setChecked(false);
  }
  const described = (key: QuotationField, hint?: string) => [hint, errors[key] ? `${key}-error` : null].filter(Boolean).join(' ') || undefined;
  const error = (key: QuotationField) => errors[key] ? <p className="field-error" id={`${key}-error`}>{errors[key]}</p> : null;
  function input(key: 'width' | 'height' | 'thickness' | 'quantity' | 'name' | 'email' | 'phone' | 'country' | 'location', type = 'text', maxLength?: number) {
    return <div className="quote-field"><label htmlFor={`quote-${key}`}>{c[key]}</label><input id={`quote-${key}`} type={type} value={fields[key]} autoComplete="off" dir={['email', 'phone', 'width', 'height', 'thickness', 'quantity'].includes(key) ? 'ltr' : 'auto'} inputMode={type === 'number' ? 'decimal' : type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined} min={type === 'number' ? key === 'quantity' ? 0.001 : 0.5 : undefined} max={type === 'number' ? key === 'quantity' ? 1000000 : 500 : undefined} step="any" maxLength={maxLength} required={key !== 'phone'} aria-invalid={errors[key] ? true : undefined} aria-describedby={described(key)} onChange={event => update(key, event.target.value)} />{error(key)}</div>;
  }
  return <div className="quotation-layout">
    {/* No field names: a pre-hydration/native GET must never put personal data in a URL. */}
    <aside className="quotation-summary" aria-labelledby="quote-selection-title"><div className="quote-selection-image"><Image src={imageSource(selected?.image ?? 'product-studio')} alt="" fill sizes="(max-width: 767px) 90vw, 32vw" /></div><div className="quote-selection-copy"><p className="eyebrow">{stone.sample}</p><h2 id="quote-selection-title">{c.selection}</h2><h3>{selected?.name ?? c.general}</h3>{selected&&configuration && <p className="quote-configuration-summary"><span>{stone.shapes[['slab', 'block', 'tile'].indexOf(configuration.shape)]} · {stone.finishNames[['honed', 'polished', 'rough'].indexOf(configuration.finish)]}</span><bdi>{configuration.width} × {configuration.height} × {configuration.thickness} cm</bdi></p>}<p className="content-note">{c.selectionNote}</p><a className="button text-link quote-return" href={back}>{selected ? c.back : c.catalogue}<Icon name="arrow" className="direction-arrow" /></a></div></aside>
    <form className="quotation-form" noValidate autoComplete="off" onSubmit={async event => {
      event.preventDefault(); const next = validateQuotation(fields, products, c); setErrors(next); setChecked(false);
      if (Object.keys(next).length) requestAnimationFrame(() => errorSummary.current?.focus());
      else {
        if(inFlight.current||checked)return;
        inFlight.current=true;setBusy(true);setStatus(submissionMessages[locale].pending);
        try{
          if(!challenge.current){const check=await fetch('/api/quotations',{cache:'no-store',signal:AbortSignal.timeout(12000)});const token=await check.json();if(!check.ok||!token.challenge)throw new Error();challenge.current=token.challenge;challengeIssued.current=Date.now();}
          const remaining=2100-(Date.now()-challengeIssued.current);if(remaining>0)await new Promise(resolve=>setTimeout(resolve,remaining));
          const draft=buildQuotationDraft(locale,fields,products,c,fields.product===initialProductId?initialConfiguration:selected?.configuration);
          const response=await fetch('/api/quotations',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key.current},body:JSON.stringify({...draft,items:[...basket.map(b=>b.item),...draft.items],website:website.current?.value||'',challenge:challenge.current}),signal:AbortSignal.timeout(12000)});
          const result=await response.json();
          if(response.ok&&typeof result.reference==='string'&&/^TS-[A-Z0-9]{16}$/.test(result.reference)){setReference(result.reference);setChecked(true);setStatus('');uncertain.current=false;}
          else {uncertain.current=response.status>=500||(uncertain.current&&response.status===429);setStatus(response.status===429?quotationRateMessage(locale,response.headers.get('Retry-After')):response.status===409?submissionMessages[locale].conflict:result.errors?.challenge?submissionMessages[locale].challenge:submissionMessages[locale].failed);
            if(result.errors?.challenge){fetch('/api/quotations',{cache:'no-store'}).then(r=>r.json()).then(v=>{challenge.current=v.challenge||'';challengeIssued.current=Date.now();}).catch(()=>{});}
            if(result.errors){const mapped:Partial<Record<QuotationField,string>>={};const names:Record<string,QuotationField>={'customer.name':'name','customer.email':'email','customer.phone':'phone','delivery.country_code':'country','delivery.location':'location','project_details':'description','privacy_acknowledged':'privacy','items.0.product_id':'product','items.0.format_id':'shape','items.0.finish_id':'finish','items.0.quantity':'quantity','items.0.unit':'unit','items.0.dimensions_cm':'width'};for(const field of Object.keys(result.errors)){const local=names[field];if(local)mapped[local]=c.invalidChoice;}setErrors(mapped);requestAnimationFrame(()=>errorSummary.current?.focus());}
          }
        }catch{uncertain.current=true;setStatus(submissionMessages[locale].failed);}finally{inFlight.current=false;setBusy(false);}
      }
    }} aria-label={c.title.replaceAll('\n', ' ')}>
      <p className="content-note">{c.requiredNote}</p><div className="sr-only" aria-hidden="true"><label>Website<input ref={website} tabIndex={-1} autoComplete="off"/></label></div>{status&&<p role="status">{status}</p>}
      {Object.keys(errors).length > 0 && <div className="quote-errors" role="alert" tabIndex={-1} ref={errorSummary}><h2>{c.errors}</h2><ul>{Object.entries(errors).map(([key, message]) => <li key={key}><a href={`#quote-${key}`} onClick={event => { event.preventDefault(); document.getElementById(`quote-${key}`)?.focus(); }}>{c[key as Exclude<QuotationField, 'privacy'>]}: {message}</a></li>)}</ul></div>}
      {checked && <div className="quote-success" role="status" tabIndex={-1} ref={success}><h2>{c.success}</h2><p>{c.successBody}</p><p><bdi>{reference}</bdi></p></div>}
      <fieldset disabled={busy||checked||uncertain.current}><legend>{c.configuration}</legend><label htmlFor="quote-product-search">{locale==='fr'?'Rechercher un produit':locale==='ar'?'البحث عن منتج':'Search products'}</label><input id="quote-product-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} maxLength={100}/>
<div className="quote-field"><label htmlFor="quote-product">{c.product}</label><select id="quote-product" value={fields.product} aria-invalid={errors.product ? true : undefined} aria-describedby={described('product')} onChange={event => productChanged(event.target.value)}><option value="">{c.general}</option>{[...products,...matches.filter(m=>!products.some(p=>p.id===m.id))].map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select>{error('product')}</div>
        {selected&&<>        <div className="quote-two-columns"><div className="quote-field"><label htmlFor="quote-shape">{c.shape}</label><select id="quote-shape" value={fields.format_id||fields.shape} required aria-invalid={errors.shape ? true : undefined} aria-describedby={described('shape')} onChange={event => {const f=selected.format_options?.find(f=>f.id===event.target.value);const shape=f?.geometry||event.target.value;setFields(old=>({...old,format_id:f?.id,shape,...(f?{width:String(f.dimensions_cm.width),height:String(f.dimensions_cm.height),thickness:String(f.dimensions_cm.thickness)}:{})}));}}>{selected.format_options?.length?selected.format_options.map(f=><option key={f.id} value={f.id}>{f.name||stone.shapes[['slab','block','tile'].indexOf(f.geometry)]}</option>):formats.map(shape => <option key={shape} value={shape}>{stone.shapes[['slab', 'block', 'tile'].indexOf(shape)]}</option>)}</select>{error('shape')}</div><div className="quote-field"><label htmlFor="quote-finish">{c.finish}</label><select id="quote-finish" value={fields.finish} required aria-invalid={errors.finish ? true : undefined} aria-describedby={described('finish')} onChange={event => update('finish', event.target.value)}>{finishes.map(finish => <option key={finish} value={finish}>{selected?.finish_options?.find(f=>f.slug===finish)?.name||stone.finishNames[['honed','polished','rough'].indexOf(finish)]}</option>)}</select>{error('finish')}</div></div>
        <div className="quote-dimensions">{input('width', 'number')}{input('height', 'number')}{input('thickness', 'number')}</div><div className="quote-two-columns">{input('quantity', 'number')}<div className="quote-field"><label htmlFor="quote-unit">{c.unit}</label><select id="quote-unit" value={fields.unit} required aria-invalid={errors.unit ? true : undefined} aria-describedby={described('unit')} onChange={event => update('unit', event.target.value)}>{quotationUnits.map((unit, i) => <option key={unit} value={unit}>{c.units[i]}</option>)}</select>{error('unit')}</div></div></>}</fieldset>
      <p className="content-note">{locale==='fr'?'Toute dimension personnalisée doit être confirmée par la fabrication.':locale==='ar'?'يجب تأكيد الأبعاد المخصصة من جهة التصنيع.':'Custom dimensions require manufacturing confirmation.'}</p>
      {basket.length>0&&<ul>{basket.map((b,i)=><li key={i}>{b.name} · {b.item.quantity} {b.item.unit}<button type="button" disabled={busy||checked||uncertain.current} aria-label={`${c.product} ${b.name}`} onClick={()=>setBasket(old=>old.filter((_,n)=>n!==i))}>×</button></li>)}</ul>}
      {selected&&basket.length<19&&<button type="button" className="button button-border" disabled={busy||checked||uncertain.current} onClick={()=>{const issues=validateQuotation(fields,products,c);const keys=['product','shape','finish','width','height','thickness','quantity','unit'];const relevant=Object.fromEntries(Object.entries(issues).filter(([k])=>keys.includes(k)));if(Object.keys(relevant).length){setErrors(relevant);return;}setBasket(old=>[...old,{name:selected.name,item:buildQuotationItem(fields,products,fields.product===initialProductId?initialConfiguration:selected?.configuration)}]);setFields(old=>({...old,product:''}));}}>{locale==='fr'?'Ajouter cette sélection':locale==='ar'?'إضافة هذا الاختيار':'Add this selection'}</button>}
      <fieldset disabled={busy||checked||uncertain.current}><legend>{c.customer}</legend>{input('name', 'text', 150)}<div className="quote-two-columns">{input('email', 'email', 254)}{input('phone', 'tel', 40)}</div></fieldset>
      <fieldset disabled={busy||checked||uncertain.current}><legend>{c.project}</legend><div className="quote-two-columns"><div className="quote-field"><label htmlFor="quote-country">{c.country}</label><select id="quote-country" required value={fields.country} aria-invalid={errors.country ? true : undefined} aria-describedby={described('country')} onChange={event => update('country', event.target.value)}><option value="">—</option>{countryOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}</select>{error('country')}</div>{input('location', 'text', 200)}</div><div className="quote-field"><label htmlFor="quote-description">{c.description}</label><p className="content-note" id="description-hint">{c.descriptionHint}</p><textarea id="quote-description" value={fields.description} required maxLength={3000} rows={5} dir="auto" aria-invalid={errors.description ? true : undefined} aria-describedby={described('description', 'description-hint')} onChange={event => update('description', event.target.value)} />{error('description')}</div></fieldset>
      <section id="privacy-notice"><Icon name="shield" /><h2>{locale === 'fr' ? 'Confidentialité' : locale === 'ar' ? 'الخصوصية' : 'Privacy'}</h2><p>{c.privacyText}</p></section>
      <div className="privacy-acknowledgement"><input id="quote-privacy" type="checkbox" checked={fields.privacy} disabled={busy||checked||uncertain.current} required aria-invalid={errors.privacy ? true : undefined} aria-describedby={described('privacy', 'privacy-notice')} onChange={event => update('privacy', event.target.checked)} /><label htmlFor="quote-privacy">{c.privacy}</label></div>{error('privacy')}
      <button className="button button-gold quote-submit" type="submit" disabled={!ready||busy||checked}>{busy?submissionMessages[locale].pending:c.submit}<Icon name="arrow" className="direction-arrow" /></button><noscript><p className="content-note">{c.noScript}</p></noscript>
    </form>

  </div>;
}
