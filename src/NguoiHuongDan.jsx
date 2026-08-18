import { useEffect, useRef, useState } from 'react';
import { Headset, Send, MessageCircle, X, BookOpen, Sparkles } from 'lucide-react';
import { CHAO, GOI_Y, HET_LUOT_AI, NGOAI_KICH_BAN, traLoi, CHAT_TELEGRAM, CHAT_ZALO } from './lib/huongDanBot';

// ============================================================================
//  NGƯỜI HƯỚNG DẪN — nút nổi ở góc Trang chủ, mở khung chat hai tầng:
//   1) Câu CÓ SẴN: bộ kịch bản trong trình duyệt (huongDanBot.js) trả lời
//      tức thì — 0 token, không giới hạn.
//   2) Câu NGOÀI kịch bản: hỏi AI qua /api/huongdan — mỗi khách 3 lượt/ngày
//      (đếm ở máy chủ); hết lượt thì hiện hướng dẫn đăng ký bot Zalo/Telegram
//      để hỏi AI tiếp, còn khung này quay về chỉ trả lời câu có sẵn.
// ============================================================================

export { CHAT_TELEGRAM, CHAT_ZALO };

const KHOA_MOI_CHAO = 'hdndkpi_hd_moi'; // mỗi phiên trình duyệt chỉ mời chào một lần

/** Một bong bóng tin nhắn trong khung chat. */
function BongBong({ tin, onHoiAI }) {
  if (tin.vai === 'toi') {
    return <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-red-700 text-white px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-line">{tin.text}</div>;
  }
  return (
    <div className="self-start max-w-[88%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3 py-2 shadow-sm">
      {tin.loai === 'ai' && (
        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5 mb-1">
          <Sparkles className="w-2.5 h-2.5" /> Trả lời bằng AI
        </span>
      )}
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
      {/* Câu trả lời soạn sẵn kèm lối hỏi AI NGAY với đúng câu hỏi đó. */}
      {tin.goc && onHoiAI && (
        <button type="button" onClick={() => onHoiAI(tin.goc)}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:text-violet-900">
          <Sparkles className="w-3 h-3" /> Chưa đúng ý? Hỏi AI ngay
        </button>
      )}
    </div>
  );
}

export default function NguoiHuongDan({ onGuide }) {
  const [mo, setMo] = useState(false);
  const [moiChao, setMoiChao] = useState(false);
  const [tinNhan, setTinNhan] = useState([{ vai: 'bot', ...CHAO }]);
  const [oNhap, setONhap] = useState('');
  const [dangGo, setDangGo] = useState(''); // '' | 'kb' (kịch bản) | 'ai'
  const [hanMuc, setHanMuc] = useState(null); // {conLai, gioiHan} — lượt AI hôm nay
  const [cheDoAI, setCheDoAI] = useState(false); // bật = hỏi thẳng AI, bỏ qua câu có sẵn
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

  // Mở khung lần đầu thì hỏi máy chủ còn bao nhiêu lượt AI hôm nay.
  // Không hỏi được (chạy local, mất mạng) → coi như hết lượt, chỉ còn câu có sẵn.
  useEffect(() => {
    if (!mo || hanMuc !== null) return;
    fetch('/api/huongdan')
      .then((r) => r.json())
      .then((d) => setHanMuc(d?.hanMuc || { conLai: 0, gioiHan: 3 }))
      .catch(() => setHanMuc({ conLai: 0, gioiHan: 3 }));
  }, [mo, hanMuc]);

  // Tự cuộn xuống tin mới nhất.
  useEffect(() => {
    khungRef.current?.scrollTo({ top: khungRef.current.scrollHeight, behavior: 'smooth' });
  }, [tinNhan, dangGo]);

  const themBot = (tin) => setTinNhan((t) => [...t, { vai: 'bot', ...tin }]);

  // Hỏi AI qua /api/huongdan (tốn 1 trong 3 lượt/ngày). Hết lượt → hướng dẫn Zalo/Telegram.
  const guiAI = (hoi) => {
    if (!hanMuc || hanMuc.conLai <= 0) {
      setDangGo('kb');
      setTimeout(() => { themBot(HET_LUOT_AI); setDangGo(''); }, 350);
      return;
    }
    setDangGo('ai');
    // Vài lượt gần nhất (bỏ lời chào) để AI hiểu câu hỏi nối tiếp.
    const lichSu = tinNhan.slice(1).slice(-6).map((t) => ({ role: t.vai === 'toi' ? 'user' : 'assistant', text: t.text }));
    fetch('/api/huongdan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hoi, lichSu }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.hanMuc) setHanMuc(d.hanMuc);
        if (d?.ok) themBot({ loai: 'ai', text: d.traLoi, lienKet: [] });
        else if (d?.hetLuot) themBot(HET_LUOT_AI);
        else themBot({ text: `AI đang trục trặc: ${d?.error || 'không rõ nguyên nhân'}. Quý vị thử lại sau, hoặc hỏi qua Zalo/Telegram.`, lienKet: NGOAI_KICH_BAN.lienKet });
      })
      .catch(() => themBot(NGOAI_KICH_BAN))
      .finally(() => setDangGo(''));
  };

  // Bấm "Chưa đúng ý? Hỏi AI ngay" dưới một câu trả lời soạn sẵn:
  // câu hỏi đã nằm trên màn hình nên hỏi lại AI luôn, không lặp lại bong bóng.
  const hoiAI = (goc) => { if (!dangGo) guiAI(goc); };

  const gui = (cau) => {
    const hoi = String(cau || '').trim();
    if (!hoi || dangGo) return;
    setTinNhan((t) => [...t, { vai: 'toi', text: hoi }]);
    setONhap('');

    // TẦNG 1 — câu có sẵn: trả lời ngay trong trình duyệt, 0 token, không giới hạn.
    // Bật chế độ AI (nút gạt cạnh ô nhập) thì BỎ QUA kịch bản, hỏi thẳng AI.
    if (!cheDoAI) {
      const kb = traLoi(hoi);
      if (kb.id !== 'ngoai') {
        setDangGo('kb');
        setTimeout(() => { themBot({ ...kb, goc: hoi }); setDangGo(''); }, 350);
        return;
      }
    }

    // TẦNG 2 — hỏi AI.
    guiAI(hoi);
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
              <p className="text-[11px] text-red-100">
                {hanMuc ? <>Câu có sẵn: miễn phí · Hỏi AI: còn <b>{hanMuc.conLai}/{hanMuc.gioiHan}</b> lượt hôm nay</> : 'Trả lời tức thì · câu có sẵn miễn phí'}
              </p>
            </div>
            <button onClick={() => setMo(false)} aria-label="Đóng" className="shrink-0 w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>

          {/* Dòng tin nhắn */}
          <div ref={khungRef} className="h-72 overflow-y-auto bg-slate-50 p-3 flex flex-col gap-2.5">
            {tinNhan.map((tin, i) => <BongBong key={i} tin={tin} onHoiAI={hoiAI} />)}
            {dangGo && (
              <div className="self-start rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3 py-2 text-[12.5px] text-slate-400 animate-pulse">
                {dangGo === 'ai' ? 'Đang hỏi AI…' : 'Đang soạn…'}
              </div>
            )}
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
            <input value={oNhap} onChange={(e) => setONhap(e.target.value)}
              placeholder={cheDoAI ? 'Hỏi thẳng AI (tốn 1 lượt)…' : 'Gõ câu hỏi của quý vị…'}
              className={`flex-1 min-w-0 rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${cheDoAI ? 'border-violet-300 focus:ring-violet-200' : 'border-slate-300 focus:ring-red-200'}`} />
            {/* Nút gạt: bật = câu hỏi đi THẲNG tới AI, không qua kịch bản. */}
            <button type="button" onClick={() => setCheDoAI((v) => !v)} aria-pressed={cheDoAI}
              title={cheDoAI ? 'Đang hỏi thẳng AI (mỗi câu tốn 1 lượt) — bấm để tắt' : 'Bật để hỏi thẳng AI ngay, bỏ qua câu trả lời có sẵn'}
              className={`shrink-0 h-10 px-2.5 rounded-xl border text-[11px] font-extrabold inline-flex items-center gap-1 transition-colors ${cheDoAI ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
              <Sparkles className="w-3.5 h-3.5" /> AI
            </button>
            <button type="submit" aria-label="Gửi câu hỏi" disabled={!oNhap.trim() || !!dangGo}
              className="shrink-0 w-10 h-10 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Lối rẽ sang trợ lý AI thật + trang Hướng dẫn */}
          <div className="px-3 pb-3 flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <span className="text-slate-500">Cần số liệu thật, hỏi không giới hạn?</span>
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
