import { GripVerticalIcon, PlusIcon } from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';
import { Button, buttonVariants } from '@quanta/ui/button';
import { DragHandleView } from './view';

export function DragHandle({ editor }) {
  return (
    <DragHandleView editor={editor}>
      <div className="flex h-full items-center">
        <Button
          className="text-muted-foreground size-6 rounded-sm"
          variant="ghost"
        >
          <PlusIcon className="size-4" />
        </Button>

        <div
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-muted-foreground size-6 cursor-grab rounded-sm',
          )}
        >
          <GripVerticalIcon className="size-4" />
        </div>
      </div>
    </DragHandleView>
  );
}
