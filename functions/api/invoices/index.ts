import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';
import { INVOICE_SELECT, nextInvoiceNumber } from '../../_lib/billing';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const clientId = url.searchParams.get('client_id');

  let query =
    `SELECT ${INVOICE_SELECT}, clients.name as client_name, clients.email as client_email,
            projects.title as project_title
     FROM invoices
     JOIN clients ON clients.id = invoices.client_id
     LEFT JOIN projects ON projects.id = invoices.project_id
     WHERE invoices.deleted_at IS NULL`;
  const bindings: string[] = [];
  if (status && status !== 'all') { query += ' AND invoices.status = ?'; bindings.push(status); }
  if (clientId) { query += ' AND invoices.client_id = ?'; bindings.push(clientId); }
  query += ' ORDER BY invoices.created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();

  // Company-wide totals for the finance dashboard. Voided invoices are excluded
  // from "billed" — they represent money that was never actually owed.
  const totals = await env.DB.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN status NOT IN ('draft','void') THEN amount END), 0) as billed,
       COALESCE((SELECT SUM(payments.amount) FROM payments
                 JOIN invoices i2 ON i2.id = payments.invoice_id
                 WHERE i2.deleted_at IS NULL AND i2.status != 'void'), 0) as collected
     FROM invoices WHERE deleted_at IS NULL`
  ).first<{ billed: number; collected: number }>();

  const billed = Math.round((totals?.billed ?? 0) * 100) / 100;
  const collected = Math.round((totals?.collected ?? 0) * 100) / 100;

  return json({
    invoices: results,
    totals: { billed, collected, outstanding: Math.round((billed - collected) * 100) / 100 },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    client_id?: string;
    order_id?: string;
    project_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    due_at?: string;
    notes?: string;
  };
  if (!body.client_id) return badRequest('client_id is required');

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return badRequest('amount must be greater than zero');

  const status = body.status === 'sent' ? 'sent' : 'draft';
  const id = uuid();
  const number = await nextInvoiceNumber(env);

  await env.DB.prepare(
    `INSERT INTO invoices (id, client_id, order_id, project_id, number, amount, currency, status, due_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.client_id,
    body.order_id || null,
    body.project_id || null,
    number,
    Math.round(amount * 100) / 100,
    body.currency?.trim() || 'USD',
    status,
    body.due_at || null,
    body.notes?.trim() || null
  ).run();

  await logActivity(
    env, gate.email, 'invoice', `Created invoice ${number} for ${amount}`,
    body.client_id, { type: 'invoice', id }
  );

  const invoice = await env.DB.prepare(
    `SELECT ${INVOICE_SELECT} FROM invoices WHERE id = ?`
  ).bind(id).first();
  return json({ invoice }, { status: 201 });
};
