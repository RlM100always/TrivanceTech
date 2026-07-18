import type { Env } from '../_lib/types';
import { json, badRequest, uuid } from '../_lib/http';

// Public endpoint — the footer + /blog newsletter forms POST here. Stored as a
// `lead` (source='newsletter') so it surfaces in the admin Orders & Inquiries
// panel alongside contact/order inquiries, without needing a separate table or UI.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest('A valid email is required');
  }

  const existing = await env.DB.prepare(
    `SELECT id FROM leads WHERE email = ? AND source = 'newsletter'`
  ).bind(email).first();
  if (existing) return json({ ok: true, alreadySubscribed: true });

  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO leads (id, name, email, message, source) VALUES (?, ?, ?, ?, 'newsletter')`
  ).bind(id, 'Newsletter Subscriber', email, 'Subscribed via the newsletter signup form.').run();

  const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  for (const adminEmail of adminEmails) {
    await env.DB.prepare(
      `INSERT INTO notifications (id, admin_email, type, message) VALUES (?, ?, 'new_lead', ?)`
    ).bind(uuid(), adminEmail, `New newsletter subscriber: ${email}`).run();
  }

  return json({ ok: true, id }, { status: 201 });
};
