# Milestone 6 — Final performance optimization

14 October 2026. Functional verification passes. **The mobile LCP target of 2.5 seconds was not met.** Final warm medians are 4.064 s French homepage, 4.661 s Arabic homepage, 3.764 s French catalogue, 3.909 s Arabic catalogue and 4.137 s product detail. Desktop is 2.025 s. These are laboratory results, not production Core Web Vitals. No deployment or Milestone 7 work was performed.

## Measured before and after

The historical corrective pass reported French homepage median 4.695 s, Arabic 5.263 s, and a single French catalogue run of 6.390 s with uncontrolled cache state. Those are historical context, not the baseline used to attribute this pass's improvements. This pass first collected **18 controlled baseline audits**, then **18 final warm-content audits and 18 final cold-content audits**. Every important page has three comparable samples in each final content-cache state.

Three intermediate French-only exploratory runs are also retained in [experiment/summary.json](qa/milestone-6-final/performance-final/experiment/summary.json). They used the intermediate candidate and are excluded from the final before/after comparison.

All LCP values in this table are Lighthouse **simulated** seconds. Browser caches were reset for every audit. Warm-content dependencies were primed immediately before every warm run; cold runs removed only that route's API payload cache keys.

| Page | Before individual LCP | Before median | After individual LCP | After median | Change |
| --- | --- | --- | --- | --- | --- |
| French homepage / mobile | 4.740 / 4.663 / 4.970 | 4.740 | 3.912 / 4.144 / 4.064 | 4.064 | -14.3% |
| Arabic homepage / mobile | 4.951 / 5.091 / 5.116 | 5.091 | 4.663 / 4.661 / 4.661 | 4.661 | -8.4% |
| French catalogue / mobile | 4.364 / 4.359 / 4.369 | 4.364 | 3.766 / 3.764 / 3.462 | 3.764 | -13.7% |
| Arabic catalogue / mobile | 4.362 / 7.072 / 4.960 | 4.960 | 3.485 / 4.364 / 3.909 | 3.909 | -21.2% |
| French sample-1 / mobile | 4.212 / 4.744 / 4.663 | 4.663 | 4.137 / 4.138 / 4.135 | 4.137 | -11.3% |
| French homepage / desktop | 1.961 / 1.960 / 1.917 | 1.960 | 2.023 / 2.034 / 2.025 | 2.025 | +3.3% |

| Page | Cold-content individual LCP | Cold median | Warm median | Warm modeled TTFB / observed TTFB (ms) | Warm median TBT (ms) | Warm median CLS | Warm median transfer (KiB) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| French homepage / mobile | 3.917 / 4.061 / 4.065 | 4.061 | 4.064 | 457 / 194 | 271 | 0.00064 | 565.3 |
| Arabic homepage / mobile | 4.587 / 4.814 / 4.817 | 4.814 | 4.661 | 456 / 188 | 141 | 0.00356 | 686.8 |
| French catalogue / mobile | 3.761 / 3.764 / 3.762 | 3.762 | 3.764 | 457 / 237 | 136 | 0.00000 | 1499.3 |
| Arabic catalogue / mobile | 3.908 / 4.513 / 4.511 | 4.511 | 3.909 | 457 / 353 | 142 | 0.00000 | 1620.9 |
| French sample-1 / mobile | 4.143 / 4.144 / 4.137 | 4.143 | 4.137 | 456 / 407 | 130 | 0.00000 | 708.8 |
| French homepage / desktop | 2.020 / 1.765 / 2.041 | 2.020 | 2.025 | 283 / 205 | 0 | 0.00029 | 1986.1 |

[Machine-readable comparison](qa/milestone-6-final/performance-final/comparison.json), [every warm run and resource list](qa/milestone-6-final/performance-final/after/summary.json), [every cold run](qa/milestone-6-final/performance-final/after-cold/summary.json), [all raw reports, HTML reports, compressed Chrome traces and DevTools logs](qa/milestone-6-final/performance-final/evidence-index.json).

| Page | Before / after initial transfer (KiB) | Before / after median TBT (ms) | Before / after median CLS |
| --- | --- | --- | --- |
| French homepage / mobile | 1534.1 / 565.3 | 192.1 / 271.4 | 0.00000 / 0.00064 |
| Arabic homepage / mobile | 1655.5 / 686.8 | 188.0 / 141.0 | 0.00365 / 0.00356 |
| French catalogue / mobile | 1594.3 / 1499.3 | 133.0 / 135.9 | 0.00043 / 0.00000 |
| Arabic catalogue / mobile | 1715.8 / 1620.9 | 69.5 / 142.1 | 0.03552 / 0.00000 |
| French sample-1 / mobile | 1213.2 / 708.8 | 71.5 / 130.0 | 0.00000 / 0.00000 |
| French homepage / desktop | 2740.6 / 1986.1 | 0.0 / 0.0 | 0.00030 / 0.00029 |

## Repeatable laboratory configuration

- Windows 11 Pro 10.0.26200; Intel i7-1165G7, 4 cores / 8 threads; approximately 15.7 GiB visible RAM. Existing user applications/services were preserved. Host CPU/memory snapshots and Lighthouse benchmark indices are retained; this is a shared laptop, not a dedicated performance rig.
- Node 24.19.0, Next 16.4.0 production build at `127.0.0.1:3011`, isolated `.next-corrections-m6` output. Laravel 13.35.0 / PHP 8.3.6 / MySQL 8.3.0 on isolated loopback Apache `8011`, 64 threads, OPcache 256 MB, separate cache ID, JIT disabled, no Xdebug in Apache. Database cache and sessions; unchanged business database `time_stone`. PHPUnit uses **only** guarded `time_stone_test`.
- Apache uses the existing private cached Laravel configuration, `APP_CONFIG_CACHE=../../.tools/corrections/laravel-config.php`, and local-only diagnostics. No global configuration cache, environment secret or existing service was replaced.
- Next runtime: `NEXT_DIST_DIR=.next-corrections-m6`, `SITE_URL=http://127.0.0.1:3011`, `LARAVEL_API_URL=http://127.0.0.1:8011`, `PUBLIC_MEDIA_ORIGIN=http://127.0.0.1:8011`, `CONTENT_DIAGNOSTICS=true`. Eight-second API/media deadlines remain unchanged. `TRUST_PROXY_HEADERS=true` is confined to the loopback lab for synthetic rate-limit identities, not a production recommendation.
- Lighthouse 13.5.0, Playwright Chromium headless; exact user agent, version, benchmark index and full settings saved per run. Mobile: 412 × 823, DPR 1.75; simulated RTT 150 ms, throughput 1638.4 Kbit/s, CPU slowdown 4×. Desktop: 1536 × 1024, DPR 1; RTT 40 ms, throughput 10240 Kbit/s, CPU 1×. Performance, accessibility, best-practices and SEO categories; storage reset enabled; no blocked resources or timeout increases.
- One sequential Chrome process per benchmark batch. No PHPUnit, Playwright regressions, build, screenshots or other agent-owned heavy job ran concurrently with the final Lighthouse batches. API payloads have a five-minute TTL; warm priming is performed immediately before **each** run. Cold means API payload cache cold, **not** cold MySQL buffers, OS files, OPcache or a restarted Next process.
- Browser-cache behavior is measured separately by real navigation/resource timing: first navigation after payload eviction, repeated navigation with browser cache intact, then browser cache cleared. Hashed CSS/JS/fonts can be reused; CMS media remains `private, no-store` through the public proxy, with publication rechecked on every delivery.

Reproduction utilities are present in the workspace: `.tools/performance-final/run.mjs`, `cache.php`, `path.mjs`; concurrent runtime configuration remains `.tools/corrections/apache.conf` and its PHP INI. From the workspace root with the documented runtime already running:

```powershell
$qaNode = 'C:/Users/DELL 7420/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
& $qaNode .tools/performance-final/run.mjs after
& $qaNode .tools/performance-final/run.mjs after-cold all cold
& $qaNode .tools/performance-final/path.mjs after
& $qaNode .tools/performance-final/path.mjs after-throttled home
```

Use the bundled Node 24 binary if `node` resolves to a different installation. `after-cold all cold` selects all six cases, evicts only guarded lab-route payloads and resets browser storage for each sample. The supplementary DevTools probe applies actual network throttling: request latency 562.5 ms, download 1474.56 Kbit/s, upload 675 Kbit/s, CPU 4×, matching the Lighthouse preset's DevTools parameters. Its observed results are **not** the Lighthouse simulated metric.

[Runtime versions](qa/milestone-6-final/performance-final/runtime.json), [host before measurement](qa/milestone-6-final/performance-final/host-before-lighthouse.json), [host after measurement](qa/milestone-6-final/performance-final/host-after-lighthouse.json).

Host CPU calibration varied despite identical settings. Keep every sample; do not treat all score changes as caused by application code. Lighthouse benchmark-index medians:

| Page | Before | Final warm | Final cold |
| --- | --- | --- | --- |
| French homepage / mobile | 3110 | 2780 | 3323 |
| Arabic homepage / mobile | 2930 | 2666 | 3340 |
| French catalogue / mobile | 3319 | 3104 | 3238 |
| Arabic catalogue / mobile | 3350 | 2092 | 2927 |
| French sample-1 / mobile | 3148 | 3270 | 2948 |
| French homepage / desktop | 2854 | 3199 | 3033 |

## Critical rendering path

The first phase preceded source changes. Direct API probes captured aggregate application time, PDO query wall time/count and real cache hit/miss headers. Browser navigation timing captured Next HTML TTFB, document parsing, resource discovery/transfer, image selection and loaded fonts. Lighthouse traces captured observed LCP, script/style work and simulated timings. Exact SQL and bindings were deliberately not logged.

| Locale / actual API cache state | Samples | Median API headers (ms) | Median Laravel application (ms) | Median database wall time (ms) | Median query count |
| --- | --- | --- | --- | --- | --- |
| fr / miss | 23 | 184.3 | 180.5 | 24.2 | 18 |
| fr / hit | 25 | 192.5 | 185.8 | 20.9 | 9 |
| ar / miss | 24 | 199.6 | 189.2 | 23.6 | 18 |
| ar / hit | 24 | 180.9 | 166.5 | 18.9 | 9 |

Database numbers are `DB::listen` timings, including driver/loopback overhead, not isolated MySQL engine CPU measurements. Cache hits still execute session/cache/publication/security queries; those checks were preserved. The existing homepage requests are already parallel and request-deduplicated (six distinct endpoints); catalogue definitions and shell requests are parallel. Product related results retain the existing dependent fetch. This pass did not remove required content or change backend cache TTL, locks, observers or publication validation.

The LCP elements and median **observed/unthrottled** breakdown below come from final Lighthouse traces. They must not be added to, or confused with, the simulated LCP table above.

| Page | Actual LCP element | TTFB | Discovery delay | Resource load | Render delay |
| --- | --- | --- | --- | --- | --- |
| French homepage / mobile | `section#home > div.hero-art > picture > img` | 193.7 ms | 20.2 ms | 198.2 ms | 64.2 ms |
| Arabic homepage / mobile | `section#home > div.hero-art > picture > img` | 188.0 ms | 24.9 ms | 189.4 ms | 18.3 ms |
| French catalogue / mobile | `main#main > section.catalogue-hero > picture > img` | 236.8 ms | 43.5 ms | 188.6 ms | 14.0 ms |
| Arabic catalogue / mobile | `main#main > section.catalogue-hero > picture > img` | 352.7 ms | 24.1 ms | 300.1 ms | 12.8 ms |
| French sample-1 / mobile | `section.product-gallery > div.gallery-stage > picture > img` | 407.2 ms | 14.4 ms | 177.2 ms | 20.8 ms |
| French homepage / desktop | `section#home > div.hero-art > picture > img` | 204.6 ms | 8.7 ms | 180.3 ms | 240.4 ms |

The hero was already eagerly discoverable in server HTML and prioritized before this pass; there was no late client-only hero discovery to fix. French loads approximately 73.6 KB of WOFF2 fonts; Arabic approximately 197.7 KB (Noto Sans Arabic 400/600 and Noto Naskh Arabic). The approved typefaces and `font-display: swap` remain unchanged. Font costs and their actual request positions are included in each network report; this pass did not replace typography or preload unused locale fonts.

Supplementary browser probes record renderer injection, root hydration commits and post-commit effects through a diagnostic-only React DevTools hook injected by the test harness, plus long tasks and LCP. Root commits are hydration milestones, **not proof that every selectively hydrated boundary is complete**. No probe code is shipped to clients. Trace script-evaluation/style-layout totals are available in raw Lighthouse reports; render delay is explicitly measured above rather than inferred from DOMContentLoaded.

[Pre-change API/cache/browser evidence](qa/milestone-6-final/performance-final/critical-path-before.json), [final cache, resource, font and hydration evidence](qa/milestone-6-final/performance-final/critical-path-after.json), [actual throttled browser-cache probes](qa/milestone-6-final/performance-final/critical-path-after-throttled.json).

Actual browser navigation timings (one probe per state/page, not three-run medians). Transfer includes document and resources observed by Resource Timing. First hydrated root commit is a wall-clock milestone after navigation, not CPU-only hydration duration.

| Probe | Locale / page | Cache state | HTML TTFB (ms) | Observed LCP (ms) | First hydrated root commit (ms) | Transfer (KiB) |
| --- | --- | --- | --- | --- | --- | --- |
| unthrottled | fr / home | cold-content/cold-browser | 354.7 | 608.0 | 533.9 | 561.1 |
| unthrottled | fr / home | warm-content/warm-browser | 209.3 | 500.0 | 257.2 | 337.2 |
| unthrottled | fr / home | warm-content/fresh-browser | 241.8 | 520.0 | 297.5 | 561.1 |
| unthrottled | fr / catalogue | cold-content/cold-browser | 498.7 | 756.0 | 711.3 | 1492.9 |
| unthrottled | fr / catalogue | warm-content/warm-browser | 220.0 | 416.0 | 266.8 | 1253.3 |
| unthrottled | fr / catalogue | warm-content/fresh-browser | 212.6 | 408.0 | 290.1 | 1492.9 |
| unthrottled | fr / product | cold-content/cold-browser | 526.4 | 756.0 | 703.6 | 703.0 |
| unthrottled | fr / product | warm-content/warm-browser | 465.5 | 644.0 | 504.8 | 451.1 |
| unthrottled | fr / product | warm-content/fresh-browser | 464.3 | 660.0 | 551.2 | 703.0 |
| unthrottled | ar / home | cold-content/cold-browser | 229.1 | 432.0 | 448.3 | 682.3 |
| unthrottled | ar / home | warm-content/warm-browser | 226.2 | 404.0 | 273.5 | 337.5 |
| unthrottled | ar / home | warm-content/fresh-browser | 199.7 | 400.0 | 259.4 | 682.3 |
| unthrottled | ar / catalogue | cold-content/cold-browser | 258.0 | 488.0 | 444.4 | 1614.3 |
| unthrottled | ar / catalogue | warm-content/warm-browser | 225.5 | 424.0 | 267.7 | 1253.8 |
| unthrottled | ar / catalogue | warm-content/fresh-browser | 215.2 | 412.0 | 267.4 | 1614.3 |
| unthrottled | ar / product | cold-content/cold-browser | 516.2 | 856.0 | 790.9 | 824.2 |
| unthrottled | ar / product | warm-content/warm-browser | 437.9 | 632.0 | 477.6 | 451.3 |
| unthrottled | ar / product | warm-content/fresh-browser | 397.8 | 592.0 | 498.1 | 824.2 |
| DevTools-throttled | fr / home | cold-content/cold-browser | 318.1 | 4300.0 | 3008.6 | 561.1 |
| DevTools-throttled | fr / home | warm-content/warm-browser | 208.6 | 3028.0 | 1040.0 | 337.2 |
| DevTools-throttled | fr / home | warm-content/fresh-browser | 210.9 | 4292.0 | 2944.3 | 561.1 |
| DevTools-throttled | ar / home | cold-content/cold-browser | 331.1 | 4944.0 | 3072.2 | 682.3 |
| DevTools-throttled | ar / home | warm-content/warm-browser | 276.8 | 3016.0 | 946.3 | 337.4 |
| DevTools-throttled | ar / home | warm-content/fresh-browser | 280.7 | 4956.0 | 3024.3 | 682.3 |

The simulated Lighthouse subpart fields in raw metrics use scaled observed timestamp boundaries; they are not independently measured phase durations. The trace insight breakdown and actual throttled navigation probes above provide the measured path evidence.

Selected LCP resources and transferred asset classes, from the first final warm run (the raw resource lists retain every run):

| Page | Selected LCP image | Image transfer (KiB) / priority | Font transfer (KiB) | Script transfer (KiB) |
| --- | --- | --- | --- | --- |
| French homepage / mobile | `/media/31/hero_mobile` | 286.8 / High | 71.9 | 146.6 |
| Arabic homepage / mobile | `/media/31/hero_mobile` | 286.8 / High | 193.0 | 146.6 |
| French catalogue / mobile | `/media/58/banner_mobile` | 238.9 / High | 71.9 | 146.2 |
| Arabic catalogue / mobile | `/media/58/banner_mobile` | 238.9 / High | 193.0 | 146.2 |
| French sample-1 / mobile | `/media/11/large` | 279.6 / High | 71.9 | 150.3 |
| French homepage / desktop | `/media/31/banner` | 858.8 / High | 71.9 | 146.6 |

The real throttled homepage probes show the remaining cost even on return visits: French warm-content/fresh-browser LCP 4.292 s versus 3.028 s with browser cache retained; Arabic 4.956 s versus 3.016 s. Cold-content runs were 4.300 s French and 4.944 s Arabic. These single probes do not establish a new passing median. They show that initial asset transfer remains more consequential than payload-cache misses in this lab; cached frontend assets help, while the detailed hero still transfers through the publication-checked media proxy.

## Changes made

1. Added quality-90 `hero_mobile` and `banner_mobile` WebP derivatives from validated originals, with no upscaling. The homepage uses a 927 × 1280 crop at its existing 44% focal position on narrow screens. Its original 1200 × 864 mobile preview had lower vertical pixel density; the new crop keeps more detail while discarding off-canvas pixels. The catalogue derivative retains enough horizontal content for every viewport up to 479 px and the minimum 330 px hero height. Widths 480–767 retain the existing preview; desktop retains the existing banner. Preload media conditions match picture selection exactly. Small/portrait originals retain their aspect/content; older libraries safely fall back to the existing preview.
2. Limited early fetching for homepage category, quarry and introduction imagery using the existing client image component and a 200 px IntersectionObserver margin. No image resolution/compression was reduced in these sections. The placeholder is verified transparent, observers disconnect, and real server-rendered `<noscript>` image fallbacks preserve browsing without JavaScript. Images load eagerly when approaching view. Other non-priority images receive an explicit low fetch priority.
3. Product finish swatches use existing thumbnail derivatives instead of loading the full 2048 px texture during the static product visit. The original texture remains available at full quality when the 3D viewer activates; Three.js remains activation-only.
4. Added focused browser tests for crop selection at 320/390/430/479/480/767/768/1024/1536 px in all languages, avoiding unwanted desktop hero transfers, deferred loading, no-JavaScript images and no premature full texture. Extended backend tests for no upscaling, focal-position preservation and publication privacy of both new variants.

Only the two measured LCP media records were backfilled. Their IDs, original files, pre-existing variants, timestamps and every other column remain unchanged; future validated uploads generate the new variants. [Exact derivative dimensions and byte sizes](qa/milestone-6-final/performance-final/backfill.json).

Application/test files changed:

- [apps/api/app/Domain/MediaLibrary.php](../apps/api/app/Domain/MediaLibrary.php)
- [apps/api/app/Http/Controllers/MediaController.php](../apps/api/app/Http/Controllers/MediaController.php)
- [apps/api/tests/Feature/BannerTest.php](../apps/api/tests/Feature/BannerTest.php)
- [apps/web/src/app/media/[id]/[variant]/route.ts](../apps/web/src/app/media/[id]/[variant]/route.ts)
- [apps/web/src/components/media-image.tsx](../apps/web/src/components/media-image.tsx)
- [apps/web/src/components/home-page.tsx](../apps/web/src/components/home-page.tsx)
- [apps/web/src/components/product-studio.tsx](../apps/web/src/components/product-studio.tsx)
- [apps/web/src/app/[locale]/products/page.tsx](../apps/web/src/app/[locale]/products/page.tsx)
- [tests/banners.spec.ts](../tests/banners.spec.ts)
- [tests/product.spec.ts](../tests/product.spec.ts)
- [tests/performance-images.spec.ts](../tests/performance-images.spec.ts)

No dependencies, schema migrations, queues, business-content edits, new animations or 3D-engine changes were introduced. Cache/security/quotation logic and deadlines remain intact.

## Executed regression results

| Check | Final result | Evidence |
| --- | --- | --- |
| Laravel, isolated MySQL | 68 tests, 398 assertions, zero failures/errors; 143.800 s | [JUnit](qa/milestone-6-final/performance-final/backend-final-junit.xml) / [log](qa/milestone-6-final/performance-final/backend-final.log) |
| Next production build | Passed; all localized routes remain SSR | [build log](qa/milestone-6-final/performance-final/build-final.log) |
| Separate TypeScript | Passed, exit 0 | [executed result](qa/milestone-6-final/performance-final/verification.json) |
| Standalone/integrated engine | 8 passed, zero failures/skips; original prototype unchanged | [3D tests](qa/milestone-6-final/performance-final/3d-final.log) |
| Full Playwright, one worker, no retries | 127 passed, 20 skipped, zero failures/flaky; 43.90 min | [full results](qa/milestone-6-final/performance-final/playwright-results.json) / [case and skip list](qa/milestone-6-final/performance-final/browser-summary.json) |
| Real admin/public workflows | Publication, cache invalidation, media replacement, saved 3D/PBR/GLB synchronization, revocation, quotation persistence and Filament visibility passed | [workflow](qa/milestone-6-final/performance-final/end-to-end.json) |
| Immutable saved quotation configuration | Passed after subsequent product configuration edit | [database evidence](qa/milestone-6-final/performance-final/persistence-evidence.json) |
| Real validation/rate limit/duplicate protection | 201 / 200 duplicate / 409 conflict / 422 invalid email / 201 / 429; unchanged 5/min limit | [HTTP/database results](qa/milestone-6-final/performance-final/http-quotations.json) |
| Lost-response recovery | Persisted request recovered with same key/reference; no false success or browser storage | [recovery](qa/milestone-6-final/performance-final/network-recovery.json) |
| Client secret/internal-origin boundary | Passed for all generated client JS | [scan](qa/milestone-6-final/performance-final/client-boundary.json) |
| Preservation/cleanup | All original business row hashes, 456 original file hashes and environment hashes preserved; owner active; disposable fixtures removed | [integrity](qa/milestone-6-final/performance-final/cleanup.json) |

The first browser attempt was stopped after two diagnosed stale assertions: the product test still required the unwanted full texture, and the banner test accepted only `1` while Filament also serialized a true filter as `true`. Assertions were corrected to verify the intended behavior; no application protection or timeout was weakened. The final full suite was restarted from the beginning. [Interrupted run](qa/milestone-6-final/performance-final/browser-interrupted-harness.log), [product failure](qa/milestone-6-final/performance-final/product-old-assertion.md), [filter failure](qa/milestone-6-final/performance-final/banner-old-assertion.md).

Every intentional skip in the final run:

| Project | Test | Reason |
| --- | --- | --- |
| tablet | catalogue width matrix and screenshots in three languages | Run the complete matrix once. |
| tablet | catalogue works without client JavaScript | Native GET forms covered once. |
| mobile | catalogue width matrix and screenshots in three languages | Run the complete matrix once. |
| mobile | catalogue works without client JavaScript | Native GET forms covered once. |
| desktop | mobile/tablet menu traps focus, navigates and closes with Escape | Desktop uses the visible navigation. |
| tablet | requested widths preserve hero space, typography and layout in every language | Additional widths are covered once. |
| mobile | requested widths preserve hero space, typography and layout in every language | Additional widths are covered once. |
| tablet | product width matrix, screenshots and no initial 3D payload | Complete matrix once. |
| tablet | product photos, details and quotation destination work without JavaScript | SSR native navigation once. |
| mobile | product width matrix, screenshots and no initial 3D payload | Complete matrix once. |
| mobile | product photos, details and quotation destination work without JavaScript | SSR native navigation once. |
| tablet | public page viewport matrix and screenshots |  |
| tablet | SSR routes, paginated application products, no-script safety and validation bounds |  |
| mobile | public page viewport matrix and screenshots |  |
| mobile | SSR routes, paginated application products, no-script safety and validation bounds |  |
| tablet | 3D controls, formats, finishes, demand rendering, exports and resource budgets | Desktop and mobile cover the same engine. |
| tablet | 3D responsive and RTL activation matrix | Complete matrix once. |
| tablet | WebGL initialization failure returns an accessible static preview | Failure mode once. |
| mobile | 3D responsive and RTL activation matrix | Complete matrix once. |
| mobile | WebGL initialization failure returns an accessible static preview | Failure mode once. |

Activated viewer measurements, captured separately by the functional regression harness (SwiftShader, not a physical phone):

| Viewport | Activation (ms) | JS heap initial / active / after disposal (MiB) | Active DPR | Textures / geometries | Activation-only JS (KiB) |
| --- | --- | --- | --- | --- | --- |
| desktop | 2026 | 3.45 / 10.31 / 13.27 | 1 | 18 / 17 | 255.8 |
| mobile | 4507 | 3.65 / 10.57 / 13.21 | 1.5 | 18 / 17 | 255.8 |

[Desktop viewer counters](qa/milestone-6-final/performance-final/viewer-metrics-desktop.json), [mobile viewer counters](qa/milestone-6-final/performance-final/viewer-metrics-mobile.json). Heap values after disposal can remain higher until garbage collection; they are not evidence of physical GPU reclamation. Disposal, pause/resume, one-canvas behavior and exports were checked by the passing viewer tests.

## Screenshots

Updated viewport screenshots use the final assets and all three languages. Full regression evidence also covers the requested six widths, Arabic RTL, keyboard/focus behavior, reduced motion, accessible controls and the working viewer. Capture of viewport images is separate from performance measurement.

| Language | Homepage mobile / desktop | Catalogue mobile / desktop |
| --- | --- | --- |
| fr | [390 px](qa/milestone-6-final/performance-final/after/screenshots/fr-home-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/fr-home-1536.png) | [390 px](qa/milestone-6-final/performance-final/after/screenshots/fr-catalogue-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/fr-catalogue-1536.png) |
| en | [390 px](qa/milestone-6-final/performance-final/after/screenshots/en-home-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/en-home-1536.png) | [390 px](qa/milestone-6-final/performance-final/after/screenshots/en-catalogue-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/en-catalogue-1536.png) |
| ar | [390 px](qa/milestone-6-final/performance-final/after/screenshots/ar-home-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/ar-home-1536.png) | [390 px](qa/milestone-6-final/performance-final/after/screenshots/ar-catalogue-390.png) / [1536 px](qa/milestone-6-final/performance-final/after/screenshots/ar-catalogue-1536.png) |

[All fresh archived regression screenshots](qa/milestone-6-final/performance-final/screenshots-index.json), [real activated Arabic viewer](qa/milestone-6-final/performance-final/viewer-ar-390.png), [real quote confirmation](qa/milestone-6-final/performance-final/quotation-success-ar-390.png), [real admin replacement](qa/milestone-6-final/performance-final/media-update-1536.png).

## Remaining limitations and trade-offs

- The 2.5-second target is evaluated against the actual final samples above; no failing sample is presented as passing. Remaining fresh-visit costs include high-detail hero transfer, required framework code, Arabic font bytes and dynamic server response. This pass retains the existing premium typography and photographic detail rather than forcing a lower-quality hero or bypassing authoritative publication checks.
- This is not proof that further improvement is impossible. Same-appearance font subsetting and conditional media revalidation remain unvalidated options; their savings are not claimed. Publication checks and instant media replacement would still have to run correctly. The current Arabic faces remain intact to preserve glyph coverage and approved typography.
- Not every metric improved. French homepage median simulated TBT increased from 192 to 271 ms; other TBT changes are listed above. Its median script boot-up estimate increased from 350 to 544 ms, with substantial run-to-run/host calibration variation. The cause was not isolated, so this is retained as an unresolved measurement rather than attributed entirely to the image changes or to the host. Desktop median LCP increased 3.3% (1.960 to 2.025 s) while its image source remained unchanged.
- Reduced initial transfer reflects deferred off-screen photos, not removal of those photos from the site. Rapid scrolling over a constrained connection can briefly show the existing section background while a newly approaching image loads. No-JavaScript browsing retains native lazy images.
- A content-cache cold run is not a hardware/process/OPcache/MySQL-buffer cold start. Browser-cache probes have one observed navigation per state/page, while the Lighthouse comparisons have three independent browser-cache-reset samples per page/state. Runtime versions, host snapshots and per-run benchmark indices define the practical repeatability limits of this shared laptop.
- Lighthouse is a laboratory simulation, not field Core Web Vitals or an assurance about production hosting/CDN/network conditions. No real-user monitoring, physical-phone GPU/VRAM measurement, production load test or security penetration test was performed. Browser WebGL tests use software rendering; heap/resource counters cannot be presented as physical mobile GPU memory.
- Local synthetic quote identities and trusted-forwarded-header overrides are confined to the loopback lab. Production TLS, trusted-proxy topology, deployment credentials and infrastructure tuning remain unverified. Existing owner credentials and environment secrets were preserved, not rotated. Intentional noindex remains enabled, so SEO scoring is not a launch-readiness claim.

**Stopped after Milestone 6 performance verification. No deployment and no Milestone 7 work. Awaiting approval.**
