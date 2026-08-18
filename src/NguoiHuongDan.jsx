import { useEffect, useState } from 'react';
import { Headset, Send, MessageCircle, X, BookOpen } from 'lucide-react';

// ============================================================================
//  NGƯỜI HƯỚNG DẪN — nút nổi ở góc Trang chủ, mở popup mời chat với trợ lý AI
//  của Văn phòng qua Zalo OA hoặc Telegram (bot dùng chung "bộ não" với web).
//  Liên kết Zalo lấy theo mã số OA (xem GET /api/zalo, trường `oa.lienKet`).
// ============================================================================

export const CHAT_TELEGRAM = 'https://t.me/hdnd_thanhhoa_bot';
export const CHAT_ZALO = 'https://zalo.me/142053241153738721'; // OA "VP Đoàn ĐBQH và HĐND tỉnh Thanh Hóa"

const KHOA_MOI_CHAO = 'hdndkpi_hd_moi'; // mỗi phiên trình duyệt chỉ mời chào một lần

function KenhChat({ href, mau, icon: Ic, ten, phu }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all"
      style={{ background: mau }}>
      <span className="shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Ic className="w-5 h-5" /></span>
      <span className="min-w-0">
        <span className="block text-[13px] font-extrabold leading-tight">{ten}</span>
        <span className="block text-[11px] opacity-90 truncate">{phu}</span>
      </span>
    </a>
  );
}

export default function NguoiHuongDan({ onGuide }) {
  const [mo, setMo] = useState(false);
  const [moiChao, setMoiChao] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem(KHOA_MOI_CHAO)) return; } catch { /* bỏ qua */ }
    const t = setTimeout(() => setMoiChao(true), 2200);
    return () => clearTimeout(t);
  }, []);
  const tatMoiChao = () => {
    setMoiChao(false);
    try { sessionStorage.setItem(KHOA_MOI_CHAO, '1'); } catch { /* bỏ qua */ }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* ===== Popup hướng dẫn ===== */}
      {mo && (
        <div className="w-[min(21rem,calc(100vw-2.5rem))] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-red-700 to-red-900 text-white px-4 py-3.5 flex items-center gap-3">
            <span className="relative shrink-0 w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <Headset className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-red-800" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold leading-tight">Người hướng dẫn</p>
              <p className="text-[11px] text-red-100">Trợ lý AI của Văn phòng · trực tuyến 24/7</p>
            </div>
            <button onClick={() => setMo(false)} aria-label="Đóng" className="shrink-0 w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-[13px] text-slate-700 leading-relaxed">
              👋 Xin chào! Tôi có thể <b>hướng dẫn sử dụng</b> hệ thống và trả lời về
              số liệu đánh giá, kết quả biểu quyết, lịch công tác tuần…
              Mời quý vị chọn kênh chat quen dùng:
            </div>
            <div className="grid gap-2">
              <KenhChat href={CHAT_ZALO} mau="#0068ff" icon={MessageCircle} ten="Chat qua Zalo" phu="Official Account của Văn phòng" />
              <KenhChat href={CHAT_TELEGRAM} mau="#229ED9" icon={Send} ten="Chat qua Telegram" phu="@hdnd_thanhhoa_bot" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Lần đầu nhắn tin, quý vị gửi <b>/dangky Họ và tên - Đơn vị</b> để được
              Quản trị duyệt (chỉ cần một lần).
            </p>
            <button onClick={() => { setMo(false); onGuide?.(); }}
              className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
              <BookOpen className="w-4 h-4" /> Hoặc xem Hướng dẫn &amp; hỗ trợ sử dụng
            </button>
          </div>
        </div>
      )}

      {/* ===== Bong bóng mời chào ===== */}
      {!mo && moiChao && (
        <div className="flex items-center gap-1.5 rounded-2xl rounded-br-sm bg-white border border-slate-200 shadow-lg pl-3.5 pr-2 py-2">
          <button onClick={() => { setMo(true); tatMoiChao(); }} className="text-[12.5px] font-semibold text-slate-700 hover:text-slate-900 text-left">
            👋 Cần hướng dẫn? Chat với trợ lý!
          </button>
          <button onClick={tatMoiChao} aria-label="Ẩn lời mời" className="shrink-0 w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ===== Nút nổi ===== */}
      <button onClick={() => { setMo((v) => !v); tatMoiChao(); }}
        aria-label={mo ? 'Đóng cửa sổ người hướng dẫn' : 'Mở cửa sổ người hướng dẫn — chat với trợ lý qua Zalo hoặc Telegram'}
        title="Người hướng dẫn — chat với trợ lý"
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white shadow-xl shadow-red-200 hover:scale-105 transition-transform flex items-center justify-center">
        {moiChao && !mo && <span className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />}
        {mo ? <X className="w-6 h-6" /> : <Headset className="w-6 h-6" />}
        {!mo && <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />}
      </button>
    </div>
  );
}
