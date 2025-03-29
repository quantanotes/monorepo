import { HumanChatProvider } from '@quanta/web/contexts/human-chat';
import { HumanChatList } from '@quanta/web/components/human-chat-list';
import { HumanChatInput } from '@quanta/web/components/human-chat-input';
import { ScrollArea } from '@quanta/ui/scroll-area';

interface HumanChatProps {
  itemId?: string;
  spaceId?: string;
}

export function HumanChat({ itemId, spaceId }: HumanChatProps) {
  return (
    <HumanChatProvider itemId={itemId} spaceId={spaceId}>
      <div className="relative h-full">
        <div className="absolute inset-0 bottom-0 mb-2 pb-[56px]">
          <ScrollArea className="bg-background h-full rounded-lg">
            <HumanChatList />
          </ScrollArea>
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <HumanChatInput />
        </div>
      </div>
    </HumanChatProvider>
  );
}
