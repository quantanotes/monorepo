import { useMemo } from 'react';
import { useShape } from '@electric-sql/react';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';

/**
 * Hook to fetch users and create a mapping from userIds to user objects
 */
export function useUsersMapForComments(userIds: string[]) {
  // Deduplicate user IDs
  const uniqueUserIds = useMemo(() => [...new Set(userIds)], [userIds]);

  // Return empty map if no user IDs are provided
  if (uniqueUserIds.length === 0) {
    return {};
  }

  // Fetch users from ElectricSQL with filter
  const usersShape = useShape({
    url: `${process.env.PUBLIC_APP_URL}/api/db/users`,
    params: {
      where: `"id" IN ('${uniqueUserIds.join("','")}')`,
    },
  });

  // Create a map of user ID to user object
  return useMemo(() => {
    if (usersShape.isLoading) return {};

    return usersShape.data.reduce(
      (acc, user) => {
        const camelUser = snakeToCamlObject(user);
        acc[camelUser.id] = camelUser;
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [usersShape.data, usersShape.isLoading]);
}
