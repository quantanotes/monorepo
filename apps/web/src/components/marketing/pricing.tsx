import { SparklesIcon } from 'lucide-react';
import { Button } from '@quanta/ui/button';

export function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-18">
      <div className="pb-12">
        <h1 className="text-center text-6xl font-bold">
          96% the price of a dev, with instant delivery
        </h1>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 md:flex-row">
        <div className="bg-card flex w-96 flex-1/2 flex-col gap-4 rounded-md p-6">
          <div className="text-xl font-bold">Standard</div>

          <div className="flex gap-1 text-xl font-bold">
            <span>£</span>
            <span className="text-4xl">200</span>
            <span className="self-end">/ month</span>
          </div>

          <ul className="h-96 py-8 text-xl font-semibold">
            {[
              'Unlimited workflow generation',
              'All integrations (email, CRM, calendar)',
              '1 on 1 setup consulation',
            ].map((content) => (
              <li className="my-4">
                <span className="pr-2">🔥</span>
                {content}
              </li>
            ))}
          </ul>

          <Button className="font-semibold" size="lg">
            <SparklesIcon /> Start Free Trial
          </Button>
        </div>

        <div className="bg-card flex w-96 flex-1/2 flex-col gap-4 rounded-md p-6 shadow-[0_0_64px_4px_hsla(44,30%,28%,0.5)]">
          <div className="text-xl font-bold">Lifetime</div>

          <div className="flex gap-1 text-xl font-bold">
            <span>£</span>
            <span className="text-4xl">2000</span>
            <span className="self-end">/ forever</span>
          </div>

          <ul className="h-96 py-8 text-xl font-semibold">
            {[
              'Everything in standard',
              'Custom feature requests',
              'Direct founder access',
              'All future features included',
            ].map((content) => (
              <li className="my-4">
                <span className="pr-2">🔥</span>
                {content}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <p className="text-center font-bold">
              Only 27 slots available. Selling out fast!
            </p>
            <Button className="font-semibold" size="lg">
              <SparklesIcon /> Claim Lifetime Deal
            </Button>
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-lg">
        No setup fees • Cancel anytime • 30-day money-back guarantee
      </p>
    </div>
  );
}
