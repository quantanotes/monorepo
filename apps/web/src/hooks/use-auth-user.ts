import { useQuery } from '@tanstack/react-query';
import { authUserQueryOptions } from '@quanta/web/lib/user';

export function useAuthUser() {
  const query = useQuery(authUserQueryOptions());
  return query.data;
}
