# Milestone 7 — deployment and recovery runbook

14 October 2026. **Prepared for review; no VPS operation executed.** Preserve `gos-cert.org` → Next and `api.gos-cert.org` → Laravel/Filament. The working staging deployment is user-confirmed; actual VPS service/pool names, release path, grants, firewall and backup facilities have not been inspected. `/srv/time-stone`, user `time-stone`, socket `/run/php/time-stone.sock` and ports 3000/8081 below are **template values requiring operator confirmation**, not discovered infrastructure.

## Artifacts and approval prerequisites

- [Nginx split-domain template](../deployment/nginx.conf.example), [Next systemd template](../deployment/time-stone-web.service.example), [PHP-FPM pool template](../deployment/php-fpm.conf.example), [frontend environment template](../deployment/web.env.example).
- [Source allowlist packager](../scripts/package-release.py) defaults to a dry run. Explicit `--output releases/<unique-release>.tar.gz` exclusively creates a new local archive; never overwrites. It excludes storage, `.env`, QA/traces, `.git`, generated Next output, node_modules/vendor and `storage.zip`. Archive file modes are normalized to `0644` (`0755` for `artisan`) because raw Windows metadata otherwise exports world-writable source. Extract as the approved release owner with `--no-same-owner`; verify actual ownership, directory traversal and runtime write access before any release switch. Compile a fresh production artifact from the source release, not from historical QA builds.
- [Frontend preflight](../scripts/check-production-env.mjs) and `php artisan time-stone:preflight` are read-only. They print check names/statuses, not environment values. They do not verify network/firewall/backup state, passwords' entropy or database grants.

Before executing anything remotely, obtain separate explicit approval identifying the VPS, release path, domains, exact diff and operations. Record current release and rollback artifact, sanitized systemd/Nginx/PHP-FPM configuration, runtime versions, service users, disk/memory headroom and TLS renewal status. Do not dump private environment or unredacted service configuration into evidence. Preserve the existing key, secrets, accounts, uploads and data. No automatic credential rotation, DNS edit, noindex removal or production seeding.

## Configuration requirements

Use the committed locks and verified Node 24/PHP/Composer/MySQL platform compatibility. Do not infer VPS versions from the HTTP server banner. Set Laravel `APP_ENV=production` **also for protected staging**, `APP_DEBUG=false`, HTTPS `APP_URL=https://api.gos-cert.org`, `WEBSITE_ORIGIN=https://gos-cert.org`, encrypted database sessions, host-only cookie domain, database cache and private local disk. Keep `MAIL_MAILER=array`; this milestone does not authorize outbound mail or messaging.

Frontend `SITE_URL=https://gos-cert.org`, `PUBLIC_MEDIA_ORIGIN=https://api.gos-cert.org`, matching existing private proxy secret and `API_TIMEOUT_MS=8000`. Diagnostics off. `LARAVEL_API_URL` can remain the approved HTTPS API origin, or use the optional same-VPS loopback listener after its configuration is verified. Its canonical FastCGI host/scheme parameters are essential: returned public media URLs must still use `https://api.gos-cert.org`, not the internal listener. Verify DTO media origins before release.

Keep `TRUST_PROXY_HEADERS=false` until Nginx overwrites X-Forwarded-For with **one** actual client IP and direct access to Next is blocked. The template uses `$remote_addr`, not an appended visitor-controlled chain. With an additional CDN/load balancer, obtain its actual topology and trusted address ranges first; this template must not guess them. Laravel `TRUSTED_PROXIES` accepts explicit IPs/CIDRs only, defaults empty and does not trust forwarded hosts. In direct Nginx→PHP-FPM deployment, FastCGI REMOTE_ADDR already supplies the client address; no wildcard proxy trust is needed.

Staging noindex is enforced by Next/Laravel response headers, metadata and robots. The new sitemap does not authorize indexing. CSP is report-only: test public hydration, Filament/Livewire and activated 3D before considering enforcement. Inline scripts/styles are still permitted in this candidate policy; it is not a complete enforced XSS mitigation. HSTS is commented in the template and requires a separate HTTPS/subdomain readiness decision; no preload/includeSubDomains is enabled.

## Source build and release preparation — proposed commands, not executed on VPS

These are operator-reviewed commands for a **new** release directory after target confirmation. Never run them in the current working release by mistake.

```sh
cd /srv/time-stone/releases/<new-release>
# Extract only the reviewed source artifact into this new directory.
npm ci
# Supply private web environment to the build process without printing it.
node scripts/check-production-env.mjs
npm run build
npm run typecheck
cd apps/api
# Before Composer scripts: verify/link the existing shared private .env and storage.
# Confirm storage/framework/{cache/data,sessions,views} and storage/logs already exist,
# with scoped service permissions. The archive includes only bootstrap/cache/.gitignore;
# no generated cache or private storage is packaged. Create missing scaffold directories
# only as part of the separately approved deployment, never by copying local storage.
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer check-platform-reqs --no-dev
php artisan time-stone:preflight
php artisan migrate:status
php artisan migrate --pretend --force
php artisan filament:assets
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan time-stone:preflight
```

Load frontend secrets through a protected environment file/process environment, never shell history or a public NEXT_PUBLIC variable. The systemd environment file is not a shell script; do not casually source an arbitrary file. Ensure Next build and runtime use the same public origins/output directory. Do not prune JS development packages without testing the resulting standalone runtime; this source procedure retains the locked installation outside public roots. Composer production dependencies omit dev packages.

For Laravel, shared `.env` and media/storage must survive release switches. Generate `bootstrap/cache` **per release**; do not share stale configuration/route caches across releases. Inspect caches privately because config caches contain credentials. Never copy `.tools` Windows QA configuration to the VPS. Never run `storage:link`; originals remain private.

Use a deploy-owned code tree with PHP runtime read access; write access only to required shared `storage` and per-release `bootstrap/cache`. Next runtime requires its generated image/cache directory writable; grant only `.next/cache`, not all source/build output. Secret files must be readable only by intended service/deploy identities (typically 0600/0640 with verified group ownership); no blanket chmod 777. Verify all required storage/framework/cache/data, sessions, views, logs and private media directories exist without replacing their contents.

## Migration, backup and release gate

No M7 schema migration is required by this implementation. For a future schema-changing release, first review each migration, affected tables, lock duration and backward compatibility. Take a verified backup before any approved migration. The generic historical `db:seed --force` instruction is **not** part of routine releases; foundation seed is first-install-only. Never run demo seeders, test factories, `migrate:fresh` or broad cleanup against business/staging data.

Back up MySQL with a protected defaults file (0600) and `mysqldump --single-transaction --routines --triggers --events`; no password in command arguments. Coordinate DB/private-media consistency through an approved snapshot or write-free window. Include private originals/derivatives, necessary environment/key material and an artifact/configuration manifest. Encrypt before off-server transfer; protect backup credentials separately. Define owner-approved retention, destination, restore owner and RPO/RTO; no values or successful restore are assumed.

Restore a backup only into a **new isolated database and media directory** with isolated credentials. Check table counts/constraints/quotation snapshots, media hashes/references, admin authorization and representative public/quote flows using synthetic fixtures. Never use a production restore as a test. Record actual restored artifact/time/results before calling backups operationally verified.

After backup and separate operational approval: execute reviewed additive migrations only, validate the new configuration, then switch the release symlink atomically with the old target recorded. Test Nginx (`nginx -t`), PHP-FPM configuration using the installed binary's test mode, and systemd (`systemd-analyze verify`) **before** any approved reload. Reload/restart only the verified TIME STONE services; never a wildcard. Native Next SIGTERM and a 30-second stop budget are proposed; verify drain behavior under representative requests before claiming zero downtime. No unused queue worker or scheduler is added.

## Smoke checks, monitoring and rollback

Use bounded read-only checks for `/fr`, `/en`, `/ar`, catalogue and an actual published detail; confirm canonical/hreflang/public media origins, noindex, critical images and correct status codes. `/up` is Laravel liveness, not proof of database/media integrity. Read `/api/v1/site?locale=fr` and a known published derivative to exercise actual DB/visibility and storage; verify an unknown/draft detail is 404. Confirm admin cookies are Secure/HttpOnly/SameSite=Lax/host-only, private responses are not shared-cached and no direct upstream port is exposed. Do not submit live smoke quotations or change editorial content without separate approval.

Monitor HTTP error/latency distributions, sanitized application failures, authentication/throttle counts, service restart loops, database connectivity, disk usage, TLS expiry and backup age/restore results. Configure private log rotation and access. Do not log quotation bodies, authentication headers, raw keys or query bindings. No unsolicited external monitoring messages are sent by M7.

Rollback requires a known previous artifact and a schema-compatibility decision. On an approved failed release: stop further writes if necessary, record accepted quotations since the switch, atomically restore the previous release target, then perform only the approved service reload/restart and repeat smoke checks. Preserve shared environment and all media. Do not blindly run `migrate:rollback` or restore an old database over new quotations; prefer a compatible code rollback or forward fix. A data restore requires its own explicitly approved reconciliation/recovery plan.

## Executed versus prepared

The final gate adds a [read-only staging checklist](milestone-7-staging-readonly-checklist.md). It is prepared, not remotely executed. The current source candidate also contains the subsequently authorized homepage magasin-location migration `2026_10_14_000100_add_magasin_directions_url.php`; the historical statement that M7 itself introduced no migration does not authorize omitting or executing this later migration. Review actual pending migrations and backup/rollback compatibility under separate deployment approval.

Only local source packaging, application checks and local verification may be reported as executed in the [test report](milestone-7-test-report.md). These Ubuntu Nginx/PHP-FPM/systemd configurations, grants/firewall rules, live migrations, release switches, restarts, backup transport and restore procedures have **not** been executed or verified on the VPS. Owner/operator configuration confirmation and operational approval remain required.

Technical references checked during preparation: [Laravel trusted proxies](https://laravel.com/framework/docs/13.x/requests#configuring-trusted-proxies), [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [Nginx proxy headers](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header). Installed source and actual operator configuration remain authoritative for the deployed system.
