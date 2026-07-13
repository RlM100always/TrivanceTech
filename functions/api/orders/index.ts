import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, uuid } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  let query =
    `SELECT orders.*, clients.name as client_name, clients.email as client_email
     FROM orders JOIN clients ON clients.id = orders.client_id`;
  const bindings: string[] = [];
  if (status && status !== 'all') { query += ' WHERE orders.status = ?'; bindings.push(status); }
  query += ' ORDER BY orders.created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json({ orders: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as {
    client_id?: string;
    subject?: string;
    description?: string;
    amount?: number;
    currency?: string;
  };
  if (!body.client_id || !body.subject?.trim()) return badRequest('client_id and subject are required');

  const amount = Number(body.amount) || 0;
  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO orders (id, client_id, subject, description, amount, currency, due_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.client_id,
    body.subject.trim(),
    body.description?.trim() || null,
    amount,
    body.currency?.trim() || 'USD',
    amount
  ).run();

  await logActivity(env, gate.email, 'order', `Created order: ${body.subject.trim()}`, body.client_id);

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  return json({ order }, { status: 201 });
};
