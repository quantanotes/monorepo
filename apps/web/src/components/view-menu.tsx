import { ChevronDown } from 'lucide-react';
import { Button } from '@quanta/ui/button';
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
      <SelectTrigger>
        <SelectValue placeholder="View" />
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
