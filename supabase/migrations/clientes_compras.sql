alter table public.services
  add column if not exists price_amount_cents bigint
    check (price_amount_cents is null or price_amount_cents > 0);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  first_name text not null default '',
  last_name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert or update of email on auth.users
  for each row execute function public.handle_new_auth_user();

insert into public.profiles (id, email, first_name, last_name, role)
select
  id,
  lower(email),
  coalesce(raw_user_meta_data ->> 'first_name', ''),
  coalesce(raw_user_meta_data ->> 'last_name', ''),
  'customer'
from auth.users
where email is not null
on conflict (id) do update
  set email = excluded.email;

update public.profiles
set role = 'admin'
where email = lower('fundacioncalidad.org2026@gmail.com');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name) on public.profiles to authenticated;

drop policy if exists "Users read own or admin profiles" on public.profiles;
create policy "Users read own or admin profiles"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Customers update own names only" on public.profiles;
create policy "Customers update own names only"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()) and role = 'customer')
  with check (id = (select auth.uid()) and role = 'customer');

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete restrict,
  service_id uuid references public.services (id) on delete set null,
  service_name text not null,
  amount_cents bigint not null check (amount_cents > 0),
  currency text not null default 'COP' check (currency = 'COP'),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'failed', 'refunded')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'approved', 'declined', 'error', 'voided', 'refunded')),
  payment_reference text not null unique,
  payment_transaction_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_customer_created_at_idx
  on public.purchases (customer_id, created_at desc);
create index if not exists purchases_service_created_at_idx
  on public.purchases (service_id);

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at
  before update on public.purchases
  for each row execute function public.set_catalog_updated_at();

alter table public.purchases enable row level security;
revoke all on public.purchases from anon, authenticated;
grant select on public.purchases to authenticated;

drop policy if exists "Customers read own purchases" on public.purchases;
create policy "Customers read own purchases"
  on public.purchases
  for select
  to authenticated
  using (customer_id = (select auth.uid()));

drop policy if exists "Admins read all purchases" on public.purchases;
create policy "Admins read all purchases"
  on public.purchases
  for select
  to authenticated
  using ((select public.is_admin()));

grant all on public.purchases to service_role;
grant all on public.profiles to service_role;
