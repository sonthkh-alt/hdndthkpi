# Chương 1. Câu chuyện bắt đầu từ một bảng tính chấm điểm

::: {.muctieu}
**Mục tiêu của chương**

- Nhắc lại ngắn gọn bốn nền móng của Tập 1 mà Tập 2 tiếp tục dùng: khung lệnh V-B-V-D-R, con người trong vòng lặp, phân loại dữ liệu vùng ĐỎ/VÀNG/XANH và "5 KHÔNG" của AI.
- Hiểu bài toán có thật đã mở đầu hành trình: đánh giá, xếp loại cán bộ, công chức hằng tháng theo Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU của Ban Thường vụ Tỉnh ủy Thanh Hóa.
- Thấy được con đường đi từ bảng tính mô phỏng, qua bản đặc tả, tới ứng dụng web đầu tiên rồi thành hệ thống nhiều phân hệ.
- Nhận ra điều thay đổi lớn nhất là cách nghĩ, cách làm việc, kể cả cách nhìn thẳng vào những lần thất bại.
- Biết Tập 2 hứa điều gì, không hứa điều gì, để chọn lộ trình đọc phù hợp.

Dành cho: mọi người đọc. Lãnh đạo nên đọc kỹ các mục 1.2, 1.5 và 1.6.
:::

Cuối mỗi tháng, ở nhiều cơ quan, có một việc lặp lại đều như lịch: chấm điểm, xếp loại cán bộ, công chức. Mỗi người tự kê nhiệm vụ đã làm, tự chấm, nộp phiếu. Lãnh đạo phòng nhận xét. Lãnh đạo cơ quan xem xét, quyết định. Bộ phận tổng hợp cộng điểm, soi điều kiện, lập danh sách, công khai kết quả. Sang tháng sau, mọi thứ lại bắt đầu từ đầu.

Ở Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), câu chuyện của cuốn sách này bắt đầu chính từ công việc ấy. Không phải từ một đề án lớn, mà từ một câu hỏi rất cụ thể: làm sao để việc chấm điểm hằng tháng đúng quy định hơn, nhanh hơn, và ít phải tranh luận về con số hơn?

Từ câu hỏi đó, trong năm 2026, tôi, một cán bộ làm công tác tham mưu chứ không phải lập trình viên, đã cùng một tác tử AI lập trình (AI coding agent) dựng nên hệ thống thử nghiệm của Văn phòng tại địa chỉ `https://hdndthkpi.vercel.app`. Đến tháng 10/2026, Trang chủ của hệ thống có 12 thẻ phân hệ, kèm hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự động hằng ngày. Chương này kể lại hành trình ấy một cách trung thực: cái làm được, cái chưa làm được, và cả những lần hệ thống sập.

## 1.1. Nhìn lại Tập 1: những gì chúng ta đã có

Tập 1, "Trí tuệ nhân tạo trong công tác tham mưu — Cẩm nang thực hành cho kỷ nguyên số", hướng dẫn cán bộ dùng trợ lý AI trò chuyện (chatbot) để soạn thảo, tổng hợp, rà soát văn bản. Thông điệp xuyên suốt là: đừng dùng AI như một công cụ tìm kiếm, hãy dùng AI như một thư ký cao cấp, và người cán bộ luôn chịu trách nhiệm cuối cùng. Tập 2 không viết lại những nội dung đó, chỉ nhắc bốn nền móng mà cả cuốn sách đứng trên.

**Thứ nhất, khung lệnh V-B-V-D-R.** Một câu lệnh (prompt) tốt có năm thành phần: VAI (giao cho AI vai trò gì), BỐI cảnh (tình hình, tài liệu nền), VIỆC (nhiệm vụ cụ thể), DẠNG (định dạng kết quả), RÀNG buộc (giới hạn, điều cấm). Ở Tập 2, khung này vẫn dùng nguyên vẹn, chỉ thêm một thành phần mới là "Nghiệm thu", tức tiêu chí để biết việc đã xong và đạt. Chương 6 sẽ trình bày kỹ.

**Thứ hai, con người trong vòng lặp (Human-in-the-loop).** AI đề xuất: viết nháp, gắn cờ lỗi, phân loại dữ liệu. Con người duyệt và sửa. Con người ký và quyết định. Khi chuyển sang làm phần mềm, nguyên tắc này trở thành một đòi hỏi về thiết kế: nút "phê duyệt" luôn thuộc về con người, phần mềm không tự xếp loại thay cấp có thẩm quyền. Trong sách, tôi gọi đó là nguyên tắc máy đề xuất – người quyết định.

**Thứ ba, kỷ luật dữ liệu vùng ĐỎ/VÀNG/XANH.** Vùng ĐỎ gồm tài liệu mật, đơn thư tố cáo, hồ sơ nhân sự, dữ liệu cá nhân nhạy cảm: tuyệt đối không đưa lên AI công cộng. Vùng VÀNG là tài liệu nội bộ, dự thảo chưa chốt: phải ẩn danh trước khi dùng. Vùng XANH là thông tin công khai như văn bản đã ban hành: dùng được. Khi tự làm ứng dụng, kỷ luật này còn có nghĩa là không để dữ liệu nhạy cảm trong mã nguồn, không nạp nó vào ngữ cảnh gửi cho AI, không mở quyền đọc cho người không có phận sự.

**Thứ tư, "5 KHÔNG" của AI.** AI không tự kiểm tra được tính chính xác của số liệu; không biết văn bản pháp luật vừa ban hành; không thay được việc chất vấn, làm việc trực tiếp với các sở, ngành; không có thẩm quyền pháp lý; không có kinh nghiệm đặc thù của địa phương. Năm điều này vẫn đúng khi AI viết phần mềm: tác tử AI viết mã rất nhanh, nhưng không biết biểu mẫu nào cơ quan đang thật sự dùng, quy định nào vừa sửa.

Bảng dưới đây cho thấy mỗi nền móng "chuyển hóa" thế nào khi chúng ta bước từ dùng AI sang cùng AI làm ra công cụ.

| Nền móng ở Tập 1 | Khi dùng AI trò chuyện | Khi cùng AI làm ứng dụng |
|---|---|---|
| Khung lệnh V-B-V-D-R | Viết câu lệnh soạn văn bản | Viết phiếu giao việc cho tác tử, thêm tiêu chí nghiệm thu |
| Con người trong vòng lặp | Người duyệt, sửa, ký văn bản | Nút phê duyệt luôn của người; máy chỉ tính và đề xuất |
| Vùng ĐỎ/VÀNG/XANH | Không dán dữ liệu mật vào khung chat | Không để dữ liệu nhạy cảm trong mã nguồn, trong ngữ cảnh AI |
| 5 KHÔNG của AI | Kiểm chứng câu trả lời | Kiểm thử, đối chiếu biểu mẫu thật, thử trên bản chạy thật |
| Chống "tô hồng" | Ràng buộc văn phong trung lập | Gắn nhãn "bản demo", "dữ liệu mô phỏng" ở mọi nơi |

Ngày 7/5/2026, Thường trực Hội đồng nhân dân (HĐND) tỉnh tổ chức hội nghị tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng. Sau những đợt như vậy, câu hỏi tự nhiên là: đã biết hỏi AI rồi, bước tiếp theo là gì? Tập 2 là một câu trả lời cho câu hỏi đó.

::: {.ghinho}
**Ghi nhớ**

Tập 2 giữ nguyên bốn nền móng của Tập 1. Điều khác là mức độ hậu quả. Một câu lệnh mơ hồ gửi cho trợ lý trò chuyện chỉ cho ra một đoạn văn dở, đọc là thấy. Một câu giao việc mơ hồ cho tác tử AI lập trình có thể sửa sai hàng chục tệp, ghi đè dữ liệu, hoặc đưa thông tin nhạy cảm vào nơi công khai. Càng làm được nhiều việc với AI, kỷ luật càng phải chặt hơn.
:::

## 1.2. Bài toán có thật: đánh giá, xếp loại cán bộ, công chức hằng tháng

### 1.2.1. Quy định đòi hỏi những gì

Năm 2026, công tác đánh giá, xếp loại cán bộ, công chức có những thay đổi lớn. Nghị định 335/2025/NĐ-CP ngày 21/12/2025 của Chính phủ quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức, có hiệu lực từ 01/01/2026. Ban Thường vụ Tỉnh ủy Thanh Hóa ban hành Quy định 1053-QĐ/TU ngày 05/6/2026 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức, lao động hợp đồng gắn với đo lường, đánh giá kết quả, hiệu quả công việc trong hệ thống chính trị tỉnh, có hiệu lực kể từ ngày ký và phổ biến đến chi bộ.

Đọc hai văn bản này với con mắt của người phải tính điểm, tôi thấy sáu đòi hỏi chính:

1. **Thang điểm 100, hai nhóm tiêu chí.** Tiêu chí chung tối đa 30 điểm; kết quả thực hiện nhiệm vụ tối đa 70 điểm.
2. **Đo kết quả bằng ba tỷ lệ.** Theo khoản 2 Điều 14 Nghị định 335/2025/NĐ-CP, kết quả thực hiện nhiệm vụ đo bằng tỷ lệ phần trăm về số lượng (a), chất lượng (b) và tiến độ (c) của sản phẩm, công việc đã quy đổi trong tháng hoặc quý. Công chức không giữ chức vụ lãnh đạo, quản lý tính (a+b+c)/3. Công chức lãnh đạo, quản lý có thêm các thành phần d, đ, e và tính (a+b+c+d+đ+e)/6.
3. **Quy đổi và trừ điểm theo từng sản phẩm.** Khoản 5 Điều 5 Quy định 1053-QĐ/TU yêu cầu tính số lượng, chất lượng, tiến độ theo tỷ lệ phần trăm sản phẩm đã quy đổi về đơn vị sản phẩm, công việc chuẩn. Mỗi lần sai sót lớn trừ 25% điểm chất lượng, mỗi lần chậm trừ 25% điểm tiến độ của chính sản phẩm đó, trừ trường hợp có nguyên nhân khách quan được xác nhận.
4. **Ngưỡng điểm cộng với điều kiện.** Điều 20 Nghị định 335/2025/NĐ-CP đặt bốn mức: Hoàn thành xuất sắc từ 90 điểm; Hoàn thành tốt từ 70 đến dưới 90; Hoàn thành từ 50 đến dưới 70; Không hoàn thành nhiệm vụ. Điều 8 Quy định 1053-QĐ/TU bổ sung điều kiện cho từng mức. Muốn Hoàn thành xuất sắc phải từ 90 điểm, hoàn thành 100% nhiệm vụ, ít nhất 30% nhiệm vụ vượt mức, và đã khắc phục toàn bộ hạn chế chỉ ra ở lần trước. Xếp Không hoàn thành nếu dưới 50 điểm, hoặc người không giữ chức vụ có trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật từ khiển trách trở lên, cùng một số trường hợp khác.
5. **Trần cơ cấu.** Khoản 7 Điều 3 Quy định 1053-QĐ/TU: số Hoàn thành xuất sắc không quá 20% số Hoàn thành tốt. Có ngoại lệ cho đơn vị nổi trội, và đơn vị từ 05 người trở xuống được chọn 01 người.
6. **Thời hạn cố định.** Điều 10 Quy định 1053-QĐ/TU yêu cầu hoàn thành đánh giá, xếp loại trước ngày 28 hằng tháng; riêng tháng 12 hoàn thành trước ngày 15/12.

Một ví dụ nhỏ cho thấy độ chi li của cách tính. Một công chức được giao 10 văn bản, trong đó 1 văn bản có sai sót lớn. Văn bản đó chỉ còn 75% điểm chất lượng, chín văn bản còn lại 100%. Tỷ lệ chất lượng là (9 × 100 + 1 × 75) : 10 = 97,5%. Phép tính không khó. Cái khó là phải làm đúng như thế cho từng sản phẩm, từng người, từng tháng.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị định 335/2025/NĐ-CP ngày 21/12/2025 của Chính phủ, hiệu lực từ 01/01/2026. Điều 4 nêu các nguyên tắc đánh giá, trong đó có nguyên tắc ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại.
- Quy định 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa, khoản 4 Điều 3: "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương về đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý, điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".

Các văn bản được đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí nên tra nguyên văn trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

Chủ trương đã rõ: các văn bản khuyến khích dùng công nghệ số trong theo dõi, chấm điểm. Trong sách, OKR (mục tiêu và kết quả then chốt) dùng để định hướng, còn KPI (chỉ số đánh giá hiệu quả công việc) dùng để đo kết quả; Chương 9 sẽ giải thích vì sao không trộn hai thứ này khi chấm điểm. Câu hỏi còn lại là làm thế nào cho đúng.

### 1.2.2. Làm bằng giấy và bảng tính rời thì vướng ở đâu

Trước khi có phần mềm, việc đánh giá hằng tháng ở cơ quan chủ yếu làm trên giấy hoặc trên các bảng tính rời rạc. Báo cáo mô tả sáng kiến mà tôi viết đã nêu các hạn chế: tốn nhiều thời gian tổng hợp, dễ sai sót khi cộng điểm và chuyển mức xếp loại; chấm còn cảm tính, thiếu căn cứ định lượng thống nhất; khó gắn kết quả của cá nhân với mục tiêu chung của cơ quan; khó lưu trữ, tra cứu, so sánh giữa các kỳ.

Đối chiếu sáu đòi hỏi ở trên với cách làm thủ công, tôi thấy sáu nút thắt cụ thể.

| Nút thắt | Trên giấy, bảng tính rời | Điều cần có |
|---|---|---|
| Công thức nhiều tầng | Mỗi người một tệp, công thức dễ bị sửa nhầm | Một nơi tính duy nhất, công thức được khóa |
| Điều kiện ngoài con số | Dễ bỏ sót: đủ 90 điểm chưa chắc xuất sắc | Máy tự soi điều kiện và nêu lý do |
| Trần 20% xuất sắc | Chỉ biết khi đã gom đủ cả cơ quan | Bảng tổng hợp tự cảnh báo vượt trần |
| Hai con số cho một việc | Số tự chấm và số cấp duyệt ghi đè nhau | Hai cột riêng; cột cấp duyệt là chính thức |
| Lặp lại 12 kỳ mỗi năm | Sao chép tệp, mẫu lệch dần | Kỳ mới tự chuyển danh sách, giữ nguyên mẫu |
| So sánh, tra cứu | Lục tìm tệp cũ, bản nào là bản cuối? | Lưu theo kỳ, có biểu đồ xu hướng |

Hãy hình dung quy mô. Phân hệ đánh giá của Văn phòng hiện phục vụ 28 người: 25 cán bộ, công chức, người lao động của bốn phòng và 3 lãnh đạo Văn phòng. Nếu mỗi người có khoảng 10 nhiệm vụ trong tháng, mỗi tháng sẽ có gần 300 dòng nhiệm vụ, dòng nào cũng có số lượng, chất lượng, tiến độ, hệ số. Cộng đúng đã khó; soi đủ điều kiện xếp loại cho từng người còn khó hơn.

Nút thắt thứ hai là nút đáng sợ nhất, vì nó tạo ra những kết quả "nhìn thì đúng mà thực ra sai".

::: {.vidu}
**Ví dụ minh họa: 90,8 điểm nhưng không được xếp Hoàn thành xuất sắc**

Ví dụ này theo cách tính của phân hệ đánh giá trong hệ thống thử nghiệm và lấy theo ví dụ trong một dự thảo hướng dẫn lập danh mục sản phẩm, công việc. Một công chức chuyên môn có ba nhiệm vụ trong tháng. Kết quả mỗi nhiệm vụ là trung bình của ba tiêu chí số lượng, chất lượng, tiến độ.

| Nhiệm vụ | Trọng số | Kết quả | Mức độ |
|---|---|---|---|
| Soạn thảo văn bản hành chính | 1,00 | 100% | Hoàn thành tốt |
| Báo cáo giám sát chuyên đề | 4,00 | 85% | Cơ bản hoàn thành |
| Tổng hợp ý kiến thảo luận | 2,55 | 88,9% | Cơ bản hoàn thành |

Trọng số bằng hệ số quy đổi của sản phẩm nhân với hệ số tầm quan trọng. Chỉ số KPI là trung bình có trọng số của các nhiệm vụ: 666,7 : 7,55 = 88,3%. Điểm nhóm kết quả nhiệm vụ là 88,3% × 70 = 61,8 điểm. Giả sử tiêu chí chung được 29 điểm, tổng là 90,8 điểm.

Con số vượt 90, nhưng chỉ 1/3 số nhiệm vụ đạt mức Hoàn thành tốt trở lên và không có nhiệm vụ nào vượt mức. Theo điều kiện xếp loại, người này chỉ được xếp Hoàn thành tốt. Trên bảng tính rời, rất dễ có người nhìn thấy "90,8" và ghi luôn "xuất sắc". Người được đánh giá cũng dễ thắc mắc vì sao điểm cao mà xếp loại thấp. Một công cụ tốt phải tự soi điều kiện và giải thích được lý do bằng lời.
:::

Đó là lý do bài toán này đáng được số hóa. Không phải vì phần mềm "hiện đại" hơn giấy, mà vì quy định đã đủ chi tiết để máy tính đúng, trong khi con người dễ tính sai khi phải lặp lại hàng trăm lần.

## 1.3. Từ bảng tính mô phỏng đến ứng dụng web đầu tiên

Theo lý thuyết, con đường gồm ba chặng nối tiếp: lập bảng tính mô phỏng để chốt cách tính, viết đặc tả để chốt yêu cầu, rồi mới làm phần mềm. Thực tế không gọn như vậy. Kỳ dữ liệu sớm nhất còn lưu trên máy chủ là tháng 6/2026, còn bản Đặc tả yêu cầu phần mềm đề tháng 7/2026, kèm một bảng tính mô phỏng lấy kỳ 07/2026 làm ví dụ. Nghĩa là ứng dụng đã chạy trước khi bảng tính và đặc tả được hoàn chỉnh, và chính chúng lại buộc ứng dụng phải sửa. Dưới đây tôi trình bày theo thứ tự hợp lý, vì đó là thứ tự tôi khuyên đồng chí nên làm.

### 1.3.1. Bảng tính mô phỏng: viết công thức ra để thấy chỗ hổng

Tệp `Engine_tinh_diem_KPI_mo_phong.xlsx` trong kho tài liệu của dự án là một "cỗ máy tính điểm" bằng Excel, gồm bảy trang tính:

- **Hướng dẫn:** quy ước chữ màu xanh là ô nhập liệu, chữ màu đen là công thức tự tính, không được sửa.
- **Danh mục:** 48 sản phẩm, công việc của Văn phòng, mỗi dòng có mã, tên, đơn vị tính, phần áp dụng, điểm và hệ số quy đổi.
- **Nhân sự:** tám người mẫu với tên giả định, gắn nhóm đối tượng lãnh đạo quản lý, chuyên môn nghiệp vụ hoặc hỗ trợ phục vụ.
- **Tiêu chí chung:** điểm tự chấm tối đa 30, tự cảnh báo khi vượt trần.
- **Giao việc:** 24 dòng giao việc của kỳ 07/2026, ghi số lượng giao, hoàn thành, số đạt chất lượng ngay, số có sai sót lớn, số đúng hạn, số chậm.
- **Tổng hợp KPI:** tính a, b, c, d, đ, e, rồi tự chọn chia 3 hay chia 6 theo nhóm đối tượng.
- **Thống kê:** kiểm soát cơ cấu xếp loại theo trần 20%.

Giá trị của bảng tính nằm ở hai chỗ. Một là, nó **buộc mọi câu chữ của quy định phải biến thành công thức**. Câu chữ có thể mơ hồ, công thức thì không. "Mỗi lần sai sót lớn trừ 25%" là trừ cho từng sản phẩm hay cho cả lô? Một sản phẩm sai hai lần thì sao? Bản đặc tả đã phải chốt: trừ theo từng sản phẩm, không trừ cả lô; một sản phẩm bị trừ nhiều lần thì cộng dồn, thấp nhất bằng 0.

Hai là, nó trở thành **đáp án để chấm phần mềm**. Bản đặc tả ghi rõ bảng tính này là "bộ ca kiểm thử bắt buộc": với cùng dữ liệu đầu vào, kết quả của phần mềm phải khớp kết quả của bảng tính đến hai chữ số thập phân. Giống như trước khi giao máy tính bỏ túi cho kế toán, ta thử nó bằng những phép tính đã biết đáp án.

Hai câu lệnh mẫu dưới đây giúp đồng chí làm bước này cho một quy trình chấm điểm của đơn vị mình, chỉ cần trợ lý AI trò chuyện, chưa cần lập trình.

::: {.lenhmau}
**Câu lệnh mẫu 1.1 — Bóc tách văn bản quy định thành bảng công thức**

```text
VAI: Anh/chị là chuyên viên tổ chức cán bộ, đọc văn bản rất kỹ.
BỐI CẢNH: Tôi gửi kèm [tên văn bản quy định đã ban hành, công khai].
Đơn vị tôi có [số] người, chia thành [số] nhóm đối tượng.
VIỆC: Bóc tách văn bản thành "bảng công thức", chưa lập bảng tính.
1. Liệt kê mọi đại lượng phải nhập: ai nhập, nhập khi nào.
2. Liệt kê mọi công thức tính điểm.
3. Liệt kê mọi điều kiện xếp loại không phải là con số.
4. Liệt kê mọi trần, ngưỡng, mốc thời gian.
5. Liệt kê chỗ có thể hiểu nhiều cách; mỗi chỗ nêu các cách hiểu
   và hệ quả của từng cách. KHÔNG tự chọn thay tôi.
DẠNG: 5 bảng theo 5 mục trên; cột cuối là "Căn cứ (điều, khoản)".
RÀNG BUỘC: Chỉ dựa vào văn bản tôi gửi. Không có căn cứ thì ghi
"Không tìm thấy trong văn bản". Tuyệt đối không bịa số điều, khoản.
```
:::

Câu lệnh 1.1 chỉ dùng với văn bản đã công khai (vùng XANH). Văn bản còn là dự thảo nội bộ thì xử lý như dữ liệu vùng VÀNG hoặc ĐỎ. Mục 5 của câu lệnh là quan trọng nhất: AI rất hay "chọn đại" một cách hiểu, nên phải buộc nó bày ra các cách hiểu để người có thẩm quyền chọn.

::: {.lenhmau}
**Câu lệnh mẫu 1.2 — Thiết kế bảng tính mô phỏng kèm ca kiểm thử**

```text
VAI: Anh/chị là chuyên viên phân tích nghiệp vụ, thạo Excel.
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
DẠNG: Bảng mô tả trang tính; danh sách công thức; bảng "ca kiểm
thử" gồm đầu vào, kết quả mong đợi, lý do.
RÀNG BUỘC: Không dùng họ tên, số liệu của người thật. Chỗ nào
quy định chưa rõ thì hỏi lại tôi, không tự giả định.
```
:::

### 1.3.2. Bản đặc tả: viết ra mình cần gì, bằng tiếng Việt

Bản Đặc tả yêu cầu phần mềm của dự án được viết như một văn bản gửi đơn vị phát triển phần mềm, gồm bảy chương, từ người dùng và phân quyền, yêu cầu chức năng, mô hình dữ liệu, thuật toán tính điểm đến lộ trình và nghiệm thu. Có những yêu cầu rất "đời": một thao tác phản hồi không quá 3 giây; một cá nhân tự chấm trong kỳ không quá 10 phút; hệ thống chịu được tải cao điểm vào các ngày 24 đến 28 hằng tháng.

Điều giá trị nhất là một nguyên tắc thiết kế gói trong một câu: mọi khác biệt giữa ba nhóm đối tượng chỉ được xử lý tại ba điểm, gồm phần danh mục nhiệm vụ được phép chọn, mẫu phiếu tiêu chí chung và công thức tính KPI. Một câu như vậy giúp người làm phần mềm, dù là doanh nghiệp hay tác tử AI, khỏi rải ngoại lệ lặt vặt khắp nơi. Chương 8 sẽ hướng dẫn cách viết đặc tả cùng AI từ văn bản quy phạm.

### 1.3.3. Ứng dụng web đầu tiên: đăng nhập, lưu theo kỳ, xuất phiếu Word

Chương 2 sẽ giải thích kỹ ứng dụng web là gì. Tạm hình dung nó như một trụ sở: giao diện là phòng tiếp dân, cơ sở dữ liệu (database) là kho lưu trữ hồ sơ, kho mã nguồn (repository) là sổ lưu bản vẽ thiết kế có ghi lịch sử từng lần sửa.

Những phiên bản đầu của phân hệ đánh giá làm được các việc chính sau:

- **Đăng nhập bằng email và mật khẩu.** Lần đầu, người dùng nhận liên kết, khai họ tên, chức vụ, tự tạo mật khẩu. Có thêm tài khoản khách để thử chấm điểm mà không lưu lên máy chủ.
- **Lưu theo kỳ.** Mỗi tháng là một "bìa hồ sơ" riêng trên máy chủ, có khóa chống ghi đè: chỉ cho ghi khi chưa ai khác sửa bìa hồ sơ đó kể từ lúc mình mở ra. Bản hiện hành tự lưu 0,9 giây sau mỗi thay đổi.
- **Chấm theo danh mục có hệ số.** Tiêu chí chung theo mẫu phiếu của từng đối tượng; kết quả nhiệm vụ chọn từ danh mục sản phẩm, công việc có hệ số quy đổi.
- **Không bỏ bảng tính.** Một trong những chức năng sớm nhất là đọc bảng kiểm đếm công việc trên Google Sheet vào mục theo dõi công việc. Bảng tính vẫn sống, chỉ không còn phải cộng tay.

Các đợt sau bổ sung những thứ làm nên "chất hành chính" của phần mềm. Mỗi nhiệm vụ có hai cột: Tự đánh giá do cán bộ nhập, Cấp duyệt do cấp có thẩm quyền rà soát; cột Cấp duyệt mặc định kế thừa cột Tự đánh giá và là con số chính thức. Người có thẩm quyền bấm "Phê duyệt & xuất phiếu" thì phần mềm ghi lại họ tên, vai trò, ngày phê duyệt; sửa điểm sau đó thì phê duyệt tự động bị gỡ. Phiếu Word có đủ bảng tiêu chí, bảng từng nhiệm vụ, lý do xếp loại và hai khối chữ ký. Khối "Vì sao xếp loại này" hiện ngay khi chấm, có cảnh báo đỏ khi điểm số cao hơn mức xếp loại thực tế, đúng như tình huống 90,8 điểm ở trên.

Hạ tầng dùng ở mức miễn phí của các dịch vụ: mã nguồn đặt trên GitHub; mỗi lần đẩy mã lên, nền tảng Vercel tự dựng lại và triển khai (deploy) trong khoảng 1 đến 2 phút; cơ sở dữ liệu và đăng nhập dùng Supabase. Chi phí công cụ AI được trình bày ở Chương 5 và Chương 17.

::: {.cauchuyen}
**Câu chuyện thực tế: nhiệm vụ làm được 9/10 bị coi là "không hoàn thành"**

Khi tự động áp điều kiện xếp loại, phần mềm từng có một lỗi diễn giải. Một nhiệm vụ được giao 10 sản phẩm, làm xong 9, bị coi là "không hoàn thành". Cán bộ điểm cao bị ép xuống mức Không hoàn thành nhiệm vụ, vì AI đã hiểu "không hoàn thành" là "chưa đạt đủ 100%".

Cách sửa là xét theo từng nhiệm vụ với tỷ lệ hoàn thành. Dưới 50% mới tính là không hoàn thành nhiệm vụ đó; từ 50% đến dưới 100% là chưa đạt đủ số lượng; phần giải thích tách rõ hai loại này. Đây là một lựa chọn diễn giải cho bản demo, được ghi công khai trong phần hướng dẫn; nếu có hướng dẫn chính thức khác thì phải sửa theo.

Những chỗ khác có thể hiểu nhiều cách cũng được hỏi lại tôi rồi mới chốt, chẳng hạn ô "bị kỷ luật" chỉ ép mức xếp loại, không trừ vào tổng điểm. Khi AI phản biện rằng công thức có thể gây "điểm cao mà xếp loại thấp", tôi chọn giữ nguyên cách tính theo quy định, chỉ thêm giải thích và cảnh báo. Bài học: AI viết mã nhanh, nhưng quyền diễn giải câu chữ quy định thuộc về người chịu trách nhiệm.
:::

## 1.4. Một phân hệ kéo theo phân hệ khác

Tôi không vẽ sẵn từ đầu một hệ thống 12 phân hệ. Mỗi phân hệ ra đời vì một nhu cầu cụ thể, thường do phân hệ trước "kéo" ra. Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy về đánh giá định kỳ hằng quý dẫn tới phân hệ Kiểm điểm cho 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý. Hai phân hệ cùng cần danh sách người, nên phân hệ Quản lý cán bộ (hồ sơ Mẫu 2C) được nâng lên làm danh sách "một mối". Dự thảo Khung tiêu chí đánh giá HĐND nhiệm kỳ 2026–2031 dẫn tới phân hệ để HĐND tỉnh và các xã, phường tự chấm, kéo theo một Trang chủ dạng cổng. Nhu cầu xem số liệu ngay trên điện thoại dẫn tới bot Telegram, rồi bot trên Zalo Official Account. Nhiệm vụ đột phá đã đăng ký về hỏi đáp, tra cứu có trích dẫn nguồn dẫn tới phân hệ Sổ tay AI.

| Phân hệ | Việc chính | Ghi chú |
|---|---|---|
| Biểu quyết Online | Biểu quyết, kiểm phiếu tức thì | Phiếu mô phỏng; đại biểu đánh số, không gắn tên |
| Đánh giá OKR/KPI | Chấm điểm hằng tháng 28 người | Phân hệ đầu tiên |
| Kiểm điểm đảng viên | Kế hoạch và tự đánh giá hằng quý | 15 đồng chí |
| Tiêu chí HĐND | HĐND tỉnh, xã, phường tự chấm | Theo dự thảo Khung tiêu chí |
| Trợ lý AI nghiệp vụ dân cử | Soạn thảo, soát xét, thẩm tra | Hạn mức lượt mỗi ngày |
| Sổ tay AI | Tra cứu có trích dẫn nguồn | Hoàn thành 22/10/2026 |
| Giám sát số | Giám sát nghị quyết cấp xã | Hệ thống riêng, liên kết |
| Một dữ liệu | Số liệu vào kho một lần | Hệ thống riêng, liên kết |
| Lịch công tác tuần | Lập, duyệt lịch, điều xe | Hệ thống riêng, liên kết |
| Quản lý cán bộ | Hồ sơ Mẫu 2C, nhắc việc | Chỉ Quản trị |
| Hướng dẫn & hỗ trợ | Hướng dẫn toàn hệ thống | Có cơ sở pháp lý |
| Phòng thử nghiệm | Thử các bộ tiêu chí | Cổ điển, Cải tiến, Singapore |

Ngoài 12 thẻ trên còn ba thành phần khác. Khung chat "Người hướng dẫn" ở Trang chủ kết hợp kịch bản soạn sẵn không tốn chi phí với ba lượt hỏi AI mỗi ngày. Bot Telegram và Zalo đọc số liệu thật của nhiều phân hệ. Bản tin pháp luật hằng ngày lấy tin từ nguồn RSS chính thống, vẽ thành ảnh bằng chương trình, không gọi AI. Riêng Sổ tay AI dùng NotebookLM của Google làm nơi hỏi đáp chính; từ tháng 7/2026, Google đã đổi tên sản phẩm này thành Gemini Notebook.

Nhật ký của dự án ghi rất kỹ từng việc nhưng không phải mục nào cũng ghi ngày. Bảng dưới đây xếp theo thứ tự trước sau và chỉ ghi ngày ở những mốc có căn cứ.

| Thời điểm | Mốc chính |
|---|---|
| Giai đoạn đầu | Phân hệ đánh giá theo Nghị định 335/2025/NĐ-CP; đăng nhập; lưu theo kỳ |
| Từ tháng 6/2026 | Số hóa Quy định 1053-QĐ/TU; kỳ dữ liệu sớm nhất còn lưu |
| Tháng 7/2026 | Đặc tả và bảng tính mô phỏng; sau 02/7, phân hệ Kiểm điểm |
| Trước 13/8/2026 | Quản lý cán bộ; Trang chủ dạng cổng; Tiêu chí HĐND; bot Telegram |
| 13/8/2026 | Tách kho dữ liệu theo phân hệ; gộp danh sách cán bộ |
| Sau 13/8/2026 | Lịch công tác; Zalo; Giám sát số; Trợ lý AI; Một dữ liệu; Biểu quyết |
| 09/9/2026 | Ngày sớm nhất trong kho lưu trữ bản tin pháp luật |
| 28/9/2026 | Vá lỗi sập đầu tháng; dựng lại Kiểm điểm theo biểu mẫu giấy |
| 22/10/2026 | Phân hệ Sổ tay AI |

Đếm ngày 26/10/2026, hệ thống có khoảng 21.400 dòng mã, tệp lớn nhất dài gần 3.400 dòng. Toàn bộ dữ liệu nằm trong một bảng cơ sở dữ liệu duy nhất, mỗi "dòng" là một khối hồ sơ: một kỳ đánh giá, một phân hệ, một bộ đếm. Bộ nhớ dự án gồm một tệp tổng quan và bảy tệp quy tắc theo chủ đề. Nhật ký thay đổi có hơn 100 mục. Riêng bot trò chuyện có 199 phép kiểm thử tự động.

Lực kéo giữa các phân hệ cũng kéo theo lỗi. Ngày 13/8/2026 gắn với hai thay đổi lớn: tách kho dữ liệu riêng cho từng phân hệ, và gộp danh sách cán bộ về một mối. Thay đổi thứ nhất làm bot trò chuyện "mất" hẳn phân hệ Kiểm điểm, vì bot dò tên kho theo một quy tắc riêng. Thay đổi thứ hai làm lộ lỗi trùng họ tên: hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, danh sách còn 27 thay vì 28 người. Từ đó dự án có một quy tắc bắt buộc mà Chương 7 sẽ kể kỹ: sửa xong một chỗ, phải tự hỏi "chỗ nào khác đang đọc, ghi thứ vừa đổi?" rồi kiểm chứng thật.

## 1.5. Điều thay đổi lớn nhất không nằm ở phần mềm

### 1.5.1. Từ "đặt hàng phần mềm" sang "tự làm thử – đo – sửa"

Con đường quen thuộc là: viết yêu cầu, tìm đơn vị phát triển, ký hợp đồng, chờ, nghiệm thu, rồi gửi yêu cầu sửa và lại chờ. Bản đặc tả của dự án cũng dự kiến lộ trình như thế: thí điểm 03 tháng tại một số cơ quan, hoàn thiện theo phản hồi, rồi triển khai diện rộng theo chỉ đạo của Ban Thường vụ Tỉnh ủy. Con đường đó vẫn cần cho một hệ thống chính thức toàn tỉnh.

Điều mới là trước khi đặt hàng, người làm nghiệp vụ có thể tự dựng một bản chạy được, dùng thử trên dữ liệu mẫu, thấy chỗ sai và sửa ngay. Chẳng hạn, cách chấm kết quả nhiệm vụ đã đổi từ chọn một "mức độ hoàn thành" theo cảm nhận sang ba tiêu chí khách quan số lượng, chất lượng, tiến độ, rồi để phần mềm tự suy ra mức độ. Thay đổi ấy được thử ngay, không phải chờ một vòng hợp đồng mới. Một dự thảo hướng dẫn của Ban Tổ chức Tỉnh ủy về lập danh mục sản phẩm, công việc còn ghi rằng danh mục và cách chấm minh họa được trích từ phần mềm đã triển khai tại Văn phòng.

Còn chữ "đo" thì phải nói cho thật. Dự án chưa đo được phần mềm tiết kiệm bao nhiêu phần trăm thời gian, nên tôi không viết con số nào như vậy. Thứ được đo là độ đúng: hàng trăm phép kiểm thử tự động, thời gian từng khâu khi bot trả lời, tệp Word xuất ra được đọc lại để đối chiếu. Chỉ tiêu giảm ít nhất 30% thời gian tra cứu của Sổ tay AI hiện vẫn là chỉ tiêu, chưa phải kết quả.

### 1.5.2. Người hiểu nghiệp vụ là người làm ra công cụ tốt nhất

Phân hệ Kiểm điểm ban đầu được dựng theo câu chữ của Hướng dẫn 03-HD/TU. Sau đó, tôi đưa chính bản tự đánh giá Quý III và kế hoạch Quý IV năm 2026 của mình vào đối chiếu; các tệp này được chặn khỏi kho mã công khai. Phần mềm lệch biểu mẫu giấy ở bốn chỗ lớn. Quy trình thật có hai bước (đầu kỳ lập kế hoạch, cuối kỳ tự đánh giá trên kế hoạch đó), phần mềm chỉ có một. Điểm tối đa từng trục do cá nhân đề xuất, trình tập thể lãnh đạo duyệt và thay đổi theo quý, phần mềm lại đóng cứng. Nhóm tiêu chí chung chỉ đánh dấu "Đảm bảo" hoặc "Không đảm bảo", phần mềm lại cho nhập điểm lẻ. Mỗi nhiệm vụ phải đủ năm cột của biểu mẫu. Thêm nữa, đây là văn bản của Đảng nên tiêu đề phải là của tổ chức Đảng, trong khi phần mềm in tên cơ quan hành chính.

Không tác tử AI nào tự biết những điều này. AI viết mã rất nhanh; còn tri thức về biểu mẫu nào đang dùng thật, câu chữ nào là của Đảng, của Nhà nước thì do người cán bộ mang vào.

### 1.5.3. Và cả những lần sập

Câu chuyện này không chỉ toàn thành công. Hệ thống đã sập, đã trả lời sai, đã lặng lẽ không chạy.

::: {.cauchuyen}
**Câu chuyện thực tế: phân hệ "chết" vào ngày đầu tháng**

Từ ngày 01/9/2026, mở phân hệ Đánh giá OKR/KPI, Kiểm điểm hay Quản lý cán bộ đều chỉ thấy trang trắng kèm một dòng lỗi tiếng Anh. Máy chủ có dữ liệu tháng 6, 7, 8 nhưng chưa có tháng 9. Một dòng mã ra lệnh "lấy mã của người đứng đầu danh sách", trong khi danh sách của kỳ mới còn trống. Giống như văn thư được dặn sáng nào cũng đọc tên trên tờ trên cùng của ngăn kéo; ngày đầu tháng ngăn kéo trống, văn thư đứng im, cả phòng đứng theo.

Bản vá được ghi nhận ngày 28/9/2026: thêm điều kiện "có thì lấy, không thì để trống", và cho kỳ mới tự chuyển danh sách cán bộ từ kỳ trước. Trước đó, chỉ Quản trị mới bấm được nút sao chép danh sách. Bài học: lỗi theo lịch không lộ ra lúc thử, chỉ lộ ra khi sang kỳ mới.
:::

Những lần khác cũng được ghi lại đầy đủ. Bot Zalo từng trả lời hai lần một câu hỏi vì Zalo tự gửi lại tin khi chờ lâu, làm hạn mức câu hỏi trong ngày cạn nhanh gấp đôi. Bản tin pháp luật không ra sáng 10/9/2026 vì một điều kiện chạy tự động phản tác dụng. Một tác vụ được coi là "chạy hằng ngày" nhưng chưa từng đẩy được ảnh nào lên kho mã. Mỗi sự cố đều thành một quy tắc hoặc một phép kiểm để không lặp lại.

::: {.canhbao}
**Cảnh báo**

- Hệ thống mô tả trong sách là bản demo thử nghiệm, sử dụng nội bộ. Nó không thay thế quy trình, văn bản chính thức hay phần mềm dùng thống nhất do cấp có thẩm quyền triển khai; khi đã có hệ thống chính thức, dữ liệu chính thức phải theo hệ thống đó.
- Dữ liệu hiển thị là dữ liệu mô phỏng. Không nhập thông tin mật, không dùng dữ liệu cá nhân thật khi chưa có hạ tầng và quy chế bảo đảm.
- Dám nghĩ, dám làm không có nghĩa là được miễn trách nhiệm. Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị khuyến khích chấp nhận rủi ro và thử nghiệm có kiểm soát, nhưng phải theo cơ chế, quy trình luật định. Một ứng dụng tự làm rồi đưa vào dùng ngoài khuôn khổ đó không mặc nhiên được miễn trách nhiệm. Chương 3 sẽ phân tích kỹ.
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
- Hãy hỏi ngay từ đầu: dữ liệu nằm ở đâu, ai được đọc, ai được ghi, ai chịu trách nhiệm duy trì.
- Nút phê duyệt và quyết định xếp loại luôn thuộc về cấp có thẩm quyền, không thuộc về phần mềm.
:::

## Tóm tắt chương 1

::: {.tomtat}
1. Tập 2 kế thừa bốn nền móng của Tập 1: khung lệnh V-B-V-D-R, con người trong vòng lặp, kỷ luật dữ liệu ĐỎ/VÀNG/XANH và "5 KHÔNG" của AI.
2. Bài toán khởi đầu là đánh giá, xếp loại hằng tháng theo Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU: thang 30/70, ba tỷ lệ số lượng – chất lượng – tiến độ, điều kiện xếp loại, trần 20%, mốc trước ngày 28.
3. Làm bằng giấy và bảng tính rời dễ sai nhất ở các điều kiện ngoài con số: 90,8 điểm vẫn có thể chỉ là Hoàn thành tốt.
4. Bảng tính mô phỏng buộc câu chữ quy định thành công thức và trở thành đáp án để chấm phần mềm.
5. Từ một phân hệ, hệ thống lớn dần thành 12 phân hệ cùng bot trò chuyện, bản tin pháp luật và Sổ tay AI, khoảng 21.400 dòng mã.
6. Điều thay đổi lớn nhất là cách làm: tự làm thử, kiểm chứng, sửa; người hiểu nghiệp vụ là người làm ra công cụ tốt nhất.
7. Thất bại là một phần của hành trình; mỗi sự cố phải thành một quy tắc hoặc một phép kiểm.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong công việc của đồng chí, việc nào lặp lại hằng tháng, có quy định rõ và hay phải cộng, đối chiếu bằng tay?
2. Lấy một văn bản quy định công khai liên quan đến việc đó, dùng Câu lệnh mẫu 1.1 để bóc tách. AI đã chỉ ra những chỗ có thể hiểu nhiều cách nào? Ai có thẩm quyền chốt cách hiểu?
3. Tự tính lại ví dụ 90,8 điểm ở mục 1.2.2. Nếu muốn được xếp Hoàn thành xuất sắc, người đó cần thay đổi điều gì?
4. Vì sao bảng tính mô phỏng nên có "ca kiểm thử" với kết quả mong đợi tính tay từ trước?
5. Nếu đơn vị của đồng chí làm một bản demo, những nhãn cảnh báo nào phải hiện trên màn hình?
