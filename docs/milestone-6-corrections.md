# Milestone 6 corrective pass

13 October 2026. Scope: the confirmed Milestone 6 defects and verification only. No deployment or Milestone 7 work. The [original final audit](qa/milestone-6-final/corrections/before-report.md), its failures, traces and measurements remain available. New evidence is isolated under [corrections](qa/milestone-6-final/corrections/).

## Final executed results

**Full browser regression: 118 passed, zero failed, zero flaky, 20 intentional skips; 138 total, one worker, no retries; 27.71 minutes.** The 18 additional cases cover painted banner stacking and localized throttle feedback. All nine originally failed journeys pass in this complete run. Skips are enumerated below and are not counted as passes.

| Project | Passed | Failed | Intentional skips |
| --- | ---: | ---: | ---: |
| desktop | 45 | 0 | 1 |
| tablet | 36 | 0 | 10 |
| mobile | 37 | 0 | 9 |

Laravel: **67 tests / 375 assertions**, zero failures/errors/skips, 42.554 seconds against `time_stone_test`. Production build and separate TypeScript validation pass. Standalone prototype/integrated 3D: **8/8**, no failures/skips, 939.5774 ms. The final build compiled in 4.7 seconds, completed TypeScript in 3.0 seconds and generated 16 pages in 499 ms.

Evidence: [backend JUnit](qa/milestone-6-final/corrections/backend-final-junit.xml), [build](qa/milestone-6-final/corrections/build-final.log), [TypeScript](qa/milestone-6-final/corrections/typecheck-final.log), [standalone 3D](qa/milestone-6-final/corrections/standalone-3d-final.log), [complete Playwright JSON](qa/milestone-6-final/corrections/playwright-full.json), [case/skip list](qa/milestone-6-final/corrections/browser-summary.json), [production client boundary](qa/milestone-6-final/corrections/client-boundary.json).

### Final request-path measurements

| Runtime / phase | Requests | Max total ms | Max Laravel ms | Max DB ms | Failures |
| --- | ---: | ---: | ---: | ---: | ---: |
| CLI 8000 / concurrent / concurrency 6 | 6 | 631.95 | 108.69 | 28.29 | 0 |
| CLI 8000 / concurrent / concurrency 12 | 12 | 1328.02 | 126.59 | 30.14 | 0 |
| CLI 8000 / concurrent / concurrency 48 | 48 | 5242.68 | 146.13 | 30.76 | 0 |
| CLI 8000 / first / concurrency 1 | 6 | 252.45 | 205.45 | 34.10 | 0 |
| CLI 8000 / warm / concurrency 1 | 6 | 117.83 | 113.42 | 22.11 | 0 |
| Cached Apache 8011 / concurrent / concurrency 6 | 6 | 248.67 | 236.27 | 29.31 | 0 |
| Cached Apache 8011 / concurrent / concurrency 12 | 12 | 445.75 | 431.18 | 29.95 | 0 |
| Cached Apache 8011 / concurrent / concurrency 48 | 48 | 1768.63 | 1719.86 | 143.92 | 0 |
| Cached Apache 8011 / first / concurrency 1 | 6 | 680.97 | 640.03 | 28.10 | 0 |
| Cached Apache 8011 / warm / concurrency 1 | 6 | 103.01 | 98.85 | 25.63 | 0 |

All 156 bounded direct API/media requests completed successfully after isolating configuration. The full-path SSR/media probe reproduces eight eight-second timeouts out of 30 requests on the old 3001/CLI-8000 preview, versus zero out of 30 on the corrected 3011/cached-Apache-8011 preview (maximum 4,249.66 ms). This comparison includes both application and runtime corrections; it is not a pure server-only A/B test. Eight-second deadlines were unchanged. 'First' in this transport probe means first read in that probe, not a cold process. These burst results are lab observations, not capacity guarantees. [Raw requests and Server-Timing](qa/milestone-6-final/corrections/transport-after-runtime.json), [pre-cache comparison](qa/milestone-6-final/corrections/transport-before-config-cache.json), [full Next SSR/media path](qa/milestone-6-final/corrections/ssr-media-path.json).

### Final Lighthouse results

| Page / phase / run | Perf | LCP s | TBT ms | CLS | KiB | A11y / BP / SEO |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| [/ar / mobile / cold / 1](qa\milestone-6-final\corrections\performance-home-ar-cold\lighthouse-ar-mobile-check-1.html) | 78 | 5.698 | 100.0 | 0.00000 | 1655.5 | 100 / 100 / 69 |
| [/ar / desktop / process-warm-content-cache-uncontrolled / 1](qa\milestone-6-final\corrections\performance-home-ar-desktop-warm\lighthouse-ar-desktop-check-1.html) | 90 | 1.883 | 0.0 | 0.00141 | 2862.0 | 100 / 100 / 69 |
| [/ar / mobile / warm / 1](qa\milestone-6-final\corrections\performance-home-ar-warm\lighthouse-ar-mobile-check-1.html) | 76 | 5.572 | 119.0 | 0.00000 | 1655.5 | 100 / 100 / 69 |
| [/ar / mobile / warm / 2](qa\milestone-6-final\corrections\performance-home-ar-warm\lighthouse-ar-mobile-check-2.html) | 81 | 4.955 | 106.0 | 0.00356 | 1655.5 | 100 / 100 / 69 |
| [/en / mobile / process-warm-content-cache-uncontrolled / 1](qa\milestone-6-final\corrections\performance-home-en-warm\lighthouse-en-mobile-check-1.html) | 83 | 4.665 | 99.0 | 0.00202 | 1533.6 | 100 / 100 / 69 |
| [/fr / mobile / cold / 1](qa\milestone-6-final\corrections\performance-home-fr-cold\lighthouse-fr-mobile-check-1.html) | 79 | 5.249 | 106.5 | 0.00000 | 1534.1 | 100 / 100 / 69 |
| [/fr / desktop / process-warm-content-cache-uncontrolled / 1](qa\milestone-6-final\corrections\performance-home-fr-desktop-warm\lighthouse-fr-desktop-check-1.html) | 91 | 1.893 | 0.0 | 0.00030 | 2740.6 | 100 / 100 / 69 |
| [/fr / mobile / warm / 1](qa\milestone-6-final\corrections\performance-home-fr-warm\lighthouse-fr-mobile-check-1.html) | 79 | 5.030 | 128.0 | 0.00064 | 1534.1 | 100 / 100 / 69 |
| [/fr / mobile / warm / 2](qa\milestone-6-final\corrections\performance-home-fr-warm\lighthouse-fr-mobile-check-2.html) | 84 | 4.359 | 115.0 | 0.00064 | 1534.1 | 100 / 100 / 69 |
| [/fr/products/sample-1 / mobile / process-warm-content-cache-uncontrolled / 1](qa\milestone-6-final\corrections\performance-product-fr-warm\lighthouse-fr-mobile-check-1.html) | 87 | 4.064 | 43.0 | 0.00000 | 1213.2 | 100 / 100 / 69 |
| [/fr/products / mobile / process-warm-content-cache-uncontrolled / 1](qa\milestone-6-final\corrections\performance-products-fr-warm\lighthouse-fr-mobile-check-1.html) | 76 | 6.390 | 134.0 | 0.00000 | 1489.6 | 100 / 100 / 69 |

**FR mobile, warm processes / reset browser storage:** 4.359–5.030 s; median 4.695 s versus original-audit median 4.889 s (4.0% change). The ≤2.5 s target is not met in either run. Small local samples are not field p75.
**AR mobile, warm processes / reset browser storage:** 4.955–5.572 s; median 5.263 s versus original-audit median 5.267 s (0.1% change). The ≤2.5 s target is not met in either run. Small local samples are not field p75.

Mobile LCP remains an acceptance limitation. Premium image quality was preserved; this report does not claim the performance target is resolved.

Full [combined measurements](qa/milestone-6-final/corrections/performance-combined.json) and [resolved settings, observed trace components, image requests and font transfers](qa/milestone-6-final/corrections/performance-diagnostics.json) accompany every HTML/JSON report. Intentional development noindex remains in place; SEO scores do not represent a deployment readiness decision.

### Initial page versus activated 3D

Initial product-page Lighthouse is listed above; no viewer activation occurs during that audit. Fresh full-regression viewer measurements:

| Device | Activation ms | Initial heap MiB | Activated heap MiB | Post-disposal heap MiB | Activation-only JS KiB | DPR | Textures / geometries |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| desktop | 3496 | 3.56 | 10.53 | 13.24 | 255.8 | 1 | 18 / 17 |
| mobile | 2578 | 3.59 | 10.61 | 13.18 | 255.8 | 1.5 | 18 / 17 |

[Desktop counters](qa/milestone-6-final/corrections/viewer-metrics-desktop.json) / [mobile counters](qa/milestone-6-final/corrections/viewer-metrics-mobile.json). Headless Chromium/SwiftShader and emulated viewports are used. GPU counters remain bounded across replacements; hidden rendering pauses and single-canvas/disposal assertions pass. Post-disposal heap includes retained modules, export allocations and memory awaiting collection; it is not a GPU-memory measurement or a leak claim. Physical-device memory, thermal behavior and sustained hardware frame rate remain unmeasured.

### Real workflows and integrity

The final [Filament/public/3D workflow](qa/milestone-6-final/corrections/end-to-end.json) passed with no browser errors and zero axe violations. Publication and translation, media replacement with preserved ID, changed embedded GLB image hashes, edited UV scale ratio **1.4**, rotation 45°, roughness 0.33, metalness 0.1 and public revocation were exercised against real servers. Binary exports are retained as `integration-config-before.glb`, `integration-media-after.glb` and `integration-config-after.glb`.

The real quotation was visible and editable in Filament. The [database snapshot](qa/milestone-6-final/corrections/persistence-evidence.json) retains quantity 7 piece, original saved scale 1.25 and the later product scale 1.75; immutable snapshot check passed. [Recovery](qa/milestone-6-final/corrections/network-recovery.json) verified one POST on double-submit, real persistence before a 14-second delivery delay, no false success, frozen input after a throttled uncertain retry, unchanged idempotency key and recovery of the same reference without browser storage.

The [real HTTP quotation probe](qa/milestone-6-final/corrections/http-quotations.json) returned **201 / 200 / 409 / 422 / 201 / 429**, with `Retry-After: 59`, two persisted QA rows and duplicate=true on exact retry. It crossed the Next proxy using a reserved test identity; forwarded-header trust was enabled only on the isolated loopback lab preview.

Scoped [cleanup and full integrity evidence](qa/milestone-6-final/corrections/cleanup.json) confirms every baseline business-row hash, 250 original/previous derivative file hashes, both environment-file hashes and the permanent active owner account. Only the three additive derivative keys are excluded from original media-row comparison. Final counts return to **18 products, 50 media, one original quotation and one original owner account**. All identified QA products, media, quotations and accounts were removed; private QA credential files were deleted. Original quotation snapshots and original files remain unchanged.

### Intentional skips

| Project | Skipped case | Reason / coverage |
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
| tablet | public page viewport matrix and screenshots | Project-gated once-only viewport/SSR matrix; executed in desktop. |
| tablet | SSR routes, paginated application products, no-script safety and validation bounds | Project-gated once-only viewport/SSR matrix; executed in desktop. |
| mobile | public page viewport matrix and screenshots | Project-gated once-only viewport/SSR matrix; executed in desktop. |
| mobile | SSR routes, paginated application products, no-script safety and validation bounds | Project-gated once-only viewport/SSR matrix; executed in desktop. |
| tablet | 3D controls, formats, finishes, demand rendering, exports and resource budgets | Desktop and mobile cover the same engine. |
| tablet | 3D responsive and RTL activation matrix | Complete matrix once. |
| tablet | WebGL initialization failure returns an accessible static preview | Failure mode once. |
| mobile | 3D responsive and RTL activation matrix | Complete matrix once. |
| mobile | WebGL initialization failure returns an accessible static preview | Failure mode once. |

### Screenshots

The [screenshot index](qa/milestone-6-final/corrections/screenshots-index.json) identifies fresh full-regression captures. Corrected banners:

| Example | Desktop 1536 px | Mobile 390 px |
| --- | --- | --- |
| French catalogue | [Desktop](qa/milestone-6-final/corrections/screenshots/banner-products-fr-1536.png) | [Mobile](qa/milestone-6-final/corrections/screenshots/banner-products-fr-390.png) |
| English applications | [Desktop](qa/milestone-6-final/corrections/screenshots/banner-applications-en-1536.png) | [Mobile](qa/milestone-6-final/corrections/screenshots/banner-applications-en-390.png) |
| Arabic about / RTL | [Desktop](qa/milestone-6-final/corrections/screenshots/banner-about-ar-1536.png) | [Mobile](qa/milestone-6-final/corrections/screenshots/banner-about-ar-390.png) |

A supplementary [CTA paint probe](qa/milestone-6-final/corrections/cta-paint.json) also checks the actual catalogue, About and application-detail bands at those six widths in all three languages (54 additional paint checks).

All six requested widths were tested in all three languages. The homepage additionally includes 1280 px. Viewport matrices verify overflow, decoding, typography/stone space, initial no-WebGL, RTL, URLs, filters, pagination, focus and reduced-motion behavior. Axe checks in the passing journeys found no violations; automated coverage is not a complete manual accessibility certification.


## Remaining mobile performance diagnosis

In warm run 2, the observed root server-response times are **188 ms FR / 224 ms AR**, compared with approximately 2,373 / 2,314 ms in the old first mobile traces. Observed hero breakdowns are FR TTFB 190.664 ms + discovery 36.321 ms + load 199.389 ms + render 12.267 ms; AR 226.383 + 11.105 + 173.969 + 49.019 ms. These local observed components are **not** the simulated 4.359 / 4.955-second LCP values and must not be combined with them.

The preserved hero request is 322,843 transferred bytes, High priority, eager and discovered in initial HTML. Its three swatch requests are now Low priority and total 39,328 bytes, rather than approximately 104 KB of High-priority thumbnails. Warm mobile transfer is approximately **1,534 KiB FR / 1,655 KiB AR**, down from about 2,248 / 2,369 KiB (roughly 32% / 30%). Font transfer remains 73,590 bytes FR / 197,654 bytes AR; the existing fonts are retained. These verified reductions do not establish a consistent mobile LCP improvement: the AR warm median is essentially unchanged, and FR still varies substantially.

The one-off mobile catalogue result is **6.390 s**, versus the older 4.213-second one-off result. Its root response is observed at 492 ms and its banner is High priority, approximately 342 KB. The first two card requests are also High priority, approximately 145 / 143 KB. These are observed remaining critical-resource costs, not proof that one resource alone causes the simulated LCP. The content-cache state was not controlled for these representative route runs, so the worse result is reported as an unresolved performance concern rather than a matched causal comparison. Product-page mobile LCP is 4.064 s; desktop homepages are 1.893 / 1.883 s. No poor run was removed or replaced by a favorable retry.

The shared CTA section exists in all languages but has no assigned image, as recorded in [project-band-content.json](qa/milestone-6-final/corrections/project-band-content.json). Supplementary project-band checks verify its real fallback background, not a nonexistent uploaded image. Catalogue CTA checks still decode the assigned image. The supplementary probe's earlier wrong-route and unconditional-image assumptions are test-harness corrections, separate from the passing complete regression suite.

## Causes and corrections

### Banner stacking

The responsive `MediaImage` component introduces a `<picture>` parent. The previous `.catalogue-hero > img` and `.page-hero > img` rules no longer positioned the background or gave it a negative stacking level. DOM visibility alone could pass while an image covered the text.

The background selectors now position either the direct image, its picture wrapper or the unavailable-image placeholder at `z-index: -2` inside the existing isolated hero. Existing gradients remain above it at `-1`; content remains above both. The same correction covers catalogue CTAs and the project bands on About and application-detail pages. Product-gallery containment now also reaches images inside pictures. Typography, image cropping, gradients, RTL transforms and the approved page composition were retained.

The new browser test samples the actual top painted element at heading, description and control centres using `elementFromPoint`, checks the background/gradient stacking levels, decodes the image and checks overflow and direction. It covers six routes, three languages and six widths: **108 route/language/width checks**, rather than a visibility assertion alone. Screenshots cover 390 and 1536 px.

### Request reliability and configuration

The original nine failure traces were inspected. Eight contained the unavailable-content screen; the remaining banner workflow exhausted its overall test budget. They do not establish the exact exception behind each historical 503 because the old adapter discarded transport causes. Passing another viewport was not used to erase those failures.

The unchanged PHP CLI development server serializes requests. In a measured 48-request burst before configuration caching, total response time reached 5,304.64 ms while maximum application execution was 132.27 ms and maximum accumulated database time was 30.87 ms. This is direct evidence of substantial waiting outside application execution. The concurrent Apache comparison peaked at 1,957.27 ms. These measurements support serialization as a contributor, not proof of the cause of every historical failure.

The audit uses a separate Apache 2.4.59/mod_php PHP 8.3.6 runtime with 64 worker threads on loopback port 8011 and the production Next build on port 3011. The user's existing ports 80, 8000, 3000 and 3001 were preserved. API and media deadlines remain **8,000 ms**.

A second failure occurred in the first uncached concurrent runtime: API requests returned HTTP 500 in approximately 474–660 ms, with Laravel `MissingAppKeyException`. The environment files were unchanged. Laravel's installed environment loader uses the putenv adapter and skips environment loading when configuration is cached; a request-thread environment-loading race is the supported explanation, rather than an eight-second timeout. The precise native interleaving was not instrumented. An **audit-only configuration cache** outside the document root removes concurrent `.env` loading. It uses the existing key and settings; no key rotation, environment edit, global config cache or business-data reset was performed. Sanitized exception evidence is in [runtime-configuration-errors.json](qa/milestone-6-final/corrections/runtime-configuration-errors.json).

The isolated Windows OPcache uses its own cache ID with JIT disabled. Earlier `VirtualProtect` warnings ceased after this isolation; this is a lab configuration observation, not a claim that a PHP library was upgraded. PHP documents Windows shared-cache IDs in its [OPcache configuration reference](https://www.php.net/manual/en/opcache.configuration.php). The setup is equivalent concurrent PHP for local verification, not a deployed PHP-FPM environment.

Public API cache keys now include scheme and host because cached DTOs contain absolute media URLs. This prevents responses serialized for port 8000 from being reused for port 8011. Tests exercise both origins and preserve publication checks and cache invalidation.

Opt-in local/testing diagnostics aggregate Laravel execution time, query count and database time in `Server-Timing`, with an opaque request ID on completed responses. Production disables these headers. Next server logs classify HTTP, timeout, transport and malformed-JSON failures and record duration and sanitized route templates. Media transport failures use the same safe logging. Queries, bindings, customer input, raw exception messages, secret headers and internal origins are excluded. Exceptions outside the timing middleware still require the private Laravel exception log; headers do not claim to instrument every error response.

### Browser expectations and newly exposed defects

| Original failed journey | Classification and action |
| --- | --- |
| Editable banners | Overall workflow budget exhausted on the serialized runtime; use the configured QA API/base origins and verify the full workflow on concurrent PHP. |
| FR catalogue | Unavailable-content screen; additionally replace fixture result counts with independently fetched live API expectations. |
| EN catalogue | Same unavailable-content classification and real-data assertions. |
| AR catalogue | Same classification; retain RTL, drawer, focus and filter assertions. |
| EN material dialog | Unavailable-content screen prevented the dialog from existing; retain selection, Escape and focus restoration assertions. |
| Language switching | Unavailable-content screen prevented the destination section from existing; retain locale, query, hash and viewport assertions. |
| Homepage width matrix | Unavailable-content screen caused waiting for missing hero elements; retain all width/typography/stone-space checks. |
| FR product journey | Unavailable-content screen; additionally derive normalized return pagination from the actual filtered dataset. |
| EN product journey | Same classification and live return-pagination checks. |

Catalogue assertions compare displayed product names, counts, filters, sorting and destinations with actual published API records. Dataset prerequisites remain explicit: more than one results page and nonempty relevant filters. These tests no longer require fictional fixed counts. Existing unit tests still independently cover filtering/query contracts.

The first correction run exposed two additional issues. A banner test treated a cancelled speculative desktop-image request as a completed mobile download; it now records completed requests while still requiring the mobile `currentSrc`, successful image decoding and no completed full-size banner transfer. A real quotation accessibility race focused the confirmation in `requestAnimationFrame` before React necessarily committed it. Focus now runs in an effect after the saved confirmation mounts. The existing exact focus assertion remains in place.

The exploratory runs were stopped after identifying actionable failures and are not presented as complete passing suites. Their logs and failure traces remain under `first-run-failures/`, `runtime-failures/`, `playwright-first-run.log` and `playwright-runtime-run.log`. A supplementary CTA probe initially queried the Applications index for the project-band selector, but that route uses a different benefits band. Its selectors were corrected to the existing About and application-detail routes, and image decoding is conditional on actual CMS image assignment (the shared CTA has no assigned image, so its fallback painting is verified); no application or CMS content was changed for this harness correction. This is separate from the completed 138-case regression. The initial Arabic throttle test assumed Arabic-Indic digits; it was corrected to match this browser's actual `Intl.NumberFormat('ar')` output while retaining the complete Arabic retry-message assertion. The initial backend test fixture omitted required `uploaded_at`; the fixture was corrected, without changing schema validation. All these initial results are retained separately from final execution.

### Mobile images and LCP

Homepage rendering now fetches category definitions only, rather than unused material, finish and colour definitions. Distinct homepage API reads decrease from nine to six, preserving server-rendered content and request-local deduplication.

CMS images now have 192-pixel swatch, 640-pixel card and 960-pixel intermediate WebP derivatives in addition to existing 320/1200/2048/2560 variants. Responsive card sources select an appropriate width; a 48-pixel swatch has enough source pixels for 4× density and low request priority. Homepage category `sizes` account for the final wide mobile card and the single-column 320-pixel layout. The hero's responsive preload remains high priority, with explicit eager loading and media conditions for its existing desktop/mobile sources.

All new derivatives use **quality 90 from the private original**, preserve aspect ratio and never upscale. Existing originals and existing derivative files were not recompressed, resized or replaced. Original media IDs and references remain intact. A controlled local backfill adds the new derivatives to the existing 50 media records; ingestion creates them for subsequent uploads. Legacy libraries without the new variants fall back to the existing preview and still enforce publication/access checks. No architectural images were removed or replaced, and font files/subsets were retained after investigation.

The high-quality mobile hero is intentionally preserved. WebP format does not by itself establish acceptable LCP. Lighthouse simulated metrics and observed trace components are reported separately; local measurements do not establish production or field Core Web Vitals.

### Quotation throttling and accessibility

The custom Laravel API exception renderer previously discarded throttle exception headers. It now preserves positive `Retry-After`; the Next quotation proxy forwards only bounded positive integer durations on 429. French, English and Arabic messages use the actual duration, with correct French/English singular text. Missing/invalid headers retain the existing fallback message.

An uncertain submission remains frozen when a retry is throttled: the original input and idempotency key survive, and the subsequent exact retry can recover the already persisted reference. Validation, authoritative configuration snapshots, duplicate protection and private no-store responses remain intact. The success-focus correction described above preserves the accessibility expectation rather than relaxing it.

## Exact application and test files changed

```text
apps/api/app/Domain/MediaLibrary.php
apps/api/app/Http/Controllers/MediaController.php
apps/api/app/Http/Controllers/PublicCatalogueController.php
apps/api/app/Http/Middleware/IntegrationTiming.php              (new)
apps/api/bootstrap/app.php
apps/api/config/integration.php
apps/api/tests/Feature/BannerTest.php
apps/api/tests/Feature/IntegrationTest.php
apps/web/src/app/[locale]/page.tsx
apps/web/src/app/api/quotations/route.ts
apps/web/src/app/media/[id]/[variant]/route.ts
apps/web/src/app/catalogue.css
apps/web/src/app/public.css
apps/web/src/app/product.css
apps/web/src/components/home-page.tsx
apps/web/src/components/material-preview.tsx
apps/web/src/components/media-image.tsx
apps/web/src/components/quotation-form.tsx
apps/web/src/lib/api.ts
apps/web/src/lib/catalogue-data.ts
apps/web/src/lib/quotation.ts
tests/admin-languages.spec.ts
tests/banners.spec.ts
tests/catalogue.spec.ts
tests/product.spec.ts
tests/banner-stacking.spec.ts                                (new)
tests/quotation-throttle.spec.ts                             (new)
apps/web/tsconfig.json                                       (Next-generated output type includes)
docs/milestone-6-report.md
docs/milestone-6-corrections.md                               (new)
docs/qa/milestone-6-final/corrections/                        (new evidence)
```

Ignored audit utilities, the private baseline and isolated Apache/PHP/cache files are under `.tools/corrections/`. They are local verification support, not deployment configuration. No dependencies, migrations or original prototype-engine files were changed. The workspace has no Git metadata, so a Git diff/commit is not claimed.

## Laboratory method and limits

Windows 10.0.26200; Intel i7-1165G7, 8 logical CPUs, 15.73 GiB RAM; Node 24.19.0, Next 16.4.0, PHP 8.3.6, MySQL 8.3.0, Lighthouse 13.5.0 and bundled Playwright Chromium. Browser/device viewports are emulated. Existing development services remained running; no regression/build/load jobs ran concurrently with final Lighthouse measurements.

Each final Lighthouse run resets browser storage/cache. A browser process is reused within each two-run warm series; this is not a new OS/browser process for every warm sample. For each FR/AR **cold** homepage run, only the six lab-origin homepage API cache entries are forgotten and the audit PHP/Next processes are restarted. The private Laravel configuration cache is retained, as in a configured deployment. No database buffer-pool flush or global cache flush occurs. **Warm** FR/AR mobile homepage runs retain application processes/content caches but still reset browser storage. Other one-off representative runs retain processes without explicitly priming route-content caches; their cache state is labelled uncontrolled. Database/OS buffers therefore remain warm in both phases; these are not claims of a physically cold machine.

Mobile uses Lighthouse's default simulated throttling and mobile viewport/DPR; exact resolved settings are retained in each JSON. Desktop uses 1536×1024, DPR 1, 40 ms RTT, 10,240 Kbps and CPU multiplier 1. Mobile LCP is the simulated audit value, not the lower observed local trace time. The evidence includes every final run and identifies startup cold separately from warmed processes.

Physical-device GPU memory, thermal behavior, field p75, production capacity/TLS/proxy behavior, full manual assistive-technology review, email delivery and a penetration test were not measured. No arbitrary timeout increase, automatic retry masking, new animation or design replacement was used. Remaining acceptance issues are stated in the results above and the updated [Milestone 6 report](milestone-6-report.md).

## Executed command reference

`node` below is the bundled Node 24.19.0 binary and `php` is WAMP PHP 8.3.6; full command outputs and paths are retained in the linked logs. This is an execution record, not a deployment recipe. The private disposable credentials used by browser tests have been removed after cleanup.

```powershell
# apps/api; phpunit.xml and Tests/TestCase.php enforce time_stone_test
php -d post_max_size=128M -d xdebug.mode=off vendor/phpunit/phpunit/phpunit --log-junit ../../docs/qa/milestone-6-final/corrections/backend-final-junit.xml
# apps/web; isolated output and matching lab origins were supplied
$env:NEXT_DIST_DIR='.next-corrections-m6'
node ../../node_modules/next/dist/bin/next build
node ../../node_modules/typescript/bin/tsc --noEmit
# repository root
node --test prototype/tests/stone.test.js tests/stone-engine.test.mjs
$env:QA_BASE_URL='http://127.0.0.1:3011'
$env:QA_API_URL='http://127.0.0.1:8011'
$env:QA_ADMIN_LOCALE_CREDENTIALS='<private disposable QA credentials>'
node node_modules/@playwright/test/cli.js test --workers=1
# Each measurement used its own documented QA_OUTPUT_DIR
node scripts/performance.mjs fr mobile 1
node scripts/performance.mjs fr mobile 2
node scripts/performance.mjs ar mobile 1
node scripts/performance.mjs ar mobile 2
node scripts/performance.mjs en mobile 1
node scripts/performance.mjs fr desktop 1
node scripts/performance.mjs ar desktop 1
# QA_ROUTE=product and products were separate one-off mobile runs
```

Real integration, recovery, HTTP and paint helpers ran against the same loopback origins. The retained [cleanup](qa/milestone-6-final/corrections/cleanup.json) identifies exactly which QA rows/files/accounts were removed; no broad refresh or global deletion was used. The corrected local preview remains available at [127.0.0.1:3011/fr](http://127.0.0.1:3011/fr), while the original development services remain intact. Its private audit configuration cache must be regenerated if its environment settings change; it is not production configuration.
