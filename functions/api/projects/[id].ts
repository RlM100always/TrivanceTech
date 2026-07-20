import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';
import { PROJECT_STATUSES } from './index';

interface ProjectRow { id: string; client_id: string; title: string; status: string }

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const project = await env.DB.prepare(
    `SELECT projects.*, clients.name as client_name, clients.email as client_email
     FROM projects JOIN clients ON clients.id = projects.client_id
     WHERE projects.id = ? AND projects.deleted_at IS NULL`
  ).bind(id).first();
  if (!project) return notFound('Project not found');

  const { results: milestones } = await env.DB.prepare(
    'SELECT * FROM milestones WHERE project_id = ? ORDER BY sort_order ASC, created_at ASC'
  ).bind(id).all();

  const { results: invoices } = await env.DB.prepare(
    `SELECT invoices.*,
            COALESCE((SELECT SUM(amount) FROM payments WHERE payments.invoice_id = invoices.id), 0) as paid
     FROM invoices WHERE project_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
  ).bind(id).all();

  return json({ project, milestones, invoices });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;

  const updates: string[] = [];
  const bindings: (string | number | null)[] = [];

  const setText = (field: string, value: unknown) => {
    updates.push(`${field} = ?`);
    bindings.push(value === '' || value === null || value === undefined ? null : String(value).trim());
  };

  if (typeof body.status === 'string' && (PROJECT_STATUSES as readonly string[]).includes(body.status)) {
    updates.push('status = ?');
    bindings.push(body.status);
    // Stamp the hand-off date the first time a project reaches delivered/completed,
    // so "when did we ship this" survives later status changes.
    if (body.status === 'delivered' || body.status === 'completed') {
      updates.push(`delivered_at = COALESCE(delivered_at, datetime('now'))`);
    }
  }
  for (const field of [
    'title', 'description', 'start_date', 'target_date',
    'repo_url', 'live_url', 'deliverable_url', 'delivery_note',
  ]) {
    if (body[field] !== undefined) setText(field, body[field]);
  }
  if (body.order_id !== undefined) { updates.push('order_id = ?'); bindings.push((body.order_id as string) || null); }

  if (!updates.length) return badRequest('No fields to update');

  const existing = await env.DB.prepare(
    'SELECT id, client_id, title, status FROM projects WHERE id = ? AND deleted_at IS NULL'
  ).bind(id).first<ProjectRow>();
  if (!existing) return notFound('Project not found');

  bindings.push(id);
  await env.DB.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

  const detail = typeof body.status === 'string' && body.status !== existing.status
    ? `Project "${existing.title}" → ${body.status.replace('_', ' ')}`
    : `Updated project: ${existing.title}`;
  await logActivity(env, gate.email, 'project', detail, existing.client_id, { type: 'project', id });

  const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return json({ project });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const existing = await env.DB.prepare(
    'SELECT id, client_id, title, status FROM projects WHERE id = ? AND deleted_at IS NULL'
  ).bind(id).first<ProjectRow>();
  if (!existing) return notFound('Project not found');

  await env.DB.prepare(`UPDATE projects SET deleted_at = datetime('now') WHERE id = ?`).bind(id).run();
  await logActivity(
    env, gate.email, 'project', `Deleted project: ${existing.title}`,
    existing.client_id, { type: 'project', id }
  );
  return json({ ok: true });
};
