import { createHash } from 'node:crypto';
import { getRow, putRow, hasStore, isServiceKey } from './store.js';

// ============================================================================
//  HẠN MỨC LƯỢT GỌI AI của phân hệ "Trợ lý AI nghiệp vụ dân cử".
//  Mỗi lượt gọi đều tốn tiền khóa dịch vụ nên phải có trần:
//     • Khách (chưa đăng nhập): 1 lượt / ngày  — dùng thử cho biết.
//     • Người đã đăng nhập:     5 lượt / ngày.
//  Đổi được bằng biến môi trường TROLY_QUOTA_KHACH / TROLY_QUOTA_NGUOI_DUNG.
//
//  Đếm Ở PHÍA MÁY CHỦ (dòng app_state id='troly_quota') vì bộ đếm để trong
//  trình duyệt thì xóa dữ liệu duyệt web là đặt lại được.
//  Khách nhận diện bằng CHUỖI BĂM của địa chỉ IP + trình duyệt — không lưu IP
//  gốc. Mỗi ngày (giờ Việt Nam) bộ đếm tự đặt lại.
// ============================================================================
const ROW_ID = 'troly_quota';

export const gioiHanKhach = () => Number(process.env.TROLY_QUOTA_KHACH ?? 1);
export const gioiHanNguoiDung = () => Number(process.env.TROLY_QUOTA_NGUOI_DUNG ?? 5);
export const gioiHanCua = (user) => (user ? gioiHanNguoiDung() : gioiHanKhach());

/** Ngày theo giờ Việt Nam (UTC+7) dạng YYYY-MM-DD — mốc đặt lại bộ đếm. */
export function ngayVN(nay = Date.now()) {
  return new Date(nay + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Địa chỉ IP của người gọi (Vercel đặt ở x-forwarded-for). */
export function ipCua(req) {
  const h = req?.headers || {};
  const xff = String(h['x-forwarded-for'] || h['X-Forwarded-For'] || '');
  return xff.split(',')[0].trim() || String(h['x-real-ip'] || '') || '';
}

/** Khóa đếm: người đăng nhập theo id tài khoản, khách theo chuỗi băm IP + trình duyệt. */
export function khoaDem(req, user) {
  if (user?.id) return `u:${user.id}`;
  const ip = ipCua(req);
  const ua = String(req?.headers?.['user-agent'] || '');
  return `k:${createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 16)}`;
}

/** Bỏ các ngày cũ, chỉ giữ bộ đếm của ngày hiện tại. */
export function donNgayCu(doc, ngay) {
  return doc?.ngay === ngay && doc?.dem && typeof doc.dem === 'object'
    ? { ngay, dem: { ...doc.dem } }
    : { ngay, dem: {} };
}

/** Tính trạng thái hạn mức từ số lượt đã dùng. */
export function trangThai(daDung, gioiHan) {
  const dung = Math.max(0, Number(daDung) || 0);
  return { daDung: dung, gioiHan, conLai: Math.max(0, gioiHan - dung), het: dung >= gioiHan };
}

/** Xem còn bao nhiêu lượt (KHÔNG trừ). */
export async function xemHanMuc(req, user) {
  const gioiHan = gioiHanCua(user);
  if (!hasStore()) return { ...trangThai(0, gioiHan), khongDem: true };
  try {
    const row = await getRow(ROW_ID);
    const doc = donNgayCu(row?.data, ngayVN());
    return trangThai(doc.dem[khoaDem(req, user)] || 0, gioiHan);
  } catch (e) {
    console.warn('xemHanMuc:', e.message);
    return { ...trangThai(0, gioiHan), khongDem: true };
  }
}

/**
 * Trừ một lượt. Trả { ok, daDung, conLai, gioiHan, het }.
 * Không đếm được (chưa cấu hình khóa máy chủ): người ĐÃ ĐĂNG NHẬP vẫn cho dùng,
 * KHÁCH thì từ chối — tránh để trần chi phí bị vô hiệu hóa vì thiếu cấu hình.
 */
export async function truMotLuot(req, user) {
  const gioiHan = gioiHanCua(user);
  if (!hasStore() || !isServiceKey()) {
    return user
      ? { ok: true, ...trangThai(0, gioiHan), khongDem: true }
      : { ok: false, ...trangThai(gioiHan, gioiHan), khongDem: true };
  }
  const ngay = ngayVN();
  const khoa = khoaDem(req, user);
  try {
    const row = await getRow(ROW_ID);
    const doc = donNgayCu(row?.data, ngay);
    const daDung = doc.dem[khoa] || 0;
    if (daDung >= gioiHan) return { ok: false, ...trangThai(daDung, gioiHan) };
    doc.dem[khoa] = daDung + 1;
    await putRow(ROW_ID, doc);
    return { ok: true, ...trangThai(daDung + 1, gioiHan) };
  } catch (e) {
    console.warn('truMotLuot:', e.message);
    // Lỗi kết nối kho đếm: xử lý như trường hợp không đếm được ở trên.
    return user
      ? { ok: true, ...trangThai(0, gioiHan), khongDem: true }
      : { ok: false, ...trangThai(gioiHan, gioiHan), khongDem: true };
  }
}

/** Câu thông báo khi hết lượt. */
export function loiHetLuot(user, gioiHan) {
  return user
    ? `Bạn đã dùng hết ${gioiHan} lượt gọi AI trong ngày hôm nay. Vui lòng dùng tiếp vào ngày mai hoặc liên hệ Quản trị để nâng hạn mức.`
    : `Mỗi khách được dùng thử ${gioiHan} lượt gọi AI mỗi ngày. Vui lòng đăng nhập bằng tài khoản cơ quan để có thêm lượt.`;
}
