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
import { createPortal } from 'react-dom';
import {
  Home, FileSpreadsheet, LayoutDashboard, Table2, Upload, ShieldAlert, BookOpen, Plus, Trash2, Copy,
  PanelRightOpen, X, ChevronLeft, ChevronRight, Search, Download, Save, CheckCircle2, AlertTriangle,
  Info, ClipboardPaste, RefreshCw, FileDown, ArrowRight, LogIn, Sigma, CircleAlert, Wand2, Undo2, ChevronDown, Check, Link2, CornerUpLeft, FileText, Printer, Building2, TrendingUp, TrendingDown, Equal, Scale,
} from 'lucide-react';
import { getSession, onAuthChange, GUEST } from './lib/auth';
import {
  BIEU, BIEU_THEO_ID, NHOM_BIEU, cotNhap, cotKhoa, dsCua, newDong, tinhToan, kiemTraDuLieu, dongHienThi,
  giaTriO, chuyenGiaTri, laSo, rong, kk, dongDaXacNhan, dongNhatKy, TT_DAT, TT_THONG_TIN, TAM_BUOC, SAU_NHOM,
  KHAC_EXCEL, viDuKiemThu, QUY_GIO_PP2, chuanHoaVTVL, soDong, DS, luaChonMa, timDongTheoMa,
} from './lib/vtvl';
import { HD } from './lib/vtvlHuongDan';
import { lapBaoCao, chiSoBienChe } from './lib/vtvlBaoCao';
import { docTep, phanTichTep, chuanBiNhap, docBangChu, bieuTheoTenTrang, chuanTen, CHE_DO, MUC_TEN } from './lib/vtvlNhap';
import { deXuatSua, apDungSua } from './lib/vtvlSuaLoi';
import {
  readVTVL, cacheVTVL, fetchVTVL, saveVTVL, kichThuocKB, CANH_BAO_KB,
  fetchDanhSachDV, luuDonVi, maSuaCua, nhoMaSua, xoaMaSua, docMoiChoDonVi,
} from './lib/vtvlStore';
import { kiemTraTen, kiemTraMaSua, slugDonVi, MAX_TEN, TEN_TINH } from './lib/vtvlDonVi';

const MOI_TRANG = 50;
// Đơn vị được chọn gần nhất trên máy này ('' = bộ biểu của cơ quan tỉnh, bản mặc định).
const KEY_SLUG = 'hdndkpi_vtvl_slug';
const slugDaChon = () => { try { return slugDonVi(localStorage.getItem(KEY_SLUG) || ''); } catch { return ''; } };
const nhoSlug = (s) => { try { localStorage.setItem(KEY_SLUG, s || ''); } catch { /* bỏ qua */ } };
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
  { id: 'baocao', ten: 'Báo cáo', Ic: FileText },
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

// ─── Độ rộng cột của bảng nhập liệu ─────────────────────────────────────────
//  Bảng dùng `table-layout: fixed` + độ rộng CỐ ĐỊNH theo kiểu cột. Không đặt độ rộng
//  thì cột nào có chữ dài (vd ô mã kèm tên công việc) phình chiếm cả bề ngang, đẩy các
//  cột khác khuất sang phải, còn cột hẹp thì chữ xuống dòng làm mỗi dòng cao vài trăm
//  điểm ảnh. Chữ dài được cắt bằng "…" và hiện đủ khi rê chuột / mở biểu mẫu dòng.
const RONG_STT = 52;
const RONG_THAO_TAC = 112;
function rongCot(c) {
  if (c.tt) return 210;
  if (c.ref) return 200;
  if (c.refTinh) return 140;
  if (c.kieu === 'ma') return 150;
  if (c.kieu === 'ds') return 190;
  if (c.kieu === 'nam') return 104;
  if (c.kieu === 'so') return 112;
  if (c.kieu === 'ngay') return 150;
  if (c.dai) return 280;
  if (c.kieu === 'tinh') return c.ten.length > 22 ? 180 : 124;
  return 190;
}

// ─── Ô nhập trong bảng (không điều khiển — chỉ ghi khi rời ô / Enter) ─────────
function ONhap({ col, v, onGhi, khoa = false, lop = '', dlId }) {
  const ghi = (raw) => { const { v: moi } = chuyenGiaTri(col, raw); if (moi !== v && !(rong(moi) && rong(v))) onGhi(moi); };
  const base = `w-full bg-transparent px-2 py-1.5 text-[12.5px] outline-none focus:bg-white focus:ring-2 focus:ring-sky-400 rounded ${lop}`;
  const enter = (e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { e.currentTarget.value = giaTriHienThi(v); e.currentTarget.blur(); } };
  if (col.kieu === 'ds' || col.kieu === 'nam') {
    const list = col.kieu === 'nam' ? DS.NAM : dsCua(col);
    return (
      <select disabled={khoa} value={rong(v) ? '' : String(v)} onChange={(e) => ghi(e.target.value)} className={`${base} cursor-pointer`}>
        <option value="">—</option>
        {!rong(v) && !list.includes(v) && <option value={String(v)}>{String(v)} (không hợp lệ)</option>}
        {list.map((x) => <option key={x} value={String(x)}>{x}</option>)}
      </select>
    );
  }
  if (col.kieu === 'ngay' && (rong(v) || /^\d{4}-\d{2}-\d{2}$/.test(v))) {
    return <input type="date" disabled={khoa} defaultValue={v || ''} key={String(v)} onBlur={(e) => ghi(e.target.value)} className={base} />;
  }
  const so = col.kieu === 'so';
  return (
    <input disabled={khoa} defaultValue={giaTriHienThi(v)} key={String(v)} list={dlId}
      inputMode={so ? 'decimal' : undefined} onBlur={(e) => ghi(e.target.value)} onKeyDown={enter}
      className={`${base} ${so ? 'text-right tabular-nums' : ''}`} />
  );
}

// ─── Ô CHỌN MÃ LIÊN KẾT (A2!C → C1, B1!A → A2, …) ────────────────────────────
// Bấm vào ô (hoặc Enter / mũi tên xuống) → mở danh sách mã của biểu nguồn kèm
// tên; gõ để lọc (không dấu cũng được), chọn bằng chuột hoặc ↑ ↓ Enter. Hộp chọn
// dựng bằng portal + vị trí cố định để không bị khung cuộn ngang của bảng cắt mất.
const GIOI_HAN_HIEN = 300;
function OChonMa({ col, v, onGhi, luaChon, onMoMa, lop = '' }) {
  const [mo, setMo] = useState(false);
  const [q, setQ] = useState('');
  const [hl, setHl] = useState(0);
  const [viTri, setViTri] = useState(null);
  const neo = useRef(null);
  const hop = useRef(null);
  const dich = BIEU_THEO_ID[col.ref];
  const hienTai = rong(v) ? null : luaChon.find((x) => kk(x.ma) === kk(v)) || null;
  const loc = useMemo(() => {
    const n = chuanTen(q);
    return n ? luaChon.filter((x) => chuanTen(`${x.ma} ${x.chinh} ${x.phu}`).includes(n)) : luaChon;
  }, [q, luaChon]);

  const tinhViTri = () => {
    const r = neo.current.getBoundingClientRect();
    const rong_ = Math.max(r.width, 380);
    const duoi = window.innerHeight - r.bottom;
    const lenTren = duoi < 300 && r.top > duoi;
    return { left: Math.max(8, Math.min(r.left, window.innerWidth - rong_ - 8)), width: rong_, ...(lenTren ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }) };
  };
  const moHop = () => {
    setViTri(tinhViTri());
    setQ('');
    setHl(Math.max(0, luaChon.findIndex((x) => kk(x.ma) === kk(v))));
    setMo(true);
  };
  const chon = (ma) => {
    setMo(false);
    if (ma !== v && !(rong(ma) && rong(v))) onGhi(ma);
    neo.current?.focus();
  };
  useEffect(() => {
    if (!mo) return undefined;
    const ngoai = (e) => { if (!hop.current?.contains(e.target) && !neo.current?.contains(e.target)) setMo(false); };
    // Cuộn trang hoặc khung cuộn của bảng: hộp BÁM THEO ô; chỉ đóng khi ô đã ra khỏi
    // khung nhìn (đóng ngay khi có bất kỳ thao tác cuộn nào thì người dùng lăn chuột
    // nhẹ trong bảng là hộp biến mất).
    const cuon = (e) => {
      if (hop.current?.contains(e.target) || !neo.current) return;
      const r = neo.current.getBoundingClientRect();
      const khung = neo.current.closest('.overflow-auto')?.getBoundingClientRect();
      const ngoaiKhung = khung && (r.bottom < khung.top || r.top > khung.bottom || r.right < khung.left || r.left > khung.right);
      if (ngoaiKhung || r.bottom < 0 || r.top > window.innerHeight) setMo(false);
      else setViTri(tinhViTri());
    };
    const dong = () => setMo(false);
    document.addEventListener('mousedown', ngoai);
    window.addEventListener('scroll', cuon, true);
    window.addEventListener('resize', dong);
    return () => { document.removeEventListener('mousedown', ngoai); window.removeEventListener('scroll', cuon, true); window.removeEventListener('resize', dong); };
  }, [mo]);
  useEffect(() => { if (mo) hop.current?.querySelector(`[data-i="${hl}"]`)?.scrollIntoView({ block: 'nearest' }); }, [hl, mo]);

  const phim = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHl((h) => Math.min(Math.min(loc.length, GIOI_HAN_HIEN) - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHl((h) => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (loc[hl]) chon(loc[hl].ma); else if (q.trim()) chon(chuyenGiaTri(col, q).v); }
    else if (e.key === 'Escape') { e.preventDefault(); setMo(false); neo.current?.focus(); }
    else if (e.key === 'Tab') setMo(false);
  };
  const goTay = q.trim() && !luaChon.some((x) => kk(x.ma) === kk(q));

  return (
    <>
      <button type="button" ref={neo} onClick={() => (mo ? setMo(false) : moHop())}
        onKeyDown={(e) => { if (['ArrowDown', 'Enter', 'F2'].includes(e.key)) { e.preventDefault(); moHop(); } }}
        title={hienTai ? `${hienTai.ma} — ${hienTai.chinh}${hienTai.phu ? ` (${hienTai.phu})` : ''}` : rong(v) ? `Bấm để chọn mã có ở biểu ${dich.ma}` : `Mã "${v}" chưa có ở biểu ${dich.ma}`}
        aria-haspopup="listbox" aria-expanded={mo}
        className={`w-full flex items-center gap-1.5 text-left px-2 py-1.5 text-[12.5px] rounded outline-none focus:ring-2 focus:ring-sky-400 hover:bg-sky-50 cursor-pointer ${lop}`}>
        <span className={`shrink-0 max-w-[70%] truncate ${rong(v) ? 'text-slate-300 italic' : 'font-medium text-slate-800'}`}>{rong(v) ? `chọn mã ${dich.ma}…` : v}</span>
        {hienTai?.chinh && <span className="flex-1 min-w-0 truncate text-[10.5px] text-slate-400">{hienTai.chinh}</span>}
        {!hienTai?.chinh && <span className="flex-1" />}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>
      {mo && viTri && createPortal(
        <div ref={hop} role="dialog" style={{ position: 'fixed', ...viTri }}
          className="z-[70] bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col max-h-[380px] text-[12.5px]"
         >
          <div className="px-3 pt-2.5 pb-2 border-b border-slate-100">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-sky-700">Chọn {col.ten} — mã có ở {dich.ma} ({dich.ten})</p>
            <div className="relative mt-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setHl(0); }} onKeyDown={phim}
                placeholder="Tìm theo mã hoặc tên (gõ không dấu cũng được)…" className={`${inp} pl-7 py-1.5`} />
            </div>
          </div>
          <div role="listbox" className="flex-1 overflow-y-auto py-1">
            {luaChon.length === 0 && (
              <p className="px-3 py-4 text-slate-500">Biểu <b>{dich.ma}</b> chưa có mã nào. Nhập {dich.ma} trước rồi quay lại chọn (hoặc gõ mã rồi Enter — sẽ báo lỗi liên kết tới khi {dich.ma} có mã đó).</p>
            )}
            {luaChon.length > 0 && loc.length === 0 && <p className="px-3 py-4 text-slate-500">Không có mã nào khớp "{q}".</p>}
            {loc.slice(0, GIOI_HAN_HIEN).map((x, i) => {
              const dangChon = !rong(v) && kk(x.ma) === kk(v);
              return (
                <button key={x.ma} type="button" role="option" aria-selected={dangChon} data-i={i}
                  onMouseEnter={() => setHl(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => chon(x.ma)}
                  className={`w-full text-left px-3 py-1.5 flex items-start gap-2.5 ${i === hl ? 'bg-sky-50' : ''}`}>
                  <span className="font-mono font-bold text-sky-800 shrink-0 min-w-[64px]">{x.ma}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-slate-700">{x.chinh || <i className="text-slate-400">chưa có tên</i>}</span>
                    {x.phu && <span className="block truncate text-[11px] text-slate-400">{x.phu}</span>}
                  </span>
                  {dangChon && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
            {loc.length > GIOI_HAN_HIEN && <p className="px-3 py-2 text-[11px] text-slate-400">… còn {loc.length - GIOI_HAN_HIEN} mã — gõ để lọc thêm.</p>}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-[11.5px]">
            {goTay && <button type="button" onClick={() => chon(chuyenGiaTri(col, q).v)} className="font-semibold text-amber-700 hover:underline">Dùng mã "{q.trim()}" (chưa có ở {dich.ma})</button>}
            {!rong(v) && <button type="button" onClick={() => chon('')} className="font-semibold text-slate-500 hover:text-rose-700">Xóa giá trị</button>}
            {onMoMa && (
              <button type="button" onClick={() => { setMo(false); onMoMa(col.ref, hienTai ? hienTai.ma : null); }} className="ml-auto inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline">
                <Link2 className="w-3.5 h-3.5" />{hienTai ? `Mở dòng ${hienTai.ma} ở ${dich.ma}` : `Mở biểu ${dich.ma}`}
              </button>
            )}
            <span className="w-full text-[10.5px] text-slate-400">{loc.length}/{luaChon.length} mã · ↑ ↓ để chọn, Enter để ghi, Esc để đóng</span>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/** Mã hiển thị thành liên kết sang dòng nguồn (cột mã tự tính, chế độ chỉ xem). */
function LienKetMa({ ma, refId, luaChon, onMoMa }) {
  if (rong(ma)) return null;
  const x = luaChon?.find((o) => kk(o.ma) === kk(ma));
  if (!x || !onMoMa) return <span className="text-slate-600">{ma}</span>;
  return (
    <button type="button" onClick={() => onMoMa(refId, x.ma)} title={`${x.ma} — ${x.chinh || ''} · mở dòng này ở biểu ${BIEU_THEO_ID[refId].ma}`}
      className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 hover:underline font-medium text-left">
      <Link2 className="w-3 h-3 shrink-0" />{ma}
    </button>
  );
}

/** Danh sách lựa chọn cho mọi cột liên kết của một biểu. */
const useLuaChon = (doc, b) => useMemo(() => {
  const ids = new Set(b.cot.map((c) => c.ref || c.refTinh).filter(Boolean));
  return Object.fromEntries([...ids].map((id) => [id, luaChonMa(doc, id)]));
}, [doc, b]);

// ─── Bảng nhập liệu của một biểu ────────────────────────────────────────────
function BangBieu({ b, doc, kq, vanDe, docOnly, onSua, onThem, onXoa, onNhanBan, onXoaHet, onMoForm, onDan, diToi, onMoMa, quayLai, onQuayLai }) {
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

  const luaChon = useLuaChon(doc, b);
  // Ô liên kết dùng hộp chọn mã riêng; datalist chỉ còn cho cột có GỢI Ý (không bắt buộc).
  const datalists = b.cot.filter((c) => c.goiY).map((c) => (
    <datalist key={c.k} id={`dl-${b.id}-${c.k}`}>{dsCua(c).map((x) => <option key={x} value={x} />)}</datalist>
  ));
  const h = HD[b.id];
  const tongRong = RONG_STT + b.cot.reduce((s, c) => s + rongCot(c), 0) + (b.tuTinh ? 0 : RONG_THAO_TAC);

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
        {quayLai && (
          <button onClick={onQuayLai} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100">
            <CornerUpLeft className="w-3.5 h-3.5" /> Quay lại {BIEU_THEO_ID[quayLai.bieu].ma}{quayLai.ma ? ` — dòng ${quayLai.ma}` : ''}
          </button>
        )}
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
      {/* Khung cuộn RIÊNG của bảng (cả ngang lẫn dọc) để dòng tiêu đề và hai cột đầu luôn
          đứng yên như "cố định ô" của Excel. */}
      <div className="overflow-auto max-h-[calc(100vh-15rem)] min-h-[260px] border-t border-slate-100">
        <table className="text-[12.5px] border-separate border-spacing-0 table-fixed" style={{ width: tongRong }}>
          <colgroup>
            <col style={{ width: RONG_STT }} />
            {b.cot.map((c) => <col key={c.k} style={{ width: rongCot(c) }} />)}
            {!tuTinh && <col style={{ width: RONG_THAO_TAC }} />}
          </colgroup>
          <thead>
            <tr className="text-slate-600">
              <th className="sticky top-0 left-0 z-30 bg-slate-100 border-b border-r border-slate-200 px-2 h-14 text-center">#</th>
              {b.cot.map((c, j) => (
                <th key={c.k} title={goiYCot(b, c)}
                  className={`sticky top-0 ${j === 0 ? 'z-30 shadow-[2px_0_0_0_#cbd5e1]' : 'z-20'} border-b border-r border-slate-200 px-2 h-14 text-left align-middle font-semibold cursor-help ${c.kieu === 'tinh' ? 'bg-slate-100' : 'bg-slate-50'}`}
                  style={j === 0 ? { left: RONG_STT } : undefined}>
                  <span className="flex items-start gap-1 min-w-0">
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 shrink-0">{c.k}</span>
                    {c.kieu === 'tinh' && <Sigma className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />}
                    <span className="leading-tight line-clamp-2 break-words">{c.ten}</span>
                  </span>
                </th>
              ))}
              {!tuTinh && <th className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 px-2 h-14 text-center">Thao tác</th>}
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
                <tr key={d.row._id} id={`vt-${d.row._id}`} className={`group ${nhay === d.row._id ? 'bg-yellow-100' : ''}`}>
                  <td className={`sticky left-0 z-10 ${nhay === d.row._id ? 'bg-yellow-100' : 'bg-white group-hover:bg-sky-50'} border-b border-r border-slate-200 h-9 text-center text-[11px] text-slate-400 border-l-4 ${coLoi ? 'border-l-rose-500' : coCanh ? 'border-l-amber-400' : 'border-l-transparent'}`}>
                    {tuTinh ? d.i + 1 : <button onClick={() => onMoForm(d.row._id)} title="Mở biểu mẫu của dòng này" className="hover:text-sky-700 font-semibold">{d.i + 1}</button>}
                  </td>
                  {b.cot.map((c, j) => {
                    const v = giaTriO(b, d.row, d.t, c);
                    // Cột đầu tiên (mã) đứng yên khi cuộn ngang — cần nền đặc để không lộ chữ cột khác bên dưới.
                    const dinh = j === 0 ? { cls: 'sticky z-10 shadow-[2px_0_0_0_#cbd5e1]', st: { left: RONG_STT } } : { cls: '', st: undefined };
                    const chuDai = typeof v === 'string' ? v : giaTriHienThi(v);
                    const o = vd.filter((x) => x.cot === c.k);
                    const loiO = o.find((x) => x.muc === 'loi');
                    const canhO = o.find((x) => x.muc === 'canh');
                    const tip = o.map((x) => `${MUC_TEN[x.muc]}: ${x.chu}`).join('\n');
                    if (c.kieu === 'tinh') {
                      return (
                        <td key={c.k} title={tip || (rong(v) ? undefined : String(chuDai))} style={dinh.st}
                          className={`${dinh.cls} border-b border-r border-slate-200 ${nhay === d.row._id ? 'bg-yellow-100' : 'bg-slate-50'} px-2 h-9 overflow-hidden whitespace-nowrap ${laSo(v) ? 'text-right tabular-nums' : ''}`}>
                          {c.tt && !rong(v)
                            ? <span className={`inline-block max-w-full truncate align-middle text-[10.5px] font-bold px-1.5 py-0.5 rounded border leading-tight ${mauTrangThai(b.id, v)}`}>{v}</span>
                            : c.refTinh ? <span className="block truncate"><LienKetMa ma={v} refId={c.refTinh} luaChon={luaChon[c.refTinh]} onMoMa={onMoMa && ((r, m) => onMoMa(r, m, { bieu: b.id, id: d.row._id }))} /></span>
                              : <span className="block truncate text-slate-600">{giaTriHienThi(v)}</span>}
                        </td>
                      );
                    }
                    return (
                      <td key={c.k} title={tip || (docOnly && !rong(v) ? String(chuDai) : undefined)} style={dinh.st}
                        className={`${dinh.cls} border-b border-r border-slate-200 p-0 h-9 overflow-hidden ${loiO ? 'bg-rose-50 ring-1 ring-inset ring-rose-300' : canhO ? 'bg-amber-50' : nhay === d.row._id ? 'bg-yellow-100' : 'bg-white group-hover:bg-sky-50'}`}>
                        {c.ref
                          ? (docOnly
                            ? <span className="block truncate px-2 py-1.5"><LienKetMa ma={v} refId={c.ref} luaChon={luaChon[c.ref]} onMoMa={onMoMa && ((r, m) => onMoMa(r, m, { bieu: b.id, id: d.row._id }))} /></span>
                            : <OChonMa col={c} v={v} luaChon={luaChon[c.ref]} onGhi={(nv) => onSua(d.row._id, c.k, nv)} onMoMa={onMoMa && ((r, m) => onMoMa(r, m, { bieu: b.id, id: d.row._id }))} />)
                          : docOnly
                            ? <span className="block truncate px-2 py-1.5">{giaTriHienThi(v)}</span>
                            : <ONhap col={c} v={v} onGhi={(nv) => onSua(d.row._id, c.k, nv)} dlId={c.goiY ? `dl-${b.id}-${c.k}` : undefined} />}
                      </td>
                    );
                  })}
                  {!tuTinh && (
                    <td className={`border-b border-slate-200 px-1 h-9 text-center whitespace-nowrap ${nhay === d.row._id ? 'bg-yellow-100' : 'bg-white'}`}>
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
function FormDong({ b, doc, kq, vanDe, id, docOnly, onSua, onDong, onDi, onXoa, onNhanBan, onMoMa }) {
  const luaChon = useLuaChon(doc, b);
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
                    {c.kieu === 'tinh' ? 'Tự động' : c.kieu === 'ds' || c.kieu === 'nam' ? 'Chọn' : c.ref ? `Chọn mã ở ${BIEU_THEO_ID[c.ref].ma}` : c.kieu === 'so' ? 'Số' : c.kieu === 'nam' ? 'Năm' : c.kieu === 'ngay' ? 'Ngày' : 'Nhập'}
                  </span>
                </div>
                {c.ref || c.refTinh
                  ? (docOnly || c.kieu === 'tinh'
                    ? <p className="text-[13px]">{rong(v) ? <span className="text-slate-400">—</span> : <LienKetMa ma={v} refId={c.ref || c.refTinh} luaChon={luaChon[c.ref || c.refTinh]} onMoMa={onMoMa && ((r, m) => onMoMa(r, m, { bieu: b.id, id }))} />}</p>
                    : <div className="border border-slate-200 rounded-lg"><OChonMa col={c} v={v} luaChon={luaChon[c.ref]} lop="py-2" onGhi={(m) => onSua(id, c.k, m)} onMoMa={onMoMa && ((r, m) => onMoMa(r, m, { bieu: b.id, id }))} /></div>)
                  : c.kieu === 'tinh'
                  ? <p className={`text-[13px] ${c.tt ? '' : 'text-slate-700'}`}>{c.tt && !rong(v) ? <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${mauTrangThai(b.id, v)}`}>{v}</span> : (giaTriHienThi(v) || <span className="text-slate-400">—</span>)}</p>
                  : docOnly ? <p className="text-[13px] text-slate-700 whitespace-pre-wrap">{giaTriHienThi(v) || <span className="text-slate-400">—</span>}</p>
                    : c.dai && c.kieu === 'chu'
                      ? <textarea defaultValue={v} key={`${id}-${String(v)}`} rows={3} onBlur={(e) => { const { v: m } = chuyenGiaTri(c, e.target.value); if (m !== v) onSua(id, c.k, m); }} className={inp} />
                      : <div className="border border-slate-200 rounded-lg"><ONhap col={c} v={v} onGhi={(m) => onSua(id, c.k, m)} dlId={c.goiY ? `dl-${b.id}-${c.k}` : undefined} lop="py-2" /></div>}
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

// ─── Khối "Biên chế và nhân lực" ở Tổng quan ────────────────────────────────
//  Số liệu từ `chiSoBienChe` (vtvlBaoCao.js). Hai con số về tăng/giảm được tách bạch:
//   • "Nhu cầu so với biên chế giao" — phần mềm TỰ TÍNH, chỉ để THAM KHẢO;
//   • "Đề nghị điều chỉnh (D2)"      — số ĐƠN VỊ GHI sau khi đã tự sắp xếp, phải thẩm định.
//  Bộ biểu dặn "nhu cầu nhân lực không tự động làm tăng tổng biên chế", nên phần mềm
//  không bao giờ tự viết "cần tăng/giảm biên chế".
const coDau = (n) => (n > 0 ? `+${fmtSo(n)}` : fmtSo(n));
function huongBC(n) {
  if (n === null || n === undefined) return null;
  if (n > 0) return { Ic: TrendingUp, chu: 'cao hơn', lop: 'bg-amber-50 text-amber-800 border-amber-200', so: 'text-amber-700' };
  if (n < 0) return { Ic: TrendingDown, chu: 'thấp hơn', lop: 'bg-sky-50 text-sky-800 border-sky-200', so: 'text-sky-700' };
  return { Ic: Equal, chu: 'bằng', lop: 'bg-emerald-50 text-emerald-800 border-emerald-200', so: 'text-emerald-700' };
}

function BienCheNhanLuc({ doc, kq, onMoBieu }) {
  const bc = useMemo(() => chiSoBienChe(doc, kq), [doc, kq]);
  const h = huongBC(bc.chenhBC);
  const nd = bc.namDau;
  const hDn = nd && nd.coSo ? huongBC(nd.tong) : null;
  const giaoLoai = bc.theoLoai.filter((x) => x.bienChe && x.giao !== null);
  const coGi = bc.giaoBC !== null || bc.canBC || bc.ngoaiBC || nd;
  if (!coGi && !bc.theoLoai.length) return null;

  const The = ({ nhan, children, phu, onClick, tieuDiem }) => (
    <button type="button" onClick={onClick} disabled={!onClick}
      className={`text-left bg-white rounded-2xl border p-4 shadow-sm transition ${tieuDiem || 'border-slate-200'} ${onClick ? 'hover:border-sky-300 hover:shadow-md cursor-pointer' : 'cursor-default'}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{nhan}</p>
      {children}
      <p className="text-[12px] text-slate-500 mt-1 leading-snug">{phu}</p>
    </button>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap px-1">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Scale className="w-4 h-4 text-sky-700" /> Biên chế và nhân lực</h3>
        <span className="text-[11.5px] text-slate-500">so cùng loại nhân lực · hợp đồng lao động không thuộc biên chế</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <The nhan="Biên chế được giao" onClick={() => onMoBieu('NGNL')}
          phu={bc.giaoBC === null ? 'Chưa nhập — điền cột D "Biên chế giao" ở biểu NGUON_NHAN_LUC'
            : `${giaoLoai.map((x) => `${x.loai} ${fmtSo(x.giao)}`).join(' · ')} · nguồn ${bc.nguonGiao === 'D2' ? `D2 năm ${bc.namGiao}` : 'NGUON_NHAN_LUC'}${bc.chuaXN ? ` · ${bc.chuaXN} dòng chưa xác nhận` : ''}`}>
          <p className="text-3xl font-extrabold text-slate-800 mt-1 tabular-nums">{bc.giaoBC === null ? '—' : fmtSo(bc.giaoBC)}</p>
        </The>

        <The nhan="Nhu cầu người cần bố trí" onClick={() => onMoBieu('C3')}
          phu={`cán bộ, công chức, viên chức · ${bc.soVTDat}/${bc.soVT} VTVL đủ căn cứ${bc.ngoaiBC ? ` · ngoài ra ${fmtSo(bc.ngoaiBC)} người hợp đồng (ngoài biên chế)` : ''}`}>
          <p className="text-3xl font-extrabold text-slate-800 mt-1 tabular-nums">{fmtSo(bc.canBC)}</p>
        </The>

        <The nhan="Nhu cầu so với biên chế giao"
          tieuDiem={h ? (bc.chenhBC > 0 ? 'border-amber-300' : bc.chenhBC < 0 ? 'border-sky-300' : 'border-emerald-300') : ''}
          phu={bc.chenhBC === null ? 'Cần có biên chế được giao để so sánh'
            : `THAM KHẢO, chưa phải đề nghị${bc.duCanCu ? '' : ' · chưa đủ căn cứ toàn bộ VTVL'}`}>
          {h ? (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className={`text-3xl font-extrabold tabular-nums ${h.so}`}>{coDau(bc.chenhBC)}</p>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border ${h.lop}`}>
                <h.Ic className="w-3.5 h-3.5" /> nhu cầu {h.chu} biên chế giao
              </span>
            </div>
          ) : <p className="text-3xl font-extrabold text-slate-300 mt-1">—</p>}
        </The>

        <The nhan={`Đề nghị điều chỉnh (D2${nd ? ` · ${nd.nam}` : ''})`} onClick={() => onMoBieu('D2')}
          tieuDiem={hDn ? 'border-violet-300' : ''}
          phu={!nd ? 'Chưa lập phương án ở biểu D2'
            : !nd.coSo ? `Cột G "Đề nghị điều chỉnh" còn trống · ${nd.soDong} dòng`
              : `số đơn vị ghi · ${nd.daXong}/${nd.soDong} dòng đã thẩm định${bc.deNghiGiongNhau ? ' · như nhau 2027–2031' : ''}`}>
          {hDn ? (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-3xl font-extrabold tabular-nums text-violet-700">{coDau(nd.tong)}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border bg-violet-50 text-violet-800 border-violet-200">
                <hDn.Ic className="w-3.5 h-3.5" /> {nd.tong > 0 ? 'đề nghị tăng' : nd.tong < 0 ? 'đề nghị giảm' : 'giữ nguyên'}
              </span>
            </div>
          ) : <p className="text-3xl font-extrabold text-slate-300 mt-1">—</p>}
        </The>
      </div>

      {bc.theoLoai.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>{['Loại nhân lực', 'Biên chế giao', 'Số có mặt', 'Đã xác nhận ở D1', 'Người cần bố trí (C3)', 'Nhu cầu so với biên chế giao'].map((x) => <th key={x} className="px-3 py-2 font-semibold">{x}</th>)}</tr>
            </thead>
            <tbody>
              {bc.theoLoai.map((x) => {
                const hx = huongBC(x.chenh);
                return (
                  <tr key={x.loai} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-700">{x.loai}{!x.bienChe && <span className="ml-1.5 text-[10.5px] font-normal text-slate-400">(ngoài biên chế)</span>}</td>
                    <td className="px-3 py-2 tabular-nums">{x.giao === null ? (x.bienChe ? '—' : 'không áp dụng') : fmtSo(x.giao)}</td>
                    <td className="px-3 py-2 tabular-nums">{x.coMat === null ? '—' : fmtSo(x.coMat)}</td>
                    <td className={`px-3 py-2 tabular-nums ${x.coMat !== null && x.d1 !== x.coMat ? 'text-amber-700 font-semibold' : ''}`}>{fmtSo(x.d1)}</td>
                    <td className="px-3 py-2 tabular-nums">{fmtSo(x.can)}{x.canTatCa !== x.can ? <span className="text-[11px] text-slate-400"> (cả VTVL chưa đủ căn cứ: {fmtSo(x.canTatCa)})</span> : null}</td>
                    <td className="px-3 py-2">{hx ? <span className={`inline-flex items-center gap-1 font-bold ${hx.so}`}><hx.Ic className="w-3.5 h-3.5" />{coDau(x.chenh)}</span> : <span className="text-slate-400">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {bc.lechNhanLuc !== 0 && (
        <p className="text-[12.5px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>D1 có <b>{bc.d1Tong}</b> người đã xác nhận, còn NGUON_NHAN_LUC ghi <b>{bc.coMatTong}</b> người có mặt (lệch {coDau(bc.lechNhanLuc)}). Cần đối chiếu: người kiêm nhiệm chỉ được tính một lần, mỗi người một mã nguồn lực.</span>
        </p>
      )}
      {bc.chenhBC !== null && nd?.coSo > 0 && bc.chenhBC !== nd.tong && (
        <p className="text-[12.5px] text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 flex gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-700" />
          <span>Nhu cầu tính được chênh <b>{coDau(bc.chenhBC)}</b> so với biên chế giao, còn đơn vị đề nghị điều chỉnh <b>{coDau(nd.tong)}</b> — khác nhau là bình thường nếu đơn vị đã tính các giải pháp tự sắp xếp (điều chuyển, kiêm nhiệm, dùng chung nhân lực); nên ghi rõ ở cột H "Nguồn/giải trình" của D2.</span>
        </p>
      )}
      <p className="text-[11.5px] text-slate-500 px-1">
        Theo bộ biểu: nhu cầu nhân lực <b>không tự động làm tăng tổng biên chế</b>. Số chính thức là cột G "Đề nghị điều chỉnh" của D2 — ghi sau khi đã tính các giải pháp tự sắp xếp và phải được thẩm định. Người quy đổi PP2 không phải biên chế.
      </p>
    </section>
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

      <BienCheNhanLuc doc={doc} kq={kq} onMoBieu={onMoBieu} />

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
            {doc.capNhat && <p className="text-[12px] text-slate-500">Lưu lần cuối: <b className="text-slate-700">{new Date(doc.capNhat).toLocaleString('vi-VN')}</b>{doc.nguoiCapNhat ? <> bởi <b className="text-slate-700">{doc.nguoiCapNhat}</b></> : ''}.</p>}
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
            <li><b>Ô mã liên kết</b> (Mã nhiệm vụ, Mã VTVL, Mã công việc, Mã SP…): bấm vào ô để <b>chọn từ danh sách mã đã có</b> ở biểu nguồn, kèm tên — gõ để lọc, ↑ ↓ Enter để chọn. Mã hiện màu xanh có biểu tượng liên kết là bấm được để mở đúng dòng nguồn; nút <b>Quay lại</b> đưa về dòng đang nhập.</li>
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

// ─── Tab Báo cáo kết quả kê khai ────────────────────────────────────────────
const mauBuoc = (t) => (t === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : t === 'Còn tồn tại' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200');
const soBC = (v, k = 4) => (v === null || v === undefined || v === '' ? '—' : typeof v === 'number' ? v.toLocaleString('vi-VN', { maximumFractionDigits: k }) : v);

function BangBC({ dau, dong, tong, canPhai = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] border-collapse">
        <thead><tr className="bg-slate-100 text-slate-700">{dau.map((h) => <th key={h} className="border border-slate-200 px-2.5 py-2 text-left font-semibold align-bottom">{h}</th>)}</tr></thead>
        <tbody>
          {dong.length === 0 && <tr><td colSpan={dau.length} className="border border-slate-200 px-3 py-4 text-center text-slate-400 italic">(chưa có dữ liệu)</td></tr>}
          {dong.map((r, i) => (
            <tr key={i} className="align-top">{r.map((v, j) => <td key={j} className={`border border-slate-200 px-2.5 py-1.5 ${canPhai.includes(j) || typeof v === 'number' ? 'text-right tabular-nums' : ''}`}>{typeof v === 'object' && v !== null && !Array.isArray(v) && v.$$typeof ? v : soBC(v)}</td>)}</tr>
          ))}
          {tong && <tr className="bg-slate-50 font-bold">{tong.map((v, j) => <td key={j} className={`border border-slate-200 px-2.5 py-1.5 ${typeof v === 'number' ? 'text-right tabular-nums' : ''}`}>{v === '' ? '' : soBC(v)}</td>)}</tr>}
        </tbody>
      </table>
    </div>
  );
}

function BaoCaoTab({ doc, onTab }) {
  const bc = useMemo(() => lapBaoCao(doc), [doc]);
  const [dangXuat, setDangXuat] = useState(false);
  const tt = bc.thongTin;
  const kl = bc.khoiLuong;
  const taiWord = async () => {
    setDangXuat(true);
    try { const m = await import('./lib/exporters'); await m.exportBaoCaoVTVL(bc); } finally { setDangXuat(false); }
  };
  const Muc = ({ so, ten, children }) => (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 print:border-0 print:p-0 print:rounded-none break-inside-avoid-page">
      <h3 className="font-extrabold text-slate-800 mb-3">{so}. {ten}</h3>{children}
    </section>
  );
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4 flex-wrap print:border-0 print:p-0">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Báo cáo kết quả kê khai</p>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Kết quả kê khai bộ biểu xác định vị trí việc làm và nhu cầu nhân lực</h2>
          <p className="text-[12.5px] text-slate-500 mt-1">{tt.donVi || '(chưa ghi cơ quan, đơn vị — điền ở tab Tổng quan)'} · kỳ {tt.ky || '(chưa ghi)'} · lập ngày {tt.ngayLap}</p>
          <p className={`mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-lg border ${bc.hoanThien ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
            {bc.hoanThien ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{bc.trangThai}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap print:hidden">
          <button onClick={taiWord} disabled={dangXuat} className={nutChinh}><FileDown className="w-4 h-4" /> {dangXuat ? 'Đang tạo…' : 'Tải báo cáo Word (.docx)'}</button>
          <button onClick={() => window.print()} className={nutPhu}><Printer className="w-4 h-4" /> In / lưu PDF</button>
          <button onClick={() => import('./lib/vtvlXuat').then((m) => m.xuatDuLieu(doc, tinhToan(doc)))} className={nutPhu}><Download className="w-4 h-4" /> Số liệu chi tiết (Excel)</button>
        </div>
      </div>
      {!bc.hoanThien && (
        <p className="text-[12.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 print:hidden">
          Báo cáo vẫn lập được khi chưa hoàn thiện (tệp Word ghi rõ <b>"DỰ THẢO — CHƯA HOÀN THIỆN"</b>). Xử lý các tồn tại ở mục VII hoặc tab <button onClick={() => onTab('kiemtra')} className="font-bold underline">Kiểm tra lỗi</button> rồi lập lại.
        </p>
      )}

      <Muc so="I" ten="Thông tin chung">
        <ul className="text-[13px] text-slate-700 space-y-1">
          <li><b>Cơ quan, đơn vị:</b> {tt.donVi || '(chưa ghi)'} · <b>Kỳ số liệu:</b> {tt.ky || '(chưa ghi)'}</li>
          <li><b>Căn cứ:</b> {tt.nguon}.</li>
          <li><b>Quỹ giờ quy đổi PP2</b> (chế độ phổ biến): {soBC(tt.quyGio)} giờ/người/năm = (261 − 11 − 12) × 8.</li>
        </ul>
      </Muc>

      <Muc so="II" ten="Tình trạng kê khai theo 8 bước">
        <BangBC dau={['Bước', 'Nội dung', 'Biểu', 'Số dòng', 'Đạt', 'Chưa đạt', 'Lỗi', 'Cảnh báo', 'Tình trạng']}
          dong={bc.buoc.map((b) => [b.buoc, b.ten, b.bieu, b.soDong, b.dat, b.chuaDat, b.loi, b.canh,
            <span key="t" className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${mauBuoc(b.trangThai)}`}>{b.trangThai}</span>])} />
      </Muc>

      <Muc so="III" ten="Khối lượng công việc và tác động (B1, B2)">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12.5px]">
          {[['Giờ B1 được tính', kl.gioB1, `${kl.dongB1Dat}/${kl.soDongB1} dòng B1 đạt`],
            ['Giảm do số hóa, cải tiến', kl.gioGiamSoHoa, 'giờ/năm'],
            ['Giảm do thuê DV, tự chủ, XHH', kl.gioGiamKhac, 'giờ/năm'],
            ['Công việc mới phát sinh', kl.gioMoi, `${kl.dongB2CTDat}/${kl.soDongB2CT} dòng B2_CT đạt`],
            ['Tác động ròng B2', kl.gioTacDong, 'âm = giảm giờ'],
            ['Giờ ròng cần thiết', kl.gioRong, 'B1 + tác động B2'],
            ['Nhiệm vụ / công việc', `${kl.soNV} / ${kl.soCV}`, 'A1 / A2'],
            ['Người quy đổi PP2', bc.tong.nguoiQD, 'tham khảo — không phải biên chế']].map(([n, v, phu]) => (
            <div key={n} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-slate-500">{n}</p><p className="text-xl font-extrabold text-slate-800 tabular-nums">{soBC(v)}</p><p className="text-[11px] text-slate-400">{phu}</p>
            </div>
          ))}
        </div>
      </Muc>

      <Muc so="IV" ten="Nhu cầu nhân lực từng vị trí việc làm (C1, C3)">
        <BangBC dau={['Mã VTVL', 'Tên VTVL', 'Loại nhân lực', 'Phương pháp', 'Giờ B1', 'Tác động B2', 'Giờ ròng', 'Quỹ giờ', 'Người quy đổi PP2', 'Người PP1', 'Người PP3', 'Người cần bố trí', 'Kết quả kiểm tra']}
          dong={bc.vtvl.map((x) => [x.ma, x.ten, x.loaiNL, x.pp, x.gioB1, x.gioTD, x.gioRong, x.quyGio, x.nguoiQD, x.nguoiPP1, x.nguoiPP3, x.nguoiCan,
            <span key="m" className={`inline-block text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${x.dat ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>{x.canhBao}</span>])}
          tong={['', 'Cộng', '', '', '', '', '', '', bc.tong.nguoiQD, '', '', bc.tong.nguoiCan, '']} />
        <div className="mt-3">
          <p className="text-[12.5px] font-bold text-slate-700 mb-1.5">Tổng hợp theo loại nhân lực</p>
          <BangBC dau={['Loại nhân lực', 'Số VTVL', 'Người quy đổi PP2', 'Người cần bố trí', 'Số người hiện có (D1 đã xác nhận)']}
            dong={bc.theoLoai.map((o) => [o.loai, o.soVT, o.nguoiQD, o.nguoiCan, o.soNguoi])}
            tong={['Cộng', bc.tong.soVT, bc.tong.nguoiQD, bc.tong.nguoiCan, bc.tong.soNguoiHienCo]} />
        </div>
      </Muc>

      <Muc so="V" ten="Đối chiếu với nguồn lực hiện có (D1) — tham khảo">
        <p className="text-[12px] text-slate-500 mb-2">Chỉ so sánh cùng đơn vị tính; nguồn lực hiện có chỉ tính bản ghi D1 đã xác nhận{bc.tong.d1BoQua ? ` (${bc.tong.d1BoQua} bản ghi chưa xác nhận không được tính)` : ''}. Chênh lệch dương = cần thêm, âm = nhiều hơn nhu cầu.</p>
        <BangBC dau={['Mã VTVL', 'Tên VTVL', 'Người cần bố trí (C3)', 'Số người hiện có (D1)', 'Chênh lệch (người)', 'Người quy đổi PP2', 'Quy đổi hiện có', 'Chênh lệch (quy đổi)']}
          dong={bc.vtvl.map((x) => [x.ma, x.ten, x.nguoiCan, x.hienCo.soNguoi, x.chenhNguoi, x.nguoiQD, x.hienCo.quyDoi, x.chenhQD])} />
      </Muc>

      <Muc so="VI" ten="Phương án bố trí giai đoạn 2027–2031 (D2)">
        <BangBC dau={['Năm', 'Số dòng', 'Người cần bố trí', 'Người có thể bố trí', 'Biên chế được giao', 'Đề nghị điều chỉnh', 'Đã thẩm định/quyết định']}
          dong={bc.phuongAn.nam.map((y) => { const t = bc.phuongAn.tongNam[y]; return [String(y), t.soDong, t.C, t.D, t.E, t.G, `${t.daXong}/${t.soDong}`]; })} />
      </Muc>

      <Muc so="VII" ten="Nhận xét và tồn tại">
        <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-slate-700">{bc.nhanXet.map((t) => <li key={t}>{t}</li>)}</ul>
        {bc.tonTai.length > 0 && (
          <div className="mt-3">
            <p className="text-[12.5px] font-bold text-slate-700 mb-1.5">Tồn tại cần xử lý ({bc.tongLoi} lỗi · {bc.tongCanh} cảnh báo){bc.tonTai.length > 50 ? ' — 50 mục đầu' : ''}</p>
            <BangBC dau={['Biểu', 'Dòng', 'Mã của dòng', 'Cột', 'Mức', 'Nội dung']}
              dong={bc.tonTai.slice(0, 50).map((x) => [x.bieu, x.dong, x.maDong, x.cot, x.muc === 'loi' ? 'Lỗi' : 'Cảnh báo', x.chu])} />
          </div>
        )}
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
          <p className="text-[12px] font-bold text-slate-600 mb-1">Lưu ý khi sử dụng kết quả</p>
          <ul className="list-disc pl-5 space-y-0.5 text-[12px] text-slate-500 italic">{bc.luuY.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </Muc>
    </div>
  );
}

// ─── Chọn / tạo bộ biểu của đơn vị ──────────────────────────────────────────
//  Mỗi đơn vị một bộ biểu. Bản của cơ quan tỉnh là bản MẶC ĐỊNH khi mở phân hệ;
//  cán bộ HĐND xã, phường tự tạo bộ biểu của xã mình bằng cách gõ tên đơn vị
//  (không cần tài khoản). Xem đầu api/vtvl.js để biết vì sao phải có mã sửa.
function ChonDonVi({ ds, slug, ten, coQuyenGhi, daDangNhap, coMa, dangTao, dangNap, onChon, onTao, onNhapMa, onBoMa }) {
  const [tenMoi, setTenMoi] = useState('');
  const [moTao, setMoTao] = useState(false);
  const [moMa, setMoMa] = useState(false);
  const [maGo, setMaGo] = useState('');
  const kt = useMemo(() => (tenMoi.trim() ? kiemTraTen(tenMoi) : null), [tenMoi]);
  const daCo = kt?.ok && ds.some((x) => x.slug === kt.slug);
  // Danh sách nạp lại từ máy chủ là việc KHÔNG đồng bộ, nên ngay sau khi tạo một
  // đơn vị mới thì mục của nó có thể chưa có trong `ds`. Thiếu mục khớp thì ô chọn
  // hiển thị sai nhãn, vì vậy tự bổ sung mục của đơn vị đang mở.
  const dsHien = useMemo(() => (slug && !ds.some((x) => x.slug === slug)
    ? [...ds, { id: `vtvl_dv_${slug}`, slug, tinh: false, ten: ten || slug, nguoi: '', capNhat: '', soDong: 0, soVT: 0 }]
    : ds), [ds, slug, ten]);
  const hienTai = dsHien.find((x) => x.slug === slug);

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-3 pl-5 sm:p-4 sm:pl-6 space-y-3 shadow-md shadow-sky-100">
      {/* Vạch nhấn bên trái — khối này quyết định đang nhập cho đơn vị nào nên phải nổi nhất trang. */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-sky-500 to-indigo-600" />
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <label htmlFor="vtvl-chon-don-vi" className="flex items-center gap-1.5 text-[11.5px] font-extrabold text-sky-800 uppercase tracking-wider mb-1.5">
            <Building2 className="w-4 h-4" /> Bộ biểu của đơn vị
          </label>
          <div className="relative">
            <select id="vtvl-chon-don-vi" value={slug} onChange={(e) => { if (e.target.value === '+') { setMoTao(true); return; } setMoTao(false); onChon(e.target.value); }}
              className="w-full appearance-none cursor-pointer rounded-xl border-2 border-sky-400 bg-white pl-3.5 pr-14 py-2.5 text-[15px] font-bold text-slate-800 shadow-sm outline-none transition hover:border-sky-500 focus:border-sky-600 focus:ring-4 focus:ring-sky-200">
              {dsHien.map((x) => (
                <option key={x.id} value={x.slug}>
                  {x.ten}{x.tinh ? ' — bản mặc định của cơ quan tỉnh' : ''}{x.soVT ? ` · ${x.soVT} VTVL` : x.soDong ? ` · ${x.soDong} dòng` : ' · chưa có dữ liệu'}
                </option>
              ))}
              <option value="+">+ Tạo bộ biểu cho HĐND xã, phường…</option>
            </select>
            {/* Mũi tên mặc định của trình duyệt quá nhỏ, dễ bị bỏ qua — thay bằng nút vuông nổi màu. */}
            <span aria-hidden className="pointer-events-none absolute inset-y-1.5 right-1.5 w-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow">
              <ChevronDown className="w-5 h-5" />
            </span>
          </div>
        </div>
        <div className="text-[12px] text-slate-600 min-w-[200px] rounded-lg bg-white/80 border border-sky-200 px-3 py-2">
          {dangNap
            ? <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải dữ liệu của đơn vị…</span>
            : hienTai?.capNhat
              ? <>Cập nhật <b className="text-slate-800">{new Date(hienTai.capNhat).toLocaleString('vi-VN')}</b>{hienTai.nguoi ? <> · do <b className="text-slate-800">{hienTai.nguoi}</b> nhập</> : null}</>
              : <>Đơn vị này chưa có dữ liệu được lưu.</>}
        </div>
        {!moTao && (
          <button onClick={() => setMoTao(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-md shadow-emerald-200 ring-2 ring-white transition">
            <Plus className="w-4 h-4" /> Tạo bộ biểu đơn vị mới
          </button>
        )}
      </div>

      {/* Bản của tỉnh: chỉ người đăng nhập sửa được — nói rõ để khách không tưởng là lỗi. */}
      {!slug && !coQuyenGhi && (
        <p className="text-[12.5px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          Đây là bộ biểu của <b>Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</b> — chỉ cán bộ Văn phòng đã đăng nhập mới sửa được.
          Nếu bạn là cán bộ HĐND xã, phường, hãy bấm <b>Tạo bộ biểu đơn vị mới</b> để kê khai bộ biểu của xã mình (không cần tài khoản).
        </p>
      )}

      {/* Đang xem bộ biểu của một xã nhưng máy này không có mã sửa */}
      {slug && !coQuyenGhi && (
        <div className="text-[12.5px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 space-y-2">
          <p>Bạn đang <b>xem</b> bộ biểu của <b>{ten || hienTai?.ten}</b>. Máy này không có <b>mã sửa</b> của đơn vị đó nên không nhập liệu được.</p>
          {!moMa
            ? <button onClick={() => setMoMa(true)} className={nutPhu}>Tôi có mã sửa của đơn vị này</button>
            : (
              <div className="flex items-end gap-2 flex-wrap">
                <input value={maGo} onChange={(e) => setMaGo(e.target.value.toUpperCase())} placeholder="VD: 7KQM2PTR" maxLength={12}
                  className={`${inp} font-mono tracking-widest max-w-[180px]`} />
                <button onClick={() => { const r = kiemTraMaSua(maGo); if (r.ok) { onNhapMa(r.ma); setMoMa(false); setMaGo(''); } else onNhapMa('', r.loi); }} className={nutPhu}>Dùng mã này</button>
                <span className="text-[11.5px] text-amber-800">Mã gồm 8 ký tự, hiện ra lúc đơn vị tạo bộ biểu.</span>
              </div>
            )}
        </div>
      )}

      {/* Đã có mã sửa trên máy này */}
      {slug && coMa && coQuyenGhi && !daDangNhap && (
        <p className="text-[12.5px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2 flex-wrap">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">Máy này có mã sửa của <b>{ten || hienTai?.ten}</b> nên bạn nhập liệu được. Nhập xong nhớ bấm <b>Lưu lên hệ thống</b>.</span>
          <button onClick={onBoMa} className="underline font-semibold">Quên mã trên máy này</button>
        </p>
      )}

      {moTao && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 space-y-2">
          <p className="text-[13px] font-bold text-sky-900">Tạo bộ biểu cho HĐND xã, phường</p>
          <p className="text-[12px] text-sky-800">
            Gõ đầy đủ tên đơn vị — tên này là nhãn của cả bộ biểu nên hãy ghi đúng ngay từ đầu. Ví dụ: <i>HĐND xã Quảng Yên</i>, <i>HĐND phường Hạc Thành</i>.
          </p>
          <div className="flex items-end gap-2 flex-wrap">
            <input value={tenMoi} onChange={(e) => setTenMoi(e.target.value)} maxLength={MAX_TEN}
              placeholder="HĐND xã …" className={`${inp} flex-1 min-w-[260px]`} />
            <button disabled={!kt?.ok || daCo || dangTao} onClick={() => { onTao(kt.ten); setMoTao(false); setTenMoi(''); }} className={nutChinh}>
              {dangTao ? 'Đang tạo…' : 'Tạo và bắt đầu nhập'}
            </button>
            <button onClick={() => { setMoTao(false); setTenMoi(''); }} className={nutPhu}>Thôi</button>
          </div>
          {kt && !kt.ok && <p className="text-[12px] text-rose-700">{kt.loi}</p>}
          {daCo && <p className="text-[12px] text-amber-800">Đơn vị này đã có bộ biểu trong hệ thống. Hãy chọn đơn vị đó ở hộp trên — nếu máy này có mã sửa thì nhập tiếp được.</p>}
          {kt?.ok && !daCo && <p className="text-[12px] text-sky-800">Mã đơn vị sẽ là <code className="font-mono">{kt.slug}</code>. Sau khi tạo, hệ thống cấp một <b>mã sửa</b> — hãy ghi lại.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Thành phần chính ───────────────────────────────────────────────────────
export default function VTVL({ onHome }) {
  // Đơn vị đang mở: '' = bộ biểu của cơ quan tỉnh (bản MẶC ĐỊNH khi mở phân hệ).
  // Nhớ lựa chọn gần nhất để cán bộ xã quay lại không phải chọn lại.
  const [slug, setSlug] = useState(slugDaChon);
  const [dsDV, setDsDV] = useState(() => [{ id: 'vtvl_data', slug: '', tinh: true, ten: TEN_TINH, nguoi: '', capNhat: '', soDong: 0, soVT: 0 }]);
  const [tenDV, setTenDV] = useState('');
  const [maSua, setMaSua] = useState('');
  const [maMoi, setMaMoi] = useState('');   // mã sửa vừa cấp cho đơn vị mới tạo
  const [dangTao, setDangTao] = useState(false);
  const [doc, setDoc] = useState(() => readVTVL(slugDaChon()).doc);
  const [ts, setTs] = useState(() => readVTVL(slugDaChon()).ts);
  const [chuaLuu, setChuaLuu] = useState(() => readVTVL(slugDaChon()).chuaLuu);
  const [daNap, setDaNap] = useState(false);
  const [phien, setPhien] = useState(null);
  const [tab, setTab] = useState('tongquan');
  const [bieuId, setBieuId] = useState('A1');
  const [formId, setFormId] = useState(null);
  const [dan, setDan] = useState(false);
  const [diToi, setDiToi] = useState(null);
  const [quayLai, setQuayLai] = useState(null); // chỗ xuất phát khi đi theo liên kết mã
  const [nhapTep, setNhapTep] = useState({ cheDo: 'thay', boQuaLoi: true });
  const [luu, setLuu] = useState({ k: '' }); // '', 'dang', 'ok', 'loi', 'xungdot'
  const [banNhap, setBanNhap] = useState(null); // bản máy chủ khi máy này còn bản nháp chưa lưu
  const [thongBao, setThongBao] = useState(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  const daDangNhap = !!phien && phien.user?.email !== GUEST.email;
  const laTinhDV = !slug;
  // Ai được nhập liệu:
  //  • bộ biểu của TỈNH  → chỉ cán bộ Văn phòng đã đăng nhập;
  //  • bộ biểu của XÃ    → người đã đăng nhập (để Văn phòng gỡ rối cho xã) hoặc
  //    máy có MÃ SỬA của đơn vị đó. Xem đầu api/vtvl.js để biết vì sao cần mã.
  const coQuyenGhi = laTinhDV ? daDangNhap : (daDangNhap || !!maSua);
  const docOnly = !coQuyenGhi;
  // Bản của tỉnh tự lưu như trước. Bản của xã đi qua hàm máy chủ có đếm hạn mức nên
  // KHÔNG tự lưu theo nhịp 1,5 giây — người dùng bấm "Lưu lên hệ thống" thì mới ghi.
  const tuLuu = laTinhDV && daDangNhap;
  const bao = useCallback((kieu, chu) => { setThongBao({ kieu, chu }); setTimeout(() => setThongBao(null), 6000); }, []);
  const napDanhSach = useCallback(() => { fetchDanhSachDV().then(setDsDV); }, []);

  useEffect(() => {
    const off = onAuthChange((s) => setPhien(s || null));
    napDanhSach();
    return () => { off && off(); };
  }, [napDanhSach]);

  // Nạp bộ biểu của đơn vị đang chọn (chạy lại mỗi lần đổi đơn vị).
  useEffect(() => {
    let alive = true;
    setDaNap(false); setBanNhap(null); setLuu({ k: '' });
    const local = readVTVL(slug);
    setDoc(local.doc); setTs(local.ts); setChuaLuu(local.chuaLuu);
    setMaSua(maSuaCua(slug));
    Promise.all([getSession(), fetchVTVL(slug)]).then(([s, r]) => {
      if (!alive) return;
      setPhien(s || null);
      setDaNap(true);
      if (!r) return; // không đọc được máy chủ → giữ bản cache
      if (r.ten) setTenDV(r.ten);
      const dn = !!s && s.user?.email !== GUEST.email;
      const ghiDuoc = slug ? (dn || !!maSuaCua(slug)) : dn;
      if (local.chuaLuu && JSON.stringify(local.doc.bieu) !== JSON.stringify(r.doc.bieu)) {
        // Máy này còn bản nháp chưa lưu: người ghi được thì được hỏi giữ bản nào;
        // người CHỈ XEM luôn thấy bản trên máy chủ (bản nháp vẫn để nguyên, không ghi đè).
        if (ghiDuoc) { setBanNhap(r); setTs(r.ts); return; }
        setDoc(r.doc); setTs(r.ts); setChuaLuu(false);
        return;
      }
      setDoc(r.doc); setTs(r.ts); setChuaLuu(false); cacheVTVL(slug, r.doc, r.ts, false);
    });
    return () => { alive = false; };
  }, [slug]);

  const kq = useMemo(() => tinhToan(doc), [doc]);
  const vanDe = useMemo(() => kiemTraDuLieu(doc, kq), [doc, kq]);
  const kb = useMemo(() => kichThuocKB(doc), [doc]);

  const email = phien?.user?.email || '';

  /** Ghi bản đang có lên máy chủ. Trả về kết quả để nơi gọi báo cho người dùng. */
  const ghiLenMayChu = useCallback(async () => {
    const dangGhi = docRef.current;
    const r = slug
      ? await luuDonVi({ ten: tenDV || dangGhi.donVi || slug, slug, doc: dangGhi, tsCu: ts, maSua, nguoi: email || 'khách' })
      : await saveVTVL(dangGhi, ts, email);
    if (r.ok) {
      setTs(r.ts);
      // Người dùng sửa tiếp trong lúc đang lưu thì vẫn còn thay đổi chưa lưu.
      if (docRef.current === dangGhi) { setChuaLuu(false); cacheVTVL(slug, r.doc, r.ts, false); } else cacheVTVL(slug, docRef.current, r.ts, true);
      setDoc((d) => (d === dangGhi ? r.doc : { ...d, capNhat: r.doc.capNhat, nguoiCapNhat: r.doc.nguoiCapNhat }));
      setLuu({ k: 'ok', luc: new Date() });
      napDanhSach();
    } else if (r.xungDot) setLuu({ k: 'xungdot' });
    else setLuu({ k: 'loi', chu: r.loi });
    return r;
  }, [slug, tenDV, ts, maSua, email, napDanhSach]);

  // Tự lưu 1,5 giây sau lần sửa cuối — CHỈ cho bản của tỉnh (xem `tuLuu`).
  useEffect(() => {
    if (!chuaLuu || !tuLuu || banNhap || luu.k === 'xungdot' || luu.k === 'dang') return;
    const h = setTimeout(() => { setLuu({ k: 'dang' }); ghiLenMayChu(); }, 1500);
    return () => clearTimeout(h);
  }, [doc, chuaLuu, tuLuu, banNhap, luu.k, ghiLenMayChu]);

  const luuTay = async () => {
    if (luu.k === 'dang') return;
    setLuu({ k: 'dang' });
    const r = await ghiLenMayChu();
    if (r.ok) bao('ok', `Đã lưu bộ biểu của ${slug ? (tenDV || 'đơn vị') : 'cơ quan tỉnh'} lên hệ thống.`);
    else if (!r.xungDot) bao('loi', r.loi || 'Chưa lưu được lên hệ thống.');
  };

  const datDoc = (moi) => {
    setDoc(moi); setChuaLuu(true);
    if (!cacheVTVL(slug, moi, ts, true)) bao('canh', 'Trình duyệt hết chỗ lưu bản nháp (dữ liệu quá lớn) — hãy lưu lên hệ thống ngay.');
    if (luu.k === 'loi' || luu.k === 'ok') setLuu({ k: '' });
  };

  // ── Chọn / tạo đơn vị ────────────────────────────────────────────────────
  const chonDonVi = (s) => {
    if (s === slug) return;
    if (chuaLuu && coQuyenGhi && !window.confirm('Bộ biểu đang mở còn thay đổi CHƯA LƯU lên hệ thống. Vẫn chuyển sang đơn vị khác? (Bản nháp vẫn giữ trên máy này.)')) return;
    setMaMoi(''); setTenDV(''); nhoSlug(s); setSlug(s);
    setTab('tongquan'); setFormId(null); setQuayLai(null);
  };

  const taoDonVi = async (ten) => {
    const s = slugDonVi(ten);
    setDangTao(true);
    // Tạo = ghi ngay một bộ biểu rỗng lên máy chủ, vì chính lượt ghi đó mới cấp MÃ SỬA.
    const r = await luuDonVi({ ten, slug: s, doc: docMoiChoDonVi(ten), tsCu: null, nguoi: email || 'khách' });
    setDangTao(false);
    if (!r.ok) {
      bao('loi', r.xungDot
        ? 'Đơn vị này vừa được người khác tạo xong. Hãy chọn đơn vị đó trong hộp chọn ở trên.'
        : (r.loi || 'Chưa tạo được bộ biểu cho đơn vị.'));
      napDanhSach();
      return;
    }
    cacheVTVL(s, r.doc, r.ts, false);
    nhoSlug(s); setTenDV(r.ten); setSlug(s);
    setMaMoi(r.maSua || '');
    napDanhSach();
    bao('ok', `Đã tạo bộ biểu cho ${r.ten}. Hãy ghi lại mã sửa.`);
  };

  const dungMaSua = (ma, loi) => {
    if (!ma) { bao('loi', loi || 'Mã sửa không hợp lệ.'); return; }
    nhoMaSua(slug, ma); setMaSua(ma);
    bao('ok', 'Đã nhận mã sửa — bạn nhập liệu được cho đơn vị này. Nhập xong nhớ bấm Lưu lên hệ thống.');
  };
  const boMaSua = () => {
    if (!window.confirm('Xóa mã sửa khỏi máy này? Bạn sẽ chỉ còn XEM được bộ biểu của đơn vị này cho tới khi nhập lại mã.')) return;
    xoaMaSua(slug); setMaSua('');
  };
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
  // Đi theo liên kết mã (vd A2!C "VT1" → dòng VT1 ở C1); nhớ chỗ xuất phát để "Quay lại".
  const moMa = (refId, ma, tu) => {
    const dich = ma ? timDongTheoMa(doc, refId, ma) : null;
    if (tu) {
      const b0 = BIEU_THEO_ID[tu.bieu];
      const r0 = (doc.bieu[tu.bieu] || []).find((x) => x._id === tu.id);
      const k0 = cotKhoa(b0);
      setQuayLai({ ...tu, ma: r0 && k0 && !rong(r0[k0.k]) ? r0[k0.k] : '' });
    }
    setFormId(null);
    if (dich) diToiO(refId, dich); else { setBieuId(refId); setTab('nhap'); }
  };
  const veLai = () => { if (!quayLai) return; const q = quayLai; setQuayLai(null); if (q.id && q.id.startsWith('b2-')) { setBieuId(q.bieu); setTab('nhap'); } else diToiO(q.bieu, q.id); };
  const taiLaiMayChu = async () => {
    const r = await fetchVTVL(slug);
    if (!r) { bao('loi', 'Không tải được bản trên máy chủ.'); return; }
    setDoc(r.doc); setTs(r.ts); setChuaLuu(false); cacheVTVL(slug, r.doc, r.ts, false); setLuu({ k: '' }); setBanNhap(null);
    bao('ok', 'Đã tải bản mới nhất trên máy chủ.');
  };
  const ghiDe = async () => {
    const r = await fetchVTVL(slug);
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
      <header className="bg-gradient-to-br from-[#082f49] via-[#0c4a6e] to-[#0369a1] text-white print:hidden">
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
            {coQuyenGhi && !tuLuu && (
              <button onClick={luuTay} disabled={luu.k === 'dang' || !chuaLuu}
                className={`text-[11.5px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${chuaLuu ? 'bg-amber-300 text-amber-950 hover:bg-amber-200' : 'bg-white/15 border border-white/25 text-white/80'} disabled:cursor-default`}>
                <Save className="w-3.5 h-3.5" /> {luu.k === 'dang' ? 'Đang lưu…' : chuaLuu ? 'Lưu lên hệ thống' : 'Đã lưu'}
              </button>
            )}
            <span className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${coQuyenGhi ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-50' : 'bg-amber-400/20 border-amber-200/30 text-amber-50'}`}>
              {daDangNhap ? 'Đã đăng nhập · nhập liệu được' : coQuyenGhi ? 'Có mã sửa · nhập liệu được' : 'Khách · xem và kiểm tra tệp'}
            </span>
            {!daDangNhap && <a href="#/okr?login=1" className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white text-sky-900 inline-flex items-center gap-1.5"><LogIn className="w-3.5 h-3.5" /> Đăng nhập</a>}
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
        {/* Mã sửa vừa cấp — hiện NỔI BẬT vì mất mã thì chỉ còn xem được. */}
        {maMoi && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3.5 space-y-2">
            <p className="text-[14px] font-extrabold text-emerald-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Đã tạo bộ biểu cho {tenDV}</p>
            <p className="text-[13px] text-emerald-900">Hãy <b>ghi lại mã sửa</b> dưới đây. Máy này đã tự nhớ mã nên bạn nhập tiếp được ngay; nhưng muốn nhập từ <b>máy khác</b> — hoặc máy này bị xóa dữ liệu duyệt web — thì phải gõ lại mã.</p>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="font-mono text-2xl font-extrabold tracking-[0.3em] bg-white border-2 border-emerald-300 rounded-xl px-4 py-2 text-emerald-900">{maMoi}</code>
              <button onClick={() => { navigator.clipboard?.writeText(maMoi); bao('ok', 'Đã sao chép mã sửa.'); }} className={nutPhu}><Copy className="w-3.5 h-3.5" /> Sao chép mã</button>
              <button onClick={() => setMaMoi('')} className={nutPhu}>Tôi đã ghi lại — ẩn đi</button>
            </div>
            <p className="text-[12px] text-emerald-800">Mã này chỉ để các đơn vị không ghi đè lên nhau, <b>không phải mật khẩu bảo vệ dữ liệu</b> — bộ biểu vốn không chứa thông tin cá nhân. Mất mã thì liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh.</p>
          </div>
        )}

        {/* Khối chọn đơn vị LUÔN hiện — kể cả lúc đang tải: ẩn đi thì người dùng không
            còn thấy mình đang ở đơn vị nào và cũng không đổi sang đơn vị khác được. */}
        <ChonDonVi ds={dsDV} slug={slug} ten={tenDV} coQuyenGhi={coQuyenGhi} daDangNhap={daDangNhap}
          coMa={!!maSua} dangTao={dangTao} dangNap={!daNap} onChon={chonDonVi} onTao={taoDonVi} onNhapMa={dungMaSua} onBoMa={boMaSua} />

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
            <span className="flex-1">
              {doc.capNhat
                ? <>Chế độ xem: đang xem dữ liệu <b>{doc.nguoiCapNhat ? `do ${doc.nguoiCapNhat} nhập` : 'đã lưu trên hệ thống'}</b>, cập nhật lúc <b>{new Date(doc.capNhat).toLocaleString('vi-VN')}</b>. </>
                : <>Chế độ xem: đơn vị này chưa có dữ liệu bộ biểu nào được lưu. </>}
              Khách vẫn dùng được <button onClick={() => setTab('tep')} className="font-bold underline">Nhập từ tệp</button> để <b>kiểm tra lỗi tệp Excel</b>. Muốn <b>kê khai bộ biểu của HĐND xã, phường mình</b> thì bấm <b>Tạo bộ biểu đơn vị mới</b> ở trên — không cần tài khoản.
            </span>
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
                        <span className={`font-mono text-[10px] w-[4.25rem] shrink-0 truncate ${bieuId === x.id ? 'text-sky-100' : 'text-slate-400'}`}>{x.ma}</span>
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
              onNhanBan={(id) => nhanBan(b.id, id)} onXoaHet={() => xoaHet(b.id)} onMoForm={setFormId} onDan={() => setDan(true)}
              onMoMa={moMa} quayLai={quayLai && quayLai.bieu !== b.id ? quayLai : null} onQuayLai={veLai} />
          </div>
        )}

        {tab === 'tep' && <NhapTep trangThai={nhapTep} setTrangThai={setNhapTep} doc={doc} coQuyenGhi={coQuyenGhi} onApDung={apDung} onTaiMau={taiMau} />}
        {tab === 'kiemtra' && <KiemTraTab doc={doc} kq={kq} vanDe={vanDe} onDiToi={diToiO} />}
        {tab === 'baocao' && <BaoCaoTab doc={doc} onTab={setTab} />}
        {tab === 'huongdan' && <HuongDanTab />}

        <p className="text-center text-[11px] text-slate-400 pt-4">Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu. Không nhập họ tên, số định danh cá nhân vào bộ biểu (D1 dùng mã nguồn lực).</p>
      </main>

      {formId && tab === 'nhap' && (
        <FormDong b={b} doc={doc} kq={kq} vanDe={vanDe} id={formId} docOnly={docOnly} onDong={() => setFormId(null)} onDi={setFormId}
          onSua={(id, k, v) => suaO(b.id, id, k, v)} onXoa={(id) => xoaDong(b.id, id)} onNhanBan={(id) => nhanBan(b.id, id)} onMoMa={moMa} />
      )}
      {dan && <HopDan b={b} onDong={() => setDan(false)} onXong={danXong} />}
    </div>
  );
}
