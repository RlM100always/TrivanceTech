import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { api, Conversation } from '../../utils/adminApi';
import { Card, PageHeader, Spinner, EmptyState, formatDate } from '../../components/admin/ui';
import MessageBubble from '../../components/chat/MessageBubble';
import { useChatMessages } from '../../components/chat/useChatMessages';
import type { ChatMessage } from '../../components/chat/types';

const AdminMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [active, setActive] = useState<Conversation | null>(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const loadConversations = useCallback(() => {
    api.get<{ conversations: Conversation[] }>('/api/conversations')
      .then((d) => setConversations(d.conversations))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 8000); // keep unread counts fresh
    return () => clearInterval(t);
  }, [loadConversations]);

  // Deep link from "Convert & chat" on a lead card: /admin/messages?c=<id>.
  // Only auto-opens once, so it doesn't yank the admin back after they browse away.
  useEffect(() => {
    if (!conversations || active) return;
    const target = searchParams.get('c');
    if (!target) return;
    const match = conversations.find((c) => c.id === target);
    if (match) openConversation(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, searchParams]);

  const openConversation = (c: Conversation) => {
    setActive(c);
    // Optimistically clear the unread badge; the admin's GET marks them read.
    setConversations((prev) => prev?.map((x) => (x.id === c.id ? { ...x, unread_count: 0 } : x)) ?? null);
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Messages" subtitle="Live chat with every client." />
      {!conversations ? <Spinner /> : (
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[400px]">
            {/* Conversation list */}
            <div className={`border-r border-gray-100 dark:border-gray-800 overflow-y-auto ${active ? 'hidden md:block' : ''}`}>
              {conversations.length === 0 ? (
                <EmptyState icon={<MessageSquare size={36} />} title="No conversations" />
              ) : conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openConversation(c)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${active?.id === c.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {c.client_avatar
                      ? <img src={c.client_avatar} alt="" className="w-9 h-9 rounded-full" />
                      : <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-sm font-semibold">{(c.client_name ?? '?').charAt(0)}</div>}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm truncate ${c.unread_count ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-900 dark:text-white'}`}>{c.client_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-gray-400">{formatDate(c.last_message_at)}</span>
                      {!!c.unread_count && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 text-white text-[10px] font-semibold flex items-center justify-center">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Thread */}
            <div className={`flex flex-col ${active ? '' : 'hidden md:flex'}`}>
              {active ? <Thread conversation={active} onBack={() => setActive(null)} /> : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation</div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const Thread: React.FC<{ conversation: Conversation; onBack: () => void }> = ({ conversation, onBack }) => {
  // Shared with the client portal: polls with both a seq and an updated_at cursor
  // and reconciles by id, so edits, deletes and read receipts all land in place.
  const {
    messages, upsert, refresh, editMessage, deleteMessage, markActive,
  } = useChatMessages(conversation.id);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    markActive();
    try {
      const { message } = await api.post<{ message: ChatMessage }>(
        '/api/messages', { conversationId: conversation.id, body }
      );
      setBody('');
      upsert([message]);
      await refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <button onClick={onBack} className="md:hidden p-1"><ArrowLeft size={18} /></button>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{conversation.client_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.subject}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/40">
        {messages.map((m) => {
          const mine = m.sender_type === 'admin';
          return (
            <MessageBubble
              key={m.id}
              message={m}
              mine={mine}
              canModerate
              onEdit={editMessage}
              onDelete={deleteMessage}
              footer={
                <div className={`flex items-center gap-1 text-[10px] mt-1 ${mine ? 'text-primary-100 justify-end' : 'text-gray-400'}`}>
                  <span>{m.sender_name}</span>
                  {mine && (m.read_at ? <CheckCheck size={13} className="text-sky-200" /> : <Check size={13} />)}
                </div>
              }
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onFocus={markActive}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a reply…"
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button onClick={send} disabled={sending || !body.trim()} className="px-4 rounded-xl bg-primary-600 text-white disabled:opacity-50 flex items-center justify-center">
          <Send size={18} />
        </button>
      </div>
    </>
  );
};

export default AdminMessages;
