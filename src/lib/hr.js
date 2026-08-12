// ============================================================================
// QUẢN LÝ CÁN BỘ — hồ sơ theo mẫu Sơ yếu lý lịch 2C/TCTW-98 (Ban Tổ chức Trung ương)
// và các quy tắc NHẮC VIỆC cho Quản trị:
//   • Nâng bậc lương thường xuyên / phụ cấp thâm niên vượt khung (TT 08/2013/TT-BNV)
//   • Nghỉ hưu (lộ trình tuổi nghỉ hưu — NĐ 135/2020/NĐ-CP; thông báo trước 6 tháng theo NĐ 46/2010)
//   • Sinh nhật · hết hạn hợp đồng lao động · hết thời hạn giữ chức vụ (bổ nhiệm 5 năm)
//   • Nhiệm vụ/báo cáo có thời hạn (một lần hoặc định kỳ tháng/quý/năm)
//   • Biên chế được giao so với thực có (thừa / thiếu) theo từng phòng
// Module này chỉ chứa MODEL + LOGIC thuần (không phụ thuộc React/Supabase) để dễ kiểm thử;
// phần đọc/ghi dữ liệu nằm ở './hrStore' (bảng app_state, id = 'hr_data' — không theo kỳ đánh giá).
// ============================================================================

// ---------------------------------------------------------------- Ngày tháng
export const toDate = (s) => {
  if (!s) return null;
  if (s instanceof Date) return isNaN(s.getTime()) ? null : s;
  const str = String(s).trim();
  // Nhận cả 'YYYY-MM-DD' (input date) lẫn 'dd/mm/yyyy' (người dùng gõ tay)
  const vn = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str);
  const d = vn ? new Date(+vn[3], +vn[2] - 1, +vn[1]) : new Date(str.length === 10 ? `${str}T00:00:00` : str);
  return isNaN(d.getTime()) ? null : d;
};
export const fmtD = (s) => {
  const d = toDate(s);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
// Cộng tháng, kẹp về ngày cuối tháng khi tràn (31/01 + 1 tháng = 28/02).
export const addMonths = (d, m) => {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  const day = d.getDate();
  x.setMonth(x.getMonth() + m);
  const last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, last));
  return x;
};
export const daysTo = (target, from = new Date()) => {
  const t = toDate(target); if (!t) return null;
  return Math.round((startOfDay(t) - startOfDay(from)) / 86400000);
};
// Tuổi tròn tính đến ngày mốc.
export const ageAt = (birth, at = new Date()) => {
  const b = toDate(birth); if (!b) return null;
  let a = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) a--;
  return a;
};

// ---------------------------------------------------------------- Danh mục
// Đối tượng quản lý (quyết định biên chế & một số nhắc việc).
export const HR_CATEGORY = [
  { k: 'dbqh', label: 'Đại biểu Quốc hội chuyên trách', short: 'ĐBQH chuyên trách', tone: 'bg-violet-50 text-violet-700 border-violet-200' },
  { k: 'hdnd', label: 'Đại biểu HĐND tỉnh chuyên trách', short: 'Đại biểu HĐND', tone: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { k: 'cc', label: 'Công chức Văn phòng', short: 'Công chức', tone: 'bg-sky-50 text-sky-700 border-sky-200' },
  { k: 'hd', label: 'Hợp đồng lao động (NĐ 111/2022)', short: 'Hợp đồng', tone: 'bg-slate-50 text-slate-600 border-slate-200' },
];
export const catOf = (k) => HR_CATEGORY.find((x) => x.k === k) || HR_CATEGORY[2];

// Ngạch công chức: cls = loại ngạch → chu kỳ nâng bậc lương thường xuyên (TT 08/2013/TT-BNV Điều 2):
//   loại A1/A2/A3 (yêu cầu đại học trở lên): 36 tháng · loại A0/B/C và nhân viên phục vụ: 24 tháng.
// h1/step = hệ số bậc 1 và khoảng cách mỗi bậc (bảng lương công chức — dùng để GỢI Ý hệ số khi chọn bậc).
export const HR_NGACH = [
  { code: '01.001', name: 'Chuyên viên cao cấp', cls: 'A3', cycle: 36, bacMax: 6, h1: 6.20, step: 0.36 },
  { code: '01.002', name: 'Chuyên viên chính', cls: 'A2', cycle: 36, bacMax: 8, h1: 4.40, step: 0.34 },
  { code: '01.003', name: 'Chuyên viên', cls: 'A1', cycle: 36, bacMax: 9, h1: 2.34, step: 0.33 },
  { code: '01.004', name: 'Cán sự', cls: 'B', cycle: 24, bacMax: 12, h1: 1.86, step: 0.20 },
  { code: '01.005', name: 'Nhân viên', cls: 'C', cycle: 24, bacMax: 12, h1: 1.65, step: 0.18 },
  { code: 'HD', name: 'Hợp đồng lao động', cls: 'HD', cycle: 24, bacMax: 12, h1: 1.65, step: 0.18 },
];
export const ngachOf = (code) => HR_NGACH.find((x) => x.code === code) || HR_NGACH[2];
// Hệ số lương gợi ý theo ngạch + bậc (làm tròn 2 số).
export const hesoOf = (code, bac) => {
  const n = ngachOf(code);
  const b = Math.min(Math.max(Number(bac) || 1, 1), n.bacMax);
  return Math.round((n.h1 + (b - 1) * n.step) * 100) / 100;
};

export const HR_GENDER = [{ k: 'nam', label: 'Nam' }, { k: 'nu', label: 'Nữ' }];

// ---------------------------------------------------------------- Hồ sơ 2C
// Cấu trúc một hồ sơ cán bộ — bám các mục của mẫu 2C/TCTW-98.
export const newStaff = (name = '') => ({
  id: 'hr_' + Math.random().toString(36).slice(2, 9),
  // 1–9. Nhân thân
  name, otherName: '', birth: '', gender: 'nam', birthPlace: '', hometown: '',
  ethnic: 'Kinh', religion: 'Không', residence: '', address: '',
  // 10–13. Tuyển dụng, chức vụ, công việc
  category: 'cc', jobWhenHired: '', hireDate: '', hireAgency: '',
  department: '', position: '', partyPosition: '', unionPosition: '', mainWork: '',
  appointDate: '', appointTerm: 60, // thời hạn giữ chức vụ (tháng) — bổ nhiệm thường 5 năm
  // 14. Ngạch, bậc lương
  ngach: '01.003', bac: 1, heso: 2.34, salaryDate: '', vuotKhungPct: 0,
  contractType: '', contractFrom: '', contractTo: '', // với lao động hợp đồng
  // 15–20. Trình độ
  eduGeneral: '12/12', eduMajor: '', eduDegree: '', politics: '', stateAdmin: '', foreignLang: '', it: '',
  // 21–24. Đảng, đoàn thể, quân ngũ, danh hiệu
  partyDate: '', partyOfficialDate: '', unionDate: '', armyIn: '', armyOut: '', armyRank: '', honour: '',
  // 25–31. Khác
  strength: '', reward: '', discipline: '', health: '', height: '', weight: '', bloodType: '',
  policyFamily: '', idNumber: '', idDate: '', idPlace: '', insuranceNo: '', phone: '', email: '',
  // 32–33. Bảng
  training: [],   // { id, from, to, school, major, form, degree }
  history: [],    // { id, from, to, content }
  // 34–37.
  selfHistory: '', family: [], // { id, relation, name, birth, info }
  economy: '', remark: '',
  active: true, note: '',
  btv: false,     // true = THUỘC DIỆN BAN THƯỜNG VỤ TỈNH ỦY QUẢN LÝ (xem HR_BTV bên dưới)
  sample: false,  // true = dữ liệu mô phỏng, cần cập nhật theo hồ sơ gốc
});

// Diện quản lý cán bộ — trường này TÁCH DANH SÁCH giữa hai phân hệ đánh giá:
//  • Kiểm điểm, xếp loại đảng viên (hằng quý) → chỉ cán bộ THUỘC diện BTV Tỉnh ủy quản lý.
//  • OKR/KPI (hằng tháng) → cán bộ, công chức, người lao động của Văn phòng (xem isVanPhong).
// Ba đồng chí lãnh đạo Văn phòng thuộc CẢ HAI danh sách: hằng tháng chấm KPI với tư cách
// cán bộ Văn phòng, hằng quý kiểm điểm với tư cách cán bộ diện BTV Tỉnh ủy quản lý.
export const HR_BTV = [
  { k: true, label: 'Thuộc diện BTV Tỉnh ủy quản lý', short: 'Diện BTV Tỉnh ủy' },
  { k: false, label: 'Không thuộc diện BTV Tỉnh ủy quản lý', short: 'Không thuộc diện' },
];
export const btvOf = (s) => (s?.btv ? HR_BTV[0] : HR_BTV[1]);

// Cán bộ, công chức, người lao động của Văn phòng (đơn vị là "Văn phòng" hoặc một phòng
// trực thuộc) — khác với đại biểu chuyên trách ở HĐND tỉnh, các Ban, Đoàn ĐBQH.
export const isVanPhong = (s) => /^(Văn phòng|Phòng )/i.test(String(s?.department || '').trim());

// Hồ sơ nào thuộc danh sách đánh giá của phân hệ nào.
export function staffForModule(staff, version) {
  const list = (Array.isArray(staff) ? staff : []).filter((s) => s && s.active !== false && !s.detached);
  if (version === 'kiemdiem') return list.filter((s) => !!s.btv);
  if (version === 'sonha') return list.filter(isVanPhong);
  return list;
}

export const newTraining = () => ({ id: 't_' + Math.random().toString(36).slice(2, 8), from: '', to: '', school: '', major: '', form: 'Chính quy', degree: '' });
export const newHistory = () => ({ id: 'h_' + Math.random().toString(36).slice(2, 8), from: '', to: '', content: '' });
export const newFamily = () => ({ id: 'f_' + Math.random().toString(36).slice(2, 8), relation: 'Vợ/Chồng', name: '', birth: '', info: '' });

// ---------------------------------------------------------------- Nâng bậc lương
// Trả về mốc kế tiếp: nâng bậc thường xuyên, hoặc (khi đã ở bậc cuối) phụ cấp thâm niên vượt khung.
//  - Bậc thường: ngày hưởng bậc hiện tại + chu kỳ (36/24 tháng).
//  - Vượt khung lần đầu: ngày hưởng bậc cuối + chu kỳ → 5%; sau đó mỗi 12 tháng + 1%.
export function nextRaise(s) {
  const ng = ngachOf(s.ngach);
  const from = toDate(s.salaryDate);
  if (!from) return null;
  const atMax = Number(s.bac || 0) >= ng.bacMax;
  if (!atMax) {
    return { kind: 'bac', date: addMonths(from, ng.cycle), label: `Nâng bậc lương thường xuyên (bậc ${Number(s.bac || 0) + 1}/${ng.bacMax})`, cycle: ng.cycle };
  }
  const pct = Number(s.vuotKhungPct || 0);
  if (pct <= 0) return { kind: 'vk', date: addMonths(from, ng.cycle), label: 'Hưởng phụ cấp thâm niên vượt khung 5%', cycle: ng.cycle };
  return { kind: 'vk', date: addMonths(from, 12), label: `Nâng phụ cấp thâm niên vượt khung lên ${pct + 1}%`, cycle: 12 };
}

// ---------------------------------------------------------------- Nghỉ hưu
// Tuổi nghỉ hưu (tính bằng THÁNG) áp dụng cho người nghỉ hưu trong năm `year` — NĐ 135/2020/NĐ-CP:
//   Nam: từ 60 tuổi 3 tháng (2021), mỗi năm +3 tháng, đủ 62 tuổi từ 2028.
//   Nữ:  từ 55 tuổi 4 tháng (2021), mỗi năm +4 tháng, đủ 60 tuổi từ 2035.
export function retireAgeMonths(year, gender) {
  if (gender === 'nu') {
    const step = Math.min(Math.max(year - 2021, 0), 14);
    return Math.min(55 * 12 + 4 + step * 4, 60 * 12);
  }
  const step = Math.min(Math.max(year - 2021, 0), 7);
  return Math.min(60 * 12 + 3 + step * 3, 62 * 12);
}
// Thời điểm nghỉ hưu = kết thúc ngày cuối cùng của tháng đủ tuổi nghỉ hưu (NĐ 135/2020 Điều 3).
export function retireDate(birth, gender) {
  const b = toDate(birth);
  if (!b) return null;
  let last = null;
  for (let y = b.getFullYear() + 50; y <= b.getFullYear() + 70; y++) {
    const d = addMonths(b, retireAgeMonths(y, gender));
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    last = end;
    if (end.getFullYear() === y) return end;
  }
  return last;
}

// ---------------------------------------------------------------- Sinh nhật
export function nextBirthday(birth, from = new Date()) {
  const b = toDate(birth);
  if (!b) return null;
  const t = startOfDay(from);
  let d = new Date(t.getFullYear(), b.getMonth(), b.getDate());
  if (d < t) d = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
  return d;
}

// ---------------------------------------------------------------- Nhiệm vụ có thời hạn
export const HR_REPEAT = [
  { k: 'once', label: 'Một lần' },
  { k: 'month', label: 'Hằng tháng' },
  { k: 'quarter', label: 'Hằng quý' },
  { k: 'year', label: 'Hằng năm' },
];
export const newDuty = () => ({
  id: 'd_' + Math.random().toString(36).slice(2, 8),
  title: '', owner: '', due: '', repeat: 'once', lead: 15, note: '', done: false, doneAt: '',
});
// Hạn kế tiếp của nhiệm vụ: việc lặp thì dời tới mốc gần nhất chưa qua.
export function dutyNextDue(duty, from = new Date()) {
  const base = toDate(duty.due);
  if (!base) return null;
  if (duty.repeat === 'once') return base;
  const step = duty.repeat === 'month' ? 1 : duty.repeat === 'quarter' ? 3 : 12;
  const t = startOfDay(from);
  let d = base;
  let guard = 0;
  while (startOfDay(d) < t && guard++ < 400) d = addMonths(d, step);
  return d;
}

// ---------------------------------------------------------------- Biên chế
// quota: { 'Tên phòng': { cc: <chỉ tiêu công chức>, hd: <chỉ tiêu hợp đồng> } }
export function headcount(staff, quota = {}) {
  const list = (staff || []).filter((s) => s.active !== false);
  const depts = [...new Set([...Object.keys(quota), ...list.map((s) => s.department).filter(Boolean)])].sort();
  const rows = depts.map((dept) => {
    const inDept = list.filter((s) => s.department === dept);
    const cc = inDept.filter((s) => s.category !== 'hd').length;
    const hd = inDept.filter((s) => s.category === 'hd').length;
    const q = quota[dept] || {};
    const qcc = Number(q.cc || 0), qhd = Number(q.hd || 0);
    return { dept, cc, hd, qcc, qhd, dCc: cc - qcc, dHd: hd - qhd };
  });
  const sum = rows.reduce((a, r) => ({
    cc: a.cc + r.cc, hd: a.hd + r.hd, qcc: a.qcc + r.qcc, qhd: a.qhd + r.qhd,
  }), { cc: 0, hd: 0, qcc: 0, qhd: 0 });
  return { rows, sum: { ...sum, dCc: sum.cc - sum.qcc, dHd: sum.hd - sum.qhd } };
}

// ---------------------------------------------------------------- Nhắc việc
// Ngưỡng cảnh báo (ngày) — có thể chỉnh trong cấu hình.
export const DEFAULT_LEAD = { raise: 90, retire: 180, birthday: 15, contract: 60, appoint: 90, duty: 15 };

const mkAlert = (type, staffId, who, title, date, detail, lead) => {
  const d = daysTo(date);
  return {
    type, staffId, who, title, date, detail,
    days: d,
    level: d == null ? 'info' : d < 0 ? 'overdue' : d <= Math.round(lead / 3) ? 'urgent' : 'soon',
  };
};

// Gom toàn bộ cảnh báo cần Quản trị xử lý, sắp theo mức độ khẩn.
export function buildAlerts(staff, duties, quota, lead = DEFAULT_LEAD, today = new Date()) {
  const L = { ...DEFAULT_LEAD, ...(lead || {}) };
  const out = [];
  (staff || []).filter((s) => s.active !== false).forEach((s) => {
    const who = s.name || '(chưa có tên)';
    // 1) Nâng bậc lương / vượt khung
    const r = nextRaise(s);
    if (r) {
      const d = daysTo(r.date, today);
      if (d != null && d <= L.raise) out.push(mkAlert('raise', s.id, who, r.label, r.date, `${s.position || ''}${s.department ? ' · ' + s.department : ''} · ngạch ${ngachOf(s.ngach).name}, bậc ${s.bac}/${ngachOf(s.ngach).bacMax}, hệ số ${s.heso}`, L.raise));
    }
    // 2) Nghỉ hưu (thông báo trước 6 tháng, quyết định trước 3 tháng — NĐ 46/2010)
    if (s.category !== 'hd') {
      const rd = retireDate(s.birth, s.gender);
      const d = daysTo(rd, today);
      if (rd && d != null && d <= L.retire) out.push(mkAlert('retire', s.id, who, 'Đến tuổi nghỉ hưu', rd, `Sinh ${fmtD(s.birth)} · ${ageAt(s.birth, today)} tuổi · ${s.gender === 'nu' ? 'Nữ' : 'Nam'} — thông báo nghỉ hưu trước 6 tháng, quyết định trước 3 tháng`, L.retire));
    }
    // 3) Sinh nhật
    const bd = nextBirthday(s.birth, today);
    const dbd = daysTo(bd, today);
    if (bd && dbd != null && dbd <= L.birthday) out.push(mkAlert('birthday', s.id, who, 'Sinh nhật', bd, `Tròn ${(ageAt(s.birth, bd) ?? 0)} tuổi · ${s.position || ''}${s.department ? ' · ' + s.department : ''}`, L.birthday));
    // 4) Hết hạn hợp đồng lao động
    if (s.contractTo) {
      const d = daysTo(s.contractTo, today);
      if (d != null && d <= L.contract) out.push(mkAlert('contract', s.id, who, 'Hết hạn hợp đồng lao động', s.contractTo, `${s.contractType || 'Hợp đồng lao động'} · từ ${fmtD(s.contractFrom)}`, L.contract));
    }
    // 5) Hết thời hạn giữ chức vụ (bổ nhiệm)
    if (s.appointDate && Number(s.appointTerm || 0) > 0) {
      const end = addMonths(toDate(s.appointDate), Number(s.appointTerm));
      const d = daysTo(end, today);
      if (d != null && d <= L.appoint) out.push(mkAlert('appoint', s.id, who, 'Hết thời hạn giữ chức vụ', end, `${s.position || ''} · bổ nhiệm ${fmtD(s.appointDate)}, thời hạn ${s.appointTerm} tháng`, L.appoint));
    }
  });
  // 6) Nhiệm vụ, báo cáo có thời hạn
  (duties || []).filter((x) => !x.done).forEach((x) => {
    const due = dutyNextDue(x, today);
    const ld = Number(x.lead || L.duty);
    const d = daysTo(due, today);
    if (due && d != null && d <= ld) {
      out.push(mkAlert('duty', null, x.owner || '', x.title || '(chưa đặt tên nhiệm vụ)', due,
        `${HR_REPEAT.find((r) => r.k === x.repeat)?.label || ''}${x.owner ? ' · phụ trách: ' + x.owner : ''}${x.note ? ' · ' + x.note : ''}`, ld));
      out[out.length - 1].dutyId = x.id;
    }
  });
  // 7) Biên chế thừa/thiếu
  const hc = headcount(staff, quota);
  hc.rows.forEach((r) => {
    if (r.qcc > 0 && r.dCc !== 0) {
      out.push({ type: 'headcount', who: r.dept, title: r.dCc > 0 ? `Biên chế công chức VƯỢT ${r.dCc} người` : `Biên chế công chức THIẾU ${-r.dCc} người`,
        detail: `Được giao ${r.qcc} · thực có ${r.cc}`, date: null, days: null, level: r.dCc > 0 ? 'overdue' : 'urgent' });
    }
    if (r.qhd > 0 && r.dHd !== 0) {
      out.push({ type: 'headcount', who: r.dept, title: r.dHd > 0 ? `Hợp đồng VƯỢT ${r.dHd} người` : `Hợp đồng THIẾU ${-r.dHd} người`,
        detail: `Được giao ${r.qhd} · thực có ${r.hd}`, date: null, days: null, level: 'soon' });
    }
  });
  const rank = { overdue: 0, urgent: 1, soon: 2, info: 3 };
  return out.sort((a, b) => (rank[a.level] - rank[b.level]) || ((a.days ?? 9e9) - (b.days ?? 9e9)));
}

export const ALERT_META = {
  raise: { label: 'Nâng lương', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  retire: { label: 'Nghỉ hưu', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  birthday: { label: 'Sinh nhật', tone: 'bg-pink-50 text-pink-700 border-pink-200' },
  contract: { label: 'Hợp đồng', tone: 'bg-sky-50 text-sky-700 border-sky-200' },
  appoint: { label: 'Bổ nhiệm', tone: 'bg-violet-50 text-violet-700 border-violet-200' },
  duty: { label: 'Nhiệm vụ', tone: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  headcount: { label: 'Biên chế', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
};
export const LEVEL_TONE = {
  overdue: 'bg-rose-50 border-rose-300 text-rose-800',
  urgent: 'bg-amber-50 border-amber-300 text-amber-800',
  soon: 'bg-slate-50 border-slate-200 text-slate-700',
  info: 'bg-slate-50 border-slate-200 text-slate-600',
};

// ---------------------------------------------------------------- Đồng bộ với hệ thống
// Hồ sơ cán bộ KHÔNG nhập rời: danh sách người được lấy tự động từ danh sách cán bộ
// đang quản lý ở các module khác (tab Đánh giá). Module này bổ sung phần hồ sơ 2C.

// Suy đối tượng quản lý từ chức vụ / đơn vị.
export function inferCategory(p) {
  const pos = (p?.position || ''), dept = (p?.department || '');
  if (/Lái xe|Bảo vệ|phục vụ|tạp vụ|bảo trì|lễ tân|hậu cần/i.test(pos)) return 'hd';
  if (/Quốc hội/i.test(dept) || /đại biểu Quốc hội|Trưởng đoàn ĐBQH/i.test(pos)) return 'dbqh';
  if (/^HĐND tỉnh$|^Ban /i.test(dept) || /Chủ tịch HĐND|Trưởng Ban|Ủy viên chuyên trách/i.test(pos)) return 'hdnd';
  return 'cc';
}
// Suy ngạch khởi tạo từ chức vụ (quản trị chỉnh lại theo quyết định bổ nhiệm ngạch).
export function inferNgach(p) {
  const pos = (p?.position || '');
  if (/Lái xe|Bảo vệ|phục vụ|tạp vụ|bảo trì|lễ tân/i.test(pos)) return 'HD';
  if (/Chủ tịch HĐND|Trưởng Ban(?! )|^Trưởng Ban|Chánh Văn phòng|Trưởng đoàn ĐBQH/i.test(pos) && !/Phó/i.test(pos)) return '01.001';
  if (/Phó|Trưởng phòng|Trưởng Ban|đại biểu Quốc hội/i.test(pos)) return '01.002';
  if (/Chuyên viên/i.test(pos)) return '01.003';
  return '01.003';
}
// Khóa ghép hồ sơ ↔ cán bộ: ưu tiên email, sau đó "họ tên | đơn vị", cuối cùng là họ tên.
// `strict` = BỎ khóa chỉ-theo-họ-tên. Cần khi gộp danh sách của các đơn vị khác nhau: cơ quan
// có hai người TRÙNG HỌ TÊN ở hai đơn vị (vd đ/c Lê Thị Hương ở Phòng Hành chính - Tổ chức -
// Quản trị và đ/c Lê Thị Hương Phó Trưởng Ban Pháp chế) — ghép nhầm sẽ mất một người.
const keysOf = (x, strict = false) => {
  const k = [];
  const em = (x?.email || '').trim().toLowerCase();
  const nm = (x?.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (em) k.push('e:' + em);
  if (nm) {
    k.push('n:' + nm + '|' + (x?.department || '').trim().toLowerCase());
    if (!strict) k.push('s:' + nm);
  }
  return k;
};

// Đồng bộ danh sách hồ sơ với danh sách cán bộ của hệ thống.
//  • Người CHƯA có hồ sơ  -> tạo hồ sơ khung (tên, chức vụ, đơn vị, email, đối tượng, ngạch gợi ý).
//  • Người ĐÃ có hồ sơ    -> cập nhật chức vụ/đơn vị/email nếu hệ thống đổi; GIỮ NGUYÊN mọi thông tin đã nhập.
//  • Hồ sơ không còn trong danh sách -> GIỮ LẠI (đánh dấu detached) để không mất dữ liệu đã khai.
// Trả về { staff, added, updated, detached } — thuần, không sửa mảng đầu vào.
export function syncStaffFromPeople(staff, people, { strict = false } = {}) {
  const list = Array.isArray(staff) ? staff : [];
  const src = (Array.isArray(people) ? people : []).filter((p) => p && (p.name || '').trim());
  const index = new Map();
  list.forEach((s, i) => keysOf(s, strict).forEach((k) => { if (!index.has(k)) index.set(k, i); }));

  const out = list.map((s) => ({ ...s }));
  const matched = new Set();
  let added = 0, updated = 0;

  src.forEach((p) => {
    const hit = keysOf(p, strict).map((k) => index.get(k)).find((i) => i != null && !matched.has(i));
    if (hit != null) {
      matched.add(hit);
      const s = out[hit];
      const patch = {};
      if (p.name && p.name !== s.name) patch.name = p.name;
      if (p.position && p.position !== s.position) patch.position = p.position;
      if (p.department && p.department !== s.department) patch.department = p.department;
      if (p.email && p.email !== s.email) patch.email = p.email;
      if (s.detached) patch.detached = false;
      if (Object.keys(patch).length) { Object.assign(s, patch); updated++; }
      return;
    }
    const s = newStaff(p.name);
    const ngach = inferNgach(p);
    Object.assign(s, {
      position: p.position || '', department: p.department || '', email: p.email || '',
      category: inferCategory(p), ngach, bac: 1, heso: hesoOf(ngach, 1),
      mainWork: p.position || '', hireAgency: '',
    });
    out.push(s); added++;
  });

  let detached = 0;
  out.forEach((s, i) => {
    if (i < list.length && !matched.has(i) && !s.detached) { s.detached = true; detached++; }
  });
  return { staff: out, added, updated, detached };
}

// Chiều NGƯỢC LẠI: dựng danh sách cán bộ của MỘT PHÂN HỆ từ hồ sơ 2C (nguồn duy nhất).
//  • Hồ sơ thuộc phạm vi phân hệ mà chưa có trong danh sách -> tạo người mới (makePerson).
//  • Đã có -> GIỮ NGUYÊN toàn bộ điểm/nhiệm vụ, chỉ đồng bộ họ tên, chức vụ, đơn vị, email.
//  • Người không còn trong phạm vi phân hệ -> bỏ khỏi danh sách của phân hệ đó (hồ sơ 2C
//    vẫn còn nguyên; muốn thêm/bớt thì sửa ở module Quản lý cán bộ).
// Thứ tự trả về theo đúng thứ tự hồ sơ 2C. Thuần, không sửa mảng đầu vào.
export function syncPeopleFromStaff(people, staff, version, makePerson) {
  const scope = staffForModule(staff, version);
  const src = Array.isArray(people) ? people : [];
  const index = new Map();
  src.forEach((p, i) => keysOf(p).forEach((k) => { if (!index.has(k)) index.set(k, i); }));
  const used = new Set();
  return scope.map((s) => {
    const hit = keysOf(s).map((k) => index.get(k)).find((i) => i != null && !used.has(i));
    if (hit == null) return makePerson(s);
    used.add(hit);
    const p = src[hit];
    return {
      ...p,
      name: s.name || p.name,
      position: s.position || p.position,
      department: s.department || p.department,
      email: s.email || p.email,
    };
  });
}

// ---------------------------------------------------------------- Độ đầy đủ hồ sơ
// Các trường cốt lõi cần có để hồ sơ dùng được cho quản lý nhân sự và nhắc việc.
export const CORE_FIELDS = [
  ['birth', 'Ngày sinh'], ['gender', 'Giới tính'], ['hometown', 'Quê quán'],
  ['residence', 'Hộ khẩu thường trú'], ['idNumber', 'Số căn cước'], ['insuranceNo', 'Số sổ BHXH'],
  ['phone', 'Điện thoại'], ['eduMajor', 'Trình độ chuyên môn'], ['politics', 'Lý luận chính trị'],
  ['hireDate', 'Ngày tuyển dụng'], ['salaryDate', 'Ngày hưởng bậc lương'], ['mainWork', 'Công việc được giao'],
];
// Tỷ lệ hoàn thiện hồ sơ + danh sách mục còn thiếu (để nhắc quản trị bổ sung).
export function profileCompleteness(s) {
  const missing = CORE_FIELDS.filter(([k]) => !String(s?.[k] ?? '').trim()).map(([, lb]) => lb);
  const pct = Math.round(((CORE_FIELDS.length - missing.length) / CORE_FIELDS.length) * 100);
  return { pct, missing, done: CORE_FIELDS.length - missing.length, total: CORE_FIELDS.length };
}
