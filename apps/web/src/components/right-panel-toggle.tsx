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
    <div className="bg-muted flex items-center justify-center gap-0.5 rounded-full px-1 py-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex h-6 items-center gap-1 text-sm',
          activeTab === 'ai' && 'bg-accent text-foreground',
        )}
        onClick={() => onChange('ai')}
      >
        {activeTab === 'ai' && '• '}
        AI
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex h-6 items-center gap-1 text-sm',
          activeTab === 'human' && 'bg-accent text-foreground',
        )}
        onClick={() => onChange('human')}
      >
        {activeTab === 'human' && '• '}
        Humans
      </Button>
    </div>
  );
}
