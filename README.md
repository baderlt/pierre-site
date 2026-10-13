# TIME STONE

Next.js public website and Laravel/MySQL/Filament administration, integrated through **Milestone 6**. French is the default; English and Arabic RTL are supported. The approved design and independent `prototype/` are preserved.

Public pages read published Laravel content. Product textures and saved settings drive the lazy 3D viewer. Quotations persist in MySQL and appear in the private admin inbox; there are no notifications, payments or customer accounts.

## Run locally

Start WAMP MySQL, then use two PowerShell terminals:

```powershell
cd 'C:\Users\DELL 7420\Desktop\time-stone\apps\api'
php artisan time-stone:serve --host=127.0.0.1 --port=8000
```

```powershell
cd 'C:\Users\DELL 7420\Desktop\time-stone'
npm.cmd run dev
```

Open http://127.0.0.1:3000/fr and http://127.0.0.1:8000/admin. Use Node 24 and PHP 8.3+. Both private environment files and the database must be configured; see [integration setup](docs/milestone-6-integration-setup.md) for exact settings, alternative ports, first installation, secure administrator provisioning and test commands. No default administrator password is distributed.

For a local production build, stop the frontend development server, then run `npm.cmd run build` and `npm.cmd run start`. QA uses port 3001 with a separate `.next-m6` output directory so the user's development output stays separate.

## Verification and scope

- [Milestone 6 report](docs/milestone-6-report.md): executed tests, screenshots, measurements and limitations.
- [Contract audit](docs/milestone-6-contract-audit.md): DTO, media, cache and submission decisions.
- [Backend API](docs/backend-api.md): versioned public read/submission contracts.
- `npm.cmd run typecheck`, `npm.cmd run test:3d`, `npm.cmd test`; backend `php artisan test` from apps/api against a separate test database.
- `scripts/performance.mjs` measures Lighthouse. Set QA_BASE_URL, QA_ROUTE and QA_OUTPUT_DIR to select a local page and artifact folder.

The eighteen original samples and local editorial imagery remain explicitly illustrative; production excludes illustrative products/applications. No verified specifications, prices, stock, company claims or contact information are invented. Private originals are never exposed. GLB uploads remain disabled; procedural PNG/GLB exports remain available. Development fixtures remain for seed generation and legacy unit tests, with no public runtime fallback.

Original mockup asset provenance is in apps/web/public/images/provenance.json; self-hosted font licenses remain in apps/web/src/fonts. Development noindex/robots restrictions remain. **Stop after Milestone 6; Milestone 7 and deployment require explicit approval.**
