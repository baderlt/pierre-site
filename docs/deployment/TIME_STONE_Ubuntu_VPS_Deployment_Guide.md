# TIME STONE MARBRE & PIERRE

## Ubuntu 24.04 VPS Deployment Guide

Version 1.0 | Generated 15 October 2026 | Prepared locally

Frontend: https://gos-cert.org | API/Admin: https://api.gos-cert.org

Application root: `/var/www/time-stone`

Application baseline: `08f1a35812d05347d67437603a423326649b764b`

Fresh finalization verification: `728e7568dcee67eb8de81f994dca9781349865ad`

> IMPORTANT: This manual prepares future operator actions. No VPS connection, deployment, production database change, secret rotation or remote service modification was performed. Obtain separate explicit authorization before executing operational commands. Staging remains noindex; this document does not authorize a public launch, HSTS or enforced CSP.

[TOC]

# 1. Introduction and Architecture

This manual is specific to the inspected TIME STONE monorepo. Next.js 16.4/React 19.3 renders the multilingual website; Laravel 13/Filament 5 owns content, publication, admin authentication, quotations and private media. MySQL is authoritative. PHP 8.3-FPM executes Laravel behind Nginx. Systemd supervises Next.js; there is no required separate Laravel HTTP service.

```diagram
Public browser --HTTPS--> Nginx gos-cert.org --loopback:3000--> Next.js
Public browser --HTTPS--> Nginx api.gos-cert.org --Unix socket--> PHP-FPM/Laravel
Next.js --HTTPS or loopback:8081--> API Nginx --> Laravel --local TCP--> MySQL
Laravel --filesystem--> private originals, derivatives, approved GLB models
Browser --activation only--> Three.js / React Three Fiber product viewer
```

Public connections are HTTPS on 443, plus HTTP 80 for redirects/ACME. Next's 3000, optional internal Nginx 8081, MySQL 3306 and the FPM socket must not be publicly exposed. With the primary HTTPS API option, Next calls the public API hostname from the server; DNS/TLS/firewall routing must work from that host. It is not automatically an isolated internal channel.

The browser submits to Next `/api/quotations`; Next enforces same Origin, JSON/body and idempotency-key boundaries, then forwards to Laravel `/api/v1/quotations` with the server-only proxy secret. Laravel checks challenge age/expiry, honeypot, rates and authoritative published options; a transaction persists immutable snapshots with duplicate/conflict protection. Filament displays saved requests. SMTP/WhatsApp sending is not enabled; keep `MAIL_MAILER=array`. There is no public quotation-read API.

Media originals reside under Laravel `storage/app/private`. Publicly eligible derivatives are authorized through `/media/{id}/{variant}`; admin cookies authorize additional protected access. The Next same-origin media proxy checks bounds/MIME and returns `private, no-store`. These routes are not a public storage directory.

### Evidence labels and operator decisions

| Label | Meaning |
|---|---|
| Repository-confirmed | Code, locks, configuration or commands inspected locally |
| Owner-provided | `/var/www/time-stone`, `shared/web.env`, the two domains, `time-stone-next.service`, Nginx/PHP 8.3-FPM deployment and previous incident symptoms |
| Proposed fresh-server example | Accounts, groups, RAM sizing, PHP pool sizing, backup paths and release-directory upgrade strategy in this manual |
| Requires VPS verification | Effective units/pools, paths, permissions, DNS/TLS, grants, proxy topology, backup recovery and performance |

Older `deployment/` review templates use `/srv/time-stone/current`, `time-stone-web.service` and `/run/php/time-stone.sock`. They are not evidence of the current VPS. This manual uses the owner-provided direct paths and unit name. Its fresh-server example uses Ubuntu's default `/run/php/php8.3-fpm.sock`; verify the actual pool/socket before adopting it.

### M8 acceptance boundary

The quotation loading-space fix and its regression test are preserved. New finalization checks passed: production build, TypeScript, 13 Laravel tests/75 assertions, 27 unit tests and two desktop/mobile loading tests. Historical final investigation: 48 Lighthouse audits; homepage mobile medians FR 4.211 s, EN 4.210 s, AR 4.971 s. FR catalogue 3.700 s, AR catalogue 4.510 s, FR detail 4.137 s. **The 2.5-second mobile LCP gate is unmet.**

Critical image transfer competes with scripts/fonts; Arabic adds approximately 125 KB of fonts. A small positive JS heap trend remains in repeated viewer cycles without a proven leak. No Linux/TLS/HTTP2 production-equivalent performance, physical-device endurance or field Core Web Vitals is established. Do not use this manual as a production-readiness certificate. See `docs/milestone-8-final-performance-investigation.md` and `docs/milestone-8-finalization.md`.

# 2. VPS Requirements

Suggested planning minimum: 2 vCPU, 4 GB RAM and 40 GB SSD for a small staging installation; recommended starting point: 4 vCPU, 8 GB RAM and 80 GB SSD plus a separate backup destination. These are operator sizing proposals, not measured production capacity. Allow additional free space for two builds, database/media growth, backups and restore rehearsal. Do not rely on swap to make an oversized build reliable.

| Component | Required or verified basis |
|---|---|
| OS | Ubuntu 24.04 LTS; operator verifies patch support |
| Node | Repository engine `>=24 <25`; use a maintained, explicitly pinned Node 24.x release |
| npm | Version shipped with that Node 24 distribution; use committed root lockfile |
| PHP | Composer `^8.3`; guide uses CLI/FPM 8.3; test locked platform requirements |
| Extensions | PDO MySQL, mbstring, XML/DOM, curl, intl, GD with WebP, zip, bcmath; standard ctype/fileinfo/filter/hash/openssl/pcre/session/tokenizer |
| Composer | Composer 2 compatible with the lockfile; never ignore platform requirements |
| MySQL | Real MySQL 8 with enforced CHECK constraints (8.0.16+); local tests used 8.3. Ubuntu 24.04's MySQL 8.0 requires actual migration verification |
| Web/services | Nginx, PHP 8.3-FPM, systemd, OpenSSL and Certbot |
| Access | SSH keys, recovery console, DNS control for both hostnames, approved TLS email |

Do not substitute MariaDB without a separately tested migration/constraint compatibility review.

```sh
lsb_release -a
uname -m
node --version
npm --version
php8.3 --version
php8.3 -m
composer --version
mysql --version
nginx -v
systemctl --version
free -h
df -h /var/www
```

Run `composer check-platform-reqs --no-dev` in `apps/api` after dependency installation. CLI checks do not prove FPM loads the same extensions/limits. Inspect `/etc/php/8.3/fpm` privately and test an approved upload through staging later; never publish `phpinfo()`.

# 3. Initial Server Setup

Fresh server only. Keep the provider recovery console and current SSH session open. For an existing VPS, inventory and approve each change; do not replace existing users, firewall rules or service configuration wholesale.

```sh
sudo apt update
sudo apt upgrade
sudo apt install -y openssh-server ufw nginx mysql-server composer \
  php8.3-cli php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-intl php8.3-gd php8.3-zip php8.3-bcmath \
  php8.3-opcache git curl ca-certificates gnupg xz-utils unzip \
  acl rsync dnsutils certbot
sudo adduser ts-deploy
sudo usermod -aG sudo ts-deploy
sudo groupadd --system time-stone-code
sudo useradd --system --user-group --home-dir /nonexistent \
  --shell /usr/sbin/nologin time-stone
for account in ts-deploy time-stone www-data; do
  sudo usermod -aG time-stone-code "$account"
done
sudo install -d -o ts-deploy -g time-stone-code -m 2750 /var/www/time-stone
sudo timedatectl set-timezone Africa/Casablanca
timedatectl status
```

The timezone above is a proposed business-time display setting. Laravel itself is configured for UTC; do not change application timestamps during deployment. If accounts/groups already exist, inspect them with `id`/`getent` rather than rerunning creation blindly. Restart affected services later so supplementary groups take effect; reconnect the deployment user's session.

Install the operator's verified public key, not a key invented by this guide:

```sh
sudo install -d -o ts-deploy -g ts-deploy -m 700 /home/ts-deploy/.ssh
sudo -u ts-deploy nano /home/ts-deploy/.ssh/authorized_keys
sudo chmod 600 /home/ts-deploy/.ssh/authorized_keys
```

From another terminal, test key login to the approved VPS address before hardening. Add the following to `/etc/ssh/sshd_config.d/00-time-stone-keys.conf` after verifying effective cloud-init settings:

```text
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
```

```sh
sudo /usr/sbin/sshd -t
sudo /usr/sbin/sshd -T | grep -E \
  'pubkeyauthentication|passwordauthentication|permitrootlogin'
sudo systemctl reload ssh.service
```

Do not change SSH ports in this procedure. Ubuntu may use socket activation; inspect `ssh.socket` if binding differs. Do not close the recovery session until a second key login and sudo access work.

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
sudo ufw status verbose
```

> WARNING: Adapt the SSH rule before enabling UFW if the actual SSH port is not 22. Apply equivalent provider firewall rules. Never open 3000, 3306, 8000 or 8081 publicly. Preserve unrelated approved firewall rules on an existing host.

### Install pinned Node 24 without a home-directory dependency

Determine a maintained exact `v24.x.y` from the official Node release index and verify its signing key through the official release-key project. Do not choose the current latest major; this repository excludes Node 25/26. The following placeholders intentionally fail until filled:

```sh
set -euo pipefail
NODE_VERSION='v24.REPLACE_MINOR.REPLACE_PATCH'
case "$(uname -m)" in
  x86_64) NODE_ARCH=x64 ;;
  aarch64) NODE_ARCH=arm64 ;;
  *) echo 'Review unsupported architecture'; exit 1 ;;
esac
NODE_FILE="node-${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"
mkdir -m 700 ~/node-download
cd ~/node-download
curl -fSLO "https://nodejs.org/dist/${NODE_VERSION}/${NODE_FILE}"
curl -fSLO "https://nodejs.org/dist/${NODE_VERSION}/SHASUMS256.txt.asc"
curl -fsSLo node-release-keys.kbx \
  https://github.com/nodejs/release-keys/raw/refs/heads/main/gpg/pubring.kbx
gpgv --keyring "$PWD/node-release-keys.kbx" \
  --output SHASUMS256.txt SHASUMS256.txt.asc
grep -F "  ${NODE_FILE}" SHASUMS256.txt | sha256sum --check --strict -
```

Proceed only after signature and checksum checks succeed; independently review the keyring source/trust. Install as root under `/opt`, then expose stable executable paths:

```sh
sudo tar -xJf "$NODE_FILE" -C /opt --no-same-owner
sudo chown -R root:root "/opt/node-${NODE_VERSION}-linux-${NODE_ARCH}"
sudo ln -s "/opt/node-${NODE_VERSION}-linux-${NODE_ARCH}/bin/node" \
  /usr/local/bin/node
sudo ln -s "/opt/node-${NODE_VERSION}-linux-${NODE_ARCH}/bin/npm" \
  /usr/local/bin/npm
sudo ln -s "/opt/node-${NODE_VERSION}-linux-${NODE_ARCH}/bin/npx" \
  /usr/local/bin/npx
node --version
npm --version
```

Fresh-host symlinks must not already exist. On an existing host, inspect `command -v node` and the running unit first; do not use forced symlink replacement as an unreviewed runtime upgrade. Systemd in Chapter 11 uses `/usr/local/bin/node`; adjust only after verifying the chosen absolute path. `ProtectHome=true` deliberately rules out a service executable in an administrator's NVM home.

# 4. Directory Structure and Ownership

The owner-provided deployment currently uses direct application paths, not a verified atomic-release manager:

```text
/var/www/time-stone/
  package.json, package-lock.json, node_modules/
  scripts/check-production-env.mjs
  apps/web/                 Next source and public assets
    .next/                  one matching production build
    .next/cache/            only Next runtime write area
  apps/api/                 Laravel source and vendor/
    .env -> ../../shared/api.env
    storage -> ../../shared/laravel-storage
    bootstrap/cache/        per-release generated secrets/caches
    public/                 only Laravel public document root
  shared/
    web.env                 owner-confirmed frontend env location
    api.env                 proposed shared Laravel env file
    laravel-storage/        proposed persistent storage location
/var/backups/time-stone/    proposed root-only local backup staging
/var/log/nginx/             Ubuntu Nginx logs
journald                    Next service logs
```

Create shared directories only after cloning into the empty application root (Chapter 5). If migrating existing direct `apps/api/storage`, take a consistent backup and copy into a **new** shared directory before relinking. Never replace a nonempty storage directory with a symlink without verifying its contents and planning downtime.

| Resource | Fresh-server ownership/mode | Intended access |
|---|---|---|
| Source/dependencies/build output | `ts-deploy:time-stone-code`; dirs 2750, files normally 0640 plus required executable bits | Deployment writes; Next and PHP read; Nginx can read public assets |
| `shared/web.env` | `ts-deploy:time-stone`, 0640 | Deployment and Next only |
| `shared/api.env` | `ts-deploy:www-data`, 0640 | Deployment and PHP only |
| Laravel storage | `www-data:www-data`; dirs 2770, files 0640 | PHP writes; authorized operator uses sudo for backup |
| `apps/api/bootstrap/cache` | `ts-deploy:www-data`, 2770; generated files 0640 | Deployment/PHP; not Next |
| `.next/cache` | `time-stone:time-stone`; dirs 2770, files 0640 | Next writes only this cache subtree |
| Backups | `root:root`, dir 0700, files 0600 | Backup/recovery operator only |

Use `umask 0027` for dependency installation/builds. Do not run npm/Composer as root or recursively chown the entire deployment to a web-service account. Source should not be writable by Next/PHP. Do not strip executable bits from dependency binaries with a blanket recursive chmod.

```sh
namei -l /var/www/time-stone/apps/api/public/index.php
namei -l /var/www/time-stone/shared/web.env
stat -c '%U:%G %a %n' /var/www/time-stone/shared/*.env
sudo -u time-stone test -r /var/www/time-stone/shared/web.env
sudo -u www-data test -r /var/www/time-stone/shared/api.env
sudo -u time-stone test ! -r /var/www/time-stone/shared/api.env
```

Each `test` should exit zero in the proposed model. Service users need directory traversal (`x`) as well as file read permissions. This model assumes a dedicated VPS; review group membership and isolation if hosting other applications.

# 5. Clone and Install the Project

As `ts-deploy`, in a new login session with the correct supplementary groups:

```sh
umask 0027
REPO_URL='REPLACE_WITH_APPROVED_REPOSITORY_URL'
RELEASE_REF='REPLACE_WITH_REVIEWED_FULL_COMMIT_OR_TAG'
git clone "$REPO_URL" /var/www/time-stone
cd /var/www/time-stone
git checkout --detach "$RELEASE_REF"
git rev-parse HEAD
git status --short
npm ci --include=dev
```

The root npm workspace manages `apps/web`; the root lockfile is authoritative. `npm run build` at this root invokes the web workspace; do not install independent frontend lockfiles or run a build from an unrelated directory. Do not copy Windows `node_modules`, `vendor`, `.tools`, `.next-*`, QA artifacts or `storage.zip` into a release. Retain build dependencies; pruning them requires a separately tested runtime packaging strategy.

Historical archives remain frozen evidence. For source-artifact deployment, `python3 scripts/package-release.py` is a dry run; an explicit new `--output` creates an allowlisted archive without overwriting. This packager excludes private storage/env, QA and generated Next output; it is not an atomic deployment script. Verify the archive's SHA-256 and file list, extract only into a new empty directory with `--no-same-owner`, and build Linux artifacts there. The source archive does not carry a business database or media backup.

Now create new shared scaffolding and empty secret files; do not run these fresh-only steps over existing data:

```sh
cd /var/www/time-stone
install -d -m 2750 shared
sudo install -o ts-deploy -g time-stone -m 640 /dev/null shared/web.env
sudo install -o ts-deploy -g www-data -m 640 /dev/null shared/api.env
sudo install -d -o www-data -g www-data -m 2770 \
  shared/laravel-storage/app/private \
  shared/laravel-storage/app/public \
  shared/laravel-storage/framework/cache/data \
  shared/laravel-storage/framework/sessions \
  shared/laravel-storage/framework/views \
  shared/laravel-storage/logs
sudo install -d -o ts-deploy -g www-data -m 2770 apps/api/bootstrap/cache
ln -s ../../shared/api.env apps/api/.env
```

Source checkouts contain storage scaffolding. On a **fresh empty** checkout, rename that scaffold before linking rather than deleting it:

```sh
test -d apps/api/storage
test ! -L apps/api/storage
mv apps/api/storage apps/api/storage.fresh-scaffold
ln -s ../../shared/laravel-storage apps/api/storage
```

If any meaningful files already exist in it, stop: this is a migration of storage, not an empty installation. Do not rename a live storage directory under running workers. Source-only archives may omit the directory entirely; then create the link only after verifying absence.

Edit both protected env files using Chapters 7/8 before Composer scripts. Then:

```sh
cd /var/www/time-stone/apps/api
php8.3 /usr/bin/composer install --no-dev --prefer-dist \
  --optimize-autoloader --no-interaction
php8.3 /usr/bin/composer check-platform-reqs --no-dev
php8.3 -r 'exit(function_exists("imagewebp") ? 0 : 1);'
```

Composer post-autoload scripts run package discovery and `filament:upgrade`; they may generate public Filament assets. Do not run `composer setup`: it invokes `key:generate` and is inappropriate for an existing installation. First-install key/database steps follow in Chapters 6/7. Build Next only after the protected frontend environment is complete, using Chapter 8's process-environment procedure.

# 6. MySQL Setup

Fresh installation: inspect service status, bind MySQL locally, run the packaged hardening workflow, and create database-scoped accounts. The following SQL contains placeholders, not real credentials. Enter it in a private DBA terminal with history disabled; never paste real passwords into shell arguments or a public report.

```sh
sudo systemctl status mysql --no-pager
sudo mysql_secure_installation
sudo env MYSQL_HISTFILE=/dev/null mysql
```

```sql
SELECT VERSION();
CREATE DATABASE time_stone
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'time_stone'@'127.0.0.1'
  IDENTIFIED BY 'REPLACE_WITH_PRIVATE_RUNTIME_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON time_stone.*
  TO 'time_stone'@'127.0.0.1';
CREATE USER 'time_stone_migrator'@'127.0.0.1'
  IDENTIFIED BY 'REPLACE_WITH_PRIVATE_MIGRATION_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
  ON time_stone.* TO 'time_stone_migrator'@'127.0.0.1';
```

The runtime account intentionally cannot change schema, create users, grant privileges or read/write arbitrary server files. Migration credentials are separate and used only for approved schema operations. No global `ALL PRIVILEGES`, `FILE`, `SUPER` or `GRANT OPTION` is needed by the app. `127.0.0.1` matches `DB_HOST` TCP; it is not interchangeable with MySQL's `localhost` socket account.

Use a private client login path or protected `--defaults-extra-file` to check actual effective grants. Do not display credential files:

```sh
mysql_config_editor set --login-path=time-stone-runtime \
  --host=127.0.0.1 --user=time_stone --password
mysql --login-path=time-stone-runtime time_stone \
  -e 'SELECT VERSION(), CURRENT_USER(), DATABASE(); SHOW GRANTS;'
```

`mysql_config_editor` obfuscation is not backup encryption; protect the operator home. Preserve the existing production DB name/accounts/credentials when updating; this fresh example is not permission to recreate them.

### Fresh database versus imported business data

For a new empty database, run reviewed migrations using the migrator process below. The inspected migrations create users/sessions/cache/jobs and the domain; add MySQL CHECK bounds; add quotation idempotency; add magasin directions; and add optional product-viewer configuration. The custom-viewer migration backfills legacy availability and explicitly refuses unsafe reversal once feature data exists.

For an existing `.sql` dump, first inspect provenance, checksum, database name, character set, `USE`/`CREATE DATABASE` statements, DEFINERs and migration history. Import only into a **new isolated destination** before any approved cutover. A dump may contain its own `DROP TABLE` or database switch; selecting a DB on the CLI is not a sandbox for arbitrary SQL. Use an isolated rehearsal MySQL instance/account where possible. Never test an import on the live database.

```sh
sha256sum /secure/path/approved-database.sql
# Only after reviewing the SQL and confirming the isolated destination:
mysql --defaults-extra-file=/root/time-stone-restore.cnf \
  time_stone_restore < /secure/path/approved-database.sql
```

For production imports/cutovers, a DBA must approve destination, consistent media set, downtime and recovery plan. Preserve existing `APP_KEY` and proxy secret with the imported encrypted sessions/challenges and data. Do not seed an imported business database.

### Safe migrations

Review `php8.3 artisan migrate:status` and the actual pending migration source. `migrate --pretend --force` is a SQL aid, **not** a sandbox: migration PHP, cache invalidation and callbacks can still execute; inspect on an isolated clone first. Back up DB/media/env consistently before a separately approved live migration. MySQL DDL may auto-commit; rollback is not guaranteed.

Create `/var/www/time-stone/shared/migration.env` as root-only 0600 containing only confirmed `DB_USERNAME` and `DB_PASSWORD` overrides for the migrator. Do not put them into permanent runtime config caches. With a new release's config cache absent:

```sh
sudo systemd-run --wait --pipe --collect --uid=ts-deploy \
  --working-directory=/var/www/time-stone/apps/api \
  --property=EnvironmentFile=/var/www/time-stone/shared/migration.env \
  /usr/bin/php8.3 artisan migrate --force
```

Afterward generate runtime config using the runtime `.env`, not migrator overrides, and verify normal DB reads and grants. Do not run `migrate:fresh`, `migrate:refresh`, test factories, demo seeders or routine `migrate:rollback` on business data. A compatible code rollback or forward fix is preferred when additive schema/new quotations exist.

# 7. Laravel Production Configuration

Protected staging also uses `APP_ENV=production`, not a permissive local environment. Edit `shared/api.env` privately; the example below omits secrets and must not be used unfilled. Names are from actual Laravel/config code.

```dotenv
APP_NAME="TIME STONE"
APP_ENV=production
APP_DEBUG=false
APP_KEY="REPLACE_WITH_EXISTING_KEY_OR_FRESH_GENERATED_KEY"
APP_URL=https://api.gos-cert.org
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
LOG_CHANNEL=single
LOG_LEVEL=warning
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=time_stone
DB_USERNAME=time_stone
DB_PASSWORD="REPLACE_WITH_PRIVATE_RUNTIME_PASSWORD"
DB_URL=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_DOMAIN=null
FILESYSTEM_DISK=local
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=array
BCRYPT_ROUNDS=12
WEBSITE_ORIGIN=https://gos-cert.org
QUOTATION_PROXY_SECRET="REPLACE_WITH_MATCHING_PRIVATE_SECRET_32_PLUS_CHARS"
QUOTATION_RATE_LIMIT=5
PUBLIC_API_RATE_LIMIT=120
TRUSTED_PROXIES=
INTEGRATION_DIAGNOSTICS=false
```

Unquoted `null` for `SESSION_DOMAIN` becomes Laravel null; do not share admin cookies with `.gos-cert.org`. Production code forces Secure/HttpOnly/encrypted/SameSite=Lax sessions. Existing unencrypted sessions may require administrators to log in again after release; do not rotate APP_KEY to troubleshoot redirects. Cookies remain host-only on the API/admin hostname.

`TRUSTED_PROXIES` accepts explicit IP/CIDR entries only, rejecting wildcard/default-route trust. For direct Nginx FastCGI, `REMOTE_ADDR` is already the client; leave the list empty. A real CDN/load balancer requires verified topology/ranges first. Forwarded host is not trusted. There is no backend `PUBLIC_MEDIA_ORIGIN` variable: generated public URLs derive from the canonical request origin. Chapter 9 preserves that for optional loopback transport.

For a **fresh install only** with blank APP_KEY and no encrypted data, after Composer installation:

```sh
cd /var/www/time-stone/apps/api
php8.3 artisan key:generate --force
```

Never run this on an imported/current installation. For a new deployment's shared proxy secret, generate high-entropy material in a private terminal (`openssl rand -hex 32`) and copy it privately to both env files; do not capture it in documentation/logs. Existing deployments preserve the matching secret. No `NEXT_PUBLIC_` secret variable is used.

After reviewed migrations, **only for an empty first installation**, optionally initialize the actual foundation seeder and provision an owner-approved administrator:

```sh
php8.3 artisan db:seed --class=DatabaseSeeder --force
php8.3 artisan time-stone:admin 'REPLACE_WITH_OWNER_EMAIL' \
  --name='REPLACE_WITH_OWNER_APPROVED_NAME' --role=super_admin
```

`DatabaseSeeder` creates master definitions, draft pages and disabled public/contact settings; it does not provide approved business content. Do not run demo fixtures to make a fresh site appear populated. The admin command prompts privately for a confirmed password of at least 14 characters and requires a unique email. Preserve imported accounts rather than creating duplicates. Review/publish real content in Filament only with editorial authorization; until then public API 404 responses are expected.

Prepare per-release caches as `ts-deploy` with `umask 0027`:

```sh
php8.3 artisan time-stone:preflight
php8.3 artisan migrate:status
php8.3 artisan filament:assets
php8.3 artisan config:cache
php8.3 artisan route:cache
php8.3 artisan view:cache
php8.3 artisan time-stone:preflight
```

Expected preflight: every status PASS, including external messaging disabled. It checks configuration, not DB connectivity, grants, firewall, network or backup validity. Config cache contains secrets; keep it private and per release. Do not copy Windows QA caches or share stale `bootstrap/cache` between releases.

Do not run `storage:link`: default Laravel public-disk configuration exists but TIME STONE originals/derivatives are intentionally protected. Do not use `optimize:clear`/`cache:clear` as routine live-release cleanup: shared DB cache holds locks/rate state and content versioning. If a stale local config cache must be removed, use scoped `config:clear` on the inactive candidate under an approved procedure.

Although `QUEUE_CONNECTION=database` and job tables exist, the current quotation/media flow is synchronous. No required queue worker or scheduled task was found. Do not invent a worker/scheduler/Laravel web Systemd service. Media pruning has a separate `--apply` operation; never include it in routine deployment.

# 8. Next.js Production Configuration

Owner-confirmed environment path: `/var/www/time-stone/shared/web.env`. It is a Systemd environment file, not a shell script. Use simple quoted literals, one assignment per line; no `export`, command substitution, shell functions or secret interpolation.

```dotenv
SITE_URL=https://gos-cert.org
PUBLIC_MEDIA_ORIGIN=https://api.gos-cert.org
LARAVEL_API_URL=https://api.gos-cert.org
QUOTATION_PROXY_SECRET="REPLACE_WITH_MATCHING_PRIVATE_SECRET_32_PLUS_CHARS"
API_TIMEOUT_MS=8000
TRUST_PROXY_HEADERS=true
CONTENT_DIAGNOSTICS=false
NEXT_DIST_DIR=.next
```

| Variable | Purpose / validation / confidentiality |
|---|---|
| SITE_URL | Public canonical origin and quote Origin check; preflight requires HTTPS origin, no credentials/path/query/fragment |
| PUBLIC_MEDIA_ORIGIN | Public API/media origin validated against returned media URLs; HTTPS in preflight; not secret |
| LARAVEL_API_URL | Server-side API/media transport; preflight allows HTTPS or explicit HTTP loopback origin; no credentials/path/query/fragment |
| QUOTATION_PROXY_SECRET | Server-only secret; match Laravel; preflight checks presence and length >=32, not entropy |
| API_TIMEOUT_MS | Integer 1000-8000 inclusive; default 8000; do not raise to conceal slow requests |
| TRUST_PROXY_HEADERS | Explicit `true`/`false`; true only with overwriting single-ingress header config and private Next port |
| CONTENT_DIAGNOSTICS | Must not be true in production; aggregated diagnostics off |
| NEXT_DIST_DIR | Actual `next.config.ts` output path, default `.next`; use the same during build/start and cache permissions; preflight does not validate this path |

`TRUST_PROXY_HEADERS=true` above depends on Chapter 9's direct Nginx topology. For an unverified CDN/proxy chain, keep it false until reviewed; the safe shared fallback bucket may throttle unrelated clients, so this is an explicit readiness item, not an excuse to weaken rate limits.

The HTTPS transport is the primary example because the owner reports Laravel reachable at `https://api.gos-cert.org`. **Do not set `127.0.0.1:8000` unless an actual verified API listener is there.** PHP-FPM listens on a Unix socket, not HTTP 8000. Optional `http://127.0.0.1:8081` requires Chapter 9's loopback Nginx server with canonical FastCGI host/scheme. Changing only the URL is insufficient.

`node scripts/check-production-env.mjs` checks process environment; it does not parse `shared/web.env` itself. Systemd loads that file before `ExecStartPre`. Use the same parsing for a secret-safe build, rather than sourcing arbitrary env text:

```sh
sudo systemd-run --wait --pipe --collect --uid=ts-deploy \
  --gid=time-stone-code --working-directory=/var/www/time-stone \
  --property=EnvironmentFile=/var/www/time-stone/shared/web.env \
  --setenv=PATH=/usr/local/bin:/usr/bin:/bin --setenv=NODE_ENV=production \
  /bin/sh -c 'node scripts/check-production-env.mjs && \
    npm run build && npm run typecheck'
```

This proposed operator command builds the direct path only while it is inactive. Chapter 15 replaces the working directory with a new release for updates. Verify all preflight PASS/build exit zero. Do not echo env values or use shell `set -x`.

Build-time configuration includes Next output path, headers/redirects and bundled asset/chunk identity. Server runtime reads include API origins, deadlines and quotation secret; public metadata may also be generated by server code. There are no secret browser `NEXT_PUBLIC_` settings. Do not assume changing env fixes an artifact built with different settings: rebuild in a separate inactive location when needed, keep public origins/output path consistent, then restart the matching artifact. No standalone-output build is configured; the start command needs root `node_modules`.

# 9. Nginx Configuration

These are complete proposed configurations for the specified domains, using the direct root and Ubuntu default FPM socket. They preserve noindex/report-only CSP upstream, no shared API/media cache, bounded request bodies and single-ingress header overwrite. Verify effective PHP pool, installed Nginx and certificate paths before applying. They are not inspected VPS files.

### Bootstrap HTTP and ACME before certificates exist

```sh
sudo install -d -o root -g www-data -m 755 /var/www/letsencrypt
sudoedit /etc/nginx/sites-available/time-stone-bootstrap
```

```nginx
server {
    listen 80;
    server_name gos-cert.org api.gos-cert.org;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files $uri =404;
    }
    location / { return 404; }
}
```

Enable this fresh-server site with `sudo ln -s /etc/nginx/sites-available/time-stone-bootstrap /etc/nginx/sites-enabled/time-stone-bootstrap`, inspect any existing/default server, then `sudo nginx -t` and `sudo systemctl reload nginx`. Do not install the TLS blocks before certificate files exist. The ACME location is a deliberate challenge-only exception, not permission to expose repository dotfiles.

### Final HTTPS configuration

After Chapter 10 issues both certificates, place this in `/etc/nginx/sites-available/time-stone`. Ubuntu 24.04 commonly packages a pre-1.25.1 Nginx: this uses `listen ... http2`, which it supports. On newer Nginx review the newer `http2 on` syntax rather than assuming versions match.

```nginx
server {
    listen 80;
    server_name gos-cert.org api.gos-cert.org;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files $uri =404;
    }
    location / { return 308 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name gos-cert.org;
    ssl_certificate /etc/letsencrypt/live/gos-cert.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gos-cert.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    server_tokens off;
    client_max_body_size 64k;
    proxy_hide_header X-Robots-Tag;
    proxy_hide_header X-Content-Type-Options;
    proxy_hide_header X-Frame-Options;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    location ~ /\. { return 404; }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host gos-cert.org;
        proxy_set_header X-Forwarded-Host gos-cert.org;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Connection "";
        proxy_cache off;
        proxy_buffering off;
        proxy_read_timeout 30s;
    }
}

server {
    listen 443 ssl http2;
    server_name api.gos-cert.org;
    ssl_certificate /etc/letsencrypt/live/api.gos-cert.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gos-cert.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    server_tokens off;
    root /var/www/time-stone/apps/api/public;
    client_max_body_size 128m;
    fastcgi_hide_header X-Robots-Tag;
    fastcgi_hide_header X-Content-Type-Options;
    fastcgi_hide_header X-Frame-Options;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    location ^~ /storage/ { return 404; }
    location ~ /\. { return 404; }
    location ~ \.php$ { return 404; }
    location / { try_files $uri $uri/ /index.php?$query_string; }
    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root/index.php;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_read_timeout 30s;
    }
}
```

No new Nginx static alias is needed for Next: it serves its matching `/_next/static` and `/_next/image` routes through the proxy, retaining built-in asset policy. Laravel public Filament CSS/JS/fonts are served via `try_files`; load Ubuntu's normal `mime.types` in the `http` context. Never route missing JS/CSS to an unrelated SPA HTML fallback. Private media stays in Laravel, never an Nginx storage alias. CSP remains the application's **Report-Only** header; HSTS is deliberately absent.

For IPv6, add matching IPv6 listen directives only after verifying an actual IPv6 address, routing, firewall and AAAA records. Do not publish a broken AAAA record. Keep the default Ubuntu `nginx.conf` includes; do not replace the whole global configuration.

### Optional internal API listener

Use only if explicitly adopted and verified. It goes in the same site file, reuses PHP-FPM and is bound solely to loopback; it is not a Laravel server process:

```nginx
server {
    listen 127.0.0.1:8081;
    server_name api.gos-cert.org;
    root /var/www/time-stone/apps/api/public;
    client_max_body_size 128m;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    location ^~ /storage/ { return 404; }
    location ~ /\. { return 404; }
    location ~ \.php$ { return 404; }
    location / { try_files $uri $uri/ /index.php?$query_string; }
    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root/index.php;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_param HTTP_HOST api.gos-cert.org;
        fastcgi_param SERVER_NAME api.gos-cert.org;
        fastcgi_param SERVER_PORT 443;
        fastcgi_param HTTPS on;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_read_timeout 30s;
    }
}
```

Verify that returned image URLs still use `https://api.gos-cert.org`, then set only `LARAVEL_API_URL=http://127.0.0.1:8081`; keep public origins HTTPS. Do not expose 8081 through UFW/provider rules or bind it to `0.0.0.0`.

Test a saved candidate before enabling/reloading. On a fresh host, remove only the bootstrap site's known symlink after the final site's symlink is installed; do not delete unrelated enabled sites. Retain a backup of the previous configuration.

```sh
sudo ln -s /etc/nginx/sites-available/time-stone \
  /etc/nginx/sites-enabled/time-stone
readlink -f /etc/nginx/sites-enabled/time-stone-bootstrap
# Continue only if that target is the bootstrap file created above:
sudo unlink /etc/nginx/sites-enabled/time-stone-bootstrap
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

Never reload after a failed syntax/certificate/path test. `nginx -T` dumps effective configuration: inspect privately, redact sensitive headers before sharing. HTTP2 in a prepared config does not prove deployed performance improvements.

# 10. SSL and DNS

Set A records for both hostnames to the approved IPv4 address. Set AAAA only with working IPv6. Verify CAA permits Let's Encrypt if CAA is used, and confirm public DNS propagation from independent resolvers. No IP is supplied by this repository.

```sh
dig +short A gos-cert.org
dig +short A api.gos-cert.org
dig +short AAAA gos-cert.org
dig +short AAAA api.gos-cert.org
dig +short CAA gos-cert.org
```

With Chapter 9's HTTP challenge server working and port 80 reachable, issue two named certificates so paths match the TLS example. Certbot prompts for an approved email and terms; do not publish a fabricated company contact.

```sh
sudo certbot certonly --webroot -w /var/www/letsencrypt \
  --cert-name gos-cert.org -d gos-cert.org
sudo certbot certonly --webroot -w /var/www/letsencrypt \
  --cert-name api.gos-cert.org -d api.gos-cert.org
sudo certbot certificates
```

Now install/test/reload the final Nginx config. Keep ACME reachable over HTTP during renewal. Use the Ubuntu apt Certbot installation selected here; do not install a competing snap/pip copy. Inspect the actual timer first:

```sh
systemctl list-timers --all | grep certbot
sudo systemctl enable --now certbot.timer
sudo certbot renew --dry-run
curl --fail --show-error --head https://gos-cert.org/fr
curl --fail --show-error --head https://api.gos-cert.org/up
openssl s_client -connect gos-cert.org:443 \
  -servername gos-cert.org -verify_return_error </dev/null
```

Verify hostname/SAN, chain, expiry, redirects and both IPv4/IPv6 paths. Do not use `curl -k` to hide trust failures. Add a root-owned executable renewal deploy hook only after review: `#!/bin/sh` followed by `/usr/sbin/nginx -t && /usr/bin/systemctl reload nginx`. Test it; a renewed file is not automatically an actively loaded certificate. A dry-run contacts ACME staging and is a future approved operator action, not something executed locally for this manual.

# 11. Systemd and PHP-FPM

### Confirm the backend pool

The existing deployment uses Nginx plus PHP 8.3-FPM. Discover its actual unit/socket before changing it:

```sh
systemctl status php8.3-fpm --no-pager
sudo php-fpm8.3 -t
sudo grep -R '^[[:space:]]*listen[[:space:]]*=' \
  /etc/php/8.3/fpm/pool.d/
sudo ss -lx | grep php
```

For the fresh default `www` pool on a dedicated VPS, verify user/group `www-data`, socket `/run/php/php8.3-fpm.sock` owned/grouped for Nginx access with mode 0660. Apply reviewed upload settings in that pool rather than overwriting all its existing defaults:

```ini
php_admin_flag[display_errors] = off
php_admin_flag[log_errors] = on
php_admin_value[upload_max_filesize] = 10M
php_admin_value[post_max_size] = 128M
php_admin_value[memory_limit] = 256M
php_admin_value[max_execution_time] = 60
php_admin_value[cgi.fix_pathinfo] = 0
```

The private-media ingestor enforces decoded-pixel/memory budgets beyond byte size, so increasing PHP upload limits does not guarantee acceptance. Size `pm.max_children` from measured worker RSS and available RAM; do not copy the older template's four children as proven capacity. Keep OPcache enabled, review timestamp/reload strategy for updates and test configuration before a targeted FPM reload. Never run GLB validation in a root worker.

### Frontend unit: actual owner-provided service name

Proposed adapted file `/etc/systemd/system/time-stone-next.service`:

```ini
[Unit]
Description=TIME STONE Next.js website
After=network.target

[Service]
Type=simple
User=time-stone
Group=time-stone
SupplementaryGroups=time-stone-code
WorkingDirectory=/var/www/time-stone/apps/web
Environment=NODE_ENV=production
Environment=PATH=/usr/local/bin:/usr/bin:/bin
EnvironmentFile=/var/www/time-stone/shared/web.env
ExecStartPre=/usr/local/bin/node \
  /var/www/time-stone/scripts/check-production-env.mjs
ExecStart=/usr/local/bin/node \
  /var/www/time-stone/node_modules/next/dist/bin/next \
  start --hostname 127.0.0.1 --port 3000
Restart=on-failure
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=30
UMask=0027
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/time-stone/apps/web/.next/cache
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6

[Install]
WantedBy=multi-user.target
```

`EnvironmentFile` is required: no leading minus that silently ignores a missing file. PID 1 reads it before launching preflight; root must access it, and the intended service/deploy identities must have their required access. A missing file can fail before `ExecStartPre`. A readable file with invalid values makes preflight fail without printing secrets. An executable under a protected home or a nonexistent Node path can cause a start-pre spawn failure instead.

Create the actual configured runtime cache after the build; do not make the full build writable:

```sh
sudo install -d -o time-stone -g time-stone -m 2770 \
  /var/www/time-stone/apps/web/.next/cache
sudo chown -R time-stone:time-stone \
  /var/www/time-stone/apps/web/.next/cache
sudo systemd-analyze verify /etc/systemd/system/time-stone-next.service
sudo systemctl daemon-reload
sudo systemctl enable --now time-stone-next.service
systemctl status time-stone-next.service --no-pager
sudo ss -ltnp | grep ':3000'
sudo journalctl -u time-stone-next.service -n 80 --no-pager
```

Expected listener: `127.0.0.1:3000`, not all interfaces. With `NEXT_DIST_DIR` different from `.next`, update both cache preparation and `ReadWritePaths`; a nonexistent writable path can fail the namespace setup before Node starts. The 30-second stop budget is a template value, not proof of zero-downtime drain.

For an approved env/build change, validate first, then `sudo systemctl restart time-stone-next.service`. `daemon-reload` rereads unit changes, not application env into an already running process. `systemctl reload` has no custom Next reload operation here. No Laravel HTTP Systemd service is necessary; do not launch `artisan serve` in production to resolve a wrong API URL.

# 12. Media and 3D Assets

| Asset / delivery | Required behavior |
|---|---|
| Originals | Private disk `storage/app/private`; never symlink or alias into public roots |
| Image derivatives | GD-generated WebP quality 90, no upscale; swatch 192, thumb 320, card 640, large 960, preview 1200, texture 2048, banner 2560; existing mobile crops retained |
| Image upload | JPEG/PNG/WebP, <=10 MiB, <=20 million decoded pixels and <=8192 px/side; decode/memory budget also enforced |
| GLB upload | Dedicated model path, <=8 MiB; bounded static GLB 2 validation, embedded permitted JPEG/PNG textures; external/data resources and unsupported scene features rejected |
| GLB delivery | Explicit model approval plus enabled, eligible published product; original remains private; validated derivative `model/gltf-binary`, private/no-store |
| Laravel public image route | Eligible references rechecked; `image/webp`, `public, max-age=0, must-revalidate`; admin/model responses private/no-store |
| Next media proxy | Same-origin `/media/{id}/{variant}`; bounded size/MIME/deadline, no redirects, private/no-store |
| Static web/Filament assets | Public build/source assets only; immutable Next hashes belong to their matching build |

Do not add a generic `/storage` alias, cache all `/media` publicly, rewrite original paths into CDN URLs, or remove publication checks. A downloaded image/model cannot be revoked from a browser; authorization protects future delivery.

New products default 3D OFF. Procedural shapes, per-face materials, selected formats/dimensions and optional validated uploaded GLB use the current typed product contract. The original prototype is a separate reference, not a second site to deploy. Three.js loads on activation, one canvas only, DPR capped at 1.5, hidden rendering paused, resources disposed, and exports remain supported where configured. Preserve geometry/configuration and quotation snapshots during updates.

For missing uploads check DB media rows, private files, ready processing state, published references, approved model flags, filesystem traversal, PHP/GD/WebP support and effective FPM/body limits. File existence alone does not authorize a public URL. Test a known published derivative selected from an actual API response; never guess a business media ID.

```sh
sudo -u www-data test -w /var/www/time-stone/apps/api/storage/app/private
sudo -u www-data test -w /var/www/time-stone/apps/api/storage/framework/views
sudo -u time-stone test -w /var/www/time-stone/apps/web/.next/cache
```

These permission tests do not upload/delete data. Do not run media pruning/re-encoding/replacement or synthetic admin writes as a routine production smoke test.

# 13. Deployment Verification

Perform a read-only first pass. Store sanitized statuses/timings, not cookies, tokens, env values, query bindings or customer payloads. Use `/up` as liveness only; it does not prove DB or media health.

```sh
sudo nginx -t
sudo php-fpm8.3 -t
systemctl is-active nginx php8.3-fpm mysql time-stone-next.service
sudo ss -ltnp
sudo ss -lx | grep php
curl -sS -o /dev/null -w 'status=%{http_code} ttfb=%{time_starttransfer}\n' \
  https://api.gos-cert.org/up
for locale in fr en ar; do
  curl -sS -o /dev/null -w "$locale %{http_code} %{time_starttransfer}\n" \
    "https://gos-cert.org/$locale"
done
curl -sS -D /tmp/time-stone-site.headers \
  'https://api.gos-cert.org/api/v1/site?locale=fr' \
  -o /tmp/time-stone-site.json
curl -sS -o /dev/null -w '%{http_code}\n' \
  'https://api.gos-cert.org/api/v1/products?locale=fr&per_page=1'
curl -sS -o /dev/null -w '%{http_code}\n' \
  https://api.gos-cert.org/admin/login
curl -sS https://gos-cert.org/robots.txt
curl -sS -o /dev/null -w '%{http_code}\n' https://gos-cert.org/sitemap.xml
```

Use private temporary evidence files on a dedicated operator session; published contact JSON may still be business information. Delete only those known temporary files after recording sanitized results, not application files. Expected liveness/admin login: 200; root frontend redirects to `/fr`. Public content endpoints/home/catalogue/details are 200 only with approved enabled/published content. A newly seeded disabled site returns 404 intentionally. A sitemap upstream failure may return 503 rather than a false empty success.

| Check | Expected / method |
|---|---|
| Services | Active; no restart loop; 3000/optional 8081/3306 loopback-only; FPM socket accessible |
| DB | Runtime `SELECT ... CURRENT_USER()`/`SHOW GRANTS`; correct DB and no DDL/global privileges |
| Languages | `/fr`, `/en`, `/ar`; Arabic `html lang=ar dir=rtl`; language switch preserves supported path/query/anchor |
| Catalogue | `/{locale}/products`; real published cards, filters/back-forward/pagination, mobile drawer/keyboard |
| Detail | Use an actual published slug from catalogue; stable image, format/finish and quote configuration |
| 3D | Existing approved enabled product: activation, rotate/zoom/reset/edge, finishes, exports, one canvas; disabled products have no activation |
| Public/private media | Known eligible derivative 200 correct MIME; `/storage/anything` and unauthorized original/unknown variant 404; never publish private admin traces |
| Quotations | `/fr/quote` and homepage lazy form; product/config preservation, validation and recovery. No live POST during read-only checks |
| Filament | Authorized owner login under separate permission; secure host-only cookie; FR/EN/AR; active-account role checks; no anonymous admin data |
| Assets | Inspect actual HTML/Network chunk URLs; JS/CSS 200 with correct MIME; no ChunkLoadError or HTML returned as JS |
| SEO/security | noindex/nofollow, robots disallow, report-only CSP, no HSTS change; correct canonical/public API origins |
| Browser | Desktop/mobile, keyboard/focus, reduced motion, no console/page errors or overflow |
| TLS | Valid SAN/chain/expiry for both domains, redirects, renewal timer and tested renewal hook |

For an actual chunk path copied from this build's browser Network panel, run `curl -I https://gos-cert.org/_next/static/chunks/REPLACE_WITH_ACTUAL_FILE.js`; expect JavaScript MIME, not `text/html`. Likewise inspect an actual CSS file. Never substitute a made-up hash and diagnose its 404 as a build defect.

Real quotation persistence/Filament visibility/rate/idempotency tests require an isolated staging database and synthetic fixtures, or separately approved production submissions with a retention plan. Local regression evidence is not a license to flood the production endpoint or delete real requests.

# 14. Common Errors and Solutions

The incident examples below are owner-reported, not findings from a VPS connection by this task. Check the actual cause before applying a fix.

| Symptom | Likely causes / safe corrective steps | Diagnose, then verify |
|---|---|---|
| HTTP 500 | Laravel config, schema, file access or runtime exception. Inspect private logs; repair only confirmed cause, preserve keys/data; validate config/pending migrations. | `tail -n 80 apps/api/storage/logs/laravel.log`; `php8.3 artisan time-stone:preflight`; repeat failing read-only GET |
| HTTP 502 | Next stopped, wrong upstream port, inaccessible FPM socket or worker failure. Correct upstream/unit/socket after inspection; do not add artisan serve. | `journalctl -u time-stone-next.service -n 80`; `ss -ltnp`; FPM status and Nginx error log; repeat `/up` and `/fr` |
| HTTP 404 | Wrong document root, missing route/asset, disabled public site or unpublished/private content. Distinguish intentional authorization 404 from file routing failure. | `php8.3 artisan route:list`; inspect Filament publication read-only; check actual slug/asset path; verify only authorized content |
| ECONNREFUSED at 127.0.0.1:8000 | Reported incident: no HTTP listener there; PHP-FPM is a socket backend. Use verified HTTPS API origin, or configure/test canonical loopback 8081 first. | `ss -ltnp`; `curl https://api.gos-cert.org/up`; run frontend preflight through env-loaded process; restart approved Next artifact and retest |
| Content service unavailable | API transport/TLS, redirected request, wrong public origin, 404/429/5xx, malformed response or bounded deadline. Diagnose safe error classification; do not increase timeout. | Next journal; bounded API curl from VPS; compare actual env/preflight statuses privately; repeat affected locale route |
| Missing shared/web.env | Reported incident: required EnvironmentFile absent or path/ownership mismatch. Restore correct existing secret file privately, never generate replacements casually. | `namei -l /var/www/time-stone/shared/web.env`; `stat`; `systemctl status`; preflight/start succeeds without secret output |
| Failed to spawn start-pre task | Missing/inaccessible Node executable/script, bad unit WorkingDirectory, ProtectHome restriction or setup failure before task. Restore verified absolute paths. | `systemd-analyze verify`; `namei -l` on executable/script; journal status code; approved restart and preflight PASS |
| ChunkLoadError | Reported asset mismatch: HTML/server and static files from different builds, overwritten live .next, stale browser/proxy HTML. Deploy a matching untouched artifact. | Browser Network actual chunk URLs; `curl -I` on exact file; read BUILD_ID; verify new session plus an old open tab; no shared HTML cache |
| CSS MIME type errors | CSS request received HTML error/fallback, wrong asset root or wrong MIME include. Fix routing/build identity, not nosniff removal. | Network response status/body and `curl -I` on actual CSS; `nginx -t`; CSS 200 correct MIME afterward |
| Missing _next/static | Incomplete release copy, wrong NEXT_DIST_DIR or mismatched service working directory. Restore/build entire matching release, not isolated chunks. | `test -s apps/web/.next/BUILD_ID`; inspect actual dist dir/static files; journal; verify requested chunk and homepage |
| Image-cache EACCES | Reported root-owned .next/cache or systemd read-only path mismatch. Scope ownership/write access to actual cache only. | `namei -l`/`stat`; `sudo -u time-stone test -w .../.next/cache`; inspect ReadWritePaths privately; reload a real optimized image |
| Laravel file-permission error | Missing storage/framework directories, cache owned by wrong account, traversal blocked. Repair only confirmed storage/cache subtree. | `namei -l`; PHP-user read/write `test`; Laravel/FPM logs; repeat request; never chmod 777 |
| MySQL authentication failure | Wrong runtime env/cache, host account mismatch, absent DB password or grants. Privately verify effective identity and restore correct config; no secret rotation shortcut. | Protected client `SELECT CURRENT_USER()`/`SHOW GRANTS`; Laravel config preflight and DB read; no credentials in logs |
| Incorrect PHP version/extensions | CLI differs from FPM; Composer scripts used wrong binary; GD/WebP unavailable. Select tested PHP8.3 path and enable required FPM extensions. | `php8.3 -v/-m`; `composer check-platform-reqs --no-dev`; FPM config test; approved image smoke on isolated staging |
| Unsupported Node version | Repository requires major 24; default Ubuntu Node or newer major incompatible. Install pinned approved 24 under stable path. | `node -v`; unit ExecStart absolute binary; preflight/build/status then actual chunks |
| Failed migrations | Missing migrator grants, unsupported MySQL CHECK syntax, existing inconsistent data or partially applied DDL. Stop writes/deploy; inspect migration status and backup; forward repair with DBA approval. | `migrate:status`; inspect failed migration/log privately; isolated rehearsal; verify constraints and application reads, never migrate:fresh |
| Invalid SSL certificate | Wrong cert path/name/SAN, expiry, incomplete chain or DNS hitting another host. Correct approved certificate/DNS, retain trust checks. | `certbot certificates`; `openssl s_client ... -verify_return_error`; HTTPS without `-k`; verify both hostnames |
| Incorrect DNS | A points elsewhere, broken AAAA, propagation or CAA issue. Fix verified records through DNS operator; do not guess IP. | `dig A/AAAA/CAA` from independent resolvers; compare approved host; verify HTTPS and challenge path |
| Nginx configuration error | Duplicate site/listener, unsupported syntax, missing cert/include or wrong socket. Save candidate, correct specific failure, never reload invalid config. | `nginx -t`; private `nginx -T`; status/error log; successful syntax check then approved reload |
| Missing/inaccessible media | File/reference mismatch, private/draft asset, unsupported variant, processing failure or wrong canonical origin. Preserve storage; restore matching files only from verified backup. | Actual DTO URL and MIME/status; private file metadata; publication/model approval; known eligible derivative 200, originals remain 404 |
| Admin session redirects / 419 | Expired cookie, wrong secure/domain settings, APP_KEY/config inconsistency, CSRF, stale session or concurrent browser state. Collect timestamp/status/cookie attributes; don't assume sleep or weaken CSRF. | Authorized browser + private logs; preflight; consistent key/config across workers; repeat stable navigation/login without exporting cookie values |
| Upload fails above 2 MB | Effective FPM upload limit may differ from CLI/advertised app limit; Nginx/Livewire/decode limits also apply. Match reviewed limits and diagnose actual status before changing anything. | FPM config/body status/logs; image byte/pixel bounds; isolated valid upload; invalid files still rejected |

In commands abbreviated with `...`, substitute the exact confirmed path from the applicable chapter. Logs/config dumps may contain sensitive data; inspect privately and share only sanitized error classes/statuses.

# 15. Updating an Existing Production Deployment

> WARNING: This chapter is a prepared change procedure, not execution approval. The existing owner-provided direct deployment is not proven atomic. Never build over a live `.next`: the running server and old browser tabs can request hashes from a different build, causing missing CSS/JS and ChunkLoadError.

### Inventory and backup gate

Record the current Git SHA, actual release path, Next BUILD_ID, service executable/environment path, PHP pool/socket, runtime versions, DB migration status, free space and sanitized health results. `systemctl cat` and `nginx -T` must be inspected privately; do not paste secrets. Stop if the working tree contains unexplained local modifications or if the backup cannot be restored in rehearsal.

```sh
cd /var/www/time-stone
git rev-parse HEAD
git status --short
cat apps/web/.next/BUILD_ID
systemctl show time-stone-next.service \
  -p User -p Group -p WorkingDirectory -p ExecStart
df -h /var/www /var/backups
```

Identify a verified previous source/build artifact and matching schema compatibility before proceeding. Back up DB/private media/env consistently (Chapter 16); note any quotations accepted after the backup. Preserve APP_KEY, proxy secret, accounts and all uploads. The application has no global maintenance/readonly toggle guaranteed to cover quotation API and admin writes: `artisan down` alone must not be assumed to make a consistent multi-service backup. Use a reviewed ingress write-free window or coordinated snapshots and verify all writers are quiescent.

### Preferred future release-directory model

Proposed layout, not a currently implemented deployment manager:

```text
/var/www/time-stone/releases/<reviewed-sha>/apps/{web,api}
/var/www/time-stone/current -> releases/<reviewed-sha>
/var/www/time-stone/shared/{web.env,api.env,laravel-storage}
```

Adoption changes Nginx root, unit WorkingDirectory/Exec paths and runtime cache path to `current`. It requires its own approved, backed-up conversion of the existing direct tree; do not move `/var/www/time-stone` into itself or replace its live directories with symlinks using this guide blindly. Retain the root's existing paths until conversion is reviewed. The procedure below assumes that conversion has already been authorized and completed.

```sh
set -euo pipefail
ROOT=/var/www/time-stone
RELEASE_REF='REPLACE_WITH_REVIEWED_FULL_SHA'
REPO_URL='REPLACE_WITH_APPROVED_REPOSITORY_URL'
NEW="$ROOT/releases/$RELEASE_REF"
test ! -e "$NEW"
git clone "$REPO_URL" "$NEW"
git -C "$NEW" checkout --detach "$RELEASE_REF"
git -C "$NEW" rev-parse HEAD
ln -s "$ROOT/shared/api.env" "$NEW/apps/api/.env"
```

Handle only the new candidate's empty storage scaffold as in Chapter 5; link it to the verified shared storage. Give it its own private `bootstrap/cache` and Next cache permissions. Install locked dependencies as deploy, not root. Run isolated tests using a separate test DB/storage, never production credentials. Review dependency/runtime changes against both new and rollback artifacts.

Run Chapter 8's env-loaded build with `--working-directory="$NEW"`. For a clean reproducible deployment, the final Linux artifact must not come from a Windows QA output. Run read-only preflight/migration status on the candidate; do not use cached migrator credentials. After backup and explicit migration approval, execute reviewed additive changes using the candidate's directory and temporary migration env. Generate its runtime config/routes/views/Filament assets, then verify old/new code compatibility with the new schema.

### Controlled switch and rollback target

Record the actual old symlink target to a private operator record. Confirm candidate belongs beneath the release root and caches are ready. The following is only for an **already adopted current-symlink layout**:

```sh
set -euo pipefail
ROOT=/var/www/time-stone
OLD=$(readlink -f "$ROOT/current")
NEW="$ROOT/releases/REPLACE_WITH_REVIEWED_FULL_SHA"
test -d "$OLD/apps/web"
test -s "$NEW/apps/web/.next/BUILD_ID"
test ! -e "$ROOT/current.next"
ln -s "$NEW" "$ROOT/current.next"
sudo systemctl stop time-stone-next.service
mv -Tf "$ROOT/current.next" "$ROOT/current"
sudo php-fpm8.3 -t
sudo systemctl reload php8.3-fpm
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl start time-stone-next.service
```

Run all syntax/unit/candidate checks before the stop/switch; the repeated checks here are a final guard. `mv -T` on same-filesystem symlinks is an atomic pointer replacement, **not a zero-downtime guarantee**: the Next stop/start, PHP in-flight requests, old browser chunks and schema writes still require a controlled transition. Keep old artifact directories. For upgrades, an operator-reviewed short maintenance/write-free window is the simplest baseline. If old-tab asset compatibility is required, rehearse retaining/routing old hashed assets; no such multi-build routing is currently implemented. Do not enable shared HTML/API caching to hide the transition.

If the direct layout remains, use an explicitly planned maintenance window, stop Next and quiesce other writers, build into an inactive sibling/release directory, then apply a reviewed direct-path replacement strategy with rollback retained. This manual does not provide a destructive blanket copy/delete command over the live tree. Never silently convert the live filesystem during a routine update.

After switch, perform Chapter 13 checks, inspect sanitized errors/accepted quote counts and record the actual artifact/BUILD_ID. If health fails, stop further release changes and use an approved compatible code rollback; do not automatically reverse schema or restore an old DB over new quotations.

### Compatible code rollback in the adopted layout

```sh
set -euo pipefail
ROOT=/var/www/time-stone
OLD='REPLACE_WITH_RECORDED_ABSOLUTE_PREVIOUS_RELEASE'
test -s "$OLD/apps/web/.next/BUILD_ID"
test ! -e "$ROOT/current.rollback"
ln -s "$OLD" "$ROOT/current.rollback"
sudo systemctl stop time-stone-next.service
mv -Tf "$ROOT/current.rollback" "$ROOT/current"
sudo systemctl reload php8.3-fpm
sudo systemctl start time-stone-next.service
```

Only after confirming schema compatibility, preserved shared env/media and an approved rollback decision. Repeat smoke checks and reconcile quotations accepted since switch. The custom-viewer migration has data-loss guards; `migrate:rollback` is not a safe generic rollback step.

# 16. Backup and Recovery

Define operator, encrypted off-server destination, retention, RPO/RTO and recovery authorization before deployment. A root-only local archive is staging for a backup, not disaster protection. Do not invent retention/RPO guarantees; obtain owner requirements and test recovery.

For an approved consistent write-free window/snapshot, a proposed root-only backup directory:

```sh
sudo install -d -o root -g root -m 700 /var/backups/time-stone
sudo -i
set -euo pipefail
umask 077
BACKUP="/var/backups/time-stone/$(date -u +%Y%m%dT%H%M%SZ)"
install -d -m 700 "$BACKUP"
mysqldump --defaults-extra-file=/root/time-stone-backup.cnf \
  --single-transaction --quick --no-tablespaces \
  --routines --triggers --events time_stone > "$BACKUP/database.sql"
test -s "$BACKUP/database.sql"
gzip "$BACKUP/database.sql"
tar -C /var/www/time-stone/shared -czf "$BACKUP/private-state.tar.gz" \
  laravel-storage api.env web.env
sudo -u ts-deploy git -C /var/www/time-stone rev-parse HEAD \
  > "$BACKUP/release-sha.txt"
sha256sum "$BACKUP/database.sql.gz" "$BACKUP/private-state.tar.gz" \
  > "$BACKUP/SHA256SUMS"
gzip -t "$BACKUP/database.sql.gz"
tar -tzf "$BACKUP/private-state.tar.gz" >/dev/null
sha256sum -c "$BACKUP/SHA256SUMS"
exit
```

The protected defaults file is 0600 and uses a DBA-approved backup identity, not the application runtime account. Dumping routines/events may require additional version-specific grants; verify them and restore those objects in rehearsal, rather than granting global privileges to the runtime user. `--single-transaction` covers transactional DB consistency, not filesystem consistency or concurrent DDL. Do not proceed after a dump's nonzero exit; never call a nonempty partial dump a successful backup.

These commands back up application state, not the whole server. Also retain the reviewed source artifact/Git mirror, matching build or reproducible dependency/runtime manifest, BUILD_ID, and sanitized Nginx/FPM/Systemd configuration. Back up necessary TLS/recovery material privately under the organization's recovery policy. Record their actual locations/checksums; no existing artifact filename or successful off-server copy is assumed.

In an adopted release-directory layout, record Git SHA/BUILD_ID from the actual `current` release; shared-state paths remain under the root's `shared`. Do not add a global Git safe-directory wildcard to bypass an ownership error.

The backup includes plaintext env secrets before encryption. Encrypt the resulting protected backup set using the organization's approved encryption tool/key, then transfer through an authenticated encrypted channel to the approved off-server destination. Do not put secret material in a downloadable public directory, Git, the source release or this manual. Store encryption recovery keys separately and verify decryption/restore. Retention deletion requires explicit policy and verified new backups; no automatic `find ... -delete` recipe is supplied.

### Isolated restore rehearsal

> WARNING: SQL import can drop/overwrite tables. Never run a rehearsal against the live DB or extract an archive over live shared storage. Preserve quotation changes made after the backup before any real recovery.

Prepare a new isolated database/account/media directory or separate disposable MySQL instance. Inspect SQL for embedded `USE`/database changes/DEFINERs before execution. Validate source checksums and decrypt privately. Example commands assume a DBA-reviewed dump containing no destination escape:

```sh
gzip -t /secure/restore/database.sql.gz
gzip -dc /secure/restore/database.sql.gz > /secure/restore/database.sql
mysql --defaults-extra-file=/root/time-stone-restore.cnf \
  time_stone_restore < /secure/restore/database.sql
install -d -m 700 /secure/restore/private-state
tar -xzf /secure/restore/private-state.tar.gz \
  -C /secure/restore/private-state --no-same-owner
```

Inspect archive paths before extraction; ensure no absolute/traversal entries and a new isolated target. Use isolated app env/cache/session/cookie/storage/ports and outbound messaging disabled. Verify table counts, foreign/CHECK constraints, migration history, immutable quotation snapshots, media hashes/references, model approval and authorized admin/public flows. Only synthetic writes belong in a rehearsal. Record elapsed restore time and failures; integrity checks alone do not prove recovery.

For an actual disaster, freeze affected writes with approval, retain failed-state artifacts/logs and post-backup quote records, restore verified DB/media/env into a new destination, reconcile deltas, validate, then switch approved config/services. Never regenerate APP_KEY to read restored encrypted state. Prefer compatible code rollback when data is healthy. Restore/reconciliation decisions are separate from routine deployment authorization.

# 17. Security Checklist

| Check | Concrete release gate |
|---|---|
| Secrets | No `.env`, private storage, QA credentials or storage.zip in source artifact; protected env/cache/backup permissions; server-only proxy secret matches |
| Key preservation/rotation | Preserve APP_KEY/proxy secret during normal updates; rotation requires separate impact, encryption/session/challenge and rollback review |
| SSH | Verified key login and recovery console before disabling password/root login; current effective sshd config tested |
| Firewall | Only approved SSH/80/443 ingress; Next/MySQL/internal listener private; provider rules agree |
| TLS | Both names trusted, renewal timer/hook tested, no bypassed certificate checks |
| Application | APP_ENV production, APP_DEBUG false, diagnostics off, array mailer; both production preflights pass |
| Database | Runtime CRUD only on correct DB; migration/backup identities separate and scoped; no global administration for app |
| Filesystem | Source read-only for services; only Laravel storage/cache and Next runtime cache writable; no 777 |
| Admin | Active role-gated accounts, hidden-password provisioning, native CSRF/session/throttle; HTTPS host-only secure cookies |
| Publication | Dates/parent/master visibility and after-commit cache invalidation retained; no proxy cache serving stale drafts |
| Upload/model | Decode/byte/pixel/memory bounds, constrained GLB parser and approval retained; originals inaccessible |
| Quote workflow | Same-Origin JSON/body checks, private proxy auth, challenge/honeypot/rates, idempotency/conflict/transaction protections preserved |
| Logs | No quote bodies, auth headers, raw keys, bindings or cookies in exported evidence; access/rotation protected |
| Dependencies | Locked installs; review current advisory results and upgrade intentionally; do not confuse historical clean scans with current assurance |
| SEO/header policy | Staging noindex remains; CSP stays report-only; HSTS/enforced CSP/indexing require separate approval |

The private proxy credential authenticates trusted server attribution; it does not make every public request trusted or replace quotation validation. Without verified single-client-IP forwarding, clients fall into a safe shared rate bucket. No wildcard proxy trust, disabled CSRF or disabled upload validation is an acceptable operational shortcut.

Review dependency advisory output privately on the candidate (`npm audit`, `composer audit --locked` where supported). These commands contact registries and are future operator actions; they were not newly executed on a VPS for this manual. A successful scan does not certify absence of vulnerabilities. Privacy-policy text, retention rules, admin access ownership and abuse/monitoring policy remain owner decisions, not invented content.

# 18. Maintenance and Monitoring

```sh
sudo journalctl -u time-stone-next.service --since '30 minutes ago'
sudo journalctl -u php8.3-fpm --since '30 minutes ago'
sudo tail -n 80 /var/log/nginx/error.log
sudo tail -n 80 /var/www/time-stone/apps/api/storage/logs/laravel.log
systemctl show time-stone-next.service -p NRestarts -p ActiveState
df -h /var/www /var/backups
free -h
sudo du -sh /var/www/time-stone/shared/laravel-storage
systemctl list-timers --all | grep certbot
sudo certbot certificates
```

Inspect effective Nginx/FPM log destinations if they differ from Ubuntu defaults. Access logs can contain IPs/query data; define access and retention. Use existing `logrotate`/journald policies, test candidate rotation with `logrotate -d`, and do not truncate active logs to hide failures. No unreviewed external notification or paid monitor is required.

Track bounded HTTP 5xx/429 rates and latency by route/locale, restarts, disk/inodes, worker memory, DB connectivity, certificate expiry and backup age plus restore-test status. Do not flood `/api/quotations` as a health probe. `/up` liveness plus safe site/known-media reads exercise more of the path without writes.

Database maintenance/major upgrades/OPTIMIZE TABLE can lock or rebuild tables; schedule only after DBA review/backup. Do not install a scheduler or queue worker unless new approved application work requires it. Pruning private media is a separate retention-controlled operation.

Performance follow-up needs comparable warm/cold content and browser-cache states, fixed network/CPU settings, individual samples/calibration, server/API/DB timing and physical-device testing. Measure Linux/TLS/HTTP2 rather than assuming it fixes local Windows LCP. Keep approved image/typography quality, publication freshness and quotation/private-media protections. Field Core Web Vitals requires real-user collection and an approved privacy plan; a Lighthouse score is not field evidence.

# 19. Final Deployment Checklist

Print and record operator, date, approved change reference, reviewed source SHA and rollback target. Mark each item pass/fail/not inspected; a blank item is not a pass.

### Before deployment

- [ ] Separate VPS/change authorization names the host, scope and maintenance window.
- [ ] Current Git SHA, BUILD_ID, unit, pool/socket and private env paths recorded.
- [ ] Required Node 24/PHP8.3/Composer/MySQL platform versions confirmed.
- [ ] Reviewed source has no unexplained working-tree changes or private QA files.
- [ ] Existing APP_KEY, proxy secret, business DB, accounts and storage preserved.
- [ ] Consistent DB/media/env backup integrity and isolated restore rehearsal verified.
- [ ] New candidate and compatible rollback artifact have adequate disk/RAM space.
- [ ] Pending migrations/dependency changes/lock duration reviewed on isolated data.
- [ ] Both env preflights pass with status-only output and correct transport.
- [ ] Approved content/publication state known; no demo seeding needed.
- [ ] Staging noindex/report-only CSP/no-HSTS policy remains explicit.

### During deployment

- [ ] New dependencies/build run as deploy user, never over the live `.next`.
- [ ] Reviewed write-free/snapshot plan covers Next quotations and admin/API writers.
- [ ] Migration uses scoped temporary identity; runtime cache uses runtime identity.
- [ ] Shared media/env links and per-release private caches verified.
- [ ] Next cache only is writable by Next; PHP storage/cache only by PHP/deploy.
- [ ] Nginx/FPM/Systemd candidate configuration tests pass before changes.
- [ ] Only approved named services are restarted/reloaded.
- [ ] Release switch/old target/time recorded; no blind schema rollback or data restore.

### After deployment

- [ ] Services active, no restart loop and direct upstream ports inaccessible publicly.
- [ ] TLS, DNS, redirects and renewal timer/hook verified for both names.
- [ ] `/fr`, `/en`, `/ar`, catalogue and a real published detail pass.
- [ ] Arabic RTL, language selection, keyboard/mobile/reduced motion verified.
- [ ] Real JS/CSS hashes and MIME types match the running build; old-tab behavior reviewed.
- [ ] Public eligible media works; private originals/drafts remain denied.
- [ ] Enabled/disabled 3D behavior, controls/exports and hidden pause verified on staging.
- [ ] Quote UI/recovery verified without unapproved live test submissions.
- [ ] Authorized admin session/cookie/role behavior verified without exporting secrets.
- [ ] Sanitized errors/quotations since switch reviewed and backup monitoring active.
- [ ] Mobile LCP gate remains unmet unless new documented measurements prove otherwise.
- [ ] Owner receives actual results/limits; deployment is not labelled launch approval.

# 20. Quick Command Reference

Commands are for a separately authorized operator on confirmed paths. Replace example paths for an already adopted release layout; do not mix direct-root and current-symlink commands.

| Purpose | Command / safe context |
|---|---|
| Status | `systemctl status time-stone-next.service nginx php8.3-fpm mysql --no-pager` |
| Next restart | `sudo systemctl restart time-stone-next.service` after matching build/env validation |
| Nginx test/reload | `sudo nginx -t` then `sudo systemctl reload nginx` only on success |
| FPM test/reload | `sudo php-fpm8.3 -t` then `sudo systemctl reload php8.3-fpm` |
| Laravel preflight | `cd /var/www/time-stone/apps/api` then `php8.3 artisan time-stone:preflight` |
| Migration inventory | `php8.3 artisan migrate:status`; migration execution only Chapter 6 gate |
| Runtime caches | `php8.3 artisan config:cache`, `route:cache`, `view:cache` on inactive candidate with runtime env |
| Node build | Root `npm ci --include=dev`; env-loaded `npm run build && npm run typecheck` via Chapter 8 |
| File access | `namei -l PATH`; `stat -c '%U:%G %a %n' PATH`; service-user `test -r/-w` |
| API liveness | `curl --fail --show-error https://api.gos-cert.org/up` |
| Content read | `curl --fail 'https://api.gos-cert.org/api/v1/site?locale=fr'` after publication |
| TLS | `sudo certbot certificates`; `openssl s_client` with SNI/verify as Chapter 10 |
| Next logs | `sudo journalctl -u time-stone-next.service -n 80 --no-pager` |
| Laravel logs | Private `tail -n 80 apps/api/storage/logs/laravel.log` |
| Backup | Protected defaults file + `mysqldump --single-transaction`; full consistent procedure Chapter 16 |
| Rollback | Recorded compatible artifact, shared state preserved, approved pointer/service procedure Chapter 15; no automatic DB rollback |

### Source register and final handoff

Repository authorities inspected: root/workspace package manifests and locks; `apps/web/next.config.ts`, `src/lib/server-config.ts`, `src/lib/api.ts`, API quotation/media routes; Laravel Composer/config/bootstrap/routes/providers; production preflight/admin commands; migrations through `2026_10_15_000100_add_optional_product_viewer.php`; `MediaLibrary`, `GlbValidator`, `MediaController`, quotation boundary/controller; existing deployment templates and release packager; M7 security/deployment reports and M8/custom-geometry reports/evidence.

External primary references consulted on 15 October 2026 (recheck against installed versions):

- [Ubuntu firewall administration](https://ubuntu.com/server/docs/how-to/security/firewalls/)
- [Ubuntu OpenSSH administration](https://ubuntu.com/server/docs/how-to/security/openssh-server/)
- [Node official binary verification](https://github.com/nodejs/node#verifying-binaries)
- [Node release signing keys](https://github.com/nodejs/release-keys)
- [Nginx HTTP2 module and syntax versions](https://nginx.org/en/docs/http/ngx_http_v2_module.html)
- [Certbot official instructions](https://certbot.eff.org/instructions?ws=nginx&os=snap)
- [Certbot webroot, renewal and deployment hooks](https://eff-certbot.readthedocs.io/en/stable/using.html)
- [Composer CLI platform checks](https://getcomposer.org/doc/03-cli.md)
- [MySQL backup options and privileges](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)

The package installation route in this manual uses Ubuntu apt Certbot, not the linked snap-specific installation commands. Actual package versions, unit paths, cert names, SSH/firewall topology, PHP pool, database grants, backup destination/retention, RPO/RTO and service filesystem access require manual VPS verification. The documented procedures and diagrams are prepared locally, not remotely executed or operationally certified.
