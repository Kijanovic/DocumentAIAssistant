import React, { useState } from 'react';
import { useGemini } from '@/contexts/gemini-context';
import { useConfig } from '@/contexts/config-context';

export function QueryInterface() {
  const [query, setQuery] = useState('');
  const { isProcessing, lastResponse, processQuery } = useGemini();
  const { config, updateConfig } = useConfig();
  const { documents, selectedDocuments } = useDocuments();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;
    
    try {
      // Determine which document IDs to use
      const documentIds = config.autoDocumentSelection 
        ? documents.map(doc => doc.id) // Use all documents if auto-selection is enabled
        : selectedDocuments;
        
      if (documentIds.length === 0) {
        alert('Please select at least one document');
        return;
      }
      
      await processQuery(query, documentIds);
    } catch (error) {
      console.error('Error processing query:', error);
    }
  };
  
  const handleAutoSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ autoDocumentSelection: e.target.checked });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ask a Question</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question about the documents..."
          className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isProcessing}
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto-select"
            checked={config.autoDocumentSelection}
            onChange={handleAutoSelectChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
          />
          <label htmlFor="auto-select" className="ml-2 text-sm text-gray-700">
            Auto-select relevant documents
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !query.trim()}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            isProcessing || !query.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Send Query'}
        </button>
      </form>
      
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">Processing your query...</p>
        </div>
      )}
    </div>
  );
}

// Import at the top of the file
import { useDocuments } from '@/contexts/document-context';
