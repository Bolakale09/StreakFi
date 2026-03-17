import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

export function getSolanaNetwork(value?: string) {
  switch (value) {
    case WalletAdapterNetwork.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    case WalletAdapterNetwork.Testnet:
      return WalletAdapterNetwork.Testnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
}

export function getSolanaEndpoint() {
  const network = getSolanaNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK);

  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);
}

export function shortenAddress(address: string, size = 4) {
  if (address.length <= size * 2) {
    return address;
  }

  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

export function normalizeWalletAddress(address: string) {
  return new PublicKey(address.trim()).toBase58();
}
