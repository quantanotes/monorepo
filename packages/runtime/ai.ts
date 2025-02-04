import { hc } from 'hono/client';
import type { App } from '@/api';
import type { BaseAIMessage } from '#/types';

const client = hc<App>('http://localhost:4000');

async function* chat_streaming(messages: BaseAIMessage[]) {
  const res = await client.ai.chat.$post({ json: { messages } });
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    yield value;
  }
}

export default {
  chat_streaming,
};
