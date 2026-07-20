import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, notFound } from '../../_lib/http';
import { INVOICE_SELECT } from '../../_lib/billing';

const STAGES = ['new', 'contacted', 'proposal', 'active', 'completed', 'archived'];

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const clientId = params.id as string;

  const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ? AND deleted_at IS NULL').bind(clientId).first();
  if (!client) return notFound('Client not found');

  const { results: files } = await env.DB.prepare(
    'SELECT * FROM client_files WHERE client_id = ? ORDER BY created_at DESC'
  ).bind(clientId).all();

  const { results: conversations } = await env.DB.prepare(
    'SELECT * FROM conversations WHERE client_id = ? ORDER BY last_message_at DESC'
  ).bind(clientId).all();

  const { results: orders } = await env.DB.prepare(
    'SELECT * FROM orders WHERE client_id = ? AND deleted_at IS NULL ORDER BY created_at DESC'
  ).bind(clientId).all();

  const { results: projects } = await env.DB.prepare(
    `SELECT projects.*,
            (SELECT COUNT(*) FROM milestones WHERE project_id = projects.id) as milestone_count,
            (SELECT COUNT(*) FROM milestones WHERE project_id = projects.id AND status = 'done') as milestone_done
     FROM projects WHERE client_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
  ).bind(clientId).all();

  const { results: invoices } = await env.DB.prepare(
    `SELECT ${INVOICE_SELECT} FROM invoices
     WHERE client_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
  ).bind(clientId).all();

  const { results: activity } = await env.DB.prepare(
    'SELECT * FROM activity_log WHERE client_id = ? ORDER BY created_at DESC LIMIT 30'
  ).bind(clientId).all();

  return json({ client, files, conversations, orders, projects, invoices, activity });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const clientId = params.id as string;
  const body = await request.json().catch(() => ({})) as { stage?: string; status?: string; notes?: string; company?: string; phone?: string };

  const existing = await env.DB.prepare('SELECT stage FROM clients WHERE id = ? AND deleted_at IS NULL').bind(clientId).first<{ stage: string }>();
  if (!existing) return notFound('Client not found');

  const updates: string[] = [];
  const bindings: string[] = [];
  if (body.stage && STAGES.includes(body.stage)) { updates.push('stage = ?'); bindings.push(body.stage); }
  if (body.status) { updates.push('status = ?'); bindings.push(body.status); }
  if (body.notes !== undefined) { updates.push('notes = ?'); bindings.push(body.notes); }
  if (body.company !== undefined) { updates.push('company = ?'); bindings.push(body.company); }
  if (body.phone !== undefined) { updates.push('phone = ?'); bindings.push(body.phone); }

  if (updates.length === 0) return json({ error: 'No fields to update' }, { status: 400 });

  bindings.push(clientId);
  await env.DB.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

  // Activity log — record the meaningful lifecycle changes.
  if (body.stage && body.stage !== existing.stage) {
    await logActivity(env, gate.email, 'stage', `Stage: ${existing.stage} → ${body.stage}`, clientId);
  }
  if (body.status) await logActivity(env, gate.email, 'updated', `Account status set to ${body.status}`, clientId);
  if (body.notes !== undefined) await logActivity(env, gate.email, 'note', 'Updated internal notes', clientId);

  const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  const { results: activity } = await env.DB.prepare(
    'SELECT * FROM activity_log WHERE client_id = ? ORDER BY created_at DESC LIMIT 30'
  ).bind(clientId).all();
  return json({ client, activity });
};
