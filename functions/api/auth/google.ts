import type { Env } from '../../_lib/types';
import { verifyGoogleIdToken } from '../../_lib/google';
import { createSessionToken, sessionCookieHeader } from '../../_lib/session';
import { json, badRequest, unauthorized, uuid } from '../../_lib/http';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as { id_token?: string } | null;
  if (!body?.id_token) return badRequest('Missing id_token');

  const identity = await verifyGoogleIdToken(body.id_token, env.GOOGLE_CLIENT_ID);
  if (!identity) return unauthorized('Invalid Google token');

  const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  const isAdmin = adminEmails.includes(identity.email.toLowerCase());
  const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';

  if (role === 'client') {
    const existing = await env.DB.prepare('SELECT id FROM clients WHERE google_sub = ?')
      .bind(identity.sub)
      .first<{ id: string }>();

    if (existing) {
      await env.DB.prepare(
        'UPDATE clients SET name = ?, avatar_url = ?, email = ?, last_login_at = datetime(\'now\') WHERE id = ?'
      ).bind(identity.name, identity.picture ?? null, identity.email, existing.id).run();
    } else {
      await env.DB.prepare(
        'INSERT INTO clients (id, google_sub, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)'
      ).bind(uuid(), identity.sub, identity.email, identity.name, identity.picture ?? null).run();
    }
  }

  const token = await createSessionToken(
    { sub: identity.sub, email: identity.email, name: identity.name, picture: identity.picture, role },
    env.SESSION_SECRET
  );

  return json(
    { email: identity.email, name: identity.name, picture: identity.picture, role },
    { headers: { 'Set-Cookie': sessionCookieHeader(token) } }
  );
};
