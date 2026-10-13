# Milestone 4 — Applications, About, Contact & Quotation UI

Milestone 4 only. The Laravel backend and Milestone 5 administration have not been started.

## Implementation

- French, English and Arabic routes for Applications, About, Contact and Quotation. French remains the default and Arabic retains RTL, logical spacing and mirrored navigation arrows.
- Applications follows the supplied hero, six-category, four-gallery-card and dark CTA-band composition. Six application detail routes provide descriptive content, illustrative galleries, related product links and server-rendered pagination. Gallery dialogs support keyboard focus containment, Escape and focus restoration; image links remain usable without JavaScript.
- About follows the quarry hero, story/image/quality columns, transformation cards and architectural contact band. A factual qualification replaces unsupported statistics. Company history, facilities, capacity, certifications and completed-project claims remain unverified and are not fabricated.
- Contact presents typed, nullable phone, WhatsApp, email and location fields. Unconfigured phone, WhatsApp and email remain visibly pending; the location row is hidden until an address is confirmed. No invented contact destination or map is published.
- Quotation supports general enquiries or a selected illustrative product, format, finish, dimensions, quantity/unit, name/email, optional phone, delivery country/location, project description and privacy acknowledgement. Configuration from the product page and catalogue return parameters are preserved. Product selection updates the illustrative defaults, and edited dimensions/finish carry back to the product page.
- Client validation includes field-level messages, linked/focused error summary and a focused demonstration confirmation. The demonstration check explicitly states nothing was sent or saved; it is not a submission confirmation. No submission endpoint, fetch, browser storage, email or WhatsApp transmission is implemented. Personal inputs have no HTML name attributes, and the submission button stays disabled without JavaScript, preventing accidental native GET disclosure.
- Public contact/application fixtures and quotation draft/configuration contracts are typed for future Laravel integration. API-side validation, permissions and immutable quotation snapshots remain future backend work.
- Shared navigation now reaches the implemented pages. Existing homepage, catalogue and 3D rendering code were preserved; product quotation copy now describes the available demo interface. No dependencies or animations were added.

## Rendering and temporary assets

Applications, About and Contact are statically generated; application details and quotation are server-rendered. Client code is limited to shared navigation, gallery dialogs and quotation interaction. Country labels are generated on the server and serialized to avoid Node/browser locale-data hydration differences. Three.js stays behind explicit product-viewer activation.

Sixteen additional WebP crops come from the supplied mockups. Sources and crop coordinates are recorded in `apps/web/public/images/provenance.json` and reproducible using `scripts/prepare-assets.py`. These crops preserve the reference imagery but cannot provide the detail of original photography. All imagery and project associations are visibly illustrative. No image-quality reduction was introduced to chase performance scores.

## Verification

- Production build and TypeScript: passed with Node 24.19.0 / Next.js 16.4.0.
- Full Playwright regression: **82 passed, 20 intentionally skipped, 0 failed** across 102 cases. Skips avoid repeating the complete width matrix, no-JavaScript and selected WebGL checks in every device project. See [JSON results](qa/milestone-4/regression-results.json).
- New public-page matrix: **90 combinations** (five page types × three languages × six widths), with no horizontal overflow and all images decoded. Every application slug returns successfully in all languages; unknown slugs return 404. Related-product pagination is exercised.
- Automated axe WCAG A/AA scans passed on all five new page types and validated quotation state in French, English and Arabic on desktop, tablet and mobile. Existing homepage, catalogue, product and viewer accessibility regressions also passed. Automated scans do not replace a manual assistive-technology audit.
- Gallery Escape/focus restoration, form error-summary focus and field links, configuration/language preservation, disabled no-JavaScript submission, invalid input bounds, no POST submission, empty local/session storage and reload clearing were verified.
- Existing product/3D browser regressions passed, including PNG/GLB exports, rendering pause, failure fallback, formats/finishes and resource budgets. Standalone geometry/image/disposal suite: **8/8 passed**; original prototype pipelines remain byte-identical.
- Visually reviewed desktop Applications/About/Contact and mobile quotation/Arabic Applications screenshots. The initial 320 px English footer overflow and desktop category-label sizing were corrected before the final passing run.


## Performance measurements

Production server on loopback; Lighthouse 13.5.0 with Chromium and default simulated mobile throttling. Desktop uses the existing desktop preset. Browser regression tests had finished before these measurements. New-page rows are single representative samples; homepage rows report the median of two consecutive runs. Image optimizer caches were warm from layout QA; these are not cold-deployment or field measurements.

| Page | Locale / device | Runs | Performance | LCP median (s) | LCP range (s) | TBT median (ms) | CLS median |
| --- | --- | ---: | ---: | ---: | --- | ---: | ---: |
| applications | ar / mobile | 1 | 91 | 3.237 | 3.237–3.237 | 45 | 0.0043 |
| applications | fr / mobile | 1 | 95 | 2.824 | 2.824–2.824 | 32 | 0.0569 |
| about | fr / desktop | 1 | 100 | 0.582 | 0.582–0.582 | 0 | 0.0002 |
| contact | en / mobile | 1 | 96 | 2.669 | 2.669–2.669 | 63 | 0.0005 |
| quote | ar / mobile | 1 | 90 | 3.237 | 3.237–3.237 | 69 | 0.0066 |
| quote | fr / mobile | 1 | 96 | 2.767 | 2.767–2.767 | 41.5 | 0.0004 |
| home | ar / mobile | 2 | 89.5 | 3.436 | 3.409–3.463 | 48.25 | 0.0038 |
| home | fr / mobile | 2 | 95 | 2.827 | 2.825–2.830 | 33.75 | 0.0006 |

All ten runs scored accessibility **100** and best practices **100**, with no Lighthouse run warnings. SEO **66** reflects the intentionally blocked indexing/crawling of this temporary development site. Full HTML/JSON evidence and transfer sizes are in the corresponding `docs/qa/milestone-4/*-performance/` directories.

Mobile LCP remains above the 2.5-second target on the measured routes. Homepage French is approximately 2.83 s; Arabic ranges from 3.41 to 3.46 s. This remains open, not a claimed fix. Quotation LCP images are eager, discoverable in initial HTML and fetchpriority=high in both measured locales. Font transfer was 73,590 bytes for French and 197,654 bytes for Arabic; this is an observed cost, not proof of the entire LCP cause. Typography, imagery quality and the existing homepage layout were preserved. Real-origin latency, cold caches and physical mobile devices still require launch-stage measurement.

## Screenshots

`docs/qa/milestone-4/` contains screenshots for all three languages at 320, 390, 430, 768, 1024 and 1536 CSS px for Applications, About, Contact, Quotation and a representative application detail page. Full-page views are included at 390 and 1536 px.

- [Applications desktop](qa/milestone-4/applications-fr-1536-full.png)
- [Applications mobile Arabic](qa/milestone-4/applications-ar-390-full.png)
- [About desktop](qa/milestone-4/about-fr-1536-full.png)
- [About mobile](qa/milestone-4/about-fr-390-full.png)
- [Contact desktop](qa/milestone-4/contact-fr-1536-full.png)
- [Contact mobile](qa/milestone-4/contact-fr-390-full.png)
- [Quotation desktop](qa/milestone-4/quote-fr-1536-full.png)
- [Quotation mobile Arabic](qa/milestone-4/quote-ar-390-full.png)

## Known limitations and approval boundary

Real company copy, original photography, confirmed product specifications, contact channels, privacy policy and retention requirements still need approval before publication. Phone is optional in this demo; the live enquiry policy remains to be confirmed. Dimensions are bounded for illustrative geometry, not manufacturing availability. All development pages retain noindex/nofollow.

Browser testing uses Chromium desktop/tablet/mobile emulation; physical iOS/Android devices and real GPU memory are not measured. Lighthouse is a local laboratory measurement, not field Core Web Vitals. French and Arabic homepage mobile LCP remain tracked separately below.

Quotation success means client validation only. Real storage, submission, server validation, abuse prevention and notifications belong to Milestone 6. Stop here and await explicit approval before Milestone 5.

## Completion against the expanded Milestone 4 brief

The follow-up brief was checked against the already implemented pages and the M0 API proposal. The existing routes/components were retained. Additional work closes these gaps:

- Validate and retain URL quantity/unit values, reject out-of-range quantities and fractional piece quantities, and validate selected format membership against the typed product options.
- Provide a pure typed quotation-draft builder matching the proposed customer, delivery.country_code, project_details, items, privacy_acknowledged and website shape. General enquiries have an empty items array. Temporary format/finish keys need mapping to real Laravel IDs in M6; custom dimensions are explicitly flagged for review. The builder neither submits nor persists data.
- Use a localized ISO country selector with identical server/client labels. Hide the unconfigured location row.
- Present a compact product/configuration summary first on mobile, followed by the single-page form. On desktop, the summary remains beside the form and sticks below the header. Privacy information stays beside its acknowledgement within the form.
- Add a split quarry/materials editorial section and four illustrative selection/cutting/finishing/quality-review stages. Add explicitly illustrative stone-type associations to application details.
- Allow an isolated QA origin using QA_BASE_URL; the user’s existing port-3000 server is left running. The final checks use a separate production server at port 3001.

### Files created for Milestone 4

- `apps/web/src/lib/public-content.ts`, `apps/web/src/lib/quotation.ts`: typed localized fixtures, metadata, contact settings and quote contracts/validation.
- `apps/web/src/components/public-page.tsx`, `illustration-gallery.tsx`, `quotation-form.tsx`: shared page shell/heroes/CTA, accessible gallery and demo form.
- `apps/web/src/app/public.css`: scoped public-page responsive styling.
- `apps/web/src/app/[locale]/applications/page.tsx`, `applications/[slug]/page.tsx`, `about/page.tsx`, `contact/page.tsx`: localized public routes.
- `tests/public-pages.spec.ts`: public-page, validation, API-draft and responsive acceptance.
- `docs/milestone-4-report.md` and `docs/qa/milestone-4/`: report, screenshots and measured evidence.

### Existing files modified for Milestone 4

- `apps/web/src/app/[locale]/quote/page.tsx`: replace the earlier summary placeholder with the honest demo quotation interface.
- `apps/web/src/components/site-header.tsx`: implemented destinations and active page state.
- `apps/web/src/lib/product-copy.ts`: translated quotation-demo explanation.
- `scripts/prepare-assets.py`, `apps/web/public/images/provenance.json` and sixteen generated temporary WebP crops: approved reference media.
- `tests/homepage.spec.ts`, `tests/product.spec.ts`, `playwright.config.ts`, `scripts/performance.mjs`: updated destinations, demo-form regression and isolated production QA origin.
- `README.md`: current routes, run instructions and milestone boundary.

No dependency, backend, 3D-engine or global design-token changes were introduced.

## Final verification after the expanded brief

Production build including TypeScript passed. The final full suite passed **82 tests, 20 intentional skips, 0 failures and 0 flaky cases** in approximately 4.8 minutes. The 90-layout matrix and all locale/device accessibility checks passed. Standalone 3D tests passed **8/8**. The country-name hydration mismatch found during verification was corrected by serializing server-generated country labels; the final regression has no page errors. A QA-only fixed-port assertion was updated for the isolated origin.

These fresh Lighthouse 13.5.0 mobile samples were run sequentially against the production build on port 3001, after browser tests finished, using warm image caches. Each row is one lab sample, not a field measurement or a proven improvement. Earlier measurements above are retained as the pre-refinement baseline.

| Page | Locale | Performance | LCP (s) | CLS | TBT (ms) | Transfer (decimal kB) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| about | fr | 95 | 2.781 | 0.0008 | 48.5 | 288.9 |
| applications | fr | 95 | 2.835 | 0.0569 | 39 | 305.5 |
| contact | en | 96 | 2.658 | 0.0005 | 53 | 254.2 |
| home | ar | 89 | 3.463 | 0.0040 | 49.5 | 435.6 |
| home | fr | 95 | 2.830 | 0.0006 | 36 | 311.4 |
| quote | ar | 89 | 3.385 | 0.0003 | 71 | 404.9 |
| quote | fr | 95 | 2.901 | 0.0062 | 34.5 | 280.3 |

All seven final samples scored accessibility **100**, best practices **100** and SEO **66** (development indexing is deliberately disabled); no run warnings. Source HTML/JSON reports are in `docs/qa/milestone-4/final-*-performance/`. Arabic quotation LCP remains approximately 3.39 seconds, with homepage LCP approximately 2.83 seconds in French and 3.46 seconds in Arabic. These remain open; typography and source-image quality were preserved. The existing early-discovered, high-priority hero images and self-hosted font strategy remain in place.

Updated screenshots at all requested widths are in the same QA directory. Dedicated validation/error and demo-check screenshots are also provided. No request is delivered, stored or emailed. Verified company history, facilities, product/format/finish relationships, quantities/units policy, contact details, address, asset rights and an approved privacy/retention policy are still required before launch.

Milestone 4 only is complete. Milestone 5 has not been started.
