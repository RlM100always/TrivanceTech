import type { Env } from './types';

/**
 * Invoice rows always carry a computed `paid` (sum of its payments) alongside
 * `amount`. Balance is derived at read time — there is deliberately no stored
 * `due` column anywhere, so a mis-ordered write can never leave a client looking
 * at a balance that disagrees with the payment list right below it.
 */
export const INVOICE_SELECT = `invoices.*,
  COALESCE((SELECT SUM(amount) FROM payments WHERE payments.invoice_id = invoices.id), 0) as paid`;

export interface InvoiceTotals {
  amount: number;
  paid: number;
  balance: number;
}

export async function getInvoiceTotals(env: Env, invoiceId: string): Promise<InvoiceTotals | null> {
  const row = await env.DB.prepare(
    `SELECT amount,
            COALESCE((SELECT SUM(amount) FROM payments WHERE invoice_id = ?), 0) as paid
     FROM invoices WHERE id = ? AND deleted_at IS NULL`
  ).bind(invoiceId, invoiceId).first<{ amount: number; paid: number }>();
  if (!row) return null;

  // Round to cents: repeated float addition of partial payments otherwise leaves
  // a residue like 0.00000001 that would keep an invoice from ever reading "paid".
  const amount = Math.round(row.amount * 100) / 100;
  const paid = Math.round(row.paid * 100) / 100;
  return { amount, paid, balance: Math.round((amount - paid) * 100) / 100 };
}

/**
 * Re-derives an invoice's status from its payment ledger.
 * `draft` and `void` are administrative states the ledger must not override —
 * an unsent draft that somehow has a payment stays a draft until an admin sends it.
 */
export async function syncInvoiceStatus(env: Env, invoiceId: string): Promise<string | null> {
  const totals = await getInvoiceTotals(env, invoiceId);
  if (!totals) return null;

  const current = await env.DB.prepare('SELECT status FROM invoices WHERE id = ?')
    .bind(invoiceId).first<{ status: string }>();
  if (!current || current.status === 'draft' || current.status === 'void') return current?.status ?? null;

  const next = totals.paid <= 0 ? 'sent' : totals.balance <= 0 ? 'paid' : 'partial';
  if (next !== current.status) {
    await env.DB.prepare('UPDATE invoices SET status = ? WHERE id = ?').bind(next, invoiceId).run();
  }
  return next;
}

/** Sequential, human-readable invoice number scoped to the calendar year. */
export async function nextInvoiceNumber(env: Env): Promise<string> {
  const year = new Date().getUTCFullYear();
  const prefix = `INV-${year}-`;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) as n FROM invoices WHERE number LIKE ?'
  ).bind(`${prefix}%`).first<{ n: number }>();
  return `${prefix}${String((row?.n ?? 0) + 1).padStart(4, '0')}`;
}
