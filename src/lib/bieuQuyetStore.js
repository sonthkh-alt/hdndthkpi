import { supabase } from './supabase';
import { newPhien, sinhPhieuMoPhong, PHIEN_MAU, TONG_DAI_BIEU, KY_HOP_MAC_DINH } from './bieuQuyet';

// ============================================================================
//  LƯU TRỮ phân hệ "Biểu quyết Online" — một dòng app_state, id = 'bq_data'
//  (TOÀN CỤC, không theo kỳ) + cache localStorage.
//
//  • ĐỌC: mở công khai cho khách xem kết quả (BƯỚC 8 trong supabase/schema.sql).
//  • GHI LÁ PHIẾU: qua hàm RPC `bq_vote` (security definer) để đại biểu bỏ phiếu
//    được mà KHÔNG cần tài khoản — giống cơ chế `visit_hit` và `tc_unit_save`.
//    Chưa chạy SQL đó thì lá phiếu chỉ lưu trên máy đang dùng (có báo rõ).
//  • QUẢN LÝ PHIÊN (thêm nội dung, đóng/mở, xóa): cần đăng nhập, ghi thẳng
//    app_state theo chính sách app_state_auth_all.
// ============================================================================
const KEY = 'hdndkpi_bq_data';
const KEY_MA = 'hdndkpi_bq_ma';   // mã đại biểu mà thiết bị này đang dùng
const ROW_ID = 'bq_data';

export const EMPTY_BQ = { phien: [], updatedAt: '' };

// Phiên bản bộ dữ liệu mẫu — tăng số này khi thay bộ mẫu để bản cũ trên máy
// chủ / máy người dùng được thay bằng bộ mới (chỉ thay khi TOÀN BỘ là dữ liệu
// demo; đã có nội dung thật do Quản trị trình thì giữ nguyên).
const SEED_V = 2;

const normalize = (d) => ({
  // Dữ liệu cũ chưa ghi kỳ họp → gán về kỳ mặc định (tương thích ngược).
  phien: (Array.isArray(d?.phien) ? d.phien : []).map((p) => ({ ...p, kyHop: Number(p?.kyHop) || KY_HOP_MAC_DINH })),
  seedV: Number(d?.seedV) || 0,
  updatedAt: d?.updatedAt || '',
});

/** Bộ nội dung mẫu của bản demo: mỗi phiên có sẵn phiếu mô phỏng của 82 đại biểu. */
export function seedBieuQuyet() {
  // Kỳ họp MỚI NHẤT (kỳ thứ 5) đang diễn ra → mở cho người xem bấm; các kỳ trước đã xong.
  const maxKy = Math.max(...PHIEN_MAU.map((m) => Number(m.kyHop) || KY_HOP_MAC_DINH));
  // Tỷ lệ tán thành mô phỏng theo từng nghị quyết; nghị quyết cuối (phí, lệ phí
  // kỳ họp thứ 3) cố ý DƯỚI quá nửa để demo có cả trường hợp KHÔNG được thông qua.
  const tanThanh = [0.86, 0.93, 0.79, 0.88, 0.9, 0.84, 0.95, 0.82, 0.45];
  const phien = PHIEN_MAU.map((m, i) => {
    const p = { ...newPhien({ ...m, tong: TONG_DAI_BIEU }), id: `bq-mau-${i + 1}`, demo: true };
    return { ...sinhPhieuMoPhong(p, { tanThanh: tanThanh[i] ?? 0.86 }), trangThai: (Number(m.kyHop) || KY_HOP_MAC_DINH) === maxKy ? 'mo' : 'dong' };
  });
  return normalize({ phien, seedV: SEED_V });
}

/** Bộ mẫu ĐỜI CŨ (đánh số kỳ 20-21, chưa có seedV) và chưa lẫn nội dung thật? */
const laMauCu = (doc) => doc.phien.length > 0 && doc.seedV < SEED_V && doc.phien.every((p) => p.demo);

// ---- Đọc / ghi -------------------------------------------------------------
export function readBQ() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const doc = normalize(JSON.parse(raw));
      if (!laMauCu(doc)) return doc;
    }
  } catch { /* bỏ qua */ }
  return normalize(EMPTY_BQ);
}
const cache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ } return d; };

/** Ghi tạm lên máy đang dùng (dùng khi chưa/không lưu được lên máy chủ). */
export const cacheBQ = (d) => cache(normalize(d));

export async function fetchBQ() {
  if (!supabase) return readBQ();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', ROW_ID).maybeSingle();
    if (!error && data?.data?.phien?.length) {
      const doc = normalize(data.data);
      // Máy chủ còn giữ bộ mẫu đời cũ → trả bộ mẫu mới (updatedAt rỗng nên
      // người ĐĂNG NHẬP đầu tiên mở phân hệ sẽ tự lưu đè lên máy chủ).
      if (laMauCu(doc)) return cache(seedBieuQuyet());
      return cache(doc);
    }
  } catch (e) { console.warn('fetchBQ:', e); }
  return readBQ();
}

/** Ghi TOÀN BỘ (quản lý phiên) — cần phiên đăng nhập, RLS chặn khách. */
export async function saveBQ(d) {
  const doc = cache(normalize({ ...d, updatedAt: new Date().toISOString() }));
  if (!supabase) return { ok: false, reason: 'no-supabase', doc };
  const { error } = await supabase.from('app_state').upsert({ id: ROW_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveBQ:', error.message); return { ok: false, error, doc }; }
  return { ok: true, doc };
}

/**
 * Gửi một lá phiếu. Ưu tiên hàm RPC (ai cũng bỏ phiếu được, kết quả dùng chung);
 * chưa có RPC thì báo lại để giao diện nói rõ là chỉ lưu trên máy này.
 */
export async function guiPhieu(phienId, ma, chon) {
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  try {
    const { error } = await supabase.rpc('bq_vote', { p_phien: phienId, p_ma: ma, p_chon: chon });
    if (error) { console.warn('bq_vote:', error.message); return { ok: false, reason: 'no-rpc', error }; }
    return { ok: true };
  } catch (e) { console.warn('bq_vote:', e); return { ok: false, reason: 'no-rpc' }; }
}

// ---- Mã đại biểu của thiết bị ---------------------------------------------
export function readMaDaiBieu() {
  try { return localStorage.getItem(KEY_MA) || ''; } catch { return ''; }
}
export function writeMaDaiBieu(ma) {
  try { localStorage.setItem(KEY_MA, ma); } catch { /* bỏ qua */ }
  return ma;
}
