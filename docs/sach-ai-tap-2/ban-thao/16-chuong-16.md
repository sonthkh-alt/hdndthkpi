# Chương 16. Quy trình AI cho các nghiệp vụ trọng tâm

::: {.muctieu}
**Mục tiêu của chương**

- Nắm một khuôn chung cho mọi quy trình có dùng AI: các bước, phần việc của AI, phần việc của người, vùng dữ liệu ĐỎ/VÀNG/XANH và bốn chốt kiểm soát.
- Áp khuôn đó vào tám nhóm nghiệp vụ trọng tâm của cơ quan dân cử: kỳ họp, thẩm tra, giám sát, tiếp công dân và đơn thư, tiếp xúc cử tri, hoạt động của Đoàn đại biểu Quốc hội, văn bản – truyền thông và việc nội bộ của Văn phòng.
- Có trong tay hơn hai mươi câu lệnh mẫu dùng được ngay, mỗi câu ghi rõ vùng dữ liệu được phép.
- Biết những ranh giới không được vượt: bí mật nhà nước, dữ liệu cá nhân của người khiếu nại, tố cáo và của cử tri, thẩm quyền kết luận của tập thể và của người có thẩm quyền.

Dành cho: chuyên viên các phòng của Văn phòng, chuyên viên giúp việc các Ban, tổ giúp việc các đoàn giám sát; lãnh đạo phòng, lãnh đạo Ban khi phân công và duyệt sản phẩm có dùng AI. Đây là chương nên đọc kỹ nhất đối với người dùng AI hằng ngày.
:::

Mười lăm chương trước chủ yếu kể chuyện làm ra công cụ. Chương này quay về bàn làm việc. Phần lớn cán bộ, công chức sẽ không tự lập trình một ứng dụng nào, nhưng ai cũng có kỳ họp phải chuẩn bị, dự thảo phải thẩm tra, báo cáo phải tổng hợp. Câu hỏi thiết thực của họ là: với việc cụ thể hôm nay, AI giúp được khâu nào, khâu nào tuyệt đối không được giao, dữ liệu nào được dán vào, và ai chịu trách nhiệm ở đâu.

Tôi không viết chương này theo kiểu "mẹo hay". Mỗi nghiệp vụ được trình bày thành một quy trình có các bước, có người chịu trách nhiệm ở từng bước, có câu lệnh mẫu và có điểm kiểm soát. Đó là cách Văn phòng (Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa) vẫn làm việc: việc gì cũng có quy trình, quy trình nào cũng có người ký. AI chỉ được đặt vào bên trong quy trình ấy, không được đặt lên trên nó.

Ngày 07/5/2026, Thường trực Hội đồng nhân dân (HĐND) tỉnh tổ chức hội nghị tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng, với các nội dung thực hành tóm tắt, xử lý tài liệu, dùng AI chuẩn bị kỳ họp, giám sát, điều phối công việc, và an toàn dữ liệu, đạo đức công vụ. Chương này có thể xem là phần "làm tiếp sau tập huấn": biến những gì đã nghe thành thao tác hằng ngày có kỷ luật.

**Khuôn chung cho mọi quy trình.** Trước khi đưa AI vào một việc, tôi luôn tự trả lời năm câu hỏi. Đồng chí có thể in bảng dưới đây dán cạnh màn hình.

| Câu hỏi | Nếu chưa trả lời được thì |
|---|---|
| Sản phẩm cuối là gì, ai ký? | Chưa dùng AI, làm rõ nhiệm vụ trước |
| Dữ liệu đầu vào thuộc vùng nào? | Dừng lại phân loại, ẩn danh |
| AI làm khâu nào, người làm khâu nào? | Viết ra thành bảng phân việc |
| Kết quả của AI được kiểm bằng gì? | Chuẩn bị văn bản gốc để đối chiếu |
| Dùng AI ở đâu thì ghi lại ở đâu? | Lập sổ theo dõi, dù chỉ một dòng |

**Ba vùng dữ liệu, ba cách ứng xử.** Tập 1 đã đặt kỷ luật phân loại dữ liệu vùng ĐỎ/VÀNG/XANH. Áp vào cơ quan dân cử, tôi cụ thể hóa như sau.

| Vùng | Ví dụ ở cơ quan dân cử | Được dùng công cụ nào |
|---|---|---|
| XANH | Nghị quyết đã ban hành; dự thảo luật đã đăng lấy ý kiến; báo cáo đã công bố tại kỳ họp | Trợ lý AI trò chuyện đã tắt huấn luyện; sổ tay Gemini Notebook |
| VÀNG | Dự thảo chưa trình; tờ trình gửi đại biểu trước kỳ họp; báo cáo của đơn vị gửi đoàn giám sát; ghi chép thảo luận tổ | Ẩn danh trước; ưu tiên gói dành cho tổ chức hoặc AI chạy trên máy cơ quan |
| ĐỎ | Tài liệu mật; đơn thư có danh tính; hồ sơ nhân sự; nội dung đánh giá cá nhân | Không đưa lên AI công cộng; xử lý thủ công hoặc trên hệ thống nội bộ có phân quyền |

Vài lưu ý cho bảng trên. Với tài khoản cá nhân, ngay khi tạo tài khoản phải vào mục Cài đặt → Quyền riêng tư hoặc Kiểm soát dữ liệu để tắt việc cho phép dùng hội thoại huấn luyện mô hình. Tên nút đổi theo từng đợt cập nhật của nhà cung cấp, nên tôi không ghi cố định. Gói dành cho tổ chức thường cam kết không huấn luyện trên nội dung theo mặc định; điều này đã được kiểm chứng với gói Team, Enterprise của Claude, còn với các hãng khác phải đọc điều khoản hiện hành trước khi dùng. AI chạy trên máy cơ quan (ví dụ công cụ mã nguồn mở Ollama cùng các mô hình tải về máy) giúp dữ liệu vùng VÀNG không rời khỏi máy, đổi lại chất lượng tiếng Việt và khả năng suy luận thấp hơn rõ rệt; Ollama nay có cả mô hình chạy trên đám mây, nên phải chọn đúng mô hình đã tải về. Còn tài liệu mật thì không thuộc phạm vi bất kỳ công cụ AI nào nói trong sách này.

**Bốn chốt kiểm soát.** Ở mỗi quy trình dưới đây, tôi đánh dấu bốn chốt bằng ký hiệu K1 đến K4 để đồng chí dễ nhận ra.

- **K1 — Chốt dữ liệu**, trước khi dán: phân vùng, ẩn danh, cắt bỏ phần không cần.
- **K2 — Chốt nguồn**, sau khi AI trả lời: mọi số hiệu, điều, khoản, con số phải đối chiếu văn bản gốc.
- **K3 — Chốt thẩm quyền**: người hoặc tập thể có thẩm quyền xem xét, quyết định, ký. AI không bao giờ đứng ở chốt này.
- **K4 — Chốt lưu vết**: ghi lại phần nào có dùng AI, ai đã kiểm, kiểm ngày nào.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15, Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026. Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ hướng dẫn công chức, viên chức, người lao động trong cơ quan nhà nước sử dụng chatbot AI: không đưa lên chatbot tài liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; không phụ thuộc hoàn toàn vào AI; kiểm tra kết quả trước khi dùng.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: AI hỗ trợ, không thay thế; mọi sản phẩm do AI tạo ra phải được kiểm chứng, thẩm định, chỉnh sửa và người dùng chịu trách nhiệm hoàn toàn trước khi sử dụng hoặc ban hành; không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI.
:::

Bốn chốt kiểm soát ở trên thực chất là cách cụ thể hóa ba văn bản này thành thao tác. Phần còn lại của chương đi lần lượt qua tám nghiệp vụ.

## 16.1. Chuẩn bị kỳ họp HĐND

Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15 (thông qua và có hiệu lực từ ngày 16/6/2025), HĐND họp mỗi năm ít nhất hai kỳ; họp chuyên đề hoặc họp giải quyết công việc đột xuất khi Thường trực HĐND, Chủ tịch Ủy ban nhân dân (UBND) cùng cấp hoặc ít nhất một phần ba tổng số đại biểu HĐND yêu cầu. Mỗi kỳ họp là một khối việc lớn của Văn phòng: chương trình, kế hoạch, giấy mời, tài liệu, báo cáo thẩm tra, tổng hợp thảo luận, kịch bản điều hành, nghị quyết, biên bản. Phần lớn là việc giấy tờ có khuôn mẫu, đúng loại việc AI làm tốt ở khâu nháp.

### 16.1.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Vùng |
|---|---|---|---|
| 1. Chương trình, kế hoạch | Dựng khung từ kế hoạch kỳ trước, lập bảng mốc | Thường trực quyết định nội dung, thời gian | VÀNG |
| 2. Kiểm hồ sơ tài liệu | Đối chiếu danh mục đã nhận với danh mục phải có | Chuyên viên xác nhận, đôn đốc cơ quan trình | VÀNG |
| 3. Tóm tắt cho đại biểu | Lập phiếu tóm tắt một trang mỗi nội dung | Chuyên viên kiểm từng con số | XANH/VÀNG |
| 4. Tổng hợp thảo luận tổ | Gom ý kiến đã ẩn danh theo nội dung | Tổ thư ký ghi tên khi làm bản chính thức | VÀNG |
| 5. Kịch bản điều hành | Dựng kịch bản theo chương trình đã duyệt | Chủ tọa, Thường trực duyệt | VÀNG |
| 6. Biểu quyết, biên bản | Không tham gia | Hệ thống biểu quyết và quy chế của HĐND | — |

Hai bước tốn công nhất thường là bước 2 và bước 3. Bước 2 là việc dò từng tập tài liệu xem đã có tờ trình chưa, dự thảo nghị quyết đã kèm chưa, báo cáo thẩm tra của Ban đã về chưa. Bước 3 là việc giúp đại biểu, nhất là đại biểu không chuyên trách, nắm nhanh một tập tài liệu hàng chục trang trước khi vào hội trường.

Phân hệ "Trợ lý AI nghiệp vụ dân cử" trong hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app, đường dẫn `#/troly`) có tab Trợ lý kỳ họp với sáu tác vụ dựng sẵn: so sánh số liệu tìm điểm mâu thuẫn; đề xuất câu hỏi chất vấn; kiểm tra tính tuân thủ nghị quyết HĐND; phân tích điểm nghẽn ngân sách; tóm tắt rủi ro chính sách; tự đặt câu hỏi. Lời nhắc của các tác vụ này có một dòng tôi coi là quan trọng nhất: chỉ trích dẫn thông tin có trong tài liệu được cung cấp, thiếu dữ liệu thì ghi rõ là thiếu, không suy đoán. Đó là bản demo thử nghiệm, có hạn mức lượt gọi mỗi ngày (Chương 13), và chỉ nên nạp tài liệu công khai hoặc đã ẩn danh. Đồng chí không có phân hệ ấy vẫn làm được y hệt bằng câu lệnh dưới đây trên một trợ lý AI trò chuyện.

::: {.lenhmau}
**Câu lệnh mẫu 16.1 — Kiểm danh mục hồ sơ tài liệu kỳ họp**

```text
Vai: Chuyên viên Phòng Công tác HĐND, phụ trách tài liệu kỳ họp.
Bối cảnh: Kỳ họp [thứ ... / chuyên đề] của HĐND tỉnh dự kiến xem xét
các nội dung trong DANH MỤC A. Văn phòng đã nhận các tệp trong
DANH MỤC B (chỉ có tên tệp, ngày nhận, cơ quan gửi).
Việc: Đối chiếu A với B. Với mỗi nội dung ở A, cho biết đã có
tờ trình chưa, dự thảo nghị quyết chưa, báo cáo thẩm tra chưa,
tài liệu kèm theo chưa.
Dạng: Bảng 5 cột: Nội dung | Tờ trình | Dự thảo | Thẩm tra |
Ghi chú (còn thiếu gì). Cuối bảng: danh sách cơ quan cần đôn đốc.
Ràng buộc: Chỉ dựa vào hai danh mục tôi dán. Tên tệp không rõ
thuộc nội dung nào thì ghi "chưa xác định", không đoán.
[DANH MỤC A]
[DANH MỤC B]
```
:::

Câu lệnh này chỉ dùng tên tệp, không dùng nội dung tệp, nên rủi ro dữ liệu thấp. Đây là một thói quen tốt: việc gì giải được bằng "dữ liệu về tài liệu" thì đừng đưa chính tài liệu lên.

::: {.lenhmau}
**Câu lệnh mẫu 16.2 — Phiếu tóm tắt một trang cho đại biểu**

```text
Vai: Chuyên viên tham mưu, viết cho đại biểu HĐND không chuyên trách.
Bối cảnh: Dưới đây là tờ trình và dự thảo nghị quyết về [tên nội dung]
đã được gửi đại biểu để nghiên cứu trước kỳ họp.
Việc: Lập phiếu tóm tắt không quá một trang A4 gồm:
 1. Nghị quyết này giải quyết việc gì, cho ai (3 câu);
 2. Những điểm mới hoặc thay đổi so với hiện hành;
 3. Các con số chính (kinh phí, chỉ tiêu, thời hạn), mỗi số ghi
    rõ nằm ở trang, mục nào của tài liệu;
 4. Ba câu hỏi đại biểu có thể đặt ra khi thảo luận.
Ràng buộc: Chỉ dùng thông tin trong tài liệu. Không đánh giá
đúng sai về chính sách. Không tự thêm căn cứ pháp lý.
Văn phong hành chính, trung lập.
[DÁN TÀI LIỆU]
```
:::

Mục 3 của câu lệnh buộc AI ghi vị trí từng con số. Nhờ vậy, chuyên viên kiểm được nhanh ở chốt K2: lật đúng trang, đúng mục, so từng số. Phiếu nào có số không tìm thấy trong tài liệu gốc thì bỏ cả phiếu, làm lại, không vá.

### 16.1.2. Tổng hợp thảo luận và kịch bản điều hành

Thảo luận tổ thường có thư ký ghi tay hoặc gõ nhanh, rồi Văn phòng gom thành báo cáo tổng hợp ý kiến thảo luận tổ trình phiên toàn thể. Ghi chép thô có tên đại biểu phát biểu, có cả những ý kiến chưa chín. Tôi xếp loại ghi chép này vào vùng VÀNG. Trước khi đưa cho AI, thay tên đại biểu bằng mã ("Đại biểu 1", "Đại biểu 2"), bỏ các chi tiết giúp nhận ra người nói. Bảng mã giữ trên máy cơ quan. Khi AI trả về bản gom, chuyên viên ghép lại tên trên máy cơ quan nếu báo cáo cần nêu tên.

::: {.lenhmau}
**Câu lệnh mẫu 16.3 — Gom ý kiến thảo luận tổ đã ẩn danh**

```text
Vai: Thư ký tổng hợp kỳ họp HĐND tỉnh.
Bối cảnh: Dưới đây là ghi chép thảo luận của [số] tổ về dự thảo
nghị quyết [tên]. Tên đại biểu đã được thay bằng mã.
Việc: Gom ý kiến theo từng điều hoặc nội dung của dự thảo.
Dạng: Với mỗi nội dung: (a) số lượt ý kiến; (b) các ý kiến tán thành;
(c) các ý kiến đề nghị sửa, ghi rõ đề nghị sửa thế nào;
(d) ý kiến khác. Mỗi ý kiến kèm mã đại biểu và mã tổ.
Ràng buộc: Giữ nguyên ý của người phát biểu, không nâng cao,
không làm mềm. Hai ý kiến trái nhau thì ghi cả hai.
Không suy diễn ý kiến "chung của tổ" nếu ghi chép không nói vậy.
[DÁN GHI CHÉP ĐÃ ẨN DANH]
```
:::

Kịch bản điều hành là văn bản chủ tọa cầm trong tay suốt phiên họp. Nó phải khớp tuyệt đối với chương trình đã được Thường trực duyệt. AI dựng khung rất nhanh, nhưng có một chỗ tôi luôn tự soát lại bằng tay: các câu chủ tọa công bố kết quả biểu quyết.

::: {.cauchuyen}
**Câu chuyện thực tế — Mẫu số là tổng số đại biểu**

Khi dựng phân hệ Biểu quyết Online (Chương 12), tôi giao cho tác tử AI lập trình một yêu cầu tưởng hiển nhiên: kết quả phải tính trên tổng số đại biểu, không tính trên số người đã bấm. Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15, nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành. Với 82 đại biểu của bản demo, quá nửa là từ 42/82; hai phần ba là từ 55/82 (82 × 2/3 = 54,67, làm tròn lên). Bộ kiểm thử của phân hệ có phép kiểm "41/82 thì thiếu 1 phiếu", và dữ liệu mẫu cố ý có một nghị quyết chỉ đạt 45% số đại biểu tán thành để minh họa trường hợp không được thông qua.

Bài học tôi mang sang việc soạn kịch bản điều hành: câu công bố kết quả phải có đủ ba con số (số tán thành, tổng số đại biểu, tỷ lệ trên tổng số), và ngưỡng hai phần ba chỉ dùng cho những trường hợp luật quy định, không áp tùy tiện cho mọi nghị quyết. AI rất dễ viết "tỷ lệ tán thành trên số đại biểu có mặt" vì cách viết ấy phổ biến ở nhiều tài liệu khác.
:::

::: {.lenhmau}
**Câu lệnh mẫu 16.4 — Dựng kịch bản điều hành từ chương trình đã duyệt**

```text
Vai: Chuyên viên Văn phòng giúp chủ tọa kỳ họp HĐND tỉnh.
Bối cảnh: Chương trình kỳ họp đã được Thường trực HĐND tỉnh duyệt
(dán bên dưới). HĐND có [tổng số] đại biểu.
Việc: Soạn kịch bản điều hành cho [phiên/buổi], gồm lời chủ tọa ở
từng mục: khai mạc, mời trình bày, mời thẩm tra, điều hành thảo luận,
lấy biểu quyết, công bố kết quả, bế mạc.
Ràng buộc:
 - Đúng thứ tự, đúng tên nội dung như chương trình, không thêm, bớt.
 - Câu công bố kết quả để trống số liệu theo mẫu:
   "... có [...] đại biểu tán thành, bằng [...]% tổng số đại biểu
   HĐND tỉnh". Tỷ lệ luôn tính trên tổng số đại biểu.
 - Không tự ghi kết quả biểu quyết, không ghi "đã thông qua".
 - Chỗ nào chương trình chưa rõ thì đánh dấu [CẦN XIN Ý KIẾN].
[DÁN CHƯƠNG TRÌNH ĐÃ DUYỆT]
```
:::

::: {.canhbao}
**Cảnh báo — Phiên họp có nội dung mật**

Kỳ họp, phiên họp có nội dung bí mật nhà nước thì tài liệu của phiên đó thuộc vùng ĐỎ. Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026), tại Điều 5, cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập theo định nghĩa của Luật), và cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước. Nghị định 63/2026/NĐ-CP (ban hành ngày 28/02/2026, hiệu lực từ 01/3/2026) có quy định về địa điểm, phương án bảo vệ và phương tiện, thiết bị dùng tại hội nghị, cuộc họp có nội dung bí mật nhà nước. Thực hành an toàn: không dùng ứng dụng ghi âm, chuyển giọng nói thành chữ hay tóm tắt cuộc họp bằng AI trực tuyến cho các phiên này, và làm đúng quy chế bảo vệ bí mật nhà nước của cơ quan, của tỉnh.
:::

### 16.1.3. Điểm kiểm soát của quy trình kỳ họp

- **K1:** tài liệu mật không vào bất kỳ công cụ AI nào; ghi chép thảo luận phải thay tên bằng mã trước khi dán.
- **K2:** mỗi con số trong phiếu tóm tắt có vị trí trong tài liệu gốc; mỗi tên nội dung trong kịch bản khớp chương trình đã duyệt.
- **K3:** Thường trực duyệt chương trình, kịch bản; chủ tọa điều hành; kết quả biểu quyết chỉ lấy từ hệ thống biểu quyết chính thức theo quy chế của HĐND. Phân hệ Biểu quyết Online trong hệ thống thử nghiệm là bản demo với dữ liệu mô phỏng, không thay thế hệ thống biểu quyết chính thức.
- **K4:** sổ theo dõi tài liệu kỳ họp có thêm một cột "Có dùng AI hỗ trợ: phần nào, người kiểm".

## 16.2. Thẩm tra dự thảo nghị quyết

Thẩm tra là việc của các Ban HĐND: xem dự thảo nghị quyết có đúng thẩm quyền không, căn cứ có đủ và còn hiệu lực không, nội dung có phù hợp, khả thi không, nguồn lực có cân đối được không, rồi nêu kết luận, kiến nghị. Báo cáo thẩm tra là ý kiến chính thức của Ban, do Ban thảo luận và chịu trách nhiệm. Vì thế AI ở đây chỉ làm hai việc: soi lỗi kỹ thuật và dựng khung để chuyên viên viết nhanh hơn.

### 16.2.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Vùng |
|---|---|---|---|
| 1. Kiểm thành phần hồ sơ | Liệt kê tài liệu có và thiếu | Chuyên viên xác nhận | VÀNG |
| 2. Đối chiếu tờ trình – dự thảo | Lập bảng các chỗ lệch nhau | Chuyên viên kiểm từng dòng | VÀNG |
| 3. Rà căn cứ, thẩm quyền | Liệt kê căn cứ được viện dẫn thành "danh mục cần tra" | Chuyên viên tra hiệu lực trên cơ sở dữ liệu chính thức | VÀNG |
| 4. Soát số học | Kiểm tổng, tỷ lệ, cột số với lời văn | Chuyên viên tính lại các chỗ bị đánh dấu | VÀNG |
| 5. Khung báo cáo thẩm tra | Dựng khung 4 phần từ kết quả bước 2–4 | Chuyên viên viết, Ban thảo luận | VÀNG |
| 6. Kết luận của Ban | Không tham gia | Ban quyết định thống nhất hay không | — |

Dự thảo nghị quyết, tờ trình gửi Ban thẩm tra là tài liệu chưa công bố, nên mặc định thuộc vùng VÀNG. Nếu có phụ lục chứa danh sách người được hưởng chính sách, danh sách cán bộ, thì phần phụ lục ấy là vùng ĐỎ và phải cắt ra trước khi đưa cho AI. Tài liệu có độ mật thì cả bộ hồ sơ là vùng ĐỎ.

### 16.2.2. Bốn câu lệnh cho bốn khâu soi lỗi

Bước 2 là bước AI giúp được nhiều nhất. Tờ trình của UBND và dự thảo nghị quyết thường được soạn ở hai thời điểm, sửa nhiều vòng, nên dễ lệch nhau về con số, tên gọi, thời hạn, đối tượng áp dụng.

::: {.lenhmau}
**Câu lệnh mẫu 16.5 — Đối chiếu tờ trình với dự thảo nghị quyết**

```text
Vai: Chuyên viên giúp việc Ban [tên Ban] HĐND tỉnh, cẩn thận với số.
Bối cảnh: Dưới đây là TỜ TRÌNH và DỰ THẢO NGHỊ QUYẾT về [tên nội dung].
Việc: So sánh hai văn bản, tìm mọi chỗ không nhất quán về:
 (1) con số (kinh phí, chỉ tiêu, số lượng, tỷ lệ);
 (2) tên gọi, phạm vi điều chỉnh, đối tượng áp dụng;
 (3) mốc thời gian, thời hạn, hiệu lực;
 (4) nội dung có ở văn bản này mà không có ở văn bản kia.
Dạng: Bảng 4 cột: STT | Tờ trình ghi (trích nguyên văn, vị trí) |
Dự thảo ghi (trích nguyên văn, vị trí) | Loại lệch.
Ràng buộc: Chỉ nêu chỗ lệch có trích dẫn được. Không nhận xét
đúng sai về chính sách. Không có chỗ lệch thì nói rõ là không có.
[DÁN TỜ TRÌNH]
[DÁN DỰ THẢO]
```
:::

Bước 3 là chỗ nguy hiểm nhất. AI rất sẵn lòng "xác nhận" một căn cứ còn hiệu lực, hoặc gợi ý thêm một nghị định nghe rất hợp lý mà không có thật. Tôi không bao giờ hỏi AI "căn cứ này còn hiệu lực không". Tôi chỉ bảo AI liệt kê, còn việc tra là của người.

::: {.lenhmau}
**Câu lệnh mẫu 16.6 — Lập danh mục căn cứ cần tra**

```text
Vai: Chuyên viên pháp chế.
Việc: Đọc phần căn cứ và toàn bộ nội dung dự thảo dưới đây, lập bảng
mọi văn bản được viện dẫn: STT | Số hiệu, tên đúng như dự thảo ghi |
Vị trí viện dẫn | Dự thảo dùng văn bản này để làm gì | Cột "Kết quả
tra" để TRỐNG.
Ràng buộc:
 - KHÔNG nhận xét văn bản còn hay hết hiệu lực. KHÔNG thêm văn bản
   mà dự thảo không nhắc tới.
 - Đánh dấu [NGHI VẤN] nếu cùng một văn bản được ghi số hiệu hoặc
   ngày khác nhau ở hai chỗ.
 - Đánh dấu [THIẾU] nếu nội dung nào đó (ví dụ mức phí, mức chi)
   dường như cần căn cứ mà dự thảo không ghi căn cứ nào. Chỉ mô tả
   nội dung, không tự đề xuất số hiệu văn bản.
[DÁN DỰ THẢO]
```
:::

Cột "Kết quả tra" để trống là có chủ đích. Chuyên viên điền cột ấy sau khi tra trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo, ghi ngày tra. Đó chính là chốt K2 và K4 gộp làm một.

::: {.cauchuyen}
**Câu chuyện thực tế — Sáu chỗ chưa nhất quán trong một dự thảo**

Khi số hóa dự thảo Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã nhiệm kỳ 2026–2031 (Chương 11), phần mềm buộc phải biến từng dòng chữ thành phép tính. Mâu thuẫn tự lộ ra: một điểm thành phần 3,0 điểm nhưng lời văn cho cộng đủ thành 9 điểm trong một tiêu chí 6 điểm; nhóm điểm thưởng cấp xã có bốn nội dung cộng 13 điểm trong khi trần là 10 điểm; hai mục điểm trừ có cột "điểm tối đa" lệch với lời văn cách chấm; một điều kiện xếp loại không có ngưỡng; một điều nhảy số khoản từ 2 sang 5.

Phần mềm không lặng lẽ "chọn đại". Mỗi chỗ được ghi công khai: dự thảo ghi gì, đã chuẩn hóa tạm thế nào, để cơ quan soạn thảo xem xét. Từ đó tôi rút ra một thói quen khi thẩm tra: luôn dành một lượt riêng chỉ để soát số học, tách khỏi lượt đọc nội dung.
:::

::: {.lenhmau}
**Câu lệnh mẫu 16.7 — Soát số học các bảng, phụ lục**

```text
Vai: Chuyên viên rà soát, chỉ quan tâm đến con số.
Việc: Kiểm tra các bảng và phụ lục của dự thảo dưới đây:
 1. Tổng các thành phần có bằng dòng tổng không;
 2. Tỷ lệ % có khớp với số tuyệt đối không;
 3. Cột "tối đa", "mức" có khớp lời văn giải thích không;
 4. Số thứ tự điều, khoản, điểm có liên tục không;
 5. Đơn vị tính có thống nhất không (đồng, triệu đồng, tỷ đồng).
Dạng: Bảng: Vị trí | Nội dung ghi | Phép tính kiểm | Kết quả |
Đề nghị xem lại.
Ràng buộc: Trình bày phép tính để tôi tính lại được. Chỗ nào
không đủ dữ liệu để kiểm thì ghi "không đủ dữ liệu", không đoán.
[DÁN BẢNG, PHỤ LỤC]
```
:::

Phân hệ Trợ lý AI của hệ thống thử nghiệm có tab Thẩm tra dự thảo, dựng báo cáo theo bốn phần chuẩn: I. Cơ sở pháp lý và thẩm quyền ban hành; II. Sự phù hợp về nội dung; III. Khả năng cân đối nguồn lực; IV. Kết luận và kiến nghị. Tôi giữ bố cục ấy, nhưng khi dùng ngoài phân hệ, tôi sửa câu lệnh theo hướng chặt hơn: AI chỉ dựng khung và điền những gì đã có ở các bước trước, phần kết luận để trống cho Ban.

::: {.lenhmau}
**Câu lệnh mẫu 16.8 — Khung báo cáo thẩm tra bốn phần**

```text
Vai: Chuyên viên giúp việc Ban [tên Ban] HĐND tỉnh.
Bối cảnh: Đã có (a) bảng chỗ lệch tờ trình – dự thảo; (b) danh mục
căn cứ đã tra, có cột kết quả tra; (c) bảng soát số học; (d) ý kiến
các thành viên Ban tại cuộc họp thẩm tra (đã ẩn danh).
Việc: Dựng KHUNG báo cáo thẩm tra gồm:
 I. Cơ sở pháp lý và thẩm quyền ban hành;
 II. Sự phù hợp về nội dung;
 III. Khả năng cân đối nguồn lực;
 IV. Kết luận và kiến nghị.
Ràng buộc:
 - Chỉ dùng thông tin trong (a), (b), (c), (d). Căn cứ nào cột kết quả
   tra còn trống thì ghi [CHƯA TRA], không tự khẳng định.
 - Phần IV chỉ liệt kê các vấn đề cần Ban cho ý kiến, để trống
   kết luận "thống nhất / không thống nhất".
 - Đề mục I., 1., a) theo văn bản hành chính, không dùng ký hiệu #.
[DÁN (a), (b), (c), (d)]
```
:::

::: {.phaply}
**Căn cứ pháp lý**

Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 của Bộ Khoa học và Công nghệ hướng dẫn ứng dụng công nghệ số, trí tuệ nhân tạo hỗ trợ rà soát hệ thống văn bản quy phạm pháp luật nêu rõ: AI là công cụ hỗ trợ phân tích, tổng hợp, cảnh báo, gợi ý, không thay thế việc xem xét, đánh giá, kết luận của cơ quan có thẩm quyền; không được dùng AI để tự động đưa ra kết luận pháp lý có giá trị quyết định; kết quả của AI phải truy xuất, kiểm chứng, đối chiếu được với căn cứ pháp lý; cán bộ có trách nhiệm phải kiểm tra, xác nhận trước khi dùng. Về trình tự, hồ sơ, thẩm quyền ban hành nghị quyết, chuyên viên phải tra pháp luật về ban hành văn bản quy phạm pháp luật đang có hiệu lực, không dựa vào trí nhớ của AI.
:::

### 16.2.3. Điểm kiểm soát của quy trình thẩm tra

- **K1:** cắt phụ lục có thông tin cá nhân; hồ sơ có độ mật không đưa vào AI.
- **K2:** mỗi chỗ lệch trong bảng của AI phải mở hai văn bản ra so lại; mỗi căn cứ phải có kết quả tra kèm ngày tra.
- **K3:** kết luận "thống nhất hay không thống nhất" và các kiến nghị là của Ban. Câu nào trong điều khoản có thể hiểu nhiều cách thì bảo AI liệt kê các cách hiểu và hệ quả (như câu lệnh 9.2 ở Chương 9), rồi Ban chọn. Phân hệ đánh giá cán bộ từng coi một nhiệm vụ làm được 9/10 là "không hoàn thành" vì AI tự chọn một cách hiểu; trong thẩm tra, một cách hiểu chọn đại có thể thành kiến nghị sai của cả Ban.
- **K4:** hồ sơ thẩm tra lưu kèm các bảng do AI lập, có chữ ký nháy của người đã kiểm.
