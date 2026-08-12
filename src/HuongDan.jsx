import { useState } from 'react';
import {
  Home, BookOpen, Target, ShieldCheck, Landmark, Users, Scale, Printer, ChevronDown, ChevronRight,
  Phone, Mail, Send, CheckCircle2, AlertTriangle, KeyRound, CalendarDays, HelpCircle, ArrowRight, Info,
} from 'lucide-react';
import { MODULES, LEGAL_BASIS } from './lib/modules';
import { DEMO_PIN } from './lib/tieuChiSeed';
import { GUEST } from './lib/auth';

// ============================================================================
//  MODULE HƯỚNG DẪN & HỖ TRỢ SỬ DỤNG (cấp HỆ THỐNG) — #/hotro
//  Khác với tab "Hỗ trợ" bên trong từng phân hệ (đi sâu công thức của phân hệ đó),
//  trang này giới thiệu TOÀN BỘ hệ thống: có những phân hệ nào, ai dùng phân hệ nào,
//  đăng nhập thế nào, cách tính điểm tóm tắt, quy trình - mốc thời gian, cơ sở pháp lý,
//  câu hỏi thường gặp và kênh hỗ trợ.
// ============================================================================

const ICONS = { Target, ShieldCheck, Landmark, Users, BookOpen };

const SECTIONS = [
  { id: 'tongquan', label: '1. Hệ thống gồm những gì' },
  { id: 'batdau', label: '2. Bắt đầu nhanh theo vai trò' },
  { id: 'taikhoan', label: '3. Tài khoản & phân quyền' },
  { id: 'diem', label: '4. Cách tính điểm, xếp loại' },
  { id: 'quytrinh', label: '5. Quy trình & mốc thời gian' },
  { id: 'phaply', label: '6. Cơ sở pháp lý' },
  { id: 'faq', label: '7. Câu hỏi thường gặp' },
  { id: 'lienhe', label: '8. Liên hệ & góp ý' },
];

// Tóm tắt cách tính điểm của từng phân hệ (chi tiết xem trong tab Hỗ trợ của phân hệ).
const SCORING = [
  {
    name: 'Đánh giá OKR / KPI cán bộ, công chức', tone: 'emerald', route: 'okr',
    scale: 'Thang 100 điểm = Nhóm I (30đ) + Nhóm II (70đ) − Điểm trừ',
    rows: [
      ['Nhóm I — Tiêu chí chung (30đ)', 'Chấm theo từng tiêu chí của Mẫu tương ứng (chính trị tư tưởng, đạo đức - kỷ luật, năng lực, tự phê bình). Hai cột: Tự đánh giá và Cấp có thẩm quyền.'],
      ['Nhóm II — Kết quả nhiệm vụ (70đ)', 'Mỗi nhiệm vụ chấm 3 tiêu chí: ① Số lượng (hoàn thành/giao) · ② Chất lượng · ③ Tiến độ. Kết quả nhiệm vụ = (①+②+③)/3 → tự suy ra Mức độ hoàn thành.'],
      ['Xếp loại', 'HTXS ≥ 90 · HTT ≥ 70 · HT ≥ 50 · KHTNV < 50, kèm điều kiện Điều 8 (đủ số lượng, tỷ lệ vượt mức, kỷ luật) và trần HTXS ≤ 20% số HTT.'],
    ],
  },
  {
    name: 'Kiểm điểm, đánh giá, xếp loại đảng viên', tone: 'rose', route: 'kiemdiem',
    scale: 'Thang 100 điểm = Nhóm A (30đ) + Nhóm B (70đ), đánh giá hằng QUÝ',
    rows: [
      ['Nhóm A — Tiêu chí chung (30đ)', 'Chấm nhị phân theo từng mục: Đảm bảo = đủ điểm, Không đảm bảo = 0 điểm.'],
      ['Nhóm B — Kết quả 6 trục (70đ)', 'Mỗi trục: Điểm = KPI% × điểm tối đa của trục. KPI của trục là trung bình có trọng số các nhiệm vụ (Mức độ hoàn thành × Tầm quan trọng ×1 / ×1,5 / ×2).'],
      ['Xếp loại', '04 mức: HTXS ≥ 90 · HTT ≥ 80 · HT ≥ 65 · KHTNV, kèm điều kiện tại Điều 13 (tỷ lệ vượt mức, tỷ lệ không hoàn thành, kỷ luật) và trần HTXS ≤ 20% số HTT.'],
    ],
  },
  {
    name: 'Đánh giá tiêu chí HĐND tỉnh, xã, phường', tone: 'indigo', route: 'tieuchi',
    scale: 'Thang 110 điểm = 07 nhóm tiêu chí (100đ) + thưởng nhóm VIII (10đ) − trừ nhóm IX (20đ)',
    rows: [
      ['07 nhóm tiêu chí (100đ)', 'Chấm theo cột “Cách chấm điểm” của Khung tiêu chí: bấm chọn mức đạt được ở từng điểm thành phần; có mức làm mất điểm toàn tiêu chí.'],
      ['Nhóm VIII, IX', 'Nhóm VIII cộng tối đa 10đ (mô hình được nhân rộng, khen thưởng, giải pháp số hóa…); nhóm IX trừ tối đa 20đ kèm chế tài (không xếp loại Xuất sắc / không từ Tốt trở lên / hạ 01 mức).'],
      ['Xếp loại', '05 mức: Xuất sắc ≥ 90 · Tốt ≥ 80 · Khá ≥ 65 · Trung bình ≥ 50 · Yếu < 50, kèm điều kiện đổi mới sáng tạo; cấp xã áp trần 25% Xuất sắc.'],
    ],
  },
];

const TONE = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800',
};

const ROLES = [
  { who: 'Khách (chưa đăng nhập)', can: 'Xem toàn bộ số liệu mô phỏng, thử chấm điểm để xem cách tính. KHÔNG lưu được dữ liệu.', how: `Vào thẳng, hoặc dùng tài khoản dùng thử ${GUEST.email} / ${GUEST.password}.` },
  { who: 'Cán bộ, công chức', can: 'Tự đánh giá phần của mình (cột Tự ĐG), xem kết quả và phiếu của bản thân.', how: 'Đăng nhập bằng email cơ quan đã được Quản trị gán trong tab Đánh giá.' },
  { who: 'Trưởng phòng / Cấp có thẩm quyền', can: 'Rà soát, chấm cột Cấp duyệt cho cán bộ trong phòng, phê duyệt và xuất phiếu.', how: 'Đăng nhập bằng email đã được gán vai trò “Trưởng phòng”.' },
  { who: 'Quản trị (Văn phòng)', can: 'Toàn quyền: quản lý cán bộ, danh mục công việc, phân quyền, thẩm định - phê duyệt kết quả HĐND, quản lý tài khoản đơn vị.', how: 'Tài khoản do Văn phòng Đoàn ĐBQH và HĐND tỉnh cấp.' },
  { who: 'HĐND xã, phường / Ban, Tổ đại biểu', can: 'Tự đánh giá, tự chấm điểm theo Khung tiêu chí, đính kèm minh chứng và gửi kết quả.', how: `Đăng nhập tại phân hệ Tiêu chí HĐND bằng MÃ ĐƠN VỊ + MÃ TRUY CẬP do Văn phòng cấp (đơn vị mẫu dùng mã ${DEMO_PIN}).` },
];

const STEPS = [
  {
    role: 'Cán bộ, công chức tự đánh giá hằng tháng', tone: 'emerald', route: 'okr',
    steps: ['Mở phân hệ OKR/KPI → tab Đánh giá, chọn tên mình.', 'Nhóm I: soát từng tiêu chí, hạ điểm ở mục chưa đạt (mặc định điểm tối đa).', 'Nhóm II: thêm nhiệm vụ theo danh mục, nhập Số lượng hoàn thành, chọn Chất lượng và Tiến độ.', 'Ghi nhận xét, bấm Lưu ngay. Cấp có thẩm quyền rà lại ở cột Cấp duyệt rồi Phê duyệt & xuất phiếu.'],
  },
  {
    role: 'Thường trực, Tổ công tác đánh giá HĐND', tone: 'indigo', route: 'tieuchi',
    steps: ['Mở phân hệ Tiêu chí HĐND → đăng nhập bằng tài khoản Thường trực HĐND tỉnh / Tổ công tác.', 'Thẻ “Đơn vị & tài khoản”: thêm hoặc dán danh sách xã, phường; hệ thống tự sinh mã đơn vị và mã truy cập để gửi cho đơn vị.', 'Theo dõi tiến độ ở thẻ “Kết quả”; mở phiếu từng đơn vị để đối chiếu minh chứng và ghi kết quả thẩm định.', 'Bình xét: hệ thống tự áp trần 25% Xuất sắc; bấm Phê duyệt từng đơn vị hoặc phê duyệt hàng loạt, rồi xuất bảng tổng hợp (Excel).'],
  },
  {
    role: 'HĐND xã, phường tự đánh giá hằng năm', tone: 'indigo', route: 'tieuchi',
    steps: ['Mở phân hệ Tiêu chí HĐND → bấm Đăng nhập → nhập mã đơn vị và mã truy cập.', 'Đi lần lượt 07 nhóm tiêu chí, mỗi điểm thành phần bấm chọn đúng mức đạt được và ghi số, ký hiệu văn bản minh chứng.', 'Khai nhóm VIII (điểm thưởng) và nhóm IX (điểm trừ) nếu có phát sinh.', 'Kiểm tra khối tổng điểm bên phải (điểm, xếp loại, điều kiện chưa đạt) → bấm Lưu, sau đó Gửi kết quả trước ngày 25/12.'],
  },
];

const FAQ = [
  { q: 'Vào hệ thống có bắt buộc đăng nhập không?', a: 'Không. Mọi phân hệ đều mở sẵn ở chế độ xem thử với dữ liệu mô phỏng để tìm hiểu cách chấm điểm. Chỉ khi cần LƯU dữ liệu thật (chấm điểm chính thức, thẩm định, phê duyệt) mới cần đăng nhập.' },
  { q: 'Dữ liệu đang hiển thị có phải số liệu thật không?', a: 'Trong bản demo, các phân hệ hiển thị dữ liệu mô phỏng và luôn có nhãn cảnh báo. Riêng phân hệ Tiêu chí HĐND có nút gạt “Dữ liệu mẫu / Dữ liệu thật” trên thanh trên để chuyển qua lại; thao tác trên dữ liệu mẫu không ghi vào dữ liệu thật.' },
  { q: 'Đơn vị quên mã truy cập thì làm thế nào?', a: 'Mã truy cập chỉ lưu dưới dạng chuỗi băm, không xem lại được. Quản trị vào phân hệ Tiêu chí HĐND → thẻ “Đơn vị & tài khoản” → bấm “Cấp lại mã” và gửi mã mới cho đơn vị.' },
  { q: 'Vì sao điểm cao nhưng xếp loại vẫn bị hạ?', a: 'Vì ngoài tổng điểm còn có ĐIỀU KIỆN xếp loại: tỷ lệ hoàn thành, tỷ lệ vượt mức, kỷ luật, vi phạm, điều kiện đổi mới sáng tạo, trần tỷ lệ Xuất sắc. Phần mềm luôn hiển thị lý do hạ mức ngay dưới kết quả.' },
  { q: 'Vì sao đơn vị đủ 90 điểm mà vẫn chỉ được Tốt?', a: 'Cấp xã áp trần 25% số đơn vị được xếp loại Xuất sắc. Khi số đơn vị đủ điều kiện vượt tỷ lệ, hệ thống chọn từ tổng điểm cao xuống thấp; đơn vị không được chọn sẽ xem xét xếp loại Tốt (Điều 6 khoản 2).' },
  { q: 'Sửa điểm sau khi đã phê duyệt thì sao?', a: 'Mọi thay đổi ở trường chấm điểm sẽ TỰ ĐỘNG gỡ trạng thái phê duyệt, buộc cấp có thẩm quyền phê duyệt lại — bảo đảm kết quả đã duyệt luôn khớp với số liệu hiện hành.' },
  { q: 'Xuất báo cáo được những gì?', a: 'Phiếu đánh giá cá nhân (Word), bản kiểm điểm và bảng tổng hợp theo Phụ lục (Word), phiếu tự đánh giá của đơn vị HĐND (Word), bảng tổng hợp kết quả các đơn vị (Excel) và sổ tay hướng dẫn (PDF qua cửa sổ in).' },
  { q: 'Dữ liệu được lưu ở đâu, có an toàn không?', a: 'Dữ liệu lưu trên Supabase (PostgreSQL) có kiểm soát truy cập theo dòng. Hồ sơ cán bộ (Mẫu 2C) chỉ tài khoản Quản trị đọc/ghi được. Mã truy cập của đơn vị chỉ lưu chuỗi băm SHA-256. Đây vẫn là bản demo nội bộ, không dùng cho dữ liệu mật.' },
];

function Section({ id, title, icon: Ic, children, note }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><Ic className="w-5 h-5" /></span>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">{title}</h2>
      </div>
      {note && <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">{note}</p>}
      {children}
    </section>
  );
}

export default function HuongDan({ onHome, onOpenModule }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [fb, setFb] = useState('');
  const open = (route) => { if (onOpenModule) onOpenModule(route); };

  const sendFeedback = () => {
    const body = encodeURIComponent(`${fb}\n\n---\nGửi từ Hệ thống đánh giá, xếp loại — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa`);
    window.location.href = `mailto:sonthkh@gmail.com?subject=${encodeURIComponent('Góp ý Hệ thống đánh giá, xếp loại')}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onHome} title="Về trang chủ" className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center"><Home className="w-5 h-5" /></button>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-300">Hệ thống đánh giá, xếp loại</p>
              <h1 className="text-base sm:text-lg font-extrabold leading-tight">Hướng dẫn &amp; hỗ trợ sử dụng</h1>
            </div>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-white/10 border border-white/25 hover:bg-white/20"><Printer className="w-4 h-4" /> In / lưu PDF</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6 items-start">
        {/* Mục lục */}
        <nav className="hidden lg:block lg:sticky lg:top-4 rounded-2xl border border-slate-200 bg-white p-3 print:hidden">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Mục lục</p>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="block text-[13px] text-slate-600 hover:text-indigo-700 hover:bg-slate-50 rounded-lg px-2 py-1.5">{s.label}</a>
          ))}
        </nav>

        <div className="space-y-10 min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Trang này hướng dẫn sử dụng <b>toàn hệ thống</b>: có những phân hệ nào, ai dùng phân hệ nào, đăng nhập ra sao,
              điểm và xếp loại được tính thế nào. Hướng dẫn <b>chi tiết công thức của từng phân hệ</b> nằm ở tab <b>Hỗ trợ</b> ngay bên trong phân hệ đó.
            </p>
            <p className="mt-2 text-[12px] font-semibold text-amber-700 flex items-start gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
          </div>

          {/* 1. Tổng quan */}
          <Section id="tongquan" title="1. Hệ thống gồm những gì" icon={BookOpen}
            note="Trang chủ hiển thị các phân hệ dưới dạng thẻ có biểu tượng; bấm vào thẻ để mở phân hệ tương ứng. Mỗi phân hệ có đường dẫn riêng, có thể lưu hoặc gửi cho người khác.">
            <div className="grid sm:grid-cols-2 gap-3">
              {MODULES.filter((m) => m.id !== 'guide').map((m) => {
                const Ic = ICONS[m.icon] || BookOpen;
                return (
                  <button key={m.id} onClick={() => open(m.route)} className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Ic className="w-5 h-5" /></span>
                      <p className="text-[13px] font-bold text-slate-800 leading-snug">{m.title}</p>
                    </div>
                    <p className="text-[12px] text-slate-500 mt-2 leading-snug">{m.desc}</p>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">#/{m.route}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 2. Bắt đầu nhanh */}
          <Section id="batdau" title="2. Bắt đầu nhanh theo vai trò" icon={ArrowRight}
            note="Các bước tối thiểu để hoàn thành công việc thường gặp nhất của từng nhóm người dùng.">
            <div className="space-y-3">
              {STEPS.map((s) => (
                <div key={s.role} className={`rounded-2xl border p-4 ${TONE[s.tone]}`}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[13px] font-bold">{s.role}</p>
                    <button onClick={() => open(s.route)} className="text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-white/70 border border-white hover:bg-white">Mở phân hệ →</button>
                  </div>
                  <ol className="mt-2 space-y-1.5 list-decimal list-inside">
                    {s.steps.map((t, i) => <li key={i} className="text-[12px] text-slate-700 leading-snug">{t}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </Section>

          {/* 3. Tài khoản */}
          <Section id="taikhoan" title="3. Tài khoản & phân quyền" icon={KeyRound}
            note="Hệ thống dùng chung một tài khoản cho các phân hệ đánh giá cán bộ; riêng HĐND xã, phường đăng nhập bằng mã đơn vị do Văn phòng cấp.">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                    <tr><th className="text-left px-3 py-2 font-semibold">Nhóm người dùng</th><th className="text-left px-3 py-2 font-semibold">Làm được gì</th><th className="text-left px-3 py-2 font-semibold">Đăng nhập thế nào</th></tr>
                  </thead>
                  <tbody>
                    {ROLES.map((r) => (
                      <tr key={r.who} className="border-t border-slate-100 align-top">
                        <td className="px-3 py-2 font-semibold text-slate-800 text-[13px] whitespace-nowrap">{r.who}</td>
                        <td className="px-3 py-2 text-[12px] text-slate-600">{r.can}</td>
                        <td className="px-3 py-2 text-[12px] text-slate-500">{r.how}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-[12px] font-bold text-amber-800 flex items-center gap-1.5"><Info className="w-4 h-4" /> Tài khoản dùng thử của bản demo</p>
              <ul className="mt-1.5 space-y-1 text-[12px] text-amber-900">
                <li>• Xem thử toàn hệ thống: <b>{GUEST.email}</b> / <b>{GUEST.password}</b> (chỉ xem, không lưu).</li>
                <li>• Đơn vị HĐND mẫu: mã đơn vị dạng <b className="font-mono">X-…</b> hiển thị sẵn ở cổng đăng nhập, mã truy cập <b className="font-mono">{DEMO_PIN}</b>.</li>
                <li>• Tài khoản Quản trị: do Văn phòng Đoàn ĐBQH và HĐND tỉnh cấp, không công bố tại đây.</li>
              </ul>
            </div>
          </Section>

          {/* 4. Cách tính điểm */}
          <Section id="diem" title="4. Cách tính điểm, xếp loại" icon={Scale}
            note="Tóm tắt để nắm nguyên tắc chung. Công thức đầy đủ, ví dụ tính và danh mục công việc xem ở tab Hỗ trợ trong từng phân hệ.">
            <div className="space-y-3">
              {SCORING.map((s) => (
                <div key={s.name} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 flex-wrap ${TONE[s.tone]}`}>
                    <div>
                      <p className="text-[13px] font-bold">{s.name}</p>
                      <p className="text-[11px] opacity-80">{s.scale}</p>
                    </div>
                    <button onClick={() => open(s.route)} className="text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-white/70 border border-white hover:bg-white">Mở phân hệ →</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {s.rows.map(([k, v]) => (
                      <div key={k} className="px-4 py-2.5 grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-3">
                        <p className="text-[12px] font-semibold text-slate-700">{k}</p>
                        <p className="text-[12px] text-slate-600 leading-snug">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              <b>Nguyên tắc chung:</b> mọi tiêu chí, điểm thưởng, điểm trừ đều phải có hồ sơ minh chứng; tiêu chí không có minh chứng thì không được tính điểm.
              Cá nhân, đơn vị <b>tự đánh giá</b> — cấp có thẩm quyền <b>thẩm định và quyết định</b>. Phần mềm luôn hiển thị công khai công thức và lý do hạ mức xếp loại.
            </p>
          </Section>

          {/* 5. Quy trình */}
          <Section id="quytrinh" title="5. Quy trình & mốc thời gian" icon={CalendarDays}>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { t: 'OKR/KPI — hằng tháng', c: ['Ngày 20 hằng tháng: cán bộ hoàn thành tự đánh giá.', 'Ngày 22: trưởng phòng rà soát, chấm cột Cấp duyệt.', 'Ngày 25: Hội đồng xem xét, phê duyệt và xuất phiếu.', 'Riêng tháng 12 hoàn thành trước ngày 15/12.'] },
                { t: 'Kiểm điểm đảng viên — hằng quý', c: ['Cuối quý: cá nhân tự kiểm điểm, chấm Nhóm A và Nhóm B.', 'Cấp có thẩm quyền nhận xét, chấm điểm và xếp loại.', 'Xuất Bản tự đánh giá (Phụ lục 3A) và Bảng tổng hợp (Phụ lục 4).'] },
                { t: 'Tiêu chí HĐND — hằng năm', c: ['Trước ngày 25/12: đơn vị gửi kết quả tự đánh giá và hồ sơ minh chứng.', 'Tổ công tác thẩm định; các Ban tham gia ý kiến theo lĩnh vực.', 'Quý I năm liền kề: Thường trực HĐND tỉnh bình xét, công bố kết quả.'] },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[13px] font-bold text-slate-800">{b.t}</p>
                  <ul className="mt-2 space-y-1.5">
                    {b.c.map((x) => <li key={x} className="text-[12px] text-slate-600 leading-snug flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {x}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Cơ sở pháp lý */}
          <Section id="phaply" title="6. Cơ sở pháp lý" icon={Scale}
            note="Các văn bản làm căn cứ xây dựng bộ tiêu chí và công thức tính điểm trong hệ thống.">
            <div className="grid sm:grid-cols-2 gap-3">
              {LEGAL_BASIS.map((v) => (
                <div key={v.code} className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <p className="text-[13px] font-bold text-slate-800">{v.code}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{v.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 7. FAQ */}
          <Section id="faq" title="7. Câu hỏi thường gặp" icon={HelpCircle}>
            <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
              {FAQ.map((f, i) => (
                <div key={f.q}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-slate-50">
                    {openFaq === i ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                    <span className="text-[13px] font-semibold text-slate-800">{f.q}</span>
                  </button>
                  {openFaq === i && <p className="px-4 pb-3 pl-10 text-[12px] text-slate-600 leading-relaxed">{f.a}</p>}
                </div>
              ))}
            </div>
          </Section>

          {/* 8. Liên hệ */}
          <Section id="lienhe" title="8. Liên hệ & góp ý" icon={Phone}>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[13px] font-bold text-slate-800">Hỗ trợ sử dụng</p>
                <p className="text-[12px] text-slate-500 mt-1">Đồng chí <b>Hà Ngọc Sơn</b> — Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="tel:0904818886" className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"><Phone className="w-3.5 h-3.5" /> 0904 818 886</a>
                  <a href="mailto:sonthkh@gmail.com" className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"><Mail className="w-3.5 h-3.5" /> sonthkh@gmail.com</a>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[13px] font-bold text-slate-800">Gửi ý kiến góp ý</p>
                <textarea rows={3} value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Nội dung góp ý về tiêu chí, cách tính điểm hoặc giao diện…"
                  className="w-full mt-2 text-[13px] px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400" />
                <button onClick={sendFeedback} disabled={!fb.trim()} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40"><Send className="w-3.5 h-3.5" /> Gửi góp ý</button>
              </div>
            </div>
          </Section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 text-center text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-amber-600">⚠ Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
        <p>© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
      </footer>
    </div>
  );
}
