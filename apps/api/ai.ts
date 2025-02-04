import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { OpenAI } from 'openai';
import { BaseAIMessage } from '#/types';

const openai =  new OpenAI({
  apiKey: process.env.OPENAI_KEY!
})

export const ai_controller = new Hono()
  .post('/chat', async (c) => {
    const { messages } = await c.req.json<{ messages: BaseAIMessage[] }>();
    const llm_stream = await openai.chat.completions.create({
      messages: messages,
      model: 'o3-mini',
      stream: true,
    });
    return streamText(c, async (stream) => {
      stream.onAbort(llm_stream.controller.abort)
      for await (const chunk of llm_stream) {
        const text = chunk.choices[0]?.delta.content ?? '';
        stream.write(text);
      }
    });
  });
