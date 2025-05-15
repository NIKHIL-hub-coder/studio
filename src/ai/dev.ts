import { config } from 'dotenv';
config();

import '@/ai/flows/contextual-summarization.ts';
import '@/ai/flows/fetch-news-articles.ts';
import '@/ai/flows/suggest-related-content.ts';