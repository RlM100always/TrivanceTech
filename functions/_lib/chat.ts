import type { Env } from './types';

export interface ConversationRow {
  id: string;
  client_id: string;
  client_google_sub: string;
}

/**
 * Loads a conversation only if the given session is allowed to see it.
 * Admins may access any thread; a client may only access their own
 * (matched on the Google subject id carried in the session).
 * Returns null when the thread doesn't exist OR access is denied — callers
 * treat both as 403 so the endpoint never leaks which conversations exist.
 */
export async function loadConversationForSession(
  env: Env,
  conversationId: string,
  session: { sub: string; role: 'client' | 'admin' }
): Promise<ConversationRow | null> {
  const row = await env.DB.prepare(
    `SELECT conversations.id, conversations.client_id, clients.google_sub as client_google_sub
     FROM conversations JOIN clients ON clients.id = conversations.client_id
     WHERE conversations.id = ?`
  ).bind(conversationId).first<ConversationRow>();

  if (!row) return null;
  if (session.role === 'admin') return row;
  if (row.client_google_sub === session.sub) return row;
  return null;
}

// Columns every message read should return, so the two chat panels always see
// the same shape (including the edit/delete state they reconcile on).
export const MESSAGE_COLUMNS = `rowid as seq, id, conversation_id, sender_type, sender_email,
  sender_name, body, drive_file_id, drive_file_name, read_at,
  edited_at, deleted_at, updated_at, created_at`;
