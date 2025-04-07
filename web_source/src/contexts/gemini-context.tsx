import { createContext, useContext, useState, ReactNode } from 'react';

interface GeminiContextType {
  apiKey: string | null;
  currentModel: 'flash' | 'pro';
  isProcessing: boolean;
  lastResponse: GeminiResponse | null;
  setApiKey: (key: string) => void;
  setCurrentModel: (model: 'flash' | 'pro') => void;
  processQuery: (query: string, documentIds: string[]) => Promise<GeminiResponse>;
  clearLastResponse: () => void;
}

export interface GeminiResponse {
  answer: string;
  references: Reference[];
  timestamp: Date;
  model: string;
  query: string;
}

export interface Reference {
  type: 'page' | 'section' | 'paragraph';
  documentName: string;
  documentId: string;
  pageNumber?: number;
  sectionName?: string;
  paragraphIndex?: number;
  content?: string;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export function GeminiProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<'flash' | 'pro'>('flash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<GeminiResponse | null>(null);

  const processQuery = async (query: string, documentIds: string[]): Promise<GeminiResponse> => {
    setIsProcessing(true);
    
    try {
      // This will be replaced with actual API call in the implementation phase
      // For now, we're just creating a mock response structure
      const mockResponse: GeminiResponse = {
        answer: `This is a mock response to the query: ${query}`,
        references: documentIds.map((docId, index) => ({
          type: 'section',
          documentName: `Document ${index + 1}`,
          documentId: docId,
          sectionName: 'Mock Section',
          content: 'Mock content for reference'
        })),
        timestamp: new Date(),
        model: currentModel,
        query: query
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastResponse(mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearLastResponse = () => {
    setLastResponse(null);
  };

  return (
    <GeminiContext.Provider
      value={{
        apiKey,
        currentModel,
        isProcessing,
        lastResponse,
        setApiKey,
        setCurrentModel,
        processQuery,
        clearLastResponse,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
}

export function useGemini() {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
}
