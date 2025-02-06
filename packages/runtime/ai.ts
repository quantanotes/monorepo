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

async function* agent_streaming(messages: BaseAIMessage[]) {
  const res = await client.ai.agent.$post({ json: { messages } });
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += value;
    let lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line);
      }
    }
  }
}

export default {
  chat_streaming,
  agent_streaming,
};
