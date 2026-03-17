'use client';

export function ConfidenceBar({ confidence }: { confidence: number }) {
  const clamped = Math.max(0, Math.min(100, confidence));

  const color =
    clamped <= 40 ? 'var(--ash)' : clamped <= 70 ? 'var(--gold)' : 'var(--blood-bright)';

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className="relative h-2 flex-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}50`,
          }}
        />
      </div>
      <span
        className="text-sm font-display font-bold tabular-nums min-w-[3ch] text-right tracking-wide"
        style={{ color }}
      >
        {clamped}%
      </span>
    </div>
  );
}
