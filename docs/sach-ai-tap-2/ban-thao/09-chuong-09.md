# Chương 9. Phân hệ đánh giá, xếp loại cán bộ, công chức theo OKR/KPI

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu bài toán đánh giá, xếp loại hằng tháng tại Văn phòng và các căn cứ mà phần mềm phải "số hóa đúng".
- Nắm cấu trúc điểm 30 + 70, cách ba tiêu chí Số lượng – Chất lượng – Tiến độ tự suy ra mức độ hoàn thành, và vì sao điểm cao vẫn có thể xếp loại thấp.
- Phân biệt OKR (để định hướng) với KPI (để đánh giá), hiểu vì sao không đưa phần trăm đạt OKR vào điểm cá nhân.
- Rút kinh nghiệm từ các phiên bản thử nghiệm và bốn sự cố có thật của phân hệ.
- Tự làm được một bảng chấm điểm cho một phòng, kèm bộ ca kiểm thử để tự nghiệm thu.

Dành cho: cán bộ làm công tác tổ chức, tổng hợp; trưởng, phó phòng; người muốn tự làm công cụ chấm điểm (đọc kỹ mục 9.2 và 9.6); lãnh đạo (đọc mục 9.1, 9.3 và các hộp "Dành cho lãnh đạo").
:::

Chương 1 đã kể hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh ra đời từ một bảng tính chấm điểm. Chương này mở phân hệ đầu tiên ấy ra xem bên trong. Đó là phân hệ Đánh giá OKR/KPI cán bộ, công chức, người lao động, chạy tại địa chỉ hdndthkpi.vercel.app, đường dẫn `#/okr`.

Tôi trình bày theo khuôn chung của Phần thứ ba: bài toán và căn cứ; thiết kế giải pháp; cách tôi giao việc cho tác tử AI lập trình (AI coding agent); những sự cố đã gặp; cách tự làm một phiên bản nhỏ; và những điều lãnh đạo cần biết.

Xin nhắc trước một điều. Đây là bản demo thử nghiệm, sử dụng nội bộ. Điểm số và xếp loại hiển thị trong phân hệ là dữ liệu mô phỏng để trình diễn cách tính, không phải kết quả đánh giá của bất kỳ ai. Kết luận đánh giá, xếp loại luôn thuộc về cấp có thẩm quyền.

## 9.1. Bài toán và căn cứ

### 9.1.1. Một việc lặp lại mỗi tháng, với hàng trăm con số

Phân hệ phục vụ 28 người: 25 cán bộ, công chức, người lao động ở bốn phòng thuộc Văn phòng và 3 đồng chí lãnh đạo Văn phòng. Trong 25 người ấy có 1 Trưởng phòng, 3 Phó Trưởng phòng, 11 chuyên viên, 7 lái xe, 2 nhân viên phục vụ và 1 bảo vệ. Chỉ riêng cơ cấu này đã cho thấy cái khó: cùng một thang điểm phải đo được việc của người soạn dự thảo nghị quyết lẫn việc của người lái xe đưa đoàn công tác.

Hằng tháng, việc đánh giá đi qua bốn mốc. Theo bản Đặc tả yêu cầu phần mềm mà Văn phòng soạn tháng 7/2026: cán bộ tự đánh giá trước ngày 25; lãnh đạo phụ trách nhận xét trước ngày 26; cấp có thẩm quyền quyết định xếp loại trước ngày 28; công khai kết quả trước ngày 05 tháng sau. Riêng tháng 12 phải xong trước ngày 15/12.

Hãy hình dung làm việc đó bằng giấy và những bảng tính rời. Mỗi người chừng mười nhiệm vụ, mỗi nhiệm vụ ba tiêu chí, chưa kể phần tiêu chí chung. Một tháng có thể lên tới vài trăm con số phải cộng, nhân hệ số, đối chiếu điều kiện. Báo cáo mô tả sáng kiến của tôi đã ghi đúng những vướng mắc ấy: tốn thời gian tổng hợp, dễ sai sót khi cộng điểm, chấm cảm tính, khó so sánh giữa các kỳ.

Nhưng cái khó lớn nhất không nằm ở phép cộng. Nó nằm ở các điều kiện kèm theo của từng mức xếp loại. Một người đạt 92 điểm chưa chắc được xếp "Hoàn thành xuất sắc nhiệm vụ". Muốn biết, phải soi từng nhiệm vụ: có việc nào chưa xong không, bao nhiêu phần trăm nhiệm vụ vượt mức. Đó là loại việc con người dễ bỏ sót, còn máy làm đều tay. Cũng chính ở chỗ này, máy dễ hiểu sai nhất nếu không được giao việc kỹ. Mục 9.2.4 sẽ kể lại.

### 9.1.2. Ba lớp căn cứ

Phần mềm chấm điểm phải "số hóa đúng" ba lớp văn bản. Lớp thứ nhất là nghị định của Chính phủ về đánh giá, xếp loại công chức. Lớp thứ hai là quy định của Ban Thường vụ Tỉnh ủy, cụ thể hóa cho hệ thống chính trị của tỉnh. Lớp thứ ba là danh mục sản phẩm, công việc của chính Văn phòng, tức thước đo riêng cho từng loại việc.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị định số 335/2025/NĐ-CP ngày 21/12/2025 của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức, có hiệu lực từ 01/01/2026. Thang điểm 100 gồm tiêu chí chung tối đa 30 điểm và tiêu chí kết quả thực hiện nhiệm vụ tối đa 70 điểm. Khoản 2 Điều 14 quy định kết quả thực hiện nhiệm vụ đo bằng tỷ lệ % về số lượng (a), chất lượng (b) và tiến độ (c) của sản phẩm, công việc đã quy đổi. Công chức không giữ chức vụ lãnh đạo tính (a+b+c)/3; công chức lãnh đạo, quản lý có thêm d, đ, e và tính (a+b+c+d+đ+e)/6. Mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ trường hợp có nguyên nhân khách quan được xác nhận. Điều 20 quy định ngưỡng: Hoàn thành xuất sắc từ 90 điểm; Hoàn thành tốt từ 70 đến dưới 90; Hoàn thành từ 50 đến dưới 70.
- Quy định số 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức, lao động hợp đồng gắn với đo lường, đánh giá kết quả, hiệu quả công việc trong hệ thống chính trị tỉnh Thanh Hóa. Khoản 4 Điều 3 nêu: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...". Khoản 7 Điều 3: tỷ lệ "Hoàn thành xuất sắc" không quá 20% số "Hoàn thành tốt". Điều 8 quy định điều kiện của từng mức; Điều 10 quy định đánh giá theo tháng, hoàn thành trước ngày 28, tháng 12 trước ngày 15/12.
- Hướng dẫn số 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

Ngoài ba văn bản trên, chúng tôi còn dùng Sổ tay hướng dẫn của Bộ Nội vụ năm 2026 về xây dựng bộ tiêu chí và đánh giá kết quả thực hiện nhiệm vụ của công chức, cùng dự thảo quyết định ban hành danh mục công việc của Văn phòng. Tất cả được đặt trong thư mục tài liệu của kho mã nguồn (repository) để tác tử AI đọc trực tiếp. Một số bản là tệp PDF scan, máy không trích được chữ. Khi đó tôi dán văn bản dạng chữ vào phiên làm việc để AI đối chiếu.

Có một chi tiết nhỏ tôi muốn kể thật. Khi rà lại tài liệu để viết chương này, tôi thấy bản Đặc tả soạn tháng 7/2026 vẫn dẫn Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Nghị định này đã hết hiệu lực từ 01/01/2026, được thay bằng Nghị định 356/2025/NĐ-CP hướng dẫn Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Căn cứ của một tài liệu kỹ thuật cũng "hết hạn" như căn cứ của một tờ trình, nên phải rà lại theo thời điểm sử dụng.

### 9.1.3. Danh mục sản phẩm, công việc: thước đo của Nhóm II

Muốn so được việc của chuyên viên với việc của lái xe, phải có một đơn vị đo chung. Nghị định 335 gọi đó là sản phẩm, công việc đã quy đổi. Danh mục của Văn phòng chọn sản phẩm chuẩn là "Soạn thảo 01 văn bản hành chính thông thường" (mã SH.CM.A5), bằng 100 điểm, tức hệ số 1,0. Mọi sản phẩm khác được quy đổi so với sản phẩm chuẩn này. Danh mục cố ý không dùng đơn vị giờ công.

Danh mục có 48 mục, chia làm ba phần:

| Phần | Nội dung | Số mục |
|---|---|---|
| I – Chuyên môn, nghiệp vụ | Tham mưu tổng hợp; kỳ họp; giám sát; tiếp xúc cử tri; tiếp công dân, đơn thư; Đoàn ĐBQH; văn thư, tài chính, công nghệ thông tin | 34 |
| II – Lãnh đạo, quản lý | Chỉ đạo, điều hành, phân công, kiểm tra, đánh giá | 8 |
| III – Hỗ trợ, phục vụ | Hậu cần, lái xe, bảo vệ, vệ sinh, bảo trì, lễ tân | 6 |

Mỗi mục được xếp vào một trong năm nhóm độ phức tạp, từ N1 (đơn giản, lặp lại) đến N5 (trọng yếu, tác động rộng). Điểm quy đổi theo nhóm: N1 từ 80 đến 100; N2 từ 110 đến 120; N3 từ 130 đến 140; N4 từ 160 đến 170; N5 từ 190 đến 200. Chẳng hạn, "Dự thảo nghị quyết trình kỳ họp" thuộc N5, 200 điểm, hệ số 2,0. "Tiếp nhận, phân loại, đề xuất hướng xử lý đơn" thuộc N1, 90 điểm. "Lái xe phục vụ lãnh đạo, đoàn công tác" tính theo từng chuyến, N1, 90 điểm.

Để khỏi nhầm, xin lưu ý: "Phần I, II, III" là cách chia danh mục; "Nhóm I, Nhóm II" là cách chia thang điểm. Cả ba phần danh mục đều dùng để chấm Nhóm II.

Mỗi người chỉ được chọn việc trong phần danh mục hợp với vị trí của mình. Phần mềm tự suy "Mẫu" từ chức vụ, không bắt chọn tay:

| Mẫu | Chức vụ | Phần danh mục được chọn |
|---|---|---|
| 01 – Lãnh đạo, quản lý 01 | Chánh, Phó Chánh Văn phòng | Phần II |
| 02 – Lãnh đạo, quản lý 02 | Trưởng, Phó Trưởng phòng | Phần I và II |
| 03 – Công chức | Chuyên viên các phòng | Phần I |
| 04 – Lao động hợp đồng | Lái xe, bảo vệ, phục vụ | Phần III |

Đổi chức vụ thì Mẫu và danh sách việc được chọn đổi theo. Nhờ vậy một chuyên viên không thể vô tình chọn việc "chỉ đạo, điều hành" để lấy hệ số cao.

Về sau, dự thảo Hướng dẫn của Ban Tổ chức Tỉnh ủy về lập danh mục sản phẩm, công việc theo OKR/KPI ghi rõ danh mục và cách chấm minh họa "được trích từ hệ thống phần mềm đã triển khai tại Văn phòng Đoàn ĐBQH và HĐND tỉnh". Phụ lục của dự thảo in nguyên 48 mục. Tôi ghi nhận điều này với thái độ dè dặt: đó vẫn là dự thảo, và danh mục của một cơ quan chỉ là ví dụ để cơ quan khác tự lập danh mục theo chức năng, nhiệm vụ của mình.

## 9.2. Cấu trúc điểm và các quy tắc xếp loại

### 9.2.1. Bức tranh tổng thể: 30 cộng 70

Tổng điểm của một người trong tháng được tính như sau:

```text
Tổng điểm = Nhóm I (tối đa 30) + Nhóm II (tối đa 70)
            − Điểm trừ (nếu có) + Điểm thưởng vượt định mức (tối đa 5)
Tổng điểm không vượt quá 100.
```

Nhóm I là tiêu chí chung: chính trị, tư tưởng; phẩm chất đạo đức, ý thức tổ chức kỷ luật; năng lực, khả năng thực thi, tác phong, đổi mới sáng tạo, cải cách hành chính, chuyển đổi số; tự phê bình và phê bình. Phần này giữ nguyên câu chữ của Quy định 1053. Điểm tối đa từng nhóm tiêu chí khác nhau theo đối tượng: công chức 5 + 5 + 16 + 4; lãnh đạo 5 + 5 + 16 + 2 + 2, trong đó mục năng lực 16 điểm tách thành sáu tiểu mục; lao động hợp đồng 15 + 10 + 5.

Nhóm II là kết quả thực hiện nhiệm vụ, chấm trên danh mục đã nói ở mục 9.1.3. Nếu ví von, Nhóm I trả lời câu hỏi "người này làm việc với tinh thần, phẩm chất thế nào", còn Nhóm II trả lời "người này làm ra những sản phẩm gì, đạt tới đâu".

### 9.2.2. Nhóm II: chấm ba sự việc, máy suy ra mức độ

::: {.cauchuyen}
**Câu chuyện thực tế: ba lần đổi cách chấm Nhóm II**

Bản đầu tiên bám sát câu chữ nghị định: nhập số lượng giao, số hoàn thành, số lần sai sót lớn, số lần trễ hạn; mỗi lần trừ 25%. Đúng luật, nhưng người chấm hỏi ngay: thế nào là một "sai sót lớn"? Một bản thử nghiệm sau đó phải thêm dòng định nghĩa và ví dụ ngay cạnh ô nhập.

Lần thứ hai, để cho nhanh, tôi cho mỗi nhiệm vụ chọn một trong năm mức độ hoàn thành, giống phân hệ Kiểm điểm. Nhanh thật, nhưng "mức độ" là một nhận định tổng hợp, mang tính chủ quan. Hai người chấm cùng một việc có thể chọn hai mức khác nhau.

Lần thứ ba, tôi chốt cách đang dùng: chấm ba tiêu chí khách quan của Nghị định 335, rồi để máy suy ra mức độ. Dữ liệu chấm theo cách cũ được tự quy đổi sang cách mới, không ai phải nhập lại.
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

Điểm mấu chốt: người chấm không chọn "mức độ" nữa, chỉ khai ba sự việc có thể kiểm chứng. Mức độ là kết luận, được rút ra cùng một cách cho mọi người. Giống như ở trường học, thầy cô chấm từng bài; học lực là kết luận theo quy chế, không ai chọn "học lực khá" trước rồi mới chấm bài.

::: {.canhbao}
**Cảnh báo: đơn giản hóa có giá, ba điểm phải được chốt bằng quy chế**

1. Mức "chậm ít = 80%" là cách lượng hóa của dự thảo hướng dẫn và của phần mềm. Quy định lại trừ 25% mỗi lần chậm, tức một lần chậm còn 75%.
2. Chất lượng và tiến độ được chọn cho cả nhiệm vụ. Bản Đặc tả ghi rõ mức trừ áp cho từng sản phẩm bị sai sót, không áp cho cả lô. Nghị định nêu ví dụ 10 văn bản có 1 văn bản sai sót lớn thì b = 97,5%; còn nếu khai thành một nhiệm vụ "có sai sót nhỏ", phần mềm tính cả nhiệm vụ 75%.
3. Trọng số tính theo nhiệm vụ, không nhân với số lượng sản phẩm. Một nhiệm vụ gồm 10 văn bản và một nhiệm vụ gồm 1 văn bản cùng loại nặng như nhau.

Cả ba là lựa chọn để người dùng chấm nhanh, dễ hiểu. Khi dùng chính thức, cơ quan phải cân nhắc và chốt bằng văn bản: giữ cách đơn giản, hay trở về cách quy đổi đúng từng sản phẩm. Đó là việc phần mềm không được tự quyết.
:::

### 9.2.3. Hệ số danh mục, tầm quan trọng và một ví dụ đi trọn

Mỗi nhiệm vụ có một trọng số khi tổng hợp:

- Trọng số = (điểm quy đổi của mục danh mục ÷ 100) × hệ số tầm quan trọng.
- Tầm quan trọng có ba mức: Thường xuyên ×1; Quan trọng ×1,5; Trọng tâm ×2.
- Điểm KPI = trung bình có trọng số kết quả các nhiệm vụ; Điểm Nhóm II = KPI × 70%.

Hệ số và trọng số được ẩn khi chấm, chỉ giải thích ở tab Hỗ trợ của phân hệ. Cách làm này giúp người chấm tập trung khai đúng sự việc của từng nhiệm vụ, thay vì ngồi tính xem khai việc nào lợi điểm hơn.

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

Phần mềm còn có điểm thưởng vượt định mức: cộng 0,1 điểm cho mỗi 1% tỷ trọng nhiệm vụ đạt mức "Xuất sắc (vượt mức)", tối đa 5 điểm, tổng vẫn không quá 100. Chẳng hạn, nhiệm vụ vượt mức chiếm 20% tổng trọng số thì được cộng 2 điểm. Điểm thưởng chỉ tính trên cột Cấp duyệt, tức phần vượt đã được cấp trên nghiệm thu. Vì sao trần chỉ 5 điểm, mục 9.3 sẽ giải thích.

### 9.2.4. Điều kiện xếp loại: vì sao điểm cao vẫn có thể xếp loại thấp

Điều 8 Quy định 1053 đặt thêm điều kiện cho từng mức, ngoài ngưỡng điểm. Bảng dưới tóm tắt các điều kiện chính và cho biết phần mềm xử lý thế nào:

| Mức | Điều kiện chính (Điều 8) | Phần mềm xử lý |
|---|---|---|
| Hoàn thành xuất sắc | Từ 90 điểm; hoàn thành 100% nhiệm vụ; ít nhất 30% vượt mức; đã khắc phục hết hạn chế kỳ trước | Tự kiểm hai điều kiện về nhiệm vụ; việc khắc phục hạn chế do người duyệt xác nhận |
| Hoàn thành tốt | Từ 70 đến dưới 90 điểm; 100% nhiệm vụ đúng hạn | Có nhiệm vụ "Không hoàn thành" thì hạ một mức; liệt kê nhiệm vụ chậm để người duyệt xem |
| Hoàn thành | Từ 50 đến dưới 70 điểm; nhiệm vụ chậm không quá 20% | Vượt 20% thì nhắc, không tự hạ mức |
| Không hoàn thành | Dưới 50 điểm; hoặc trên 50% nhiệm vụ không hoàn thành; hoặc bị kỷ luật; với lãnh đạo, đơn vị hoàn thành dưới 70% nhiệm vụ | Tự xếp; với lãnh đạo, tạm lượng hóa là trên 30% nhiệm vụ không hoàn thành |

Cột cuối cho thấy một nguyên tắc: điều gì đo được từ dữ liệu thì máy kiểm; điều gì cần nhận định thì máy nhắc, người quyết. Phần mềm không thể biết một người đã khắc phục hết hạn chế của kỳ trước hay chưa. Cách "tạm lượng hóa" với lãnh đạo cũng là một cách diễn giải, phải được cấp có thẩm quyền xác nhận trước khi dùng thật.

Chính ở điều kiện xếp loại, tác tử AI từng hiểu sai. Bản đầu, nó coi "không hoàn thành" là "chưa đạt đủ 100% số lượng". Hệ quả: một cán bộ điểm cao, chỉ có một việc làm được 9 trên 10, bị ép xuống "Không hoàn thành nhiệm vụ". Bản sửa xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành; từ 50% đến dưới 100% là chưa đạt đủ số lượng, và giao diện tách hai nhóm này ra để người duyệt thấy rõ.

Một chỗ khác cũng phải chốt: ô "bị kỷ luật" có trừ điểm không? AI liệt kê hai cách hiểu, tôi chọn cách thứ nhất: ô này chỉ ép xếp loại "Không hoàn thành nhiệm vụ", không trừ vào tổng điểm. Ô "Điểm trừ" là một cơ chế riêng, trừ thẳng vào tổng.

Để người dùng không tưởng phần mềm tính sai, tab Đánh giá có khối "Vì sao xếp loại này": các chỉ số so với ngưỡng, danh sách nhiệm vụ không hoàn thành, chưa đạt đủ, chậm tiến độ, và lý do hạ mức. Khi điểm số cao hơn mức xếp loại thực tế, một ô đỏ "Chênh lệch điểm số và xếp loại" hiện ra. Lúc AI phản biện rằng công thức có thể sinh ra "điểm cao mà xếp loại thấp", tôi chọn giữ nguyên công thức của quy định, chỉ giải thích rõ và thêm cảnh báo.

Trần tỷ lệ cũng được xử lý theo cùng tinh thần. Tab Tổng quan cảnh báo khi số "Hoàn thành xuất sắc" vượt 20% số "Hoàn thành tốt", nhưng phần mềm không tự gạt ai xuống. Chọn ai trong số người đủ điều kiện là việc của cấp có thẩm quyền; quy định còn có ngoại lệ cho đơn vị nổi trội và cho đơn vị từ 05 người trở xuống được chọn 01 người. Ngay bộ dữ liệu mô phỏng 25 người cũng được dựng theo trần này: 3 hồ sơ loại A, 19 loại B, 3 loại C.

::: {.ghinho}
**Ghi nhớ**

Điểm số phản ánh khối lượng, chất lượng công việc; xếp loại phản ánh mức độ hoàn thành theo quy định. Phần mềm tốt phải nói được vì sao hai thứ ấy khác nhau, và phải chừa chỗ cho người có thẩm quyền ở những điều kiện máy không đo được.
:::

### 9.2.5. Hai cột Tự đánh giá – Cấp duyệt và nút Phê duyệt

Mọi con số chấm điểm, từ từng tiêu chí Nhóm I đến từng nhiệm vụ Nhóm II, đều có hai cột đặt cạnh nhau. Cột Tự đánh giá do cán bộ nhập. Cột Cấp duyệt do cấp trên rà và sửa; khi chưa sửa, nó mặc định lấy đúng con số tự đánh giá. Cột Cấp duyệt là con số chính thức dùng để xếp loại. Nhờ đặt cạnh nhau, chỗ nào hai bên chênh lệch lộ ra ngay, giống bản tự kê khai và bản thẩm định ghi trên cùng một tờ phiếu.

Quyền sửa theo vai: cán bộ sửa cột Tự đánh giá của mình; trưởng phòng sửa cột Cấp duyệt của người trong phòng; quản trị sửa được cả hai; khách dùng thử được nhưng không lưu. Cách chia này khớp tinh thần điểm 2.2 Hướng dẫn 02-HD/BTCTW: cấp trực tiếp sử dụng cán bộ nhận xét, đề xuất; cấp có thẩm quyền quản lý quyết định, phê duyệt.

Nút "Phê duyệt & xuất phiếu" chỉ hiện với người có thẩm quyền đã đăng nhập. Bấm nút, phần mềm ghi họ tên, vai trò và ngày phê duyệt. Nếu sau đó ai sửa bất kỳ trường nào liên quan đến điểm, phê duyệt tự động bị gỡ. Cũng như tờ trình đã ký mà sửa nội dung thì chữ ký không còn giá trị, phải trình lại.

Phiếu đánh giá xuất ra Word gồm: thông tin cán bộ; bảng Nhóm I từng tiêu chí với hai cột; bảng Nhóm II từng nhiệm vụ với số giao, số hoàn thành, chất lượng, tiến độ, tầm quan trọng, mức độ, điểm phần trăm; bảng tổng hợp và xếp loại; lý do theo Điều 8; nhận xét; trạng thái phê duyệt và hai khối chữ ký. Phân hệ còn xuất bảng tổng hợp Excel và một sổ tay hướng dẫn dạng PDF có ví dụ tính xuyên suốt. Phiếu in ra là để ký. Giá trị của nó nằm ở chữ ký và quy trình của cơ quan, không nằm ở phần mềm.

### 9.2.6. Tôi đã giao việc cho AI như thế nào

Với phân hệ này, tôi theo bốn thói quen. Một, luôn đưa văn bản gốc và tài liệu nghiệp vụ vào kho mã, dặn AI đối chiếu chứ không dựng theo trí nhớ. Hai, mỗi lần một việc, kèm tiêu chí nghiệm thu bằng con số. Ba, ở chỗ câu chữ có thể hiểu nhiều cách, bắt AI liệt kê các cách hiểu và hệ quả, tôi chốt rồi mới viết mã. Bốn, ghi lựa chọn đã chốt vào nhật ký thay đổi để phiên làm việc sau không "quên". Hai câu lệnh dưới đây được tái dựng theo đúng tinh thần đã làm.

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
