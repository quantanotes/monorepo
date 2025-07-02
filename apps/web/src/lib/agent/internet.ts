import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import Exa from 'exa-js';
import { doc } from '@quanta/agent';

const searchFn = createServerFn()
  .validator(
    z.object({
      query: z.string(),
      options: z.any(),
    }),
  )
  .handler(async ({ data }) => {
    const { query, options } = data;
    const { summary } = options;
    const exa = new Exa(process.env.EXA_API_KEY);
    const response = await exa.searchAndContents(query, {
      ...options,
      summary: summary ? { query: summary } : true,
      type: 'auto',
    });
    return response.results;
  });

export const internet = {
  __doc__: 'A generic interface for scraping data from the internet.',

  search: doc(
    'internet.search',
    (query: string, options?: Partial<any>) =>
      searchFn({ data: { query, options } }),
    `(query:string, options?:  Partial<{
  category?: 'company'|'paper'|'news'|'pdf'|'github'|'tweet'|'site'|'linkedin'|'finance',
  includeDomains?: string[],
  numResults?: number,
  summary?: string,
}>): Promise<result[]>
Web search with optional filters - always add sources to the chat after a search
You may save a search after observation by storing it in a variable (without const or let)
Use search over browser for general knowledge search
You should always add search results to the chat sources
The \`summary\` parameter is the LLM query that allows you to extract the exact information from each web page
Keep summary empty for a generic summary
Use include domains if you want to search specific websites
search("AI papers", { category: "paper", numResults: 3 });
results = await internet.search("donald trump", { category: "news", numResults: 5 });
results.forEach(result => chat.add_web_source(result));`,
  ),
};
