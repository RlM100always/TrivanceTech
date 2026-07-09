-- AiTechWorlds — D1 schema
-- Apply with: wrangler d1 execute aitechworlds-db --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,               -- uuid
  google_sub TEXT UNIQUE NOT NULL,   -- Google account's stable subject id
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active | archived
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,               -- uuid
  client_id TEXT NOT NULL REFERENCES clients(id),
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  status TEXT NOT NULL DEFAULT 'open', -- open | closed
  assigned_admin_email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_message_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,               -- uuid
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  sender_type TEXT NOT NULL,         -- client | admin
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL,
  drive_file_id TEXT,                -- optional attachment reference
  drive_file_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
  -- cursor-based polling uses SQLite's built-in rowid (monotonically increasing), no extra column needed
);

CREATE TABLE IF NOT EXISTS client_files (
  id TEXT PRIMARY KEY,               -- uuid
  client_id TEXT NOT NULL REFERENCES clients(id),
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL,         -- email
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_conversations_client ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_client_files_client ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
