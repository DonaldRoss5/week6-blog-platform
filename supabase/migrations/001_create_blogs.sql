create table public.blogs (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (char_length(trim(title)) between 3 and 120),

  excerpt text not null
    check (char_length(trim(excerpt)) between 10 and 250),

  content text not null
    check (char_length(trim(content)) >= 50),

  author_id uuid not null
    default auth.uid()
    references auth.users(id)
    on delete cascade,

  author_name text not null
    check (char_length(trim(author_name)) between 2 and 80),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blogs_author_id_idx
  on public.blogs (author_id);

create index blogs_created_at_idx
  on public.blogs (created_at desc);

alter table public.blogs enable row level security;

revoke all privileges
  on table public.blogs
  from anon, authenticated;

grant select
  on table public.blogs
  to anon, authenticated;

grant insert, update, delete
  on table public.blogs
  to authenticated;

create policy "Blogs are publicly readable"
  on public.blogs
  for select
  to anon, authenticated
  using (true);

create policy "Users can create their own blogs"
  on public.blogs
  for insert
  to authenticated
  with check (
    (select auth.uid()) = author_id
  );

create policy "Users can update their own blogs"
  on public.blogs
  for update
  to authenticated
  using (
    (select auth.uid()) = author_id
  )
  with check (
    (select auth.uid()) = author_id
  );

create policy "Users can delete their own blogs"
  on public.blogs
  for delete
  to authenticated
  using (
    (select auth.uid()) = author_id
  );