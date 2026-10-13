# TIME STONE — Milestone 3

Product detail pages and interactive 3D studio. Completed locally on 12 October 2026. Milestone 4 has not started.

## Implementation

- Added server-rendered `/fr/products/sample-1` through `sample-18`, with equivalent English and Arabic routes. French remains the default. Arabic preserves RTL layout, language switching and bidirectional numeric dimensions.
- Followed the supplied desktop/mobile product-detail references: quarry header, breadcrumbs, vertical desktop gallery thumbnails, a large stone presentation, material information, finish swatches, specifications panel, applications and quotation panel. Mobile uses a stacked layout with horizontal thumbnails and keyboard-accessible application scrolling. Unverified ratings, stock, certifications, AR and document downloads were omitted.
- Catalogue cards now open product pages. Validated URL filters, search, sorting and pagination travel with the link and the return-to-results link. Language changes preserve the product path and query parameters.
- Finish and format choices update the quotation selection. The quotation destination is an explicitly labelled preparation summary. It sends and saves nothing; returning restores the chosen configuration. This is a navigation placeholder for the planned quotation milestone, not a quotation submission system.
- Temporary images retain their labels and source provenance in `apps/web/public/images/provenance.json`. Studio/limestone crops come from the approved mockup without baked controls; the marble texture reuses the prototype’s bundled Poly Haven CC0 sample. No verified commercial specifications or availability are invented.

## Reused engine and rendering lifecycle

`prototype/` source remains unchanged. Its geometry/material pipeline (`stone.js`) and image preparation (`images.js`) are copied byte-for-byte into the frontend and checked against the original by automated tests. The existing R3F `StoneViewer.jsx` supplies the PBR scene, six-face materials, bevels, camera fitting, local environment lighting, shadows and exports. Integration changes add visibility pausing, first-model-frame readiness, keyboard rotation/thickness controls, metrics and localized failure handling.

The static product preview remains visible until the first model frame. React requests the client viewer module only after activation; automated checks verify that the initial JavaScript does not contain the Three.js renderer. One studio canvas mounts at a time. Returning to photographs unmounts it; geometry, materials, textures and prepared-image object URLs are released. A short-lived WebGL capability probe is released before the studio context is created.

Rendering uses demand mode while visible and `never` while outside the viewport or the document is hidden. There is no automatic rotation or damping animation. Reduced-motion preferences are respected. DPR is capped at 1.5; color textures at 2048 pixels and luminance-derived bump maps at 1024. Native WebGL failures and context loss return to an accessible static gallery with a retry action.

Users can drag or use keyboard-accessible buttons to rotate and zoom, inspect the edge and reset the camera. Slab, block and tile presets use validated demonstration dimensions between 0.5 and 500 cm. Honed, polished and rough are distinct PBR simulations. Brushed catalogue associations are explicitly not mapped to a supported simulation.

PNG export captures the studio canvas. GLB export loads its exporter separately, embeds color textures, preserves meter units and includes the approximation note. Hidden surfaces, apparent texture relief and finish response are illustrative. Bump shading and studio lighting are not part of the GLB export.

## Laravel preparation

`apps/web/src/lib/product.ts` defines the typed adapter and DTO for images, texture, geometry type, dimensions, verification status, supported finishes, formats, an optional validated GLB descriptor, verified specifications and versioned saved configuration. Query-provided dimensions and enums are validated before entering the viewer. Catalogue return paths are built from allowlisted query fields rather than accepting arbitrary redirect URLs.

The current adapter is temporary. Uploaded GLB models are represented by a nullable contract; actual model ingestion, validation, administration and persistence remain future backend work. There is no upload control that pretends to store a model. All current products use the procedural engine. `dimensions_verified` is false and `verified_specifications` is empty for every fixture.

## Verification

- Production build: **passed**, Next.js 16.4.0 under Node 24.19.0, including TypeScript checks. Product and preparation routes are server-rendered; localized homepages remain statically generated.
- Full Playwright regression: **71 passed, 16 intentionally skipped, zero failures**. Skips avoid repeating full-width/no-JavaScript matrices or viewport-specific tests. [Archived results](qa/milestone-3/regression-results.json).
- Engine unit checks: **8 passed** across the preserved prototype and integrated pipeline, covering dimensions, six-face UVs, PBR presets, invalid inputs, disposal and image validation.
- The original browser acceptance page passed **all 11 checks**, including 16 alternating image replacements returning its GPU counts to zero. Both GLBs exported from the integrated desktop/mobile product pages were re-imported with the standard GLTFLoader: six textured faces and correct 0.6 × 0.6 × 0.015 metre tile dimensions. [Evidence](qa/milestone-3/prototype-browser-acceptance.json).
- Static and activated 3D layouts checked at **320, 390, 430, 768, 1024 and 1536 px in French, English and Arabic**. No horizontal document overflow or broken images in the checked matrix.
- Axe WCAG A/AA checks passed for the homepage, catalogue and product pages across the three browser projects; activated-viewer scans passed on desktop and mobile. Keyboard controls, native menu/filter focus behavior and reduced motion were exercised.
- 3D acceptance covers rotation, zoom, thickness inspection, reset, all three formats/finishes, nine successive configuration changes with stable GPU resource counts, idle/hidden pausing, PNG/GLB downloads, canvas teardown/restart, initialization failure and context-loss recovery.
- Static information, photos and the honest quotation destination also work with JavaScript disabled. Interactive controls are hidden in that mode.

## Performance measurements

Lighthouse 13.5.0, production server on localhost, Chromium, default simulated mobile throttling. Runs were sequential and separate from regression/3D testing. These are lab results, not field Core Web Vitals. The Next.js image optimizer had been warmed by QA; browser storage is reset by Lighthouse. French/Arabic mobile rows use three-run medians; English mobile and French desktop are single representative samples.

| Initial static product page | Performance | LCP | LCP range | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| French mobile | 95 | 2.937 s | 2.896–2.937 s | 43 ms | 0.00018 | 315.8 kB |
| Arabic mobile | 89 | 3.462 s | 3.012–3.463 s | 32 ms | 0.00321 | 440.1 kB |
| English mobile | 95 | 2.918 s | single run | 42 ms | 0.00018 | 315.1 kB |
| French desktop | 100 | 0.627 s | single run | 0 ms | 0.00189 | 314.3 kB |

All samples scored accessibility 100 and best practices 100, with no Lighthouse run warnings. SEO scored 66 because these draft pages intentionally block indexing. [Product Lighthouse reports and summaries](qa/milestone-3/product-performance/).

**Initial mobile product LCP remains above 2.5 seconds.** Trace inspection identifies the main static image as LCP and confirms high fetch priority, discovery in the initial HTML and eager loading. Its optimized mobile response is about 14.3 kB. There is no initial Three.js renderer code. Lighthouse flags the two required stylesheets as render-blocking; Arabic font responses total approximately 196.1 kB versus 72.6 kB for Latin. Those costs are observed contributors to the critical loading path, not proof of a single production cause. Image compression suggestions were not applied at the expense of source fidelity. A future performance pass can investigate CSS delivery and Arabic font subsetting against the approved typography; no global typography or homepage redesign was introduced here.

| Activated studio, separate isolated runs | Desktop | Emulated mobile |
| --- | ---: | ---: |
| Activation to first model frame | 2.205 s | 2.561 s |
| JS heap before activation | 3.23 MiB | 3.03 MiB |
| JS heap after activation | 9.24 MiB | 9.25 MiB |
| Initial/after nine changes: textures | 18 / 18 | 18 / 18 |
| Initial/after nine changes: geometries | 17 / 17 | 17 / 17 |
| DPR | 1 | 1.5 |
| Typical observed draw calls | 8–9 | 8–9 |
| Scripted drag frames / duration | 32 / 1.657 s | 31 / 1.491 s |

The drag values count demand-rendered frames during scripted pointer input, not a sustained FPS benchmark. Additional encoded JavaScript was 261,819 bytes on activation and 9,918 bytes only when exporting GLB. Idle and hidden rendering checks passed; switching back to photographs removed the canvas. After the full flow, including axe injection, downloads and exports, forced-GC JS heap was about 13.3 MiB. This is not a GPU-memory reading or a clean before/after leak comparison. [Desktop metrics](qa/milestone-3/viewer-metrics-desktop.json), [mobile metrics](qa/milestone-3/viewer-metrics-mobile.json), [isolated acceptance results](qa/milestone-3/viewer-isolated-results.json).

Homepage tracking was retained without changing its design or image quality:

| Homepage mobile, three-run median | Performance | LCP | LCP range | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| French | 95 | 2.832 s | 2.829–2.838 s | 37 ms | 0.00064 |
| Arabic | 89 | 3.463 s | 3.462–3.465 s | 41 ms | 0.00356 |

**The French and Arabic homepage mobile LCP issue remains open.** These lab medians vary from the earlier milestone measurements and do not establish a production regression or improvement. [Homepage reports](qa/milestone-3/home-performance/).

## Screenshots and working demonstration

- [French desktop](qa/milestone-3/product-fr-1536-full.png), [French mobile](qa/milestone-3/product-fr-390-full.png), [English mobile](qa/milestone-3/product-en-390-full.png), [Arabic mobile](qa/milestone-3/product-ar-390-full.png).
- All 18 static width/language captures and six activated-viewer desktop/mobile captures are in `docs/qa/milestone-3/`.
- [Recorded working studio](qa/milestone-3/3d-demonstration.webm), [demonstration screenshot](qa/milestone-3/3d-demonstration.png), [exported mobile PNG](qa/milestone-3/demo-mobile.png), [exported mobile GLB](qa/milestone-3/demo-mobile.glb).
- To interact locally: use Node 24, run `npm.cmd run start` after the production build, open `http://127.0.0.1:3000/fr/products/sample-1`, and activate **Explorer en 3D**. `node scripts/demo-3d.mjs` reproduces the recording. Preview servers used for verification are stopped at handoff.

## Remaining limitations

Real product photographs, calibrated textures, technical specifications and original branding are still pending. Low-resolution crops from the approved mockups limit source detail; image encoding quality was retained rather than reduced for Lighthouse scores. A photograph cannot verify hidden geometry, true relief, reflectance or suitability for an application.

Physical iOS/Android gestures, GPU memory, thermal behavior and sustained-device frame rate are unverified. Browser QA uses Chromium and emulated viewports, with SwiftShader for deterministic WebGL acceptance. JavaScript heap and renderer resource counters are not VRAM measurements. Loaded JavaScript modules remain cached after viewer disposal, so heap size need not return to the initial-page baseline.

Development pages intentionally remain `noindex, nofollow`, and robots disallow indexing. Canonical/hreflang metadata is generated only when a real server-side `SITE_URL` is supplied. Production publication, backend integration and actual quotation submission are outside this milestone.

**Stop point: Milestone 3 complete. Explicit approval is required before Milestone 4.**
