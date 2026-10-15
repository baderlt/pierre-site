# TIME STONE — premium homepage design proposal

14 October 2026. **Design review only. No application code, settings, database or deployment changed.** M7 verification, M8 and M9 remain postponed. The accompanying static boards are visual concepts, not functional forms or accurate maps.

## 1. Verified current issues

Inspected the actual homepage renderer, SSR loader, CMS adapters, styles, quotation page/component/validation/proxy and Laravel submission/controller/request/middleware. Compared the existing desktop screenshot and read the local public home/site API.

- The CMS hero CTA says “Demander un devis”, but its destination is empty. `HomePage` falls back to `#collection`: label and destination disagree.
- The collection heading action leads to `#materials`, rather than the full catalogue. Category cards already have useful localized filter URLs; preserve these.
- The final contact section displays a status message without a link or form, even though the CMS section already contains `/fr/quote`.
- “Du bloc à l’espace” is a text column beside four text rows, with an 80 px desktop gap and no process imagery. It cannot communicate the material progression visually.
- Several separate quarry/introduction/quality sections repeat editorial ideas before the visitor reaches an actionable enquiry. Combine their presentation carefully while retaining useful approved copy and imagery; do not discard CMS records.
- Current home data contains categories and the first three published catalogue products, not a dedicated editorial featured-product flag. Do not pretend these were manually curated.
- Public contact settings currently expose only `taza` as the address, with no map URL or coordinates. The owner clarified that this is a **magasin** and requested an admin location option. This does not establish an exact street address or pin.
- Homepage mobile LCP was above target in M7. Additional UI should avoid competing with the hero; those prior measurements are historical, not new measurements of this proposal.

## 2. Recommended section order

| Order | Section | Purpose and destination |
| --- | --- | --- |
| 1 | Existing navigation + refined hero | Preserve the quarry/stone image and serif headline. Primary “Explorer nos collections” → `/{locale}/products`; secondary “Parlons de votre projet” → `#contact`. Retain the material preview as a quieter control, not a third competing primary button. |
| 2 | Compact material introduction strip | Retain useful approved descriptors; avoid making unsupported company promises or adding statistics. |
| 3 | Collections discovery | Architectural image grid using published categories, then three existing published product cards. Category → real catalogue filter; product → existing detail route; “Voir toute la collection” → catalogue. |
| 4 | Savoir-faire — Du bloc à l’espace | Combine the quarry and process story into an image-led editorial section with four numbered stages. Retain approved company introduction text here where appropriate, with an About link. |
| 5 | Architectural applications | Retain existing published application links and imagery, with illustrative labels where needed. |
| 6 | Votre projet commence ici — functional quotation | Replace the final placeholder with the existing quotation workflow in an editorial split layout, subject to approval for homepage use. Fold useful existing project-question copy into its introduction. Preserve `id="contact"` for navigation. |
| 7 | Le magasin — location | Lightweight architectural depth illustration + factual address card and directions link, only after owner-supplied location is approved. No invented business hours or showroom claims. |
| 8 | Existing footer | Preserve multilingual destinations, factual/illustrative notices and approved identity. |

The static boards concentrate on the changed sections; their slim applications band is a layout marker for the retained application gallery, not a proposed removal of its cards. Section headings and CTA wording are proposed FR/EN/AR editorial copy requiring design approval.

## 3. Desktop concept

Use the existing navy, limestone canvas, gold and local Noto serif/sans families. Keep the hero composition recognizable: text at the leading edge, a large uninterrupted stone image at the trailing edge, restrained scrim, no carousel or video. At 1536 px, use an approximately 1280 px content width; fluid margins and readable text replace oversized blank areas.

Collections: a larger leading category image balanced by two smaller categories, then a compact row for the remaining published categories. Three product cards sit below with clear detail links. Category count controls the layout; no fabricated collection cards or empty grid cells. At 768–1023 px, use balanced two-column grids instead of forcing the desktop collage.

Savoir-faire: a roughly 55/45 image/text split. One substantial existing process image plus a smaller stone-detail inset; four numbered rows alongside it. A small “Détail de matière” image enlargement may reuse the existing accessible gallery pattern. Avoid inventing documentary manufacturing proof from illustrative photos. Desktop hover/focus can accent a stage line; content and images remain understandable without hover. No automatically cycling imagery.

Quotation: navy editorial panel on the leading side, with limestone image, serif introduction and a live selected-product summary when applicable. Warm light form surface on the trailing side, with full-width fields or paired fields where readable. Group the existing fields under “Votre sélection”, “Vos coordonnées”, “Votre projet”. Gold submit action, clear consent, inline errors, focusable error summary, pending state and reference confirmation. The editorial panel ends naturally; it does not stretch an image to match an arbitrarily tall form.

Location: approximately 60/40 architectural plane and address card. CSS perspective, stone-like planes, thin gold edges and soft fixed shadows create depth. Geographic information is confined to the factual address/link. With a verified location, the gold marker signifies the magasin; it is **not plotted onto an invented street network**.

## 4. Mobile and Arabic concepts

- At 320/390/430 px: preserve a generous visible stone area in the hero; concise headline wrapping and two vertically stacked 44–48 px actions. Do not put the new form into the hero.
- Collections become a two-column grid at normal mobile widths, one column where names or 320 px space require it. All cards remain visible; no swipe-only carousel.
- Process imagery precedes four compact numbered steps. Use stable image aspect ratios and 20–24 px side gutters; no floating inset that hides text.
- Quotation introduction → compact selection summary → the single complete form. Inputs at least 16 px text, full width on narrow screens, explicit labels, optional phone label, readable errors. Product dimensions/quantity appear only when a product is selected, as in the existing form. No multistep wizard, modal form or second submit path.
- Location information and its full-width directions action precede a shallow architectural visual on mobile. No pointer-tilt interaction, panning trap or fixed panel obstructing the form.
- FR/EN/AR share one DOM per form. Arabic uses existing Arabic fonts, RTL reading order and logical spacing; email/phone/numeric configuration/reference remain LTR where appropriate. Do not mirror photographs or geographic information. Arabic action text must fit without clipping.
- Subtle transitions approximately 160–220 ms on hover/focus only. Reduced motion disables transforms/transitions; static depth is sufficient. Decorative illustration is hidden from assistive technology; address and directions remain ordinary readable content and links.

Proposed hero labels: **Explorer nos collections / Explore our collections / استكشف مجموعاتنا**. Secondary: **Parlons de votre projet / Tell us about your project / لنتحدث عن مشروعك**. Directions: **Itinéraire / Get directions / الاتجاهات**.

## 5. Location technical approach and admin option

**Recommend CSS perspective, with no embedded map provider.** No Three.js, map SDK, API key, tile download, geolocation permission or provider subscription is needed for the decorative plane. Opening directions deliberately navigates to Google Maps; the browser then contacts Google under its policies. An external link is not an embedded map and no provider request is needed before the visitor activates it.

Smallest proposed admin extension:

1. Reuse Site Settings’ existing `address`, phone/email and `contacts_visible` approval control.
2. Add one nullable **Google Maps location / directions URL** field, with explanatory text asking the owner for the exact magasin pin. Validate HTTPS, approved Google Maps hosts/paths and no embedded credentials; do not fetch arbitrary pasted URLs from the server. Do not auto-geocode `taza` or assume coordinates.
3. Expose the URL through the existing public site DTO **only when contacts are approved for visibility**; keep the private settings protected by their existing policy.
4. Show a factual address and active “Itinéraire” only when the exact supplied URL has been reviewed and the approved location is available. Until then, hide the public location module. The design board explicitly shows its pending state for review; an inaccurate marker or disabled pretend directions button will not ship.

A nullable additive migration would be required after approval; no current records need a bulk update. No latitude/longitude fields are necessary for this decorative approach. If a true interactive map is later requested, its actual provider, billing, privacy/consent requirements, lazy activation and accessible static fallback need a separate decision; no cost estimate is invented here.

## 6. Quotation reuse strategy and protections

`QuotationForm` is already shared-capable through props, but currently owns both its form and the page-specific summary layout. Add a small optional presentation prop (default `page`, new `home`) to change the wrapper/summary composition. Keep state, request construction and submission logic in **the same component**, not a copied homepage form or new transport hook/service. Dedicated Devis keeps its default presentation and product/configuration URL handling.

Reuse `getQuotationCopy`, country display names, product option adapters and geometry defaults. Homepage initially accepts a general enquiry; existing catalogue search and on-selection product option loading provide real supported formats/finishes/dimensions. Do not bulk-fetch every product’s configuration just to render the homepage.

Verified existing behavior to preserve:

- Client/server validation, accepted privacy acknowledgement, optional phone, allowed countries/units/dimension limits, product publication/finish/format/custom-dimension checks and immutable snapshots.
- Same-origin `/api/quotations` → existing Laravel endpoints, private proxy credentials/IP handling, bounded JSON/body/deadlines, encrypted challenge and honeypot, rate limits and Retry-After.
- One UUID idempotency key per mounted form; double-click lock; unchanged payload on uncertain retry; same reference for exact retry; conflict rejection. No local/session storage of customer data.
- Busy/confirmed/uncertain field locking, accessible error summary and success focus, explicit “not confirmed” recovery, backend-returned reference before displaying success, no pre-hydration PII in URL and honest no-JavaScript behavior.
- The existing form makes challenge/catalogue reads on mount. Prefer a one-time lazy mount near the lower section, with a server-rendered heading/image/reserved frame and permanent link to Devis. Never unmount on scrolling away or switch form implementations at breakpoints. Preserve all typed input, basket and idempotency state.

Homepage public use requires the design approval to explicitly include this live form. It will retain the existing honest privacy notice; the final production policy/retention text remains owner approval work. No fabricated privacy page or production launch approval follows from this proposal.

## 7. Performance implications and verification after approval

No promised LCP improvement or new benchmark: only inspection/design work has run. Use the same high-quality CMS WebP pipeline, responsive derivatives and hero priority. Below-fold collections/process/form imagery should use existing deferred loading with fixed aspect ratios; no new font families, large scene, video or animation library. CSS location depth adds negligible script; quote interaction adds a real client island, so isolate/lazy-load it instead of making the homepage a client component.

Reuse request-deduplicated `getSite` and the existing published catalogue/category/application reads. Do not introduce a serial homepage API chain, persist extra content caches or bypass publication/media checks. Avoid eagerly mounting quotation challenge/search effects during the hero’s critical path. Do not alter security to improve a score.

After design approval: targeted homepage/quote tests first; FR/EN/AR visual/layout checks at 320/390/430/768/1024/1536, keyboard/RTL/reduced-motion/no-JS behavior, new location admin validation/visibility tests, actual duplicate/uncertain-response quote regression using isolated fixtures, TypeScript and production build. Measure before/after mobile homepage with documented comparable cache/runtime settings and at least three samples per FR/AR page. Run relevant existing engine checks only if 3D code or integration dependencies change; no need to repeat unrelated long milestone verification for a CSS-only section change.

## 8. Likely implementation files — not changed yet

| Area | Likely files |
| --- | --- |
| Homepage | `apps/web/src/components/home-page.tsx`, `apps/web/src/app/[locale]/page.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/lib/home-content.ts`, `apps/web/src/lib/content-data.ts` |
| Shared quotation presentation | `apps/web/src/components/quotation-form.tsx`, relevant quotation styles in `apps/web/src/app/public.css`; small homepage lazy-wrapper only if needed |
| Location | Small `home-location.tsx` server component if needed; `apps/web/src/lib/api.ts` site DTO; `apps/api/app/Models/SiteSetting.php`, `apps/api/app/Filament/AdminSchemas.php`, settings validation in `apps/api/app/Domain/ContentWriter.php`, site response in `PublicCatalogueController.php`; one additive nullable-field migration |
| Verification | `tests/homepage.spec.ts`, relevant quotation/public page tests, focused backend site-settings validation/visibility test |

No new quotation endpoint, backend quotation system, 3D engine, dependency or deployment change is proposed. Existing CMS content is reused, and any content/section-order edits require approval; no business record has been modified.

## Review boards and approval boundary

- [Desktop design concept](design/homepage-desktop.png)
- [French mobile design concept](design/homepage-mobile.png)
- [Arabic mobile composition](design/homepage-mobile-ar.png)
- [Static visual source](design/homepage-proposal.html)

Boards use existing illustrative assets and the existing local fonts. They illustrate hierarchy and material direction, not final product data, company claims, a working quote submission or verified geography. The Arabic board focuses on mirrored layout/typography; complete translated form/error/privacy copy will come from the existing translations during implementation.

**Await explicit design approval before implementation.** Approval should cover the section order, editorial form presentation/live homepage use and admin magasin-location field. Exact location can be added later by the owner; the public module stays hidden until approved data exists. No deployment or M8/M9 is authorized.
