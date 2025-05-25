import { nanoid } from 'nanoid';
import { callbacksToAsyncIterator } from '@quanta/utils/callbacks-to-async-iterator';
import { AgentActionStep, AgentStep, Message, TextStreamFn } from './types';
import { messagesToRawMessages } from './utils';
import { docs } from './doc';
import { agent } from './agent';

type AgentYielder = (step: AgentStep) => void;

const AsyncFunction = (async () => {}).constructor;

export function agentClient(
  environment: Record<string, any>,
  messages: Message[],
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
          console.log('executing', action.content);
        }

        try {
          const evalResult = await AsyncFunction(fnBody).call(environment);
          result = JSON.stringify(evalResult);
          action.status = 'completed';
        } catch (err: unknown) {
          result = err instanceof Error ? err.message : String(err);
          action.status = 'failed';
        }

        yielder({ ...action, type: 'observe' });

        return result;
      })();
    };

  return callbacksToAsyncIterator((yielder, breaker) =>
    agent(
      docs(environment),
      rawMessages,
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
