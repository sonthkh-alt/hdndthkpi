// ============================================================================
//  BÁO CÁO KẾT QUẢ KÊ KHAI bộ biểu Vị trí việc làm — LOGIC THUẦN (Node chạy được)
//
//  `lapBaoCao(doc)` gom TOÀN BỘ kết quả sau khi chạy công thức thành một cấu trúc
//  dùng chung cho màn hình (tab "Báo cáo") và tệp Word (`exportBaoCaoVTVL`):
//   I.   Thông tin chung · tình trạng chung
//   II.  Tình trạng 8 bước kê khai
//   III. Khối lượng công việc và tác động (B1, B2)
//   IV.  Nhu cầu nhân lực từng VTVL (C1 + C3) + tổng theo loại nhân lực
//   V.   Đối chiếu nguồn lực hiện có (D1) — tham khảo
//   VI.  Phương án bố trí 2027–2031 (D2)
//   VII. Kiểm tra (biểu K) + tồn tại cần xử lý
//   Nhận xét: CHỈ nêu sự kiện rút từ số liệu (không đề xuất tăng/giảm biên chế).
//
//  ⚠️ Nguyên tắc của bộ biểu được giữ nguyên trong báo cáo:
//   - người quy đổi PP2 KHÔNG phải số biên chế, không làm tròn;
//   - chỉ so sánh cùng đơn vị: người cần bố trí ↔ số người; người quy đổi ↔ người quy đổi;
//   - nguồn lực D1 chỉ tính bản ghi đã xác nhận (J = "Đạt");
//   - kiểm tra tự động không thay thế thẩm định.
// ============================================================================
import {
  BIEU_THEO_ID, NAM_TU, NAM_DEN, tinhToan, kiemTraDuLieu, laSo, rong, kk, cotKhoa, chuanHoaVTVL, QUY_GIO_PP2,
} from './vtvl.js';

export const NGUON_BO_BIEU = 'Bộ biểu xác định vị trí việc làm — bản sửa đề nghị v2 của nhóm tư vấn UEB (23/10/2026), chưa phải bản Ban ban hành';

export const LUU_Y_BAO_CAO = [
  'Người quy đổi PP2 = giờ ròng ÷ quỹ giờ; giữ số thập phân, KHÔNG phải số biên chế và không tự làm tròn thành biên chế.',
  'Số người cần bố trí (C3) không đồng nghĩa với biên chế được giao; nhu cầu nhân lực không tự động làm tăng tổng biên chế.',
  'Phần đối chiếu với nguồn lực hiện có chỉ để tham khảo, tính trên các bản ghi D1 đã xác nhận và so sánh cùng đơn vị tính.',
  'Kết quả kiểm tra tự động không thay thế thẩm định; người đứng đầu cơ quan, đơn vị xác nhận kết quả.',
  'Không tính theo ngạch, bậc, tiền lương; chỉ căn cứ nhiệm vụ, sản phẩm, năng lực và thời gian.',
];

const so0 = (v) => (laSo(v) ? v : 0);
const lam = (n, k = 2) => (laSo(n) ? Math.round(n * 10 ** k) / 10 ** k : n);
const vn = (n, k = 2) => Number(n).toLocaleString('vi-VN', { maximumFractionDigits: k });
const ngayVN = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

/** Lý do xuất hiện nhiều nhất trong danh sách trạng thái (để nhận xét). */
function lyDoNhieuNhat(ds) {
  const m = new Map();
  for (const x of ds) m.set(x, (m.get(x) || 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([ly, n]) => `${ly} (${n})`);
}

export function lapBaoCao(docIn, { ngay = new Date() } = {}) {
  const doc = chuanHoaVTVL(docIn);
  const kq = tinhToan(doc);
  const kt = kiemTraDuLieu(doc, kq);
  const R = (id) => doc.bieu[id] || [];
  const coMa = (id) => R(id).filter((r) => !rong(r[cotKhoa(BIEU_THEO_ID[id])?.k || 'A']));
  const dem = (id) => kt.demBieu[id] || { loi: 0, canh: 0, tt: 0 };
  const quyGio = kq.tongHop.quyGio;

  // ── II. Tình trạng 8 bước ──
  const tt = (id, col) => R(id).map((r, i) => (rong(r.A) ? null : kq.tinh[id]?.[i]?.[col])).filter((x) => x !== null);
  const buocDem = (ten, ids, datFn, { khongBatBuoc = false } = {}) => {
    const soDong = ids.reduce((s, id) => s + coMa(id).length, 0);
    const loi = ids.reduce((s, id) => s + dem(id).loi, 0);
    const canh = ids.reduce((s, id) => s + dem(id).canh, 0);
    const dat = datFn();
    const chuaDat = soDong - dat;
    const trangThai = soDong === 0 ? (khongBatBuoc ? 'Không phát sinh' : 'Chưa kê khai')
      : loi === 0 && canh === 0 && chuaDat === 0 ? 'Hoàn thành' : 'Còn tồn tại';
    return { ten, bieu: ids.map((id) => BIEU_THEO_ID[id].ma).join(', '), soDong, dat, chuaDat, loi, canh, trangThai };
  };
  const khongLoi = (id) => () => coMa(id).filter((r) => !(kt.theoDong.get(r._id) || []).some((x) => x.muc === 'loi')).length;
  const theoTT = (id, col, ok) => () => tt(id, col).filter((x) => ok.includes(x)).length;
  const buoc = [
    { buoc: 1, ...buocDem('Danh mục nhiệm vụ', ['A1'], khongLoi('A1')) },
    { buoc: 2, ...buocDem('Công việc, sản phẩm, VTVL thực hiện', ['A2'], khongLoi('A2')) },
    { buoc: 3, ...buocDem('Khối lượng và thời gian', ['B1'], theoTT('B1', 'R', ['ĐẠT'])) },
    { buoc: 4, ...buocDem('Tác động thực tế (số hóa, thuê dịch vụ…)', ['B2CT'], theoTT('B2CT', 'P', ['ĐẠT', 'THAM KHẢO – KHÔNG TÍNH']), { khongBatBuoc: true }) },
    { buoc: 5, ...buocDem('Vị trí việc làm, quỹ giờ, năng lực', ['C1', 'C2'], () => theoTT('C1', 'K', ['ĐẠT'])() + khongLoi('C2')()) },
    { buoc: 6, ...buocDem('Nhu cầu nhân lực (PP1/PP2/PP3)', ['C3'], () => R('C3').filter((r, i) => !rong(r.A) && kq.tinh.C3[i].M === 'ĐẠT').length) },
    { buoc: 7, ...buocDem('Nguồn lực, dự báo và phương án 2027–2031', ['D1', 'DU', 'D2'],
      () => theoTT('D1', 'J', ['Đạt'])() + theoTT('DU', 'I', ['ĐẠT'])() + theoTT('D2', 'J', ['ĐÃ THẨM ĐỊNH', 'ĐÃ QUYẾT ĐỊNH'])()) },
  ];
  const tongLoi = kt.ds.filter((x) => x.muc === 'loi').length;
  const tongCanh = kt.ds.filter((x) => x.muc === 'canh').length;
  buoc.push({ buoc: 8, ten: 'Rà soát lỗi, cảnh báo (biểu K)', bieu: 'K, T, S', soDong: kq.kiemTra.length, dat: kq.kiemTra.filter((x) => x.kq === 0).length,
    chuaDat: kq.kiemTra.filter((x) => x.kq > 0).length, loi: tongLoi, canh: tongCanh,
    trangThai: buoc.every((b) => !b.soDong) ? 'Chưa kê khai' : tongLoi === 0 && tongCanh === 0 ? 'Hoàn thành' : 'Còn tồn tại' });

  // ── III. Khối lượng ──
  const b1Dat = R('B1').filter((r, i) => !rong(r.A) && kq.tinh.B1[i].R === 'ĐẠT').length;
  const khoiLuong = {
    soNV: coMa('A1').length, soCV: coMa('A2').length, soDongB1: coMa('B1').length, dongB1Dat: b1Dat,
    gioB1: lam(kq.tongHop.gioB1, 1),
    gioGiamSoHoa: lam(kq.B2.reduce((s, r) => s + r.C, 0), 1),
    gioGiamKhac: lam(kq.B2.reduce((s, r) => s + r.D, 0), 1),
    gioMoi: lam(kq.B2.reduce((s, r) => s + r.E, 0), 1),
    gioTacDong: lam(kq.tongHop.gioTacDong, 1),
    soDongB2CT: coMa('B2CT').length,
    dongB2CTDat: R('B2CT').filter((r, i) => !rong(r.A) && kq.tinh.B2CT[i].P === 'ĐẠT').length,
    lyDoB1: lyDoNhieuNhat(tt('B1', 'R').filter((x) => x !== 'ĐẠT')),
  };
  khoiLuong.gioRong = lam(khoiLuong.gioB1 + khoiLuong.gioTacDong, 1);

  // ── V. Nguồn lực hiện có theo VTVL (chỉ bản ghi D1 đã xác nhận) ──
  const hienCo = new Map();
  let d1BoQua = 0;
  R('D1').forEach((r, i) => {
    if (rong(r.A) || rong(r.B)) return;
    const t = kq.tinh.D1[i];
    if (t.J !== 'Đạt') { d1BoQua++; return; }
    const key = kk(r.B);
    const o = hienCo.get(key) || { soNguoi: 0, gio: 0, quyDoi: 0 };
    o.soNguoi += 1; o.gio += so0(r.E); o.quyDoi += laSo(t.D) && t.D > 0 ? so0(r.E) / t.D : 0;
    hienCo.set(key, o);
  });

  // ── IV. Nhu cầu từng VTVL: theo thứ tự C1, rồi mã chỉ có ở C3 ──
  const c3Theo = new Map();
  R('C3').forEach((r, i) => { if (!rong(r.A) && !c3Theo.has(kk(r.A))) c3Theo.set(kk(r.A), { r, t: kq.tinh.C3[i] }); });
  const ma = [];
  const daCo = new Set();
  for (const r of R('C1')) if (!rong(r.A) && !daCo.has(kk(r.A))) { daCo.add(kk(r.A)); ma.push(kk(r.A)); }
  for (const k of c3Theo.keys()) if (!daCo.has(k)) { daCo.add(k); ma.push(k); }
  const c1Theo = new Map();
  R('C1').forEach((r, i) => { if (!rong(r.A) && !c1Theo.has(kk(r.A))) c1Theo.set(kk(r.A), { r, t: kq.tinh.C1[i] }); });
  const vtvl = ma.map((k) => {
    const c1 = c1Theo.get(k); const c3 = c3Theo.get(k); const hc = hienCo.get(k);
    const nguoiCan = c3 && laSo(c3.r.J) ? c3.r.J : null;
    const nguoiQD = c3 && laSo(c3.t.G) ? lam(c3.t.G, 4) : null;
    return {
      ma: c1?.r.A ?? c3?.r.A, ten: c1?.r.B || '', loaiNL: c1?.r.C || '', cheDo: c1?.r.J || '', kiemTraC1: c1?.t.K || 'CHƯA CÓ Ở C1',
      pp: c3?.r.B || '', gioB1: c3 && laSo(c3.t.C) ? lam(c3.t.C, 1) : null, gioTD: c3 && laSo(c3.t.D) ? lam(c3.t.D, 1) : null,
      gioRong: c3 && laSo(c3.t.E) ? lam(c3.t.E, 1) : null, quyGio: c3 && laSo(c3.t.F) ? c3.t.F : (c1 && laSo(c1.t.E) ? c1.t.E : null),
      nguoiQD, nguoiPP1: c3 && laSo(c3.r.H) ? c3.r.H : null, nguoiPP3: c3 && laSo(c3.r.I) ? c3.r.I : null, nguoiCan,
      trangThaiC3: c3 ? c3.r.L || '' : '', canhBao: c3 ? c3.t.M : 'CHƯA LẬP NHU CẦU Ở C3',
      dat: !!c3 && c3.t.M === 'ĐẠT',
      hienCo: hc ? { soNguoi: hc.soNguoi, gio: lam(hc.gio, 1), quyDoi: lam(hc.quyDoi, 4) } : { soNguoi: 0, gio: 0, quyDoi: 0 },
      chenhNguoi: nguoiCan === null ? null : lam(nguoiCan - (hc?.soNguoi || 0), 2),
      chenhQD: nguoiQD === null ? null : lam(nguoiQD - (hc?.quyDoi || 0), 4),
    };
  });
  const tong = {
    soVT: vtvl.length, soVTDat: vtvl.filter((x) => x.dat).length,
    nguoiQD: lam(vtvl.reduce((s, x) => s + so0(x.nguoiQD), 0), 4),
    nguoiCan: lam(vtvl.reduce((s, x) => s + so0(x.nguoiCan), 0), 2),
    nguoiCanDat: lam(vtvl.filter((x) => x.dat).reduce((s, x) => s + so0(x.nguoiCan), 0), 2),
    soNguoiHienCo: vtvl.reduce((s, x) => s + x.hienCo.soNguoi, 0),
    quyDoiHienCo: lam(vtvl.reduce((s, x) => s + x.hienCo.quyDoi, 0), 4),
    d1BoQua,
  };
  const loaiMap = new Map();
  for (const x of vtvl) {
    const k = x.loaiNL || '(chưa ghi loại nhân lực)';
    const o = loaiMap.get(k) || { loai: k, soVT: 0, nguoiQD: 0, nguoiCan: 0, soNguoi: 0 };
    o.soVT++; o.nguoiQD += so0(x.nguoiQD); o.nguoiCan += so0(x.nguoiCan); o.soNguoi += x.hienCo.soNguoi;
    loaiMap.set(k, o);
  }
  const theoLoai = [...loaiMap.values()].map((o) => ({ ...o, nguoiQD: lam(o.nguoiQD, 4), nguoiCan: lam(o.nguoiCan, 2) }));

  // ── VI. Phương án 2027–2031 ──
  const nam = [];
  for (let y = NAM_TU; y <= NAM_DEN; y++) nam.push(y);
  const paTheo = new Map();
  const tongNam = Object.fromEntries(nam.map((y) => [y, { C: 0, D: 0, E: 0, G: 0, soDong: 0, daXong: 0 }]));
  R('D2').forEach((r, i) => {
    if (rong(r.A) || !nam.includes(r.B)) return;
    const t = kq.tinh.D2[i];
    const key = kk(r.A);
    if (!paTheo.has(key)) paTheo.set(key, { ma: r.A, ten: c1Theo.get(key)?.r.B || '', theoNam: {} });
    const o = paTheo.get(key);
    if (!o.theoNam[r.B]) o.theoNam[r.B] = { C: t.C, D: r.D, E: r.E, G: r.G, J: t.J };
    const tn = tongNam[r.B];
    tn.C += so0(t.C); tn.D += so0(r.D); tn.E += so0(r.E); tn.G += so0(r.G); tn.soDong++;
    if (t.J === 'ĐÃ THẨM ĐỊNH' || t.J === 'ĐÃ QUYẾT ĐỊNH') tn.daXong++;
  });
  const phuongAn = { nam, dong: [...paTheo.values()], tongNam, soDong: coMa('D2').length,
    daXong: R('D2').filter((r, i) => !rong(r.A) && ['ĐÃ THẨM ĐỊNH', 'ĐÃ QUYẾT ĐỊNH'].includes(kq.tinh.D2[i].J)).length };

  // ── VII. Tồn tại ──
  const tonTai = kt.ds.filter((x) => x.muc !== 'tt').map((x) => {
    const b = BIEU_THEO_ID[x.bieu];
    const r = R(x.bieu).find((y) => y._id === x.id) || {};
    const k = cotKhoa(b);
    return { bieu: b.ma, dong: x.dong, maDong: k ? r[k.k] ?? '' : '', cot: x.cot ? `${x.cot} · ${b.cot.find((c) => c.k === x.cot)?.ten || ''}` : '', muc: x.muc, chu: x.chu };
  }).sort((a, b) => (a.muc === b.muc ? 0 : a.muc === 'loi' ? -1 : 1));

  // ── Nhận xét (chỉ sự kiện rút từ số liệu) ──
  const nx = [];
  const t = kq.tienDo;
  if (!t.soVT) nx.push('Chưa kê khai vị trí việc làm nào ở biểu C1 nên chưa xác định được nhu cầu nhân lực.');
  else nx.push(`Đã kê khai ${t.soNV} nhiệm vụ, ${khoiLuong.soCV} công việc và ${t.soVT} vị trí việc làm; ${t.soVTDu}/${t.soVT} vị trí (${Math.round((t.tyLe || 0) * 100)}%) đủ căn cứ theo điều kiện kiểm tra của bộ biểu.`);
  if (khoiLuong.soDongB1) {
    nx.push(`Khối lượng công việc: ${khoiLuong.dongB1Dat}/${khoiLuong.soDongB1} dòng B1 đạt, tổng ${vn(khoiLuong.gioB1, 1)} giờ/năm được tính sang C3.`
      + (khoiLuong.soDongB1 > khoiLuong.dongB1Dat ? ` Còn ${khoiLuong.soDongB1 - khoiLuong.dongB1Dat} dòng chưa đạt nên CHƯA được tính — chủ yếu: ${khoiLuong.lyDoB1.join('; ')}.` : ''));
  }
  if (khoiLuong.soDongB2CT) {
    nx.push(`Tác động thực tế: giảm ${vn(khoiLuong.gioGiamSoHoa, 1)} giờ do số hóa/cải tiến quy trình, giảm ${vn(khoiLuong.gioGiamKhac, 1)} giờ do thuê dịch vụ/tự chủ/xã hội hóa, tăng ${vn(khoiLuong.gioMoi, 1)} giờ công việc mới; tác động ròng ${vn(khoiLuong.gioTacDong, 1)} giờ (${khoiLuong.dongB2CTDat}/${khoiLuong.soDongB2CT} dòng đạt).`);
  }
  if (t.soVT) {
    nx.push(`Tổng người quy đổi theo PP2 là ${vn(tong.nguoiQD, 4)} (tham khảo, quỹ giờ ${vn(quyGio)} giờ/người/năm); tổng số người cần bố trí đã kết luận ở C3 là ${vn(tong.nguoiCan)}, trong đó ${vn(tong.nguoiCanDat)} thuộc các vị trí đủ căn cứ.`);
    const chuaDat = vtvl.filter((x) => !x.dat);
    if (chuaDat.length) nx.push(`${chuaDat.length} vị trí chưa đủ căn cứ: ${chuaDat.slice(0, 6).map((x) => `${x.ma} (${x.canhBao})`).join('; ')}${chuaDat.length > 6 ? '; …' : ''}.`);
    const thieu = vtvl.filter((x) => x.chenhNguoi !== null && x.chenhNguoi > 0);
    const du = vtvl.filter((x) => x.chenhNguoi !== null && x.chenhNguoi < 0);
    if (coMa('D1').length) {
      nx.push(`Đối chiếu với nguồn lực hiện có đã xác nhận ở D1 (${tong.soNguoiHienCo} người${d1BoQua ? `; ${d1BoQua} bản ghi chưa xác nhận không được tính` : ''}): ${thieu.length} vị trí có số người cần bố trí lớn hơn số người hiện có (cộng ${vn(thieu.reduce((s, x) => s + x.chenhNguoi, 0))} người), ${du.length} vị trí nhỏ hơn (cộng ${vn(du.reduce((s, x) => s + x.chenhNguoi, 0))} người). Số liệu đối chiếu chỉ để tham khảo, phương án chính thức theo biểu D2.`);
    }
  }
  if (phuongAn.soDong) nx.push(`Phương án bố trí 2027–2031: ${phuongAn.daXong}/${phuongAn.soDong} dòng đã thẩm định hoặc đã được quyết định.`);
  const viDu = Object.values(doc.bieu).flat().filter((r) => Object.entries(r).some(([k, v]) => k !== '_id' && typeof v === 'string' && kk(v).startsWith('VD-'))).length;
  if (viDu) nx.push(`Có ${viDu} dòng dùng mã ví dụ (VD-…) — phải xóa trước khi nộp vì số liệu giả định không được tổng hợp.`);
  nx.push(tongLoi || tongCanh ? `Còn ${tongLoi} lỗi và ${tongCanh} cảnh báo nghiệp vụ cần xử lý (chi tiết ở phần tồn tại).` : 'Không còn lỗi hay cảnh báo nghiệp vụ theo điều kiện kiểm tra của bộ biểu.');

  const hoanThien = t.soVT > 0 && tongLoi === 0 && tongCanh === 0 && t.soVTDu === t.soVT && !viDu;
  return {
    thongTin: { donVi: doc.donVi, ky: doc.ky, ngayLap: ngayVN(ngay), quyGio: quyGio || QUY_GIO_PP2, nguon: NGUON_BO_BIEU, capNhat: doc.capNhat },
    hoanThien,
    trangThai: hoanThien ? 'Dữ liệu đạt toàn bộ điều kiện kiểm tra của bộ biểu — có thể trình thẩm định'
      : t.soVT === 0 && !buoc.slice(0, 7).some((b) => b.soDong) ? 'Chưa kê khai' : 'Chưa hoàn thiện — còn tồn tại cần xử lý trước khi trình',
    tienDo: t, buoc, khoiLuong, vtvl, tong, theoLoai, phuongAn, kiemTra: kq.kiemTra, tonTai, tongLoi, tongCanh,
    nhanXet: nx, luuY: LUU_Y_BAO_CAO, soDongViDu: viDu,
  };
}
