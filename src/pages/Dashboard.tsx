import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatPanel from '../components/chat/ChatPanel';
import SEO from '../components/seo/SEO';
import { LogOut, Loader2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: string;
  subject: string;
  status: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/conversations', { credentials: 'include' });
      if (!res.ok) return setLoading(false);
      const data: { conversations: Conversation[] } = await res.json();

      if (data.conversations.length > 0) {
        setConversation(data.conversations[0]);
      } else {
        const createRes = await fetch('/api/conversations', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: 'General Inquiry' }),
        });
        if (createRes.ok) {
          const created: { conversation: Conversation } = await createRes.json();
          setConversation(created.conversation);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 sm:py-12">
      <SEO title="Client Dashboard" description="Your AiTechWorlds client dashboard — chat with our team and share project files." path="/dashboard" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {user?.picture && <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />}
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Welcome, {user?.name?.split(' ')[0]}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={18} className="text-primary-600 dark:text-primary-400" />
          <h2 className="font-semibold text-neutral-900 dark:text-white">Chat with our team</h2>
        </div>

        {loading || !conversation ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-primary-600" size={28} />
          </div>
        ) : (
          <ChatPanel conversationId={conversation.id} allowFileUpload />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
