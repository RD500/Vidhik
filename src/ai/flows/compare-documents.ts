'use server';
/**
 * @fileOverview A Genkit flow for comparing two legal documents to identify differences.
 *
 * - compareDocuments - A function that handles the document comparison process.
 * - CompareDocumentsInput - The input type for the compareDocuments function.
 * - CompareDocumentsOutput - The return type for the compareDocuments function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const CompareDocumentsInputSchema = z.object({
  documentAText: z
    .string()
    .describe("The text content of the first document. Can be in English or an Indian language."),
  documentBText: z
    .string()
    .describe("The text content of the second document. Can be in English or an Indian language."),
});
export type CompareDocumentsInput = z.infer<typeof CompareDocumentsInputSchema>;

const ClauseComparisonSchema = z.object({
  clause: z.string().describe("The name or a summary of the clause, in English."),
  documentA_details: z.string().describe("The specific text or summary from Document A, in English."),
  documentB_details: z.string().describe("The specific text or summary from Document B, in English."),
  change_description: z.string().describe("A description of how the clause has changed, in English."),
});

const CompareDocumentsOutputSchema = z.object({
    summary: z.string().describe("A high-level summary of the key differences between the two documents, in English."),
    newClauses: z.array(z.object({
        clause: z.string().describe("The new clause or term introduced, in English."),
        description: z.string().describe("A brief explanation of what the new clause means, in English."),
    })).describe("A list of significant clauses or terms present in Document B but not in Document A."),
    changedTerms: z.array(ClauseComparisonSchema).describe("A list of terms or clauses that have been modified between the two documents."),
    deletedClauses: z.array(z.object({
        clause: z.string().describe("The clause or term that was removed, in English."),
        description: z.string().describe("A brief explanation of the potential impact of this removal, in English."),
    })).describe("A list of significant clauses or terms present in Document A but removed from Document B."),
});
export type CompareDocumentsOutput = z.infer<typeof CompareDocumentsOutputSchema>;


export async function compareDocuments(
  input: CompareDocumentsInput
): Promise<CompareDocumentsOutput> {
  return compareDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareDocumentsPrompt',
  model: googleAI.model('gemini-2.5-pro'),
  input: { schema: CompareDocumentsInputSchema },
  output: { schema: CompareDocumentsOutputSchema },
  prompt: `You are a "Master Legal Analyst" AI with multilingual capabilities. Your task is to perform a detailed comparison between two legal documents. These documents may be in English or major Indian regional languages. Your entire output report MUST be in English.

Your analysis must be structured as a "diff" report, highlighting the critical changes. Follow these steps:

1.  **Analyze Document A:** Understand its key clauses, terms, and obligations, even if it's not in English.
2.  **Analyze Document B:** Understand its key clauses, terms, and obligations, even if it's not in English.
3.  **Synthesize and Compare:** Based on your analysis of both documents, generate a comparison report with the following sections, all written in English:
    *   **Summary:** Provide a high-level overview of the most important changes.
    *   **New Clauses:** Identify significant clauses that are present in Document B but were not in Document A.
    *   **Changed Terms:** Identify clauses that exist in both documents but have been modified. For each, detail the original text (from A), the new text (from B), and explain the change.
    *   **Deleted Clauses:** Identify significant clauses that were in Document A but have been removed from Document B.

CRITICAL INSTRUCTIONS:
*   The output MUST be in English.
*   Focus on material differences. Do not report minor grammatical changes or rephrasing that doesn't alter the legal meaning.
*   The output MUST be in the structured format defined. Do not include any disclaimers or introductory text outside of the schema.

DOCUMENT A (Original):
{{{documentAText}}}

DOCUMENT B (Revised):
{{{documentBText}}}
`,
});

const compareDocumentsFlow = ai.defineFlow(
  {
    name: 'compareDocumentsFlow',
    inputSchema: CompareDocumentsInputSchema,
    outputSchema: CompareDocumentsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid comparison.");
    }
    return output;
  }
);
