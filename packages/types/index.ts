export interface BaseAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface RenderableAIMessage {
  role: 'user' | 'assistant' | 'system' | 'render' | 'action';
  content: string;
}
