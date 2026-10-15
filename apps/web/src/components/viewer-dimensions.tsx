'use client';
import {useId} from 'react';
import {measurementGuides,type MeasurementFrame} from '@/lib/viewer-measurements';
import type {Locale} from '@/lib/locales';
import type {ProductCopy} from '@/lib/product-copy';

export function ViewerDimensions({frame,locale,c,moving,verified}:{frame:MeasurementFrame;locale:Locale;c:ProductCopy;moving:boolean;verified:boolean}) {
  const marker=useId();
  const guides=measurementGuides(frame,locale,c.dimensionUnit);
  if(!guides.length)return null;
  return <div className="studio-dimensions" data-moving={moving} aria-hidden={moving} data-verified={verified}>
    <svg viewBox={`0 0 ${frame.width} ${frame.height}`} role="img" aria-label={verified?c.catalogueDimensions:c.modelDimensions}>
      <defs><marker id={marker} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M6 3 0 0v6Z" fill="currentColor"/></marker></defs>
      {guides.map(g=><g key={g.axis}><title>{c.dimensionNames[['width','height','thickness'].indexOf(g.axis)]}: {g.label}</title><path className="dimension-extension" d={`M${g.originStart.join(' ')} L${g.start.join(' ')} M${g.originEnd.join(' ')} L${g.end.join(' ')}`}/><path className="dimension-line" d={`M${g.start.join(' ')} L${g.end.join(' ')}`} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`}/><rect x={g.x-g.labelWidth/2} y={g.y-12} width={g.labelWidth} height="24" rx="12"/><text x={g.x} y={g.y} dominantBaseline="central" textAnchor="middle" direction="ltr">{g.label}</text></g>)}
    </svg><p>{verified?c.catalogueDimensions:c.modelDimensions}</p>
  </div>;
}
