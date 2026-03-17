import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { SolanaWalletProvider } from "@/components/providers/solana-wallet-provider";
import { ReferralAttribution } from "@/components/referral/referral-attribution";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreakFi",
  description: "Build streaks, unlock rewards, and keep your onchain habit alive.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>
          {children}
          <Suspense fallback={null}>
            <ReferralAttribution />
          </Suspense>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
