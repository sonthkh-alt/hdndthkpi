import { useState } from 'react';
import App from './App.jsx';
import AppModern from './AppModern.jsx';
import AppPro from './AppPro.jsx';

// Điều phối các phiên bản giao diện. MẶC ĐỊNH là phiên bản cổ điển;
// người dùng chọn sang "giao diện mới" hoặc "bản Pro" ngay ở bước đăng nhập.
export default function Root() {
  const [version, setVersion] = useState('classic');
  if (version === 'pro') return <AppPro version={version} onPickVersion={setVersion} />;
  if (version === 'modern') return <AppModern version={version} onPickVersion={setVersion} />;
  return <App version={version} onPickVersion={setVersion} />;
}
