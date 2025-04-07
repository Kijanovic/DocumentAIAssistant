import { NextRequest } from 'next/server';
import { getDocuments } from '@/lib/database-operations';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get the D1 database instance from the environment
    const db = process.env.DB as any;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get all documents
    const result = await getDocuments(db);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve documents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ documents: result.documents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error retrieving documents'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
