# Milestone 6 integration setup

The frontend now requires Laravel and MySQL. Public content comes from published database records; quotation submissions are real local records. No production deployment, notifications or Milestone 7 changes are included.

## Existing installation: run two terminals

Start WAMP MySQL. From PowerShell terminal 1:

```powershell
cd 'C:\Users\DELL 7420\Desktop\time-stone\apps\api'
php artisan config:clear
php artisan migrate
php artisan time-stone:serve --host=127.0.0.1 --port=8000
```

From terminal 2:

```powershell
cd 'C:\Users\DELL 7420\Desktop\time-stone'
npm.cmd run dev
```

Open http://127.0.0.1:3000/fr (English /en, Arabic /ar), and http://127.0.0.1:8000/admin. Use Node 24 and PHP 8.3+. On this workstation prepend the bundled Node directory to PATH if the system default remains Node 23:

```powershell
$env:PATH='C:\Users\DELL 7420\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;'+$env:PATH
```

For another port use `node node_modules/next/dist/bin/next dev apps/web --hostname 127.0.0.1 --port 3001`; set SITE_URL and WEBSITE_ORIGIN to that exact browser origin. Stop a server with Ctrl+C. Do not start two servers sharing the same Next output directory. QA uses NEXT_DIST_DIR=.next-m6 separately from the user's .next development output.

For production-mode local verification, stop the development server on the intended port, run `npm.cmd run build`, then `npm.cmd run start`. This is local verification, not deployment.

## First installation and environment

Use the database/user and PHP extension instructions in [backend-local-setup.md](backend-local-setup.md). Install locked dependencies with `npm.cmd ci` at root and `composer install` in apps/api. Copy example environment files only if the private files do not already exist. Never replace an existing APP_KEY or credentials.

`apps/web/.env.local` (server only):

```dotenv
LARAVEL_API_URL=http://127.0.0.1:8000
PUBLIC_MEDIA_ORIGIN=http://127.0.0.1:8000
SITE_URL=http://127.0.0.1:3000
API_TIMEOUT_MS=8000
QUOTATION_PROXY_SECRET=<random-shared-secret>
TRUST_PROXY_HEADERS=false
```

`apps/api/.env` additional integration settings:

```dotenv
APP_URL=http://127.0.0.1:8000
WEBSITE_ORIGIN=http://127.0.0.1:3000
QUOTATION_PROXY_SECRET=<the-same-random-shared-secret>
QUOTATION_RATE_LIMIT=5
PUBLIC_API_RATE_LIMIT=120
CACHE_STORE=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local
MAIL_MAILER=array
```

Generate the shared value privately with a cryptographic password generator (at least 32 random bytes). Do not put it in NEXT_PUBLIC variables, URLs, browser state or documentation. Restart both apps after changing settings. `LARAVEL_API_URL` is an internal origin; `PUBLIC_MEDIA_ORIGIN` validates the origin of controlled derivative URLs returned by Laravel. Browser images use the Next same-origin /media route. Never point either variable at an untrusted host.

Next has no persistent content cache, so no revalidation secret/webhook is required. QUOTATION_PROXY_SECRET authenticates the internal proxy for rate-limit attribution and the separate bounded server-read bucket; it is not an administrator credential. Direct public reads retain their 120/minute/IP limit; authenticated Next server reads share a 6000/minute service limit. Quotations use 5/minute/client identity.

Keep TRUST_PROXY_HEADERS=false for direct development servers. Enable it only behind a reverse proxy that **overwrites** X-Forwarded-For and prevents direct access to Next, otherwise visitors can spoof rate identities. Without that trusted deployment configuration, proxied submissions deliberately share one bucket. Laravel ignores arbitrary X-Time-Stone-Client values unless the shared secret matches. CORS allows only WEBSITE_ORIGIN, with no wildcard or credential support; cross-origin callers never gain admin sessions.

Use separate least-privilege MySQL runtime credentials; migrations require broader schema grants. Keep originals in storage/app/private/media; **do not run storage:link**. No queue worker, scheduler, Redis, SMTP or external notification service is needed for this milestone. Existing database queue configuration is unused by submission.

## Content and administrator provisioning

On a new development installation only, `php artisan db:seed` installs definitions and draft infrastructure. `DevelopmentDemoSeeder` imports the eighteen illustrative products and resets demo entities; never rerun it over editorial work. Then run:

```powershell
php artisan db:seed --class=DevelopmentIntegrationSeeder
php artisan time-stone:admin your-email@example.com --name="Your name"
```

The integration seeder is additive, local/testing only; it imports missing approved images/structured sections and replaces only recognized unchanged legacy demonstration copy. Administrator passwords use hidden prompts. No default administrator or public registration exists. QA accounts and synthetic requests are removed after testing. Publish your own content through Filament and approve contact visibility explicitly. Illustrative products/applications are excluded when APP_ENV=production; noindex remains until a separately approved launch.

Stable CMS section keys retain the approved composition: home hero/collection/quarry/introduction/featured/craft/applications/quality/contact; child quality-item-N, craft-step-N, quality-point-N; about hero/story/material/process/quality/value-N/stage-N; applications hero/gallery/cta; contact hero/enquiry; quote hero; shared navigation/footer/cta. Repeated items are ordinary editable sections. Shared navigation body has six ordered lines; footer body has tagline then supporting information. Fields remain plain text, not executable HTML. Missing translations fall back to French. Missing editorial sections are hidden. Featured homepage cards use published catalogue order; there is no separate merchandising scheduler.

GLB uploads stay disabled. The authenticated admin retains its honest saved-settings preview. A live draft WebGL preview was not added: it would need a separately tested authorized, short-lived cross-app/media channel; draft settings are never exposed publicly.

## Verification

Use an isolated `time_stone_test` MySQL database configured in ignored .env.testing; never point tests at business data. From apps/api run `php artisan config:clear` then `php artisan test`. From root, with both servers running:

```powershell
$env:QA_BASE_URL='http://127.0.0.1:3000'
npm.cmd run typecheck
npm.cmd run test:3d
npm.cmd test
$env:QA_OUTPUT_DIR='docs/qa/milestone-6/performance/home'
node scripts/performance.mjs fr mobile 2
```

Full browser regression submits synthetic enquiries prefixed qa-m6-; use an isolated development database and remove only those fixtures afterward. The specialized Filament scripts expect a privately provisioned disposable account in ignored .tools/qa-m6.json; no password is distributed. They are local QA tools, not public application routes. Network recovery injection delays a real persisted response, rather than mocking persistence. Local Lighthouse and SwiftShader measurements do not establish VPS throughput, real-user Core Web Vitals or physical mobile GPU memory.
