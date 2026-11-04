// ============================================================================
//  XUẤT TỆP BỘ BIỂU
//
//  Hai đường ra, cố ý khác nhau:
//
//  1. `ghiLaiTep(tepGoc, doc)` — GHI SỐ MỚI VÀO CHÍNH TỆP ĐÃ NHẬP.
//     Chỉ thay đúng những ô người dùng nhập; mọi thứ còn lại của sổ (32 trang,
//     công thức 30.000 dòng, danh sách chọn, ghi chú ô, định dạng, khóa trang)
//     được CHÉP NGUYÊN SI bytes đã nén. Nhờ vậy tệp xuất ra vẫn là bộ biểu
//     thật của Ban, mở bằng Excel là tự tính lại hết.
//     ⚠️ KHÔNG đọc-ghi lại cả sổ bằng thư viện xlsx: làm thế sẽ rơi
//     `dataValidations`, `definedNames`, ghi chú ô và phần lớn định dạng.
//     ⚠️ Cột tự tính KHÔNG ghi gì vào — để Excel tính, tránh hai nguồn số.
//
//  2. `xuatTepMoi(doc, kq)` — dựng một tệp .xlsx GỌN (12 trang, đúng tên trang
//     và thứ tự cột của bộ biểu) cho trường hợp chưa nhập tệp nào, ví dụ đang
//     dùng bộ số mẫu. Tệp này KHÔNG phải bộ biểu gốc và nói rõ điều đó.
// ============================================================================
import { BIEU, BIEU_THEO_ID, cotNhap, soCot } from './moHinh.js';

// ─── CRC32 ──────────────────────────────────────────────────────────────────
let BANG_CRC = null;
function bangCrc() {
  if (BANG_CRC) return BANG_CRC;
  BANG_CRC = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    BANG_CRC[i] = c >>> 0;
  }
  return BANG_CRC;
}
function crc32(u8) {
  const t = bangCrc();
  let c = 0xFFFFFFFF;
  for (let i = 0; i < u8.length; i++) c = t[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

const sl = (b, i) => b[i] | (b[i + 1] << 8);
const sl4 = (b, i) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)) + b[i + 3] * 0x1000000;
const thoat = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/\r/g, '')
  // XML 1.0 không nhận ký tự điều khiển; bỏ chúng đi kẻo Excel báo tệp hỏng.
  .split('').filter((ch) => { const m = ch.codePointAt(0); return m === 9 || m === 10 || m >= 32; }).join('');

// ─── Mục lục ZIP ────────────────────────────────────────────────────────────
async function mucLuc(blob) {
  const duoi = new Uint8Array(await blob.slice(Math.max(0, blob.size - 66000)).arrayBuffer());
  let i = duoi.length - 22;
  while (i >= 0 && sl4(duoi, i) !== 0x06054b50) i--;
  if (i < 0) throw new Error('Tệp không phải .xlsx.');
  const soMuc = sl(duoi, i + 10);
  const cd = new Uint8Array(await blob.slice(sl4(duoi, i + 16), sl4(duoi, i + 16) + sl4(duoi, i + 12)).arrayBuffer());
  const ds = []; let p = 0;
  for (let k = 0; k < soMuc && p + 46 <= cd.length; k++) {
    const nl = sl(cd, p + 28), el = sl(cd, p + 30), cl = sl(cd, p + 32);
    ds.push({
      ten: new TextDecoder().decode(cd.subarray(p + 46, p + 46 + nl)),
      pp: sl(cd, p + 10), crc: sl4(cd, p + 16), nen: sl4(cd, p + 20), goc: sl4(cd, p + 24), lo: sl4(cd, p + 42),
    });
    p += 46 + nl + el + cl;
  }
  return ds;
}
async function bytesNen(blob, m) {
  const h = new Uint8Array(await blob.slice(m.lo, m.lo + 30).arrayBuffer());
  const d0 = m.lo + 30 + sl(h, 26) + sl(h, 28);
  return new Uint8Array(await blob.slice(d0, d0 + m.nen).arrayBuffer());
}
async function docChu(blob, m) {
  const raw = await bytesNen(blob, m);
  if (m.pp === 0) return new TextDecoder().decode(raw);
  const s = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(s).text();
}
async function nenRaw(u8) {
  if (typeof CompressionStream === 'undefined') return null;
  const s = new Blob([u8]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}

/** Đóng gói lại ZIP: mỗi mục là {ten, bytes, pp, crc, goc}. */
function dongZip(mucs) {
  const enc = new TextEncoder();
  const phan = []; const trung = [];
  let viTri = 0;
  for (const m of mucs) {
    const ten = enc.encode(m.ten);
    const lo = new Uint8Array(30 + ten.length);
    const dv = new DataView(lo.buffer);
    dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0, true);
    dv.setUint16(8, m.pp, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0, true);
    dv.setUint32(14, m.crc, true); dv.setUint32(18, m.bytes.length, true); dv.setUint32(22, m.goc, true);
    dv.setUint16(26, ten.length, true); dv.setUint16(28, 0, true);
    lo.set(ten, 30);
    phan.push(lo, m.bytes);
    const cd = new Uint8Array(46 + ten.length);
    const dc = new DataView(cd.buffer);
    dc.setUint32(0, 0x02014b50, true); dc.setUint16(4, 20, true); dc.setUint16(6, 20, true);
    dc.setUint16(8, 0, true); dc.setUint16(10, m.pp, true);
    dc.setUint32(16, m.crc, true); dc.setUint32(20, m.bytes.length, true); dc.setUint32(24, m.goc, true);
    dc.setUint16(28, ten.length, true); dc.setUint32(42, viTri, true);
    cd.set(ten, 46);
    trung.push(cd);
    viTri += lo.length + m.bytes.length;
  }
  const cdCo = trung.reduce((t, x) => t + x.length, 0);
  const cuoi = new Uint8Array(22);
  const dz = new DataView(cuoi.buffer);
  dz.setUint32(0, 0x06054b50, true);
  dz.setUint16(8, mucs.length, true); dz.setUint16(10, mucs.length, true);
  dz.setUint32(12, cdCo, true); dz.setUint32(16, viTri, true);
  return new Blob([...phan, ...trung, cuoi], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ─── Mổ XML của một trang: chỉ thay đúng các ô cần đổi ──────────────────────
const RE_O = /<c r="([A-Z]+)(\d+)"((?:[^>/]|\/(?!>))*)\/>|<c r="([A-Z]+)(\d+)"((?:[^>/]|\/(?!>))*)>([\s\S]*?)<\/c>/g;

/** Dựng XML một ô, giữ nguyên mã định dạng `s=` của ô cũ nếu có. */
function dungO(cot, dong, attrCu, giaTri) {
  const s = (String(attrCu || '').match(/ s="(\d+)"/) || [])[0] || '';
  const r = ` r="${cot}${dong}"`;
  if (giaTri === '' || giaTri === null || giaTri === undefined) return `<c${r}${s}/>`;
  if (typeof giaTri === 'number' && Number.isFinite(giaTri)) return `<c${r}${s}><v>${giaTri}</v></c>`;
  return `<c${r}${s} t="inlineStr"><is><t xml:space="preserve">${thoat(giaTri)}</t></is></c>`;
}

/**
 * Thay giá trị các ô trong XML của một trang.
 * @param {string} xml   XML gốc của trang
 * @param {Map<number, Map<string, any>>} sua  dòng Excel → (cột → giá trị mới)
 */
export function moTrangXml(xml, sua) {
  if (!sua.size) return { xml, soO: 0, soDongThieu: 0 };
  let soO = 0; let soDongThieu = 0;
  const daGap = new Set();
  const raXml = xml.replace(/<row r="(\d+)"([^>]*)>([\s\S]*?)<\/row>/g, (tron, rStr, attr, noi) => {
    const r = Number(rStr);
    const c = sua.get(r);
    if (!c) return tron;
    daGap.add(r);
    // gom ô hiện có theo cột
    const oCu = new Map();
    for (const m of noi.matchAll(RE_O)) {
      const cot = m[1] || m[4];
      oCu.set(cot, { xml: m[0], attr: m[3] || m[6] || '' });
    }
    for (const [cot, v] of c) {
      oCu.set(cot, { xml: dungO(cot, r, oCu.get(cot)?.attr, v), attr: oCu.get(cot)?.attr || '', moi: true });
      soO++;
    }
    const thuTu = [...oCu.keys()].sort((a, b) => soCot(a) - soCot(b));
    return `<row r="${r}"${attr}>${thuTu.map((k) => oCu.get(k).xml).join('')}</row>`;
  });
  for (const r of sua.keys()) if (!daGap.has(r)) soDongThieu++;
  return { xml: raXml, soO, soDongThieu };
}

/** Bắt Excel tính lại toàn bộ khi mở tệp (tệp gốc không lưu kết quả tính). */
export function batTinhLai(wbXml) {
  if (/<calcPr[^>]*\/>/.test(wbXml)) {
    return wbXml.replace(/<calcPr([^>]*)\/>/, (m, a) => (a.includes('fullCalcOnLoad')
      ? m : `<calcPr${a} fullCalcOnLoad="1"/>`));
  }
  return wbXml.replace('</workbook>', '<calcPr calcId="0" fullCalcOnLoad="1"/></workbook>');
}

/** Hai giá trị coi là NHƯ NHAU khi ghi lại (số 10 và chuỗi "10" là một). */
const nhuNhau = (a, b) => {
  const r = (v) => (v === undefined || v === null ? '' : v);
  if (typeof r(a) === 'number' && typeof r(b) === 'number') return Math.abs(a - b) < 1e-9;
  return String(r(a)) === String(r(b));
};

/**
 * GHI SỐ MỚI VÀO CHÍNH TỆP ĐÃ NHẬP.
 *
 * ⚠️ CHỈ ghi những ô ĐÃ ĐỔI so với `docGoc` (bản vừa đọc từ tệp). Trang nào
 * không có ô nào đổi thì chép nguyên si bytes đã nén — nếu nén lại hết thì một
 * lượt xuất mất vài giây vì riêng trang B1 đã là 57 MB XML.
 *
 * @param {Blob} tepGoc  tệp .xlsx đã nhập
 * @param {object} doc   bộ biểu hiện tại trong phần mềm
 * @param {object} tuy   {docGoc} bản gốc để so · {chiBieu} giới hạn biểu cần ghi
 * @returns {Promise<{blob: Blob, soO: number, theoBieu: object, canhBao: string[]}>}
 */
export async function ghiLaiTep(tepGoc, doc, { chiBieu = null, docGoc = null } = {}) {
  const ds = await mucLuc(tepGoc);
  const theoTen = new Map(ds.map((m) => [m.ten, m]));
  const wbXml = await docChu(tepGoc, theoTen.get('xl/workbook.xml'));
  const relsXml = await docChu(tepGoc, theoTen.get('xl/_rels/workbook.xml.rels'));
  const rel = {};
  for (const m of relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) rel[m[1]] = m[2].replace(/^\/?xl\//, '');
  const tepTrang = new Map();
  for (const m of wbXml.matchAll(/<sheet[^>]*\/>/g)) {
    const ten = (m[0].match(/name="([^"]*)"/) || [])[1] || '';
    const id = (m[0].match(/r:id="([^"]+)"/) || [])[1];
    if (ten && rel[id]) tepTrang.set(ten.replace(/&amp;/g, '&'), 'xl/' + rel[id]);
  }

  // dựng danh sách ô cần thay, theo từng trang
  const canSua = new Map();      // tên mục xml → Map(dòng → Map(cột → giá trị))
  const theoBieu = {};
  const canhBao = [];
  for (const b of BIEU) {
    const cot = cotNhap(b.id);
    if (!cot.length) continue;
    if (chiBieu && !chiBieu.includes(b.id)) continue;
    const tep = tepTrang.get(b.trang);
    if (!tep) { canhBao.push(`Tệp không có trang "${b.trang}" — bỏ qua biểu ${b.id}.`); continue; }
    const sua = canSua.get(tep) || new Map();
    const dongGoc = docGoc ? (docGoc.bieu[b.id] || []) : null;
    let dem = 0;
    for (const [i, r] of (doc.bieu[b.id] || []).entries()) {
      if (!r._dongTep) { canhBao.push(`${b.id}: có dòng mới thêm trong phần mềm — tệp xuất ra KHÔNG thêm dòng (chỉ ghi số vào dòng đã có).`); continue; }
      const g = dongGoc ? (dongGoc.find((x) => x._dongTep === r._dongTep) || dongGoc[i]) : null;
      const o = sua.get(r._dongTep) || new Map();
      for (const c of cot) {
        const v = r[c.k] === undefined ? '' : r[c.k];
        if (g && nhuNhau(v, g[c.k])) continue;            // không đổi thì không ghi
        o.set(c.k, v); dem++;
      }
      if (o.size) sua.set(r._dongTep, o);
    }
    if (sua.size) canSua.set(tep, sua);
    if (dem) theoBieu[b.id] = dem;
  }

  const mucs = [];
  for (const m of ds) {
    if (m.ten === 'xl/workbook.xml') {
      const u8 = new TextEncoder().encode(batTinhLai(wbXml));
      const nen = await nenRaw(u8);
      mucs.push({ ten: m.ten, bytes: nen || u8, pp: nen ? 8 : 0, crc: crc32(u8), goc: u8.length });
      continue;
    }
    const sua = canSua.get(m.ten);
    if (!sua || !sua.size) { mucs.push({ ten: m.ten, bytes: await bytesNen(tepGoc, m), pp: m.pp, crc: m.crc, goc: m.goc }); continue; }
    const xml = await docChu(tepGoc, m);
    const kq = moTrangXml(xml, sua);
    if (kq.soDongThieu) canhBao.push(`${m.ten}: ${kq.soDongThieu} dòng không tìm thấy trong tệp.`);
    const u8 = new TextEncoder().encode(kq.xml);
    const nen = await nenRaw(u8);
    mucs.push({ ten: m.ten, bytes: nen || u8, pp: nen ? 8 : 0, crc: crc32(u8), goc: u8.length });
  }
  const soO = Object.values(theoBieu).reduce((t, x) => t + x, 0);
  return { blob: dongZip(mucs), soO, theoBieu, canhBao };
}

/** Tên tệp xuất ra: bỏ dấu, giữ hoa Đ → D. */
export function tenTepXuat(doc, hau = '') {
  const dv = String(doc.donVi || 'bo_bieu').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/[^\w]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
  const ng = new Date().toISOString().slice(0, 10).split('-').reverse().join('');
  return `Bo_bieu_VTVL_${dv}${hau ? '_' + hau : ''}_${ng}.xlsx`;
}

/** Dựng sổ .xlsx gọn (12 trang) khi chưa nhập tệp nào — cần thư viện xlsx. */
export function dungSoGon(XLSX, doc, kq) {
  const wb = XLSX.utils.book_new();
  for (const b of BIEU) {
    const dong = doc.bieu[b.id] || [];
    const aoa = [[`Biểu ${b.ten} – ${doc.donVi || ''}`], b.cot.map((x) => x.ten)];
    dong.forEach((r, i) => aoa.push(b.cot.map((cc) => {
      if (cc.tinh) { const v = kq?.[b.id]?.[i]?.[cc.k]; return v === undefined ? '' : v; }
      return r[cc.k] === undefined ? '' : r[cc.k];
    })));
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = b.cot.map((x) => ({ wch: x.kieu === 'dai' ? 40 : x.kieu === 'ma' ? 18 : 14 }));
    XLSX.utils.book_append_sheet(wb, ws, b.trang.slice(0, 31));
  }
  const t = kq?.tongHop || {};
  const ws = XLSX.utils.aoa_to_sheet([
    ['TỔNG HỢP (phần mềm tự tính)'],
    ['Chỉ tiêu', 'Giá trị'],
    ['Đơn vị', doc.donVi || ''], ['Kỳ', doc.ky || ''],
    ['Số VTVL', t.soVTVL ?? ''], ['Số công việc', t.soCongViec ?? ''],
    ['Giờ B1 (dòng đạt)', t.gioB1 ?? ''], ['Giờ giảm số hóa, cải tiến', t.giamSoHoa ?? ''],
    ['Giờ giảm thuê DV, tự chủ, XHH', t.giamThue ?? ''], ['Giờ việc mới', t.vietMoi ?? ''],
    ['Giờ ròng', t.gioRong ?? ''], ['Quỹ giờ PP2 (giờ/người/năm)', t.quyGio ?? ''],
    ['Người quy đổi PP2', t.nguoiQD ?? ''], ['Người cần bố trí (C3)', t.nguoiCan ?? ''],
    [], ['LƯU Ý', 'Tệp này do phần mềm dựng, KHÔNG phải bộ biểu gốc của Ban Tổ chức Trung ương (thiếu công thức, danh sách chọn và các trang hướng dẫn). Để có bộ biểu đúng mẫu, hãy nhập tệp gốc rồi xuất lại.'],
  ]);
  ws['!cols'] = [{ wch: 34 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, ws, 'TONG_HOP');
  return wb;
}

/** Xuất tệp gọn (tải về ngay). */
export async function xuatTepMoi(doc, kq) {
  const XLSX = await import('xlsx');
  const ten = tenTepXuat(doc, 'ban_gon');
  XLSX.writeFile(dungSoGon(XLSX, doc, kq), ten);
  return ten;
}

/** Bản sao lưu JSON — nạp lại được, nhẹ, dùng khi muốn mang dữ liệu sang máy khác. */
export function xuatSaoLuu(doc) {
  const blob = new Blob([JSON.stringify({ loai: 'vtvl-sao-luu', luc: new Date().toISOString(), doc }, null, 1)],
    { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = tenTepXuat(doc, 'sao_luu').replace(/\.xlsx$/, '.json');
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

/** Tải một Blob về máy. */
export function taiVe(blob, ten) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = ten;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export { BIEU_THEO_ID };
