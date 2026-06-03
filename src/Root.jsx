import { useState } from 'react';
import App from './App.jsx';
import AppModern from './AppModern.jsx';

// Điều phối 2 phiên bản giao diện. MẶC ĐỊNH là phiên bản cổ điển;
// người dùng chọn sang phiên bản mới ngay ở bước đăng nhập (hoặc nút chuyển trong app).
export default function Root() {
  const [version, setVersion] = useState('classic');
  return version === 'modern'
    ? <AppModern version={version} onPickVersion={setVersion} />
    : <App version={version} onPickVersion={setVersion} />;
}
