import { Button } from '@quanta/ui/button';
import { cn } from '@quanta/ui/utils/css';

interface RightPanelToggleProps {
  activeTab: 'ai' | 'human';
  onChange: (tab: 'ai' | 'human') => void;
}

export function RightPanelToggle({
  activeTab,
  onChange,
}: RightPanelToggleProps) {
  return (
    <div className="flex h-10 w-full flex-none items-center justify-center gap-2">
      <Button
        variant="ghost"
        className={cn(
          'flex h-8 items-center gap-1',
          activeTab === 'ai' ? 'bg-accent text-foreground' : '',
        )}
        onClick={() => onChange('ai')}
      >
        {activeTab === 'ai' && '• '}
        AI
      </Button>

      <Button
        variant="ghost"
        className={cn(
          'flex h-8 items-center gap-1',
          activeTab === 'human' ? 'bg-accent text-foreground' : '',
        )}
        onClick={() => onChange('human')}
      >
        {activeTab === 'human' && '• '}
        Humans
      </Button>
    </div>
  );
}
