import { isIP } from 'node:net';

/** Only explicit origins are accepted; never silently discard credentials or paths. */
export function configuredOrigin(value: string | undefined): string {
  if (!value) throw new Error('Missing service origin');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid service origin');
  return url.origin;
}

export function apiTimeout(): number {
  const value = Number(process.env.API_TIMEOUT_MS || 8000);
  if (!Number.isInteger(value) || value < 1000 || value > 8000) throw new Error('Invalid service deadline');
  return value;
}

/** Nginx must overwrite this header with one address and keep Next inaccessible directly. */
export function quotationClient(headers: Headers): string {
  if (process.env.TRUST_PROXY_HEADERS !== 'true') return 'local';
  const value = headers.get('X-Forwarded-For')?.trim() || '';
  return isIP(value) ? value : 'local';
}
