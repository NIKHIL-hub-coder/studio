
'use server';
/**
 * @fileOverview Summarizes news articles focusing on key events and entities, filtering out irrelevant information.
 *
 * - summarizeArticle - A function that summarizes a news article.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the news article to summarize (typically title + original summary).'),
  language: z.string().optional().describe('The preferred language for the summary (e.g., "en", "es"). If not provided, summarize in the original language of the article content or English as a fallback.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the news article focusing on key events and entities.'),
  entities: z.array(z.string()).describe('List of key entities mentioned in the article.'),
  suggestedContent: z.string().describe('Suggestions for related content or further reading.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `Summarize the following news article content, focusing on key events and entities.
Filter out any irrelevant information.
Provide suggestions for related content or further reading.
Please provide the summary and suggestions in {{#if language}}{{{language}}}{{else}}the original language of the article content (or English if the original language is ambiguous from the content provided){{/if}}.

Article Content (Title and Original Summary):
{{{articleContent}}}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeArticlePrompt(input);
    return output!;
  }
);
