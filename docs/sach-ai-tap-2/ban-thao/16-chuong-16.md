# Chương 16. Quy trình AI cho các nghiệp vụ trọng tâm

::: {.muctieu}
**Mục tiêu của chương**

- Nắm một khuôn chung cho mọi quy trình có dùng AI: các bước, phần việc của AI và của người, cấp dữ liệu theo cách phân loại 4 cấp của Tập 1, bốn chốt kiểm soát.
- Áp khuôn đó vào tám nghiệp vụ trọng tâm: kỳ họp, thẩm tra, giám sát, tiếp công dân và đơn thư, tiếp xúc cử tri, Đoàn đại biểu Quốc hội, văn bản – truyền thông, việc nội bộ của Văn phòng.
- Có trong tay mười chín câu lệnh mẫu viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG, dùng được ngay, mỗi câu ghi rõ cấp dữ liệu cao nhất được phép dán vào.
- Biết những ranh giới không được vượt: bí mật nhà nước, dữ liệu cá nhân của người khiếu nại, tố cáo và của cử tri, thẩm quyền kết luận của tập thể và người có thẩm quyền.

Dành cho: chuyên viên các phòng của Văn phòng, chuyên viên giúp việc các Ban, tổ giúp việc các đoàn giám sát; lãnh đạo phòng, lãnh đạo Ban khi phân công và duyệt sản phẩm có dùng AI.
:::

Mười lăm chương trước chủ yếu kể chuyện làm ra công cụ. Chương này quay về bàn làm việc. Phần lớn cán bộ sẽ không tự lập trình, nhưng ai cũng có kỳ họp phải chuẩn bị, dự thảo phải thẩm tra, báo cáo phải tổng hợp. Câu hỏi của họ là: AI giúp được khâu nào, khâu nào không được giao, dữ liệu nào được dán vào, ai chịu trách nhiệm ở đâu.

Ở Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa (gọi tắt là Văn phòng), việc gì cũng có quy trình, quy trình nào cũng có người ký. AI chỉ được đặt bên trong quy trình ấy, không đặt lên trên nó. Ngày 07/5/2026, Thường trực HĐND tỉnh đã tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng (tóm tắt tài liệu, chuẩn bị kỳ họp, giám sát, an toàn dữ liệu, đạo đức công vụ); chương này biến điều đã nghe thành thao tác có kỷ luật.

Các câu lệnh mẫu viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2); câu hỏi gửi sổ tay ở mục 16.4 là ngoại lệ, vì sổ tay đã chứa sẵn bối cảnh. Chỗ cần điền đặt trong [ngoặc vuông]: chép vào, thay phần trong ngoặc, đọc lại rồi mới gửi.

**Khuôn chung cho mọi quy trình.** Trước khi đưa AI vào một việc, tôi luôn tự trả lời năm câu hỏi dưới đây.

| Câu hỏi | Nếu chưa trả lời được thì |
|---|---|
| Sản phẩm cuối là gì, ai ký? | Chưa dùng AI, làm rõ nhiệm vụ trước |
| Dữ liệu đầu vào thuộc cấp nào? | Dừng lại phân loại, ẩn danh |
| AI làm khâu nào, người làm khâu nào? | Viết ra thành bảng phân việc |
| Kết quả của AI được kiểm bằng gì? | Chuẩn bị văn bản gốc để đối chiếu |
| Dùng AI ở đâu thì ghi lại ở đâu? | Lập sổ theo dõi, dù chỉ một dòng |

**Bốn cấp dữ liệu, bốn cách ứng xử.** Tập 1 (mục 7.1–7.2, Bảng 7.1) chia dữ liệu thành bốn cấp, mỗi cấp gắn với loại công cụ AI được dùng. Áp vào cơ quan dân cử:

| Cấp | Ví dụ ở cơ quan dân cử | Công cụ AI được dùng |
|---|---|---|
| Cấp 1 — Công khai | Nghị quyết đã ban hành; dự thảo luật đã đăng lấy ý kiến; báo cáo đã công bố tại kỳ họp | Mọi công cụ AI, kể cả của nước ngoài; tài khoản đã tắt chế độ cho dùng dữ liệu để huấn luyện |
| Cấp 2 — Nội bộ | Dự thảo chưa trình; tờ trình gửi đại biểu trước kỳ họp; báo cáo đơn vị gửi đoàn giám sát; ghi chép thảo luận tổ; lịch công tác | AI có cam kết dành cho tổ chức (không huấn luyện trên nội dung), sau khi thay tên người bằng mã |
| Cấp 3 — Hạn chế tiếp cận | Đơn thư có danh tính; hồ sơ cán bộ; nhận xét, đánh giá cá nhân; danh sách cử tri kèm địa chỉ | Chỉ AI có máy chủ đặt tại Việt Nam hoặc AI tự triển khai trên hạ tầng cơ quan |
| Cấp 4 — Bí mật nhà nước | Tài liệu, phiên họp có nội dung mật | Tuyệt đối không dùng AI nước ngoài; không soạn thảo, lưu giữ trên thiết bị kết nối Internet |

Bốn lưu ý:

- **Khi không chắc chắn, chọn cấp cao hơn** — nguyên tắc thận trọng của Tập 1 (mục 7.2).
- Tài liệu nội bộ có lẫn vài tên người vẫn là Cấp 2 nhưng phải thay tên bằng mã trước khi dùng; tài liệu mà nội dung chính là thông tin về một con người cụ thể (hồ sơ, đơn thư, nhận xét) là Cấp 3.
- Tài khoản cá nhân phải tắt việc dùng hội thoại để huấn luyện mô hình ngay khi tạo (trong phần cài đặt quyền riêng tư; tên mục đổi theo từng đợt cập nhật). Gói dành cho tổ chức của Claude (Team, Enterprise) không huấn luyện trên nội dung theo mặc định; hãng khác phải đọc điều khoản hiện hành. Nhưng "không huấn luyện" không có nghĩa là "không lưu trữ" (Tập 1, mục 7.2).
- Cơ quan chưa có công cụ dành cho tổ chức thì chỉ đưa lên AI phần đã là Cấp 1 — danh mục tên tệp, khung đề cương, dữ liệu giả — còn nội dung thật xử lý trên máy cơ quan.

Tên mỗi câu lệnh mẫu ghi cấp dữ liệu cao nhất được dán vào; "Cấp 2" nghĩa là dùng công cụ dành cho tổ chức và đã thay tên người bằng mã. Không câu lệnh nào dành cho dữ liệu Cấp 3, Cấp 4.

**Bốn chốt kiểm soát.** Ở mỗi quy trình, tôi đánh dấu bốn chốt bằng ký hiệu K1 đến K4.

- **K1 — Chốt dữ liệu**, trước khi dán: xác định cấp, ẩn danh, cắt bỏ phần không cần.
- **K2 — Chốt nguồn**, sau khi AI trả lời: mọi số hiệu, điều, khoản, con số phải đối chiếu văn bản gốc.
- **K3 — Chốt thẩm quyền**: người hoặc tập thể có thẩm quyền xem xét, quyết định, ký. AI không bao giờ đứng ở chốt này.
- **K4 — Chốt lưu vết**: ghi lại phần nào có dùng AI, ai đã kiểm, kiểm ngày nào.

Chốt K3 chính là Mô hình 1 "AI đề xuất, con người duyệt" trong ba mô hình con người trong vòng lặp (Human-in-the-Loop) của Tập 1 (mục 7.5). Mô hình 3 — AI tự động hoàn toàn — không dùng trong khu vực công, nên không quy trình nào dưới đây để AI tự kết thúc.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15, Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026. Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ: không đưa lên chatbot AI tài liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; không phụ thuộc hoàn toàn vào AI; kiểm tra kết quả trước khi dùng.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng (kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng): AI hỗ trợ, không thay thế; sản phẩm AI tạo ra phải được kiểm chứng, thẩm định, chỉnh sửa, người dùng chịu trách nhiệm hoàn toàn; không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI.
- Luật Tiếp cận thông tin số 01/2026/QH16 (hiệu lực từ 01/9/2026, thay thế Luật số 104/2016/QH13) xếp riêng thông tin nội bộ, bí mật công tác, dữ liệu cá nhân vào nhóm không được tiếp cận hoặc chỉ được tiếp cận có điều kiện: không phải tài liệu nào của cơ quan cũng là Cấp 1.
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

Ba quyết định chỉ lãnh đạo làm được, nên làm trước khi cán bộ áp dụng chương này:

- Cơ quan dùng công cụ AI nào cho dữ liệu Cấp 2. Chưa có thì nói rõ, để cán bộ không tự dùng tài khoản cá nhân cho tài liệu nội bộ.
- Ai đứng ở chốt K3 của từng nghiệp vụ, và người đó duyệt bằng hình thức nào.
- Sổ lưu vết K4 đặt ở đâu, ai giữ, bao lâu rà một lần.

Và một điều nên nói rõ với các đoàn giám sát: bảng tổng hợp do AI hỗ trợ phải ghi nguồn từng con số; "AI đánh giá đơn vị A kém hơn đơn vị B" không bao giờ là căn cứ kết luận.
:::

## 16.1. Chuẩn bị kỳ họp HĐND

Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15 (thông qua và có hiệu lực từ ngày 16/6/2025), HĐND họp mỗi năm ít nhất hai kỳ, ngoài ra họp chuyên đề hoặc đột xuất khi có yêu cầu. Mỗi kỳ họp kéo theo chương trình, tài liệu, báo cáo thẩm tra, tổng hợp thảo luận, kịch bản, nghị quyết, biên bản: phần lớn là giấy tờ có khuôn mẫu, đúng loại việc AI làm tốt ở khâu nháp.

### 16.1.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Chương trình, kế hoạch | Dựng khung từ kế hoạch kỳ trước, lập bảng mốc | Thường trực quyết định nội dung, thời gian | Cấp 2 |
| 2. Kiểm hồ sơ tài liệu | Đối chiếu danh mục đã nhận với danh mục phải có | Chuyên viên xác nhận, đôn đốc cơ quan trình | Cấp 2 |
| 3. Tóm tắt cho đại biểu | Lập phiếu tóm tắt một trang mỗi nội dung | Chuyên viên kiểm từng con số | Cấp 1–2 |
| 4. Tổng hợp thảo luận tổ | Gom ý kiến đã ẩn danh theo nội dung | Tổ thư ký ghi tên khi làm bản chính thức | Cấp 2 |
| 5. Kịch bản điều hành | Dựng kịch bản theo chương trình đã duyệt | Chủ tọa, Thường trực duyệt | Cấp 2 |
| 6. Biểu quyết, biên bản | Không tham gia | Hệ thống biểu quyết và quy chế của HĐND | — |

Tab Trợ lý kỳ họp của phân hệ "Trợ lý AI nghiệp vụ dân cử" trong hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app, đường dẫn `#/troly`) có năm tác vụ dựng sẵn và một ô tự đặt câu hỏi (Chương 13, mục 13.1). Dòng quan trọng nhất trong lời nhắc dựng sẵn: chỉ trích dẫn thông tin có trong tài liệu được cung cấp, thiếu thì ghi là thiếu. Các câu lệnh dưới đây giữ tinh thần ấy, dùng trên trợ lý AI trò chuyện.

::: {.lenhmau}
**Câu lệnh mẫu 16.1 — Kiểm danh mục hồ sơ tài liệu kỳ họp (Cấp 2)**

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

Câu lệnh này chỉ dùng tên tệp, không dùng nội dung tệp. Việc gì giải được bằng "dữ liệu về tài liệu" thì đừng đưa chính tài liệu lên.

::: {.lenhmau}
**Câu lệnh mẫu 16.2 — Phiếu tóm tắt một trang cho đại biểu (Cấp 1; tờ trình chưa công bố là Cấp 2)**

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
[DÁN TÀI LIỆU]
```
:::

Mục 3 buộc AI ghi vị trí từng con số để chuyên viên kiểm nhanh ở chốt K2. Phiếu nào có số không tìm thấy trong tài liệu gốc thì bỏ cả phiếu, làm lại, không vá.

### 16.1.2. Tổng hợp thảo luận và kịch bản điều hành

Ghi chép thảo luận tổ có tên đại biểu và cả những ý kiến chưa chín, nên thuộc Cấp 2. Trước khi đưa cho AI, thay tên đại biểu bằng mã ("Đại biểu 1", "Đại biểu 2"), bỏ chi tiết giúp nhận ra người nói; bảng mã giữ trên máy cơ quan để ghép lại tên khi cần.

::: {.lenhmau}
**Câu lệnh mẫu 16.3 — Gom ý kiến thảo luận tổ đã ẩn danh (Cấp 2)**

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

Kịch bản điều hành phải khớp tuyệt đối với chương trình đã duyệt. Có một chỗ tôi luôn soát bằng tay: câu công bố kết quả biểu quyết.

::: {.cauchuyen}
**Câu chuyện thực tế — Mẫu số là tổng số đại biểu**

Khi dựng phân hệ Biểu quyết Online (Chương 12, mục 12.3), tôi yêu cầu tính kết quả trên tổng số đại biểu, không trên số người đã bấm, vì nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành. Với 82 đại biểu của bản demo, bộ kiểm thử có phép kiểm "41/82 thì thiếu 1 phiếu"; ngưỡng hai phần ba chỉ dùng khi luật quy định. AI lại dễ viết "tỷ lệ trên số đại biểu có mặt", vì cách tính ấy hay gặp trong tin bài.
:::

::: {.lenhmau}
**Câu lệnh mẫu 16.4 — Dựng kịch bản điều hành từ chương trình đã duyệt (Cấp 2)**

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

Tài liệu, phiên họp có nội dung bí mật nhà nước thuộc Cấp 4. Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực từ 01/3/2026; Luật số 29/2018/QH14 mà Tập 1 viện dẫn đã hết hiệu lực từ ngày đó), tại Điều 5, cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), và cấm dùng hệ thống trí tuệ nhân tạo để xâm phạm bí mật nhà nước. Nghị định 63/2026/NĐ-CP có quy định về phương tiện, thiết bị dùng tại cuộc họp có nội dung bí mật nhà nước. Với các phiên này: không dùng ứng dụng ghi âm, chuyển giọng nói thành chữ hay tóm tắt bằng AI trực tuyến; làm đúng quy chế bảo vệ bí mật nhà nước hiện hành.
:::

### 16.1.3. Điểm kiểm soát của quy trình kỳ họp

- **K1:** tài liệu mật (Cấp 4) không vào công cụ AI nào; ghi chép thảo luận thay tên bằng mã trước khi dán.
- **K2:** mỗi con số trong phiếu tóm tắt có vị trí trong tài liệu gốc; mỗi tên nội dung trong kịch bản khớp chương trình đã duyệt.
- **K3:** Thường trực duyệt chương trình, kịch bản; kết quả biểu quyết chỉ lấy từ hệ thống biểu quyết chính thức (phân hệ Biểu quyết Online chỉ là bản demo, dữ liệu mô phỏng).
- **K4:** sổ theo dõi tài liệu kỳ họp thêm cột "Có dùng AI hỗ trợ: phần nào, người kiểm".

## 16.2. Thẩm tra dự thảo nghị quyết

Thẩm tra là việc của các Ban HĐND: dự thảo nghị quyết có đúng thẩm quyền, đủ căn cứ, phù hợp, khả thi, cân đối được nguồn lực không. Báo cáo thẩm tra là ý kiến chính thức của Ban. AI chỉ làm hai việc: soi lỗi kỹ thuật và dựng khung để chuyên viên viết nhanh hơn — đúng nguyên tắc "AI tìm dấu hiệu — con người kết luận pháp lý" của Tập 1 (Chương 5).

### 16.2.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Kiểm thành phần hồ sơ | Liệt kê tài liệu có và thiếu | Chuyên viên xác nhận | Cấp 2 |
| 2. Đối chiếu tờ trình – dự thảo | Lập bảng các chỗ lệch nhau | Chuyên viên kiểm từng dòng | Cấp 2 |
| 3. Rà căn cứ, thẩm quyền | Liệt kê căn cứ được viện dẫn thành "danh mục cần tra" | Chuyên viên tra hiệu lực trên cơ sở dữ liệu chính thức | Cấp 2 |
| 4. Soát số học | Kiểm tổng, tỷ lệ, cột số với lời văn | Chuyên viên tính lại các chỗ bị đánh dấu | Cấp 2 |
| 5. Khung báo cáo thẩm tra | Dựng khung 4 phần từ kết quả bước 2–4 | Chuyên viên viết, Ban thảo luận | Cấp 2 |
| 6. Kết luận của Ban | Không tham gia | Ban quyết định thống nhất hay không | — |

Hồ sơ gửi Ban thẩm tra chưa công bố nên mặc định thuộc Cấp 2. Phụ lục chứa danh sách người được hưởng chính sách, danh sách cán bộ là Cấp 3, phải cắt ra trước khi đưa cho AI. Hồ sơ có độ mật thì cả bộ là Cấp 4, không đưa vào AI.

### 16.2.2. Bốn câu lệnh cho bốn khâu soi lỗi

Tập 1 (mục 5.3–5.4) đã có quy trình rà soát nội tại và đối chiếu với văn bản cấp trên; bốn câu lệnh dưới đây là phiên bản cho hồ sơ thẩm tra. Tờ trình và dự thảo nghị quyết thường được sửa nhiều vòng nên dễ lệch nhau về con số, tên gọi, thời hạn, đối tượng — khâu AI giúp được nhiều nhất.

::: {.lenhmau}
**Câu lệnh mẫu 16.5 — Đối chiếu tờ trình với dự thảo nghị quyết (Cấp 2)**

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

Bước 3 nguy hiểm nhất: AI sẵn lòng "xác nhận" một căn cứ còn hiệu lực, hoặc gợi ý một nghị định nghe hợp lý mà không có thật. Tôi không bao giờ hỏi AI "căn cứ này còn hiệu lực không"; AI chỉ liệt kê, việc tra là của người.

::: {.lenhmau}
**Câu lệnh mẫu 16.6 — Lập danh mục căn cứ cần tra (Cấp 2)**

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

Cột "Kết quả tra" để trống là có chủ đích: chuyên viên điền sau khi tra trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn) hoặc Công báo, ghi ngày tra. Đó là chốt K2 và K4 gộp làm một.

Khi số hóa dự thảo Khung tiêu chí đánh giá, xếp loại HĐND nhiệm kỳ 2026–2031, phần mềm buộc phải biến câu chữ thành phép tính, và sáu chỗ chưa nhất quán tự lộ ra, chẳng hạn bốn nội dung thưởng cộng lại 13 điểm trong khi trần là 10 (Chương 11, mục 11.3). Từ đó tôi luôn dành một lượt riêng chỉ để soát số học.

::: {.lenhmau}
**Câu lệnh mẫu 16.7 — Soát số học các bảng, phụ lục (Cấp 2)**

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

Tab Thẩm tra dự thảo của phân hệ Trợ lý AI dựng báo cáo theo bốn phần. Câu lệnh dưới đây giữ bố cục ấy nhưng chặt hơn: phần kết luận để trống cho Ban.

::: {.lenhmau}
**Câu lệnh mẫu 16.8 — Khung báo cáo thẩm tra bốn phần (Cấp 2, đã ẩn danh)**

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
[DÁN (a), (b), (c), (d)]
```
:::

::: {.phaply}
**Căn cứ pháp lý**

Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 của Bộ Khoa học và Công nghệ về dùng AI hỗ trợ rà soát văn bản quy phạm pháp luật nêu rõ: AI là công cụ hỗ trợ, không thay thế việc xem xét, kết luận của cơ quan có thẩm quyền; không được dùng AI để tự động đưa ra kết luận pháp lý có giá trị quyết định; kết quả phải truy xuất, kiểm chứng, đối chiếu được với căn cứ pháp lý.

Trình tự, hồ sơ, thẩm quyền ban hành nghị quyết quy phạm pháp luật của HĐND tra theo Luật Ban hành văn bản quy phạm pháp luật số 64/2025/QH15 (sửa đổi, bổ sung bởi Luật số 87/2025/QH15) và các nghị định hướng dẫn. Chính phủ đang trình dự án luật mới thay thế, nên luôn tra văn bản có hiệu lực tại thời điểm thẩm tra.
:::

### 16.2.3. Điểm kiểm soát của quy trình thẩm tra

- **K1:** cắt phụ lục có thông tin cá nhân; hồ sơ có độ mật không đưa vào AI.
- **K2:** mỗi chỗ lệch trong bảng của AI phải mở hai văn bản ra so lại; mỗi căn cứ phải có kết quả tra kèm ngày tra.
- **K3:** kết luận và kiến nghị là của Ban. Câu chữ nào hiểu được nhiều cách thì bảo AI liệt kê các cách hiểu và hệ quả (Câu lệnh mẫu 9.2, Chương 9) để Ban chọn, không để AI chọn đại.
- **K4:** hồ sơ thẩm tra lưu kèm các bảng do AI lập, có chữ ký nháy của người đã kiểm.

## 16.3. Giám sát chuyên đề

Một cuộc giám sát chuyên đề đi từ chọn chuyên đề, kế hoạch, đề cương, báo cáo của đơn vị chịu giám sát, làm việc thực tế, kết luận đến theo dõi kiến nghị. Tổng hợp báo cáo của hàng chục đơn vị là khâu ngốn thời gian nhất.

::: {.phaply}
**Căn cứ pháp lý**

Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026) điều chỉnh hoạt động giám sát của Quốc hội và HĐND, quyền và trách nhiệm của chủ thể giám sát và của cơ quan, tổ chức, cá nhân chịu sự giám sát. Trình tự, thời hạn từng hình thức giám sát được hướng dẫn tại các nghị quyết của Ủy ban Thường vụ Quốc hội; tra số hiệu các nghị quyết này trên cơ sở dữ liệu chính thức trước khi đưa vào kế hoạch.
:::

### 16.3.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Chọn chuyên đề | Chỉ ra lĩnh vực kiến nghị nhiều, tồn đọng nhiều kỳ | Thường trực, Ban quyết định | Cấp 1–2 |
| 2. Kế hoạch, đề cương | Dựng đề cương báo cáo, phiếu khảo sát | Trưởng đoàn duyệt | Cấp 2 |
| 3. Tổng hợp báo cáo đơn vị | Đưa về một bảng, đánh dấu mâu thuẫn | Tổ giúp việc kiểm, chọn nội dung làm việc | Cấp 2 |
| 4. Làm việc thực tế | Không dùng tại buổi làm việc | Đoàn giám sát | Cấp 2–3 |
| 5. Báo cáo kết quả | Dựng khung từ bảng tổng hợp, biên bản | Đoàn thảo luận, chỉnh sửa | Cấp 2 |
| 6. Kết luận, kiến nghị | Không tham gia | Cấp có thẩm quyền thông qua | — |
| 7. Theo dõi sau giám sát | Tách kết luận thành bảng nhiệm vụ, hạn | Người phụ trách đôn đốc | Cấp 1 khi đã công bố |

::: {.lenhmau}
**Câu lệnh mẫu 16.9 — Đề cương báo cáo và phiếu khảo sát (Cấp 2)**

```text
Vai: Thành viên tổ giúp việc đoàn giám sát của [chủ thể giám sát].
Bối cảnh: Chuyên đề giám sát: [tên chuyên đề], thời kỳ giám sát:
[từ ... đến ...], đối tượng chịu giám sát: [loại cơ quan, đơn vị].
Việc:
 1. Soạn đề cương báo cáo gửi đối tượng chịu giám sát: tình hình,
    kết quả, hạn chế, nguyên nhân, kiến nghị; kèm biểu số liệu.
 2. Soạn phiếu khảo sát tối đa 15 câu cho [đối tượng khảo sát].
Ràng buộc:
 - Biểu số liệu: mỗi chỉ tiêu ghi rõ đơn vị tính, kỳ số liệu, cách
   tính, để các đơn vị báo cáo cùng một chuẩn.
 - Phiếu khảo sát không hỏi họ tên, số điện thoại, địa chỉ, số định
   danh; chỉ hỏi thông tin cần cho chuyên đề.
 - Không gợi ý câu trả lời trong câu hỏi.
```
:::

Báo cáo các đơn vị chỉ gộp được khi cùng một chuẩn: đơn vị này tính lũy kế, đơn vị kia tính trong kỳ thì không AI nào cộng đúng. Phiếu khảo sát thì theo tinh thần bảo vệ dữ liệu cá nhân: không cần thì đừng hỏi.

::: {.lenhmau}
**Câu lệnh mẫu 16.10 — Gộp báo cáo của các đơn vị thành bảng so sánh (Cấp 2)**

```text
Vai: Tổ giúp việc đoàn giám sát, phụ trách tổng hợp.
Bối cảnh: Dưới đây là báo cáo của [số] đơn vị theo cùng một đề cương.
Việc:
 1. Lập bảng: mỗi dòng một đơn vị, mỗi cột một chỉ tiêu trong biểu;
    ô nào đơn vị không báo cáo thì ghi "không có số liệu".
 2. Đánh dấu [MÂU THUẪN] khi số trong biểu khác số trong lời văn
    của cùng báo cáo, hoặc tổng thành phần khác dòng tổng.
 3. Đánh dấu [BẤT THƯỜNG] khi một đơn vị lệch hẳn mặt bằng chung,
    kèm phép so sánh cụ thể.
Ràng buộc: Mỗi số ghi rõ lấy từ trang, mục nào của báo cáo nào.
Không xếp hạng, không chấm điểm đơn vị. Không kết luận vi phạm.
[DÁN CÁC BÁO CÁO]
```
:::

Lệnh "không xếp hạng, không kết luận vi phạm" có lý do. Phân hệ Giám sát số Thanh Hóa (hệ thống riêng; Chương 12, mục 12.4) chấm rủi ro nghị quyết của HĐND 166 xã, phường nhưng chỉ trình danh mục; Thường trực HĐND tỉnh mới quyết định chọn nội dung giám sát. Ngoài ra, Danh mục hệ thống trí tuệ nhân tạo có rủi ro cao ban hành kèm Quyết định 33/2026/QĐ-TTg (hiệu lực từ 15/8/2026) thuộc sáu lĩnh vực: giáo dục; dân tộc và tôn giáo; y tế; ngân hàng; tố tụng; giao thông vận tải. Công cụ tự động chấm điểm, xếp hạng chạm tới các lĩnh vực ấy thì phải đọc kỹ nguyên văn danh mục.

### 16.3.2. Theo dõi kiến nghị sau giám sát

Theo báo Đại biểu Nhân dân ngày 29/9/2026, phiên họp thứ 8 của Thường trực HĐND tỉnh nêu phương châm "phát hiện vấn đề – kiến nghị giải pháp – tổ chức giám sát – đôn đốc thực hiện – theo dõi kết quả đến cùng". Khâu "đến cùng" cần một bảng theo dõi tốt, và AI giúp được ngay khi kết luận đã thông qua.

::: {.lenhmau}
**Câu lệnh mẫu 16.11 — Tách kết luận giám sát thành bảng theo dõi (Cấp 1; chưa công bố là Cấp 2)**

```text
Vai: Chuyên viên theo dõi, đôn đốc sau giám sát.
Bối cảnh: Dưới đây là kết luận giám sát đã được thông qua.
Việc: Tách thành bảng nhiệm vụ, mỗi kiến nghị một dòng:
STT | Nội dung kiến nghị (trích nguyên văn) | Cơ quan thực hiện |
Thời hạn (nếu kết luận có ghi) | Sản phẩm cần có để coi là xong |
Tình trạng (để trống).
Ràng buộc:
 - Một kiến nghị giao nhiều cơ quan thì tách thành nhiều dòng.
 - Kết luận không ghi thời hạn thì ghi [CHƯA CÓ HẠN], không tự đặt.
 - Cột "sản phẩm cần có" chỉ đề xuất, đánh dấu (đề xuất) để người
   phụ trách duyệt.
[DÁN KẾT LUẬN ĐÃ THÔNG QUA]
```
:::

Giám sát số tổ chức đúng như vậy: mỗi kiến nghị một nhiệm vụ, nhắc trước hạn 15, 7 và 3 ngày; quá hạn thì yêu cầu giải trình rồi đi tiếp các bước đôn đốc. Các mốc ấy là cấu hình của bản demo; thời hạn, trình tự phải rà theo văn bản hướng dẫn hiện hành.

Điểm kiểm soát: **K1** — cắt danh sách cá nhân khỏi báo cáo đơn vị trước khi dán; **K2** — mọi dấu [MÂU THUẪN], [BẤT THƯỜNG] kiểm lại trên báo cáo gốc; **K3** — kết luận, kiến nghị do cấp có thẩm quyền thông qua; **K4** — bảng tổng hợp lưu trong hồ sơ giám sát, ghi phần do AI lập.

## 16.4. Tiếp công dân, xử lý đơn thư

Đây là nghiệp vụ có ranh giới rõ nhất. Đơn khiếu nại, tố cáo chứa họ tên, địa chỉ, số định danh của người viết đơn và người bị tố cáo, nhiều khi kèm thông tin về vi phạm pháp luật, sức khỏe, đời sống riêng tư; người tố cáo còn được pháp luật bảo vệ bí mật danh tính. Vì thế đơn có danh tính thuộc Cấp 3 — Hạn chế tiếp cận; đơn có nội dung hoặc tài liệu kèm theo thuộc bí mật nhà nước là Cấp 4. Dán nguyên văn đơn vào trợ lý AI trò chuyện là đưa những thông tin ấy ra khỏi cơ quan.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Tố cáo số 25/2018/QH14, được sửa đổi, bổ sung bởi Luật số 136/2025/QH15 (hiệu lực từ 01/7/2026): Điều 9 ghi quyền được giữ bí mật họ tên, địa chỉ, bút tích và thông tin cá nhân khác của người tố cáo; Điều 8 cấm tiết lộ thông tin làm lộ danh tính người tố cáo.
- Luật Tiếp công dân số 42/2013/QH13, cũng được Luật số 136/2025/QH15 sửa đổi, bổ sung: người đến khiếu nại, tố cáo, kiến nghị, phản ánh nay phải cung cấp cả thông tin định danh. Nghị quyết 116/2025/UBTVQH15 ngày 24/12/2025 của Ủy ban Thường vụ Quốc hội quy định việc tiếp công dân, tiếp nhận, phân loại, xử lý đơn của Quốc hội, HĐND (hiệu lực từ 01/7/2026).
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) chia dữ liệu cá nhân thành cơ bản và nhạy cảm; xử lý bằng hệ thống trí tuệ nhân tạo, điện toán đám mây chỉ được đúng mục đích, trong phạm vi cần thiết, có biện pháp bảo mật. Nghị định 356/2025/NĐ-CP (hiệu lực cùng ngày; Nghị định 13/2023/NĐ-CP mà Tập 1 viện dẫn đã hết hiệu lực) liệt kê dữ liệu cơ bản tại Điều 3 (họ tên, địa chỉ, số điện thoại, số định danh cá nhân…) và dữ liệu nhạy cảm tại khoản 1 Điều 4 (sức khỏe, đời sống riêng tư, dữ liệu về vi phạm pháp luật…). Một lá đơn tố cáo thường chứa cả hai loại.
:::

### 16.4.1. Quy trình và phân việc

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Tiếp công dân, nhận đơn | Không dùng | Cán bộ tiếp dân | Cấp 3 |
| 2. Vào sổ, lưu đơn | Không dùng | Văn thư, phần mềm nội bộ có phân quyền | Cấp 3 |
| 3. Tóm tắt, ẩn danh | Không dùng | Chuyên viên tự viết bản tóm tắt ẩn danh | Cấp 3 → Cấp 2 |
| 4. Gợi ý phân loại | Gợi ý loại đơn, lĩnh vực, hướng xử lý từ bản tóm tắt | Chuyên viên quyết định, lãnh đạo duyệt | Cấp 2 |
| 5. Tra quy định | Hỏi trong sổ tay có trích dẫn | Chuyên viên mở văn bản gốc | Cấp 1 |
| 6. Văn bản chuyển, hướng dẫn | Soạn mẫu để trống danh tính | Điền danh tính trên máy cơ quan, trình ký | Cấp 2 |

Mấu chốt ở bước 3: AI không bao giờ thấy lá đơn, chỉ thấy bản tóm tắt do chuyên viên tự viết, đã bỏ mọi thứ có thể nhận ra người. Tập 1 cho phép dữ liệu Cấp 3 đi qua AI máy chủ trong nước hoặc tự triển khai; với đơn thư tôi chọn cách chặt hơn, vì lộ danh tính người tố cáo là sơ suất không sửa lại được.

::: {.thuchanh}
**Thực hành — Viết bản tóm tắt ẩn danh trước khi hỏi AI**

1. Không sao chép từ đơn; viết lại bằng lời của mình, 5–7 câu.
2. Thay mọi người bằng vai: "người viết đơn", "người bị phản ánh", "cán bộ địa chính xã".
3. Thay địa danh nhỏ bằng cấp lớn hơn: "một xã miền núi" thay cho tên thôn, tên xã.
4. Bỏ số định danh, số điện thoại, biển số xe, số thửa đất, số hồ sơ.
5. Bỏ chi tiết hiếm gặp giúp đoán ra người: chức vụ duy nhất ở địa phương, sự kiện ai cũng biết, ngày tháng cụ thể.
6. Đọc lại và tự hỏi: người cùng xã đọc đoạn này có đoán ra ai không? Nếu có, viết lại.
7. Ghi vào sổ: đơn số nào đã được hỏi AI ở dạng tóm tắt, ngày nào, ai hỏi.
:::

::: {.vidu}
**Ví dụ minh họa — Ẩn danh chưa đạt**

Hãy hình dung bản tóm tắt: "Người viết đơn phản ánh nguyên trưởng thôn của một thôn giáp chợ trung tâm xã X tự ý lấn đất làm ki-ốt từ tháng 3/2026". Tên đã bỏ, nhưng các chi tiết gộp lại đủ để người địa phương nhận ra cả hai bên. Bản đạt yêu cầu: "Người viết đơn phản ánh một cá nhân lấn đất công để xây công trình kinh doanh, đề nghị cơ quan có thẩm quyền xem xét" — đủ để AI gợi ý phân loại.
:::

::: {.lenhmau}
**Câu lệnh mẫu 16.12 — Gợi ý phân loại từ bản tóm tắt đã ẩn danh (Cấp 2)**

```text
Vai: Chuyên viên xử lý đơn thư của cơ quan dân cử cấp tỉnh.
Bối cảnh: Dưới đây là BẢN TÓM TẮT ĐÃ ẨN DANH của một đơn
(không phải nguyên văn đơn).
Việc: Gợi ý: (1) đơn thuộc loại khiếu nại, tố cáo hay kiến nghị,
phản ánh, kèm lý do ngắn; (2) lĩnh vực; (3) cơ quan có thể có
thẩm quyền giải quyết; (4) những thông tin còn thiếu mà chuyên viên
cần xem lại trong đơn gốc trước khi quyết định.
Ràng buộc:
 - Đây chỉ là gợi ý để chuyên viên tham khảo; nêu rõ chỗ nào
   chưa đủ căn cứ để phân loại.
 - Không trích dẫn số điều, khoản. Không kết luận đúng sai
   của nội dung đơn.
[DÁN BẢN TÓM TẮT ĐÃ ẨN DANH]
```
:::

Mục (4) đảo chiều luồng thông tin: AI không hỏi thêm về người mà nhắc chuyên viên quay về đơn gốc trên máy cơ quan. Còn trình tự, thời hạn, thẩm quyền thì hỏi trong sổ tay có trích dẫn nguồn, như sổ tay ST-04 "Dân nguyện, khiếu nại và tố cáo" của phân hệ Sổ tay AI (Chương 15, mục 15.3). Sổ tay chạy trên Gemini Notebook (trước đây là NotebookLM; Google đổi tên tháng 7/2026, địa chỉ nay là notebook.google.com, địa chỉ cũ notebooklm.google.com mà Tập 1 ghi tự chuyển sang địa chỉ mới). Sổ tay chỉ nạp văn bản công khai nên là Cấp 1, nhưng ô câu hỏi vẫn có thể bị gõ lẫn thông tin của người viết đơn.

::: {.lenhmau}
**Câu lệnh mẫu 16.13 — Hỏi trình tự trong sổ tay Gemini Notebook (Cấp 1)**

```text
Chỉ dựa trên các nguồn trong sổ tay này, hãy trả lời:
[câu hỏi; ví dụ: đơn thư gửi đến Thường trực HĐND được phân loại
theo những tiêu chí nào?]
Yêu cầu:
 - Mỗi ý gắn trích dẫn tới văn bản, điều, khoản trong nguồn.
 - Nếu các nguồn quy định khác nhau, nêu cả hai và ghi rõ nguồn.
 - Nếu nguồn không có thông tin, trả lời "không tìm thấy trong
   nguồn", không suy đoán.
Không đưa vào câu hỏi bất kỳ thông tin nào về người viết đơn.
```
:::

Dòng cuối câu lệnh nhắc lại Điều 2 và Điều 7 của dự thảo Quy tắc sử dụng AI chín điều trong phân hệ Sổ tay AI (Chương 15, mục 15.5 — khác với khung quy chế 10 điều mà Tập 1, mục 7.6 đề xuất). Điều 6 của Quy tắc ấy giữ chốt K3: không dùng AI để quyết định thay con người trong giải quyết khiếu nại, tố cáo.

::: {.ghinho}
**Ghi nhớ**

Với đơn thư: AI không thấy đơn, chỉ thấy bản tóm tắt do người viết; AI không phân loại thay, chỉ gợi ý; AI không trả lời quy định từ trí nhớ, chỉ trả lời từ nguồn có trích dẫn.
:::

Điểm kiểm soát: **K1** — chỉ bản tóm tắt ẩn danh rời máy cơ quan; **K2** — mọi điều, khoản trong câu trả lời mở văn bản gốc ra đối chiếu; **K3** — chuyên viên quyết định phân loại, lãnh đạo duyệt hướng xử lý; **K4** — sổ ghi đơn nào đã hỏi AI ở dạng tóm tắt, ai hỏi, ngày nào.

## 16.5. Tiếp xúc cử tri và tổng hợp kiến nghị

Sau mỗi đợt tiếp xúc cử tri, ý kiến gửi về thường nhiều và lặp lại ở nhiều điểm. Chuẩn hóa, gán lĩnh vực, gộp trùng, gợi ý cơ quan giải quyết, đối chiếu văn bản trả lời là việc AI làm nhanh, miễn là dữ liệu đã bỏ tên người.

Tập 1 (mục 6.2–6.3) đã có quy trình 5 bước phân tích ý kiến cử tri với danh mục 10 chủ đề; ở đây tôi bổ sung phần Tập 1 chưa bàn: gộp trùng, chuyển cơ quan giải quyết, theo dõi trả lời.

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Ghi chép tại hội nghị | Không dùng | Thư ký tổ đại biểu | Cấp 3 (có tên, địa chỉ cử tri) |
| 2. Chuẩn hóa, bỏ tên cử tri | Không dùng | Chuyên viên, chỉ giữ địa bàn | Cấp 3 → Cấp 2 |
| 3. Gán lĩnh vực, gộp trùng | Gợi ý nhãn, nhóm ý trùng | Chuyên viên duyệt từng nhóm | Cấp 2 |
| 4. Chuyển cơ quan giải quyết | Gợi ý cơ quan | Thường trực quyết định, ký chuyển | Cấp 2 |
| 5. Theo dõi trả lời | Đối chiếu văn bản trả lời với kiến nghị | Chuyên viên đánh giá, đề xuất | Cấp 1 khi đã công khai |

::: {.cauchuyen}
**Câu chuyện thực tế — Tên cử tri không nằm ở kho công khai**

Trong hệ thống thử nghiệm, danh sách kiến nghị cử tri của phân hệ Trợ lý AI cố ý không mở quyền đọc công khai vì có tên cử tri. Phân hệ Giám sát số làm ngược lại: kho dữ liệu công khai nên bản ghi kiến nghị không lưu họ tên, số điện thoại, địa chỉ, chỉ ghi xã, phường và một mã tra cứu ngẫu nhiên. Hai cách, một nguyên tắc: nơi công khai thì không có tên, nơi có tên thì không công khai.
:::

Phân hệ Trợ lý AI dùng tám nhãn lĩnh vực (Giao thông, Môi trường, Y tế, Giáo dục, Đất đai, Đầu tư công, Chính sách xã hội, Khác) và ba trạng thái (Mới, Đang xử lý, Đã xong). Bộ nhãn nào cũng được, miễn cố định từ đầu nhiệm kỳ để so sánh giữa các kỳ.

::: {.lenhmau}
**Câu lệnh mẫu 16.14 — Gán lĩnh vực và gộp kiến nghị trùng (Cấp 2, đã bỏ tên cử tri)**

```text
Vai: Chuyên viên tổng hợp kiến nghị cử tri của cơ quan dân cử.
Bối cảnh: Danh sách kiến nghị sau tiếp xúc cử tri, mỗi dòng gồm
địa bàn cấp xã và nội dung; đã bỏ tên cử tri.
Việc:
 1. Gán mỗi kiến nghị đúng một nhãn trong: [danh sách nhãn].
 2. Gộp các kiến nghị cùng nội dung thành nhóm; mỗi nhóm có câu
    tóm tắt chung và danh sách số thứ tự dòng gốc, địa bàn.
 3. Gợi ý cơ quan có thể có thẩm quyền giải quyết từng nhóm.
Ràng buộc: Không bỏ sót dòng nào; tổng số dòng sau gộp phải bằng
số dòng ban đầu. Kiến nghị có nhiều ý thì tách ý. Cơ quan nào
chưa chắc thì ghi [CẦN XÁC ĐỊNH].
[DÁN DANH SÁCH]
```
:::

Ràng buộc đếm dòng đến từ một sự cố của dự án: khi gộp danh sách cán bộ, hai đồng chí trùng họ tên ở hai đơn vị bị ghép làm một, danh sách còn 27 thay vì 28 người. Đếm lại là cách rẻ nhất để phát hiện mất dòng. Tự lọc kiến nghị theo từ khóa thì nhớ hai cái bẫy tiếng Việt (Chương 15, mục 15.2): tìm "gia" kéo cả "quốc gia", bỏ dấu thì "báo" lẫn với "bão".

::: {.lenhmau}
**Câu lệnh mẫu 16.15 — Đối chiếu văn bản trả lời với kiến nghị (Cấp 1; văn bản chưa công khai là Cấp 2)**

```text
Vai: Chuyên viên theo dõi giải quyết kiến nghị cử tri.
Việc: Với mỗi cặp KIẾN NGHỊ – VĂN BẢN TRẢ LỜI dưới đây, đánh giá:
(1) trả lời đúng trọng tâm, một phần hay chưa đúng trọng tâm;
(2) có nêu thời hạn, lộ trình giải quyết không; (3) có cam kết nào
cần theo dõi tiếp không.
Dạng: Bảng: Kiến nghị | Tóm tắt trả lời | Đánh giá (1)(2)(3) |
Đề xuất (tiếp tục theo dõi / đưa vào chất vấn / coi là xong).
Ràng buộc: Trích câu trong văn bản trả lời làm căn cứ cho mỗi
đánh giá. Cột "Đề xuất" chỉ là gợi ý cho chuyên viên.
[DÁN CÁC CẶP]
```
:::

Điểm kiểm soát: **K1** — bỏ tên cử tri ngay khi chuẩn hóa, bản có tên giữ trên máy cơ quan; **K2** — đếm số dòng trước và sau gộp, kiểm từng nhóm; **K3** — Thường trực quyết định chuyển cơ quan nào, đánh giá trả lời đạt hay chưa; **K4** — sổ theo dõi ghi nhãn nào do AI gợi ý, ai duyệt.

## 16.6. Hoạt động của Đoàn ĐBQH

Theo Nghị quyết 1004/2020/UBTVQH14 của Ủy ban Thường vụ Quốc hội, Văn phòng được lập trên cơ sở hợp nhất hai văn phòng nên phục vụ cả Đoàn ĐBQH tỉnh, hoạt động theo Luật Tổ chức Quốc hội số 57/2014/QH13 (sửa đổi, bổ sung bởi Luật số 65/2020/QH14 và Luật số 62/2025/QH15). Hai việc nặng nhất trước mỗi kỳ họp Quốc hội là góp ý dự án luật và tổng hợp ý kiến, kiến nghị cử tri. Theo báo Đại biểu Nhân dân, trợ lý ảo AI hỗ trợ ĐBQH tra cứu tài liệu, chuẩn bị phát biểu được áp dụng lần đầu tại Kỳ họp thứ 9, Quốc hội khóa XV (năm 2025).

| Bước | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| 1. Nghiên cứu dự án luật | So sánh dự thảo với luật hiện hành | Chuyên viên kiểm, bổ sung thực tiễn địa phương | Cấp 1 |
| 2. Lấy ý kiến cơ quan, chuyên gia | Gom ý kiến theo điều, khoản | Chuyên viên kiểm, ghi nguồn | Cấp 2 |
| 3. Văn bản góp ý của Đoàn | Dựng khung | Lãnh đạo Đoàn quyết định nội dung, ký | Cấp 2 |
| 4. Phát biểu của đại biểu | Gợi ý dàn ý từ tư liệu đại biểu chọn | Đại biểu quyết định quan điểm | Cấp 2 |
| 5. Kiến nghị cử tri gửi kỳ họp | Gán lĩnh vực, gộp trùng (như mục 16.5) | Đoàn duyệt, gửi đi | Cấp 2 |

Dự thảo luật đã đăng lấy ý kiến là Cấp 1. Nhưng AI không thay được kinh nghiệm thực tế (Tập 1, mục 1.3): tác động của một điều luật tới các xã miền núi của tỉnh phải do người am hiểu địa bàn bổ sung.

::: {.lenhmau}
**Câu lệnh mẫu 16.16 — Bảng so sánh dự thảo luật với luật hiện hành (Cấp 1)**

```text
Vai: Chuyên viên giúp việc Đoàn ĐBQH tỉnh.
Bối cảnh: Tôi dán (A) dự thảo luật [tên] đang lấy ý kiến và (B) văn
bản luật hiện hành tương ứng.
Việc: Lập bảng 4 cột: Điều trong dự thảo | Quy định hiện hành tương
ứng (nếu có) | Điểm mới, điểm sửa | Vấn đề cần làm rõ khi góp ý.
Ràng buộc: Chỉ so sánh giữa A và B. Không viện dẫn văn bản khác
từ trí nhớ. Điều nào không tìm thấy quy định tương ứng thì ghi
"chưa có quy định tương ứng trong B". Không nêu quan điểm ủng hộ
hay phản đối.
[DÁN A]
[DÁN B]
```
:::

Để tổng hợp ý kiến góp ý của các cơ quan theo điều, khoản (Cấp 2), dùng lại Câu lệnh mẫu 16.3, thay "ghi chép thảo luận tổ" bằng "văn bản góp ý của [số] cơ quan" và thêm ba ràng buộc: ghi tên cơ quan sau mỗi ý kiến; không bỏ ý kiến thiểu số; ý kiến chung không gắn điều nào thì để mục riêng.

Điểm kiểm soát: **K1** — ý kiến cá nhân chưa công bố thì thay tên bằng mã; **K2** — mọi trích dẫn điều, khoản phải mở dự thảo ra đối chiếu; **K3** — quan điểm góp ý do lãnh đạo Đoàn quyết định, quan điểm phát biểu là của đại biểu; **K4** — hồ sơ góp ý lưu kèm bảng tổng hợp, ghi phần do AI lập.

## 16.7. Văn bản, thông tin, truyền thông

Soạn thảo là việc AI làm nhanh nhất và cũng dễ sinh lỗi trình ký nhất. Văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức Đảng có thể thức riêng (phân hệ Kiểm điểm từng in nhầm tên cơ quan hành chính ở tiêu đề một văn bản của Đảng — Chương 10, mục 10.4). Văn bản AI soạn chỉ là bản nháp; giá trị pháp lý chỉ có khi người có thẩm quyền ký, ban hành đúng quy trình. Quy trình 5 bước soạn thảo của Tập 1 (mục 4.1) vẫn nguyên giá trị: Bước 1 (xác định mục đích, đối tượng, yêu cầu pháp lý) và Bước 5 (rà soát, hoàn thiện) là của con người 100%.

::: {.lenhmau}
**Câu lệnh mẫu 16.17 — Soạn nháp văn bản hành chính theo khung (Cấp 2)**

```text
Vai: Chuyên viên văn phòng, soạn văn bản theo Nghị định 30/2020/NĐ-CP.
Việc: Soạn nháp [loại văn bản: công văn / báo cáo / kế hoạch / tờ trình]
của [cơ quan] về [trích yếu], nội dung chính: [các ý].
Dạng: Đủ thành phần thể thức: tên cơ quan, số ký hiệu, địa danh ngày
tháng, trích yếu, nội dung, nơi nhận, quyền hạn và chức vụ người ký.
Ràng buộc: Để trống [số], [ngày], [họ tên người ký]. Không tự thêm
căn cứ pháp lý; chỗ cần căn cứ ghi [CẦN CĂN CỨ]. Không tự đặt
số liệu; chỗ cần số ghi [SỐ LIỆU]. Văn phong trung lập, không
dùng từ ngữ phóng đại.
```
:::

Trước khi trình ký, văn bản có bàn tay AI đều qua Bảng kiểm 10 điểm trước khi trình ký của Tập 1 (mục 4.7), trong đó ba lỗi nặng nhất là sai thuật ngữ pháp lý, bịa số hiệu văn bản và bịa số liệu. Lời nhắc soát xét của phân hệ Trợ lý AI có thêm một ví dụ đáng nhớ: báo cáo sơ kết "01 năm" mà số liệu chỉ từ 01/7/2025 đến 15/5/2026 là lỗi logic quản lý.

::: {.lenhmau}
**Câu lệnh mẫu 16.18 — Soát văn bản trước khi trình ký (Cấp 2)**

```text
Vai: Chuyên viên kiểm soát chất lượng văn bản.
Việc: Rà văn bản dưới đây theo 4 trọng tâm: chính tả, ngữ pháp;
thể thức theo Nghị định 30/2020/NĐ-CP; văn phong hành chính;
logic quản lý (số liệu mâu thuẫn giữa các phần, niên độ báo cáo
không khớp, giải pháp không giải quyết khó khăn đã nêu).
Dạng: Bảng: Vị trí | Nội dung gốc | Đề xuất sửa | Loại lỗi | Lý do.
Ràng buộc: Không viết lại toàn văn. Đánh dấu riêng mọi số hiệu văn
bản, điều, khoản xuất hiện trong văn bản là [CẦN ĐỐI CHIẾU].
[DÁN VĂN BẢN]
```
:::

Tin bài về kỳ họp, giám sát chỉ viết từ tài liệu đã công khai; khi nhờ AI viết tin, bắt nó liệt kê cuối bài mọi câu trích và con số đã dùng. Với hình ảnh, video, giọng nói do AI tạo, Điều 11 Luật Trí tuệ nhân tạo quy định trách nhiệm minh bạch, gắn nhãn, trong đó có nội dung âm thanh, hình ảnh, video mô phỏng người thật; Nghị định 142/2026/NĐ-CP (hiệu lực từ 01/5/2026) hướng dẫn chi tiết, nên trường hợp nào phải gắn nhãn, theo hình thức nào thì tra nguyên văn trước khi đăng. Điều 5 Quy định 207-QĐ/TW ngày 26/7/2026 bổ sung việc đảng viên không được dùng nền tảng số, trí tuệ nhân tạo để tạo lập, phát tán thông tin sai sự thật. Nguyên tắc của tôi: không dùng AI tạo ảnh, giọng nói mô phỏng đại biểu, lãnh đạo có thật.

Cũng không phải việc nào cũng cần AI. Bản tin pháp luật hằng ngày trên Trang chủ lấy tin từ nguồn RSS chính thống, vẽ ảnh bằng một chương trình nhỏ, không gọi AI (Chương 15, mục 15.1): việc có quy tắc cố định thì chương trình cố định vừa rẻ vừa dễ kiểm.

Điểm kiểm soát: **K1** — dự thảo chưa ban hành là Cấp 2; **K2** — mọi chỗ [CẦN ĐỐI CHIẾU], [CẦN CĂN CỨ], [SỐ LIỆU] được người soạn điền và kiểm; **K3** — người có thẩm quyền ký, lãnh đạo phụ trách duyệt tin bài; **K4** — hồ sơ trình ký ghi có dùng AI hỗ trợ soạn nháp nếu cơ quan có quy định.

## 16.8. Công việc nội bộ của Văn phòng

Kế hoạch, báo cáo định kỳ, số liệu, lịch, hậu cần là việc lặp lại, nên một câu lệnh tốt dùng được nhiều lần. Nguyên tắc tôi rút ra từ dự án là "một con số, một nơi tính": bot chat không tự tính lại điểm cán bộ mà đọc bảng điểm phần mềm đã tính (Chương 14, mục 14.2). Báo cáo định kỳ cũng vậy: số liệu lấy từ một nguồn đã chốt, AI chỉ diễn đạt.

| Việc | AI làm | Người làm | Cấp dữ liệu |
|---|---|---|---|
| Báo cáo định kỳ | Viết lời từ bảng số đã chốt | Chuyên viên kiểm số, lãnh đạo duyệt | Cấp 2 |
| Bảng tính tổng hợp | Viết công thức trên dữ liệu giả | Áp công thức vào dữ liệu thật trên máy cơ quan | Cấp 1 (dữ liệu giả) |
| Lịch công tác | Gợi ý phát hiện trùng giờ, trùng xe | Văn phòng xếp, lãnh đạo duyệt | Cấp 2 |
| Hậu cần hội nghị | Lập bảng kiểm, phân công | Người phụ trách thực hiện | Cấp 1–2 |
| Đánh giá cán bộ | Không quyết định | Cấp có thẩm quyền | Cấp 3 |

::: {.lenhmau}
**Câu lệnh mẫu 16.19 — Báo cáo định kỳ từ bảng số liệu đã chốt (Cấp 2)**

```text
Vai: Chuyên viên tổng hợp của Văn phòng.
Việc: Viết phần "Kết quả thực hiện" của báo cáo [tháng/quý] từ bảng
số liệu dưới đây, theo bố cục: I. Tình hình; II. Kết quả; III. Hạn chế;
IV. Nhiệm vụ kỳ tới (để trống cho lãnh đạo).
Ràng buộc: Chỉ dùng số trong bảng, không tính thêm chỉ tiêu mới,
không làm tròn khác bảng. Kỳ báo cáo ghi đúng [từ ngày ... đến ngày ...].
Cuối bài liệt kê mọi con số đã dùng kèm dòng tương ứng trong bảng.
[DÁN BẢNG SỐ LIỆU ĐÃ CHỐT]
```
:::

Với bảng tính tổng hợp, AI chỉ cần biết cấu trúc, không cần thấy dữ liệu thật. Đồng chí dán tên các cột và năm dòng dữ liệu giả (Cán bộ A, Cán bộ B…), mô tả quy tắc tính, yêu cầu AI trả về công thức kèm giải thích và kết quả mong đợi trên năm dòng giả để tự kiểm. Bảng có họ tên ở lại trên máy cơ quan; công thức thì mang về áp vào.

Lịch công tác của lãnh đạo là thông tin nội bộ, Cấp 2: dùng khóa AI của dịch vụ trung gian thì mọi câu hỏi kèm số liệu, kể cả lịch lãnh đạo, đều đi qua máy chủ bên thứ ba (Chương 14, mục 14.6), nên chỉ hỏi trên kênh cơ quan đã cho phép.

::: {.canhbao}
**Cảnh báo — Đánh giá cán bộ không phải việc của AI**

Điều 6 của dự thảo Quy tắc chín điều trong phân hệ Sổ tay AI: không dùng AI để quyết định thay con người trong đánh giá, xếp loại cán bộ, kết luận giám sát, giải quyết khiếu nại, tố cáo, quyết định nhân sự. Phần mềm đánh giá trong hệ thống thử nghiệm tính điểm theo công thức đã duyệt, nhưng nút phê duyệt luôn của người có thẩm quyền; sửa điểm sau khi duyệt thì phê duyệt tự bị gỡ (Chương 9, mục 9.2). Nhận xét, đánh giá cá nhân là Cấp 3, không dán vào trợ lý AI trò chuyện, kể cả để "viết lại cho mượt".
:::

Điểm kiểm soát: **K1** — dữ liệu giả cho mọi việc viết công thức; **K2** — liệt kê con số cuối báo cáo để kiểm; **K3** — lãnh đạo duyệt báo cáo, lịch; cấp có thẩm quyền đánh giá cán bộ; **K4** — lưu câu lệnh đã dùng thành thư viện câu lệnh của phòng. Theo nguyên tắc 20-80 (Tập 1, mục 3.1), câu lệnh nào khiến phải dành 60–70% thời gian sửa kết quả thì viết lại câu lệnh.

## Tóm tắt chương 16

::: {.tomtat}
1. Mọi quy trình có AI đi qua năm câu hỏi: sản phẩm và người ký, cấp dữ liệu, phân việc, cách kiểm, chỗ lưu vết.
2. Bốn cấp dữ liệu của Tập 1 (mục 7.1–7.2): Cấp 1 Công khai dùng mọi AI; Cấp 2 Nội bộ chỉ dùng AI dành cho tổ chức, sau khi ẩn danh; Cấp 3 Hạn chế tiếp cận chỉ dùng AI máy chủ trong nước hoặc tự triển khai; Cấp 4 Bí mật nhà nước không bao giờ đưa lên AI nước ngoài. Không chắc thì chọn cấp cao hơn.
3. Bốn chốt K1 dữ liệu, K2 nguồn, K3 thẩm quyền, K4 lưu vết. AI không bao giờ đứng ở chốt K3 — đó là Mô hình 1 "AI đề xuất, con người duyệt" của Tập 1.
4. Kỳ họp: AI kiểm hồ sơ, tóm tắt, gom thảo luận đã ẩn danh, dựng kịch bản; tỷ lệ biểu quyết tính trên tổng số đại biểu; phiên có nội dung mật là Cấp 4.
5. Thẩm tra, giám sát: AI soi chỗ lệch, soát số học, gộp báo cáo, tách kết luận thành bảng theo dõi; không khẳng định hiệu lực văn bản, không xếp hạng, không kết luận thay Ban, thay đoàn.
6. Đơn thư có danh tính là Cấp 3: AI chỉ thấy bản tóm tắt ẩn danh do người viết, chỉ gợi ý phân loại, chỉ trả lời quy định từ nguồn có trích dẫn.
7. Kiến nghị cử tri: bỏ tên từ khâu chuẩn hóa; đếm số dòng trước và sau khi gộp; nơi công khai thì không có tên.
8. Văn bản, việc nội bộ: bản nháp để trống số, căn cứ, người ký; số liệu từ một nguồn đã chốt; công thức viết trên dữ liệu giả.
:::

## Câu hỏi suy ngẫm và bài tập

1. Chọn một việc của đồng chí trong tuần tới, lập bảng Bước – AI làm – Người làm – Cấp dữ liệu và đánh dấu bốn chốt K1–K4.
2. Lấy một tờ trình và dự thảo nghị quyết đã thông qua, đã công khai; chạy câu lệnh 16.5 và 16.7 rồi tự kiểm từng dòng AI đánh dấu. Bao nhiêu dòng đúng?
3. Viết bản tóm tắt ẩn danh cho một đơn giả định theo bảy bước ở mục 16.4, nhờ đồng nghiệp thử đoán người viết đơn. Nếu đoán được, chỗ nào đã để lộ?
4. Vì sao câu lệnh 16.14 đòi số dòng sau gộp bằng số dòng ban đầu? Kể một trường hợp phép đếm đơn giản ấy lẽ ra đã phát hiện được sai sót.
5. Nghiệp vụ nào ở cơ quan đồng chí nên bắt đầu dùng AI trước? Viết một trang đề xuất gửi lãnh đạo phòng, nêu cấp dữ liệu, chốt kiểm soát, người chịu trách nhiệm.
