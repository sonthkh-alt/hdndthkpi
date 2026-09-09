# Bản tin pháp luật hằng ngày — nơi đặt ảnh

Trang chủ (`https://hdndthkpi.vercel.app/`) hiển thị ảnh bản tin ngay phía trên lưới phân hệ.
Ảnh do **tác vụ định kỳ `ban-tin-phap-luat-hang-ngay` của Claude** sinh ra rồi đẩy thẳng vào
thư mục này. Đẩy xong Vercel tự triển khai lại (1-2 phút) là Trang chủ có ảnh mới —
không cần máy chủ, không cần cơ sở dữ liệu, không phải sửa mã nguồn.

**Chưa có ảnh thì khối bản tin tự ẩn hẳn** khỏi Trang chủ (không hiện khung ảnh vỡ).

## Ba tệp — đúng tên, ghi đè mỗi ngày

| Tệp | Bắt buộc | Nội dung |
|---|---|---|
| `moi-nhat.png` | **Có** | Ảnh gốc khổ lớn 3508×2480 |
| `moi-nhat.jpg` | Nên có | Ảnh xem trước nhẹ (~1404×992) — chính là `prev_full.jpg` mà script đã tạo sẵn |
| `moi-nhat.json` | Tùy chọn | Ngày, tiêu đề và danh sách tin dạng CHỮ |

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

## Cấu hình cho `push_to_github.py`

Điền vào `outputs/github-config.json` của tác vụ định kỳ:

| Thông tin | Giá trị |
|---|---|
| Chủ kho | `sonthkh-alt` |
| Tên kho | `hdndthkpi` |
| Nhánh | `main` |
| Đường dẫn ảnh gốc | `public/bantin/moi-nhat.png` |
| Đường dẫn ảnh nhẹ | `public/bantin/moi-nhat.jpg` |
| Đường dẫn chú thích | `public/bantin/moi-nhat.json` |

Thông điệp commit gợi ý: `bantin: bản tin pháp luật ngày DD/MM/YYYY`.

⚠️ **Kho này CÔNG KHAI.** Chỉ đẩy ảnh bản tin và chú thích. Không đẩy token, không đẩy
tệp cấu hình có khóa bí mật.

## Muốn lưu trữ các bản tin cũ

Đẩy thêm một bản sao theo ngày vào `public/bantin/luu-tru/ban-tin-phap-luat-DD-MM-YYYY.png`.
Trang chủ chỉ đọc `moi-nhat.*` nên thư mục lưu trữ không ảnh hưởng gì tới hiển thị.

## Kiểm tra nhanh sau khi đẩy

1. Mở `https://hdndthkpi.vercel.app/bantin/moi-nhat.png` — phải ra ảnh, không phải trang 404.
2. Mở Trang chủ — khối bản tin nằm ngay trên mục "Chọn phân hệ để bắt đầu".
3. Tên tệp cố định nên trình duyệt hay giữ bản cũ; Trang chủ đã tự gắn mốc ngày để mỗi
   ngày tải lại đúng một lần. Muốn thấy ngay thì tải lại trang bỏ qua bộ nhớ đệm
   (Ctrl + Shift + R).
