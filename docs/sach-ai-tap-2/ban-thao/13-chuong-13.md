# Chương 13. Trợ lý AI nghiệp vụ dân cử và Người hướng dẫn trên Trang chủ

::: {.muctieu}
**Mục tiêu của chương**

- Nắm tám tác vụ của phân hệ Trợ lý AI nghiệp vụ dân cử và vì sao nên "đóng gói" câu lệnh tốt thành nút bấm.
- Biết cách cùng AI chuyển một ứng dụng cũ sang nền tảng mới: kiểm kê trước, nói rõ cái giữ, cái bỏ, cái thay.
- Thiết kế được chốt chặn chi phí khi phần mềm gọi AI: hạn mức đếm ở máy chủ, trừ lượt trước và hoàn lượt khi lỗi, kiểm tra yêu cầu trước khi trừ lượt, băm thay vì lưu địa chỉ IP.
- Hiểu khung chat hai tầng (kịch bản miễn phí cộng AI có hạn mức) và ranh giới dữ liệu khi người hỏi là khách vô danh.
- Viết và thử được một lời nhắc hệ thống: cấm bịa, nhắc bản demo, không làm lộ thông tin.

Dành cho: chuyên viên các Ban, Phòng Công tác Hội đồng nhân dân, người phụ trách công nghệ thông tin của Văn phòng; lãnh đạo cần quyết định có đưa AI vào phần mềm của cơ quan hay không (đọc kỹ mục 13.3 và hộp "Dành cho lãnh đạo").
:::

Các chương 9 đến 12 nói về những phân hệ mà AI chỉ đứng ở hậu trường: tác tử AI lập trình viết mã, còn phần mềm tính điểm, kiểm phiếu theo công thức cố định. Chương này lên bậc cao nhất của thang kiến tạo ở Chương 2: phần mềm có AI ngay bên trong. Mỗi lần người dùng bấm nút, phần mềm gửi một câu lệnh tới dịch vụ AI và nhận về một bản nháp.

Hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) có hai công cụ như vậy. Phân hệ "Trợ lý AI nghiệp vụ dân cử" (đường dẫn `#/troly`) dành cho cán bộ, công chức đang làm việc: soạn văn bản, soát lỗi, dựng báo cáo thẩm tra. "Người hướng dẫn" là khung chat nhỏ ở góc Trang chủ, dành cho bất kỳ ai ghé vào mà chưa biết bắt đầu từ đâu.

Hai công cụ chung ba câu hỏi. AI được thấy dữ liệu nào? Mỗi lượt gọi AI tốn tiền thì trần đặt ở đâu? Làm sao để câu trả lời trơn tru không bị hiểu nhầm là kết luận chính thức? Theo thứ tự các mục trong nhật ký dự án, cả hai được dựng sau sự cố dữ liệu ngày 13/8/2026 và trước đợt làm bản tin pháp luật đầu tháng 9/2026.

## 13.1. Tám tác vụ của Trợ lý AI nghiệp vụ dân cử

### 13.1.1. Bài toán: biến câu lệnh tốt thành nút bấm

Tập 1 đã trang bị khung lệnh V-B-V-D-R: Vai, Bối cảnh, Việc, Dạng, Ràng buộc. Dùng một thời gian, tôi thấy mỗi người một kiểu câu lệnh; câu lệnh hay nằm trong sổ tay riêng của người viết ra nó; người mới lại bắt đầu từ con số không. Những việc lặp lại mỗi kỳ họp Hội đồng nhân dân (HĐND), như dựng báo cáo thẩm tra bốn phần, kỳ nào cũng gõ lại từ đầu.

Văn phòng nào cũng có mẫu công văn, mẫu tờ trình để cán bộ không phải tự nghĩ ra thể thức. Trợ lý AI nghiệp vụ dân cử làm việc đó cho câu lệnh: câu lệnh tốt được viết một lần, thử nhiều lần, rồi gắn sau một nút bấm. Cán bộ chỉ điền vài ô; phần mềm ghép thành câu lệnh đầy đủ, gửi đi, nhận bản nháp về và đặt vào một khung sửa được.

Đây là phân hệ ở Bậc 4: có cơ sở dữ liệu (database), có đăng nhập, có AI bên trong. Khi đưa một phần mềm như thế vào phục vụ công việc, cơ quan không còn chỉ là người dùng AI.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15, Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026. Điều 3 phân biệt nhà phát triển, nhà cung cấp, bên triển khai và người sử dụng hệ thống AI; theo cách hiểu của tôi, cơ quan đưa phần mềm có AI vào phục vụ công việc ở vị trí bên triển khai. Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Thông tư 05/2026/TT-BKHCN ngày 10/3/2026 (hiệu lực cùng ngày) quy định Khung đạo đức trí tuệ nhân tạo quốc gia, bắt buộc áp dụng với cơ quan quản lý nhà nước và tổ chức, cá nhân triển khai, sử dụng hệ thống AI phục vụ quản lý nhà nước, cung cấp dịch vụ công.
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ: không đưa lên chatbot AI tài liệu thuộc bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; không phụ thuộc hoàn toàn vào AI; kiểm tra kết quả trước khi dùng.
- Hướng dẫn kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: AI "hỗ trợ, không thay thế"; mọi sản phẩm do AI tạo ra phải được cán bộ, đảng viên kiểm chứng, thẩm định, chỉnh sửa và chịu trách nhiệm hoàn toàn trước khi sử dụng hoặc ban hành.
:::

### 13.1.2. Bản đồ tám tab

| Tab | Đồng chí đưa vào | Nhận về |
|---|---|---|
| Trợ lý kỳ họp | Tài liệu kỳ họp; chọn 1 trong 6 tác vụ | Báo cáo phân tích, gợi ý chất vấn |
| Soạn thảo văn bản | Loại văn bản, yêu cầu, căn cứ | Dự thảo tách sẵn từng ô thể thức |
| Bài phát biểu | Chức danh, sự kiện, ý chính | Bài phát biểu theo bố cục chuẩn |
| Soát xét văn bản | Văn bản cần rà, trọng tâm rà | Bảng lỗi kèm đề xuất sửa |
| Thẩm tra dự thảo | Ban thẩm tra, tờ trình, dự thảo | Báo cáo thẩm tra bốn phần |
| Kiến nghị cử tri | Từng kiến nghị hoặc tệp tổng hợp | Danh sách theo dõi, phân tích xu hướng |
| Thư viện tài liệu | Tệp PDF, DOCX, TXT | Kho ngữ cảnh dùng lại |
| Hỏi đáp | Câu hỏi tự do, hỏi nối tiếp | Câu trả lời tham khảo |

Trợ lý kỳ họp có sáu tác vụ dựng sẵn: so sánh số liệu tìm mâu thuẫn, đề xuất câu hỏi chất vấn, kiểm tra tuân thủ nghị quyết HĐND, phân tích điểm nghẽn ngân sách, tóm tắt rủi ro chính sách, tự đặt câu hỏi. Chương 16 đặt các tác vụ này vào quy trình chuẩn bị kỳ họp.

Ba điều chung cho cả tám tab. Kết quả luôn hiện trước trong một khung sửa được, sửa xong mới tải Word. Dưới kết quả luôn có dòng nhắc: nội dung do AI sinh ra chỉ để tham khảo, phải rà soát, đối chiếu văn bản gốc trước khi sử dụng chính thức. Việc đọc tệp tải lên (PDF, DOCX, TXT, tối đa 3 MB) chạy ở máy chủ bằng thư viện, không gọi AI nên không tính lượt; tệp PDF bản chụp (scan) không trích được chữ và giao diện báo rõ.

### 13.1.3. Ba tác vụ nhìn cận cảnh

**Soạn thảo theo thể thức.** Đồng chí chọn loại văn bản (công văn, báo cáo, quyết định, nghị quyết, tờ trình, hoặc để máy tự chọn), gõ yêu cầu, dán căn cứ pháp lý vào ô riêng. Câu lệnh dựng sẵn bắt AI trả về một "phiếu điền sẵn ô" mười trường: cơ quan chủ quản, cơ quan ban hành, số ký hiệu, địa danh và ngày tháng, loại văn bản, trích yếu, nội dung chính, nơi nhận, quyền hạn ký, người ký. Phiếu viết ở định dạng JSON, một cách ghi dữ liệu theo cặp "tên ô – nội dung".

Tách ô để bộ xuất Word đặt mỗi ô vào đúng vị trí thể thức, và để cán bộ sửa trích yếu thì chỉ sửa ô trích yếu. AI trả về sai dạng thì phần mềm không vỡ mà hiện nguyên văn kèm cảnh báo. Mỗi loại văn bản có cấu trúc đặc thù ghi sẵn trong câu lệnh: quyết định thì căn cứ rồi Điều 1, Điều 2, Điều 3; báo cáo thì tình hình, kết quả, phương hướng. Căn cứ được cắt ở 12.000 ký tự, tài liệu tham khảo ở 20.000 ký tự.

Nghị định 30/2020/NĐ-CP ngày 05/3/2020 về công tác văn thư quy định thể thức và kỹ thuật trình bày văn bản hành chính. Nút "Xuất Word chuẩn NĐ 30" chỉ lo phần trình bày. Nội dung, căn cứ, thẩm quyền ký là việc của người soạn và người duyệt; ngay dưới nút có dòng nhắc rà soát thể thức, căn cứ, số liệu trước khi trình ký. Nghị quyết của HĐND còn có trình tự, thủ tục ban hành riêng, nên bản nháp của máy chỉ là điểm khởi đầu.

**Soát xét: chỉ ra lỗi, không viết lại.** Câu lệnh cấm AI viết lại toàn văn; AI chỉ lập bảng sáu cột: số thứ tự, vị trí, nội dung gốc, đề xuất hiệu chỉnh, phân loại lỗi, lý do. Người dùng chọn trọng tâm trong bốn nhóm: chính tả và ngữ pháp, thể thức NĐ 30, văn phong hành chính, logic quản lý. Phần logic quản lý có sẵn một ví dụ: báo cáo sơ kết "01 năm" mà số liệu chỉ từ 01/7/2025 đến 15/5/2026. Đây là chiếc máy "X-quang văn bản" của Tập 1, đóng gói thành nút bấm. Cấm viết lại là cố ý: người soạn giữ trách nhiệm với văn bản của mình, nhìn bảng là biết chỗ nào đổi, đề xuất nào không đồng ý thì bỏ qua.

**Thẩm tra dự thảo nghị quyết.** Đồng chí chọn một trong bốn Ban (Kinh tế - Ngân sách, Pháp chế, Văn hóa - Xã hội, Dân tộc), tải tờ trình và dự thảo (cắt ở 40.000 ký tự), thêm văn bản liên quan (15.000 ký tự). AI dựng bốn phần: cơ sở pháp lý và thẩm quyền ban hành; sự phù hợp về nội dung, có đối chiếu tờ trình với dự thảo; khả năng cân đối nguồn lực, có phản biện nguồn kinh phí; kết luận và kiến nghị. Câu lệnh dặn đánh mục theo I., II., 1., a) của văn bản hành chính để bản tải về dùng được ngay. Báo cáo thẩm tra thể hiện ý kiến của Ban: AI dựng khung lập luận, còn thống nhất hay không là kết luận của tập thể Ban.

::: {.vidu}
**Ví dụ minh họa — một buổi chuẩn bị thẩm tra với 5 lượt gọi AI**

Hãy hình dung một chuyên viên Ban Kinh tế - Ngân sách nhận tờ trình và dự thảo nghị quyết về một chương trình đầu tư đã được công khai. Tài khoản đăng nhập có 5 lượt mỗi ngày.

1. Lượt 1 — Trợ lý kỳ họp, tác vụ "So sánh số liệu": tìm chỗ tờ trình và dự thảo ghi tổng vốn khác nhau.
2. Lượt 2 — Trợ lý kỳ họp, tác vụ "Phân tích điểm nghẽn ngân sách".
3. Lượt 3 — Thẩm tra dự thảo: dựng khung báo cáo bốn phần.
4. Không dùng AI — tự đối chiếu từng căn cứ trên Cơ sở dữ liệu quốc gia về văn bản pháp luật, thay mọi nhận định chưa kiểm chứng.
5. Lượt 4 — Soát xét bản đã sửa, trọng tâm thể thức và logic quản lý. Lượt 5 để dự phòng.

Bước 4 không được bỏ. Máy làm nhanh ba việc đầu; phần quyết định chất lượng vẫn là phần của người.
:::

### 13.1.4. Kiến nghị cử tri và thư viện: nơi dữ liệu nhạy cảm nhất

Tab Kiến nghị cử tri ghi từng kiến nghị: tên cử tri, địa bàn, nội dung, một trong 8 lĩnh vực (giao thông, môi trường, y tế, giáo dục, đất đai, đầu tư công, chính sách xã hội, khác) và một trong 3 trạng thái (mới, đang xử lý, đã xong). Có hai nút gọi AI: tổng hợp từ một tệp tải lên, hoặc phân tích xu hướng trên danh sách đã lưu và chỉ ra kiến nghị tồn đọng cần đôn đốc. Tab Thư viện giữ tối đa 30 tài liệu, mỗi tài liệu 60.000 ký tự, để Trợ lý kỳ họp chọn làm ngữ cảnh.

Hai tab lưu chung một dòng dữ liệu, thiết kế khác hẳn các phân hệ chấm điểm: chỉ người đã đăng nhập mới đọc, ghi được, vì kiến nghị có tên người dân. Khách mở tab thấy danh sách trống. Tệp cấu hình cơ sở dữ liệu có ghi chú dặn người sau: trống là đúng thiết kế, đừng "sửa" bằng cách mở quyền đọc công khai.

::: {.canhbao}
**Cảnh báo — tệp tải lên đi nguyên văn tới dịch vụ AI**

- Bấm "Tổng hợp từ tệp" là toàn bộ chữ trong tệp, tới 20.000 ký tự, được gửi cho nhà cung cấp AI; họ tên, địa chỉ, số điện thoại của cử tri trong tệp cũng đi theo.
- "Phân tích xu hướng" không gửi cột tên cử tri, nhưng tên viết trong ô nội dung vẫn đi.
- Chỉ đưa vào văn bản đã ẩn danh hoặc thuộc vùng XANH của Tập 1. Đơn thư khiếu nại, tố cáo, tài liệu mật thuộc vùng ĐỎ, không đưa vào công cụ AI nào trên Internet.
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 01/01/2026) chia dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm. Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực 01/3/2026), tại Điều 5, nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng viễn thông, mạng máy tính (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu); khoản 10 của điều này cấm sử dụng hệ thống AI để xâm phạm bí mật nhà nước.
:::

Tab Hỏi đáp là khung trò chuyện tự do, gửi kèm tối đa 10 lượt hội thoại gần nhất, mỗi lượt cắt còn 6.000 ký tự; lời nhắc hệ thống của tab này được phân tích ở mục 13.5.

## 13.2. Chuyển một ứng dụng Python (Streamlit) sang React cùng AI

### 13.2.1. Ứng dụng gốc và lý do chuyển

Trước phân hệ này, tôi đã có một ứng dụng trợ lý nghiệp vụ riêng tại địa chỉ hdndthanhhoa.streamlit.app, viết bằng Python trên Streamlit, một bộ công cụ dựng nhanh trang web từ tập lệnh Python. Ứng dụng có 8 trang, lưu dữ liệu bằng SQLite hoặc Postgres, đăng nhập bằng tài khoản Google, có kho tìm kiếm theo nghĩa (kho vector) và hệ tín dụng (credits) để giới hạn lượt dùng.

Hai ứng dụng song song nghĩa là hai địa chỉ, hai tài khoản, hai kiểu xuất Word, hai nơi phải sửa khi quy định đổi. Lịch công tác, Giám sát số, Một dữ liệu được gắn bằng liên kết (Chương 12). Ứng dụng này thì tôi chọn chuyển hẳn sang React, vì nó cần chung đăng nhập, chung bộ nối AI với bot chat và chung bộ xuất Word với các phân hệ khác.

Chuyển một ứng dụng giống chuyển trụ sở. Không ai bê nguyên mọi thứ sang chỗ mới; phải kiểm kê cái mang theo, cái thanh lý, cái thay mới, và lập biên bản để sau này ai hỏi "cái tủ cũ đâu" thì có câu trả lời.

::: {.cauchuyen}
**Câu chuyện thực tế: chọn bốn trang, ghi rõ lý do bỏ hai trang**

Nhật ký dự án ghi quyết định của người dùng, tức là của tôi: chuyển trang 1 (Trung tâm lập pháp), trang 2 (Soạn thảo), trang 3 (Thẩm tra) và trang 6 (Trợ lý AI) thành một phân hệ 8 tab. Trang 7 bỏ vì chỉ chuyển tiếp sang chính hệ thống hdndthkpi. Trang 8 bỏ vì trùng với phân hệ Giám sát số vừa được gắn vào Trang chủ.

Cùng mục nhật ký có đoạn "khác bản gốc — nói rõ": không có tìm kiếm vector, Trợ lý kỳ họp nạp nguyên văn tài liệu được chọn; không có hệ tín dụng và tài khoản riêng. Nhờ đoạn này, ai đọc cũng biết vì sao bản mới không tự tìm đoạn liên quan trong cả kho tài liệu như bản cũ, không phải đoán.
:::

### 13.2.2. Bảng kiểm kê: giữ, bỏ, thay

| Hạng mục | Bản cũ (Streamlit) | Bản mới (React) | Quyết định |
|---|---|---|---|
| Câu lệnh nghiệp vụ | Trong mã Python | Chép nguyên văn sang tệp logic thuần | Giữ |
| Trang chức năng | 8 trang | 8 tab từ trang 1, 2, 3, 6 | Giữ 4, bỏ 2 |
| Đọc tệp PDF, Word | Thư viện Python | Thư viện đọc PDF sẵn có; Word tự đọc | Thay |
| Tìm đoạn liên quan | Kho vector | Nạp nguyên văn tài liệu được chọn | Bỏ |
| Tài khoản | Đăng nhập Google riêng | Đăng nhập chung của hệ thống | Thay |
| Giới hạn lượt | Hệ tín dụng | Hạn mức lượt theo ngày | Thay |
| Xuất Word | Thư viện Python | Thư viện JavaScript, giữ bố cục | Thay |
| Kiến nghị cử tri | Bảng riêng | Một dòng dữ liệu, chỉ người đăng nhập đọc | Thay |

Bản cũ có một "thủ thư" lập thẻ mục lục theo nghĩa cho từng đoạn tài liệu, hỏi gì thì rút đúng mấy đoạn gần nghĩa nhất; Tập 1 gọi đó là truy hồi tăng cường (RAG). Bản mới không có thủ thư: chọn tài liệu nào thì mang nguyên tập đó vào, cắt ở 30.000 ký tự cho Trợ lý kỳ họp, phần bị cắt được đánh dấu ngay trong câu lệnh gửi AI. Đổi lại, không phải dựng và nuôi một kho vector. Về sau, Sổ tay AI (Chương 15) có cơ chế tìm đoạn liên quan đơn giản chạy ngay trong trình duyệt.

Tệp .docx thực chất là một "phong bì nén" (định dạng ZIP) chứa các tờ chữ có cấu trúc (XML). Tác tử AI viết một hàm nhỏ mở phong bì bằng công cụ giải nén có sẵn của Node, khỏi thêm thư viện mới. Bớt một thư viện là bớt một thứ phải cập nhật, phải lo về an toàn.

### 13.2.3. Ba nguyên tắc khi chuyển cùng AI

**Kiểm kê trước khi viết dòng mã nào.** Tác tử AI đọc mã rất nhanh và rất muốn bắt tay vào làm. Hãy chặn nó ở bước kiểm kê, đọc bảng kiểm kê như đọc một tờ trình, rồi mới duyệt.

::: {.lenhmau}
**Câu lệnh mẫu 13.1 — Kiểm kê một ứng dụng cũ trước khi chuyển**

```text
Vai: Kỹ sư chuyển đổi hệ thống, báo cáo cho người không chuyên.
Bối cảnh: Thư mục [đường dẫn] là ứng dụng cũ viết bằng [ngôn ngữ].
Tôi muốn chuyển nó vào hệ thống hiện tại (xem CLAUDE.md).
Việc: CHƯA sửa mã. Đọc toàn bộ ứng dụng cũ, lập bảng kiểm kê:
Trang/chức năng – Làm gì – Dữ liệu đọc, ghi – Thư viện phụ thuộc –
Có gọi AI không. Liệt kê riêng mọi câu lệnh gửi AI.
Dạng: Bảng tiếng Việt, thêm cột đề xuất "Giữ / Bỏ / Thay" kèm lý do;
nêu rõ chức năng nào của bản cũ sẽ KHÔNG còn ở bản mới.
Ràng buộc: Không đoán; chỗ chưa chắc ghi "cần hỏi lại". Không chép
dữ liệu thật, khóa, mật khẩu của bản cũ vào báo cáo.
Nghiệm thu: Tôi duyệt từng dòng cột quyết định rồi mới giao việc chuyển.
```
:::

**Chuyển câu lệnh nghiệp vụ nguyên văn.** Câu lệnh là tài sản nghiệp vụ đã được thử. Vừa chuyển vừa sửa thì khi kết quả khác đi, không biết do nền tảng mới hay do câu lệnh mới. Muốn cải tiến thì làm sau, làm riêng, ghi nhật ký riêng.

**Tách câu lệnh thành logic thuần và đối chiếu hai đầu.** Tệp chứa câu lệnh không gọi mạng, không đọc cấu hình, nên kiểm thử được bằng Node trong vài giây. Danh mục ở giao diện (loại văn bản, 4 Ban, 6 tác vụ, 8 lĩnh vực) phải trùng danh mục ở máy chủ; một phép kiểm so hai danh sách để không bên nào bị sửa lệch.

::: {.lenhmau}
**Câu lệnh mẫu 13.2 — Chuyển câu lệnh nghiệp vụ kèm phép kiểm đối chiếu**

```text
Việc: Chuyển NGUYÊN VĂN các câu lệnh gửi AI trong [tệp của bản cũ]
sang một tệp logic thuần ở máy chủ (không gọi mạng, không đọc biến
môi trường), mỗi việc một hàm dựng câu lệnh.
Ràng buộc:
- Không sửa câu chữ nghiệp vụ; chỗ nào buộc phải đổi thì liệt kê.
- Ô người dùng bỏ trống thì không chèn mục rỗng vào câu lệnh.
- Giữ đúng các mốc cắt độ dài của bản cũ; phần bị cắt phải ghi chú.
- Danh mục ở giao diện phải khớp danh mục ở máy chủ.
Nghiệm thu: Viết bộ phép kiểm bằng Node, mô tả bằng tiếng Việt:
câu lệnh đủ mục; không có mục rỗng; cắt đúng mốc; đọc được kết quả
JSON dù AI có bọc dấu rào hay không; hai danh mục khớp nhau.
Chạy kiểm thử, lint, build và báo số phép kiểm đạt.
```
:::

### 13.2.4. Nghiệm thu bản chuyển

Lần đầu, bộ kiểm thử của phân hệ có 57 phép kiểm: câu lệnh đủ mục, không chèn mục rỗng; cắt đúng mốc; đọc được JSON dù có dấu rào hay không; đọc thật một tệp .docx và một tệp .pdf tiếng Việt; từ chối tệp .doc, .xlsx; danh mục hai đầu khớp nhau. Các đợt sửa sau nâng dần lên 76 phép kiểm. Theo tôi, một bản chuyển chỉ coi là xong khi có đủ ba thứ: bảng kiểm kê đã duyệt, bộ phép kiểm chạy được, và đoạn "khác bản gốc" trong nhật ký.

## 13.3. Kiểm soát chi phí: mỗi lượt gọi AI là một khoản chi

### 13.3.1. Từ "đóng cửa" sang "phát số"

Gọi dịch vụ AI giống gọi điện đường dài: tính tiền theo lượng dùng. Đơn vị tính gọi là token, tạm hiểu là mẩu chữ; câu lệnh, tài liệu gửi kèm và câu trả lời đều được đếm. Tài liệu cài đặt bot của dự án ước mỗi câu hỏi tốn vài nghìn đến vài chục nghìn token, tùy lượng số liệu nạp kèm. Một lượt thẩm tra mang hàng chục nghìn ký tự thì nặng hơn nhiều.

Khi mới chuyển sang, phân hệ đóng cửa với người chưa đăng nhập: máy chủ hỏi lại hệ thống đăng nhập xem thẻ của trình duyệt còn hiệu lực không, khách bị từ chối. An toàn, nhưng đại biểu, cán bộ xã muốn xem thử thì chịu. Đợt sau, tôi đổi sang "phát số": khách 1 lượt mỗi ngày, người đăng nhập 5 lượt, đổi được bằng biến môi trường.

| Lối gọi AI | Người dùng | Hạn mức mỗi ngày | Bộ đếm |
|---|---|---|---|
| Trợ lý AI, tra nhanh Sổ tay AI | Khách / người đăng nhập | 1 / 5 lượt | Dùng chung |
| Người hướng dẫn | Mọi người, tính như khách | 3 lượt | Riêng |
| Bot Zalo, Telegram | Người đã được duyệt | 30 câu | Riêng (Chương 14) |

### 13.3.2. Bảy chốt chặn, xếp đúng thứ tự

1. **Kiểm tra yêu cầu hợp lệ trước.** Thiếu câu hỏi, tên việc lạ thì từ chối ngay. Trước đợt rà soát đồng bộ toàn hệ thống, yêu cầu sai vẫn bị trừ một lượt rồi mới báo lỗi, như thu phí xong mới soát giấy tờ.
2. **Xác định người gọi.** Trình duyệt gửi kèm thẻ đăng nhập, máy chủ hỏi lại; không có thẻ hoặc thẻ hết hạn thì tính là khách.
3. **Sổ đếm ở máy chủ.** Đếm trong trình duyệt thì xóa lịch sử duyệt web là "hồi sinh" lượt, như phát phiếu ăn để khách tự giữ, tự gạch.
4. **Ngày theo giờ Việt Nam.** Máy chủ cộng 7 giờ vào giờ quốc tế rồi mới lấy ngày. Bot chat từng đặt lại hạn mức lúc 7 giờ sáng ở ta vì tính theo giờ quốc tế.
5. **Khóa đếm không chứa danh tính.** Người đăng nhập đếm theo mã tài khoản. Khách đếm theo 16 ký tự đầu của chuỗi băm SHA-256 ghép từ địa chỉ IP và chuỗi nhận dạng trình duyệt; IP gốc không được lưu. Chuỗi băm như vân tay: nhận ra lần sau, nhưng không dựng lại được bàn tay.
6. **Trừ lượt trước, gọi AI sau.** Gọi xong mới trừ thì bấm liên tiếp năm lần trong lúc chờ, cả năm đều lọt. Hết lượt, máy chủ trả mã 429 kèm câu nhắc hợp vai: khách được mời đăng nhập, người đăng nhập được hẹn ngày mai. AI lỗi thì hoàn lượt, như rạp mất điện thì hoàn vé.
7. **Thiếu cấu hình thì đóng với khách.** Máy chủ thiếu khóa bí mật để ghi sổ đếm thì khách bị từ chối, người đăng nhập vẫn dùng. Không vì quên một biến môi trường mà trần chi phí biến mất.

Mọi phản hồi đều kèm số lượt còn lại, nên giao diện luôn hiện "Lượt gọi AI trong ngày: còn N/M lượt"; hết lượt thì nút gọi AI khóa lại. Đếm lượt không cần biết khách là ai; đã không cần thì không giữ. Cách làm này hợp với tinh thần chỉ xử lý dữ liệu đúng mục đích, trong phạm vi cần thiết của pháp luật bảo vệ dữ liệu cá nhân.

::: {.ghinho}
**Ghi nhớ — rẻ trước, đắt sau**

Kiểm tra yêu cầu → xác định người gọi → trừ lượt → gọi AI → AI lỗi thì hoàn lượt. Giới hạn nào liên quan đến tiền thì máy chủ giữ. Mốc "mỗi ngày" tính theo giờ Việt Nam. Thiếu cấu hình thì mặc định đóng, không mặc định mở.
:::

### 13.3.3. Những chỗ còn hở

Đọc lại mã vào tháng 10/2026 để viết chương này, tôi thấy bốn chỗ chưa trọn.

- **Hoàn lượt chưa đồng đều.** Người hướng dẫn hoàn lượt khi AI lỗi; Trợ lý AI và lối tra nhanh của Sổ tay AI thì chỉ báo lỗi, chưa trả lượt. Cùng một nguyên tắc mà mới áp một chỗ: đúng loại hệ quả dây chuyền mà quy tắc "rà soát chức năng liên quan" (Chương 7) muốn chặn.
- **Đếm hai bước.** Sổ đếm được đọc, cộng một, rồi ghi lại. Hai yêu cầu đến cùng lúc có thể cùng đọc một số và cùng lọt, như hai người cùng thấy bảng còn một chỗ trống và cùng ghi tên. Ở quy mô một cơ quan, sai lệch nhỏ; mở rộng thì nên cộng dồn ngay trong cơ sở dữ liệu.
- **Khóa đếm của khách chỉ gần đúng.** Đổi trình duyệt là thành khách mới; hai người chung mạng cơ quan, cùng loại trình duyệt có thể bị tính chung. Đây là nhận xét khi đọc mã, chưa phải sự cố.
- **Chú thích lỗi thời.** Đầu tệp giao diện và tệp xác thực vẫn ghi "chỉ phục vụ người đã đăng nhập". Đợt rà soát đồng bộ sửa bốn chỗ chữ hiển thị nhưng sót chú thích trong mã, mà tác tử AI ở phiên sau sẽ đọc chú thích ấy.

::: {.canhbao}
**Cảnh báo — hạn mức lượt chưa phải hạn mức tiền**

Một lượt thẩm tra mang vài chục nghìn ký tự đắt hơn nhiều một câu hỏi ngắn. Ngoài hạn mức lượt, dự án chặn thêm: cắt độ dài ngữ cảnh (12.000 đến 40.000 ký tự tùy việc); giới hạn câu trả lời ở 900 token; trần chờ AI 40 giây, nhỏ hơn trần 60 giây của hàm máy chủ. Người giữ khóa API vẫn phải xem hóa đơn sử dụng định kỳ. Khóa API chỉ nằm ở máy chủ, không bao giờ ở mã chạy trên trình duyệt (Chương 19).
:::

::: {.lenhmau}
**Câu lệnh mẫu 13.3 — Rà soát trần chi phí của mọi chỗ gọi AI**

```text
Việc: CHƯA sửa mã. Liệt kê MỌI điểm nối ở máy chủ có gọi dịch vụ AI.
Với mỗi điểm nối, lập bảng trả lời 7 câu:
1. Kiểm tra yêu cầu hợp lệ trước khi trừ lượt chưa?
2. Xác định người gọi thế nào; khách được tính ra sao?
3. Sổ đếm nằm ở đâu; có đếm trong trình duyệt không?
4. Mốc đặt lại hạn mức theo giờ nào?
5. Trừ lượt trước hay sau khi gọi AI?
6. AI lỗi thì có hoàn lượt không?
7. Thiếu khóa, thiếu cấu hình thì mở hay đóng với khách?
Thêm cột: độ dài ngữ cảnh tối đa, độ dài trả lời tối đa, trần chờ.
Dạng: Bảng tiếng Việt; đánh dấu [HỞ] ở ô khác với các điểm nối còn lại.
Ràng buộc: Trích tên tệp và dòng mã làm bằng chứng; không đoán.
Nghiệm thu: Đề xuất cách vá từng chỗ [HỞ] kèm phép kiểm; chờ tôi duyệt.
```
:::
