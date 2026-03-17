"use client";

import { useEffect, useState, useTransition } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { shortenAddress } from "@/lib/solana";
import { cn } from "@/lib/utils";
import { getButtonClasses } from "@/components/ui/button";

type WalletConnectionControlsProps = {
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  connectLabel?: string;
};

export function WalletConnectionControls({
  className,
  primaryClassName,
  secondaryClassName,
  connectLabel = "Connect Wallet",
}: WalletConnectionControlsProps) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { connected, connecting, disconnect, disconnecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryLabel = !mounted
    ? connectLabel
    : connecting
      ? "Connecting..."
      : connected && publicKey
        ? shortenAddress(publicKey.toBase58())
        : connectLabel;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <button
        className={cn(
          getButtonClasses("primary"),
          primaryClassName,
        )}
        disabled={!mounted || connecting}
        onClick={() => setVisible(true)}
        type="button"
      >
        {primaryLabel}
      </button>

      {mounted && connected ? (
        <button
          className={cn(
            getButtonClasses("secondary"),
            secondaryClassName,
          )}
          disabled={disconnecting || isPending}
          onClick={() => {
            startTransition(() => {
              void disconnect();
            });
          }}
          type="button"
        >
          {disconnecting || isPending ? "Disconnecting..." : "Disconnect"}
        </button>
      ) : null}
    </div>
  );
}
