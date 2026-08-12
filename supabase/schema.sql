-- =====================================================================
--  HỆ THỐNG ĐÁNH GIÁ KPI — LƯỢC ĐỒ CƠ SỞ DỮ LIỆU (Supabase / PostgreSQL)
--  Chạy trong: Supabase Dashboard -> SQL Editor -> New query -> Run
-- =====================================================================
--  PHÂN QUYỀN giờ quản lý NGAY TRONG TRANG WEB (không cần bảng riêng):
--    - Mặc định mọi người đăng nhập là "Cán bộ".
--    - Quản trị gốc: email trong BOOTSTRAP_ADMIN_EMAILS (src/App.jsx),
--      hiện là sonthkh@gmail.com.
--    - Quản trị vào tab "Đánh giá", đặt Email + Phòng + Vai trò cho từng cán bộ.
--  Vì vậy file này chỉ còn 2 phần: bảng dữ liệu, và (tùy chọn) siết bảo mật.
-- ---------------------------------------------------------------------
--  ĐĂNG NHẬP BẰNG MẬT KHẨU: không cần bảng riêng. Mật khẩu do Supabase Auth
--  quản lý trong auth.users; cờ "đã tạo mật khẩu" lưu ở user_metadata.pw_set.
--    - Lần đầu: người dùng nhận liên kết qua email (magic link) -> đăng nhập
--      -> ứng dụng bắt tạo mật khẩu (updateUser{ password, data:{ pw_set:true } }).
--    - Các lần sau: đăng nhập bằng email + mật khẩu (signInWithPassword).
--    - Provider Email/Password của Supabase bật sẵn theo mặc định (không cần SQL).
-- ---------------------------------------------------------------------

-- BƯỚC 1. Bảng lưu trạng thái theo kỳ (an toàn chạy lại nhiều lần)
create table if not exists app_state (
  id text primary key,           -- 'state_2026_6' (mỗi kỳ một dòng), hoặc 'main' (bản cũ)
  data jsonb,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- BƯỚC 2 (TÙY CHỌN, LÀM CUỐI CÙNG). Siết bảo mật: chỉ người ĐÃ ĐĂNG NHẬP
-- mới đọc/ghi dữ liệu. ⚠️ Chỉ chạy SAU KHI đã bật đăng nhập Email và đăng
-- nhập vào app thành công, nếu không app sẽ không đọc được dữ liệu.
-- ---------------------------------------------------------------------
alter table app_state enable row level security;

drop policy if exists "demo_all" on app_state;            -- gỡ chính sách công khai cũ
drop policy if exists "app_state_auth_all" on app_state;
create policy "app_state_auth_all" on app_state
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Cho phép MỌI NGƯỜI (kể cả KHÁCH chưa đăng nhập) ĐỌC riêng dòng cấu hình hiển thị
-- phiên bản (id = 'version_cfg') — để khách cũng nhận thiết lập ẨN/HIỆN & ĐỔI TÊN
-- phiên bản do Quản trị đặt. Ghi (insert/update) vẫn yêu cầu đăng nhập như trên.
drop policy if exists "version_cfg_public_read" on app_state;
create policy "version_cfg_public_read" on app_state
  for select using (id = 'version_cfg');

-- Khôi phục tạm (mở lại công khai) nếu cần xử lý sự cố:
--   drop policy if exists "app_state_auth_all" on app_state;
--   create policy "demo_all" on app_state for all using (true) with check (true);

-- ---------------------------------------------------------------------
-- BƯỚC 3. BỘ ĐẾM LƯỢT TRUY CẬP TRANG WEB (id = 'visit_counter')
--  ⚠️ CẦN CHẠY đoạn này trong Supabase Dashboard -> SQL Editor để footer
--  hiển thị "Lượt truy cập". Hàm security definer chạy với quyền chủ bảng
--  (bỏ qua RLS) nên KHÁCH chưa đăng nhập cũng cộng đếm được, nhưng chỉ
--  cộng +1 vào đúng dòng 'visit_counter' — không mở quyền ghi gì khác.
-- ---------------------------------------------------------------------
create or replace function visit_hit()
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into app_state (id, data, updated_at)
  values ('visit_counter', jsonb_build_object('count', 1), now())
  on conflict (id) do update
    set data = jsonb_build_object('count', coalesce((app_state.data->>'count')::bigint, 0) + 1),
        updated_at = now()
  returning (data->>'count')::bigint;
$$;

grant execute on function visit_hit() to anon, authenticated;

-- Cho phép mọi người ĐỌC số lượt truy cập (không cần đăng nhập).
drop policy if exists "visit_counter_public_read" on app_state;
create policy "visit_counter_public_read" on app_state
  for select using (id = 'visit_counter');

-- ---------------------------------------------------------------------
-- BƯỚC 4. HỒ SƠ CÁN BỘ (module Quản lý cán bộ, id = 'hr_data')
--  ⚠️ NÊN CHẠY: hồ sơ cán bộ chứa dữ liệu cá nhân nhạy cảm (ngày sinh, số
--  CCCD, số sổ BHXH, quan hệ gia đình). Chính sách "app_state_auth_all" ở
--  BƯỚC 2 cho MỌI tài khoản đã đăng nhập đọc/ghi MỌI dòng — nghĩa là cán bộ
--  thường vẫn có thể đọc 'hr_data' nếu gọi thẳng API (giao diện chỉ ẩn tab,
--  không phải cơ chế bảo mật). Đoạn dưới siết lại: chỉ email Quản trị mới
--  đọc/ghi được dòng 'hr_data'.
--  👉 Sửa danh sách email trong hai chỗ dưới cho khớp thực tế.
--  💡 TÀI KHOẢN QUẢN TRỊ "admin / Admin123": ứng dụng ánh xạ tên đăng nhập "admin"
--     sang email admin@thanhhoa.gov.vn. Muốn tài khoản này LƯU ĐƯỢC LÊN MÁY CHỦ,
--     hãy tạo user đó trong Supabase Dashboard -> Authentication -> Users -> Add user
--     (email: admin@thanhhoa.gov.vn, password: Admin123, tick "Auto Confirm User").
--     Nếu KHÔNG tạo, đăng nhập admin vẫn vào được nhưng ở chế độ "quản trị cục bộ"
--     (thao tác đầy đủ, dữ liệu chỉ lưu trên trình duyệt của máy đó).
-- ---------------------------------------------------------------------
-- Loại 'hr_data' ra khỏi chính sách chung (RLS cộng dồn kiểu OR nên phải sửa
-- chính sách cũ, thêm chính sách mới là không đủ để siết).
drop policy if exists "app_state_auth_all" on app_state;
create policy "app_state_auth_all" on app_state
  for all
  using (auth.role() = 'authenticated' and id <> 'hr_data')
  with check (auth.role() = 'authenticated' and id <> 'hr_data');

drop policy if exists "hr_data_admin_only" on app_state;
create policy "hr_data_admin_only" on app_state
  for all
  using (id = 'hr_data' and lower(coalesce(auth.jwt() ->> 'email', '')) in ('sonthkh@gmail.com', 'admin@thanhhoa.gov.vn'))
  with check (id = 'hr_data' and lower(coalesce(auth.jwt() ->> 'email', '')) in ('sonthkh@gmail.com', 'admin@thanhhoa.gov.vn'));

-- Nếu chưa chạy BƯỚC 4: module Quản lý cán bộ vẫn hoạt động (theo chính sách
-- BƯỚC 2), nhưng hồ sơ KHÔNG được bảo vệ trước tài khoản đăng nhập khác.

-- ---------------------------------------------------------------------
-- BƯỚC 5. MODULE "ĐÁNH GIÁ TIÊU CHÍ HĐND TỈNH, XÃ, PHƯỜNG" (id = 'tc_data')
--  ⚠️ CẦN CHẠY để HĐND các xã, phường (KHÔNG có tài khoản Supabase) đăng nhập
--  bằng MÃ ĐƠN VỊ + MÃ TRUY CẬP và lưu được phiếu tự đánh giá lên máy chủ.
--  Chưa chạy: module vẫn dùng được nhưng phiếu chỉ lưu trên trình duyệt của đơn vị.
--
--  Cách bảo vệ: mã truy cập KHÔNG lưu bản rõ — chỉ lưu chuỗi băm SHA-256 của
--  "mã đơn vị::mã truy cập" trong units[].hash. Vì vậy dòng 'tc_data' có thể cho
--  đọc công khai (đơn vị cần đọc để đăng nhập và xem phiếu của mình) mà không lộ
--  mã truy cập. Việc GHI đi qua hàm tc_unit_save: hàm tự kiểm tra chuỗi băm và
--  CHỈ ghi đè đúng phiếu của đơn vị đó, không cho ghi bất cứ dữ liệu nào khác.
-- ---------------------------------------------------------------------
drop policy if exists "tc_data_public_read" on app_state;
create policy "tc_data_public_read" on app_state
  for select using (id = 'tc_data');

create or replace function tc_unit_save(p_code text, p_hash text, p_year text, p_record jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  d jsonb;
  u jsonb;
  k text;
begin
  select data into d from app_state where id = 'tc_data';
  if d is null then return false; end if;

  -- Tìm đơn vị theo mã + đối chiếu chuỗi băm mã truy cập
  select elem into u
  from jsonb_array_elements(coalesce(d->'units', '[]'::jsonb)) elem
  where lower(elem->>'code') = lower(p_code)
    and elem->>'hash' = p_hash
    and coalesce((elem->>'active')::boolean, true)
  limit 1;
  if u is null then return false; end if;

  k := (u->>'id') || '::' || p_year;
  d := jsonb_set(d, array['evals', k], p_record, true);
  update app_state set data = d, updated_at = now() where id = 'tc_data';
  return true;
end;
$$;

grant execute on function tc_unit_save(text, text, text, jsonb) to anon, authenticated;

-- Ghi chú: dòng 'tc_data' được TẠO khi Quản trị (Thường trực HĐND tỉnh) đăng nhập
-- vào module và thêm đơn vị đầu tiên (ghi qua chính sách app_state_auth_all).
