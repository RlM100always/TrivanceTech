import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  };

  const updates: string[] = [];
  const bindings: (string | null)[] = [];
  if (body.title !== undefined) { updates.push('title = ?'); bindings.push(body.title.trim()); }
  if (body.description !== undefined) { updates.push('description = ?'); bindings.push(body.description || null); }
  if (body.status && ['todo', 'doing', 'done'].includes(body.status)) { updates.push('status = ?'); bindings.push(body.status); }
  if (body.priority && ['low', 'medium', 'high'].includes(body.priority)) { updates.push('priority = ?'); bindings.push(body.priority); }
  if (body.due_date !== undefined) { updates.push('due_date = ?'); bindings.push(body.due_date || null); }

  if (!updates.length) return badRequest('No fields to update');

  const existing = await env.DB.prepare('SELECT id FROM tasks WHERE id = ?').bind(id).first();
  if (!existing) return notFound('Task not found');

  bindings.push(id);
  await env.DB.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();
  await logActivity(env, gate.email, 'task', `Updated task ${id}`);

  const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
  return json({ task });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
  return json({ ok: true });
};
