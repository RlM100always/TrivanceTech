import type { Env } from '../../_lib/types';
import { requireAdmin } from '../../_lib/guard';
import { json } from '../../_lib/http';

// Mark a single notification as read (called when the admin clicks it).
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  await env.DB.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND admin_email = ?')
    .bind(id, gate.email.toLowerCase())
    .run();

  return json({ ok: true });
};
