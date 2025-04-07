import { NextRequest } from 'next/server';
import { GeminiClient } from '@/lib/gemini-client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { query, documents, model, temperature, topK, topP, maxOutputTokens } = await request.json();

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return new Response(JSON.stringify({ error: 'At least one document is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API key from environment or request
    const apiKey = request.headers.get('x-api-key') || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient({
      apiKey,
      model: model || 'gemini-1.5-flash',
      temperature,
      topK,
      topP,
      maxOutputTokens
    });

    // Process the query
    const response = await geminiClient.processQuery(query, documents);

    return new Response(JSON.stringify({
      answer: response.text,
      references: response.references || [],
      timestamp: new Date().toISOString(),
      model: model || 'gemini-1.5-flash',
      query
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing Gemini API request:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process query with Gemini API'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
