import { NextRequest } from 'next/server';
import { initializeDatabase } from '@/lib/database-operations';

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
    
    // Initialize the database
    const result = await initializeDatabase(db);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to initialize database' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, message: 'Database initialized successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error initializing database'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
