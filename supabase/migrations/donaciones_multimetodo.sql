alter table public.donations
  add column if not exists payment_method text not null default 'wompi';

alter table public.donations
  drop constraint if exists donations_amount_cents_check,
  drop constraint if exists donations_currency_check,
  drop constraint if exists donations_payment_method_check,
  alter column amount_cents drop not null;

alter table public.donations
  add constraint donations_amount_cents_check
    check (amount_cents is null or amount_cents between 100000 and 10000000000),
  add constraint donations_currency_check
    check (currency in ('COP', 'USD')),
  add constraint donations_payment_method_check
    check (payment_method in ('wompi', 'daviplata', 'paypal'));
