import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function middleware(request: NextRequest) {
  // Check if the request is for the API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For API routes, we'll add CORS headers
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    
    return response;
  }
  
  // For non-API routes, just continue
  return NextResponse.next();
}

// Import at the top of the file
import { NextResponse } from 'next/server';
