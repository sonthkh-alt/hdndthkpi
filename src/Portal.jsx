import { useEffect, useState } from 'react';
import {
  Target, ShieldCheck, Landmark, Users, BookOpen, FlaskConical, ArrowRight, Eye,
  LogIn, Sparkles, LayoutGrid, Phone, Mail, CalendarDays, ScanSearch, Database, Vote, ExternalLink,
} from 'lucide-react';
import { MODULES, isExternal } from './lib/modules';
import { readVersionCfg, fetchVersionCfg } from './lib/versionCfg';
import { countVisit } from './lib/visits';

// ============================================================================
//  TRANG CHỦ (PORTAL) — cổng vào các phân hệ nghiệp vụ.
//  Người dùng chọn phân hệ bằng cách bấm vào thẻ (icon) tương ứng.
// ============================================================================

const ICONS = { Target, ShieldCheck, Landmark, Users, BookOpen, FlaskConical, CalendarDays, ScanSearch, Sparkles, Database, Vote };

// Viết đủ tên lớp Tailwind để không bị loại khi build.
const TONE = {
  emerald: { tile: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-100', border: 'hover:border-emerald-300', chip: 'bg-emerald-50 text-emerald-700 border-emerald-100', link: 'text-emerald-700' },
  rose: { tile: 'from-rose-500 to-red-700', shadow: 'shadow-rose-100', border: 'hover:border-rose-300', chip: 'bg-rose-50 text-rose-700 border-rose-100', link: 'text-rose-700' },
  indigo: { tile: 'from-indigo-500 to-blue-700', shadow: 'shadow-indigo-100', border: 'hover:border-indigo-300', chip: 'bg-indigo-50 text-indigo-700 border-indigo-100', link: 'text-indigo-700' },
  amber: { tile: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-100', border: 'hover:border-amber-300', chip: 'bg-amber-50 text-amber-700 border-amber-100', link: 'text-amber-700' },
  sky: { tile: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-100', border: 'hover:border-sky-300', chip: 'bg-sky-50 text-sky-700 border-sky-100', link: 'text-sky-700' },
  violet: { tile: 'from-violet-500 to-purple-700', shadow: 'shadow-violet-100', border: 'hover:border-violet-300', chip: 'bg-violet-50 text-violet-700 border-violet-100', link: 'text-violet-700' },
  teal: { tile: 'from-teal-500 to-emerald-700', shadow: 'shadow-teal-100', border: 'hover:border-teal-300', chip: 'bg-teal-50 text-teal-700 border-teal-100', link: 'text-teal-700' },
  slate: { tile: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-100', border: 'hover:border-slate-400', chip: 'bg-slate-100 text-slate-700 border-slate-200', link: 'text-slate-700' },
  cyan: { tile: 'from-cyan-500 to-blue-700', shadow: 'shadow-cyan-100', border: 'hover:border-cyan-300', chip: 'bg-cyan-50 text-cyan-700 border-cyan-100', link: 'text-cyan-700' },
  orange: { tile: 'from-orange-500 to-amber-700', shadow: 'shadow-orange-100', border: 'hover:border-orange-300', chip: 'bg-orange-50 text-orange-700 border-orange-100', link: 'text-orange-700' },
  red: { tile: 'from-red-600 to-red-900', shadow: 'shadow-red-100', border: 'hover:border-red-300', chip: 'bg-red-50 text-red-700 border-red-100', link: 'text-red-700' },
};

function ModuleCard({ m, onOpen, big }) {
  const Ic = ICONS[m.icon] || LayoutGrid;
  const t = TONE[m.tone] || TONE.indigo;
  // Phân hệ chạy ở địa chỉ riêng → thẻ là liên kết thật (mở tab mới, chuột giữa/chuột phải dùng được).
  const ext = isExternal(m);
  const Tag = ext ? 'a' : 'button';
  const act = ext
    ? { href: m.target.url, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick: () => onOpen(m) };
  return (
    <Tag {...act}
      className={`group text-left w-full h-full bg-white rounded-2xl border border-slate-200 ${t.border} p-5 shadow-sm hover:shadow-xl ${t.shadow} transition-all duration-200 hover:-translate-y-0.5 flex flex-col`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${t.tile} text-white flex items-center justify-center shadow-lg ${t.shadow} group-hover:scale-105 transition-transform`}>
          <Ic className={big ? 'w-7 h-7' : 'w-6 h-6'} />
        </span>
        {m.badge && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{m.badge}</span>}
      </div>
      <h3 className={`mt-4 font-extrabold text-slate-800 leading-snug ${big ? 'text-[17px]' : 'text-[15px]'}`}>{m.title}</h3>
      <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed flex-1">{m.desc}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.tags.map((tag) => <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.chip}`}>{tag}</span>)}
      </div>
      <span className={`mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold ${t.link}`}>
        Mở phân hệ
        {ext
          ? <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </span>
    </Tag>
  );
}

export default function Portal({ onOpen }) {
  const [cfg, setCfg] = useState(readVersionCfg);
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchVersionCfg().then((c) => { if (alive) setCfg(c); });
    countVisit().then((n) => { if (alive && n != null) setVisits(n); });
    return () => { alive = false; };
  }, []);

  // Phân hệ "Phòng thử nghiệm" chỉ hiện khi còn ít nhất một bộ tiêu chí chưa bị ẩn.
  const hidden = cfg.hidden || [];
  const visible = MODULES.filter((m) => {
    if (m.id === 'lab') {
      const left = (m.labVersions || []).filter((v) => !hidden.includes(v));
      return left.length > 0;
    }
    if (m.target.kind === 'app' && hidden.includes(m.target.version)) return false;
    return true;
  }).map((m) => {
    if (m.id !== 'lab') return m;
    const left = (m.labVersions || []).filter((v) => !hidden.includes(v));
    return { ...m, target: { ...m.target, version: left.includes(m.target.version) ? m.target.version : left[0] } };
  });
  const main = visible.filter((m) => m.group === 'main');
  const tools = visible.filter((m) => m.group === 'tool');

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ===== Thanh điều hướng ===== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 truncate">Hệ thống phần mềm nghiệp vụ</p>
              <p className="text-[13px] sm:text-[15px] font-extrabold text-slate-800 leading-tight truncate">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#phanhe" className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"><LayoutGrid className="w-4 h-4" /> Phân hệ</a>
            <button onClick={() => onOpen(MODULES.find((m) => m.id === 'guide'))} className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"><BookOpen className="w-4 h-4" /> Hướng dẫn</button>
            <button onClick={() => onOpen(MODULES.find((m) => m.id === 'okr'), { login: true })} title="Đăng nhập tài khoản cán bộ, công chức / quản trị" className="flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow-sm">
              <LogIn className="w-4 h-4" /> Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* ===== Phân hệ nghiệp vụ ===== */}
      <main id="phanhe" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-700">Phân hệ nghiệp vụ</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3" /> Bản demo thử nghiệm
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1.5">Chọn phân hệ để bắt đầu</h2>
            <p className="text-[13px] text-slate-500 mt-1 max-w-2xl">Nền tảng dùng chung của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa. Bấm vào biểu tượng của phân hệ tương ứng với công việc cần thực hiện.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {main.map((m) => <ModuleCard key={m.id} m={m} onOpen={onOpen} big />)}
        </div>

        <div className="mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Công cụ & tiện ích</p>
          <div className="grid md:grid-cols-3 gap-5 mt-4">
            {tools.map((m) => <ModuleCard key={m.id} m={m} onOpen={onOpen} />)}
          </div>
        </div>

        {/* ===== Liên hệ ===== */}
        <section className="mt-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-extrabold">Cần hỗ trợ sử dụng hệ thống?</h2>
            <p className="text-[13px] text-slate-300 mt-1">Xem <b>Hướng dẫn &amp; hỗ trợ sử dụng</b> (có cơ sở pháp lý, cách tính điểm, hỏi đáp) hoặc liên hệ đồng chí Hà Ngọc Sơn, Phó Chánh Văn phòng.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onOpen(MODULES.find((m) => m.id === 'guide'))} className="flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20"><BookOpen className="w-4 h-4" /> Hướng dẫn sử dụng</button>
            <a href="tel:0904818886" className="flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20"><Phone className="w-4 h-4" /> 0904 818 886</a>
            <a href="mailto:sonthkh@gmail.com" className="flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100"><Mail className="w-4 h-4" /> sonthkh@gmail.com</a>
          </div>
        </section>
      </main>

      {/* ===== Chân trang ===== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center space-y-1.5">
          <p className="text-[12px] font-semibold text-amber-600">⚠ Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
          <p className="text-[12px] text-slate-500">© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
          {visits != null && (
            <p className="text-[12px] text-slate-400 inline-flex items-center gap-1.5 justify-center">
              <Eye className="w-3.5 h-3.5" /> Lượt truy cập: <span className="font-semibold text-slate-500">{visits.toLocaleString('vi-VN')}</span>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
