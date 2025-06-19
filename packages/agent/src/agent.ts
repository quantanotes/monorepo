import { buildAgentSteps, buildSystemPrompt } from './prompt';
import { parseStream } from './parser';
import type { AgentServerCallbacks, RawMessage, TextStreamFn } from './types';
import type { Item } from '@quanta/types';

export async function agent(
  environment: string,
  messages: RawMessage[],
  items: Item[],
  callbacks: AgentServerCallbacks,
  textStreamFn: TextStreamFn,
  abortSignal: AbortSignal,
) {
  try {
    const steps: any[] = [{ type: 'text', content: '' }];

    messages.unshift({
      role: 'system',
      content: buildSystemPrompt(environment, items),
    });

    messages.push({
      role: 'assistant',
      content: '',
    });

    function currentStep() {
      return steps[steps.length - 1];
    }

    outer: while (!abortSignal.aborted) {
      messages[messages.length - 1] = buildAgentSteps(steps);

      const { stream: textStream, abortController: textStreamAbortController } =
        await textStreamFn(messages, abortSignal);

      for await (const { state, text, transition, attributes } of parseStream(
        textStream,
      )) {
        if (transition) {
          const shouldReset = await handleParserStateTransition(
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
        }

        currentStep().content += text;

        if (currentStep().type === 'text') {
          callbacks.onText?.(text);
        }
      }

      if (currentStep().type === 'action') {
        callbacks.onAct?.(currentStep().content, currentStep().title);
      }

      break;
    }
  } catch (error) {
    throw error;
  } finally {
    callbacks.onFinish?.();
  }
}

async function handleParserStateTransition(
  state: string,
  attributes: Record<string, string | number | boolean>,
  currentStep: () => any,
  steps: any[],
  callbacks: AgentServerCallbacks,
  abortController: AbortController,
): Promise<boolean> {
  const { type, content, title } = currentStep();

  if (type === 'action' && state === 'observe') {
    abortController.abort();
    const observation = await callbacks.onActObserve(content, title);
    steps.push({ type: 'observe', content: observation });
    return true;
  } else if (type === 'action') {
    callbacks.onAct?.(currentStep().content, currentStep().title);
  }

  steps.push({ type: state, content: '', title: attributes.title });
  return false;
}
