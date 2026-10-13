# Future Ubuntu VPS preparation — not deployed

Use the M0 separation: Next.js frontend process behind Nginx, Laravel `apps/api/public` behind PHP-FPM, MySQL as source of truth, local private media plus database sessions/cache/queue. Domains below are placeholders. No DNS, server or live service was changed in Milestone 5.

## Runtime and release

Install a supported Ubuntu release, PHP-FPM 8.3+ and the extensions in `backend-local-setup.md`, Composer 2.8+, MySQL 8.0.16+ with InnoDB and Node 24 for the frontend. Verify package compatibility against the committed Composer lock. Use separate migration and restricted runtime MySQL accounts. The runtime account needs only normal application SELECT/INSERT/UPDATE/DELETE privileges on its database; never use MySQL root in production.

Deploy an immutable release directory, copy a privately stored production `.env`, then run `composer install --no-dev --prefer-dist --optimize-autoloader`, `php artisan migrate --force`, `php artisan db:seed --force`, `php artisan filament:assets`, and `php artisan optimize`. Review migration effects/backups before running on real data. Never run the development demo seeder, `migrate:fresh`, test factories or QA provisioning in production. Provision the first administrator using the hidden CLI prompt.

Production `.env`: `APP_ENV=production`, `APP_DEBUG=false`, canonical HTTPS `APP_URL`, unique generated `APP_KEY`, dedicated DB credentials, `SESSION_SECURE_COOKIE=true`, encrypted database sessions, database cache/queue and correct log levels. Preserve `APP_KEY` across releases. Laravel also forces secure HttpOnly cookies in production. Set `MAIL_MAILER=array` until a later milestone explicitly enables messaging. Default website/contact visibility remains off until content approval.

The deploy user owns code. PHP-FPM must not write PHP/application/public source; grant its service user write access only to shared `storage` and `bootstrap/cache`. Keep those directories outside ephemeral releases as appropriate; use group permissions or ACLs, never blanket 777. Private media, environment files, Composer metadata and application source must not be served as static web files.

## Nginx example

Adapt the socket/version, hostname and release paths to the verified server. Configure HTTPS with actual certificates before enabling production cookies; redirect HTTP to HTTPS. This fragment assumes a TLS `server` block configured by the server operator:

```nginx
server_name api.example.com;
root /srv/time-stone/current/apps/api/public;
index index.php;
client_max_body_size 12m;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
add_header X-Robots-Tag "noindex, nofollow" always;

location / { try_files $uri $uri/ /index.php?$query_string; }
location = /index.php {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $realpath_root/index.php;
    fastcgi_param DOCUMENT_ROOT $realpath_root;
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    fastcgi_read_timeout 90s;
}
location ~ \.php$ { return 404; }
location ~ /\. { deny all; }
```

Do not add a public `storage` alias/symlink for this private media disk. Image URLs are delivered through Laravel's controlled route. Configure PHP `upload_max_filesize=10M`, `post_max_size=12M`, `memory_limit=256M` or higher after measuring, `max_execution_time=60`, and `cgi.fix_pathinfo=0`. Test Nginx/PHP-FPM configuration before reloading. Only trust explicitly identified reverse proxies; do not trust arbitrary forwarded hosts/IPs. Keep CORS closed until M6 defines the actual approved frontend origin.

Admin: HTTPS only, strong unique passwords, restrict `/admin` and relevant Livewire endpoints with VPN/IP access rules if operationally suitable, and maintain an account recovery procedure. Verify secure-cookie behavior and CSRF at the actual domain. Add an enforced CSP only after testing Filament/Livewire and the approved public viewer; avoid breaking scripts with an untested policy. Enable HSTS after HTTPS is verified.

## Queue, maintenance and logs

Current image processing is synchronous and bounded; there are no queued quotation/email jobs. If a later integration needs the database worker, use Supervisor/systemd with a dedicated service user:

```ini
[program:time-stone-worker]
command=/usr/bin/php8.3 /srv/time-stone/current/apps/api/artisan queue:work database --sleep=3 --tries=3 --timeout=90
user=www-data
autostart=true
autorestart=true
stopwaitsecs=120
redirect_stderr=true
stdout_logfile=/var/log/time-stone-worker.log
```

Run `queue:restart` after releases. Monitor `failed_jobs` before retrying anything. No Redis dependency exists. Laravel/Livewire expires temporary upload files. Additional library pruning is opt-in: review `time-stone:prune-media` before `--apply`, since intentionally unassigned assets may still be needed. There is no required application scheduler task in M5. If future tasks are added, run the standard `artisan schedule:run` cron as the service user only after review.

Rotate Nginx/PHP-FPM, Laravel and worker logs with suitable ownership/retention. Restrict their access; never log quotation payloads/passwords. Monitor errors, disk space, database growth, authentication failures and backup health.

## Backups and verification

Before any real-data migration, take an encrypted off-server MySQL backup using `mysqldump --single-transaction` and a protected `--defaults-extra-file` (0600), not a password in the command line. Back up private media and the production key/environment securely. Define retention for source replacements and enquiry PII with the owner. Periodically restore into an isolated database/storage copy and test referential integrity and media rendering. Never restore over production as a verification exercise.

Ubuntu installation, Nginx/PHP-FPM/systemd configuration, TLS, production secure cookies, real-volume query plans, backups/restores and external storage migration have not been executed in this Windows milestone. These are deployment instructions, not verified deployment claims.
