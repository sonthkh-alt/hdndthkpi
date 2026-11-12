# tools/bantin — ghi bản dự phòng tin tức Thanh Hóa

```
node tools/bantin/chay.mjs          lấy tin → ghi public/bantin/tin.json → commit + push
node tools/bantin/chay.mjs --thu    như trên nhưng KHÔNG commit, KHÔNG push
```

- Cần **Node.js 18+** (có sẵn `fetch`). Không khóa API, không token, không gọi AI; đẩy bằng `git`
  đã đăng nhập của máy.
- Quy tắc chọn tin nằm ở **`src/lib/tinTuc.js`** — dùng chung với máy chủ (`api/tintuc.js`), sửa
  một chỗ là cả hai đổi theo: chỉ giữ tin trong tỉnh Thanh Hóa, chấm điểm tin về HĐND tỉnh / Đoàn
  ĐBQH tỉnh, giữ 10 ngày, tối đa 60 tin.
- Bản dự phòng **tích lũy**: tin mới gộp với tin của các lượt trước.
- Không đọc được kênh nào → dừng, **không ghi đè** bản cũ. Nội dung không đổi → không commit rỗng.
- Chỉ commit đúng `public/bantin/tin.json`, không đụng thay đổi khác đang dở trong kho.
- Nhật ký: `tools/bantin/nhat-ky.log` (không vào git).

## Tác vụ theo lịch

Tác vụ Windows **`BanTinPhapLuat`** (07:30 hằng ngày) vẫn gọi `pythonw.exe tools/bantin/chay.py`.
`chay.py` nay chỉ là cầu nối gọi `node chay.mjs`, nên **không phải sửa tác vụ** — nhưng máy phải
có lệnh `node` trong PATH của tài khoản chạy tác vụ. Thiếu thì nhật ký ghi
`LOI: khong tim thay lenh node`.

```powershell
Start-ScheduledTask -TaskName BanTinPhapLuat          # chạy ngay
(Get-ScheduledTaskInfo -TaskName BanTinPhapLuat).LastTaskResult   # 0 = xong
```

Bộ sinh ảnh cũ (`tin.py`, `poster.py`, `kiem_thu.py`, `da-dua-tin.json`) đã gỡ ngày 12/11/2026.
