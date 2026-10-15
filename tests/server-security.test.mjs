import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuredOrigin, apiTimeout, quotationClient} from '../apps/web/src/lib/server-config.ts';
import {productionEnvironmentChecks} from '../scripts/check-production-env.mjs';

test('origins reject embedded credentials, paths, fragments and unsafe protocols', () => {
  for (const value of [undefined, 'file:///secret', 'https://user@api.example.test', 'https://api.example.test/api', 'https://api.example.test/?key=x', 'https://api.example.test/#x']) assert.throws(() => configuredOrigin(value));
  assert.equal(configuredOrigin('https://api.gos-cert.org'), 'https://api.gos-cert.org');
  assert.equal(configuredOrigin('http://127.0.0.1:8011'), 'http://127.0.0.1:8011');
});

test('deadlines cannot silently grow or become invalid', () => {
  const before = process.env.API_TIMEOUT_MS;
  try {
    for (const value of ['0', '-1', '8001', 'Infinity', 'abc', '1000.5']) { process.env.API_TIMEOUT_MS = value; assert.throws(apiTimeout); }
    delete process.env.API_TIMEOUT_MS; assert.equal(apiTimeout(), 8000);
  } finally { if (before === undefined) delete process.env.API_TIMEOUT_MS; else process.env.API_TIMEOUT_MS = before; }
});

test('quotation identity requires explicit trust and one valid IP address', () => {
  const before = process.env.TRUST_PROXY_HEADERS;
  try {
    process.env.TRUST_PROXY_HEADERS = 'false'; assert.equal(quotationClient(new Headers({'X-Forwarded-For': '198.51.100.1'})), 'local');
    process.env.TRUST_PROXY_HEADERS = 'true';
    for (const value of ['spoof', '198.51.100.1, 127.0.0.1', '127.0.0.1:80', '']) assert.equal(quotationClient(new Headers({'X-Forwarded-For': value})), 'local');
    for (const value of ['198.51.100.1', '2001:db8::1']) assert.equal(quotationClient(new Headers({'X-Forwarded-For': value})), value);
  } finally { if (before === undefined) delete process.env.TRUST_PROXY_HEADERS; else process.env.TRUST_PROXY_HEADERS = before; }
});

test('release preflight rejects local public URLs, weak secrets and diagnostics', () => {
  const env = {SITE_URL:'https://gos-cert.org', PUBLIC_MEDIA_ORIGIN:'https://api.gos-cert.org', LARAVEL_API_URL:'http://127.0.0.1:8081', QUOTATION_PROXY_SECRET:'x'.repeat(32), TRUST_PROXY_HEADERS:'true'};
  assert.ok(Object.values(productionEnvironmentChecks(env)).every(Boolean));
  for (const [key,value] of Object.entries({SITE_URL:'http://gos-cert.org', PUBLIC_MEDIA_ORIGIN:'http://127.0.0.1', LARAVEL_API_URL:'https://user@api.gos-cert.org', QUOTATION_PROXY_SECRET:'short', CONTENT_DIAGNOSTICS:'true', API_TIMEOUT_MS:'9000', TRUST_PROXY_HEADERS:'yes'})) assert.ok(Object.values(productionEnvironmentChecks({...env,[key]:value})).includes(false));
});
