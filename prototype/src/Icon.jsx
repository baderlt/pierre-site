const paths = {
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  upload: 'M12 16V3m-4 4 4-4 4 4M4 15v5h16v-5',
  image: 'M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4M15 8h.01',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
  download: 'M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5',
  camera: 'M8 6l2-3h4l2 3h5v14H3V6zM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  cube: 'm12 3 9 5v9l-9 5-9-5V8zm0 10 9-5m-9 5L3 8m9 5v9M7.5 5.5l9 5',
  check: 'm5 12 4 4L19 6',
  info: 'M12 8h.01M12 11v6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  chevron: 'm9 5 7 7-7 7',
  rotate: 'M3 10a9 9 0 0 1 15-6l3 3m0-6v6h-6M21 14a9 9 0 0 1-15 6l-3-3m0 6v-6h6',
  lock: 'M5 10h14v11H5zm3 0V6a4 4 0 0 1 8 0v4',
  close: 'm6 6 12 12M6 18 18 6',
  mouse: 'M12 3v7m-6-1a6 6 0 0 1 12 0v6a6 6 0 0 1-12 0z',
  layers: 'm12 3 10 5-10 5L2 8zm-9 10 9 5 9-5M3 18l9 5 9-5',
};
export default function Icon({ name, size = 18, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.cube} /></svg>;
}
