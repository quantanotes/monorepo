import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@quanta/ui/accordion';

export function Faq() {
  const faqs = [
    {
      question: 'How is this different from N8N, Zapier, or Make?',
      answer:
        'Those tools require you to build workflows manually - dragging, dropping, and configuring every step. With Quanta, you simply describe what you want in plain English, and our AI builds the entire workflow for you in seconds. No technical knowledge required.',
    },
    {
      question: 'What kinds of workflows can the AI build?',
      answer:
        "Our AI excels at sales and marketing automations: lead scoring, CRM updates, email sequences, data enrichment, meeting scheduling, and follow-up campaigns. We're continuously expanding capabilities based on user needs.",
    },
    {
      question: 'Do I need any technical knowledge?',
      answer:
        "Absolutely not. Just describe your goal in plain English like 'send personalized emails to qualified leads' and our AI handles all the technical implementation. No coding, no workflow building, no API configuration required.",
    },
    {
      question: 'How long does it take to set up?',
      answer:
        'Most workflows are generated and running within 30-60 seconds. The initial setup involves connecting your tools (which takes 2-3 minutes), then you can create unlimited automations instantly.',
    },
    {
      question: 'Which tools and platforms do you integrate with?',
      answer:
        'We support all major CRMs (HubSpot, Salesforce, Pipedrive), email platforms (Gmail, Outlook), calendars (Google, Office 365), and 100+ other business tools. If you need a specific integration, just ask - we add new ones regularly.',
    },
    {
      question: 'What happens if my workflow breaks?',
      answer:
        'Our AI continuously monitors your workflows and automatically fixes issues when APIs change or tools update. Unlike traditional automations that break and require manual fixes, Quanta workflows are self-healing.',
    },
    {
      question: 'Is there a limit to how many workflows I can create?',
      answer:
        'No limits. Create as many workflows as you need. The AI generation is unlimited on both monthly and lifetime plans.',
    },
    {
      question: "Can I modify workflows after they're created?",
      answer:
        "Yes! Just tell the AI what changes you want in plain English. 'Make the follow-up email more casual' or 'Only target companies with 50+ employees' - the AI will instantly update your workflow.",
    },
    {
      question: "What if I'm not satisfied?",
      answer:
        "We offer a 30-day money-back guarantee. If our AI can't build workflows that save you at least 10 hours per week, we'll refund every penny and help you find a solution that works.",
    },
    {
      question: 'How secure is my data?',
      answer:
        'Enterprise-grade security with SOC 2 compliance. Your data is encrypted in transit and at rest, and we never store sensitive information longer than necessary to run your workflows.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes, you can cancel your monthly subscription anytime with no penalties. Your workflows will continue running until the end of your billing period.',
    },
    {
      question: 'Why choose lifetime over monthly?',
      answer:
        'The lifetime deal is our launch special - you get priority support, custom integrations, and all future features for a one-time payment. At our current growth rate, monthly subscribers will pay more than the lifetime price within 10 months.',
    },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-8 py-18 lg:flex-row">
      <div className="flex shrink flex-col gap-8">
        <h1 className="text-3xl font-bold md:text-6xl">
          Frequently Asked Questions
        </h1>
        <h3 className="text-muted-foreground text-xl font-semibold">
          Have a question? Feel free to reach out on Twitter/Email!
        </h3>
      </div>

      <div className="w-full grow">
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={i.toString()}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
