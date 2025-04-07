import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

// Types for document processing
export interface ProcessedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  metadata: {
    title: string;
    author: string;
    creationDate?: Date;
    pageCount?: number;
    wordCount?: number;
  };
  content: string;
}

export function useDocumentProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File): Promise<ProcessedDocument | null> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 
                      (file.name.toLowerCase().endsWith('.docx') ? 'docx' : 'unknown');
      
      if (fileType === 'unknown') {
        throw new Error('Unsupported file type. Only PDF and DOCX files are supported.');
      }

      // Generate a unique ID for the document
      const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      setProgress(10);
      
      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      
      let content = '';
      let metadata: any = {
        title: file.name,
        author: 'Unknown'
      };
      
      // Process based on file type
      if (fileType === 'pdf') {
        const result = await processPdf(arrayBuffer);
        content = result.content;
        metadata = { ...metadata, ...result.metadata };
      } else if (fileType === 'docx') {
        const result = await processDocx(arrayBuffer);
        content = result.content;
        metadata = { ...metadata, ...result.metadata };
      }
      
      setProgress(90);
      
      // Create the processed document object
      const processedDocument: ProcessedDocument = {
        id,
        fileName: file.name,
        fileType,
        fileSize: file.size,
        uploadDate: new Date(),
        metadata,
        content
      };
      
      setProgress(100);
      return processedDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error processing document';
      setError(errorMessage);
      console.error('Error processing document:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Process PDF files
  const processPdf = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Extract metadata
      const { info } = pdfDoc;
      const metadata = {
        title: info.title || 'Untitled',
        author: info.author || 'Unknown',
        creationDate: info.creationDate ? new Date(info.creationDate) : undefined,
        pageCount: pdfDoc.getPageCount()
      };
      
      // For content extraction in a browser environment, we'd typically use pdf.js
      // This is a simplified version that would need to be expanded
      // In a real implementation, we would use pdf.js to extract text from each page
      
      // Placeholder for content extraction
      const content = `This PDF document contains ${metadata.pageCount} pages. Full text extraction would be implemented using pdf.js in the complete version.`;
      
      return { content, metadata };
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF document');
    }
  };

  // Process DOCX files
  const processDocx = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Convert DOCX to HTML
      const result = await mammoth.extractRawText({ arrayBuffer });
      const content = result.value;
      
      // Extract word count (simple approximation)
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      
      // Metadata is limited in browser environment
      const metadata = {
        title: 'Document',
        author: 'Unknown',
        wordCount
      };
      
      return { content, metadata };
    } catch (error) {
      console.error('Error processing DOCX:', error);
      throw new Error('Failed to process DOCX document');
    }
  };

  // File upload hook using react-dropzone
  const useDocumentUpload = () => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      await processFile(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      maxFiles: 1
    });

    return {
      getRootProps,
      getInputProps,
      isDragActive,
      isProcessing,
      progress,
      error
    };
  };

  return {
    processFile,
    useDocumentUpload,
    isProcessing,
    progress,
    error
  };
}
