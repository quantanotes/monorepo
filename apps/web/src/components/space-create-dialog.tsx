import { useCallback } from 'react';
import { toast } from 'sonner';
import { Input } from '@quanta/ui/input';
import { Button } from '@quanta/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@quanta/ui/dialog';
import { useCreateSpaceMutation } from '@quanta/web/lib/space-query';
import { createSpaceSchema } from '@quanta/web/lib/space';
import { useAppForm } from '@quanta/ui/form';

interface SpaceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpaceCreateDialog({
  open,
  onOpenChange,
}: SpaceCreateDialogProps) {
  const createSpace = useCreateSpaceMutation();

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: createSpaceSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createSpace.mutateAsync({ name: value.name });
        toast.success('Space created successfully');
        formApi.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error('Failed to create space');
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
        </DialogHeader>
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <form.AppField
              name="name"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="my-space"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    This will be your space's URL and display name.
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createSpace.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
