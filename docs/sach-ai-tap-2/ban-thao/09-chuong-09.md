# Chương 9. Phân hệ đánh giá, xếp loại cán bộ, công chức theo OKR/KPI

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu bài toán đánh giá, xếp loại hằng tháng và các căn cứ mà phần mềm phải "số hóa đúng".
- Nắm cấu trúc điểm 30 + 70, cách ba tiêu chí Số lượng – Chất lượng – Tiến độ suy ra mức độ hoàn thành, và vì sao điểm cao vẫn có thể xếp loại thấp.
- Phân biệt OKR (để định hướng) với KPI (để đánh giá), hiểu vì sao không đưa phần trăm đạt OKR vào điểm cá nhân.
- Rút kinh nghiệm từ các phiên bản thử nghiệm và bốn sự cố có thật.
- Tự làm được bảng chấm điểm cho một phòng, kèm bộ ca kiểm thử để tự nghiệm thu.

Dành cho: cán bộ làm công tác tổ chức, tổng hợp; trưởng, phó phòng; người muốn tự làm công cụ chấm điểm (đọc kỹ mục 9.2 và 9.6); lãnh đạo (đọc mục 9.1, 9.3 và các hộp "Dành cho lãnh đạo").
:::

Chương 1 đã kể hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh ra đời từ một bảng tính chấm điểm. Chương này mở phân hệ đầu tiên ấy ra xem bên trong. Đó là phân hệ "Đánh giá OKR / KPI cán bộ, công chức", chạy tại địa chỉ hdndthkpi.vercel.app, đường dẫn `#/okr`.

Tôi trình bày theo khuôn chung của Phần thứ ba: bài toán và căn cứ; thiết kế; cách tôi giao việc cho tác tử AI lập trình (AI coding agent); sự cố; cách tự làm một phiên bản nhỏ; điều lãnh đạo cần biết.

Xin nhắc trước: đây là bản demo thử nghiệm, sử dụng nội bộ. Điểm số và xếp loại hiển thị trong phân hệ là dữ liệu mô phỏng, không phải kết quả đánh giá của bất kỳ ai. Kết luận đánh giá, xếp loại luôn thuộc về cấp có thẩm quyền.

## 9.1. Bài toán và căn cứ

### 9.1.1. Một việc lặp lại mỗi tháng, với hàng trăm con số

Phân hệ phục vụ 28 người: 25 cán bộ, công chức, người lao động ở bốn phòng thuộc Văn phòng và 3 đồng chí lãnh đạo Văn phòng. Trong 25 người ấy có 1 Trưởng phòng, 3 Phó Trưởng phòng, 11 chuyên viên, 7 lái xe, 2 nhân viên phục vụ và 1 bảo vệ. Cùng một thang điểm phải đo được việc của người soạn dự thảo nghị quyết lẫn việc của người lái xe đưa đoàn công tác.

Theo bản Đặc tả yêu cầu phần mềm mà Văn phòng soạn tháng 7/2026, việc đánh giá hằng tháng đi qua bốn mốc: tự đánh giá trước ngày 25; lãnh đạo phụ trách nhận xét trước ngày 26; cấp có thẩm quyền quyết định xếp loại trước ngày 28; công khai trước ngày 05 tháng sau. Riêng tháng 12 phải xong trước ngày 15/12.

Hãy hình dung làm việc đó bằng giấy và những bảng tính rời. Mỗi người chừng mười nhiệm vụ, mỗi nhiệm vụ ba tiêu chí, chưa kể phần tiêu chí chung. Một tháng có thể lên tới vài trăm con số phải cộng, nhân hệ số, đối chiếu điều kiện. Báo cáo mô tả sáng kiến của tôi đã ghi đúng những vướng mắc ấy: tốn thời gian tổng hợp, dễ sai sót khi cộng điểm, chấm cảm tính, khó so sánh giữa các kỳ.

Nhưng cái khó lớn nhất không nằm ở phép cộng, mà ở các điều kiện kèm theo của từng mức xếp loại. Một người đạt 92 điểm chưa chắc được xếp "Hoàn thành xuất sắc nhiệm vụ"; phải soi từng nhiệm vụ mới biết. Con người dễ bỏ sót việc này, còn máy làm đều tay. Nhưng cũng chính ở đây, máy dễ hiểu sai nhất nếu không được giao việc kỹ (mục 9.2.4).

### 9.1.2. Ba lớp căn cứ

Phần mềm phải "số hóa đúng" ba lớp văn bản: nghị định của Chính phủ; quy định của Ban Thường vụ Tỉnh ủy cụ thể hóa cho hệ thống chính trị của tỉnh; và danh mục sản phẩm, công việc của chính Văn phòng.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị định số 335/2025/NĐ-CP ngày 21/12/2025 của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức, có hiệu lực từ 01/01/2026. Thang điểm 100 gồm tiêu chí chung tối đa 30 điểm và tiêu chí kết quả thực hiện nhiệm vụ tối đa 70 điểm. Khoản 2 Điều 14 quy định kết quả thực hiện nhiệm vụ đo bằng tỷ lệ % về số lượng (a), chất lượng (b) và tiến độ (c) của sản phẩm, công việc đã quy đổi. Công chức không giữ chức vụ lãnh đạo tính (a+b+c)/3; công chức lãnh đạo, quản lý có thêm d, đ, e và tính (a+b+c+d+đ+e)/6. Mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ trường hợp có nguyên nhân khách quan được xác nhận. Điều 20 quy định ngưỡng: Hoàn thành xuất sắc từ 90 điểm; Hoàn thành tốt từ 70 đến dưới 90; Hoàn thành từ 50 đến dưới 70.
- Quy định số 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức, lao động hợp đồng gắn với đo lường, đánh giá kết quả, hiệu quả công việc trong hệ thống chính trị tỉnh Thanh Hóa. Khoản 4 Điều 3 nêu: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...". Khoản 7 Điều 3: tỷ lệ "Hoàn thành xuất sắc" không quá 20% số "Hoàn thành tốt". Điều 8 quy định điều kiện của từng mức; Điều 10 quy định đánh giá theo tháng, hoàn thành trước ngày 28, tháng 12 trước ngày 15/12.
- Hướng dẫn số 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

Ngoài ba văn bản trên, chúng tôi còn dùng Sổ tay hướng dẫn của Bộ Nội vụ năm 2026 về đánh giá kết quả thực hiện nhiệm vụ của công chức, cùng dự thảo quyết định của Thường trực HĐND tỉnh ban hành danh mục công việc của Văn phòng. Tất cả được đặt ngay trong kho mã nguồn (repository) để tác tử AI đọc trực tiếp. Bản nào là PDF scan, máy không trích được chữ, tôi dán văn bản dạng chữ vào phiên làm việc để AI đối chiếu.

Một chi tiết nhỏ nhưng đáng kể. Khi rà lại tài liệu để viết chương này, tôi thấy bản Đặc tả soạn tháng 7/2026 vẫn dẫn Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Nghị định này đã hết hiệu lực từ 01/01/2026, được thay bằng Nghị định 356/2025/NĐ-CP hướng dẫn Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Căn cứ của tài liệu kỹ thuật cũng "hết hạn" như căn cứ của tờ trình, phải rà lại theo thời điểm sử dụng.

### 9.1.3. Danh mục sản phẩm, công việc: thước đo của Nhóm II

Muốn so được việc của chuyên viên với việc của lái xe, phải có một đơn vị đo chung. Nghị định 335 gọi đó là sản phẩm, công việc đã quy đổi. Danh mục của Văn phòng chọn sản phẩm chuẩn là "Soạn thảo 01 văn bản hành chính thông thường" (mã SH.CM.A5), bằng 100 điểm, tức hệ số 1,0. Mọi sản phẩm khác được quy đổi so với sản phẩm chuẩn này. Danh mục cố ý không dùng đơn vị giờ công.

Danh mục có 48 mục, chia làm ba phần:

| Phần | Nội dung | Số mục |
|---|---|---|
| I – Chuyên môn, nghiệp vụ | Tham mưu tổng hợp; kỳ họp; giám sát; tiếp xúc cử tri; tiếp công dân, đơn thư; Đoàn ĐBQH; văn thư, tài chính, công nghệ thông tin | 34 |
| II – Lãnh đạo, quản lý | Chỉ đạo, điều hành, phân công, kiểm tra, đánh giá | 8 |
| III – Hỗ trợ, phục vụ | Hậu cần, lái xe, bảo vệ, vệ sinh, bảo trì, lễ tân | 6 |

Mỗi mục được xếp vào một trong năm nhóm độ phức tạp, từ N1 (đơn giản, lặp lại) đến N5 (trọng yếu, tác động rộng). Điểm quy đổi theo nhóm: N1 từ 80 đến 100; N2 từ 110 đến 120; N3 từ 130 đến 140; N4 từ 160 đến 170; N5 từ 190 đến 200. Chẳng hạn, "Dự thảo nghị quyết trình kỳ họp" thuộc N5, 200 điểm, hệ số 2,0; "Lái xe phục vụ lãnh đạo, đoàn công tác" tính theo từng chuyến, N1, 90 điểm.

Để khỏi nhầm, xin lưu ý: "Phần I, II, III" là cách chia danh mục; "Nhóm I, Nhóm II" là cách chia thang điểm. Cả ba phần danh mục đều dùng để chấm Nhóm II.

Mỗi người chỉ được chọn việc trong phần danh mục hợp với vị trí của mình. Phần mềm tự suy "Mẫu" từ chức vụ, không bắt chọn tay:

| Mẫu | Chức vụ | Phần danh mục được chọn |
|---|---|---|
| 01 – Lãnh đạo, quản lý 01 | Chánh, Phó Chánh Văn phòng | Phần II |
| 02 – Lãnh đạo, quản lý 02 | Trưởng, Phó Trưởng phòng | Phần I và II |
| 03 – Công chức | Chuyên viên các phòng | Phần I |
| 04 – Lao động hợp đồng | Lái xe, bảo vệ, phục vụ | Phần III |

Đổi chức vụ thì Mẫu và danh sách việc được chọn đổi theo. Nhờ vậy một chuyên viên không thể vô tình chọn việc "chỉ đạo, điều hành" để lấy hệ số cao.

Về sau, dự thảo Hướng dẫn của Ban Tổ chức Tỉnh ủy về lập danh mục sản phẩm, công việc theo OKR/KPI ghi rõ danh mục và cách chấm minh họa "được trích từ hệ thống phần mềm đã triển khai tại Văn phòng Đoàn ĐBQH và HĐND tỉnh", phụ lục in nguyên 48 mục. Tôi ghi nhận điều này dè dặt: đó vẫn là dự thảo, và danh mục của một cơ quan chỉ là ví dụ để cơ quan khác tự lập theo chức năng, nhiệm vụ của mình.

## 9.2. Cấu trúc điểm và các quy tắc xếp loại

### 9.2.1. Bức tranh tổng thể: 30 cộng 70

Tổng điểm của một người trong tháng được tính như sau:

```text
Tổng điểm = Nhóm I (tối đa 30) + Nhóm II (tối đa 70)
            − Điểm trừ (nếu có) + Điểm thưởng vượt định mức (tối đa 5)
Tổng điểm không vượt quá 100.
```

Nhóm I là tiêu chí chung (chính trị, tư tưởng; phẩm chất, kỷ luật; năng lực, tác phong, đổi mới sáng tạo, chuyển đổi số; tự phê bình và phê bình), giữ nguyên câu chữ của Quy định 1053. Điểm tối đa từng nhóm khác nhau theo đối tượng: công chức 5 + 5 + 16 + 4; lãnh đạo 5 + 5 + 16 + 2 + 2, trong đó mục năng lực tách sáu tiểu mục; lao động hợp đồng 15 + 10 + 5.

Nhóm II là kết quả thực hiện nhiệm vụ, chấm trên danh mục đã nói ở mục 9.1.3. Nếu ví von, Nhóm I trả lời câu hỏi "người này làm việc với tinh thần, phẩm chất thế nào", còn Nhóm II trả lời "người này làm ra những sản phẩm gì, đạt tới đâu".

### 9.2.2. Nhóm II: chấm ba sự việc, máy suy ra mức độ

::: {.cauchuyen}
**Câu chuyện thực tế: ba lần đổi cách chấm Nhóm II**

Bản đầu tiên bám sát câu chữ nghị định: nhập số giao, số hoàn thành, số lần sai sót lớn, số lần trễ hạn; mỗi lần trừ 25%. Đúng luật, nhưng khái niệm "sai sót lớn" cần được định nghĩa; bản Cải tiến sau đó phải thêm dòng giải thích và ví dụ ngay cạnh ô nhập.

Lần thứ hai, phần nhập số được bỏ: mỗi nhiệm vụ chỉ chọn một trong năm mức độ hoàn thành kèm tầm quan trọng, giống phân hệ Kiểm điểm. Chấm nhanh hơn, nhưng "mức độ" là một nhận định tổng hợp, mang tính chủ quan; hai người chấm cùng một việc có thể chọn hai mức khác nhau.

Lần thứ ba, tôi chốt cách đang dùng: chấm ba tiêu chí khách quan theo tinh thần Nghị định 335, rồi để máy suy ra mức độ. Dữ liệu cũ được tự quy đổi, không ai phải nhập lại.
:::

Ba tiêu chí được chấm như sau:

| Tiêu chí | Người chấm làm gì | Quy ra phần trăm |
|---|---|---|
| ① Số lượng | Nhập số giao, số hoàn thành | Hoàn thành ÷ giao, tối đa 100% |
| ② Chất lượng | Chọn 1 trong 3 mức | Đạt chuẩn 100%; có sai sót nhỏ 75%; chưa đạt, phải làm lại 50% |
| ③ Tiến độ | Chọn 1 trong 3 mức | Đúng hạn 100%; chậm ít 80%; trễ hạn 50% |

Kết quả nhiệm vụ bằng trung bình cộng ba tiêu chí. Ví dụ: giao 10, hoàn thành 10, đạt chuẩn, chậm ít thì kết quả là (100 + 100 + 80) ÷ 3 = 93,3%. Từ kết quả này, máy suy ra mức độ hoàn thành:

| Kết quả nhiệm vụ | Mức độ hoàn thành |
|---|---|
| Từ 90%, đồng thời vượt số lượng, đạt chuẩn, đúng hạn | Xuất sắc (vượt mức) |
| Từ 90% | Hoàn thành tốt |
| Từ 75% đến dưới 90% | Cơ bản hoàn thành |
| Từ 50% đến dưới 75% | Chưa hoàn thành |
| Dưới 50% | Không hoàn thành |

Điểm mấu chốt: người chấm không chọn "mức độ" nữa, chỉ khai ba sự việc kiểm chứng được; mức độ là kết luận, rút ra cùng một cách cho mọi người. Như ở trường học, thầy cô chấm từng bài; học lực là kết luận theo quy chế, không ai chọn "học lực khá" trước rồi mới chấm bài.

::: {.canhbao}
**Cảnh báo: đơn giản hóa có giá, ba điểm phải được chốt bằng quy chế**

1. Mức "chậm ít = 80%" là cách lượng hóa của dự thảo hướng dẫn và của phần mềm. Quy định lại trừ 25% mỗi lần chậm, tức một lần chậm còn 75%.
2. Chất lượng và tiến độ được chọn cho cả nhiệm vụ. Bản Đặc tả ghi rõ mức trừ áp cho từng sản phẩm bị sai sót, không áp cho cả lô. Theo cách trừ của nghị định, 10 văn bản có 1 văn bản sai sót lớn thì b = 97,5%; còn nếu khai thành một nhiệm vụ và chọn mức "có sai sót", phần mềm tính chất lượng cả nhiệm vụ là 75%.
3. Trọng số tính theo nhiệm vụ, không nhân với số lượng sản phẩm. Một nhiệm vụ gồm 10 văn bản và một nhiệm vụ gồm 1 văn bản cùng loại nặng như nhau.

Cả ba giúp chấm nhanh, dễ hiểu. Khi dùng chính thức, cơ quan phải chốt bằng văn bản: giữ cách đơn giản, hay trở về cách quy đổi đúng từng sản phẩm. Phần mềm không được tự quyết việc này.
:::

### 9.2.3. Hệ số danh mục, tầm quan trọng và một ví dụ đi trọn

Mỗi nhiệm vụ có một trọng số khi tổng hợp:

- Trọng số = (điểm quy đổi của mục danh mục ÷ 100) × hệ số tầm quan trọng.
- Tầm quan trọng có ba mức: Thường xuyên ×1; Quan trọng ×1,5; Trọng tâm ×2.
- Điểm KPI = trung bình có trọng số kết quả các nhiệm vụ; Điểm Nhóm II = KPI × 70%.

Hệ số và trọng số được ẩn khi chấm, chỉ giải thích ở tab Hỗ trợ. Nhờ vậy người chấm tập trung khai đúng sự việc, thay vì ngồi tính khai việc nào lợi điểm hơn.

::: {.vidu}
**Ví dụ minh họa: một công chức Mẫu 03 trong tháng (trích từ dự thảo Hướng dẫn)**

| Nhiệm vụ | Trọng số | Ba tiêu chí | Kết quả, mức độ |
|---|---|---|---|
| Soạn văn bản hành chính (Thường xuyên) | 1,0 × 1 = 1,00 | 10/10; đạt chuẩn; đúng hạn | 100% – Hoàn thành tốt |
| Báo cáo giám sát chuyên đề (Trọng tâm) | 2,0 × 2 = 4,00 | 2/2; có sai sót; chậm ít | 85% – Cơ bản |
| Tổng hợp ý kiến thảo luận (Quan trọng) | 1,7 × 1,5 = 2,55 | 2/3; đạt chuẩn; đúng hạn | 88,9% – Cơ bản |

KPI = (100 × 1,00 + 85 × 4,00 + 88,9 × 2,55) ÷ (1,00 + 4,00 + 2,55) = 666,7 ÷ 7,55 = 88,3%. Điểm Nhóm II = 88,3% × 70 = 61,8 điểm. Giả sử Nhóm I đạt 29 điểm, tổng là 90,8 điểm.

Tổng điểm vượt ngưỡng 90, nhưng người này chỉ được xếp "Hoàn thành tốt nhiệm vụ": mới 1/3 số nhiệm vụ đạt mức "Hoàn thành tốt" trở lên, và không có nhiệm vụ nào vượt mức.
:::

Phần mềm còn có điểm thưởng vượt định mức: cộng 0,1 điểm cho mỗi 1% tỷ trọng nhiệm vụ đạt mức "Xuất sắc (vượt mức)", tối đa 5 điểm, tổng không quá 100. Nhiệm vụ vượt mức chiếm 20% tổng trọng số thì được cộng 2 điểm. Trong tổng điểm chính thức, thưởng tính theo số liệu cột Cấp duyệt, tức phần vượt đã được cấp trên nghiệm thu. Vì sao trần chỉ 5 điểm, mục 9.3 sẽ giải thích.

### 9.2.4. Điều kiện xếp loại: vì sao điểm cao vẫn có thể xếp loại thấp

Điều 8 Quy định 1053 đặt thêm điều kiện cho từng mức, ngoài ngưỡng điểm. Bảng dưới tóm tắt các điều kiện chính và cho biết phần mềm xử lý thế nào:

| Mức | Điều kiện chính (Điều 8) | Phần mềm xử lý |
|---|---|---|
| Hoàn thành xuất sắc | Từ 90 điểm; hoàn thành 100% nhiệm vụ; ít nhất 30% vượt mức; đã khắc phục hết hạn chế kỳ trước | Tự kiểm hai điều kiện về nhiệm vụ; việc khắc phục hạn chế do người duyệt xác nhận |
| Hoàn thành tốt | Từ 70 đến dưới 90 điểm; 100% nhiệm vụ đúng hạn | Có nhiệm vụ "Không hoàn thành" thì hạ một mức; liệt kê nhiệm vụ chậm |
| Hoàn thành | Từ 50 đến dưới 70 điểm; nhiệm vụ chậm không quá 20% | Vượt 20% thì nhắc, không tự hạ mức |
| Không hoàn thành | Dưới 50 điểm; hoặc trên 50% nhiệm vụ không hoàn thành; hoặc bị kỷ luật từ khiển trách trở lên; với lãnh đạo, đơn vị hoàn thành dưới 70% nhiệm vụ | Tự xếp; với lãnh đạo, tạm lượng hóa là trên 30% nhiệm vụ không hoàn thành |

Cột cuối cho thấy một nguyên tắc: điều gì đo được từ dữ liệu thì máy kiểm; điều gì cần nhận định thì máy nhắc, người quyết. Phần mềm không thể biết một người đã khắc phục hết hạn chế kỳ trước hay chưa. Cách "tạm lượng hóa" với lãnh đạo cũng chỉ là một cách diễn giải, phải được cấp có thẩm quyền xác nhận.

Chính ở điều kiện xếp loại, tác tử AI từng hiểu sai. Bản đầu coi "không hoàn thành" là "chưa đạt đủ 100% số lượng", nên một cán bộ điểm cao, chỉ có một việc làm được 9 trên 10, bị ép xuống "Không hoàn thành nhiệm vụ". Bản sửa xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành; từ 50% đến dưới 100% là chưa đạt đủ số lượng, và giao diện tách riêng hai nhóm. Ô "bị kỷ luật" cũng phải chốt: AI hỏi lại, tôi quyết định ô này chỉ ép xếp loại "Không hoàn thành nhiệm vụ", không trừ vào tổng điểm; ô "Điểm trừ" là cơ chế riêng.

Để người dùng không tưởng phần mềm tính sai, tab Đánh giá có khối "Vì sao xếp loại này": chỉ số so với ngưỡng, danh sách nhiệm vụ không hoàn thành, chưa đạt đủ, chậm tiến độ, lý do hạ mức. Điểm số cao hơn mức xếp loại thì hiện ô đỏ "Chênh lệch điểm số và xếp loại". Khi AI phản biện rằng công thức có thể sinh ra "điểm cao mà xếp loại thấp", tôi chọn giữ nguyên công thức của quy định, chỉ giải thích rõ và cảnh báo.

Trần tỷ lệ cũng theo tinh thần ấy. Tab Tổng quan cảnh báo khi số "Hoàn thành xuất sắc" vượt 20% số "Hoàn thành tốt", nhưng không tự gạt ai xuống: chọn ai là việc của cấp có thẩm quyền, và quy định còn có ngoại lệ cho đơn vị nổi trội, đơn vị từ 05 người trở xuống. Ngay bộ dữ liệu mô phỏng 25 người cũng được dựng trong trần này: 3 hồ sơ loại A, 19 loại B, 3 loại C.

::: {.ghinho}
**Ghi nhớ**

Điểm số phản ánh khối lượng, chất lượng công việc; xếp loại phản ánh mức độ hoàn thành theo quy định. Phần mềm tốt phải nói được vì sao hai thứ ấy khác nhau, và phải chừa chỗ cho người có thẩm quyền ở những điều kiện máy không đo được.
:::

### 9.2.5. Hai cột Tự đánh giá – Cấp duyệt và nút Phê duyệt

Mọi con số chấm điểm, từ từng tiêu chí Nhóm I đến từng nhiệm vụ Nhóm II, đều có hai cột đặt cạnh nhau. Cột Tự đánh giá do cán bộ nhập. Cột Cấp duyệt do cấp trên rà và sửa; khi chưa sửa, nó mặc định lấy đúng con số tự đánh giá. Cột Cấp duyệt là con số chính thức để xếp loại. Đặt cạnh nhau thì chỗ chênh lệch lộ ra ngay, như bản tự kê khai và bản thẩm định ghi trên cùng một tờ phiếu.

Quyền sửa theo vai: cán bộ sửa cột Tự đánh giá của mình; trưởng phòng sửa cột Cấp duyệt của người trong phòng; quản trị sửa được cả hai; khách dùng thử được nhưng không lưu. Cách chia này khớp tinh thần điểm 2.2 Hướng dẫn 02-HD/BTCTW: cấp trực tiếp sử dụng cán bộ nhận xét, đề xuất; cấp có thẩm quyền quản lý quyết định, phê duyệt.

Nút "Phê duyệt & xuất phiếu" chỉ hiện với người có thẩm quyền đã đăng nhập. Bấm nút, phần mềm ghi họ tên, vai trò và ngày phê duyệt. Sau đó ai sửa bất kỳ trường nào liên quan đến điểm thì phê duyệt tự động bị gỡ, cũng như tờ trình đã ký mà sửa nội dung thì phải trình lại.

Phiếu Word gồm: thông tin cán bộ; bảng Nhóm I hai cột; bảng Nhóm II từng nhiệm vụ với số giao, số hoàn thành, chất lượng, tiến độ, tầm quan trọng, mức độ, điểm phần trăm; tổng hợp và xếp loại; lý do theo Điều 8; nhận xét; trạng thái phê duyệt và hai khối chữ ký. Tab Tổng quan còn có bảng tổng hợp kết quả theo Mẫu 1A, xuất được ra Excel. Phiếu in ra là để ký; giá trị của nó nằm ở chữ ký và quy trình của cơ quan, không nằm ở phần mềm.

### 9.2.6. Tôi đã giao việc cho AI như thế nào

Với phân hệ này, tôi giữ bốn thói quen. Một, đưa văn bản gốc vào kho mã, dặn AI đối chiếu chứ không dựng theo trí nhớ. Hai, mỗi lần một việc, kèm tiêu chí nghiệm thu bằng con số. Ba, chỗ câu chữ hiểu được nhiều cách thì bắt AI liệt kê cách hiểu và hệ quả, tôi chốt rồi mới viết mã. Bốn, ghi lựa chọn đã chốt vào nhật ký thay đổi để phiên sau không "quên". Hai câu lệnh dưới đây được tái dựng theo đúng tinh thần đã làm.

::: {.lenhmau}
**Câu lệnh mẫu 9.1 — Chuyển cách chấm Nhóm II sang ba tiêu chí khách quan**

```text
Vai: Em là tác tử lập trình trong kho mã phân hệ OKR/KPI.
Bối cảnh: Đọc bộ nhớ dự án và tệp docs/[tên tài liệu hướng dẫn].
Hiện mỗi nhiệm vụ Nhóm II chỉ chọn một "mức độ hoàn thành" (chủ quan).
Việc: Đổi sang chấm 3 tiêu chí cho từng nhiệm vụ:
 - Số lượng = hoàn thành ÷ giao (tối đa 100%);
 - Chất lượng chọn 3 mức: 100 / 75 / 50;
 - Tiến độ chọn 3 mức: 100 / 80 / 50.
 Kết quả = trung bình 3 tiêu chí; máy tự suy ra mức độ theo bảng [dán bảng].
Ràng buộc:
 - Giữ hai cột Tự đánh giá / Cấp duyệt; Cấp duyệt kế thừa Tự đánh giá.
 - Dữ liệu cũ (số lần sai sót, số lần trễ) phải tự quy đổi, không mất.
 - Không đụng phân hệ Kiểm điểm và các bản thử nghiệm khác.
 - Không đổi điều kiện xếp loại khi chưa hỏi tôi.
Nghiệm thu:
 - Ca 1: giao 10, xong 10, đạt chuẩn, chậm ít → 93,3%.
 - Ca 2: ví dụ 3 nhiệm vụ trong tài liệu → KPI 88,3%, Nhóm II 61,8.
 - Bản dựng xanh; liệt kê mọi chỗ khác đang đọc dữ liệu nhiệm vụ
   (xuất Word, bot chat, tab Tổng quan) và cho biết đã sửa theo chưa.
Trước khi sửa, trình phương án và danh sách tệp sẽ đụng tới.
```
:::

::: {.lenhmau}
**Câu lệnh mẫu 9.2 — Liệt kê cách hiểu một điều khoản trước khi lập trình**

```text
Trước khi lập trình điều kiện xếp loại, hãy đọc nguyên văn Điều [số]
của [tên quy định] mà tôi dán bên dưới và lập bảng 4 cột:
 (1) câu chữ của quy định;
 (2) các cách hiểu có thể có (ít nhất 2 nếu câu chữ chưa rõ);
 (3) hệ quả của từng cách hiểu, kèm một ví dụ bằng số;
 (4) điều kiện nào phần mềm đo được từ dữ liệu, điều kiện nào
     phải do người duyệt xác nhận.
Chú ý riêng các cụm: "không hoàn thành nhiệm vụ", "vượt mức",
"bị kỷ luật" (ép xếp loại hay trừ điểm?), "đơn vị hoàn thành dưới 70%".
KHÔNG tự chọn cách hiểu. Chờ tôi chốt từng dòng rồi mới viết mã,
và ghi lựa chọn của tôi vào nhật ký thay đổi.
[Dán nguyên văn điều khoản]
```
:::

## 9.3. OKR để định hướng, KPI để đánh giá

Hai từ này hay đi liền nhau nhưng làm hai việc khác nhau. KPI, chỉ số đánh giá kết quả công việc (Key Performance Indicator), đo những việc đã giao và đã làm; đó chính là Nhóm II ở mục 9.2. OKR, mục tiêu và kết quả then chốt (Objectives and Key Results), gồm một mục tiêu định hướng cùng hai, ba kết quả then chốt đo được. OKR giống chỉ tiêu phấn đấu trong chương trình công tác năm; KPI giống sổ nghiệm thu sản phẩm hằng tháng.

Trong phân hệ, OKR nằm ở tab Tổng quan, ở cấp Văn phòng. Mỗi mục tiêu có hai, ba kết quả then chốt dạng "hiện tại / chỉ tiêu + đơn vị", phần mềm tự tính phần trăm tiến độ. Dữ liệu mẫu có mục tiêu "Đẩy mạnh chuyển đổi số, ứng dụng AI trong công tác Văn phòng" gắn với Nghị quyết 57-NQ/TW, với kết quả then chốt như "Tỷ lệ hồ sơ, văn bản xử lý trên môi trường điện tử"; các con số đi kèm là mô phỏng. Nhiệm vụ của cán bộ có thể gắn vào một mục tiêu để thấy việc mình góp vào đâu; việc gắn là khuyến khích, không bắt buộc.

Điều quan trọng nhất: phần trăm đạt OKR không được cộng vào điểm cá nhân. Lý do nằm ở quy luật Goodhart, thường được phát biểu: khi một thước đo trở thành mục tiêu, nó không còn là thước đo tốt. OKR vốn đặt cao, mang tính khát vọng; đạt 60–70% đã là tốt. Đem phần trăm ấy chấm điểm thì người dám đặt mục tiêu cao bị thiệt, còn ai cũng sẽ đặt mục tiêu vừa tầm cho chắc. Tôi đi đến kết luận này sau khi yêu cầu AI nghiên cứu có nguồn: cách làm OKR của Google và John Doerr, của cơ quan công nghệ chính phủ Singapore (GovTech), cùng quy luật Goodhart.

Cùng lý lẽ ấy áp cho điểm thưởng: thưởng quá hậu thì sẽ có người khai khống hoặc chọn việc dễ để vượt, nên thưởng nhỏ, có trần, chỉ tính phần vượt đã được nghiệm thu. Một kẽ hở khác: vì trọng số tính theo nhiệm vụ, tách một việc lớn thành nhiều nhiệm vụ nhỏ sẽ làm nó "nặng" hơn. Do đó số giao và cách tách nhiệm vụ phải do người giao việc quyết định.

::: {.lanhdao}
**Dành cho lãnh đạo**

- OKR là công cụ điều hành: đặt mục tiêu đủ khó, xem tiến độ hằng tháng, điều chỉnh nguồn lực. Đừng biến nó thành bảng chấm điểm.
- Với mọi thước đo gắn với khen thưởng, hãy hỏi "người ta sẽ lách thế nào?" và yêu cầu có trần, có người thẩm định.
- Số giao, cách tách nhiệm vụ và nghiệm thu phần vượt là việc của người giao việc; phần mềm chỉ ghi lại và tính.
:::

::: {.lenhmau}
**Câu lệnh mẫu 9.3 — Đóng vai người muốn lách thước đo**

```text
Đây là cách chấm điểm Nhóm II của cơ quan tôi: [dán công thức, bảng mức,
quy tắc thưởng]. Hãy đóng vai một cán bộ muốn đạt điểm cao mà không làm
thêm việc thật. Liệt kê ít nhất 8 cách có thể lách (khai số giao thấp,
tách nhỏ nhiệm vụ, chọn việc hệ số cao, tự chấm cao chờ cấp trên bỏ sót...).
Với mỗi cách: (1) dấu hiệu nhận biết trong dữ liệu; (2) biện pháp chặn
bằng quy trình; (3) biện pháp chặn bằng phần mềm; (4) biện pháp nào
chỉ con người làm được. Trình bày bằng bảng, văn phong hành chính.
```
:::

## 9.4. Những phiên bản thử nghiệm và vì sao chỉ giữ cái cần

### 9.4.1. Ba giao diện, rồi gỡ còn một

Có một giai đoạn, màn đăng nhập cho chọn ba bản giao diện: Cổ điển (tông đỏ), Mới (nền tối) và PRO (trắng đen, tính điểm theo danh mục riêng từng phòng). Với tác tử AI, dựng thêm một bản giao diện rất nhanh. Cái giá đến sau, âm thầm: mỗi tính năng phải làm ba lần; ba bản phải cùng giữ nguyên danh mục công việc khi lưu, nếu không thì đổi bản là mất danh mục của bản kia; trang tải nặng.

Tôi quyết định gỡ hẳn bản Mới và bản PRO, chỉ giữ một giao diện; mã cũ vẫn còn trong lịch sử Git. Trước đó, việc tách tải theo nhu cầu đã đưa khối mã chính từ 639 kB xuống khoảng 181 kB; sau khi gỡ còn khoảng 178 kB.

### 9.4.2. Năm bộ tiêu chí trên một giao diện

Từ đó, "phiên bản" chỉ còn nghĩa là bộ tiêu chí, dùng chung một giao diện:

| Bộ tiêu chí | Ý tưởng chính | Vai trò hiện nay |
|---|---|---|
| Cổ điển | Câu chữ pháp lý của Quy định 1053; Nhóm II nhập số lần sai sót, số lần chậm | Phòng thử nghiệm |
| Cải tiến | Câu hỏi dễ hiểu kèm ví dụ; khung năng lực AIM, giá trị ISE; gom nhiệm vụ theo mục tiêu | Phòng thử nghiệm |
| Singapore | Phiếu cá nhân xếp loại A–E; bảng điểm cơ quan theo dải màu Xanh, Vàng, Đỏ; không chấm điểm cá nhân đại biểu | Phòng thử nghiệm |
| SonHa (tên nội bộ) | Gọn ba tab; danh mục 48 mục; ba tiêu chí khách quan | Bản vận hành của `#/okr` |
| Kiểm điểm | Đánh giá theo quý, sáu trục | Phân hệ `#/kiemdiem` (Chương 10) |

Bản Cổ điển và Cải tiến dùng cùng mã tiêu chí, cùng điểm tối đa, cùng công thức, nên đổi qua lại không mất điểm; bản Singapore về sau chuyển hẳn sang mô hình riêng. Báo cáo mô tả sáng kiến trình Hội đồng khoa học của cơ quan mô tả giai đoạn tích hợp ba mô hình này. Bản Singapore để lại một bài học: đo thiết chế bằng nhiều chỉ số riêng rẽ, không gộp thành một con số, và tách đánh giá tiềm năng khỏi điểm hiệu suất.

### 9.4.3. Giữ cái cần, cất cái để học

Các bản thử nghiệm không bị xóa mà được cất vào "Phòng thử nghiệm bộ tiêu chí" (`#/thunghiem`); Quản trị ẩn, hiện và đổi tên được từng bản. Thanh chọn bộ tiêu chí bị bỏ khỏi đầu trang các phân hệ nghiệp vụ. Người làm việc hằng ngày chỉ thấy một bản, đúng thứ họ cần. Khi phân vân giữ hay bỏ, tôi tự hỏi ba câu: có ai đang dùng thật không; có văn bản nào yêu cầu không; mỗi lần quy định đổi, giữ nó tốn thêm bao nhiêu công sửa?

::: {.ghinho}
**Ghi nhớ**

Với AI, làm thêm thì dễ; bớt đi mới cần quyết tâm của người chủ. Thứ không ai dùng vẫn tốn công bảo trì và vẫn là chỗ sinh lỗi. Định kỳ, hãy dọn bớt.
:::

## 9.5. Sự cố và bài học

Bốn sự cố dưới đây đều có thật, được ghi trong nhật ký dự án kèm nguyên nhân gốc và cách sửa. Không lỗi nào lộ ra khi thử theo cách "bình thường".

### 9.5.1. Ngày đầu tháng, cả phân hệ trắng trang

::: {.cauchuyen}
**Câu chuyện thực tế: lỗi chờ đến ngày 01**

Từ ngày 01/9/2026, mở các đường dẫn `#/okr`, `#/kiemdiem`, `#/canbo` chỉ thấy trang trắng kèm dòng lỗi tiếng Anh "Cannot read properties of undefined (reading 'id')". Máy chủ có dữ liệu tháng 6, 7, 8 nhưng chưa có tháng 9.

Nguyên nhân là một dòng mã "lấy mã của người đứng đầu danh sách", chạy ở mọi lần vẽ lại màn hình. Kỳ mới chưa có ai, "người đứng đầu" không tồn tại, cả phân hệ sập theo. Như văn thư được dặn sáng nào cũng đọc tên trên tờ trên cùng trong ngăn kéo; ngày đầu tháng ngăn kéo trống, văn thư đứng im, cả phòng đứng theo.

Bản vá được ghi nhận ngày 28/9/2026: đổi thành "có thì lấy, không thì để trống", kèm dòng cảnh báo ngay trong mã. Kỳ mới nay tự chuyển tiếp danh sách từ kỳ gần nhất, giữ người, đặt lại điểm. Trước đó, nút "Sao chép cán bộ từ kỳ trước" chỉ quản trị bấm được; khách và người chỉ xem phải nhìn trang trắng.
:::

Bài học: lỗi theo lịch chỉ lộ khi sang kỳ mới; và lối thoát cho tình huống xấu không được chỉ dành cho người có quyền cao nhất.

### 9.5.2. Khách và quản trị thấy hai danh sách khác nhau

Khi so tài khoản khách với tài khoản quản trị, tôi thấy hai danh sách cán bộ khác nhau. Nguyên nhân: chính sách bảo mật theo dòng (Row Level Security) của cơ sở dữ liệu chặn khách đọc dữ liệu các kỳ, nên phần mềm "tự dựng" danh sách mẫu ngay trên máy khách. Hệ thống có hai nguồn sự thật, như cơ quan treo hai bảng tin: ngoài cổng dán bản nháp, trong phòng họp dán bản chính thức.

Cách sửa là mở quyền đọc, không mở quyền ghi, dữ liệu các kỳ cho mọi người. Từ đó có nguyên tắc "dữ liệu mẫu = dữ liệu chính thống": mọi vai đọc cùng một nguồn, chỉ khác ở quyền ghi. Tệp lược đồ cơ sở dữ liệu để sẵn câu lệnh gỡ quyền đọc công khai khi chuyển sang dùng thật. Phân quyền nên khác nhau ở chỗ được làm gì, không phải ở chỗ được thấy sự thật nào.

### 9.5.3. Vừa đăng nhập, dữ liệu chính thức đã bị ghi đè

Sự cố này được phát hiện khi rà soát. Phần mềm tự lưu 0,9 giây sau mỗi thay đổi, và nạp dữ liệu kỳ ngay khi mở trang, lúc chưa biết người dùng là ai. Khi người dùng đăng nhập, cơ chế tự lưu coi đó là một thay đổi và ghi ngay danh sách đang hiển thị đè lên dữ liệu chính thức. Như nhân viên mới vào ca, chưa mở sổ bàn giao đã chép bản nháp trên bàn vào sổ chính.

Bản sửa có ba lớp: chỉ nạp dữ liệu sau khi xác định xong phiên đăng nhập, đổi phiên thì nạp lại từ máy chủ rồi mới cho ghi; dùng "khóa lạc quan", tức chỉ ghi khi bản trên máy chủ chưa bị ai sửa trong lúc mình làm, nếu đã bị sửa thì báo xung đột; khách không bao giờ được tự lưu lên máy chủ.

### 9.5.4. Hai người trùng họ tên, danh sách còn 27

Ngày 13/8/2026, danh sách cán bộ của các phân hệ được gộp về một mối là hồ sơ Mẫu 2C của phân hệ Quản lý cán bộ (Chương 12). Sau khi gộp, phân hệ OKR/KPI chỉ còn 27 người thay vì 28, một hồ sơ mang sai đơn vị. Cơ quan có hai đồng chí trùng cả họ, chữ đệm và tên, ở hai đơn vị khác nhau. Chương trình ghép hồ sơ lần lượt theo email, theo "họ tên + đơn vị", cuối cùng theo "chỉ họ tên". Bước cuối gom hai người làm một, như điểm danh chỉ gọi tên: một người đứng lên "có mặt" thay cho cả hai.

Bản sửa bỏ hẳn bước "chỉ họ tên" và thêm phép kiểm riêng cho ca trùng tên. Cùng ngày, việc tách kho dữ liệu theo phân hệ làm bot chat mất hẳn phân hệ Kiểm điểm. Hai hệ quả dây chuyền ấy sinh ra quy tắc "rà soát chức năng liên quan" ở Chương 7.

### 9.5.5. Những câu hỏi lẽ ra phải hỏi sớm hơn

| Sự cố | Câu hỏi nên đặt cho AI ngay từ đầu |
|---|---|
| Trắng trang đầu tháng | Danh sách trống thì sao? Ngày đầu tháng, đầu quý, đầu năm thì sao? |
| Khách, quản trị thấy khác nhau | Mọi vai có đọc cùng một nguồn không? Có nhánh nào tự sinh dữ liệu riêng không? |
| Ghi đè khi đăng nhập | Tự lưu lúc nào, đè lên cái gì? Vừa đổi tài khoản thì sao? Hai người cùng sửa thì sao? |
| Mất người vì trùng tên | Nhận dạng một người bằng gì? Tổng số trước và sau khi gộp có khớp không? |

::: {.lenhmau}
**Câu lệnh mẫu 9.4 — Rà soát tình huống biên trước khi nghiệm thu**

```text
Trước khi tôi nghiệm thu thay đổi vừa rồi, hãy CHẠY THỬ (không đoán)
các tình huống sau trên bản dựng thật, báo cáo bằng bảng
"tình huống – kết quả – đạt/không đạt":
1. Kỳ mới chưa có dữ liệu (ngày đầu tháng, đầu quý, đầu năm).
2. Danh sách cán bộ rỗng; nhiệm vụ chưa chọn danh mục; số giao bằng 0.
3. Mở bằng vai Khách, vai Cán bộ, vai Quản trị: ba vai có thấy cùng
   một danh sách không; vai nào ghi được, vai nào không.
4. Đang xem bằng vai Khách rồi đăng nhập: có bản ghi nào bị ghi đè không.
5. Hai người trùng họ tên ở hai đơn vị: tổng số người trước và sau.
6. Chỗ nào khác đang đọc, ghi dữ liệu vừa đổi (xuất Word, bot chat,
   tab Tổng quan)? Đã kiểm chưa?
Lỗi nào tìm thấy thì thêm một phép kiểm hồi quy để không tái phát.
```
:::

## 9.6. Tự làm phiên bản nhỏ: bảng chấm điểm một phòng

Không cần dựng lại cả hệ thống: một phòng năm đến mười người có thể bắt đầu bằng một bảng chấm điểm nhỏ, làm trong một buổi.

### 9.6.1. Khoanh phạm vi trước khi mở AI

Phạm vi nên hẹp: một phòng, một tháng. Nhóm I nhập tổng điểm từ phiếu đã chấm; máy chỉ tính Nhóm II và đối chiếu các điều kiện đo được. Danh mục lấy 10 đến 15 mục phòng hay làm, giữ đúng mã và điểm quy đổi của cơ quan. Đầu ra là bảng đề xuất, không có nút "xếp loại chính thức".

::: {.canhbao}
**Cảnh báo: dữ liệu đánh giá là thông tin về con người cụ thể**

Bảng điểm gắn với họ tên thuộc vùng VÀNG; kèm nhận xét, kỷ luật thì thành vùng ĐỎ. Khi nhờ AI viết công thức hay dựng trang, chỉ dùng dữ liệu giả ("Cán bộ A, Cán bộ B"). Dữ liệu thật nhập trên máy cơ quan, lưu ở thư mục có phân quyền, không tải lên dịch vụ AI công cộng hay kho mã công khai. Theo tinh thần Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, dữ liệu chỉ được xử lý đúng mục đích, trong phạm vi cần thiết.
:::

### 9.6.2. Cách A: bảng tính có công thức do AI viết (Bậc 1)

Bảng tính gồm ba trang. DanhMuc ghi mã, tên, điểm quy đổi. NhiemVu, mỗi dòng một nhiệm vụ: người thực hiện, mã danh mục, tầm quan trọng, số giao, số hoàn thành, chất lượng, tiến độ (hai ô cuối là danh sách chọn). TongHop, mỗi người một dòng: KPI, Nhóm II, Nhóm I, tổng điểm, mức theo ngưỡng, lý do cần người duyệt xem. Công thức cốt lõi chỉ có ba dòng:

```text
Kết quả nhiệm vụ = (MIN(100; Hoàn thành/Giao*100) + %Chất lượng + %Tiến độ)/3
Trọng số         = Điểm quy đổi/100 * Hệ số tầm quan trọng
KPI một người    = Tổng(Trọng số * Kết quả) / Tổng(Trọng số)
```

::: {.lenhmau}
**Câu lệnh mẫu 9.5 — Bảng tính chấm điểm một phòng**

```text
Vai: Chuyên gia Excel (hoặc Google Sheets) cho cơ quan nhà nước.
Bối cảnh: Phòng tôi có [số] người, chấm điểm hằng tháng theo 3 tiêu chí
cho từng nhiệm vụ (quy tắc dán bên dưới). Tôi KHÔNG gửi dữ liệu thật;
hãy dùng tên giả "Cán bộ A, B, C".
Việc: Thiết kế 3 trang tính DanhMuc, NhiemVu, TongHop; viết công thức cho
kết quả nhiệm vụ, mức độ hoàn thành, trọng số, KPI theo người,
Nhóm II = KPI × 70%, tổng điểm, mức theo ngưỡng 90/70/50 và cột
"Lý do cần người duyệt xem" (có nhiệm vụ dưới 50%; đủ 90 điểm nhưng
chưa đủ 30% nhiệm vụ vượt mức...).
Dạng: bảng mô tả từng cột kèm công thức cho ô mẫu; dấu phân cách ";".
Ràng buộc: chất lượng, tiến độ là danh sách chọn; số giao bằng 0 hoặc
để trống không được gây lỗi chia cho 0; số hoàn thành bằng 0 thì nhiệm
vụ phải được xếp "Không hoàn thành".
Nghiệm thu: điền sẵn các ca kiểm thử [dán bảng ca kiểm thử] và chỉ rõ
ô nào phải ra kết quả nào.
[Dán quy tắc chấm: 3 tiêu chí, bảng mức độ, trọng số, ngưỡng]
```
:::

Ràng buộc "số hoàn thành bằng 0 thì Không hoàn thành" không thừa. Với công thức trung bình ba tiêu chí, nhiệm vụ chưa làm gì mà vẫn để mặc định "đạt chuẩn, đúng hạn" sẽ ra (0 + 100 + 100) ÷ 3 = 66,7%, tức chỉ "Chưa hoàn thành". Ca biên này nên chặn ngay từ bản nhỏ.

### 9.6.3. Cách B: trang công cụ một tệp chạy trong trình duyệt (Bậc 2)

Khi bảng tính rối vì quá nhiều điều kiện, đồng chí có thể nhờ AI dựng một trang HTML duy nhất, mở bằng trình duyệt, không cần máy chủ, dữ liệu lưu thành tệp trên máy. Dùng lại câu lệnh mẫu 9.5, đổi phần Dạng thành "một tệp HTML chạy ngoại tuyến" và thêm ba yêu cầu: tách phần tính điểm thành hàm riêng, có nút "Chạy ca kiểm thử" hiện đạt hoặc không đạt; không gọi bất kỳ địa chỉ Internet nào; đầu trang ghi "Bản thử nghiệm – kết quả là đề xuất". Hệ thống thật cũng làm như vậy: tách phần tính khỏi phần giao diện để máy kiểm thử được.

### 9.6.4. Bộ ca kiểm thử để tự nghiệm thu

| Ca | Đầu vào | Phải ra |
|---|---|---|
| 1 | Giao 10, xong 10, đạt chuẩn, chậm ít | 93,3%; Hoàn thành tốt |
| 2 | Ba nhiệm vụ của ví dụ ở mục 9.2.3 | KPI 88,3%; Nhóm II 61,8 |
| 3 | Như ca 2, Nhóm I đạt 29 | Tổng 90,8; mức Hoàn thành tốt, có ghi lý do |
| 4 | Giao 3, xong 0 | Không hoàn thành |
| 5 | Một người chưa có nhiệm vụ; số giao bằng 0 | Không báo lỗi; ghi "chưa có nhiệm vụ" |
| 6 | Hai người cùng họ tên ở hai đơn vị | Vẫn là hai dòng riêng |

::: {.thuchanh}
**Thực hành: dựng bảng chấm điểm cho phòng trong một buổi**

1. Chọn 10 đến 15 mục danh mục phòng hay làm; chép đúng mã và điểm quy đổi.
2. Dùng câu lệnh mẫu 9.5 với dữ liệu giả để AI dựng bảng.
3. Điền sáu ca kiểm thử; ca nào sai thì gửi lại AI kèm kết quả mong đợi.
4. Nhờ hai đồng nghiệp chấm thử cùng một nhiệm vụ, xem ba tiêu chí đã đủ rõ chưa.
5. Viết một trang quy ước của phòng: thế nào là sai sót nhỏ, thế nào là chậm ít.
6. Đạt cả sáu ca mới nhập dữ liệu thật, trên máy của cơ quan.
7. Trình trưởng phòng, ghi rõ: "Bảng tính hỗ trợ, kết quả là đề xuất".
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Phần mềm tính và đề xuất; xếp loại là thẩm quyền của cấp quản lý cán bộ.
- Những chỗ diễn giải (mức "chậm ít", cách tính trọng số, ngưỡng áp cho lãnh đạo) phải được chốt bằng văn bản trước khi dùng thật.
- Ứng dụng tự làm chỉ là bản thử nghiệm. Khi tỉnh triển khai phần mềm dùng thống nhất, dữ liệu chính thức phải theo hệ thống đó.
- Đầu tư đáng giá nhất là một danh mục sản phẩm tốt và một quy ước chấm chung, không phải phần mềm.
:::

## Tóm tắt chương 9

::: {.tomtat}
1. Phân hệ OKR/KPI số hóa ba lớp căn cứ: Nghị định 335/2025/NĐ-CP, Quy định 1053-QĐ/TU và danh mục 48 sản phẩm, công việc của Văn phòng, với sản phẩm chuẩn 100 điểm.
2. Tổng điểm gồm Nhóm I (30) và Nhóm II (70); Nhóm II chấm ba sự việc Số lượng, Chất lượng, Tiến độ, máy suy ra mức độ, tổng hợp theo trọng số.
3. Điều kiện xếp loại khiến điểm cao vẫn có thể xếp loại thấp; phần mềm phải giải thích vì sao và chừa chỗ cho người có thẩm quyền.
4. Hai cột Tự đánh giá – Cấp duyệt, phê duyệt tự gỡ khi sửa điểm, phiếu Word để ký: phần mềm hỗ trợ quy trình, không thay quy trình.
5. OKR để định hướng cơ quan, không cộng vào điểm cá nhân; thưởng phải nhỏ, có trần, có nghiệm thu.
6. Làm thêm phiên bản thì dễ, bớt đi mới khó; chỉ giữ cái đang dùng, cất bản nghiên cứu vào phòng thử nghiệm.
7. Bốn sự cố thật đều nằm ở tình huống biên: kỳ trống, vai khác nhau, lúc đổi phiên, dữ liệu trùng; mỗi lỗi phải thành một phép kiểm.
8. Bản nhỏ cho một phòng làm được trong một buổi, dùng dữ liệu giả khi làm cùng AI và sáu ca kiểm thử để nghiệm thu.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong ba điểm "đơn giản hóa có giá" ở mục 9.2.2, điểm nào ảnh hưởng nhiều nhất đến phòng đồng chí? Nên chốt thế nào?
2. Chọn ba nhiệm vụ đồng chí làm tháng trước, tự chấm theo ba tiêu chí và tính KPI. Kết quả có khớp cảm nhận của đồng chí không? Vì sao?
3. Dùng câu lệnh mẫu 9.3 cho cách chấm điểm của cơ quan mình. Cách lách nào đáng lo nhất, ai chặn được nó?
4. Liệt kê ba "tình huống biên" theo lịch (đầu tháng, đầu quý, cuối năm) mà một công cụ của phòng đồng chí có thể gặp.
5. Bài tập: dựng bảng chấm điểm theo mục 9.6 với dữ liệu giả, chạy đủ sáu ca kiểm thử, ghi lại ca nào sai lần đầu và vì sao.
