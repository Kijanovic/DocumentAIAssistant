import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is a multipart form
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Content type must be multipart/form-data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx')) {
      return new Response(JSON.stringify({ error: 'Only PDF and DOCX files are supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File size exceeds the 10MB limit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process the file (in a real implementation, this would extract text and metadata)
    // For now, we'll create a mock document object
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : 'docx';
    const documentId = uuidv4();
    
    const document = {
      id: documentId,
      fileName: file.name,
      fileType,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      metadata: {
        title: file.name,
        author: 'Unknown',
        creationDate: new Date().toISOString(),
        pageCount: fileType === 'pdf' ? 5 : undefined,
        wordCount: fileType === 'docx' ? 1000 : undefined,
      },
      content: `This is a mock content for ${file.name}. In a real implementation, this would be the extracted text from the document.`
    };

    // In a real implementation, we would save the document to the database
    // For now, we'll just return the document object
    return new Response(JSON.stringify({ success: true, document }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing document upload:', error);
    return new Response(JSON.stringify({ error: 'Failed to process document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
