import { useState, useCallback } from 'react';
import { useDocuments } from '@/contexts/document-context';

export interface UploadComponentProps {
  className?: string;
}

export function DocumentUploadComponent({ className = '' }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { addDocument } = useDocuments();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Check file type
    const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 
                    (file.name.toLowerCase().endsWith('.docx') ? 'docx' : 'unknown');
    
    if (fileType === 'unknown') {
      setError('Unsupported file type. Only PDF and DOCX files are supported.');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // In a real implementation, we would call an API endpoint to process the file
      // For now, we'll simulate the upload and processing
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a unique ID for the document
      const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      // Create a mock document
      const newDocument = {
        id,
        fileName: file.name,
        fileType,
        fileSize: file.size,
        uploadDate: new Date(),
        metadata: {
          title: file.name,
          author: 'Unknown',
          creationDate: new Date(),
          pageCount: fileType === 'pdf' ? 5 : undefined,
          wordCount: fileType === 'docx' ? 1000 : undefined,
        }
      };
      
      // Add the document to the context
      addDocument(newDocument);
      
      // Clear the file input
      setFile(null);
      
      // Clear any intervals that might still be running
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setProgress(0);
        setIsUploading(false);
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error uploading document';
      setError(errorMessage);
      console.error('Error uploading document:', err);
      setIsUploading(false);
    }
  };

  return (
    <div className={`p-4 border-2 border-dashed rounded-lg ${className}`}>
      <div className="flex flex-col items-center">
        <svg 
          className="w-12 h-12 text-gray-400 mb-3" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mb-4">PDF or DOCX (Max 10MB)</p>
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        
        <label
          htmlFor="file-upload"
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
        >
          Select File
        </label>
        
        {file && (
          <div className="mt-4 w-full">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`mt-2 px-4 py-2 rounded w-full ${
                isUploading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600 transition'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
        
        {isUploading && (
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">{progress}%</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}
