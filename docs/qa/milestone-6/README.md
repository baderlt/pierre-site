# Milestone 6 QA evidence

All persistence/admin integration checks use the local Laravel API and real MySQL. Products, enquiries and admin accounts created for QA are synthetic and are removed after verification.

- `end-to-end.json`: real Filament product creation/upload/publication, public Arabic 3D, edit freshness, unpublish and quotation inbox.
- `cms-integration.json`: actual CMS edits, French fallback, approved contact visibility and draft exclusion.
- `persistence-evidence.json`: immutable item snapshot and audited admin status change.
- `network-recovery.json`: rapid submit guard, real persistence with delayed response, exact idempotent retry and empty browser storage.
- `backend-downtime.json`: controlled outage, retained quotation input and no fixture fallback.
- `backend-junit.xml`, `backend-final-targeted.xml`: actual backend test runs (43/226 and 11/58 respectively).
- `frontend-regression.json`: original broad 102-case browser run, including four timeouts and twenty intentional skips. Initial failure contexts are retained in `initial-browser-timeouts/`.
- `final-*.json`: focused browser verification of final edits and affected journeys; these do not replace or hide the broad-run results.
- `build-checks.json`, `client-boundary.json`, `backend-query-measurements.json`, `thumbnail-transfer.json`: build, secret-boundary, query-budget and illustrative thumbnail measurements.
- `screenshots/`: FR/EN/AR desktop 1536 px and mobile 390 px for homepage, catalogue, product, Applications, About, Contact and quotation. These are captures from real CMS-driven pages using labeled development content.
- Root product/viewer/quotation-inbox screenshots: disposable admin/public integration fixture, explicitly QA only.
- `viewer-metrics-*.json`: headless SwiftShader metrics; no physical mobile/GPU memory claim.
- `3d-demonstration.webm` and PNG: interactive procedural viewer recording.
- `performance/`: sequential Lighthouse lab reports and summaries; repeated FR/AR homepage mobile measurements and representative catalogue/product/quotation measurements.

Full viewport matrix captures remain in the existing QA folders: `../refinement` (home), `../milestone-2` (catalogue), `../milestone-3` (product/viewer), and `../milestone-4` (public pages). The executed matrix covers 320, 390, 430, 768, 1024 and 1536 px in all three languages. Historical folder names are retained by the regression harness.

See [the implementation report](../../milestone-6-report.md) for final results, limitations and the approval boundary. Lighthouse/Chromium results are laboratory evidence, not real-user Core Web Vitals or production capacity.
