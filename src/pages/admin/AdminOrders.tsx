import React, { useEffect, useState, useCallback } from 'react';
import { Search, Inbox, Mail, Phone, Building2, ExternalLink, Trash2 } from 'lucide-react';
import { api, Lead, Order } from '../../utils/adminApi';
import { Card, PageHeader, Badge, Spinner, EmptyState, formatDate, money } from '../../components/admin/ui';

const LEAD_STATUSES = ['all', 'new', 'contacted', 'converted', 'closed'];
const ORDER_STATUSES = ['all', 'draft', 'sent', 'paid', 'cancelled'];

const AdminOrders: React.FC = () => {
  const [tab, setTab] = useState<'inquiries' | 'orders'>('inquiries');

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Orders & Inquiries" subtitle="Everything a client submits lands here — triage, filter and convert." />
      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(['inquiries', 'orders'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'inquiries' ? <InquiriesTab /> : <OrdersTab />}
    </div>
  );
};

const InquiriesTab: React.FC = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search) params.set('search', search);
    api.get<{ leads: Lead[] }>(`/api/leads?${params}`).then((d) => setLeads(d.leads)).catch((e) => setError(e.message));
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const setLeadStatus = async (id: string, newStatus: string) => {
    setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, status: newStatus as Lead['status'] } : l)) ?? null);
    await api.patch(`/api/leads/${id}`, { status: newStatus }).catch(() => load());
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    setLeads((prev) => prev?.filter((l) => l.id !== id) ?? null);
    await api.del(`/api/leads/${id}`).catch(() => load());
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {LEAD_STATUSES.map((st) => (
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
      {!leads ? <Spinner /> : leads.length === 0 ? (
        <Card><EmptyState icon={<Inbox size={40} />} title="No inquiries" hint="Contact form submissions show up here." /></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {leads.map((l) => {
            const meta = l.meta ? (JSON.parse(l.meta) as Record<string, string>) : null;
            return (
              <Card key={l.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{l.name}</h3>
                      <Badge tone={l.source === 'order' ? 'purple' : 'blue'}>{l.source}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDate(l.created_at)}</p>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>

                {l.subject && <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">{l.subject}</p>}
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{l.message}</p>

                <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 hover:text-primary-600"><Mail size={13} />{l.email}</a>
                  {l.phone && <span className="flex items-center gap-1.5"><Phone size={13} />{l.phone}</span>}
                  {l.company && <span className="flex items-center gap-1.5"><Building2 size={13} />{l.company}</span>}
                </div>

                {meta && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(meta).filter(([, v]) => v).map(([k, v]) => (
                      <span key={k} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Status</span>
                  <select
                    value={l.status}
                    onChange={(e) => setLeadStatus(l.id, e.target.value)}
                    className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200 capitalize"
                  >
                    {['new', 'contacted', 'converted', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    api.get<{ orders: Order[] }>(`/api/orders?${params}`).then((d) => setOrders(d.orders)).catch((e) => setError(e.message));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const setOrderStatus = async (id: string, newStatus: string) => {
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status: newStatus as Order['status'] } : o)) ?? null);
    await api.patch(`/api/orders/${id}`, { status: newStatus }).catch(() => load());
  };

  return (
    <>
      <div className="flex gap-1 flex-wrap mb-4">
        {ORDER_STATUSES.map((st) => (
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

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {!orders ? <Spinner /> : orders.length === 0 ? (
        <Card><EmptyState icon={<ExternalLink size={40} />} title="No orders yet" hint="Create orders from a client's profile." /></Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{o.subject}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{o.client_name}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{money(o.amount, o.currency)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => setOrderStatus(o.id, e.target.value)}
                      className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 capitalize text-gray-700 dark:text-gray-200"
                    >
                      {['draft', 'sent', 'paid', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

export default AdminOrders;
