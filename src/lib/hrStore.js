import { supabase } from './supabase';
import { DEFAULT_LEAD } from './hr';

// ============================================================================
// Lưu trữ dữ liệu module Quản lý cán bộ.
// Dữ liệu TOÀN CỤC (không theo kỳ đánh giá) ở bảng app_state, id = 'hr_data';
// cache localStorage để mở nhanh và vẫn xem được khi mất mạng.
// ⚠ Cần policy cho phép tài khoản đã đăng nhập đọc/ghi dòng 'hr_data' (xem supabase/schema.sql).
// ============================================================================
const KEY = 'hdndkpi_hr_data';
export const EMPTY_HR = { staff: [], duties: [], quota: {}, lead: { ...DEFAULT_LEAD }, danhBa: [], updatedAt: '' };

// ⚠️ normalize là DANH SÁCH TRẮNG các trường được giữ lại — thêm trường mới vào
// hồ sơ thì PHẢI khai ở đây, nếu không sẽ bị gọt mất ngay lúc lưu/nạp
// (bài học: trường danhBa từng "lưu xong mở lại thì biến mất" vì thiếu dòng này).
const normalize = (d) => ({
  staff: Array.isArray(d?.staff) ? d.staff : [],
  duties: Array.isArray(d?.duties) ? d.duties : [],
  quota: (d && typeof d.quota === 'object' && d.quota) || {},
  lead: { ...DEFAULT_LEAD, ...((d && typeof d.lead === 'object' && d.lead) || {}) },
  danhBa: Array.isArray(d?.danhBa) ? d.danhBa : [],   // danh bạ điện thoại (nhập ở CanBoManager)
  updatedAt: d?.updatedAt || '',
});

// Đọc nhanh từ cache localStorage (đồng bộ).
export function readHR() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* bỏ qua */ }
  return normalize(EMPTY_HR);
}

// Nạp bản mới nhất từ Supabase rồi cache lại.
export async function fetchHR() {
  if (!supabase) return readHR();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', 'hr_data').maybeSingle();
    if (!error && data?.data) {
      const d = normalize(data.data);
      try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ }
      return d;
    }
  } catch (e) { console.warn('fetchHR:', e); }
  return readHR();
}

// Lưu (chỉ Quản trị gọi): ghi cache ngay + upsert lên Supabase.
// ⚠️ Dòng hr_data còn chứa khóa `hoSo` của phân hệ HỒ SƠ CÁN BỘ (src/lib/hoSoStore.js), khóa này
// CỐ Ý không đi qua normalize (không nằm trong state của App, không cache) — nên trước khi ghi
// phải đọc lại `hoSo` đang có trên máy chủ và giữ nguyên, nếu không lưu hồ sơ 2C là XÓA SẠCH
// toàn bộ hồ sơ đã nhập từ hệ thống QLCCVC. Đọc không được thì DỪNG, không ghi liều.
export async function saveHR(d) {
  const c = normalize({ ...d, updatedAt: new Date().toISOString() });
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* bỏ qua */ }
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  const { data: cu, error: e0 } = await supabase.from('app_state').select('hoSo:data->hoSo').eq('id', 'hr_data').maybeSingle();
  if (e0) { console.warn('saveHR (đọc hoSo):', e0.message); return { ok: false, error: e0 }; }
  const row = cu?.hoSo ? { ...c, hoSo: cu.hoSo } : c;
  const { error } = await supabase.from('app_state').upsert({ id: 'hr_data', data: row, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveHR:', error.message); return { ok: false, error }; }
  return { ok: true };
}
