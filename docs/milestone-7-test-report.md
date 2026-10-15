# Milestone 7 — executed verification report

## Final verification gate — 14 October 2026

**Current local result: 166 passed, zero failed, 20 intentional skips; all 186 current Playwright cases accounted for, 2 workers, zero retries.** Owner approval is still required. No VPS connection/deployment, M8/M9, secret rotation, design/content/font/logo/texture change, HSTS enablement or CSP enforcement occurred.

| Executed check | Actual result | Evidence |
| --- | --- | --- |
| First complete current browser run | 157 passed / 9 failed / 20 skipped; 39.47 min; retries 0 | [Full result](qa/milestone-7-gate/full-1.json) |
| Second complete current browser run | 164 passed / 2 failed / 20 skipped; 32.91 min; retries 0 | [Full result](qa/milestone-7-gate/full-final.json) |
| Affected admin/banner/homepage rerun | 48 passed / 0 failed / 3 existing device skips | [Result](qa/milestone-7-gate/affected.json) |
| Additional Arabic tablet product rerun | 1 passed / 0 failed / 0 skipped | [Result](qa/milestone-7-gate/affected-product.json) |
| Three affected mobile heading reruns | 3 passed / 0 failed / 0 skipped | [Result](qa/milestone-7-gate/affected-offscreen.json) |
| Original repaired local API / historical tablet journey | 1 passed / 0 failed / 0 skipped; 38.5 s | [Result](qa/milestone-7-gate/original-api-smoke.json) |
| All real-map cases after readiness repair | 9 passed / 0 failed / 0 skipped across desktop/tablet/mobile | [Result](qa/milestone-7-gate/affected-map.json) |
| Final complete current browser run | **166 passed / 0 failed / 20 skipped**, 24.99 min; retries 0; no flaky result | [Full result](qa/milestone-7-gate/full-verified.json), [every case/failure/skip](qa/milestone-7-gate/browser-accounting.json) |
| Laravel isolated MySQL regression | **84 tests / 486 assertions**, 0 errors/failures/skips; 310.740 s | [JUnit](qa/milestone-7-gate/backend-complete.xml), [log](qa/milestone-7-gate/backend-complete.log) |
| High-resolution banner recheck | 4 tests / 59 assertions passed with test-process memory 256 MB | [Log](qa/milestone-7-gate/backend-banner.log) |
| Production build / separate TypeScript | Both passed; build compiled in 6.0 s, build TS 5.3 s; localized content remains SSR | [Build](qa/milestone-7-gate/build.log), [TS log](qa/milestone-7-gate/typecheck.log) |
| Unit security/map/original and integrated 3D | **15 passed**, 0 failures/skips: 4 server-boundary + 3 map + 8 engine tests | [Log](qa/milestone-7-gate/units-3d-security.log) |
| Corrected configuration-cache read probe | Same 256 reads: 245 HTTP 200 / 11 HTTP 500 before; **256 HTTP 200** after | [Before](qa/milestone-7-gate/config-probe-before-load.json), [after](qa/milestone-7-gate/config-probe-after-load.json) |
| Admin session/security controls | 20 corrected navigation repetitions passed; missing CSRF 419; isolated context redirects to login; public→admin continuity passed | [Probe](qa/milestone-7-gate/session-probe-after.json) |
| Business/media preservation | 36 original business-table row sets, 757 original private-store files, both environment files and storage.zip unchanged; 27 scoped synthetic quotes and own QA admin removed | [Integrity](qa/milestone-7-gate/integrity.json), [synthetic DB evidence](qa/milestone-7-gate/quotation-persistence.json) |
| Current source candidate | **280 files**; required paths present; no forbidden paths, byte mismatches, configured-secret/QA-password matches or unsafe file modes | [Package checks](qa/milestone-7-gate/package-verification.json), [manifest](qa/milestone-7-gate/release-manifest.json) |

The initial Laravel run aborted at the 128 MB CLI limit while encoding the high-resolution banner. Its [failure log](qa/milestone-7-gate/backend.log) is retained. Only the test-process allowance was changed to 256 MB, matching the prepared PHP-FPM/QA image-processing limit; affected tests and then all 84 backend tests passed. No timeout, production limit or validation protection was relaxed.

### Confirmed session diagnosis and repair

The historical trace shows the authenticated session ID remains decryptable and unchanged. Eight thumbnail responses keep the same CSRF token; `/media/33/thumb` replaces that token and changes from an authenticated private response to a public response, immediately before the protected editor redirects to login. This establishes a session-content reset under the existing cookie. The redirect at **12:35:19.688 UTC** precedes Windows sleep at **12:37:39.392 UTC**; sleep does not explain this admin incident. No CSRF rejection or cookie expiry/context loss is recorded. [Hashed cookie evidence](qa/milestone-7-gate/historical-cookie-trace.json), [power events](qa/milestone-7-gate/historical-power-events.json).

The local Windows Apache configuration supplied a `C:/…` config-cache path which Laravel prefixed with its application base path. The cache file existed, but **was not loaded**. Request-level diagnostics captured inconsistent session-encryption settings and API failures. The prior report's explicit-path setting was insufficient. An application-relative `../../.tools/…` path and a freshly generated private cache correct the confirmed runtime defect; no Laravel/vendor/authentication code was changed. The original owned QA API on port 8011 was also restarted with this exact verified cache, and its historical tablet admin/banner journey passed; WAMP services and the VPS were untouched. All 12640 instrumented PHP requests during the final suite loaded the expected cache with a present key and encrypted sessions; zero sleep events were recorded. [Diagnosis](qa/milestone-7-gate/runtime-diagnosis.json), [final runtime](qa/milestone-7-gate/runtime-final.json).

**Forensic boundary:** the original request's exact encryption/database configuration and contemporaneous session payload were not captured. Configuration drift provides an evidence-supported explanation for the observed session reset, but its precise historical initiating setting cannot be proven retrospectively. No application authentication defect was reproduced after the runtime repair. Local HTTP cookies are HttpOnly/SameSite=Lax/host-only with Secure=false; effective staging HTTPS cookies still require the approved read-only VPS checks.

### Failure accounting and test repairs

The first run is retained as diagnostic evidence: backend/probe jobs overlapped it, and early harness corrections were loaded during investigation. The final two-worker run used the frozen harness with no competing test/probe jobs; it is the uninterrupted gate result. Every run still accounts for all 186 cases, and no case filter was applied to any complete run.

Both old-runtime API failures (desktop banner and Arabic tablet product) and all seven stale-harness failures are retained. The harness now selects the header language control, scrolls/checks the primary section heading, permits only the configured map iframe alongside same-origin app resources, and reads an offscreen heading with `textContent` before comparing it at every width. It also respects current approved location settings and isolates new screenshots by run/project. No app assertions were removed to hide failures. All nine first-run failures and both second-run map failures have passing affected rechecks, followed by the separate complete run. The second run's map failures retained successful embed/CSS/JS responses but no tile requests; screenshots show the lazy form above had shifted the map offscreen. The test now awaits that layout and explicitly verifies the iframe is in the viewport before requiring real tile delivery. No timeout increase, provider mocking, application layout change or tile assertion removal was used. [French failure screenshot](qa/milestone-7-gate/map-failure-fr.jpeg), [Arabic failure screenshot](qa/milestone-7-gate/map-failure-ar.jpeg).

The **20 skips are existing device deduplication**: catalogue 4, homepage 3, product 4, public-pages 4, viewer 5. They retain once-per-matrix or desktop/mobile engine coverage; no failing case was converted into a skip. FR/EN/AR, RTL, desktop/tablet/mobile, 320/390/430/768/1024/1536 px, keyboard/focus, reduced motion, quotation states, original-media denial, publication-aware SEO and activated 3D/export/disposal checks ran. Real quotation browser tests created nine synthetic database rows per complete run, each with an item; cleanup used recorded IDs, exact synthetic identity, start time and original-row hash guards.

### Repeatable local configuration

Windows 10.0.26200, Node 24.19.0, Next 16.4.0, Playwright 1.64.0/Chromium emulation, PHP 8.3.6, Laravel 13.35.0, MySQL 8.3.0. Production output `.next-m7-gate`; main preview `127.0.0.1:3027`, concurrent Apache API `127.0.0.1:8013` (64 threads, OPcache 256 MB, PHP memory 256 MB). Read-only synthetic-location proxy `8023` and fixture preview `3028` do not alter settings. Final run used 2 workers, `--retries=0`, unique artifact directories, a process-scoped idle-sleep guard and no competing test/probe jobs. Host memory evidence: [before](qa/milestone-7-gate/host-before-verified.json), [after](qa/milestone-7-gate/host-after-final.json). Backend tests used only guarded `time_stone_test`; never staging or business-table migrations.

```powershell
node node_modules/@playwright/test/cli.js test --workers=2 --retries=0 --output .tools/m7-gate/full-final-failures
# QA_BASE_URL=http://127.0.0.1:3027; QA_API_URL=http://127.0.0.1:8013
# QA_LOCATION_URL=http://127.0.0.1:3028; QA_EXPECT_MAP_PIN=34.1868599,-4.2459147
# QA_ADMIN_LOCALE_CREDENTIALS: disposable private file, removed after verification
php -d post_max_size=128M -d memory_limit=256M -d xdebug.mode=off vendor/phpunit/phpunit/phpunit
```

### Release, screenshots and remaining limits

The [source candidate](../.tools/m7-gate/source-release.tar.gz) SHA-256 is `7e97fefeef58a68e279c3339d07d6c6f2c7a00ce3b3a8b024c5e9e625cfe1762`. It contains current application source/locks/assets, the approved later magasin migration, the empty bootstrap cache scaffold and the runbook/checklist. It excludes environment secrets, private storage, storage.zip, generated Next/Filament assets, caches, dependencies, QA evidence and traces. Files are `0644`, artisan `0755`; raw Windows metadata had been `0666`. Required source paths and byte identity were checked independently. [Final archive/client/evidence secret scan and report-link checks](qa/milestone-7-gate/handoff-check.json) also pass. Dependency installation, clean-room archive build and Linux extraction/service permissions were **not** executed; those remain separately approved deployment preparation. Configured-value scans do not constitute an exhaustive historical secret audit.

Screenshots: [French desktop](qa/milestone-7-gate/full-verified/desktop/home-fr-desktop.png), [Arabic mobile](qa/milestone-7-gate/full-verified/mobile/home-ar-mobile.png), [desktop activated 3D](qa/milestone-7-gate/full-verified/desktop/milestone-3/viewer-desktop.png). Additional localized/width screenshots are retained under the final run's project directories. The approved UI/assets and original prototype were not changed.

The [Ubuntu staging checklist](milestone-7-staging-readonly-checklist.md) covers Nginx, PHP-FPM, systemd, MySQL grants, sessions/cookies, proxy headers, TLS and filesystem access. **Prepared only; no VPS connection occurred.** Existing staging noindex remains; CSP stays report-only and HSTS remains unapplied. Physical iOS/Android GPUs, manual screen-reader/penetration coverage, deployed grants/cookies/TLS/backup restore and exact historical session configuration remain unverified. Lighthouse was not rerun in this verification gate; historical LCP values below predate the corrected config cache and do not establish current performance or production CWV. No new performance pass is claimed.

Gate changes: `tests/homepage.spec.ts`, `tests/homepage-targeted.spec.ts`, `tests/simple-map.spec.ts`, `tests/fixtures/magasin-proxy.mjs`, `scripts/package-release.py`, this report, the final report, runbook and new staging checklist. The isolated Next build regenerated `tsconfig.json`/`next-env.d.ts` output references. Ignored local QA runtime/support files are excluded from release input.

---

## Historical implementation verification record

The following earlier results remain for audit history; current gate results are above.

14 October 2026. **Local verification is conditional, not a clean production sign-off.** Laravel/build/TypeScript/engine and real data workflows pass. The complete browser run recorded **133 passed, 3 failed, 20 intentional skips**; its exact three failed cases subsequently passed in a separate run. That recheck does not change the complete run into a pass. Mobile LCP remains above 2.5 seconds.

## Original M7 execution — historical

| Check | Actual result | Evidence |
| --- | --- | --- |
| Final Laravel / isolated MySQL | **80 tests / 431 assertions**, zero failures/errors; 140.694 s | [JUnit](qa/milestone-7/backend-final-current.xml) |
| Final focused security/SEO | 7 tests / 28 assertions passed before the final full backend run | [JUnit](qa/milestone-7/backend-focused-final.xml) |
| Database-guard initial negative cases | 4/4 passed; final full suite also includes the fifth whitespace-URL case | [JUnit](qa/milestone-7/database-guard.xml) |
| Production Next build | Passed; compilation 37.7 s, build TypeScript 18.2 s; localized routes remain SSR | [Build log](qa/milestone-7/build.log) |
| Separate final TypeScript | Passed, exit 0 | [Log](qa/milestone-7/typecheck-final.log) |
| Server boundary unit tests | 4 passed, zero failures/skips | [Log](qa/milestone-7/server-security.log) |
| Preserved/integrated 3D unit tests | 8 passed, zero failures/skips | [Log](qa/milestone-7/3d-tests.log) |
| Complete Playwright | **133 passed / 3 failed / 20 skipped**, 156 cases, 45.94 min, one worker, no retries | [Raw result](qa/milestone-7/playwright-full.json) |
| Exact three tablet rechecks | **3 passed**, zero failures/skips, 105.84 s | [Separate result](qa/milestone-7/tablet-recheck.json), [coverage accounting](qa/milestone-7/browser-coverage.json) |
| Runtime concurrency probe | 120 API + 30 SSR + 60 media requests, all 200; maxima 4860 / 4716 / 761 ms | [Probe](qa/milestone-7/runtime-probe.json) |
| Real admin/public/media/3D | Passed, eight workflow checks; actual exported texture hashes and UV/config changes | [Workflow](qa/milestone-7/end-to-end.json) |
| Real quotation recovery | Passed, five checks; same key/reference after uncertain delivery, no false success/storage | [Recovery](qa/milestone-7/network-recovery.json) |
| Real HTTP quote validation/rate/duplicates | 201 / 200 exact retry / 409 conflict / 422 invalid email / 201 / 429; Retry-After 59 s; two synthetic rows | [HTTP/database evidence](qa/milestone-7/http-quotations.json) |
| Immutable quotation configuration | Saved scale 1.25 retained after product scale changed to 1.75 | [Snapshot](qa/milestone-7/persistence-evidence.json) |
| Scoped cleanup and preservation | All 36 original business-table row sets, 460 original referenced file hashes and both environment hashes unchanged; original accounts unchanged | [Integrity](qa/milestone-7/cleanup.json) |
| npm production/all + Composer locked audits | Zero reported advisories on execution date; no dependency upgrades | [npm production](qa/milestone-7/npm-production-audit.json), [npm all](qa/milestone-7/npm-all-audit.json), [Composer](qa/milestone-7/composer-audit.json) |
| Final source package and client boundary | 272 allowlisted source files; no forbidden paths, configured secrets or internal API origin in 22 production client JS files; no broken report links | [Final checks](qa/milestone-7/handoff-check.json), [package verification](qa/milestone-7/packaging-verification.json) |

FR/EN/AR, RTL, URL filters/language preservation, 320/390/430/768/1024/1536 px, keyboard/focus, reduced motion, publication/media revocation, no initial WebGL and activated cleanup/export coverage were exercised. The full run contains 291 isolated PNG artifacts. Automated axe checks in passing journeys are not a manual accessibility certification; the failed cases remain failures, not certified coverage from another device.

## Failures, diagnosis and rechecks

- Initial targeted backend execution: the test temporarily left APP_ENV=production, causing test teardown to request migration confirmation. Restored the test environment in finally; no business database was targeted. [Initial log](qa/milestone-7/interrupted/backend-environment-teardown.log).
- Initial SEO browser test: Playwright serialized a string as valid JSON, producing 422 instead of the intended malformed-body 400. Switched the fixture to raw Buffer bytes; server assertions were not relaxed. [Initial result](qa/milestone-7/seo-targeted.json), [log](qa/milestone-7/interrupted/seo-json-fixture.log).
- First interrupted full attempt: actual local API HTTP 500 / MySQL 1045 with password absent. Attempted to make the cached Laravel configuration path explicit per request (the final gate above later confirmed a Windows path-resolution defect) in the isolated Windows QA Apache configuration. Eight-second deadlines, credentials and application checks stayed unchanged. Bounded transport and the exact English catalogue recheck passed. [Interrupted log](qa/milestone-7/interrupted/browser.log), [catalogue recheck](qa/milestone-7/catalogue-recheck.json).
- Second interrupted full attempt: Windows UNKNOWN file-open error overwriting a historical screenshot. Actual OS-level locking cause was not instrumented. Added opt-in milestone/project artifact paths; the complete 18-layout catalogue matrix passed separately. [Failure](qa/milestone-7/interrupted/catalogue-width-io.md), [log](qa/milestone-7/interrupted/browser-artifact-io.log), [matrix recheck](qa/milestone-7/width-recheck.json).
- Additional section-translation test initially used an unsupported enum value `text`; schema correctly rejected it. Corrected the fixture to `story`, preserving schema validation. [Initial log](qa/milestone-7/interrupted/backend-section-fixture.log).

The **complete** run's three failures were all tablet:

| Failed case | Actual observation | Separate recheck / limitation |
| --- | --- | --- |
| Editable banners | Protected page-section editor redirected to admin login; expected upload label was absent. | Passed in 1.2 min. Session/authentication redirect root cause remains unexplained; it was not reproduced on recheck. Do not attribute it to sleep without evidence. |
| Arabic catalogue journey | Chromium ERR_NETWORK_IO_SUSPENDED. Started 12:37:35.247 UTC and failed after 4147 ms; Windows Kernel-Power event 42 recorded sleep at 12:37:39.392 UTC. | Passed in 27.2 s after recovery. Recorded sleep directly aligns with this failure. |
| French gallery identity | Chromium ERR_ABORTED navigating Applications at 12:40:09 UTC, after the sleep event. | Passed in 7.8 s. Relationship to resume is plausible but was not independently proven. |

No automatic retry, timeout increase, failing-case skip or assertion removal was used. Authentication traces remain in ignored private QA storage because they can contain temporary credentials; they are excluded from release input. The complete failed result is retained. At that initial stage, a clean uninterrupted run was not established; see the final gate above for current evidence.

## Performance — actual laboratory results

54 Lighthouse audits: 18 baseline, 18 final warm-content and 18 final cold-content, three runs for each of six pages/states. Every audit returned HTTP 200, with no Lighthouse run warning. [Raw baseline](qa/milestone-7/performance/before/summary.json), [warm](qa/milestone-7/performance/after/summary.json), [cold](qa/milestone-7/performance/after-cold/summary.json). Each directory retains individual JSON/HTML plus compressed Chrome trace/network logs.

| Page | Baseline median LCP s | Final warm median s | Final cold median s |
| --- | ---: | ---: | ---: |
| French homepage / mobile | 4.039 | 3.926 | 4.077 |
| Arabic homepage / mobile | 4.721 | 4.671 | 4.693 |
| French catalogue / mobile | 3.853 | 3.481 | 3.627 |
| Arabic catalogue / mobile | 3.289 | 3.467 | 4.517 |
| French product / mobile | 4.086 | 4.212 | 4.083 |
| French homepage / desktop | 3.227 | 2.397 | 2.563 |

| Page | Final warm individual LCP s | Final cold individual LCP s | Lighthouse TTFB / observed document server response ms | Warm TBT ms | Warm CLS | Warm KiB |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| French homepage / mobile | 3.920 / 3.926 / 4.070 | 4.077 / 4.225 / 3.936 | 463 / 383 | 214.0 | 0.00000 | 569.7 |
| Arabic homepage / mobile | 4.668 / 4.671 / 4.674 | 4.677 / 4.693 / 4.751 | 462 / 406 | 335.2 | 0.00000 | 691.5 |
| French catalogue / mobile | 3.629 / 3.334 / 3.481 | 3.476 / 3.627 / 3.771 | 502 / 497 | 205.8 | 0.00000 | 1505.9 |
| Arabic catalogue / mobile | 3.176 / 3.474 / 3.467 | 3.175 / 4.517 / 4.529 | 469 / 465 | 106.0 | 0.00000 | 1627.8 |
| French product / mobile | 3.767 / 4.212 / 4.373 | 4.152 / 4.006 / 4.083 | 793 / 791 | 166.0 | 0.00000 | 714.8 |
| French homepage / desktop | 2.267 / 2.648 / 2.397 | 2.563 / 2.521 / 2.645 | 519 / 399 | 12.0 | 0.00030 | 1993.2 |

The TTFB column preserves Lighthouse's reported timeToFirstByte separately from its document-latency serverResponseTime. Neither is added to the simulated LCP. Actual browser navigation/resource timing and LCP subparts are retained independently in [critical path](qa/milestone-7/performance/critical-path-after.json) and the machine-readable [summary](qa/milestone-7/summary.json).

### Configuration and comparability

Windows workstation, Node 24.19.0 / Next 16.4.0 / PHP 8.3.6 / Laravel 13.35.0 / MySQL 8.3.0; database cache/sessions. [Runtime](qa/milestone-7/runtime.json). Local API uses concurrent Apache with 64 threads, isolated OPcache/JIT disabled and a private cached configuration; final request-scoped cache-path setting is in `.tools/m7/apache.conf`. This is not an executed Ubuntu PHP-FPM test. Frontend baseline used preserved M6 build on 3011; final `.next-m7` production build used 3017, both with loopback API 8011. The agent-owned baseline preview was stopped before final measurements; user/VPS services were not changed.

Lighthouse 13.5.0; exact resolved settings/user agent/benchmark index retained per run. Mobile: simulated throttling, 412×823, DPR1.75, RTT150 ms, 1638.4 Kbit/s, CPU4×. Desktop: 1536×1024, DPR1, RTT40 ms, 10240 Kbit/s, CPU1×. Browser storage/cache resets each audit; one sequential browser process per batch. Route API dependencies are primed immediately before each warm sample. Cold evicts only route payload keys, not MySQL/OS/OPcache/process buffers. No build, regression or other agent-owned heavy job ran concurrently with final Lighthouse. [Host before](qa/milestone-7/performance/host-before-final.json), [host after](qa/milestone-7/performance/host-after-final.json).

**Baseline and final CPU calibration differ substantially**, and local runtime configuration was corrected between them. These are measured before/after values, not evidence of a causal page-code speedup:

| Page | Baseline benchmark median | Final warm benchmark median |
| --- | ---: | ---: |
| French homepage / mobile | 541.5 | 2921.5 |
| Arabic homepage / mobile | 537.0 | 2457.0 |
| French catalogue / mobile | 547.0 | 2405.0 |
| Arabic catalogue / mobile | 589.5 | 2583.0 |
| French product / mobile | 556.0 | 2344.0 |
| French homepage / desktop | 586.5 | 2570.5 |

No new image compression, resolution reduction, font substitution, design change or speculative page optimization was adopted. All original media hashes remain unchanged. The already optimized/eager hero is still LCP; fonts remain approximately 73.6 KB French versus 197.7 KB Arabic. Initial Three.js loading stays behind activation. Required asset transfer, framework execution, dynamic response and host variability remain material costs. Some values worsened: Arabic catalogue warm median 3.289→3.467 s and product 4.086→4.212 s. No unfavorable sample was removed.

Independent actual DevTools-throttled homepage probes (one navigation/state, not Lighthouse medians) show:

| Locale | Cold content/browser LCP s | Warm content/browser LCP s | Warm content/fresh browser LCP s |
| --- | ---: | ---: | ---: |
| French | 4.344 | 3.120 | 4.328 |
| Arabic | 4.988 | 3.032 | 4.992 |

Probe network: latency562.5 ms, download1474.56 Kbit/s, upload675 Kbit/s, CPU4×. [Cache/resource evidence](qa/milestone-7/performance/critical-path-after-throttled.json). Fonts/hashed code benefit from browser cache; CMS media remains private/no-store and publication-checked. API probes all returned 200: 49 cache hits median app196.0 / PDO22.4 ms /9 queries; 47 misses app229.1 / PDO32.4 ms /18 queries. PDO timings include driver overhead, not isolated MySQL engine CPU. Root commits in the diagnostic hook are hydration milestones, not proof every boundary finished.

**Mobile ≤2.5 s is unmet in every final warm/cold page median.** This does not prove further improvement impossible. Same-appearance font subsetting, delivery and JavaScript work need validated experiments on a stable host; none is claimed implemented. Lighthouse is laboratory data, not field p75 Core Web Vitals or production capacity. Initial-page audits do not activate 3D; separate viewer resource/heap/activation evidence remains in the browser artifacts, using Chromium/SwiftShader, not physical GPU/VRAM measurements.

## Twenty intentional skips

These are the original applicability gates. No failing case was converted to a skip. Blank source annotations are explained using their executed once-only desktop counterpart.

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
| tablet | public page viewport matrix and screenshots | Project-gated once-only coverage; corresponding desktop case executed. |
| tablet | SSR routes, paginated application products, no-script safety and validation bounds | Project-gated once-only coverage; corresponding desktop case executed. |
| mobile | public page viewport matrix and screenshots | Project-gated once-only coverage; corresponding desktop case executed. |
| mobile | SSR routes, paginated application products, no-script safety and validation bounds | Project-gated once-only coverage; corresponding desktop case executed. |
| tablet | 3D controls, formats, finishes, demand rendering, exports and resource budgets | Desktop and mobile cover the same engine. |
| tablet | 3D responsive and RTL activation matrix | Complete matrix once. |
| tablet | WebGL initialization failure returns an accessible static preview | Failure mode once. |
| mobile | 3D responsive and RTL activation matrix | Complete matrix once. |
| mobile | WebGL initialization failure returns an accessible static preview | Failure mode once. |

## Commands, screenshots and unavailable checks

```powershell
# apps/api; isolated MySQL time_stone_test, no URL override permitted
php -d post_max_size=128M -d xdebug.mode=off vendor/phpunit/phpunit/phpunit --log-junit ../../docs/qa/milestone-7/backend-final-current.xml
# root; bundled Node 24 used for all node commands
node node_modules/next/dist/bin/next build apps/web  # NEXT_DIST_DIR=.next-m7; loopback QA origins
node node_modules/typescript/bin/tsc --noEmit -p apps/web/tsconfig.json
node --test tests/server-security.test.mjs
node --test prototype/tests/stone.test.js tests/stone-engine.test.mjs
$env:QA_BASE_URL='http://127.0.0.1:3017'
$env:QA_API_URL='http://127.0.0.1:8011'
$env:QA_ADMIN_LOCALE_CREDENTIALS='.tools/admin-locale-credentials.json' # deleted after cleanup
$env:QA_ARTIFACT_ROOT='docs/qa/milestone-7/browser-evidence'
$env:QA_TEST_RESULTS='docs/qa/milestone-7/playwright-full.json'
node node_modules/@playwright/test/cli.js test --workers=1
# Exact failed-case recheck used project tablet and a three-title grep; separate result file.
node .tools/m7/performance-final.mjs after
node .tools/m7/performance-final.mjs after-cold all cold
node .tools/m7/path.mjs after
node .tools/m7/path.mjs after-throttled home
```


Real workflow helpers reused existing tested flows with M7 outputs/QA identities. They ran sequentially against 3017/8011, with private credential redaction, before guarded cleanup. No production/VPS fixture was created.

Fresh review screenshots: [French desktop home](qa/milestone-7/performance/after/screenshots/fr-home-1536.png), [French mobile](qa/milestone-7/performance/after/screenshots/fr-home-390.png), [Arabic mobile](qa/milestone-7/performance/after/screenshots/ar-home-390.png), [French desktop catalogue](qa/milestone-7/performance/after/screenshots/fr-catalogue-1536.png), [Arabic mobile catalogue](qa/milestone-7/performance/after/screenshots/ar-catalogue-390.png), [English mobile](qa/milestone-7/performance/after/screenshots/en-home-390.png). [Image source/dimension index](qa/milestone-7/performance/after/screenshots/images.json). Real workflow: [Arabic activated viewer](qa/milestone-7/viewer-ar-390.png), [quotation confirmation](qa/milestone-7/quotation-success-ar-390.png), [media replacement](qa/milestone-7/media-update-1536.png).

Not executed: live VPS deployment/service/configuration operations, Nginx/PHP-FPM/systemd syntax/runtime validation on Ubuntu, production cookie/proxy/firewall/grant verification, backup/restore, physical iOS/Android GPU/thermal checks, Safari/Firefox, manual assistive-technology review, penetration testing and field real-user monitoring. CSP is report-only; enforcement/HSTS remain separately gated. Privacy policy/retention and factual content approval remain owner inputs.
