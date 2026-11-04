// ============================================================================
//  ĐỌC TỆP BỘ BIỂU .XLSX
//
//  ⚠️ Vì sao phải tự viết bộ đọc: tệp bộ biểu của Ban nặng ~29 MB nhưng bên
//  trong là ~380 MB XML, do mỗi biểu đặt sẵn CÔNG THỨC cho 30.000 dòng. Thư
//  viện đọc .xlsx thông thường dựng cả sổ trong bộ nhớ → trình duyệt treo
//  hoặc cạn bộ nhớ. Ở đây:
//    · chỉ đọc đúng những trang cần, theo tên trang;
//    · giải nén theo DÒNG CHẢY (DecompressionStream) và **dừng ngay** khi đã
//      qua hết vùng có dữ liệu, nên thực tế chỉ đọc vài trăm KB mỗi trang;
//    · ô công thức chưa có kết quả (`<v/>` rỗng) được bỏ qua — tệp của Ban
//      KHÔNG lưu kết quả tính, Excel tính khi mở.
//
//  ⚠️ Mẫu do thư viện .NET ghi có TIỀN TỐ KHÔNG GIAN TÊN (`<x:row>`): bộ đọc
//  tự nhận tiền tố từ thẻ `sheetData`, nếu không sẽ trả về RỖNG mà không báo
//  lỗi — hỏng kiểu đó nguy hiểm hơn là báo lỗi.
// ============================================================================
import { BIEU, BIEU_THEO_TRANG, soCot } from './moHinh.js';

/** Số dòng trống liên tiếp thì coi như đã hết dữ liệu của trang. */
const DONG_TRONG_DUNG = 150;

const sl = (b, i) => b[i] | (b[i + 1] << 8);
const sl4 = (b, i) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)) + b[i + 3] * 0x1000000;

/** Đọc mục lục ZIP từ cuối tệp (không nạp cả tệp vào bộ nhớ). */
async function mucLucZip(blob) {
  const duoi = new Uint8Array(await blob.slice(Math.max(0, blob.size - 66000)).arrayBuffer());
  let i = duoi.length - 22;
  while (i >= 0 && sl4(duoi, i) !== 0x06054b50) i--;
  if (i < 0) throw new Error('Tệp không phải .xlsx (không tìm thấy mục lục ZIP).');
  const soMuc = sl(duoi, i + 10);
  let viTri = sl4(duoi, i + 16);
  const coMuc = sl4(duoi, i + 12);
  const cd = new Uint8Array(await blob.slice(viTri, viTri + coMuc).arrayBuffer());
  const ds = new Map();
  let p = 0;
  for (let k = 0; k < soMuc && p + 46 <= cd.length; k++) {
    const nl = sl(cd, p + 28), el = sl(cd, p + 30), cl = sl(cd, p + 32);
    const ten = new TextDecoder().decode(cd.subarray(p + 46, p + 46 + nl));
    ds.set(ten, { pp: sl(cd, p + 10), nen: sl4(cd, p + 20), goc: sl4(cd, p + 24), lo: sl4(cd, p + 42) });
    p += 46 + nl + el + cl;
  }
  return ds;
}

/** Vùng byte ĐÃ NÉN của một mục (bỏ qua local header). */
async function vungNen(blob, m) {
  const h = new Uint8Array(await blob.slice(m.lo, m.lo + 30).arrayBuffer());
  const nl = sl(h, 26), el = sl(h, 28);
  const d0 = m.lo + 30 + nl + el;
  return blob.slice(d0, d0 + m.nen);
}

/** Giải nén trọn một mục thành chuỗi (dùng cho tệp nhỏ: workbook, sharedStrings). */
async function docMuc(blob, ds, ten) {
  const m = ds.get(ten);
  if (!m) return null;
  const phan = await vungNen(blob, m);
  if (m.pp === 0) return new Response(phan).text();
  const s = phan.stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(s).text();
}

const boTienTo = (t) => t.replace(/<\/?[A-Za-z0-9]+:/g, (x) => (x[1] === '/' ? '</' : '<'));
const giaiMa = (s) => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');

/**
 * Quét các dòng của một trang theo dòng chảy, dừng sớm khi hết dữ liệu.
 * @returns {Promise<Array<Array<string|number>>>} mảng dòng, mỗi dòng là mảng ô theo chỉ số cột.
 */
async function quetTrang(blob, m, ss, onTienDo) {
  const phan = await vungNen(blob, m);
  const stream = m.pp === 0 ? phan.stream() : phan.stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const doc = stream.getReader();
  const giaiNen = new TextDecoder('utf-8');
  let dem = '';           // đệm chữ chưa xử lý
  let tienTo = null;      // tiền tố không gian tên, '' nếu không có
  let trong = 0;          // số dòng trống liên tiếp
  let daQua = 0;          // số byte đã đọc (để báo tiến độ)
  const ra = [];
  let xong = false;

  const xuLyDong = (xml, soDong) => {
    const o = [];
    let coGiaTri = false;
    // ⚠️ Ô RỖNG là thẻ TỰ ĐÓNG `<c r="E3" s="1"/>`; khớp dạng đó TRƯỚC, kẻo
    // `[^>]*>` ăn luôn dấu "/" rồi nội dung của ô kế tiếp bị gán sang ô này.
    const RE = /<c r="([A-Z]+)\d+"((?:[^>/]|\/(?!>))*)\/>|<c r="([A-Z]+)\d+"((?:[^>/]|\/(?!>))*)>([\s\S]*?)<\/c>/g;
    for (const c of xml.matchAll(RE)) {
      const cot = c[1] || c[3];
      const attr = c[2] || c[4] || '';
      const noi = c[5] || '';
      if (!noi) continue;                                   // ô rỗng
      const t = (attr.match(/t="([^"]+)"/) || [])[1];
      let v;
      if (t === 'inlineStr') {
        const m2 = noi.match(/<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>/);
        v = m2 ? giaiMa(m2[1]) : '';
      } else {
        const m2 = noi.match(/<v>([\s\S]*?)<\/v>/);
        if (!m2) continue;                                  // công thức chưa có kết quả: <v/>
        v = m2[1];
        if (t === 's') v = ss[Number(v)] ?? '';
        else if (t === 'str' || t === 'e') v = giaiMa(v);
        else if (t === 'b') v = v === '1' ? 'TRUE' : 'FALSE';
        else { const n = Number(v); v = Number.isFinite(n) ? n : giaiMa(v); }
      }
      if (v === '' || v === null) continue;
      o[soCot(cot)] = v;
      coGiaTri = true;
    }
    if (coGiaTri) { trong = 0; ra[soDong - 1] = o; } else if (soDong > 2) trong++;
  };

  while (!xong) {
    const { value, done } = await doc.read();
    if (done) break;
    daQua += value.byteLength;
    dem += giaiNen.decode(value, { stream: true });
    if (tienTo === null) {
      const m2 = dem.match(/<([A-Za-z0-9]+:)?sheetData/);
      if (m2) tienTo = m2[1] || '';
    }
    if (tienTo === null) continue;
    if (tienTo) dem = boTienTo(dem);
    // cắt từng dòng hoàn chỉnh
    for (;;) {
      const i = dem.indexOf('<row ');
      if (i < 0) break;
      const j = dem.indexOf('</row>', i);
      if (j < 0) {
        // dòng tự đóng `<row r="5" .../>` (dòng rỗng) — bỏ qua tới dấu đóng gần nhất
        const k = dem.indexOf('/>', i);
        const kHet = dem.indexOf('>', i);
        if (k >= 0 && k === kHet - 1) {
          const r = Number((dem.slice(i, k).match(/ r="(\d+)"/) || [])[1] || 0);
          if (r > 2) trong++;
          dem = dem.slice(k + 2);
          continue;
        }
        break;
      }
      const xml = dem.slice(i, j);
      const r = Number((xml.match(/ r="(\d+)"/) || [])[1] || 0);
      xuLyDong(xml, r);
      dem = dem.slice(j + 6);
      if (trong >= DONG_TRONG_DUNG) { xong = true; break; }
    }
    if (dem.length > 4_000_000) dem = dem.slice(-200_000);   // chặn đệm phình
    onTienDo?.(daQua);
  }
  try { await doc.cancel(); } catch { /* đã đóng */ }
  return ra;
}

/**
 * Đọc một tệp bộ biểu .xlsx.
 * @returns {Promise<{trang: Map<string, Array>, tenTep: string, msDoc: number}>}
 */
export async function docXlsx(file, { onTienDo } = {}) {
  const t0 = Date.now();
  const ds = await mucLucZip(file);
  const wbXml = boTienTo((await docMuc(file, ds, 'xl/workbook.xml')) || '');
  const relsXml = boTienTo((await docMuc(file, ds, 'xl/_rels/workbook.xml.rels')) || '');
  if (!wbXml) throw new Error('Tệp .xlsx không có xl/workbook.xml — không đọc được.');

  const rel = {};
  for (const m of relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) rel[m[1]] = m[2].replace(/^\/?xl\//, '');
  const trangTep = new Map();
  for (const m of wbXml.matchAll(/<sheet[^>]*\/>/g)) {
    const ten = giaiMa((m[0].match(/name="([^"]*)"/) || [])[1] || '');
    const id = (m[0].match(/r:id="([^"]+)"/) || [])[1];
    if (ten && rel[id]) trangTep.set(ten, 'xl/' + rel[id]);
  }

  const ssXml = (await docMuc(file, ds, 'xl/sharedStrings.xml')) || '';
  const ss = [];
  for (const m of boTienTo(ssXml).matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    ss.push(giaiMa([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')));
  }

  // chỉ đọc các trang của những biểu phần mềm dùng
  const can = BIEU.map((b) => b.trang);
  const trang = new Map();
  let i = 0;
  for (const ten of can) {
    const tep = trangTep.get(ten);
    i++;
    if (!tep || !ds.get(tep)) continue;
    onTienDo?.({ phan: (i - 1) / can.length, trang: ten });
    trang.set(ten, await quetTrang(file, ds.get(tep), ss));
  }
  onTienDo?.({ phan: 1, trang: '' });
  return { trang, tenTep: file.name || '', msDoc: Date.now() - t0, coTrang: [...trangTep.keys()] };
}

/** Lấy chữ ở một ô của trang đã đọc (dùng cho trang thông tin). */
const oTrang = (bang, dong, cot) => bang?.[dong - 1]?.[soCot(cot)] ?? '';

/**
 * Chuyển kết quả đọc thành bộ biểu của phần mềm.
 * Dòng dữ liệu bắt đầu từ dòng 3; dòng 1 là tiêu đề, dòng 2 là tên cột.
 */
export function dungBoBieu(ketQuaDoc) {
  const { trang, tenTep } = ketQuaDoc;
  const doc = { donVi: '', ky: '', vung: '', tenTep, bieu: {} };
  let stt = 0;
  for (const b of BIEU) {
    const bang = trang.get(b.trang) || [];
    const ds = [];
    for (let r = 3; r <= bang.length; r++) {
      const o = bang[r - 1];
      if (!o) continue;
      const dong = { _id: `d${++stt}`, _dongTep: r };
      let co = false;
      for (const c of b.cot) {
        const v = o[soCot(c.k)];
        if (v === undefined || v === '') { dong[c.k] = ''; continue; }
        if (c.kieu === 'so' || c.kieu === 'nam') {
          const n = typeof v === 'number' ? v : Number(String(v).replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
          dong[c.k] = Number.isFinite(n) ? n : v;
        } else dong[c.k] = typeof v === 'number' ? v : String(v);
        if (!c.tinh && dong[c.k] !== '') co = true;
      }
      const khoa = b.cot.find((x) => x.khoa)?.k || 'A';
      if (co && !(dong[khoa] === '' && b.vai !== 'tinh')) ds.push(dong);
      else if (co) ds.push(dong);
    }
    doc.bieu[b.id] = ds;
  }
  // Tên đơn vị và kỳ: lấy từ dòng tiêu đề của biểu A1 ("Biểu A1_ Nhiệm vụ – <đơn vị>")
  const tdA1 = String(oTrang(trang.get('1. A1_NhiemVu'), 1, 'A') || '');
  const m = tdA1.match(/[–-]\s*(.+)$/);
  if (m) doc.donVi = m[1].trim();
  const b1 = doc.bieu.B1 || [];
  doc.ky = (b1.find((r) => r.K)?.K || '').trim();
  return doc;
}

/** Đọc tệp và dựng bộ biểu trong một lượt. */
export async function napTep(file, { onTienDo } = {}) {
  const kq = await docXlsx(file, { onTienDo });
  const doc = dungBoBieu(kq);
  return { doc, msDoc: kq.msDoc, coTrang: kq.coTrang, thieuTrang: BIEU.filter((b) => !kq.trang.has(b.trang)).map((b) => b.trang) };
}

export { BIEU_THEO_TRANG };
