import type { Env } from '../../_lib/types';
import { verifyGoogleIdToken } from '../../_lib/google';
import { createSessionToken, sessionCookieHeader } from '../../_lib/session';
import { json, badRequest, unauthorized, uuid } from '../../_lib/http';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as { id_token?: string } | null;
  if (!body?.id_token) return badRequest('Missing id_token');

  const identity = await verifyGoogleIdToken(body.id_token, env.GOOGLE_CLIENT_ID);
  if (!identity) return unauthorized('Invalid Google token');

  try {
    const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = adminEmails.includes(identity.email.toLowerCase());
    const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';

    if (role === 'client') {
      const existing = await env.DB.prepare('SELECT id FROM clients WHERE google_sub = ?')
        .bind(identity.sub)
        .first<{ id: string }>();

      let clientId: string;
      if (existing) {
        clientId = existing.id;
        await env.DB.prepare(
          'UPDATE clients SET name = ?, avatar_url = ?, email = ?, last_login_at = datetime(\'now\') WHERE id = ?'
        ).bind(identity.name, identity.picture ?? null, identity.email, existing.id).run();
      } else {
        // An admin may have already created this client by converting a lead, before
        // the person ever signed in — that row carries a `pending:` placeholder
        // google_sub. Claim it on first sign-in instead of inserting a second row,
        // which would collide on the UNIQUE email constraint and lose their history.
        const byEmail = await env.DB.prepare(
          'SELECT id FROM clients WHERE email = ? AND google_sub LIKE \'pending:%\''
        ).bind(identity.email).first<{ id: string }>();

        if (byEmail) {
          clientId = byEmail.id;
          await env.DB.prepare(
            `UPDATE clients SET google_sub = ?, name = ?, avatar_url = ?,
                                last_login_at = datetime('now') WHERE id = ?`
          ).bind(identity.sub, identity.name, identity.picture ?? null, byEmail.id).run();
        } else {
          clientId = uuid();
          await env.DB.prepare(
            'INSERT INTO clients (id, google_sub, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)'
          ).bind(clientId, identity.sub, identity.email, identity.name, identity.picture ?? null).run();
        }
      }

      // Link any lead(s) with a matching email that haven't been linked yet — makes
      // "converted" status traceable to the client record it actually produced.
      await env.DB.prepare(
        `UPDATE leads SET converted_client_id = ?, status = 'converted'
         WHERE email = ? AND converted_client_id IS NULL AND deleted_at IS NULL`
      ).bind(clientId, identity.email).run();
    }

    await env.DB.prepare(
      'INSERT INTO login_events (id, email, role, ip, user_agent) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      uuid(),
      identity.email,
      role,
      request.headers.get('CF-Connecting-IP') ?? null,
      request.headers.get('User-Agent') ?? null
    ).run();

    const token = await createSessionToken(
      { sub: identity.sub, email: identity.email, name: identity.name, picture: identity.picture, role },
      env.SESSION_SECRET
    );

    // Detect if we're on localhost (HTTP) vs production (HTTPS)
    const url = new URL(request.url);
    const isSecure = url.protocol === 'https:';
    return json(
      { email: identity.email, name: identity.name, picture: identity.picture, role },
      { headers: { 'Set-Cookie': sessionCookieHeader(token, isSecure) } }
    );
  } catch (err) {
    console.error('[auth/google] sign-in failed:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    return json({ error: message }, { status: 500 });
  }
};
