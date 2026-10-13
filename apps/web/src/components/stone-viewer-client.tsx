'use client';

import { forwardRef, useEffect, useState } from 'react';
import StoneViewer, { type ViewerApi } from './stone-engine/StoneViewer';
import { prepareImage, type PreparedImage } from './stone-engine/images';
import type { StoneConfiguration } from '@/lib/product';

const presets = { honed: { roughness: 0.55, bump: 0.22 }, polished: { roughness: 0.18, bump: 0.08 }, rough: { roughness: 0.92, bump: 0.72 } };
export default forwardRef<ViewerApi, { texture: string; settings: StoneConfiguration; material?:{roughness:number;metalness:number;bump_strength:number;preset:string}|null; visible: boolean; onReady(): void; onFailure(): void }>(function StoneViewerClient({ texture, settings, material, visible, onReady, onFailure }, ref) {
  const [asset, setAsset] = useState<PreparedImage | null>(null);
  useEffect(() => {
    let cancelled = false;
    let prepared: PreparedImage | undefined;
    // R3F initialization is asynchronous: detect unavailable WebGL before mounting Canvas.
    // Release the probe before creating the single studio context.
    try {
      const probe = document.createElement('canvas');
      const context = probe.getContext('webgl2');
      if (!context) { onFailure(); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
      probe.width = probe.height = 1;
    } catch { onFailure(); return; }
    prepareImage(texture).then(result => {
      if (cancelled) { result.dispose(); return; }
      prepared = result;
      setAsset(result);
    }).catch(() => { if (!cancelled) onFailure(); });
    return () => { cancelled = true; prepared?.dispose(); };
  }, [texture, onFailure]);
  return asset && <StoneViewer ref={ref} asset={asset} settings={{ ...settings, ...presets[settings.finish],...(material?{roughness:material.roughness,metalness:material.metalness,bump:material.bump_strength,preset:material.preset}:{metalness:0,preset:'studio'}) }} visible={visible} onReady={onReady} onFailure={onFailure} />;
});
