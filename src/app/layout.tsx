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
  title: "Dead Man's Proof",
  description:
    "Privacy-preserving attestations on Base. Your data stays sealed. Only the truth gets out.",
  metadataBase: new URL("https://dead-mans-proof.vercel.app"),
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
  return (
    <html lang="en">
      <body
        className={`${unifraktur.variable} ${cinzel.variable} ${crimsonText.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
