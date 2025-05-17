import { AiChatMessages } from '@quanta/web/components/ai-chat-messages';
import { AiChatInput } from '@quanta/web/components/ai-chat-input';
import { ScrollArea } from '@quanta/ui/scroll-area';

export function AiChat() {
  return (
    <div className="relative z-50 h-full">
      <ScrollArea className="h-full">
        <AiChatMessages />
      </ScrollArea>

      <div className="absolute right-0 bottom-0 left-0 z-50 p-2">
        <AiChatInput />
      </div>
    </div>
  );
}
