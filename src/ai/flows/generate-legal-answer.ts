'use server';
/**
 * @fileOverview A unified Genkit flow for answering legal questions about a document.
 * This flow intelligently decides whether to use a simple retrieval or a more complex,
 * multi-step reasoning approach based on the user's question. It supports multilingual queries.
 *
 * - generateLegalAnswer - A function that handles the entire question-answering process.
 * - GenerateLegalAnswerInput - The input type for the generateLegalAnswer function.
 * - GenerateLegalAnswerOutput - The return type for the generateLegalAnswer function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const GenerateLegalAnswerInputSchema = z.object({
  documentText: z
    .string()
    .describe("The text content of the legal document. This could be in English or a major Indian language (e.g., Hindi, Tamil, Bengali)."),
  question: z.string().describe("The user's question about the document. This could be in English, Hindi, or Hinglish."),
});
export type GenerateLegalAnswerInput = z.infer<typeof GenerateLegalAnswerInputSchema>;

const GenerateLegalAnswerOutputSchema = z.object({
  answer: z.string().describe('The generated answer to the user\'s question, in English.'),
});
export type GenerateLegalAnswerOutput = z.infer<typeof GenerateLegalAnswerOutputSchema>;

export async function generateLegalAnswer(
  input: GenerateLegalAnswerInput
): Promise<GenerateLegalAnswerOutput> {
  return generateLegalAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLegalAnswerPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: { schema: GenerateLegalAnswerInputSchema },
  output: { schema: GenerateLegalAnswerOutputSchema },
  prompt: `You are "Vidhik," an expert AI legal assistant specializing in multilingual document analysis. Your primary goal is to demystify complex legal documents for the average person, providing clear, accessible, and practical guidance in English.

CRITICAL INSTRUCTIONS:
1.  **Multilingual Analysis:**
    *   The **DOCUMENT CONTEXT** may be in an Indian regional language (e.g., Hindi, Tamil, Kannada, etc.).
    *   The **USER QUESTION** may be in English, Hindi, or Hinglish.
    *   Your task is to understand the question in its language and find the relevant information within the original document, regardless of its language.
2.  **English Output ONLY (MANDATORY):** Your entire response and the final answer MUST be in **English**. Do not respond in any other language.
3.  **Strict Formatting (MANDATORY):** You MUST format your entire response using markdown. Your output quality will be judged on its clarity and readability.
    *   Use headings (\`##\`) for major sections.
    *   Use bold text (\`**text**\`) for key terms, concepts, and summary points.
    *   Use bullet points (\`*\`) for lists of items, coverages, or responsibilities.
    *   Do NOT output large, unbroken paragraphs. Break up information into scannable chunks.
4.  **Explain in Simple Terms:** Avoid legal jargon. Explain complex clauses in a way that is easy for a non-lawyer to understand. Use analogies or examples where helpful.
5.  **Structure Your Analysis:** When answering, structure your response into logical sections with clear markdown headings. For example:
    *   \## Key Takeaways
    *   \## What The Policy Covers
    *   \## Your Responsibilities
    *   \## Potential Risks & Red Flags
6.  **Maintain a Supportive Tone:** Be a reliable, private, and safe first point of contact. Empower the user to make informed decisions.

DOCUMENT CONTEXT:
{{{documentText}}}

USER QUESTION:
{{{question}}}`,
});

const generateLegalAnswerFlow = ai.defineFlow(
  {
    name: 'generateLegalAnswerFlow',
    inputSchema: GenerateLegalAnswerInputSchema,
    outputSchema: GenerateLegalAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid answer.");
    }
    return output;
  }
);
