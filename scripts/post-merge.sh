#!/usr/bin/env bash
set -euo pipefail

# Install dependencies after merging. Database schema changes are deliberately
# NOT applied automatically: back up PostgreSQL and review changes first.
pnpm install --frozen-lockfile

echo "Dependencies installed."
echo "After reviewing the schema and taking a database backup, run manually:"
echo "  pnpm --filter @workspace/db run push"
