export interface BaseAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
