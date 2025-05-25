import { AnimatedMarkdown } from 'flowtoken';
import { Message } from '@quanta/agent';

interface AiChatUserMessageProps {
  message: Message;
}

export function AiChatUserMessage({ message }: AiChatUserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="bg-card max-w-lg rounded-md px-3">
        <div className="prose-lg">
          {message.parts.map(
            (part, index) =>
              part.type === 'text' && (
                <AnimatedMarkdown key={index} content={part.content} />
              ),
          )}
        </div>
      </div>
    </div>
  );
}
