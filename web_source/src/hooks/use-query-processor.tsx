import { useState, useCallback } from 'react';
import { useGemini } from '@/contexts/gemini-context';
import { useDocuments } from '@/contexts/document-context';
import { useReferences } from '@/contexts/reference-context';

export function useQueryProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { processQuery } = useGemini();
  const { documents, selectedDocuments } = useDocuments();
  const { addReferences } = useReferences();

  const processUserQuery = useCallback(async (
    query: string,
    useSelectedDocuments: boolean = false
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Determine which document IDs to use
      const documentIds = useSelectedDocuments 
        ? selectedDocuments 
        : documents.map(doc => doc.id);

      if (documentIds.length === 0) {
        throw new Error('No documents selected for query processing');
      }

      // Process the query
      const response = await processQuery(query, documentIds);
      
      // Add references to the reference context
      if (response && response.references && response.references.length > 0) {
        addReferences(response.references);
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMessage);
      console.error('Error processing query:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [processQuery, documents, selectedDocuments, addReferences]);

  return {
    processUserQuery,
    isProcessing,
    error
  };
}
