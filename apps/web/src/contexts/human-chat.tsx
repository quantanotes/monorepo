import { createContext, useContext, useMemo, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { addCommentFn, deleteCommentFn } from '@quanta/web/lib/comment-fns';
import { useShapeWithJoin } from '@quanta/web/hooks/use-shape-with-join';

export interface HumanChatComment {
  id: string;
  content: string;
  userId: string;
  username: string;
  image?: string;
  itemId?: string;
  spaceId?: string;
  createdAt: string;
  updatedAt?: string;
}

interface HumanChatContextType {
  comments: HumanChatComment[];
  loading: boolean;
  value: string;
  setValue: (value: string) => void;
  addComment: () => void;
  deleteComment: (id: string) => void;
}

const HumanChatContext = createContext<HumanChatContextType | undefined>(
  undefined,
);

export function HumanChatProvider({ children }: React.PropsWithChildren) {
  const [value, setValue] = useState('');
  const addCommentServerFn = useServerFn(addCommentFn);
  const deleteCommentServerFn = useServerFn(deleteCommentFn);
  const { spaceId, itemId } = useParams({ strict: false });
  const commentsUrl = useMemo(() => {
    return itemId
      ? `${process.env.PUBLIC_APP_URL}/api/db/comments/item/${itemId}`
      : `${process.env.PUBLIC_APP_URL}/api/db/comments/space/${spaceId}`;
  }, [itemId, spaceId]);

  const comments = useShapeWithJoin({
    shape1Url: commentsUrl,
    shape2Url: `${process.env.PUBLIC_APP_URL}/api/db/users`,
    getJoinId: (comment) => comment.user_id,
    mergeRows: (comment, user) => ({
      ...comment,
      username: user?.username,
      image: user?.image,
    }),
    shape2Params: {
      columns: ['id', 'username', 'image'],
    },
  });

  const addComment = async () => {
    await addCommentServerFn({
      data: {
        content: value,
        itemId: itemId ?? undefined,
        spaceId: spaceId ?? undefined,
      },
    });
    setValue('');
  };

  const deleteComment = async (id: string) => {
    await deleteCommentServerFn({ data: { id } });
  };

  return (
    <HumanChatContext.Provider
      value={{
        comments: comments.map(snakeToCamlObject) as HumanChatComment[],
        loading: false,
        value,
        setValue,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </HumanChatContext.Provider>
  );
}

export function useHumanChat() {
  const context = useContext(HumanChatContext);
  if (context === undefined) {
    throw new Error('useHumanChat must be used within a HumanChatProvider');
  }
  return context;
}
