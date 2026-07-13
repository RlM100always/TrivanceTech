import React, { useEffect, useState, useCallback } from 'react';
import { Search, Users, X, Mail, Phone, Building2, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { api, Client, Order, Activity } from '../../utils/adminApi';
import { Card, PageHeader, Badge, STATUS_TONE, Spinner, EmptyState, formatDate, money } from '../../components/admin/ui';

const STAGES = ['new', 'contacted', 'proposal', 'active', 'completed', 'archived'];

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Client | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search) params.set('search', search);
    api.get<{ clients: Client[] }>(`/api/clients?${params}`).then((d) => setClients(d.clients)).catch((e) => setError(e.message));
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Clients" subtitle="Everyone who has signed in — profiles, stage and history." />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'active', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                status === st ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {!clients ? <Spinner /> : clients.length === 0 ? (
        <Card><EmptyState icon={<Users size={40} />} title="No clients yet" hint="Clients appear after they sign in via Google." /></Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.avatar_url
                        ? <img src={c.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                        : <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-xs font-semibold">{c.name.charAt(0)}</div>}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.company || '—'}</td>
                  <td className="px-4 py-3"><Badge tone={STATUS_TONE[c.stage] ?? 'gray'}>{c.stage}</Badge></td>
                  <td className="px-4 py-3"><Badge tone={STATUS_TONE[c.status] ?? 'gray'}>{c.status}</Badge></td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(c.last_login_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {selected && <ClientDrawer client={selected} onClose={() => setSelected(null)} onSaved={(c) => { setSelected(c); load(); }} />}
    </div>
  );
};

const ClientDrawer: React.FC<{ client: Client; onClose: () => void; onSaved: (c: Client) => void }> = ({ client, onClose, onSaved }) => {
  const [notes, setNotes] = useState(client.notes ?? '');
  const [status, setStatus] = useState(client.status);
  const [stage, setStage] = useState(client.stage);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const reload = useCallback(() => {
    api.get<{ orders: Order[]; activity: Activity[] }>(`/api/clients/${client.id}`)
      .then((d) => { setOrders(d.orders ?? []); setActivity(d.activity ?? []); })
      .catch(() => {});
  }, [client.id]);

  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    setSaving(true);
    try {
      const { client: updated } = await api.patch<{ client: Client }>(`/api/clients/${client.id}`, { notes, status, stage });
      onSaved(updated);
      reload();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Advance stage immediately (one tap on the pipeline).
  const setStageNow = async (s: string) => {
    setStage(s);
    try {
      const { client: updated } = await api.patch<{ client: Client }>(`/api/clients/${client.id}`, { stage: s });
      onSaved(updated);
      reload();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const markPaid = async (o: Order) => {
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: 'paid', due_amount: 0 } : x)));
    try {
      await api.patch(`/api/orders/${o.id}`, { status: 'paid', due_amount: 0 });
      reload();
    } catch (e) {
      alert((e as Error).message);
      reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Client</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            {client.avatar_url
              ? <img src={client.avatar_url} alt="" className="w-14 h-14 rounded-full" />
              : <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-lg font-semibold">{client.name.charAt(0)}</div>}
            <div>
              <p className="font-semibold text-lg text-gray-900 dark:text-white">{client.name}</p>
              <Badge tone={STATUS_TONE[stage] ?? 'gray'}>{stage}</Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2"><Mail size={14} />{client.email}</p>
            {client.phone && <p className="flex items-center gap-2"><Phone size={14} />{client.phone}</p>}
            {client.company && <p className="flex items-center gap-2"><Building2 size={14} />{client.company}</p>}
            <p className="text-xs text-gray-400">Joined {formatDate(client.created_at)}</p>
          </div>

          {/* Lifecycle stage pipeline — one tap advances the client */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Lifecycle stage</label>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStageNow(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    stage === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Account status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white capitalize">
              <option value="active">active</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Internal notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" placeholder="Private notes about this client…" />
          </div>

          <button onClick={save} disabled={saving} className="w-full py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Orders</h3>
              <button onClick={() => setShowOrder((v) => !v)} className="text-xs text-primary-600 flex items-center gap-1"><Plus size={12} />New order</button>
            </div>
            {showOrder && <NewOrderForm clientId={client.id} onCreated={(o) => { setOrders((p) => [o, ...p]); setShowOrder(false); }} />}
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">No orders yet.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {orders.map((o) => (
                  <li key={o.id} className="border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200 truncate">{o.subject}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-gray-500">{money(o.amount, o.currency)}</span>
                        <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                      </span>
                    </div>
                    {o.status !== 'paid' && o.status !== 'cancelled' && (
                      <button
                        onClick={() => markPaid(o)}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
                      >
                        <CheckCircle2 size={13} /> Mark paid
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Clock size={14} /> Activity
            </h3>
            {activity.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">No activity yet.</p>
            ) : (
              <ul className="space-y-3 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                {activity.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-white dark:ring-gray-900" />
                    <p className="text-sm text-gray-700 dark:text-gray-200">{a.detail || a.action}</p>
                    <p className="text-[11px] text-gray-400">{formatDate(a.created_at)} · {a.admin_email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewOrderForm: React.FC<{ clientId: string; onCreated: (o: Order) => void }> = ({ clientId, onCreated }) => {
  const [subject, setSubject] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!subject.trim()) return;
    setBusy(true);
    try {
      const { order } = await api.post<{ order: Order }>('/api/orders', { client_id: clientId, subject, amount: Number(amount) || 0 });
      onCreated(order);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 mb-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Order subject" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-white" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (USD)" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-white" />
      <button onClick={submit} disabled={busy} className="w-full py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium disabled:opacity-60">{busy ? 'Creating…' : 'Create order'}</button>
    </div>
  );
};

export default AdminClients;
