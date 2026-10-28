# Chương 1. Câu chuyện bắt đầu từ một bảng tính chấm điểm

::: {.muctieu}
**Mục tiêu của chương**

- Nhắc lại ngắn gọn sáu nền móng của Tập 1 mà Tập 2 tiếp tục dùng: khung VAI-BỐI-VIỆC-DẠNG-RÀNG, quy trình 5 bước soạn thảo, nguyên tắc "AI tìm dấu hiệu — con người kết luận pháp lý", phân loại dữ liệu 4 cấp, con người trong vòng lặp với ba mô hình, khung quy chế 10 điều.
- Hiểu bài toán có thật đã mở đầu hành trình: đánh giá, xếp loại cán bộ, công chức hằng tháng theo Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU của Ban Thường vụ Tỉnh ủy Thanh Hóa.
- Thấy được con đường đi từ bảng tính mô phỏng, qua bản đặc tả, tới ứng dụng web đầu tiên rồi thành hệ thống nhiều phân hệ.
- Nhận ra điều thay đổi lớn nhất là cách nghĩ, cách làm việc, kể cả cách nhìn thẳng vào những lần thất bại.
- Biết Tập 2 hứa điều gì, không hứa điều gì, để chọn lộ trình đọc phù hợp.

Dành cho: mọi người đọc. Lãnh đạo nên đọc kỹ các mục 1.2, 1.5 và 1.6.
:::

Cuối mỗi tháng, ở nhiều cơ quan, có một việc lặp lại đều như lịch: chấm điểm, xếp loại cán bộ, công chức. Mỗi người tự kê nhiệm vụ đã làm, tự chấm, nộp phiếu. Lãnh đạo phòng nhận xét. Lãnh đạo cơ quan xem xét, quyết định. Bộ phận tổng hợp cộng điểm, soi điều kiện, lập danh sách, công khai kết quả. Sang tháng sau, mọi thứ lại bắt đầu từ đầu.

Ở Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), câu chuyện của cuốn sách này bắt đầu chính từ công việc ấy, với một câu hỏi cụ thể: làm sao để việc chấm điểm hằng tháng đúng quy định hơn, nhanh hơn, và ít phải tranh luận về con số hơn?

Từ câu hỏi đó, trong năm 2026, tôi, một cán bộ làm công tác tham mưu chứ không phải lập trình viên, đã cùng tác tử AI lập trình (AI coding agent) Claude Code dựng nên hệ thống thử nghiệm của Văn phòng tại địa chỉ `https://hdndthkpi.vercel.app`. Đến ngày 26/10/2026, Trang chủ của hệ thống có 13 thẻ phân hệ, kèm hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự động hằng ngày. Chương này kể lại hành trình ấy một cách trung thực: cái làm được, cái chưa làm được, và cả những lần hệ thống sập.

## 1.1. Nhìn lại Tập 1: những gì chúng ta đã có

Tập 1, cuốn *Trí tuệ nhân tạo trong công tác tham mưu* (hoàn thiện tháng 5/2026), hướng dẫn cán bộ dùng trợ lý AI trò chuyện (chatbot) để soạn thảo, tổng hợp, rà soát văn bản. Câu chốt của cuốn sách nằm ở mục 1.3: "AI là công cụ hỗ trợ cán bộ, không thay thế cán bộ. Quyết định cuối cùng luôn thuộc về con người có thẩm quyền." Tập 2 không viết lại những nội dung đó, chỉ nhắc sáu nền móng, kèm số mục để đồng chí tra lại.

**Thứ nhất, khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2).** Một câu lệnh (prompt) tốt có năm thành phần: VAI (muốn AI là ai), BỐI cảnh (tình huống, tài liệu nền), VIỆC (AI cần làm gì cụ thể), DẠNG đầu ra (kết quả phải trông thế nào), RÀNG buộc (cần chặn AI không làm gì). Đi kèm là nguyên tắc 20-80 (mục 3.1): nếu phải sửa kết quả quá nhiều thì nên viết lại câu lệnh. Khi giao việc cho tác tử AI lập trình, khung này vẫn dùng nguyên vẹn. Tập 2 chỉ bổ sung phần "Nghiệm thu", tức tiêu chí đo được để biết việc đã xong và đạt; đây là phần mở rộng của Tập 2, Chương 6 sẽ trình bày kỹ.

**Thứ hai, quy trình 5 bước soạn thảo (mục 4.1).** Bước 1 (xác định mục đích, đối tượng, yêu cầu pháp lý) và Bước 5 (rà soát, hoàn thiện) là việc của con người trọn vẹn. Khi làm phần mềm cũng vậy: người chốt nghiệp vụ, thẩm quyền trước khi giao việc, và người nghiệm thu, chạy thử thật sau khi AI làm xong.

**Thứ ba, "AI tìm dấu hiệu — con người kết luận pháp lý" (Tập 1, Chương 5).** AI gắn cờ chỗ mâu thuẫn, chỗ nghi sai căn cứ; người có chuyên môn kết luận. Mục 1.3 của Tập 1 cũng nhắc rằng AI không tự kiểm tra chính xác được số liệu, không biết văn bản vừa ban hành. Khi AI viết phần mềm, điều ấy vẫn đúng: tác tử viết mã rất nhanh, nhưng không biết biểu mẫu nào cơ quan đang thật sự dùng, quy định nào vừa sửa.

**Thứ tư, phân loại dữ liệu 4 cấp (mục 7.1–7.2).** Cấp 1 — Công khai: dùng được mọi AI. Cấp 2 — Nội bộ: chỉ dùng AI có cam kết doanh nghiệp, sau khi ẩn danh thông tin cá nhân. Cấp 3 — Hạn chế tiếp cận, gồm cả dữ liệu cá nhân: chỉ dùng AI có máy chủ đặt tại Việt Nam hoặc AI tự triển khai nội bộ. Cấp 4 — Bí mật nhà nước: tuyệt đối không dùng AI nước ngoài; theo Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, tài liệu mật còn không được soạn thảo, lưu giữ trên thiết bị đang kết nối Internet. Khi không chắc chắn, chọn cấp cao hơn. Khi tự làm ứng dụng, phân loại này trở thành thiết kế quyền xem: Cấp 1 khách xem được; Cấp 2 phải đăng nhập; Cấp 3, như hồ sơ cán bộ, danh bạ, chỉ Quản trị đọc, không nằm trong mã nguồn, không nạp vào ngữ cảnh gửi cho AI; Cấp 4 không bao giờ được đưa vào.

**Thứ năm, con người trong vòng lặp (Human-in-the-Loop, mục 7.5).** Tập 1 nêu ba mô hình: AI đề xuất, con người duyệt; AI hỗ trợ, con người làm; AI tự động hoàn toàn, mô hình không dùng trong khu vực công. Khi làm phần mềm, mô hình thứ nhất trở thành đòi hỏi thiết kế: nút "phê duyệt" luôn thuộc về con người, phần mềm không tự xếp loại thay cấp có thẩm quyền. Trong sách, tôi gọi đó là nguyên tắc máy đề xuất – người quyết định.

**Thứ sáu, khung quy chế sử dụng AI cấp cơ quan 10 điều (mục 7.6).** Điều cốt lõi là Điều 3, gắn phân loại dữ liệu với loại AI được dùng. Khi cơ quan có công cụ tự làm, quy chế cần thêm phần về nhà cung cấp AI dùng phía máy chủ, nhật ký, hạn mức và người bảo trì. Không nên nhầm khung này với Quy tắc sử dụng AI 9 điều của phân hệ Sổ tay AI (Chương 15).

Có một việc Tập 1 chưa bàn đến: làm ra phần mềm. Ở mục 5.6, khi nói về việc tự dựng hệ thống tra cứu, Tập 1 chỉ ghi rằng việc đó đòi hỏi kỹ năng lập trình Python. Tập 2 bắt đầu từ chỗ ấy. Tác tử AI lập trình đã hạ thấp rào cản kỹ thuật, nhưng không làm nhẹ đi trách nhiệm của người giao việc.

::: {.phaply}
**Căn cứ pháp lý: những thay đổi sau Tập 1**

- Nghị định 13/2023/NĐ-CP, mà Tập 1 dẫn cho dữ liệu Cấp 3, hết hiệu lực từ 01/01/2026; nay áp dụng Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, cùng có hiệu lực từ 01/01/2026.
- Luật Bảo vệ bí mật nhà nước số 29/2018/QH14 được thay bằng Luật số 117/2025/QH15 (hiệu lực từ 01/3/2026).
- Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015 được thay bằng Luật An ninh mạng số 116/2025/QH15 (hiệu lực từ 01/7/2026).
- Quyết định 127/QĐ-TTg được thay bằng Quyết định 1671/QĐ-TTg ngày 28/8/2026 về chiến lược quốc gia về trí tuệ nhân tạo.
- Luật Tiếp cận thông tin số 104/2016/QH13 hết hiệu lực từ 01/9/2026, thay bằng Luật Tiếp cận thông tin số 01/2026/QH16.
- Đã có Luật Trí tuệ nhân tạo số 134/2025/QH15, hiệu lực từ 01/3/2026.

Chương 3 phân tích kỹ các văn bản này.
:::

Ngày 7/5/2026, Thường trực Hội đồng nhân dân (HĐND) tỉnh tổ chức hội nghị tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng (theo báo Đại biểu Nhân dân). Sau những đợt như vậy, câu hỏi tự nhiên là: đã biết hỏi AI, bước tiếp theo là gì? Tập 2 là một câu trả lời.

::: {.ghinho}
**Ghi nhớ**

Tập 2 giữ nguyên sáu nền móng của Tập 1. Điều khác là mức độ hậu quả. Một câu lệnh mơ hồ gửi cho trợ lý trò chuyện chỉ cho ra một đoạn văn dở, đọc là thấy. Một câu giao việc mơ hồ cho tác tử AI lập trình có thể sửa sai hàng chục tệp, ghi đè dữ liệu, hoặc đưa thông tin nhạy cảm vào nơi công khai. Càng làm được nhiều việc với AI, kỷ luật càng phải chặt hơn.
:::

## 1.2. Bài toán có thật: đánh giá, xếp loại cán bộ, công chức hằng tháng

### 1.2.1. Quy định đòi hỏi những gì

Nghị định 335/2025/NĐ-CP ngày 21/12/2025 của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức, có hiệu lực từ 01/01/2026. Ban Thường vụ Tỉnh ủy Thanh Hóa ban hành Quy định 1053-QĐ/TU ngày 05/6/2026 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức, lao động hợp đồng gắn với đo lường, đánh giá kết quả, hiệu quả công việc trong hệ thống chính trị tỉnh, có hiệu lực kể từ ngày ký và phổ biến đến chi bộ.

Đọc hai văn bản này với con mắt của người phải tính điểm, tôi thấy sáu đòi hỏi chính:

1. **Thang điểm 100, hai nhóm tiêu chí.** Tiêu chí chung tối đa 30 điểm; kết quả thực hiện nhiệm vụ tối đa 70 điểm.
2. **Đo kết quả bằng ba tỷ lệ.** Theo khoản 2 Điều 14 Nghị định 335/2025/NĐ-CP, kết quả thực hiện nhiệm vụ đo bằng tỷ lệ phần trăm về số lượng (a), chất lượng (b) và tiến độ (c) của sản phẩm, công việc đã quy đổi. Nghị định cũng quy định công thức: công chức không giữ chức vụ lãnh đạo, quản lý tính (a+b+c)/3; công chức lãnh đạo, quản lý có thêm các thành phần d, đ, e và tính (a+b+c+d+đ+e)/6. Bản demo hiện cho lãnh đạo chia 3 và đánh giá d, đ, e ở nhóm tiêu chí chung; đây là một lựa chọn thiết kế, Chương 9 sẽ phân tích.
3. **Quy đổi và trừ điểm theo từng sản phẩm.** Khoản 5 Điều 5 Quy định 1053-QĐ/TU yêu cầu tính theo tỷ lệ sản phẩm đã quy đổi về đơn vị sản phẩm, công việc chuẩn. Mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ trường hợp có nguyên nhân khách quan được xác nhận.
4. **Ngưỡng điểm cộng với điều kiện.** Điều 20 Nghị định 335/2025/NĐ-CP đặt bốn mức: Hoàn thành xuất sắc từ 90 điểm; Hoàn thành tốt từ 70 đến dưới 90; Hoàn thành từ 50 đến dưới 70; Không hoàn thành nhiệm vụ. Điều 8 Quy định 1053-QĐ/TU bổ sung điều kiện: Hoàn thành xuất sắc cần hoàn thành 100% nhiệm vụ, ít nhất 30% vượt mức, đã khắc phục toàn bộ hạn chế lần trước; Hoàn thành tốt cần 100% nhiệm vụ đúng hạn; Hoàn thành cần 100% nhiệm vụ, số chậm không quá 20%. Xếp Không hoàn thành nếu dưới 50 điểm, hoặc người không giữ chức vụ có trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật từ khiển trách trở lên, cùng một số trường hợp khác.
5. **Trần cơ cấu.** Khoản 7 Điều 3 Quy định 1053-QĐ/TU: số Hoàn thành xuất sắc không quá 20% số Hoàn thành tốt; có ngoại lệ cho đơn vị nổi trội, và đơn vị từ 05 người trở xuống được chọn 01 người.
6. **Thời hạn cố định.** Điều 10 Quy định 1053-QĐ/TU yêu cầu hoàn thành đánh giá, xếp loại trước ngày 28 hằng tháng; riêng tháng 12 trước ngày 15/12.

Ví dụ: một công chức được giao 10 văn bản, 1 văn bản có sai sót lớn nên chỉ còn 75% điểm chất lượng; tỷ lệ chất lượng là (9 × 100 + 1 × 75) : 10 = 97,5%. Phép tính không khó. Cái khó là phải làm đúng như thế cho từng sản phẩm, từng người, từng tháng.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị định 335/2025/NĐ-CP, Điều 4: các nguyên tắc đánh giá, trong đó có nguyên tắc ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại.
- Quy định 1053-QĐ/TU, khoản 4 Điều 3: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương về đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí nên tra nguyên văn trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

Chủ trương đã rõ. Trong sách, OKR (mục tiêu và kết quả then chốt) dùng để định hướng, KPI (chỉ số đánh giá hiệu quả công việc) dùng để đo kết quả; Chương 9 giải thích vì sao không trộn hai thứ này khi chấm điểm.

### 1.2.2. Làm bằng giấy và bảng tính rời thì vướng ở đâu

Trước khi có phần mềm, việc đánh giá hằng tháng ở cơ quan chủ yếu làm trên giấy hoặc bảng tính rời rạc: tốn thời gian tổng hợp, dễ sai khi cộng điểm, chấm còn cảm tính, khó so sánh giữa các kỳ (theo Báo cáo mô tả sáng kiến tôi viết). Đối chiếu với sáu đòi hỏi ở trên, tôi thấy sáu nút thắt.

| Nút thắt | Trên giấy, bảng tính rời | Điều cần có |
|---|---|---|
| Công thức nhiều tầng | Mỗi người một tệp, công thức dễ bị sửa nhầm | Một nơi tính duy nhất, công thức được khóa |
| Điều kiện ngoài con số | Dễ bỏ sót: đủ 90 điểm chưa chắc xuất sắc | Máy tự soi điều kiện và nêu lý do |
| Trần 20% xuất sắc | Chỉ biết khi đã gom đủ cả cơ quan | Bảng tổng hợp tự cảnh báo vượt trần |
| Hai con số cho một việc | Số tự chấm và số cấp duyệt ghi đè nhau | Hai cột riêng; cột cấp duyệt là chính thức |
| Lặp lại 12 kỳ mỗi năm | Sao chép tệp, mẫu lệch dần | Kỳ mới tự chuyển danh sách, giữ nguyên mẫu |
| So sánh, tra cứu | Lục tìm tệp cũ, bản nào là bản cuối? | Lưu theo kỳ, có biểu đồ xu hướng |

Về quy mô: phân hệ đánh giá của Văn phòng hiện phục vụ 28 người, gồm 25 cán bộ, công chức, người lao động của bốn phòng và 3 lãnh đạo Văn phòng. Mỗi người khoảng 10 nhiệm vụ thì mỗi tháng có gần 300 dòng, dòng nào cũng có số lượng, chất lượng, tiến độ, hệ số.

Nút thắt thứ hai dễ gây hậu quả nhất, vì nó tạo ra những kết quả "nhìn thì đúng mà thực ra sai".

::: {.vidu}
**Ví dụ minh họa: 90,8 điểm nhưng không được xếp Hoàn thành xuất sắc**

Đây là ví dụ tôi dựng theo cách tính của phân hệ đánh giá trong hệ thống thử nghiệm, số liệu giả định. Một công chức chuyên môn có ba nhiệm vụ trong tháng. Kết quả mỗi nhiệm vụ là trung bình của ba tiêu chí số lượng (SL), chất lượng (CL), tiến độ (TĐ); "có sai sót" tính 75%, "chậm ít" tính 80%.

| Nhiệm vụ | Trọng số | SL; CL; TĐ | Kết quả |
|---|---|---|---|
| Soạn văn bản hành chính | 1,00 | 10/10; đạt chuẩn; đúng hạn | 100% |
| Báo cáo giám sát chuyên đề | 4,00 | 2/2; có sai sót; chậm ít | 85% |
| Tổng hợp ý kiến thảo luận | 2,55 | 2/3; đạt chuẩn; đúng hạn | 88,9% |

Trọng số bằng hệ số quy đổi của sản phẩm nhân với hệ số tầm quan trọng. Chỉ số KPI là trung bình có trọng số: 666,7 : 7,55 = 88,3%. Điểm nhóm kết quả nhiệm vụ là 88,3% × 70 = 61,8 điểm. Giả sử tiêu chí chung được 29 điểm, tổng là 90,8 điểm.

Con số vượt 90. Nhưng theo cách phân hệ áp điều kiện, người này chỉ được xếp Hoàn thành tốt, vì chỉ nhiệm vụ đầu đạt mức Hoàn thành tốt trở lên (hai nhiệm vụ kia ở mức Cơ bản hoàn thành) và không có nhiệm vụ nào vượt mức. Đối chiếu nguyên văn Điều 8 Quy định 1053-QĐ/TU thì ca này còn chặt hơn: mức Hoàn thành tốt đòi 100% nhiệm vụ đúng hạn, mà nhiệm vụ thứ hai bị chậm; mức Hoàn thành đòi hoàn thành 100% nhiệm vụ, mà nhiệm vụ thứ ba mới đạt 2/3 số lượng. Đây đúng là loại chỗ phải để cấp có thẩm quyền chốt cách hiểu, phần mềm không tự quyết.

Trên bảng tính rời, rất dễ có người thấy "90,8" và ghi luôn "xuất sắc". Công cụ tốt phải tự soi điều kiện và giải thích lý do bằng lời.
:::

Bài toán này đáng số hóa không phải vì phần mềm "hiện đại" hơn giấy, mà vì quy định đủ chi tiết để máy tính đúng, còn con người dễ sai khi lặp lại hàng trăm lần.

## 1.3. Từ bảng tính mô phỏng đến ứng dụng web đầu tiên

Theo lý thuyết, con đường gồm ba chặng: lập bảng tính mô phỏng để chốt cách tính, viết đặc tả để chốt yêu cầu, rồi mới làm phần mềm. Thực tế không gọn như vậy. Báo cáo mô tả sáng kiến tôi viết cuối tháng 6/2026 đã mô tả một ứng dụng chạy được với ba bộ tiêu chí; bản Đặc tả yêu cầu phần mềm, kèm bảng tính mô phỏng, đề tháng 7/2026. Hai tài liệu này cùng các quyết định danh mục sản phẩm, công việc trở thành căn cứ dựng bản vận hành hiện nay. Dưới đây tôi trình bày theo thứ tự nên làm.

### 1.3.1. Bảng tính mô phỏng: viết công thức ra để thấy chỗ hổng

Tệp `Engine_tinh_diem_KPI_mo_phong.xlsx` của dự án là một "cỗ máy tính điểm" bằng Excel, gồm bảy trang tính: Hướng dẫn, Danh mục (48 sản phẩm, công việc kèm hệ số quy đổi), Nhân sự (tám người mẫu tên giả định), Tiêu chí chung, Giao việc (24 dòng của kỳ 07/2026), Tổng hợp KPI (tự chọn chia 3 hay chia 6 theo nhóm đối tượng) và Thống kê (kiểm soát trần 20%). Chữ xanh là ô nhập liệu, chữ đen là công thức, không được sửa.

Giá trị của bảng tính nằm ở hai chỗ. Một là, nó **buộc mọi câu chữ của quy định phải biến thành công thức**. Câu chữ có thể mơ hồ, công thức thì không. "Mỗi lần sai sót lớn trừ 25%" là trừ cho từng sản phẩm hay cho cả lô? Một sản phẩm sai hai lần thì sao? Bản đặc tả đã phải chốt: trừ theo từng sản phẩm; một sản phẩm bị trừ nhiều lần thì cộng dồn, thấp nhất bằng 0.

Hai là, nó được dự kiến làm **đáp án để nghiệm thu phần mềm**. Bản đặc tả ghi bảng tính này là "bộ ca kiểm thử bắt buộc": với cùng dữ liệu đầu vào, kết quả của phần mềm phải khớp bảng tính đến hai chữ số thập phân. Giống như trước khi giao máy tính bỏ túi cho kế toán, ta thử nó bằng những phép tính đã biết đáp án. Cần nói thật: bản demo hiện hành đã chọn cách chấm đơn giản hơn (ba tiêu chí theo từng nhiệm vụ, lãnh đạo cũng chia 3), nên không còn khớp từng con số với bảng tính. Quyết định thiết kế này phải được cấp có thẩm quyền chấp thuận trước khi dùng thật; Chương 9 sẽ phân tích.

Hai câu lệnh mẫu dưới đây giúp đồng chí làm bước này cho một quy trình chấm điểm của đơn vị mình, chỉ cần trợ lý AI trò chuyện, chưa cần lập trình.

::: {.lenhmau}
**Câu lệnh mẫu 1.1 — Bóc tách văn bản quy định thành bảng công thức**

```text
VAI TRÒ: Anh/chị là chuyên viên tổ chức cán bộ, đọc văn bản rất kỹ.
BỐI CẢNH: Tôi gửi kèm [tên văn bản quy định đã ban hành, công khai].
Đơn vị tôi có [số] người, chia thành [số] nhóm đối tượng.
VIỆC: Bóc tách văn bản thành "bảng công thức", chưa lập bảng tính.
1. Liệt kê mọi đại lượng phải nhập: ai nhập, nhập khi nào.
2. Liệt kê mọi công thức tính điểm.
3. Liệt kê mọi điều kiện xếp loại không phải là con số.
4. Liệt kê mọi trần, ngưỡng, mốc thời gian.
5. Liệt kê chỗ có thể hiểu nhiều cách; mỗi chỗ nêu các cách hiểu
   và hệ quả của từng cách. KHÔNG tự chọn thay tôi.
DẠNG ĐẦU RA: 5 bảng theo 5 mục trên; cột cuối của mỗi bảng là
"Căn cứ (điều, khoản)".
RÀNG BUỘC: Chỉ dựa vào văn bản tôi gửi. Không có căn cứ thì ghi
"Không tìm thấy trong văn bản". Tuyệt đối không bịa số điều, khoản.
```
:::

Câu lệnh 1.1 chỉ dùng với văn bản đã công khai (Cấp 1). Dự thảo nội bộ thuộc ít nhất Cấp 2; có dữ liệu cá nhân hoặc thông tin hạn chế tiếp cận thì là Cấp 3, chỉ được dùng loại AI tương ứng (Tập 1, mục 7.2); khi không chắc chắn, chọn cấp cao hơn. Mục 5 của câu lệnh quan trọng nhất: AI hay "chọn đại" một cách hiểu, nên phải buộc nó bày ra các cách hiểu để người có thẩm quyền chọn.

::: {.lenhmau}
**Câu lệnh mẫu 1.2 — Thiết kế bảng tính mô phỏng kèm ca kiểm thử**

```text
VAI TRÒ: Anh/chị là chuyên viên phân tích nghiệp vụ, thạo Excel.
BỐI CẢNH: Dùng đúng "bảng công thức" chúng ta vừa thống nhất.
VIỆC: Thiết kế bảng tính mô phỏng việc chấm điểm trong một tháng.
1. Đề xuất các trang tính: Hướng dẫn, Danh mục, Nhân sự, Giao việc,
   Tổng hợp, Thống kê; mỗi trang ghi rõ tên từng cột.
2. Viết công thức Excel cho từng cột tính toán.
3. Quy ước: chữ xanh là ô nhập; chữ đen là công thức, khóa lại.
4. Tạo 6 người mẫu với tên giả định, mỗi người 3-5 nhiệm vụ. Cố ý
   tạo các ca: đủ 90 điểm nhưng không đủ điều kiện xuất sắc; có
   sản phẩm sai sót; có nhiệm vụ chậm; số người xuất sắc vượt trần.
5. Tự tính tay kết quả mong đợi của từng người để tôi đối chiếu.
DẠNG ĐẦU RA: Bảng mô tả trang tính; danh sách công thức;
bảng "ca kiểm thử" gồm đầu vào, kết quả mong đợi, lý do.
RÀNG BUỘC: Không dùng họ tên, số liệu của người thật. Chỗ nào
quy định chưa rõ thì hỏi lại tôi, không tự giả định.
```
:::

### 1.3.2. Bản đặc tả: viết ra mình cần gì, bằng tiếng Việt

Bản Đặc tả yêu cầu phần mềm của dự án viết như một văn bản gửi đơn vị phát triển phần mềm, gồm bảy chương, từ người dùng, phân quyền đến thuật toán tính điểm, lộ trình và nghiệm thu. Có những yêu cầu rất "đời": thao tác thông thường phản hồi không quá 03 giây; một cá nhân tự chấm trong kỳ không quá 10 phút; chịu tải cao điểm các ngày 24 đến 28 hằng tháng.

Điều giá trị nhất là một nguyên tắc thiết kế gói trong một câu: mọi khác biệt giữa ba nhóm đối tượng chỉ được xử lý tại ba điểm, gồm phần danh mục được phép chọn, mẫu phiếu tiêu chí chung và công thức tính KPI. Câu ấy giúp người làm phần mềm, dù là doanh nghiệp hay tác tử AI, khỏi rải ngoại lệ khắp nơi. Chương 8 sẽ hướng dẫn cách viết đặc tả cùng AI.

### 1.3.3. Ứng dụng web đầu tiên: đăng nhập, lưu theo kỳ, xuất phiếu Word

Chương 2 sẽ giải thích kỹ ứng dụng web là gì. Tạm hình dung nó như một trụ sở: giao diện là phòng tiếp dân, cơ sở dữ liệu (database) là kho lưu trữ hồ sơ, kho mã nguồn (repository) là sổ lưu bản vẽ thiết kế có ghi lịch sử từng lần sửa.

Những phiên bản đầu của phân hệ đánh giá làm được các việc chính sau:

- **Đăng nhập bằng email và mật khẩu**, kèm tài khoản khách để thử chấm điểm mà không lưu lên máy chủ.
- **Lưu theo kỳ.** Mỗi tháng là một "bìa hồ sơ" riêng trên máy chủ. Bản hiện hành có thêm khóa chống ghi đè (chỉ cho ghi khi chưa ai khác sửa bìa hồ sơ đó kể từ lúc mình mở ra) và tự lưu 0,9 giây sau mỗi thay đổi.
- **Chấm theo danh mục có hệ số.** Kết quả nhiệm vụ chọn từ danh mục sản phẩm, công việc có hệ số quy đổi.
- **Không bỏ bảng tính.** Một chức năng sớm là đọc bảng kiểm đếm công việc trên Google Sheet vào mục theo dõi công việc.

Các đợt sau bổ sung những thứ làm nên "chất hành chính" của phần mềm. Mỗi nhiệm vụ có hai cột: Tự đánh giá do cán bộ nhập, Cấp duyệt do cấp có thẩm quyền rà soát; cột Cấp duyệt mặc định kế thừa cột Tự đánh giá và là con số chính thức. Người có thẩm quyền bấm "Phê duyệt & xuất phiếu" thì phần mềm ghi lại họ tên, vai trò, ngày phê duyệt; sửa điểm sau đó thì phê duyệt tự động bị gỡ. Phiếu Word có đủ bảng tiêu chí, bảng nhiệm vụ, lý do xếp loại và hai khối chữ ký. Khối "Điều kiện xếp loại chất lượng (Điều 8)" hiện ngay khi chấm, kèm ô đỏ "Chênh lệch điểm số và xếp loại" khi điểm số cao hơn mức xếp loại thực tế, như tình huống 90,8 điểm ở trên.

Hạ tầng dùng ở mức miễn phí: mã nguồn đặt trên GitHub; mỗi lần đẩy mã lên, nền tảng Vercel tự dựng lại và triển khai (deploy) trong khoảng 1 đến 2 phút; cơ sở dữ liệu và đăng nhập dùng Supabase. Gói miễn phí có điều kiện, chẳng hạn cơ sở dữ liệu miễn phí của Supabase tự tạm dừng sau một tuần không hoạt động (thông tin tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). Chi phí được trình bày ở Chương 5 và Chương 17, rủi ro ở Chương 19.

::: {.cauchuyen}
**Câu chuyện thực tế: nhiệm vụ làm được 9/10 bị coi là "không hoàn thành"**

Khi tự động áp điều kiện xếp loại, phần mềm từng có một cách hiểu quá chặt về điều kiện Không hoàn thành nhiệm vụ. Nhiệm vụ được giao 10 sản phẩm, làm xong 9, bị coi là "không hoàn thành", và cán bộ điểm cao bị ép xuống mức Không hoàn thành nhiệm vụ, vì mã do AI viết đã hiểu "không hoàn thành" là "chưa đạt đủ 100%".

Cách sửa là xét theo tỷ lệ hoàn thành của từng nhiệm vụ: dưới 50% mới tính là không hoàn thành nhiệm vụ đó; từ 50% đến dưới 100% là chưa đạt đủ số lượng. Đây là một lựa chọn diễn giải cho bản demo, được ghi công khai trong phần hướng dẫn; có hướng dẫn chính thức khác thì phải sửa theo.

Những chỗ khác có thể hiểu nhiều cách cũng được hỏi lại tôi rồi mới chốt, chẳng hạn ô "bị kỷ luật" chỉ ép mức xếp loại, không trừ vào tổng điểm. Bài học: AI viết mã nhanh, nhưng quyền diễn giải câu chữ quy định thuộc về người chịu trách nhiệm.
:::

## 1.4. Một phân hệ kéo theo phân hệ khác

Tôi không vẽ sẵn từ đầu một hệ thống 13 phân hệ. Mỗi phân hệ ra đời vì một nhu cầu cụ thể, thường do phân hệ trước "kéo" ra. Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy Thanh Hóa về đánh giá định kỳ hằng quý dẫn tới phân hệ Kiểm điểm cho 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý. Hai phân hệ cùng cần danh sách người, nên phân hệ Quản lý cán bộ (hồ sơ Mẫu 2C) được nâng lên làm danh sách "một mối". Dự thảo Khung tiêu chí đánh giá HĐND nhiệm kỳ 2026–2031 dẫn tới phân hệ để HĐND tỉnh và các xã, phường tự chấm, kéo theo một Trang chủ dạng cổng. Nhu cầu xem số liệu trên điện thoại dẫn tới bot Telegram, rồi bot trên Zalo Official Account. Nhiệm vụ đột phá đã đăng ký dẫn tới phân hệ Sổ tay AI; chính cuốn Tập 1 dẫn tới phân hệ Tủ sách.

| Phân hệ | Việc chính | Ghi chú |
|---|---|---|
| Biểu quyết Online | Biểu quyết, kiểm phiếu tức thì | Phiếu mô phỏng; đại biểu đánh số, không gắn tên |
| Đánh giá OKR/KPI | Chấm điểm hằng tháng 28 người | Phân hệ đầu tiên |
| Kiểm điểm đảng viên | Kế hoạch và tự đánh giá hằng quý | 15 đồng chí |
| Tiêu chí HĐND | HĐND tỉnh, xã, phường tự chấm | Theo dự thảo Khung tiêu chí |
| Trợ lý AI nghiệp vụ dân cử | Soạn thảo, soát xét, thẩm tra | Hạn mức lượt mỗi ngày |
| Sổ tay AI | Tra cứu có trích dẫn nguồn | Đưa vào 22/10/2026; thí điểm đến 10/12/2026 |
| Tủ sách | Giới thiệu sách của cán bộ cơ quan | Thêm ngày 26/10/2026 |
| Giám sát số | Giám sát nghị quyết cấp xã | Hệ thống riêng, liên kết |
| Một dữ liệu | Số liệu vào kho một lần | Hệ thống riêng, liên kết |
| Lịch công tác tuần | Lập, duyệt lịch, điều xe | Hệ thống riêng, liên kết |
| Quản lý cán bộ | Hồ sơ Mẫu 2C, nhắc việc | Chỉ Quản trị |
| Hướng dẫn & hỗ trợ | Hướng dẫn toàn hệ thống | Có cơ sở pháp lý |
| Phòng thử nghiệm | Thử các bộ tiêu chí | Singapore; Cổ điển, Cải tiến đang tạm ẩn |

Ngoài 13 thẻ trên còn ba thành phần khác: khung chat "Người hướng dẫn" ở Trang chủ (kịch bản soạn sẵn không tốn chi phí, cộng ba lượt hỏi AI mỗi ngày); bot Telegram và Zalo đọc số liệu thật của nhiều phân hệ; bản tin pháp luật hằng ngày lấy tin từ nguồn RSS chính thống, vẽ thành ảnh bằng chương trình, không gọi AI. Riêng Sổ tay AI dùng Gemini Notebook (trước đây là NotebookLM, địa chỉ hiện nay là `notebook.google.com`) làm nơi hỏi đáp chính; Google đổi tên sản phẩm ngày 16/7/2026, giao diện phân hệ hiện vẫn ghi tên cũ.

Nhật ký dự án không phải mục nào cũng ghi ngày, nên bảng dưới đây xếp theo thứ tự các mục trong nhật ký và chỉ ghi ngày ở mốc có căn cứ.

| Thời điểm | Mốc chính |
|---|---|
| Giai đoạn đầu | Phân hệ đánh giá theo Nghị định 335/2025/NĐ-CP; đăng nhập; lưu theo kỳ |
| Từ tháng 6/2026 | Số hóa Quy định 1053-QĐ/TU; kỳ dữ liệu sớm nhất còn lưu |
| Cuối tháng 6/2026 | Báo cáo mô tả sáng kiến: ứng dụng có ba bộ tiêu chí |
| Tháng 7/2026 | Đặc tả yêu cầu phần mềm, kèm bảng tính mô phỏng; sau 02/7, phân hệ Kiểm điểm |
| Trước 13/8/2026 | Quản lý cán bộ; Trang chủ dạng cổng; Tiêu chí HĐND; bot Telegram |
| 13/8/2026 | Tách kho dữ liệu theo phân hệ; gộp danh sách cán bộ |
| Sau 13/8/2026 | Lịch công tác; Zalo; Giám sát số; Trợ lý AI; Một dữ liệu; Biểu quyết |
| 09/9/2026 | Ngày sớm nhất trong kho lưu trữ bản tin pháp luật |
| 28/9/2026 | Vá lỗi sập đầu tháng; dựng lại Kiểm điểm theo biểu mẫu giấy |
| 22/10/2026 | Phân hệ Sổ tay AI |
| 26/10/2026 | Phân hệ Tủ sách |

Đếm ngày 26/10/2026, kho mã có khoảng 21.400 dòng mã JavaScript (chưa tính lược đồ cơ sở dữ liệu, bộ sinh bản tin viết bằng Python và ba hệ thống liên kết); tệp lớn nhất dài gần 3.400 dòng. Dữ liệu nghiệp vụ của phần chạy tại hdndthkpi.vercel.app nằm trong một bảng cơ sở dữ liệu duy nhất, mỗi "dòng" là một khối hồ sơ. Bộ nhớ dự án gồm một tệp tổng quan và bảy tệp quy tắc; nhật ký thay đổi có hơn 100 mục; riêng bot trò chuyện có 199 phép kiểm thử tự động.

Lực kéo giữa các phân hệ cũng kéo theo lỗi. Ngày 13/8/2026, việc tách kho dữ liệu riêng cho từng phân hệ làm bot trò chuyện "mất" hẳn phân hệ Kiểm điểm, vì bot dò tên kho theo một quy tắc riêng; việc gộp danh sách cán bộ về một mối làm lộ lỗi trùng họ tên: hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, danh sách còn 27 thay vì 28 người. Từ đó dự án có một quy tắc bắt buộc mà Chương 7 sẽ kể kỹ: sửa xong một chỗ, phải tự hỏi "chỗ nào khác đang đọc, ghi thứ vừa đổi?" rồi kiểm chứng thật.

## 1.5. Điều thay đổi lớn nhất không nằm ở phần mềm

### 1.5.1. Từ "đặt hàng phần mềm" sang "tự làm thử – đo – sửa"

Con đường quen thuộc là: viết yêu cầu, tìm đơn vị phát triển, ký hợp đồng, chờ, nghiệm thu, rồi gửi yêu cầu sửa và lại chờ. Bản đặc tả của dự án cũng dự kiến như thế: thí điểm 03 tháng tại một số cơ quan, hoàn thiện, rồi triển khai diện rộng theo chỉ đạo của Ban Thường vụ Tỉnh ủy. Con đường đó vẫn cần cho một hệ thống chính thức toàn tỉnh.

Điều mới là trước khi đặt hàng, người làm nghiệp vụ có thể tự dựng một bản chạy được, dùng thử trên dữ liệu mẫu, thấy chỗ sai và sửa ngay. Chẳng hạn, cách chấm kết quả nhiệm vụ đã đổi từ chọn một "mức độ hoàn thành" theo cảm nhận sang ba tiêu chí số lượng, chất lượng, tiến độ để phần mềm tự suy ra mức độ, và được thử ngay, không chờ một vòng hợp đồng mới.

Còn chữ "đo" thì phải nói cho thật. Dự án chưa đo được phần mềm tiết kiệm bao nhiêu phần trăm thời gian, nên tôi không viết con số nào như vậy. Thứ được đo là độ đúng: hàng trăm phép kiểm thử tự động, thời gian từng khâu khi bot trả lời, tệp Word xuất ra được đọc lại để đối chiếu. Chỉ tiêu giảm ít nhất 30% thời gian tra cứu của Sổ tay AI hiện vẫn là chỉ tiêu, chưa phải kết quả.

### 1.5.2. Người hiểu nghiệp vụ là người làm ra công cụ tốt nhất

Phân hệ Kiểm điểm ban đầu được dựng theo câu chữ của Hướng dẫn 03-HD/TU. Ngày 28/9/2026, tôi đưa chính bản tự đánh giá Quý III và kế hoạch Quý IV năm 2026 của mình vào đối chiếu (các tệp này được chặn khỏi kho mã công khai) và thấy phần mềm lệch biểu mẫu giấy ở bốn chỗ lớn. Quy trình thật có hai bước (đầu kỳ lập kế hoạch, cuối kỳ tự đánh giá trên kế hoạch đó), phần mềm chỉ có một. Điểm tối đa từng trục do cá nhân đề xuất, trình tập thể lãnh đạo duyệt và đổi theo quý, phần mềm lại đóng cứng. Nhóm tiêu chí chung chỉ đánh dấu "Đảm bảo" hoặc "Không đảm bảo", phần mềm lại cho nhập điểm lẻ. Mỗi nhiệm vụ phải đủ năm cột của biểu mẫu. Ngoài ra, đây là văn bản của Đảng nên tiêu đề phải là của tổ chức Đảng, trong khi phần mềm in tên cơ quan hành chính.

Không tác tử AI nào tự biết những điều này. Tri thức về biểu mẫu nào đang dùng thật, câu chữ nào là của Đảng, của Nhà nước do người cán bộ mang vào.

### 1.5.3. Và cả những lần sập

Hệ thống đã sập, đã trả lời sai, đã lặng lẽ không chạy.

::: {.cauchuyen}
**Câu chuyện thực tế: phân hệ "chết" vào ngày đầu tháng**

Từ ngày 01/9/2026, mở phân hệ Đánh giá OKR/KPI, Kiểm điểm hay Quản lý cán bộ đều chỉ thấy trang trắng kèm một dòng lỗi tiếng Anh. Máy chủ có dữ liệu tháng 6, 7, 8 nhưng chưa có tháng 9. Một dòng mã ra lệnh "lấy mã của người đứng đầu danh sách", trong khi danh sách của kỳ mới còn trống. Giống như văn thư được dặn sáng nào cũng đọc tên trên tờ trên cùng của ngăn kéo; ngày đầu tháng ngăn kéo trống, văn thư đứng im, cả phòng đứng theo.

Bản vá được ghi nhận ngày 28/9/2026: thêm điều kiện "có thì lấy, không thì để trống", và cho kỳ mới tự chuyển danh sách cán bộ từ kỳ trước. Trước đó, chỉ Quản trị mới bấm được nút sao chép danh sách. Bài học: lỗi theo lịch không lộ ra lúc thử, chỉ lộ ra khi sang kỳ mới.
:::

Nhật ký còn ghi những lần khác. Bot Zalo từng trả lời hai lần một câu hỏi vì Zalo tự gửi lại tin khi chờ lâu, làm cạn nhanh hạn mức câu hỏi trong ngày. Bản tin pháp luật không ra sáng 10/9/2026 vì một điều kiện chạy tự động phản tác dụng. Một tác vụ được coi là "chạy hằng ngày" nhưng chưa từng đẩy được ảnh nào lên kho mã. Phần lớn sự cố đã thành một quy tắc hoặc một phép kiểm; vẫn còn chỗ bài học chưa được áp đồng đều, Chương 7 và Chương 20 sẽ kể.

::: {.canhbao}
**Cảnh báo**

- Hệ thống mô tả trong sách là bản demo thử nghiệm, sử dụng nội bộ. Nó không thay thế quy trình, văn bản chính thức hay phần mềm dùng thống nhất do cấp có thẩm quyền triển khai; khi đã có hệ thống chính thức, dữ liệu chính thức phải theo hệ thống đó.
- Điểm số, xếp loại hiển thị là dữ liệu mô phỏng. Danh sách cán bộ trên bản demo dùng họ tên, chức danh thật để thử việc đồng bộ danh sách; đây là điểm tôi phải xử lý (ẩn danh dữ liệu mẫu, hoặc thu hẹp quyền xem) trước khi chia sẻ rộng, Chương 19 sẽ trở lại. Đồng chí làm bản demo thì không nhập thông tin mật, không dùng dữ liệu cá nhân thật khi chưa có hạ tầng và quy chế bảo đảm.
- Dám nghĩ, dám làm không có nghĩa là được miễn trách nhiệm. Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị thể hiện tinh thần chấp nhận rủi ro, chấp nhận độ trễ trong nghiên cứu và cơ chế thử nghiệm có kiểm soát. Tuy vậy, chấp nhận rủi ro phải theo cơ chế, quy trình pháp luật quy định; ứng dụng tự làm rồi đưa vào dùng ngoài khuôn khổ đó không mặc nhiên được miễn trách nhiệm (Chương 3).
:::

## 1.6. Tập 2 dành cho ai và hứa hẹn điều gì

Tập 2 viết cho ba nhóm người đọc. Lãnh đạo cần hiểu để quyết định, không cần tự gõ lệnh: nên đọc các Chương 1, 3, 4, 17, 19, 20 và mọi hộp "Dành cho lãnh đạo". Cán bộ dùng AI hằng ngày nên đọc các Chương 1, 2, 3, 16, 18 và Phụ lục 2. Cán bộ muốn tự làm ứng dụng nên đọc tuần tự, nhất là Phần thứ hai và Phần thứ ba.

| Tập 2 hứa | Tập 2 không hứa |
|---|---|
| Đủ hiểu biết để giao việc và nghiệm thu một ứng dụng nhỏ | Biến người đọc thành kỹ sư phần mềm |
| Quy trình, câu lệnh mẫu dùng được ngay | Thay thế đơn vị chuyên trách công nghệ thông tin |
| Kể cả những lần thất bại và cách sửa | Con số "tiết kiệm x%" khi chưa đo được |
| Căn cứ pháp lý đối chiếu đến 26/10/2026 | Giá, tính năng công cụ giữ nguyên lâu dài |

::: {.lanhdao}
**Dành cho lãnh đạo**

- Bài toán đầu tiên nên là việc lặp lại hằng tháng, có quy định rõ, có biểu mẫu sẵn, như chấm điểm cán bộ.
- Bản demo do cán bộ tự làm giúp làm rõ yêu cầu và thử cách làm mới; nó không thay hệ thống chính thức.
- Hãy hỏi ngay từ đầu: dữ liệu thuộc cấp nào trong 4 cấp, nằm ở đâu, ai được đọc, ai được ghi, ai chịu trách nhiệm duy trì.
- Nút phê duyệt và quyết định xếp loại luôn thuộc về cấp có thẩm quyền, không thuộc về phần mềm.
:::

## Tóm tắt chương 1

::: {.tomtat}
1. Tập 2 kế thừa sáu nền móng của Tập 1, từ khung VAI-BỐI-VIỆC-DẠNG-RÀNG (mục 3.2) đến phân loại dữ liệu 4 cấp (7.1–7.2) và con người trong vòng lặp (7.5); Tập 1 chưa bàn đến việc làm ra phần mềm.
2. Bài toán khởi đầu là đánh giá, xếp loại hằng tháng theo Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU: thang 30/70, ba tỷ lệ số lượng – chất lượng – tiến độ, điều kiện xếp loại, trần 20%, mốc trước ngày 28.
3. Làm bằng giấy và bảng tính rời dễ sai nhất ở các điều kiện ngoài con số: 90,8 điểm vẫn có thể chỉ là Hoàn thành tốt, và cách hiểu điều kiện phải do cấp có thẩm quyền chốt.
4. Bảng tính mô phỏng buộc câu chữ quy định thành công thức và được dự kiến làm đáp án để nghiệm thu phần mềm.
5. Từ một phân hệ, hệ thống lớn dần thành 13 phân hệ cùng bot trò chuyện và bản tin pháp luật, khoảng 21.400 dòng mã JavaScript.
6. Điều thay đổi lớn nhất là cách làm: tự làm thử, kiểm chứng, sửa; người hiểu nghiệp vụ là người làm ra công cụ tốt nhất.
7. Thất bại là một phần của hành trình; mỗi sự cố nên thành một quy tắc hoặc một phép kiểm.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong công việc của đồng chí, việc nào lặp lại hằng tháng, có quy định rõ và hay phải cộng, đối chiếu bằng tay?
2. Lấy một văn bản quy định công khai liên quan đến việc đó, dùng Câu lệnh mẫu 1.1 để bóc tách. AI đã chỉ ra những chỗ có thể hiểu nhiều cách nào? Ai có thẩm quyền chốt cách hiểu?
3. Tự tính lại ví dụ 90,8 điểm ở mục 1.2.2. Nếu muốn được xếp Hoàn thành xuất sắc, người đó cần thay đổi điều gì?
4. Vì sao bảng tính mô phỏng nên có "ca kiểm thử" với kết quả mong đợi tính tay từ trước?
5. Nếu đơn vị của đồng chí làm một bản demo, những nhãn cảnh báo nào phải hiện trên màn hình?
6. Xếp các loại dữ liệu sau vào 4 cấp của Tập 1 (mục 7.2): nghị quyết đã ban hành; dự thảo báo cáo nội bộ; bảng điểm có họ tên cán bộ; đơn tố cáo. Với mỗi loại, được dùng loại AI nào?
