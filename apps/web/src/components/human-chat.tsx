import { HumanChatProvider } from '@quanta/web/contexts/human-chat';
import { HumanChatMessages } from '@quanta/web/components/human-chat-messages';
import { HumanChatInput } from '@quanta/web/components/human-chat-input';
import { ScrollArea } from '@quanta/ui/scroll-area';

export function HumanChat() {
  return (
    <HumanChatProvider>
      <div className="relative h-full">
        <div className="absolute inset-0 bottom-0 mb-2 pb-[56px]">
          <ScrollArea className="bg-background h-full rounded-lg">
            <HumanChatMessages />
          </ScrollArea>
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <HumanChatInput />
        </div>
      </div>
    </HumanChatProvider>
  );
}
