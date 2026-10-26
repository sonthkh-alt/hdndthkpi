# Chương 19. An toàn, dữ liệu và chi phí: rủi ro thật, cách phòng thật

::: {.muctieu}
**Mục tiêu của chương**

- Nhận diện ba loại rủi ro có thật khi cán bộ tự làm ứng dụng cùng AI: lộ dữ liệu, mất dữ liệu và chi phí vượt kiểm soát.
- Biết những gì tuyệt đối không được nằm trong kho mã nguồn công khai, và dựng được ba lớp chặn: tệp `.env`, danh sách loại trừ `.gitignore`, phép kiểm tự động.
- Hiểu phân quyền ở tầng cơ sở dữ liệu qua hình ảnh "thẻ ra vào", biết thử quyền bằng cả vai khách lẫn vai quản trị.
- Vẽ được đường đi của dữ liệu khi gửi cho AI; lắp được các chốt chặn chi phí; chuẩn bị sẵn nhật ký chẩn đoán, sao lưu và cách khôi phục.
- Dùng được bảng kiểm an toàn trước khi chia sẻ một ứng dụng cho đồng nghiệp.

Dành cho: cán bộ đã hoặc sắp tự làm ứng dụng ở Bậc 2 trở lên; lãnh đạo cần biết nên hỏi gì trước khi cho một ứng dụng được dùng chung. Lãnh đạo nên đọc kỹ mục 19.3, 19.4 và các hộp "Dành cho lãnh đạo".
:::

Mỗi khi tác tử AI lập trình báo "đã xong", tôi tự hỏi: nếu sáng mai việc này lên mặt báo, tôi có ngủ yên không? Câu hỏi nghe nặng nề, nhưng nó giúp tôi nhìn ra những chỗ mà niềm vui "phần mềm chạy rồi" che khuất.

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi là Văn phòng), tại địa chỉ `https://hdndthkpi.vercel.app`, chạy trên các nền tảng ở gói miễn phí, có kho mã nguồn công khai, có bot trả lời qua Telegram và Zalo, có ba lối gọi AI tốn tiền thật. Trong năm 2026, nó đã trải qua đủ ba loại rủi ro mà chương này bàn: suýt lộ dữ liệu, suýt mất dữ liệu, và có lúc hạn mức bị "đốt" nhanh gấp đôi vì một lỗi không ai ngờ.

Tôi không viết chương này để dọa. Mọi rủi ro dưới đây đều có cách phòng cụ thể, phần lớn chỉ là vài dòng cấu hình, vài câu lệnh giao việc rõ ràng và một thói quen kiểm tra. Cái khó là nhớ làm, và làm trước khi sự cố xảy ra.

Xin giữ hình ảnh quen thuộc từ Chương 2: ứng dụng web như một trụ sở. Giao diện là phòng tiếp dân, máy chủ là các phòng làm việc phía sau, cơ sở dữ liệu là kho lưu trữ hồ sơ, mã nguồn là bộ bản vẽ thiết kế. Chương này hỏi ba câu về trụ sở ấy: bản vẽ có ghi gì không nên ghi; ai được quẹt thẻ vào kho hồ sơ; và hóa đơn điện nước có vòi nào chảy mà không ai khóa.

## 19.1. Kho mã công khai và những gì tuyệt đối không được nằm trong đó

### 19.1.1. Bản vẽ dán ở bảng tin ngoài cổng

Kho mã nguồn (repository) của hệ thống thử nghiệm để công khai trên GitHub. Tôi chọn như vậy vì gói miễn phí dùng tốt với kho công khai, và đồng nghiệp ở cơ quan khác học lại được. Nhưng công khai có giá. Hãy hình dung bộ bản vẽ trụ sở được dán ở bảng tin ngoài cổng. Không sao nếu bản vẽ chỉ có tường, cửa, cầu thang. Rất có sao nếu ai đó lỡ ghi lên đó mã số két sắt hay danh bạ điện thoại của lãnh đạo.

Người mới thường không biết hai điều. Thứ nhất, mọi thứ trang web gửi xuống trình duyệt cũng công khai: ai mở công cụ dành cho nhà phát triển của trình duyệt đều thấy toàn bộ mã giao diện đã tải về. Một bí mật viết trong mã giao diện thì không còn là bí mật, kể cả khi kho mã để riêng tư. Thứ hai, Git ghi lịch sử mọi lần sửa. Một tệp chứa khóa bí mật bị xóa ở lần sửa sau vẫn còn nguyên trong lịch sử. Bản vẽ đã dán lên bảng tin một đêm thì phải coi như người ta đã chụp ảnh.

### 19.1.2. Bốn nhóm thứ không bao giờ được vào kho mã

| Nhóm | Ví dụ | Cất ở đâu cho đúng |
|---|---|---|
| Khóa bí mật | Khóa API dịch vụ AI, khóa bí mật cơ sở dữ liệu, mã thông báo của bot | Biến môi trường trên máy chủ |
| Mật khẩu, mã truy cập | Mật khẩu quản trị, mã truy cập của đơn vị | Hệ thống đăng nhập; chỉ lưu chuỗi băm |
| Dữ liệu cá nhân thật | Danh bạ, hồ sơ lý lịch, bản tự đánh giá | Cơ sở dữ liệu có phân quyền |
| Tài liệu chưa công khai | Dự thảo chưa trình, tài liệu nội bộ, tài liệu mật | Không đưa vào hệ thống thử nghiệm |

Với nhóm cuối, tài liệu có độ mật không chỉ không được vào kho mã. Nó không được vào bất kỳ hệ thống nào chạy trên dịch vụ đám mây công cộng như Vercel, Supabase, GitHub. Đây là ranh giới pháp luật, không phải chuyện cẩn thận hay không (xem hộp Căn cứ pháp lý ở mục 19.3).

::: {.cauchuyen}
**Câu chuyện thực tế: danh bạ 111 mục và một tệp không bao giờ lên GitHub**

Khi làm danh bạ điện thoại cho phân hệ Quản lý cán bộ, tôi có trong tay tệp Word thật: 82 đại biểu Hội đồng nhân dân (HĐND) tỉnh và 29 cán bộ các Ban, Văn phòng. Cách nhanh nhất là bảo tác tử AI "nhúng danh sách này vào phần mềm". Nó sẽ làm ngay, và làm rất gọn.

Tôi chọn cách khác. Phần mềm chỉ chứa **bộ đọc** danh bạ: biết tách họ tên, chức vụ, số điện thoại từ tệp, nhưng không chứa một số nào. Quản trị tự nhập tệp từ máy mình, dữ liệu lưu vào dòng hồ sơ cán bộ trên máy chủ, nơi chỉ tài khoản quản trị đọc được. Tệp gốc bị danh sách loại trừ của Git chặn theo tên. Một phép kiểm tự động khẳng định "không có số điện thoại nào trong mã nguồn". Bộ đọc đã thử trên tệp thật, tách đủ 111 mục, đúng hai nhóm. Cái giá: Quản trị phải nhập một lần. Tôi coi đó là cái giá rẻ.
:::

### 19.1.3. Ba lớp chặn: tệp `.env`, danh sách loại trừ, phép kiểm

**Lớp thứ nhất: khóa nằm ở biến môi trường.** Biến môi trường (environment variable) giống phong bì niêm phong cất ở phòng làm việc phía sau. Mã nguồn chỉ ghi "lấy khóa trong phong bì tên là `OPENAI_API_KEY`", không ghi bản thân khóa. Trên máy cá nhân, phong bì nằm trong tệp `.env`; trên Vercel, chúng được khai trong phần cài đặt dự án. Kho mã chỉ có tệp `.env.example`: danh sách tên các phong bì kèm lời giải thích, giá trị để trống. Người nhận bàn giao đọc là biết cần khóa gì, lấy ở đâu, mà không thấy khóa thật nào.

Có một cái bẫy của công cụ dựng giao diện Vite: biến có tên bắt đầu bằng `VITE_` được **nhúng vào mã gửi xuống trình duyệt**, giống phong bì đóng dấu mà bưu điện photo phát cho mọi nhà. Dự án chỉ có hai biến mang tiền tố này: địa chỉ cơ sở dữ liệu và khóa công khai (anon key), vốn được thiết kế để lộ vì quyền thật do chính sách của cơ sở dữ liệu quyết định (mục 19.2). Mọi khóa bí mật khác chỉ được dùng trong các hàm máy chủ ở thư mục `api/`.

**Lớp thứ hai: danh sách loại trừ `.gitignore`**, tờ "không được mang ra khỏi phòng" mà Git đọc trước khi đóng gói. Tệp của dự án chặn `.env`, chặn mọi tệp có chữ "danh bạ" trong thư mục tài liệu, chặn thư mục hồ sơ đánh giá cá nhân dùng làm mẫu. Mỗi dòng chặn có chú thích tiếng Việt nói rõ vì sao, để người sau không "dọn" nhầm.

**Lớp thứ ba: phép kiểm tự động.** Quy tắc viết bằng lời thì có ngày quên; phép kiểm thì chạy mỗi lần. Dự án có phép kiểm dò mã nguồn tìm số điện thoại, phép kiểm khẳng định kiến thức tĩnh của bot không chứa mật khẩu, phép kiểm khẳng định danh sách loại trừ vẫn còn dòng chặn danh bạ.

::: {.canhbao}
**Cảnh báo: quy ước ghi ra giấy mà máy không thực thi**

Đọc lại kho mã khi viết sách, tôi thấy chính lỗi mình hay nhắc người khác. Quy ước dự án ghi "không commit thư mục `scratch/`" (thư mục nháp), nhưng `.gitignore` lại không chặn thư mục này. Một tệp thử nghiệm có ghi địa chỉ dự án cơ sở dữ liệu và khóa công khai đã nằm trong kho. Khóa công khai vốn để lộ nên chưa gây hại; nhưng nếu hôm đó tôi thử bằng khóa bí mật thì sao?

Tương tự, tài khoản trình diễn viết sẵn trong mã giao diện không còn là bí mật, dù màn đăng nhập không hiển thị nó. Bản demo chấp nhận điều này chỉ vì chế độ đó không ghi được lên máy chủ. Trước khi dùng thật: xóa tài khoản viết sẵn, đổi toàn bộ mật khẩu và khóa.
:::

::: {.thuchanh}
**Thực hành: khi lỡ đẩy một khóa bí mật lên kho mã**

1. Làm ngay, đừng mất thời gian tìm cách xóa dấu vết trước.
2. Vào trang quản trị của dịch vụ đã cấp khóa, **thu hồi khóa cũ và tạo khóa mới**. Khóa cũ vô hiệu thì người nhặt được cũng không dùng được.
3. Khai khóa mới vào biến môi trường trên Vercel và tệp `.env` của từng máy, rồi triển khai lại.
4. Xem nhật ký sử dụng của dịch vụ trong khoảng thời gian khóa bị lộ: có lượt gọi lạ, hóa đơn tăng bất thường không.
5. Thêm mẫu tên tệp vào `.gitignore`, thêm phép kiểm để lần sau máy tự chặn.
6. Ghi sự việc vào nhật ký dự án; báo lãnh đạo nếu khóa thuộc tài khoản của cơ quan.
:::

::: {.lenhmau}
**Câu lệnh mẫu 19.1 — Rà soát kho mã tìm thứ không được công khai**

```text
VAI: Kiểm tra viên an toàn thông tin của dự án [tên dự án].
BỐI CẢNH: Kho mã này để CÔNG KHAI. Mã giao diện tải xuống trình
duyệt cũng công khai.
VIỆC: Rà toàn bộ kho mã VÀ lịch sử commit, tìm:
1. Khóa API, khóa bí mật, mã thông báo, mật khẩu, mã truy cập.
2. Số điện thoại, số định danh, email cá nhân, họ tên đi kèm
   điểm số hoặc nhận xét về một người cụ thể.
3. Biến mang tiền tố VITE_ chứa thứ không nên lộ.
4. Tệp nội bộ, tệp nháp lẽ ra phải chặn; quy ước trong CLAUDE.md
   mà .gitignore chưa thực thi.
DẠNG: bảng: Vị trí (tệp, dòng, mã commit) – Loại – Mức độ – Đề xuất.
RÀNG BUỘC: CHỈ ĐỌC, không sửa, không commit. Không in nguyên giá
trị khóa hay số điện thoại, chỉ ghi 4 ký tự đầu.
NGHIỆM THU: nêu riêng mục nào cần đổi khóa ngay, rồi dừng chờ tôi.
```
:::

## 19.2. Phân quyền đọc, ghi ở tầng cơ sở dữ liệu

### 19.2.1. Thẻ ra vào: chính sách bảo mật theo dòng

Hãy hình dung kho lưu trữ có nhiều ngăn hồ sơ. Mỗi ngăn dán một tờ quy định: ai được quẹt thẻ mở ngăn để xem, ai được mở để sửa. Người bảo vệ đứng **ngay tại cửa kho**, đọc thẻ từng người, đối chiếu tờ quy định rồi mới mở. Biển chỉ dẫn ngoài hành lang có ghi "Phòng lưu trữ" hay không thì chẳng ảnh hưởng gì đến việc bảo vệ.

Chính sách bảo mật theo dòng (Row Level Security, viết tắt RLS) của cơ sở dữ liệu PostgreSQL mà Supabase cung cấp hoạt động đúng như vậy. Mỗi dòng dữ liệu là một ngăn hồ sơ, mỗi chính sách là một tờ quy định, "thẻ" là phiên đăng nhập. Hệ thống thử nghiệm dồn dữ liệu vào một bảng `app_state`; bản đồ quyền rút gọn như sau:

| Ngăn hồ sơ (dòng) | Ai được xem | Ai được ghi |
|---|---|---|
| Kỳ đánh giá cán bộ | Mọi người (mở cho demo) | Người đã đăng nhập |
| Hồ sơ cán bộ, danh bạ | Chỉ quản trị | Chỉ quản trị |
| Kiến nghị cử tri của Trợ lý AI | Người đã đăng nhập | Người đã đăng nhập |
| Tiêu chí HĐND, Biểu quyết | Mọi người | Quản trị; người khác qua "ô cửa hẹp" |
| Bộ đếm hạn mức AI | Chỉ máy chủ | Chỉ máy chủ |

Nguyên tắc rút ra: **quyền thật nằm ở cửa kho, không ở biển chỉ dẫn.** Giao diện ẩn hay hiện một nút chỉ giúp người dùng đỡ rối; ai đọc được gì là việc của chính sách trong cơ sở dữ liệu.

### 19.2.2. Ẩn một tab không phải là khóa cửa

Phân hệ Quản lý cán bộ chứa ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình. Tab này chỉ hiện với quản trị, và có thời gian tôi yên tâm vì "người khác có thấy đâu". Rà lại, tôi nhận ra chính sách chung cũ cho **mọi** tài khoản đã đăng nhập đọc **mọi** dòng. Một cán bộ có tài khoản, nếu gọi thẳng cửa giao dịch dữ liệu (API) mà không qua giao diện, vẫn đọc được hồ sơ. Biển chỉ dẫn đã gỡ, cửa kho vẫn mở.

Cái bẫy thứ hai tinh vi hơn: các chính sách RLS **cộng dồn theo kiểu "hoặc"**, chỉ cần một chính sách cho phép là được vào. Dán thêm tờ "Chỉ quản trị được vào" trong khi tờ "Mời mọi người đã đăng nhập" vẫn treo thì tờ mới vô tác dụng. Bước 4 của tệp lược đồ cơ sở dữ liệu vì thế **sửa chính sách chung cũ để loại riêng dòng hồ sơ cán bộ**, rồi mới thêm chính sách chỉ cho hai tài khoản quản trị. Ngay trong tệp có ghi chú: chưa chạy bước này thì hồ sơ không được bảo vệ trước tài khoản đăng nhập khác.

### 19.2.3. "Ô cửa hẹp" và chuỗi băm

Có lúc phải cho người không có tài khoản ghi dữ liệu: đại biểu bỏ phiếu ở phân hệ Biểu quyết; HĐND các xã, phường đăng nhập phân hệ Tiêu chí bằng mã đơn vị và mã truy cập. Mở quyền ghi chung thì ai cũng ghi đè được cả bảng kết quả.

Lời giải là "ô cửa hẹp": một hàm chạy trong cơ sở dữ liệu, mang quyền của chủ bảng nhưng chỉ làm **đúng một việc** và kiểm tra kỹ đầu vào. Hàm bỏ phiếu chỉ sửa một lá phiếu của một đại biểu trong một phiên đang mở, từ chối lựa chọn lạ, mã đại biểu sai dạng, phiên đã khóa. Hàm ghi phiếu tiêu chí chỉ ghi đúng phiếu của đơn vị có mã khớp. Hàm đếm lượt truy cập chỉ cộng thêm 1. Không giao chìa khóa kho cho khách, chỉ khoét một khe bỏ phiếu trên thùng phiếu.

Mã truy cập của xã, phường không lưu dạng chữ rõ, vì dòng tiêu chí đang mở cho mọi người xem. Hệ thống chỉ lưu **chuỗi băm** SHA-256 của "mã đơn vị::mã truy cập". Chuỗi băm giống dấu vân tay: xác nhận được đúng người, nhưng không dựng lại được bàn tay. Cùng cách đó, khóa đếm lượt AI của khách là chuỗi băm địa chỉ IP kèm thông tin trình duyệt; hệ thống không lưu IP gốc.

### 19.2.4. Mở cho demo thì phải viết sẵn cách đóng

Để khách và quản trị thấy cùng một bảng điểm, bước 6 của tệp lược đồ mở quyền **đọc**, không mở quyền ghi, cho các dòng kỳ đánh giá. Ngay dưới câu lệnh mở là dòng viết hoa: *"KHI CHUYỂN SANG DÙNG THẬT: xóa chính sách này"*, kèm sẵn câu lệnh gỡ. Mỗi quyết định "mở cho tiện trình diễn" phải đi kèm lối đóng viết ngay tại chỗ.

Ngược lại, có ngăn cố ý không bao giờ mở. Dòng kiến nghị cử tri của Trợ lý AI có tên người dân và địa bàn, nên khách vào sẽ thấy danh sách trống. Tệp lược đồ dặn người sau: đó là đúng thiết kế, đừng "sửa" bằng cách thêm quyền đọc công khai. Lời dặn ấy viết cho người, và cũng cho tác tử AI: nó đọc tệp, thấy lời dặn thì không tự ý "chữa" một điều vốn không phải lỗi.

::: {.phaply}
**Căn cứ pháp lý: dữ liệu cá nhân trong ứng dụng tự làm**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, thông qua ngày 26/6/2025, hiệu lực từ 01/01/2026, phân dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm.
- Nghị định 356/2025/NĐ-CP ngày 31/12/2025 quy định chi tiết Luật, hiệu lực 01/01/2026; theo khoản 2 Điều 42, Nghị định 13/2023/NĐ-CP hết hiệu lực từ ngày đó. Điều 3 liệt kê dữ liệu cơ bản, trong đó có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình. Khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tình trạng sức khỏe, dữ liệu về vi phạm pháp luật, tên đăng nhập và mật khẩu tài khoản định danh điện tử.
- Nghị định 330/2026/NĐ-CP ngày 19/8/2026, hiệu lực từ ngày ký, lần đầu quy định xử phạt riêng cho vi phạm về bảo vệ dữ liệu cá nhân; ví dụ, tự coi sự im lặng của chủ thể dữ liệu là đồng ý bị phạt từ 50 đến 70 triệu đồng.

Như vậy, danh bạ hay hồ sơ Mẫu 2C là dữ liệu cá nhân theo đúng nghĩa pháp luật. Việc xử phạt đối với cơ quan nhà nước còn theo pháp luật về xử lý vi phạm hành chính; cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi áp dụng.
:::

Pháp luật đổi nhanh thế nào? Tài liệu Đặc tả yêu cầu phần mềm của dự án, đề tháng 7/2026, còn nêu Nghị định 13/2023/NĐ-CP làm căn cứ, khi nghị định này đã hết hiệu lực được nửa năm. Mỗi tài liệu của dự án vì thế cần dòng "pháp luật đối chiếu đến ngày…" và cần được rà lại định kỳ.

### 19.2.5. Thử bằng cả vai khách và vai quản trị

Quy ước dự án có dòng bắt buộc: đổi quyền đọc, ghi thì xem lại chính sách và **thử cả vai khách lẫn vai quản trị**. Tôi mở rộng thành bốn vai, vì sự cố "khách và quản trị thấy hai danh sách cán bộ khác nhau" kể ở Chương 9 chỉ lộ ra khi tôi đăng nhập song song hai tài khoản để so.

::: {.thuchanh}
**Thực hành: ma trận thử quyền bốn vai**

1. Mở bốn cửa sổ trình duyệt, ít nhất hai cửa sổ ẩn danh: khách; cán bộ thường đã đăng nhập; quản trị; người dùng đặc biệt (đơn vị xã, phường hoặc đại biểu bỏ phiếu).
2. Với mỗi ngăn hồ sơ ở mục 19.2.1, ghi ra giấy vai nào phải thấy, không được thấy, được sửa.
3. Mở cùng một phân hệ ở bốn cửa sổ, so số người, số đơn vị, số liệu. Phần được xem phải giống nhau.
4. Ở vai khách và cán bộ thường, thử sửa, lưu. Phải bị từ chối, và giao diện phải báo rõ.
5. Nhờ tác tử AI kiểm tra phần mắt không thấy: gọi thẳng API bằng thẻ của từng vai (Câu lệnh mẫu 19.2).
6. Lưu kết quả thành bảng trong thư mục tài liệu; lần sau đổi quyền, chạy lại đúng bảng này.
:::

::: {.lenhmau}
**Câu lệnh mẫu 19.2 — Kiểm tra phân quyền theo vai, không đoán**

```text
VAI: Kiểm tra viên phân quyền của dự án [tên dự án].
BỐI CẢNH: Quyền được quy định bởi các chính sách RLS trong [tệp
lược đồ]. Có các vai: khách, cán bộ, quản trị, [vai đặc biệt].
VIỆC:
1. Lập bảng: từng dòng hoặc bảng dữ liệu, vai nào đọc, vai nào
   ghi được. Lưu ý chính sách cộng dồn kiểu "hoặc".
2. Chỉ ra mọi chỗ giao diện ẩn nút nhưng cơ sở dữ liệu vẫn cho phép.
3. Viết kịch bản thử đăng nhập bằng tài khoản thử của từng vai,
   gọi thẳng API đọc và ghi, ghi lại kết quả thật.
RÀNG BUỘC: không sửa chính sách, không dùng dữ liệu thật, không
dùng khóa bí mật bỏ qua RLS trong kịch bản thử của các vai.
NGHIỆM THU: bảng so "quyền dự kiến" với "kết quả chạy thật"; dòng
lệch tô đỏ kèm đề xuất sửa, chờ tôi duyệt.
```
:::

## 19.3. Khóa API, dịch vụ AI và dịch vụ trung gian: dữ liệu đi đâu khi gửi cho AI

### 19.3.1. Khóa API là chìa khóa kèm sổ séc đã ký sẵn

Mỗi lần ứng dụng gọi AI, nó đưa ra khóa API (API key) để chứng minh "tôi là khách hàng có tài khoản", và nhà cung cấp tính tiền vào tài khoản đó. Khóa API giống chìa khóa kèm một cuốn sổ séc đã ký sẵn: ai cầm được thì vừa mở được cửa, vừa chi được tiền của chủ tài khoản.

Khóa bí mật của cơ sở dữ liệu còn nặng hơn: nó **bỏ qua toàn bộ chính sách RLS** ở mục 19.2, như chìa khóa vạn năng của trưởng kho. Bot chat và bộ đếm hạn mức cần chìa khóa này, nên nó chỉ nằm ở máy chủ, không bao giờ mang tiền tố `VITE_`, không bao giờ được dán vào khung chat với AI để "nhờ xem giúp sao lỗi".

Năm quy tắc giữ khóa tôi áp dụng:

1. Khóa chỉ nằm ở biến môi trường của máy chủ và tệp `.env` trên máy cá nhân.
2. Mỗi ứng dụng một khóa riêng, để khi thu hồi không làm sập ứng dụng khác.
3. Nếu nhà cung cấp cho đặt hạn mức chi tiêu hằng tháng, đặt ngay từ ngày đầu, ở mức thấp.
4. Người rời dự án hoặc chuyển công tác thì thu hồi những khóa họ từng biết, đúng tinh thần hướng dẫn của Bộ Khoa học và Công nghệ về tài khoản chatbot của công chức (hộp Căn cứ pháp lý dưới đây).
5. Trang tình trạng của ứng dụng chỉ hiện **tên miền** dịch vụ AI và tên mô hình, không bao giờ hiện khóa. Lệnh `/trangthai` của bot Văn phòng làm đúng như vậy.

### 19.3.2. Vẽ đường đi của một câu hỏi

Người mới thường nghĩ: tôi hỏi, AI trả lời, thế thôi. Thực tế, một câu hỏi gửi cho bot của Văn phòng đi qua nhiều trạm, mỗi trạm là một nơi dữ liệu có thể được ghi lại. Hãy đi theo câu hỏi giả định "Tuần này lịch công tác của Thường trực có gì?":

1. Điện thoại của người hỏi gửi tin tới máy chủ của **Telegram** hoặc **Zalo**; nền tảng nhắn tin lưu tin theo chính sách của họ.
2. Nền tảng chuyển tin đến **hàm máy chủ trên Vercel** của Văn phòng.
3. Hàm máy chủ đọc **cơ sở dữ liệu** của hệ thống (Supabase, đặt ở khu vực Singapore) và của phân hệ Lịch công tác.
4. Hàm máy chủ ghép **lời dẫn** gồm hiểu biết tĩnh, số liệu vừa đọc, vài lượt hội thoại gần nhất, rồi gửi cho **nhà cung cấp AI**; nếu dùng **dịch vụ trung gian**, lời dẫn đi qua máy chủ của bên đó trước.
5. Câu trả lời đi ngược lại đúng con đường ấy.

Như vậy, câu hỏi về lịch của lãnh đạo, kèm số liệu nạp theo, đã đi qua ít nhất bốn tổ chức, phần lớn ở nước ngoài. Với dữ liệu mô phỏng của bản demo, đó là cái giá chấp nhận được. Với dữ liệu thật, mỗi trạm là một câu hỏi pháp lý: lưu bao lâu, có bị dùng huấn luyện mô hình không, có ra khỏi lãnh thổ Việt Nam không. Pháp luật về bảo vệ dữ liệu cá nhân có quy định riêng về chuyển dữ liệu cá nhân ra nước ngoài; trước khi đưa dữ liệu thật vào một đường đi như trên, phải hỏi đơn vị chuyên trách và tra nguyên văn.

Từ hình vẽ này, bot áp một nguyên tắc tôi cho là quan trọng nhất của chương: **không đưa vào lời dẫn chắc hơn dặn AI đừng nói ra.** Hồ sơ nhân sự chỉ được nạp khi người hỏi là quản trị; kể cả khi đó, số căn cước, số sổ bảo hiểm, quan hệ gia đình cũng không bao giờ được nạp. Người dùng Zalo không bao giờ được coi là quản trị. Danh bạ tắt mặc định ở khung chat khách vô danh trên Trang chủ. Lời dặn "đừng tiết lộ" trong lời nhắc hệ thống chỉ là lớp bảo vệ thứ hai.

::: {.lenhmau}
**Câu lệnh mẫu 19.3 — Lập bản đồ đường đi của dữ liệu**

```text
VAI: Chuyên viên an toàn dữ liệu của dự án [tên dự án].
VIỆC: Đọc mã nguồn, liệt kê MỌI nơi dữ liệu rời khỏi máy người
dùng (đăng nhập, lưu dữ liệu, gọi AI, bot chat, gửi tệp, gọi hệ
thống ngoài). Với từng luồng, lập bảng:
- Trạm đi qua (dịch vụ, tên miền, khu vực máy chủ nếu mã có ghi).
- Loại dữ liệu đi qua; dữ liệu cá nhân cơ bản hay nhạy cảm.
- Cách bớt dữ liệu gửi đi mà không mất chức năng.
RÀNG BUỘC: chỉ đọc mã, không sửa. Điều mã không thể hiện (chính
sách lưu trữ, vị trí máy chủ của nhà cung cấp) thì ghi "cần hỏi
nhà cung cấp", không đoán.
NGHIỆM THU: kết thúc bằng 3 đề xuất giảm dữ liệu gửi cho AI, xếp
theo mức giảm rủi ro.
```
:::

### 19.3.3. Dịch vụ trung gian: rẻ, tiện, và thêm một người thứ ba

Có giai đoạn tôi mua khóa của một dịch vụ trung gian "tương thích OpenAI": giá rẻ, thanh toán dễ, gọi được nhiều mô hình qua một cửa. Tác tử AI chỉ cần thêm biến `AI_BASE_URL` để đổi địa chỉ gọi; về kỹ thuật, việc này mất vài dòng.

Về dữ liệu, đó là quyết định khác hẳn. Mọi câu hỏi và số liệu nạp kèm, gồm họ tên, chức vụ, điểm, xếp loại cán bộ, lịch công tác của lãnh đạo, đều đi qua máy chủ của một bên mà tôi không có hợp đồng, không rõ chính sách lưu trữ và ghi nhật ký. Như gửi công văn qua một dịch vụ chuyển phát giá rẻ mà không biết ai bóc phong bì dọc đường.

Dự án xử lý theo ba hướng: vẫn hỗ trợ kỹ thuật nhưng ghi cảnh báo in đậm ở đầu tệp bộ nối AI và trong tài liệu cài bot; lệnh `/trangthai` hiện tên miền đang dùng để biết dữ liệu đi đâu; và khuyến nghị dứt khoát: dữ liệu thật thì dùng khóa của nhà cung cấp gốc theo hợp đồng của cơ quan, hoặc ít nhất hỏi rõ chính sách lưu trữ của bên trung gian. Dịch vụ trung gian còn có cái giá không ai quảng cáo: tốc độ. Chính nó trả lời chậm đã gây ra chuỗi sự cố trả lời lặp kể ở mục 19.5.

### 19.3.4. Tài khoản AI cá nhân: chỉnh cài đặt trước khi gõ chữ đầu tiên

Không phải ai cũng làm ứng dụng, nhưng hầu như ai cũng dùng trợ lý AI trò chuyện, và rủi ro nằm trong phần cài đặt ít người mở ra xem. Theo trang giá và thông báo cập nhật điều khoản của Anthropic mà tôi đọc ngày 26/10/2026, các gói cá nhân Free, Pro, Max của Claude để người dùng tự chọn có cho dùng dữ liệu huấn luyện mô hình hay không; gói Team và Enterprise mặc định không huấn luyện trên nội dung. Để bật thì dữ liệu được lưu 5 năm; tắt thì thời hạn lưu là 30 ngày. Mục cần tắt nằm trong phần cài đặt quyền riêng tư (Privacy); tên mục có thể khác đôi chút tùy phiên bản.

ChatGPT và Gemini cũng có mục tương tự, nhưng tên nút đổi theo từng đợt cập nhật nên tôi không ghi cố định. Thói quen đúng: **tạo tài khoản xong, việc đầu tiên là mở Cài đặt → Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt mục cho phép huấn luyện.** Tập 1 đã nhắc; Tập 2 nhắc lại vì giờ chúng ta còn dán cả mã nguồn, cả cấu trúc dữ liệu của cơ quan vào khung chat.

Với Sổ tay AI chạy trên Gemini Notebook (trước đây là NotebookLM), nguồn tải lên được lưu trên máy chủ của Google. Vì vậy Văn phòng chỉ nạp văn bản đã công khai và chia sẻ theo quyền chỉ xem. Kiểu liên kết "chỉ hiện khung chat", theo chính trang trợ giúp của Google, không thu hồi quyền truy cập vào nguồn: nó tiện, nhưng không phải cơ chế bảo mật.

::: {.phaply}
**Căn cứ pháp lý: những gì không được đưa lên AI**

- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026. Điều 5 quy định các hành vi bị nghiêm cấm; khoản 10 cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước. Cũng tại Điều 5 có quy định cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu.
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ về sử dụng chatbot AI: không đưa lên chatbot dữ liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; tránh dùng tên, mật khẩu trùng tài khoản công vụ; thu hồi khóa hoặc hủy tài khoản khi cán bộ nghỉ việc, chuyển công tác.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, triển khai theo Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI; ưu tiên nền tảng do Việt Nam phát triển và làm chủ khi xử lý dữ liệu nội bộ, nhạy cảm.

Pháp luật không cấm cán bộ dùng AI. Pháp luật cấm đưa bí mật nhà nước lên, và yêu cầu bảo vệ dữ liệu cá nhân, thông tin nội bộ.
:::

## 19.4. Trần chi phí: hạn mức, trừ trước hoàn sau, đếm ở máy chủ

### 19.4.1. Ba vòi nước làm chảy tiền

Chi phí của một ứng dụng tự làm chảy qua ba vòi. **Vòi thứ nhất** là thuê bao tác tử AI lập trình: theo trang giá chính thức tháng 10/2026, gói Free của Claude không có Claude Code, gói rẻ nhất có Claude Code là Pro 20 USD/tháng (giá tham khảo tại thời điểm viết, có thể thay đổi). Vòi này cố định, dễ dự toán. **Vòi thứ hai** là hạ tầng: Vercel, Supabase, GitHub đều có gói miễn phí đủ cho bản demo, nhưng mỗi gói có điều kiện riêng (mục 19.4.3). **Vòi thứ ba** là khóa AI tính theo lượng chữ (token): theo tài liệu cài bot của dự án, mỗi câu hỏi tốn từ vài nghìn đến vài chục nghìn token, vì lời dẫn mang theo cả kiến thức tĩnh lẫn số liệu.

Vòi thứ ba nguy hiểm nhất, vì nó chảy theo số người dùng và theo lỗi. Một nút mở cho khách ở Trang chủ có thể bị bấm hàng nghìn lần; một lỗi khiến bot trả lời hai lần làm tiền chảy gấp đôi mà không ai hay.

### 19.4.2. Bốn chốt chặn của hệ thống thử nghiệm

| Lối gọi AI | Chưa đăng nhập | Đã đăng nhập, đã duyệt |
|---|---|---|
| Trợ lý AI nghiệp vụ, Sổ tay AI (dùng chung) | 1 lượt/ngày | 5 lượt/ngày |
| Người hướng dẫn ở Trang chủ | 3 lượt/ngày, đếm theo máy | Như cột bên |
| Bot Telegram, Zalo | Phải đăng ký, chờ duyệt | 30 câu/người/ngày |

**Chốt 1: đếm ở máy chủ, không đếm ở trình duyệt.** Bộ đếm để trong trình duyệt giống phiếu ăn phát cho khách tự giữ, tự gạch: xóa lịch sử duyệt web là "hồi sinh" lượt. Hệ thống đếm trong một dòng dữ liệu chỉ máy chủ ghi được.

**Chốt 2: mốc ngày theo giờ Việt Nam.** Hạn mức của bot từng đặt lại lúc 0 giờ giờ quốc tế, tức 7 giờ sáng giờ Việt Nam. Nay mọi bộ đếm đặt lại lúc 0 giờ giờ Việt Nam, và quản trị có lệnh mở lại lượt cho người bị trừ oan.

**Chốt 3: thứ tự đúng.** Kiểm tra yêu cầu hợp lệ → xác định người gọi → trừ lượt → gọi AI → hoàn lượt nếu AI lỗi. Gọi AI xong mới trừ lượt thì bấm liên tiếp năm lần trong lúc chờ là lọt cả năm, như cho khách vào rạp rồi mới bán vé. Trừ lượt trước khi kiểm tra thì người gửi yêu cầu sai mất lượt oan; lỗi này đã có thật và đã được sửa. Ở Sổ tay AI, không tìm được đoạn nguồn nào thì báo lỗi trước khi trừ lượt, không gọi AI.

Xin nói thật một điểm còn mở. Đọc lại mã khi viết chương này, tôi thấy khung chat Người hướng dẫn đã hoàn lượt khi AI lỗi, nhưng hai lối gọi của Trợ lý AI và Sổ tay AI thì chưa. Bộ đếm cũng làm theo kiểu "đọc, cộng, ghi" hai bước, chưa nguyên tử như cơ chế chống trả lời lặp. Ở quy mô một cơ quan, rủi ro nhỏ; nhưng nó cho thấy một nguyên tắc đúng phải được áp đều ở mọi nơi và có người định kỳ rà lại.

**Chốt 4: thiếu cấu hình thì đóng.** Máy chủ thiếu khóa bí mật cơ sở dữ liệu, tức không đếm được, thì khách bị từ chối gọi AI; người đã đăng nhập vẫn dùng. Mặc định đóng với người lạ để trần chi phí không bị vô hiệu hóa chỉ vì quên khai một biến.

Thêm hai van giảm lưu lượng: trần chờ AI 40 giây, nhỏ hơn trần 60 giây của hàm máy chủ; độ dài trả lời tối đa 900 token. Và quan trọng hơn: **không phải việc gì cũng cần AI.** Khung chat Trang chủ có tầng kịch bản trả lời câu hỏi thường gặp ngay trong trình duyệt, không tốn token; lệnh `/solieu` của bot đọc thẳng cơ sở dữ liệu; bản tin pháp luật hằng ngày không gọi AI chút nào.

### 19.4.3. Gói miễn phí không phải miễn phí vô điều kiện

| Dịch vụ | Điều kiện đáng nhớ | Hệ quả thực tế |
|---|---|---|
| Supabase Free | Tạm dừng dự án sau 1 tuần không hoạt động; tối đa 2 dự án; 500 MB | Nghỉ dài ngày là ứng dụng "ngủ đông" |
| Render Free | Máy chủ ngủ khi không có truy cập | Một dữ liệu mở lần đầu chậm 30–60 giây |
| Vercel Hobby | Theo hiểu biết của tôi, dành cho mục đích cá nhân, phi thương mại | Dùng chính thức phải xem lại điều khoản |
| Gemini Notebook | Từ 02/9/2026, hạn mức tính theo khối lượng tính toán | Hạn mức từng cán bộ thay đổi theo cách dùng |

Số liệu trong bảng là tham khảo tại thời điểm viết (10/2026), có thể thay đổi. Theo tài liệu của Supabase, dự án đã tạm dừng có một năm để khôi phục bằng một nút bấm; gói Pro từ 25 USD/tháng thì không bị tạm dừng. Với Zalo, từ 01/6/2026 Zalo Official Account chuyển sang bộ gói dịch vụ mới; gói cơ bản miễn phí không có chatbot và giao diện lập trình, nên muốn bot qua Zalo chạy ổn định lâu dài, cơ quan cần dự trù kinh phí cho gói có chức năng này, giá đối chiếu trên trang chính thức của Zalo.

::: {.vidu}
**Ví dụ minh họa: dự toán chi phí AI cho một ứng dụng của Ban**

Hãy hình dung một Ban có 20 người dùng một ứng dụng tóm tắt văn bản, mỗi người 5 lượt mỗi ngày, 22 ngày làm việc mỗi tháng: 20 × 5 × 22 = 2.200 lượt/tháng. Nếu mỗi lượt trung bình 10.000 token cả hỏi lẫn đáp, tổng là 22 triệu token/tháng. Nhân với [giá mỗi triệu token theo bảng giá hiện hành của nhà cung cấp, tách riêng chữ gửi đi và chữ nhận về], ta được chi phí tháng.

Con số thật sẽ khác. Giá trị của phép tính là buộc người làm ứng dụng nói rõ: trần lượt mỗi người, độ dài tối đa mỗi lượt, ai chịu chi phí. Chưa trả lời được ba câu đó thì chưa nên mở ứng dụng cho người khác.
:::

::: {.lenhmau}
**Câu lệnh mẫu 19.4 — Lắp chốt chặn chi phí cho một lối gọi AI**

```text
VAI: Kỹ sư máy chủ của dự án [tên dự án].
BỐI CẢNH: Hàm [tên tệp trong api/] gọi AI, tốn tiền theo token.
VIỆC: Thêm hạn mức lượt gọi theo ngày cho hàm này:
1. Đếm ở máy chủ, không đếm ở trình duyệt.
2. Khách [n] lượt/ngày, người đăng nhập [m] lượt/ngày; ngày tính
   theo giờ Việt Nam (UTC+7). Khách nhận diện bằng chuỗi băm,
   không lưu IP gốc.
3. Thứ tự: kiểm tra yêu cầu → xác thực → trừ lượt → gọi AI → AI
   lỗi thì hoàn lượt. Hết lượt trả mã 429 kèm câu nhắc tiếng Việt.
4. Thiếu cấu hình bộ đếm thì từ chối khách. Trần thời gian chờ AI
   nhỏ hơn trần của nền tảng.
RÀNG BUỘC: dùng lại thư viện hạn mức đã có; không đổi hành vi các
hàm khác.
NGHIỆM THU: phép kiểm cho các ca: bấm liên tiếp khi đang chờ; yêu
cầu sai không bị trừ lượt; AI lỗi được hoàn lượt; qua 0 giờ Việt
Nam bộ đếm đặt lại. Rà mọi hàm gọi AI khác, báo hàm nào thiếu chốt.
```
:::
