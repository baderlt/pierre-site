import { useCallback, useEffect, useRef, useState } from 'react';
import StoneViewer from './StoneViewer.jsx';
import Icon from './Icon.jsx';
import { DEMOS, FINISHES, INITIAL, SHAPES } from './stone.js';
import { prepareImage, validateUpload } from './images.js';

function Slider({ label, value, onChange, min, max, step, display }) {
  return <label className="slider-field"><span className="flex items-center justify-between"><span>{label}</span><output>{display}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} style={{ '--progress': `${(value - min) / (max - min) * 100}%` }} /></label>;
}

function DimensionInput({ label, value, onChange }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  function update(text) {
    setDraft(text);
    const number = Number(text);
    if (text.trim() && Number.isFinite(number) && number >= 0.5 && number <= 500) onChange(number);
  }
  return <label className="dimension-field"><span>{label}</span><span className="dimension-box"><input aria-label={`${label} in centimeters`} type="number" min="0.5" max="500" step="0.5" value={draft} onChange={event => update(event.target.value)} onBlur={() => setDraft(String(value))} /><span>cm</span></span></label>;
}

function ShapeDrawing({ shape }) {
  return <svg viewBox="0 0 50 38" width="44" height="34" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    {shape === 'slab' ? <><path d="m14 7 20-4v27l-20 5zM34 3l4 3v27l-4-3M14 35l4 1 20-3" /><path d="m18 9 12-2" opacity=".35" /></> : shape === 'block' ? <><path d="m7 12 21-7 15 8v18l-21 6-15-8zm0 0 15 8 21-7M22 20v17" /><path d="m28 5-1 12" opacity=".35" /></> : <><path d="m5 20 21-13 19 10-21 14zm0 0v4l19 11 21-14v-4M24 31v4" /><path d="m15 19 11-7" opacity=".35" /></>}
  </svg>;
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export default function App() {
  const [settings, setSettings] = useState(INITIAL);
  const [surface, setSurface] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [exporting, setExporting] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [about, setAbout] = useState(false);
  const request = useRef(0);
  const viewer = useRef();
  const stage = useRef();
  const fileInput = useRef();

  const loadSurface = useCallback(async (source, info, crop) => {
    const id = ++request.current;
    setLoading(true);
    setError('');
    try {
      if (source instanceof File) await validateUpload(source);
      const asset = await prepareImage(source, crop);
      if (id !== request.current) { asset.dispose(); return; }
      setSurface({ ...info, asset });
    } catch (cause) {
      if (id === request.current) setError(cause.message || 'The image could not be loaded. Please try again.');
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, []);

  function selectDemo(demo) { loadSurface(demo.src, { id: demo.id, name: demo.name, family: demo.family }, demo.crop); }
  function upload(file) {
    if (!file) return;
    loadSurface(file, { id: 'upload', name: file.name.replace(/\.[^.]+$/, ''), family: 'Your photograph' });
  }
  useEffect(() => {
    const demo = DEMOS[0];
    loadSurface(demo.src, { id: demo.id, name: demo.name, family: demo.family }, demo.crop);
    return () => { request.current += 1; };
  }, [loadSurface]);
  useEffect(() => () => surface?.asset.dispose(), [surface]);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (!about && !expanded) return;
    const close = event => { if (event.key === 'Escape') { setAbout(false); setExpanded(false); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [about, expanded]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const set = (field, value) => setSettings(current => ({ ...current, [field]: value }));
  const canExport = ready && surface && !failed && !loading && !exporting;

  async function exportFile(type) {
    if (!canExport) return;
    setExporting(type);
    try {
      const blob = type === 'png' ? await viewer.current.screenshot() : await viewer.current.exportGLB();
      download(blob, `time-stone-${settings.shape}.${type}`);
      setNotice(type === 'png' ? 'Your studio preview has been downloaded.' : 'GLB downloaded with embedded color textures. Bump shading is preview-only.');
    } catch (cause) { setError(cause.message || 'Export failed. Please try again.'); }
    finally { setExporting(''); }
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.current.requestFullscreen) await stage.current.requestFullscreen();
      else setExpanded(current => !current);
    } catch { setExpanded(current => !current); }
  }
  function reset() { setSettings(INITIAL); setAutoRotate(false); viewer.current?.resetCamera(); setNotice('Product settings reset. Your stone texture is preserved.'); }

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="/" aria-label="TIME STONE Material Lab home"><span className="brand-mark">T<span>S</span></span><span className="brand-name">TIME STONE<span>NATURE. REIMAGINED.</span></span></a>
      <div className="header-divider" /><span className="header-lab">Material Lab <span>PROTOTYPE</span></span>
      <button className="about-button" aria-label="About this experiment" onClick={() => setAbout(current => !current)} aria-expanded={about}><Icon name="info" size={16} /><span>About this experiment</span></button>
    </header>

    <main>
      <div className="workspace-heading">
        <div><div className="eyebrow"><span className="small-line" /> FROM SURFACE TO FORM</div><h1>Your stone. A new dimension<span>.</span></h1><p>A single photograph. A tangible possibility. Explore your material in 3D.</p></div>
        <div className="heading-actions"><button className="button secondary" disabled={!canExport} onClick={() => exportFile('png')}><Icon name="camera" />{exporting === 'png' ? 'Capturing…' : 'Save image'}</button><button className="button primary" disabled={!canExport} onClick={() => exportFile('glb')}><Icon name="download" />{exporting === 'glb' ? 'Exporting…' : 'Export 3D'}<span className="file-badge">GLB</span></button></div>
      </div>

      <div className="workspace">
        <aside className="config-panel" aria-label="Product configuration">
          <div className="panel-heading"><h2>Make it yours</h2><button className="text-button" onClick={reset}><Icon name="reset" size={13} />Reset</button></div>
          <section className="control-section surface-section">
            <div className="section-label"><span className="step">01</span><h3>Stone surface</h3><span className="section-tag">2D SOURCE</span></div>
            <button className={`upload-zone ${dragging ? 'dragging' : ''}`} onClick={() => fileInput.current.click()} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); upload(event.dataTransfer.files[0]); }} aria-label="Upload stone photograph">
              <span className="upload-symbol"><Icon name="upload" size={19} /></span><span><strong>{loading ? 'Preparing your surface…' : 'Upload your stone'}</strong><small>Drop an image or <span>browse files</span></small></span><Icon name="plus" size={16} />
            </button>
            <input className="sr-only" ref={fileInput} type="file" accept="image/jpeg,image/png" aria-label="Stone image file" onChange={event => { upload(event.target.files?.[0]); event.target.value = ''; }} />
            <p className="input-note">JPG or PNG · Up to 20 MB · Processed on your device</p>
            {error && <div role="alert" className="error-message"><Icon name="info" size={16} /><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" size={14} /></button></div>}
            <div className="source-card"><div className="source-thumb">{surface && <img src={surface.asset.previewUrl} alt={`Original 2D surface: ${surface.name}`} />}</div><div className="source-meta"><strong title={surface?.name}>{surface?.name || 'Loading stone…'}</strong><span>{surface?.family || 'Sample material'} · {surface ? `${surface.asset.width} × ${surface.asset.height}` : '—'}</span><small><span className="status-dot" />{surface?.id === 'upload' ? 'Your original photograph' : 'Sample texture · CC0'}</small></div><span className="image-badge"><Icon name="image" size={15} /></span></div>
          </section>

          <section className="control-section">
            <div className="section-label"><span className="step">02</span><h3>Shape & dimensions</h3></div>
            <div className="shape-options">{Object.entries(SHAPES).map(([key, shape]) => <button key={key} className={`shape-option ${settings.shape === key ? 'selected' : ''}`} aria-pressed={settings.shape === key} onClick={() => setSettings(current => ({ ...current, shape: key, ...shape.dimensions }))}><ShapeDrawing shape={key} /><span>{shape.label}</span>{settings.shape === key && <span className="shape-check"><Icon name="check" size={9} /></span>}</button>)}</div>
            <div className="dimension-fields">{['width', 'height', 'thickness'].map(field => <DimensionInput key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} value={settings[field]} onChange={value => set(field, value)} />)}</div>
            <p className="input-note"><Icon name="cube" size={12} />Real proportions, in centimeters</p>
          </section>

          <section className="control-section finish-section">
            <div className="section-label"><span className="step">03</span><h3>Surface finish</h3></div>
            <div className="finish-options">{Object.entries(FINISHES).map(([key, finish]) => <button key={key} className={settings.finish === key ? 'selected' : ''} aria-pressed={settings.finish === key} onClick={() => setSettings(current => ({ ...current, finish: key, roughness: finish.roughness, bump: finish.bump }))}><span className={`finish-swatch ${key}`} />{finish.label}</button>)}</div>
            <p className="finish-description">{FINISHES[settings.finish].description}</p>
            <div className="slider-grid"><Slider label="Roughness" min={0.05} max={1} step={0.01} value={settings.roughness} display={settings.roughness.toFixed(2)} onChange={value => set('roughness', value)} /><Slider label="Bump intensity" min={0} max={1} step={0.01} value={settings.bump} display={settings.bump.toFixed(2)} onChange={value => set('bump', value)} /></div>
          </section>

          <section className="control-section texture-section">
            <div className="section-label"><span className="step">04</span><h3>Texture placement</h3></div>
            <div className="slider-grid"><Slider label="Scale" min={0.5} max={4} step={0.05} value={settings.scale} display={`${settings.scale.toFixed(2)}×`} onChange={value => set('scale', value)} /><Slider label="Rotation" min={0} max={360} step={1} value={settings.rotation} display={`${settings.rotation}°`} onChange={value => set('rotation', value)} /></div>
          </section>
          <div className="local-note"><Icon name="lock" size={13} /><span>Your images stay yours. Nothing is uploaded.</span></div>
        </aside>

        <div className="preview-column">
          <section className={`viewer-stage ${expanded ? 'viewer-expanded' : ''}`} ref={stage} aria-label="Interactive 3D product preview">
            <div className="viewer-top"><span className="live-label"><span className={`status-dot ${failed ? 'failed' : ''}`} />{failed ? 'PREVIEW UNAVAILABLE' : 'LIVE 3D PREVIEW'}</span><span className="studio-label">STUDIO / 01</span></div>
            <div className="canvas-container"><StoneViewer ref={viewer} asset={surface?.asset} settings={settings} autoRotate={autoRotate} onReady={onReady} onFailure={onFailure} /></div>
            {loading && <div className="loading-label" role="status"><span className="loader" />Preparing material…</div>}
            <div className="viewer-tools"><button title="Zoom in" aria-label="Zoom in" disabled={!ready} onClick={() => viewer.current?.zoom(0.8)}><Icon name="plus" /></button><button title="Zoom out" aria-label="Zoom out" disabled={!ready} onClick={() => viewer.current?.zoom(1.25)}><Icon name="minus" /></button><span /><button title="Reset camera" aria-label="Reset camera" disabled={!ready} onClick={() => viewer.current?.resetCamera()}><Icon name="reset" /></button><button title={fullscreen || expanded ? 'Exit fullscreen' : 'Fullscreen'} aria-label={fullscreen || expanded ? 'Exit fullscreen' : 'Fullscreen'} onClick={() => expanded ? setExpanded(false) : toggleFullscreen()}><Icon name={fullscreen || expanded ? 'close' : 'expand'} /></button></div>
            <div className="viewer-bottom"><div className="object-label"><span>{SHAPES[settings.shape].label.toUpperCase()} / {FINISHES[settings.finish].label.toUpperCase()}</span><strong>{settings.width} <i>×</i> {settings.height} <i>×</i> {settings.thickness} <small>cm</small></strong></div><button className={`auto-rotate ${autoRotate ? 'active' : ''}`} aria-pressed={autoRotate} disabled={!ready} onClick={() => setAutoRotate(current => !current)}><Icon name="rotate" size={15} /><span>Auto-rotate</span><span className="switch"><span /></span></button></div>
            <div className="viewer-instructions"><Icon name="mouse" size={13} /><span className="desktop-hint">Drag to rotate <b>·</b> Scroll to zoom</span><span className="mobile-hint">Swipe to rotate <b>·</b> Pinch to zoom</span></div>
          </section>

          <div className="preview-disclaimer"><Icon name="info" size={15} /><p><strong>A material preview, naturally.</strong> Side and rear surfaces are approximated from your photograph.</p><button aria-label="Learn about preview limitations" onClick={() => setAbout(current => !current)}><Icon name="chevron" size={14} /></button></div>

          <section className="sample-library" aria-label="Sample stone library"><div className="library-heading"><div><span className="eyebrow">A LITTLE INSPIRATION</span><h2>Start with a surface.</h2></div><span className="library-tag">3 CURATED SAMPLES</span></div><div className="sample-grid">{DEMOS.map(demo => <button key={demo.id} className={`sample-card ${surface?.id === demo.id ? 'selected' : ''}`} onClick={() => selectDemo(demo)} aria-pressed={surface?.id === demo.id}><div className="sample-image" style={{ backgroundImage: `url(${demo.src})`, backgroundSize: demo.crop ? `${100 / demo.crop[2]}% ${100 / demo.crop[3]}%` : 'cover', backgroundPosition: demo.crop ? `${demo.crop[0] / (1 - demo.crop[2]) * 100}% ${demo.crop[1] / (1 - demo.crop[3]) * 100}%` : 'center' }}>{surface?.id === demo.id && <span className="sample-check"><Icon name="check" size={12} /></span>}</div><div className="sample-info"><span>{demo.name}<small>{demo.family}</small></span><Icon name={surface?.id === demo.id ? 'check' : 'arrow'} size={15} /></div></button>)}</div></section>
        </div>
      </div>
      {about && <section className="about-panel" aria-label="About this experiment"><div><span className="eyebrow">THE IDEA, MADE TANGIBLE</span><h2>One photograph. An informed approximation.</h2><p>Your photograph is mapped onto a beveled rectangular mesh. Entered dimensions determine the real proportions; lighting, reflections and image-derived bump shading bring the surface to life.</p><p>The photograph cannot reveal hidden veins, true depth or physical roughness. Side surfaces reuse strips of the same image, and finishes are visual simulations. Front mapping fits the photograph to the face, so differing image and product aspect ratios can stretch the pattern. GLB exports embed color textures and material settings; bump shading stays in this preview.</p><p className="credits">Demo photography: <a href="https://polyhaven.com/a/marble_rock_01" target="_blank" rel="noreferrer">Marble Rock 01</a>, <a href="https://polyhaven.com/a/marble_01" target="_blank" rel="noreferrer">Marble 01</a> & <a href="https://polyhaven.com/a/granite_tile_02" target="_blank" rel="noreferrer">Granite Tile 02</a> by Poly Haven (CC0). Warm marble and granite samples are cropped to exclude grout.</p></div><button className="icon-button" aria-label="Close about panel" onClick={() => setAbout(false)}><Icon name="close" /></button></section>}
    </main>
    <footer><span>TIME STONE <b>/</b> MATERIAL LAB</span><span>Crafted by nature. Explored in 3D.</span><span className="footer-status"><span className="status-dot" />LOCAL EXPERIMENT</span></footer>
    {notice && <div className="toast" role="status"><Icon name="check" size={16} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><Icon name="close" size={14} /></button></div>}
  </div>;
}
