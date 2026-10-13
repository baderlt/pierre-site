import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import net from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';

const outputDirectory = process.env.QA_OUTPUT_DIR || 'docs/qa';
await mkdir(outputDirectory, { recursive: true });
const [selectedLocale, selectedDevice, runCount = '1'] = process.argv.slice(2);
const runs = Number(runCount);
if ((selectedLocale && !['fr', 'en', 'ar'].includes(selectedLocale)) || (selectedDevice && !['mobile', 'desktop'].includes(selectedDevice)) || !Number.isInteger(runs) || runs < 1 || runs > 3) {
  throw new Error('Usage: node scripts/performance.mjs [fr|en|ar] [mobile|desktop] [1|2|3]');
}
const socket = net.createServer();
await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
const port = socket.address().port;
await new Promise(resolve => socket.close(resolve));
const chrome = await chromium.launch({ headless: true, args: [`--remote-debugging-port=${port}`, '--remote-debugging-address=127.0.0.1'] });
const results = [];
try {
  for (const locale of selectedLocale ? [selectedLocale] : ['fr', 'ar']) {
    for (const formFactor of selectedDevice ? [selectedDevice] : ['mobile', 'desktop']) {
      for (let run = 1; run <= runs; run++) {
      const routes = { product: '/products/sample-1', products: '/products', applications: '/applications', about: '/about', contact: '/contact', quote: '/quote' };
      const route = routes[process.env.QA_ROUTE] || '';
      const url = `${process.env.QA_BASE_URL || 'http://127.0.0.1:3000'}/${locale}${route}`;
      const { lhr, report } = await lighthouse(url, {
        port,
        output: ['json', 'html'],
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        ...(formFactor === 'desktop' ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1536, height: 1024, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } : {})
      });
      const suffix = selectedLocale ? `-check-${run}` : '';
      await writeFile(`${outputDirectory}/lighthouse-${locale}-${formFactor}${suffix}.json`, report[0]);
      await writeFile(`${outputDirectory}/lighthouse-${locale}-${formFactor}${suffix}.html`, report[1]);
      const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'total-byte-weight'].map(key => [key, lhr.audits[key].numericValue]));
      const scores = Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score * 100]));
      const result = { url, locale, formFactor, run, fetchTime: lhr.fetchTime, lighthouseVersion: lhr.lighthouseVersion, scores, metrics, warnings: lhr.runWarnings };
      results.push(result);
      console.log(JSON.stringify(result));
      }
    }
  }
} finally { await chrome.close(); }
await writeFile(`${outputDirectory}/performance-summary${selectedLocale ? `-${selectedLocale}-${selectedDevice ?? 'all'}` : ''}.json`, JSON.stringify(results, null, 2));

