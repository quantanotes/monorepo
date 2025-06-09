import { AnimatedMarkdown } from 'flowtoken/src';
import { Message } from '@quanta/agent';

interface AiChatUserMessageProps {
  message: Message;
}

export function AiChatUserMessage({ message }: AiChatUserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="bg-card rounded-2xl px-4">
        <div className="prose-lg">
          {message.parts.map(
            (part, index) =>
              part.type === 'text' && (
                <AnimatedMarkdown
                  animationDuration="0.3"
                  key={index}
                  content={part.content}
                />
              ),
          )}
        </div>
      </div>
    </div>
  );
}
