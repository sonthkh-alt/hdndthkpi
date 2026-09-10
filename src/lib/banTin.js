// ============================================================================
//  BẢN TIN PHÁP LUẬT HẰNG NGÀY — logic THUẦN (không React, không fetch).
//
//  Ảnh bản tin do TÁC VỤ ĐỊNH KỲ của Claude sinh ra mỗi ngày rồi đẩy thẳng vào
//  repo này theo ĐƯỜNG DẪN CỐ ĐỊNH bên dưới. Đẩy xong Vercel tự triển khai lại
//  (1-2 phút) là Trang chủ có ảnh mới — không cần máy chủ, không cần cơ sở dữ liệu.
//
//  Hợp đồng với bộ sinh bản tin (xem thêm public/bantin/README.md):
//    public/bantin/moi-nhat.png        — ẢNH KHỔ LỚN 3508x2480 (bắt buộc, ghi đè mỗi ngày)
//    public/bantin/moi-nhat.jpg        — ảnh xem trước nhẹ ~1404x992 (tùy chọn nhưng NÊN có)
//    public/bantin/moi-nhat.json       — chú thích: ngày, tiêu đề, danh sách tin (tùy chọn)
//    public/bantin/muc-luc.json        — LƯU TRỮ: danh sách ngày đã có bản tin (tùy chọn)
//    public/bantin/luu-tru/<ngày>.jpg  — ảnh bản tin của ngày đó
//    public/bantin/luu-tru/<ngày>.json — chú thích của ngày đó
//
//  Vì sao cần ảnh xem trước: ảnh gốc 3508x2480 nặng vài MB. Bắt mọi người tải
//  ngần ấy chỉ để xem Trang chủ là quá đắt, nhất là khi mở bằng điện thoại.
//  Có ảnh nhẹ thì Trang chủ dùng ảnh nhẹ, bấm vào mới mở ảnh gốc để đọc kỹ.
// ============================================================================

/** Thư mục cố định trong `public/`. Đổi chỗ này thì phải đổi cả tác vụ định kỳ. */
export const THU_MUC = 'bantin';
export const TEN_ANH = 'moi-nhat.png';
export const TEN_ANH_NHE = 'moi-nhat.jpg';
export const TEN_CHU_THICH = 'moi-nhat.json';
export const TEN_MUC_LUC = 'muc-luc.json';
export const THU_MUC_LUU = 'luu-tru';

/** Tỷ lệ khung ảnh gốc (3508x2480) — đặt sẵn để trình duyệt không bị giật bố cục khi ảnh tải xong. */
export const TY_LE_ANH = 3508 / 2480;

const bo = (s) => String(s || '').replace(/\/+$/, '');

/**
 * Mốc ngày dùng để phá bộ nhớ đệm của trình duyệt.
 * Tên tệp cố định nên trình duyệt sẽ giữ ảnh cũ; gắn thêm mốc NGÀY (giờ Việt Nam)
 * thì mỗi ngày mới trình duyệt tải lại đúng một lần, không nhiều hơn.
 */
export function mocNgay(bayGio = Date.now()) {
  return new Date(bayGio + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Dựng đường dẫn tệp trong thư mục bản tin, kèm mốc phá bộ nhớ đệm. */
export function duongDan(goc, ten, moc) {
  const q = moc ? `?v=${encodeURIComponent(moc)}` : '';
  return `${bo(goc)}/${THU_MUC}/${ten}${q}`;
}

/** Đường dẫn tệp bản tin của MỘT NGÀY trong kho lưu trữ. */
export function duongDanLuuTru(goc, ngay, duoi) {
  // Tệp lưu trữ ghi một lần rồi không đổi nữa nên KHÔNG cần mốc phá bộ nhớ đệm —
  // để trình duyệt giữ lại càng tốt, xem lại bản tin cũ là có ngay.
  return `${bo(goc)}/${THU_MUC}/${THU_MUC_LUU}/${ngay}.${duoi}`;
}

/**
 * Chuẩn hóa mục lục lưu trữ -> mảng ngày ISO hợp lệ, MỚI NHẤT TRƯỚC, không trùng.
 * Mục lục hỏng hay thiếu thì trả mảng rỗng: Trang chủ chỉ mất phần chọn ngày,
 * bản tin mới nhất vẫn hiện bình thường.
 */
export function docMucLuc(raw) {
  const ds = Array.isArray(raw) ? raw : Array.isArray(raw?.ngay) ? raw.ngay : [];
  return [...new Set(ds.filter((x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)))]
    .sort()
    .reverse();
}

/**
 * Chuẩn hóa tệp chú thích. Tác vụ định kỳ có thể ghi thiếu trường hoặc ghi khác kiểu,
 * nên mọi trường đều có giá trị mặc định an toàn — thiếu chú thích thì vẫn hiện được ảnh.
 */
export function docChuThich(raw) {
  const d = raw && typeof raw === 'object' ? raw : {};
  const tin = Array.isArray(d.tin) ? d.tin : [];
  return {
    ngay: typeof d.ngay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.ngay) ? d.ngay : '',
    tieuDe: typeof d.tieuDe === 'string' ? d.tieuDe.trim() : '',
    // Mỗi dòng tin có thể là chuỗi hoặc {tieuDe, nguon} — nhận cả hai.
    tin: tin
      .map((t) => (typeof t === 'string' ? { tieuDe: t.trim(), nguon: '' }
        : { tieuDe: String(t?.tieuDe || '').trim(), nguon: String(t?.nguon || '').trim() }))
      .filter((t) => t.tieuDe)
      .slice(0, 8),
    nguon: typeof d.nguon === 'string' ? d.nguon.trim() : '',
  };
}

/** Ngày ISO -> dd/MM/yyyy. Chuỗi rỗng hoặc sai dạng thì trả rỗng, KHÔNG trả "Invalid Date". */
export function hienNgay(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Bản tin có còn mới không. Ảnh cũ vài ngày vẫn hiện (tác vụ có ngày không chạy),
 * nhưng quá hạn này thì gắn nhãn cũ để người xem không tưởng là tin hôm nay.
 */
export const SO_NGAY_CON_MOI = 3;

export function laBanTinCu(ngayISO, homNay = mocNgay()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ngayISO || ''))) return false;
  const cach = Math.round((Date.parse(`${homNay}T00:00:00Z`) - Date.parse(`${ngayISO}T00:00:00Z`)) / 86400000);
  return cach > SO_NGAY_CON_MOI;
}
