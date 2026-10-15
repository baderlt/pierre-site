# Milestone 7 — proposed production-readiness plan

14 October 2026. **Expanded plan approved for local implementation by the owner.** The findings below record the preceding Phase 1 inspection. VPS operations and launch remain separately gated. Implementation results belong to the M7 security, deployment, test and final reports.

## Scope decision required

The original [M0 roadmap](milestone-0-proposal.md), section 10, defines:

| Original milestone | Original scope | Proposed treatment under the new brief |
| --- | --- | --- |
| M7 — Locales/SEO/security | FR/EN/AR translation completeness, RTL/language switching, metadata/hreflang/sitemap, factual schema, privacy, accessibility and security | Retain these checks; expand security and operational readiness as requested. |
| M8 — Readiness | Production-mode performance, accessibility/browser/WebGL checks, measured optimization and release checklist | Include only the performance investigation and regression verification explicitly requested in this M7 brief. Do not declare or start M8. |
| M9 — Deployment | Reviewable Nginx/services/HTTPS/migration/backup/restore/rollback configuration, followed by separately authorized VPS work | Bring preparation of reviewable artifacts into M7. Actual VPS operations remain separately gated; do not perform or declare M9 deployment. |

**Approve this expanded M7 scope before implementation.** This is a change to the original milestone allocation, not permission to execute later milestones. Original privacy/translation requirements remain relevant; company/privacy copy must be owner-approved, not invented.

## Inspected baseline and architecture

Read the M0 proposal, M1 report and refinement report, M2–M5 reports, and all M6 reports/audits/setup notes, especially [M6 final performance](milestone-6-performance-final.md), [M6 final status](milestone-6-report.md) and [corrections](milestone-6-corrections.md). Earlier fixtures, counts, static-rendering descriptions and “no Git” statements are historical, not the current architecture.

- `apps/web`: Next.js App Router, React/TypeScript/Tailwind; dynamic localized SSR, French default, shared slugs, Arabic document RTL. Typed server-only adapters call Laravel, with request-local React deduplication and no persistent Next content cache. Quotation and media requests cross bounded same-origin Next handlers.
- `apps/api`: Laravel/Filament, MySQL authority, domain validation/policies/transactions. Database-backed content cache has a five-minute TTL, bounded fill locks, origin/environment/version keys and after-commit invalidation. Publication and master visibility remain authoritative.
- Private filesystem originals and re-encoded WebP derivatives are delivered through controlled Laravel media routes, then the Next media proxy. No public storage link is required. Image processing is synchronous; current quotation handling needs no worker, scheduler, Redis or messaging service.
- `product-studio.tsx` lazily imports the viewer after activation. The integrated engine uses demand/hidden rendering, DPR ≤1.5, bounded textures and disposal. PNG/GLB export exists; uploaded GLB ingestion, AR and live authenticated draft preview remain disabled/deferred. Preserve `prototype/` unchanged.
- User-confirmed staging: Ubuntu 24.04 VPS, Nginx, PHP-FPM, systemd; website `gos-cert.org`, API/admin `api.gos-cert.org`. This is a split-domain deployment, whereas M0 initially proposed same-origin routing. Preserve the working split-domain arrangement and confirm its actual internal transport before tailoring configuration.
- Repository deployment guidance is [backend VPS preparation](backend-vps-preparation.md) and [M6 integration setup](milestone-6-integration-setup.md). No `deployment/` directory, systemd unit or deployable Nginx configuration was found. Ignored Windows Apache QA configuration is not VPS configuration.

Expected request path, subject to operator configuration verification: browser → website Nginx → Next; Next → configured Laravel origin → PHP-FPM → MySQL/private storage. Admin browser → API-domain Nginx → Filament/Livewire. Frontend proxies forward no administrator cookies or credentials.

### Read-only staging observations

Five HTTPS GETs were executed during Phase 1 with normal certificate validation, redirects disabled and an eight-second request deadline. The initial sandbox network attempt failed; the authorized network retry completed. No login, quotation submission, upload, scanning campaign or service operation was performed.

| URL | Observed status | Observed protection |
| --- | --- | --- |
| `https://gos-cert.org/fr` | 200 | HTML noindex, `X-Robots-Tag: noindex, nofollow`, private/no-store response |
| `https://gos-cert.org/ar` | 200 | Same indexing/cache protection |
| `https://gos-cert.org/robots.txt` | 200 | Disallow all; noindex response header |
| `https://api.gos-cert.org/up` | 200 | noindex response header; framework health response |
| `https://api.gos-cert.org/admin/login` | 200 | noindex and private/no-store response |

All sampled responses included nosniff, SAMEORIGIN framing and strict-origin-when-cross-origin referrer policy. Website responses also included restricted camera/microphone/geolocation permissions. None of these five responses included CSP, CSP Report-Only or HSTS. Their server banner advertised Nginx 1.24.0/Ubuntu; that is not proof of the installed OS, patch state or process topology. These observations establish public reachability and sampled headers, not a production security sign-off or Lighthouse measurement.

Actual service names/users/ports, release path/version, PHP-FPM pool/socket, Nginx upstream/header rules, direct upstream exposure, effective private environment, DB grants, firewall, TLS renewal and backup/restore state remain unverified. Obtain sanitized operator configuration or separately authorized read-only VPS inspection before claiming these verified. Never request secret values in reports/chat or publish an unredacted `nginx -T`/environment dump.

## Existing protections to preserve

| Area | Repository evidence and protection |
| --- | --- |
| Admin | `User.php`, policies, `ContentWriter.php`, `AdminPanelProvider.php`: active/role checks, policy-gated transactional writes, 14-character minimum on managed passwords, last-active-super-admin protection, CSRF/session middleware, no public registration. Installed Filament login invokes `rateLimit(5)` and regenerates the session; existing backend tests cover rejection/throttling. |
| Sessions/CORS | Production boot forces Secure/HttpOnly/SameSite=Lax. Environment example enables encrypted DB sessions; effective staging encryption/domain settings still need verification. CORS allows the configured website origin without credentials or wildcard origins. |
| Public content | `ContentModel.php`, `PublicCatalogueController.php`: published/date/active-parent scopes, production exclusion of illustrative products/applications, bounded pagination/eager loading, cache invalidation. Do not alter visibility flags or business records to satisfy tests. |
| Media/uploads | `MediaLibrary.php`, `MediaController.php`, Next media route: MIME/decode validation, 10 MB, 20 MP, 8192 px side and memory bounds, UUID paths, WebP quality 90/no upscaling, private originals, referenced-deletion protection, stable replacement IDs, publication checks on delivery, bounded proxy body/deadline and no-store frontend delivery. GLB/SVG uploads are disabled. |
| Storage alternate routes | Local disk has `serve=true`; installed Laravel's `/storage/{path}` delivery requires a valid relative signature for private files. This is not anonymous public access. Inventory any temporary URL issuance and add negative coverage so originals/drafts cannot bypass the intended media boundary. |
| Quotations | Request/handler/domain validation, Origin/JSON/64 KiB bounds, honeypot, encrypted time-bounded challenge, five-per-minute identity throttle, transaction/unique-key duplicate protection, payload-conflict 409, authoritative immutable snapshots, private responses and no public quotation read endpoint. Client recovery retains the same key and frozen input after an uncertain response; no customer browser storage. |
| Proxy/secrets | API origin is server-only; media URLs are origin/path allowlisted. Private proxy secret authenticates forwarded quotation identity; unauthenticated custom client headers are not trusted. `TRUST_PROXY_HEADERS` defaults false. Do not enable it without an overwriting proxy and inaccessible direct Next listener. |
| Errors/logs | API errors are sanitized; quotation exception logging omits payloads. Next logs sanitized route templates/status/duration. Laravel timing diagnostics are local/testing gated and production-disabled. |
| Rendering/accessibility | Static preview before WebGL, single canvas, lazy Three/exporter, visibility pause/disposal, reduced motion, localized accessible controls, keyboard/focus handling and URL-preserving language switching. |

## Findings and proposed implementation order

These are inspection findings and verification gaps, not claims of a completed penetration test. Fix only confirmed weaknesses; reuse existing code and tests.

| Priority | Finding | Proposed action after approval / acceptance evidence |
| --- | --- | --- |
| 1 | Production settings are documented but not centrally validated; examples contain local origins, and private effective staging configuration was not inspected. | Add minimal fail-fast/preflight validation for required origins/shared secret, production debug/cookie/session/diagnostic settings and bounded timeouts. Allow verified internal loopback HTTP where appropriate; require HTTPS public origins. Validate without printing values. Preserve existing keys/accounts. Test invalid configurations fail safely. |
| 1 | Next identity attribution trusts the first X-Forwarded-For value when its boolean switch is enabled; Laravel bootstrap has no explicit trusted-proxy configuration. | Confirm real ingress chain and direct-access restrictions. Define trusted proxy handling for that topology; reject spoofed/malformed identity, host and scheme input. Test direct and proxied paths, quotation limits and Filament login limits without disabling existing throttles. Audit challenge/read bucket behavior separately from submission identity. |
| 1 | Git is now present and tracks **1,365 generated `.next*` files**. Ignore rules cover only some output names; an untracked `apps/api/storage.zip` also exists. A targeted index check found no tracked private `.env`/`.env.local`, `.tools` files or Laravel cached configuration. | Prepare a minimal artifact/ignore correction and review tracked generated output separately; no history rewrite or deletion of business files. Use a release allowlist excluding QA traces/logs/archives, private storage/configuration and development artifacts. Scan candidate release/client output for secrets without emitting matches. No assertion that Git history or archives are secret-free until inspected safely. |
| 1 | No versioned VPS configuration or executed restore/rollback evidence is available. `/up` verifies application boot, not complete DB/media readiness. | Prepare the runbook/configuration described below; distinguish liveness from safe bounded readiness probes. Require restore evidence on an isolated copy and operator approval before any live action. |
| 2 | Baseline headers exist, but sampled staging pages have neither CSP nor HSTS. | Inventory actual Next inline/hydration, Filament/Livewire and 3D requirements. Test a minimal CSP in report-only mode locally before proposing enforcement; avoid broad untested directives. Document HSTS adoption only after HTTPS/subdomain readiness is verified; do not enable preload/includeSubDomains automatically. Test headers on success/error/private responses. |
| 2 | Private-media and quote protections exist; production proxy, alternate storage routes, effective cookies and logging need focused negative verification. | Extend existing feature/browser tests for verified gaps: unsigned/private/draft originals, wrong-origin uploads/requests, MIME/size/decode failure, direct/proxied rate-limit identity, safe error bodies/logs and recovery. Keep publication rechecks, body limits and idempotency intact. Verify PHP/Nginx/Livewire/application upload limits agree. |
| 2 | Canonical/hreflang/OG helpers exist, but no sitemap or standalone privacy route was found. French fallback has no field-level translation-completeness signal; hreflang currently lists all locales. Structured data was not found. | Audit actual metadata/status codes and untranslated fallback. Prepare a publication-aware sitemap and eligible locale alternates, consistent x-default/OG and factual schema only where justified; retain staging noindex. Confirm catalogue query/pagination canonical policy. Provide the privacy route only with approved content; otherwise record the owner-content blocker. Do not invent company facts or enable indexing. |
| 2 | Mobile LCP remains above target; M6 already optimized critical images and deferred lower imagery. | Measure the deployed request path and local repeatable baseline before modifying it. Investigate font delivery, hero transfer, initial JS/long tasks, server/cache delay and lazy 3D boundaries. Keep only measured, appearance-preserving changes; test font glyph/shaping coverage and media revocation. Do not promise ≤2.5 s or treat lab scores as field CWV. |

### Deployment artifacts to prepare, never execute automatically

Use existing architecture, locked npm/Composer dependencies and supported verified runtimes. No new platform, queue or service is justified by the current scope.

1. Document current sanitized VPS inventory and release identity, then build a fresh immutable release using `npm ci` and locked Composer production installation. Define environment validation, asset generation, Laravel cache generation and the matching Next build/runtime environment. Exclude private/test/generated QA material from release input.
2. Supply reviewable split-domain Nginx/PHP-FPM/systemd templates tailored to confirmed paths/users/ports. Route Laravel through its public front controller; preserve Filament/Livewire routes; prevent arbitrary PHP/static private-file exposure and shared caching of admin/quotes/media. Bind Next privately and overwrite forwarding headers. Define consistent upload/body/memory limits, timeouts, restart policy and graceful stop budgets.
3. Keep code owned by the deploy user and runtime writes limited to required shared storage/cache paths. No blanket 777, public private-storage alias or automatic `storage:link`. Separate runtime DB grants from migration privileges; preserve existing APP_KEY and secrets.
4. Make migration steps backup-first, reviewed and additive where possible, with an explicit target and migration preview. No `migrate:fresh`, demo seeder, QA provisioning or unconditional seeding on existing data. The old VPS guide's generic `db:seed --force` is not a routine release step; current foundation seeding is first-install-only and separately reviewed.
5. Define an atomic release switch, config checks and read-only smoke checks before/after an approved service reload/restart. Do not copy Windows QA configuration to the VPS. No automatic live restart, credential rotation, DNS operation or data migration.
6. Define rollback to a known artifact with schema compatibility checks. Do not blindly run down migrations or restore an old database over newly accepted quotations. State when a forward fix or maintenance window is safer; preserve shared media/environment across releases.
7. Prepare encrypted off-server MySQL/private-media/key backups with coordinated consistency, retention, restore ownership and protected credentials. Restore only into isolated DB/storage; verify row/reference/media integrity and application behavior. Owner must decide retention and recovery objectives; no unmeasured RPO/RTO claim.
8. Document safe log rotation/access, HTTP/error/latency, DB connectivity, disk usage, TLS expiry, service restart and backup-age monitoring, plus an incident/recovery checklist. Do not add unsolicited external notifications or collect quote payloads in telemetry.

## Verification plan after implementation approval

During development run only the tests relevant to each change. At the final M7 gate run the broader requested suite once after fixes, retaining failures and genuine skips. Separate tests/benchmarks so they do not compete for host resources.

- Laravel: guarded isolated MySQL database ending `_test`; verify effective config before any RefreshDatabase tests. Run relevant security/publication/media/quotation cases during development, then full suite. No test migrations against business or staging data.
- Frontend: production build, separate TypeScript, full Playwright with recorded origin/runtime/worker/retry settings, and `npm run test:3d`. Preserve original prototype files; execute their existing tests only. Run current dependency advisory checks and report their date/scope; no automatic broad dependency upgrade.
- Real workflows: disposable, identified local fixtures for admin authorization/publication → public FR/EN/AR → media replacement/revocation → configuration synchronization → quotation persistence/Filament → exact retry/conflict/throttle/lost-response recovery. Record baseline hashes and clean only those fixtures; do not provision or submit on the live VPS without separate approval.
- Responsive/accessibility: FR/EN/AR at 320, 390, 430, 768, 1024 and 1536 px; keyboard/dialog/error focus, menu/filter language preservation, reduced motion, RTL/bidi, no initial WebGL and activated teardown/failure. Capture relevant desktop/mobile screenshots and axe results. Label physical-phone, Safari/Firefox and manual screen-reader checks unverified unless actually executed.
- Performance: at least three comparable runs for important FR/AR mobile home/catalogue and representative product routes, plus desktop control. Record exact Lighthouse/runtime/host settings, individual and median LCP/TTFB/TBT/CLS/bytes, LCP element and trace breakdown. Separate payload-cache cold/warm and browser-cache behavior; distinguish deployed HTTPS measurements from the local concurrent lab and initial page from activated 3D. Retain all samples and known host variability.
- Deployment verification: locally validate templates/scripts where tools exist; mark unavailable Ubuntu/Nginx/systemd/restore checks as unexecuted. No success claim from an unexecuted runbook. Staging noindex and current protections must remain in every regression.

Previous M6 results are **historical evidence reviewed, not rerun in Phase 1**: 68 Laravel tests/398 assertions, 127 Playwright passes/20 intentional skips, eight standalone 3D passes, production build and TypeScript pass. Latest local warm mobile LCP medians: FR home 4.064 s, AR home 4.661 s, FR catalogue 3.764 s, AR catalogue 3.909 s, FR product 4.137 s; desktop home 2.025 s. Target remains unmet; French home TBT increased to 271 ms and requires investigation rather than concealment.

## Deliverables and gates

| File | Status / intended content |
| --- | --- |
| `docs/milestone-7-plan.md` | This Phase 1 plan, scope comparison, verified observations and limitations. |
| `docs/milestone-7-security-audit.md` | After approval: findings, severity/evidence, mitigations, retests and unresolved risks; no secrets. |
| `docs/milestone-7-deployment-runbook.md` | After approval: exact reviewed target-specific procedure/templates, prerequisites, backups, smoke checks and rollback; clearly distinguish prepared from executed steps. |
| `docs/milestone-7-test-report.md` | After approval: actual commands/results, screenshots, measurements, failures/skips and verification limits. |
| `docs/milestone-7-final-report.md` | After approval and verification: implemented files/changes, security/performance results, outstanding risks and staging versus production readiness, referencing exact runbook/rollback instructions. |

**Planning gate:** approve the expanded M7 allocation and this implementation plan before any code/configuration changes. The attachment explicitly says “Start with Phase 1 only” and “Do not proceed until the plan is approved.”

**Operational gate:** plan approval permits local implementation and reviewable artifacts, not live VPS mutations, service restarts, account/key rotation, DNS, business-content edits, destructive migrations or removal of staging noindex. Confirm target and concrete operation before separately authorized live work.

**Final gate:** stop after M7 evidence and report for owner review. Do not begin M8, cinematic entrance animation, ecommerce, uploaded-model features or a prototype rewrite. Production readiness cannot be declared while critical risks or required operational checks remain unresolved; content/privacy approval, physical-device coverage and the outstanding mobile LCP target must be reported honestly.
