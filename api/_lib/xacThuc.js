// ============================================================================
//  XÁC THỰC NGƯỜI GỌI HÀM API (Vercel Serverless Function).
//  Phân hệ "Trợ lý AI" tốn tiền khóa API cho MỖI lượt gọi, nên chỉ phục vụ
//  người ĐÃ ĐĂNG NHẬP thật bằng tài khoản Supabase. Trình duyệt gửi kèm
//  `Authorization: Bearer <access_token>` lấy từ phiên đăng nhập; hàm này hỏi
//  lại Supabase xem thẻ đó còn hiệu lực và thuộc về ai.
//
//  ⚠️ Khách xem thử, chế độ "Quản trị cục bộ" (admin/Admin123 khi Supabase chưa
//     tạo tài khoản) đều KHÔNG có access_token → bị từ chối. Đó là chủ ý.
// ============================================================================
const baseUrl = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
// Gọi /auth/v1/user cần một khóa apikey bất kỳ của dự án (anon hoặc secret đều được).
const apiKey = () => process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

export const hasAuth = () => !!(baseUrl() && apiKey());

/** Lấy chuỗi token trong tiêu đề Authorization (không phân biệt hoa thường). */
export function bearerOf(req) {
  const h = req?.headers?.authorization || req?.headers?.Authorization || '';
  const m = String(h).match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

/**
 * Kiểm tra người gọi.
 * @returns {Promise<{email: string, id: string}|null>} null = không hợp lệ / chưa đăng nhập.
 */
export async function verifyUser(req) {
  const token = bearerOf(req);
  if (!token || !hasAuth()) return null;
  try {
    const r = await fetch(`${baseUrl().replace(/\/+$/, '')}/auth/v1/user`, {
      headers: { apikey: apiKey(), Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const u = await r.json();
    if (!u?.id) return null;
    return { id: u.id, email: String(u.email || '').toLowerCase() };
  } catch (e) {
    console.warn('verifyUser:', e.message);
    return null;
  }
}
