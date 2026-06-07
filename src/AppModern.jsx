import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { LayoutDashboard, BarChart3, Target, Users, TrendingUp, Award, Plus, Trash2, Link2, FileText, RotateCcw, LogOut, CalendarDays, AlertTriangle, ChevronDown, Sparkles, Layers, Cpu, ClipboardList, BookOpen, Phone, Mail, Send, CheckCircle2, Cloud, ShieldCheck } from 'lucide-react';
import { supabase, loadState, saveState, listPeriods, loadAllPeriods } from './lib/supabase';
import { onAuthChange, getSession, signOut } from './lib/auth';
import Login from './Login.jsx';
import SetPassword from './SetPassword.jsx';
import {
  CRITERIA, classify, gradeClass, statusOf, clamp, task335Score, getND335Groups, computePerson, setCatalogRegistry, findCatalogItem,
  newPerson, newTask335, newTracking, bumpIds, getWeekTitle, ROLE_LABEL, BOOTSTRAP_ADMIN_EMAILS,
  DIGITAL, LEVELS, MIN_DIGITAL, ORG_UNITS, posOptions, CRITERIA_ORDER,
} from './App.jsx';
import { deptSummary } from './lib/dash';
const DashboardCharts = lazy(() => import('./lib/DashboardCharts.jsx'));

const CONTACT = { name: 'Đồng chí Hà Ngọc Sơn', phone: '0904818886', email: 'sonthkh@gmail.com' };
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ML2nsQb4Vh7iB_mbBkQhngW9ftjwIvo0-ysXe2UQ6pQ/edit?usp=sharing';

const UNIT = 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa';

// Đồng hồ điểm tròn (SVG ring) — tông neon tím/lục
function Gauge({ value = 0, label }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - v / 100);
  const col = v >= 90 ? '#34d399' : v >= 70 ? '#38bdf8' : v >= 50 ? '#fbbf24' : '#fb7185';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <defs><linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor={col} /></linearGradient></defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#gm)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .6s ease', filter: 'drop-shadow(0 0 6px rgba(167,139,250,.6))' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{v.toFixed(1)}</span>
        <span className="text-[11px] text-slate-400">{label || '/ 100'}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, grad }) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-lg ${grad} relative overflow-hidden ring-1 ring-white/10`}>
      <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10 blur-xl" />
      <Icon className="w-6 h-6 opacity-90" />
      <p className="text-3xl font-extrabold mt-2 leading-none">{value}</p>
      <p className="text-xs opacity-90 mt-1">{label}</p>
    </div>
  );
}

const INP = 'bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-violet-400 disabled:opacity-50 disabled:bg-white/5';

function GBdark({ icon: Icon, title, children }) {
  return (
    <div className="glass-violet rounded-2xl border border-white/10 shadow-xl shadow-black/20 p-5">
      <h3 className="font-bold text-white flex items-center gap-2 mb-1.5"><Icon className="w-5 h-5 text-violet-300" /> {title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function AppModern({ version, onPickVersion, initialNav }) {
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const [objectives, setObjectives] = useState([]);
  const [people, setPeople] = useState([{ ...newPerson('Nguyễn Văn A', 'leader'), position: 'Phó Chánh Văn phòng' }, { ...newPerson('Trần Thị B', 'staff'), position: 'Chuyên viên' }]);
  const [curId, setCurId] = useState(people[0].id);
  const [nav, setNav] = useState(initialNav || 'dash');
  const [session, setSession] = useState(undefined);
  const [cloud, setCloud] = useState({ ready: false, saving: false });
  const [conflict, setConflict] = useState(false);
  const [seedFrom, setSeedFrom] = useState(null);
  const [trends, setTrends] = useState([]);
  const [catalog, setCatalog] = useState({ custom: [], hidden: [] }); // danh mục công việc tùy chỉnh (quản trị sửa ở bản Cổ điển)
  const [open, setOpen] = useState(null);
  const [trackingDate, setTrackingDate] = useState(new Date().toISOString().split('T')[0]);
  const [sheetSync, setSheetSync] = useState({ at: null, busy: false });
  const [fb, setFb] = useState({ name: '', content: '' });
  const loaded = useRef(false), loadingRef = useRef(false), serverTsRef = useRef(null);

  const refreshTrends = async () => {
    const all = await loadAllPeriods();
    setTrends(all.map(({ year, month, state }) => {
      const ppl = state?.people || []; const d = { A: 0, B: 0, C: 0, D: 0 }; let sum = 0;
      ppl.forEach((p) => { const c = computePerson(p); d[c.grade]++; sum += c.totalMgr; });
      return { year, month, dist: d, avg: ppl.length ? sum / ppl.length : 0, count: ppl.length };
    }).sort((a, b) => (Number(a.year) - Number(b.year)) || (Number(a.month) - Number(b.month))));
  };

  const loadPeriod = async (p) => {
    loadingRef.current = true; setConflict(false); setSeedFrom(null);
    const res = await loadState(p);
    serverTsRef.current = res.serverTs;
    if (res.state) {
      const ppl = res.state.people || [];
      setPeople(ppl); setCurId(ppl[0]?.id ?? null); setObjectives(res.state.objectives || []); setCatalog(res.state.catalog || { custom: [], hidden: [] }); bumpIds(ppl);
    } else {
      const others = (await listPeriods()).filter((o) => !(o.year === p.year && o.month === p.month));
      if (others.length) { setPeople([]); setCurId(null); setSeedFrom(others[0]); }
    }
    setCloud({ ready: !!supabase, saving: false }); loaded.current = true; loadingRef.current = false;
  };

  useEffect(() => {
    if (!supabase) { setSession('local'); return; }
    let unsub = () => {};
    (async () => { setSession(await getSession()); unsub = onAuthChange((ns) => setSession(ns)); })();
    return () => unsub();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadPeriod(period); refreshTrends(); }, []);

  useEffect(() => {
    if (!loaded.current || loadingRef.current || session === 'guest') return;
    setCloud((c) => ({ ...c, saving: true }));
    const t = setTimeout(async () => {
      const res = await saveState(period, { people, objectives, catalog, period }, serverTsRef.current);
      if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
      else if (res.conflict) setConflict(true);
      setCloud((c) => ({ ...c, saving: false }));
    }, 900);
    return () => clearTimeout(t);
  }, [people, objectives, catalog, period, session]);

  const changePeriod = (np) => { setPeriod(np); loadPeriod(np); };
  const copyFromPeriod = async (src) => {
    const res = await loadState({ year: src.year, month: src.month }); if (!res.state) return;
    const ppl = (res.state.people || []).map((p) => ({ ...p, id: newPerson('', p.type).id, selfScores: {}, mgrScores: {}, deduction: 0, disciplined: false, tasks335: [newTask335()], leadScores: { d: 100, dd: 100, e: 100 }, selfNote: '', mgrNote: '', trackings: [] }));
    setObjectives(res.state.objectives || []); setCatalog(res.state.catalog || { custom: [], hidden: [] }); setPeople(ppl); setCurId(ppl[0]?.id ?? null); setSeedFrom(null);
  };
  const handleSave = async () => {
    setCloud((c) => ({ ...c, saving: true }));
    const res = await saveState(period, { people, objectives, catalog, period }, serverTsRef.current);
    if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); } else if (res.conflict) setConflict(true);
    setCloud((c) => ({ ...c, saving: false })); refreshTrends();
  };

  const cur = people.find((p) => p.id === curId) || people[0] || null;
  const upPerson = (id, patch) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const upCur = (patch) => upPerson(curId, patch);
  const upTask335 = (taskId, patch) => upCur({ tasks335: (cur.tasks335 || []).map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });
  const upTracking = (tid, patch) => upCur({ trackings: (cur.trackings || []).map((t) => (t.id === tid ? { ...t, ...patch } : t)) });
  const upLead = (key, v) => upCur({ leadScores: { ...(cur.leadScores || {}), [key]: v } });

  const doExportTrackingPDF = async () => { const { exportTrackingPDF } = await import('./lib/exporters'); exportTrackingPDF(people, getWeekTitle(new Date(trackingDate)), UNIT, period); };
  const doExportTrackingExcel = async () => { const { exportTrackingExcel } = await import('./lib/exporters'); exportTrackingExcel(people, getWeekTitle(new Date(trackingDate)), UNIT); };

  const syncFromSheet = async () => {
    setSheetSync((s) => ({ ...s, busy: true }));
    try {
      const r = await fetch('/api/kiemdem', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok || data.error) { alert('Không đồng bộ được Google Sheet: ' + (data.error || `HTTP ${r.status}`)); return; }
      const sps = data.persons || [];
      if (!sps.length) { alert('Google Sheet chưa có dòng công việc nào để đồng bộ.'); return; }
      const mkTrk = (t) => ({ ...newTracking(), fromSheet: true, content: t.content || '', coordination: t.coordination || '', directive: t.directive || '', finalProduct: t.finalProduct || '', startDate: t.startDate || '', endDate: t.endDate || '', doneWork: t.doneWork || '', doingWork: t.doingWork || '', difficulties: t.difficulties || '', proposals: t.proposals || '', note: t.note || '' });
      let added = 0;
      setPeople((ps) => {
        const next = ps.map((p) => ({ ...p }));
        sps.forEach((sp) => {
          const nm = (sp.name || '').trim(); if (!nm) return;
          const trks = (sp.trackings || []).map(mkTrk); added += trks.length;
          const i = next.findIndex((p) => (p.name || '').trim().toLowerCase() === nm.toLowerCase());
          if (i >= 0) { const keep = (next[i].trackings || []).filter((t) => !t.fromSheet); next[i] = { ...next[i], trackings: [...keep, ...trks] }; }
          else { next.push({ ...newPerson(nm, 'staff'), trackings: trks }); }
        });
        return next;
      });
      setSheetSync({ at: data.fetchedAt || new Date().toISOString(), busy: false });
      alert(`Đã đồng bộ ${added} công việc từ Google Sheet cho ${sps.length} cán bộ.`);
    } catch (e) { alert('Lỗi đồng bộ Google Sheet: ' + (e && e.message ? e.message : e)); }
    finally { setSheetSync((s) => ({ ...s, busy: false })); }
  };

  const doCollectTracking = () => {
    if (!cur) return;
    const trks = (cur.trackings || []).filter((t) => t.catalogId);
    if (!trks.length) { alert('Chưa có dòng theo dõi nào gắn "Danh mục công việc" để thu thập.'); return; }
    const prevGen = new Map((cur.tasks335 || []).filter((x) => x.srcTrkId != null).map((x) => [x.srcTrkId, x]));
    const manual = (cur.tasks335 || []).filter((x) => x.srcTrkId == null);
    const generated = trks.map((t) => ({ id: prevGen.get(t.id)?.id ?? newTask335().id, srcTrkId: t.id, catalogId: t.catalogId, objId: t.objId || '', assigned: 1, completed: Number(t.completed) ? 1 : 0, qualityIssues: Number(t.qualityIssues) || 0, delays: Number(t.delays) || 0, note: t.content || '' }));
    upCur({ tasks335: [...manual, ...generated] });
    alert(`Đã thu thập ${generated.length} công việc vào Nhóm II. Mở tab Đánh giá để xem.`);
    setNav('eval');
  };

  const sendFeedback = () => {
    const subject = `[Góp ý hệ thống OKR/KPI] ${fb.name || 'Người dùng'}`;
    const body = `Người gửi: ${fb.name || '(chưa nhập)'}\n\nNội dung:\n${fb.content || ''}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  setCatalogRegistry(catalog); // đồng bộ danh mục tùy chỉnh trước khi tính điểm/đổ dropdown
  const computed = useMemo(() => people.map((p) => ({ p, c: computePerson(p) })), [people, catalog]);
  const curC = cur ? (computed.find((x) => x.p.id === curId)?.c || computePerson(cur)) : null;
  const dist = useMemo(() => { const d = { A: 0, B: 0, C: 0, D: 0 }; computed.forEach(({ c }) => d[c.grade]++); return d; }, [computed]);
  const avg = computed.length ? computed.reduce((s, x) => s + x.c.totalMgr, 0) / computed.length : 0;
  const overCap = dist.A > Math.floor(dist.B * 0.2);
  const objProgress = (oid) => { const ts = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === oid && t.catalogId); return ts.length ? ts.reduce((s, t) => s + task335Score(t), 0) / ts.length : null; };

  const myEmail = (session && session.user && session.user.email) || '';
  const isGuest = session === 'guest';
  const isBootstrapAdmin = !!myEmail && BOOTSTRAP_ADMIN_EMAILS.includes(myEmail.toLowerCase());
  const myPerson = (supabase && !isGuest) ? people.find((p) => p.email && myEmail && p.email.toLowerCase() === myEmail.toLowerCase()) : null;
  const role = isGuest ? 'khach' : (!supabase ? 'quantri' : (isBootstrapAdmin ? 'quantri' : (myPerson?.role || 'canbo')));
  const isAdmin = role === 'quantri';
  const canManage = isAdmin;
  const canEditMgrOf = (p) => isAdmin || (role === 'truongphong' && !!myPerson?.department && p?.department === myPerson.department);
  const canEditSelfOf = (p) => isAdmin || (!!myEmail && !!p?.email && p.email.toLowerCase() === myEmail.toLowerCase());
  const selfEditable = !isGuest && cur ? canEditSelfOf(cur) : false;
  const mgrEditable = !isGuest && cur ? canEditMgrOf(cur) : false;
  const taskEditable = selfEditable || mgrEditable;
  const readOnly = isGuest;
  const minLv = cur ? MIN_DIGITAL[cur.type] : 0;
  const digPassed = cur ? DIGITAL.filter((d) => (cur.digital[d.id] || 0) >= minLv).length : 0;

  const doWord = async () => {
    if (!cur) return;
    const r = gradeClass(curC.grade);
    const { exportWordPhieu } = await import('./lib/exporters');
    exportWordPhieu({ unit: UNIT, name: cur.name, position: cur.position, typeLabel: CRITERIA[cur.type].label, month: period.month, year: period.year, nhomI: curC.nmgr.toFixed(2), nhomII: curC.nhomII.toFixed(2), kpi: curC.k.val.toFixed(1), a: curC.k.a.toFixed(1), b: curC.k.b.toFixed(1), c: curC.k.c.toFixed(1), deduction: Number(cur.deduction || 0).toFixed(2), total: curC.totalMgr.toFixed(2), cls: r.code, clsName: r.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote });
  };

  // ===== Cổng đăng nhập =====
  if (supabase && session === undefined) return <div className="min-h-screen flex items-center justify-center nebula text-slate-400 text-sm">Đang kiểm tra đăng nhập...</div>;
  if (supabase && !session) return <Login unit={UNIT} version={version} onPickVersion={onPickVersion} onGuest={() => setSession('guest')} />;
  if (supabase && session && session !== 'local' && session !== 'guest' && !session.user?.user_metadata?.pw_set) {
    return <SetPassword unit={UNIT} email={myEmail} mode="create" onComplete={async () => setSession(await getSession())} />;
  }

  const result = curC ? gradeClass(curC.grade) : classify(0);
  const navItems = [
    { id: 'dash', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'eval', label: 'Đánh giá', icon: BarChart3 },
    { id: 'digital', label: 'Năng lực số', icon: Cpu },
    { id: 'tracking', label: 'Theo dõi CV', icon: ClipboardList },
    { id: 'guide', label: 'Hướng dẫn', icon: BookOpen },
    { id: 'contact', label: 'Liên hệ', icon: Phone },
  ];
  const navTitle = { dash: 'Tổng quan điều hành', eval: 'Đánh giá & xếp loại', digital: 'Khung năng lực số', tracking: 'Theo dõi công việc', guide: 'Hướng dẫn sử dụng', contact: 'Liên hệ & góp ý' }[nav] || '';
  const card = 'glass-violet rounded-2xl border border-white/10 shadow-xl shadow-black/20';

  return (
    <div className="min-h-screen lg:flex nebula text-slate-200" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <aside className="lg:w-64 shrink-0 lg:min-h-screen relative overflow-hidden text-white glass-violet border-r border-white/10">
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />
        <div className="relative p-4 lg:p-5 flex lg:flex-col gap-4 lg:gap-6 items-center lg:items-stretch">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center ring-2 ring-violet-400/50 emblem-glow shrink-0 p-1"><img src="/quoc-huy.svg" alt="Quốc huy" className="w-full h-full object-contain" /></div>
            <div className="hidden lg:block"><p className="text-violet-300 text-[10px] font-bold tracking-widest uppercase">OKR / KPI</p><p className="text-sm font-bold leading-tight text-white">Đánh giá CBCCVC</p></div>
          </div>
          <nav className="flex lg:flex-col gap-1 lg:mt-2 flex-1">
            {navItems.map((n) => { const Ic = n.icon; const on = nav === n.id; return (
              <button key={n.id} onClick={() => setNav(n.id)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${on ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white glow-violet' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Ic className="w-4 h-4" />{n.label}</button>
            ); })}
          </nav>
          <div className="hidden lg:block mt-auto space-y-2">
            <button onClick={() => onPickVersion && onPickVersion('classic')} className="w-full flex items-center justify-center gap-2 text-[12px] px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-violet-100 font-semibold border border-white/15 transition"><Layers className="w-3.5 h-3.5" /> Về giao diện cổ điển</button>
            <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2 border border-white/10">
              <div className="min-w-0"><p className="text-xs truncate text-slate-200" title={myEmail}>{isGuest ? 'Khách (dùng thử)' : (myPerson?.name || myEmail || 'Cục bộ')}</p><p className="text-[10px] text-violet-300">{ROLE_LABEL[role]}</p></div>
              {supabase && session !== 'local' && <button onClick={signOut} title="Đăng xuất" className="text-slate-300 hover:text-white shrink-0"><LogOut className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <div className="glass-violet border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-300" />
              <h1 className="font-extrabold text-white">{navTitle}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-200 border border-violet-400/30 px-2 py-0.5 rounded">Bản mới</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1.5 rounded-lg border ${cloud.ready ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>{isGuest ? 'Khách · không lưu' : (cloud.ready ? (cloud.saving ? 'Đang lưu...' : 'Đã kết nối') : 'Cục bộ')}</span>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
                <CalendarDays className="w-4 h-4 text-violet-300" />
                <input type="number" min="1" max="12" value={period.month} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, month: e.target.value }); }} onBlur={() => loadPeriod(period)} className={`w-9 px-1 py-0.5 text-sm text-center ${INP}`} />
                <span className="text-slate-500">/</span>
                <input type="number" value={period.year} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, year: e.target.value }); }} onBlur={() => loadPeriod(period)} className={`w-14 px-1 py-0.5 text-sm text-center ${INP}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {conflict && (
            <div className="bg-rose-500/15 border border-rose-400/30 rounded-xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /><div className="flex-1"><p className="text-sm text-rose-200 font-semibold">Dữ liệu kỳ này vừa được cập nhật nơi khác.</p><p className="text-xs text-rose-300/80">Hãy tải lại để tránh ghi đè.</p></div><button onClick={() => loadPeriod(period)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold">Tải lại</button></div>
          )}

          {people.length === 0 && (nav === 'dash' || nav === 'eval') && (
            <div className={`${card} p-8 text-center max-w-lg mx-auto`}>
              <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h2 className="font-bold text-white text-lg">Kỳ {period.month}/{period.year} chưa có dữ liệu</h2>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                {seedFrom && canManage && <button onClick={() => copyFromPeriod(seedFrom)} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm glow-violet">Sao chép cán bộ từ kỳ {seedFrom.month}/{seedFrom.year}</button>}
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople([np]); setCurId(np.id); }} className="bg-white/10 border border-white/15 text-slate-100 font-semibold px-4 py-2.5 rounded-xl text-sm">Thêm cán bộ</button>}
              </div>
            </div>
          )}

          {/* ===== TỔNG QUAN ===== */}
          {people.length > 0 && nav === 'dash' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Users} label="Tổng số cán bộ" value={people.length} grad="bg-gradient-to-br from-violet-600 to-indigo-800" />
                <StatCard icon={TrendingUp} label="Điểm trung bình" value={avg.toFixed(1)} grad="bg-gradient-to-br from-fuchsia-600 to-purple-800" />
                <StatCard icon={Award} label="Hoàn thành xuất sắc" value={dist.A} grad="bg-gradient-to-br from-emerald-500 to-teal-700" />
                <StatCard icon={Target} label="Mục tiêu (OKR)" value={objectives.length} grad="bg-gradient-to-br from-cyan-500 to-blue-700" />
              </div>
              {overCap && <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl p-3 text-sm text-amber-200 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Vượt trần: {dist.A} "Xuất sắc" trong khi tối đa {Math.floor(dist.B * 0.2)} (20% của {dist.B} "Tốt").</div>}

              <Suspense fallback={<div className="text-sm text-slate-400 text-center py-8">Đang tải biểu đồ…</div>}>
                <DashboardCharts dist={dist} trends={trends} computed={computed} theme="modern" />
              </Suspense>

              <div className="grid lg:grid-cols-3 gap-6">
                <section className={`lg:col-span-2 ${card} p-5`}>
                  <h2 className="font-bold text-white flex items-center gap-2 mb-3"><Target className="w-5 h-5 text-violet-300" /> Mục tiêu cấp Văn phòng (OKR)</h2>
                  <div className="space-y-3">
                    {objectives.map((o) => { const pr = objProgress(o.id); const linked = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === o.id && t.catalogId).length; return (
                      <div key={o.id} className="border border-white/10 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2"><p className="font-semibold text-sm text-slate-100">{o.title}</p><span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0"><Link2 className="w-3 h-3" />{linked} NV</span></div>
                        <div className="mt-2 flex items-center gap-3"><div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${pr === null ? 'bg-white/20' : statusOf(pr).dot}`} style={{ width: `${pr || 0}%` }} /></div><span className="text-xs font-bold text-slate-300 w-14 text-right">{pr === null ? '—' : `${pr.toFixed(0)}%`}</span></div>
                      </div>
                    ); })}
                    {objectives.length === 0 && <p className="text-sm text-slate-500 text-center py-4">Chưa có mục tiêu. Thêm ở giao diện cổ điển hoặc khi quản trị.</p>}
                  </div>
                </section>
                <section className={`${card} p-5`}>
                  <h2 className="font-bold text-white flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-violet-300" /> Phân bố xếp loại</h2>
                  <div className="space-y-3">{['A', 'B', 'C', 'D'].map((code) => { const cl = classify(code === 'A' ? 95 : code === 'B' ? 80 : code === 'C' ? 60 : 40); const n = dist[code]; const pct = people.length ? (n / people.length) * 100 : 0; return (
                    <div key={code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-300">Loại {code} — {cl.name}</span><b className="text-slate-100">{n}</b></div><div className="h-3 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${cl.bar}`} style={{ width: `${pct}%` }} /></div></div>
                  ); })}</div>
                </section>
              </div>

              <section className={`${card} overflow-hidden`}>
                <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between"><h2 className="font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-violet-300" /> Bảng tổng hợp kết quả</h2></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs uppercase"><tr><th className="text-left px-4 py-2.5">Họ và tên</th><th className="text-left px-3 py-2.5">Chức vụ</th><th className="text-center px-3 py-2.5">Tự ĐG</th><th className="text-center px-3 py-2.5">Cấp duyệt</th><th className="text-center px-3 py-2.5">Xếp loại</th></tr></thead>
                  <tbody className="divide-y divide-white/10">{computed.map(({ p, c }) => { const r = gradeClass(c.grade); return (
                    <tr key={p.id} className="hover:bg-white/5 cursor-pointer" onClick={() => { setCurId(p.id); setNav('eval'); }}><td className="px-4 py-3 font-semibold text-slate-100">{p.name || '(Chưa tên)'}</td><td className="px-3 py-3 text-slate-400 text-xs">{p.position || CRITERIA[p.type].label}</td><td className="px-3 py-3 text-center text-slate-400">{c.totalSelf.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-white">{c.totalMgr.toFixed(1)}</td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${r.cls} text-white text-[10px] font-bold`}>{r.code}</span></td></tr>
                  ); })}</tbody></table></div>
              </section>

              <section className={`${card} overflow-hidden`}>
                <div className="px-5 py-3.5 border-b border-white/10"><h2 className="font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-violet-300" /> Tổng hợp theo Phòng/Bộ phận</h2></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs uppercase"><tr><th className="text-left px-4 py-2.5">Phòng / Bộ phận</th><th className="text-center px-3 py-2.5">Số CB</th><th className="text-center px-3 py-2.5 text-indigo-300">Chất lượng<br/>(Nhóm I /30)</th><th className="text-center px-3 py-2.5 text-amber-300">KPI<br/>(Nhóm II /70)</th><th className="text-center px-3 py-2.5">Tổng TB</th><th className="text-center px-3 py-2.5 text-emerald-400">A</th><th className="text-center px-3 py-2.5 text-sky-400">B</th><th className="text-center px-3 py-2.5 text-amber-400">C</th><th className="text-center px-3 py-2.5 text-rose-400">D</th></tr></thead>
                  <tbody className="divide-y divide-white/10">{deptSummary(computed).map((g) => (
                    <tr key={g.dept} className="hover:bg-white/5"><td className="px-4 py-2.5 font-semibold text-slate-100">{g.dept}</td><td className="px-3 py-2.5 text-center text-slate-400">{g.count}</td><td className="px-3 py-2.5 text-center text-indigo-300 font-semibold">{g.quality.toFixed(1)}</td><td className="px-3 py-2.5 text-center text-amber-300 font-semibold">{g.kpi.toFixed(1)}</td><td className="px-3 py-2.5 text-center font-bold text-white">{g.avg.toFixed(1)}</td><td className="px-3 py-2.5 text-center text-emerald-400 font-semibold">{g.A}</td><td className="px-3 py-2.5 text-center text-sky-400 font-semibold">{g.B}</td><td className="px-3 py-2.5 text-center text-amber-400 font-semibold">{g.C}</td><td className="px-3 py-2.5 text-center text-rose-400 font-semibold">{g.D}</td></tr>
                  ))}</tbody></table></div>
              </section>

              {trends.length > 0 && (
                <section className={`${card} overflow-hidden`}>
                  <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between"><h2 className="font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-300" /> Xu hướng theo kỳ</h2><button onClick={refreshTrends} className="text-xs text-slate-400 hover:text-violet-300 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Làm mới</button></div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs uppercase"><tr><th className="text-left px-4 py-2.5">Kỳ</th><th className="text-center px-3 py-2.5">Số CB</th><th className="text-center px-3 py-2.5">TB</th><th className="text-center px-3 py-2.5 text-emerald-400">A</th><th className="text-center px-3 py-2.5 text-sky-400">B</th><th className="text-center px-3 py-2.5 text-amber-400">C</th><th className="text-center px-3 py-2.5 text-rose-400">D</th></tr></thead>
                    <tbody className="divide-y divide-white/10">{trends.map((t) => (<tr key={`${t.year}-${t.month}`} className="hover:bg-white/5"><td className="px-4 py-2.5 font-semibold text-slate-100">T{t.month}/{t.year}</td><td className="px-3 py-2.5 text-center text-slate-400">{t.count}</td><td className="px-3 py-2.5 text-center font-bold text-white">{t.avg.toFixed(1)}</td><td className="px-3 py-2.5 text-center text-emerald-400 font-semibold">{t.dist.A}</td><td className="px-3 py-2.5 text-center text-sky-400 font-semibold">{t.dist.B}</td><td className="px-3 py-2.5 text-center text-amber-400 font-semibold">{t.dist.C}</td><td className="px-3 py-2.5 text-center text-rose-400 font-semibold">{t.dist.D}</td></tr>))}</tbody></table></div>
                </section>
              )}
            </>
          )}

          {/* ===== ĐÁNH GIÁ ===== */}
          {people.length > 0 && nav === 'eval' && cur && (
            <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
              <aside className={`${card} overflow-hidden lg:sticky lg:top-20`}>
                <div className="p-3 bg-white/5 border-b border-white/10 text-sm font-semibold text-slate-200 flex items-center gap-2"><Users className="w-4 h-4 text-violet-300" /> Danh sách cán bộ</div>
                <div className="divide-y divide-white/10 max-h-[420px] overflow-y-auto">{people.map((p) => { const r = gradeClass(computePerson(p).grade); return (
                  <button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 ${curId === p.id ? 'bg-violet-500/15' : 'hover:bg-white/5'}`}><span className={`w-7 h-7 rounded-full ${r.cls} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>{r.code}</span><div className="min-w-0"><p className={`text-sm font-medium truncate ${curId === p.id ? 'text-violet-200' : 'text-slate-200'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-500 truncate">{p.position || CRITERIA[p.type].label}</p></div></button>
                ); })}</div>
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople((ps) => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10 border-t border-white/10"><Plus className="w-4 h-4" /> Thêm cán bộ</button>}
              </aside>

              <div className="space-y-5">
                <section className={`${card} p-5 grid md:grid-cols-[1fr_auto] gap-5 items-center`}>
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="block"><span className="text-xs font-semibold text-slate-400">Họ và tên</span><input value={cur.name} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ name: e.target.value })} className={`mt-1 w-full px-3 py-2 text-sm ${INP}`} /></label>
                      <label className="block"><span className="text-xs font-semibold text-slate-400">Phòng / Bộ phận</span><select value={cur.department || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ department: e.target.value, position: '' })} className={`mt-1 w-full px-3 py-2 text-sm ${INP}`}><option className="bg-slate-900" value="">— Chọn phòng / bộ phận —</option>{ORG_UNITS.map((u) => <option className="bg-slate-900" key={u.dept} value={u.dept}>{u.dept}</option>)}</select></label>
                      <label className="block"><span className="text-xs font-semibold text-slate-400">Chức vụ</span><select value={cur.position || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ position: e.target.value })} className={`mt-1 w-full px-3 py-2 text-sm ${INP}`}><option className="bg-slate-900" value="">— Chọn chức vụ —</option>{posOptions(cur.department).map((p) => <option className="bg-slate-900" key={p} value={p}>{p}</option>)}{cur.position && !posOptions(cur.department).includes(cur.position) && <option className="bg-slate-900" value={cur.position}>{cur.position}</option>}</select></label>
                      {canManage ? (
                        <label className="block"><span className="text-xs font-semibold text-slate-400">Vai trò</span><select value={cur.role || 'canbo'} onChange={(e) => upCur({ role: e.target.value })} className={`mt-1 w-full px-3 py-2 text-sm ${INP}`}><option className="bg-slate-900" value="canbo">Cán bộ</option><option className="bg-slate-900" value="truongphong">Trưởng phòng</option><option className="bg-slate-900" value="quantri">Quản trị</option></select></label>
                      ) : (
                        <label className="block"><span className="text-xs font-semibold text-slate-400">Email</span><input value={cur.email || ''} disabled className={`mt-1 w-full px-3 py-2 text-sm ${INP}`} /></label>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">{CRITERIA_ORDER.map((k) => [k, CRITERIA[k]]).map(([k, v]) => (
                      <button key={k} disabled={!(canManage || mgrEditable)} onClick={() => upCur({ type: k, selfScores: {}, mgrScores: {} })} className={`text-left px-3 py-1.5 rounded-lg border text-xs disabled:opacity-60 ${cur.type === k ? 'border-violet-400/50 bg-violet-500/20 text-violet-100 font-semibold' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>{v.mau}</button>
                    ))}</div>
                  </div>
                  <div className="text-center">
                    <Gauge value={curC.totalMgr} />
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-slate-100"><span className={`w-2.5 h-2.5 rounded-full ${result.cls}`} />{result.name}</span>
                    {!selfEditable && !mgrEditable && <p className="text-[11px] text-slate-500 mt-2">Chế độ chỉ xem</p>}
                  </div>
                </section>

                <section className={`${card} overflow-hidden`}>
                  <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between"><h3 className="font-bold text-white text-sm">Nhóm I — Tiêu chí chung</h3><span className="text-xs font-bold text-violet-300">{curC.nmgr.toFixed(1)} / 30</span></div>
                  <div className="p-3 space-y-2">
                    {CRITERIA[cur.type].groups.map((g) => { const sub = g.items.reduce((s, it) => s + (cur.mgrScores[it.id] ?? cur.selfScores[it.id] ?? it.max), 0); const isO = open === g.id; return (
                      <div key={g.id} className="border border-white/10 rounded-xl overflow-hidden">
                        <button onClick={() => setOpen(isO ? null : g.id)} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-left"><span className="text-sm font-semibold text-slate-200">{g.title}</span><span className="flex items-center gap-2 shrink-0"><span className="text-xs font-bold text-violet-300">{sub.toFixed(1)}/{g.max}</span><ChevronDown className={`w-4 h-4 text-slate-400 transition ${isO ? 'rotate-180' : ''}`} /></span></button>
                        {isO && <div className="divide-y divide-white/10">{g.items.map((it) => { const sv = cur.selfScores[it.id] ?? it.max; const mv = cur.mgrScores[it.id] ?? sv; return (
                          <div key={it.id} className="px-3 py-2 flex items-start gap-2"><span className="text-[11px] font-bold text-slate-500 w-7 pt-1">{it.id}</span><p className="flex-1 text-xs text-slate-300 pt-0.5">{it.text}</p><input type="number" min="0" max={it.max} step="0.25" value={sv} disabled={!selfEditable} onChange={(e) => upCur({ selfScores: { ...cur.selfScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className={`w-14 text-center py-1 text-xs ${INP}`} /><input type="number" min="0" max={it.max} step="0.25" value={mv} disabled={!mgrEditable} onChange={(e) => upCur({ mgrScores: { ...cur.mgrScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-14 text-center font-bold text-violet-200 bg-violet-500/10 border border-violet-400/30 rounded py-1 text-xs outline-none focus:border-violet-400 disabled:opacity-50" /></div>
                        ); })}</div>}
                      </div>
                    ); })}
                  </div>
                </section>

                <section className={`${card} overflow-hidden`}>
                  <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between"><h3 className="font-bold text-white text-sm">Nhóm II — Kết quả thực hiện nhiệm vụ</h3><span className="text-xs font-bold text-violet-300">{curC.nhomII.toFixed(2)} / 70</span></div>
                  <div className="p-3 space-y-3">
                    {(cur.tasks335 || []).map((t) => { const sc = task335Score(t); const st = statusOf(sc); return (
                      <div key={t.id} className="border border-white/10 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2"><span className={`w-2.5 h-2.5 rounded-full ${st.dot} shrink-0`} /><select value={t.catalogId} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className={`flex-1 px-2 py-1.5 text-xs ${INP}`}><option className="bg-slate-900" value="">— Chọn công việc từ danh mục —</option>{getND335Groups(cur.type).map((c) => <option className="bg-slate-900" key={c.id} value={c.id}>[{c.id}] {c.name}</option>)}</select><span className={`text-[11px] font-bold ${sc >= 90 ? 'text-emerald-400' : sc >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>{sc.toFixed(0)}%</span>{taskEditable && (cur.tasks335 || []).length > 1 && <button onClick={() => upCur({ tasks335: (cur.tasks335 || []).filter((x) => x.id !== t.id) })} className="text-rose-400 hover:bg-rose-500/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>}</div>
                        <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-500 shrink-0" /><select value={t.objId || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { objId: e.target.value })} className={`flex-1 px-2 py-1.5 text-xs ${INP}`}><option className="bg-slate-900" value="">— Liên kết mục tiêu (OKR) —</option>{objectives.map((o) => <option className="bg-slate-900" key={o.id} value={o.id}>{o.title}</option>)}</select></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[['Số lượng giao', 'assigned', 1], ['Số lượng HT', 'completed', 0], ['Lỗi chất lượng', 'qualityIssues', 0], ['Chậm tiến độ', 'delays', 0]].map(([lb, key, mn]) => (
                          <label key={key} className="block"><span className="text-[10px] font-semibold text-slate-500">{lb}</span><input type="number" min={mn} value={t[key]} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { [key]: Math.max(mn, Number(e.target.value)) })} className={`mt-0.5 w-full px-2 py-1.5 text-sm text-center font-semibold ${INP}`} /></label>
                        ))}</div>
                      </div>
                    ); })}
                    {taskEditable && <button onClick={() => upCur({ tasks335: [...(cur.tasks335 || []), newTask335()] })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-white/15 rounded-xl text-sm font-medium text-slate-400 hover:border-violet-400/50 hover:text-violet-300"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>}
                    {curC.leader && (
                      <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
                        <p className="text-[11px] font-bold text-violet-200 mb-2">Tiêu chí lãnh đạo, quản lý (Điều 7) — Điểm KQ = (a + b + c + d + đ + e) ÷ 6</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{[['d', 'd — Lĩnh vực phụ trách'], ['dd', 'đ — Tổ chức triển khai'], ['e', 'e — Tập hợp, đoàn kết']].map(([key, lb]) => (
                          <label key={key} className="block"><span className="text-[10px] font-semibold text-slate-400">{lb}</span><select value={(cur.leadScores || {})[key] ?? 100} disabled={!taskEditable} onChange={(e) => upLead(key, Number(e.target.value))} className={`mt-0.5 w-full px-2 py-1.5 text-sm ${INP}`}><option className="bg-slate-900" value={100}>Đạt (100%)</option><option className="bg-slate-900" value={50}>Hạn chế (50%)</option></select></label>
                        ))}</div>
                      </div>
                    )}
                    <div className={`grid ${curC.leader ? 'grid-cols-3 sm:grid-cols-7' : 'grid-cols-4'} gap-2 text-center`}>{[['Khối lượng', curC.k.a], ['Chất lượng', curC.k.b], ['Tiến độ', curC.k.c], ...(curC.leader ? [['Lĩnh vực', curC.k.d ?? 100], ['Tổ chức', curC.k.dd ?? 100], ['Đoàn kết', curC.k.e ?? 100]] : []), ['Điểm KQ', curC.k.val]].map(([l, v], idx, arr) => { const last = idx === arr.length - 1; return (
                      <div key={l} className={`${last ? 'bg-violet-500/15 border-violet-400/30 text-violet-200' : 'bg-white/5 border-white/10 text-slate-300'} rounded-lg py-2 border`}><p className="text-[10px]">{l}</p><p className="font-bold text-sm">{Number(v).toFixed(1)}%</p></div>
                    ); })}</div>
                  </div>
                </section>

                <section className={`${card} p-4 space-y-3`}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-200">Điều kiện xếp loại (Điều 8) — tự động theo điểm + định lượng</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[['Hoàn thành', `${(curC.st?.completedRate ?? 100).toFixed(0)}%`, 'cần 100%', (curC.st?.n ? curC.st.completedRate >= 100 : null)], ['Vượt mức', `${(curC.st?.exceedRate ?? 0).toFixed(0)}%`, 'HTXS ≥30%', (curC.st?.n ? curC.st.exceedRate >= 30 : null)], ['Chậm tiến độ', `${(curC.st?.delayRate ?? 0).toFixed(0)}%`, 'HTNV ≤20%', (curC.st?.n ? curC.st.delayRate <= 20 : null)]].map(([l, v, h, ok]) => (
                        <div key={l} className={`rounded-lg border p-1.5 ${ok == null ? 'border-white/10 bg-white/5' : ok ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}><p className="text-[9px] text-slate-400">{l}</p><p className={`font-bold text-sm ${ok == null ? 'text-slate-200' : ok ? 'text-emerald-300' : 'text-rose-300'}`}>{v}</p><p className="text-[9px] text-slate-500">{h}</p></div>
                      ))}
                    </div>
                    {(() => { const tl = (cur.tasks335 || []).filter((t) => t.catalogId); const nm = (t) => { const it = findCatalogItem(t.catalogId); return (it && it.name) || t.note || `[${t.catalogId}]`; }; const nd = tl.filter((t) => !((Number(t.assigned) || 0) > 0 && (Number(t.completed) || 0) >= (Number(t.assigned) || 0))); const dl = tl.filter((t) => (Number(t.delays) || 0) > 0); return (<>
                      {nd.length > 0 && <div className="text-[11px] text-rose-200/90"><b className="text-rose-300">Chưa hoàn thành ({nd.length}/{tl.length}):</b><ul className="list-disc pl-4 mt-0.5 space-y-0.5">{nd.map((t, i) => <li key={i}>{nm(t)} — {Number(t.completed) || 0}/{Number(t.assigned) || 0}{t.note ? ` · ${t.note}` : ''}</li>)}</ul></div>}
                      {dl.length > 0 && <div className="text-[11px] text-amber-200/90"><b className="text-amber-300">Chậm tiến độ ({dl.length}/{tl.length}):</b><ul className="list-disc pl-4 mt-0.5 space-y-0.5">{dl.map((t, i) => <li key={i}>{nm(t)} — chậm {Number(t.delays) || 0} lần{t.note ? ` · ${t.note}` : ''}</li>)}</ul></div>}
                    </>); })()}
                    {curC.gradeReasons && curC.gradeReasons.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-200/90 leading-relaxed">{curC.gradeReasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    ) : (
                      <p className="text-[11px] text-emerald-300">✓ Đã đáp ứng đủ điều kiện của mức xếp loại theo điểm.</p>
                    )}
                  </div>
                  <label className="block"><span className="text-xs font-semibold text-slate-400">Điểm trừ <span className="font-normal text-slate-500">(trừ thẳng vào tổng điểm)</span></span><input type="number" min="0" value={cur.deduction} disabled={!mgrEditable} onChange={(e) => upCur({ deduction: e.target.value })} className={`mt-1 w-32 px-3 py-2 text-sm ${INP}`} /></label>
                  <label className={`flex items-start gap-2.5 rounded-xl border p-3 ${cur.disciplined ? 'border-rose-400/40 bg-rose-500/10' : 'border-white/10 bg-white/5'}`}><input type="checkbox" checked={!!cur.disciplined} disabled={!mgrEditable} onChange={(e) => upCur({ disciplined: e.target.checked })} className="mt-0.5 w-4 h-4 accent-rose-500 disabled:opacity-50" /><span className="text-xs text-slate-300">Bị <b>kỷ luật đảng/hành chính</b> hoặc kết luận <b>suy thoái, vi phạm công vụ</b> trong kỳ → chốt xếp loại "Không hoàn thành nhiệm vụ" (Điều 8.4). <b className="text-rose-300">Không trừ vào tổng điểm</b> — muốn trừ điểm dùng ô Điểm trừ ở trên.</span></label>
                  <label className="block"><span className="text-xs font-semibold text-slate-400">Ý kiến tự nhận xét</span><textarea value={cur.selfNote} disabled={!selfEditable} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className={`mt-1 w-full px-3 py-2 text-sm resize-y ${INP}`} /></label>
                  <label className="block"><span className="text-xs font-semibold text-slate-400">Nhận xét của cấp có thẩm quyền</span><textarea value={cur.mgrNote} disabled={!mgrEditable} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className={`mt-1 w-full px-3 py-2 text-sm resize-y ${INP}`} /></label>
                  <div className="flex gap-2">
                    <button onClick={doWord} className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-xl text-sm glow-violet"><FileText className="w-4 h-4" /> Xuất phiếu Word</button>
                    {!isGuest && <button onClick={handleSave} disabled={cloud.saving} className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-60 glow-violet"><RotateCcw className="w-4 h-4" /> Lưu ngay</button>}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ===== NĂNG LỰC SỐ ===== */}
          {people.length > 0 && nav === 'digital' && cur && (
            <div className="space-y-4 max-w-3xl">
              <section className={`${card} p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Cpu className="w-5 h-5 text-violet-300 shrink-0" />
                    <select value={curId || ''} onChange={(e) => setCurId(Number(e.target.value))} className={`px-3 py-2 text-sm ${INP}`}>{people.map((p) => <option className="bg-slate-900" key={p.id} value={p.id}>{p.name || '(Chưa tên)'} — {p.position || CRITERIA[p.type].label}</option>)}</select>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-400">Chuẩn tối thiểu: <b className="text-violet-200">Mức {minLv}</b></span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${digPassed === DIGITAL.length ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20' : 'bg-amber-500/15 text-amber-300 border-amber-400/20'}`}>{digPassed}/{DIGITAL.length} kỹ năng đạt</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Tự đánh giá Khung năng lực số — chỉ số phụ trợ, không cộng vào điểm tháng.</p>
              </section>
              {DIGITAL.map((d) => { const lv = cur.digital[d.id] || 0; const ok = lv >= minLv; return (
                <div key={d.id} className={`${card} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>{d.id}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-slate-100 text-sm">{d.name}</p>{d.mandatory && <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">BẮT BUỘC</span>}{lv > 0 && (ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />)}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">{LEVELS.map((L) => (
                        <button key={L.v} disabled={readOnly} onClick={() => upCur({ digital: { ...cur.digital, [d.id]: L.v } })} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition disabled:opacity-60 ${lv === L.v ? (L.v >= minLv ? 'bg-emerald-500 text-white border-emerald-500' : L.v === 0 ? 'bg-slate-500 text-white border-slate-500' : 'bg-amber-500 text-white border-amber-500') : 'bg-white/5 text-slate-300 border-white/10 hover:border-violet-400/40'}`}>{L.s}</button>
                      ))}</div>
                    </div>
                  </div>
                </div>
              ); })}
            </div>
          )}

          {/* ===== THEO DÕI CV ===== */}
          {people.length > 0 && nav === 'tracking' && cur && (
            <div className={`${card} overflow-hidden`}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><ClipboardList className="w-5 h-5 text-violet-300" /> Bảng kiểm đếm, theo dõi công việc</h2>
                  <p className="text-sm text-slate-400 mt-1">{getWeekTitle(new Date(trackingDate))}</p>
                  {canManage && <p className="text-[11px] text-slate-500 mt-0.5">Nguồn: <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline">Google Sheet</a>{sheetSync.at ? ` · Đồng bộ lúc ${new Date(sheetSync.at).toLocaleString('vi-VN')}` : ''}</p>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={curId || ''} onChange={(e) => setCurId(Number(e.target.value))} className={`px-2.5 py-1.5 text-xs ${INP}`}>{people.map((p) => <option className="bg-slate-900" key={p.id} value={p.id}>{p.name || '(Chưa tên)'}</option>)}</select>
                  <input type="date" value={trackingDate} onChange={(e) => setTrackingDate(e.target.value)} className={`px-2 py-1.5 text-xs ${INP}`} />
                  {canManage && <button onClick={syncFromSheet} disabled={sheetSync.busy} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg text-xs font-semibold"><Cloud className="w-3.5 h-3.5" /> {sheetSync.busy ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</button>}
                  {taskEditable && <button onClick={doCollectTracking} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg text-xs font-semibold glow-violet"><RotateCcw className="w-3.5 h-3.5" /> Thu thập vào KPI</button>}
                  <button onClick={doExportTrackingPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-semibold"><FileText className="w-3.5 h-3.5" /> PDF</button>
                  <button onClick={doExportTrackingExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-semibold"><FileText className="w-3.5 h-3.5" /> Excel</button>
                </div>
              </div>
              <fieldset disabled={readOnly} className="p-5 space-y-4 border-0">
                <datalist id="coord-list"><option value="Văn phòng Đoàn ĐBQH và HĐND tỉnh" /><option value="Ban Pháp chế HĐND tỉnh" /><option value="Ban Kinh tế - Ngân sách HĐND tỉnh" /><option value="Ban Văn hóa - Xã hội HĐND tỉnh" /><option value="Ban Dân tộc HĐND tỉnh" /></datalist>
                {(cur.trackings || []).map((t, idx) => (
                  <div key={t.id} className="p-4 border border-white/10 bg-white/5 rounded-xl relative">
                    <button onClick={() => upCur({ trackings: (cur.trackings || []).filter((x) => x.id !== t.id) })} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    <div className="mb-3 font-semibold text-slate-200 text-sm flex items-center gap-2">Công việc #{idx + 1}{t.fromSheet && <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/20 rounded px-1.5 py-0.5">từ Google Sheet</span>}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-400">Nội dung công việc</label><textarea value={t.content} onChange={(e) => upTracking(t.id, { content: e.target.value })} className={`mt-1 w-full text-xs p-2 min-h-[60px] ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Đơn vị chủ trì, phối hợp</label><input list="coord-list" value={t.coordination} onChange={(e) => upTracking(t.id, { coordination: e.target.value })} className={`mt-1 w-full text-xs p-2 ${INP}`} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-400">Ý kiến chỉ đạo của TT HĐND</label><textarea value={t.directive} onChange={(e) => upTracking(t.id, { directive: e.target.value })} className={`mt-1 w-full text-xs p-2 min-h-[60px] ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Sản phẩm cuối cùng</label><textarea value={t.finalProduct} onChange={(e) => upTracking(t.id, { finalProduct: e.target.value })} className={`mt-1 w-full text-xs p-2 min-h-[60px] ${INP}`} /></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-400">Triển khai</label><input placeholder="01/06/2026" value={t.startDate} onChange={(e) => upTracking(t.id, { startDate: e.target.value })} className={`mt-1 w-full text-xs p-1.5 ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Hoàn thành</label><input placeholder="07/06/2026" value={t.endDate} onChange={(e) => upTracking(t.id, { endDate: e.target.value })} className={`mt-1 w-full text-xs p-1.5 ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Đã thực hiện</label><textarea value={t.doneWork} onChange={(e) => upTracking(t.id, { doneWork: e.target.value })} className={`mt-1 w-full text-xs p-1.5 min-h-[40px] ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Đang thực hiện</label><textarea value={t.doingWork} onChange={(e) => upTracking(t.id, { doingWork: e.target.value })} className={`mt-1 w-full text-xs p-1.5 min-h-[40px] ${INP}`} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className="text-[11px] font-medium text-slate-400">Khó khăn, vướng mắc</label><textarea value={t.difficulties} onChange={(e) => upTracking(t.id, { difficulties: e.target.value })} className={`mt-1 w-full text-xs p-1.5 min-h-[40px] ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Đề xuất, kiến nghị</label><textarea value={t.proposals} onChange={(e) => upTracking(t.id, { proposals: e.target.value })} className={`mt-1 w-full text-xs p-1.5 min-h-[40px] ${INP}`} /></div>
                      <div><label className="text-[11px] font-medium text-slate-400">Ghi chú</label><textarea value={t.note} onChange={(e) => upTracking(t.id, { note: e.target.value })} className={`mt-1 w-full text-xs p-1.5 min-h-[40px] ${INP}`} /></div>
                    </div>
                    <div className="mt-3 rounded-lg border border-violet-400/30 bg-violet-500/10 p-3">
                      <p className="text-[11px] font-bold text-violet-200 flex items-center gap-1.5 mb-2"><Target className="w-3.5 h-3.5" /> Phục vụ chấm KPI (Nhóm II) — chọn Danh mục để "Thu thập vào KPI"</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <div><label className="text-[11px] font-medium text-slate-400">Danh mục công việc</label><select value={t.catalogId || ''} onChange={(e) => upTracking(t.id, { catalogId: e.target.value })} className={`mt-1 w-full text-xs p-1.5 ${INP}`}><option className="bg-slate-900" value="">— Chọn danh mục —</option>{getND335Groups(cur.type).map((c) => <option className="bg-slate-900" key={c.id} value={c.id}>[{c.id}] {c.name}</option>)}</select></div>
                        <div><label className="text-[11px] font-medium text-slate-400">Liên kết OKR</label><select value={t.objId || ''} onChange={(e) => upTracking(t.id, { objId: e.target.value })} className={`mt-1 w-full text-xs p-1.5 ${INP}`}><option className="bg-slate-900" value="">— Liên kết OKR —</option>{objectives.map((o) => <option className="bg-slate-900" key={o.id} value={o.id}>{o.title}</option>)}</select></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-[11px] font-medium text-slate-400">Đã hoàn thành?</label><select value={Number(t.completed) ? 1 : 0} onChange={(e) => upTracking(t.id, { completed: Number(e.target.value) })} className={`mt-1 w-full text-xs p-1.5 ${INP}`}><option className="bg-slate-900" value={0}>Chưa</option><option className="bg-slate-900" value={1}>Hoàn thành</option></select></div>
                        <div><label className="text-[11px] font-medium text-slate-400">Lỗi chất lượng</label><input type="number" min="0" value={t.qualityIssues || 0} onChange={(e) => upTracking(t.id, { qualityIssues: Math.max(0, Number(e.target.value)) })} className={`mt-1 w-full text-xs p-1.5 text-center ${INP}`} /></div>
                        <div><label className="text-[11px] font-medium text-slate-400">Chậm tiến độ</label><input type="number" min="0" value={t.delays || 0} onChange={(e) => upTracking(t.id, { delays: Math.max(0, Number(e.target.value)) })} className={`mt-1 w-full text-xs p-1.5 text-center ${INP}`} /></div>
                      </div>
                    </div>
                  </div>
                ))}
                {!(cur.trackings?.length) && <div className="text-center py-10 text-slate-500 text-sm">Chưa có công việc nào. Hãy thêm mới!</div>}
                <button onClick={() => upCur({ trackings: [...(cur.trackings || []), newTracking()] })} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-white/15 rounded-xl text-sm font-medium text-slate-400 hover:border-violet-400/50 hover:text-violet-300"><Plus className="w-4 h-4" /> Thêm công việc</button>
              </fieldset>
            </div>
          )}

          {/* ===== HƯỚNG DẪN ===== */}
          {nav === 'guide' && (
            <div className="max-w-3xl space-y-4">
              <GBdark icon={TrendingUp} title="Thang điểm tổng — 100 điểm">Tổng = Nhóm I (Tiêu chí chung, ≤30) + Nhóm II (Kết quả thực hiện nhiệm vụ, ≤70) − Điểm trừ. Chấm 2 cấp: Tự đánh giá và Cấp duyệt (điểm xếp loại lấy theo Cấp duyệt).</GBdark>
              <GBdark icon={Target} title="Nhóm II — Đếm khách quan">Mỗi nhiệm vụ chọn từ danh mục (trọng số = hệ số cấp độ N1–N4; nhóm hỗ trợ tính ngang nhau). a (Khối lượng)=Σ(HT×hệ số)/Σ(Giao×hệ số); b (Chất lượng)=bình quân[1−0,25×Lỗi]; c (Tiến độ)=bình quân[1−0,25×Chậm]. Điểm Nhóm II = (a+b+c)/3 × 70%.</GBdark>
              <GBdark icon={Award} title="Xếp loại & trần tỷ lệ">A: ≥90 (Hoàn thành xuất sắc) · B: 70–&lt;90 (Tốt) · C: 50–&lt;70 (Hoàn thành) · D: &lt;50. Trần: số "Xuất sắc" ≤ 20% số "Tốt" (đặc biệt ≤ 25%).</GBdark>
              <GBdark icon={CalendarDays} title="Quy trình & mốc thời gian">Trước 25: cán bộ tự đánh giá · Trước 26: cấp thẩm quyền cho ý kiến · Trước 28: quyết định xếp loại · Trước 05 tháng sau: công khai, biểu dương. Tháng 12 hoàn thành trước 15/12.</GBdark>
              <GBdark icon={ShieldCheck} title="Đăng nhập & phân quyền">Đăng nhập bằng email (mật khẩu hoặc liên kết). Mặc định là Cán bộ; Quản trị đặt Email + Phòng + Vai trò cho từng người ở tab Đánh giá. Cán bộ tự chấm phần mình; Trưởng phòng duyệt trong phòng; Quản trị toàn quyền. Có tài khoản khách (chỉ xem) để dùng thử.</GBdark>
              <GBdark icon={ClipboardList} title="Theo dõi CV & thu thập KPI">Ghi kiểm đếm công việc tuần; có thể đồng bộ từ Google Sheet. Ở mỗi công việc gắn Danh mục + OKR + "Đã hoàn thành?/Lỗi/Chậm" rồi bấm "Thu thập vào KPI" để tạo nhiệm vụ Nhóm II tương ứng. Xuất bảng PDF/Excel.</GBdark>
              <GBdark icon={BarChart3} title="Cơ sở pháp lý">Quy định của Tỉnh ủy Thanh Hóa về đánh giá CBCCVC gắn OKR/KPI; Nghị định 335/2025/NĐ-CP; Sổ tay đánh giá của Bộ Nội vụ. Tinh thần "6 rõ": rõ người – rõ việc – rõ thời gian – rõ trách nhiệm – rõ sản phẩm – rõ thẩm quyền; đánh giá đa chiều, liên tục, lượng hóa bằng dữ liệu.</GBdark>
            </div>
          )}

          {/* ===== LIÊN HỆ ===== */}
          {nav === 'contact' && (
            <div className="max-w-2xl grid md:grid-cols-2 gap-5">
              <section className={`${card} p-5`}>
                <h2 className="font-bold text-white flex items-center gap-2 mb-3"><Phone className="w-5 h-5 text-violet-300" /> Thông tin liên hệ</h2>
                <p className="font-bold text-slate-100">{CONTACT.name}</p>
                <p className="text-xs text-slate-400 mb-3">Phụ trách hệ thống đánh giá OKR/KPI</p>
                <div className="space-y-2 text-sm">
                  <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-slate-200 hover:text-violet-300"><Phone className="w-4 h-4 text-violet-300" /> 0904 818 886</a>
                  <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-slate-200 hover:text-violet-300"><Mail className="w-4 h-4 text-violet-300" /> {CONTACT.email}</a>
                </div>
              </section>
              <section className={`${card} p-5`}>
                <h2 className="font-bold text-white flex items-center gap-2 mb-3"><Send className="w-5 h-5 text-violet-300" /> Gửi ý kiến góp ý</h2>
                <input value={fb.name} onChange={(e) => setFb({ ...fb, name: e.target.value })} placeholder="Họ tên của bạn" className={`w-full px-3 py-2 text-sm mb-2 ${INP}`} />
                <textarea value={fb.content} onChange={(e) => setFb({ ...fb, content: e.target.value })} rows={4} placeholder="Nội dung góp ý..." className={`w-full px-3 py-2 text-sm resize-y ${INP}`} />
                <button onClick={sendFeedback} className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold py-2.5 rounded-xl text-sm glow-violet"><Send className="w-4 h-4" /> Gửi ý kiến</button>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Bấm "Gửi ý kiến" sẽ mở ứng dụng email với nội dung điền sẵn, gửi tới <b className="text-slate-300">{CONTACT.email}</b>.</p>
              </section>
            </div>
          )}
        </div>
        <footer className="px-6 py-5 text-center text-xs text-slate-500">Phiên bản mới • OKR/KPI theo Quy định của Tỉnh ủy Thanh Hóa & NĐ 335/2025/NĐ-CP • Bản demo nội bộ</footer>
      </main>
    </div>
  );
}
