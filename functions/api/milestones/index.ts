import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';
import { recomputeProjectProgress } from '../../_lib/progress';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const projectId = new URL(request.url).searchParams.get('project_id');
  if (!projectId) return badRequest('project_id is required');

  const { results } = await env.DB.prepare(
    'SELECT * FROM milestones WHERE project_id = ? ORDER BY sort_order ASC, created_at ASC'
  ).bind(projectId).all();
  return json({ milestones: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    project_id?: string;
    title?: string;
    due_date?: string;
    sort_order?: number;
  };
  if (!body.project_id || !body.title?.trim()) return badRequest('project_id and title are required');

  const project = await env.DB.prepare(
    'SELECT id, client_id, title FROM projects WHERE id = ? AND deleted_at IS NULL'
  ).bind(body.project_id).first<{ id: string; client_id: string; title: string }>();
  if (!project) return badRequest('Project not found');

  // Default to the end of the list when the caller doesn't specify a position.
  const sortOrder = body.sort_order ?? (
    (await env.DB.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM milestones WHERE project_id = ?')
      .bind(body.project_id).first<{ next: number }>())?.next ?? 0
  );

  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO milestones (id, project_id, title, due_date, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, body.project_id, body.title.trim(), body.due_date || null, sortOrder).run();

  const progress = await recomputeProjectProgress(env, body.project_id);
  await logActivity(
    env, gate.email, 'project', `Added milestone "${body.title.trim()}" to ${project.title}`,
    project.client_id, { type: 'project', id: project.id }
  );

  const milestone = await env.DB.prepare('SELECT * FROM milestones WHERE id = ?').bind(id).first();
  return json({ milestone, progress }, { status: 201 });
};
