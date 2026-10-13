# Milestone 5 — Laravel backend, MySQL, Filament and read-only API

Implemented locally on 12 October 2026. Milestone 5 only. Next.js still uses the approved fixtures; public quotation submission, messaging, deployment and Milestone 6 have not started.

## Delivered

`apps/api` runs Laravel 13.35.0, Filament 5.10.1 and Livewire 4.4.7 on PHP 8.3.6, Composer 2.8.2 and MySQL 8.3.0. Stable package compatibility was checked against the installed Composer constraints, [Laravel release requirements](https://laravel.com/docs/13.x/releases) and [Filament installation requirements](https://filamentphp.com/docs/5.x/introduction/installation). The exact backend dependencies are locked in `apps/api/composer.lock`; unrelated frontend dependencies were unchanged.

- InnoDB migrations, restrictive references, unique translation/slug/pivot keys, publication/filter indexes and database CHECK constraints for dimensions, configuration version/PBR/UV bounds and quotation quantities. The local WAMP default was MyISAM; Laravel explicitly selects InnoDB without changing MySQL globally or touching other project databases.
- Dedicated FR/EN/AR translation tables, French fallback and shared stable route slugs. Product/category/material/finish/format/color management; commercial finishes remain distinct from simulated finishes. Brushed has no supported 3D simulation.
- Product creation/editing, gallery/main-image/texture upload or library reuse, material/category/options, individual allowed formats and their defaults, ordering, featured state, draft/publish controls, SEO and saved-information preview. Publication requires main image and texture. The structured 3D editor validates geometry, dimensions (0.5–500 cm), supported finish/format combinations, schema version 1, scale (0.25–4), rotation (0–360), PBR values (0–1), preset and illustrative/verified dimension flags. Normal configuration requires no JSON editing.
- Media originals remain private; server validation checks actual MIME, image decoding, bytes, dimensions/pixels and decoding memory before GD processing. Generated UUID filenames and re-encoded WebP derivatives prevent uploaded path/script execution. 320/1200/2048 px variants do not upscale. Replacement keeps media IDs/references; referenced files cannot be deleted. Storage/encoding failures cannot create a ready record, and failed transactions clean up generated uploads. Temporary-file cleanup and an opt-in orphan-library dry-run command are available.
- Editable applications with localized text, hero/gallery media, related products, publication/order and SEO. Typed page/section management covers home, about, applications, contact, quote introduction, shared navigation/footer and CTAs. Existing M4 copy is imported into development fixtures without inventing company facts. Contact values are blank; public visibility is explicitly controlled.
- Filament dashboard shows database counts, recent content/quotation activity and shortcuts. Warm neutral surfaces, charcoal identity, restrained gold, locally served fonts/avatar, accessible image links and reduced-motion CSS. Translation tabs include RTL Arabic fields. Core panel chrome is French; custom schema labels/help currently use English.
- Active-account access checks, hashed passwords, native rate-limited login/logout, session regeneration, CSRF and policies for every resource. Production forces secure HttpOnly cookies. Content Managers cannot manage users/settings or elevate privileges. Super Admin cannot disable/demote the last active Super Admin. CLI provisioning uses hidden password/confirmation prompts; there is no shipped password or public registration.
- Private quotation schema supports multiple immutable snapshots, customer/delivery/privacy/submission fields, assignment, private notes and transactional status history. Nullable live product references preserve snapshots after deletion. The admin can list/search/filter/review/update status/notes; quotation creation/deletion is unavailable through the admin. No public quote endpoint, email or WhatsApp transmission exists.
- Published-only versioned read endpoints for catalogue/details, definitions, applications, structured pages and safe website settings. Bounded validated filters/sorts/pagination, eager loading, no detail-only JSON/config/gallery loading in card listings, five-minute server cache and after-commit invalidation. Draft records/images and private notes remain unavailable publicly. Master visibility is checked before cache access. Backend and frontend indexing safeguards remain enabled.

## Architecture and boundaries

Domain writes/validation live in `app/Domain`; models/relationships in `app/Models`; policy checks in `app/Policies`; Filament schemas/resources/pages/widgets in `app/Filament`; read requests/controllers/resources in `app/Http`. Multi-table writes are transactional. No generic HTML page builder, extra public write API, Redis dependency, stock/pricing/review system or verified-project portfolio was introduced.

The current frontend has one saved procedural configuration per product. The backend stores that single versioned default plus per-product format dimensions; it does not duplicate PBR settings per format. Conventional `product_finish`/`product_color` pivots and reusable global `formats` refine the proposed M0 table names. The full DTO/identifier/media mapping is documented in [API contracts](backend-api.md). Public-site integration remains M6 work.

GLB uploads and uploaded-model references are disabled pending a bounded structural validator. The admin configuration editor works, and the saved-information preview is real; there is no simulated live 3D preview. An authenticated integration with the existing Next viewer is deferred to M6. `prototype/` and the integrated viewer engine were not changed.

## Verification

| Check | Executed result |
| --- | --- |
| Laravel startup / MySQL migrations / demo seed | Passed against isolated `time_stone`; all tables use InnoDB |
| Backend automated suite | **33 passed, 170 assertions**, zero failures/skips; real isolated MySQL `time_stone_test`; 51.39 s |
| Secure administrator provisioning | **1 additional targeted test passed, 6 assertions**; hidden prompts, active Super Admin role and hashed password |
| Final listing-query change | **4 targeted regressions passed, 46 assertions** after the full suite; filters/sorts/pagination, private-field/query budget, product details, structured application/page reads |
| Filament browser | Passed login, product create/edit, FR/EN/AR tabs, Arabic direction, main image/texture uploads, dimensions/UV settings, publish/API round trip, quotation snapshots/status/private notes, media library, real HTTP CSRF rejection (419) and logout |
| Admin responsive matrix | Dashboard and product editor: **320, 390, 430, 768, 1024, 1536 px**, no horizontal overflow |
| Admin accessibility | axe WCAG A/AA: **zero violations** on dashboard, editor, quotation and media library; no browser errors or external asset requests |
| Public API smoke | **33 HTTP checks passed**: 11 route areas × FR/EN/AR; all returned JSON 200 with the requested locale and no private notes |
| Next production build | Passed with Next.js 16.4.0; 33 prerendered pages plus existing dynamic routes |
| Existing frontend Playwright | **82 passed, 20 intentional skips**, zero failures/flaky cases; 4.7 min; existing multilingual viewport, accessibility, navigation, demo-quote and WebGL regressions |
| Existing 3D unit regressions | **8 passed**; integrated engine/image pipeline remains identical to the original prototype |
| Composer | Strict validation, installed platform requirements and dependency advisory checks passed; no reported security advisories |
| Laravel source formatting | Pint passed for `app database routes tests bootstrap config` |

Evidence: [backend JUnit](qa/milestone-5/backend-junit.xml), [secure provisioning](qa/milestone-5/provisioning-junit.xml), [final API regressions](qa/milestone-5/api-final-junit.xml), [browser and accessibility results](qa/milestone-5/admin-browser-results.json), [frontend regression results](qa/milestone-5/frontend-regression.json), [cleanup verification](qa/milestone-5/cleanup.json).

The tests also exercise incorrect/inactive login, throttling, unauthorized writes, role escalation and last-admin protection; translation/options/dimension rejection; publication rollback; published/draft/inactive-parent visibility; locale fallback/unknown slugs/invalid parameters; media MIME/size/GLB/SVG/spoof rejection, replacement/shared deletion and private-original access; immutable quotation snapshots and audited status changes; absence of public submission. A repeated admin save no longer reimports temporary uploads.

The initial end-to-end evidence runs exposed missing French accessibility labels, low-contrast badges, unnamed thumbnail links, screenshots captured before lazy dashboard widgets rendered, and a conservative decoder estimate that reserved a full-size derivative for tiny images. These were corrected and the relevant tests/scans rerun. Upload browser checks now wait for both actual French completion labels; dashboard counts/activity render immediately. No unresolved test failure is presented as a pass.

## Measurements

These are local laboratory measurements, not field data or production capacity guarantees.

The catalogue originally loaded product-detail relationships and used 35 cold-path SQL queries with database cache/throttling. Card-only eager loading reduced the measured first cold path to **24 queries**, including first-request initialization. The subsequent cold 48-per-page request returned all 18 retained samples with **20 queries**; warm public responses used **9 queries** with the database cache/throttle/master-visibility check. Product detail measured 29 cold/9 warm; materials and About content 15 cold/9 warm. The paths remain bounded rather than adding queries per product. Cold card responses were 5,677 bytes for 12 products and 8,302 bytes for 18. Timings in [query measurements](qa/milestone-5/backend-query-measurements.json) include local CLI/framework and concurrent QA effects; they are not PHP-FPM HTTP throughput or a representative-volume EXPLAIN analysis.

Fresh representative mobile Lighthouse 13.5 runs on the unchanged production frontend:

| Homepage | Performance | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| French | 95 | **2.895 s** | 65.5 ms | 0.00064 | 311.4 kB |
| Arabic | 89 | **3.466 s** | 69.5 ms | 0.00356 | 435.6 kB |

Accessibility and Best Practices scored 100 for both. SEO remains 66 because the development site is intentionally not indexable. Reports are in [homepage performance evidence](qa/milestone-5/home-performance/). Both LCP measurements remain above the 2.5-second target, especially Arabic; no image-quality/design change was made to chase a score. One local run per language does not establish field p75 or remove known variability.

## Screenshots

Screenshots use a clearly labelled temporary QA account and synthetic quotation. Counts reflect actual database rows at capture time, including temporary browser products; they are not company statistics. Cleanup subsequently removed eight browser products, the synthetic quotation and QA administrator. The retained database contains 18 illustrative products, zero quotations and zero QA users/products. Provision your own administrator through the documented CLI.

- [Desktop dashboard](qa/milestone-5/dashboard-1536.png) · [Mobile dashboard](qa/milestone-5/dashboard-390.png)
- [Desktop product editor](qa/milestone-5/product-editor-1536.png) · [Mobile product editor](qa/milestone-5/product-editor-390.png)
- [Quotation management](qa/milestone-5/quotation-1536.png) · [Media library](qa/milestone-5/media-library-1536.png)

## Running and remaining limits

See [local setup](backend-local-setup.md). From `apps/api`, configure the ignored environment, migrate/seed, run `php artisan time-stone:admin your-email --name="Your name"`, then `php artisan serve --host=127.0.0.1 --port=8000`. Open [local administration](http://127.0.0.1:8000/admin). The existing frontend starts independently with `npm run dev` from the repository root.

Live authenticated 3D preview, GLB validation, verified technical-specification workflow and real business/contact content remain limited as stated above. Source replacements are retained privately; the owner must approve retention and enquiry privacy policies before production. Current bounded image processing is synchronous; no expensive media queue or notification job is dispatched. A simple database worker is documented for future queued tasks.

Ubuntu/Nginx/PHP-FPM/HTTPS configuration, production secure-cookie behavior, deployment, representative-volume query plans/load tests, backup/restore and S3 migration were **not executed**. [VPS preparation](backend-vps-preparation.md) is guidance only. Automated accessibility scans do not replace a manual assistive-technology audit. The repository has no Git history; no commit/PR or Git diff verification is claimed.

## File inventory

The complete source/evidence inventory is [milestone-5-files.txt](qa/milestone-5/milestone-5-files.txt). New backend files include the Laravel scaffold/lock/environment example; domain models/translations/migrations/factories/seeders; policies and secure CLI commands; Filament forms/resources/pages/widgets/branding/local avatar; API requests/controllers/resource/routes; backend tests and localized accessibility labels. New root scripts are `admin-qa.mjs`, `export-backend-fixtures.cjs`, and `measure-backend.php`. New documentation comprises this report, backend setup/API/VPS notes and the backend readme. Existing root `.gitignore` and `README.md` were updated. Existing frontend tests regenerated their usual QA artifacts; frontend source and prototype files were unchanged. Credentials, runtime/cache/vendor files and private media are excluded from the source inventory.

**Stop after Milestone 5. Wait for explicit approval before Milestone 6.**
