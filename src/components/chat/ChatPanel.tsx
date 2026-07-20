import { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadFileToDrive } from '../../lib/driveUpload';
import MessageBubble from './MessageBubble';
import { useChatMessages } from './useChatMessages';
import type { ChatMessage } from './types';

export type { ChatMessage } from './types';

interface ChatPanelProps {
  conversationId: string;
  allowFileUpload?: boolean;
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ conversationId, allowFileUpload = false, className }) => {
  const { user } = useAuth();
  const {
    messages, upsert, editMessage, deleteMessage, markActive, lastSeqRef,
  } = useChatMessages(conversationId);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (body: string, driveFileId?: string, driveFileName?: string) => {
    if (!body.trim()) return;
    setSending(true);
    markActive();
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
        upsert([data.message]);
        setDraft('');
      }
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    markActive();
    try {
      const uploaded = await uploadFileToDrive(file);
      await fetch('/api/drive/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driveFileId: uploaded.id,
          fileName: uploaded.name,
          mimeType: uploaded.mimeType,
          webViewLink: uploaded.webViewLink,
        }),
      });
      await sendMessage(`Shared a file: ${uploaded.name}`, uploaded.id, uploaded.name);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'File upload failed. Please try again.');
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
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            mine={msg.sender_email === user?.email}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
        ))}
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
          onFocus={markActive}
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
