"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  type WalletProviderProps,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { getSolanaEndpoint, getSolanaNetwork } from "@/lib/solana";

type SolanaWalletProviderProps = {
  children: ReactNode;
};

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  const network = getSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
  const endpoint = getSolanaEndpoint();

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  const onError = useMemo<WalletProviderProps["onError"]>(
    () => (error, adapter) => {
      console.error(`Wallet error${adapter ? ` (${adapter.name})` : ""}:`, error);
    },
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        autoConnect
        localStorageKey="streakfi-wallet"
        onError={onError}
        wallets={wallets}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
