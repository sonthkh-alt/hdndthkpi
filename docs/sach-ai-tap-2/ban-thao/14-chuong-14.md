# Chương 14. Trợ lý chat qua Zalo, Telegram: đưa số liệu đến tận tay

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu vì sao nên đưa số liệu lên ứng dụng nhắn tin, và vì sao bot trên Zalo phải dùng Zalo Official Account chứ không dùng tài khoản cá nhân.
- Nắm cấu trúc "bộ não" dùng chung của bot: hiểu biết tĩnh, số liệu thật đọc từ cơ sở dữ liệu, AI diễn đạt; biết những lệnh nhanh không tốn phí AI.
- Biết cách mở bot cho mọi người mà vẫn kiểm soát được: đăng ký, chờ duyệt, hạn mức câu hỏi, dữ liệu nhân sự chỉ dành cho Quản trị.
- Hiểu sự cố trả lời lặp, cách chốt "mỗi tin chỉ xử lý một lần", cách đặt trần thời gian và đo thời gian thay vì đoán.
- Cân nhắc dịch vụ AI trung gian theo phân loại dữ liệu 4 cấp của Tập 1: tiện và rẻ, nhưng dữ liệu đi qua máy chủ của bên thứ ba.

Dành cho: cán bộ muốn tự làm một trợ lý chat cho phòng, Ban của mình; người quản trị hệ thống; lãnh đạo cần quyết định ai được hỏi gì qua kênh nhắn tin.
:::

Có những câu hỏi tôi nghe nhiều lần trong năm 2026, ở hành lang, trước giờ giao ban: "Tháng này còn ai chưa được phê duyệt?", "Tuần sau Thường trực có lịch gì?", "Xã nào chưa gửi phiếu tự đánh giá?". Câu trả lời đều nằm sẵn trong hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, địa chỉ hdndthkpi.vercel.app. Nhưng muốn lấy, người hỏi phải mở máy tính, nhớ đường dẫn, đăng nhập, bấm đúng phân hệ, đúng tab.

Chương này kể cách tôi cùng tác tử AI lập trình đưa những con số ấy đến thẳng ứng dụng nhắn tin mà cán bộ, đại biểu vẫn dùng mỗi ngày. Khác với khung chat Người hướng dẫn trên Trang chủ (Chương 13, mục 13.4), nơi khách vô danh được hỏi AI ba lượt mỗi ngày, bot ở đây dành cho người đã đăng ký, hạn mức rộng hơn và đọc được nhiều số liệu hơn.

## 14.1. Vì sao cần bot trên ứng dụng nhắn tin; vì sao Zalo cá nhân không lập được bot

### 14.1.1. Số liệu nằm trên web, người cần số liệu ở trên điện thoại

Phần mềm trên web giống một phòng lưu trữ ngăn nắp: hồ sơ đủ, nhưng muốn xem phải đến tận nơi. Bot chat (chatbot) giống chuyên viên trực điện thoại của phòng lưu trữ: người hỏi gọi, nói điều mình cần; chuyên viên tự tra rồi đọc lại kết quả.

Bot có ích ở bốn chỗ. **Hỏi bằng lời**, không cần biết điểm OKR/KPI nằm ở phân hệ nào. **Hỏi nối tiếp được**: bot nhớ mười lượt gần nhất, nên hỏi "còn đồng chí đó thì sao?" vẫn hiểu. **Gom nhiều nguồn** vào một câu trả lời. **Trả lời cả việc ngoài hệ thống**, như soạn một đoạn thông báo, nhưng phải nói rõ đó không phải số liệu của hệ thống.

Giới hạn cũng phải nói ngay. Bot **chỉ đọc**: không ghi, không sửa, không phê duyệt thay ai. Bot không thay phần mềm; đây vẫn là bản demo thử nghiệm, số liệu cần đối chiếu lại trên web trước khi dùng vào việc chính thức. Và bot không được biết những gì người hỏi không có quyền biết.

### 14.1.2. Telegram: lối vào dễ nhất để bắt đầu

Bot đầu tiên chạy trên Telegram, lối vào ít thủ tục nhất. Theo tài liệu cài đặt của dự án (`docs/BOT-CHAT.md`), phần Telegram làm trong khoảng mười phút: nhắn cho tài khoản **@BotFather** lệnh `/newbot` để nhận **mã bot (token)**, phải giữ kín như mật khẩu; lấy dãy số định danh (ID) Telegram của người làm Quản trị; khai mã bot, ID Quản trị, khóa AI, khóa cơ sở dữ liệu vào biến môi trường trên Vercel; rồi mở một đường dẫn đặc biệt một lần để đăng ký "địa chỉ nhận tin" (webhook).

Địa chỉ nhận tin giống chuông cửa. Có người nhắn cho bot, máy chủ Telegram bấm chuông ở cửa `https://hdndthkpi.vercel.app/api/telegram`; phòng làm việc phía sau (hàm máy chủ trên Vercel) mở cửa, đọc tin, soạn trả lời. Telegram cho gắn một chuỗi bí mật vào mỗi lần bấm chuông, nên hàm máy chủ nhận ra đâu là Telegram thật, đâu là người lạ gõ cửa.

Telegram không cần xác thực tổ chức, không có gói phí, có nút bấm ngay trong tin nhắn; mỗi tin tối đa 4.096 ký tự nên câu trả lời dài phải tự cắt. Nhược điểm lớn nhất không nằm ở kỹ thuật: ở Việt Nam, cán bộ quen dùng Zalo hơn.

### 14.1.3. Zalo: phải có Official Account

Tài liệu cài đặt mà tác tử soạn đã nêu ngay một điều, sau này tôi đối chiếu được với tài liệu của Zalo: **Zalo không cho lập bot trên tài khoản cá nhân**. Muốn có bot phải lập **Official Account (OA)**, loại tài khoản Zalo mô tả là "tài khoản chính thức của Doanh nghiệp, Media và Cơ quan nhà nước". OA của Văn phòng mang tên "VP Đoàn ĐBQH và HĐND tỉnh Thanh Hóa".

Lập OA là thủ tục của cơ quan, không phải việc lập trình. Tài liệu của dự án chia năm bước: lập OA và chờ xác thực; tạo ứng dụng trên trang dành cho nhà phát triển rồi gắn OA vào; khai ba biến môi trường; xin quyền OA một lần để lấy mã thông báo; khai địa chỉ nhận tin. Theo các nguồn tôi tra được, hồ sơ xác thực được xét trong khoảng 2–3 ngày làm việc; chưa thấy quy trình riêng cho cơ quan nhà nước, nên cần hỏi trực tiếp Zalo.

Phần kỹ thuật của Zalo cũng có "quy chế văn thư" riêng, điều nào cũng từng làm tôi mất công:

| Quy định của Zalo | Hệ quả nếu không biết | Cách dự án xử lý |
|---|---|---|
| Mã thông báo sống khoảng 1 giờ | Bot im lặng sau một giờ | Tự làm mới trước khi hết hạn |
| Mã làm mới chỉ dùng một lần | Lần làm mới sau bị hỏng | Lưu ngay mã mới vào kho |
| Phải xác thực tên miền bằng tệp | Báo lỗi -14003 | Đặt tệp xác minh vào thư mục công khai |
| Địa chỉ nhận tin không được kèm tham số | "Đường dẫn webhook không hợp lệ" | Nhận diện gói tin bằng mã ứng dụng |

Mã thông báo giống thẻ ra vào có hạn một giờ: mỗi lần đổi thẻ, bảo vệ thu thẻ cũ, phát kèm phiếu đổi thẻ mới; mất phiếu là làm lại thủ tục từ đầu.

::: {.canhbao}
**Cảnh báo: chi phí và thời hạn trả lời của Zalo OA**

Từ ngày 01/6/2026, Zalo áp dụng bốn gói dịch vụ mới cho OA. Theo thông báo của Zalo và bảng giá do các nguồn thứ ba tổng hợp, gói Cơ bản miễn phí nhưng không có chatbot và giao diện lập trình (API); gói Tăng trưởng có chatbot và API, khoảng 1.400.000 đồng/6 tháng hoặc 2.500.000 đồng/năm. Đây là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi; phải đối chiếu bảng giá chính thức của Zalo trước khi dự trù kinh phí.

OA chỉ được gửi tin tư vấn trong một khoảng thời gian sau lần tương tác cuối của người dùng (tài liệu của Zalo tại thời điểm viết ghi 7 ngày). Bot chỉ trả lời khi được hỏi nên thường không vướng; nhưng đừng thiết kế bot "chủ động nhắn" hằng ngày khi chưa tìm hiểu kỹ loại tin và phí.
:::

Telegram và Zalo vì vậy bổ sung cho nhau: Telegram làm "phòng thí nghiệm" và kênh của Quản trị, Zalo là kênh quen thuộc với số đông. Cả hai dùng chung một bộ não và một sổ đăng ký người dùng, nên sửa một chỗ thì hai kênh cùng được hưởng.

Các câu lệnh mẫu trong chương viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG của Tập 1 (mục 3.2). Dòng [NGHIỆM THU] ở cuối là phần Tập 2 thêm vào khi giao việc cho tác tử AI lập trình (Chương 6, mục 6.2): nêu trước những gì phải chạy được thì mới coi là xong.

::: {.lenhmau}
**Câu lệnh mẫu 14.1 — Dựng bot Telegram tối thiểu, chỉ đọc**

```text
[VAI] Lập trình viên cẩn trọng. Tôi không chuyên lập trình; giải thích
mọi bước cấu hình bằng lời dễ hiểu.
[BỐI CẢNH] Hệ thống chạy trên Vercel, dữ liệu ở Supabase. Tôi muốn cán bộ
hỏi số liệu qua Telegram. Bot CHỈ ĐỌC.
[VIỆC] Tạo hàm máy chủ api/telegram.js: GET hiện tình trạng bot; GET
?setup=[chuỗi bí mật] tự đăng ký webhook; POST nhận tin, kiểm tra tiêu đề
bí mật của Telegram, trả lời lệnh /help.
[DẠNG] Chú thích trong mã bằng tiếng Việt; kèm tệp hướng dẫn cài đặt
tiếng Việt, các bước đánh số, ghi rõ lấy từng giá trị ở đâu.
[RÀNG BUỘC] Khóa bí mật chỉ ở biến môi trường máy chủ, KHÔNG có tiền tố
VITE_. Luôn trả mã 200 cho Telegram. Tin dài quá 4.096 ký tự thì cắt theo
dòng. Chưa khai ID Quản trị thì nhắn lại ID của người gửi.
[NGHIỆM THU] ?setup= trả "ok": true; nhắn /help nhận đúng bảng hướng dẫn;
POST không có tiêu đề bí mật bị từ chối; có phép kiểm cho tin dài đúng bằng
giới hạn và giới hạn cộng một.
```
:::

## 14.2. "Bộ não" dùng chung: hiểu biết tĩnh, số liệu thật, AI diễn đạt

### 14.2.1. Ba tầng của một câu trả lời

Hãy hình dung một thư ký tổng hợp được hỏi: "Phòng nào có điểm trung bình cao nhất tháng này?". Người ấy mở sổ tay nghiệp vụ xem điểm tính thế nào, ra kho lấy đúng bảng điểm của kỳ đang hỏi, rồi viết câu trả lời ngắn. Bộ não của bot (tệp `api/_lib/brain.js`) làm đúng ba việc đó.

| Tầng | Ví như | Tệp trong dự án | Nội dung |
|---|---|---|---|
| Hiểu biết tĩnh | Sổ tay nghiệp vụ | `knowledge.js` | Phân hệ, cách tính điểm, phân quyền, mốc thời gian |
| Số liệu thật | Tập hồ sơ vừa lấy từ kho | `facts.js` | Đọc thẳng cơ sở dữ liệu lúc hỏi |
| AI diễn đạt | Người viết lại cho dễ đọc | `ai.js` | Gọi AI, trả câu trả lời |

Mỗi lượt hỏi, bộ não ghép một **lời nhắc hệ thống (system prompt)** gồm quy tắc ứng xử, hiểu biết tĩnh, số liệu vừa đọc kèm thời điểm đọc, và vai của người hỏi (Quản trị hay người dùng thường), rồi gửi cho AI cùng vài lượt hội thoại gần nhất. AI không "biết" số liệu của Văn phòng; nó chỉ đọc lại những gì vừa được đặt trước mặt. Bot nói sai thì biết tìm ở đâu: sai quy tắc tính thì sửa sổ tay, sai con số thì kiểm kho.

### 14.2.2. Mang đúng tập hồ sơ, không bê cả tủ

Bộ gom số liệu dò từ khóa trong câu hỏi để chọn tập hồ sơ: có "lịch", "họp", "ngày mai" thì nạp lịch công tác; có "biểu quyết", "kỳ họp" thì nạp kết quả biểu quyết; có "xã", "phường", "tiêu chí" thì nạp Tiêu chí HĐND; không khớp nhóm nào thì mặc định nạp kỳ đánh giá cán bộ. Nạp ít thì lời nhắc ngắn, AI trả lời nhanh và rẻ hơn.

Điều tôi coi trọng nhất ở tầng này là nguyên tắc **"một con số, một nơi tính"**. Bot không được tự tính điểm cán bộ bằng công thức riêng, vì sớm muộn bot sẽ nói một số, màn hình hiện một số khác. Với OKR/KPI và Kiểm điểm, mỗi lần lưu, giao diện ghi kèm bảng điểm **đã tính sẵn** để bot chỉ việc đọc; bản lưu cũ chưa có bảng này thì bot nhắc người dùng mở phần mềm bấm "Lưu ngay". Với Tiêu chí HĐND và Biểu quyết Online, bot tính lại tại chỗ bằng **chính tệp logic** của giao diện, kể cả việc áp trần 25% Xuất sắc cấp xã.

Tầng này cũng lộ ra một hệ quả dây chuyền. Ngày 13/8/2026, khi tách kho dữ liệu cho mỗi phân hệ, bản ghi Kiểm điểm đổi sang tên dạng `state_kiemdiem_…`; bot dò tên bằng mẫu cũ nên **mất hẳn phân hệ Kiểm điểm** mà không báo lỗi gì. Từ đó, quy tắc "rà soát chức năng liên quan" (Chương 7, mục 7.5) ghi đích danh: đổi khóa hay định dạng dữ liệu thì phải kiểm bot chat.

Khi đọc lại mã để viết chương này, tôi thấy thêm một chỗ: từ khóa "xe" (hỏi chuyện điều xe) được dò theo kiểu chuỗi con, nên câu "cho tôi xem điểm tháng này" cũng khớp, vì "xem" chứa "xe". Lượt đó nạp thừa lịch công tác, tốn thêm chút thời gian và phí. Đó vẫn là cái bẫy chuỗi con của tiếng Việt kể ở Chương 15, mục 15.2; lần này vô hại, nhưng cách dò từ khóa nào cũng phải được thử bằng câu hỏi đời thường.

### 14.2.3. Tám quy tắc trong lời nhắc hệ thống

Diễn lại bằng lời thường, lời nhắc hệ thống của bot có tám quy tắc:

1. Tiếng Việt có dấu, ngắn gọn, hợp khung chat: gạch đầu dòng, không bảng rộng.
2. Số liệu chỉ lấy trong phần "SỐ LIỆU HỆ THỐNG"; không có thì nói thẳng và chỉ đường dẫn.
3. Câu hỏi về cách dùng, cách tính thì dựa vào hiểu biết tĩnh.
4. Câu hỏi ngoài hệ thống được trả lời, nhưng phải nói rõ đó không phải số liệu của hệ thống.
5. Nhắc đây là bản demo khi người hỏi định dùng vào việc chính thức.
6. Không cung cấp mật khẩu, mã truy cập, số căn cước, số bảo hiểm xã hội, thông tin gia đình.
7. Hỏi đích danh một người, một Ban, một đơn vị thì chỉ dùng dòng ghi đúng tên đó; không thấy thì nói "không có mục nào", tuyệt đối không thay bằng người khác.
8. Dưới 200 từ, trừ khi được yêu cầu chi tiết.

Quy tắc thứ bảy chặn thói quen "chiều lòng người hỏi" của AI: không thấy đúng người, nó dễ lấy tạm dòng gần giống nhất. Với số liệu về con người, trả lời nhầm người còn tệ hơn không trả lời.

### 14.2.4. Bốn lệnh nhanh không tốn phí AI

| Lệnh | Việc làm |
|---|---|
| `/help` | Bảng hướng dẫn và câu hỏi mẫu |
| `/solieu` | Đọc thẳng số liệu các phân hệ, không qua AI |
| `/quen` | Xóa ngữ cảnh, hỏi lại từ đầu |
| `/trangthai` | Kiểm tra kết nối cơ sở dữ liệu, AI, các hệ thống ngoài |

Lệnh `/solieu` là công cụ chẩn đoán tôi dùng nhiều nhất. Bot trả lời một con số lạ, tôi gõ `/solieu`: số trong kho cũng lạ thì lỗi ở dữ liệu; số trong kho đúng mà câu trả lời sai thì lỗi ở khâu AI diễn đạt. Các lệnh bắt đầu bằng `/` không tính vào hạn mức ngày, vì không tốn tiền AI.

Trí nhớ mười lượt của bot nằm trong cơ sở dữ liệu và tự quên sau hai ngày im lặng, vì hàm máy chủ kiểu "không máy chủ thường trực" (serverless) mỗi lần gọi là một tiến trình mới, không nhớ gì từ lần trước.

::: {.vidu}
**Ví dụ minh họa: một lượt hỏi đi qua bộ não**

Hãy hình dung một đồng chí lãnh đạo Ban nhắn: "Tuần này còn mục lịch nào chờ duyệt không?". Bộ gom số liệu thấy "lịch", "tuần", "chờ duyệt" nên chỉ nạp lịch công tác hai tuần; AI trả lời vài gạch đầu dòng. Đồng chí hỏi tiếp "mục thứ hai đi xe nào?"; bot dựa vào lượt trước để hiểu "mục thứ hai".
:::

### 14.2.5. Nếu đồng chí muốn làm phiên bản nhỏ hơn

Một phòng, một Ban có thể bắt đầu ở Bậc 2–3 của thang kiến tạo (Chương 2, mục 2.3).

::: {.thuchanh}
**Thực hành: bot của một phòng trong ba buổi**

1. **Buổi 1 — chưa có AI.** Dùng Câu lệnh mẫu 14.1 dựng bot Telegram chỉ có `/help` và `/solieu`; nguồn số liệu là một bảng tính chỉ chứa dữ liệu Cấp 1 — Công khai theo phân loại 4 cấp của Tập 1, mục 7.1–7.2 (danh mục văn bản đã ban hành, tiến độ các việc đã công khai).
2. **Buổi 2 — thêm AI.** Một khóa AI duy nhất, lời nhắc có các quy tắc 2, 4, 6, 7 ở mục 14.2.3, hạn mức thấp ngay từ đầu (ví dụ 10 câu mỗi người mỗi ngày).
3. **Buổi 3 — thêm kỷ cương.** Đăng ký và duyệt (mục 14.3), trang tình trạng, bộ phép kiểm cho các câu hỏi đời thường của phòng; ghi mọi quyết định vào bộ nhớ dự án (Chương 7, mục 7.1–7.2).
:::

::: {.lenhmau}
**Câu lệnh mẫu 14.2 — Thêm một nguồn số liệu vào bộ não của bot**

```text
CHƯA SỬA TỆP NÀO. Tôi muốn bot trả lời câu hỏi về [tên nguồn]. Dữ liệu
nằm ở [vị trí]. Trình phương án gồm:
1. Hàm đọc (chỉ đọc) và hàm định dạng THUẦN, không gọi mạng, để kiểm
   thử bằng Node.
2. Bộ từ khóa kích hoạt; liệt kê câu hỏi đời thường dễ khớp nhầm.
3. Ai được nghe nguồn này; trường nào TUYỆT ĐỐI không đưa vào lời nhắc.
4. Con số nào phải dùng lại hàm tính của giao diện.
5. Chỗ phải sửa theo: hiểu biết tĩnh, /solieu, /trangthai, tài liệu.
Chờ tôi duyệt rồi mới làm. Nghiệm thu: phép kiểm cho định dạng, phân
quyền và ít nhất 5 câu hỏi mẫu; build xanh.
```
:::

## 14.3. Mở cho mọi người nhưng phải được duyệt

### 14.3.1. Từ danh sách trắng đến đăng ký và duyệt

Thời gian đầu, bot Telegram chỉ phục vụ các ID trong một danh sách trắng khai sẵn; mỗi lần thêm người, Quản trị phải sửa biến môi trường rồi triển khai lại. Bản sau đổi thành **ai cũng nhắn tới được, nhưng phải được Quản trị duyệt mới hỏi được**. Người lạ nhắn bất cứ gì, bot mời gửi `/dangky Họ và tên - Đơn vị công tác`, ghi vào sổ đăng ký với trạng thái "chờ duyệt", rồi gửi cho Quản trị một tin có hai nút **[✅ Đồng ý] [⛔ Từ chối]**. Quản trị bấm một nút; bot sửa tin thành "ĐÃ DUYỆT" hay "ĐÃ TỪ CHỐI" kèm ID người bấm, và tự nhắn lại cho người đăng ký.

| Trạng thái | Người dùng nhận được gì | Ghi chú |
|---|---|---|
| Chưa có trong sổ | Lời mời đăng ký | Không hỏi được gì |
| Chờ duyệt | Thông báo đang chờ | Khai lại được thông tin |
| Đã duyệt | Được hỏi, có hạn mức ngày | Quản trị thu hồi được |
| Bị từ chối | Báo chưa được chấp thuận, mời liên hệ Văn phòng | Đăng ký lại KHÔNG tự mở khóa |

Dòng cuối là chủ ý: nếu gửi lại `/dangky` là quay về "chờ duyệt" thì Quản trị bị làm phiền liên tục. Muốn đóng hẳn đăng ký mới, đặt một biến môi trường là bot quay về chế độ danh sách trắng.

### 14.3.2. Một nơi duyệt cho hai nền tảng

Zalo OA không có kiểu nút bấm trong tin nhắn tiện như Telegram, nên yêu cầu đăng ký từ Zalo cũng được **chuyển sang Telegram** cho Quản trị bấm, có ghi rõ "(Zalo)". Mỗi nút mang mã dạng `ok:[nền tảng]:[mã người dùng]`; dạng cũ `ok:[mã người dùng]` trước khi nâng cấp vẫn được hiểu là Telegram, nên các tin chờ duyệt đã gửi không bị "chết nút". Duyệt xong, bot báo kết quả về **đúng nền tảng** của người đăng ký.

Phòng khi không bấm được nút, Quản trị có bốn lệnh dự phòng: `/danhsach`, `/duyet [mã]`, `/tuchoi [mã]` (cũng dùng để thu hồi quyền), `/moluot [mã]` (mở lại lượt trong ngày cho người bị trừ oan). Một điều "bắt buộc, hay quên": khi thêm loại sự kiện bấm nút, phải mở lại đường dẫn đăng ký địa chỉ nhận tin một lần nữa, nếu không Quản trị bấm nút mãi không thấy gì.

### 14.3.3. Ba lớp chặn

1. **Chưa duyệt thì không hỏi được gì.**
2. **Hạn mức 30 câu mỗi người mỗi ngày** (đổi được bằng biến môi trường); lệnh `/…` không tính lượt; mốc đặt lại là **0 giờ theo giờ Việt Nam**. Bản đầu đặt lại lúc 0 giờ quốc tế, tức 7 giờ sáng ở Việt Nam; lỗi này được sửa cùng đợt vá ở mục 14.5.
3. **Số liệu nhân sự chỉ dành cho Quản trị.** Nhắc việc nâng lương, nghỉ hưu, hợp đồng chỉ được nạp khi ID người hỏi nằm trong danh sách Quản trị; người dùng thường không bao giờ nhận được hồ sơ nhân sự (bảng ở mục 14.4.3). **Người dùng Zalo không bao giờ được coi là Quản trị**: mã xử lý tin Zalo luôn đặt người hỏi ở vai người dùng thường.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 có hiệu lực từ 01/01/2026, phân dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.
- Nghị định 356/2025/NĐ-CP quy định chi tiết Luật Bảo vệ dữ liệu cá nhân, có hiệu lực từ 01/01/2026; từ ngày này Nghị định 13/2023/NĐ-CP hết hiệu lực. Điều 3 của Nghị định 356 liệt kê dữ liệu cá nhân cơ bản, trong đó có họ, chữ đệm, tên khai sinh và số điện thoại. Sổ đăng ký người dùng bot và danh bạ đều thuộc diện này.
- Với người làm bot: chỉ thu thập trường thật sự cần, nói rõ mục đích khi mời đăng ký, phân quyền đọc ở máy chủ. Trước khi áp dụng, tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

Một điểm chưa hoàn hảo, phát hiện khi đọc lại mã: sổ đăng ký và bộ đếm lượt nằm chung một dòng dữ liệu, mỗi lần cập nhật là "đọc cả dòng, sửa, ghi cả dòng". Hai người cập nhật đúng một khoảnh khắc thì một bản ghi có thể bị đè mất. Ở quy mô một cơ quan, xác suất thấp và hậu quả nhẹ; nếu mở rộng, nên chuyển sang thao tác nguyên tử như cách chống trả lời lặp ở mục 14.5.

::: {.lenhmau}
**Câu lệnh mẫu 14.3 — Thêm cơ chế đăng ký và duyệt người dùng bot**

```text
[BỐI CẢNH] Bot Telegram của dự án đang chỉ phục vụ danh sách trắng.
[VIỆC] Thêm sổ đăng ký: người lạ nhận lời mời /dangky Họ tên - Đơn vị;
Quản trị nhận tin có 2 nút Đồng ý / Từ chối; bot báo lại kết quả.
[RÀNG BUỘC] Bị từ chối thì đăng ký lại không tự mở khóa. Hạn mức [30]
câu/người/ngày, đặt lại lúc 0 giờ GIỜ VIỆT NAM; lệnh bắt đầu bằng "/"
không tính lượt. Dữ liệu nhân sự chỉ nạp khi người hỏi là Quản trị.
Có lệnh dự phòng /danhsach, /duyet, /tuchoi.
[NGHIỆM THU] Phép kiểm đi hết vòng: người lạ → lời mời → duyệt → hỏi
được → thu hồi → không hỏi được nữa; người thường bấm nút duyệt bị từ
chối; hết hạn mức thì nhận lời hẹn ngày mai.
```
:::

## 14.4. Đọc dữ liệu nhiều hệ thống và ranh giới riêng tư

### 14.4.1. Ba hệ thống riêng, ba "cửa chỉ đọc"

Chương 12, mục 12.4 đã kể ba hệ thống riêng được gắn vào Trang chủ bằng liên kết. Bot không gộp mã của chúng, mà đọc dữ liệu qua cửa chỉ đọc, mỗi hệ thống một kiểu.

| Hệ thống | Bot đọc bằng cách nào | Phạm vi, giới hạn |
|---|---|---|
| Lịch công tác tuần | Cặp biến kết nối riêng tới cơ sở dữ liệu của hệ thống lịch | 14 ngày từ thứ Hai tuần này, tối đa 150 mục, giờ Việt Nam |
| Giám sát số | Tệp dữ liệu công khai; không có bản thật thì đọc bản mẫu | Chờ tối đa 8 giây |
| Một dữ liệu | Điểm nối dữ liệu mở của hệ thống đó | Chờ tối đa 7 giây |

Với lịch công tác, bot gom theo ngày rồi theo buổi, ghi nội dung, địa điểm, thành phần, trạng thái duyệt, xe được điều; chưa khai cặp biến kết nối thì bot bỏ qua phần lịch. Nhật ký ghi lần đọc thật hai hệ thống ngoài: Giám sát số mất 566 mili giây, Một dữ liệu 364 mili giây. Đọc dữ liệu không phải nơi tốn thời gian của một lượt chat; nơi tốn thời gian sẽ lộ ra ở mục 14.5.

### 14.4.2. Khi đối tác "đang ngủ": dạy AI nói "chưa lấy được"

Một dữ liệu chạy trên gói máy chủ miễn phí, tự ngủ khi vắng người dùng; lần đánh thức mất 30–60 giây, một lượt chat không chờ nổi. Dự án đặt trần chờ 7 giây; hết giờ thì bộ gom số liệu đưa cho AI một đoạn giải thích: máy chủ bên đó đang ngủ, lượt này chưa lấy được số liệu, hãy nói thật với người hỏi, tuyệt đối không đoán số. Kỹ thuật nhỏ này đáng nhớ: **khi không có dữ liệu, hãy nói cho AI biết vì sao không có**. Để trống, AI dễ lấp chỗ trống bằng trí tưởng tượng.

### 14.4.3. Ai hỏi thì được nghe đến đâu

Ranh giới chủ yếu được vạch ngay ở khâu gom số liệu, không trông vào lời dặn AI.

| Nguồn dữ liệu | Người dùng đã duyệt | Quản trị | Khung chat khách ở Trang chủ |
|---|---|---|---|
| Đánh giá, tiêu chí, biểu quyết, lịch 2 tuần | Có | Có | Có |
| Danh bạ điện thoại | Có, AI được dặn chỉ trả số của đúng người | Như bên trái | Tắt mặc định |
| Nhắc việc nhân sự | Không | Có, trừ căn cước, bảo hiểm, gia đình | Không |
| Kiến nghị cử tri có tên người dân | Không | Có | Không |

Dòng danh bạ là chỗ tôi phải tự nhận còn yếu. Khi câu hỏi có chữ "số điện thoại", "danh bạ", bộ gom số liệu nạp **cả danh bạ** vào lời nhắc, rồi trông vào lời dặn "chỉ trả số của đúng người được hỏi". Như vậy cả danh sách vẫn đi tới nhà cung cấp AI ở mỗi lượt hỏi. Cách đúng là lọc ngay ở khâu gom: chỉ đưa vào dòng khớp họ tên, chức vụ người hỏi nêu. Việc này nằm trong danh sách phải sửa trước khi dùng thật.

Hai loại kiến nghị cử tri cho thấy vì sao phải xét từng nguồn. Bên Giám sát số, bản ghi kiến nghị **cố ý không lưu** họ tên, số điện thoại, địa chỉ của cử tri vì kho dữ liệu đó công khai; bot đọc được mà không có gì để lộ. Bên Trợ lý AI nghiệp vụ dân cử, kiến nghị có ghi tên cử tri; dòng dữ liệu ấy cố ý không mở đọc công khai và bot chỉ trả cho Quản trị.

::: {.ghinho}
**Ghi nhớ: không đưa vào chắc hơn dặn đừng nói**

AI biết gì thì có thể nói ra cái đó. Lời dặn "đừng tiết lộ" trong lời nhắc hệ thống chỉ là lớp bảo vệ thứ hai; lớp thứ nhất là không nạp dữ liệu nhạy cảm khi người hỏi không có quyền. Chương 19, mục 19.3 vẽ đầy đủ đường đi của một câu hỏi qua các máy chủ.
:::

### 14.4.4. Sổ tay của bot cũng lỗi thời

Khi bot đã nối được lịch công tác, tệp hiểu biết tĩnh vẫn ghi "trợ lý KHÔNG đọc được lịch"; nối thêm Giám sát số và Một dữ liệu thì lại phải thay ba câu "không đọc được số liệu phân hệ này". Mã đổi mà sổ tay không đổi thì bot tự tin nói sai về chính mình.

Bài học này chưa khép lại: đến ngày 26/10/2026, tệp mô tả kiến trúc trong bộ nhớ dự án vẫn ghi bot không đọc được lịch, Giám sát số, Một dữ liệu; tài liệu cài đặt bot còn một đoạn cũ mâu thuẫn với chính bước khai báo địa chỉ nhận tin của Zalo. Tài liệu cho người và cho AI phải được rà cùng lúc với mã (Chương 7, mục 7.2 và 7.5).

::: {.lenhmau}
**Câu lệnh mẫu 14.4 — Nối bot với một hệ thống ngoài qua cửa chỉ đọc**

```text
[VIỆC] Cho bot đọc dữ liệu của hệ thống [tên] tại [điểm nối dữ liệu công
khai hoặc cặp biến kết nối].
[RÀNG BUỘC] CHỈ ĐỌC. Trần chờ [7] giây; hết giờ thì trả cho AI đoạn giải
thích "chưa lấy được, không đoán số", không làm hỏng lượt chat. Lọc bỏ mọi
trường có thể nhận diện người dân trước khi nạp vào lời nhắc. Chưa cấu
hình thì bot vẫn chạy. Cập nhật hiểu biết tĩnh, /trangthai, tài liệu
kiến trúc.
[NGHIỆM THU] Phép kiểm cho: dữ liệu đủ, dữ liệu rỗng, hết giờ chờ, máy
chủ trả lỗi; đọc thật một lần và báo số mili giây.
```
:::

## 14.5. Sự cố trả lời lặp và tốc độ

::: {.cauchuyen}
**Câu chuyện thực tế: một câu hỏi, hai câu trả lời**

Bot Zalo chạy được ít lâu thì người dùng bắt đầu nhận hai câu trả lời giống hệt nhau cho một câu hỏi, có lúc kèm dòng báo lỗi tiếng Anh *"This operation was aborted"*. Hạn mức 30 câu mỗi ngày cạn nhanh gấp đôi. Tôi sửa hai đợt: đợt đầu chặn trả lời lặp; đợt sau, nhờ nhật ký chẩn đoán, mới tìm ra gốc ở tốc độ.
:::

### 14.5.1. Nền tảng "không chắc thì gửi lại"

Zalo chỉ chờ máy chủ của ta báo "đã nhận" (mã 200) trong ít giây; không thấy thì **gửi lại nguyên tin**, trong khi một lượt hỏi AI mất nhiều giây. Hàm máy chủ kiểu serverless mỗi lần gọi là một tiến trình riêng, không biết tin này đã có tiến trình khác nhận, thế là hai tiến trình cùng soạn, cùng gửi câu trả lời.

Cách chữa là thao tác `claimOnce`, tôi gọi nôm na là **"vào sổ trước khi xử lý"**, giống văn thư vào sổ văn bản đến: văn bản đến lần thứ hai cùng số thì thấy ngay đã có trong sổ. Trước khi nạp bộ não, hàm máy chủ chèn một dòng mang mã của tin nhắn vào cơ sở dữ liệu. Cơ sở dữ liệu từ chối dòng trùng mã (báo lỗi 409) một cách **nguyên tử**, tức là việc kiểm tra và ghi diễn ra trọn trong một nhịp, không ai chen vào giữa được: kể cả hai lần gọi chạy song song cũng chỉ một lần chèn được. Lần chèn không được thì bỏ qua, ghi vào nhật ký "tin trùng". Telegram cũng gửi lại khi chậm, nên được chốt tương tự theo mã cập nhật.

Ba chi tiết đáng chú ý. **Cố ý không chặn theo nội dung tin**, vì người dùng có quyền hỏi lại y hệt câu vừa hỏi. **Kho dữ liệu trục trặc thì vẫn trả lời**: thà có lúc trả lời hai lần còn hơn im lặng. **Dọn sổ sau khi đã trả lời**: các dòng quá một ngày được xóa, nhưng làm sau khi đã gửi trả lời để người dùng không phải chờ thêm.

Lớp nguyên nhân thứ hai nằm ở khâu gửi tin: mã cũ gặp lỗi nào cũng "thử thêm đầu nối thứ hai cho chắc", có lúc Zalo báo lỗi mà tin vẫn đi. Nay chỉ khi Zalo trả mã lỗi -235 (loại OA không dùng được đầu nối này) mới thử đầu nối khác. "Thử lại cho chắc" chỉ an toàn khi biết chắc lần trước đã thất bại.

### 14.5.2. Nguyên nhân gốc: 45 giây chờ trong một hàm bị cắt ở 60 giây

Dòng *"This operation was aborted"* hóa ra là thông báo gốc khi bộ nối AI chạm trần chờ 45 giây, trong khi cấu hình của dự án cắt mỗi hàm máy chủ ở 60 giây. Dịch vụ AI trung gian (mục 14.6) trả lời chậm nên trần ấy thường bị chạm; trong lúc chờ, Zalo không nhận được 200 nên gửi lại tin. Lỗi tốc độ sinh ra lỗi lặp, lỗi lặp đốt hạn mức.

Đợt sửa thứ hai gồm sáu việc: hạ trần chờ AI xuống 40 giây (đổi được bằng biến môi trường) để còn thời gian gửi câu báo lỗi; viết lời báo lỗi bằng tiếng Việt, kèm tên miền dịch vụ AI; giảm độ dài trả lời tối đa từ 1.200 xuống 900 token (đơn vị AI dùng để đo độ dài văn bản, khác với mã thông báo của Zalo); nạp số liệu và lịch sử hội thoại **song song** thay vì nối tiếp; nhớ đầu nối gửi tin đã chạy được để khỏi phí một vòng gọi mạng thử đầu nối không dùng được; thêm lệnh `/moluot` mở lại lượt cho người bị trừ oan. Bộ phép kiểm của bot tăng từ 171 lên 181.

Một sự cố tốc độ khác: nút "Kiểm tra" địa chỉ nhận tin của Zalo chỉ chờ vài giây, trong khi lần gọi đầu Vercel phải "khởi động nguội" (như bảo vệ phải dậy mở cửa ngoài giờ) nên Zalo báo lỗi 408. Cách chữa: sự kiện không phải tin nhắn văn bản thì trả 200 ngay; chỉ nạp bộ não khi chắc là tin nhắn thật.

### 14.5.3. Đo thời gian thay vì đoán

Câu tôi thích nhất trong nhật ký đợt sửa này là ghi số đo "để lần sau BIẾT thời gian đi đâu chứ không đoán". Mỗi tin nhắn Zalo nay để lại một bản ghi chẩn đoán, xem ở trang tình trạng của bot (một địa chỉ riêng trên máy chủ, mở bằng trình duyệt).

Trang tình trạng giống sổ trực ban: ghi giờ nhận tin, mã người gửi, đoạn đầu của tin gần nhất và của câu trả lời. Chính vì vậy, khi bot phục vụ dữ liệu thật, trang này phải đặt sau đăng nhập của Quản trị, hoặc bỏ hẳn phần nội dung tin; đừng để sổ trực ban nằm ở phòng tiếp dân.

::: {.thuchanh}
**Thực hành: đọc trang tình trạng của bot Zalo**

1. Mở trang tình trạng bằng trình duyệt. Trường `token` là `true` thì đã có mã thông báo; `false` kèm lỗi thì làm lại bước xin quyền OA.
2. `tinNhanGanNhat` trống nghĩa là Zalo **chưa gửi tin nào** tới hệ thống: lỗi ở khâu khai địa chỉ nhận tin, không phải ở mã.
3. Trong `tinNhanGanNhat`, xem `ketQua`: "đã gửi" là trôi chảy; "LỖI GỬI" kèm mã lỗi là Zalo từ chối cho gửi (hết khung thời gian trả lời, thiếu quyền).
4. Nhóm `giay` gồm `soLieu` (giây đọc số liệu), `ai` (giây chờ AI), `tong` và `coChuLoiDan` (độ dài lời nhắc). Thời gian dồn ở `ai` thì nghĩ tới mô hình nhỏ hơn hoặc nhà cung cấp nhanh hơn; lời nhắc quá dài thì xem lại bộ dò từ khóa.
5. `tinTrungGanNhat` khác trống nghĩa là Zalo vừa gửi lại một tin và bot đã chặn được.
:::

::: {.lenhmau}
**Câu lệnh mẫu 14.5 — Rà soát chống xử lý lặp và trần thời gian**

```text
CHƯA SỬA TỆP NÀO. Rà soát mọi điểm nhận sự kiện từ bên ngoài (webhook
Telegram, Zalo, nút bấm) và trả lời bằng bảng:
1. Cùng một sự kiện đến hai lần, kể cả đến SONG SONG, thì sao? Chốt
   "mỗi sự kiện xử lý một lần" ở đâu, có nguyên tử không?
2. Chốt theo mã sự kiện hay theo nội dung? (Không được chặn người dùng
   hỏi lại y hệt.)
3. Mọi lần gọi ra ngoài có trần thời gian chưa? Tổng các trần có nhỏ
   hơn trần của nền tảng không?
4. Chỗ nào "thử lại cho chắc" mà không biết lần trước đã thành công?
5. Có ghi số đo thời gian từng khâu chưa? Lời báo lỗi có bằng tiếng Việt?
Đề xuất sửa xếp theo mức nghiêm trọng; chờ tôi duyệt.
```
:::

## 14.6. Dịch vụ AI trung gian: tiện nhưng phải cân nhắc dữ liệu

Dịch vụ AI trung gian là bên bán lại quyền gọi các mô hình AI, thường dùng chung giao thức với OpenAI, chỉ khác địa chỉ. Có giai đoạn tôi mua khóa của một dịch vụ như vậy vì giá rẻ, thanh toán dễ, gọi được nhiều mô hình qua một cửa. Mã gốc của bot gọi cứng địa chỉ của OpenAI, nên tác tử AI thêm biến `AI_BASE_URL` để đổi địa chỉ gọi; cấu hình chỉ cần bốn biến.

Về kỹ thuật, đó là vài dòng mã; về quản trị, đó là ba cái giá. **Dữ liệu đi qua người thứ ba**: mọi câu hỏi và số liệu nạp kèm (họ tên, chức vụ, điểm, xếp loại cán bộ, lịch công tác của lãnh đạo) đi qua máy chủ của một bên mà cơ quan không có hợp đồng, không rõ chính sách lưu trữ; như nhờ người quen chuyển hộ hồ sơ, nhanh và rẻ, nhưng không ai cam kết hồ sơ không bị mở ra xem. **Tốc độ**: bên trung gian trả lời chậm là gốc của chuỗi sự cố ở mục 14.5. **Khó biết mình đang dùng gì**: vì vậy `/trangthai` hiện tên miền đang gọi và tên mô hình, không bao giờ hiện khóa.

Muốn biết loại dữ liệu nào được đi qua đường nào, tôi dùng lại phân loại dữ liệu 4 cấp của Tập 1 (mục 7.1–7.2), kèm nguyên tắc "khi không chắc chắn, chọn cấp cao hơn".

| Cấp dữ liệu (Tập 1, mục 7.2) | Ví dụ trong bot | Đi qua dịch vụ trung gian? |
|---|---|---|
| Cấp 1 — Công khai | Văn bản đã công bố, dữ liệu mô phỏng | Chấp nhận được ở bản demo, có ghi rõ |
| Cấp 2 — Nội bộ | Tên tài liệu, tiến độ việc nội bộ | Không; chỉ AI có cam kết doanh nghiệp, sau khi ẩn danh |
| Cấp 3 — Hạn chế tiếp cận | Điểm, xếp loại, hồ sơ, danh bạ cán bộ; kiến nghị có tên cử tri | Không; chỉ AI đặt máy chủ tại Việt Nam hoặc tự vận hành |
| Cấp 4 — Bí mật nhà nước | Tài liệu mật | Tuyệt đối không; không soạn, không lưu trên thiết bị nối Internet |

Đối chiếu bảng này, phần lớn số liệu của bot là mô phỏng nên tạm chấp nhận được. Ngoại lệ là danh bạ: một khi Quản trị đã nạp, đó là số điện thoại thật, thuộc Cấp 3, nên việc lọc ở khâu gom (mục 14.4.3) và đổi đường đi của dữ liệu phải làm trước khi mở rộng người dùng. Điểm, xếp loại cán bộ thật cũng ở Cấp 3; khi đó cả dịch vụ trung gian lẫn khóa của nhà cung cấp gốc ở nước ngoài đều không đủ điều kiện.

::: {.phaply}
**Căn cứ pháp lý**

- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ hướng dẫn công chức, viên chức dùng chatbot AI: không đưa lên chatbot AI dữ liệu, tài liệu thuộc danh mục bí mật nhà nước, thông tin nhạy cảm như dữ liệu cá nhân, tài liệu nội bộ; công chức chịu trách nhiệm về hành vi của mình khi dùng AI.
- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực 01/3/2026, thay thế Luật Bảo vệ bí mật nhà nước năm 2018): khoản 10 Điều 5 cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước; Điều 5 cũng cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu.
- Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Đưa bot vào phục vụ cán bộ thì cơ quan ở vị trí bên triển khai (Chương 3, mục 3.2).
:::

Kể cả chỉ dùng cho dữ liệu Cấp 1, trước khi gắn bó lâu dài với một dịch vụ trung gian, tôi đề nghị hỏi họ bằng văn bản năm điều: câu hỏi và câu trả lời có được lưu không, lưu bao lâu, ở đâu; có dùng để huấn luyện mô hình không; ai bên họ đọc được nhật ký; họ chuyển yêu cầu tới nhà cung cấp gốc nào; chấm dứt dịch vụ thì dữ liệu được xóa thế nào. Không có trả lời rõ bằng văn bản thì coi như câu trả lời là "không". Chương 19, mục 19.3 bàn tiếp chuyện này ở góc độ an toàn.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Bot chat đưa số liệu đến tay nhanh hơn, nhưng mỗi kênh mới là một cửa mới cho dữ liệu. Lãnh đạo cần quyết ba điều: ai được đăng ký, ai được nghe dữ liệu nhân sự, dữ liệu được gửi tới nhà cung cấp AI nào.
- Zalo OA là thủ tục và chi phí của cơ quan (lập OA, xác thực, gói dịch vụ), không phải việc riêng của người làm phần mềm.
- Bản demo chủ yếu dùng dữ liệu mô phỏng nên tạm chấp nhận dịch vụ trung gian; riêng danh bạ là số thật, phải xử lý trước. Khi đưa dữ liệu thật về điểm, xếp loại cán bộ (Cấp 3 theo Tập 1, mục 7.2), phải chuyển sang AI đặt máy chủ tại Việt Nam hoặc tự vận hành, đồng thời đánh giá tác động xử lý dữ liệu cá nhân (Chương 20, mục 20.2).
:::

## Tóm tắt chương 14

::: {.tomtat}
1. Bot chat đưa số liệu đến ứng dụng nhắn tin mà cán bộ, đại biểu vẫn dùng; bot chỉ đọc, không thay phần mềm, không phê duyệt thay ai.
2. Telegram là lối vào ít thủ tục nhất; Zalo không cho lập bot trên tài khoản cá nhân, phải có Official Account với thủ tục và gói dịch vụ riêng.
3. Bộ não dùng chung ghép hiểu biết tĩnh, số liệu thật đọc lúc hỏi và AI diễn đạt; một con số chỉ một nơi tính; `/solieu` không tốn phí AI và giúp phân biệt lỗi dữ liệu với lỗi AI.
4. Ai cũng nhắn được nhưng phải được duyệt; hạn mức 30 câu mỗi ngày theo giờ Việt Nam; dữ liệu nhân sự chỉ cho Quản trị; người dùng Zalo không bao giờ là Quản trị.
5. Hệ thống ngoài được đọc qua cửa chỉ đọc có trần chờ; không lấy được dữ liệu thì nói cho AI biết vì sao để nó không đoán.
6. Ranh giới riêng tư vạch ở khâu gom số liệu: không đưa vào chắc hơn dặn đừng nói.
7. Nền tảng nhắn tin "không chắc thì gửi lại": vào sổ mỗi tin một lần bằng thao tác nguyên tử, đặt trần thời gian nhỏ hơn trần của nền tảng, đo thời gian thay vì đoán.
8. Dịch vụ AI trung gian là quyết định về dữ liệu, không chỉ về giá: theo 4 cấp của Tập 1, chỉ dữ liệu Cấp 1 mới tạm đi qua.
:::

## Câu hỏi suy ngẫm và bài tập

1. Liệt kê năm câu hỏi về số liệu mà lãnh đạo phòng, Ban của đồng chí hay hỏi. Xếp mỗi câu vào một trong bốn cấp dữ liệu của Tập 1, mục 7.2; câu nào đụng tới dữ liệu cá nhân? Phân vân thì chọn cấp cao hơn.
2. Viết bộ từ khóa kích hoạt cho các câu ở bài 1 rồi thử với mười câu hỏi đời thường. Có câu nào khớp nhầm kiểu "xem" chứa "xe" không?
3. Giải thích cho một đồng nghiệp vì sao bot Zalo từng trả lời hai lần một câu hỏi, chỉ bằng ví dụ ở cơ quan, không dùng thuật ngữ kỹ thuật.
4. Lập bảng "ai hỏi thì được nghe đến đâu" cho một bot của Ban đồng chí, theo mẫu mục 14.4.3.
5. Đóng vai lãnh đạo: đồng chí cần thấy những gì trên giấy trước khi cho phép bot đọc điểm đánh giá thật của cán bộ?
