import type {Locale} from '@/lib/locales';
import {homepageAdditions, validMapsLocation,locationMapEmbed} from '@/lib/magasin';
import {Icon} from './icon';

export function HomeLocation({locale,address,url}:{locale:Locale;address:string;url:string}) {
  if (!address.trim() || !validMapsLocation(url)) return null;
  const c=homepageAdditions[locale];
  const embed=locationMapEmbed(url);
  return <section className="home-location section-space container" aria-labelledby="magasin-title">
    <div className="magasin-map">{embed?<><iframe src={embed} title={c.mapTitle} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"/><p className="magasin-map-note">{c.mapNote}</p></>:<div className="magasin-map-fallback"><Icon name="globe"/><a href={url} target="_blank" rel="noopener noreferrer">{c.mapFallback}</a></div>}</div>
    <div className="magasin-card"><p className="eyebrow">{c.store}</p><h2 id="magasin-title">{c.locationTitle}</h2><dl><dt>{c.address}</dt><dd><bdi>{address}</bdi></dd></dl><a href={url} target="_blank" rel="noopener noreferrer" className="button button-gold">{c.directions}<Icon name="arrow" className="direction-arrow"/></a></div>
  </section>;
}
