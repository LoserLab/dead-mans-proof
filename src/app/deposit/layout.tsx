import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seal Your Data",
  description:
    "Deposit private information into a sealed vault on Base. A cryptographic hash is committed onchain while your raw data stays private.",
  alternates: {
    canonical: "https://dead-mans-proof.vercel.app/deposit",
  },
};

export default function DepositLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
