'use client';
import Image,{type ImageProps} from 'next/image';
import {useEffect,useRef,useState} from 'react';
/** Laravel media is already resized/re-encoded. Recheck publication on each delivery. */
export default function MediaImage({mobileCrop,defer=false,...props}:ImageProps&{mobileCrop?:'hero'|'banner';defer?:boolean}){
  const[failed,setFailed]=useState(false);
  const[ready,setReady]=useState(!defer||!!props.preload);
  const element=useRef<HTMLImageElement>(null);
  const src=typeof props.src==='string'?props.src:'';
  useEffect(()=>setFailed(false),[src]);
  useEffect(()=>{
    if(ready||!element.current)return;
    if(!('IntersectionObserver'in window)){setReady(true);return;}
    // Native lazy loading fetches images several screens away on fast connections.
    // Opt-in sections approach the viewport before competing with the LCP image.
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setReady(true);observer.disconnect();}},{rootMargin:'200px'});
    observer.observe(element.current);
    return()=>observer.disconnect();
  },[ready,src]);
  if(!src||failed)return <span className="media-unavailable" role={props.alt?'img':undefined} aria-label={props.alt||undefined}/>;
  const responsive=/\/media\/\d+\/(banner|texture)$/.test(src)&&props.sizes?.includes('100vw');
  const fluidCMS=/^\/media\/\d+\/(preview|texture)$/.test(src)&&props.sizes&&!responsive;
  const image=<Image {...props} ref={element} src={ready?props.src:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} fetchPriority={props.fetchPriority||(props.preload?'high':'low')} loading={props.preload||defer&&ready?'eager':props.loading} preload={responsive||fluidCMS?false:props.preload} unoptimized={src.startsWith('/media/')||props.unoptimized} onError={()=>setFailed(true)}/>;
  const fallback=defer&&<noscript><Image {...props} loading="lazy" preload={false} unoptimized={src.startsWith('/media/')||props.unoptimized}/></noscript>;
  if(!responsive){
    if(fluidCMS){
      const base=src.replace(/\/(preview|texture)$/,'');
      const sources=`${base}/thumb 320w, ${base}/card 640w, ${base}/large 960w, ${base}/preview 1200w, ${base}/texture 2048w`;
      return <>{props.preload&&<link rel="preload" as="image" imageSrcSet={sources} imageSizes={props.sizes} fetchPriority={props.fetchPriority}/>}<picture><source srcSet={ready?sources:undefined} sizes={props.sizes}/>{image}</picture>{fallback}</>;
    }
    return <>{image}{fallback}</>;
  }
  const mobile=src.replace(/\/(banner|texture)$/,'/preview');
  const narrow=mobileCrop?src.replace(/\/(banner|texture)$/,`/${mobileCrop}_mobile`):mobile;
  return <>{props.preload&&<><link rel="preload" as="image" href={narrow} media="(max-width: 479px)" fetchPriority={props.fetchPriority}/><link rel="preload" as="image" href={mobile} media="(min-width: 480px) and (max-width: 767px)" fetchPriority={props.fetchPriority}/><link rel="preload" as="image" href={src} media="(min-width: 768px)" fetchPriority={props.fetchPriority}/></>}<picture><source media="(max-width: 479px)" srcSet={ready?narrow:undefined}/><source media="(max-width: 767px)" srcSet={ready?mobile:undefined}/>{image}</picture>{fallback}</>;
}
