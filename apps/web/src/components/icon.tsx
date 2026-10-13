import type { SVGProps } from 'react';

const paths: Record<string, React.ReactNode> = {
  arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
  mountain: <><path d="m2 20 6-13 4 7 4-11 6 17H2Z" /><path d="m6 11 2 3 2-3m4-3 2 3 2-3" /></>,
  diamond: <><path d="m3 8 4-5h10l4 5-9 13L3 8Z" /><path d="M3 8h18M7 3l5 18 5-18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></>,
  leaf: <><path d="M20 3C5 2 1 13 7 18s15-3 13-15Z" /><path d="M4 22 16 9M10 15h6" /></>,
  cube: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" /><path d="m3 7 9 5 9-5M12 12v10M7 4l10 6" /></>,
  chat: <><path d="M21 11a9 9 0 0 1-13 8l-5 2 1-5A9 9 0 1 1 21 11Z" /><path d="M8 10h8M8 14h5" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
  close: <><path d="m5 5 14 14M19 5 5 19" /></>,
  expand: <><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" /></>,
  shield: <><path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Z" /><path d="m8 12 3 3 5-6" /></>
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: string }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.arrow}</svg>;
}
