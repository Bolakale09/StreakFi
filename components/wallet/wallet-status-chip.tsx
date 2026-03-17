"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenAddress } from "@/lib/solana";
import { Chip } from "@/components/ui/chip";

type WalletStatusChipProps = {
  connectedClassName?: string;
  disconnectedClassName?: string;
};

export function WalletStatusChip({
  connectedClassName = "bg-mint text-ink",
  disconnectedClassName = "",
}: WalletStatusChipProps) {
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Chip>Wallet loading</Chip>;
  }

  if (connected && publicKey) {
    return <Chip className={connectedClassName}>{shortenAddress(publicKey.toBase58())}</Chip>;
  }

  return <Chip className={disconnectedClassName}>No wallet connected</Chip>;
}
