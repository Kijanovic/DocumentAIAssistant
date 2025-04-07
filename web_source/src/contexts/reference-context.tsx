import { createContext, useContext, useState, ReactNode } from 'react';

interface ReferenceContextType {
  references: Reference[];
  selectedReferenceId: string | null;
  addReferences: (refs: Reference[]) => void;
  clearReferences: () => void;
  selectReference: (id: string) => void;
  getReferencedContent: (reference: Reference) => Promise<ReferenceContent | null>;
}

export interface Reference {
  id: string;
  type: 'page' | 'section' | 'paragraph';
  documentName: string;
  documentId: string;
  pageNumber?: number;
  sectionName?: string;
  paragraphIndex?: number;
}

export interface ReferenceContent {
  title: string;
  documentName: string;
  content: string;
  referenceType: 'page' | 'section' | 'paragraph';
  pageNumber?: number;
  sectionName?: string;
  paragraphIndex?: number;
  searchText?: string;
}

const ReferenceContext = createContext<ReferenceContextType | undefined>(undefined);

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null);

  const addReferences = (refs: Reference[]) => {
    // Add unique ID to each reference if not present
    const refsWithIds = refs.map(ref => {
      if (!ref.id) {
        const id = `ref-${Math.random().toString(36).substring(2, 11)}`;
        return { ...ref, id };
      }
      return ref;
    });
    
    setReferences(refsWithIds);
  };

  const clearReferences = () => {
    setReferences([]);
    setSelectedReferenceId(null);
  };

  const selectReference = (id: string) => {
    setSelectedReferenceId(id);
  };

  const getReferencedContent = async (reference: Reference): Promise<ReferenceContent | null> => {
    // This will be replaced with actual document content retrieval in the implementation phase
    // For now, we're just creating a mock content
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let title = '';
      if (reference.type === 'page') {
        title = `Page ${reference.pageNumber}`;
      } else if (reference.type === 'section') {
        title = `Section: ${reference.sectionName}`;
      } else {
        title = `Paragraph ${reference.paragraphIndex ? reference.paragraphIndex + 1 : 1}`;
      }
      
      return {
        title,
        documentName: reference.documentName,
        content: `This is a mock content for the reference from ${reference.documentName}. In the actual implementation, this will be the real content from the document.`,
        referenceType: reference.type,
        pageNumber: reference.pageNumber,
        sectionName: reference.sectionName,
        paragraphIndex: reference.paragraphIndex
      };
    } catch (error) {
      console.error('Error retrieving reference content:', error);
      return null;
    }
  };

  return (
    <ReferenceContext.Provider
      value={{
        references,
        selectedReferenceId,
        addReferences,
        clearReferences,
        selectReference,
        getReferencedContent,
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferences() {
  const context = useContext(ReferenceContext);
  if (context === undefined) {
    throw new Error('useReferences must be used within a ReferenceProvider');
  }
  return context;
}
