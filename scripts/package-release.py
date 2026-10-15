"""Build a source-only release allowlist; never reads or packages business storage/QA."""
import argparse
import hashlib
import json
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ["package.json", "package-lock.json", "apps/web/package.json", "apps/web/next.config.ts", "apps/web/tsconfig.json", "apps/web/next-env.d.ts", "apps/web/postcss.config.mjs", "apps/api/artisan", "apps/api/composer.json", "apps/api/composer.lock", "apps/api/.env.example", "apps/web/.env.example", "apps/api/bootstrap/app.php", "apps/api/bootstrap/providers.php", "apps/api/bootstrap/cache/.gitignore", "apps/api/database/seeders/DatabaseSeeder.php", "scripts/check-production-env.mjs", "scripts/package-release.py", "docs/milestone-7-deployment-runbook.md", "docs/milestone-7-staging-readonly-checklist.md"]
DIRECTORIES = ["apps/web/src", "apps/web/public", "apps/api/app", "apps/api/config", "apps/api/routes", "apps/api/resources", "apps/api/lang", "apps/api/database/migrations", "apps/api/public", "deployment"]
EXCLUDED = ["apps/api/public/storage", "apps/api/public/build", "apps/api/public/hot", "apps/api/public/css/filament", "apps/api/public/js/filament", "apps/api/public/fonts/filament"]

def release_files():
    candidates = [ROOT / name for name in FILES]
    for name in DIRECTORIES:
        directory = ROOT / name
        if directory.exists():
            candidates.extend(directory.rglob('*'))
    result = {}
    for path in candidates:
        relative = path.relative_to(ROOT).as_posix()
        if any(relative == prefix or relative.startswith(prefix + '/') for prefix in EXCLUDED):
            continue
        if path.is_symlink():
            raise ValueError('Release inputs must not contain symlinks')
        if not path.is_file():
            continue
        if not path.resolve().is_relative_to(ROOT):
            raise ValueError('Release path outside workspace')
        result[relative] = path
    return sorted(result.items())


def source_permissions(member):
    # Windows file metadata must not produce world-writable deployed source.
    member.mode = 0o755 if member.name == 'apps/api/artisan' else 0o644
    return member


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='New .tar.gz file within this workspace; never overwrites')
    args = parser.parse_args()
    files = release_files()
    summary = {'files': len(files), 'mode': 'allowlist dry-run'}
    if args.output:
        target = args.output.resolve()
        if not target.is_relative_to(ROOT) or not target.name.endswith('.tar.gz'):
            parser.error('Output must be a new .tar.gz within the workspace')
        target.parent.mkdir(parents=True, exist_ok=True)
        # Exclusive creation prevents accidental replacement of an existing archive.
        with target.open('xb') as stream, tarfile.open(fileobj=stream, mode='w:gz') as archive:
            for name, path in files:
                archive.add(path, arcname=name, recursive=False, filter=source_permissions)
        summary.update(mode='source artifact created', sha256=hashlib.sha256(target.read_bytes()).hexdigest())
    print(json.dumps(summary))
