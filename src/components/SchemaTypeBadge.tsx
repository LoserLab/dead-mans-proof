const SCHEMA_CONFIG: Record<string, { symbol: string; bg: string; text: string; border: string }> = {
  resume: {
    symbol: '\u2020',
    bg: 'var(--blood-dim)',
    text: 'var(--blood-bright)',
    border: 'rgba(196, 30, 58, 0.25)',
  },
  financial: {
    symbol: '\u00A4',
    bg: 'var(--gold-dim)',
    text: 'var(--gold)',
    border: 'rgba(184, 134, 11, 0.25)',
  },
  calendar: {
    symbol: '\u263D',
    bg: 'rgba(74, 59, 107, 0.15)',
    text: '#7B6BA5',
    border: 'rgba(74, 59, 107, 0.3)',
  },
};

const FALLBACK = {
  symbol: '\u00B7',
  bg: 'rgba(107, 107, 107, 0.1)',
  text: 'var(--ash)',
  border: 'rgba(107, 107, 107, 0.2)',
};

export function SchemaTypeBadge({ schemaType }: { schemaType: string }) {
  const config = SCHEMA_CONFIG[schemaType.toLowerCase()] ?? FALLBACK;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-display font-bold uppercase tracking-[0.15em] select-none"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      <span style={{ fontSize: '0.85em' }}>{config.symbol}</span>
      {schemaType}
    </span>
  );
}
