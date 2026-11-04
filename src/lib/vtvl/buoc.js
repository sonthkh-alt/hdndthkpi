// ============================================================================
//  CÁC BƯỚC NHẬP SỐ
//
//  A1 (nhiệm vụ), A2 (công việc), C1 (vị trí việc làm) và danh mục sản phẩm là
//  CỐ ĐỊNH — lấy từ tệp, phần mềm không cho sửa. Việc của người dùng chỉ là
//  điền các CON SỐ, đi lần lượt theo các bước dưới đây; mỗi bước xong thì bấm
//  "Tiếp". Mỗi bước tự khai: nhập cột nào, gom dòng theo gì, tên dòng hiện ra
//  cho người đọc là gì, cột tự tính nào cần cho thấy, cột cảnh báo nào.
//
//  Thứ tự các bước đi theo đúng chuỗi phụ thuộc của bộ biểu:
//  sản lượng (B1) → tác động (B2) → nhu cầu người (C3) → nhân lực hiện có (D1)
//  → dự báo 5 năm → phương án (D2).
// ============================================================================
import { BIEU_THEO_ID } from './moHinh.js';

export const BUOC = [
  {
    id: 'nguon', ten: 'Nguồn dữ liệu', nhan: 'Chọn bộ biểu',
    moTa: 'Nhập tệp bộ biểu .xlsx của đơn vị, hoặc xem thử bằng bộ số mẫu.',
  },
  {
    id: 'B1', bieu: 'B1', ten: 'Sản lượng công việc', nhan: 'Sản lượng',
    moTa: 'Trong kỳ mỗi công việc làm được bao nhiêu sản phẩm.',
    hoi: 'Số sản phẩm trong kỳ',
    gom: 'VTVL',
    nhapChinh: 'C',
    nhap: ['C', 'D', 'E'],
    hien: ['P', 'F', 'G'],
    canhBao: 'R',
    datLa: 'ĐẠT',
  },
  {
    id: 'B2', bieu: 'B2CT', ten: 'Tác động của thay đổi', nhan: 'Tác động',
    moTa: 'Công đoạn nào được số hóa, cải tiến, thuê dịch vụ — giảm hay tăng bao nhiêu phút.',
    hoi: 'Số sản phẩm áp dụng và số phút trước / sau thay đổi',
    gom: 'VTVL',
    nhapChinh: 'E',
    nhap: ['E', 'F', 'G', 'I'],
    hien: ['H', 'N', 'O'],
    canhBao: 'P',
    datLa: 'ĐẠT',
  },
  {
    id: 'C3', bieu: 'C3', ten: 'Nhu cầu nhân lực', nhan: 'Nhu cầu',
    moTa: 'Máy tính ra số người theo giờ (PP2); đơn vị kết luận số người cần bố trí.',
    hoi: 'Số người theo cơ cấu quy định (PP1) và số người cần bố trí',
    gom: 'khong',
    nhapChinh: 'J',
    nhap: ['H', 'I', 'J'],
    hien: ['C', 'D', 'E', 'F', 'G'],
    canhBao: 'M',
    datLa: 'ĐẠT',
  },
  {
    id: 'D1', bieu: 'D1', ten: 'Nhân lực hiện có', nhan: 'Hiện có',
    moTa: 'Từng người đang làm: bao nhiêu giờ cho vị trí này, bao nhiêu giờ cho việc khác.',
    hoi: 'Số giờ trong năm',
    gom: 'VTVL',
    nhapChinh: 'E',
    nhap: ['E', 'F', 'K'],
    hien: ['D'],
    canhBao: 'J',
    datLa: 'Đạt',
  },
  {
    id: 'DU', bieu: 'DU', ten: 'Dự báo 5 năm', nhan: 'Dự báo',
    moTa: 'Mỗi năm 2027–2031 tăng hay giảm bao nhiêu người so với năm cơ sở (ghi 0 nếu không đổi).',
    hoi: 'Biến động số người (+ tăng, − giảm)',
    gom: 'VTVL',
    nhapChinh: 'C',
    nhap: ['C'],
    hien: ['G', 'H'],
    canhBao: 'I',
    datLa: 'ĐẠT',
  },
  {
    id: 'D2', bieu: 'D2', ten: 'Phương án 2027–2031', nhan: 'Phương án',
    moTa: 'Mỗi năm bố trí được bao nhiêu người, biên chế được giao, có đề nghị điều chỉnh không.',
    hoi: 'Số người bố trí được và số đề nghị điều chỉnh',
    gom: 'VTVL',
    nhapChinh: 'D',
    nhap: ['D', 'E', 'G'],
    hien: ['C', 'K', 'L'],
    canhBao: 'J',
    datLa: ['SẴN SÀNG THẨM ĐỊNH', 'ĐÃ THẨM ĐỊNH', 'ĐÃ QUYẾT ĐỊNH'],
  },
  {
    id: 'xong', ten: 'Kết quả và xuất tệp', nhan: 'Kết quả',
    moTa: 'Xem lại toàn bộ con số rồi ghi ngược vào tệp bộ biểu.',
  },
];

export const BUOC_THEO_ID = Object.fromEntries(BUOC.map((b) => [b.id, b]));
export const BUOC_NHAP = BUOC.filter((b) => b.bieu);

/** Một cảnh báo có được coi là ĐẠT ở bước này không. */
export const laDat = (buoc, giaTri) => (Array.isArray(buoc.datLa)
  ? buoc.datLa.includes(giaTri) : giaTri === buoc.datLa);

/** Tên người đọc được của một dòng trong bước. */
export function nhanDong(doc, buoc, dong) {
  if (buoc.bieu === 'B1' || buoc.bieu === 'B2CT') {
    const cv = (doc.bieu.A2 || []).find((x) => String(x.A).toLowerCase() === String(dong.A).toLowerCase());
    const ten = cv?.D || '';
    const phu = buoc.bieu === 'B2CT' ? dong.D : (cv?.E || '');
    return { ma: dong.A, ten, phu, dvt: cv?.F || '' };
  }
  if (buoc.bieu === 'D1') {
    const vt = (doc.bieu.C1 || []).find((x) => String(x.A).toLowerCase() === String(dong.B).toLowerCase());
    return { ma: dong.A, ten: vt?.B || dong.B, phu: dong.G || '', dvt: 'giờ' };
  }
  const vt = (doc.bieu.C1 || []).find((x) => String(x.A).toLowerCase() === String(dong.A).toLowerCase());
  const nam = dong.B && buoc.bieu !== 'C3' ? `Năm ${dong.B}` : '';
  return { ma: dong.A, ten: vt?.B || dong.A, phu: nam, dvt: 'người', nam: dong.B };
}

/** Mã VTVL của một dòng, dùng để gom nhóm. */
export function vtvlCuaDong(doc, bieuId, dong, kqDong) {
  if (bieuId === 'B1' || bieuId === 'B2CT') {
    if (kqDong?.B) return kqDong.B;
    const cv = (doc.bieu.A2 || []).find((x) => String(x.A).toLowerCase() === String(dong.A).toLowerCase());
    return cv?.C || '';
  }
  if (bieuId === 'D1') return dong.B || '';
  return dong.A || '';
}

/**
 * Gom các dòng của một bước thành NHÓM để người dùng đi lần lượt.
 * @returns {Array<{khoa, ten, moTa, dong: Array<{i, dong, kq}>, soChuaDat}>}
 */
export function nhomDong(doc, kq, buoc) {
  const ds = (doc.bieu[buoc.bieu] || []);
  const kqB = kq?.[buoc.bieu] || [];
  const co = ds.map((dong, i) => ({ i, dong, kq: kqB[i] || {} })).filter((x) => x.dong.A !== '' && x.dong.A !== undefined);
  if (buoc.gom !== 'VTVL') {
    return [{ khoa: '*', ten: BIEU_THEO_ID[buoc.bieu]?.ten || '', moTa: '', dong: co, soChuaDat: co.filter((x) => !laDat(buoc, x.kq[buoc.canhBao])).length }];
  }
  const theoVT = new Map();
  for (const x of co) {
    const vt = vtvlCuaDong(doc, buoc.bieu, x.dong, x.kq) || '(chưa gắn vị trí việc làm)';
    if (!theoVT.has(vt)) theoVT.set(vt, []);
    theoVT.get(vt).push(x);
  }
  // xếp theo thứ tự của C1 để các bước đi cùng một trật tự
  const thuTu = (doc.bieu.C1 || []).map((r) => String(r.A).toLowerCase());
  const nhom = [...theoVT.entries()].sort((a, b) => {
    const ia = thuTu.indexOf(String(a[0]).toLowerCase()); const ib = thuTu.indexOf(String(b[0]).toLowerCase());
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
  return nhom.map(([vt, dong]) => {
    const c1 = (doc.bieu.C1 || []).find((x) => String(x.A).toLowerCase() === String(vt).toLowerCase());
    return {
      khoa: vt, ten: c1?.B || vt, moTa: c1 ? `${vt} · ${c1.C || ''}` : vt,
      dong, soChuaDat: dong.filter((x) => !laDat(buoc, x.kq[buoc.canhBao])).length,
    };
  });
}

/** Tiến độ của một bước: bao nhiêu dòng đã đạt, bao nhiêu ô còn trống. */
export function tienDoBuoc(doc, kq, buoc) {
  if (!buoc.bieu) return null;
  const kqB = kq?.[buoc.bieu] || [];
  const co = (doc.bieu[buoc.bieu] || []).map((r, i) => ({ r, k: kqB[i] || {} }))
    .filter((x) => x.r.A !== '' && x.r.A !== undefined);
  const dat = co.filter((x) => laDat(buoc, x.k[buoc.canhBao])).length;
  const trong = co.filter((x) => x.r[buoc.nhapChinh] === '' || x.r[buoc.nhapChinh] === undefined).length;
  return { tong: co.length, dat, chuaDat: co.length - dat, trong };
}

/** Tổng tiến độ mọi bước nhập số. */
export function tienDoChung(doc, kq) {
  return BUOC_NHAP.map((b) => ({ buoc: b, ...tienDoBuoc(doc, kq, b) }));
}
