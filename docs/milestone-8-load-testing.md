# Milestone 8 — load testing

## Scope and method

Authorized loopback-only clone `time_stone_m8`, separate private media copy, synthetic users/quotes and reserved test identities. Original users/quotations excluded. No live VPS traffic. Production Next 3033→Apache/PHP 8027, 64 threads/OPcache 256 MB; same installed locks and unchanged 8 s client deadlines/security limits. Windows i7-1165G7/16 GB shared laptop is not a VPS capacity model.

Each read case runs 4×concurrency requests at concurrency 1, 4, 8. Quote writes use bounded concurrency 4 and distinct reserved addresses; intentional real throttling uses one address. HTTP redirects remain visible; authenticated editor responses must contain the actual form. p95/p99 are nearest-rank small-sample statistics. Response bytes here are decoded fetch bodies, not Lighthouse transfer bytes. No source or policy limit changed to make workload pass.

## Executed workloads

| Case | Requests | Concurrency | rps | p50 ms | p95 ms | p99 ms | HTTP statuses |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| home | 4 | 1 | 2.26 | 398.5 | 543.8 | 543.8 | {'200': 4} |
| catalogue | 4 | 1 | 1.75 | 479.2 | 685.0 | 685.0 | {'200': 4} |
| detail | 4 | 1 | 1.61 | 628.2 | 677.4 | 677.4 | {'200': 4} |
| media | 4 | 1 | 3.93 | 247.1 | 272.3 | 272.3 | {'200': 4} |
| api-products | 4 | 1 | 4.23 | 223.0 | 281.9 | 281.9 | {'200': 4} |
| home | 16 | 4 | 3.23 | 1108.4 | 1908.0 | 1908.0 | {'200': 16} |
| catalogue | 16 | 4 | 2.68 | 1373.2 | 2797.6 | 2797.6 | {'200': 16} |
| detail | 16 | 4 | 2.32 | 1722.5 | 1943.1 | 1943.1 | {'200': 16} |
| media | 16 | 4 | 11.78 | 333.4 | 357.9 | 357.9 | {'200': 16} |
| api-products | 16 | 4 | 10.33 | 286.1 | 549.2 | 549.2 | {'200': 16} |
| home | 32 | 8 | 3.46 | 2042.9 | 4106.9 | 4428.8 | {'200': 32} |
| catalogue | 32 | 8 | 2.63 | 2963.6 | 5262.6 | 5765.6 | {'200': 32} |
| detail | 32 | 8 | 2.24 | 3249.6 | 5131.4 | 5758.8 | {'200': 32} |
| media | 32 | 8 | 11.57 | 658.9 | 829.7 | 890.7 | {'200': 32} |
| api-products | 32 | 8 | 13.39 | 551.7 | 731.8 | 746.0 | {'200': 32} |
| concurrent-quotations | 8 | 4 | 17.92 | 205.8 | 227.3 | 227.3 | {'201': 8} |
| same-product-quotation-contention | 8 | 4 | 11.01 | 321.5 | 391.2 | 391.2 | {'201': 8} |
| same-key-concurrent-retries | 4 | 4 | 10.80 | 365.8 | 369.6 | 369.6 | {'200': 3, '201': 1} |
| same-key-conflicting-payload | 1 | 1 | 3.83 | 260.8 | 260.8 | 260.8 | {'409': 1} |
| invalid-quotation-validation | 1 | 1 | 4.06 | 246.4 | 246.4 | 246.4 | {'422': 1} |
| real-rate-limit | 6 | 1 | 4.53 | 223.6 | 242.9 | 242.9 | {'201': 5, '429': 1} |
| admin-editor | 4 | 1 | 2.56 | 319.0 | 497.7 | 497.7 | {'200': 4} |
| admin-editor | 16 | 4 | 8.48 | 445.4 | 575.3 | 575.3 | {'200': 16} |
| admin-editor | 32 | 8 | 11.01 | 717.3 | 884.7 | 933.5 | {'200': 32} |
| during-content-write-1 | 8 | 4 | 10.01 | 257.6 | 559.9 | 559.9 | {'200': 8} |
| during-content-write-2 | 8 | 4 | 7.44 | 246.8 | 1074.7 | 1074.7 | {'200': 8} |

356 workload requests; 0 transport/5xx errors. Expected 422(validation), 409(idempotency conflict), 429(real limit) are preserved protections, not server faults. Setup/challenge/login/follow-up reads are additional and not included in throughput totals.

## Persistence, contention and publication

Eight ordinary and eight same-product requests persisted distinct immutable quotes; four same-key concurrent retries yield exactly one 201 and three duplicate 200 responses sharing one reference hash. Changed payload returns 409, malformed email 422. Real unchanged five/minute rule returns five 201 then 429 with Retry-After. [Persistence](qa/milestone-8/load-persistence.json): 22 rows, 22 unique idempotency keys, 0 duplicate rows. Synthetic fixtures remain in isolated QA only.

Two concurrent content-write rounds update the own QA translation and saved3D scale in a transaction with existing commit observers. Request timestamps prove actual read/write overlap. Fresh follow-up content/scale matches committed values; reads that start after commit must match. Already in-flight reads may legitimately finish with their earlier consistent version. [Timestamp/freshness evidence](qa/milestone-8/concurrent-content-writes.json).

Separate [publication/media/3D proof](qa/milestone-8/synchronization.json): draft 404, publication 200, translation/config fresh, real rendered/exported roughness/scale match, media assignment and same-ID replacement change served/GLB image hashes, revocation makes API/SSR/media 404. The synthetic product is returned to draft.

[192 expiry-contention reads](qa/milestone-8/cache-expiry-stress.json) all 200 after the confirmed native cache-add deadlock correction. Retry unit tests preserve atomic loss-of-race false, unrelated exceptions, enclosing transactions and bounded exhaustion. Local Innodb_deadlocks status counter unavailable; cannot report actual retry/deadlock counts from stress.

## Query and resource evidence

Every API workload sample retains authenticated aggregate Server-Timing query count/database/app times and cache hit/miss headers; raw SQL/bindings/customer data excluded. [Load samples](qa/milestone-8/load.json), [45 query/EXPLAIN profiles](qa/milestone-8/database-profile.json). Warm payloads use 9 bounded queries; cold profiles vary by route 14–32, no measured small-data N+1/index hotspot.

One-second process sampler; peaks and cumulative CPU deltas are not instantaneous CPU percentages. MySQL is shared with retained user applications, so its totals cannot be attributed solely to M8. Sampling cannot exclude brief spikes. [Machine-readable resource summary](qa/milestone-8/load-resources.json).

| Process / PID | Peak working MiB | Peak private MiB | CPU seconds delta | Samples |
| --- | ---: | ---: | ---: | ---: |
| httpd / 11652 | 438.4 | 463.9 | 386.31 | 60 |
| httpd / 18364 | 2.8 | 9.7 | 0.00 | 60 |
| httpd / 21392 | 88.3 | 85.1 | 0.00 | 60 |
| httpd / 30316 | 3.4 | 9.7 | 0.00 | 60 |
| mysqld / 8288 | 4.0 | 713.3 | Unavailable | 60 |
| mysqld / 9368 | 221.1 | 1142.0 | Unavailable | 60 |
| mysqld / 13744 | 8.4 | 33.1 | Unavailable | 60 |
| node / 6652 | 75.1 | 122.3 | 0.00 | 60 |
| node / 8460 | 96.8 | 129.2 | 0.00 | 60 |
| node / 15956 | 167.0 | 189.9 | 0.00 | 60 |
| node / 26368 | 288.9 | 339.5 | 9.12 | 60 |

Higher-concurrency latency/throughput is recorded above without extrapolating sustainable capacity. This bounded run did not establish a saturation threshold, hours-long endurance or PHP-FPM pool sizing. CPU/network/OS buffering and Next/API shared laptop costs remain. No unbounded stress was warranted on the user workstation.

There are clear local contention indicators: catalogue throughput changes from 2.68 to 2.63 requests/s between concurrency four and eight, with p99 rising from 2.80 to 5.77 seconds. Detail throughput changes from 2.32 to 2.24 requests/s with p99 rising from 1.94 to 5.76 seconds. The isolated Apache worker accumulated 386.31 CPU seconds during 60 one-second samples and peaked at 438.4 MiB working memory; Next peaked at 288.9 MiB. MySQL CPU counters are unavailable under the current process access, rather than zero. No grant or infrastructure change was made to obtain them. API timing samples retain the larger application wall time versus measured database execution; this does not justify speculative index changes. Further capacity work needs a representative controlled runtime and dataset.

[Workload assertions](qa/milestone-8/load-validation.json), [original data/media preservation](qa/milestone-8/integrity.json), [test report](milestone-8-test-report.md). No VPS/deployment/M9.
