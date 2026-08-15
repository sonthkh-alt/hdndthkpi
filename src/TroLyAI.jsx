import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home, Sparkles, FileText, Mic, SpellCheck2, Gavel, MessageSquare, Users, Library,
  Upload, Trash2, Copy, Download, Loader2, AlertTriangle, LogIn, Send, Plus, RefreshCw, Info, X,
} from 'lucide-react';
import { getSession, onAuthChange } from './lib/auth';
import {
  goiTroLy, hoiDap, docTaiLieu, gopNguCanh, chuanHoaVanBan, goiChuKy, xemHanMuc,
  LOAI_VAN_BAN, TRONG_TAM_SOAT_XET, BAN_HDND, TAC_VU_KY_HOP, LINH_VUC_KIEN_NGHI, TRANG_THAI_KIEN_NGHI,
} from './lib/troLyAI';
import {
  fetchVB, saveVB, readVB, newKienNghi, newTaiLieu, themTaiLieu, thongKeKienNghi, MAX_TAI_LIEU,
} from './lib/vanBanStore';

// ============================================================================
//  PHÂN HỆ "TRỢ LÝ AI NGHIỆP VỤ DÂN CỬ" — #/troly
//  Chuyển từ ứng dụng Streamlit `../HDND` (hdndthanhhoa.streamlit.app) sang React:
//    trang 1 (Trung tâm lập pháp)  → Trợ lý kỳ họp · Kiến nghị cử tri · Thư viện
//    trang 2 (Soạn thảo)           → Soạn văn bản · Bài phát biểu · Soát xét
//    trang 3 (Thẩm tra)            → Thẩm tra dự thảo nghị quyết
//    trang 6 (Trợ lý AI)           → Hỏi đáp
//  Khóa AI nằm ở máy chủ; mọi lượt gọi đi qua /api/troly và CHỈ phục vụ người
//  đã đăng nhập (mỗi lượt đều tốn tiền khóa API).
// ============================================================================

const TABS = [
  { id: 'kyhop', label: 'Trợ lý kỳ họp', icon: Sparkles, desc: 'Phân tích tài liệu kỳ họp, đối chiếu số liệu, gợi ý câu hỏi chất vấn.' },
  { id: 'soanthao', label: 'Soạn thảo văn bản', icon: FileText, desc: 'Sinh dự thảo văn bản hành chính theo thể thức Nghị định 30/2020/NĐ-CP.' },
  { id: 'phatbieu', label: 'Bài phát biểu', icon: Mic, desc: 'Soạn bài phát biểu của lãnh đạo tại kỳ họp, hội nghị.' },
  { id: 'soatxet', label: 'Soát xét văn bản', icon: SpellCheck2, desc: 'Rà lỗi chính tả, thể thức, văn phong và logic quản lý.' },
  { id: 'thamtra', label: 'Thẩm tra dự thảo', icon: Gavel, desc: 'Dựng báo cáo thẩm tra dự thảo nghị quyết theo 4 phần chuẩn của HĐND.' },
  { id: 'kiennghi', label: 'Kiến nghị cử tri', icon: Users, desc: 'Theo dõi, phân loại và phân tích kiến nghị của cử tri.' },
  { id: 'thuvien', label: 'Thư viện tài liệu', icon: Library, desc: 'Kho tài liệu dùng chung, lấy làm ngữ cảnh cho Trợ lý kỳ họp.' },
  { id: 'hoidap', label: 'Hỏi đáp', icon: MessageSquare, desc: 'Hỏi đáp tự do với mô hình ngôn ngữ lớn.' },
];

const FORM_MAC_DINH = {
  kyhop: { tacVu: 'chatvan', cauHoi: '', chuNhap: '', docs: [], dungThuVien: [] },
  soanthao: { loai: 'Công văn', yeuCau: '', canCu: '', docs: [] },
  phatbieu: { chucDanh: '', suKien: '', yChinh: '' },
  soatxet: { chuNhap: '', trongTam: ['Chính tả & Ngữ pháp', 'Văn phong hành chính'], docs: [] },
  thamtra: { ban: BAN_HDND[0], tenNghiQuyet: '', ghiChu: '', docs: [], docsLienQuan: [] },
  kiennghi: { cuTri: '', diaBan: '', linhVuc: LINH_VUC_KIEN_NGHI[0], noiDung: '', docs: [] },
  hoidap: { cauHoi: '' },
};

// ---------------------------------------------------------------------------
//  Mảnh giao diện dùng chung
// ---------------------------------------------------------------------------
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold text-slate-600">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-400 mt-1 leading-snug">{hint}</span>}
    </label>
  );
}
const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400';

const Input = (p) => <input {...p} className={inputCls} />;
const Area = ({ rows = 5, ...p }) => <textarea rows={rows} {...p} className={`${inputCls} leading-relaxed`} />;
const Select = ({ options, ...p }) => (
  <select {...p} className={inputCls}>
    {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.id} value={o.id}>{o.label}</option>))}
  </select>
);

/** Chọn tệp PDF/DOCX/TXT → máy chủ trích xuất chữ → giữ trong bộ nhớ của biểu mẫu. */
function ChonTep({ docs, onChange, nhan = 'Tài liệu (PDF, DOCX, TXT)', hint, khoa }) {
  const [dangDoc, setDangDoc] = useState(false);
  const [loi, setLoi] = useState('');
  const ref = useRef(null);

  const nhan_tep = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setLoi(''); setDangDoc(true);
    const them = [];
    for (const f of files) {
      const r = await docTaiLieu(f);
      if (r.error) { setLoi(r.error); continue; }
      them.push({ ten: r.ten, text: r.text });
      if (r.canhBao) setLoi(r.canhBao);
    }
    setDangDoc(false);
    if (them.length) onChange([...(docs || []), ...them]);
  };

  return (
    <div>
      <p className="text-[12px] font-bold text-slate-600">{nhan}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button type="button" disabled={khoa || dangDoc} onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50">
          {dangDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Chọn tệp
        </button>
        <input ref={ref} type="file" multiple accept=".pdf,.docx,.txt" onChange={nhan_tep} className="hidden" />
        {!!(docs || []).length && <span className="text-[11px] text-slate-500">{docs.length} tệp · {goiChuKy(docs.reduce((s, d) => s + (d.text || '').length, 0))}</span>}
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1 leading-snug">{hint}</p>}
      {!!(docs || []).length && (
        <ul className="mt-2 space-y-1">
          {docs.map((d, i) => (
            <li key={`${d.ten}-${i}`} className="flex items-center justify-between gap-2 text-[12px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <span className="truncate text-slate-700">{d.ten} <span className="text-slate-400">· {goiChuKy((d.text || '').length)}</span></span>
              <button type="button" onClick={() => onChange(docs.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      )}
      {loi && <p className="mt-2 text-[12px] text-amber-700 flex items-start gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{loi}</p>}
    </div>
  );
}

function NutChay({ dangChay, onClick, khoa, children }) {
  return (
    <button type="button" onClick={onClick} disabled={khoa || dangChay}
      className="inline-flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
      {dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      {dangChay ? 'AI đang xử lý…' : children}
    </button>
  );
}

/** Cột kết quả: sửa được, sao chép, tải Word. */
function KhungKetQua({ text, onChange, onXuat, tenXuat = 'Tải file Word', rows = 20, trong = 'Kết quả sẽ hiển thị ở đây.' }) {
  const [daChep, setDaChep] = useState(false);
  const chep = async () => {
    try { await navigator.clipboard.writeText(text || ''); setDaChep(true); setTimeout(() => setDaChep(false), 1500); } catch { /* trình duyệt chặn */ }
  };
  if (!text) return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-[13px] text-slate-500">{trong}</div>;
  return (
    <div>
      <Area rows={rows} value={text} onChange={(e) => onChange(e.target.value)} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={chep} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">
          <Copy className="w-4 h-4" /> {daChep ? 'Đã sao chép' : 'Sao chép'}
        </button>
        {onXuat && (
          <button type="button" onClick={onXuat} className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900">
            <Download className="w-4 h-4" /> {tenXuat}
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] text-amber-700 flex items-start gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Nội dung do AI sinh ra chỉ để tham khảo — phải rà soát, đối chiếu văn bản gốc trước khi sử dụng chính thức.
      </p>
    </div>
  );
}

const Cot2 = ({ trai, phai }) => (
  <div className="grid lg:grid-cols-2 gap-6 items-start">
    <div className="space-y-4 min-w-0">{trai}</div>
    <div className="min-w-0">{phai}</div>
  </div>
);

// ---------------------------------------------------------------------------
//  Module chính
// ---------------------------------------------------------------------------
export default function TroLyAI({ onHome }) {
  const [tab, setTab] = useState('kyhop');
  const [phien, setPhien] = useState(undefined);      // undefined = đang kiểm tra
  const [form, setForm] = useState(FORM_MAC_DINH);
  const [kq, setKq] = useState({});                   // kết quả theo từng tab
  const [dangChay, setDangChay] = useState('');
  const [loi, setLoi] = useState('');
  const [vb, setVb] = useState(readVB);               // kiến nghị + thư viện
  const [thongBao, setThongBao] = useState('');
  const [chat, setChat] = useState([]);
  const [hanMuc, setHanMuc] = useState(null);   // { conLai, gioiHan, daDung }

  useEffect(() => {
    let alive = true;
    getSession().then((s) => { if (alive) setPhien(s || null); });
    const off = onAuthChange((s) => setPhien(s || null));
    fetchVB().then((d) => { if (alive) setVb(d); });
    return () => { alive = false; off(); };
  }, []);

  // Hạn mức tính theo tài khoản nên đăng nhập / đăng xuất là phải hỏi lại máy chủ.
  useEffect(() => {
    if (phien === undefined) return;
    let alive = true;
    xemHanMuc().then((r) => { if (alive && r?.hanMuc) setHanMuc(r.hanMuc); });
    return () => { alive = false; };
  }, [phien]);

  const daDangNhap = !!phien;
  const email = phien?.user?.email || '';
  // Hết lượt trong ngày thì khóa các nút gọi AI (vẫn xem và soạn nội dung được).
  const hetLuot = !!hanMuc && hanMuc.conLai <= 0;

  const up = (t, patch) => setForm((f) => ({ ...f, [t]: { ...f[t], ...patch } }));
  const datKq = (t, v) => setKq((k) => ({ ...k, [t]: v }));

  /** Gọi máy chủ, gom sẵn xử lý cờ đang chạy và thông báo lỗi. */
  async function chay(id, fn) {
    setLoi(''); setThongBao(''); setDangChay(id);
    try {
      const r = await fn();
      if (r?.hanMuc) setHanMuc(r.hanMuc);
      if (r?.error) { setLoi(r.error); return null; }
      if (r?.canhBao) setThongBao(r.canhBao);
      return r;
    } catch (e) {
      setLoi(e.message || String(e));
      return null;
    } finally { setDangChay(''); }
  }

  /** Ghi kiến nghị / thư viện lên máy chủ (cần đăng nhập vì RLS chặn khách ghi). */
  async function luuVB(next) {
    setVb(next);
    const r = await saveVB(next);
    if (!r.ok) setThongBao('Chưa lưu được lên máy chủ (chưa đăng nhập hoặc mất kết nối) — dữ liệu đang giữ tạm trên máy này.');
    else setThongBao('Đã lưu.');
  }

  // ---- Các việc gọi AI ----------------------------------------------------
  const nguCanhKyHop = () => {
    const f = form.kyhop;
    const tuThuVien = (vb.taiLieu || []).filter((t) => f.dungThuVien.includes(t.id)).map((t) => ({ ten: t.ten, text: t.text }));
    return gopNguCanh([...f.docs, ...tuThuVien], f.chuNhap);
  };

  const chayKyHop = async () => {
    const nguCanh = nguCanhKyHop();
    if (!nguCanh.trim()) { setLoi('Chưa có tài liệu để phân tích: hãy chọn tệp, dán nội dung hoặc chọn tài liệu trong Thư viện.'); return; }
    const r = await chay('kyhop', () => goiTroLy('kyhop', { tacVu: form.kyhop.tacVu, cauHoi: form.kyhop.cauHoi, nguCanh }));
    if (r) datKq('kyhop', r.text || '');
  };

  const chaySoanThao = async () => {
    const f = form.soanthao;
    if (!f.yeuCau.trim()) { setLoi('Chưa nhập yêu cầu soạn thảo.'); return; }
    const r = await chay('soanthao', () => goiTroLy('soanthao', { yeuCau: f.yeuCau, loai: f.loai, canCu: f.canCu, nguCanh: gopNguCanh(f.docs) }));
    if (r) datKq('soanthao', r.json ? chuanHoaVanBan(r.json) : { noi_dung_chinh: r.text || '', loai_van_ban: f.loai === 'Tự động' ? '' : f.loai.toUpperCase(), noi_nhan: [], trich_yeu: '', so_ky_hieu: '', dia_danh_ngay_thang: '', co_quan_chu_quan: '', co_quan_ban_hanh: '', quyen_han_ky: '', nguoi_ky: '' });
  };

  const chayPhatBieu = async () => {
    const f = form.phatbieu;
    if (!f.yChinh.trim()) { setLoi('Chưa nhập ý chính cần nhấn mạnh.'); return; }
    const r = await chay('phatbieu', () => goiTroLy('phatbieu', f));
    if (r) datKq('phatbieu', r.json ? chuanHoaVanBan(r.json).noi_dung_chinh : (r.text || ''));
  };

  const chaySoatXet = async () => {
    const f = form.soatxet;
    const vanBan = gopNguCanh(f.docs, f.chuNhap);
    if (!vanBan.trim()) { setLoi('Chưa có văn bản để soát xét.'); return; }
    const r = await chay('soatxet', () => goiTroLy('soatxet', { vanBan, trongTam: f.trongTam }));
    if (r) datKq('soatxet', r.text || '');
  };

  const chayThamTra = async () => {
    const f = form.thamtra;
    if (!f.docs.length && !f.tenNghiQuyet.trim()) { setLoi('Chưa có tài liệu: hãy tải lên Tờ trình và Dự thảo nghị quyết.'); return; }
    const r = await chay('thamtra', () => goiTroLy('thamtra', {
      ban: f.ban, tenNghiQuyet: f.tenNghiQuyet, ghiChu: f.ghiChu,
      taiLieu: gopNguCanh(f.docs), lienQuan: gopNguCanh(f.docsLienQuan),
    }));
    if (r) datKq('thamtra', r.text || '');
  };

  const chayKienNghiFile = async () => {
    const vanBan = gopNguCanh(form.kiennghi.docs);
    if (!vanBan.trim()) { setLoi('Chưa chọn tệp tổng hợp kiến nghị.'); return; }
    const r = await chay('kiennghi_file', () => goiTroLy('kiennghi_file', { vanBan }));
    if (r) datKq('kiennghi', r.text || '');
  };

  const chayKienNghiXuHuong = async () => {
    if (!(vb.kienNghi || []).length) { setLoi('Chưa có kiến nghị nào trong danh sách.'); return; }
    const r = await chay('kiennghi_xuhuong', () => goiTroLy('kiennghi_xuhuong', { rows: vb.kienNghi }));
    if (r) datKq('kiennghi', r.text || '');
  };

  const guiChat = async () => {
    const q = form.hoidap.cauHoi.trim();
    if (!q) return;
    const turns = [...chat, { role: 'user', text: q }];
    setChat(turns); up('hoidap', { cauHoi: '' });
    const r = await chay('hoidap', () => hoiDap(turns));
    if (r) setChat([...turns, { role: 'assistant', text: r.text || '' }]);
  };

  // ---- Xuất Word (nạp thư viện nặng theo nhu cầu) --------------------------
  const xuatND30 = async () => {
    const { exportVanBanND30 } = await import('./lib/exporters');
    await exportVanBanND30(kq.soanthao || {});
  };
  const xuatThamTra = async () => {
    const { exportBaoCaoThamTra } = await import('./lib/exporters');
    await exportBaoCaoThamTra({ text: kq.thamtra || '', ban: form.thamtra.ban, tenNghiQuyet: form.thamtra.tenNghiQuyet });
  };
  const xuatDonGian = async (tieuDe, phuDe, text) => {
    const { exportVanBanDonGian } = await import('./lib/exporters');
    await exportVanBanDonGian({ tieuDe, phuDe, text });
  };

  // ---- Thư viện tài liệu --------------------------------------------------
  const themVaoThuVien = async (files) => {
    const them = [];
    for (const d of files) them.push(newTaiLieu({ ten: d.ten, text: d.text, nguoiTai: email }));
    await luuVB({ ...vb, taiLieu: them.reduce((ds, t) => themTaiLieu(ds, t), vb.taiLieu || []) });
  };

  const tk = useMemo(() => thongKeKienNghi(vb.kienNghi), [vb.kienNghi]);
  const tabHienTai = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ===== Đầu trang ===== */}
      <header className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors"><Home className="w-5 h-5" /></button>
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-2 ring-white/30 p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-300">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-300 text-amber-950">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold leading-tight">Trợ lý AI nghiệp vụ dân cử</h1>
              <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">Hệ thống phần mềm nghiệp vụ dùng chung</p>
            </div>
          </div>
          <div className="text-[12px]">
            {phien === undefined ? <span className="text-white/60">Đang kiểm tra đăng nhập…</span>
              : daDangNhap ? <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-300/40 text-emerald-100">Đã đăng nhập: {email}</span>
                : (
                  <a href="#/okr?login=1" className="inline-flex items-center gap-1.5 font-bold px-3.5 py-2 rounded-lg bg-white text-slate-800 hover:bg-slate-100">
                    <LogIn className="w-4 h-4" /> Đăng nhập để có 5 lượt/ngày
                  </a>
                )}
          </div>
        </div>
      </header>

      {/* ===== Thanh việc ===== */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Ic = t.icon;
            const on = t.id === tab;
            return (
              <button key={t.id} onClick={() => { setTab(t.id); setLoi(''); setThongBao(''); }}
                className={`shrink-0 flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-3 border-b-2 transition-colors ${on ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <Ic className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[13px] text-slate-600 leading-relaxed"><b>{tabHienTai.label}.</b> {tabHienTai.desc}</p>
        </div>

        {phien !== undefined && (
          <div className={`rounded-2xl border p-4 text-[13px] flex items-start gap-2 ${hetLuot ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600'}`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${hetLuot ? '' : 'text-slate-400'}`} />
            <span>
              {hanMuc
                ? <>Lượt gọi AI trong ngày: <b>còn {hanMuc.conLai}/{hanMuc.gioiHan} lượt</b>. </>
                : <>Mỗi lượt gọi AI đều tốn chi phí khóa dịch vụ nên có giới hạn theo ngày. </>}
              {daDangNhap
                ? <>Tài khoản đã đăng nhập được <b>5 lượt/ngày</b>. Hết lượt thì dùng tiếp vào ngày mai hoặc liên hệ Quản trị để nâng hạn mức.</>
                : <>Khách được dùng thử <b>1 lượt/ngày</b>; <a href="#/okr?login=1" className="font-bold underline">đăng nhập</a> bằng tài khoản cơ quan để có <b>5 lượt/ngày</b> và lưu được dữ liệu.</>}
            </span>
          </div>
        )}
        {loi && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{loi}</span>
          </div>
        )}
        {thongBao && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-[12.5px] text-sky-800 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" /> <span>{thongBao}</span>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          {/* ---------- Trợ lý kỳ họp ---------- */}
          {tab === 'kyhop' && (
            <Cot2
              trai={<>
                <ChonTep docs={form.kyhop.docs} onChange={(d) => up('kyhop', { docs: d })}
                  nhan="Tài liệu kỳ họp (PDF, DOCX, TXT)" hint="Tối đa 3 MB mỗi tệp. Tệp PDF là bản chụp (scan) sẽ không trích được chữ." />
                <Field label="Hoặc dán trực tiếp nội dung cần đối soát">
                  <Area rows={7} value={form.kyhop.chuNhap} onChange={(e) => up('kyhop', { chuNhap: e.target.value })} placeholder="Dán báo cáo, số liệu, dự thảo nghị quyết…" />
                </Field>
                {!!(vb.taiLieu || []).length && (
                  <div>
                    <p className="text-[12px] font-bold text-slate-600">Lấy thêm từ Thư viện tài liệu</p>
                    <div className="mt-1 space-y-1 max-h-40 overflow-y-auto pr-1">
                      {vb.taiLieu.map((t) => (
                        <label key={t.id} className="flex items-center gap-2 text-[12px] text-slate-700">
                          <input type="checkbox" checked={form.kyhop.dungThuVien.includes(t.id)}
                            onChange={(e) => up('kyhop', { dungThuVien: e.target.checked ? [...form.kyhop.dungThuVien, t.id] : form.kyhop.dungThuVien.filter((x) => x !== t.id) })} />
                          <span className="truncate">{t.ten} <span className="text-slate-400">· {goiChuKy(t.soKyTu)}</span></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <Field label="Tác vụ phân tích">
                  <Select value={form.kyhop.tacVu} options={TAC_VU_KY_HOP} onChange={(e) => up('kyhop', { tacVu: e.target.value })} />
                </Field>
                {form.kyhop.tacVu === 'tuchon' && (
                  <Field label="Yêu cầu cụ thể">
                    <Area rows={3} value={form.kyhop.cauHoi} onChange={(e) => up('kyhop', { cauHoi: e.target.value })} placeholder="Ví dụ: Chỉ ra các rủi ro trong kế hoạch đầu tư công…" />
                  </Field>
                )}
                <NutChay dangChay={dangChay === 'kyhop'} khoa={hetLuot} onClick={chayKyHop}>Thực hiện phân tích</NutChay>
              </>}
              phai={<KhungKetQua text={kq.kyhop || ''} onChange={(v) => datKq('kyhop', v)}
                onXuat={() => xuatDonGian('Báo cáo phân tích phục vụ kỳ họp', '', kq.kyhop)} tenXuat="Tải báo cáo (Word)"
                trong="Kết quả phản biện, gợi ý chất vấn sẽ hiển thị ở đây." />}
            />
          )}

          {/* ---------- Soạn thảo văn bản ---------- */}
          {tab === 'soanthao' && (
            <Cot2
              trai={<>
                <Field label="Loại văn bản"><Select value={form.soanthao.loai} options={LOAI_VAN_BAN} onChange={(e) => up('soanthao', { loai: e.target.value })} /></Field>
                <Field label="Yêu cầu chi tiết" hint="Nêu rõ mục đích, đối tượng nhận, nội dung chính cần có.">
                  <Area rows={5} value={form.soanthao.yeuCau} onChange={(e) => up('soanthao', { yeuCau: e.target.value })} placeholder="Ví dụ: Soạn công văn trả lời đề xuất bố trí kinh phí sửa chữa trụ sở…" />
                </Field>
                <Field label="Căn cứ pháp lý (tùy chọn)" hint="Dán nội dung điều khoản luật, nghị định, nghị quyết cần viện dẫn.">
                  <Area rows={4} value={form.soanthao.canCu} onChange={(e) => up('soanthao', { canCu: e.target.value })} />
                </Field>
                <ChonTep docs={form.soanthao.docs} onChange={(d) => up('soanthao', { docs: d })} nhan="Tài liệu tham khảo (tùy chọn)" />
                <NutChay dangChay={dangChay === 'soanthao'} khoa={hetLuot} onClick={chaySoanThao}>Tạo dự thảo văn bản</NutChay>
              </>}
              phai={kq.soanthao ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Cơ quan ban hành"><Input value={kq.soanthao.co_quan_ban_hanh} onChange={(e) => datKq('soanthao', { ...kq.soanthao, co_quan_ban_hanh: e.target.value })} /></Field>
                    <Field label="Số, ký hiệu"><Input value={kq.soanthao.so_ky_hieu} onChange={(e) => datKq('soanthao', { ...kq.soanthao, so_ky_hieu: e.target.value })} /></Field>
                    <Field label="Loại văn bản (in hoa)"><Input value={kq.soanthao.loai_van_ban} onChange={(e) => datKq('soanthao', { ...kq.soanthao, loai_van_ban: e.target.value })} /></Field>
                    <Field label="Trích yếu"><Input value={kq.soanthao.trich_yeu} onChange={(e) => datKq('soanthao', { ...kq.soanthao, trich_yeu: e.target.value })} /></Field>
                  </div>
                  <Field label="Nội dung chính">
                    <Area rows={16} value={kq.soanthao.noi_dung_chinh} onChange={(e) => datKq('soanthao', { ...kq.soanthao, noi_dung_chinh: e.target.value })} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Nơi nhận (mỗi dòng một mục)">
                      <Area rows={4} value={(kq.soanthao.noi_nhan || []).join('\n')} onChange={(e) => datKq('soanthao', { ...kq.soanthao, noi_nhan: e.target.value.split('\n').filter(Boolean) })} />
                    </Field>
                    <div className="space-y-3">
                      <Field label="Quyền hạn, chức vụ người ký"><Input value={kq.soanthao.quyen_han_ky} onChange={(e) => datKq('soanthao', { ...kq.soanthao, quyen_han_ky: e.target.value })} /></Field>
                      <Field label="Họ tên người ký"><Input value={kq.soanthao.nguoi_ky} onChange={(e) => datKq('soanthao', { ...kq.soanthao, nguoi_ky: e.target.value })} /></Field>
                    </div>
                  </div>
                  <button type="button" onClick={xuatND30} className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900">
                    <Download className="w-4 h-4" /> Xuất Word chuẩn NĐ 30
                  </button>
                  <p className="text-[11px] text-amber-700 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Dự thảo do AI sinh ra — phải rà soát thể thức, căn cứ pháp lý và số liệu trước khi trình ký.</p>
                </div>
              ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-[13px] text-slate-500">Dự thảo văn bản sẽ hiển thị ở đây, sửa được từng phần trước khi xuất Word.</div>}
            />
          )}

          {/* ---------- Bài phát biểu ---------- */}
          {tab === 'phatbieu' && (
            <Cot2
              trai={<>
                <Field label="Chức danh người phát biểu"><Input value={form.phatbieu.chucDanh} onChange={(e) => up('phatbieu', { chucDanh: e.target.value })} placeholder="Ví dụ: Chủ tịch HĐND tỉnh" /></Field>
                <Field label="Tên sự kiện"><Input value={form.phatbieu.suKien} onChange={(e) => up('phatbieu', { suKien: e.target.value })} placeholder="Ví dụ: Kỳ họp thứ 20 HĐND tỉnh khóa XVIII" /></Field>
                <Field label="Ý chính cần nhấn mạnh">
                  <Area rows={7} value={form.phatbieu.yChinh} onChange={(e) => up('phatbieu', { yChinh: e.target.value })} placeholder="Mỗi ý một dòng: kết quả nổi bật, hạn chế, nhiệm vụ trọng tâm…" />
                </Field>
                <NutChay dangChay={dangChay === 'phatbieu'} khoa={hetLuot} onClick={chayPhatBieu}>Soạn bài phát biểu</NutChay>
              </>}
              phai={<KhungKetQua text={kq.phatbieu || ''} onChange={(v) => datKq('phatbieu', v)}
                onXuat={() => xuatDonGian(`Bài phát biểu của ${form.phatbieu.chucDanh || 'lãnh đạo'}`, form.phatbieu.suKien, kq.phatbieu)}
                tenXuat="Tải bài phát biểu (Word)" trong="Bài phát biểu sẽ hiển thị ở đây." />}
            />
          )}

          {/* ---------- Soát xét văn bản ---------- */}
          {tab === 'soatxet' && (
            <Cot2
              trai={<>
                <ChonTep docs={form.soatxet.docs} onChange={(d) => up('soatxet', { docs: d })} nhan="Văn bản cần kiểm tra (PDF, DOCX, TXT)" />
                <Field label="Hoặc dán nội dung văn bản">
                  <Area rows={10} value={form.soatxet.chuNhap} onChange={(e) => up('soatxet', { chuNhap: e.target.value })} />
                </Field>
                <div>
                  <p className="text-[12px] font-bold text-slate-600">Trọng tâm kiểm tra</p>
                  <div className="mt-1 grid sm:grid-cols-2 gap-1">
                    {TRONG_TAM_SOAT_XET.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-[12px] text-slate-700">
                        <input type="checkbox" checked={form.soatxet.trongTam.includes(t)}
                          onChange={(e) => up('soatxet', { trongTam: e.target.checked ? [...form.soatxet.trongTam, t] : form.soatxet.trongTam.filter((x) => x !== t) })} />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
                <NutChay dangChay={dangChay === 'soatxet'} khoa={hetLuot} onClick={chaySoatXet}>Bắt đầu kiểm tra</NutChay>
              </>}
              phai={<KhungKetQua text={kq.soatxet || ''} onChange={(v) => datKq('soatxet', v)}
                onXuat={() => xuatDonGian('Báo cáo soát xét văn bản', '', kq.soatxet)} tenXuat="Tải báo cáo (Word)"
                trong="Bảng lỗi và đề xuất hiệu chỉnh sẽ hiển thị ở đây." />}
            />
          )}

          {/* ---------- Thẩm tra dự thảo nghị quyết ---------- */}
          {tab === 'thamtra' && (
            <Cot2
              trai={<>
                <Field label="Ban thẩm tra"><Select value={form.thamtra.ban} options={BAN_HDND} onChange={(e) => up('thamtra', { ban: e.target.value })} /></Field>
                <Field label="Tên dự thảo nghị quyết"><Input value={form.thamtra.tenNghiQuyet} onChange={(e) => up('thamtra', { tenNghiQuyet: e.target.value })} placeholder="Ví dụ: Nghị quyết về phân bổ ngân sách địa phương năm 2027" /></Field>
                <ChonTep docs={form.thamtra.docs} onChange={(d) => up('thamtra', { docs: d })} nhan="Tờ trình UBND tỉnh, dự thảo nghị quyết" />
                <ChonTep docs={form.thamtra.docsLienQuan} onChange={(d) => up('thamtra', { docsLienQuan: d })} nhan="Văn bản liên quan (tùy chọn)" />
                <Field label="Ghi chú, yêu cầu đặc biệt (tùy chọn)">
                  <Area rows={3} value={form.thamtra.ghiChu} onChange={(e) => up('thamtra', { ghiChu: e.target.value })} placeholder="Ví dụ: Tập trung phản biện nguồn kinh phí bố trí…" />
                </Field>
                <NutChay dangChay={dangChay === 'thamtra'} khoa={hetLuot} onClick={chayThamTra}>Tạo báo cáo thẩm tra</NutChay>
              </>}
              phai={<KhungKetQua text={kq.thamtra || ''} onChange={(v) => datKq('thamtra', v)} onXuat={xuatThamTra}
                tenXuat="Xuất báo cáo thẩm tra (Word)" trong="Báo cáo thẩm tra 4 phần sẽ hiển thị ở đây." />}
            />
          )}

          {/* ---------- Kiến nghị cử tri ---------- */}
          {tab === 'kiennghi' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[['Tổng kiến nghị', tk.tong, 'bg-slate-50 text-slate-700'], ['Mới tiếp nhận', tk.moi, 'bg-amber-50 text-amber-700'],
                  ['Đang xử lý', tk.dangXuLy, 'bg-sky-50 text-sky-700'], ['Đã xong', tk.daXong, 'bg-emerald-50 text-emerald-700']].map(([ten, so, cls]) => (
                    <div key={ten} className={`rounded-2xl border border-slate-200 p-3 ${cls}`}>
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">{ten}</p>
                      <p className="text-2xl font-extrabold">{so}</p>
                    </div>
                  ))}
              </div>

              {!!tk.theoLinhVuc.length && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['Theo lĩnh vực', tk.theoLinhVuc], ['Theo địa bàn', tk.theoDiaBan]].map(([ten, ds]) => (
                    <div key={ten} className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-[12px] font-bold text-slate-600 mb-2">{ten}</p>
                      <div className="space-y-1.5">
                        {ds.slice(0, 8).map((r) => (
                          <div key={r.ten} className="flex items-center gap-2">
                            <span className="text-[12px] text-slate-600 w-32 shrink-0 truncate">{r.ten}</span>
                            <span className="h-2.5 rounded-full bg-slate-700" style={{ width: `${Math.max(6, Math.round((r.soLuong / (tk.tong || 1)) * 100))}%` }} />
                            <span className="text-[12px] font-semibold text-slate-700">{r.soLuong}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bảng kiến nghị */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-[12.5px]">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      {['Cử tri', 'Địa bàn', 'Lĩnh vực', 'Nội dung kiến nghị', 'Trạng thái', ''].map((h) => <th key={h} className="text-left font-bold px-3 py-2 whitespace-nowrap">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(vb.kienNghi || []).map((k) => (
                      <tr key={k.id} className="border-t border-slate-100 align-top">
                        <td className="px-3 py-2 whitespace-nowrap">{k.cuTri || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{k.diaBan || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{k.linhVuc || '—'}</td>
                        <td className="px-3 py-2 min-w-[280px]">{k.noiDung}</td>
                        <td className="px-3 py-2">
                          <select value={k.trangThai} disabled={!daDangNhap}
                            onChange={(e) => luuVB({ ...vb, kienNghi: vb.kienNghi.map((x) => (x.id === k.id ? { ...x, trangThai: e.target.value } : x)) })}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-[12px]">
                            {TRANG_THAI_KIEN_NGHI.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <button type="button" disabled={!daDangNhap} title="Xóa kiến nghị"
                            onClick={() => luuVB({ ...vb, kienNghi: vb.kienNghi.filter((x) => x.id !== k.id) })}
                            className="text-slate-400 hover:text-red-600 disabled:opacity-40"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {!(vb.kienNghi || []).length && (
                      <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">Chưa có kiến nghị nào. Thêm ở khung bên dưới hoặc để AI tổng hợp từ tệp báo cáo.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  <p className="text-[13px] font-bold text-slate-700">Tiếp nhận kiến nghị mới</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Cử tri"><Input value={form.kiennghi.cuTri} onChange={(e) => up('kiennghi', { cuTri: e.target.value })} /></Field>
                    <Field label="Địa bàn"><Input value={form.kiennghi.diaBan} onChange={(e) => up('kiennghi', { diaBan: e.target.value })} placeholder="Xã, phường" /></Field>
                  </div>
                  <Field label="Lĩnh vực"><Select value={form.kiennghi.linhVuc} options={LINH_VUC_KIEN_NGHI} onChange={(e) => up('kiennghi', { linhVuc: e.target.value })} /></Field>
                  <Field label="Nội dung kiến nghị"><Area rows={4} value={form.kiennghi.noiDung} onChange={(e) => up('kiennghi', { noiDung: e.target.value })} /></Field>
                  <button type="button" disabled={!daDangNhap || !form.kiennghi.noiDung.trim()}
                    onClick={() => { luuVB({ ...vb, kienNghi: [newKienNghi(form.kiennghi), ...(vb.kienNghi || [])] }); up('kiennghi', { cuTri: '', diaBan: '', noiDung: '' }); }}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50">
                    <Plus className="w-4 h-4" /> Lưu kiến nghị
                  </button>

                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <p className="text-[13px] font-bold text-slate-700">Nhờ AI tổng hợp</p>
                    <ChonTep docs={form.kiennghi.docs} onChange={(d) => up('kiennghi', { docs: d })} nhan="Tệp tổng hợp kiến nghị cử tri" />
                    <div className="flex flex-wrap gap-2">
                      <NutChay dangChay={dangChay === 'kiennghi_file'} khoa={hetLuot} onClick={chayKienNghiFile}>Tổng hợp từ tệp</NutChay>
                      <NutChay dangChay={dangChay === 'kiennghi_xuhuong'} khoa={hetLuot} onClick={chayKienNghiXuHuong}>Phân tích xu hướng</NutChay>
                    </div>
                  </div>
                </div>
                <KhungKetQua text={kq.kiennghi || ''} onChange={(v) => datKq('kiennghi', v)}
                  onXuat={() => xuatDonGian('Báo cáo tổng hợp kiến nghị cử tri', '', kq.kiennghi)} tenXuat="Tải báo cáo (Word)"
                  trong="Kết quả tổng hợp, phân tích của AI sẽ hiển thị ở đây." />
              </div>
            </div>
          )}

          {/* ---------- Thư viện tài liệu ---------- */}
          {tab === 'thuvien' && (
            <div className="space-y-4">
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Tài liệu tải lên được trích xuất thành văn bản và lưu chung cho cả cơ quan, dùng làm ngữ cảnh cho <b>Trợ lý kỳ họp</b>.
                Giữ tối đa <b>{MAX_TAI_LIEU}</b> tài liệu mới nhất. <b>Không tải lên tài liệu mật</b> hoặc chứa thông tin cá nhân của công dân.
              </p>
              <ChonTep docs={[]} khoa={!daDangNhap} onChange={themVaoThuVien} nhan="Thêm tài liệu vào kho" hint="Chọn tệp xong là tự lưu vào kho." />
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-[12.5px]">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>{['Tên tài liệu', 'Dung lượng chữ', 'Người tải', 'Ngày', ''].map((h) => <th key={h} className="text-left font-bold px-3 py-2 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(vb.taiLieu || []).map((t) => (
                      <tr key={t.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">{t.ten}{t.batDauCat && <span className="ml-2 text-[11px] text-amber-700">(đã cắt bớt phần cuối)</span>}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{goiChuKy(t.soKyTu)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{t.nguoiTai || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{t.at ? new Date(t.at).toLocaleDateString('vi-VN') : ''}</td>
                        <td className="px-3 py-2">
                          <button type="button" disabled={!daDangNhap} title="Xóa khỏi kho"
                            onClick={() => luuVB({ ...vb, taiLieu: vb.taiLieu.filter((x) => x.id !== t.id) })}
                            className="text-slate-400 hover:text-red-600 disabled:opacity-40"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {!(vb.taiLieu || []).length && <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">Kho tri thức đang trống.</td></tr>}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => fetchVB().then(setVb)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">
                <RefreshCw className="w-4 h-4" /> Tải lại từ máy chủ
              </button>
            </div>
          )}

          {/* ---------- Hỏi đáp ---------- */}
          {tab === 'hoidap' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 min-h-[220px] max-h-[460px] overflow-y-auto space-y-3">
                {!chat.length && <p className="text-[13px] text-slate-500">Hỏi bất cứ điều gì phục vụ công việc: tra cứu quy định, gợi ý cách diễn đạt, tóm tắt nội dung… Trợ lý không đọc được số liệu trong hệ thống ở màn này.</p>}
                {chat.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                    <div className={`inline-block max-w-[92%] text-left rounded-2xl px-3.5 py-2.5 text-[13px] whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {dangChay === 'hoidap' && <p className="text-[12px] text-slate-500 flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Trợ lý đang soạn câu trả lời…</p>}
              </div>
              <div className="flex gap-2">
                <input value={form.hoidap.cauHoi} disabled={hetLuot}
                  onChange={(e) => up('hoidap', { cauHoi: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); guiChat(); } }}
                  placeholder={hetLuot ? 'Đã hết lượt gọi AI trong ngày' : 'Nhập câu hỏi rồi bấm Enter…'}
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-400" />
                <button type="button" onClick={guiChat} disabled={hetLuot || dangChay === 'hoidap'}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"><Send className="w-4 h-4" /> Gửi</button>
                {!!chat.length && (
                  <button type="button" onClick={() => setChat([])} title="Xóa lịch sử trò chuyện"
                    className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-500"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center space-y-1.5">
          <p className="text-[12px] font-semibold text-amber-600">⚠ Bản demo thử nghiệm — nội dung do AI sinh ra phải được cán bộ rà soát trước khi sử dụng.</p>
          <p className="text-[12px] text-slate-500">© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
        </div>
      </footer>
    </div>
  );
}
