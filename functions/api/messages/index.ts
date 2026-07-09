import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, forbidden, badRequest, uuid } from '../../_lib/http';

interface ConversationRow {
  id: string;
  client_id: string;
  client_google_sub: string;
}

async function loadConversationForSession(
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversationId');
  const since = Number(url.searchParams.get('since') ?? '0');
  if (!conversationId) return badRequest('conversationId is required');

  const conversation = await loadConversationForSession(env, conversationId, session);
  if (!conversation) return forbidden();

  const { results } = await env.DB.prepare(
    `SELECT rowid as seq, id, conversation_id, sender_type, sender_email, sender_name, body,
            drive_file_id, drive_file_name, created_at
     FROM messages
     WHERE conversation_id = ? AND rowid > ?
     ORDER BY rowid ASC`
  ).bind(conversationId, since).all();

  return json({ messages: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const body = await request.json().catch(() => null) as {
    conversationId?: string;
    body?: string;
    driveFileId?: string;
    driveFileName?: string;
  } | null;

  if (!body?.conversationId || !body.body?.trim()) return badRequest('conversationId and body are required');

  const conversation = await loadConversationForSession(env, body.conversationId, session);
  if (!conversation) return forbidden();

  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO messages (id, conversation_id, sender_type, sender_email, sender_name, body, drive_file_id, drive_file_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.conversationId,
    session.role,
    session.email,
    session.name,
    body.body.trim(),
    body.driveFileId ?? null,
    body.driveFileName ?? null
  ).run();

  await env.DB.prepare(
    'UPDATE conversations SET last_message_at = datetime(\'now\') WHERE id = ?'
  ).bind(body.conversationId).run();

  const message = await env.DB.prepare(
    'SELECT rowid as seq, * FROM messages WHERE id = ?'
  ).bind(id).first();

  return json({ message }, { status: 201 });
};
