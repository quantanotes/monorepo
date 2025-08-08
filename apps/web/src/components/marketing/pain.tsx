export function Pain() {
  const content = [
    {
      title: 'Setup Time',
      problem: '3 months',
      solution: '5 minutes',
    },
    {
      title: 'Cost',
      problem: '$5000/month',
      solution: '$200/month',
    },
    {
      title: 'Changes',
      problem: 'Dev Sprint',
      solution: 'Instant',
    },
    {
      title: 'Control',
      problem: 'Dependent',
      solution: 'Independent',
    },
  ];

  return (
    <div className="bg-card h-fit min-w-[320px] rounded-2xl px-10 py-12 text-lg shadow-[0_0_64px_4px_hsla(44,30%,28%,0.5)]">
      <div className="mb-10 text-center text-2xl font-extrabold tracking-tight">
        Developer vs You
      </div>

      <div className="space-y-6 text-base md:text-lg">
        {content.map(({ title, problem, solution }, idx) => (
          <div key={idx} className="flex items-center gap-6 text-xl">
            <div>🔥</div>
            <div>
              <div className="text-muted-foreground font-bold">{title}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-destructive line-through">{problem}</span>
                <span className="text-primary font-bold">{solution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
