# AiTechWorlds — Project Notes for Claude

Vite + React 18 + TypeScript + React Router v6 + Tailwind CSS v3 marketing site for **AiTechWorlds** (remote-first AI & tech solutions company), **plus a real backend**: Cloudflare Pages Functions + D1, providing Google Sign-In, a client portal (chat + Drive file sharing), and an admin panel for client management.

## Commands
- `npm run dev` — Vite dev server, **frontend only** (`/api/*` will 404 here — see below)
- `npm run pages:dev` — full stack local dev (builds, then `wrangler pages dev` serves the built frontend + `/functions` + local D1 together) — use this to test anything touching auth/chat/admin
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit -p tsconfig.app.json` — typecheck frontend (`src/`)
- `npx tsc --noEmit -p functions/tsconfig.json` — typecheck backend (`functions/`) — separate config because it uses Workers types (`D1Database`, `PagesFunction`), not DOM types
- `npm run d1:create` — one-time: creates the D1 database in your Cloudflare account (prints a `database_id` — paste it into `wrangler.toml`)
- `npm run d1:migrate:local` / `npm run d1:migrate:remote` — apply `schema.sql` to local/remote D1

There is no test suite in this repo.

## Backend architecture (Cloudflare Pages Functions + D1) — added 2026-07
- **Not Next.js.** If you see `NEXT_PUBLIC_*`/`NEXTAUTH_*` env vars anywhere (e.g. pasted by the user), they don't apply — this is a Vite SPA. Client-exposed vars use Vite's `VITE_*` prefix (`import.meta.env.VITE_*`); server secrets are Cloudflare secrets (`wrangler pages secret put NAME`), never committed.
- **Auth**: Google Identity Services (client-side sign-in button, `src/lib/googleIdentity.ts`) → ID token POSTed to `functions/api/auth/google.ts` → verified via Google's `tokeninfo` endpoint (`functions/_lib/google.ts`, no JWKS lib needed) → upserts a `clients` row in D1 → issues a custom **signed HttpOnly cookie session** (`functions/_lib/session.ts`, HMAC via Web Crypto — not a library, Workers-native). No `sessions` table; sessions are stateless.
- **Admin role**: not a separate login — the *same* Google sign-in flow, but the backend checks the verified email against the `ADMIN_EMAILS` Cloudflare secret (comma-separated allow-list). To make someone an admin, add their Google account email to that secret.
- **Chat is polling-based, not WebSockets** — deliberate choice to stay fully free (Durable Objects need Workers Paid). `src/components/chat/ChatPanel.tsx` polls `/api/messages?since=<lastSeq>` every ~3.5s, paused when the tab is hidden or idle >10 min. If usage ever needs true push, that's a Durable Objects migration, not a rewrite.
- **Google Drive** holds only client-uploaded *files* (`drive.file` scope — app can only see files it created, least privilege). Chat messages/profiles/status live in D1 (`schema.sql`) — Drive's API isn't suited for structured, queryable data.
- **Key files**: `functions/api/auth/*` (login/session/logout), `functions/api/conversations/*` + `functions/api/messages/*` (chat), `functions/api/clients/*` (admin client management), `functions/api/drive/register.ts` (indexes a client's Drive upload into D1), `src/context/AuthContext.tsx` (frontend auth state), `src/components/auth/ProtectedRoute.tsx` (route guards for `/dashboard` and `/admin`).
- **Old `api/order.ts` (Vercel-style `req`/`res` stub) was deleted** — migrated to `functions/api/order.ts` in Cloudflare Pages Functions format (Fetch API `Request`/`Response`), same Google Apps Script passthrough behavior.
- **Deployment note**: `package.json`'s `deploy`/`homepage` scripts still target GitHub Pages from before this backend existed — GitHub Pages can't run Functions or bind D1, so this site must now deploy via **Cloudflare Pages** (`npm run pages:deploy` or the Cloudflare dashboard's Git integration) for the backend to work at all.

## Real brand data (don't re-derive, don't invent placeholders)
- Name: **AiTechWorlds** (logo renders "AiTech" + "Worlds" as two colored spans — keep that split if editing `Logo.tsx`)
- Real logo image: drop the user's logo file at **`public/logo.png`** (Vite serves `public/` from the site root, so it's reachable at `/logo.png` with no import). `Logo.tsx` already points `<img src="/logo.png">` there with an inline-SVG fallback shown only if that file 404s. `index.html`'s favicon (`<link rel="icon">`) also points at `/logo.png`. If the user provides a different extension (`.svg`/`.webp`), update `LOGO_SRC` in `Logo.tsx` and the favicon `href` to match.
- Single source of truth for all social/contact links: **`src/utils/socialLinks.ts`** (`SOCIAL_LINKS`, `CONTACT_EMAIL`, `WHATSAPP_NUMBER`, `whatsappChatLink()`, `whatsappLinkTo()`) — import from there, never hardcode a link inline. Values were scraped directly from the live `aitechworlds.com/about` page (2026-07), not guessed:
  - Email: `infoaitechworlds@gmail.com` (set by the user 2026-07 — this is the canonical contact email; do not revert to the old `contact@aitechworlds.com`)
  - WhatsApp direct chat number: `8801825008451` (real, gave by the user — used via `whatsappChatLink()` for the company `wa.me` link; `whatsappLinkTo(number, msg)` builds a click-to-chat link to any other number, e.g. a client's WhatsApp captured on the contact/order form so admins can message them from the panel)
  - Contact & Order forms capture the client's **WhatsApp number** (the phone field is required and labelled as WhatsApp) so the admin panel can click-to-chat the client directly (`AdminOrders` lead cards + `AdminClients` drawer).
  - LinkedIn: `linkedin.com/company/aitechworlds`
  - Facebook: `web.facebook.com/aitechworldsfacebook/`
  - X/Twitter: `x.com/AiTechWorlds`
  - Instagram: `instagram.com/aitechworldsinsta/`
  - YouTube: `youtube.com/@infoaitechworlds`
  - Telegram: `t.me/aitechworldschannel`
  - WhatsApp channel (broadcast, not direct chat): `whatsapp.com/channel/0029Vb7q7hTL7UVQ95jrXw3s`
  - Pinterest: `pinterest.com/AiTechWorlds`
  - Quora: `quora.com/profile/AiTechWorlds`
- A global floating WhatsApp CTA (`src/components/ui/WhatsAppFloatingButton.tsx`) is mounted once in `Layout.tsx` on every page — don't add a second one per-page.
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
