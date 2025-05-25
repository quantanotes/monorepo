import { Message, RawMessage } from './types';

export function messageToRawMessage(message: Message): RawMessage {
  return {
    role: message.role,
    content: message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.content)
      .join('\n'),
  };
}

export function messagesToRawMessages(messages: Message[]): RawMessage[] {
  return messages.map(messageToRawMessage);
}
