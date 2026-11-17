do $$
begin
  if not exists (
    select 1
    from public.profiles
    where lower(email) = lower('presidencia@fundacioncalidad.org')
  ) then
    raise exception 'Create or update the Supabase Auth user to presidencia@fundacioncalidad.org before applying this migration.';
  end if;

  update public.profiles
  set role = 'customer'
  where lower(email) = lower('fundacioncalidad.org2026@gmail.com');

  update public.profiles
  set role = 'admin'
  where lower(email) = lower('presidencia@fundacioncalidad.org');
end;
$$;
