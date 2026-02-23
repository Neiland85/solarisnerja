CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_email_event_unique
ON leads (email, event_id);
