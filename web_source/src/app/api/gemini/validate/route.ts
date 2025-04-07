import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Get API key from request header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Make a simple request to the Gemini API to validate the key
    // This is a minimal request that should work with any valid key
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=' + apiKey);
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ 
        error: 'Invalid API key',
        details: errorData
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If we get here, the key is valid
    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to validate API key'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
