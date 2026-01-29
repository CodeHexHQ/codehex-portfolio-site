
-- Create a new storage bucket for team photos
insert into storage.buckets (id, name, public)
values ('team_photos', 'team_photos', true);

-- Policy to allow public access to view photos
create policy "Give public access to team_photos"
  on storage.objects for select
  using ( bucket_id = 'team_photos' );

-- Policy to allow authenticated users to upload photos
create policy "Allow authenticated uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'team_photos' 
    and auth.role() = 'authenticated'
  );

-- Policy to allow authenticated users to update their photos
create policy "Allow authenticated updates"
  on storage.objects for update
  using (
    bucket_id = 'team_photos' 
    and auth.role() = 'authenticated'
  );

-- Policy to allow authenticated users to delete photos
create policy "Allow authenticated deletes"
  on storage.objects for delete
  using (
    bucket_id = 'team_photos' 
    and auth.role() = 'authenticated'
  );
