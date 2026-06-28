import { useState, useCallback } from 'react';
import App from './App.jsx';

// Điều phối PHIÊN BẢN đánh giá (chọn ở màn Đăng nhập hoặc đổi nhanh ở header).
//  • 'classic'  — Cổ điển: bộ tiêu chí theo QĐ 1053-QĐ/TU (giữ nguyên câu chữ pháp lý).
//  • 'sg'       — Singapore: cùng khung điểm 30/70 + Điều 8, câu hỏi viết lại theo AIM/ISE/WoG cho dễ hiểu.
// Lựa chọn lưu trong localStorage để không phải chọn lại mỗi lần tải trang.
const KEY = 'hdndkpi_version';
const readVersion = () => {
  try { const v = localStorage.getItem(KEY); return v === 'sg' ? 'sg' : 'classic'; } catch { return 'classic'; }
};

export default function Root() {
  const [version, setVersion] = useState(readVersion);
  const pickVersion = useCallback((v) => {
    const nv = v === 'sg' ? 'sg' : 'classic';
    setVersion(nv);
    try { localStorage.setItem(KEY, nv); } catch { /* bỏ qua nếu trình duyệt chặn localStorage */ }
  }, []);
  return <App version={version} onPickVersion={pickVersion} />;
}
