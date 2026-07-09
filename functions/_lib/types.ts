export interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  SESSION_SECRET: string;
  ADMIN_EMAILS: string; // comma-separated allow-list
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  role: 'client' | 'admin';
  exp: number; // unix seconds
}
