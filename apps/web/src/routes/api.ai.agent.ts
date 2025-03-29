import {
  defineEventHandler,
  defineWebSocket,
} from '@tanstack/react-start/server';
import { runAgent, ServerMessage } from '@quanta/agent';
// import { getSessionFromHeaders } from '@quanta/web/lib/auth';

// This file is cosplaying as a file based route, but it's routed in app.config.ts

interface WebSocketContext {
  started: boolean;
  observe: ((message: unknown) => void) | null;
  abort: AbortController;
}

interface AgentRequest {
  messages: ServerMessage[];
  environment: string;
}

export default defineEventHandler({
  handler() {},
  websocket: defineWebSocket({
    upgrade() {},

    open(peer) {
      peer.context.started = false;
      peer.context.observe = null;
      peer.context.abort = new AbortController();
    },

    message(peer, message) {
      if (!peer.context.started) {
        peer.context.started = true;

        const request = message.json<AgentRequest>();
        const messages = request.messages || [];
        const environment = request.environment || 'empty environment';

        runAgent(
          environment,
          messages,

          {
            ontext(content) {
              peer.send({ type: 'text', content });
            },

            onact(content, title) {
              peer.send({
                type: 'action',
                title,
                content,
                observe: false,
              });
            },

            onactobserve(content, title) {
              peer.send({
                type: 'action',
                title,
                content,
                observe: true,
              });
              return new Promise((resolve) => (peer.context.observe = resolve));
            },

            onfinish() {
              peer.close();
            },
          },

          peer.context.abort.signal,
        );
      } else if (peer.context.observe) {
        peer.context.observe(message);
        peer.context.observe = null;
      }
    },

    close(peer) {
      if (peer.context.abort) {
        peer.context.abort.abort();
      }
    },

    error(peer, error) {
      if (peer.context.abort) {
        peer.context.abort.abort();
      }
      console.error('AI agent server error:', error);
    },
  }),
});
