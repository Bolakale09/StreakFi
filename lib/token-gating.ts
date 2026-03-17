import { Connection, PublicKey } from "@solana/web3.js";
import { getSolanaEndpoint, normalizeWalletAddress, shortenAddress } from "@/lib/solana";

const DEFAULT_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export type TokenGateConfig = {
  isConfigured: boolean;
  mintAddress: string | null;
  threshold: number;
  tokenSymbol: string;
  tokenProgramId: string;
};

export type TokenGateStatus = {
  isConfigured: boolean;
  isEligible: boolean;
  currentBalance: number;
  threshold: number;
  tokenSymbol: string;
  mintAddress: string | null;
  statusLabel: string;
  helperText: string;
};

let cachedConnection: Connection | null = null;

function getTokenGateConnection() {
  if (!cachedConnection) {
    cachedConnection = new Connection(getSolanaEndpoint(), "confirmed");
  }

  return cachedConnection;
}

function parseThreshold(value?: string) {
  if (!value) {
    return 25;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 25;
  }

  return parsed;
}

function readTokenGateConfig(): TokenGateConfig {
  const mintAddress = process.env.NEXT_PUBLIC_PERKS_TOKEN_MINT_ADDRESS?.trim() || null;

  return {
    isConfigured: Boolean(mintAddress),
    mintAddress,
    threshold: parseThreshold(process.env.NEXT_PUBLIC_PERKS_TOKEN_THRESHOLD),
    tokenSymbol: process.env.NEXT_PUBLIC_PERKS_TOKEN_SYMBOL?.trim() || "STREAK",
    tokenProgramId:
      process.env.NEXT_PUBLIC_PERKS_TOKEN_PROGRAM_ID?.trim() || DEFAULT_TOKEN_PROGRAM_ID,
  };
}

function sumMatchingTokenBalance(
  accounts: Awaited<ReturnType<Connection["getParsedTokenAccountsByOwner"]>>["value"],
  mintAddress: string,
) {
  return accounts.reduce((total, account) => {
    const parsedData = account.account.data;

    if (!("parsed" in parsedData)) {
      return total;
    }

    const parsedInfo = parsedData.parsed.info;

    if (parsedInfo.mint !== mintAddress) {
      return total;
    }

    const uiAmountString = parsedInfo.tokenAmount?.uiAmountString;
    const uiAmount = uiAmountString
      ? Number(uiAmountString)
      : Number(parsedInfo.tokenAmount?.uiAmount ?? 0);

    return Number.isFinite(uiAmount) ? total + uiAmount : total;
  }, 0);
}

export function formatTokenAmount(value: number) {
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(value);
  }

  if (value % 1 === 0) {
    return `${value}`;
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
}

export function getTokenGateConfig() {
  return readTokenGateConfig();
}

export function getTokenRequirementLabel(config = readTokenGateConfig()) {
  return `Hold ${formatTokenAmount(config.threshold)} ${config.tokenSymbol}`;
}

export function getMintLabel(mintAddress: string | null) {
  if (!mintAddress) {
    return "Mint not configured";
  }

  return shortenAddress(mintAddress, 6);
}

export async function getTokenGateStatus(walletAddress: string): Promise<TokenGateStatus> {
  const config = readTokenGateConfig();

  if (!config.isConfigured || !config.mintAddress) {
    return {
      isConfigured: false,
      isEligible: false,
      currentBalance: 0,
      threshold: config.threshold,
      tokenSymbol: config.tokenSymbol,
      mintAddress: null,
      statusLabel: "Perks locked",
      helperText: "Add the token mint in your env file to turn on live perk checks.",
    };
  }

  try {
    const owner = new PublicKey(normalizeWalletAddress(walletAddress));
    const programId = new PublicKey(config.tokenProgramId);
    const connection = getTokenGateConnection();
    const accounts = await connection.getParsedTokenAccountsByOwner(owner, { programId });
    const currentBalance = sumMatchingTokenBalance(accounts.value, config.mintAddress);
    const isEligible = currentBalance >= config.threshold;

    return {
      isConfigured: true,
      isEligible,
      currentBalance,
      threshold: config.threshold,
      tokenSymbol: config.tokenSymbol,
      mintAddress: config.mintAddress,
      statusLabel: isEligible ? "Perks unlocked" : "Perks locked",
      helperText: isEligible
        ? `This wallet meets the ${formatTokenAmount(config.threshold)} ${config.tokenSymbol} access threshold.`
        : `Hold ${formatTokenAmount(config.threshold)} ${config.tokenSymbol} to unlock premium app perks.`,
    };
  } catch {
    return {
      isConfigured: true,
      isEligible: false,
      currentBalance: 0,
      threshold: config.threshold,
      tokenSymbol: config.tokenSymbol,
      mintAddress: config.mintAddress,
      statusLabel: "Perks locked",
      helperText: "We could not verify token holdings right now. Check the mint, program, and RPC settings.",
    };
  }
}
