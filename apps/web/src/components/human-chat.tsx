import { ScrollArea } from '@quanta/ui/scroll-area';
import { HumanChatProvider } from '@quanta/web/contexts/human-chat';
import { HumanChatMessages } from '@quanta/web/components/human-chat-messages';
import { HumanChatInput } from '@quanta/web/components/human-chat-input';

export function HumanChat() {
  return (
    <HumanChatProvider>
      <div className="relative h-full">
        <ScrollArea className="h-full">
          <HumanChatMessages />
        </ScrollArea>

        <div className="sticky right-0 bottom-4 left-0 z-10 px-4">
          <HumanChatInput />
        </div>
      </div>
    </HumanChatProvider>
  );
}
