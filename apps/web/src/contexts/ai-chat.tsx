import { createContext, useContext, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useImmer } from 'use-immer';
import { streamToAsyncIterableStream } from '@quanta/utils/stream-to-async-iterable-stream';
import { agentClient, doc } from '@quanta/agent';
import { useDBLazy } from '@quanta/web/contexts/db';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { useSpace } from '@quanta/web/hooks/use-space';
import { ItemModelLocal } from '@quanta/web/lib/item-model-local';
import { TagModel } from '@quanta/web/lib/tag-model';
import { baseAgentEnvironment } from '@quanta/web/lib/agent/base-environment';
import { llmTextStreamFn } from '@quanta/web/lib/ai';
import type { Updater } from 'use-immer';
import type {
  AgentStep,
  Message,
  MessagePart,
  TextStreamFn,
} from '@quanta/agent';

interface Attachment {
  type: 'file' | 'item';
  file?: File;
  itemId?: string;
}

interface AiChatContextType {
  input: string;
  messages: Message[];
  attachments: Attachment[];
  running: boolean;

  send: () => void;
  abort?: () => void;
  resetChat: () => void;

  addAttachment: (type: 'file' | 'item', data: File | string) => void;
  removeAttachment: (index: number) => void;

  setInput: (value: string) => void;
}

const AiChatContext = createContext<AiChatContextType>(undefined!);

export function AiChatProvider({ children }: React.PropsWithChildren) {
  const db = useDBLazy();
  const space = useSpace();
  const user = useAuthUser();
  const itemModel = useItemModel();
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useImmer<Attachment[]>([]);
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

  const send = async () => {
    if (running || input.trim().length === 0) {
      return;
    }

    const abortController = new AbortController();

    const itemIds = attachments.map((a) => a.itemId).filter((a) => a);
    const items = await itemModel!.getItems(itemIds as string[]);
    const files = attachments.map((a) => a.file).filter((a) => a) as File[];
    const tools = [];

    const agentItemModel =
      space && new ItemModelLocal(db!, user?.id!, space.id);
    const agentTagModel = space && new TagModel(db?.orm!, space.id);

    const environment = baseAgentEnvironment(
      chatActions,
      files as File[],
      tools,
      //@ts-ignore
      agentItemModel,
      agentTagModel,
    );

    const newMessages = [
      ...messages,
      {
        role: 'user',
        parts: [{ type: 'text', content: input }],
        sources: [],
      },
    ] as Message[];

    setInput('');
    setRunning(true);
    setMessages(newMessages);
    setAbortController(abortController);

    try {
      const agentStream = agentClient(
        environment,
        newMessages,
        items,
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
  };

  const abort = () => {
    abortController?.abort();
    setRunning(false);
  };

  const resetChat = () => {
    setMessages([]);
    abort();
  };

  const addAttachment = (type: 'file' | 'item', data: File | string) =>
    setAttachments((attachments) => {
      switch (type) {
        case 'file':
          attachments.push({ type, file: data as File });
          break;
        case 'item':
          attachments.push({ type, itemId: data as string });
      }
      attachments.push();
    });

  const removeAttachment = (index: number) =>
    setAttachments((attachments) => {
      attachments.splice(index, 1);
    });

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
          break;
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
        messages,
        attachments,
        running,
        send,
        abort,
        resetChat,
        addAttachment,
        removeAttachment,
        setInput,
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
    setMessages((messages) => {
      messages[messages.length - 1].sources.push({
        type: 'object',
        id: typeof object === 'string' ? object : (object.id as string),
      });
    });
  }

  function addWebSource(source: any) {
    setMessages((messages) => {
      messages[messages.length - 1].sources.push({
        type: 'web',
        name: source.title,
        url: source.url,
        image: source.image,
      });
    });
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
