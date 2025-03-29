import { Input } from '@quanta/ui/input';

export function Search() {
  return (
    <div className="flex h-10 items-center px-1">
      <Input
        placeholder="Search anything..."
        className="mx-auto max-w-3xl focus-within:ring-0 focus-within:outline-0"
      ></Input>
    </div>
  );
}
