// ============================================================================
//  PHÂN HỆ "BỘ BIỂU VỊ TRÍ VIỆC LÀM" (#/vtvl) — chuyển bộ biểu Excel thành
//  ứng dụng nhập liệu có kiểm tra lỗi.
//
//  Năm tab: Tổng quan · Nhập liệu · Nhập từ tệp · Kiểm tra lỗi · Hướng dẫn.
//   - Nhập liệu: bảng giống Excel (ô trắng nhập, ô xám tự tính, cột cảnh báo
//     tô màu) + biểu mẫu từng dòng có hướng dẫn của HD_DIEN_BIEU cho từng cột.
//   - Nhập từ tệp: đọc chính tệp bộ biểu .xlsx (kể cả tệp 30.000 dòng của Ban),
//     CSV hoặc nội dung dán từ Excel → xem trước, báo lỗi đến từng ô, xuất báo
//     cáo lỗi, rồi mới áp dụng.
//  Mọi công thức ở src/lib/vtvl.js; đọc tệp ở src/lib/vtvlNhap.js.
//
//  Quyền: khách XEM dữ liệu và dùng "kiểm tra tệp" (không ghi gì); nhập liệu và
//  áp dụng tệp phải đăng nhập. Sửa một dòng ĐÃ XÁC NHẬN thì tự ghi biểu S (nhật ký).
// ============================================================================
import { useState, useEffect, useMemo, useRef, useCallback, createElement } from 'react';
import {
  Home, FileSpreadsheet, LayoutDashboard, Table2, Upload, ShieldAlert, BookOpen, Plus, Trash2, Copy,
  PanelRightOpen, X, ChevronLeft, ChevronRight, Search, Download, Save, CheckCircle2, AlertTriangle,
  Info, ClipboardPaste, RefreshCw, FileDown, ArrowRight, LogIn, Sigma, CircleAlert, Wand2, Undo2,
} from 'lucide-react';
import { getSession, onAuthChange, GUEST } from './lib/auth';
import {
  BIEU, BIEU_THEO_ID, NHOM_BIEU, cotNhap, cotKhoa, dsCua, newDong, tinhToan, kiemTraDuLieu, dongHienThi,
  giaTriO, chuyenGiaTri, laSo, rong, kk, dongDaXacNhan, dongNhatKy, TT_DAT, TT_THONG_TIN, TAM_BUOC, SAU_NHOM,
  KHAC_EXCEL, viDuKiemThu, QUY_GIO_PP2, chuanHoaVTVL, soDong,
} from './lib/vtvl';
import { HD } from './lib/vtvlHuongDan';
import { docTep, phanTichTep, chuanBiNhap, docBangChu, bieuTheoTenTrang, CHE_DO, MUC_TEN } from './lib/vtvlNhap';
import { deXuatSua, apDungSua } from './lib/vtvlSuaLoi';
import { readVTVL, cacheVTVL, fetchVTVL, saveVTVL, kichThuocKB, CANH_BAO_KB } from './lib/vtvlStore';

const MOI_TRANG = 50;
const inp = 'w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] text-slate-700 outline-none focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-500';
const nutChinh = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const nutPhu = 'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed';
const fmtSo = (v) => (laSo(v) ? v.toLocaleString('vi-VN', { maximumFractionDigits: 4 }) : v);
const renderIcon = (bieuTuong) => createElement(bieuTuong, { className: 'w-4 h-4' });
const giaTriHienThi = (v) => (rong(v) ? '' : fmtSo(v));

const TABS = [
  { id: 'tongquan', ten: 'Tổng quan', Ic: LayoutDashboard },
  { id: 'nhap', ten: 'Nhập liệu', Ic: Table2 },
  { id: 'tep', ten: 'Nhập từ tệp', Ic: Upload },
  { id: 'kiemtra', ten: 'Kiểm tra lỗi', Ic: ShieldAlert },
  { id: 'huongdan', ten: 'Hướng dẫn', Ic: BookOpen },
];

function mauTrangThai(bieuId, v) {
  if (rong(v)) return '';
  if ((TT_DAT[bieuId] || []).includes(v)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if ((TT_THONG_TIN[bieuId] || []).includes(v)) return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

function goiYCot(b, col) {
  const h = HD[b.id]?.cot?.[col.k];
  const loai = col.kieu === 'tinh' ? 'Tự động — không nhập' : col.kieu === 'ds' ? 'Chọn trong danh sách' : col.ref ? `Chọn mã có ở biểu ${BIEU_THEO_ID[col.ref].ma}` : 'Nhập';
  const dong = [`${col.k} · ${col.ten} — ${loai}`];
  if (h?.noiDung) dong.push(`Điền: ${h.noiDung}`);
  if (h?.cachGhi) dong.push(`Cách ghi: ${h.cachGhi}`);
  if (h?.luuY) dong.push(`Lưu ý: ${h.luuY}`);
  return dong.join('\n');
}

// ─── Ô nhập trong bảng (không điều khiển — chỉ ghi khi rời ô / Enter) ─────────
function ONhap({ col, v, onGhi, khoa = false, lop = '', dlId }) {
  const ghi = (raw) => { const { v: moi } = chuyenGiaTri(col, raw); if (moi !== v && !(rong(moi) && rong(v))) onGhi(moi); };
  const base = `w-full bg-transparent px-2 py-1.5 text-[12.5px] outline-none focus:bg-white focus:ring-2 focus:ring-sky-400 rounded ${lop}`;
  const enter = (e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { e.currentTarget.value = giaTriHienThi(v); e.currentTarget.blur(); } };
  if (col.kieu === 'ds') {
    const list = dsCua(col);
    return (
      <select disabled={khoa} value={rong(v) ? '' : String(v)} onChange={(e) => ghi(e.target.value)} className={`${base} cursor-pointer`}>
        <option value="">—</option>
        {!rong(v) && !list.includes(v) && <option value={String(v)}>{String(v)} (không hợp lệ)</option>}
        {list.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    );
  }
  if (col.kieu === 'ngay' && (rong(v) || /^\d{4}-\d{2}-\d{2}$/.test(v))) {
    return <input type="date" disabled={khoa} defaultValue={v || ''} key={String(v)} onBlur={(e) => ghi(e.target.value)} className={base} />;
  }
  const so = col.kieu === 'so' || col.kieu === 'nam';
  return (
    <input disabled={khoa} defaultValue={giaTriHienThi(v)} key={String(v)} list={dlId}
      inputMode={so ? 'decimal' : undefined} onBlur={(e) => ghi(e.target.value)} onKeyDown={enter}
      className={`${base} ${so ? 'text-right tabular-nums' : ''}`} />
  );
}

// ─── Bảng nhập liệu của một biểu ────────────────────────────────────────────
function BangBieu({ b, doc, kq, vanDe, docOnly, onSua, onThem, onXoa, onNhanBan, onXoaHet, onMoForm, onDan, diToi }) {
  const [tim, setTim] = useState('');
  const [loc, setLoc] = useState('tat');
  const [trang, setTrang] = useState(0);
  const [nhay, setNhay] = useState(null);
  const tatCa = useMemo(() => dongHienThi(doc, kq, b.id), [doc, kq, b.id]);
  const loc2 = useMemo(() => {
    const q = kk(tim);
    return tatCa.map((d, i) => ({ ...d, i })).filter((d) => {
      const vd = vanDe.theoDong.get(d.row._id) || [];
      if (loc === 'loi' && !vd.some((x) => x.muc === 'loi')) return false;
      if (loc === 'canh' && !vd.some((x) => x.muc === 'canh')) return false;
      if (!q) return true;
      return b.cot.some((c) => kk(giaTriO(b, d.row, d.t, c)).includes(q));
    });
  }, [tatCa, tim, loc, vanDe, b]);
  const soTrang = Math.max(1, Math.ceil(loc2.length / MOI_TRANG));
  const tr = Math.min(trang, soTrang - 1);
  const hien = loc2.slice(tr * MOI_TRANG, tr * MOI_TRANG + MOI_TRANG);
  const tuTinh = !!b.tuTinh;

  useEffect(() => { setTrang(0); }, [b.id]);
  useEffect(() => {
    if (!diToi || diToi.bieu !== b.id) return;
    setTim(''); setLoc('tat');
    const i = tatCa.findIndex((d) => d.row._id === diToi.id);
    if (i < 0) return;
    setTrang(Math.floor(i / MOI_TRANG));
    setNhay(diToi.id);
    setTimeout(() => document.getElementById(`vt-${diToi.id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
    const h = setTimeout(() => setNhay(null), 2600);
    return () => clearTimeout(h);
  }, [diToi]); // eslint-disable-line react-hooks/exhaustive-deps

  const datalists = b.cot.filter((c) => c.ref || c.goiY).map((c) => {
    const vals = c.ref ? [...new Set((doc.bieu[c.ref] || []).map((r) => r.A).filter((x) => !rong(x)))].slice(0, 800) : dsCua(c);
    return <datalist key={c.k} id={`dl-${b.id}-${c.k}`}>{vals.map((x) => <option key={x} value={x} />)}</datalist>;
  });
  const h = HD[b.id];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-w-0">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">{b.sheet}{b.dauMoi ? ' · đầu mối tổng hợp nhập' : ''}</p>
            <h3 className="text-lg font-extrabold text-slate-800">{b.ma} — {b.ten}</h3>
            <p className="text-[12.5px] text-slate-500 mt-0.5 max-w-3xl">{b.moTa || h?.moTa}</p>
          </div>
          {!tuTinh && !docOnly && (
            <div className="flex gap-2 flex-wrap">
              <button onClick={onThem} className={nutChinh}><Plus className="w-4 h-4" /> Thêm dòng</button>
              <button onClick={onDan} className={nutPhu}><ClipboardPaste className="w-4 h-4" /> Dán từ Excel</button>
              {tatCa.length > 0 && <button onClick={onXoaHet} className={`${nutPhu} text-rose-700`}><Trash2 className="w-4 h-4" /> Xóa toàn bộ</button>}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input value={tim} onChange={(e) => { setTim(e.target.value); setTrang(0); }} placeholder="Tìm trong biểu…" className={`${inp} pl-8 w-56`} />
          </div>
          {[['tat', `Tất cả (${tatCa.length})`], ['loi', 'Dòng có lỗi'], ['canh', 'Dòng có cảnh báo']].map(([k, t]) => (
            <button key={k} onClick={() => { setLoc(k); setTrang(0); }}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border ${loc === k ? 'bg-sky-700 text-white border-sky-700' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'}`}>{t}</button>
          ))}
          <span className="text-[11px] text-slate-400 ml-auto inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded border border-slate-300 bg-white" /> nhập/chọn</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" /> tự tính</span>
          </span>
        </div>
      </div>
      {datalists}
      <div className="overflow-x-auto">
        <table className="text-[12.5px] border-collapse min-w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 text-slate-600">
              <th className="sticky left-0 z-20 bg-slate-50 border-b border-r border-slate-200 px-2 py-2 w-12 text-center">#</th>
              {b.cot.map((c) => (
                <th key={c.k} title={goiYCot(b, c)}
                  className={`border-b border-r border-slate-200 px-2 py-2 text-left align-bottom font-semibold cursor-help ${c.kieu === 'tinh' ? 'bg-slate-100' : ''}`}
                  style={{ minWidth: c.dai ? 220 : c.tt ? 190 : c.kieu === 'so' || c.kieu === 'nam' ? 96 : 140 }}>
                  <span className="text-[10px] text-slate-400 font-mono mr-1">{c.k}</span>
                  {c.kieu === 'tinh' && <Sigma className="w-3 h-3 inline -mt-0.5 mr-0.5 text-slate-400" />}
                  <span className="leading-tight">{c.ten}</span>
                </th>
              ))}
              {!tuTinh && <th className="border-b border-slate-200 px-2 py-2 w-24 text-center">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {hien.length === 0 && (
              <tr><td colSpan={b.cot.length + 2} className="px-4 py-10 text-center text-slate-400">
                {tatCa.length === 0 ? (tuTinh ? 'Chưa có dữ liệu nguồn để tổng hợp.' : 'Biểu chưa có dòng nào. Bấm "Thêm dòng", "Dán từ Excel" hoặc dùng tab "Nhập từ tệp".') : 'Không có dòng nào khớp bộ lọc.'}
              </td></tr>
            )}
            {hien.map((d) => {
              const vd = vanDe.theoDong.get(d.row._id) || [];
              const coLoi = vd.some((x) => x.muc === 'loi');
              const coCanh = vd.some((x) => x.muc === 'canh');
              return (
                <tr key={d.row._id} id={`vt-${d.row._id}`}
                  className={`group ${nhay === d.row._id ? 'bg-yellow-100' : 'hover:bg-sky-50/40'}`}>
                  <td className={`sticky left-0 z-[5] bg-white border-b border-r border-slate-200 text-center text-[11px] text-slate-400 border-l-4 ${coLoi ? 'border-l-rose-500' : coCanh ? 'border-l-amber-400' : 'border-l-transparent'}`}>
                    {tuTinh ? d.i + 1 : <button onClick={() => onMoForm(d.row._id)} title="Mở biểu mẫu của dòng này" className="hover:text-sky-700 font-semibold">{d.i + 1}</button>}
                  </td>
                  {b.cot.map((c) => {
                    const v = giaTriO(b, d.row, d.t, c);
                    const o = vd.filter((x) => x.cot === c.k);
                    const loiO = o.find((x) => x.muc === 'loi');
                    const canhO = o.find((x) => x.muc === 'canh');
                    const tip = o.map((x) => `${MUC_TEN[x.muc]}: ${x.chu}`).join('\n');
                    if (c.kieu === 'tinh') {
                      return (
                        <td key={c.k} title={tip || undefined} className={`border-b border-r border-slate-200 bg-slate-50 px-2 py-1.5 ${laSo(v) ? 'text-right tabular-nums' : ''}`}>
                          {c.tt && !rong(v)
                            ? <span className={`inline-block text-[10.5px] font-bold px-1.5 py-0.5 rounded border leading-tight ${mauTrangThai(b.id, v)}`}>{v}</span>
                            : <span className="text-slate-600">{giaTriHienThi(v)}</span>}
                        </td>
                      );
                    }
                    return (
                      <td key={c.k} title={tip || undefined}
                        className={`border-b border-r border-slate-200 p-0 ${loiO ? 'bg-rose-50 ring-1 ring-inset ring-rose-300' : canhO ? 'bg-amber-50' : ''}`}>
                        {docOnly
                          ? <span className="block px-2 py-1.5 whitespace-pre-wrap">{giaTriHienThi(v)}</span>
                          : <ONhap col={c} v={v} onGhi={(nv) => onSua(d.row._id, c.k, nv)} dlId={c.ref || c.goiY ? `dl-${b.id}-${c.k}` : undefined} />}
                      </td>
                    );
                  })}
                  {!tuTinh && (
                    <td className="border-b border-slate-200 px-1 text-center whitespace-nowrap">
                      <button onClick={() => onMoForm(d.row._id)} title="Mở biểu mẫu (có hướng dẫn từng cột)" className="p-1.5 rounded hover:bg-sky-100 text-slate-500 hover:text-sky-700"><PanelRightOpen className="w-4 h-4" /></button>
                      {!docOnly && <button onClick={() => onNhanBan(d.row._id)} title="Nhân bản dòng" className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Copy className="w-4 h-4" /></button>}
                      {!docOnly && <button onClick={() => onXoa(d.row._id)} title="Xóa dòng" className="p-1.5 rounded hover:bg-rose-100 text-slate-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {soTrang > 1 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Dòng {tr * MOI_TRANG + 1}–{Math.min(loc2.length, (tr + 1) * MOI_TRANG)} / {loc2.length}</span>
          <div className="flex items-center gap-1">
            <button disabled={tr === 0} onClick={() => setTrang(tr - 1)} className={nutPhu}><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-2">Trang {tr + 1}/{soTrang}</span>
            <button disabled={tr >= soTrang - 1} onClick={() => setTrang(tr + 1)} className={nutPhu}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Biểu mẫu một dòng (ngăn trượt bên phải) ────────────────────────────────
function FormDong({ b, doc, kq, vanDe, id, docOnly, onSua, onDong, onDi, onXoa, onNhanBan }) {
  const ds = dongHienThi(doc, kq, b.id);
  const i = ds.findIndex((d) => d.row._id === id);
  if (i < 0) return null;
  const d = ds[i];
  const vd = vanDe.theoDong.get(id) || [];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={onDong}>
      <aside onClick={(e) => e.stopPropagation()} className="w-full max-w-[620px] h-full bg-white shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">{b.sheet}</p>
            <h3 className="font-extrabold text-slate-800">Dòng {i + 1}/{ds.length}{cotKhoa(b) && !rong(d.row[cotKhoa(b).k]) ? ` · ${d.row[cotKhoa(b).k]}` : ''}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button disabled={i === 0} onClick={() => onDi(ds[i - 1].row._id)} className={nutPhu} title="Dòng trước"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={i >= ds.length - 1} onClick={() => onDi(ds[i + 1].row._id)} className={nutPhu} title="Dòng sau"><ChevronRight className="w-4 h-4" /></button>
            <button onClick={onDong} className={nutPhu} title="Đóng"><X className="w-4 h-4" /></button>
          </div>
        </div>
        {vd.filter((x) => !x.cot).map((x, k) => <p key={k} className="mx-5 mt-3 text-xs text-slate-500">{x.chu}</p>)}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {b.cot.map((c) => {
            const v = giaTriO(b, d.row, d.t, c);
            const h = HD[b.id]?.cot?.[c.k];
            const o = vd.filter((x) => x.cot === c.k);
            return (
              <div key={c.k} className={`rounded-xl border p-3 ${c.kieu === 'tinh' ? 'bg-slate-50 border-slate-200' : o.some((x) => x.muc === 'loi') ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-[13px] font-bold text-slate-700"><span className="font-mono text-slate-400 mr-1.5">{c.k}</span>{c.ten}</label>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">
                    {c.kieu === 'tinh' ? 'Tự động' : c.kieu === 'ds' ? 'Chọn' : c.ref ? `Mã ở ${BIEU_THEO_ID[c.ref].ma}` : c.kieu === 'so' ? 'Số' : c.kieu === 'nam' ? 'Năm' : c.kieu === 'ngay' ? 'Ngày' : 'Nhập'}
                  </span>
                </div>
                {c.kieu === 'tinh'
                  ? <p className={`text-[13px] ${c.tt ? '' : 'text-slate-700'}`}>{c.tt && !rong(v) ? <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${mauTrangThai(b.id, v)}`}>{v}</span> : (giaTriHienThi(v) || <span className="text-slate-400">—</span>)}</p>
                  : docOnly ? <p className="text-[13px] text-slate-700 whitespace-pre-wrap">{giaTriHienThi(v) || <span className="text-slate-400">—</span>}</p>
                    : c.dai && c.kieu === 'chu'
                      ? <textarea defaultValue={v} key={`${id}-${String(v)}`} rows={3} onBlur={(e) => { const { v: m } = chuyenGiaTri(c, e.target.value); if (m !== v) onSua(id, c.k, m); }} className={inp} />
                      : <div className="border border-slate-200 rounded-lg"><ONhap col={c} v={v} onGhi={(m) => onSua(id, c.k, m)} dlId={c.ref || c.goiY ? `dl-${b.id}-${c.k}` : undefined} lop="py-2" /></div>}
                {o.map((x, k) => (
                  <p key={k} className={`mt-1.5 text-[12px] flex gap-1.5 ${x.muc === 'loi' ? 'text-rose-700' : x.muc === 'canh' ? 'text-amber-700' : 'text-sky-700'}`}>
                    {x.muc === 'loi' ? <CircleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}{x.chu}
                  </p>
                ))}
                {h && (h.noiDung || h.cachGhi || h.luuY) && (
                  <div className="mt-2 text-[11.5px] text-slate-500 space-y-0.5 leading-relaxed">
                    {h.noiDung && <p><b className="text-slate-600">Điền:</b> {h.noiDung}</p>}
                    {h.cachGhi && <p><b className="text-slate-600">Cách ghi:</b> {h.cachGhi}</p>}
                    {h.luuY && <p><b className="text-slate-600">Lưu ý:</b> {h.luuY}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!docOnly && (
          <div className="px-5 py-3 border-t border-slate-200 flex justify-between gap-2">
            <button onClick={() => onNhanBan(id)} className={nutPhu}><Copy className="w-4 h-4" /> Nhân bản dòng</button>
            <button onClick={() => onXoa(id)} className={`${nutPhu} text-rose-700`}><Trash2 className="w-4 h-4" /> Xóa dòng</button>
          </div>
        )}
      </aside>
    </div>
  );
}

// ─── Hộp "Dán từ Excel" ─────────────────────────────────────────────────────
function HopDan({ b, onDong, onXong }) {
  const [chu, setChu] = useState('');
  const [viTri, setViTri] = useState('cot');
  const nhap = cotNhap(b);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800">Dán từ Excel vào {b.ma} — {b.ten}</h3>
            <p className="text-[12.5px] text-slate-500 mt-1">Chọn vùng ô trong Excel → Ctrl+C → dán vào ô dưới (Ctrl+V). Có thể dán kèm dòng tiêu đề: phần mềm tự ghép cột theo tên. Dữ liệu sẽ được KIỂM TRA và xem trước rồi mới ghi.</p>
          </div>
          <button onClick={onDong} className={nutPhu}><X className="w-4 h-4" /></button>
        </div>
        <textarea autoFocus value={chu} onChange={(e) => setChu(e.target.value)} rows={10} placeholder="Dán dữ liệu vào đây…" className={`${inp} mt-3 font-mono text-[12px]`} />
        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[12.5px]">
          <label className={`border rounded-xl p-3 cursor-pointer ${viTri === 'cot' ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}>
            <input type="radio" className="mr-2" checked={viTri === 'cot'} onChange={() => setViTri('cot')} />
            <b>Đủ các cột như bộ biểu</b> (A, B, C… kể cả cột tự tính) — khi chép nguyên dòng từ tệp Excel của Ban.
          </label>
          <label className={`border rounded-xl p-3 cursor-pointer ${viTri === 'nhap' ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}>
            <input type="radio" className="mr-2" checked={viTri === 'nhap'} onChange={() => setViTri('nhap')} />
            <b>Chỉ các cột nhập</b>, theo thứ tự: {nhap.map((c) => c.k).join(', ')}.
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onDong} className={nutPhu}>Hủy</button>
          <button disabled={!chu.trim()} onClick={() => onXong(chu, viTri)} className={nutChinh}>Kiểm tra & xem trước <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

// ─── Khối "Tự động sửa lỗi" trong màn kết quả kiểm tra tệp ──────────────────
function KhoiSuaTuDong({ deXuat, daSua, conLoi, onSua, onHoanTac, onTai }) {
  const [mo, setMo] = useState(false);
  const [bo, setBo] = useState(() => new Set());
  if (!deXuat.length && !daSua.length) return null;
  const chon = deXuat.filter((x) => !bo.has(x.id));
  const doiChon = (id) => setBo((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-start gap-3 flex-wrap">
        <Wand2 className="w-5 h-5 text-violet-700 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-[240px] text-[13px] text-violet-950">
          <p className="font-bold">Tự động sửa lỗi</p>
          {daSua.length > 0 && <p>Đã tự sửa <b>{daSua.length}</b> chỗ. {conLoi ? <>Còn <b className="text-rose-700">{conLoi}</b> lỗi cần người kiểm tra (phần mềm không đoán dữ liệu).</> : <b className="text-emerald-700">Không còn lỗi nào.</b>}</p>}
          {deXuat.length > 0 && <p>Phát hiện <b>{deXuat.length}</b> chỗ sửa được chắc chắn: gõ thiếu dấu hoặc sai chính tả giá trị chọn, số kèm đơn vị, năm/ngày viết kiểu khác, mã lệch dấu cách, ô lỗi #N/A, dòng lặp y hệt.</p>}
          <p className="text-[11.5px] text-violet-800/80 mt-0.5">Không tự sửa: thiếu mã, số âm, trùng mã khác nội dung, giá trị lạ, cảnh báo nghiệp vụ (thiếu nguồn, chưa kiểm chứng…) — những chỗ đó cần căn cứ thật.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {deXuat.length > 0 && <button onClick={() => setMo(!mo)} className={nutPhu}>{mo ? 'Ẩn danh sách' : `Xem ${deXuat.length} chỗ sẽ sửa`}</button>}
          {deXuat.length > 0 && <button disabled={!chon.length} onClick={() => { onSua(new Set(chon.map((x) => x.id))); setMo(false); setBo(new Set()); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold disabled:opacity-50"><Wand2 className="w-4 h-4" /> Sửa tự động ({chon.length})</button>}
          {daSua.length > 0 && <button onClick={onTai} className={nutPhu}><Download className="w-4 h-4" /> Tải tệp đã sửa (.xlsx)</button>}
          {daSua.length > 0 && <button onClick={onHoanTac} className={nutPhu}><Undo2 className="w-4 h-4" /> Hoàn tác</button>}
        </div>
      </div>
      {mo && (
        <div className="bg-white rounded-xl border border-violet-200 overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-violet-50 text-violet-900 text-left sticky top-0">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" checked={bo.size === 0} onChange={(e) => setBo(e.target.checked ? new Set() : new Set(deXuat.map((x) => x.id)))} /></th>
                {['Trang', 'Ô', 'Cột', 'Giá trị cũ', 'Giá trị mới', 'Lý do'].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {deXuat.map((x) => (
                <tr key={x.id} className={`border-t border-violet-100 align-top ${bo.has(x.id) ? 'opacity-50' : ''}`}>
                  <td className="px-3 py-2"><input type="checkbox" checked={!bo.has(x.id)} onChange={() => doiChon(x.id)} /></td>
                  <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap">{x.trang}</td>
                  <td className="px-3 py-2 font-mono">{x.loai === 'xoaDong' ? `dòng ${x.dongTep}` : `${x.cot}${x.dongTep}`}</td>
                  <td className="px-3 py-2">{x.tenCot}</td>
                  <td className="px-3 py-2 text-rose-700 line-through decoration-rose-300">{String(x.cu ?? '')}</td>
                  <td className="px-3 py-2 text-emerald-700 font-semibold">{x.loai === 'xoaDong' ? '(xóa dòng lặp)' : x.moi === '' ? '(để trống)' : giaTriHienThi(x.moi)}</td>
                  <td className="px-3 py-2 text-slate-600 min-w-[220px]">{x.lyDo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab "Nhập từ tệp" ──────────────────────────────────────────────────────
function NhapTep({ trangThai, setTrangThai, doc, coQuyenGhi, onApDung, onTaiMau }) {
  const inpRef = useRef(null);
  const [keo, setKeo] = useState(false);
  const [locMuc, setLocMuc] = useState('loi');
  const [locBieu, setLocBieu] = useState('');
  const [trang, setTrang] = useState(0);
  const { ten, dangDoc, phan, loi, phanTich, khongDoc, cheDo = 'thay', boQuaLoi = true } = trangThai;

  const ketQua = useMemo(() => (phanTich ? chuanBiNhap(phanTich, doc, { cheDo, boQuaLoi }) : null), [phanTich, doc, cheDo, boQuaLoi]);
  const deXuat = useMemo(() => (phanTich ? deXuatSua(phanTich, doc, { cheDo }) : []), [phanTich, doc, cheDo]);
  const daSua = phanTich?.daSua || [];
  const suaTuDong = (chon) => setTrangThai((s) => ({ ...s, phanTich: apDungSua(s.phanTich, deXuat, chon), phanTichGoc: s.phanTichGoc || s.phanTich }));
  const hoanTac = () => setTrangThai((s) => ({ ...s, phanTich: s.phanTichGoc || s.phanTich, phanTichGoc: null }));
  const taiTepDaSua = () => import('./lib/vtvlXuat').then((m) => m.xuatTepDaSua(phanTich, ten));

  const chon = async (file) => {
    if (!file) return;
    setTrangThai({ ten: file.name, dangDoc: true, phan: 0, cheDo, boQuaLoi });
    try {
      const r = await docTep(file, { onTienDo: ({ phan: p }) => setTrangThai((s) => ({ ...s, phan: p })) });
      const pt = phanTichTep(r.nguon, r.loai === 'csv' ? { chiBieu: trangThai.chiBieu || null } : {});
      if (r.loai === 'csv' && !trangThai.chiBieu && !Object.keys(pt.bieu).length) {
        throw new Error('Không nhận ra tệp CSV thuộc biểu nào. Chọn "Biểu đích của tệp CSV" ở dưới rồi chọn lại tệp.');
      }
      setTrangThai((s) => ({ ...s, dangDoc: false, phanTich: pt, khongDoc: r.khongDoc, loai: r.loai }));
      setTrang(0); setLocBieu('');
    } catch (e) {
      setTrangThai((s) => ({ ...s, dangDoc: false, loi: e.message || String(e) }));
    }
  };

  const dsVD = (ketQua?.vanDe || []).filter((v) => (locMuc === 'tat' || v.muc === locMuc) && (!locBieu || v.bieu === locBieu));
  const soTrang = Math.max(1, Math.ceil(dsVD.length / 100));
  const tr = Math.min(trang, soTrang - 1);
  const demMuc = (m) => (ketQua?.vanDe || []).filter((v) => v.muc === m).length;

  if (!phanTich && !dangDoc) {
    return (
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div onDragOver={(e) => { e.preventDefault(); setKeo(true); }} onDragLeave={() => setKeo(false)}
            onDrop={(e) => { e.preventDefault(); setKeo(false); chon(e.dataTransfer.files?.[0]); }}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${keo ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-white'}`}>
            <FileSpreadsheet className="w-12 h-12 mx-auto text-sky-600" />
            <p className="mt-3 font-bold text-slate-800">Kéo thả tệp vào đây hoặc</p>
            <button onClick={() => inpRef.current?.click()} className={`${nutChinh} mt-3`}><Upload className="w-4 h-4" /> Chọn tệp</button>
            <input ref={inpRef} type="file" accept=".xlsx,.xlsm,.csv,.tsv,.txt,.json" className="hidden" onChange={(e) => { chon(e.target.files?.[0]); e.target.value = ''; }} />
            <p className="mt-3 text-[12.5px] text-slate-500">Nhận <b>.xlsx</b> (chính tệp bộ biểu của Ban, kể cả bản 30.000 dòng; hoặc biểu mẫu tải từ phân hệ) · <b>.csv</b> (một biểu) · <b>.json</b> (bản sao lưu).</p>
            {loi && <p className="mt-3 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 inline-block">{loi}</p>}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-700 mb-2">Cách ghi dữ liệu của tệp</p>
            <div className="grid sm:grid-cols-3 gap-2">
              {CHE_DO.map((m) => (
                <label key={m.id} className={`border rounded-xl p-3 cursor-pointer text-[12.5px] ${cheDo === m.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}>
                  <input type="radio" className="mr-1.5" checked={cheDo === m.id} onChange={() => setTrangThai((s) => ({ ...s, cheDo: m.id }))} />
                  <b>{m.ten}</b><span className="block text-slate-500 mt-1">{m.mo}</span>
                </label>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-[12.5px] text-slate-600">
              <span className="font-semibold">Biểu đích của tệp CSV:</span>
              <select value={trangThai.chiBieu || ''} onChange={(e) => setTrangThai((s) => ({ ...s, chiBieu: e.target.value }))} className="border border-slate-200 rounded-lg px-2 py-1.5 text-[12.5px]">
                <option value="">Tự nhận theo dòng tiêu đề</option>
                {BIEU.filter((x) => !x.tuTinh).map((x) => <option key={x.id} value={x.id}>{x.ma} — {x.ten}</option>)}
              </select>
              <span className="text-slate-400">(tệp .xlsx tự nhận theo tên trang)</span>
            </label>
            <label className="mt-3 flex items-start gap-2 text-[12.5px] text-slate-600">
              <input type="checkbox" className="mt-0.5" checked={boQuaLoi} onChange={(e) => setTrangThai((s) => ({ ...s, boQuaLoi: e.target.checked }))} />
              <span><b>Bỏ qua dòng có lỗi chặn</b> (sai kiểu số, sai danh sách chọn, thiếu mã, trùng mã). Dòng chỉ thiếu mã liên kết vẫn được nhập để bổ sung sau. Có thể đổi lựa chọn này ngay ở bước xem trước.</span>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-[12.5px] text-sky-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Phần mềm kiểm tra gì khi nhập?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nhận biểu theo <b>tên trang</b> (vd "3. B1_KhoiLuong") hoặc theo dòng tiêu đề; ghép cột theo <b>tên cột</b>.</li>
              <li><b>Kiểu dữ liệu</b>: số, năm 2027–2031, ngày; đọc được cả "1.904" và "1,5" kiểu Việt Nam.</li>
              <li><b>Danh sách chọn</b> của DM_THAM_SO (tự sửa hoa/thường, khoảng trắng).</li>
              <li><b>Mã liên kết</b> giữa các biểu (A2→A1, C1 · B1→A2, DM · C3, D1, D2→C1…) và <b>trùng mã</b>.</li>
              <li>Toàn bộ <b>cột cảnh báo</b> của bộ biểu (B1!R, B2_CT!P, C1!K, C3!M, D1!J, D2!J…) tính lại đúng công thức.</li>
              <li>Ô chứa lỗi Excel (#N/A, #VALUE!…), mã ví dụ VD-.</li>
            </ul>
            <p>Cột tự tính trong tệp được bỏ qua — phần mềm tự tính lại.</p>
            <p className="font-bold flex items-center gap-1.5 pt-1"><Wand2 className="w-4 h-4" /> Tự động sửa lỗi</p>
            <p>Lỗi sửa được chắc chắn (thiếu dấu, sai chính tả giá trị chọn, số kèm đơn vị, ngày viết khác, mã lệch dấu cách, #N/A, dòng lặp) được sửa bằng một nút bấm, xem trước từng ô; tải về được <b>tệp đã sửa</b> — kể cả khi chưa đăng nhập.</p>
          </div>
          <button onClick={onTaiMau} className={`${nutPhu} w-full py-3`}><FileDown className="w-4 h-4" /> Tải biểu mẫu nhập liệu (Excel, có hướng dẫn từng cột)</button>
          {!coQuyenGhi && <p className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Bạn đang xem với tư cách khách: vẫn kiểm tra tệp, tự động sửa lỗi, tải tệp đã sửa và xuất báo cáo lỗi được, nhưng muốn <b>áp dụng</b> vào dữ liệu thì phải đăng nhập.</p>}
        </div>
      </div>
    );
  }

  if (dangDoc) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <RefreshCw className="w-8 h-8 mx-auto text-sky-600 animate-spin" />
        <p className="mt-3 font-bold text-slate-700">Đang đọc {ten}…</p>
        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden max-w-md mx-auto"><div className="h-full bg-sky-600 transition-all" style={{ width: `${Math.round((phan || 0) * 100)}%` }} /></div>
        <p className="mt-2 text-xs text-slate-400">{Math.round((phan || 0) * 100)}% — tệp bộ biểu 30.000 dòng mất vài giây.</p>
      </div>
    );
  }

  const nhanDien = Object.keys(phanTich.bieu).length;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Kết quả kiểm tra tệp</p>
          <h3 className="text-lg font-extrabold text-slate-800 break-all">{ten}</h3>
          <p className="text-[12.5px] text-slate-500">Nhận ra {nhanDien} biểu có dữ liệu{phanTich.trong?.length ? ` · ${phanTich.trong.length} trang trống (giữ nguyên dữ liệu đang có)` : ''}{phanTich.boQua?.length ? ` · ${phanTich.boQua.length} trang không phải biểu nhập` : ''}.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTrangThai({ cheDo, boQuaLoi, chiBieu: trangThai.chiBieu })} className={nutPhu}><Upload className="w-4 h-4" /> Chọn tệp khác</button>
          {daSua.length > 0 && <button onClick={taiTepDaSua} className={nutPhu}><Download className="w-4 h-4" /> Tải tệp đã sửa</button>}
          {ketQua?.vanDe.length > 0 && <button onClick={() => import('./lib/vtvlXuat').then((m) => m.xuatBaoCaoLoi(ketQua.vanDe, ten))} className={nutPhu}><Download className="w-4 h-4" /> Xuất báo cáo lỗi (Excel)</button>}
          <button disabled={!coQuyenGhi || !ketQua?.coTheApDung} onClick={() => onApDung(ketQua, ten, cheDo, daSua.length)} className={nutChinh} title={coQuyenGhi ? '' : 'Đăng nhập để áp dụng'}>
            <Save className="w-4 h-4" /> Áp dụng {ketQua?.tongNhap || 0} dòng
          </button>
        </div>
      </div>

      {nhanDien === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[13px] text-amber-900">
          Tệp không có dòng dữ liệu nào ở các biểu nhập liệu. {phanTich.trong?.length ? 'Các trang của bộ biểu đều còn trống.' : 'Kiểm tra lại tên trang (vd "1. A1_NhiemVu") và dòng tiêu đề cột.'}
        </div>
      )}
      {ketQua && nhanDien > 0 && (
        <KhoiSuaTuDong deXuat={deXuat} daSua={daSua} conLoi={ketQua.vanDe.filter((v) => v.muc === 'loi').length}
          onSua={suaTuDong} onHoanTac={hoanTac} onTai={taiTepDaSua} />
      )}
      {ketQua?.canhQuyGio && <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[12.5px] text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{ketQua.canhQuyGio}</div>}

      {ketQua && nhanDien > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-4 text-[12.5px]">
            <span className="font-bold text-slate-700">Cách ghi:</span>
            {CHE_DO.map((m) => (
              <label key={m.id} className="inline-flex items-center gap-1.5 cursor-pointer" title={m.mo}>
                <input type="radio" checked={cheDo === m.id} onChange={() => setTrangThai((s) => ({ ...s, cheDo: m.id }))} />{m.ten}
              </label>
            ))}
            <label className="inline-flex items-center gap-1.5 cursor-pointer ml-auto">
              <input type="checkbox" checked={boQuaLoi} onChange={(e) => setTrangThai((s) => ({ ...s, boQuaLoi: e.target.checked }))} />Bỏ qua dòng có lỗi chặn
            </label>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>{['Trang trong tệp', 'Biểu', 'Dòng đọc', 'Thêm', 'Cập nhật', 'Bỏ qua (lỗi)', 'Đã có (bỏ qua)', 'Lỗi', 'Cảnh báo', 'Ghi chú'].map((h) => <th key={h} className="px-3 py-2 font-semibold border-b border-slate-200">{h}</th>)}</tr>
              </thead>
              <tbody>
                {ketQua.tomTat.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-2 font-mono text-[11.5px]">{t.trang}</td>
                    <td className="px-3 py-2 font-semibold">{t.ma} — {t.ten}</td>
                    <td className="px-3 py-2 text-right">{t.doc}</td>
                    <td className="px-3 py-2 text-right text-emerald-700 font-semibold">{t.them}</td>
                    <td className="px-3 py-2 text-right text-sky-700">{t.capNhat}</td>
                    <td className="px-3 py-2 text-right text-rose-700">{t.boQua || ''}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{t.daCo || ''}</td>
                    <td className="px-3 py-2 text-right"><button onClick={() => { setLocBieu(t.id); setLocMuc('loi'); setTrang(0); }} className="text-rose-700 font-bold hover:underline">{t.loi || ''}</button></td>
                    <td className="px-3 py-2 text-right"><button onClick={() => { setLocBieu(t.id); setLocMuc('canh'); setTrang(0); }} className="text-amber-700 font-bold hover:underline">{t.canh || ''}</button></td>
                    <td className="px-3 py-2 text-[11.5px] text-slate-500">{t.ghiChu.join(' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(phanTich.boQua?.length > 0 || khongDoc?.length > 0) && (
              <details className="px-4 py-3 text-[12px] text-slate-500 border-t border-slate-100">
                <summary className="cursor-pointer font-semibold">Các trang không nhập ({(phanTich.boQua?.length || 0) + (khongDoc?.length || 0)})</summary>
                <ul className="mt-2 list-disc pl-5 space-y-0.5">
                  {phanTich.boQua.map((x) => <li key={x.trang}><b>{x.trang}</b>: {x.lyDo}</li>)}
                  {(khongDoc || []).map((x) => <li key={x}><b>{x}</b>: {bieuTheoTenTrang(x)?.boQua || 'không phải biểu nhập liệu'}</li>)}
                </ul>
              </details>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-4 flex items-center gap-2 flex-wrap border-b border-slate-100">
              <p className="font-bold text-slate-700 mr-2">Chi tiết theo ô</p>
              {[['loi', `Lỗi (${demMuc('loi')})`, 'rose'], ['canh', `Cảnh báo (${demMuc('canh')})`, 'amber'], ['tt', `Thông tin (${demMuc('tt')})`, 'sky'], ['tat', 'Tất cả', 'slate']].map(([k, t]) => (
                <button key={k} onClick={() => { setLocMuc(k); setTrang(0); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${locMuc === k ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>{t}</button>
              ))}
              <select value={locBieu} onChange={(e) => { setLocBieu(e.target.value); setTrang(0); }} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 ml-auto">
                <option value="">Mọi biểu</option>
                {ketQua.tomTat.map((t) => <option key={t.id} value={t.id}>{t.ma} — {t.ten}</option>)}
              </select>
            </div>
            {dsVD.length === 0
              ? <p className="px-4 py-8 text-center text-sm text-emerald-700 flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Không có mục nào ở mức này.</p>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                      <tr>{['Trang', 'Dòng', 'Ô', 'Cột', 'Giá trị', 'Mức', 'Nội dung', 'Cách xử lý'].map((h) => <th key={h} className="px-3 py-2 font-semibold border-b border-slate-200">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {dsVD.slice(tr * 100, tr * 100 + 100).map((v, i) => (
                        <tr key={i} className={`border-b border-slate-100 align-top ${v.boQua ? 'opacity-70' : ''}`}>
                          <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap">{v.trang}</td>
                          <td className="px-3 py-2 text-right">{v.dongTep ?? <span className="text-slate-400" title="Dữ liệu đang có trên hệ thống">có sẵn #{v.dongHienCo}</span>}</td>
                          <td className="px-3 py-2 font-mono">{v.cot && v.dongTep ? `${v.cot}${v.dongTep}` : v.cot}</td>
                          <td className="px-3 py-2">{v.tenCot}</td>
                          <td className="px-3 py-2 max-w-[160px] truncate" title={String(v.giaTri ?? '')}>{giaTriHienThi(v.giaTri)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${v.muc === 'loi' ? 'bg-rose-50 text-rose-700 border-rose-200' : v.muc === 'canh' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                              {v.muc === 'loi' ? (v.chan ? 'Lỗi chặn' : 'Lỗi liên kết') : MUC_TEN[v.muc]}
                            </span>
                            {v.boQua && <span className="block text-[10px] text-rose-600 mt-0.5">đã bỏ qua dòng</span>}
                          </td>
                          <td className="px-3 py-2 min-w-[260px]">{v.chu}</td>
                          <td className="px-3 py-2 min-w-[260px] text-[11.5px] text-slate-500">{v.cachXuLy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            {soTrang > 1 && (
              <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
                <button disabled={tr === 0} onClick={() => setTrang(tr - 1)} className={nutPhu}><ChevronLeft className="w-4 h-4" /></button>
                <span className="px-2">Trang {tr + 1}/{soTrang} · {dsVD.length} mục</span>
                <button disabled={tr >= soTrang - 1} onClick={() => setTrang(tr + 1)} className={nutPhu}><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tab Tổng quan ──────────────────────────────────────────────────────────
function TongQuan({ doc, kq, vanDe, docOnly, onSuaChung, onMoBieu, onTab, onXuat, onTaiMau, onSaoLuu }) {
  const t = kq.tienDo;
  const th = kq.tongHop;
  const the = [
    { nhan: 'Nhiệm vụ (A1)', so: t.soNV, phu: `${soDong(doc, 'A2')} công việc ở A2` },
    { nhan: 'Vị trí việc làm (C1)', so: t.soVT, phu: `${t.soVTDu} VTVL đủ căn cứ${t.tyLe === null ? '' : ` · ${Math.round(t.tyLe * 100)}%`}` },
    { nhan: 'Giờ ròng cần thiết', so: fmtSo(Math.round((th.gioB1 + th.gioTacDong) * 10) / 10), phu: `B1 ${fmtSo(Math.round(th.gioB1))} giờ · tác động B2 ${fmtSo(Math.round(th.gioTacDong))} giờ` },
    { nhan: 'Người quy đổi PP2', so: fmtSo(Math.round(th.nguoiQuyDoi * 100) / 100), phu: `tham khảo, không phải biên chế · quỹ giờ ${fmtSo(th.quyGio)}` },
  ];
  const tong = (m) => Object.values(vanDe.demBieu).reduce((s, d) => s + (d[m] || 0), 0);
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {the.map((x) => (
          <div key={x.nhan} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{x.nhan}</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 tabular-nums">{x.so}</p>
            <p className="text-[12px] text-slate-500 mt-1">{x.phu}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-extrabold text-slate-800">Trình tự 8 bước kê khai</h3>
            <span className="text-[12px] text-slate-500">{tong('loi')} lỗi · {tong('canh')} cảnh báo</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {TAM_BUOC.map((s) => {
              const ids = s.bieu === 'C1' ? ['C1', 'C2'] : s.bieu === 'D1' ? ['D1', 'DU', 'D2'] : s.bieu === 'K' ? [] : [s.bieu];
              return (
                <button key={s.buoc} onClick={() => (ids.length ? onMoBieu(ids[0]) : onTab('kiemtra'))}
                  className="text-left border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 rounded-xl p-3 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-sky-700 text-white text-xs font-bold flex items-center justify-center">{s.buoc}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-slate-700">{ids.length ? ids.map((id) => BIEU_THEO_ID[id].ma).join(' · ') : 'K · T · S — kiểm tra'}</p>
                      <p className="text-[12px] text-slate-500 leading-snug">{s.lam}</p>
                      <div className="mt-1.5 flex gap-1.5 flex-wrap">
                        {ids.map((id) => {
                          const d = vanDe.demBieu[id] || {};
                          return (
                            <span key={id} className="text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {BIEU_THEO_ID[id].ma}: {soDong(doc, id)} dòng{d.loi ? <b className="text-rose-600"> · {d.loi} lỗi</b> : ''}{d.canh ? <span className="text-amber-700"> · {d.canh} c.báo</span> : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-extrabold text-slate-800">Thông tin chung (biểu T)</h3>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Cơ quan, đơn vị kê khai</label>
              <input disabled={docOnly} defaultValue={doc.donVi} key={`dv-${doc.donVi}`} onBlur={(e) => onSuaChung('donVi', e.target.value.trim())} className={inp} placeholder="Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Kỳ số liệu</label>
              <input disabled={docOnly} defaultValue={doc.ky} key={`ky-${doc.ky}`} onBlur={(e) => onSuaChung('ky', e.target.value.trim())} className={inp} placeholder="vd: Năm 2026" />
            </div>
            <p className="text-[12px] text-slate-500">Tiến độ: <b className="text-slate-700">{t.trangThai}</b>. Quỹ giờ PP2 chế độ phổ biến <b>{fmtSo(th.quyGio)}</b> giờ/người/năm (do cơ quan chủ trì quy định).</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h3 className="font-extrabold text-slate-800 mb-1">Tệp</h3>
            <button onClick={() => onTab('tep')} className={`${nutChinh} w-full`}><Upload className="w-4 h-4" /> Nhập từ tệp Excel</button>
            <button onClick={onTaiMau} className={`${nutPhu} w-full`}><FileDown className="w-4 h-4" /> Tải biểu mẫu nhập liệu</button>
            <button onClick={onXuat} className={`${nutPhu} w-full`}><Download className="w-4 h-4" /> Xuất toàn bộ dữ liệu (Excel)</button>
            <button onClick={onSaoLuu} className={`${nutPhu} w-full`}><Save className="w-4 h-4" /> Sao lưu (JSON)</button>
          </div>
        </div>
      </div>

      <KiemTraNhanh kq={kq} onTab={onTab} />
    </div>
  );
}

function KiemTraNhanh({ kq, onTab }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-extrabold text-slate-800">Kiểm tra nhanh (biểu K)</h3>
        {onTab && <button onClick={() => onTab('kiemtra')} className="text-xs font-semibold text-sky-700 hover:underline">Xem chi tiết từng ô →</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-slate-600 text-left"><tr>{['Chỉ tiêu kiểm tra', 'Kết quả', 'Yêu cầu xử lý', 'Lưu ý'].map((h) => <th key={h} className="px-4 py-2 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {kq.kiemTra.map((x, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">{x.chiTieu}</td>
                <td className="px-4 py-2"><span className={`font-bold px-2 py-0.5 rounded ${x.kq ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>{x.kq}</span></td>
                <td className="px-4 py-2 text-slate-500">{x.xuLy}</td>
                <td className="px-4 py-2 text-slate-500">{x.luuY}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-[11.5px] text-slate-400 border-t border-slate-100">Số 0 khi chưa nhập dữ liệu không có nghĩa là đạt. Kiểm tra tự động không thay thế thẩm định; người đứng đầu xác nhận kết quả.</p>
    </div>
  );
}

// ─── Tab Kiểm tra lỗi ───────────────────────────────────────────────────────
function KiemTraTab({ doc, kq, vanDe, onDiToi }) {
  const [muc, setMuc] = useState('loi');
  const [bieu, setBieu] = useState('');
  const [trang, setTrang] = useState(0);
  const ds = vanDe.ds.filter((v) => (muc === 'tat' ? v.muc !== 'tt' : v.muc === muc) && (!bieu || v.bieu === bieu));
  const soTrang = Math.max(1, Math.ceil(ds.length / 100));
  const tr = Math.min(trang, soTrang - 1);
  const dem = (m) => vanDe.ds.filter((v) => v.muc === m).length;
  return (
    <div className="space-y-5">
      <KiemTraNhanh kq={kq} />
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 flex items-center gap-2 flex-wrap border-b border-slate-100">
          <p className="font-bold text-slate-700 mr-2">Lỗi và cảnh báo theo từng ô</p>
          {[['loi', `Lỗi (${dem('loi')})`], ['canh', `Cảnh báo (${dem('canh')})`], ['tat', 'Cả hai']].map(([k, t]) => (
            <button key={k} onClick={() => { setMuc(k); setTrang(0); }} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${muc === k ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>{t}</button>
          ))}
          <select value={bieu} onChange={(e) => { setBieu(e.target.value); setTrang(0); }} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5">
            <option value="">Mọi biểu</option>
            {BIEU.filter((b) => !b.tuTinh).map((b) => <option key={b.id} value={b.id}>{b.ma} — {b.ten}</option>)}
          </select>
          {ds.length > 0 && <button onClick={() => import('./lib/vtvlXuat').then((m) => m.xuatVanDe(ds, doc))} className={`${nutPhu} ml-auto`}><Download className="w-4 h-4" /> Xuất Excel</button>}
        </div>
        {ds.length === 0
          ? <p className="px-4 py-10 text-center text-sm text-emerald-700 flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Không có mục nào.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead className="bg-slate-50 text-slate-600 text-left"><tr>{['Biểu', 'Dòng', 'Mã của dòng', 'Cột', 'Mức', 'Nội dung', ''].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {ds.slice(tr * 100, tr * 100 + 100).map((v, i) => {
                    const b = BIEU_THEO_ID[v.bieu];
                    const r = (doc.bieu[v.bieu] || []).find((x) => x._id === v.id) || {};
                    const k = cotKhoa(b);
                    return (
                      <tr key={i} className="border-t border-slate-100 align-top">
                        <td className="px-3 py-2 font-semibold whitespace-nowrap">{b.ma}</td>
                        <td className="px-3 py-2 text-right">{v.dong}</td>
                        <td className="px-3 py-2 font-mono text-[11.5px]">{k ? r[k.k] : ''}</td>
                        <td className="px-3 py-2">{v.cot ? `${v.cot} · ${b.cot.find((c) => c.k === v.cot)?.ten}` : ''}</td>
                        <td className="px-3 py-2"><span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${v.muc === 'loi' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>{MUC_TEN[v.muc]}</span></td>
                        <td className="px-3 py-2 min-w-[280px]">{v.chu}</td>
                        <td className="px-3 py-2"><button onClick={() => onDiToi(v.bieu, v.id)} className="text-xs font-semibold text-sky-700 hover:underline whitespace-nowrap">Đến ô →</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        {soTrang > 1 && (
          <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            <button disabled={tr === 0} onClick={() => setTrang(tr - 1)} className={nutPhu}><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-2">Trang {tr + 1}/{soTrang}</span>
            <button disabled={tr >= soTrang - 1} onClick={() => setTrang(tr + 1)} className={nutPhu}><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab Hướng dẫn ──────────────────────────────────────────────────────────
function HuongDanTab() {
  const vd = useMemo(() => { const d = viDuKiemThu(); return { d, kq: tinhToan(d) }; }, []);
  const b1 = vd.kq.tinh.B1[0], b2 = vd.kq.B2[0], c3 = vd.kq.tinh.C3[0];
  const Khoi = ({ tieuDe, children }) => <section className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-slate-800 mb-3">{tieuDe}</h3>{children}</section>;
  return (
    <div className="space-y-5 text-[13px] text-slate-700">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[12.5px] text-amber-900">
        Phân hệ dựng theo <b>bản sửa đề nghị v2 của nhóm tư vấn UEB (23/10/2026)</b> trên nền tệp "03. Bo bieu VTVL 19-10-2026" của Ban — <b>chưa phải bản Ban ban hành</b>. Khi có bản chính thức cần rà lại danh sách chọn, công thức và hướng dẫn từng cột.
      </div>
      <Khoi tieuDe="Trình tự 8 bước (trang THAO_TAC_NHANH)">
        <div className="overflow-x-auto"><table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-left text-slate-600"><tr>{['Bước', 'Biểu', 'Cơ sở cần làm', 'Không làm / điều kiện được tính'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>{TAM_BUOC.map((s) => <tr key={s.buoc} className="border-t border-slate-100 align-top"><td className="px-3 py-2 font-bold">{s.buoc}</td><td className="px-3 py-2">{BIEU_THEO_ID[s.bieu]?.ma || 'K, T, S'}</td><td className="px-3 py-2">{s.lam}</td><td className="px-3 py-2 text-slate-500">{s.khong}</td></tr>)}</tbody>
        </table></div>
      </Khoi>
      <div className="grid lg:grid-cols-2 gap-5">
        <Khoi tieuDe="Quy ước và nguyên tắc">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><b>Ô trắng</b> = nhập hoặc chọn; <b>ô xám</b> (biểu tượng Σ) = công thức tự tính, không nhập tay. Rê chuột lên tên cột để xem hướng dẫn của HD_DIEN_BIEU; bấm số thứ tự dòng để mở biểu mẫu đầy đủ.</li>
            <li><b>Quỹ giờ PP2</b> chế độ phổ biến: (261 − 11 − 12) × 8 = <b>{fmtSo(QUY_GIO_PP2)}</b> giờ/người/năm. Chế độ đặc thù dùng giờ riêng có căn cứ và đã kiểm chứng ở C1 (cột F, H, I). Không cộng 10–15% cố định, không trừ tiếp phép/lễ ở mẫu số.</li>
            <li><b>Người quy đổi PP2</b> giữ số thập phân — không tự làm tròn thành biên chế; khác "người cần bố trí" và khác "biên chế được giao".</li>
            <li>Chỉ tính theo nhiệm vụ, sản phẩm, năng lực và thời gian — <b>không dùng ngạch, bậc, lương</b>.</li>
            <li>Chỉ dòng B1 có R = ĐẠT mới vào C3; chỉ dòng B2_CT có P = ĐẠT mới được cộng/trừ giờ.</li>
            <li>Mã <b>VD-…</b> chỉ để minh họa — không dùng làm số liệu tổng hợp.</li>
            <li>Sửa một dòng <b>đã xác nhận</b> (cột cảnh báo đã ĐẠT, hoặc trạng thái "Đã kiểm chứng/Đã xác nhận…") thì phần mềm tự ghi biểu S — Nhật ký thay đổi (người sửa, giá trị cũ/mới, ngày); cột "Nguồn" ở S cần bổ sung căn cứ.</li>
          </ul>
        </Khoi>
        <Khoi tieuDe="Khung 06 nhóm sản phẩm (tham khảo)">
          <table className="w-full text-[12.5px]"><tbody>{SAU_NHOM.map(([n, t]) => <tr key={n} className="border-t border-slate-100"><td className="px-2 py-1.5 font-bold w-10">{n}</td><td className="px-2 py-1.5">{t}</td></tr>)}</tbody></table>
          <p className="mt-2 text-[12px] text-slate-500">Phân nhóm theo công việc, không theo ngạch/bậc. Chỉ dùng phút chuẩn khi DM_SAN_PHAM cột G = "Đã xác nhận"; chưa xác nhận thì dùng thời gian thực đo có chứng cứ hoặc PP1/PP3.</p>
        </Khoi>
      </div>
      <Khoi tieuDe="Ví dụ kiểm thử công thức (trang KT_GIA_DINH) — tính trực tiếp bằng phần mềm">
        <div className="grid sm:grid-cols-3 gap-3 text-[12.5px]">
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Giờ gốc (B1)</p><p className="font-bold">6.000 SP × 30 phút ÷ 60 = <span className="text-sky-700">{fmtSo(b1.G)}</span> giờ</p></div>
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Tác động ròng (B2)</p><p className="font-bold">{fmtSo(b2.E)} − {fmtSo(b2.C)} − {fmtSo(b2.D)} = <span className="text-sky-700">{fmtSo(b2.F)}</span> giờ</p></div>
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Người quy đổi PP2 (C3)</p><p className="font-bold">{fmtSo(c3.E)} ÷ {fmtSo(c3.F)} = <span className="text-sky-700">{fmtSo(Math.round(c3.G * 10000) / 10000)}</span></p></div>
        </div>
        <p className="mt-2 text-[12px] text-slate-500">Khớp kỳ vọng của bộ biểu (3.000 → 2.600 → 2.600/1.904). Số liệu giả định, không dùng làm báo cáo.</p>
      </Khoi>
      <Khoi tieuDe="Những chỗ bộ biểu Excel chưa thống nhất — phần mềm đã chọn cách hiểu">
        <div className="space-y-3">
          {KHAC_EXCEL.map((x) => (
            <div key={x.cho} className="border border-slate-200 rounded-xl p-3">
              <p className="font-bold text-slate-800">{x.cho}</p>
              <p className="text-[12.5px] mt-1"><b className="text-slate-500">Tệp Excel:</b> {x.excel}</p>
              <p className="text-[12.5px] mt-0.5"><b className="text-sky-700">Phần mềm:</b> {x.phanMem}</p>
            </div>
          ))}
        </div>
      </Khoi>
    </div>
  );
}

// ─── Thành phần chính ───────────────────────────────────────────────────────
export default function VTVL({ onHome }) {
  const [doc, setDoc] = useState(() => readVTVL().doc);
  const [ts, setTs] = useState(() => readVTVL().ts);
  const [chuaLuu, setChuaLuu] = useState(() => readVTVL().chuaLuu);
  const [daNap, setDaNap] = useState(false);
  const [phien, setPhien] = useState(null);
  const [tab, setTab] = useState('tongquan');
  const [bieuId, setBieuId] = useState('A1');
  const [formId, setFormId] = useState(null);
  const [dan, setDan] = useState(false);
  const [diToi, setDiToi] = useState(null);
  const [nhapTep, setNhapTep] = useState({ cheDo: 'thay', boQuaLoi: true });
  const [luu, setLuu] = useState({ k: '' }); // '', 'dang', 'ok', 'loi', 'xungdot'
  const [banNhap, setBanNhap] = useState(null); // bản máy chủ khi máy này còn bản nháp chưa lưu
  const [thongBao, setThongBao] = useState(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  const coQuyenGhi = !!phien && phien.user?.email !== GUEST.email;
  const docOnly = !coQuyenGhi;
  const bao = useCallback((kieu, chu) => { setThongBao({ kieu, chu }); setTimeout(() => setThongBao(null), 6000); }, []);

  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); });
    const off = onAuthChange((s) => setPhien(s || null));
    fetchVTVL().then((r) => {
      if (!alive) return;
      setDaNap(true);
      if (!r) return; // không đọc được máy chủ → giữ bản cache
      const local = readVTVL();
      if (local.chuaLuu && JSON.stringify(local.doc.bieu) !== JSON.stringify(r.doc.bieu)) { setBanNhap(r); setTs(r.ts); return; }
      setDoc(r.doc); setTs(r.ts); setChuaLuu(false); cacheVTVL(r.doc, r.ts, false);
    });
    return () => { alive = false; off && off(); };
  }, []);

  const kq = useMemo(() => tinhToan(doc), [doc]);
  const vanDe = useMemo(() => kiemTraDuLieu(doc, kq), [doc, kq]);
  const kb = useMemo(() => kichThuocKB(doc), [doc]);

  // Tự lưu lên máy chủ 1,5 giây sau lần sửa cuối (chỉ khi đã đăng nhập).
  useEffect(() => {
    if (!chuaLuu || !coQuyenGhi || banNhap || luu.k === 'xungdot' || luu.k === 'dang') return;
    const h = setTimeout(async () => {
      setLuu({ k: 'dang' });
      const dangGhi = docRef.current;
      const r = await saveVTVL(dangGhi, ts);
      if (r.ok) {
        setTs(r.ts);
        // Người dùng sửa tiếp trong lúc đang lưu thì vẫn còn thay đổi chưa lưu.
        if (docRef.current === dangGhi) { setChuaLuu(false); cacheVTVL(dangGhi, r.ts, false); } else cacheVTVL(docRef.current, r.ts, true);
        setLuu({ k: 'ok', luc: new Date() });
      } else if (r.xungDot) setLuu({ k: 'xungdot' });
      else setLuu({ k: 'loi', chu: r.loi });
    }, 1500);
    return () => clearTimeout(h);
  }, [doc, chuaLuu, coQuyenGhi, banNhap, ts, luu.k]);

  const datDoc = (moi) => {
    setDoc(moi); setChuaLuu(true);
    if (!cacheVTVL(moi, ts, true)) bao('canh', 'Trình duyệt hết chỗ lưu bản nháp (dữ liệu quá lớn) — hãy giữ kết nối để phần mềm lưu lên máy chủ.');
    if (luu.k === 'loi' || luu.k === 'ok') setLuu({ k: '' });
  };

  const email = phien?.user?.email || '';
  const suaO = (bId, id, k, v) => {
    if (docOnly) return;
    const d = docRef.current;
    const rows = d.bieu[bId] || [];
    const i = rows.findIndex((r) => r._id === id);
    if (i < 0) return;
    const cu = rows[i][k];
    if (cu === v) return;
    const b = BIEU_THEO_ID[bId];
    const bieuMoi = { ...d.bieu, [bId]: rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)) };
    const kqNay = d === doc ? kq : tinhToan(d);
    if (bId !== 'S' && dongDaXacNhan(bId, rows[i], kqNay.tinh[bId]?.[i])) {
      const khoa = cotKhoa(b);
      bieuMoi.S = [...(d.bieu.S || []), dongNhatKy({ ky: d.ky, bieu: b.sheet, ma: khoa ? rows[i][khoa.k] : `dòng ${i + 1}`, truong: `${k} · ${b.cot.find((c) => c.k === k)?.ten}`, cu, moi: v, nguoi: email })];
    }
    datDoc({ ...d, bieu: bieuMoi });
  };
  const themDong = (bId) => {
    const r = newDong(bId);
    if (bId === 'S') Object.assign(r, { A: doc.ky, H: email, I: new Date().toISOString().slice(0, 10) });
    const cot1 = BIEU_THEO_ID[bId].cot[0];
    if ((bId === 'Y' || bId === 'VUNG') && cot1.kieu === 'so') r.A = (doc.bieu[bId] || []).length + 1;
    datDoc({ ...doc, bieu: { ...doc.bieu, [bId]: [...(doc.bieu[bId] || []), r] } });
    setDiToi({ bieu: bId, id: r._id, n: Date.now() });
  };
  const xoaDong = (bId, id) => {
    if (!window.confirm('Xóa dòng này?')) return;
    const b = BIEU_THEO_ID[bId];
    const r = (doc.bieu[bId] || []).find((x) => x._id === id);
    const khoa = cotKhoa(b);
    const bieuMoi = { ...doc.bieu, [bId]: doc.bieu[bId].filter((x) => x._id !== id) };
    if (bId !== 'S' && r && khoa && !rong(r[khoa.k])) bieuMoi.S = [...(doc.bieu.S || []), dongNhatKy({ ky: doc.ky, bieu: b.sheet, ma: r[khoa.k], truong: '(xóa dòng)', cu: r[khoa.k], nguoi: email })];
    datDoc({ ...doc, bieu: bieuMoi });
    if (formId === id) setFormId(null);
  };
  const nhanBan = (bId, id) => {
    const rows = doc.bieu[bId] || [];
    const i = rows.findIndex((x) => x._id === id);
    if (i < 0) return;
    const ban = { ...rows[i], _id: newDong(bId)._id };
    datDoc({ ...doc, bieu: { ...doc.bieu, [bId]: [...rows.slice(0, i + 1), ban, ...rows.slice(i + 1)] } });
    setFormId(ban._id);
  };
  const xoaHet = (bId) => {
    const b = BIEU_THEO_ID[bId];
    if (!window.confirm(`Xóa TOÀN BỘ ${soDong(doc, bId)} dòng của biểu ${b.ma} — ${b.ten}?`)) return;
    datDoc({ ...doc, bieu: { ...doc.bieu, [bId]: [], S: bId === 'S' ? [] : [...(doc.bieu.S || []), dongNhatKy({ ky: doc.ky, bieu: b.sheet, truong: '(xóa toàn bộ biểu)', cu: `${soDong(doc, bId)} dòng`, nguoi: email })] } });
  };
  const apDung = (ketQua, tenTep, cheDo, soSua = 0) => {
    const tomTat = ketQua.tomTat.map((t) => `${t.ma}: +${t.them}${t.capNhat ? `, cập nhật ${t.capNhat}` : ''}`).join('; ');
    const canhBaoThay = cheDo === 'thay' ? `\n\nChế độ THAY THẾ: dữ liệu hiện có của ${ketQua.tomTat.map((t) => t.ma).join(', ')} sẽ được thay bằng dữ liệu của tệp.` : '';
    if (!window.confirm(`Áp dụng ${ketQua.tongNhap} dòng từ "${tenTep}"?\n${tomTat}${canhBaoThay}`)) return;
    const moi = chuanHoaVTVL(ketQua.docMoi);
    moi.bieu.S = [...(moi.bieu.S || []), dongNhatKy({ ky: moi.ky, bieu: '(nhập từ tệp)', truong: CHE_DO.find((m) => m.id === cheDo)?.ten || cheDo, moi: soSua ? `${tomTat} · tự động sửa ${soSua} chỗ` : tomTat, nguon: tenTep, nguoi: email })];
    datDoc(moi);
    setNhapTep({ cheDo, boQuaLoi: true });
    setTab('tongquan');
    bao('ok', `Đã nhập ${ketQua.tongNhap} dòng từ "${tenTep}". ${coQuyenGhi ? 'Đang lưu lên máy chủ…' : ''}`);
  };
  const danXong = (chu, viTri) => {
    const pt = phanTichTep({ trang: [{ ten: `Dán vào ${BIEU_THEO_ID[bieuId].sheet}`, dong: docBangChu(chu) }] }, { chiBieu: bieuId, theoViTri: viTri });
    setNhapTep({ ten: `Dữ liệu dán vào ${BIEU_THEO_ID[bieuId].ma} — ${BIEU_THEO_ID[bieuId].ten}`, phanTich: pt, cheDo: 'them', boQuaLoi: true, khongDoc: [] });
    setDan(false);
    setTab('tep');
  };
  const diToiO = (bId, id) => { setBieuId(bId); setTab('nhap'); setDiToi({ bieu: bId, id, n: Date.now() }); };
  const taiLaiMayChu = async () => {
    const r = await fetchVTVL();
    if (!r) { bao('loi', 'Không tải được bản trên máy chủ.'); return; }
    setDoc(r.doc); setTs(r.ts); setChuaLuu(false); cacheVTVL(r.doc, r.ts, false); setLuu({ k: '' }); setBanNhap(null);
    bao('ok', 'Đã tải bản mới nhất trên máy chủ.');
  };
  const ghiDe = async () => {
    const r = await fetchVTVL();
    setTs(r?.ts || null); setLuu({ k: '' }); setChuaLuu(true); setBanNhap(null);
  };
  const taiMau = () => import('./lib/vtvlXuat').then((m) => m.xuatMau());

  const b = BIEU_THEO_ID[bieuId];
  const huyHieuLuu = !coQuyenGhi ? null
    : luu.k === 'dang' ? 'Đang lưu…'
      : luu.k === 'loi' ? 'Chưa lưu được'
        : chuaLuu ? 'Có thay đổi chưa lưu'
          : luu.k === 'ok' ? `Đã lưu ${luu.luc.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Đã đồng bộ';

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-[#082f49] via-[#0c4a6e] to-[#0369a1] text-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/40 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-sky-200">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Bộ biểu Vị trí việc làm — nhập liệu, kiểm tra</h1>
              <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">A1–D2 · danh mục sản phẩm · dự báo 2027–2031 · tự tính đúng công thức bộ biểu</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {huyHieuLuu && <span className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${luu.k === 'loi' ? 'bg-rose-500/30 border-rose-200/40' : chuaLuu ? 'bg-amber-400/20 border-amber-200/30' : 'bg-white/10 border-white/20'}`}>{huyHieuLuu}</span>}
            <span className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${coQuyenGhi ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-50' : 'bg-amber-400/20 border-amber-200/30 text-amber-50'}`}>
              {coQuyenGhi ? 'Đã đăng nhập · nhập liệu được' : 'Khách · xem và kiểm tra tệp'}
            </span>
            {!coQuyenGhi && <a href="#/okr?login=1" className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white text-sky-900 inline-flex items-center gap-1.5"><LogIn className="w-3.5 h-3.5" /> Đăng nhập</a>}
          </div>
        </div>
        <nav className="max-w-[1500px] mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map(({ id, ten, Ic }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold rounded-t-xl transition-colors ${tab === id ? 'bg-slate-50 text-sky-900' : 'text-white/80 hover:bg-white/10'}`}>
              {renderIcon(Ic)}{ten}
              {id === 'kiemtra' && (vanDe.ds.filter((v) => v.muc === 'loi').length > 0) && <span className="ml-1 text-[10px] font-bold px-1.5 rounded-full bg-rose-500 text-white">{vanDe.ds.filter((v) => v.muc === 'loi').length}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-5 space-y-4">
        {thongBao && (
          <div className={`rounded-xl border px-4 py-2.5 text-[13px] flex items-start gap-2 ${thongBao.kieu === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : thongBao.kieu === 'canh' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {thongBao.kieu === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}<span>{thongBao.chu}</span>
          </div>
        )}
        {banNhap && coQuyenGhi && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 flex items-center gap-3 flex-wrap">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1 min-w-[240px]">Máy này còn <b>bản nháp chưa lưu</b> khác với bản trên máy chủ{banNhap.doc.capNhat ? ` (máy chủ cập nhật lúc ${new Date(banNhap.doc.capNhat).toLocaleString('vi-VN')})` : ''}. Chọn bản muốn giữ:</span>
            <button onClick={() => { setBanNhap(null); setChuaLuu(true); }} className={nutPhu}>Giữ bản nháp trên máy này</button>
            <button onClick={taiLaiMayChu} className={nutPhu}>Dùng bản trên máy chủ</button>
          </div>
        )}
        {luu.k === 'xungdot' && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-[13px] text-rose-900 flex items-center gap-3 flex-wrap">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1 min-w-[240px]">Người khác vừa lưu dữ liệu bộ biểu trên máy chủ nên thay đổi của bạn <b>chưa được ghi</b> (tránh ghi đè mất dữ liệu của nhau).</span>
            <button onClick={taiLaiMayChu} className={nutPhu}>Tải bản mới (bỏ thay đổi của tôi)</button>
            <button onClick={ghiDe} className={`${nutPhu} text-rose-700`}>Ghi đè bằng bản của tôi</button>
          </div>
        )}
        {luu.k === 'loi' && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-800">Chưa lưu được lên máy chủ ({luu.chu}). Bản nháp vẫn giữ trên máy này; phần mềm sẽ thử lại ở lần sửa tiếp theo.</div>}
        {kb > CANH_BAO_KB && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-800">Dữ liệu đã khoảng {fmtSo(kb)} KB — lưu và tải sẽ chậm hơn. Cân nhắc tách theo đơn vị hoặc theo kỳ.</div>}
        {docOnly && daNap && tab !== 'tep' && tab !== 'huongdan' && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-[13px] text-sky-900 flex items-center gap-2 flex-wrap">
            <Info className="w-4 h-4 shrink-0" />
            <span className="flex-1">Chế độ xem. Khách vẫn dùng được <button onClick={() => setTab('tep')} className="font-bold underline">Nhập từ tệp</button> để <b>kiểm tra lỗi tệp Excel</b> và xuất báo cáo lỗi; muốn nhập liệu thì đăng nhập.</span>
          </div>
        )}

        {tab === 'tongquan' && (
          <TongQuan doc={doc} kq={kq} vanDe={vanDe} docOnly={docOnly}
            onSuaChung={(k, v) => { if (!docOnly && doc[k] !== v) datDoc({ ...doc, [k]: v }); }}
            onMoBieu={(id) => { setBieuId(id); setTab('nhap'); }} onTab={setTab}
            onXuat={() => import('./lib/vtvlXuat').then((m) => m.xuatDuLieu(doc, kq))} onTaiMau={taiMau}
            onSaoLuu={() => import('./lib/vtvlXuat').then((m) => m.xuatSaoLuu(doc))} />
        )}

        {tab === 'nhap' && (
          <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-4 items-start">
            <aside className="bg-white rounded-2xl border border-slate-200 p-2 lg:sticky lg:top-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto">
              {NHOM_BIEU.map((n) => (
                <div key={n.id} className="mb-1">
                  <p className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{n.ten}</p>
                  {BIEU.filter((x) => x.nhom === n.id).map((x) => {
                    const d = vanDe.demBieu[x.id] || {};
                    const so = x.id === 'B2' ? kq.B2.length : x.id === 'DOI' ? kq.DOI.length : soDong(doc, x.id);
                    return (
                      <button key={x.id} onClick={() => setBieuId(x.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] flex items-center gap-2 ${bieuId === x.id ? 'bg-sky-700 text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
                        <span className={`font-mono text-[10.5px] w-12 shrink-0 ${bieuId === x.id ? 'text-sky-100' : 'text-slate-400'}`}>{x.ma}</span>
                        <span className="flex-1 truncate">{x.ten}{x.tuTinh ? ' ∑' : ''}</span>
                        {d.loi ? <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title={`${d.loi} lỗi`} /> : d.canh ? <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title={`${d.canh} cảnh báo`} /> : null}
                        <span className={`text-[10.5px] tabular-nums ${bieuId === x.id ? 'text-sky-100' : 'text-slate-400'}`}>{so}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </aside>
            <BangBieu b={b} doc={doc} kq={kq} vanDe={vanDe} docOnly={docOnly} diToi={diToi}
              onSua={(id, k, v) => suaO(b.id, id, k, v)} onThem={() => themDong(b.id)} onXoa={(id) => xoaDong(b.id, id)}
              onNhanBan={(id) => nhanBan(b.id, id)} onXoaHet={() => xoaHet(b.id)} onMoForm={setFormId} onDan={() => setDan(true)} />
          </div>
        )}

        {tab === 'tep' && <NhapTep trangThai={nhapTep} setTrangThai={setNhapTep} doc={doc} coQuyenGhi={coQuyenGhi} onApDung={apDung} onTaiMau={taiMau} />}
        {tab === 'kiemtra' && <KiemTraTab doc={doc} kq={kq} vanDe={vanDe} onDiToi={diToiO} />}
        {tab === 'huongdan' && <HuongDanTab />}

        <p className="text-center text-[11px] text-slate-400 pt-4">Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu. Không nhập họ tên, số định danh cá nhân vào bộ biểu (D1 dùng mã nguồn lực).</p>
      </main>

      {formId && tab === 'nhap' && (
        <FormDong b={b} doc={doc} kq={kq} vanDe={vanDe} id={formId} docOnly={docOnly} onDong={() => setFormId(null)} onDi={setFormId}
          onSua={(id, k, v) => suaO(b.id, id, k, v)} onXoa={(id) => xoaDong(b.id, id)} onNhanBan={(id) => nhanBan(b.id, id)} />
      )}
      {dan && <HopDan b={b} onDong={() => setDan(false)} onXong={danXong} />}
    </div>
  );
}
