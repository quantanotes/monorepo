import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import Exa from 'exa-js';
import { doc } from '@quanta/agent';

const exa = new Exa(process.env.EXA_API_KEY);

export type SearchOptions = {
  category:
    | 'company'
    | 'research paper'
    | 'news'
    | 'pdf'
    | 'github'
    | 'tweet'
    | 'personal site'
    | 'linkedin profile'
    | 'financial report';
  numResults: number;
};

const searchFn = createServerFn()
  .validator(
    z.object({
      query: z.string(),
      options: z.any(),
    }),
  )
  .handler(async ({ data }) => {
    const { query, options } = data;
    const response = await exa.searchAndContents(query, {
      ...options,
      highlights: true,
      type: 'auto',
    });
    return response.results;
  });

export const search = doc(
  'search',
  (query: string, options?: Partial<SearchOptions>) =>
    searchFn({ data: { query, options } }),
  `(query:string, options?:  Partial<{ category?: 'company'|'paper'|'news'|'pdf'|'github'|'tweet'|'site'|'linkedin'|'finance', numResults?: number }>): Promise<result[]>
Web search with optional filters - always add sources to the chat after a search
You may save a search after observation by storing it in a variable (without const or let)
Use search over browser for general knowledge search
You must always add search results to the chat sources
search("AI papers", { category: "paper", numResults: 3 });
results = await search("donald trump", { category: "news", numResults: 5 });
results.forEach(result => chat.add_web_source(result));`,
);
