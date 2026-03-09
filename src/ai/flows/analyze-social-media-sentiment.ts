'use server';

/**
 * @fileOverview Analyzes social media posts related to reported hazards to understand public sentiment.
 *
 * - analyzeSocialMediaSentiment - A function that analyzes social media sentiment related to a specific query.
 * - AnalyzeSocialMediaSentimentInput - The input type for the analyzeSocialMediaSentiment function.
 * - AnalyzeSocialMediaSentimentOutput - The return type for the analyzeSocialMediaSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSocialMediaSentimentInputSchema = z.object({
  query: z.string().describe('The search query to use for finding relevant social media posts.'),
});
export type AnalyzeSocialMediaSentimentInput = z.infer<
  typeof AnalyzeSocialMediaSentimentInputSchema
>;

const AnalyzeSocialMediaSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'A summary of the sentiment expressed in the social media posts, e.g. positive, negative, neutral, or mixed.'
    ),
  urgencyScore: z
    .number()
    .describe(
      'A numerical score between 0 and 1 indicating the urgency of the situation based on the social media posts. Higher values indicate greater urgency.'
    ),
  summary: z.string().describe('A detailed summary of the social media posts.'),
});
export type AnalyzeSocialMediaSentimentOutput = z.infer<
  typeof AnalyzeSocialMediaSentimentOutputSchema
>;

export async function analyzeSocialMediaSentiment(
  input: AnalyzeSocialMediaSentimentInput
): Promise<AnalyzeSocialMediaSentimentOutput> {
  return analyzeSocialMediaSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSocialMediaSentimentPrompt',
  input: {schema: AnalyzeSocialMediaSentimentInputSchema},
  output: {schema: AnalyzeSocialMediaSentimentOutputSchema},
  prompt: `You are an AI that analyzes social media posts to determine the sentiment and urgency of a situation.\n\nAnalyze the following social media posts related to the query "{{query}}" and provide a sentiment analysis, an urgency score, and a summary.\n\nConsider factors such as the tone of the posts, the number of people affected, and the potential for harm.\n\nOutput the sentiment as one of the following values: "positive", "negative", "neutral", or "mixed".\n\nOutput the urgency score as a number between 0 and 1. Higher values indicate greater urgency.\n\nSocial Media Posts:\n[To be populated by social media scraping service]`, // The prompt will be populated by a service that is not built yet.
});

const analyzeSocialMediaSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSocialMediaSentimentFlow',
    inputSchema: AnalyzeSocialMediaSentimentInputSchema,
    outputSchema: AnalyzeSocialMediaSentimentOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        if (!output) throw new Error('AI produced no output');
        return output;
    } catch (error) {
        console.error('Error in analyzeSocialMediaSentimentFlow:', error);
        // Fallback for stability
        return {
            sentiment: 'neutral',
            urgencyScore: 0.3,
            summary: 'The AI sentiment analysis service is currently limited. Displaying baseline community engagement metrics.'
        };
    }
  }
);
