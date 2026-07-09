import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized, forbidden } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized();
  if (session.role !== 'admin') return forbidden('Admins only');

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  let query = 'SELECT * FROM clients';
  const conditions: string[] = [];
  const bindings: string[] = [];

  if (status) {
    conditions.push('status = ?');
    bindings.push(status);
  }
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR company LIKE ?)');
    const like = `%${search}%`;
    bindings.push(like, like, like);
  }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY last_login_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ clients: results });
};
