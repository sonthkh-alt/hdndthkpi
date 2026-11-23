import { supabase } from './supabase.js';
import { duongRieng, tenTepRieng } from './tuSach.js';

// ============================================================================
//  KHO RIÊNG TƯ của Tủ sách — bản toàn văn CHỈ QUẢN TRỊ đọc được.
//
//  Dùng cho sách chưa phát hành (bản thảo lấy ý kiến góp ý). Tệp nằm trong
//  Supabase Storage, bucket `sach-rieng` KHÔNG công khai; chính sách ở BƯỚC 13
//  của supabase/schema.sql chỉ cho ĐÚNG mã tài khoản Quản trị đọc/ghi.
//
//  ⚠️ Máy chủ mới là chốt chặn. Việc giao diện ẩn nút với người khác chỉ để khỏi
//     bấm vào rồi nhận lỗi — ai gọi thẳng API cũng bị Storage từ chối.
//  ⚠️ KHÔNG đặt tệp loại này vào `public/sach/` (công khai với mọi người) và
//     KHÔNG commit vào kho mã (kho mã công khai).
// ============================================================================
export const KHO_RIENG = 'sach-rieng';
export const MAX_MB_RIENG = 50;

const chuoi = (v) => (v == null ? '' : String(v)).trim();

/** Tệp có đúng là PDF không: xem 5 byte đầu, không tin phần mở rộng. */
export async function laPdf(file) {
  try {
    const dau = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    return String.fromCharCode(...dau) === '%PDF-';
  } catch { return false; }
}

export async function taiLenRieng(s, file) {
  if (!supabase) return { ok: false, loi: 'Hệ thống chưa cấu hình máy chủ.' };
  if (!file) return { ok: false, loi: 'Chưa chọn tệp.' };
  if (file.size > MAX_MB_RIENG * 1024 * 1024) return { ok: false, loi: `Tệp lớn hơn ${MAX_MB_RIENG} MB.` };
  if (!(await laPdf(file))) return { ok: false, loi: 'Tệp không phải PDF. Hãy xuất bản thảo ra PDF rồi tải lên.' };
  const path = tenTepRieng(s);
  const { error } = await supabase.storage.from(KHO_RIENG)
    .upload(path, file, { upsert: true, contentType: 'application/pdf', cacheControl: 'no-store' });
  if (error) {
    const m = chuoi(error.message);
    const chuaCoKho = /bucket not found/i.test(m);
    return {
      ok: false,
      loi: chuaCoKho
        ? 'Chưa có kho riêng tư trên máy chủ — cần chạy BƯỚC 13 trong supabase/schema.sql.'
        : `Máy chủ từ chối tải lên (${m || 'không rõ lý do'}). Chỉ tài khoản Quản trị ghi được kho này.`,
    };
  }
  return { ok: true, path };
}

/** Tải tệp về dưới dạng Blob (đi kèm phiên đăng nhập). Người không có quyền nhận lỗi từ máy chủ. */
export async function taiVeRieng(path) {
  const p = duongRieng(path);
  if (!supabase || !p) return { ok: false, loi: 'Cuốn này chưa có bản riêng.' };
  const { data, error } = await supabase.storage.from(KHO_RIENG).download(p);
  if (error || !data) return { ok: false, loi: 'Không mở được bản riêng — tài khoản này không có quyền, hoặc tệp chưa được tải lên.' };
  return { ok: true, blob: new Blob([data], { type: 'application/pdf' }) };
}
