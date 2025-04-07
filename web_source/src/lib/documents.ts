import { D1Database } from '@cloudflare/workers-types';

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  metadata: {
    title: string;
    author: string;
    creationDate?: string;
    pageCount?: number;
    wordCount?: number;
  };
  content: string;
}

export async function createDocumentTable(db: D1Database) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      fileType TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      uploadDate TEXT NOT NULL,
      metadata TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);
}

export async function getAllDocuments(db: D1Database): Promise<Document[]> {
  const { results } = await db.prepare('SELECT * FROM documents').all<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
    metadata: string;
    content: string;
  }>();
  
  return results.map(doc => ({
    ...doc,
    metadata: JSON.parse(doc.metadata)
  }));
}

export async function getDocumentById(db: D1Database, id: string): Promise<Document | null> {
  const doc = await db.prepare('SELECT * FROM documents WHERE id = ?')
    .bind(id)
    .first<{
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      uploadDate: string;
      metadata: string;
      content: string;
    }>();
  
  if (!doc) return null;
  
  return {
    ...doc,
    metadata: JSON.parse(doc.metadata)
  };
}

export async function addDocument(db: D1Database, document: Document): Promise<void> {
  await db.prepare(`
    INSERT INTO documents (id, fileName, fileType, fileSize, uploadDate, metadata, content)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  .bind(
    document.id,
    document.fileName,
    document.fileType,
    document.fileSize,
    document.uploadDate,
    JSON.stringify(document.metadata),
    document.content
  )
  .run();
}

export async function updateDocument(db: D1Database, document: Document): Promise<void> {
  await db.prepare(`
    UPDATE documents
    SET fileName = ?, fileType = ?, fileSize = ?, uploadDate = ?, metadata = ?, content = ?
    WHERE id = ?
  `)
  .bind(
    document.fileName,
    document.fileType,
    document.fileSize,
    document.uploadDate,
    JSON.stringify(document.metadata),
    document.content,
    document.id
  )
  .run();
}

export async function deleteDocument(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM documents WHERE id = ?')
    .bind(id)
    .run();
}

export async function searchDocuments(db: D1Database, query: string): Promise<Document[]> {
  // This is a simple implementation that searches in the content field
  // In a production environment, you might want to use a more sophisticated search solution
  const { results } = await db.prepare(`
    SELECT * FROM documents 
    WHERE content LIKE ? OR fileName LIKE ? OR metadata LIKE ?
  `)
  .bind(`%${query}%`, `%${query}%`, `%${query}%`)
  .all<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
    metadata: string;
    content: string;
  }>();
  
  return results.map(doc => ({
    ...doc,
    metadata: JSON.parse(doc.metadata)
  }));
}
