import { useState } from 'react';
import { Mail, LogIn, CheckCircle2, AlertTriangle } from 'lucide-react';
import { signInWithOtp } from './lib/auth';

export default function Login({ unit }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending'); setMsg('');
    const { error } = await signInWithOtp(email.trim());
    if (error) { setStatus('error'); setMsg(error.message || 'Không gửi được liên kết đăng nhập.'); }
    else { setStatus('sent'); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 text-white" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Nền tương lai: gradient đỏ sâu + lưới công nghệ + quầng sáng */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5c0f0f] via-[#a51c1c] to-[#7f1d1d]" />
      <div className="absolute inset-0 tech-grid opacity-60" />
      <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-rose-500/25 blur-3xl" />

      <div className="relative w-full max-w-md animate-fadeUp">
        <div className="text-center mb-6">
          <div className="inline-flex w-24 h-24 rounded-full bg-white/95 items-center justify-center shadow-2xl ring-2 ring-amber-300/60 emblem-glow animate-floatY p-2.5 mb-4">
            <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
          </div>
          <p className="text-amber-300 text-[11px] font-semibold tracking-[0.25em] uppercase">Hệ thống quản trị OKR / KPI</p>
          <h1 className="text-xl font-extrabold leading-tight aurora-text mt-1">Đánh giá, xếp loại cán bộ, công chức</h1>
          <p className="text-red-100/90 text-sm mt-1.5">{unit || 'Đăng nhập để tiếp tục'}</p>
        </div>

        <div className="glass rounded-2xl shadow-2xl border border-white/40 p-6 text-slate-800">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h2 className="font-bold text-slate-800">Đã gửi liên kết đăng nhập</h2>
              <p className="text-sm text-slate-600 mt-2">Vui lòng mở email <b className="text-slate-800">{email}</b> và bấm vào liên kết để vào hệ thống. Có thể đóng trang này.</p>
              <button onClick={() => { setStatus('idle'); setEmail(''); }} className="mt-4 text-sm text-red-700 font-semibold hover:underline">Dùng email khác</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Email cơ quan</label>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-200 transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ten@coquan.gov.vn" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
                </div>
              </div>
              {status === 'error' && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {msg}</p>
              )}
              <button type="submit" disabled={status === 'sending'} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-red-900/20 transition">
                <LogIn className="w-4 h-4" /> {status === 'sending' ? 'Đang gửi...' : 'Gửi liên kết đăng nhập'}
              </button>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">Hệ thống gửi một liên kết đăng nhập tới email của bạn (không cần mật khẩu). Chỉ tài khoản được cấp mới truy cập được dữ liệu.</p>
            </form>
          )}
        </div>
        <p className="text-center text-red-100/70 text-[11px] mt-5">© Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
      </div>
    </div>
  );
}
