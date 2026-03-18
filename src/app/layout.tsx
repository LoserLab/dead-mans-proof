import type { Metadata } from "next";
import { Cinzel, Crimson_Text, UnifrakturMaguntia } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dead-mans-proof.vercel.app"),
  title: {
    default: "Dead Man's Proof | Privacy-Preserving Attestations on Base",
    template: "%s | Dead Man's Proof",
  },
  description:
    "Seal private data onchain and let anyone verify claims against it without revealing the underlying information. Privacy-preserving attestations built on Base.",
  keywords: [
    "privacy attestation",
    "onchain privacy",
    "Base blockchain",
    "zero-knowledge proof",
    "private data verification",
    "sealed vault",
    "cryptographic attestation",
  ],
  authors: [{ name: "Loser Labs", url: "https://x.com/heathenft" }],
  creator: "Loser Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dead-mans-proof.vercel.app",
    siteName: "Dead Man's Proof",
    title: "Dead Man's Proof | Privacy-Preserving Attestations on Base",
    description:
      "Seal private data onchain and let anyone verify claims against it without revealing the underlying information.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dead Man's Proof",
    description:
      "Seal private data onchain. Verify claims without revealing secrets. Built on Base.",
    creator: "@heathenft",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://dead-mans-proof.vercel.app",
  },
};

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#8B0000]/40 bg-[#0A0A0A]/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-blackletter text-2xl font-bold tracking-[0.08em] text-bone transition-colors hover:text-blood-bright"
        >
          DMP
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blood-bright flicker" />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-text-secondary transition-colors hover:text-bone"
            style={{ fontVariant: "small-caps" }}
          >
            Home
          </Link>
          <Link
            href="/browse"
            className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-text-secondary transition-colors hover:text-bone"
            style={{ fontVariant: "small-caps" }}
          >
            Browse
          </Link>
          <Link
            href="/deposit"
            className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-text-secondary transition-colors hover:text-bone"
            style={{ fontVariant: "small-caps" }}
          >
            Deposit
          </Link>
          <Link
            href="/about"
            className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-text-secondary transition-colors hover:text-bone"
            style={{ fontVariant: "small-caps" }}
          >
            About
          </Link>

          {/* Sealed count */}
          <div className="hidden items-center gap-3 rounded-sm border border-border-subtle bg-surface px-3 py-1.5 md:flex parchment-border">
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
              Sealed
            </span>
            <span className="font-display text-sm font-bold text-bone">
              --
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dead Man's Proof",
    url: "https://dead-mans-proof.vercel.app",
    description:
      "Seal private data onchain and let anyone verify claims against it without revealing the underlying information.",
    applicationCategory: "BlockchainApplication",
    operatingSystem: "Web",
    creator: {
      "@type": "Organization",
      name: "Loser Labs",
      url: "https://x.com/heathenft",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${unifraktur.variable} ${cinzel.variable} ${crimsonText.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
