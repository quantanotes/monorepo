import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { streamText } from 'ai';
import type { RawMessage } from '@quanta/agent';

import { createOpenAI } from '@ai-sdk/openai';
const model = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(
  'gpt-4o-mini',
);

// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })(
//   'gemini-2.5-flash-preview-04-17',
// );

export const llmTextStreamFn = createServerFn({
  method: 'POST',
  response: 'raw',
})
  .validator(
    z.object({
      messages: z.custom<RawMessage[]>(),
    }),
  )
  .handler(({ signal, data: { messages } }) => {
    const { textStream } = streamText({
      model,
      abortSignal: signal,
      messages,
    });

    return new Response(textStream);
  });
