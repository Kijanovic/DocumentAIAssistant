import { createContext, useContext, useState, ReactNode } from 'react';

interface DocumentContextType {
  documents: DocumentInfo[];
  selectedDocuments: string[];
  addDocument: (document: DocumentInfo) => void;
  removeDocument: (id: string) => void;
  selectDocument: (id: string) => void;
  deselectDocument: (id: string) => void;
  selectAllDocuments: () => void;
  deselectAllDocuments: () => void;
  getDocumentById: (id: string) => DocumentInfo | undefined;
}

export interface DocumentInfo {
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
  content?: string;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const addDocument = (document: DocumentInfo) => {
    setDocuments((prevDocuments) => [...prevDocuments, document]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
    setSelectedDocuments((prevSelected) => prevSelected.filter((docId) => docId !== id));
  };

  const selectDocument = (id: string) => {
    if (!selectedDocuments.includes(id)) {
      setSelectedDocuments((prevSelected) => [...prevSelected, id]);
    }
  };

  const deselectDocument = (id: string) => {
    setSelectedDocuments((prevSelected) => prevSelected.filter((docId) => docId !== id));
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(documents.map((doc) => doc.id));
  };

  const deselectAllDocuments = () => {
    setSelectedDocuments([]);
  };

  const getDocumentById = (id: string) => {
    return documents.find((doc) => doc.id === id);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        selectedDocuments,
        addDocument,
        removeDocument,
        selectDocument,
        deselectDocument,
        selectAllDocuments,
        deselectAllDocuments,
        getDocumentById,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
