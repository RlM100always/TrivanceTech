import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';
import { recomputeProjectProgress } from '../../_lib/progress';

const STATUSES = ['todo', 'doing', 'done'];

interface MilestoneRow {
  id: string;
  project_id: string;
  title: string;
  status: string;
  client_id: string;
  project_title: string;
}

async function loadMilestone(env: Env, id: string): Promise<MilestoneRow | null> {
  return env.DB.prepare(
    `SELECT milestones.id, milestones.project_id, milestones.title, milestones.status,
            projects.client_id, projects.title as project_title
     FROM milestones JOIN projects ON projects.id = milestones.project_id
     WHERE milestones.id = ?`
  ).bind(id).first<MilestoneRow>();
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as {
    title?: string;
    status?: string;
    due_date?: string;
    sort_order?: number;
  };

  const existing = await loadMilestone(env, id);
  if (!existing) return notFound('Milestone not found');

  const updates: string[] = [];
  const bindings: (string | number | null)[] = [];

  if (body.status && STATUSES.includes(body.status)) {
    updates.push('status = ?');
    bindings.push(body.status);
    // completed_at tracks when the work actually finished, and clears if reopened.
    updates.push(body.status === 'done' ? `completed_at = datetime('now')` : 'completed_at = NULL');
  }
  if (body.title !== undefined) { updates.push('title = ?'); bindings.push(body.title.trim()); }
  if (body.due_date !== undefined) { updates.push('due_date = ?'); bindings.push(body.due_date || null); }
  if (body.sort_order !== undefined) { updates.push('sort_order = ?'); bindings.push(Number(body.sort_order) || 0); }

  if (!updates.length) return badRequest('No fields to update');

  bindings.push(id);
  await env.DB.prepare(`UPDATE milestones SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

  const progress = await recomputeProjectProgress(env, existing.project_id);

  if (body.status && body.status !== existing.status) {
    await logActivity(
      env, gate.email, 'project',
      `${existing.project_title}: "${existing.title}" → ${body.status} (${progress}%)`,
      existing.client_id, { type: 'project', id: existing.project_id }
    );
  }

  const milestone = await env.DB.prepare('SELECT * FROM milestones WHERE id = ?').bind(id).first();
  return json({ milestone, progress });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const existing = await loadMilestone(env, id);
  if (!existing) return notFound('Milestone not found');

  // Milestones are a working checklist, not a record of money or agreements —
  // a hard delete is right here, unlike projects/orders/invoices.
  await env.DB.prepare('DELETE FROM milestones WHERE id = ?').bind(id).run();
  const progress = await recomputeProjectProgress(env, existing.project_id);

  await logActivity(
    env, gate.email, 'project',
    `${existing.project_title}: removed milestone "${existing.title}"`,
    existing.client_id, { type: 'project', id: existing.project_id }
  );

  return json({ ok: true, progress });
};
