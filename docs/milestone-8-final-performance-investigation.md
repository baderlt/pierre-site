# M8 final local performance investigation — 15 October 2026

## Decision

**Mobile LCP ≤2.5 seconds has not been achieved.** Accept the verified stability/resource improvements separately; do not record the mobile performance gate as passed. No deployment, VPS connection, M9, image/font replacement, security relaxation or speculative content caching was performed.

One confirmed layout regression was fixed: the homepage quotation loading container now retains the existing placeholder's minimum height while the lazy JavaScript chunk loads. The final form, dedicated quotation page, submission logic and business data are unchanged. No LCP optimization with a defensible benefit under the stated design/quality constraints was identified for this bounded pass.

Historical M7/M8 reports, release archives and QA outputs were preserved. New evidence is under `docs/qa/milestone-8-final-investigation/`. The baseline is the current production build, including the separately completed custom-geometry work; historical M8 results are explicitly distinguished below.

## Evidence inspected first

- Existing M8 performance audit, optimization/test reports, verified and verified-cold Lighthouse reports, compressed Chrome traces/network logs, critical-path timing captures, database query profiles, form measurements and viewer-cycle evidence.
- `existing-trace-analysis.json` extracts the original three samples per route, image/font timings, priorities, LCP nodes, CPU tasks and trace LCP events.
- `simulation-replay.json` recomputes Lighthouse's optimistic/pessimistic Lantern graphs from the saved traces and network logs. Replayed LCP matches the original result exactly for all six replayed routes. This was offline analysis, not an additional website audit.

## Confirmed bottleneck

Lighthouse's **simulated** mobile LCP and its **observed** loopback LCP breakdown are different measurements. Adding observed TTFB/load/render phases cannot explain a simulated 4–5-second total. The simulation graph identifies the critical image transfer as the last dependency, with competing scripts/fonts consuming the constrained network. Hydration CPU nodes finish earlier in the replay. Arabic's additional approximately 125 KB of approved fonts increases competition; it is not a demonstrated multi-second font paint-block.

Historical frozen M8 replay, representative sample 1 (milliseconds):

| Route | Simulated HTML request completion | Critical image start | Critical image transfer duration | Optimistic / pessimistic LCP |
|---|---:|---:|---:|---:|
| FR home | 794.9 | 794.9 | 3494.9 | 4289.9 / 4289.9 |
| AR home | 756.8 | 756.8 | 4206.8 | 4963.7 / 4963.7 |
| FR catalogue | 606.6 | 606.6 | 3156.6 | 3763.2 / 3763.2 |
| AR catalogue | 606.5 | 606.5 | 3906.5 | 4512.9 / 4512.9 |
| FR product | 608.7 | 608.7 | 3458.7 | 4067.4 / 4217.4 |
| FR desktop home | 350.0 | 350.0 | 1390.0 | 1740.0 / 1740.0 |

HTML request completion includes transfer; it is **not** HTML TTFB. The simulator predicts dependency completion, not a separately measured final paint delay. The fresh observed phase measurements and individual Lighthouse samples are recorded in the measurement section below and `measurement-summary.json`.

The approved mobile homepage hero is 294,020 transferred bytes; the catalogue banner is 244,934; the representative product image is 286,604. French/English fonts transfer approximately 74 KB versus Arabic's 199 KB. Heroes are server-discoverable, eagerly loaded, high priority, and select the expected narrow WebP derivative. No duplicate desktop hero download or unnecessary initial WebGL scene was found. Fonts already use local files and `font-display: swap`. The existing M8 catalogue transfer reductions remain present.

## Server path and cache

- The homepage already starts independent content, categories, featured catalogue, applications and site reads concurrently. Request-local React deduplication prevents repeating identical metadata/layout API reads. This was confirmed in the source and existing request timing captures; it was not implemented again.
- Product detail awaits authoritative product/shell/definitions together, then requests material-filtered related products. That second request gates the current full response. It is a real dependent SSR hop, not a reason to remove publication checks or cache arbitrarily.
- New HTTP diagnostics captured 36 API requests, with response status, `X-Content-Cache`, aggregate `Server-Timing`, query counts and DB time; no SQL, bindings, headers or customer records were exported. Current naturally occurring misses are labelled by the actual header, not represented as controlled cold runs.
- Cache-hit requests still execute nine bounded queries. Representative new warm requests spend roughly 8–30 ms in DB work within roughly 250–390 ms of application time. Existing controlled cold profiles show larger bounded miss query counts; no N+1 or missing-index root cause was demonstrated. Aggregate DB time includes driver/host overhead, not an isolated MySQL execution-engine profile.
- Existing controlled cold-content/warm-process evidence is preserved separately from warm-browser behavior. New `diagnostics.json` records fresh/repeat browser navigation and resource timing. Protected media remains authorized/no-store on each delivery; it is not promised a public browser/CDN cache hit. Static hashed JS/fonts can benefit from repeat browser cache. No cache keys, business rows or private media were evicted or modified by the new diagnostics.
- New application SSR overhead is inferred from HTML timing, existing aggregate API logs and source dependencies; there is no instrumented per-function Next CPU profile. The available evidence does not support assigning all residual time to SSR or MySQL.

## Three highest-impact opportunities

1. **Critical-path bandwidth and delivery scheduling.** Exact replay places hero/banner transfer last. The highest-value next measurement is the same bytes over production-equivalent Linux/TLS/HTTP2 delivery, inspecting prioritization and compression of HTML/CSS/JS. Images are already WebP and fonts already WOFF2; no claim that merely changing the OS/protocol will meet 2.5 seconds. A smaller critical derivative could reduce transfer, but further crop/resolution/quality changes require visual review and were not made.
2. **Arabic font and framework-script competition.** Arabic adds about 125 KB while using the same critical image. Both fonts and scripts overlap its transfer in the exact simulation. Preserve approved glyphs, shaping and typography. Any additional font subsetting or script-island restructuring needs coverage/visual and measured before/after proof; replacing fonts, delaying visible text or dropping necessary navigation/form behavior is unjustified. Optional font-table inspection could not run because `fontTools` is absent; no dependency was installed and no font was modified.
3. **Product related-results SSR dependency / measured PHP bootstrap overhead.** Streaming the below-fold related section could remove one dependent request from initial delivery, but changes failure/streaming semantics and needs a separate validated implementation. Windows API cache-hit application time substantially exceeds measured DB work. Linux PHP-FPM/OPcache may differ, but no Linux or VPS measurements were performed. Existing local OPcache is enabled; timestamp validation is enabled with revalidation frequency zero. Do not disable freshness checks based on an unmeasured deployment assumption.

These are ranked evidence-supported opportunities, not promised savings. No repeated broad caching, timeout changes, security bypasses, speculative indexes or uncontrolled image recompression were attempted.

## Confirmed quotation layout fix

The prior loading transition was: 1450 px mobile placeholder → essentially empty active wrapper while dynamic import resolves → approximately 1875–2005 px form. Layout-shift sources show the quotation page link and location section jumping into view, then out again. A temporary browser-only `content-visibility: visible` override did **not** resolve it and was rejected.

The accepted change reserves 900 px desktop / 1450 px mobile on `.home-quote-active`, matching the already approved placeholder. It does not set a fixed height or clip an expanded form. Three runs per locale, after visiting preceding deferred sections to isolate this transition:

| Locale | Existing scroll-phase shift sum | Reserved-active shift sum | Final wrapper height before / after |
|---|---:|---:|---:|
| FR | 1.828407 | 0.000482 | 2058.36 / 2058.36 px |
| EN | 1.832296 | 0.000482 | 2018.77 / 2018.77 px |
| AR | 1.847365 | 0.000482 | 1928.70 / 1928.70 px |

All three samples per cell agree. These are sums of recorded non-input layout-shift entries during a scripted scroll, **not** initial-load CLS, field CWV or INP. `form-reserved-ab.json` retains each event/source rectangle. Validation-driven expansion after user input is recorded separately in `diagnostics.json` and was not suppressed.

Changed application/test files:

- `apps/web/src/app/home-targeted.css`: three lines reserving the lazy loading space.
- `tests/homepage-targeted.spec.ts`: regression deliberately holds the quotation chunk response, checks reserved space, releases it and verifies the form becomes usable.

## 3D heap investigation

New 16-cycle mobile-width test, Chromium SwiftShader, forced GC and 1500 ms after canvas removal: all activations had eight textures and 17 geometries, one canvas; all teardown checks had zero canvases; hidden render count did not increase. Settled heap grew from 9,958,932 bytes at cycle 8 to 10,580,852 at cycle 16; the last four settled values grew by 92,472 bytes. Initial page heap excludes loaded Three.js/export modules and must not be used as a leak baseline.

This still shows a small positive JS-heap trend. Stable renderer counters do not prove absence of a JS retention leak or measure physical GPU memory. No specific retained application object/leak root was proven, so no speculative disposal/engine refactor was made. Longer physical-device endurance and retained-object heap-snapshot comparison remain open. Activation durations in this supplementary check are not controlled performance benchmarks; other verification work overlapped part of the run. Original prototype/resources are unchanged.

## Verification and limits

- Production build: passed in a separate `.next-m8-final-investigation` directory; TypeScript passed. Existing M8/custom-feature build outputs were preserved.
- Laravel: **35 tests, 243 assertions passed**, isolated `time_stone_test` with the existing database guard. Filters: Integration, Publishing, SecurityReadiness, ProductViewer and Banner. This is focused verification, not a repeated full M8 gate.
- Node security/map/geometry/viewer tests: **27 passed, zero failed/skipped**. Existing module-format warning retained; no unrelated package change.
- Playwright, screenshots and final Lighthouse results are recorded below after completion.
- No Firefox/WebKit, real mobile GPU/VRAM/endurance, production field CWV, Linux infrastructure, backup/restore or deployed TLS/proxy behavior was newly verified. Existing operational limitations remain in M7/M8 reports.

## Measurements and final browser results

Exactly **48 new Lighthouse audits**: three before and three after for each of eight routes. No retries, discarded samples or score-chasing reruns. Raw JSON/HTML reports, compressed traces and network logs are in [performance/](qa/milestone-8-final-investigation/performance/); [measurement-summary.json](qa/milestone-8-final-investigation/measurement-summary.json) retains phase medians, every LCP/CLS/TBT sample and CPU benchmark index.

Runtime: Windows, Node 24.19 / Next 16.4 production builds; loopback Next 3036 before / 3037 after; the same concurrent Apache 2.4.59 / PHP 8.3.6 API on 8028 and isolated MySQL 8.3 database `time_stone_m8`, existing private QA media/config. Apache has 64 threads, OPcache enabled, JIT off. New source build output is separate from the preserved before build.

Lighthouse 13.5 / bundled HeadlessChrome 156.0.8078.4. Mobile: 412×823, DPR 1.75, **simulated** 150 ms RTT / 1638.4 Kbps / CPU 4×. Desktop: 1536×1024, DPR 1, 40 ms RTT / 10240 Kbps / CPU 1×. Full settings are saved per sample. Each navigation uses a fresh Lighthouse browser cache; SSR dependencies are primed immediately before each run. This is warm content/process, not cold process/OS/MySQL. Browser-repeat and naturally cold content observations are separate diagnostics. Build, tests, viewer and screenshot workloads did not overlap either Lighthouse batch.

**Host limitation:** this is a shared Windows laptop, not a dedicated lab host. An existing Next development process and generated type-file rewrites were observed; it was not interrupted. CPU calibration varied substantially, particularly in the before batch. Thus matching network/cache settings does not make host load identical. TTFB/TBT/desktop differences are retained and must not be attributed to the three-line CSS change. These are lab results, not field Core Web Vitals or Linux/VPS measurements.

| Route | Before LCP samples (s) | Before median | After LCP samples (s) | After median |
|---|---|---:|---|---:|
| home-fr | 4.381, 4.211, 4.211 | 4.211 | 4.072, 4.211, 4.361 | 4.211 |
| home-ar | 4.962, 5.040, 4.820 | 4.962 | 5.114, 4.971, 4.960 | 4.971 |
| home-en | 4.065, 4.212, 4.221 | 4.212 | 4.210, 4.363, 4.064 | 4.210 |
| catalogue-fr | 3.778, 3.694, 3.913 | 3.778 | 3.687, 3.773, 3.700 | 3.700 |
| catalogue-ar | 4.539, 4.454, 4.557 | 4.539 | 4.513, 4.508, 4.510 | 4.510 |
| catalogue-en | 3.701, 3.822, 4.127 | 3.822 | 3.766, 3.761, 3.762 | 3.762 |
| product-fr | 4.096, 4.764, 4.077 | 4.096 | 3.840, 4.137, 4.137 | 4.137 |
| desktop-fr | 2.244, 2.399, 3.585 | 2.399 | 1.843, 2.142, 2.726 | 2.142 |

CPU calibration (Lighthouse benchmarkIndex, individual sample order):

| Route | Before | After |
|---|---|---|
| home-fr | 1755, 2866.5, 2975.5 | 3196, 3377, 2755 |
| home-ar | 2793.5, 1496.5, 1535 | 3125.5, 3131.5, 3225.5 |
| home-en | 1765.5, 1897.5, 1791 | 3157, 3194, 3194.5 |
| catalogue-fr | 1857.5, 1152, 1930.5 | 3345, 2973.5, 2031.5 |
| catalogue-ar | 1918, 1921, 1914.5 | 2838.5, 3318, 3094.5 |
| catalogue-en | 1729.5, 1982, 1964.5 | 3359.5, 3326, 3223 |
| product-fr | 1632, 1802.5, 1702.5 | 2827, 3076, 3026.5 |
| desktop-fr | 2046.5, 2077, 1951.5 | 3349, 3084.5, 2993.5 |

Observed **unthrottled** after-phase medians and other metrics, not components of the simulated LCP above. Each phase median is computed independently; use raw sample details for an additive single-navigation breakdown.

| Route | TTFB ms | Load delay ms | Image duration ms | Render delay ms | Median CLS | Median TBT ms | Transfer KiB |
|---|---:|---:|---:|---:|---:|---:|---:|
| home-fr | 243.8 | 28.0 | 196.2 | 54.2 | 0.000638 | 120.0 | 582.7 |
| home-ar | 266.9 | 34.4 | 206.1 | 56.2 | 0.003564 | 113.0 | 704.7 |
| home-en | 230.7 | 13.4 | 192.0 | 55.8 | 0.004071 | 93.0 | 581.8 |
| catalogue-fr | 341.1 | 15.4 | 261.1 | 14.8 | 0.000000 | 119.0 | 610.4 |
| catalogue-ar | 287.2 | 53.5 | 223.5 | 42.2 | 0.035517 | 84.0 | 732.4 |
| catalogue-en | 247.6 | 20.8 | 198.8 | 8.4 | 0.000378 | 77.0 | 610.1 |
| product-fr | 420.9 | 44.9 | 179.0 | 8.6 | 0.000000 | 125.0 | 719.3 |
| desktop-fr | 258.4 | 62.3 | 199.7 | 235.4 | 0.000294 | 0.0 | 2006.4 |

LCP elements: home `section#home > div.hero-art > picture > img`; catalogue `main#main > section.catalogue-hero > picture > img`; product `section.product-gallery > div.gallery-stage > picture > img`. Their exact resource URLs and node rectangles are retained per report. No mobile route achieved a ≤2.5-second median. Homepage differences are negligible; catalogue/product code is unchanged by this pass. No LCP improvement is claimed.

Playwright: **44 passed, 0 failed, 0 flaky, 6 intentional skips**, zero retries, desktop/mobile projects. The six skipped cases are two synthetic location-fixture cases (no fixture proxy configured), desktop mobile-menu case, and three duplicate mobile-project matrices/fallback cases exercised in the desktop project. The targeted section test visits 320, 390, 430, 768, 1024 and 1536 px in every locale; desktop viewer matrix also covers mobile widths/locales. This is a focused suite, not the full historical M8 suite. Raw results: [playwright.json](qa/milestone-8-final-investigation/playwright.json), [playwright.log](qa/milestone-8-final-investigation/playwright.log). No failing tests were excluded after execution.

Screenshots: [FR mobile hero](qa/milestone-8-final-investigation/after-fr-390-hero.png), [FR desktop hero](qa/milestone-8-final-investigation/after-fr-1536-hero.png), [FR mobile form](qa/milestone-8-final-investigation/after-fr-390-form.png), [AR mobile form](qa/milestone-8-final-investigation/after-ar-390-form.png). Full before/after FR/EN/AR desktop/mobile sets are alongside these files. All six final form images are pixel-identical, with zero height delta and no horizontal overflow. Hero geometry is unchanged; pixel comparisons retain 0–251 differing pixels (maximum 0.0763% of a screenshot), so full screenshots are not all claimed byte-identical. See [visual.json](qa/milestone-8-final-investigation/visual.json) and [visual-pixels.json](qa/milestone-8-final-investigation/visual-pixels.json).

Executed command evidence: [build.log](qa/milestone-8-final-investigation/build.log), [typescript.log](qa/milestone-8-final-investigation/typescript.log), [laravel.log](qa/milestone-8-final-investigation/laravel.log), [unit.log](qa/milestone-8-final-investigation/unit.log). Aggregate Next→API timing logs include both browser verification and performance requests, so are not presented as isolated per-audit SSR profiles: [next-api-timings.jsonl](qa/milestone-8-final-investigation/next-api-timings.jsonl).

M7/M8 release archive SHA-256 hashes still match the previously recorded values; [release-integrity.json](qa/milestone-8-final-investigation/release-integrity.json). The archives were preserved, not regenerated to contain this new CSS fix. No main business DB writes, media replacement, account changes or secret changes were performed. Only the existing guarded test database was used for backend regression writes.

The investigation's temporary preview on 3037 was stopped after verification; existing previews were preserved. Generated TypeScript configuration/type-import pointers were restored. Final diff check passed; only the homepage CSS, its regression test and new report/evidence remain changed. See [teardown.json](qa/milestone-8-final-investigation/teardown.json).

**Recommendation:** accept the confirmed quotation stability correction and retain the accepted M8 resource improvements. Keep the mobile LCP gate explicitly unmet; require separately authorized production-equivalent delivery measurements before any claim of production performance acceptance. No further local experiment is proposed in this pass. The small 3D heap trend and host/Lighthouse limitations remain documented.
