# Chương 10. Phân hệ kiểm điểm, đánh giá, xếp loại đảng viên hằng quý

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu yêu cầu đánh giá định kỳ hằng quý đối với cán bộ diện Ban Thường vụ Tỉnh ủy quản lý và cách số hóa nó thành một phân hệ phần mềm.
- Nắm quy trình hai bước "lập kế hoạch quý – tự đánh giá ngay trên kế hoạch đã duyệt", cách tính điểm sáu trục với điểm tối đa không cố định và Nhóm A chấm theo kiểu đánh dấu.
- Biết cách dựng mẫu kế hoạch theo chức danh, và nhận ra một cái bẫy chữ nghĩa rất nhỏ: "phó trưởng ban" chứa trọn "trưởng ban".
- Biết giao việc cho tác tử AI lập trình để xuất tệp Word đúng biểu mẫu văn bản của Đảng và kiểm chứng bằng máy.
- Tự làm được một phiên bản nhỏ cho chính mình bằng bảng tính hoặc trang công cụ một tệp.

Dành cho: cán bộ tham mưu công tác tổ chức, đảng vụ; lãnh đạo các Ban, lãnh đạo Văn phòng; cán bộ muốn tự làm công cụ lập kế hoạch và tự đánh giá theo quý.
:::

Chương 9 kể về việc chấm điểm cán bộ, công chức của Văn phòng hằng tháng. Chương này đi tiếp sang một đối tượng khác, một chu kỳ khác và một loại văn bản khác: kiểm điểm, đánh giá, xếp loại hằng quý đối với các đồng chí lãnh đạo diện Ban Thường vụ (BTV) Tỉnh ủy quản lý ở Hội đồng nhân dân (HĐND) tỉnh, Đoàn đại biểu Quốc hội (ĐBQH) tỉnh và Văn phòng Đoàn ĐBQH và HĐND tỉnh.

Phân hệ nằm trong hệ thống thử nghiệm của Văn phòng tại địa chỉ hdndthkpi.vercel.app, đường dẫn `#/kiemdiem`. Nó dùng chung "bộ khung" với phân hệ OKR/KPI của Chương 9, nhưng có module tính điểm, kho dữ liệu và biểu mẫu xuất Word riêng.

Đây là phân hệ cho tôi bài học đau nhất về nghiệp vụ. Phiên bản đầu tiên được dựng rất nhanh, bám sát câu chữ văn bản hướng dẫn, chạy trơn tru. Nhưng đặt cạnh tờ kế hoạch và bản tự đánh giá bằng giấy mà chính tôi đang dùng, nó lệch ở bốn chỗ lớn. Ngày 28/9/2026, tôi cùng tác tử AI lập trình dựng lại gần như toàn bộ phần đánh giá. Câu chuyện ấy, cùng các sự cố về kỳ dữ liệu theo quý, là phần cốt lõi của chương.

Chương đi theo khuôn chung của Phần thứ ba: bài toán, thiết kế, cách giao việc cho AI, sự cố, phiên bản nhỏ để tự làm, và điều lãnh đạo cần biết.

## 10.1. Bài toán và căn cứ

### 10.1.1. Một yêu cầu mới: đánh giá theo quý, đo bằng sản phẩm

Yêu cầu đánh giá định kỳ theo quý, đo bằng sản phẩm, công việc cụ thể được hướng dẫn trong hai văn bản ban hành giữa năm 2026.

Ngày 22/5/2026, Ban Tổ chức Trung ương ban hành Hướng dẫn 02-HD/BTCTW về một số nội dung đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý các cấp trong hệ thống chính trị. Văn bản này lấy Quy định 366-QĐ/TW ngày 30/8/2025 của Bộ Chính trị làm căn cứ. Ngày 02/7/2026, Tỉnh ủy Thanh Hóa ban hành Hướng dẫn 03-HD/TU cùng tên gọi, cụ thể hóa cho tỉnh, kèm một bộ phụ lục biểu mẫu. Theo hai hướng dẫn này, kết quả các trục kết quả trọng tâm được lấy làm cơ sở đánh giá, xếp loại bắt đầu từ Quý II năm 2026.

Đọc hai văn bản như đọc một bản thiết kế (Chương 8), tôi tách được mấy ý mà phần mềm buộc phải "hiểu":

- **Chu kỳ là quý**: mỗi quý một lần lập kế hoạch, một lần tự đánh giá.
- **Đo bằng sản phẩm** theo sáu trục kết quả trọng tâm, theo yêu cầu "sáu rõ: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền" của Hướng dẫn 02-HD/BTCTW.
- **Có trục chính, trục phụ**; trục chính chiếm tỷ trọng điểm cao hơn.
- **Cấp trực tiếp đề xuất, cấp có thẩm quyền quyết định**: cấp trực tiếp sử dụng cán bộ nhận xét, đề xuất mức xếp loại; cấp quản lý cán bộ quyết định, phê duyệt.
- **Khuyến khích dùng công cụ số** (xem nguyên văn trong hộp dưới).

::: {.phaply}
**Căn cứ pháp lý**

- **Quy định 366-QĐ/TW ngày 30/8/2025** của Bộ Chính trị về việc kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị: có hiệu lực từ ngày ký; kiểm điểm, đánh giá theo nhiệm kỳ, hằng năm, hằng quý hoặc khi cần thiết. Lưu ý: ngày 19/10/2026, Bộ Chính trị đã ban hành **Quy định 227-QĐ/TW**, có hiệu lực từ 01/01/2027 và thay thế Quy định 366-QĐ/TW; kết quả đánh giá đã được phê duyệt trước ngày đó vẫn được sử dụng.
- **Hướng dẫn 02-HD/BTCTW ngày 22/5/2026** của Ban Tổ chức Trung ương. Điểm 1.2: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ". Điểm 6.2: cá nhân hoàn thành dưới 100% nhiệm vụ của quý thì xếp loại "Không hoàn thành nhiệm vụ", trừ lý do khách quan, bất khả kháng được xác nhận.
- **Hướng dẫn 03-HD/TU ngày 02/7/2026** của Tỉnh ủy Thanh Hóa về đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý các cấp trong hệ thống chính trị; áp dụng từ ngày ký.
- **Quy định 73-QĐ/TU ngày 14/11/2025** của Tỉnh ủy Thanh Hóa về việc kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị.

Các văn bản được đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, cần đọc nguyên văn, không dựa vào bản tóm tắt trong sách hay trong phần mềm.
:::

Chữ "Lưu ý" trong hộp trên không phải chi tiết phụ. Theo thông tin báo chí mà tôi đọc khi đối chiếu, Quy định 227-QĐ/TW thay đổi cách đánh giá nhóm tiêu chí chung (theo mức độ đáp ứng thay vì chấm điểm) và nâng ngưỡng "Hoàn thành tốt nhiệm vụ" từ 70 lên 80 điểm. Tôi chưa sửa phần mềm, vì phải chờ nguyên văn và hướng dẫn thi hành của Trung ương, của Tỉnh ủy: phần mềm chạy theo văn bản, không chạy theo tin tức. Nhưng cũng vì vậy, mọi ngưỡng điểm, mọi cách chấm phải được thiết kế để đổi được ở một chỗ, có ghi chú căn cứ.

### 10.1.2. Đối tượng: mười lăm đồng chí diện Ban Thường vụ Tỉnh ủy quản lý

Phân hệ phục vụ 15 đồng chí: 2 Phó Chủ tịch HĐND tỉnh; Trưởng Ban và Phó Trưởng Ban của cả 4 Ban (Kinh tế - Ngân sách, Văn hóa - Xã hội, Pháp chế, Dân tộc); Phó Trưởng đoàn ĐBQH tỉnh và đại biểu Quốc hội hoạt động chuyên trách; Chánh Văn phòng và 2 Phó Chánh Văn phòng.

Ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ: hằng tháng chấm KPI cùng cán bộ, công chức Văn phòng (Chương 9), hằng quý kiểm điểm với tư cách cán bộ diện BTV quản lý. Nhật ký dự án ghi rõ đây là phương án do tôi chọn: ép mỗi người vào đúng một phân hệ thì gọn dữ liệu nhưng sai thực tế công việc.

Ai thuộc phân hệ này không do phân hệ tự quyết. Hồ sơ cán bộ Mẫu 2C ở phân hệ Quản lý cán bộ có trường "Diện quản lý cán bộ"; phân hệ Kiểm điểm chỉ đọc những người được đánh dấu thuộc diện BTV Tỉnh ủy quản lý. Muốn thêm, bớt người thì sửa ở hồ sơ gốc. Nguyên tắc "danh sách cán bộ một mối" này được nói kỹ ở Chương 12.

Một lưu ý trung thực: trong bản demo thử nghiệm, chức danh là chức danh thật của cơ quan, còn toàn bộ điểm số, mức xếp loại là **dữ liệu mô phỏng** để trình diễn (bộ dữ liệu mẫu chia 2 hồ sơ loại A, 12 hồ sơ loại B, 1 hồ sơ loại C). Không ai được hiểu những con số đó là kết quả kiểm điểm thật.

### 10.1.3. Làm bằng giấy thì vướng ở đâu

Biểu mẫu giấy không sai. Cái khó nằm ở khâu tính và khâu tổng hợp. Hãy hình dung một quý bình thường của cơ quan:

- Đầu quý, mỗi đồng chí lập kế hoạch theo sáu trục và tự đề xuất điểm tối đa từng trục sao cho tổng đúng 70. Cộng nhầm thành 65 hay 75 là phải in lại.
- Cuối quý, mỗi người quy kết quả ra tỷ lệ KPI từng trục, nhân với điểm tối đa, cộng điểm tiêu chí chung, đối chiếu điều kiện xếp loại. Mỗi bước là một chỗ có thể sai số học.
- Bộ phận tham mưu tổng hợp 15 bản thành bảng tập thể, kiểm tra tỷ lệ xếp loại cao nhất, trình cấp có thẩm quyền. Quý sau lặp lại.

Phần mềm không thay được phần nghĩ: nhiệm vụ nào là trọng tâm, ai xếp loại gì. Nó chỉ nên gánh phần tính toán, đối chiếu và trình bày. Đó là ranh giới tôi giữ suốt quá trình làm phân hệ này.

## 10.2. Quy trình hai bước và cấu trúc điểm

### 10.2.1. Phiên bản đầu tiên: đúng văn bản, lệch thực tiễn

Phân hệ ra đời sau khi Hướng dẫn 03-HD/TU được ban hành. Tôi đưa cho tác tử AI lập trình văn bản hướng dẫn và các phụ lục, yêu cầu số hóa. Kết quả đầu tiên đúng khung: Nhóm A tiêu chí chung 30 điểm, Nhóm B kết quả nhiệm vụ 70 điểm chia cho sáu trục. Sau đó thêm vài vòng: dựng danh mục sản phẩm mỗi dòng tới mười ô nhập, bổ sung phần tự kiểm điểm bằng lời, rồi đơn giản hóa vì quá nhiều ô. Vòng nào cũng "build xanh".

Rồi tôi làm việc lẽ ra phải làm từ đầu: đặt màn hình phần mềm cạnh bản tự đánh giá Quý III và bản kế hoạch Quý IV/2026 bằng giấy của chính mình.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch và bản dựng lại ngày 28/9/2026**

Tôi đặt hai tệp biểu mẫu thật của mình vào một thư mục đã được chặn khỏi kho mã nguồn (repository) công khai, rồi yêu cầu tác tử AI đối chiếu từng mục biểu mẫu với từng màn hình phần mềm, liệt kê chỗ lệch.

Kết quả đối chiếu chỉ ra bốn chỗ lớn. Một là quy trình thật có **hai bước** (đầu kỳ lập kế hoạch, trình duyệt; cuối kỳ tự đánh giá trên kế hoạch đó), phần mềm chỉ có một. Hai là **điểm tối đa của từng trục không cố định**: phần mềm đóng cứng 15/10/10/15/10/10, trong khi biểu mẫu ghi rõ cá nhân tự đề xuất điểm theo thứ tự ưu tiên; kế hoạch Quý III của tôi phân bổ 15-20-10-15-5-5, Quý IV lại là 10-20-10-20-5-5. Ba là **Nhóm A chấm bằng đánh dấu** "Đảm bảo" hoặc "Không đảm bảo", còn phần mềm cho nhập điểm lẻ. Bốn là mỗi nhiệm vụ trên giấy có **đủ năm cột**, phần mềm chỉ có tên và mức độ.

Còn một chỗ thứ năm, nhỏ mà không nhỏ: tiêu đề tệp Word in tên cơ quan hành chính, trong khi đây là văn bản của Đảng.

Bản dựng lại được đưa lên kho mã nguồn sáng 28/9/2026, chạm tới chín tệp, trong đó có một tệp mẫu kế hoạch mới hơn sáu trăm dòng. Tôi ghi nhớ: văn bản hướng dẫn chưa phải là thực tiễn, và "chạy được" chưa phải là "đúng".
:::

### 10.2.2. Bước một: lập kế hoạch quý

Đầu quý, mỗi đồng chí mở khối "Kế hoạch quý" và làm ba việc.

**Thứ nhất, đăng ký nhiệm vụ theo sáu trục.** Mỗi nhiệm vụ có đủ năm cột như biểu mẫu: mục tiêu, nhiệm vụ đề ra; kết quả cần đạt; thời gian hoàn thành; kết quả thực tế (để trống, cuối kỳ mới ghi); mức độ hoàn thành và tầm quan trọng.

| Trục | Nội dung (rút gọn) |
|---|---|
| 1 | Mục tiêu phát triển kinh tế - xã hội, nhiệm vụ chính trị được giao |
| 2 | Hoàn thiện thể chế, phân cấp, phân quyền gắn với kiểm tra, giám sát |
| 3 | Khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số |
| 4 | Xây dựng Đảng, hệ thống chính trị; phòng, chống tham nhũng, lãng phí, tiêu cực |
| 5 | Văn hóa, con người, an sinh xã hội, đời sống Nhân dân |
| 6 | Quốc phòng, an ninh, đối ngoại và hội nhập quốc tế |

**Thứ hai, tự đề xuất điểm tối đa cho từng trục** sao cho tổng đúng 70, và ghi trục đó là "trục chính, chủ yếu" hay "trục phụ, phối hợp, hỗ trợ". Thanh kiểm tra tổng báo ngay khi lệch khỏi 70; nút "Chia lại cho đủ 70 điểm" giữ nguyên tỷ lệ giữa các trục, làm tròn về bội số 0,5, phần lẻ dồn vào trục cao nhất.

**Thứ ba, trình tập thể lãnh đạo duyệt kế hoạch.** Dấu "kế hoạch quý đã được duyệt" tách biệt với dấu "bản tự đánh giá đã được phê duyệt" cuối kỳ; bảng tổng hợp có cột "Kế hoạch: Đã duyệt / Chưa duyệt".

Vì sao bước duyệt kế hoạch quan trọng? Vì điểm tối đa do chính người được đánh giá đề xuất, nên dễ bị dồn vào trục chắc chắn làm tốt. Đó là dạng quen thuộc của quy luật Goodhart (Chương 9): khi thước đo thành mục tiêu, người ta tìm cách "đẹp số". Chốt chặn nằm ở tập thể lãnh đạo khi phê duyệt kế hoạch, không nằm ở phần mềm.

### 10.2.3. Bước hai: tự đánh giá ngay trên kế hoạch đã duyệt

Cuối quý, cán bộ không lập phiếu mới mà mở lại chính bản kế hoạch, ghi kết quả thực tế và chọn mức độ hoàn thành cho từng nhiệm vụ. Phần mềm quy mức độ ra tỷ lệ, nhân trọng số theo tầm quan trọng:

| Mức độ hoàn thành | Tỷ lệ | Tầm quan trọng | Hệ số |
|---|---|---|---|
| Xuất sắc, vượt yêu cầu | 100% | Thường xuyên | ×1 |
| Hoàn thành tốt | 90% | Quan trọng | ×1,5 |
| Cơ bản hoàn thành | 75% | Trọng tâm, khó | ×2 |
| Chưa hoàn thành | 55% | | |
| Không hoàn thành | 30% | | |

**KPI của trục** là trung bình có trọng số của các nhiệm vụ đã chấm trong trục. **Điểm đạt của trục = KPI (%) × điểm tối đa của trục.** Nhóm B là tổng điểm đạt sáu trục.

Bản giấy ghi một con số KPI cho cả trục, do cấp có thẩm quyền chốt. Vì vậy cấp có thẩm quyền được điều chỉnh KPI từng trục; màn hình luôn hiện song song số tự tính và số đã điều chỉnh, kèm nút "dùng lại số tự tính".

Phần tự luận theo đúng bố cục văn bản, gồm bốn mục: kết quả chung; kết quả nổi bật theo trục; hạn chế, khuyết điểm và nguyên nhân; phương hướng khắc phục. Mục "Kết quả chung" có nút soạn tự động, nhưng đó **không phải AI**: phần mềm chỉ ghép một câu theo khuôn từ số liệu đã chấm, kiểu "Hoàn thành x/y nhiệm vụ theo kế hoạch được phê duyệt, đạt z%". Câu theo khuôn không bịa, không tô hồng, luôn khớp bảng điểm. Việc có quy tắc cố định thì để chương trình làm.

Phần nhận xét của cấp có thẩm quyền có thêm ô "Mức độ đáp ứng đối với các mục tiêu, nhiệm vụ then chốt", đúng như biểu mẫu.

### 10.2.4. Nhóm A: đánh dấu, không chấm điểm lẻ

Nhóm A gồm ba nhóm tiêu chí, mỗi nhóm 10 điểm: phẩm chất chính trị, đạo đức, lối sống, nêu gương (mục 1.1 đến 1.9); tư duy đổi mới, dám nghĩ, dám làm (2.1 đến 2.4); tự phê bình và phê bình, khắc phục hạn chế (3.1 đến 3.4). Điểm từng mục không đều: từ 1 đến 4 điểm.

Biểu mẫu chỉ có hai ô đánh dấu (x) cho mỗi mục. Phần mềm vì thế đổi ô nhập số thành cặp nút "Đảm bảo / Không đảm bảo": đảm bảo thì được đủ điểm của mục, không đảm bảo thì 0 điểm. Giá trị vẫn được **lưu dưới dạng số** (0 hoặc điểm tối đa của mục), nên các bản lưu cũ vẫn mở được. Đó là tương thích ngược (backward compatibility); người không chuyên chỉ cần nhớ hỏi AI: "dữ liệu lưu theo cách cũ sẽ hiện ra thế nào?".

Một lựa chọn thiết kế lãnh đạo nên biết: mục nào chưa đánh dấu thì phần mềm mặc định là "Đảm bảo", cột cấp duyệt kế thừa cột tự đánh giá. Cách này nhất quán với nguyên tắc "chấm trừ dần" của cả hệ thống, nhưng người không mở Nhóm A ra vẫn có đủ 30 điểm. Bắt buộc đánh dấu từng mục hay không là quyết định nghiệp vụ, lãnh đạo chốt rồi mới sửa phần mềm.

### 10.2.5. Xếp loại bốn mức và câu trả lời "vì sao"

Phần mềm tự đề xuất một trong bốn mức: Hoàn thành xuất sắc nhiệm vụ (HTXS), Hoàn thành tốt nhiệm vụ (HTT), Hoàn thành nhiệm vụ (HT), Không hoàn thành nhiệm vụ (KHT). Các điều kiện đã cài đặt như sau:

- **HTXS:** tổng từ 90 điểm, mọi nhiệm vụ đạt từ "Hoàn thành tốt" trở lên, Nhóm A đủ 30 điểm, và ít nhất 30% nhiệm vụ vượt mức.
- **HTT:** từ 70 điểm; hoặc từ 90 điểm nhưng chưa đủ điều kiện HTXS.
- **HT:** từ 50 đến dưới 70 điểm.
- **KHT:** dưới 50 điểm, hoặc trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật trong kỳ (ô này chỉ ép xếp loại, không trừ vào tổng điểm).

Các điều kiện này được đối chiếu từ quy định của Tỉnh ủy qua bản chụp (scan), phải chuyển từng trang thành ảnh mới đọc được; trước khi dùng thật cần đối chiếu lại nguyên văn hiện hành. Bảng tổng hợp tập thể còn cảnh báo khi số HTXS vượt 20% số HTT, theo cách khống chế tỷ lệ mà Quy định 1053-QĐ/TU áp dụng cho đánh giá hằng tháng; tỷ lệ cho kỳ quý cũng cần đối chiếu.

Quan trọng hơn con số là phần giải thích: khi xếp loại thấp hơn mức tổng điểm gợi ý, phần mềm ghi rõ lý do, ví dụ "Chưa đạt ≥30% nhiệm vụ vượt mức (hiện 20%) nên chưa đạt Hoàn thành xuất sắc".

::: {.vidu}
**Ví dụ minh họa: một bản tự đánh giá giả định**

Lấy phân bổ của mẫu "Phó Chủ tịch Thường trực HĐND tỉnh" trong phần mềm: 15-20-5-20-5-5. Giả định 10 nhiệm vụ, Nhóm A đánh dấu đảm bảo đủ cả 17 mục (30 điểm).

| Trục | Nhiệm vụ (mức × hệ số) | KPI | Điểm đạt |
|---|---|---|---|
| 1 (15đ) | Xuất sắc ×2; Tốt ×2 | 95% | 14,25 |
| 2 (20đ) | Xuất sắc ×2; Tốt ×2; Tốt ×1 | 94% | 18,80 |
| 3 (5đ) | Xuất sắc ×1,5 | 100% | 5,00 |
| 4 (20đ) | Tốt ×2; Tốt ×1 | 90% | 18,00 |
| 5 (5đ) | Tốt ×1,5 | 90% | 4,50 |
| 6 (5đ) | Tốt ×1 | 90% | 4,50 |

Cách tính trục 2: (100×2 + 90×2 + 90×1) ÷ (2 + 2 + 1) = 470 ÷ 5 = 94%; 94% × 20 = 18,8 điểm. Nhóm B = 65,05; tổng = 95,05. Có 3/10 nhiệm vụ xuất sắc (30%), mọi nhiệm vụ từ "Hoàn thành tốt" trở lên, nên phần mềm đề xuất **HTXS**.

Đổi một chi tiết: nhiệm vụ ở trục 6 chỉ "Cơ bản hoàn thành". KPI trục 6 còn 75%, điểm đạt 3,75; tổng còn 94,3, vẫn trên 90. Nhưng không còn "mọi nhiệm vụ từ Hoàn thành tốt", nên phần mềm đề xuất **HTT** và ghi lý do. Không có dòng giải thích, người dùng dễ tưởng phần mềm sai.
:::

::: {.ghinho}
**Ghi nhớ**

- Kế hoạch quý là "hợp đồng" đầu kỳ; bản tự đánh giá được ghi ngay trên hợp đồng ấy.
- Điểm tối đa từng trục do cá nhân đề xuất, tập thể lãnh đạo duyệt; tổng luôn bằng 70.
- Phần mềm tính và giải thích; cấp có thẩm quyền ghi đè được KPI và là người quyết định xếp loại.
:::

## 10.3. Mẫu kế hoạch theo chức danh

### 10.3.1. Mười lăm mẫu cho mười lăm vị trí công tác

Lập kế hoạch quý từ trang trắng là việc tốn công. Vì vậy phân hệ có nút "Nạp mẫu nhiệm vụ theo chức danh", với 15 mẫu ứng với 15 vị trí ở mục 10.1.2. Phó Chủ tịch Thường trực và Phó Chủ tịch HĐND tỉnh có mẫu riêng; mỗi Ban có bộ nhiệm vụ riêng theo lĩnh vực; hai Phó Chánh Văn phòng có hai mẫu theo khối phụ trách.

Mỗi mẫu có phân bổ điểm sáu trục (tổng đúng 70), vai trò chính hoặc phụ của từng trục, và từ 9 đến 11 nhiệm vụ đã điền sẵn kết quả cần đạt, thời gian hoàn thành. Phân bổ khác nhau theo chức năng, ví dụ:

| Mẫu | Phân bổ trục 1→6 | Trục nặng nhất |
|---|---|---|
| Phó Chủ tịch Thường trực | 15-20-5-20-5-5 | Trục 2 và trục 4 |
| Trưởng Ban Kinh tế - Ngân sách | 20-20-5-10-10-5 | Trục 1 và trục 2 |
| Trưởng Ban Văn hóa - Xã hội | 10-20-5-10-20-5 | Trục 2 và trục 5 |
| Trưởng Ban Pháp chế | 10-25-5-15-5-10 | Trục 2 |
| Chánh Văn phòng | 15-15-10-20-5-5 | Trục 4 |

Mẫu của Phó Trưởng Ban được suy từ mẫu của Trưởng Ban cùng Ban: trục 1 cộng thêm 5 điểm vì Phó Trưởng Ban trực tiếp thực hiện thẩm tra, giám sát nhiều hơn; trục 4 bớt 5 điểm vì phần lãnh đạo, chỉ đạo nhẹ hơn. Tổng vẫn 70.

Các mẫu này là **bản nháp do máy đề xuất**, dựng từ chức năng, nhiệm vụ của từng vị trí và chương trình công tác cuối năm 2026, không phải "chỉ tiêu giao". Nạp mẫu xong, cá nhân sửa, thêm, bớt và đề xuất lại điểm; tập thể lãnh đạo duyệt. Nạp lại mẫu thì dấu "kế hoạch đã duyệt" tự bị gỡ, vì bản kế hoạch đã khác bản được duyệt.

### 10.3.2. Cái bẫy "phó trưởng ban"

Để nạp đúng mẫu, phần mềm tự đoán mẫu từ chức vụ và đơn vị. Nghe đơn giản: thấy chữ "trưởng ban" thì nạp mẫu Trưởng Ban. Nhưng "phó trưởng ban" chứa trọn "trưởng ban"; máy hỏi câu đó trước thì mọi Phó Trưởng Ban nhận nhầm mẫu. Cặp "phó chánh văn phòng" và "chánh văn phòng" cũng vậy; "phó chủ tịch thường trực" và "phó chủ tịch" cũng vậy.

Cách sửa là xét chuỗi dài, cụ thể trước, chuỗi ngắn, chung sau. Đoạn mã thật trong dự án (rút gọn) đọc được ngay cả khi không biết lập trình:

```js
if (ban && /phó trưởng ban/.test(p)) return `pb_${ban}`;
if (ban && /trưởng ban/.test(p)) return `tb_${ban}`;
if (/phó chủ tịch thường trực/.test(p)) return 'pct_tt';
if (/phó chủ tịch/.test(p)) return 'pct';
if (/phó chánh văn phòng/.test(p)) return 'pho_vp_hdnd';
if (/chánh văn phòng/.test(p)) return 'chanh_vp';
```

Mỗi dòng hỏi "chức vụ có chứa cụm này không?"; dòng đầu tiên trả lời "có" quyết định mẫu. Thứ tự các dòng chính là nghiệp vụ.

Có trường hợp máy không thể tự đoán: hai Phó Chánh Văn phòng cùng chức danh nhưng phụ trách hai khối khác nhau. Khi đó hồ sơ được ghi sẵn khóa mẫu ở một trường riêng, và khóa do người ghi luôn được ưu tiên hơn suy đoán của máy.

Đây là cùng họ lỗi với cái bẫy "quốc gia" chứa "gia" ở Chương 15. Cách phòng giống nhau: biến ca lỗi thành phép kiểm thử hồi quy (regression test) để máy tự kiểm tra ở mọi lần sửa sau. Bộ kiểm thử mẫu kế hoạch có 127 phép kiểm: mẫu nào tổng cũng đúng 70; trục nào cũng có nhiệm vụ đủ ba cột và khai vai trò; suy mẫu đúng cho 10 chức danh thật; nút chia lại cho đủ 70 đúng trong mọi tình huống. Một thiếu sót tôi phải nhận: bộ kiểm thử này còn nằm ở thư mục làm việc tạm, chưa được đưa lên kho mã nguồn, nên máy khác chưa chạy lại được.

### 10.3.3. Nâng cấp bản lưu cũ mà không mất phần đã chấm

Khi dựng lại, trên máy chủ đã có các bản lưu theo mô hình cũ. Xóa đi làm lại là nhanh nhất, nhưng làm mất công sức người dùng. Tôi yêu cầu một hàm nâng cấp: bản lưu nào chưa có cấu hình trục thì dựng lại kế hoạch từ mẫu chức danh, nhưng **giữ nguyên** phần Nhóm A đã đánh dấu, phần tự luận và mức xếp loại đã có. Hàm này chạy ở cả ba đường nạp dữ liệu của phân hệ.

::: {.lenhmau}
**Câu lệnh mẫu 10.1 — Dựng mẫu kế hoạch theo chức danh, có kiểm thử thứ tự suy mẫu**

```text
Vai: Đồng chí là tác tử AI lập trình trong dự án [tên dự án], đã đọc bộ nhớ dự án.
Bối cảnh: Phân hệ kiểm điểm hằng quý có 6 trục, tổng điểm tối đa 70.
Tôi đính kèm biểu mẫu Kế hoạch quý và danh sách chức danh cần phục vụ:
[liệt kê chức danh, đơn vị, lĩnh vực phụ trách — KHÔNG kèm họ tên].
Việc: Tạo một tệp logic thuần (không giao diện, chạy được bằng Node) chứa
mẫu kế hoạch cho từng chức danh: phân bổ điểm 6 trục, vai trò chính/phụ,
8–11 nhiệm vụ có "kết quả cần đạt" và "thời gian hoàn thành".
Viết hàm suy mẫu từ chức vụ + đơn vị; cho phép ghi sẵn khóa mẫu để ghi đè.
Dạng: Trình bày phương án bằng bảng trước, chờ tôi duyệt.
Ràng buộc: Xét cụm dài trước cụm ngắn (phó trưởng ban trước trưởng ban,
phó chánh văn phòng trước chánh văn phòng). Không đổi cách lưu dữ liệu cũ.
Nghiệm thu: Có bộ kiểm thử chứng minh mẫu nào cũng tổng đúng 70, mỗi
nhiệm vụ đủ 3 cột, suy mẫu đúng cho từng chức danh trong danh sách,
kể cả các cặp chức danh chứa nhau. Báo số phép kiểm đạt/không đạt.
```
:::

## 10.4. Xuất Word đúng biểu mẫu phụ lục

### 10.4.1. Ba tệp đầu ra

Phân hệ xuất ba tệp Word, đều trình bày khổ ngang (landscape) cho vừa bảy, tám cột:

- **Kế hoạch sản phẩm/công việc và kết quả cần đạt được của cá nhân** theo quý: thông tin cá nhân, bảng A, bảng B sáu trục, khối ký của cá nhân và xác nhận của tập thể lãnh đạo.
- **Bản tự đánh giá, xếp loại của cá nhân** (Phụ lục 3A): bảng A từng mục với hai cột đánh dấu, bảng B với điểm tối đa động, phần tự luận, tự đề xuất xếp loại, nhận xét của cấp có thẩm quyền, khối ký. Cột "Ghi chú" tự sinh câu theo khuôn.
- **Bảng tổng hợp tập thể** (Phụ lục 4), bảy cột: số thứ tự; họ tên; chức vụ, đơn vị; cá nhân tự đề xuất mức xếp loại; cấp có thẩm quyền đề xuất mức xếp loại; tóm tắt căn cứ; đề xuất nội dung công tác cán bộ.

Muốn máy dựng đúng bố cục, phải cho máy "nhìn thấy" biểu mẫu gốc: tệp .docx đọc trực tiếp; tệp .doc đời cũ phải chuyển sang .docx; tệp PDF chụp phải chuyển thành ảnh. Có bản điện tử gốc thì đừng dùng bản chụp.

### 10.4.2. Văn bản của Đảng thì tiêu đề phải là của Đảng

Đây là lỗi tôi thấy xấu hổ nhất, vì nó nằm ngay dòng đầu văn bản. Các bản xuất ban đầu in ở góc trái tên cơ quan hành chính, trong khi bản kế hoạch và bản tự đánh giá kèm hướng dẫn của Tỉnh ủy là văn bản của Đảng. Sau khi sửa, khối tiêu đề in đúng:

```text
TỈNH ỦY THANH HÓA                        ĐẢNG CỘNG SẢN VIỆT NAM
ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH       Thanh Hóa, ngày … tháng … năm …
          *
```

Văn bản hành chính trình bày theo thể thức của Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức đảng theo hướng dẫn thể thức riêng của Đảng, khác từ dòng tiêu đề, tên cơ quan ban hành đến khối chữ ký. Không được dặn rõ, AI dễ trình bày theo khuôn văn bản hành chính. Bài học chung: **khi giao AI dựng văn bản, luôn nói rõ đó là văn bản loại gì, của tổ chức nào, theo hướng dẫn thể thức nào, và đưa kèm một bản mẫu chuẩn.**

### 10.4.3. Nghiệm thu bằng máy, không chỉ bằng mắt

Xem bằng mắt là cần nhưng chưa đủ. Sau lần dựng lại, tác tử AI chạy trình duyệt tự động trên bản dựng thật, bấm nút xuất, nhận về hai tệp Word thật (khoảng 16 KB và 17 KB), rồi dùng thư viện python-docx đọc ngược để đối chiếu tiêu đề, khối thông tin, bảng A, bảng B. Như nghiệm thu công trình tại hiện trường, không trên bản vẽ.

::: {.canhbao}
**Cảnh báo: hồ sơ kiểm điểm không phải dữ liệu để "thử" trên AI công cộng**

Hồ sơ kiểm điểm có họ tên, ngày sinh, chức vụ Đảng và nhận xét về phẩm chất, đạo đức của một con người. Họ tên, ngày sinh là dữ liệu cá nhân cơ bản theo Điều 3 Nghị định 356/2025/NĐ-CP hướng dẫn Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (cả hai có hiệu lực từ 01/01/2026). Hồ sơ kiểm điểm còn là tài liệu nội bộ của tổ chức đảng. Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, được Văn phòng Trung ương Đảng triển khai bằng Công văn 19130-CV/VPTW ngày 26/11/2025, yêu cầu không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI và coi AI là công cụ "hỗ trợ, không thay thế". Với tài liệu có nội dung bí mật nhà nước, Điều 5 Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 nghiêm cấm soạn thảo, lưu giữ trên thiết bị đang kết nối Internet.

Vì vậy, biểu mẫu thật dùng để đối chiếu nằm ở thư mục bị chặn khỏi kho mã nguồn công khai; mã nguồn chỉ chứa cấu trúc biểu mẫu. Với trợ lý AI trò chuyện công cộng, chỉ đưa cấu trúc biểu mẫu (vùng XANH), không dán bản tự đánh giá có tên người (vùng ĐỎ).

Bản demo hiện mở quyền đọc dữ liệu kỳ kiểm điểm cho mọi người để trình diễn, với điểm số mô phỏng. Khi dùng dữ liệu thật, phải chuyển sang hạ tầng của cơ quan và gỡ quyền đọc công khai trước.
:::

::: {.lenhmau}
**Câu lệnh mẫu 10.2 — Xuất Word đúng biểu mẫu văn bản của Đảng và tự nghiệm thu**

```text
Vai: Đồng chí là tác tử AI lập trình của dự án [tên dự án].
Bối cảnh: Tôi đính kèm biểu mẫu gốc [tên phụ lục] dạng .docx. Đây là văn
bản của tổ chức đảng, KHÔNG phải văn bản hành chính: góc trái là
"[TÊN CẤP ỦY CẤP TRÊN]" / "[TÊN ĐẢNG ỦY]" và dấu *, góc phải là
"ĐẢNG CỘNG SẢN VIỆT NAM" và địa danh, ngày tháng.
Việc: Đọc cấu trúc biểu mẫu (tiêu đề, khối thông tin, từng bảng, từng cột,
khối ký) rồi viết hàm xuất Word khổ ngang tái tạo đúng bố cục đó từ dữ liệu
của phân hệ.
Dạng: Trước khi viết mã, lập bảng đối chiếu "mục biểu mẫu ↔ trường dữ liệu";
mục nào chưa có dữ liệu thì đánh dấu để tôi quyết định.
Ràng buộc: Không đưa dữ liệu cá nhân thật vào mã hay vào kho mã nguồn.
Nghiệm thu: Chạy bản dựng thật, bấm xuất tệp, đọc ngược tệp Word bằng thư
viện đọc .docx và báo cáo: tiêu đề hai cột đúng chữ, đủ số bảng, đủ số cột,
đúng tên cột, khổ giấy ngang.
```
:::

## 10.5. Sự cố: kỳ dữ liệu theo quý

Chỉ một khác biệt về đơn vị thời gian, tháng và quý, đã sinh ra chuỗi ba sự cố nối tiếp nhau.

**Sự cố thứ nhất: hai phân hệ chung một bìa hồ sơ.** Mỗi kỳ được lưu thành một bản ghi mang tên kiểu "năm_tháng". Quý III của Kiểm điểm được lưu ở tháng 9, trùng tên với kỳ tháng 9 của OKR/KPI. Ai mở phân hệ sau, cơ chế tự lưu ghi đè danh sách của mình lên. Ngày 13/8/2026, cách sửa được áp dụng: thêm tiền tố riêng, gọi là không gian tên (namespace), để mỗi phân hệ có "tủ hồ sơ" riêng. Sửa xong lại lộ hệ quả: bot chat (Chương 14) dò tên bản ghi theo mẫu cũ nên mất hẳn phân hệ Kiểm điểm. Đây là một trong hai sự cố dây chuyền dẫn tới quy tắc "rà soát chức năng liên quan" (Chương 7).

**Sự cố thứ hai (từ 01/9/2026): đầu tháng, phân hệ trắng trang.** Kỳ mới chưa có dữ liệu, danh sách rỗng, một dòng mã cứ đòi lấy "người đứng đầu danh sách" nên cả phân hệ sập. Lỗi này chung cho ba phân hệ dùng tệp giao diện lõi; Chương 9 đã phân tích kỹ.

**Sự cố thứ ba: tháng 8 và tháng 9 cùng Quý III mà thành hai bản ghi.**

::: {.cauchuyen}
**Câu chuyện thực tế: chấm xong tháng 8, sang tháng 9 mở ra trống trơn**

Ô chọn quý ghi kỳ theo công thức "tháng = số quý × 3", nên Quý III là tháng 9. Nhưng khi vừa mở phân hệ, kỳ mặc định lại lấy tháng hiện tại theo lịch. Người mở trong tháng 8 chấm vào bản ghi tháng 8; sang tháng 9, phần mềm tìm bản ghi tháng 9 và không thấy gì. Cùng một quý có hai "địa chỉ", như hai người gửi thư cho cùng một cơ quan, người ghi số nhà cũ, người ghi số nhà mới.

Bản vá đưa lên kho mã nguồn ngày 28/9/2026 làm hai việc. Một là kỳ mặc định luôn quy về tháng cuối quý (3, 6, 9, 12), để cả quý dùng chung một bản ghi. Hai là khi bản ghi của quý còn trống mà có bản ghi ở một tháng khác trong cùng quý, phần mềm **nhận lại nguyên vẹn** bản ghi đó, không đặt lại điểm, vì đó vẫn là dữ liệu của chính quý ấy, kèm dải thông báo nói rõ điều vừa xảy ra. Kiểm chứng trên bản dựng thật: phân hệ nhận đúng bản ghi tháng 8 làm dữ liệu Quý III/2026.
:::

Bốn điều rút ra, áp dụng cho mọi phần mềm có chu kỳ:

1. Mỗi đơn vị thời gian nghiệp vụ (tháng, quý, năm, nhiệm kỳ) chỉ được có **một cách quy đổi** trong toàn hệ thống.
2. Lỗi theo lịch chỉ lộ ra khi sang kỳ; phải chủ động thử ngày đầu tháng, tháng giữa quý, ngày đầu năm.
3. Khi sửa cách lưu, ưu tiên **nhận lại** dữ liệu cũ thay vì bỏ đi.
4. Đổi chỗ lưu dữ liệu thì hỏi ngay: bot, báo cáo, tệp xuất nào đang đọc chỗ đó?

::: {.lenhmau}
**Câu lệnh mẫu 10.3 — Rà soát mốc thời gian trong một phân hệ theo chu kỳ**

```text
Hãy rà soát toàn bộ kho mã và liệt kê MỌI chỗ đang tính ra "kỳ hiện tại"
hoặc đổi qua lại giữa tháng, quý, năm (giao diện, lưu dữ liệu, bot, xuất
báo cáo). Lập bảng: tệp – dòng – công thức – kết quả với các ngày thử
[01/9/2026, 15/8/2026, 31/12/2026, 01/01/2027]. Chỗ nào cho kết quả khác
nhau thì đề xuất một hàm quy đổi dùng chung, nói rõ dữ liệu đã lưu theo
cách cũ được giữ lại thế nào. Chưa sửa mã; chờ tôi duyệt.
```
:::

## 10.6. Tự làm phiên bản nhỏ

Một bản kế hoạch quý tự tính điểm cho chính mình làm được ở Bậc 1 hoặc Bậc 2 của thang kiến tạo (Chương 2), trong một buổi.

**Bậc 1, bảng tính.** Một tệp Excel ba trang: "Danh mục" (5 mức độ, 3 tầm quan trọng); "Kế hoạch" (mỗi dòng một nhiệm vụ với đủ các cột của biểu mẫu); "Tổng hợp" (mỗi trục một dòng: điểm tối đa, KPI, điểm đạt; ô kiểm tra tổng bằng 70; ô xếp loại gợi ý). Trợ lý AI trò chuyện viết công thức; đồng chí chỉ mô tả cấu trúc, không dán nội dung thật.

**Bậc 2, trang công cụ một tệp.** Một tệp HTML mở bằng trình duyệt, dữ liệu lưu ngay trong trình duyệt của máy mình, có nút in ra PDF; không máy chủ, không tài khoản. Trợ lý AI trò chuyện viết được một tệp như vậy; dùng Claude Code thì cần gói trả phí (gói Pro giá tham khảo 20 USD/tháng tại thời điểm viết, 10/2026, có thể thay đổi).

::: {.thuchanh}
**Thực hành: bảng kế hoạch quý tự tính điểm (Bậc 1)**

1. Ghi ra danh sách cột của biểu mẫu kế hoạch quý đang dùng. Không dán biểu mẫu có tên người vào cửa sổ AI.
2. Gửi câu lệnh mẫu 10.4 cho trợ lý AI trò chuyện. Yêu cầu nó giải thích từng công thức bằng lời.
3. Tạo tệp trên máy cơ quan, dán công thức. Nhập thử ví dụ minh họa ở mục 10.2.5: kết quả phải ra 95,05 điểm; đổi nhiệm vụ trục 6 thành "Cơ bản hoàn thành" phải ra 94,3 điểm và xếp loại gợi ý HTT.
4. Thử ba ca biên: tổng điểm tối đa 69 (phải báo lỗi); một trục chưa chấm nhiệm vụ nào; 6/10 nhiệm vụ "Không hoàn thành".
5. Khóa các ô công thức, chỉ để mở các ô nhập. Ghi một dòng "Công cụ tự tính, chỉ để tham khảo" ở đầu trang.
:::

::: {.lenhmau}
**Câu lệnh mẫu 10.4 — Nhờ trợ lý AI trò chuyện viết công thức bảng kế hoạch quý**

```text
Vai: Đồng chí là chuyên gia Excel. Bối cảnh: Tôi lập kế hoạch quý gồm 6 trục,
tổng điểm tối đa 70 do tôi tự phân bổ. Trang "Kế hoạch" có cột A Trục (1-6),
E Tầm quan trọng, F Mức độ. Trang "Danh mục": A2:B6 mức độ → tỷ lệ
(100/90/75/55/30); D2:E4 tầm quan trọng → hệ số (1/1,5/2).
Việc: Viết công thức cho: tỷ lệ và hệ số của từng nhiệm vụ; KPI từng trục
= tổng(tỷ lệ × hệ số) / tổng(hệ số) của các nhiệm vụ đã chấm; điểm đạt =
KPI × điểm tối đa; ô kiểm tra tổng điểm tối đa = 70; ô xếp loại gợi ý theo
ngưỡng [90/70/50] và điều kiện [nêu điều kiện cơ quan đang áp dụng].
Dạng: Bảng gồm ô – công thức – giải thích bằng lời. Ràng buộc: Dùng dấu
phân cách đối số theo Excel tiếng Việt nếu khác; trục chưa chấm thì
hiện trống, không báo lỗi #DIV/0!.
```
:::

Dù chỉ là công cụ cá nhân, đừng đưa bản tự đánh giá có tên người lên AI công cộng, đừng để tệp có dữ liệu thật ở kho mã nguồn công khai hay thư mục chia sẻ rộng, và đừng để công cụ tự "chốt" xếp loại.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Yêu cầu bằng chứng đối chiếu với biểu mẫu giấy đang dùng thật, không chỉ một bản chạy được.
- Bước duyệt kế hoạch đầu quý là chốt chặn chống "đẹp số".
- Ba lựa chọn cần lãnh đạo chốt: Nhóm A mặc định "Đảm bảo" hay bắt buộc đánh dấu; ai được điều chỉnh KPI trục; tỷ lệ khống chế mức xếp loại cao nhất áp dụng cho kỳ quý.
- Quy định 227-QĐ/TW có hiệu lực từ 01/01/2027: cần giao rà soát lại toàn bộ cách chấm và ngưỡng trước kỳ đánh giá Quý I/2027.
- Dữ liệu kiểm điểm thật chỉ được đưa vào phần mềm khi đã chuyển sang hạ tầng của cơ quan và gỡ quyền đọc công khai của bản demo.
:::

## Tóm tắt chương 10

::: {.tomtat}
1. Đánh giá hằng quý theo Hướng dẫn 02-HD/BTCTW và Hướng dẫn 03-HD/TU đo bằng sản phẩm, theo sáu trục, có trục chính, trục phụ; phân hệ phục vụ 15 đồng chí diện BTV Tỉnh ủy quản lý.
2. Quy trình thật có hai bước: lập kế hoạch quý trình tập thể lãnh đạo duyệt, rồi tự đánh giá ngay trên kế hoạch đó.
3. Điểm tối đa từng trục không cố định, tổng luôn bằng 70; điểm đạt bằng KPI nhân điểm tối đa; Nhóm A chấm bằng đánh dấu.
4. Mười lăm mẫu kế hoạch theo chức danh chỉ là bản nháp máy đề xuất; suy mẫu phải xét "phó trưởng ban" trước "trưởng ban".
5. Văn bản của Đảng phải mang tiêu đề của Đảng; tệp Word xuất ra cần được đọc ngược bằng máy để nghiệm thu.
6. Mỗi đơn vị thời gian chỉ có một cách quy đổi; kỳ quý luôn quy về tháng cuối quý và dữ liệu cũ được nhận lại, không bỏ đi.
7. Phần mềm tính, giải thích và nhắc điều kiện; người có thẩm quyền quyết định xếp loại.
:::

## Câu hỏi suy ngẫm và bài tập

1. Với biểu mẫu kế hoạch quý của chính đồng chí, một phần mềm "dựng theo văn bản hướng dẫn" có thể lệch ở những chỗ nào?
2. Nếu điểm tối đa từng trục do cá nhân tự đề xuất, có những cách "đẹp số" nào? Tập thể lãnh đạo nên xem gì khi duyệt kế hoạch?
3. Nêu thêm ba cặp chức danh hoặc thuật ngữ trong cơ quan mà cụm ngắn nằm trọn trong cụm dài. Viết câu dặn AI để không nhầm.
4. Dùng ví dụ minh họa ở mục 10.2.5, tính lại điểm khi trục 2 có tối đa 25 điểm và trục 4 có tối đa 15 điểm. Xếp loại gợi ý có đổi không?
5. Khi Quy định 227-QĐ/TW có hiệu lực, những thông số nào trong phiên bản nhỏ của đồng chí cần được thiết kế để đổi được ở một chỗ?
