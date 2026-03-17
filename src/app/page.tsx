"use client";

import Link from "next/link";
import { motion } from "motion/react";

const steps = [
  {
    number: "I",
    label: "THE BINDING",
    title: "Deposit your data",
    description:
      "Submit private information to your personal vault. A cryptographic hash is committed onchain. Nobody sees the raw data. What enters the vault does not leave.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="4"
          y="12"
          width="20"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 12V8a5 5 0 0 1 10 0v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="19" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: "II",
    label: "THE INQUIRY",
    title: "Ask yes or no questions",
    description:
      "Anyone with access can submit natural language queries against your sealed vault. Questions are answered without exposing the underlying data. The dead tell no tales willingly.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 25c6.075 0 11-4.925 11-11S20.075 3 14 3 3 7.925 3 14s4.925 11 11 11Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M11 11a3 3 0 1 1 3.5 2.96V16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: "III",
    label: "THE VERDICT",
    title: "Truth without secrets",
    description:
      "An AI agent verifies claims against your sealed data and produces a cryptographic attestation. The proof is public. The data never leaves the vault. So it is written; so it is done.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 3l9 5v7c0 5.25-3.83 10.15-9 11.33C8.83 25.15 5 20.25 5 15V8l9-5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 14.5l3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const redactedLines = [
  { width: "70%", delay: 0.1 },
  { width: "90%", delay: 0.15 },
  { width: "55%", delay: 0.2 },
  { width: "80%", delay: 0.25 },
  { width: "45%", delay: 0.3 },
  { width: "75%", delay: 0.35 },
];

/* Small ornamental diamond for dividers */
function OrnamentDiamond({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <path d="M6 0L12 6L6 12L0 6Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6">
        {/* Crypt mist at the bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "350px",
            background:
              "linear-gradient(to top, rgba(139,0,0,0.06) 0%, rgba(139,0,0,0.03) 30%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />
        {/* Very faint radial red glow behind title */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <motion.div
          className="relative z-10 flex max-w-4xl flex-col items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Ornamental divider instead of badge */}
          <motion.div
            className="mb-10 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--gold), transparent)",
                opacity: 0.4,
              }}
            />
            <OrnamentDiamond className="text-[var(--gold)] opacity-30" />
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--gold), transparent)",
                opacity: 0.4,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-blackletter text-5xl font-bold leading-[1.05] tracking-[0.04em] text-text-primary sm:text-7xl md:text-[5.5rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          >
            Dead Man&apos;s
            <br />
            <span
              className="text-accent glow-blood-text"
              style={{
                textShadow:
                  "0 0 20px var(--blood-glow), 0 0 50px var(--blood-dim)",
              }}
            >
              Proof
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-body mt-7 max-w-lg text-lg leading-relaxed text-text-secondary italic sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            What is sealed cannot be unseen.
            <br />
            What is attested cannot be denied.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link
              href="/deposit"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-sm border border-[var(--blood)] bg-[var(--blood)] px-8 py-3.5 font-display text-sm font-semibold tracking-[0.15em] uppercase text-[var(--bone)] transition-all duration-300 hover:bg-[var(--blood-bright)] hover:shadow-[0_0_40px_var(--blood-glow)]"
            >
              <span className="relative z-10">Enter the Vault</span>
            </Link>
            <span className="font-body text-xs tracking-wide text-text-tertiary">
              No sacrifice required to begin
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator: downward dagger/cross */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="font-display text-[8px] uppercase tracking-[0.4em] text-text-tertiary">
              Descend
            </span>
            {/* Dagger/cross shape */}
            <svg
              width="14"
              height="22"
              viewBox="0 0 14 22"
              fill="none"
              className="text-text-tertiary"
            >
              <line
                x1="7"
                y1="0"
                x2="7"
                y2="22"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <line
                x1="3"
                y1="6"
                x2="11"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          THE RITUAL (How it works)
          ============================================ */}
      <section className="relative px-6 py-16 sm:py-24 md:py-36">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 sm:mb-16 md:mb-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
              The Ritual
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[0.03em] text-text-primary sm:text-4xl">
              How it works
            </h2>
            {/* Ornamental line under heading */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <div
                className="h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--gold))",
                  opacity: 0.3,
                }}
              />
              <OrnamentDiamond className="text-[var(--gold)] opacity-20" />
              <div
                className="h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), transparent)",
                  opacity: 0.3,
                }}
              />
            </div>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="grimoire-card gothic-corner-tl gothic-corner-br group relative overflow-hidden rounded-sm p-8 transition-colors duration-500 hover:border-[var(--border-medium)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: i * 0.2,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                {/* Step number as watermark */}
                <span
                  className="font-display absolute top-4 right-6 text-[80px] font-bold leading-none select-none"
                  style={{ color: "var(--border-subtle)", opacity: 0.4 }}
                >
                  {step.number}
                </span>

                {/* Icon + Label */}
                <div className="relative mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--blood-bright)]">
                    {step.icon}
                  </div>
                  <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {step.label}
                  </span>
                </div>

                {/* Content */}
                <h3 className="relative mt-6 font-display text-lg font-semibold tracking-wide text-text-primary">
                  {step.title}
                </h3>
                <p className="font-body relative mt-3 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>

                {/* Gothic cross corner decorations */}
                <div
                  className="absolute top-3 right-3 text-[8px] opacity-20"
                  style={{ color: "var(--gold)" }}
                >
                  &#10014;
                </div>
                <div
                  className="absolute bottom-3 left-3 text-[8px] opacity-20"
                  style={{ color: "var(--gold)" }}
                >
                  &#10014;
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SEALED PARCHMENT (Sample Attestation)
          ============================================ */}
      <section className="relative px-6 py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-10 sm:mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
              Exhibit
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[0.03em] text-text-primary sm:text-4xl">
              Sample attestation
            </h2>
          </motion.div>

          <motion.div
            className="parchment-border relative overflow-hidden rounded-sm bg-[var(--bg-surface)]"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            {/* Document header */}
            <div className="flex flex-col gap-2 border-b border-[var(--border-subtle)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--blood-dim)] border border-[var(--blood-bright)]/30 pulse-blood" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
                  Vault #0x7f...3a2d
                </span>
              </div>
              <span className="font-body text-[10px] text-text-tertiary">
                2026-03-16T09:41:00Z
              </span>
            </div>

            {/* Document body */}
            <div className="p-4 sm:p-6">
              {/* Query */}
              <div className="mb-6">
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                  Query
                </span>
                <p className="font-body mt-2 text-sm italic text-text-primary">
                  &quot;Does the depositor hold more than 10 ETH?&quot;
                </p>
              </div>

              {/* Sealed data (redacted) */}
              <div className="mb-6">
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                  Sealed data
                </span>
                <div className="mt-3 space-y-2.5">
                  {redactedLines.map((line, i) => (
                    <motion.div
                      key={i}
                      className="h-3 rounded-sm"
                      style={{
                        width: line.width,
                        background:
                          "linear-gradient(90deg, var(--blood-dim), rgba(139,0,0,0.12), var(--blood-dim))",
                      }}
                      initial={{ opacity: 0, scaleX: 0.3 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.4 + line.delay,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Attestation result */}
              <div className="flex items-start justify-between rounded-sm border border-[var(--blood)]/20 bg-[var(--blood-dim)] p-4">
                <div>
                  <span className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--blood-bright)]">
                    Attestation result
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[var(--blood-bright)]"
                    >
                      <path
                        d="M3 8.5l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-display text-sm font-semibold tracking-wide text-text-primary">
                      TRUE
                    </span>
                  </div>
                  <p className="font-body mt-1.5 text-[12px] leading-relaxed text-text-secondary">
                    The depositor holds more than 10 ETH. Verified against
                    sealed vault data.
                  </p>
                </div>

                {/* ATTESTED stamp (wax seal style) */}
                <motion.div
                  className="stamp ml-4 shrink-0"
                  style={{ fontSize: "10px" }}
                  initial={{ opacity: 0, scale: 1.5, rotate: -12 }}
                  whileInView={{ opacity: 0.85, scale: 1, rotate: -6 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                >
                  Attested
                </motion.div>
              </div>

              {/* Hash */}
              <div className="mt-4 flex items-center gap-2">
                <span className="font-body text-[10px] text-text-tertiary">
                  Attestation hash:
                </span>
                <code className="font-body text-[10px] text-text-tertiary">
                  0x8a3f...c91e
                </code>
                <span className="font-display ml-auto text-[10px] font-semibold tracking-wider text-[var(--blood-bright)]">
                  onchain
                </span>
              </div>
            </div>

            {/* Blood red gradient stripe at bottom */}
            <div
              className="h-1.5"
              style={{
                background:
                  "linear-gradient(90deg, var(--blood-dim), var(--blood), var(--blood-bright), var(--blood), var(--blood-dim))",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          CTA
          ============================================ */}
      <section className="px-6 py-16 sm:py-20 md:py-28">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Ornamental divider */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--gold))",
                opacity: 0.3,
              }}
            />
            <OrnamentDiamond className="text-[var(--gold)] opacity-20" />
            <div
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), transparent)",
                opacity: 0.3,
              }}
            />
          </div>

          <h2 className="font-blackletter text-3xl font-bold tracking-[0.03em] text-text-primary sm:text-4xl">
            The truth will out.
          </h2>
          <p className="font-body mt-5 max-w-md text-base leading-relaxed text-text-secondary italic">
            Seal sensitive information. Let anyone query it. Produce verifiable
            attestations. Your secrets never leave the vault.
          </p>
          <Link
            href="/deposit"
            className="group mt-10 inline-flex items-center gap-2 rounded-sm border border-[var(--blood)] bg-[var(--blood)] px-8 py-3.5 font-display text-sm font-semibold tracking-[0.15em] uppercase text-[var(--bone)] transition-all duration-300 hover:bg-[var(--blood-bright)] hover:shadow-[0_0_40px_var(--blood-glow)]"
          >
            <span>Enter the Vault</span>
          </Link>
        </motion.div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="ironwork-border relative px-6 pt-14 pb-10">
        <div className="mx-auto relative max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold tracking-[0.1em] text-text-primary">
              DMP
            </span>
            <span
              className="text-[8px] opacity-25"
              style={{ color: "var(--gold)" }}
            >
              &#10014;
            </span>
            <span className="font-body text-[11px] text-text-secondary">
              Dead Man&apos;s Proof
            </span>
          </div>

          <span className="font-body text-[10px] text-text-secondary order-last sm:order-none sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            &copy; 2026 Loser Labs
          </span>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/heathenft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4C5A9] transition-colors hover:text-text-primary"
              title="@heathenft on X"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <span className="text-text-tertiary opacity-30">|</span>
            <a
              href="https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100"
              title="View contract on BaseScan"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-[#0052FF]">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
                <path d="M7 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" fill="currentColor" />
              </svg>
              <span className="font-body text-[10px] text-text-secondary">Base</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
