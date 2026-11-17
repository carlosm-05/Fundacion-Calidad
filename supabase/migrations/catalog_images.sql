alter table public.services
  add column if not exists gallery text[] not null default '{}';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-images',
  'catalog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view catalog images" on storage.objects;
create policy "Public can view catalog images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'catalog-images');
