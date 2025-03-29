import { useState } from 'react';
import { AiChat } from '@quanta/web/components/ai-chat';
import { HumanChat } from '@quanta/web/components/human-chat';
import { LeftPanelToggle } from '@quanta/web/components/left-panel-toggle';

interface LeftPanelProps {
  itemId?: string;
  spaceId?: string;
}

export function LeftPanel({ itemId, spaceId }: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'ai-chat' | 'human-chat'>(
    'ai-chat',
  );

  return (
    <>
      <LeftPanelToggle
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as 'ai-chat' | 'human-chat')}
      />

      {activeTab === 'ai-chat' ? (
        <AiChat />
      ) : (
        <HumanChat itemId={itemId} spaceId={spaceId} />
      )}
    </>
  );
}
