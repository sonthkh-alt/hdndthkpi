# Chương 14. Trợ lý chat qua Zalo, Telegram: đưa số liệu đến tận tay

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu vì sao nên đưa số liệu của hệ thống lên ứng dụng nhắn tin, và vì sao muốn có bot trên Zalo thì phải lập Zalo Official Account chứ không dùng tài khoản cá nhân.
- Nắm cấu trúc "bộ não" dùng chung của bot: hiểu biết tĩnh, số liệu thật đọc từ cơ sở dữ liệu, AI diễn đạt; biết những lệnh nhanh không tốn phí AI.
- Biết cách mở bot cho mọi người mà vẫn kiểm soát được: đăng ký, chờ duyệt, hạn mức câu hỏi, dữ liệu nhân sự chỉ dành cho Quản trị.
- Hiểu sự cố trả lời lặp, cách chốt "mỗi tin chỉ xử lý một lần", cách đặt trần thời gian và đo thời gian thay vì đoán.
- Cân nhắc đúng khi dùng dịch vụ AI trung gian: tiện và rẻ, nhưng dữ liệu đi qua máy chủ của bên thứ ba.

Dành cho: cán bộ muốn tự làm một trợ lý chat cho phòng, Ban của mình; người quản trị hệ thống; lãnh đạo cần quyết định ai được hỏi gì qua kênh nhắn tin.
:::

Có một câu hỏi tôi nghe nhiều lần trong năm 2026, ở hành lang, trong xe đi công tác, trước giờ giao ban: "Tháng này còn ai chưa được phê duyệt?", "Tuần sau Thường trực có lịch gì?", "Xã nào chưa gửi phiếu tự đánh giá?". Câu trả lời đều đã nằm sẵn trong hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, địa chỉ hdndthkpi.vercel.app. Nhưng để lấy được, người hỏi phải mở máy tính, nhớ đường dẫn, đăng nhập, bấm vào đúng phân hệ, đúng tab.

Chương này kể lại cách tôi cùng tác tử AI lập trình đưa những con số ấy đến thẳng ứng dụng nhắn tin mà cán bộ, đại biểu vẫn dùng mỗi ngày. Trình tự như sau: vì sao chọn Telegram và Zalo; "bộ não" dùng chung của bot; cách mở cho nhiều người mà vẫn giữ được kỷ cương; đọc dữ liệu của nhiều hệ thống và ranh giới riêng tư; một sự cố vận hành đáng nhớ nhất; và câu chuyện dịch vụ AI trung gian. Chương 13 đã nói về khung chat Người hướng dẫn trên Trang chủ, nơi khách vô danh được hỏi AI ba lượt mỗi ngày. Bot ở chương này là kênh dành cho người đã đăng ký, có danh tính, có hạn mức rộng hơn và đọc được nhiều số liệu hơn.

## 14.1. Vì sao cần bot trên ứng dụng nhắn tin; vì sao Zalo cá nhân không lập được bot

### 14.1.1. Số liệu nằm trên web, người cần số liệu ở trên điện thoại

Phần mềm trên web giống một phòng lưu trữ ngăn nắp: hồ sơ đủ, xếp đúng chỗ, nhưng muốn xem thì phải đến tận nơi. Bot chat (chatbot) giống một chuyên viên trực điện thoại của phòng lưu trữ. Người hỏi chỉ cần gọi, nói điều mình cần; chuyên viên tự đi tra rồi đọc lại kết quả.

Tôi thấy bot có ích ở bốn chỗ:

1. **Hỏi bằng lời, không cần nhớ đường đi.** Người hỏi không cần biết điểm OKR/KPI nằm ở `#/okr`, lịch công tác nằm ở một hệ thống khác. Họ chỉ cần gõ câu hỏi.
2. **Hỏi nối tiếp được.** Bot nhớ mười lượt trao đổi gần nhất, nên có thể hỏi tiếp "còn đồng chí đó thì sao?" mà không phải nhắc lại từ đầu.
3. **Gom nhiều nguồn vào một câu trả lời.** Một câu hỏi có thể cần cả số liệu đánh giá cán bộ lẫn lịch công tác. Trên web phải mở hai nơi; bot đọc cả hai.
4. **Trả lời cả việc ngoài hệ thống.** Bot dùng AI để diễn đạt nên cũng soạn được một đoạn thông báo, giải thích một khái niệm. Lời nhắc hệ thống buộc bot nói rõ khi câu trả lời không dựa trên số liệu của hệ thống.

Bot cũng có những giới hạn phải nói ngay từ đầu. Bot **chỉ đọc**, không ghi, không sửa, không phê duyệt thay ai. Bot không thay phần mềm: đây vẫn là bản demo thử nghiệm, số liệu cần đối chiếu lại trên web trước khi dùng vào việc chính thức. Và bot không được biết những gì người hỏi không có quyền biết.

### 14.1.2. Telegram: lối vào dễ nhất để bắt đầu

Bot đầu tiên của hệ thống chạy trên Telegram, trước mốc ngày 13/8/2026. Tôi chọn Telegram để bắt đầu vì đó là lối vào ít thủ tục nhất. Theo tài liệu cài đặt của dự án (`docs/BOT-CHAT.md`), phần Telegram làm trong khoảng mười phút:

1. Nhắn cho tài khoản **@BotFather** lệnh `/newbot`, đặt tên hiển thị và tên người dùng kết thúc bằng chữ `bot`. BotFather trả về một **mã bot (token)**, phải giữ kín như mật khẩu.
2. Lấy dãy số định danh (ID) Telegram của người sẽ làm Quản trị.
3. Khai mã bot, ID Quản trị, khóa AI, khóa cơ sở dữ liệu vào phần biến môi trường trên Vercel.
4. Mở một đường dẫn đặc biệt một lần để "đăng ký địa chỉ nhận tin" (webhook) với Telegram.

Địa chỉ nhận tin có thể hình dung như chuông cửa. Mỗi khi có người nhắn cho bot, máy chủ Telegram bấm chuông ở cửa `https://hdndthkpi.vercel.app/api/telegram`; phòng làm việc phía sau (hàm máy chủ trên Vercel) mở cửa, đọc tin, soạn trả lời. Telegram còn cho gắn một chuỗi bí mật vào mỗi lần bấm chuông, nên hàm máy chủ nhận ra đâu là Telegram thật, đâu là người lạ gõ cửa.

Một chi tiết nhỏ cho thấy cách làm phần mềm cho người không chuyên. Nếu chưa khai ID Quản trị, bot không im lặng mà nhắn lại cho người vừa gửi tin: "ID Telegram của đồng chí là: …, hãy đặt vào biến môi trường rồi triển khai lại". Người cài đặt không phải đi tìm công cụ tra ID ở đâu khác.

Telegram có những ưu điểm rõ: không cần xác thực tổ chức, không có gói phí, có nút bấm ngay trong tin nhắn, có chuỗi bí mật cho địa chỉ nhận tin. Giới hạn chính là mỗi tin tối đa 4.096 ký tự, câu trả lời dài phải tự cắt thành nhiều tin. Nhược điểm lớn nhất không nằm ở kỹ thuật: ở Việt Nam, cán bộ quen dùng Zalo hơn.

### 14.1.3. Zalo: phải có Official Account

Khi tôi giao việc làm bot cho tác tử AI, yêu cầu ban đầu ghi cả Zalo lẫn Telegram. Tác tử báo lại một điều mà sau này tôi kiểm chứng được qua tài liệu của Zalo: **Zalo không cho lập bot trên tài khoản cá nhân**. Muốn có bot phải lập **Official Account (OA)**, loại tài khoản mà Zalo mô tả là "tài khoản chính thức của Doanh nghiệp, Media và Cơ quan nhà nước". OA của Văn phòng mang tên "VP Đoàn ĐBQH và HĐND tỉnh Thanh Hóa".

Lập OA là thủ tục của cơ quan, không phải việc lập trình. Tài liệu cài đặt của dự án chia thành năm bước: lập OA và chờ Zalo xét duyệt, xác thực; tạo ứng dụng trên trang dành cho nhà phát triển rồi gắn OA vào; khai ba biến môi trường; xin quyền OA một lần để lấy mã thông báo; khai địa chỉ nhận tin. Theo các nguồn tôi tra được, hồ sơ xác thực OA được xét trong khoảng 2–3 ngày làm việc; tôi chưa tìm thấy quy trình hay ưu đãi riêng cho cơ quan hành chính nhà nước, nên cơ quan cần hỏi trực tiếp Zalo.

Phần kỹ thuật của Zalo cũng có "quy chế văn thư" riêng, mỗi điều đều từng làm tôi mất công:

| Quy định của Zalo | Hệ quả nếu không biết | Cách dự án xử lý |
|---|---|---|
| Mã thông báo sống khoảng 1 giờ | Bot im lặng sau một giờ | Tự làm mới trước khi hết hạn |
| Mã làm mới chỉ dùng một lần | Lần làm mới sau bị hỏng | Lưu ngay mã mới vào kho |
| Phải xác thực tên miền bằng tệp | Báo lỗi -14003 | Đặt tệp xác minh vào thư mục công khai |
| Địa chỉ nhận tin không được kèm tham số | "Đường dẫn webhook không hợp lệ" | Nhận diện gói tin bằng mã ứng dụng |

Ví von cho dễ nhớ: mã thông báo của Zalo như thẻ ra vào có hạn một giờ; mỗi lần đổi thẻ, phòng bảo vệ thu thẻ cũ và phát một phiếu đổi thẻ mới, làm mất phiếu là phải làm lại thủ tục từ đầu. Việc xin quyền lần đầu dùng một kỹ thuật bảo mật có tên PKCE, đại ý là tạo một cặp "mã hỏi, mã đáp" để kẻ nhặt được giấy ủy quyền giữa đường cũng không dùng được.

::: {.canhbao}
**Cảnh báo: chi phí và thời hạn trả lời của Zalo OA**

Từ ngày 01/6/2026, Zalo áp dụng bốn gói dịch vụ mới cho OA. Theo thông báo của Zalo và bảng giá do các nguồn thứ ba tổng hợp, gói Cơ bản miễn phí nhưng không có chatbot và giao diện lập trình (API); gói Tăng trưởng có chatbot và API, giá khoảng 1.400.000 đồng/6 tháng hoặc 2.500.000 đồng/năm. Đây là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi; cơ quan phải đối chiếu bảng giá chính thức của Zalo trước khi dự trù kinh phí.

Ngoài ra, OA chỉ được gửi tin tư vấn trong một khoảng thời gian nhất định sau lần tương tác cuối của người dùng (tài liệu của Zalo tại thời điểm viết ghi 7 ngày). Bot chỉ trả lời khi được hỏi nên thường không vướng, nhưng đừng thiết kế bot "chủ động nhắn" kiểu thông báo hằng ngày nếu chưa tìm hiểu kỹ loại tin và phí của Zalo.
:::

Telegram và Zalo vì vậy bổ sung cho nhau. Telegram làm "phòng thí nghiệm" và kênh của Quản trị; Zalo là kênh quen thuộc với số đông. Điều quan trọng là cả hai dùng chung một bộ não và một sổ đăng ký người dùng, nên sửa một chỗ thì hai kênh cùng được hưởng.

::: {.lenhmau}
**Câu lệnh mẫu 14.1 — Dựng bot Telegram tối thiểu, chỉ đọc**

```text
[VAI] Lập trình viên cẩn trọng của dự án này. Tôi không chuyên lập trình;
giải thích mọi bước cấu hình bằng lời dễ hiểu.

[BỐI CẢNH] Hệ thống đã chạy trên Vercel, dữ liệu ở Supabase. Tôi muốn cán
bộ hỏi số liệu qua Telegram. Bot CHỈ ĐỌC, không ghi dữ liệu nào.

[VIỆC] Tạo hàm máy chủ api/telegram.js: (1) GET hiện tình trạng bot;
(2) GET ?setup=<chuỗi bí mật> tự đăng ký webhook; (3) POST nhận tin,
kiểm tra tiêu đề bí mật của Telegram, trả lời lệnh /help.

[DẠNG] Kèm hướng dẫn cài đặt từng bước bằng tiếng Việt trong docs/.

[RÀNG BUỘC] Khóa bí mật chỉ ở biến môi trường máy chủ, KHÔNG có tiền tố
VITE_. Luôn trả mã 200 cho Telegram. Tin dài quá 4.096 ký tự thì cắt theo
dòng. Chưa khai ID Quản trị thì nhắn lại ID của người gửi.

[NGHIỆM THU] Mở đường dẫn ?setup= thấy "ok": true; nhắn /help nhận đúng
bảng hướng dẫn; gọi POST không có tiêu đề bí mật thì bị từ chối; có phép
kiểm cho tin dài đúng bằng giới hạn và giới hạn cộng một.
```
:::

## 14.2. "Bộ não" dùng chung: hiểu biết tĩnh, số liệu thật, AI diễn đạt

### 14.2.1. Ba tầng của một câu trả lời

Hãy hình dung một thư ký tổng hợp giỏi được hỏi: "Phòng nào có điểm trung bình cao nhất tháng này?". Người thư ký ấy làm ba việc. Mở sổ tay nghiệp vụ để nhớ điểm được tính thế nào. Ra kho lấy đúng tập bảng điểm của kỳ đang hỏi. Rồi viết câu trả lời ngắn gọn, đúng mực. Bộ não của bot (tệp `api/_lib/brain.js`) làm đúng ba việc đó.

| Tầng | Ví như | Tệp trong dự án | Nội dung |
|---|---|---|---|
| Hiểu biết tĩnh | Sổ tay nghiệp vụ | `knowledge.js` | Các phân hệ, cách tính điểm, phân quyền, mốc thời gian |
| Số liệu thật | Tập hồ sơ vừa lấy từ kho | `facts.js` | Đọc thẳng cơ sở dữ liệu lúc hỏi |
| AI diễn đạt | Người viết lại cho dễ đọc | `ai.js` | Ghép ba phần, gọi AI, trả câu trả lời |

Mỗi lượt hỏi, bộ não ghép một **lời nhắc hệ thống (system prompt)** gồm: quy tắc ứng xử, hiểu biết tĩnh, số liệu vừa đọc kèm thời điểm đọc, và một dòng cho biết người hỏi là Quản trị hay người dùng thường. Sau đó mới gửi cho AI cùng vài lượt hội thoại gần nhất. AI không "biết" số liệu của Văn phòng; nó chỉ đọc lại những gì vừa được đặt trước mặt.

Cách làm này có hai cái lợi. Số liệu luôn mới, vì đọc tại thời điểm hỏi. Và khi bot nói sai, người sửa biết phải tìm ở đâu: sai quy tắc tính thì sửa sổ tay; sai con số thì kiểm tra kho; diễn đạt lủng củng thì chỉnh lời nhắc.

### 14.2.2. Mang đúng tập hồ sơ, không bê cả tủ

Bộ gom số liệu không nạp mọi thứ cho mọi câu hỏi. Nó dò từ khóa trong câu hỏi để chọn tập hồ sơ: có chữ "lịch", "họp", "ngày mai" thì nạp lịch công tác; có "biểu quyết", "nghị quyết", "kỳ họp" thì nạp kết quả biểu quyết; có "xã", "phường", "tiêu chí" thì nạp Tiêu chí HĐND; không khớp nhóm nào thì mặc định nạp kỳ đánh giá cán bộ. Nạp ít thì lời nhắc ngắn, AI trả lời nhanh hơn và rẻ hơn.

Điều tôi coi trọng nhất ở tầng này là nguyên tắc **"một con số, một nơi tính"**. Bot không được tự tính lại điểm cán bộ bằng một công thức riêng, vì sớm muộn bot sẽ nói một số, màn hình hiện một số khác. Dự án giải bằng hai cách. Với phân hệ OKR/KPI và Kiểm điểm, mỗi lần lưu, giao diện ghi kèm bảng điểm **đã tính sẵn**; bot chỉ việc đọc. Bản lưu cũ chưa có bảng này thì bot nhắc người dùng mở phần mềm bấm "Lưu ngay". Với Tiêu chí HĐND và Biểu quyết Online, bot tính lại tại chỗ bằng **chính tệp logic** mà giao diện dùng, kể cả việc áp trần 25% Xuất sắc cấp xã.

Tầng này cũng là nơi lộ ra hệ quả dây chuyền đáng nhớ. Ngày 13/8/2026, khi tách kho dữ liệu cho mỗi phân hệ, bản ghi của phân hệ Kiểm điểm đổi tên thành dạng `state_kiemdiem_…`. Bot dò tên bản ghi bằng một mẫu cũ chỉ nhận dạng `state_<năm>_<tháng>`, nên **mất hẳn phân hệ Kiểm điểm** mà không báo lỗi gì. Sau lần đó, bot được dạy đọc cả hai phân hệ, tự quy đổi tháng ra quý cho Kiểm điểm, và quy tắc "rà soát chức năng liên quan" (Chương 7) ghi đích danh: đổi khóa hay định dạng dữ liệu thì phải kiểm bot chat.

Khi đọc lại mã để viết chương này, tôi thấy thêm một chỗ đáng nói. Từ khóa "xe" (để hỏi chuyện điều xe) được dò theo kiểu chuỗi con, nên câu "cho tôi xem điểm tháng này" cũng khớp, vì "xem" chứa "xe". Hệ quả nhẹ: lượt đó nạp thừa lịch công tác, lời nhắc dài hơn, tốn thêm chút thời gian và phí. Đó vẫn là cái bẫy chuỗi con của tiếng Việt kể ở Chương 15, lần này ở dạng vô hại. Nó nhắc tôi rằng cách dò từ khóa nào cũng nên được kiểm bằng những câu hỏi đời thường.

### 14.2.3. Tám quy tắc trong lời nhắc hệ thống

Lời nhắc hệ thống của bot có tám quy tắc. Tôi tóm lại bằng lời thường:

1. Trả lời tiếng Việt có dấu, ngắn gọn, hợp khung chat: gạch đầu dòng, không bảng rộng.
2. Số liệu chỉ lấy trong phần "SỐ LIỆU HỆ THỐNG"; không có thì nói thẳng là chưa có và chỉ đường dẫn.
3. Câu hỏi về cách dùng, cách tính thì dựa vào phần hiểu biết tĩnh.
4. Câu hỏi ngoài hệ thống thì được trả lời, nhưng phải nói rõ đó không phải số liệu của hệ thống.
5. Luôn nhắc đây là bản demo thử nghiệm khi người hỏi định dùng vào việc chính thức.
6. Không bao giờ cung cấp mật khẩu, mã truy cập, số căn cước, số bảo hiểm xã hội, thông tin gia đình.
7. Hỏi đích danh một người, một Ban, một đơn vị thì chỉ dùng dòng ghi đúng tên đó; không thấy thì nói "không có mục nào", tuyệt đối không thay bằng người khác.
8. Trả lời dưới 200 từ, trừ khi được yêu cầu chi tiết.

Quy tắc thứ bảy ra đời từ thói quen "chiều lòng người hỏi" của AI: không tìm thấy đúng người, nó dễ lấy tạm dòng gần giống nhất. Với số liệu về con người, trả lời nhầm người còn tệ hơn không trả lời.

### 14.2.4. Bốn lệnh nhanh không tốn phí AI

| Lệnh | Việc làm | Có gọi AI không |
|---|---|---|
| `/help` | Bảng hướng dẫn và câu hỏi mẫu | Không |
| `/solieu` | Đọc thẳng số liệu các phân hệ, in nguyên văn | Không |
| `/quen` | Xóa ngữ cảnh, hỏi lại từ đầu | Không |
| `/trangthai` | Kiểm tra kết nối cơ sở dữ liệu, AI, các hệ thống ngoài | Không |

Lệnh `/solieu` là công cụ chẩn đoán tôi dùng nhiều nhất. Khi bot trả lời một con số lạ, tôi gõ `/solieu`. Nếu số trong kho cũng lạ, lỗi nằm ở dữ liệu; nếu số trong kho đúng mà câu trả lời sai, lỗi nằm ở khâu AI diễn đạt. Như hỏi thẳng thủ kho trước khi trách người viết báo cáo. Các lệnh bắt đầu bằng dấu `/` không tính vào hạn mức câu hỏi hằng ngày, vì chúng không tốn tiền AI.

Bot nhớ mười lượt gần nhất của mỗi cuộc trò chuyện và quên sau hai ngày im lặng. Trí nhớ này nằm trong cơ sở dữ liệu, vì hàm máy chủ kiểu "không máy chủ thường trực" (serverless) mỗi lần gọi là một tiến trình mới, không nhớ gì từ lần trước.

::: {.vidu}
**Ví dụ minh họa: một lượt hỏi đi qua bộ não**

Hãy hình dung một đồng chí lãnh đạo Ban nhắn: "Tuần này còn mục lịch nào chờ duyệt không?". Bộ gom số liệu thấy chữ "lịch", "tuần", "chờ duyệt" nên chỉ nạp lịch công tác hai tuần. Lời nhắc hệ thống ghi người hỏi là người dùng thường. AI đọc danh sách, trả lời bằng ba gạch đầu dòng, mỗi dòng có ngày, buổi, nội dung, trạng thái. Đồng chí hỏi tiếp "mục thứ hai đi xe nào?"; bot dựa vào ngữ cảnh lượt trước để hiểu "mục thứ hai" là gì. Nếu kho lịch chưa được cấu hình, bot nói thẳng là chưa đọc được lịch và đưa đường dẫn để tự mở.
:::

### 14.2.5. Nếu đồng chí muốn làm phiên bản nhỏ hơn

Không cần dựng ngay một bộ não đọc năm nguồn. Một phòng, một Ban hoàn toàn có thể bắt đầu ở Bậc 2–3 của thang kiến tạo (Chương 2).

::: {.thuchanh}
**Thực hành: bot của một phòng trong ba buổi**

1. **Buổi 1 — bot không có AI.** Dùng Câu lệnh mẫu 14.1 dựng bot Telegram chỉ có `/help` và `/solieu`. Nguồn số liệu là một bảng tính Google Sheet công khai chứa dữ liệu XANH (danh mục văn bản đã ban hành, tiến độ các việc đã công khai). Lệnh `/solieu` đọc bảng rồi in ra.
2. **Buổi 2 — thêm AI.** Thêm bộ nối AI với một khóa duy nhất, lời nhắc hệ thống có các quy tắc 2, 4, 6, 7 ở mục 14.2.3. Đặt hạn mức thấp ngay từ đầu, ví dụ 10 câu mỗi người mỗi ngày.
3. **Buổi 3 — thêm kỷ cương.** Thêm đăng ký và duyệt (mục 14.3), trang tình trạng, và một bộ phép kiểm cho các câu hỏi đời thường của phòng.
4. Ghi lại mọi quyết định vào bộ nhớ dự án và nhật ký thay đổi (Chương 7).
:::

::: {.lenhmau}
**Câu lệnh mẫu 14.2 — Thêm một nguồn số liệu vào bộ não của bot**

```text
CHƯA SỬA TỆP NÀO. Tôi muốn bot trả lời được câu hỏi về [tên nguồn, ví dụ:
tiến độ trả lời kiến nghị cử tri]. Dữ liệu nằm ở [vị trí].
Trình phương án gồm:
1. Hàm đọc dữ liệu (chỉ đọc) và hàm định dạng THUẦN, không gọi mạng, để
   kiểm thử bằng Node.
2. Bộ từ khóa kích hoạt; liệt kê câu hỏi đời thường dễ khớp nhầm (chuỗi
   con, có dấu và không dấu).
3. Ai được nghe nguồn này: Quản trị, người dùng đã duyệt, khách vô danh.
   Trường nào TUYỆT ĐỐI không đưa vào lời nhắc.
4. Con số nào bot tự tính, con số nào phải dùng lại hàm tính của giao diện.
5. Những chỗ phải sửa theo: hiểu biết tĩnh của bot, lệnh /solieu,
   /trangthai, tài liệu hướng dẫn.
Chờ tôi duyệt rồi mới làm. Nghiệm thu: phép kiểm cho định dạng, cho phân
quyền, cho ít nhất 5 câu hỏi mẫu; build xanh.
```
:::
