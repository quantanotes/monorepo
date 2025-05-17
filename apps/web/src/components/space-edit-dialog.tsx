import { useState } from 'react';
import { Button } from '@quanta/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@quanta/ui/dialog';
import { useDeleteSpaceMutation } from '@quanta/web/lib/space-query';
import { toast } from 'sonner';

interface SpaceEditDialogProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpaceEditDialog({
  spaceId,
  open,
  onOpenChange,
}: SpaceEditDialogProps) {
  const deleteSpace = useDeleteSpaceMutation();

  const handleDelete = async () => {
    try {
      await deleteSpace.mutateAsync({ id: spaceId });
      toast.success('Space deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete space');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Space Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Danger Zone</h3>
            <p className="text-muted-foreground text-sm">
              Once you delete a space, there is no going back.
            </p>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteSpace.isPending}
              className="mt-4"
            >
              Delete Space
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
