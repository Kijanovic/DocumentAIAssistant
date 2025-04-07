import React from 'react';
import { DocumentList } from '@/components/document-list';
import { DocumentUploadComponent } from '@/components/document-upload';
import { QueryInterface } from '@/components/query-interface';
import { ResponseDisplay } from '@/components/response-display';
import { ApiKeyManager } from '@/components/api-key-manager';
import { ModelSelector } from '@/components/model-selector';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">DocumentAI Web Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Document Management */}
        <div className="space-y-6">
          <ApiKeyManager />
          <ModelSelector />
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <DocumentList />
            <div className="mt-4">
              <DocumentUploadComponent />
            </div>
          </div>
        </div>
        
        {/* Middle Column - Query Interface */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Query</h2>
          <QueryInterface />
        </div>
        
        {/* Right Column - Response Display */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Response</h2>
          <ResponseDisplay />
        </div>
      </div>
    </div>
  );
}
