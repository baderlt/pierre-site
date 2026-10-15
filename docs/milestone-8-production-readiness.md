# Milestone 8 — production readiness

**Local evidence does not authorize deployment or establish the state of the VPS.** Preserve `gos-cert.org` and `api.gos-cert.org`, staging noindex, report-only CSP and the current absence of HSTS. M9 requires separate owner authorization. No VPS connection, DNS change, restart, remote migration, secret rotation, backup or restore occurred in M8.

## Prepared configuration and operational gates

The accepted [M7 runbook](milestone-7-deployment-runbook.md) and [read-only staging checklist](milestone-7-staging-readonly-checklist.md) remain authoritative preparation documents. Nginx/FPM/systemd files under `deployment/` are review templates, not discovered live configuration.

| Area | Local finding / remaining requirement |
| --- | --- |
| Runtime and locks | Local verification uses Node 24.19, Next 16.4, PHP 8.3.6, Laravel 13.35 and MySQL 8.3 with existing locks. No dependency upgrade or new runtime dependency. Verify actual Ubuntu versions/extensions and Composer platform requirements before deployment. |
| Production build | Fresh baseline, intermediate and final production builds are retained in M8 evidence. Final TypeScript and regression results are in the [test report](milestone-8-test-report.md). Building the current installed dependency tree does not prove a clean-room dependency installation or Linux build. |
| Environment | Existing status-only Next/Laravel preflight validation and regression tests are retained. Production requires HTTPS canonical origins, private proxy secret, diagnostics/debug off, encrypted database sessions, Secure/HttpOnly/Lax host-only cookies, private storage and bounded deadlines/rates. Local HTTP cannot establish HTTPS cookie/TLS correctness. |
| Nginx / proxy topology | Verify actual public roots/upstreams, private-file blocking, request limits, forwarded-header overwrite, explicit trusted peers and upstream network isolation. Do not infer deployed settings from templates. No shared caching of private/admin/quotation responses. |
| PHP-FPM | Review real pool/service users, socket ownership, OPcache, 256 MB image-processing memory budget, upload/post limits, write paths and concurrency against measured VPS RAM. Windows Apache thread counts are not PHP-FPM sizing recommendations. |
| Next systemd | Verify actual working directory, Node path, protected environment-file reference, service user, `.next/cache` write permission, graceful stop/restart behavior and readiness checks. The existing template's hardening requires validation on the real filesystem/service. |
| Migrations | M8 introduces **no application schema/index migration**. Review actual pending migrations, including the earlier additive magasin URL migration; an M7 approval or local clone is not authorization to migrate staging. Never seed demo content into production. |
| Filesystem / release | Source-only allowlist excludes environments, private storage, QA, dependencies and generated caches. Preserve originals and existing keys across releases. Verify extraction ownership/ACLs and empty framework scaffolds; local archive modes do not establish deployed permissions. |
| Health checks | `/up` proves liveness only. Approved future checks should also read authoritative site data and a known published derivative, verify expected draft 404 behavior and localized error handling. Do not submit live quotations or edit content as an unapproved smoke check. |
| Monitoring | Define sanitized HTTP/error/latency/throttle metrics, restart counts, database connectivity, disk/TLS/backup age alerts and private log access/rotation. No external monitor or unsolicited notification was configured. |
| Backup / restore | Owner must approve RPO/RTO, retention, encrypted off-server destination and responsibility. Consistent DB/private-media backups need a successful restore into a new isolated destination with hashes, constraints and quotation-snapshot verification. No actual staging backup/restore was executed. |
| Rollback | Record previous release, schema compatibility and accepted quotations since switch. Prefer compatible code rollback/forward fix; never overwrite new requests with an old database. Rehearse under separate operational approval. |
| Operational security | Verify runtime DB least privilege, firewall/upstream exposure, TLS renewal, production session consistency, OS patching, privacy/retention policy and credentials/access ownership. CSP enforcement and HSTS require their own review. |

## Local isolation and limitations

Load/write verification uses a newly authorized loopback-only `time_stone_m8` database and private media copy. Original users and quotations were excluded. A separate random test service account is scoped to that database; existing app-account grants and environment secrets were not changed. The first clone attempt was denied by the existing application's limited grants, as expected. Provisioning used the already established local WAMP bootstrap connection; its local administrative authentication is **not a production recommendation or proof of production security**. No password was rotated.

The final [integrity evidence](qa/milestone-8/integrity.json) checks all 36 original business-table rowsets, 757 private-file hashes, environment files and the preserved storage archive. Test database/media/account material remains private and excluded from release packaging. Authenticated browser traces also remain private.

Local mobile LCP, software-rendered WebGL and bounded laptop load are laboratory evidence. They are not physical-device, deployed-capacity, field-INP/Core Web Vitals or penetration-test certification. Unverified infrastructure and recovery gates remain release blockers even if all local regressions pass. The final measured mobile target status is stated in the [final report](milestone-8-final-report.md).

## Recommendations for an explicitly authorized M9

1. Approve and execute the existing read-only Ubuntu checklist against a named host/release, recording sanitized effective configuration.
2. Review the new source candidate, actual pending migrations and production preflight; verify a fresh locked Linux install/build without copying Windows QA caches.
3. Establish and test consistent backup/restore and rollback in isolated destinations, including quotations accepted after a release switch.
4. Measure the real staging delivery path and physical phones; evaluate remaining hero/font delivery trade-offs using comparable traces while preserving publication/media protections.
5. Obtain separate deployment and indexing/header-policy approvals before any operational change. No cinematic entrance is included.

## Final local evidence and compatibility notes

The final frozen source passes 90 Laravel tests / 522 assertions, 173 browser tests with zero retries and 22 documented intentional skips, 15 unit tests, production build and TypeScript. The database-cache driver mirrors locked Laravel 13.35 native configuration and must be checked against framework constructor changes during upgrades. It retries only atomic cache initialization outside enclosing transactions; quotation transactions and protections remain intact.

Mobile LCP remains above the target. Local SSR throughput plateaus under the bounded concurrency-eight workload; staging sizing cannot be inferred from this Windows laptop. Physical devices, Linux clean-room builds, deployed configuration and backup/restore/rollback remain operational gates.

[Fixture cleanup](qa/milestone-8/fixture-cleanup.json): synthetic admin deactivated, its password invalidated and its sessions removed. [Runtime teardown](qa/milestone-8/teardown.json): only verified M8-owned listeners stopped; existing M7 API retained. The isolated QA database/media remain private for evidence; no original account or file was deleted. The temporary sleep guard ended without a global power-plan change. Source artifacts exclude all private QA credentials/configuration.
