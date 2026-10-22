// ============================================================================
//  SỔ TAY AI — LÕI TRA CỨU CÓ TRÍCH DẪN NGUỒN (logic THUẦN, chạy được bằng Node)
//
//  Phục vụ nhiệm vụ đột phá: "Thí điểm hỏi đáp, tra cứu bằng trí tuệ nhân tạo về
//  các lĩnh vực của cơ quan dân cử — xây dựng các SỔ TAY AI theo lĩnh vực để cán
//  bộ, công chức Văn phòng, các Ban và đại biểu chat, hỏi đáp, tra cứu CÓ TRÍCH
//  DẪN NGUỒN" (Trục 3, Mục V.5(4) Đề án).
//
//  ⚠️ NGUYÊN TẮC "CÓ NGUỒN MỚI TRẢ LỜI" (grounding):
//     AI KHÔNG được trả lời bằng trí nhớ của nó. Mỗi câu hỏi phải đi qua 3 bước:
//       ① CẮT ĐOẠN  — văn bản được cắt theo ĐIỀU / KHOẢN để mỗi đoạn tự nó là một
//                     địa chỉ trích dẫn ("Điều 12, khoản 2"), không cắt tùy tiện.
//       ② TRUY HỒI  — chấm điểm BM25 chọn các đoạn liên quan nhất trong ĐÚNG sổ tay
//                     đang hỏi (không lẫn lĩnh vực khác).
//       ③ TRẢ LỜI   — chỉ những đoạn đó được gửi cho AI; câu trả lời bắt buộc gắn
//                     số [1], [2]… trỏ về đoạn nguồn. Không có đoạn nào hợp → trả
//                     lời "không tìm thấy trong nguồn", KHÔNG đoán.
//
//  ⚠️ HAI CÁI BẪY CỦA TIẾNG VIỆT (đã vấp ở bộ sinh bản tin, giữ làm phép kiểm):
//     (a) Khớp CHUỖI CON: "quốc gia" chứa "gia" → tin "phòng thủ dân sự quốc gia"
//         bị kéo sang chủ đề "gia đình". Nay tách theo RANH GIỚI TỪ, không dùng
//         indexOf trên chuỗi thô.
//     (b) Khớp sau khi BỎ DẤU: "báo" và "bão" thành một. Nay GIỮ NGUYÊN DẤU khi
//         chấm điểm; bỏ dấu chỉ dùng cho ô tìm kiếm gõ nhanh của giao diện.
//     Tiếng Việt là ngôn ngữ ÂM TIẾT: một âm tiết đứng một mình rất ít nghĩa, nên
//     ngoài âm tiết đơn còn chấm điểm CẶP ÂM TIẾT liền nhau (bigram) với trọng số
//     cao hơn — nhờ đó "giám sát chuyên đề" thắng "giám đốc" hay "chuyên viên".
// ============================================================================

// ---------------------------------------------------------------------------
//  1. TÁCH TỪ
// ---------------------------------------------------------------------------
// Từ dừng: xuất hiện ở hầu hết câu nên không giúp phân biệt đoạn nào liên quan.
// Có cả từ để hỏi (nào, gì, bao nhiêu…) vì câu hỏi nào cũng có.
const TU_DUNG = new Set(`và của các những một là có được cho với trong về theo khi này đó tại từ đến như thì mà hoặc nếu sẽ đã bị bởi nên để trên dưới sau trước cũng vẫn còn rất quá nữa chỉ phải cần thế nào gì ai đâu sao bao nhiêu mấy không chưa nhưng vì do nhằm ra vào lên xuống qua lại nên hơn kém cùng hay tuy dù song ngoài trừ ấy kia nọ ta tôi anh chị ông bà họ nó mình chúng bạn thưa vâng dạ ạ nhé nhỉ à ư hả`.split(/\s+/));

/** Bỏ dấu tiếng Việt — CHỈ dùng cho ô tìm kiếm gõ nhanh, KHÔNG dùng để chấm điểm. */
export function boDau(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

/** Cắt chuỗi thành các ÂM TIẾT (giữ nguyên dấu, bỏ dấu câu). */
export function amTiet(s) {
  return String(s || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
}

/**
 * Tách thành "khóa chấm điểm": âm tiết đơn + CẶP âm tiết liền nhau.
 * Cặp âm tiết được đánh dấu bằng dấu cách để không lẫn với âm tiết đơn.
 * Từ dừng bị loại khỏi âm tiết đơn nhưng VẪN được ghép cặp (vì "hội đồng",
 * "của Nhân dân" có "của" ở giữa vẫn là cụm có nghĩa khi đi cặp).
 */
export function tachKhoa(s) {
  const at = amTiet(s);
  const out = [];
  for (let i = 0; i < at.length; i++) {
    if (!TU_DUNG.has(at[i])) out.push(at[i]);
    if (i + 1 < at.length) out.push(`${at[i]} ${at[i + 1]}`);
  }
  return out;
}

const laCap = (k) => k.includes(' ');
const TRONG_SO_CAP = 2.6; // cặp âm tiết nặng hơn âm tiết đơn (xem ghi chú đầu tệp)

// ---------------------------------------------------------------------------
//  2. CẮT ĐOẠN THEO CẤU TRÚC VĂN BẢN
// ---------------------------------------------------------------------------
export const MAX_KY_TU_DOAN = 1600;  // đoạn dài hơn thì cắt tiếp theo khoản
export const MIN_KY_TU_DOAN = 120;   // đoạn ngắn hơn thì gộp vào đoạn trước

const RE_DIEU = /^\s*(Điều\s+\d+[a-zA-Z]?)\s*[.．:\-–—]?\s*(.*)$/u;
const RE_CHUONG = /^\s*(Chương\s+[IVXLCDM]+|PHẦN\s+[IVXLCDM]+|Mục\s+\d+)\s*[.．:\-–—]?\s*(.*)$/u;
const RE_KHOAN = /^\s*(\d{1,2})\s*[.．)]\s+(.+)$/u;

/**
 * Cắt nguyên văn một văn bản thành các ĐOẠN có nhãn trích dẫn.
 * Trả [{ nhan, text, chuong }] — `nhan` chính là địa chỉ sẽ in trong trích dẫn.
 *
 * Văn bản quy phạm pháp luật được cắt theo "Điều N" vì đó là đơn vị trích dẫn tự
 * nhiên; Điều quá dài được cắt tiếp theo khoản và ghi rõ "Điều N, khoản M…".
 * Văn bản không có cấu trúc Điều (báo cáo, hướng dẫn) thì cắt theo đoạn văn.
 */
export function catDoan(text, { maxKyTu = MAX_KY_TU_DOAN } = {}) {
  const raw = String(text || '').replace(/\r\n?/g, '\n').trim();
  if (!raw) return [];
  const dong = raw.split('\n');
  const soDieu = dong.filter((d) => RE_DIEU.test(d)).length;

  // --- Không phải văn bản có "Điều" → cắt theo đoạn văn -------------------
  if (soDieu < 2) return catTheoDoanVan(raw, maxKyTu);

  // --- Có cấu trúc Điều → mỗi Điều một đoạn -------------------------------
  const khoi = [];
  let chuong = '';
  let hien = null;
  const chot = () => { if (hien && hien.body.join('\n').trim()) khoi.push(hien); hien = null; };
  for (const d of dong) {
    const mc = d.match(RE_CHUONG);
    if (mc) { chuong = [mc[1], mc[2]].filter(Boolean).join('. ').trim(); continue; }
    const md = d.match(RE_DIEU);
    if (md) {
      chot();
      hien = { nhan: md[1], tieuDe: (md[2] || '').trim(), chuong, body: [] };
      if (md[2]) hien.body.push(md[2]);
      continue;
    }
    if (hien) hien.body.push(d);
    else {
      // Phần mở đầu trước Điều 1 (căn cứ ban hành…) — giữ làm một đoạn riêng.
      if (!khoi.length || khoi[0].nhan !== 'Phần mở đầu') khoi.unshift({ nhan: 'Phần mở đầu', tieuDe: '', chuong: '', body: [] });
      khoi[0].body.push(d);
    }
  }
  chot();

  // --- Điều quá dài → cắt tiếp theo khoản ---------------------------------
  const out = [];
  for (const k of khoi) {
    const than = k.body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!than) continue;
    const dau = [k.nhan, k.tieuDe].filter(Boolean).join('. ');
    if (than.length <= maxKyTu) {
      out.push({ nhan: dau, chuong: k.chuong, text: `${dau}\n${than}`.trim() });
      continue;
    }
    for (const phan of catTheoKhoan(than, maxKyTu)) {
      const nhan = phan.khoan ? `${k.nhan}, khoản ${phan.khoan}` : dau;
      out.push({ nhan, chuong: k.chuong, text: `${dau}\n${phan.text}`.trim() });
    }
  }
  return gopDoanNgan(out);
}

function catTheoKhoan(than, maxKyTu) {
  const dong = than.split('\n');
  const phan = [];
  let hien = { khoan: '', dong: [] };
  for (const d of dong) {
    const m = d.match(RE_KHOAN);
    if (m) {
      if (hien.dong.join('\n').trim()) phan.push(hien);
      hien = { khoan: m[1], dong: [d] };
    } else hien.dong.push(d);
  }
  if (hien.dong.join('\n').trim()) phan.push(hien);

  // Gộp các khoản liền nhau cho tới khi chạm trần ký tự.
  const out = [];
  let gom = null;
  for (const p of phan) {
    const t = p.dong.join('\n').trim();
    if (!t) continue;
    if (gom && (gom.text.length + t.length + 1) <= maxKyTu) {
      gom.text += `\n${t}`;
      // Phần dẫn trước khoản 1 (tiêu đề điều) không mang số khoản — gộp vào
      // nhóm thì phải lấy số khoản ĐẦU TIÊN tìm được, nếu không cả nhóm mất nhãn.
      gom.khoan = gom.khoan || p.khoan;
      gom.den = p.khoan || gom.den;
    } else {
      if (gom) out.push(nhanKhoan(gom));
      gom = { khoan: p.khoan, den: p.khoan, text: t };
    }
  }
  if (gom) out.push(nhanKhoan(gom));
  return out;
}
function nhanKhoan(g) {
  const tu = g.khoan || '', den = g.den || '';
  return { khoan: tu && den && den !== tu ? `${tu}-${den}` : (tu || den), text: g.text };
}

function catTheoDoanVan(raw, maxKyTu) {
  const doan = raw.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean);
  const out = [];
  let gom = '';
  const day = () => { if (gom.trim()) { out.push({ nhan: `Đoạn ${out.length + 1}`, chuong: '', text: gom.trim() }); gom = ''; } };
  for (const d of doan) {
    if (d.length > maxKyTu) {           // đoạn khổng lồ → cắt cứng theo câu
      day();
      let cau = '', dem = 0;
      for (const c of d.split(/(?<=[.!?;])\s+/)) {
        if (cau.length + c.length > maxKyTu && cau) { out.push({ nhan: `Đoạn ${out.length + 1}`, chuong: '', text: cau.trim() }); cau = ''; dem++; }
        cau += `${c} `;
      }
      if (cau.trim()) out.push({ nhan: `Đoạn ${out.length + 1}`, chuong: '', text: cau.trim() });
      void dem;
      continue;
    }
    if ((gom.length + d.length + 2) > maxKyTu) day();
    gom += `${d}\n\n`;
  }
  day();
  return gopDoanNgan(out);
}

function gopDoanNgan(ds) {
  const out = [];
  for (const d of ds) {
    const truoc = out[out.length - 1];
    if (truoc && d.text.length < MIN_KY_TU_DOAN && (truoc.text.length + d.text.length) < MAX_KY_TU_DOAN * 1.5) {
      truoc.text += `\n${d.text}`;
      truoc.nhan = `${truoc.nhan}; ${d.nhan}`;
    } else out.push({ ...d });
  }
  return out;
}

// ---------------------------------------------------------------------------
//  3. DỰNG CHỈ MỤC + TRUY HỒI (BM25)
// ---------------------------------------------------------------------------
const K1 = 1.2, B = 0.75;

/**
 * Dựng chỉ mục cho MỘT sổ tay từ danh sách nguồn đã có nguyên văn.
 * `nguon` = [{ id, soHieu, ten, text, ... }]  → trả { doan[], df, avgLen, soNguon }.
 */
export function dungChiMuc(nguon = []) {
  const doan = [];
  for (const n of nguon) {
    if (!n || !n.text) continue;
    const phan = catDoan(n.text);
    phan.forEach((p, i) => {
      const khoa = tachKhoa(`${n.soHieu || ''} ${n.ten || ''} ${p.nhan} ${p.text}`);
      const tf = new Map();
      for (const k of khoa) tf.set(k, (tf.get(k) || 0) + 1);
      doan.push({
        id: `${n.id}#${i}`, nguonId: n.id, soHieu: n.soHieu || '', tenNguon: n.ten || '',
        nhan: p.nhan, chuong: p.chuong, text: p.text, tf, len: khoa.length,
      });
    });
  }
  const df = new Map();
  for (const d of doan) for (const k of d.tf.keys()) df.set(k, (df.get(k) || 0) + 1);
  const avgLen = doan.length ? doan.reduce((s, d) => s + d.len, 0) / doan.length : 0;
  return { doan, df, avgLen, soNguon: nguon.filter((n) => n && n.text).length };
}

/** Chấm điểm BM25 và trả về `soDoan` đoạn liên quan nhất cho câu hỏi. */
export function truyHoi(chiMuc, cauHoi, { soDoan = 6, nguongDiem = 0.15 } = {}) {
  const { doan, df, avgLen } = chiMuc || {};
  if (!doan || !doan.length) return [];
  const khoa = tachKhoa(cauHoi);
  if (!khoa.length) return [];
  const N = doan.length;
  const idf = new Map();
  for (const k of new Set(khoa)) {
    const n = df.get(k) || 0;
    idf.set(k, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
  }
  const diem = doan.map((d) => {
    let s = 0;
    for (const k of new Set(khoa)) {
      const tf = d.tf.get(k) || 0;
      if (!tf) continue;
      const w = laCap(k) ? TRONG_SO_CAP : 1;
      s += w * (idf.get(k) || 0) * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (d.len / (avgLen || 1))));
    }
    // Nhãn đoạn (Điều mấy, tiêu đề điều) khớp câu hỏi thì cộng thêm — tiêu đề
    // điều luật thường chính là nội dung người hỏi đang tìm.
    const khoaNhan = new Set(tachKhoa(d.nhan));
    let congNhan = 0;
    for (const k of new Set(khoa)) if (khoaNhan.has(k)) congNhan += (laCap(k) ? 1.2 : 0.4) * (idf.get(k) || 0);
    return { d, diem: s + congNhan };
  }).filter((x) => x.diem > 0);

  diem.sort((a, b) => b.diem - a.diem);
  const caoNhat = diem.length ? diem[0].diem : 0;
  return diem
    .filter((x) => x.diem >= caoNhat * nguongDiem)
    .slice(0, soDoan)
    .map((x, i) => ({ stt: i + 1, diem: Math.round(x.diem * 100) / 100, ...x.d }));
}

/** Gói các đoạn truy hồi thành khối ngữ cảnh đánh số để gửi cho AI. */
export function dungNguCanh(doan = [], { maxKyTu = 14000 } = {}) {
  const phan = [];
  let tong = 0;
  for (const d of doan) {
    const dau = `[${d.stt}] ${d.soHieu ? d.soHieu + ' — ' : ''}${d.tenNguon}${d.nhan ? ` — ${d.nhan}` : ''}`;
    const khoi = `${dau}\n${d.text}`;
    if (tong + khoi.length > maxKyTu) break;
    phan.push(khoi);
    tong += khoi.length;
  }
  return phan.join('\n\n---\n\n');
}

// ---------------------------------------------------------------------------
//  4. ĐỌC TRÍCH DẪN TRONG CÂU TRẢ LỜI
// ---------------------------------------------------------------------------
/** Lấy các số [1][2] mà AI đã trích, theo đúng thứ tự xuất hiện, không trùng. */
export function docTrichDan(traLoi, doan = []) {
  const hop = new Set(doan.map((d) => d.stt));
  const ra = [];
  const seen = new Set();
  for (const m of String(traLoi || '').matchAll(/\[(\d{1,2})\]/g)) {
    const n = Number(m[1]);
    if (!hop.has(n) || seen.has(n)) continue;
    seen.add(n);
    const d = doan.find((x) => x.stt === n);
    if (d) ra.push(d);
  }
  return ra;
}

/** Câu trả lời có bám nguồn không — dùng để cảnh báo khi AI quên trích dẫn. */
export const coTrichDan = (traLoi) => /\[\d{1,2}\]/.test(String(traLoi || ''));

/** Chuỗi trích dẫn gọn để ghi vào ngân hàng câu hỏi mẫu. */
export const motTrichDan = (d) => [d.soHieu, d.nhan].filter(Boolean).join(' — ') || d.tenNguon || '';

// ---------------------------------------------------------------------------
//  5. DANH MỤC & TRẠNG THÁI
// ---------------------------------------------------------------------------
export const HIEU_LUC = [
  { k: 'con', ten: 'Còn hiệu lực', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { k: 'mot-phan', ten: 'Hết hiệu lực một phần', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  { k: 'het', ten: 'Hết hiệu lực', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
  { k: 'chua-ro', ten: 'Chưa xác định', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
];
export const hieuLucOf = (k) => HIEU_LUC.find((x) => x.k === k) || HIEU_LUC[3];

export const KIEM_TRA = [
  { k: 'chua', ten: 'Chưa kiểm tra', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  { k: 'dat', ten: 'Đã kiểm tra - đạt', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { k: 'loai', ten: 'Loại khỏi sổ tay', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
];
export const kiemTraOf = (k) => KIEM_TRA.find((x) => x.k === k) || KIEM_TRA[0];

export const TRANG_THAI_SO_TAY = [
  { k: 'xay-dung', ten: 'Đang xây dựng', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  { k: 'dung-thu', ten: 'Đang dùng thử', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  { k: 'ban-hanh', ten: 'Đã ban hành', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];
export const trangThaiOf = (k) => TRANG_THAI_SO_TAY.find((x) => x.k === k) || TRANG_THAI_SO_TAY[0];

export const TRANG_THAI_CAU_HOI = [
  { k: 'moi', ten: 'Chưa đối chiếu nguồn', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  { k: 'doi-chieu', ten: 'Đã đối chiếu nguồn', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { k: 'can-sua', ten: 'Cần sửa lại', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
];
export const cauHoiOf = (k) => TRANG_THAI_CAU_HOI.find((x) => x.k === k) || TRANG_THAI_CAU_HOI[0];

export const HINH_THUC_HD = ['Hướng dẫn trực tiếp', 'Tập huấn tập trung', 'Cầm tay chỉ việc', 'Tài liệu tự học'];

// ---------------------------------------------------------------------------
//  6. CHỈ TIÊU CỦA NHIỆM VỤ ĐỘT PHÁ (đăng ký tại Trục 3, Mục V.5(4) Đề án)
// ---------------------------------------------------------------------------
export const CHI_TIEU = {
  soTay: 6,          // 06 sổ tay AI theo lĩnh vực
  cauHoi: 50,        // ≥ 50 câu hỏi mẫu ĐÃ ĐỐI CHIẾU NGUỒN
  huongDan: 100,     // 100% cán bộ, công chức Văn phòng được hướng dẫn
  giamThoiGian: 30,  // thời gian tra cứu giảm ≥ 30%
};
export const MOC_MAC_DINH = {
  soTay: '2026-11-15',    // sổ tay + câu hỏi mẫu
  huongDan: '2026-11-25', // hướng dẫn cán bộ
  baoCao: '2026-12-10',   // báo cáo đánh giá
};

const mang = (v) => (Array.isArray(v) ? v : []);
const so = (v, d = 0) => { const n = Number(v); return isFinite(n) ? n : d; };

/** Thống kê một sổ tay: số nguồn, số đoạn đã lập chỉ mục, số câu hỏi… */
export function thongKeSoTay(doc, soTayId) {
  const st = mang(doc?.soTay).find((x) => x.id === soTayId);
  const nguon = mang(doc?.nguon).filter((n) => n.soTayId === soTayId);
  const dung = nguon.filter((n) => n.kiemTra !== 'loai');
  const cauHoi = mang(doc?.cauHoi).filter((c) => c.soTayId === soTayId);
  const nguonDat = nguon.filter((n) => n.kiemTra === 'dat');
  const daNapNLM = nguon.filter((n) => n.napNLM).length;
  return {
    coNotebook: daGanNLM(st),
    lienKetNLM: chuanHoaNLM(st?.notebookLM).url,
    napNLM: daNapNLM,
    conPhaiNap: nguonDat.filter((n) => !n.napNLM).length,
    nguon: nguon.length,
    nguonDat: nguonDat.length,
    nguonConHieuLuc: nguon.filter((n) => n.hieuLuc === 'con').length,
    coNguyenVan: dung.filter((n) => (n.soKyTu || 0) > 0).length,
    kyTu: dung.reduce((s, n) => s + so(n.soKyTu), 0),
    cauHoi: cauHoi.length,
    cauHoiDat: cauHoi.filter((c) => c.trangThai === 'doi-chieu').length,
    // `sanSang` = tra nhanh TẠI CHỖ được (đã có nguyên văn trong phân hệ này).
    sanSang: dung.some((n) => (n.soKyTu || 0) > 0),
    // `sanSangNLM` = dùng được theo đúng định hướng: đã có notebook, nguồn đã
    // kiểm tra và đã nạp lên notebook, có câu hỏi mẫu đã đối chiếu.
    sanSangNLM: daGanNLM(st) && nguonDat.length > 0 && daNapNLM > 0,
  };
}

/** Thời gian tra cứu giảm bao nhiêu phần trăm so với cách tra thủ công. */
export function giamThoiGian(doc) {
  const d = mang(doc?.doThoiGian).filter((x) => so(x.giayAI) > 0 && so(x.phutThuCong) > 0);
  if (!d.length) return { soPhepDo: 0, giayAI: 0, giayThuCong: 0, giam: 0, dat: false };
  const giayAI = d.reduce((s, x) => s + so(x.giayAI), 0) / d.length;
  const giayThuCong = d.reduce((s, x) => s + so(x.phutThuCong) * 60, 0) / d.length;
  const giam = giayThuCong > 0 ? (1 - giayAI / giayThuCong) * 100 : 0;
  return {
    soPhepDo: d.length,
    giayAI: Math.round(giayAI * 10) / 10,
    giayThuCong: Math.round(giayThuCong),
    giam: Math.round(giam * 10) / 10,
    dat: giam >= CHI_TIEU.giamThoiGian,
  };
}

/** Bảng tiến độ 4 chỉ tiêu của nhiệm vụ đột phá — dùng cho thẻ số liệu + báo cáo. */
export function tienDoNhiemVu(doc, { tongCBCC = 0 } = {}) {
  const soTay = mang(doc?.soTay);
  // Sổ tay được tính là XONG khi dùng được thật: đã gắn notebook trên
  // NotebookLM, nguồn đã kiểm tra và đã nạp lên notebook, có câu hỏi mẫu đã
  // đối chiếu. (Nạp nguyên văn vào phân hệ này chỉ phục vụ tra nhanh dự phòng
  // nên KHÔNG phải điều kiện bắt buộc.)
  const xong = soTay.filter((s) => {
    const t = thongKeSoTay(doc, s.id);
    return t.sanSangNLM && t.cauHoiDat > 0;
  }).length;
  const cauHoiDat = mang(doc?.cauHoi).filter((c) => c.trangThai === 'doi-chieu').length;
  const hd = mang(doc?.huongDan);
  const tong = tongCBCC || hd.length;
  const daHD = hd.filter((h) => h.ngay).length;
  const tyLeHD = tong > 0 ? (daHD / tong) * 100 : 0;
  const tg = giamThoiGian(doc);
  const quyTac = !!(doc?.quyTac?.banHanh);

  const muc = (daLam, chiTieu) => Math.max(0, Math.min(100, chiTieu > 0 ? (daLam / chiTieu) * 100 : 0));
  const daGan = soTay.filter(daGanNLM).length;
  return {
    soTay: { daLam: xong, tong: soTay.length, daGanNotebook: daGan, chiTieu: CHI_TIEU.soTay, pct: muc(xong, CHI_TIEU.soTay), dat: xong >= CHI_TIEU.soTay },
    cauHoi: { daLam: cauHoiDat, tong: mang(doc?.cauHoi).length, chiTieu: CHI_TIEU.cauHoi, pct: muc(cauHoiDat, CHI_TIEU.cauHoi), dat: cauHoiDat >= CHI_TIEU.cauHoi },
    huongDan: { daLam: daHD, tong, chiTieu: CHI_TIEU.huongDan, pct: tyLeHD, dat: tong > 0 && daHD >= tong },
    thoiGian: { ...tg, chiTieu: CHI_TIEU.giamThoiGian, pct: muc(tg.giam, CHI_TIEU.giamThoiGian) },
    quyTac,
    tongThe: 0, // gán ở dưới
  };
}

/** Phần trăm hoàn thành chung của nhiệm vụ (trung bình 4 chỉ tiêu + quy tắc). */
export function phanTramNhiemVu(td) {
  const p = [td.soTay.pct, td.cauHoi.pct, td.huongDan.pct, td.thoiGian.pct, td.quyTac ? 100 : 0];
  return Math.round(p.reduce((a, b) => a + b, 0) / p.length);
}

/** Số ngày còn lại tới một mốc (âm = đã quá hạn). */
export function conLaiNgay(moc, homNay = new Date()) {
  const d = new Date(`${moc}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - new Date(homNay.toDateString()).getTime()) / 86400000);
}

/** Tìm không dấu trong danh sách bất kỳ (ô tìm kiếm gõ nhanh của giao diện). */
export function loc(ds, tuKhoa, truong) {
  const q = boDau(tuKhoa).trim();
  if (!q) return ds;
  return ds.filter((x) => truong.some((t) => boDau(x[t]).includes(q)));
}

// ---------------------------------------------------------------------------
//  8. NOTEBOOKLM — nơi cán bộ THỰC SỰ hỏi đáp
//
//  Định hướng sử dụng: mỗi sổ tay là MỘT NOTEBOOK trên NotebookLM do Văn phòng
//  lập và chia sẻ; cán bộ **tự đăng nhập tài khoản Google của mình** rồi mở
//  notebook đó để hỏi. Nhờ vậy không phát sinh kinh phí cho cơ quan và hạn mức
//  hỏi đáp tính trên tài khoản từng người.
//
//  ⚠️ TÊN MIỀN: Google đã chuyển `notebooklm.google.com` sang
//     `notebook.google.com` (tên miền cũ trả 301 về tên miền mới). Nhận CẢ HAI
//     khi người dùng dán vào, nhưng luôn lưu về tên miền hiện hành.
//  ⚠️ Mở liên kết khi chưa đăng nhập sẽ bị đẩy sang trang đăng nhập của Google —
//     đó là hành vi đúng, không phải lỗi liên kết.
// ---------------------------------------------------------------------------
export const NLM_HOST = 'notebook.google.com';
export const NLM_HOST_CU = 'notebooklm.google.com';
export const NLM_MAU = `https://${NLM_HOST}/notebook/<mã sổ tay>`;

const RE_MA_NLM = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Chuẩn hóa liên kết notebook. Nhận: địa chỉ đầy đủ (tên miền mới hoặc cũ),
 * hoặc chỉ dán mã sổ tay. Trả { ok, url, ma, loi }.
 */
export function chuanHoaNLM(v) {
  const t = String(v || '').trim();
  if (!t) return { ok: false, url: '', ma: '', loi: '' };
  if (RE_MA_NLM.test(t)) return { ok: true, url: `https://${NLM_HOST}/notebook/${t.toLowerCase()}`, ma: t.toLowerCase(), loi: '' };
  let u;
  try { u = new URL(t.startsWith('http') ? t : `https://${t}`); } catch { return { ok: false, url: '', ma: '', loi: 'Không đọc được địa chỉ.' }; }
  const host = u.hostname.toLowerCase();
  if (host !== NLM_HOST && host !== NLM_HOST_CU) {
    return { ok: false, url: '', ma: '', loi: `Địa chỉ phải thuộc ${NLM_HOST} (hoặc ${NLM_HOST_CU} là tên miền cũ).` };
  }
  const m = u.pathname.match(/\/notebook\/([^/?#]+)/i);
  if (!m) return { ok: false, url: '', ma: '', loi: `Thiếu phần /notebook/<mã>. Mẫu đúng: ${NLM_MAU}` };
  const ma = decodeURIComponent(m[1]).toLowerCase();
  return { ok: true, url: `https://${NLM_HOST}/notebook/${ma}`, ma, loi: '' };
}

/** Sổ tay đã gắn notebook chưa (dùng cho thẻ, tiến độ và báo cáo). */
export const daGanNLM = (s) => chuanHoaNLM(s?.notebookLM).ok;

/** Các bước cán bộ làm để dùng sổ tay — hiển thị ở tab hướng dẫn và in vào báo cáo. */
export const BUOC_DUNG_NLM = [
  { ten: 'Đăng nhập tài khoản Google của chính mình', chiTiet: 'Mở notebook.google.com và đăng nhập bằng tài khoản Google cá nhân hoặc tài khoản do cơ quan cấp. Mỗi người dùng tài khoản riêng nên hạn mức hỏi đáp tính theo từng người, cơ quan không phát sinh kinh phí.' },
  { ten: 'Mở sổ tay được Văn phòng chia sẻ', chiTiet: 'Bấm nút "Mở trên NotebookLM" ở từng sổ tay trong phân hệ này. Nếu chưa đăng nhập, Google sẽ đưa sang trang đăng nhập trước rồi mới mở sổ tay — đó là hành vi bình thường.' },
  { ten: 'Hỏi bằng tiếng Việt, đọc kỹ trích dẫn', chiTiet: 'Gõ câu hỏi vào ô chat. NotebookLM chỉ trả lời dựa trên các nguồn trong sổ tay và gắn số trích dẫn; bấm vào số đó để nhảy tới đúng đoạn trong văn bản gốc.' },
  { ten: 'Kiểm chứng trước khi dùng', chiTiet: 'Mở văn bản gốc theo trích dẫn để đối chiếu trước khi đưa nội dung vào văn bản tham mưu, báo cáo hay phát biểu. Không trích dẫn trí tuệ nhân tạo làm căn cứ pháp lý.' },
];

/** Việc của người lập sổ tay (chủ notebook) — hướng dẫn cho Tổ công tác. */
export const BUOC_LAP_NLM = [
  'Tạo một notebook riêng cho từng lĩnh vực, đặt tên trùng với mã và tên sổ tay (ví dụ: "ST-03 Hoạt động giám sát").',
  'Nạp vào notebook các văn bản ĐÃ KIỂM TRA ở tab "Nguồn của sổ tay" (tải tệp hoặc dán đường dẫn bản công khai).',
  'Chỉ nạp văn bản CÔNG KHAI, KHÔNG MẬT — nguồn tải lên được gửi và lưu trên máy chủ của Google.',
  'Chia sẻ notebook cho cán bộ theo quyền CHỈ XEM để người dùng hỏi đáp được nhưng không sửa, không xóa nguồn.',
  'Dán địa chỉ notebook vào ô "Liên kết NotebookLM" của sổ tay tương ứng trong phân hệ này.',
  'Văn bản được sửa đổi, thay thế hoặc hết hiệu lực thì cập nhật lại nguồn trong notebook và đánh dấu lại ở tab "Nguồn của sổ tay".',
];

// ---------------------------------------------------------------------------
//  7. MÔ HÌNH DỮ LIỆU (thuần — để kiểm thử được bằng Node; phần đọc/ghi máy chủ
//     nằm ở src/lib/soTayStore.js)
// ---------------------------------------------------------------------------
export const MAX_NGUON = 80;                 // số văn bản nguồn giữ trong kho
export const MAX_CHU_MOI_NGUON = 150000;     // ký tự nguyên văn mỗi văn bản
export const CANH_BAO_KB = 3000;             // tổng dung lượng vượt mức này thì nhắc

export const EMPTY_ST = {
  soTay: [], nguon: [], cauHoi: [],
  quyTac: { tieuDe: '', banHanh: '', nguoiKy: '', dieu: [], camKet: [] },
  huongDan: [], doThoiGian: [], nhatKy: [],
  moc: { ...MOC_MAC_DINH }, updatedAt: '',
};

const chuoi = (v) => (v == null ? '' : String(v));

// ⚠️ DANH SÁCH TRẮNG: thêm trường mới vào dữ liệu thì PHẢI khai ở đây, nếu không
// trường đó bị gọt mất ngay lúc lưu (bài học từ lỗi "danh bạ lưu xong thì biến mất").
export const chuanHoaST = (d) => ({
  soTay: mang(d?.soTay).map((s) => ({
    id: chuoi(s?.id), ma: chuoi(s?.ma), ten: chuoi(s?.ten), moTa: chuoi(s?.moTa),
    doiTuong: chuoi(s?.doiTuong), goiYNguon: chuoi(s?.goiYNguon),
    notebookLM: chuoi(s?.notebookLM), phuTrach: chuoi(s?.phuTrach),
    trangThai: chuoi(s?.trangThai) || 'xay-dung', demo: !!s?.demo, at: chuoi(s?.at),
  })),
  nguon: mang(d?.nguon).slice(0, MAX_NGUON).map((n) => ({
    id: chuoi(n?.id), soTayId: chuoi(n?.soTayId), soHieu: chuoi(n?.soHieu), ten: chuoi(n?.ten),
    coQuan: chuoi(n?.coQuan), ngayBanHanh: chuoi(n?.ngayBanHanh),
    hieuLuc: chuoi(n?.hieuLuc) || 'chua-ro', lienKet: chuoi(n?.lienKet),
    congKhai: !!n?.congKhai, kiemTra: chuoi(n?.kiemTra) || 'chua',
    nguoiKiemTra: chuoi(n?.nguoiKiemTra), ngayKiemTra: chuoi(n?.ngayKiemTra),
    ghiChu: chuoi(n?.ghiChu),
    napNLM: !!n?.napNLM, ngayNapNLM: chuoi(n?.ngayNapNLM),
    text: chuoi(n?.text).slice(0, MAX_CHU_MOI_NGUON),
    soKyTu: Math.min(Number(n?.soKyTu) || 0, MAX_CHU_MOI_NGUON),
    demo: !!n?.demo,
  })),
  cauHoi: mang(d?.cauHoi).map((c) => ({
    id: chuoi(c?.id), soTayId: chuoi(c?.soTayId), cauHoi: chuoi(c?.cauHoi), dapAn: chuoi(c?.dapAn),
    trichDan: mang(c?.trichDan).map(chuoi),
    trangThai: chuoi(c?.trangThai) || 'moi',
    nguoiDoiChieu: chuoi(c?.nguoiDoiChieu), ngayDoiChieu: chuoi(c?.ngayDoiChieu), demo: !!c?.demo,
  })),
  quyTac: {
    tieuDe: chuoi(d?.quyTac?.tieuDe), banHanh: chuoi(d?.quyTac?.banHanh), nguoiKy: chuoi(d?.quyTac?.nguoiKy),
    dieu: mang(d?.quyTac?.dieu).map((x) => ({ so: Number(x?.so) || 0, ten: chuoi(x?.ten), noiDung: chuoi(x?.noiDung) })),
    camKet: mang(d?.quyTac?.camKet).map((x) => ({ nguoi: chuoi(x?.nguoi), donVi: chuoi(x?.donVi), luc: chuoi(x?.luc) })),
  },
  huongDan: mang(d?.huongDan).map((h) => ({
    id: chuoi(h?.id), hoTen: chuoi(h?.hoTen), donVi: chuoi(h?.donVi), chucVu: chuoi(h?.chucVu),
    hinhThuc: chuoi(h?.hinhThuc), ngay: chuoi(h?.ngay), nguoiHuongDan: chuoi(h?.nguoiHuongDan), ghiChu: chuoi(h?.ghiChu),
  })),
  doThoiGian: mang(d?.doThoiGian).slice(0, 500).map((x) => ({
    id: chuoi(x?.id), soTayId: chuoi(x?.soTayId), cauHoi: chuoi(x?.cauHoi),
    giayAI: Number(x?.giayAI) || 0, phutThuCong: Number(x?.phutThuCong) || 0,
    nguoi: chuoi(x?.nguoi), luc: chuoi(x?.luc),
  })),
  nhatKy: mang(d?.nhatKy).slice(0, 100).map((x) => ({
    id: chuoi(x?.id), soTayId: chuoi(x?.soTayId), cauHoi: chuoi(x?.cauHoi),
    traLoi: chuoi(x?.traLoi).slice(0, 4000), nguon: mang(x?.nguon).map(chuoi),
    giay: Number(x?.giay) || 0, luc: chuoi(x?.luc), nguoi: chuoi(x?.nguoi),
  })),
  moc: {
    soTay: chuoi(d?.moc?.soTay) || MOC_MAC_DINH.soTay,
    huongDan: chuoi(d?.moc?.huongDan) || MOC_MAC_DINH.huongDan,
    baoCao: chuoi(d?.moc?.baoCao) || MOC_MAC_DINH.baoCao,
  },
  updatedAt: chuoi(d?.updatedAt),
});

let seq = 0;
export const newId = (p = 'x') => `${p}${Date.now().toString(36)}${(++seq).toString(36)}`;

export const newNguon = (soTayId, v = {}) => ({
  id: newId('ng'), soTayId, soHieu: '', ten: '', coQuan: '', ngayBanHanh: '',
  hieuLuc: 'chua-ro', lienKet: '', congKhai: false, kiemTra: 'chua',
  nguoiKiemTra: '', ngayKiemTra: '', ghiChu: '', napNLM: false, ngayNapNLM: '', text: '', soKyTu: 0, ...v,
});
export const newCauHoi = (soTayId, v = {}) => ({
  id: newId('ch'), soTayId, cauHoi: '', dapAn: '', trichDan: [],
  trangThai: 'moi', nguoiDoiChieu: '', ngayDoiChieu: '', ...v,
});
export const newHuongDan = (v = {}) => ({
  id: newId('hd'), hoTen: '', donVi: '', chucVu: '', hinhThuc: 'Hướng dẫn trực tiếp',
  ngay: '', nguoiHuongDan: '', ghiChu: '', ...v,
});

/** Gắn nguyên văn vào một nguồn, có cắt trần và đếm ký tự thật. */
export function ganNguyenVan(nguon, text) {
  const t = chuoi(text);
  return { ...nguon, text: t.slice(0, MAX_CHU_MOI_NGUON), soKyTu: Math.min(t.length, MAX_CHU_MOI_NGUON), batDauCat: t.length > MAX_CHU_MOI_NGUON };
}

/** Dung lượng ước tính của dòng dữ liệu (KB) — để cảnh báo trước khi quá nặng. */
export function kichThuoc(doc) {
  let n = 0;
  for (const x of mang(doc?.nguon)) n += (x.text || '').length;
  for (const x of mang(doc?.nhatKy)) n += (x.traLoi || '').length;
  // Tiếng Việt có dấu nên phần lớn ký tự chiếm 2-3 byte ở UTF-8; lấy 2 cho gọn.
  const kb = Math.round((n * 2) / 1024);
  return { kyTu: n, kb, nang: kb > CANH_BAO_KB };
}

