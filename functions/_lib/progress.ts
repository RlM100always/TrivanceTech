import type { Env } from './types';

/**
 * Recomputes projects.progress from its milestones. Progress is always DERIVED —
 * never set directly by a caller — so the percentage a client sees can't drift
 * from the checklist it claims to summarise. A project with no milestones keeps
 * whatever progress it had at 0 rather than reporting a misleading 100%.
 */
export async function recomputeProjectProgress(env: Env, projectId: string): Promise<number> {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done
     FROM milestones WHERE project_id = ?`
  ).bind(projectId).first<{ total: number; done: number | null }>();

  const total = row?.total ?? 0;
  const done = row?.done ?? 0;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  await env.DB.prepare('UPDATE projects SET progress = ? WHERE id = ?')
    .bind(progress, projectId).run();

  return progress;
}
