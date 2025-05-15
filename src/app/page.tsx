"use client";

import type { NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/app-layout";
import { TopicForm, type TopicFormValues } from "@/components/topic-form";
import { NewsFeed } from "@/components/news-feed";
import type { NewsArticleData, FetchedArticle } from "@/lib/types";
import { fetchNewsArticles } from "@/ai/flows/fetch-news-articles";
import { summarizeArticle } from "@/ai/flows/contextual-summarization";
import { useToast } from "@/hooks/use-toast";

const Home: NextPage = () => {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const { toast } = useToast();

  const handleTopicSubmit = async (values: TopicFormValues) => {
    setIsLoadingTopic(true);
    setArticles([]); // Clear previous articles

    try {
      const fetchedArticles = await fetchNewsArticles({
        topic: values.topic,
        source: values.source || undefined,
        count: values.count,
      });

      if (fetchedArticles.length === 0) {
        toast({
          title: "No Articles Found",
          description: "Try a different topic or source.",
        });
      }

      setArticles(
        fetchedArticles.map((article: FetchedArticle) => ({
          ...article,
          id: article.url, // Use URL as a unique ID
          isLoadingSummary: true,
        }))
      );
    } catch (error) {
      console.error("Error fetching news articles:", error);
      toast({
        title: "Error Fetching News",
        description: (error as Error).message || "Could not fetch articles.",
        variant: "destructive",
      });
      setArticles([]);
    } finally {
      setIsLoadingTopic(false);
    }
  };

  const processArticleSummaries = useCallback(async () => {
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      if (article.isLoadingSummary && !article.contextualSummary && !article.error) {
        try {
          const summaryResult = await summarizeArticle({
            articleContent: `${article.title}\n\n${article.originalSummary}`,
          });
          setArticles((prevArticles) =>
            prevArticles.map((prevArticle) =>
              prevArticle.id === article.id
                ? {
                    ...prevArticle,
                    contextualSummary: summaryResult.summary,
                    entities: summaryResult.entities,
                    furtherReadingSuggestion: summaryResult.suggestedContent,
                    isLoadingSummary: false,
                  }
                : prevArticle
            )
          );
        } catch (error) {
          console.error(`Error summarizing article ${article.id}:`, error);
          setArticles((prevArticles) =>
            prevArticles.map((prevArticle) =>
              prevArticle.id === article.id
                ? {
                    ...prevArticle,
                    isLoadingSummary: false,
                    error: `Failed to summarize: ${(error as Error).message}`,
                  }
                : prevArticle
            )
          );
        }
      }
    }
  }, [articles]);


  useEffect(() => {
    if (articles.some(a => a.isLoadingSummary && !a.error)) {
      processArticleSummaries();
    }
  }, [articles, processArticleSummaries]);


  const sidebar = <TopicForm onSubmit={handleTopicSubmit} isLoading={isLoadingTopic} />;

  return (
    <AppLayout sidebarContent={sidebar}>
      <NewsFeed articles={articles} isLoadingInitial={isLoadingTopic && articles.length === 0} />
    </AppLayout>
  );
};

export default Home;
