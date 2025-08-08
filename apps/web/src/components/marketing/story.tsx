import moeedImg from '@quanta/web/public/moeed.jpg?url';

export function Story() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-18">
      <div className="mb-6 text-xl font-bold">
        👋 Hey, I'm Moeed — Founder of Quanta.
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <img
          src={moeedImg}
          alt="Moeed at university"
          className="size-64 rounded-2xl shadow-md"
        />
        <p>
          That's me as a broke 21 year old in San Fransisco, with dreams to
          build the next big thing. I pulled myself from the UK to SF, all
          thanks to sales.
          <br />
          <br />
          No connections, no funding - just me trying to build something. But
          most of my time wasn't spent building. It was spent chasing leads,
          emails, rescheduling meetings, updating CRMs. I felt like an assistant
          to my own job.
          <br />
          <br />
          That's why I started Quanta.
          <br />
          <br />
          It connects to your tools i.e. email, calendar, tasks, contacts and
          handles the repetitive stuff automatically. So you stop spending half
          your day clicking around and actually get time to focus.
        </p>
      </div>
    </div>
  );
}
