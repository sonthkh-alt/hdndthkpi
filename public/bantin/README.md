# Bản tin pháp luật hằng ngày — nơi đặt ảnh

Trang chủ (`https://hdndthkpi.vercel.app/`) hiển thị ảnh bản tin ngay phía trên lưới phân hệ.
Ảnh do **bộ chạy tại chỗ `tools/bantin/`** sinh ra mỗi sáng 07:30 trên máy của Văn phòng
(tác vụ Windows `BanTinPhapLuat`): lấy tin từ RSS chính thống → vẽ ảnh bằng Pillow → ghi
vào thư mục này → `git push`. Vercel triển khai lại sau 1-2 phút là Trang chủ có ảnh mới.
**Không cần khóa API, không cần token, không gọi AI.** Cách chạy và cách sửa: xem
`tools/bantin/README.md`.

**Chưa có ảnh thì khối bản tin tự ẩn hẳn** khỏi Trang chủ (không hiện khung ảnh vỡ).

## Các tệp — đúng tên, ghi đè mỗi ngày

| Tệp | Bắt buộc | Nội dung |
|---|---|---|
| `public/bantin/moi-nhat.png` | **Có** | Ảnh gốc khổ lớn 3508×2480 |
| `public/bantin/moi-nhat.jpg` | Nên có | Ảnh xem trước nhẹ (~1404×992) |
| `public/bantin/moi-nhat.json` | Tùy chọn | Ngày, tiêu đề và danh sách tin dạng CHỮ |
| `public/bantin/muc-luc.json` | Tùy chọn | **Kho lưu trữ**: danh sách ngày đã có bản tin |
| `public/bantin/luu-tru/<ngày>.jpg` | Tùy chọn | Ảnh bản tin của ngày đó (`<ngày>` dạng `2026-09-10`) |
| `public/bantin/luu-tru/<ngày>.json` | Tùy chọn | Chú thích của ngày đó |

Kho mã là `sonthkh-alt/hdndthkpi`, nhánh `main`.

**Vì sao nên có `moi-nhat.jpg`:** ảnh gốc nặng vài MB. Bắt mọi người tải ngần ấy chỉ để
xem Trang chủ là quá đắt, nhất là khi mở bằng điện thoại. Có ảnh nhẹ thì Trang chủ dùng
ảnh nhẹ, bấm vào mới mở ảnh gốc để đọc kỹ.

**Vì sao nên có `moi-nhat.json`:** toàn bộ nội dung bản tin nằm trong ảnh. Người dùng
trình đọc màn hình, người tắt ảnh, và máy tìm kiếm đều không đọc được chữ trong ảnh —
danh sách tin dạng chữ là bản thay thế cho họ.

### Dạng của `moi-nhat.json`

```json
{
  "ngay": "2026-09-09",
  "tieuDe": "Bản tin pháp luật ngày 09/9/2026",
  "nguon": "baochinhphu.vn · baothanhhoa.vn",
  "tin": [
    { "tieuDe": "NĐ 339/2026/NĐ-CP — xử phạt VPHC lĩnh vực xây dựng, hiệu lực 26/8/2026", "nguon": "chinhphu.vn" },
    "Thanh Hóa: tái cấu trúc 22 thủ tục hành chính đất đai, giảm hơn 50% thời gian"
  ]
}
```

Mỗi phần tử trong `tin` viết dạng chuỗi hoặc `{tieuDe, nguon}` đều được; giữ tối đa 8 dòng.
Thiếu trường nào thì Trang chủ tự bỏ qua trường đó. Sai định dạng ngày thì chỉ mất cái
huy hiệu ngày, ảnh vẫn hiện bình thường.

## Muốn đổi nguồn tin, giờ chạy hay cách vẽ ảnh

Sửa trong `tools/bantin/` rồi chạy `python tools/bantin/kiem_thu.py` cho chắc. Đường dẫn
ba tệp ở trên là hợp đồng giữa bộ sinh ảnh và Trang chủ — đổi tên tệp thì phải đổi cả
`src/lib/banTin.js`.

⚠️ **Kho này CÔNG KHAI.** Chỉ đẩy ảnh bản tin và chú thích, không đẩy khóa bí mật.

## Kho lưu trữ và hộp chọn ngày

Có `muc-luc.json` với **từ 2 ngày trở lên** thì huy hiệu ngày trên Trang chủ biến thành
**hộp chọn ngày** — người xem chọn một ngày là hiện lại bản tin hôm đó. Chỉ có một ngày
thì vẫn là huy hiệu tĩnh (không tạo nút bấm mà bấm vào chẳng có gì).

```json
{ "capNhat": "2026-09-10T15:32:18+07:00", "ngay": ["2026-09-10", "2026-09-09"] }
```

Nhận cả dạng mảng trần `["2026-09-10", …]`. Ngày sai định dạng bị bỏ qua; mục lục hỏng
thì Trang chủ chỉ mất phần chọn ngày, bản tin mới nhất vẫn hiện bình thường.

**Kho chỉ giữ ảnh NHẸ, không giữ bản PNG khổ lớn.** Mỗi ngày một tệp 1 MB thì một năm
đã hơn 400 MB nằm trong kho mã. Ảnh nhẹ 1404×992 phóng to vẫn đọc được chữ trong thẻ tin.
Bộ sinh giữ **90 ngày gần nhất** (~21 MB) và tự dọn bản cũ hơn — sửa `SO_NGAY_LUU`
trong `tools/bantin/tin.py` nếu muốn khác.

## Kiểm tra nhanh sau khi đẩy

1. Mở `https://hdndthkpi.vercel.app/bantin/moi-nhat.png` — phải ra ảnh, không phải trang 404.
2. Mở Trang chủ — khối bản tin nằm ngay trên mục "Chọn phân hệ để bắt đầu".
3. Tên tệp cố định nên trình duyệt hay giữ bản cũ; Trang chủ đã tự gắn mốc ngày để mỗi
   ngày tải lại đúng một lần. Muốn thấy ngay thì tải lại trang bỏ qua bộ nhớ đệm
   (Ctrl + Shift + R).
