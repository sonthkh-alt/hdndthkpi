-- Chạy trong Supabase: SQL Editor -> New query -> dán -> Run
create table if not exists app_state (
  id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);

-- Bản DEMO: cho phép đọc/ghi công khai bằng anon key.
-- KHI LÀM THẬT: siết lại policy theo người dùng đăng nhập.
alter table app_state enable row level security;

drop policy if exists "demo_all" on app_state;
create policy "demo_all" on app_state
  for all using (true) with check (true);
