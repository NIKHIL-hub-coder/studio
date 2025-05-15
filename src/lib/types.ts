export interface FetchedArticle {
  title: string;
  url: string;
  summary: string; // Original summary from fetchNewsArticles
}

export interface NewsArticleData extends FetchedArticle {
  id: string; // Unique identifier, can be URL
  contextualSummary?: string;
  entities?: string[];
  furtherReadingSuggestion?: string; // From summarizeArticle's suggestedContent
  isLoadingSummary: boolean;
  error?: string;
}
