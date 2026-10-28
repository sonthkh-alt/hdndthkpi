// ============================================================================
//  NHIỀU BỘ BIỂU THEO ĐƠN VỊ — MÔ HÌNH & LOGIC THUẦN (chạy, kiểm thử bằng Node)
//
//  Trước đây phân hệ chỉ có MỘT bộ biểu (một dòng app_state id = 'vtvl_data').
//  Nay mỗi đơn vị có bộ biểu riêng:
//     vtvl_data        → Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa. Đây là bản
//                        MẶC ĐỊNH khi mở phân hệ và chỉ người ĐÃ ĐĂNG NHẬP được
//                        ghi. Giữ nguyên id cũ nên dữ liệu đã nhập không mất.
//     vtvl_dv_<slug>   → HĐND xã, phường do KHÁCH tự tạo bằng cách gõ tên đơn vị.
//
//  ⚠️ VÌ SAO PHẢI CÓ "MÃ SỬA": khách không đăng nhập nên hệ thống không có gì để
//     nhận dạng họ. Nếu cứ "gõ đúng tên xã là ghi được" thì một người gõ trùng
//     tên sẽ XÓA SẠCH công của xã khác. Mỗi bộ biểu vì thế có một mã sửa sinh tự
//     động lúc tạo: máy chủ CHỈ lưu chuỗi băm của mã, và lưu Ở MỘT DÒNG RIÊNG
//     (`vtvl_ma`, không mở đọc công khai — xem api/vtvl.js), trình
//     duyệt của người tạo tự nhớ mã nên lần sau vào là sửa tiếp được. Mất mã thì
//     vẫn XEM được; muốn sửa phải nhờ Văn phòng tỉnh (người đã đăng nhập ghi
//     được mọi bộ biểu). Mã sửa KHÔNG phải cơ chế bảo mật dữ liệu mật — nó chỉ
//     để các đơn vị không ghi đè lên nhau; bộ biểu vốn không chứa dữ liệu cá nhân.
// ============================================================================

export const ID_TINH = 'vtvl_data';
export const TIEN_TO_DV = 'vtvl_dv_';
export const TEN_TINH = 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa';

export const MIN_TEN = 6;
export const MAX_TEN = 120;
export const MAX_SLUG = 60;

/** Mã sửa: 8 ký tự, CỐ Ý bỏ 0 O 1 I L để đọc và gõ lại không nhầm. */
export const MA_SUA_KY_TU = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const MA_SUA_DAI = 8;

const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/** Bỏ dấu tiếng Việt — chỉ dùng để dựng slug và dò từ khóa, KHÔNG dùng để lưu tên. */
export function boDau(s) {
  return str(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Gọn khoảng trắng, bỏ ký tự điều khiển. Giữ nguyên dấu và chữ hoa người gõ.
 * Lọc theo MÃ ký tự (không dùng dải ký tự điều khiển trong biểu thức chính quy)
 * để ý định "bỏ ký tự điều khiển" đọc ra được ngay.
 */
export function chuanHoaTen(s) {
  const sach = [...str(s)].map((c) => { const m = c.codePointAt(0); return m < 32 || m === 127 ? ' ' : c; }).join('');
  return sach.replace(/\s+/g, ' ').trim().slice(0, MAX_TEN);
}

/** Tên đơn vị → slug dùng làm id dòng: "HĐND xã Quảng Yên" → "hdnd-xa-quang-yen". */
export function slugDonVi(ten) {
  return boDau(chuanHoaTen(ten))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG)
    .replace(/-+$/g, '');
}

export const idTuSlug = (slug) => (slug ? `${TIEN_TO_DV}${slug}` : ID_TINH);
export const laIdDonVi = (id) => str(id).startsWith(TIEN_TO_DV) && str(id).length > TIEN_TO_DV.length;
export const slugTuId = (id) => (laIdDonVi(id) ? str(id).slice(TIEN_TO_DV.length) : '');
export const laTinh = (slug) => !slug;

/**
 * Mục này dành riêng cho HĐND CẤP XÃ nên tên phải nêu rõ cấp: bộ biểu của cơ
 * quan tỉnh là bản mặc định, do Văn phòng nhập, không tạo thêm qua đây.
 */
const TU_CAP_XA = /\b(xa|phuong|thi tran)\b/;

/**
 * Kiểm tra tên đơn vị khách gõ.
 * @returns {{ok: boolean, ten: string, slug: string, id: string, loi: string}}
 */
export function kiemTraTen(tenIn) {
  const ten = chuanHoaTen(tenIn);
  if (!ten) return { ok: false, ten, slug: '', id: '', loi: 'Chưa gõ tên đơn vị.' };
  if (ten.length < MIN_TEN) return { ok: false, ten, slug: '', id: '', loi: `Tên quá ngắn (cần từ ${MIN_TEN} ký tự) — hãy ghi đầy đủ, ví dụ "HĐND xã Quảng Yên".` };
  if (!/[a-zà-ỹ]/i.test(ten)) return { ok: false, ten, slug: '', id: '', loi: 'Tên phải có chữ, không chỉ gồm số và dấu.' };
  const kd = boDau(ten);
  if (!TU_CAP_XA.test(kd)) {
    return { ok: false, ten, slug: '', id: '', loi: 'Tên phải có "xã", "phường" hoặc "thị trấn" — mục này dành cho HĐND cấp xã. Bộ biểu của cơ quan tỉnh là bản mặc định, do Văn phòng Đoàn ĐBQH và HĐND tỉnh nhập.' };
  }
  const slug = slugDonVi(ten);
  if (!slug) return { ok: false, ten, slug: '', id: '', loi: 'Tên không dựng được mã đơn vị — hãy gõ bằng chữ tiếng Việt.' };
  if (idTuSlug(slug) === ID_TINH) return { ok: false, ten, slug: '', id: '', loi: 'Tên này trùng với bộ biểu mặc định của cơ quan tỉnh.' };
  return { ok: true, ten, slug, id: idTuSlug(slug), loi: '' };
}

/** Mã sửa đúng dạng hay không (kiểm ở cả trình duyệt lẫn máy chủ, không cần thư viện). */
export function kiemTraMaSua(ma) {
  const m = str(ma).toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (m.length !== MA_SUA_DAI) return { ok: false, ma: m, loi: `Mã sửa gồm ${MA_SUA_DAI} ký tự chữ và số.` };
  if ([...m].some((c) => !MA_SUA_KY_TU.includes(c))) return { ok: false, ma: m, loi: 'Mã sửa có ký tự không hợp lệ (mã không dùng số 0, 1 và chữ O, I, L).' };
  return { ok: true, ma: m, loi: '' };
}

// ---------------------------------------------------------------------------
//  BỌC DỮ LIỆU CỦA MỘT ĐƠN VỊ
//
//  Dòng của đơn vị xã, phường là một BỌC quanh bộ biểu — ngoài bộ biểu còn phải
//  giữ tên đơn vị người gõ và chuỗi băm mã sửa. Dòng của tỉnh thì vẫn là bộ biểu
//  PHẲNG như trước (không đổi để dữ liệu cũ đọc được nguyên vẹn). Hai hàm dưới
//  đây đọc/ghi được CẢ HAI dạng.
// ---------------------------------------------------------------------------

/** Đọc dữ liệu thô của một dòng → { doc, ten, slug, maSuaBam, nguoiTao, taoLuc }. */
export function moBoc(data) {
  if (data && typeof data === 'object' && data.doc && typeof data.doc === 'object') {
    return {
      doc: data.doc,
      ten: chuanHoaTen(data.ten),
      slug: slugDonVi(data.slug || data.ten),
      maSuaBam: str(data.maSuaBam),
      nguoiTao: str(data.nguoiTao),
      taoLuc: str(data.taoLuc),
    };
  }
  // Dạng phẳng (dòng vtvl_data đời đầu).
  return { doc: data && typeof data === 'object' ? data : null, ten: '', slug: '', maSuaBam: '', nguoiTao: '', taoLuc: '' };
}

/**
 * Dựng dữ liệu thô để ghi cho một đơn vị xã, phường.
 * ⚠️ `tomTat` là khối NHẸ đặt ở NGOÀI bộ biểu, cố ý lặp lại vài con số đã có bên
 *    trong: hộp chọn đơn vị chỉ đọc khối này nên liệt kê 400 đơn vị không phải tải
 *    về nội dung của 400 bộ biểu (mỗi bộ có thể vài MB).
 */
export function dongBoc({ doc, ten, slug, maSuaBam, nguoiTao, taoLuc }) {
  return {
    v: 1,
    ten: chuanHoaTen(ten),
    slug: slugDonVi(slug || ten),
    maSuaBam: str(maSuaBam),
    nguoiTao: str(nguoiTao),
    taoLuc: str(taoLuc) || new Date().toISOString(),
    tomTat: tomTatCua(doc),
    doc,
  };
}

/** Khối tóm tắt nhẹ của một bộ biểu (dùng cho hộp chọn đơn vị). */
export function tomTatCua(doc) {
  const d = doc && typeof doc === 'object' ? doc : {};
  return {
    nguoi: str(d.nguoiCapNhat),
    capNhat: str(d.capNhat),
    soDong: demDong(d),
    soVT: Array.isArray(d.bieu?.C1) ? d.bieu.C1.length : 0,
  };
}

// ---------------------------------------------------------------------------
//  DANH SÁCH ĐƠN VỊ (cho hộp chọn ở đầu phân hệ)
// ---------------------------------------------------------------------------

/** Một mục trong danh sách — DANH SÁCH TRẮNG, không trả nguyên bộ biểu ra ngoài. */
export function mucDanhSach({ id, ten, nguoi, capNhat, soDong = 0, soVT = 0 }) {
  const slug = slugTuId(id);
  return {
    id: str(id), slug, tinh: !slug,
    ten: chuanHoaTen(ten) || (slug ? slug : TEN_TINH),
    nguoi: str(nguoi), capNhat: str(capNhat),
    soDong: Number(soDong) || 0, soVT: Number(soVT) || 0,
  };
}

/** Tỉnh luôn đứng đầu (bản mặc định), các xã, phường xếp theo tên tiếng Việt. */
export function sapXepDonVi(ds) {
  return [...(Array.isArray(ds) ? ds : [])].sort((a, b) =>
    (b.tinh ? 1 : 0) - (a.tinh ? 1 : 0) || str(a.ten).localeCompare(str(b.ten), 'vi'));
}

/** Bảo đảm danh sách luôn có bản mặc định của tỉnh, kể cả khi máy chủ chưa có dòng. */
export function gopTinh(ds) {
  const d = (Array.isArray(ds) ? ds : []).map(mucDanhSach);
  if (!d.some((x) => x.tinh)) d.push(mucDanhSach({ id: ID_TINH, ten: TEN_TINH }));
  return sapXepDonVi(d);
}

/** Đếm số dòng đã nhập của một bộ biểu — chỉ để hiện trong hộp chọn. */
export function demDong(doc) {
  const bieu = doc && typeof doc === 'object' ? doc.bieu : null;
  if (!bieu || typeof bieu !== 'object') return 0;
  return Object.values(bieu).reduce((t, v) => t + (Array.isArray(v) ? v.length : 0), 0);
}
