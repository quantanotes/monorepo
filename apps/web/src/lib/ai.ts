import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { streamText } from 'ai';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import type { RawMessage } from '@quanta/agent';

// import { createOpenAI } from '@ai-sdk/openai';
// const model = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })('o4-mini');

// import { createOpenAI } from '@ai-sdk/openai';
// const model = createOpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
// })('gemini-2.5-flash-preview-04-17');

import { createOpenAI } from '@ai-sdk/openai';
const model = createOpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
})('moonshotai/Kimi-K2-Instruct');

// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })(
//   // 'gemini-2.5-pro-exp-03-25',
// );

// import { createAnthropic } from '@ai-sdk/anthropic';
// const model = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(
//   'claude-3-7-sonnet-20250219',
// );

export const llmTextStreamFn = createServerFn({
  method: 'POST',
  response: 'raw',
})
  .validator(
    z.object({
      messages: z.custom<RawMessage[]>().optional(),
    }),
  )
  .handler(async ({ signal, data: { messages } }) => {
    await assertSessionFn();

    const { textStream } = streamText({
      model,
      abortSignal: signal,
      messages,
    });

    return new Response(textStream);
  });
