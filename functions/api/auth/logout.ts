import { clearSessionCookieHeader } from '../../_lib/session';
import { json } from '../../_lib/http';

export const onRequestPost: PagesFunction = async () => {
  return json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookieHeader() } });
};
