import { supabase } from './supabase';

// ============================================================================
//  LƯU TRỮ PHÂN HỆ "HỒ SƠ CÁN BỘ".
//
//  Dữ liệu nằm ở khóa `hoSo` của dòng app_state id = 'hr_data' — dòng DUY NHẤT
//  đang được RLS khóa riêng cho email Quản trị (BƯỚC 4, supabase/schema.sql).
//  Không tạo dòng mới vì mọi dòng khác đều đọc được bởi bất kỳ tài khoản đăng
//  nhập nào (policy app_state_auth_all) — đặt hồ sơ CCCD, gia đình, tài sản vào
//  đó là lộ dữ liệu.
//
//  ⚠️ CỐ Ý KHÔNG cache vào localStorage: hồ sơ chứa dữ liệu cá nhân nhạy cảm của
//  cả cơ quan, để lại trên trình duyệt thì ai dùng chung máy cũng đọc được. Mỗi lần
//  mở phân hệ là đọc thẳng máy chủ (cần phiên đăng nhập thật của Quản trị).
//
//  Cùng dòng `hr_data` còn có hồ sơ 2C/danh bạ của phân hệ Quản lý cán bộ, nên mọi
//  lần ghi đều ĐỌC LẠI dòng trên máy chủ rồi chỉ thay đúng khóa của mình
//  (xem cả saveHR trong hrStore.js — chiều ngược lại).
// ============================================================================

const ID = 'hr_data';

/** Đọc gói hồ sơ. Trả { ok, goi|null, quyen } — quyen=false khi RLS không cho đọc dòng này. */
export async function fetchHoSo() {
  if (!supabase) return { ok: false, goi: null, loi: 'Hệ thống chưa cấu hình máy chủ.' };
  const { data, error } = await supabase.from('app_state').select('hoSo:data->hoSo').eq('id', ID).maybeSingle();
  if (error) return { ok: false, goi: null, loi: error.message };
  // RLS chặn thì Supabase trả RỖNG chứ không báo lỗi — không phân biệt được với "chưa có dữ liệu",
  // nên giao diện chỉ gọi hàm này khi đã xác nhận phiên là Quản trị.
  const goi = data?.hoSo && typeof data.hoSo === 'object' ? data.hoSo : null;
  return { ok: true, goi };
}

/** Ghi gói hồ sơ. `mocCu` = capNhat của bản đang sửa (khóa lạc quan: người khác lưu trước thì từ chối). */
export async function saveHoSo(goi, mocCu, nguoi = '') {
  if (!supabase) return { ok: false, loi: 'Hệ thống chưa cấu hình máy chủ.' };
  const { data, error } = await supabase.from('app_state').select('data').eq('id', ID).maybeSingle();
  if (error) return { ok: false, loi: error.message };
  const cu = (data?.data && typeof data.data === 'object') ? data.data : {};
  const mocMayChu = cu.hoSo?.capNhat || '';
  if (mocMayChu && mocMayChu !== (mocCu || '')) {
    return { ok: false, xungDot: true, loi: 'Hồ sơ trên máy chủ vừa được người khác cập nhật. Hãy tải lại phân hệ rồi sửa lại để không ghi đè.' };
  }
  const capNhat = new Date().toISOString();
  const moi = { ...goi, capNhat, nguoiCapNhat: nguoi || goi.nguoiCapNhat || '' };
  const { error: e2 } = await supabase.from('app_state').upsert({ id: ID, data: { ...cu, hoSo: moi }, updated_at: capNhat });
  if (e2) return { ok: false, loi: e2.message };
  return { ok: true, goi: moi };
}
