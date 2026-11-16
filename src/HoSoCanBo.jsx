import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Home, FolderLock, Lock, LogIn, LogOut, Search, Users, Bell, Upload, Download, FileDown, Pencil, Save, X, ArrowLeft,
  ChevronLeft, ChevronRight, UserPlus, Trash2, Plus, RefreshCw, ShieldAlert, Info, Cake, TrendingUp, Briefcase, Award,
  User, IdCard, MapPin, Wallet, GraduationCap, Flag, History, HeartPulse, FileText, Building2, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import Login from './Login.jsx';
import { getSession, onAuthChange, signOut, laEmailQuanTri } from './lib/auth';
import { fetchHoSo, saveHoSo } from './lib/hoSoStore';
import {
  NHOM, BANG, CHON, hienThi, dmy, tomTat, doHoanThien, truongKhac, loc, sapXep, thongKe, nhacViec, NGUONG,
  docTepNhap, ghepGoi, hoSoMoi, sang2C, phongCua, hoTen, bangSapXep,
} from './lib/hoSoCanBo';

// ============================================================================
//  PHÂN HỆ HỒ SƠ CÁN BỘ — #/hoso  (CHỈ QUẢN TRỊ)
//  Dữ liệu: hồ sơ lấy từ Hệ thống quản lý CBCCVC tỉnh Thanh Hóa (qlccvc.thanhhoa.gov.vn),
//  lưu ở hr_data.hoSo trên Supabase (RLS BƯỚC 4). Lõi nghiệp vụ: src/lib/hoSoCanBo.js.
// ============================================================================

const ICON_NHOM = { User, IdCard, MapPin, Briefcase, Wallet, GraduationCap, Flag, Users, History, Award, HeartPulse, Home, FileText };
const DON_VI = 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa';
const MUC = {
  quaHan: { nhan: 'Quá hạn', mau: 'bg-red-50 text-red-700 border-red-200', vach: 'bg-red-500' },
  khan: { nhan: 'Khẩn', mau: 'bg-orange-50 text-orange-700 border-orange-200', vach: 'bg-orange-500' },
  sapToi: { nhan: 'Sắp tới', mau: 'bg-amber-50 text-amber-800 border-amber-200', vach: 'bg-amber-400' },
  thongTin: { nhan: 'Thông tin', mau: 'bg-sky-50 text-sky-700 border-sky-200', vach: 'bg-sky-400' },
};
const LOAI_NHAC = { nangLuong: 'Nâng lương', nghiHuu: 'Nghỉ hưu', boNhiem: 'Thời hạn chức vụ', phuCap: 'Phụ cấp', sinhNhat: 'Sinh nhật' };

const chuDau = (ten) => {
  const p = String(ten || '').trim().split(/\s+/);
  return ((p[p.length - 1]?.[0] || '') + (p.length > 1 ? p[0][0] : '')).toUpperCase();
};
const conLai = (n) => (n < 0 ? `quá ${-n} ngày` : n === 0 ? 'hôm nay' : `còn ${n} ngày`);

export default function HoSoCanBo({ onHome }) {
  const [phien, setPhien] = useState(undefined);       // undefined = đang kiểm tra
  const [moLogin, setMoLogin] = useState(false);
  const [goi, setGoi] = useState(null);
  const [dangTai, setDangTai] = useState(false);
  const [loiTai, setLoiTai] = useState('');
  const [man, setMan] = useState('tongquan');           // tongquan | danhsach | nhacviec | nhapxuat | hoso
  const [chon, setChon] = useState(null);               // mã cán bộ đang mở
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState(null);

  const email = phien?.user?.email || '';
  const quanTri = !!phien && laEmailQuanTri(email);
  const bao = useCallback((kieu, chu) => { setThongBao({ kieu, chu }); setTimeout(() => setThongBao(null), 6000); }, []);

  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); }).catch(() => alive && setPhien(null));
    const off = onAuthChange((s) => { setPhien(s || null); if (s) setMoLogin(false); });
    return () => { alive = false; off && off(); };
  }, []);

  const taiLai = useCallback(async () => {
    setDangTai(true); setLoiTai('');
    const r = await fetchHoSo();
    setDangTai(false);
    if (!r.ok) { setLoiTai(r.loi || 'Không đọc được dữ liệu.'); return; }
    setGoi(r.goi);
  }, []);
  useEffect(() => { if (quanTri) taiLai(); else setGoi(null); }, [quanTri, taiLai]);

  const ds = useMemo(() => sapXep(goi?.ds || []), [goi]);
  const hoSoChon = useMemo(() => ds.find((h) => h.vnpt_ma_nhan_vien === chon) || null, [ds, chon]);

  const ghi = async (goiMoi, chuOk) => {
    setDangLuu(true);
    const r = await saveHoSo(goiMoi, goi?.capNhat || '', email);
    setDangLuu(false);
    if (r.ok) { setGoi(r.goi); bao('ok', chuOk); return true; }
    bao('loi', r.loi || 'Chưa lưu được lên máy chủ.');
    return false;
  };

  const luuHoSo = async (h) => {
    const moi = { ...h, _capNhat: { luc: new Date().toISOString(), boi: email } };
    const dsMoi = (goi?.ds || []).some((x) => x.vnpt_ma_nhan_vien === h.vnpt_ma_nhan_vien)
      ? goi.ds.map((x) => (x.vnpt_ma_nhan_vien === h.vnpt_ma_nhan_vien ? moi : x))
      : [...(goi?.ds || []), moi];
    return ghi({ ...(goi || {}), ds: dsMoi }, `Đã lưu hồ sơ ${hoTen(h)}.`);
  };
  const xoaHoSo = async (h) => {
    if (!window.confirm(`Xóa hồ sơ ${hoTen(h)} (${h.vnpt_ma_nhan_vien}) khỏi phân hệ?\n\nChỉ xóa ở phần mềm này, không ảnh hưởng hệ thống QLCCVC của tỉnh. Có thể nhập lại từ tệp xuất của QLCCVC.`)) return;
    const okk = await ghi({ ...goi, ds: goi.ds.filter((x) => x.vnpt_ma_nhan_vien !== h.vnpt_ma_nhan_vien) }, 'Đã xóa hồ sơ.');
    if (okk) { setChon(null); setMan('danhsach'); }
  };
  const moHoSo = (ma) => { setChon(ma); setMan('hoso'); window.scrollTo({ top: 0 }); };

  // ---------------- Cổng chặn quyền ----------------
  if (moLogin) {
    return <Login unit={DON_VI} onHome={onHome} onClose={() => setMoLogin(false)} onGuest={() => setMoLogin(false)}
      onLocalAdmin={() => { setMoLogin(false); bao('loi', 'Chế độ quản trị cục bộ không đọc được hồ sơ trên máy chủ. Hãy đăng nhập bằng tài khoản Quản trị thật.'); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-[#450a0a] via-[#7f1d1d] to-[#991b1b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onHome} title="Về Trang chủ" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/40 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-red-200">{DON_VI}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight flex items-center gap-2"><FolderLock className="w-5 h-5 shrink-0" /> Hồ sơ cán bộ, công chức</h1>
              <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">Dữ liệu Hệ thống quản lý CBCCVC tỉnh Thanh Hóa · chỉ Quản trị truy cập</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {dangLuu && <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20">Đang lưu…</span>}
            {quanTri ? (
              <>
                <span className="text-[11px] px-2.5 py-1.5 rounded-lg border bg-emerald-500/20 border-emerald-300/30 text-emerald-50">Quản trị · {email}</span>
                <button onClick={() => signOut()} title="Đăng xuất" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><LogOut className="w-4 h-4" /></button>
              </>
            ) : phien !== undefined && (
              <button onClick={() => setMoLogin(true)} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-800 hover:bg-slate-100"><LogIn className="w-4 h-4" /> Đăng nhập</button>
            )}
          </div>
        </div>
        {quanTri && goi && (
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {[['tongquan', 'Tổng quan', TrendingUp], ['danhsach', `Danh sách (${ds.length})`, Users], ['nhacviec', 'Nhắc việc', Bell], ['nhapxuat', 'Nhập / xuất dữ liệu', Upload]].map(([k, n, Ic]) => (
              <button key={k} onClick={() => { setMan(k); setChon(null); }}
                className={`shrink-0 flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2.5 rounded-t-xl transition-colors ${man === k || (k === 'danhsach' && man === 'hoso') ? 'bg-slate-50 text-red-800' : 'text-white/80 hover:bg-white/10'}`}>
                <Ic className="w-4 h-4" /> {n}
              </button>
            ))}
          </nav>
        )}
      </header>

      {thongBao && (
        <div className={`fixed top-4 right-4 z-50 max-w-md text-sm px-4 py-3 rounded-xl shadow-lg border ${thongBao.kieu === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>{thongBao.chu}</div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {phien === undefined && <p className="text-sm text-slate-400 py-16 text-center">Đang kiểm tra đăng nhập…</p>}
        {phien !== undefined && !quanTri && <KhoaQuyen phien={phien} email={email} onLogin={() => setMoLogin(true)} onHome={onHome} />}
        {quanTri && dangTai && !goi && <p className="text-sm text-slate-400 py-16 text-center">Đang tải hồ sơ từ máy chủ…</p>}
        {quanTri && loiTai && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div><p className="font-bold">Không đọc được hồ sơ từ máy chủ.</p><p className="mt-1">{loiTai}</p>
              <button onClick={taiLai} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white border border-red-200"><RefreshCw className="w-3.5 h-3.5" /> Thử lại</button></div>
          </div>
        )}
        {quanTri && !dangTai && !loiTai && !goi && <ChuaCoDuLieu onNhap={() => setMan('nhapxuat')} manNhap={man === 'nhapxuat'} />}
        {quanTri && (goi || man === 'nhapxuat') && !loiTai && (
          <>
            {man === 'tongquan' && goi && <TongQuan goi={goi} ds={ds} onMo={moHoSo} onNhacViec={() => setMan('nhacviec')} />}
            {man === 'danhsach' && goi && <DanhSach ds={ds} onMo={moHoSo} onThem={(h) => { luuHoSo(h).then((okk) => okk && moHoSo(h.vnpt_ma_nhan_vien)); }} />}
            {man === 'nhacviec' && goi && <NhacViec ds={ds} onMo={moHoSo} />}
            {man === 'nhapxuat' && <NhapXuat goi={goi} ds={ds} onGhi={ghi} dangLuu={dangLuu} />}
            {man === 'hoso' && hoSoChon && (
              <ChiTiet key={hoSoChon.vnpt_ma_nhan_vien} h={hoSoChon} ds={ds} nhan={goi?.nhan || {}} nhanBang={goi?.nhanBang || {}}
                onLuu={luuHoSo} onXoa={xoaHoSo} onMo={moHoSo} onDong={() => { setChon(null); setMan('danhsach'); }} dangLuu={dangLuu} />
            )}
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 text-[11px] text-slate-400">
        Bản demo thử nghiệm phục vụ nội bộ. Hồ sơ chứa dữ liệu cá nhân — chỉ dùng cho công tác quản lý cán bộ của cơ quan;
        không sao chép, chuyển cho người không có thẩm quyền. Bản chính thống của hồ sơ vẫn là Hệ thống quản lý CBCCVC tỉnh.
      </footer>
    </div>
  );
}

// ===========================================================================
function KhoaQuyen({ phien, email, onLogin, onHome }) {
  return (
    <div className="max-w-xl mx-auto mt-10 rounded-3xl bg-white border border-slate-200 shadow-sm p-8 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-700 flex items-center justify-center"><Lock className="w-8 h-8" /></div>
      <h2 className="mt-4 text-lg font-extrabold text-slate-800">Phân hệ chỉ dành cho Quản trị</h2>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        Hồ sơ cán bộ chứa dữ liệu cá nhân (số định danh, quan hệ gia đình, tài sản, sức khỏe) nên chỉ tài khoản Quản trị
        của hệ thống được mở. Máy chủ cũng chặn đọc dữ liệu này với mọi tài khoản khác.
      </p>
      {phien && <p className="mt-3 text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Tài khoản <b>{email}</b> không có quyền Quản trị.</p>}
      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <button onClick={onLogin} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white"><LogIn className="w-4 h-4" /> {phien ? 'Đăng nhập tài khoản khác' : 'Đăng nhập Quản trị'}</button>
        <button onClick={onHome} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"><Home className="w-4 h-4" /> Về Trang chủ</button>
      </div>
    </div>
  );
}

function ChuaCoDuLieu({ onNhap, manNhap }) {
  if (manNhap) return null;
  return (
    <div className="max-w-2xl mx-auto mt-8 rounded-3xl bg-white border border-slate-200 p-8 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center"><FolderLock className="w-8 h-8" /></div>
      <h2 className="mt-4 text-lg font-extrabold text-slate-800">Chưa có hồ sơ trên máy chủ</h2>
      <p className="mt-2 text-sm text-slate-500">Nhập tệp dữ liệu xuất từ Hệ thống quản lý CBCCVC tỉnh (qlccvc.thanhhoa.gov.vn) để bắt đầu.</p>
      <button onClick={onNhap} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white"><Upload className="w-4 h-4" /> Nhập dữ liệu</button>
    </div>
  );
}

// ===========================================================================
//  TỔNG QUAN
// ===========================================================================
function The({ nhan, so, phu, mau = 'text-slate-800' }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{nhan}</p>
      <p className={`mt-1 text-2xl font-extrabold ${mau}`}>{so}</p>
      {phu && <p className="text-[12px] text-slate-500 mt-0.5">{phu}</p>}
    </div>
  );
}
function Cot({ tieuDe, dl, tong, mau = 'bg-red-600' }) {
  const max = Math.max(1, ...dl.map((x) => x.so));
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <p className="text-[13px] font-bold text-slate-700 mb-3">{tieuDe}</p>
      <div className="space-y-2">
        {dl.map((x) => (
          <div key={x.nhan} className="text-[12px]">
            <div className="flex justify-between gap-2"><span className="text-slate-600 truncate" title={x.nhan}>{x.nhan}</span><span className="font-semibold text-slate-800 shrink-0">{x.so}{tong ? <span className="text-slate-400 font-normal"> · {Math.round((x.so / tong) * 100)}%</span> : null}</span></div>
            <div className="h-2 rounded-full bg-slate-100 mt-1 overflow-hidden"><div className={`h-full rounded-full ${mau}`} style={{ width: `${(x.so / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TongQuan({ goi, ds, onMo, onNhacViec }) {
  const tk = useMemo(() => thongKe(ds), [ds]);
  const nv = useMemo(() => nhacViec(ds).filter((x) => x.muc !== 'thongTin'), [ds]);
  const pct = (a) => (tk.tong ? `${Math.round((a / tk.tong) * 100)}%` : '');
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-start gap-3 text-[13px] text-slate-600">
        <Info className="w-5 h-5 text-sky-600 shrink-0" />
        <div>
          Nguồn: <b>Hệ thống quản lý CBCCVC tỉnh Thanh Hóa</b> ({goi.nguon}) · đơn vị <b>{goi.donVi || '—'}</b>
          {goi.ngayLay && <> · dữ liệu lấy ngày <b>{dmy(goi.ngayLay)}</b></>}
          {goi.capNhat && <> · lưu lần cuối {new Date(goi.capNhat).toLocaleString('vi-VN')}{goi.nguoiCapNhat ? ` bởi ${goi.nguoiCapNhat}` : ''}</>}.
          <span className="block text-slate-400 mt-0.5">Số liệu dưới đây tính lại tại chỗ từ hồ sơ (tuổi tính theo ngày hôm nay).</span>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <The nhan="Tổng số hồ sơ" so={tk.tong} />
        <The nhan="Nữ" so={tk.nu} phu={pct(tk.nu)} />
        <The nhan="Đảng viên" so={tk.dangVien} phu={pct(tk.dangVien)} mau="text-red-700" />
        <The nhan="Tuổi bình quân" so={tk.tuoiTB ?? '—'} />
        <The nhan="Hồ sơ hoàn thiện (TB)" so={`${tk.hoanThienTB}%`} mau={tk.hoanThienTB >= 90 ? 'text-emerald-700' : 'text-amber-700'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Cot tieuDe="Theo đơn vị, phòng ban" dl={tk.theoPhong} tong={tk.tong} />
        <Cot tieuDe="Theo loại cán bộ" dl={tk.theoLoai} tong={tk.tong} mau="bg-sky-600" />
        <Cot tieuDe="Theo độ tuổi" dl={tk.theoTuoi} tong={tk.tong} mau="bg-amber-500" />
        <Cot tieuDe="Trình độ chuyên môn cao nhất" dl={tk.theoTrinhDo} tong={tk.tong} mau="bg-emerald-600" />
        <Cot tieuDe="Lý luận chính trị" dl={tk.theoLLCT} tong={tk.tong} mau="bg-rose-600" />
        <Cot tieuDe="Ngạch, chức danh nghề nghiệp" dl={tk.theoNgach} tong={tk.tong} mau="bg-violet-600" />
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-[13px] font-bold text-slate-700 flex items-center gap-2"><Bell className="w-4 h-4 text-red-700" /> Việc cần theo dõi ({nv.length})</p>
          <button onClick={onNhacViec} className="text-[12px] font-semibold text-red-700 hover:underline">Xem tất cả →</button>
        </div>
        {nv.length ? (
          <div className="grid md:grid-cols-2 gap-2">
            {nv.slice(0, 8).map((x, i) => <DongNhac key={i} x={x} onMo={onMo} />)}
          </div>
        ) : <p className="text-[13px] text-slate-400">Không có việc nào trong thời gian theo dõi.</p>}
      </div>
    </div>
  );
}

function DongNhac({ x, onMo }) {
  const m = MUC[x.muc];
  return (
    <button onClick={() => onMo(x.ma)} className="text-left flex items-stretch gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 overflow-hidden">
      <span className={`w-1.5 shrink-0 ${m.vach}`} />
      <span className="py-2 pr-3 min-w-0 flex-1">
        <span className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${m.mau}`}>{m.nhan}</span>
          <span className="text-[13px] font-semibold text-slate-800">{x.ten}</span>
          <span className="text-[11px] text-slate-400">{x.phong}</span>
        </span>
        <span className="block text-[12px] text-slate-600 mt-0.5">{x.loai === 'sinhNhat' && <Cake className="inline w-3.5 h-3.5 mr-1 text-pink-500" />}{x.tieuDe} — <b>{dmy(x.ngay)}</b> ({conLai(x.con)}){x.chiTiet ? ` · ${x.chiTiet}` : ''}</span>
      </span>
    </button>
  );
}

// ===========================================================================
//  DANH SÁCH
// ===========================================================================
function DanhSach({ ds, onMo, onThem }) {
  const [bl, setBl] = useState({ q: '', phong: '', loai: '', gioi: '', dang: '' });
  const [themMoi, setThemMoi] = useState(null);
  const phongs = useMemo(() => [...new Set(ds.map(phongCua).filter(Boolean))], [ds]);
  const loais = useMemo(() => [...new Set(ds.map((h) => h.loaicanbo_id).filter(Boolean))], [ds]);
  const kq = useMemo(() => loc(ds, bl), [ds, bl]);
  const set = (k) => (e) => setBl((b) => ({ ...b, [k]: e.target.value }));
  const sel = 'text-[13px] px-3 py-2 rounded-xl border border-slate-200 bg-white';

  const xuatExcel = async () => {
    const XLSX = await import('xlsx');
    const dong = kq.map((h, i) => {
      const t = tomTat(h);
      return {
        STT: i + 1, 'Mã cán bộ': t.ma, 'Họ và tên': t.ten, 'Đơn vị/phòng ban': t.phong, 'Chức vụ': t.chucVu,
        'Ngạch/chức danh': t.ngach, 'Mã ngạch': t.maNgach, 'Loại cán bộ': t.loai, 'Giới tính': t.gioiTinh,
        'Ngày sinh': dmy(t.ngaySinh), Tuổi: t.tuoi ?? '', 'Dân tộc': h.vnpt_dan_toc || '', 'Quê quán': h.quequan_tinh_thanhpho_id || '',
        'Trình độ chuyên môn': t.trinhDo, 'Chuyên ngành': h.chuyen_nganh_dao_tao || '', 'Lý luận chính trị': t.llct,
        'Quản lý nhà nước': t.qlnn, 'Ngoại ngữ': h.ngoaingu_caonhat_id || '', 'Tin học': h.tinhoc_caonhat_id || '',
        'Đảng viên': t.dangVien ? 'Có' : '', 'Ngày vào Đảng': dmy(h.vnpt_ngay_vao_dang), 'Bậc': t.bac ?? '', 'Hệ số lương': t.heSo ?? '',
        'Ngày tuyển dụng': dmy(h.ngaytuyendung), 'Ngày vào cơ quan': dmy(h.vnpt_ngay_vao_don_vi),
        'Dự kiến nghỉ hưu': dmy(h.ngay_du_kien_nghi_huu), 'Điện thoại': t.dienThoai, 'Thư điện tử': t.email, 'Hoàn thiện (%)': t.hoanThien,
      };
    });
    const ws = XLSX.utils.json_to_sheet(dong);
    ws['!cols'] = Object.keys(dong[0] || {}).map((k) => ({ wch: Math.min(40, Math.max(8, k.length + 2)) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sach can bo');
    XLSX.writeFile(wb, `Danh-sach-ho-so-can-bo_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={bl.q} onChange={set('q')} placeholder="Tìm theo tên, mã, chức vụ, điện thoại… (gõ không dấu cũng được)" className="w-full text-[13px] pl-9 pr-3 py-2 rounded-xl border border-slate-200" />
        </div>
        <select value={bl.phong} onChange={set('phong')} className={sel}><option value="">Mọi đơn vị</option>{phongs.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={bl.loai} onChange={set('loai')} className={sel}><option value="">Mọi loại cán bộ</option>{loais.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={bl.gioi} onChange={set('gioi')} className={sel}><option value="">Nam, nữ</option><option value="nam">Nam</option><option value="nu">Nữ</option></select>
        <select value={bl.dang} onChange={set('dang')} className={sel}><option value="">Đảng viên: tất cả</option><option value="co">Là đảng viên</option><option value="khong">Chưa là đảng viên</option></select>
        <button onClick={xuatExcel} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"><FileDown className="w-4 h-4" /> Excel ({kq.length})</button>
        <button onClick={() => setThemMoi({ ma: '', ten: '' })} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><UserPlus className="w-4 h-4" /> Thêm hồ sơ</button>
      </div>

      {themMoi && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-wrap gap-2 items-end text-[13px]">
          <label className="flex flex-col gap-1">Mã cán bộ<input value={themMoi.ma} onChange={(e) => setThemMoi({ ...themMoi, ma: e.target.value })} className="px-3 py-2 rounded-lg border border-amber-200" /></label>
          <label className="flex flex-col gap-1 flex-1 min-w-[200px]">Họ và tên<input value={themMoi.ten} onChange={(e) => setThemMoi({ ...themMoi, ten: e.target.value })} className="px-3 py-2 rounded-lg border border-amber-200" /></label>
          <button disabled={!themMoi.ma.trim() || !themMoi.ten.trim() || ds.some((h) => h.vnpt_ma_nhan_vien === themMoi.ma.trim())}
            onClick={() => { onThem(hoSoMoi(themMoi.ma, themMoi.ten)); setThemMoi(null); }}
            className="px-4 py-2 rounded-lg bg-red-700 text-white font-semibold disabled:opacity-40">Tạo hồ sơ</button>
          <button onClick={() => setThemMoi(null)} className="px-3 py-2 rounded-lg bg-white border border-amber-200">Hủy</button>
          {ds.some((h) => h.vnpt_ma_nhan_vien === themMoi.ma.trim()) && <p className="w-full text-red-700 text-[12px]">Mã cán bộ này đã có.</p>}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
            <tr>{['#', 'Cán bộ', 'Đơn vị / chức vụ', 'Ngạch, chức danh', 'Ngày sinh', 'Trình độ · LLCT', 'Hoàn thiện'].map((c) => <th key={c} className="text-left font-semibold px-3 py-2.5 whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody>
            {kq.map((h, i) => {
              const t = tomTat(h);
              return (
                <tr key={t.ma} onClick={() => onMo(t.ma)} className="border-t border-slate-100 hover:bg-red-50/40 cursor-pointer">
                  <td className="px-3 py-2.5 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold ${t.gioiTinh === 'Nữ' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>{chuDau(t.ten)}</span>
                      <span className="min-w-0"><span className="block font-semibold text-slate-800">{t.ten}</span><span className="block text-[11px] text-slate-400">{t.ma} · {t.loai}{t.dangVien ? ' · Đảng viên' : ''}</span></span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><span className="block text-slate-700">{t.phong}</span><span className="block text-[11px] text-slate-500 max-w-[260px] truncate" title={t.chucVu}>{t.chucVu || '—'}</span></td>
                  <td className="px-3 py-2.5 text-slate-600"><span className="block">{t.ngach}</span><span className="text-[11px] text-slate-400">{t.maNgach}{t.bac != null ? ` · bậc ${t.bac}` : ''}{t.heSo != null ? ` · hệ số ${t.heSo}` : ''}</span></td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{dmy(t.ngaySinh)}<span className="block text-[11px] text-slate-400">{t.tuoi != null ? `${t.tuoi} tuổi` : ''}</span></td>
                  <td className="px-3 py-2.5 text-slate-600"><span className="block">{t.trinhDo || '—'}</span><span className="text-[11px] text-slate-400">{t.llct || ''}</span></td>
                  <td className="px-3 py-2.5 w-28">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${t.hoanThien >= 90 ? 'bg-emerald-500' : t.hoanThien >= 70 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${t.hoanThien}%` }} /></div>
                    <span className="text-[11px] text-slate-500">{t.hoanThien}%</span>
                  </td>
                </tr>
              );
            })}
            {!kq.length && <tr><td colSpan={7} className="px-3 py-10 text-center text-slate-400">Không có hồ sơ nào khớp bộ lọc.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===========================================================================
//  NHẮC VIỆC
// ===========================================================================
function NhacViec({ ds, onMo }) {
  const [loai, setLoai] = useState('');
  const all = useMemo(() => nhacViec(ds), [ds]);
  const kq = loai ? all.filter((x) => x.loai === loai) : all;
  const thieu = useMemo(() => ds.map((h) => ({ h, ...doHoanThien(h) })).filter((x) => x.thieu.length).sort((a, b) => a.tyLe - b.tyLe), [ds]);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-slate-200 p-4 text-[12px] text-slate-500 leading-relaxed">
        Nhắc việc rút thẳng từ hồ sơ, không phải nhập thêm: <b>nâng lương</b> theo "thời gian dự kiến điều chỉnh lương lần sau" của diễn biến lương mới nhất (báo trước {NGUONG.nangLuong} ngày) ·
        <b> nghỉ hưu</b> theo ngày dự kiến của hệ thống nguồn (trước {NGUONG.nghiHuu} ngày) · <b>thời hạn giữ chức vụ</b> 05 năm kể từ ngày bổ nhiệm (lại) gần nhất (trước {NGUONG.boNhiem} ngày) ·
        <b> phụ cấp</b> có thời hạn (trước {NGUONG.phuCap} ngày) · <b>sinh nhật</b> trong {NGUONG.sinhNhat} ngày tới.
      </div>
      <div className="flex gap-2 flex-wrap">
        {[['', `Tất cả (${all.length})`], ...Object.entries(LOAI_NHAC).map(([k, n]) => [k, `${n} (${all.filter((x) => x.loai === k).length})`])].map(([k, n]) => (
          <button key={k || 'tat'} onClick={() => setLoai(k)} className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${loai === k ? 'bg-red-700 text-white border-red-700' : 'bg-white border-slate-200 text-slate-600'}`}>{n}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {kq.map((x, i) => <DongNhac key={i} x={x} onMo={onMo} />)}
        {!kq.length && <p className="text-[13px] text-slate-400">Không có việc nào.</p>}
      </div>
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <p className="text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-600" /> Hồ sơ còn thiếu trường bắt buộc ({thieu.length})</p>
        <div className="divide-y divide-slate-100">
          {thieu.map(({ h, tyLe, thieu: t }) => (
            <button key={h.vnpt_ma_nhan_vien} onClick={() => onMo(h.vnpt_ma_nhan_vien)} className="w-full text-left py-2 text-[12px] hover:bg-slate-50 flex gap-3">
              <span className="w-12 shrink-0 font-bold text-amber-700">{tyLe}%</span>
              <span><b className="text-slate-800">{hoTen(h)}</b> <span className="text-slate-400">({phongCua(h)})</span> — thiếu: {t.join(', ')}</span>
            </button>
          ))}
          {!thieu.length && <p className="text-[12px] text-emerald-700 py-2">Mọi hồ sơ đã đủ các trường bắt buộc.</p>}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
//  HỒ SƠ CHI TIẾT (xem + sửa)
// ===========================================================================
function ONhap({ def, v, onChange }) {
  const cls = 'w-full text-[13px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-red-400 focus:outline-none';
  if (def.kieu === 'bool') return <input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-red-700" />;
  if (def.kieu === 'date') return <input type="date" value={typeof v === 'string' ? v.slice(0, 10) : ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
  if (def.kieu === 'number') return <input type="number" step="any" value={v ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} className={cls} />;
  if (def.kieu === 'chon') {
    const opt = CHON[def.chon] || {};
    return <select value={v ?? ''} onChange={(e) => onChange(e.target.value)} className={cls}><option value="">—</option>{Object.entries(opt).map(([k, n]) => <option key={k} value={k}>{n}</option>)}{v && !(v in opt) && <option value={v}>{v}</option>}</select>;
  }
  if (def.kieu === 'list') return <input value={Array.isArray(v) ? v.join('; ') : (v || '')} onChange={(e) => onChange(e.target.value.split(';').map((x) => x.trim()).filter(Boolean))} placeholder="phân cách bằng dấu ;" className={cls} />;
  if (def.kieu === 'area') return <textarea rows={3} value={v ?? ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
  return <input value={v ?? ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
}

function BangQuaTrinh({ k, rows, sua, onChange, nhanBang }) {
  const def = BANG[k] || {
    ten: k, sapXep: null,
    cot: Object.entries(nhanBang[k] || {}).map(([c, n]) => ({ k: c, nhan: n, kieu: 'text' })),
  };
  // Khi xem: chỉ hiện cột có dữ liệu cho bảng gọn; khi sửa: hiện đủ cột.
  const cot = sua ? def.cot : def.cot.filter((c) => rows.some((r) => r[c.k] !== undefined && r[c.k] !== '' && r[c.k] !== null && r[c.k] !== false));
  const dsRow = sua ? rows : (def.sapXep ? [...rows].sort((a, b) => String(b[def.sapXep] || '').localeCompare(String(a[def.sapXep] || ''))) : rows);
  const doi = (i, c, v) => onChange(rows.map((r, j) => (j === i ? { ...r, [c]: v } : r)));
  if (!sua && !rows.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-slate-700">{def.ten} <span className="text-slate-400 font-normal">({rows.length})</span></p>
        {sua && <button onClick={() => onChange([...rows, {}])} className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-700 hover:underline"><Plus className="w-3.5 h-3.5" /> Thêm dòng</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="text-slate-500"><tr>{cot.map((c) => <th key={c.k} className="text-left font-semibold px-3 py-2 whitespace-nowrap">{c.nhan}</th>)}{sua && <th />}</tr></thead>
          <tbody>
            {dsRow.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 align-top">
                {cot.map((c) => (
                  <td key={c.k} className={`px-3 py-2 ${sua ? 'min-w-[140px]' : ''} ${c.kieu === 'area' && !sua ? 'min-w-[260px]' : ''}`}>
                    {sua ? <ONhap def={c} v={r[c.k]} onChange={(v) => doi(i, c.k, v)} /> : <span className="text-slate-700 whitespace-pre-line">{hienThi(c, r[c.k])}</span>}
                  </td>
                ))}
                {sua && <td className="px-2 py-2"><button onClick={() => onChange(rows.filter((_, j) => j !== i))} title="Xóa dòng" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>}
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={cot.length + 1} className="px-3 py-4 text-slate-400">Chưa có dòng nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChiTiet({ h, ds, nhan, nhanBang, onLuu, onXoa, onMo, onDong, dangLuu }) {
  const [nhom, setNhom] = useState('chung');
  const [sua, setSua] = useState(false);
  const [ban, setBan] = useState(h);
  const [anTrong, setAnTrong] = useState(false);
  const daDoi = useRef(false);
  useEffect(() => { if (!sua) { setBan(h); daDoi.current = false; } }, [h, sua]);

  const t = tomTat(sua ? ban : h);
  const hoanThien = doHoanThien(sua ? ban : h);
  const khac = useMemo(() => truongKhac(h, nhan), [h, nhan]);
  const viTri = ds.findIndex((x) => x.vnpt_ma_nhan_vien === h.vnpt_ma_nhan_vien);
  const truoc = ds[viTri - 1], sau = ds[viTri + 1];
  const nhomDs = [...NHOM, ...(khac.length ? [{ id: 'khacngoai', ten: `Trường khác (${khac.length})`, bieuTuong: 'FileText', truong: [] }] : [])];
  const n = nhomDs.find((x) => x.id === nhom) || NHOM[0];
  const doi = (k, v) => { daDoi.current = true; setBan((b) => { const c = { ...b }; if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) delete c[k]; else c[k] = v; return c; }); };
  const nguon = sua ? ban : h;
  const demNhom = (g) => g.truong.filter((d) => { const v = nguon[d.k]; return v !== undefined && v !== '' && v !== false && !(Array.isArray(v) && !v.length); }).length
    + (g.bang || []).reduce((a, k) => a + (Array.isArray(nguon[k]) ? nguon[k].length : 0), 0);

  const roiDi = (fn) => { if (sua && daDoi.current && !window.confirm('Bỏ các thay đổi chưa lưu?')) return; setSua(false); fn(); };
  const xuat2C = async () => {
    const { exportLyLich2C } = await import('./lib/export2C');
    await exportLyLich2C(sang2C(h), DON_VI);
  };

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-5 items-start">
      {/* Thẻ hồ sơ */}
      <aside className="lg:sticky lg:top-4 space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={() => roiDi(onDong)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="w-4 h-4" /> Danh sách</button>
          <span className="flex-1" />
          <button disabled={!truoc} onClick={() => roiDi(() => onMo(truoc.vnpt_ma_nhan_vien))} title="Hồ sơ trước" className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-[11px] text-slate-400">{viTri + 1}/{ds.length}</span>
          <button disabled={!sau} onClick={() => roiDi(() => onMo(sau.vnpt_ma_nhan_vien))} title="Hồ sơ sau" className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-red-800 to-red-600 px-5 pt-6 pb-10 text-white text-center">
            <span className="w-20 h-20 mx-auto rounded-full bg-white/95 text-red-800 flex items-center justify-center text-2xl font-extrabold shadow-lg">{chuDau(t.ten)}</span>
          </div>
          <div className="-mt-6 px-5 pb-5 text-center">
            <div className="rounded-2xl bg-white shadow border border-slate-100 px-3 py-3">
              <p className="text-[16px] font-extrabold text-slate-800 leading-snug">{t.ten}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{t.chucVu || t.ngach}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1"><Building2 className="w-3 h-3" /> {t.phong}</p>
            </div>
            <dl className="mt-4 text-left text-[12px] space-y-1.5">
              {[['Mã cán bộ', t.ma], ['Loại cán bộ', t.loai], ['Ngày sinh', `${dmy(t.ngaySinh)}${t.tuoi != null ? ` (${t.tuoi} tuổi)` : ''}`], ['Giới tính', t.gioiTinh],
                ['Ngạch', `${t.ngach}${t.maNgach ? ` (${t.maNgach})` : ''}`], ['Bậc · hệ số', [t.bac, t.heSo].filter((x) => x != null).join(' · ')],
                ['Trình độ', t.trinhDo], ['LLCT', t.llct], ['Đảng viên', t.dangVien ? `Có${h.vnpt_ngay_vao_dang ? ` — vào Đảng ${dmy(h.vnpt_ngay_vao_dang)}` : ''}` : 'Không'],
                ['Điện thoại', t.dienThoai], ['Thư điện tử', t.email]].map(([a, b]) => (
                <div key={a} className="flex gap-2"><dt className="w-24 shrink-0 text-slate-400">{a}</dt><dd className="text-slate-700 break-words min-w-0">{b || '—'}</dd></div>
              ))}
            </dl>
            <div className="mt-4 text-left">
              <div className="flex justify-between text-[11px] text-slate-500"><span>Hoàn thiện hồ sơ</span><b>{hoanThien.tyLe}%</b></div>
              <div className="h-2 rounded-full bg-slate-100 mt-1 overflow-hidden"><div className={`h-full ${hoanThien.tyLe >= 90 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${hoanThien.tyLe}%` }} /></div>
              {!!hoanThien.thieu.length && <p className="text-[11px] text-amber-700 mt-1.5">Thiếu: {hoanThien.thieu.join(', ')}</p>}
            </div>
            {h._capNhat && <p className="mt-3 text-[11px] text-slate-400 text-left">Sửa trên phần mềm lúc {new Date(h._capNhat.luc).toLocaleString('vi-VN')}{h._capNhat.boi ? ` bởi ${h._capNhat.boi}` : ''} — khác bản QLCCVC.</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sua ? (
            <>
              <button disabled={dangLuu} onClick={async () => { if (await onLuu(ban)) setSua(false); }} className="col-span-2 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-3 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white disabled:opacity-50"><Save className="w-4 h-4" /> Lưu hồ sơ</button>
              <button onClick={() => roiDi(() => {})} className="col-span-2 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200"><X className="w-4 h-4" /> Hủy sửa</button>
            </>
          ) : (
            <>
              <button onClick={() => { setBan(h); daDoi.current = false; setSua(true); }} className="inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><Pencil className="w-4 h-4" /> Sửa</button>
              <button onClick={xuat2C} className="inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white"><FileDown className="w-4 h-4" /> Mẫu 2C</button>
              <button onClick={() => onXoa(h)} className="col-span-2 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Xóa hồ sơ khỏi phân hệ</button>
            </>
          )}
        </div>
      </aside>

      {/* Nội dung */}
      <section className="min-w-0 space-y-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {nhomDs.map((g) => {
            const Ic = ICON_NHOM[g.bieuTuong] || FileText;
            const so = g.id === 'khacngoai' ? khac.length : demNhom(g);
            return (
              <button key={g.id} onClick={() => setNhom(g.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border ${nhom === g.id ? 'bg-red-700 text-white border-red-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                <Ic className="w-4 h-4" /> {g.ten}{so ? <span className={`text-[10px] px-1.5 rounded-full ${nhom === g.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{so}</span> : null}
              </button>
            );
          })}
        </div>
        {sua && <p className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Đang sửa hồ sơ. Thay đổi chỉ lưu ở phần mềm này, <b>không tự cập nhật ngược về hệ thống QLCCVC của tỉnh</b> — nhập lại tệp từ QLCCVC sẽ thay bằng bản của tỉnh.</p>}

        {n.id === 'khacngoai' ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {khac.map((x) => (
              <div key={x.k}><p className="text-[11px] text-slate-400">{x.nhan}</p><p className="text-[13px] text-slate-700 break-words">{Array.isArray(x.v) ? x.v.join('; ') : typeof x.v === 'boolean' ? 'Có' : String(x.v)}</p></div>
            ))}
          </div>
        ) : (
          <>
            {!!n.truong.length && (
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-bold text-slate-800">{n.ten}</p>
                  {!sua && <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={anTrong} onChange={(e) => setAnTrong(e.target.checked)} className="accent-red-700" /> Ẩn ô trống</label>}
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
                  {n.truong.map((d) => {
                    const v = nguon[d.k];
                    const txt = hienThi(d, v);
                    if (!sua && anTrong && !txt) return null;
                    return (
                      <div key={d.k} className={d.kieu === 'area' ? 'sm:col-span-2 xl:col-span-3' : ''}>
                        <p className="text-[11px] text-slate-400">{d.nhan}</p>
                        {sua ? <div className="mt-0.5"><ONhap def={d} v={v} onChange={(x) => doi(d.k, x)} /></div>
                          : <p className={`text-[13px] break-words whitespace-pre-line ${txt ? 'text-slate-800' : 'text-slate-300'}`}>{txt || '—'}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(n.bang || []).map((k) => (
              <BangQuaTrinh key={k} k={k} rows={Array.isArray(nguon[k]) ? (sua ? nguon[k] : bangSapXep(nguon, k)) : []} sua={sua} nhanBang={nhanBang}
                onChange={(rows) => doi(k, rows)} />
            ))}
            {!n.truong.length && !(n.bang || []).some((k) => Array.isArray(nguon[k]) && nguon[k].length) && !sua && (
              <p className="text-[13px] text-slate-400 bg-white border border-slate-200 rounded-2xl p-6 text-center">Nhóm này chưa có dữ liệu. Bấm <b>Sửa</b> để thêm.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ===========================================================================
//  NHẬP / XUẤT DỮ LIỆU
// ===========================================================================
function NhapXuat({ goi, ds, onGhi, dangLuu }) {
  const [chu, setChu] = useState('');
  const [tenTep, setTenTep] = useState('');
  const kq = useMemo(() => (chu.trim() ? docTepNhap(chu) : null), [chu]);
  const ghep = useMemo(() => (kq?.ok ? ghepGoi(goi, kq.goi) : null), [kq, goi]);

  const docTep = async (f) => {
    if (!f) return;
    setTenTep(f.name);
    setChu(await f.text());
  };
  const apDung = async () => {
    if (!ghep) return;
    if (ghep.suaTay.length && !window.confirm(`${ghep.suaTay.length} hồ sơ đã được sửa trên phần mềm sau lần nhập trước sẽ bị THAY bằng bản trong tệp (${ghep.suaTay.join(', ')}). Tiếp tục?`)) return;
    const okk = await onGhi(ghep.goi, `Đã nhập ${kq.goi.ds.length} hồ sơ (thêm ${ghep.them}, cập nhật ${ghep.capNhat}).`);
    if (okk) { setChu(''); setTenTep(''); }
  };
  const saoLuu = () => {
    if (!window.confirm('Tệp sao lưu chứa TOÀN BỘ dữ liệu cá nhân của các hồ sơ (số định danh, gia đình, tài sản…). Chỉ lưu ở nơi an toàn, không gửi qua kênh công cộng. Tiếp tục?')) return;
    const blob = new Blob([JSON.stringify({ ...goi, ds }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ho-so-can-bo_sao-luu_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
      <div className="space-y-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <p className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><Upload className="w-4 h-4 text-red-700" /> Nhập dữ liệu từ Hệ thống quản lý CBCCVC tỉnh</p>
          <p className="text-[12px] text-slate-500 mt-1">Chọn tệp <b>.json</b> chứa hồ sơ xuất từ qlccvc.thanhhoa.gov.vn (mỗi hồ sơ giữ nguyên tên trường của hệ thống nguồn), hoặc dán nội dung tệp vào ô dưới. Hồ sơ ghép theo <b>Mã cán bộ</b>: mã đã có thì cập nhật, mã mới thì thêm, hồ sơ không có trong tệp được giữ nguyên.</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <label className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white cursor-pointer">
              <Upload className="w-4 h-4" /> Chọn tệp .json
              <input id="hoso-tep-nhap" type="file" accept=".json,application/json" className="hidden" onChange={(e) => docTep(e.target.files?.[0])} />
            </label>
            {tenTep && <span className="text-[12px] text-slate-500">{tenTep}</span>}
            {chu && <button onClick={() => { setChu(''); setTenTep(''); }} className="text-[12px] text-slate-500 hover:underline">Xóa</button>}
          </div>
          <textarea id="hoso-dan" value={chu.length > 4000 ? `${chu.slice(0, 4000)}\n… (${chu.length.toLocaleString('vi-VN')} ký tự)` : chu}
            onChange={(e) => setChu(e.target.value)} onPaste={(e) => { e.preventDefault(); setTenTep('(dán từ bộ nhớ tạm)'); setChu(e.clipboardData.getData('text')); }}
            readOnly={chu.length > 4000} rows={5} placeholder="…hoặc dán nội dung tệp vào đây (Ctrl+V)"
            className="mt-3 w-full text-[12px] font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50" />

          {kq && !kq.ok && <p className="mt-3 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{kq.loi}</p>}
          {kq?.ok && ghep && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-900">
              <p className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Tệp hợp lệ: {kq.goi.ds.length} hồ sơ{kq.goi.donVi ? ` — ${kq.goi.donVi}` : ''}{kq.goi.ngayLay ? `, lấy ngày ${dmy(kq.goi.ngayLay)}` : ''}</p>
              <ul className="mt-2 space-y-0.5 text-[12px]">
                <li>• Thêm mới: <b>{ghep.them}</b> · cập nhật: <b>{ghep.capNhat}</b> · giữ nguyên (không có trong tệp): <b>{ghep.giuLai}</b></li>
                <li>• Bảng quá trình: <b>{kq.goi.ds.reduce((a, h) => a + Object.values(h).filter(Array.isArray).reduce((b, r) => b + (typeof r[0] === 'object' ? r.length : 0), 0), 0).toLocaleString('vi-VN')}</b> dòng</li>
                {kq.boQua > 0 && <li className="text-amber-800">• Bỏ qua {kq.boQua} bản ghi thiếu mã cán bộ hoặc họ tên.</li>}
                {!!ghep.suaTay.length && <li className="text-amber-800">• {ghep.suaTay.length} hồ sơ đã sửa tay trên phần mềm sẽ bị thay bằng bản của tỉnh.</li>}
              </ul>
              <button disabled={dangLuu} onClick={apDung} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50"><Save className="w-4 h-4" /> Ghi lên máy chủ</button>
            </div>
          )}
        </div>

        {goi && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><Download className="w-4 h-4 text-red-700" /> Xuất dữ liệu</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={saoLuu} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"><Download className="w-4 h-4" /> Sao lưu toàn bộ (.json)</button>
            </div>
            <p className="text-[12px] text-slate-500 mt-2">Danh sách Excel: ở tab <b>Danh sách</b> (theo bộ lọc đang chọn). Sơ yếu lý lịch Mẫu 2C: mở từng hồ sơ, bấm <b>Mẫu 2C</b>.</p>
          </div>
        )}
      </div>

      <aside className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[12px] text-amber-900 leading-relaxed space-y-2">
        <p className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Dữ liệu cá nhân — lưu ý khi dùng</p>
        <p>• Dữ liệu chỉ được ghi vào dòng <code>hr_data</code> trên máy chủ, nơi chỉ email Quản trị đọc được; phần mềm <b>không lưu</b> hồ sơ vào bộ nhớ trình duyệt.</p>
        <p>• Bản chính thống vẫn là <b>Hệ thống quản lý CBCCVC tỉnh</b>. Sửa ở đây không cập nhật ngược về hệ thống tỉnh.</p>
        <p>• Chỉ nhập hồ sơ thuộc thẩm quyền quản lý của cơ quan. Tệp sao lưu chứa đủ số định danh, gia đình, tài sản — giữ ở nơi an toàn.</p>
        {goi?.ds?.length ? <p>• Đang có <b>{goi.ds.length}</b> hồ sơ{goi.capNhat ? `, lưu lần cuối ${new Date(goi.capNhat).toLocaleString('vi-VN')}` : ''}.</p> : null}
      </aside>
    </div>
  );
}

