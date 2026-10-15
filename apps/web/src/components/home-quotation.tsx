'use client';

import dynamic from 'next/dynamic';
import {useEffect,useRef,useState,type ComponentProps} from 'react';
import type {QuotationForm} from './quotation-form';

const Form=dynamic(()=>import('./quotation-form').then(m=>m.QuotationForm),{ssr:false});

/** Mount once on approach; scrolling away must never discard input or its idempotency key. */
export function HomeQuotation({formProps,open,loading,quotePage}:{formProps:ComponentProps<typeof QuotationForm>;open:string;loading:string;quotePage:string}) {
  const [active,setActive]=useState(false);
  const region=useRef<HTMLDivElement>(null);
  const manual=useRef(false);
  useEffect(()=>{
    if(!region.current||!('IntersectionObserver'in window))return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setActive(true);observer.disconnect();}},{rootMargin:'300px'});
    observer.observe(region.current);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!active||!manual.current||!region.current)return;
    const focus=()=>{const field=region.current?.querySelector<HTMLInputElement>('#quote-product-search');if(!field)return false;field.focus();return true;};
    if(focus())return;
    const observer=new MutationObserver(()=>{if(focus())observer.disconnect();});
    observer.observe(region.current,{childList:true,subtree:true});return()=>observer.disconnect();
  },[active]);
  return <div ref={region} className="home-quote-mount">
    {active?<div className="home-quote-active"><Form {...formProps}/></div>:<div className="home-quote-placeholder"><p>{loading}</p><button type="button" className="button button-gold" onClick={()=>{manual.current=true;setActive(true);}}>{open}</button></div>}
    <a className="home-quote-page-link" href={`/${formProps.locale}/quote`}>{quotePage}</a>
  </div>;
}
