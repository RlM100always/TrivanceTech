import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, forbidden, notFound } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();
  if (session.role !== 'admin') return forbidden('Admins only');

  const clientId = params.id as string;

  const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  if (!client) return notFound('Client not found');

  const { results: files } = await env.DB.prepare(
    'SELECT * FROM client_files WHERE client_id = ? ORDER BY created_at DESC'
  ).bind(clientId).all();

  const { results: conversations } = await env.DB.prepare(
    'SELECT * FROM conversations WHERE client_id = ? ORDER BY last_message_at DESC'
  ).bind(clientId).all();

  return json({ client, files, conversations });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();
  if (session.role !== 'admin') return forbidden('Admins only');

  const clientId = params.id as string;
  const body = await request.json().catch(() => ({})) as { status?: string; notes?: string; company?: string; phone?: string };

  const updates: string[] = [];
  const bindings: string[] = [];
  if (body.status) { updates.push('status = ?'); bindings.push(body.status); }
  if (body.notes !== undefined) { updates.push('notes = ?'); bindings.push(body.notes); }
  if (body.company !== undefined) { updates.push('company = ?'); bindings.push(body.company); }
  if (body.phone !== undefined) { updates.push('phone = ?'); bindings.push(body.phone); }

  if (updates.length === 0) return json({ error: 'No fields to update' }, { status: 400 });

  bindings.push(clientId);
  await env.DB.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run();

  const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  return json({ client });
};
