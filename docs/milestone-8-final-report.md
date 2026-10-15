# Milestone 8 — final report

## Outcome

Local implementation and verification are complete. The approved design, fonts, logo, stone imagery, quotation protections, private media, publication freshness and original prototype are preserved. **The mobile LCP target of 2.5 seconds remains unmet.** M8 establishes measured resource savings and stability fixes. Production infrastructure still requires separate verification and authorization.

## Confirmed bottlenecks and changes

- Catalogue traces showed unnecessary lower-page image transfers and oversized card variants. Reusing existing image deferral and correcting responsive `sizes` reduced mobile transfer by 55–60%, preserving quality and layout.
- The viewer allocated duplicate GPU textures for identical face sources. Sharing color and bump `Source` objects reduced texture count from 18 to 8. Canvas screenshots and exported images, materials and UVs are identical. The original prototype is unchanged.
- Native database-cache initialization deadlocked during rate-limiter expiry. A bounded retry of atomic `add`, outside enclosing transactions, preserves rate rules and quotation atomicity. Six tests / 36 assertions and 192 contention reads passed.
- The error-boundary reset did not refetch restored API content. The native Next retry callback now recovers with keyboard activation in FR/EN/AR at 390 and 1536 px.

Five application files changed: the catalogue route, StoneViewer, error boundary, new RetryingDatabaseStore and AppServiceProvider. Tests and generated type references are listed in the [implementation report](milestone-8-optimization-report.md). No dependency, schema, stylesheet or source-asset changes.

## Final performance

Three samples per important page and cache state, using the concurrent local production runtime, Lighthouse 13.5 / Chrome 156, simulated mobile CPU 4×, RTT 150 ms and 1638.4 Kbit/s, with a fresh browser cache. Warm/cold refers to API payload cache only. There are 171 completed audits, including intermediate candidates; 48 measure the final source. [Individual results, medians and timing breakdowns](qa/milestone-8/performance-comparison.json).

| Page | Before warm LCP s | Final warm LCP s | Final cold LCP s |
| --- | ---: | ---: | ---: |
| home-fr | 4.216 | 4.212 | 4.213 |
| home-en | 4.217 | 4.217 | 4.210 |
| home-ar | 4.967 | 4.963 | 4.968 |
| catalogue-fr | 3.764 | 3.764 | 3.758 |
| catalogue-en | 3.987 | 3.763 | 3.759 |
| catalogue-ar | 4.516 | 4.515 | 4.513 |
| product-fr | 4.137 | 4.142 | 4.211 |
| desktop-fr | 1.810 | 1.757 | 2.045 |

Transfer and GPU allocation reductions are established; a material mobile LCP improvement is not. Critical assets remain: Arabic fonts about 199 KB versus 74 KB for FR/EN, homepage hero about 294 KB, catalogue hero about 245 KB. Hero discovery and priority are already correct; observed render delay is small. Product detail retains a dependent related-results request. Shared-laptop calibration varies, so timing differences are not clean causal improvements. The target remains unresolved, not proven impossible.

## Gates and business workflows

- Laravel: 90 tests / 522 assertions passed. Production build, TypeScript and 15 security/map/3D unit tests passed.
- Full Playwright: 173 passed, 0 failed, 22 intentional skips, zero retries. All skip reasons and earlier interrupted/failed probes are retained. Coverage includes six widths, FR/EN/AR, RTL, keyboard, reduced motion, no-script, SEO, axe, quotations, media, publication and 3D.
- Draft/publication/revocation, cache invalidation, same-ID media replacement and saved 3D configuration verified through API, SSR and actual GLB export on the isolated clone.
- 356 bounded workload requests, zero transport/5xx errors; expected 422/409/429 protections preserved. Twenty-two synthetic quotations persisted with 22 unique keys and no duplicate rows. Authenticated admin reads and two overlapping content-write rounds passed.
- Headless Chrome 156 plus installed Chrome 155 / Edge 155 localized smoke checks passed. Firefox/WebKit are not installed; the separate bundled full-Chromium launch failure is retained. Twenty-four navigations and slow-network checks completed.
- Eight viewer cycles per viewport: hidden rendering zero, one canvas, no remaining blob URLs after disposal. A small heap trend remains; this is not physical GPU, thermal or endurance certification.
- All six homepage captures retain identical layout dimensions. Two are pixel-identical; four have tiny pixel differences (maximum mean channel difference 0.000268 / 255). Viewer captures are pixel-identical. All 36 original business-table snapshots, 757 private files, environments and storage archive are unchanged.

## Deliverables and screenshots

1. [Performance audit](milestone-8-performance-audit.md)
2. [Optimization and before/after measurements](milestone-8-optimization-report.md)
3. [Load testing](milestone-8-load-testing.md)
4. [Production readiness](milestone-8-production-readiness.md)
5. [Tests, failures, skips and browser limits](milestone-8-test-report.md)
6. This final report.

[FR desktop homepage](qa/milestone-8/visual/after/fr-1536.png), [AR mobile homepage](qa/milestone-8/visual/after/ar-390.png), [FR mobile catalogue](qa/milestone-8/screenshots/catalogue-fr-390.png), [AR desktop catalogue](qa/milestone-8/screenshots/catalogue-ar-1536.png), [3D mobile](qa/milestone-8/viewer-final-390.png). Raw Lighthouse HTML, JSON, traces and network evidence are retained under `docs/qa/milestone-8/performance/`. Authenticated traces and private fixture media are excluded from releases. [Source candidate verification](qa/milestone-8/package-verification.json); accepted M7 reports and artifact are preserved.

## Remaining release requirements

The new source candidate contains 281 files with zero exclusion, permission, source-consistency or configured-secret findings. SHA-256: `f3a755e1d1d749debacfe03f90836882b49df046f028aad76da2da17ee8f890a`. The accepted M7 artifact is unchanged. The synthetic QA admin and password are disabled, its sessions and credentials file removed, and M8-owned services stopped. The private isolated QA database/media remain available as evidence; original accounts/data are unchanged. [Cleanup](qa/milestone-8/fixture-cleanup.json), [teardown](qa/milestone-8/teardown.json).

Mobile LCP, shifts during scrolled form expansion and the small 3D heap trend remain documented. Field CWV/INP, physical phones, thermal behavior, long-duration load, manual screen-reader use, penetration testing, Linux clean-room installation and actual VPS readiness remain unverified. The cache-driver registration mirrors locked Laravel 13.35; review compatibility during upgrades.

An explicitly authorized M9 should first execute the accepted read-only staging checklist, verify actual Nginx/PHP-FPM/systemd/MySQL permissions, cookies, proxy headers, TLS and filesystem access, then rehearse consistent encrypted database/private-media backup, restore and quotation-safe rollback in isolated destinations. Review the source candidate, perform a clean locked Linux build, measure actual delivery and phones, and obtain separate operational approval. Preserve split domains, staging noindex, report-only CSP and no HSTS pending review.

No VPS connection, deployment, production secret rotation, M9 or cinematic animation. Stopped for owner review.
