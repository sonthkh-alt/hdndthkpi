// ============================================================================
//  PHÂN HỆ BỘ BIỂU VỊ TRÍ VIỆC LÀM — #/vtvl
//
//  Đường đi của người dùng, đúng ba việc:
//    1. NHẬP TỆP bộ biểu .xlsx của đơn vị (hoặc xem thử bằng bộ số mẫu)
//    2. ĐI TỪNG BƯỚC NHẬP SỐ — sản lượng → tác động → nhu cầu → nhân lực
//       hiện có → dự báo → phương án; mỗi bước xong bấm "Tiếp"
//    3. XUẤT TỆP: ghi số mới ngược vào chính tệp đã nhập
//
//  ⚠️ DỮ LIỆU CHỈ NẰM TRONG BỘ NHỚ. Không gọi máy chủ, không ghi localStorage:
//  tắt thẻ hoặc tải lại trang là mất, muốn giữ thì phải XUẤT TỆP. Có chặn
//  "rời trang khi còn thay đổi chưa xuất" để không mất oan.
//
//  ⚠️ A1 (nhiệm vụ), A2 (công việc), C1 (vị trí việc làm) và DANH MỤC SẢN PHẨM
//  là CỐ ĐỊNH, lấy từ tệp. Riêng danh mục sản phẩm CHỈ QUẢN TRỊ sửa được.
// ============================================================================
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet, Upload, Download, ArrowRight, ArrowLeft, Check, CircleAlert, Home,
  AlertTriangle, Info, RefreshCw, Table2, Lock, FlaskConical, ChevronRight, Save, Undo2, Search,
} from 'lucide-react';
import { BIEU_THEO_ID, cotNhap, QUY_GIO_PP2, DS } from './lib/vtvl/moHinh.js';
import { tinhToan, coDuLieu } from './lib/vtvl/tinh.js';
import { napTep } from './lib/vtvl/doc.js';
import { ghiLaiTep, xuatTepMoi, xuatSaoLuu, taiVe, tenTepXuat } from './lib/vtvl/ghi.js';
import { boSoMau, TEN_DON_VI_MAU } from './lib/vtvl/mau.js';
import { BUOC, BUOC_NHAP, nhomDong, nhanDong, tienDoBuoc, tienDoChung, laDat } from './lib/vtvl/buoc.js';
import { getSession, onAuthChange } from './lib/auth.js';

const nutChinh = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const nutPhu = 'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-50';
const theRong = 'bg-white rounded-2xl border border-slate-200 p-5';

const soVN = (v, le = 1) => (typeof v === 'number' && Number.isFinite(v)
  ? v.toLocaleString('vi-VN', { maximumFractionDigits: le }) : '—');
// Người quy đổi là MỘT TỶ LỆ (giờ ròng ÷ quỹ giờ), luôn hiện 2 chữ số thập phân:
// 4,9985 mà hiện thành "5" thì dễ đọc thành "5 người" — đây là mức tham khảo,
// không phải số biên chế.
const soNguoiQD = (v) => (typeof v === 'number' && Number.isFinite(v)
  ? v.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—');
const rong = (v) => v === '' || v === null || v === undefined;

/** Đọc số người dùng gõ: nhận cả "1.200" và "1,5" theo cách viết Việt Nam. */
function docSo(s) {
  const t = String(s).trim();
  if (t === '') return '';
  const n = Number(t.replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : s;
}

// ─── Ô nhập một con số, có hiện giá trị gốc để đối chiếu ────────────────────
function ONhapSo({ giaTri, goc, onDoi, chinh, donVi, khoa, id }) {
  const [chu, setChu] = useState(rong(giaTri) ? '' : String(giaTri));
  const dangGo = useRef(false);
  useEffect(() => { if (!dangGo.current) setChu(rong(giaTri) ? '' : String(giaTri)); }, [giaTri]);
  const doi = !rong(goc) && String(goc) !== String(giaTri) && !(rong(goc) && rong(giaTri));
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type="text" inputMode="decimal" disabled={khoa}
          value={chu}
          onFocus={() => { dangGo.current = true; }}
          onBlur={() => { dangGo.current = false; }}
          onChange={(e) => { setChu(e.target.value); onDoi(docSo(e.target.value)); }}
          className={`${chinh ? 'w-28 text-[15px] font-bold' : 'w-24 text-[13px]'} text-right px-2 py-1.5 rounded-lg border-2 tabular-nums
            ${khoa ? 'bg-slate-100 border-slate-200 text-slate-500'
            : doi ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
              : chinh ? 'border-sky-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100' : 'border-slate-200 focus:border-sky-500'} outline-none`}
        />
        {donVi && <span className="text-[11px] text-slate-400 w-10">{donVi}</span>}
      </div>
      {doi && <span className="text-[10.5px] text-slate-500 mt-0.5">gốc: {rong(goc) ? '(trống)' : soVN(Number(goc), 2)}</span>}
    </div>
  );
}

// ─── Thanh các bước ─────────────────────────────────────────────────────────
function ThanhBuoc({ buoc, doc, kq, onChon }) {
  const td = doc && kq ? Object.fromEntries(BUOC_NHAP.map((b) => [b.id, tienDoBuoc(doc, kq, b)])) : {};
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
      {BUOC.map((b, i) => {
        const dang = b.id === buoc;
        const t = td[b.id];
        const xong = t && t.chuaDat === 0 && t.tong > 0;
        const mo = b.id === 'nguon' || !!doc;
        return (
          <button
            key={b.id} onClick={() => mo && onChon(b.id)} disabled={!mo}
            className={`shrink-0 text-left px-3 py-2 rounded-xl border-2 transition-colors min-w-[9.5rem]
              ${dang ? 'border-sky-600 bg-sky-50' : mo ? 'border-slate-200 bg-white hover:border-sky-300' : 'border-slate-100 bg-slate-50 opacity-60'}`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold
                ${xong ? 'bg-emerald-600 text-white' : dang ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {xong ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className={`text-[12.5px] font-bold ${dang ? 'text-sky-800' : 'text-slate-700'}`}>{b.nhan || b.ten}</span>
            </div>
            {t && <p className="text-[10.5px] text-slate-500 mt-0.5 ml-6.5">{t.dat}/{t.tong} dòng đạt</p>}
          </button>
        );
      })}
    </div>
  );
}

// ─── Bước 1: chọn nguồn dữ liệu ─────────────────────────────────────────────
function BuocNguon({ onNap, onMau, dangDoc, loi, doc }) {
  const oTep = useRef(null);
  return (
    <div className="space-y-4">
      <section className="bg-gradient-to-br from-sky-50 to-white rounded-2xl border-2 border-sky-200 p-5">
        <h2 className="text-xl font-extrabold text-slate-800">Nhập tệp bộ biểu của đơn vị</h2>
        <p className="text-[13px] text-slate-600 mt-1">
          Chọn tệp <b>.xlsx</b> bộ biểu vị trí việc làm (bản đầy đủ của Ban Tổ chức Trung ương). Nhập xong, anh/chị
          đi lần lượt các bước để <b>sửa các con số</b>, rồi xuất lại thành tệp mới.
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onNap(e.dataTransfer.files?.[0]); }}
          className="mt-4 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-6 text-center"
        >
          {dangDoc ? (
            <>
              <RefreshCw className="w-7 h-7 mx-auto text-sky-600 animate-spin" />
              <p className="text-[13px] font-semibold text-slate-700 mt-2">Đang đọc {dangDoc.trang || 'tệp'}…</p>
              <div className="mt-2 h-2 max-w-sm mx-auto rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-sky-600 transition-all" style={{ width: `${Math.round((dangDoc.phan || 0) * 100)}%` }} />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-7 h-7 mx-auto text-sky-600" />
              <p className="text-[13px] font-semibold text-slate-700 mt-2">Kéo tệp vào đây, hoặc</p>
              <input ref={oTep} id="vtvl-chon-tep" type="file" accept=".xlsx,.xlsm,.json" className="hidden"
                onChange={(e) => { onNap(e.target.files?.[0]); e.target.value = ''; }} />
              <button onClick={() => oTep.current?.click()} className={`${nutChinh} mt-2`}>
                <FileSpreadsheet className="w-4 h-4" /> Chọn tệp bộ biểu
              </button>
            </>
          )}
        </div>

        {loi && (
          <p className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-[12.5px] text-rose-800 flex gap-1.5">
            <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" /><span>{loi}</span>
          </p>
        )}

        <p className="mt-3 text-[12.5px] text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 flex gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span><b>Dữ liệu chỉ nằm trong bộ nhớ của trình duyệt.</b> Phần mềm không gửi tệp đi đâu và không lưu lại —
            tải lại trang là mất. Sửa xong hãy <b>xuất tệp</b> ở bước cuối.</span>
        </p>
      </section>

      <section className={theRong}>
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-violet-600" /> Chưa có tệp? Xem thử bằng bộ số mẫu</h3>
        <p className="text-[12.5px] text-slate-500 mt-1 mb-3">
          Bộ số mẫu là <b>dữ liệu giả</b> của &laquo;{TEN_DON_VI_MAU}&raquo; (04 vị trí việc làm · 18 công việc) để xem
          các bước chạy thế nào. Không phải số liệu của đơn vị nào.
        </p>
        <button onClick={onMau} className={nutPhu}><FlaskConical className="w-4 h-4" /> Mở bộ số mẫu</button>
      </section>

      {doc && (
        <section className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-5">
          <p className="text-[13px] font-bold text-emerald-900 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Đang làm việc với: {doc.donVi || doc.tenTep || '(không rõ đơn vị)'}
            {doc.laMau && <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[11px]">BỘ SỐ MẪU</span>}
          </p>
          <p className="text-[12.5px] text-emerald-800 mt-1">
            {coDuLieu(doc, 'C1').length} vị trí việc làm · {coDuLieu(doc, 'A2').length} công việc · {coDuLieu(doc, 'B1').length} dòng khối lượng
            {doc.ky ? ` · kỳ ${doc.ky}` : ''}
          </p>
        </section>
      )}
    </div>
  );
}

// ─── Bảng nhập số của một bước ──────────────────────────────────────────────
function BangNhapSo({ doc, docGoc, kq, buoc, onSuaO }) {
  const b = BIEU_THEO_ID[buoc.bieu];
  const [chiChuaDat, setChiChuaDat] = useState(false);
  const [tim, setTim] = useState('');
  const [iNhom, setINhom] = useState(0);
  const nhom = useMemo(() => nhomDong(doc, kq, buoc), [doc, kq, buoc]);
  useEffect(() => { setINhom(0); }, [buoc.id]);
  const n = nhom[Math.min(iNhom, nhom.length - 1)];
  if (!n) {
    return <p className="text-[13px] text-slate-500">Bộ biểu không có dòng nào ở biểu {b?.ten}.</p>;
  }
  const cotNhapCua = cotNhap(buoc.bieu).filter((c) => buoc.nhap.includes(c.k));
  const cotHien = (b?.cot || []).filter((c) => buoc.hien?.includes(c.k));
  const ten = (k) => (b?.cot || []).find((c) => c.k === k)?.ten || k;

  const loc = n.dong.filter((x) => {
    if (chiChuaDat && laDat(buoc, x.kq[buoc.canhBao])) return false;
    if (!tim.trim()) return true;
    const nh = nhanDong(doc, buoc, x.dong, x.kq);
    return `${nh.ma} ${nh.ten} ${nh.phu}`.toLowerCase().includes(tim.trim().toLowerCase());
  });

  return (
    <div className="space-y-3">
      {nhom.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Vị trí việc làm</span>
          {nhom.map((x, i) => (
            <button key={x.khoa} onClick={() => setINhom(i)}
              className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border-2 transition-colors
                ${i === iNhom ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'}`}>
              {x.khoa}
              <span className={`ml-1.5 ${x.soChuaDat ? 'text-amber-700' : 'text-emerald-700'}`}>
                {x.soChuaDat ? `· ${x.soChuaDat} chưa đạt` : '· đủ'}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[15px] font-extrabold text-slate-800">{n.ten}</p>
          {n.moTa && <p className="text-[12px] text-slate-500">{n.moTa}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tên, mã…"
              className="pl-8 pr-2 py-1.5 text-[12.5px] rounded-lg border border-slate-200 focus:border-sky-500 outline-none w-48" />
          </div>
          <label className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-600">
            <input type="checkbox" checked={chiChuaDat} onChange={(e) => setChiChuaDat(e.target.checked)} />
            Chỉ dòng chưa đạt
          </label>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-2 font-semibold">Dòng</th>
              {cotNhapCua.map((c) => <th key={c.k} className="py-2 px-2 font-semibold text-right whitespace-nowrap">{c.ten}</th>)}
              {cotHien.map((c) => <th key={c.k} className="py-2 px-2 font-semibold text-right whitespace-nowrap bg-slate-50">{c.ten}</th>)}
              <th className="py-2 pl-2 font-semibold">Kiểm tra</th>
            </tr>
          </thead>
          <tbody>
            {loc.map((x) => {
              const nh = nhanDong(doc, buoc, x.dong, x.kq);
              const cb = x.kq[buoc.canhBao];
              const dat = laDat(buoc, cb);
              const gocDong = (docGoc?.bieu?.[buoc.bieu] || []).find((g) => g._dongTep === x.dong._dongTep)
                || (docGoc?.bieu?.[buoc.bieu] || [])[x.i];
              return (
                <tr key={x.dong._id} className="border-b border-slate-100 align-top">
                  <td className="py-2.5 pr-2 max-w-[22rem]">
                    <p className="font-semibold text-slate-800 leading-snug">{nh.ten || nh.ma}</p>
                    <p className="text-[11px] text-slate-400">
                      {nh.ma}{nh.phu ? ` · ${nh.phu}` : ''}{nh.dvt ? ` · ĐVT: ${nh.dvt}` : ''}
                    </p>
                  </td>
                  {cotNhapCua.map((c) => (
                    <td key={c.k} className="py-2 px-2 text-right">
                      <ONhapSo
                        id={`o-${buoc.bieu}-${x.i}-${c.k}`}
                        giaTri={x.dong[c.k]} goc={gocDong?.[c.k]}
                        chinh={c.k === buoc.nhapChinh}
                        onDoi={(v) => onSuaO(buoc.bieu, x.i, c.k, v)}
                      />
                    </td>
                  ))}
                  {cotHien.map((c) => (
                    <td key={c.k} className="py-2 px-2 text-right tabular-nums bg-slate-50 text-slate-700 font-semibold">
                      {rong(x.kq[c.k]) ? <span className="text-slate-300">—</span> : soVN(x.kq[c.k], 2)}
                    </td>
                  ))}
                  <td className="py-2 pl-2">
                    {dat
                      ? <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><Check className="w-3.5 h-3.5" />{cb}</span>
                      : <span className="text-amber-800 font-semibold">{cb || '—'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {loc.length === 0 && <p className="text-[12.5px] text-slate-500">Không có dòng nào khớp.</p>}

      {/* Giải thích chỗ dễ hiểu sai nhất của biểu B1 */}
      {buoc.bieu === 'B1' && (
        <p className="text-[12px] text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex gap-1.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <span>
            Cột <b>{ten('P')}</b> là con số thật sự dùng để tính. Dòng nào đã có <b>định mức trong danh mục sản phẩm</b>
            {' '}và được xác nhận thì phần mềm lấy theo định mức đó, nên <b>sửa &laquo;{ten('D')}&raquo; sẽ KHÔNG làm đổi kết quả</b>
            {' '}— muốn đổi thì phải sửa định mức ở danh mục sản phẩm (chỉ quản trị). Con số của đơn vị cần điền là <b>{ten('C')}</b>.
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Khối kết quả đang chạy, hiện ở mọi bước ────────────────────────────────
function KhoiKetQua({ doc, kq }) {
  const t = kq.tongHop;
  const o = (nhan, giaTri, phu) => (
    <div className="bg-white rounded-xl border border-slate-200 px-3 py-2">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">{nhan}</p>
      <p className="text-[17px] font-extrabold text-slate-800 tabular-nums leading-tight">{giaTri}</p>
      {phu && <p className="text-[11px] text-slate-500">{phu}</p>}
    </div>
  );
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {o('Giờ B1 (dòng đạt)', soVN(t.gioB1), `${t.b1Dat}/${t.soDongB1} dòng đạt`)}
      {o('Giờ ròng sau tác động', soVN(t.gioRong), `giảm ${soVN(t.giamSoHoa + t.giamThue)} · việc mới ${soVN(t.vietMoi)}`)}
      {o('Người quy đổi PP2', soNguoiQD(t.nguoiQD), `tham khảo · quỹ giờ ${soVN(QUY_GIO_PP2, 0)} giờ/người/năm`)}
      {o('Người cần bố trí (C3)', soVN(t.nguoiCan, 0), `${coDuLieu(doc, 'C1').length} vị trí việc làm`)}
    </div>
  );
}

// ─── Bước cuối: kết quả và xuất tệp ─────────────────────────────────────────
function BuocXong({ doc, kq, tepGoc, soODoi, onXuat, dangXuat, ketQuaXuat, loiXuat }) {
  const td = tienDoChung(doc, kq);
  const conSot = td.filter((x) => x.chuaDat > 0);
  return (
    <div className="space-y-4">
      <section className={theRong}>
        <h3 className="font-extrabold text-slate-800 mb-3">Kết quả sau khi nhập số</h3>
        <KhoiKetQua doc={doc} kq={kq} />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-2 font-semibold">Vị trí việc làm</th>
                <th className="py-2 px-2 font-semibold text-right">Giờ B1</th>
                <th className="py-2 px-2 font-semibold text-right">Tác động B2</th>
                <th className="py-2 px-2 font-semibold text-right">Giờ ròng</th>
                <th className="py-2 px-2 font-semibold text-right">Người quy đổi</th>
                <th className="py-2 px-2 font-semibold text-right">Người cần bố trí</th>
                <th className="py-2 pl-2 font-semibold">Kiểm tra</th>
              </tr>
            </thead>
            <tbody>
              {(doc.bieu.C3 || []).map((r, i) => {
                const c = kq.C3[i] || {};
                const vt = (doc.bieu.C1 || []).find((x) => String(x.A).toLowerCase() === String(r.A).toLowerCase());
                return (
                  <tr key={r._id} className="border-b border-slate-100">
                    <td className="py-2 pr-2">
                      <p className="font-semibold text-slate-800">{vt?.B || r.A}</p>
                      <p className="text-[11px] text-slate-400">{r.A} · {r.B || 'chưa chọn phương pháp'}</p>
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums">{soVN(c.C)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{soVN(c.D)}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-semibold">{soVN(c.E)}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-semibold">{soNguoiQD(c.G)}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-bold">{rong(r.J) ? '—' : r.J}</td>
                    <td className="py-2 pl-2">
                      {c.M === 'ĐẠT' ? <span className="text-emerald-700 font-semibold">ĐẠT</span>
                        : <span className="text-amber-800 font-semibold">{c.M}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {conSot.length > 0 && (
        <section className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <p className="text-[13px] font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Còn dòng chưa đạt — vẫn xuất tệp được, nhưng nên soát lại
          </p>
          <ul className="mt-1.5 text-[12.5px] text-amber-900 space-y-0.5">
            {conSot.map((x) => <li key={x.buoc.id}>· <b>{x.buoc.ten}</b>: {x.chuaDat}/{x.tong} dòng chưa đạt{x.trong ? `, ${x.trong} dòng chưa điền số` : ''}</li>)}
          </ul>
        </section>
      )}

      <section className={theRong}>
        <h3 className="font-extrabold text-slate-800">Xuất tệp</h3>
        <p className="text-[12.5px] text-slate-500 mt-1 mb-3">
          {tepGoc
            ? <>Phần mềm ghi <b>{soODoi} ô đã đổi</b> ngược vào chính tệp đã nhập và giữ nguyên toàn bộ phần còn lại của sổ
              (các trang, công thức, danh sách chọn, định dạng). Mở tệp bằng Excel là các cột tự tính được tính lại.</>
            : <>Đang dùng bộ số mẫu nên không có tệp gốc để ghi vào. Phần mềm xuất một tệp <b>.xlsx gọn</b> theo đúng tên
              trang và thứ tự cột của bộ biểu — <b>không phải</b> bộ biểu gốc của Ban.</>}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onXuat} disabled={dangXuat} className={nutChinh}>
            <Download className="w-4 h-4" /> {dangXuat ? 'Đang dựng tệp…' : tepGoc ? 'Xuất tệp bộ biểu (.xlsx)' : 'Xuất tệp gọn (.xlsx)'}
          </button>
          <button onClick={() => xuatSaoLuu(doc)} className={nutPhu}><Save className="w-4 h-4" /> Lưu bản sao lưu (.json)</button>
        </div>
        {ketQuaXuat && (
          <p className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[12.5px] text-emerald-900 flex gap-1.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5" /><span>{ketQuaXuat}</span>
          </p>
        )}
        {loiXuat && (
          <p className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-[12.5px] text-rose-800 flex gap-1.5">
            <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" /><span>{loiXuat}</span>
          </p>
        )}
      </section>
    </div>
  );
}

// ─── Danh mục sản phẩm — CHỈ QUẢN TRỊ sửa ───────────────────────────────────
function DanhMucSanPham({ doc, docGoc, admin, onSuaO }) {
  const [tim, setTim] = useState('');
  const ds = (doc.bieu.DM || []);
  const loc = ds.map((r, i) => ({ r, i })).filter(({ r }) => !tim.trim()
    || `${r.A} ${r.B} ${r.J}`.toLowerCase().includes(tim.trim().toLowerCase()));
  return (
    <div className="space-y-3">
      <section className={admin ? 'bg-emerald-50 rounded-2xl border border-emerald-200 p-4' : 'bg-slate-50 rounded-2xl border border-slate-200 p-4'}>
        <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
          {admin ? <><Check className="w-4 h-4 text-emerald-700" /> Anh/chị đã đăng nhập — sửa được định mức phút trong danh mục</>
            : <><Lock className="w-4 h-4 text-slate-500" /> Chỉ quản trị (đã đăng nhập) được sửa danh mục sản phẩm</>}
        </p>
        <p className="text-[12.5px] text-slate-600 mt-1">
          Định mức <b>phút/sản phẩm</b> ở đây là mức dùng chung, do cơ quan chủ trì thống nhất. Đổi một dòng ở đây là
          đổi cách tính của <b>mọi công việc</b> dùng mã sản phẩm đó.
        </p>
      </section>

      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm mã hoặc tên sản phẩm…"
          className="w-full pl-8 pr-2 py-1.5 text-[12.5px] rounded-lg border border-slate-200 focus:border-sky-500 outline-none" />
      </div>
      <p className="text-[12px] text-slate-500">{loc.length}/{ds.length} dòng</p>

      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-2 font-semibold">Mã sản phẩm</th>
              <th className="py-2 px-2 font-semibold">Tên/loại sản phẩm</th>
              <th className="py-2 px-2 font-semibold">Nhóm</th>
              <th className="py-2 px-2 font-semibold text-right">Phút/SP chuẩn</th>
              <th className="py-2 pl-2 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loc.slice(0, 300).map(({ r, i }) => (
              <tr key={r._id} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-2 font-mono text-[11.5px] text-slate-700 whitespace-nowrap">{r.A}</td>
                <td className="py-2 px-2 max-w-[28rem]"><p className="text-slate-700 leading-snug line-clamp-2">{r.B}</p></td>
                <td className="py-2 px-2 text-slate-500">{r.D}</td>
                <td className="py-2 px-2 text-right">
                  <ONhapSo id={`dm-${i}-E`} giaTri={r.E} goc={(docGoc?.bieu?.DM || [])[i]?.E} chinh
                    khoa={!admin} donVi="phút" onDoi={(v) => onSuaO('DM', i, 'E', v)} />
                </td>
                <td className="py-2 pl-2 text-slate-500">{r.G}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loc.length > 300 && <p className="text-[12px] text-slate-500">… còn {loc.length - 300} dòng nữa, hãy dùng ô tìm kiếm.</p>}
    </div>
  );
}

// ─── Xem các biểu cố định (chỉ đọc) ────────────────────────────────────────
function XemCoDinh({ doc, id }) {
  const b = BIEU_THEO_ID[id];
  const ds = coDuLieu(doc, id);
  return (
    <div className="space-y-2">
      <p className="text-[12.5px] text-slate-500">{b.moTa} — <b>{ds.length} dòng</b>, chỉ xem.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              {b.cot.slice(0, 6).map((c) => <th key={c.k} className="py-2 px-2 font-semibold whitespace-nowrap">{c.ten}</th>)}
            </tr>
          </thead>
          <tbody>
            {ds.slice(0, 200).map((r) => (
              <tr key={r._id} className="border-b border-slate-100 align-top">
                {b.cot.slice(0, 6).map((c) => (
                  <td key={c.k} className="py-1.5 px-2 max-w-[20rem]">
                    <p className={`${c.kieu === 'ma' ? 'font-mono text-[11px] whitespace-nowrap' : 'line-clamp-2'} text-slate-700`}>{String(r[c.k] ?? '')}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ds.length > 200 && <p className="text-[12px] text-slate-500">… còn {ds.length - 200} dòng nữa.</p>}
    </div>
  );
}

// ============================================================================
//  THÀNH PHẦN CHÍNH
// ============================================================================
export default function VTVL({ onHome }) {
  const [doc, setDoc] = useState(null);
  const [docGoc, setDocGoc] = useState(null);
  const [tepGoc, setTepGoc] = useState(null);
  const [buocId, setBuocId] = useState('nguon');
  const [dangDoc, setDangDoc] = useState(null);
  const [loi, setLoi] = useState('');
  const [admin, setAdmin] = useState(false);
  const [xem, setXem] = useState('');          // '' | 'DM' | 'A1' | 'A2' | 'C1'
  const [dangXuat, setDangXuat] = useState(false);
  const [ketQuaXuat, setKetQuaXuat] = useState('');
  const [loiXuat, setLoiXuat] = useState('');

  useEffect(() => {
    getSession().then((s) => setAdmin(!!s));
    return onAuthChange((s) => setAdmin(!!s));
  }, []);

  const kq = useMemo(() => (doc ? tinhToan(doc) : null), [doc]);
  const buoc = BUOC.find((b) => b.id === buocId) || BUOC[0];

  // Số ô đã đổi so với tệp đã nhập — dùng cho nút xuất và cảnh báo rời trang
  const soODoi = useMemo(() => {
    if (!doc || !docGoc) return 0;
    let n = 0;
    for (const b of Object.keys(doc.bieu)) {
      const cot = cotNhap(b);
      if (!cot.length) continue;
      (doc.bieu[b] || []).forEach((r, i) => {
        const g = (docGoc.bieu[b] || []).find((x) => x._dongTep === r._dongTep) || (docGoc.bieu[b] || [])[i];
        if (!g) return;
        for (const c of cot) {
          const a = r[c.k] === undefined ? '' : r[c.k];
          const bb = g[c.k] === undefined ? '' : g[c.k];
          if (typeof a === 'number' && typeof bb === 'number' ? Math.abs(a - bb) > 1e-9 : String(a) !== String(bb)) n++;
        }
      });
    }
    return n;
  }, [doc, docGoc]);

  // ⚠️ Dữ liệu không được lưu ở đâu cả → chặn rời trang khi còn thay đổi chưa xuất.
  useEffect(() => {
    if (!soODoi) return undefined;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [soODoi]);

  const napTepMoi = async (file) => {
    if (!file) return;
    const duoi = (file.name.split('.').pop() || '').toLowerCase();
    if (!['xlsx', 'xlsm', 'json'].includes(duoi)) {
      setLoi(`Cần tệp bộ biểu .xlsx, không phải ".${duoi}".`);
      return;
    }
    setLoi(''); setKetQuaXuat(''); setDangDoc({ phan: 0, trang: '' });
    try {
      if (duoi === 'json') {
        const d = JSON.parse(await file.text());
        if (d?.loai !== 'vtvl-sao-luu' || !d.doc?.bieu) throw new Error('Tệp .json không phải bản sao lưu của phân hệ này.');
        setDoc(d.doc); setDocGoc(JSON.parse(JSON.stringify(d.doc))); setTepGoc(null);
      } else {
        const { doc: d, thieuTrang } = await napTep(file, { onTienDo: setDangDoc });
        if (!(d.bieu.C1 || []).length && !(d.bieu.B1 || []).length) {
          throw new Error('Tệp không có dòng dữ liệu nào ở các biểu A1…D2. Hãy chọn đúng tệp BỘ BIỂU vị trí việc làm.');
        }
        if (thieuTrang.length > 6) {
          throw new Error(`Tệp thiếu ${thieuTrang.length} trang của bộ biểu (${thieuTrang.slice(0, 3).join(', ')}…) — có thể không phải tệp bộ biểu.`);
        }
        setDoc(d); setDocGoc(JSON.parse(JSON.stringify(d))); setTepGoc(file);
      }
      setBuocId('B1');
    } catch (e) { setLoi(e.message); } finally { setDangDoc(null); }
  };

  const moMau = () => {
    const d = boSoMau();
    setDoc(d); setDocGoc(JSON.parse(JSON.stringify(d))); setTepGoc(null);
    setLoi(''); setKetQuaXuat(''); setBuocId('B1');
  };

  const suaO = useCallback((bieuId, i, cot, giaTri) => {
    setDoc((cu) => {
      if (!cu) return cu;
      const ds = [...(cu.bieu[bieuId] || [])];
      ds[i] = { ...ds[i], [cot]: giaTri };
      return { ...cu, bieu: { ...cu.bieu, [bieuId]: ds } };
    });
    setKetQuaXuat('');
  }, []);

  const xuat = async () => {
    setDangXuat(true); setLoiXuat(''); setKetQuaXuat('');
    try {
      if (tepGoc) {
        const { blob, soO, theoBieu, canhBao } = await ghiLaiTep(tepGoc, doc, { docGoc });
        const ten = tenTepXuat(doc, 'da_sua');
        taiVe(blob, ten);
        setKetQuaXuat(`Đã xuất ${ten} — ghi ${soO} ô vào ${Object.keys(theoBieu).length} biểu (${Object.entries(theoBieu).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'không có ô nào đổi'}). Giữ nguyên mọi trang và công thức của tệp gốc.`
          + (canhBao.length ? ` ⚠️ ${canhBao.join(' ')}` : ''));
      } else {
        const ten = await xuatTepMoi(doc, kq);
        setKetQuaXuat(`Đã xuất ${ten}. Đây là tệp gọn do phần mềm dựng, không phải bộ biểu gốc của Ban.`);
      }
    } catch (e) { setLoiXuat(e.message); } finally { setDangXuat(false); }
  };

  const iBuoc = BUOC.findIndex((b) => b.id === buocId);
  const truoc = BUOC[iBuoc - 1];
  const sau = BUOC[iBuoc + 1];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-sky-800 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          {onHome && (
            <button onClick={onHome} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[12.5px] font-semibold">
              <Home className="w-4 h-4" /> Trang chủ
            </button>
          )}
          <img src="/quoc-huy.svg" alt="" className="w-8 h-8" />
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-sky-100">Bộ biểu vị trí việc làm</p>
            <h1 className="text-[15px] font-extrabold leading-tight truncate">
              {doc ? (doc.donVi || doc.tenTep || 'Bộ biểu đang nhập') : 'Nhập tệp bộ biểu để bắt đầu'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {doc?.laMau && <span className="px-2 py-1 rounded-lg bg-violet-500/90 text-[11px] font-bold">BỘ SỐ MẪU</span>}
            {soODoi > 0 && <span className="px-2 py-1 rounded-lg bg-amber-400 text-amber-950 text-[11px] font-bold">{soODoi} ô đã đổi · chưa xuất tệp</span>}
            <span className="px-2 py-1 rounded-lg bg-white/15 text-[11px] font-semibold">
              {admin ? 'Đã đăng nhập' : 'Khách'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <ThanhBuoc buoc={buocId} doc={doc} kq={kq} onChon={setBuocId} />

        {doc && kq && buoc.bieu && <KhoiKetQua doc={doc} kq={kq} />}

        <section className={theRong}>
          {buocId === 'nguon' && (
            <BuocNguon onNap={napTepMoi} onMau={moMau} dangDoc={dangDoc} loi={loi} doc={doc} />
          )}

          {buoc.bieu && doc && kq && (
            <>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Bước {iBuoc}: {buoc.ten}</h2>
                  <p className="text-[12.5px] text-slate-500">{buoc.moTa}</p>
                  <p className="text-[12.5px] text-sky-800 font-semibold mt-0.5">Cần nhập: {buoc.hoi}</p>
                </div>
                {(() => {
                  const t = tienDoBuoc(doc, kq, buoc);
                  return (
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-slate-800">{t.dat}/{t.tong} dòng đạt</p>
                      {t.trong > 0 && <p className="text-[12px] text-amber-700">{t.trong} dòng chưa điền số</p>}
                    </div>
                  );
                })()}
              </div>
              <BangNhapSo doc={doc} docGoc={docGoc} kq={kq} buoc={buoc} onSuaO={suaO} />
            </>
          )}

          {buocId === 'xong' && doc && kq && (
            <BuocXong doc={doc} kq={kq} tepGoc={tepGoc} soODoi={soODoi}
              onXuat={xuat} dangXuat={dangXuat} ketQuaXuat={ketQuaXuat} loiXuat={loiXuat} />
          )}
        </section>

        {doc && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button onClick={() => truoc && setBuocId(truoc.id)} disabled={!truoc} className={nutPhu}>
              <ArrowLeft className="w-4 h-4" /> {truoc ? truoc.nhan || truoc.ten : 'Trước'}
            </button>
            <button onClick={() => sau && setBuocId(sau.id)} disabled={!sau} className={nutChinh}>
              {sau ? `Tiếp: ${sau.nhan || sau.ten}` : 'Xong'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {doc && (
          <section className={theRong}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Các biểu cố định</span>
              {[['A1', 'Nhiệm vụ'], ['A2', 'Công việc'], ['C1', 'Vị trí việc làm'], ['DM', 'Danh mục sản phẩm']].map(([id, ten]) => (
                <button key={id} onClick={() => setXem(xem === id ? '' : id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border-2 inline-flex items-center gap-1.5
                    ${xem === id ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'}`}>
                  <Table2 className="w-3.5 h-3.5" /> {ten}
                  <span className="text-slate-400">({coDuLieu(doc, id).length})</span>
                  {id === 'DM' && !admin && <Lock className="w-3 h-3 text-slate-400" />}
                </button>
              ))}
              {xem && <button onClick={() => setXem('')} className={`${nutPhu} ml-auto`}><Undo2 className="w-3.5 h-3.5" /> Đóng</button>}
            </div>
            {xem === 'DM' && <div className="mt-3"><DanhMucSanPham doc={doc} docGoc={docGoc} admin={admin} onSuaO={suaO} /></div>}
            {xem && xem !== 'DM' && <div className="mt-3"><XemCoDinh doc={doc} id={xem} /></div>}
          </section>
        )}

        <p className="text-[11.5px] text-slate-500 flex gap-1.5">
          <Info className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            Phần mềm tính lại các cột tự tính của bộ biểu để anh/chị thấy ngay kết quả; tệp xuất ra <b>không ghi</b> số
            vào các cột đó, để chính Excel tính — tránh hai nguồn số lệch nhau. Quỹ giờ quy đổi PP2 = {soVN(QUY_GIO_PP2, 0)} giờ/người/năm.
          </span>
        </p>
      </main>
    </div>
  );
}
