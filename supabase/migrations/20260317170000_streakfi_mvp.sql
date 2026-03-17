create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  wallet_address text primary key,
  username text,
  avatar_url text,
  referral_code text not null unique,
  referred_by_wallet_address text references public.users(wallet_address) on delete set null,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  total_check_ins integer not null default 0,
  reward_balance integer not null default 0,
  last_check_in_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null references public.users(wallet_address) on delete cascade,
  check_in_date date not null,
  streak_count integer not null,
  reward_amount integer not null default 0,
  created_at timestamptz not null default now(),
  unique (wallet_address, check_in_date)
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null references public.users(wallet_address) on delete cascade,
  amount integer not null,
  reward_type text not null check (reward_type in ('daily_check_in', 'streak_milestone_bonus', 'referral_bonus', 'manual_bonus')),
  reference_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_wallet_address text not null references public.users(wallet_address) on delete cascade,
  referee_wallet_address text references public.users(wallet_address) on delete set null,
  referral_code text not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  bonus_amount integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists check_ins_wallet_address_idx on public.check_ins (wallet_address, check_in_date desc);
create index if not exists rewards_wallet_address_idx on public.rewards (wallet_address, created_at desc);
create index if not exists referrals_referrer_wallet_address_idx on public.referrals (referrer_wallet_address, created_at desc);
create unique index if not exists referrals_referee_wallet_address_unique_idx
on public.referrals (referee_wallet_address)
where referee_wallet_address is not null;
create unique index if not exists referrals_referrer_referee_unique_idx
on public.referrals (referrer_wallet_address, referee_wallet_address)
where referee_wallet_address is not null;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.check_ins enable row level security;
alter table public.rewards enable row level security;
alter table public.referrals enable row level security;
