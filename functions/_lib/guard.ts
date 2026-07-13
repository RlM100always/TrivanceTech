import type { Env, SessionPayload } from './types';
import { getSession } from './session';
import { unauthorized, forbidden } from './http';

// Returns the admin session, or a ready-to-return error Response.
// Usage: const gate = await requireAdmin(request, env); if (gate instanceof Response) return gate;
export async function requireAdmin(
  request: Request,
  env: Env
): Promise<SessionPayload | Response> {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();
  if (session.role !== 'admin') return forbidden('Admins only');
  return session;
}

// Log an admin action to activity_log (best-effort).
export async function logActivity(
  env: Env,
  adminEmail: string,
  action: string,
  detail: string,
  clientId?: string | null
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO activity_log (id, client_id, admin_email, action, detail) VALUES (?, ?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), clientId ?? null, adminEmail, action, detail).run();
}
