# Chương 8. Từ văn bản quy phạm đến đặc tả phần mềm

::: {.muctieu}
**Mục tiêu của chương**

- Đọc một văn bản quy định theo sáu lớp "bản vẽ": chủ thể, quy trình, công thức, biểu mẫu, thời hạn, thẩm quyền; nhận ra những chữ nhỏ dễ làm phần mềm tính sai.
- Dựng bảng tính mô phỏng làm "sa bàn" và biến nó thành bộ ca kiểm thử trước khi giao tác tử AI viết phần mềm.
- Viết được bản đặc tả yêu cầu bằng tiếng Việt cùng AI, theo một mẫu dàn ý dùng được ngay.
- Đối chiếu biểu mẫu giấy với màn hình; xử lý đúng mực khi văn bản tự mâu thuẫn.
- Hiểu sản phẩm khả dụng tối thiểu, cách thu ý kiến người dùng và vì sao phải dám gỡ bỏ phiên bản thừa.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ toàn chương); lãnh đạo nên đọc mục 8.1, 8.5, 8.6 và các hộp "Dành cho lãnh đạo".
:::

Sau vài tháng làm việc cùng tác tử AI lập trình (AI coding agent — công cụ AI tự đọc, sửa mã và chạy thử trên máy, như một tổ chuyên viên kỹ thuật làm theo giao việc), tôi nhận ra: phần khó nhất không nằm ở mã nguồn. Tác tử có thể dựng một màn hình chấm điểm trong vài phút. Nhưng nếu tôi hiểu sai một chữ trong quy định, màn hình ấy sẽ chấm sai cho cả cơ quan, nhanh và đều tay.

Văn bản quy định là ngôn ngữ của con người, có độ co giãn: "trở lên", "kịp thời", "cơ bản". Phần mềm thì không chấp nhận co giãn. Máy cần biết 89,99 điểm thuộc mức nào, mẫu số là tổng số người hay số người có mặt, tháng 9 là "kỳ tháng 9" hay "Quý III". Giữa hai thứ ngôn ngữ ấy cần người phiên dịch, và người phiên dịch tốt nhất là cán bộ hiểu nghiệp vụ.

Chữ "văn bản quy phạm" ở đây hiểu theo nghĩa rộng: mọi văn bản đặt ra quy tắc mà phần mềm phải làm theo, kể cả hướng dẫn, khung tiêu chí, dự thảo. Chất liệu là những văn bản hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) đã số hóa năm 2026, cùng những lần tôi phiên dịch sai và phải sửa. Các câu lệnh mẫu trong chương viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2), theo cách giao việc cho tác tử đã trình bày ở Chương 6.

## 8.1. Đọc một văn bản quy định như đọc một bản thiết kế

Người làm xây dựng không đọc bộ bản vẽ như đọc truyện; họ tách bản vẽ kiến trúc, kết cấu, điện nước rồi đối chiếu chéo. Đọc văn bản để số hóa cũng phải tách lớp như thế, vì mỗi lớp thành một bộ phận của phần mềm.

### 8.1.1. Sáu lớp của một văn bản quy định

Ví dụ trong bảng lấy từ Nghị định 335/2025/NĐ-CP của Chính phủ về đánh giá, xếp loại chất lượng cơ quan hành chính nhà nước và công chức, và Quy định 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa.

| Lớp | Câu hỏi đặt ra | Ví dụ | Thành gì trong phần mềm |
|---|---|---|---|
| Chủ thể | Ai bị điều chỉnh, chia nhóm ra sao? | Lãnh đạo; công chức; lao động hợp đồng | Thuộc tính "nhóm đối tượng" của mỗi người |
| Quy trình | Ai làm gì, theo thứ tự nào? | Tự đánh giá, nhận xét, quyết định, công khai | Các trạng thái của phiếu |
| Công thức | Tính thế nào, làm tròn ra sao? | 30 + 70 điểm; (a+b+c)/3; trừ 25% mỗi lần | Hàm tính điểm |
| Biểu mẫu | Ghi vào đâu, in ra sao? | Phiếu theo dõi, bảng tổng hợp | Màn hình nhập, tệp Word, Excel |
| Thời hạn | Khi nào, theo chu kỳ nào? | Trước ngày 28; tháng 12 trước 15/12 | Kỳ đánh giá, nhắc hạn, khóa sổ |
| Thẩm quyền | Ai đề xuất, ai quyết định? | Cấp trực tiếp đề xuất, cấp quản lý quyết định | Vai trò, nút phê duyệt |

**Chủ thể.** Bản đặc tả của dự án (mục 8.3) chốt một câu: nhóm đối tượng là thuộc tính của người, gán theo vị trí việc làm, không phải của danh mục công việc. Vì thế trong bản đang vận hành, "Mẫu" của mỗi người tự suy ra từ chức vụ; không ai chọn tay nên không ai chọn nhầm.

**Quy trình** là thứ tự dữ liệu sẵn sàng, không chỉ là thứ tự màn hình: điểm tính từ dưới lên (xong cấp dưới mới tính được phần của lãnh đạo), còn phê duyệt đi từ trên xuống.

**Công thức.** Khoản 2 Điều 14 Nghị định 335/2025/NĐ-CP đo kết quả thực hiện nhiệm vụ bằng tỷ lệ phần trăm về số lượng (a), chất lượng (b), tiến độ (c) của sản phẩm đã quy đổi; với công chức không giữ chức vụ lãnh đạo, quản lý, Nghị định tính (a+b+c)/3. Khoản 5 Điều 5 Quy định 1053-QĐ/TU nêu mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ nguyên nhân khách quan được xác nhận. Thành con số: giao 10 văn bản, một văn bản sai sót lớn thì b = (9 × 100 + 1 × 75) / 10 = 97,5%.

**Thời hạn và thẩm quyền.** Điều 10 Quy định 1053-QĐ/TU yêu cầu hoàn thành đánh giá trước ngày 28 hằng tháng, riêng tháng 12 trước 15/12. Điểm 2.2 Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương phân rõ: cấp trực tiếp sử dụng cán bộ đề xuất mức xếp loại, cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt. Trong phần mềm, điều đó thành hai cột "Tự đánh giá" và "Cấp duyệt", cùng nút "Phê duyệt" chỉ người có thẩm quyền bấm được; sửa điểm sau khi phê duyệt thì phê duyệt tự bị gỡ.

::: {.phaply}
**Căn cứ pháp lý: chủ trương ứng dụng công nghệ số trong đánh giá cán bộ**

- Nghị định 335/2025/NĐ-CP (ban hành 21/12/2025, hiệu lực 01/01/2026), Điều 4: nguyên tắc ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại.
- Quy định 1053-QĐ/TU ngày 05/6/2026, khoản 4 Điều 3: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc bản gốc lưu tại cơ quan trước khi dùng làm căn cứ.
:::

### 8.1.2. Những chữ nhỏ quyết định đúng sai

Lớp công thức nguy hiểm nhất, và nguy hiểm nằm ở những chữ rất nhỏ đã làm dự án vấp, hoặc suýt vấp.

**"Không hoàn thành".** Điều 8 Quy định 1053-QĐ/TU xếp loại "Không hoàn thành nhiệm vụ" đối với người không giữ chức vụ có trên 50% nhiệm vụ không hoàn thành. Muốn máy đếm được, phải trả lời trước: thế nào là *một* nhiệm vụ không hoàn thành? Phiên bản đầu, AI tự chọn cách hiểu khắt khe nhất: dưới 100% số lượng là "không hoàn thành", nên người làm được 9 trên 10 văn bản vẫn bị ép xuống mức thấp nhất. Tôi chốt lại: dưới 50% mới là không hoàn thành, từ 50% đến dưới 100% là chưa đạt đủ số lượng. Đó là cách hiểu cho bản thử nghiệm; dùng chính thức thì cần cấp có thẩm quyền xác nhận (điều kiện xếp loại xem Chương 9).

**"Quá nửa tổng số".** Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15, nghị quyết của Hội đồng nhân dân (HĐND) được thông qua khi quá nửa tổng số đại biểu biểu quyết tán thành. Mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm nút. Với 82 đại biểu HĐND tỉnh, quá nửa là từ 42 phiếu; hai phần ba (với nội dung luật đòi hỏi tỷ lệ này) là từ 55 phiếu, vì 82 × 2/3 = 54,67 phải làm tròn lên (phân hệ Biểu quyết trực tuyến ở Chương 12, mục 12.3 tính đúng như vậy).

**"Từ … đến dưới".** Theo Điều 20 Nghị định 335/2025/NĐ-CP, Hoàn thành xuất sắc nhiệm vụ từ 90 điểm trở lên, Hoàn thành tốt từ 70 đến dưới 90 điểm. Câu hỏi cho máy: 89,995 điểm làm tròn thành 90,00 rồi mới so ngưỡng, hay so rồi mới làm tròn? Văn bản không nói thì hỏi cấp có thẩm quyền, rồi ghi vào đặc tả và áp dụng thống nhất.

**"Mỗi lần".** Bản đặc tả của dự án (mục 8.3) viết đủ ba ý: mức trừ 25% áp cho từng sản phẩm chứ không cho cả lô; bị trừ nhiều lần thì cộng dồn; thấp nhất bằng 0. Thiếu một trong ba ý ấy, hai người lập trình sẽ làm ra hai kết quả.

**"Tháng" và "quý".** Ở phân hệ Kiểm điểm, ô chọn quý ghi vào tháng cuối quý nhưng kỳ khởi tạo lại lấy tháng hiện hành, nên tháng 8 và tháng 9 cùng Quý III thành hai bản ghi; sang tháng 9 mở ra thì mất phần đã chấm (Chương 10, mục 10.5). Mỗi đơn vị thời gian nghiệp vụ chỉ được có một cách quy đổi.

**"Trần 20%".** Khoản 7 Điều 3 Quy định 1053-QĐ/TU giới hạn số "Hoàn thành xuất sắc" không quá 20% số "Hoàn thành tốt": mẫu số là số người Hoàn thành tốt, không phải tổng số cán bộ.

Tóm lại, mỗi chữ chỉ ngưỡng, mẫu số, cách làm tròn hay đơn vị thời gian là một quyết định. Văn bản chưa rõ thì hỏi người có thẩm quyền và ghi lại câu trả lời, không để AI tự chọn rồi im lặng.

### 8.1.3. Phiếu bóc tách văn bản

Tập 1 (mục 4.1) xếp bước "xác định mục đích, đối tượng, yêu cầu pháp lý" vào phần việc con người làm 100%. Số hóa cũng vậy: tôi giao AI làm bản nháp bóc tách, còn tôi làm phần không thể bỏ là đối chiếu từng Điều, khoản được dẫn với văn bản gốc và đánh dấu chỗ cần xin ý kiến.

::: {.lenhmau}
**Câu lệnh mẫu 8.1 — Bóc tách văn bản quy định thành sáu lớp**

```text
Vai: Đồng chí là chuyên viên pháp chế kiêm phân tích nghiệp vụ, đang chuẩn bị số hóa một văn bản quy định thành phần mềm.
Bối cảnh: Tôi gửi kèm toàn văn [tên, số hiệu, ngày ban hành văn bản]. Đây là văn bản đã công khai (Cấp 1). Phần mềm dùng để [mục đích, ví dụ: chấm điểm hằng tháng cho cán bộ một phòng].
Việc: Bóc tách văn bản thành 6 lớp: (1) chủ thể và cách chia nhóm; (2) quy trình, các bước, người làm từng bước; (3) công thức, ngưỡng, quy tắc làm tròn; (4) biểu mẫu đầu vào, đầu ra; (5) thời hạn, mốc, chu kỳ; (6) thẩm quyền đề xuất, quyết định, phê duyệt.
Dạng: Mỗi lớp một bảng 3 cột: Nội dung | Trích dẫn (Điều, khoản, điểm) | Ghi chú. Cuối cùng lập riêng bảng "Chỗ chưa rõ hoặc hiểu được nhiều cách": mỗi dòng nêu các cách hiểu và hệ quả về điểm số của từng cách.
Ràng buộc: Chỉ dùng câu chữ trong văn bản tôi gửi. Mỗi ý phải ghi Điều, khoản cụ thể. Chỗ nào văn bản không nói thì ghi "Văn bản không quy định", không suy đoán, không bổ sung từ trí nhớ.
```
:::

Bảng "chỗ chưa rõ" ở cuối là phần giá trị nhất: danh sách câu hỏi để mang đi xin ý kiến trước khi một dòng mã nào được viết.

## 8.2. Bảng tính mô phỏng trước, phần mềm sau

Trước khi xây công trình lớn, người ta làm sa bàn. Với phần mềm tính điểm, sa bàn rẻ và dễ hiểu nhất là một bảng tính.

::: {.cauchuyen}
**Câu chuyện thực tế: "bộ máy tính điểm" bằng Excel**

Bản đặc tả yêu cầu phần mềm đánh giá cán bộ theo KPI (chỉ số đánh giá hiệu quả công việc) của Văn phòng, soạn tháng 7/2026, đi kèm một tệp Excel mang tên "Engine tính điểm KPI mô phỏng". Tệp có bảy trang tính, theo đúng đường đi của dữ liệu: Hướng dẫn · Danh mục (48 sản phẩm, công việc kèm điểm và hệ số quy đổi) · Nhân sự (tám cán bộ tên giả định, chia ba nhóm) · Tiêu chí chung · Giao việc (24 dòng nhiệm vụ của kỳ 07/2026) · KPI tổng hợp · Thống kê.

Hai quy ước nhỏ làm tệp dễ dùng: chữ xanh là ô nhập liệu, chữ đen là công thức; cột "Nhóm" là "công tắc", chọn nhóm lãnh đạo thì công thức tự chuyển sang chia 6. Bản đặc tả ghi tệp này là "bộ ca kiểm thử bắt buộc": cùng dữ liệu đầu vào, phần mềm phải cho kết quả trùng khớp đến 02 chữ số thập phân.
:::

### 8.2.1. Vì sao là bảng tính

Bảng tính ai cũng đọc được, công thức hiện ngay khi bấm vào ô, sửa tham số mất vài giây, và dữ liệu không rời khỏi máy. Nó còn buộc người làm viết quy tắc thành công thức: muốn trang Giao việc tự lấy hệ số thì phải có cột "Mã sản phẩm" tra sang trang Danh mục, tức là phần mềm sẽ cần một danh mục có mã.

Bảng tính cũng tự nói ra giới hạn của nó. Trang Hướng dẫn ghi các điều kiện phụ tại Điều 8 (mọi nhiệm vụ phải hoàn thành, ít nhất 30% nhiệm vụ vượt mức…) được "kiểm tra thủ công/trong phần mềm", vì điều kiện xét theo từng nhiệm vụ rất khó viết gọn trong ô Excel. Dòng ghi chú trung thực ấy chỉ đúng phần việc phải giao cho phần mềm.

### 8.2.2. Khi sa bàn tự đặt câu hỏi

Đọc lại tệp mô phỏng để viết chương này, tôi để ý: với dữ liệu mẫu, cả tám cán bộ giả định đều từ 90 điểm, đều xếp loại A. Số người Hoàn thành tốt bằng 0 nên trần 20% cũng bằng 0, và trang Thống kê báo: "VƯỢT TRẦN: phải xét lại theo điểm từ cao xuống thấp".

Bảng tính không sai; nó đang đặt một câu hỏi nghiệp vụ thật. Tính trần trước rồi mới hạ mức thì trần bằng 0, không ai được xếp xuất sắc. Hạ cả tám người xuống Hoàn thành tốt trước rồi mới tính thì trần là 20% của 8, làm tròn xuống được 1 người. Hai thứ tự tính, hai kết quả; chọn thứ tự nào là việc của người có thẩm quyền, không phải của máy. Bản đặc tả đi đúng hướng khi ghi: vượt trần thì xếp theo điểm từ cao xuống thấp, các trường hợp bằng điểm đưa ra cấp có thẩm quyền quyết định.

Chuyện làm tròn cũng vậy: tệp mô phỏng làm tròn xuống, còn điểm 6.2 Hướng dẫn 02-HD/BTCTW (đánh giá hằng quý cán bộ lãnh đạo, quản lý) làm tròn tỷ lệ "Hoàn thành xuất sắc" từ 0,5 lên 1. Phần mềm phải biết mình chạy theo văn bản nào. Và dữ liệu mẫu phải được *chọn* để chạm các mép: bảng tính lúc nào cũng báo "Đạt" thì không dạy được ta điều gì.

### 8.2.3. Biến bảng tính thành bộ ca kiểm thử

Bộ ca kiểm thử, hay chuẩn đối chiếu (test oracle), là tập hợp các trường hợp đã biết trước đáp án, giống như bấm thử vài phép tính đã biết kết quả trước khi giao máy tính bỏ túi mới cho kế toán.

::: {.thuchanh}
**Thực hành: dựng bộ ca kiểm thử từ bảng tính**

1. Chọn 6–8 hồ sơ giả định (tên giả, không dùng người thật), phủ đủ: một người bình thường; người đúng 90, 70, 50 điểm và người sát dưới mỗi ngưỡng; một lãnh đạo; một người có sai sót và chậm tiến độ; một kỳ không có nhiệm vụ nào; một tình huống nhiều người cùng xuất sắc để chạm trần.
2. Tính bằng bảng tính, ghi cột "kết quả mong đợi"; nhờ đồng nghiệp tính tay lại ít nhất hai hồ sơ.
3. Lưu bảng tính cùng bản đặc tả, tên tệp kèm ngày.
4. Khi giao tác tử AI viết phần mềm, đưa bảng tính và yêu cầu viết phép kiểm tự động (test) so khớp đến 2 chữ số thập phân.
5. Mỗi lần đổi phương pháp tính, sửa bảng tính và đáp án trước, rồi mới sửa phần mềm.
:::

Bước 5 có lý do thực tế: về sau, bản vận hành của phân hệ đánh giá OKR/KPI chuyển Nhóm II từ đếm số lần sai sót, số lần chậm sang chọn mức (chất lượng 100%, 75%, 50%; tiến độ 100%, 80%, 50%), dữ liệu cũ tự quy đổi để không vỡ. Từ đó bảng tính cũ không còn là chuẩn: bảng tính là chuẩn của *một* phương pháp tại *một* thời điểm.

::: {.lenhmau}
**Câu lệnh mẫu 8.2 — Dựng bảng tính mô phỏng từ văn bản**

```text
Vai: Đồng chí là chuyên viên tổng hợp giỏi Excel, quen nghiệp vụ đánh giá cán bộ.
Bối cảnh: Tôi gửi kèm phiếu bóc tách 6 lớp của [tên văn bản], đã đối chiếu bản gốc. Tôi cần bảng tính mô phỏng để thử cách tính trước khi làm phần mềm.
Việc: Thiết kế tệp Excel gồm các trang: Hướng dẫn; Danh mục (có mã); Nhân sự (có cột nhóm đối tượng); Dữ liệu đầu vào của kỳ; Tổng hợp điểm; Thống kê, kiểm soát trần.
Dạng: Với từng trang, nêu tên cột, cột nhập tay (chữ xanh), cột công thức (chữ đen) và công thức. Kèm 8 hồ sơ giả định chạm đủ ngưỡng, tình huống biên, và bảng kết quả mong đợi.
Ràng buộc: Chỉ dùng công thức, ngưỡng có trong phiếu bóc tách. Điều kiện nào không viết được bằng công thức Excel thì liệt kê ở trang Hướng dẫn với ghi chú "kiểm tra thủ công". Không dùng họ tên người thật.
```
:::

## 8.3. Viết đặc tả yêu cầu bằng tiếng Việt cùng AI

Đặc tả yêu cầu phần mềm (software requirements specification) giống hồ sơ mời thầu của một công trình: nói rõ cần *cái gì* và thế nào là *đúng*, không nói phải xây bằng gì. Có AI viết mã vẫn cần đặc tả; không có nó, mỗi câu lệnh là một mảnh rời, chỗ nào không nói thì AI tự đoán. Có đặc tả, tác tử đọc lại được ở mọi phiên làm việc, như bộ nhớ dự án ở Chương 7.

### 8.3.1. Bản đặc tả thật của dự án

Bản đặc tả nói ở mục 8.2 ghi rõ là tài liệu gửi đơn vị phát triển phần mềm. Bảy chương lần lượt là: giới thiệu chung; người dùng và phân quyền (năm vai trò, cây thẩm quyền theo bảy khối cơ quan, đăng nhập một lần qua định danh điện tử); chín nhóm yêu cầu chức năng; yêu cầu phi chức năng; mô hình dữ liệu tối thiểu sáu bảng; thuật toán tính điểm viết từng bước; lộ trình ba giai đoạn và tiêu chí nghiệm thu.

Bốn chỗ đáng học theo. Một, gom khác biệt về một chỗ: khác biệt giữa ba nhóm đối tượng chỉ xử lý tại ba điểm (phần danh mục được chọn, mẫu phiếu tiêu chí chung, công thức KPI), không "rải" khắp phần mềm. Hai, mượn đúng chữ văn bản cấp trên: mỗi nhiệm vụ giao phải bảo đảm "sáu rõ" (điểm 1.2 Hướng dẫn 02-HD/BTCTW: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền). Ba, yêu cầu phi chức năng đo được: phản hồi không quá 03 giây, tự chấm không quá 10 phút, chịu tải các ngày 24–28 hằng tháng. Bốn, nghiệm thu đo được: khớp tệp Excel đến 02 chữ số thập phân.

Cũng phải nói thật: đặc tả viết cho hệ thống chính thức toàn tỉnh, bản demo của tôi chỉ làm phần lõi; đăng nhập qua định danh điện tử, cây thẩm quyền bảy khối, liên thông hệ thống quản lý văn bản đều chưa làm.

::: {.canhbao}
**Cảnh báo: căn cứ trong đặc tả cũng có "hạn sử dụng"**

Khi rà lại bản đặc tả để viết chương này, tôi thấy phần căn cứ và phần an toàn thông tin vẫn dẫn Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, văn bản đã hết hiệu lực từ 01/01/2026 theo khoản 2 Điều 42 Nghị định 356/2025/NĐ-CP. Căn cứ đúng là Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, cùng có hiệu lực từ 01/01/2026.

Một thay đổi khác đang ở phía trước: Quy định 366-QĐ/TW ngày 30/8/2025 của Bộ Chính trị, một căn cứ của phân hệ Kiểm điểm, sẽ được thay thế bởi Quy định 227-QĐ/TW ngày 19/10/2026, có hiệu lực từ 01/01/2027. Đến thời điểm viết, phần mềm chưa cập nhật theo văn bản mới.

Bảng căn cứ trong đặc tả nên có thêm ba cột: tình trạng hiệu lực, ngày kiểm tra, người kiểm tra. Ngưỡng, trần, tiêu chí nên là cấu hình, không đóng cứng trong mã.
:::

### 8.3.2. Mẫu dàn ý đặc tả cho một ứng dụng của cơ quan

Với ứng dụng nhỏ do cán bộ tự làm, đặc tả chỉ cần 5–10 trang, theo mười hai mục, mỗi mục kèm một câu tự kiểm tra:

1. **Mục đích, phạm vi**: giải quyết việc gì, cho ai, và *không* làm gì. Nói được trong một câu không?
2. **Căn cứ**: số hiệu, ngày, tình trạng hiệu lực. Đã tra ngày nào?
3. **Thuật ngữ**: định nghĩa những chữ dễ hiểu sai. "Không hoàn thành" là gì?
4. **Người dùng, quyền**: ai xem, ai sửa, ai duyệt. Khách thấy gì?
5. **Quy trình, mốc thời gian**: các bước, thứ tự, hạn. Quá hạn thì sao?
6. **Chức năng**: danh sách việc phần mềm làm. Chức năng nào cũng có người thật cần?
7. **Công thức**: viết từng bước, kèm ví dụ số. Đã có ca kiểm thử chưa?
8. **Biểu mẫu đầu ra**: phiếu, bảng, tệp xuất. Đúng thể thức chưa?
9. **Dữ liệu, bảo mật**: từng trường dữ liệu thuộc cấp nào trong phân loại 4 cấp của Tập 1 (mục 7.1–7.2): Công khai, Nội bộ, Hạn chế tiếp cận, Bí mật nhà nước? Không chắc thì chọn cấp cao hơn; Cấp 4 thì không đưa vào ứng dụng tự làm. Có dữ liệu cá nhân không (Chương 3, mục 3.3)?
10. **Phi chức năng**: tốc độ, thiết bị, chi phí tối đa. Đo bằng gì?
11. **Nghiệm thu**: tiêu chí và bộ ca kiểm thử. Ai nghiệm thu?
12. **Lộ trình**: thí điểm, mở rộng, chuyển giao. Khi nào dừng?

Mục 1 và 12 hay bị bỏ qua nhất: "không làm gì" để tác tử AI không tự ý mở rộng, "khi nào dừng" để người làm không ôm mãi một bản demo.

### 8.3.3. Viết đặc tả cùng AI: hỏi trước, viết sau

Cách làm tôi đề nghị gồm bốn bước:

1. Gom đủ đầu vào: văn bản (bản chụp phải qua nhận dạng chữ và đọc soát), biểu mẫu, bảng tính, phiếu bóc tách.
2. Bắt AI *hỏi trước* chỗ chưa rõ, trả lời xong mới cho viết (như chế độ lập kế hoạch ở Chương 6, mục 6.3).
3. Cho AI phản biện bản đặc tả bằng những vai khác.
4. Tự chốt, lưu đặc tả cùng bảng tính trong kho mã nguồn (repository) của dự án, mỗi lần sửa ghi vào nhật ký thay đổi (Chương 7). Kho mã để công khai thì chỉ lưu bản không chứa thông tin nội bộ, dữ liệu cá nhân.

::: {.lenhmau}
**Câu lệnh mẫu 8.3 — Soạn đặc tả (hỏi trước, viết sau) và phản biện**

```text
Vai: Đồng chí là chuyên gia phân tích nghiệp vụ, soạn đặc tả yêu cầu phần mềm cho cơ quan nhà nước.
Bối cảnh: Tôi gửi kèm: (1) phiếu bóc tách 6 lớp của [tên văn bản]; (2) bảng tính mô phỏng; (3) biểu mẫu giấy đang dùng (bản trắng hoặc đã xóa hết thông tin cá nhân). Ứng dụng phục vụ [đối tượng, quy mô], là bản thử nghiệm nội bộ.
Việc: Bước 1: CHƯA viết đặc tả. Liệt kê tối đa 20 câu hỏi về những chỗ chưa rõ, xếp theo mức ảnh hưởng tới kết quả tính toán, rồi dừng lại chờ tôi trả lời.
Bước 2 (sau khi tôi trả lời): viết đặc tả theo 12 mục: mục đích, phạm vi; căn cứ; thuật ngữ; người dùng, quyền; quy trình, mốc; chức năng; công thức; biểu mẫu; dữ liệu, bảo mật; phi chức năng; nghiệm thu; lộ trình.
Dạng: Tiếng Việt hành chính; mỗi yêu cầu đánh số YC-xx, ghi căn cứ Điều, khoản. Câu nào tôi trả lời "chờ quyết định" thì giữ nguyên nhãn đó.
Ràng buộc: Không thêm chức năng ngoài phạm vi tôi nêu. Không tự bổ sung căn cứ pháp lý từ trí nhớ; cần căn cứ nào thì ghi "[cần tra cứu]".
```

Khi đã có bản đặc tả, dùng tiếp câu lệnh phản biện:

```text
Đọc bản đặc tả tôi gửi kèm, lần lượt đóng hai vai:
Vai 1 — Đơn vị phát triển phần mềm: chỉ ra yêu cầu mơ hồ (hai lập trình viên có thể hiểu khác nhau), yêu cầu không kiểm thử được, yêu cầu mâu thuẫn nhau; đề xuất cách viết lại đo được.
Vai 2 — Cán bộ thanh tra: chỉ ra chỗ phần mềm có thể tự quyết thay người có thẩm quyền, chỗ thu thập dữ liệu cá nhân quá mức cần thiết, chỗ thiếu lưu vết.
Trình bày thành bảng: Mã YC | Vấn đề | Đề xuất sửa | Mức độ (cao/trung bình/thấp). Không sửa trực tiếp vào đặc tả; chỉ đề xuất để tôi quyết định.
```
:::

## 8.4. Biến biểu mẫu giấy thành màn hình

Văn bản hướng dẫn cho biết người ta *phải* làm gì; biểu mẫu giấy đang dùng cho biết người ta *thực sự* làm gì. Phần mềm phải đúng văn bản về nội dung, đúng biểu mẫu về cách ghi.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch ở phân hệ Kiểm điểm**

Phân hệ Kiểm điểm hằng quý được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy, chạy được, các phép kiểm đều đạt. Ngày 28/9/2026, tôi đặt phần mềm cạnh hai biểu mẫu giấy chính tôi đang dùng: bản tự đánh giá Quý III/2026 và kế hoạch cá nhân Quý IV/2026. Lệch bốn chỗ lớn:

1. Thực tế có **hai bước**: đầu quý lập kế hoạch, trình tập thể lãnh đạo duyệt; cuối quý tự đánh giá ngay trên kế hoạch đó. Phần mềm chỉ có một bước.
2. **Điểm tối đa từng trục không cố định**: cá nhân tự đề xuất theo thứ tự ưu tiên, tổng sáu trục bằng 70. Hồ sơ của tôi Quý III phân bổ 15-20-10-15-5-5, Quý IV là 10-20-10-20-5-5; phần mềm lại đóng cứng 15-10-10-15-10-10.
3. **Nhóm A chấm nhị phân**: biểu mẫu chỉ có hai ô đánh dấu "Đảm bảo", "Không đảm bảo"; phần mềm lại cho nhập điểm lẻ.
4. **Mỗi nhiệm vụ đủ năm cột**: mục tiêu, kết quả cần đạt, thời gian, kết quả thực tế, mức độ; phần mềm chỉ có tên và mức độ.

Thêm một lỗi ở tệp Word xuất ra: đây là văn bản của Đảng, tiêu đề phải là "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH", vậy mà phần mềm in tên cơ quan hành chính.
:::

Chỗ lệch thứ hai làm tôi suy nghĩ nhất. Điểm 2.5 Hướng dẫn 02-HD/BTCTW đã nói cá nhân xác định trục giữ vai trò chính và trục giữ vai trò phụ, phối hợp, hỗ trợ; trục chính chiếm tỷ trọng điểm cao hơn. Đọc kỹ thì suy ra được điểm tối đa phải đổi theo từng người, vậy mà cả tôi lẫn AI đều bỏ qua; phải cầm tờ giấy thật mới thấy. Phân hệ sau khi dựng lại được trình bày ở Chương 10 (mục 10.2 và 10.4).

### 8.4.1. Phép đối chiếu "ô giấy – trường máy"

Mỗi thành phần trên biểu mẫu giấy mang theo một quy tắc ngầm. Việc của người số hóa là gọi tên quy tắc ấy:

| Trên giấy | Trong phần mềm | Câu hỏi phải hỏi |
|---|---|---|
| Ô đánh dấu (x) | Lựa chọn có/không | Có được ghi điểm lẻ không? |
| Cột số người ghi | Ô số có trần, sàn | Mấy chữ số thập phân? |
| Dòng "Tổng cộng" | Ô tự tính, khóa | Ai được ghi đè? |
| Khối chữ ký | Trạng thái phê duyệt | Sửa sau khi ký thì sao? |
| Tiêu đề văn bản | Phần đầu tệp xuất | Văn bản Đảng hay hành chính? |
| Chỗ "…" để điền | Trường dữ liệu | Lấy từ đâu, ai điền? |

Văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức Đảng theo hướng dẫn thể thức riêng của Đảng. Phần mềm phải biết mình đang in loại nào; bảng bảy, tám cột thì chuyển sang khổ ngang cho vừa.

Sau khi sửa, tôi yêu cầu tác tử "nghiệm thu ngược": xuất tệp Word thật, dùng chương trình mở lại chính tệp ấy, liệt kê tiêu đề, khối thông tin, từng bảng, từng cột để đối chiếu với biểu mẫu. Đồng chí chỉ cần giao: "mở lại tệp vừa xuất và kể cho tôi trong đó có gì".

Sửa theo biểu mẫu nhưng không phá dữ liệu đã có: Nhóm A chuyển sang Đảm bảo/Không đảm bảo nhưng vẫn lưu dạng số (0 hoặc điểm tối đa) nên bản lưu cũ không vỡ; hồ sơ cũ được dựng lại kế hoạch từ mẫu theo chức danh, giữ nguyên phần đã chấm.

::: {.canhbao}
**Cảnh báo: dùng hồ sơ thật làm mẫu**

Hồ sơ kiểm điểm là tài liệu nội bộ của Đảng, lại chứa nhận xét, xếp loại của một người cụ thể. Theo phân loại 4 cấp của Tập 1 (mục 7.1–7.2), nó ít nhất là Cấp 2 Nội bộ; có thông tin cá nhân thì xếp Cấp 3 Hạn chế tiếp cận, chỉ được xử lý bằng AI có máy chủ trong nước hoặc AI tự triển khai.

Tệp mà tác tử AI đọc được gửi tới máy chủ của nhà cung cấp AI. Tôi để tác tử đọc hồ sơ của chính tôi, đặt trong thư mục bị chặn khỏi kho mã công khai bằng tệp `.gitignore`; đó là quyết định có cân nhắc với hồ sơ của bản thân, không phải cách nên nhân rộng. AI chỉ cần *cấu trúc* biểu mẫu (tiêu đề, cột, ô đánh dấu, khối chữ ký), nên hãy đưa bản trắng hoặc bản đã xóa hết nội dung, họ tên, nhận xét. Không bao giờ đưa hồ sơ của người khác lên kho mã hay vào dịch vụ AI công cộng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 8.4 — Đối chiếu biểu mẫu giấy với phần mềm**

```text
Vai: Đồng chí là tác tử AI lập trình đang làm việc trong kho mã của tôi.
Bối cảnh: Tôi gửi kèm biểu mẫu giấy đang dùng thật cho chức năng [tên chức năng], là bản trắng hoặc đã xóa hết nội dung, thông tin cá nhân.
Việc: Đối chiếu biểu mẫu với màn hình nhập và tệp xuất hiện có của phần mềm, lập bảng 4 cột: Thành phần trên biểu mẫu | Phần mềm hiện làm gì | Lệch hay khớp | Đề xuất sửa.
Dạng: Soát đủ tiêu đề và thể thức (văn bản Đảng hay hành chính), khối thông tin đầu, từng cột của từng bảng, ô đánh dấu, dòng tổng, khối chữ ký, khổ giấy.
Ràng buộc: Chưa sửa mã. Với mỗi đề xuất, nói rõ dữ liệu đã lưu theo cách cũ sẽ được nâng cấp thế nào để không mất phần đã chấm.
```
:::

## 8.5. Khi văn bản tự mâu thuẫn

Câu chữ chịu được sự thiếu nhất quán; phép tính thì không. Số hóa dự thảo Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã nhiệm kỳ 2026–2031 tới từng điểm thành phần, sáu chỗ chưa nhất quán tự lộ ra (Chương 11, mục 11.3 trình bày chi tiết):

| # | Vị trí | Dự thảo ghi | Phần mềm chuẩn hóa |
|---|---|---|---|
| 1 | Phụ lục II, III.3 | Ô 3,0đ ghi cả "đạt 3,0đ" lẫn "cộng thêm tối đa 3,0đ" | Tách 1,5 + 1,5 + 3,0 = 6,0đ |
| 2 | Phụ lục II, nhóm VIII | Bốn nội dung cộng 13đ, trần 10đ | Phân bổ lại 4 + 2 + 2 + 2 |
| 3 | Phụ lục I, IX.7 | Cột ghi −5, cách chấm ghi tối đa trừ 10 | Trần 10 theo cách chấm |
| 4 | Phụ lục II, IX.6 | Cột ghi −3, cách chấm ghi tối đa trừ 6 | Trần 6 theo cách chấm |
| 5 | Điều 6 | Đòi "điều kiện đổi mới sáng tạo", không nêu ngưỡng | Lượng hóa từ câu chữ nhóm V |
| 6 | Điều 6 | Khoản 1, 2 nhảy sang 5, 6 | Đánh số lại liền mạch 5 khoản |

### 8.5.1. "Chuẩn hóa có ghi chú": bốn nguyên tắc

Phần mềm không thể chờ văn bản sửa xong, nhưng cũng không được tự quyết thay cơ quan soạn thảo. Dự án đi con đường giữa mà tôi gọi là "chuẩn hóa có ghi chú":

1. **Lấy căn cứ ngay trong chính văn bản.** Tiêu chí III.3 được tách theo cách viết của tiêu chí I.1 cùng Phụ lục. Ở IX.7, để trần 5 thì cụm "tối đa trừ 10" thành vô nghĩa, nên theo cách chấm. Ngưỡng đổi mới sáng tạo lấy từ câu chữ nhóm V: cấp tỉnh "ít nhất 02 mô hình mới", cấp xã "ít nhất 01 mô hình mới". Không đem ý mình vào.
2. **Giữ tổng và thứ tự ưu tiên của người soạn.** Nhóm VIII được phân bổ lại cho đúng 10 điểm, giữ thứ tự ưu tiên của dự thảo.
3. **Ghi công khai.** Mỗi chỗ có hai dòng "dự thảo ghi gì" và "đã chuẩn hóa thế nào", hiện ngay trong ứng dụng và tại từng tiêu chí liên quan.
4. **Kiến nghị, không sửa thay.** Ghi chú kết thúc bằng lời đề nghị, ví dụ "Đề nghị sửa cột Điểm tối đa thành −10". Quyền sửa văn bản thuộc cơ quan soạn thảo.

Số hóa là một cách thẩm định văn bản; nhưng người thẩm định chỉ kiến nghị, người ban hành mới sửa. Đó cũng là tinh thần "AI tìm dấu hiệu — con người kết luận pháp lý" của Tập 1 (Chương 5) và Mô hình 1 "AI đề xuất, con người duyệt" trong ba mô hình con người trong vòng lặp (Tập 1, mục 7.5).

Văn bản *đã ban hành* mà câu chữ hiểu được nhiều cách thì AI liệt kê các cách hiểu và hệ quả, người chốt và ghi vào nhật ký dự án. Chẳng hạn, ô "bị kỷ luật" chỉ ép xếp loại, không trừ vào tổng điểm; công thức có thể cho "điểm cao mà xếp loại thấp" thì giữ nguyên, chỉ giải thích và hiện ô cảnh báo. Với bản demo, người chốt là tôi; với hệ thống chính thức, phải là cấp có thẩm quyền, bằng văn bản.

Tập 1 (mục 5.3) đã có quy trình rà soát tính thống nhất nội tại với bảng kiểm 8 điểm; với văn bản có thang điểm, thêm một phép thử là bắt câu chữ chạy thành phép tính. Dự thảo chưa công bố thường thuộc Cấp 2 Nội bộ: chỉ đưa vào AI có cam kết bảo mật dành cho doanh nghiệp, tổ chức, sau khi ẩn danh thông tin cá nhân (Tập 1, mục 7.2).

::: {.lenhmau}
**Câu lệnh mẫu 8.5 — Rà soát tính nhất quán của dự thảo bằng phép tính**

```text
Tôi gửi kèm dự thảo [tên văn bản] có bảng tiêu chí, thang điểm. Hãy kiểm tra và lập bảng các chỗ chưa nhất quán:
1. Tổng điểm thành phần có bằng điểm tối đa của tiêu chí, của nhóm không?
2. Con số ở cột "điểm tối đa" có khớp lời văn ở cột "cách chấm" không?
3. Các ngưỡng xếp loại có liền mạch, không chồng lấn, không bỏ trống khoảng nào không?
4. Điều, khoản, điểm có đánh số liên tục không? Chỗ dẫn chiếu có tồn tại không?
5. Điều kiện nào được nhắc tới nhưng chưa có tiêu chí đo?
Mỗi dòng ghi: vị trí | dự thảo ghi gì | vì sao chưa nhất quán | các phương án chuẩn hóa, ưu tiên phương án có căn cứ ngay trong văn bản. Không tự chọn phương án; tôi sẽ trình người có thẩm quyền.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Khi cán bộ trình một phần mềm số hóa văn bản, hãy hỏi: "Chỗ nào văn bản chưa rõ mà phần mềm đã tự chọn cách hiểu? Danh sách ở đâu?"
- Mâu thuẫn phần mềm phát hiện là cơ hội hoàn thiện dự thảo trước khi ban hành; nên mời người số hóa góp ý.
- Không giao cho cán bộ kỹ thuật, càng không giao cho AI, việc tự quyết cách hiểu một quy định.
- Khi văn bản căn cứ thay đổi, giao rõ ai rà lại phần mềm và hạn hoàn thành.
:::

## 8.6. Sản phẩm khả dụng tối thiểu, phiên bản thử nghiệm và ý kiến người dùng

Sản phẩm khả dụng tối thiểu (minimum viable product, MVP) là phiên bản nhỏ nhất mà người dùng thật dùng được cho một việc thật, đủ để biết điều gì đúng, điều gì sai, giống mô hình thí điểm trước khi nhân rộng. Nhìn lại, phần tối thiểu của phân hệ đánh giá OKR/KPI là một chuỗi khép kín: chấm Nhóm I và Nhóm II, tính tổng, xếp loại, phê duyệt, xuất phiếu Word; mọi thứ khác có thể để sau. Suốt quá trình, toàn hệ thống mang nhãn "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu".

Tối thiểu còn là đúng mức chi tiết. Lần đầu, Nhóm B của phân hệ Kiểm điểm có mười ô nhập cho mỗi sản phẩm (cấp trình, tiến độ, hệ số, số lượng, các tỷ lệ…). Dùng thử thấy quá nặng cho người ghi, nên rút còn tên nhiệm vụ, mức độ hoàn thành, tầm quan trọng; đến khi đối chiếu biểu mẫu giấy (mục 8.4) lại bổ sung đúng những cột bản giấy có. Mức chi tiết đúng đến từ dùng thử và đối chiếu, không từ suy đoán.

::: {.cauchuyen}
**Câu chuyện thực tế: gỡ bỏ hai giao diện**

Có thời điểm hệ thống có ba giao diện chọn ở màn đăng nhập: Cổ điển (đỏ), Mới (nền tối), PRO (trắng đen). AI làm thêm phiên bản rất nhanh, còn chi phí bảo trì tích lũy âm thầm: mỗi tính năng làm ba lần; đổi bản là có nguy cơ ghi đè mất danh mục công việc của bản kia; trang tải nặng.

Tôi gỡ hẳn bản Mới và PRO, chỉ giữ một giao diện; mã cũ vẫn nằm trong lịch sử kho mã nguồn. Gói mã chính giảm từ 639 kB xuống khoảng 181 kB khi chuyển hai bản sang tải theo nhu cầu, còn khoảng 178 kB sau khi gỡ hẳn. Các bộ tiêu chí thử nghiệm (Cổ điển, Cải tiến, Singapore) dồn về một "Phòng thử nghiệm" riêng; ý nào đã chín mới đưa vào bản đang vận hành (Chương 9, mục 9.4).
:::

Ý kiến người dùng thường đến dưới dạng một câu "sao lại thế này". So tài khoản khách với tài khoản quản trị thấy hai danh sách cán bộ khác nhau, từ đó có nguyên tắc "dữ liệu mẫu là dữ liệu chính thống"; mở phân hệ Kiểm điểm không thấy 15 đồng chí, từ đó mỗi phân hệ có kho dữ liệu riêng (Chương 12, mục 12.5). Muốn ý kiến đến đều thì phải có chỗ ghi: trang Hướng dẫn có ô gửi góp ý; ở phân hệ Sổ tay AI, câu hỏi mẫu nào sai được đánh dấu "Cần sửa lại".

::: {.thuchanh}
**Thực hành: hai tuần thu ý kiến cho một bản thử nghiệm**

1. Chọn 3–5 người dùng thật, mỗi vai ít nhất một người: người tự đánh giá, người duyệt, người chỉ xem.
2. Giao một kịch bản việc thật, chạy trên dữ liệu mô phỏng, không dùng dữ liệu cá nhân thật.
3. Ngồi cạnh, không giải thích; ghi lại chỗ người dùng dừng, hỏi lại, bấm nhầm.
4. Ghi sổ ý kiến bốn cột: Ai (vai) | Hiện tượng | Mong muốn | Quyết định.
5. Phân loại: lỗi phải sửa; hiểu sai nghiệp vụ (quay lại mục 8.1); mong muốn thêm (xếp hàng chờ); ngoài phạm vi (ghi lý do từ chối).
6. Cuối tuần thứ hai, họp 30 phút: chọn tối đa ba việc làm tiếp và ít nhất một thứ gỡ bỏ.
:::

Làm thêm thì dễ, bớt đi mới cần quyết tâm của người chủ: thứ không ai dùng vẫn tốn công bảo trì và vẫn là chỗ sinh lỗi.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Khi duyệt một bản thử nghiệm, hãy hỏi: "Việc tối thiểu bản này phải làm trọn là gì? Phần nào cố ý để sau?"
- Yêu cầu bản thử nghiệm mang nhãn "bản demo" và chạy trên dữ liệu mô phỏng cho tới khi được phép dùng dữ liệu thật.
- Giao người dùng thật dùng thử có thời hạn; đọc sổ ý kiến, không chỉ nghe báo cáo.
- Ủng hộ việc gỡ bỏ chức năng ít dùng: đó là tiết kiệm công bảo trì, không phải phí công sức.
:::

## Tóm tắt chương 8

::: {.tomtat}
1. Đọc văn bản quy định theo sáu lớp: chủ thể, quy trình, công thức, biểu mẫu, thời hạn, thẩm quyền; mỗi lớp thành một bộ phận của phần mềm.
2. Chữ chỉ ngưỡng, mẫu số, cách làm tròn, đơn vị thời gian là các quyết định; chỗ văn bản chưa rõ phải hỏi người có thẩm quyền và ghi lại.
3. Bảng tính mô phỏng là sa bàn và bộ ca kiểm thử; dữ liệu mẫu phải chạm các mép; đổi phương pháp thì sửa bảng tính trước.
4. Đặc tả viết cùng AI theo lối "hỏi trước, viết sau", có phản biện bằng vai khác; căn cứ pháp lý phải ghi tình trạng hiệu lực và ngày kiểm tra.
5. Biểu mẫu giấy đang dùng thật là đặc tả trung thực nhất; đối chiếu từng ô, nghiệm thu ngược trên tệp xuất ra, và chỉ đưa AI bản trắng hoặc đã xóa thông tin cá nhân.
6. Khi văn bản tự mâu thuẫn, phần mềm "chuẩn hóa có ghi chú" và kiến nghị, không sửa thay cơ quan soạn thảo.
7. Bắt đầu bằng sản phẩm khả dụng tối thiểu, thu ý kiến có tổ chức, và định kỳ gỡ bỏ phần thừa.
:::

## Câu hỏi suy ngẫm và bài tập

1. Dùng Câu lệnh mẫu 8.1 bóc tách sáu lớp một văn bản đơn vị đồng chí đang thực hiện, rồi đối chiếu ít nhất năm trích dẫn Điều, khoản với bản gốc. AI dẫn sai bao nhiêu chỗ?
2. Trong văn bản ấy, tìm ba chữ chỉ ngưỡng, mẫu số hoặc đơn vị thời gian. Mỗi chữ hiểu được theo mấy cách? Ai có thẩm quyền chốt?
3. Dựng bảng tính mô phỏng với tám hồ sơ giả định, có tình huống chạm trần hoặc chạm ngưỡng. Bảng tính "tự đặt" câu hỏi nào mà đồng chí chưa nghĩ tới?
4. Lấy một biểu mẫu giấy của đơn vị, lập bảng "ô giấy – trường máy". Ô nào mang quy tắc ngầm mà văn bản hướng dẫn không ghi?
5. Nếu được gỡ bỏ một chức năng trong phần mềm đang dùng, đồng chí gỡ chức năng nào, vì sao, hỏi ý kiến ai trước?
