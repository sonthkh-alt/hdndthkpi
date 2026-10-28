import { supabase } from './supabase.js';
import { chuanHoaVTVL, EMPTY_VTVL } from './vtvl.js';
import { ID_TINH, idTuSlug, moBoc, gopTinh, mucDanhSach, laIdDonVi, TEN_TINH, kiemTraMaSua } from './vtvlDonVi.js';

// ============================================================================
//  LƯU TRỮ của phân hệ "Bộ biểu Vị trí việc làm" — MỖI ĐƠN VỊ MỘT DÒNG app_state:
//     vtvl_data       → Văn phòng Đoàn ĐBQH và HĐND tỉnh (bản MẶC ĐỊNH, giữ id cũ)
//     vtvl_dv_<slug>  → HĐND xã, phường do khách tự tạo
//
//  • ĐỌC: khách và người đăng nhập đọc CÙNG MỘT NGUỒN (nguyên tắc chung của hệ
//    thống). Đọc thẳng bằng policy `vtvl_data_public_read` (BƯỚC 11 supabase/schema.sql);
//    chưa chạy SQL đó thì tự lùi về `GET /api/vtvl` (api/vtvl.js).
//  • GHI bộ biểu của TỈNH: phải đăng nhập (policy app_state_auth_all), ghi thẳng
//    từ trình duyệt + KHÓA LẠC QUAN theo `updated_at` → người lưu sau không ghi đè
//    mù lên bản người khác vừa lưu mà nhận `{ xungDot: true }` để tải lại.
//  • GHI bộ biểu của XÃ, PHƯỜNG: đi qua `POST /api/vtvl` vì cán bộ xã KHÔNG có tài
//    khoản trên hệ thống này. Mọi chốt chặn nằm ở máy chủ (xem đầu api/vtvl.js).
//    ⚠️ Đường này KHÔNG tự lưu theo nhịp 1,5 giây như bản của tỉnh — mỗi lần ghi là
//    một lượt gọi hàm máy chủ có đếm hạn mức, nên người dùng bấm "Lưu" thì mới ghi.
//
//  ⚠️ Bộ biểu không có dữ liệu cá nhân theo thiết kế (D1 dùng MÃ nguồn lực, HD
//    dặn hạn chế thông tin cá nhân) — đừng nhập họ tên, CCCD… vào đây.
// ============================================================================
const KEY_TINH = 'hdndkpi_vtvl_data';       // giữ nguyên khóa cũ → bản nháp đang có không mất
const KEY_MA = 'hdndkpi_vtvl_ma';           // { <slug>: <mã sửa> } — mã của chính máy này
export const CANH_BAO_KB = 3000;            // dòng JSON lớn hơn ~3 MB thì lưu/tải chậm rõ rệt

/** Mỗi đơn vị một khóa cache riêng — đổi đơn vị không được làm mất bản nháp của đơn vị trước. */
const khoaCache = (slug) => (slug ? `hdndkpi_vtvl_dv_${slug}` : KEY_TINH);

export function readVTVL(slug = '') {
  try {
    const raw = localStorage.getItem(khoaCache(slug));
    if (raw) { const o = JSON.parse(raw); return { doc: chuanHoaVTVL(o.doc || o), ts: o.ts || null, chuaLuu: !!o.chuaLuu }; }
  } catch { /* bỏ qua */ }
  return { doc: chuanHoaVTVL(EMPTY_VTVL), ts: null, chuaLuu: false };
}

/** Ghi cache cục bộ. Trả false khi trình duyệt hết chỗ (dữ liệu quá lớn). */
export function cacheVTVL(slug, doc, ts, chuaLuu) {
  try { localStorage.setItem(khoaCache(slug), JSON.stringify({ doc, ts, chuaLuu })); return true; } catch { return false; }
}

export const kichThuocKB = (doc) => Math.round(JSON.stringify(doc).length / 1024);

// ---------------------------------------------------------------------------
//  MÃ SỬA của các bộ biểu do chính máy này tạo
//  (máy chủ chỉ lưu chuỗi băm — xem api/vtvl.js; mất mã thì vẫn xem được)
// ---------------------------------------------------------------------------
function docSoMa() {
  try { const o = JSON.parse(localStorage.getItem(KEY_MA) || '{}'); return o && typeof o === 'object' ? o : {}; } catch { return {}; }
}
export const maSuaCua = (slug) => (slug ? String(docSoMa()[slug] || '') : '');
export function nhoMaSua(slug, ma) {
  if (!slug) return;
  const km = kiemTraMaSua(ma);
  try { localStorage.setItem(KEY_MA, JSON.stringify({ ...docSoMa(), [slug]: km.ok ? km.ma : '' })); } catch { /* bỏ qua */ }
}
export function xoaMaSua(slug) {
  try { const o = docSoMa(); delete o[slug]; localStorage.setItem(KEY_MA, JSON.stringify(o)); } catch { /* bỏ qua */ }
}

// ---------------------------------------------------------------------------
//  ĐỌC
// ---------------------------------------------------------------------------

/**
 * Đọc một bộ biểu qua điểm máy chủ (khóa bí mật nằm trên Vercel). Dùng khi trình
 * duyệt đọc thẳng ra rỗng — tức khách khi BƯỚC 11 chưa chạy. Chạy `npm run dev` thì
 * không có hàm api/ (trả trang HTML) → bỏ qua, trả null.
 */
async function docQuaMayChu(slug) {
  try {
    const r = await fetch(`/api/vtvl${slug ? `?dv=${encodeURIComponent(slug)}` : ''}`, { cache: 'no-store' });
    if (!r.ok || !(r.headers.get('content-type') || '').includes('application/json')) return null;
    const j = await r.json();
    return j?.doc ? { doc: chuanHoaVTVL(j.doc), ts: j.ts || null, ten: j.ten || '', quaMayChu: true } : null;
  } catch { return null; }
}

/** Tải bản trên máy chủ của một đơn vị. Trả { doc, ts, … } hoặc null (không đọc được). */
export async function fetchVTVL(slug = '') {
  const id = idTuSlug(slug);
  let trong = false;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('app_state').select('data, updated_at').eq('id', id).maybeSingle();
      if (error) console.warn('fetchVTVL:', error.message);
      else if (data) {
        const b = moBoc(data.data);
        if (b.doc) return { doc: chuanHoaVTVL(b.doc), ts: data.updated_at, ten: b.ten };
        trong = true;
      } else trong = true; // không có dòng HOẶC RLS chặn khách — hai trường hợp này trả giống nhau
    } catch (e) { console.warn('fetchVTVL:', e); }
  }
  const qua = await docQuaMayChu(slug);
  if (qua) return qua;
  return trong ? { doc: chuanHoaVTVL(EMPTY_VTVL), ts: null, trong: true } : null;
}

/**
 * Danh sách các đơn vị đã có bộ biểu.
 * ĐI QUA MÁY CHỦ TRƯỚC: policy công khai chỉ mở đúng dòng của tỉnh nên khách đọc
 * thẳng sẽ ra danh sách THIẾU — mà thiếu thì không nhận ra được, nguy hiểm hơn là
 * không đọc được. Đọc thẳng chỉ dùng làm đường lùi khi không có hàm api/ (npm run dev).
 */
export async function fetchDanhSachDV() {
  try {
    const r = await fetch('/api/vtvl?ds=1', { cache: 'no-store' });
    if (r.ok && (r.headers.get('content-type') || '').includes('application/json')) {
      const j = await r.json();
      if (Array.isArray(j?.ds)) return gopTinh(j.ds);
    }
  } catch { /* lùi về đọc thẳng */ }
  if (supabase) {
    try {
      const { data, error } = await supabase.from('app_state')
        .select('id, updated_at, ten:data->>ten, tomTat:data->tomTat').like('id', 'vtvl_%');
      if (!error && Array.isArray(data)) {
        return gopTinh(data
          .filter((r) => r.id === ID_TINH || laIdDonVi(r.id))
          .map((r) => {
            const tt = r.tomTat && typeof r.tomTat === 'object' ? r.tomTat : {};
            return mucDanhSach({
              id: r.id, ten: r.id === ID_TINH ? TEN_TINH : r.ten,
              nguoi: tt.nguoi, capNhat: tt.capNhat || r.updated_at, soDong: tt.soDong, soVT: tt.soVT,
            });
          }));
      }
    } catch { /* bỏ qua */ }
  }
  return gopTinh([]);
}

// ---------------------------------------------------------------------------
//  GHI
// ---------------------------------------------------------------------------

/**
 * Thẻ đăng nhập để máy chủ biết người gửi là ai (api/_lib/xacThuc.js hỏi lại
 * Supabase). Khách không có thẻ → trả rỗng, khi đó máy chủ đòi mã sửa.
 */
async function layToken() {
  if (!supabase) return '';
  try { const { data } = await supabase.auth.getSession(); return data?.session?.access_token || ''; } catch { return ''; }
}

/**
 * Lưu bộ biểu của CƠ QUAN TỈNH (dòng vtvl_data) — ghi thẳng, phải đăng nhập.
 * `tsCu` = updated_at lúc tải về (null nếu máy chủ chưa có dòng).
 * Trả { ok, ts, doc } · { ok:false, xungDot:true } · { ok:false, loi }.
 */
export async function saveVTVL(docIn, tsCu, nguoi = '') {
  const now = new Date().toISOString();
  const doc = chuanHoaVTVL({ ...docIn, capNhat: now, nguoiCapNhat: nguoi || docIn?.nguoiCapNhat || '' });
  if (!supabase) return { ok: false, loi: 'Chưa cấu hình máy chủ dữ liệu.' };
  if (!tsCu) {
    const { data, error } = await supabase.from('app_state').insert({ id: ID_TINH, data: doc, updated_at: now }).select('updated_at');
    if (error) return error.code === '23505' ? { ok: false, xungDot: true } : { ok: false, loi: error.message };
    return { ok: true, ts: data?.[0]?.updated_at || now, doc };
  }
  const { data, error } = await supabase.from('app_state').update({ data: doc, updated_at: now })
    .eq('id', ID_TINH).eq('updated_at', tsCu).select('updated_at');
  if (error) return { ok: false, loi: error.message };
  if (!data || !data.length) return { ok: false, xungDot: true };
  return { ok: true, ts: data[0].updated_at, doc };
}

/**
 * Lưu bộ biểu của một HĐND XÃ, PHƯỜNG qua `POST /api/vtvl`.
 * Khách gửi kèm `maSua`; người đã đăng nhập gửi kèm thẻ Bearer và được miễn mã.
 * Trả { ok, ts, doc, maSua? } · { ok:false, xungDot:true } · { ok:false, loi, canMaSua? }.
 */
export async function luuDonVi({ ten, slug, doc: docIn, tsCu, maSua = '', nguoi = '' }) {
  const now = new Date().toISOString();
  const doc = chuanHoaVTVL({ ...docIn, donVi: docIn?.donVi || ten, capNhat: now, nguoiCapNhat: nguoi || docIn?.nguoiCapNhat || '' });
  const token = await layToken();
  try {
    const r = await fetch('/api/vtvl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ ten, doc, tsCu: tsCu || null, maSua: maSua || undefined }),
    });
    if (!(r.headers.get('content-type') || '').includes('application/json')) {
      return { ok: false, loi: 'Máy chủ chưa chạy hàm lưu dữ liệu (chạy thử tại máy thì không có hàm api/).' };
    }
    const j = await r.json();
    if (r.ok && j?.ok) {
      const kq = { ok: true, ts: j.ts || null, doc: chuanHoaVTVL(j.doc || doc), ten: j.ten || ten, slug: j.slug || slug };
      if (j.maSua) { nhoMaSua(j.slug || slug, j.maSua); kq.maSua = j.maSua; }
      return kq;
    }
    if (r.status === 409 || j?.xungDot) return { ok: false, xungDot: true, loi: j?.loi || '' };
    return { ok: false, loi: j?.loi || `Máy chủ trả lỗi ${r.status}.`, canMaSua: !!j?.canMaSua };
  } catch (e) {
    return { ok: false, loi: `Không gửi được lên máy chủ (${e.message}).` };
  }
}

/** Bộ biểu rỗng cho một đơn vị mới tạo. */
export function docMoiChoDonVi(ten) {
  return chuanHoaVTVL({ ...EMPTY_VTVL, donVi: ten, ky: String(new Date().getFullYear()) });
}
