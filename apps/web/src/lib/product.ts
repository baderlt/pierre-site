import { catalogueUrl, getSamples, type CatalogueQuery, type ProductCardDTO } from './catalogue';
import type { Locale } from './locales';

export type GeometryType = 'slab' | 'block' | 'tile';
export type StoneFinish = 'honed' | 'polished' | 'rough';
export type DimensionsCm = { width: number; height: number; thickness: number };
export type StoneConfiguration = DimensionsCm & { version: 1; shape: GeometryType; finish: StoneFinish; scale: number; rotation: number };
export type ProductImage = { src: string; role: 'studio' | 'texture' | 'application'; temporary: boolean; alt?: string };
/** Laravel-facing contract. Illustrative configuration is never a technical specification. */
export type ProductDetailDTO = ProductCardDTO & {
  applications?: string[];
  viewer_available?: boolean;
  material_parameters?: {roughness:number;metalness:number;bump_strength:number;preset:string}|null;
  finish_options?: {id:string;slug:string;name:string;simulation:string}[];
  seo?: Record<string,unknown>;
  images: ProductImage[];
  texture: { src: string; max_resolution: number; temporary: boolean; alt?: string };
  geometry_type: GeometryType;
  dimensions_cm: DimensionsCm;
  dimensions_verified: boolean;
  supported_finishes: StoneFinish[];
  formats: { id?: string; name?:string; allow_custom?: boolean; geometry: GeometryType; dimensions_cm: DimensionsCm; verified: boolean }[];
  uploaded_model: { url: string; mime: 'model/gltf-binary'; bytes: number; validated: boolean } | null;
  saved_3d_configuration: StoneConfiguration;
  verified_specifications: { label: string; value: string }[];
};
export const geometryDefaults: Record<GeometryType, DimensionsCm> = {
  slab: { width: 180, height: 120, thickness: 3 },
  block: { width: 100, height: 80, thickness: 60 },
  tile: { width: 60, height: 60, thickness: 1.5 }
};
export const finishValues: StoneFinish[] = ['honed', 'polished', 'rough'];

/** Temporary adapter; replace with GET /api/v1/products/{id}, preserving the DTO. */
export async function getProduct(locale: Locale, id: string): Promise<ProductDetailDTO | null> {
  const product = getSamples(locale).find(item => item.id === id);
  if (!product) return null;
  const shape: GeometryType = product.category === 'blocks' ? 'block' : product.category === 'tiles' ? 'tile' : 'slab';
  const texture = product.category === 'marble' ? 'product-marble-texture' : 'product-beige-texture';
  const studio = product.category === 'limestone' || product.category === 'custom' ? 'product-studio' : product.image;
  return { ...product,
    images: [{ src: `/images/${studio}.webp`, role: 'studio', temporary: true }, { src: `/images/${texture}.webp`, role: 'texture', temporary: true }, { src: `/images/${product.image}.webp`, role: 'application', temporary: true }],
    texture: { src: `/images/${texture}.webp`, max_resolution: 2048, temporary: true },
    geometry_type: shape, dimensions_cm: geometryDefaults[shape], dimensions_verified: false,
    supported_finishes: [...finishValues], formats: Object.entries(geometryDefaults).map(([geometry, dimensions_cm]) => ({ geometry: geometry as GeometryType, dimensions_cm, verified: false })),
    uploaded_model: null,
    saved_3d_configuration: { version: 1, shape, ...geometryDefaults[shape], finish: 'honed', scale: 1, rotation: 0 },
    verified_specifications: []
  };
}
export function productUrl(locale: Locale, id: string, query: CatalogueQuery, config?: StoneConfiguration) {
  const path = catalogueUrl(locale, query).replace('/products', `/products/${encodeURIComponent(id)}`).replace('#results', '');
  if (!config) return path;
  const url = new URL(path, 'https://local.invalid');
  for (const key of ['shape', 'finish', 'width', 'height', 'thickness'] as const) url.searchParams.set(`v_${key}`, String(config[key]));
  return `${url.pathname}${url.search}`;
}
export function validConfiguration(value: StoneConfiguration) {
  return value.version === 1 && ['slab', 'block', 'tile'].includes(value.shape) && finishValues.includes(value.finish)
    && [value.width, value.height, value.thickness].every(n => Number.isFinite(n) && n >= 0.5 && n <= 500)
    && Number.isFinite(value.scale) && value.scale >= 0.25 && value.scale <= 4
    && Number.isFinite(value.rotation) && value.rotation >= 0 && value.rotation <= 360;
}
export function quoteUrl(locale: Locale, id: string, query: CatalogueQuery, config: StoneConfiguration) {
  const url = new URL(productUrl(locale, id, query, config), 'https://local.invalid');
  url.pathname = `/${locale}/quote`;
  url.searchParams.set('product', id);
  return `${url.pathname}${url.search}`;
}
export function configurationFromParams(params: Record<string, string | string[] | undefined>, fallback: StoneConfiguration): StoneConfiguration {
  const config = { ...fallback };
  for (const key of ['shape', 'finish', 'width', 'height', 'thickness'] as const) {
    const value = params[`v_${key}`];
    if (typeof value !== 'string') continue;
    if (key === 'shape') config.shape = value as GeometryType;
    else if (key === 'finish') config.finish = value as StoneFinish;
    else config[key] = Number(value);
  }
  return validConfiguration(config) ? config : fallback;
}

export function productConfigurationFromParams(params:Record<string,string|string[]|undefined>,product:ProductDetailDTO){const c=configurationFromParams(params,product.saved_3d_configuration);const f=product.formats.find(f=>f.geometry===c.shape);if(!f||!product.supported_finishes.includes(c.finish))return product.saved_3d_configuration;return c;}
