'use server';

/**
 * @fileOverview Verifies the authenticity of a given text report using a transformer model.
 *
 * - verifyReportAuthenticity - A function that analyzes a report's text to determine its authenticity.
 * - VerifyReportAuthenticityInput - The input type for the verifyReportAuthenticity function.
 * - VerifyReportAuthenticityOutput - The return type for the verifyReportAuthenticity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { pipeline } from '@xenova/transformers';

const VerifyReportAuthenticityInputSchema = z.object({
  text: z.string().describe('The text content of the report to be analyzed.'),
});
export type VerifyReportAuthenticityInput = z.infer<typeof VerifyReportAuthenticityInputSchema>;

const VerifyReportAuthenticityOutputSchema = z.object({
  authenticityScore: z
    .number()
    .describe('A score between 0 and 1 indicating the likelihood of the report being authentic. Higher is more authentic.'),
});
export type VerifyReportAuthenticityOutput = z.infer<typeof VerifyReportAuthenticityOutputSchema>;


class AuthenticityPipeline {
  static task = 'text-classification';
  static model = 'xenova/bert-base-cased-fakeddit';
  static instance: any | null = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}


export async function verifyReportAuthenticity(
  input: VerifyReportAuthenticityInput
): Promise<VerifyReportAuthenticityOutput> {
  return verifyReportAuthenticityFlow(input);
}

const verifyReportAuthenticityFlow = ai.defineFlow(
  {
    name: 'verifyReportAuthenticityFlow',
    inputSchema: VerifyReportAuthenticityInputSchema,
    outputSchema: VerifyReportAuthenticityOutputSchema,
  },
  async (input) => {
    try {
        const classifier = await AuthenticityPipeline.getInstance();
        const results = await classifier(input.text, { topk: null });

        let authenticityScore = 0;
        const realNewsResult = results.find((result: { label: string; score: number }) => result.label === 'real');

        if (realNewsResult) {
            authenticityScore = realNewsResult.score;
        }

        return { authenticityScore };

    } catch (e) {
      console.error('Error during authenticity verification:', e);
      // Return a neutral score in case of an error
      return { authenticityScore: 0.5 };
    }
  }
);
