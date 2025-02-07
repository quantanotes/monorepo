import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { BaseAIMessage, RenderableAIMessage } from '#/types';
import ai from '#/runtime/ai';

const chatContextKey = 'chat' as const;

export function getChatContext() {
  return getContext(chatContextKey) as ChatStore;
}

export function setChatContext(store: ChatStore) {
  setContext(chatContextKey, store);
}

export class ChatStore {
  messages = $state<RenderableAIMessage[]>([]);

  async send(input: string) {
    if (page.url.pathname !== '/shell') {
      goto('/shell');
    }
    this.messages.push({ role: 'user', content: input });
    this.messages.push({ role: 'assistant', content: '' });
    const stream = ai.agent_streaming(this.#to_sendable_messages());
    for await (const chunk of stream) {
      switch (chunk.type) {
        case 'text':
          this.messages[this.messages.length - 1].content += chunk.content;
          break;
        case 'render':
          this.#pop_last_empty_message();
          this.messages.push({ role: 'render', content: chunk.content });
          this.messages.push({ role: 'assistant', content: '' });
          break;
        default:
          break;
      }
    }
    this.#pop_last_empty_message();
  }

  append_island(code: string) {
    if (page.url.pathname !== '/shell') {
      goto('/shell');
    }
    this.messages.push({ role: 'render', content: code });
  }

  #pop_last_empty_message() {
    if (this.messages.at(-1)?.content.length === 0) {
      this.messages.pop();
    }
  }

  #to_sendable_messages() {
    return this.messages
      .filter((msg) => msg.role !== 'render' && msg.role !== 'action')
      .reduce<BaseAIMessage[]>((acc, msg) => {
        const last_message = acc[acc.length - 1];
        if (
          last_message &&
          last_message.role === 'assistant' &&
          msg.role === 'assistant'
        ) {
          last_message.content += '\n' + msg.content;
        } else {
          acc.push({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          });
        }

        return acc;
      }, []);
  }
}
