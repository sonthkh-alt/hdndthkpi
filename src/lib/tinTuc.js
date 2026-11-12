// ============================================================================
//  TIN TỨC THANH HÓA — LÕI THUẦN (Node chạy được, không React, không mạng)
//
//  Trang tin ở Trang chủ và trang #/tintuc CHỈ đưa tin TRONG TỈNH Thanh Hóa,
//  ưu tiên tin về hoạt động của HĐND tỉnh và Đoàn ĐBQH tỉnh. Nguồn là các kênh
//  RSS công khai của Báo và Phát thanh, Truyền hình Thanh Hóa (baothanhhoa.vn).
//
//  Tệp này dùng chung cho BA nơi, nên mọi quy tắc chọn tin chỉ viết MỘT lần:
//    · api/tintuc.js            — lấy tin trực tiếp mỗi khi có người mở trang
//    · tools/bantin/chay.mjs    — bản dự phòng ghi sẵn vào public/bantin/tin.json
//    · src/BanTin.jsx, TinTuc.jsx — hiển thị
//
//  ⚠️ PHẠM VI NỘI DUNG: chỉ hiển thị tiêu đề và ĐOẠN TÓM TẮT mà tòa soạn tự
//  phát qua RSS, kèm liên kết về bài gốc. KHÔNG chép toàn văn bài báo về đây —
//  đăng lại toàn văn cần thỏa thuận với tòa soạn.
//  ⚠️ KHÔNG DÙNG ẢNH CỦA BÁO: máy chủ ảnh (c.dhcn.vn) chỉ trả ảnh khi yêu cầu
//  đến từ chính baothanhhoa.vn, nơi khác nhận 307 → ảnh trống. Đó là chốt chống
//  nhúng của tòa soạn; KHÔNG lách bằng cách giả tiêu đề Referer qua máy chủ mình.
//
//  ⚠️ HAI BẪY TIẾNG VIỆT đã vấp ở bộ sinh bản tin cũ, giữ nguyên cách chặn:
//    1. khớp CHUỖI CON là sai ("quốc gia" chứa "gia") → khớp theo RANH GIỚI TỪ;
//    2. BỎ DẤU rồi khớp là sai ("báo" = "bão")        → khớp CÓ DẤU.
//  Thêm bẫy thứ ba gặp ở phân hệ VTVL: cùng một chữ có hai cách ghi dấu
//  (liền / tách) → chuẩn hóa NFC trước khi so. Báo Thanh Hóa còn viết lẫn
//  "Thanh Hóa" và "Thanh Hoá" (đặt dấu kiểu cũ / kiểu mới) → khai cả hai.
// ============================================================================

/** Kênh RSS lấy tin. Thứ tự = thứ tự ưu tiên khi hai kênh đăng cùng một bài. */
export const KENH = [
  { id: 'thoi-su', ten: 'Thời sự', url: 'https://baothanhhoa.vn/rss/thoi-su.xml' },
  { id: 'xay-dung-dang', ten: 'Xây dựng Đảng', url: 'https://baothanhhoa.vn/rss/xay-dung-dang.xml' },
  { id: 'kinh-te', ten: 'Kinh tế', url: 'https://baothanhhoa.vn/rss/kinh-te.xml' },
  { id: 'doi-song-xa-hoi', ten: 'Đời sống - Xã hội', url: 'https://baothanhhoa.vn/rss/doi-song-xa-hoi.xml' },
  { id: 'phap-luat', ten: 'Pháp luật', url: 'https://baothanhhoa.vn/rss/phap-luat.xml' },
  { id: 'quoc-phong-an-ninh', ten: 'Quốc phòng - An ninh', url: 'https://baothanhhoa.vn/rss/quoc-phong-an-ninh.xml' },
  { id: 'giao-duc', ten: 'Giáo dục', url: 'https://baothanhhoa.vn/rss/giao-duc.xml' },
  { id: 'y-te-suc-khoe', ten: 'Y tế - Sức khỏe', url: 'https://baothanhhoa.vn/rss/y-te-suc-khoe.xml' },
  { id: 've-voi-xu-thanh', ten: 'Về với xứ Thanh', url: 'https://baothanhhoa.vn/rss/ve-voi-xu-thanh.xml' },
];
export const TEN_NGUON = 'Báo và Phát thanh, Truyền hình Thanh Hóa';
export const TRANG_NGUON = 'https://baothanhhoa.vn';

/** Số tin giữ lại sau khi chọn, và số ngày tối đa một tin còn được coi là "tin". */
export const TOI_DA_TIN = 60;
export const SO_NGAY_GIU = 10;

const chuan = (s) => String(s ?? '').normalize('NFC');
const KY_TU_TU = '[0-9a-zà-ỹ]';

/** Khớp một cụm từ theo RANH GIỚI TỪ, có dấu, trên văn bản đã viết thường. */
export function coTu(vanBanThuong, tu) {
  const t = chuan(tu).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<!${KY_TU_TU})${t}(?!${KY_TU_TU})`, 'u').test(vanBanThuong);
}

// ─── Làm sạch chữ lấy từ RSS ────────────────────────────────────────────────
const giaiMa = (s) => String(s)
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');

/** Bỏ thẻ HTML, bỏ tiền tố "(Baothanhhoa.vn) -", gộp khoảng trắng. */
export function lamSach(s) {
  if (!s) return '';
  return chuan(giaiMa(giaiMa(s)).replace(/<[^>]+>/g, ' '))
    .replace(/^\s*\(\s*baothanhhoa\.vn\s*\)\s*[-–—]\s*/i, '')
    .replace(/\s+/g, ' ').trim();
}

/**
 * Đọc ngày của kênh. Báo Thanh Hóa ghi "2026-11-12 07:01:00" theo GIỜ VIỆT NAM,
 * không kèm múi giờ → phải tự gắn +07:00, nếu không máy chủ ở nước ngoài sẽ
 * hiểu lệch 7 tiếng.
 */
export function docNgay(s) {
  const t = String(s || '').trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] || '00'}+07:00`);
  m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})[ ,]+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6] || '00'}+07:00`);
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** RSS → danh sách tin thô. Kênh hỏng thì trả mảng rỗng, không làm gãy cả lượt. */
export function phanTichRss(xml, kenh) {
  const ra = [];
  const the = (khoi, ten) => (khoi.match(new RegExp(`<${ten}[^>]*>([\\s\\S]*?)</${ten}>`, 'i')) || [])[1] || '';
  for (const m of String(xml || '').matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const khoi = m[1];
    const tieuDe = lamSach(the(khoi, 'title'));
    const lienKet = giaiMa(the(khoi, 'link')).trim();
    if (!tieuDe || !/^https:\/\/baothanhhoa\.vn\//i.test(lienKet)) continue;
    const moTaTho = the(khoi, 'description');
    const luc = docNgay(giaiMa(the(khoi, 'pubDate')));
    ra.push({
      id: (giaiMa(the(khoi, 'guid')).trim() || lienKet).slice(0, 80),
      tieuDe, moTa: lamSach(moTaTho), lienKet,
      luc: luc ? luc.toISOString() : '',
      kenh: kenh?.id || '', chuyenMuc: kenh?.ten || '',
    });
  }
  return ra;
}

// ─── Tin TRONG TỈNH ─────────────────────────────────────────────────────────
//  Kênh "Thời sự" của báo tỉnh đăng lẫn tin trung ương, tin thế giới. Chỉ giữ
//  tin có DẤU HIỆU ĐỊA PHƯƠNG rõ ràng trong tiêu đề hoặc đoạn tóm tắt.
const DAU_HIEU_TINH = [
  'thanh hóa', 'thanh hoá', 'xứ thanh', 'tỉnh ủy', 'tỉnh uỷ', 'hđnd tỉnh', 'ubnd tỉnh', 'mttq tỉnh',
  'đoàn đbqh tỉnh', 'toàn tỉnh', 'trong tỉnh', 'tỉnh nhà', 'tỉnh ta', 'địa bàn tỉnh', 'của tỉnh',
  'công an tỉnh', 'bộ chỉ huy quân sự tỉnh', 'chủ tịch ubnd tỉnh', 'bí thư tỉnh ủy',
  // các địa danh lớn của tỉnh thường đứng một mình trong tiêu đề
  'sầm sơn', 'nghi sơn', 'bỉm sơn', 'hạc thành', 'lam kinh', 'thọ xuân', 'hoằng hóa', 'hoằng hoá',
  'quảng xương', 'nga sơn', 'hậu lộc', 'hà trung', 'vĩnh lộc', 'yên định', 'thiệu hóa', 'thiệu hoá',
  'đông sơn', 'triệu sơn', 'nông cống', 'như thanh', 'như xuân', 'thường xuân', 'ngọc lặc',
  'cẩm thủy', 'cẩm thuỷ', 'thạch thành', 'bá thước', 'lang chánh', 'quan hóa', 'quan hoá',
  'quan sơn', 'mường lát', 'pù luông', 'bến en', 'thành nhà hồ', 'sông mã', 'hàm rồng',
];
//  "xã Yên Trường", "phường Quảng Phú"… — tên riêng đứng sau chữ xã/phường.
const XA_PHUONG = /(?<![0-9a-zà-ỹ])(xã|phường|thôn)\s+[A-ZÀ-ỸĐ][a-zà-ỹ]+/u;
//  Tin trung ương, thế giới: có các chủ thể này mà KHÔNG có dấu hiệu địa phương thì bỏ.
const DAU_HIEU_NGOAI = [
  'quốc hội', 'chính phủ', 'thủ tướng', 'tổng bí thư', 'chủ tịch nước', 'bộ chính trị', 'ban bí thư',
  'bộ trưởng', 'thứ trưởng', 'thế giới', 'quốc tế', 'liên hợp quốc', 'asean', 'tổng thống',
  // ⚠️ KHÔNG khai tên nước ngắn kiểu "nga", "mỹ": "thôn Nga My" từng bị loại vì chữ "nga".
];

/** Tin có thuộc phạm vi tỉnh Thanh Hóa không. */
export function laTinTrongTinh(tin) {
  const goc = chuan(`${tin.tieuDe || ''} ${tin.moTa || ''}`);
  const thuong = goc.toLowerCase();
  if (DAU_HIEU_TINH.some((t) => coTu(thuong, t))) return true;
  // Có tên xã, phường, thôn cụ thể → tin cơ sở, trừ khi TIÊU ĐỀ nói chuyện trung ương.
  // (Chỉ xét tiêu đề: tóm tắt tin cơ sở rất hay nhắc "Chỉ thị của Bộ Chính trị", "Nghị quyết của Quốc hội".)
  if (XA_PHUONG.test(goc)) {
    const td = chuan(tin.tieuDe || '').toLowerCase();
    return !DAU_HIEU_NGOAI.some((t) => coTu(td, t));
  }
  return false;
}

// ─── Tin về hoạt động của HĐND tỉnh, Đoàn ĐBQH tỉnh ─────────────────────────
//  Chấm điểm: từ khóa trong TIÊU ĐỀ nặng gấp 3 trong đoạn tóm tắt.
const TU_KHOA_HDND = [
  ['hđnd', 5], ['hội đồng nhân dân', 5], ['hđnd tỉnh', 9], ['thường trực hđnd', 9], ['kỳ họp', 4],
  ['đoàn đbqh', 9], ['đoàn đại biểu quốc hội', 9], ['đại biểu quốc hội', 3], ['đbqh', 3],
  ['đại biểu hđnd', 5], ['tiếp xúc cử tri', 5], ['cử tri', 3], ['giám sát', 2], ['chất vấn', 3],
  ['thẩm tra', 3], ['nghị quyết', 2], ['ban pháp chế', 4], ['ban kinh tế - ngân sách', 4],
  ['ban văn hóa - xã hội', 4], ['ban văn hoá - xã hội', 4], ['ban dân tộc', 3], ['tổ đại biểu', 3],
  ['dân cử', 3], ['kiến nghị của cử tri', 4], ['ý kiến cử tri', 4],
];
/**
 * Ngưỡng để gắn nhãn "Hoạt động HĐND". Đo trên tin thật: "giám sát" đứng một mình ở
 * tiêu đề (6 điểm — "kiểm tra, giám sát môi trường") hay "nghị quyết" lẻ trong tóm tắt
 * KHÔNG phải tin HĐND; "cử tri" ở tiêu đề (9 điểm) hoặc "HĐND tỉnh" trong tóm tắt thì phải.
 */
export const NGUONG_HDND = 9;

export function diemHDND(tin) {
  const td = chuan(tin.tieuDe || '').toLowerCase();
  const mt = chuan(tin.moTa || '').toLowerCase();
  let d = 0;
  for (const [tu, diem] of TU_KHOA_HDND) {
    if (coTu(td, tu)) d += diem * 3;
    else if (coTu(mt, tu)) d += diem;
  }
  return d;
}

/** Bản tin thời sự phát thanh, truyền hình: không phải bài đọc được, bỏ. */
const LA_BAN_TIN_VIDEO = /^(bản tin|thời sự|điểm tin)\b.*\d{1,2}\/\d{1,2}/i;

const khoaTieuDe = (s) => chuan(s).toLowerCase().replace(/[^0-9a-zà-ỹ ]/gu, '').replace(/\s+/g, ' ').trim();

/**
 * Từ tin thô của mọi kênh → danh sách hiển thị.
 * Lọc tin trong tỉnh → bỏ trùng → gắn nhãn HĐND → xếp mới trước → cắt số lượng.
 */
export function chonTin(dsTho, { bayGio = new Date(), toiDa = TOI_DA_TIN, soNgay = SO_NGAY_GIU } = {}) {
  const moc = bayGio.getTime() - soNgay * 86400000;
  const thay = new Set();
  const ra = [];
  for (const t of dsTho || []) {
    if (!t?.tieuDe || !t.lienKet) continue;
    if (LA_BAN_TIN_VIDEO.test(t.tieuDe) || /\/video\//i.test(t.lienKet)) continue;
    const ms = t.luc ? new Date(t.luc).getTime() : NaN;
    if (!Number.isFinite(ms) || ms < moc || ms > bayGio.getTime() + 3600000) continue;
    if (!laTinTrongTinh(t)) continue;
    const k = khoaTieuDe(t.tieuDe);
    if (!k || thay.has(k)) continue;
    thay.add(k);
    const diem = diemHDND(t);
    ra.push({ ...t, diem, hdnd: diem >= NGUONG_HDND });
  }
  ra.sort((a, b) => new Date(b.luc) - new Date(a.luc));
  return ra.slice(0, toiDa);
}

/** Gộp tin mới với tin đã có (bản dự phòng tích lũy qua nhiều ngày), bỏ trùng theo liên kết. */
export function gopTin(moi, cu, tuy = {}) {
  const co = new Set((moi || []).map((t) => t.lienKet));
  return chonTin([...(moi || []), ...(cu || []).filter((t) => !co.has(t.lienKet))], tuy);
}

// ─── Phần dùng cho giao diện ────────────────────────────────────────────────
/** Chuẩn hóa dữ liệu đọc về: thiếu trường, sai kiểu, liên kết lạ đều không làm vỡ trang. */
export function docTinTuc(d) {
  const ds = Array.isArray(d?.tin) ? d.tin : [];
  const tin = ds.filter((t) => t && typeof t.tieuDe === 'string' && t.tieuDe.trim()
    && typeof t.lienKet === 'string' && /^https:\/\/baothanhhoa\.vn\//i.test(t.lienKet))
    .map((t) => ({
      id: String(t.id || t.lienKet),
      tieuDe: t.tieuDe.trim(),
      moTa: typeof t.moTa === 'string' ? t.moTa.trim() : '',
      lienKet: t.lienKet,
      luc: typeof t.luc === 'string' && !Number.isNaN(new Date(t.luc).getTime()) ? t.luc : '',
      kenh: String(t.kenh || ''), chuyenMuc: String(t.chuyenMuc || ''),
      hdnd: !!t.hdnd, diem: Number(t.diem) || 0,
    }));
  return { capNhat: typeof d?.capNhat === 'string' ? d.capNhat : '', tin };
}

/** Tin tiêu điểm: tin HĐND điểm cao nhất trong 3 ngày gần đây; không có thì tin mới nhất. */
export function tinTieuDiem(tin, bayGio = new Date()) {
  const gan = tin.filter((t) => t.hdnd && bayGio - new Date(t.luc) < 3 * 86400000);
  if (gan.length) return [...gan].sort((a, b) => b.diem - a.diem || new Date(b.luc) - new Date(a.luc))[0];
  return tin[0] || null;
}

/** Các chuyên mục đang có tin, kèm số lượng — dựng thanh lọc. */
export function chuyenMucCo(tin) {
  const dem = new Map();
  for (const t of tin) if (t.chuyenMuc) dem.set(t.chuyenMuc, (dem.get(t.chuyenMuc) || 0) + 1);
  return KENH.map((k) => ({ ten: k.ten, so: dem.get(k.ten) || 0 })).filter((x) => x.so > 0);
}

/** "5 phút trước", "3 giờ trước", "Hôm qua 14:20", "09/11/2026". */
export function hienLuc(iso, bayGio = new Date()) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  const phut = Math.floor((bayGio - d) / 60000);
  if (phut < 1) return 'Vừa xong';
  if (phut < 60) return `${phut} phút trước`;
  if (phut < 24 * 60) return `${Math.floor(phut / 60)} giờ trước`;
  const vn = (x) => new Date(x.getTime() + 7 * 3600000);
  const a = vn(d); const b = vn(bayGio);
  const hai = (n) => String(n).padStart(2, '0');
  const ngayA = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const ngayB = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  if (ngayB - ngayA === 86400000) return `Hôm qua ${hai(a.getUTCHours())}:${hai(a.getUTCMinutes())}`;
  return `${hai(a.getUTCDate())}/${hai(a.getUTCMonth() + 1)}/${a.getUTCFullYear()}`;
}

/** Bỏ dấu — CHỈ dùng cho ô tìm kiếm gõ nhanh, không dùng để chọn hay chấm điểm tin. */
const boDau = (s) => chuan(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

/** Tìm trong tiêu đề và tóm tắt, không phân biệt hoa thường, gõ không dấu vẫn ra. */
export function timTin(tin, tu) {
  const q = boDau(tu).trim();
  if (!q) return tin;
  return tin.filter((t) => boDau(`${t.tieuDe} ${t.moTa}`).includes(q));
}

/** Đường dẫn bản dự phòng ghi sẵn trong kho. */
export const TEP_DU_PHONG = 'bantin/tin.json';
