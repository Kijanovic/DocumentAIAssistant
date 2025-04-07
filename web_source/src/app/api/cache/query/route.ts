import { NextRequest } from 'next/server';
import { getQueryFromCache, addQueryToCache } from '@/lib/database-operations';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { query, documentIds, model } = await request.json();

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return new Response(JSON.stringify({ error: 'At least one document ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the D1 database instance from the environment
    const db = process.env.DB as any;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if the query is cached
    const cacheResult = await getQueryFromCache(db, query, documentIds, model || 'flash');
    
    if (cacheResult.success && cacheResult.cachedQuery) {
      // Return the cached response
      return new Response(JSON.stringify({
        answer: JSON.parse(cacheResult.cachedQuery.response),
        timestamp: cacheResult.cachedQuery.timestamp,
        model: cacheResult.cachedQuery.model,
        query: cacheResult.cachedQuery.query,
        cached: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If not cached, process the query with Gemini API
    // This would normally call the Gemini API, but for now we'll use a mock response
    const mockResponse = {
      answer: `This is a mock response to the query: "${query}". In a real implementation, this would be the response from the Gemini API.`,
      references: documentIds.map((docId, index) => ({
        type: 'section',
        documentName: `Document ${index + 1}`,
        documentId: docId,
        sectionName: 'Mock Section',
        content: 'Mock content for reference'
      })),
      timestamp: new Date().toISOString(),
      model: model || 'flash',
      query
    };

    // Cache the response
    const queryId = uuidv4();
    await addQueryToCache(db, queryId, query, documentIds, model || 'flash', mockResponse);

    return new Response(JSON.stringify({
      ...mockResponse,
      cached: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing cached query:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process query'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
