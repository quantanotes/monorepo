import { AiChatMessages } from '@quanta/web/components/ai-chat-messages';
import { AiChatInput } from '@quanta/web/components/ai-chat-input';
import { ScrollArea } from '@quanta/ui/scroll-area';

export function AiChat() {
  return (
    <div className="relative z-50 h-full">
      <div className="absolute inset-0 bottom-0 mb-2 pb-[56px]">
        <ScrollArea className="bg-background h-full rounded-lg">
          <AiChatMessages />
        </ScrollArea>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-50">
        <AiChatInput />
      </div>
    </div>
  );
}
