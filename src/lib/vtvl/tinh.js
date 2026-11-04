// ============================================================================
//  LÕI TÍNH CỦA BỘ BIỂU VTVL — chuyển NGUYÊN VĂN công thức trong tệp Excel
//
//  Mọi hàm ở đây THUẦN (không React, không mạng) nên chạy và kiểm thử được
//  bằng Node. Công thức được rút trực tiếp từ các ô của tệp bộ biểu
//  (xl/worksheets/*.xml), giữ ĐÚNG thứ tự nhánh IF và ĐÚNG câu chữ cảnh báo —
//  lệch một câu là người dùng đối chiếu với Excel sẽ thấy khác.
//
//  ⚠️ Tệp bộ biểu KHÔNG lưu kết quả tính (ô công thức để `<v/>` rỗng, Excel
//  tính khi mở) nên không có sẵn số để đối chiếu. Mốc kiểm chứng là trang
//  KT_GIA_DINH của chính bộ biểu: 6000 SP × 30 phút = 3000 giờ → −500 −100
//  +200 = 2600 giờ ròng → 2600 / 1904 = 1,3655 người quy đổi.
//
//  QUY ƯỚC EXCEL được tôn trọng ở đây:
//    · ô trống là '' (chuỗi rỗng), KHÔNG phải 0
//    · ISNUMBER chỉ đúng với SỐ, chuỗi "10" không phải số
//    · MATCH/COUNTIF/SUMIF so chữ KHÔNG phân biệt hoa thường
// ============================================================================
import { QUY_GIO_PP2, BIEU_THEO_ID } from './moHinh.js';

// ─── Lớp mô phỏng ngữ nghĩa Excel ───────────────────────────────────────────
const laSo = (v) => typeof v === 'number' && Number.isFinite(v);
const so = (v) => (laSo(v) ? v : 0);
const rong = (v) => v === '' || v === null || v === undefined;
/**
 * So chuỗi như Excel: không phân biệt hoa thường, bỏ khoảng trắng hai đầu.
 *
 * ⚠️ BẪY TIẾNG VIỆT — phải chuẩn hóa NFC. Tệp bộ biểu thật có chỗ ghi dấu ở
 * dạng TÁCH ("chuẩn" = â + dấu hỏi rời U+0309) trong khi mã nguồn dùng dạng
 * LIỀN (U+1EA9): mắt thường thấy giống nhau, byte thì khác, nên nếu không
 * chuẩn hóa thì tra mã VTVL sẽ không khớp và cả bộ biểu báo "THIẾU MÃ VTVL"
 * mà người dùng không hiểu vì sao. Excel coi hai dạng này là một.
 */
const chuan = (v) => String(v ?? '').normalize('NFC').trim().toLowerCase();
const kk = (a, b) => chuan(a) === chuan(b);
/** SEARCH("PP2", B3) — có chứa (không phân biệt hoa thường) hay không. */
const chua = (chuoi, tim) => String(chuoi ?? '').toLowerCase().includes(String(tim).toLowerCase());

/** Chỉ mục dòng theo một cột khóa, giữ dòng ĐẦU khi trùng — đúng như MATCH. */
function chiMuc(dong, cot) {
  const m = new Map();
  for (const r of dong) {
    const k = chuan(r[cot]);
    if (k && !m.has(k)) m.set(k, r);
  }
  return m;
}
const tra = (m, ma) => m.get(chuan(ma));
/** COUNTIF(range, x) trên một cột. */
const dem = (dong, cot, ma) => dong.filter((r) => kk(r[cot], ma)).length;

const dongCua = (doc, id) => (doc?.bieu?.[id] || []);
/** Dòng có dữ liệu thật: cột khóa (hoặc cột A) khác rỗng. */
export function coDuLieu(doc, id) {
  const b = BIEU_THEO_ID[id];
  const k = b?.cot?.find((x) => x.khoa)?.k || 'A';
  return dongCua(doc, id).filter((r) => !rong(r[k]));
}

// ============================================================================
//  B1 — KHỐI LƯỢNG
//  B = tra mã VTVL từ A2 · M,N,O = tra danh mục sản phẩm · P = phút dùng tính
//  Q = nguồn thời gian · R = cảnh báo · F = giờ SP · G = giờ tổng
// ============================================================================
function tinhB1(doc) {
  const a2 = chiMuc(coDuLieu(doc, 'A2'), 'A');
  const dm = chiMuc(coDuLieu(doc, 'DM'), 'A');
  const ra = [];
  for (const r of dongCua(doc, 'B1')) {
    const o = { _id: r._id, A: r.A };
    if (rong(r.A)) { ra.push({ ...o, B: '', M: '', N: '', O: '', P: '', Q: '', R: '', F: '', G: '' }); continue; }

    // B: IF(A="","",IFERROR(INDEX(A2!C, MATCH(A, A2!A, 0)),""))
    const cv = tra(a2, r.A);
    o.B = cv && !rong(cv.C) ? cv.C : '';

    // M, N, O: tra cột D (nhóm), E (phút/SP chuẩn), G (trạng thái) của danh mục
    const sp = rong(r.L) ? null : tra(dm, r.L);
    o.M = sp && !rong(sp.D) ? sp.D : '';
    o.N = sp && !rong(sp.E) ? sp.E : '';
    o.O = sp && !rong(sp.G) ? sp.G : '';
    const nguonDM = sp && !rong(sp.F) ? sp.F : '';

    // Dùng định mức của danh mục khi: có phút chuẩn > 0, ĐÃ XÁC NHẬN và không có giải trình khác chuẩn
    const theoChuan = laSo(o.N) && o.N > 0 && kk(o.O, 'Đã xác nhận') && rong(r.S);

    // P: IF(A="","",IF(theoChuan, N, IF(AND(ISNUMBER(D),D>0,OR(J="Kiểm đếm…",AND(J="Có định mức",I<>""))), D, "")))
    o.P = theoChuan ? o.N
      : (laSo(r.D) && r.D > 0 && (kk(r.J, 'Kiểm đếm, ước lượng thực tế') || (kk(r.J, 'Có định mức') && !rong(r.I)))) ? r.D
        : '';

    // Q: nguồn thời gian dùng để tính
    o.Q = rong(o.P) ? ''
      : theoChuan ? `Định mức danh mục: ${nguonDM}`
        : kk(r.J, 'Có định mức') ? `Định mức: ${r.I}`
          : `Ước lượng thực tế${rong(r.I) ? '' : `; ${r.I}`}`;

    // R: cảnh báo dữ liệu — GIỮ ĐÚNG THỨ TỰ NHÁNH của Excel
    // LEFT(TRIM(S), LEN("Đã xác nhận:")) <> "Đã xác nhận:" — so sau khi chuẩn hóa NFC
    const chuaXacNhanKhacChuan = laSo(o.N) && o.N > 0 && kk(o.O, 'Đã xác nhận') && !rong(r.S)
      && !chuan(r.S).startsWith('đã xác nhận:');
    o.R = rong(o.B) ? 'THIẾU MÃ VTVL'
      : rong(r.H) ? 'THIẾU NGUỒN SẢN LƯỢNG/CÔNG VIỆC'
        : rong(r.K) ? 'THIẾU KỲ'
          : (rong(r.C) && laSo(r.E) && r.E > 0 && !rong(r.I)) ? 'ĐẠT'
            : rong(r.C) ? 'THIẾU SẢN LƯỢNG'
              : rong(r.J) ? 'CHƯA CHỌN TRẠNG THÁI'
                : chuaXacNhanKhacChuan ? 'CHỜ XÁC NHẬN KHÁC CHUẨN'
                  : (rong(r.I) && !theoChuan) ? 'THIẾU NGUỒN THỜI GIAN'
                    : rong(o.P) ? 'THIẾU THỜI GIAN'
                      : 'ĐẠT';

    // F: IF(R<>"ĐẠT","",IF(AND(C="",ISNUMBER(E),E>0),0,C*P/60))
    o.F = o.R !== 'ĐẠT' ? ''
      : (rong(r.C) && laSo(r.E) && r.E > 0) ? 0
        : so(r.C) * so(o.P) / 60;

    // G: IF(NOT(ISNUMBER(F)),"",F+IF(ISNUMBER(E),E,0))
    o.G = laSo(o.F) ? o.F + so(r.E) : '';
    ra.push(o);
  }
  return ra;
}

// ============================================================================
//  B2_CT — TÁC ĐỘNG (số hóa, cải tiến, thuê dịch vụ…)
//  H = giờ giảm trực tiếp · N/O = giờ hợp lệ · P = kiểm tra
// ============================================================================
function tinhB2CT(doc, kqB1) {
  const a2 = chiMuc(coDuLieu(doc, 'A2'), 'A');
  const b1 = dongCua(doc, 'B1');
  const ds = dongCua(doc, 'B2CT');
  // SUMIF theo mã công việc trên B1: cột C (số SP) và cột G (giờ tổng đã tính)
  const spB1 = new Map(); const gioB1 = new Map();
  b1.forEach((r, i) => {
    const k = chuan(r.A);
    if (!k) return;
    spB1.set(k, so(spB1.get(k)) + so(r.C));
    gioB1.set(k, so(gioB1.get(k)) + so(kqB1[i]?.G));
  });

  const ra = ds.map((r) => {
    const o = { _id: r._id, A: r.A };
    if (rong(r.A)) return { ...o, B: '', H: '', N: '', O: '', P: '' };
    const cv = tra(a2, r.A);
    o.B = cv && !rong(cv.C) ? cv.C : '';
    // H: IF(OR(A="",NOT(ISNUMBER(E)),NOT(ISNUMBER(F)),NOT(ISNUMBER(G)),F<G),"",E*(F-G)/60)
    o.H = (!laSo(r.E) || !laSo(r.F) || !laSo(r.G) || r.F < r.G) ? '' : r.E * (r.F - r.G) / 60;
    return o;
  });

  // Tổng giờ giảm trực tiếp theo mã công việc (để soát "GIỜ GIẢM VƯỢT GIỜ B1")
  const giamTheoCV = new Map();
  ds.forEach((r, i) => {
    const k = chuan(r.A);
    if (k) giamTheoCV.set(k, so(giamTheoCV.get(k)) + so(ra[i].H));
  });

  ds.forEach((r, i) => {
    const o = ra[i];
    if (rong(r.A)) { o.N = ''; o.O = ''; o.P = ''; return; }
    const k = chuan(r.A);
    // P: kiểm tra — GIỮ ĐÚNG THỨ TỰ NHÁNH
    const trungCongDoan = ds.filter((x) => kk(x.A, r.A) && kk(x.D, r.D) && kk(x.K, r.K)).length > 1;
    const loaiHopLe = ['Số hóa', 'Cải tiến quy trình', 'Thuê dịch vụ/đặt hàng', 'Tự chủ', 'Xã hội hóa', 'Công việc mới phát sinh']
      .some((x) => kk(r.C, x));
    o.P = kk(r.M, 'Ước lượng tham khảo') ? 'THAM KHẢO – KHÔNG TÍNH'
      : (rong(o.B) || rong(r.D) || rong(r.J) || rong(r.K) || rong(r.L) || !kk(r.M, 'Đã kiểm chứng')) ? 'CHƯA ĐỦ CĂN CỨ'
        : !loaiHopLe ? 'LOẠI TÁC ĐỘNG KHÔNG HỢP LỆ'
          : !kk(r.S, 'Đã đối chiếu') ? 'CHỜ SOÁT TRÙNG'
            : trungCongDoan ? 'TRÙNG CÔNG ĐOẠN'
              : (rong(o.H) && rong(r.I)) ? 'THIẾU GIỜ TÁC ĐỘNG'
                : (!rong(o.H) && (rong(r.E) || so(r.E) <= 0)) ? 'THIẾU SẢN PHẨM ÁP DỤNG'
                  : (!rong(o.H) && so(r.E) > so(spB1.get(k))) ? 'SẢN PHẨM ÁP DỤNG VƯỢT B1'
                    : (!rong(r.F) && !rong(r.G) && so(r.F) < so(r.G) && (rong(r.I) || so(r.I) <= 0)) ? 'THỜI GIAN TĂNG CHƯA GHI GIỜ MỚI'
                      : (kk(r.L, 'Trước thay đổi, có điều chỉnh') && so(giamTheoCV.get(k)) > so(gioB1.get(k))) ? 'GIỜ GIẢM VƯỢT GIỜ B1'
                        : 'ĐẠT';
    // N: giờ giảm chỉ được tính khi ĐẠT và cơ sở B1 là "Trước thay đổi, có điều chỉnh"
    o.N = (o.P === 'ĐẠT' && kk(r.L, 'Trước thay đổi, có điều chỉnh') && !rong(o.H)) ? o.H : 0;
    // O: giờ việc mới chỉ được tính khi ĐẠT
    o.O = (o.P === 'ĐẠT' && !rong(r.I)) ? r.I : 0;
  });
  return ra;
}

// ============================================================================
//  B2_ThayĐổi — gom tác động theo từng công việc (toàn bộ tự tính)
// ============================================================================
function tinhB2(doc, kqB2CT) {
  const ct = dongCua(doc, 'B2CT');
  const ra = [];
  const daGap = new Set();
  ct.forEach((r) => {
    if (rong(r.A)) return;
    const k = chuan(r.A);
    if (daGap.has(k)) return;           // chỉ dòng ĐẦU của mỗi mã công việc
    daGap.add(k);
    const cungMa = ct.map((x, j) => ({ x, c: kqB2CT[j] })).filter((p) => kk(p.x.A, r.A));
    const soHoa = cungMa.filter((p) => kk(p.x.C, 'Số hóa') || kk(p.x.C, 'Cải tiến quy trình'))
      .reduce((t, p) => t + so(p.c.N), 0);
    const tongGiam = cungMa.reduce((t, p) => t + so(p.c.N), 0);
    const vietMoi = cungMa.reduce((t, p) => t + so(p.c.O), 0);
    const soDong = cungMa.length;
    const soDat = cungMa.filter((p) => p.c.P === 'ĐẠT').length;
    const G = soDat === 0 ? 'Chưa có dòng đạt' : soDat === soDong ? 'Đã kiểm chứng' : 'Kiểm chứng một phần';
    const cv = chiMuc(coDuLieu(doc, 'A2'), 'A');
    ra.push({
      A: r.A,
      B: (() => { const m = tra(cv, r.A); return m && !rong(m.C) ? m.C : ''; })(),
      C: soHoa,
      D: tongGiam - soHoa,
      E: vietMoi,
      F: vietMoi - soHoa - (tongGiam - soHoa),
      G,
      H: soDong,
      I: G === 'Đã kiểm chứng' ? 'ĐẠT'
        : G === 'Kiểm chứng một phần' ? 'CÓ DÒNG CHƯA ĐẠT – CHỈ TÍNH DÒNG ĐẠT'
          : 'CHƯA CÓ DÒNG ĐẠT – KHÔNG TÍNH TÁC ĐỘNG',
    });
  });
  return ra;
}

// ============================================================================
//  C1 — VỊ TRÍ VIỆC LÀM: E = giờ chuẩn PP2 · K = kiểm tra quỹ giờ
// ============================================================================
function tinhC1(doc) {
  return dongCua(doc, 'C1').map((r) => {
    if (rong(r.A)) return { _id: r._id, A: r.A, E: '', K: '' };
    const cheDoHopLe = kk(r.J, 'Phổ biến (40 giờ/tuần)') || kk(r.J, 'Đặc thù');
    // E: chế độ không hợp lệ → ""; Đặc thù hoặc có giờ riêng → chỉ nhận khi đã kiểm chứng; còn lại dùng mức chung
    const E = !cheDoHopLe ? ''
      : (kk(r.J, 'Đặc thù') || !rong(r.H))
        ? ((laSo(r.H) && r.H > 0 && !rong(r.F) && kk(r.I, 'Đã kiểm chứng')) ? r.H : '')
        : QUY_GIO_PP2;
    const K = rong(r.J) ? 'CHƯA CHỌN CHẾ ĐỘ LÀM VIỆC'
      : !cheDoHopLe ? 'CHẾ ĐỘ KHÔNG HỢP LỆ'
        : (kk(r.J, 'Đặc thù') && rong(E)) ? 'THIẾU GIỜ ĐẶC THÙ'
          : (!rong(r.H) && rong(E)) ? 'GIỜ CHƯA XÁC NHẬN'
            : rong(E) ? 'THIẾU MẪU SỐ'
              : 'ĐẠT';
    return { _id: r._id, A: r.A, E, K };
  });
}

// ============================================================================
//  C3 — NHU CẦU NHÂN LỰC
//  C = giờ B1 (chỉ dòng ĐẠT) · D = tác động B2 · E = giờ ròng
//  F = quỹ giờ từ C1 · G = người quy đổi PP2 · M = cảnh báo · N = số dòng B1 chưa đạt
// ============================================================================
function tinhC3(doc, kqB1, kqB2, kqC1, kqB2CT) {
  const b1 = dongCua(doc, 'B1');
  const c1 = dongCua(doc, 'C1');
  const b2ct = dongCua(doc, 'B2CT');
  const c1E = new Map(); const c1K = new Map();
  c1.forEach((r, i) => {
    const k = chuan(r.A);
    if (k && !c1E.has(k)) { c1E.set(k, kqC1[i]?.E); c1K.set(k, kqC1[i]?.K); }
  });
  const ds = dongCua(doc, 'C3');

  return ds.map((r) => {
    const o = { _id: r._id, A: r.A };
    if (rong(r.A)) return { ...o, C: '', D: '', E: '', F: '', G: '', M: '', N: '' };
    const vt = chuan(r.A);

    // C: SUMIFS(B1!G, B1!B, A, B1!R, "ĐẠT") — không có dòng ĐẠT nào thì để trống
    const dongVT = b1.map((x, i) => ({ x, c: kqB1[i] })).filter((p) => kk(p.c.B, r.A));
    const dat = dongVT.filter((p) => p.c.R === 'ĐẠT');
    o.C = dat.length === 0 ? '' : dat.reduce((t, p) => t + so(p.c.G), 0);
    // N: COUNTIFS(B1!B, A, B1!R, "<>ĐẠT")
    o.N = dongVT.filter((p) => p.c.R !== 'ĐẠT').length;
    // D: SUMIFS(B2!F, B2!B, A)
    o.D = kqB2.filter((x) => kk(x.B, r.A)).reduce((t, x) => t + so(x.F), 0);
    // E: IF(OR(A="",C=""),"",C+IF(D="",0,D))
    o.E = rong(o.C) ? '' : so(o.C) + so(o.D);
    // F: quỹ giờ lấy từ C1 cột E
    o.F = c1E.has(vt) && !rong(c1E.get(vt)) ? c1E.get(vt) : '';
    // G: chỉ tính khi phương pháp có PP2 và quỹ giờ > 0
    o.G = (!chua(r.B, 'PP2') || rong(o.E) || rong(o.F) || so(o.E) < 0) ? ''
      : (so(o.F) > 0 ? so(o.E) / so(o.F) : '');

    // M: cảnh báo — GIỮ ĐÚNG THỨ TỰ NHÁNH của Excel
    const ppHopLe = ['PP1', 'PP2', 'PP3', 'PP1+PP2', 'PP1+PP3', 'PP2+PP3', 'PP1+PP2+PP3'].some((x) => kk(r.B, x));
    const soC1 = dem(c1, 'A', r.A);
    const b2ChuaDu = b2ct.filter((_x, i) => kk(kqB2CT[i].B, r.A)
      && !kk(b2ct[i].M, 'Ước lượng tham khảo') && kqB2CT[i].P !== 'ĐẠT').length;
    o.M = !ppHopLe ? 'PHƯƠNG PHÁP KHÔNG HỢP LỆ'
      : soC1 > 1 ? 'TRÙNG MÃ VTVL Ở C1'
        : (chua(r.B, 'PP2') && c1K.get(vt) !== 'ĐẠT') ? 'PP2: C1 CHƯA ĐỦ CĂN CỨ'
          : soC1 === 0 ? 'MÃ VTVL CHƯA CÓ Ở C1'
            : dem(ds, 'A', r.A) > 1 ? 'TRÙNG MÃ VTVL'
              : rong(r.B) ? 'CHƯA CHỌN PHƯƠNG PHÁP'
                : (chua(r.B, 'PP2') && !rong(o.E) && so(o.E) < 0) ? 'GIỜ RÒNG ÂM – KIỂM TRA B2'
                  : (chua(r.B, 'PP2') && rong(o.G)) ? 'PP2: THIẾU GIỜ B1 HOẶC QUỸ GIỜ'
                    : (chua(r.B, 'PP2') && so(o.N) > 0) ? 'PP2: CÒN DÒNG B1 CHƯA ĐẠT'
                      : (chua(r.B, 'PP2') && b2ChuaDu > 0) ? 'PP2: B2 CHƯA ĐỦ CĂN CỨ'
                        : (chua(r.B, 'PP1') && rong(r.H)) ? 'PP1: THIẾU SỐ NGƯỜI'
                          : (chua(r.B, 'PP3') && rong(r.I)) ? 'PP3: THIẾU SỐ NGƯỜI'
                            : rong(r.K) ? 'THIẾU NGUỒN/GIẢI TRÌNH'
                              : rong(r.J) ? 'CHƯA KẾT LUẬN NGƯỜI CẦN BỐ TRÍ'
                                : !kk(r.L, 'Đã kiểm chứng') ? 'CHỜ XÁC NHẬN NGHIỆP VỤ'
                                  : 'ĐẠT';
    return o;
  });
}

// ============================================================================
//  D1 — NHÂN LỰC HIỆN CÓ: D = quỹ giờ/năm · J = cảnh báo
// ============================================================================
function tinhD1(doc, kqC1) {
  const c1 = dongCua(doc, 'C1');
  const c1E = new Map();
  c1.forEach((r, i) => {
    const k = chuan(r.A);
    if (k && !c1E.has(k)) c1E.set(k, kqC1[i]?.E);
  });
  const ds = dongCua(doc, 'D1');
  return ds.map((r) => {
    const o = { _id: r._id, A: r.A };
    if (rong(r.B)) o.D = '';
    else if (laSo(r.K)) o.D = r.K;                       // giờ riêng theo chế độ thắng số tra từ C1
    else {
      const e = c1E.get(chuan(r.B));
      o.D = rong(e) ? '' : e;
    }
    o.J = rong(r.A) ? ''
      : dem(ds, 'A', r.A) > 1 ? 'TRÙNG MÃ NGUỒN LỰC'
        : rong(r.G) ? 'THIẾU NƠI TÍNH BIÊN CHẾ'
          : (rong(o.D) || rong(r.E) || rong(r.F) || rong(r.H) || !kk(r.I, 'Đã kiểm chứng')) ? 'Chưa đủ căn cứ'
            : (so(r.E) + so(r.F) > so(o.D)) ? 'Vượt quỹ giờ'
              : 'Đạt';
    return o;
  });
}

// ============================================================================
//  DỰ BÁO 5 NĂM: G = người C3 năm cơ sở · H = người cần trong năm · I = kiểm tra
// ============================================================================
function tinhDU(doc, kqC3) {
  const c3 = dongCua(doc, 'C3');
  // Chỉ nhận VTVL có ĐÚNG 01 dòng C3 "Đã kiểm chứng" và cảnh báo "ĐẠT"
  const nguoiCoSo = new Map();
  c3.forEach((r, i) => {
    if (rong(r.A)) return;
    if (!kk(r.L, 'Đã kiểm chứng') || kqC3[i]?.M !== 'ĐẠT') return;
    const k = chuan(r.A);
    nguoiCoSo.set(k, (nguoiCoSo.get(k) || 0) + 1);
  });
  const ds = dongCua(doc, 'DU');
  return ds.map((r) => {
    const o = { _id: r._id, A: r.A, B: r.B };
    if (rong(r.A)) return { ...o, G: '', H: '', I: '' };
    const k = chuan(r.A);
    const dongC3 = c3.find((x) => kk(x.A, r.A));
    o.G = nguoiCoSo.get(k) === 1 && dongC3 && !rong(dongC3.J) ? dongC3.J : '';
    const trungNam = ds.filter((x) => kk(x.A, r.A) && so(x.B) === so(r.B)).length > 1;
    o.I = (!laSo(r.B) || r.B < 2027 || r.B > 2031 || r.B !== Math.trunc(r.B)) ? 'NĂM KHÔNG HỢP LỆ'
      : trungNam ? 'TRÙNG MÃ VTVL – NĂM'
        : rong(o.G) ? 'C3 CHƯA ĐƯỢC XÁC NHẬN'
          : !laSo(r.C) ? 'THIẾU BIẾN ĐỘNG (NHẬP 0 NẾU KHÔNG ĐỔI)'
            : (so(o.G) + so(r.C) < 0) ? 'NHU CẦU ÂM'
              : (rong(r.D) || rong(r.E)) ? 'THIẾU GIẢI TRÌNH/NGUỒN'
                : !kk(r.F, 'Đã kiểm chứng') ? 'CHƯA KIỂM CHỨNG DỰ BÁO'
                  : 'ĐẠT';
    o.H = o.I === 'ĐẠT' ? so(o.G) + so(r.C) : '';
    return o;
  });
}

// ============================================================================
//  D2 — PHƯƠNG ÁN 2027–2031
//  C = người cần trong năm (từ dự báo) · K, L = tham khảo từ C3 · M, J = kiểm tra
// ============================================================================
function tinhD2(doc, kqC3, kqDU) {
  const c3 = dongCua(doc, 'C3');
  const du = dongCua(doc, 'DU');
  const ds = dongCua(doc, 'D2');
  return ds.map((r) => {
    const o = { _id: r._id, A: r.A, B: r.B };
    if (rong(r.A)) return { ...o, C: '', J: '', K: '', L: '', M: '' };

    // C: chỉ lấy khi có ĐÚNG 01 dòng dự báo ĐẠT của đúng mã VTVL và đúng năm
    const duDat = du.map((x, i) => ({ x, c: kqDU[i] }))
      .filter((p) => kk(p.x.A, r.A) && so(p.x.B) === so(r.B) && p.c.I === 'ĐẠT');
    o.C = duDat.length === 1 ? so(duDat[0].c.H) : '';

    const iC3 = c3.findIndex((x) => kk(x.A, r.A));
    o.K = iC3 >= 0 && !rong(kqC3[iC3].G) ? kqC3[iC3].G : '';
    o.L = iC3 >= 0 && !rong(c3[iC3].J) ? c3[iC3].J : '';

    // M: kiểm soát cơ sở đối chiếu
    o.M = rong(r.H) ? 'THIẾU GIẢI TRÌNH'
      : rong(o.C) ? 'CHƯA CÓ DỰ BÁO NĂM'
        : rong(r.D) ? 'THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH'
          : (!laSo(o.C) || !laSo(r.D)) ? 'C/D PHẢI TÍNH THEO NGƯỜI'
            : (o.C < 0 || r.D < 0) ? 'SỐ NGƯỜI ÂM'
              : (!rong(o.L) && so(o.C) !== so(o.L)) ? 'THAY ĐỔI SO VỚI NĂM CƠ SỞ – CÓ DỰ BÁO'
                : 'ĐỐI CHIẾU XONG';

    // J: cảnh báo
    const c3XacNhan = c3.filter((x, i) => kk(x.A, r.A) && kk(x.L, 'Đã kiểm chứng') && kqC3[i].M === 'ĐẠT').length;
    const ttHopLe = ['Đang xây dựng', 'Đã hoàn thành ở đơn vị', 'Đã thẩm định', 'Đã được quyết định'].some((x) => kk(r.I, x));
    o.J = (!laSo(r.B) || r.B < 2027 || r.B > 2031 || r.B !== Math.trunc(r.B)) ? 'NĂM KHÔNG HỢP LỆ'
      : ds.filter((x) => kk(x.A, r.A) && so(x.B) === so(r.B)).length > 1 ? 'TRÙNG MÃ VTVL – NĂM'
        : rong(r.I) ? 'CHƯA CHỌN TRẠNG THÁI'
          : !ttHopLe ? 'TRẠNG THÁI KHÔNG HỢP LỆ'
            : c3XacNhan !== 1 ? 'C3 CHƯA ĐƯỢC XÁC NHẬN'
              : duDat.length !== 1 ? 'CHƯA CÓ DỰ BÁO NĂM ĐÃ KIỂM CHỨNG'
                : (rong(o.C) || rong(r.D) || rong(r.G) || rong(r.H)) ? 'THIẾU PHƯƠNG ÁN'
                  : ['THIẾU GIẢI TRÌNH', 'THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH', 'C/D PHẢI TÍNH THEO NGƯỜI', 'SỐ NGƯỜI ÂM'].includes(o.M) ? 'CHƯA ĐỦ CĂN CỨ'
                    : kk(r.I, 'Đang xây dựng') ? 'ĐANG XÂY DỰNG'
                      : kk(r.I, 'Đã hoàn thành ở đơn vị') ? 'SẴN SÀNG THẨM ĐỊNH'
                        : rong(r.N) ? 'THIẾU VĂN BẢN THẨM ĐỊNH/QUYẾT ĐỊNH'
                          : kk(r.I, 'Đã thẩm định') ? 'ĐÃ THẨM ĐỊNH'
                            : 'ĐÃ QUYẾT ĐỊNH';
    return o;
  });
}

// ============================================================================
//  TỔNG HỢP cho màn Tổng quan
// ============================================================================
function tongHop(doc, kq) {
  const b1 = dongCua(doc, 'B1');
  const gioB1 = kq.B1.filter((x) => x.R === 'ĐẠT').reduce((t, x) => t + so(x.G), 0);
  const giamSoHoa = kq.B2.reduce((t, x) => t + so(x.C), 0);
  const giamThue = kq.B2.reduce((t, x) => t + so(x.D), 0);
  const vietMoi = kq.B2.reduce((t, x) => t + so(x.E), 0);
  const gioRong = gioB1 + kq.B2.reduce((t, x) => t + so(x.F), 0);
  const nguoiQD = kq.C3.reduce((t, x) => t + so(x.G), 0);
  const c3 = dongCua(doc, 'C3');
  const nguoiCan = c3.reduce((t, x) => t + so(x.J), 0);
  const d1 = dongCua(doc, 'D1');
  return {
    donVi: doc.donVi || '', ky: doc.ky || '', quyGio: QUY_GIO_PP2,
    soVTVL: coDuLieu(doc, 'C1').length,
    soCongViec: coDuLieu(doc, 'A2').length,
    soNhiemVu: coDuLieu(doc, 'A1').length,
    soDongB1: b1.filter((r) => !rong(r.A)).length,
    b1Dat: kq.B1.filter((x) => x.R === 'ĐẠT').length,
    b1ChuaDat: kq.B1.filter((x) => !rong(x.A) && x.R !== 'ĐẠT').length,
    soDongB2: dongCua(doc, 'B2CT').filter((r) => !rong(r.A)).length,
    b2Dat: kq.B2CT.filter((x) => x.P === 'ĐẠT').length,
    gioB1, giamSoHoa, giamThue, vietMoi, gioRong, nguoiQD, nguoiCan,
    soNguoiD1: d1.filter((r) => !rong(r.A)).length,
    d1Dat: kq.D1.filter((x) => x.J === 'Đạt').length,
    c3Dat: kq.C3.filter((x) => x.M === 'ĐẠT').length,
    duDat: kq.DU.filter((x) => x.I === 'ĐẠT').length,
    d2Dat: kq.D2.filter((x) => ['SẴN SÀNG THẨM ĐỊNH', 'ĐÃ THẨM ĐỊNH', 'ĐÃ QUYẾT ĐỊNH'].includes(x.J)).length,
  };
}

/**
 * Tính lại toàn bộ cột tự tính của bộ biểu.
 * Thứ tự PHẢI đúng theo chuỗi phụ thuộc: B1 → B2_CT → B2 → C1 → C3 → D1 → DU → D2.
 */
export function tinhToan(doc) {
  const kq = {};
  kq.B1 = tinhB1(doc);
  kq.B2CT = tinhB2CT(doc, kq.B1);
  kq.B2 = tinhB2(doc, kq.B2CT);
  kq.C1 = tinhC1(doc);
  kq.C3 = tinhC3(doc, kq.B1, kq.B2, kq.C1, kq.B2CT);
  kq.D1 = tinhD1(doc, kq.C1);
  kq.DU = tinhDU(doc, kq.C3);
  kq.D2 = tinhD2(doc, kq.C3, kq.DU);
  kq.tongHop = tongHop(doc, kq);
  return kq;
}

/** Giá trị hiển thị của một ô: ô tự tính lấy từ kết quả, còn lại lấy từ dữ liệu. */
export function giaTriO(doc, kq, id, chiSo, cotK) {
  const b = BIEU_THEO_ID[id];
  const cot = b?.cot?.find((x) => x.k === cotK);
  if (cot?.tinh && kq?.[id]?.[chiSo]) {
    const v = kq[id][chiSo][cotK];
    return v === undefined ? '' : v;
  }
  return doc?.bieu?.[id]?.[chiSo]?.[cotK] ?? '';
}

/** Ví dụ tự kiểm của chính bộ biểu (trang KT_GIA_DINH) — mốc đối chiếu công thức. */
export const VI_DU_KT = {
  sanPham: 6000, phutMoiSP: 30, gioGoc: 3000,
  giamSoHoa: 500, giamThueDV: 100, gioVietMoi: 200,
  gioRong: 2600, quyGio: QUY_GIO_PP2, nguoiQuyDoi: 2600 / QUY_GIO_PP2,
};
