create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  model text check (model is null or char_length(model) <= 160),
  description text not null check (char_length(btrim(description)) between 1 and 4000),
  price text check (price is null or char_length(price) <= 120),
  gallery text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text not null check (char_length(btrim(description)) between 1 and 4000),
  price text check (price is null or char_length(price) <= 120),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_created_at_idx
  on public.products (is_active, created_at);
create index if not exists services_active_created_at_idx
  on public.services (is_active, created_at);

create or replace function public.set_catalog_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_catalog_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_catalog_updated_at();

alter table public.products enable row level security;
alter table public.services enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Anyone can read active services" on public.services;
create policy "Anyone can read active services"
  on public.services
  for select
  to anon, authenticated
  using (is_active = true);

grant select on public.products, public.services to anon, authenticated;
revoke insert, update, delete on public.products, public.services from anon, authenticated;
grant all on public.products, public.services to service_role;

insert into public.products (id, name, model, description, gallery, is_active)
values
  ('db46a0cf-1d3f-4eeb-beb3-c7f133ff4ce1', 'El asador', 'TRIPAG 01 80 FNB', 'Fundación Calidad', '{}', true),
  ('db46a0cf-1d3f-4eeb-beb3-c7f133ff4ce2', 'El remolque con la Trituradora Tritupag', null, 'Fundación Calidad', '{}', true),
  ('db46a0cf-1d3f-4eeb-beb3-c7f133ff4ce3', 'La cortadora de césped', null, 'Fundación Calidad', '{}', true)
on conflict (id) do nothing;

insert into public.services (id, name, description, is_active)
values
  ('e10ec53c-e21f-40f3-956c-1dd9e75c2f11', 'Servicio 1', 'Descripción del Servicio 1 (PROVISIONAL).', true),
  ('e10ec53c-e21f-40f3-956c-1dd9e75c2f12', 'Servicio 2', 'Descripción del Servicio 2 (PROVISIONAL).', true),
  ('e10ec53c-e21f-40f3-956c-1dd9e75c2f13', 'Servicio 3', 'Descripción del Servicio 3 (PROVISIONAL).', true)
on conflict (id) do nothing;
