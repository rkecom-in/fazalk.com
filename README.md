# fazalk.com

Marketing site + AI architecture-risk assessment for Fazal K.'s CTO-level advisory practice.

Next.js 16 (Pages Router) · React 19 + React Compiler · TypeScript (strict) · Tailwind CSS 3. Bilingual (English / Arabic with RTL).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

`npm run build` / `npm run start` for a production build.

> ⚠️ Read `AGENTS.md` first — this Next.js version has breaking changes from older releases. Consult the bundled docs in `node_modules/next/dist/docs/` before changing routing/config.

## Environment

See `.env.example`. Real secrets live only in the deployment platform (Vercel), never in git.

| Var | Used by | Required |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `pages/api/anthropic.ts` — AI assessment (server-side) | yes |
| `RESEND_API_KEY` | `pages/api/contact.ts` — lead emails (server-side) | yes (for contact) |
| `TURNSTILE_SECRET_KEY` | server-side Turnstile verify | recommended in prod |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | client Turnstile widget (invisible mode) | recommended in prod |

If the Turnstile keys are unset the bot check is a no-op; set **both** to enforce.

## Routes

| Path | Notes |
| --- | --- |
| `/`, `/ar` | Localized homepage (manual locale routing — no Next i18n) |
| `/services/[slug]`, `/ar/services/[slug]` | SSG service landing pages (slugs in `lib/seo-services.ts`) |
| `/privacy`, `/terms`, `/confirm` | Static, `noindex` |
| `/api/anthropic` | Builds the assessment request server-side; client sends only answers |
| `/api/contact` | Sends the lead email via Resend |

## Key modules

- `lib/i18n/` — `en.ts` / `ar.ts` dictionaries (keep them in structural parity).
- `lib/assessment.ts` / `lib/assessment-shared.ts` — risk scoring, system prompt, Anthropic request builder (server) vs. client-safe primitives.
- `lib/rate-limit.ts`, `lib/security.ts`, `lib/turnstile.ts` — API route abuse protection.
- `components/widgets/AssessmentTriage.tsx` — the multi-phase assessment widget.

## Deploy

Vercel. Set the env vars above in the project settings. `public/sitemap.xml` is currently maintained by hand — update it when adding service slugs.
