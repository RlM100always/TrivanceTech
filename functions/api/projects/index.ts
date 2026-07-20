import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';

export const PROJECT_STATUSES = [
  'planning', 'in_progress', 'review', 'delivered', 'completed', 'on_hold', 'cancelled',
] as const;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const clientId = url.searchParams.get('client_id');

  let query =
    `SELECT projects.*, clients.name as client_name, clients.email as client_email,
            (SELECT COUNT(*) FROM milestones WHERE milestones.project_id = projects.id) as milestone_count,
            (SELECT COUNT(*) FROM milestones WHERE milestones.project_id = projects.id AND status = 'done') as milestone_done
     FROM projects JOIN clients ON clients.id = projects.client_id
     WHERE projects.deleted_at IS NULL`;
  const bindings: string[] = [];
  if (status && status !== 'all') { query += ' AND projects.status = ?'; bindings.push(status); }
  if (clientId) { query += ' AND projects.client_id = ?'; bindings.push(clientId); }
  query += ' ORDER BY projects.created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ projects: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    client_id?: string;
    order_id?: string;
    title?: string;
    description?: string;
    status?: string;
    start_date?: string;
    target_date?: string;
  };
  if (!body.client_id || !body.title?.trim()) return badRequest('client_id and title are required');

  const status = body.status && (PROJECT_STATUSES as readonly string[]).includes(body.status)
    ? body.status
    : 'planning';

  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO projects (id, client_id, order_id, title, description, status, start_date, target_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.client_id,
    body.order_id || null,
    body.title.trim(),
    body.description?.trim() || null,
    status,
    body.start_date || null,
    body.target_date || null
  ).run();

  await logActivity(
    env, gate.email, 'project', `Created project: ${body.title.trim()}`,
    body.client_id, { type: 'project', id }
  );

  const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return json({ project }, { status: 201 });
};
