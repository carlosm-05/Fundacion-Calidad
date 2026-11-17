alter table public.donations
  drop constraint if exists donations_amount_cents_check;

alter table public.donations
  add constraint donations_amount_cents_check
    check (
      amount_cents is null
      or (
        currency = 'COP'
        and amount_cents between 100000 and 10000000000
      )
      or (
        currency = 'USD'
        and amount_cents between 100 and 10000000000
      )
    );
