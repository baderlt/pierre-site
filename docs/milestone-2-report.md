# Milestone 2 — Product Catalogue

Implemented locally on 12 October 2026. Milestone 3 has not started; no site has been deployed.

## Implementation and reference fidelity

The catalogue is available at `/fr/products`, `/en/products`, and `/ar/products`. It uses the approved Next App Router architecture and the original composite desktop/mobile catalogue reference: quarry hero, charcoal and warm stone palette, gold accents, serif headings, desktop sidebar, horizontal category chips, three-column desktop cards, two-column mobile cards, custom-project band and process imagery. French remains the default through the existing home redirect; Arabic uses full RTL including drawer position, cards, controls, and navigation.

Seven additional reference crops were prepared with source coordinates recorded in `apps/web/public/images/provenance.json`. Image interiors exclude the artwork's heart icons and embedded titles. The imagery is visibly provisional. Crops from raster mockups have limited resolution, particularly the quarry banner; final photography is required for production sharpness. No original photographs were invented, and image quality was not reduced to improve Lighthouse scores.

The sidebar/drawer uses labeled native selects rather than pretending to offer unverified stock or commercial availability. Wishlist hearts, ratings, stock badges and popularity sorting are omitted. Product cards link to a server-rendered **illustrative visual study within this catalogue**, retaining filters and pagination. Those studies explicitly disclaim verified products, finishes, dimensions and technical performance. They are not product detail pages; a future real detail route remains outside this milestone. Unknown sample identifiers return 404. Header, home, project-contact, category, sample-return and pagination destinations are real routes or sections.

## State, data and rendering

`apps/web/src/lib/catalogue.ts` provides typed query, card DTO and paginated response contracts behind async `getCatalogue()`. The fixture implementation will be replaced by the planned Laravel `GET /api/v1/products` adapter in M6. It returns only one page of results; the browser does not receive the fixture dataset. There are 18 illustrative samples across five categories, with repeated reference images and stable sample IDs. Category counts describe this temporary dataset, not company inventory. Finish/use associations are clearly hypothetical.

URL parameters are `q`, `category`, `stone_type`, `finish`, `color`, `application`, `sort`, and `page`. Different filter groups combine with AND, with one value per group. Values use stable untranslated keys. Unknown keys/values are ignored, repeated scalar values are rejected, search is trimmed and capped at 100 characters, and page values are validated and bounded to the available results. Supported sorting is featured, latest fixture samples, name ascending and name descending; no sales popularity or real launch dates are claimed.

Native GET forms and ordinary links keep filtering, search, sorting and pagination functional with server-rendered HTML, refresh, sharing and browser history. Changing a filter/search/sort resets pagination. Pagination uses 12 results per page. Category chips and sorting preserve other selections. Selected facets have removal links. The language selector preserves the catalogue route, query and fragment. Mobile uses a native modal drawer with Apply/Clear actions, Escape/backdrop close, focus containment and focus restoration. Closing without Apply does not change the URL; unsaved choices remain in the open page's form until navigation or Clear. A noscript filter form supports mobile filtering without JavaScript.

Only the existing header and a small mobile-drawer component are client components. Cards, forms, filtering, sorting, sample studies and pagination render on the server. Images use Next's optimized responsive image delivery, with the hero preloaded and lower imagery lazy loaded. Fonts remain self-hosted. Existing reduced-motion rules apply; no animations or dependencies were added. Localized title/description and optional real-origin canonical/hreflang metadata are provided. Draft `noindex`, response headers and robots protection remain intentional until content and publication approval.

## Build and browser verification

The final production build passed on Node 24.19.0 / Next 16.4.0: compilation 1.21 s, TypeScript 2.6 s, static home generation 1.08 s. Localized homepages remain static; catalogue pages render on demand for their URL state.

Verification includes all three languages at **320, 390, 430, 768, 1024, and 1536 px**, plus existing homepage width checks. Tests cover SSR content, image decoding, horizontal overflow, category result counts, search and empty states, sorting, AND filtering and input normalization, pagination, reload/back/forward, locale query preservation, sample studies, mobile Apply/Clear, Escape and focus, JavaScript-disabled native forms, homepage regression, and automated WCAG A/AA scans.

An initial narrow-screen grid overflow was fixed using zero minimum widths on the results grid and search form. The homepage width-matrix timeout was extended to allow its full 21-combination screenshot run on this host; assertions were retained. Visual review also removed baked-in mockup heart graphics from the sample image crops.

The complete homepage/catalogue suite passed **53 tests, with 0 failures, 0 flaky tests and 7 intentional skips**, in 218.3 seconds. Skips avoid repeating the width/no-JavaScript checks across device projects, and omit the desktop mobile-menu test. All **18 automated axe WCAG A/AA scans** passed. These automated results are not a manual accessibility certification.

After the final Arabic pagination correction (`bdi dir="ltr"` around the page fraction), the entire catalogue suite passed again: **14 passed, 0 failures, 0 flaky tests, 4 intentional skips**, in 42.8 seconds. The final screenshot matrix was regenerated and verified in that run. Earlier source-crop revisions required clearing only the generated local Next image cache; source images and prototype files were preserved.

Evidence: [complete regression run](qa/milestone-2/regression-results.json), [final catalogue run](qa/milestone-2/catalogue-final-tests.json). No dependencies were added or upgraded.

## Measured mobile performance

Lighthouse 13.5.0 / Chromium 156 was run against the final local production build using default simulated mobile throttling. Browser regressions were finished before these measurements. French and Arabic use three consecutive samples each; English has one representative sample. Local server image caches were warm after screenshot QA. Lighthouse resets browser storage, but process/JIT and host scheduling can still influence repeated samples. These are lab results, not physical-device or field Core Web Vitals.

| Final catalogue mobile | Performance | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| French, median of 3 | 99 | 1.894 s | 65 ms | 0.00043 | 297 kB |
| English, 1 sample | 97 | 2.518 s | 49.5 ms | 0.00038 | 297 kB |
| Arabic, median of 3 | 94 | 2.726 s | 74 ms | 0.03570 | 422 kB |

All final catalogue samples, retained without selecting only the best result:

- French performance **96 / 99 / 100**, LCP **2.695 / 1.690 / 1.894 s**.
- English performance **97**, LCP **2.518 s**.
- Arabic performance **91 / 94 / 99**, LCP **3.115 / 2.726 / 1.743 s**.

All score **100 accessibility / 100 best practices / 66 SEO**, with no Lighthouse warnings. SEO is intentionally limited by draft `noindex` and robots rules. Arabic's greater font transfer and font-dependent layout remain material costs; CLS is below 0.1 but higher than French. The French median meets the 2.5 s LCP target in this batch, while one French sample, the English sample, and the Arabic median exceed it. These results do not establish a guaranteed performance score or resolve variability.

The earlier candidate batch is also retained under `qa/milestone-2/catalogue-performance/`; final-build measurements are under `catalogue-performance-final/`. No compression or image-resolution reduction was made in response to Lighthouse results.

Final raw reports and summaries:

- [French catalogue samples](qa/milestone-2/catalogue-performance-final/performance-summary-fr-mobile.json), [HTML report](qa/milestone-2/catalogue-performance-final/lighthouse-fr-mobile-check-3.html)
- [English catalogue sample](qa/milestone-2/catalogue-performance-final/performance-summary-en-mobile.json)
- [Arabic catalogue samples](qa/milestone-2/catalogue-performance-final/performance-summary-ar-mobile.json), [HTML report](qa/milestone-2/catalogue-performance-final/lighthouse-ar-mobile-check-2.html)

## Homepage LCP tracking

No homepage image-quality reduction or design change was made for this milestone. The shared header now connects the homepage to the catalogue.

| Homepage mobile | Performance median | LCP median | LCP range | TBT median |
| --- | ---: | ---: | ---: | ---: |
| French, 3 samples | 95 | 2.716 s | 2.638–2.893 s | 66.5 ms |
| Arabic, 3 samples | 94 | 2.942 s | 2.909–3.313 s | 67.5 ms |

French scores were **95 / 95 / 96** and Arabic **90 / 95 / 94**. All have 100 accessibility and best practices, 66 SEO, and no warnings. Homepage CLS was 0.00064 French and 0.00356 Arabic. Compared with the prior refinement pass, these snapshots vary but do not prove a causal improvement from catalogue work. **Both homepage mobile LCP targets remain unmet**, and Arabic remains the more expensive page. No field INP or physical-phone claims are made.

Evidence: [French homepage tracking](qa/milestone-2/homepage-performance/performance-summary-fr-mobile.json), [Arabic homepage tracking](qa/milestone-2/homepage-performance/performance-summary-ar-mobile.json). Desktop layouts were tested and captured; desktop Lighthouse was not repeated in this milestone.

## Screenshots

| Width | French | English | Arabic |
| --- | --- | --- | --- |
| 320 | [View](qa/milestone-2/catalogue-fr-320.png) | [View](qa/milestone-2/catalogue-en-320.png) | [View](qa/milestone-2/catalogue-ar-320.png) |
| 390 | [View](qa/milestone-2/catalogue-fr-390.png) | [View](qa/milestone-2/catalogue-en-390.png) | [View](qa/milestone-2/catalogue-ar-390.png) |
| 430 | [View](qa/milestone-2/catalogue-fr-430.png) | [View](qa/milestone-2/catalogue-en-430.png) | [View](qa/milestone-2/catalogue-ar-430.png) |
| 768 | [View](qa/milestone-2/catalogue-fr-768.png) | [View](qa/milestone-2/catalogue-en-768.png) | [View](qa/milestone-2/catalogue-ar-768.png) |
| 1024 | [View](qa/milestone-2/catalogue-fr-1024.png) | [View](qa/milestone-2/catalogue-en-1024.png) | [View](qa/milestone-2/catalogue-ar-1024.png) |
| 1536 | [View](qa/milestone-2/catalogue-fr-1536.png) | [View](qa/milestone-2/catalogue-en-1536.png) | [View](qa/milestone-2/catalogue-ar-1536.png) |

Full-page views: [French desktop](qa/milestone-2/catalogue-fr-1536-full.png), [French mobile](qa/milestone-2/catalogue-fr-390-full.png), [English mobile](qa/milestone-2/catalogue-en-390-full.png), [Arabic mobile](qa/milestone-2/catalogue-ar-390-full.png). Viewport screenshots use a 900 px height.

## Remaining boundaries

Real products, approved names, source imagery, verified finishes/specifications, API/admin integration, real product details and 3D remain pending their approved milestones. No stock availability, company history, ratings or technical claims are asserted. Physical phones, Safari/Firefox, manual screen-reader testing and field Core Web Vitals are unverified. The existing homepage mobile LCP issue remains tracked below. Awaiting explicit approval before Milestone 3.
