import type { Env } from '../../_lib/types';
import { requireAdmin } from '../../_lib/guard';
import { json } from '../../_lib/http';

// List the signed-in admin's notifications (newest first). Populated by the
// contact/order/message handlers when something needs attention.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const { results } = await env.DB.prepare(
    `SELECT id, type, message, read, created_at
     FROM notifications
     WHERE admin_email = ?
     ORDER BY created_at DESC
     LIMIT 30`
  ).bind(gate.email.toLowerCase()).all();

  return json({ notifications: results });
};

// Mark all of this admin's notifications as read.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  await env.DB.prepare('UPDATE notifications SET read = 1 WHERE admin_email = ?')
    .bind(gate.email.toLowerCase())
    .run();

  return json({ ok: true });
};
