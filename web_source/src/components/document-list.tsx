import React from 'react';
import { useDocuments } from '@/contexts/document-context';

export function DocumentList() {
  const { documents, selectedDocuments, selectDocument, deselectDocument, selectAllDocuments, deselectAllDocuments } = useDocuments();

  if (documents.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg">
        <p className="text-gray-500">No documents uploaded yet.</p>
        <p className="text-sm text-gray-400 mt-1">Upload documents to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents ({documents.length})</h3>
        <div className="flex space-x-2">
          <button 
            onClick={selectAllDocuments}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Select All
          </button>
          <button 
            onClick={deselectAllDocuments}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedDocuments.includes(doc.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    selectDocument(doc.id);
                  } else {
                    deselectDocument(doc.id);
                  }
                }}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                <p className="text-xs text-gray-500">
                  {doc.fileType.toUpperCase()} • {formatFileSize(doc.fileSize)}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(new Date(doc.uploadDate))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
