import { buildAgentSteps, buildSystemPrompt } from '@quanta/agent/prompt';
import { parseStream } from '@quanta/agent/parser';
import type {
  AgentServerCallbacks,
  RawMessage,
  TextStreamFn,
} from '@quanta/agent/types';
import type { Item } from '@quanta/types';

export async function agent(
  environment: string,
  messages: RawMessage[],
  items: Item[],
  callbacks: AgentServerCallbacks,
  textStreamFn: TextStreamFn,
  abortSignal: AbortSignal,
) {
  if (abortSignal.aborted) {
    callbacks.onFinish?.();
    return;
  }

  const steps: any[] = [];
  const currentStep = () => steps[steps.length - 1];

  messages.unshift({
    role: 'system',
    content: buildSystemPrompt(environment, items),
  });

  messages.push({
    role: 'assistant',
    content: '',
  });

  try {
    outer: while (!abortSignal.aborted) {
      steps.push({ type: 'text', content: '' });
      messages[messages.length - 1] = buildAgentSteps(steps);

      const { stream: textStream, abortController: textStreamAbortController } =
        await textStreamFn(messages);

      abortSignal.addEventListener('abort', () =>
        textStreamAbortController.abort(),
      );

      for await (const chunk of parseStream(textStream)) {
        switch (chunk.type) {
          case 'text':
            const { text } = chunk;

            currentStep().content += text;

            if (currentStep().type === 'text') {
              callbacks.onText?.(text);
            }

            break;
          case 'transition':
            const { state, attributes } = chunk;

            const shouldReset = await handleTransition(
              state,
              attributes,
              currentStep,
              steps,
              callbacks,
              textStreamAbortController,
            );

            if (shouldReset) {
              continue outer;
            }

            break;
        }
      }

      if (currentStep().type === 'action') {
        callbacks.onAct?.(currentStep().content, currentStep().title);
      }

      break;
    }
  } finally {
    callbacks.onFinish?.();
  }
}

async function handleTransition(
  state: string,
  attributes: Record<string, string | number | boolean>,
  currentStep: () => any,
  steps: any[],
  callbacks: AgentServerCallbacks,
  textStreamAbortController: AbortController,
) {
  const { type, content, title } = currentStep();

  if (type === 'action' && state === 'observe') {
    textStreamAbortController.abort();
    const observation = await callbacks.onActObserve(content, title);
    steps.push({ type: 'observe', content: observation });
    return true;
  } else if (type === 'action') {
    callbacks.onAct?.(currentStep().content, currentStep().title);
  }

  steps.push({ type: state, content: '', title: attributes.title });

  return false;
}
