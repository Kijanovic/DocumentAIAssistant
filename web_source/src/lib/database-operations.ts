import { D1Database } from '@cloudflare/workers-types';
import { createDocumentTable, getAllDocuments, getDocumentById, addDocument, updateDocument, deleteDocument, searchDocuments } from '@/lib/documents';
import { createQueryCacheTable, getCachedQuery, cacheQuery, clearQueryCache, removeExpiredCache } from '@/lib/cache';
import { createConfigTable, getConfig, saveConfig, initializeDefaultConfig } from '@/lib/config';

export async function initializeDatabase(db: D1Database) {
  try {
    // Create tables if they don't exist
    await createDocumentTable(db);
    await createQueryCacheTable(db);
    await createConfigTable(db);
    
    // Initialize default config
    await initializeDefaultConfig(db);
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
}

export async function getDocuments(db: D1Database) {
  try {
    const documents = await getAllDocuments(db);
    return { success: true, documents };
  } catch (error) {
    console.error('Error getting documents:', error);
    return { success: false, error };
  }
}

export async function getDocument(db: D1Database, id: string) {
  try {
    const document = await getDocumentById(db, id);
    if (!document) {
      return { success: false, error: 'Document not found' };
    }
    return { success: true, document };
  } catch (error) {
    console.error('Error getting document:', error);
    return { success: false, error };
  }
}

export async function addNewDocument(db: D1Database, document: any) {
  try {
    await addDocument(db, document);
    return { success: true, documentId: document.id };
  } catch (error) {
    console.error('Error adding document:', error);
    return { success: false, error };
  }
}

export async function updateExistingDocument(db: D1Database, document: any) {
  try {
    await updateDocument(db, document);
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    return { success: false, error };
  }
}

export async function removeDocument(db: D1Database, id: string) {
  try {
    await deleteDocument(db, id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error };
  }
}

export async function searchForDocuments(db: D1Database, query: string) {
  try {
    const documents = await searchDocuments(db, query);
    return { success: true, documents };
  } catch (error) {
    console.error('Error searching documents:', error);
    return { success: false, error };
  }
}

export async function getQueryFromCache(db: D1Database, query: string, documentIds: string[], model: string) {
  try {
    const cachedQuery = await getCachedQuery(db, query, documentIds, model);
    return { success: true, cachedQuery };
  } catch (error) {
    console.error('Error getting cached query:', error);
    return { success: false, error };
  }
}

export async function addQueryToCache(db: D1Database, id: string, query: string, documentIds: string[], model: string, response: any) {
  try {
    await cacheQuery(db, id, query, documentIds, model, response);
    return { success: true };
  } catch (error) {
    console.error('Error caching query:', error);
    return { success: false, error };
  }
}

export async function clearCache(db: D1Database) {
  try {
    await clearQueryCache(db);
    return { success: true };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error };
  }
}

export async function cleanupExpiredCache(db: D1Database, maxAgeDays: number) {
  try {
    const removedCount = await removeExpiredCache(db, maxAgeDays);
    return { success: true, removedCount };
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    return { success: false, error };
  }
}

export async function getAppConfig(db: D1Database) {
  try {
    const config = await getConfig(db);
    return { success: true, config };
  } catch (error) {
    console.error('Error getting config:', error);
    return { success: false, error };
  }
}

export async function updateAppConfig(db: D1Database, config: any) {
  try {
    await saveConfig(db, config);
    return { success: true };
  } catch (error) {
    console.error('Error updating config:', error);
    return { success: false, error };
  }
}
