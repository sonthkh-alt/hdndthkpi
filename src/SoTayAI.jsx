// ============================================================================
//  PHÂN HỆ "SỔ TAY AI — HỎI ĐÁP, TRA CỨU CÓ TRÍCH DẪN NGUỒN"  (#/sotay)
//
//  Thực hiện NHIỆM VỤ ĐỘT PHÁ đã đăng ký (Trục 3, Mục V.5(4) Đề án):
//  "Thí điểm hỏi đáp, tra cứu bằng trí tuệ nhân tạo về các lĩnh vực của cơ quan
//   dân cử: xây dựng các sổ tay AI theo lĩnh vực để cán bộ, công chức Văn phòng,
//   các Ban và đại biểu chat, hỏi đáp, tra cứu có trích dẫn nguồn."
//
//  Phân hệ làm ĐỒNG THỜI hai việc:
//   ① CÔNG CỤ — hỏi đáp có trích dẫn ngay trên kho văn bản của từng sổ tay.
//   ② QUẢN LÝ THÍ ĐIỂM — theo dõi đủ 4 chỉ tiêu và 3 mốc thời gian đã đăng ký:
//      06 sổ tay · ≥50 câu hỏi mẫu đã đối chiếu nguồn · Quy tắc sử dụng AI +
//      100% CBCC Văn phòng được hướng dẫn · thời gian tra cứu giảm ≥30%.
//
//  ⚠️ Ô "Liên kết NotebookLM" của mỗi sổ tay là để gắn đúng notebook đã lập trên
//     NotebookLM như tên nhiệm vụ đăng ký — hai bên dùng CHUNG một danh mục nguồn
//     đã kiểm tra, nên sổ tay ở đây vừa là nơi quản lý nguồn vừa tra cứu được ngay.
// ============================================================================
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Home, BookOpen, Search, Library, ListChecks, ShieldAlert, GraduationCap, FileBarChart,
  Plus, Trash2, Upload, Link2, CheckCircle2, AlertTriangle, Loader2, Send, Clock,
  FileText, ExternalLink, Sparkles, Info, RotateCcw, Save, Download, Target,
} from 'lucide-react';
import { getSession, onAuthChange } from './lib/auth';
import { docTaiLieu } from './lib/troLyAI';
import {
  dungChiMuc, truyHoi, dungNguCanh, docTrichDan, coTrichDan, motTrichDan,
  thongKeSoTay, giamThoiGian, tienDoNhiemVu, phanTramNhiemVu, conLaiNgay, loc,
  HIEU_LUC, hieuLucOf, KIEM_TRA, kiemTraOf, TRANG_THAI_SO_TAY, trangThaiOf,
  TRANG_THAI_CAU_HOI, cauHoiOf, HINH_THUC_HD, CHI_TIEU,
  newNguon, newCauHoi, newHuongDan, ganNguyenVan, kichThuoc, newId, CANH_BAO_KB,
} from './lib/soTayAI';
import { fetchST, saveST, khoiTaoNeuTrong, hoiSoTay, xemHanMucSoTay } from './lib/soTayStore';

const TABS = [
  { k: 'tongquan', ten: 'Tổng quan', icon: Target },
  { k: 'tracuu', ten: 'Tra cứu', icon: Search },
  { k: 'nguon', ten: 'Nguồn của sổ tay', icon: Library },
  { k: 'cauhoi', ten: 'Câu hỏi mẫu', icon: ListChecks },
  { k: 'quytac', ten: 'Quy tắc dùng AI', icon: ShieldAlert },
  { k: 'huongdan', ten: 'Hướng dẫn cán bộ', icon: GraduationCap },
  { k: 'baocao', ten: 'Báo cáo', icon: FileBarChart },
];

const inp = 'w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[13px] text-slate-700 outline-none focus:border-violet-400 disabled:bg-slate-50 disabled:text-slate-500';
const lab = 'text-[11px] font-semibold text-slate-500 mb-1 block';
const nutChinh = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const nutPhu = 'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-50';

const homNay = () => new Date().toISOString().slice(0, 10);
const ngayVN = (s) => { if (!s) return ''; const [y, m, d] = String(s).split('-'); return d ? `${d}/${m}/${y}` : s; };

export default function SoTayAI({ onHome }) {
  const [doc, setDoc] = useState(null);
  const [tab, setTab] = useState('tongquan');
  const [phien, setPhien] = useState(null);
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState(null);
  const [soTayId, setSoTayId] = useState('');
  const daKhoiTao = useRef(false);

  const coQuyenGhi = !!phien;     // đăng nhập thật mới được ghi lên máy chủ (RLS)
  const bao = useCallback((kieu, chu) => { setThongBao({ kieu, chu }); setTimeout(() => setThongBao(null), 5200); }, []);

  // ---- Nạp dữ liệu + phiên đăng nhập -------------------------------------
  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); });
    const off = onAuthChange((s) => setPhien(s || null));
    fetchST().then((d) => {
      if (!alive) return;
      const { doc: d2 } = khoiTaoNeuTrong(d);
      setDoc(d2);
      setSoTayId((cu) => cu || d2.soTay[0]?.id || '');
    });
    return () => { alive = false; off && off(); };
  }, []);

  // Người đăng nhập đầu tiên mở phân hệ mà máy chủ chưa có gì → ghi bộ khởi tạo
  // lên máy chủ để mọi người cùng thấy một bản (nguyên tắc chung của hệ thống:
  // "dữ liệu mẫu = dữ liệu chính thống").
  useEffect(() => {
    if (!doc || !coQuyenGhi || daKhoiTao.current) return;
    if (doc.updatedAt) { daKhoiTao.current = true; return; }
    daKhoiTao.current = true;
    saveST(doc).then((r) => { if (r.ok) setDoc(r.doc); });
  }, [doc, coQuyenGhi]);

  const luu = async (d) => {
    setDoc(d);
    if (!coQuyenGhi) { bao('canh', 'Thay đổi chỉ nằm trên máy này — hãy đăng nhập để lưu lên máy chủ.'); return; }
    setDangLuu(true);
    const r = await saveST(d);
    setDangLuu(false);
    if (r.ok) { setDoc(r.doc); bao('ok', 'Đã lưu lên máy chủ.'); }
    else bao('loi', 'Chưa lưu được lên máy chủ — bản trên máy vẫn giữ.');
  };

  const soTay = doc?.soTay || [];
  const hienTai = soTay.find((s) => s.id === soTayId) || soTay[0] || null;

  if (!doc) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Đang nạp sổ tay…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#6d28d9] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/40 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-violet-200">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Sổ tay AI — hỏi đáp, tra cứu có trích dẫn nguồn</h1>
              <p className="text-white/80 text-[11px] sm:text-xs mt-0.5">Nhiệm vụ đột phá · Trục 3 · Mục V.5(4) Đề án</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {dangLuu && <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20">Đang lưu…</span>}
            <span className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${coQuyenGhi ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-50' : 'bg-amber-400/20 border-amber-200/30 text-amber-50'}`}>
              {coQuyenGhi ? 'Đã đăng nhập · ghi được' : 'Khách · chỉ xem'}
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex gap-1.5 overflow-x-auto">
          {TABS.map((t) => { const Ic = t.icon; const on = tab === t.k; return (
            <button key={t.k} onClick={() => setTab(t.k)} className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors ${on ? 'bg-white text-violet-800 shadow' : 'bg-white/10 text-white/85 hover:bg-white/20'}`}>
              <Ic className="w-4 h-4" />{t.ten}
            </button>
          ); })}
        </div>
      </header>

      {thongBao && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 pt-4`}>
          <div className={`rounded-xl border px-4 py-2.5 text-[13px] flex items-start gap-2 ${thongBao.kieu === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : thongBao.kieu === 'canh' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {thongBao.kieu === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{thongBao.chu}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {tab === 'tongquan' && <TongQuan doc={doc} onMo={(id) => { setSoTayId(id); setTab('tracuu'); }} onTab={setTab} />}
        {tab === 'tracuu' && <TraCuu doc={doc} soTay={soTay} hienTai={hienTai} onChon={setSoTayId} onLuu={luu} coQuyenGhi={coQuyenGhi} bao={bao} />}
        {tab === 'nguon' && <KhoNguon doc={doc} soTay={soTay} hienTai={hienTai} onChon={setSoTayId} onLuu={luu} coQuyenGhi={coQuyenGhi} bao={bao} />}
        {tab === 'cauhoi' && <NganHangCauHoi doc={doc} soTay={soTay} onLuu={luu} coQuyenGhi={coQuyenGhi} />}
        {tab === 'quytac' && <QuyTacAI doc={doc} onLuu={luu} coQuyenGhi={coQuyenGhi} phien={phien} />}
        {tab === 'huongdan' && <HuongDanCanBo doc={doc} onLuu={luu} coQuyenGhi={coQuyenGhi} />}
        {tab === 'baocao' && <BaoCao doc={doc} bao={bao} />}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 text-[11px] text-slate-400 leading-relaxed">
        Bản demo thử nghiệm phục vụ nội bộ — không chịu trách nhiệm về tính pháp lý của dữ liệu.
        Câu trả lời của trí tuệ nhân tạo chỉ để <b>tham khảo</b>: luôn mở văn bản gốc theo trích dẫn để kiểm chứng trước khi sử dụng.
      </footer>
    </div>
  );
}

// ============================================================================
//  TAB 1 — TỔNG QUAN: tiến độ 4 chỉ tiêu, 3 mốc thời gian, lưới 6 sổ tay
// ============================================================================
function TongQuan({ doc, onMo, onTab }) {
  const td = useMemo(() => tienDoNhiemVu(doc, { tongCBCC: (doc.huongDan || []).length }), [doc]);
  const pct = phanTramNhiemVu(td);
  const moc = [
    { ten: 'Sổ tay và câu hỏi mẫu', ngay: doc.moc.soTay, xong: td.soTay.dat && td.cauHoi.dat },
    { ten: 'Hướng dẫn cán bộ sử dụng', ngay: doc.moc.huongDan, xong: td.huongDan.dat && td.quyTac },
    { ten: 'Báo cáo đánh giá thí điểm', ngay: doc.moc.baoCao, xong: td.thoiGian.soPhepDo > 0 },
  ];

  return (
    <>
      <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600">Nhiệm vụ đột phá đã đăng ký</p>
            <h2 className="text-lg font-extrabold text-slate-800 mt-1">Thí điểm hỏi đáp, tra cứu bằng trí tuệ nhân tạo về các lĩnh vực của cơ quan dân cử</h2>
            <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">
              Xây dựng các <b>sổ tay AI</b> theo lĩnh vực để cán bộ, công chức Văn phòng, các Ban và đại biểu chat, hỏi đáp, tra cứu <b>có trích dẫn nguồn</b>.
              Chủ trì: Phó Chánh Văn phòng — Tổ trưởng Tổ công tác về khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số.
            </p>
            <p className="text-[12px] text-violet-800 bg-violet-100/70 border border-violet-200 rounded-lg px-3 py-2 mt-3">
              <b>Ghi chú của nhiệm vụ:</b> chỉ nạp văn bản <b>công khai, không mật</b>; không phát sinh kinh phí.
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="w-28 h-28 rounded-full border-8 border-violet-200 flex items-center justify-center bg-white">
              <div><p className="text-3xl font-extrabold text-violet-700">{pct}%</p><p className="text-[10px] text-slate-500 font-semibold">hoàn thành</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <TheChiTieu ten="Sổ tay AI theo lĩnh vực" daLam={td.soTay.daLam} chiTieu={CHI_TIEU.soTay} donVi="sổ tay" pct={td.soTay.pct} dat={td.soTay.dat}
          ghiChu="Sổ tay được tính là xong khi đã nạp nguyên văn, có nguồn đã kiểm tra và có câu hỏi mẫu đã đối chiếu." onClick={() => onTab('nguon')} />
        <TheChiTieu ten="Câu hỏi mẫu đã đối chiếu nguồn" daLam={td.cauHoi.daLam} chiTieu={CHI_TIEU.cauHoi} donVi="câu" pct={td.cauHoi.pct} dat={td.cauHoi.dat}
          ghiChu={`Ngân hàng hiện có ${td.cauHoi.tong} câu; chỉ tiêu là ≥ ${CHI_TIEU.cauHoi} câu ĐÃ đối chiếu nguồn.`} onClick={() => onTab('cauhoi')} />
        <TheChiTieu ten="Cán bộ, công chức được hướng dẫn" daLam={td.huongDan.daLam} chiTieu={td.huongDan.tong || 0} donVi="người" pct={td.huongDan.pct} dat={td.huongDan.dat}
          ghiChu="Chỉ tiêu: 100% cán bộ, công chức Văn phòng được hướng dẫn sử dụng." onClick={() => onTab('huongdan')} />
        <TheChiTieu ten="Thời gian tra cứu giảm" daLam={td.thoiGian.giam} chiTieu={CHI_TIEU.giamThoiGian} donVi="%" pct={td.thoiGian.pct} dat={td.thoiGian.dat} soLe
          ghiChu={td.thoiGian.soPhepDo ? `Trung bình ${td.thoiGian.giayAI}s bằng sổ tay so với ${Math.round(td.thoiGian.giayThuCong / 60)} phút tra thủ công (${td.thoiGian.soPhepDo} phép đo).` : 'Chưa có phép đo nào — mỗi lần tra cứu hãy ghi lại thời gian tra thủ công để so sánh.'}
          onClick={() => onTab('tracuu')} />
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        {moc.map((m) => { const con = conLaiNgay(m.ngay); return (
          <div key={m.ten} className={`rounded-2xl border p-4 ${m.xong ? 'border-emerald-200 bg-emerald-50' : con != null && con < 0 ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${m.xong ? 'text-emerald-600' : con != null && con < 0 ? 'text-rose-600' : 'text-slate-400'}`} />
              <p className="text-[13px] font-bold text-slate-800">{m.ten}</p>
            </div>
            <p className="text-sm font-extrabold text-slate-700 mt-1.5">Trước {ngayVN(m.ngay)}</p>
            <p className="text-[11px] mt-0.5 text-slate-500">
              {m.xong ? 'Đã hoàn thành chỉ tiêu liên quan.' : con == null ? '' : con >= 0 ? `Còn ${con} ngày.` : `Đã quá hạn ${-con} ngày.`}
            </p>
          </div>
        ); })}
      </section>

      <section>
        <h3 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-violet-600" /> 06 sổ tay theo lĩnh vực</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(doc.soTay || []).map((s) => {
            const t = thongKeSoTay(doc, s.id);
            const tt = trangThaiOf(s.trangThai);
            return (
              <button key={s.id} onClick={() => onMo(s.id)} className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-violet-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold tracking-wider text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{s.ma}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tt.tone}`}>{tt.ten}</span>
                </div>
                <p className="text-[14px] font-bold text-slate-800 mt-2 leading-snug">{s.ten}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{s.moTa}</p>
                <div className="flex items-center gap-3 mt-3 text-[11px]">
                  <span className={t.sanSang ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {t.sanSang ? `${t.coNguyenVan}/${t.nguon} nguồn đã nạp` : 'Chưa nạp nguyên văn'}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{t.cauHoiDat}/{t.cauHoi} câu đã đối chiếu</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TheChiTieu({ ten, daLam, chiTieu, donVi, pct, dat, ghiChu, onClick, soLe }) {
  const v = soLe ? (Math.round(daLam * 10) / 10) : daLam;
  return (
    <button onClick={onClick} className={`text-left rounded-2xl border p-4 transition-all hover:shadow-md ${dat ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
      <p className="text-[11px] font-semibold text-slate-500 leading-snug min-h-[2.2em]">{ten}</p>
      <p className="mt-1.5"><span className={`text-2xl font-extrabold ${dat ? 'text-emerald-700' : 'text-slate-800'}`}>{v}</span>
        <span className="text-[12px] text-slate-400 font-semibold"> / {chiTieu} {donVi}</span></p>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
        <div className={`h-full transition-all ${dat ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-3">{ghiChu}</p>
    </button>
  );
}

// ============================================================================
//  TAB 2 — TRA CỨU (màn chính): hỏi → truy hồi đoạn → AI trả lời có trích dẫn
// ============================================================================
function TraCuu({ doc, soTay, hienTai, onChon, onLuu, coQuyenGhi, bao }) {
  const [cauHoi, setCauHoi] = useState('');
  const [dangHoi, setDangHoi] = useState(false);
  const [ketQua, setKetQua] = useState(null);     // { traLoi, doan, giay, cauHoi }
  const [hanMuc, setHanMuc] = useState(null);
  const [phutThuCong, setPhutThuCong] = useState('');
  const oNhap = useRef(null);

  useEffect(() => { xemHanMucSoTay().then((h) => setHanMuc(h)); }, []);
  useEffect(() => { setKetQua(null); }, [hienTai?.id]);

  // Chỉ mục được dựng lại khi đổi sổ tay hoặc khi kho nguồn thay đổi.
  const nguon = useMemo(
    () => (doc.nguon || []).filter((n) => n.soTayId === hienTai?.id && n.kiemTra !== 'loai' && n.text),
    [doc.nguon, hienTai?.id],
  );
  const chiMuc = useMemo(() => dungChiMuc(nguon), [nguon]);
  const thongKe = hienTai ? thongKeSoTay(doc, hienTai.id) : null;
  const goiY = useMemo(
    () => (doc.cauHoi || []).filter((c) => c.soTayId === hienTai?.id).slice(0, 5),
    [doc.cauHoi, hienTai?.id],
  );

  const hoi = async (cau) => {
    const q = String(cau ?? cauHoi).trim();
    if (!q || dangHoi) return;
    if (!chiMuc.doan.length) { bao('canh', 'Sổ tay này chưa có nguyên văn văn bản nào. Hãy vào tab "Nguồn của sổ tay" để nạp trước.'); return; }
    setDangHoi(true); setKetQua(null);
    const batDau = Date.now();
    const doanChon = truyHoi(chiMuc, q, { soDoan: 6 });
    const r = await hoiSoTay({
      cauHoi: q, nguCanh: dungNguCanh(doanChon), tenSoTay: hienTai?.ten || '',
      lichSu: (doc.nhatKy || []).filter((x) => x.soTayId === hienTai?.id).slice(0, 2).map((x) => x.cauHoi),
    });
    const giay = Math.round((Date.now() - batDau) / 100) / 10;
    setDangHoi(false);
    if (r.hanMuc) setHanMuc((h) => ({ ...(h || {}), hanMuc: r.hanMuc }));
    if (r.error) { bao('loi', r.error); return; }
    setKetQua({ traLoi: r.text || '', doan: doanChon, giay, cauHoi: q });
    setCauHoi('');
  };

  // Ghi vào nhật ký + (nếu có nhập) ghi một phép đo thời gian.
  const ghiNhanKetQua = () => {
    if (!ketQua) return;
    const td = docTrichDan(ketQua.traLoi, ketQua.doan);
    const d = { ...doc };
    d.nhatKy = [{
      id: newId('nk'), soTayId: hienTai.id, cauHoi: ketQua.cauHoi,
      traLoi: ketQua.traLoi, nguon: td.map(motTrichDan), giay: ketQua.giay,
      luc: new Date().toISOString(), nguoi: '',
    }, ...(doc.nhatKy || [])].slice(0, 100);
    const phut = Number(phutThuCong);
    if (phut > 0) {
      d.doThoiGian = [{
        id: newId('dt'), soTayId: hienTai.id, cauHoi: ketQua.cauHoi,
        giayAI: ketQua.giay, phutThuCong: phut, nguoi: '', luc: new Date().toISOString(),
      }, ...(doc.doThoiGian || [])];
    }
    onLuu(d);
    setPhutThuCong('');
  };

  const themVaoNganHang = () => {
    if (!ketQua) return;
    const td = docTrichDan(ketQua.traLoi, ketQua.doan);
    const d = {
      ...doc,
      cauHoi: [...(doc.cauHoi || []), newCauHoi(hienTai.id, {
        cauHoi: ketQua.cauHoi, dapAn: ketQua.traLoi.slice(0, 1200), trichDan: td.map(motTrichDan), trangThai: 'moi',
      })],
    };
    onLuu(d);
    bao('ok', 'Đã thêm vào ngân hàng câu hỏi mẫu ở trạng thái "Chưa đối chiếu nguồn" — cần người phụ trách đối chiếu rồi xác nhận.');
  };

  const trichDan = ketQua ? docTrichDan(ketQua.traLoi, ketQua.doan) : [];
  const conLai = hanMuc?.hanMuc?.conLai;

  return (
    <>
      <ChonSoTay soTay={soTay} hienTai={hienTai} onChon={onChon} thongKe={thongKe} />

      {!chiMuc.doan.length && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[13px] text-amber-800">
            <p className="font-bold">Sổ tay này chưa tra cứu được.</p>
            <p className="mt-1 leading-relaxed">Hỏi đáp chỉ chạy khi đã có <b>nguyên văn</b> văn bản trong sổ tay — máy chỉ được trả lời theo nguồn, không được trả lời bằng trí nhớ.
              Mở tab <b>“Nguồn của sổ tay”</b> để thêm văn bản (tải tệp .pdf/.docx/.txt hoặc dán nội dung).</p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-violet-800 to-violet-700 text-white px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <h2 className="flex items-center gap-2 font-bold text-sm"><Sparkles className="w-4 h-4 text-amber-300" /> Hỏi đáp trong sổ tay</h2>
          <span className="text-[11px] text-violet-100">
            {chiMuc.doan.length ? `${chiMuc.soNguon} văn bản · ${chiMuc.doan.length} đoạn đã lập chỉ mục` : 'Chưa có đoạn nào'}
            {conLai != null && ` · còn ${conLai} lượt AI hôm nay`}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <textarea ref={oNhap} value={cauHoi} onChange={(e) => setCauHoi(e.target.value)} rows={2}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) hoi(); }}
              placeholder="Nhập câu hỏi nghiệp vụ… (Ctrl + Enter để gửi)" className={inp} />
            <button onClick={() => hoi()} disabled={dangHoi || !cauHoi.trim() || !chiMuc.doan.length} className={`${nutChinh} shrink-0 self-stretch px-5`}>
              {dangHoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{dangHoi ? 'Đang tra…' : 'Hỏi'}
            </button>
          </div>
          {!!goiY.length && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 self-center">Câu hỏi mẫu:</span>
              {goiY.map((c) => (
                <button key={c.id} onClick={() => { setCauHoi(c.cauHoi); oNhap.current?.focus(); }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-200 text-slate-600 text-left">
                  {c.cauHoi.length > 58 ? `${c.cauHoi.slice(0, 58)}…` : c.cauHoi}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {dangHoi && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 text-sm">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-600" />
          Đang tìm trong {chiMuc.doan.length} đoạn văn bản của sổ tay rồi hỏi AI…
        </div>
      )}

      {ketQua && (
        <section className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <p className="text-[13px] font-bold text-slate-800">Trả lời</p>
              <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{ketQua.giay}s</span>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-slate-500 italic mb-3 pb-3 border-b border-slate-100">Câu hỏi: {ketQua.cauHoi}</p>
              {!coTrichDan(ketQua.traLoi) && (
                <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Câu trả lời này <b>không gắn số trích dẫn</b> — hãy đối chiếu kỹ với các đoạn nguồn bên cạnh trước khi dùng.</span>
                </div>
              )}
              <div className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{ketQua.traLoi}</div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 space-y-2.5">
              <div className="flex items-end gap-2 flex-wrap">
                <label className="flex-1 min-w-[200px]">
                  <span className={lab}>Nếu tra thủ công thì mất khoảng bao nhiêu phút?</span>
                  <input type="number" min="0" step="1" value={phutThuCong} onChange={(e) => setPhutThuCong(e.target.value)} placeholder="Ví dụ: 15" className={inp} />
                </label>
                <button onClick={ghiNhanKetQua} className={nutPhu} disabled={!coQuyenGhi} title={coQuyenGhi ? '' : 'Cần đăng nhập để ghi lên máy chủ'}>
                  <Save className="w-3.5 h-3.5" /> Ghi nhật ký{Number(phutThuCong) > 0 ? ' + phép đo' : ''}
                </button>
                <button onClick={themVaoNganHang} className={nutPhu} disabled={!coQuyenGhi}>
                  <Plus className="w-3.5 h-3.5" /> Đưa vào ngân hàng câu hỏi
                </button>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                Số phút tra thủ công do người dùng ước lượng — đây chính là số liệu để tính chỉ tiêu “thời gian tra cứu giảm ≥ {CHI_TIEU.giamThoiGian}%”.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <p className="text-[13px] font-bold text-slate-800">Nguồn trích dẫn</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {trichDan.length ? `AI đã dẫn ${trichDan.length} đoạn` : 'AI chưa dẫn đoạn nào'} trong {ketQua.doan.length} đoạn được đưa vào tra cứu
              </p>
            </div>
            <div className="divide-y divide-slate-100 max-h-[32rem] overflow-y-auto">
              {ketQua.doan.map((d) => {
                const daDan = trichDan.some((x) => x.stt === d.stt);
                return (
                  <details key={d.id} className={`px-4 py-3 ${daDan ? 'bg-violet-50/50' : ''}`}>
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start gap-2">
                        <span className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${daDan ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{d.stt}</span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-slate-700 leading-snug">{d.nhan}</p>
                          <p className="text-[11px] text-slate-500 truncate">{d.soHieu ? `${d.soHieu} — ` : ''}{d.tenNguon}</p>
                          {d.chuong && <p className="text-[10px] text-slate-400 truncate">{d.chuong}</p>}
                        </div>
                      </div>
                    </summary>
                    <p className="mt-2 ml-8 text-[11.5px] text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-2.5 max-h-56 overflow-y-auto">{d.text}</p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <NhatKyTraCuu doc={doc} soTayId={hienTai?.id} />
    </>
  );
}

function ChonSoTay({ soTay, hienTai, onChon, thongKe }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-end gap-3 flex-wrap">
        <label className="flex-1 min-w-[260px]">
          <span className={lab}>Sổ tay đang tra cứu</span>
          <select value={hienTai?.id || ''} onChange={(e) => onChon(e.target.value)} className={inp}>
            {soTay.map((s) => <option key={s.id} value={s.id}>{s.ma} — {s.ten}</option>)}
          </select>
        </label>
        {thongKe && (
          <div className="flex gap-2 flex-wrap text-[11px]">
            <span className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">Nguồn: <b>{thongKe.coNguyenVan}/{thongKe.nguon}</b> đã nạp</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">Đã kiểm tra: <b>{thongKe.nguonDat}</b></span>
            <span className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">Câu hỏi mẫu: <b>{thongKe.cauHoiDat}/{thongKe.cauHoi}</b></span>
          </div>
        )}
      </div>
      {hienTai?.moTa && <p className="text-[12px] text-slate-500 mt-2.5 leading-relaxed">{hienTai.moTa}</p>}
      {hienTai?.notebookLM && (
        <a href={hienTai.notebookLM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-[12px] font-semibold text-violet-700 hover:text-violet-900">
          <ExternalLink className="w-3.5 h-3.5" /> Mở notebook tương ứng trên NotebookLM
        </a>
      )}
    </section>
  );
}

function NhatKyTraCuu({ doc, soTayId }) {
  const ds = (doc.nhatKy || []).filter((x) => !soTayId || x.soTayId === soTayId).slice(0, 8);
  if (!ds.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100"><p className="text-[13px] font-bold text-slate-800">Lượt tra cứu gần đây</p></div>
      <div className="divide-y divide-slate-100">
        {ds.map((x) => (
          <details key={x.id} className="px-5 py-2.5">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
              <span className="text-[12.5px] text-slate-700 truncate">{x.cauHoi}</span>
              <span className="shrink-0 text-[11px] text-slate-400">{x.giay}s · {x.nguon?.length || 0} nguồn</span>
            </summary>
            <p className="mt-2 text-[12px] text-slate-600 whitespace-pre-wrap leading-relaxed">{x.traLoi}</p>
            {!!x.nguon?.length && <p className="mt-1.5 text-[11px] text-violet-700">Nguồn: {x.nguon.join(' · ')}</p>}
          </details>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
//  TAB 3 — NGUỒN CỦA SỔ TAY: thêm, nạp nguyên văn, kiểm tra hiệu lực
// ============================================================================
function KhoNguon({ doc, soTay, hienTai, onChon, onLuu, coQuyenGhi, bao }) {
  const [tim, setTim] = useState('');
  const [dangDoc, setDangDoc] = useState('');
  const [danId, setDanId] = useState('');
  const [chu, setChu] = useState('');
  const tep = useRef(null);
  const nguonId = useRef('');

  const ds = useMemo(() => loc((doc.nguon || []).filter((n) => n.soTayId === hienTai?.id), tim, ['ten', 'soHieu', 'coQuan']), [doc.nguon, hienTai?.id, tim]);
  const kt = kichThuoc(doc);

  const capNhat = (id, patch) => onLuu({ ...doc, nguon: (doc.nguon || []).map((n) => (n.id === id ? { ...n, ...patch } : n)) });
  const them = () => onLuu({ ...doc, nguon: [...(doc.nguon || []), newNguon(hienTai.id, { ten: 'Văn bản mới' })] });
  const xoa = (id) => { if (window.confirm('Xóa văn bản này khỏi sổ tay? Nguyên văn đã nạp cũng mất.')) onLuu({ ...doc, nguon: (doc.nguon || []).filter((n) => n.id !== id) }); };

  const chonTep = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const id = nguonId.current;
    setDangDoc(id);
    const r = await docTaiLieu(f);
    setDangDoc('');
    if (r.error) { bao('loi', r.error); return; }
    if (!String(r.text || '').trim()) { bao('loi', `Không trích được chữ từ "${f.name}" — tệp có thể là bản quét ảnh.`); return; }
    const cu = (doc.nguon || []).find((n) => n.id === id);
    if (!cu) return;
    const moi = ganNguyenVan(cu, r.text);
    capNhat(id, { text: moi.text, soKyTu: moi.soKyTu, ten: cu.ten && cu.ten !== 'Văn bản mới' ? cu.ten : f.name.replace(/\.[^.]+$/, '') });
    bao('ok', `Đã nạp ${moi.soKyTu.toLocaleString('vi-VN')} ký tự từ "${f.name}".${moi.batDauCat ? ' (Đã cắt bớt phần vượt giới hạn.)' : ''}`);
  };

  const luuDan = () => {
    const cu = (doc.nguon || []).find((n) => n.id === danId);
    if (!cu) return;
    const moi = ganNguyenVan(cu, chu);
    capNhat(danId, { text: moi.text, soKyTu: moi.soKyTu });
    setDanId(''); setChu('');
    bao('ok', `Đã lưu ${moi.soKyTu.toLocaleString('vi-VN')} ký tự nguyên văn.`);
  };

  return (
    <>
      <ChonSoTay soTay={soTay} hienTai={hienTai} onChon={onChon} thongKe={hienTai ? thongKeSoTay(doc, hienTai.id) : null} />

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div className="text-[12.5px] text-violet-900 leading-relaxed">
          <p className="font-bold">Danh mục dưới đây là VIỆC CẦN LÀM, không phải khẳng định pháp lý.</p>
          <p className="mt-1">Mọi văn bản đều đang ở trạng thái <b>“Chưa xác định hiệu lực”</b> và <b>“Chưa kiểm tra”</b>. Người phụ trách phải mở Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật để đối chiếu <b>số hiệu, ngày ban hành, tình trạng hiệu lực</b>, xác nhận văn bản <b>công khai, không mật</b>, rồi mới chuyển sang “Đã kiểm tra - đạt”. Phần mềm không tự gán hiệu lực cho bất kỳ văn bản nào.</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[13px] font-bold text-slate-800">Văn bản nguồn ({ds.length})</p>
          <div className="flex items-center gap-2 flex-wrap">
            <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tên, số hiệu… (gõ không dấu được)" className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400 w-64" />
            {coQuyenGhi && <button onClick={them} className={nutPhu}><Plus className="w-3.5 h-3.5" /> Thêm văn bản</button>}
          </div>
        </div>
        {kt.nang && (
          <p className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-[11.5px] text-amber-800">
            Kho văn bản đang nặng khoảng <b>{kt.kb.toLocaleString('vi-VN')} KB</b> (ngưỡng nhắc {CANH_BAO_KB} KB). Nên bớt những văn bản không còn dùng để phân hệ mở nhanh hơn.
          </p>
        )}
        <div className="divide-y divide-slate-100">
          {!ds.length && <p className="px-5 py-8 text-center text-[13px] text-slate-400">Chưa có văn bản nào trong sổ tay này.</p>}
          {ds.map((n) => {
            const hl = hieuLucOf(n.hieuLuc), k = kiemTraOf(n.kiemTra);
            return (
              <div key={n.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hl.tone}`}>{hl.ten}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${k.tone}`}>{k.ten}</span>
                      {n.congKhai
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-200">Đã xác nhận công khai</span>
                        : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-500 border-slate-200">Chưa xác nhận công khai</span>}
                      {n.soKyTu > 0
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Đã nạp {n.soKyTu.toLocaleString('vi-VN')} ký tự</span>
                        : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">Chưa nạp nguyên văn</span>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <label className="sm:col-span-2"><span className={lab}>Tên văn bản</span>
                        <input value={n.ten} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { ten: e.target.value })} className={inp} /></label>
                      <label><span className={lab}>Số, ký hiệu</span>
                        <input value={n.soHieu} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { soHieu: e.target.value })} placeholder="VD: 30/2020/NĐ-CP" className={inp} /></label>
                      <label><span className={lab}>Cơ quan ban hành</span>
                        <input value={n.coQuan} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { coQuan: e.target.value })} className={inp} /></label>
                      <label><span className={lab}>Ngày ban hành</span>
                        <input type="date" value={n.ngayBanHanh} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { ngayBanHanh: e.target.value })} className={inp} /></label>
                      <label><span className={lab}>Tình trạng hiệu lực</span>
                        <select value={n.hieuLuc} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { hieuLuc: e.target.value })} className={inp}>
                          {HIEU_LUC.map((x) => <option key={x.k} value={x.k}>{x.ten}</option>)}
                        </select></label>
                      <label className="sm:col-span-3"><span className={lab}>Đường dẫn bản công khai (Công báo, cơ sở dữ liệu quốc gia…)</span>
                        <input value={n.lienKet} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { lienKet: e.target.value })} placeholder="https://…" className={inp} /></label>
                      {!!n.ghiChu && <p className="sm:col-span-3 text-[11px] text-slate-500 italic">Gợi ý: {n.ghiChu}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mt-2.5">
                      <label className="flex items-center gap-1.5 text-[11.5px] text-slate-700">
                        <input type="checkbox" checked={!!n.congKhai} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { congKhai: e.target.checked })} className="w-4 h-4 accent-sky-600" />
                        Tôi xác nhận văn bản này <b>công khai, không mật</b>
                      </label>
                      <label className="flex items-center gap-1.5 text-[11.5px] text-slate-700">
                        <span>Kiểm tra nguồn:</span>
                        <select value={n.kiemTra} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { kiemTra: e.target.value, ngayKiemTra: e.target.value === 'dat' ? homNay() : n.ngayKiemTra })} className="text-[11.5px] border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400">
                          {KIEM_TRA.map((x) => <option key={x.k} value={x.k}>{x.ten}</option>)}
                        </select>
                      </label>
                      <input value={n.nguoiKiemTra} disabled={!coQuyenGhi} onChange={(e) => capNhat(n.id, { nguoiKiemTra: e.target.value })} placeholder="Người kiểm tra" className="text-[11.5px] border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400 w-40" />
                      {n.ngayKiemTra && <span className="text-[11px] text-slate-400">ngày {ngayVN(n.ngayKiemTra)}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-1.5 w-full sm:w-auto">
                    {coQuyenGhi && (<>
                      <button onClick={() => { nguonId.current = n.id; tep.current?.click(); }} disabled={!!dangDoc} className={nutPhu}>
                        {dangDoc === n.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} Nạp từ tệp
                      </button>
                      <button onClick={() => { setDanId(n.id); setChu(n.text || ''); }} className={nutPhu}><FileText className="w-3.5 h-3.5" /> Dán nguyên văn</button>
                    </>)}
                    {n.lienKet && <a href={n.lienKet} target="_blank" rel="noopener noreferrer" className={nutPhu}><Link2 className="w-3.5 h-3.5" /> Mở bản gốc</a>}
                    {coQuyenGhi && <button onClick={() => xoa(n.id)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-semibold"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>}
                  </div>
                </div>

                {danId === n.id && (
                  <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
                    <p className={lab}>Dán nguyên văn văn bản (phần mềm tự cắt theo Điều, khoản để làm địa chỉ trích dẫn)</p>
                    <textarea value={chu} onChange={(e) => setChu(e.target.value)} rows={10} placeholder="Dán toàn văn ở đây…" className={`${inp} font-mono text-[12px]`} />
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={luuDan} className={nutChinh}><Save className="w-4 h-4" /> Lưu nguyên văn</button>
                      <button onClick={() => { setDanId(''); setChu(''); }} className={nutPhu}>Hủy</button>
                      <span className="text-[11px] text-slate-500">{chu.length.toLocaleString('vi-VN')} ký tự</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <input ref={tep} type="file" accept=".pdf,.docx,.txt" onChange={chonTep} className="hidden" />
      </section>

      {hienTai && coQuyenGhi && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-3 gap-3">
          <label className="sm:col-span-2"><span className={lab}>Liên kết notebook tương ứng trên NotebookLM (nếu có)</span>
            <input value={hienTai.notebookLM} onChange={(e) => onLuu({ ...doc, soTay: doc.soTay.map((s) => (s.id === hienTai.id ? { ...s, notebookLM: e.target.value } : s)) })} placeholder="https://notebooklm.google.com/notebook/…" className={inp} /></label>
          <label><span className={lab}>Trạng thái sổ tay</span>
            <select value={hienTai.trangThai} onChange={(e) => onLuu({ ...doc, soTay: doc.soTay.map((s) => (s.id === hienTai.id ? { ...s, trangThai: e.target.value } : s)) })} className={inp}>
              {TRANG_THAI_SO_TAY.map((x) => <option key={x.k} value={x.k}>{x.ten}</option>)}
            </select></label>
          <label className="sm:col-span-3"><span className={lab}>Người phụ trách sổ tay</span>
            <input value={hienTai.phuTrach} onChange={(e) => onLuu({ ...doc, soTay: doc.soTay.map((s) => (s.id === hienTai.id ? { ...s, phuTrach: e.target.value } : s)) })} placeholder="Họ tên, phòng/ban chuẩn bị nguồn" className={inp} /></label>
        </section>
      )}
    </>
  );
}

// ============================================================================
//  TAB 4 — NGÂN HÀNG CÂU HỎI MẪU
// ============================================================================
function NganHangCauHoi({ doc, soTay, onLuu, coQuyenGhi }) {
  const [locST, setLocST] = useState('');
  const [locTT, setLocTT] = useState('');
  const [tim, setTim] = useState('');

  const ds = useMemo(() => {
    let r = doc.cauHoi || [];
    if (locST) r = r.filter((c) => c.soTayId === locST);
    if (locTT) r = r.filter((c) => c.trangThai === locTT);
    return loc(r, tim, ['cauHoi']);
  }, [doc.cauHoi, locST, locTT, tim]);

  const daDat = (doc.cauHoi || []).filter((c) => c.trangThai === 'doi-chieu').length;
  const tenST = (id) => soTay.find((s) => s.id === id)?.ma || '—';
  const capNhat = (id, patch) => onLuu({ ...doc, cauHoi: (doc.cauHoi || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[13px] font-bold text-slate-800">Ngân hàng câu hỏi mẫu</p>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Chỉ tiêu: <b>≥ {CHI_TIEU.cauHoi} câu đã đối chiếu nguồn</b>. Hiện có <b className={daDat >= CHI_TIEU.cauHoi ? 'text-emerald-700' : 'text-slate-800'}>{daDat}</b> / {(doc.cauHoi || []).length} câu.
            </p>
          </div>
          {coQuyenGhi && <button onClick={() => onLuu({ ...doc, cauHoi: [...(doc.cauHoi || []), newCauHoi(locST || soTay[0]?.id || '')] })} className={nutPhu}><Plus className="w-3.5 h-3.5" /> Thêm câu hỏi</button>}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
          <div className={`h-full ${daDat >= CHI_TIEU.cauHoi ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(100, (daDat / CHI_TIEU.cauHoi) * 100)}%` }} />
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          <select value={locST} onChange={(e) => setLocST(e.target.value)} className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400">
            <option value="">Tất cả sổ tay</option>
            {soTay.map((s) => <option key={s.id} value={s.id}>{s.ma} — {s.ten}</option>)}
          </select>
          <select value={locTT} onChange={(e) => setLocTT(e.target.value)} className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400">
            <option value="">Mọi trạng thái</option>
            {TRANG_THAI_CAU_HOI.map((x) => <option key={x.k} value={x.k}>{x.ten}</option>)}
          </select>
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm trong câu hỏi…" className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400 flex-1 min-w-[200px]" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
        {!ds.length && <p className="px-5 py-8 text-center text-[13px] text-slate-400">Không có câu hỏi nào khớp bộ lọc.</p>}
        {ds.map((c, i) => {
          const tt = cauHoiOf(c.trangThai);
          return (
            <div key={c.id} className="px-5 py-3.5">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="shrink-0 text-[11px] font-bold text-slate-300 pt-2 w-7">{i + 1}</span>
                <div className="flex-1 min-w-[240px]">
                  <input value={c.cauHoi} disabled={!coQuyenGhi} onChange={(e) => capNhat(c.id, { cauHoi: e.target.value })} className={`${inp} font-medium`} />
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">{tenST(c.soTayId)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tt.tone}`}>{tt.ten}</span>
                    {!!c.trichDan?.length && <span className="text-[10.5px] text-slate-500">Nguồn: {c.trichDan.join(' · ')}</span>}
                    {c.ngayDoiChieu && <span className="text-[10.5px] text-slate-400">{c.nguoiDoiChieu} · {ngayVN(c.ngayDoiChieu)}</span>}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
                  <select value={c.trangThai} disabled={!coQuyenGhi}
                    onChange={(e) => capNhat(c.id, { trangThai: e.target.value, ngayDoiChieu: e.target.value === 'doi-chieu' ? homNay() : c.ngayDoiChieu })}
                    className="text-[11.5px] border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-violet-400">
                    {TRANG_THAI_CAU_HOI.map((x) => <option key={x.k} value={x.k}>{x.ten}</option>)}
                  </select>
                  <input value={c.nguoiDoiChieu} disabled={!coQuyenGhi} onChange={(e) => capNhat(c.id, { nguoiDoiChieu: e.target.value })} placeholder="Người đối chiếu" className="text-[11.5px] border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-violet-400 w-36" />
                  {coQuyenGhi && <button onClick={() => onLuu({ ...doc, cauHoi: (doc.cauHoi || []).filter((x) => x.id !== c.id) })} className="text-rose-400 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
              {!!c.dapAn && (
                <details className="ml-10 mt-2">
                  <summary className="text-[11.5px] text-violet-700 cursor-pointer font-semibold">Xem đáp án đã lưu</summary>
                  <p className="mt-1.5 text-[12px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-2.5">{c.dapAn}</p>
                </details>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}

// ============================================================================
//  TAB 5 — QUY TẮC SỬ DỤNG AI
// ============================================================================
function QuyTacAI({ doc, onLuu, coQuyenGhi, phien }) {
  const [ten, setTen] = useState('');
  const [donVi, setDonVi] = useState('');
  const q = doc.quyTac || { dieu: [], camKet: [] };
  const daKy = !!q.banHanh;

  const camKet = () => {
    if (!ten.trim()) return;
    onLuu({ ...doc, quyTac: { ...q, camKet: [{ nguoi: ten.trim(), donVi: donVi.trim(), luc: new Date().toISOString() }, ...(q.camKet || [])] } });
    setTen(''); setDonVi('');
  };

  return (
    <>
      <section className={`rounded-2xl border p-5 ${daKy ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-start gap-3">
          {daKy ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className={`text-[13px] font-bold ${daKy ? 'text-emerald-800' : 'text-amber-800'}`}>
              {daKy ? `Đã ban hành ngày ${ngayVN(q.banHanh)}${q.nguoiKy ? ` — người ký: ${q.nguoiKy}` : ''}` : 'Dự thảo — chưa được Chánh Văn phòng ký ban hành'}
            </p>
            <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
              Theo thẩm quyền đã đăng ký: <b>Chánh Văn phòng cho phép triển khai và ban hành Quy tắc</b>; Phó Chánh Văn phòng (Tổ trưởng Tổ công tác) chủ trì xây dựng và hướng dẫn thực hiện.
            </p>
            {coQuyenGhi && (
              <div className="flex items-end gap-2 flex-wrap mt-3">
                <label><span className={lab}>Ngày ban hành</span>
                  <input type="date" value={q.banHanh} onChange={(e) => onLuu({ ...doc, quyTac: { ...q, banHanh: e.target.value } })} className={inp} /></label>
                <label><span className={lab}>Người ký</span>
                  <input value={q.nguoiKy} onChange={(e) => onLuu({ ...doc, quyTac: { ...q, nguoiKy: e.target.value } })} placeholder="Chánh Văn phòng" className={inp} /></label>
                {daKy && <button onClick={() => onLuu({ ...doc, quyTac: { ...q, banHanh: '', nguoiKy: '' } })} className={nutPhu}><RotateCcw className="w-3.5 h-3.5" /> Gỡ ban hành</button>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3">
          <h2 className="font-bold text-sm">{q.tieuDe || 'Quy tắc sử dụng trí tuệ nhân tạo'}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {(q.dieu || []).map((d) => (
            <div key={d.so} className="px-5 py-4">
              <p className="text-[13px] font-bold text-slate-800">Điều {d.so}. {d.ten}</p>
              {coQuyenGhi
                ? <textarea value={d.noiDung} rows={3} onChange={(e) => onLuu({ ...doc, quyTac: { ...q, dieu: q.dieu.map((x) => (x.so === d.so ? { ...x, noiDung: e.target.value } : x)) } })} className={`${inp} mt-1.5`} />
                : <p className="text-[12.5px] text-slate-600 leading-relaxed mt-1">{d.noiDung}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-[13px] font-bold text-slate-800">Cam kết đã đọc và thực hiện</p>
        <p className="text-[11.5px] text-slate-500 mt-0.5 mb-3">Cán bộ, công chức ghi tên vào đây trước khi sử dụng sổ tay. Danh sách này là minh chứng kèm theo báo cáo đánh giá thí điểm.</p>
        <div className="flex items-end gap-2 flex-wrap">
          <label className="flex-1 min-w-[180px]"><span className={lab}>Họ và tên</span>
            <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder={phien ? '' : 'Nhập họ tên'} className={inp} /></label>
          <label className="flex-1 min-w-[180px]"><span className={lab}>Phòng, ban</span>
            <input value={donVi} onChange={(e) => setDonVi(e.target.value)} className={inp} /></label>
          <button onClick={camKet} disabled={!ten.trim() || !coQuyenGhi} className={nutChinh}><CheckCircle2 className="w-4 h-4" /> Tôi cam kết</button>
        </div>
        {!!(q.camKet || []).length && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {q.camKet.map((c, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                {c.nguoi}{c.donVi ? ` · ${c.donVi}` : ''}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ============================================================================
//  TAB 6 — HƯỚNG DẪN CÁN BỘ (chỉ tiêu 100% CBCC Văn phòng)
// ============================================================================
function HuongDanCanBo({ doc, onLuu, coQuyenGhi }) {
  const [tim, setTim] = useState('');
  const ds = useMemo(() => loc(doc.huongDan || [], tim, ['hoTen', 'donVi']), [doc.huongDan, tim]);
  const tong = (doc.huongDan || []).length;
  const xong = (doc.huongDan || []).filter((h) => h.ngay).length;
  const pct = tong ? (xong / tong) * 100 : 0;
  const capNhat = (id, patch) => onLuu({ ...doc, huongDan: (doc.huongDan || []).map((h) => (h.id === id ? { ...h, ...patch } : h)) });

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[13px] font-bold text-slate-800">Hướng dẫn cán bộ, công chức sử dụng sổ tay</p>
            <p className="text-[11.5px] text-slate-500 mt-0.5">Chỉ tiêu đăng ký: <b>100% cán bộ, công chức Văn phòng được hướng dẫn</b>. Mốc thời gian: trước {ngayVN(doc.moc.huongDan)}.</p>
          </div>
          {coQuyenGhi && <button onClick={() => onLuu({ ...doc, huongDan: [...(doc.huongDan || []), newHuongDan()] })} className={nutPhu}><Plus className="w-3.5 h-3.5" /> Thêm người</button>}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[13px] font-extrabold text-slate-700">{xong}/{tong || 0}</span>
        </div>
        {!tong && (
          <p className="mt-3 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Chưa có danh sách cán bộ. Bấm <b>“Thêm người”</b> để lập danh sách cán bộ, công chức Văn phòng cần được hướng dẫn (có thể lấy theo danh sách ở phân hệ Quản lý cán bộ).
          </p>
        )}
        {!!tong && <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo họ tên, phòng… (gõ không dấu được)" className="mt-3 text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400 w-full sm:w-72" />}
      </section>

      {!!ds.length && (
        <section className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase">
              <tr><th className="text-left px-4 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Phòng, ban</th>
                <th className="text-left px-3 py-2.5 font-semibold">Hình thức</th><th className="text-left px-3 py-2.5 font-semibold">Ngày hướng dẫn</th>
                <th className="text-left px-3 py-2.5 font-semibold">Người hướng dẫn</th><th className="px-3 py-2.5" /></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ds.map((h) => (
                <tr key={h.id} className={h.ngay ? 'bg-emerald-50/40' : ''}>
                  <td className="px-4 py-2"><input value={h.hoTen} disabled={!coQuyenGhi} onChange={(e) => capNhat(h.id, { hoTen: e.target.value })} className={inp} /></td>
                  <td className="px-3 py-2"><input value={h.donVi} disabled={!coQuyenGhi} onChange={(e) => capNhat(h.id, { donVi: e.target.value })} className={inp} /></td>
                  <td className="px-3 py-2">
                    <select value={h.hinhThuc} disabled={!coQuyenGhi} onChange={(e) => capNhat(h.id, { hinhThuc: e.target.value })} className={inp}>
                      {HINH_THUC_HD.map((x) => <option key={x} value={x}>{x}</option>)}
                    </select></td>
                  <td className="px-3 py-2"><input type="date" value={h.ngay} disabled={!coQuyenGhi} onChange={(e) => capNhat(h.id, { ngay: e.target.value })} className={inp} /></td>
                  <td className="px-3 py-2"><input value={h.nguoiHuongDan} disabled={!coQuyenGhi} onChange={(e) => capNhat(h.id, { nguoiHuongDan: e.target.value })} className={inp} /></td>
                  <td className="px-3 py-2 text-right">
                    {coQuyenGhi && <button onClick={() => onLuu({ ...doc, huongDan: (doc.huongDan || []).filter((x) => x.id !== h.id) })} className="text-rose-400 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

// ============================================================================
//  TAB 7 — BÁO CÁO ĐÁNH GIÁ THÍ ĐIỂM
// ============================================================================
function BaoCao({ doc, bao }) {
  const [dangXuat, setDangXuat] = useState(false);
  const td = useMemo(() => tienDoNhiemVu(doc, { tongCBCC: (doc.huongDan || []).length }), [doc]);
  const tg = giamThoiGian(doc);

  const xuat = async () => {
    setDangXuat(true);
    try {
      const { exportBaoCaoSoTay } = await import('./lib/exporters');
      await exportBaoCaoSoTay({ doc, tienDo: td, thoiGian: tg });
      bao('ok', 'Đã xuất báo cáo đánh giá thí điểm (Word).');
    } catch (e) {
      bao('loi', `Không xuất được báo cáo: ${String(e.message || e).slice(0, 160)}`);
    }
    setDangXuat(false);
  };

  const dong = [
    ['06 sổ tay AI theo lĩnh vực', `${td.soTay.daLam}/${CHI_TIEU.soTay} sổ tay hoàn chỉnh`, td.soTay.dat],
    ['≥ 50 câu hỏi mẫu đã đối chiếu nguồn', `${td.cauHoi.daLam}/${CHI_TIEU.cauHoi} câu`, td.cauHoi.dat],
    ['Quy tắc sử dụng AI được ban hành', td.quyTac ? `Đã ban hành ngày ${ngayVN(doc.quyTac.banHanh)}` : 'Chưa ban hành', td.quyTac],
    ['100% CBCC Văn phòng được hướng dẫn', `${td.huongDan.daLam}/${td.huongDan.tong || 0} người (${Math.round(td.huongDan.pct)}%)`, td.huongDan.dat],
    [`Thời gian tra cứu giảm ≥ ${CHI_TIEU.giamThoiGian}%`, tg.soPhepDo ? `Giảm ${tg.giam}% (${tg.soPhepDo} phép đo)` : 'Chưa có phép đo', tg.dat],
  ];

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[13px] font-bold text-slate-800">Kết quả cuối cùng theo đăng ký</p>
            <p className="text-[11.5px] text-slate-500 mt-0.5">Mốc báo cáo: trước {ngayVN(doc.moc.baoCao)}</p>
          </div>
          <button onClick={xuat} disabled={dangXuat} className={nutChinh}>
            {dangXuat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Xuất báo cáo (Word)
          </button>
        </div>
        <table className="w-full text-[13px]">
          <tbody className="divide-y divide-slate-100">
            {dong.map(([ten, ket, dat]) => (
              <tr key={ten}>
                <td className="px-5 py-3 text-slate-700">{ten}</td>
                <td className="px-3 py-3 text-slate-600 font-semibold">{ket}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${dat ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {dat ? 'Đạt' : 'Chưa đạt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[13px] font-bold text-slate-800 mb-3">Đo thời gian tra cứu</p>
          {!tg.soPhepDo && <p className="text-[12.5px] text-slate-500 leading-relaxed">Chưa có phép đo nào. Mỗi lần tra cứu ở tab <b>Tra cứu</b>, hãy nhập số phút ước lượng nếu phải tra thủ công rồi bấm <b>Ghi nhật ký + phép đo</b>.</p>}
          {!!tg.soPhepDo && (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-[11px] text-slate-500">Bằng sổ tay AI</p><p className="text-xl font-extrabold text-violet-700">{tg.giayAI}s</p></div>
                <div><p className="text-[11px] text-slate-500">Tra thủ công</p><p className="text-xl font-extrabold text-slate-700">{Math.round(tg.giayThuCong / 60)} phút</p></div>
                <div><p className="text-[11px] text-slate-500">Giảm</p><p className={`text-xl font-extrabold ${tg.dat ? 'text-emerald-700' : 'text-amber-700'}`}>{tg.giam}%</p></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Trung bình trên {tg.soPhepDo} phép đo. Ngưỡng đăng ký: giảm ≥ {CHI_TIEU.giamThoiGian}%.</p>
            </>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[13px] font-bold text-slate-800 mb-3">Tình hình từng sổ tay</p>
          <div className="space-y-2">
            {(doc.soTay || []).map((s) => {
              const t = thongKeSoTay(doc, s.id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="text-slate-600 truncate"><b className="text-violet-700">{s.ma}</b> {s.ten}</span>
                  <span className="shrink-0 text-slate-500">{t.coNguyenVan}/{t.nguon} nguồn · {t.cauHoiDat}/{t.cauHoi} câu</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
