// ============================================================================
//  DANH BẠ ĐIỆN THOẠI — logic THUẦN (không React, kiểm thử được bằng Node).
//
//  Nguồn dữ liệu: Quản trị nhập từ tệp (.docx/.pdf/.txt) trong phân hệ
//  Quản lý cán bộ; chữ trong tệp có dạng bảng đã trải phẳng từng ô một dòng:
//     Stt ↵ Họ và tên ↵ Chức vụ (1..n dòng) ↵ Số điện thoại
//  Danh bạ lưu ở `hr_data.danhBa` trên máy chủ (RLS: chỉ Quản trị đọc) —
//  CỐ Ý không nhúng số điện thoại thật vào mã nguồn vì repo và bundle JS
//  đều công khai.
// ============================================================================

/** "09xx xxx.xxx" -> "09xxxxxxxx" — bỏ khoảng trắng, dấu chấm, gạch nối. */
export const chuanHoaSo = (s) => String(s || '').replace(/[\s.·-]/g, '');

/** Một dòng có phải số điện thoại Việt Nam không (10-11 số, bắt đầu bằng 0). */
export const laSoDienThoai = (s) => /^0\d{8,10}$/.test(chuanHoaSo(s));

/** Bỏ dấu + thường hóa để tìm kiếm "le tien lam" ~ "Lê Tiến Lam". */
const DAU = new RegExp('[\\u0300-\\u036f]', 'g');
export const boDauDB = (s) => String(s || '').toLowerCase().normalize('NFD').replace(DAU, '').replace(/đ/g, 'd');

/** "Danh sách danh bạ Đại biểu HĐND tỉnh" -> "Đại biểu HĐND tỉnh" (đầu mục một bảng). */
const tenNhom = (dong) => {
  const m = String(dong || '').match(/^danh\s*sách\s*danh\s*bạ\s*(.+)$/i);
  return m ? m[1].trim() : '';
};

/**
 * Phân tích chữ trích từ tệp danh bạ thành [{stt, ten, chucVu, sdt, nhom}].
 * Tệp có thể gồm NHIỀU bảng, mỗi bảng mở đầu bằng "Danh sách danh bạ <tên nhóm>"
 * và đánh số lại từ 1. Mẫu nhận dạng một người: dòng CHỈ CÓ SỐ THỨ TỰ (1-3 chữ
 * số) → họ tên → chức vụ (1..n dòng) → dòng số điện thoại.
 */
export function phanTichDanhBa(text) {
  const dong = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const ra = [];
  let nhom = '';
  let i = 0;
  while (i < dong.length) {
    const dau = tenNhom(dong[i]);
    if (dau) { nhom = dau; i += 1; continue; }
    if (!/^\d{1,3}$/.test(dong[i])) { i += 1; continue; }
    const stt = Number(dong[i]); i += 1;
    if (i >= dong.length || /^\d{1,3}$/.test(dong[i]) || laSoDienThoai(dong[i])) continue; // dòng số lẻ loi
    const ten = dong[i]; i += 1;
    const moTa = [];
    while (i < dong.length && !laSoDienThoai(dong[i]) && !/^\d{1,3}$/.test(dong[i]) && !tenNhom(dong[i])) { moTa.push(dong[i]); i += 1; }
    let sdt = '';
    if (i < dong.length && laSoDienThoai(dong[i])) { sdt = chuanHoaSo(dong[i]); i += 1; }
    ra.push({ stt, ten, chucVu: moTa.join('; '), sdt, nhom });
  }
  return ra;
}

/** Danh sách tên nhóm theo thứ tự xuất hiện. */
export const nhomDanhBa = (list) => [...new Set((list || []).map((d) => d.nhom).filter(Boolean))];

/** Lọc danh bạ theo từ khóa (tên/chức vụ/số/nhóm — gõ không dấu vẫn tìm được). */
export function timDanhBa(list, q) {
  const kw = boDauDB(q).trim();
  if (!kw) return list || [];
  return (list || []).filter((d) => boDauDB(`${d.ten} ${d.chucVu} ${d.sdt} ${d.nhom}`).includes(kw));
}
