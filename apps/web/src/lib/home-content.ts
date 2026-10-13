import type { Locale } from './locales';

// Temporary editorial fixtures. This boundary will receive Laravel DTOs in M6.
export interface HomeContent {
  brand?:string;logo?:string;socials?:{label:string;url:string}[];
  meta: { title: string; description: string };
  skip: string; language: string; menu: string; close: string;
  nav: string[]; quote: string; explore: string; discover: string;
  hero: { eyebrow: string; title: string; description: string; preview: string; scroll: string; specimen: string; specimenCopy: string };
  temporary: string; temporaryShort: string; demo: string;
  qualities: { title: string; description: string }[];
  collection: { eyebrow: string; title: string; description: string; action: string; names: string[]; sample: string };
  quarry: { eyebrow: string; title: string; description: string; action: string; caption: string };
  introduction: { eyebrow: string; title: string; description: string; action: string };
  featured: { eyebrow: string; title: string; description: string; names: string[]; captions: string[] };
  craft: { eyebrow: string; title: string; description: string; steps: string[] };
  applications: { eyebrow: string; title: string; description: string; names: string[] };
  quality: { eyebrow: string; title: string; description: string; points: string[] };
  contact: { eyebrow: string; title: string; description: string; status: string };
  footer: { tagline: string; navigation: string; materials: string; languages: string; rights: string; note: string };
  viewer: { title: string; description: string; selected: string; note: string };
}

export const homeContent: Record<Locale, HomeContent> = {
  fr: {
    meta: { title: 'TIME STONE — La pierre, intemporelle', description: 'Explorez les matières, les formats et les possibilités architecturales de TIME STONE. Présentation temporaire du futur showroom de pierre naturelle.' },
    skip: 'Aller au contenu', language: 'Choisir la langue', menu: 'Ouvrir le menu', close: 'Fermer',
    nav: ['Accueil', 'Collection', 'Applications', 'À propos', 'Carrière', 'Contact'], quote: 'Demander un devis', explore: 'Explorer nos pierres', discover: 'Découvrir la matière',
    hero: { eyebrow: 'PIERRE NATURELLE · MAROC', title: 'La pierre intemporelle.\nL’architecture de demain.', description: 'Des textures singulières, des nuances naturelles. Imaginez une nouvelle place pour la pierre dans votre projet.', preview: 'Voir les matières', scroll: 'Découvrir', specimen: 'L’expression du calcaire', specimenCopy: 'Une étude de matière aux nuances chaudes et au caractère minéral.' },
    temporary: 'Présentation provisoire : images illustratives et contenu à valider. Aucun projet ni produit présenté n’est une référence commerciale confirmée.', temporaryShort: 'Visuel illustratif · provisoire', demo: 'ÉCHANTILLON DE PRÉSENTATION',
    qualities: [{ title: 'Pierre naturelle', description: 'La matière à l’origine' }, { title: 'Nuances & textures', description: 'Un caractère singulier' }, { title: 'Formats à explorer', description: 'Dalles, blocs et carreaux' }, { title: 'Idées d’espaces', description: 'Intérieur et extérieur' }, { title: 'Votre projet', description: 'Des besoins à préciser' }, { title: 'Un échange direct', description: 'Des contacts à confirmer' }],
    collection: { eyebrow: 'NOTRE COLLECTION', title: 'Explorez la pierre naturelle', description: 'Calcaire, marbre et formats architecturaux : une première découverte de la matière.', action: 'Découvrir les sélections', names: ['Calcaire', 'Marbre', 'Carreaux', 'Blocs', 'Créations sur mesure'], sample: 'Collection illustrative' },
    quarry: { eyebrow: 'DE LA CARRIÈRE À LA MATIÈRE', title: 'Une histoire façonnée\npar la pierre', description: 'La matière brute, le geste, la transformation. Un aperçu visuel de l’univers de la pierre, en attendant les images et le récit de TIME STONE.', action: 'Explorer le savoir-faire', caption: 'Illustration de carrière · lieu non vérifié' },
    introduction: { eyebrow: 'L’ESPRIT TIME STONE', title: 'Une matière naturelle.\nUne vision architecturale.', description: 'Ce showroom est conçu pour rapprocher la pierre de votre projet : découvrir les textures, comparer les formats et préparer un échange autour de vos besoins.', action: 'Imaginer votre espace' },
    featured: { eyebrow: 'ÉTUDES DE MATIÈRE', title: 'Le détail fait la différence', description: 'Trois inspirations visuelles. Les produits, finitions et dimensions réels seront confirmés avec TIME STONE.', names: ['Nuances de calcaire', 'Le caractère du marbre', 'La pierre en grand format'], captions: ['Texture & lumière', 'Veines & contrastes', 'Volumes & proportions'] },
    craft: { eyebrow: 'LE SAVOIR-FAIRE', title: 'Du bloc à l’espace', description: 'Une lecture illustrative des étapes de transformation. Le procédé réel et les finitions disponibles restent à documenter.', steps: ['La sélection de la matière', 'La découpe & les proportions', 'La finition de surface', 'Le détail architectural'] },
    applications: { eyebrow: 'LES APPLICATIONS', title: 'La pierre dans chaque espace', description: 'Des inspirations architecturales pour envisager votre projet.', names: ['Façades extérieures', 'Sols intérieurs', 'Revêtements muraux', 'Escaliers & marches'] },
    quality: { eyebrow: 'CHOISIR EN CONNAISSANCE', title: 'Chaque projet commence\npar les bonnes questions.', description: 'L’usage, la finition et les dimensions guident le choix. Les caractéristiques techniques seront publiées après validation.', points: ['Quel usage pour votre pierre ?', 'Quelle finition pour votre espace ?', 'Quelles dimensions pour votre projet ?'] },
    contact: { eyebrow: 'CONSTRUISONS LA SUITE', title: 'Votre projet commence ici.', description: 'Une idée, une matière, un besoin particulier. Préparez les dimensions, les quantités et le lieu de livraison pour votre future demande.', status: 'Le formulaire de devis et les coordonnées officielles seront disponibles après validation. Aucune demande n’est envoyée depuis cette présentation.' },
    footer: { tagline: 'La matière. Le temps. L’architecture.', navigation: 'Explorer', materials: 'Les matières', languages: 'Langues', rights: 'TIME STONE · Présentation de développement', note: 'Images temporaires issues des maquettes approuvées. Informations commerciales à confirmer.' },
    viewer: { title: 'Une première rencontre avec la matière', description: 'Explorez ces photographies de surface illustratives.', selected: 'Matière sélectionnée', note: 'Aperçu photographique 2D. La visualisation 3D interactive sera intégrée à l’étape dédiée. Les faces cachées ne peuvent pas être déduites d’une seule photographie.' }
  },
  en: {
    meta: { title: 'TIME STONE — Timeless stone for modern architecture', description: 'Explore materials, formats and architectural possibilities with TIME STONE. A temporary presentation of the future natural stone showroom.' },
    skip: 'Skip to content', language: 'Choose language', menu: 'Open menu', close: 'Close',
    nav: ['Home', 'Collection', 'Applications', 'About', 'Quarry', 'Contact'], quote: 'Request a quote', explore: 'Explore our stone', discover: 'Discover the material',
    hero: { eyebrow: 'NATURAL STONE · MOROCCO', title: 'Timeless Stone\nfor Modern\nArchitecture', description: 'Distinctive textures. Natural tones. Imagine a new place for stone in your next architectural project.', preview: 'Explore the materials', scroll: 'Discover', specimen: 'The character of limestone', specimenCopy: 'A material study in warm tones and natural mineral texture.' },
    temporary: 'Temporary presentation: illustrative images and draft content. No project or product shown is a confirmed commercial reference.', temporaryShort: 'Illustrative image · temporary', demo: 'PRESENTATION SAMPLE',
    qualities: [{ title: 'Natural stone', description: 'It begins with the material' }, { title: 'Tones & textures', description: 'Individual character' }, { title: 'Explore the formats', description: 'Slabs, blocks and tiles' }, { title: 'Ideas for spaces', description: 'Indoors and outdoors' }, { title: 'Your project', description: 'Define your requirements' }, { title: 'A direct conversation', description: 'Contacts to be confirmed' }],
    collection: { eyebrow: 'OUR COLLECTION', title: 'Explore Our Natural Stone', description: 'Limestone, marble and architectural formats. A first encounter with the possibilities of stone.', action: 'Discover the selections', names: ['Limestone', 'Marble', 'Tiles', 'Blocks', 'Custom Designs'], sample: 'Illustrative collection' },
    quarry: { eyebrow: 'FROM QUARRY TO MATERIAL', title: 'A story shaped\nby stone', description: 'Raw material, skilled hands, transformation. A visual introduction to the world of stone while TIME STONE’s own images and story are prepared.', action: 'Discover the craft', caption: 'Quarry illustration · location unverified' },
    introduction: { eyebrow: 'THE SPIRIT OF TIME STONE', title: 'Natural material.\nArchitectural possibility.', description: 'A showroom designed to bring stone closer to your project: explore textures, compare formats and prepare a conversation around what you need.', action: 'Imagine your space' },
    featured: { eyebrow: 'MATERIAL STUDIES', title: 'Beauty is in the detail', description: 'Three visual inspirations. Actual products, finishes and dimensions will be confirmed with TIME STONE.', names: ['Limestone in warm tones', 'The character of marble', 'Stone in larger formats'], captions: ['Texture & light', 'Veins & contrast', 'Volume & proportion'] },
    craft: { eyebrow: 'THE CRAFT', title: 'From block to space', description: 'An illustrative look at the stages of transformation. The actual process and available finishes remain to be documented.', steps: ['Selecting the material', 'Cutting & proportion', 'Finishing the surface', 'The architectural detail'] },
    applications: { eyebrow: 'APPLICATIONS', title: 'Stone for Every Space', description: 'Architectural inspiration to help you imagine your project.', names: ['Exterior façades', 'Interior flooring', 'Wall cladding', 'Stairs & steps'] },
    quality: { eyebrow: 'AN INFORMED CHOICE', title: 'Every project starts\nwith the right questions.', description: 'Use, finish and dimensions guide the selection. Technical characteristics will be published after verification.', points: ['How will the stone be used?', 'Which finish suits your space?', 'What dimensions does your project need?'] },
    contact: { eyebrow: 'LET’S BUILD WHAT’S NEXT', title: 'Your project starts here.', description: 'An idea, a material, a particular requirement. Gather your dimensions, quantities and delivery location for a future quotation request.', status: 'The quotation form and official contact details will be available after confirmation. This presentation does not send any requests.' },
    footer: { tagline: 'Material. Time. Architecture.', navigation: 'Explore', materials: 'Materials', languages: 'Languages', rights: 'TIME STONE · Development presentation', note: 'Temporary imagery from the approved mockups. Commercial information awaits confirmation.' },
    viewer: { title: 'A closer look at the material', description: 'Explore these illustrative surface photographs.', selected: 'Selected material', note: '2D photographic preview. Interactive 3D will be integrated in its dedicated milestone. A single photograph cannot reveal hidden surfaces.' }
  },
  ar: {
    meta: { title: 'تايم ستون — حجر خالد لعمارة معاصرة', description: 'اكتشف الخامات والأشكال والإمكانات المعمارية مع تايم ستون. عرض مؤقت لصالة عرض الحجر الطبيعي المرتقبة.' },
    skip: 'انتقل إلى المحتوى', language: 'اختر اللغة', menu: 'افتح القائمة', close: 'إغلاق',
    nav: ['الرئيسية', 'التشكيلة', 'الاستخدامات', 'من نحن', 'المحجر', 'التواصل'], quote: 'اطلب عرض سعر', explore: 'اكتشف أحجارنا', discover: 'اكتشف الخامة',
    hero: { eyebrow: 'حجر طبيعي · المغرب', title: 'حجر يتخطّى الزمن.\nلعمارة معاصرة.', description: 'ملمس فريد وألوان طبيعية. تخيّل مكانًا جديدًا للحجر في مشروعك المعماري القادم.', preview: 'استكشف الخامات', scroll: 'اكتشف المزيد', specimen: 'جمال الحجر الجيري', specimenCopy: 'دراسة بصرية لخامة بألوان دافئة وملمس معدني طبيعي.' },
    temporary: 'عرض مؤقت: صور توضيحية ومحتوى بانتظار الاعتماد. المنتجات والمشاريع المعروضة ليست مراجع تجارية مؤكدة.', temporaryShort: 'صورة توضيحية · مؤقتة', demo: 'نموذج للعرض',
    qualities: [{ title: 'حجر طبيعي', description: 'البداية من الخامة' }, { title: 'ألوان وملمس', description: 'طابع متفرّد' }, { title: 'أشكال متنوعة', description: 'ألواح وكتل وبلاط' }, { title: 'أفكار للمساحات', description: 'للداخل والخارج' }, { title: 'مشروعك', description: 'تحديد الاحتياجات' }, { title: 'تواصل مباشر', description: 'بيانات قيد التأكيد' }],
    collection: { eyebrow: 'تشكيلتنا', title: 'اكتشف جمال الحجر الطبيعي', description: 'الحجر الجيري والرخام والأشكال المعمارية. بداية لاكتشاف إمكانات الخامة.', action: 'استكشف المختارات', names: ['الحجر الجيري', 'الرخام', 'البلاط', 'الكتل الحجرية', 'تصاميم حسب الطلب'], sample: 'تشكيلة توضيحية' },
    quarry: { eyebrow: 'من المحجر إلى الخامة', title: 'حكاية صاغها\nالحجر', description: 'خامة أولية، وحرفة، وتحول. لمحة بصرية عن عالم الحجر، ريثما تتوفر صور تايم ستون وقصتها المعتمدة.', action: 'اكتشف الحرفة', caption: 'صورة توضيحية لمحجر · الموقع غير مؤكد' },
    introduction: { eyebrow: 'روح تايم ستون', title: 'خامة طبيعية.\nورؤية معمارية.', description: 'صالة عرض تقرّب الحجر من مشروعك: اكتشف الملمس، وقارن الأشكال، واستعد لحوار حول احتياجاتك.', action: 'تخيّل مساحتك' },
    featured: { eyebrow: 'دراسات للخامة', title: 'الجمال يكمن في التفاصيل', description: 'ثلاثة تصورات بصرية. سيتم تأكيد المنتجات والتشطيبات والأبعاد الفعلية مع تايم ستون.', names: ['درجات الحجر الجيري', 'طابع الرخام', 'الحجر بأبعاد كبيرة'], captions: ['الملمس والضوء', 'العروق والتباين', 'الحجم والتناسب'] },
    craft: { eyebrow: 'الحرفة', title: 'من الكتلة إلى المساحة', description: 'تصور توضيحي لمراحل التحويل. تبقى تفاصيل التصنيع والتشطيبات المتاحة بانتظار التوثيق.', steps: ['اختيار الخامة', 'القطع والتناسب', 'تشطيب السطح', 'التفصيل المعماري'] },
    applications: { eyebrow: 'الاستخدامات', title: 'حجر لكل مساحة', description: 'أفكار معمارية تساعدك على تصوّر مشروعك.', names: ['الواجهات الخارجية', 'الأرضيات الداخلية', 'كسوة الجدران', 'السلالم والدرجات'] },
    quality: { eyebrow: 'اختيار على بيّنة', title: 'كل مشروع يبدأ\nبالأسئلة المناسبة.', description: 'الاستخدام والتشطيب والأبعاد هي أساس الاختيار. تُنشر الخصائص التقنية بعد التحقق منها.', points: ['كيف سيُستخدم الحجر؟', 'ما التشطيب المناسب لمساحتك؟', 'ما الأبعاد التي يحتاجها مشروعك؟'] },
    contact: { eyebrow: 'لنبنِ الخطوة القادمة', title: 'مشروعك يبدأ هنا.', description: 'فكرة، أو خامة، أو احتياج خاص. جهّز الأبعاد والكميات وموقع التسليم لطلب عرض السعر لاحقًا.', status: 'سيتوفر نموذج عرض السعر وبيانات التواصل الرسمية بعد التأكيد. لا يُرسل هذا العرض أي طلبات.' },
    footer: { tagline: 'الخامة. الزمن. العمارة.', navigation: 'استكشف', materials: 'الخامات', languages: 'اللغات', rights: 'تايم ستون · عرض قيد التطوير', note: 'صور مؤقتة من التصاميم المعتمدة. المعلومات التجارية بانتظار التأكيد.' },
    viewer: { title: 'نظرة أقرب إلى الخامة', description: 'استكشف هذه الصور التوضيحية لأسطح الحجر.', selected: 'الخامة المختارة', note: 'معاينة فوتوغرافية ثنائية الأبعاد. يُدمج العرض الثلاثي الأبعاد التفاعلي في مرحلته المخصصة. لا تكشف صورة واحدة عن الأسطح المخفية.' }
  }
};

export const categoryImages = ['limestone', 'marble', 'tiles', 'blocks', 'custom'];
export const applicationImages = ['facade', 'interior', 'cladding', 'stairs'];
export const navigationTargets = ['#home', '#collection', '#applications', '#about', '#quarry', '#contact'];
export const materialImages = ['limestone', 'marble', 'tiles'];

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale];
}
