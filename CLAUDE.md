# AiTechWorlds — Project Notes for Claude

Vite + React 18 + TypeScript + React Router v6 + Tailwind CSS v3 marketing/services site for **AiTechWorlds** (remote-first AI & tech solutions company). Static SPA, no backend framework — `api/order.ts` is a single serverless function stub.

## Commands
- `npm run dev` — Vite dev server (default port 5173)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit -p tsconfig.app.json` — typecheck only (no emit)

There is no test suite in this repo.

## Real brand data (don't re-derive, don't invent placeholders)
- Name: **AiTechWorlds** (logo renders "AiTech" + "Worlds" as two colored spans — keep that split if editing `Logo.tsx`)
- Email: `infoaitechworlds@gmail.com`
- LinkedIn: `linkedin.com/company/aitechworlds`
- WhatsApp/Telegram links use the handle `aitechworlds` (exact `wa.me`/`t.me` URLs are best-effort, not scraped — verify before relying on them)
- Positioning: **remote-first, serving clients worldwide** — no physical office/address, no Bangladesh-local framing. If you see "Bangladesh's premier IT company" or a Dhaka address/phone number anywhere, it's leftover from the pre-rebrand copy and should be fixed to match this.

## Architecture patterns to reuse (don't recreate)
- **Layout**: `src/components/layout/Layout.tsx` wraps all routes — `PremiumNavbar` (top) + `<Outlet/>` + `PremiumFooter` + `BottomNav` (mobile-only fixed tab bar, Android-app style).
- **Mobile nav split**: `BottomNav.tsx` owns Home/Services/Projects/Contact as fixed tabs. `PremiumNavbar.tsx`'s mobile hamburger drawer deliberately excludes those four (see `bottomNavPaths` filter) to avoid duplicate navigation — keep that split when adding nav items.
- **Home page is a teaser, not a duplicate**: `Home.tsx` renders `<PremiumAbout compact />` and `<PremiumServices limit={3} />` instead of full sections, to avoid re-showing the entire `/about` and `/services` pages inline. Follow the same `compact`/`limit` prop pattern for any other section component reused on Home.
- **Contact vs Order — different intents, don't merge**: `/contact` = quick inquiry (name/email/subject/message only). `/order` = formal project order (project type, budget, deadline, file URL). CTA labels follow this convention: "Get Started" / "Start Your Project" → `/order`; "Get In Touch" / "Contact Us" / "Ask a Question" → `/contact`. Keep new CTAs consistent with this split.
- **Category color mapping**: `src/utils/categoryColor.ts` maps project/service category strings (`Web`/`Mobile`/`Academic`) to fixed Tailwind color classes. Use `getCategoryColor()` for any new category badge instead of hardcoding a color per instance.

## Known dead code (do not import, safe to ignore or delete if asked)
- `src/components/layout/Navbar.tsx` — unused, superseded by `PremiumNavbar.tsx`.

## Style conventions
- Tailwind utility classes only, no CSS modules/styled-components.
- Color tokens: `primary` (indigo/blue), `secondary` (teal), `accent` (orange) — defined in `tailwind.config.js`. Prefer these over raw Tailwind colors (`blue-500` etc.) for anything brand-related.
- Dark mode via `dark:` variants (`darkMode: 'class'`), toggled by `src/components/ui/DarkModeToggle.tsx`.
- react-hook-form for all forms (`Contact.tsx`, `Order.tsx`/`OrderForm.tsx`, `JobApplication.tsx`).

## When making UI changes
This is a real, deployed marketing site — prefer targeted edits over rewrites. If a change affects a component reused across multiple pages (e.g. `PremiumServices`, `ProjectCard`), check all its call sites before changing shared behavior.
