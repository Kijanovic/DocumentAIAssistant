import { useState, useCallback } from 'react';
import { GeminiClient, GeminiConfig, GeminiResponse } from '@/lib/gemini-client';

export function useGeminiApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<GeminiClient | null>(null);

  const initializeClient = useCallback((config: GeminiConfig) => {
    try {
      const newClient = new GeminiClient(config);
      setClient(newClient);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Gemini client';
      setError(errorMessage);
      console.error('Error initializing Gemini client:', err);
      return false;
    }
  }, []);

  const processQuery = useCallback(async (
    query: string, 
    documents: any[],
    config?: Partial<Omit<GeminiConfig, 'apiKey'>>
  ): Promise<GeminiResponse | null> => {
    if (!client) {
      setError('Gemini client not initialized. Please set API key first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // If config is provided, create a new client with the updated config
      let clientToUse = client;
      if (config) {
        const currentConfig = client as unknown as GeminiConfig;
        clientToUse = new GeminiClient({
          ...currentConfig,
          ...config,
        });
      }

      const response = await clientToUse.processQuery(query, documents);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMessage);
      console.error('Error processing query:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [client]);

  return {
    initializeClient,
    processQuery,
    isProcessing,
    error,
    isInitialized: !!client
  };
}
