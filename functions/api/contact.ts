import type { Env } from '../_lib/types';
import { json, badRequest, unauthorized, uuid } from '../_lib/http';
import { verifyTurnstileToken } from '../_lib/turnstile';

// Public endpoint — the marketing Contact form POSTs here. No auth: anyone can
// submit an inquiry. Stored as a `lead` so admins can triage/filter it.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
    source?: string;
    meta?: Record<string, unknown>;
    turnstileToken?: string;
  } | null;

  if (!body?.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return badRequest('name, email and message are required');
  }

  const verified = await verifyTurnstileToken(
    body.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP')
  );
  if (!verified) return unauthorized('Verification failed — please try again.');

  const id = uuid();
  const source = body.source === 'order' ? 'order' : 'contact';

  await env.DB.prepare(
    `INSERT INTO leads (id, name, email, phone, company, subject, message, source, meta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.name.trim(),
    body.email.trim(),
    body.phone?.trim() || null,
    body.company?.trim() || null,
    body.subject?.trim() || null,
    body.message.trim(),
    source,
    body.meta ? JSON.stringify(body.meta) : null
  ).run();

  // Fan a notification to every admin so it surfaces in the panel.
  const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  for (const email of adminEmails) {
    await env.DB.prepare(
      `INSERT INTO notifications (id, admin_email, type, message) VALUES (?, ?, 'new_lead', ?)`
    ).bind(uuid(), email, `New ${source} inquiry from ${body.name.trim()}`).run();
  }

  return json({ ok: true, id }, { status: 201 });
};
