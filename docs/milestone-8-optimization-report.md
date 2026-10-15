# Milestone 8 — optimization report

## Implemented changes

Five application files changed relative to accepted M7; no dependency, schema/index, source-image, font, stylesheet or design changes. Existing quotation endpoints, privacy/security policy and original prototype remain intact.

1. `apps/web/src/app/[locale]/products/page.tsx`: reuse approach-based `MediaImage` deferral for cards/lower banner/process photos; correct card `sizes` to actual grid geometry. At 412 px/DPR 1.75 a 178 px card needs 312 physical pixels; the existing 320 px derivative replaces an unnecessarily selected 640 px response. Decode regression verifies adequate source resolution. Quality 90, source files, crops and layout unchanged; no-JavaScript fallback works.
2. `apps/web/src/components/stone-engine/StoneViewer.jsx`: share color/bump Three.js `Source` objects among six independent face textures. Installed Three.js caches GPU allocations by Source and sampler settings. Independent UV transforms remain; canvas pixels and exported images/materials/UVs match baseline exactly.
3. New `apps/api/app/Domain/RetryingDatabaseStore.php` and `apps/api/app/Providers/AppServiceProvider.php`: bounded retry of native atomic database-cache `add` after an observed MySQL 1213 deadlock during public rate-limit initialization. At most three attempts, 20 ms backoff, only recognized concurrency errors outside enclosing transactions. Never retries a request or quotation transaction; preserves cache format/prefix/locks/events and rate/TTL/deadline behavior. Mirrors locked Laravel 13.35 configuration; review compatibility on framework upgrades.
4. `apps/web/src/app/[locale]/error.tsx`: use Next 16.4 native `retry` callback (legacy `reset` fallback). A controlled upstream failure proved reset alone made no new API request and could not recover; native retry refreshes server content and clears the boundary. Healthy pages and localized error copy unchanged.

Tests: `tests/performance-images.spec.ts`, `tests/viewer.spec.ts`, `tests/public-pages.spec.ts`, new `apps/api/tests/Unit/DatabaseCacheTest.php`. Normal Next type references regenerated in `apps/web/tsconfig.json` and `apps/web/next-env.d.ts`. Required M8 reports/evidence and ignored private QA helpers are additional deliverables. Accepted M7 reports/artifact not overwritten. Source-package verification lists exact changed/new paths.

## Before / final measurements

Medians of three samples per case/state. LCP is Lighthouse simulated seconds; TTFB is observed trace time. Individual metrics, LCP nodes/breakdowns, settings, warnings and calibration: [comparison JSON](qa/milestone-8/performance-comparison.json).

| Page | Before warm LCP s | Final warm LCP s | Final cold LCP s | Before / final warm KiB | Transfer change |
| --- | ---: | ---: | ---: | ---: | ---: |
| home-fr | 4.216 | 4.212 | 4.213 | 582.6 / 582.6 | 0.0% |
| home-en | 4.217 | 4.217 | 4.210 | 581.8 / 581.8 | 0.0% |
| home-ar | 4.967 | 4.963 | 4.968 | 704.7 / 704.7 | 0.0% |
| catalogue-fr | 3.764 | 3.764 | 3.758 | 1506.8 / 610.4 | -59.5% |
| catalogue-en | 3.987 | 3.763 | 3.759 | 1506.5 / 610.1 | -59.5% |
| catalogue-ar | 4.516 | 4.515 | 4.513 | 1628.8 / 732.4 | -55.0% |
| product-fr | 4.137 | 4.142 | 4.211 | 715.7 / 715.7 | 0.0% |
| desktop-fr | 1.810 | 1.757 | 2.045 | 2006.4 / 2006.4 | -0.0% |

| Page | Warm / cold observed TTFB ms | Warm / cold TBT ms | Warm / cold CLS |
| --- | ---: | ---: | ---: |
| home-fr | 287.4 / 332.2 | 97.0 / 96.0 | 0.00000 / 0.00000 |
| home-en | 241.5 / 260.9 | 96.0 / 99.0 | 0.00407 / 0.00407 |
| home-ar | 242.3 / 264.8 | 83.0 / 95.0 | 0.00356 / 0.00402 |
| catalogue-fr | 229.3 / 281.1 | 57.0 / 53.0 | 0.00043 / 0.00043 |
| catalogue-en | 250.5 / 281.4 | 54.0 / 77.0 | 0.00038 / 0.00038 |
| catalogue-ar | 242.2 / 342.0 | 75.0 / 76.0 | 0.03552 / 0.00349 |
| product-fr | 404.7 / 562.5 | 107.0 / 128.0 | 0.00000 / 0.00000 |
| desktop-fr | 235.9 / 253.3 | 0.0 / 0.0 | 0.00030 / 0.00030 |

**Every final mobile median remains above 2.5 s.** Catalogue byte savings are 55–60%; material LCP improvement is not established. Homepage timing changes must not be credited to catalogue optimization. Worsened samples remain visible.

## Repeatability

Completed Lighthouse audits: 171. Baseline 48; intermediate deferral candidate 27 (24 warm, 3 cold); catalogue final 48; final frozen source 48. Intermediate cold batch intentionally stopped when responsive sizing justified a rebuild; [record](qa/milestone-8/intermediate-stop.json). Only `verified` / `verified-cold` represent the final regressed source.

Same production Next/Apache/OPcache runtime, business read dataset, browser/Lighthouse versions, viewport, throttling and cache method. One benchmark at a time; no test/build/load overlap during final measurements. Shared laptop retains user applications/services. Calibration indices vary; timing differences are not clean causal speedups. Byte savings and texture reductions follow measured resource selection/allocation.

Lighthouse 13.5.0 / HeadlessChrome 156.0.8078.4; mobile 412×823 DPR 1.75, simulated RTT 150 ms, 1638.4 Kbit/s CPU 4×; desktop 1536×1024 DPR 1, RTT 40 ms, 10240 Kbit/s CPU 1×. Warm payloads primed before each audit. Cold evicts relevant API payload keys only, not OS/PHP/MySQL buffers. Every Lighthouse browser cache fresh. Separate resource probes retain/clear browser cache. Initial product audits never activate WebGL. Lab results are not field CWV/INP.

## Remaining measured limits

Home hero about 294 KB, catalogue hero 245 KB; approved local Arabic WOFF 2 transfer 199 KB versus 74 KB FR/EN. Hero already SSR-discoverable/eager/high priority; observed render delay small. Below-fold reduction does not remove critical assets/framework costs on the simulated connection. No quality/font/security sacrifice or persistent private-media cache introduced.

Product retains authoritative fetch then material-filtered related results, a dependent SSR hop. Streaming/splitting remains a candidate needing status/error/layout testing. Current small-data plans show no costly N+1/index hotspot; no schema change justified. Target remains unresolved, not proven impossible.

## 3D

[8-cycle final probe](qa/milestone-8/viewer-cycles-final.json), [pixel/export comparison](qa/milestone-8/viewer-comparison.json): 18→8 textures, 17 geometries and 8 draw calls unchanged. At most one canvas, hidden frames 0, unmounted canvas 0. Identical canvas pixels 390/1536; GLB images/dimensions/materials/UVs match. Warm repeat activation medians mobile 2757→2005 ms, desktop 2972→2036 ms are software-lab observations with host variability. Product-map conservative allocation bound 160→26.7 MiB excludes other allocations and is not physical VRAM.

Final 700 ms post-unmount/GC shows small last-four-cycle heap trend (~9.23→9.36 MiB mobile, 9.20→9.32 desktop). Eight cycles do not prove leak-free endurance/physical thermal safety. [Export timing/URL cleanup](qa/milestone-8/export-performance.json), [geometry](qa/milestone-8/geometry.json). Original prototype byte identity passes.

## Stability

[Cache deadlock](qa/milestone-8/cache-deadlock.json), six retry tests/36 assertions, 192/192 expiry-contention HTTP 200 responses. MySQL deadlock status counter unavailable: no measured real retry-count claim. Atomicity and transaction boundaries preserved.

[Before recovery](qa/milestone-8/content-recovery-before.json): FR reads 9→9 and no recovery; [after](qa/milestone-8/content-recovery-after.json): new reads and all locales recover. Final keyboard regression covers FR/EN/AR 390/1536 after controlled 503.

## Evidence

[Tests/failures/skips](milestone-8-test-report.md), [load](milestone-8-load-testing.md), [readiness](milestone-8-production-readiness.md), [critical path before](qa/milestone-8/critical-path-before.json) / [after](qa/milestone-8/critical-path-after.json), [query plans](qa/milestone-8/database-profile.json).

[FR desktop homepage](qa/milestone-8/visual/after/fr-1536.png), [AR mobile homepage](qa/milestone-8/visual/after/ar-390.png), [FR mobile catalogue](qa/milestone-8/screenshots/catalogue-fr-390.png), [AR desktop catalogue](qa/milestone-8/screenshots/catalogue-ar-1536.png), [3D mobile](qa/milestone-8/viewer-final-390.png), [homepage comparison](qa/milestone-8/visual/comparison.json).

No VPS, deployment, M9 or cinematic entrance.
