# TIME STONE backend — local setup

Milestone 5 established this backend. Milestone 6 now connects public Next.js pages and real quotation submission. See [Milestone 6 integration setup](milestone-6-integration-setup.md) for the current two-application configuration and commands.

## Requirements

- PHP 8.3+ compatible with Laravel 13; Composer 2.8+; MySQL 8.0.16+ with enforced CHECK constraints and InnoDB. Tested: PHP 8.3.6, Composer 2.8.2, MySQL 8.3.0, Laravel 13.35.0, Filament 5.10.1, Livewire 4.4.7.
- PHP extensions: PDO/pdo_mysql, mbstring, openssl, tokenizer, XML/DOM, ctype, fileinfo, curl, intl, GD with JPEG/PNG/WebP, zip, bcmath. Configure at least 256 MB PHP memory for larger image uploads. The decoder checks the available memory budget before allocation.
- Node 24 for the existing frontend and browser tests. The backend uses Filament's published assets and local fonts; it needs no Vite build or frontend npm installation.

## Install

From the repository root in PowerShell:

```powershell
cd apps/api
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Create a dedicated development database and user in local MySQL. Replace the password placeholder privately; do not use these grants on an existing business database:

```sql
CREATE DATABASE time_stone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE time_stone_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'time_stone'@'127.0.0.1' IDENTIFIED BY '<unique-local-password>';
GRANT ALL PRIVILEGES ON time_stone.* TO 'time_stone'@'127.0.0.1';
GRANT ALL PRIVILEGES ON time_stone_test.* TO 'time_stone'@'127.0.0.1';
```

Set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in the ignored `.env`. The migrations explicitly use InnoDB, including on WAMP installations whose global default is MyISAM. Never change another project's MySQL configuration or database.

```powershell
php artisan config:clear
php artisan migrate
php artisan db:seed
php artisan time-stone:admin owner@example.test --name="Your administrator name"
php artisan time-stone:serve --host=127.0.0.1 --port=8000
```

The provisioning command asks for a password and confirmation using hidden prompts (14 characters minimum). Use your own administrator email. There is no committed administrator password, public registration, or password-in-command-line option. Super Admin manages administrators and website settings. Content Manager manages catalogue/content/media and reviews quotations, without user/settings access or role escalation. Keep at least one active Super Admin.

Open [the local admin](http://127.0.0.1:8000/admin). `composer dev` is an alternative backend startup command. Both use `time-stone:serve`, which sets a 10 MB per-file upload limit, a 128 MB multipart request limit for multi-image forms, and 256 MB decoding memory on the HTTP child process. These settings apply only to this development server. Plain `php artisan serve` also uses the same project command and limits; `time-stone:serve` is retained as an alias. Configure equivalent limits in the hosting PHP settings for deployment. Start the existing public site from another root terminal using `npm run dev`; its usual URL is [the French homepage](http://localhost:3000/fr).

## Development content

`db:seed` creates reusable definitions, draft page keys and hidden site settings. It creates no users, products, contact values or quotations. For the approved illustrative catalogue/public copy, **local/testing only**:

```powershell
php artisan db:seed --class=DevelopmentDemoSeeder
```

This explicit demo seeder imports the existing temporary WebP files, eighteen illustrative products, six applications and structured localized content. It enables the local read-only API; contact values stay blank. Rerunning it resets the demo entities to the fixture snapshot, so do not rerun it over editorial changes you intend to retain. It refuses production. It creates no quotation records. `scripts/export-backend-fixtures.cjs` regenerates the content snapshot from the existing TypeScript adapters when intentionally updating development fixtures.

Website settings contain a master `Public enabled` switch for the API and a separate contact visibility switch. Production remains hidden until an owner explicitly publishes approved content. Frontend `noindex` protections remain in place.

## Media

Originals and derivatives are under `storage/app/private/media`. **Do not run `storage:link` for these files.** They are delivered by the controlled `/media/{id}/{thumb|preview|texture}` route. Authenticated active administrators can preview draft images; anonymous requests require a published/active public reference and enabled site visibility. Original paths are never exposed by the API.

Uploads accept decoded JPEG, PNG and WebP only: 10 MB, 20 megapixels, 8192 px per side, with an additional runtime memory guard. UUID filenames prevent traversal/extension execution. GD produces 320/1200/2048 px WebP derivatives without upscaling; originals remain private. GLB, SVG, PDF and executable uploads are disabled. Replacing media preserves its ID and shared references, while retaining old originals privately; a production retention policy for replaced source files is still needed. Referenced media cannot be removed.

Failed transaction uploads are removed using Laravel rollback callbacks. Livewire performs temporary-upload expiry; the additional maintenance command is a dry run by default:

```powershell
php artisan time-stone:prune-media
# Review first: --apply removes unreferenced library entries older than seven days
# and temporary uploads older than 24 hours. Unassigned library assets may be intentional.
php artisan time-stone:prune-media --apply
```

## Tests

Copy `.env` to ignored `.env.testing`, set `APP_ENV=testing` and `DB_DATABASE=time_stone_test`. Retain your dedicated local database credentials. Tests refuse a non-MySQL database or a database name not ending in `_test`; they migrate/reset the test database, never the development database. Do not point them at business data.

```powershell
php artisan config:clear
php artisan test
php vendor/bin/pint app database routes tests bootstrap config --test
composer validate --strict
composer check-platform-reqs
```

From the repository root:

```powershell
npm run build
$env:QA_BASE_URL = 'http://127.0.0.1:3001' # separately started production QA server
npm test
npm run test:3d
```

`scripts/admin-qa.mjs` takes a temporary local account through real browser login, product create/edit/upload/publish, Arabic input, quotation review, CSRF rejection and logout. It reads credentials from the ignored path selected by `QA_CREDENTIALS_FILE` and requires a labelled synthetic quote ID in that JSON; no permanent QA account is shipped. Its screenshots/results go into `docs/qa/milestone-5/`. Reprovision disposable QA fixtures before running it; delete them afterward.

## Queue and services

Database cache, encrypted database sessions and database queue tables are included. Current bounded image derivatives run synchronously, so the admin has immediate validation/preview feedback; no worker is needed for current operations. For future queued work use `php artisan queue:work database --tries=3 --timeout=90`. Redis and mail transport are not required. `MAIL_MAILER=array` prevents development messages from being sent. There are no quotation notification jobs or public submission routes.
