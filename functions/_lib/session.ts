import type { SessionPayload } from './types';

const SESSION_COOKIE = 'atw_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * A missing SESSION_SECRET reaches WebCrypto as a zero-length key and surfaces as
 * "Imported HMAC key length (0) must be a non-zero value..." — which reads like a
 * crypto bug rather than a missing binding, and cost several misdirected fixes.
 * Fail loudly at the boundary instead.
 */
function assertSecret(secret: string | undefined): string {
  if (!secret) {
    throw new Error(
      'SESSION_SECRET is not set. Sessions cannot be signed. ' +
        'Set it on Cloudflare (`wrangler pages secret put SESSION_SECRET`, or Pages > ' +
        'Settings > Environment variables as type "Secret"), then redeploy. ' +
        'Locally it comes from .dev.vars.'
    );
  }
  return secret;
}

async function hmacKey(rawSecret: string): Promise<CryptoKey> {
  const secret = assertSecret(rawSecret);
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(payload: Omit<SessionPayload, 'exp'>, secret: string): Promise<string> {
  const full: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(full)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<SessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(sigB64), new TextEncoder().encode(payloadB64));
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieHeader(token: string, isSecure: boolean = true): string {
  const secureFlag = isSecure ? 'Secure; ' : '';
  return `${SESSION_COOKIE}=${token}; HttpOnly; ${secureFlag}SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookieHeader(isSecure: boolean = true): string {
  const secureFlag = isSecure ? 'Secure; ' : '';
  return `${SESSION_COOKIE}=; HttpOnly; ${secureFlag}SameSite=Lax; Path=/; Max-Age=0`;
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export async function getSession(request: Request, secret: string): Promise<SessionPayload | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  return verifySessionToken(token, secret);
}
