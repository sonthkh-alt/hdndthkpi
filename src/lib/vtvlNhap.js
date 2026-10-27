// ============================================================================
//  NHẬP DỮ LIỆU TỪ TỆP cho phân hệ "Bộ biểu Vị trí việc làm" — LOGIC THUẦN
//  (chạy được cả trong trình duyệt lẫn Node ≥ 18: chỉ dùng Blob, Response,
//   DecompressionStream, TextDecoderStream — không cần thư viện ngoài).
//
//  ① `docXlsx(blob)` — bộ đọc .xlsx KIỂU DÒNG CHẢY. Tệp mẫu của Ban nặng 43 MB,
//     giải nén ra ~400 MB XML vì mỗi biểu đặt sẵn 30.000 dòng công thức; nạp cả
//     tệp bằng thư viện thông thường thì trình duyệt cạn bộ nhớ. Ở đây mỗi trang
//     tính được giải nén và quét TỪNG KHÚC, chỉ giữ ô có giá trị: ô công thức
//     rỗng (`<v/>`) và ô trống bị bỏ ngay → bộ nhớ chỉ tỉ lệ với số dòng thật.
//     Chỉ đọc những trang ứng với một biểu nhập liệu (bỏ trang hướng dẫn và các
//     biểu tự tính như B2_ThayDoi, DOI_CHIEU_NV).
//  ② `docBangChu(text)` — CSV/TSV (cả nội dung dán từ Excel).
//  ③ `nhanDienBang` — nhận biểu theo TÊN TRANG (bỏ số thứ tự, bỏ dấu) hoặc theo
//     DÒNG TIÊU ĐỀ; ghép cột theo TÊN CỘT, thiếu tiêu đề thì theo vị trí A, B, C…
//  ④ `chuanBiNhap` — dựng bản dữ liệu sau khi nhập (thay thế / ghép theo mã /
//     chỉ thêm mới), chạy TOÀN BỘ phép kiểm tra của vtvl.js trên bản đó, gắn lỗi
//     về đúng "dòng trong tệp", và (tùy chọn) bỏ các dòng có lỗi chặn.
// ============================================================================
import {
  BIEU, BIEU_THEO_ID, bieuNhap, cotNhap, chuyenGiaTri, chuanHoaVTVL, newId, kk, rong,
  tinhToan, kiemTraDuLieu, laSo, QUY_GIO_PP2,
} from './vtvl.js';
import { HD } from './vtvlHuongDan.js';

// ─── ① ZIP + XLSX ───────────────────────────────────────────────────────────
const u16 = (b, o) => b[o] | (b[o + 1] << 8);
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const utf8 = new TextDecoder('utf-8');

async function bytes(blob, from, to) { return new Uint8Array(await blob.slice(from, to).arrayBuffer()); }

/** Đọc mục lục (central directory) của tệp ZIP. */
export async function docMucLucZip(blob) {
  const size = blob.size;
  const tailLen = Math.min(size, 65557);
  const tail = await bytes(blob, size - tailLen, size);
  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) if (u32(tail, i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('Tệp không phải định dạng .xlsx (không đọc được cấu trúc ZIP). Hãy mở bằng Excel rồi "Lưu thành" Excel Workbook (.xlsx).');
  const cdSize = u32(tail, eocd + 12), cdOff = u32(tail, eocd + 16);
  if (cdOff === 0xffffffff) throw new Error('Tệp quá lớn (ZIP64) — hãy chia nhỏ tệp.');
  const cd = await bytes(blob, cdOff, cdOff + cdSize);
  const muc = new Map();
  let p = 0;
  while (p + 46 <= cd.length && u32(cd, p) === 0x02014b50) {
    const method = u16(cd, p + 10), comp = u32(cd, p + 20), full = u32(cd, p + 24);
    const n = u16(cd, p + 28), e = u16(cd, p + 30), cm = u16(cd, p + 32), off = u32(cd, p + 42);
    muc.set(utf8.decode(cd.subarray(p + 46, p + 46 + n)), { method, comp, full, off });
    p += 46 + n + e + cm;
  }
  return muc;
}

async function luongMuc(blob, m) {
  const h = await bytes(blob, m.off, m.off + 30);
  if (u32(h, 0) !== 0x04034b50) throw new Error('Tệp ZIP bị hỏng.');
  const start = m.off + 30 + u16(h, 26) + u16(h, 28);
  const raw = blob.slice(start, start + m.comp).stream();
  if (m.method === 0) return raw;
  if (m.method !== 8) throw new Error(`Kiểu nén ${m.method} chưa hỗ trợ.`);
  return raw.pipeThrough(new DecompressionStream('deflate-raw'));
}
async function docChuMuc(blob, m) { return new Response(await luongMuc(blob, m)).text(); }

export function giaiMaXml(s) {
  return String(s)
    .replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, (_, e) => {
      if (e === 'lt') return '<'; if (e === 'gt') return '>'; if (e === 'amp') return '&';
      if (e === 'quot') return '"'; if (e === 'apos') return "'";
      return String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    })
    .replace(/_x([0-9A-Fa-f]{4})_/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}
const thuocTinh = (s) => {
  const o = {};
  for (const m of String(s).matchAll(/([\w:]+)="([^"]*)"/g)) o[m[1]] = giaiMaXml(m[2]);
  return o;
};
const chuTrongT = (xml) => {
  const bo = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '');
  let s = '';
  for (const m of bo.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)) s += m[1];
  return giaiMaXml(s);
};

/** "AB" → 27 (cột bắt đầu từ 1) và ngược lại. */
export const soCot = (L) => [...L].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
export const chuCot = (n) => { let s = ''; while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); } return s; };

/**
 * Đọc một tệp .xlsx. `chon(tenTrang)` → true nếu cần đọc trang đó (mặc định đọc hết).
 * Trả { trang: [{ ten, an, dong: [{ r, o: {A: giá trị,…} }] }], boQua: [tên trang không đọc] }.
 */
export async function docXlsx(blob, { chon = () => true, onTienDo } = {}) {
  const muc = await docMucLucZip(blob);
  const wbM = muc.get('xl/workbook.xml');
  if (!wbM) throw new Error('Không thấy xl/workbook.xml — đây không phải tệp Excel .xlsx.');
  const wb = await docChuMuc(blob, wbM);
  const relM = muc.get('xl/_rels/workbook.xml.rels');
  const rels = relM ? await docChuMuc(blob, relM) : '';
  const dich = {};
  for (const m of rels.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const a = thuocTinh(m[1]);
    dich[a.Id] = a.Target?.startsWith('/') ? a.Target.slice(1) : `xl/${a.Target}`;
  }
  const dsTrang = [...wb.matchAll(/<sheet\b([^>]*)\/?>/g)].map((m) => {
    const a = thuocTinh(m[1]);
    return { ten: a.name, an: a.state === 'hidden' || a.state === 'veryHidden', duong: dich[a['r:id']] };
  });

  const sstM = muc.get('xl/sharedStrings.xml');
  const sst = [];
  if (sstM) {
    const xml = await docChuMuc(blob, sstM);
    for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) sst.push(chuTrongT(m[1]));
  }

  const canDoc = dsTrang.filter((t) => t.duong && muc.get(t.duong) && chon(t.ten));
  const tong = canDoc.reduce((s, t) => s + muc.get(t.duong).full, 0) || 1;
  let daXong = 0;
  const trang = [];
  for (const t of canDoc) {
    const m = muc.get(t.duong);
    const dong = await quetTrang(blob, m, sst, (n) => onTienDo?.({ ten: t.ten, phan: Math.min(1, (daXong + n) / tong) }));
    daXong += m.full;
    trang.push({ ten: t.ten, an: t.an, dong });
  }
  onTienDo?.({ ten: '', phan: 1 });
  return { trang, boQua: dsTrang.filter((t) => !canDoc.includes(t)).map((t) => t.ten) };
}

const CO_GIA_TRI = /<v>[^<]|<is>/;
async function quetTrang(blob, m, sst, tienDo) {
  const reader = (await luongMuc(blob, m)).pipeThrough(new TextDecoderStream()).getReader();
  const dong = [];
  let buf = '';
  let daDoc = 0;
  let lan = 0;
  const xuLy = (doan) => {
    if (!CO_GIA_TRI.test(doan)) return; // khúc toàn công thức rỗng/ô trống → bỏ nhanh
    for (const rm of doan.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
      const body = rm[2];
      if (!CO_GIA_TRI.test(body)) continue;
      const rNum = Number(thuocTinh(rm[1]).r) || (dong.length ? dong[dong.length - 1].r + 1 : 1);
      const o = {};
      let cot = 0;
      for (const cm of body.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const a = thuocTinh(cm[1]);
        const L = a.r ? a.r.replace(/\d+/g, '') : chuCot(cot + 1);
        cot = soCot(L);
        const inner = cm[2];
        if (!inner) continue;
        let v;
        if (a.t === 'inlineStr') {
          const is = inner.match(/<is>([\s\S]*?)<\/is>/);
          if (!is) continue;
          v = chuTrongT(is[1]);
        } else {
          const vm = inner.match(/<v>([\s\S]*?)<\/v>/);
          if (!vm || vm[1] === '') continue;
          if (a.t === 's') v = sst[Number(vm[1])] ?? '';
          else if (a.t === 'str') v = giaiMaXml(vm[1]);
          else if (a.t === 'b') v = vm[1] === '1';
          else if (a.t === 'e') v = giaiMaXml(vm[1]);
          else { const n = Number(vm[1]); v = Number.isFinite(n) ? n : giaiMaXml(vm[1]); }
        }
        if (v === '' || v === undefined) continue;
        o[L] = v;
      }
      if (Object.keys(o).length) dong.push({ r: rNum, o });
    }
  };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    daDoc += value.length;
    const cuoi = buf.lastIndexOf('</row>');
    if (cuoi >= 0) { xuLy(buf.slice(0, cuoi + 6)); buf = buf.slice(cuoi + 6); }
    if ((++lan & 31) === 0) tienDo?.(Math.min(daDoc, m.full));
  }
  if (buf) xuLy(buf);
  tienDo?.(m.full);
  return dong;
}

// ─── ② CSV / TSV / nội dung dán ─────────────────────────────────────────────
/** Đọc bảng chữ phân cách (tab, chấm phẩy hoặc phẩy — tự nhận), có hỗ trợ ngoặc kép. */
export function docBangChu(text) {
  const s = String(text ?? '').replace(new RegExp('^' + String.fromCharCode(0xfeff)), '').replace(/\r\n?/g, '\n');
  const dau = s.split('\n', 1)[0] || '';
  const dem = (ch) => dau.split(ch).length - 1;
  const sep = dem('\t') > 0 ? '\t' : dem(';') > dem(',') ? ';' : ',';
  const rows = [];
  let row = [], o = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') { if (s[i + 1] === '"') { o += '"'; i++; } else q = false; } else o += ch;
    } else if (ch === '"' && o === '') q = true;
    else if (ch === sep) { row.push(o); o = ''; }
    else if (ch === '\n') { row.push(o); rows.push(row); row = []; o = ''; }
    else o += ch;
  }
  if (o !== '' || row.length) { row.push(o); rows.push(row); }
  const dong = [];
  rows.forEach((cells, i) => {
    const ob = {};
    cells.forEach((v, j) => { if (String(v).trim() !== '') ob[chuCot(j + 1)] = v; });
    if (Object.keys(ob).length) dong.push({ r: i + 1, o: ob });
  });
  return dong;
}

// ─── ③ NHẬN DIỆN BIỂU & CỘT ─────────────────────────────────────────────────
export const chuanTen = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');
const boSoThuTu = (s) => String(s ?? '').replace(/^\s*\d+\s*\.\s*/, '');

/** Trang hướng dẫn / tham số / tự tính của bộ biểu: đọc vào chỉ để báo đã bỏ qua. */
const TRANG_KHONG_NHAP = {
  huongdan: 'trang hướng dẫn', hddienbieu: 'trang hướng dẫn', kkiemtra: 'biểu kiểm tra tự động', ttiendo: 'biểu tiến độ tự động',
  ktgiadinh: 'số liệu giả định để thử công thức', '00kethua': 'trang hướng dẫn', bandotruong: 'trang tra cứu', dm06nhom: 'trang tra cứu',
  quytacma: 'trang tra cứu', thaotacnhanh: 'trang tra cứu', dmthamso: 'trang tham số (đã khóa)', ghichubansua: 'ghi chú bản sửa',
  nhatkysua: 'nhật ký tự động sửa lỗi (phần mềm tạo kèm tệp đã sửa)', huongdannhap: 'trang hướng dẫn của biểu mẫu',
  danhsachchon: 'trang danh sách lựa chọn của biểu mẫu',
  b2thaydoi: 'biểu tự tổng hợp từ B2_CT — phần mềm tự tính lại', doichieunv: 'biểu tự đối chiếu từ NGUON_NHIEM_VU — phần mềm tự tính lại',
};

const BIET_DANH = new Map();
for (const b of BIEU) {
  BIET_DANH.set(chuanTen(boSoThuTu(b.sheet)), b.id);
  BIET_DANH.set(chuanTen(b.sheet), b.id);
}

/** Nhận biểu từ tên trang. Trả { id } · { boQua: lý do } · null (chưa nhận ra). */
export function bieuTheoTenTrang(ten) {
  const n1 = chuanTen(boSoThuTu(ten));
  const n2 = chuanTen(ten);
  for (const n of [n2, n1]) {
    if (TRANG_KHONG_NHAP[n]) return { boQua: TRANG_KHONG_NHAP[n] };
    if (BIET_DANH.has(n)) {
      const id = BIET_DANH.get(n);
      return BIEU_THEO_ID[id].tuTinh ? { boQua: TRANG_KHONG_NHAP[n] || 'biểu tự tính' } : { id };
    }
  }
  for (const [alias, id] of BIET_DANH) {
    if (alias.length >= 6 && n1.startsWith(alias) && !BIEU_THEO_ID[id].tuTinh) return { id };
  }
  return null;
}

/**
 * Tìm dòng tiêu đề trong 12 dòng đầu: dòng khớp nhiều tên cột nhất của biểu.
 * Tỷ lệ tính trên SỐ Ô CỦA CHÍNH DÒNG ĐÓ (không phải tổng số cột của biểu) — dán
 * vài cột kèm tiêu đề vẫn nhận ra; ≥ 60% ô của dòng phải là tên cột của biểu.
 */
export function timDongTieuDe(b, dong) {
  const ten = new Map(b.cot.map((c) => [chuanTen(c.ten), c.k]));
  let tot = null;
  for (const d of dong.slice(0, 12)) {
    const ghep = {};
    let khop = 0;
    const o = Object.entries(d.o);
    for (const [L, v] of o) {
      const k = ten.get(chuanTen(v));
      if (k && !Object.values(ghep).includes(k)) { ghep[L] = k; khop++; }
    }
    if (khop < Math.min(2, b.cot.length) || khop / o.length < 0.6) continue;
    if (!tot || khop > tot.khop) tot = { r: d.r, ghep, khop, tyLe: khop / b.cot.length, tyLeDong: khop / o.length };
  }
  return tot;
}

/** Không nhận ra từ tên trang → thử nhận theo dòng tiêu đề (≥ 3 cột khớp, ≥ 80% ô của dòng). */
export function bieuTheoTieuDe(dong) {
  let tot = null;
  for (const b of bieuNhap()) {
    const t = timDongTieuDe(b, dong);
    if (!t || t.tyLeDong < 0.8 || t.khop < Math.min(3, b.cot.length)) continue;
    if (!tot || t.khop > tot.t.khop || (t.khop === tot.t.khop && t.tyLe > tot.t.tyLe)) tot = { b, t };
  }
  return tot ? tot.b.id : null;
}

/**
 * Chuyển các dòng thô của một trang thành dòng của biểu `id`.
 * Trả { dong: [{dongTep, row, doi:[…]}], ghiChu: [chuỗi] }.
 *  theoViTri: 'cot' (A, B, C… như bộ biểu) | 'nhap' (chỉ các cột nhập, theo thứ tự)
 */
export function chuyenDong(id, dongTho, { theoViTri = 'cot' } = {}) {
  const b = BIEU_THEO_ID[id];
  const nhap = cotNhap(b);
  const ghiChu = [];
  const td = timDongTieuDe(b, dongTho);
  let ghep;
  let tu = 0;
  if (td) {
    ghep = td.ghep;
    tu = td.r;
    const coTinh = Object.values(ghep).filter((k) => b.cot.find((x) => x.k === k).kieu === 'tinh').length;
    if (coTinh) ghiChu.push(`${coTinh} cột tự tính trong tệp được bỏ qua — phần mềm tự tính lại theo đúng công thức của bộ biểu.`);
    const thieu = nhap.filter((x) => !Object.values(ghep).includes(x.k));
    if (thieu.length) ghiChu.push(`Tệp không có cột: ${thieu.map((x) => `${x.k} "${x.ten}"`).join(', ')} — các ô này để trống.`);
    const tieuDeDong = dongTho.find((d) => d.r === td.r);
    const la = Object.keys(tieuDeDong.o).filter((L) => !ghep[L]);
    if (la.length) ghiChu.push(`Bỏ qua ${la.length} cột không thuộc biểu: ${la.map((L) => `"${tieuDeDong.o[L]}"`).slice(0, 6).join(', ')}${la.length > 6 ? '…' : ''}.`);
  } else {
    ghep = {};
    if (theoViTri === 'nhap') nhap.forEach((x, i) => { ghep[chuCot(i + 1)] = x.k; });
    else b.cot.forEach((x) => { ghep[x.k] = x.k; });
    tu = dongTho.length && b.dongTieuDe && dongTho[0].r <= b.dongTieuDe && laTieuDeBieu(b, dongTho) ? b.dongTieuDe : 0;
    ghiChu.push(theoViTri === 'nhap'
      ? 'Không thấy dòng tiêu đề — đọc lần lượt theo thứ tự các cột NHẬP của biểu.'
      : 'Không thấy dòng tiêu đề — đọc theo vị trí cột A, B, C… như bộ biểu Excel.');
  }
  const dong = [];
  for (const d of dongTho) {
    if (d.r <= tu) continue;
    const row = { _id: newId() };
    const doi = [];
    let co = false;
    for (const x of nhap) row[x.k] = '';
    for (const [L, raw] of Object.entries(d.o)) {
      const k = ghep[L];
      if (!k) continue;
      const col = b.cot.find((x) => x.k === k);
      if (col.kieu === 'tinh') continue;
      const { v, doi: d1 } = chuyenGiaTri(col, raw);
      row[k] = v;
      if (!rong(v)) co = true;
      if (d1) doi.push({ cot: k, chu: `Đã chuẩn hóa ${d1}.` });
    }
    if (co) dong.push({ dongTep: d.r, row, doi });
  }
  return { dong, ghiChu };
}
const laTieuDeBieu = (b, dongTho) => {
  const d1 = dongTho.find((d) => d.r === 1);
  return !!d1 && Object.values(d1.o).some((v) => chuanTen(v).startsWith(chuanTen(b.tieuDe).slice(0, 8)));
};

// ─── ④ CHUẨN BỊ NHẬP (xem trước + kiểm tra) ─────────────────────────────────
export const CHE_DO = [
  { id: 'thay', ten: 'Thay thế biểu có trong tệp', mo: 'Các biểu có trong tệp được thay bằng dữ liệu của tệp; biểu không có trong tệp giữ nguyên.' },
  { id: 'ghep', ten: 'Ghép theo mã', mo: 'Dòng trùng mã với dữ liệu đang có thì cập nhật, mã mới thì thêm. Biểu không có mã duy nhất (B1, B2_CT, C2…) thì thêm dòng.' },
  { id: 'them', ten: 'Chỉ thêm dòng mới', mo: 'Giữ nguyên dữ liệu đang có; dòng trùng mã đã có bị bỏ qua.' },
];

/**
 * Đọc kết quả `docXlsx`/`docBangChu` thành bảng các biểu cần nhập.
 * `nguon`: { trang: [{ten, dong}] } · `chiBieu`: ép mọi trang vào MỘT biểu (CSV/dán).
 */
export function phanTichTep(nguon, { chiBieu = null, theoViTri = 'cot' } = {}) {
  const bieu = {};      // id → { dong:[…], ghiChu:[…], trang }
  const boQua = [];     // { trang, lyDo }
  const trong = [];     // { trang, id } — nhận ra biểu nhưng chưa có dòng dữ liệu nào
  let quyGioTep = null;
  for (const t of nguon.trang) {
    if (!chiBieu && chuanTen(t.ten) === 'dmthamso') {
      const b3 = t.dong.find((d) => d.r === 3)?.o?.B;
      if (laSo(b3)) quyGioTep = b3;
    }
    let id = chiBieu;
    if (!id) {
      const nd = bieuTheoTenTrang(t.ten);
      if (nd?.boQua) { boQua.push({ trang: t.ten, lyDo: nd.boQua }); continue; }
      id = nd?.id || bieuTheoTieuDe(t.dong);
      if (!id) { if (t.dong.length) boQua.push({ trang: t.ten, lyDo: 'không nhận ra là biểu nào (tên trang và dòng tiêu đề đều không khớp)' }); continue; }
    }
    const kq = chuyenDong(id, t.dong, { theoViTri });
    // Trang TRỐNG (tệp mẫu chưa điền) không được tính là "có biểu này trong tệp":
    // ở chế độ Thay thế nó sẽ xóa sạch dữ liệu đang có của biểu đó.
    if (!kq.dong.length) { trong.push({ trang: t.ten, id }); continue; }
    if (!bieu[id]) bieu[id] = { dong: [], ghiChu: [], trang: t.ten };
    bieu[id].dong.push(...kq.dong);
    bieu[id].ghiChu.push(...kq.ghiChu);
  }
  return { bieu, boQua, trong, quyGioTep };
}

const khoaGhep = (b, r) => {
  const cols = b.duyNhat || [];
  if (!cols.length || cols.some((k) => rong(r[k]))) return null;
  return cols.map((k) => kk(r[k])).join('\u0001');
};

/**
 * Dựng bản dữ liệu sau khi nhập và kiểm tra toàn bộ.
 *  tuyChon: { cheDo: 'thay'|'ghep'|'them', boQuaLoi: true }
 * Trả { docMoi, tomTat: [{id, …số dòng}], vanDe: [{bieu, dongTep, cot, tenCot, giaTri, muc, chan, chu, cachXuLy}], coTheApDung }
 */
export function chuanBiNhap(phanTich, docHienTai, { cheDo = 'thay', boQuaLoi = true } = {}) {
  const goc = chuanHoaVTVL(docHienTai);
  const vanDeDoi = [];  // ghi chú chuẩn hóa giá trị (thông tin)
  const nguonDong = new Map(); // _id dòng trong bản mới → {bieu, dongTep}
  const veTep = new Map();     // _id dòng trong bản mới → _id dòng đọc từ tệp (khác nhau khi "ghép theo mã" cập nhật dòng cũ)
  const dongTepTheoId = new Map();
  for (const pt of Object.values(phanTich.bieu)) for (const d of pt.dong) dongTepTheoId.set(d.row._id, d.row);
  const tom = {};
  const boQuaCoDinh = [];

  const dung = (loaiTru) => {
    const doc = { ...goc, bieu: { ...goc.bieu } };
    for (const [id, pt] of Object.entries(phanTich.bieu)) {
      const b = BIEU_THEO_ID[id];
      const cu = goc.bieu[id] || [];
      const t = tom[id] || (tom[id] = { id, doc: pt.dong.length, them: 0, capNhat: 0, boQua: 0, trungTep: 0, daCo: 0 });
      t.them = 0; t.capNhat = 0; t.boQua = 0; t.trungTep = 0; t.daCo = 0;
      const vao = pt.dong.filter((d) => !loaiTru.has(d.row._id));
      t.boQua = pt.dong.length - vao.length;
      if (cheDo === 'thay') {
        doc.bieu[id] = vao.map((d) => d.row);
        t.them = vao.length;
      } else {
        const ds = cu.map((r) => ({ ...r }));
        const viTri = new Map();
        ds.forEach((r, i) => { const k = khoaGhep(b, r); if (k !== null && !viTri.has(k)) viTri.set(k, i); });
        for (const d of vao) {
          const k = khoaGhep(b, d.row);
          if (k !== null && viTri.has(k)) {
            if (cheDo === 'them') { t.daCo++; continue; }
            const i = viTri.get(k);
            ds[i] = { ...d.row, _id: ds[i]._id };
            nguonDong.set(ds[i]._id, { bieu: id, dongTep: d.dongTep });
            veTep.set(ds[i]._id, d.row._id);
            t.capNhat++;
          } else {
            ds.push(d.row);
            if (k !== null) viTri.set(k, ds.length - 1);
            t.them++;
          }
        }
        doc.bieu[id] = ds;
      }
      for (const d of pt.dong) {
        if (!nguonDong.has(d.row._id)) nguonDong.set(d.row._id, { bieu: id, dongTep: d.dongTep });
        if (!veTep.has(d.row._id)) veTep.set(d.row._id, d.row._id);
      }
    }
    return doc;
  };

  // Lặp: bỏ dòng có lỗi chặn rồi kiểm tra lại (bỏ một dòng có thể làm hỏng liên kết của dòng khác).
  const loaiTru = new Set();
  let doc = dung(loaiTru);
  let kt = kiemTraDuLieu(doc);
  for (let lan = 0; boQuaLoi && lan < 6; lan++) {
    const moi = kt.ds.filter((x) => x.chan && x.muc === 'loi' && veTep.has(x.id) && !loaiTru.has(veTep.get(x.id)));
    if (!moi.length) break;
    for (const x of moi) { loaiTru.add(veTep.get(x.id)); boQuaCoDinh.push(x); }
    doc = dung(loaiTru);
    kt = kiemTraDuLieu(doc);
  }

  const tenCot = (bieu, k) => BIEU_THEO_ID[bieu]?.cot.find((x) => x.k === k)?.ten || '';
  const cachXuLy = (bieu, k) => {
    const h = HD[bieu]?.cot?.[k];
    return h ? [h.cachGhi, h.luuY].filter(Boolean).join(' — ') : '';
  };
  const giaTri = (bieu, id, k) => {
    const tuTep = dongTepTheoId.get(veTep.get(id) || id);
    if (tuTep) return tuTep[k];
    const r = (doc.bieu[bieu] || []).find((x) => x._id === id);
    return r ? r[k] : '';
  };

  // Vấn đề của các dòng ĐẾN TỪ TỆP (kể cả dòng đã bỏ qua) + ảnh hưởng lên dữ liệu đang có.
  const vanDe = [];
  const daNeu = new Set();
  const them = (x, boQua) => {
    const src = nguonDong.get(x.id);
    const khoa = `${x.id}|${x.cot}|${x.chu}`;
    if (daNeu.has(khoa)) return;
    daNeu.add(khoa);
    vanDe.push({
      bieu: x.bieu, trang: phanTich.bieu[x.bieu]?.trang || BIEU_THEO_ID[x.bieu]?.sheet || '',
      dongTep: src ? src.dongTep : null, dongHienCo: src ? null : x.dong,
      cot: x.cot || '', tenCot: tenCot(x.bieu, x.cot), giaTri: x.cot ? giaTri(x.bieu, x.id, x.cot) : '',
      muc: x.muc, chan: !!x.chan, boQua, chu: x.chu, cachXuLy: x.cot ? cachXuLy(x.bieu, x.cot) : '',
    });
  };
  for (const x of boQuaCoDinh) them(x, true);
  for (const x of kt.ds) {
    if (x.muc === 'tt' && x.chu.startsWith('Dòng trống')) continue;
    const tuTep = nguonDong.has(x.id);
    // Dòng sẵn có chỉ được nêu khi có lỗi liên kết/trùng mới phát sinh — tránh lặp lại cảnh báo cũ.
    if (!tuTep && !(x.muc === 'loi')) continue;
    them(x, false);
  }
  for (const [id, pt] of Object.entries(phanTich.bieu)) {
    for (const d of pt.dong) for (const g of d.doi) {
      vanDeDoi.push({ bieu: id, trang: pt.trang, dongTep: d.dongTep, dongHienCo: null, cot: g.cot, tenCot: tenCot(id, g.cot), giaTri: d.row[g.cot], muc: 'tt', chan: false, boQua: loaiTru.has(d.row._id), chu: g.chu, cachXuLy: '' });
    }
  }
  const thuTu = { loi: 0, canh: 1, tt: 2 };
  const tatCa = [...vanDe, ...vanDeDoi].sort((a, b) => (BIEU.findIndex((x) => x.id === a.bieu) - BIEU.findIndex((x) => x.id === b.bieu))
    || thuTu[a.muc] - thuTu[b.muc] || (a.dongTep ?? 1e9) - (b.dongTep ?? 1e9));

  const tomTat = Object.values(tom).map((t) => {
    const ds = tatCa.filter((v) => v.bieu === t.id && v.dongTep !== null);
    return {
      ...t, ten: BIEU_THEO_ID[t.id].ten, ma: BIEU_THEO_ID[t.id].ma, trang: phanTich.bieu[t.id].trang,
      loi: ds.filter((v) => v.muc === 'loi').length, canh: ds.filter((v) => v.muc === 'canh').length,
      ghiChu: phanTich.bieu[t.id].ghiChu,
    };
  }).sort((a, b) => BIEU.findIndex((x) => x.id === a.id) - BIEU.findIndex((x) => x.id === b.id));

  const tong = tomTat.reduce((s, t) => s + t.them + t.capNhat, 0);
  const canhQuyGio = phanTich.quyGioTep !== null && phanTich.quyGioTep !== (goc.quyGio || QUY_GIO_PP2)
    ? `Trang DM_THAM_SO của tệp ghi quỹ giờ PP2 = ${phanTich.quyGioTep}, phần mềm đang dùng ${goc.quyGio || QUY_GIO_PP2}. Phần mềm KHÔNG tự đổi tham số này — chỉ cơ quan chủ trì sửa.` : '';
  return { docMoi: doc, tomTat, vanDe: tatCa, tongNhap: tong, coTheApDung: tong > 0, canhQuyGio, kiemTraSau: kt, tinhSau: tinhToan(doc) };
}

/** Đọc một tệp bất kỳ người dùng chọn → { nguon, loai } cho `phanTichTep`. */
export async function docTep(file, { onTienDo } = {}) {
  const ten = file.name || 'tep';
  const duoi = (ten.split('.').pop() || '').toLowerCase();
  if (duoi === 'xls') throw new Error('Tệp .xls (Excel 97-2003) chưa đọc được. Mở bằng Excel → Lưu thành → "Excel Workbook (*.xlsx)" rồi chọn lại.');
  if (duoi === 'xlsx' || duoi === 'xlsm') {
    const kq = await docXlsx(file, {
      onTienDo,
      chon: (t) => { const nd = bieuTheoTenTrang(t); return !nd?.boQua || chuanTen(t) === 'dmthamso'; },
    });
    return { loai: 'xlsx', nguon: { trang: kq.trang }, khongDoc: kq.boQua };
  }
  if (duoi === 'json') {
    const j = JSON.parse(await file.text());
    if (j?.loai !== 'vtvl-sao-luu' || !j.doc) throw new Error('Tệp JSON không phải bản sao lưu của phân hệ này.');
    const doc = chuanHoaVTVL(j.doc);
    const trang = Object.entries(doc.bieu).filter(([, rows]) => rows.length).map(([id, rows]) => {
      const b = BIEU_THEO_ID[id];
      return { ten: b.sheet, dong: rows.map((r, i) => ({ r: i + 3, o: Object.fromEntries(cotNhap(b).map((x) => [x.k, r[x.k]]).filter(([, v]) => !rong(v))) })).filter((d) => Object.keys(d.o).length) };
    });
    return { loai: 'json', nguon: { trang }, khongDoc: [] };
  }
  if (['csv', 'tsv', 'txt'].includes(duoi)) return { loai: 'csv', nguon: { trang: [{ ten, dong: docBangChu(await file.text()) }] }, khongDoc: [] };
  throw new Error(`Chưa hỗ trợ tệp ".${duoi}". Chọn tệp .xlsx (bộ biểu), .csv hoặc bản sao lưu .json.`);
}

export const MUC_TEN = { loi: 'Lỗi', canh: 'Cảnh báo', tt: 'Thông tin' };
