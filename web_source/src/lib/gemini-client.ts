import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse {
  text: string;
  references?: {
    type: 'page' | 'section' | 'paragraph';
    documentName: string;
    documentId: string;
    pageNumber?: number;
    sectionName?: string;
    paragraphIndex?: number;
  }[];
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: string;
  private temperature: number;
  private topK: number;
  private topP: number;
  private maxOutputTokens: number;

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model === 'gemini-1.5-flash' ? 'gemini-1.5-flash' : 'gemini-1.5-pro';
    this.temperature = config.temperature || 0.7;
    this.topK = config.topK || 40;
    this.topP = config.topP || 0.95;
    this.maxOutputTokens = config.maxOutputTokens || 8192;
  }

  async processQuery(query: string, documents: any[]): Promise<GeminiResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: this.temperature,
          topK: this.topK,
          topP: this.topP,
          maxOutputTokens: this.maxOutputTokens,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Prepare the prompt with documents content
      const documentsContent = documents.map(doc => {
        return `Document: ${doc.fileName}\nContent: ${doc.content}\n\n`;
      }).join('');

      const prompt = `
      You are an AI assistant that helps users find information in their documents.
      
      Below are the contents of the documents:
      
      ${documentsContent}
      
      User query: ${query}
      
      Please provide a comprehensive answer to the query based on the documents provided.
      Include references to the specific documents you used in your answer in the format [document_name, section: "section_name"] or [document_name, page: page_number].
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract references from the response
      // This is a simplified version - in a real implementation, we would use a more robust approach
      const references = this.extractReferences(text, documents);

      return {
        text,
        references,
      };
    } catch (error) {
      console.error('Error processing query with Gemini API:', error);
      throw error;
    }
  }

  private extractReferences(text: string, documents: any[]) {
    const references = [];
    const regex = /\[(.*?), (page|section): ?"?(.*?)"?\]/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const documentName = match[1];
      const referenceType = match[2] as 'page' | 'section';
      const referenceValue = match[3];

      // Find the document ID
      const document = documents.find(doc => doc.fileName === documentName);
      const documentId = document ? document.id : '';

      if (referenceType === 'page') {
        references.push({
          type: 'page',
          documentName,
          documentId,
          pageNumber: parseInt(referenceValue, 10),
        });
      } else if (referenceType === 'section') {
        references.push({
          type: 'section',
          documentName,
          documentId,
          sectionName: referenceValue,
        });
      }
    }

    return references;
  }
}
