import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, badRequest, uuid } from '../../_lib/http';

/**
 * The browser uploads the file directly to Google Drive (via the drive.file scope
 * access token it already holds) and then calls this endpoint just to index the
 * resulting file so it shows up in the client's file list and can be attached to chat.
 * The file content itself never passes through our backend.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session || session.role !== 'client') return unauthorized('Only clients can register files');

  const body = await request.json().catch(() => null) as {
    driveFileId?: string;
    fileName?: string;
    mimeType?: string;
  } | null;

  if (!body?.driveFileId || !body.fileName) return badRequest('driveFileId and fileName are required');

  const client = await env.DB.prepare('SELECT id FROM clients WHERE google_sub = ?')
    .bind(session.sub)
    .first<{ id: string }>();
  if (!client) return badRequest('Client profile not found');

  const id = uuid();
  await env.DB.prepare(
    'INSERT INTO client_files (id, client_id, drive_file_id, file_name, mime_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, client.id, body.driveFileId, body.fileName, body.mimeType ?? null, session.email).run();

  const file = await env.DB.prepare('SELECT * FROM client_files WHERE id = ?').bind(id).first();
  return json({ file }, { status: 201 });
};
