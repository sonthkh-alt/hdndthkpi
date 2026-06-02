import { useState } from 'react';
import { Award, Mail, LogIn, CheckCircle2, AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-amber-400 items-center justify-center shadow-lg ring-4 ring-amber-300/30 mb-3"><Award className="w-8 h-8 text-red-900" /></div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">Hệ thống đánh giá, xếp loại cán bộ, công chức</h1>
          <p className="text-sm text-slate-500 mt-1">{unit || 'Đăng nhập để tiếp tục'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h2 className="font-bold text-slate-800">Đã gửi liên kết đăng nhập</h2>
              <p className="text-sm text-slate-500 mt-2">Vui lòng mở email <b className="text-slate-700">{email}</b> và bấm vào liên kết để vào hệ thống. Có thể đóng trang này.</p>
              <button onClick={() => { setStatus('idle'); setEmail(''); }} className="mt-4 text-sm text-red-700 font-semibold hover:underline">Dùng email khác</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Email cơ quan</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 focus-within:border-red-400">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ten@coquan.gov.vn" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
                </div>
              </div>
              {status === 'error' && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {msg}</p>
              )}
              <button type="submit" disabled={status === 'sending'} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl">
                <LogIn className="w-4 h-4" /> {status === 'sending' ? 'Đang gửi...' : 'Gửi liên kết đăng nhập'}
              </button>
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">Hệ thống gửi một liên kết đăng nhập tới email của bạn (không cần mật khẩu). Chỉ tài khoản được cấp mới truy cập được dữ liệu.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
