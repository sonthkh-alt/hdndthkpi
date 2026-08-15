import { useState, useEffect, useMemo } from 'react';
import {
  Home, Vote, CheckCircle2, XCircle, MessageSquareWarning, Users, Download, RefreshCw,
  AlertTriangle, Info, Plus, Lock, Unlock, Trash2, ChevronRight,
} from 'lucide-react';
import { getSession, onAuthChange } from './lib/auth';
import {
  LUA_CHON, TONG_DAI_BIEU, TY_LE, danhSachDaiBieu, ghiPhieu, ketQua, ketLuan, maDaiBieu,
  newPhien, nhanLuaChon, sinhPhieuMoPhong, vanBanKetQua,
} from './lib/bieuQuyet';
import {
  cacheBQ, fetchBQ, guiPhieu, readBQ, readMaDaiBieu, saveBQ, seedBieuQuyet, writeMaDaiBieu,
} from './lib/bieuQuyetStore';

// ============================================================================
//  PHÂN HỆ "BIỂU QUYẾT ONLINE" — #/bieuquyet
//  Đại biểu bấm một trong ba lựa chọn (Đồng ý · Không đồng ý · Có ý kiến khác),
//  hệ thống kiểm phiếu ngay trên TỔNG SỐ 82 ĐẠI BIỂU HĐND tỉnh Thanh Hóa và
//  đối chiếu với điều kiện thông qua (quá nửa / hai phần ba tổng số đại biểu).
// ============================================================================

// Viết đủ tên lớp Tailwind để không bị loại khi build.
const MAU = {
  dongY: {
    nut: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800',
    nutDam: 'bg-emerald-600 hover:bg-emerald-700', o: 'bg-emerald-500', the: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    thanh: 'bg-emerald-500', icon: CheckCircle2,
  },
  khongDongY: {
    nut: 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800',
    nutDam: 'bg-rose-600 hover:bg-rose-700', o: 'bg-rose-500', the: 'bg-rose-50 text-rose-800 border-rose-200',
    thanh: 'bg-rose-500', icon: XCircle,
  },
  yKienKhac: {
    nut: 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800',
    nutDam: 'bg-amber-500 hover:bg-amber-600', o: 'bg-amber-400', the: 'bg-amber-50 text-amber-800 border-amber-200',
    thanh: 'bg-amber-400', icon: MessageSquareWarning,
  },
  chua: { o: 'bg-slate-200', the: 'bg-slate-50 text-slate-600 border-slate-200', thanh: 'bg-slate-200' },
};

const DS_DAI_BIEU = danhSachDaiBieu();

function The({ nhan, so, tyLe, cls }) {
  return (
    <div className={`rounded-2xl border p-3 ${cls}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-75">{nhan}</p>
      <p className="text-3xl font-extrabold leading-tight mt-0.5">{so}</p>
      <p className="text-[12px] font-semibold opacity-80">{tyLe}% tổng số đại biểu</p>
    </div>
  );
}

export default function BieuQuyet({ onHome }) {
  const [data, setData] = useState(readBQ);
  const [phienId, setPhienId] = useState('');
  const [maDB, setMaDB] = useState(() => readMaDaiBieu() || maDaiBieu(1));
  const [phien, setPhien] = useState(undefined);   // phiên đăng nhập (quản trị)
  const [dangGui, setDangGui] = useState('');
  const [thongBao, setThongBao] = useState('');
  const [loi, setLoi] = useState('');
  const [moThem, setMoThem] = useState(false);
  const [moi, setMoi] = useState({ tieuDe: '', moTa: '', tyLe: 'quanua' });

  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); });
    const off = onAuthChange((s) => setPhien(s || null));
    fetchBQ().then((d) => {
      if (!alive) return;
      const doc = d.phien.length ? d : seedBieuQuyet();
      setData(doc);
      setPhienId((cur) => cur || (doc.phien.find((p) => p.trangThai === 'mo') || doc.phien[0] || {}).id || '');
    });
    return () => { alive = false; off(); };
  }, []);

  const daDangNhap = !!phien;
  const p = data.phien.find((x) => x.id === phienId) || data.phien[0] || null;
  const kq = useMemo(() => (p ? ketQua(p) : null), [p]);
  const kl = kq ? ketLuan(kq, p.trangThai) : null;
  const laPhieuCuaToi = p?.phieu?.[maDB];
  const daBoPhieu = !!laPhieuCuaToi && laPhieuCuaToi.moPhong === false;
  const dangMo = p?.trangThai === 'mo';

  const capNhat = (phienMoi, luuMayChu = false) => {
    const doc = { ...data, phien: data.phien.map((x) => (x.id === phienMoi.id ? phienMoi : x)) };
    setData(doc);
    if (luuMayChu) saveBQ(doc); else cacheBQ(doc);
    return doc;
  };

  // ---- Bỏ phiếu ----------------------------------------------------------
  async function boPhieu(chon) {
    if (!p || !dangMo) return;
    setLoi(''); setThongBao(''); setDangGui(chon);
    capNhat(ghiPhieu(p, maDB, chon));
    const r = await guiPhieu(p.id, maDB, chon);
    setDangGui('');
    if (!r.ok) {
      setThongBao(r.reason === 'no-rpc'
        ? 'Đã ghi nhận lá phiếu trên máy này. Máy chủ chưa bật hàm bỏ phiếu dùng chung (BƯỚC 8 trong supabase/schema.sql) nên kết quả chưa cộng chung giữa các thiết bị.'
        : 'Đã ghi nhận lá phiếu trên máy này (chưa kết nối máy chủ).');
    } else {
      setThongBao('Đã ghi nhận lá phiếu.');
      fetchBQ().then((d) => d.phien.length && setData(d));
    }
  }

  const xuatBienBan = async () => {
    const { exportVanBanDonGian } = await import('./lib/exporters');
    await exportVanBanDonGian({
      tieuDe: 'Biên bản kết quả biểu quyết',
      phuDe: 'Hội đồng nhân dân tỉnh Thanh Hóa',
      text: vanBanKetQua(p, kq),
    });
  };

  const themPhien = async () => {
    if (!moi.tieuDe.trim()) { setLoi('Chưa nhập nội dung trình biểu quyết.'); return; }
    const p2 = newPhien(moi);
    const doc = { ...data, phien: [p2, ...data.phien] };
    setData(doc); setPhienId(p2.id); setMoThem(false); setMoi({ tieuDe: '', moTa: '', tyLe: 'quanua' });
    const r = await saveBQ(doc);
    setThongBao(r.ok ? 'Đã mở phiên biểu quyết mới.' : 'Đã tạo trên máy này; đăng nhập để lưu lên máy chủ.');
  };

  const doiTrangThai = async () => {
    const p2 = { ...p, trangThai: dangMo ? 'dong' : 'mo' };
    const doc = capNhat(p2, true);
    setThongBao(dangMo ? 'Đã khóa phiên biểu quyết.' : 'Đã mở lại phiên biểu quyết.');
    return doc;
  };

  const xoaPhien = async () => {
    const doc = { ...data, phien: data.phien.filter((x) => x.id !== p.id) };
    setData(doc); setPhienId(doc.phien[0]?.id || '');
    await saveBQ(doc);
  };

  const napMoPhong = () => {
    capNhat(sinhPhieuMoPhong(p, { bo: [maDB] }), true);
    setThongBao('Đã nạp bộ phiếu mô phỏng cho các đại biểu chưa bấm (phục vụ trình diễn).');
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ===== Đầu trang ===== */}
      <header className="bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-amber-300/50 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-200">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Biểu quyết Online</h1>
              <p className="text-white/75 text-[11px] sm:text-xs mt-0.5">Kỳ họp HĐND tỉnh · {TONG_DAI_BIEU} đại biểu</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              Bạn đang biểu quyết với tư cách <b>{DS_DAI_BIEU.find((d) => d.ma === maDB)?.ten || maDB}</b>
            </span>
            <select value={maDB} onChange={(e) => { setMaDB(writeMaDaiBieu(e.target.value)); setThongBao(''); }}
              title="Chọn số đại biểu của bạn (bản demo)"
              className="rounded-lg bg-white/10 border border-white/25 px-2 py-1.5 text-white text-[12px] [&>option]:text-slate-800">
              {DS_DAI_BIEU.map((d) => <option key={d.ma} value={d.ma}>{d.ten}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {loi && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700 flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>{loi}</span></div>}
        {thongBao && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-[12.5px] text-sky-800 flex items-start gap-2"><Info className="w-4 h-4 shrink-0 mt-0.5" /><span>{thongBao}</span></div>}

        {!p ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-[13px] text-slate-500">
            Chưa có nội dung nào được trình biểu quyết.
          </div>
        ) : (
          <>
            {/* ===== Nội dung trình biểu quyết ===== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">Nội dung trình biểu quyết</p>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug mt-1">{p.tieuDe}</h2>
                  {p.moTa && <p className="text-[13px] text-slate-500 mt-1">{p.moTa}</p>}
                  <p className="text-[12px] text-slate-500 mt-2">
                    Điều kiện thông qua: <b>{(TY_LE[p.tyLe] || TY_LE.quanua).nhan}</b> — tối thiểu <b>{kq.nguong}/{kq.tong}</b> phiếu tán thành.
                  </p>
                </div>
                <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${dangMo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {dangMo ? 'Đang mở biểu quyết' : 'Đã khóa'}
                </span>
              </div>

              {/* ===== Ba lựa chọn ===== */}
              {dangMo ? (
                <div className="mt-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {LUA_CHON.map((c) => {
                      const m = MAU[c.id];
                      const Ic = m.icon;
                      const chonRoi = laPhieuCuaToi?.moPhong === false && laPhieuCuaToi?.chon === c.id;
                      return (
                        <button key={c.id} type="button" onClick={() => boPhieu(c.id)} disabled={!!dangGui}
                          className={`rounded-2xl border-2 p-5 text-center transition disabled:opacity-60 ${chonRoi ? `${m.nutDam} text-white border-transparent shadow-lg` : m.nut}`}>
                          <Ic className="w-9 h-9 mx-auto" />
                          <span className="block text-[15px] font-extrabold mt-2">{c.nhan}</span>
                          {chonRoi && <span className="block text-[11px] font-semibold mt-1 opacity-90">Lá phiếu của bạn</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[12px] text-slate-500 mt-2">
                    {daBoPhieu
                      ? <>Bạn đã biểu quyết <b>{nhanLuaChon(laPhieuCuaToi.chon)}</b>. Còn trong thời gian biểu quyết, bạn có thể bấm lại để đổi lá phiếu.</>
                      : <>Bấm vào một trong ba lựa chọn để bỏ phiếu. Mỗi đại biểu chỉ tính <b>một</b> lá phiếu.</>}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-[13px] text-slate-500 flex items-center gap-1.5"><Lock className="w-4 h-4" /> Phiên biểu quyết đã khóa, kết quả bên dưới là kết quả cuối cùng.</p>
              )}
            </section>

            {/* ===== Kết quả ===== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-[15px] font-extrabold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Kết quả kiểm phiếu — {kq.tong} đại biểu HĐND tỉnh</h3>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={xuatBienBan} className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900"><Download className="w-4 h-4" /> Xuất biên bản (Word)</button>
                  <button type="button" onClick={() => fetchBQ().then((d) => { if (d.phien.length) setData(d); setThongBao('Đã cập nhật kết quả từ máy chủ.'); })}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"><RefreshCw className="w-4 h-4" /> Cập nhật</button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <The nhan="Đồng ý" so={kq.dongY} tyLe={kq.tyLeDongY} cls={MAU.dongY.the} />
                <The nhan="Không đồng ý" so={kq.khongDongY} tyLe={kq.tyLeKhongDongY} cls={MAU.khongDongY.the} />
                <The nhan="Có ý kiến khác" so={kq.yKienKhac} tyLe={kq.tyLeYKienKhac} cls={MAU.yKienKhac.the} />
                <The nhan="Chưa biểu quyết" so={kq.chuaBieuQuyet} tyLe={kq.tyLeChua} cls={MAU.chua.the} />
              </div>

              {/* Thanh tỷ lệ + vạch ngưỡng thông qua */}
              <div>
                <div className="relative h-5 w-full rounded-full overflow-hidden bg-slate-200 flex">
                  <div className={MAU.dongY.thanh} style={{ width: `${kq.tyLeDongY}%` }} />
                  <div className={MAU.khongDongY.thanh} style={{ width: `${kq.tyLeKhongDongY}%` }} />
                  <div className={MAU.yKienKhac.thanh} style={{ width: `${kq.tyLeYKienKhac}%` }} />
                  <span className="absolute top-0 bottom-0 w-0.5 bg-slate-900/70" style={{ left: `${Math.round((kq.nguong / kq.tong) * 1000) / 10}%` }} title={`Ngưỡng thông qua: ${kq.nguong}/${kq.tong}`} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Vạch đen là ngưỡng thông qua ({kq.nguong}/{kq.tong} phiếu tán thành).</p>
              </div>

              {/* Kết luận */}
              <div className={`rounded-2xl border p-4 ${kl.dat ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className={`text-[15px] font-extrabold ${kl.dat ? 'text-emerald-800' : 'text-amber-800'}`}>{kl.chinh}</p>
                <p className={`text-[13px] mt-0.5 ${kl.dat ? 'text-emerald-800/90' : 'text-amber-800/90'}`}>{kl.phu}</p>
              </div>

              {/* Lưới 82 đại biểu */}
              <div>
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <p className="text-[12px] font-bold text-slate-600">Bảng điện tử — mỗi ô là một đại biểu</p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                    {LUA_CHON.map((c) => <span key={c.id} className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded ${MAU[c.id].o}`} /> {c.nhan}</span>)}
                    <span className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded ${MAU.chua.o}`} /> Chưa biểu quyết</span>
                  </div>
                </div>
                <div className="grid grid-cols-10 sm:grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
                  {DS_DAI_BIEU.map((d) => {
                    const v = p.phieu?.[d.ma];
                    const m = v && MAU[v.chon] ? MAU[v.chon] : MAU.chua;
                    const toi = d.ma === maDB;
                    return (
                      <span key={d.ma} title={`${d.ten} — ${nhanLuaChon(v?.chon)}${v?.moPhong ? ' (mô phỏng)' : ''}`}
                        className={`aspect-square rounded ${m.o} ${toi ? 'ring-2 ring-offset-1 ring-slate-900' : ''} flex items-center justify-center text-[9px] font-bold text-white/90`}>
                        {d.so}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[11px] text-amber-700 mt-2 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Bản demo: có <b>{kq.phieuThuc}</b> lá phiếu thật do người dùng bấm; {kq.tong - kq.phieuThuc} lá còn lại là <b>dữ liệu mô phỏng</b> để minh họa bảng điện tử, không phải kết quả biểu quyết thật của HĐND tỉnh.
                </p>
              </div>
            </section>

            {/* ===== Danh sách nội dung & điều khiển ===== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-[15px] font-extrabold text-slate-800">Các nội dung biểu quyết</h3>
                {daDangNhap && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setMoThem((v) => !v)} className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl bg-red-700 text-white hover:bg-red-800"><Plus className="w-4 h-4" /> Trình nội dung mới</button>
                    <button type="button" onClick={doiTrangThai} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">
                      {dangMo ? <><Lock className="w-4 h-4" /> Khóa phiên</> : <><Unlock className="w-4 h-4" /> Mở lại</>}
                    </button>
                    <button type="button" onClick={napMoPhong} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">Nạp phiếu mô phỏng</button>
                    <button type="button" onClick={xoaPhien} title="Xóa nội dung này" className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>

              {moThem && daDangNhap && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <label className="block">
                    <span className="text-[12px] font-bold text-slate-600">Nội dung trình biểu quyết</span>
                    <input value={moi.tieuDe} onChange={(e) => setMoi({ ...moi, tieuDe: e.target.value })} placeholder="Ví dụ: Nghị quyết về kế hoạch phát triển kinh tế - xã hội năm 2027"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]" />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-bold text-slate-600">Tóm tắt hồ sơ trình (tùy chọn)</span>
                    <input value={moi.moTa} onChange={(e) => setMoi({ ...moi, moTa: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]" />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-bold text-slate-600">Điều kiện thông qua</span>
                    <select value={moi.tyLe} onChange={(e) => setMoi({ ...moi, tyLe: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]">
                      {Object.values(TY_LE).map((t) => <option key={t.id} value={t.id}>{t.nhan} ({t.tinh(TONG_DAI_BIEU)}/{TONG_DAI_BIEU} phiếu)</option>)}
                    </select>
                  </label>
                  <button type="button" onClick={themPhien} className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900"><Vote className="w-4 h-4" /> Mở phiên biểu quyết</button>
                </div>
              )}

              <ul className="divide-y divide-slate-100">
                {data.phien.map((x) => {
                  const k = ketQua(x);
                  const on = x.id === p.id;
                  return (
                    <li key={x.id}>
                      <button type="button" onClick={() => { setPhienId(x.id); setThongBao(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-full text-left py-3 px-2 rounded-xl flex items-start justify-between gap-3 ${on ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-semibold text-slate-800 leading-snug">{x.tieuDe}</span>
                          <span className="block text-[12px] text-slate-500 mt-0.5">
                            {x.trangThai === 'mo' ? 'Đang mở biểu quyết' : 'Đã khóa'} · Tán thành {k.dongY}/{k.tong} ({k.tyLeDongY}%) · {k.thongQua ? 'đủ điều kiện thông qua' : 'chưa đủ điều kiện thông qua'}
                          </span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {!daDangNhap && <p className="text-[12px] text-slate-500">Đăng nhập bằng tài khoản cơ quan để trình nội dung mới, khóa hoặc mở lại phiên biểu quyết.</p>}
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center space-y-1.5">
          <p className="text-[12px] font-semibold text-amber-600">⚠ Bản demo thử nghiệm — kết quả hiển thị không phải kết quả biểu quyết chính thức của HĐND tỉnh.</p>
          <p className="text-[12px] text-slate-500">© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
        </div>
      </footer>
    </div>
  );
}
