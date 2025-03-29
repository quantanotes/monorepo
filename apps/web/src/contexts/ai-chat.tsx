import { createContext, useContext, useState, useCallback } from 'react';
import { doc, runAgentClient, type ServerMessage } from '@quanta/agent';
import { getBaseEnvironment } from '@quanta/web/lib/agent/base-environment';

export interface MessagePart {
  type: 'text' | 'action';
  content: string;
  title?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface Source {
  type: 'web' | 'object' | 'file';
  id?: string;
  url?: string;
  name?: string;
  image?: string;
}

export interface Message {
  role: string;
  parts: MessagePart[];
  sources: Source[];
}

interface AiChatContextType {
  value: string;
  setValue: (value: string) => void;
  messages: Message[];
  files: File[];
  setFiles: (files: File[]) => void;
  running: boolean;
  send: () => void;
  handleAbort: () => void;
  setActionStatus: (
    messageIndex: number,
    actionIndex: number,
    status: 'pending' | 'completed' | 'failed',
  ) => void;
}

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export function AiChatProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [abort, setAbort] = useState<null | (() => void)>(null);

  const addMessage = useCallback((role: string, parts: MessagePart[]) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        parts,
        sources: [],
      },
    ]);
  }, []);

  const handleChunk = useCallback(
    (
      reply: Message,
      chunk: {
        type: string;
        content: string;
        status?: 'pending' | 'completed' | 'failed';
      },
    ) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const replyIndex = newMessages.indexOf(reply);
        if (replyIndex === -1) return prev;

        const lastPart = reply.parts.at(-1);
        if (!lastPart || lastPart.type !== chunk.type) {
          if (chunk.type === 'action' || chunk.type === 'text') {
            newMessages[replyIndex].parts.push(chunk as MessagePart);
          }
        } else {
          lastPart.content += chunk.content;
          if (chunk.type === 'action' && chunk.status) {
            lastPart.status = chunk.status;
          }
        }
        return newMessages;
      });
    },
    [],
  );

  const getChatActions = useCallback((message: Message) => {
    return {
      __doc__: `
        Chat UI actions for source management.Sources are visual indicators showing information origin.
        You do not need to annotate any actions that call these functions as the user automatically sees them.
        Do not tell the user "I am going to add sources" because they will already see it and it sounds stupid.
        Add sources as soon as as you see them and recognise their relevancy to the chat, do not add them at the end, for maximum responsiveness.
        Always use the add_web_source function to add web sources after a search query.`,
      add_object_source: doc(
        'chat.add_object_source',
        (object: string | any) => {
          const id =
            typeof object === 'string' ? object : (object.id as string);
          setMessages((prev) => {
            const newMessages = [...prev];
            const messageIndex = newMessages.indexOf(message);
            if (messageIndex !== -1) {
              newMessages[messageIndex].sources.push({ type: 'object', id });
            }
            return newMessages;
          });
        },
        `(object:string|{id:string}): void
        Add object reference to chat
        add_object_source("obj_123")`,
      ),
      add_web_source: doc(
        'chat.add_web_source',
        (source: { title: string; url: string; image?: string }) => {
          console.log('this is running!');
          setMessages((prev) => {
            const newMessages = [...prev];
            const messageIndex = newMessages.indexOf(message);
            if (messageIndex !== -1) {
              newMessages[messageIndex].sources.push({
                type: 'web',
                name: source.title,
                url: source.url,
                image: source.image,
              });
            }
            return newMessages;
          });
        },
        `(source: { title: string, url>: string, image?: string }): void
        Add web link to chat - compatible with search results
        add_web_source({ title: "Example", url: "https://example.com", image: "https://example.com/image.png" });
        search_results = search('recent news');
        add_web_source(search_results[0]); add_web_source(search_results[4]);`,
      ),
    };
  }, []);

  const runAgent = useCallback(
    async (reply: Message) => {
      const tools = [];

      const abortFn = runAgentClient(
        getBaseEnvironment(null, getChatActions(reply), files, tools),
        convertToServerMessages(messages.slice(0, -1)),
        (chunk) => handleChunk(reply, chunk),
        () => {
          setRunning(false);
        },
      );
      setAbort(() => abortFn);
    },
    [files, messages, getChatActions, handleChunk],
  );

  const send = useCallback(() => {
    if (running || !value.trim()) {
      return;
    }
    setRunning(true);
    addMessage('user', [{ type: 'text', content: value }]);
    setValue('');
    addMessage('assistant', []);
    setMessages((prev) => {
      const reply = prev[prev.length - 1];
      if (reply) {
        runAgent(reply);
      }
      return prev;
    });
  }, [running, value, addMessage, runAgent]);

  const handleAbortCallback = useCallback(() => {
    if (abort) {
      abort();
      setAbort(null);
    }
  }, [abort]);

  const setActionStatus = useCallback(
    (
      messageIndex: number,
      actionIndex: number,
      status: 'pending' | 'completed' | 'failed',
    ) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const message = newMessages[messageIndex];
        if (!message) return prev;

        const action = message.parts[actionIndex];
        if (!action || action.type !== 'action') return prev;

        action.status = status;
        return newMessages;
      });
    },
    [],
  );

  return (
    <AiChatContext.Provider
      value={{
        value,
        setValue,
        messages,
        running,
        files,
        setFiles,
        send,
        handleAbort: handleAbortCallback,
        setActionStatus,
      }}
    >
      {children}
    </AiChatContext.Provider>
  );
}

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (context === undefined) {
    throw new Error('useAiChat must be used within a AiChatProvider');
  }
  return context;
}

function convertToServerMessages(messages: Message[]): ServerMessage[] {
  return messages.map((message) => {
    return {
      role: message.role,
      content: message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.content)
        .join('\n'),
    };
  });
}
