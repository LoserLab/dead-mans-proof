"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import type { Attestation, DataCommitment } from "@/lib/types";
import { ConfidenceBar } from "@/components/ConfidenceBar";

/* ------------------------------------------------------------------ */
/*  Schema-aware example queries                                       */
/* ------------------------------------------------------------------ */

const EXAMPLE_QUERIES: Record<string, string[]> = {
  resume: [
    "Does this person have 5+ years experience?",
    "Do they have a computer science degree?",
    "Have they worked at a FAANG company?",
  ],
  financial: [
    "Is the portfolio value above $10,000?",
    "Is the net worth above $100,000?",
    "Are there any outstanding debts?",
  ],
  calendar: [
    "Is this person available Tuesday afternoon?",
    "Do they have any meetings this Friday?",
    "Is there a free slot tomorrow morning?",
  ],
};

const GENERIC_QUERIES = [
  "Does this person have 5+ years experience?",
  "Is the portfolio value above $10,000?",
  "Is this person available Tuesday afternoon?",
];

/* ------------------------------------------------------------------ */
/*  Helper: truncate hash / id                                         */
/* ------------------------------------------------------------------ */

function truncate(str: string, front = 8, back = 6) {
  if (str.length <= front + back + 3) return str;
  return `${str.slice(0, front)}...${str.slice(-back)}`;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Oracle consulting animation (loading state)                        */
/* ------------------------------------------------------------------ */

function VaultScanning() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-6 py-16"
    >
      {/* Occult pulsing eye / blood circle with expanding rings */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Outer expanding ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid var(--blood-bright)" }}
          animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Outer expanding ring 2 (delayed) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid var(--blood-bright)" }}
          animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
        />
        {/* Inner static ring */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{ border: "1px solid var(--blood)", opacity: 0.3 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Core blood circle */}
        <motion.div
          className="h-10 w-10 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--blood-bright) 0%, var(--blood) 60%, transparent 100%)",
            boxShadow: "0 0 30px var(--blood-glow), 0 0 60px var(--blood-dim)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner eye slit */}
        <motion.div
          className="absolute"
          style={{
            width: "6px",
            height: "18px",
            borderRadius: "50%",
            background: "var(--bone)",
            opacity: 0.7,
          }}
          animate={{
            scaleY: [1, 0.3, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Scanning text */}
      <div className="flex flex-col items-center gap-3">
        <motion.p
          className="font-display text-lg font-bold tracking-[0.25em] uppercase glow-blood-text"
          style={{ color: "var(--blood-bright)" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Consulting the Oracle
        </motion.p>

        {/* Scanning bar */}
        <div
          className="h-px w-48 overflow-hidden"
          style={{ background: "var(--border-subtle)" }}
        >
          <motion.div
            className="h-full w-16"
            style={{ background: "linear-gradient(90deg, transparent, var(--blood-bright), transparent)" }}
            animate={{ x: ["-64px", "192px"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p
          className="font-body text-sm italic"
          style={{ color: "var(--ash)" }}
        >
          The truth stirs within...
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Result card (the dramatic reveal)                                  */
/* ------------------------------------------------------------------ */

interface AttestationResult {
  answer: boolean;
  confidence: number;
  reasoning: string;
  txHash: string | null;
  queryHash: string;
  timestamp: number;
}

function ResultCard({ result }: { result: AttestationResult }) {
  const isYes = result.answer;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden parchment-border"
      style={{
        background: "var(--bg-surface)",
        borderRadius: "2px",
      }}
    >
      {/* Top accent strip: blood drip style */}
      <div
        className="blood-drip"
        style={{ height: "3px" }}
      />

      <div className="p-8">
        {/* Wax seal YES / NO stamp */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: isYes ? -6 : 4 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "120px",
              height: "120px",
            }}
          >
            {/* Wax seal outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isYes
                  ? "radial-gradient(circle, var(--blood-bright) 0%, var(--blood) 50%, #3a0a0a 100%)"
                  : "radial-gradient(circle, #3a3a3a 0%, #1a1a1a 50%, #0a0a0a 100%)",
                boxShadow: isYes
                  ? "0 0 30px var(--blood-glow), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.4)"
                  : "0 0 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.4)",
              }}
            />
            {/* Inner decorative ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "8px",
                border: isYes ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(255,255,255,0.08)",
              }}
            />
            {/* Text */}
            <span
              className="font-display relative text-3xl font-bold tracking-[0.2em]"
              style={{
                color: isYes ? "var(--bone)" : "var(--ash)",
                textShadow: isYes
                  ? "0 0 20px var(--blood-glow), 0 1px 2px rgba(0,0,0,0.8)"
                  : "0 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              {isYes ? "YES" : "NO"}
            </span>
          </div>
        </motion.div>

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ConfidenceBar confidence={result.confidence} />
        </motion.div>

        {/* Reasoning: dark parchment style */}
        <motion.div
          className="mt-6 p-5"
          style={{
            background: "linear-gradient(135deg, rgba(26, 22, 16, 0.8) 0%, rgba(12, 12, 16, 0.9) 100%)",
            border: "1px solid var(--border-medium)",
            borderRadius: "2px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p
            className="mb-2 font-display text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--gold)" }}
          >
            Privacy-safe reasoning
          </p>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {result.reasoning}
          </p>
        </motion.div>

        {/* Footer meta */}
        <motion.div
          className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {result.txHash && (
            <a
              href={`https://basescan.org/tx/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-xs transition-colors hover:text-bone"
              style={{ color: "var(--blood-bright)" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {truncate(result.txHash, 6, 4)}
            </a>
          )}
          {!result.txHash && (
            <span
              className="font-body text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Off-chain attestation
            </span>
          )}
          <span
            className="font-body text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {formatTime(result.timestamp)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Past attestation row                                               */
/* ------------------------------------------------------------------ */

function AttestationRow({
  attestation,
  index,
}: {
  attestation: Attestation;
  index: number;
}) {
  const isYes = attestation.answer;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group flex items-start gap-4 px-5 py-4 transition-colors"
      style={{
        background: "rgba(12, 12, 16, 0.4)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "2px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-medium)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      {/* YES/NO badge: blood tint for YES, dark ash for NO */}
      <div
        className="mt-0.5 flex h-8 w-12 shrink-0 items-center justify-center font-display text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{
          background: isYes ? "var(--blood-dim)" : "rgba(107, 107, 107, 0.1)",
          border: isYes ? "1px solid rgba(196, 30, 58, 0.25)" : "1px solid rgba(107, 107, 107, 0.15)",
          color: isYes ? "var(--blood-bright)" : "var(--ash)",
          borderRadius: "2px",
        }}
      >
        {isYes ? "YES" : "NO"}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate font-body text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {attestation.query}
        </p>
        <div className="mt-1.5 flex items-center gap-4">
          <span
            className="font-body text-[10px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            {attestation.confidence}% confidence
          </span>
          <span
            className="font-body text-[10px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            {formatTime(attestation.timestamp)}
          </span>
          {attestation.txHash && (
            <a
              href={`https://basescan.org/tx/${attestation.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[10px] transition-colors hover:text-bone"
              style={{ color: "var(--blood-bright)" }}
            >
              tx: {truncate(attestation.txHash, 4, 4)}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function QueryPage() {
  const { commitmentId } = useParams<{ commitmentId: string }>();

  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AttestationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Commitment metadata + past attestations
  const [commitment, setCommitment] = useState<DataCommitment | null>(null);
  const [pastAttestations, setPastAttestations] = useState<Attestation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  /* ---- Fetch commitment + history on mount ---- */
  const fetchHistory = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`/api/attestations/${commitmentId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Commitment not found. It may have been removed or the ID is invalid.");
        } else {
          setError("Failed to load vault data. Please refresh the page.");
        }
        return;
      }
      const data = await res.json();
      setCommitment(data.commitment);
      setPastAttestations(
        (data.attestations as Attestation[]).sort(
          (a, b) => b.timestamp - a.timestamp
        )
      );
    } catch {
      setError("Network error loading vault. Please refresh the page.");
    } finally {
      setLoadingHistory(false);
    }
  }, [commitmentId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /* ---- Submit query ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commitmentId, query: query.trim() }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody.error || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      setResult(data.attestation as AttestationResult);

      // Refresh history
      fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Copy commitment ID ---- */
  const copyId = () => {
    navigator.clipboard.writeText(commitmentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Example queries based on schema ---- */
  const examples =
    commitment && EXAMPLE_QUERIES[commitment.schemaType]
      ? EXAMPLE_QUERIES[commitment.schemaType]
      : GENERIC_QUERIES;

  const schemaBadgeStyles: Record<string, { bg: string; border: string; color: string }> = {
    resume: {
      bg: "var(--blood-dim)",
      border: "rgba(196, 30, 58, 0.25)",
      color: "var(--blood-bright)",
    },
    financial: {
      bg: "var(--gold-dim)",
      border: "rgba(184, 134, 11, 0.25)",
      color: "var(--gold)",
    },
    calendar: {
      bg: "rgba(74, 59, 107, 0.15)",
      border: "rgba(74, 59, 107, 0.3)",
      color: "#7B6BA5",
    },
  };

  const defaultBadgeStyle = {
    bg: "var(--bg-surface)",
    border: "var(--border-subtle)",
    color: "var(--text-secondary)",
  };

  return (
    <div
      className="min-h-screen pb-24 fog-overlay"
      style={{ background: "var(--bg-void)" }}
    >
      <div className="mx-auto max-w-2xl px-6 pt-12">
        {/* ---- Page Header ---- */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-3 flex items-center gap-3">
            {commitment && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-2.5 py-0.5 font-display text-[10px] uppercase tracking-[0.25em]"
                style={{
                  background: (schemaBadgeStyles[commitment.schemaType] || defaultBadgeStyle).bg,
                  border: `1px solid ${(schemaBadgeStyles[commitment.schemaType] || defaultBadgeStyle).border}`,
                  color: (schemaBadgeStyles[commitment.schemaType] || defaultBadgeStyle).color,
                  borderRadius: "2px",
                }}
              >
                {commitment.schemaType}
              </motion.span>
            )}
            {commitment?.active && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full pulse-blood"
                  style={{ background: "var(--blood-bright)" }}
                />
                <span
                  className="font-display text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Active
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="font-blackletter text-xl sm:text-2xl font-bold tracking-[0.08em]">
              <span style={{ color: "var(--bone)" }}>Sealed Vessel </span>
              <span className="break-all" style={{ color: "var(--blood-bright)" }}>{truncate(commitmentId)}</span>
            </h1>
            <button
              onClick={copyId}
              className="group flex h-7 shrink-0 items-center gap-1.5 px-2 font-display text-[10px] uppercase tracking-[0.15em] transition-all"
              style={{
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
                color: "var(--text-tertiary)",
                borderRadius: "2px",
              }}
              title="Copy full ID"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(196, 30, 58, 0.3)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-tertiary)";
              }}
            >
              {copied ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  style={{ color: "var(--blood-bright)" }}
                >
                  Copied
                </motion.span>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {commitment && (
            <p
              className="mt-2 font-body text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Deposited {formatTime(commitment.timestamp)} &middot; Hash{" "}
              {truncate(commitment.dataHash, 6, 4)}
            </p>
          )}
        </motion.header>

        {/* ---- Query Input Section ---- */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pose your question to the oracle..."
                disabled={isSubmitting}
                className="w-full px-5 py-4 pr-4 font-body text-sm transition-colors focus:outline-none disabled:opacity-50"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  borderRadius: "2px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196, 30, 58, 0.4)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(196, 30, 58, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Example chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuery(example)}
                  disabled={isSubmitting}
                  className="px-3 py-1 font-body text-[11px] transition-all disabled:opacity-40"
                  style={{
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(12, 12, 16, 0.6)",
                    color: "var(--text-tertiary)",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(196, 30, 58, 0.4)";
                    e.currentTarget.style.color = "var(--blood-bright)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.color = "var(--text-tertiary)";
                  }}
                >
                  {example}
                </button>
              ))}
            </div>

            {/* Submit button: SUMMON THE TRUTH */}
            <motion.button
              type="submit"
              disabled={!query.trim() || isSubmitting}
              className="mt-5 flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.25em] transition-all disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                border: "1px solid rgba(196, 30, 58, 0.4)",
                background: "var(--blood-dim)",
                color: "var(--blood-bright)",
                borderRadius: "2px",
              }}
              whileHover={!isSubmitting && query.trim() ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting && query.trim() ? { scale: 0.98 } : {}}
              onMouseEnter={(e) => {
                if (!isSubmitting && query.trim()) {
                  e.currentTarget.style.background = "rgba(196, 30, 58, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(196, 30, 58, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 25px var(--blood-dim), 0 0 50px rgba(196, 30, 58, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--blood-dim)";
                e.currentTarget.style.borderColor = "rgba(196, 30, 58, 0.4)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Small occult symbol */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="8" />
                <line x1="12" y1="16" x2="12" y2="22" />
                <line x1="2" y1="12" x2="8" y2="12" />
                <line x1="16" y1="12" x2="22" y2="12" />
              </svg>
              Summon the Truth
            </motion.button>
          </form>
        </motion.section>

        {/* ---- Error ---- */}
        <AnimatePresence>
          {error && (() => {
            const isRateLimit = /oracle|rushed|rests/i.test(error);
            return (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mb-8 flex items-start gap-3 px-5 py-3 font-body text-sm"
                style={{
                  border: isRateLimit
                    ? "1px solid rgba(184, 134, 11, 0.25)"
                    : "1px solid rgba(196, 30, 58, 0.25)",
                  background: isRateLimit
                    ? "rgba(184, 134, 11, 0.06)"
                    : "var(--blood-dim)",
                  color: isRateLimit
                    ? "var(--gold)"
                    : "var(--blood-bright)",
                  borderRadius: "2px",
                }}
              >
                {isRateLimit && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mt-0.5 shrink-0"
                    style={{ opacity: 0.7 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )}
                <span>{error}</span>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ---- Loading / Oracle consulting animation ---- */}
        <AnimatePresence>
          {isSubmitting && <VaultScanning />}
        </AnimatePresence>

        {/* ---- Result ---- */}
        <AnimatePresence>
          {result && !isSubmitting && (
            <motion.section className="mb-12">
              <ResultCard result={result} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ---- Past Inquiries ---- */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <h2
              className="font-display text-lg font-bold tracking-[0.08em]"
              style={{ color: "var(--bone)" }}
            >
              Past Inquiries
            </h2>
            {pastAttestations.length > 0 && (
              <span
                className="px-2 py-0.5 font-display text-[10px]"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-tertiary)",
                  borderRadius: "2px",
                }}
              >
                {pastAttestations.length}
              </span>
            )}
          </div>

          {loadingHistory ? (
            <div className="flex items-center gap-2 py-8">
              <motion.div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--text-tertiary)" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--text-tertiary)" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--text-tertiary)" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          ) : pastAttestations.length === 0 ? (
            <div
              className="py-12 text-center"
              style={{
                border: "1px dashed var(--border-subtle)",
                borderRadius: "2px",
              }}
            >
              <p
                className="font-body text-sm italic"
                style={{ color: "var(--text-tertiary)" }}
              >
                No queries yet. Be the first to consult this oracle.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pastAttestations.map((attestation, i) => (
                <AttestationRow
                  key={`${attestation.queryHash}-${attestation.timestamp}`}
                  attestation={attestation}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
