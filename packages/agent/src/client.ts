import { nanoid } from 'nanoid';
import { callbacksToAsyncIterator } from '@quanta/utils/callbacks-to-async-iterator';
import { messagesToRawMessages } from '@quanta/agent/utils';
import { docs } from '@quanta/agent/doc';
import { agent } from '@quanta/agent/agent';
import type {
  AgentActionStep,
  AgentStep,
  Message,
  TextStreamFn,
} from '@quanta/agent/types';
import type { Item } from '@quanta/types';

type AgentYielder = (step: AgentStep) => void;

const AsyncFunction = (async () => {}).constructor;

export function agentClient(
  environment: Record<string, any>,
  messages: Message[],
  items: Item[],
  textStreamFn: TextStreamFn,
  abortController: AbortController,
): AsyncGenerator<AgentStep, void, void> {
  const rawMessages = messagesToRawMessages(messages);

  const handleText = (yielder: AgentYielder) => (content: string) =>
    void yielder({
      type: 'text',
      content,
    });

  const handleAction =
    (yielder: AgentYielder) => (content: string, title: string) => {
      const id = nanoid(4);
      const action: AgentActionStep = {
        id,
        title,
        content,
        type: 'action',
        status: 'pending',
      };
      yielder(action);

      // Async so step execution is non blocking for the reader
      return (async () => {
        const fnBody = `with (this) {${action.content}}`;
        let result = '';

        if (process.env.NODE_ENV !== 'production') {
          console.log('agent executing:', action.content);
        }

        let status = 'completed';
        try {
          const evalResult = await AsyncFunction(fnBody).call(environment);
          result = JSON.stringify(evalResult);
        } catch (err: unknown) {
          result = err instanceof Error ? err.message : String(err);

          if (process.env.NODE_ENV !== 'production') {
            console.error('agent execution error:', err);
          }

          status = 'failed';
        }

        //@ts-ignore
        yielder({ ...action, type: 'observe', status });

        return result;
      })();
    };

  return callbacksToAsyncIterator((yielder, breaker) =>
    agent(
      docs(environment),
      rawMessages,
      items,
      {
        onText: handleText(yielder),
        onAct: handleAction(yielder),
        onActObserve: handleAction(yielder),
        onFinish: breaker,
      },
      textStreamFn,
      abortController.signal,
    ),
  );
}
