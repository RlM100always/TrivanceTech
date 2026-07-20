import type { Env } from '../../_lib/types';
import { requireAdmin, logActivity } from '../../_lib/guard';
import { json, badRequest, notFound, uuid } from '../../_lib/http';

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  source: string;
  converted_client_id: string | null;
}

/**
 * Turns a public contact/order submission into a real client + an open chat
 * thread, so an admin can go straight from the lead card to messaging them.
 *
 * The person has usually never signed in, so there is no Google subject id yet.
 * We store a `pending:` placeholder; auth/google.ts claims that row (matching on
 * email) the first time they actually sign in, which keeps this conversation and
 * every project attached to it rather than stranding them on a second account.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(request, env);
  if (gate instanceof Response) return gate;

  const body = await request.json().catch(() => ({})) as { lead_id?: string };
  if (!body.lead_id) return badRequest('lead_id is required');

  const lead = await env.DB.prepare(
    'SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL'
  ).bind(body.lead_id).first<LeadRow>();
  if (!lead) return notFound('Lead not found');

  // Reuse any client already on this email — converting twice must not fork them.
  let clientId = lead.converted_client_id;
  if (!clientId) {
    const existing = await env.DB.prepare(
      'SELECT id FROM clients WHERE email = ? AND deleted_at IS NULL'
    ).bind(lead.email).first<{ id: string }>();

    if (existing) {
      clientId = existing.id;
    } else {
      clientId = uuid();
      await env.DB.prepare(
        `INSERT INTO clients (id, google_sub, email, name, company, phone, stage, notes)
         VALUES (?, ?, ?, ?, ?, ?, 'contacted', ?)`
      ).bind(
        clientId,
        `pending:${uuid()}`,
        lead.email,
        lead.name,
        lead.company || null,
        lead.phone || null,
        `Converted from ${lead.source} form submission.`
      ).run();
    }
  }

  await env.DB.prepare(
    `UPDATE leads SET converted_client_id = ?, status = 'converted' WHERE id = ?`
  ).bind(clientId, lead.id).run();

  // Reuse the client's existing open thread rather than stacking up new ones.
  let conversation = await env.DB.prepare(
    `SELECT id FROM conversations WHERE client_id = ? AND status = 'open'
     ORDER BY last_message_at DESC LIMIT 1`
  ).bind(clientId).first<{ id: string }>();

  if (!conversation) {
    const conversationId = uuid();
    const subject = lead.subject?.trim() || (lead.source === 'order' ? 'Project Order' : 'General Inquiry');
    await env.DB.prepare(
      'INSERT INTO conversations (id, client_id, subject, assigned_admin_email) VALUES (?, ?, ?, ?)'
    ).bind(conversationId, clientId, subject, gate.email).run();

    // Seed the thread with what they actually wrote, so the admin replies in
    // context instead of to an empty box.
    await env.DB.prepare(
      `INSERT INTO messages (id, conversation_id, sender_type, sender_email, sender_name, body)
       VALUES (?, ?, 'client', ?, ?, ?)`
    ).bind(uuid(), conversationId, lead.email, lead.name, lead.message).run();

    conversation = { id: conversationId };
  }

  await logActivity(
    env, gate.email, 'lead', `Converted ${lead.source} lead from ${lead.name}`,
    clientId, { type: 'lead', id: lead.id }
  );

  return json({ client_id: clientId, conversation_id: conversation.id }, { status: 201 });
};
