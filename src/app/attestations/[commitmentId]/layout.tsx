import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attestation Record",
  description:
    "View the complete attestation history for a sealed vault. Every query and verdict is recorded as a cryptographic proof on Base.",
};

export default function AttestationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
