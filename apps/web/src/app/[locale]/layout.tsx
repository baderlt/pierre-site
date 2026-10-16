export const dynamic = 'force-dynamic';
import {getSite} from '@/lib/api';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/locales';
import {FloatingWhatsapp} from '@/components/floating-whatsapp';
import '../globals.css';

const serif = localFont({ src: '../../fonts/noto-serif-latin.woff2', variable: '--font-serif', display: 'swap', preload: false });
const sans = localFont({ src: '../../fonts/noto-sans-latin.woff2', variable: '--font-sans', display: 'swap', preload: false });
const arabicSerif = localFont({ src: '../../fonts/noto-naskh-arabic.woff2', variable: '--font-arabic-serif', display: 'swap', preload: false });
const arabicSans = localFont({ src: [
  { path: '../../fonts/noto-sans-arabic-400.woff2', weight: '400', style: 'normal' },
  { path: '../../fonts/noto-sans-arabic-600.woff2', weight: '600', style: 'normal' }
], variable: '--font-arabic-sans', display: 'swap', preload: false });

export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();const site=await getSite(locale);return {icons:{icon:site.favicon||'/icon.svg'}};}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSite(locale);
  return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body className={`${serif.variable} ${sans.variable} ${arabicSerif.variable} ${arabicSans.variable}`}>{children}<FloatingWhatsapp phone={site.contacts.whatsapp} locale={locale}/></body></html>;
}
