CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT,
  uploadDate TEXT NOT NULL,
  lastAccessed TEXT
);

CREATE TABLE IF NOT EXISTS query_cache (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  documentIds TEXT NOT NULL,
  model TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY,
  apiKey TEXT,
  defaultModel TEXT,
  autoDocumentSelection INTEGER,
  maxCacheAgeDays INTEGER,
  settings TEXT
);

-- Insert default config if not exists
INSERT OR IGNORE INTO config (id, defaultModel, autoDocumentSelection, maxCacheAgeDays, settings)
VALUES ('default', 'flash', 1, 30, '{}');
