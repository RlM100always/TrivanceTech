import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const clientId = url.searchParams.get('clientId');

  let query =
    `SELECT tasks.*, clients.name as client_name
     FROM tasks LEFT JOIN clients ON clients.id = tasks.client_id`;
  const conditions: string[] = [];
  const bindings: string[] = [];
  if (status && status !== 'all') { conditions.push('tasks.status = ?'); bindings.push(status); }
  if (clientId) { conditions.push('tasks.client_id = ?'); bindings.push(clientId); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ` ORDER BY CASE tasks.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, tasks.created_at DESC`;

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ tasks: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    title?: string;
    description?: string;
    priority?: string;
    due_date?: string;
    client_id?: string;
  };
  if (!body.title?.trim()) return badRequest('title is required');

  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO tasks (id, client_id, title, description, priority, due_date, assigned_admin_email)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.client_id || null,
    body.title.trim(),
    body.description?.trim() || null,
    ['low', 'medium', 'high'].includes(body.priority || '') ? body.priority : 'medium',
    body.due_date || null,
    gate.email
  ).run();

  await logActivity(env, gate.email, 'task', `Created task: ${body.title.trim()}`, body.client_id || null);

  const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
  return json({ task }, { status: 201 });
};
