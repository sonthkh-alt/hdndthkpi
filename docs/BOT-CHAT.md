# Trợ lý chat (Telegram / Zalo) — lấy thông tin từ hệ thống để trả lời

Bot nhận câu hỏi trong khung chat, tự đọc số liệu thật trong cơ sở dữ liệu của hệ thống,
rồi nhờ AI diễn đạt thành câu trả lời. Ngoài số liệu cơ quan, bot trả lời được cả
câu hỏi thông thường khác (soạn thảo, tra cứu, dịch thuật…).

```
Người hỏi ──▶ Telegram ──▶ /api/telegram (Vercel) ──▶ Supabase (số liệu thật)
                                     │
                                     └─────────────▶ AI (Claude / Gemini / OpenAI)
```

---

## 1. Cài đặt Telegram (khoảng 10 phút)

### Bước 1 — Tạo bot
1. Mở Telegram, tìm **@BotFather**, gõ `/newbot`.
2. Đặt tên hiển thị (ví dụ *Trợ lý HĐND Thanh Hóa*) và tên người dùng kết thúc bằng `bot`.
3. BotFather trả về **token** dạng `1234567890:AAH...`. Giữ kín token này.

### Bước 2 — Lấy ID Telegram của những người được dùng
Tìm **@userinfobot** trong Telegram, bấm Start, nó hiện dãy số ID. Làm tương tự với
từng người cần cấp quyền.

### Bước 3 — Lấy khóa API của AI (chọn MỘT)
| Nhà cung cấp | Lấy khóa ở đâu | Ghi chú |
|---|---|---|
| Anthropic (Claude) | console.anthropic.com → API Keys | Trả lời tiếng Việt tốt nhất, tính phí theo lượt |
| Google (Gemini) | aistudio.google.com → Get API key | Có mức dùng miễn phí |
| OpenAI | platform.openai.com → API keys | Tính phí theo lượt |

### Bước 4 — Khai biến môi trường trên Vercel
Vercel → dự án `hdndthkpi` → **Settings → Environment Variables**, thêm:

| Tên biến | Giá trị | Bắt buộc |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | token của BotFather | ✅ |
| `TELEGRAM_ALLOWED_IDS` | ID được phép hỏi, nhiều người cách nhau dấu phẩy | ✅ |
| `TELEGRAM_ADMIN_IDS` | ID được xem thêm số liệu nhân sự (bỏ trống = lấy ID đầu tiên ở trên) | nên có |
| `TELEGRAM_WEBHOOK_SECRET` | chuỗi bí mật tự đặt, ví dụ `hdnd-2026-abc123` | nên có |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → **API Keys** → *Secret keys* (chuỗi `sb_secret_...`). Bản cũ: tab *Legacy API keys* → **service_role**. Muốn dùng đúng tên Supabase gợi ý thì đặt `SUPABASE_SECRET_KEY`, bot nhận cả hai | ✅ |
| `ANTHROPIC_API_KEY` *(hoặc `GEMINI_API_KEY` / `OPENAI_API_KEY`)* | khóa AI | ✅ |

> ⚠️ **Không** đặt tiền tố `VITE_` cho các biến này. Biến có `VITE_` sẽ bị nhúng vào mã
> tải về trình duyệt, ai xem mã nguồn trang web cũng đọc được.
> Riêng `SUPABASE_SERVICE_ROLE_KEY` bỏ qua toàn bộ phân quyền RLS — tuyệt đối không chia sẻ.

Khai xong bấm **Redeploy** để bản mới nhận biến.

### Bước 5 — Đăng ký webhook
Mở trình duyệt tới địa chỉ (thay `<secret>` bằng `TELEGRAM_WEBHOOK_SECRET` đã đặt):

```
https://hdndthkpi.vercel.app/api/telegram?setup=<secret>
```

Thấy `{"ok":true,...}` là xong. Vào Telegram nhắn cho bot chữ `/help` để thử.

### Kiểm tra khi có trục trặc
- `https://hdndthkpi.vercel.app/api/telegram` — xem bot đã nối webhook chưa, có lỗi gì không.
- Nhắn `/trangthai` cho bot — xem đã nối được cơ sở dữ liệu và AI chưa.
- Nhắn `/solieu` — đọc thẳng số liệu, không qua AI (dùng để phân biệt lỗi dữ liệu hay lỗi AI).

---

## 2. Dùng thế nào

Hỏi bằng tiếng Việt bình thường:

- *"Điểm tháng này của đồng chí Hà Ngọc Sơn bao nhiêu?"*
- *"Phòng nào có điểm trung bình cao nhất?"*
- *"Còn ai chưa được phê duyệt?"*
- *"Phường Hạc Thành xếp loại gì, vì sao chưa đạt Xuất sắc?"*
- *"Muốn xếp loại Xuất sắc cần điều kiện gì?"*
- *"Soạn giúp tôi đoạn thông báo nhắc các phòng hoàn thành chấm điểm trước 15/12."*

Lệnh nhanh: `/help` · `/solieu` · `/quen` (xóa ngữ cảnh) · `/trangthai`.

Bot nhớ 10 lượt gần nhất của mỗi cuộc trò chuyện (quên sau 2 ngày im lặng) nên hỏi
nối tiếp được: *"còn đồng chí đó thì sao?"*.

---

## 3. Bot lấy số liệu ở đâu

| Nguồn | Nội dung bot đọc được |
|---|---|
| `state_<năm>_<tháng>` | Bảng điểm kỳ đánh giá cán bộ: họ tên, chức vụ, phòng, điểm tự đánh giá, điểm cấp duyệt, xếp loại, đã phê duyệt hay chưa |
| `tc_data` | Tiêu chí HĐND: từng đơn vị, tổng điểm, điểm 7 nhóm, thưởng/trừ, xếp loại (đã áp trần 25%), tiến độ khai báo, trạng thái |
| `hr_data` | Nhắc việc nhân sự dạng tổng hợp — **chỉ trả lời cho ID trong `TELEGRAM_ADMIN_IDS`** |

Điểm của phân hệ đánh giá cán bộ được phần mềm ghi sẵn vào khóa `_summary` mỗi lần lưu,
nên bot đọc đúng con số mà giao diện hiển thị. Với dữ liệu lưu **trước khi** có tính năng
này, bot sẽ nhắc mở phần mềm bấm **Lưu ngay** một lần để cập nhật.

Điểm tiêu chí HĐND thì bot tính lại tại chỗ bằng chính `src/lib/khungTieuChi.js` của
giao diện nên không bao giờ lệch.

---

## 4. Những gì bot KHÔNG làm

- Không đọc mật khẩu quản trị, mã truy cập của đơn vị, số căn cước, số bảo hiểm xã hội,
  quan hệ gia đình trong hồ sơ 2C — các trường này không được đưa vào ngữ cảnh của AI.
- Không trả lời người ngoài danh sách `TELEGRAM_ALLOWED_IDS`.
- Không ghi, không sửa dữ liệu — bot chỉ đọc.
- Không thay phần mềm: đây là bản demo, số liệu cần đối chiếu lại trên web trước khi
  dùng vào việc chính thức.

---

## 5. Còn Zalo thì sao?

Zalo **không** cho lập bot trên tài khoản cá nhân. Muốn có trợ lý tự trả lời trên Zalo
thì cơ quan phải:

1. Lập **Zalo Official Account** tại `oa.zalo.me` (loại cơ quan nhà nước cần hồ sơ xác thực).
2. Tạo ứng dụng tại `developers.zalo.me`, gắn OA vào ứng dụng để xin quyền gọi API.
3. Khai webhook trỏ về `/api/zalo` (chưa viết — phần "bộ não" `api/_lib/brain.js` đã dùng
   chung nên thêm vào chỉ mất ít công).

Ràng buộc của Zalo cần biết trước: OA chỉ được nhắn trả lời trong một khoảng thời gian
nhất định sau khi người dân nhắn tới, ngoài khung đó phải dùng ZNS (có phí); mã truy cập
API hạn ngắn, phải tự làm mới bằng refresh token. Chính sách Zalo thay đổi theo thời kỳ
nên cần đọc lại tài liệu lúc đăng ký.

**Trong khi chờ lập OA**, cách dùng trên Zalo là dán đường dẫn công khai
(`https://hdndthkpi.vercel.app/#/tieuchi`, `/#/okr`, `/#/hotro` — khách xem được, không cần
đăng nhập), hoặc hỏi bot Telegram rồi chép câu trả lời sang Zalo.

---

## 6. Chi phí

Vercel và Telegram: miễn phí ở quy mô này. Chi phí chỉ nằm ở khóa AI, tính theo số lượt hỏi —
mỗi câu hỏi tốn khoảng vài nghìn đến vài chục nghìn token tùy lượng số liệu phải nạp.
Muốn rẻ hơn thì đặt `AI_MODEL` sang mô hình nhỏ (ví dụ `claude-haiku-4-5-20251001`
hoặc `gemini-2.5-flash`), hoặc dùng lệnh `/solieu` — lệnh này đọc thẳng cơ sở dữ liệu,
không gọi AI nên không mất phí.
