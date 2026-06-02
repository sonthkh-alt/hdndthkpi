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

-- Khôi phục tạm (mở lại công khai) nếu cần xử lý sự cố:
--   drop policy if exists "app_state_auth_all" on app_state;
--   create policy "demo_all" on app_state for all using (true) with check (true);
