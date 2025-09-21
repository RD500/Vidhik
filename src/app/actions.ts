'use server';

import { generateLegalAnswer } from '@/ai/flows/generate-legal-answer';
import { demystifyDocument, DemystifyDocumentOutput } from '@/ai/flows/demystify-document';
import { compareDocuments, CompareDocumentsOutput } from '@/ai/flows/compare-documents';

export async function askQuestion(
  question: string,
  documentText: string
): Promise<{ answer?: string; error?: string }> {
  try {
    const result = await generateLegalAnswer({
      documentText,
      question,
    });
    
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to get an answer. ${errorMessage}` };
  }
}

export async function analyzeDocument(
  documentText: string
): Promise<{ analysis?: DemystifyDocumentOutput; error?: string }> {
  try {
    const result = await demystifyDocument({
      documentText,
    });
    return { analysis: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to analyze the document. ${errorMessage}` };
  }
}

export async function compareTwoDocuments(
  documentAText: string,
  documentBText: string
): Promise<{ comparison?: CompareDocumentsOutput; error?: string }> {
    try {
        const result = await compareDocuments({
            documentAText,
            documentBText,
        });
        return { comparison: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { error: `Failed to compare the documents. ${errorMessage}` };
    }
}
