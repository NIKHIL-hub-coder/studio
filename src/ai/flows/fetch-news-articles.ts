
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
  source: z.string().optional().describe('The specific news source (e.g., nytimes.com).'),
  count: z.number().optional().default(3).describe('The number of news articles to fetch.'),
  language: z.string().optional().describe('The preferred language for the news articles (e.g., "en", "es", "fr"). Default is "en".'),
});
export type FetchNewsArticlesInput = z.infer<typeof FetchNewsArticlesInputSchema>;

const NewsArticleSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  url: z.string().describe('The URL of the news article.'),
  summary: z.string().describe('A short summary of the news article.'),
  imageUrl: z.string().optional().describe('A publicly accessible URL for a relevant image for the article. Use a placeholder if no suitable image is found.'),
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
  prompt: `You are an AI news aggregator. Your task is to fetch news articles based on the criteria provided by the user.

  Topic: {{{topic}}}
  {{#if source}}Source: {{{source}}}{{/if}}
  Number of articles: {{{count}}}
  Language: {{#if language}}{{{language}}}{{else}}en{{/if}}

  Return a JSON array of news articles. Each article object must include:
  1.  "title": The title of the news article.
  2.  "url": The direct URL to the news article. Ensure this is a valid, accessible URL.
  3.  "summary": A concise summary of the news article. If the original article does not have a summary, create one.
  4.  "imageUrl": A publicly accessible URL for a relevant image for the article.
      - **Strongly prioritize images hosted on the same domain as the article's 'url' if a high-quality, relevant image is available there.**
      - If a same-domain image isn't suitable or available, **you MUST use a generic placeholder image URL from \`https://placehold.co/\` (e.g., https://placehold.co/600x400.png). Do NOT use images from other third-party domains unless it's explicitly the article's primary image hosted on a well-known CDN by the publisher.**
      - If no suitable image directly related to the article content can be found after checking these options, ensure you use a generic placeholder image URL from \`https://placehold.co/\`. Do not invent image URLs or omit the imageUrl.

  Instructions:
  - If a specific source is provided, fetch articles only from that source.
  - If no specific source is provided, try to find articles from a variety of reputable news sources.
  - If you cannot find articles for the exact specified topic, try to find articles for a slightly broader but related topic.
  - If no relevant articles can be found even with a broader interpretation, return an empty array.
  - Prioritize relevance and recency of the articles.
  - Ensure all fields in the output schema are populated as per the descriptions above.
  - Adhere strictly to the output JSON schema.
  `,
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

