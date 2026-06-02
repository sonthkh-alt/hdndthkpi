-- =====================================================================
--  HỆ THỐNG ĐÁNH GIÁ KPI — LƯỢC ĐỒ CƠ SỞ DỮ LIỆU (Supabase / PostgreSQL)
--  Chạy trong: Supabase Dashboard -> SQL Editor -> New query -> Run
--  Thực hiện theo THỨ TỰ các bước để không làm gián đoạn app đang chạy.
-- =====================================================================

-- ---------------------------------------------------------------------
-- BƯỚC 1. Bảng lưu trạng thái theo kỳ (đã dùng từ trước; an toàn chạy lại)
-- ---------------------------------------------------------------------
create table if not exists app_state (
  id text primary key,           -- 'state_2026_6' (mỗi kỳ một dòng), hoặc 'main' (bản cũ)
  data jsonb,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- BƯỚC 2. Bảng phân quyền người dùng (gắn với tài khoản đăng nhập)
--   role: 'canbo' (cán bộ) | 'truongphong' (trưởng phòng) | 'quantri' (quản trị)
--   department: tên phòng (khớp với trường "Phòng" của cán bộ) — để trưởng phòng
--               duyệt đúng phạm vi phòng mình.
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'canbo' check (role in ('canbo','truongphong','quantri')),
  department text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Mỗi người đọc được hồ sơ của chính mình
drop policy if exists "profiles_self_read" on profiles;
create policy "profiles_self_read" on profiles
  for select using (auth.uid() = id);

-- Quản trị đọc/ghi mọi hồ sơ
drop policy if exists "profiles_admin_all" on profiles;
create policy "profiles_admin_all" on profiles
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'quantri'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'quantri'));

-- ---------------------------------------------------------------------
-- BƯỚC 3. TẠO TÀI KHOẢN QUẢN TRỊ ĐẦU TIÊN
--   3a. Vào Authentication -> Users -> Add user (hoặc tự đăng nhập 1 lần qua app
--       sau khi đã bật Email magic link) để tài khoản xuất hiện trong auth.users.
--   3b. Lấy UID của tài khoản đó rồi chạy (thay <UID> và họ tên):
--
--   insert into profiles (id, full_name, role, department)
--   values ('<UID>', 'Họ tên Quản trị', 'quantri', 'Lãnh đạo Văn phòng')
--   on conflict (id) do update set role = 'quantri';
--
--   Sau đó quản trị thêm hồ sơ cho các tài khoản khác:
--   insert into profiles (id, full_name, role, department) values
--     ('<UID-2>', 'Nguyễn Văn A', 'truongphong', 'Phòng Tổng hợp'),
--     ('<UID-3>', 'Trần Thị B',  'canbo',       'Phòng Tổng hợp');
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- BƯỚC 4. SIẾT BẢO MẬT app_state — CHỈ NGƯỜI ĐÃ ĐĂNG NHẬP MỚI TRUY CẬP.
--   ⚠️ CHỈ chạy bước này SAU KHI đã:
--        (1) bật Email (magic link) trong Authentication,
--        (2) tạo hồ sơ quản trị ở Bước 3,
--        (3) deploy bản có màn hình đăng nhập (gộp nhánh feat/auth-roles vào main).
--   Nếu chạy sớm, app bản cũ (truy cập ẩn danh) sẽ không đọc được dữ liệu.
-- ---------------------------------------------------------------------
alter table app_state enable row level security;

drop policy if exists "demo_all" on app_state;       -- gỡ chính sách công khai cũ
drop policy if exists "app_state_auth_all" on app_state;
create policy "app_state_auth_all" on app_state
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
