'use client';
import {imageSource,thumbnailSource} from '@/lib/media';

import Image from './media-image';
import { useRef, useState } from 'react';
import { Icon } from './icon';
import { trapDialogFocus } from './dialog-focus';
import { materialImages, type HomeContent } from '@/lib/home-content';

/** Static-image adapter; M3 replaces the stage with an on-demand 3D client island. */
export type MaterialPreviewContent = Pick<HomeContent, 'viewer' | 'discover' | 'demo' | 'close'> & {
  hero: Pick<HomeContent['hero'], 'specimen' | 'specimenCopy' | 'preview'>;
  collection: Pick<HomeContent['collection'], 'names'>;
};

export function MaterialPreview({ content,images }: { content: MaterialPreviewContent;images:string[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState(0);
  function open(index: number, button: HTMLElement) {
    opener.current = button;
    setSelected(index);
    dialog.current?.showModal();
  }
  return <>
    <div className="hero-materials">
      <div className="material-swatches" aria-label={content.viewer.title}>
        {images.map((image, index) => <button type="button" key={image} aria-label={`${content.viewer.selected} : ${content.collection.names[index]}`} aria-haspopup="dialog" onClick={event => open(index, event.currentTarget)}><Image src={thumbnailSource(image).replace(/\/thumb$/,'/swatch')} alt="" width={48} height={48} fetchPriority="low" /></button>)}
      </div>
      <div className="specimen-copy"><h2>{content.hero.specimen}</h2><p>{content.hero.specimenCopy}</p><button type="button" onClick={event => open(0, event.currentTarget)}>{content.discover}<Icon name="arrow" className="direction-arrow" /></button></div>
    </div>
    <button type="button" className="button button-outline hero-preview-trigger" aria-haspopup="dialog" onClick={event => open(0, event.currentTarget)}><Icon name="expand" />{content.hero.preview}</button>
    <dialog ref={dialog} className="material-dialog" aria-labelledby="material-dialog-title" onKeyDown={trapDialogFocus} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="material-dialog-content">
        <div className="dialog-heading"><span className="eyebrow">{content.demo}</span><button className="icon-button" type="button" aria-label={content.close} onClick={() => dialog.current?.close()}><Icon name="close" /></button></div>
        <h2 id="material-dialog-title">{content.viewer.title}</h2><p>{content.viewer.description}</p>
        <div className="material-stage" data-viewer-mode="static" data-integration="milestone-3"><Image src={imageSource(images[selected])} alt={content.collection.names[selected]} fill sizes="(max-width: 640px) 85vw, 600px" /></div>
        <div className="material-options">{images.map((image, index) => <button type="button" key={image} aria-pressed={selected === index} onClick={() => setSelected(index)}>{content.collection.names[index]}</button>)}</div>
        <p className="material-note">{content.viewer.note}</p>
      </div>
    </dialog>
  </>;
}
