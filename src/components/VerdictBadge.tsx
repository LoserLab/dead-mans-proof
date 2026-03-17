export function VerdictBadge({ answer }: { answer: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center px-5 py-1.5 rounded-sm text-sm font-display font-bold uppercase tracking-[0.2em] select-none"
      style={
        answer
          ? {
              backgroundColor: 'var(--blood-bright)',
              color: 'var(--bone)',
              boxShadow: '0 0 16px var(--blood-glow), 0 0 40px var(--blood-dim)',
            }
          : {
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--bone)',
              border: '1px solid var(--border-medium)',
            }
      }
    >
      {answer ? 'YES' : 'NO'}
    </span>
  );
}
