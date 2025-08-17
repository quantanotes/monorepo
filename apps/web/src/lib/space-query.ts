import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSpacesFn,
  createSpaceFn,
  deleteSpaceFn,
} from '@quanta/web/lib/space-fns';

export function spaceQueryOptions() {
  return {
    queryKey: ['spaces'],
    queryFn: getAllSpacesFn,
  };
}

export function useCreateSpaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      await createSpaceFn({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}

export function useDeleteSpaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }) => {
      await deleteSpaceFn({ data });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}
