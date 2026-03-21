import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is Dead Man's Proof?",
  description:
    "Learn how Dead Man's Proof lets you seal private data onchain and verify claims without revealing the underlying information. Privacy-preserving attestations built on Base.",
  alternates: {
    canonical: "https://dead-mans-proof.vercel.app/about",
  },
};

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

function Divider() {
  return (
    <div className="my-16 flex items-center justify-center gap-3">
      <div
        className="h-px w-16"
        style={{
          background: "linear-gradient(90deg, transparent, var(--gold))",
          opacity: 0.3,
        }}
      />
      <OrnamentDiamond className="text-[var(--gold)] opacity-20" />
      <div
        className="h-px w-16"
        style={{
          background: "linear-gradient(90deg, var(--gold), transparent)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}

const USE_CASES = [
  {
    title: "Hiring Verification",
    symbol: "\u2620",
    description:
      'Candidates seal their resume. Recruiters verify specific claims ("Do they have 5+ years in React?") without accessing the full document. No more oversharing in job applications.',
  },
  {
    title: "Financial Proof",
    symbol: "\u2666",
    description:
      'Users seal portfolio data. Counterparties verify holdings ("Do they hold more than $50k in stablecoins?") without seeing exact balances. Prove solvency without exposure.',
  },
  {
    title: "Availability Checking",
    symbol: "\u2719",
    description:
      'Users seal their calendar. Others check availability ("Are they free Thursday 2pm to 4pm?") without seeing the full schedule. Coordination without surveillance.',
  },
  {
    title: "Compliance Attestation",
    symbol: "\u2694",
    description:
      "Seal sensitive documents. Auditors verify compliance claims without accessing raw data. Meet requirements without handing over the keys.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-8 sm:pt-28">
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "350px",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            About
          </span>
          <h1 className="mt-4 font-blackletter text-4xl font-bold leading-[1.1] tracking-[0.04em] text-text-primary sm:text-5xl md:text-6xl">
            What Is Dead Man&apos;s{" "}
            <span
              className="text-accent"
              style={{
                textShadow:
                  "0 0 20px var(--blood-glow), 0 0 50px var(--blood-dim)",
              }}
            >
              Proof
            </span>
            ?
          </h1>
          <p className="font-body mt-6 max-w-xl text-lg leading-relaxed text-text-secondary italic">
            A privacy-preserving attestation system that lets you prove things
            about private data without ever revealing it.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            The problem with verification today
          </h2>
          <div className="font-body mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              Every time you need to prove something about yourself, you hand
              over the full picture. Want to prove you have five years of
              engineering experience? Share your entire resume. Want to prove you
              hold a certain asset balance? Reveal your whole portfolio. Want to
              confirm you&apos;re free on Thursday? Expose your entire calendar.
            </p>
            <p>
              Verification today is built on a broken assumption: that proving a
              claim requires disclosing the underlying data. This forces people
              to choose between privacy and credibility.
            </p>
            <p className="font-semibold text-text-primary">
              Dead Man&apos;s Proof eliminates that tradeoff.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* How It Works */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            The Ritual
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            How it works
          </h2>

          <div className="mt-10 space-y-10">
            {/* Step 1 */}
            <div className="grimoire-card gothic-corner-tl gothic-corner-br rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: "var(--border-subtle)", opacity: 0.5 }}
                >
                  I
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  The Binding
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Seal your data into the vault
              </h3>
              <div className="font-body mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
                <p>
                  Submit private information, whether that&apos;s a resume, financial
                  records, or a calendar. The system computes a keccak256 hash of
                  your data and publishes that hash commitment onchain to Base.
                </p>
                <p>
                  Your raw data is stored securely and never exposed. The onchain
                  hash serves as a tamper-proof anchor: if anyone tries to alter
                  the sealed data, the hash won&apos;t match.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grimoire-card gothic-corner-tl gothic-corner-br rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: "var(--border-subtle)", opacity: 0.5 }}
                >
                  II
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  The Inquiry
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Ask yes or no questions
              </h3>
              <div className="font-body mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
                <p>
                  Anyone with access to a vault&apos;s commitment ID can submit
                  natural language yes/no questions. &quot;Does this person have 5+
                  years of experience?&quot; &quot;Does the depositor hold more than 10
                  ETH?&quot; &quot;Is the person available on Tuesday afternoon?&quot;
                </p>
                <p>
                  Questions are constrained to yes/no format by design. This
                  prevents data extraction through open-ended queries and ensures
                  the underlying data stays sealed.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grimoire-card gothic-corner-tl gothic-corner-br rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: "var(--border-subtle)", opacity: 0.5 }}
                >
                  III
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  The Verdict
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Cryptographic attestation, no secrets revealed
              </h3>
              <div className="font-body mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
                <p>
                  An AI agent evaluates the query against the sealed data using
                  privacy-first inference with no data retention. The result is a
                  cryptographic attestation published onchain, containing:
                </p>
                <ul className="list-none space-y-2 pl-0">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--blood-bright)]">&#10014;</span>
                    <span><strong className="text-text-primary">Verdict</strong>: YES or NO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--blood-bright)]">&#10014;</span>
                    <span><strong className="text-text-primary">Confidence</strong>: 0 to 100% certainty score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--blood-bright)]">&#10014;</span>
                    <span><strong className="text-text-primary">Reasoning</strong>: Privacy-safe explanation that never leaks the underlying data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--blood-bright)]">&#10014;</span>
                    <span><strong className="text-text-primary">Onchain record</strong>: Permanently stored on Base with the commitment hash</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Use Cases */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            Applications
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            What you can prove without revealing
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {USE_CASES.map((useCase) => (
              <div
                key={useCase.title}
                className="grimoire-card rounded-sm p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl text-[var(--blood-bright)] opacity-70">
                    {useCase.symbol}
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-text-primary">
                    {useCase.title}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-text-secondary">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Why Venice */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            Inference
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            Why Venice AI?
          </h2>
          <div className="font-body mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              Privacy is the product. The inference layer cannot store, log, or
              train on vault data. Venice AI enforces zero data retention at the
              infrastructure level: sealed data enters the model, the attestation
              comes out, and nothing persists.
            </p>
            <p>
              The agent reasons over confidential information and then acts on it
              publicly. It evaluates private resumes, financial records, and
              calendars, then publishes verifiable attestations onchain. Venice
              makes this possible because the sensitive data never leaves the
              session boundary.
            </p>
            <p>
              No other inference provider offers this guarantee at the protocol
              level. Without it, a privacy-preserving attestation system would be
              privacy theater.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* Why Base */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            Chain
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            Why Base?
          </h2>
          <div className="font-body mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              Attestations need to be cheap, fast, and permanent. Base provides
              low transaction costs so every attestation can be committed onchain
              without friction. The Ethereum security model ensures that once an
              attestation is published, it cannot be altered or removed.
            </p>
            <p>
              The DeadMansVault smart contract stores hash commitments and
              attestation records with agent-only access control. Only the
              authorized AI agent can publish attestations, preventing
              unauthorized verdicts from entering the record.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* Security */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[0.03em] text-text-primary sm:text-3xl">
            Security model
          </h2>
          <div className="font-body mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              Privacy is the product, so the security model is built to match:
            </p>
            <ul className="list-none space-y-3 pl-0">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--blood-bright)] opacity-70">&#10014;</span>
                <span>
                  <strong className="text-text-primary">Privacy-first inference</strong>:
                  AI evaluations run with no data retention. The inference provider
                  never stores or trains on vault data.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--blood-bright)] opacity-70">&#10014;</span>
                <span>
                  <strong className="text-text-primary">Prompt injection defense</strong>:
                  Five layers of protection including input sanitization, message isolation,
                  hardened system prompts, leak detection, and output truncation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--blood-bright)] opacity-70">&#10014;</span>
                <span>
                  <strong className="text-text-primary">Rate limiting</strong>:
                  5 queries per minute per IP and 200 per day globally to prevent abuse.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--blood-bright)] opacity-70">&#10014;</span>
                <span>
                  <strong className="text-text-primary">Onchain access control</strong>:
                  Only the authorized agent wallet can publish attestations to the contract.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-3">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, transparent, var(--gold))",
                opacity: 0.3,
              }}
            />
            <OrnamentDiamond className="text-[var(--gold)] opacity-20" />
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, var(--gold), transparent)",
                opacity: 0.3,
              }}
            />
          </div>
          <h2 className="font-blackletter text-3xl font-bold tracking-[0.03em] text-text-primary sm:text-4xl">
            Ready to seal your data?
          </h2>
          <p className="font-body mt-5 max-w-md text-base leading-relaxed text-text-secondary italic">
            Your secrets enter the vault. Only the truth comes out.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/deposit"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--blood)] bg-[var(--blood)] px-8 py-3.5 font-display text-sm font-semibold tracking-[0.15em] uppercase text-[var(--bone)] transition-all duration-300 hover:bg-[var(--blood-bright)] hover:shadow-[0_0_40px_var(--blood-glow)]"
            >
              Enter the Vault
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] px-8 py-3.5 font-display text-sm font-semibold tracking-[0.15em] uppercase text-text-secondary transition-all duration-300 hover:border-[var(--border-medium)] hover:text-text-primary"
            >
              Browse Vaults
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
