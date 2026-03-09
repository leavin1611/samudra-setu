'use server';

/**
 * @fileOverview Generates safety precautions (do's and don'ts) for a specific ocean hazard.
 *
 * - generateSafetyPrecautions - A function that returns a list of do's and don'ts.
 * - GenerateSafetyPrecautionsInput - The input type for the function.
 * - GenerateSafetyPrecautionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSafetyPrecautionsInputSchema = z.object({
  hazardType: z
    .enum(['tsunami', 'storm', 'waves', 'currents', 'flooding', 'erosion', 'other'])
    .describe('The type of hazard for which to generate safety precautions.'),
  severity: z
    .enum(['low', 'medium', 'high', 'extreme'])
    .describe('The severity of the hazard.'),
});
export type GenerateSafetyPrecautionsInput = z.infer<typeof GenerateSafetyPrecautionsInputSchema>;

const GenerateSafetyPrecautionsOutputSchema = z.object({
  dos: z.array(z.string()).describe("A list of essential things to DO during the specified hazard."),
  donts: z.array(z.string()).describe("A list of critical things NOT TO DO during the specified hazard."),
  bulletin: z.string().describe("A concise, one-sentence public safety bulletin message."),
});
export type GenerateSafetyPrecautionsOutput = z.infer<typeof GenerateSafetyPrecautionsOutputSchema>;

export async function generateSafetyPrecautions(
  input: GenerateSafetyPrecautionsInput
): Promise<GenerateSafetyPrecautionsOutput> {
  return generateSafetyPrecautionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSafetyPrecautionsPrompt',
  input: { schema: GenerateSafetyPrecautionsInputSchema },
  output: { schema: GenerateSafetyPrecautionsOutputSchema },
  prompt: `You are a public safety expert for a disaster management agency. Your task is to provide clear and actionable safety advice for the public based on a specific ocean hazard.

Given the hazard type '{{{hazardType}}}' and severity '{{{severity}}}', generate a list of do's, a list of don'ts, and a single, concise public safety bulletin message. The advice should be practical for a general audience.

- dos: Provide 3-4 essential "Do's".
- donts: Provide 3-4 critical "Don'ts".
- bulletin: Write a single, urgent sentence that can be broadcasted as an alert.

Keep the language simple and direct.`,
});

const generateSafetyPrecautionsFlow = ai.defineFlow(
  {
    name: 'generateSafetyPrecautionsFlow',
    inputSchema: GenerateSafetyPrecautionsInputSchema,
    outputSchema: GenerateSafetyPrecautionsOutputSchema,
  },
  async input => {
    try {
        const { output } = await prompt(input);
        if (!output) throw new Error('AI produced no output');
        return output;
    } catch (error) {
        console.error('Error in generateSafetyPrecautionsFlow:', error);
        // Fallback precautions based on hazard type
        return {
            dos: ['Stay away from the coast', 'Listen to local authorities', 'Seek higher ground if necessary'],
            donts: ['Do not go near the water', 'Do not ignore official warnings', 'Do not attempt to travel through flooded areas'],
            bulletin: 'Public safety alert: Exercise extreme caution and follow local emergency guidance.'
        };
    }
  }
);
