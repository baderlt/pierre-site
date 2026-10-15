# Milestone 7 — final local verification report

14 October 2026. **The current complete local browser run passed: 166 passed, 0 failed, 20 intentional device skips; all 186 cases accounted for, 2 workers, zero retries.** Owner acceptance and separate operational approval remain required. No VPS connection, deployment, M8/M9, destructive business-data migration, secret rotation or design/asset change occurred.

## Final gate outcome

- Laravel: **84 tests / 486 assertions**, zero errors/failures/skips on isolated MySQL `time_stone_test`. Production build and separate TypeScript passed. All **15 security/map/3D unit tests** passed, including byte identity with the original prototype.
- Initial complete browser run: **157 passed / 9 failed / 20 skipped**. The second complete run recorded **164 passed / 2 failed / 20 skipped** from the map-readiness race. All eleven failed identities passed affected rechecks, followed by the clean complete run (24.99 min). [Every result, failure, skip and screenshot](milestone-7-test-report.md#final-verification-gate--14-october-2026).
- Confirmed local fault: Laravel misresolved the Windows drive-letter configuration-cache path. Uncached requests exhibited inconsistent session encryption and API 500s. A valid relative path and fresh private cache produced **256/256 successful reads**, stable encrypted sessions and passing admin journeys. The historical trace proves a session-content reset with a valid unchanged cookie before sleep; its exact original encryption/database setting was not recorded. This forensic limit remains explicit.
- Security/publication/private-media/quotation/3D regressions passed. 27 real synthetic quote rows were verified and removed with strict guards; original business rows, 757 private files, accounts, environment files and storage.zip match the fresh baseline.
- Current source package: **280 files**, required application paths/locks/assets present, no forbidden paths or configured-secret matches. Added the missing empty bootstrap cache scaffold; normalized archive modes to `0644`/artisan `0755`. [Package evidence](qa/milestone-7-gate/package-verification.json), [source candidate](../.tools/m7-gate/source-release.tar.gz). SHA-256: `7e97fefeef58a68e279c3339d07d6c6f2c7a00ce3b3a8b024c5e9e625cfe1762`.

Only test harness, local QA runtime, source packaging and requested documentation changed in this gate. No application authentication/publication/media/quote/viewer logic, approved design, logo, fonts, business content or textures were modified. The build regenerated its normal output-type references.

## Remaining boundaries

1. The [read-only Ubuntu staging checklist](milestone-7-staging-readonly-checklist.md) is prepared, **not remotely executed**. Actual Nginx/PHP-FPM/systemd configuration, MySQL grants, HTTPS cookies, proxy topology, TLS, filesystem access and backup/restore/rollback still require approved inspection. No archive extraction/install/clean-room Linux build was performed.
2. Exact historical session configuration was not captured. The runtime defect and session reset are verified; no application auth defect was reproduced after correction. This is not a retrospective proof of the initiating variable in that original request.
3. Lighthouse was not repeated in this narrowly scoped verification gate. Historical measurements below predate the corrected config-cache runtime; mobile LCP has no new passing result. Headless Chromium/SwiftShader is not physical-device GPU or field CWV evidence.
4. Staging noindex is preserved; CSP remains report-only, HSTS unapplied. No privacy/company facts were invented, and no manual accessibility/penetration certification is claimed.

## Existing M7 implementation retained


- Hardened server origins/deadlines and rejected internal API redirects; validated and canonicalized trusted quotation IPs, with explicit Laravel proxy allowlisting and no forwarded-host trust.
- Added status-only production preflight checks, forced encrypted production sessions and tightened test database isolation against connection-URL overrides. Existing authentication/policies/CSRF/CORS/quote/publication/media protections remain.
- Added report-only CSP candidates, publication/translation-aware sitemap, consistent canonical/hreflang/x-default/Open Graph and factual WebSite schema. Staging noindex stays enabled; no company/privacy text was invented.
- Removed 1,365 verified generated Next files **from Git tracking only**; working builds and history remain. Preserved the private 215.7 MB storage archive, including its 40 archive-only files. Added an allowlisted source-release packager.
- Prepared split-domain Nginx, PHP-FPM, systemd and environment templates plus build/migration/backup/restore/monitoring/rollback instructions. They are review-only, not executed VPS configuration.
- Isolated QA artifacts after an actual Windows write failure; corrected the local cached-configuration path after a reproduced missing-password error. No production runtime tuning, image/font/design change or speculative performance optimization was applied.


## Historical performance — not rerun in this gate


Three samples per page/state, fresh browser cache, explicitly warmed or evicted payload caches:

| Page | Baseline median LCP s | Final warm median s | Final cold median s |
| --- | ---: | ---: | ---: |
| French homepage / mobile | 4.039 | 3.926 | 4.077 |
| Arabic homepage / mobile | 4.721 | 4.671 | 4.693 |
| French catalogue / mobile | 3.853 | 3.481 | 3.627 |
| Arabic catalogue / mobile | 3.289 | 3.467 | 4.517 |
| French product / mobile | 4.086 | 4.212 | 4.083 |
| French homepage / desktop | 3.227 | 2.397 | 2.563 |

Every mobile median remains above 2.5 s. Baseline CPU calibration was approximately 500–600 versus final roughly 1754–3069; runtime configuration also changed. These values do not establish a causal page optimization. Some routes worsened, and all samples are retained. No media quality/security compromise was made. [Individual results, TTFB/CLS/TBT/bytes and limitations](milestone-7-test-report.md#performance--actual-laboratory-results).


## Review artifacts

- [Updated executed test report](milestone-7-test-report.md)
- [Security audit](milestone-7-security-audit.md)
- [Deployment/rollback runbook](milestone-7-deployment-runbook.md)
- [Read-only staging checklist](milestone-7-staging-readonly-checklist.md)
- [French desktop](qa/milestone-7-gate/full-verified/desktop/home-fr-desktop.png), [Arabic mobile](qa/milestone-7-gate/full-verified/mobile/home-ar-mobile.png), [working 3D](qa/milestone-7-gate/full-verified/desktop/milestone-3/viewer-desktop.png)

**Stop for owner review. Do not deploy M7 or begin M8/M9 without separate explicit approval.**
