import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatPanel from '../components/chat/ChatPanel';
import SEO from '../components/seo/SEO';
import {
  LogOut, Loader2, MessageCircle, LayoutDashboard, FolderKanban,
  FileText, Receipt, History, ExternalLink, Github, CheckCircle2, Circle, CircleDot,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, STATUS_TONE, ProgressBar, formatDate, money } from '../components/admin/ui';
import { formatStatus, invoiceBalance } from '../utils/adminApi';
import type { Project, Invoice, Payment, Activity } from '../utils/adminApi';
import { whatsappChatLink } from '../utils/socialLinks';

interface Conversation { id: string; subject: string; status: string }
interface ClientFile {
  id: string; url: string; drive_view_url?: string | null;
  file_name: string; uploaded_by: string; created_at: string;
}
interface OrderSummary {
  id: string; subject: string; status: string; amount: number; currency: string; created_at: string;
}

interface Overview {
  client: { id: string; name: string; email: string; company?: string | null; stage: string; created_at: string };
  projects: Project[];
  orders: OrderSummary[];
  invoices: Invoice[];
  payments: Payment[];
  files: ClientFile[];
  activity: Activity[];
  conversations: Conversation[];
  totals: { billed: number; paid: number; outstanding: number };
}

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'chat', label: 'Chat', icon: MessageCircle },
  { key: 'files', label: 'Files', icon: FileText },
  { key: 'billing', label: 'Billing', icon: Receipt },
  { key: 'history', label: 'History', icon: History },
] as const;
type TabKey = typeof TABS[number]['key'];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  // One aggregate read backs every tab — /api/me/overview is scoped server-side
  // to the signed-in client, so there is no client id to pass or to leak.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me/overview', { credentials: 'include' });
        if (res.ok) setOverview(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // The chat thread is created on demand, so a brand-new client still lands in
  // a usable conversation rather than an empty screen.
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/conversations', { credentials: 'include' });
      if (!res.ok) return;
      const data: { conversations: Conversation[] } = await res.json();
      if (data.conversations.length > 0) { setConversation(data.conversations[0]); return; }

      const created = await fetch('/api/conversations', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'General Inquiry' }),
      });
      if (created.ok) setConversation((await created.json()).conversation);
    })();
  }, []);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const activeProjects = overview?.projects.filter(
    (p) => !['completed', 'cancelled'].includes(p.status)
  ) ?? [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 sm:py-12">
      <SEO
        title="Client Dashboard"
        description="Your AiTechWorlds client dashboard — track projects, chat with our team, and view invoices."
        path="/dashboard"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {user?.picture && <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />}
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === key
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-primary-600" size={28} />
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Tile label="Active projects" value={String(activeProjects.length)} />
                  <Tile label="Total paid" value={money(overview?.totals.paid ?? 0)} tone="text-green-600 dark:text-green-400" />
                  <Tile
                    label="Outstanding"
                    value={money(overview?.totals.outstanding ?? 0)}
                    tone={(overview?.totals.outstanding ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
                  />
                </div>

                {activeProjects.length > 0 ? (
                  <Section title="In progress">
                    <div className="space-y-4">
                      {activeProjects.map((p) => (
                        <div key={p.id}>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">{p.title}</span>
                            <Badge tone={STATUS_TONE[p.status] ?? 'gray'}>{formatStatus(p.status)}</Badge>
                          </div>
                          <ProgressBar value={p.progress} />
                          <p className="mt-1 text-xs text-neutral-400">{p.progress}% complete</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                ) : (
                  <Section title="In progress">
                    <Muted>No active projects right now. Start a conversation and we'll scope your next one.</Muted>
                  </Section>
                )}
              </div>
            )}

            {tab === 'projects' && (
              <div className="space-y-4">
                {overview?.projects.length ? overview.projects.map((p) => (
                  <Section key={p.id} title={p.title} badge={<Badge tone={STATUS_TONE[p.status] ?? 'gray'}>{formatStatus(p.status)}</Badge>}>
                    {p.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 whitespace-pre-wrap">{p.description}</p>
                    )}
                    <ProgressBar value={p.progress} />
                    <p className="mt-1 mb-3 text-xs text-neutral-400">
                      {p.progress}% complete{p.target_date ? ` · target ${formatDate(p.target_date)}` : ''}
                    </p>

                    {p.milestones && p.milestones.length > 0 && (
                      <ul className="space-y-1.5 mb-3">
                        {p.milestones.map((m) => (
                          <li key={m.id} className="flex items-center gap-2 text-sm">
                            {m.status === 'done'
                              ? <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                              : m.status === 'doing'
                                ? <CircleDot size={15} className="text-primary-500 shrink-0" />
                                : <Circle size={15} className="text-neutral-300 dark:text-neutral-600 shrink-0" />}
                            <span className={m.status === 'done'
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-700 dark:text-neutral-200'}>
                              {m.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs">
                      {p.live_url && <LinkOut href={p.live_url} icon={<ExternalLink size={12} />}>Live site</LinkOut>}
                      {p.repo_url && <LinkOut href={p.repo_url} icon={<Github size={12} />}>Repository</LinkOut>}
                      {p.deliverable_url && <LinkOut href={p.deliverable_url} icon={<FileText size={12} />}>Deliverables</LinkOut>}
                    </div>
                    {p.delivery_note && (
                      <p className="mt-2 text-xs text-neutral-400 italic">{p.delivery_note}</p>
                    )}
                  </Section>
                )) : <Section title="Projects"><Muted>No projects yet.</Muted></Section>}
              </div>
            )}

            {tab === 'chat' && (
              conversation
                ? <ChatPanel conversationId={conversation.id} allowFileUpload />
                : <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary-600" size={24} /></div>
            )}

            {tab === 'files' && (
              <Section title="Shared files">
                {overview?.files.length ? (
                  <ul className="space-y-2">
                    {overview.files.map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-3 text-sm">
                        <a
                          href={f.drive_view_url ?? f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline truncate"
                        >
                          <FileText size={14} className="shrink-0" /> {f.file_name}
                        </a>
                        <span className="text-xs text-neutral-400 shrink-0">{formatDate(f.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                ) : <Muted>No files shared yet.</Muted>}
                {/* Large builds are handed over on WhatsApp, not hosted here. */}
                <p className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                  Small attachments can be shared in chat. For large files, we exchange them over{' '}
                  <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                    WhatsApp
                  </a>.
                </p>
              </Section>
            )}

            {tab === 'billing' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Tile label="Billed" value={money(overview?.totals.billed ?? 0)} />
                  <Tile label="Paid" value={money(overview?.totals.paid ?? 0)} tone="text-green-600 dark:text-green-400" />
                  <Tile
                    label="Outstanding"
                    value={money(overview?.totals.outstanding ?? 0)}
                    tone={(overview?.totals.outstanding ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
                  />
                </div>

                <Section title="Invoices">
                  {overview?.invoices.length ? (
                    <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {overview.invoices.map((inv) => (
                        <li key={inv.id} className="flex items-center justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{inv.number}</p>
                            <p className="text-xs text-neutral-400 truncate">
                              {inv.project_title ?? 'General'} · issued {formatDate(inv.issued_at)}
                              {inv.due_at ? ` · due ${formatDate(inv.due_at)}` : ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-neutral-900 dark:text-white">{money(inv.amount, inv.currency)}</p>
                            <div className="flex items-center gap-1.5 justify-end mt-0.5">
                              {invoiceBalance(inv) > 0 && (
                                <span className="text-[11px] text-amber-600 dark:text-amber-400">
                                  {money(invoiceBalance(inv), inv.currency)} due
                                </span>
                              )}
                              <Badge tone={STATUS_TONE[inv.status] ?? 'gray'}>{formatStatus(inv.status)}</Badge>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <Muted>No invoices yet.</Muted>}
                </Section>

                {overview?.payments.length ? (
                  <Section title="Payment history">
                    <ul className="space-y-2">
                      {overview.payments.map((p) => (
                        <li key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600 dark:text-neutral-300">
                            {formatDate(p.paid_at)} · {p.invoice_number} · {formatStatus(p.method)}
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {money(p.amount, p.currency)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                ) : null}
              </div>
            )}

            {tab === 'history' && (
              <Section title="Your history with us">
                {overview?.activity.length ? (
                  <ol className="space-y-3">
                    {overview.activity.map((a, i) => (
                      <li key={`${a.created_at}-${i}`} className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                        <div>
                          <p className="text-sm text-neutral-700 dark:text-neutral-200">{a.detail}</p>
                          <p className="text-xs text-neutral-400">{formatDate(a.created_at)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : <Muted>Nothing here yet — your project history will build up as we work together.</Muted>}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; badge?: React.ReactNode; children: React.ReactNode }> = ({ title, badge, children }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-5">
    <div className="flex items-center justify-between gap-2 mb-3">
      <h2 className="font-semibold text-neutral-900 dark:text-white">{title}</h2>
      {badge}
    </div>
    {children}
  </div>
);

const Tile: React.FC<{ label: string; value: string; tone?: string }> = ({ label, value, tone }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4">
    <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    <p className={`mt-1 text-xl font-bold ${tone ?? 'text-neutral-900 dark:text-white'}`}>{value}</p>
  </div>
);

const Muted: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-neutral-400">{children}</p>
);

const LinkOut: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
  >
    {icon} {children}
  </a>
);

export default Dashboard;
