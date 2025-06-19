type SnakeToCamelCase<T extends string> = T extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<SnakeToCamelCase<B>>}`
  : T;

type ObjectWithSnakeCase = {
  [K: string]: any;
};

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function snakeToCamelObject<T extends ObjectWithSnakeCase>(
  obj: T,
): {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K];
} {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' ? snakeToCamelObject(item) : item,
    ) as any;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamel(key),
        typeof value === 'object' ? snakeToCamelObject(value) : value,
      ]),
    ) as any;
  }

  return obj as any;
}
