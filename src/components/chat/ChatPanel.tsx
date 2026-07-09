import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadFileToDrive } from '../../lib/driveUpload';

export interface ChatMessage {
  seq: number;
  id: string;
  conversation_id: string;
  sender_type: 'client' | 'admin';
  sender_email: string;
  sender_name: string;
  body: string;
  drive_file_id: string | null;
  drive_file_name: string | null;
  created_at: string;
}

const POLL_INTERVAL_MS = 3500;
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // stop polling after 10 minutes of no activity

interface ChatPanelProps {
  conversationId: string;
  allowFileUpload?: boolean;
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ conversationId, allowFileUpload = false, className }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const lastSeqRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchNewMessages = useCallback(async () => {
    const res = await fetch(`/api/messages?conversationId=${conversationId}&since=${lastSeqRef.current}`, {
      credentials: 'include',
    });
    if (!res.ok) return;
    const data: { messages: ChatMessage[] } = await res.json();
    if (data.messages.length === 0) return;

    lastSeqRef.current = data.messages[data.messages.length - 1].seq;
    setMessages((prev) => [...prev, ...data.messages]);
  }, [conversationId]);

  useEffect(() => {
    lastSeqRef.current = 0;
    setMessages([]);
    fetchNewMessages();
  }, [conversationId, fetchNewMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) return;
      fetchNewMessages();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNewMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (body: string, driveFileId?: string, driveFileName?: string) => {
    if (!body.trim()) return;
    setSending(true);
    lastActivityRef.current = Date.now();
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, body, driveFileId, driveFileName }),
      });
      if (res.ok) {
        const data: { message: ChatMessage } = await res.json();
        lastSeqRef.current = Math.max(lastSeqRef.current, data.message.seq);
        setMessages((prev) => [...prev, data.message]);
        setDraft('');
      }
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    lastActivityRef.current = Date.now();
    try {
      const uploaded = await uploadFileToDrive(file);
      await fetch('/api/drive/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveFileId: uploaded.id, fileName: uploaded.name, mimeType: uploaded.mimeType }),
      });
      await sendMessage(`Shared a file: ${uploaded.name}`, uploaded.id, uploaded.name);
    } catch {
      // best-effort — surfaced via disabled state, no destructive error UI needed for MVP
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className ?? ''}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[320px] max-h-[520px]">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            No messages yet — say hello!
          </p>
        )}
        {messages.map((msg) => {
          const mine = msg.sender_email === user?.email;
          return (
            <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                mine
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
              }`}>
                {!mine && <p className="text-xs font-semibold opacity-70 mb-0.5">{msg.sender_name}</p>}
                <p className="text-sm leading-relaxed break-words">{msg.body}</p>
                {msg.drive_file_id && (
                  <a
                    href={`https://drive.google.com/file/d/${msg.drive_file_id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-1.5 flex items-center gap-1.5 text-xs underline ${mine ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'}`}
                  >
                    <FileText size={13} />
                    {msg.drive_file_name}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(draft); }}
        className="flex items-center gap-2 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700"
      >
        {allowFileUpload && (
          <label className="cursor-pointer p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
          </label>
        )}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => { lastActivityRef.current = Date.now(); }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-full transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
