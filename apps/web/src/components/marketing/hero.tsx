import { SparklesIcon, StarIcon } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { Pain } from './pain';

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center gap-18 px-8 pt-24 pb-18 lg:flex-row lg:gap-8">
      <div className="flex max-w-3xl flex-col gap-8">
        <h1 className="text-6xl font-bold md:text-7xl">
          Stop wasting $1000s on N8N automations
        </h1>

        <h3 className="text-muted-foreground text-2xl font-semibold">
          Generate sales workflows in minutes, not months. No code or set up
          required.
        </h3>

        <div className="flex w-fit flex-col gap-4">
          <Button className="px-8 py-4 text-xl font-bold" size="lg">
            <SparklesIcon className="size-6" /> Get Quanta
          </Button>

          <div className="flex gap-2">
            <span className="flex gap-1">
              {Array(5).fill(<StarIcon key={0} className="fill-foreground" />)}
            </span>
            <span className="text-lg font-semibold">
              1000s of automations generated
            </span>
          </div>
        </div>
      </div>

      <Pain />
    </div>
  );
}
