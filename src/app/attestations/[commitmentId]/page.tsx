"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { DataCommitment, Attestation } from "@/lib/types";
import { ConfidenceBar } from "@/components/ConfidenceBar";

const SCHEMA_CONFIG: Record<
  string,
  { label: string; symbol: string; color: string; bg: string; borderColor: string }
> = {
  resume: {
    label: "Resume",
    symbol: "\u2020",
    color: "var(--blood-bright)",
    bg: "var(--blood-dim)",
    borderColor: "rgba(196, 30, 58, 0.25)",
  },
  financial: {
    label: "Financial",
    symbol: "\u00A4",
    color: "var(--gold)",
    bg: "var(--gold-dim)",
    borderColor: "rgba(184, 134, 11, 0.25)",
  },
  calendar: {
    label: "Calendar",
    symbol: "\u263D",
    color: "#7B6BA5",
    bg: "rgba(74, 59, 107, 0.15)",
    borderColor: "rgba(74, 59, 107, 0.3)",
  },
};

function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
      style={{
        backgroundColor: copied ? 'var(--blood-dim)' : 'transparent',
        border: '1px solid',
        borderColor: copied ? 'var(--blood-bright)' : 'var(--border-subtle)',
        color: copied ? 'var(--blood-bright)' : 'var(--ash)',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--blood-bright)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--blood-bright)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--ash)';
        }
      }}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="var(--blood-bright)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <rect
              x="5"
              y="5"
              width="9"
              height="9"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-sm ${className}`}
      style={{ backgroundColor: 'var(--border-subtle)' }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SkeletonBlock className="mb-3 h-4 w-48" />
      <SkeletonBlock className="mb-10 h-8 w-80" />
      <div
        className="mb-12 rounded-sm p-6"
        style={{ border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-surface)' }}
      >
        <SkeletonBlock className="mb-4 h-6 w-24" />
        <SkeletonBlock className="mb-3 h-4 w-full" />
        <SkeletonBlock className="mb-3 h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/2" />
      </div>
      {[1, 2].map((i) => (
        <div
          key={i}
          className="mb-6 ml-6 rounded-sm p-6"
          style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
        >
          <SkeletonBlock className="mb-3 h-5 w-3/4" />
          <SkeletonBlock className="mb-3 h-8 w-16" />
          <SkeletonBlock className="mb-3 h-3 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function AttestationsPage() {
  const { commitmentId } = useParams<{ commitmentId: string }>();
  const [commitment, setCommitment] = useState<DataCommitment | null>(null);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!commitmentId) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/attestations/${commitmentId}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            body?.error || `Failed to load attestation record (${res.status})`
          );
        }
        const data = await res.json();
        setCommitment(data.commitment);
        setAttestations(
          [...data.attestations].sort(
            (a: Attestation, b: Attestation) => b.timestamp - a.timestamp
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [commitmentId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !commitment) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 font-display text-6xl font-bold text-accent">
            404
          </div>
          <p className="mb-2 font-display text-lg font-bold text-bone">
            Record Not Found
          </p>
          <p className="mb-8 font-body text-sm italic text-text-secondary">
            {error || "This vessel does not exist in the archive."}
          </p>
          <Link
            href="/"
            className="font-display text-xs uppercase tracking-[0.25em] transition-colors"
            style={{ color: 'var(--blood-bright)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--bone)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--blood-bright)'; }}
          >
            Return to the archive
          </Link>
        </motion.div>
      </div>
    );
  }

  const schema = SCHEMA_CONFIG[commitment.schemaType] || SCHEMA_CONFIG.resume;
  const avgConfidence =
    attestations.length > 0
      ? Math.round(
          attestations.reduce((sum, a) => sum + a.confidence, 0) /
            attestations.length
        )
      : 0;

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full pulse-blood"
              style={{ backgroundColor: 'var(--blood-bright)' }}
            />
            <span
              className="font-display text-[10px] uppercase tracking-[0.25em] text-text-tertiary"
            >
              Eternal Ledger
            </span>
          </div>
          <h1
            className="mb-4 font-blackletter text-2xl font-bold tracking-[0.1em] sm:text-3xl text-bone"
          >
            The Record of Truths
          </h1>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm text-text-secondary break-all">
              {truncateHash(commitmentId, 10)}
            </span>
            <CopyButton text={commitmentId} />
          </div>
        </motion.header>

        {/* Commitment Info Card: ancient sealed document */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-14 rounded-sm p-6"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
          }}
        >
          {/* Ornamental top border */}
          <div
            className="absolute top-0 left-4 right-4 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--bone) 12%, transparent) 15%, color-mix(in srgb, var(--bone) 25%, transparent) 50%, color-mix(in srgb, var(--bone) 12%, transparent) 85%, transparent 100%)',
            }}
          />
          {/* Ornamental bottom border */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--bone) 12%, transparent) 15%, color-mix(in srgb, var(--bone) 25%, transparent) 50%, color-mix(in srgb, var(--bone) 12%, transparent) 85%, transparent 100%)',
            }}
          />

          {/* Top row: badge + status */}
          <div className="mb-5 flex items-center justify-between">
            <span
              className="rounded-sm px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{
                backgroundColor: schema.bg,
                color: schema.color,
                border: `1px solid ${schema.borderColor}`,
              }}
            >
              <span style={{ marginRight: '4px', fontSize: '0.85em' }}>{schema.symbol}</span>
              {schema.label}
            </span>
            <span
              className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em]"
              style={{
                color: commitment.active ? 'var(--blood-bright)' : 'var(--ash)',
              }}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${commitment.active ? 'pulse-blood' : ''}`}
                style={{
                  backgroundColor: commitment.active ? 'var(--blood-bright)' : 'var(--ash)',
                }}
              />
              {commitment.active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Data hash */}
          <div className="mb-4">
            <div
              className="mb-1 font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
            >
              Data Hash (keccak256)
            </div>
            <div className="flex items-center">
              <code className="break-all font-mono text-xs text-text-secondary">
                {commitment.dataHash}
              </code>
              <CopyButton text={commitment.dataHash} />
            </div>
          </div>

          {/* Timestamp */}
          <div className="mb-5">
            <div
              className="mb-1 font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
            >
              Sealed
            </div>
            <div className="font-body text-xs text-text-secondary">
              {formatTimestamp(commitment.timestamp)}
            </div>
          </div>

          {/* Sealed notice */}
          <div
            className="flex items-start gap-2.5 rounded-sm px-4 py-3"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 shrink-0"
              style={{ color: 'var(--gold)' }}
            >
              <path
                d="M8 1L1 14h14L8 1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8 6v3M8 11.5v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-body text-[11px] italic leading-relaxed text-text-tertiary">
              The original data is sealed. Only attestations from the oracle are visible.
            </p>
          </div>
        </motion.section>

        {/* Attestation Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <h2
              className="font-display text-lg font-bold tracking-[0.08em] text-bone"
            >
              Query Log
            </h2>
            {attestations.length > 0 && (
              <span
                className="rounded-sm px-2 py-0.5 font-display text-[10px] tracking-[0.15em]"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}
              >
                {attestations.length}{" "}
                {attestations.length === 1 ? "entry" : "entries"}
              </span>
            )}
          </div>

          {attestations.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-sm px-6 py-16 text-center"
              style={{
                border: '1px dashed var(--border-medium)',
                backgroundColor: 'rgba(17, 17, 17, 0.5)',
              }}
            >
              <div
                className="mb-4 font-display text-4xl text-text-tertiary"
              >
                &empty;
              </div>
              <p className="mb-1 font-body text-sm italic text-text-secondary">
                No souls have questioned this vessel.
              </p>
              <Link
                href={`/query/${commitmentId}`}
                className="mt-4 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.25em] transition-colors"
                style={{ color: 'var(--blood-bright)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--bone)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--blood-bright)'; }}
              >
                Be the first to summon truth
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          ) : (
            /* Timeline */
            <div className="relative">
              {/* Vertical blood-red line */}
              <div
                className="absolute bottom-0 left-[11px] top-0 w-px"
                style={{ backgroundColor: 'var(--blood-bright)', opacity: 0.3 }}
              />

              <div className="space-y-1">
                {attestations.map((attestation, index) => (
                  <motion.div
                    key={`${attestation.queryHash}-${attestation.timestamp}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="relative pl-8 sm:pl-10"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-[7px] top-6 h-[9px] w-[9px] rounded-full"
                      style={{
                        border: `2px solid ${attestation.answer ? 'var(--blood-bright)' : 'var(--bone)'}`,
                        backgroundColor: 'var(--bg-primary)',
                        boxShadow: attestation.answer ? '0 0 6px rgba(196, 30, 58, 0.4)' : 'none',
                      }}
                    />

                    <div
                      className="rounded-sm p-4 sm:p-5 transition-colors duration-300"
                      style={{
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-medium)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      {/* Timestamp */}
                      <div
                        className="mb-3 font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
                      >
                        {formatTimestamp(attestation.timestamp)}
                      </div>

                      {/* Query text */}
                      <p
                        className="mb-4 font-body text-sm italic leading-relaxed text-bone"
                      >
                        &quot;{attestation.query}&quot;
                      </p>

                      {/* Verdict */}
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className="font-display text-2xl font-bold tracking-[0.1em]"
                          style={{
                            color: attestation.answer ? 'var(--blood-bright)' : 'var(--bone)',
                            textShadow: attestation.answer
                              ? '0 0 12px rgba(196, 30, 58, 0.4), 0 0 30px rgba(196, 30, 58, 0.15)'
                              : 'none',
                          }}
                        >
                          {attestation.answer ? "YES" : "NO"}
                        </span>
                        <div
                          className="h-px flex-1"
                          style={{ backgroundColor: 'var(--border-subtle)' }}
                        />
                      </div>

                      {/* Confidence */}
                      <div className="mb-4">
                        <div
                          className="mb-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
                        >
                          Confidence
                        </div>
                        <ConfidenceBar confidence={attestation.confidence} />
                      </div>

                      {/* Reasoning */}
                      <div
                        className="mb-3 rounded-sm px-4 py-3"
                        style={{
                          borderLeft: '2px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-primary)',
                        }}
                      >
                        <p
                          className="font-body text-[11px] leading-relaxed text-text-secondary"
                        >
                          {attestation.reasoning}
                        </p>
                      </div>

                      {/* TX Hash */}
                      {attestation.txHash && (
                        <div className="flex items-center gap-2">
                          <span
                            className="font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
                          >
                            TX
                          </span>
                          <a
                            href={`https://basescan.org/tx/${attestation.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] transition-colors"
                            style={{ color: 'var(--blood-bright)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--bone)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--blood-bright)'; }}
                          >
                            {truncateHash(attestation.txHash, 8)}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="ml-1 inline"
                            >
                              <path
                                d="M6 3H3v10h10v-3M10 3h3v3M13 3L7 9"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Footer Stats */}
        {attestations.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 pt-8"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <div className="text-center">
              <div
                className="font-display text-2xl font-bold text-bone"
              >
                {attestations.length}
              </div>
              <div
                className="font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
              >
                Total Attestations
              </div>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <div className="text-center">
              <div
                className="font-display text-2xl font-bold text-bone"
              >
                {avgConfidence}%
              </div>
              <div
                className="font-display text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
              >
                Avg. Confidence
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-4 right-4 z-40 sm:bottom-8 sm:right-8"
      >
        <Link
          href={`/query/${commitmentId}`}
          className="group flex items-center gap-2 sm:gap-2.5 rounded-sm px-3 py-2.5 sm:px-5 sm:py-3 font-display text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-lg backdrop-blur-sm transition-all duration-300"
          style={{
            border: '1px solid var(--blood-bright)',
            backgroundColor: 'var(--blood-dim)',
            color: 'var(--blood-bright)',
            boxShadow: '0 0 20px var(--blood-dim)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = 'var(--blood-bright)';
            el.style.color = 'var(--bone)';
            el.style.boxShadow = '0 0 30px var(--blood-glow)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = 'var(--blood-dim)';
            el.style.color = 'var(--blood-bright)';
            el.style.boxShadow = '0 0 20px var(--blood-dim)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 11l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Summon the Oracle
        </Link>
      </motion.div>
    </div>
  );
}
