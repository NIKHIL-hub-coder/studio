'use server';

/**
 * @fileOverview A flow that suggests related content or further reading based on a summarized news article.
 *
 * - suggestRelatedContent - A function that handles the suggestion of related content.
 * - SuggestRelatedContentInput - The input type for the suggestRelatedContent function.
 * - SuggestRelatedContentOutput - The return type for the suggestRelatedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedContentInputSchema = z.object({
  articleSummary: z
    .string()
    .describe('The summarized content of the news article.'),
});
export type SuggestRelatedContentInput = z.infer<typeof SuggestRelatedContentInputSchema>;

const SuggestRelatedContentOutputSchema = z.object({
  relatedContentSuggestions: z
    .array(z.string())
    .describe('A list of suggested related content or further reading materials.'),
});
export type SuggestRelatedContentOutput = z.infer<typeof SuggestRelatedContentOutputSchema>;

export async function suggestRelatedContent(
  input: SuggestRelatedContentInput
): Promise<SuggestRelatedContentOutput> {
  return suggestRelatedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedContentPrompt',
  input: {schema: SuggestRelatedContentInputSchema},
  output: {schema: SuggestRelatedContentOutputSchema},
  prompt: `Based on the following news article summary, suggest related content or further reading materials. Please provide a list of suggestions.

Article Summary: {{{articleSummary}}}

Suggestions:`,
});

const suggestRelatedContentFlow = ai.defineFlow(
  {
    name: 'suggestRelatedContentFlow',
    inputSchema: SuggestRelatedContentInputSchema,
    outputSchema: SuggestRelatedContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
