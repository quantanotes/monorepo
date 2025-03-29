import { createContext, useContext, useState, useCallback } from 'react';

export interface HumanChatComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
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

const testComments: HumanChatComment[] = [
  {
    id: '1',
    content:
      'This is a great note! I especially like how you organized the concepts.',
    userId: 'user1',
    userName: 'Jane Smith',
    userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane',
    itemId: 'item1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    content:
      'I have a question about the third point you made. Could you elaborate more on that?',
    userId: 'user2',
    userName: 'John Doe',
    userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John',
    itemId: 'item1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: '3',
    content:
      "Thanks for your feedback! I've updated the note with more details on that point.",
    userId: 'currentUser',
    userName: 'Current User',
    userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Current',
    itemId: 'item1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '4',
    content: 'This is really helpful, thank you for sharing!',
    userId: 'user3',
    userName: 'Alex Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
    itemId: 'item1',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
];

export function HumanChatProvider({
  children,
  itemId,
  spaceId,
}: {
  children: React.ReactNode;
  itemId?: string;
  spaceId?: string;
}) {
  const [comments, setComments] = useState<HumanChatComment[]>(testComments);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const addComment = useCallback(() => {
    if (!value.trim()) return;

    const newComment: HumanChatComment = {
      id: `new-${Date.now()}`,
      content: value,
      userId: 'currentUser',
      userName: 'Current User',
      userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Current',
      itemId,
      spaceId,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setValue('');
  }, [value, itemId, spaceId]);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  }, []);

  return (
    <HumanChatContext.Provider
      value={{
        comments,
        loading,
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
