"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { NewsArticleData } from "@/lib/types";
import { ExternalLink, Tags, Lightbulb, AlertTriangle, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface NewsCardProps {
  article: NewsArticleData;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <Image
          src={`https://placehold.co/600x300.png?random=${article.id}`}
          alt={article.title}
          width={600}
          height={300}
          className="rounded-t-lg object-cover w-full aspect-[2/1]"
          data-ai-hint="news article"
        />
        <CardTitle className="mt-4 text-xl leading-tight">
          {article.title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Source: {new URL(article.url).hostname}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {article.isLoadingSummary && !article.contextualSummary && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Summarizing...</p>
          </div>
        )}
        {article.error && (
           <div className="flex items-center text-destructive p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p className="text-sm">{article.error}</p>
          </div>
        )}
        {article.contextualSummary && (
          <div>
            <h3 className="font-semibold text-md mb-1">Summary:</h3>
            <ScrollArea className="h-32">
              <p className="text-sm text-foreground/90">{article.contextualSummary}</p>
            </ScrollArea>
          </div>
        )}
        {article.entities && article.entities.length > 0 && (
          <div>
            <h3 className="font-semibold text-md mb-1 flex items-center">
              <Tags className="h-4 w-4 mr-2 text-primary" />
              Key Entities:
            </h3>
            <div className="flex flex-wrap gap-1">
              {article.entities.map((entity, index) => (
                <Badge key={index} variant="secondary">
                  {entity}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {article.furtherReadingSuggestion && (
           <div>
            <h3 className="font-semibold text-md mb-1 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-primary" />
              Further Reading:
            </h3>
            <p className="text-sm text-foreground/90">{article.furtherReadingSuggestion}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Full Article
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
