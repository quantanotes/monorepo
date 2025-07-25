import { ScrollArea } from '@quanta/ui/scroll-area';
import { Hero } from './hero';
import { Testimonial } from './testimonial';
import { What } from './what';
import { Story } from './story';
import { Pricing } from './pricing';

export function MarketingPage() {
  return (
    <ScrollArea className="h-screen max-w-screen shrink-0">
      <Hero />
      <Testimonial />
      <What />
      <Story />
      <Pricing />
    </ScrollArea>
  );
}
