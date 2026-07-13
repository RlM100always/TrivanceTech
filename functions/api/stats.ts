import type { Env } from '../_lib/types';
import { requireAdmin } from '../_lib/guard';
import { json } from '../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const one = async (sql: string): Promise<number> => {
    const row = await env.DB.prepare(sql).first<{ n: number }>();
    return row?.n ?? 0;
  };

  const [
    totalClients, activeClients, newLeads, totalLeads,
    openConversations, unpaidRevenue, paidRevenue, openTasks,
  ] = await Promise.all([
    one('SELECT COUNT(*) as n FROM clients'),
    one("SELECT COUNT(*) as n FROM clients WHERE status = 'active'"),
    one("SELECT COUNT(*) as n FROM leads WHERE status = 'new'"),
    one('SELECT COUNT(*) as n FROM leads'),
    one("SELECT COUNT(*) as n FROM conversations WHERE status = 'open'"),
    one("SELECT COALESCE(SUM(due_amount),0) as n FROM orders WHERE status IN ('sent','draft')"),
    one("SELECT COALESCE(SUM(amount),0) as n FROM orders WHERE status = 'paid'"),
    one("SELECT COUNT(*) as n FROM tasks WHERE status != 'done'"),
  ]);

  // Leads per day for the last 14 days (for the reports chart).
  const { results: leadsTrend } = await env.DB.prepare(
    `SELECT date(created_at) as day, COUNT(*) as count
     FROM leads WHERE created_at >= datetime('now', '-14 days')
     GROUP BY day ORDER BY day ASC`
  ).all();

  const { results: recentLeads } = await env.DB.prepare(
    'SELECT id, name, email, subject, source, status, created_at FROM leads ORDER BY created_at DESC LIMIT 5'
  ).all();

  return json({
    stats: {
      totalClients, activeClients, newLeads, totalLeads,
      openConversations, unpaidRevenue, paidRevenue, openTasks,
    },
    leadsTrend,
    recentLeads,
  });
};
