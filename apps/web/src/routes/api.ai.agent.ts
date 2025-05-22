import {
  createError,
  defineEventHandler,
  defineWebSocket,
} from '@tanstack/react-start/server';
import { runAgent, ServerMessage } from '@quanta/agent';
import { auth } from '@quanta/auth/server';

// This file is cosplaying as a file based route, but it's routed in server.ts

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
  handler() {
    throw createError({
      statusCode: 426,
      statusMessage: 'Upgrade Required',
    });
  },

  websocket: defineWebSocket({
    async upgrade(request) {
      console.log('WE ARE GETTING WEB SOCKET REQUEST', request);
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user) {
        throw new Response('Unauthorized', { status: 401 });
      }
    },

    open(peer) {
      console.log('WEBSOCKET CONN OPENED');
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
