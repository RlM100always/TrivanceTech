import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Inbox, MessageSquare, DollarSign, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { api, DashboardStats, Lead } from '../../utils/adminApi';
import { Card, Badge, STATUS_TONE, Spinner, formatDate, money } from '../../components/admin/ui';

interface StatsResponse {
  stats: DashboardStats;
  leadsTrend: Array<{ day: string; count: number }>;
  recentLeads: Lead[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<StatsResponse>('/api/stats').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <Spinner />;

  const s = data.stats;
  const cards = [
    { label: 'Total Clients', value: s.totalClients, sub: `${s.activeClients} active`, icon: Users, tone: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'New Leads', value: s.newLeads, sub: `${s.totalLeads} all-time`, icon: Inbox, tone: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Open Chats', value: s.openConversations, sub: 'conversations', icon: MessageSquare, tone: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30' },
    { label: 'Open Tasks', value: s.openTasks, sub: 'to do', icon: CheckSquare, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Revenue (paid)', value: money(s.paidRevenue), sub: `${money(s.unpaidRevenue)} outstanding`, icon: DollarSign, tone: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
  ];

  const maxTrend = Math.max(1, ...data.leadsTrend.map((d) => d.count));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Live snapshot across clients, leads, chats and revenue.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.tone}`}>
              <c.icon size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Leads — last 14 days</h2>
          </div>
          {data.leadsTrend.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">No leads yet.</p>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {data.leadsTrend.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t bg-primary-500/80 hover:bg-primary-600 transition-colors"
                    style={{ height: `${(d.count / maxTrend) * 100}%` }}
                    title={`${d.day}: ${d.count}`}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Inquiries</h2>
            <Link to="/admin/orders" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              All <ArrowRight size={12} />
            </Link>
          </div>
          {data.recentLeads.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No inquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentLeads.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{l.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{l.subject || l.message}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(l.created_at)}</p>
                  </div>
                  <Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
