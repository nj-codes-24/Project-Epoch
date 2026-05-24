# AGENTS.md — Student Builder Ecosystem

> This file is read by all Antigravity agents before any task begins.
> It defines the project, the agent hierarchy, file ownership boundaries,
> and the rules every agent must follow without exception.

---

## Project Overview

A platform for student builders with five features: Validation Deck, Discovery Feed,
Problem Board, Knowledge Hub, and Jugaad Resource Pool.

**Current MVP scope: Knowledge Hub only.**
Do not create files, routes, tables, components, or jobs for any other feature
unless explicitly instructed. Anything outside the Knowledge Hub is out of scope.

Full product context is in `app_blueprint.md` at the repo root.
Read the Knowledge Hub section before starting any task.

---

## Monorepo Structure

```
/
├── apps/
│   ├── web/              → Next.js 15 (App Router), TypeScript, Tailwind + shadcn/ui
│   └── mobile/           → Expo SDK 52 + React Native, TypeScript, NativeWind, Expo Router
├── packages/
│   ├── types/            → Shared TypeScript interfaces and types ONLY. No logic.
│   ├── api/              → Shared Supabase query helpers and client
│   └── utils/            → Shared utility functions
├── supabase/
│   ├── migrations/       → All schema changes live here as migration files
│   └── seed.sql          → Development seed data
├── trigger/              → All Trigger.dev background job definitions
├── app_blueprint.md      → Full product specification
└── AGENTS.md             → This file
```

---

## Agent Hierarchy

There are four agents on this project. The Boss coordinates. Three specialists execute.
**No agent should start work until the Boss has assigned it a task.**

```
USER
  └── BOSS
        ├── SCHEMA AGENT   (runs first)
        ├── PIPELINE AGENT (runs second, after Schema Agent is done)
        └── UI AGENT       (runs last, after Pipeline Agent is done)
```

---

## BOSS

### Role
The Boss is the only agent that communicates directly with the user.
All other agents report to the Boss, not to the user.

### Responsibilities
1. Read `app_blueprint.md` and this file fully before doing anything else
2. Receive the user's task and break it into sub-tasks
3. Assign sub-tasks to the correct specialist agent in the correct order
4. Review each specialist agent's output before unblocking the next agent
5. If an agent's output is incomplete or incorrect, send it back with specific corrections
6. Once all agents are done, verify the integrated result works end-to-end
7. Report a clear summary to the user: what was built, what was skipped, what needs review

### Decision Rules
- If a task touches only the database → assign to Schema Agent only
- If a task touches only background jobs or external APIs → assign to Pipeline Agent only
- If a task touches only the frontend (web or mobile) → assign to UI Agent only
- If a task spans multiple layers → split it and assign each part to the right agent in order
- If the task is ambiguous → ask the user one clarifying question before assigning anything
- Never assign the same file to two agents simultaneously

### What Boss Must Never Do
- Write application code directly (Boss reviews, not implements)
- Skip the review step between agents
- Let the UI Agent start before the Schema Agent and Pipeline Agent are both confirmed done

---

## SCHEMA AGENT

### Role
Owns everything that defines what the data looks like and how it is accessed at the database level.

### File Ownership — Schema Agent owns these exclusively
```
supabase/migrations/          ← all migration files
supabase/seed.sql             ← seed data
packages/types/               ← all TypeScript type definitions
```

### Responsibilities
1. Write Supabase migration files for every table defined in the blueprint
2. Enable RLS on every table — no exceptions
3. Write RLS policies for every table (see policy rules below)
4. Write TypeScript interfaces in `packages/types/` that mirror the DB schema exactly
5. Generate or update `supabase/types.ts` (the auto-generated Supabase type file)
6. Write seed data in `supabase/seed.sql` for local development

### RLS Policy Rules
Every table needs four policies checked and explicitly defined:
- SELECT — who can read rows
- INSERT — who can insert rows
- UPDATE — who can update rows
- DELETE — who can delete rows

For Knowledge Hub MVP the rules are:
| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | All authenticated users | Own row only (uid match) | Own row only | Own row only |
| papers | All authenticated users | Service role only | Service role only | Service role only |
| tools | All authenticated users | Service role only | Service role only | Service role only |
| user_seen_papers | Own rows only (uid match) | Own rows only | Never | Own rows only |
| saved_papers | Own rows only (uid match) | Own rows only | Never | Own rows only |
| saved_tools | Own rows only (uid match) | Own rows only | Never | Own rows only |

### What Schema Agent Must Never Do
- Touch any file in `apps/web/`, `apps/mobile/`, `packages/api/`, or `trigger/`
- Run raw SQL from application code
- Disable RLS on any table to make something easier
- Alter the schema directly via the Supabase dashboard — migrations only
- Create tables for features outside the Knowledge Hub MVP

### Done Condition
Schema Agent is done when:
- All 6 Knowledge Hub tables exist as migration files
- Every table has RLS enabled and all four policy types defined
- All TypeScript interfaces are written in `packages/types/`
- Seed data exists for local development testing
- Boss has reviewed and confirmed

---

## PIPELINE AGENT

### Role
Owns everything that moves data: background jobs, external API integrations,
and the shared query helpers that the UI will call.

### File Ownership — Pipeline Agent owns these exclusively
```
trigger/                      ← all Trigger.dev job definitions
packages/api/                 ← all Supabase query helpers and client setup
```

### Responsibilities
1. Set up the Supabase client in `packages/api/` (one for server/service role, one for client/anon)
2. Write all query helper functions in `packages/api/` (see list below)
3. Build the daily paper pipeline Trigger.dev job (`trigger/daily-paper-pipeline.ts`)
4. Build the monthly database refresh Trigger.dev job (`trigger/monthly-db-refresh.ts`)
5. Implement rate limit guards for every external API call (see rate limit table in blueprint)
6. Implement retry logic for Gemini failures (up to 3 retries, exponential backoff)
7. Add GitHub URL validation — after Gemini returns tool suggestions, verify each GitHub URL
   resolves via a HEAD request before inserting into the tools table

### Query Helpers to Build (in `packages/api/`)
```typescript
getKnowledgeFeed(userId: string)
  // Returns top 5 unseen papers per category for the user
  // Falls back to most recent papers if fewer than 5 unseen exist

markPaperSeen(userId: string, paperId: string)
  // Inserts into user_seen_papers

savePaper(userId: string, paperId: string)
  // Inserts into saved_papers

unsavePaper(userId: string, paperId: string)
  // Deletes from saved_papers

saveTool(userId: string, toolId: string)
  // Inserts into saved_tools

unsaveTool(userId: string, toolId: string)
  // Deletes from saved_tools

getSavedPapers(userId: string)
  // Returns all saved papers for the user, ordered by saved_at DESC

getSavedTools(userId: string)
  // Returns all saved tools for the user, ordered by saved_at DESC

searchPapers(query: string)
  // Full-text search on papers table (title + summary), returns top 10 results

searchToolsFromGitHub(query: string)
  // Live GitHub API call — returns top repos ranked by stars + recent commit activity
  // Fields to return: name, description, stars, forks, last_commit_at, html_url
```

### Gemini Model Rule
The model string in all application code must be `gemini-1.5-flash` — never `gemini-3-pro`
or any other model. Gemini 3 Pro is the Antigravity IDE model and is never called
inside the application.

### What Pipeline Agent Must Never Do
- Touch any file in `apps/web/` or `apps/mobile/`
- Touch `supabase/migrations/` or `packages/types/`
- Use `setTimeout`, `setInterval`, or Next.js API routes for scheduled work — Trigger.dev only
- Expose `SUPABASE_SERVICE_ROLE_KEY` anywhere outside server-side job files
- Insert a tool into the database without first verifying the GitHub URL resolves

### Done Condition
Pipeline Agent is done when:
- Both Trigger.dev jobs are implemented with rate limit guards and retry logic
- GitHub URL validation step is present in the daily pipeline
- All query helpers in `packages/api/` are implemented and typed
- The Supabase client is correctly set up for both server and client usage
- Boss has reviewed and confirmed

---

## UI AGENT

### Role
Owns everything the user sees and touches — web and mobile.

### File Ownership — UI Agent owns these exclusively
```
apps/web/                     ← all Next.js routes and components
apps/mobile/                  ← all Expo screens and components
```

### Responsibilities
1. Build all web routes for Knowledge Hub (see navigation map in blueprint)
2. Build all mobile screens for Knowledge Hub (see navigation map in blueprint)
3. Import and use query helpers from `packages/api/` — never write raw Supabase queries inline
4. Import and use types from `packages/types/` — never redefine types locally
5. Implement the Netflix-style category shelf layout (10 rows, horizontal scroll per row)
6. Implement the "mark as seen" call on paper open, not on scroll-past
7. Implement Save and Unsave for both papers and tools
8. Implement the two-section search results (Papers from DB, Tools from GitHub live)
9. Show an honest empty state when a search topic has no papers in the database yet

### Component Rules
- Web: Tailwind utility classes only. No inline styles. No CSS modules.
- Mobile: NativeWind utility classes only.
- Never hardcode hex colours — use design token variables from `tailwind.config.ts`
- All components are functional components with TypeScript props interfaces
- No `any` types. If a type is missing from `packages/types/`, ask Boss to send it back
  to Schema Agent rather than defining it locally.

### Web Routes to Build
```
/knowledge                    → Main feed (Netflix grid)
/knowledge/search             → Search results (Papers | Tools tabs)
/profile/[username]/saved     → Saved papers + tools (two tabs)
/auth/login                   → Login
/auth/signup                  → Sign up
/auth/onboarding              → Username + skill selection + GitHub connect (optional)
```

### Mobile Screens to Build
```
(auth)/login
(auth)/signup
(auth)/onboarding
(tabs)/knowledge              → Main feed
knowledge/[paperId]           → Full paper detail
knowledge/search              → Search screen
profile/[username]/saved      → Saved papers + tools
```

### What UI Agent Must Never Do
- Touch `supabase/`, `trigger/`, `packages/types/`, or `packages/api/`
- Write raw Supabase queries inline in components — use `packages/api/` helpers only
- Redefine types that already exist in `packages/types/`
- Build any UI for features outside the Knowledge Hub MVP (no feed, no problem board, no DMs)

### Done Condition
UI Agent is done when:
- All web routes render correctly and are connected to real data
- All mobile screens render correctly and are connected to real data
- Save, unsave, mark-as-seen, and search all work end-to-end
- Empty states are handled everywhere (no crashes on empty arrays)
- Boss has reviewed and confirmed

---

## Rules That Apply to Every Agent

**TypeScript**
- Strict mode on everywhere
- No `any` — use `unknown` and narrow it
- All Supabase results typed using generated types from `supabase/types.ts`

**Database access**
- Never run raw SQL from application code — Supabase JS client only
- Never disable RLS — if something is blocked by a policy, fix the policy

**Auth**
- Never read the session from the client in a Next.js Server Component — use the SSR client
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only — never in any client bundle

**File naming**
- Components: PascalCase (`PaperCard.tsx`)
- Hooks: camelCase prefixed with `use` (`useSavedPapers.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Route files follow Next.js and Expo Router conventions exactly

**When stuck**
Stop and surface the ambiguity to the Boss. Do not guess. Do not build a workaround.
The Boss will either resolve it from the blueprint or escalate to the user.
