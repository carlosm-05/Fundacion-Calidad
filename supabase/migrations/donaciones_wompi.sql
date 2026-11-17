create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  donor_email text not null,
  donor_phone text not null,
  amount_cents bigint not null check (amount_cents between 100000 and 10000000000),
  currency text not null default 'COP' check (currency = 'COP'),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'failed')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'approved', 'declined', 'error', 'voided', 'refunded')),
  payment_reference text not null unique,
  payment_transaction_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donations_created_at_idx
  on public.donations (created_at desc);

drop trigger if exists donations_set_updated_at on public.donations;
create trigger donations_set_updated_at
  before update on public.donations
  for each row execute function public.set_catalog_updated_at();

alter table public.donations enable row level security;
revoke all on public.donations from anon, authenticated;
grant all on public.donations to service_role;
