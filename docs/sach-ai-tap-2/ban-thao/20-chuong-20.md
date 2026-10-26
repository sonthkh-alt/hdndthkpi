# Chương 20. Từ bản demo đến hệ thống chính thức — và những bài học xương máu

::: {.muctieu}
**Mục tiêu của chương**

- Phân biệt rõ một bản demo thử nghiệm với một hệ thống thông tin chính thức của cơ quan ở năm khía cạnh: pháp lý, hạ tầng, an toàn thông tin theo cấp độ, trách nhiệm và hỗ trợ vận hành.
- Nắm con đường sáu bước để đưa một ứng dụng tự làm thành hệ thống chính thức: đề xuất chủ trương, lập hồ sơ cấp độ và các đánh giá đi kèm, chuyển hạ tầng, chuyển giao, đào tạo, đăng ký sáng kiến hoặc nhiệm vụ.
- Ghi nhớ ba mươi bài học rút ra từ những sự cố có thật của hệ thống thử nghiệm của Văn phòng, để người đi sau không phải trả giá lần thứ hai.
- Nhìn thấy bốn xu hướng sắp tới và những điều kiện cần chuẩn bị ngay từ bây giờ.

Dành cho: lãnh đạo Văn phòng, lãnh đạo các Ban khi phải quyết định có chính thức hóa một công cụ hay không; cán bộ đã tự làm ứng dụng và muốn đưa vào dùng chung; đơn vị chuyên trách công nghệ thông tin sẽ tiếp nhận. Lãnh đạo nên đọc kỹ mục 20.1, 20.2 và các hộp "Dành cho lãnh đạo".
:::

Mười chín chương trước chủ yếu kể chuyện làm. Chương cuối này kể chuyện dừng lại, nhìn lại, rồi đi tiếp cho đúng đường.

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), tại địa chỉ `https://hdndthkpi.vercel.app`, đến cuối tháng 10/2026 có 12 thẻ phân hệ trên Trang chủ, khoảng 21.400 dòng mã, hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự chạy mỗi sáng. Trên đầu trang, ở màn đăng nhập và ở chân trang vẫn có một dòng chữ: *"Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu"*.

Nhiều đồng chí hỏi tôi: bao giờ thì bỏ dòng chữ ấy? Tôi trả lời: dòng chữ ấy không phải lời khiêm tốn xã giao. Nó mô tả chính xác tình trạng pháp lý và kỹ thuật của hệ thống hôm nay. Chỉ được bỏ nó khi đã đi hết con đường mô tả trong chương này, không sớm hơn một ngày.

Chương gồm bốn phần. Phần đầu chỉ ra bản demo và hệ thống chính thức khác nhau ở đâu. Phần thứ hai vạch con đường chính thức hóa. Phần thứ ba gom ba mươi bài học xương máu, mỗi bài là một sự cố đã xảy ra hoặc suýt xảy ra. Phần cuối nhìn về phía trước.

## 20.1. Bản demo và hệ thống chính thức khác nhau thế nào

### 20.1.1. Bản demo của Văn phòng đang đứng ở đâu

Trước khi so sánh, tôi xin kể trung thực hệ thống thử nghiệm đang chạy trên những gì.

Mã nguồn nằm trong một kho mã nguồn (repository) công khai trên GitHub. Giao diện và các hàm máy chủ chạy trên Vercel, ở gói dịch vụ miễn phí. Cơ sở dữ liệu (database) là Supabase, máy chủ đặt tại khu vực Singapore, cũng ở gói miễn phí. Toàn bộ dữ liệu nằm trong một bảng duy nhất, mỗi "dòng" là một khối hồ sơ: một kỳ đánh giá, một phân hệ, một bộ đếm. Phần lớn số liệu hiển thị là dữ liệu mô phỏng: 14 đơn vị ở phân hệ Tiêu chí HĐND có điểm mô phỏng, phần lớn lá phiếu ở phân hệ Biểu quyết là phiếu mô phỏng, đại biểu chỉ mang mã DB01 đến DB82.

Để khách vào xem không cần đăng nhập mà vẫn thấy cùng một dữ liệu với người quản trị, một số dòng dữ liệu được mở quyền đọc công khai. Để tiện trình diễn, mã giao diện có sẵn tài khoản dùng thử. Tôi là quản trị gốc, đồng thời là người duy nhất hiểu toàn bộ hệ thống. Các khóa bí mật nằm trong biến môi trường của tài khoản dịch vụ do tôi đứng tên.

Tệp hướng dẫn gốc của kho mã có một câu tôi coi là "giấy khai sinh" của bản demo: *"Khi dùng thật với dữ liệu thật → chuyển sang máy chủ nội bộ cơ quan"*. Câu ấy được viết từ những ngày đầu, và đến nay vẫn đúng.

::: {.cauchuyen}
**Câu chuyện thực tế: một lối ra được viết sẵn từ ngày mở cửa**

Có lần tôi đăng nhập bằng hai tài khoản để so sánh và phát hiện tài khoản khách thấy một danh sách cán bộ, tài khoản quản trị thấy một danh sách khác. Nguyên nhân: khách bị chính sách bảo mật của cơ sở dữ liệu chặn đọc, nên phần mềm tự dựng danh sách mẫu ngay trên máy của khách.

Cách sửa nhanh nhất cho bản demo là mở quyền ĐỌC công khai cho bảng điểm các kỳ, không mở quyền ghi. Từ đó có nguyên tắc "dữ liệu demo = dữ liệu chính thống": ai vào xem cũng thấy giống nhau. Nhưng ngay dưới đoạn lệnh mở quyền, tệp lược đồ cơ sở dữ liệu có một dòng cảnh báo viết hoa: *"KHI CHUYỂN SANG DÙNG THẬT: xóa chính sách này"*, kèm sẵn câu lệnh gỡ.

Đó là lúc tôi hiểu rõ: mỗi quyết định "cho tiện trình diễn" là một khoản nợ phải trả trước ngày chính thức. Ghi nợ ra giấy thì trả được. Không ghi thì quên, và người tiếp nhận sau này không thể biết.
:::

### 20.1.2. Năm khác biệt cốt lõi

Bảng dưới đây tóm tắt năm khác biệt. Mỗi dòng sẽ được giải thích ngay sau đó.

| Khía cạnh | Bản demo thử nghiệm | Hệ thống chính thức |
|---|---|---|
| Pháp lý | Công cụ tham khảo, mang nhãn demo | Có quyết định đưa vào sử dụng, có quy chế |
| Hạ tầng | Gói miễn phí, tài khoản cá nhân | Hạ tầng được phép, tài khoản của cơ quan |
| An toàn thông tin | Chưa xác định cấp độ | Hồ sơ cấp độ đã thẩm định |
| Trách nhiệm | Người làm tự chịu | Có chủ quản, có người phụ trách từng phần |
| Hỗ trợ | Sửa khi người làm rảnh | Có người trực, sao lưu, quy trình sự cố |

**Thứ nhất, về pháp lý.** Bản demo là công cụ hỗ trợ, kết quả của nó chỉ có giá trị tham khảo. Luật Giao dịch điện tử số 20/2023/QH15 (hiệu lực 01/7/2024) thừa nhận giá trị pháp lý của thông điệp dữ liệu và chữ ký điện tử, nhưng điều đó không biến một tệp Word do phần mềm xuất ra thành văn bản đã ban hành. Phiếu đánh giá, biên bản biểu quyết, bảng tổng hợp xếp loại chỉ có giá trị khi người có thẩm quyền ký và ban hành theo đúng quy trình văn thư, trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư. Một hệ thống chính thức thì khác: nó được đưa vào sử dụng bằng quyết định của cấp có thẩm quyền, có quy chế vận hành, có quy định rõ kết quả nào được dùng làm căn cứ. Với phân hệ Biểu quyết, điều này càng rõ: biểu quyết trực tuyến của kỳ họp phải theo Quy chế làm việc của HĐND đã ban hành, một ứng dụng cán bộ tự làm không thay thế được hệ thống biểu quyết chính thức.

**Thứ hai, về hạ tầng.** Gói miễn phí có giá của nó. Theo tài liệu chính thức của Supabase (tra cứu 26/10/2026), dự án ở gói miễn phí bị tạm dừng sau một tuần không hoạt động; gói trả phí thấp nhất khoảng 25 USD/tháng thì không bị tạm dừng (giá tham khảo tại thời điểm viết, có thể thay đổi). Phân hệ Một dữ liệu chạy trên gói miễn phí của Render nên "ngủ" sau khoảng 15 phút không ai dùng, lần mở đầu mất 30 đến 60 giây. Điều khoản của nhiều gói miễn phí giới hạn cho mục đích cá nhân, phi thương mại; cơ quan phải đọc kỹ điều khoản hiện hành trước khi dùng cho việc chính thức. Thêm một điểm ít người để ý: máy chủ cơ sở dữ liệu của bản demo đặt ở nước ngoài. Khi đã có dữ liệu cá nhân thật, việc chuyển dữ liệu cá nhân ra nước ngoài là vấn đề pháp luật về bảo vệ dữ liệu cá nhân có quy định riêng, phải được đánh giá trước.

**Thứ ba, về an toàn thông tin theo cấp độ.** Từ 01/7/2026, Luật An ninh mạng số 116/2025/QH15 có hiệu lực, xây dựng trên cơ sở hợp nhất Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015. Nghị định 331/2026/NĐ-CP ngày 19/8/2026 quy định chi tiết tiêu chí xác định cấp độ hệ thống thông tin từ 1 đến 5 và biện pháp bảo vệ theo từng cấp độ. Bản demo chạy với dữ liệu mô phỏng nên chưa đặt ra câu hỏi cấp độ. Hệ thống chính thức thì phải trả lời câu hỏi ấy bằng một hồ sơ được thẩm định. Khung cũ theo Nghị định 85/2016/NĐ-CP mà nhiều đồng chí quen thuộc nay chỉ còn được viện dẫn ở quy định chuyển tiếp; đồng chí nên tra tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi dùng làm căn cứ.

**Thứ tư, về trách nhiệm.** Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực 01/3/2026) phân biệt nhà phát triển, nhà cung cấp, bên triển khai và người sử dụng hệ thống AI (Điều 3). Một cán bộ dùng trợ lý AI trò chuyện để soạn văn bản là người sử dụng. Nhưng khi cán bộ ấy tự làm một ứng dụng có gọi AI rồi đưa cho đồng nghiệp dùng, vai trò của cơ quan và của chính người làm có thể đã khác. Khoản 2 Điều 4 của Luật nói rõ: *"Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người"*. Ở bản demo, trách nhiệm dồn về một người. Ở hệ thống chính thức, Nghị định 331/2026/NĐ-CP yêu cầu hệ thống thông tin phải có một chủ quản duy nhất; bên trong đó, phải rõ ai chịu trách nhiệm nghiệp vụ, ai chịu trách nhiệm kỹ thuật, ai chịu trách nhiệm dữ liệu.

**Thứ năm, về hỗ trợ vận hành.** Sáng 10/9/2026, bản tin pháp luật không ra. Khi bot Zalo trả lời hai lần một câu hỏi, người sửa cũng là tôi. Bản demo được sửa khi người làm có thời gian. Bản đặc tả yêu cầu phần mềm mà Văn phòng soạn tháng 7/2026 cho thấy một hệ thống chính thức phải đáp ứng những gì: thời gian phản hồi thao tác thông thường không quá 03 giây, chịu tải cao điểm các ngày 24 đến 28 hằng tháng, sao lưu tự động hằng ngày, nhật ký toàn bộ thao tác tạo, sửa, xóa, phê duyệt. Bản demo hiện nay không cam kết những điều đó. Nói thẳng ra: nếu tôi đi công tác dài ngày, không ai khác sửa được hệ thống. Chương 17 gọi đây là rủi ro "người duy nhất biết".

::: {.phaply}
**Căn cứ pháp lý: an toàn hệ thống thông tin theo cấp độ**

- Luật An ninh mạng số 116/2025/QH15, Quốc hội thông qua ngày 10/12/2025, hiệu lực 01/7/2026; xây dựng trên cơ sở hợp nhất Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015.
- Nghị định 331/2026/NĐ-CP ngày 19/8/2026 về bảo vệ an ninh mạng đối với hệ thống thông tin, hiệu lực từ ngày ký: quy định tiêu chí xác định cấp độ 1 đến 5 và biện pháp bảo vệ theo từng cấp độ.
- Cấp độ 1: hệ thống phục vụ hoạt động nội bộ của cơ quan, tổ chức và chỉ xử lý thông tin công cộng.
- Cấp độ 2 (nhóm thứ nhất): hệ thống phục vụ hoạt động nội bộ, có xử lý thông tin riêng, thông tin cá nhân của người sử dụng nhưng không xử lý thông tin bí mật nhà nước.
- Cấp độ 3 có nhiều tiêu chí, trong đó có hệ thống xử lý thông tin bí mật nhà nước.
- Khoản 2 Điều 6: hệ thống đồng thời đáp ứng tiêu chí của nhiều cấp độ thì áp dụng cấp độ cao nhất; nghiêm cấm xác định phạm vi hệ thống một cách hình thức nhằm thay đổi cấp độ hoặc giảm yêu cầu an ninh mạng.
- Hệ thống phải có một chủ quản duy nhất; hồ sơ đề xuất cấp độ 1 hoặc 2 do đơn vị chuyên trách về an ninh mạng của chủ quản hệ thống thẩm định.

Danh sách tiêu chí trên chưa đầy đủ. Trước khi lập hồ sơ, đồng chí cần đọc nguyên văn Nghị định trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

### 20.1.3. Một bài tập thận trọng: đặt các phân hệ vào khung cấp độ

Để thấy khung cấp độ áp vào thực tế thế nào, tôi thử đặt các phân hệ của hệ thống vào khung theo dữ liệu mà chúng sẽ xử lý nếu dùng thật. Xin nói trước: đây là gợi ý ban đầu của người làm phần mềm để mang đi trao đổi, không phải kết luận. Xác định cấp độ là việc của đơn vị có thẩm quyền.

| Phân hệ | Dữ liệu khi dùng thật | Gợi ý ban đầu |
|---|---|---|
| Bản tin pháp luật | Tin công khai từ nguồn chính thống | Gần với cấp độ 1 |
| Sổ tay AI (cổng vào) | Văn bản đã công khai, câu hỏi mẫu | Gần với cấp độ 1 |
| Đánh giá OKR/KPI, Kiểm điểm | Điểm, xếp loại, nhận xét từng người | Từ cấp độ 2 trở lên |
| Quản lý cán bộ | Hồ sơ 2C, số định danh, quan hệ gia đình | Từ cấp độ 2; có dữ liệu nhạy cảm |
| Bot Zalo, Telegram | Câu hỏi, số liệu nạp kèm, danh bạ | Từ cấp độ 2 trở lên |
| Biểu quyết | Kết quả biểu quyết của kỳ họp | Cần đánh giá riêng |

Bài tập này dạy tôi một điều quan trọng hơn chính bảng phân loại. Hệ thống thử nghiệm dùng chung một bảng dữ liệu, một tài khoản dịch vụ, một cửa đăng nhập cho mọi phân hệ. Theo khoản 2 Điều 6 Nghị định 331/2026/NĐ-CP, hệ thống đáp ứng tiêu chí của nhiều cấp độ thì áp dụng cấp độ cao nhất. Như vậy, theo cách tôi hiểu, nếu chính thức hóa nguyên trạng, cả hệ thống có thể phải theo cấp độ của phần nhạy cảm nhất là hồ sơ cán bộ. Và không được "cắt" phạm vi hệ thống một cách hình thức trên giấy để hạ cấp độ.

Bài học thiết kế rút ra: phần nào chứa dữ liệu nhạy cảm nên được tách thành hệ thống riêng ngay từ kiến trúc, có cơ sở dữ liệu riêng, quyền riêng. Tách thật từ thiết kế khác hẳn với tách hình thức lúc lập hồ sơ. Đây là điều tôi ước mình đã nghĩ tới từ ngày thêm phân hệ Quản lý cán bộ.

::: {.thuchanh}
**Thực hành: tự phân loại ứng dụng của mình trong 15 phút**

1. Viết một câu mô tả ứng dụng phục vụ ai, làm việc gì, đang chạy ở đâu.
2. Liệt kê mọi loại dữ liệu ứng dụng lưu hoặc gửi đi: họ tên, chức vụ, điểm số, số điện thoại, nội dung văn bản, câu hỏi của người dùng.
3. Đánh dấu từng loại theo vùng ĐỎ, VÀNG, XANH của Tập 1; đánh dấu thêm loại nào là dữ liệu cá nhân, loại nào có thể nhạy cảm.
4. Ghi ra mọi dịch vụ bên ngoài mà dữ liệu đi qua: nơi lưu cơ sở dữ liệu, dịch vụ AI, nền tảng nhắn tin.
5. Đối chiếu với các tiêu chí cấp độ trong hộp Căn cứ pháp lý ở trên, viết một dòng gợi ý cấp độ kèm lý do, rồi mang tờ giấy này đến trao đổi với đơn vị chuyên trách. Đừng tự kết luận.
:::

::: {.ghinho}
**Ghi nhớ**

Một bản demo đã chứa dữ liệu thật thì không còn là bản demo nữa, dù trên đầu trang vẫn ghi chữ "demo". Nhãn không bảo vệ dữ liệu; chỉ hạ tầng, phân quyền và trách nhiệm được xác lập mới bảo vệ dữ liệu.
:::
