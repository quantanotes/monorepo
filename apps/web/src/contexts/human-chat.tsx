import { createContext, useContext, useMemo, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { snakeToCamelObject } from '@quanta/utils/snake-to-camel';
import { useShapeWithJoin } from '@quanta/web/hooks/use-shape-with-join';
import { addCommentFn, deleteCommentFn } from '@quanta/web/lib/comment-fns';

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
  value: string;
  setValue: (value: string) => void;
  addComment: () => void;
  deleteComment: (id: string) => void;
}

const HumanChatContext = createContext<HumanChatContextType>(null!);

export function HumanChatProvider({ children }: React.PropsWithChildren) {
  const [value, setValue] = useState('');
  const { spaceId, itemId } = useParams({ strict: false });
  const commentsUrl = useMemo(() => {
    return itemId
      ? `${process.env.PUBLIC_APP_URL}/api/db/comments/item/${itemId}`
      : `${process.env.PUBLIC_APP_URL}/api/db/comments/space/${spaceId}`;
  }, [itemId, spaceId]);
  const _addComment = useServerFn(addCommentFn);
  const _deleteComment_ = useServerFn(deleteCommentFn);

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
  }).map(snakeToCamelObject) as HumanChatComment[];

  const addComment = async () => {
    await _addComment({
      data: {
        content: value,
        itemId: itemId ?? undefined,
        spaceId: spaceId ?? undefined,
      },
    });
    setValue('');
  };

  const deleteComment = async (id: string) => {
    await _deleteComment_({ data: { id } });
  };

  return (
    <HumanChatContext.Provider
      value={{
        comments,
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
  if (context === null) {
    throw new Error('useHumanChat must be used within a HumanChatProvider');
  }
  return context;
}
