# TIME STONE — Milestone 1 implementation report

Date: 12 October 2026. Scope: Frontend Foundation & Homepage only.

Milestone 0 was approved. Milestone 1 is implemented and submitted for review. Milestone 2 has not started; no backend, migrations, production deployment, payment integration or rewrite of `prototype/` was performed.

## Implemented

- npm workspace foundation with Next.js 16.4.0 App Router, React 19.3.0, TypeScript 5.9.3 and Tailwind 4.3.3. Exact resolved packages are committed in the root lockfile.
- Prerendered `/fr`, `/en`, `/ar` homepages; `/` redirects to French. Correct document `lang`/`dir`, authored localized interface and editorial copy, localized metadata, and self-hosted Noto fonts.
- Working language selector preserves the current pathname, query string and section anchor. The path helper also supports nested product/application routes when those pages exist in later milestones.
- Reference-led quarry/stone hero with editorial typography, story rail, material swatches and CTAs; six-item introductory strip; five collection cards; split quarry/process narrative; introduction; material studies; craftsmanship; applications; quality questions; quotation/contact introduction; footer.
- Reusable brand, icons, header, section headings, homepage/content adapter and material-preview components. Current homepage links navigate to existing sections rather than unimplemented catalogue pages.
- Static photographic material dialog with actual sample selection, keyboard containment, Escape/backdrop/close controls and focus restoration. The hero and preview stage explicitly expose `data-integration="milestone-3"` for the future on-demand viewer. No Three.js/R3F engine is loaded into this frontend.
- Desktop navigation, native locale control and mobile/tablet modal menu. Header becomes opaque while scrolling. Logical CSS properties, reversed directional arrows and mirrored composition support Arabic RTL.
- Skip link, semantic landmarks, a single H1, visible keyboard focus, named controls, image dimensions, accessible dialog behavior and reduced-motion support. Animations are limited to restrained control/image-hover transitions; no forced scroll choreography.
- Responsive image sizing, optimized local images, high-priority preloaded hero, lazy lower-page images and self-hosted fonts. Arabic body fonts use only the regular/semibold weights needed by the interface.
- Temporary asset labels and explicit draft-content notices. No invented company statistics, certification claims, product counts, availability, technical specifications, portfolio claims or testimonials.
- Metadata and baseline security headers. Temporary pages remain intentionally `noindex, nofollow`; `robots.txt` disallows indexing. A real server-only `SITE_URL` can enable canonical/hreflang URLs when the actual origin is known.

The quotation CTA currently navigates to an honest introduction explaining that the real form and official contact channels are not yet available. It does not pretend to submit a request. Quotation UI and persistence remain in M4/M6 respectively.

## Files changed

| Area | Important files |
| --- | --- |
| Workspace/tooling | `package.json`, `package-lock.json`, `.gitignore`, `README.md`, `playwright.config.ts` |
| Frontend configuration | `apps/web/package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `.env.example` |
| Public routes | `apps/web/src/app/[locale]/layout.tsx`, `[locale]/page.tsx`, `robots.ts`, `globals.css` |
| Components | `apps/web/src/components/{home-page,site-header,section-heading,material-preview,dialog-focus,brand,icon}` |
| Localized content | `apps/web/src/lib/home-content.ts`, `locales.ts` |
| Temporary assets | `apps/web/public/images/`, including `provenance.json`; `public/icon.svg`; `src/fonts/` including original font licenses |
| Verification | `tests/homepage.spec.ts`, `scripts/prepare-assets.py`, `scripts/performance.mjs`, `docs/qa/` |

Content is centralized as typed fixtures behind `getHomeContent()` so M6 can replace that boundary with Laravel DTOs. This milestone does not claim that the content is already admin-editable.

## Executed tests

Verification used the bundled Node.js **24.19.0** runtime on Windows. The machine's older global Node 23 installation was not changed. Commands below were invoked through the bundled Node executable/npm CLI, with Node 24 first in the child-process PATH for builds.

| Executed command / check | Final result |
| --- | --- |
| `npm run build` | PASS. Next.js compiled, TypeScript passed, and all three localized pages were prerendered. Final compilation reported 3.1 s, TypeScript 8.5 s and static-page generation 3.3 s; these are build-stage timings, not user-facing speed metrics. |
| `node node_modules/@playwright/test/cli.js test` | PASS: **39 passed, 0 failed, 3 skipped**, final run about 95.2 seconds. No flaky tests/retries. |
| axe WCAG 2 A/AA and 2.1 AA scans | PASS: no violations in all nine locale/viewport combinations. Automated scans are not a complete manual accessibility certification. |
| Dependency install/audit | Final npm resolution reported **0 vulnerabilities**. The initial Lighthouse 12 dependency advisories were removed by moving to Lighthouse 13.5.0. |
| Browser runtime/network | No page errors in screenshot tests; images decode successfully; fetched assets remain same-origin. |

The three skips are intentional applicability checks: desktop does not use the mobile menu; additional intermediate widths run only once, rather than repeating them in tablet/mobile projects.

Coverage includes locale/RTL attributes, translated titles and notices, fonts actually loading, one H1, no horizontal overflow, local image decoding, anchor targets, material selection, Escape and focus restoration, menu focus containment, language switching with query/anchor preservation, French redirect, unsupported-locale 404, keyboard skip link and reduced motion.

A tablet reverse-tab failure was found and corrected with a shared explicit dialog-focus guard. Visual review also found and corrected font variable scoping that had initially selected fallback fonts. The final test run includes regression checks for both. Existing prototype tests were not rerun unnecessarily; its unchanged baseline was verified in M0.

## Screenshots and visual verification

Playwright captured each language at:

- Desktop: **1536 × 1024 CSS px**.
- Tablet: **768 × 1024 CSS px**, touch/device emulation.
- Mobile: **390 × 664 CSS px**, touch/device emulation.
- Extra overflow checks: **320, 430, 1024 and 1280 px** widths in all three languages.

Each combination has a viewport screenshot and a separate full-page capture. Actual CSS viewport sizes are reported, not the emulated device's full physical screen dimensions.

| Language | Desktop | Tablet | Mobile | Complete page |
| --- | --- | --- | --- | --- |
| French | [Viewport](qa/home-fr-desktop.png) | [Viewport](qa/home-fr-tablet.png) | [Viewport](qa/home-fr-mobile.png) | [Desktop](qa/home-fr-desktop-full.png) · [Mobile](qa/home-fr-mobile-full.png) |
| English | [Viewport](qa/home-en-desktop.png) | [Viewport](qa/home-en-tablet.png) | [Viewport](qa/home-en-mobile.png) | [Desktop](qa/home-en-desktop-full.png) · [Mobile](qa/home-en-mobile-full.png) |
| Arabic | [Viewport](qa/home-ar-desktop.png) | [Viewport](qa/home-ar-tablet.png) | [Viewport](qa/home-ar-mobile.png) | [Desktop](qa/home-ar-desktop-full.png) · [Mobile](qa/home-ar-mobile-full.png) |

The supplied desktop/mobile homepage artwork was compared visually with captured output. The core composition, color treatment, header, category arrangement and quarry narrative follow the references; mobile categories use two columns and a full-width final card. The six introductory items reflow without inventing business claims. Arabic uses the mirrored composition and its own typography.

Differences remain deliberate and visible: clean temporary crops limit the hero scene framing/resolution; translated text changes line wrapping and section heights; unsupported 360°/video/AR claims are replaced by an honest 2D preview; unverified benefits/counts are removed. Sections below the supplied desktop crop use the extensions approved in M0. This is not a pixel-perfect claim, and there are no supplied Arabic or tablet mockups for exact comparison.

## Performance measurements

Lighthouse **13.5.0**, Chromium **156**, production `next start`, loopback origin. Mobile uses Lighthouse's default simulated mobile network/CPU throttling; desktop uses a 1536 × 1024 viewport, 40 ms RTT, 10,240 Kbps throughput and no CPU slowdown. Browser tests completed before measurements; these remain measurements on the shared local host, not a representative deployed VPS or field data.

| Page / conditions | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS | Transferred |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| French mobile, median of 3 final-build samples | **94** | 100 | 100 | 66 | 2.96 s | 87 ms | 0.0007 | 322 kB |
| French desktop | **100** | 100 | 100 | 66 | 0.62 s | 0 ms | 0.0003 | 334 kB |
| Arabic mobile | **95** | 100 | 100 | 66 | 2.75 s | 111 ms | 0.0008 | 446 kB |
| Arabic desktop | **100** | 100 | 100 | 66 | 0.75 s | 7.5 ms | 0.0017 | 458 kB |

French mobile showed substantial variability on the same final build: performance **72, 94, 95**, LCP **3.44, 2.96, 2.84 seconds**, TBT **775, 87, 71.5 ms**. The original unfavorable sample is retained, and two bounded repeats are reported alongside it. The slow sample contained substantial document/script long tasks; this milestone does not establish whether host contention or page execution caused that variation. The median is not a guarantee and does not erase the 72 result.

The mobile LCP target of ≤2.5 seconds was **not reached** in these final samples. French mobile's median performance is also below the 95 goal. These require representative deployment measurement and further work in M8; they are not presented as completed performance targets. No Lighthouse run warnings were reported.

Evidence:

- [Default French/Arabic measurement JSON](qa/performance-summary.json).
- [French mobile repeats JSON](qa/performance-summary-fr-mobile.json), [repeat 1 HTML](qa/lighthouse-fr-mobile-check-1.html), [repeat 2 HTML](qa/lighthouse-fr-mobile-check-2.html).
- [French mobile Lighthouse](qa/lighthouse-fr-mobile.html), [French desktop](qa/lighthouse-fr-desktop.html).
- [Arabic mobile Lighthouse](qa/lighthouse-ar-mobile.html), [Arabic desktop](qa/lighthouse-ar-desktop.html).
- [Playwright result JSON](qa/test-results.json).

Arabic body fonts were reduced from 165,960 bytes to 102,100 bytes in total, without changing the typeface. The hero now carries explicit high fetch priority. All 12 temporary images plus their provenance manifest total approximately 223 kB on disk; browser transfer varies with Next.js image variants and viewport.

Lighthouse SEO is intentionally **66** because indexing is blocked for the temporary presentation. Removing that protection just to raise a score would violate the approved placeholder/publication boundary. Accessibility and Best Practices measured **100** in all four final default runs.

Lab LCP and total blocking time are reported as measurements; TBT is not field INP. Good p75 Core Web Vitals require representative deployment and real traffic. No field, physical mobile, GPU or 3D performance claim is made here. English has automated browser/accessibility coverage; dedicated Lighthouse sampling in this milestone uses default French and RTL Arabic.

## Remaining issues and limits

1. Original logo files, high-resolution product/quarry/application photography, verified copy/contact channels and final translations still need client approval. Temporary crops can look soft at large sizes and do not establish real portfolio/product facts.
2. Live 3D, cinematic scroll choreography, backend/admin content editing and actual quote delivery belong to later milestones. Existing `prototype/` is preserved for M3.
3. Mobile performance needs representative production validation. Any measured variation or missed target is listed in the performance table; local scores are not guarantees.
4. Physical Android/iOS gestures, Safari/Firefox, screen-reader testing and production HTTPS/security configuration were not verified in this Chromium-based milestone. The next production audit must retain these limits rather than equate emulation with hardware testing.
5. SEO publication remains blocked intentionally. Canonical origin, full SEO/hreflang/sitemap acceptance and structured data belong to M7 after real content/origin confirmation.

## Review gate

Please review the three-language homepage, responsive screenshots and these limitations. The next milestone is **M2 — Product Catalogue**, with mock-data listing, search, URL filters, sorting and pagination.

**Stop after this report. Do not start M2 without explicit user approval.**
