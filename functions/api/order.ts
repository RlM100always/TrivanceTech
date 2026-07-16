import type { Env } from '../_lib/types';
import { uuid } from '../_lib/http';
import { verifyTurnstileToken } from '../_lib/turnstile';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyOsTHVz9_mG0W9mPAKMjhjP92ypAtyQfj6qXmF_VKZRN5QSYvmo60LdYvmOh-lrNOotw/exec';

// Public endpoint — the marketing Order form POSTs here. A project order is stored
// as a `lead` (source='order') in D1 so admins can triage/filter it, exactly like a
// contact inquiry. The legacy Google Apps Script forward (email/Sheet) is kept but
// best-effort: it must never fail the request or block the admin panel.
export const onRequestPost: PagesFunction<Env & { ORDER_FORM_SECRET?: string }> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as {
    fullName?: string;
    email?: string;
    phone?: string;
    institution?: string;
    projectType?: string;
    deadline?: string;
    description?: string;
    fileUrl?: string;
    budget?: string;
    turnstileToken?: string;
  } | null;

  const name = body?.fullName?.trim();
  const email = body?.email?.trim();
  const description = body?.description?.trim();

  if (!name || !email || !description) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Full name, email and project description are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const verified = await verifyTurnstileToken(
    body?.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP')
  );
  if (!verified) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Verification failed — please try again.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const id = uuid();
  const meta: Record<string, string> = {};
  if (body?.projectType) meta.projectType = body.projectType;
  if (body?.deadline) meta.deadline = body.deadline;
  if (body?.budget) meta.budget = body.budget;
  if (body?.fileUrl) meta.fileUrl = body.fileUrl;

  const subject = body?.projectType
    ? `Project order: ${body.projectType}`
    : 'Project order';

  try {
    await env.DB.prepare(
      `INSERT INTO leads (id, name, email, phone, company, subject, message, source, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'order', ?)`
    ).bind(
      id,
      name,
      email,
      body?.phone?.trim() || null,
      body?.institution?.trim() || null,
      subject,
      description,
      Object.keys(meta).length ? JSON.stringify(meta) : null
    ).run();

    // Fan a notification to every admin so it surfaces in the panel.
    const adminEmails = (env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    for (const adminEmail of adminEmails) {
      await env.DB.prepare(
        `INSERT INTO notifications (id, admin_email, type, message) VALUES (?, ?, 'new_lead', ?)`
      ).bind(uuid(), adminEmail, `New project order from ${name}`).run();
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: err instanceof Error ? err.message : 'Could not save your order.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Best-effort forward to the legacy Apps Script (email/Sheet). Never blocks success.
  if (env.ORDER_FORM_SECRET) {
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: env.ORDER_FORM_SECRET, ...(body as object) }),
      });
    } catch { /* ignore — the order is already safely in D1 */ }
  }

  return new Response(
    JSON.stringify({ status: 'success', id }),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
};
