import { useState, useEffect, useMemo, useRef } from 'react';
import { Award, BarChart3, BookOpen, Plus, Trash2, Printer, RotateCcw, ShieldCheck, Cpu, ChevronDown, CheckCircle2, AlertTriangle, User, Target, ClipboardList, LayoutDashboard, UserPlus, Link2, Activity, TrendingUp, CalendarDays, Users, FileSpreadsheet, FileText, Cloud, CloudOff, Save } from 'lucide-react';
import { supabase, loadState, saveState } from './lib/supabase';
import { exportExcel1A, exportWordPhieu } from './lib/exporters';

const CRITERIA = {
  leader: { label: 'Cán bộ lãnh đạo, quản lý', mau: 'Mẫu số 02', formula: '(a+b+c+d+đ+e)/6', groups: [
    { id: 'L1', title: '1. Về chính trị, tư tưởng', max: 5, items: [
      { id: '1.1', max: 1, text: 'Tuyệt đối trung thành với Đảng, Tổ quốc và Nhân dân; kiên định lý tưởng cách mạng, chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh.' },
      { id: '1.2', max: 1, text: 'Có lập trường, bản lĩnh chính trị vững vàng; kiên quyết bảo vệ nền tảng tư tưởng, đường lối của Đảng; giữ nghiêm kỷ luật phát ngôn.' },
      { id: '1.3', max: 1, text: 'Có tinh thần yêu nước, tận tụy phục vụ Nhân dân; đặt lợi ích của Đảng, quốc gia, tập thể lên trên lợi ích cá nhân.' },
      { id: '1.4', max: 1, text: 'Tuyệt đối chấp hành sự phân công của tổ chức, yên tâm công tác và hoàn thành tốt mọi nhiệm vụ được giao.' },
      { id: '1.5', max: 0.5, text: 'Tích cực nghiên cứu, học tập chủ trương, nghị quyết của Đảng, chính sách, pháp luật của Nhà nước; cập nhật kiến thức mới.' },
      { id: '1.6', max: 0.5, text: 'Có năng lực tư duy và tầm nhìn đáp ứng yêu cầu thay đổi; phát huy tinh thần chủ động, đổi mới, sáng tạo.' } ] },
    { id: 'L2', title: '2. Về phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 5, items: [
      { id: '2.1', max: 1, text: 'Có phẩm chất đạo đức, lối sống trong sáng, trung thực; cần, kiệm, liêm, chính, chí công vô tư; nêu gương.' },
      { id: '2.2', max: 1, text: 'Không tham ô, tham nhũng, tiêu cực, quan liêu; đấu tranh chống lợi ích nhóm; không tự diễn biến, tự chuyển hóa.' },
      { id: '2.3', max: 1, text: 'Có ý thức tự giác học tập, tu dưỡng, rèn luyện; dám nghĩ, dám làm, dám chịu trách nhiệm.' },
      { id: '2.4', max: 1, text: 'Thực hiện nghiêm các nguyên tắc tổ chức của Đảng, nhất là tập trung dân chủ, tự phê bình và phê bình.' },
      { id: '2.5', max: 0.5, text: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định.' },
      { id: '2.6', max: 0.5, text: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác về thực hiện chức trách, nhiệm vụ với cấp trên.' } ] },
    { id: 'L3', title: '3. Năng lực lãnh đạo, quản lý, chuyên môn; thái độ; đổi mới sáng tạo', max: 16, items: [
      { id: '3.1', max: 4, text: 'Năng lực lãnh đạo, quản lý: tư duy hoạch định, tầm nhìn; tổng hợp, phân tích, dự báo; chỉ đạo, điều hành, giữ kỷ cương.' },
      { id: '3.2', max: 3, text: 'Năng lực chuyên môn, nghiệp vụ theo vị trí việc làm: kiến thức chuyên sâu, phát hiện vấn đề mới, xử lý độc lập.' },
      { id: '3.3', max: 2, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (thường xuyên và đột xuất).' },
      { id: '3.4', max: 3, text: 'Thái độ công tác: trách nhiệm cao, đúng mực, lề lối hành chính chuyên nghiệp, phối hợp hiệu quả.' },
      { id: '3.5', max: 4, text: 'Đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm; có sáng kiến, giải pháp đột phá, quyết đoán.' } ] },
    { id: 'L4', title: '4. Về mức độ tín nhiệm, uy tín và khả năng quy tụ đoàn kết', max: 2, items: [
      { id: '4.1', max: 1, text: 'Có uy tín trong nội bộ, gương mẫu, gắn bó mật thiết với Nhân dân; được tín nhiệm cao.' },
      { id: '4.2', max: 1, text: 'Có khả năng quy tụ, đoàn kết nội bộ; xây dựng tập thể vững mạnh.' } ] },
    { id: 'L5', title: '5. Về tự phê bình và phê bình, tự soi, tự sửa', max: 2, items: [
      { id: '5.1', max: 1, text: 'Tinh thần tự phê bình, tự soi, tự sửa; chủ động nhận diện thiếu sót trong lãnh đạo, chỉ đạo.' },
      { id: '5.2', max: 1, text: 'Kết quả khắc phục hạn chế, khuyết điểm đã được chỉ ra của bản thân và trong phạm vi lãnh đạo.' } ] },
  ] },
  staff: { label: 'Công chức, viên chức không lãnh đạo', mau: 'Mẫu số 03', formula: '(a+b+c)/3', groups: [
    { id: 'S1', title: '1. Về chính trị, phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 15, items: [
      { id: '1.1', max: 2, text: 'Có quan điểm, bản lĩnh chính trị vững vàng; kiên định lập trường; nghiên cứu, vận dụng chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh.' },
      { id: '1.2', max: 2, text: 'Thực hiện nghiêm nguyên tắc tổ chức của Đảng; chấp hành pháp luật; nghiêm kỷ luật phát ngôn, bảo vệ bí mật nhà nước.' },
      { id: '1.3', max: 2, text: 'Giữ gìn phẩm chất đạo đức, lối sống trong sáng; phòng, chống tham nhũng, tiêu cực; không suy thoái.' },
      { id: '1.4', max: 2, text: 'Có ý thức tổ chức kỷ luật, tinh thần trách nhiệm; chấp hành phân công; thực hiện quy chế, nội quy.' },
      { id: '1.5', max: 2, text: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định.' },
      { id: '1.6', max: 2, text: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác về thực hiện nhiệm vụ với cấp trên.' },
      { id: '1.7', max: 2, text: 'Giữ gìn đoàn kết nội bộ; quan hệ tốt với đồng nghiệp; tham gia xây dựng tổ chức đảng, đoàn thể.' },
      { id: '1.8', max: 1, text: 'Gần gũi, sâu sát với cơ sở; giữ mối liên hệ với cấp ủy và Nhân dân nơi cư trú.' } ] },
    { id: 'S2', title: '2. Năng lực chuyên môn; khả năng thực thi; thái độ; đổi mới sáng tạo', max: 10, items: [
      { id: '2.1', max: 3, text: 'Năng lực chuyên môn theo vị trí việc làm: cập nhật kiến thức, xử lý độc lập, ứng dụng CNTT - chuyển đổi số.' },
      { id: '2.2', max: 2, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (thường xuyên và đột xuất).' },
      { id: '2.3', max: 2, text: 'Thái độ công tác: trách nhiệm, tích cực; đúng mực, lề lối hành chính chuyên nghiệp.' },
      { id: '2.4', max: 3, text: 'Đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm; có sản phẩm, giải pháp đột phá.' } ] },
    { id: 'S3', title: '3. Về tự phê bình và phê bình, khắc phục hạn chế', max: 5, items: [
      { id: '3.1', max: 5, text: 'Tinh thần tự phê bình, tự soi, tự sửa; tự giác nhận diện hạn chế và kết quả khắc phục hạn chế đã được chỉ ra.' } ] },
  ] },
  contract: { label: 'Lao động hợp đồng hỗ trợ, phục vụ', mau: 'Mẫu số 04', formula: '(a+b+c)/3', groups: [
    { id: 'C1', title: '1. Về chính trị, phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 15, items: [
      { id: '1.1', max: 3, text: 'Chấp hành chủ trương, đường lối của Đảng, chính sách, pháp luật và nguyên tắc tổ chức kỷ luật.' },
      { id: '1.2', max: 3, text: 'Gương mẫu về đạo đức, lối sống; không tham ô, lãng phí; không suy thoái về đạo đức, lối sống.' },
      { id: '1.3', max: 3, text: 'Tác phong, lề lối làm việc chuẩn mực, tận tụy, trung thực, năng động; phương pháp khoa học, dân chủ.' },
      { id: '1.4', max: 3, text: 'Chấp hành phân công, chỉ đạo; sẵn sàng nhận nhiệm vụ; thực hiện tốt quy chế, nội quy cơ quan.' },
      { id: '1.5', max: 3, text: 'Thực hiện quy tắc ứng xử của cán bộ, công chức, viên chức, lao động hợp đồng trong cơ quan.' } ] },
    { id: 'C2', title: '2. Năng lực chuyên môn; khả năng thực thi; thái độ; đổi mới sáng tạo', max: 10, items: [
      { id: '2.1', max: 3, text: 'Chủ động nghiên cứu, cập nhật kịp thời kiến thức pháp luật và chuyên môn để tham mưu có chất lượng.' },
      { id: '2.2', max: 3, text: 'Xây dựng kế hoạch công tác cá nhân theo quy định.' },
      { id: '2.3', max: 2, text: 'Nắm vững quy chế, quy trình tác nghiệp theo yêu cầu nhiệm vụ được giao.' },
      { id: '2.4', max: 2, text: 'Sử dụng thành thạo phương tiện, thiết bị kỹ thuật phục vụ nhiệm vụ, bảo đảm an toàn, hiệu quả.' } ] },
    { id: 'C3', title: '3. Về tự phê bình và phê bình, khắc phục hạn chế', max: 5, items: [
      { id: '3.1', max: 5, text: 'Tinh thần tự phê bình, tự soi, tự sửa; tự giác nhận diện hạn chế và kết quả khắc phục hạn chế đã được chỉ ra.' } ] },
  ] },
};

const DIGITAL = [
  { id: 1, name: 'Nhận thức số và tư duy chuyển đổi số' },
  { id: 2, name: 'Khai thác dữ liệu và thông tin' },
  { id: 3, name: 'Giao tiếp, hợp tác, thực thi công vụ trên môi trường số' },
  { id: 4, name: 'Sáng tạo nội dung số và tự động hóa công việc' },
  { id: 5, name: 'An toàn thông tin, bảo mật dữ liệu và AI có trách nhiệm', mandatory: true },
  { id: 6, name: 'Giải quyết vấn đề và cải tiến quy trình bằng công nghệ số' },
  { id: 7, name: 'Khai thác hệ thống thông tin, nền tảng số dùng chung' },
  { id: 8, name: 'Lãnh đạo số và quản trị thay đổi' },
];
const LEVELS = [{ v: 0, s: 'Chưa' }, { v: 1, s: 'Mức 1' }, { v: 2, s: 'Mức 2' }, { v: 3, s: 'Mức 3' }, { v: 4, s: 'Mức 4' }];
const MIN_DIGITAL = { leader: 3, staff: 2, contract: 1 };

function classify(t) {
  if (t >= 90) return { code: 'A', name: 'Hoàn thành xuất sắc nhiệm vụ', cls: 'bg-emerald-500', ring: 'text-emerald-600', soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
  if (t >= 70) return { code: 'B', name: 'Hoàn thành tốt nhiệm vụ', cls: 'bg-sky-500', ring: 'text-sky-600', soft: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-500' };
  if (t >= 50) return { code: 'C', name: 'Hoàn thành nhiệm vụ', cls: 'bg-amber-500', ring: 'text-amber-600', soft: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
  return { code: 'D', name: 'Không hoàn thành nhiệm vụ', cls: 'bg-rose-500', ring: 'text-rose-600', soft: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500' };
}
function statusOf(p) {
  if (p >= 90) return { label: 'Đúng tiến độ', dot: 'bg-emerald-500', txt: 'text-emerald-600', soft: 'bg-emerald-50' };
  if (p >= 70) return { label: 'Cần chú ý', dot: 'bg-amber-500', txt: 'text-amber-600', soft: 'bg-amber-50' };
  return { label: 'Chậm / rủi ro', dot: 'bg-rose-500', txt: 'text-rose-600', soft: 'bg-rose-50' };
}
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const taskScore = (t) => (Number(t.qty) + Number(t.quality) + Number(t.progress)) / 3;
function aggKpi(tasks) {
  const valid = tasks.filter((t) => Number(t.weight) > 0);
  const tw = valid.reduce((s, t) => s + Number(t.weight || 0), 0);
  if (tw === 0) return { a: 0, b: 0, c: 0, val: 0 };
  const a = valid.reduce((s, t) => s + t.weight * Number(t.qty), 0) / tw;
  const b = valid.reduce((s, t) => s + t.weight * Number(t.quality), 0) / tw;
  const c = valid.reduce((s, t) => s + t.weight * Number(t.progress), 0) / tw;
  return { a, b, c, val: (a + b + c) / 3 };
}
function computePerson(p) {
  const cfg = CRITERIA[p.type];
  let nself = 0, nmgr = 0;
  cfg.groups.forEach((g) => g.items.forEach((it) => {
    const sv = p.selfScores[it.id] ?? it.max;
    nself += sv; nmgr += p.mgrScores[it.id] ?? sv;
  }));
  nself = Math.min(nself, 30); nmgr = Math.min(nmgr, 30);
  const k = aggKpi(p.tasks);
  const nhomII = (k.val / 100) * 70;
  const ded = Number(p.deduction || 0);
  return { nself, nmgr, k, nhomII, totalSelf: clamp(nself + nhomII - ded), totalMgr: clamp(nmgr + nhomII - ded) };
}
let pid = 3, tid = 100;
const newTask = () => ({ id: tid++, name: '', objId: '', weight: 1, qty: 100, quality: 100, progress: 100, weeks: [0, 0, 0, 0], note: '' });
const newPerson = (name, type) => ({ id: pid++, name, position: '', type, selfScores: {}, mgrScores: {}, deduction: 0, tasks: [newTask(), newTask()], digital: {}, selfNote: '', mgrNote: '' });

export default function App() {
  const [tab, setTab] = useState('dash');
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const [unit] = useState('Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa');
  const [objectives, setObjectives] = useState([
    { id: 'o1', title: 'Nâng cao chất lượng tham mưu xây dựng, ban hành nghị quyết HĐND tỉnh', source: 'NQ 66-NQ/TW' },
    { id: 'o2', title: 'Đẩy mạnh chuyển đổi số, ứng dụng AI trong công tác Văn phòng', source: 'NQ 57-NQ/TW' },
    { id: 'o3', title: 'Phục vụ hiệu quả kỳ họp và hoạt động giám sát của HĐND tỉnh', source: 'Chương trình công tác' },
  ]);
  const [people, setPeople] = useState([
    { ...newPerson('Nguyễn Văn A', 'leader'), position: 'Phó Chánh Văn phòng' },
    { ...newPerson('Trần Thị B', 'staff'), position: 'Chuyên viên' },
  ]);
  const [curId, setCurId] = useState(people[0].id);
  const [open, setOpen] = useState(null);
  const [cloud, setCloud] = useState({ ready: false, saving: false });
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        if (s.people?.length) {
          setPeople(s.people); setCurId(s.people[0].id);
          pid = Math.max(pid, ...s.people.map((p) => p.id || 0)) + 1;
          tid = Math.max(tid, ...s.people.flatMap((p) => (p.tasks || []).map((t) => t.id || 0))) + 1;
        }
        if (s.objectives) setObjectives(s.objectives);
        if (s.period) setPeriod(s.period);
      }
      setCloud({ ready: !!supabase, saving: false });
      loaded.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    setCloud((c) => ({ ...c, saving: true }));
    const t = setTimeout(async () => {
      await saveState({ people, objectives, period });
      setCloud((c) => ({ ...c, saving: false }));
    }, 900);
    return () => clearTimeout(t);
  }, [people, objectives, period]);

  const handleManualSave = async () => {
    setCloud((c) => ({ ...c, saving: true }));
    await saveState({ people, objectives, period });
    setCloud((c) => ({ ...c, saving: false }));
  };

  const cur = people.find((p) => p.id === curId) || people[0];
  const upPerson = (id, patch) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const upCur = (patch) => upPerson(curId, patch);
  const upTask = (taskId, patch) => upCur({ tasks: cur.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });

  const computed = useMemo(() => people.map((p) => ({ p, c: computePerson(p) })), [people]);
  const curC = computed.find((x) => x.p.id === curId)?.c || computePerson(cur);
  const dist = useMemo(() => { const d = { A: 0, B: 0, C: 0, D: 0 }; computed.forEach(({ c }) => d[classify(c.totalMgr).code]++); return d; }, [computed]);
  const avg = computed.length ? computed.reduce((s, x) => s + x.c.totalMgr, 0) / computed.length : 0;
  const overCap = dist.A > Math.floor(dist.B * 0.2);
  const objProgress = (oid) => {
    const ts = people.flatMap((p) => p.tasks).filter((t) => t.objId === oid && Number(t.weight) > 0);
    if (!ts.length) return null;
    return ts.reduce((s, t) => s + taskScore(t), 0) / ts.length;
  };

  const tabs = [
    { id: 'dash', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'eval', label: 'Đánh giá', icon: BarChart3 },
    { id: 'digital', label: 'Năng lực số', icon: Cpu },
    { id: 'guide', label: 'Hướng dẫn', icon: BookOpen },
  ];
  const cfg = CRITERIA[cur.type];
  const result = classify(curC.totalMgr);
  const minLv = MIN_DIGITAL[cur.type];
  const digPassed = DIGITAL.filter((d) => (cur.digital[d.id] || 0) >= minLv).length;

  const doExcel = () => exportExcel1A(
    computed.map(({ p, c }) => ({ name: p.name || '(Chưa tên)', position: p.position || CRITERIA[p.type].label, self: c.totalSelf.toFixed(1), mgr: c.totalMgr.toFixed(1), cls: classify(c.totalMgr).code })),
    period, unit
  );
  const doWord = () => exportWordPhieu({ unit, name: cur.name, position: cur.position, typeLabel: CRITERIA[cur.type].label, month: period.month, year: period.year, nhomI: curC.nmgr.toFixed(2), nhomII: curC.nhomII.toFixed(2), kpi: curC.k.val.toFixed(1), deduction: Number(cur.deduction || 0).toFixed(2), total: curC.totalMgr.toFixed(2), cls: result.code, clsName: result.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-lg ring-4 ring-amber-300/30"><Award className="w-7 h-7 text-red-900" /></div>
            <div>
              <p className="text-amber-300 text-xs font-medium tracking-widest uppercase">Hệ thống quản trị OKR/KPI</p>
              <h1 className="text-base sm:text-xl font-bold leading-tight">Đánh giá, xếp loại cán bộ, công chức hằng tháng</h1>
              <p className="text-red-100 text-xs sm:text-sm mt-0.5">{unit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${cloud.ready ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-500/20 text-amber-100'}`}>
              {cloud.ready ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
              {cloud.ready ? (cloud.saving ? 'Đang lưu...' : 'Đã kết nối cloud') : 'Chạy cục bộ'}
            </span>
            <button onClick={handleManualSave} disabled={cloud.saving} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors disabled:opacity-50 border border-blue-500/50">
              <Save className="w-3.5 h-3.5" /> Lưu ngay
            </button>
            <div className="flex items-center gap-2 bg-red-950/40 rounded-xl px-3 py-2 border border-red-600/30">
              <CalendarDays className="w-4 h-4 text-amber-300" />
              <input type="number" min="1" max="12" value={period.month} onChange={(e) => setPeriod({ ...period, month: e.target.value })} className="w-11 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
              <span className="text-red-200">/</span>
              <input type="number" value={period.year} onChange={(e) => setPeriod({ ...period, year: e.target.value })} className="w-16 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
            </div>
          </div>
        </div>
        <div className="bg-red-950/40 backdrop-blur border-t border-red-600/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {tabs.map((t) => { const Ic = t.icon; const on = tab === t.id;
              return (<button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-[3px] ${on ? 'border-amber-400 text-white' : 'border-transparent text-red-200 hover:text-white'}`}><Ic className="w-4 h-4" />{t.label}</button>); })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'dash' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat icon={Users} label="Tổng số cán bộ" value={people.length} color="slate" />
              <Stat icon={TrendingUp} label="Điểm TB cơ quan" value={avg.toFixed(1)} color="red" />
              <Stat icon={Award} label="Hoàn thành xuất sắc" value={dist.A} color="emerald" />
              <Stat icon={Target} label="Mục tiêu (OKR)" value={objectives.length} color="amber" />
            </div>
            {overCap && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">Cảnh báo trần tỷ lệ: đang có <b>{dist.A}</b> "Hoàn thành xuất sắc" trong khi tối đa cho phép là <b>{Math.floor(dist.B * 0.2)}</b> (không vượt quá 20% của {dist.B} người "Hoàn thành tốt").</p>
              </div>
            )}
            <div className="grid lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Mục tiêu cấp Văn phòng (OKR)</h2></div>
                <div className="p-4 space-y-3">
                  {objectives.map((o) => { const pr = objProgress(o.id); const linked = people.flatMap((p) => p.tasks).filter((t) => t.objId === o.id).length;
                    return (
                      <div key={o.id} className="border border-slate-200 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <input value={o.title} onChange={(e) => setObjectives((os) => os.map((x) => (x.id === o.id ? { ...x, title: e.target.value } : x)))} className="w-full font-semibold text-sm text-slate-800 bg-transparent outline-none focus:bg-slate-50 rounded px-1 -ml-1" />
                            <div className="flex items-center gap-2 mt-1"><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{o.source}</span><span className="text-[11px] text-slate-400 flex items-center gap-1"><Link2 className="w-3 h-3" /> {linked} nhiệm vụ</span></div>
                          </div>
                          <button onClick={() => setObjectives((os) => os.filter((x) => x.id !== o.id))} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="mt-2 flex items-center gap-3"><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pr === null ? 'bg-slate-200' : statusOf(pr).dot} transition-all`} style={{ width: `${pr || 0}%` }} /></div><span className="text-xs font-bold text-slate-600 w-20 text-right">{pr === null ? 'Chưa có' : `${pr.toFixed(0)}%`}</span></div>
                      </div>
                    ); })}
                  <button onClick={() => setObjectives((os) => [...os, { id: 'o' + Date.now(), title: 'Mục tiêu mới...', source: 'Chương trình công tác' }])} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm mục tiêu</button>
                </div>
              </section>
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><BarChart3 className="w-5 h-5 text-red-700" /> Phân bố xếp loại</h2>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((code) => { const cl = classify(code === 'A' ? 95 : code === 'B' ? 80 : code === 'C' ? 60 : 40); const n = dist[code]; const pct = people.length ? (n / people.length) * 100 : 0;
                    return (<div key={code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">Loại {code} — {cl.name}</span><span className="font-bold text-slate-700">{n}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cl.bar} transition-all`} style={{ width: `${pct}%` }} /></div></div>); })}
                </div>
              </section>
            </div>
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Tổng hợp kết quả (Mẫu 1A)</h2>
                <div className="flex gap-2">
                  <button onClick={doExcel} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><FileSpreadsheet className="w-3.5 h-3.5" /> Excel</button>
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><Printer className="w-3.5 h-3.5" /> In</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Chức vụ</th><th className="text-center px-3 py-2.5 font-semibold">Tự ĐG</th><th className="text-center px-3 py-2.5 font-semibold">Cấp thẩm quyền</th><th className="text-center px-3 py-2.5 font-semibold">Xếp loại</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {computed.map(({ p, c }) => { const r = classify(c.totalMgr);
                      return (<tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setCurId(p.id); setTab('eval'); }}><td className="px-4 py-3 font-semibold text-slate-700">{p.name || '(Chưa đặt tên)'}</td><td className="px-3 py-3 text-slate-500 text-xs">{p.position || CRITERIA[p.type].label}</td><td className="px-3 py-3 text-center text-slate-500">{c.totalSelf.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{c.totalMgr.toFixed(1)}</td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${r.soft}`}><span className={`w-5 h-5 rounded-full ${r.cls} text-white flex items-center justify-center text-[10px]`}>{r.code}</span></span></td></tr>); })}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-100"><AddPerson onAdd={(name, type) => setPeople((ps) => [...ps, newPerson(name, type)])} /></div>
            </section>
          </div>
        )}

        {tab === 'eval' && (
          <div className="space-y-5">
            <PersonChips people={people} curId={curId} setCurId={setCurId} onDelete={(id) => { if (people.length > 1) { setPeople((ps) => ps.filter((p) => p.id !== id)); if (curId === id) setCurId(people.find((p) => p.id !== id).id); } }} onAdd={(name, type) => { const np = newPerson(name, type); setPeople((ps) => [...ps, np]); setCurId(np.id); }} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><User className="w-5 h-5 text-red-700" /> Thông tin người được đánh giá</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Họ và tên"><input value={cur.name} onChange={(e) => upCur({ name: e.target.value })} className="inp" /></Field>
                    <Field label="Chức vụ / Vị trí việc làm"><input value={cur.position} onChange={(e) => upCur({ position: e.target.value })} placeholder="VD: Chuyên viên" className="inp" /></Field>
                  </div>
                  <Field label="Nhóm đối tượng đánh giá" className="mt-3">
                    <div className="grid sm:grid-cols-3 gap-2">
                      {Object.entries(CRITERIA).map(([k, v]) => (<button key={k} onClick={() => upCur({ type: k, selfScores: {}, mgrScores: {} })} className={`text-left p-3 rounded-xl border-2 transition-all ${cur.type === k ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}><span className={`text-[11px] font-bold ${cur.type === k ? 'text-red-700' : 'text-slate-400'}`}>{v.mau}</span><p className="text-xs font-medium text-slate-700 leading-snug mt-0.5">{v.label}</p></button>))}
                    </div>
                  </Field>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Nhóm I — Tiêu chí chung</h2><div className="flex items-center gap-3 text-sm"><span className="text-slate-300">Tự: <b className="text-white">{curC.nself.toFixed(1)}</b></span><span className="text-amber-300 font-bold">Duyệt: {curC.nmgr.toFixed(1)}/30</span></div></div>
                  <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-2"><span className="w-16 text-center">TỰ ĐG</span><span className="w-16 text-center text-red-600">CẤP DUYỆT</span></div>
                  <div className="p-4 pt-2 space-y-4">
                    {cfg.groups.map((g) => { const sub = g.items.reduce((s, it) => s + (cur.mgrScores[it.id] ?? cur.selfScores[it.id] ?? it.max), 0);
                      return (<div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden"><div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">{g.title}</p><span className="shrink-0 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{sub.toFixed(1)}/{g.max}</span></div>
                        <div className="divide-y divide-slate-100">{g.items.map((it) => { const sv = cur.selfScores[it.id] ?? it.max; const mv = cur.mgrScores[it.id] ?? sv;
                          return (<div key={it.id} className="px-4 py-3"><div className="flex items-start gap-3"><span className="shrink-0 text-xs font-bold text-slate-400 w-7 pt-1.5">{it.id}</span><button onClick={() => setOpen(open === it.id ? null : it.id)} className="flex-1 text-left text-sm text-slate-600 hover:text-slate-900 flex items-start gap-1 pt-1"><span className={open === it.id ? '' : 'line-clamp-1'}>{it.text}</span><ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 mt-0.5 transition-transform ${open === it.id ? 'rotate-180' : ''}`} /></button><div className="shrink-0 flex gap-2"><input type="number" min="0" max={it.max} step="0.25" value={sv} onChange={(e) => upCur({ selfScores: { ...cur.selfScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm outline-none focus:border-slate-400" /><input type="number" min="0" max={it.max} step="0.25" value={mv} onChange={(e) => upCur({ mgrScores: { ...cur.mgrScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg py-1 text-sm outline-none focus:border-red-400" /></div></div>{open === it.id && <p className="mt-2 ml-10 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">Điểm tối đa: {it.max}. {it.text}</p>}</div>); })}</div>
                      </div>); })}
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Nhóm II — Kết quả thực hiện nhiệm vụ (KPI)</h2><span className="text-amber-300 font-bold text-sm">{curC.nhomII.toFixed(2)} / 70</span></div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500 mb-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Liên kết mỗi nhiệm vụ với mục tiêu (OKR). Trạng thái màu tự động theo tiến độ. KPI quy đổi = trung bình {cfg.formula} theo trọng số × 70%.</p>
                    <div className="space-y-3">{cur.tasks.map((t, i) => { const sc = taskScore(t); const st = statusOf(sc);
                      return (<div key={t.id} className={`border rounded-xl p-3 ${st.soft} border-slate-200`}><div className="flex items-center gap-2 mb-2"><span className={`shrink-0 w-2.5 h-2.5 rounded-full ${st.dot}`} title={st.label} /><input value={t.name} onChange={(e) => upTask(t.id, { name: e.target.value })} placeholder={`Nhiệm vụ / sản phẩm ${i + 1}...`} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400" /><span className={`shrink-0 text-[11px] font-bold ${st.txt}`}>{sc.toFixed(0)}%</span>{cur.tasks.length > 1 && <button onClick={() => upCur({ tasks: cur.tasks.filter((x) => x.id !== t.id) })} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                        <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={t.objId} onChange={(e) => upTask(t.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-red-400"><option value="">— Liên kết mục tiêu (OKR) —</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><MiniNum label="Trọng số" value={t.weight} step={0.5} onChange={(v) => upTask(t.id, { weight: v })} /><MiniNum label="Số lượng %" value={t.qty} max={100} onChange={(v) => upTask(t.id, { qty: v })} /><MiniNum label="Chất lượng %" value={t.quality} max={100} onChange={(v) => upTask(t.id, { quality: v })} /><MiniNum label="Tiến độ %" value={t.progress} max={100} onChange={(v) => upTask(t.id, { progress: v })} /></div>
                        <div className="mt-2 flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Check-in tuần:</span>{t.weeks.map((w, wi) => (<input key={wi} type="number" min="0" max="100" value={w} onChange={(e) => { const nw = [...t.weeks]; nw[wi] = clamp(Number(e.target.value)); upTask(t.id, { weeks: nw }); }} className="w-12 bg-white border border-slate-200 rounded px-1 py-1 text-[11px] text-center text-slate-600 outline-none focus:border-red-400" />))}</div>
                        <div className="mt-2"><input value={t.note || ''} onChange={(e) => upTask(t.id, { note: e.target.value })} placeholder="Nhận xét, khó khăn, kiến nghị..." className="w-full bg-white/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-red-400 transition-colors" /></div>
                      </div>); })}</div>
                    <button onClick={() => upCur({ tasks: [...cur.tasks, newTask()] })} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">{[['Số lượng (a)', curC.k.a], ['Chất lượng (b)', curC.k.b], ['Tiến độ (c)', curC.k.c]].map(([l, v]) => (<div key={l} className="bg-slate-50 rounded-lg py-2 border border-slate-100"><p className="text-[11px] text-slate-500">{l}</p><p className="font-bold text-slate-700">{Number(v).toFixed(1)}%</p></div>))}</div>
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <div><h2 className="flex items-center gap-2 font-bold text-slate-800 mb-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> Điểm trừ</h2><div className="flex items-center gap-3"><input type="number" min="0" value={cur.deduction} onChange={(e) => upCur({ deduction: e.target.value })} className="inp w-32" /><span className="text-sm text-slate-500">điểm — theo mức độ vi phạm.</span></div></div>
                  <Field label="Ý kiến tự nhận xét của cá nhân"><textarea value={cur.selfNote} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className="inp" /></Field>
                  <Field label="Nhận xét, kết luận của cấp có thẩm quyền"><textarea value={cur.mgrNote} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className="inp" /></Field>
                </section>
              </div>
              <aside className="lg:col-span-1"><div className="lg:sticky lg:top-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <div className={`${result.cls} text-white text-center py-5`}><p className="text-xs opacity-90 uppercase tracking-wider">Tổng điểm (cấp duyệt)</p><p className="text-5xl font-extrabold mt-1">{curC.totalMgr.toFixed(2)}</p><p className="text-sm opacity-90">Tự đánh giá: {curC.totalSelf.toFixed(2)} / 100</p></div>
                  <div className="p-4 text-center border-b border-slate-100"><span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm ${result.soft}`}><span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center font-extrabold">{result.code}</span>{result.name}</span></div>
                  <div className="p-4 space-y-2.5 text-sm"><SumRow label="Nhóm I — Tiêu chí chung" value={`${curC.nmgr.toFixed(2)} / 30`} /><SumRow label="Điểm KPI quy đổi" value={`${curC.k.val.toFixed(1)}%`} /><SumRow label="Nhóm II — Kết quả (× 70%)" value={`${curC.nhomII.toFixed(2)} / 70`} /><SumRow label="Điểm trừ" value={`− ${Number(cur.deduction || 0).toFixed(2)}`} danger /><div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-800"><span>Tổng cộng</span><span className={result.ring}>{curC.totalMgr.toFixed(2)}</span></div></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-2">
                  <button onClick={doWord} className="w-full flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất phiếu Word</button>
                  <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In phiếu (PDF)</button>
                  <button onClick={() => upCur({ selfScores: {}, mgrScores: {}, deduction: 0, tasks: [newTask(), newTask()], selfNote: '', mgrNote: '' })} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl"><RotateCcw className="w-4 h-4" /> Đặt lại cán bộ này</button>
                </div>
              </div></aside>
            </div>
          </div>
        )}

        {tab === 'digital' && (
          <div className="space-y-5">
            <PersonChips people={people} curId={curId} setCurId={setCurId} onDelete={() => {}} onAdd={(name, type) => { const np = newPerson(name, type); setPeople((ps) => [...ps, np]); setCurId(np.id); }} hideDelete />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5"><h2 className="flex items-center gap-2 font-bold text-slate-800"><Cpu className="w-5 h-5 text-red-700" /> Tự đánh giá Khung năng lực số</h2><p className="text-sm text-slate-500 mt-1">Mức chuẩn tối thiểu cho <b>{CRITERIA[cur.type].label}</b>: <b className="text-red-700">Mức {minLv}</b>. Kết quả là chỉ số phụ trợ, không cộng vào điểm tháng.</p></section>
                {DIGITAL.map((d) => { const lv = cur.digital[d.id] || 0; const ok = lv >= minLv;
                  return (<div key={d.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"><div className="flex items-start gap-3"><span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{d.id}</span><div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-slate-800 text-sm">{d.name}</p>{d.mandatory && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">BẮT BUỘC</span>}{lv > 0 && (ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />)}</div><div className="flex flex-wrap gap-1.5 mt-2.5">{LEVELS.map((L) => (<button key={L.v} onClick={() => upCur({ digital: { ...cur.digital, [d.id]: L.v } })} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${lv === L.v ? (L.v >= minLv ? 'bg-emerald-600 text-white border-emerald-600' : L.v === 0 ? 'bg-slate-500 text-white border-slate-500' : 'bg-amber-500 text-white border-amber-500') : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{L.s}</button>))}</div></div></div></div>); })}
              </div>
              <aside className="lg:col-span-1"><div className="lg:sticky lg:top-4 space-y-4"><div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 text-center"><p className="text-xs text-slate-500 uppercase tracking-wider">Đạt chuẩn tối thiểu</p><p className="text-5xl font-extrabold text-red-700 mt-1">{digPassed}<span className="text-2xl text-slate-300">/8</span></p><div className="mt-3 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-600 to-amber-400 transition-all" style={{ width: `${(digPassed / 8) * 100}%` }} /></div><p className="text-sm font-semibold text-slate-600 mt-2">{Math.round((digPassed / 8) * 100)}% nhóm năng lực đạt chuẩn</p></div></div></aside>
            </div>
          </div>
        )}

        {tab === 'guide' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-3xl mx-auto">
            <div><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-6 h-6 text-red-700" /> Hướng dẫn & phương pháp</h2></div>
            <GB icon={TrendingUp} title="Thang điểm tổng (100 điểm)"><p><b>Tổng = Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ.</b> Nhóm II = Điểm KPI quy đổi × 70%.</p></GB>
            <GB icon={Target} title="Liên kết OKR và KPI"><p>Mục tiêu (OKR) cấp Văn phòng gắn Nghị quyết, chương trình công tác. Mỗi nhiệm vụ KPI cá nhân liên kết lên một mục tiêu. Tiến độ mục tiêu = trung bình tiến độ các nhiệm vụ liên kết.</p></GB>
            <GB icon={Activity} title="Trạng thái & check-in tuần"><p><b className="text-emerald-600">Xanh ≥90%</b> (đúng tiến độ), <b className="text-amber-600">Vàng 70–90%</b> (cần chú ý), <b className="text-rose-600">Đỏ &lt;70%</b> (chậm/rủi ro).</p></GB>
            <GB icon={Award} title="Bốn mức xếp loại"><div className="grid sm:grid-cols-2 gap-2">{[['A', '≥ 90', 'Hoàn thành xuất sắc', 'emerald'], ['B', '70 → <90', 'Hoàn thành tốt', 'sky'], ['C', '50 → <70', 'Hoàn thành nhiệm vụ', 'amber'], ['D', '< 50', 'Không hoàn thành', 'rose']].map(([c, r, n, col]) => (<div key={c} className={`flex items-center gap-3 p-3 rounded-xl border bg-${col}-50 border-${col}-200`}><span className={`w-9 h-9 rounded-full bg-${col}-500 text-white font-extrabold flex items-center justify-center`}>{c}</span><div><p className={`font-bold text-${col}-700 text-sm`}>{n}</p><p className="text-xs text-slate-500">{r} điểm</p></div></div>))}</div></GB>
            <GB icon={CalendarDays} title="Quy trình 2 cấp & mốc thời gian"><ol className="list-decimal pl-5 space-y-1"><li>Trước ngày 25: cán bộ tự đánh giá (cột Tự ĐG).</li><li>Trước ngày 26: cấp có thẩm quyền cho ý kiến.</li><li>Trước ngày 28: cấp có thẩm quyền quyết định xếp loại (cột Cấp duyệt).</li><li>Trước ngày 05 tháng sau: công khai, biểu dương.</li></ol></GB>
            <GB icon={Cloud} title="Kiến trúc hệ thống">
              <div className="space-y-3">
                <p>Hệ thống được thiết kế theo mô hình <b>Serverless SPA (Single Page Application)</b>, vận hành hoàn toàn trên trình duyệt:</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-center"><p className="font-bold text-slate-700 text-xs mb-1">Frontend (Client)</p><p className="text-[11px] text-slate-500 leading-snug">React + Vite + Tailwind CSS. Đóng gói toàn bộ giao diện, tính toán logic và kết xuất báo cáo (Excel, Word, PDF) phía client.</p></div>
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-emerald-50 text-center"><p className="font-bold text-slate-700 text-xs mb-1">Backend (BaaS)</p><p className="text-[11px] text-slate-500 leading-snug">Supabase (PostgreSQL). Cung cấp cơ sở dữ liệu lưu trữ lâu dài và API tự động; đồng bộ dữ liệu thời gian thực.</p></div>
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-sky-50 text-center"><p className="font-bold text-slate-700 text-xs mb-1">Hosting (Triển khai)</p><p className="text-[11px] text-slate-500 leading-snug">Vercel (Cloud) hoặc Web Server nội bộ. Tích hợp CI/CD tự động build từ mã nguồn trên GitHub.</p></div>
                </div>
                <p>Trạng thái (State) được ưu tiên xử lý trên <b>Local Storage</b> và lưu ngầm (background sync) lên <b>Supabase</b> giúp ứng dụng siêu nhẹ, phản hồi tức thời mà không bị gián đoạn mạng.</p>
              </div>
            </GB>
            <GB icon={ShieldCheck} title="Hướng dẫn triển khai (Dành cho Quản trị viên)">
              <ol className="list-decimal pl-5 space-y-1">
                <li><b>Khởi tạo Cơ sở dữ liệu:</b> Đăng ký Supabase, tạo project. Chạy script <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">supabase/schema.sql</code> trong SQL Editor. Lấy <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">Project URL</code> và <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">anon public key</code>.</li>
                <li><b>Quản lý Mã nguồn:</b> Đẩy mã nguồn lên kho lưu trữ GitHub (khuyên dùng Private repo).</li>
                <li><b>Triển khai qua Cloud (Vercel):</b> Tạo project mới trên Vercel, chọn nguồn từ repo GitHub, chọn framework Vite. Bổ sung biến môi trường <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_URL</code> và <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_ANON_KEY</code>.</li>
                <li><b>Triển khai On-premise (Máy chủ nội bộ):</b> Chạy lệnh <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">npm install</code>, tạo file <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">.env</code> chứa các key, tiếp tục chạy <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">npm run build</code>. Cuối cùng, đưa nội dung thư mục <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">dist</code> lên Apache hoặc Nginx.</li>
              </ol>
            </GB>
          </div>
        )}
      </main>
      <footer className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400">Công cụ hỗ trợ quản trị nội bộ • OKR/KPI & Khung năng lực số</footer>
      <style>{`.inp{width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:.6rem;padding:.5rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#f87171;box-shadow:0 0 0 3px rgba(254,202,202,.5)}textarea.inp{resize:vertical}@media print{aside,header>div:last-child,button{display:none!important}}`}</style>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  const map = { slate: 'bg-slate-100 text-slate-600', red: 'bg-red-100 text-red-700', emerald: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700' };
  return (<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center gap-3"><div className={`w-11 h-11 rounded-xl flex items-center justify-center ${map[color]}`}><Icon className="w-5 h-5" /></div><div><p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p><p className="text-xs text-slate-500 mt-1">{label}</p></div></div>);
}
function Field({ label, children, className = '' }) { return (<label className={`block ${className}`}><span className="text-xs font-semibold text-slate-500 mb-1 block">{label}</span>{children}</label>); }
function SumRow({ label, value, danger }) { return (<div className="flex justify-between items-center"><span className="text-slate-500 text-xs">{label}</span><span className={`font-semibold ${danger ? 'text-rose-600' : 'text-slate-700'}`}>{value}</span></div>); }
function MiniNum({ label, value, onChange, max, min = 0, step = 1 }) {
  return (<label className="block"><span className="text-[10px] font-semibold text-slate-400 block mb-0.5">{label}</span><input type="number" min={min} max={max} step={step} value={value} onChange={(e) => { let v = Number(e.target.value); if (max !== undefined) v = Math.min(max, v); onChange(Math.max(min, v)); }} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-semibold text-slate-700 outline-none focus:border-red-400" /></label>);
}
function GB({ icon: Icon, title, children }) { return (<div><h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Icon className="w-5 h-5 text-red-700" /> {title}</h3><div className="text-sm text-slate-600 space-y-2 leading-relaxed">{children}</div></div>); }
function AddPerson({ onAdd }) {
  const [name, setName] = useState(''); const [type, setType] = useState('staff');
  return (<div className="flex flex-col sm:flex-row gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ tên cán bộ mới..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400" /><select value={type} onChange={(e) => setType(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-red-400">{Object.entries(CRITERIA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><button onClick={() => { onAdd(name.trim() || 'Cán bộ mới', type); setName(''); }} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button></div>);
}
function PersonChips({ people, curId, setCurId, onDelete, onAdd, hideDelete }) {
  const [adding, setAdding] = useState(false);
  return (<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3"><div className="flex items-center gap-2 overflow-x-auto pb-1">{people.map((p) => { const on = p.id === curId; const r = classify(computePerson(p).totalMgr);
    return (<div key={p.id} className={`shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border-2 cursor-pointer transition-all ${on ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => setCurId(p.id)}><span className={`w-6 h-6 rounded-full ${r.cls} text-white text-[10px] font-bold flex items-center justify-center`}>{r.code}</span><div className="text-left"><p className="text-sm font-semibold text-slate-700 leading-none whitespace-nowrap">{p.name || '(Chưa tên)'}</p><p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{CRITERIA[p.type].mau}</p></div>{!hideDelete && people.length > 1 && <button onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} className="text-slate-300 hover:text-rose-500 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>}</div>); })}
    <button onClick={() => setAdding(!adding)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-red-400 hover:text-red-600 text-sm font-medium"><UserPlus className="w-4 h-4" /> Thêm</button>
  </div>{adding && <div className="mt-3 pt-3 border-t border-slate-100"><AddPerson onAdd={(n, t) => { onAdd(n, t); setAdding(false); }} /></div>}</div>);
}
