import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatPanel from '../components/chat/ChatPanel';
import SEO from '../components/seo/SEO';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, MessageSquare, FileText, Loader2, Search } from 'lucide-react';

interface ConversationRow {
  id: string;
  client_id: string;
  subject: string;
  status: string;
  last_message_at: string;
  client_name: string;
  client_email: string;
  client_avatar: string | null;
}

interface ClientDetail {
  client: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    company: string | null;
    phone: string | null;
    status: string;
    notes: string | null;
    created_at: string;
  };
  files: { id: string; file_name: string; drive_file_id: string; created_at: string }[];
}

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ConversationRow | null>(null);
  const [clientDetail, setClientDetail] = useState<ClientDetail | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadConversations = useCallback(async () => {
    const res = await fetch('/api/conversations', { credentials: 'include' });
    if (res.ok) {
      const data: { conversations: ConversationRow[] } = await res.json();
      setConversations(data.conversations);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!selected) { setClientDetail(null); return; }
    fetch(`/api/clients/${selected.client_id}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ClientDetail | null) => {
        setClientDetail(data);
        setNotesDraft(data?.client.notes ?? '');
      });
  }, [selected]);

  const updateClientStatus = async (status: string) => {
    if (!selected) return;
    await fetch(`/api/clients/${selected.client_id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setClientDetail((prev) => prev ? { ...prev, client: { ...prev.client, status } } : prev);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    await fetch(`/api/clients/${selected.client_id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notesDraft }),
    });
    setSavingNotes(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filtered = conversations.filter((c) =>
    c.client_name.toLowerCase().includes(search.toLowerCase()) ||
    c.client_email.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueClientCount = new Set(conversations.map((c) => c.client_id)).size;
  const openCount = conversations.filter((c) => c.status === 'open').length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <SEO title="Admin — Client Management" description="AiTechWorlds admin panel for client management and support chat." path="/admin" />

      {/* Top bar */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:inline">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <Users className="text-primary-600 dark:text-primary-400" size={20} />
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{uniqueClientCount}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Clients</p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <MessageSquare className="text-primary-600 dark:text-primary-400" size={20} />
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{openCount}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Open Conversations</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-4">
        {/* Inbox list */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[70vh]">
          <div className="p-3 border-b border-neutral-100 dark:border-neutral-700">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-neutral-400" size={20} /></div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-neutral-400 py-8">No conversations yet</p>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-neutral-50 dark:border-neutral-700/50 transition-colors ${
                    selected?.id === conv.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {conv.client_avatar ? (
                      <img src={conv.client_avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
                        {conv.client_name[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{conv.client_name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{conv.subject}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        {selected ? (
          <ChatPanel conversationId={selected.id} className="max-h-[70vh]" />
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center max-h-[70vh] min-h-[300px]">
            <p className="text-neutral-400 text-sm">Select a conversation to view messages</p>
          </div>
        )}

        {/* Client detail sidebar */}
        {clientDetail && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="text-center">
              {clientDetail.client.avatar_url && (
                <img src={clientDetail.client.avatar_url} alt="" className="w-14 h-14 rounded-full mx-auto mb-2" />
              )}
              <p className="font-semibold text-neutral-900 dark:text-white">{clientDetail.client.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{clientDetail.client.email}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Status</label>
              <select
                value={clientDetail.client.status}
                onChange={(e) => updateClientStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Internal Notes</label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                onBlur={saveNotes}
                rows={4}
                placeholder="Private notes, not visible to client..."
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
              />
              {savingNotes && <p className="text-xs text-neutral-400 mt-1">Saving…</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-1">
                <FileText size={12} /> Shared Files
              </label>
              {clientDetail.files.length === 0 ? (
                <p className="text-xs text-neutral-400 mt-1">No files shared yet</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {clientDetail.files.map((f) => (
                    <li key={f.id}>
                      <a
                        href={`https://drive.google.com/file/d/${f.drive_file_id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline truncate block"
                      >
                        {f.file_name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
