import { supabase } from './supabase';

// ============================================================================
// CẤU HÌNH HIỂN THỊ PHIÊN BẢN (quản trị điều khiển)
//  • hidden: danh sách id phiên bản bị ẨN với người dùng thường/khách
//    (quản trị đăng nhập vẫn thấy đủ để quản lý). Mặc định tạm ẩn Cổ điển + Cải tiến.
//  • names: đổi tên hiển thị phiên bản { id: 'Tên mới' } (rỗng = dùng tên gốc).
// Lưu toàn cục ở bảng app_state (id = 'version_cfg') để áp dụng cho MỌI người truy cập;
// cache localStorage để đọc nhanh/offline. Không dùng khóa lạc quan (config nhỏ, chỉ quản trị sửa).
// ============================================================================
const KEY = 'hdndkpi_version_cfg';
export const DEFAULT_VERSION_CFG = { hidden: ['classic', 'improved'], names: {} };

const normalize = (c) => ({
  hidden: Array.isArray(c?.hidden) ? c.hidden.filter((x) => typeof x === 'string') : [...DEFAULT_VERSION_CFG.hidden],
  names: (c && typeof c.names === 'object' && c.names) || {},
});

// Đọc nhanh từ cache localStorage (đồng bộ) — dùng khi khởi tạo state/màn Đăng nhập.
export function readVersionCfg() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* bỏ qua */ }
  return normalize(DEFAULT_VERSION_CFG);
}

// Nạp bản mới nhất từ Supabase (nếu có) rồi cache lại.
export async function fetchVersionCfg() {
  if (!supabase) return readVersionCfg();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', 'version_cfg').maybeSingle();
    if (!error && data?.data) {
      const cfg = normalize(data.data);
      try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch { /* bỏ qua */ }
      return cfg;
    }
  } catch (e) { console.warn('fetchVersionCfg:', e); }
  return readVersionCfg();
}

// Lưu cấu hình (quản trị): local ngay + upsert lên Supabase cho mọi máy.
export async function saveVersionCfg(cfg) {
  const c = normalize(cfg);
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* bỏ qua */ }
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  const { error } = await supabase.from('app_state').upsert({ id: 'version_cfg', data: c, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveVersionCfg:', error.message); return { ok: false, error }; }
  return { ok: true };
}
