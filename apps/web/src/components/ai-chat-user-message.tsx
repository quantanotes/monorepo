import { Message } from '@quanta/web/contexts/ai-chat';
import { AnimatedMarkdown } from 'flowtoken';

interface AiChatUserMessageProps {
  message: Message;
}

export function AiChatUserMessage({ message }: AiChatUserMessageProps) {
  return (
    <div className="px-3">
      <div className="themed-prose prose-xl! max-w-none">
        {message.parts.map(
          (part, index) =>
            part.type === 'text' && (
              <AnimatedMarkdown key={index} content={part.content} />
            ),
        )}
      </div>
    </div>
  );
}
