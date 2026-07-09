export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
}

export function unauthorized(message = 'Unauthorized'): Response {
  return json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): Response {
  return json({ error: message }, { status: 403 });
}

export function badRequest(message = 'Bad request'): Response {
  return json({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found'): Response {
  return json({ error: message }, { status: 404 });
}

export function uuid(): string {
  return crypto.randomUUID();
}
