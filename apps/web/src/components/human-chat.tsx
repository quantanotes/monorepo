import { HumanChatProvider } from '@quanta/web/contexts/human-chat';
import { HumanChatMessages } from '@quanta/web/components/human-chat-messages';
import { HumanChatInput } from '@quanta/web/components/human-chat-input';
import { ScrollArea } from '@quanta/ui/scroll-area';

export function HumanChat() {
  return (
    <HumanChatProvider>
      <div className="relative h-full">
        <ScrollArea className="h-full">
          <HumanChatMessages />
        </ScrollArea>

        <div className="absolute right-0 bottom-0 left-0 z-50 p-2">
          <HumanChatInput />
        </div>
      </div>
    </HumanChatProvider>
  );
}
