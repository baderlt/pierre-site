export function productionEnvironmentChecks(env) {
  const origin = (value, internal = false) => {
    try {
      const u = new URL(value);
      const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
      return !u.username && !u.password && !u.search && !u.hash && u.pathname === '/' && (u.protocol === 'https:' || internal && loopback && u.protocol === 'http:');
    } catch { return false; }
  };
  return {
    'HTTPS website origin': origin(env.SITE_URL),
    'HTTPS public media origin': origin(env.PUBLIC_MEDIA_ORIGIN),
    'HTTPS or loopback internal API origin': origin(env.LARAVEL_API_URL, true),
    'Private proxy secret configured (32+ characters)': (env.QUOTATION_PROXY_SECRET || '').length >= 32,
    'API deadline between 1000 and 8000 ms': Number.isInteger(Number(env.API_TIMEOUT_MS || 8000)) && Number(env.API_TIMEOUT_MS || 8000) >= 1000 && Number(env.API_TIMEOUT_MS || 8000) <= 8000,
    'Diagnostics disabled': env.CONTENT_DIAGNOSTICS !== 'true',
    'Proxy trust explicitly configured': ['true', 'false'].includes(env.TRUST_PROXY_HEADERS),
  };
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-production-env.mjs')) {
  const checks = productionEnvironmentChecks(process.env);
  for (const [name, passed] of Object.entries(checks)) console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  process.exitCode = Object.values(checks).every(Boolean) ? 0 : 1;
}
