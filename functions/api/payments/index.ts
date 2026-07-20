import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';
import { getInvoiceTotals, syncInvoiceStatus } from '../../_lib/billing';

const METHODS = ['bkash', 'nagad', 'bank', 'wise', 'paypal', 'cash', 'other'];

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const invoiceId = url.searchParams.get('invoice_id');
  const clientId = url.searchParams.get('client_id');

  let query =
    `SELECT payments.*, invoices.number as invoice_number, clients.name as client_name
     FROM payments
     JOIN invoices ON invoices.id = payments.invoice_id
     JOIN clients ON clients.id = payments.client_id
     WHERE 1 = 1`;
  const bindings: string[] = [];
  if (invoiceId) { query += ' AND payments.invoice_id = ?'; bindings.push(invoiceId); }
  if (clientId) { query += ' AND payments.client_id = ?'; bindings.push(clientId); }
  query += ' ORDER BY payments.paid_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ payments: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    invoice_id?: string;
    amount?: number;
    method?: string;
    reference?: string;
    paid_at?: string;
    note?: string;
  };
  if (!body.invoice_id) return badRequest('invoice_id is required');

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return badRequest('amount must be greater than zero');

  const invoice = await env.DB.prepare(
    'SELECT id, client_id, number, currency, status FROM invoices WHERE id = ? AND deleted_at IS NULL'
  ).bind(body.invoice_id).first<{
    id: string; client_id: string; number: string; currency: string; status: string;
  }>();
  if (!invoice) return badRequest('Invoice not found');
  if (invoice.status === 'void') return badRequest('Cannot record a payment against a voided invoice');

  const totals = await getInvoiceTotals(env, invoice.id);
  const rounded = Math.round(amount * 100) / 100;
  // Guard against fat-fingered overpayment: the admin sees the remaining balance
  // in the error rather than silently pushing the invoice negative.
  if (totals && rounded > totals.balance) {
    return badRequest(
      `Payment of ${rounded} exceeds the outstanding balance of ${totals.balance} on ${invoice.number}.`
    );
  }

  const method = body.method && METHODS.includes(body.method) ? body.method : 'other';
  const id = uuid();

  await env.DB.prepare(
    `INSERT INTO payments
       (id, invoice_id, client_id, amount, currency, method, reference, paid_at, recorded_by_admin_email, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), ?, ?)`
  ).bind(
    id, invoice.id, invoice.client_id, rounded, invoice.currency, method,
    body.reference?.trim() || null, body.paid_at || null, gate.email, body.note?.trim() || null
  ).run();

  const status = await syncInvoiceStatus(env, invoice.id);
  const after = await getInvoiceTotals(env, invoice.id);

  await logActivity(
    env, gate.email, 'payment',
    `Recorded ${rounded} ${invoice.currency} via ${method} on ${invoice.number} (${after?.balance ?? 0} remaining)`,
    invoice.client_id, { type: 'invoice', id: invoice.id }
  );

  const payment = await env.DB.prepare('SELECT * FROM payments WHERE id = ?').bind(id).first();
  return json({ payment, invoice_status: status, totals: after }, { status: 201 });
};
