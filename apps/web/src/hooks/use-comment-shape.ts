import { useMemo } from 'react';
import { useShape } from '@electric-sql/react';
import { useServerSession } from '@quanta/web/hooks/useServerSession';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { useUsersMapForComments } from './use-users-map';
import { HumanChatComment } from '@quanta/web/contexts/human-chat';

/**
 * Custom hook to fetch and format comments for an item
 */
export function useItemCommentShape(itemId: string) {
  const { user } = useServerSession();

  // Fetch comments from ElectricSQL
  const commentsShape = useShape({
    url: `${process.env.PUBLIC_APP_URL}/api/db/comments`,
    params: {
      itemId,
    },
  });

  // Get users map for populating user details
  const usersMap = useUsersMapForComments(
    commentsShape.data.map((comment) => comment.user_id),
  );

  // Transform comments to the format expected by HumanChatContext
  return useMemo(() => {
    if (commentsShape.isLoading) return [];

    return commentsShape.data.map((comment) => {
      const user = usersMap[comment.user_id] || {
        name: 'Unknown User',
        image: undefined,
      };

      const camelComment = snakeToCamlObject(comment);

      // Format as HumanChatComment
      return {
        id: camelComment.id,
        content: camelComment.content,
        userId: camelComment.userId,
        userName: user.name || 'Unknown User',
        userAvatar: user.image,
        itemId: camelComment.itemId,
        spaceId: camelComment.spaceId,
        createdAt: camelComment.createdAt,
        updatedAt: camelComment.updatedAt,
      } as HumanChatComment;
    });
  }, [commentsShape.data, commentsShape.isLoading, usersMap]);
}

/**
 * Custom hook to fetch and format comments for a space
 */
export function useSpaceCommentShape(spaceId: string) {
  const { user } = useServerSession();

  // Fetch comments from ElectricSQL
  const commentsShape = useShape({
    url: `${process.env.PUBLIC_APP_URL}/api/db/comments`,
    params: {
      spaceId,
    },
  });

  // Get users map for populating user details
  const usersMap = useUsersMapForComments(
    commentsShape.data.map((comment) => comment.user_id),
  );

  // Transform comments to the format expected by HumanChatContext
  return useMemo(() => {
    if (commentsShape.isLoading) return [];

    return commentsShape.data.map((comment) => {
      const user = usersMap[comment.user_id] || {
        name: 'Unknown User',
        image: undefined,
      };

      const camelComment = snakeToCamlObject(comment);

      // Format as HumanChatComment
      return {
        id: camelComment.id,
        content: camelComment.content,
        userId: camelComment.userId,
        userName: user.name || 'Unknown User',
        userAvatar: user.image,
        itemId: camelComment.itemId,
        spaceId: camelComment.spaceId,
        createdAt: camelComment.createdAt,
        updatedAt: camelComment.updatedAt,
      } as HumanChatComment;
    });
  }, [commentsShape.data, commentsShape.isLoading, usersMap]);
}
