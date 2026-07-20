import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, forbidden, badRequest, notFound } from '../../_lib/http';
import { loadConversationForSession, MESSAGE_COLUMNS } from '../../_lib/chat';

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_type: 'client' | 'admin';
  sender_email: string;
  deleted_at: string | null;
}

/**
 * Loads a message and checks the caller may MUTATE it.
 * Rule: you may edit/delete your own message (same email AND same sender_type,
 * so an admin who is also a client elsewhere can't cross over). Admins may
 * additionally delete anyone's message for moderation — but never edit one,
 * since putting words in a client's mouth would be indistinguishable from theirs.
 */
async function loadOwnMessage(
  env: Env,
  messageId: string,
  session: { sub: string; role: 'client' | 'admin'; email: string },
  intent: 'edit' | 'delete'
): Promise<MessageRow | Response> {
  const message = await env.DB.prepare(
    'SELECT id, conversation_id, sender_type, sender_email, deleted_at FROM messages WHERE id = ?'
  ).bind(messageId).first<MessageRow>();
  if (!message) return notFound('Message not found');

  // Thread-level scoping first: never reveal anything about another client's thread.
  const conversation = await loadConversationForSession(env, message.conversation_id, session);
  if (!conversation) return forbidden();

  const isOwn =
    message.sender_email.toLowerCase() === session.email.toLowerCase() &&
    message.sender_type === session.role;

  if (isOwn) return message;
  if (intent === 'delete' && session.role === 'admin') return message;
  return forbidden(
    intent === 'edit' ? 'You can only edit your own messages' : 'You can only delete your own messages'
  );
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const messageId = String(params.id);
  const body = await request.json().catch(() => null) as { body?: string } | null;
  const next = body?.body?.trim();
  if (!next) return badRequest('body is required');

  const message = await loadOwnMessage(env, messageId, session, 'edit');
  if (message instanceof Response) return message;
  if (message.deleted_at) return badRequest('Cannot edit a deleted message');

  await env.DB.prepare(
    `UPDATE messages
     SET body = ?, edited_at = datetime('now'), updated_at = datetime('now')
     WHERE id = ?`
  ).bind(next, messageId).run();

  const updated = await env.DB.prepare(
    `SELECT ${MESSAGE_COLUMNS} FROM messages WHERE id = ?`
  ).bind(messageId).first();

  return json({ message: updated });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const messageId = String(params.id);
  const message = await loadOwnMessage(env, messageId, session, 'delete');
  if (message instanceof Response) return message;

  // Soft delete: the row stays so pollers can observe the change and render a
  // tombstone, but the text is cleared so it isn't recoverable from the API.
  await env.DB.prepare(
    `UPDATE messages
     SET body = '', drive_file_id = NULL, drive_file_name = NULL,
         deleted_at = datetime('now'), updated_at = datetime('now')
     WHERE id = ? AND deleted_at IS NULL`
  ).bind(messageId).run();

  const updated = await env.DB.prepare(
    `SELECT ${MESSAGE_COLUMNS} FROM messages WHERE id = ?`
  ).bind(messageId).first();

  return json({ message: updated });
};
