# Milestone 1 focused refinements

Completed locally on 12 October 2026. Milestone 2 has not started.

## Implementation

- Refined only the mobile hero typography and spacing. French uses a fluid 29–33 px heading, English 28–33 px, and Arabic 32–38 px with its own line height. Existing fonts, copy, colors, buttons, desktop composition, and RTL direction remain.
- Reserved a separate swatch column and moved the mobile image layer from an inline inset of 27% to 18%, exposing more of the stone. English now uses three heading lines at 390 px and Arabic two. At 320 px, Arabic wraps naturally into three lines.
- Reduced description/action spacing without reducing mobile control heights. Regression assertions require at least 100 px between the bottom of the copy and the bottom of the hero, heading height below 150 px, and no overlap with the swatch column.
- Limited the header and material-preview client props to the content those components actually consume. No claim of a significant standalone network improvement is made for this small change.
- Applied native `content-visibility: auto` to four distant editorial sections: materials, craft, applications, and contact. Their layout and paint are deferred until approached. Unsupported browsers retain ordinary rendering. Normal rendering remains on the dark quality section and footer. No animation, dependency, live 3D, form submission, or homepage redesign was added.
- Added an output-directory option to the existing Lighthouse script so baseline, experimental, and final reports remain separate.

Changed implementation files: `apps/web/src/app/globals.css`, `apps/web/src/components/home-page.tsx`, `site-header.tsx`, `material-preview.tsx`, `tests/homepage.spec.ts`, and `scripts/performance.mjs`. Existing temporary-asset labels remain visible.

## Production build and regressions

The final production build passed with Node 24.19.0 and Next 16.4.0. Compilation took 1.09 s, TypeScript 1.86 s, and static generation 0.92 s. `/fr`, `/en`, and `/ar` are prerendered.

The final Chromium regression run completed in 45.1 seconds:

- **39 passed, 0 failed, 0 flaky, 3 intentional skips.** The desktop menu test is inapplicable; the additional width matrix runs once rather than repeating in the tablet/mobile projects.
- **Nine axe WCAG A/AA scans passed with zero violations.** These are automated checks, not a manual accessibility certification.
- All three languages passed at **320, 390, 430, 768, and 1536 px**, plus 1024 and 1280 px: 21 width/language combinations.
- Verified no horizontal overflow, heading bounds, mobile image space, separate swatch controls, image decoding, local assets, document language/direction, metadata, and valid section targets.
- Verified language switching retains query and section, French default redirect, unsupported-locale 404, keyboard skip link, menu/dialog focus and Escape behavior, and reduced-motion CSS.
- Explicitly scrolled each deferred section into view and checked its heading, then returned to the top before screenshots. Section-link navigation also passed.

Raw regression results: [test-results.json](qa/test-results.json).

## Performance investigation

Measurements use Lighthouse 13.5.0, Chromium 156, the local **production** server, default simulated mobile throttling, and the existing desktop profile. Browser tests were not run concurrently with Lighthouse. Each batch uses consecutive Lighthouse navigations in one browser process; storage reset does not remove every possible process/JIT or host scheduling effect. The local image optimizer cache was already warm. These are synthetic lab measurements, not physical-phone or field Core Web Vitals.

The historical 72-point French sample could not be reproduced in the fresh baseline. Fresh baseline scores were **89, 94, 94** with TBT **277.5, 66.5, 70.5 ms**. The first sample's extra blocking demonstrates variability; it does not establish a single live-site cause. Diagnostics identify the hero image as LCP, a small render-blocking stylesheet, framework/hydration work, and substantial offscreen style/layout work. The hero was already preloaded with high fetch priority and served as AVIF; adding another image preload would duplicate existing work.

Three-sample baseline/final comparison under the same script settings:

| French mobile metric | Before median | Final median |
| --- | ---: | ---: |
| Performance score | 94 | 95 |
| LCP | 2.930 s | 2.832 s |
| Total blocking time | 70.5 ms | 56 ms |
| Style/layout work | 465.5 ms | 361.4 ms |
| Transferred bytes | 321,902 | 310,968 |

Final matched-batch scores were **95 / 95 / 95**, LCP **2.801 / 2.875 / 2.832 s**, and TBT **43 / 56 / 59.5 ms**. A subsequent French mobile check scored **95**, LCP **2.890 s**, TBT **62 ms**. Across all four final French samples the median LCP is **2.854 s**; every sample is retained.

The offscreen work decreased by about 22% in the matched-batch medians; transfer decreased by about 11 kB. The timing improvement is modest and should not be interpreted as a statistically proven production gain.

An isolated Next CSS-inlining experiment removed the blocking CSS request but increased HTML transfer from roughly 13 kB to 27 kB. Its median LCP was 2.967 s and it introduced an experimental configuration flag without a repeatable benefit. **It was removed.** An intermediate broader content-visibility rule caused automated footer contrast false readings; the final rule excludes the footer and dark quality section, and all final accessibility checks pass.

Final cross-language samples:

| Profile | Performance | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| French mobile, matched batch median | 95 | 2.832 s | 56 ms | 0.00064 |
| English mobile, one sample | 95 | 2.877 s | 56.5 ms | 0.00409 |
| Arabic mobile, initial sample | 89 | 3.421 s | 78 ms | 0.00356 |
| Arabic mobile, repeat 1 | 89 | 3.464 s | 71.5 ms | 0.00356 |
| Arabic mobile, repeat 2 | 94 | 2.910 s | 71 ms | 0.00356 |
| Arabic mobile, repeat 3 | 90 | 3.472 s | 62.5 ms | 0.00356 |
| French desktop, one sample | 100 | 0.675 s | 0 ms | 0.00030 |
| Arabic desktop, one sample | 100 | 0.729 s | 0 ms | 0.00161 |

All final Lighthouse samples score **100 accessibility / 100 best practices / 66 SEO**, with no warnings. SEO remains intentionally limited by draft `noindex` and robots protection.

Arabic mobile's four-sample median is **89.5 performance / 3.442 s LCP**. This is slower than the earlier milestone's single 95-point / 2.75 s sample and must not be reported as a performance pass. The font files and their total transfer are unchanged: Arabic downloads about **198 kB of fonts**, versus about 74 kB for French. Final diagnostics show less actual style/layout work than the earlier Arabic report, despite the slower simulated LCP. Font discovery, font-dependent layout, and simulated scheduling remain contributing costs; these measurements do not isolate a single proven cause for the difference. Further font-delivery work requires careful validation to preserve the approved typography; no unverified font-loading workaround was retained.

**The ≤2.5 s mobile LCP target remains unmet in all measured languages.** French variability improved in this batch, but cannot be claimed eliminated. Field INP, hosting/CDN behavior, physical phones, Safari, Firefox, and manual screen-reader behavior were not measured.

Raw evidence:

- [Baseline French series](qa/refinement/before/performance-summary-fr-mobile.json)
- [Final French series](qa/refinement/final/performance-summary-fr-mobile.json)
- [Matched median comparison](qa/refinement/comparison.json)
- [Final French/Arabic desktop and mobile checks](qa/refinement/final/performance-summary.json)
- [Final Arabic repeats](qa/refinement/final/performance-summary-ar-mobile.json)
- [English mobile](qa/refinement/final/performance-summary-en-mobile.json)
- [French Lighthouse report](qa/refinement/final/lighthouse-fr-mobile-check-2.html)
- [Arabic Lighthouse report](qa/refinement/final/lighthouse-ar-mobile-check-2.html)

## Updated screenshots

All requested widths have screenshots in every language. These use 900 px viewport height; existing device screenshots in `qa/` also include the 390 × 664 mobile profile and the 1536 × 1024 desktop profile.

| Width | French | English | Arabic |
| --- | --- | --- | --- |
| 320 | [View](qa/refinement/home-fr-320.png) | [View](qa/refinement/home-en-320.png) | [View](qa/refinement/home-ar-320.png) |
| 390 | [View](qa/refinement/home-fr-390.png) | [View](qa/refinement/home-en-390.png) | [View](qa/refinement/home-ar-390.png) |
| 430 | [View](qa/refinement/home-fr-430.png) | [View](qa/refinement/home-en-430.png) | [View](qa/refinement/home-ar-430.png) |
| 768 | [View](qa/refinement/home-fr-768.png) | [View](qa/refinement/home-en-768.png) | [View](qa/refinement/home-ar-768.png) |
| 1536 | [View](qa/refinement/home-fr-1536.png) | [View](qa/refinement/home-en-1536.png) | [View](qa/refinement/home-ar-1536.png) |

Full-page screenshots: [French desktop](qa/refinement/home-fr-1536-full.png), [French mobile](qa/refinement/home-fr-390-full.png), [English mobile](qa/refinement/home-en-390-full.png), [Arabic mobile](qa/refinement/home-ar-390-full.png).

For full-page capture only, Playwright forces deferred sections to paint after testing ordinary scrolling. This prevents Chromium's screenshot mechanism from leaving offscreen auto-rendered sections blank; viewport captures use the normal production rendering behavior.

## Approval boundary

The focused refinement pass is complete. Mobile LCP and the slower Arabic lab samples remain documented performance issues. Original company assets and physical-device validation are still pending as previously recorded. No Milestone 2 work or deployment has been performed. Awaiting approval before continuing.
