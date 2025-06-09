import { useAiChat } from '@quanta/web/contexts/ai-chat';
import { AiChatAIMessage } from '@quanta/web/components/ai-chat-ai-message';
import { AiChatUserMessage } from '@quanta/web/components/ai-chat-user-message';

export function AiChatMessages() {
  const { messages } = useAiChat();
  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message, index) => (
        <div key={index}>
          {message.role === 'user' ? (
            <AiChatUserMessage message={message} />
          ) : (
            <AiChatAIMessage message={message} messageIndex={index} />
          )}
        </div>
      ))}
      <div className="h-[768px]" />
    </div>
  );
}
