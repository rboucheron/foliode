from __future__ import annotations

import shutil
import time
from pathlib import Path

from invoke import task

ROOT = Path(__file__).parent
COMPOSE = "docker compose"


def _run(ctx, command: str) -> None:
    ctx.run(command, pty=True)


def _wait_db(ctx, timeout: int = 60) -> None:
    start = time.time()
    while time.time() - start < timeout:
        result = ctx.run(
            f"{COMPOSE} exec -T db sh -lc 'pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\"'",
            warn=True,
            hide=True,
        )
        if result.ok:
            print("[ok] database is ready")
            return
        time.sleep(2)

    raise RuntimeError("PostgreSQL did not become ready in time.")


@task
def env(ctx, force=False):
    """Create missing .env files from example files."""
    env_pairs = [
        (ROOT / ".env.example", ROOT / ".env"),
        (ROOT / "backend/.env.example", ROOT / "backend/.env"),
        (ROOT / "frontend/website/.env.local.example", ROOT / "frontend/website/.env.local"),
        (ROOT / "frontend/api/.env.example", ROOT / "frontend/api/.env"),
    ]

    for src, dst in env_pairs:
        if not src.exists():
            print(f"[skip] example file not found: {src}")
            continue
        if dst.exists() and not force:
            print(f"[skip] already exists: {dst}")
            continue

        shutil.copyfile(src, dst)
        print(f"[ok] created: {dst}")


@task
def build(ctx):
    """Build all Docker images."""
    _run(ctx, f"{COMPOSE} build")


@task
def up(ctx, build=False):
    """Start all services in detached mode."""
    build_flag = " --build" if build else ""
    _run(ctx, f"{COMPOSE} up -d{build_flag}")


@task
def down(ctx, volumes=False):
    """Stop and remove all services."""
    volumes_flag = " -v" if volumes else ""
    _run(ctx, f"{COMPOSE} down{volumes_flag}")


@task
def logs(ctx, service=""):
    """Follow Docker logs (optionally for one service)."""
    service_suffix = f" {service}" if service else ""
    _run(ctx, f"{COMPOSE} logs -f{service_suffix}")


@task
def ps(ctx):
    """Show running containers."""
    _run(ctx, f"{COMPOSE} ps")


@task
def install(ctx):
    """Install backend and frontend dependencies in containers."""
    _run(ctx, f"{COMPOSE} run --rm backend composer install")
    _run(
        ctx,
        (
            f"{COMPOSE} run --rm frontend sh -lc "
            "'cd /workspace/api && npm install && cd /workspace/website && npm install'"
        ),
    )


@task
def wait_db(ctx, timeout=60):
    """Wait until PostgreSQL is ready."""
    _wait_db(ctx, timeout=timeout)


@task
def jwt(ctx):
    """Generate Lexik JWT key pair."""
    _run(
        ctx,
        (
            f"{COMPOSE} exec -T backend "
            "php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction"
        ),
    )


@task(pre=[wait_db])
def migrate(ctx):
    """Run doctrine migrations."""
    _run(
        ctx,
        f"{COMPOSE} exec -T backend php bin/console doctrine:migrations:migrate --no-interaction",
    )


@task(pre=[wait_db])
def migrate_diff(ctx):
    """Create a doctrine migration file from entity changes."""
    _run(ctx, f"{COMPOSE} exec -T backend php bin/console doctrine:migrations:diff")


@task(pre=[env])
def setup(ctx):
    """Full local bootstrap: env, build, up, dependencies, jwt keys, migrations."""
    _run(ctx, f"{COMPOSE} build")
    _run(ctx, f"{COMPOSE} up -d")
    _run(ctx, f"{COMPOSE} run --rm backend composer install")
    _run(
        ctx,
        (
            f"{COMPOSE} run --rm frontend sh -lc "
            "'cd /workspace/api && npm install && cd /workspace/website && npm install'"
        ),
    )
    _wait_db(ctx)
    _run(
        ctx,
        (
            f"{COMPOSE} exec -T backend "
            "php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction"
        ),
    )
    _run(
        ctx,
        f"{COMPOSE} exec -T backend php bin/console doctrine:migrations:migrate --no-interaction",
    )


@task
def restart(ctx):
    """Restart all services."""
    _run(ctx, f"{COMPOSE} down")
    _run(ctx, f"{COMPOSE} up -d")
