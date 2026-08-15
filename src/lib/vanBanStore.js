import { supabase } from './supabase';

// ============================================================================
//  LƯU TRỮ của phân hệ "Trợ lý AI nghiệp vụ dân cử" — một dòng app_state,
//  id = 'vb_data' (TOÀN CỤC, không theo kỳ tháng), kèm cache localStorage.
//    • kienNghi[] — kiến nghị cử tri (thay bảng `petitions` của bản Streamlit).
//    • taiLieu[]  — kho tri thức: chữ đã trích xuất từ tệp, dùng làm ngữ cảnh
//                   cho Trợ lý kỳ họp (thay ChromaDB/pgvector của bản Streamlit:
//                   không có kho vector, chọn tài liệu nào thì nạp nguyên văn bản đó).
//
//  ⚠️ Dòng này KHÔNG mở đọc công khai (kiến nghị có tên cử tri) — chỉ tài khoản
//     đã đăng nhập đọc/ghi được theo policy `app_state_auth_all`. Khách xem
//     phân hệ sẽ thấy danh sách trống.
// ============================================================================
const KEY = 'hdndkpi_vb_data';
const ROW_ID = 'vb_data';

// Giữ dung lượng dòng dữ liệu ở mức lành mạnh.
export const MAX_TAI_LIEU = 30;         // số tài liệu giữ trong kho
export const MAX_CHU_MOI_TAI_LIEU = 60000; // ký tự mỗi tài liệu

export const EMPTY_VB = { kienNghi: [], taiLieu: [], updatedAt: '' };

const mang = (v) => (Array.isArray(v) ? v : []);
const normalize = (d) => ({
  kienNghi: mang(d?.kienNghi),
  taiLieu: mang(d?.taiLieu),
  updatedAt: d?.updatedAt || '',
});

let seq = 1;
export const newId = (p = 'k') => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;

export function newKienNghi({ cuTri = '', diaBan = '', linhVuc = '', noiDung = '', trangThai = 'Mới', ketQua = '' } = {}) {
  return { id: newId('kn'), at: new Date().toISOString(), cuTri, diaBan, linhVuc, noiDung, trangThai, ketQua };
}

export function newTaiLieu({ ten = '', nhom = 'Chung', text = '', nguoiTai = '' } = {}) {
  const chu = String(text || '').slice(0, MAX_CHU_MOI_TAI_LIEU);
  return {
    id: newId('tl'), at: new Date().toISOString(), ten, nhom, nguoiTai,
    soKyTu: chu.length, batDauCat: String(text || '').length > MAX_CHU_MOI_TAI_LIEU, text: chu,
  };
}

/** Thêm tài liệu vào kho, giữ tối đa MAX_TAI_LIEU bản mới nhất. */
export const themTaiLieu = (ds, tl) => [tl, ...mang(ds)].slice(0, MAX_TAI_LIEU);

/** Thống kê nhanh cho các thẻ số liệu ở màn Kiến nghị cử tri. */
export function thongKeKienNghi(ds = []) {
  const d = mang(ds);
  const dem = (tt) => d.filter((k) => k.trangThai === tt).length;
  const theoNhom = (khoa) => {
    const m = new Map();
    for (const k of d) {
      const v = k[khoa] || '(chưa rõ)';
      m.set(v, (m.get(v) || 0) + 1);
    }
    return [...m.entries()].map(([ten, soLuong]) => ({ ten, soLuong })).sort((a, b) => b.soLuong - a.soLuong);
  };
  return {
    tong: d.length,
    moi: dem('Mới'),
    dangXuLy: dem('Đang xử lý'),
    daXong: dem('Đã xong'),
    theoLinhVuc: theoNhom('linhVuc'),
    theoDiaBan: theoNhom('diaBan'),
  };
}

// ---- Đọc / ghi -------------------------------------------------------------
export function readVB() {
  try { const raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch { /* bỏ qua */ }
  return normalize(EMPTY_VB);
}
const cache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ } return d; };

export async function fetchVB() {
  if (!supabase) return readVB();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', ROW_ID).maybeSingle();
    if (!error && data?.data) return cache(normalize(data.data));
  } catch (e) { console.warn('fetchVB:', e); }
  return readVB();
}

/** Ghi lên máy chủ. Chưa đăng nhập (RLS chặn) thì vẫn giữ được bản trên máy. */
export async function saveVB(d) {
  const doc = cache(normalize({ ...d, updatedAt: new Date().toISOString() }));
  if (!supabase) return { ok: false, reason: 'no-supabase', doc };
  const { error } = await supabase.from('app_state').upsert({ id: ROW_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveVB:', error.message); return { ok: false, error, doc }; }
  return { ok: true, doc };
}
