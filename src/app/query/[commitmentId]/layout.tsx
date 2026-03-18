import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query a Sealed Vault",
  description:
    "Ask yes or no questions against sealed private data. Get cryptographic attestations without the underlying data ever being revealed.",
};

export default function QueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
