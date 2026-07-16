import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';

const VALID_STATUS = ['new', 'contacted', 'converted', 'closed'];

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as { status?: string };
  if (!body.status || !VALID_STATUS.includes(body.status)) return badRequest('Invalid status');

  const existing = await env.DB.prepare('SELECT id FROM leads WHERE id = ? AND deleted_at IS NULL').bind(id).first();
  if (!existing) return notFound('Lead not found');

  await env.DB.prepare('UPDATE leads SET status = ? WHERE id = ?').bind(body.status, id).run();
  await logActivity(env, gate.email, 'lead', `Lead ${id} → ${body.status}`);

  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
  return json({ lead });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const existing = await env.DB.prepare('SELECT name FROM leads WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ name: string }>();
  if (!existing) return notFound('Lead not found');

  await env.DB.prepare(`UPDATE leads SET deleted_at = datetime('now') WHERE id = ?`).bind(id).run();
  await logActivity(env, gate.email, 'lead', `Deleted lead: ${existing.name}`);
  return json({ ok: true });
};
