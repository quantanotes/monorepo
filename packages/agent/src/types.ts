export type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;

export interface AgentServerCallbacks {
  onText: (content: string) => void;
  onAct: (content: string, title: string) => void;
  onActObserve: (content: string, title: string) => Promise<string>;
  onFinish?: () => void;
}

export const agentStepTypes = ['text', 'action', 'observe'] as const;

export type AgentStepType =
  | (typeof agentStepTypes)[number]
  | AgentOutputStep['type'];

export interface AgentStep {
  id?: string;
  type: AgentStepType;
  content: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface AgentTextStep extends AgentStep {
  type: 'text';
}

export interface AgentActionStep extends AgentStep {
  id: string;
  type: 'action';
  title: string;
  observe?: boolean;
  status?: 'pending' | 'completed' | 'failed';
}

export interface AgentObserveStep extends AgentStep {
  id: string;
  type: 'observe';
  status?: 'pending' | 'completed' | 'failed';
}

export type AgentInputStep = AgentTextStep | AgentActionStep | AgentObserveStep;

export type AgentOutputStep = AgentTextStep | AgentActionStep;

export interface TextStream {
  stream: AsyncIterableStream<string>;
  abortController: AbortController;
}

export type TextStreamFn = (
  messages: RawMessage[],
  signal: AbortSignal,
) => Promise<TextStream>;

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  parts: MessagePart[];
  sources: Source[];
}

export interface MessagePart {
  id?: string;
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

export interface RawMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
