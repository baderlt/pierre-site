# M8 finalization and deployment-documentation gate

15 October 2026. Local verification only; no deployment, VPS access, production database operation, secret rotation or M9 implementation.

## Preserved application commit

`08f1a35812d05347d67437603a423326649b764b` (`m8 final`) already contains the verified three-line homepage quotation loading-space fix, its delayed-chunk Playwright regression and the final investigation report/evidence. The starting working tree was clean. This commit was preserved, not rewritten or duplicated. The separately completed custom geometry work, original prototype, business content and historical artifacts remain unchanged.

This finalization adds only a fresh verification record. Its commit and the subsequent independent deployment-guide commit are reported in the delivery response; no remote push is authorized or performed.

## Newly executed focused checks

| Check | Actual result |
|---|---|
| Next.js production build | Passed; separate `.next-m8-finalization` output |
| Standalone TypeScript | Passed; generated source pointers/configuration restored |
| Laravel `IntegrationTest` | 13 passed, 75 assertions; guarded isolated MySQL `time_stone_test` |
| Security/map/prototype/viewer/geometry Node tests | 27 passed; no failures/skips |
| Playwright quotation loading transition | 2 passed, no failures/skips/retries; desktop and mobile production preview |
| Git whitespace/diff | Passed; no unrelated application diff |
| Preserved M7/M8 release SHA-256 | Match previous evidence |

Evidence: [new verification directory](qa/milestone-8-finalization/). The initial Laravel/unit invocations did not start because their redirected-output directory was not yet ready; the directory setup was corrected before execution. These are recorded harness invocation errors, not claimed successful checks. All actual tests above subsequently executed and passed. Existing module-format/NO_COLOR/line-ending warnings were not suppressed or fixed outside scope.

No full historical M8 suite or new Lighthouse campaign was repeated. The final investigation's 48 actual Lighthouse audits, 44 passing browser cases/6 intentional skips and 35 Laravel tests/243 assertions remain historical evidence, not relabelled as new results.

## Acceptance boundaries

The loading-layout fix is verified and retained. Mobile LCP **does not meet 2.5 seconds**: final investigation medians FR home 4.211 s, EN home 4.210 s, AR home 4.971 s, FR catalogue 3.700 s, AR catalogue 4.510 s and representative FR detail 4.137 s. Critical image transfer competes with scripts/fonts; Arabic adds font weight. The 16-cycle viewer check retains a small positive settled JS-heap trend without a proven application leak.

No production-equivalent Linux/TLS/HTTP2 delivery, physical-device endurance, field Core Web Vitals, VPS configuration, consistent backup/restore or operational security gate is newly verified. The deployment manual is a prepared operator procedure, not evidence these operations ran. Staging noindex, report-only CSP and the absence of HSTS remain unchanged.

## Commit scope

This verification commit contains this record and its new scoped logs/results only. The PDF/Markdown guide is committed independently. Historical release archives are preserved and are not silently regenerated to include later changes.
