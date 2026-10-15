# Executed local gates

Runtime binaries: bundled Node24.19, WAMP PHP8.3.6, bundled Python; paths/settings are in the M8 audit. Commands ran from the project root unless specified. Environment overrides are process-scoped; values containing secrets are omitted.

- Final production build: `node node_modules/next/dist/bin/next build apps/web`, `NEXT_DIST_DIR=.next-m8`, local server API override. See build-verified.log.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit -p apps/web/tsconfig.json`; exit0 (empty stdout).
- Units: `node --test prototype/tests/stone.test.js tests/stone-engine.test.mjs tests/server-security.test.mjs tests/magasin.test.mjs`; see actual unit log for case identities.
- Backend: PHP `-d post_max_size=128M -d xdebug.mode=off -d memory_limit=256M vendor/bin/phpunit --log-junit ...`, apps/api working directory; enforced time_stone_test, empty DB_URL, separate nonexistent config-cache override.
- Full browser suite: Playwright `test`, all spec.ts, workers2,retries0, QA_BASE_URL=http://127.0.0.1:3033, QA_API_URL=http://127.0.0.1:8027, QA_LOCATION_URL=http://127.0.0.1:3032, QA_FAILURE_BASE_URL=http://127.0.0.1:3035; isolated admin credentials file and QA result/output destinations under M8 only. Exact resolved config/cases are in full-verified.json.
- PHP Pint on the new store,provider and unit test; final passed.
- Additional guarded M8 scripts execute local cache expiry contention,publication/media/config synchronization,export/cycle probes,form/stability/visual/resource measurements,bounded load and read-only original-state hashing. Logs/JSON contain executed results; helpers/private credentials/authenticated traces remain in ignored .tools/m8 and are excluded from source release.

An empty TypeScript log is normal exit0 output; final production build and full regression independently passed. No VPS operation or deployment was executed.
