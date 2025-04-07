import { D1Database } from '@cloudflare/workers-types';

export interface Config {
  id: string;
  apiKey: string;
  defaultModel: string;
  cacheEnabled: boolean;
  maxCacheAgeDays: number;
  autoDocumentSelection: boolean;
  maxDocumentsToSelect: number;
  uiTheme: string;
}

export async function createConfigTable(db: D1Database) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      id TEXT PRIMARY KEY,
      apiKey TEXT NOT NULL,
      defaultModel TEXT NOT NULL,
      cacheEnabled INTEGER NOT NULL,
      maxCacheAgeDays INTEGER NOT NULL,
      autoDocumentSelection INTEGER NOT NULL,
      maxDocumentsToSelect INTEGER NOT NULL,
      uiTheme TEXT NOT NULL
    )
  `);
}

export async function getConfig(db: D1Database, id: string = 'default'): Promise<Config | null> {
  const config = await db.prepare('SELECT * FROM config WHERE id = ?')
    .bind(id)
    .first<Config>();
  
  return config;
}

export async function saveConfig(db: D1Database, config: Config): Promise<void> {
  // Check if config exists
  const existingConfig = await getConfig(db, config.id);
  
  if (existingConfig) {
    // Update existing config
    await db.prepare(`
      UPDATE config
      SET apiKey = ?, defaultModel = ?, cacheEnabled = ?, maxCacheAgeDays = ?, 
          autoDocumentSelection = ?, maxDocumentsToSelect = ?, uiTheme = ?
      WHERE id = ?
    `)
    .bind(
      config.apiKey,
      config.defaultModel,
      config.cacheEnabled ? 1 : 0,
      config.maxCacheAgeDays,
      config.autoDocumentSelection ? 1 : 0,
      config.maxDocumentsToSelect,
      config.uiTheme,
      config.id
    )
    .run();
  } else {
    // Insert new config
    await db.prepare(`
      INSERT INTO config (id, apiKey, defaultModel, cacheEnabled, maxCacheAgeDays, 
                         autoDocumentSelection, maxDocumentsToSelect, uiTheme)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      config.id,
      config.apiKey,
      config.defaultModel,
      config.cacheEnabled ? 1 : 0,
      config.maxCacheAgeDays,
      config.autoDocumentSelection ? 1 : 0,
      config.maxDocumentsToSelect,
      config.uiTheme
    )
    .run();
  }
}

export async function initializeDefaultConfig(db: D1Database): Promise<void> {
  const existingConfig = await getConfig(db);
  
  if (!existingConfig) {
    await saveConfig(db, {
      id: 'default',
      apiKey: '',
      defaultModel: 'flash',
      cacheEnabled: true,
      maxCacheAgeDays: 30,
      autoDocumentSelection: true,
      maxDocumentsToSelect: 5,
      uiTheme: 'light'
    });
  }
}
