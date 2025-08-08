import { ScrollArea } from '@quanta/ui/scroll-area';
import { Hero } from './hero';
import { Testimonial } from './testimonial';
import { What } from './what';
import { Story } from './story';
import { Pricing } from './pricing';
import { Faq } from './faq';
import { Cta } from './cta';

export function MarketingPage() {
  return (
    <ScrollArea className="h-screen">
      <div className="max-w-screen">
        <Hero />
        <Testimonial />
        <What />
        <Story />
        <Pricing />
        <Faq />
        <Cta />
      </div>
    </ScrollArea>
  );
}
