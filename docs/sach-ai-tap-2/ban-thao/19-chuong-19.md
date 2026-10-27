# Chương 19. An toàn, dữ liệu và chi phí: rủi ro thật, cách phòng thật

::: {.muctieu}
**Mục tiêu của chương**

- Nhận diện ba loại rủi ro có thật khi cán bộ tự làm ứng dụng cùng AI: lộ dữ liệu, mất dữ liệu và chi phí vượt kiểm soát.
- Biết những gì tuyệt đối không được nằm trong kho mã nguồn công khai, và dựng được ba lớp chặn: tệp `.env`, danh sách loại trừ `.gitignore`, phép kiểm tự động.
- Hiểu phân quyền ở tầng cơ sở dữ liệu qua hình ảnh "thẻ ra vào", biết thử quyền bằng cả vai khách lẫn vai quản trị.
- Vẽ được đường đi của dữ liệu khi gửi cho AI; lắp được chốt chặn chi phí; chuẩn bị sẵn nhật ký chẩn đoán, sao lưu, cách khôi phục.
- Dùng được bảng kiểm an toàn trước khi chia sẻ một ứng dụng cho đồng nghiệp.

Dành cho: cán bộ đã hoặc sắp tự làm ứng dụng ở Bậc 2 trở lên; lãnh đạo cần biết nên hỏi gì trước khi cho một ứng dụng được dùng chung. Lãnh đạo nên đọc kỹ mục 19.3, 19.4 và các hộp "Dành cho lãnh đạo".
:::

Mỗi khi tác tử AI lập trình báo "đã xong", tôi tự hỏi: nếu sáng mai việc này lên mặt báo, tôi có ngủ yên không? Câu hỏi ấy giúp tôi thấy những chỗ mà niềm vui "phần mềm chạy rồi" che khuất.

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi là Văn phòng), tại địa chỉ `https://hdndthkpi.vercel.app`, chạy trên gói miễn phí, có kho mã công khai, có bot Telegram và Zalo, có nhiều lối gọi AI tốn tiền thật. Năm 2026, nó đã nếm đủ ba loại rủi ro chương này bàn: suýt lộ dữ liệu, suýt mất dữ liệu, và có lúc hạn mức bị "đốt" nhanh gấp đôi vì một lỗi không ai ngờ.

Tôi không viết chương này để dọa. Mọi rủi ro dưới đây đều có cách phòng cụ thể, phần lớn chỉ là vài dòng cấu hình và một thói quen kiểm tra. Cái khó là nhớ làm trước khi sự cố xảy ra.

Dùng lại hình ảnh trụ sở ở Chương 2, chương này hỏi ba câu: bộ bản vẽ (mã nguồn) có ghi gì không nên ghi; ai được quẹt thẻ vào kho hồ sơ (cơ sở dữ liệu); và hóa đơn điện nước có vòi nào chảy mà không ai khóa.

## 19.1. Kho mã công khai và những gì tuyệt đối không được nằm trong đó

### 19.1.1. Bản vẽ dán ở bảng tin ngoài cổng

Kho mã nguồn (repository) của hệ thống thử nghiệm để công khai trên GitHub, để đồng nghiệp ở cơ quan khác học lại được. Nhưng công khai có giá. Hãy hình dung bộ bản vẽ trụ sở dán ở bảng tin ngoài cổng: không sao nếu chỉ có tường, cửa, cầu thang; rất có sao nếu ai đó lỡ ghi lên đó mã số két sắt hay danh bạ điện thoại của lãnh đạo.

Người mới thường không biết hai điều. Thứ nhất, mọi thứ trang web gửi xuống trình duyệt cũng công khai: ai mở công cụ dành cho nhà phát triển của trình duyệt đều xem được mã giao diện. Bí mật viết trong mã giao diện thì không còn là bí mật, kể cả khi kho mã để riêng tư. Thứ hai, Git ghi lịch sử mọi lần sửa. Một tệp chứa khóa bí mật bị xóa ở lần sửa sau vẫn còn nguyên trong lịch sử. Bản vẽ đã dán lên bảng tin một đêm thì phải coi như người ta đã chụp ảnh.

### 19.1.2. Bốn nhóm thứ không bao giờ được vào kho mã

| Nhóm | Ví dụ | Cất ở đâu cho đúng |
|---|---|---|
| Khóa bí mật | Khóa API dịch vụ AI, khóa bí mật cơ sở dữ liệu, mã thông báo của bot | Biến môi trường trên máy chủ |
| Mật khẩu, mã truy cập | Mật khẩu quản trị, mã truy cập của đơn vị | Hệ thống đăng nhập; chỉ lưu chuỗi băm |
| Dữ liệu cá nhân thật | Danh bạ, hồ sơ lý lịch, bản tự đánh giá | Cơ sở dữ liệu có phân quyền |
| Tài liệu chưa công khai | Dự thảo chưa trình, tài liệu nội bộ, tài liệu mật | Không đưa vào hệ thống thử nghiệm |

Tài liệu có độ mật còn không được vào bất kỳ hệ thống nào chạy trên dịch vụ đám mây công cộng như Vercel, Supabase, GitHub. Đây là ranh giới pháp luật (xem hộp Căn cứ pháp lý ở mục 19.3).

::: {.cauchuyen}
**Câu chuyện thực tế: danh bạ 111 mục và một tệp không bao giờ lên GitHub**

Khi làm danh bạ cho phân hệ Quản lý cán bộ, tôi có tệp Word thật: 82 đại biểu Hội đồng nhân dân (HĐND) tỉnh và 29 cán bộ các Ban, Văn phòng. Cách nhanh nhất là bảo tác tử AI "nhúng danh sách này vào phần mềm"; nó sẽ làm ngay, rất gọn.

Tôi chọn cách khác. Phần mềm chỉ chứa **bộ đọc** danh bạ, biết tách họ tên, chức vụ, số điện thoại từ tệp nhưng không chứa một số nào. Quản trị tự nhập tệp, dữ liệu lưu vào dòng hồ sơ cán bộ mà chỉ tài khoản quản trị đọc được. Tệp gốc bị danh sách loại trừ của Git chặn theo tên. Một phép kiểm tự động khẳng định "không có số điện thoại nào trong mã nguồn". Bộ đọc đã thử trên tệp thật, tách đủ 111 mục, đúng hai nhóm. Cái giá: Quản trị phải nhập một lần. Tôi coi đó là cái giá rẻ.
:::

### 19.1.3. Ba lớp chặn: tệp `.env`, danh sách loại trừ, phép kiểm

**Lớp thứ nhất: khóa nằm ở biến môi trường.** Biến môi trường (environment variable) giống phong bì niêm phong cất ở phòng làm việc phía sau. Mã nguồn chỉ ghi "lấy khóa trong phong bì tên là `OPENAI_API_KEY`", không ghi bản thân khóa. Trên máy cá nhân, phong bì nằm trong tệp `.env`; trên Vercel, chúng được khai trong phần cài đặt dự án. Kho mã chỉ có tệp `.env.example`: danh sách tên phong bì kèm lời giải thích, giá trị để trống, để người nhận bàn giao biết cần khóa gì mà không thấy khóa thật nào.

Có một cái bẫy của công cụ dựng giao diện Vite: biến có tên bắt đầu bằng `VITE_` được **nhúng vào mã gửi xuống trình duyệt**, giống phong bì đóng dấu mà bưu điện photo phát cho mọi nhà. Dự án chỉ có hai biến mang tiền tố này: địa chỉ cơ sở dữ liệu và khóa công khai (anon key), vốn được thiết kế để lộ vì quyền thật do chính sách của cơ sở dữ liệu quyết định (mục 19.2). Mọi khóa bí mật khác chỉ được dùng trong các hàm máy chủ ở thư mục `api/`.

**Lớp thứ hai: danh sách loại trừ `.gitignore`**, tờ "không được mang ra khỏi phòng" mà Git đọc trước khi đóng gói. Tệp của dự án chặn `.env`, chặn mọi tệp có chữ "danh bạ" trong thư mục tài liệu, chặn thư mục hồ sơ đánh giá cá nhân dùng làm mẫu. Mỗi dòng chặn có chú thích vì sao, để người sau không "dọn" nhầm.

**Lớp thứ ba: phép kiểm tự động.** Quy tắc viết bằng lời có ngày quên; phép kiểm thì chạy mỗi lần: dò mã nguồn tìm số điện thoại, khẳng định kiến thức của bot không chứa mật khẩu, khẳng định `.gitignore` vẫn còn dòng chặn danh bạ.

::: {.canhbao}
**Cảnh báo: quy ước ghi ra giấy mà máy không thực thi**

Đọc lại kho mã khi viết sách, tôi thấy chính lỗi mình hay nhắc người khác. Quy ước dự án ghi "không commit thư mục `scratch/`" (thư mục nháp), nhưng `.gitignore` lại không chặn thư mục này. Một tệp thử nghiệm có ghi địa chỉ dự án cơ sở dữ liệu và khóa công khai đã nằm trong kho. Khóa công khai vốn để lộ nên chưa gây hại; nhưng nếu hôm đó tôi thử bằng khóa bí mật thì sao?

Tương tự, tài khoản trình diễn viết sẵn trong mã giao diện không còn là bí mật. Bản demo chấp nhận điều này chỉ vì chế độ đó không ghi được lên máy chủ. Trước khi dùng thật: xóa tài khoản viết sẵn, đổi toàn bộ mật khẩu và khóa.
:::

::: {.thuchanh}
**Thực hành: khi lỡ đẩy một khóa bí mật lên kho mã**

1. Làm ngay, đừng mất thời gian tìm cách xóa dấu vết trước.
2. Vào trang quản trị của dịch vụ đã cấp khóa, **thu hồi khóa cũ và tạo khóa mới**. Khóa cũ vô hiệu thì người nhặt được cũng không dùng được.
3. Khai khóa mới vào biến môi trường trên Vercel và tệp `.env` của từng máy, rồi triển khai lại.
4. Xem nhật ký sử dụng của dịch vụ trong khoảng thời gian khóa bị lộ: có lượt gọi lạ, hóa đơn tăng bất thường không.
5. Thêm mẫu tên tệp vào `.gitignore` và một phép kiểm; ghi sự việc vào nhật ký dự án, báo lãnh đạo nếu khóa thuộc tài khoản của cơ quan.
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

Chính sách bảo mật theo dòng (Row Level Security, viết tắt RLS) của cơ sở dữ liệu PostgreSQL mà Supabase cung cấp hoạt động đúng như vậy: mỗi dòng dữ liệu là một ngăn, mỗi chính sách là một tờ quy định, "thẻ" là phiên đăng nhập. Hệ thống dồn dữ liệu vào một bảng `app_state`; bản đồ quyền rút gọn:

| Ngăn hồ sơ (dòng) | Ai được xem | Ai được ghi |
|---|---|---|
| Kỳ đánh giá cán bộ | Mọi người (mở cho demo) | Người đã đăng nhập |
| Hồ sơ cán bộ, danh bạ | Chỉ quản trị | Chỉ quản trị |
| Kiến nghị cử tri của Trợ lý AI | Người đã đăng nhập | Người đã đăng nhập |
| Tiêu chí HĐND, Biểu quyết | Mọi người | Quản trị; người khác qua "ô cửa hẹp" |
| Bộ đếm hạn mức AI | Chỉ máy chủ | Chỉ máy chủ |

Nguyên tắc: **quyền thật nằm ở cửa kho, không ở biển chỉ dẫn.** Giao diện ẩn hay hiện một nút chỉ giúp người dùng đỡ rối.

### 19.2.2. Ẩn một tab không phải là khóa cửa

Phân hệ Quản lý cán bộ chứa ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình. Tab này chỉ hiện với quản trị, và tôi từng yên tâm vì "người khác có thấy đâu". Rà lại, tôi nhận ra chính sách chung cũ cho **mọi** tài khoản đã đăng nhập đọc **mọi** dòng. Một cán bộ có tài khoản, nếu gọi thẳng cửa giao dịch dữ liệu (API) mà không qua giao diện, vẫn đọc được hồ sơ. Biển chỉ dẫn đã gỡ, cửa kho vẫn mở.

Cái bẫy thứ hai tinh vi hơn: các chính sách RLS **cộng dồn theo kiểu "hoặc"**, chỉ cần một chính sách cho phép là được vào. Dán thêm tờ "Chỉ quản trị được vào" trong khi tờ "Mời mọi người đã đăng nhập" vẫn treo thì tờ mới vô tác dụng. Bước 4 của tệp lược đồ cơ sở dữ liệu vì thế **sửa chính sách chung cũ để loại riêng dòng hồ sơ cán bộ**, rồi mới thêm chính sách chỉ cho hai tài khoản quản trị. Tệp còn ghi rõ: chưa chạy bước này thì hồ sơ không được bảo vệ.

### 19.2.3. "Ô cửa hẹp" và chuỗi băm

Có lúc phải cho người không có tài khoản ghi dữ liệu: đại biểu bỏ phiếu ở phân hệ Biểu quyết; HĐND xã, phường tự chấm ở phân hệ Tiêu chí bằng mã đơn vị và mã truy cập. Mở quyền ghi chung thì ai cũng ghi đè được cả bảng.

Lời giải là "ô cửa hẹp": một hàm chạy trong cơ sở dữ liệu, mang quyền của chủ bảng nhưng chỉ làm **đúng một việc** và kiểm tra kỹ đầu vào. Hàm bỏ phiếu chỉ sửa một lá phiếu của một đại biểu trong một phiên đang mở, từ chối lựa chọn lạ, mã đại biểu sai dạng, phiên đã khóa. Hàm ghi phiếu tiêu chí chỉ ghi đúng phiếu của đơn vị có mã khớp. Hàm đếm lượt truy cập chỉ cộng thêm 1. Như không giao chìa khóa kho cho khách, chỉ khoét một khe trên thùng phiếu.

Mã truy cập của xã, phường không lưu dạng chữ rõ, vì dòng tiêu chí mở cho mọi người xem; hệ thống chỉ lưu **chuỗi băm** SHA-256 của "mã đơn vị::mã truy cập". Chuỗi băm giống dấu vân tay: xác nhận được đúng người, nhưng không dựng lại được bàn tay. Cùng cách đó, khóa đếm lượt AI của khách là chuỗi băm địa chỉ IP kèm thông tin trình duyệt; hệ thống không lưu IP gốc.

### 19.2.4. Mở cho demo thì phải viết sẵn cách đóng

Để khách và quản trị thấy cùng một bảng điểm, bước 6 của tệp lược đồ mở quyền **đọc**, không mở quyền ghi, cho các dòng kỳ đánh giá. Ngay dưới câu lệnh mở là dòng viết hoa: *"KHI CHUYỂN SANG DÙNG THẬT: xóa chính sách này"*, kèm sẵn câu lệnh gỡ. Mỗi quyết định "mở cho tiện trình diễn" phải đi kèm lối đóng viết ngay tại chỗ.

Ngược lại, có ngăn cố ý không bao giờ mở. Dòng kiến nghị cử tri của Trợ lý AI có tên người dân, nên khách vào sẽ thấy danh sách trống. Tệp lược đồ dặn: đó là đúng thiết kế, đừng "sửa" bằng cách thêm quyền đọc công khai. Lời dặn ấy viết cho cả tác tử AI, để nó không tự ý "chữa" một điều vốn không phải lỗi.

::: {.phaply}
**Căn cứ pháp lý: dữ liệu cá nhân trong ứng dụng tự làm**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, thông qua ngày 26/6/2025, hiệu lực từ 01/01/2026, phân dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm.
- Nghị định 356/2025/NĐ-CP ngày 31/12/2025 quy định chi tiết Luật, hiệu lực 01/01/2026; theo khoản 2 Điều 42, Nghị định 13/2023/NĐ-CP hết hiệu lực từ ngày đó. Điều 3 liệt kê dữ liệu cơ bản, trong đó có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình. Khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tình trạng sức khỏe, dữ liệu về tội phạm, vi phạm pháp luật, tên đăng nhập và mật khẩu tài khoản định danh điện tử.
- Nghị định 330/2026/NĐ-CP ngày 19/8/2026, hiệu lực từ ngày ký, lần đầu có cơ chế xử phạt riêng cho vi phạm về bảo vệ dữ liệu cá nhân; ví dụ, tự coi sự im lặng hoặc không phản hồi của chủ thể dữ liệu là đồng ý để thu thập, xử lý dữ liệu bị phạt từ 50 đến 70 triệu đồng.

Danh bạ hay hồ sơ Mẫu 2C vì thế là dữ liệu cá nhân theo đúng nghĩa pháp luật. Việc xử phạt cơ quan nhà nước còn theo pháp luật về xử lý vi phạm hành chính; cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

Pháp luật đổi nhanh: tài liệu Đặc tả yêu cầu phần mềm của dự án, đề tháng 7/2026, còn nêu Nghị định 13/2023/NĐ-CP làm căn cứ khi nghị định này đã hết hiệu lực nửa năm. Tài liệu nào của dự án cũng cần dòng "pháp luật đối chiếu đến ngày…" và được rà lại định kỳ.

### 19.2.5. Thử bằng cả vai khách và vai quản trị

Quy ước dự án có dòng bắt buộc: đổi quyền đọc, ghi thì xem lại chính sách và **thử cả vai khách lẫn vai quản trị**. Tôi mở rộng thành bốn vai, vì sự cố "khách và quản trị thấy hai danh sách cán bộ khác nhau" kể ở Chương 9 chỉ lộ ra khi tôi đăng nhập song song hai tài khoản để so.

::: {.thuchanh}
**Thực hành: ma trận thử quyền bốn vai**

1. Mở bốn cửa sổ trình duyệt (có cửa sổ ẩn danh): khách; cán bộ thường; quản trị; người dùng đặc biệt như đơn vị xã, phường hoặc đại biểu bỏ phiếu.
2. Với mỗi ngăn hồ sơ ở mục 19.2.1, ghi ra giấy vai nào phải thấy, không được thấy, được sửa.
3. Mở cùng một phân hệ ở bốn cửa sổ, so số người, số liệu. Phần được xem phải giống nhau.
4. Ở vai khách và cán bộ thường, thử sửa, lưu: phải bị từ chối, và giao diện phải báo rõ.
5. Nhờ tác tử AI kiểm tra phần mắt không thấy (Câu lệnh mẫu 19.2), lưu kết quả thành bảng để lần sau chạy lại.
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

Khóa bí mật của cơ sở dữ liệu còn nặng hơn: nó **bỏ qua toàn bộ chính sách RLS** ở mục 19.2, như chìa khóa vạn năng của trưởng kho. Nó chỉ nằm ở máy chủ, không mang tiền tố `VITE_`, không bao giờ được dán vào khung chat với AI để "nhờ xem giúp sao lỗi".

Năm quy tắc giữ khóa tôi áp dụng:

1. Khóa chỉ nằm ở biến môi trường của máy chủ và tệp `.env` trên máy cá nhân.
2. Mỗi ứng dụng một khóa riêng, để khi thu hồi không làm sập ứng dụng khác.
3. Nếu nhà cung cấp cho đặt hạn mức chi tiêu hằng tháng, đặt ngay từ ngày đầu, ở mức thấp.
4. Người rời dự án hoặc chuyển công tác thì thu hồi những khóa họ từng biết, đúng tinh thần hướng dẫn của Bộ Khoa học và Công nghệ (hộp Căn cứ pháp lý dưới đây).
5. Trang tình trạng chỉ hiện **tên miền** dịch vụ AI và tên mô hình, không hiện khóa, như lệnh `/trangthai` của bot Văn phòng.

### 19.3.2. Vẽ đường đi của một câu hỏi

Một câu hỏi gửi cho bot của Văn phòng đi qua nhiều trạm, mỗi trạm là một nơi dữ liệu có thể được ghi lại. Hãy đi theo câu hỏi giả định "Tuần này lịch công tác của Thường trực có gì?":

1. Điện thoại gửi tin tới máy chủ của **Telegram** hoặc **Zalo**, nơi tin được lưu theo chính sách của họ.
2. Nền tảng chuyển tin đến **hàm máy chủ trên Vercel** của Văn phòng.
3. Hàm máy chủ đọc **cơ sở dữ liệu** của hệ thống (Supabase, khu vực Singapore) và của phân hệ Lịch công tác.
4. Hàm máy chủ ghép **lời dẫn** (hiểu biết tĩnh, số liệu vừa đọc, vài lượt hội thoại gần nhất) gửi cho **nhà cung cấp AI**, qua **dịch vụ trung gian** nếu có. Câu trả lời đi ngược lại đúng con đường ấy.

Câu hỏi về lịch của lãnh đạo, kèm số liệu nạp theo, đã đi qua ít nhất bốn tổ chức, phần lớn ở nước ngoài; với dữ liệu mô phỏng, chấp nhận được. Với dữ liệu thật, mỗi trạm là một câu hỏi pháp lý: lưu bao lâu, có bị dùng huấn luyện mô hình không, có ra khỏi lãnh thổ Việt Nam không. Pháp luật về bảo vệ dữ liệu cá nhân có quy định riêng về chuyển dữ liệu cá nhân ra nước ngoài; phải hỏi đơn vị chuyên trách và tra nguyên văn trước.

Từ hình vẽ này, bot áp một nguyên tắc tôi cho là quan trọng nhất của chương: **không đưa vào lời dẫn chắc hơn dặn AI đừng nói ra.** Hồ sơ nhân sự chỉ được nạp khi người hỏi là quản trị; kể cả khi đó, số căn cước, số sổ bảo hiểm, quan hệ gia đình cũng không bao giờ được nạp. Người dùng Zalo không bao giờ được coi là quản trị. Danh bạ tắt mặc định ở khung chat khách vô danh trên Trang chủ. Lời dặn "đừng tiết lộ" trong lời nhắc hệ thống chỉ là lớp bảo vệ thứ hai.

::: {.lenhmau}
**Câu lệnh mẫu 19.3 — Lập bản đồ đường đi của dữ liệu**

```text
VAI: Chuyên viên an toàn dữ liệu của dự án [tên dự án].
VIỆC: Đọc mã nguồn, liệt kê MỌI nơi dữ liệu rời khỏi máy người
dùng (lưu dữ liệu, gọi AI, bot chat, gửi tệp, gọi hệ thống ngoài).
Lập bảng: Luồng – Trạm đi qua (dịch vụ, tên miền) – Loại dữ liệu
(cá nhân cơ bản, nhạy cảm, công khai) – Cách bớt dữ liệu gửi đi.
RÀNG BUỘC: chỉ đọc mã, không sửa. Điều mã không thể hiện (chính
sách lưu trữ, vị trí máy chủ của nhà cung cấp) thì ghi "cần hỏi
nhà cung cấp", không đoán.
NGHIỆM THU: kết thúc bằng 3 đề xuất giảm dữ liệu gửi cho AI, xếp
theo mức giảm rủi ro.
```
:::

### 19.3.3. Dịch vụ trung gian: rẻ, tiện, và thêm một người thứ ba

Có giai đoạn tôi mua khóa của một dịch vụ trung gian "tương thích OpenAI": giá rẻ, thanh toán dễ. Tác tử AI chỉ cần thêm biến `AI_BASE_URL` để đổi địa chỉ gọi, vài dòng mã.

Về dữ liệu, đó là quyết định khác hẳn: mọi câu hỏi và số liệu nạp kèm (họ tên, điểm, xếp loại cán bộ, lịch công tác của lãnh đạo) đều đi qua máy chủ của một bên mà tôi không có hợp đồng, không rõ chính sách lưu trữ. Như gửi công văn qua một dịch vụ chuyển phát giá rẻ mà không biết ai bóc phong bì dọc đường.

Dự án vẫn hỗ trợ kỹ thuật nhưng ghi cảnh báo in đậm ở đầu tệp bộ nối AI và trong tài liệu cài bot; lệnh `/trangthai` hiện tên miền đang dùng; và khuyến nghị dứt khoát: dữ liệu thật thì dùng khóa của nhà cung cấp gốc theo hợp đồng của cơ quan, hoặc ít nhất hỏi rõ chính sách lưu trữ của bên trung gian. Trung gian còn có cái giá không ai quảng cáo: tốc độ, nguồn gốc của chuỗi sự cố kể ở mục 19.5.

### 19.3.4. Tài khoản AI cá nhân: chỉnh cài đặt trước khi gõ chữ đầu tiên

Với trợ lý AI trò chuyện, rủi ro nằm trong phần cài đặt ít người mở ra xem. Theo trang giá và thông báo cập nhật điều khoản của Anthropic mà tôi đọc ngày 26/10/2026, các gói cá nhân Free, Pro, Max của Claude để người dùng tự chọn có cho dùng dữ liệu huấn luyện mô hình hay không; gói Team và Enterprise mặc định không huấn luyện trên nội dung. Để bật thì dữ liệu được lưu 5 năm; tắt thì thời hạn lưu là 30 ngày. Mục cần tắt nằm trong phần cài đặt quyền riêng tư (Privacy); tên mục có thể khác đôi chút tùy phiên bản.

ChatGPT và Gemini có mục tương tự, nhưng tên nút đổi theo từng đợt cập nhật. Thói quen đúng: **tạo tài khoản xong, mở ngay Cài đặt → Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt mục cho phép huấn luyện.** Tập 1 đã nhắc; Tập 2 nhắc lại vì giờ chúng ta còn dán cả mã nguồn, cấu trúc dữ liệu của cơ quan vào khung chat.

Với Sổ tay AI trên Gemini Notebook (trước đây là NotebookLM), nguồn tải lên được lưu trên máy chủ của Google, nên Văn phòng chỉ nạp văn bản đã công khai và chia sẻ quyền chỉ xem. Theo trang trợ giúp của Google, kiểu liên kết "chỉ hiện khung chat" không thu hồi quyền truy cập vào nguồn, nên không phải cơ chế bảo mật.

::: {.phaply}
**Căn cứ pháp lý: những gì không được đưa lên AI**

- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026. Điều 5 quy định các hành vi bị nghiêm cấm; khoản 10 cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước. Cũng tại Điều 5 có quy định cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu.
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ về sử dụng chatbot AI: không đưa lên chatbot dữ liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; tránh dùng tên, mật khẩu trùng tài khoản công vụ; thu hồi khóa hoặc hủy tài khoản khi cán bộ nghỉ việc, chuyển công tác.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, triển khai theo Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI; ưu tiên nền tảng do Việt Nam phát triển và làm chủ khi xử lý dữ liệu nội bộ, nhạy cảm.

Pháp luật không cấm cán bộ dùng AI. Pháp luật cấm đưa bí mật nhà nước lên, và yêu cầu bảo vệ dữ liệu cá nhân, thông tin nội bộ.
:::

## 19.4. Trần chi phí: hạn mức, trừ trước hoàn sau, đếm ở máy chủ

### 19.4.1. Ba vòi nước làm chảy tiền

Chi phí của một ứng dụng tự làm chảy qua ba vòi. **Vòi thứ nhất**, cố định và dễ dự toán, là thuê bao tác tử AI lập trình: theo trang giá chính thức tháng 10/2026, gói rẻ nhất có Claude Code là Pro 20 USD/tháng (giá tham khảo tại thời điểm viết, có thể thay đổi). **Vòi thứ hai** là hạ tầng: Vercel, Supabase, GitHub đều có gói miễn phí đủ cho bản demo, nhưng mỗi gói có điều kiện riêng (mục 19.4.3). **Vòi thứ ba** là khóa AI tính theo lượng chữ (token): theo tài liệu cài bot của dự án, mỗi câu hỏi tốn từ vài nghìn đến vài chục nghìn token, vì lời dẫn mang theo cả kiến thức tĩnh lẫn số liệu.

Vòi thứ ba nguy hiểm nhất vì chảy theo số người dùng và theo lỗi: một nút mở cho khách có thể bị bấm hàng nghìn lần; một lỗi khiến bot trả lời hai lần làm tiền chảy gấp đôi.

### 19.4.2. Bốn chốt chặn của hệ thống thử nghiệm

| Lối gọi AI | Chưa đăng nhập | Đã đăng nhập, đã duyệt |
|---|---|---|
| Trợ lý AI nghiệp vụ, Sổ tay AI (dùng chung) | 1 lượt/ngày | 5 lượt/ngày |
| Người hướng dẫn ở Trang chủ | 3 lượt/ngày, đếm theo máy | Như cột bên |
| Bot Telegram, Zalo | Phải đăng ký, chờ duyệt | 30 câu/người/ngày |

**Chốt 1: đếm ở máy chủ, không đếm ở trình duyệt.** Bộ đếm để trong trình duyệt giống phiếu ăn phát cho khách tự giữ, tự gạch: xóa lịch sử duyệt web là "hồi sinh" lượt. Hệ thống đếm trong một dòng dữ liệu chỉ máy chủ ghi được.

**Chốt 2: mốc ngày theo giờ Việt Nam.** Hạn mức của bot từng đặt lại lúc 0 giờ UTC, tức 7 giờ sáng ở Việt Nam. Nay mọi bộ đếm đặt lại lúc nửa đêm theo giờ Việt Nam; quản trị có lệnh mở lại lượt cho người bị trừ oan.

**Chốt 3: thứ tự đúng.** Kiểm tra yêu cầu hợp lệ → xác định người gọi → trừ lượt → gọi AI → hoàn lượt nếu AI lỗi. Gọi AI xong mới trừ lượt thì bấm liên tiếp năm lần trong lúc chờ là lọt cả năm, như cho khách vào rạp rồi mới bán vé. Trừ lượt trước khi kiểm tra thì người gửi yêu cầu sai mất lượt oan; lỗi này đã có thật và đã được sửa.

Xin nói thật một điểm còn mở: đọc lại mã khi viết chương này, tôi thấy khung chat Người hướng dẫn đã hoàn lượt khi AI lỗi, nhưng Trợ lý AI và Sổ tay AI thì chưa; bộ đếm cũng làm kiểu "đọc, cộng, ghi" hai bước, chưa nguyên tử. Ở quy mô một cơ quan, rủi ro nhỏ; nhưng nguyên tắc đúng phải được áp đều ở mọi nơi và có người định kỳ rà lại.

**Chốt 4: thiếu cấu hình thì đóng.** Máy chủ thiếu khóa bí mật cơ sở dữ liệu, tức không đếm được, thì khách bị từ chối gọi AI; người đã đăng nhập vẫn dùng. Mặc định đóng với người lạ, để quên khai một biến không làm mất trần chi phí.

Thêm hai van giảm lưu lượng: trần chờ AI 40 giây, nhỏ hơn trần 60 giây của hàm máy chủ; độ dài trả lời tối đa 900 token. Quan trọng hơn: **không phải việc gì cũng cần AI.** Khung chat Trang chủ có tầng kịch bản trả lời câu hỏi thường gặp ngay trong trình duyệt; lệnh `/solieu` của bot đọc thẳng cơ sở dữ liệu; bản tin pháp luật không gọi AI chút nào.

### 19.4.3. Gói miễn phí không phải miễn phí vô điều kiện

| Dịch vụ | Điều kiện đáng nhớ | Hệ quả thực tế |
|---|---|---|
| Supabase Free | Tạm dừng dự án sau 1 tuần không hoạt động; tối đa 2 dự án đang chạy; 500 MB | Nghỉ dài ngày là ứng dụng "ngủ đông" |
| Render Free | Máy chủ ngủ khi không có truy cập | Một dữ liệu mở lần đầu chậm 30–60 giây |
| Vercel Hobby | Theo hiểu biết của tôi, dành cho mục đích cá nhân, phi thương mại | Dùng chính thức phải xem lại điều khoản |

Số liệu trong bảng là tham khảo tại thời điểm viết (10/2026), có thể thay đổi. Theo tài liệu của Supabase, dự án đã tạm dừng có một năm để khôi phục bằng một nút bấm; gói Pro từ 25 USD/tháng thì không bị tạm dừng. Riêng Zalo Official Account, từ 01/6/2026 gói cơ bản miễn phí không có chatbot và giao diện lập trình; muốn bot qua Zalo chạy lâu dài, cơ quan cần dự trù kinh phí cho gói có chức năng này.

::: {.vidu}
**Ví dụ minh họa: dự toán chi phí AI cho một ứng dụng của Ban**

Hãy hình dung một Ban có 20 người dùng một ứng dụng tóm tắt văn bản, mỗi người 5 lượt mỗi ngày, 22 ngày làm việc mỗi tháng: 20 × 5 × 22 = 2.200 lượt/tháng. Nếu mỗi lượt trung bình 10.000 token cả hỏi lẫn đáp, tổng là 22 triệu token/tháng. Nhân với [giá mỗi triệu token theo bảng giá hiện hành của nhà cung cấp, tách riêng chữ gửi đi và chữ nhận về], ta được chi phí tháng.

Con số thật sẽ khác. Giá trị của phép tính là buộc người làm ứng dụng nói rõ trần lượt mỗi người, độ dài mỗi lượt, ai chịu chi phí, trước khi mở ứng dụng cho người khác.
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
4. Thiếu cấu hình bộ đếm thì từ chối khách.
RÀNG BUỘC: dùng lại thư viện hạn mức đã có; không đổi hàm khác.
NGHIỆM THU: phép kiểm cho các ca: bấm liên tiếp khi đang chờ; yêu
cầu sai không bị trừ lượt; AI lỗi được hoàn lượt; qua 0 giờ Việt
Nam bộ đếm đặt lại. Rà mọi hàm gọi AI khác, báo hàm nào thiếu chốt.
```
:::

## 19.5. Sự cố và ứng phó

### 19.5.1. Nhật ký chẩn đoán: biết thời gian đi đâu thay vì đoán

Ca trực nào cũng có sổ trực ban. Phần mềm cũng cần một cuốn sổ như vậy, gọi là nhật ký chẩn đoán (log); không có sổ thì khi sự cố xảy ra, người và tác tử AI chỉ còn cách đoán.

::: {.cauchuyen}
**Câu chuyện thực tế: "This operation was aborted" và hạn mức bị đốt gấp đôi**

Có thời gian, người dùng bot Zalo nhận hai câu trả lời giống hệt nhau cho một câu hỏi, có lúc kèm dòng lỗi tiếng Anh *"This operation was aborted"*. Hạn mức 30 câu mỗi ngày cạn nhanh gấp đôi.

Dịch vụ trung gian trả lời chậm nên trần chờ AI 45 giây thường bị chạm; dòng lỗi kia chính là thông báo gốc khi hết giờ. Trong lúc bot còn chờ, Zalo không nhận được tín hiệu "đã nhận" nên **gửi lại nguyên tin**; hàm máy chủ mỗi lần gọi là một tiến trình riêng, không nhớ lần trước, thế là trả lời hai lần.

Cách sửa: trước khi xử lý, bot "giành chỗ" bằng một dòng mang mã tin nhắn trong cơ sở dữ liệu; dòng trùng mã bị từ chối một cách nguyên tử, nên hai lần gọi song song cũng chỉ một lần được xử lý. Bot cố ý không chặn theo nội dung, vì hỏi lại y hệt câu cũ là quyền của người dùng. Trần chờ hạ xuống 40 giây, lỗi báo bằng tiếng Việt, và bot ghi số đo thời gian từng khâu, như nhật ký dự án ghi: *"để biết thời gian đi đâu chứ không đoán"*.
:::

"Sổ trực ban" của hệ thống gồm: trang tình trạng bot Zalo (mã thông báo, tin nhắn gần nhất, lần gửi lại đã bị chặn); lệnh `/trangthai` báo kết nối cơ sở dữ liệu, dịch vụ AI, lịch công tác; tệp nhật ký của bộ sinh bản tin. Bộ sinh bản tin chạy ẩn, không cửa sổ, nên không có nhật ký thì mọi thông báo đều mất. Sáng 10/9/2026 không có bản tin vì điều kiện "chỉ chạy khi có mạng" khiến Windows hủy lượt chạy lúc máy vừa bật; bản sửa bỏ điều kiện đó và thêm thử lại.

Một khoảng trống phải nói thẳng: Đặc tả của dự án đòi nhật ký toàn bộ thao tác tạo, sửa, xóa, phê duyệt; bản demo mới có dấu phê duyệt (họ tên, vai trò, ngày) và mốc thời gian sửa cuối. Nghị định 333/2026/NĐ-CP ngày 19/8/2026 yêu cầu nhật ký hệ thống lưu đầy đủ, liên tục, truy xuất được tối thiểu 12 tháng. Nghĩa vụ này nhắm vào doanh nghiệp cung cấp dịch vụ, nhưng là chuẩn tham chiếu tốt cho ứng dụng nào của cơ quan muốn chính thức hóa.

### 19.5.2. Sao lưu: ba thứ cần giữ

**Mã nguồn** đã có sao lưu tự nhiên: kho GitHub cùng bản trên máy cơ quan và máy ở nhà là ba bản độc lập. **Cấu hình bí mật** không nằm trong Git: giữ danh sách tên biến (`.env.example`), cất giá trị khóa theo quy định quản lý tài khoản của cơ quan. **Dữ liệu nghiệp vụ** là phần dễ bị quên nhất.

Hệ thống thử nghiệm chưa có nút "sao lưu toàn bộ dữ liệu" để cơ quan tự giữ một bản. Tệp Word, Excel xuất ra là bản kết quả, không dựng lại được hệ thống; bộ nhớ đệm trong trình duyệt chỉ là bản tạm của từng máy. Tài liệu kỹ thuật của phần mềm ghi nền tảng sao lưu định kỳ, nhưng tôi chưa kiểm chứng mức sao lưu của gói miễn phí, và không muốn cơ quan phụ thuộc hoàn toàn vào nhà cung cấp.

::: {.thuchanh}
**Thực hành: lịch sao lưu tối thiểu cho một ứng dụng nhỏ**

1. Hằng tuần: nhờ tác tử AI viết lệnh xuất toàn bộ bảng dữ liệu ra tệp có ghi ngày, cất ở nơi lưu trữ do cơ quan quản lý, không đưa lên kho mã công khai.
2. Hằng tháng: thử khôi phục tệp sao lưu vào một dự án thử. Bản sao lưu chưa từng khôi phục thử thì chưa chắc dùng được.
3. Trước mỗi thay đổi lớn về cấu trúc dữ liệu: sao lưu thêm một bản.
4. Mỗi quý: rà danh sách khóa, người giữ khóa, hạn mức chi tiêu.
:::

### 19.5.3. Khôi phục từ lịch sử Git

Vì Git ghi lịch sử mọi lần sửa, phần lớn sự cố về mã có đường lui. Bản tin ngày 09/9/2026 từng được lấy lại từ lịch sử Git; mã hai bản giao diện "Mới" và "PRO" đã gỡ vẫn còn nguyên trong lịch sử. Theo tài liệu kỹ thuật của dự án, Vercel cũng giữ lịch sử các lần triển khai để quay về bản trước khi bản mới hỏng.

Nguyên tắc vàng: **khôi phục bằng một lần sửa mới, không xóa lịch sử.** Lệnh "quay ngược" tạo bản ghi mới thì an toàn; lệnh "đặt lại cứng" xóa các lần sửa sau, có thể làm mất việc chưa đẩy lên.

::: {.lenhmau}
**Câu lệnh mẫu 19.5 — Khôi phục an toàn sau sự cố**

```text
VIỆC: Bản vừa triển khai làm [hiện tượng: phân hệ X trắng trang /
mất cột Y]. Hãy:
1. Tìm trong lịch sử Git lần sửa gây ra hiện tượng; giải thích
   bằng lời thường.
2. Đề xuất cách khôi phục BẰNG MỘT LẦN SỬA MỚI, không dùng lệnh
   xóa lịch sử, không ép đẩy đè lên GitHub.
3. Nếu sự cố đụng tới dữ liệu trên máy chủ, liệt kê dòng dữ liệu
   bị ảnh hưởng và bản sao lưu nào dùng được.
RÀNG BUỘC: trình phương án, chờ tôi duyệt rồi mới chạy lệnh làm
thay đổi kho mã hoặc dữ liệu.
NGHIỆM THU: bản dựng xanh; phân hệ mở được ở cả vai khách và vai
quản trị; sự cố được ghi vào nhật ký thay đổi.
```
:::

### 19.5.4. Khi dịch vụ bên ngoài thay đổi không báo trước

Ngày 16/7/2026, Google đổi tên NotebookLM thành Gemini Notebook; sau đó `notebooklm.google.com` tự chuyển hướng sang `notebook.google.com`. Dự án chỉ phát hiện ngày 22/10/2026, khi tác tử AI kiểm tra thật đường dẫn tôi đưa thay vì tin trí nhớ của nó. Hàm chuẩn hóa nay nhận cả hai tên miền, luôn lưu về tên miền hiện hành, kèm 13 phép kiểm riêng.

Chuyện tương tự xảy ra thường xuyên: Supabase đổi tên loại khóa bí mật; mã thông báo của Zalo hết hạn sau khoảng một giờ, mỗi lần làm mới lại cấp cặp mã mới phải lưu ngay. Cách phòng: gom địa chỉ dịch vụ bên ngoài vào một chỗ trong mã, dựng trang chẩn đoán, định kỳ nhờ AI kiểm tra thực tế đường dẫn, phiên bản, điều khoản.

| Tình huống | Làm ngay | Làm sau |
|---|---|---|
| Lỡ đẩy khóa bí mật lên kho | Thu hồi, cấp khóa mới | Chặn bằng `.gitignore`, thêm phép kiểm |
| Nghi lộ dữ liệu cá nhân | Đóng quyền truy cập; báo lãnh đạo, đơn vị chuyên trách | Làm đúng trình tự, thời hạn luật định |
| Chi phí tăng bất thường | Tạm khóa lối gọi AI, đổi khóa | Đọc nhật ký, tìm lỗi lặp, siết hạn mức |
| Phân hệ trắng trang | Quay về bản triển khai trước | Tìm nguyên nhân gốc, thêm phép kiểm |
| Dịch vụ tạm dừng, đổi địa chỉ | Khôi phục dự án, sửa đường dẫn | Ghi vào bộ nhớ dự án |

## 19.6. Bảng kiểm an toàn trước khi chia sẻ một ứng dụng

Trước khi gửi đường dẫn cho dù chỉ một đồng nghiệp, tôi đi qua bảng kiểm dưới đây; mục nào chưa đạt thì sửa, hoặc ghi thành "khoản nợ" kèm hạn trả. Bảng kiểm cho việc đưa vào sử dụng chính thức nằm ở Phụ lục 6.

**A. Kho mã và bí mật**

1. Đã rà kho mã và lịch sử commit (Câu lệnh mẫu 19.1): không có khóa, mật khẩu, số điện thoại, hồ sơ cá nhân.
2. Khóa bí mật nằm ở biến môi trường, không mang tiền tố `VITE_`.
3. `.gitignore` chặn `.env`, thư mục nháp, tệp dữ liệu thật; có phép kiểm cho các điều cấm.
4. Tài khoản trình diễn viết sẵn được ghi thành "khoản nợ" phải xóa trước khi dùng thật.

**B. Phân quyền**

5. Quyền nằm ở cơ sở dữ liệu; chính sách cũ lỏng hơn đã được sửa, không chỉ thêm chính sách mới.
6. Đã chạy ma trận thử bốn vai; kết quả thật khớp quyền dự kiến.
7. Người không có tài khoản chỉ ghi được qua "ô cửa hẹp"; mã truy cập lưu dạng chuỗi băm.
8. Mỗi chỗ "mở cho demo" có ghi sẵn câu lệnh đóng lại.

**C. Dữ liệu và AI**

9. Đã vẽ bản đồ đường đi của dữ liệu (Câu lệnh mẫu 19.3).
10. Không có tài liệu mật, dự thảo chưa công bố; dữ liệu cá nhân thu thập tối thiểu.
11. Lời dẫn gửi AI không mang dữ liệu nhạy cảm, phân tầng theo người hỏi.
12. Dùng dịch vụ trung gian thì lãnh đạo đã biết, dữ liệu chỉ là mô phỏng hoặc công khai.

**D. Chi phí**

13. Mọi lối gọi AI có hạn mức đếm ở máy chủ, đặt lại theo giờ Việt Nam.
14. Thứ tự kiểm tra, trừ lượt, gọi AI, hoàn lượt đúng ở **tất cả** các lối gọi.
15. Trần thời gian chờ nhỏ hơn trần của nền tảng; đã đặt hạn mức chi tiêu ở nhà cung cấp nếu có thể.
16. Đã biết điều kiện từng gói miễn phí và chuyện gì xảy ra khi chạm giới hạn.

**E. Vận hành, sự cố, trách nhiệm**

17. Có trang hoặc lệnh chẩn đoán; lỗi báo bằng tiếng Việt.
18. Có lịch sao lưu, đã thử khôi phục; có bảng ứng phó sự cố.
19. Bộ nhớ dự án ghi đủ các điều trên để người khác tiếp nhận.
20. Có nhãn "bản demo thử nghiệm", nhãn dữ liệu mô phỏng, nhãn "chỉ để tham khảo" cho kết quả AI.
21. Lãnh đạo trực tiếp biết ứng dụng đang được chia sẻ cho ai, phạm vi nào.

::: {.lenhmau}
**Câu lệnh mẫu 19.6 — Nhờ tác tử AI tự chấm bảng kiểm có bằng chứng**

```text
VIỆC: Đây là bảng kiểm an toàn 21 mục [dán bảng kiểm]. Với dự án
này, chấm từng mục: ĐẠT / CHƯA ĐẠT / KHÔNG ÁP DỤNG.
DẠNG: bảng: Mục – Kết luận – Bằng chứng (tên tệp, dòng, kết quả
lệnh đã chạy) – Việc cần làm.
RÀNG BUỘC: chỉ đọc và chạy lệnh kiểm tra, không sửa gì. Mục nào
không có bằng chứng thì ghi CHƯA ĐẠT, không suy đoán là đạt.
NGHIỆM THU: nêu 3 mục nguy hiểm nhất cần làm trước khi chia sẻ.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Trước khi cho phép chia sẻ một ứng dụng tự làm, hãy hỏi ba câu: dữ liệu đi qua những đâu; ai được thấy, ai được ghi và chặn ở đâu; trần chi phí mỗi tháng là bao nhiêu, ai chịu.
- Yêu cầu nộp bảng kiểm mục 19.6 đã chấm kèm bằng chứng, như hồ sơ nghiệm thu.
- Khóa API và tài khoản dịch vụ dùng cho việc chung nên do cơ quan quản lý, không để một cá nhân giữ toàn bộ.
- Dữ liệu cá nhân thật, tài liệu chưa công bố không đưa vào ứng dụng chạy trên hạ tầng miễn phí ở nước ngoài; tài liệu mật không đưa vào hệ thống nào kết nối Internet.
:::

## Tóm tắt chương 19

::: {.tomtat}
1. Rủi ro khi tự làm ứng dụng có ba loại: lộ dữ liệu, mất dữ liệu, chi phí vượt kiểm soát; cả ba đều có cách phòng cụ thể.
2. Kho mã công khai và mã tải về trình duyệt đều công khai; Git nhớ mọi lần sửa. Khóa ở biến môi trường, dữ liệu thật ở cơ sở dữ liệu có phân quyền; lỡ lộ khóa thì thu hồi ngay.
3. Quyền thật nằm ở cửa kho (chính sách bảo mật theo dòng), không ở biển chỉ dẫn trên giao diện; chính sách cộng dồn kiểu "hoặc", phải thử bằng nhiều vai.
4. Không đưa vào lời dẫn chắc hơn dặn AI đừng nói. Mỗi trạm dữ liệu đi qua là một câu hỏi pháp lý; dịch vụ trung gian thêm một người thứ ba.
5. Chi phí AI phải có trần do máy chủ giữ, theo giờ Việt Nam, đúng thứ tự kiểm tra, trừ lượt, gọi AI, hoàn lượt; thiếu cấu hình thì đóng với khách.
6. Gói miễn phí có điều kiện: tạm dừng, ngủ, giới hạn mục đích sử dụng.
7. Nhật ký chẩn đoán, sao lưu đã thử khôi phục, khôi phục bằng lần sửa mới, bảng ứng phó: phải có trước sự cố.
:::

## Câu hỏi suy ngẫm và bài tập

1. Dùng Câu lệnh mẫu 19.1 với kho mã của đồng chí. Tác tử AI tìm thấy điều gì mà đồng chí không nhớ là đã đưa lên?
2. Lập ma trận thử bốn vai cho một ứng dụng đang dùng. Vai nào thấy nhiều hơn mức cần thiết?
3. Vẽ đường đi của một câu hỏi trong ứng dụng có AI của đồng chí. Có bao nhiêu tổ chức chạm vào dữ liệu? Có thể bớt trạm nào?
4. Làm phép tính dự toán ở mục 19.4.3 cho một ứng dụng thật, với giá hiện hành. Trần lượt mỗi người nên là bao nhiêu?
5. Thử khôi phục một tệp sao lưu vào dự án thử. Mất bao lâu, vướng ở đâu?
6. Với vai trò lãnh đạo, đồng chí sẽ hỏi thêm câu gì ngoài ba câu ở hộp "Dành cho lãnh đạo" mục 19.6?
