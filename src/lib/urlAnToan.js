// ============================================================================
//  LỌC ĐƯỜNG DẪN DO NGƯỜI DÙNG NHẬP — chặn liên kết chạy mã (XSS).
//
//  React 18 KHÔNG chặn `href="javascript:…"` (chỉ cảnh báo trong console), còn
//  `<iframe src="javascript:…">` chạy mã ngay trong trang. Mọi trường đường dẫn mà
//  người khác ghi được (sach_data, st_data… — policy app_state_auth_all cho MỌI tài
//  khoản đăng nhập ghi) đều phải qua hàm này trước khi đưa vào href/src: một liên kết
//  độc bấm phải là đủ để lấy phiên đăng nhập của Quản trị và đọc dữ liệu nhân sự.
//
//  Chỉ nhận: http(s) tuyệt đối · đường dẫn nội bộ bắt đầu bằng MỘT dấu "/" · neo "#…".
//  Mọi thứ khác (javascript:, data:, vbscript:, "//host", "/\host", chuỗi lạ) → ''.
// ============================================================================
export function urlAnToan(u) {
  const s = String(u ?? '').trim();
  if (!s) return '';
  if (s.startsWith('#')) return s;
  if (/^\/(?![/\\])/.test(s)) return [...s].some((c) => c.charCodeAt(0) < 32) ? '' : s;
  // Gõ thiếu giao thức ("vanban.chinhphu.vn/…") thì hiểu là https — không làm mất liên kết cũ.
  const coGiaoThuc = /^[a-z][a-z0-9+.-]*:/i.test(s);
  try {
    const x = new URL(!coGiaoThuc && /^[a-z0-9-]+(\.[a-z0-9-]+)+(?::\d+)?(?:[/?#]|$)/i.test(s) ? `https://${s}` : s);
    return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : '';
  } catch { return ''; }
}
