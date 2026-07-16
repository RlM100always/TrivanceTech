-- AiTechWorlds — D1 schema
-- Apply with: wrangler d1 execute aitechworlds-db --remote --file=./schema.sql
-- For an existing DB, also run the ALTER statements noted at the bottom.

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,               -- uuid
  google_sub TEXT UNIQUE NOT NULL,   -- Google account's stable subject id
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  timezone TEXT,
  tags TEXT,                         -- comma-separated labels (Lead, VIP, ...)
  stage TEXT NOT NULL DEFAULT 'new', -- new | contacted | proposal | active | completed | archived
  status TEXT NOT NULL DEFAULT 'active', -- active | archived (account state)
  assigned_admin_email TEXT,
  notes TEXT,
  deleted_at TEXT,                   -- soft-delete: NULL = active row
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  status TEXT NOT NULL DEFAULT 'open', -- open | closed
  assigned_admin_email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_message_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  sender_type TEXT NOT NULL,         -- client | admin
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL,
  drive_file_id TEXT,                 -- Google Drive file id, if this message shares a file
  drive_file_name TEXT,              -- display name for the shared file
  is_internal_note INTEGER NOT NULL DEFAULT 0, -- 1 = admin-only note (not visible to client)
  read_at TEXT,                      -- set when the other party reads it
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS client_files (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  url TEXT NOT NULL,                 -- shareable link (Drive / CDN)
  file_name TEXT NOT NULL,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL,         -- email
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo', -- todo | doing | done
  priority TEXT NOT NULL DEFAULT 'medium', -- low | medium | high
  due_date TEXT,
  assigned_admin_email TEXT,
  deleted_at TEXT,                   -- soft-delete: NULL = active row
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | paid | cancelled
  amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  due_amount REAL NOT NULL DEFAULT 0,
  deleted_at TEXT,                   -- soft-delete: NULL = active row
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  number TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid | paid
  issued_at TEXT NOT NULL DEFAULT (datetime('now')),
  due_at TEXT
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,             -- created | updated | note | stage | file | task | order | login
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS message_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  admin_email TEXT NOT NULL,
  type TEXT NOT NULL,               -- new_message | new_client | task_due
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Public contact/order-inquiry submissions (submitters are NOT logged in, so
-- these are separate from `clients`). Admin triages them in the panel.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact',  -- contact | order
  status TEXT NOT NULL DEFAULT 'new',       -- new | contacted | converted | closed
  meta TEXT,                                 -- JSON blob for order extras (budget, deadline, projectType, fileUrl)
  converted_client_id TEXT REFERENCES clients(id), -- set when a client signs in with this lead's email
  deleted_at TEXT,                   -- soft-delete: NULL = active row
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Audit trail for every sign-in (admin and client) — who signed in, when, from where.
CREATE TABLE IF NOT EXISTS login_events (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,                -- admin | client
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status, created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_client ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_client_files_client ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_tasks_client ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_activity_client ON activity_log(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin ON notifications(admin_email, read);
CREATE INDEX IF NOT EXISTS idx_login_events_email ON login_events(email, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_converted_client ON leads(converted_client_id);

-- Migration for an EXISTING database (run after the first apply):
-- ALTER TABLE clients ADD COLUMN timezone TEXT;
-- ALTER TABLE clients ADD COLUMN tags TEXT;
-- ALTER TABLE clients ADD COLUMN stage TEXT NOT NULL DEFAULT 'new';
-- ALTER TABLE clients ADD COLUMN assigned_admin_email TEXT;
-- ALTER TABLE messages ADD COLUMN is_internal_note INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE messages ADD COLUMN read_at TEXT;
-- ALTER TABLE messages ADD COLUMN drive_file_id TEXT;
-- ALTER TABLE messages ADD COLUMN drive_file_name TEXT;
-- ALTER TABLE clients ADD COLUMN deleted_at TEXT;
-- ALTER TABLE tasks ADD COLUMN deleted_at TEXT;
-- ALTER TABLE orders ADD COLUMN deleted_at TEXT;
-- ALTER TABLE leads ADD COLUMN deleted_at TEXT;
-- ALTER TABLE leads ADD COLUMN converted_client_id TEXT REFERENCES clients(id);
