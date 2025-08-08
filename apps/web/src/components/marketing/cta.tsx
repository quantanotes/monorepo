import { SparklesIcon } from 'lucide-react';
import { Button } from '@quanta/ui/button';

export function Cta() {
  return (
    <div className="px-8 py-18">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-md bg-gradient-to-r from-amber-500/70 to-pink-500/70 p-8">
        <h1 className="text-center text-6xl font-extrabold text-neutral-950">
          Ready to Stop Building and Start Selling?
        </h1>

        <Button className="mx-auto bg-neutral-950 px-8 py-4 text-2xl text-neutral-300 hover:bg-neutral-900">
          <SparklesIcon className="size-6" /> Get Quanta
        </Button>
      </div>
    </div>
  );
}
