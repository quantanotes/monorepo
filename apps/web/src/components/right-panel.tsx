import { useState } from 'react';
import { AiChat } from '@quanta/web/components/ai-chat';
import { HumanChat } from '@quanta/web/components/human-chat';
import { RightPanelToggle } from '@quanta/web/components/right-panel-toggle';
import { AiChatProvider } from '@quanta/web/contexts/ai-chat';
import { HumanChatProvider } from '@quanta/web/contexts/human-chat';

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('human');
  return (
    <AiChatProvider>
      <HumanChatProvider>
        <RightPanelToggle
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'ai' | 'human')}
        />

        {activeTab === 'ai' ? <AiChat /> : <HumanChat />}
      </HumanChatProvider>
    </AiChatProvider>
  );
}
