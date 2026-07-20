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
    openConversations, billed, paidRevenue, openTasks,
    activeProjects, completedProjects,
  ] = await Promise.all([
    one('SELECT COUNT(*) as n FROM clients'),
    one("SELECT COUNT(*) as n FROM clients WHERE status = 'active'"),
    one("SELECT COUNT(*) as n FROM leads WHERE status = 'new'"),
    one('SELECT COUNT(*) as n FROM leads'),
    one("SELECT COUNT(*) as n FROM conversations WHERE status = 'open'"),
    // Revenue now comes from the invoice/payment ledger, not orders.due_amount —
    // that column is deprecated and no longer written to.
    one(`SELECT COALESCE(SUM(amount),0) as n FROM invoices
         WHERE deleted_at IS NULL AND status NOT IN ('draft','void')`),
    one(`SELECT COALESCE(SUM(payments.amount),0) as n FROM payments
         JOIN invoices ON invoices.id = payments.invoice_id
         WHERE invoices.deleted_at IS NULL AND invoices.status != 'void'`),
    one("SELECT COUNT(*) as n FROM tasks WHERE status != 'done'"),
    one(`SELECT COUNT(*) as n FROM projects
         WHERE deleted_at IS NULL AND status NOT IN ('completed','cancelled')`),
    one("SELECT COUNT(*) as n FROM projects WHERE deleted_at IS NULL AND status = 'completed'"),
  ]);

  const unpaidRevenue = Math.round((billed - paidRevenue) * 100) / 100;

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
      billedRevenue: billed, activeProjects, completedProjects,
    },
    leadsTrend,
    recentLeads,
  });
};
