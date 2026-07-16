import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as {
    status?: string;
    amount?: number;
    due_amount?: number;
    subject?: string;
    description?: string;
  };

  const updates: string[] = [];
  const bindings: (string | number | null)[] = [];
  if (body.status && ['draft', 'sent', 'paid', 'cancelled'].includes(body.status)) { updates.push('status = ?'); bindings.push(body.status); }
  if (body.amount !== undefined) { updates.push('amount = ?'); bindings.push(Number(body.amount) || 0); }
  if (body.due_amount !== undefined) { updates.push('due_amount = ?'); bindings.push(Number(body.due_amount) || 0); }
  if (body.subject !== undefined) { updates.push('subject = ?'); bindings.push(body.subject.trim()); }
  if (body.description !== undefined) { updates.push('description = ?'); bindings.push(body.description || null); }

  if (!updates.length) return badRequest('No fields to update');

  const existing = await env.DB.prepare('SELECT id FROM orders WHERE id = ? AND deleted_at IS NULL').bind(id).first();
  if (!existing) return notFound('Order not found');

  bindings.push(id);
  await env.DB.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();
  await logActivity(env, gate.email, 'order', `Updated order ${id}`);

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  return json({ order });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const existing = await env.DB.prepare('SELECT subject FROM orders WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ subject: string }>();
  if (!existing) return notFound('Order not found');

  await env.DB.prepare(`UPDATE orders SET deleted_at = datetime('now') WHERE id = ?`).bind(id).run();
  await logActivity(env, gate.email, 'order', `Deleted order: ${existing.subject}`);
  return json({ ok: true });
};
