# TIME STONE — three targeted homepage improvements

14 October 2026. **Implemented locally for review. The full-homepage redesign was not implemented. No deployment, VPS change, M7 final verification, M8/M9 work or cinematic entrance was performed.**

Local production preview: [French](http://127.0.0.1:3021/fr), [English](http://127.0.0.1:3021/en), [Arabic](http://127.0.0.1:3021/ar).

## Changes

1. **Savoir-faire only:** retained its existing CMS headline, description and four process-step labels. Added a large image using the existing craft image when configured, otherwise the current quarry image, plus a layered detail from an existing published product. Both use the existing media component and remain explicitly illustrative. New scoped styles provide depth, mobile stacking, step hover emphasis and reduced-motion behavior. No new manufacturing claims or process functionality.
2. **Homepage quotation:** replaced the nonfunctional final placeholder while keeping `#contact`. The homepage mounts the existing `QuotationForm` once, on approach to the section, and retains it when scrolling away or resizing. The component and dedicated Devis page are unchanged. Navy/limestone presentation is scoped to the homepage. Keyboard activation focuses the form; a permanent Devis link remains available without JavaScript. Initial hero rendering does not load the form implementation or request a challenge.
3. **Magasin location:** added an optional, validated Google Maps URL to existing Filament Website settings, with FR/EN/AR labels/help/errors. Reused address and contact visibility; empty/unapproved contacts, missing address or invalid/missing URL hide the public location section. Its decorative CSS perspective composition uses layered stone surfaces, shadows and a gold marker, with restrained desktop hover/keyboard focus motion and reduced-motion support. It is explicitly labelled as decorative, not a geographical map. No Three.js, provider SDK, geolocation, new dependency or third-party request before opening directions.

In the admin, supply the verified magasin address and exact Google Maps location/directions URL, and approve contact visibility. Supported links include Google Maps location/directions routes and standard `maps.app.goo.gl` / `goo.gl/maps` shares. HTTPS, host/path, credential/port/fragment and redirect-parameter checks apply in both settings validation and public rendering. No URL is resolved by the server. Directions open the configured link with `noopener noreferrer`.

**No exact magasin location was supplied or saved. The actual public location section is therefore hidden.** Location screenshots below use a separate read-only QA proxy with the visible label “QA ONLY — synthetic location, not TIME STONE’s address”; they are not business/location evidence. That fixture preview was stopped after verification.

## Preservation and before/after verification

- All ten protected homepage source regions match the preceding implementation: header, hero, qualities, collections, quarry, introduction, products, applications, quality and footer. [Source-region comparison](qa/homepage-targeted/protected-home-regions.json).
- Dedicated Devis screenshots are **pixel-identical in all six comparisons**: FR/EN/AR at 390 and 1536 px. [Results](qa/homepage-targeted/devis-preservation.json).
- Original shared quotation component, dedicated quote route, global CSS, media component, header and product studio match the baseline source archive. No separate prototype file was edited. [Source hashes](qa/homepage-targeted/protected-source.json).
- Unrelated homepage crops: **90 comparisons**, all text identical; **59 raw PNGs byte-identical**. The remaining raw crops differ, including one-pixel crop boundaries and image/raster differences. Position-normalized rechecks retain matching element dimensions throughout, with most computed styles matching; a fresh Applications comparison also found identical markup after local-origin normalization and matching image variants/styles. **Do not interpret this as 90 exact pixel matches.** Original and diagnostic crops are retained in [raw comparison](qa/homepage-targeted/preservation-comparison.json) and [normalized rechecks](qa/homepage-targeted/preservation-normalized.json). Scroll position, lazy-image timing and fractional raster origins are capture variables; no absolute pixel guarantee is claimed across every scroll state.
- The additive migration only added nullable `site_settings.maps_directions_url`. All original columns/rows across **36 business tables**, original accounts, **460 media-file hashes** and environment hashes remain unchanged. No fake address, quote or product was written to the business database. [Migration](qa/homepage-targeted/migration-integrity.json), [final rows](qa/homepage-targeted/final-data-integrity.json), [media/environment](qa/homepage-targeted/media-env-integrity.json).

## Executed checks

| Check | Actual result | Evidence |
| --- | --- | --- |
| Focused backend location, quotation integration/security and settings authorization | **17 tests / 118 assertions passed**, isolated MySQL `time_stone_test` | [JUnit](qa/homepage-targeted/backend.xml), [log](qa/homepage-targeted/backend.log) |
| Filament field FR/EN/AR rendering, invalid URL rejection and editor save | **1 test / 15 assertions passed**, isolated database | [JUnit](qa/homepage-targeted/admin-location.xml) |
| Changed URL rule recheck including Google share tracking | **1 test / 20 assertions passed**; overlaps one test above | [JUnit](qa/homepage-targeted/maps-final.xml) |
| Final frontend URL/translation/server-security units | **6 passed**, no failures/skips | [Log](qa/homepage-targeted/unit-final.log) |
| Location validation message languages | FR/EN/AR distinct translated messages passed | [Result](qa/homepage-targeted/location-validation-translations.json) |
| Final targeted Playwright | **7 passed, zero failures/skips**, 39.0 s | [JSON](qa/homepage-targeted/browser-final-corrected.json), [log](qa/homepage-targeted/browser-final-corrected.log) |
| Existing language and mobile-menu regressions | **2 passed**, zero failures/skips | [JSON](qa/homepage-targeted/navigation.json) |
| Final production build | Passed, compilation 8.2 s; build TypeScript 2.9 s | [Log](qa/homepage-targeted/build-final.log) |
| Separate final TypeScript | Passed, exit 0, no diagnostic output | [Executed result](qa/homepage-targeted/typecheck-final.json) |
| Scoped `git diff --check` | Passed; only existing CRLF normalization notices | No unrelated formatting applied |

Browser coverage: FR/EN/AR at **320, 390, 430, 768, 1024 and 1536 px**; no horizontal overflow; lazy implementation/challenge discovery; retained input across resize; supported product options; validation and error-summary focus; uncertain-response → 429 → same-key/payload retry and reference confirmation; keyboard activation, location-link focus/safety, reduced motion, and focused axe WCAG A/AA scans. Native mobile-menu regression used the existing mobile project; the full width matrix used resized desktop Chromium, not physical iOS/Android devices.

Browser submission recovery intentionally intercepted POST responses before persistence. Real persistence, authoritative product snapshots, validation, rate limiting and duplicate/conflict protection were exercised by the isolated backend integration tests. The homepage invokes the unchanged shared workflow; there is no new endpoint or independent submission state machine.

### Failures and verification limitations

An initial six-case focused browser run passed. A subsequent seven-case attempt was interrupted: three lazy-load assertions incorrectly treated the newly added focus wrapper’s field-ID string as evidence that the full form chunk had loaded. The manual-activation fixture also deleted the native observer globally, which broke the unchanged header and prevented it from isolating the new form. The corrected detector requires both the field marker and form transport marker; the corrected fixture suppresses automatic mounting only for the new region. **The final complete targeted run passed all seven.** [Interrupted log](qa/homepage-targeted/browser-final.log) and failure contexts under `qa/homepage-targeted/failed-harness/` are retained; they are not counted as passing tests.

Screenshot helpers initially needed bounded font/image waits and explicit UTF-8 reading; their raw output remains available. One local media `hero_mobile` HTTP 500 was logged during earlier verification; its cause was not established here. All final Lighthouse resource requests succeeded, and final targeted browser page-error checks passed. The existing default CLI PHP configuration also emitted an invalid `post_max_size` warning during a standalone translation check; backend tests and migration/integrity commands explicitly used `128M`. No global PHP configuration was changed.

No full M7 suite, deployment testing, physical-device GPU test, Safari/Firefox or manual screen-reader certification was run. Product viewer/engine code was untouched; this task did not resume the postponed 3D/milestone verification.

## Performance impact

Three fresh-browser-cache Lighthouse runs per page before and after, warm SSR/content dependencies immediately before each sample; same local API on 8011. Old preserved production build: 3017; final production build: 3021. No build/regression job ran concurrently with these batches. The synthetic location preview was stopped before final measurements.

Windows local runtime; Node 24.19.0 / Next 16.4.0 / Lighthouse 13.5.0. Mobile simulated throttling: 412×823, DPR 1.75, RTT 150 ms, throughput 1638.4 Kbit/s, CPU 4×. Desktop: 1536×1024, DPR 1, RTT 40 ms, throughput 10240 Kbit/s, CPU 1×. CPU calibration varies and is retained per run. This is laboratory evidence, not deployed p75 Core Web Vitals.

| Page | Before LCP samples s / median | After LCP samples s / median | Initial transfer before → after |
| --- | --- | --- | --- |
| French mobile | 3.913 / 4.139 / 4.140 → **4.139** | 4.139 / 4.218 / 4.212 → **4.212** | 583,407 → 595,042 bytes |
| Arabic mobile | 4.815 / 4.809 / 4.885 → **4.815** | 4.969 / 5.123 / 4.817 → **4.969** | 708,077 → 719,807 bytes |
| French desktop | 2.400 / 1.719 / 2.697 → **2.400** | 1.803 / 1.823 / 1.751 → **1.803** | 2,040,989 → 2,052,608 bytes |

Final median TBT: FR mobile 92 ms, AR mobile 115 ms, desktop 0 ms. Final median CLS: 0.00064 / 0.00356 / 0.00030 respectively. All 18 audits had no warnings or failed resource requests. [Comparison](qa/homepage-targeted/performance/comparison.json), [before raw results](qa/homepage-targeted/performance/before/summary.json), [after raw results](qa/homepage-targeted/performance/after/summary.json); individual HTML/JSON reports and compressed Chrome traces/network logs are alongside them.

Added initial transfer is approximately **11.6–11.7 KB** for homepage styles, the lazy wrapper and server-provided form labels/options. The complete form implementation and its challenge/search reads wait until approach/activation. New craft imagery is deferred and uses the existing high-quality media pipeline. Location uses CSS/SVG and is absent without configuration. Existing image assets, fonts, hero priority/composition and private-media checks were not changed.

French/Arabic median mobile LCP increased by approximately 73/154 ms in these samples. Desktop measured lower but had different calibration; neither speedup nor regression is established causally by three local runs. **Mobile LCP remains above 2.5 s.** No claim of a performance fix or production readiness is made, and no security/image-quality compromise was applied.

## Screenshots

Targeted crops hide floating header/skip-link overlays during capture; actual navigation is unchanged and separately compared/tested. Form screenshots contain explicitly synthetic unsent text to verify state retention.

| Area | Desktop | Mobile / RTL |
| --- | --- | --- |
| Savoir-faire | [French 1536](qa/homepage-targeted/after/fr-1536-craft.png) | [French 390](qa/homepage-targeted/after/fr-390-craft.png), [Arabic 390](qa/homepage-targeted/after/ar-390-craft.png) |
| Shared quotation | [French 1536](qa/homepage-targeted/after/fr-1536-contact.png) | [French 390](qa/homepage-targeted/after/fr-390-contact.png), [English 390](qa/homepage-targeted/after/en-390-contact.png), [Arabic 390](qa/homepage-targeted/after/ar-390-contact.png) |
| Location — **QA fixture only** | [French 1536](qa/homepage-targeted/after/location-QA-ONLY-fr-1536.png) | [French 390](qa/homepage-targeted/after/location-QA-ONLY-fr-390.png), [Arabic 390](qa/homepage-targeted/after/location-QA-ONLY-ar-390.png) |
| Protected hero | [Before](qa/homepage-targeted/before/fr-1536-top.png) / [After](qa/homepage-targeted/after/fr-1536-top.png) | [Before](qa/homepage-targeted/before/fr-390-top.png) / [After](qa/homepage-targeted/after/fr-390-top.png) |

## Files changed by this task

- Homepage renderer/loader: `apps/web/src/components/home-page.tsx`, `apps/web/src/app/[locale]/page.tsx`.
- New scoped additions: `apps/web/src/app/home-targeted.css`, `components/home-quotation.tsx`, `components/home-location.tsx`, `lib/magasin.ts`.
- Public site DTO: `apps/web/src/lib/api.ts`, site response in `apps/api/app/Http/Controllers/PublicCatalogueController.php`.
- Admin field and validation: `apps/api/app/Models/SiteSetting.php`, `Domain/ContentWriter.php`, `Filament/AdminSchemas.php`, new `Rules/GoogleMapsLocation.php`, `lang/fr.json`, `lang/ar.json` (English uses source strings).
- Additive migration: `apps/api/database/migrations/2026_10_14_000100_add_magasin_directions_url.php`.
- Focused checks: `apps/api/tests/Feature/MagasinLocationTest.php`, `tests/homepage-targeted.spec.ts`, `tests/magasin.test.mjs`, `tests/fixtures/magasin-proxy.mjs`; existing homepage test now expects the functional Devis destination instead of the removed placeholder status.
- Next regenerated route-type references in `apps/web/next-env.d.ts` and output-type includes in `apps/web/tsconfig.json`; no global layout tokens changed. This report and `docs/qa/homepage-targeted/` hold evidence. Ignored `.tools/homepage-targeted/` holds local verification helpers, not release input.

Repeat the focused browser suite with `QA_BASE_URL`, `QA_LOCATION_URL` and `QA_TEST_RESULTS` set; `node tests/fixtures/magasin-proxy.mjs` provides a GET-only fixture API on loopback 8021 forwarding to existing local API 8011, and a separate Next preview can use that origin. Without that fixture URL the location-only browser case explicitly skips rather than inventing or writing real location data. It was configured and executed in this task, with zero skips in the final run.

**Stop for owner review.** Confirm the exact magasin address/link through the admin when available. No deployment or further milestone is authorized.
