import { supabase } from './supabase';

// ============================================================================
//  CẦU NỐI GIỮA GIAO DIỆN VÀ HÀM API của phân hệ "Trợ lý AI nghiệp vụ dân cử".
//  Khóa AI nằm ở máy chủ (Vercel), trình duyệt KHÔNG giữ khóa: mọi lượt gọi đi
//  qua /api/troly và /api/doctext, kèm thẻ đăng nhập Supabase để máy chủ biết
//  ai đang dùng (mỗi lượt gọi đều tốn tiền khóa API).
//
//  ⚠️ Hàm trong api/ CHỈ chạy trên Vercel — chạy `npm run dev` ở máy sẽ nhận 404
//     và giao diện hiện thông báo "chưa chạy trên máy chủ".
// ============================================================================

// ---- Danh mục dùng cho giao diện (đối chiếu với api/_lib/vanBan.js) --------
export const LOAI_VAN_BAN = ['Tự động', 'Công văn', 'Báo cáo', 'Quyết định', 'Nghị quyết', 'Tờ trình'];
export const TRONG_TAM_SOAT_XET = ['Chính tả & Ngữ pháp', 'Thể thức NĐ 30', 'Văn phong hành chính', 'Logic quản lý'];
export const BAN_HDND = ['Kinh tế - Ngân sách', 'Pháp chế', 'Văn hóa - Xã hội', 'Dân tộc'];
export const TAC_VU_KY_HOP = [
  { id: 'sosanh', label: 'So sánh số liệu (tìm điểm mâu thuẫn)' },
  { id: 'chatvan', label: 'Đề xuất danh sách câu hỏi chất vấn' },
  { id: 'tuanthu', label: 'Kiểm tra tính tuân thủ nghị quyết HĐND' },
  { id: 'ngansach', label: 'Phân tích điểm nghẽn ngân sách' },
  { id: 'ruiro', label: 'Tóm tắt rủi ro chính sách' },
  { id: 'tuchon', label: 'Đặt câu hỏi tùy chọn (tự nhập)' },
];
export const LINH_VUC_KIEN_NGHI = ['Giao thông', 'Môi trường', 'Y tế', 'Giáo dục', 'Đất đai', 'Đầu tư công', 'Chính sách xã hội', 'Khác'];
export const TRANG_THAI_KIEN_NGHI = ['Mới', 'Đang xử lý', 'Đã xong'];

export const CO_DUOC_DUNG = ['pdf', 'docx', 'txt'];
export const GIOI_HAN_TEP = 3 * 1024 * 1024; // 3 MB — trùng giới hạn của /api/doctext

// ---- Tiện ích thuần (kiểm thử được bằng Node) ------------------------------
export const duoiTep = (ten) => (String(ten || '').toLowerCase().match(/\.([a-z0-9]+)$/) || ['', ''])[1];
export const tepHopLe = (ten) => CO_DUOC_DUNG.includes(duoiTep(ten));
export const goiChuKy = (n) => `${(Number(n) || 0).toLocaleString('vi-VN')} ký tự`;

/** Gộp các tài liệu đã trích xuất thành một khối ngữ cảnh có ghi rõ nguồn. */
export function gopNguCanh(docs = [], chuNhap = '') {
  const phan = docs.filter((d) => d && d.text).map((d) => `--- Tài liệu: ${d.ten} ---\n${d.text}`);
  if (String(chuNhap || '').trim()) phan.push(`--- Văn bản nhập trực tiếp ---\n${chuNhap.trim()}`);
  return phan.join('\n\n');
}

/** Văn bản NĐ 30 do AI trả về → chuẩn hóa đủ trường, tránh undefined khi xuất Word. */
export function chuanHoaVanBan(j = {}) {
  const chuoi = (v) => (v == null ? '' : String(v));
  return {
    co_quan_chu_quan: chuoi(j.co_quan_chu_quan),
    co_quan_ban_hanh: chuoi(j.co_quan_ban_hanh),
    so_ky_hieu: chuoi(j.so_ky_hieu),
    dia_danh_ngay_thang: chuoi(j.dia_danh_ngay_thang),
    loai_van_ban: chuoi(j.loai_van_ban),
    trich_yeu: chuoi(j.trich_yeu),
    noi_dung_chinh: chuoi(j.noi_dung_chinh),
    noi_nhan: Array.isArray(j.noi_nhan) ? j.noi_nhan.map(chuoi).filter(Boolean) : [],
    quyen_han_ky: chuoi(j.quyen_han_ky),
    nguoi_ky: chuoi(j.nguoi_ky),
  };
}

// ---- Gọi máy chủ -----------------------------------------------------------
async function layToken() {
  if (!supabase) return '';
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || '';
  } catch { return ''; }
}

async function goi(duongDan, body) {
  const token = await layToken();
  if (!token) {
    return { error: 'Chức năng AI chỉ dành cho người đã đăng nhập bằng tài khoản cơ quan. Vui lòng bấm "Đăng nhập" rồi thử lại.' };
  }
  let r;
  try {
    r = await fetch(duongDan, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return { error: `Không gọi được máy chủ: ${e.message}` };
  }
  if (r.status === 404) {
    return { error: 'Chức năng AI chỉ chạy trên bản triển khai (Vercel), không chạy khi mở thử ở máy cá nhân.' };
  }
  let data = null;
  try { data = await r.json(); } catch { /* không phải JSON */ }
  if (!r.ok) return { error: data?.error || `Máy chủ trả lỗi ${r.status}.` };
  return data || {};
}

/** Gọi một việc nghiệp vụ. Trả { text } hoặc { json } hoặc { error }. */
export const goiTroLy = (viec, duLieu) => goi('/api/troly', { viec, duLieu });

/** Hỏi đáp tự do — gửi kèm các lượt hội thoại gần nhất. */
export const hoiDap = (turns) => goi('/api/troly', { viec: 'hoidap', turns });

/** Đọc chữ trong một tệp người dùng chọn. Trả { ten, text } hoặc { error }. */
export async function docTaiLieu(file) {
  if (!file) return { error: 'Chưa chọn tệp.' };
  if (!tepHopLe(file.name)) return { error: `Tệp "${file.name}": chỉ nhận .pdf, .docx hoặc .txt.` };
  if (file.size > GIOI_HAN_TEP) {
    return { error: `Tệp "${file.name}" nặng ${(file.size / 1024 / 1024).toFixed(1)} MB — vượt giới hạn 3 MB. Hãy tách nhỏ hoặc dán nội dung trực tiếp.` };
  }
  const base64 = await docBase64(file);
  const res = await goi('/api/doctext', { ten: file.name, base64 });
  if (res.error) return res;
  return { ten: file.name, text: res.text || '', canhBao: res.canhBao };
}

function docBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('Không đọc được tệp.'));
    fr.onload = () => {
      const s = String(fr.result || '');
      resolve(s.slice(s.indexOf(',') + 1)); // bỏ phần "data:...;base64,"
    };
    fr.readAsDataURL(file);
  });
}
