import type { Env } from '../../_lib/types';
import { getSession } from '../../_lib/session';
import { json, unauthorized } from '../../_lib/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) return unauthorized('Not signed in');

  return json({ email: session.email, name: session.name, picture: session.picture, role: session.role });
};
