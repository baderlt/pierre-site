# Milestone 8 — test report

## Final frozen source gates

| Gate | Actual result | Evidence |
| --- | --- | --- |
| Laravel / isolated MySQL `time_stone_test` |90 tests, 522 assertions; 0 fail/error/skip; 147.359 s, 108 MB |[JUnit](qa/milestone-8/backend-final.xml), [log](qa/milestone-8/logs/backend-final.log) |
| New cache semantics unit coverage |6 tests, 36 assertions passed |[JUnit](qa/milestone-8/cache-retry-unit.xml) |
| Production Next build |Passed; SSR routes retained |[log](qa/milestone-8/logs/build-verified.log) |
| TypeScript |Exit 0 |[log](qa/milestone-8/logs/typecheck-ultimate.log) |
| Node security/map/original3D tests |15 passed, 0 failed/skipped |[log](qa/milestone-8/logs/unit-ultimate.log) |
| Complete Playwright |173 passed, 0 failed, 22 intentional skips, 0 flaky; 195 cases; 2 workers; 0 retries; 21.45 min |[JSON](qa/milestone-8/full-verified.json), [log](qa/milestone-8/full-verified.log) |
| PHP formatting, changed files only |Passed |[log](qa/milestone-8/logs/php-style-final-pass.log) |
| Publication/cache/media/3D synchronization |Passed |[proof](qa/milestone-8/synchronization.json) |
| Bounded load/quotation assertions |Passed; 356 workload requests, 0 transport/5xx errors |[report](milestone-8-load-testing.md) |

Backend bootstrap guard enforces the exact isolated test DB and empty DB_URL; migration/reset test lifecycle never targets the business database. Test PHP memory_limit 256 M/post_max_size 128 M/xdebug disabled. No existing environment file edited. Complete browser execution targets isolated 3033, location fixture 3032 and controlled outage 3035; all loopback. Test matrix includes 320/390/430/768/1024/1536 px FR/EN/AR, keyboard, RTL, reduced motion, no-script, axe checks, SEO/staging noindex, publication/private-media protections, quotation persistence/recovery and3D exports/failure/disposal. Chrome/Edge smoke coverage below is narrower than the full Chromium suite.

Final complete suite started 2026-10-14 T 23: 09: 29.754 Z. Desktop 64 pass/1 skip, tablet 54/11, mobile 55/10. Exact case-level annotations/results/retries:[accounting](qa/milestone-8/browser-accounting.json).

## Earlier runs, real failures and corrections

- Initial complete suite: 172 passed/0 failed/20 skips, zero retries, 27.0 min. This preceded later confirmed GPU/cache/recovery fixes and is not the final gate.
- Intermediate `full-fixed` was deliberately interrupted after a separate probe found the real error-retry defect. CLI reports 79 passes/3 skips; no finalizedJSON. Unreported/in-flight cases are unverified, not assumed passing. Exact lines and interruption reason retained.
- Actual API 500/MySQL 1213 at native DatabaseStore.add during limiter initialization caused an intermediate viewer probe to fail before activation. Bounded atomic-cache retry fix has 6 unit tests and 192/192 expiry-contention 200 responses. Deadlock counter not available.
- Controlled API recovery before fix: FR failed, API reads 9→9. Native Next retry fix: all 3 locale probes recover with actual new reads. Focused recovery regression then failed because its global alert matcher included Next healthy route-announcer. Corrected matcher checks the actual visible localized main error region before retry and its removal afterward; no behavior/assertion weakened. Focused test and final full suite pass all 6 locale/view combinations.
- Failure-fixture startup connection refusal and a later 14.7 s startup exceeding a 5 s readiness probe are retained infrastructure failures before test cases. No application timeout increased. Final stable run waits for actual readiness.
- Initial sandbox build stalled; stopped only owned process and rebuilt under approved local permissions, passed. PHP formatter style findings corrected only changed files; sandbox write rejection resolved with scoped authorized formatter.
- Existing app DBuser CREATE denied; subsequent explicit authorization provisioned new isolated QA only. Unsupported local Innodb_deadlocks status read corrected to record unavailable; no grant changed.
- Extra browser probe initially failed to launch bundled full Chromium (`spawn UNKNOWN`). Inventory-aware run records this as unresolved local executable failure and executes working browsers. No browser/application failures excluded from the record.

## Intentional skips (all 22)

Original 20 skips are unchanged matrix-deduplication / inapplicable viewport cases. New 2 skips avoid concurrently manipulating the shared outage fixture: one desktop-project test itself executes 390/1536 across all three locales.

| Project | Case | Reason |
| --- | --- | --- |
| tablet | catalogue width matrix and screenshots in three languages | Run the complete matrix once. |
| tablet | catalogue works without client JavaScript | Native GET forms covered once. |
| mobile | catalogue width matrix and screenshots in three languages | Run the complete matrix once. |
| mobile | catalogue works without client JavaScript | Native GET forms covered once. |
| desktop | mobile/tablet menu traps focus, navigates and closes with Escape | Desktop uses the visible navigation. |
| tablet | requested widths preserve hero space, typography and layout in every language | Additional widths are covered once. |
| mobile | requested widths preserve hero space, typography and layout in every language | Additional widths are covered once. |
| tablet | product width matrix, screenshots and no initial 3D payload | Complete matrix once. |
| tablet | product photos, details and quotation destination work without JavaScript | SSR native navigation once. |
| mobile | product width matrix, screenshots and no initial 3D payload | Complete matrix once. |
| mobile | product photos, details and quotation destination work without JavaScript | SSR native navigation once. |
| tablet | public page viewport matrix and screenshots | Matrix executed once in desktop project |
| tablet | SSR routes, paginated application products, no-script safety and validation bounds | Matrix executed once in desktop project |
| tablet | localized keyboard retry refetches public content after an API outage | Controlled desktop/mobile recovery matrix runs once against the shared local outage fixture. |
| mobile | public page viewport matrix and screenshots | Matrix executed once in desktop project |
| mobile | SSR routes, paginated application products, no-script safety and validation bounds | Matrix executed once in desktop project |
| mobile | localized keyboard retry refetches public content after an API outage | Controlled desktop/mobile recovery matrix runs once against the shared local outage fixture. |
| tablet | 3D controls, formats, finishes, demand rendering, exports and resource budgets | Desktop and mobile cover the same engine. |
| tablet | 3D responsive and RTL activation matrix | Complete matrix once. |
| tablet | WebGL initialization failure returns an accessible static preview | Failure mode once. |
| mobile | 3D responsive and RTL activation matrix | Complete matrix once. |
| mobile | WebGL initialization failure returns an accessible static preview | Failure mode once. |

## Browser / stability / interaction measurements

| Browser | Actual coverage |
| --- | --- |
| bundled-chromium-headless | 156.0.8078.4; FR/EN/AR 390 px smoke passed |
| chromium | Launch failed: spawn UNKNOWN; not tested |
| firefox | Not installed; not executed |
| webkit | Not installed; not executed |
| system-edge | 155.0.4283.45; FR/EN/AR 390 px smoke passed |
| system-chrome | 155.0.8059.40; FR/EN/AR 390 px smoke passed |

[Browser evidence](qa/milestone-8/stability.json): 24 sequential localized home/catalogue/detail navigations, 0 initial canvases; slow 150 ms/200 KiB/s/CPU 4× home+form checks, no horizontal overflow; no captured page errors. This is a short repeated-navigation probe, not hours-long endurance.

[Form metrics](qa/milestone-8/form-performance.json): three fresh 390 px contexts/locale, real challenge/product reads, typing and invalid-submit validation; no request submitted in timing probe. EventTiming≥16 ms is an interaction proxy, not field INP. Scroll-associated lazy-section shifts are retained and must not be presented as initial-load CLS.

| Locale | Median form-ready ms | Added top-document resource bytes (median) | Max recorded interaction duration ms |
| --- | ---: | ---: | ---: |
| fr | 1011.7 | 98550 | 48 |
| en | 1008.1 | 98420 | 24 |
| ar | 1025.6 | 98702 | 40 |

Cross-origin map iframe reports 0 top-document bytes without Timing-Allow-Origin; its child tile transfer is not counted. Lazy map has no new heavy 3D scene. Existing map URL/visibility/keyboard tests passed. Programmatic scrolling/form expansion produced substantial recorded shifts; a user-driven physical-phone evaluation remains necessary. Initial-page CLS is separately reported per Lighthouse sample.

[3D probes](qa/milestone-8/viewer-cycles-final.json): 8 cycles each 390/1536, software SwiftShader; 18→8 textures, 17 geometries, 8 draw calls unchanged; DPR 1.5 mobile/1 desktop; hidden frames 0; canvas removed after unmount. Interaction 24 rendered frames over recorded dispatch intervals is not GPU frame-time or physical FPS. Small settled heap trend remains; not leak-free/thermal certification. [Pixel/export identity](qa/milestone-8/viewer-comparison.json).

| View width | Median PNG ms / bytes | Median GLB ms / bytes | Blob URLs after unmount |
| --- | ---: | ---: | ---: |
| 390 | 1493.8 / 149018 | 1149.5 / 4680632 | 0 |
| 1536 | 1271.3 / 137003 | 1119.1 / 4680632 | 0 |

Export-to-saved-download timing includes software rendering/browser download; no before/after export-speed claim. Three fresh contexts/viewport, prepared texture blob remains while active, all created URLs revoked after disposal.

## Visual / security / preservation

[Six homepage before/after images](qa/milestone-8/visual/comparison.json): 2/6 pixel-identical; dimensions unchanged. Localized catalogue photos captured after scrolling them into view. Viewer pixels/export data identical at 390/1536. Manual screenshot inspection covers FR desktop homepage, AR mobile catalogue and representative final images. No stylesheet/logo/font/business texture change.

Private original/media/publication, upload/GLB bounds, proxy/origin/CSRF, admin authorization, challenge/rate/transactional quotation/idempotency tests remain intact. Security headers retain staging noindex, report-only CSP, no HSTS. [Source package verification](qa/milestone-8/package-verification.json) scans allowlisted files/configured secrets/client origins; not a penetration test. [Integrity](qa/milestone-8/integrity.json) checks 36 business rowsets, 757 private files, environments/storage archive.

## Unverified / remaining

Final source package: 281 allowlisted files, zero forbidden paths, unsafe modes, missing required files or source mismatches. Configured-secret scans found zero matches in the archive, 24 client JavaScript files and 303 public evidence files; no internal local API origins were found in client chunks. The accepted M7 artifact hash is unchanged. This is a bounded configured-secret scan, not an exhaustive historical secret audit. [Package evidence](qa/milestone-8/package-verification.json).

The synthetic QA admin is deactivated, its password invalidated, its 15 sessions removed and its private credentials file deleted. The QA database/media are retained privately; original accounts are unchanged. Only verified M8-owned listeners were stopped; the existing M7 API remains running. [Cleanup](qa/milestone-8/fixture-cleanup.json), [teardown](qa/milestone-8/teardown.json).

All mobile Lighthouse medians exceed 2.5 s; [actual metrics](milestone-8-optimization-report.md). No physical-device/thermal/field INP/CWV certification, manual screen-reader assessment, Firefox/WebKit coverage, Linux clean-room install, VPS configuration, TLS/session-cookie/backup/restore/rollback verification. Local load is bounded and small-data. [Readiness gates](milestone-8-production-readiness.md). No deploy/M9.
