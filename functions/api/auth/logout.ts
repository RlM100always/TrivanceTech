import { clearSessionCookieHeader } from '../../_lib/session';
import { json } from '../../_lib/http';

export const onRequestPost: PagesFunction = async ({ request }) => {
  const isSecure = new URL(request.url).protocol === 'https:';
  return json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookieHeader(isSecure) } });
};
