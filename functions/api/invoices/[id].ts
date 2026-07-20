import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound } from '../../_lib/http';
import { INVOICE_SELECT, getInvoiceTotals, syncInvoiceStatus } from '../../_lib/billing';

const STATUSES = ['draft', 'sent', 'partial', 'paid', 'void'];

interface InvoiceRow { id: string; client_id: string; number: string; status: string }

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const invoice = await env.DB.prepare(
    `SELECT ${INVOICE_SELECT}, clients.name as client_name, clients.email as client_email
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.id = ? AND invoices.deleted_at IS NULL`
  ).bind(id).first();
  if (!invoice) return notFound('Invoice not found');

  const { results: payments } = await env.DB.prepare(
    'SELECT * FROM payments WHERE invoice_id = ? ORDER BY paid_at DESC'
  ).bind(id).all();

  return json({ invoice, payments, totals: await getInvoiceTotals(env, id) });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const body = await request.json().catch(() => ({})) as {
    status?: string;
    amount?: number;
    due_at?: string;
    notes?: string;
    project_id?: string;
  };

  const existing = await env.DB.prepare(
    'SELECT id, client_id, number, status FROM invoices WHERE id = ? AND deleted_at IS NULL'
  ).bind(id).first<InvoiceRow>();
  if (!existing) return notFound('Invoice not found');

  const updates: string[] = [];
  const bindings: (string | number | null)[] = [];

  if (body.status && STATUSES.includes(body.status)) { updates.push('status = ?'); bindings.push(body.status); }
  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return badRequest('amount must be greater than zero');
    updates.push('amount = ?');
    bindings.push(Math.round(amount * 100) / 100);
  }
  if (body.due_at !== undefined) { updates.push('due_at = ?'); bindings.push(body.due_at || null); }
  if (body.notes !== undefined) { updates.push('notes = ?'); bindings.push(body.notes?.trim() || null); }
  if (body.project_id !== undefined) { updates.push('project_id = ?'); bindings.push(body.project_id || null); }

  if (!updates.length) return badRequest('No fields to update');

  bindings.push(id);
  await env.DB.prepare(`UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

  // Changing the amount can flip an invoice between partial and paid, so re-derive.
  await syncInvoiceStatus(env, id);

  await logActivity(
    env, gate.email, 'invoice', `Updated invoice ${existing.number}`,
    existing.client_id, { type: 'invoice', id }
  );

  const invoice = await env.DB.prepare(`SELECT ${INVOICE_SELECT} FROM invoices WHERE id = ?`).bind(id).first();
  return json({ invoice, totals: await getInvoiceTotals(env, id) });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const id = params.id as string;
  const existing = await env.DB.prepare(
    'SELECT id, client_id, number, status FROM invoices WHERE id = ? AND deleted_at IS NULL'
  ).bind(id).first<InvoiceRow>();
  if (!existing) return notFound('Invoice not found');

  // Refuse to delete an invoice with money against it — voiding is the correct
  // action there, and it keeps the payment records attached to something real.
  const totals = await getInvoiceTotals(env, id);
  if ((totals?.paid ?? 0) > 0) {
    return badRequest('This invoice has recorded payments — set its status to "void" instead of deleting it.');
  }

  await env.DB.prepare(`UPDATE invoices SET deleted_at = datetime('now') WHERE id = ?`).bind(id).run();
  await logActivity(
    env, gate.email, 'invoice', `Deleted invoice ${existing.number}`,
    existing.client_id, { type: 'invoice', id }
  );
  return json({ ok: true });
};
