export interface GoogleIdentity {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
}

/**
 * Verifies a Google ID token server-side via Google's tokeninfo endpoint.
 * Simpler and more reliable in a Workers runtime than reimplementing JWKS/RS256
 * verification by hand — Google validates signature, issuer, and expiry for us.
 */
export async function verifyGoogleIdToken(idToken: string, expectedClientId: string): Promise<GoogleIdentity | null> {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) return null;

  const data = await res.json() as Record<string, string>;

  if (data.aud !== expectedClientId) return null;
  if (data.email_verified !== 'true') return null;
  if (!data.sub || !data.email) return null;

  return {
    sub: data.sub,
    email: data.email,
    email_verified: true,
    name: data.name ?? data.email,
    picture: data.picture,
  };
}
