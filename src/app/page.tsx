
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
  const [requestedLanguage, setRequestedLanguage] = useState<string | undefined>("en");
  const { toast } = useToast();

  const handleTopicSubmit = async (values: TopicFormValues) => {
    setIsLoadingTopic(true);
    setArticles([]); // Clear previous articles
    setRequestedLanguage(values.language || "en");

    try {
      const fetchedArticles = await fetchNewsArticles({
        topic: values.topic,
        source: values.source || undefined,
        count: values.count,
        language: values.language || undefined,
      });

      if (fetchedArticles.length === 0) {
        toast({
          title: "No Articles Found",
          description: "Try a different topic, source, or broaden your search.",
          variant: "default",
        });
      }

      setArticles(
        fetchedArticles.map((article: FetchedArticle) => ({
          ...article,
          id: article.url + Date.now(), // Ensure unique ID if URL is repeated across fetches
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
    // Create a new array to map over to avoid issues with state updates during the loop
    const articlesToProcess = articles.filter(a => a.isLoadingSummary && !a.contextualSummary && !a.error);

    for (const article of articlesToProcess) {
        try {
          const summaryResult = await summarizeArticle({
            articleContent: `${article.title}\n\n${article.summary}`, // Use originalSummary here
            language: requestedLanguage,
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
  }, [articles, requestedLanguage]);


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
