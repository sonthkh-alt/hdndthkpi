// ============================================================================
//  PHÂN HỆ "TỦ SÁCH — GIỚI THIỆU SÁCH DO CÁN BỘ CƠ QUAN BIÊN SOẠN"  (#/tusach)
//
//  Ba lối xem:
//   ① Tủ sách    — cuốn tiêu điểm cỡ lớn + lưới các cuốn còn lại + ô tìm kiếm.
//   ② Giới thiệu — một cuốn: bìa, thông tin, tóm tắt, điểm nổi bật, đối tượng
//                  bạn đọc, mục lục đầy đủ, trích lời nói đầu, về tác giả.
//   ③ Đọc sách   — mở bản toàn văn ngay trong trang (chỉ khi tác giả cho phép).
//
//  ⚠️ Nút Đọc / Tải CHỈ hiện khi cuốn sách có cả tệp toàn văn LẪN cờ `choTai`
//     (xem `docDuoc` trong src/lib/tuSach.js). Trang web này công khai nên việc
//     công khai toàn văn phải là quyết định có ý thức của tác giả, không phải
//     mặc định của phần mềm.
// ============================================================================
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Home, Library, BookOpen, Search, ArrowLeft, Download, ExternalLink, Pencil,
  Plus, Trash2, Save, X, Users, ListTree, Quote, UserRound, FileText, Layers,
  CheckCircle2, AlertTriangle, Info, Maximize2, Tag,
} from 'lucide-react';
import { getSession, onAuthChange } from './lib/auth';
import {
  TRANG_THAI, trangThaiOf, THE_LOAI, newSach, newId,
  sachNoiBat, sapXep, docDuoc, nhomMucLuc, thongKe, timSach, nhanMuc,
  dongThanhMang, mangThanhDong, dongThanhMucLuc, mucLucThanhDong,
  dongThanhCap, capThanhDong,
} from './lib/tuSach';
import { fetchTS, saveTS, khoiTaoNeuTrong } from './lib/tuSachStore';

const inp = 'w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] text-slate-700 outline-none focus:border-amber-400 disabled:bg-slate-50 disabled:text-slate-500';
const lab = 'text-[11px] font-semibold text-slate-500 mb-1 block';
const nutChinh = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const nutPhu = 'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-50';

/** Khung bìa sách: có ảnh thì dùng ảnh, chưa có (hoặc ảnh lỗi) thì vẽ bìa chữ. */
function Bia({ s, className = '' }) {
  const [loi, setLoi] = useState(false);
  if (s.anhBia && !loi) {
    return <img src={s.anhBia} alt={`Bìa sách ${s.ten}`} onError={() => setLoi(true)}
      className={`w-full h-full object-cover ${className}`} />;
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br from-[#1e1b4b] via-[#3730a3] to-[#4c1d95] text-white flex flex-col justify-between p-4 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">{s.theLoai}</p>
      <p className="text-base font-extrabold leading-tight">{s.ten}</p>
      <p className="text-[11px] text-indigo-100">{s.tacGia}</p>
    </div>
  );
}

function Nhan({ s }) {
  const t = trangThaiOf(s.trangThai);
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${t.tone}`}>{t.ten}</span>;
}

export default function TuSach({ onHome }) {
  const [doc, setDoc] = useState(null);
  const [phien, setPhien] = useState(null);
  const [man, setMan] = useState({ k: 'tusach' });   // { k:'tusach'|'sach'|'doc'|'quantri', id }
  const [tim, setTim] = useState('');
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState(null);
  const daKhoiTao = useRef(false);

  const coQuyenGhi = !!phien;
  const bao = useCallback((kieu, chu) => { setThongBao({ kieu, chu }); setTimeout(() => setThongBao(null), 5200); }, []);

  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); });
    const off = onAuthChange((s) => setPhien(s || null));
    fetchTS().then((d) => { if (alive) setDoc(khoiTaoNeuTrong(d).doc); });
    return () => { alive = false; off && off(); };
  }, []);

  // Người đăng nhập đầu tiên mở phân hệ mà máy chủ chưa có gì → ghi bộ khởi tạo
  // lên máy chủ để mọi người cùng thấy một bản ("dữ liệu mẫu = dữ liệu chính thống").
  useEffect(() => {
    if (!doc || !coQuyenGhi || daKhoiTao.current) return;
    if (doc.capNhat) { daKhoiTao.current = true; return; }
    daKhoiTao.current = true;
    saveTS(doc).then((r) => { if (r.ok) setDoc(r.doc); });
  }, [doc, coQuyenGhi]);

  const luu = async (d) => {
    setDoc(d);
    if (!coQuyenGhi) { bao('canh', 'Thay đổi chỉ nằm trên máy này — hãy đăng nhập để lưu lên máy chủ.'); return; }
    setDangLuu(true);
    const r = await saveTS(d);
    setDangLuu(false);
    if (r.ok) { setDoc(r.doc); bao('ok', 'Đã lưu lên máy chủ.'); }
    else bao('loi', 'Chưa lưu được lên máy chủ — bản trên máy vẫn giữ.');
  };

  const dsSapXep = useMemo(() => sapXep(doc?.sach), [doc]);
  const dsLoc = useMemo(() => timSach(dsSapXep, tim), [dsSapXep, tim]);
  const dangXem = (doc?.sach || []).find((s) => s.id === man.id) || null;

  if (!doc) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Đang nạp tủ sách…</div>;

  const moSach = (id) => { setMan({ k: 'sach', id }); window.scrollTo({ top: 0 }); };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#92400e] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/40 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-200">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Tủ sách — giới thiệu sách của cán bộ cơ quan</h1>
              <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">Sách chuyên môn · cẩm nang nghiệp vụ · tài liệu bồi dưỡng</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {dangLuu && <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20">Đang lưu…</span>}
            {coQuyenGhi && (
              <button onClick={() => setMan({ k: man.k === 'quantri' ? 'tusach' : 'quantri' })}
                className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/25 hover:bg-white/20 inline-flex items-center gap-1.5">
                {man.k === 'quantri' ? <><Library className="w-3.5 h-3.5" /> Xem tủ sách</> : <><Pencil className="w-3.5 h-3.5" /> Quản lý tủ sách</>}
              </button>
            )}
            <span className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${coQuyenGhi ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-50' : 'bg-amber-400/20 border-amber-200/30 text-amber-50'}`}>
              {coQuyenGhi ? 'Đã đăng nhập · ghi được' : 'Khách · chỉ xem'}
            </span>
          </div>
        </div>
      </header>

      {thongBao && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <div className={`rounded-xl border px-4 py-2.5 text-[13px] flex items-start gap-2 ${thongBao.kieu === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : thongBao.kieu === 'canh' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {thongBao.kieu === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{thongBao.chu}</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {man.k === 'tusach' && (
          <KeSach doc={doc} ds={dsLoc} tong={dsSapXep} tim={tim} onTim={setTim} onMo={moSach} onDoc={(id) => setMan({ k: 'doc', id })} />
        )}
        {man.k === 'sach' && dangXem && (
          <GioiThieuSach s={dangXem} onVe={() => setMan({ k: 'tusach' })} onDoc={() => setMan({ k: 'doc', id: dangXem.id })} />
        )}
        {man.k === 'doc' && dangXem && (
          <DocSach s={dangXem} onVe={() => setMan({ k: 'sach', id: dangXem.id })} />
        )}
        {(man.k === 'sach' || man.k === 'doc') && !dangXem && (
          <p className="text-sm text-slate-500">Không tìm thấy cuốn sách này. <button onClick={() => setMan({ k: 'tusach' })} className="text-amber-700 font-semibold underline">Về tủ sách</button></p>
        )}
        {man.k === 'quantri' && (
          <QuanLy doc={doc} onLuu={luu} coQuyenGhi={coQuyenGhi} onXem={moSach} bao={bao} />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 text-[11px] text-slate-400 leading-relaxed">
        Bản demo thử nghiệm phục vụ nội bộ. Bản quyền tác phẩm thuộc về tác giả; phần toàn văn chỉ mở khi tác giả cho phép.
      </footer>
    </div>
  );
}

// ============================================================================
//  ① KỆ SÁCH — cuốn tiêu điểm + lưới các cuốn còn lại
// ============================================================================
function KeSach({ doc, ds, tong, tim, onTim, onMo, onDoc }) {
  const tk = useMemo(() => thongKe(tong), [tong]);
  const noiBat = sachNoiBat(ds);
  const conLai = ds.filter((s) => s.id !== noiBat?.id);

  return (
    <>
      {doc.gioiThieu && <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed max-w-3xl">{doc.gioiThieu}</p>}

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { ten: 'Đầu sách', so: tk.tong, icon: Library },
          { ten: 'Tác giả', so: tk.tacGia, icon: UserRound },
          { ten: 'Đọc toàn văn', so: tk.docDuoc, icon: BookOpen },
          { ten: 'Tổng số trang', so: tk.tongTrang, icon: FileText },
        ].map((t) => { const Ic = t.icon; return (
          <div key={t.ten} className="rounded-xl border border-slate-200 bg-white p-3.5">
            <Ic className="w-4 h-4 text-amber-700" />
            <p className="text-xl font-extrabold text-slate-800 mt-1.5">{t.so}</p>
            <p className="text-[11px] text-slate-500 font-semibold">{t.ten}</p>
          </div>
        ); })}
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={tim} onChange={(e) => onTim(e.target.value)} placeholder="Tìm theo tên sách, tác giả, từ khóa…"
          className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:border-amber-400" />
      </div>

      {!ds.length && (
        <p className="mt-8 text-sm text-slate-500">{tim ? 'Không có cuốn nào khớp từ khóa này.' : 'Tủ sách chưa có cuốn nào.'}</p>
      )}

      {noiBat && (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
          <div className="grid md:grid-cols-[220px_1fr]">
            <button onClick={() => onMo(noiBat.id)} title="Xem giới thiệu sách"
              className="relative group bg-slate-100 aspect-[2/3] md:aspect-auto md:h-full overflow-hidden">
              <Bia s={noiBat} className="group-hover:scale-[1.02] transition-transform duration-300" />
            </button>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-700 text-white">Cuốn tiêu điểm</span>
                <Nhan s={noiBat} />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-2.5 leading-tight">{noiBat.ten}</h2>
              {noiBat.phuDe && <p className="text-[13px] text-amber-800 font-semibold mt-1">{noiBat.phuDe}</p>}
              <p className="text-[13px] text-slate-600 mt-2"><b>{noiBat.tacGia}</b>{noiBat.hocVi ? ` — ${noiBat.hocVi}` : ''}</p>
              <p className="text-[13px] text-slate-600 mt-3 leading-relaxed">{(noiBat.tomTat || '').split('\n\n')[0]}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                {!!noiBat.soTrang && <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-semibold">{noiBat.soTrang} trang</span>}
                {!!noiBat.soChuong && <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-semibold">{noiBat.soChuong} chương</span>}
                {!!noiBat.soPhuLuc && <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-semibold">{noiBat.soPhuLuc} phụ lục</span>}
                {noiBat.namHoanThanh && <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-semibold">{noiBat.namHoanThanh}</span>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => onMo(noiBat.id)} className={nutChinh}><Info className="w-4 h-4" /> Xem giới thiệu</button>
                {docDuoc(noiBat) && <button onClick={() => onDoc(noiBat.id)} className={nutPhu}><BookOpen className="w-4 h-4" /> Đọc sách</button>}
              </div>
            </div>
          </div>
        </section>
      )}

      {!!conLai.length && (
        <section className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Các đầu sách khác</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {conLai.map((s) => (
              <button key={s.id} onClick={() => onMo(s.id)}
                className="group text-left bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                <div className="aspect-[3/2] bg-slate-100 overflow-hidden"><Bia s={s} className="group-hover:scale-105 transition-transform duration-300" /></div>
                <div className="p-4 flex-1 flex flex-col">
                  <Nhan s={s} />
                  <h3 className="font-extrabold text-slate-800 text-[15px] leading-snug mt-2">{s.ten}</h3>
                  <p className="text-[12px] text-slate-500 mt-1 flex-1">{s.tacGia}{s.namHoanThanh ? ` · ${s.namHoanThanh}` : ''}</p>
                  <span className="mt-3 text-[13px] font-bold text-amber-700 inline-flex items-center gap-1.5">Xem giới thiệu <ExternalLink className="w-3.5 h-3.5" /></span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ============================================================================
//  ② GIỚI THIỆU MỘT CUỐN SÁCH
// ============================================================================
function GioiThieuSach({ s, onVe, onDoc }) {
  const nhom = useMemo(() => nhomMucLuc(s.mucLuc), [s]);
  const doan = (s.tomTat || '').split('\n\n').filter(Boolean);
  const tieuSu = (s.tieuSuTacGia || '').split('\n\n').filter(Boolean);
  const mo = docDuoc(s);

  return (
    <>
      <button onClick={onVe} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Về tủ sách</button>

      <div className="mt-4 grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
        {/* ---- Cột bìa + thông tin ---- */}
        <aside className="lg:sticky lg:top-6 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg aspect-[2/3] bg-slate-100"><Bia s={s} /></div>
          {mo ? (
            <div className="space-y-2">
              <button onClick={onDoc} className={`${nutChinh} w-full`}><BookOpen className="w-4 h-4" /> Đọc sách</button>
              <a href={s.tepToanVan} download className={`${nutPhu} w-full`}><Download className="w-4 h-4" /> Tải bản toàn văn</a>
            </div>
          ) : (
            <p className="text-[12px] text-slate-500 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 leading-relaxed">
              Cuốn này hiện <b>chỉ giới thiệu</b>, chưa mở bản toàn văn trên trang. Liên hệ tác giả để xin bản đầy đủ.
            </p>
          )}
          <dl className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 text-[12px]">
            {[
              ['Thể loại', s.theLoai],
              ['Năm hoàn thành', s.namHoanThanh],
              ['Số trang', s.soTrang ? `${s.soTrang} trang` : ''],
              ['Bố cục', [s.soChuong ? `${s.soChuong} chương` : '', s.soPhuLuc ? `${s.soPhuLuc} phụ lục` : ''].filter(Boolean).join(' · ')],
              ['Nhà xuất bản', s.nhaXB],
              ['ISBN', s.isbn],
              ['Mã trong tủ sách', s.ma],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="px-3.5 py-2 flex justify-between gap-3">
                <dt className="text-slate-500 shrink-0">{k}</dt><dd className="font-semibold text-slate-700 text-right">{v}</dd>
              </div>
            ))}
          </dl>
          {!!s.tuKhoa.length && (
            <div className="flex flex-wrap gap-1.5">
              {s.tuKhoa.map((t) => <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100 inline-flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{t}</span>)}
            </div>
          )}
        </aside>

        {/* ---- Cột nội dung ---- */}
        <div className="min-w-0 space-y-7">
          <header>
            <Nhan s={s} />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">{s.ten}</h2>
            {s.phuDe && <p className="text-[15px] text-amber-800 font-semibold mt-1.5">{s.phuDe}</p>}
            <p className="text-[13px] text-slate-600 mt-3">
              <b className="text-slate-800">{s.tacGia}</b>
              {s.hocVi && <> · {s.hocVi}</>}
              {s.chucDanh && <><br /><span className="text-slate-500">{s.chucDanh}</span></>}
            </p>
          </header>

          {!!doan.length && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Giới thiệu nội dung</h3>
              <div className="mt-2.5 space-y-3 text-[14px] text-slate-700 leading-relaxed">
                {doan.map((d, i) => <p key={i}>{d}</p>)}
              </div>
            </section>
          )}

          {s.trichLoiNoiDau && (
            <blockquote className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/70 px-5 py-4">
              <Quote className="w-5 h-5 text-amber-600" />
              <p className="text-[14px] text-slate-700 italic leading-relaxed mt-2">{s.trichLoiNoiDau}</p>
              <footer className="text-[11px] text-amber-800 font-semibold mt-2">— Trích Lời nói đầu</footer>
            </blockquote>
          )}

          {!!s.diemNoiBat.length && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Điểm nổi bật</h3>
              <ul className="mt-2.5 grid sm:grid-cols-2 gap-2.5">
                {s.diemNoiBat.map((d, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!!s.doiTuong.length && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Sách dành cho ai</h3>
              <div className="mt-2.5 space-y-2.5">
                {s.doiTuong.map((d, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[13px] font-bold text-slate-800">{i + 1}. {d.ten}</p>
                    {d.moTa && <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{d.moTa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!!nhom.length && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 inline-flex items-center gap-1.5"><ListTree className="w-3.5 h-3.5" /> Mục lục</h3>
              <div className="mt-2.5 space-y-4">
                {nhom.map((g) => (
                  <div key={g.loai}>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">{g.ten}</p>
                    <ol className="mt-1.5 rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                      {g.muc.map((m, i) => (
                        <li key={i} className="px-4 py-2.5 flex gap-3 items-start">
                          <span className="shrink-0 text-[11px] font-bold text-slate-400 w-20 pt-0.5">{nhanMuc(m)}</span>
                          <span className="flex-1 min-w-0">
                            <span className="text-[13px] font-semibold text-slate-800">{m.ten}</span>
                            {m.moTa && <span className="block text-[12px] text-slate-500 mt-0.5 leading-relaxed">{m.moTa}</span>}
                          </span>
                          {!!m.trang && <span className="shrink-0 text-[11px] text-slate-400 font-semibold pt-0.5">tr. {m.trang}</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!!tieuSu.length && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 inline-flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5" /> Về tác giả</h3>
              <p className="text-[15px] font-extrabold text-slate-800 mt-2">{s.tacGia}</p>
              {s.hocVi && <p className="text-[12px] text-amber-800 font-semibold">{s.hocVi}</p>}
              <div className="mt-2 space-y-2 text-[13px] text-slate-600 leading-relaxed">
                {tieuSu.map((d, i) => <p key={i}>{d}</p>)}
              </div>
            </section>
          )}

          {!!s.lienKet.length && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Liên kết</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {s.lienKet.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={nutPhu}><ExternalLink className="w-3.5 h-3.5" /> {l.ten}</a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================================
//  ③ ĐỌC SÁCH — mở bản toàn văn ngay trong trang
//
//  ⚠️ Dùng <iframe> thay vì tự dựng bộ đọc PDF: trình duyệt nào cũng có sẵn bộ
//     đọc PDF, khỏi phải tải thêm thư viện vài trăm kB cho mỗi người xem. Máy
//     nào chặn thì vẫn còn nút mở tab mới và nút tải về ngay phía trên.
// ============================================================================
function DocSach({ s, onVe }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onVe} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Về phần giới thiệu</button>
        <div className="flex gap-2">
          <a href={s.tepToanVan} target="_blank" rel="noopener noreferrer" className={nutPhu}><Maximize2 className="w-3.5 h-3.5" /> Mở ở tab mới</a>
          <a href={s.tepToanVan} download className={nutPhu}><Download className="w-3.5 h-3.5" /> Tải về</a>
        </div>
      </div>
      <h2 className="text-lg font-extrabold text-slate-800 mt-3">{s.ten}</h2>
      <p className="text-[12px] text-slate-500">{s.tacGia}{s.soTrang ? ` · ${s.soTrang} trang` : ''}</p>
      <div className="mt-3 rounded-2xl border border-slate-300 overflow-hidden bg-slate-200" style={{ height: 'calc(100vh - 230px)', minHeight: 420 }}>
        <iframe src={s.tepToanVan} title={`Toàn văn sách ${s.ten}`} className="w-full h-full" />
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Không hiện được bản đọc? Bấm <b>Mở ở tab mới</b> hoặc <b>Tải về</b> rồi mở bằng chương trình đọc PDF trên máy.
      </p>
    </>
  );
}

// ============================================================================
//  ④ QUẢN LÝ TỦ SÁCH (chỉ người đã đăng nhập mới lưu được lên máy chủ)
// ============================================================================
function QuanLy({ doc, onLuu, coQuyenGhi, onXem, bao }) {
  const [form, setForm] = useState(null);
  const [laMoi, setLaMoi] = useState(false);
  const [gioiThieu, setGioiThieu] = useState(doc.gioiThieu);

  const batDauSua = (s, moi = false) => {
    setLaMoi(moi);
    setForm({
      ...s,
      _diemNoiBat: mangThanhDong(s.diemNoiBat),
      _tuKhoa: mangThanhDong(s.tuKhoa),
      _doiTuong: capThanhDong(s.doiTuong, 'ten', 'moTa'),
      _mucLuc: mucLucThanhDong(s.mucLuc),
      _lienKet: capThanhDong(s.lienKet, 'ten', 'url'),
    });
  };
  const them = () => batDauSua(newSach({ id: newId(), ma: `S-${String((doc.sach || []).length + 1).padStart(2, '0')}` }), true);
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const ghi = () => {
    if (!form.ten.trim()) { bao('loi', 'Chưa nhập tên sách.'); return; }
    const s = {
      ...form,
      diemNoiBat: dongThanhMang(form._diemNoiBat),
      tuKhoa: dongThanhMang(form._tuKhoa),
      doiTuong: dongThanhCap(form._doiTuong, 'ten', 'moTa'),
      mucLuc: dongThanhMucLuc(form._mucLuc),
      lienKet: dongThanhCap(form._lienKet, 'ten', 'url'),
      capNhat: new Date().toISOString(),
    };
    ['_diemNoiBat', '_tuKhoa', '_doiTuong', '_mucLuc', '_lienKet'].forEach((k) => delete s[k]);
    const daCo = (doc.sach || []).some((x) => x.id === s.id);
    // Chỉ một cuốn được làm tiêu điểm — bật cuốn này thì tắt các cuốn khác.
    const ds = (daCo ? doc.sach.map((x) => (x.id === s.id ? s : x)) : [...(doc.sach || []), s])
      .map((x) => (s.noiBat && x.id !== s.id ? { ...x, noiBat: false } : x));
    onLuu({ ...doc, sach: ds, gioiThieu });
    setForm(null);
  };

  const xoa = (s) => {
    if (!window.confirm(`Xóa cuốn "${s.ten}" khỏi tủ sách?`)) return;
    onLuu({ ...doc, sach: doc.sach.filter((x) => x.id !== s.id), daGo: [...(doc.daGo || []), s.id], gioiThieu });
  };

  if (form) {
    return (
      <>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-extrabold text-slate-800">{laMoi ? 'Thêm sách mới' : 'Sửa thông tin sách'}</h2>
          <div className="flex gap-2">
            <button onClick={() => setForm(null)} className={nutPhu}><X className="w-3.5 h-3.5" /> Hủy</button>
            <button onClick={ghi} className={nutChinh}><Save className="w-4 h-4" /> Lưu cuốn sách</button>
          </div>
        </div>

        <div className="mt-4 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Thông tin chung</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="sm:col-span-2"><span className={lab}>Tên sách *</span><input className={inp} value={form.ten} onChange={(e) => up('ten', e.target.value)} /></label>
              <label className="sm:col-span-2"><span className={lab}>Phụ đề</span><input className={inp} value={form.phuDe} onChange={(e) => up('phuDe', e.target.value)} /></label>
              <label><span className={lab}>Tác giả</span><input className={inp} value={form.tacGia} onChange={(e) => up('tacGia', e.target.value)} /></label>
              <label><span className={lab}>Học vị, học hàm</span><input className={inp} value={form.hocVi} onChange={(e) => up('hocVi', e.target.value)} /></label>
              <label className="sm:col-span-2"><span className={lab}>Chức danh, đơn vị</span><input className={inp} value={form.chucDanh} onChange={(e) => up('chucDanh', e.target.value)} /></label>
              <label><span className={lab}>Thể loại</span>
                <select className={inp} value={form.theLoai} onChange={(e) => up('theLoai', e.target.value)}>
                  {THE_LOAI.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label><span className={lab}>Tình trạng</span>
                <select className={inp} value={form.trangThai} onChange={(e) => up('trangThai', e.target.value)}>
                  {TRANG_THAI.map((t) => <option key={t.k} value={t.k}>{t.ten}</option>)}
                </select>
              </label>
              <label><span className={lab}>Mã trong tủ sách</span><input className={inp} value={form.ma} onChange={(e) => up('ma', e.target.value)} /></label>
              <label><span className={lab}>Năm hoàn thành</span><input className={inp} value={form.namHoanThanh} onChange={(e) => up('namHoanThanh', e.target.value)} /></label>
              <label><span className={lab}>Nhà xuất bản</span><input className={inp} value={form.nhaXB} onChange={(e) => up('nhaXB', e.target.value)} /></label>
              <label><span className={lab}>ISBN</span><input className={inp} value={form.isbn} onChange={(e) => up('isbn', e.target.value)} /></label>
              <label><span className={lab}>Số trang</span><input className={inp} type="number" min="0" value={form.soTrang} onChange={(e) => up('soTrang', e.target.value)} /></label>
              <label><span className={lab}>Số chương</span><input className={inp} type="number" min="0" value={form.soChuong} onChange={(e) => up('soChuong', e.target.value)} /></label>
              <label><span className={lab}>Số phụ lục</span><input className={inp} type="number" min="0" value={form.soPhuLuc} onChange={(e) => up('soPhuLuc', e.target.value)} /></label>
              <label className="sm:col-span-2 flex items-center gap-2 text-[13px] text-slate-700 mt-1">
                <input type="checkbox" className="w-4 h-4 accent-amber-700" checked={!!form.noiBat} onChange={(e) => up('noiBat', e.target.checked)} />
                Đặt làm <b>cuốn tiêu điểm</b> (hiện cỡ lớn ở đầu tủ sách)
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">Bìa sách và bản toàn văn</p>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-3">
              Hai ô dưới đây là <b>đường dẫn tới tệp tĩnh</b> đã đặt trong thư mục <code className="bg-white px-1 rounded border border-amber-200">public/sach/</code> của dự án
              (ví dụ <code className="bg-white px-1 rounded border border-amber-200">/sach/ten-sach.pdf</code>), hoặc một địa chỉ đầy đủ ở nơi khác. Bản thân tệp sách KHÔNG lưu vào cơ sở dữ liệu.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label><span className={lab}>Ảnh bìa</span><input className={inp} value={form.anhBia} onChange={(e) => up('anhBia', e.target.value)} placeholder="/sach/bia-....svg" /></label>
              <label><span className={lab}>Tệp toàn văn</span><input className={inp} value={form.tepToanVan} onChange={(e) => up('tepToanVan', e.target.value)} placeholder="/sach/....pdf" /></label>
            </div>
            <label className="flex items-start gap-2 text-[13px] text-slate-700 mt-3">
              <input type="checkbox" className="w-4 h-4 accent-amber-700 mt-0.5" checked={!!form.choTai} onChange={(e) => up('choTai', e.target.checked)} />
              <span>
                <b>Cho phép đọc, tải toàn văn</b> trên trang này.
                <span className="block text-[12px] text-slate-500 mt-0.5">
                  Tắt thì phân hệ chỉ giới thiệu (bìa, tóm tắt, mục lục) và ẩn hẳn nút Đọc, Tải.
                  Trang web này <b>công khai với mọi người</b>, nên nếu sách đang chờ xuất bản hoặc đã có ràng buộc với nhà xuất bản thì nên để tắt.
                </span>
              </span>
            </label>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nội dung giới thiệu</p>
            <label className="block"><span className={lab}>Tóm tắt nội dung (cách đoạn bằng một dòng trống)</span><textarea rows={6} className={inp} value={form.tomTat} onChange={(e) => up('tomTat', e.target.value)} /></label>
            <label className="block"><span className={lab}>Trích Lời nói đầu (một câu, một đoạn đáng nhớ)</span><textarea rows={3} className={inp} value={form.trichLoiNoiDau} onChange={(e) => up('trichLoiNoiDau', e.target.value)} /></label>
            <label className="block"><span className={lab}>Điểm nổi bật — mỗi dòng một điểm</span><textarea rows={5} className={inp} value={form._diemNoiBat} onChange={(e) => up('_diemNoiBat', e.target.value)} /></label>
            <label className="block"><span className={lab}>Sách dành cho ai — mỗi dòng một nhóm, dạng: Tên nhóm | mô tả</span><textarea rows={4} className={inp} value={form._doiTuong} onChange={(e) => up('_doiTuong', e.target.value)} /></label>
            <label className="block"><span className={lab}>Mục lục — mỗi dòng một mục, dạng: loại | số | tên | trang | mô tả (loại: mo-dau · chuong · phu-luc · cuoi-sach)</span>
              <textarea rows={8} className={`${inp} font-mono text-[12px]`} value={form._mucLuc} onChange={(e) => up('_mucLuc', e.target.value)} /></label>
            <label className="block"><span className={lab}>Về tác giả (cách đoạn bằng một dòng trống)</span><textarea rows={4} className={inp} value={form.tieuSuTacGia} onChange={(e) => up('tieuSuTacGia', e.target.value)} /></label>
            <label className="block"><span className={lab}>Từ khóa — mỗi dòng một từ</span><textarea rows={3} className={inp} value={form._tuKhoa} onChange={(e) => up('_tuKhoa', e.target.value)} /></label>
            <label className="block"><span className={lab}>Liên kết — mỗi dòng dạng: Tên | địa chỉ</span><textarea rows={2} className={inp} value={form._lienKet} onChange={(e) => up('_lienKet', e.target.value)} /></label>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {!coQuyenGhi && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-[13px] px-4 py-2.5 mb-4">
          Bạn chưa đăng nhập — mọi thay đổi chỉ nằm trên máy này, không lưu lên máy chủ.
        </p>
      )}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-extrabold text-slate-800">Quản lý tủ sách</h2>
        <button onClick={them} className={nutChinh}><Plus className="w-4 h-4" /> Thêm sách</button>
      </div>

      <label className="block mt-4"><span className={lab}>Lời giới thiệu tủ sách (hiện ở đầu trang)</span>
        <textarea rows={2} className={inp} value={gioiThieu} onChange={(e) => setGioiThieu(e.target.value)}
          onBlur={() => gioiThieu !== doc.gioiThieu && onLuu({ ...doc, gioiThieu })} /></label>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {!(doc.sach || []).length && <p className="px-4 py-6 text-sm text-slate-500">Chưa có cuốn nào. Bấm <b>Thêm sách</b> để bắt đầu.</p>}
        {sapXep(doc.sach).map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center gap-3 flex-wrap">
            <div className="w-10 h-14 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0"><Bia s={s} /></div>
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[13px] font-bold text-slate-800">{s.ten}</p>
                {s.noiBat && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-700 text-white">Tiêu điểm</span>}
                <Nhan s={s} />
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${docDuoc(s) ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <Layers className="w-2.5 h-2.5" />{docDuoc(s) ? 'Mở toàn văn' : 'Chỉ giới thiệu'}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">{s.ma ? `${s.ma} · ` : ''}{s.tacGia}{s.namHoanThanh ? ` · ${s.namHoanThanh}` : ''}{s.soTrang ? ` · ${s.soTrang} trang` : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onXem(s.id)} className={nutPhu}><BookOpen className="w-3.5 h-3.5" /> Xem</button>
              <button onClick={() => batDauSua(s)} className={nutPhu}><Pencil className="w-3.5 h-3.5" /> Sửa</button>
              <button onClick={() => xoa(s)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
