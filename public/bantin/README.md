# public/bantin — bản dự phòng của trang Tin tức Thanh Hóa

Thư mục này chỉ còn **một tệp**: `tin.json`.

Trang chủ và trang `#/tintuc` lấy tin **trực tiếp** qua `GET /api/tintuc` (máy chủ đọc RSS của
Báo và Phát thanh, Truyền hình Thanh Hóa, giữ đệm 10 phút). `tin.json` là **bản dự phòng**, chỉ
được dùng khi máy chủ không gọi được nguồn. Tệp do `tools/bantin/chay.mjs` ghi mỗi sáng trên máy
Văn phòng rồi tự đẩy lên GitHub.

```json
{
  "capNhat": "2026-11-12T00:30:00.000Z",
  "nguon": "Báo và Phát thanh, Truyền hình Thanh Hóa",
  "trangNguon": "https://baothanhhoa.vn/",
  "tin": [
    { "id": "…", "tieuDe": "…", "moTa": "…", "lienKet": "https://baothanhhoa.vn/…",
      "luc": "2026-11-12T07:01:00+07:00", "kenh": "thoi-su", "chuyenMuc": "Thời sự",
      "diem": 92, "hdnd": true }
  ]
}
```

- Chỉ có tiêu đề + đoạn tóm tắt tòa soạn phát qua RSS + liên kết về bài gốc. **Không chép toàn văn,
  không lưu ảnh của báo.**
- Trình duyệt đọc tệp qua `docTinTuc()` (danh sách trắng) nên trường lạ bị bỏ, liên kết ngoài
  `https://baothanhhoa.vn/` bị loại.
- Các tệp của bản tin ảnh cũ (`moi-nhat.png|jpg|json`, `muc-luc.json`, `luu-tru/`) đã gỡ ngày
  12/11/2026; còn trong lịch sử git.
