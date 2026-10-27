import { supabase } from './supabase.js';
import { chuanHoaVTVL, EMPTY_VTVL } from './vtvl.js';

// ============================================================================
//  LƯU TRỮ của phân hệ "Bộ biểu Vị trí việc làm" — một dòng app_state,
//  id = 'vtvl_data' (TOÀN CỤC, không theo kỳ), kèm cache localStorage.
//
//  • ĐỌC: khách và người đăng nhập đọc CÙNG MỘT NGUỒN (nguyên tắc chung của hệ
//    thống) — cần policy `vtvl_data_public_read` ở BƯỚC 11 trong supabase/schema.sql.
//    Chưa chạy SQL thì khách chỉ thấy bản cache (hoặc trống).
//  • GHI: phải đăng nhập (policy app_state_auth_all) + KHÓA LẠC QUAN theo
//    `updated_at`: nhiều cán bộ nhập cùng lúc thì người lưu sau KHÔNG ghi đè mù
//    lên bản người khác vừa lưu mà nhận `{ xungDot: true }` để tải lại.
//  ⚠️ Bộ biểu không có dữ liệu cá nhân theo thiết kế (D1 dùng MÃ nguồn lực, HD
//    dặn hạn chế thông tin cá nhân) — đừng nhập họ tên, CCCD… vào đây.
// ============================================================================
const KEY = 'hdndkpi_vtvl_data';
const ROW_ID = 'vtvl_data';
export const CANH_BAO_KB = 3000; // dòng JSON lớn hơn ~3 MB thì lưu/tải chậm rõ rệt

export function readVTVL() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const o = JSON.parse(raw); return { doc: chuanHoaVTVL(o.doc || o), ts: o.ts || null, chuaLuu: !!o.chuaLuu }; }
  } catch { /* bỏ qua */ }
  return { doc: chuanHoaVTVL(EMPTY_VTVL), ts: null, chuaLuu: false };
}

/** Ghi cache cục bộ. Trả false khi trình duyệt hết chỗ (dữ liệu quá lớn). */
export function cacheVTVL(doc, ts, chuaLuu) {
  try { localStorage.setItem(KEY, JSON.stringify({ doc, ts, chuaLuu })); return true; } catch { return false; }
}

export const kichThuocKB = (doc) => Math.round(JSON.stringify(doc).length / 1024);

/** Tải bản trên máy chủ. Trả { doc, ts } hoặc null (chưa có / không đọc được). */
export async function fetchVTVL() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('app_state').select('data, updated_at').eq('id', ROW_ID).maybeSingle();
    if (error) { console.warn('fetchVTVL:', error.message); return null; }
    if (!data) return { doc: chuanHoaVTVL(EMPTY_VTVL), ts: null, trong: true };
    return { doc: chuanHoaVTVL(data.data), ts: data.updated_at };
  } catch (e) { console.warn('fetchVTVL:', e); return null; }
}

/**
 * Lưu lên máy chủ. `tsCu` = updated_at lúc tải về (null nếu máy chủ chưa có dòng).
 * Trả { ok, ts, doc } · { ok:false, xungDot:true } · { ok:false, loi }.
 */
export async function saveVTVL(docIn, tsCu) {
  const now = new Date().toISOString();
  const doc = chuanHoaVTVL({ ...docIn, capNhat: now });
  if (!supabase) return { ok: false, loi: 'Chưa cấu hình máy chủ dữ liệu.' };
  if (!tsCu) {
    const { data, error } = await supabase.from('app_state').insert({ id: ROW_ID, data: doc, updated_at: now }).select('updated_at');
    if (error) return error.code === '23505' ? { ok: false, xungDot: true } : { ok: false, loi: error.message };
    return { ok: true, ts: data?.[0]?.updated_at || now, doc };
  }
  const { data, error } = await supabase.from('app_state').update({ data: doc, updated_at: now })
    .eq('id', ROW_ID).eq('updated_at', tsCu).select('updated_at');
  if (error) return { ok: false, loi: error.message };
  if (!data || !data.length) return { ok: false, xungDot: true };
  return { ok: true, ts: data[0].updated_at, doc };
}
