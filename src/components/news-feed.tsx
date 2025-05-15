"use client";

import type { NewsArticleData } from "@/lib/types";
import { NewsCard } from "./news-card";
import { Loader2, FileText } from "lucide-react";

interface NewsFeedProps {
  articles: NewsArticleData[];
  isLoadingInitial: boolean; // For the very first fetch triggered by form
}

export function NewsFeed({ articles, isLoadingInitial }: NewsFeedProps) {
  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Fetching news articles...</p>
      </div>
    );
  }

  if (articles.length === 0 && !isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg">No articles found.</p>
        <p>Try searching for a topic using the form in the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
