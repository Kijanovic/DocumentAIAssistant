import React from 'react';
import { useGemini } from '@/contexts/gemini-context';
import { useReferences } from '@/contexts/reference-context';

export function ResponseDisplay() {
  const { lastResponse, isProcessing } = useGemini();
  const { references, selectReference } = useReferences();
  const [activeTab, setActiveTab] = React.useState<'answer' | 'references'>('answer');

  if (!lastResponse && !isProcessing) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-gray-500">No response yet.</p>
        <p className="text-sm text-gray-400 mt-1">Ask a question to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab('answer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'answer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Answer
          </button>
          <button
            onClick={() => setActiveTab('references')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'references'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            References {references.length > 0 && `(${references.length})`}
          </button>
        </nav>
      </div>

      {isProcessing ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'answer' && lastResponse && (
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{lastResponse.answer}</p>
            </div>
          )}

          {activeTab === 'references' && (
            <div>
              {references.length > 0 ? (
                <ul className="space-y-2">
                  {references.map((ref) => (
                    <li 
                      key={ref.id} 
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectReference(ref.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{ref.documentName}</p>
                          <p className="text-xs text-gray-500">
                            {ref.type === 'page' && `Page ${ref.pageNumber}`}
                            {ref.type === 'section' && `Section: ${ref.sectionName}`}
                            {ref.type === 'paragraph' && `Paragraph ${ref.paragraphIndex ? ref.paragraphIndex + 1 : 1}`}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-8">No references available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
