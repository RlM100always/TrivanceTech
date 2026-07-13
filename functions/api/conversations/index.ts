import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, badRequest, uuid } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  if (session.role === 'admin') {
    // unread_count = messages from the client (other party) not yet read by admin.
    const { results } = await env.DB.prepare(
      `SELECT conversations.*, clients.name as client_name, clients.email as client_email, clients.avatar_url as client_avatar,
              (SELECT COUNT(*) FROM messages m
               WHERE m.conversation_id = conversations.id AND m.sender_type = 'client' AND m.read_at IS NULL) as unread_count
       FROM conversations
       JOIN clients ON clients.id = conversations.client_id
       ORDER BY conversations.last_message_at DESC`
    ).all();
    return json({ conversations: results });
  }

  const client = await env.DB.prepare('SELECT id FROM clients WHERE google_sub = ?')
    .bind(session.sub)
    .first<{ id: string }>();
  if (!client) return json({ conversations: [] });

  const { results } = await env.DB.prepare(
    `SELECT conversations.*,
            (SELECT COUNT(*) FROM messages m
             WHERE m.conversation_id = conversations.id AND m.sender_type = 'admin' AND m.read_at IS NULL) as unread_count
     FROM conversations WHERE client_id = ? ORDER BY last_message_at DESC`
  ).bind(client.id).all();

  return json({ conversations: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session || session.role !== 'client') return unauthorized('Only clients can start a conversation');

  const body = await request.json().catch(() => ({})) as { subject?: string };

  const client = await env.DB.prepare('SELECT id FROM clients WHERE google_sub = ?')
    .bind(session.sub)
    .first<{ id: string }>();
  if (!client) return badRequest('Client profile not found');

  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO conversations (id, client_id, subject) VALUES (?, ?, ?)'
  ).bind(id, client.id, body.subject?.trim() || 'General Inquiry').run();

  const conversation = await env.DB.prepare('SELECT * FROM conversations WHERE id = ?').bind(id).first();
  return json({ conversation }, { status: 201 });
};
