'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-legal-answer.ts';
import '@/ai/flows/demystify-document.ts';
import '@/ai/flows/compare-documents.ts';
