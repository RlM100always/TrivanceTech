// Thin fetch wrapper for the admin panel. All admin endpoints are cookie-authed
// (HttpOnly session), so every request sends credentials. Throws on non-2xx.

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((msg as { error?: string }).error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) => request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};

// ---- Shared types (mirror the D1 schema) ----
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  source: 'contact' | 'order';
  status: 'new' | 'contacted' | 'converted' | 'closed';
  meta?: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  company?: string | null;
  phone?: string | null;
  stage: string;
  status: string;
  notes?: string | null;
  created_at: string;
  last_login_at: string;
}

export interface Task {
  id: string;
  client_id?: string | null;
  client_name?: string | null;
  title: string;
  description?: string | null;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  subject: string;
  description?: string | null;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  amount: number;
  currency: string;
  due_amount: number;
  created_at: string;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  newLeads: number;
  totalLeads: number;
  openConversations: number;
  unpaidRevenue: number;
  paidRevenue: number;
  openTasks: number;
}

export interface Conversation {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_avatar?: string | null;
  subject: string;
  status: string;
  last_message_at: string;
  unread_count?: number;
}

export interface Activity {
  id: string;
  client_id?: string | null;
  admin_email: string;
  action: string;
  detail?: string | null;
  created_at: string;
}
