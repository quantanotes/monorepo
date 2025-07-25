import { useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@quanta/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@quanta/ui/dialog';
import { Input } from '@quanta/ui/input';
import { useAppForm } from '@quanta/ui/form';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { useUpdateUsername } from '@quanta/web/hooks/use-update-username';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'Username can only contain letters, numbers and hyphens',
    ),
});

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSettingsDialog({
  open,
  onOpenChange,
}: ProfileSettingsDialogProps) {
  const user = useAuthUser();
  const { mutate: updateUsername, isPending } = useUpdateUsername();

  const form = useAppForm({
    defaultValues: {
      username: user?.username || '',
    },
    validators: {
      onChange: profileFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateUsername({ username: value.username });
        toast.success('Username updated successfully');
        formApi.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error('Failed to update username');
        console.error(error);
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
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>
        <form.AppForm>
          <form onSubmit={handleSubmit} className="space-y-4">
            <form.AppField
              name="username"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Username</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="Enter your username"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
