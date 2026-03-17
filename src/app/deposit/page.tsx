'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

type SchemaType = 'resume' | 'financial' | 'calendar';

interface DepositResponse {
  commitmentId: string;
  dataHash: string;
  stored: boolean;
  onChain: boolean;
  txHash: string | null;
  onChainError?: string;
  onChainSkipped?: string;
  error?: string;
}

const SCHEMA_OPTIONS: {
  type: SchemaType;
  icon: string;
  title: string;
  description: string;
  placeholder: string;
}[] = [
  {
    type: 'resume',
    icon: '\u2620',
    title: 'Resume',
    description: 'Employment history, skills, credentials',
    placeholder:
      'Software Engineer at Acme Corp, 2019-2024\nLead Engineer at StartupX, 2024-present\nSkills: React, TypeScript, Solidity...',
  },
  {
    type: 'financial',
    icon: '\u2666',
    title: 'Financial',
    description: 'Balances, holdings, portfolio data',
    placeholder:
      'Asset: ETH, Balance: 15.4\nAsset: USDC, Balance: 24,500\nTotal Portfolio: $52,340...',
  },
  {
    type: 'calendar',
    icon: '\u2719',
    title: 'Calendar',
    description: 'Schedule, availability, commitments',
    placeholder:
      'Monday 9am-11am: Team Standup\nMonday 2pm-4pm: Client Call\nTuesday 10am-12pm: Free...',
  },
];

const EXPLAINER_STEPS = [
  {
    label: 'Your data is hashed using keccak256, its essence distilled',
    icon: '\u2720',
  },
  {
    label: 'The hash is committed to Base, etched in chain',
    icon: '\u26D3',
  },
  {
    label: 'Your raw data is sealed within the vault, never to surface',
    icon: '\u2694',
  },
  {
    label: 'Only yes or no attestations may be summoned forth',
    icon: '\u2666',
  },
];

export default function DepositPage() {
  const [selectedSchema, setSelectedSchema] = useState<SchemaType>('resume');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DepositResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedOption = SCHEMA_OPTIONS.find((o) => o.type === selectedSchema)!;

  const handleSeal = useCallback(async () => {
    if (!data.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: data.trim(), schemaType: selectedSchema }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || 'Something went wrong');
        return;
      }

      setResult(body as DepositResponse);
    } catch {
      setError('Network error. Could not reach the server.');
    } finally {
      setIsLoading(false);
    }
  }, [data, selectedSchema]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-[#D4C5A9] relative overflow-hidden">
      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, #050507 100%)',
        }}
      />

      {/* Faint blood-red ambient glow from top */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] z-0 rounded-full bg-[#C41E3A]/[0.03] blur-[150px]" />


      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20">
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
            The{' '}
            <span className="text-[#C41E3A]">Binding</span>
          </h1>
          <p className="text-[#8A8A8A] text-base font-serif leading-relaxed max-w-lg italic">
            What enters the vault never returns. Only its truth can be summoned.
          </p>

          {/* Decorative rule */}
          <div className="flex items-center gap-3 mt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-transparent" />
            <span className="text-[#C41E3A]/40 text-xs">&#x2720;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-transparent" />
          </div>
        </motion.div>

        {/* Schema selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <label className="block text-xs font-serif tracking-[0.2em] text-[#8A8A8A] uppercase mb-4">
            Offering Type
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SCHEMA_OPTIONS.map((option) => {
              const isSelected = selectedSchema === option.type;
              return (
                <motion.button
                  key={option.type}
                  onClick={() => {
                    setSelectedSchema(option.type);
                    setResult(null);
                    setError(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex flex-col items-start p-4 rounded-lg border transition-all duration-300 text-left cursor-pointer ${
                    isSelected
                      ? 'border-[#C41E3A]/50 bg-[#C41E3A]/[0.06]'
                      : 'border-[#1A1A1F] bg-[#0C0C10] hover:border-[#2A2A30]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="schema-glow"
                      className="absolute inset-0 rounded-lg border border-[#C41E3A]/30 shadow-[0_0_24px_-4px_rgba(196,30,58,0.2)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-2xl mb-2 opacity-60">{option.icon}</span>
                  <span className="text-sm font-sans font-semibold tracking-wide">{option.title}</span>
                  <span className="text-xs text-[#8A8A8A] mt-1 leading-snug font-serif">
                    {option.description}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Textarea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <label className="block text-xs font-serif tracking-[0.2em] text-[#8A8A8A] uppercase mb-4">
            The Offering
          </label>
          <div className="relative group">
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={selectedOption.placeholder}
              rows={8}
              disabled={isLoading}
              className="w-full bg-[#0C0C10] border border-[#1A1A1F] rounded-lg p-5 font-serif text-sm text-[#D4C5A9] placeholder:text-[#3A3A40] resize-none focus:outline-none focus:border-[#C41E3A]/40 focus:shadow-[0_0_32px_-8px_rgba(196,30,58,0.12)] transition-all duration-300 disabled:opacity-50"
            />
            <div className="absolute bottom-3 right-3 text-xs font-serif text-[#3A3A40]">
              {data.length > 0 && `${data.length} chars`}
            </div>
          </div>
        </motion.div>

        {/* Bind button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <motion.button
            onClick={handleSeal}
            disabled={isLoading || !data.trim()}
            whileHover={!isLoading && data.trim() ? { scale: 1.01 } : {}}
            whileTap={!isLoading && data.trim() ? { scale: 0.98 } : {}}
            className={`relative w-full py-4 rounded-lg font-sans font-bold text-base tracking-[0.08em] transition-all duration-300 cursor-pointer ${
              isLoading
                ? 'bg-[#C41E3A]/20 text-[#C41E3A]/60 cursor-wait'
                : data.trim()
                  ? 'bg-[#C41E3A] text-[#D4C5A9] hover:bg-[#C41E3A]/90 hover:shadow-[0_0_40px_-8px_rgba(196,30,58,0.4)]'
                  : 'bg-[#1A1A1F] text-[#3A3A40] cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-[#C41E3A]/30 border-t-[#C41E3A] rounded-full"
                  />
                  BINDING...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  BIND
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Success result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 rounded-lg border border-[#C41E3A]/30 bg-[#C41E3A]/[0.04] p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.2 }}
                  className="w-8 h-8 rounded-full bg-[#C41E3A]/20 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-[#C41E3A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <span className="text-sm font-sans font-semibold tracking-[0.06em] text-[#C41E3A]">
                  THE BINDING IS COMPLETE
                </span>
              </div>

              {/* Commitment ID */}
              <label className="block text-xs font-serif tracking-[0.15em] text-[#8A8A8A] uppercase mb-2">
                Commitment ID
              </label>
              <div
                onClick={() => copyToClipboard(result.commitmentId)}
                className="flex items-center justify-between gap-3 bg-[#050507] border border-[#1A1A1F] rounded-md px-4 py-3 mb-4 cursor-pointer hover:border-[#C41E3A]/30 transition-colors group"
              >
                <code className="text-xs font-mono text-[#D4C5A9] break-all">
                  {result.commitmentId}
                </code>
                <span className="text-xs font-serif text-[#8A8A8A] group-hover:text-[#C41E3A] transition-colors shrink-0">
                  {copied ? 'COPIED' : 'COPY'}
                </span>
              </div>

              {/* Data hash */}
              <label className="block text-xs font-serif tracking-[0.15em] text-[#8A8A8A] uppercase mb-2">
                Data Hash
              </label>
              <div className="bg-[#050507] border border-[#1A1A1F] rounded-md px-4 py-3 mb-5">
                <code className="text-xs font-mono text-[#8A8A8A] break-all">
                  {result.dataHash}
                </code>
              </div>

              {/* On-chain status */}
              <div className="flex items-center gap-2 text-xs font-serif text-[#8A8A8A] mb-5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    result.onChain ? 'bg-[#C41E3A] shadow-[0_0_6px_rgba(196,30,58,0.5)]' : 'bg-[#B8860B]'
                  }`}
                />
                {result.onChain
                  ? 'Committed onchain'
                  : result.onChainSkipped
                    ? 'Stored locally (onchain not configured)'
                    : 'Stored locally (onchain failed)'}
              </div>

              {/* Query link */}
              <Link
                href={`/query/${result.commitmentId}`}
                className="inline-flex items-center gap-2 text-sm font-sans font-semibold tracking-wide text-[#C41E3A] hover:text-[#C41E3A]/70 transition-colors"
              >
                Summon the vault
                <span className="text-xs">&rarr;</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (() => {
            const isRateLimit = /bindings|sealed for today/i.test(error);
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-10 rounded-lg border px-5 py-4 ${
                  isRateLimit
                    ? 'border-[#B8860B]/30 bg-[#B8860B]/[0.06]'
                    : 'border-[#C41E3A]/30 bg-[#C41E3A]/[0.06]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isRateLimit && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B8860B"
                      strokeWidth="1.5"
                      className="mt-0.5 shrink-0 opacity-70"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                  <p className={`text-sm font-serif ${
                    isRateLimit ? 'text-[#B8860B]' : 'text-[#C41E3A]'
                  }`}>
                    {error}
                  </p>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-[#1A1A1F] pt-12"
        >
          <h2 className="text-xs font-sans tracking-[0.25em] text-[#8A8A8A] uppercase mb-8">
            The Process
          </h2>
          <div className="space-y-5">
            {EXPLAINER_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#0C0C10] border border-[#1A1A1F] shrink-0 text-sm text-[#C41E3A]/70">
                  {step.icon}
                </div>
                <span className="text-sm text-[#8A8A8A] font-serif leading-relaxed pt-1">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>
    </main>
  );
}
