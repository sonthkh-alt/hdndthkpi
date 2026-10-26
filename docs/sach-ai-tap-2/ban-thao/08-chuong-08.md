# Chương 8. Từ văn bản quy phạm đến đặc tả phần mềm

::: {.muctieu}
**Mục tiêu của chương**

- Đọc một văn bản quy định theo sáu lớp "bản vẽ": chủ thể, quy trình, công thức, biểu mẫu, thời hạn, thẩm quyền; nhận ra những chữ nhỏ dễ làm phần mềm tính sai.
- Biết dựng bảng tính mô phỏng làm "sa bàn" và biến nó thành bộ ca kiểm thử trước khi giao tác tử AI viết phần mềm.
- Viết được bản đặc tả yêu cầu bằng tiếng Việt cùng AI, theo một mẫu dàn ý dùng được ngay.
- Biết đối chiếu biểu mẫu giấy với màn hình, và xử lý đúng mực khi văn bản tự mâu thuẫn.
- Hiểu sản phẩm khả dụng tối thiểu, cách thu ý kiến người dùng và vì sao phải dám gỡ bỏ phiên bản thừa.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ toàn chương); lãnh đạo nên đọc mục 8.1, 8.5 và các hộp "Dành cho lãnh đạo".
:::

Sau vài tháng làm việc cùng tác tử AI lập trình, tôi nhận ra một điều mà lúc bắt đầu không ai nói với tôi: phần khó nhất không nằm ở mã nguồn. Tác tử có thể dựng một màn hình chấm điểm trong vài phút. Nhưng nếu tôi hiểu sai một chữ trong quy định, cái màn hình ấy sẽ chấm sai cho cả cơ quan, nhanh và đều tay như nhau.

Văn bản quy định là ngôn ngữ của con người. Nó có độ co giãn: "trở lên", "kịp thời", "cơ bản", "theo quy định". Phần mềm là ngôn ngữ của máy, không chấp nhận co giãn. Máy cần biết 89,99 điểm thuộc mức nào, mẫu số là tổng số người hay số người có mặt, tháng 9 là "kỳ tháng 9" hay "Quý III". Đứng giữa hai thứ ngôn ngữ đó phải có một người phiên dịch. Người phiên dịch tốt nhất không phải kỹ sư phần mềm, mà là cán bộ hiểu nghiệp vụ.

Trong chương này, tôi dùng chữ "văn bản quy phạm" theo nghĩa rộng: mọi văn bản đặt ra quy tắc mà phần mềm phải làm theo. Đó có thể là nghị định, quy định của Tỉnh ủy, hướng dẫn, khung tiêu chí, kể cả dự thảo. Chất liệu là chính những văn bản mà hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) đã số hóa trong năm 2026, cùng những lần tôi phiên dịch sai và phải sửa.

## 8.1. Đọc một văn bản quy định như đọc một bản thiết kế

Người làm xây dựng không đọc một bộ bản vẽ từ trang đầu đến trang cuối như đọc truyện. Họ tách ra bản vẽ kiến trúc, bản vẽ kết cấu, bản vẽ điện nước, rồi đối chiếu chéo giữa các lớp. Văn bản quy định cũng vậy. Đọc để thi hành thì đọc tuần tự là đủ. Đọc để số hóa thì phải tách lớp, vì mỗi lớp sẽ trở thành một bộ phận khác nhau của phần mềm.

### 8.1.1. Sáu lớp của một văn bản quy định

Qua việc số hóa công tác đánh giá, xếp loại cán bộ, công chức (CBCC), tôi rút ra sáu lớp cần bóc tách. Bảng dưới đây lấy ví dụ từ Nghị định 335/2025/NĐ-CP của Chính phủ về đánh giá, xếp loại chất lượng cơ quan hành chính nhà nước và công chức, cùng Quy định 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa.

| Lớp | Câu hỏi đặt ra | Ví dụ | Thành gì trong phần mềm |
|---|---|---|---|
| Chủ thể | Ai bị điều chỉnh, chia nhóm ra sao? | Lãnh đạo; công chức; lao động hợp đồng | Thuộc tính "nhóm đối tượng" của mỗi người |
| Quy trình | Ai làm gì, theo thứ tự nào? | Tự đánh giá, nhận xét, quyết định, công khai | Các trạng thái của phiếu |
| Công thức | Tính thế nào, làm tròn ra sao? | 30 + 70 điểm; (a+b+c)/3; trừ 25% mỗi lần | Hàm tính điểm |
| Biểu mẫu | Ghi vào đâu, in ra sao? | Phiếu theo dõi, bảng tổng hợp | Màn hình nhập, tệp Word, Excel |
| Thời hạn | Khi nào, theo chu kỳ nào? | Trước ngày 28; tháng 12 trước 15/12 | Kỳ đánh giá, nhắc hạn, khóa sổ |
| Thẩm quyền | Ai đề xuất, ai quyết định? | Cấp trực tiếp đề xuất, cấp quản lý quyết định | Vai trò, nút phê duyệt |

**Lớp chủ thể.** Câu hay nhất trong bản đặc tả yêu cầu phần mềm của dự án (sẽ bàn kỹ ở mục 8.3) nằm ở lớp này: nhóm đối tượng là thuộc tính của người dùng, gán theo vị trí việc làm, không phải thuộc tính của danh mục công việc. Một câu ngắn, nhưng nó quyết định cách tổ chức toàn bộ dữ liệu. Trong bản đang vận hành, "Mẫu" của mỗi người tự suy ra từ chức vụ: Chánh, Phó Chánh Văn phòng thuộc Mẫu 01; Trưởng, Phó Trưởng phòng thuộc Mẫu 02; chuyên viên thuộc Mẫu 03; lao động hợp đồng thuộc Mẫu 04. Không ai phải chọn tay, nên không ai chọn nhầm.

**Lớp quy trình.** Quy trình không chỉ là thứ tự các màn hình, mà là thứ tự dữ liệu sẵn sàng. Bản đặc tả ghi rõ: thứ tự tính điểm đi từ dưới lên, tính xong cấp dưới mới tính được các thành phần d, đ, e của lãnh đạo; còn luồng phê duyệt đi từ trên xuống theo phân cấp. Nếu chỉ đọc lướt, rất dễ làm ngược.

**Lớp công thức.** Theo khoản 2 Điều 14 Nghị định 335/2025/NĐ-CP, kết quả thực hiện nhiệm vụ được đo bằng tỷ lệ phần trăm về số lượng (a), chất lượng (b) và tiến độ (c) của sản phẩm đã quy đổi. Công chức không giữ chức vụ lãnh đạo tính (a+b+c)/3. Khoản 5 Điều 5 Quy định 1053-QĐ/TU nêu: mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ trường hợp có nguyên nhân khách quan được xác nhận. Viết thành con số: giao 10 văn bản, một văn bản có sai sót lớn thì b = (9 × 100 + 1 × 75) / 10 = 97,5%.

**Lớp biểu mẫu.** Bản đặc tả yêu cầu phần mềm phải sinh đúng các phụ lục của Quy định: phiếu theo dõi theo từng nhóm đối tượng, danh sách tổng hợp, thông báo công khai. Biểu mẫu là nơi người dùng nhìn thấy kết quả, cũng là nơi dễ lộ sai nhất (mục 8.4).

**Lớp thời hạn.** Điều 10 Quy định 1053-QĐ/TU yêu cầu đánh giá, xếp loại theo tháng, hoàn thành trước ngày 28 hằng tháng; riêng tháng 12 hoàn thành trước 15/12. Phần mềm biến các mốc này thành "kỳ đánh giá", lời nhắc và thời điểm khóa sổ.

**Lớp thẩm quyền.** Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương, tại điểm 2.2, phân rõ: cấp trực tiếp sử dụng cán bộ nhận xét, đánh giá, đề xuất mức xếp loại; cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt. Trong phần mềm, điều đó thành hai cột "Tự đánh giá" và "Cấp duyệt" cho từng điểm số, cùng một nút "Phê duyệt" chỉ người có thẩm quyền mới bấm được. Sửa điểm sau khi đã phê duyệt thì phê duyệt tự động bị gỡ, vì người duyệt đã duyệt một con số khác.

::: {.phaply}
**Căn cứ pháp lý: chủ trương ứng dụng công nghệ số trong đánh giá cán bộ**

- Nghị định 335/2025/NĐ-CP (ban hành 21/12/2025, hiệu lực 01/01/2026): Điều 4 nêu nguyên tắc ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại; thang 100 điểm gồm tiêu chí chung tối đa 30 điểm và kết quả thực hiện nhiệm vụ tối đa 70 điểm.
- Quy định 1053-QĐ/TU ngày 05/6/2026, khoản 4 Điều 3: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Đồng chí nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc bản gốc lưu tại cơ quan trước khi dùng làm căn cứ.
:::

### 8.1.2. Những chữ nhỏ quyết định đúng sai

Trong sáu lớp, lớp công thức nguy hiểm nhất, và nguy hiểm nằm ở những chữ rất nhỏ. Dưới đây là các chữ đã từng làm dự án vấp, hoặc suýt vấp.

**"Không hoàn thành".** Quy định 1053-QĐ/TU, tại Điều 8, xếp loại "Không hoàn thành nhiệm vụ" đối với người không giữ chức vụ có trên 50% nhiệm vụ không hoàn thành. Muốn máy đếm được, phải trả lời trước một câu: thế nào là *một* nhiệm vụ không hoàn thành? Phiên bản đầu, AI tự chọn cách hiểu khắt khe nhất: cứ hoàn thành dưới 100% số lượng là "không hoàn thành". Hậu quả: một cán bộ làm được 9 trên 10 văn bản, điểm cao, vẫn bị ép xuống mức thấp nhất. Sau khi phát hiện, tôi chốt cách xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành, từ 50% đến dưới 100% là chưa đạt đủ số lượng, và phần mềm tách hai trường hợp này ra trong lời giải thích. Đó là cách hiểu tôi chọn cho bản thử nghiệm. Nếu dùng chính thức, một cách hiểu như vậy cần được cơ quan có thẩm quyền xác nhận hoặc hướng dẫn.

**"Quá nửa tổng số".** Luật Tổ chức chính quyền địa phương số 72/2025/QH15 quy định nghị quyết của Hội đồng nhân dân (HĐND) được thông qua khi quá nửa tổng số đại biểu biểu quyết tán thành. Mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm nút. Với 82 đại biểu HĐND tỉnh, quá nửa là từ 42 phiếu trở lên; hai phần ba là từ 55 phiếu trở lên, vì 82 × 2/3 = 54,67 phải làm tròn lên. Phân hệ Biểu quyết Online tính đúng theo cách này và nói rõ còn thiếu bao nhiêu phiếu.

**"Từ … đến dưới", "trở lên".** Theo Điều 20 Nghị định 335/2025/NĐ-CP, Hoàn thành xuất sắc nhiệm vụ từ 90 điểm trở lên, Hoàn thành tốt từ 70 đến dưới 90 điểm. Câu hỏi cho máy: 89,995 điểm làm tròn thành 90,00 rồi mới so ngưỡng, hay so ngưỡng rồi mới làm tròn? Văn bản không phải lúc nào cũng trả lời. Bản đặc tả của dự án chọn chuẩn "khớp đến 02 chữ số thập phân". Dù chọn thế nào, lựa chọn đó phải được viết ra.

**"Mỗi lần".** Mức trừ 25% áp cho từng sản phẩm, không cho cả lô; một sản phẩm bị trừ nhiều lần thì cộng dồn, thấp nhất bằng 0. Bản đặc tả ghi đủ cả ba ý này. Thiếu một ý, hai lập trình viên sẽ viết ra hai phần mềm cho hai kết quả.

**"Tháng" và "quý".** Phân hệ Kiểm điểm đánh giá theo quý, ô chọn quý ghi vào tháng cuối quý (3, 6, 9, 12), nhưng kỳ khởi tạo lại lấy đúng tháng hiện hành. Kết quả: tháng 8 và tháng 9, cùng thuộc Quý III, được ghi vào hai bản ghi khác nhau; sang tháng 9 mở ra thì mất phần đã chấm trong tháng 8. Cách sửa là quy mọi kỳ về tháng cuối quý. Bài học: mỗi đơn vị thời gian nghiệp vụ chỉ được có một cách quy đổi trong toàn hệ thống.

**"Trần 20%".** Khoản 7 Điều 3 Quy định 1053-QĐ/TU giới hạn số "Hoàn thành xuất sắc" không quá 20% số "Hoàn thành tốt". Mẫu số là số người xếp loại Hoàn thành tốt, không phải tổng số cán bộ. Đọc lướt rất dễ nhầm.

::: {.ghinho}
**Ghi nhớ**

Mỗi chữ chỉ ngưỡng, mẫu số, cách làm tròn hay đơn vị thời gian là một quyết định. Văn bản nói rõ thì phần mềm làm đúng như văn bản. Văn bản chưa nói rõ thì phải hỏi người có thẩm quyền và ghi lại câu trả lời; không để AI tự chọn rồi im lặng.
:::

### 8.1.3. Phiếu bóc tách văn bản

Tôi không tự bóc tách sáu lớp bằng tay từ đầu. Tôi giao cho AI làm bản nháp, rồi đọc lại từng trích dẫn với văn bản gốc. AI làm nhanh và ít bỏ sót câu chữ; người làm phần không thể bỏ: kiểm tra từng Điều, khoản mà AI dẫn có đúng hay không, và đánh dấu những chỗ cần xin ý kiến.

::: {.lenhmau}
**Câu lệnh mẫu 8.1 — Bóc tách văn bản quy định thành sáu lớp**

```text
Vai: Đồng chí là chuyên viên pháp chế kiêm phân tích nghiệp vụ, đang chuẩn bị số hóa một văn bản quy định thành phần mềm.
Bối cảnh: Tôi gửi kèm toàn văn [tên, số hiệu, ngày ban hành văn bản]. Đây là văn bản đã công khai. Phần mềm dùng để [mục đích, ví dụ: chấm điểm hằng tháng cho cán bộ một phòng].
Việc: Bóc tách văn bản thành 6 lớp: (1) chủ thể và cách chia nhóm; (2) quy trình, các bước, người làm từng bước; (3) công thức, ngưỡng, quy tắc làm tròn; (4) biểu mẫu đầu vào, đầu ra; (5) thời hạn, mốc, chu kỳ; (6) thẩm quyền đề xuất, quyết định, phê duyệt.
Dạng: Mỗi lớp một bảng 3 cột: Nội dung | Trích dẫn (Điều, khoản, điểm) | Ghi chú. Cuối cùng lập riêng bảng "Chỗ chưa rõ hoặc hiểu được nhiều cách": mỗi dòng nêu các cách hiểu và hệ quả về điểm số của từng cách.
Ràng buộc: Chỉ dùng câu chữ trong văn bản tôi gửi. Mỗi ý phải ghi Điều, khoản cụ thể. Chỗ nào văn bản không nói thì ghi "Văn bản không quy định", không suy đoán, không bổ sung từ trí nhớ.
```
:::

Bảng "chỗ chưa rõ" ở cuối là phần giá trị nhất. Nó là danh sách câu hỏi để đồng chí mang đi xin ý kiến trước khi một dòng mã nào được viết.

## 8.2. Bảng tính mô phỏng trước, phần mềm sau

Trước khi xây một công trình lớn, người ta làm sa bàn. Trước khi tổ chức một kỳ họp quan trọng, Văn phòng có buổi duyệt kịch bản. Với phần mềm tính điểm, sa bàn rẻ nhất và dễ hiểu nhất là một bảng tính.

::: {.cauchuyen}
**Câu chuyện thực tế: "bộ máy tính điểm" bằng Excel**

Tháng 7/2026, khi soạn bản đặc tả yêu cầu phần mềm đánh giá cán bộ theo KPI, tôi làm kèm một tệp Excel mang tên "Engine tính điểm KPI mô phỏng". Tệp có bảy trang tính, sắp theo đúng đường đi của dữ liệu: Hướng dẫn · Danh mục (48 dòng sản phẩm, công việc kèm điểm và hệ số quy đổi) · Nhân sự (tám cán bộ mang tên giả định, chia ba nhóm) · Tiêu chí chung · Giao việc (24 dòng nhiệm vụ của kỳ 07/2026) · KPI tổng hợp · Thống kê.

Hai quy ước nhỏ làm tệp dễ dùng hơn hẳn. Một là quy ước màu: chữ xanh là ô nhập liệu, chữ đen là công thức tự tính, không được sửa. Hai là cột "Nhóm" ở trang Nhân sự được gọi đúng tên là "công tắc": chọn nhóm lãnh đạo, quản lý thì công thức tự chuyển sang chia 6; chọn nhóm khác thì chia 3.

Bản đặc tả sau đó ghi tệp này là "bộ ca kiểm thử bắt buộc": với cùng dữ liệu đầu vào, kết quả của phần mềm phải trùng khớp kết quả của tệp Excel đến 02 chữ số thập phân.
:::

### 8.2.1. Vì sao là bảng tính

Bảng tính có bốn ưu điểm mà không công cụ nào khác ở cơ quan có đủ. Ai cũng đọc được, kể cả lãnh đạo không quen công nghệ. Công thức hiện ra trước mắt, bấm vào ô là thấy. Sửa một tham số mất vài giây, không cần triển khai lại gì. Và nó chạy trên máy của mình, không cần tài khoản, không đưa dữ liệu đi đâu.

Bảng tính còn một tác dụng ít ai để ý: nó buộc người làm phải viết công thức ra thành chữ. Muốn trang Giao việc tự lấy hệ số, phải có cột "Mã sản phẩm" để tra sang trang Danh mục. Tức là chính bảng tính đã chỉ ra rằng phần mềm sau này cần một danh mục có mã, chứ không thể để mỗi người tự gõ tên nhiệm vụ theo ý mình.

Nhưng bảng tính cũng có giới hạn. Chính tệp mô phỏng của dự án tự ghi ở trang Hướng dẫn rằng các điều kiện phụ tại Điều 8 được "kiểm tra thủ công/trong phần mềm". Điều kiện xét theo từng nhiệm vụ, như "mọi nhiệm vụ phải hoàn thành" hay "ít nhất 30% nhiệm vụ vượt mức", rất khó viết gọn trong ô Excel. Tôi coi dòng ghi chú ấy là một đức tính: bảng tính nói thật nó không làm được gì.

| Việc | Bảng tính | Phần mềm |
|---|---|---|
| Thử công thức, đổi tham số | Rất nhanh | Chậm hơn |
| Nhiều người cùng nhập | Dễ ghi đè nhau | Phân quyền, lưu vết |
| Điều kiện xét từng nhiệm vụ | Khó, dễ sai | Viết và kiểm thử được |
| Làm chuẩn đối chiếu | Rất tốt | Cần chính bảng tính |
| Lưu theo kỳ, so sánh các kỳ | Làm tay | Tự động |

### 8.2.2. Khi sa bàn tự đặt câu hỏi

Khi đọc lại tệp mô phỏng để viết chương này, tôi để ý một chi tiết. Với dữ liệu mẫu, cả tám cán bộ giả định đều đạt từ 90 điểm, đều xếp loại A. Số người Hoàn thành tốt bằng 0, nên trần 20% cũng bằng 0. Trang Thống kê lập tức báo: "VƯỢT TRẦN: phải xét lại theo điểm từ cao xuống thấp".

Bảng tính không sai. Nó đang đặt ra một câu hỏi nghiệp vụ thật: khi cả cơ quan làm tốt, trần "không quá 20% số Hoàn thành tốt" vận hành thế nào? Nếu tính trần trước rồi mới hạ mức, trần bằng 0 và không ai được xếp xuất sắc. Nếu hạ cả tám người xuống Hoàn thành tốt trước rồi mới tính, trần thành 20% của 8, làm tròn xuống được 1 người. Hai thứ tự tính, hai kết quả. Đây là việc của người có thẩm quyền quyết định, không phải việc của máy. Bản đặc tả đã đi đúng hướng khi ghi: vượt trần thì xếp theo điểm từ cao xuống thấp, các trường hợp bằng điểm đưa ra cấp có thẩm quyền quyết định.

Chuyện làm tròn cũng vậy. Tệp mô phỏng làm tròn xuống. Trong khi đó, Hướng dẫn 02-HD/BTCTW, áp dụng cho đánh giá định kỳ hằng quý cán bộ lãnh đạo, quản lý, ghi tại điểm 6.2 rằng tỷ lệ "Hoàn thành xuất sắc" làm tròn từ 0,5 lên 1. Hai văn bản, hai phạm vi, hai cách làm tròn. Phần mềm phải biết mình đang chạy theo văn bản nào.

Bài học tôi rút ra: dữ liệu mẫu phải được *chọn* để chạm vào các mép, không phải để mọi thứ đều "Đạt". Một bảng tính lúc nào cũng báo đạt thì không dạy được ta điều gì.

### 8.2.3. Biến bảng tính thành bộ ca kiểm thử

Bộ ca kiểm thử, hay chuẩn đối chiếu (test oracle), là tập hợp các trường hợp đã biết trước đáp án. Ví von cho dễ hiểu: trước khi giao máy tính bỏ túi mới cho kế toán, ta bấm thử vài phép tính đã biết kết quả. Phần mềm tính điểm cũng phải qua bước thử ấy, và bảng tính chính là nơi giữ đáp án.

::: {.thuchanh}
**Thực hành: dựng bộ ca kiểm thử từ bảng tính**

1. Chọn 6–8 hồ sơ giả định (tên giả, tuyệt đối không dùng người thật), phủ đủ các trường hợp: một người bình thường; người đúng 90, 70, 50 điểm và người sát dưới mỗi ngưỡng; một lãnh đạo (công thức khác); một người có sai sót và chậm tiến độ; một kỳ không có nhiệm vụ nào; một tình huống nhiều người cùng xuất sắc để chạm trần.
2. Tính bằng bảng tính, ghi cột "kết quả mong đợi". Nhờ một đồng nghiệp tính tay lại ít nhất hai hồ sơ.
3. Lưu bảng tính cùng bản đặc tả, đặt tên kèm ngày (ví dụ "ca-kiem-thu-2026-07-15.xlsx").
4. Khi giao tác tử AI viết phần mềm, đưa bảng tính và yêu cầu viết phép kiểm tự động so khớp kết quả đến 2 chữ số thập phân.
5. Mỗi lần đổi phương pháp tính, sửa bảng tính và đáp án trước, rồi mới sửa phần mềm.
:::

Bước 5 tôi học được bằng trải nghiệm. Về sau, bản vận hành của phân hệ đánh giá OKR/KPI chuyển Nhóm II từ cách đếm số lần sai sót, số lần chậm sang cách chọn mức: chất lượng ba mức (100%, 75%, 50%), tiến độ ba mức (100%, 80%, 50%), rồi Kết quả nhiệm vụ = (Số lượng + Chất lượng + Tiến độ)/3. Dữ liệu cũ được tự quy đổi sang mức mới để không vỡ. Khi phương pháp đổi, bảng tính cũ không còn là chuẩn cho bản mới. Bảng tính là chuẩn của *một* phương pháp tại *một* thời điểm, không phải chuẩn vĩnh viễn.

::: {.lenhmau}
**Câu lệnh mẫu 8.2 — Dựng bảng tính mô phỏng từ văn bản**

```text
Vai: Đồng chí là chuyên viên tổng hợp giỏi Excel, quen nghiệp vụ đánh giá cán bộ.
Bối cảnh: Tôi gửi kèm phiếu bóc tách 6 lớp của [tên văn bản] (đã đối chiếu bản gốc). Tôi cần một bảng tính mô phỏng để thử cách tính trước khi làm phần mềm.
Việc: Thiết kế một tệp Excel gồm các trang: Hướng dẫn; Danh mục (có mã); Nhân sự (có cột nhóm đối tượng); Dữ liệu đầu vào của kỳ; Tổng hợp điểm; Thống kê và kiểm soát trần. Viết công thức cho từng cột tính, có giải thích bằng lời.
Dạng: Mô tả từng trang: tên cột, cột nào nhập tay (tô chữ xanh), cột nào là công thức (chữ đen), công thức cụ thể. Kèm 8 hồ sơ giả định chạm đủ các ngưỡng và tình huống biên, và bảng kết quả mong đợi.
Ràng buộc: Chỉ dùng công thức và ngưỡng có trong phiếu bóc tách. Điều kiện nào không viết được bằng công thức Excel thì liệt kê riêng ở trang Hướng dẫn với ghi chú "kiểm tra thủ công". Không dùng họ tên người thật.
```
:::

## 8.3. Viết đặc tả yêu cầu bằng tiếng Việt cùng AI

Đặc tả yêu cầu phần mềm (software requirements specification) giống hồ sơ mời thầu của một công trình: nó nói rõ cần *cái gì* và thế nào là *đúng*, không nói phải xây bằng gì. Nhiều người nghĩ: đã có AI viết mã thì cần gì đặc tả. Tôi nghĩ ngược lại. Không có đặc tả, mỗi câu lệnh chỉ là một mảnh rời; chỗ nào mảnh này không nói, AI sẽ tự đoán để lấp vào. Có đặc tả, tác tử đọc lại được ở mọi phiên làm việc, giống như bộ nhớ dự án đã bàn ở Chương 7.

### 8.3.1. Bản đặc tả thật của dự án

Bản đặc tả yêu cầu phần mềm đánh giá, xếp loại cán bộ theo KPI của Văn phòng được soạn tháng 7/2026, ghi rõ là tài liệu gửi đơn vị phát triển phần mềm. Bố cục bảy chương:

1. Giới thiệu chung: mục đích, căn cứ, thuật ngữ, nguyên tắc thiết kế xuyên suốt.
2. Người dùng và phân quyền: năm vai trò, cây thẩm quyền đánh giá theo bảy khối cơ quan, đăng nhập một lần qua định danh điện tử.
3. Chín nhóm yêu cầu chức năng: danh mục; hồ sơ nhân sự; lập kế hoạch, giao việc; cập nhật kết quả, minh chứng; tính điểm; quy trình 5 bước; giải quyết kiến nghị; báo cáo, biểu mẫu; liên thông.
4. Yêu cầu phi chức năng, đều đo được: phản hồi thao tác thông thường không quá 03 giây; tự chấm của một người không quá 10 phút; chịu tải cao điểm các ngày 24–28 hằng tháng.
5. Mô hình dữ liệu tối thiểu sáu bảng.
6. Thuật toán tính điểm, viết thành công thức từng bước.
7. Lộ trình ba giai đoạn (thí điểm 03 tháng tại một số cơ quan, hoàn thiện và liên thông, triển khai diện rộng) và tiêu chí nghiệm thu.

Ba chỗ trong bản đặc tả mà tôi muốn đồng chí học theo. Thứ nhất, một nguyên tắc thiết kế khóa chặt phạm vi: toàn bộ khác biệt giữa ba nhóm đối tượng chỉ được xử lý tại ba điểm, gồm phần danh mục được phép chọn, mẫu phiếu tiêu chí chung và công thức tính KPI. Câu này ngăn sự khác biệt "rải" khắp phần mềm. Thứ hai, bản đặc tả mượn đúng chữ của văn bản cấp trên: mỗi nhiệm vụ giao phải bảo đảm "sáu rõ: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền" (điểm 1.2 Hướng dẫn 02-HD/BTCTW). Thứ ba, tiêu chí nghiệm thu đo được: khớp tệp Excel đến 02 chữ số thập phân.

Cũng phải nói thật: bản đặc tả viết cho một hệ thống chính thức quy mô toàn tỉnh. Bản demo của tôi chỉ làm phần lõi. Đăng nhập một lần qua định danh điện tử, cây thẩm quyền bảy khối, liên thông với hệ thống quản lý văn bản đều chưa làm; hai mục kết nối còn để ở trạng thái "chờ cấu hình". Đặc tả là đích đến; bản demo là bước đầu (mục 8.6).

::: {.canhbao}
**Cảnh báo: căn cứ trong đặc tả cũng có "hạn sử dụng"**

Khi rà lại bản đặc tả để viết chương này, tôi thấy phần căn cứ và phần an toàn thông tin dẫn Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Nhưng theo khoản 2 Điều 42 Nghị định 356/2025/NĐ-CP, Nghị định 13/2023/NĐ-CP đã hết hiệu lực từ 01/01/2026. Căn cứ đúng tại thời điểm soạn đặc tả là Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, cùng có hiệu lực từ 01/01/2026.

Một ví dụ khác đang ở phía trước: Quy định 366-QĐ/TW ngày 30/8/2025 của Bộ Chính trị về kiểm điểm, đánh giá, xếp loại chất lượng là một căn cứ của phân hệ Kiểm điểm. Quy định này sẽ được thay thế bởi Quy định 227-QĐ/TW ngày 19/10/2026, có hiệu lực từ 01/01/2027. Đến thời điểm viết, phần mềm chưa cập nhật theo văn bản mới.

Vì vậy, bảng căn cứ trong đặc tả nên có thêm ba cột: tình trạng hiệu lực, ngày kiểm tra, người kiểm tra. Và những gì có thể đổi theo văn bản (ngưỡng, trần, tiêu chí) nên là cấu hình, không đóng cứng trong mã.
:::

### 8.3.2. Mẫu dàn ý đặc tả cho một ứng dụng của cơ quan

Với ứng dụng nhỏ do cán bộ tự làm, đặc tả không cần dài như hồ sơ mời thầu. Mười hai mục dưới đây, mỗi mục kèm một câu hỏi tự kiểm tra, thường gói gọn trong 5–10 trang:

1. **Mục đích, phạm vi**: giải quyết việc gì, cho ai, và *không* làm gì. Có nói được trong một câu không?
2. **Căn cứ**: số hiệu, ngày, tình trạng hiệu lực. Đã tra ngày nào?
3. **Thuật ngữ**: định nghĩa những chữ dễ hiểu sai. "Không hoàn thành" nghĩa là gì?
4. **Người dùng, quyền**: ai xem, ai sửa, ai duyệt. Khách thấy gì?
5. **Quy trình, mốc thời gian**: các bước, thứ tự, hạn. Quá hạn thì sao?
6. **Chức năng**: danh sách việc phần mềm làm. Chức năng nào cũng có người thật cần?
7. **Công thức**: viết từng bước, kèm ví dụ số. Đã có ca kiểm thử chưa?
8. **Biểu mẫu đầu ra**: phiếu, bảng, tệp xuất. Đúng thể thức chưa?
9. **Dữ liệu, bảo mật**: từng trường dữ liệu thuộc vùng ĐỎ, VÀNG hay XANH. Có dữ liệu cá nhân không?
10. **Yêu cầu phi chức năng**: tốc độ, thiết bị, chi phí tối đa. Đo bằng gì?
11. **Nghiệm thu**: tiêu chí và bộ ca kiểm thử. Ai nghiệm thu?
12. **Lộ trình**: thí điểm, mở rộng, chuyển giao. Khi nào dừng?

Mục 1 và mục 12 hay bị bỏ qua nhất. Ghi rõ "không làm gì" giúp tác tử AI không tự ý mở rộng; ghi rõ "khi nào dừng" giúp người làm không ôm mãi một bản demo.

### 8.3.3. Quy trình năm bước viết đặc tả cùng AI

1. **Gom tài liệu**: văn bản bản điện tử có lớp chữ (bản chụp phải qua nhận dạng và đọc soát), biểu mẫu, bảng tính mô phỏng, phiếu bóc tách ở mục 8.1.
2. **AI hỏi trước, viết sau**: yêu cầu AI liệt kê câu hỏi về những chỗ chưa rõ. Người trả lời; câu nào phải xin ý kiến thì ghi "chờ quyết định".
3. **AI viết theo dàn ý**: mỗi yêu cầu đánh số (YC-01, YC-02…), có trích dẫn căn cứ.
4. **Phản biện bằng vai khác**: cho AI đóng vai đơn vị phát triển phần mềm, rồi vai cán bộ thanh tra, tìm chỗ mơ hồ, mâu thuẫn, không kiểm thử được.
5. **Người chốt và lưu**: lưu đặc tả cùng bảng tính trong kho mã nguồn, ghi ngày, phiên bản; mỗi lần sửa ghi vào nhật ký thay đổi.

::: {.lenhmau}
**Câu lệnh mẫu 8.3 — Soạn đặc tả: hỏi trước, viết sau**

```text
Vai: Đồng chí là chuyên gia phân tích nghiệp vụ, soạn đặc tả yêu cầu phần mềm cho cơ quan nhà nước.
Bối cảnh: Tôi gửi kèm: (1) phiếu bóc tách 6 lớp của [tên văn bản]; (2) bảng tính mô phỏng; (3) biểu mẫu giấy đang dùng (đã xóa thông tin cá nhân). Ứng dụng phục vụ [đối tượng, quy mô], là bản thử nghiệm nội bộ.
Việc: Bước 1: CHƯA viết đặc tả. Hãy liệt kê tối đa 20 câu hỏi về những chỗ chưa rõ, xếp theo mức ảnh hưởng tới kết quả tính toán. Dừng lại chờ tôi trả lời.
Bước 2 (sau khi tôi trả lời): viết đặc tả theo 12 mục: mục đích, phạm vi; căn cứ; thuật ngữ; người dùng, quyền; quy trình, mốc; chức năng; công thức; biểu mẫu; dữ liệu, bảo mật; phi chức năng; nghiệm thu; lộ trình.
Dạng: Tiếng Việt hành chính, mỗi yêu cầu đánh số YC-xx, ghi căn cứ Điều, khoản. Câu nào tôi trả lời "chờ quyết định" thì giữ nguyên nhãn đó.
Ràng buộc: Không thêm chức năng ngoài phạm vi tôi nêu. Không tự bổ sung căn cứ pháp lý từ trí nhớ; cần căn cứ nào thì ghi "[cần tra cứu]".
```
:::

::: {.lenhmau}
**Câu lệnh mẫu 8.4 — Phản biện đặc tả bằng hai vai**

```text
Đọc bản đặc tả tôi gửi kèm, lần lượt đóng hai vai:
Vai 1 — Đơn vị phát triển phần mềm: chỉ ra mọi yêu cầu mơ hồ (hai lập trình viên có thể hiểu khác nhau), yêu cầu không kiểm thử được, và yêu cầu mâu thuẫn nhau. Với mỗi chỗ, đề xuất cách viết lại đo được.
Vai 2 — Cán bộ thanh tra: chỉ ra chỗ phần mềm có thể tự quyết thay người có thẩm quyền, chỗ dữ liệu cá nhân bị thu thập quá mức cần thiết, chỗ thiếu lưu vết.
Trình bày thành bảng: Mã YC | Vấn đề | Đề xuất sửa | Mức độ (cao/trung bình/thấp). Không sửa trực tiếp vào đặc tả; chỉ đề xuất để tôi quyết định.
```
:::

## 8.4. Biến biểu mẫu giấy thành màn hình

Văn bản hướng dẫn cho biết người ta *phải* làm gì. Biểu mẫu giấy đang dùng cho biết người ta *thực sự* làm gì. Khi hai thứ này lệch nhau, phần mềm phải theo cả hai: đúng văn bản về nội dung, đúng biểu mẫu về cách ghi.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch ở phân hệ Kiểm điểm**

Phân hệ Kiểm điểm, đánh giá, xếp loại hằng quý được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy. Nó chạy trơn tru, kiểm thử xanh. Ngày 28/9/2026, tôi đặt phần mềm cạnh hai biểu mẫu giấy mà chính tôi đang dùng: bản tự đánh giá Quý III/2026 và kế hoạch cá nhân Quý IV/2026. Lệch bốn chỗ lớn:

1. Thực tế có **hai bước**: đầu quý lập kế hoạch, trình tập thể lãnh đạo duyệt; cuối quý tự đánh giá ngay trên kế hoạch đó. Phần mềm chỉ có một bước.
2. **Điểm tối đa từng trục không cố định**: cá nhân tự đề xuất theo thứ tự ưu tiên, tổng sáu trục bằng 70. Hồ sơ của tôi Quý III phân bổ 15-20-10-15-5-5, Quý IV là 10-20-10-20-5-5. Phần mềm lại đóng cứng 15-10-10-15-10-10.
3. **Nhóm A chấm nhị phân**: biểu mẫu chỉ có hai ô đánh dấu "Đảm bảo" và "Không đảm bảo". Phần mềm lại cho nhập điểm lẻ.
4. **Mỗi nhiệm vụ đủ năm cột**: mục tiêu, kết quả cần đạt, thời gian, kết quả thực tế, mức độ. Phần mềm chỉ có tên và mức độ.

Thêm một lỗi ở phần đầu tệp Word xuất ra: đây là văn bản của Đảng, tiêu đề phải là "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH", vậy mà phần mềm in tên cơ quan hành chính.
:::

Điều làm tôi suy nghĩ nhất là chỗ lệch thứ hai. Điểm 2.5 Hướng dẫn 02-HD/BTCTW đã nói cá nhân xác định trục giữ vai trò chính, chủ yếu và trục giữ vai trò phụ, phối hợp, hỗ trợ; trục chính chiếm tỷ trọng điểm cao hơn. Đọc kỹ câu ấy thì đã suy ra điểm tối đa phải thay đổi theo từng người. Cả tôi lẫn AI đều đọc qua mà không thấy. Chỉ khi cầm tờ giấy thật, sự thật mới hiện ra.

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

Văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức Đảng theo hướng dẫn thể thức riêng của Đảng. Phần mềm xuất biểu mẫu phải biết mình đang in loại nào, và nên chọn khổ giấy theo số cột: bảy, tám cột thì dùng khổ ngang như bản giấy.

Sau khi sửa, tôi yêu cầu tác tử "nghiệm thu ngược": bấm xuất tệp Word thật, rồi dùng chương trình mở lại chính tệp vừa xuất, liệt kê tiêu đề, khối thông tin, từng bảng, từng cột để đối chiếu với biểu mẫu. Đồng chí không cần biết công cụ đọc tệp là gì; chỉ cần giao việc: "mở lại tệp vừa xuất và kể cho tôi nghe trong đó có gì".

Sửa theo biểu mẫu nhưng không được phá dữ liệu đã có. Nhóm A chuyển sang chọn Đảm bảo/Không đảm bảo nhưng vẫn lưu dạng số (0 hoặc điểm tối đa của mục) nên bản lưu cũ không vỡ. Hồ sơ cũ chưa có phân bổ trục được dựng lại kế hoạch từ mẫu theo chức danh, giữ nguyên Nhóm A, phần tự luận và xếp loại đã có.

::: {.canhbao}
**Cảnh báo: dùng hồ sơ thật làm mẫu**

Chỉ dùng hồ sơ của chính mình, hoặc mẫu đã xóa hết thông tin cá nhân. Đặt trong thư mục bị chặn khỏi kho mã nguồn công khai (dự án dùng tệp `.gitignore` chặn thư mục chứa hồ sơ mẫu). Hồ sơ kiểm điểm là tài liệu nội bộ của Đảng: không đưa lên kho mã công khai, không dán vào dịch vụ AI công cộng. Cũng nên nhớ: tệp mà tác tử AI đọc được sẽ được gửi tới máy chủ của nhà cung cấp AI để xử lý. Tôi để tác tử đọc hồ sơ của chính tôi là một quyết định có cân nhắc, không phải thói quen nên nhân rộng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 8.5 — Đối chiếu biểu mẫu giấy với phần mềm**

```text
Tôi gửi kèm biểu mẫu giấy đang dùng thật (đã xóa thông tin cá nhân) cho chức năng [tên chức năng]. Hãy đối chiếu với màn hình nhập và tệp xuất hiện có của phần mềm, lập bảng 4 cột: Thành phần trên biểu mẫu | Phần mềm hiện làm gì | Lệch hay khớp | Đề xuất sửa.
Phải soát đủ: tiêu đề và thể thức (văn bản Đảng hay hành chính), khối thông tin đầu, từng cột của từng bảng, ô đánh dấu, dòng tổng, khối chữ ký, khổ giấy.
Chưa sửa mã. Với mỗi đề xuất, nói rõ dữ liệu đã lưu theo cách cũ sẽ được nâng cấp thế nào để không mất phần đã chấm.
```
:::
