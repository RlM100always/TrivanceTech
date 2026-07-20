-- AiTechWorlds — migration 002: integrated client/admin operations system
-- Apply with:
--   wrangler d1 execute aitechworlds-db --local  --file=./migrations/002_integrated.sql
--   wrangler d1 execute aitechworlds-db --remote --file=./migrations/002_integrated.sql
--
-- Safe to run against an existing database. D1 has no `ADD COLUMN IF NOT EXISTS`,
-- so the ALTER statements below will error harmlessly ("duplicate column name")
-- if this migration is applied twice — that is expected, not a failure.

-- ---------------------------------------------------------------------------
-- Fix: functions/api/drive/register.ts inserts drive_file_id, but client_files
-- only had `url NOT NULL`. Client file uploads were failing outright.
-- ---------------------------------------------------------------------------
ALTER TABLE client_files ADD COLUMN drive_file_id TEXT;
ALTER TABLE client_files ADD COLUMN drive_view_url TEXT;
ALTER TABLE client_files ADD COLUMN project_id TEXT REFERENCES projects(id);
-- `url` stays NOT NULL for old rows; new Drive-backed rows store the webViewLink
-- there (built by register.ts) so every row keeps exactly one canonical link.

-- ---------------------------------------------------------------------------
-- Chat: edit + soft delete. `updated_at` is what lets pollers observe mutations
-- to rows they have already fetched (a `seq`-only cursor never would).
-- ---------------------------------------------------------------------------
ALTER TABLE messages ADD COLUMN edited_at TEXT;
ALTER TABLE messages ADD COLUMN deleted_at TEXT;
ALTER TABLE messages ADD COLUMN updated_at TEXT NOT NULL DEFAULT (datetime('now'));

CREATE INDEX IF NOT EXISTS idx_messages_updated ON messages(conversation_id, updated_at);

-- ---------------------------------------------------------------------------
-- Delivery side of the spine: projects + milestones.
-- orders = commercial agreement (money); projects = the work itself.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  order_id TEXT REFERENCES orders(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning', -- planning | in_progress | review | delivered | completed | on_hold | cancelled
  progress INTEGER NOT NULL DEFAULT 0,     -- 0-100, derived from milestones
  start_date TEXT,
  target_date TEXT,
  delivered_at TEXT,
  repo_url TEXT,
  live_url TEXT,
  deliverable_url TEXT,                    -- final hand-off link, if not sent over WhatsApp
  delivery_note TEXT,                      -- e.g. "Final build sent via WhatsApp 2026-07-20"
  deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',     -- todo | doing | done
  sort_order INTEGER NOT NULL DEFAULT 0,
  due_date TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id, created_at);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id, sort_order);

-- A chat thread may be scoped to one project; the default thread leaves this NULL.
ALTER TABLE conversations ADD COLUMN project_id TEXT REFERENCES projects(id);

-- ---------------------------------------------------------------------------
-- Money: invoices + a payment ledger. The old `invoices` table was never
-- referenced anywhere in functions/ or src/, so redefining it loses nothing.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS invoices;

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  order_id TEXT REFERENCES orders(id),
  project_id TEXT REFERENCES projects(id),
  number TEXT NOT NULL UNIQUE,             -- INV-2026-0007
  amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft',    -- draft | sent | partial | paid | void
  issued_at TEXT NOT NULL DEFAULT (datetime('now')),
  due_at TEXT,
  notes TEXT,
  deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One row per money movement. The outstanding balance is always
--   invoices.amount - COALESCE(SUM(payments.amount), 0)
-- computed at read time; there is deliberately no stored `due` column to drift.
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT NOT NULL DEFAULT 'other',    -- bkash | nagad | bank | wise | paypal | cash | other
  reference TEXT,                          -- trx id / bank ref
  paid_at TEXT NOT NULL DEFAULT (datetime('now')),
  recorded_by_admin_email TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id, paid_at);

-- NOTE: orders.due_amount is now deprecated — left in place for old rows, but no
-- longer written. Outstanding money lives in invoices/payments only.

-- ---------------------------------------------------------------------------
-- Activity log: was admin-only (admin_email NOT NULL), so client and system
-- events had nowhere to go. SQLite cannot drop NOT NULL, so rebuild the table.
-- ---------------------------------------------------------------------------
ALTER TABLE activity_log RENAME TO activity_log_old;

CREATE TABLE activity_log (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  actor_type TEXT NOT NULL DEFAULT 'admin', -- admin | client | system
  actor_email TEXT,                          -- NULL for system events
  admin_email TEXT,                          -- kept for back-compat with existing reads
  action TEXT NOT NULL,
  entity_type TEXT,                          -- project | invoice | payment | order | message | file | lead
  entity_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO activity_log (id, client_id, actor_type, actor_email, admin_email, action, detail, created_at)
  SELECT id, client_id, 'admin', admin_email, admin_email, action, detail, created_at
  FROM activity_log_old;

DROP TABLE activity_log_old;

CREATE INDEX IF NOT EXISTS idx_activity_client ON activity_log(client_id, created_at);
