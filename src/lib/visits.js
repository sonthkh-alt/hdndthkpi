import { supabase } from './supabase';

// ============================================================================
// BỘ ĐẾM LƯỢT TRUY CẬP TRANG WEB
//  • Đếm toàn cục qua hàm RPC `visit_hit()` trên Supabase (security definer,
//    cho phép cả KHÁCH chưa đăng nhập gọi) — xem supabase/schema.sql.
//  • Mỗi PHIÊN trình duyệt chỉ đếm 1 lần (sessionStorage) để tải lại trang
//    không làm tăng số ảo.
//  • Nếu chưa chạy SQL tạo hàm / chưa cấu hình Supabase -> trả null (ẩn số).
// ============================================================================
const SS_KEY = 'hdndkpi_visit_counted';

/** Ghi nhận 1 lượt truy cập (nếu phiên này chưa đếm) rồi trả về tổng số lượt. */
export async function countVisit() {
  if (!supabase) return null;
  try {
    let counted = false;
    try { counted = !!sessionStorage.getItem(SS_KEY); } catch { /* bỏ qua */ }

    if (!counted) {
      const { data, error } = await supabase.rpc('visit_hit');
      if (!error && data != null) {
        try { sessionStorage.setItem(SS_KEY, '1'); } catch { /* bỏ qua */ }
        return Number(data);
      }
      // Hàm RPC chưa được tạo trên Supabase -> rơi xuống đọc số hiện có (nếu đọc được)
      if (error) console.warn('countVisit rpc:', error.message);
    }

    const { data, error } = await supabase
      .from('app_state').select('data').eq('id', 'visit_counter').maybeSingle();
    if (!error && data?.data?.count != null) return Number(data.data.count);
  } catch (e) { console.warn('countVisit:', e); }
  return null;
}
