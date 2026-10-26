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

Có một câu hỏi tôi tự đặt ra mỗi khi tác tử AI lập trình báo "đã xong": nếu sáng mai việc này lên mặt báo, tôi có ngủ yên không? Câu hỏi nghe có vẻ nặng nề. Nhưng nó giúp tôi nhìn ra những chỗ mà niềm vui "phần mềm chạy rồi" che khuất.

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi là Văn phòng), tại địa chỉ `https://hdndthkpi.vercel.app`, chạy trên ba nền tảng ở gói miễn phí, có kho mã nguồn công khai, có bot trả lời qua Telegram và Zalo, có ba lối gọi AI tốn tiền thật. Trong năm 2026, nó đã trải qua đủ ba loại rủi ro mà chương này bàn: suýt lộ dữ liệu, suýt mất dữ liệu, và có lúc chi phí bị "đốt" nhanh gấp đôi vì một lỗi không ai ngờ.

Tôi không viết chương này để dọa. Tất cả những gì dưới đây đều có cách phòng cụ thể, phần lớn chỉ là vài dòng cấu hình, vài câu lệnh giao việc rõ ràng và một thói quen kiểm tra. Cái khó không nằm ở kỹ thuật. Cái khó là nhớ làm, và làm trước khi sự cố xảy ra.

Xin giữ trong đầu hình ảnh quen thuộc từ Chương 2: ứng dụng web như một trụ sở. Giao diện là phòng tiếp dân, máy chủ là các phòng làm việc phía sau, cơ sở dữ liệu là kho lưu trữ hồ sơ, mã nguồn là bộ bản vẽ thiết kế. Chương này hỏi ba câu về trụ sở ấy: bản vẽ treo ở đâu và có ghi gì không nên ghi; ai được quẹt thẻ vào kho hồ sơ; và hóa đơn điện nước có chỗ nào chảy mà không ai khóa.

## 19.1. Kho mã công khai và những gì tuyệt đối không được nằm trong đó

### 19.1.1. Bản vẽ dán ở bảng tin ngoài cổng

Kho mã nguồn (repository) của hệ thống thử nghiệm để ở chế độ công khai trên GitHub. Ai có đường dẫn đều đọc được từng dòng mã. Tôi chọn như vậy vì ba lẽ: gói miễn phí dùng tốt với kho công khai, đồng nghiệp ở cơ quan khác học lại được, và Báo cáo mô tả sáng kiến nêu hướng nhân rộng.

Nhưng công khai có giá. Hãy hình dung bộ bản vẽ thiết kế trụ sở được dán ở bảng tin ngoài cổng. Không sao nếu bản vẽ chỉ có tường, cửa, cầu thang. Rất có sao nếu ai đó lỡ ghi lên bản vẽ mã số két sắt, danh sách điện thoại của lãnh đạo, hay chìa khóa kho đang treo ở móc nào.

Có hai điều người mới thường không biết.

Thứ nhất, không chỉ kho mã mới công khai. Mọi thứ trang web gửi xuống trình duyệt của người dùng cũng công khai. Ai bấm "Xem nguồn trang" hoặc mở công cụ dành cho nhà phát triển của trình duyệt đều thấy toàn bộ mã giao diện đã tải về. Vì vậy, một bí mật viết trong mã giao diện thì không còn là bí mật, kể cả khi kho mã để riêng tư.

Thứ hai, Git ghi lịch sử mọi lần sửa. Đó là điểm mạnh khi cần khôi phục (mục 19.5), nhưng là điểm yếu khi lỡ đưa nhầm. Một tệp chứa khóa bí mật bị xóa ở lần sửa sau vẫn còn nguyên trong lịch sử. Bản vẽ đã dán lên bảng tin một đêm thì phải coi như người ta đã chụp ảnh.

### 19.1.2. Bốn nhóm thứ không bao giờ được vào kho mã

| Nhóm | Ví dụ trong thực tế | Cất ở đâu cho đúng |
|---|---|---|
| Khóa bí mật | Khóa API của dịch vụ AI, khóa bí mật cơ sở dữ liệu, mã thông báo của bot | Biến môi trường trên máy chủ |
| Mật khẩu, mã truy cập | Mật khẩu quản trị, mã truy cập của đơn vị | Hệ thống đăng nhập; chỉ lưu chuỗi băm |
| Dữ liệu cá nhân thật | Danh bạ, hồ sơ lý lịch, bản tự đánh giá thật | Cơ sở dữ liệu có phân quyền |
| Tài liệu chưa công khai | Dự thảo chưa trình, tài liệu nội bộ, tài liệu mật | Không đưa vào hệ thống thử nghiệm |

Nhóm cuối cần nói thêm một câu. Tài liệu có độ mật không chỉ không được vào kho mã. Nó không được vào bất kỳ hệ thống nào chạy trên dịch vụ đám mây công cộng như Vercel, Supabase, GitHub. Đây không phải chuyện cẩn thận hay không cẩn thận, mà là ranh giới pháp luật (xem hộp Căn cứ pháp lý ở mục 19.3).

::: {.cauchuyen}
**Câu chuyện thực tế: danh bạ 111 số điện thoại và một tệp không bao giờ lên GitHub**

Khi làm danh bạ điện thoại cho phân hệ Quản lý cán bộ, tôi có trong tay tệp Word thật: 82 đại biểu Hội đồng nhân dân (HĐND) tỉnh và 29 cán bộ các Ban, Văn phòng. Cách nhanh nhất là bảo tác tử AI "nhúng danh sách này vào phần mềm". Nó sẽ làm ngay, và làm rất gọn.

Tôi không làm vậy. Thiết kế cuối cùng có ba điểm. Phần mềm chỉ chứa **bộ đọc** danh bạ, tức đoạn mã biết cách tách họ tên, chức vụ, số điện thoại từ tệp, nhưng không chứa một số nào. Quản trị tự nhập tệp từ máy mình, dữ liệu lưu thẳng vào dòng hồ sơ cán bộ trên máy chủ, nơi chỉ tài khoản quản trị đọc được. Tệp gốc bị danh sách loại trừ của Git chặn theo tên. Cuối cùng có một phép kiểm tự động khẳng định "không có số điện thoại nào trong mã nguồn".

Bộ đọc đã được thử trên tệp thật: tách đủ 111 mục, đúng hai nhóm. Cái giá phải trả: bot không có sẵn danh bạ, Quản trị phải nhập một lần. Tôi coi đó là cái giá rẻ.
:::

### 19.1.3. Ba lớp chặn: tệp `.env`, danh sách loại trừ, phép kiểm

**Lớp thứ nhất: khóa nằm ở biến môi trường, không nằm trong mã.** Biến môi trường (environment variable) giống phong bì niêm phong để ở phòng làm việc phía sau. Mã nguồn chỉ ghi "lấy khóa trong phong bì tên là `OPENAI_API_KEY`", không ghi bản thân khóa. Trên máy cá nhân, các phong bì này nằm trong tệp `.env`. Trên máy chủ Vercel, chúng được khai trong phần cài đặt của dự án.

Kho mã chỉ chứa tệp `.env.example`: danh sách tên các phong bì, mỗi tên kèm lời giải thích, giá trị để trống hoặc ghi mẫu. Người nhận bàn giao đọc tệp này là biết cần những khóa gì, lấy ở đâu, mà không thấy khóa thật nào.

Có một cái bẫy đặc thù của công cụ dựng giao diện Vite mà dự án dùng. Biến có tên bắt đầu bằng `VITE_` sẽ được **nhúng vào mã gửi xuống trình duyệt**. Tôi ví nó như phong bì đóng dấu "VITE_": bưu điện photo phát cho mọi nhà. Dự án chỉ để hai biến mang tiền tố này: địa chỉ cơ sở dữ liệu và khóa công khai (anon key) vốn được thiết kế để lộ, vì quyền thật do chính sách bảo mật của cơ sở dữ liệu quyết định (mục 19.2). Mọi khóa bí mật khác đều không có tiền tố đó, và chỉ được dùng trong các hàm máy chủ ở thư mục `api/`.

**Lớp thứ hai: danh sách loại trừ `.gitignore`.** Đây là tờ danh sách "không được mang ra khỏi phòng" mà Git đọc trước khi đóng gói. Tệp `.gitignore` của dự án chặn `.env`, chặn mọi tệp có chữ "danh bạ" trong thư mục tài liệu, chặn cả thư mục chứa hồ sơ đánh giá cá nhân dùng làm mẫu. Mỗi dòng chặn đều có chú thích tiếng Việt nói rõ vì sao, để người sau không "dọn" nhầm.

**Lớp thứ ba: phép kiểm tự động.** Quy tắc viết bằng lời thì có ngày quên. Phép kiểm thì chạy mỗi lần. Dự án có phép kiểm dò mã nguồn tìm chuỗi có dạng số điện thoại, phép kiểm khẳng định kiến thức tĩnh của bot không chứa mật khẩu, phép kiểm khẳng định danh sách loại trừ vẫn còn dòng chặn danh bạ.

::: {.canhbao}
**Cảnh báo: quy ước ghi ra giấy mà máy không thực thi**

Đọc lại kho mã khi viết sách, tôi tìm thấy chính lỗi mà mình hay nhắc người khác. Quy ước dự án ghi "không commit thư mục `scratch/`" (thư mục nháp thử nghiệm), nhưng danh sách loại trừ lại không chặn thư mục này. Kết quả: một tệp thử nghiệm đã nằm trong kho công khai, có ghi địa chỉ dự án cơ sở dữ liệu và khóa công khai. Khóa công khai vốn để lộ nên chưa gây hại. Nhưng nếu hôm đó tôi thử bằng khóa bí mật thì sao?

Cũng vậy, tài khoản trình diễn viết sẵn trong mã giao diện không còn là bí mật, dù màn đăng nhập không hiển thị nó. Bản demo chấp nhận điều này chỉ vì chế độ đó không ghi được lên máy chủ. Trước khi dùng thật: xóa tài khoản viết sẵn, đổi toàn bộ mật khẩu và khóa.
:::

::: {.thuchanh}
**Thực hành: khi lỡ đẩy một khóa bí mật lên kho mã**

1. Bình tĩnh, nhưng làm ngay. Đừng mất thời gian tìm cách xóa dấu vết trước.
2. Vào trang quản trị của dịch vụ đã cấp khóa (nhà cung cấp AI, Supabase, Telegram…), **thu hồi khóa cũ và tạo khóa mới**. Đây là bước quyết định: khóa cũ vô hiệu thì người nhặt được cũng không dùng được.
3. Khai khóa mới vào biến môi trường trên Vercel và trong tệp `.env` của từng máy, rồi triển khai lại.
4. Xem nhật ký sử dụng của dịch vụ trong khoảng thời gian khóa bị lộ: có lượt gọi lạ, có hóa đơn tăng bất thường không.
5. Thêm tên tệp hoặc mẫu tên vào `.gitignore`, thêm một phép kiểm để lần sau máy tự chặn.
6. Ghi sự việc vào nhật ký thay đổi của dự án, báo lãnh đạo nếu khóa thuộc tài khoản của cơ quan.
:::

::: {.lenhmau}
**Câu lệnh mẫu 19.1 — Rà soát kho mã tìm thứ không được công khai**

```text
VAI: Kiểm tra viên an toàn thông tin của dự án [tên dự án].
BỐI CẢNH: Kho mã này để CÔNG KHAI trên GitHub. Mã giao diện tải
xuống trình duyệt cũng công khai.
VIỆC: Rà toàn bộ kho mã VÀ lịch sử commit, tìm:
1. Khóa API, khóa bí mật, mã thông báo, mật khẩu, mã truy cập.
2. Số điện thoại, số định danh, email cá nhân, họ tên đi kèm
   điểm số hoặc nhận xét về một người cụ thể.
3. Biến môi trường mang tiền tố VITE_ mà chứa thứ không nên lộ.
4. Tệp tài liệu nội bộ, tệp nháp, tệp thử nghiệm lẽ ra phải chặn.
5. Quy ước trong CLAUDE.md mà .gitignore chưa thực thi.
DẠNG: bảng 4 cột: Vị trí (tệp, dòng hoặc mã commit) – Loại –
Mức độ (Nghiêm trọng/Trung bình/Nhỏ) – Đề xuất xử lý.
RÀNG BUỘC: CHỈ ĐỌC, không sửa, không xóa, không commit. Không in
nguyên giá trị khóa hay số điện thoại vào báo cáo, chỉ ghi 4 ký
tự đầu và che phần còn lại.
NGHIỆM THU: nêu riêng mục nào cần đổi khóa ngay, rồi dừng lại chờ
tôi quyết định.
```
:::

## 19.2. Phân quyền đọc, ghi ở tầng cơ sở dữ liệu

### 19.2.1. Thẻ ra vào: chính sách bảo mật theo dòng giải thích bằng hình ảnh

Hãy hình dung kho lưu trữ của trụ sở có nhiều ngăn hồ sơ. Mỗi ngăn dán một tờ quy định: ai được quẹt thẻ mở ngăn này để xem, ai được mở để thêm, sửa. Người bảo vệ đứng **ngay tại cửa kho**, đọc thẻ của từng người, đối chiếu với tờ quy định rồi mới mở. Biển chỉ dẫn ngoài hành lang có ghi hay không ghi "Phòng lưu trữ" thì không ảnh hưởng gì đến việc bảo vệ.

Chính sách bảo mật theo dòng (Row Level Security, viết tắt RLS) của cơ sở dữ liệu PostgreSQL mà Supabase cung cấp hoạt động đúng như vậy. Mỗi "dòng" dữ liệu là một ngăn hồ sơ. Mỗi chính sách là một tờ quy định. "Thẻ" là phiên đăng nhập: chưa đăng nhập là thẻ khách, đã đăng nhập thì thẻ ghi rõ email của người đó.

Hệ thống thử nghiệm dồn toàn bộ dữ liệu vào một bảng tên `app_state`, mỗi dòng là một khối hồ sơ. Bản đồ quyền rút gọn như sau:

| Ngăn hồ sơ (dòng) | Ai được xem | Ai được ghi |
|---|---|---|
| Kỳ đánh giá cán bộ | Mọi người (đang mở cho demo) | Người đã đăng nhập |
| Hồ sơ cán bộ, danh bạ | Chỉ tài khoản quản trị | Chỉ tài khoản quản trị |
| Kiến nghị cử tri của Trợ lý AI | Chỉ người đã đăng nhập | Người đã đăng nhập |
| Tiêu chí HĐND, Biểu quyết | Mọi người | Quản trị; người khác qua "ô cửa hẹp" |
| Bộ đếm hạn mức AI | Chỉ máy chủ | Chỉ máy chủ |

Nguyên tắc rút ra từ bảng: **phân quyền thật nằm ở cửa kho, không nằm ở biển chỉ dẫn.** Giao diện ẩn hay hiện một nút chỉ là biển chỉ dẫn, giúp người dùng đỡ rối. Còn quyết định ai đọc được gì là việc của chính sách trong cơ sở dữ liệu.

### 19.2.2. Ẩn một tab không phải là khóa cửa

Phân hệ Quản lý cán bộ chứa ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình của từng người. Tab này chỉ hiện với tài khoản quản trị. Trong một thời gian, tôi yên tâm vì "người khác có thấy đâu".

Rà lại, tôi nhận ra chính sách chung cũ cho **mọi** tài khoản đã đăng nhập đọc, ghi **mọi** dòng. Một cán bộ có tài khoản, nếu biết cách gọi thẳng cửa giao dịch dữ liệu (API) mà không đi qua giao diện, vẫn đọc được dòng hồ sơ cán bộ. Biển chỉ dẫn đã gỡ, nhưng cửa kho vẫn mở.

Cái bẫy thứ hai tinh vi hơn. Các chính sách RLS **cộng dồn theo kiểu "hoặc"**: chỉ cần một chính sách cho phép là được vào. Thêm một tờ "Chỉ quản trị được vào" trong khi tờ "Mời mọi người đã đăng nhập vào tự do" vẫn treo thì tờ mới vô tác dụng. Cách làm đúng ở bước 4 của tệp lược đồ cơ sở dữ liệu là **sửa chính sách chung cũ để loại riêng dòng hồ sơ cán bộ ra**, rồi mới thêm chính sách chỉ cho hai email quản trị. Ngay trong tệp có dòng ghi chú: chưa chạy bước này thì hồ sơ không được bảo vệ trước tài khoản đăng nhập khác.

### 19.2.3. "Ô cửa hẹp": cho người không có tài khoản làm đúng một việc

Có những lúc phải cho người không có tài khoản ghi dữ liệu. Đại biểu bỏ phiếu ở phân hệ Biểu quyết không cần đăng nhập. HĐND các xã, phường đăng nhập phân hệ Tiêu chí bằng mã đơn vị và mã truy cập, không có tài khoản Supabase. Mở quyền ghi chung cho khách thì ai cũng ghi đè được cả bảng kết quả.

Lời giải là "ô cửa hẹp": một hàm chạy trên máy chủ cơ sở dữ liệu, mang quyền của chủ bảng nhưng chỉ làm **đúng một việc** và kiểm tra kỹ đầu vào. Hàm bỏ phiếu chỉ sửa một lá phiếu của một đại biểu trong một phiên đang mở, từ chối lựa chọn lạ, mã đại biểu sai dạng, phiên đã khóa. Hàm ghi phiếu tiêu chí chỉ ghi đúng phiếu của đơn vị có mã truy cập khớp. Hàm đếm lượt truy cập chỉ cộng thêm 1. Giống như không giao chìa khóa kho cho khách, chỉ khoét một khe bỏ phiếu trên thùng phiếu.

Mã truy cập của xã, phường cũng không được lưu dạng chữ rõ, vì dòng dữ liệu tiêu chí đang mở cho mọi người xem. Hệ thống chỉ lưu **chuỗi băm** SHA-256 của "mã đơn vị::mã truy cập". Chuỗi băm giống dấu vân tay: nhìn vân tay xác nhận được đúng người, nhưng không dựng lại được bàn tay. Khi đơn vị đăng nhập, máy băm mã vừa gõ rồi so với chuỗi đã lưu. Cùng cách đó, khóa đếm lượt AI của khách là chuỗi băm của địa chỉ IP kèm thông tin trình duyệt; hệ thống không lưu địa chỉ IP gốc.

### 19.2.4. Mở cho demo thì phải viết sẵn cách đóng

Để khách và quản trị thấy cùng một bảng điểm, bước 6 của tệp lược đồ mở quyền **đọc**, không mở quyền ghi, cho các dòng kỳ đánh giá. Ngay dưới câu lệnh mở có một dòng viết hoa: *"KHI CHUYỂN SANG DÙNG THẬT: xóa chính sách này"*, kèm sẵn câu lệnh gỡ. Tôi coi đây là kỷ luật bắt buộc: mỗi quyết định "mở cho tiện trình diễn" phải đi kèm lối đóng được viết ra ngay tại chỗ.

Ngược lại, có ngăn hồ sơ cố ý không bao giờ mở. Dòng kiến nghị cử tri của phân hệ Trợ lý AI có tên người dân và địa bàn, nên chỉ người đã đăng nhập mới đọc được. Khách vào phân hệ sẽ thấy danh sách trống. Trong tệp lược đồ có ghi chú dặn người sau: đó là đúng thiết kế, đừng "sửa" bằng cách thêm quyền đọc công khai. Lời dặn này viết cho người, nhưng cũng là viết cho tác tử AI: nó đọc tệp, thấy lời dặn thì không tự ý "chữa" một điều vốn không phải lỗi.

::: {.phaply}
**Căn cứ pháp lý: dữ liệu cá nhân trong ứng dụng tự làm**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, Quốc hội thông qua ngày 26/6/2025, hiệu lực từ 01/01/2026. Luật phân dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.
- Nghị định 356/2025/NĐ-CP ngày 31/12/2025 quy định chi tiết Luật, hiệu lực 01/01/2026; theo khoản 2 Điều 42, Nghị định 13/2023/NĐ-CP hết hiệu lực từ ngày đó.
- Điều 3 Nghị định 356/2025/NĐ-CP liệt kê dữ liệu cá nhân cơ bản, trong đó có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình. Khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tình trạng sức khỏe, dữ liệu về tội phạm, vi phạm pháp luật, tên đăng nhập và mật khẩu tài khoản định danh điện tử.
- Nghị định 330/2026/NĐ-CP ngày 19/8/2026 quy định xử phạt vi phạm hành chính trong lĩnh vực an ninh mạng và bảo vệ dữ liệu cá nhân, hiệu lực từ ngày ký. Đây là lần đầu có cơ chế xử phạt riêng cho vi phạm về bảo vệ dữ liệu cá nhân; ví dụ, hành vi tự coi sự im lặng của chủ thể dữ liệu là đồng ý bị phạt từ 50 đến 70 triệu đồng.

Như vậy, một danh bạ hay một bộ hồ sơ Mẫu 2C là dữ liệu cá nhân theo đúng nghĩa của pháp luật, không phải "thông tin nội bộ bình thường". Việc xử phạt đối với cơ quan nhà nước còn theo pháp luật về xử lý vi phạm hành chính; trước khi áp dụng, đồng chí cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

Một chi tiết nhỏ cho thấy pháp luật đổi nhanh thế nào. Tài liệu Đặc tả yêu cầu phần mềm của dự án, đề tháng 7/2026, còn nêu Nghị định 13/2023/NĐ-CP làm căn cứ về bảo vệ dữ liệu cá nhân. Đến lúc đó, nghị định này đã hết hiệu lực được nửa năm. Đó là lý do mỗi tài liệu của dự án cần một dòng "pháp luật đối chiếu đến ngày…", và cần được rà lại định kỳ.

### 19.2.5. Thử bằng cả vai khách và vai quản trị

Quy ước của dự án có một dòng bắt buộc: đổi quyền đọc, ghi thì phải xem lại chính sách trong cơ sở dữ liệu và **thử cả vai khách lẫn vai quản trị**. Tôi mở rộng thành bốn vai, vì sự cố "khách và quản trị thấy hai danh sách khác nhau" kể ở Chương 9 chỉ lộ ra khi tôi đăng nhập song song hai tài khoản để so.

::: {.thuchanh}
**Thực hành: ma trận thử quyền bốn vai**

1. Chuẩn bị bốn cửa sổ trình duyệt, trong đó ít nhất hai cửa sổ ẩn danh để không dùng chung phiên đăng nhập: khách chưa đăng nhập; cán bộ thường đã đăng nhập; quản trị; người dùng đặc biệt (đơn vị xã, phường hoặc đại biểu bỏ phiếu).
2. Với mỗi ngăn hồ sơ trong bảng ở mục 19.2.1, ghi ra giấy: vai nào **phải thấy**, vai nào **không được thấy**, vai nào **được sửa**.
3. Mở cùng một phân hệ ở bốn cửa sổ. So số người, số đơn vị, số liệu hiển thị. Phải giống nhau ở phần được xem.
4. Ở vai khách và cán bộ thường, thử thao tác sửa, lưu. Phải bị từ chối, và giao diện phải báo rõ, không im lặng.
5. Nhờ tác tử AI kiểm tra phần không nhìn thấy bằng mắt: gọi thẳng cửa giao dịch dữ liệu bằng thẻ của từng vai (Câu lệnh mẫu 19.2).
6. Ghi kết quả thành một bảng, lưu vào thư mục tài liệu của dự án. Lần sau đổi quyền, chạy lại đúng bảng này.
:::

::: {.lenhmau}
**Câu lệnh mẫu 19.2 — Kiểm tra phân quyền theo vai, không đoán**

```text
VAI: Kiểm tra viên phân quyền của dự án [tên dự án].
BỐI CẢNH: Dữ liệu nằm trong [Supabase / tên cơ sở dữ liệu]. Quyền
được quy định bởi các chính sách RLS trong [tệp lược đồ]. Có các
vai: khách, cán bộ đã đăng nhập, quản trị, [vai đặc biệt].
VIỆC:
1. Đọc toàn bộ chính sách, lập bảng: từng dòng hoặc bảng dữ liệu,
   vai nào đọc được, vai nào ghi được. Lưu ý các chính sách cộng
   dồn theo kiểu "hoặc".
2. Chỉ ra mọi chỗ giao diện "ẩn nút" nhưng cơ sở dữ liệu vẫn cho
   phép.
3. Viết kịch bản kiểm thử tự động đăng nhập bằng tài khoản thử
   của từng vai, gọi thẳng API đọc và ghi, ghi lại kết quả thật.
RÀNG BUỘC: không sửa chính sách, không dùng dữ liệu thật, không
dùng khóa bí mật bỏ qua RLS trong kịch bản thử của các vai.
NGHIỆM THU: bảng so sánh "quyền dự kiến" với "kết quả chạy thật";
dòng nào lệch tô đỏ và đề xuất cách sửa, chờ tôi duyệt.
```
:::

## 19.3. Khóa API, dịch vụ AI và dịch vụ trung gian: dữ liệu đi đâu khi gửi cho AI

### 19.3.1. Khóa API là chìa khóa kèm sổ séc đã ký sẵn

Khóa API (API key) của dịch vụ AI là một chuỗi ký tự dài. Mỗi lần ứng dụng gọi AI, nó đưa chuỗi này ra để chứng minh "tôi là khách hàng có tài khoản", và nhà cung cấp tính tiền vào tài khoản đó. Tôi ví khóa API như chìa khóa kèm một cuốn sổ séc đã ký sẵn: ai cầm được thì vừa mở được cửa, vừa chi được tiền của chủ tài khoản.

Khóa bí mật của cơ sở dữ liệu còn nặng hơn. Nó **bỏ qua toàn bộ chính sách RLS** đã dày công thiết lập ở mục 19.2, giống chìa khóa vạn năng của trưởng kho. Bot chat và bộ đếm hạn mức của hệ thống cần chìa khóa này để làm việc, nên nó chỉ được nằm ở máy chủ, không bao giờ mang tiền tố `VITE_`, không bao giờ dán vào khung chat với AI để "nhờ xem giúp sao lỗi".

Năm quy tắc giữ khóa tôi áp dụng:

1. Khóa chỉ nằm ở biến môi trường của máy chủ và tệp `.env` trên máy cá nhân.
2. Mỗi ứng dụng một khóa riêng, để khi phải thu hồi thì không làm sập ứng dụng khác.
3. Nếu nhà cung cấp cho đặt hạn mức chi tiêu hằng tháng trên trang quản trị, hãy đặt ngay từ ngày đầu, ở mức thấp.
4. Người rời dự án hoặc chuyển công tác thì thu hồi khóa họ từng biết. Đây cũng đúng tinh thần hướng dẫn của Bộ Khoa học và Công nghệ về tài khoản chatbot của công chức (hộp Căn cứ pháp lý dưới đây).
5. Trang tình trạng của ứng dụng chỉ được hiện **tên miền** của dịch vụ AI đang dùng và tên mô hình, không bao giờ hiện khóa. Lệnh `/trangthai` của bot Văn phòng làm đúng như vậy.

### 19.3.2. Vẽ đường đi của một câu hỏi

Người mới thường nghĩ: tôi hỏi AI, AI trả lời, thế thôi. Thực tế, một câu hỏi gửi cho bot của Văn phòng đi qua nhiều trạm, mỗi trạm là một nơi dữ liệu có thể được ghi lại. Hãy đi theo một câu hỏi giả định: "Tuần này lịch công tác của Thường trực có gì?".

1. **Điện thoại của người hỏi** → máy chủ của **Telegram** hoặc **Zalo**. Nền tảng nhắn tin nhận và lưu tin theo chính sách của họ.
2. Nền tảng nhắn tin chuyển tin đến **hàm máy chủ trên Vercel** của Văn phòng.
3. Hàm máy chủ đọc **cơ sở dữ liệu** của hệ thống và của phân hệ Lịch công tác. Cơ sở dữ liệu Supabase của hệ thống đặt ở khu vực Singapore.
4. Hàm máy chủ ghép **lời dẫn**: hiểu biết tĩnh về hệ thống, số liệu vừa đọc, vài lượt hội thoại gần nhất, rồi gửi cho **nhà cung cấp AI**.
5. Nếu dùng **dịch vụ trung gian**, toàn bộ lời dẫn đi qua máy chủ của bên trung gian trước khi tới nhà cung cấp AI.
6. Câu trả lời đi ngược lại đúng con đường đó.

Như vậy, câu hỏi về lịch công tác của lãnh đạo, kèm số liệu lịch nạp theo, đã đi qua ít nhất bốn tổ chức khác nhau, phần lớn ở nước ngoài. Với bản demo dùng dữ liệu mô phỏng, đó là cái giá chấp nhận được. Với dữ liệu thật, nhất là dữ liệu cá nhân, mỗi trạm là một câu hỏi pháp lý: dữ liệu được lưu bao lâu, có bị dùng để huấn luyện mô hình không, có ra khỏi lãnh thổ Việt Nam không. Pháp luật về bảo vệ dữ liệu cá nhân có quy định riêng về chuyển dữ liệu cá nhân ra nước ngoài; trước khi đưa dữ liệu thật vào một đường đi như trên, cần hỏi đơn vị chuyên trách và tra nguyên văn.

Từ hình vẽ này, bot của Văn phòng áp một nguyên tắc tôi cho là quan trọng nhất của cả chương: **không đưa vào lời dẫn chắc hơn dặn AI đừng nói ra.** Bộ gom số liệu phân tầng ngay từ đầu. Hồ sơ nhân sự chỉ được nạp khi người hỏi là quản trị. Kể cả khi đó, số căn cước, số sổ bảo hiểm, quan hệ gia đình cũng không bao giờ được nạp. Người dùng Zalo không bao giờ được coi là quản trị. Danh bạ mở cho người dùng bot đã được duyệt, nhưng tắt mặc định ở khung chat khách vô danh trên Trang chủ. Lời dặn "đừng tiết lộ" trong lời nhắc hệ thống chỉ là lớp bảo vệ thứ hai.

::: {.lenhmau}
**Câu lệnh mẫu 19.3 — Lập bản đồ đường đi của dữ liệu**

```text
VAI: Chuyên viên an toàn dữ liệu của dự án [tên dự án].
VIỆC: Đọc mã nguồn và liệt kê MỌI nơi dữ liệu rời khỏi máy người
dùng. Với từng luồng (đăng nhập, lưu dữ liệu, gọi AI, bot chat,
gửi tệp, gọi hệ thống ngoài), lập bảng:
- Trạm đi qua (tên dịch vụ, tên miền, khu vực máy chủ nếu mã có ghi).
- Loại dữ liệu đi qua (họ tên, điểm, số điện thoại, nội dung văn
  bản, câu hỏi tự do).
- Dữ liệu cá nhân hay không; nếu có thì cơ bản hay nhạy cảm.
- Có cách nào bớt dữ liệu gửi đi mà không mất chức năng không.
RÀNG BUỘC: chỉ đọc mã, không sửa. Điều gì mã không thể hiện (chính
sách lưu trữ của nhà cung cấp, vị trí máy chủ của họ) thì ghi
"cần hỏi nhà cung cấp", không đoán.
NGHIỆM THU: kết thúc bằng 3 đề xuất giảm dữ liệu gửi cho AI, xếp
theo mức giảm rủi ro.
```
:::

### 19.3.3. Dịch vụ trung gian: rẻ, tiện, và thêm một người thứ ba

Có giai đoạn tôi mua khóa của một dịch vụ trung gian "tương thích OpenAI": giá rẻ, thanh toán dễ, gọi được nhiều mô hình qua một cửa. Mã gốc của bot gọi cứng địa chỉ của OpenAI, nên tác tử AI phải thêm biến `AI_BASE_URL` để đổi địa chỉ gọi. Về kỹ thuật, việc này chỉ mất vài dòng.

Về dữ liệu, đó là một quyết định khác hẳn. Mọi câu hỏi và mọi số liệu nạp kèm, gồm họ tên, chức vụ, điểm, xếp loại cán bộ, lịch công tác của lãnh đạo, đều đi qua máy chủ của một bên mà tôi không có hợp đồng, không rõ chính sách lưu trữ và ghi nhật ký. Giống như gửi công văn qua một dịch vụ chuyển phát giá rẻ mà không biết ai bóc phong bì dọc đường.

Dự án xử lý theo ba hướng. Vẫn hỗ trợ kỹ thuật, nhưng ghi cảnh báo in đậm ở đầu tệp bộ nối AI và trong tài liệu hướng dẫn cài bot. Lệnh `/trangthai` hiện tên miền đang dùng để ai cũng biết dữ liệu đang đi đâu. Và khuyến nghị dứt khoát: dữ liệu thật thì dùng khóa của nhà cung cấp gốc theo hợp đồng của cơ quan, hoặc ít nhất hỏi rõ chính sách lưu trữ của bên trung gian.

Dịch vụ trung gian còn có một cái giá không ai quảng cáo: tốc độ. Chính dịch vụ trung gian trả lời chậm đã khiến trần chờ 45 giây trong bộ nối AI bị chạm thường xuyên, sinh ra thông báo lỗi khó hiểu và chuỗi trả lời lặp kể ở mục 19.5.

### 19.3.4. Tài khoản AI cá nhân của cán bộ: chỉnh cài đặt trước khi gõ chữ đầu tiên

Không phải ai cũng làm ứng dụng, nhưng hầu như ai cũng dùng trợ lý AI trò chuyện. Ở đây, rủi ro nằm trong phần cài đặt mà ít người mở ra xem.

Theo trang giá và thông báo cập nhật điều khoản của Anthropic mà tôi đọc ngày 26/10/2026, các gói cá nhân Free, Pro, Max của Claude áp dụng cơ chế người dùng tự chọn có cho dùng dữ liệu để huấn luyện mô hình hay không; gói Team và Enterprise mặc định không huấn luyện trên nội dung. Nếu để bật, dữ liệu được lưu 5 năm; nếu tắt, thời hạn lưu là 30 ngày. Cách tắt: vào phần cài đặt quyền riêng tư (Privacy) và tắt mục cho phép dùng dữ liệu để cải thiện Claude. Tên mục có thể khác đôi chút tùy phiên bản.

ChatGPT và Gemini cũng có mục tương tự trong phần cài đặt kiểm soát dữ liệu hoặc hoạt động. Tên nút đổi theo từng đợt cập nhật, nên tôi không ghi cố định ở đây. Thói quen đúng là: **tạo tài khoản xong, việc đầu tiên là mở Cài đặt → Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt mục cho phép huấn luyện.** Tập 1 đã nhắc điều này; Tập 2 xin nhắc lại vì giờ đây chúng ta còn dán cả mã nguồn, cả cấu trúc dữ liệu của cơ quan vào khung chat.

Với Sổ tay AI chạy trên Gemini Notebook (trước đây là NotebookLM), nguồn tải lên được lưu trên máy chủ của Google. Vì vậy Văn phòng chỉ nạp văn bản đã công khai và chia sẻ cho cán bộ theo quyền chỉ xem. Kiểu liên kết "chỉ hiện khung chat" mà Google cung cấp, theo chính trang trợ giúp của họ, không thu hồi quyền truy cập vào nguồn. Nó tiện, nhưng không phải cơ chế bảo mật.

::: {.phaply}
**Căn cứ pháp lý: những gì không được đưa lên AI**

- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, Quốc hội thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026. Điều 5 quy định các hành vi bị nghiêm cấm; khoản 10 cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước. Cũng tại Điều 5 có quy định cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu.
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ hướng dẫn công chức, viên chức dùng chatbot AI: không đưa lên chatbot dữ liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; tránh dùng tên, mật khẩu trùng tài khoản công vụ; thu hồi khóa hoặc hủy tài khoản khi cán bộ nghỉ việc, chuyển công tác.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, triển khai theo Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI; ưu tiên nền tảng do Việt Nam phát triển và làm chủ khi xử lý dữ liệu nội bộ, nhạy cảm.

Pháp luật không cấm cán bộ dùng AI. Pháp luật cấm đưa bí mật nhà nước lên, và yêu cầu bảo vệ dữ liệu cá nhân, thông tin nội bộ. Đây là thông điệp cân bằng cần truyền đạt cho cán bộ mới.
:::
