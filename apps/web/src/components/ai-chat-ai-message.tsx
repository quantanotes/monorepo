import { AnimatedMarkdown } from 'flowtoken/src';
import { Message } from '@quanta/agent';
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
      {message.sources.length > 0 && (
        <AiChatSources sources={message.sources} />
      )}

      <div className="prose flex max-w-none flex-col gap-1">
        {message.parts.map((part, index) =>
          part.type === 'text' ? (
            <AnimatedMarkdown
              key={index}
              content={part.content}
              customComponents={{
                code: ({ node, ...props }: any) => (
                  <code {...props}>{props.children}</code>
                ),
              }}
            />
          ) : part.type === 'action' ? (
            <AiChatAction
              key={index}
              title={part.title!}
              status={part.status!}
            />
          ) : (
            <></>
          ),
        )}
      </div>
    </div>
  );
}
