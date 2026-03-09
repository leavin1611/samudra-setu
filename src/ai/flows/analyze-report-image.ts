'use server';

/**
 * @fileOverview Analyzes an image of a potential ocean hazard to automatically populate a report.
 *
 * - analyzeReportImage - A function that analyzes an image and suggests report details.
 * - AnalyzeReportImageInput - The input type for the analyzeReportImage function.
 * - AnalyzeReportImageOutput - The return type for the analyzeReportImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeReportImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential ocean hazard, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeReportImageInput = z.infer<typeof AnalyzeReportImageInputSchema>;


const AnalyzeReportImageOutputSchema = z.object({
  hazardType: z
    .enum(['tsunami', 'storm', 'waves', 'currents', 'flooding', 'erosion', 'other'])
    .describe('The type of hazard identified in the image.'),
  severity: z
    .enum(['low', 'medium', 'high', 'extreme'])
    .describe('The estimated severity level of the hazard.'),
  description: z
    .string()
    .describe('A detailed description of the hazard observed in the image.'),
});
export type AnalyzeReportImageOutput = z.infer<typeof AnalyzeReportImageOutputSchema>;

export async function analyzeReportImage(
  input: AnalyzeReportImageInput
): Promise<AnalyzeReportImageOutput> {
  return analyzeReportImageFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzeReportImagePrompt',
    input: { schema: AnalyzeReportImageInputSchema },
    output: { schema: AnalyzeReportImageOutputSchema },
    prompt: `You are an expert in oceanography and disaster management. Analyze the provided image of a coastal or ocean area.

Based on the image, identify the most likely hazard, estimate its severity, and write a concise, factual description.

- hazardType: Classify the hazard into one of the following categories: 'tsunami', 'storm', 'waves', 'currents', 'flooding', 'erosion', 'other'.
- severity: Estimate the severity as 'low', 'medium', 'high', or 'extreme'. Consider the potential impact on people and property.
- description: Describe what you see in the image that justifies your classification and severity assessment. Be specific. For example, "Large waves are crashing over the sea wall, causing localized flooding on the coastal road."

Image to analyze:
{{media url=photoDataUri}}`,
});


const analyzeReportImageFlow = ai.defineFlow(
  {
    name: 'analyzeReportImageFlow',
    inputSchema: AnalyzeReportImageInputSchema,
    outputSchema: AnalyzeReportImageOutputSchema,
  },
  async input => {
    try {
        const { output } = await prompt(input);
        if (!output) throw new Error('AI produced no output');
        return output;
    } catch (error) {
        console.error('Error in analyzeReportImageFlow:', error);
        // Fallback for demo
        return {
            hazardType: 'other',
            severity: 'medium',
            description: 'AI Image Analysis is currently unavailable. Please provide a manual description of the observed hazard.'
        };
    }
  }
);
