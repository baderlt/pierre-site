# Milestone 8 — performance audit

Local scope, 14–15 October 2026. M7 is accepted. No VPS connection or deployment is authorized. The attached M8 brief and subsequent explicit local-database/fixture confirmations authorize this work. M7 reports and release artifacts are retained unchanged.

## Baseline and inspected paths

The baseline is a fresh production build, not the old M 6/M7 timings. Next 16.4.0 / Node 24.19.0 on loopback 3031 uses concurrent Apache/PHP 8.3.6 on 8017 and MySQL 8.3.0. Apache uses a private **relative** Laravel configuration-cache path, preserving the M7 Windows-cache correction. There are no API deadline increases, publication bypasses or changes to original environment files.

Inspected the M 6 performance/correction reports; M7 final/security/test reports, deployment runbook and staging checklist; Next locale layout/fonts, SSR home/catalogue/detail adapters, request cache, media proxy, responsive/deferred image component, homepage form/location, quotation boundary, product studio and integrated engine; Laravel API controllers, resources, publication scopes/observers, quotation transactions/limits, media authorization/processing, migrations and relevant tests. Existing eager loads, indexes, request-level deduplication and independent SSR fetch concurrency are already present.

[Individual metrics and medians](qa/milestone-8/performance-comparison.json), [warm baseline](qa/milestone-8/performance/before/summary.json), [cold-content baseline](qa/milestone-8/performance/before-cold/summary.json). Each of eight cases has three samples per state. Raw Lighthouse JSON/HTML, compressed Chrome traces and network logs accompany each sample.

| Mobile route | Warm baseline median LCP |
| --- | ---: |
| FR homepage | 4.216 s |
| EN homepage | 4.217 s |
| AR homepage | 4.967 s |
| FR catalogue | 3.764 s |
| EN catalogue | 3.987 s |
| AR catalogue | 4.516 s |
| FR representative detail | 4.137 s |

Desktop FR homepage median is 1.810 s. These are simulated laboratory measurements, not deployed field Core Web Vitals or physical-phone results.

## Confirmed findings

1. **Catalogue loads unnecessary offscreen images.** The French mobile trace transfers about 1.54 MB in total. Image requests include six product cards, the lower CTA preview (about 323 KB) and three process photographs. Those transfers are present in the initial audit despite their lower page positions. Reuse the existing approach-based image component rather than changing quality, sources, layout or image-processing settings.
2. **Hero discovery is already correct.** The LCP is `section#home > div.hero-art > picture > img`; catalogue LCP is the banner image. Both are server-discoverable, eager and fetch-prioritized. French home run 2 records observed TTFB 202.5 ms, discovery 82.9 ms, transfer 162.9 ms, render 13.2 ms. Arabic home run 2 records 210.4/20.2/179.7/29.3 ms. These observed unthrottled components must not be added to the simulated four-to-five-second LCP.
3. **Image and font transfer remains material.** The high-quality mobile home hero response is about 294 KB. FR loads about 74 KB of fonts; AR about 199 KB, using the existing approved Arabic serif and 400/600 sans faces. Arabic fonts are already local WOFF 2 script subsets; no Latin font downloads occur in the sampled Arabic page. There is no evidence of a large observed hero render delay requiring a font replacement or hydration rewrite.
4. **Warm database work is bounded.** [Kernel/EXPLAIN profile](qa/milestone-8/database-profile.json): warm responses execute nine queries, approximately 2–4 ms PDO wall time in the in-process profile. FR cold queries: site 14, home 18, listing 25, detail 32, materials 18. Relationship loading remains bounded across locales; no N+1 pattern was identified. The first CLI kernel bootstrap is slow and is explicitly distinct from concurrent HTTP/OPcache results. Small-table scans alone do not justify an index migration.
5. **Required freshness/security costs remain.** SSR uses request-level React deduplication and no persistent Next content cache. Laravel payloads use versioned cache keys/locks; committed observers invalidate content. Media publication is rechecked per delivery; the Next proxy remains bounded and private/no-store. Quotation challenges, five/minute throttling, transactional snapshots and idempotency are preserved.
6. **3D is already activation-only.** Static previews precede Three.js; exporter imports are separate. Demand rendering, hidden pause, DPR 1.5 cap, texture 2048 cap and explicit resource disposal already exist. Additional profiling is recorded separately in the final reports; no original prototype modification is authorized.

## Measurement interpretation

Browser cache is reset for every Lighthouse audit. Warm payloads are primed immediately before each sample; cold means only that route's payload keys are evicted. OPcache, Next process, filesystem cache and MySQL buffers remain warm. Separate browser navigation probes distinguish cold-browser, retained-browser-cache and cleared-browser-cache behavior. API headers expose aggregate cache/query timing only to the existing authenticated local diagnostic probe; SQL bindings, secrets and customer payloads are excluded from public evidence.

Lighthouse 13.5.0 uses its resolved simulated mobile preset: 412×823, DPR 1.75, RTT 150 ms, 1638.4 Kbit/s, CPU 4×; desktop 1536×1024, DPR 1, RTT 40 ms, 10240 Kbit/s, CPU 1×. Exact versions/settings, benchmark indices, warnings and observed breakdowns are retained per sample. Only one benchmark batch runs at once; no competing build, PHPUnit or browser-regression process runs during it. Existing user applications/previews are preserved, so this shared Windows laptop is not a dedicated performance rig. Baseline and final host calibration differences must be considered before attributing changes.

The rejected database-creation attempt demonstrated the existing app user's limited grants. Explicit authorization was then obtained for isolated QA writes; a new local test-only database/service account/media copy excludes original users/quotations. No existing account or grant was changed. [Isolation evidence](qa/milestone-8/isolation.json).

## Additional confirmed findings and final status

Repeated viewer profiling found 18 renderer textures from duplicate face sources. Sharing the two source images reduced this to 8, preserving pixel output, UVs, materials and export data. Seventeen geometries and eight draw calls are unchanged. Original prototype source remains identical; physical GPU memory and thermal behavior are unverified.

An actual MySQL 1213 deadlock in native database-cache `add` caused an API 500 during rate-limiter initialization. A bounded retry of this atomic operation, only outside enclosing transactions, passed six unit tests and 192 expiry-contention reads. Quotation transactions, limits and deadlines were not changed. A separate controlled outage proved error-boundary reset did not refetch restored content; the native Next retry now recovers across three locales and both viewport sizes.

Final mobile LCP still exceeds 2.5 seconds in every sampled route. Catalogue transfer drops 55–60%, but the critical hero/font assets and framework delivery remain. No passing score is claimed. The [optimization report](milestone-8-optimization-report.md) contains all final warm/cold medians, TTFB, CLS, TBT and transferred bytes; individual timing breakdowns and traces are retained.

The bounded load test shows local SSR throughput flattening between concurrency four and eight while tail latency increases. This and measured PHP CPU use are local contention indicators, not proof of deployed capacity. See [load results](milestone-8-load-testing.md). Original business data, private files and environments passed integrity verification. No VPS operation or deployment occurred.
