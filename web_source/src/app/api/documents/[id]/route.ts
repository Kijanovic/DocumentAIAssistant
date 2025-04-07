import { NextRequest } from 'next/server';
import { getDocument, updateExistingDocument, removeDocument } from '@/lib/database-operations';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    
    // Get the D1 database instance from the environment
    const db = process.env.DB as any;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the document
    const result = await getDocument(db, documentId);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ document: result.document }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error retrieving document:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error retrieving document'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const documentData = await request.json();
    
    // Ensure the document ID in the URL matches the one in the body
    if (documentData.id !== documentId) {
      return new Response(JSON.stringify({ error: 'Document ID mismatch' }), {
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
    
    // Update the document
    const result = await updateExistingDocument(db, documentData);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Failed to update document' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error updating document'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    
    // Get the D1 database instance from the environment
    const db = process.env.DB as any;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete the document
    const result = await removeDocument(db, documentId);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Failed to delete document' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error deleting document'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
