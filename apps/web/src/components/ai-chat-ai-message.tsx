import { AnimatedMarkdown } from 'flowtoken';
import { Message, MessagePart } from '@quanta/web/contexts/ai-chat';
import { AiChatAction } from '@quanta/web/components/ai-chat-action';
import { AiChatSources } from '@quanta/web/components/ai-chat-sources';

interface AiChatAIMessageProps {
  message: Message;
  messageIndex: number;
}

export function AiChatAIMessage({
  message,
  messageIndex,
}: AiChatAIMessageProps) {
  return (
    <div className="px-3">
      <div className="prose-lg flex max-w-none flex-col gap-1">
        {message.parts.map((part: MessagePart, index: number) =>
          part.type === 'text' ? (
            <AnimatedMarkdown
              key={index}
              content={part.content}
              sep="word"
              animation={'fadeIn'}
              animationDuration="1.5s"
              animationTimingFunction="ease-in"
            />
          ) : part.type === 'action' ? (
            <AiChatAction key={index} title={part.title} status={part.status} />
          ) : (
            <></>
          ),
        )}
      </div>
      {message.sources.length > 0 && (
        <AiChatSources sources={message.sources} />
      )}
    </div>
  );
}
