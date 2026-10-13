import type { Locale } from './locales';

export const categories = ['limestone', 'marble', 'tiles', 'blocks', 'custom'] as const;
export const facets = { stone_type: ['limestone', 'marble'], finish: ['honed', 'polished', 'brushed'], color: ['beige', 'grey', 'white'], application: ['interior-flooring', 'wall-cladding', 'exterior'] } as const;
export const sorts = ['featured', 'newest', 'name_asc', 'name_desc'] as const;
export type CatalogueQuery = { q: string; category: string; stone_type: string; finish: string; color: string; application: string; sort: string; page: number };
export type ProductCardDTO = { id: string; name: string; category: string; stone_type: string; finish: string; color: string; application: string; image: string; image_alt?: string; slug?: string; description?: string; temporary: boolean };
export type CatalogueResponse = { data: ProductCardDTO[]; meta: { current_page: number; last_page: number; per_page: number; total: number }; categories: Record<string, number> };

export const catalogueCopy = {
  fr: { title: 'Collection de pierre naturelle', eyebrow: 'NOS PIERRES', intro: 'Matières, nuances et inspirations architecturales. Une collection illustrative à explorer.', temporary: 'Échantillons provisoires : images et associations de filtres illustratives. Produits, finitions et caractéristiques à confirmer. Aucune disponibilité commerciale annoncée.', sample: 'Échantillon illustratif', search: 'Rechercher une pierre', placeholder: 'Pierre, couleur, finition…', filters: 'Filtres', apply: 'Appliquer', clear: 'Tout effacer', close: 'Fermer les filtres', all: 'Toutes les pierres', category: 'Catégories', stone_type: 'Type de pierre', finish: 'Finition envisagée', color: 'Nuance illustrative', application: 'Usage envisagé', sort: 'Trier par', sorting: ['Sélection', 'Derniers échantillons', 'Nom A–Z', 'Nom Z–A'], categoryNames: ['Calcaire', 'Marbre', 'Carreaux', 'Blocs', 'Sur mesure'], stoneNames: ['Calcaire', 'Marbre'], finishNames: ['Adoucie', 'Polie', 'Brossée'], colorNames: ['Beige', 'Gris', 'Blanc'], applicationNames: ['Sols intérieurs', 'Revêtement mural', 'Extérieur'], results: 'échantillons', empty: 'Aucun échantillon ne correspond à votre recherche.', previous: 'Précédent', next: 'Suivant', page: 'Page', view: 'Voir l’échantillon', custom: 'Une idée sur mesure ?', customText: 'Explorez les possibilités de la pierre pour votre projet. Les formats et finitions réels restent à confirmer.', contact: 'Préparer votre projet', back: 'Retour à la collection', detail: 'Étude visuelle uniquement. Cette image ne confirme ni une référence produit, ni une finition, ni des dimensions ou des performances techniques.', process: ['La matière', 'Les formats', 'Votre espace'] },
  en: { title: 'Natural Stone Collection', eyebrow: 'OUR STONES', intro: 'Materials, tones and architectural inspiration. An illustrative collection to explore.', temporary: 'Temporary samples: images and filter associations are illustrative. Products, finishes and specifications require confirmation. No stock availability is claimed.', sample: 'Illustrative sample', search: 'Search for stone', placeholder: 'Stone, color, finish…', filters: 'Filters', apply: 'Apply', clear: 'Clear all', close: 'Close filters', all: 'All stones', category: 'Categories', stone_type: 'Stone type', finish: 'Proposed finish', color: 'Illustrative tone', application: 'Proposed use', sort: 'Sort by', sorting: ['Featured', 'Latest samples', 'Name A–Z', 'Name Z–A'], categoryNames: ['Limestone', 'Marble', 'Tiles', 'Blocks', 'Custom'], stoneNames: ['Limestone', 'Marble'], finishNames: ['Honed', 'Polished', 'Brushed'], colorNames: ['Beige', 'Grey', 'White'], applicationNames: ['Interior flooring', 'Wall cladding', 'Exterior'], results: 'samples', empty: 'No samples match your search.', previous: 'Previous', next: 'Next', page: 'Page', view: 'View sample', custom: 'Need a Custom Solution?', customText: 'Explore the possibilities of stone for your project. Actual formats and finishes remain to be confirmed.', contact: 'Prepare your project', back: 'Back to collection', detail: 'Visual study only. This image does not confirm a product reference, finish, dimensions or technical performance.', process: ['The material', 'The formats', 'Your space'] },
  ar: { title: 'تشكيلة الحجر الطبيعي', eyebrow: 'أحجارنا', intro: 'خامات وألوان وإلهام معماري. تشكيلة توضيحية لاكتشاف إمكانات الحجر.', temporary: 'عينات مؤقتة: الصور وتصنيفات التصفية توضيحية. المنتجات والتشطيبات والخصائص بحاجة إلى تأكيد. لا نعلن عن توفر تجاري.', sample: 'عينة توضيحية', search: 'ابحث عن حجر', placeholder: 'الحجر، اللون، التشطيب…', filters: 'التصفية', apply: 'تطبيق', clear: 'مسح الكل', close: 'إغلاق التصفية', all: 'كل الأحجار', category: 'الفئات', stone_type: 'نوع الحجر', finish: 'التشطيب المقترح', color: 'اللون التوضيحي', application: 'الاستخدام المقترح', sort: 'الترتيب حسب', sorting: ['المختارات', 'أحدث العينات', 'الاسم تصاعديًا', 'الاسم تنازليًا'], categoryNames: ['الحجر الجيري', 'الرخام', 'البلاط', 'الكتل الحجرية', 'حسب الطلب'], stoneNames: ['الحجر الجيري', 'الرخام'], finishNames: ['مصقول مطفي', 'مصقول لامع', 'مفرّش'], colorNames: ['بيج', 'رمادي', 'أبيض'], applicationNames: ['الأرضيات الداخلية', 'كسوة الجدران', 'الخارج'], results: 'عينات', empty: 'لا توجد عينات تطابق بحثك.', previous: 'السابق', next: 'التالي', page: 'الصفحة', view: 'عرض العينة', custom: 'هل لديك فكرة خاصة؟', customText: 'اكتشف إمكانات الحجر لمشروعك. تبقى الأشكال والتشطيبات الفعلية بانتظار التأكيد.', contact: 'حضّر مشروعك', back: 'العودة إلى التشكيلة', detail: 'دراسة بصرية فقط. لا تؤكد الصورة مرجع منتج أو تشطيبًا أو أبعادًا أو أداءً تقنيًا.', process: ['الخامة', 'الأشكال', 'مساحتك'] }
} satisfies Record<Locale, Record<string, string | string[]>>;
export type CatalogueCopy = typeof catalogueCopy.fr;

export function parseCatalogueQuery(params: Record<string, string | string[] | undefined>): CatalogueQuery {
  const value = (key: string) => typeof params[key] === 'string' ? params[key] as string : '';
  const key = (name:string) => /^[a-z0-9-]{1,100}$/.test(value(name)) ? value(name) : '';
  return { q:value('q').trim().slice(0,100),category:key('category'),stone_type:key('stone_type'),finish:key('finish'),color:key('color'),application:key('application'),sort:sorts.includes(value('sort') as typeof sorts[number])?value('sort'):'featured',page:/^\d{1,6}$/.test(value('page'))?Math.min(100000,Math.max(1,Number(value('page')))):1 };
}
export function catalogueUrl(locale: Locale, query: CatalogueQuery, changes: Partial<CatalogueQuery> = {}, sample?: string) {
  const state = { ...query, ...changes };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) if (value && !(key === 'page' && value === 1) && !(key === 'sort' && value === 'featured')) params.set(key, String(value));
  if (sample) params.set('sample', sample);
  return `/${locale}/products${params.size ? `?${params}` : ''}${sample ? '#sample' : '#results'}`;
}

/** Temporary adapter: replace this implementation with GET /api/v1/products in M6. */
export async function getCatalogue(locale: Locale, query: CatalogueQuery): Promise<CatalogueResponse> {
  const all = getSamples(locale);
  const c = catalogueCopy[locale];
  const label = (values: readonly string[], labels: string[], key: string) => labels[values.indexOf(key)] || '';
  let filtered = all.filter(product => ['category', 'stone_type', 'finish', 'color', 'application'].every(key => !query[key as keyof CatalogueQuery] || product[key as keyof ProductCardDTO] === query[key as keyof CatalogueQuery]));
  const search = query.q.toLocaleLowerCase(locale);
  filtered = filtered.filter(p => [p.name, label(facets.color, c.colorNames, p.color), label(facets.finish, c.finishNames, p.finish), label(categories, c.categoryNames, p.category)].join(' ').toLocaleLowerCase(locale).includes(search));
  if (query.sort === 'newest') filtered.reverse();
  if (query.sort.startsWith('name_')) filtered.sort((a, b) => a.name.localeCompare(b.name, locale, { numeric: true }) * (query.sort === 'name_desc' ? -1 : 1));
  const last = Math.max(1, Math.ceil(filtered.length / 12));
  const page = Math.min(query.page, last);
  return { data: filtered.slice((page - 1) * 12, page * 12), meta: { current_page: page, last_page: last, per_page: 12, total: filtered.length }, categories: Object.fromEntries(categories.map(key => [key, all.filter(p => p.category === key).length])) };
}
export function getSamples(locale: Locale): ProductCardDTO[] {
  return Array.from({ length: 18 }, (_, index) => {
    const category = categories[index % categories.length];
    const color = category === 'marble' ? 'grey' : category === 'tiles' ? 'white' : 'beige';
    const image = { limestone: 'catalogue-beige', marble: 'catalogue-grey', tiles: 'catalogue-tiles', blocks: 'catalogue-blocks', custom: 'catalogue-custom' }[category];
    return { id: `sample-${index + 1}`, name: `${catalogueCopy[locale].categoryNames[index % 5]} · ${String(index + 1).padStart(2, '0')}`, category, stone_type: category === 'marble' ? 'marble' : 'limestone', finish: facets.finish[index % 3], color, application: facets.application[Math.floor(index / 3) % 3], image, temporary: true };
  });
}
