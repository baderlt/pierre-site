import type { NextConfig } from 'next';

const config: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [{ source: '/', destination: '/fr', permanent: false }];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src https://www.openstreetmap.org; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:" },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
    ] }];
  }
};
export default config;
