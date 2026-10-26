# Chương 10. Phân hệ kiểm điểm, đánh giá, xếp loại đảng viên hằng quý

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu yêu cầu đánh giá định kỳ hằng quý đối với cán bộ diện Ban Thường vụ Tỉnh ủy quản lý và cách số hóa nó thành một phân hệ phần mềm.
- Nắm quy trình hai bước "lập kế hoạch quý – tự đánh giá ngay trên kế hoạch đã duyệt", cách tính điểm sáu trục với điểm tối đa không cố định và Nhóm A chấm theo kiểu đánh dấu.
- Biết cách dựng mẫu kế hoạch theo chức danh, và nhận ra một cái bẫy chữ nghĩa rất nhỏ: "phó trưởng ban" chứa trọn "trưởng ban".
- Biết cách giao việc cho tác tử AI lập trình để xuất tệp Word đúng biểu mẫu văn bản của Đảng, rồi kiểm chứng bằng máy.
- Tự làm được một phiên bản nhỏ cho chính mình bằng bảng tính hoặc trang công cụ một tệp.

Dành cho: cán bộ tham mưu công tác tổ chức, đảng vụ; lãnh đạo các Ban, lãnh đạo Văn phòng; cán bộ muốn tự làm công cụ lập kế hoạch và tự đánh giá theo quý.
:::

Chương 9 kể về việc chấm điểm cán bộ, công chức của Văn phòng hằng tháng. Chương này đi tiếp sang một đối tượng khác, một chu kỳ khác và một loại văn bản khác: kiểm điểm, đánh giá, xếp loại hằng quý đối với các đồng chí lãnh đạo diện Ban Thường vụ (BTV) Tỉnh ủy quản lý tại cơ quan Hội đồng nhân dân (HĐND) tỉnh và Đoàn đại biểu Quốc hội (ĐBQH) tỉnh.

Phân hệ nằm trong hệ thống thử nghiệm của Văn phòng tại địa chỉ hdndthkpi.vercel.app, đường dẫn `#/kiemdiem`. Nó dùng chung "bộ khung" với phân hệ OKR/KPI của Chương 9 (cùng tệp giao diện lõi, cùng cách đăng nhập, cùng danh sách cán bộ một mối), nhưng có module tính điểm riêng, kho dữ liệu riêng và ba tệp Word xuất ra theo biểu mẫu riêng.

Tôi chọn kể chương này một cách thẳng thắn, vì đây là phân hệ cho tôi bài học đau nhất về nghiệp vụ. Phiên bản đầu tiên được dựng rất nhanh, bám sát câu chữ văn bản hướng dẫn, chạy trơn tru, nhìn rất "chuyên nghiệp". Nhưng khi tôi đặt nó cạnh tờ kế hoạch và bản tự đánh giá bằng giấy mà chính tôi đang dùng, nó lệch ở bốn chỗ lớn. Ngày 28/9/2026, tôi cùng tác tử AI lập trình dựng lại gần như toàn bộ phần đánh giá. Câu chuyện ấy, cùng các sự cố về kỳ dữ liệu theo quý, là phần cốt lõi của chương.

Chương đi theo khuôn chung của Phần thứ ba: bài toán và căn cứ, thiết kế giải pháp, cách giao việc cho AI, sự cố và bài học, phiên bản nhỏ để đồng chí tự làm, và điều lãnh đạo cần biết.

## 10.1. Bài toán và căn cứ

### 10.1.1. Một yêu cầu mới: đánh giá theo quý, đo bằng sản phẩm

Kiểm điểm, đánh giá, xếp loại theo năm là việc cán bộ, đảng viên đã quen. Đánh giá định kỳ theo quý, đo bằng sản phẩm, công việc cụ thể thì mới hơn, và được cụ thể hóa bằng hai văn bản ban hành giữa năm 2026.

Ngày 22/5/2026, Ban Tổ chức Trung ương ban hành Hướng dẫn 02-HD/BTCTW về một số nội dung đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý các cấp trong hệ thống chính trị. Văn bản này lấy Quy định 366-QĐ/TW ngày 30/8/2025 của Bộ Chính trị làm căn cứ. Ngày 02/7/2026, Tỉnh ủy Thanh Hóa ban hành Hướng dẫn 03-HD/TU cùng tên gọi, cụ thể hóa cho tỉnh, kèm một bộ phụ lục biểu mẫu. Theo hai hướng dẫn này, kết quả các trục kết quả trọng tâm được lấy làm cơ sở đánh giá, xếp loại bắt đầu từ Quý II năm 2026.

Đọc hai văn bản như đọc một bản thiết kế (cách đọc đã trình bày ở Chương 8), tôi tách được mấy ý mà phần mềm buộc phải "hiểu":

- **Chu kỳ là quý**, không phải tháng. Mỗi quý một lần lập kế hoạch, một lần tự đánh giá.
- **Đo bằng sản phẩm, công việc cụ thể** theo sáu trục kết quả trọng tâm. Hướng dẫn 02-HD/BTCTW nêu yêu cầu "sáu rõ: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền".
- **Có trục chính, trục phụ.** Mỗi cá nhân xác định trục nào giữ vai trò chính, chủ yếu, trục nào giữ vai trò phụ, phối hợp, hỗ trợ; trục chính chiếm tỷ trọng điểm cao hơn.
- **Phân định rõ ai đề xuất, ai quyết định.** Cấp trực tiếp sử dụng cán bộ nhận xét, đánh giá, đề xuất mức xếp loại; cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt.
- **Khuyến khích dùng công cụ số.** Đây là căn cứ quan trọng để cơ quan mạnh dạn thử nghiệm một công cụ số cho việc này (xem nguyên văn trong hộp dưới).

::: {.phaply}
**Căn cứ pháp lý**

- **Quy định 366-QĐ/TW ngày 30/8/2025** của Bộ Chính trị về việc kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị: có hiệu lực từ ngày ký; kiểm điểm, đánh giá theo nhiệm kỳ, hằng năm, hằng quý hoặc khi cần thiết. Lưu ý: ngày 19/10/2026, Bộ Chính trị đã ban hành **Quy định 227-QĐ/TW**, có hiệu lực từ 01/01/2027 và thay thế Quy định 366-QĐ/TW; kết quả đánh giá đã được phê duyệt trước ngày đó vẫn được sử dụng.
- **Hướng dẫn 02-HD/BTCTW ngày 22/5/2026** của Ban Tổ chức Trung ương. Điểm 1.2 có câu: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ". Điểm 2.5 quy định trục chính, trục phụ. Điểm 6.2 quy định cá nhân hoàn thành dưới 100% nhiệm vụ của quý thì xếp loại "Không hoàn thành nhiệm vụ", trừ lý do khách quan, bất khả kháng được xác nhận.
- **Hướng dẫn 03-HD/TU ngày 02/7/2026** của Tỉnh ủy Thanh Hóa về đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý các cấp trong hệ thống chính trị; áp dụng từ ngày ký.
- **Quy định 73-QĐ/TU ngày 14/11/2025** của Tỉnh ủy Thanh Hóa về việc kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị.

Pháp luật và quy định của Đảng được đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí cần đọc nguyên văn văn bản do cơ quan có thẩm quyền ban hành, không dựa vào bản tóm tắt trong sách hay trong phần mềm.
:::

Chữ "Lưu ý" trong hộp trên không phải chi tiết phụ. Quy định 227-QĐ/TW vừa ban hành một tuần trước khi tôi viết những dòng này. Theo thông tin báo chí mà tôi đọc khi đối chiếu, quy định mới có thay đổi về cách đánh giá nhóm tiêu chí chung (đánh giá theo mức độ đáp ứng thay vì chấm điểm) và nâng ngưỡng "Hoàn thành tốt nhiệm vụ" từ 70 lên 80 điểm. Tôi chưa sửa phần mềm theo các thông tin đó. Lý do rất đơn giản: phải chờ nguyên văn quy định và hướng dẫn thi hành của Trung ương, của Tỉnh ủy. Phần mềm chạy theo văn bản đã ban hành, không chạy theo tin tức. Nhưng cũng chính vì vậy, mọi ngưỡng điểm, mọi cách chấm trong phân hệ phải được thiết kế để đổi được ở một chỗ, có ghi chú rõ căn cứ. Năm 2027 sẽ là lúc kiểm tra thiết kế đó có tốt thật hay không.

### 10.1.2. Đối tượng: mười lăm đồng chí diện Ban Thường vụ Tỉnh ủy quản lý

Phân hệ phục vụ 15 đồng chí: 2 Phó Chủ tịch HĐND tỉnh; Trưởng Ban và Phó Trưởng Ban của cả 4 Ban (Kinh tế - Ngân sách, Văn hóa - Xã hội, Pháp chế, Dân tộc); Phó Trưởng đoàn ĐBQH tỉnh và đại biểu Quốc hội hoạt động chuyên trách; Chánh Văn phòng và 2 Phó Chánh Văn phòng.

Ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ: hằng tháng chấm KPI cùng cán bộ, công chức Văn phòng (Chương 9), hằng quý kiểm điểm với tư cách cán bộ diện BTV Tỉnh ủy quản lý. Nhật ký dự án ghi rõ đây là phương án do tôi chọn khi gộp danh sách cán bộ về một mối. Lãnh đạo Văn phòng vừa là cán bộ của Văn phòng, vừa thuộc diện BTV quản lý; ép mỗi người vào đúng một phân hệ sẽ gọn về dữ liệu nhưng sai với thực tế công việc.

Ai thuộc phân hệ này không do phân hệ tự quyết. Trong hồ sơ cán bộ Mẫu 2C ở phân hệ Quản lý cán bộ (Chương 12) có trường "Diện quản lý cán bộ" với hai giá trị: thuộc diện BTV Tỉnh ủy quản lý, hoặc không thuộc diện. Phân hệ Kiểm điểm chỉ đọc danh sách những người được đánh dấu thuộc diện. Muốn thêm, bớt người thì sửa ở hồ sơ gốc, không sửa trong phân hệ. Nguyên tắc "danh sách cán bộ một mối" này tôi sẽ nói kỹ ở Chương 12.

Một lưu ý trung thực: trong bản demo thử nghiệm, chức danh là chức danh thật của cơ quan, còn toàn bộ điểm số, mức xếp loại là **dữ liệu mô phỏng** để trình diễn (bộ dữ liệu mẫu chia 2 hồ sơ loại A, 12 hồ sơ loại B, 1 hồ sơ loại C). Không ai được hiểu những con số đó là kết quả kiểm điểm thật.

### 10.1.3. Làm bằng giấy thì vướng ở đâu

Biểu mẫu giấy không sai. Cái khó nằm ở khâu tính và khâu tổng hợp. Hãy hình dung một quý bình thường của cơ quan:

- Đầu quý, mỗi đồng chí lập một bản kế hoạch: đăng ký nhiệm vụ theo sáu trục, mỗi nhiệm vụ có kết quả cần đạt và thời gian hoàn thành, rồi tự đề xuất điểm tối đa cho từng trục sao cho tổng đúng 70. Chỉ cần cộng nhầm thành 65 hay 75 là bản kế hoạch phải in lại.
- Cuối quý, mỗi người ghi kết quả thực tế cho từng nhiệm vụ, quy ra tỷ lệ KPI của từng trục, nhân với điểm tối đa, cộng với điểm tiêu chí chung, rồi đối chiếu điều kiện xếp loại. Mỗi bước là một chỗ có thể sai số học.
- Bộ phận tham mưu tổng hợp 15 bản thành bảng tập thể, kiểm tra số lượng xếp loại cao nhất có vượt tỷ lệ cho phép không, rồi trình cấp có thẩm quyền.
- Quý sau lặp lại, với phân bổ điểm và nhiệm vụ khác.

Phần mềm không thay được phần nghĩ: nhiệm vụ nào là trọng tâm, kết quả nào là xứng đáng, ai xếp loại gì. Phần mềm chỉ nên gánh phần cộng, trừ, nhân, chia, đối chiếu và trình bày. Đó là ranh giới tôi giữ suốt quá trình làm phân hệ này.

## 10.2. Quy trình hai bước và cấu trúc điểm

### 10.2.1. Phiên bản đầu tiên: đúng văn bản, lệch thực tiễn

Phân hệ ra đời sau khi Hướng dẫn 03-HD/TU được ban hành. Tôi đưa cho tác tử AI lập trình văn bản hướng dẫn và các phụ lục, yêu cầu số hóa. Kết quả đầu tiên đúng khung: thang 100 điểm gồm Nhóm A tiêu chí chung 30 điểm và Nhóm B kết quả nhiệm vụ 70 điểm chia cho sáu trục. Sau đó tôi cho làm thêm vài vòng: dựng danh mục sản phẩm theo phụ lục, mỗi dòng tới mười ô nhập; bổ sung phần tự kiểm điểm bằng lời; rồi đơn giản hóa vì quá nhiều ô. Mỗi vòng đều "build xanh", đều chạy.

Rồi tôi làm việc lẽ ra phải làm từ đầu: đặt màn hình phần mềm cạnh bản tự đánh giá Quý III và bản kế hoạch Quý IV/2026 bằng giấy của chính mình.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch và bản dựng lại ngày 28/9/2026**

Tôi đưa hai tệp biểu mẫu thật của mình vào một thư mục riêng trong dự án, thư mục đã được chặn khỏi kho mã nguồn (repository) công khai, rồi yêu cầu tác tử AI đối chiếu từng mục của biểu mẫu với từng màn hình của phần mềm và liệt kê chỗ lệch.

Kết quả đối chiếu chỉ ra bốn chỗ lớn. Một là quy trình thật có **hai bước** (đầu kỳ lập kế hoạch, trình tập thể lãnh đạo duyệt; cuối kỳ tự đánh giá ngay trên kế hoạch đó), còn phần mềm chỉ có một bước. Hai là **điểm tối đa của từng trục không cố định**: phần mềm đóng cứng 15/10/10/15/10/10, trong khi biểu mẫu ghi rõ cá nhân tự đề xuất điểm theo thứ tự ưu tiên; kế hoạch Quý III của tôi phân bổ 15-20-10-15-5-5, Quý IV lại là 10-20-10-20-5-5. Ba là **Nhóm A chấm bằng đánh dấu** "Đảm bảo" hoặc "Không đảm bảo", còn phần mềm cho nhập điểm lẻ. Bốn là mỗi nhiệm vụ trên giấy có **đủ năm cột**, phần mềm chỉ có tên và mức độ.

Còn một chỗ thứ năm, nhỏ mà không nhỏ: tiêu đề tệp Word in tên cơ quan hành chính, trong khi đây là văn bản của Đảng.

Bản dựng lại phần đánh giá được đưa lên kho mã nguồn sáng 28/9/2026. Thay đổi chạm tới chín tệp, trong đó có một tệp mẫu kế hoạch mới hơn sáu trăm dòng. Tôi không tiếc các vòng làm trước. Nhưng tôi ghi nhớ: văn bản hướng dẫn chưa phải là thực tiễn, và "chạy được" chưa phải là "đúng".
:::

Phần còn lại của mục này mô tả phân hệ sau khi dựng lại.

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

**Thứ hai, tự đề xuất điểm tối đa cho từng trục** sao cho tổng đúng 70, và ghi trục đó là "trục chính, chủ yếu" hay "trục phụ, phối hợp, hỗ trợ". Giao diện có một thanh kiểm tra tổng: lệch khỏi 70 thì hiện cảnh báo. Có nút "Chia lại cho đủ 70 điểm": giữ nguyên tỷ lệ giữa các trục, làm tròn về bội số 0,5, phần lẻ dồn vào trục đang có điểm cao nhất để tổng không bị 69,5 hay 70,5 vì làm tròn.

**Thứ ba, trình tập thể lãnh đạo duyệt kế hoạch.** Phần mềm có một dấu riêng cho việc "kế hoạch quý đã được duyệt", tách biệt với dấu "bản tự đánh giá đã được phê duyệt" ở cuối kỳ. Bảng tổng hợp có cột "Kế hoạch: Đã duyệt / Chưa duyệt" để bộ phận tham mưu biết còn ai chưa hoàn tất bước một.

Vì sao bước duyệt kế hoạch quan trọng? Vì điểm tối đa do chính người được đánh giá đề xuất. Ai cũng có thể bị cám dỗ dồn điểm vào trục mình chắc chắn làm tốt. Đây là dạng quen thuộc của quy luật Goodhart mà Chương 9 đã nói: khi thước đo trở thành mục tiêu, người ta sẽ tìm cách "đẹp số". Chốt chặn không nằm ở phần mềm, mà ở tập thể lãnh đạo khi xem xét, phê duyệt bản kế hoạch.

### 10.2.3. Bước hai: tự đánh giá ngay trên kế hoạch đã duyệt

Cuối quý, cán bộ không lập phiếu mới. Họ mở lại chính bản kế hoạch, ghi kết quả thực tế cho từng nhiệm vụ và chọn mức độ hoàn thành. Phần mềm quy mức độ ra tỷ lệ phần trăm, nhân với trọng số theo tầm quan trọng:

| Mức độ hoàn thành | Tỷ lệ | Tầm quan trọng | Hệ số |
|---|---|---|---|
| Xuất sắc, vượt yêu cầu | 100% | Thường xuyên | ×1 |
| Hoàn thành tốt | 90% | Quan trọng | ×1,5 |
| Cơ bản hoàn thành | 75% | Trọng tâm, khó | ×2 |
| Chưa hoàn thành | 55% | | |
| Không hoàn thành | 30% | | |

**KPI của trục** là trung bình có trọng số của các nhiệm vụ đã chấm trong trục. **Điểm đạt của trục = KPI (%) × điểm tối đa của trục.** Nhóm B là tổng điểm đạt sáu trục.

Bản giấy chỉ ghi một con số KPI cho cả trục, và con số đó là của cấp có thẩm quyền. Vì vậy phần mềm cho phép cấp có thẩm quyền điều chỉnh KPI của từng trục. Màn hình luôn hiện song song con số tự tính và con số đã điều chỉnh, kèm nút "dùng lại số tự tính". Máy tính ra con số gợi ý, người có thẩm quyền chốt con số chính thức.

Phần tự luận cũng theo đúng bố cục văn bản, gồm bốn mục: kết quả chung; kết quả nổi bật theo trục; hạn chế, khuyết điểm và nguyên nhân; phương hướng khắc phục. Mục "Kết quả chung" có nút soạn tự động, nhưng đó **không phải AI**. Phần mềm chỉ ghép một câu theo khuôn từ số liệu đã chấm, kiểu "Hoàn thành x/y nhiệm vụ theo kế hoạch được phê duyệt, đạt z%; trong đó n nhiệm vụ hoàn thành vượt mức yêu cầu". Câu theo khuôn thì không bịa, không tô hồng, và luôn khớp với bảng điểm. Việc gì có quy tắc cố định thì để chương trình làm, không cần gọi AI.

Phần nhận xét của cấp có thẩm quyền có thêm ô "Mức độ đáp ứng đối với các mục tiêu, nhiệm vụ then chốt", đúng như biểu mẫu.

### 10.2.4. Nhóm A: đánh dấu, không chấm điểm lẻ

Nhóm A gồm ba nhóm tiêu chí, mỗi nhóm 10 điểm: phẩm chất chính trị, đạo đức, lối sống, trách nhiệm nêu gương (các mục 1.1 đến 1.9); tư duy đổi mới, khát vọng cống hiến, dám nghĩ, dám làm (2.1 đến 2.4); tự phê bình và phê bình, khắc phục hạn chế (3.1 đến 3.4). Điểm từng mục không đều nhau: có mục 1 điểm, có mục 1,5 điểm, có mục tới 4 điểm.

Biểu mẫu chỉ có hai ô đánh dấu (x) cho mỗi mục. Phần mềm vì thế đổi ô nhập số thành cặp nút "Đảm bảo / Không đảm bảo": đảm bảo thì được đủ điểm của mục, không đảm bảo thì 0 điểm. Có một chi tiết kỹ thuật đáng học: giá trị vẫn được **lưu dưới dạng số** (0 hoặc điểm tối đa của mục), nên các bản đã lưu trước khi đổi giao diện vẫn mở được, không vỡ. Người làm kỹ thuật gọi đó là tương thích ngược (backward compatibility). Người không chuyên chỉ cần nhớ một câu hỏi để hỏi AI: "dữ liệu lưu theo cách cũ sẽ hiện ra thế nào?".

Một lựa chọn thiết kế lãnh đạo nên biết: mục nào chưa đánh dấu thì phần mềm mặc định là "Đảm bảo", cột cấp duyệt kế thừa cột tự đánh giá. Cách này nhất quán với nguyên tắc "chấm trừ dần" của cả hệ thống, nhưng cũng có nghĩa là người không mở Nhóm A ra vẫn có đủ 30 điểm. Nếu cơ quan muốn bắt buộc đánh dấu từng mục, đó là một quyết định nghiệp vụ, cần lãnh đạo chốt rồi mới sửa phần mềm.

### 10.2.5. Xếp loại bốn mức và câu trả lời "vì sao"

Phần mềm tự đề xuất một trong bốn mức: Hoàn thành xuất sắc nhiệm vụ (HTXS), Hoàn thành tốt nhiệm vụ (HTT), Hoàn thành nhiệm vụ (HT), Không hoàn thành nhiệm vụ (KHT). Các điều kiện đã cài đặt như sau:

- **HTXS:** tổng từ 90 điểm, mọi nhiệm vụ đạt từ "Hoàn thành tốt" trở lên, Nhóm A đủ 30 điểm, và ít nhất 30% nhiệm vụ vượt mức.
- **HTT:** từ 70 điểm; hoặc từ 90 điểm nhưng chưa đủ điều kiện HTXS.
- **HT:** từ 50 đến dưới 70 điểm.
- **KHT:** dưới 50 điểm, hoặc trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật trong kỳ (ô này chỉ ép xếp loại, không trừ vào tổng điểm).

Các điều kiện này được tôi và tác tử AI đối chiếu từ quy định của Tỉnh ủy. Tệp quy định lưu trong dự án là bản chụp (scan), phải chuyển từng trang thành ảnh mới đọc được. Vì vậy, trước khi dùng thật, cơ quan cần đối chiếu lại với nguyên văn hiện hành, nhất là khi Quy định 227-QĐ/TW có hiệu lực từ năm 2027. Bảng tổng hợp tập thể còn có cảnh báo khi số HTXS vượt 20% số HTT, theo cùng cách khống chế tỷ lệ mà Quy định 1053-QĐ/TU áp dụng cho đánh giá hằng tháng. Tỷ lệ áp dụng cho kỳ đánh giá quý cũng là điểm cần đối chiếu.

Điều quan trọng hơn con số là phần giải thích. Mỗi khi xếp loại thấp hơn mức mà tổng điểm gợi ý, phần mềm ghi rõ lý do bằng tiếng Việt, ví dụ "Chưa đạt ≥30% nhiệm vụ vượt mức (hiện 20%) nên chưa đạt Hoàn thành xuất sắc".

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

Đổi một chi tiết: nhiệm vụ ở trục 6 chỉ "Cơ bản hoàn thành". KPI trục 6 còn 75%, điểm đạt 3,75; tổng còn 94,3, vẫn trên 90. Nhưng không còn "mọi nhiệm vụ từ Hoàn thành tốt", nên phần mềm đề xuất **HTT** và ghi lý do. Đây đúng là tình huống "điểm cao mà xếp loại không cao nhất" khiến người dùng tưởng phần mềm sai, nếu không có dòng giải thích.
:::

::: {.ghinho}
**Ghi nhớ**

- Kế hoạch quý là "hợp đồng" đầu kỳ; bản tự đánh giá được ghi ngay trên hợp đồng ấy.
- Điểm tối đa từng trục do cá nhân đề xuất, tập thể lãnh đạo duyệt; tổng luôn bằng 70.
- Phần mềm tính và giải thích; cấp có thẩm quyền ghi đè được KPI và là người quyết định xếp loại.
:::

## 10.3. Mẫu kế hoạch theo chức danh

### 10.3.1. Mười lăm mẫu cho mười lăm vị trí công tác

Lập kế hoạch quý từ trang trắng là việc tốn công. Vì vậy phân hệ có nút "Nạp mẫu nhiệm vụ theo chức danh". Thư viện mẫu gồm 15 mẫu: Phó Chủ tịch Thường trực HĐND tỉnh; Phó Chủ tịch HĐND tỉnh; Trưởng Ban và Phó Trưởng Ban của cả 4 Ban, mỗi Ban một bộ nhiệm vụ theo đúng lĩnh vực phụ trách; Phó Trưởng đoàn ĐBQH tỉnh; ĐBQH hoạt động chuyên trách; Chánh Văn phòng; Phó Chánh Văn phòng phụ trách khối HĐND; Phó Chánh Văn phòng phụ trách khối Đoàn ĐBQH.

Mỗi mẫu có phân bổ điểm sáu trục (tổng đúng 70), vai trò chính hoặc phụ của từng trục, và từ 9 đến 11 nhiệm vụ đã điền sẵn kết quả cần đạt, thời gian hoàn thành. Phân bổ khác nhau theo chức năng, ví dụ:

| Mẫu | Phân bổ trục 1→6 | Trục nặng nhất |
|---|---|---|
| Phó Chủ tịch Thường trực | 15-20-5-20-5-5 | Trục 2 và trục 4 |
| Trưởng Ban Kinh tế - Ngân sách | 20-20-5-10-10-5 | Trục 1 và trục 2 |
| Trưởng Ban Văn hóa - Xã hội | 10-20-5-10-20-5 | Trục 2 và trục 5 |
| Trưởng Ban Pháp chế | 10-25-5-15-5-10 | Trục 2 |
| Chánh Văn phòng | 15-15-10-20-5-5 | Trục 4 |

Mẫu của Phó Trưởng Ban được suy từ mẫu của Trưởng Ban cùng Ban: trục 1 cộng thêm 5 điểm vì Phó Trưởng Ban trực tiếp thực hiện thẩm tra, giám sát nhiều hơn; trục 4 bớt 5 điểm vì phần lãnh đạo, chỉ đạo nhẹ hơn. Tổng vẫn 70.

Tôi phải nói rõ bản chất của các mẫu này. Đó là **bản nháp do máy đề xuất**, dựng từ chức năng, nhiệm vụ của từng vị trí và chương trình công tác cuối năm 2026, không phải "chỉ tiêu giao". Nạp mẫu xong, cá nhân sửa, thêm, bớt nhiệm vụ và đề xuất lại điểm; tập thể lãnh đạo duyệt. Nạp lại mẫu thì dấu "kế hoạch đã duyệt" tự bị gỡ, vì bản kế hoạch đã khác bản được duyệt.

### 10.3.2. Cái bẫy "phó trưởng ban"

Để nạp đúng mẫu, phần mềm phải tự đoán mẫu từ chức vụ và đơn vị ghi trong hồ sơ. Nghe đơn giản: thấy chữ "trưởng ban" thì nạp mẫu Trưởng Ban. Nhưng chuỗi "phó trưởng ban" chứa trọn chuỗi "trưởng ban". Nếu máy hỏi "có chữ trưởng ban không?" trước, mọi Phó Trưởng Ban sẽ nhận nhầm mẫu của Trưởng Ban. Cặp "phó chánh văn phòng" và "chánh văn phòng" cũng vậy; "phó chủ tịch thường trực" và "phó chủ tịch" cũng vậy.

Cách sửa là xét chuỗi dài, cụ thể trước, chuỗi ngắn, chung sau. Đoạn mã thật trong dự án (rút gọn) đọc được ngay cả khi không biết lập trình:

```js
if (ban && /phó trưởng ban/.test(p)) return `pb_${ban}`;
if (ban && /trưởng ban/.test(p)) return `tb_${ban}`;
if (/phó chủ tịch thường trực/.test(p)) return 'pct_tt';
if (/phó chủ tịch/.test(p)) return 'pct';
if (/phó chánh văn phòng/.test(p)) return 'pho_vp_hdnd';
if (/chánh văn phòng/.test(p)) return 'chanh_vp';
```

Mỗi dòng là một câu hỏi "chức vụ có chứa cụm này không?"; câu hỏi đầu tiên được trả lời "có" sẽ quyết định mẫu. Thứ tự các dòng chính là nghiệp vụ.

Có trường hợp máy không thể tự đoán: hai Phó Chánh Văn phòng cùng chức danh nhưng phụ trách hai khối khác nhau. Khi đó hồ sơ được ghi sẵn khóa mẫu ở một trường riêng, và khóa do người ghi luôn được ưu tiên hơn suy đoán của máy.

Đây là cùng họ lỗi với cái bẫy "quốc gia" chứa "gia" mà Chương 15 sẽ kể ở bản tin pháp luật. Cách phòng giống nhau: mỗi lần vấp, biến ca lỗi thành một phép kiểm thử hồi quy (regression test) để máy tự kiểm tra ở mọi lần sửa sau. Bộ kiểm thử mẫu kế hoạch của phân hệ có 127 phép kiểm, trong đó có các phép: mẫu nào tổng điểm cũng đúng 70; trục nào cũng có nhiệm vụ đủ ba cột và khai vai trò; suy mẫu đúng cho 10 chức danh thật; nút chia lại cho đủ 70 đúng trong mọi tình huống. Một thiếu sót tôi phải nhận: bộ kiểm thử này nằm ở thư mục làm việc tạm, chưa được đưa lên kho mã nguồn, nên máy khác chưa chạy lại được. Việc chuyển các bộ kiểm thử vào một thư mục được lưu trữ chính thức đã nằm trong danh sách việc cần làm.

### 10.3.3. Nâng cấp bản lưu cũ mà không mất phần đã chấm

Khi dựng lại phân hệ, trên máy chủ đã có các bản lưu theo mô hình cũ: điểm tối đa cố định, nhiệm vụ chỉ có tên. Xóa đi làm lại là cách nhanh nhất, nhưng cũng là cách làm mất công sức của người dùng. Tôi yêu cầu một hàm nâng cấp: bản lưu nào chưa có cấu hình trục thì dựng lại kế hoạch từ mẫu chức danh, nhưng **giữ nguyên** phần Nhóm A đã đánh dấu, phần tự luận và mức xếp loại đã có. Hàm này chạy ở cả ba đường nạp dữ liệu: nạp một kỳ, chuyển tiếp sang kỳ mới, và nạp danh sách chính thống.

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
Dạng: Trình bày phương án và danh sách mẫu bằng bảng trước, chờ tôi duyệt.
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

- **Kế hoạch sản phẩm/công việc và kết quả cần đạt được của cá nhân** theo quý: khối thông tin cá nhân, bảng A, bảng B sáu trục có mục tiêu, kết quả cần đạt, thời gian; khối ký của cá nhân và xác nhận của tập thể lãnh đạo.
- **Bản tự đánh giá, xếp loại của cá nhân** (Phụ lục 3A): bảng A liệt kê từng mục 1.1 đến 3.4 với hai cột đánh dấu, bảng B sáu trục với điểm tối đa động, phần tự luận bốn mục, tự đề xuất xếp loại, nhận xét của cấp có thẩm quyền, khối ký xác nhận. Cột "Ghi chú" tự sinh câu theo khuôn, kiểu "Hoàn thành x/y nhiệm vụ; n nhiệm vụ vượt mức".
- **Bảng tổng hợp tập thể** (Phụ lục 4), bảy cột: số thứ tự; họ tên; chức vụ, đơn vị; cá nhân tự đề xuất mức xếp loại; cấp có thẩm quyền đề xuất mức xếp loại; tóm tắt căn cứ; đề xuất nội dung công tác cán bộ.

Muốn máy dựng đúng bố cục, phải cho máy "nhìn thấy" biểu mẫu gốc. Trong dự án, tệp Word mới được đọc trực tiếp; tệp Word đời cũ (.doc) phải chuyển sang .docx rồi mới trích được cấu trúc; tệp PDF chụp (scan) phải chuyển từng trang thành ảnh. Chất lượng tệp gốc quyết định chất lượng bản số hóa: có bản điện tử gốc thì đừng dùng bản chụp.

### 10.4.2. Văn bản của Đảng thì tiêu đề phải là của Đảng

Đây là lỗi tôi thấy xấu hổ nhất, vì nó nằm ngay dòng đầu tiên của văn bản. Các bản xuất ban đầu in ở góc trái tên cơ quan hành chính, theo thói quen của văn bản hành chính. Nhưng bản kế hoạch và bản tự đánh giá kèm hướng dẫn của Tỉnh ủy là văn bản của Đảng. Sau khi sửa, khối tiêu đề hai cột in đúng:

```text
TỈNH ỦY THANH HÓA                        ĐẢNG CỘNG SẢN VIỆT NAM
ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH       Thanh Hóa, ngày … tháng … năm …
          *
```

Vì sao AI mắc lỗi này? Vì phần lớn văn bản mà AI từng "đọc" khi được huấn luyện là văn bản hành chính, trình bày theo thể thức của Nghị định 30/2020/NĐ-CP về công tác văn thư. Văn bản của tổ chức đảng lại có hướng dẫn thể thức riêng của Đảng. Hai loại khác nhau từ quốc hiệu, tên cơ quan đến khối chữ ký. Nếu đồng chí không nói ra, AI sẽ mặc định theo loại văn bản nó gặp nhiều hơn. Bài học chung: **khi giao AI dựng văn bản, luôn nói rõ đó là văn bản loại gì, của tổ chức nào, theo hướng dẫn thể thức nào, và đưa kèm một bản mẫu chuẩn.**

### 10.4.3. Nghiệm thu bằng máy, không chỉ bằng mắt

Mở tệp Word ra xem bằng mắt là cần, nhưng chưa đủ. Sau lần dựng lại, tác tử AI chạy trình duyệt tự động trên bản dựng thật, mở phân hệ, bấm nút xuất cả hai tệp kế hoạch và tự đánh giá, nhận về hai tệp Word thật (khoảng 16 KB và 17 KB), rồi dùng một thư viện đọc Word (python-docx) đọc ngược lại để đối chiếu tiêu đề, khối thông tin, bảng A hai cột đánh dấu, bảng B sáu trục. Cách nghiệm thu này giống nghiệm thu công trình tại hiện trường, không nghiệm thu trên bản vẽ.

::: {.canhbao}
**Cảnh báo: hồ sơ kiểm điểm không phải dữ liệu để "thử" trên AI công cộng**

Bản kế hoạch, bản tự đánh giá có họ tên, ngày sinh, chức vụ Đảng và những nhận xét về phẩm chất, đạo đức của một con người. Họ tên, ngày sinh là dữ liệu cá nhân cơ bản theo Điều 3 Nghị định 356/2025/NĐ-CP hướng dẫn Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (cả hai có hiệu lực từ 01/01/2026). Hồ sơ kiểm điểm còn là tài liệu nội bộ của tổ chức đảng.

Vì vậy, trong dự án: biểu mẫu thật dùng để đối chiếu nằm ở thư mục bị chặn khỏi kho mã nguồn công khai; mã nguồn chỉ chứa cấu trúc biểu mẫu, không chứa nội dung đánh giá của ai. Khi dùng trợ lý AI trò chuyện công cộng, chỉ đưa cấu trúc biểu mẫu (dữ liệu vùng XANH), không dán bản tự đánh giá có tên người (vùng ĐỎ). Tài liệu có nội dung bí mật nhà nước thì tuyệt đối không soạn, không lưu trên thiết bị kết nối Internet, theo các quy định về bảo vệ bí mật nhà nước.

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
Dạng: Trước khi viết mã, lập bảng đối chiếu "mục trong biểu mẫu ↔ trường
dữ liệu"; mục nào chưa có dữ liệu thì đánh dấu để tôi quyết định.
Ràng buộc: Không đưa dữ liệu cá nhân thật vào mã hay vào kho mã nguồn.
Nghiệm thu: Chạy bản dựng thật, bấm xuất tệp, đọc ngược tệp Word bằng thư
viện đọc .docx và báo cáo: tiêu đề hai cột đúng chữ, đủ số bảng, đủ số cột,
đúng tên cột, khổ giấy ngang.
```
:::
