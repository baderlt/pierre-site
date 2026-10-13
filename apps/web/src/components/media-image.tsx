'use client';
import Image,{type ImageProps} from 'next/image';
import {useEffect,useState} from 'react';
/** Laravel media is already resized/re-encoded. Recheck publication on each delivery. */
export default function MediaImage(props:ImageProps){
  const[failed,setFailed]=useState(false);
  const src=typeof props.src==='string'?props.src:'';
  useEffect(()=>setFailed(false),[src]);
  if(!src||failed)return <span className="media-unavailable" role={props.alt?'img':undefined} aria-label={props.alt||undefined}/>;
  const responsive=/\/media\/\d+\/(banner|texture)$/.test(src)&&props.sizes?.includes('100vw');
  const fluidCMS=/^\/media\/\d+\/(preview|texture)$/.test(src)&&props.sizes&&!responsive;
  const image=<Image {...props} loading={props.preload?'eager':props.loading} preload={responsive||fluidCMS?false:props.preload} unoptimized={src.startsWith('/media/')||props.unoptimized} onError={()=>setFailed(true)}/>;
  if(!responsive){
    if(fluidCMS){
      const base=src.replace(/\/(preview|texture)$/,'');
      const sources=`${base}/thumb 320w, ${base}/card 640w, ${base}/large 960w, ${base}/preview 1200w, ${base}/texture 2048w`;
      return <>{props.preload&&<link rel="preload" as="image" imageSrcSet={sources} imageSizes={props.sizes} fetchPriority={props.fetchPriority}/>}<picture><source srcSet={sources} sizes={props.sizes}/>{image}</picture></>;
    }
    return image;
  }
  const mobile=src.replace(/\/(banner|texture)$/,'/preview');
  return <>{props.preload&&<><link rel="preload" as="image" href={mobile} media="(max-width: 767px)" fetchPriority={props.fetchPriority}/><link rel="preload" as="image" href={src} media="(min-width: 768px)" fetchPriority={props.fetchPriority}/></>}<picture><source media="(max-width: 767px)" srcSet={mobile}/>{image}</picture></>;
}
