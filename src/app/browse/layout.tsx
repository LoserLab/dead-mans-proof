import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Sealed Vaults",
  description:
    "Explore the registry of sealed vaults on Dead Man's Proof. View attestation histories and query any vault without revealing its contents.",
  alternates: {
    canonical: "https://dead-mans-proof.vercel.app/browse",
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
