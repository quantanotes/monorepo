import { useParams } from '@tanstack/react-router';

export function useSpace() {
  const params = useParams({ from: '/s/$spaceId', shouldThrow: false });
  return params ? { id: params.spaceId } : null;
}
