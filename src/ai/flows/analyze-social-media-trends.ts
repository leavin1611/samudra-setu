
'use server';
/**
 * @fileOverview Analyzes a collection of social media posts to identify trends, sentiment, and key topics.
 *
 * - analyzeSocialMediaTrends - A function that performs the analysis.
 * - AnalyzeSocialMediaTrendsInput - The input type for the analyzeSocialMediaTrends function.
 * - AnalyzeSocialMediaTrendsOutput - The return type for the analyzeSocialMediaTrends function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the shape of a single social media post
const PostSchema = z.object({
  id: z.number(),
  user_handle: z.string(),
  hazard_type: z.string(),
  location_name: z.string(),
  comments: z.string().optional(),
  likes: z.number(),
  hashtags: z.string().optional(),
  image_url: z.string(),
});

const AnalyzeSocialMediaTrendsInputSchema = z.object({
  posts: z.array(PostSchema),
});
export type AnalyzeSocialMediaTrendsInput = z.infer<typeof AnalyzeSocialMediaTrendsInputSchema>;

const AnalyzeSocialMediaTrendsOutputSchema = z.object({
  totalMentions: z.number().describe('The total number of social media posts analyzed.'),
  sentiment: z.object({
    positive: z.number().describe('The count of posts with a positive sentiment.'),
    negative: z.number().describe('The count of posts with a negative sentiment.'),
    neutral: z.number().describe('The count of posts with a neutral sentiment.'),
    dominant: z.enum(['positive', 'negative', 'neutral', 'mixed']).describe('The overall dominant sentiment.'),
  }),
  urgency: z.object({
    score: z.number().min(0).max(1).describe('A numerical score from 0 (no urgency) to 1 (maximum urgency).'),
    level: z.enum(['low', 'medium', 'high', 'critical']).describe('The classified urgency level.'),
    justification: z.string().describe('A brief justification for the assigned urgency level.'),
  }),
  keyTopics: z.array(z.string()).describe('A list of the top 5-7 most frequently discussed keywords or topics.'),
  topPosts: z.array(z.object({
    handle: z.string().describe('The user handle of the post author.'),
    text: z.string().describe('The content of the post.'),
    likes: z.number().describe('The number of likes the post received.'),
  })).describe('A list of the top 3-5 most influential posts, ranked by likes.'),
});
export type AnalyzeSocialMediaTrendsOutput = z.infer<typeof AnalyzeSocialMediaTrendsOutputSchema>;


export async function analyzeSocialMediaTrends(
  input: AnalyzeSocialMediaTrendsInput
): Promise<AnalyzeSocialMediaTrendsOutput> {
    const analyzeSocialMediaTrendsFlow = ai.defineFlow(
    {
        name: 'analyzeSocialMediaTrendsFlow',
        inputSchema: AnalyzeSocialMediaTrendsInputSchema,
        outputSchema: AnalyzeSocialMediaTrendsOutputSchema,
    },
    async ({ posts }) => {
        const allText = posts.map(p => `Post by @${p.user_handle} (${p.likes} likes): ${p.comments || ''} ${p.hashtags || ''}`).join('\n---\n');

        const prompt = ai.definePrompt({
            name: 'socialMediaTrendAnalysisPrompt',
            output: { schema: AnalyzeSocialMediaTrendsOutputSchema },
            prompt: `You are a social media analyst for a disaster management agency. Analyze the following batch of social media posts related to ocean hazards. Provide a comprehensive analysis of the trends, sentiment, and urgency.

Your task is to populate all fields in the provided JSON output schema based on the posts.

- totalMentions: Count all the posts.
- sentiment: Classify each post as positive, negative, or neutral. Count them and determine the dominant sentiment. If counts are very close, use 'mixed'.
- urgency: Evaluate the overall urgency based on the content. Look for keywords like 'warning', 'evacuation', 'struggling', 'severe', 'danger'. A high number of negative posts or mentions of specific, high-risk hazards (like 'tsunami warning') should increase the score. Provide a brief justification.
- keyTopics: Identify the most common themes or keywords. Include locations, hazard types, and other relevant terms. Provide the top 5-7.
- topPosts: Identify the top 3-5 posts with the most likes.

Here is the batch of social media posts to analyze:

{{{posts}}}`,
        });

        const { output } = await prompt({ posts: allText });
        return output!;
    }
    );

  return analyzeSocialMediaTrendsFlow(input);
}
