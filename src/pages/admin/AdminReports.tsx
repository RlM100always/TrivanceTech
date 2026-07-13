import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Inbox, Target } from 'lucide-react';
import { api, DashboardStats, Lead, Order } from '../../utils/adminApi';
import { Card, PageHeader, Spinner, money } from '../../components/admin/ui';

interface StatsResponse {
  stats: DashboardStats;
  leadsTrend: Array<{ day: string; count: number }>;
  recentLeads: Lead[];
}

const ORDER_STATUSES: Array<{ key: Order['status']; label: string; tone: string }> = [
  { key: 'paid', label: 'Paid', tone: 'bg-green-500' },
  { key: 'sent', label: 'Sent', tone: 'bg-amber-500' },
  { key: 'draft', label: 'Draft', tone: 'bg-gray-400' },
  { key: 'cancelled', label: 'Cancelled', tone: 'bg-red-500' },
];

const AdminReports: React.FC = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<StatsResponse>('/api/stats'),
      api.get<{ orders: Order[] }>('/api/orders'),
    ])
      .then(([s, o]) => { setData(s); setOrders(o.orders); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data || !orders) return <Spinner />;

  const s = data.stats;
  const maxTrend = Math.max(1, ...data.leadsTrend.map((d) => d.count));
  const totalLeadsInPeriod = data.leadsTrend.reduce((sum, d) => sum + d.count, 0);

  // Revenue by order status.
  const revenueByStatus = ORDER_STATUSES.map((st) => ({
    ...st,
    total: orders.filter((o) => o.status === st.key).reduce((sum, o) => sum + o.amount, 0),
    count: orders.filter((o) => o.status === st.key).length,
  }));
  const totalRevenue = revenueByStatus.reduce((sum, r) => sum + r.total, 0);

  // Conversion: leads → converted.
  const conversionRate = s.totalLeads > 0
    ? Math.round((orders.length / s.totalLeads) * 100)
    : 0;

  const kpis = [
    { label: 'Total Clients', value: s.totalClients, icon: Users, tone: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Leads (14d)', value: totalLeadsInPeriod, icon: Inbox, tone: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Paid Revenue', value: money(s.paidRevenue), icon: DollarSign, tone: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
    { label: 'Outstanding', value: money(s.unpaidRevenue), icon: Target, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Reports" subtitle="Live analytics across leads, revenue and conversion." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.tone}`}>
              <k.icon size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{k.value}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads trend */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Leads — last 14 days</h2>
          </div>
          {data.leadsTrend.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">No leads in this period.</p>
          ) : (
            <div className="flex items-end gap-1.5 h-48">
              {data.leadsTrend.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end group">
                  <span className="text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                  <div
                    className="w-full rounded-t bg-primary-500/80 hover:bg-primary-600 transition-colors"
                    style={{ height: `${(d.count / maxTrend) * 100}%` }}
                    title={`${d.day}: ${d.count}`}
                  />
                  <span className="text-[9px] text-gray-400 mt-1">{d.day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Conversion funnel */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Conversion</h2>
          <div className="space-y-4">
            <Funnel label="All-time leads" value={s.totalLeads} max={s.totalLeads} tone="bg-purple-500" />
            <Funnel label="Orders created" value={orders.length} max={s.totalLeads} tone="bg-blue-500" />
            <Funnel label="Paid orders" value={orders.filter((o) => o.status === 'paid').length} max={s.totalLeads} tone="bg-green-500" />
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-3xl font-bold text-primary-600">{conversionRate}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">lead → order conversion</p>
          </div>
        </Card>
      </div>

      {/* Revenue by status */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-green-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Revenue by order status</h2>
        </div>
        {totalRevenue === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No order revenue recorded yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              {revenueByStatus.filter((r) => r.total > 0).map((r) => (
                <div key={r.key} className={r.tone} style={{ width: `${(r.total / totalRevenue) * 100}%` }} title={`${r.label}: ${money(r.total)}`} />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {revenueByStatus.map((r) => (
                <div key={r.key}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${r.tone}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{r.label}</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{money(r.total)}</p>
                  <p className="text-xs text-gray-400">{r.count} order{r.count === 1 ? '' : 's'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const Funnel: React.FC<{ label: string; value: number; max: number; tone: string }> = ({ label, value, max, tone }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%` }} />
    </div>
  </div>
);

export default AdminReports;
