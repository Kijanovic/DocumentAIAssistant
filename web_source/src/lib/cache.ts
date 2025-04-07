import { D1Database } from '@cloudflare/workers-types';

export interface QueryCache {
  id: string;
  query: string;
  documentIds: string;
  model: string;
  response: string;
  timestamp: string;
}

export async function createQueryCacheTable(db: D1Database) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS query_cache (
      id TEXT PRIMARY KEY,
      query TEXT NOT NULL,
      documentIds TEXT NOT NULL,
      model TEXT NOT NULL,
      response TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
}

export async function getCachedQuery(
  db: D1Database, 
  query: string, 
  documentIds: string[], 
  model: string
): Promise<QueryCache | null> {
  // Sort document IDs to ensure consistent caching regardless of order
  const sortedDocIds = [...documentIds].sort().join(',');
  
  const cachedQuery = await db.prepare(`
    SELECT * FROM query_cache 
    WHERE query = ? AND documentIds = ? AND model = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `)
  .bind(query, sortedDocIds, model)
  .first<QueryCache>();
  
  return cachedQuery;
}

export async function cacheQuery(
  db: D1Database,
  id: string,
  query: string,
  documentIds: string[],
  model: string,
  response: any
): Promise<void> {
  // Sort document IDs to ensure consistent caching regardless of order
  const sortedDocIds = [...documentIds].sort().join(',');
  
  await db.prepare(`
    INSERT INTO query_cache (id, query, documentIds, model, response, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  .bind(
    id,
    query,
    sortedDocIds,
    model,
    JSON.stringify(response),
    new Date().toISOString()
  )
  .run();
}

export async function clearQueryCache(db: D1Database): Promise<void> {
  await db.exec('DELETE FROM query_cache');
}

export async function removeExpiredCache(db: D1Database, maxAgeDays: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
  const cutoffTimestamp = cutoffDate.toISOString();
  
  const result = await db.prepare(`
    DELETE FROM query_cache
    WHERE timestamp < ?
  `)
  .bind(cutoffTimestamp)
  .run();
  
  return result.meta.changes || 0;
}
