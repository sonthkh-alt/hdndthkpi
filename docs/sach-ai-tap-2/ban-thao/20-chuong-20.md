# Chương 20. Từ bản demo đến hệ thống chính thức — và những bài học xương máu

::: {.muctieu}
**Mục tiêu của chương**

- Phân biệt rõ một bản demo thử nghiệm với một hệ thống thông tin chính thức của cơ quan ở năm khía cạnh: pháp lý, hạ tầng, an toàn thông tin theo cấp độ, trách nhiệm và hỗ trợ vận hành.
- Nắm con đường sáu bước để đưa một ứng dụng tự làm thành hệ thống chính thức, từ xin chủ trương đến chuyển giao, đào tạo và đăng ký sáng kiến, nhiệm vụ.
- Ghi nhớ ba mươi bài học rút ra từ những sự cố có thật của hệ thống thử nghiệm của Văn phòng, để người đi sau không phải trả giá lần thứ hai.
- Nhìn thấy bốn xu hướng sắp tới và những điều kiện cần chuẩn bị từ bây giờ.

Dành cho: lãnh đạo Văn phòng, lãnh đạo các Ban khi phải quyết định có chính thức hóa một công cụ hay không; cán bộ đã tự làm ứng dụng và muốn đưa vào dùng chung; đơn vị chuyên trách công nghệ thông tin sẽ tiếp nhận. Lãnh đạo nên đọc kỹ mục 20.1, 20.2 và hộp "Dành cho lãnh đạo".
:::

Mười chín chương trước chủ yếu kể chuyện làm. Chương cuối này kể chuyện dừng lại, nhìn lại, rồi đi tiếp cho đúng đường.

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), tại địa chỉ `https://hdndthkpi.vercel.app`, đến cuối tháng 10/2026 có 12 thẻ phân hệ trên Trang chủ, khoảng 21.400 dòng mã, hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự chạy mỗi sáng. Ở đầu trang, màn đăng nhập và chân trang vẫn có một dòng chữ: *"Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu"*.

Nhiều đồng chí hỏi tôi bao giờ thì bỏ dòng chữ ấy. Dòng chữ ấy không phải lời khiêm tốn xã giao; nó mô tả đúng tình trạng pháp lý và kỹ thuật của hệ thống hôm nay. Chỉ được bỏ nó khi đã đi hết con đường mô tả trong chương này, không sớm hơn một ngày.

## 20.1. Bản demo và hệ thống chính thức khác nhau thế nào

### 20.1.1. Bản demo của Văn phòng đang đứng ở đâu

Trước khi so sánh, tôi xin kể trung thực hệ thống thử nghiệm đang chạy trên những gì.

Mã nguồn nằm trong một kho mã nguồn (repository) công khai trên GitHub. Giao diện và các hàm máy chủ chạy trên Vercel; cơ sở dữ liệu (database) là Supabase, máy chủ đặt tại khu vực Singapore; cả hai đều ở gói miễn phí. Toàn bộ dữ liệu nằm trong một bảng duy nhất. Phần lớn số liệu hiển thị là dữ liệu mô phỏng. Một số dòng dữ liệu được mở quyền đọc công khai để khách và quản trị thấy cùng một dữ liệu; mã giao diện có sẵn tài khoản dùng thử. Tôi là quản trị gốc, các tài khoản dịch vụ đứng tên tôi, và tôi cũng là người duy nhất hiểu toàn bộ hệ thống.

Tệp hướng dẫn gốc của kho mã có một câu tôi coi là "giấy khai sinh" của bản demo: *"Khi dùng thật với dữ liệu thật → chuyển sang máy chủ nội bộ cơ quan"*. Câu ấy được viết từ những ngày đầu, đến nay vẫn đúng.

::: {.cauchuyen}
**Câu chuyện thực tế: một lối ra được viết sẵn từ ngày mở cửa**

Có lần tôi đăng nhập bằng hai tài khoản để so sánh và thấy tài khoản khách hiện một danh sách cán bộ, tài khoản quản trị hiện danh sách khác. Nguyên nhân: khách bị chặn đọc nên phần mềm tự dựng danh sách mẫu ngay trên máy của khách.

Cách sửa cho bản demo là mở quyền ĐỌC công khai cho bảng điểm các kỳ, không mở quyền ghi; từ đó có nguyên tắc "dữ liệu demo = dữ liệu chính thống". Nhưng ngay dưới đoạn lệnh mở quyền, tệp lược đồ cơ sở dữ liệu có dòng cảnh báo: *"KHI CHUYỂN SANG DÙNG THẬT: xóa chính sách này"*, kèm sẵn câu lệnh gỡ.

Mỗi quyết định "cho tiện trình diễn" là một khoản nợ phải trả trước ngày chính thức. Ghi nợ ra giấy thì trả được. Không ghi thì quên, và người tiếp nhận sau này không thể biết.
:::

### 20.1.2. Năm khác biệt cốt lõi

| Khía cạnh | Bản demo thử nghiệm | Hệ thống chính thức |
|---|---|---|
| Pháp lý | Công cụ tham khảo, mang nhãn demo | Có quyết định đưa vào sử dụng, có quy chế |
| Hạ tầng | Gói miễn phí, tài khoản cá nhân | Hạ tầng được phép, tài khoản của cơ quan |
| An toàn thông tin | Chưa xác định cấp độ | Hồ sơ cấp độ đã thẩm định |
| Trách nhiệm | Người làm tự chịu | Có chủ quản, có người phụ trách từng phần |
| Hỗ trợ | Sửa khi người làm rảnh | Có người trực, sao lưu, quy trình sự cố |

**Thứ nhất, về pháp lý.** Bản demo là công cụ hỗ trợ, kết quả chỉ để tham khảo. Luật Giao dịch điện tử số 20/2023/QH15 (hiệu lực 01/7/2024) thừa nhận giá trị pháp lý của thông điệp dữ liệu, nhưng điều đó không biến một tệp Word do phần mềm xuất ra thành văn bản đã ban hành. Phiếu đánh giá, biên bản biểu quyết chỉ có giá trị khi người có thẩm quyền ký, ban hành theo quy trình văn thư và thể thức của Nghị định 30/2020/NĐ-CP. Hệ thống chính thức được đưa vào sử dụng bằng quyết định của cấp có thẩm quyền, có quy chế vận hành. Riêng biểu quyết tại kỳ họp phải theo Quy chế làm việc của HĐND; một ứng dụng tự làm không thay được hệ thống biểu quyết chính thức.

**Thứ hai, về hạ tầng.** Gói miễn phí có giá của nó. Theo tài liệu của Supabase (tra cứu ngày 26/10/2026), dự án ở gói miễn phí bị tạm dừng sau một tuần không hoạt động; gói trả phí từ 25 USD/tháng thì không bị tạm dừng (giá tham khảo tại thời điểm viết, có thể thay đổi). Phân hệ Một dữ liệu trên gói miễn phí của Render "ngủ" sau khoảng 15 phút không ai dùng, lần mở đầu mất 30 đến 60 giây. Điều khoản của nhiều gói miễn phí giới hạn cho mục đích cá nhân, phi thương mại. Và máy chủ cơ sở dữ liệu đặt ở nước ngoài: khi có dữ liệu cá nhân thật, việc chuyển dữ liệu ra nước ngoài phải được đánh giá theo pháp luật về bảo vệ dữ liệu cá nhân.

**Thứ ba, về an toàn thông tin theo cấp độ.** Từ 01/7/2026, Luật An ninh mạng số 116/2025/QH15 có hiệu lực; Nghị định 331/2026/NĐ-CP quy định tiêu chí xác định cấp độ hệ thống thông tin từ 1 đến 5 và biện pháp bảo vệ tương ứng. Bản demo chạy dữ liệu mô phỏng nên chưa đặt ra câu hỏi cấp độ; hệ thống chính thức phải trả lời bằng một hồ sơ được thẩm định. Khung cũ theo Nghị định 85/2016/NĐ-CP nay chỉ còn được viện dẫn ở quy định chuyển tiếp; đồng chí nên tra tình trạng hiệu lực trước khi dùng làm căn cứ.

**Thứ tư, về trách nhiệm.** Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực 01/3/2026) phân biệt nhà phát triển, nhà cung cấp, bên triển khai và người sử dụng hệ thống AI (Điều 3). Cán bộ dùng trợ lý AI trò chuyện để soạn văn bản là người sử dụng. Khi cán bộ ấy tự làm một ứng dụng có gọi AI rồi đưa đồng nghiệp dùng, vai trò của cơ quan và của chính người làm có thể đã khác. Khoản 2 Điều 4 của Luật nói rõ: *"Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người"*. Ở bản demo, trách nhiệm dồn về một người; ở hệ thống chính thức, Nghị định 331/2026/NĐ-CP yêu cầu một chủ quản duy nhất, và bên trong phải rõ ai lo nghiệp vụ, ai lo kỹ thuật, ai lo dữ liệu.

**Thứ năm, về hỗ trợ vận hành.** Sáng 10/9/2026 bản tin pháp luật không ra; khi bot Zalo trả lời hai lần một câu hỏi, người sửa cũng là tôi. Bản đặc tả yêu cầu phần mềm Văn phòng soạn tháng 7/2026 cho thấy hệ thống chính thức phải đáp ứng những gì: phản hồi thao tác thông thường không quá 03 giây, chịu tải cao điểm các ngày 24 đến 28 hằng tháng, sao lưu tự động hằng ngày, nhật ký toàn bộ thao tác tạo, sửa, xóa, phê duyệt. Bản demo không cam kết những điều đó. Nếu tôi đi công tác dài ngày, không ai khác sửa được hệ thống; Chương 17 gọi đây là rủi ro "người duy nhất biết".

::: {.phaply}
**Căn cứ pháp lý: an toàn hệ thống thông tin theo cấp độ**

- Luật An ninh mạng số 116/2025/QH15, Quốc hội thông qua ngày 10/12/2025, hiệu lực 01/7/2026, xây dựng trên cơ sở hợp nhất Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015.
- Nghị định 331/2026/NĐ-CP ngày 19/8/2026 về bảo vệ an ninh mạng đối với hệ thống thông tin, hiệu lực từ ngày ký.
- Cấp độ 1: hệ thống phục vụ hoạt động nội bộ của cơ quan, tổ chức và chỉ xử lý thông tin công cộng.
- Cấp độ 2 (nhóm thứ nhất): hệ thống phục vụ hoạt động nội bộ, có xử lý thông tin riêng, thông tin cá nhân của người sử dụng nhưng không xử lý thông tin bí mật nhà nước.
- Cấp độ 3 có nhiều tiêu chí, trong đó có hệ thống xử lý thông tin bí mật nhà nước.
- Khoản 2 Điều 6: hệ thống đáp ứng tiêu chí của nhiều cấp độ thì áp dụng cấp độ cao nhất; nghiêm cấm xác định phạm vi hệ thống một cách hình thức nhằm thay đổi cấp độ.
- Mỗi hệ thống có một chủ quản duy nhất; hồ sơ đề xuất cấp độ 1, 2 do đơn vị chuyên trách về an ninh mạng của chủ quản thẩm định.

Danh sách trên chưa đầy đủ; trước khi lập hồ sơ cần đọc nguyên văn Nghị định.
:::

### 20.1.3. Một bài tập thận trọng: đặt các phân hệ vào khung cấp độ

Tôi thử đặt các phân hệ vào khung cấp độ theo dữ liệu chúng sẽ xử lý nếu dùng thật. Đây là gợi ý ban đầu để mang đi trao đổi, không phải kết luận; xác định cấp độ là việc của đơn vị có thẩm quyền.

| Phân hệ | Dữ liệu khi dùng thật | Gợi ý ban đầu |
|---|---|---|
| Bản tin pháp luật | Tin công khai từ nguồn chính thống | Gần với cấp độ 1 |
| Sổ tay AI (cổng vào) | Văn bản đã công khai, câu hỏi mẫu | Gần với cấp độ 1 |
| OKR/KPI, Kiểm điểm | Điểm, xếp loại, nhận xét từng người | Từ cấp độ 2 trở lên |
| Quản lý cán bộ | Hồ sơ 2C, số định danh, gia đình | Từ cấp độ 2; dữ liệu nhạy cảm |
| Bot Zalo, Telegram | Câu hỏi, số liệu nạp kèm, danh bạ | Từ cấp độ 2 trở lên |
| Biểu quyết | Kết quả biểu quyết của kỳ họp | Cần đánh giá riêng |

Bài tập này dạy tôi một điều quan trọng hơn chính bảng phân loại. Hệ thống thử nghiệm dùng chung một bảng dữ liệu, một tài khoản dịch vụ, một cửa đăng nhập cho mọi phân hệ. Theo khoản 2 Điều 6 Nghị định 331/2026/NĐ-CP, hệ thống đáp ứng nhiều cấp độ thì áp dụng cấp độ cao nhất. Như vậy, theo cách tôi hiểu, nếu chính thức hóa nguyên trạng, cả hệ thống có thể phải theo cấp độ của phần nhạy cảm nhất là hồ sơ cán bộ; và không được "cắt" phạm vi trên giấy để hạ cấp độ. Bài học thiết kế: phần chứa dữ liệu nhạy cảm nên được tách thành hệ thống riêng ngay từ kiến trúc, có cơ sở dữ liệu riêng, quyền riêng. Tôi ước mình đã nghĩ tới điều này từ ngày thêm phân hệ Quản lý cán bộ.

::: {.thuchanh}
**Thực hành: tự phân loại ứng dụng của mình trong 15 phút**

1. Viết một câu: ứng dụng phục vụ ai, làm việc gì, đang chạy ở đâu.
2. Liệt kê mọi loại dữ liệu ứng dụng lưu hoặc gửi đi: họ tên, điểm số, số điện thoại, nội dung văn bản, câu hỏi của người dùng.
3. Đánh dấu từng loại theo vùng ĐỎ, VÀNG, XANH của Tập 1, và loại nào là dữ liệu cá nhân.
4. Ghi ra mọi dịch vụ bên ngoài mà dữ liệu đi qua: nơi lưu, dịch vụ AI, nền tảng nhắn tin.
5. Đối chiếu với các tiêu chí trong hộp Căn cứ pháp lý ở trên, viết một dòng gợi ý cấp độ kèm lý do, rồi mang đến trao đổi với đơn vị chuyên trách. Đừng tự kết luận.
:::

::: {.ghinho}
**Ghi nhớ**

Một bản demo đã chứa dữ liệu thật thì không còn là bản demo, dù đầu trang vẫn ghi chữ "demo". Nhãn không bảo vệ dữ liệu; chỉ hạ tầng, phân quyền và trách nhiệm được xác lập mới bảo vệ dữ liệu.
:::

## 20.2. Con đường chính thức hóa

Không có lối tắt từ bản demo sang hệ thống chính thức, nhưng con đường cũng không mù mờ. Tôi chia nó thành sáu bước, mỗi bước có sản phẩm đầu ra để lãnh đạo kiểm tra được.

| Bước | Việc chính | Sản phẩm đầu ra |
|---|---|---|
| 1 | Xin chủ trương | Tờ trình được lãnh đạo cho ý kiến |
| 2 | Hồ sơ cấp độ và đánh giá đi kèm | Hồ sơ cấp độ, đánh giá dữ liệu cá nhân, phân loại rủi ro AI |
| 3 | Chuyển hạ tầng, "dọn nhà" | Hệ thống trên hạ tầng được phép, đã gỡ mọi thứ chỉ dành cho demo |
| 4 | Chuyển giao | Bộ hồ sơ và biên bản bàn giao |
| 5 | Đào tạo, vận hành | Tài liệu, lớp hướng dẫn, quy tắc, quy trình sự cố |
| 6 | Sáng kiến, nhiệm vụ | Hồ sơ sáng kiến hoặc nhiệm vụ được phê duyệt |

Bước 6 nên làm song song từ sớm, vì nó tạo khuôn khổ để người làm được bảo vệ. Còn bước 3 không bao giờ được đi trước bước 2: chưa biết hệ thống cần bảo vệ ở mức nào thì chưa thể chọn hạ tầng.

::: {.cauchuyen}
**Câu chuyện thực tế: khi bản demo bắt đầu có sức nặng**

Dự thảo Hướng dẫn của Ban Tổ chức Tỉnh ủy về lập danh mục sản phẩm, công việc theo OKR/KPI ghi rõ danh mục và cách chấm minh họa được trích từ hệ thống phần mềm đã triển khai tại Văn phòng; phụ lục của dự thảo in nguyên 48 mục danh mục của phần mềm.

Tôi mừng vì công sức được ghi nhận, nhưng cũng giật mình. Từ lúc ấy, một chỗ sai trong bản demo không còn là chuyện nội bộ; nó có thể đi vào văn bản hướng dẫn cho nhiều cơ quan. Bản demo đã có sức nặng của một văn bản trong khi chưa có quy trình kiểm soát nào của một văn bản. Đó là thời điểm phải tính đến chính thức hóa.
:::

### 20.2.1. Bước 1 — Xin chủ trương

Việc đầu tiên không phải kỹ thuật mà là xin chủ trương. Tờ trình phải trả lời năm câu hỏi: giải quyết bài toán nghiệp vụ nào; phạm vi, đối tượng sử dụng; dữ liệu nào được xử lý, thuộc vùng nào; các phương án và chi phí; ai chịu trách nhiệm.

Phần phương án hay bị bỏ qua nhất. Ít nhất phải so sánh bốn phương án: giữ ở mức demo với dữ liệu mô phỏng; chuyển chính hệ thống này lên hạ tầng của cơ quan; dùng một nền tảng dùng chung đã có; đặt hàng đơn vị chuyên nghiệp xây dựng theo đặc tả. Luật Chuyển đổi số số 148/2025/QH15 (hiệu lực 01/7/2026) là luật khung về chuyển đổi số; Quyết định 1132/QĐ-TTg ngày 24/6/2026 ban hành tiêu chí và Danh mục nền tảng số dùng chung quốc gia trong các cơ quan thuộc hệ thống chính trị. Trước khi đề xuất, phải tra danh mục ấy cùng các nền tảng dùng chung của tỉnh để không làm trùng.

Bản đặc tả yêu cầu phần mềm của Văn phòng gợi ý một lộ trình đáng tham khảo: thí điểm tại một số cơ quan trong 03 tháng; hoàn thiện theo phản hồi, kết nối liên thông; triển khai diện rộng theo chỉ đạo của cấp có thẩm quyền. Nó còn đặt một tiêu chí nghiệm thu đo được: với cùng dữ liệu đầu vào, kết quả tính của phần mềm phải khớp tệp Excel mô phỏng đến hai chữ số thập phân. Tờ trình có lộ trình và tiêu chí như vậy thuyết phục hơn mọi lời hứa chung chung.

::: {.lenhmau}
**Câu lệnh mẫu 20.1 — Dự thảo tờ trình xin chủ trương chính thức hóa**

```text
[VAI] Chuyên viên tổng hợp của Văn phòng Đoàn ĐBQH và HĐND tỉnh, viết
văn bản hành chính trung lập, không tô hồng.
[BỐI CẢNH] Văn phòng có bản demo [tên ứng dụng] phục vụ [nghiệp vụ], chạy
thử từ [tháng/năm] với dữ liệu mô phỏng. Kết quả đã đo được: [số liệu đo
thật; chưa đo thì ghi "chưa đo"].
[VIỆC] Soạn dự thảo tờ trình xin chủ trương chính thức hóa, gồm:
(1) sự cần thiết; (2) phạm vi, đối tượng; (3) dữ liệu sẽ xử lý, phân loại
sơ bộ; (4) bốn phương án: giữ mức demo, chuyển lên hạ tầng cơ quan, dùng
nền tảng dùng chung, đặt hàng đơn vị chuyên nghiệp, mỗi phương án có ưu,
nhược điểm; (5) rủi ro và biện pháp; (6) lộ trình ba giai đoạn;
(7) kiến nghị.
[DẠNG] Thể thức tờ trình theo Nghị định 30/2020/NĐ-CP, không quá 3 trang.
[RÀNG BUỘC] Không bịa số liệu, số hiệu văn bản; chỗ cần căn cứ thì ghi
[cần tra cứu]; để trống kinh phí; không nêu tên cá nhân; không khẳng định
cấp độ an toàn thông tin.
[NGHIỆM THU] Đủ 7 phần; mọi con số đều có trong phần bối cảnh tôi đưa.
```

Câu lệnh này chỉ chứa thông tin vùng XANH và VÀNG đã ẩn danh nên dùng được với trợ lý AI trò chuyện. Căn cứ pháp lý do đồng chí tự tra và điền.
:::

### 20.2.2. Bước 2 — Hồ sơ cấp độ và các đánh giá đi kèm

Bước này có ba bộ hồ sơ, mỗi bộ ứng với một nhóm quy định.

**Một là hồ sơ đề xuất cấp độ an toàn hệ thống thông tin** theo Luật An ninh mạng và Nghị định 331/2026/NĐ-CP. Hồ sơ đề xuất cấp độ 1, 2 do đơn vị chuyên trách về an ninh mạng của chủ quản thẩm định; cấp độ 3 có thời hạn thẩm định tối đa 15 ngày làm việc, cấp độ 4, 5 tối đa 25 ngày làm việc, tính từ khi nhận đủ hồ sơ hợp lệ.

**Hai là đánh giá tác động xử lý dữ liệu cá nhân** theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, cùng hiệu lực từ 01/01/2026. Nghị định 356/2025/NĐ-CP thay thế Nghị định 13/2023/NĐ-CP, ban hành biểu mẫu hồ sơ đánh giá tác động; Điều 3 và Điều 4 liệt kê dữ liệu cá nhân cơ bản và nhạy cảm. Hồ sơ Mẫu 2C có ngày sinh, số định danh, quan hệ gia đình, tức là đủ những thứ danh mục ấy gọi tên.

**Ba là phân loại rủi ro của hệ thống có dùng AI.** Nghị định 142/2026/NĐ-CP (hiệu lực 01/5/2026) hướng dẫn Luật Trí tuệ nhân tạo, yêu cầu phân loại rủi ro trước khi đưa hệ thống vào sử dụng, và phân loại lại khi thay đổi chức năng, mục đích làm phát sinh rủi ro mới. Quyết định 33/2026/QĐ-TTg (hiệu lực 15/8/2026) ban hành Danh mục hệ thống AI rủi ro cao thuộc sáu lĩnh vực: giáo dục; dân tộc và tôn giáo; y tế; ngân hàng; tố tụng; giao thông vận tải. Theo tôi nhận định, các phân hệ của Văn phòng không thuộc sáu lĩnh vực này, nhưng nhận định phải được ghi thành hồ sơ, có người ký. Thông tư 05/2026/TT-BKHCN về Khung đạo đức trí tuệ nhân tạo quốc gia áp dụng bắt buộc với cơ quan quản lý nhà nước và tổ chức, cá nhân dùng AI phục vụ quản lý nhà nước, cung cấp dịch vụ công; Văn phòng nên coi mình thuộc phạm vi này khi dùng AI trong công vụ.

Nghe nhiều hồ sơ, nhưng nguyên liệu chung là một bản mô tả hệ thống trung thực: có chức năng gì, lưu dữ liệu gì, ở đâu, ai đọc, ai ghi, dữ liệu đi ra những đâu. Tác tử AI lập trình làm việc này rất tốt vì nó đọc được toàn bộ kho mã.

::: {.lenhmau}
**Câu lệnh mẫu 20.2 — Lập bản mô tả hệ thống từ kho mã để làm hồ sơ**

```text
[VAI] Kỹ sư phân tích hệ thống, giúp tôi chuẩn bị hồ sơ chính thức hóa.
Chỉ đọc, KHÔNG sửa tệp nào, KHÔNG commit.
[BỐI CẢNH] Kho mã này là bản demo [tên hệ thống]. Tôi cần bản mô tả để
trao đổi với đơn vị chuyên trách về an ninh mạng và bảo vệ dữ liệu.
[VIỆC] Đọc toàn bộ kho mã, lập 5 bảng:
1. Chức năng và người dùng theo vai (khách, cán bộ, quản trị...).
2. Mọi loại dữ liệu được lưu: tên trường, nơi lưu, ai đọc, ai ghi.
3. Trường nào là dữ liệu cá nhân, trường nào có thể nhạy cảm.
4. Dịch vụ bên ngoài hệ thống gọi tới, dữ liệu gì được gửi đi.
5. Chính sách, tài khoản, cấu hình chỉ hợp với bản demo, cần gỡ khi
   dùng thật.
[DẠNG] Bảng tiếng Việt; mỗi dòng ghi tệp nguồn làm căn cứ.
[RÀNG BUỘC] Không in giá trị khóa bí mật, mật khẩu, số điện thoại.
Không chắc thì ghi "cần kiểm tra", không đoán. Không tự kết luận cấp độ;
chỉ nêu dữ kiện.
[NGHIỆM THU] Tôi chọn ngẫu nhiên 5 dòng đối chiếu mã nguồn, cả 5 khớp.
```
:::

::: {.canhbao}
**Cảnh báo: rà lại căn cứ pháp lý trước khi nộp hồ sơ**

Ngay bản đặc tả yêu cầu phần mềm của Văn phòng, soạn tháng 7/2026, vẫn ghi căn cứ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, văn bản đã hết hiệu lực từ 01/01/2026. Năm 2025–2026 có nhiều luật nền tảng mới về an ninh mạng, dữ liệu cá nhân, trí tuệ nhân tạo, chuyển đổi số. Mọi căn cứ trong hồ sơ phải được tra tình trạng hiệu lực tại thời điểm nộp, không chép lại từ tài liệu cũ, càng không chép từ trí nhớ của AI.
:::

### 20.2.3. Bước 3 — Chuyển hạ tầng và "dọn nhà"

Khi hồ sơ cấp độ đã được thẩm định, hệ thống mới được chuyển lên hạ tầng phù hợp: của cơ quan, của tỉnh, hoặc nền tảng đám mây đáp ứng yêu cầu của cấp độ đã xác định. Lựa chọn cụ thể thuộc về đơn vị chuyên trách.

Có một thuận lợi: lõi cơ sở dữ liệu là PostgreSQL, phần mềm nguồn mở có tên trong danh mục ban đầu kèm Thông tư 20/2014/TT-BTTTT về các sản phẩm phần mềm nguồn mở được ưu tiên mua sắm, sử dụng trong cơ quan, tổ chức nhà nước. Dữ liệu không bị khóa chặt vào một nhà cung cấp. Nhưng phần đăng nhập và cửa giao dịch dữ liệu (API) của bản demo đang dùng dịch vụ riêng của Supabase, nên chuyển đi vẫn phải làm lại một phần, không đơn giản là sao chép.

Quan trọng hơn chuyển nhà là dọn nhà: trả hết các khoản "nợ trình diễn". Với hệ thống của Văn phòng, danh sách gồm:

1. Xem xét lại từng chính sách mở quyền đọc công khai đã thêm cho bản demo; mỗi chính sách đều có sẵn ghi chú và câu lệnh gỡ trong tệp lược đồ.
2. Xóa tài khoản viết sẵn trong mã giao diện và chế độ quản trị cục bộ; chỉ dùng xác thực thật. Bản đặc tả hướng tới đăng nhập một lần qua VNeID hoặc hệ thống định danh dùng chung của tỉnh.
3. Tách hẳn dữ liệu mô phỏng khỏi dữ liệu thật, không để chung một bảng.
4. Thay toàn bộ khóa bí mật; khóa chỉ đặt ở phía máy chủ.
5. Thôi dùng dịch vụ AI trung gian; dùng khóa của nhà cung cấp gốc theo hợp đồng của cơ quan, hoặc AI chạy tại chỗ cho tài liệu nội bộ.
6. Bật sao lưu tự động hằng ngày, thử khôi phục ít nhất một lần; bật nhật ký thao tác tạo, sửa, xóa, phê duyệt.
7. Sửa các điểm yếu đã ghi nhận: bộ đếm hạn mức chưa cộng dồn nguyên tử; hai điểm nối gọi AI chưa hoàn lượt khi AI lỗi.
8. Dọn từng mục một, sao lưu trước mỗi mục, thử lại bằng cả vai khách, vai cán bộ và vai quản trị rồi mới sang mục tiếp theo. Gỡ hàng loạt rồi mới thấy một phân hệ trắng trang là cách nhanh nhất để mất lòng tin người dùng ngay ngày đầu.

### 20.2.4. Bước 4 — Chuyển giao cho đơn vị chuyên trách

Hệ thống chính thức không thể chỉ sống trong đầu một người. Chuyển giao không phải gửi đường dẫn kho mã, mà là bàn giao đủ để người khác vận hành, sửa lỗi, phát triển tiếp mà không phải gọi điện cho người làm ra nó. Bộ hồ sơ tối thiểu gồm: kho mã kèm toàn bộ lịch sử thay đổi; bộ nhớ dự án (tệp CLAUDE.md và thư mục quy tắc), vì tác tử AI của người tiếp nhận cũng cần đọc; nhật ký thay đổi hơn 100 mục; lược đồ cơ sở dữ liệu với ghi chú quyền; hướng dẫn cài đặt các bot; danh sách biến môi trường (chỉ tên và công dụng, không ghi giá trị); bộ kiểm thử và lệnh chạy; danh sách tài khoản dịch vụ cần chuyển sang đứng tên cơ quan.

Tôi phải thừa nhận một thiếu sót của chính dự án: nhiều bộ kiểm thử mà nhật ký nhắc tới, với hàng trăm phép kiểm, lại nằm trong thư mục nháp không được đưa lên kho mã. Máy khác không chạy lại được, trái với nguyên tắc "GitHub là nguồn duy nhất" của chính dự án. Trước khi bàn giao, việc này phải được sửa.

Về sở hữu trí tuệ, Luật Sở hữu trí tuệ bảo hộ chương trình máy tính như tác phẩm văn học, dù thể hiện dưới dạng mã nguồn hay mã máy (khoản 1 Điều 22). Theo câu chữ khoản 1 Điều 39 của Luật (cần đối chiếu văn bản hợp nhất mới nhất), tổ chức giao nhiệm vụ sáng tạo cho người của mình là chủ sở hữu quyền tài sản, trừ khi có thỏa thuận khác; vì vậy nên có văn bản giao nhiệm vụ hoặc thỏa thuận rõ ràng. Với mã viết cùng AI, Nghị định 134/2026/NĐ-CP (hiệu lực 09/4/2026) quy định quyền tác giả chỉ phát sinh khi con người có đóng góp sáng tạo đáng kể, mang tính quyết định, giữ vai trò chủ đạo. Lịch sử Git, nhật ký thay đổi và các câu lệnh giao việc chính là chứng cứ cho vai trò ấy. Thư viện nguồn mở dùng trong hệ thống phải giữ nguyên thông báo bản quyền và giấy phép đi kèm.

::: {.lenhmau}
**Câu lệnh mẫu 20.3 — Kiểm tra mức sẵn sàng bàn giao**

```text
[VAI] Kỹ sư khó tính tiếp nhận hệ thống từ người khác. Chỉ lập báo cáo,
KHÔNG sửa, KHÔNG commit.
[VIỆC] Rà kho mã, trả lời 6 câu:
1. Làm đúng từng bước của tệp hướng dẫn cài đặt trên thư mục sạch thì
   chạy được không? Bước nào thiếu, sai?
2. Liệt kê mọi biến môi trường: tên, công dụng, bắt buộc hay không.
   TUYỆT ĐỐI không in giá trị.
3. Bộ kiểm thử có trong kho không, chạy bằng lệnh nào, kết quả ra sao?
4. Câu nào trong CLAUDE.md, thư mục quy tắc, kiến thức của bot, trang
   hướng dẫn đang mâu thuẫn với mã hiện tại?
5. Quy ước nào chỉ ghi bằng lời, chưa có cơ chế bắt buộc?
6. Tài khoản dịch vụ, tên miền, khóa nào đang gắn với cá nhân?
[DẠNG] Bảng 3 cột: Vấn đề | Căn cứ trong kho | Đề xuất xử lý.
[NGHIỆM THU] Đủ 6 câu; mọi khẳng định có tệp làm căn cứ.
```
:::

### 20.2.5. Bước 5 — Đào tạo và vận hành có kỷ luật

Công cụ chính thức mà người dùng không biết dùng, hoặc dùng sai, còn nguy hiểm hơn không có công cụ. Đào tạo phải theo vai: cán bộ cần biết nhập gì, khi nào; lãnh đạo phòng, Ban cần biết duyệt và hiểu vì sao phần mềm hạ mức xếp loại; quản trị cần biết cấp tài khoản, xử lý sự cố, khôi phục dữ liệu.

Đã có nền để bắt đầu. Ngày 7/5/2026, Thường trực HĐND tỉnh tổ chức tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng, gồm thực hành xử lý tài liệu, dùng AI chuẩn bị kỳ họp, giám sát, cùng an toàn dữ liệu và đạo đức công vụ. Nhiệm vụ Sổ tay AI có chỉ tiêu 100% cán bộ, công chức Văn phòng được hướng dẫn trước ngày 25/11/2026; ở thời điểm viết, đó vẫn là chỉ tiêu, chưa phải kết quả. Đi cùng đào tạo là kỷ luật sử dụng: dự thảo Quy tắc sử dụng AI 9 điều kèm sổ cam kết của cán bộ (Phụ lục 4), và một quy trình sự cố viết ra giấy: ai phát hiện thì báo ai, xem trang chẩn đoán ở đâu, khi nào tạm dừng phân hệ, khi nào khôi phục từ bản sao lưu.

### 20.2.6. Bước 6 — Sáng kiến, nhiệm vụ: tạo khuôn khổ để được bảo vệ

Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị xác định khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là "đột phá quan trọng hàng đầu", có tinh thần chấp nhận rủi ro và cơ chế thử nghiệm có kiểm soát. Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 (hiệu lực 01/10/2025) có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro. Đảng và Nhà nước cũng có chủ trương khuyến khích, bảo vệ cán bộ năng động, sáng tạo vì lợi ích chung.

Nhưng xin đọc cho đúng: chấp nhận rủi ro, miễn hay loại trừ trách nhiệm chỉ áp dụng khi sáng kiến được tổ chức thành nhiệm vụ hoặc thử nghiệm được phê duyệt, tuân thủ đầy đủ quy trình. Ứng dụng tự làm rồi tự đưa vào dùng ngoài khuôn khổ ấy không mặc nhiên được miễn trách nhiệm.

Hệ thống của Văn phòng đang đi hai đường. Một là sáng kiến: bản mô tả sáng kiến về phần mềm đánh giá, xếp loại theo OKR/KPI đã soạn để trình Hội đồng khoa học, sáng kiến của cơ quan; phần ngày tháng và số liệu hiệu quả còn để trống, chờ có số đo thật mới điền. Hai là nhiệm vụ đột phá Văn phòng đã đăng ký (Trục 3, Mục V.5(4) của Đề án): thí điểm hỏi đáp, tra cứu bằng AI có trích dẫn nguồn, với bốn chỉ tiêu (06 sổ tay; ít nhất 50 câu hỏi mẫu đã đối chiếu; 100% cán bộ, công chức Văn phòng được hướng dẫn; thời gian tra cứu giảm ít nhất 30%) và ba mốc 15/11, 25/11, 10/12/2026. Chỉ tiêu giảm thời gian được đo bằng cách ghi số phút nếu tra thủ công để so với khi dùng sổ tay: đo trước, đo sau, không ước lượng.

::: {.vidu}
**Ví dụ minh họa: hai ứng dụng, hai mức hồ sơ**

Hãy hình dung một Ban có hai ứng dụng tự làm. Ứng dụng thứ nhất là trang tra cứu danh mục văn bản đã công khai, không đăng nhập, không lưu thông tin người dùng. Ứng dụng thứ hai là bảng theo dõi kiến nghị cử tri có họ tên, địa bàn của người dân.

Với ứng dụng thứ nhất, hồ sơ có thể gọn: tờ trình ngắn, bản mô tả dữ liệu cho thấy chỉ có thông tin công cộng, ý kiến của đơn vị chuyên trách về cấp độ, một người được giao cập nhật. Với ứng dụng thứ hai, phải đủ sáu bước, có đánh giá tác động xử lý dữ liệu cá nhân, phân quyền chặt, nhật ký truy cập. Hồ sơ tương xứng với dữ liệu và phạm vi; nhưng cấp độ của cả hai vẫn do đơn vị có thẩm quyền xác định.
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Đừng hỏi "bao giờ bỏ chữ demo", hãy hỏi "đã xong bước nào trong sáu bước".
- Giao một đơn vị chuyên trách đồng hành từ bước 2, đừng đợi đến lúc bàn giao.
- Yêu cầu tài khoản dịch vụ, tên miền, khóa chuyển sang đứng tên cơ quan trước khi chạy thật.
- Ra văn bản giao nhiệm vụ hoặc phê duyệt thử nghiệm sớm: vừa là khuôn khổ quản trị rủi ro, vừa là cơ sở bảo vệ cán bộ dám làm.
- Coi phương án "dừng ở demo" hoặc "chuyển sang nền tảng dùng chung" là kết quả tốt, không phải thất bại.
:::

## 20.3. Ba mươi bài học xương máu

Khi tổng hợp tư liệu cho cuốn sách từ hơn 100 mục nhật ký, tôi rút ra được 48 bài học từ các sự cố có thật. Dưới đây là ba mươi bài đáng nhớ nhất, nhóm theo bảy chủ đề; mỗi bài nói ngắn chuyện gì đã xảy ra và nên làm gì.

### 20.3.1. Nghiệp vụ và pháp lý

1. **Đối chiếu với biểu mẫu giấy đang dùng thật, không chỉ với văn bản hướng dẫn.** Phân hệ Kiểm điểm dựng theo Hướng dẫn 03-HD/TU vẫn lệch biểu mẫu thật ở bốn chỗ: thiếu bước lập kế hoạch đầu kỳ, đóng cứng điểm tối đa sáu trục, cho nhập điểm lẻ ở chỗ chỉ có hai ô đánh dấu, in tên cơ quan hành chính lên văn bản của Đảng. Hãy đưa cho AI mẫu đang dùng, đã che thông tin cá nhân. Điều "tưởng là cố định" thường là chỗ sai.
2. **Câu chữ hiểu được nhiều cách thì người có thẩm quyền chọn.** AI từng hiểu "không hoàn thành nhiệm vụ" là "chưa đạt đủ 100%", ép một cán bộ điểm cao xuống mức thấp nhất chỉ vì một việc làm được 9/10. Sau khi hỏi lại, ngưỡng được chốt theo từng nhiệm vụ: dưới 50% mới là không hoàn thành. Hãy bắt AI liệt kê các cách hiểu kèm hệ quả, để người có thẩm quyền chọn và ghi vào nhật ký.
3. **Số hóa một văn bản là một lần thẩm định văn bản đó.** Buộc câu chữ của dự thảo Khung tiêu chí HĐND thành phép tính, sáu chỗ chưa nhất quán tự lộ ra, như một tiêu chí 6 điểm mà các mức cộng lại thành 9. Phần mềm chuẩn hóa có ghi chú công khai dưới dạng kiến nghị. Quyền sửa văn bản vẫn thuộc cơ quan soạn thảo.
4. **Thước đo gắn với khen thưởng sẽ bị "lách".** Theo quy luật Goodhart, khi thước đo trở thành mục tiêu thì nó không còn là thước đo tốt; cộng phần trăm đạt OKR vào điểm cá nhân thì ai cũng đặt mục tiêu thấp. Vì vậy hệ thống chỉ dùng OKR để định hướng, và đặt trần +5 điểm cho phần thưởng vượt định mức. Trước khi thiết kế chỉ số, hãy hỏi AI: "người ta sẽ lách chỉ số này thế nào?".
5. **Tra cứu pháp luật: có nguồn mới trả lời.** Câu trả lời trơn tru nhưng dẫn sai điều, khoản hoặc dẫn văn bản hết hiệu lực nguy hiểm hơn không trả lời. Sổ tay AI buộc mỗi ý gắn trích dẫn, thiếu căn cứ thì nói không tìm thấy; 21 nguồn gợi ý đặt sẵn trạng thái "chưa xác định hiệu lực, chưa kiểm tra". Phần mềm không giành trách nhiệm kiểm tra hiệu lực văn bản của cán bộ.
6. **Bản demo vẫn phải đúng luật ở phần logic, trung thực ở phần dữ liệu.** Phân hệ Biểu quyết tính trên tổng số 82 đại biểu chứ không trên số người đã bấm: quá nửa là 42/82, nội dung cần hai phần ba là 55/82, theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15. Đại biểu chỉ mang mã, phiếu mô phỏng được dán nhãn ở giao diện và trong lời dặn cho bot. Diễn tập phòng cháy dùng khói giả, nhưng biển "DIỄN TẬP" phải treo thật to.

### 20.3.2. Dữ liệu

7. **Luôn hỏi "danh sách trống thì sao, ngày đầu kỳ thì sao?".** Từ ngày 01/9/2026, ba phân hệ dùng chung một tệp giao diện đều trắng trang vì mã lấy "người đứng đầu danh sách" của một kỳ chưa có ai; lỗi tái diễn cho tới khi được vá ngày 28/9/2026. Lỗi theo lịch không lộ khi thử, chỉ lộ khi sang kỳ mới. Lối thoát cho tình huống xấu cũng không được chỉ dành cho người có quyền cao nhất.
8. **Mỗi loại hồ sơ một tủ riêng.** Phân hệ Kiểm điểm (theo quý) và OKR/KPI (theo tháng) từng lưu chung một bản ghi chỉ mang tên "năm, tháng"; ai mở sau thì cơ chế tự lưu ghi đè danh sách của người mở trước. Cách sửa là thêm tiền tố phân hệ vào tên bản ghi, giữ tên cũ cho dữ liệu đã có. Bảo AI "thêm một phân hệ giống cái cũ" thì phải hỏi ngay: nó lưu vào đâu?
9. **Họ tên không phải mã định danh.** Gộp danh sách cán bộ về một mối làm hai đồng chí trùng cả họ, đệm, tên ở hai đơn vị bị ghép làm một; phân hệ OKR/KPI còn 27 người thay vì 28. Từ đó chỉ nhận dạng bằng email hoặc "họ tên + đơn vị". Sau mỗi lần gộp dữ liệu về người, hãy đếm lại; 27 khác 28 là tín hiệu báo động.
10. **Phép thử đúng là "lưu, tải lại, còn không?".** Danh bạ báo lưu thành công nhưng tải lại thì trống, vì hàm chuẩn hóa là danh sách trắng, chỉ giữ những trường đã khai tên. Danh sách trắng an toàn nhưng có giá: thêm loại thông tin mới thì phải nhắc AI khai vào đó. Dữ liệu lưu trước khi vá không cứu được.
11. **Một nguồn sự thật, một nơi tính.** Khách từng thấy một danh sách cán bộ, quản trị thấy danh sách khác, vì phần mềm dựng dữ liệu mẫu riêng cho khách. Phân quyền nên khác nhau ở chỗ được làm gì, không ở chỗ được thấy sự thật nào. Mọi kênh mới như bot, báo cáo, tệp xuất phải dùng lại đúng hàm tính đã có, cấm viết công thức lần thứ hai.
12. **Tự động lưu là con dao hai lưỡi.** Ứng dụng từng nạp dữ liệu khi chưa biết người dùng là ai, nên vừa đăng nhập thì cơ chế tự lưu ghi bản đang hiển thị đè lên dữ liệu chính thống. Cách sửa: chỉ nạp sau khi xác định xong phiên, chỉ ghi khi dữ liệu trên máy chủ chưa bị người khác đổi. Hãy bắt AI nói rõ: lưu khi nào, đè lên cái gì, hai người cùng sửa thì sao.
13. **Đổi quy định không được làm vỡ dữ liệu cũ.** Bộ tiêu chí đổi nhiều lần trong năm, phiếu đã chấm vẫn phải mở được và đúng. Các cách đã dùng: kẹp điểm theo trần mới khi đọc mà không sửa dữ liệu gốc; đổi cách nhập nhưng giữ cách lưu; chỉ tự thay bộ dữ liệu mẫu khi toàn bộ đều là mẫu. Dữ liệu thật không bao giờ bị xóa chỉ vì nó "trông giống" dữ liệu mẫu.

### 20.3.3. Tiếng Việt

14. **Coi chừng hai cái bẫy: khớp chuỗi con và bỏ dấu.** Bộ sinh bản tin từng gán tin "Phòng thủ dân sự quốc gia" vào chủ đề Tài chính vì "quốc gia" chứa "gia", và nhận "họp báo thường kỳ" là tin bão. Cùng họ lỗi: "trưởng ban" nằm trong "phó trưởng ban", xét sai thứ tự thì Phó Trưởng Ban nhận mẫu kế hoạch của Trưởng Ban. Hãy yêu cầu so khớp có dấu, theo ranh giới từ, và giữ các cặp từ dễ nhầm làm phép kiểm hồi quy.
15. **Tiếng Việt là ngôn ngữ âm tiết, văn bản hành chính có xương sống Điều, khoản.** Một âm tiết đứng riêng gần như vô nghĩa, nên công cụ tra cứu chấm thêm cặp âm tiết liền nhau với trọng số 2,6 để "giám sát chuyên đề" không lẫn với "giám đốc". Văn bản được cắt theo Điều, khoản để mỗi đoạn tự nó là một địa chỉ trích dẫn. Đây là tri thức cán bộ hiểu rõ hơn AI; hãy nói ra cho AI.
16. **Đầu vào kém thì đầu ra kém.** Một tệp danh mục từng bị lỗi mã hóa chữ có dấu; văn bản quét (scan) không có lớp chữ; tệp .doc đời cũ không đọc được. Hãy ưu tiên bản điện tử gốc, thống nhất tiếng Việt có dấu theo bảng mã UTF-8, và đọc soát mọi tệp phải qua nhận dạng ký tự.

### 20.3.4. Bảo mật

17. **Trước khi đặt tệp vào kho mã công khai, hỏi "tệp này lên mặt báo thì sao?".** Danh bạ có số điện thoại thật và bản tự đánh giá thật dùng làm mẫu có thể lọt lên kho chỉ vì nằm chung thư mục với tài liệu khác. Dự án chặn chúng bằng danh sách loại trừ của Git, phần mềm chỉ chứa bộ đọc danh bạ, kèm phép kiểm "không có số điện thoại nào trong mã nguồn". AI làm đúng điều được bảo; không dặn thì nó đưa lên tất cả.
18. **Ẩn một nút không phải là khóa cửa.** Tab Quản lý cán bộ chỉ hiện với Quản trị, nhưng chính sách cũ của cơ sở dữ liệu cho mọi tài khoản đăng nhập đọc mọi dòng; thêm chính sách chặt mà không sửa chính sách lỏng cũng vô ích vì chúng cộng dồn theo kiểu "hoặc". Bảo mật phải nằm ở máy chủ và cơ sở dữ liệu. Hãy hỏi AI: "người đã đăng nhập gọi thẳng cửa giao dịch dữ liệu thì đọc được gì?".
19. **Thứ gì gửi xuống trình duyệt đều là công khai.** Biến cấu hình mang tiền tố VITE_ được nhúng vào mã tải về máy người dùng, nên khóa bí mật không bao giờ mang tiền tố đó. Tài khoản trình diễn viết sẵn trong mã giao diện cũng không còn là bí mật; bản demo chấp nhận điều này chỉ vì dữ liệu thật vẫn được máy chủ bảo vệ. Chạy thật thì đổi toàn bộ khóa, xóa tài khoản viết sẵn.
20. **Không đưa vào ngữ cảnh chắc hơn dặn AI đừng nói.** AI biết gì thì có thể nói ra cái đó. Bot của Văn phòng phân tầng ngay khâu gom số liệu: hồ sơ nhân sự chỉ nạp khi người hỏi là Quản trị, kể cả khi đó cũng không nạp số định danh, sổ bảo hiểm, quan hệ gia đình. Khi chỉ cần nhận ra mà không cần biết, hãy dùng chuỗi băm, như mã truy cập của xã, phường hay khóa đếm lượt của khách.
21. **Chọn dịch vụ AI là quyết định về dữ liệu, không chỉ về giá.** Dùng khóa của một dịch vụ trung gian giá rẻ thì mọi câu hỏi và số liệu nạp kèm, kể cả họ tên, điểm, xếp loại cán bộ, lịch công tác lãnh đạo, đều đi qua máy chủ của bên thứ ba. Dự án ghi cảnh báo in đậm và hiển thị tên miền đang dùng để biết dữ liệu đi đâu. Dữ liệu thật thì dùng khóa của nhà cung cấp gốc theo hợp đồng của cơ quan.

### 20.3.5. Chi phí

22. **Mọi giới hạn liên quan đến tiền phải do máy chủ giữ.** Bộ đếm để trong trình duyệt thì xóa lịch sử duyệt web là "hồi sinh" lượt; hạn mức của bot từng đặt lại lúc 0 giờ UTC, tức 7 giờ sáng giờ Việt Nam. Hãy đếm ở máy chủ, ghi rõ mốc ngày theo giờ Việt Nam, và khi thiếu cấu hình thì mặc định đóng với khách chứ không mặc định mở.
23. **Thứ tự đúng: kiểm tra rẻ, trừ lượt, gọi AI, hoàn lượt khi lỗi.** Gọi AI xong mới trừ lượt thì bấm liên tiếp năm lần trong lúc chờ là lọt cả năm; trừ lượt trước khi kiểm tra yêu cầu hợp lệ thì người dùng mất lượt oan. Đọc lại mã khi viết sách, tôi còn thấy hai điểm nối chưa hoàn lượt khi AI lỗi, trong khi điểm nối thứ ba đã làm. Một nguyên tắc đúng phải được áp đồng đều ở mọi nơi.
24. **AI là lựa chọn sau cùng, không phải đầu tiên.** Khung chat Trang chủ có tầng kịch bản trả lời câu hỏi thường gặp ngay trong trình duyệt, không tốn token; AI chỉ có 3 lượt mỗi ngày, hết lượt thì tự rơi về kịch bản. Bản tin pháp luật hằng ngày không cần AI: lấy tin từ nguồn chính thống, vẽ ảnh bằng chương trình. Việc có quy tắc cố định thì để chương trình nhỏ làm; AI có ích nhất ở vai viết ra chương trình ấy.

### 20.3.6. Quy trình và vận hành

25. **Sửa một chỗ, rà mọi chỗ liên quan.** Ngày 13/8/2026, tách kho dữ liệu theo phân hệ làm bot mất hẳn phân hệ Kiểm điểm, vì bot dò tên bản ghi bằng một biểu thức riêng; cùng đợt, gộp danh sách cán bộ làm lộ lỗi trùng họ tên. Từ đó quy ước dự án có quy tắc bắt buộc: sửa xong phải tự hỏi "chỗ nào khác đang đọc, ghi thứ vừa đổi?" và kiểm chứng thật. Danh mục "chỗ hay bị ảnh hưởng dây chuyền" của chính dự án là tài sản quý.
26. **Cùng một yêu cầu có thể đến hai lần.** Zalo không thấy phản hồi trong vài giây thì gửi lại nguyên tin, bot trả lời hai lần và đốt hạn mức gấp đôi; sâu hơn, trần chờ AI 45 giây đặt quá sát trần 60 giây của nền tảng. Cách sửa: chốt mỗi mã tin đúng một lần bằng thao tác nguyên tử trong cơ sở dữ liệu, hạ trần chờ, báo lỗi bằng tiếng Việt, ghi số đo thời gian từng khâu. Đo trước khi sửa, đừng đoán.
27. **Kiểm sản phẩm ở nơi người dùng nhìn thấy.** Tác vụ đám mây được coi là chạy hằng ngày nhưng chưa từng đẩy được ảnh bản tin nào; sáng 10/9/2026, tác vụ tại chỗ cũng lặng lẽ không chạy vì điều kiện "chỉ chạy khi có mạng". Bản dựng xanh chưa phải chạy đúng: dự án kiểm trên bản dựng thật bằng trình duyệt tự động, bấm xuất Word thật rồi đọc lại tệp. Tác vụ tự động cần ba thứ: chạy bù, thử lại, nhật ký.
28. **Quy ước và tài liệu phải theo kịp mã.** Quy ước ghi "không đưa thư mục nháp lên kho" nhưng không có cơ chế chặn, nên một tệp thử nghiệm đã lọt lên; kiến thức của bot từng nói "không đọc được lịch" khi đã đọc được; trang Hướng dẫn từng ghi ngưỡng xếp loại khác ngưỡng phần mềm đang tính. Quy ước quan trọng nên biến thành cơ chế tự động; tài liệu cho người và cho AI phải sửa cùng lúc với mã.

### 20.3.7. Con người

29. **Bớt đi để đi xa.** Có lúc dự án có ba bản giao diện cho cùng một logic: mỗi tính năng làm ba lần, các bản còn ghi đè danh mục của nhau. Gỡ hai bản thừa (mã cũ vẫn còn trong lịch sử Git), mỗi thay đổi về sau chỉ còn làm một lần. AI làm thêm rất nhanh; quyết định bớt đi là việc của người chủ dự án.
30. **Máy đề xuất, người quyết định, và phần mềm phải nói được vì sao.** Nhật ký dự án đầy những cụm "người dùng chốt": giữ nguyên công thức của nghị định và chỉ thêm cảnh báo; chuyển Sổ tay AI sang NotebookLM. Ở phía người dùng, hệ thống hiện ô đỏ khi điểm số và xếp loại chênh nhau, kèm lý do hạ mức. Cán bộ tin một phần mềm hành chính khi nó giải thích được quyết định của nó, như một cán bộ tiếp dân giỏi.

::: {.ghinho}
**Ghi nhớ: ba câu hỏi gốc**

Gần như cả ba mươi bài học quy về ba câu hỏi người giao việc nên hỏi AI sau mỗi thay đổi: *Trường hợp trống, trùng, lặp, quá hạn thì sao? Chỗ nào khác đang đọc, ghi thứ vừa đổi? Ai được thấy, ai được ghi, và điều đó được chặn ở đâu?*
:::

## 20.4. Nhìn về phía trước

Công cụ AI thay đổi theo tháng. Chỉ trong năm 2026, NotebookLM đã đổi tên thành Gemini Notebook (16/7/2026), đổi tên miền và đổi cách tính hạn mức (từ 02/9/2026). Vì vậy tôi không dự báo sản phẩm nào sẽ thắng, chỉ nêu bốn xu hướng đã thấy rõ.

| Xu hướng | Cơ hội cho cơ quan dân cử | Điều kiện then chốt |
|---|---|---|
| Tác tử AI dài hơi | Giao việc lớn, chạy cả buổi | Tiêu chí nghiệm thu, không dữ liệu thật |
| AI chạy tại chỗ | Tài liệu nội bộ không rời máy | Đủ cấu hình, chấp nhận chất lượng thấp hơn |
| Giọng nói | Biên bản nháp, nghe tóm tắt tài liệu | Không dùng cho cuộc họp có nội dung mật |
| Dữ liệu dùng chung | Nhập một lần, dùng nhiều nơi | Thiết kế để kết nối, không làm trùng |

**Tác tử AI làm việc dài hơi.** Bản web của Claude Code chạy trong máy ảo đám mây do nhà cung cấp quản lý, vẫn chạy tiếp khi gập máy tính; GitHub Copilot từ gói Pro có tác tử lập trình trên đám mây. Người dùng sẽ giao những việc cả buổi như "rà toàn bộ kho mã theo quy ước" hay "viết bộ kiểm thử cho mọi lõi nghiệp vụ". Điều kiện: tiêu chí nghiệm thu đo được, cổng chất lượng tự động, ủy quyền có ranh giới, đọc lại thay đổi trước khi đưa vào nhánh chính. Phiên làm việc chạy trên máy chủ của nhà cung cấp, nên chỉ dùng với mã và dữ liệu không mật, không có dữ liệu cá nhân thật.

**AI chạy tại chỗ trên máy của cơ quan.** Công cụ mã nguồn mở Ollama chạy được mô hình AI ngay trên máy Windows; Qwen3 (phát hành 29/4/2025, giấy phép Apache 2.0) hỗ trợ hơn 100 ngôn ngữ và phương ngữ; PhoGPT của VinAI có 3,7 tỷ tham số, huấn luyện trên 102 tỷ token tiếng Việt. Theo quy tắc kinh nghiệm phổ biến, mô hình nén 4-bit cần khoảng 0,6 GB bộ nhớ cho mỗi tỷ tham số; máy văn phòng 16 GB RAM không có card đồ họa chạy được mô hình 4 đến 8 tỷ tham số nhưng chậm. Đổi lại, chất lượng tiếng Việt và khả năng suy luận thấp hơn rõ rệt so với mô hình lớn trên đám mây; trích dẫn pháp luật vẫn phải kiểm chứng.

::: {.canhbao}
**Cảnh báo: "chạy tại chỗ" không có nghĩa là "được xử lý tài liệu mật"**

AI chạy tại chỗ giúp tài liệu nội bộ không mật (vùng VÀNG) khỏi phải gửi ra máy chủ nước ngoài. Tài liệu có nội dung bí mật nhà nước vẫn chịu các quy định về bảo vệ bí mật nhà nước, trong đó có lệnh nghiêm cấm soạn thảo, lưu giữ trên thiết bị đã hoặc đang kết nối Internet. Ollama nay còn hỗ trợ mô hình chạy trên đám mây: muốn dữ liệu không rời máy thì chỉ dùng mô hình đã tải về. Dùng AI với tài liệu mật phải theo quy chế của cơ quan và hướng dẫn của cơ quan có thẩm quyền, không theo sáng kiến cá nhân.
:::

**Giọng nói.** Gemini Notebook có bản tóm tắt dạng hội thoại âm thanh bằng tiếng Việt từ cuối tháng 4/2025, từ tháng 9/2026 có thêm trò chuyện bằng giọng nói theo thời gian thực. App Quốc hội 2.0 phục vụ đại biểu Quốc hội đã có chuyển giọng nói thành văn bản, đọc văn bản thành âm thanh. Đại biểu có thể nghe tóm tắt tài liệu kỳ họp khi di chuyển; Văn phòng có biên bản nháp nhanh hơn. Điều kiện: cuộc họp có nội dung mật thì không ghi âm, không tóm tắt bằng AI trực tuyến; dùng giọng nói để nhận diện người là chạm tới dữ liệu sinh trắc học, nhóm dữ liệu nhạy cảm theo Nghị định 356/2025/NĐ-CP; nội dung âm thanh, hình ảnh mô phỏng người thật phải gắn nhãn theo khoản 4 Điều 11 Luật Trí tuệ nhân tạo.

**Dữ liệu dùng chung.** Đây là xu hướng quan trọng nhất với cơ quan dân cử. Văn phòng Quốc hội đang thí điểm ba nền tảng số dùng chung cho cơ quan dân cử địa phương: phòng họp không giấy, "Bình dân học vụ số – Quốc hội số" và phần mềm Dân nguyện; ngày 24/6/2026 đã tập huấn trực tuyến cho 23 Văn phòng Đoàn ĐBQH và HĐND đăng ký thí điểm (tôi chưa xác minh được danh sách có Thanh Hóa hay không). Theo tin trên báo Đại biểu Nhân dân ngày 29/9/2026, Thường trực HĐND tỉnh chủ trương từng bước xây dựng "HĐND số Thanh Hóa", hình thành cơ sở dữ liệu điện tử về đại biểu, tiếp xúc cử tri, tiếp công dân, giải quyết kiến nghị cử tri. Khi nền tảng chung đến, ứng dụng tự làm có thể là "phòng thí nghiệm" giúp cơ quan biết mình cần gì. Điều kiện: dữ liệu được thiết kế để xuất ra và kết nối được, có mã định danh rõ ràng, và người làm sẵn lòng để ứng dụng của mình "về nhà chung" khi nền tảng chính thức tốt hơn.

Rốt cuộc, phần mềm nào rồi cũng được thay. Điều ở lại là cách làm: đối chiếu văn bản gốc, nói rõ giới hạn, kiểm chứng thật, ghi chép đầy đủ, và để con người quyết định.

## Tóm tắt chương 20

::: {.tomtat}
1. Bản demo và hệ thống chính thức khác nhau ở năm khía cạnh: pháp lý, hạ tầng, an toàn thông tin theo cấp độ, trách nhiệm, hỗ trợ vận hành. Nhãn "demo" không bảo vệ dữ liệu.
2. Từ 01/7/2026, Luật An ninh mạng số 116/2025/QH15 và Nghị định 331/2026/NĐ-CP là khung xác định cấp độ hệ thống thông tin; hệ thống đáp ứng nhiều cấp độ thì theo cấp độ cao nhất, không được cắt phạm vi một cách hình thức.
3. Con đường chính thức hóa có sáu bước: xin chủ trương; lập hồ sơ cấp độ cùng đánh giá dữ liệu cá nhân và rủi ro AI; chuyển hạ tầng, dọn nhà; chuyển giao; đào tạo; sáng kiến hoặc nhiệm vụ.
4. Mỗi quyết định "cho tiện trình diễn" là một khoản nợ; phải ghi ra giấy và trả hết trước ngày chạy thật.
5. Cơ chế chấp nhận rủi ro trong đổi mới sáng tạo chỉ bảo vệ khi việc thử nghiệm được tổ chức, phê duyệt và tuân thủ quy trình.
6. Ba mươi bài học quy về ba câu hỏi: trống, trùng, lặp thì sao; chỗ nào khác đọc, ghi thứ vừa đổi; ai được thấy, ai được ghi và chặn ở đâu.
7. Bốn xu hướng phía trước là tác tử AI dài hơi, AI chạy tại chỗ, giọng nói và dữ liệu dùng chung; cơ hội nào cũng kèm điều kiện về dữ liệu và trách nhiệm.
:::

## Câu hỏi suy ngẫm và bài tập

1. Ứng dụng đồng chí đang dùng hoặc đang làm có "khoản nợ trình diễn" nào? Hãy liệt kê và ghi cách trả từng khoản.
2. Làm bài thực hành ở mục 20.1.3 cho một ứng dụng cụ thể, rồi trao đổi với đơn vị chuyên trách. Gợi ý của đồng chí khác ý kiến của họ ở đâu, vì sao?
3. Dùng Câu lệnh mẫu 20.2 với một kho mã của đồng chí. Tác tử AI phát hiện loại dữ liệu nào mà đồng chí không nhớ là mình đang lưu?
4. Chọn ba bài học ở mục 20.3 gần với công việc của đồng chí nhất, viết mỗi bài thành một quy tắc ngắn đưa vào bộ nhớ dự án.
5. Với vai trò lãnh đạo, đồng chí chọn phương án nào trong bốn phương án ở mục 20.2.1 cho phân hệ Quản lý cán bộ? Nêu lý do theo dữ liệu, chi phí, trách nhiệm và khả năng duy trì.
6. Nếu tỉnh triển khai một nền tảng dùng chung trùng chức năng với ứng dụng đồng chí tự làm, đồng chí cần chuẩn bị gì để chuyển dữ liệu và người dùng sang mà không mất mát?
