create table if not exists public.team_members (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    role text not null,
    bio text not null,
    image_url text not null,
    linkedin_url text,
    twitter_url text,
    github_url text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.team_members enable row level security;

create policy "Allow public read access"
    on public.team_members for select
    using (true);

create policy "Allow authenticated insert"
    on public.team_members for insert
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
    on public.team_members for update
    using (auth.role() = 'authenticated');

create policy "Allow authenticated delete"
    on public.team_members for delete
    using (auth.role() = 'authenticated');
