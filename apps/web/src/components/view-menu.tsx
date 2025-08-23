import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@quanta/ui/select';

interface ViewMenuProps {
  views: string[];
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ViewMenu({ views, currentView, onViewChange }: ViewMenuProps) {
  return (
    <Select onValueChange={onViewChange} value={currentView}>
      <SelectTrigger
        size="sm"
        className="hover:bg-accent! dark:hover:bg-accent/50! h-7! border-0 bg-transparent! p-1.5! shadow-none!"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {views.map((view) => (
          <SelectItem key={view} value={view}>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
