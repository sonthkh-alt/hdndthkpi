import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
