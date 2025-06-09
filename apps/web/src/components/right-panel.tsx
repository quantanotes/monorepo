import { useState } from 'react';
import { HumanChatProvider } from '@quanta/web/contexts/human-chat';
import { AiChat } from '@quanta/web/components/ai-chat';
import { AiChatHeader } from '@quanta/web/components/ai-chat-header';
import { HumanChat } from '@quanta/web/components/human-chat';
import { RightPanelToggle } from '@quanta/web/components/right-panel-toggle';

// TODO: refactor
export function RightPanel() {
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('ai');

  return (
    <HumanChatProvider>
      <div className="flex h-12 justify-between px-4 py-2">
        <RightPanelToggle
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'ai' | 'human')}
        />

        <div className="text-muted-foreground flex h-10 items-center gap-2">
          {activeTab === 'ai' ? <AiChatHeader /> : <></>}
        </div>
      </div>

      {activeTab === 'ai' ? <AiChat /> : <HumanChat />}
    </HumanChatProvider>
  );
}
