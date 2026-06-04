import { useState } from 'react';
import { Mail, LogIn, CheckCircle2, AlertTriangle, Lock, KeyRound, Eye } from 'lucide-react';
import { signInWithOtp, signInWithPassword, GUEST, isGuestCredential } from './lib/auth';

// Theme màn đăng nhập đổi theo phiên bản đang chọn (đồng bộ style với app sau khi vào).
const THEMES = {
  classic: {
    bg: 'bg-gradient-to-br from-[#5c0f0f] via-[#a51c1c] to-[#7f1d1d]', gridCls: 'tech-grid',
    blob1: 'bg-amber-400/20', blob2: 'bg-rose-500/25',
    eyebrow: 'text-amber-300', title: 'aurora-text', unit: 'text-red-100/90',
    badge: 'bg-amber-400 text-red-900', ring: 'ring-amber-300/60',
    card: 'glass border border-white/40', emblem: 'bg-white/95',
    btn: 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 shadow-red-900/20',
    link: 'text-red-700 hover:text-red-800', accentIcon: 'text-red-700',
    inputFocus: 'focus-within:border-red-400 focus-within:ring-red-200',
    pickerWrap: 'bg-white/10 border-white/20', pickerInactive: 'text-red-100/80 hover:text-white',
    foot: 'text-red-100/70', footWarn: 'text-amber-200',
  },
  modern: {
    bg: 'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]', gridCls: 'tech-grid',
    blob1: 'bg-violet-500/25', blob2: 'bg-fuchsia-500/20',
    eyebrow: 'text-violet-300', title: 'text-white', unit: 'text-violet-100/80',
    badge: 'bg-violet-400 text-violet-950', ring: 'ring-violet-300/50',
    card: 'glass border border-white/40', emblem: 'bg-white/95',
    btn: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-900/30',
    link: 'text-violet-700 hover:text-violet-900', accentIcon: 'text-violet-600',
    inputFocus: 'focus-within:border-violet-400 focus-within:ring-violet-200',
    pickerWrap: 'bg-white/10 border-white/20', pickerInactive: 'text-violet-100/80 hover:text-white',
    foot: 'text-violet-200/70', footWarn: 'text-amber-300',
  },
  pro: {
    bg: 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white', gridCls: 'tech-grid-dark',
    blob1: 'bg-neutral-300/40', blob2: 'bg-neutral-400/20',
    eyebrow: 'text-neutral-500', title: 'text-neutral-900', unit: 'text-neutral-600',
    badge: 'bg-neutral-900 text-white', ring: 'ring-neutral-300',
    card: 'glass border border-neutral-200', emblem: 'bg-white ring-1 ring-neutral-200',
    btn: 'bg-neutral-900 hover:bg-neutral-800 shadow-neutral-900/20',
    link: 'text-neutral-900 hover:text-black', accentIcon: 'text-neutral-900',
    inputFocus: 'focus-within:border-neutral-500 focus-within:ring-neutral-200',
    pickerWrap: 'bg-neutral-900/5 border-neutral-300', pickerInactive: 'text-neutral-500 hover:text-neutral-900',
    foot: 'text-neutral-500', footWarn: 'text-amber-700',
  },
};

export default function Login({ unit, onGuest, version = 'classic', onPickVersion }) {
  const [mode, setMode] = useState('password'); // password | link
  const [email, setEmail] = useState(GUEST.email);
  const [password, setPassword] = useState(GUEST.password);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [msg, setMsg] = useState('');
  const t = THEMES[version] || THEMES.classic;

  const submitPassword = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    // Tài khoản khách (chỉ xem) -> vào thẳng phía client, không cần Supabase
    if (isGuestCredential(email, password)) { if (onGuest) onGuest(); return; }
    setStatus('sending'); setMsg('');
    const { error } = await signInWithPassword(email.trim(), password);
    if (error) {
      setStatus('error');
      setMsg(/invalid login/i.test(error.message || '')
        ? 'Email hoặc mật khẩu không đúng. Nếu là lần đầu, hãy nhận liên kết kích hoạt qua email.'
        : (error.message || 'Đăng nhập không thành công.'));
    }
    // Thành công: onAuthChange ở App sẽ tự chuyển trang.
  };

  const submitLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending'); setMsg('');
    const { error } = await signInWithOtp(email.trim());
    if (error) { setStatus('error'); setMsg(error.message || 'Không gửi được liên kết đăng nhập.'); }
    else { setStatus('sent'); }
  };

  const switchMode = (m) => { setMode(m); setStatus('idle'); setMsg(''); setPassword(''); };
  const inputWrap = `flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3 focus-within:ring-2 transition ${t.inputFocus}`;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className={`absolute inset-0 ${t.bg}`} />
      {t.gridCls && <div className={`absolute inset-0 ${t.gridCls} opacity-60`} />}
      <div className={`absolute -top-24 right-0 w-96 h-96 rounded-full ${t.blob1} blur-3xl`} />
      <div className={`absolute -bottom-32 -left-16 w-96 h-96 rounded-full ${t.blob2} blur-3xl`} />

      <div className="relative w-full max-w-md animate-fadeUp">
        <div className="text-center mb-6">
          <div className={`inline-flex w-24 h-24 rounded-full ${t.emblem} items-center justify-center shadow-2xl ring-2 ${t.ring} emblem-glow animate-floatY p-2.5 mb-4`}>
            <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
          </div>
          <p className={`text-[11px] font-semibold tracking-[0.25em] uppercase ${t.eyebrow}`}>Hệ thống quản trị OKR / KPI</p>
          <div className="mt-1.5"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${t.badge}`}>Bản demo thử nghiệm</span></div>
          <h1 className={`text-xl font-extrabold leading-tight mt-1.5 ${t.title}`}>Đánh giá, xếp loại cán bộ, công chức</h1>
          <p className={`text-sm mt-1.5 ${t.unit}`}>{unit || 'Đăng nhập để tiếp tục'}</p>
        </div>

        {onPickVersion && (
          <div className={`mb-4 border rounded-xl p-1.5 grid grid-cols-3 gap-1.5 ${t.pickerWrap}`}>
            <button type="button" onClick={() => onPickVersion('classic')} className={`py-2 rounded-lg text-[11px] font-semibold transition ${version === 'classic' ? 'bg-white text-red-800 shadow' : t.pickerInactive}`}>Cổ điển</button>
            <button type="button" onClick={() => onPickVersion('modern')} className={`py-2 rounded-lg text-[11px] font-semibold transition ${version === 'modern' ? 'bg-violet-400 text-violet-950 shadow' : t.pickerInactive}`}>Giao diện mới ✨</button>
            <button type="button" onClick={() => onPickVersion('pro')} className={`py-2 rounded-lg text-[11px] font-semibold transition ${version === 'pro' ? 'bg-neutral-900 text-white shadow' : t.pickerInactive}`}>Bản PRO 🏛️</button>
          </div>
        )}

        <div className={`rounded-2xl shadow-2xl p-6 text-slate-800 ${t.card}`}>
          {mode === 'link' && status === 'sent' ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h2 className="font-bold text-slate-800">Đã gửi liên kết kích hoạt</h2>
              <p className="text-sm text-slate-600 mt-2">Vui lòng mở email <b className="text-slate-800">{email}</b> và bấm vào liên kết. Sau khi vào, hệ thống sẽ yêu cầu <b>tạo mật khẩu</b> để dùng cho các lần đăng nhập sau.</p>
              <button onClick={() => switchMode('password')} className={`mt-4 text-sm font-semibold hover:underline ${t.link}`}>← Quay lại đăng nhập</button>
            </div>
          ) : mode === 'link' ? (
            <form onSubmit={submitLink} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-1"><KeyRound className={`w-4 h-4 ${t.accentIcon}`} /> Lần đầu đăng nhập / Quên mật khẩu</div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Email cơ quan</label>
                <div className={inputWrap}>
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ten@coquan.gov.vn" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
                </div>
              </div>
              {status === 'error' && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {msg}</p>
              )}
              <button type="submit" disabled={status === 'sending'} className={`w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl shadow-lg transition ${t.btn}`}>
                <Mail className="w-4 h-4" /> {status === 'sending' ? 'Đang gửi...' : 'Gửi liên kết qua email'}
              </button>
              <button type="button" onClick={() => switchMode('password')} className={`w-full text-center text-[13px] font-medium text-slate-600 ${t.link}`}>← Đăng nhập bằng mật khẩu</button>
            </form>
          ) : (
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Email cơ quan</label>
                <div className={inputWrap}>
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ten@coquan.gov.vn" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Mật khẩu</label>
                <div className={inputWrap}>
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
                </div>
              </div>
              {status === 'error' && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {msg}</p>
              )}
              <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3">
                <p className="text-[12px] font-bold text-amber-800 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Tài khoản khách (chỉ xem)</p>
                <p className="text-[12px] text-amber-800/90 mt-1">Email: <b>{GUEST.email}</b> · Mật khẩu: <b>{GUEST.password}</b></p>
                <button type="button" onClick={() => { setEmail(GUEST.email); setPassword(GUEST.password); if (onGuest) onGuest(); }} className="mt-2 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold py-2 rounded-lg transition">
                  <Eye className="w-3.5 h-3.5" /> Vào xem ngay (chỉ xem)
                </button>
              </div>
              <button type="submit" disabled={status === 'sending'} className={`w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl shadow-lg transition ${t.btn}`}>
                <LogIn className="w-4 h-4" /> {status === 'sending' ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              <button type="button" onClick={() => switchMode('link')} className={`w-full text-center text-[13px] font-medium text-slate-600 ${t.link}`}>Lần đầu đăng nhập / Quên mật khẩu?</button>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">Lần đầu, hãy bấm liên kết ở dòng trên để nhận email kích hoạt và tạo mật khẩu. Chỉ tài khoản được cấp mới truy cập được dữ liệu.</p>
            </form>
          )}
        </div>
        <p className={`text-center text-[11px] mt-5 font-semibold ${t.footWarn}`}>⚠ Bản demo thử nghiệm — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
        <p className={`text-center text-[11px] mt-1 font-semibold ${t.footWarn}`}>Phiên bản demo sử dụng nội bộ.</p>
        <p className={`text-center text-[11px] mt-2 ${t.foot}`}>© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
        <p className={`text-center text-[11px] mt-1 ${t.foot}`}>Chi tiết xin liên hệ đồng chí Hà Ngọc Sơn, Phó Chánh Văn phòng 0904818886</p>
      </div>
    </div>
  );
}
