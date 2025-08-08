import { RightCurlyArrow } from './right-curly-arrow';

export function What() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-18">
      <div className="pb-12">
        <h1 className="pb-4 text-center text-6xl font-bold">Simple as 123</h1>

        <h3 className="text-muted-foreground text-center text-2xl font-semibold">
          Instead of hours wasted on development, just ask AI to get the job
          done
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="flex flex-col gap-4">
          <div className="text-center text-lg font-bold">
            1. Import data from CSV/CRM
          </div>

          <div className="flex w-96 flex-col gap-4 rounded-md border p-4">
            <h4 className="text-6xl font-bold">Acme Corp.</h4>

            <div className="flex flex-wrap gap-2">
              {['#website:???', '#company:????', '#funding:?????'].map(
                (tag) => (
                  <span className="rounded-md border px-2 text-xl font-bold">
                    {tag}
                  </span>
                ),
              )}
            </div>

            <p className="text-xl">
              I know jack shit about this company!! Help!!!!
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-48 text-center text-lg font-bold">
            2. Tell AI what to do
          </div>

          <RightCurlyArrow className="fill-foreground size-24 rotate-90 lg:rotate-0" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-center text-lg font-bold">3. Get results</div>
          {[
            'Enrich lead data from website',
            'Generate company report and pain points',
            'Generate lead score',
            'Send personalised outreach email',
            'Scale to x1000 at no cost',
          ].map((content) => (
            <div className="bg-card rounded-md px-8 py-4 text-2xl">
              <span className="pr-4">🔥</span>
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
