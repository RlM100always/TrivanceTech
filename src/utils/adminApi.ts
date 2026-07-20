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
  billedRevenue: number;
  openTasks: number;
  activeProjects: number;
  completedProjects: number;
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
  actor_type?: 'admin' | 'client' | 'system';
  actor_email?: string | null;
  admin_email?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  detail?: string | null;
  created_at: string;
}

export const PROJECT_STATUSES = [
  'planning', 'in_progress', 'review', 'delivered', 'completed', 'on_hold', 'cancelled',
] as const;
export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  sort_order: number;
  due_date?: string | null;
  completed_at?: string | null;
}

export interface Project {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  order_id?: string | null;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  /** Derived server-side from milestones — never write this directly. */
  progress: number;
  start_date?: string | null;
  target_date?: string | null;
  delivered_at?: string | null;
  repo_url?: string | null;
  live_url?: string | null;
  deliverable_url?: string | null;
  delivery_note?: string | null;
  milestone_count?: number;
  milestone_done?: number;
  milestones?: Milestone[];
  created_at: string;
}

export const PAYMENT_METHODS = ['bkash', 'nagad', 'bank', 'wise', 'paypal', 'cash', 'other'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export interface Invoice {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  order_id?: string | null;
  project_id?: string | null;
  project_title?: string | null;
  number: string;
  amount: number;
  /** Sum of this invoice's payments, computed server-side on every read. */
  paid: number;
  currency: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'void';
  issued_at: string;
  due_at?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  client_id: string;
  client_name?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string | null;
  paid_at: string;
  recorded_by_admin_email?: string;
  note?: string | null;
}

export interface BillingTotals {
  billed: number;
  collected: number;
  outstanding: number;
}

/** Outstanding money on an invoice. Always derive it — never trust a stored due. */
export const invoiceBalance = (inv: Pick<Invoice, 'amount' | 'paid'>): number =>
  Math.round(((inv.amount ?? 0) - (inv.paid ?? 0)) * 100) / 100;

// Currency formatting lives in components/admin/ui.tsx as `money()` — use that.

export const formatStatus = (status: string): string =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
