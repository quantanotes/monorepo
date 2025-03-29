import { Button } from '@quanta/ui/button';
import { MessageSquare, Users } from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';

interface LeftPanelToggleProps {
  activeTab: 'ai-chat' | 'human-chat';
  onChange: (tab: 'ai-chat' | 'human-chat') => void;
}

export function LeftPanelToggle({ activeTab, onChange }: LeftPanelToggleProps) {
  return (
    <div className="flex h-10 w-full flex-none items-center justify-center gap-2">
      <Button
        variant="ghost"
        className={cn(
          'flex h-8 items-center gap-1',
          activeTab === 'ai-chat' ? 'text-foreground' : '',
        )}
        onClick={() => onChange('ai-chat')}
      >
        {activeTab === 'ai-chat' && <span className="text-foreground">•</span>}
        AI
      </Button>

      <Button
        variant="ghost"
        className={cn(
          'flex h-8 items-center gap-1',
          activeTab === 'human-chat' ? 'text-foreground' : '',
        )}
        onClick={() => onChange('human-chat')}
      >
        {activeTab === 'human-chat' && (
          <span className="text-foreground">•</span>
        )}
        Humans
      </Button>
    </div>
  );
}
