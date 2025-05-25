import { createContext, useContext, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Updater, useImmer } from 'use-immer';
import { streamToAsyncIterableStream } from '@quanta/utils/stream-to-async-iterable-stream';
import {
  agentClient,
  doc,
  AgentStep,
  Message,
  MessagePart,
  TextStreamFn,
} from '@quanta/agent';
import { llmTextStreamFn } from '@quanta/web/lib/ai';
import { getBaseEnvironment } from '@quanta/web/lib/agent/base-environment';

interface AiChatContextType {
  input: string;
  files: File[];
  messages: Message[];
  running: boolean;

  send: () => void;
  abort?: () => void;

  setInput: (value: string) => void;
  setFiles: (files: File[]) => void;
}

const AiChatContext = createContext<AiChatContextType>(undefined!);

export function AiChatProvider({ children }: React.PropsWithChildren) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useImmer<Message[]>([]);
  const [running, setRunning] = useState(false);
  const [abortController, setAbortController] = useState<AbortController>();
  const _llmTextStreamFn = useServerFn(llmTextStreamFn);
  const chatActions = getChatActions(setMessages);

  const textStreamFn: TextStreamFn = async (messages, signal) => {
    const abortController = new AbortController();
    signal.addEventListener('abort', () => abortController.abort());

    const response = await _llmTextStreamFn({ data: { messages }, signal });
    if (!response.ok) {
      throw new Error('Could not connect to AI.');
    }

    const rawStream = response.body?.pipeThrough(new TextDecoderStream())!;
    const stream = streamToAsyncIterableStream(rawStream);

    return { stream, abortController };
  };

  async function send() {
    if (running || input.trim().length === 0) {
      return;
    }

    const userMessage = {
      role: 'user',
      parts: [{ type: 'text', content: input }],
      sources: [],
    } as Message;
    const newMessages = [...messages, userMessage];
    const tools = [];
    const environment = getBaseEnvironment(null, chatActions, files, tools);
    const abortController = new AbortController();

    setInput('');
    setMessages(newMessages);
    setRunning(true);
    setAbortController(abortController);

    try {
      const agentStream = agentClient(
        environment,
        newMessages,
        textStreamFn,
        abortController,
      );

      appendMessage({ role: 'assistant', parts: [], sources: [] });

      for await (const part of agentStream) {
        appendMessagePart(part);
      }
    } finally {
      setRunning(false);
    }
  }

  function abort() {
    abortController?.abort();
  }

  const appendMessage = (message: Message) =>
    setMessages((messages) => {
      messages.push(message);
    });

  const appendMessagePart = (part: AgentStep) =>
    setMessages((messages: Message[]) => {
      const lastMessage = messages.at(-1)!;
      const lastPart = lastMessage.parts.at(-1);
      switch (part.type) {
        case 'text':
          if (lastPart?.type === 'text') {
            lastPart.content += part.content;
          } else {
            lastMessage.parts.push(part as MessagePart);
          }
          break;
        case 'action':
          lastMessage.parts.push(part as MessagePart);
        case 'observe':
          const index = lastMessage.parts.findIndex(
            (actionPart) => actionPart.id === part.id,
          );
          if (index !== -1) {
            lastMessage.parts[index] = {
              ...lastMessage.parts[index],
              status: part.status,
            };
          }
          break;
      }
    });

  return (
    <AiChatContext
      value={{
        input,
        files,
        messages,
        running,
        send,
        abort,
        setInput,
        setFiles,
      }}
    >
      {children}
    </AiChatContext>
  );
}

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (context === undefined) {
    throw new Error('useAiChat must be used within a AiChatProvider');
  }
  return context;
}

function getChatActions(setMessages: Updater<Message[]>) {
  function addObjectSource(object: any) {
    setMessages((messages) =>
      messages[messages.length - 1].sources.push({
        type: 'object',
        id: typeof object === 'string' ? object : (object.id as string),
      }),
    );
  }

  function addWebSource(source: any) {
    setMessages((messages) =>
      messages[messages.length - 1].sources.push({
        type: 'web',
        name: source.title,
        url: source.url,
        image: source.image,
      }),
    );
  }

  return {
    __doc__: `Chat UI actions for source management. Sources are visual indicators showing information origin.
You do not need to annotate any actions that call these functions as the user automatically sees them.
Do not tell the user "I am going to add sources" because they will already see it and it sounds stupid.
Add sources as soon as as you see them and recognise their relevancy to the chat, do not add them at the end, for maximum responsiveness.
Always use the add_web_source function to add web sources after a search query.`,

    add_object_source: doc(
      'chat.add_object_source',
      addObjectSource,
      `(object:string|{id:string}): void
Add object reference to chat
add_object_source("obj_123")`,
    ),

    add_web_source: doc(
      'chat.add_web_source',
      addWebSource,
      `(source: { title: string, url>: string, image?: string }): void
Add web link to chat - compatible with search results
add_web_source({ title: "Example", url: "https://example.com", image: "https://example.com/image.png" });
search_results = search('recent news');
add_web_source(search_results[0]); add_web_source(search_results[4]);`,
    ),
  };
}
