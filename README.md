# StreakFi

StreakFi is a mobile-first Solana consumer app MVP focused on one simple behavior: helping users show up every day. Users connect a wallet, complete a daily check-in, build a streak, earn app-level reward points, invite friends, and unlock premium perks when they hold the project token.

Built for hackathon demo speed, the product is designed to feel like a real consumer app instead of a crypto dashboard.

## Project Overview

StreakFi turns daily engagement into a lightweight habit loop:

- show up once a day
- keep your streak alive
- earn rewards for consistency
- invite friends and earn referral bonuses
- unlock premium perks with token ownership

The current implementation is an MVP with a polished UI, live wallet connect, Supabase-backed app state, and a clean path to future onchain/token expansion.

## Problem

Many crypto products struggle with retention. Users may connect once, claim something once, and disappear. The experience often feels transactional, technical, or too finance-heavy for everyday use.

That creates two problems:

- users do not have a simple reason to come back daily
- token ownership often lacks clear, product-level utility

## Solution

StreakFi reframes engagement as a consumer habit product. Instead of asking users to understand DeFi mechanics, it gives them a friendly daily action with visible progress, lightweight rewards, referrals, and premium access tied to token ownership.

The result is a cleaner product loop:

1. Connect wallet
2. Check in once per day
3. Grow a streak and earn rewards
4. Bring in friends with referrals
5. Unlock extra perks by holding the token

## Core Features

- Daily check-in flow with one check-in allowed per UTC day
- Streak tracking with reset logic if a day is missed
- Reward points for daily check-ins
- Bonus rewards for 7-day streak milestones
- Referral codes and invite links
- One-time referral bonus for the referrer after the invited user completes their first valid check-in
- Token-gated perks card with locked and unlocked states
- Solana wallet connection using standard wallet adapter libraries
- Mobile-first landing page and dashboard UI

## User Flow

### 1. Landing

The user lands on the product page, sees the core value proposition, and can connect a wallet from the hero or top navigation.

### 2. Wallet Connect

The app supports standard Solana wallet connection through wallet adapter UI. Once connected, the dashboard can load live user data.

### 3. Dashboard

The dashboard acts as the daily home screen and shows:

- current streak
- today’s check-in state
- reward balance and recent reward history
- referral code and invite link
- token-gated perk state

### 4. Daily Check-In

If the user has not checked in today, they can tap `Check in now`.

Server-side logic:

- validates the wallet address
- prevents duplicate same-day check-ins
- updates streak count
- grants daily rewards
- grants 7-day streak milestone bonus when applicable

### 5. Referral Bonus

If a new user enters through a referral link and completes their first valid check-in:

- the referral relationship is stored
- the referrer receives a one-time referral bonus reward

### 6. Token-Gated Perks

The dashboard checks whether the connected wallet meets a configured token threshold. If it does, premium perks render as unlocked. Otherwise, the perks remain locked with a clear requirement shown in the UI.

## Token Utility

In this MVP, the project token unlocks premium in-app perks rather than triggering direct token transfers.

Current token utility:

- access gating for premium perk states
- a visible threshold users can understand
- a clean UX bridge between product usage and token ownership

Why this matters:

- it gives the token clear product utility
- it keeps the experience consumer-friendly
- it leaves room to connect future reward distribution, partner access, and loyalty tiers

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Solana Wallet Adapter
- `@solana/web3.js`
- Supabase

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- a Supabase project for persistence
- a Solana wallet such as Phantom or Solflare

### Install

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env.local` and fill in the required values.

### Run Locally

```bash
npm run dev
```

### Validation

```bash
npm run typecheck
npm run build
```

### Supabase Schema

Apply the migration in:

`supabase/migrations/20260317170000_streakfi_mvp.sql`

This creates the minimal MVP tables for users, check-ins, rewards, and referrals.

### Windows Note

This repo includes a small Next runner in `scripts/next-runner.mjs` so Windows can fall back to the installed WASM SWC package if the native compiler is unavailable.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_PERKS_TOKEN_MINT_ADDRESS=
NEXT_PUBLIC_PERKS_TOKEN_THRESHOLD=25
NEXT_PUBLIC_PERKS_TOKEN_SYMBOL=STREAK
NEXT_PUBLIC_PERKS_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is used only on the server for MVP data operations
- `NEXT_PUBLIC_SOLANA_RPC_URL` is optional; if blank, the app falls back to the selected cluster URL
- `NEXT_PUBLIC_PERKS_TOKEN_MINT_ADDRESS` controls which token is checked for perk access
- `NEXT_PUBLIC_PERKS_TOKEN_THRESHOLD` controls how much of that token is required to unlock perks

## Architecture Summary

The app is intentionally simple and hackathon-friendly.

### Frontend

- `app/page.tsx`: landing page
- `app/dashboard/page.tsx`: dashboard route
- reusable UI and card components under `components/`

### Wallet Layer

- app-level Solana provider in `components/providers/solana-wallet-provider.tsx`
- wallet connect and status UI in `components/wallet/`

### API Layer

- `app/api/dashboard/route.ts`: returns dashboard data for a wallet
- `app/api/check-in/route.ts`: processes daily check-ins

### Data Layer

- `lib/supabase/mvp-data.ts`: thin server-side CRUD and business logic
- `lib/dashboard-view.ts`: maps stored data into dashboard UI state
- `lib/streaks.ts`: date and streak utilities
- `lib/rewards.ts`: reward and milestone helpers
- `lib/referrals.ts`: referral code and invite helpers
- `lib/token-gating.ts`: isolated token holding check for perks

### Database

Minimal Supabase tables:

- `users`
- `check_ins`
- `rewards`
- `referrals`

Wallet address is the primary user identity key across the MVP.

## Reward and Streak Logic

### Streaks

- one check-in per UTC day
- if the last check-in was yesterday, streak increases
- if a day is missed, streak resets to `1`
- duplicate same-day check-ins are blocked

### Rewards

- base reward for each successful daily check-in
- bonus reward on 7-day streak milestones
- append-only reward history stored in Supabase

### Referrals

- each user has a referral code
- a pending referral is recorded when a new user arrives through a code
- the referrer gets a one-time bonus after the referred user completes their first valid check-in

## Token-Gated Perks

The token-gating check is isolated in:

`lib/token-gating.ts`

Current behavior:

1. The dashboard checks the connected wallet’s token accounts through Solana RPC.
2. If the wallet holds at least the configured threshold for the configured mint, perks render as unlocked.
3. Otherwise, the card stays locked and explains what is required.

This keeps the UI stable while making it easy to replace the check later with Token-2022, staking receipts, escrow balances, or another production source of truth.

## Future Roadmap

- Replace app-level reward points with real token reward distribution or claim eligibility
- Add authenticated wallet profile setup and optional usernames/avatar upload
- Add streak freeze or recovery mechanics
- Add deeper perk tiers and partner rewards
- Add notification/reminder flows for missed check-ins
- Add analytics and referral funnel tracking
- Add production-grade auth, RLS, and auditing around all wallet-linked actions

## Reused Code Disclosure

This project uses standard open-source frameworks and libraries, including:

- Next.js
- Tailwind CSS
- Supabase
- Solana Wallet Adapter
- `@solana/web3.js`

The app architecture, UI composition, MVP business logic, and feature flows in this repo were assembled specifically for StreakFi. No proprietary smart contracts or third-party closed-source app code are bundled here.

## Demo Summary

For judges and reviewers, the easiest way to understand the MVP is:

1. Open the landing page
2. Connect a wallet
3. Open the dashboard
4. Trigger a daily check-in
5. View rewards, referral UI, and perk state

That end-to-end loop is the core StreakFi story: daily consumer engagement on Solana with visible progress, lightweight rewards, and token-linked utility.
