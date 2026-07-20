import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, notFound } from '../../_lib/http';
import { INVOICE_SELECT } from '../../_lib/billing';

/**
 * The client portal's single read: everything the signed-in client is entitled
 * to see about their own account. This is the mirror of the admin-only
 * /api/clients/[id] aggregate, but scoped hard to the session's OWN client row —
 * the client id is resolved from the session's Google subject id and never
 * accepted from the query string, so one client can't request another's data.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const client = await env.DB.prepare(
    `SELECT id, name, email, avatar_url, company, phone, stage, created_at, last_login_at
     FROM clients WHERE google_sub = ? AND deleted_at IS NULL`
  ).bind(session.sub).first<{ id: string }>();
  if (!client) return notFound('Client profile not found');

  const [projects, milestones, orders, invoices, payments, files, activity, conversations] = await Promise.all([
    env.DB.prepare(
      `SELECT id, title, description, status, progress, start_date, target_date, delivered_at,
              repo_url, live_url, deliverable_url, delivery_note, created_at
       FROM projects WHERE client_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
    ).bind(client.id).all(),

    // Every milestone across the client's projects, fetched flat and grouped
    // below — one query beats N per-project round trips on D1.
    env.DB.prepare(
      `SELECT milestones.id, milestones.project_id, milestones.title, milestones.status,
              milestones.due_date, milestones.completed_at, milestones.sort_order
       FROM milestones JOIN projects ON projects.id = milestones.project_id
       WHERE projects.client_id = ? AND projects.deleted_at IS NULL
       ORDER BY milestones.sort_order ASC, milestones.created_at ASC`
    ).bind(client.id).all(),

    env.DB.prepare(
      `SELECT id, subject, description, status, amount, currency, created_at
       FROM orders WHERE client_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
    ).bind(client.id).all(),

    // Drafts are internal — a client should only ever see an invoice once it's sent.
    env.DB.prepare(
      `SELECT ${INVOICE_SELECT}, projects.title as project_title
       FROM invoices LEFT JOIN projects ON projects.id = invoices.project_id
       WHERE invoices.client_id = ? AND invoices.deleted_at IS NULL AND invoices.status != 'draft'
       ORDER BY invoices.issued_at DESC`
    ).bind(client.id).all(),

    env.DB.prepare(
      `SELECT payments.id, payments.amount, payments.currency, payments.method,
              payments.reference, payments.paid_at, invoices.number as invoice_number
       FROM payments JOIN invoices ON invoices.id = payments.invoice_id
       WHERE payments.client_id = ? AND invoices.deleted_at IS NULL
       ORDER BY payments.paid_at DESC`
    ).bind(client.id).all(),

    env.DB.prepare(
      `SELECT id, url, drive_file_id, drive_view_url, file_name, mime_type, uploaded_by, created_at
       FROM client_files WHERE client_id = ? ORDER BY created_at DESC`
    ).bind(client.id).all(),

    // Timeline of the whole relationship. `detail` is admin-authored prose, so
    // internal-only actions (notes, stage changes) are filtered out here.
    env.DB.prepare(
      `SELECT action, entity_type, entity_id, detail, created_at
       FROM activity_log
       WHERE client_id = ? AND action IN ('project', 'invoice', 'payment', 'order', 'file')
       ORDER BY created_at DESC LIMIT 100`
    ).bind(client.id).all(),

    env.DB.prepare(
      `SELECT id, subject, status, project_id, last_message_at
       FROM conversations WHERE client_id = ? ORDER BY last_message_at DESC`
    ).bind(client.id).all(),
  ]);

  const invoiceRows = invoices.results as Array<{ amount: number; paid: number }>;
  const billed = invoiceRows.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const paid = invoiceRows.reduce((sum, i) => sum + (i.paid ?? 0), 0);

  // Attach each project's checklist so the UI renders without a second request.
  const milestoneRows = milestones.results as Array<{ project_id: string }>;
  const projectRows = (projects.results as Array<{ id: string }>).map((p) => ({
    ...p,
    milestones: milestoneRows.filter((m) => m.project_id === p.id),
  }));

  return json({
    client,
    projects: projectRows,
    orders: orders.results,
    invoices: invoiceRows,
    payments: payments.results,
    files: files.results,
    activity: activity.results,
    conversations: conversations.results,
    totals: {
      billed: Math.round(billed * 100) / 100,
      paid: Math.round(paid * 100) / 100,
      outstanding: Math.round((billed - paid) * 100) / 100,
    },
  });
};
