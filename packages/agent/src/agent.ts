import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { buildAgentSteps, buildSystemPrompt } from './prompt';
import { type AgentServerCallbacks, type ServerMessage } from './types';
import { parseStream } from './parser';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function runAgent(
  environment: string,
  messages: ServerMessage[],
  callbacks: AgentServerCallbacks,
  signal: AbortSignal,
) {
  try {
    const steps: any[] = [{ type: 'text', content: '' }];

    messages.unshift({
      role: 'system',
      content: buildSystemPrompt(environment),
    });

    messages.push({
      role: 'assistant',
      content: '',
    });

    function currentStep() {
      return steps[steps.length - 1];
    }

    outer: while (!signal.aborted) {
      messages[messages.length - 1] = buildAgentSteps(steps);

      const { textStream, textStreamAbortController } = startTextStream(
        messages,
        signal,
      );

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
          );
          if (shouldReset) {
            textStreamAbortController.abort();
            continue outer;
          }
        }

        currentStep().content += text;

        if (currentStep().type === 'text') {
          callbacks.ontext?.(text);
        }
      }

      if (currentStep().type === 'action') {
        callbacks.onact?.(currentStep().content, currentStep().title);
      }

      break;
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    callbacks.onfinish?.();
  }
}

async function handleParserStateTransition(
  state: string,
  attributes: Record<string, string | number | boolean>,
  currentStep: () => any,
  steps: any[],
  callbacks: AgentServerCallbacks,
): Promise<boolean> {
  if (currentStep().type === 'action') {
    if (state === 'observe') {
      const observation = await callbacks.onactobserve(
        currentStep().content,
        currentStep().title,
      );
      steps.push({ type: 'observe', content: observation });
      return true;
    } else {
      callbacks.onact?.(currentStep().content, currentStep().title);
    }
  }
  steps.push({ type: state, content: '', title: attributes.title });
  return false;
}

function startTextStream(messages: ServerMessage[], signal: AbortSignal) {
  const textStreamAbortController = new AbortController();
  signal.addEventListener('abort', () => textStreamAbortController.abort());
  const { textStream } = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    abortSignal: textStreamAbortController.signal,
    messages,
  });
  return { textStream, textStreamAbortController };
}
