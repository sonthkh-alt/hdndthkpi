import { useState, useEffect, useMemo, useRef } from 'react';
import { LayoutDashboard, BarChart3, Target, Users, User, TrendingUp, Award, Plus, Trash2, Link2, FileText, RotateCcw, LogOut, CalendarDays, AlertTriangle, ChevronDown, Sparkles, Layers } from 'lucide-react';
import { supabase, loadState, saveState, listPeriods, loadAllPeriods } from './lib/supabase';
import { onAuthChange, getSession, signOut } from './lib/auth';
import Login from './Login.jsx';
import SetPassword from './SetPassword.jsx';
import {
  CRITERIA, classify, statusOf, clamp, task335Score, agg335, getND335Groups,
  computePerson, newPerson, newTask335, bumpIds, getWeekTitle, ROLE_LABEL, BOOTSTRAP_ADMIN_EMAILS,
} from './App.jsx';

const UNIT = 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa';

// Đồng hồ điểm tròn (SVG ring)
function Gauge({ value = 0, label }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - v / 100);
  const col = v >= 90 ? '#10b981' : v >= 70 ? '#0ea5e9' : v >= 50 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-800">{v.toFixed(1)}</span>
        <span className="text-[11px] text-slate-400">{label || '/ 100'}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, grad }) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-lg ${grad} relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
      <Icon className="w-6 h-6 opacity-90" />
      <p className="text-3xl font-extrabold mt-2 leading-none">{value}</p>
      <p className="text-xs opacity-90 mt-1">{label}</p>
    </div>
  );
}

export default function AppModern({ version, onPickVersion }) {
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const [objectives, setObjectives] = useState([]);
  const [people, setPeople] = useState([{ ...newPerson('Nguyễn Văn A', 'leader'), position: 'Phó Chánh Văn phòng' }, { ...newPerson('Trần Thị B', 'staff'), position: 'Chuyên viên' }]);
  const [curId, setCurId] = useState(people[0].id);
  const [nav, setNav] = useState('dash');
  const [session, setSession] = useState(undefined);
  const [cloud, setCloud] = useState({ ready: false, saving: false });
  const [conflict, setConflict] = useState(false);
  const [seedFrom, setSeedFrom] = useState(null);
  const [trends, setTrends] = useState([]);
  const [open, setOpen] = useState(null);
  const loaded = useRef(false), loadingRef = useRef(false), serverTsRef = useRef(null);

  const refreshTrends = async () => {
    const all = await loadAllPeriods();
    setTrends(all.map(({ year, month, state }) => {
      const ppl = state?.people || []; const d = { A: 0, B: 0, C: 0, D: 0 }; let sum = 0;
      ppl.forEach((p) => { const t = computePerson(p).totalMgr; d[classify(t).code]++; sum += t; });
      return { year, month, dist: d, avg: ppl.length ? sum / ppl.length : 0, count: ppl.length };
    }).sort((a, b) => (Number(a.year) - Number(b.year)) || (Number(a.month) - Number(b.month))));
  };

  const loadPeriod = async (p) => {
    loadingRef.current = true; setConflict(false); setSeedFrom(null);
    const res = await loadState(p);
    serverTsRef.current = res.serverTs;
    if (res.state) {
      const ppl = res.state.people || [];
      setPeople(ppl); setCurId(ppl[0]?.id ?? null); setObjectives(res.state.objectives || []); bumpIds(ppl);
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
      const res = await saveState(period, { people, objectives, period }, serverTsRef.current);
      if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
      else if (res.conflict) setConflict(true);
      setCloud((c) => ({ ...c, saving: false }));
    }, 900);
    return () => clearTimeout(t);
  }, [people, objectives, period, session]);

  const changePeriod = (np) => { setPeriod(np); loadPeriod(np); };
  const copyFromPeriod = async (src) => {
    const res = await loadState({ year: src.year, month: src.month }); if (!res.state) return;
    const ppl = (res.state.people || []).map((p) => ({ ...p, id: newPerson('', p.type).id, selfScores: {}, mgrScores: {}, deduction: 0, tasks335: [newTask335()], selfNote: '', mgrNote: '', trackings: [] }));
    setObjectives(res.state.objectives || []); setPeople(ppl); setCurId(ppl[0]?.id ?? null); setSeedFrom(null);
  };
  const handleSave = async () => {
    setCloud((c) => ({ ...c, saving: true }));
    const res = await saveState(period, { people, objectives, period }, serverTsRef.current);
    if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); } else if (res.conflict) setConflict(true);
    setCloud((c) => ({ ...c, saving: false })); refreshTrends();
  };

  const cur = people.find((p) => p.id === curId) || people[0] || null;
  const upPerson = (id, patch) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const upCur = (patch) => upPerson(curId, patch);
  const upTask335 = (taskId, patch) => upCur({ tasks335: (cur.tasks335 || []).map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });

  const computed = useMemo(() => people.map((p) => ({ p, c: computePerson(p) })), [people]);
  const curC = cur ? (computed.find((x) => x.p.id === curId)?.c || computePerson(cur)) : null;
  const dist = useMemo(() => { const d = { A: 0, B: 0, C: 0, D: 0 }; computed.forEach(({ c }) => d[classify(c.totalMgr).code]++); return d; }, [computed]);
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

  const doWord = async () => {
    if (!cur) return;
    const r = classify(curC.totalMgr);
    const { exportWordPhieu } = await import('./lib/exporters');
    exportWordPhieu({ unit: UNIT, name: cur.name, position: cur.position, typeLabel: CRITERIA[cur.type].label, month: period.month, year: period.year, nhomI: curC.nmgr.toFixed(2), nhomII: curC.nhomII.toFixed(2), kpi: curC.k.val.toFixed(1), a: curC.k.a.toFixed(1), b: curC.k.b.toFixed(1), c: curC.k.c.toFixed(1), deduction: Number(cur.deduction || 0).toFixed(2), total: curC.totalMgr.toFixed(2), cls: r.code, clsName: r.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote });
  };

  // ===== Cổng đăng nhập =====
  if (supabase && session === undefined) return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 text-sm">Đang kiểm tra đăng nhập...</div>;
  if (supabase && !session) return <Login unit={UNIT} version={version} onPickVersion={onPickVersion} onGuest={() => setSession('guest')} />;
  if (supabase && session && session !== 'local' && session !== 'guest' && !session.user?.user_metadata?.pw_set) {
    return <SetPassword unit={UNIT} email={myEmail} mode="create" onComplete={async () => setSession(await getSession())} />;
  }

  const result = curC ? classify(curC.totalMgr) : classify(0);
  const navItems = [{ id: 'dash', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'eval', label: 'Đánh giá', icon: BarChart3 }];

  return (
    <div className="min-h-screen lg:flex" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <aside className="lg:w-64 shrink-0 lg:min-h-screen relative overflow-hidden text-white bg-gradient-to-b from-[#6b1212] via-[#8f1818] to-[#5c0f0f]">
        <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
        <div className="relative p-4 lg:p-5 flex lg:flex-col gap-4 lg:gap-6 items-center lg:items-stretch">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center ring-2 ring-amber-300/60 emblem-glow shrink-0 p-1"><img src="/quoc-huy.svg" alt="Quốc huy" className="w-full h-full object-contain" /></div>
            <div className="hidden lg:block"><p className="text-amber-300 text-[10px] font-bold tracking-widest uppercase">OKR / KPI</p><p className="text-sm font-bold leading-tight">Đánh giá CBCCVC</p></div>
          </div>
          <nav className="flex lg:flex-col gap-1 lg:mt-2 flex-1">
            {navItems.map((n) => { const Ic = n.icon; const on = nav === n.id; return (
              <button key={n.id} onClick={() => setNav(n.id)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${on ? 'bg-white text-red-800 shadow-lg' : 'text-red-100/80 hover:bg-white/10 hover:text-white'}`}><Ic className="w-4 h-4" />{n.label}</button>
            ); })}
          </nav>
          <div className="hidden lg:block mt-auto space-y-2">
            <button onClick={() => onPickVersion && onPickVersion('classic')} className="w-full flex items-center justify-center gap-2 text-[12px] px-3 py-2 rounded-lg bg-amber-400 text-red-900 font-bold hover:bg-amber-300 transition"><Layers className="w-3.5 h-3.5" /> Về giao diện cổ điển</button>
            <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
              <div className="min-w-0"><p className="text-xs truncate" title={myEmail}>{isGuest ? 'Khách (dùng thử)' : (myPerson?.name || myEmail || 'Cục bộ')}</p><p className="text-[10px] text-amber-300">{ROLE_LABEL[role]}</p></div>
              {supabase && session !== 'local' && <button onClick={signOut} title="Đăng xuất" className="text-red-200 hover:text-white shrink-0"><LogOut className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <div className="bg-white/70 glass border-b border-slate-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h1 className="font-extrabold text-slate-800">{nav === 'dash' ? 'Tổng quan điều hành' : 'Đánh giá & xếp loại'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Bản mới</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1.5 rounded-lg ${cloud.ready ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{isGuest ? 'Khách · không lưu' : (cloud.ready ? (cloud.saving ? 'Đang lưu...' : 'Đã kết nối') : 'Cục bộ')}</span>
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1.5">
                <CalendarDays className="w-4 h-4 text-red-700" />
                <input type="number" min="1" max="12" value={period.month} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, month: e.target.value }); }} onBlur={() => loadPeriod(period)} className="w-9 bg-white rounded px-1 py-0.5 text-sm text-center outline-none" />
                <span className="text-slate-400">/</span>
                <input type="number" value={period.year} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, year: e.target.value }); }} onBlur={() => loadPeriod(period)} className="w-14 bg-white rounded px-1 py-0.5 text-sm text-center outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {conflict && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /><div className="flex-1"><p className="text-sm text-rose-700 font-semibold">Dữ liệu kỳ này vừa được cập nhật nơi khác.</p><p className="text-xs text-rose-600">Hãy tải lại để tránh ghi đè.</p></div><button onClick={() => loadPeriod(period)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold">Tải lại</button></div>
          )}

          {people.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h2 className="font-bold text-slate-800 text-lg">Kỳ {period.month}/{period.year} chưa có dữ liệu</h2>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                {seedFrom && canManage && <button onClick={() => copyFromPeriod(seedFrom)} className="bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">Sao chép cán bộ từ kỳ {seedFrom.month}/{seedFrom.year}</button>}
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople([np]); setCurId(np.id); }} className="bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm">Thêm cán bộ</button>}
              </div>
            </div>
          )}

          {/* ===== TỔNG QUAN ===== */}
          {people.length > 0 && nav === 'dash' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Users} label="Tổng số cán bộ" value={people.length} grad="bg-gradient-to-br from-slate-700 to-slate-900" />
                <StatCard icon={TrendingUp} label="Điểm trung bình" value={avg.toFixed(1)} grad="bg-gradient-to-br from-red-600 to-red-800" />
                <StatCard icon={Award} label="Hoàn thành xuất sắc" value={dist.A} grad="bg-gradient-to-br from-emerald-500 to-emerald-700" />
                <StatCard icon={Target} label="Mục tiêu (OKR)" value={objectives.length} grad="bg-gradient-to-br from-amber-500 to-orange-600" />
              </div>
              {overCap && <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Vượt trần: {dist.A} "Xuất sắc" trong khi tối đa {Math.floor(dist.B * 0.2)} (20% của {dist.B} "Tốt").</div>}

              <div className="grid lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Target className="w-5 h-5 text-red-700" /> Mục tiêu cấp Văn phòng (OKR)</h2>
                  <div className="space-y-3">
                    {objectives.map((o) => { const pr = objProgress(o.id); const linked = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === o.id && t.catalogId).length; return (
                      <div key={o.id} className="border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2"><p className="font-semibold text-sm text-slate-800">{o.title}</p><span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0"><Link2 className="w-3 h-3" />{linked} NV</span></div>
                        <div className="mt-2 flex items-center gap-3"><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pr === null ? 'bg-slate-200' : statusOf(pr).dot}`} style={{ width: `${pr || 0}%` }} /></div><span className="text-xs font-bold text-slate-600 w-14 text-right">{pr === null ? '—' : `${pr.toFixed(0)}%`}</span></div>
                      </div>
                    ); })}
                    {objectives.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Chưa có mục tiêu. Thêm ở giao diện cổ điển hoặc khi quản trị.</p>}
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-red-700" /> Phân bố xếp loại</h2>
                  <div className="space-y-3">{['A', 'B', 'C', 'D'].map((code) => { const cl = classify(code === 'A' ? 95 : code === 'B' ? 80 : code === 'C' ? 60 : 40); const n = dist[code]; const pct = people.length ? (n / people.length) * 100 : 0; return (
                    <div key={code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">Loại {code} — {cl.name}</span><b className="text-slate-700">{n}</b></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cl.bar}`} style={{ width: `${pct}%` }} /></div></div>
                  ); })}</div>
                </section>
              </div>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-red-700" /> Bảng tổng hợp kết quả</h2></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5">Họ và tên</th><th className="text-left px-3 py-2.5">Chức vụ</th><th className="text-center px-3 py-2.5">Tự ĐG</th><th className="text-center px-3 py-2.5">Cấp duyệt</th><th className="text-center px-3 py-2.5">Xếp loại</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{computed.map(({ p, c }) => { const r = classify(c.totalMgr); return (
                    <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setCurId(p.id); setNav('eval'); }}><td className="px-4 py-3 font-semibold text-slate-700">{p.name || '(Chưa tên)'}</td><td className="px-3 py-3 text-slate-500 text-xs">{p.position || CRITERIA[p.type].label}</td><td className="px-3 py-3 text-center text-slate-500">{c.totalSelf.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{c.totalMgr.toFixed(1)}</td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${r.soft}`}><span className={`w-5 h-5 rounded-full ${r.cls} text-white flex items-center justify-center text-[10px]`}>{r.code}</span></span></td></tr>
                  ); })}</tbody></table></div>
              </section>

              {trends.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between"><h2 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-700" /> Xu hướng theo kỳ</h2><button onClick={refreshTrends} className="text-xs text-slate-500 hover:text-red-700 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Làm mới</button></div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5">Kỳ</th><th className="text-center px-3 py-2.5">Số CB</th><th className="text-center px-3 py-2.5">TB</th><th className="text-center px-3 py-2.5 text-emerald-600">A</th><th className="text-center px-3 py-2.5 text-sky-600">B</th><th className="text-center px-3 py-2.5 text-amber-600">C</th><th className="text-center px-3 py-2.5 text-rose-600">D</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{trends.map((t) => (<tr key={`${t.year}-${t.month}`} className="hover:bg-slate-50"><td className="px-4 py-2.5 font-semibold text-slate-700">T{t.month}/{t.year}</td><td className="px-3 py-2.5 text-center text-slate-500">{t.count}</td><td className="px-3 py-2.5 text-center font-bold">{t.avg.toFixed(1)}</td><td className="px-3 py-2.5 text-center text-emerald-600 font-semibold">{t.dist.A}</td><td className="px-3 py-2.5 text-center text-sky-600 font-semibold">{t.dist.B}</td><td className="px-3 py-2.5 text-center text-amber-600 font-semibold">{t.dist.C}</td><td className="px-3 py-2.5 text-center text-rose-600 font-semibold">{t.dist.D}</td></tr>))}</tbody></table></div>
                </section>
              )}
            </>
          )}

          {/* ===== ĐÁNH GIÁ ===== */}
          {people.length > 0 && nav === 'eval' && cur && (
            <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
              <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-20">
                <div className="p-3 bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-700 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</div>
                <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">{people.map((p) => { const r = classify(computePerson(p).totalMgr); return (
                  <button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 ${curId === p.id ? 'bg-red-50' : 'hover:bg-slate-50'}`}><span className={`w-7 h-7 rounded-full ${r.cls} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>{r.code}</span><div className="min-w-0"><p className={`text-sm font-medium truncate ${curId === p.id ? 'text-red-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 truncate">{p.position || CRITERIA[p.type].label}</p></div></button>
                ); })}</div>
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople((ps) => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 border-t border-slate-100"><Plus className="w-4 h-4" /> Thêm cán bộ</button>}
              </aside>

              <div className="space-y-5">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 grid md:grid-cols-[1fr_auto] gap-5 items-center">
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="block"><span className="text-xs font-semibold text-slate-500">Họ và tên</span><input value={cur.name} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ name: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                      <label className="block"><span className="text-xs font-semibold text-slate-500">Chức vụ</span><input value={cur.position} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ position: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                      <label className="block"><span className="text-xs font-semibold text-slate-500">Phòng / Bộ phận</span><input value={cur.department || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ department: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                      {canManage ? (
                        <label className="block"><span className="text-xs font-semibold text-slate-500">Vai trò</span><select value={cur.role || 'canbo'} onChange={(e) => upCur({ role: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"><option value="canbo">Cán bộ</option><option value="truongphong">Trưởng phòng</option><option value="quantri">Quản trị</option></select></label>
                      ) : (
                        <label className="block"><span className="text-xs font-semibold text-slate-500">Email</span><input value={cur.email || ''} disabled className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" /></label>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">{Object.entries(CRITERIA).map(([k, v]) => (
                      <button key={k} disabled={!(canManage || mgrEditable)} onClick={() => upCur({ type: k, selfScores: {}, mgrScores: {} })} className={`text-left px-3 py-1.5 rounded-lg border text-xs disabled:opacity-60 ${cur.type === k ? 'border-red-500 bg-red-50 text-red-700 font-semibold' : 'border-slate-200 text-slate-500'}`}>{v.mau}</button>
                    ))}</div>
                  </div>
                  <div className="text-center">
                    <Gauge value={curC.totalMgr} />
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${result.soft}`}>{result.name}</span>
                    {!selfEditable && !mgrEditable && <p className="text-[11px] text-slate-400 mt-2">Chế độ chỉ xem</p>}
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-slate-800 text-sm">Nhóm I — Tiêu chí chung</h3><span className="text-xs font-bold text-red-700">{curC.nmgr.toFixed(1)} / 30</span></div>
                  <div className="p-3 space-y-2">
                    {CRITERIA[cur.type].groups.map((g) => { const sub = g.items.reduce((s, it) => s + (cur.mgrScores[it.id] ?? cur.selfScores[it.id] ?? it.max), 0); const isO = open === g.id; return (
                      <div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button onClick={() => setOpen(isO ? null : g.id)} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-left"><span className="text-sm font-semibold text-slate-700">{g.title}</span><span className="flex items-center gap-2 shrink-0"><span className="text-xs font-bold text-red-700">{sub.toFixed(1)}/{g.max}</span><ChevronDown className={`w-4 h-4 text-slate-400 transition ${isO ? 'rotate-180' : ''}`} /></span></button>
                        {isO && <div className="divide-y divide-slate-100">{g.items.map((it) => { const sv = cur.selfScores[it.id] ?? it.max; const mv = cur.mgrScores[it.id] ?? sv; return (
                          <div key={it.id} className="px-3 py-2 flex items-start gap-2"><span className="text-[11px] font-bold text-slate-400 w-7 pt-1">{it.id}</span><p className="flex-1 text-xs text-slate-600 pt-0.5">{it.text}</p><input type="number" min="0" max={it.max} step="0.25" value={sv} disabled={!selfEditable} onChange={(e) => upCur({ selfScores: { ...cur.selfScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-14 text-center bg-slate-50 border border-slate-200 rounded py-1 text-xs disabled:opacity-50" /><input type="number" min="0" max={it.max} step="0.25" value={mv} disabled={!mgrEditable} onChange={(e) => upCur({ mgrScores: { ...cur.mgrScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-14 text-center font-bold text-red-700 bg-red-50 border border-red-200 rounded py-1 text-xs disabled:opacity-50" /></div>
                        ); })}</div>}
                      </div>
                    ); })}
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-slate-800 text-sm">Nhóm II — Kết quả thực hiện nhiệm vụ</h3><span className="text-xs font-bold text-red-700">{curC.nhomII.toFixed(2)} / 70</span></div>
                  <div className="p-3 space-y-3">
                    {(cur.tasks335 || []).map((t, i) => { const sc = task335Score(t); const st = statusOf(sc); return (
                      <div key={t.id} className={`border rounded-xl p-3 ${st.soft} border-slate-200`}>
                        <div className="flex items-center gap-2 mb-2"><span className={`w-2.5 h-2.5 rounded-full ${st.dot} shrink-0`} /><select value={t.catalogId} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-red-400 disabled:opacity-60"><option value="">— Chọn công việc từ danh mục —</option>{getND335Groups(cur.type).map((c) => <option key={c.id} value={c.id}>[{c.id}] {c.name} (HS {c.maxScore})</option>)}</select><span className={`text-[11px] font-bold ${st.txt}`}>{sc.toFixed(0)}%</span>{taskEditable && (cur.tasks335 || []).length > 1 && <button onClick={() => upCur({ tasks335: (cur.tasks335 || []).filter((x) => x.id !== t.id) })} className="text-rose-400 hover:bg-rose-100 p-1 rounded"><Trash2 className="w-4 h-4" /></button>}</div>
                        <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={t.objId || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-red-400 disabled:opacity-60"><option value="">— Liên kết mục tiêu (OKR) —</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[['Số lượng giao', 'assigned', 1], ['Số lượng HT', 'completed', 0], ['Lỗi chất lượng', 'qualityIssues', 0], ['Chậm tiến độ', 'delays', 0]].map(([lb, key, mn]) => (
                          <label key={key} className="block"><span className="text-[10px] font-semibold text-slate-400">{lb}</span><input type="number" min={mn} value={t[key]} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { [key]: Math.max(mn, Number(e.target.value)) })} className="mt-0.5 w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-semibold outline-none focus:border-red-400 disabled:opacity-50" /></label>
                        ))}</div>
                      </div>
                    ); })}
                    {taskEditable && <button onClick={() => upCur({ tasks335: [...(cur.tasks335 || []), newTask335()] })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>}
                    <div className="grid grid-cols-4 gap-2 text-center">{[['Khối lượng', curC.k.a], ['Chất lượng', curC.k.b], ['Tiến độ', curC.k.c], ['Trung bình', curC.k.val]].map(([l, v], idx) => (
                      <div key={l} className={`${idx === 3 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-600'} rounded-lg py-2 border`}><p className="text-[10px]">{l}</p><p className="font-bold text-sm">{Number(v).toFixed(1)}%</p></div>
                    ))}</div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
                  <label className="block"><span className="text-xs font-semibold text-slate-500">Điểm trừ</span><input type="number" min="0" value={cur.deduction} disabled={!mgrEditable} onChange={(e) => upCur({ deduction: e.target.value })} className="mt-1 w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                  <label className="block"><span className="text-xs font-semibold text-slate-500">Ý kiến tự nhận xét</span><textarea value={cur.selfNote} disabled={!selfEditable} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                  <label className="block"><span className="text-xs font-semibold text-slate-500">Nhận xét của cấp có thẩm quyền</span><textarea value={cur.mgrNote} disabled={!mgrEditable} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 disabled:bg-slate-50" /></label>
                  <div className="flex gap-2">
                    <button onClick={doWord} className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded-xl text-sm"><FileText className="w-4 h-4" /> Xuất phiếu Word</button>
                    {!isGuest && <button onClick={handleSave} disabled={cloud.saving} className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-60"><RotateCcw className="w-4 h-4" /> Lưu ngay</button>}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        <footer className="px-6 py-5 text-center text-xs text-slate-400">Phiên bản mới • OKR/KPI theo Quy định của Tỉnh ủy Thanh Hóa & NĐ 335/2025/NĐ-CP • Bản demo nội bộ</footer>
      </main>
    </div>
  );
}
