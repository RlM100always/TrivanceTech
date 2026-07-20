import React, { useCallback, useEffect, useState } from 'react';
import { Receipt, Plus, X, Wallet } from 'lucide-react';
import {
  api, Invoice, Payment, Client, Project, BillingTotals,
  PAYMENT_METHODS, PaymentMethod, invoiceBalance, formatStatus,
} from '../../utils/adminApi';
import {
  Card, PageHeader, Spinner, EmptyState, Badge, STATUS_TONE, formatDate, money,
} from '../../components/admin/ui';

const STATUS_FILTERS = ['all', 'draft', 'sent', 'partial', 'paid', 'void'] as const;

const AdminFinance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [totals, setTotals] = useState<BillingTotals | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('all');
  const [creating, setCreating] = useState(false);
  const [payFor, setPayFor] = useState<Invoice | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.get<{ invoices: Invoice[]; totals: BillingTotals }>(`/api/invoices?status=${filter}`)
      .then((d) => { setInvoices(d.invoices); setTotals(d.totals); })
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get<{ clients: Client[] }>('/api/clients')
      .then((d) => setClients(d.clients))
      .catch(() => { /* picker stays empty */ });
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title="Finance"
        subtitle="Invoices and the payment ledger."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
          >
            <Plus size={16} /> New invoice
          </button>
        }
      />

      {totals && (
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <StatTile label="Billed" value={money(totals.billed)} />
          <StatTile label="Collected" value={money(totals.collected)} tone="text-green-600 dark:text-green-400" />
          <StatTile label="Outstanding" value={money(totals.outstanding)} tone="text-amber-600 dark:text-amber-400" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {formatStatus(s)}
          </button>
        ))}
      </div>

      {!invoices ? <Spinner /> : invoices.length === 0 ? (
        <Card><EmptyState icon={<Receipt size={36} />} title="No invoices" hint="Create one to start billing a client." /></Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-right">Paid</th>
                <th className="px-4 py-3 font-medium text-right">Balance</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const balance = invoiceBalance(inv);
                return (
                  <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-800/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{inv.number}</p>
                      <p className="text-[11px] text-gray-400">
                        {inv.project_title ?? 'No project'} · {formatDate(inv.issued_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{inv.client_name}</td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{money(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{money(inv.paid, inv.currency)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${balance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
                      {money(balance, inv.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[inv.status] ?? 'gray'}>{formatStatus(inv.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {inv.status === 'draft' && (
                        <button
                          onClick={async () => { await api.patch(`/api/invoices/${inv.id}`, { status: 'sent' }); load(); }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 mr-1"
                        >
                          Mark sent
                        </button>
                      )}
                      {balance > 0 && inv.status !== 'draft' && inv.status !== 'void' && (
                        <button
                          onClick={() => setPayFor(inv)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-primary-600 text-white"
                        >
                          <Wallet size={12} /> Record payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {creating && (
        <NewInvoiceModal
          clients={clients}
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); load(); }}
        />
      )}
      {payFor && (
        <RecordPaymentModal
          invoice={payFor}
          onClose={() => setPayFor(null)}
          onRecorded={() => { setPayFor(null); load(); }}
        />
      )}
    </div>
  );
};

const StatTile: React.FC<{ label: string; value: string; tone?: string }> = ({ label, value, tone }) => (
  <Card className="p-4">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-1 text-xl font-bold ${tone ?? 'text-gray-900 dark:text-white'}`}>{value}</p>
  </Card>
);

const NewInvoiceModal: React.FC<{
  clients: Client[];
  onClose: () => void;
  onCreated: () => void;
}> = ({ clients, onClose, onCreated }) => {
  const [form, setForm] = useState({
    client_id: '', project_id: '', amount: '', currency: 'USD', due_at: '', notes: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Only offer projects belonging to the chosen client.
  useEffect(() => {
    if (!form.client_id) { setProjects([]); return; }
    api.get<{ projects: Project[] }>(`/api/projects?client_id=${form.client_id}`)
      .then((d) => setProjects(d.projects))
      .catch(() => setProjects([]));
  }, [form.client_id]);

  const submit = async () => {
    const amount = Number(form.amount);
    if (!form.client_id) { setErr('Select a client.'); return; }
    if (!Number.isFinite(amount) || amount <= 0) { setErr('Enter an amount greater than zero.'); return; }
    setBusy(true);
    try {
      await api.post('/api/invoices', { ...form, amount, project_id: form.project_id || null });
      onCreated();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-md p-5">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">New invoice</h2>
            <button onClick={onClose} aria-label="Close"><X size={18} /></button>
          </div>

          <div className="space-y-3">
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value, project_id: '' })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Select a client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
            </select>

            <select
              value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })}
              disabled={!projects.length}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">No project (general invoice)</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <input
                placeholder="USD"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                className="w-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Due date
              <input
                type="date"
                value={form.due_at}
                onChange={(e) => setForm({ ...form, due_at: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </label>

            <textarea
              placeholder="Notes (shown to the client)"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white resize-none"
            />

            {err && <p className="text-sm text-red-600">{err}</p>}
            <p className="text-[11px] text-gray-400">
              Created as a draft — clients only see it once you mark it sent.
            </p>
            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium"
            >
              {busy ? 'Creating…' : 'Create invoice'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const RecordPaymentModal: React.FC<{
  invoice: Invoice;
  onClose: () => void;
  onRecorded: () => void;
}> = ({ invoice, onClose, onRecorded }) => {
  const balance = invoiceBalance(invoice);
  // Default to settling the invoice in full — the common case is one payment.
  const [form, setForm] = useState({
    amount: String(balance), method: 'bkash' as PaymentMethod, reference: '', paid_at: '', note: '',
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get<{ payments: Payment[] }>(`/api/payments?invoice_id=${invoice.id}`)
      .then((d) => setPayments(d.payments))
      .catch(() => setPayments([]));
  }, [invoice.id]);

  const submit = async () => {
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) { setErr('Enter an amount greater than zero.'); return; }
    setBusy(true);
    try {
      await api.post('/api/payments', { ...form, invoice_id: invoice.id, amount });
      onRecorded();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-md p-5">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-900 dark:text-white">Record payment</h2>
            <button onClick={onClose} aria-label="Close"><X size={18} /></button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {invoice.number} · {money(balance, invoice.currency)} outstanding
          </p>

          <div className="space-y-3">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{formatStatus(m)}</option>)}
            </select>
            <input
              placeholder="Transaction / reference no."
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Paid on (leave blank for now)
              <input
                type="date"
                value={form.paid_at}
                onChange={(e) => setForm({ ...form, paid_at: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </label>

            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium"
            >
              {busy ? 'Recording…' : 'Record payment'}
            </button>
          </div>

          {payments.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Payment history</p>
              <ul className="space-y-1.5">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatDate(p.paid_at)} · {formatStatus(p.method)}
                      {p.reference && <span className="text-gray-400"> · {p.reference}</span>}
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {money(p.amount, p.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminFinance;
