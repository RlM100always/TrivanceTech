import type { Env } from '../../_lib/types';
import { requireAdmin } from '../../_lib/guard';
import { json } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  const search = url.searchParams.get('search');

  let query = 'SELECT * FROM leads';
  const conditions: string[] = ['deleted_at IS NULL'];
  const bindings: string[] = [];

  if (status && status !== 'all') { conditions.push('status = ?'); bindings.push(status); }
  if (source && source !== 'all') { conditions.push('source = ?'); bindings.push(source); }
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
    const like = `%${search}%`;
    bindings.push(like, like, like, like);
  }
  query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ leads: results });
};
