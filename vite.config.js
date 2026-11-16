import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// Tiêu đề bảo mật DÙNG CHUNG với vercel.json (bản chạy thật) — `vite preview` gắn cùng bộ này để các
// phép kiểm đầu-cuối chạy dưới đúng CSP của bản thật (scratch/baomat-check.mjs đối chiếu hai nơi).
// Bỏ HSTS và upgrade-insecure-requests vì máy chạy thử là http://localhost.
const tieuDeBaoMat = Object.fromEntries(JSON.parse(readFileSync(new URL('./security-headers.json', import.meta.url), 'utf8'))
  .filter((h) => h.key !== 'Strict-Transport-Security')
  .map((h) => [h.key, h.key === 'Content-Security-Policy' ? h.value.replace(/;\s*upgrade-insecure-requests/, '') : h.value]));

export default defineConfig({
  plugins: [react()],
  preview: { headers: tieuDeBaoMat },
  build: {
    // Tách thư viện nền ra chunk riêng để cache tốt giữa các lần deploy
    // (recharts đã nằm trong chunk lazy DashboardCharts; xlsx/docx/html2pdf trong chunk lazy exporters).
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
