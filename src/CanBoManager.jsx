import React, { useMemo, useState } from 'react';
import {
  Users, BellRing, CalendarClock, ClipboardList, Building2, Search, Plus, Trash2,
  FileText, Save, AlertTriangle, CheckCircle2, X, UserPlus, Cake, TrendingUp,
  RefreshCw, ShieldCheck, Briefcase, GraduationCap, Landmark, HeartPulse, Info, ChevronRight,
} from 'lucide-react';
import {
  HR_CATEGORY, catOf, HR_NGACH, ngachOf, hesoOf, HR_GENDER, HR_REPEAT,
  newStaff, newTraining, newHistory, newFamily, newDuty,
  buildAlerts, ALERT_META, headcount, nextRaise, retireDate, nextBirthday,
  profileCompleteness, fmtD, daysTo, ageAt, addMonths, toDate, DEFAULT_LEAD,
} from './lib/hr';

// ============================================================================
// MODULE QUẢN LÝ CÁN BỘ (chỉ tài khoản Quản trị)
//  • Danh sách người được ĐỒNG BỘ TỰ ĐỘNG từ danh sách cán bộ của hệ thống
//    (tab Đánh giá) — không nạp mẫu, không nhập rời. Module bổ sung hồ sơ 2C/TCTW-98.
//  • Nhắc việc: nâng lương · nghỉ hưu · sinh nhật · hợp đồng · bổ nhiệm · nhiệm vụ có hạn · biên chế
// ============================================================================

const SUBTABS = [
  { id: 'alerts', label: 'Nhắc việc', icon: BellRing },
  { id: 'list', label: 'Hồ sơ cán bộ', icon: Users },
  { id: 'duties', label: 'Nhiệm vụ có hạn', icon: ClipboardList },
  { id: 'quota', label: 'Biên chế', icon: Building2 },
];

const dayLabel = (d) => (d == null ? '' : d < 0 ? `quá ${-d} ngày` : d === 0 ? 'hôm nay' : `còn ${d} ngày`);
// Màu theo mức khẩn — dùng chung cho viền, nền, chữ.
const LV = {
  overdue: { bar: 'bg-rose-500', chip: 'bg-rose-100 text-rose-700', ring: 'ring-rose-200', bg: 'bg-rose-50/70', label: 'Quá hạn' },
  urgent: { bar: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800', ring: 'ring-amber-200', bg: 'bg-amber-50/70', label: 'Cần xử lý sớm' },
  soon: { bar: 'bg-sky-500', chip: 'bg-sky-100 text-sky-700', ring: 'ring-sky-100', bg: 'bg-white', label: 'Sắp đến hạn' },
  info: { bar: 'bg-slate-400', chip: 'bg-slate-100 text-slate-600', ring: 'ring-slate-100', bg: 'bg-white', label: 'Theo dõi' },
};
// Chữ cái đầu của tên (ảnh đại diện chữ) + màu ổn định theo tên.
const initials = (n) => (n || '?').trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase();
const AV = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500'];
const avatarColor = (n) => AV[[...(n || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length];

function Avatar({ name, size = 'md' }) {
  const s = size === 'lg' ? 'w-14 h-14 text-lg' : size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs';
  return <span className={`${s} ${avatarColor(name)} shrink-0 rounded-full text-white font-bold flex items-center justify-center shadow-sm`}>{initials(name)}</span>;
}

export default function CanBoManager({ data, people, onChange, onSave, saving, canEdit = true, onExportProfile, defaultSub = 'alerts', defaultOpenId = null }) {
  const [sub, setSub] = useState(defaultSub);
  const [q, setQ] = useState('');
  const [fCat, setFCat] = useState('');
  const [fDept, setFDept] = useState('');
  const [fType, setFType] = useState('');
  const [openId, setOpenId] = useState(defaultOpenId);

  // Tham chiếu ổn định để không tính lại toàn bộ cảnh báo sau mỗi lần gõ phím.
  const staff = useMemo(() => data.staff || [], [data.staff]);
  const duties = useMemo(() => data.duties || [], [data.duties]);
  const quota = useMemo(() => data.quota || {}, [data.quota]);
  const lead = useMemo(() => ({ ...DEFAULT_LEAD, ...(data.lead || {}) }), [data.lead]);

  const alerts = useMemo(() => buildAlerts(staff, duties, quota, lead), [staff, duties, quota, lead]);
  const hc = useMemo(() => headcount(staff, quota), [staff, quota]);
  const depts = useMemo(() => [...new Set(staff.map((s) => s.department).filter(Boolean))].sort(), [staff]);

  const upStaff = (id, patch) => onChange({ staff: staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const upDuty = (id, patch) => onChange({ duties: duties.map((d) => (d.id === id ? { ...d, ...patch } : d)) });

  const active = staff.filter((s) => s.active !== false);
  const filtered = staff.filter((s) => {
    const kw = q.trim().toLowerCase();
    if (kw && !`${s.name} ${s.position} ${s.department} ${s.email}`.toLowerCase().includes(kw)) return false;
    if (fCat && s.category !== fCat) return false;
    if (fDept && s.department !== fDept) return false;
    return true;
  });
  const openStaff = staff.find((s) => s.id === openId) || null;

  const counts = { overdue: alerts.filter((a) => a.level === 'overdue').length, urgent: alerts.filter((a) => a.level === 'urgent').length, soon: alerts.filter((a) => a.level === 'soon').length };
  // Mức hoàn thiện hồ sơ toàn cơ quan
  const avgDone = active.length ? Math.round(active.reduce((t, s) => t + profileCompleteness(s).pct, 0) / active.length) : 0;
  const detached = staff.filter((s) => s.detached).length;
  const shown = alerts.filter((a) => !fType || a.type === fType);

  return (
    <div className="space-y-4">
      {/* ============ Đầu module ============ */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white px-5 py-4">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-amber-300" /></div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-lg leading-tight">Quản lý cán bộ</h2>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">Đại biểu Quốc hội, đại biểu HĐND tỉnh chuyên trách và cán bộ, công chức, người lao động Văn phòng</p>
            </div>
            {canEdit && (
              <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:opacity-60 rounded-xl text-xs font-bold shadow-sm transition">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Đang lưu…' : 'Lưu hồ sơ'}
              </button>
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-300 flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 w-fit">
            <RefreshCw className="w-3 h-3 text-emerald-300" />
            Danh sách <b className="text-white">{active.length} cán bộ</b> được đồng bộ tự động từ danh sách của hệ thống ({(people || []).length} người ở tab Đánh giá)
          </p>
        </div>

        {/* Thanh khu vực */}
        <div className="px-3 py-2.5 flex gap-1.5 flex-wrap border-b border-slate-100 bg-slate-50/60">
          {SUBTABS.map((t) => { const Ic = t.icon; const on = sub === t.id;
            const n = t.id === 'alerts' ? alerts.length : t.id === 'list' ? staff.length : t.id === 'duties' ? duties.filter((d) => !d.done).length : hc.rows.length;
            return (
              <button key={t.id} onClick={() => setSub(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${on ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-700'}`}>
                <Ic className="w-3.5 h-3.5" /> {t.label}
                {n > 0 && <span className={`px-1.5 rounded-full text-[10px] font-bold ${on ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>{n}</span>}
              </button>
            ); })}
        </div>

        {/* Thẻ chỉ số */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-4">
          <KpiCard icon={AlertTriangle} tone="rose" value={counts.overdue} label="Quá hạn / vượt chỉ tiêu" hint="cần xử lý ngay" />
          <KpiCard icon={BellRing} tone="amber" value={counts.urgent} label="Đến hạn trong thời gian ngắn" hint="ưu tiên xử lý" />
          <KpiCard icon={CalendarClock} tone="sky" value={counts.soon} label="Sắp đến hạn" hint="theo dõi" />
          <KpiCard icon={ShieldCheck} tone="emerald" value={`${avgDone}%`} label="Mức hoàn thiện hồ sơ" hint={`${active.length} hồ sơ`} bar={avgDone} />
        </div>

        {detached > 0 && (
          <p className="mx-4 mb-4 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span><b>{detached} hồ sơ</b> không còn trong danh sách cán bộ của hệ thống (đã chuyển công tác, nghỉ hưu…). Hồ sơ vẫn được giữ lại để tra cứu, đánh dấu <b>“ngoài danh sách”</b> trong bảng.</span>
          </p>
        )}
      </section>

      {/* ============ Nhắc việc ============ */}
      {sub === 'alerts' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><BellRing className="w-4 h-4 text-amber-500" /> Việc cần theo dõi, xử lý</h3>
            <div className="ml-auto flex gap-1.5 flex-wrap">
              <FilterChip on={!fType} onClick={() => setFType('')} label={`Tất cả (${alerts.length})`} />
              {Object.entries(ALERT_META).map(([k, m]) => { const n = alerts.filter((a) => a.type === k).length; if (!n) return null;
                return <FilterChip key={k} on={fType === k} onClick={() => setFType(fType === k ? '' : k)} label={`${m.label} (${n})`} tone={m.tone} />; })}
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-[68vh] overflow-y-auto">
            {shown.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500">Không có việc nào đến hạn</p>
                <p className="text-[11px] mt-1">Nhắc việc xuất hiện khi hồ sơ có ngày sinh, ngày hưởng bậc lương, hạn hợp đồng… Hãy bổ sung ở khu vực <b>Hồ sơ cán bộ</b>.</p>
              </div>
            )}
            {shown.map((a, i) => {
              const m = ALERT_META[a.type] || { label: a.type, tone: 'bg-slate-50 text-slate-600 border-slate-200' };
              const lv = LV[a.level] || LV.info;
              return (
                <div key={i} className={`group rounded-xl border border-slate-200 ${lv.bg} hover:shadow-sm transition overflow-hidden flex`}>
                  <span className={`w-1 shrink-0 ${lv.bar}`} />
                  <div className="flex-1 min-w-0 p-3 flex items-start gap-3">
                    {a.type === 'headcount' ? (
                      <span className="w-9 h-9 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><Building2 className="w-4 h-4" /></span>
                    ) : a.type === 'duty' ? (
                      <span className="w-9 h-9 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><ClipboardList className="w-4 h-4" /></span>
                    ) : <Avatar name={a.who} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${m.tone}`}>{m.label}</span>
                        {a.who && <span className="text-sm font-semibold text-slate-800">{a.who}</span>}
                      </div>
                      <p className="text-[13px] text-slate-700 mt-0.5 leading-snug">{a.title}</p>
                      {a.detail && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{a.detail}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      {a.date && <p className="text-xs font-bold text-slate-700">{fmtD(a.date)}</p>}
                      {a.days != null && <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${lv.chip}`}>{dayLabel(a.days)}</span>}
                      <div className="mt-1 flex gap-2 justify-end">
                        {a.staffId && <button onClick={() => { setSub('list'); setOpenId(a.staffId); }} className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2">Hồ sơ</button>}
                        {a.dutyId && canEdit && <button onClick={() => upDuty(a.dutyId, { done: true, doneAt: new Date().toISOString().slice(0, 10) })} className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">Xong</button>}
                        {a.type === 'headcount' && <button onClick={() => setSub('quota')} className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2">Biên chế</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Số ngày báo trước cho từng loại</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[['raise', 'Nâng lương'], ['retire', 'Nghỉ hưu'], ['birthday', 'Sinh nhật'], ['contract', 'Hợp đồng'], ['appoint', 'Bổ nhiệm'], ['duty', 'Nhiệm vụ']].map(([k, lb]) => (
                <label key={k} className="block bg-white rounded-lg border border-slate-200 px-2 py-1.5">
                  <span className="text-[10px] text-slate-500 block">{lb}</span>
                  <input type="number" min="1" value={lead[k]} disabled={!canEdit} onChange={(e) => onChange({ lead: { ...lead, [k]: Math.max(1, Number(e.target.value) || 1) } })} className="w-full text-sm font-bold text-slate-700 outline-none bg-transparent disabled:text-slate-400" />
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ Hồ sơ cán bộ ============ */}
      {sub === 'list' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên, chức vụ, đơn vị…" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400 focus:bg-white transition" />
            </div>
            <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 outline-none focus:border-slate-400">
              <option value="">Tất cả đối tượng</option>
              {HR_CATEGORY.map((c) => <option key={c.k} value={c.k}>{c.label}</option>)}
            </select>
            <select value={fDept} onChange={(e) => setFDept(e.target.value)} className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 outline-none focus:border-slate-400 max-w-[220px]">
              <option value="">Tất cả đơn vị</option>
              {depts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {canEdit && <button onClick={() => { const s = newStaff('Cán bộ mới'); onChange({ staff: [...staff, s] }); setOpenId(s.id); }} title="Thêm hồ sơ cho người không có trong danh sách đánh giá" className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition"><UserPlus className="w-3.5 h-3.5" /> Thêm</button>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr className="text-[10px] uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-bold">Cán bộ</th>
                  <th className="text-left px-3 py-2.5 font-bold">Chức vụ · Đơn vị</th>
                  <th className="text-center px-2 py-2.5 font-bold">Ngạch · Bậc</th>
                  <th className="text-center px-2 py-2.5 font-bold">Mốc sắp tới</th>
                  <th className="text-center px-3 py-2.5 font-bold">Hoàn thiện</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-slate-400 py-10 text-sm">Không có cán bộ nào khớp bộ lọc.</td></tr>}
                {filtered.map((s) => {
                  const c = catOf(s.category); const ng = ngachOf(s.ngach);
                  const r = nextRaise(s); const rd = retireDate(s.birth, s.gender);
                  const cp = profileCompleteness(s);
                  // Mốc gần nhất trong các mốc đã tính được
                  const marks = [r && { lb: 'Nâng lương', d: r.date }, rd && { lb: 'Nghỉ hưu', d: rd }, s.contractTo && { lb: 'Hết hạn HĐ', d: toDate(s.contractTo) }]
                    .filter(Boolean).map((x) => ({ ...x, n: daysTo(x.d) })).filter((x) => x.n != null && x.n >= 0).sort((a, b) => a.n - b.n);
                  const next = marks[0];
                  return (
                    <tr key={s.id} onClick={() => setOpenId(s.id)} className={`hover:bg-slate-50 cursor-pointer transition ${openId === s.id ? 'bg-slate-50' : ''}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={s.name} />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-[13px] truncate flex items-center gap-1.5">
                              {s.name || '(chưa có tên)'}
                              {s.detached && <span title="Không còn trong danh sách cán bộ của hệ thống" className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded px-1">ngoài danh sách</span>}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{s.email || (s.birth ? `${fmtD(s.birth)} · ${ageAt(s.birth)} tuổi` : 'chưa có ngày sinh')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-xs text-slate-700 leading-snug">{s.position || '—'}</p>
                        <p className="text-[11px] text-slate-400">{s.department || '—'}</p>
                        <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded border ${c.tone}`}>{c.short}</span>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <p className="text-xs text-slate-700">{ng.name}</p>
                        <p className="text-[11px] text-slate-400">bậc {s.bac}/{ng.bacMax} · hệ số {s.heso}{s.vuotKhungPct > 0 ? ` · VK ${s.vuotKhungPct}%` : ''}</p>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        {next ? (<>
                          <p className="text-[11px] text-slate-500">{next.lb}</p>
                          <p className="text-xs font-bold text-slate-700">{fmtD(next.d)}</p>
                          <span className={`text-[10px] font-semibold ${next.n <= 90 ? 'text-amber-600' : 'text-slate-400'}`}>{dayLabel(next.n)}</span>
                        </>) : <span className="text-[11px] text-slate-300">chưa đủ dữ liệu</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[52px]">
                            <div className={`h-full rounded-full ${cp.pct >= 80 ? 'bg-emerald-500' : cp.pct >= 50 ? 'bg-amber-500' : 'bg-rose-400'}`} style={{ width: `${cp.pct}%` }} />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 w-8 text-right">{cp.pct}%</span>
                        </div>
                      </td>
                      <td className="px-2 text-center"><ChevronRight className="w-4 h-4 text-slate-300 inline" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2.5 text-[11px] text-slate-400 border-t border-slate-100">Hiển thị {filtered.length}/{staff.length} hồ sơ · Bấm vào một dòng để mở hồ sơ đầy đủ theo Mẫu 2C/TCTW-98.</p>
        </section>
      )}

      {/* ============ Nhiệm vụ có thời hạn ============ */}
      {sub === 'duties' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4 text-indigo-500" /> Nhiệm vụ, báo cáo có thời hạn</h3>
            {canEdit && <button onClick={() => onChange({ duties: [...duties, newDuty()] })} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition"><Plus className="w-3.5 h-3.5" /> Thêm nhiệm vụ</button>}
          </div>
          <div className="p-3 space-y-2">
            {duties.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Chưa có nhiệm vụ nào</p>
                <p className="text-[11px] mt-1">Thêm công việc có thời hạn (báo cáo định kỳ, rà soát nâng lương, kê khai tài sản…) để hệ thống tự nhắc.</p>
              </div>
            )}
            {duties.map((d) => {
              const due = d.done ? null : toDate(d.due);
              const dd = due ? daysTo(due) : null;
              const late = dd != null && dd < 0;
              return (
                <div key={d.id} className={`rounded-xl border overflow-hidden flex ${d.done ? 'bg-slate-50 border-slate-200' : late ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'}`}>
                  <span className={`w-1 shrink-0 ${d.done ? 'bg-emerald-400' : late ? 'bg-rose-500' : 'bg-indigo-400'}`} />
                  <div className="flex-1 min-w-0 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" checked={!!d.done} disabled={!canEdit} onChange={(e) => upDuty(d.id, { done: e.target.checked, doneAt: e.target.checked ? new Date().toISOString().slice(0, 10) : '' })} className="w-4 h-4 accent-emerald-600 shrink-0" title="Đánh dấu đã hoàn thành" />
                      <input value={d.title} disabled={!canEdit} onChange={(e) => upDuty(d.id, { title: e.target.value })} placeholder="Tên nhiệm vụ / báo cáo…" className={`flex-1 bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-slate-400 text-sm font-semibold text-slate-800 outline-none py-0.5 ${d.done ? 'line-through text-slate-400' : ''}`} />
                      {!d.done && due && <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${late ? 'bg-rose-100 text-rose-700' : dd <= (d.lead ?? 15) ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{fmtD(due)} · {dayLabel(dd)}</span>}
                      {d.done && <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Đã xong {d.doneAt ? fmtD(d.doneAt) : ''}</span>}
                      {canEdit && <button onClick={() => { if (window.confirm('Xóa nhiệm vụ này?')) onChange({ duties: duties.filter((x) => x.id !== d.id) }); }} className="shrink-0 text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      <L label="Đơn vị / người phụ trách"><input value={d.owner || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { owner: e.target.value })} className="inp2" /></L>
                      <L label="Hạn hoàn thành"><input type="date" value={d.due || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { due: e.target.value })} className="inp2" /></L>
                      <L label="Chu kỳ lặp"><select value={d.repeat || 'once'} disabled={!canEdit} onChange={(e) => upDuty(d.id, { repeat: e.target.value })} className="inp2">{HR_REPEAT.map((r) => <option key={r.k} value={r.k}>{r.label}</option>)}</select></L>
                      <L label="Báo trước (ngày)"><input type="number" min="1" value={d.lead ?? 15} disabled={!canEdit} onChange={(e) => upDuty(d.id, { lead: Math.max(1, Number(e.target.value) || 1) })} className="inp2" /></L>
                      <L label="Ghi chú"><input value={d.note || ''} disabled={!canEdit} onChange={(e) => upDuty(d.id, { note: e.target.value })} className="inp2" /></L>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ Biên chế ============ */}
      {sub === 'quota' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-rose-500" /> Biên chế được giao và thực có</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Nhập chỉ tiêu theo quyết định giao biên chế; hệ thống tự so sánh với số người thực có và cảnh báo thừa/thiếu.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 border-b border-slate-100">
            <KpiCard icon={Users} tone="sky" value={hc.sum.cc} label="Công chức thực có" hint={`chỉ tiêu ${hc.sum.qcc}`} />
            <KpiCard icon={Briefcase} tone="slate" value={hc.sum.hd} label="Hợp đồng thực có" hint={`chỉ tiêu ${hc.sum.qhd}`} />
            <KpiCard icon={TrendingUp} tone={hc.sum.dCc === 0 ? 'emerald' : hc.sum.dCc > 0 ? 'rose' : 'amber'} value={hc.sum.dCc === 0 ? 'Đủ' : hc.sum.dCc > 0 ? `+${hc.sum.dCc}` : hc.sum.dCc} label="Chênh lệch công chức" hint={hc.sum.dCc > 0 ? 'vượt chỉ tiêu' : hc.sum.dCc < 0 ? 'còn thiếu' : 'đúng chỉ tiêu'} />
            <KpiCard icon={Building2} tone="violet" value={hc.rows.length} label="Đơn vị theo dõi" hint="phòng / ban" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr className="text-[10px] uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-bold">Đơn vị</th>
                  <th className="text-center px-2 py-2.5 font-bold">Chỉ tiêu CC</th>
                  <th className="text-center px-2 py-2.5 font-bold">Thực có</th>
                  <th className="text-center px-2 py-2.5 font-bold">Chênh lệch</th>
                  <th className="text-center px-2 py-2.5 font-bold">Chỉ tiêu HĐ</th>
                  <th className="text-center px-2 py-2.5 font-bold">Thực có</th>
                  <th className="text-center px-2 py-2.5 font-bold">Chênh lệch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hc.rows.map((r) => (
                  <tr key={r.dept} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-xs font-medium text-slate-700">{r.dept}</td>
                    <td className="px-2 py-2 text-center"><NumIn v={r.qcc} disabled={!canEdit} onChange={(v) => onChange({ quota: { ...quota, [r.dept]: { ...(quota[r.dept] || {}), cc: v } } })} /></td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-slate-700">{r.cc}</td>
                    <td className="px-2 py-2 text-center"><Delta v={r.dCc} on={r.qcc > 0} /></td>
                    <td className="px-2 py-2 text-center"><NumIn v={r.qhd} disabled={!canEdit} onChange={(v) => onChange({ quota: { ...quota, [r.dept]: { ...(quota[r.dept] || {}), hd: v } } })} /></td>
                    <td className="px-2 py-2 text-center text-xs font-bold text-slate-700">{r.hd}</td>
                    <td className="px-2 py-2 text-center"><Delta v={r.dHd} on={r.qhd > 0} /></td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="px-4 py-2.5 text-xs text-slate-700">TỔNG CỘNG</td>
                  <td className="px-2 py-2.5 text-center text-xs">{hc.sum.qcc}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{hc.sum.cc}</td>
                  <td className="px-2 py-2.5 text-center"><Delta v={hc.sum.dCc} on={hc.sum.qcc > 0} /></td>
                  <td className="px-2 py-2.5 text-center text-xs">{hc.sum.qhd}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{hc.sum.hd}</td>
                  <td className="px-2 py-2.5 text-center"><Delta v={hc.sum.dHd} on={hc.sum.qhd > 0} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ============ Ngăn hồ sơ 2C ============ */}
      {openStaff && (
        <StaffDrawer s={openStaff} canEdit={canEdit} onClose={() => setOpenId(null)}
          onPatch={(p) => upStaff(openStaff.id, p)}
          onDelete={() => { if (window.confirm(`Xóa hồ sơ "${openStaff.name}"? Không thể hoàn tác.`)) { onChange({ staff: staff.filter((x) => x.id !== openStaff.id) }); setOpenId(null); } }}
          onExport={onExportProfile ? () => onExportProfile(openStaff) : null} />
      )}

      <style>{`.inp2{width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:.5rem;padding:.35rem .55rem;font-size:.75rem;color:#334155;outline:none;transition:border-color .15s}.inp2:focus{border-color:#64748b}.inp2:disabled{background:#f8fafc;color:#64748b}`}</style>
    </div>
  );
}

// ---------------------------------------------------------------- Phụ trợ
function KpiCard({ icon: Icon, tone, value, label, hint, bar }) {
  const map = {
    rose: ['bg-rose-50', 'text-rose-600', 'bg-rose-500'], amber: ['bg-amber-50', 'text-amber-600', 'bg-amber-500'],
    sky: ['bg-sky-50', 'text-sky-600', 'bg-sky-500'], emerald: ['bg-emerald-50', 'text-emerald-600', 'bg-emerald-500'],
    slate: ['bg-slate-100', 'text-slate-600', 'bg-slate-500'], violet: ['bg-violet-50', 'text-violet-600', 'bg-violet-500'],
  };
  const [bg, fg, solid] = map[tone] || map.slate;
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white hover:shadow-sm transition">
      <div className="flex items-start gap-2.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg} ${fg}`}><Icon className="w-4 h-4" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-tight">{label}</p>
        </div>
      </div>
      {bar != null ? (
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${solid} rounded-full`} style={{ width: `${bar}%` }} /></div>
      ) : hint ? <p className="text-[10px] text-slate-400 mt-1.5">{hint}</p> : null}
    </div>
  );
}
function FilterChip({ on, onClick, label, tone }) {
  return <button onClick={onClick} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${on ? 'bg-slate-800 text-white border-slate-800' : (tone || 'bg-white text-slate-500 border-slate-200') + ' hover:opacity-80'}`}>{label}</button>;
}
function Delta({ v, on }) {
  if (!on) return <span className="text-slate-300 text-xs">—</span>;
  if (v === 0) return <span className="text-[11px] font-bold text-emerald-600">đủ</span>;
  return <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${v > 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{v > 0 ? `thừa ${v}` : `thiếu ${-v}`}</span>;
}
function NumIn({ v, disabled, onChange }) {
  return <input type="number" min="0" value={v} disabled={disabled} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="w-16 bg-white border border-slate-200 rounded-lg px-1 py-1 text-xs text-center font-semibold text-slate-700 outline-none focus:border-slate-400 disabled:bg-slate-50" />;
}
function L({ label, children }) {
  return (<label className="block"><span className="text-[10px] font-semibold text-slate-500 block mb-0.5">{label}</span>{children}</label>);
}
function Badge({ icon: Icon, tone, title, main, sub }) {
  const map = { emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800', amber: 'bg-amber-50 border-amber-200 text-amber-800', pink: 'bg-pink-50 border-pink-200 text-pink-800' };
  return (<div className={`rounded-xl border p-2.5 flex items-start gap-2 ${map[tone]}`}>
    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
    <div className="min-w-0"><p className="text-[10px] font-semibold opacity-80">{title}</p><p className="text-sm font-bold leading-tight">{main}</p>{sub && <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{sub}</p>}</div>
  </div>);
}

// ---------------------------------------------------------------- Hồ sơ 2C (ngăn trượt)
const PROFILE_TABS = [
  { id: 'than', label: 'Nhân thân', icon: Users },
  { id: 'congtac', label: 'Công tác', icon: Briefcase },
  { id: 'luong', label: 'Ngạch, lương', icon: TrendingUp },
  { id: 'trinhdo', label: 'Trình độ', icon: GraduationCap },
  { id: 'dang', label: 'Đảng, đoàn thể', icon: Landmark },
  { id: 'khac', label: 'Khác', icon: HeartPulse },
  { id: 'bang', label: 'Đào tạo, quá trình, gia đình', icon: FileText },
];

function StaffDrawer({ s, canEdit, onPatch, onDelete, onExport, onClose }) {
  const [tab, setTab] = useState('than');
  const ng = ngachOf(s.ngach);
  const c = catOf(s.category);
  const cp = profileCompleteness(s);
  const r = nextRaise(s), rd = retireDate(s.birth, s.gender), bd = nextBirthday(s.birth);
  const T = (k, props = {}) => (<input value={s[k] ?? ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2" {...props} />);
  const D = (k) => (<input type="date" value={s[k] || ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2" />);
  const A = (k, rows = 2) => (<textarea rows={rows} value={s[k] || ''} disabled={!canEdit} onChange={(e) => onPatch({ [k]: e.target.value })} className="inp2 resize-y" />);
  const rowUp = (key, id, patch) => onPatch({ [key]: (s[key] || []).map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rowDel = (key, id) => onPatch({ [key]: (s[key] || []).filter((x) => x.id !== id) });

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl bg-slate-50 h-full shadow-2xl flex flex-col animate-[slideIn_.18s_ease-out]">
        {/* Đầu ngăn */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-5 py-3.5">
          <div className="flex items-start gap-3">
            <Avatar name={s.name} size="lg" />
            <div className="min-w-0 flex-1">
              <input value={s.name || ''} disabled={!canEdit} onChange={(e) => onPatch({ name: e.target.value })} className="w-full text-lg font-bold text-slate-800 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-slate-400" />
              <p className="text-xs text-slate-500 mt-0.5 truncate">{s.position || 'Chưa có chức vụ'}{s.department ? ` · ${s.department}` : ''}</p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${c.tone}`}>{c.short}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{ng.name} · bậc {s.bac}/{ng.bacMax}</span>
                {s.detached && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">ngoài danh sách hệ thống</span>}
              </div>
            </div>
            <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          {/* Mốc thời gian + mức hoàn thiện */}
          <div className="grid sm:grid-cols-3 gap-2 mt-3">
            <Badge icon={TrendingUp} tone="emerald" title="Nâng lương kế tiếp" main={r ? fmtD(r.date) : 'chưa xác định'} sub={r ? `${r.label} · ${dayLabel(daysTo(r.date))}` : 'Cần nhập “Ngày hưởng bậc lương hiện tại”'} />
            <Badge icon={CalendarClock} tone="amber" title="Thời điểm nghỉ hưu" main={rd ? fmtD(rd) : 'chưa xác định'} sub={rd ? `${dayLabel(daysTo(rd))} · theo NĐ 135/2020` : 'Cần nhập ngày sinh, giới tính'} />
            <Badge icon={Cake} tone="pink" title="Sinh nhật" main={bd ? fmtD(bd) : 'chưa xác định'} sub={bd ? `Tròn ${ageAt(s.birth, bd)} tuổi · ${dayLabel(daysTo(bd))}` : 'Cần nhập ngày sinh'} />
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">Mức hoàn thiện hồ sơ</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${cp.pct >= 80 ? 'bg-emerald-500' : cp.pct >= 50 ? 'bg-amber-500' : 'bg-rose-400'}`} style={{ width: `${cp.pct}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-600 shrink-0">{cp.pct}% ({cp.done}/{cp.total})</span>
          </div>
          {cp.missing.length > 0 && <p className="mt-1 text-[11px] text-slate-500">Còn thiếu: <span className="text-slate-600">{cp.missing.join(' · ')}</span></p>}
        </div>

        {/* Tab hồ sơ */}
        <div className="bg-white border-b border-slate-200 px-2 flex gap-1 overflow-x-auto">
          {PROFILE_TABS.map((t) => { const Ic = t.icon; const on = tab === t.id;
            return <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition ${on ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><Ic className="w-3.5 h-3.5" /> {t.label}</button>; })}
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'than' && (
            <Card title="Thông tin nhân thân (mục 1–9 Mẫu 2C)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
            </Card>
          )}

          {tab === 'congtac' && (
            <Card title="Tuyển dụng, chức vụ, công việc (mục 10–13)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <L label="Đối tượng quản lý"><select value={s.category} disabled={!canEdit} onChange={(e) => onPatch({ category: e.target.value })} className="inp2">{HR_CATEGORY.map((x) => <option key={x.k} value={x.k}>{x.label}</option>)}</select></L>
                <L label="12. Chức vụ (chính quyền)">{T('position')}</L>
                <L label="Đơn vị công tác">{T('department')}</L>
                <L label="10. Nghề nghiệp khi được tuyển dụng">{T('jobWhenHired')}</L>
                <L label="11. Ngày tuyển dụng">{D('hireDate')}</L>
                <L label="Cơ quan tuyển dụng">{T('hireAgency')}</L>
                <L label="Chức vụ về Đảng">{T('partyPosition')}</L>
                <L label="Chức vụ đoàn thể">{T('unionPosition')}</L>
                <L label="13. Công việc chính được giao">{T('mainWork')}</L>
                <L label="Ngày bổ nhiệm chức vụ">{D('appointDate')}</L>
                <L label="Thời hạn giữ chức vụ (tháng)"><input type="number" min="0" value={s.appointTerm ?? 60} disabled={!canEdit} onChange={(e) => onPatch({ appointTerm: Math.max(0, Number(e.target.value) || 0) })} className="inp2" /></L>
                {s.appointDate && Number(s.appointTerm) > 0 && <L label="Hết thời hạn giữ chức vụ"><p className="text-xs font-bold text-slate-600 pt-1.5">{fmtD(addMonths(toDate(s.appointDate), Number(s.appointTerm)))}</p></L>}
              </div>
              <p className="mt-2.5 text-[11px] text-slate-500 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" /> Họ tên, chức vụ, đơn vị được đồng bộ từ danh sách cán bộ của hệ thống. Sửa ở đây chỉ áp dụng cho hồ sơ; lần đồng bộ sau sẽ lấy lại theo hệ thống.</p>
            </Card>
          )}

          {tab === 'luong' && (
            <Card title="Ngạch, bậc lương và hợp đồng (mục 14)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <L label="Ngạch công chức"><select value={s.ngach} disabled={!canEdit} onChange={(e) => onPatch({ ngach: e.target.value, bac: 1, heso: hesoOf(e.target.value, 1), vuotKhungPct: 0 })} className="inp2">{HR_NGACH.map((n) => <option key={n.code} value={n.code}>{n.name} ({n.code})</option>)}</select></L>
                <L label={`Bậc lương (tối đa ${ng.bacMax})`}><input type="number" min="1" max={ng.bacMax} value={s.bac} disabled={!canEdit} onChange={(e) => { const b = Math.min(Math.max(1, Number(e.target.value) || 1), ng.bacMax); onPatch({ bac: b, heso: hesoOf(s.ngach, b) }); }} className="inp2" /></L>
                <L label="Hệ số lương"><input type="number" step="0.01" value={s.heso} disabled={!canEdit} onChange={(e) => onPatch({ heso: Number(e.target.value) || 0 })} className="inp2" /></L>
                <L label="Ngày hưởng bậc lương hiện tại">{D('salaryDate')}</L>
                <L label="Phụ cấp thâm niên vượt khung (%)"><input type="number" min="0" value={s.vuotKhungPct || 0} disabled={!canEdit} onChange={(e) => onPatch({ vuotKhungPct: Math.max(0, Number(e.target.value) || 0) })} className="inp2" /></L>
                <L label="Loại hợp đồng (nếu có)">{T('contractType')}</L>
                <L label="Hợp đồng từ ngày">{D('contractFrom')}</L>
                <L label="Hợp đồng đến ngày">{D('contractTo')}</L>
              </div>
              <p className="mt-2.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 leading-relaxed">
                Chu kỳ nâng bậc lương thường xuyên của ngạch <b>{ng.name}</b> (loại {ng.cls}) là <b>{ng.cycle} tháng</b> theo Thông tư 08/2013/TT-BNV.
                Khi đã ở bậc cuối ({ng.bacMax}), sau {ng.cycle} tháng được hưởng phụ cấp thâm niên vượt khung 5%, mỗi năm tiếp theo cộng thêm 1%.
              </p>
            </Card>
          )}

          {tab === 'trinhdo' && (
            <Card title="Trình độ (mục 15–20)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <L label="15. Giáo dục phổ thông">{T('eduGeneral')}</L>
                <L label="16. Chuyên môn cao nhất">{T('eduMajor')}</L>
                <L label="Học hàm, học vị">{T('eduDegree')}</L>
                <L label="17. Lý luận chính trị">{T('politics')}</L>
                <L label="18. Quản lý nhà nước">{T('stateAdmin')}</L>
                <L label="19. Ngoại ngữ">{T('foreignLang')}</L>
                <L label="20. Tin học">{T('it')}</L>
              </div>
            </Card>
          )}

          {tab === 'dang' && (
            <Card title="Đảng, đoàn thể, quân ngũ, danh hiệu (mục 21–24)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <L label="21. Ngày vào Đảng">{D('partyDate')}</L>
                <L label="Ngày chính thức">{D('partyOfficialDate')}</L>
                <L label="22. Tham gia tổ chức chính trị - xã hội">{D('unionDate')}</L>
                <L label="23. Ngày nhập ngũ">{D('armyIn')}</L>
                <L label="Ngày xuất ngũ">{D('armyOut')}</L>
                <L label="Quân hàm cao nhất">{T('armyRank')}</L>
                <L label="24. Danh hiệu được phong tặng">{T('honour')}</L>
              </div>
            </Card>
          )}

          {tab === 'khac' && (
            <Card title="Thông tin khác (mục 25–31)">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <L label="25. Sở trường công tác">{T('strength')}</L>
                <L label="28. Tình trạng sức khỏe">{T('health')}</L>
                <L label="Chiều cao (cm)">{T('height')}</L>
                <L label="Cân nặng (kg)">{T('weight')}</L>
                <L label="Nhóm máu">{T('bloodType')}</L>
                <L label="29. Thương binh / con gia đình chính sách">{T('policyFamily')}</L>
                <L label="30. Số căn cước công dân">{T('idNumber')}</L>
                <L label="Ngày cấp">{D('idDate')}</L>
                <L label="Nơi cấp">{T('idPlace')}</L>
                <L label="31. Số sổ bảo hiểm xã hội">{T('insuranceNo')}</L>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5 mt-2.5">
                <L label="26. Khen thưởng">{A('reward')}</L>
                <L label="27. Kỷ luật">{A('discipline')}</L>
              </div>
              <div className="grid gap-2.5 mt-2.5">
                <L label="34. Đặc điểm lịch sử bản thân">{A('selfHistory', 3)}</L>
                <L label="36. Hoàn cảnh kinh tế gia đình">{A('economy', 2)}</L>
                <L label="37. Nhận xét, đánh giá của cơ quan">{A('remark', 3)}</L>
                <L label="Ghi chú nội bộ">{A('note', 2)}</L>
              </div>
            </Card>
          )}

          {tab === 'bang' && (<>
            <Card title="32. Đào tạo, bồi dưỡng">
              <TableEdit rows={s.training || []} canEdit={canEdit}
                cols={[['from', 'Từ tháng/năm'], ['to', 'Đến tháng/năm'], ['school', 'Trường / cơ sở đào tạo'], ['major', 'Chuyên ngành'], ['form', 'Hình thức'], ['degree', 'Văn bằng']]}
                onAdd={() => onPatch({ training: [...(s.training || []), newTraining()] })}
                onUp={(id, p) => rowUp('training', id, p)} onDel={(id) => rowDel('training', id)} addLabel="Thêm khóa đào tạo" />
            </Card>
            <Card title="33. Tóm tắt quá trình công tác">
              <TableEdit rows={s.history || []} canEdit={canEdit}
                cols={[['from', 'Từ tháng/năm'], ['to', 'Đến tháng/năm'], ['content', 'Chức danh, chức vụ, đơn vị công tác']]}
                onAdd={() => onPatch({ history: [...(s.history || []), newHistory()] })}
                onUp={(id, p) => rowUp('history', id, p)} onDel={(id) => rowDel('history', id)} addLabel="Thêm giai đoạn công tác" />
            </Card>
            <Card title="35. Quan hệ gia đình">
              <TableEdit rows={s.family || []} canEdit={canEdit}
                cols={[['relation', 'Quan hệ'], ['name', 'Họ và tên'], ['birth', 'Năm sinh'], ['info', 'Nghề nghiệp, chức vụ, nơi công tác']]}
                onAdd={() => onPatch({ family: [...(s.family || []), newFamily()] })}
                onUp={(id, p) => rowUp('family', id, p)} onDel={(id) => rowDel('family', id)} addLabel="Thêm thành viên" />
            </Card>
          </>)}
        </div>

        {/* Chân ngăn */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <input type="checkbox" checked={s.active !== false} disabled={!canEdit} onChange={(e) => onPatch({ active: e.target.checked })} className="w-3.5 h-3.5 accent-emerald-600" /> Đang công tác
          </label>
          {onExport && <button onClick={onExport} className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition"><FileText className="w-3.5 h-3.5" /> Xuất lý lịch 2C (Word)</button>}
          {canEdit && <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"><Trash2 className="w-3.5 h-3.5" /> Xóa hồ sơ</button>}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(24px);opacity:.6}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

function Card({ title, children }) {
  return (<div className="bg-white rounded-xl border border-slate-200 p-3.5">
    <h4 className="text-xs font-bold text-slate-700 mb-2.5">{title}</h4>
    {children}
  </div>);
}

function TableEdit({ rows, cols, canEdit, onAdd, onUp, onDel, addLabel }) {
  return (<div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[560px]">
        <thead className="bg-slate-50 text-slate-500"><tr>
          {cols.map(([k, lb]) => <th key={k} className="text-left px-2 py-1.5 font-bold text-[10px] uppercase">{lb}</th>)}
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
