'use server';
/**
 * @fileOverview A Genkit flow to demystify a legal document by providing a summary, a jargon buster, suggested questions, and key obligations.
 *
 * - demystifyDocument - A function that handles the document analysis.
 * - DemystifyDocumentInput - The input type for the demystifyDocument function.
 * - DemystifyDocumentOutput - The return type for the demystifyDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DemystifyDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe("The text content of the legal document. This could be in English or a major Indian language (e.g., Hindi, Tamil, Bengali)."),
});
export type DemystifyDocumentInput = z.infer<typeof DemystifyDocumentInputSchema>;

const JargonTermSchema = z.object({
  term: z.string().describe('The complex legal term.'),
  definition: z.string().describe('The simple, easy-to-understand explanation of the term, in English.'),
});

const ObligationSchema = z.object({
    description: z.string().describe("A clear and concise description of the obligation or deadline, in English."),
    date: z.string().describe("The specific date or timeframe for the obligation (e.g., 'YYYY-MM-DD', 'Within 30 days of signing')."),
});

const RiskSchema = z.object({
    clause: z.string().describe("A summary of the clause that contains the risk, in English."),
    riskLevel: z.enum(['High', 'Medium', 'Low']).describe("The categorized risk level."),
    explanation: z.string().describe("A simple explanation of why this clause is a potential risk, in English."),
});

const DemystifyDocumentOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the document\'s key features and clauses, formatted in markdown and written in English.'),
  jargonBuster: z.array(JargonTermSchema).describe('A list of complex legal terms and their simple definitions, in English.'),
  suggestedQuestions: z.array(z.string()).describe('A list of 3-5 key questions a user should ask about the document, in English.'),
  obligations: z.array(ObligationSchema).describe("A chronological list of key dates, deadlines, and recurring obligations found in the document, in English."),
  riskAnalysis: z.array(RiskSchema).describe("A proactive analysis of potentially risky or unfavorable clauses, in English."),
});
export type DemystifyDocumentOutput = z.infer<typeof DemystifyDocumentOutputSchema>;


export async function demystifyDocument(
  input: DemystifyDocumentInput
): Promise<DemystifyDocumentOutput> {
  return demystifyDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demystifyDocumentPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: { schema: DemystifyDocumentInputSchema },
  output: { schema: DemystifyDocumentOutputSchema },
  prompt: `You are "Vidhik," an expert AI legal assistant specializing in multilingual document analysis. Your primary goal is to demystify a complex legal document for the average person.

The document provided may be in an Indian regional language (e.g., Hindi, Tamil, etc.). Your task is to analyze it thoroughly and generate a comprehensive breakdown **ENTIRELY IN ENGLISH**.

Perform the following five tasks, ensuring all output is in English:

1.  **Generate a Feature Summary:** Create a high-level summary in English of the document's most important features, clauses, and obligations. The summary should be clear, concise, and formatted using markdown with headings and bullet points.
2.  **Create a Jargon Buster:** Identify the most complex legal terms in the document. For each term, provide a simple, one- or two-sentence explanation in English that a non-lawyer can easily understand.
3.  **Suggest Key Questions:** Based on the document, generate a list of 3 to 5 important and practical questions (in English) that the user should consider asking to better understand their rights, obligations, and potential risks.
4.  **Extract Obligations & Deadlines:** Scan the document for key dates, deadlines, and recurring obligations. Present this information as a list in English, ordered chronologically where possible.
5.  **Perform Automated Risk Analysis:** Proactively identify and flag potentially risky or unfavorable clauses. Categorize these risks as 'High', 'Medium', or 'Low' and explain in simple English terms why a particular clause might be a concern.

CRITICAL INSTRUCTIONS:
*   The source document may not be in English. You must understand it and produce all output in English.
*   Do NOT include a disclaimer in your response. The output will be used in a structured format.
*   The summary MUST be well-formatted markdown.

DOCUMENT CONTEXT:
{{{documentText}}}
`,
});

const demystifyDocumentFlow = ai.defineFlow(
  {
    name: 'demystifyDocumentFlow',
    inputSchema: DemystifyDocumentInputSchema,
    outputSchema: DemystifyDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid analysis.");
    }
    return output;
  }
);
