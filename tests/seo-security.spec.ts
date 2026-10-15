import {test, expect} from '@playwright/test';

test('localized metadata, factual schema and staging safeguards', async ({page, baseURL}) => {
  for (const locale of ['fr','en','ar']) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag']).toContain('noindex');
    expect(response?.headers()['content-security-policy-report-only']).toContain("object-src 'none'");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/${locale}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${baseURL}/${locale}`);
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}');
    expect(data['@type']).toBe('WebSite');
    expect(data.inLanguage).toBe(locale);
    expect(data).not.toHaveProperty('aggregateRating');
    expect(data).not.toHaveProperty('address');
  }
});

test('sitemap is publication-aware, canonical and remains protected from indexing', async ({request, baseURL}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['x-robots-tag']).toContain('noindex');
  expect(response.headers()['cache-control']).toContain('no-store');
  const xml = await response.text();
  expect(xml).toContain('<urlset');
  expect(xml).toContain(`${baseURL}/fr/products`);
  expect(xml).not.toMatch(/\/quote|\/admin|\/media|customer|email|idempotency|sample-\d/);
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  expect(new Set(locations).size).toBe(locations.length);
  expect(locations.every(url => url.startsWith(baseURL!+'/'))).toBe(true);
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toMatch(/Disallow: \//);
});

test('quotation proxy rejects cross-origin, malformed and oversized input before persistence', async ({request, baseURL}) => {
  const key = '12345678-1234-4234-8234-123456789012';
  expect((await request.post('/api/quotations', {headers:{Origin:'https://evil.invalid','Idempotency-Key':key}, data:{}})).status()).toBe(403);
  expect((await request.post('/api/quotations', {headers:{Origin:baseURL!,'Idempotency-Key':key,'Content-Type':'application/json'}, data:Buffer.from('{')})).status()).toBe(400);
  expect((await request.post('/api/quotations', {headers:{Origin:baseURL!,'Idempotency-Key':key}, data:{padding:'x'.repeat(65536)}})).status()).toBe(413);
  const original = await request.get('/media/1/original');
  expect(original.status()).toBe(404);
  expect(original.headers()['cache-control']).toContain('no-store');
});
