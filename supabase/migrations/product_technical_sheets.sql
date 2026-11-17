alter table public.products
  add column if not exists technical_sheet_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-technical-sheets',
  'catalog-technical-sheets',
  true,
  4194304,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view catalog technical sheets" on storage.objects;
create policy "Public can view catalog technical sheets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'catalog-technical-sheets');
