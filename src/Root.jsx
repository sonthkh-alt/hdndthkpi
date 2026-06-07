import { useState, lazy, Suspense } from 'react';
import App from './App.jsx'; // bản Cổ điển (mặc định) — giữ tải tĩnh để hiện ngay
const AppModern = lazy(() => import('./AppModern.jsx'));
const AppPro = lazy(() => import('./AppPro.jsx'));

// Điều phối các phiên bản giao diện. MẶC ĐỊNH là phiên bản cổ điển;
// người dùng chọn sang "giao diện mới" hoặc "bản Pro" ngay ở bước đăng nhập.
// Modern/Pro được tải động (lazy) → người dùng mặc định không phải tải mã 2 bản kia.
const loading = (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-400 text-sm">Đang tải giao diện…</div>
);
export default function Root() {
  const [version, setVersion] = useState('classic');
  if (version === 'pro') return <Suspense fallback={loading}><AppPro version={version} onPickVersion={setVersion} /></Suspense>;
  if (version === 'modern') return <Suspense fallback={loading}><AppModern version={version} onPickVersion={setVersion} /></Suspense>;
  return <App version={version} onPickVersion={setVersion} />;
}
