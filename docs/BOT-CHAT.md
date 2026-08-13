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
| Dịch vụ trung gian *tương thích OpenAI* | khóa mua ngoài, cổng nội bộ… | Xem mục 1c bên dưới |

### 1c. Dùng khóa của dịch vụ trung gian (tương thích OpenAI)

Nhiều nơi bán khóa dùng chung một giao thức với OpenAI, chỉ khác địa chỉ endpoint
(ví dụ `https://api.shopaikey.com/v1`). Khai 4 biến trên Vercel:

| Biến | Giá trị |
|---|---|
| `AI_PROVIDER` | `openai` |
| `AI_BASE_URL` | địa chỉ endpoint API của họ, ví dụ `https://api.shopaikey.com/v1` |
| `OPENAI_API_KEY` | khóa họ cấp |
| `AI_MODEL` | tên mô hình đúng theo bảng của họ, ví dụ `gpt-4o` hoặc `claude-sonnet-4` |

Mã sẽ gọi tới `<AI_BASE_URL>/chat/completions`. Nếu họ cho hai địa chỉ (*API* và *DIRECT*)
thì dùng địa chỉ **API**; khi nào bị chặn hoặc chậm mới đổi sang *DIRECT*.

Đổi xong bấm **Redeploy**, rồi nhắn `/trangthai` cho bot — dòng "Bộ não AI" sẽ hiện
đúng tên miền endpoint và mô hình đang dùng.

> ⚠️ **Cân nhắc trước khi dùng trung gian:** toàn bộ câu hỏi *và số liệu hệ thống nạp kèm*
> (họ tên, chức vụ, điểm, xếp loại cán bộ; lịch công tác của lãnh đạo) sẽ đi qua máy chủ
> của bên đó. Với khóa mua từ nhà cung cấp gốc (Anthropic/Google/OpenAI) thì dữ liệu chỉ
> qua nhà cung cấp đó. Nếu dữ liệu thật được đưa vào sử dụng chính thức, nên cân nhắc
> dùng khóa gốc hoặc hỏi rõ chính sách lưu trữ, ghi log của bên trung gian.

### Bước 4 — Khai biến môi trường trên Vercel
Vercel → dự án `hdndthkpi` → **Settings → Environment Variables**, thêm:

| Tên biến | Giá trị | Bắt buộc |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | token của BotFather | ✅ |
| `TELEGRAM_ADMIN_IDS` | ID của **Quản trị** — người duyệt yêu cầu và được xem số liệu nhân sự | ✅ |
| `TELEGRAM_ALLOWED_IDS` | ID được dùng ngay, không cần đăng ký (thường để trống) | tùy chọn |
| `BOT_DAILY_LIMIT` | số câu hỏi tối đa mỗi người mỗi ngày, mặc định `30` | tùy chọn |
| `TELEGRAM_OPEN` | đặt `0` nếu muốn đóng đăng ký, chỉ phục vụ danh sách trắng | tùy chọn |
| `TELEGRAM_WEBHOOK_SECRET` | chuỗi bí mật tự đặt, ví dụ `hdnd-2026-abc123` | nên có |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → **API Keys** → *Secret keys* (chuỗi `sb_secret_...`). Bản cũ: tab *Legacy API keys* → **service_role**. Muốn dùng đúng tên Supabase gợi ý thì đặt `SUPABASE_SECRET_KEY`, bot nhận cả hai | ✅ |
| `ANTHROPIC_API_KEY` *(hoặc `GEMINI_API_KEY` / `OPENAI_API_KEY`)* | khóa AI | ✅ |
| `CAL_SUPABASE_URL` | Project URL Supabase của **phân hệ Lịch công tác** (dự án riêng) | để hỏi được lịch |
| `CAL_SUPABASE_SERVICE_ROLE_KEY` | khóa bí mật Supabase của phân hệ Lịch công tác | để hỏi được lịch |

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

> ⚠️ **Nếu bot đã chạy từ trước**: sau khi cập nhật lên bản có nút duyệt, phải mở lại địa chỉ
> `?setup=` này **một lần nữa** thì Telegram mới bắt đầu gửi sự kiện bấm nút (`callback_query`),
> nếu không thì bấm nút Đồng ý / Từ chối sẽ không có tác dụng.

---

## 1b. Ai cũng dùng được — nhưng phải được duyệt

Bot **mở cho mọi người nhắn tới**, còn hỏi được hay không thì do Quản trị quyết định.

**Người dùng mới:**
1. Tìm bot trên Telegram, bấm Start (hoặc nhắn bất cứ gì) → bot mời đăng ký.
2. Gửi: `/dangky Họ và tên - Đơn vị công tác`
   *Ví dụ:* `/dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách`
3. Chờ. Khi được duyệt, bot tự nhắn lại báo tin và bắt đầu trả lời.

**Quản trị:** nhận ngay một tin có đủ họ tên, đơn vị, tên Telegram và ID, kèm 2 nút:

```
🔔 Có người xin sử dụng trợ lý:
Nguyễn Văn A · Ban Kinh tế - Ngân sách · @nguyenvana · ID 123456789
        [ ✅ Đồng ý ]   [ ⛔ Từ chối ]
```

Bấm một nút là xong — bot tự báo lại cho người đăng ký. Lệnh dự phòng nếu không bấm được nút:

| Lệnh | Tác dụng |
|---|---|
| `/danhsach` | Xem ai đang chờ duyệt, ai đã duyệt, ai bị từ chối |
| `/duyet <ID>` | Duyệt thủ công |
| `/tuchoi <ID>` | Từ chối, hoặc thu hồi quyền của người đã duyệt |

**Ba lớp bảo vệ khi mở rộng người dùng:**
- Người chưa được duyệt **không hỏi được gì** — chỉ nhận lời mời đăng ký.
- Mỗi người tối đa **`BOT_DAILY_LIMIT` câu hỏi/ngày** (mặc định 30) để chi phí AI không vượt tầm.
  Các lệnh nhanh (`/help`, `/solieu`, `/trangthai`) không gọi AI nên không tính lượt.
- Số liệu nhân sự (nâng lương, nghỉ hưu, hợp đồng) **chỉ trả lời cho `TELEGRAM_ADMIN_IDS`**;
  người dùng thường chỉ xem được kết quả đánh giá và tiêu chí — đúng bằng những gì trang web
  đã cho khách xem công khai.

Người đã đăng ký được lưu ở dòng `bot_users` trong bảng `app_state`.

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
| **Lịch công tác** (Supabase riêng) | Lịch **tuần này và tuần sau**: từng mục theo ngày/buổi, lãnh đạo, nội dung, địa điểm, thành phần, trạng thái duyệt và xe được điều |

**Về lịch công tác:** phân hệ này là hệ thống riêng, dùng dự án Supabase riêng, nên bot nối bằng
cặp biến `CAL_SUPABASE_URL` + `CAL_SUPABASE_SERVICE_ROLE_KEY` (lấy trong Vercel của dự án
`calendar`). Chưa khai thì bot vẫn chạy bình thường, chỉ không trả lời được câu hỏi về lịch.
Bot **chỉ đọc**, không nhập và không duyệt lịch. Phạm vi lấy dữ liệu là 14 ngày kể từ thứ Hai
tuần này — hỏi xa hơn thì bot chỉ đường dẫn để tự mở.

Hỏi được ví dụ: *"Tuần này đồng chí Phó Chủ tịch HĐND tỉnh có lịch gì?"* ·
*"Sáng mai có cuộc họp nào, ở đâu, đi xe nào?"* · *"Còn mục lịch nào đang chờ duyệt không?"* ·
*"Thứ Sáu này Ban Kinh tế - Ngân sách làm việc ở đâu?"*

Điểm của phân hệ đánh giá cán bộ được phần mềm ghi sẵn vào khóa `_summary` mỗi lần lưu,
nên bot đọc đúng con số mà giao diện hiển thị. Với dữ liệu lưu **trước khi** có tính năng
này, bot sẽ nhắc mở phần mềm bấm **Lưu ngay** một lần để cập nhật.

Điểm tiêu chí HĐND thì bot tính lại tại chỗ bằng chính `src/lib/khungTieuChi.js` của
giao diện nên không bao giờ lệch.

---

## 4. Những gì bot KHÔNG làm

- Không đọc mật khẩu quản trị, mã truy cập của đơn vị, số căn cước, số bảo hiểm xã hội,
  quan hệ gia đình trong hồ sơ 2C — các trường này không được đưa vào ngữ cảnh của AI.
- Không trả lời người chưa được Quản trị duyệt.
- Không ghi, không sửa dữ liệu — bot chỉ đọc.
- Không thay phần mềm: đây là bản demo, số liệu cần đối chiếu lại trên web trước khi
  dùng vào việc chính thức.

---

## 5. Bot trên Zalo

Mã đã sẵn sàng (`api/zalo.js`), dùng chung "bộ não" và chung sổ đăng ký với bot Telegram.
Việc còn lại là **thủ tục lập Official Account** — phần này thuộc thẩm quyền cơ quan,
không phải việc lập trình.

> Zalo **không** cho lập bot trên tài khoản Zalo cá nhân. Bắt buộc phải có **Official Account (OA)**.

### Bước 1 — Lập Official Account (mất vài ngày chờ duyệt)
1. Vào `oa.zalo.me` → **Tạo Official Account** → chọn loại phù hợp (cơ quan nhà nước).
2. Khai thông tin cơ quan, tải lên giấy tờ chứng minh (quyết định thành lập, giấy giới thiệu…).
3. Chờ Zalo xét duyệt và xác thực OA.

### Bước 2 — Tạo ứng dụng và gắn OA
1. Vào `developers.zalo.me` → **Tạo ứng dụng mới**.
2. Trong ứng dụng, thêm sản phẩm **Official Account**, chọn OA vừa lập và xin các quyền
   nhắn tin (gửi tin tư vấn, nhận sự kiện tin nhắn).
3. Ghi lại **App ID** và **App Secret Key**.

### Bước 3 — Khai biến môi trường trên Vercel

| Biến | Giá trị |
|---|---|
| `ZALO_APP_ID` | App ID ở bước 2 |
| `ZALO_APP_SECRET` | App Secret Key ở bước 2 |
| `ZALO_WEBHOOK_SECRET` | chuỗi bí mật tự đặt, ví dụ `zalo-hdnd-2026-xyz` |

Bấm **Redeploy**.

### Bước 3b — Xác thực domain (bắt buộc, hay quên)

Zalo chỉ chấp nhận địa chỉ callback thuộc domain đã xác thực. Thiếu bước này sẽ gặp
lỗi **`-14003 Invalid redirect uri`**.

1. `developers.zalo.me` → ứng dụng → **Xác thực domain** → thêm `hdndthkpi.vercel.app`.
2. Zalo đưa một **tệp xác minh** dạng `zalo_verifierXXXXXXXX.html`. Đặt tệp đó vào thư mục
   `public/` của dự án rồi commit + push — Vercel sẽ phục vụ tại
   `https://hdndthkpi.vercel.app/zalo_verifierXXXXXXXX.html`.
3. Quay lại Zalo bấm **Xác thực**.
4. Điền ô **Miền ứng dụng** ở trang *Cài đặt* = `hdndthkpi.vercel.app`.

> Địa chỉ callback là `https://hdndthkpi.vercel.app/api/zalo` — **để trần, không kèm
> tham số truy vấn**. Chuỗi bí mật được gửi qua tham số `state` của OAuth.

### Bước 4 — Xin quyền OA một lần (lấy token)

Zalo không cấp token vĩnh viễn: phải xin quyền một lần để lấy `access_token` (hạn khoảng
1 giờ) kèm `refresh_token`. Hệ thống tự làm mới token sau đó, anh không phải đụng vào nữa.

1. Mở: `https://hdndthkpi.vercel.app/api/zalo?auth=<ZALO_WEBHOOK_SECRET>`
   → trả về một đường dẫn ở trường `moLienKetNay`.
2. Mở đường dẫn đó **bằng tài khoản quản trị OA**, chọn OA rồi bấm **Cho phép**.
3. Zalo tự gọi ngược về hệ thống; thấy `{"ok":true,"message":"Đã lấy và lưu token..."}` là xong.

> Ở màn hình cấu hình ứng dụng, nhớ khai địa chỉ callback (redirect URI) là
> `https://hdndthkpi.vercel.app/api/zalo` thì bước 2 mới chạy.

### Bước 5 — Khai webhook
Trong `developers.zalo.me` → ứng dụng → **Official Account API** → **Webhook**, điền:

```
https://hdndthkpi.vercel.app/api/zalo?secret=<ZALO_WEBHOOK_SECRET>
```

Tick sự kiện **người dùng gửi tin nhắn văn bản** (`user_send_text`).

### Kiểm tra
Mở `https://hdndthkpi.vercel.app/api/zalo` — xem `token: true` là đã có token.
Rồi lấy điện thoại nhắn cho OA một câu; bot sẽ mời đăng ký bằng `/dangky Họ tên - Đơn vị`.

### Cách hoạt động
- Người dùng Zalo đăng ký y như bên Telegram, và **yêu cầu duyệt được gửi sang Telegram**
  cho Quản trị bấm nút (Zalo OA không có nút bấm tiện như vậy). Nút hiện rõ `(Zalo)`.
- Duyệt xong bot tự nhắn lại **trên Zalo** cho người đăng ký.
- `/danhsach` trong Telegram liệt kê người dùng của cả hai nền tảng kèm mã `tg:…` / `zalo:…`;
  duyệt thủ công bằng `/duyet zalo:<id>` hoặc `/tuchoi zalo:<id>`.
- Người dùng Zalo **không bao giờ** được coi là Quản trị → không đọc được hồ sơ nhân sự.
- Hạn mức mỗi ngày áp dụng chung.

### Hạn chế của Zalo cần biết trước
- OA chỉ được nhắn trả lời trong **một khoảng thời gian nhất định** sau khi người dùng nhắn
  tới; ngoài khung đó phải dùng ZNS (có phí). Vì bot chỉ trả lời khi được hỏi nên thường
  không vướng, nhưng nếu câu trả lời tới muộn (AI chậm) thì có thể bị Zalo từ chối.
- Chính sách và đường dẫn API của Zalo thay đổi theo thời kỳ. Nếu sau này hỏng, sửa 3 hằng
  số URL ở đầu `api/_lib/zaloApi.js` là đủ.
- Zalo không gửi tiêu đề bí mật như Telegram, nên chuỗi bí mật được đặt ngay trong địa chỉ
  webhook (`?secret=…`). Đừng để lộ địa chỉ webhook này ra ngoài.

---

## 6. Chi phí

Vercel và Telegram: miễn phí ở quy mô này. Chi phí chỉ nằm ở khóa AI, tính theo số lượt hỏi —
mỗi câu hỏi tốn khoảng vài nghìn đến vài chục nghìn token tùy lượng số liệu phải nạp.
Muốn rẻ hơn thì đặt `AI_MODEL` sang mô hình nhỏ (ví dụ `claude-haiku-4-5-20251001`
hoặc `gemini-2.5-flash`), hoặc dùng lệnh `/solieu` — lệnh này đọc thẳng cơ sở dữ liệu,
không gọi AI nên không mất phí.
