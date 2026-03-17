'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface PublicCommitment {
  id: string;
  dataHash: string;
  schemaType: 'resume' | 'financial' | 'calendar';
  timestamp: number;
  active: boolean;
  attestationCount: number;
}

const SCHEMA_ICONS: Record<string, string> = {
  resume: '\u2620',
  financial: '\u2666',
  calendar: '\u2719',
};

const SCHEMA_LABELS: Record<string, string> = {
  resume: 'Resume',
  financial: 'Financial',
  calendar: 'Calendar',
};

function truncateId(id: string): string {
  if (id.length <= 16) return id;
  return `${id.slice(0, 8)}\u2026${id.slice(-6)}`;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export default function BrowsePage() {
  const [commitments, setCommitments] = useState<PublicCommitment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommitments() {
      try {
        const res = await fetch('/api/commitments');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCommitments(data.commitments);
      } catch {
        setError('Could not summon the registry.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommitments();
  }, []);

  const copyId = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-[#D4C5A9] relative overflow-hidden">
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, #050507 100%)',
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] z-0 rounded-full bg-[#C41E3A]/[0.03] blur-[150px]" />


      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8A8A8A] text-sm font-serif tracking-wide hover:text-[#D4C5A9] transition-colors mb-12"
          >
            <span className="text-xs">&larr;</span> RETURN
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-14"
        >
          <h1 className="text-4xl sm:text-5xl font-blackletter font-bold tracking-[0.04em] mb-4">
            Sealed{' '}
            <span className="text-[#C41E3A]">Vaults</span>
          </h1>
          <p className="text-[#8A8A8A] text-base font-serif leading-relaxed max-w-lg italic">
            A registry of all that has been bound. Each vessel holds its secrets still.
          </p>

          {/* Decorative rule */}
          <div className="flex items-center gap-3 mt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-transparent" />
            <span className="text-[#C41E3A]/40 text-xs">&#x2720;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-transparent" />
          </div>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-[#C41E3A]/20 border-t-[#C41E3A]/60 rounded-full"
              />
              <span className="text-xs font-serif tracking-[0.2em] text-[#8A8A8A] uppercase">
                Consulting the ledger...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-[#C41E3A]/30 bg-[#C41E3A]/[0.06] px-5 py-4 mb-8"
            >
              <p className="text-sm font-serif text-[#C41E3A]">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {!isLoading && !error && commitments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#0C0C10] border border-[#1A1A1F] flex items-center justify-center text-2xl text-[#C41E3A]/30">
                &#x2694;
              </div>
              <p className="text-[#8A8A8A] text-base font-serif italic text-center">
                No vessels have been sealed.
              </p>
              <Link
                href="/deposit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C41E3A] text-[#D4C5A9] font-sans font-bold text-sm tracking-[0.08em] hover:bg-[#C41E3A]/90 hover:shadow-[0_0_40px_-8px_rgba(196,30,58,0.4)] transition-all duration-300"
              >
                Seal New Data
                <span className="text-xs">&rarr;</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vault list */}
        {!isLoading && !error && commitments.length > 0 && (
          <>
            {/* Count badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-between mb-6"
            >
              <span className="text-xs font-serif tracking-[0.2em] text-[#8A8A8A] uppercase">
                {commitments.length} vessel{commitments.length !== 1 ? 's' : ''} sealed
              </span>
              <Link
                href="/deposit"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.1em] text-[#C41E3A] hover:text-[#C41E3A]/70 transition-colors"
              >
                SEAL NEW DATA
                <span className="text-[10px]">+</span>
              </Link>
            </motion.div>

            <div className="space-y-3">
              {commitments.map((commitment, i) => (
                <motion.div
                  key={commitment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`/query/${commitment.id}`}
                    className="group block rounded-lg border border-[#1A1A1F] bg-[#0C0C10] p-5 hover:border-[#C41E3A]/30 hover:bg-[#C41E3A]/[0.02] transition-all duration-300"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      {/* Left: schema badge + ID */}
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        {/* Schema icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#050507] border border-[#1A1A1F] shrink-0 text-lg text-[#C41E3A]/60 group-hover:text-[#C41E3A]/90 group-hover:border-[#C41E3A]/20 transition-all duration-300">
                          {SCHEMA_ICONS[commitment.schemaType] || '\u2720'}
                        </div>

                        <div className="min-w-0">
                          {/* Schema type badge */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-sans font-bold tracking-[0.15em] uppercase bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20">
                              {SCHEMA_LABELS[commitment.schemaType] || commitment.schemaType}
                            </span>
                            {commitment.active && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C41E3A] shadow-[0_0_6px_rgba(196,30,58,0.5)] flicker" />
                            )}
                          </div>

                          {/* Commitment ID (truncated + copy) */}
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-[#D4C5A9]/70 group-hover:text-[#D4C5A9] transition-colors break-all">
                              {truncateId(commitment.id)}
                            </code>
                            <button
                              onClick={(e) => copyId(commitment.id, e)}
                              className="text-[10px] font-serif text-[#8A8A8A] hover:text-[#C41E3A] transition-colors px-1.5 py-0.5 rounded border border-transparent hover:border-[#C41E3A]/20 cursor-pointer shrink-0"
                            >
                              {copiedId === commitment.id ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: timestamp + attestation count */}
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2 shrink-0 pl-13 sm:pl-0">
                        <span className="text-xs font-serif text-[#8A8A8A]">
                          {formatTimestamp(commitment.timestamp)}
                        </span>
                        <span className="text-[10px] font-serif tracking-[0.1em] text-[#8A8A8A] uppercase">
                          {commitment.attestationCount} attestation{commitment.attestationCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: hash preview */}
                    <div className="mt-3 pt-3 border-t border-[#1A1A1F]/60">
                      <span className="text-[10px] font-serif tracking-[0.15em] text-[#7A7A7A] uppercase mr-2">
                        Hash
                      </span>
                      <code className="text-[10px] font-mono text-[#7A7A7A] group-hover:text-[#8A8A8A] transition-colors">
                        {commitment.dataHash.slice(0, 32)}&hellip;
                      </code>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Seal new data CTA at bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + commitments.length * 0.06 }}
              className="mt-12 flex justify-center"
            >
              <Link
                href="/deposit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-[#C41E3A]/30 bg-[#C41E3A]/[0.06] text-[#C41E3A] font-sans font-bold text-sm tracking-[0.08em] hover:bg-[#C41E3A]/[0.12] hover:border-[#C41E3A]/50 hover:shadow-[0_0_40px_-8px_rgba(196,30,58,0.2)] transition-all duration-300"
              >
                Seal New Data
                <span className="text-xs">&rarr;</span>
              </Link>
            </motion.div>
          </>
        )}

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>
    </main>
  );
}
