export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string;
  discriminator: number;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  discriminator: number;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  content: string;
}

export const tagTypes = [
  'text',
  'number',
  'boolean',
  'reference',
  'date',
  'datetime',
  'duration',
  'url',
] as const;

export type TagType = (typeof tagTypes)[number];

export interface TagQuery {
  tag: string;
  operator: string;
  value: any;
}

export interface Pinned {
  id: string;
  name: string;
  itemId?: string;
  type: string;
}
