import { useState, useCallback } from 'react';
import App from './App.jsx';

// Điều phối PHIÊN BẢN đánh giá (chọn ở màn Đăng nhập hoặc đổi nhanh ở header).
//  • 'classic'  — Cổ điển: bộ tiêu chí theo QĐ 1053-QĐ/TU (giữ nguyên câu chữ pháp lý).
//  • 'improved' — Cải tiến: cùng khung điểm 30/70 + Điều 8, câu hỏi viết lại theo AIM/ISE/WoG cho dễ hiểu;
//                 Nhóm II gom theo Mục tiêu + ô "Kết quả cần đạt".
//  • 'sg'       — Singapore (cơ quan dân cử): bộ tiêu chí thiết kế riêng cho HĐND/Đoàn ĐBQH.
//  • 'sonha'    — SonHa: bản gọn 3 module (Tổng quan · Đánh giá · Liên hệ & hướng dẫn), danh mục VP theo
//                 QĐ Danh mục/NĐ 335/2025; Đánh giá để sẵn mục liên kết "Quản lý văn bản" + Import file.
// Lựa chọn lưu trong localStorage để không phải chọn lại mỗi lần tải trang.
const KEY = 'hdndkpi_version';
const VALID = ['classic', 'improved', 'sg', 'sonha', 'kiemdiem'];
const DEFAULT_VERSION = 'sonha'; // mặc định vào trang là bản Sơn Hà
const readVersion = () => {
  try { const v = localStorage.getItem(KEY); return VALID.includes(v) ? v : DEFAULT_VERSION; } catch { return DEFAULT_VERSION; }
};

export default function Root() {
  const [version, setVersion] = useState(readVersion);
  const pickVersion = useCallback((v) => {
    const nv = VALID.includes(v) ? v : 'classic';
    setVersion(nv);
    try { localStorage.setItem(KEY, nv); } catch { /* bỏ qua nếu trình duyệt chặn localStorage */ }
  }, []);
  return <App version={version} onPickVersion={pickVersion} />;
}
