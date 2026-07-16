/**
 * Verifies a Cloudflare Turnstile token server-side. Used to keep the public
 * contact/order forms from being an open spam target — no CAPTCHA UI to build,
 * Turnstile handles that, we just verify the resulting token here.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  secret: string | undefined,
  ip: string | null
): Promise<boolean> {
  if (!secret) return true; // not configured — don't block submissions in dev
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) return false;

  const data = await res.json() as { success: boolean };
  return data.success === true;
}
