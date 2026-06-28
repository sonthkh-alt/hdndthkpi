// ============================================================================
// PHIÊN BẢN "SINGAPORE" — Phiếu đánh giá theo mô hình Quản lý hiệu suất của
// Khu vực công Singapore (Public Service Performance Management) — để THAM KHẢO.
//
// Khác hoàn toàn khung QĐ 1053 (30/70 + Điều 8). Cấu phần đặc trưng Singapore:
//   1. Work Review (Performance / "What")  — mục tiêu công việc + Key Results, gắn OKR.
//   2. Competencies (AIM / "How")          — Analytical · Influence · Motivation.
//   3. Core Values (ISE)                   — Integrity · Service · Excellence.
//   4. Overall Performance Grade (A–E)     — suy ra từ (1)+(2)+(3), có hiệu chỉnh/xếp hạng tương đối.
//   5. Currently Estimated Potential (CEP) — tiềm năng, TÁCH RIÊNG khỏi điểm (dùng quy hoạch).
//   6. Development (CFR/IDP)               — điểm mạnh, lĩnh vực phát triển, đối thoại cá nhân↔cấp trên.
//
// Nguồn tham khảo: PSD Singapore (appraisal, CEP, AIM), CSC (giá trị ISE),
// GovTech (OKR), nguyên tắc: hiệu suất chấm theo kết quả + năng lực; tiềm năng tách riêng.
// ============================================================================
import { Award, Target, Users, Sparkles, Compass, TrendingUp, FileText, Printer, Link2, Plus, Trash2, MessageSquare, CheckCircle2 } from 'lucide-react';

// Thang đánh giá 5 mức (dùng cho mức đạt mục tiêu + năng lực + giá trị).
export const SG_RATING = [
  { v: 5, label: 'Xuất sắc' }, { v: 4, label: 'Vượt mong đợi' }, { v: 3, label: 'Đạt mong đợi' }, { v: 2, label: 'Cần cải thiện' }, { v: 1, label: 'Chưa đạt' },
];
// Năng lực AIM.
export const SG_COMPETENCIES = [
  { key: 'analytical', name: 'Năng lực phân tích & trí tuệ (Analytical)', desc: 'Phân tích vấn đề có hệ thống, tư duy chiến lược, quyết định dựa trên dữ liệu/thực tiễn.' },
  { key: 'influence', name: 'Ảnh hưởng & hợp tác (Influence)', desc: 'Thuyết phục, phối hợp liên cơ quan (Whole-of-Government), dẫn dắt và làm việc nhóm hiệu quả.' },
  { key: 'motivation', name: 'Động lực hướng tới xuất sắc (Motivation)', desc: 'Chủ động nâng cao chất lượng, đổi mới, không bằng lòng với mức tối thiểu.' },
];
// Giá trị cốt lõi ISE.
export const SG_VALUES = [
  { key: 'integrity', name: 'Liêm chính (Integrity)', desc: 'Trung thực, không thiên vị, không vụ lợi; làm đúng kể cả khi không ai giám sát.' },
  { key: 'service', name: 'Phục vụ (Service)', desc: 'Tận tâm phục vụ người dân/đại biểu; sẵn sàng "đi thêm một dặm".' },
  { key: 'excellence', name: 'Xuất sắc (Excellence)', desc: 'Nỗ lực đạt chuẩn cao nhất; cải tiến liên tục.' },
];
// CEP — mức trách nhiệm cao nhất ước lượng cán bộ có thể đảm nhận (3–5 năm tới).
export const CEP_LEVELS = ['Chuyên viên', 'Phó Trưởng phòng', 'Trưởng phòng / Phó Trưởng ban', 'Phó Chánh Văn phòng / Trưởng ban', 'Chánh Văn phòng', 'Lãnh đạo cấp tỉnh'];

// Trọng số tổng hợp: Hiệu suất 60% · Năng lực (AIM) 25% · Giá trị (ISE) 15%.
export const SG_WEIGHTS = { perf: 0.6, comp: 0.25, val: 0.15 };

export const SG_GRADES = [
  { code: 'A', name: 'Outstanding — Xuất sắc nổi bật', min: 90, soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', cls: 'bg-emerald-600', ring: 'text-emerald-600', bar: 'bg-emerald-500' },
  { code: 'B', name: 'Exceeds — Vượt mong đợi', min: 75, soft: 'bg-sky-50 text-sky-700 border-sky-200', cls: 'bg-sky-600', ring: 'text-sky-600', bar: 'bg-sky-500' },
  { code: 'C', name: 'Meets — Đạt mong đợi', min: 55, soft: 'bg-amber-50 text-amber-700 border-amber-200', cls: 'bg-amber-500', ring: 'text-amber-600', bar: 'bg-amber-500' },
  { code: 'D', name: 'Below — Dưới mong đợi', min: 40, soft: 'bg-orange-50 text-orange-700 border-orange-200', cls: 'bg-orange-500', ring: 'text-orange-600', bar: 'bg-orange-500' },
  { code: 'E', name: 'Unsatisfactory — Không đạt', min: 0, soft: 'bg-rose-50 text-rose-700 border-rose-200', cls: 'bg-rose-600', ring: 'text-rose-600', bar: 'bg-rose-500' },
];
export const sgGradeInfo = (code) => SG_GRADES.find((g) => g.code === code) || SG_GRADES[SG_GRADES.length - 1];
const gradeFromOverall = (o) => (SG_GRADES.find((g) => o >= g.min) || SG_GRADES[SG_GRADES.length - 1]).code;
const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

// Tính kết quả phiếu Singapore cho 1 cán bộ (đọc person.sg). KHÔNG dùng khung 30/70.
export function computeSG(person) {
  const sg = (person && person.sg) || {};
  const goals = sg.goals || [];
  // Hiệu suất: trung bình CÓ TRỌNG SỐ mức đạt từng mục tiêu (1–5) → %.
  let ws = 0, rs = 0;
  goals.forEach((g) => { const w = Number(g.weight) || 1; const r = Number(g.rating) || 0; if (r > 0) { ws += w; rs += w * r; } });
  const perfAvg = ws > 0 ? rs / ws : 0;
  const perfPct = perfAvg / 5 * 100;
  // Năng lực AIM & Giá trị ISE: trung bình mức 1–5.
  const compArr = SG_COMPETENCIES.map((c) => Number((sg.comp || {})[c.key]) || 0).filter((x) => x > 0);
  const valArr = SG_VALUES.map((c) => Number((sg.values || {})[c.key]) || 0).filter((x) => x > 0);
  const compAvg = avg(compArr), valAvg = avg(valArr);
  const compPct = compAvg / 5 * 100, valPct = valAvg / 5 * 100;
  const has = goals.some((g) => Number(g.rating) > 0) || compArr.length || valArr.length;
  const overall = SG_WEIGHTS.perf * perfPct + SG_WEIGHTS.comp * compPct + SG_WEIGHTS.val * valPct;
  const autoGrade = has ? gradeFromOverall(overall) : 'E';
  const grade = sg.grade || autoGrade; // cấp trên có thể hiệu chỉnh (moderation/xếp hạng tương đối)
  return {
    perfAvg, perfPct, compAvg, compPct, valAvg, valPct, overall, autoGrade, grade, has,
    cep: sg.cep || '',
    // các trường tương thích để tab Tổng quan/aside dùng chung
    totalMgr: overall, totalSelf: overall,
  };
}

// Dữ liệu SG mẫu (demo) theo hồ sơ A/B/C/D — để dashboard Singapore có số liệu ngay.
export function defaultSG(profile, type, objIds = []) {
  const base = { A: 5, B: 4, C: 3, D: 2 }[profile] || 3;
  const jit = (n) => Math.max(1, Math.min(5, n));
  const oc = objIds.length;
  const goals = [
    { id: 'g1', title: type === 'hdnd' || type === 'dbqh' ? 'Nâng cao chất lượng thẩm tra, góp ý nghị quyết' : 'Hoàn thành nhiệm vụ chuyên môn trọng tâm được giao', objId: oc ? objIds[0] : '', kr: 'Tỷ lệ sản phẩm đạt yêu cầu, đúng hạn', target: 100, current: base * 18, unit: '%', weight: 3, rating: jit(base) },
    { id: 'g2', title: type === 'hdnd' || type === 'dbqh' ? 'Tăng cường giám sát, tiếp xúc & giải quyết kiến nghị cử tri' : 'Phối hợp phục vụ kỳ họp, hoạt động giám sát', objId: oc > 1 ? objIds[2 % oc] : '', kr: 'Số việc hoàn thành theo kế hoạch', target: 10, current: Math.round(base * 1.6), unit: 'việc', weight: 2, rating: jit(base - (profile === 'B' ? 1 : 0)) },
  ];
  const comp = { analytical: jit(base), influence: jit(base - (profile === 'C' ? 1 : 0)), motivation: jit(base) };
  const values = { integrity: jit(base + (profile === 'D' ? 1 : 0)), service: jit(base), excellence: jit(base - (profile === 'D' ? 0 : 0)) };
  const cep = { A: CEP_LEVELS[4], B: CEP_LEVELS[2], C: CEP_LEVELS[1], D: CEP_LEVELS[0] }[profile] || CEP_LEVELS[0];
  return {
    goals, comp, values, cep, grade: '',
    strengths: profile === 'A' ? 'Tư duy phân tích tốt, chủ động, nhiều sáng kiến.' : profile === 'D' ? '' : 'Trách nhiệm, phối hợp tốt với đồng nghiệp.',
    development: profile === 'D' ? 'Cần cải thiện tiến độ và kỷ luật công việc.' : profile === 'C' ? 'Nâng cao kỹ năng phân tích, chủ động hơn.' : 'Phát triển năng lực dẫn dắt, điều phối.',
    devActions: 'Tham gia tập huấn chuyên môn; được giao việc thử thách dần.',
    selfComment: '', supComment: '',
  };
}

// ============================================================================
// TẦNG A — BẢNG ĐIỂM THIẾT CHẾ (Văn phòng/HĐND), dải màu Xanh/Vàng/Đỏ.
// Mô phỏng Town Council Management Report (TCMR) của MND Singapore: chấm KPI THIẾT CHẾ
// do người dân cử điều hành theo dải màu, mỗi chỉ số xếp màu RIÊNG (không gộp 1 điểm),
// công bố theo kỳ để minh bạch. Đại biểu dân cử KHÔNG bị chấm điểm cá nhân.
// ============================================================================
export const SG_INST_KPI_DEFAULT = [
  { id: 'a1', name: 'Phục vụ kỳ họp', desc: 'Tỷ lệ tài liệu kỳ họp gửi đại biểu đúng hạn quy định', unit: '%', value: 92, better: 'high', green: 95, amber: 80 },
  { id: 'a2', name: 'Văn bản đúng hạn', desc: 'Tỷ lệ văn bản tham mưu, ban hành đúng thời hạn', unit: '%', value: 88, better: 'high', green: 95, amber: 85 },
  { id: 'a3', name: 'Xử lý kiến nghị cử tri', desc: 'Tỷ lệ kiến nghị/đơn thư được xử lý đúng hạn và có phản hồi', unit: '%', value: 82, better: 'high', green: 90, amber: 70 },
  { id: 'a4', name: 'Hài lòng về phục vụ', desc: 'Tỷ lệ đại biểu/cử tri hài lòng về phục vụ của Văn phòng (khảo sát)', unit: '%', value: 78, better: 'high', green: 80, amber: 60 },
  { id: 'a5', name: 'Minh bạch & quản trị', desc: 'Điểm vi phạm về công khai, tài chính, kiểm toán (càng thấp càng tốt)', unit: 'điểm', value: 0, better: 'low', green: 0, amber: 1 },
];
export function instBand(k) {
  const v = Number(k.value) || 0;
  if (k.better === 'low') return v <= Number(k.green) ? 'green' : v <= Number(k.amber) ? 'amber' : 'red';
  return v >= Number(k.green) ? 'green' : v >= Number(k.amber) ? 'amber' : 'red';
}
export const INST_BAND = {
  green: { label: 'Xanh — Tốt', cls: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  amber: { label: 'Vàng — Cần cải thiện', cls: 'bg-amber-500', soft: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  red: { label: 'Đỏ — Yếu', cls: 'bg-rose-500', soft: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};
const bandThresholdText = (k) => k.better === 'low'
  ? `Xanh ≤ ${k.green}${k.unit} · Vàng ≤ ${k.amber}${k.unit} · Đỏ > ${k.amber}${k.unit}`
  : `Xanh ≥ ${k.green}${k.unit} · Vàng ≥ ${k.amber}${k.unit} · Đỏ < ${k.amber}${k.unit}`;

export function SingaporeInstitution({ kpis = [], canManage, onChange }) {
  const list = kpis.length ? kpis : SG_INST_KPI_DEFAULT;
  const upK = (id, patch) => onChange && onChange(list.map((k) => (k.id === id ? { ...k, ...patch } : k)));
  const count = { green: 0, amber: 0, red: 0 };
  list.forEach((k) => { count[instBand(k)]++; });
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Compass className="w-5 h-5 text-violet-200" /> Tầng A — Bảng điểm THIẾT CHẾ (cơ quan), dải màu Xanh/Vàng/Đỏ</h2></div>
      <div className="p-4">
        <p className="text-[12px] text-indigo-800/80 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 mb-3">Mô phỏng <b>Town Council Management Report</b> của Singapore: chấm KPI của <b>cơ quan/Văn phòng</b> theo dải màu, mỗi chỉ số xếp màu <b>riêng</b> (không gộp thành 1 điểm), công bố theo kỳ để minh bạch. <b>Đại biểu dân cử KHÔNG bị chấm điểm cá nhân</b> — chỉ đánh giá thiết chế phục vụ và công chức (Tầng B).</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((k) => { const b = INST_BAND[instBand(k)]; return (
            <div key={k.id} className={`rounded-xl border p-3 ${b.soft}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-800 leading-snug">{k.name}</p>
                <span className={`shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded ${b.cls}`}>{b.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{k.desc}</p>
              <div className="mt-2 flex items-center gap-2">
                <input type="number" value={k.value} disabled={!canManage} onChange={(e) => upK(k.id, { value: e.target.value })} className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm text-center font-bold text-slate-800 outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                <span className="text-xs text-slate-500">{k.unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">{bandThresholdText(k)}</p>
            </div>
          ); })}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Xanh: <b>{count.green}</b></span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Vàng: <b>{count.amber}</b></span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Đỏ: <b>{count.red}</b></span>
          {canManage && <span className="text-slate-400 ml-auto">Quản trị nhập số liệu từng kỳ; ngưỡng dải màu tham khảo TCMR + chuẩn dịch vụ GovTech.</span>}
        </div>
      </div>
    </section>
  );
}

// ---------- Thành phần dùng lại ----------
function RatingSelect({ value, disabled, onChange }) {
  return (
    <select value={value || 0} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-500">
      <option value={0}>— Chọn mức —</option>
      {SG_RATING.map((r) => <option key={r.v} value={r.v}>{r.v} · {r.label}</option>)}
    </select>
  );
}
function Bar({ pct, tone = 'indigo' }) {
  const cls = { indigo: 'bg-indigo-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', violet: 'bg-violet-500' }[tone] || 'bg-indigo-500';
  return <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cls} transition-all`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>;
}
function Section({ icon: Icon, title, hint, children, n }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-5 py-3 flex items-center gap-2.5">
        {n && <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">{n}</span>}
        <Icon className="w-5 h-5 text-violet-200 shrink-0" /><h2 className="font-bold text-sm sm:text-base">{title}</h2>
      </div>
      <div className="p-4">{hint && <p className="text-[12px] text-indigo-800/80 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 mb-3">{hint}</p>}{children}</div>
    </section>
  );
}

// ---------- PHIẾU ĐÁNH GIÁ SINGAPORE (tab Đánh giá khi version=sg) ----------
export function SingaporeAppraisal({ person, c, objectives = [], selfEditable, mgrEditable, onPatch, onWord }) {
  const sg = person.sg || {};
  const edit = selfEditable || mgrEditable;     // mục tiêu/sản phẩm: cán bộ đề xuất
  const mod = mgrEditable;                        // chấm mức, grade, CEP: cấp trên
  const goals = sg.goals || [];
  const gi = sgGradeInfo(c.grade);
  const setGoals = (gs) => onPatch({ goals: gs });
  const upGoal = (id, patch) => setGoals(goals.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  const addGoal = () => setGoals([...goals, { id: 'g' + Date.now(), title: '', objId: '', kr: '', target: 100, current: 0, unit: '%', weight: 1, rating: 0 }]);
  const delGoal = (id) => setGoals(goals.filter((g) => g.id !== id));

  return (
    <div className="flex-1 space-y-5">
      {/* Tóm tắt điểm & xếp loại Singapore */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className={`${gi.cls} text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3`}>
          <div>
            <p className="text-xs opacity-90 uppercase tracking-wider">Overall Performance Grade</p>
            <p className="text-3xl font-extrabold leading-none mt-1">{gi.code} <span className="text-base font-semibold opacity-90">· {gi.name}</span></p>
          </div>
          <div className="text-right"><p className="text-xs opacity-90">Điểm tổng hợp</p><p className="text-3xl font-extrabold">{c.overall.toFixed(1)}<span className="text-sm">/100</span></p></div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
          {[['Hiệu suất (60%)', c.perfPct], ['Năng lực AIM (25%)', c.compPct], ['Giá trị ISE (15%)', c.valPct]].map(([l, v]) => (
            <div key={l} className="py-3 px-2"><p className="text-[11px] text-slate-500">{l}</p><p className="font-bold text-slate-800 text-lg">{v.toFixed(0)}%</p></div>
          ))}
        </div>
      </section>

      {/* 1. WORK REVIEW */}
      <Section n="1" icon={Target} title="Work Review — Kết quả công việc (What)" hint='Mục tiêu công việc kỳ này, gắn với Mục tiêu (OKR) cơ quan; mỗi mục tiêu có "Kết quả then chốt" đo được. Cấp trên chấm mức đạt 1–5 (có trọng số).'>
        <div className="space-y-3">
          {goals.length === 0 && <p className="text-xs text-slate-400 italic">Chưa có mục tiêu công việc.</p>}
          {goals.map((g, i) => (
            <div key={g.id} className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <input value={g.title} disabled={!edit} onChange={(e) => upGoal(g.id, { title: e.target.value })} placeholder="Mục tiêu công việc..." className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                {edit && goals.length > 0 && <button onClick={() => delGoal(g.id)} className="shrink-0 text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>}
              </div>
              <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={g.objId || ''} disabled={!edit} onChange={(e) => upGoal(g.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 disabled:bg-slate-50"><option value="">— Gắn Mục tiêu (OKR) cơ quan —</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
              <input value={g.kr || ''} disabled={!edit} onChange={(e) => upGoal(g.id, { kr: e.target.value })} placeholder="Key Result / kết quả then chốt cần đạt..." className="w-full mb-2 bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 disabled:bg-slate-50" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end bg-slate-50/70 p-2 rounded-lg">
                <label className="block"><span className="text-[10px] text-slate-500">Hiện tại</span><input type="number" value={g.current} disabled={!edit} onChange={(e) => upGoal(g.id, { current: e.target.value })} className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded bg-white outline-none focus:border-indigo-400 disabled:bg-slate-100" /></label>
                <label className="block"><span className="text-[10px] text-slate-500">Chỉ tiêu</span><input type="number" value={g.target} disabled={!edit} onChange={(e) => upGoal(g.id, { target: e.target.value })} className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded bg-white outline-none focus:border-indigo-400 disabled:bg-slate-100" /></label>
                <label className="block"><span className="text-[10px] text-slate-500">Trọng số</span><input type="number" min="1" value={g.weight} disabled={!mod} onChange={(e) => upGoal(g.id, { weight: e.target.value })} className="mt-0.5 w-full text-xs p-1.5 border border-slate-200 rounded bg-white outline-none focus:border-indigo-400 disabled:bg-slate-100" /></label>
                <label className="block"><span className="text-[10px] text-slate-500">Mức đạt (cấp trên)</span><div className="mt-0.5"><RatingSelect value={g.rating} disabled={!mod} onChange={(v) => upGoal(g.id, { rating: v })} /></div></label>
              </div>
            </div>
          ))}
          {edit && <button onClick={addGoal} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600"><Plus className="w-4 h-4" /> Thêm mục tiêu công việc</button>}
        </div>
      </Section>

      {/* 2. COMPETENCIES (AIM) */}
      <Section n="2" icon={Sparkles} title="Competencies — Năng lực (How · AIM)" hint="Cấp trên đánh giá năng lực thể hiện trong kỳ theo thang 1–5.">
        <div className="space-y-2.5">
          {SG_COMPETENCIES.map((cp) => { const v = Number((sg.comp || {})[cp.key]) || 0; return (
            <div key={cp.key} className="flex items-start gap-3 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              <div className="flex-1"><p className="text-sm font-semibold text-slate-700">{cp.name}</p><p className="text-[11px] text-slate-500 mt-0.5">{cp.desc}</p></div>
              <div className="flex items-center gap-2"><Bar pct={v / 5 * 100} /><RatingSelect value={v} disabled={!mod} onChange={(nv) => onPatch({ comp: { ...(sg.comp || {}), [cp.key]: nv } })} /></div>
            </div>
          ); })}
        </div>
      </Section>

      {/* 3. CORE VALUES (ISE) */}
      <Section n="3" icon={Award} title="Core Values — Giá trị cốt lõi (ISE)" hint="Liêm chính – Phục vụ – Xuất sắc: chuẩn mực hành vi công vụ; ảnh hưởng tới triển vọng nghề nghiệp.">
        <div className="space-y-2.5">
          {SG_VALUES.map((cp) => { const v = Number((sg.values || {})[cp.key]) || 0; return (
            <div key={cp.key} className="flex items-start gap-3 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              <div className="flex-1"><p className="text-sm font-semibold text-slate-700">{cp.name}</p><p className="text-[11px] text-slate-500 mt-0.5">{cp.desc}</p></div>
              <div className="flex items-center gap-2"><Bar pct={v / 5 * 100} tone="violet" /><RatingSelect value={v} disabled={!mod} onChange={(nv) => onPatch({ values: { ...(sg.values || {}), [cp.key]: nv } })} /></div>
            </div>
          ); })}
        </div>
      </Section>

      {/* 4. OVERALL GRADE (moderation) */}
      <Section n="4" icon={TrendingUp} title="Overall Performance Grade — Xếp loại (A–E)" hint="Đề xuất tự động từ Hiệu suất + Năng lực + Giá trị. Cấp trên có thể hiệu chỉnh theo xếp hạng tương đối/hiệu chỉnh của hội đồng (không áp quota cứng).">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Đề xuất tự động:</span><span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${sgGradeInfo(c.autoGrade).soft}`}>{c.autoGrade} · {sgGradeInfo(c.autoGrade).name}</span></div>
          <label className="flex items-center gap-2 text-xs text-slate-500">Xếp loại chính thức:
            <select value={sg.grade || ''} disabled={!mod} onChange={(e) => onPatch({ grade: e.target.value })} className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-400 disabled:bg-slate-50">
              <option value="">(Theo đề xuất: {c.autoGrade})</option>
              {SG_GRADES.map((g) => <option key={g.code} value={g.code}>{g.code} · {g.name}</option>)}
            </select>
          </label>
          {sg.grade && sg.grade !== c.autoGrade && <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">Đã hiệu chỉnh khác đề xuất</span>}
        </div>
      </Section>

      {/* 5. CEP */}
      <Section n="5" icon={Compass} title="Currently Estimated Potential (CEP) — Tiềm năng" hint="Mức trách nhiệm cao nhất ước lượng cán bộ có thể đảm nhận trong 3–5 năm tới. TÁCH RIÊNG khỏi điểm hiệu suất — dùng cho quy hoạch, phát triển; KHÔNG ảnh hưởng xếp loại.">
        <label className="flex flex-col gap-1 max-w-md"><span className="text-xs text-slate-500">CEP của cán bộ</span>
          <select value={sg.cep || ''} disabled={!mod} onChange={(e) => onPatch({ cep: e.target.value })} className="text-sm p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-400 disabled:bg-slate-50">
            <option value="">— Chọn mức tiềm năng —</option>
            {CEP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </Section>

      {/* 6. DEVELOPMENT (CFR/IDP) */}
      <Section n="6" icon={MessageSquare} title="Development & Conversation (CFR / IDP)" hint="Đối thoại phát triển: điểm mạnh, lĩnh vực cần phát triển, kế hoạch (IDP) và trao đổi giữa cán bộ với cấp trên.">
        <div className="space-y-3">
          <Field label="Điểm mạnh nổi bật"><textarea value={sg.strengths || ''} disabled={!mod} onChange={(e) => onPatch({ strengths: e.target.value })} rows={2} className="sgta" /></Field>
          <Field label="Lĩnh vực cần phát triển"><textarea value={sg.development || ''} disabled={!mod} onChange={(e) => onPatch({ development: e.target.value })} rows={2} className="sgta" /></Field>
          <Field label="Kế hoạch phát triển cá nhân (IDP) — đào tạo, luân chuyển, giao việc thử thách"><textarea value={sg.devActions || ''} disabled={!mod} onChange={(e) => onPatch({ devActions: e.target.value })} rows={2} className="sgta" /></Field>
          <Field label="Ý kiến của cán bộ (tự nhận xét)"><textarea value={sg.selfComment || ''} disabled={!selfEditable} onChange={(e) => onPatch({ selfComment: e.target.value })} rows={2} className="sgta" /></Field>
          <Field label="Nhận xét của cấp trên trực tiếp"><textarea value={sg.supComment || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ supComment: e.target.value })} rows={2} className="sgta" /></Field>
        </div>
      </Section>

      <div className="flex flex-col sm:flex-row gap-2">
        <button onClick={onWord} className="flex-1 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất phiếu Word (Singapore)</button>
        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-violet-700 hover:bg-violet-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In phiếu (PDF)</button>
      </div>
      <style>{`.sgta{width:100%;border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.5rem 0.625rem;font-size:0.8125rem;color:#334155;outline:none}.sgta:focus{border-color:#818cf8}.sgta:disabled{background:#f8fafc;color:#64748b}`}</style>
    </div>
  );
}
function Field({ label, children }) { return (<label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">{label}</span>{children}</label>); }

// ---------- DASHBOARD SINGAPORE (tab Tổng quan khi version=sg) ----------
export function SingaporeDashboard({ computed, onPick }) {
  const n = computed.length;
  const dist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  computed.forEach(({ c }) => { dist[c.grade] = (dist[c.grade] || 0) + 1; });
  const ranked = [...computed].sort((a, b) => b.c.overall - a.c.overall);
  // Trung bình theo phòng
  const byDept = {};
  computed.forEach(({ p, c }) => { const d = p.department || '(Chưa có phòng)'; (byDept[d] = byDept[d] || []).push(c.overall); });
  const depts = Object.entries(byDept).map(([dept, arr]) => ({ dept, count: arr.length, avg: arr.reduce((a, b) => a + b, 0) / arr.length })).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><TrendingUp className="w-5 h-5 text-indigo-700" /> Phân bố xếp loại (Performance Grade A–E)</h2>
        <div className="space-y-3">
          {SG_GRADES.map((g) => { const cnt = dist[g.code] || 0; const pct = n ? cnt / n * 100 : 0; return (
            <div key={g.code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">{g.code} — {g.name}</span><span className="font-bold text-slate-700">{cnt}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${g.bar} transition-all`} style={{ width: `${pct}%` }} /></div></div>
          ); })}
        </div>
        <p className="text-[11px] text-slate-400 mt-3">Lưu ý: Singapore dùng xếp hạng tương đối có hiệu chỉnh giữa các đơn vị (không áp quota cứng). Tiềm năng (CEP) theo dõi riêng, không trộn vào xếp loại.</p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Award className="w-5 h-5 text-violet-200" /> Bảng xếp hạng & tiềm năng (CEP)</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">#</th><th className="text-left px-3 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Phòng/Bộ phận</th><th className="text-center px-3 py-2.5 font-semibold">Điểm</th><th className="text-center px-3 py-2.5 font-semibold">Grade</th><th className="text-left px-3 py-2.5 font-semibold">CEP (tiềm năng)</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map(({ p, c }, idx) => { const gi = sgGradeInfo(c.grade); return (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onPick && onPick(p.id)}>
                  <td className="px-4 py-3 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{p.name || '(Chưa tên)'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{p.department || '—'}</td>
                  <td className="px-3 py-3 text-center font-bold text-slate-800">{c.overall.toFixed(1)}</td>
                  <td className="px-3 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${gi.soft}`}><span className={`w-5 h-5 rounded-full ${gi.cls} text-white flex items-center justify-center text-[10px]`}>{gi.code}</span></span></td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{c.cep || '—'}</td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Users className="w-5 h-5 text-violet-200" /> Điểm trung bình theo Phòng/Bộ phận</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Phòng/Bộ phận</th><th className="text-center px-3 py-2.5 font-semibold">Số CB</th><th className="text-center px-3 py-2.5 font-semibold">Điểm TB</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {depts.map((d) => (<tr key={d.dept} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-700">{d.dept}</td><td className="px-3 py-3 text-center text-slate-500">{d.count}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{d.avg.toFixed(1)}</td></tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
