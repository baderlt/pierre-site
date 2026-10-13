'use client';

import Image from './media-image';
import {thumbnailSource} from '@/lib/media';
import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ViewerApi } from './stone-engine/StoneViewer';
import { geometryDefaults, quoteUrl, validConfiguration, type GeometryType, type ProductDetailDTO, type StoneConfiguration } from '@/lib/product';
import type { ProductCopy } from '@/lib/product-copy';
import type { CatalogueQuery } from '@/lib/catalogue';
import type { Locale } from '@/lib/locales';

// This import is requested only when an activated studio mounts. No Three.js in the initial page.
const Viewer = lazy(() => import('./stone-viewer-client'));
class ViewerBoundary extends Component<{ children: ReactNode; onFailure(): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProductStudio({ product, c, locale, query, initialConfig, initialFormatId, information, applications }: { product: ProductDetailDTO; c: ProductCopy; locale: Locale; query: CatalogueQuery; initialConfig: StoneConfiguration; initialFormatId?:string; information: ReactNode; applications: ReactNode }) {
  const [config, setConfig] = useState(initialConfig);
  const [formatId,setFormatId]=useState(initialFormatId||product.formats.find(f=>f.geometry===initialConfig.shape&&f.dimensions_cm.width===initialConfig.width&&f.dimensions_cm.height===initialConfig.height&&f.dimensions_cm.thickness===initialConfig.thickness)?.id||product.formats.find(f=>f.geometry===initialConfig.shape)?.id);
  const quotationHref=()=>quoteUrl(locale,product.slug||product.id,query,config)+(formatId?'&format_id='+encodeURIComponent(formatId):'');
  const [image, setImage] = useState(0);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const activateButton = useRef<HTMLButtonElement>(null);
  const api = useRef<ViewerApi>(null);
  const failure = useCallback(() => { setActive(false); setReady(false); setFailed(true); activateButton.current?.focus(); }, []);
  const loaded = useCallback(() => { setReady(true); }, []);
  useEffect(() => { if (active) region.current?.focus(); else if (failed) activateButton.current?.focus(); }, [active, failed]);
  useEffect(() => {
    const element = region.current;
    if (!active || !element) return;
    let intersecting = true;
    const update = () => setVisible(intersecting && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    update();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [active]);

  async function download(kind: 'png' | 'glb') {
    if (!api.current || !ready || exporting) return;
    setExporting(true); setMessage(c.exporting);
    try {
      const blob = kind === 'png' ? await api.current.screenshot() : await api.current.exportGLB();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `time-stone-${product.id}-illustrative.${kind}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(c.exported);
    } catch { setMessage(c.exportError); }
    finally { setExporting(false); }
  }
  function changeShape(shape: GeometryType,id?:string) { setFormatId(id); setConfig(previous => ({ ...previous, shape, ...(product.formats.find(f=>id?f.id===id:f.geometry===shape)?.dimensions_cm||geometryDefaults[shape]) })); setMessage(''); }
  function stop() { setActive(false); setReady(false); setMessage(''); }
  return <>
    <section className="product-gallery" aria-label={c.gallery}>
      <div className="gallery-stage" ref={region} tabIndex={active ? -1 : undefined} data-viewer-state={failed ? 'failed' : active ? ready ? 'ready' : 'loading' : 'static'}>
        <Image src={product.images[image]?.src||product.image} alt={product.images[image]?.alt||product.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1099px) 60vw, 48vw" preload fetchPriority="high" className={ready ? 'studio-underlay' : ''} />
        {active && <div className="webgl-stage" style={{ opacity: ready ? 1 : 0 }} role="img" aria-label={`${c.gallery}. ${c.instruction}. ${c.approximation}`}><ViewerBoundary onFailure={failure}><Suspense fallback={null}><Viewer ref={api} texture={product.texture.src} settings={config} material={config.finish===product.saved_3d_configuration.finish?product.material_parameters:undefined} visible={visible} onReady={loaded} onFailure={failure} /></Suspense></ViewerBoundary></div>}
        {product.temporary&&<span className="studio-label">{c.sample}</span>}
        {active && !ready && <p className="studio-loading" role="status">{c.loading}</p>}
        {!active && product.viewer_available!==false && <button ref={activateButton} className="button button-gold studio-activate" onClick={() => { setFailed(false); setMessage(''); setVisible(true); setActive(true); }}>{failed ? c.retry : c.activate}<span aria-hidden="true">◇</span></button>}
      </div>
      <div className="gallery-thumbnails" aria-label={c.gallery}>{product.images.map((item, index) => <button key={`${item.role}-${index}`} aria-label={item.alt||c.views[index]||product.name} aria-pressed={!active && image === index} onClick={() => { stop(); setImage(index); }}><Image src={thumbnailSource(item.src)} alt="" fill sizes="72px" /></button>)}{active && <button className="studio-photo-button" onClick={stop}>{c.static}</button>}</div>
      {active && <div className="studio-controls" aria-label={c.gallery}>
        <p>{c.instruction}</p><div className="camera-buttons">
          <button disabled={!ready} onClick={() => api.current?.rotate(-Math.PI / 8)} aria-label={c.rotateLeft}>↶</button><button disabled={!ready} onClick={() => api.current?.rotate(Math.PI / 8)} aria-label={c.rotateRight}>↷</button>
          <button disabled={!ready} onClick={() => api.current?.zoom(0.8)} aria-label={c.zoomIn}>+</button><button disabled={!ready} onClick={() => api.current?.zoom(1.25)} aria-label={c.zoomOut}>−</button>
          <button disabled={!ready} onClick={() => api.current?.resetCamera()}>{c.reset}</button><button disabled={!ready} onClick={() => api.current?.inspectEdge()}>{c.edge}</button>
        </div><div className="studio-exports"><button disabled={!ready || exporting} onClick={() => download('png')}>{c.png} ↓</button><button disabled={!ready || exporting} onClick={() => download('glb')}>{c.glb} ↓</button></div>
      </div>}
      <p role="status" className="studio-status">{failed ? c.failure : message || (active && ready ? c.ready : '')}</p>
      <p className="product-note">{c.approximation}</p>
    </section>
    {information}
    <section className="product-finishes" aria-labelledby="finishes-title"><h2 id="finishes-title">{c.finishes}</h2><div className="finish-options">{product.supported_finishes.map((finish, index) => <button key={finish} aria-pressed={config.finish === finish} onClick={() => setConfig(previous => ({ ...previous, finish }))}><span className={`finish-swatch finish-${finish}`} style={{ backgroundImage: `url(${product.texture.src})` }} /><span>{c.finishNames[['honed','polished','rough'].indexOf(finish)]}</span></button>)}</div><p className="product-note">{c.finishNote}</p>
      <details className="product-configuration"><summary>{c.configuration}</summary><p className="product-note">{product.dimensions_verified?(locale==='fr'?'Dimensions marquées comme vérifiées dans le catalogue.':locale==='ar'?'أبعاد محددة كموثقة في الكتالوج.':'Dimensions marked as verified in the catalogue.'):(locale==='fr'?'Dimensions indicatives — confirmation de fabrication nécessaire.':locale==='ar'?'أبعاد توضيحية تتطلب تأكيد التصنيع.':'Illustrative dimensions — manufacturing confirmation required.')}</p><fieldset><legend>{c.configuration}</legend><div className="shape-options">{product.formats.map((format, index) => <button key={format.id||format.geometry} aria-pressed={format.id?formatId===format.id:config.shape === format.geometry} onClick={() => changeShape(format.geometry,format.id)}>{format.name||c.shapes[['slab','block','tile'].indexOf(format.geometry)]}</button>)}</div></fieldset>
        <form key={`${config.shape}-${config.width}-${config.height}-${config.thickness}`} onSubmit={event => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const next: StoneConfiguration = { ...config, width: Number(values.get('width')), height: Number(values.get('height')), thickness: Number(values.get('thickness')) };
          if (!validConfiguration(next)) { setMessage(c.invalid); return; }
          setConfig(next); setMessage('');
        }}><fieldset><legend>{c.dimensions}</legend><div className="dimension-fields">{(['width', 'height', 'thickness'] as const).map((key, index) => <label key={key}>{c.dimensionNames[index]}<input dir="ltr" type="number" name={key} min="0.5" max="500" step="0.1" required defaultValue={config[key]} /></label>)}</div><p className="product-note">{c.dimensionNote}</p><button className="button button-border" type="submit">{c.update}</button></fieldset></form>
      </details><a className="button button-gold product-config-quote" href={quotationHref()}>{c.quote}<span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></a>
    </section>
    {applications}
    <aside className="product-quote-panel" aria-labelledby="product-quote-title"><div className="quote-panel-inner"><h2 id="product-quote-title">{c.quoteHeading}</h2><p>{c.quoteIntro}</p><p className="quote-selection">{c.shapes[['slab', 'block', 'tile'].indexOf(config.shape)]} · {c.finishNames[['honed', 'polished', 'rough'].indexOf(config.finish)]}<br /><bdi dir="ltr">{config.width} × {config.height} × {config.thickness} cm</bdi></p><a className="button button-gold" href={quotationHref()}>{c.quote}<span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></a><p className="product-note">{c.quoteNote}</p><div className="product-documents"><h3>{c.documents}</h3><p className="product-note">{c.documentNote}</p></div></div></aside>
  </>;
}
