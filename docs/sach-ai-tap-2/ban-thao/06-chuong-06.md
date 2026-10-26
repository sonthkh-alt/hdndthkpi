# Chương 6. Giao việc cho tác tử AI lập trình: V-B-V-D-R phiên bản kiến tạo

::: {.muctieu}
**Mục tiêu của chương**

- Phân biệt việc hỏi trợ lý AI trò chuyện với việc giao việc cho một tác tử AI lập trình có quyền hành động trên máy tính và trong kho mã nguồn.
- Vận dụng khung lệnh V-B-V-D-R của Tập 1, bổ sung thành phần thứ sáu là Nghiệm thu, để viết một "phiếu giao việc" rõ phạm vi, rõ điều cấm, rõ tiêu chí hoàn thành.
- Biết bắt tác tử trình phương án trước khi làm, chia yêu cầu lớn thành bước nhỏ, đưa tài liệu nghiệp vụ và dặn đối chiếu từng mục.
- Tự nghiệm thu được kết quả khi không đọc được mã; nhận ra lúc tác tử đi lạc và biết cách kéo lại.
- Có sẵn bộ câu lệnh mẫu cho tám việc hay gặp nhất.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ cả chương, làm bài tập cuối chương); lãnh đạo nên đọc mục 6.1, 6.3, 6.6 và hộp "Dành cho lãnh đạo".
:::

Chương 5 đã dựng xong "xưởng làm việc số". Từ đây, phần khó nhất không còn là cài đặt mà là giao việc. Trong năm 2026, khi cùng tác tử AI lập trình xây dựng hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (hdndthkpi.vercel.app), tôi nhận ra một điều không dễ chịu: nhiều sự cố không bắt nguồn từ chỗ AI viết mã kém, mà từ chỗ tôi giao việc chưa đủ rõ. Thiếu phạm vi, thiếu điều cấm, thiếu một câu "thế nào thì coi là xong". Chương này tổng kết cách tôi giao việc hiện nay, kèm những lần vấp đã dạy tôi cách ấy.

## 6.1. Hỏi AI trò chuyện và giao việc cho tác tử: khác nhau ở đâu

Ở Tập 1, trợ lý AI trò chuyện (chatbot) được ví như một thư ký cao cấp. Đồng chí đưa yêu cầu, thư ký trả lại bản nháp; đồng chí đọc, sửa, rồi quyết định dùng hay không. Bản nháp sai mà không dùng thì không gây hại gì.

Tác tử AI lập trình (AI coding agent) như Claude Code khác về bản chất. Nó giống một tổ chuyên viên kỹ thuật được giao chìa khóa trụ sở: tự mở kho mã nguồn (repository), đọc hàng chục tệp, sửa tệp, chạy lệnh, chạy kiểm thử (test), tạo bản dựng (build), ghi thay đổi vào lịch sử (commit) và đẩy lên GitHub (push). Với hệ thống của Văn phòng, đẩy lên nhánh chính nghĩa là một đến hai phút sau, Vercel tự triển khai (deploy) và mọi người truy cập đều thấy thay đổi. Sai sót của trợ lý trò chuyện nằm trên trang giấy; sai sót của tác tử nằm ngay trong hệ thống đang chạy.

| Tiêu chí | Trợ lý AI trò chuyện | Tác tử AI lập trình |
|---|---|---|
| Sản phẩm | Đoạn văn, đoạn mã để chép | Tệp được sửa thẳng trong kho mã |
| Nhìn thấy gì | Những gì được dán vào | Cả kho mã, bộ nhớ dự án |
| Hành động | Không tự hành động | Sửa, xóa tệp; chạy lệnh; đẩy lên mạng |
| Khi sai | Không chép là xong | Lỗi đã nằm trong hệ thống |
| Cần ở người giao | Câu hỏi rõ | Phạm vi, điều cấm, nghiệm thu |

Còn hai khác biệt ít người để ý. Thứ nhất, phần kỹ thuật trong câu lệnh (prompt) có thể ngắn, vì tác tử tự đọc được mã; nhưng phần nghiệp vụ phải dài hơn, vì nó không biết biểu mẫu giấy trông ra sao, dữ liệu nào là nhạy cảm. Thứ hai, tác tử chủ động lấp chỗ trống: chỗ nào câu lệnh không nói, nó tự chọn thay đồng chí. Khi số hóa điều kiện xếp loại, tác tử từng hiểu "không hoàn thành" là "chưa đạt đủ 100%", nên một nhiệm vụ làm được 9/10 sản phẩm bị coi là không hoàn thành, kéo cả cán bộ có điểm cao xuống mức xếp loại thấp nhất. Không ai bảo nó hiểu như vậy, nhưng cũng không ai bảo nó phải hỏi lại.

::: {.vidu}
**Ví dụ minh họa: cùng một câu, hai kết cục**

Hãy hình dung đồng chí gõ: "Thêm cột Ghi chú vào bảng tổng hợp xuất ra Word." Trợ lý trò chuyện trả về một đoạn mã kèm lời dặn "dán vào chỗ phù hợp", và đoạn mã nằm yên trong khung chat. Tác tử thì tự tìm tệp, thêm cột, đẩy lên mạng; hai phút sau mọi người đều có cột mới. Cột đứng ở đâu, ghi gì, có làm lệch khổ giấy không, tác tử đã tự quyết hết.
:::

Vì vậy, yêu cầu gửi tác tử phải có ba thứ mà câu hỏi gửi trợ lý trò chuyện ít khi cần: **phạm vi** (được sửa phân hệ nào), **điều cấm** (không được đụng vào đâu), **tiêu chí nghiệm thu** (thế nào thì coi là xong). Đó chính là hợp đồng giao khoán quen thuộc khi sửa chữa trụ sở, chỉ khác là viết bằng vài chục dòng tiếng Việt.

::: {.canhbao}
**Cảnh báo: tác tử hành động trên máy thật**

- Tùy cấu hình quyền, tác tử hỏi trước khi sửa tệp, chạy lệnh, hoặc tự làm trong phạm vi đã cho phép. Đừng bấm "đồng ý tất cả" khi chưa đọc lệnh nó định chạy.
- Theo tài liệu chính thức của Claude Code (10/2026), bản cài gốc trên Windows không có chế độ "hộp cát" (sandbox) cô lập lệnh: lệnh chạy là chạy thật.
- Kho mã của dự án này là kho công khai; không dặn thì tệp nào trong thư mục dự án cũng có thể bị commit lên đó.
- Mọi thứ tác tử đọc đều được gửi tới mô hình AI trên máy chủ của nhà cung cấp. Thư mục dự án không phải nơi để tài liệu mật hay hồ sơ cá nhân chưa che.
:::

## 6.2. Khung V-B-V-D-R mở rộng: thêm chữ N là Nghiệm thu

Tập 1 dạy khung lệnh năm thành phần V-B-V-D-R: Vai, Bối cảnh, Việc, Dạng, Ràng buộc. Khung ấy vẫn dùng được với tác tử, nhưng mỗi chữ mang nghĩa rộng hơn. Tôi thêm thành phần thứ sáu: **N — Nghiệm thu**, tức tiêu chí hoàn thành đo được, viết ra trước khi tác tử bắt tay vào làm. Tập 1 khuyên dành 80% thời gian cho biên tập, kiểm chứng; với tác tử, phần ấy chính là nghiệm thu, và viết sẵn tiêu chí vào câu lệnh giúp rút ngắn nó.

| Thành phần | Với trợ lý trò chuyện | Với tác tử lập trình |
|---|---|---|
| Vai | Giọng văn, chuyên môn | Ai quyết nghiệp vụ, ai làm kỹ thuật |
| Bối cảnh | Tài liệu dán vào | Văn bản, biểu mẫu, hiện trạng hệ thống |
| Việc | Một yêu cầu | Một việc một lần, rõ phân hệ |
| Dạng | Định dạng trả về | Giao diện, tệp xuất, báo cáo cuối việc |
| Ràng buộc | Văn phong, độ dài | Không đụng chỗ khác, không lộ dữ liệu |
| Nghiệm thu | Thường không có | Tiêu chí đo được để tự kiểm tra |

### 6.2.1. Vai: ai là chủ đầu tư, ai là tổ thi công

Với trợ lý trò chuyện, Vai giúp chọn giọng văn. Với tác tử, Vai vạch ranh giới trách nhiệm. Câu tôi hay dùng: "Đóng vai lập trình viên cẩn trọng của dự án này; ưu tiên không làm mất dữ liệu hơn làm nhanh. Tôi là người quyết định về nghiệp vụ; chỗ nào nghiệp vụ chưa rõ thì hỏi tôi, không tự chọn." Câu cuối biến nguyên tắc máy đề xuất – người quyết định thành một mệnh lệnh cụ thể. Ngoài vai "người làm", nên dùng thêm vai người phản biện, kiểm toán viên bảo mật, người viết tài liệu; vai dùng lâu dài thì ghi vào bộ nhớ dự án (Chương 7).

### 6.2.2. Bối cảnh: những gì tác tử không tự nhìn thấy

Tác tử không đọc được văn bản trong tủ, không thấy màn hình của người dùng; Bối cảnh bù cho những chỗ mù ấy. Giao việc làm mới thì nêu: nghiệp vụ theo văn bản nào; ai dùng, bao nhiêu người (ví dụ 28 cán bộ ở phân hệ OKR/KPI, 15 đồng chí ở phân hệ Kiểm điểm); quy trình mấy bước; biểu mẫu ra sao. Giao việc sửa lỗi thì nêu: hiện tượng, đường dẫn, vai đang dùng, thời điểm bắt đầu, thông báo lỗi chép nguyên văn, điều lẽ ra phải thấy.

Chi tiết thời gian có khi là manh mối quyết định. Từ ngày 01/9/2026, ba phân hệ cùng trắng trang kèm dòng lỗi tiếng Anh "Cannot read properties of undefined (reading 'id')". Thông tin "bắt đầu từ ngày đầu tháng" dẫn thẳng tới nguyên nhân gốc: phần mềm luôn tìm "người đứng đầu danh sách", mà kỳ mới thì danh sách còn trống.

### 6.2.3. Việc: một việc một lần

Mỗi câu lệnh chỉ chứa một việc: một động từ rõ, một đối tượng, một địa điểm. "Làm cho phần Kiểm điểm tốt hơn" không phải là việc. "Thêm khối Kế hoạch quý vào phân hệ Kiểm điểm, đặt trên phần tự đánh giá" là một việc. Nếu câu mô tả có chữ "và" nối hai hành động khác nhau, hãy tự hỏi đó có phải hai việc không. Nhưng "một việc" không có nghĩa là "một tệp": thêm một cột điểm có thể buộc phải sửa cả bản xuất Word lẫn phần bot chat đọc số liệu. Thay đổi kéo theo ấy thuộc cùng một việc, phải làm trọn trong một lần sửa.

### 6.2.4. Dạng: sản phẩm trông ra sao

Dạng có ba lớp. **Lớp người dùng thấy:** vị trí trên màn hình, chữ tiếng Việt có dấu, dùng được trên điện thoại, thông báo lỗi bằng tiếng Việt dễ hiểu. **Lớp tệp xuất ra:** khổ giấy, tiêu đề, thứ tự cột của biểu mẫu. Văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức Đảng có thể thức riêng. Dự án từng in nhầm tên cơ quan hành chính vào đầu bản tự đánh giá đảng viên, trong khi tiêu đề đúng là "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH". **Lớp báo cáo cuối việc:** tác tử phải kết thúc bằng báo cáo ngắn theo khuôn cố định: đã sửa gì, tệp nào, đã kiểm tra gì, kết quả, việc tôi phải tự làm thêm.

### 6.2.5. Ràng buộc: những điều không được làm

Ràng buộc có hai loại. Loại **thường trực** áp dụng cho mọi việc, ghi một lần vào bộ nhớ dự án. Loại **riêng** chỉ cho việc đang giao, ghi vào câu lệnh. Tám ràng buộc thường trực dưới đây do dự án đúc kết, đồng chí có thể chép dùng.

1. Chỉ sửa trong phạm vi được giao; muốn đụng chỗ khác phải hỏi trước.
2. Không đổi công thức, ngưỡng điểm, câu chữ nghiệp vụ khi chưa được đồng ý.
3. Không xóa, không ghi đè dữ liệu đã lưu; dữ liệu lưu theo định dạng cũ phải mở được.
4. Không đưa dữ liệu thật, khóa bí mật vào mã nguồn; khóa bí mật không mang tiền tố `VITE_` (tiền tố này khiến biến bị nhúng vào trang web gửi xuống trình duyệt).
5. Không mở rộng quyền đọc, ghi khi chưa hỏi; đổi quyền thì thử cả vai khách lẫn vai quản trị.
6. Chữ trên giao diện và trong lịch sử thay đổi viết tiếng Việt có dấu, mã hóa UTF-8.
7. Trước khi báo xong: bản dựng xanh, công cụ soát lỗi cú pháp (lint) báo 0 lỗi, các phép kiểm liên quan đều đạt.
8. Chỉ commit đúng các tệp của việc đang làm, không "vơ" thay đổi lạ của người dùng.

Kinh nghiệm nhỏ: ràng buộc kèm lý do được áp dụng tốt hơn ràng buộc trơn. "Không lưu địa chỉ IP gốc của khách, vì đó là dữ liệu có thể nhận diện người" giúp tác tử tự xử lý đúng ở những chỗ tương tự mà đồng chí chưa kịp dặn.

### 6.2.6. Nghiệm thu: thế nào thì coi là xong

Đây là thành phần tôi thấy giá trị nhất. Tiêu chí tốt có bốn dạng: **đếm được**, **so được với nguồn chuẩn**, **thử được bằng thao tác**, **quan sát được ở nơi người dùng nhìn thấy**. Vài tiêu chí thật của dự án:

- Tab Đánh giá hiện đủ 28/28 cán bộ ở phân hệ OKR/KPI và 15/15 đồng chí ở phân hệ Kiểm điểm.
- Cùng đầu vào, điểm do phần mềm tính khớp bảng tính mô phỏng tới hai chữ số thập phân, như tài liệu Đặc tả yêu cầu phần mềm của dự án đòi hỏi.
- 41/82 đại biểu đồng ý thì kết luận "chưa thông qua, còn thiếu 1 phiếu".
- Lưu xong, tải lại trang, dữ liệu vẫn còn.
- Mở bằng vai khách: thấy bảng kết quả, không thấy nút phê duyệt.

Những tiêu chí như "chạy ổn", "đẹp hơn", "đúng quy định" không sai, nhưng không ai kiểm được. Tiêu chí nào làm được thì yêu cầu tác tử biến thành phép kiểm tự động để lần sau máy tự kiểm lại.

::: {.phaply}
**Căn cứ pháp lý và tinh thần giao việc**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người." Người giao việc cho tác tử vẫn chịu trách nhiệm về sản phẩm.
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương, điểm 1.2, nêu "sáu rõ: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền". Văn bản này nói về đánh giá cán bộ, không nói về AI; tôi chỉ mượn tinh thần ấy cho việc giao việc cho máy.
:::

Câu lệnh mẫu dưới đây ghép đủ sáu thành phần, tái dựng theo một việc đã làm ở phân hệ Kiểm điểm; khi làm thật tôi viết ngắn hơn vì nhiều ràng buộc đã có trong bộ nhớ dự án.

::: {.lenhmau}
**Câu lệnh mẫu 6.1 — Phiếu giao việc đủ sáu thành phần**

```text
[VAI] Đóng vai lập trình viên cẩn trọng của dự án này. Tôi là người quyết
định về nghiệp vụ; chỗ nào nghiệp vụ chưa rõ thì hỏi tôi, không tự chọn.

[BỐI CẢNH] Phân hệ Kiểm điểm (#/kiemdiem) chấm Nhóm B theo 6 trục, tổng 70
điểm. Theo biểu mẫu Kế hoạch quý (Hướng dẫn 03-HD/TU), điểm tối đa từng trục
do cá nhân tự đề xuất rồi trình tập thể lãnh đạo duyệt, nên mỗi quý mỗi người
một khác. Hiện người dùng nhập tổng khác 70 mà không được nhắc.

[VIỆC] Chỉ làm một việc: thêm thanh kiểm tra tổng điểm tối đa của 6 trục.

[DẠNG] Thanh nằm ngay trên bảng 6 trục, ghi "Tổng: x/70"; đủ 70 thì màu xanh,
lệch thì màu đỏ kèm nút "Chia lại cho đủ 70 điểm". Chữ tiếng Việt có dấu.

[RÀNG BUỘC] Không đổi công thức tính điểm, không đổi dữ liệu đã lưu, không
sửa phân hệ khác. Build xanh, lint 0 lỗi trước khi báo xong.

[NGHIỆM THU] (1) Nhập 15-20-10-15-5-5 thì thanh xanh "70/70". (2) Nhập tổng
75 thì thanh đỏ; bấm nút thì tổng về đúng 70. (3) Mở hồ sơ đã chấm quý trước:
điểm không đổi. Báo cáo: đã sửa tệp nào, kiểm tra thế nào, kết quả ra sao.
```
:::

## 6.3. Chế độ lập kế hoạch: bắt tác tử trình phương án trước khi làm

Với một tác tử biết hành động, thời điểm rẻ nhất để phát hiện hiểu lầm là trước khi có tệp nào bị sửa. Cơ quan nhà nước vốn quen nếp này: muốn ban hành quyết định phải có tờ trình; muốn thi công phải có phương án được duyệt.

Claude Code có chế độ lập kế hoạch (plan mode): tác tử được đọc tệp, tìm hiểu, phân tích, nhưng không sửa tệp; nó trình kế hoạch rồi chờ duyệt. Ở bản dòng lệnh tôi dùng năm 2026, tổ hợp phím Shift+Tab chuyển qua lại giữa các chế độ; cách bật có thể khác theo phiên bản và theo hãng. Cách chắc chắn nhất, dùng được với mọi tác tử, là viết vào đầu câu lệnh: "Chưa sửa tệp nào. Hãy đọc…, trình phương án…, chờ tôi duyệt."

Sửa lỗi chính tả trên nút bấm thì không cần phương án. Nhưng tôi luôn bắt trình phương án với sáu loại việc: chạm vào dữ liệu đã lưu; đổi quyền đọc, ghi; đụng tới nhiều phân hệ; diễn giải văn bản quy định; gọi dịch vụ AI tốn tiền; và việc chính tôi chưa hình dung được cách làm.

### 6.3.1. Đọc phương án như đọc tờ trình

Phương án tốt của tác tử có cấu trúc rất giống tờ trình.

| Phần của tờ trình | Phần tương ứng trong phương án |
|---|---|
| Sự cần thiết | Tác tử hiểu yêu cầu thế nào |
| Căn cứ | Đã đọc tệp nào, văn bản nào |
| Nội dung đề xuất | Sửa những gì, ở đâu |
| Các phương án | Các cách làm, ưu và nhược |
| Đánh giá tác động | Dữ liệu cũ, phân hệ khác, bot, tệp xuất, quyền |
| Kiến nghị | Những câu hỏi cần người quyết |

Phương án thiếu phần "đánh giá tác động" là phương án chưa đạt, dù phần còn lại hay đến đâu.

::: {.thuchanh}
**Thực hành: bảy câu hỏi khi duyệt phương án của tác tử**

1. Tác tử nhắc lại yêu cầu bằng lời của nó: có khớp ý mình không?
2. Có chạm vào dữ liệu đã lưu không? Dữ liệu cũ sẽ hiện ra thế nào?
3. Có tệp, phân hệ nào ngoài phạm vi bị sửa không? Vì sao?
4. Có đổi công thức, ngưỡng điểm, câu chữ nghiệp vụ không?
5. Có đổi quyền đọc, ghi; có phải chạy thêm lệnh nào trong cơ sở dữ liệu không?
6. Sẽ kiểm thử thế nào? Tiêu chí nghiệm thu là gì?
7. Tác tử đã tự giả định những gì? (Hỏi thẳng; nó thường liệt kê được.)
:::

Duyệt phương án như duyệt tờ trình: đồng ý, đồng ý có sửa ("làm theo phương án 2, bỏ điểm c"), hoặc trả lại yêu cầu làm rõ. Quyết định nghiệp vụ thì yêu cầu ghi vào nhật ký thay đổi để người sau biết vì sao.

::: {.cauchuyen}
**Câu chuyện thực tế: phần mềm phản biện, người dùng quyết**

Khi rà công thức của phân hệ OKR/KPI, tác tử phát hiện cách tính có thể dẫn tới "điểm số cao mà xếp loại thấp" và trình phương án, kể cả hướng điều chỉnh công thức. Tôi chọn giữ nguyên cách tính theo quy định, chỉ giải thích rõ và thêm ô cảnh báo đỏ "Chênh lệch điểm số và xếp loại" trên phiếu chấm. Nhật ký dự án có rất nhiều câu "người dùng chốt", như việc chuyển hẳn Sổ tay AI sang NotebookLM ngày 22/10/2026. Nguyên tắc máy đề xuất – người quyết định áp dụng cho cả quá trình làm ra phần mềm.
:::

::: {.lenhmau}
**Câu lệnh mẫu 6.2 — Yêu cầu trình phương án trước khi làm**

```text
CHƯA SỬA TỆP NÀO. Việc cần làm: [mô tả việc].
Đọc bộ nhớ dự án và các tệp liên quan, rồi trình phương án gồm:
1. Nhắc lại yêu cầu bằng lời của mình.
2. Các tệp và văn bản đã đọc làm căn cứ.
3. Những gì sẽ sửa, ở đâu; nếu có từ hai cách làm thì so sánh ưu, nhược.
4. Tác động: dữ liệu đã lưu, phân hệ khác, bot chat, tệp xuất báo cáo, quyền
   đọc/ghi. Chỗ nào khác đang đọc hoặc ghi thứ sắp bị đổi?
5. Cách kiểm thử và tiêu chí nghiệm thu đề xuất.
6. Những điều đã tự giả định; các câu hỏi về nghiệp vụ cần tôi quyết.
Viết ngắn, tiếng Việt, không dán mã. Chờ tôi duyệt rồi mới làm.
```
:::

## 6.4. Chia nhỏ công việc: từ "làm cho tôi hệ thống đánh giá" đến 15 bước

Giao một câu "làm cho tôi hệ thống đánh giá cán bộ", tác tử vẫn có thể dựng được thứ gì đó chạy được trong một buổi. Chính điều ấy mới nguy hiểm: sản phẩm chứa hàng trăm lựa chọn ẩn, khối lớn như vậy không thể nghiệm thu, lỗi phần này đan vào lỗi phần kia. Công trình nào cũng chia hạng mục và nghiệm thu từng hạng mục.

Một bước giao việc tốt thỏa mãn năm điều: có một sản phẩm thấy được hoặc đo được; nghiệm thu xong trong một lần ngồi (với tôi là khoảng mười lăm phút); kết thúc bằng bản dựng xanh và một lần commit, tức một điểm khôi phục an toàn; phần "tính" làm trước phần "đẹp", dữ liệu và phân quyền làm trước tiện ích; bước nào chạm dữ liệu đã lưu thì tách riêng.

Bảng dưới đây là cách tôi sẽ chia nếu làm lại phân hệ OKR/KPI, vốn dựa trên Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU của Ban Thường vụ Tỉnh ủy. Thực tế dự án không đi thẳng như vậy: phần chấm Nhóm II đã trải qua ba cách chấm, từ nhập số lần sai sót, sang chọn mức độ hoàn thành, rồi mới đến ba tiêu chí Số lượng – Chất lượng – Tiến độ.

| Bước | Việc giao cho tác tử | Nghiệm thu bằng |
|---|---|---|
| 1 | Đọc văn bản quy định, lập bảng tóm tắt công thức, điều kiện xếp loại; chưa viết mã | Đối chiếu bảng với văn bản gốc |
| 2 | Chuyển ví dụ trong bảng tính mô phỏng thành ca kiểm thử | Danh sách ca tiếng Việt, có đáp số |
| 3 | Dựng khung ứng dụng trống, có nhãn "Bản demo thử nghiệm" | Chạy được, bản dựng xanh |
| 4 | Mô hình dữ liệu cho một cán bộ, một kỳ | Tác tử giải thích bằng lời, tôi duyệt |
| 5 | Hàm tính điểm, tách riêng khỏi giao diện | Khớp bảng tính tới hai chữ số thập phân |
| 6 | Màn hình chấm Nhóm I theo từng Mẫu | Đủ tiêu chí, không vượt điểm tối đa |
| 7 | Màn hình Nhóm II: nhiệm vụ, danh mục, ba tiêu chí | (100+100+80)/3 = 93,3% hiện đúng |
| 8 | Điều kiện xếp loại, khối "Vì sao xếp loại này" | Ca bị hạ mức hiện đúng lý do |
| 9 | Lưu theo kỳ vào cơ sở dữ liệu (database) | Lưu, tải lại trang, dữ liệu còn |
| 10 | Đăng nhập, phân quyền khách, cán bộ, quản trị | Thử lần lượt bằng ba vai |
| 11 | Tách cột Tự đánh giá và cột Cấp duyệt | Cấp duyệt kế thừa khi chưa sửa |
| 12 | Phê duyệt; sửa điểm thì tự gỡ phê duyệt | Sửa một ô, dấu phê duyệt mất |
| 13 | Xuất phiếu đánh giá ra Word | Mở tệp, đối chiếu biểu mẫu |
| 14 | Trang Tổng quan, biểu đồ | Số liệu khớp bảng điểm |
| 15 | Triển khai, trang hướng dẫn, ghi nhật ký | Mở địa chỉ thật trên điện thoại |

Đồng chí có thể giao luôn việc lập lộ trình cho tác tử (chưa viết mã), rồi sửa như sửa kế hoạch công tác do chuyên viên dự thảo.

::: {.lenhmau}
**Câu lệnh mẫu 6.3 — Lập lộ trình chia nhỏ một yêu cầu lớn**

```text
CHƯA VIẾT MÃ. Tôi muốn xây dựng [mô tả ứng dụng, 3-5 dòng], phục vụ [ai,
bao nhiêu người], theo [văn bản, biểu mẫu nào].
Lập lộ trình 10-15 bước. Mỗi bước ghi: việc cần làm; sản phẩm thấy được;
cách tôi nghiệm thu trong khoảng 15 phút mà không cần đọc mã.
Phần tính toán làm trước giao diện; dữ liệu và phân quyền làm trước tiện ích;
bước nào chạm dữ liệu đã lưu thì tách riêng. Đánh dấu các bước có chỗ nghiệp
vụ cần tôi quyết, kèm câu hỏi cụ thể.
```
:::

::: {.ghinho}
**Ghi nhớ**

Một bước tốt gồm: một câu mô tả, một sản phẩm thấy được, một cách nghiệm thu, một lần commit. Việc nào chưa viết được thành một câu như vậy thì chưa đủ nhỏ để giao.
:::

## 6.5. Đưa tài liệu nghiệp vụ cho tác tử và dặn đối chiếu từng mục

Tác tử thuộc mã, không thuộc văn bản của cơ quan. Không có tài liệu, nó dựng theo trí nhớ và "thông lệ", cho ra sản phẩm trông hợp lý mà vẫn sai. Phân hệ Kiểm điểm từng đóng cứng điểm tối đa của sáu trục là 15/10/10/15/10/10, trong khi biểu mẫu thật để mỗi cá nhân tự đề xuất theo thứ tự ưu tiên công việc.

Có bốn loại tài liệu nên đưa cho tác tử:

- **Văn bản quy phạm, hướng dẫn.** Ưu tiên bản điện tử có lớp chữ. Tệp PDF chụp (scan) chỉ là ảnh, dự án đã phải chuyển từng trang thành ảnh để tác tử đọc; tệp `.doc` đời cũ phải chuyển sang `.docx`.
- **Biểu mẫu giấy đang dùng thật.** Quý nhất, vì nó cho thấy cơ quan thực sự làm thế nào. Che thông tin cá nhân, để trong thư mục đã chặn khỏi kho mã công khai.
- **Bảng tính mô phỏng.** Đóng vai "đáp án": tài liệu Đặc tả của dự án gọi tệp Excel mô phỏng cách tính điểm là bộ ca kiểm thử bắt buộc.
- **Danh mục, quyết định nội bộ.** Chẳng hạn danh mục 48 sản phẩm, công việc của Văn phòng mà phân hệ OKR/KPI dùng làm thước đo.

Đưa tài liệu rồi phải dặn cách dùng. Tôi luôn đòi ba việc: lập **bảng đối chiếu** (mục trong văn bản, nơi thể hiện trong phần mềm, khớp hay lệch); mỗi quy tắc trong phần mềm phải **trích được câu chữ gốc** làm căn cứ; chỗ nào văn bản hiểu được nhiều cách hoặc tự mâu thuẫn thì **liệt kê để người quyết**, không tự chọn, càng không tự sửa văn bản.

Việc thứ ba quan trọng hơn ta tưởng. Khi số hóa dự thảo Khung tiêu chí đánh giá HĐND nhiệm kỳ 2026–2031, tác tử phát hiện sáu chỗ chưa nhất quán, chẳng hạn một nhóm điểm thưởng có bốn nội dung cộng lại 13 điểm trong khi trần là 10. Phần mềm không "chọn đại" mà chuẩn hóa có ghi chú công khai để cơ quan soạn thảo xem xét (Chương 8 và Chương 11).

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch giữa phần mềm và biểu mẫu giấy**

Phân hệ Kiểm điểm ban đầu được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy. Sau đó tôi đưa tác tử bản tự đánh giá Quý III và kế hoạch Quý IV/2026 của chính mình (để ngoài kho công khai) để đối chiếu từng mục. Lần sửa ngày 28/9/2026 ghi lại bốn chỗ lệch lớn: quy trình thật có hai bước (đầu quý lập kế hoạch, trình tập thể lãnh đạo duyệt; cuối quý tự đánh giá trên chính kế hoạch đó), phần mềm chỉ có một; điểm tối đa từng trục không cố định, hai quý liên tiếp của tôi là 15-20-10-15-5-5 rồi 10-20-10-20-5-5; Nhóm A chỉ đánh dấu "Đảm bảo" hoặc "Không đảm bảo", phần mềm lại cho nhập điểm lẻ; mỗi nhiệm vụ phải đủ năm cột của biểu mẫu. Văn bản hướng dẫn chưa phải là thực tiễn, và những gì "tưởng là cố định" thường chính là chỗ sai.
:::

::: {.canhbao}
**Cảnh báo: tài liệu đưa cho tác tử cũng là dữ liệu đi ra ngoài**

- Phân loại theo ba vùng ĐỎ/VÀNG/XANH của Tập 1 trước khi đưa. Tài liệu mật thuộc vùng ĐỎ: không đưa cho tác tử dùng dịch vụ AI công cộng, theo các quy định về bảo vệ bí mật nhà nước.
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) phân dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm. Biểu mẫu thật dùng làm mẫu phải được che họ tên, ngày sinh, số định danh, số điện thoại trước khi đưa.
- Tài liệu thật đặt vào thư mục dự án mà quên khai báo chặn trong tệp `.gitignore` thì lần commit kế tiếp có thể đưa nó lên kho công khai.
:::

::: {.lenhmau}
**Câu lệnh mẫu 6.4 — Đối chiếu văn bản nghiệp vụ với phần mềm**

```text
CHƯA SỬA TỆP NÀO. Đọc kỹ [tên văn bản/biểu mẫu, đường dẫn tệp] và phân hệ
[tên]. Lập bảng: Mục trong văn bản | Nơi thể hiện trong phần mềm | Khớp hay
Lệch | Ghi chú.
Mỗi quy tắc tính điểm, ngưỡng, thời hạn trong phần mềm: trích nguyên văn câu
chữ làm căn cứ; quy tắc nào không có căn cứ thì đánh dấu riêng.
Chỗ văn bản hiểu được nhiều cách, tổng điểm thành phần không khớp điểm tối
đa, hoặc điều khoản đánh số không liền mạch: liệt kê các cách hiểu và hệ quả.
Không tự chọn, không tự sửa văn bản. Phân biệt văn bản của tổ chức Đảng với
văn bản hành chính khi nói về thể thức.
```
:::

## 6.6. Đọc hiểu và nghiệm thu khi không biết lập trình

Hệ thống thử nghiệm của Văn phòng có khoảng 21.400 dòng mã. Tôi không đọc hết, và không cần đọc hết. Người nghiệm thu công trình không cần biết trộn bê tông; họ cần biết hỏi, biết đo, biết thử. Dưới đây là năm cách tôi dùng hằng ngày.

**Một: bắt tác tử giải thích bằng lời** (Câu lệnh mẫu 6.5). Nếu nó không giải thích nổi một thay đổi bằng lời giản dị, đó là dấu hiệu cần dừng lại.

**Hai: đọc danh sách phép kiểm như đọc tiêu chí nghiệm thu.** Đồng chí không đọc được mã, nhưng đọc được các phép kiểm viết bằng tiếng Việt: "41/82 thì thiếu 1 phiếu", "lời chào tối đa 2 dòng", "không có số điện thoại nào trong mã nguồn". Đọc xong, tự hỏi: ca nào hay gặp mà chưa có trong danh sách?

**Ba: tự tay chạy thử.** Lệnh `npm run dev` mở ứng dụng trên máy để bấm thử giao diện. Nhưng các hàm phía máy chủ của dự án (thư mục `api/`, nơi gọi AI và chạy bot chat) chỉ chạy trên Vercel, nên những chức năng ấy phải thử trên địa chỉ thật sau khi triển khai. Bản dựng xanh mới chứng tỏ mã "đọc được", chưa chứng tỏ phần mềm chạy đúng.

**Bốn: thử theo vai và theo tình huống biên.** Lần lượt mở bằng vai khách, cán bộ, quản trị, và mở trên điện thoại. Thử những tình huống dễ bị bỏ quên: danh sách trống; ngày đầu tháng, đầu quý; hai người trùng họ tên; dữ liệu lưu từ trước khi sửa. Với chức năng lưu, phép thử đúng là "lưu, tải lại trang, còn không?", không phải nhìn dòng chữ "Đã lưu". Danh bạ điện thoại của dự án từng báo lưu thành công rồi biến mất khi mở lại.

**Năm: hỏi câu hỏi dây chuyền.** "Chỗ nào khác đang đọc hoặc ghi thứ vừa đổi?" Đây là câu hỏi đắt giá nhất của cả chương.

::: {.cauchuyen}
**Câu chuyện thực tế: ngày 13/8/2026**

Hôm ấy có hai thay đổi đều đúng yêu cầu: tách kho dữ liệu riêng cho từng phân hệ, và gộp danh sách cán bộ về một mối. Cả hai đều chạy. Nhưng bot chat dò dữ liệu bằng một quy tắc riêng nên mất hẳn phân hệ Kiểm điểm; còn việc gộp danh sách làm hai đồng chí trùng cả họ và tên ở hai đơn vị khác nhau bị ghép làm một, phân hệ OKR/KPI chỉ còn 27 thay vì 28 người. Từ đó, quy ước của dự án có quy tắc bắt buộc "rà soát chức năng liên quan", mà Chương 7 sẽ trình bày đầy đủ.
:::

Cuối cùng, hãy nghiệm thu ở đúng nơi người dùng nhìn thấy. Bản tin pháp luật trên Trang chủ từng được giao cho một tác vụ định kỳ trên đám mây, được coi là chạy hằng ngày; đến khi rà soát mới biết bước đẩy ảnh lên chưa từng chạy được lần nào. Tác tử cũng tự nghiệm thu được: mở trang thật bằng trình duyệt tự động, đếm lỗi; xuất tệp Word rồi đọc lại; đo kích thước chữ. Nhờ đo, ảnh xem trước khi chia sẻ liên kết được phát hiện có dòng chữ kết thúc ở 1.214 điểm ảnh trong khung rộng 1.200.

::: {.thuchanh}
**Thực hành: nghiệm thu một việc trong mười lăm phút**

1. Đọc báo cáo cuối việc của tác tử: đã sửa gì, tệp nào, kiểm tra gì, kết quả.
2. Đọc lướt danh sách phép kiểm liên quan; bổ sung ca còn thiếu.
3. Đối chiếu từng tiêu chí nghiệm thu trong câu lệnh, đánh dấu đạt hoặc chưa đạt.
4. Mở ứng dụng bằng vai khách và vai quản trị; thử một tình huống biên.
5. Với chức năng lưu: lưu, tải lại trang, kiểm tra dữ liệu còn.
6. Hỏi tác tử: "Chỗ nào khác đọc hoặc ghi thứ vừa đổi? Đã kiểm chưa?" Sau khi triển khai, mở địa chỉ thật.
:::

::: {.lenhmau}
**Câu lệnh mẫu 6.5 — Giải thích thay đổi để tôi tự nghiệm thu**

```text
Tôi không đọc mã. Báo cáo việc vừa làm bằng tiếng Việt đời thường:
1. Đã đổi gì, ở tệp nào, vì sao; ví von bằng công việc văn phòng nếu được.
2. Dữ liệu đã lưu trước đây có bị ảnh hưởng không; mở lại sẽ thấy gì.
3. Chỗ nào khác đang đọc hoặc ghi thứ vừa đổi (bot chat, tệp xuất, quyền...);
   đã kiểm từng chỗ chưa, bằng cách nào.
4. Danh sách phép kiểm liên quan, mỗi phép một dòng tiếng Việt, kèm kết quả.
5. Năm thao tác tôi tự làm để nghiệm thu, kể cả thử bằng vai khách và vai
   quản trị, kèm kết quả đúng phải trông thế nào.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

Khi cán bộ báo cáo "đã làm xong một chức năng cùng AI", lãnh đạo không cần xem mã, chỉ cần hỏi bốn câu. Phiếu giao việc ghi tiêu chí nghiệm thu gì? Ai đã nghiệm thu, thử bằng những vai nào? Tài liệu, dữ liệu nào đã đưa cho tác tử đọc? Thay đổi đã ghi vào nhật ký chưa, nếu hỏng thì quay lại bản trước bằng cách nào? Trả lời được bốn câu ấy là cán bộ đang làm việc có kiểm soát.
:::

## 6.7. Khi tác tử đi lạc: dấu hiệu và cách kéo lại

Tác tử không mệt, không nản, và rất ít khi tự nhận là mình đang lạc đường. Người giao việc phải là người nhận ra.

| Dấu hiệu | Thường do đâu | Cách kéo lại |
|---|---|---|
| Sửa ba lượt, lỗi vẫn còn | Đoán nguyên nhân, chưa tìm gốc | Dừng sửa; đòi chẩn đoán, đo đạc |
| Sửa chỗ này hỏng chỗ kia | Không rà chỗ liên quan | Quay về bản trước; liệt kê nơi đọc, ghi |
| Tự thêm việc không được giao | Câu lệnh quá mở | Nhắc phạm vi; bỏ phần thừa |
| Báo "xong" mà không có bằng chứng | Coi bản dựng xanh là xong | Đòi kết quả kiểm thử, thao tác thật |
| Tự đổi công thức, ngưỡng điểm | Tự chọn một cách hiểu | Dừng; liệt kê cách hiểu để người quyết |
| Sửa phép kiểm cho khớp kết quả | Muốn mọi thứ "xanh" | Từ chối; phép kiểm là tiêu chí nghiệm thu |
| Nói chắc về dịch vụ bên ngoài | Kiến thức có hạn sử dụng | Đòi kiểm tra thực tế |
| Quên điều đã dặn đầu phiên | Phiên làm việc quá dài | Ghi vào bộ nhớ dự án, mở phiên mới |

Dấu hiệu "nói chắc về dịch vụ bên ngoài" có ví dụ thật: khi gắn đường dẫn NotebookLM vào phân hệ Sổ tay AI, tác tử kiểm tra thực tế mới biết Google đã chuyển tên miền sang `notebook.google.com`. Tin trí nhớ thì phần mềm đã lưu địa chỉ lỗi thời.

Kéo tác tử lại gồm bốn động tác. **Dừng:** ở bản dòng lệnh, phím Esc ngắt việc đang chạy. **Bắt tóm tắt:** đã thử gì, kết quả ra sao, đang nghi điều gì. **Đo trước khi sửa:** bot chat của dự án từng trả lời bằng dòng tiếng Anh khó hiểu "This operation was aborted"; chỉ khi ghi số đo thời gian từng khâu mới thấy đó là trần 45 giây chờ AI bị chạm. **Quay về điểm an toàn:** nhờ mỗi bước kết thúc bằng một lần commit, đồng chí luôn có thể yêu cầu bỏ các thay đổi chưa commit hoặc quay về bản chạy tốt gần nhất. Đây là thao tác xóa bỏ công sức, nên tác tử phải nói rõ sẽ mất gì và chờ đồng chí đồng ý.

Nên làm lại từ đầu thay vì vá tiếp khi: ba lượt sửa cùng một lỗi mà không tiến; thay đổi lan ra nhiều tệp không ai giải thích được; nền móng sai, như mô hình dữ liệu không khớp quy trình thật; hoặc chính đồng chí không còn hiểu hệ thống chạy thế nào. Làm lại không có nghĩa là mất hết: quay về bản sạch gần nhất, mở phiên mới, giao lại việc bằng câu lệnh tốt hơn kèm bài học vừa rút ra. Tập 1 dặn: phải sửa quá nửa câu chữ AI viết thì lỗi nằm ở câu lệnh; với tác tử cũng vậy. Hai bản giao diện "Mới" và "PRO" của dự án từng được làm thêm rất nhanh, rồi bị gỡ hẳn vì mỗi tính năng phải làm ba lần; mã của chúng vẫn còn trong lịch sử Git.

::: {.lenhmau}
**Câu lệnh mẫu 6.6 — Kéo tác tử về khi đang đi lạc**

```text
DỪNG sửa. Chưa sửa thêm tệp nào.
1. Tóm tắt: từ đầu việc này đã thử những gì, mỗi lần kết quả ra sao.
2. Liệt kê mọi tệp đã thay đổi so với lần commit gần nhất, mỗi tệp một dòng
   lý do. Tệp nào nằm ngoài phạm vi tôi giao?
3. Nêu các giả thuyết về nguyên nhân gốc, kèm cách đo để phân biệt chúng.
4. Đề xuất: tiếp tục, hay quay về bản đã commit rồi làm lại. Nếu quay về thì
   nói rõ sẽ mất những gì. Chờ tôi quyết.
```
:::

## 6.8. Bộ câu lệnh mẫu giao việc

Tám câu lệnh dưới đây dùng cho tám việc tôi gặp nhiều nhất. Chỗ trong ngoặc vuông là chỗ đồng chí điền; ràng buộc nào đã có trong bộ nhớ dự án thì bỏ bớt. Với việc lớn, gửi Câu lệnh mẫu 6.2 trước.

**Tạo phân hệ mới.** Phân hệ Sổ tay AI phải được khai báo ở nhiều nơi mới "sống" được: danh mục phân hệ, bộ định tuyến, Trang chủ, trang Hướng dẫn, kiến thức của bot chat, chính sách quyền trong cơ sở dữ liệu. Câu lệnh phải buộc tác tử tìm đủ những chỗ ấy.

::: {.lenhmau}
**Câu lệnh mẫu 6.7 — Tạo phân hệ mới**

```text
CHƯA SỬA TỆP NÀO. Cần phân hệ mới "[tên]", đường dẫn #/[tên-ngắn].
Nghiệp vụ: [3-5 dòng: ai dùng, làm gì, theo văn bản nào; tài liệu ở đâu].
Quyền: khách chỉ xem; [vai] được ghi; Quản trị toàn quyền.
Trình phương án: (1) mọi chỗ phải khai báo để phân hệ hiện ở Trang chủ, trang
Hướng dẫn và bot chat; (2) kho dữ liệu RIÊNG; (3) quyền từng vai và lệnh cơ
sở dữ liệu cần chạy; (4) phần tính toán tách riêng để kiểm thử bằng Node;
(5) lộ trình các bước, mỗi bước một cách nghiệm thu. Chờ tôi duyệt.
```
:::

**Sửa lỗi có mô tả hiện tượng.** Mấu chốt là không cho sửa vội, và giữ tình huống lỗi lại thành phép kiểm.

::: {.lenhmau}
**Câu lệnh mẫu 6.8 — Sửa lỗi có mô tả hiện tượng**

```text
Hiện tượng: [mở trang nào, bấm gì, thấy gì]. Bắt đầu từ: [ngày]. Vai đang
dùng: [khách/cán bộ/quản trị]. Lỗi nguyên văn: "[chép nguyên văn]".
Lẽ ra phải thấy: [mô tả].
1. Chưa sửa. Tìm nguyên nhân gốc, giải thích bằng lời đời thường.
2. Lỗi có thể tái diễn khi nào: đầu tháng, danh sách trống, dữ liệu cũ...?
3. Đề xuất cách sửa và các chỗ khác cùng đọc, ghi thứ sẽ bị sửa.
4. Khi tôi đồng ý: sửa, thêm phép kiểm giữ lại đúng tình huống này, chạy lại
   kiểm thử liên quan, build xanh. Báo việc tôi phải tự làm (nếu có).
```
:::

**Thêm cột vào tệp Word xuất ra.** Nghiệm thu phải trên tệp thật.

::: {.lenhmau}
**Câu lệnh mẫu 6.9 — Thêm cột vào bản xuất Word**

```text
Trong bản Word "[tên bản xuất]" của phân hệ [tên], thêm cột "[tên cột]" sau
cột "[cột đứng trước]". Nội dung: [quy tắc, ví dụ "Hoàn thành x/y nhiệm vụ;
n nhiệm vụ vượt mức", tự sinh từ số liệu đã chấm].
Đối chiếu biểu mẫu [tệp]; giữ khổ giấy, tiêu đề, khối chữ ký, mọi cột hiện
có. Không đổi cách tính điểm. Bản Excel, bot chat dùng chung số liệu thì báo
tôi trước.
Nghiệm thu: xuất thử bằng dữ liệu mẫu, đọc lại tệp vừa xuất, liệt kê tiêu đề
các cột theo thứ tự và hai dòng đầu của bảng.
```
:::

**Rà soát bảo mật.** Giao vai kiểm toán viên và cấm sửa, để nhận về một bảng rủi ro thay vì một loạt thay đổi. Kiểu rà soát này từng phát hiện một tệp thử nghiệm đã lọt lên kho công khai, dù quy ước cấm commit thư mục chứa nó.

::: {.lenhmau}
**Câu lệnh mẫu 6.10 — Rà soát bảo mật, chỉ báo cáo**

```text
Đóng vai kiểm toán viên bảo mật. KHÔNG sửa tệp nào. Kho mã này công khai.
Lập bảng: Vấn đề | Tệp | Mức độ | Đề xuất, rà các điểm:
1. Khóa, mật khẩu, địa chỉ nội bộ trong mã hoặc trong lịch sử commit.
2. Biến có tiền tố VITE_ chứa khóa quyền cao.
3. Dữ liệu cá nhân thật trong kho; tệp lẽ ra phải bị .gitignore chặn.
4. Khách, người đăng nhập, Quản trị đọc, ghi được gì theo chính sách trong
   cơ sở dữ liệu (không xét theo giao diện).
5. Dữ liệu nào gửi kèm câu hỏi tới dịch vụ AI, cho vai nào.
6. Quy ước nào trong bộ nhớ dự án không khớp thực tế kho mã.
Chỉ mô tả rủi ro và cách khắc phục, không trình bày cách khai thác.
```
:::

**Viết kiểm thử.** Phép kiểm viết bằng ngôn ngữ nghiệp vụ là tài liệu nghiệm thu người không chuyên đọc được.

::: {.lenhmau}
**Câu lệnh mẫu 6.11 — Viết kiểm thử cho phần tính toán**

```text
Viết bộ kiểm thử cho [tệp hoặc hàm tính toán], chạy bằng Node, không cần
mạng. Mỗi phép kiểm đặt tên tiếng Việt theo nghiệp vụ, ví dụ "41/82 đồng ý
thì chưa thông qua, thiếu 1 phiếu".
Phủ: ví dụ chuẩn trong văn bản; đúng ngưỡng và dưới ngưỡng một đơn vị; dữ
liệu rỗng; dữ liệu định dạng cũ; trùng họ tên; nếu có so khớp chữ thì thêm
các cặp dễ nhầm "quốc gia"/"gia đình", "báo"/"bão".
Không sửa mã đang chạy để phép kiểm qua. Phép nào thất bại thì phân tích lỗi
ở mã hay ở cách hiểu nghiệp vụ. In danh sách phép kiểm để tôi duyệt.
```
:::

**Giải thích mã.** Dùng trước khi giao việc sửa một phần hệ thống, hoặc khi chuẩn bị bàn giao.

::: {.lenhmau}
**Câu lệnh mẫu 6.12 — Giải thích một tệp cho người không chuyên**

```text
Tôi không phải lập trình viên. Giải thích tệp [đường dẫn], không sửa gì:
1. Tệp làm việc gì, ví von bằng công việc văn phòng.
2. Đọc, ghi dữ liệu nào; tệp nào, vai nào dùng đến nó.
3. Các quy tắc nghiệp vụ trong tệp, liệt kê bằng lời kèm vị trí.
4. Ba chỗ dễ hỏng nhất nếu sau này sửa, và vì sao.
5. Các lời cảnh báo đã ghi sẵn trong mã.
Câu ngắn; thuật ngữ nào cũng giải thích ở lần đầu dùng.
```
:::

**Cập nhật nhật ký thay đổi.** Nhật ký là "sổ giao ban" của dự án (Chương 7).

::: {.lenhmau}
**Câu lệnh mẫu 6.13 — Ghi nhật ký cho việc vừa làm**

```text
Thêm một mục vào đầu .claude/rules/changelog.md cho việc vừa làm, gồm: làm
gì và vì sao (chỗ nào do tôi chốt thì ghi rõ); nếu là lỗi thì hiện tượng,
nguyên nhân gốc, cách sửa; các tệp đã sửa; kiểm thử nào, bao nhiêu phép, kết
quả, build và lint; việc tôi phải tự làm thêm, ghi chữ "CẦN LÀM" in đậm; bài
học cho lần sau, nếu nên thành quy tắc lâu dài thì đề xuất, chờ tôi đồng ý.
Không ghi khóa, mật khẩu, số điện thoại hay họ tên cán bộ vào nhật ký.
```
:::

**Chuẩn bị bàn giao.** Một lần rà soát cho thấy các bộ kiểm thử nhật ký nhắc nhiều lần lại nằm ở thư mục không được commit, máy khác không chạy lại được. Bàn giao là lúc gom những chỗ hở như vậy.

::: {.lenhmau}
**Câu lệnh mẫu 6.14 — Soạn tài liệu bàn giao**

```text
Soạn docs/BAN-GIAO.md cho người tiếp nhận không chuyên lập trình, gồm:
1. Các phân hệ: làm gì, dữ liệu lưu ở đâu, ai được đọc, ghi.
2. Dịch vụ, gói đang dùng, ai giữ tài khoản; chỉ ghi TÊN biến môi trường,
   KHÔNG ghi giá trị khóa.
3. Cách chạy thử, cách triển khai, cách quay về bản trước.
4. Việc định kỳ phải làm; dấu hiệu hệ thống đang có vấn đề.
5. Bộ kiểm thử ở đâu, chạy thế nào; rủi ro đang mở; việc phải làm trước khi
   dùng thật.
Đối chiếu với mã nguồn thực tế; chỗ bộ nhớ dự án lỗi thời thì liệt kê riêng.
```
:::

## Tóm tắt chương 6

::: {.tomtat}
1. Hỏi trợ lý AI trò chuyện là xin bản nháp; giao việc cho tác tử AI lập trình là ủy quyền hành động trên hệ thống thật, nên phải có phạm vi, điều cấm, tiêu chí nghiệm thu.
2. Khung V-B-V-D-R thêm chữ N: Nghiệm thu, tức tiêu chí đo được, viết ra trước khi tác tử làm.
3. Câu "chỗ nào nghiệp vụ chưa rõ thì hỏi tôi, không tự chọn" biến nguyên tắc máy đề xuất – người quyết định thành mệnh lệnh.
4. Việc chạm dữ liệu, quyền, nhiều phân hệ hoặc diễn giải văn bản thì bắt trình phương án trước, đọc như đọc tờ trình.
5. Mỗi bước nhỏ: một sản phẩm, một cách nghiệm thu, một lần commit.
6. Đưa văn bản gốc và biểu mẫu giấy đang dùng thật, dặn đối chiếu từng mục; tài liệu đưa vào cũng là dữ liệu đi ra ngoài.
7. Nghiệm thu không cần đọc mã: bắt giải thích bằng lời, đọc phép kiểm, thử theo vai và tình huống biên, hỏi câu hỏi dây chuyền.
8. Tác tử đi lạc thì dừng, bắt tóm tắt, đo trước khi sửa, quay về điểm an toàn; nền móng sai thì làm lại.
:::

## Câu hỏi suy ngẫm và bài tập

1. Chọn một việc thật của phòng, Ban nơi đồng chí công tác, viết phiếu giao việc đủ sáu thành phần. Mỗi tiêu chí nghiệm thu có đếm được, so được hoặc thử được không?
2. Chia yêu cầu "phần mềm theo dõi việc trả lời kiến nghị cử tri" thành 10 đến 15 bước theo mẫu bảng ở mục 6.4.
3. Vì sao "không đưa dữ liệu nhạy cảm cho AI đọc" chắc chắn hơn "dặn AI đừng nói ra"?
4. Bài tập nhóm hai người: một người viết câu lệnh, người kia đóng vai tác tử "làm đúng từng chữ, chỗ nào không nói thì tự chọn". Mọi chỗ người đóng vai phải tự chọn chính là lỗ hổng của câu lệnh.
5. Với một hệ thống đồng chí dùng hằng ngày, kể ba "chỗ khác" đang đọc, ghi một loại dữ liệu quan trọng. Nếu dữ liệu ấy đổi định dạng, chỗ nào hỏng trước?
