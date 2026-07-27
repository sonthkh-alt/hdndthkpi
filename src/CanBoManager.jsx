import React, { useMemo, useState } from 'react';
import {
  Users, BellRing, CalendarClock, ClipboardList, Building2, Search, Plus, Trash2,
  FileText, Save, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, UserPlus, RotateCcw, Cake, TrendingUp,
} from 'lucide-react';
import {
  HR_CATEGORY, catOf, HR_NGACH, ngachOf, hesoOf, HR_GENDER, HR_REPEAT,
  newStaff, newTraining, newHistory, newFamily, newDuty,
  buildAlerts, ALERT_META, LEVEL_TONE, headcount, nextRaise, retireDate, nextBirthday,
  fmtD, daysTo, ageAt, addMonths, toDate, DEFAULT_LEAD,
} from './lib/hr';
import { seedStaff, seedDuties, SEED_QUOTA } from './lib/hrSeed';

// ============================================================================
// MODULE QUẢN LÝ CÁN BỘ (chỉ tài khoản Quản trị)
//  • Nhắc việc: nâng lương, nghỉ hưu, sinh nhật, hợp đồng, bổ nhiệm, nhiệm vụ có hạn, biên chế
//  • Hồ sơ cán bộ theo mẫu Sơ yếu lý lịch 2C/TCTW-98
//  • Nhiệm vụ, báo cáo có thời hạn (một lần / định kỳ) · Biên chế được giao so với thực có
// ============================================================================

const SUBTABS = [
  { id: 'alerts', label: 'Nhắc việc', icon: BellRing },
  { id: 'list', label: 'Danh sách cán bộ', icon: Users },
  { id: 'duties', label: 'Nhiệm vụ có thời hạn', icon: ClipboardList },
  { id: 'quota', label: 'Biên chế', icon: Building2 },
];

const dayLabel = (d) => (d == null ? '' : d < 0 ? `quá ${-d} ngày` : d === 0 ? 'hôm nay' : `còn ${d} ngày`);

export default function CanBoManager({ data, onChange, onSave, saving, canEdit = true, onExportProfile, defaultSub = 'alerts', defaultOpenId = null }) {
  const [sub, setSub] = useState(defaultSub);   // khu vực mở sẵn (nhắc việc / danh sách / nhiệm vụ / biên chế)
  const [q, setQ] = useState('');
  const [fCat, setFCat] = useState('');
  const [fDept, setFDept] = useState('');
  const [openId, setOpenId] = useState(defaultOpenId);
  const [fType, setFType] = useState('');

  // Giữ tham chiếu ổn định để useMemo bên dưới không tính lại toàn bộ cảnh báo sau mỗi lần gõ phím.
  const staff = useMemo(() => data.staff || [], [data.staff]);
  const duties = useMemo(() => data.duties || [], [data.duties]);
  const quota = useMemo(() => data.quota || {}, [data.quota]);
  const lead = useMemo(() => ({ ...DEFAULT_LEAD, ...(data.lead || {}) }), [data.lead]);

  const alerts = useMemo(() => buildAlerts(staff, duties, quota, lead), [staff, duties, quota, lead]);
  const hc = useMemo(() => headcount(staff, quota), [staff, quota]);
  const depts = useMemo(() => [...new Set(staff.map((s) => s.department).filter(Boolean))].sort(), [staff]);

  const upStaff = (id, patch) => onChange({ staff: staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const upDuty = (id, patch) => onChange({ duties: duties.map((d) => (d.id === id ? { ...d, ...patch } : d)) });

  const filtered = staff.filter((s) => {
    const kw = q.trim().toLowerCase();
    if (kw && !`${s.name} ${s.position} ${s.department} ${s.email}`.toLowerCase().includes(kw)) return false;
    if (fCat && s.category !== fCat) return false;
    if (fDept && s.department !== fDept) return false;
    return true;
  });

  const counts = {
    overdue: alerts.filter((a) => a.level === 'overdue').length,
    urgent: alerts.filter((a) => a.level === 'urgent').length,
    soon: alerts.filter((a) => a.level === 'soon').length,
  };
  const sampleCount = staff.filter((s) => s.sample).length;

  const loadSeed = () => {
    if (!window.confirm('Nạp danh sách cán bộ chuẩn (đại biểu chuyên trách + CBCC-NLĐ Văn phòng) kèm nhiệm vụ và chỉ tiêu biên chế mẫu?\n\nToàn bộ hồ sơ hiện có trong module này sẽ bị thay thế.')) return;
    onChange({ staff: seedStaff(), duties: seedDuties(), quota: { ...SEED_QUOTA } });
  };

  return (
    <div className="space-y-4">
      {/* ------- Thanh tiêu đề + hành động ------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 font-bold"><Users className="w-5 h-5 text-amber-300" /> Quản lý cán bộ</h2>
          <span className="text-[11px] text-slate-300">Đại biểu Quốc hội, HĐND tỉnh chuyên trách và cán bộ, công chức, người lao động Văn phòng</span>
          <div className="ml-auto flex items-center gap-2">
            {canEdit && <button onClick={loadSeed} title="Nạp danh sách cán bộ chuẩn kèm dữ liệu mẫu" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold"><RotateCcw className="w-3.5 h-3.5" /> Nạp danh sách chuẩn</button>}
            {canEdit && <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 text-amber-950 hover:bg-amber-200 disabled:opacity-60 rounded-lg text-xs font-bold"><Save className="w-3.5 h-3.5" /> {saving ? 'Đang lưu…' : 'Lưu hồ sơ'}</button>}
          </div>
        </div>
        <div className="px-4 py-2.5 flex gap-1.5 flex-wrap border-b border-slate-100">
          {SUBTABS.map((t) => { const Ic = t.icon; const on = sub === t.id;
            return (<button key={t.id} onClick={() => setSub(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              <Ic className="w-3.5 h-3.5" /> {t.label}
              {t.id === 'alerts' && alerts.length > 0 && <span className={`px-1.5 rounded-full text-[10px] font-bold ${on ? 'bg-white/20' : 'bg-rose-100 text-rose-700'}`}>{alerts.length}</span>}
            </button>); })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
          <MiniStat icon={AlertTriangle} label="Quá hạn / vượt chỉ tiêu" value={counts.overdue} tone="rose" />
          <MiniStat icon={BellRing} label="Cần xử lý ngay" value={counts.urgent} tone="amber" />
          <MiniStat icon={CalendarClock} label="Sắp đến hạn" value={counts.soon} tone="slate" />
          <MiniStat icon={Users} label="Tổng số cán bộ" value={staff.filter((s) => s.active !== false).length} tone="sky" />
        </div>
        {sampleCount > 0 && (
          <p className="mx-4 mb-4 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 leading-relaxed">
            <b>⚠ {sampleCount} hồ sơ đang dùng dữ liệu mô phỏng.</b> Họ tên, chức vụ, đơn vị là thật; các thông tin còn lại (ngày sinh, ngạch/bậc lương, ngày hưởng lương, hợp đồng…) là số liệu minh họa để chạy thử chức năng nhắc việc — cần đối chiếu hồ sơ gốc và bỏ đánh dấu "dữ liệu mô phỏng" trong từng hồ sơ.
          </p>
        )}
      </section>

      {/* ------- Nhắc việc ------- */}
      {sub === 'alerts' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><BellRing className="w-4 h-4 text-amber-500" /> Việc cần theo dõi, xử lý</h3>
            <div className="ml-auto flex gap-1.5 flex-wrap">
              <button onClick={() => setFType('')} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${!fType ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Tất cả ({alerts.length})</button>
              {Object.entries(ALERT_META).map(([k, m]) => { const n = alerts.filter((a) => a.type === k).length; if (!n) return null;
                return <button key={k} onClick={() => setFType(fType === k ? '' : k)} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${fType === k ? 'bg-slate-800 text-white border-slate-800' : `${m.tone} hover:opacity-80`}`}>{m.label} ({n})</button>; })}
            </div>
          </div>
          <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {alerts.length === 0 && <p className="text-center text-sm text-slate-400 py-8 flex flex-col items-center gap-2"><CheckCircle2 className="w-8 h-8 text-emerald-400" /> Không có việc nào đến hạn trong thời gian theo dõi.</p>}
            {alerts.filter((a) => !fType || a.type === fType).map((a, i) => {
              const m = ALERT_META[a.type] || { label: a.type, tone: 'bg-slate-50 text-slate-600 border-slate-200' };
              return (
                <div key={i} className={`rounded-xl border p-3 ${LEVEL_TONE[a.level]}`}>
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.tone}`}>{m.label}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug">{a.who}{a.who && a.title ? ' — ' : ''}{a.title}</p>
                      {a.detail && <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">{a.detail}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      {a.date && <p className="text-xs font-bold">{fmtD(a.date)}</p>}
                      <p className="text-[11px] font-semibold opacity-90">{dayLabel(a.days)}</p>
                    </div>
                    {a.staffId && <button onClick={() => { setSub('list'); setOpenId(a.staffId); }} className="shrink-0 text-[11px] font-semibold underline underline-offset-2 hover:opacity-70">Mở hồ sơ</button>}
                    {a.dutyId && canEdit && <button onClick={() => upDuty(a.dutyId, { done: true, doneAt: new Date().toISOString().slice(0, 10) })} className="shrink-0 text-[11px] font-semibold underline underline-offset-2 hover:opacity-70">Đánh dấu xong</button>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[['raise', 'Nâng lương'], ['retire', 'Nghỉ hưu'], ['birthday', 'Sinh nhật'], ['contract', 'Hợp đồng'], ['appoint', 'Bổ nhiệm'], ['duty', 'Nhiệm vụ']].map(([k, lb]) => (
              <label key={k} className="block">
                <span className="text-[10px] font-semibold text-slate-500">Báo trước — {lb} (ngày)</span>
                <input type="number" min="1" value={lead[k]} disabled={!canEdit} onChange={(e) => onChange({ lead: { ...lead, [k]: Math.max(1, Number(e.target.value) || 1) } })} className="mt-0.5 w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none focus:border-slate-400 disabled:bg-slate-50" />
              </label>
            ))}
          </div>
        </section>
      )}

      {/* ------- Danh sách cán bộ ------- */}
      {sub === 'list' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên, chức vụ, đơn vị…" className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400" />
            </div>
            <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-slate-400">
              <option value="">— Tất cả đối tượng —</option>
              {HR_CATEGORY.map((c) => <option key={c.k} value={c.k}>{c.label}</option>)}
            </select>
            <select value={fDept} onChange={(e) => setFDept(e.target.value)} className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-slate-400 max-w-[220px]">
              <option value="">— Tất cả đơn vị —</option>
              {depts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {canEdit && <button onClick={() => { const s = newStaff('Cán bộ mới'); onChange({ staff: [...staff, s] }); setOpenId(s.id); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"><UserPlus className="w-3.5 h-3.5" /> Thêm</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="text-left px-3 py-2 font-semibold">Họ và tên</th>
                  <th className="text-left px-3 py-2 font-semibold">Chức vụ · Đơn vị</th>
                  <th className="text-center px-2 py-2 font-semibold">Đối tượng</th>
                  <th className="text-center px-2 py-2 font-semibold">Ngày sinh</th>
                  <th className="text-center px-2 py-2 font-semibold">Ngạch · Bậc</th>
                  <th className="text-center px-2 py-2 font-semibold">Nâng lương</th>
                  <th className="text-center px-2 py-2 font-semibold">Nghỉ hưu</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-slate-400 py-8 text-sm">Không có cán bộ nào khớp bộ lọc.</td></tr>}
                {filtered.map((s) => {
                  const c = catOf(s.category); const ng = ngachOf(s.ngach);
                  const r = nextRaise(s); const rd = retireDate(s.birth, s.gender);
                  const dR = r ? daysTo(r.date) : null, dRet = rd ? daysTo(rd) : null;
                  const open = openId === s.id;
                  return (
                    <React.Fragment key={s.id}>
                      <tr className={`hover:bg-slate-50 cursor-pointer ${open ? 'bg-slate-50' : ''}`} onClick={() => setOpenId(open ? null : s.id)}>
                        <td className="px-3 py-2">
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                            {s.name || '(chưa có tên)'}
                            {s.sample && <span title="Hồ sơ đang dùng dữ liệu mô phỏng" className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded px-1">mẫu</span>}
                          </span>
                          {s.email && <span className="text-[11px] text-slate-400 ml-5">{s.email}</span>}
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-600">{s.position}<span className="block text-[11px] text-slate-400">{s.department}</span></td>
                        <td className="px-2 py-2 text-center"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${c.tone}`}>{c.short}</span></td>
                        <td className="px-2 py-2 text-center text-xs text-slate-600">{fmtD(s.birth)}{s.birth && <span className="block text-[10px] text-slate-400">{ageAt(s.birth)} tuổi</span>}</td>
                        <td className="px-2 py-2 text-center text-xs text-slate-600">{ng.name}<span className="block text-[10px] text-slate-400">bậc {s.bac}/{ng.bacMax} · {s.heso}{s.vuotKhungPct > 0 ? ` · VK ${s.vuotKhungPct}%` : ''}</span></td>
                        <td className="px-2 py-2 text-center text-xs">{r ? (<><span className="text-slate-600">{fmtD(r.date)}</span><span className={`block text-[10px] font-semibold ${dR != null && dR <= 90 ? 'text-emerald-600' : 'text-slate-400'}`}>{dayLabel(dR)}</span></>) : <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-center text-xs">{rd ? (<><span className="text-slate-600">{fmtD(rd)}</span><span className={`block text-[10px] font-semibold ${dRet != null && dRet <= 180 ? 'text-amber-600' : 'text-slate-400'}`}>{dayLabel(dRet)}</span></>) : <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-center">
                          {onExportProfile && <button onClick={(e) => { e.stopPropagation(); onExportProfile(s); }} title="Xuất Sơ yếu lý lịch 2C ra Word" className="text-slate-400 hover:text-sky-600 p-1"><FileText className="w-4 h-4" /></button>}
                        </td>
                      </tr>
                      {open && (
                        <tr><td colSpan={8} className="p-0 bg-slate-50/60">
                          <StaffProfile s={s} canEdit={canEdit} onPatch={(p) => upStaff(s.id, p)}
                            onDelete={() => { if (window.confirm(`Xóa hồ sơ "${s.name}"? Không thể hoàn tác.`)) { onChange({ staff: staff.filter((x) => x.id !== s.id) }); setOpenId(null); } }}
                            onExport={onExportProfile ? () => onExportProfile(s) : null} />
                        </td></tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2.5 text-[11px] text-slate-400 border-t border-slate-100">Hiển thị {filtered.length}/{staff.length} hồ sơ. Bấm vào dòng để mở hồ sơ đầy đủ theo mẫu 2C/TCTW-98.</p>
        </section>
      )}

      {/* ------- Nhiệm vụ có thời hạn ------- */}
      {sub === 'duties' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4 text-indigo-500" /> Nhiệm vụ, báo cáo có thời hạn</h3>
            {canEdit && <button onClick={() => onChange({ duties: [...duties, newDuty()] })} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Thêm nhiệm vụ</button>}
          </div>
          <div className="p-3 space-y-2">
            {duties.length === 0 && <p className="text-center text-sm text-slate-400 py-8">Chưa có nhiệm vụ nào. Thêm các công việc có thời hạn (báo cáo định kỳ, rà soát nâng lương, kê khai tài sản…) để phần mềm tự nhắc.</p>}
            {duties.map((d) => {
              const due = d.done ? null : toDate(d.due);
              const dd = due ? daysTo(due) : null;
              return (
                <div key={d.id} className={`rounded-xl border p-3 ${d.done ? 'bg-slate-50 border-slate-200 opacity-70' : dd != null && dd < 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={!!d.done} disabled={!canEdit} onChange={(e) => upDuty(d.id, { done: e.target.checked, doneAt: e.target.checked ? new Date().toISOString().slice(0, 10) : '' })} className="w-4 h-4 accent-emerald-600" title="Đánh dấu đã hoàn thành" />
                    <input value={d.title} disabled={!canEdit} onChange={(e) => upDuty(d.id, { title: e.target.value })} placeholder="Tên nhiệm vụ / báo cáo…" className={`flex-1 bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-slate-400 text-sm font-semibold text-slate-800 outline-none py-0.5 ${d.done ? 'line-through' : ''}`} />
                    {canEdit && <button onClick={() => { if (window.confirm('Xóa nhiệm vụ này?')) onChange({ duties: duties.filter((x) => x.id !== d.id) }); }} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <L label="Đơn vị / người phụ trách"><input value={d.owner || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { owner: e.target.value })} className="inp2" /></L>
                    <L label="Hạn hoàn thành"><input type="date" value={d.due || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { due: e.target.value })} className="inp2" /></L>
                    <L label="Chu kỳ lặp"><select value={d.repeat || 'once'} disabled={!canEdit} onChange={(e) => upDuty(d.id, { repeat: e.target.value })} className="inp2">{HR_REPEAT.map((r) => <option key={r.k} value={r.k}>{r.label}</option>)}</select></L>
                    <L label="Báo trước (ngày)"><input type="number" min="1" value={d.lead ?? 15} disabled={!canEdit} onChange={(e) => upDuty(d.id, { lead: Math.max(1, Number(e.target.value) || 1) })} className="inp2" /></L>
                    <L label="Ghi chú"><input value={d.note || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { note: e.target.value })} className="inp2" /></L>
                  </div>
                  {!d.done && due && <p className="mt-1.5 text-[11px] text-slate-500">Hạn kế tiếp: <b className={dd < 0 ? 'text-rose-600' : dd <= (d.lead ?? 15) ? 'text-amber-600' : 'text-slate-600'}>{fmtD(due)}</b> · {dayLabel(dd)}</p>}
                  {d.done && d.doneAt && <p className="mt-1.5 text-[11px] text-emerald-600">Đã hoàn thành ngày {fmtD(d.doneAt)}.</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ------- Biên chế ------- */}
      {sub === 'quota' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-rose-500" /> Biên chế được giao và thực có</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Nhập chỉ tiêu biên chế theo quyết định giao; phần mềm tự so sánh với số người thực có và cảnh báo thừa/thiếu.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="text-left px-3 py-2 font-semibold">Đơn vị</th>
                  <th className="text-center px-2 py-2 font-semibold">Chỉ tiêu công chức</th>
                  <th className="text-center px-2 py-2 font-semibold">Thực có</th>
                  <th className="text-center px-2 py-2 font-semibold">Chênh lệch</th>
                  <th className="text-center px-2 py-2 font-semibold">Chỉ tiêu hợp đồng</th>
                  <th className="text-center px-2 py-2 font-semibold">Thực có</th>
                  <th className="text-center px-2 py-2 font-semibold">Chênh lệch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hc.rows.map((r) => (
                  <tr key={r.dept} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-xs font-medium text-slate-700">{r.dept}</td>
                    <td className="px-2 py-2 text-center"><input type="number" min="0" value={r.qcc} disabled={!canEdit} onChange={(e) => onChange({ quota: { ...quota, [r.dept]: { ...(quota[r.dept] || {}), cc: Math.max(0, Number(e.target.value) || 0) } } })} className="w-16 bg-white border border-slate-200 rounded px-1 py-1 text-xs text-center outline-none focus:border-slate-400 disabled:bg-slate-50" /></td>
                    <td className="px-2 py-2 text-center text-xs font-semibold text-slate-700">{r.cc}</td>
                    <td className="px-2 py-2 text-center"><Delta v={r.dCc} on={r.qcc > 0} /></td>
                    <td className="px-2 py-2 text-center"><input type="number" min="0" value={r.qhd} disabled={!canEdit} onChange={(e) => onChange({ quota: { ...quota, [r.dept]: { ...(quota[r.dept] || {}), hd: Math.max(0, Number(e.target.value) || 0) } } })} className="w-16 bg-white border border-slate-200 rounded px-1 py-1 text-xs text-center outline-none focus:border-slate-400 disabled:bg-slate-50" /></td>
                    <td className="px-2 py-2 text-center text-xs font-semibold text-slate-700">{r.hd}</td>
                    <td className="px-2 py-2 text-center"><Delta v={r.dHd} on={r.qhd > 0} /></td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="px-3 py-2 text-xs text-slate-700">TỔNG CỘNG</td>
                  <td className="px-2 py-2 text-center text-xs">{hc.sum.qcc}</td>
                  <td className="px-2 py-2 text-center text-xs">{hc.sum.cc}</td>
                  <td className="px-2 py-2 text-center"><Delta v={hc.sum.dCc} on={hc.sum.qcc > 0} /></td>
                  <td className="px-2 py-2 text-center text-xs">{hc.sum.qhd}</td>
                  <td className="px-2 py-2 text-center text-xs">{hc.sum.hd}</td>
                  <td className="px-2 py-2 text-center"><Delta v={hc.sum.dHd} on={hc.sum.qhd > 0} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <style>{`.inp2{width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:.45rem;padding:.3rem .5rem;font-size:.75rem;color:#334155;outline:none}.inp2:focus{border-color:#94a3b8}.inp2:disabled{background:#f8fafc;color:#64748b}`}</style>
    </div>
  );
}

// ---------------------------------------------------------------- Phụ trợ
function MiniStat({ icon: Icon, label, value, tone }) {
  const map = { rose: 'bg-rose-100 text-rose-700', amber: 'bg-amber-100 text-amber-700', slate: 'bg-slate-100 text-slate-600', sky: 'bg-sky-100 text-sky-700' };
  return (<div className="rounded-xl border border-slate-200 p-3 flex items-center gap-2.5">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${map[tone]}`}><Icon className="w-4 h-4" /></div>
    <div className="min-w-0"><p className="text-xl font-extrabold text-slate-800 leading-none">{value}</p><p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p></div>
  </div>);
}
function Delta({ v, on }) {
  if (!on) return <span className="text-slate-300 text-xs">—</span>;
  if (v === 0) return <span className="text-[11px] font-bold text-emerald-600">đủ</span>;
  return <span className={`text-[11px] font-bold ${v > 0 ? 'text-rose-600' : 'text-amber-600'}`}>{v > 0 ? `thừa ${v}` : `thiếu ${-v}`}</span>;
}
function L({ label, children }) {
  return (<label className="block"><span className="text-[10px] font-semibold text-slate-500 block mb-0.5">{label}</span>{children}</label>);
}
function Sec({ title, children, def = false }) {
  const [open, setOpen] = useState(def);
  return (<div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
    <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left">
      {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      <span className="text-xs font-bold text-slate-700">{title}</span>
    </button>
    {open && <div className="p-3">{children}</div>}
  </div>);
}

// ---------------------------------------------------------------- Hồ sơ 2C
function StaffProfile({ s, canEdit, onPatch, onDelete, onExport }) {
  const ng = ngachOf(s.ngach);
  const r = nextRaise(s), rd = retireSafe(s), bd = nextBirthday(s.birth);
  const T = (k, props = {}) => (<input value={s[k] ?? ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2" {...props} />);
  const D = (k) => (<input type="date" value={s[k] || ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2" />);
  const A = (k, rows = 2) => (<textarea rows={rows} value={s[k] || ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2 resize-y" />);
  const rowUp = (key, id, patch) => onPatch({ [key]: (s[key] || []).map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rowDel = (key, id) => onPatch({ [key]: (s[key] || []).filter((x) => x.id !== id) });

  return (
    <div className="p-3 space-y-2.5">
      {/* Tóm tắt mốc thời gian */}
      <div className="grid sm:grid-cols-3 gap-2">
        <Badge icon={TrendingUp} tone="emerald" title="Nâng lương kế tiếp" main={r ? fmtD(r.date) : '— chưa có ngày hưởng lương'} sub={r ? `${r.label} · ${dayLabel(daysTo(r.date))}` : 'Nhập "Ngày hưởng bậc lương hiện tại"'} />
        <Badge icon={CalendarClock} tone="amber" title="Thời điểm nghỉ hưu" main={rd ? fmtD(rd) : '—'} sub={rd ? `${dayLabel(daysTo(rd))} · theo NĐ 135/2020` : 'Nhập ngày sinh và giới tính'} />
        <Badge icon={Cake} tone="pink" title="Sinh nhật" main={bd ? fmtD(bd) : '—'} sub={bd ? `Tròn ${ageAt(s.birth, bd)} tuổi · ${dayLabel(daysTo(bd))}` : ''} />
      </div>

      <Sec title="I. Thông tin nhân thân (mục 1–9 Mẫu 2C)" def>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="1. Họ và tên khai sinh">{T('name')}</L>
          <L label="2. Tên gọi khác">{T('otherName')}</L>
          <L label="3. Ngày sinh">{D('birth')}</L>
          <L label="Giới tính"><select value={s.gender || 'nam'} disabled={!canEdit} onChange={(e) => onPatch({ gender: e.target.value })} className="inp2">{HR_GENDER.map((g) => <option key={g.k} value={g.k}>{g.label}</option>)}</select></L>
          <L label="4. Nơi sinh">{T('birthPlace')}</L>
          <L label="5. Quê quán">{T('hometown')}</L>
          <L label="6. Dân tộc">{T('ethnic')}</L>
          <L label="7. Tôn giáo">{T('religion')}</L>
          <L label="8. Hộ khẩu thường trú">{T('residence')}</L>
          <L label="9. Nơi ở hiện nay">{T('address')}</L>
          <L label="Điện thoại">{T('phone')}</L>
          <L label="Email">{T('email')}</L>
        </div>
      </Sec>

      <Sec title="II. Tuyển dụng, chức vụ, công việc (mục 10–13)" def>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="Đối tượng quản lý"><select value={s.category} disabled={!canEdit} onChange={(e) => onPatch({ category: e.target.value })} className="inp2">{HR_CATEGORY.map((c) => <option key={c.k} value={c.k}>{c.label}</option>)}</select></L>
          <L label="10. Nghề nghiệp khi được tuyển dụng">{T('jobWhenHired')}</L>
          <L label="11. Ngày tuyển dụng">{D('hireDate')}</L>
          <L label="Cơ quan tuyển dụng">{T('hireAgency')}</L>
          <L label="12. Chức vụ (chính quyền)">{T('position')}</L>
          <L label="Đơn vị công tác">{T('department')}</L>
          <L label="Chức vụ về Đảng">{T('partyPosition')}</L>
          <L label="Chức vụ đoàn thể">{T('unionPosition')}</L>
          <L label="13. Công việc chính được giao">{T('mainWork')}</L>
          <L label="Ngày bổ nhiệm chức vụ">{D('appointDate')}</L>
          <L label="Thời hạn giữ chức vụ (tháng)"><input type="number" min="0" value={s.appointTerm ?? 60} disabled={!canEdit} onChange={(e) => onPatch({ appointTerm: Math.max(0, Number(e.target.value) || 0) })} className="inp2" /></L>
          {s.appointDate && Number(s.appointTerm) > 0 && <L label="Hết thời hạn giữ chức vụ"><p className="text-xs font-semibold text-slate-600 pt-1">{fmtD(addMonths(toDate(s.appointDate), Number(s.appointTerm)))}</p></L>}
        </div>
      </Sec>

      <Sec title="III. Ngạch, bậc lương và hợp đồng (mục 14)" def>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="Ngạch công chức"><select value={s.ngach} disabled={!canEdit} onChange={(e) => onPatch({ ngach: e.target.value, bac: 1, heso: hesoOf(e.target.value, 1), vuotKhungPct: 0 })} className="inp2">{HR_NGACH.map((n) => <option key={n.code} value={n.code}>{n.name} ({n.code})</option>)}</select></L>
          <L label={`Bậc lương (tối đa ${ng.bacMax})`}><input type="number" min="1" max={ng.bacMax} value={s.bac} disabled={!canEdit} onChange={(e) => { const b = Math.min(Math.max(1, Number(e.target.value) || 1), ng.bacMax); onPatch({ bac: b, heso: hesoOf(s.ngach, b) }); }} className="inp2" /></L>
          <L label="Hệ số lương"><input type="number" step="0.01" value={s.heso} disabled={!canEdit} onChange={(e) => onPatch({ heso: Number(e.target.value) || 0 })} className="inp2" /></L>
          <L label="Ngày hưởng bậc lương hiện tại">{D('salaryDate')}</L>
          <L label="Phụ cấp thâm niên vượt khung (%)"><input type="number" min="0" value={s.vuotKhungPct || 0} disabled={!canEdit} onChange={(e) => onPatch({ vuotKhungPct: Math.max(0, Number(e.target.value) || 0) })} className="inp2" /></L>
          <L label="Loại hợp đồng (nếu có)">{T('contractType')}</L>
          <L label="Hợp đồng từ ngày">{D('contractFrom')}</L>
          <L label="Hợp đồng đến ngày">{D('contractTo')}</L>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-2 leading-relaxed">
          Chu kỳ nâng bậc lương thường xuyên của ngạch <b>{ng.name}</b> (loại {ng.cls}) là <b>{ng.cycle} tháng</b> theo Thông tư 08/2013/TT-BNV.
          Khi đã ở bậc cuối ({ng.bacMax}), sau {ng.cycle} tháng được hưởng phụ cấp thâm niên vượt khung 5%, mỗi năm tiếp theo cộng thêm 1%.
        </p>
      </Sec>

      <Sec title="IV. Trình độ (mục 15–20)">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="15. Giáo dục phổ thông">{T('eduGeneral')}</L>
          <L label="16. Chuyên môn cao nhất">{T('eduMajor')}</L>
          <L label="Học hàm, học vị">{T('eduDegree')}</L>
          <L label="17. Lý luận chính trị">{T('politics')}</L>
          <L label="18. Quản lý nhà nước">{T('stateAdmin')}</L>
          <L label="19. Ngoại ngữ">{T('foreignLang')}</L>
          <L label="20. Tin học">{T('it')}</L>
        </div>
      </Sec>

      <Sec title="V. Đảng, đoàn thể, quân ngũ, danh hiệu (mục 21–24)">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="21. Ngày vào Đảng">{D('partyDate')}</L>
          <L label="Ngày chính thức">{D('partyOfficialDate')}</L>
          <L label="22. Ngày tham gia tổ chức chính trị - xã hội">{D('unionDate')}</L>
          <L label="23. Ngày nhập ngũ">{D('armyIn')}</L>
          <L label="Ngày xuất ngũ">{D('armyOut')}</L>
          <L label="Quân hàm cao nhất">{T('armyRank')}</L>
          <L label="24. Danh hiệu được phong tặng">{T('honour')}</L>
        </div>
      </Sec>

      <Sec title="VI. Thông tin khác (mục 25–31)">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <L label="25. Sở trường công tác">{T('strength')}</L>
          <L label="28. Tình trạng sức khỏe">{T('health')}</L>
          <L label="Chiều cao (cm)">{T('height')}</L>
          <L label="Cân nặng (kg)">{T('weight')}</L>
          <L label="Nhóm máu">{T('bloodType')}</L>
          <L label="29. Thương binh / con gia đình chính sách">{T('policyFamily')}</L>
          <L label="30. Số CCCD">{T('idNumber')}</L>
          <L label="Ngày cấp">{D('idDate')}</L>
          <L label="Nơi cấp">{T('idPlace')}</L>
          <L label="31. Số sổ BHXH">{T('insuranceNo')}</L>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <L label="26. Khen thưởng">{A('reward')}</L>
          <L label="27. Kỷ luật">{A('discipline')}</L>
        </div>
      </Sec>

      <Sec title="VII. Đào tạo, bồi dưỡng (mục 32)">
        <TableEdit rows={s.training || []} canEdit={canEdit}
          cols={[['from', 'Từ tháng/năm'], ['to', 'Đến tháng/năm'], ['school', 'Tên trường / cơ sở đào tạo'], ['major', 'Chuyên ngành'], ['form', 'Hình thức'], ['degree', 'Văn bằng, chứng chỉ']]}
          onAdd={() => onPatch({ training: [...(s.training || []), newTraining()] })}
          onUp={(id, p) => rowUp('training', id, p)} onDel={(id) => rowDel('training', id)} addLabel="Thêm khóa đào tạo" />
      </Sec>

      <Sec title="VIII. Tóm tắt quá trình công tác (mục 33)">
        <TableEdit rows={s.history || []} canEdit={canEdit}
          cols={[['from', 'Từ tháng/năm'], ['to', 'Đến tháng/năm'], ['content', 'Chức danh, chức vụ, đơn vị công tác']]}
          onAdd={() => onPatch({ history: [...(s.history || []), newHistory()] })}
          onUp={(id, p) => rowUp('history', id, p)} onDel={(id) => rowDel('history', id)} addLabel="Thêm giai đoạn công tác" />
      </Sec>

      <Sec title="IX. Quan hệ gia đình (mục 35)">
        <TableEdit rows={s.family || []} canEdit={canEdit}
          cols={[['relation', 'Quan hệ'], ['name', 'Họ và tên'], ['birth', 'Năm sinh'], ['info', 'Nghề nghiệp, chức danh, đơn vị công tác']]}
          onAdd={() => onPatch({ family: [...(s.family || []), newFamily()] })}
          onUp={(id, p) => rowUp('family', id, p)} onDel={(id) => rowDel('family', id)} addLabel="Thêm thành viên" />
      </Sec>

      <Sec title="X. Lịch sử bản thân, kinh tế gia đình, nhận xét (mục 34, 36, 37)">
        <div className="space-y-2">
          <L label="34. Đặc điểm lịch sử bản thân">{A('selfHistory', 3)}</L>
          <L label="36. Hoàn cảnh kinh tế gia đình">{A('economy', 2)}</L>
          <L label="37. Nhận xét, đánh giá của cơ quan quản lý">{A('remark', 3)}</L>
          <L label="Ghi chú nội bộ">{A('note', 2)}</L>
        </div>
      </Sec>

      <div className="flex items-center gap-3 flex-wrap pt-1">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
          <input type="checkbox" checked={s.active !== false} disabled={!canEdit} onChange={(e) => onPatch({ active: e.target.checked })} className="w-3.5 h-3.5 accent-emerald-600" /> Đang công tác
        </label>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700" title="Bỏ dấu này sau khi đã đối chiếu, cập nhật đúng hồ sơ gốc">
          <input type="checkbox" checked={!!s.sample} disabled={!canEdit} onChange={(e) => onPatch({ sample: e.target.checked })} className="w-3.5 h-3.5 accent-amber-600" /> Dữ liệu mô phỏng (chưa đối chiếu hồ sơ gốc)
        </label>
        {onExport && <button onClick={onExport} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold"><FileText className="w-3.5 h-3.5" /> Xuất lý lịch 2C (Word)</button>}
        {canEdit && <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"><Trash2 className="w-3.5 h-3.5" /> Xóa hồ sơ</button>}
      </div>
    </div>
  );
}

function retireSafe(s) { try { return retireDate(s.birth, s.gender); } catch { return null; } }

function Badge({ icon: Icon, tone, title, main, sub }) {
  const map = { emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800', amber: 'bg-amber-50 border-amber-200 text-amber-800', pink: 'bg-pink-50 border-pink-200 text-pink-800' };
  return (<div className={`rounded-xl border p-2.5 flex items-start gap-2 ${map[tone]}`}>
    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
    <div className="min-w-0"><p className="text-[10px] font-semibold opacity-80">{title}</p><p className="text-sm font-bold leading-tight">{main}</p>{sub && <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{sub}</p>}</div>
  </div>);
}

function TableEdit({ rows, cols, canEdit, onAdd, onUp, onDel, addLabel }) {
  return (<div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[600px]">
        <thead className="bg-slate-50 text-slate-500"><tr>
          {cols.map(([k, lb]) => <th key={k} className="text-left px-2 py-1.5 font-semibold text-[10px] uppercase">{lb}</th>)}
          <th className="w-8" />
        </tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && <tr><td colSpan={cols.length + 1} className="text-center text-slate-400 py-3 text-[11px]">Chưa có dữ liệu.</td></tr>}
          {rows.map((r) => (<tr key={r.id}>
            {cols.map(([k]) => <td key={k} className="px-1 py-1"><input value={r[k] || ''} disabled={!canEdit} onChange={(e) => onUp(r.id, { [k]: e.target.value })} className="inp2" /></td>)}
            <td className="px-1 py-1 text-center">{canEdit && <button onClick={() => onDel(r.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
    {canEdit && <button onClick={onAdd} className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700"><Plus className="w-3.5 h-3.5" /> {addLabel}</button>}
  </div>);
}
