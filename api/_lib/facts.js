// ============================================================================
//  GOM SỐ LIỆU THẬT của hệ thống thành văn bản gọn để nạp cho AI trả lời.
//  Nguyên tắc: chỉ đưa vào những gì cần cho câu trả lời, KHÔNG đưa dữ liệu
//  cá nhân nhạy cảm (CCCD, BHXH, quan hệ gia đình trong hồ sơ 2C).
// ============================================================================
import { getRow, listPeriodIds } from './store.js';
import { computeTC, applyQuotaXuatSac, gradeName, kindInfo } from '../../src/lib/khungTieuChi.js';
import { buildAlerts, DEFAULT_LEAD } from '../../src/lib/hr.js';
import { ketQua, tenKyHop, kyHopCua, danhSachKyHop } from '../../src/lib/bieuQuyet.js';
import { lichFacts, hasLich } from './lich.js';

const n1 = (v) => (Math.round(Number(v || 0) * 10) / 10).toString().replace('.', ',');
const dmy = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };

// ---------------------------------------------------------------------------
//  A. Kỳ đánh giá của HAI PHÂN HỆ chấm điểm cán bộ — mỗi phân hệ một kho riêng:
//      • OKR/KPI cán bộ, công chức   (hằng THÁNG) -> state_<năm>_<tháng>
//      • Kiểm điểm, xếp loại đảng viên (hằng QUÝ) -> state_kiemdiem_<năm>_<tháng>
//  App ghi kèm `_summary` (điểm đã tính sẵn) mỗi lần lưu -> máy chủ không phải
//  dựng lại toàn bộ công thức chấm điểm của giao diện.
// ---------------------------------------------------------------------------
const ROMAN = ['I', 'II', 'III', 'IV'];
export const PERIOD_MODULES = [
  {
    ns: '', route: '/#/okr',
    title: 'Đánh giá OKR/KPI cán bộ, công chức (chấm hằng tháng)',
    kyOf: (p) => `tháng ${p.month}/${p.year}`,
    who: 'cán bộ, công chức, người lao động Văn phòng',
  },
  {
    ns: 'kiemdiem', route: '/#/kiemdiem',
    title: 'Kiểm điểm, đánh giá, xếp loại đảng viên (chấm hằng quý)',
    kyOf: (p) => `quý ${ROMAN[Math.max(0, Math.ceil(p.month / 3) - 1)]}/${p.year}`,
    who: 'cán bộ thuộc diện Ban Thường vụ Tỉnh ủy quản lý',
  },
];

export async function periodFacts(wanted) {
  const all = await listPeriodIds();          // tất cả phân hệ
  const parts = [];
  let meta = null;
  const modules = [];

  for (const mod of PERIOD_MODULES) {
    const list = all.filter((p) => p.ns === mod.ns);
    if (!list.length) continue;
    let pick = list[0];
    if (wanted?.year && wanted?.month) {
      pick = list.find((p) => p.year === Number(wanted.year) && p.month === Number(wanted.month)) || pick;
    }
    const r = fmtPeriod(await getRow(pick.id), pick, list, mod);
    parts.push(r.text);
    modules.push({ ...mod, meta: r.meta });
    if (!meta) meta = r.meta;                 // giữ tương thích: meta = kỳ của phân hệ đầu tiên
  }
  return { text: parts.join('\n\n'), meta, modules };
}

/** Phần định dạng THUẦN (không đụng mạng) — tách ra để kiểm thử bằng Node. */
export function fmtPeriod(row, pick, list = [], mod = PERIOD_MODULES[0]) {
  const st = row?.data || {};
  const sum = st._summary;
  const ky = mod.kyOf(pick);
  const others = list.slice(0, 8).map((p) => mod.kyOf(p)).join(', ');

  if (!sum || !Array.isArray(sum.people)) {
    const names = (st.people || []).map((p) => p.name).filter(Boolean);
    return {
      meta: { ...pick, ky },
      text: `## ${mod.title} — kỳ ${ky}\n`
        + `Có ${names.length} cán bộ trong danh sách nhưng bản lưu này CHƯA có bảng điểm tóm tắt `
        + `(dữ liệu lưu trước khi hệ thống bổ sung tính năng này). Hãy đề nghị người dùng mở `
        + `https://hdndthkpi.vercel.app${mod.route} rồi bấm "Lưu ngay" một lần để cập nhật.\n`
        + `Danh sách: ${names.join(', ')}\nCác kỳ đã có dữ liệu: ${others}`,
    };
  }

  const rows = sum.people.map((p) =>
    `- ${p.name} | ${p.position || ''} | ${p.department || ''} | tự đánh giá ${n1(p.self)} | cấp duyệt ${n1(p.mgr)} | xếp loại ${p.gradeLabel || p.grade} | ${p.approved ? 'đã phê duyệt' : 'chưa phê duyệt'}`);
  const dist = sum.people.reduce((a, p) => { const k = p.gradeLabel || p.grade; a[k] = (a[k] || 0) + 1; return a; }, {});
  const avg = sum.people.length ? sum.people.reduce((s, p) => s + Number(p.mgr || 0), 0) / sum.people.length : 0;

  return {
    meta: { ...pick, ky },
    text: `## ${mod.title} — kỳ ${ky} (cập nhật ${dmy(row.updated_at)})\n`
      + `Đối tượng đánh giá: ${mod.who}. Đơn vị: ${sum.unit || 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa'}\n`
      + `Tổng số: ${sum.people.length} người · điểm trung bình (cấp duyệt): ${n1(avg)}\n`
      + `Cơ cấu xếp loại: ${Object.entries(dist).map(([k, v]) => `${k}: ${v}`).join(' · ')}\n`
      + `Đã phê duyệt: ${sum.people.filter((p) => p.approved).length}/${sum.people.length}\n`
      + `Bảng điểm (họ tên | chức vụ | phòng | tự đánh giá | cấp duyệt | xếp loại | phê duyệt):\n${rows.join('\n')}\n`
      + `Các kỳ khác đã có dữ liệu: ${others}`,
  };
}

// ---------------------------------------------------------------------------
//  B. Đánh giá tiêu chí HĐND tỉnh, xã, phường (dòng tc_data)
//  khungTieuChi.js là logic THUẦN nên máy chủ tính lại được y hệt giao diện.
// ---------------------------------------------------------------------------
export async function tieuChiFacts() {
  const row = await getRow('tc_data');
  return fmtTieuChi(row?.data);
}

/** Phần định dạng THUẦN — tính lại điểm bằng chính khungTieuChi.js của giao diện. */
export function fmtTieuChi(doc) {
  if (!doc || !Array.isArray(doc.units) || !doc.units.length) return { text: '', meta: null };

  const year = String(doc.cfg?.year || new Date().getFullYear());
  const evals = doc.evals || {};
  const scored = doc.units.map((u) => {
    const rec = evals[`${u.id}::${year}`];
    if (!rec) return { u, rec: null, c: null };
    return { u, rec, c: computeTC(u.kind || 'xa', rec.ans || {}) };
  });

  // Trần 25% Xuất sắc chỉ áp cho cấp xã, phường (Điều 6 khoản 2).
  const xa = scored.filter((s) => s.c && (s.u.kind || 'xa') === 'xa');
  const quota = applyQuotaXuatSac(xa.map((s) => ({
    id: s.u.id, total: s.c.total, bonus: s.c.bonus,
    groupV: (s.c.groups.find((g) => g.code === 'V') || {}).score || 0, grade: s.c.grade,
  })));

  const line = (s) => {
    if (!s.c) return `- ${s.u.name} (${kindInfo(s.u.kind || 'xa').short || s.u.kind}) | chưa chấm phiếu`;
    const official = quota.over.includes(s.u.id) ? 'tot' : s.c.grade;
    const note = quota.over.includes(s.u.id) ? ' (đủ điểm Xuất sắc nhưng vượt trần 25% nên xếp Tốt)' : '';
    const st = s.rec.approved ? 'đã phê duyệt' : s.rec.submitted ? 'đã gửi, chờ phê duyệt' : 'đang làm dở';
    return `- ${s.u.name} | tổng ${n1(s.c.total)}đ (7 nhóm ${n1(s.c.base)} + thưởng ${n1(s.c.bonus)} − trừ ${n1(s.c.deduct)}) | xếp loại ${gradeName(official)}${note} | khai báo ${s.c.progress}% | ${st}`;
  };

  const done = scored.filter((s) => s.c);
  const avg = done.length ? done.reduce((a, s) => a + s.c.total, 0) / done.length : 0;

  return {
    meta: { year, units: doc.units.length },
    text: `## Đánh giá tiêu chí HĐND năm ${year} (Khung tiêu chí nhiệm kỳ 2026-2031)\n`
      + `${doc.units.length} đơn vị, ${done.length} đơn vị đã chấm phiếu, điểm trung bình ${n1(avg)}/110.\n`
      + `Trần Xuất sắc cấp xã: tối đa ${quota.limit} đơn vị (25%), có ${quota.candidates} đơn vị đủ điểm.\n`
      + `${doc.cfg?.demo ? '⚠️ Đây là DỮ LIỆU MÔ PHỎNG dùng để trình diễn, không phải số liệu chính thức.\n' : ''}`
      + `Kết quả từng đơn vị:\n${scored.map(line).join('\n')}`,
  };
}

// ---------------------------------------------------------------------------
//  C. Nhắc việc nhân sự (dòng hr_data) — CHỈ cho người hỏi là Quản trị.
//  Không đưa CCCD/BHXH/quan hệ gia đình vào ngữ cảnh của AI.
// ---------------------------------------------------------------------------
export async function nhanSuFacts() {
  const row = await getRow('hr_data');
  return fmtNhanSu(row?.data);
}

/** Phần định dạng THUẦN — dùng lại buildAlerts của giao diện. */
export function fmtNhanSu(doc) {
  if (!doc || !Array.isArray(doc.staff) || !doc.staff.length) return { text: '', meta: null };

  const alerts = buildAlerts(doc.staff, doc.duties || [], doc.quota || {}, { ...DEFAULT_LEAD, ...(doc.lead || {}) });
  const lv = { overdue: 'QUÁ HẠN', urgent: 'KHẨN', soon: 'sắp tới', info: 'theo dõi' };
  const top = alerts.slice(0, 25).map((a) =>
    `- [${lv[a.level] || a.level}] ${a.who}: ${a.title}${a.date ? ` (${dmy(a.date)}${a.days != null ? `, còn ${a.days} ngày` : ''})` : ''}`);

  return {
    meta: { staff: doc.staff.length, alerts: alerts.length },
    text: `## Nhắc việc nhân sự (chỉ Quản trị được xem)\n`
      + `${doc.staff.length} hồ sơ cán bộ · ${alerts.length} việc cần theo dõi `
      + `(quá hạn ${alerts.filter((a) => a.level === 'overdue').length}, khẩn ${alerts.filter((a) => a.level === 'urgent').length}).\n`
      + `${top.join('\n')}${alerts.length > 25 ? `\n… và ${alerts.length - 25} việc khác.` : ''}`,
  };
}

// ---------------------------------------------------------------------------
//  D. Biểu quyết Online (dòng bq_data) — kết quả kiểm phiếu tính lại tại chỗ
//  bằng chính src/lib/bieuQuyet.js của giao diện nên không lệch màn hình.
// ---------------------------------------------------------------------------
export async function bieuQuyetFacts() {
  const row = await getRow('bq_data');
  return fmtBieuQuyet(row?.data);
}

/** Phần định dạng THUẦN — kiểm thử được bằng Node. */
export function fmtBieuQuyet(doc) {
  if (!doc || !Array.isArray(doc.phien) || !doc.phien.length) return { text: '', meta: null };

  const line = (p) => {
    const k = ketQua(p);
    return `- ${p.tieuDe} | ${p.trangThai === 'mo' ? 'ĐANG MỞ biểu quyết' : 'đã đóng biểu quyết'}`
      + ` | tán thành ${k.dongY}/${k.tong} (${k.tyLeDongY}%) · không đồng ý ${k.khongDongY} · ý kiến khác ${k.yKienKhac} · chưa biểu quyết ${k.chuaBieuQuyet}`
      + ` | ngưỡng thông qua ${k.nguong}/${k.tong} → ${k.thongQua ? 'ĐỦ điều kiện thông qua' : 'CHƯA đủ điều kiện thông qua'}`
      + ` | phiếu do người thật bấm: ${k.phieuThuc}`;
  };
  const nhom = danhSachKyHop(doc.phien).map((so) =>
    `### ${tenKyHop(so)}\n${doc.phien.filter((p) => kyHopCua(p) === so).map(line).join('\n')}`);

  return {
    meta: { phien: doc.phien.length },
    text: `## Biểu quyết Online — HĐND tỉnh Thanh Hóa (82 đại biểu, nhiệm kỳ 2026-2031)\n`
      + `⚠️ Bản demo: phần lớn lá phiếu là DỮ LIỆU MÔ PHỎNG trình diễn (cột "phiếu do người thật bấm" là số phiếu thật) — không phải kết quả biểu quyết chính thức của HĐND tỉnh.\n`
      + nhom.join('\n'),
  };
}

// ---------------------------------------------------------------------------
//  E. Danh bạ điện thoại (hr_data.danhBa — Quản trị nhập từ tệp trong phân hệ
//  Quản lý cán bộ). Danh bạ là để tra cứu nên mở cho MỌI người dùng bot đã
//  được duyệt (không riêng Quản trị); riêng khung chat khách vô danh ở Trang
//  chủ thì nơi gọi tự quyết bằng tùy chọn `danhBa` của gatherFacts.
// ---------------------------------------------------------------------------
export async function danhBaFacts() {
  const row = await getRow('hr_data');
  return fmtDanhBa(row?.data);
}

/** Phần định dạng THUẦN — kiểm thử được bằng Node. */
export function fmtDanhBa(doc) {
  const list = Array.isArray(doc?.danhBa) ? doc.danhBa : [];
  if (!list.length) {
    return {
      meta: null,
      text: '## Danh bạ điện thoại\nChưa có danh bạ trên máy chủ. Nhắc người dùng: Quản trị mở phân hệ Quản lý cán bộ '
        + '(https://hdndthkpi.vercel.app/#/canbo) → khu vực "Danh bạ điện thoại" → Nhập từ tệp rồi bấm Lưu hồ sơ.',
    };
  }
  const rows = list.map((d) => `- ${d.ten}${d.nhom ? ` [${d.nhom}]` : ''} | ${d.chucVu || ''} | ĐT: ${d.sdt || '(chưa có số)'}`);
  return {
    meta: { so: list.length },
    text: `## Danh bạ điện thoại (${list.length} người)\n`
      + `Chỉ trả lời số điện thoại của ĐÚNG người được hỏi (đối chiếu đủ họ tên/chức vụ); `
      + `không liệt kê hàng loạt trừ khi người hỏi yêu cầu rõ một danh sách.\n${rows.join('\n')}`,
  };
}

// ---------------------------------------------------------------------------
//  Chọn nạp phần nào theo câu hỏi — tránh nhồi hết dữ liệu vào mỗi lượt chat.
// ---------------------------------------------------------------------------
const KW = {
  tc: ['tiêu chí', 'tieu chi', 'xã', 'phường', 'xa,', 'hđnd xã', 'đơn vị', 'don vi', 'hạc thành', 'quota', 'trần 25', 'xuất sắc 25'],
  hr: ['nâng lương', 'nang luong', 'nghỉ hưu', 'nghi huu', 'nhắc việc', 'nhac viec', 'biên chế', 'bien che', 'hồ sơ 2c', 'sinh nhật', 'hợp đồng', 'bổ nhiệm'],
  kp: ['điểm', 'diem', 'xếp loại', 'xep loai', 'kpi', 'okr', 'cán bộ', 'can bo', 'phê duyệt', 'phe duyet', 'phòng', 'tổng quan', 'trung bình',
    'kiểm điểm', 'kiem diem', 'đảng viên', 'dang vien', 'thường vụ', 'thuong vu', 'btv', 'tỉnh ủy', 'tinh uy', 'quý', 'quy i', 'hằng quý'],
  lich: ['lịch', 'lich', 'tuần', 'tuan', 'họp', 'hop', 'hôm nay', 'hom nay', 'ngày mai', 'ngay mai', 'sáng mai', 'chiều mai',
    'công tác', 'cong tac', 'xe', 'lái xe', 'lai xe', 'đi đâu', 'di dau', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy', 'chủ nhật',
    'chờ duyệt', 'cho duyet', 'địa điểm', 'dia diem', 'thành phần', 'thanh phan', 'tiếp công dân'],
  bq: ['biểu quyết', 'bieu quyet', 'nghị quyết', 'nghi quyet', 'kỳ họp', 'ky hop', 'tán thành', 'tan thanh',
    'thông qua', 'thong qua', 'lá phiếu', 'la phieu', 'bỏ phiếu', 'bo phieu', 'kiểm phiếu', 'kiem phieu', 'đại biểu', 'dai bieu'],
  db: ['số điện thoại', 'so dien thoai', 'điện thoại của', 'dien thoai cua', 'danh bạ', 'danh ba', 'sđt', 'sdt',
    'số máy', 'so may', 'số của', 'so cua', 'gọi cho', 'goi cho', 'liên lạc với', 'lien lac voi', 'hotline'],
};
const hit = (q, list) => list.some((k) => q.includes(k));

export async function gatherFacts(question, { isAdmin = false, danhBa = true } = {}) {
  const q = String(question || '').toLowerCase();
  const wantTC = hit(q, KW.tc);
  const wantHR = isAdmin && hit(q, KW.hr);
  const wantLich = hasLich() && hit(q, KW.lich);
  const wantBQ = hit(q, KW.bq);
  const wantDB = danhBa && hit(q, KW.db);
  const wantKP = hit(q, KW.kp) || (!wantTC && !wantHR && !wantLich && !wantBQ && !wantDB); // mặc định nạp kỳ đánh giá

  const jobs = [];
  if (wantKP) jobs.push(periodFacts().catch((e) => ({ text: `(Không đọc được kỳ đánh giá: ${e.message})` })));
  if (wantTC) jobs.push(tieuChiFacts().catch((e) => ({ text: `(Không đọc được tiêu chí HĐND: ${e.message})` })));
  if (wantLich) jobs.push(lichFacts().catch((e) => ({ text: `(Không đọc được lịch công tác: ${e.message})` })));
  if (wantBQ) jobs.push(bieuQuyetFacts().catch((e) => ({ text: `(Không đọc được kết quả biểu quyết: ${e.message})` })));
  if (wantDB) jobs.push(danhBaFacts().catch((e) => ({ text: `(Không đọc được danh bạ: ${e.message})` })));
  if (wantHR) jobs.push(nhanSuFacts().catch((e) => ({ text: `(Không đọc được dữ liệu nhân sự: ${e.message})` })));

  const parts = (await Promise.all(jobs)).map((r) => r.text).filter(Boolean);
  return parts.join('\n\n');
}
