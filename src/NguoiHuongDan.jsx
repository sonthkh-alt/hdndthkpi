import { useEffect, useRef, useState } from 'react';
import { Headset, Send, MessageCircle, X, BookOpen } from 'lucide-react';
import { CHAO, GOI_Y, traLoi, CHAT_TELEGRAM, CHAT_ZALO } from './lib/huongDanBot';

// ============================================================================
//  NGƯỜI HƯỚNG DẪN — nút nổi ở góc Trang chủ, mở khung CHAT trả lời TỨC THÌ
//  ngay trong popup: bộ trả lời theo kịch bản chạy trong trình duyệt
//  (src/lib/huongDanBot.js) — không gọi AI, không gọi máy chủ, 0 token.
//  Câu khó / cần số liệu thật thì mời sang trợ lý AI (Zalo OA / Telegram).
// ============================================================================

export { CHAT_TELEGRAM, CHAT_ZALO };

const KHOA_MOI_CHAO = 'hdndkpi_hd_moi'; // mỗi phiên trình duyệt chỉ mời chào một lần

/** Một bong bóng tin nhắn trong khung chat. */
function BongBong({ tin }) {
  if (tin.vai === 'toi') {
    return <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-red-700 text-white px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-line">{tin.text}</div>;
  }
  return (
    <div className="self-start max-w-[88%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3 py-2 shadow-sm">
      <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line">{tin.text}</p>
      {tin.lienKet?.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {tin.lienKet.map((l) => (
            <a key={l.url} href={l.url}
              {...(l.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-[11px] font-bold px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
              {l.nhan} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NguoiHuongDan({ onGuide }) {
  const [mo, setMo] = useState(false);
  const [moiChao, setMoiChao] = useState(false);
  const [tinNhan, setTinNhan] = useState([{ vai: 'bot', ...CHAO }]);
  const [oNhap, setONhap] = useState('');
  const [dangGo, setDangGo] = useState(false);
  const khungRef = useRef(null);

  useEffect(() => {
    try { if (sessionStorage.getItem(KHOA_MOI_CHAO)) return; } catch { /* bỏ qua */ }
    const t = setTimeout(() => setMoiChao(true), 2200);
    return () => clearTimeout(t);
  }, []);
  const tatMoiChao = () => {
    setMoiChao(false);
    try { sessionStorage.setItem(KHOA_MOI_CHAO, '1'); } catch { /* bỏ qua */ }
  };

  // Tự cuộn xuống tin mới nhất.
  useEffect(() => {
    khungRef.current?.scrollTo({ top: khungRef.current.scrollHeight, behavior: 'smooth' });
  }, [tinNhan, dangGo]);

  // Trả lời NGAY TRONG TRÌNH DUYỆT — traLoi() là hàm thuần, không mạng, không AI.
  // setTimeout ngắn chỉ để nhịp hội thoại tự nhiên, không phải chờ máy chủ.
  const gui = (cau) => {
    const hoi = String(cau || '').trim();
    if (!hoi || dangGo) return;
    setTinNhan((t) => [...t, { vai: 'toi', text: hoi }]);
    setONhap('');
    setDangGo(true);
    setTimeout(() => {
      setTinNhan((t) => [...t, { vai: 'bot', ...traLoi(hoi) }]);
      setDangGo(false);
    }, 350);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* ===== Khung chat ===== */}
      {mo && (
        <div className="w-[min(22.5rem,calc(100vw-2.5rem))] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-red-700 to-red-900 text-white px-4 py-3 flex items-center gap-3">
            <span className="relative shrink-0 w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <Headset className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-red-800" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold leading-tight">Người hướng dẫn</p>
              <p className="text-[11px] text-red-100">Trả lời tức thì · miễn phí, không dùng AI</p>
            </div>
            <button onClick={() => setMo(false)} aria-label="Đóng" className="shrink-0 w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>

          {/* Dòng tin nhắn */}
          <div ref={khungRef} className="h-72 overflow-y-auto bg-slate-50 p-3 flex flex-col gap-2.5">
            {tinNhan.map((tin, i) => <BongBong key={i} tin={tin} />)}
            {dangGo && <div className="self-start rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3 py-2 text-[12.5px] text-slate-400 animate-pulse">Đang soạn…</div>}
          </div>

          {/* Gợi ý bấm nhanh */}
          <div className="px-3 pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
            {GOI_Y.map((c) => (
              <button key={c} type="button" onClick={() => gui(c)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                {c}
              </button>
            ))}
          </div>

          {/* Ô nhập */}
          <form className="p-3 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); gui(oNhap); }}>
            <input value={oNhap} onChange={(e) => setONhap(e.target.value)} placeholder="Gõ câu hỏi của quý vị…"
              className="flex-1 min-w-0 rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-200" />
            <button type="submit" aria-label="Gửi câu hỏi" disabled={!oNhap.trim() || dangGo}
              className="shrink-0 w-10 h-10 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Lối rẽ sang trợ lý AI thật + trang Hướng dẫn */}
          <div className="px-3 pb-3 flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <span className="text-slate-500">Cần số liệu thật, câu hỏi mở? Trợ lý AI:</span>
            <span className="flex items-center gap-1.5">
              <a href={CHAT_ZALO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold px-2 py-1 rounded-lg text-white" style={{ background: '#0068ff' }}><MessageCircle className="w-3.5 h-3.5" /> Zalo</a>
              <a href={CHAT_TELEGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold px-2 py-1 rounded-lg text-white" style={{ background: '#229ED9' }}><Send className="w-3.5 h-3.5" /> Telegram</a>
              <button onClick={() => { setMo(false); onGuide?.(); }} className="inline-flex items-center gap-1 font-bold px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><BookOpen className="w-3.5 h-3.5" /> Hướng dẫn</button>
            </span>
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
        aria-label={mo ? 'Đóng cửa sổ người hướng dẫn' : 'Mở cửa sổ người hướng dẫn — chat và được trả lời ngay tại chỗ'}
        title="Người hướng dẫn — chat và được trả lời ngay"
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white shadow-xl shadow-red-200 hover:scale-105 transition-transform flex items-center justify-center">
        {moiChao && !mo && <span className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />}
        {mo ? <X className="w-6 h-6" /> : <Headset className="w-6 h-6" />}
        {!mo && <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />}
      </button>
    </div>
  );
}
