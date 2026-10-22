import { supabase } from './supabase.js';
import { seedSoTay } from './soTaySeed.js';
import { chuanHoaST, EMPTY_ST } from './soTayAI.js';

// ============================================================================
//  LƯU TRỮ của phân hệ "Sổ tay AI" — một dòng app_state, id = 'st_data'
//  (TOÀN CỤC, không theo kỳ tháng), kèm cache localStorage.
//
//  ⚠️ Dòng này ĐƯỢC mở đọc công khai (BƯỚC 9 trong supabase/schema.sql) vì theo
//     ghi chú của nhiệm vụ đăng ký, sổ tay "chỉ nạp văn bản CÔNG KHAI, không
//     mật". Quyền GHI vẫn phải đăng nhập. Nếu sau này cơ quan muốn đóng lại thì
//     gỡ policy đó, giao diện tự lùi về chế độ chỉ xem bản trên máy.
//
//  ⚠️ Nguyên văn văn bản nằm trong cùng một dòng JSON nên phải có TRẦN DUNG
//     LƯỢNG: một bộ luật dán đầy đủ có thể hơn 200.000 ký tự, vài văn bản như
//     thế là dòng dữ liệu phình lên vài MB, mỗi lần mở phân hệ lại tải về từng
//     đó. `kichThuoc()` cho giao diện cảnh báo sớm.
// ============================================================================
const KEY = 'hdndkpi_st_data';
const ROW_ID = 'st_data';

// ---- Đọc / ghi -------------------------------------------------------------
export function readST() {
  try { const raw = localStorage.getItem(KEY); if (raw) return chuanHoaST(JSON.parse(raw)); } catch { /* bỏ qua */ }
  return chuanHoaST(EMPTY_ST);
}
const cache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ } return d; };

export async function fetchST() {
  if (!supabase) return readST();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', ROW_ID).maybeSingle();
    if (!error && data?.data) return cache(chuanHoaST(data.data));
  } catch (e) { console.warn('fetchST:', e); }
  return readST();
}

export async function saveST(d) {
  const doc = cache(chuanHoaST({ ...d, updatedAt: new Date().toISOString() }));
  if (!supabase) return { ok: false, reason: 'no-supabase', doc };
  const { error } = await supabase.from('app_state').upsert({ id: ROW_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveST:', error.message); return { ok: false, error, doc }; }
  return { ok: true, doc };
}

/**
 * Chưa có sổ tay nào thì dựng bộ khởi tạo (06 sổ tay + danh mục nguồn gợi ý +
 * ngân hàng câu hỏi mẫu + dự thảo Quy tắc). Giống nguyên tắc chung của hệ thống:
 * "dữ liệu mẫu = dữ liệu chính thống" — người đăng nhập đầu tiên mở phân hệ sẽ
 * ghi bộ này lên máy chủ để mọi người cùng thấy một bản.
 */
export function khoiTaoNeuTrong(doc) {
  if (Array.isArray(doc?.soTay) && doc.soTay.length) return { doc: chuanHoaST(doc), moi: false };
  return { doc: chuanHoaST({ ...chuanHoaST(doc), ...seedSoTay() }), moi: true };
}

// ============================================================================
//  GỌI MÁY CHỦ — khóa AI nằm ở Vercel, trình duyệt KHÔNG giữ khóa.
//  (Việc đọc chữ trong tệp dùng lại /api/doctext qua `docTaiLieu` của troLyAI.js.)
//  ⚠️ Hàm trong api/ CHỈ chạy trên bản triển khai; `npm run dev` ở máy sẽ nhận 404.
// ============================================================================
async function layToken() {
  if (!supabase) return '';
  try { const { data } = await supabase.auth.getSession(); return data?.session?.access_token || ''; } catch { return ''; }
}

/** Hỏi một câu trong sổ tay. Trả { text } hoặc { error, hetLuot, hanMuc }. */
export async function hoiSoTay({ cauHoi, nguCanh, tenSoTay, lichSu = [] }) {
  const token = await layToken();
  let r;
  try {
    r = await fetch('/api/sotay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ cauHoi, nguCanh, tenSoTay, lichSu }),
    });
  } catch (e) { return { error: `Không gọi được máy chủ: ${e.message}` }; }
  if (r.status === 404) return { error: 'Chức năng hỏi đáp bằng AI chỉ chạy trên bản triển khai (Vercel), không chạy khi mở thử ở máy cá nhân.' };
  let data = null;
  try { data = await r.json(); } catch { /* không phải JSON */ }
  if (!r.ok) return { error: data?.error || `Máy chủ trả lỗi ${r.status}.`, hanMuc: data?.hanMuc, hetLuot: r.status === 429 };
  return data || {};
}

/** Số lượt gọi AI còn lại trong ngày của chính người đang mở trang. */
export async function xemHanMucSoTay() {
  const token = await layToken();
  try {
    const r = await fetch('/api/sotay', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}
