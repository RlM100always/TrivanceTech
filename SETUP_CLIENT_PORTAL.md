# Client Portal / Admin Panel — Setup Checklist

Everything on the code side is built. These are the manual steps only *you* can do (they require your own Cloudflare and Google Cloud accounts).

## 1. Rotate the Google client secret (do this first, regardless of anything else)

The old `GOOGLE_CLIENT_SECRET` value was shared in plaintext (chat/email) and must be treated as compromised. Go to **Google Cloud Console → APIs & Services → Credentials**, open the OAuth client, and click **Reset Secret**. Use the new value from then on. Never commit the secret to git — set it only via `wrangler pages secret put`.

## 2. Google Cloud Console configuration

1. **APIs & Services → Credentials → your OAuth 2.0 Client ID**:
   - Add your production domain (e.g. `https://www.aitechworlds.com`) and `http://localhost:8788` (wrangler's default local port) to **Authorized JavaScript origins**.
2. **APIs & Services → Library**: enable the **Google Drive API** (needed for client file uploads).
3. **OAuth consent screen**: add the `.../auth/drive.file` scope under "Scopes" if prompted — this is the least-privilege scope (app can only see files it creates).

## 3. Create the D1 database

```bash
npm run d1:create
```
This prints a `database_id`. Copy it into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

Then apply the schema:
```bash
npm run d1:migrate:remote
```

## 4. Set Cloudflare Pages secrets

In the Cloudflare dashboard (**Pages → your project → Settings → Environment variables**) or via CLI:

```bash
wrangler pages secret put GOOGLE_CLIENT_ID
# paste your OAuth client ID from Google Cloud Console (ends in .apps.googleusercontent.com)

wrangler pages secret put SESSION_SECRET
# paste any long random string, e.g. output of: openssl rand -base64 32

wrangler pages secret put ADMIN_EMAILS
# paste comma-separated emails allowed into /admin, e.g.: you@aitechworlds.com,teammate@aitechworlds.com

wrangler pages secret put ORDER_FORM_SECRET
# paste the existing Google Apps Script order-form token (was hardcoded as "Password" in the old api/order.ts)
```

## 5. Set the frontend build-time variable

Cloudflare Pages → Settings → Environment variables → add (not as a secret, this one's public/client-side):
```
VITE_GOOGLE_CLIENT_ID=<your OAuth client ID>.apps.googleusercontent.com
```
(Locally, put the same line in a `.env` file — it's gitignored.)

## 6. Deploy via Cloudflare Pages, not GitHub Pages

The old `deploy`/`homepage` scripts in `package.json` target GitHub Pages — that won't work anymore since GitHub Pages can't run the `/functions` backend or bind D1. Either:
- Connect this repo to **Cloudflare Pages** via its dashboard (Git integration, auto-deploys on push), or
- Run `npm run pages:deploy` manually.

## 7. Local development

- `npm run dev` — frontend only, fast iteration, but `/api/*` calls will 404 (no backend running).
- `npm run pages:dev` — full stack: builds the frontend, then serves it + `/functions` + a **local** D1 database together via `wrangler pages dev`. Use this whenever testing login, chat, or the admin panel. First run `npm run d1:migrate:local` once to seed the local D1 schema.

## 8. Test the flow end-to-end

1. `npm run pages:dev`
2. Visit `/login`, sign in with a non-admin Google account → should land on `/dashboard`, chat should work.
3. Sign in with an account whose email is in `ADMIN_EMAILS` → should land on `/admin`, see the conversation from step 2 in the inbox, reply, verify it appears in the client's `/dashboard` chat within ~4 seconds.
4. Upload a file as the client → confirm it appears in the admin's client-detail sidebar under "Shared Files" and opens the real Drive file.

## Known limits (by design, see the plan discussion)

- Chat refreshes every ~3.5s (not instant push) — free-tier trade-off vs. Cloudflare Durable Objects (~$5/mo).
- If concurrent active chatters ever grow into the dozens for hours at a time, watch the Cloudflare dashboard for Workers request-count — the fix is a $5/mo Workers Paid upgrade, no code changes needed.
