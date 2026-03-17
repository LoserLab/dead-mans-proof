'use client';

import { CopyButton } from './CopyButton';

export function CommitmentId({
  id,
  full = false,
}: {
  id: string;
  full?: boolean;
}) {
  const display = full || id.length <= 16
    ? id
    : `${id.slice(0, 8)}...${id.slice(-6)}`;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-text-secondary">
      <span title={id}>{display}</span>
      <CopyButton text={id} />
    </span>
  );
}
