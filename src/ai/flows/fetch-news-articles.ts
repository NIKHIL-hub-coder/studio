// src/ai/flows/fetch-news-articles.ts
'use server';

/**
 * @fileOverview A news article fetching AI agent.
 *
 * - fetchNewsArticles - A function that handles the news article fetching process.
 * - FetchNewsArticlesInput - The input type for the fetchNewsArticles function.
 * - FetchNewsArticlesOutput - The return type for the fetchNewsArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchNewsArticlesInputSchema = z.object({
  topic: z.string().describe('The topic to fetch news articles for.'),
  source: z.string().optional().describe('The source to fetch news articles from.'),
  count: z.number().optional().default(3).describe('The number of news articles to fetch.'),
});
export type FetchNewsArticlesInput = z.infer<typeof FetchNewsArticlesInputSchema>;

const NewsArticleSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  url: z.string().describe('The URL of the news article.'), // Removed .url()
  summary: z.string().describe('A short summary of the news article.'),
});

const FetchNewsArticlesOutputSchema = z.array(NewsArticleSchema);
export type FetchNewsArticlesOutput = z.infer<typeof FetchNewsArticlesOutputSchema>;

export async function fetchNewsArticles(input: FetchNewsArticlesInput): Promise<FetchNewsArticlesOutput> {
  return fetchNewsArticlesFlow(input);
}

const fetchNewsArticlePrompt = ai.definePrompt({
  name: 'fetchNewsArticlePrompt',
  input: {
    schema: FetchNewsArticlesInputSchema,
  },
  output: {
    schema: FetchNewsArticlesOutputSchema,
  },
  prompt: `You are an AI news aggregator. Your task is to fetch news articles based on the topic provided by the user.

  Topic: {{{topic}}}

  Source: {{{source}}}

  Number of articles: {{{count}}}

  Return a JSON array of news articles, each with a title, url, and summary.
  Make sure the URL is a valid URL.
  Follow the schema for the output. If the article does not have a summary, create one.`,
});

const fetchNewsArticlesFlow = ai.defineFlow(
  {
    name: 'fetchNewsArticlesFlow',
    inputSchema: FetchNewsArticlesInputSchema,
    outputSchema: FetchNewsArticlesOutputSchema,
  },
  async input => {
    const {output} = await fetchNewsArticlePrompt(input);
    return output!;
  }
);

