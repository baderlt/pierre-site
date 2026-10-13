# TIME STONE API v1 — published content and quotation submission

Base: `/api/v1`. Published content uses GET/HEAD JSON; `/api/v1/quotation-requests` does not exist. Admin writes use authenticated Filament/Livewire and policies, without a duplicate admin REST API. Milestone 6 connects Next.js server adapters and the same-origin submission proxy. POST /api/v1/quotations is the single public write endpoint.

`locale=fr|en|ar` defaults to French. Each translated field falls back to French when its requested translation is empty. Responses include `locale: { requested, fallback: "fr" }`. Unsupported locales/invalid parameters return 422; missing, draft or disabled content returns 404. A disabled master site switch makes all public content endpoints return 404. No credentials, storage object keys, internal material notes, admin identities or quotation PII are serialized.

| GET path | Data |
| --- | --- |
| `/site` | Brand, controlled logo/favicon URLs, localized SEO and explicitly visible contacts; otherwise contacts are null |
| `/pages/{key}` | Published page title/SEO and visible ordered typed sections, escaped text fields, internal localized CTA destinations, controlled image URLs |
| `/categories` | Active category definitions and localized names/descriptions |
| `/materials` | Active `stone_types` definitions, classification, color/finish keys, controlled material texture URLs; no internal notes |
| `/finishes` | Active commercial definitions and nullable supported visual simulation |
| `/formats` | Active reusable definitions and slab/tile/block geometry |
| `/products` | Paginated published cards with eager-loaded option/media relationships, live category counts |
| `/products/{slug}` | Published details, media, allowed finishes/formats, dimensions, version 1 config and bounded PBR/preset fields |
| `/applications` | Paginated published applications, localized descriptions, gallery URLs, illustrative labels and SEO |
| `/applications/{slug}` | Application content plus paginated published related products |

## Catalogue query

`q` is at most 100 characters; `category`, `stone_type`, `finish`, `color`, `application` are stable slug keys, combined with AND. Unknown valid keys return empty results. `application=exterior` maps to `exterior-facades` to retain the existing fixture filter semantics. Search uses requested and French translations with bound parameters and escaped LIKE wildcards.

Sorting allowlist: `featured` (default; featured first, display order then ID), `newest` (publication time then ID), `name_asc`, `name_desc` (requested title with French fallback, then ID). `page` is a positive integer capped at 100000; `per_page` defaults to 12, maximum 48. Pagination returns `meta.current_page`, `last_page`, `per_page`, `total`, and `links.prev/next`; related-product pagination remains bounded.

Product card fields retain `id`, `name`, `category`, `stone_type`, scalar `finish`, `color`, `application`, `image`, `temporary`. Additional multi-option fields are `commercial_finishes`, `colors`, `applications`; scalar fields use the first active associated option. `categories` remains a slug-to-count map as in `CatalogueResponse`.

Details retain `images`, `texture`, `geometry_type`, `dimensions_cm`, `dimensions_verified`, `supported_finishes`, `formats`, `uploaded_model`, `saved_3d_configuration`, `verified_specifications`. `saved_3d_configuration` is `{version:1, shape, finish, width, height, thickness, scale, rotation}`. `material_parameters` contains roughness/metalness/bump strength (0–1) and `studio|neutral` preset. `uploaded_model` is always null while GLB ingestion is disabled; no unsupported model is treated as validated. No physical properties are invented; verified specifications remain empty until a separate provenance-backed workflow is approved.

## Adapter mapping for Milestone 6

- Laravel IDs are stable database IDs serialized as strings. `slug` is the shared localized route key. Next's temporary fixture IDs currently double as slugs; future adapters must use the API slug for route destinations and database IDs for relationships/quotation drafts.
- API media fields are complete controlled URLs rather than mockup image stems. The Next image adapter will consume these URLs and an approved backend image origin in M6; this origin is not enabled now.
- Current UI card facet strings are preserved; the API additionally supplies all associated options. Category counts retain the existing map shape. Localized labels come from definition endpoints rather than hard-coded fixture labels.
- Format records have real definition IDs and per-product default dimensions/verification/custom-size flags. Commercial finish keys/IDs remain distinct from simulation enums: brushed has no simulation. Future quotation validation must resolve allowed IDs server-side and snapshot names/configuration; neither fixture IDs nor browser labels are trusted specifications.
- Structured pages/sections expose stable keys/types and explicit text/image/link fields. M6 maps these to the approved components; this is not arbitrary HTML or a generic page builder.
- One default version 1 3D configuration is stored per product, with individual format defaults on `product_formats`. This follows the current frontend's single saved configuration rather than duplicating one PBR configuration per format. GLB upload/model references need a structural-validation implementation before enabling.
- Laravel uses conventional `product_finish`, `product_color` pivots and reusable global `formats` plus dimension-bearing `product_formats`; these are documented refinements of M0's proposed table names. Materials retain the approved `stone_types` table. No unverified project portfolio is created.

## Privacy, publication and caching

Only published records with elapsed publication timestamps and active category/material parents appear. Unpublished application associations are filtered from product responses. Media originals remain private; derivative delivery checks active-admin access or a public reference. Public settings use an explicit allowlist and separate contact visibility switch.

Responses are cached server-side for five minutes with a content-version key changed after committed model/translation/configuration writes and deletes. Admin writes save parent records before relationship synchronization inside the same transaction, invalidating after commit. The master publication switch is checked before cache lookup. Public HTTP responses use revalidation (`max-age=0, must-revalidate`) with ETags so a reverse proxy does not retain stale publication state; admin responses are `private, no-store`. API throttle: 120 requests/minute/IP. All responses remain `X-Robots-Tag: noindex, nofollow` for this milestone.

Quotation requests/items/events are private administration only. Item snapshots are immutable through Eloquent and have nullable live product references with `SET NULL`; deleting/changing a product cannot rewrite saved snapshots. Status changes and operator IDs are recorded transactionally. No emails, WhatsApp messages or public submissions are triggered.


## Milestone 6 submission boundary

GET /api/v1/quotation-challenge returns a no-store encrypted, timestamped form challenge. POST /api/v1/quotations accepts JSON (64 KiB maximum), an Idempotency-Key UUID header, and the allowlisted body documented in [contract audit](milestone-6-contract-audit.md). A challenge must be 2 seconds to 2 hours old; the website honeypot must be empty. Default quotation rate is 5/minute/client identity.

Laravel independently normalizes and validates customer/delivery/privacy data and up to 20 items (zero means a general enquiry). It resolves real published product, active supported finish and format IDs, validates numeric bounds and custom-dimension permission, and transactionally stores authoritative immutable snapshots. Requested visual configuration is separate from commercial dimensions and must agree with the selected geometry/finish/dimensions. Brushed finishes retain null simulation. Custom or unverified dimensions require manufacturing confirmation.

201 returns only {reference, duplicate:false}; an exact retry returns 200 with the same reference and duplicate:true. Reusing a key for different normalized information returns 409. Invalid data is 422, payload overflow 413, unsupported media type 415, disallowed present Origin 403, abuse 429. Backend/network failures never imply success. API exceptions are sanitized and no-store. No public GET of quotations or quotation-requests exists. Status history and private notes remain authorized Filament operations. No messages are sent.

Product detail now includes localized image_alt, gallery alt, finish_options with database IDs/commercial slugs/nullable simulation, format IDs and localized names, allowed custom-dimension flags, and material/configuration metadata. Categories include controlled image URLs; /colors is an active-definition endpoint. Production excludes illustrative products/applications, including product application references. Returned media URLs name only thumb/preview/texture; private original paths remain absent.

Next exposes same-origin /api/quotations GET/POST as a transport boundary to these routes, /api/catalogue for bounded product search, /api/product-options/{slug} for quotation option loading, and /media/{id}/{variant} for approved derivatives. These do not create duplicate Laravel submission or administration APIs. Next forwards no browser cookies or admin credentials to the public API.
