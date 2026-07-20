import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, forbidden, badRequest, uuid } from '../../_lib/http';
import { loadConversationForSession, MESSAGE_COLUMNS } from '../../_lib/chat';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();

  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversationId');
  const since = Number(url.searchParams.get('since') ?? '0');
  // Cursor for mutations: rows whose body/read state changed after this timestamp
  // are re-sent even though their seq is already below `since`. Without it, an
  // edit or delete would never reach a client that had already fetched the row.
  const sinceTime = url.searchParams.get('sinceTime');
  if (!conversationId) return badRequest('conversationId is required');

  const conversation = await loadConversationForSession(env, conversationId, session);
  if (!conversation) return forbidden();

  // Read receipts: viewing the thread marks the OTHER party's messages as read.
  await env.DB.prepare(
    `UPDATE messages SET read_at = datetime('now')
     WHERE conversation_id = ? AND sender_type != ? AND read_at IS NULL`
  ).bind(conversationId, session.role).run();

  const { results } = await env.DB.prepare(
    `SELECT ${MESSAGE_COLUMNS}
     FROM messages
     WHERE conversation_id = ?
       AND (rowid > ? OR (? IS NOT NULL AND updated_at > ?))
       AND (? = 'admin' OR is_internal_note = 0)
     ORDER BY rowid ASC`
  ).bind(conversationId, since, sinceTime, sinceTime, session.role).all();

  // Clients reconcile by id, so re-sent (edited/deleted) rows overwrite in place.
  // `serverTime` becomes their next sinceTime cursor.
  return json({ messages: results, serverTime: new Date().toISOString().replace('T', ' ').slice(0, 19) });
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

  // When a client sends a message, notify every admin so it surfaces in the panel.
  if (session.role === 'client') {
    const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    for (const adminEmail of adminEmails) {
      await env.DB.prepare(
        `INSERT INTO notifications (id, admin_email, type, message) VALUES (?, ?, 'new_message', ?)`
      ).bind(uuid(), adminEmail, `New message from ${session.name}`).run();
    }
  }

  const message = await env.DB.prepare(
    `SELECT ${MESSAGE_COLUMNS} FROM messages WHERE id = ?`
  ).bind(id).first();

  return json({ message }, { status: 201 });
};
