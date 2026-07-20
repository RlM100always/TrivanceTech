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
// `entity` ties the entry to the row it describes so the client-facing and admin
// timelines can link straight to the project/invoice/order in question.
export async function logActivity(
  env: Env,
  adminEmail: string,
  action: string,
  detail: string,
  clientId?: string | null,
  entity?: { type: string; id: string }
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO activity_log
       (id, client_id, actor_type, actor_email, admin_email, action, entity_type, entity_id, detail)
     VALUES (?, ?, 'admin', ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(), clientId ?? null, adminEmail, adminEmail,
    action, entity?.type ?? null, entity?.id ?? null, detail
  ).run();
}

// Same log, but for actions the CLIENT takes in their portal (uploads, messages).
// Kept separate so callers can't accidentally attribute a client action to an admin.
export async function logClientActivity(
  env: Env,
  clientEmail: string,
  action: string,
  detail: string,
  clientId: string,
  entity?: { type: string; id: string }
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO activity_log
       (id, client_id, actor_type, actor_email, admin_email, action, entity_type, entity_id, detail)
     VALUES (?, ?, 'client', ?, NULL, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(), clientId, clientEmail,
    action, entity?.type ?? null, entity?.id ?? null, detail
  ).run();
}
