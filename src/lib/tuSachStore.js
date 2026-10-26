import { supabase } from './supabase.js';
import { seedTuSach } from './tuSachSeed.js';
import { chuanHoaTS, EMPTY_TS } from './tuSach.js';

// ============================================================================
//  LƯU TRỮ của phân hệ "Tủ sách" — một dòng app_state, id = 'sach_data'
//  (TOÀN CỤC, không theo kỳ), kèm cache localStorage.
//
//  ⚠️ Dòng này ĐƯỢC mở đọc công khai (BƯỚC 10 trong supabase/schema.sql): tủ
//     sách là nơi GIỚI THIỆU sách nên khách vào xem được là đúng mục đích.
//     Quyền GHI vẫn phải đăng nhập.
//
//  ⚠️ Ở đây CHỈ lưu phần giới thiệu (bìa, tóm tắt, mục lục, đường dẫn tệp).
//     Bản toàn văn là tệp tĩnh trong `public/sach/`, KHÔNG nhúng vào dòng JSON
//     — một cuốn sách 271 trang nặng 2 MB, nhúng vào đây thì mỗi lần mở phân hệ
//     lại tải về từng đó.
// ============================================================================
const KEY = 'hdndkpi_sach_data';
const ROW_ID = 'sach_data';

export function readTS() {
  try { const raw = localStorage.getItem(KEY); if (raw) return chuanHoaTS(JSON.parse(raw)); } catch { /* bỏ qua */ }
  return chuanHoaTS(EMPTY_TS);
}
const cache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ } return d; };

export async function fetchTS() {
  if (!supabase) return readTS();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', ROW_ID).maybeSingle();
    if (!error && data?.data) return cache(chuanHoaTS(data.data));
  } catch (e) { console.warn('fetchTS:', e); }
  return readTS();
}

export async function saveTS(d) {
  const doc = cache(chuanHoaTS({ ...d, capNhat: new Date().toISOString() }));
  if (!supabase) return { ok: false, reason: 'no-supabase', doc };
  const { error } = await supabase.from('app_state').upsert({ id: ROW_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveTS:', error.message); return { ok: false, error, doc }; }
  return { ok: true, doc };
}

/**
 * Chưa có cuốn nào thì dựng bộ khởi tạo. Theo nguyên tắc chung của hệ thống
 * ("dữ liệu mẫu = dữ liệu chính thống"), người đăng nhập đầu tiên mở phân hệ
 * sẽ ghi bộ này lên máy chủ để mọi người cùng thấy một bản.
 */
export function khoiTaoNeuTrong(doc) {
  if (Array.isArray(doc?.sach) && doc.sach.length) return { doc: chuanHoaTS(doc), moi: false };
  return { doc: chuanHoaTS({ ...chuanHoaTS(doc), ...seedTuSach() }), moi: true };
}
