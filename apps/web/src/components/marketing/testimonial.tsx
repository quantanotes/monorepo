import { Quote, Star } from 'lucide-react';
import stripeMrrUrl from '@quanta/web/public/stripe-mrr.jpg?url';

export function Testimonial() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-8 py-12 md:flex-row">
      <div className="text-muted-foreground flex shrink flex-col gap-4">
        <Quote className="fill-muted-foreground size-8" />

        <p className="text-2xl font-semibold">
          My dev spent months building my automation. Ended up wasting 1000s of
          dollars and it only half worked.
          <br />
          <br />
          Quanta gets the job done in seconds. Wish I knew about it sooner!
        </p>

        <span className="mt-4 flex gap-1">
          {Array(5).fill(<Star className="fill-muted-foreground size-4" />)}
        </span>

        <p className="text-lg font-semibold">
          Dylan O'Neil - Sales Rep/Founder
        </p>
      </div>

      <img className="aspect-auto w-64" src={stripeMrrUrl}></img>
    </div>
  );
}
