# Lệnh thường dùng & triển khai

```bash
npm install   # cài phụ thuộc (lần đầu trên máy mới)
npm run dev   # chạy thử local (Vite). LƯU Ý: hàm trong api/ KHÔNG chạy ở local, chỉ chạy trên Vercel
npm run build # build production — CHẠY TRƯỚC KHI COMMIT để chắc chắn không lỗi
npm run lint  # ESLint (nếu đã cài)
```

- **Triển khai = push lên `main`** → Vercel tự build & deploy (~1–2 phút).
- Luôn `npm run build` xanh trước khi commit.
