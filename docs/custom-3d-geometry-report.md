# Custom 3D Geometry & Per-Product Viewer Control

Local feature implementation, 15 October 2026. This is independent of M8. No deployment, VPS access, M9 work, homepage redesign, cinematic animation or modification of the original prototype was performed.

## Implementation

- New products default to **3D OFF**. They can be published with a normal main image and commercial options, without a texture or 3D configuration. OFF preserves an existing saved configuration, removes activation/loading/control UI, and withholds model/configuration URLs from public product responses. Invalid enabled configurations are rejected transactionally with field errors.
- The existing product studio supports procedural slab/block/tile plus square, circular disc, hexagon, triangle, trapezoid, circular sector, annular sector and ordered irregular polygon. Polygons reject self-intersections, duplicate/collinear edges and degenerate area. Curved surfaces receive radial side normals; broad surfaces and perimeter edges have physical UV coordinates. New extrusions use three contiguous material groups.
- The existing engine is extended through `stone-engine/geometry.js`. The original prototype and the integrated original `stone.js`/`images.js` remain byte-for-byte unchanged. No dependency was added.
- Filament provides conditional source/shape controls, private GLB upload/approval, readiness, customer limits, separate top/bottom/side assets and rough-edge finish. Existing product permissions and the image library workflow remain in place. GLB assets are managed in the product editor rather than the image-only editor. Labels and geometry/GLB validation messages support FR/EN/AR.
- Customer customization is explicitly opt-in, limited to the selected shape and administrator-approved minimum/maximum/default/step. Parameters use centimeters and at most two decimals; angular parameters use degrees. Polygon outlines remain administrator-defined. Format-level custom-dimension permission remains necessary. GLB dimensions stay fixed and are model bounds, not verified manufacturing specifications.
- Three.js/R3F/Drei, texture preparation and GLTFLoader remain behind user activation. Static product images remain the initial presentation. The viewer keeps one canvas, demand rendering, hidden-view pause, DPR ≤1.5, reduced-motion behavior, WebGL failure fallback and resource disposal. Supported PNG/GLB exports remain available. GLB exports retain materials/UVs/proportions; Three.js may split original primitives into separate meshes. Procedural bump shading is not a glTF manufacturing displacement map.
- The existing quotation endpoint receives optional version-2 geometry selections alongside its compatible version-1 visual configuration. The server authorizes source, shape, revision, parameters, bounds and commercial options. Private immutable snapshots preserve selected parameters, dimensions, material derivative identities or model ID/hash. GLB snapshots do not claim that unrelated procedural textures were applied. Idempotent retries after later configuration changes still return the original reference/snapshot.

## GLB validation and delivery

Validation is bounded PHP data parsing, without shell commands, native 3D importers, user code execution, plugins or remote fetching. The local Windows process was checked as non-elevated. A root POSIX application worker is rejected. This is not a claim of a separately verified OS sandbox or production worker isolation.

| Budget / supported subset | Limit |
| --- | --- |
| Container | GLB 2; exactly one JSON and one embedded BIN chunk |
| Upload / JSON / JSON depth | 8 MiB / 1 MiB / 32 |
| Scenes / nodes / hierarchy depth | 1 / 128 / 16; no cycles, shared or unreachable nodes |
| Meshes / primitives and instantiated draw calls | 64 / 64 |
| Vertices / triangles | 100,000 each; instantiated scene totals also bounded |
| Decoded accessor components | 1,500,000 |
| Accessors / buffer views | 256 each |
| Materials / textures / samplers | 32 / 8 / 16 |
| Embedded images | JPEG/PNG; ≤2048 px per side; aggregate ≤8,388,608 pixels |
| Actual transformed bounds | 0.5–500 cm on every axis; glTF meter units |
| Extensions | Declared `KHR_materials_clearcoat`, `KHR_texture_transform` only |

External/data URIs, unsupported extensions, malformed buffers/accessors/indices, non-finite values, false position bounds, sparse accessors, animation, skins, morph targets, cameras and unsupported topology are rejected. Draco, Meshopt, KTX2, embedded WebP extensions and arbitrary GLB remodeling are not supported. Original uploads remain private; opaque `extras` are stripped from the validated derivative. The original material assignments survive parsing/export.

Controlled model delivery requires a ready validated model, explicit approval, an enabled publicly published product and valid active format/finish associations. The derivative is served with the correct MIME type and `private, no-store`. Originals remain unavailable through public routes. The Next.js proxy retains bounded transfer, deadlines, MIME/origin validation and redirect restrictions. The browser checks model length/hash and rejects external loader resources. Disabling/unpublishing immediately removes public model authorization; already downloaded bytes cannot be revoked from a browser.

Replacement creates a new private model asset. Saved references are retained; quotation references also prevent pruning. Existing safe pruning handles genuinely unreferenced assets after its retention period. No business media was pruned during this task.

## Migration and preservation

`2026_10_15_000100_add_optional_product_viewer.php` is additive: product flag, media asset type, configuration source/shape/parameters/limits/revision, optional material/model foreign keys, approval, customer control and edge finish. Existing texture/configuration-backed viewers retain their previous availability; new products default OFF. Existing format customization is preserved through the backfill. Public content cache version is invalidated.

The SQL preview and migration were executed locally. Rollback refuses to discard feature configurations/model assets or revive disabled legacy viewers. After the feature is used, prefer code rollback compatible with the additive schema; export/review feature data before any schema reversal. No rollback or destructive business-data command was executed.

[Preservation evidence](qa/custom-3d/preservation.json) compares all original columns in 36 business rowsets, **706 original media/model files, 51 other private files and 21 protected hashes**. It includes accounts, environment files, M7/M8 reports/release archives and original engine/prototype files. Only additive schema/backfill fields and migration/cache bookkeeping are expected in the original local database. Synthetic products, models, quotes and the temporary admin use the isolated local QA database and a separate private media copy/session cookie/cache prefix. No original user or quotation was used as a fixture. After verification, the temporary administrator was disabled, its 8 isolated sessions revoked, and its generated credential file removed; [cleanup evidence](qa/custom-3d/qa-account-cleanup.json). Business accounts were unchanged.

## Verification

| Executed check | Actual result / evidence |
| --- | --- |
| Complete Laravel suite, isolated MySQL `time_stone_test` | **142 tests, 680 assertions passed**; [JUnit](qa/custom-3d/laravel-verified.xml) |
| Final GLB/product-viewer checks, including final snapshot clarification | **29 tests, 84 assertions passed**; [JUnit](qa/custom-3d/backend-final-snapshots.xml) |
| Final GLB output-size guard | **21 validator tests, 27 assertions passed**; [JUnit](qa/custom-3d/glb-delivery-budget-verified.xml) |
| Original prototype, preserved engine and new geometry unit tests | **20 passed**, no skips; [log](qa/custom-3d/logs/3d-final.log) |
| Security/map unit tests | **7 passed**, no skips; [log](qa/custom-3d/logs/security-map.log) |
| Production build / standalone TypeScript | **Passed**; [build](qa/custom-3d/logs/build-final.log), [TypeScript](qa/custom-3d/logs/typecheck-last.log) |
| Existing scoped Playwright regressions | **47 passed, 0 failed, 19 intentional skips**, zero retries; [results](qa/custom-3d/regressions-final-results.json) |
| Feature acceptance cases | **10 passed across final and affected replacement runs**, zero retries; see accounting below |
| Focused `git diff --check` | Passed; line-ending warnings only |

The scoped existing browser run includes product, viewer, public-page/quotation and homepage-form journeys on desktop, tablet and mobile. Its 19 skips are: 3 location-fixture cases and 3 outage-fixture cases whose separate controlled proxies were not started; 12 duplicate matrix/no-script/failure checks restricted to the desktop project; and the tablet engine case already covered by desktop/mobile. No failing regression was excluded. The entire repository-wide Playwright suite was not rerun for this focused feature.

Feature accounting is explicit: [final desktop run](qa/custom-3d/feature-final-results.json) passed its 3 language matrices, geometry/export demonstration and real quotation case; its combined admin case exceeded the 180-second total budget. That case was split into language and upload workflows, preserving assertions and the existing timeouts. [Replacement run](qa/custom-3d/admin-live-final-results.json) passed both admin workflows and the live resize/resource test. [Mobile run](qa/custom-3d/feature-mobile-results.json) passed representative circle/annular/polygon/GLB activation, exports and cleanup. [Private quotation check](qa/custom-3d/admin-quotation-results.json) passed Filament visibility of the persisted circle/150 cm snapshot. These are 10 distinct accepted feature cases; the earlier combined-admin failure is retained, not presented as a passing full run.

Public enabled/disabled/GLB layouts were verified in FR/EN/AR at **320, 390, 430, 768, 1024 and 1536 px**, with RTL and no horizontal overflow. Public accessibility scans found no WCAG 2 A/AA or 2.1 AA violations; admin scans found no serious/critical violations. Existing 3D tests cover all three languages, keyboard controls, reduced motion, hidden-view pause, WebGL failure fallback and the original exports. Live resizing from diameter 120 to 130/140/150 cm preserves bounded geometry/texture counts and exports the selected 150 cm geometry.

[Database evidence](qa/custom-3d/quotations.json) shows two synthetic requests from two distinct keys, each with its original circle/150×150×3 cm selection and material derivative identities. Duplicate retries returned the same respective references. The Filament snapshot was also read successfully. Real invalid MIME and malformed-JSON GLB uploads were rejected; a valid replacement was approved and served, the old derivative lost public authorization, OFF returned 404, and re-enable restored the saved model. [Model lifecycle evidence](qa/custom-3d/admin-live-final/desktop/custom-3d/admin-model.json).

Raw first-run failures are retained alongside corrected runs; retries are disabled. The first full Laravel run had an old-schema fixture error and an API fixture failure, both corrected without weakening their assertions. Early feature browser runs also had incorrect test expectations for the fixture's material name/primitive organization, and an active-resize test initially expected rendering while the gallery was offscreen; returning the gallery to view correctly resumes the intentionally paused renderer. Logs and failure-result JSON remain in this feature's evidence only. Private Playwright traces containing session material stay under ignored `.tools/custom-3d`, not the public evidence folder. PHP formatting was attempted but did not complete because of Windows writable/file-write errors; no formatter pass is claimed. Build, syntax exercised by PHP tests, TypeScript and whitespace checks passed.

Confirmed corrections found during verification:

1. Freshly ingested image models lacked their in-memory database default; the new media asset type now has an explicit model default, preserving image replacement.
2. Existing French simulated-finish labels were restored while keeping real commercial-finish identities and accurate quotation selection.
3. GLB limits now count instantiated triangles and draw calls, preventing repeated-node budget bypasses.
4. Migration/API test fixtures now explicitly represent the old schema or an enabled ready viewer; original assertions were retained.
5. New browser fixture expectations were corrected for required quantity, early MIME rejection, actual material names and GLTFLoader's primitive-to-mesh representation. Admin persistence checks use API/media state instead of a transient toast.
6. The validated derivative is explicitly capped at 8 MiB too: JSON re-encoding can otherwise grow a near-limit input beyond the browser/proxy delivery budget. The final validator suite includes an input below 8 MiB whose expanded derivative must be rejected. This small final guard followed the complete Laravel run and was covered by the 21-test validator rerun.

An intermittent existing admin locale issue was observed when switching immediately during concurrent FilePond initialization. The retained trace shows an Arabic locale POST overlapping earlier Livewire requests, followed by an English page. Session-write overlap is a plausible explanation; it has not been established by a controlled server-side reproduction. Final language checks wait for initialization to finish. Authentication/session/cookie protections were not modified to mask this observation; this remains a documented follow-up outside the geometry change.

## Performance measurements

The local production runtime used Node 24.19, Next.js 16.4.0, PHP 8.3.6, Apache with 64 worker threads, MySQL 8.3.0, database sessions/cache, API `127.0.0.1:8028` and web `127.0.0.1:3036`. [Non-secret runtime settings](qa/custom-3d/runtime.json), [privilege check](qa/custom-3d/process-privilege.json).

Measurements ran after browser regressions finished: Chromium/SwiftShader, **390×844**, DPR **1.5**, **4× CPU throttle**, **150 ms latency**, **1.6 Mbit/s download**, **750 Kbit/s upload**. Each run used a new context with browser cache cleared/disabled. Server content was prewarmed before each run; existing optimized-image caches were retained. LCP was observed through page load, fonts ready and an additional 1 second. This is live CDP throttling, not Lighthouse, physical-device performance or production Core Web Vitals. [Complete measurements](qa/custom-3d/performance.json).

| French mobile fixture | Individual initial LCP (s) | Median LCP | Individual HTML TTFB (ms) | Initial JS encoded bytes | Initial resource encoded bytes, excluding HTML |
| --- | --- | --- | --- | --- | --- |
| Viewer OFF | 3.220 / 3.184 / 3.160 | **3.184 s** | 409.7 / 377.5 / 356.9 | 149,760 each | 489,511 each |
| Procedural circle, before activation | 3.348 / 3.312 / 3.296 | **3.312 s** | 403.9 / 368.4 / 370.4 | 149,760 each | 511,089 each |
| GLB, before activation | 3.180 / 3.216 / 3.200 | **3.200 s** | 373.5 / 398.5 / 390.9 | 149,760 each | 489,511 each |

All nine initial runs had **zero canvases and zero model/3D-texture transfers**. Their LCP element was the normal product gallery `IMG` (`/media/11/card`), not WebGL. The circle's extra initial image cost is its existing normal texture-gallery thumbnail, not the 516 KB 3D texture. Static design and approved image assets were not downgraded.

Under the same throttled configuration, first activation took **7.187 s** for the circle and **3.112 s** for the small two-material GLB fixture; both became ready. Circle renderer counts were 8 textures / 17 geometries / 6 draw calls; GLB was 6 / 18 / 5 at the sampled frame. Sixteen of those geometry allocations belong to existing studio lighting/shadow helpers. JavaScript heap rose from approximately **3.4 to 10.2 MiB** for procedural activation, and **3.3 to 9.5 MiB** for GLB. These values exclude native image buffers, driver memory and VRAM. The deliberately small GLB does not benchmark worst-case uploads.

The separate mobile acceptance run recorded circle/annular/polygon/GLB activation at 7.033 / 8.456 / 5.558 / 3.052 s while other regressions were running; these are contention-affected acceptance timings, not the controlled benchmark. [Mobile resource/heap evidence](qa/custom-3d/feature-mobile/mobile/custom-3d/runtime-mobile.json). Repeated circle and GLB activation maintained one canvas, bounded resource counts, and no idle rendering; stopping removed the canvas. Live size changes also retained bounded allocations.

For a historical bundle comparison, the accepted M8 sample-1 mobile viewer recorded 261,929 activation-only encoded JS bytes; the same existing product journey now records **276,153 bytes**, an increase of **14,224 bytes (5.4%)** for the geometry/GLB support. Export-only JS remains **9,918 bytes**. The legacy renderer's 8 textures / 17 geometries / 9 draw calls remain unchanged. This comparison is of transferred code bodies; historical activation times are not compared because host load/throttling differed. [Current comparable viewer evidence](qa/custom-3d/regressions-final/mobile/milestone-3/viewer-metrics-mobile.json); M8 evidence is preserved in its original folder.

The measured 3.2–3.3 s initial LCP does **not** meet 2.5 s under this configuration. Closing the separate M8 mobile LCP requirement is not claimed. No image-quality, design, publication, caching, quotation or security protections were relaxed for these results.

## Screenshots and examples

- Admin configuration: [French desktop](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/admin-fr-1536.png), [French mobile](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/admin-fr-390.png), [Arabic RTL controls](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/admin-controls-ar-1536.png), [Arabic mobile](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/admin-ar-390.png), [English desktop](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/admin-en-1536.png).
- Viewer disabled: [French desktop](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/disabled-fr-1536.png), [French mobile](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/disabled-fr-390.png).
- Enabled configuration: [French desktop](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/circle-fr-1536.png), [Arabic mobile](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/circle-ar-390.png), [fixed GLB page](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/glb-fr-1536.png).
- Procedural examples: [square](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-square-desktop.png), [circle](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-circle-desktop.png), [hexagon](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-hexagon-desktop.png), [triangle](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-triangle-desktop.png), [trapezoid](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-trapezoid-desktop.png), [sector](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-sector-desktop.png), [annular](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-annular-desktop.png), [polygon](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-polygon-desktop.png).
- Live resize: [150 cm circle](qa/custom-3d/admin-live-final/desktop/custom-3d/screenshots/resized-circle.png), [exported resized GLB](qa/custom-3d/admin-live-final/desktop/custom-3d/resized-circle.glb).
- Custom model: [desktop](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/geometry-glb-desktop.png), [mobile](qa/custom-3d/feature-mobile/mobile/custom-3d/screenshots/geometry-glb-mobile.png), [GLB export](qa/custom-3d/feature-final/desktop/custom-3d/glb-desktop.glb). Red/limestone materials are explicitly synthetic QA proof of preserved assignments, not a business product.
- Quotation: [saved request](qa/custom-3d/feature-final/desktop/custom-3d/screenshots/quotation-success.png), [Filament snapshot](qa/custom-3d/admin-quotation/desktop/custom-3d/screenshots/admin-quotation-snapshot.png).

The loopback-only QA preview remains available for local owner review: [procedural circle](http://127.0.0.1:3036/fr/products/qa-custom3d-circle), [custom GLB](http://127.0.0.1:3036/fr/products/qa-custom3d-glb), [viewer OFF](http://127.0.0.1:3036/fr/products/qa-custom3d-disabled). It uses synthetic QA products/database; use fictional enquiry details. The temporary QA admin is disabled. This is not a deployment or a replacement of the existing local application.

## Changed application files

API:

- `app/Domain/ContentWriter.php`, `MediaLibrary.php`, new `StoneGeometry.php`, `GlbValidator.php`, `ViewerConfiguration.php`.
- `app/Filament/AdminSchemas.php`, `Pages/EditContent.php`, `Resources/MediaResource.php`.
- `app/Http/Controllers/MediaController.php`, `PublicCatalogueController.php`, `QuotationSubmissionController.php`; `Requests/QuotationSubmissionRequest.php`; `Resources/ProductResource.php`.
- `app/Models/Product.php`, `Product3dConfig.php`, `Media.php`.
- The additive migration, `database/seeders/DevelopmentDemoSeeder.php`, `lang/fr.json`, `lang/ar.json`.
- `tests/Feature/BackendTest.php`, `IntegrationTest.php`, new `ProductViewerTest.php`, `ViewerMigrationTest.php`, `tests/Fixtures/GlbFactory.php`, `tests/Unit/StoneGeometryTest.php`, `GlbValidatorTest.php`.

Web:

- `src/components/product-studio.tsx`, `quotation-form.tsx`, new `geometry-controls.tsx`, `stone-viewer-client.tsx`, `stone-engine/StoneViewer.jsx`, `StoneViewer.d.ts`, new `stone-engine/geometry.js`.
- `src/lib/product.ts`, `product-data.ts`, `api.ts`, `quotation.ts`, new `geometry.ts`.
- `src/app/[locale]/products/[id]/page.tsx`, `[locale]/quote/page.tsx`, `media/[id]/[variant]/route.ts`.
- Next-generated build type references in `next-env.d.ts`/`tsconfig.json`.

Root: `package.json` adds the geometry tests to `test:3d`; new `tests/product-geometry.test.mjs`, `tests/custom-3d.spec.ts`, this report and feature-only evidence. Private QA helpers/configs/builds are under ignored `.tools/custom-3d` and dedicated `.next-custom-3d*` directories. Pre-existing M7/M8 working-tree changes are not part of this feature's changed-file list.

## Remaining limits

- Physical low-end devices, actual GPU memory and worst-case owner GLBs are not verified by Chromium/SwiftShader emulation. Resource/heap counts are proxies, not proof of physical-device frame rate or driver VRAM reclamation.
- Only the bounded static GLB subset above is accepted; there is no arbitrary GLB dimensional remodeling or manufacturing accuracy claim.
- Fast admin language switching during form initialization needs a separate controlled investigation as documented above.
- Existing M8 mobile LCP/production operational requirements remain open in their original reports. This feature does not claim to close them.
- No deployment or infrastructure verification was performed. Owner review is required before subsequent work.
