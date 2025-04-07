import { NextRequest } from 'next/server';
import { clearCache, cleanupExpiredCache } from '@/lib/database-operations';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { action, maxAgeDays } = await request.json();

    // Get the D1 database instance from the environment
    const db = process.env.DB as any;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'clear') {
      // Clear all cache
      const result = await clearCache(db);
      
      if (!result.success) {
        return new Response(JSON.stringify({ error: result.error || 'Failed to clear cache' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ success: true, message: 'Cache cleared successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (action === 'cleanup') {
      // Clean up expired cache
      if (!maxAgeDays || typeof maxAgeDays !== 'number' || maxAgeDays <= 0) {
        return new Response(JSON.stringify({ error: 'Valid maxAgeDays parameter is required for cleanup' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const result = await cleanupExpiredCache(db, maxAgeDays);
      
      if (!result.success) {
        return new Response(JSON.stringify({ error: result.error || 'Failed to clean up expired cache' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Expired cache cleaned up successfully`,
        removedCount: result.removedCount
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action. Use "clear" or "cleanup".' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error managing cache:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to manage cache'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
