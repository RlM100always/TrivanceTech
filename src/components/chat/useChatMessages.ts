import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, MessagesResponse } from './types';

export const POLL_INTERVAL_MS = 3500;
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // stop polling after 10 minutes of no activity

/**
 * Polling chat state shared by the client portal and the admin panel.
 *
 * Reconciliation is by message id, not by appending: the server re-sends any row
 * whose `updated_at` moved past our cursor, so edits, deletes and read receipts
 * overwrite the copy we already hold. Appending (the old behaviour) could only
 * ever show new messages and would silently miss every mutation.
 */
export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastSeqRef = useRef(0);
  const sinceTimeRef = useRef<string | null>(null);
  const lastActivityRef = useRef(Date.now());

  const markActive = useCallback(() => { lastActivityRef.current = Date.now(); }, []);

  const upsert = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) byId.set(m.id, m);
      return [...byId.values()].sort((a, b) => a.seq - b.seq);
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    const params = new URLSearchParams({
      conversationId,
      since: String(lastSeqRef.current),
    });
    if (sinceTimeRef.current) params.set('sinceTime', sinceTimeRef.current);

    const res = await fetch(`/api/messages?${params}`, { credentials: 'include' });
    if (!res.ok) return;
    const data: MessagesResponse = await res.json();

    sinceTimeRef.current = data.serverTime;
    for (const m of data.messages) lastSeqRef.current = Math.max(lastSeqRef.current, m.seq);
    upsert(data.messages);
  }, [conversationId, upsert]);

  // Reset cursors whenever the thread changes, or we'd carry another thread's seq.
  useEffect(() => {
    lastSeqRef.current = 0;
    sinceTimeRef.current = null;
    setMessages([]);
    refresh();
  }, [conversationId, refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) return;
      refresh();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const editMessage = useCallback(async (id: string, body: string) => {
    markActive();
    const res = await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Could not edit message' }));
      alert((err as { error?: string }).error ?? 'Could not edit message');
      return;
    }
    const data: { message: ChatMessage } = await res.json();
    upsert([data.message]);
  }, [markActive, upsert]);

  const deleteMessage = useCallback(async (id: string) => {
    markActive();
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Could not delete message' }));
      alert((err as { error?: string }).error ?? 'Could not delete message');
      return;
    }
    const data: { message: ChatMessage } = await res.json();
    upsert([data.message]);
  }, [markActive, upsert]);

  return { messages, upsert, refresh, editMessage, deleteMessage, markActive, lastSeqRef };
}
