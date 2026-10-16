import type {Locale} from '@/lib/locales';

const labels: Record<Locale, string> = {
  fr: 'Nous contacter sur WhatsApp (nouvel onglet)',
  en: 'Contact us on WhatsApp (opens in a new tab)',
  ar: 'تواصل معنا عبر واتساب (يفتح في علامة تبويب جديدة)',
};

export function FloatingWhatsapp({phone, locale}: {phone: string; locale: Locale}) {
  if (!/^\+?[1-9]\d{6,14}$/.test(phone)) return null;
  return <a className="floating-whatsapp" href={`https://wa.me/${phone.replace(/^\+/, '')}`} target="_blank" rel="noopener noreferrer" aria-label={labels[locale]} title={labels[locale]}>
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.78 1.47h.01C18.64 23.83 24 18.47 24 11.88c0-3.19-1.24-6.17-3.48-8.4ZM12.05 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.38a9.9 9.9 0 0 1-1.52-5.23c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.48-4.45 9.94-9.96 9.94Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61l.45-.52c.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.07-.8.37-.28.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  </a>;
}
