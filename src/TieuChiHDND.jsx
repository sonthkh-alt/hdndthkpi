import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Home, Building2, ShieldCheck, LogIn, LogOut, Save, Send, Search, Plus, KeyRound, Lock, Unlock,
  Trash2, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Info, ClipboardCheck, RefreshCw,
  Award, FileDown, FileSpreadsheet, Eye, X, Copy, Landmark, ListChecks, Gauge, RotateCcw,
} from 'lucide-react';
import {
  KHUNG, TC_KINDS, TC_TINH_SUBJECTS, computeTC, subScore, allGroups, kindInfo,
  TC_GRADES, gradeName, applyQuotaXuatSac, QUOTA_XUATSAC, dkDmstOf, FIX_NOTES, DIEU6,
} from './lib/khungTieuChi';
import {
  readTC, fetchTC, saveTC, saveUnitEval, unitLogin, readUnitSession, writeUnitSession,
  evalKey, makeUnit, parseUnitLines, randomPin, hashPin, EMPTY_TC,
} from './lib/tieuChiStore';
import { seedTieuChi, DEMO_PIN } from './lib/tieuChiSeed';
import { supabase } from './lib/supabase';
import { getSession, signInWithPassword, isAdminCredential, resolveLoginEmail, ADMIN } from './lib/auth';

// ============================================================================
//  MODULE: ĐÁNH GIÁ, XẾP LOẠI HĐND CẤP TỈNH / CẤP XÃ, PHƯỜNG
//  Theo Khung tiêu chí (dự thảo) của Thường trực HĐND tỉnh Thanh Hóa,
//  nhiệm kỳ 2026 - 2031 — docs/Khung_tieu_chi.docx.
//   • Đơn vị (xã, phường; Ban, Tổ đại biểu, Văn phòng) ĐĂNG NHẬP bằng mã đơn vị
//     + mã truy cập → tự đánh giá, tự chấm điểm, đính kèm minh chứng, gửi kết quả.
//   • Thường trực HĐND tỉnh / Tổ công tác: theo dõi tiến độ, thẩm định, bình xét
//     (áp trần 25% Xuất sắc), quản lý danh sách đơn vị, xuất báo cáo.
// ============================================================================

const ADMIN_EMAILS = ['sonthkh@gmail.com', ADMIN.email];
const nf = (n) => (Number(n) || 0).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
const dmy = (iso) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '');

const GRADE_CLS = {
  xuatsac: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  tot: 'bg-sky-50 text-sky-700 border-sky-200',
  kha: 'bg-amber-50 text-amber-700 border-amber-200',
  tb: 'bg-orange-50 text-orange-700 border-orange-200',
  yeu: 'bg-rose-50 text-rose-700 border-rose-200',
};
const newRecord = (unit, year) => ({
  unitId: unit.id, unitName: unit.name, kind: unit.kind, year: String(year),
  ans: {}, submitted: false, submittedAt: '', updatedAt: '',
  contact: unit.contact || '', phone: unit.phone || '', selfNote: '',
  review: { total: null, grade: '', note: '', by: '', at: '' },
});

// Điểm cuối cùng dùng để bình xét: điểm thẩm định (nếu có) hoặc điểm tự chấm.
const finalOf = (rec, comp) => (rec?.review?.total != null && rec.review.total !== '' ? Number(rec.review.total) : comp.total);
const finalGradeOf = (rec, comp) => {
  if (rec?.review?.grade) return rec.review.grade;
  if (rec?.review?.total != null && rec.review.total !== '') {
    const t = Number(rec.review.total);
    return (TC_GRADES.find((g) => t >= g.min) || TC_GRADES[4]).code;
  }
  return comp.grade;
};

// ---------------------------------------------------------------------------
//  Ô nhập nhỏ dùng chung
// ---------------------------------------------------------------------------
function Num({ value, onChange, disabled, suffix, min = 0, max, step = 1, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <input type="number" min={min} max={max} step={step} disabled={disabled}
        value={value == null || value === '' ? '' : value}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-20 text-sm px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-400" />
      {suffix && <span className="text-[11px] text-slate-500">{suffix}</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
//  Một "điểm thành phần" trong phiếu
// ---------------------------------------------------------------------------
function SubRow({ sub, ans, onChange, readOnly }) {
  const [openGuide, setOpenGuide] = useState(false);
  const r = subScore(sub, ans);
  const t = sub.type || 'choice';
  const set = (patch) => onChange({ ...ans, ...patch });

  return (
    <div className={`rounded-xl border p-3 ${r.answered ? 'border-slate-200 bg-white' : 'border-dashed border-amber-300 bg-amber-50/40'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-indigo-600">{sub.id}</p>
          <button type="button" onClick={() => setOpenGuide((o) => !o)} className="text-left text-[12px] text-slate-500 hover:text-slate-700 flex items-start gap-1 mt-0.5">
            {openGuide ? <ChevronDown className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
            <span className={openGuide ? '' : 'line-clamp-2'}>{sub.guide}</span>
          </button>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Điểm đạt</p>
          <p className={`text-lg font-extrabold leading-none ${r.answered ? 'text-indigo-700' : 'text-slate-300'}`}>{nf(r.score)}<span className="text-[11px] font-semibold text-slate-400">/{nf(sub.max)}</span></p>
        </div>
      </div>

      <div className="mt-2.5">
        {t === 'choice' && (
          <div className="space-y-1.5">
            {sub.options.map((op, i) => {
              const on = ans.sel === i;
              return (
                <label key={i} className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 cursor-pointer transition ${on ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'} ${readOnly ? 'cursor-default opacity-90' : ''}`}>
                  <input type="radio" disabled={readOnly} checked={on} onChange={() => set({ sel: i })} className="mt-1 accent-indigo-600" />
                  <span className="flex-1 text-[13px] text-slate-700 leading-snug">{op.label}</span>
                  <span className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded ${op.zeroItem ? 'bg-rose-100 text-rose-700' : op.s > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{nf(op.s)}đ</span>
                </label>
              );
            })}
          </div>
        )}
        {(t === 'minus' || t === 'count') && (
          <Num value={ans.count} disabled={readOnly} onChange={(v) => set({ count: v })} suffix={`${t === 'minus' ? 'Số ' : 'Số '}${sub.unitLabel}`} />
        )}
        {t === 'ratio' && (
          <Num value={ans.pct} disabled={readOnly} onChange={(v) => set({ pct: v })} max={100} suffix={`% — ${sub.unitLabel}`} />
        )}
        {t === 'minusPlus' && (
          <div className="flex flex-wrap items-center gap-4">
            <Num value={ans.count} disabled={readOnly} onChange={(v) => set({ count: v })} suffix={`Số ${sub.unitLabel}`} />
            <Num value={ans.pct} disabled={readOnly} onChange={(v) => set({ pct: v })} max={100} suffix={`% ${sub.pctLabel || 'chất lượng'}`} />
          </div>
        )}
      </div>

      {sub.fixNote && (
        <p className="mt-2 text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1.5 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {sub.fixNote}
        </p>
      )}

      <div className="mt-2 grid sm:grid-cols-2 gap-2">
        <input value={ans.proof || ''} disabled={readOnly} onChange={(e) => set({ proof: e.target.value })}
          placeholder="Hồ sơ minh chứng (số, ký hiệu văn bản / đường dẫn)"
          className="text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50" />
        <input value={ans.note || ''} disabled={readOnly} onChange={(e) => set({ note: e.target.value })}
          placeholder="Ghi chú / giải trình"
          className="text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Một nhóm tiêu chí
// ---------------------------------------------------------------------------
function GroupBlock({ group, comp, ans, onAns, readOnly, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const g = comp.groups.find((x) => x.code === group.code) || { score: 0, items: [] };
  const isDeduct = group.kind === 'deduct';
  const isBonus = group.kind === 'bonus';
  const pct = group.max ? Math.min(100, Math.abs(g.score) / group.max * 100) : 0;

  return (
    <section className={`rounded-2xl border overflow-hidden ${isDeduct ? 'border-rose-200' : isBonus ? 'border-emerald-200' : 'border-slate-200'} bg-white shadow-sm`}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={`w-full flex items-center gap-3 px-4 py-3 text-left ${isDeduct ? 'bg-rose-50' : isBonus ? 'bg-emerald-50' : 'bg-slate-50'}`}>
        <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${isDeduct ? 'bg-rose-600 text-white' : isBonus ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>{group.code}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] sm:text-sm font-bold text-slate-800 leading-snug">{group.title}</span>
          <span className="block h-1.5 mt-1.5 bg-slate-200 rounded-full overflow-hidden max-w-xs">
            <span className={`block h-full ${isDeduct ? 'bg-rose-500' : isBonus ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className={`block text-lg font-extrabold ${isDeduct ? 'text-rose-600' : isBonus ? 'text-emerald-600' : 'text-indigo-700'}`}>{isDeduct && g.score !== 0 ? '' : ''}{nf(g.score)}</span>
          <span className="block text-[10px] text-slate-400">/{isDeduct ? `-${group.max}` : group.max} điểm</span>
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="p-3 sm:p-4 space-y-3">
          {isDeduct ? group.items.map((it) => {
            const a = ans[it.id] || {};
            const n = Number(a.count || 0);
            const minus = n > 0 ? Math.min(it.cap, it.per * n) : 0;
            return (
              <div key={it.id} className={`rounded-xl border p-3 ${n > 0 ? 'border-rose-300 bg-rose-50/60' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] text-slate-700 leading-snug flex-1"><b className="text-rose-700">{it.id}.</b> {it.title}</p>
                  <span className="shrink-0 text-lg font-extrabold text-rose-600">{minus ? `-${nf(minus)}` : '0'}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Trừ {nf(it.per)}đ/{it.unitLabel}, tối đa trừ {nf(it.cap)}đ. {it.sanctionText && <b className="text-rose-700">Chế tài: {it.sanctionText}</b>} {it.note}</p>
                {it.fixNote && <p className="text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1.5 mt-1.5 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {it.fixNote}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Num value={a.count} disabled={readOnly} onChange={(v) => onAns(it.id, { ...a, count: v })} suffix={`Số ${it.unitLabel}`} />
                  {it.repeatFlag && (
                    <label className="flex items-center gap-1.5 text-[12px] text-rose-700 font-semibold">
                      <input type="checkbox" disabled={readOnly} checked={!!a.repeat} onChange={(e) => onAns(it.id, { ...a, repeat: e.target.checked })} className="accent-rose-600" /> Tái phạm (xếp loại Yếu)
                    </label>
                  )}
                  <input value={a.proof || ''} disabled={readOnly} onChange={(e) => onAns(it.id, { ...a, proof: e.target.value })} placeholder="Văn bản/căn cứ"
                    className="flex-1 min-w-[180px] text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-rose-400 disabled:bg-slate-50" />
                </div>
              </div>
            );
          }) : group.items.map((it) => {
            const ic = g.items?.find((x) => x.id === it.id);
            return (
              <div key={it.id} className={`rounded-xl border ${ic?.zero ? 'border-rose-300' : 'border-slate-200'} overflow-hidden`}>
                <div className={`px-3 py-2 flex items-start justify-between gap-3 ${ic?.zero ? 'bg-rose-50' : 'bg-slate-50/70'}`}>
                  <p className="text-[13px] font-semibold text-slate-800 leading-snug flex-1">{it.id}. {it.title}</p>
                  <span className="shrink-0 text-sm font-extrabold text-indigo-700">{nf(ic?.score || 0)}<span className="text-[11px] text-slate-400 font-semibold">/{nf(it.max)}</span></span>
                </div>
                {ic?.zero && <p className="px-3 py-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border-t border-rose-200">⚠ Mức đã chọn làm mất điểm TOÀN BỘ tiêu chí này.</p>}
                <div className="p-2.5 space-y-2.5">
                  {it.subs.map((sb) => (
                    <SubRow key={sb.id} sub={sb} ans={ans[sb.id] || {}} readOnly={readOnly} onChange={(v) => onAns(sb.id, v)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Khối tổng hợp điểm (cột phải)
// ---------------------------------------------------------------------------
function ScoreCard({ comp, rec, kind }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-200">Tổng điểm đánh giá</p>
        <p className="text-4xl font-extrabold leading-none mt-1">{nf(comp.total)}<span className="text-base font-semibold text-indigo-200">/110</span></p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-lg px-2.5 py-1">
          <Award className="w-3.5 h-3.5" /> <span className="text-sm font-bold">Xếp loại: {comp.gradeName}</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-indigo-100"><span>Tiến độ khai báo</span><span>{comp.progress}%</span></div>
          <div className="h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden"><div className="h-full bg-amber-300" style={{ width: `${comp.progress}%` }} /></div>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        {comp.groups.filter((g) => g.kind === 'main').map((g) => (
          <div key={g.code} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[11px] font-bold text-slate-500">{g.code}</span>
            <span className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><span className="block h-full bg-indigo-500" style={{ width: `${g.max ? (g.score / g.max) * 100 : 0}%` }} /></span>
            <span className="w-16 shrink-0 text-right text-[11px] font-semibold text-slate-600">{nf(g.score)}/{g.max}</span>
          </div>
        ))}
        <div className="pt-2 mt-1 border-t border-slate-100 space-y-1 text-[12px]">
          <div className="flex justify-between"><span className="text-slate-500">Cộng 07 nhóm (tối đa 100)</span><b className="text-slate-800">{nf(comp.base)}</b></div>
          <div className="flex justify-between"><span className="text-emerald-600">+ Thưởng đổi mới sáng tạo (VIII)</span><b className="text-emerald-700">+{nf(comp.bonus)}</b></div>
          <div className="flex justify-between"><span className="text-rose-600">− Trừ điểm vi phạm (IX)</span><b className="text-rose-700">-{nf(comp.deduct)}</b></div>
          <div className="flex justify-between pt-1.5 border-t border-slate-100"><span className="font-bold text-slate-700">TỔNG</span><b className="text-indigo-700 text-base">{nf(comp.total)}</b></div>
        </div>
      </div>
      {(comp.reasons.length > 0 || comp.sanctions.length > 0) && (
        <div className="px-3 pb-3">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5">
            <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Điều kiện xếp loại (Điều 6)</p>
            <ul className="mt-1 space-y-1">
              {comp.reasons.map((t, i) => <li key={`r${i}`} className="text-[11px] text-amber-800 leading-snug">• {t}</li>)}
              {comp.sanctions.map((t, i) => <li key={`s${i}`} className="text-[11px] text-rose-700 leading-snug">• {t}</li>)}
            </ul>
          </div>
        </div>
      )}
      <div className="px-3 pb-3">
        <p className="text-[11px] text-slate-400 leading-snug">
          <b className="text-slate-600">Điều kiện đổi mới sáng tạo:</b> điểm nhóm V đạt <b className={comp.dmstRate >= dkDmstOf(kind).xuatsac * 100 ? 'text-emerald-600' : 'text-slate-600'}>{comp.dmstRate}%</b> (Xuất sắc ≥ {Math.round(dkDmstOf(kind).xuatsac * 100)}%, Tốt ≥ {Math.round(dkDmstOf(kind).tot * 100)}%);
          số mô hình mới, cách làm hay: <b className={comp.models >= dkDmstOf(kind).minModels ? 'text-emerald-600' : 'text-slate-600'}>{comp.models}</b> (Xuất sắc cần ≥ {dkDmstOf(kind).minModels}).
          {kind === 'xa' && <> Số đơn vị xếp loại Xuất sắc không vượt quá {Math.round(QUOTA_XUATSAC * 100)}% tổng số đơn vị được đánh giá.</>}
        </p>
        {rec?.submitted && <p className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi kết quả ngày {dmy(rec.submittedAt)}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  PHIẾU TỰ ĐÁNH GIÁ
// ---------------------------------------------------------------------------
export function Phieu({ unit, rec, year, onAns, onField, readOnly, onSave, onSubmit, saving, dirty, note, adminMode, onReview, onApprove, onUnapprove }) {
  const kind = unit.kind;
  const comp = useMemo(() => computeTC(kind, rec.ans), [kind, rec.ans]);
  const K = KHUNG[kind];
  const info = kindInfo(kind);
  const [openAll, setOpenAll] = useState(false);
  const flags = rec.ans.__flags || {};

  const doExportWord = async () => {
    const { exportTieuChiPhieu } = await import('./lib/exporters');
    await exportTieuChiPhieu({ unit, rec, year, comp, khung: K, kindName: info.name, phuluc: info.phuluc });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
      <div className="space-y-4 min-w-0">
        {/* Đầu phiếu */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">{info.phuluc} — {info.name}</p>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5">{unit.name}</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">Mã đơn vị: <b className="text-slate-700">{unit.code}</b> · Năm đánh giá: <b className="text-slate-700">{year}</b></p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={doExportWord} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"><FileDown className="w-3.5 h-3.5" /> Xuất phiếu (Word)</button>
              {!readOnly && (
                <>
                  <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"><Save className="w-3.5 h-3.5" /> {saving ? 'Đang lưu…' : 'Lưu'}</button>
                  <button onClick={onSubmit} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"><Send className="w-3.5 h-3.5" /> {rec.submitted ? 'Mở lại để sửa' : 'Gửi kết quả'}</button>
                </>
              )}
            </div>
          </div>
          <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">{info.desc}</p>
          {dirty && <p className="mt-2 text-[11px] font-semibold text-amber-700">● Có thay đổi chưa lưu.</p>}
          {note && <p className="mt-2 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1.5">{note}</p>}
        </div>

        {/* Thông tin liên hệ + tự nhận xét */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">Người lập phiếu (họ tên, chức vụ)</span>
            <input value={rec.contact || ''} disabled={readOnly} onChange={(e) => onField('contact', e.target.value)} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">Điện thoại / email liên hệ</span>
            <input value={rec.phone || ''} disabled={readOnly} onChange={(e) => onField('phone', e.target.value)} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">Tự đánh giá chung, đề xuất, kiến nghị</span>
            <textarea rows={2} value={rec.selfNote || ''} disabled={readOnly} onChange={(e) => onField('selfNote', e.target.value)} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 disabled:bg-slate-50" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[12px] text-slate-500">Chấm điểm theo cột “Cách chấm điểm” của Khung tiêu chí. Mọi tiêu chí, điểm thưởng, điểm trừ đều phải có hồ sơ minh chứng.</p>
          <button onClick={() => setOpenAll((o) => !o)} className="shrink-0 text-[12px] font-semibold text-indigo-600 hover:underline">{openAll ? 'Thu gọn tất cả' : 'Mở tất cả nhóm'}</button>
        </div>

        {allGroups(kind).map((g) => (
          <GroupBlock key={`${openAll}-${g.code}`} group={g} comp={comp} ans={rec.ans} onAns={onAns} readOnly={readOnly} defaultOpen={openAll || g.code === 'I'} />
        ))}

        {/* Điều kiện khác (Điều 6.1.d) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[12px] font-bold text-amber-800 flex items-center gap-1.5"><Info className="w-4 h-4" /> Điều kiện khác theo Điều 6</p>
          <label className="mt-2 flex items-start gap-2 text-[12px] text-slate-700">
            <input type="checkbox" disabled={readOnly} checked={!!flags.ktxh} onChange={(e) => onAns('__flags', { ...flags, ktxh: e.target.checked })} className="mt-0.5 accent-amber-600" />
            <span>Địa phương không hoàn thành từ 30% số chỉ tiêu kinh tế - xã hội chủ yếu trở lên do nguyên nhân chủ quan mà trong năm HĐND <b>không có</b> hoạt động giám sát, chất vấn, giải trình hoặc nghị quyết nhằm tháo gỡ <i>(→ không xếp loại Xuất sắc)</i>.</span>
          </label>
        </div>

        {/* Thẩm định của Tổ công tác */}
        {adminMode && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
            <p className="text-[13px] font-bold text-sky-800 flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4" /> Kết quả thẩm định của Tổ công tác</p>
            <div className="mt-2 grid sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-500">Điểm sau thẩm định (bỏ trống = giữ điểm tự chấm {nf(comp.total)})</span>
                <input type="number" step="0.25" value={rec.review?.total ?? ''} onChange={(e) => onReview({ total: e.target.value === '' ? null : Number(e.target.value) })} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-500">Xếp loại đề xuất (bỏ trống = tự suy theo điểm)</span>
                <select value={rec.review?.grade || ''} onChange={(e) => onReview({ grade: e.target.value })} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 bg-white">
                  <option value="">— Tự suy theo điểm —</option>
                  {TC_GRADES.map((g) => <option key={g.code} value={g.code}>{g.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-500">Người thẩm định</span>
                <input value={rec.review?.by || ''} onChange={(e) => onReview({ by: e.target.value })} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400" />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-[11px] font-semibold text-slate-500">Nhận xét, căn cứ điều chỉnh</span>
                <textarea rows={2} value={rec.review?.note || ''} onChange={(e) => onReview({ note: e.target.value })} className="w-full mt-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400" />
              </label>
            </div>
            <button onClick={onSave} disabled={saving} className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50"><Save className="w-3.5 h-3.5" /> Lưu kết quả thẩm định</button>
          </div>
        )}

        {/* Phê duyệt của Thường trực HĐND tỉnh */}
        {adminMode && (
          <div className={`rounded-2xl border p-4 ${rec.approved ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-600" /> Phê duyệt kết quả đánh giá, xếp loại</p>
            {rec.approved ? (
              <>
                <p className="text-[12px] text-emerald-800 mt-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Đã phê duyệt {rec.approved.grade ? <>— xếp loại <b>{gradeName(rec.approved.grade)}</b></> : null} · {rec.approved.by} · ngày {dmy(rec.approved.at)}
                </p>
                <button onClick={onUnapprove} disabled={saving} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RotateCcw className="w-3.5 h-3.5" /> Bỏ phê duyệt</button>
              </>
            ) : (
              <>
                <p className="text-[12px] text-slate-500 mt-1">Xác nhận kết quả cuối cùng của đơn vị: <b className="text-slate-700">{nf(comp.total)} điểm — {comp.gradeName}</b>. Sau khi phê duyệt, mọi thay đổi điểm chấm sẽ tự động gỡ phê duyệt.</p>
                <button onClick={() => onApprove(comp.grade)} disabled={saving} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"><CheckCircle2 className="w-3.5 h-3.5" /> Phê duyệt kết quả</button>
              </>
            )}
          </div>
        )}
        {!adminMode && rec.approved && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
            <p className="text-[13px] font-bold text-emerald-800 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Kết quả đã được Thường trực HĐND tỉnh phê duyệt {rec.approved.grade ? <>— xếp loại {gradeName(rec.approved.grade)}</> : null}</p>
            <p className="text-[12px] text-emerald-800/90 mt-0.5">{rec.approved.by} · ngày {dmy(rec.approved.at)}</p>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-4 space-y-3">
        <ScoreCard comp={comp} rec={rec} kind={kind} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  XEM KHUNG TIÊU CHÍ (công khai)
// ---------------------------------------------------------------------------
export function KhungView({ kind, onKind }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {TC_KINDS.map((k) => (
          <button key={k.id} onClick={() => onKind(k.id)} className={`text-[12px] font-semibold px-3 py-2 rounded-lg border transition ${kind === k.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{k.phuluc} — {k.name}</button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-[13px] text-slate-600 leading-relaxed"><b>Nguyên tắc chấm điểm:</b> điểm mỗi tiêu chí chấm theo cột “Cách chấm điểm”; điểm lẻ làm tròn đến 0,5 điểm. Tổng điểm = 07 nhóm tiêu chí (tối đa 100) + điểm thưởng nhóm VIII (tối đa 10) − điểm trừ nhóm IX (tối đa 20); không vượt quá 110 và không thấp hơn 0. Mọi tiêu chí, điểm thưởng, điểm trừ đều phải có hồ sơ minh chứng; tiêu chí không có minh chứng thì không được tính điểm.</p>
      </div>
      {allGroups(kind).map((g) => (
        <div key={g.code} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className={`px-4 py-2.5 flex items-center gap-2 ${g.kind === 'deduct' ? 'bg-rose-50' : g.kind === 'bonus' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-[13px] ${g.kind === 'deduct' ? 'bg-rose-600' : g.kind === 'bonus' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>{g.code}</span>
            <span className="flex-1 text-[13px] font-bold text-slate-800">{g.title}</span>
            <span className="text-sm font-extrabold text-slate-600">{g.kind === 'deduct' ? '-' : ''}{g.max}đ</span>
          </div>
          <div className="p-3 space-y-2">
            {g.items.map((it) => (
              <div key={it.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-[13px] font-semibold text-slate-800">{it.id}. {it.title} {it.max != null && <span className="text-[11px] font-bold text-indigo-600">({it.max}đ)</span>}</p>
                {it.subs ? it.subs.map((sb) => (
                  <div key={sb.id}>
                    <p className="mt-1.5 text-[12px] text-slate-600 leading-snug"><b className="text-indigo-600">{sb.id}</b> <span className="text-[11px] font-bold text-slate-500">[{nf(sb.max)}đ]</span> {sb.guide}</p>
                    {sb.fixNote && <p className="mt-1 text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1">{sb.fixNote}</p>}
                  </div>
                )) : (
                  <>
                    <p className="mt-1.5 text-[12px] text-slate-600">Trừ {nf(it.per)}đ/{it.unitLabel}, tối đa trừ {nf(it.cap)}đ. {it.sanctionText}</p>
                    {it.fixNote && <p className="mt-1 text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1">{it.fixNote}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4 text-indigo-600" /> Điều 6 — Điều kiện xếp loại (đã đánh số lại liền mạch)</p>
        <ul className="mt-2 space-y-1.5">
          {DIEU6.map((d) => <li key={d.k} className="text-[12px] text-slate-600 leading-snug"><b className="text-slate-800">{d.k}.</b> {d.text}</li>)}
        </ul>
      </div>
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <p className="text-[13px] font-bold text-sky-800 flex items-center gap-1.5"><Info className="w-4 h-4" /> Nội dung đã chuẩn hóa so với dự thảo (kiến nghị đưa vào bản chính thức)</p>
        <ul className="mt-2 space-y-2">
          {FIX_NOTES.filter((n) => n.kind === 'both' || n.kind === kind).map((n, i) => (
            <li key={i} className="text-[12px] leading-snug">
              <b className="text-sky-900">{n.where}</b>
              <p className="text-slate-500 mt-0.5"><span className="font-semibold text-slate-600">Dự thảo:</span> {n.was}</p>
              <p className="text-sky-800 mt-0.5"><span className="font-semibold">Đã chuẩn hóa:</span> {n.now}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  BẢNG ĐIỀU KHIỂN (Thường trực HĐND tỉnh / Tổ công tác)
// ---------------------------------------------------------------------------
export function AdminBoard({ doc, setDoc, persist, onOpen, saving, readOnly, onApprove, onImportDemo }) {
  const year = doc.cfg.year;
  const [kind, setKind] = useState('xa');
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('kq'); // kq | donvi | cauhinh
  const [newName, setNewName] = useState('');
  const [bulk, setBulk] = useState('');
  const [issued, setIssued] = useState([]); // mã vừa cấp (hiển thị 1 lần)

  const units = (doc.units || []).filter((u) => u.kind === kind);
  const rows = useMemo(() => units.map((u) => {
    const rec = doc.evals[evalKey(u.id, year)];
    const comp = computeTC(u.kind, rec?.ans || {});
    return { u, rec, comp, total: finalOf(rec, comp), grade: finalGradeOf(rec, comp), bonus: comp.bonus, groupV: comp.groups.find((g) => g.code === 'V')?.score || 0 };
  }), [units, doc.evals, year]);

  const quota = useMemo(() => applyQuotaXuatSac(rows.map((r) => ({ id: r.u.id, total: r.total, bonus: r.bonus, groupV: r.groupV, grade: r.grade }))), [rows]);
  const shown = rows.filter((r) => !q.trim() || r.u.name.toLowerCase().includes(q.trim().toLowerCase()) || r.u.code.toLowerCase().includes(q.trim().toLowerCase()));
  const sent = rows.filter((r) => r.rec?.submitted).length;
  const avg = rows.length ? rows.reduce((s, r) => s + r.total, 0) / rows.length : 0;
  const approvedCount = rows.filter((r) => r.rec?.approved).length;
  // Xếp loại chính thức = xếp loại sau thẩm định, có áp trần 25% Xuất sắc (cấp xã).
  const finalGrade = (r) => (kind === 'xa' && r.grade === 'xuatsac' && !quota.picked.has(r.u.id) ? 'tot' : r.grade);
  const pendingApproval = rows.filter((r) => r.rec?.submitted && !r.rec?.approved);
  const isDemo = (doc.units || []).some((u) => u.demo);

  const addUnit = async () => {
    if (!newName.trim()) return;
    const { unit, pin } = await makeUnit({ name: newName.trim(), kind });
    const d = { ...doc, units: [...doc.units, unit] };
    setDoc(d); persist(d); setIssued([{ name: unit.name, code: unit.code, pin }]); setNewName('');
  };
  const addBulk = async () => {
    const made = await parseUnitLines(bulk, kind, doc.units);
    if (!made.length) return;
    const d = { ...doc, units: [...doc.units, ...made.map((m) => m.unit)] };
    setDoc(d); persist(d); setIssued(made.map((m) => ({ name: m.unit.name, code: m.unit.code, pin: m.pin }))); setBulk('');
  };
  const resetPin = async (u) => {
    const pin = randomPin();
    const hash = await hashPin(u.code, pin);
    const d = { ...doc, units: doc.units.map((x) => (x.id === u.id ? { ...x, hash } : x)) };
    setDoc(d); persist(d); setIssued([{ name: u.name, code: u.code, pin }]);
  };
  const toggleActive = (u) => {
    const d = { ...doc, units: doc.units.map((x) => (x.id === u.id ? { ...x, active: x.active === false } : x)) };
    setDoc(d); persist(d);
  };
  const delUnit = (u) => {
    if (!window.confirm(`Xóa đơn vị "${u.name}"? Phiếu tự đánh giá của đơn vị này cũng bị xóa.`)) return;
    const evals = { ...doc.evals };
    Object.keys(evals).forEach((k) => { if (k.startsWith(`${u.id}::`)) delete evals[k]; });
    const d = { ...doc, units: doc.units.filter((x) => x.id !== u.id), evals };
    setDoc(d); persist(d);
  };
  const setCfg = (patch) => { const d = { ...doc, cfg: { ...doc.cfg, ...patch } }; setDoc(d); persist(d); };

  const doExcel = async () => {
    const { exportTieuChiTongHop } = await import('./lib/exporters');
    await exportTieuChiTongHop({
      year, kindName: kindInfo(kind).name, quotaPicked: quota.picked,
      rows: rows.map((r) => ({
        name: r.u.name, code: r.u.code, progress: r.comp.progress, submitted: !!r.rec?.submitted,
        self: r.comp.total, base: r.comp.base, bonus: r.comp.bonus, deduct: r.comp.deduct,
        review: r.rec?.review?.total ?? '', final: r.total, grade: gradeName(finalGrade(r)),
        approved: r.rec?.approved ? `${r.rec.approved.by} · ${dmy(r.rec.approved.at)}` : '',
        capped: r.grade === 'xuatsac' && !quota.picked.has(r.u.id) && kind === 'xa', note: r.rec?.review?.note || '',
        groups: r.comp.groups.filter((g) => g.kind === 'main').map((g) => g.score),
      })),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {TC_KINDS.map((k) => (
          <button key={k.id} onClick={() => setKind(k.id)} className={`text-[12px] font-semibold px-3 py-2 rounded-lg border transition ${kind === k.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{k.short} <span className="opacity-70">({(doc.units || []).filter((u) => u.kind === k.id).length})</span></button>
        ))}
        <span className="flex-1" />
        <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
          {(readOnly ? [['kq', 'Kết quả']] : [['kq', 'Kết quả'], ['donvi', 'Đơn vị & tài khoản'], ['cauhinh', 'Cấu hình']]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`text-[12px] font-semibold px-3 py-2 ${tab === id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{label}</button>
          ))}
        </div>
      </div>

      {tab === 'kq' && (
        <>
          {isDemo && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 flex items-start justify-between gap-3 flex-wrap">
              <p className="flex-1 min-w-[260px] text-[12px] text-amber-900 leading-snug flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <b>Dữ liệu mô phỏng phục vụ trình diễn.</b> Tên đơn vị, điểm số, hồ sơ minh chứng đều là số liệu giả lập, không phải kết quả thật.
                  {onImportDemo && <> Mọi thao tác ở đây chỉ nằm trên trình duyệt.</>}
                </span>
              </p>
              {onImportDemo && !readOnly && (
                <button onClick={onImportDemo} className="shrink-0 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500">
                  <FileDown className="w-3.5 h-3.5" /> Nạp dữ liệu mẫu vào hệ thống thật
                </button>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Đơn vị đánh giá', v: rows.length, ic: Building2, cls: 'text-indigo-600' },
              { label: 'Đã gửi kết quả', v: `${sent}/${rows.length}`, ic: Send, cls: 'text-emerald-600' },
              { label: 'Đã phê duyệt', v: `${approvedCount}/${rows.length}`, ic: ClipboardCheck, cls: 'text-sky-600' },
              { label: 'Điểm trung bình', v: nf(avg), ic: Gauge, cls: 'text-amber-600' },
            ].map((c) => { const Ic = c.ic; return (
              <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2"><Ic className={`w-4 h-4 ${c.cls}`} /><span className="text-[11px] font-semibold text-slate-500">{c.label}</span></div>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{c.v}</p>
              </div>
            ); })}
          </div>

          {kind === 'xa' && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-[13px] font-bold text-emerald-800 flex items-center gap-1.5"><Award className="w-4 h-4" /> Bình xét Xuất sắc — trần {Math.round(QUOTA_XUATSAC * 100)}% (Điều 6 khoản 2)</p>
              <p className="text-[12px] text-emerald-900 mt-1">
                Tổng số đơn vị: <b>{rows.length}</b> · Số suất Xuất sắc tối đa: <b>{quota.limit}</b> · Số đơn vị đủ điều kiện: <b>{quota.candidates}</b>
                {quota.over.length > 0 && <> · <b className="text-amber-700">{quota.over.length} đơn vị</b> đủ điều kiện nhưng vượt tỷ lệ → xem xét xếp loại Tốt.</>}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên hoặc mã đơn vị…" className="flex-1 text-sm outline-none" />
            </div>
            <button onClick={doExcel} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"><FileSpreadsheet className="w-3.5 h-3.5" /> Xuất bảng tổng hợp (Excel)</button>
            {!readOnly && pendingApproval.length > 0 && (
              <button onClick={() => { if (window.confirm(`Phê duyệt kết quả cho ${pendingApproval.length} đơn vị đã gửi (theo xếp loại chính thức, đã áp trần 25% Xuất sắc)?`)) onApprove(pendingApproval.map((r) => ({ unitId: r.u.id, rec: r.rec, grade: finalGrade(r) }))); }}
                className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" /> Phê duyệt {pendingApproval.length} đơn vị đã gửi
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Đơn vị</th>
                    <th className="px-3 py-2 font-semibold">Tiến độ</th>
                    <th className="px-3 py-2 font-semibold">Tự chấm</th>
                    <th className="px-3 py-2 font-semibold">Thẩm định</th>
                    <th className="px-3 py-2 font-semibold">Xếp loại</th>
                    <th className="px-3 py-2 font-semibold">Trạng thái</th>
                    <th className="px-3 py-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400 text-sm">Chưa có đơn vị nào. Sang thẻ “Đơn vị &amp; tài khoản” để thêm.</td></tr>}
                  {shown.sort((a, b) => b.total - a.total).map((r) => {
                    const capped = r.grade === 'xuatsac' && !quota.picked.has(r.u.id) && kind === 'xa';
                    const ap = r.rec?.approved;
                    return (
                      <tr key={r.u.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="px-3 py-2">
                          <p className="font-semibold text-slate-800 text-[13px]">{r.u.name}</p>
                          <p className="text-[11px] text-slate-400">{r.u.code}{r.u.active === false && <span className="ml-1 text-rose-500 font-semibold">· đã khóa</span>}</p>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-block w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden align-middle"><span className="block h-full bg-indigo-500" style={{ width: `${r.comp.progress}%` }} /></span>
                          <span className="ml-1.5 text-[11px] text-slate-500">{r.comp.progress}%</span>
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-slate-700">{nf(r.comp.total)}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{r.rec?.review?.total ?? '—'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${GRADE_CLS[capped ? 'tot' : r.grade]}`}>{gradeName(capped ? 'tot' : r.grade)}</span>
                          {capped && <span className="block text-[10px] text-amber-600 mt-0.5">vượt trần 25%</span>}
                        </td>
                        <td className="px-3 py-2 text-center text-[11px]">
                          {ap ? <span className="inline-flex items-center gap-1 text-emerald-700 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Đã phê duyệt</span>
                            : r.rec?.review?.at ? <span className="text-sky-700 font-semibold">Đã thẩm định</span>
                              : r.rec?.submitted ? <span className="text-emerald-600 font-semibold">Đã gửi {dmy(r.rec.submittedAt)}</span>
                                : r.comp.progress > 0 ? <span className="text-amber-600 font-semibold">Đang làm</span>
                                  : <span className="text-slate-400">Chưa làm</span>}
                          {ap && <span className="block text-[10px] text-slate-400">{dmy(ap.at)}</span>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-2">
                            {!readOnly && r.rec?.submitted && (
                              <button onClick={() => onApprove([{ unitId: r.u.id, rec: r.rec, grade: finalGrade(r) }])}
                                title={ap ? 'Bỏ phê duyệt' : 'Phê duyệt kết quả đơn vị này'}
                                className={`text-[11px] font-semibold px-2 py-1 rounded border ${ap ? 'border-slate-300 text-slate-500 hover:bg-slate-50' : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                                {ap ? 'Bỏ duyệt' : 'Phê duyệt'}
                              </button>
                            )}
                            <button onClick={() => onOpen(r.u)} className="text-[12px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Mở phiếu</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'donvi' && (
        <div className="space-y-4">
          {issued.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-bold text-amber-800 flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Mã truy cập vừa cấp — chỉ hiển thị MỘT LẦN, hãy sao chép và gửi cho đơn vị</p>
                <button onClick={() => setIssued([])} className="text-amber-700 hover:text-amber-900"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-2 space-y-1 max-h-52 overflow-y-auto">
                {issued.map((it) => (
                  <p key={it.code} className="text-[12px] text-amber-900 font-mono">{it.name} — <b>Mã đơn vị:</b> {it.code} · <b>Mã truy cập:</b> {it.pin}</p>
                ))}
              </div>
              <button onClick={() => navigator.clipboard?.writeText(issued.map((i) => `${i.name}\t${i.code}\t${i.pin}`).join('\n'))} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-500"><Copy className="w-3.5 h-3.5" /> Sao chép danh sách</button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Plus className="w-4 h-4 text-indigo-600" /> Thêm 01 đơn vị ({kindInfo(kind).short})</p>
              <div className="mt-2 flex gap-2">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} list="tc-subjects" placeholder={kind === 'xa' ? 'Ví dụ: Phường Hạc Thành' : 'Ví dụ: Ban Kinh tế - Ngân sách'} className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400" />
                <button onClick={addUnit} className="text-[12px] font-semibold px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">Thêm</button>
              </div>
              <datalist id="tc-subjects">{TC_TINH_SUBJECTS.map((s) => <option key={s} value={s} />)}</datalist>
              <p className="text-[11px] text-slate-400 mt-1.5">Hệ thống tự sinh mã đơn vị và mã truy cập.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><ListChecks className="w-4 h-4 text-indigo-600" /> Nhập danh sách hàng loạt</p>
              <textarea rows={4} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={'Mỗi dòng một đơn vị\nXã Hoằng Hóa\nPhường Sầm Sơn | X-SAMSON'} className="w-full mt-2 text-[12px] px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 font-mono" />
              <button onClick={addBulk} className="mt-2 text-[12px] font-semibold px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">Tạo tài khoản cho danh sách</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                  <tr><th className="text-left px-3 py-2 font-semibold">Đơn vị</th><th className="px-3 py-2 font-semibold">Mã đơn vị</th><th className="px-3 py-2 font-semibold">Trạng thái</th><th className="px-3 py-2 font-semibold">Thao tác</th></tr>
                </thead>
                <tbody>
                  {units.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-slate-400 text-sm">Chưa có đơn vị nào.</td></tr>}
                  {units.map((u) => (
                    <tr key={u.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold text-slate-800 text-[13px]">{u.name}</td>
                      <td className="px-3 py-2 text-center font-mono text-[12px] text-slate-600">{u.code}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${u.active === false ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{u.active === false ? 'Đã khóa' : 'Hoạt động'}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => resetPin(u)} title="Cấp lại mã truy cập" className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Cấp lại mã</button>
                          <button onClick={() => toggleActive(u)} title={u.active === false ? 'Mở khóa' : 'Khóa đăng nhập'} className="text-slate-400 hover:text-slate-700">{u.active === false ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}</button>
                          <button onClick={() => delUnit(u)} title="Xóa đơn vị" className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'cauhinh' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 max-w-2xl">
          <label className="block">
            <span className="text-[12px] font-semibold text-slate-600">Năm đánh giá đang mở</span>
            <input value={doc.cfg.year} onChange={(e) => setCfg({ year: e.target.value })} className="w-32 mt-1 block text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400" />
            <span className="text-[11px] text-slate-400">Đơn vị đăng nhập sẽ tự đánh giá cho năm này (Điều 5: gửi kết quả trước ngày 25/12).</span>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-slate-700">
            <input type="checkbox" checked={doc.cfg.open !== false} onChange={(e) => setCfg({ open: e.target.checked })} className="accent-indigo-600" />
            Đang mở cho các đơn vị gửi kết quả tự đánh giá
          </label>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-[12px] font-bold text-slate-700">Lưu ý bảo mật</p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Mã truy cập của đơn vị chỉ được lưu dưới dạng chuỗi băm SHA-256 (không lưu bản rõ). Khi đơn vị quên mã, Quản trị bấm “Cấp lại mã”. Để đơn vị lưu được kết quả lên máy chủ, cần chạy BƯỚC 5 trong <code className="bg-white px-1 rounded">supabase/schema.sql</code>.</p>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-3">
            <p className="text-[12px] font-bold text-sky-800">Nội dung đã chuẩn hóa so với dự thảo</p>
            <ul className="mt-1 space-y-1.5">{FIX_NOTES.map((n, i) => <li key={i} className="text-[11px] text-sky-900 leading-snug">• <b>{n.where}:</b> {n.now}</li>)}</ul>
            <p className="text-[10px] text-sky-700 mt-1.5">Chi tiết “dự thảo ghi gì / đã sửa thế nào” xem ở mục <b>Khung tiêu chí</b>.</p>
          </div>
          {saving && <p className="text-[12px] text-slate-500">Đang lưu…</p>}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  CỔNG ĐĂNG NHẬP MODULE
// ---------------------------------------------------------------------------
export function Gate({ doc, altDoc, onUnit, onAdmin, onKhung, onGuest, busy }) {
  // Gợi ý mã đơn vị mẫu: lấy từ bộ dữ liệu đang xem hoặc bộ còn lại (mẫu/thật).
  const demoUnits = [...(doc.units || []), ...((altDoc && altDoc.units) || [])].filter((u) => u.demo);
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [aEmail, setAEmail] = useState('');
  const [aPw, setAPw] = useState('');
  const [aErr, setAErr] = useState('');

  const submitUnit = async (e) => {
    e.preventDefault(); setErr('');
    let r = await unitLogin(doc, code, pin);
    let fromAlt = false;
    // Không thấy ở bộ dữ liệu đang xem → thử bộ còn lại (vd: gõ mã đơn vị mẫu khi đang xem dữ liệu thật).
    if (!r.ok && altDoc) { const r2 = await unitLogin(altDoc, code, pin); if (r2.ok) { r = r2; fromAlt = true; } }
    if (!r.ok) {
      setErr(r.reason === 'no-unit' ? 'Không tìm thấy mã đơn vị. Vui lòng kiểm tra lại hoặc liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh.'
        : r.reason === 'locked' ? 'Tài khoản đơn vị đang bị khóa.' : 'Mã truy cập không đúng.');
      return;
    }
    onUnit(r.unit, r.hash, fromAlt);
  };
  const submitAdmin = async (e) => {
    e.preventDefault(); setAErr('');
    if (isAdminCredential(aEmail, aPw)) {
      const { error } = supabase ? await signInWithPassword(resolveLoginEmail(aEmail), aPw) : { error: true };
      onAdmin(error ? 'local' : 'server', ADMIN.email);
      return;
    }
    if (!supabase) { setAErr('Chưa cấu hình máy chủ.'); return; }
    const { error } = await signInWithPassword(resolveLoginEmail(aEmail), aPw);
    if (error) { setAErr('Email hoặc mật khẩu không đúng.'); return; }
    const s = await getSession();
    const em = (s?.user?.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(em)) { setAErr('Tài khoản này không có quyền quản trị Khung tiêu chí.'); return; }
    onAdmin('server', em);
  };

  const inputCls = 'w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex w-20 h-20 rounded-full bg-white items-center justify-center shadow-xl ring-2 ring-indigo-200 p-2 mb-3">
          <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
        </div>
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-indigo-500">Hệ thống đánh giá, xếp loại</p>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">Đánh giá, xếp loại HĐND cấp tỉnh, cấp xã</h1>
        <p className="text-sm text-slate-500 mt-1">Khung tiêu chí nhiệm kỳ 2026 - 2031 · Thường trực HĐND tỉnh Thanh Hóa</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <form onSubmit={submitUnit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Building2 className="w-5 h-5" /></span>
            <div><p className="text-[13px] font-bold text-slate-800">Đăng nhập đơn vị</p><p className="text-[11px] text-slate-500">HĐND xã, phường · Ban, Tổ đại biểu, Văn phòng</p></div>
          </div>
          <label className="block mb-2"><span className="text-[11px] font-semibold text-slate-500">Mã đơn vị</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ví dụ: X-HOANGHOA" className={`${inputCls} mt-1 font-mono uppercase`} /></label>
          <label className="block mb-3"><span className="text-[11px] font-semibold text-slate-500">Mã truy cập</span>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••••" className={`${inputCls} mt-1`} /></label>
          {err && <p className="text-[12px] text-rose-600 mb-2 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {err}</p>}
          <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition disabled:opacity-50"><LogIn className="w-4 h-4" /> Vào phiếu tự đánh giá</button>
          <p className="text-[11px] text-slate-400 mt-2 leading-snug">Mã đơn vị và mã truy cập do Văn phòng Đoàn ĐBQH và HĐND tỉnh cấp. Quên mã: liên hệ đ/c Hà Ngọc Sơn — 0904818886.</p>
          {demoUnits.length > 0 && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-[11px] font-bold text-amber-800">Đăng nhập thử với dữ liệu mô phỏng</p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">Mã truy cập chung: <b className="font-mono">{DEMO_PIN}</b></p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {demoUnits.slice(0, 6).map((u) => (
                  <button key={u.id} type="button" onClick={() => { setCode(u.code); setPin(DEMO_PIN); setErr(''); }}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-300 bg-white text-amber-800 hover:bg-amber-100">{u.code}</button>
                ))}
              </div>
            </div>
          )}
        </form>

        <form onSubmit={submitAdmin} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></span>
            <div><p className="text-[13px] font-bold text-slate-800">Thường trực HĐND tỉnh / Tổ công tác</p><p className="text-[11px] text-slate-500">Theo dõi tiến độ · thẩm định · bình xét</p></div>
          </div>
          <label className="block mb-2"><span className="text-[11px] font-semibold text-slate-500">Email (hoặc tên đăng nhập quản trị)</span>
            <input value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder="ten@coquan.gov.vn" className={`${inputCls} mt-1`} /></label>
          <label className="block mb-3"><span className="text-[11px] font-semibold text-slate-500">Mật khẩu</span>
            <input type="password" value={aPw} onChange={(e) => setAPw(e.target.value)} placeholder="••••••••" className={`${inputCls} mt-1`} /></label>
          {aErr && <p className="text-[12px] text-rose-600 mb-2 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {aErr}</p>}
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl transition"><ShieldCheck className="w-4 h-4" /> Vào bảng điều khiển</button>
        </form>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-slate-600">Chưa có tài khoản? Vẫn xem được kết quả đánh giá của các đơn vị và toàn văn Khung tiêu chí — <b>chỉ xem, không chỉnh sửa</b>.</p>
        <div className="flex items-center gap-2">
          <button onClick={onGuest} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"><Eye className="w-3.5 h-3.5" /> ← Quay lại xem kết quả</button>
          <button onClick={onKhung} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"><ListChecks className="w-3.5 h-3.5" /> Xem Khung tiêu chí</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  MODULE CHÍNH
// ---------------------------------------------------------------------------
export default function TieuChiHDND({ onHome }) {
  // HAI BỘ DỮ LIỆU TÁCH RIÊNG:
  //  • realDoc — dữ liệu THẬT (máy chủ / cache), là nơi lưu kết quả chính thức;
  //  • demoDoc — dữ liệu MẪU (mô phỏng 10 xã, phường + 4 đơn vị cấp tỉnh), chỉ nằm trên
  //    trình duyệt để xem thử và thao tác thử; không bao giờ ghi đè dữ liệu thật.
  // Người dùng chuyển qua lại bằng nút "Dữ liệu mẫu / Dữ liệu thật" trên thanh trên.
  const [realDoc, setRealDoc] = useState(readTC);
  const [demoDoc, setDemoDoc] = useState(null);
  const [useDemo, setUseDemo] = useState(false);
  const useDemoRef = useRef(false);
  useDemoRef.current = useDemo;
  const doc = (useDemo ? demoDoc : realDoc) || EMPTY_TC;
  const setDoc = useCallback((d) => { if (useDemoRef.current) setDemoDoc(d); else setRealDoc(d); }, []);
  const [syncing, setSyncing] = useState(true); // đang đồng bộ bản mới từ máy chủ (vẫn hiển thị ngay bản cache)
  // Mặc định vào thẳng BẢNG KẾT QUẢ ở chế độ khách (chỉ xem) để thấy ngay dữ liệu;
  // đăng nhập chỉ cần khi đơn vị muốn chấm điểm hoặc Thường trực muốn thẩm định, phê duyệt.
  const [view, setView] = useState('admin');     // gate | phieu | admin | khung
  const [admin, setAdmin] = useState(null);      // { mode:'server'|'local', email }
  const [guest, setGuest] = useState(true);      // khách xem dữ liệu — KHÔNG chỉnh sửa được
  const [unitSess, setUnitSess] = useState(readUnitSession);
  const [openUnitId, setOpenUnitId] = useState(null); // quản trị đang mở phiếu đơn vị nào
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [khungKind, setKhungKind] = useState('xa');
  const docRef = useRef(doc);
  docRef.current = doc;

  const year = doc.cfg?.year || String(new Date().getFullYear());

  // Nạp dữ liệu + nhận diện phiên quản trị sẵn có
  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await fetchTC();
      const dm = await seedTieuChi(d.cfg?.year);   // luôn dựng sẵn bộ dữ liệu mẫu
      if (!alive) return;
      setRealDoc(d); setDemoDoc(dm);
      // Dữ liệu thật còn quá ít (chưa triển khai thật) → mở bằng DỮ LIỆU MẪU cho dễ hình dung.
      const useD = (d.units || []).length < 3;
      setUseDemo(useD); useDemoRef.current = useD;
      setSyncing(false);
      // Đang đăng nhập sẵn bằng tài khoản quản trị (dùng chung phiên với các phân hệ khác)
      const s = await getSession();
      const em = (s?.user?.email || '').toLowerCase();
      const isAdm = !!em && ADMIN_EMAILS.includes(em);
      if (alive && isAdm) { setAdmin({ mode: 'server', email: em }); setGuest(false); setView('admin'); }
      // BẢN DEMO — dữ liệu mẫu được coi như DỮ LIỆU CHÍNH THỐNG: máy chủ chưa có đơn vị
      // nào thì lần đầu Quản trị (Thường trực HĐND tỉnh) mở module sẽ GHI thẳng bộ đơn vị
      // mẫu lên máy chủ. Từ đó khách và quản trị cùng đọc một bảng kết quả, không còn cảnh
      // mỗi bên thấy một danh sách khác nhau.
      if (alive && isAdm && !(d.units || []).length && (dm.units || []).length) {
        setRealDoc(dm); setUseDemo(false); useDemoRef.current = false;
        await saveTC(dm);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Khôi phục phiên đơn vị đã đăng nhập trước đó (chỉ làm 1 lần khi mở module)
  const bootedRef = useRef(false);
  useEffect(() => {
    if (syncing || bootedRef.current) return;
    bootedRef.current = true;
    if (!unitSess) return;
    const inReal = (realDoc.units || []).find((x) => x.id === unitSess.unitId);
    const inDemo = ((demoDoc && demoDoc.units) || []).find((x) => x.id === unitSess.unitId);
    const u = inReal || inDemo;
    if (u && u.hash === unitSess.hash && u.active !== false) {
      const toDemo = !inReal;                    // phiên thuộc bộ dữ liệu nào thì mở đúng bộ đó
      useDemoRef.current = toDemo; setUseDemo(toDemo);
      setGuest(false); setView('phieu');
    } else { writeUnitSession(null); setUnitSess(null); }
  }, [syncing, unitSess, realDoc.units, demoDoc]);

  const activeUnit = useMemo(() => {
    const id = (admin || guest) && openUnitId ? openUnitId : unitSess?.unitId;
    return (doc.units || []).find((u) => u.id === id) || null;
  }, [doc.units, admin, guest, openUnitId, unitSess]);

  // Nạp bản nháp phiếu khi đổi đơn vị / năm
  useEffect(() => {
    if (!activeUnit) { setDraft(null); return; }
    const rec = doc.evals[evalKey(activeUnit.id, year)];
    setDraft(rec ? JSON.parse(JSON.stringify(rec)) : newRecord(activeUnit, year));
    setDirty(false); setMsg('');
  }, [activeUnit, year, doc.evals]);

  const DEMO_MSG = 'Đang thao tác trên DỮ LIỆU MẪU — thay đổi chỉ nằm trên trình duyệt, không ghi vào dữ liệu thật.';
  const persistDoc = useCallback(async (d) => {
    if (useDemoRef.current) { setDemoDoc(d); setMsg(DEMO_MSG); return; }
    setSaving(true);
    const r = await saveTC(d);
    setSaving(false);
    if (!r.ok) setMsg('Chưa lưu được lên máy chủ (dữ liệu đang giữ trên máy này). Kiểm tra đăng nhập/Cấu hình Supabase.');
    else setMsg('');
  }, []);

  // Sửa điểm chấm → TỰ GỠ phê duyệt (phải phê duyệt lại kết quả mới).
  const setAns = (id, val) => { setDraft((d) => ({ ...d, ans: { ...d.ans, [id]: val }, approved: null })); setDirty(true); };
  const setField = (k, v) => { setDraft((d) => ({ ...d, [k]: v })); setDirty(true); };
  const setReview = (patch) => { setDraft((d) => ({ ...d, review: { ...(d.review || {}), ...patch, at: new Date().toISOString(), by: patch.by ?? d.review?.by ?? (admin?.email || '') } })); setDirty(true); };

  const saveDraft = async (extra = {}) => {
    if (!draft || !activeUnit) return;
    const rec = { ...draft, ...extra, updatedAt: new Date().toISOString() };
    setDraft(rec); setDirty(false); setSaving(true);
    const d = { ...docRef.current, evals: { ...docRef.current.evals, [evalKey(activeUnit.id, year)]: rec } };
    setDoc(d);
    if (useDemoRef.current) { setMsg(DEMO_MSG); setSaving(false); return; } // dữ liệu mẫu: không ghi lên máy chủ
    if (admin) {
      const r = await saveTC(d);
      setMsg(r.ok ? '' : 'Chưa lưu được lên máy chủ — dữ liệu đang giữ trên máy này.');
    } else {
      const r = await saveUnitEval(activeUnit.code, unitSess.hash, year, rec);
      setMsg(r.ok ? '' : 'Máy chủ chưa bật chức năng nhận phiếu (cần chạy BƯỚC 5 trong supabase/schema.sql). Dữ liệu đang được giữ trên máy này.');
    }
    setSaving(false);
  };

  const submitRec = async () => {
    if (!draft) return;
    if (draft.submitted) { if (window.confirm('Mở lại phiếu để chỉnh sửa?')) await saveDraft({ submitted: false }); return; }
    const comp = computeTC(activeUnit.kind, draft.ans);
    if (comp.progress < 100 && !window.confirm(`Mới khai báo ${comp.progress}% số điểm thành phần. Vẫn gửi kết quả?`)) return;
    await saveDraft({ submitted: true, submittedAt: new Date().toISOString() });
  };

  // Quản trị (Thường trực HĐND tỉnh) phê duyệt / bỏ phê duyệt kết quả của đơn vị đang mở.
  const approveDraft = async (grade) => {
    if (!draft || !admin) return;
    await saveDraft({ approved: { by: admin.mode === 'local' ? 'Thường trực HĐND tỉnh' : admin.email, at: new Date().toISOString(), grade: grade || '' } });
  };
  const unapproveDraft = async () => { if (admin) await saveDraft({ approved: null }); };

  // Phê duyệt hàng loạt từ bảng điều khiển (đã áp trần 25% Xuất sắc).
  const approveUnits = async (items) => {
    if (!admin || !items.length) return;
    const by = admin.mode === 'local' ? 'Thường trực HĐND tỉnh' : admin.email;
    const at = new Date().toISOString();
    const evals = { ...docRef.current.evals };
    items.forEach(({ unitId, rec, grade }) => {
      const k = evalKey(unitId, year);
      evals[k] = { ...(evals[k] || rec), approved: rec?.approved ? null : { by, at, grade: grade || '' } };
    });
    const d = { ...docRef.current, evals };
    setDoc(d); await persistDoc(d);
  };

  // Chuyển giữa dữ liệu mẫu và dữ liệu thật: đóng phiếu đang mở, quay về bảng kết quả.
  const switchSource = (toDemo) => {
    if (toDemo === useDemo) return;
    if (dirty && !window.confirm('Phiếu đang mở có thay đổi chưa lưu. Vẫn chuyển?')) return;
    useDemoRef.current = toDemo;
    setUseDemo(toDemo); setOpenUnitId(null); setDraft(null); setDirty(false); setMsg('');
    setView(view === 'khung' ? 'khung' : 'admin');
    if (!admin) { setGuest(true); writeUnitSession(null); setUnitSess(null); }
  };

  // Quản trị đưa dữ liệu mẫu vào hệ thống thật (bỏ qua đơn vị đã tồn tại) rồi lưu.
  const importDemo = async () => {
    if (!admin || !demoDoc) return;
    if (!window.confirm(`Nạp ${demoDoc.units.length} đơn vị mẫu (kèm phiếu tự đánh giá) vào DỮ LIỆU THẬT? Dùng để trình diễn; có thể xóa từng đơn vị sau.`)) return;
    const have = new Set((realDoc.units || []).map((u) => String(u.name || '').toLowerCase()));
    const add = demoDoc.units.filter((u) => !have.has(u.name.toLowerCase()));
    const evals = { ...realDoc.evals };
    add.forEach((u) => { const k = evalKey(u.id, year); if (demoDoc.evals[k]) evals[k] = demoDoc.evals[k]; });
    const d = { ...realDoc, units: [...(realDoc.units || []), ...add], evals };
    useDemoRef.current = false; setUseDemo(false); setRealDoc(d); setOpenUnitId(null); setDraft(null);
    setSaving(true);
    const r = await saveTC(d);
    setSaving(false);
    setMsg(r.ok ? '' : 'Đã nạp vào máy này nhưng chưa lưu được lên máy chủ (kiểm tra đăng nhập/Supabase).');
  };

  const logoutUnit = () => { writeUnitSession(null); setUnitSess(null); setGuest(true); setView('admin'); setDraft(null); };
  const logoutAdmin = () => { setAdmin(null); setOpenUnitId(null); setGuest(true); setView('admin'); };
  const logoutGuest = () => { setOpenUnitId(null); setView('gate'); }; // khách bấm Đăng nhập

  // Khách chỉ XEM; đơn vị không sửa được khi đã gửi hoặc đợt đánh giá đã đóng.
  const readOnly = guest || (!admin && (!!draft?.submitted || doc.cfg?.open === false));

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Thanh trên */}
      <header className="bg-gradient-to-br from-[#1e1b4b] via-[#3730a3] to-[#1d4ed8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/40 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-indigo-200">Hệ thống đánh giá, xếp loại</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Đánh giá tiêu chí HĐND tỉnh, xã, phường</h1>
              <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20">Năm đánh giá: <b>{year}</b></span>
            {syncing && <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-indigo-100">Đang đồng bộ…</span>}
            {!syncing && (
              <div className="flex items-center rounded-lg overflow-hidden border border-white/25 bg-white/10" title="Chuyển giữa dữ liệu mô phỏng (xem thử) và dữ liệu thật của các đơn vị">
                <button onClick={() => switchSource(true)} className={`text-[11px] font-semibold px-2.5 py-1.5 transition-colors ${useDemo ? 'bg-amber-300 text-amber-950' : 'text-white/80 hover:bg-white/10'}`}>Dữ liệu mẫu ({(demoDoc?.units || []).length})</button>
                <button onClick={() => switchSource(false)} className={`text-[11px] font-semibold px-2.5 py-1.5 transition-colors ${!useDemo ? 'bg-white text-slate-800' : 'text-white/80 hover:bg-white/10'}`}>Dữ liệu thật ({(realDoc?.units || []).length})</button>
              </div>
            )}
            {admin && (
              <>
                <button onClick={() => { setOpenUnitId(null); setView('admin'); }} className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border ${view === 'admin' ? 'bg-white text-indigo-800 border-white' : 'bg-white/10 border-white/25 hover:bg-white/20'}`}>Bảng điều khiển</button>
                <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-300/30 text-emerald-50">{admin.mode === 'local' ? 'Quản trị (cục bộ)' : admin.email}</span>
                <button onClick={logoutAdmin} title="Thoát" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><LogOut className="w-4 h-4" /></button>
              </>
            )}
            {!admin && !guest && unitSess && (
              <>
                <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20">{activeUnit?.name}</span>
                <button onClick={logoutUnit} title="Thoát" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><LogOut className="w-4 h-4" /></button>
              </>
            )}
            {guest && (
              <>
                <button onClick={() => { setOpenUnitId(null); setView('admin'); }} className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border ${view === 'admin' ? 'bg-white text-indigo-800 border-white' : 'bg-white/10 border-white/25 hover:bg-white/20'}`}>Kết quả đánh giá</button>
                <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-50">Khách · chỉ xem</span>
                <button onClick={logoutGuest} title="Đăng nhập để chấm điểm / thẩm định, phê duyệt" className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white text-indigo-800 hover:bg-indigo-50"><LogIn className="w-4 h-4" /> Đăng nhập</button>
              </>
            )}
            <button onClick={() => setView('khung')} className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border ${view === 'khung' ? 'bg-white text-indigo-800 border-white' : 'bg-white/10 border-white/25 hover:bg-white/20'}`}>Khung tiêu chí</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {view === 'gate' ? (
          <Gate doc={doc} altDoc={useDemo ? realDoc : demoDoc} busy={saving}
            onUnit={(u, hash, fromAlt) => {
              if (fromAlt) { const toDemo = !useDemo; useDemoRef.current = toDemo; setUseDemo(toDemo); }
              const s = { unitId: u.id, code: u.code, hash, at: today() };
              writeUnitSession(s); setUnitSess(s); setGuest(false); setOpenUnitId(null); setView('phieu');
            }}
            onAdmin={(mode, email) => { setAdmin({ mode, email }); setGuest(false); setView('admin'); }}
            onGuest={() => { setGuest(true); setView('admin'); }}
            onKhung={() => setView('khung')} />
        ) : view === 'khung' ? (
          <>
            <button onClick={() => setView(admin || guest ? 'admin' : unitSess ? 'phieu' : 'gate')} className="mb-3 text-[12px] font-semibold text-indigo-600 hover:underline">← Quay lại</button>
            <KhungView kind={khungKind} onKind={setKhungKind} />
          </>
        ) : syncing && !(doc.units || []).length ? (
          <p className="text-center text-slate-400 text-sm py-16">Đang nạp dữ liệu đánh giá…</p>
        ) : view === 'admin' && (admin || guest) ? (
          <>
            {guest && (
              <p className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-[12px] text-indigo-900 leading-snug flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Đang ở chế độ <b>khách — chỉ xem</b>. Bấm <b>Đăng nhập</b> ở góc trên để đơn vị tự chấm điểm (mã đơn vị + mã truy cập) hoặc để Thường trực HĐND tỉnh / Tổ công tác thẩm định, phê duyệt.</span>
              </p>
            )}
            <AdminBoard doc={doc} setDoc={setDoc} persist={persistDoc} saving={saving} readOnly={guest}
              onImportDemo={useDemo && admin ? importDemo : null}
              onApprove={approveUnits} onOpen={(u) => { setOpenUnitId(u.id); setView('phieu'); }} />
          </>
        ) : view === 'phieu' && activeUnit && draft ? (
          <>
            {(admin || guest) && <button onClick={() => { setOpenUnitId(null); setView('admin'); }} className="mb-3 text-[12px] font-semibold text-indigo-600 hover:underline">← Về bảng kết quả</button>}
            <Phieu unit={activeUnit} rec={draft} year={year} readOnly={readOnly} adminMode={!!admin}
              onAns={setAns} onField={setField} onReview={setReview}
              onApprove={approveDraft} onUnapprove={unapproveDraft}
              onSave={() => saveDraft()} onSubmit={submitRec} saving={saving} dirty={dirty}
              note={guest ? 'Bạn đang xem ở chế độ khách (chỉ xem) — dữ liệu mô phỏng, không chỉnh sửa được.'
                : readOnly ? (draft.submitted ? 'Phiếu đã gửi — bấm “Mở lại để sửa” nếu cần chỉnh (chỉ khi đợt đánh giá còn mở).' : 'Đợt đánh giá đã đóng, phiếu chỉ xem.') : msg} />
          </>
        ) : (
          <p className="text-center text-slate-400 text-sm py-16">Chưa chọn đơn vị. <button onClick={() => setView('gate')} className="text-indigo-600 font-semibold hover:underline">Đăng nhập</button></p>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 text-center text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-amber-600">⚠ Bản demo thử nghiệm — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
        <p>Khung tiêu chí theo dự thảo Quyết định của Thường trực HĐND tỉnh Thanh Hóa, nhiệm kỳ 2026 - 2031.</p>
        <p>© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa · Liên hệ: đ/c Hà Ngọc Sơn, Phó Chánh Văn phòng — 0904818886</p>
      </footer>
    </div>
  );
}
