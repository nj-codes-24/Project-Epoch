#!/bin/bash

# =============================================================================
# setup.sh — Agent Skills Installer
# Student Builder Ecosystem
#
# Run this once after cloning the repo.
# The Antigravity Boss agent can also run this directly.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# =============================================================================

set -e  # Exit immediately if any command fails

echo ""
echo "================================================"
echo "  Installing Agent Skills for this project..."
echo "================================================"
echo ""

# ── Check that npx is available ──────────────────────────────────────────────
if ! command -v npx &> /dev/null; then
  echo "ERROR: npx not found. Please install Node.js first: https://nodejs.org"
  exit 1
fi

# ── Workspace Skills (project-scoped, committed to git) ──────────────────────
# These go into .agent/skills/ and are available to all agents in this project.

echo "→ Installing Supabase skill (DB, Auth, RLS, migrations, Next.js SSR)..."
npx skills add supabase/agent-skills --skill supabase

echo "→ Installing Supabase Postgres best practices..."
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices

echo "→ Installing Expo skill (React Native, Expo Router, EAS builds)..."
npx skills add expo/skills

echo "→ Skipping Google Gemini API skill due to auth issue..."
# npx skills add google-gemini/gemini-api-dev

echo "→ Installing Vercel React Native + Next.js performance skills..."
npx skills add vercel-labs/agent-skills

echo "→ Installing Callstack React Native performance skill..."
npx skills add callstackincubator/agent-skills

echo ""
echo "── Workspace skills installed ✓"
echo ""

# ── Global Skills (machine-scoped, apply to all your projects) ───────────────
# These go into ~/.gemini/antigravity/skills/

echo "→ Installing code-review skill (global)..."
npx skills add skills/code-review --global

echo "→ Installing git-commit-formatter skill (global)..."
npx skills add git-commit-formatter --global

echo ""
echo "── Global skills installed ✓"
echo ""

# ── Done ─────────────────────────────────────────────────────────────────────
echo "================================================"
echo "  All agent skills installed successfully."
echo ""
echo "  Workspace skills → .agent/skills/"
echo "  Global skills    → ~/.gemini/antigravity/skills/"
echo ""
echo "  Commit .agent/skills/ to git so all agents"
echo "  and contributors share the same setup."
echo "================================================"
echo ""
