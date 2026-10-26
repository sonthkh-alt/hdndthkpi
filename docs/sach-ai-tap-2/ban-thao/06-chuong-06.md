# Chương 6. Giao việc cho tác tử AI lập trình: V-B-V-D-R phiên bản kiến tạo

::: {.muctieu}
**Mục tiêu của chương**

- Phân biệt việc hỏi trợ lý AI trò chuyện với việc giao việc cho một tác tử AI lập trình có quyền hành động trên máy tính và trong kho mã nguồn.
- Vận dụng khung lệnh V-B-V-D-R của Tập 1, bổ sung thành phần thứ sáu là Nghiệm thu, để viết một "phiếu giao việc" rõ phạm vi, rõ điều cấm, rõ tiêu chí hoàn thành.
- Biết bắt tác tử trình phương án trước khi làm, chia một yêu cầu lớn thành các bước nhỏ, đưa tài liệu nghiệp vụ cho tác tử và dặn đối chiếu từng mục.
- Tự nghiệm thu được kết quả khi không đọc được mã; nhận ra lúc tác tử đi lạc và biết cách kéo lại.
- Có sẵn bộ câu lệnh mẫu cho tám việc hay gặp nhất.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ cả chương và làm các bài tập cuối chương); lãnh đạo nên đọc mục 6.1, 6.3, 6.6 và hộp "Dành cho lãnh đạo".
:::

Chương 5 đã dựng xong "xưởng làm việc số". Từ đây, phần khó nhất không còn là cài đặt mà là giao việc. Trong năm 2026, khi cùng tác tử AI lập trình xây dựng hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (địa chỉ hdndthkpi.vercel.app), tôi nhận ra một điều không dễ chịu. Nhiều sự cố không bắt nguồn từ chỗ AI viết mã kém, mà từ chỗ tôi giao việc chưa đủ rõ: thiếu phạm vi, thiếu điều cấm, thiếu một câu "thế nào thì coi là xong". Chương này tổng kết cách tôi giao việc hiện nay, kèm những lần vấp đã dạy tôi cách ấy.

## 6.1. Hỏi AI trò chuyện và giao việc cho tác tử: khác nhau ở đâu

Ở Tập 1, trợ lý AI trò chuyện (chatbot) được ví như một thư ký cao cấp. Đồng chí đưa yêu cầu, thư ký trả lại một bản nháp. Đồng chí đọc, sửa, rồi quyết định dùng hay không. Mọi thứ vẫn nằm trên trang giấy. Bản nháp sai mà đồng chí không dùng thì không gây hại gì.

Tác tử AI lập trình (AI coding agent) như Claude Code thì khác về bản chất. Nó giống một tổ chuyên viên kỹ thuật được giao chìa khóa trụ sở. Nó tự mở kho mã nguồn (repository), đọc hàng chục tệp, sửa tệp, chạy lệnh, cài thêm thư viện, chạy kiểm thử (test), tạo bản dựng (build), ghi thay đổi vào lịch sử (commit) và đẩy lên GitHub (push). Với hệ thống của Văn phòng, đẩy lên nhánh chính nghĩa là khoảng một đến hai phút sau, dịch vụ Vercel tự triển khai (deploy) và mọi người truy cập đều thấy thay đổi.

Hệ quả rất đơn giản: sai sót của trợ lý trò chuyện nằm trên trang giấy, còn sai sót của tác tử nằm ngay trong hệ thống đang chạy.

| Tiêu chí | Trợ lý AI trò chuyện | Tác tử AI lập trình |
|---|---|---|
| Sản phẩm | Đoạn văn, đoạn mã để người dùng chép | Tệp được sửa trực tiếp trong kho mã |
| Nhìn thấy gì | Chỉ những gì được dán vào | Cả kho mã, bộ nhớ dự án, kết quả chạy lệnh |
| Hành động | Không tự hành động | Tạo, sửa, xóa tệp; chạy lệnh; đẩy lên mạng |
| Khi sai | Người dùng không chép là xong | Lỗi đã nằm trong hệ thống, có thể lên mạng |
| Cần ở người giao | Câu hỏi rõ | Phạm vi, điều cấm, tiêu chí nghiệm thu |

Có hai khác biệt nữa, ít người để ý. Thứ nhất, tác tử nhìn thấy nhiều hơn, nên phần kỹ thuật trong câu lệnh (prompt) có thể ngắn hơn. Đồng chí không cần dán mã vào, không cần biết tệp nào chứa gì. Nhưng phần nghiệp vụ và phần giới hạn phải dài hơn. Tác tử hiểu mã, nhưng không hiểu cơ quan của đồng chí. Nó không biết biểu mẫu giấy đang dùng trông ra sao, không biết đồng chí Phó Trưởng Ban khác Trưởng Ban ở điểm nào, không biết dữ liệu nào là nhạy cảm.

Thứ hai, tác tử chủ động lấp chỗ trống. Chỗ nào câu lệnh không nói, nó tự chọn thay đồng chí. Phần lớn lựa chọn ấy hợp lý, nhưng không phải tất cả. Trong dự án, khi số hóa điều kiện xếp loại, tác tử từng hiểu "không hoàn thành" là "chưa đạt đủ 100%", nên một nhiệm vụ làm được 9/10 sản phẩm bị coi là không hoàn thành, kéo cả cán bộ có điểm cao xuống mức xếp loại thấp nhất. Không ai bảo nó hiểu như vậy, nhưng cũng không ai bảo nó phải hỏi lại.

::: {.vidu}
**Ví dụ minh họa: cùng một yêu cầu, hai kết cục**

Hãy hình dung đồng chí gõ cùng một câu: "Thêm cột Ghi chú vào bảng tổng hợp xuất ra Word."

Với trợ lý trò chuyện, đồng chí nhận về một đoạn mã kèm lời dặn "dán vào chỗ phù hợp". Đồng chí không biết chỗ nào là phù hợp, nên đoạn mã nằm yên trong khung chat. Không có gì thay đổi.

Với tác tử, nó tự tìm tệp xuất báo cáo, thêm cột, chạy bản dựng thấy xanh, ghi vào lịch sử, đẩy lên mạng. Hai phút sau, mọi người tải bảng tổng hợp đều có cột mới. Nhưng cột ấy đứng ở đâu, ghi nội dung gì, có làm lệch khổ giấy, có làm vỡ bản xuất Excel đang dùng chung số liệu hay không, thì không ai dặn. Tác tử đã tự quyết hết.
:::

Vì vậy, một yêu cầu gửi tác tử phải có ba thứ mà câu hỏi gửi trợ lý trò chuyện ít khi cần. **Phạm vi:** được vào phòng nào, được sửa phân hệ nào. **Điều cấm:** không được đụng vào đâu, không được làm gì. **Tiêu chí nghiệm thu:** thế nào thì coi là xong. Ai từng giao khoán một hạng mục sửa chữa trụ sở đều quen với ba thứ này. Hợp đồng giao khoán luôn ghi hạng mục, phạm vi thi công, yêu cầu kỹ thuật và biên bản nghiệm thu. Giao việc cho tác tử cũng vậy, chỉ khác là "hợp đồng" viết bằng vài chục dòng tiếng Việt.

::: {.canhbao}
**Cảnh báo: tác tử hành động trên máy thật**

- Tùy cách cấu hình quyền, tác tử sẽ hỏi trước khi sửa tệp hay chạy lệnh, hoặc tự làm trong phạm vi đã được cho phép. Đừng bấm "đồng ý tất cả" khi chưa đọc lệnh nó định chạy.
- Theo tài liệu chính thức của Claude Code (10/2026), bản cài gốc trên Windows không có chế độ "hộp cát" (sandbox) cô lập lệnh. Lệnh chạy là chạy thật trên máy của đồng chí.
- Kho mã của dự án này là kho công khai. Tệp nào được đẩy lên là ai cũng đọc được. Tác tử làm đúng điều được bảo: không dặn thì tệp nằm trong thư mục dự án sẽ được commit như mọi tệp khác.
- Mọi thứ tác tử đọc đều được gửi tới mô hình AI chạy trên máy chủ của nhà cung cấp. Thư mục dự án không phải nơi để tài liệu mật hay hồ sơ cá nhân chưa che.
:::

## 6.2. Khung V-B-V-D-R mở rộng: thêm chữ N là Nghiệm thu

Tập 1 dạy khung lệnh năm thành phần V-B-V-D-R: Vai, Bối cảnh, Việc, Dạng, Ràng buộc. Khung ấy vẫn dùng được với tác tử, nhưng mỗi chữ mang nghĩa rộng hơn. Tôi thêm thành phần thứ sáu là **N — Nghiệm thu**: tiêu chí hoàn thành đo được, viết ra trước khi tác tử bắt tay vào làm.

Tập 1 cũng khuyên dành khoảng 20% thời gian cho khung lệnh và 80% cho biên tập, kiểm chứng. Với tác tử, phần 80% ấy chính là nghiệm thu. Viết sẵn tiêu chí nghiệm thu vào câu lệnh là cách rút ngắn phần việc nặng nhất này.

| Thành phần | Với trợ lý trò chuyện | Với tác tử lập trình |
|---|---|---|
| Vai | Chọn giọng văn, chuyên môn | Ai quyết nghiệp vụ, ai làm kỹ thuật |
| Bối cảnh | Tài liệu dán vào | Văn bản, biểu mẫu, hiện trạng hệ thống |
| Việc | Một yêu cầu | Một việc một lần, rõ phân hệ |
| Dạng | Định dạng văn bản trả về | Giao diện, tệp xuất, báo cáo cuối việc |
| Ràng buộc | Văn phong, độ dài | Không đụng chỗ khác, không lộ dữ liệu, kiểm thử |
| Nghiệm thu | Thường không có | Tiêu chí đo được để tự kiểm tra |

### 6.2.1. Vai: ai là chủ đầu tư, ai là tổ thi công

Với trợ lý trò chuyện, câu "hãy đóng vai chuyên viên pháp chế" giúp chọn giọng văn. Với tác tử, Vai còn vạch ranh giới trách nhiệm. Câu tôi hay dùng là: "Đóng vai lập trình viên cẩn trọng của dự án này; ưu tiên không làm mất dữ liệu hơn làm nhanh. Tôi là người quyết định về nghiệp vụ; chỗ nào nghiệp vụ chưa rõ thì hỏi tôi, không tự chọn."

Câu cuối là quan trọng nhất. Nó biến nguyên tắc máy đề xuất – người quyết định thành một mệnh lệnh cụ thể. Ngoài vai "người làm", có ba vai khác rất đáng dùng: **người phản biện** (soi phương án trước khi làm), **kiểm toán viên bảo mật** (rà soát, không sửa), **người viết tài liệu** cho cán bộ không chuyên. Những vai dùng lâu dài nên ghi vào bộ nhớ dự án để khỏi lặp lại mỗi lần; Chương 7 sẽ nói kỹ.

### 6.2.2. Bối cảnh: những gì tác tử không tự nhìn thấy

Tác tử đọc được mã, nhưng không đọc được văn bản nằm trong tủ của đồng chí, không thấy màn hình của người dùng, không biết hôm qua đã xảy ra chuyện gì. Bối cảnh là phần bù cho những chỗ mù ấy.

Khi giao việc làm mới, bối cảnh gồm: nghiệp vụ là gì, theo văn bản nào; ai dùng, bao nhiêu người (ví dụ 28 cán bộ ở phân hệ OKR/KPI, 15 đồng chí ở phân hệ Kiểm điểm); quy trình đi qua mấy bước; biểu mẫu giấy trông ra sao. Khi giao việc sửa lỗi, bối cảnh gồm: hiện tượng, đường dẫn, vai đang dùng, thời điểm bắt đầu, thông báo lỗi chép nguyên văn, và điều lẽ ra phải thấy.

Một chi tiết thời gian có khi là manh mối quyết định. Từ ngày 01/9/2026, ba phân hệ chạy trên cùng một tệp giao diện đều trắng trang kèm dòng lỗi tiếng Anh "Cannot read properties of undefined (reading 'id')". Chi tiết "bắt đầu từ ngày đầu tháng" cùng thông tin "máy chủ có dữ liệu tháng 6, 7, 8 nhưng chưa có tháng 9" dẫn thẳng tới nguyên nhân gốc: phần mềm luôn tìm "người đứng đầu danh sách", mà kỳ mới thì danh sách còn trống.

### 6.2.3. Việc: một việc một lần

Mỗi câu lệnh chỉ nên chứa một việc, diễn đạt bằng một động từ rõ ràng, một đối tượng và một địa điểm. "Làm cho phần Kiểm điểm tốt hơn" không phải là một việc. "Thêm vào phân hệ Kiểm điểm khối Kế hoạch quý, nằm trên phần tự đánh giá" là một việc.

Phép thử đơn giản: nếu câu mô tả việc có chữ "và" nối hai hành động khác nhau, hãy tự hỏi đó có phải hai việc không. Có một ngoại lệ cần hiểu đúng: "một việc" không có nghĩa là "một tệp". Thêm một cột vào bảng điểm có thể buộc phải sửa cả phần xuất Word lẫn phần bot chat đọc số liệu. Những thay đổi kéo theo ấy thuộc về cùng một việc, và tác tử phải làm trọn trong cùng lần sửa.

### 6.2.4. Dạng: sản phẩm trông ra sao

Với tác tử, Dạng có ba lớp. **Lớp thứ nhất là thứ người dùng thấy:** đặt ở đâu trên màn hình, chữ tiếng Việt có dấu, dùng được trên điện thoại, thông báo lỗi viết bằng tiếng Việt dễ hiểu. **Lớp thứ hai là tệp xuất ra:** khổ dọc hay ngang, đúng tiêu đề, đúng thứ tự cột của biểu mẫu. Văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP về công tác văn thư; văn bản của tổ chức Đảng lại có thể thức riêng. Dự án từng in nhầm tên cơ quan hành chính vào đầu bản tự đánh giá đảng viên, trong khi tiêu đề đúng phải là "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH".

**Lớp thứ ba là báo cáo cuối việc của chính tác tử.** Tôi luôn yêu cầu nó kết thúc bằng một báo cáo ngắn theo khuôn cố định: đã sửa gì, ở tệp nào, đã kiểm tra những gì, kết quả ra sao, và việc gì tôi phải tự làm thêm (chẳng hạn chạy một đoạn lệnh trong cơ sở dữ liệu). Khuôn này về sau trở thành khuôn viết nhật ký thay đổi của dự án.

### 6.2.5. Ràng buộc: những điều không được làm

Ràng buộc chia làm hai loại. Loại **thường trực** áp dụng cho mọi việc, nên ghi một lần vào bộ nhớ dự án. Loại **riêng** chỉ áp dụng cho việc đang giao, nên ghi vào câu lệnh. Dưới đây là tám ràng buộc thường trực mà dự án đã đúc kết; đồng chí có thể chép nguyên vào dự án của mình.

1. Chỉ sửa trong phạm vi được giao; muốn đụng chỗ khác phải hỏi trước.
2. Không đổi công thức, ngưỡng điểm, câu chữ nghiệp vụ khi chưa được người giao việc đồng ý.
3. Không xóa, không ghi đè dữ liệu đã lưu; dữ liệu lưu theo định dạng cũ phải mở được.
4. Không đưa dữ liệu thật, khóa bí mật vào mã nguồn; khóa bí mật không bao giờ mang tiền tố `VITE_` (tiền tố này khiến biến bị nhúng vào trang web gửi xuống trình duyệt).
5. Không mở rộng quyền đọc, ghi khi chưa hỏi; đổi quyền thì thử cả vai khách lẫn vai quản trị.
6. Toàn bộ chữ trên giao diện và trong lịch sử thay đổi viết tiếng Việt có dấu, mã hóa UTF-8.
7. Trước khi báo xong: bản dựng phải xanh, công cụ soát lỗi cú pháp (lint) báo 0 lỗi, các phép kiểm liên quan đều đạt.
8. Chỉ commit đúng các tệp của việc đang làm, không "vơ" thay đổi lạ đang chờ của người dùng.

Một kinh nghiệm nhỏ: ràng buộc kèm lý do được tác tử áp dụng tốt hơn ràng buộc trơn. "Không lưu địa chỉ IP gốc của khách, vì đó là dữ liệu có thể nhận diện người" giúp tác tử tự suy ra phải xử lý thế nào ở những chỗ tương tự mà đồng chí chưa kịp dặn.

### 6.2.6. Nghiệm thu: thế nào thì coi là xong

Đây là thành phần mới, và cũng là thành phần tôi thấy giá trị nhất. Tiêu chí nghiệm thu tốt có bốn dạng: **đếm được**, **so được với một nguồn chuẩn**, **thử được bằng thao tác**, và **quan sát được ở đúng nơi người dùng nhìn thấy**. Vài tiêu chí thật của dự án:

- Tab Đánh giá hiện đủ 28/28 cán bộ ở phân hệ OKR/KPI và 15/15 đồng chí ở phân hệ Kiểm điểm.
- Với cùng đầu vào, điểm do phần mềm tính phải khớp bảng tính mô phỏng tới hai chữ số thập phân. Đây là yêu cầu ghi trong tài liệu Đặc tả yêu cầu phần mềm của dự án.
- 41/82 đại biểu đồng ý thì kết luận "chưa thông qua, còn thiếu 1 phiếu".
- Lưu xong, tải lại trang, dữ liệu vẫn còn.
- Mở bằng vai khách: thấy bảng kết quả, không thấy nút phê duyệt.
- Tệp Word xuất ra mở được, bảng tổng hợp có đúng bảy cột theo thứ tự của phụ lục biểu mẫu.

Những tiêu chí không dùng được: "chạy ổn", "đẹp hơn", "đúng quy định". Chúng không sai, nhưng không ai kiểm được. Tiêu chí nào làm được thì yêu cầu tác tử biến luôn thành phép kiểm tự động, để lần sửa sau máy tự kiểm lại.

::: {.phaply}
**Căn cứ pháp lý và tinh thần giao việc**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực từ 01/3/2026), khoản 2 Điều 4 ghi nguyên tắc: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người." Người giao việc cho tác tử vẫn là người chịu trách nhiệm về sản phẩm.
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương, điểm 1.2, yêu cầu "sáu rõ: rõ người, rõ việc, rõ thời gian, rõ trách nhiệm, rõ sản phẩm, rõ thẩm quyền" và "một việc - một đầu mối chịu trách nhiệm chính". Văn bản này nói về đánh giá cán bộ, không nói về AI. Tôi chỉ mượn tinh thần ấy cho việc giao việc cho máy: "rõ sản phẩm" là Dạng và Nghiệm thu, "rõ thẩm quyền" là Ràng buộc và câu "chỗ nào chưa rõ thì hỏi tôi".
:::

Ghép sáu thành phần lại, một phiếu giao việc hoàn chỉnh trông như câu lệnh mẫu dưới đây. Đây là câu lệnh tôi tái dựng theo đúng một việc đã làm ở phân hệ Kiểm điểm. Khi làm thật, tôi viết ngắn hơn, vì nhiều ràng buộc đã nằm sẵn trong bộ nhớ dự án.

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

Với một tác tử biết hành động, thời điểm rẻ nhất để phát hiện hiểu lầm là trước khi có tệp nào bị sửa. Cơ quan nhà nước vốn quen nếp này: muốn ban hành quyết định phải có tờ trình; muốn thi công phải có phương án được duyệt. Giao việc cho tác tử cũng nên theo nếp ấy.

Claude Code có chế độ lập kế hoạch (plan mode). Ở chế độ này, tác tử được đọc tệp, tìm hiểu và phân tích, nhưng không sửa tệp; nó trình kế hoạch rồi chờ đồng chí duyệt. Ở bản dòng lệnh tôi dùng trong năm 2026, tổ hợp phím Shift+Tab chuyển qua lại giữa các chế độ làm việc. Cách bật có thể khác nhau giữa các phiên bản, giữa bản dòng lệnh, ứng dụng máy tính và bản web, và mỗi hãng tác tử lại có cơ chế riêng. Cách chắc chắn nhất, dùng được với mọi tác tử, là viết thẳng vào đầu câu lệnh: "Chưa sửa tệp nào. Hãy đọc…, trình phương án…, chờ tôi duyệt."

Không phải việc nào cũng cần phương án. Sửa một lỗi chính tả trên nút bấm thì cứ làm. Nhưng tôi luôn bắt trình phương án trước với sáu loại việc: việc chạm vào dữ liệu đã lưu; việc đổi quyền đọc, ghi; việc đụng tới nhiều phân hệ; việc diễn giải câu chữ văn bản quy định; việc có gọi dịch vụ AI tốn tiền; và mọi việc mà chính tôi chưa hình dung được cách làm.

### 6.3.1. Đọc phương án như đọc tờ trình

Một phương án tốt của tác tử có cấu trúc rất giống tờ trình. Đồng chí đọc nó bằng đúng con mắt của người duyệt tờ trình.

| Phần của tờ trình | Phần tương ứng trong phương án |
|---|---|
| Sự cần thiết | Tác tử hiểu yêu cầu thế nào |
| Căn cứ | Đã đọc tệp nào, văn bản nào |
| Nội dung đề xuất | Sửa những gì, ở đâu |
| Các phương án | Các cách làm, ưu và nhược |
| Đánh giá tác động | Dữ liệu cũ, phân hệ khác, bot, tệp xuất, quyền |
| Kiến nghị | Những câu hỏi cần người quyết |

Phương án thiếu phần "đánh giá tác động" là phương án chưa đạt, dù phần còn lại hay đến đâu. Phần lớn sự cố dây chuyền của dự án, mà mục 6.6 sẽ kể, đều xuất phát từ chỗ không ai hỏi "việc này kéo theo những gì".

::: {.thuchanh}
**Thực hành: bảy câu hỏi khi duyệt phương án của tác tử**

1. Tác tử nhắc lại yêu cầu bằng lời của nó: có khớp ý mình không?
2. Có chạm vào dữ liệu đã lưu không? Dữ liệu cũ sẽ hiện ra thế nào sau khi sửa?
3. Có tệp, phân hệ nào ngoài phạm vi bị sửa không? Vì sao phải sửa?
4. Có đổi công thức, ngưỡng điểm, câu chữ nghiệp vụ không?
5. Có đổi quyền đọc, ghi không? Có phải chạy thêm đoạn lệnh nào trong cơ sở dữ liệu không?
6. Sẽ kiểm thử thế nào? Tiêu chí nghiệm thu là gì?
7. Tác tử đã tự giả định những gì? (Hỏi thẳng câu này; nó thường liệt kê được.)
:::

Duyệt phương án cũng như duyệt tờ trình: đồng ý toàn bộ, đồng ý có sửa ("làm theo phương án 2, nhưng bỏ điểm c"), hoặc trả lại yêu cầu làm rõ. Quyết định nào thuộc về nghiệp vụ thì yêu cầu ghi vào nhật ký thay đổi, để người sau biết vì sao hệ thống được làm như thế.

::: {.cauchuyen}
**Câu chuyện thực tế: phần mềm phản biện, người dùng quyết**

Khi rà công thức chấm điểm của phân hệ OKR/KPI, tác tử phát hiện cách tính có thể dẫn tới tình huống "điểm số cao mà xếp loại thấp": tổng điểm trên 90 nhưng vì không đủ điều kiện xếp loại nên chỉ được mức thấp hơn. Nó trình phương án, trong đó có cả hướng điều chỉnh công thức. Tôi chọn giữ nguyên cách tính theo quy định, chỉ giải thích rõ và thêm một ô cảnh báo màu đỏ "Chênh lệch điểm số và xếp loại" ngay trên phiếu chấm.

Nhật ký thay đổi của dự án có rất nhiều câu kiểu "người dùng chốt", "người dùng chọn phương án này": để ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ chấm điểm; chuyển hẳn Sổ tay AI sang NotebookLM ngày 22/10/2026. Nguyên tắc máy đề xuất – người quyết định không chỉ áp dụng cho phần mềm, mà cho cả chính quá trình làm ra phần mềm.
:::

::: {.lenhmau}
**Câu lệnh mẫu 6.2 — Yêu cầu trình phương án trước khi làm**

```text
CHƯA SỬA TỆP NÀO. Việc cần làm: [mô tả việc].
Hãy đọc bộ nhớ dự án và các tệp liên quan, rồi trình phương án gồm:
1. Nhắc lại yêu cầu bằng lời của mình.
2. Các tệp và văn bản đã đọc làm căn cứ.
3. Những gì sẽ sửa, ở đâu; nếu có từ hai cách làm thì so sánh ưu, nhược.
4. Tác động: dữ liệu đã lưu, phân hệ khác, bot chat, tệp xuất báo cáo, quyền
   đọc/ghi. Chỗ nào khác đang đọc hoặc ghi thứ sắp bị đổi?
5. Cách kiểm thử và tiêu chí nghiệm thu đề xuất.
6. Những điều đã tự giả định, và các câu hỏi về nghiệp vụ cần tôi quyết.
Viết ngắn, tiếng Việt, không dán mã. Chờ tôi duyệt rồi mới làm.
```
:::

## 6.4. Chia nhỏ công việc: từ "làm cho tôi hệ thống đánh giá" đến 15 bước

Giao cho tác tử một câu "làm cho tôi hệ thống đánh giá cán bộ", nó vẫn có thể dựng được thứ gì đó chạy được trong một buổi. Chính điều ấy mới nguy hiểm. Trong sản phẩm đó có hàng trăm lựa chọn ẩn mà đồng chí không biết. Đồng chí không thể nghiệm thu một khối lớn như vậy. Lỗi của phần này đan vào lỗi của phần kia, sửa chỗ nọ lại hỏng chỗ kia. Không ai ký một phiếu giao việc "xây cho tôi cái trụ sở". Công trình nào cũng chia hạng mục, nghiệm thu từng hạng mục.

Một bước giao việc tốt thỏa mãn năm điều:

- Có một sản phẩm thấy được hoặc đo được.
- Nghiệm thu xong trong một lần ngồi. Kinh nghiệm của tôi là khoảng mười lăm phút; lâu hơn thì bước ấy nên chia tiếp.
- Kết thúc bằng bản dựng xanh và một lần commit, tức là một điểm khôi phục an toàn.
- Phần "tính" làm trước phần "đẹp"; dữ liệu và phân quyền làm trước tiện ích.
- Bước nào chạm vào dữ liệu đã lưu thì tách riêng, không gộp với việc khác.

Bảng dưới đây là cách tôi sẽ chia nếu làm lại phân hệ OKR/KPI từ đầu. Thực tế dự án không đi thẳng như vậy: nhật ký cho thấy phần chấm Nhóm II đã trải qua ba cách chấm, từ nhập số lần sai sót, sang chọn mức độ hoàn thành, rồi mới đến ba tiêu chí Số lượng – Chất lượng – Tiến độ. Chính những lần vòng lại ấy dạy tôi thứ tự hợp lý dưới đây.

| Bước | Việc giao cho tác tử | Nghiệm thu bằng |
|---|---|---|
| 1 | Đọc Nghị định 335/2025/NĐ-CP, Quy định 1053-QĐ/TU; lập bảng tóm tắt thang điểm, công thức, điều kiện xếp loại. Chưa viết mã | Tôi đối chiếu bảng với văn bản gốc |
| 2 | Chuyển các ví dụ trong bảng tính mô phỏng thành bộ ca kiểm thử | Danh sách ca bằng tiếng Việt, có đáp số |
| 3 | Dựng khung ứng dụng trống, có nhãn "Bản demo thử nghiệm" | Chạy được trên máy, bản dựng xanh |
| 4 | Mô hình dữ liệu cho một cán bộ, một kỳ | Tác tử giải thích bằng lời, tôi duyệt |
| 5 | Hàm tính điểm, tách riêng khỏi giao diện | Khớp bảng tính tới hai chữ số thập phân |
| 6 | Màn hình chấm Nhóm I theo từng Mẫu | Đủ tiêu chí, không vượt điểm tối đa |
| 7 | Màn hình Nhóm II: nhiệm vụ, danh mục, ba tiêu chí | Ví dụ (100+100+80)/3 = 93,3% hiện đúng |
| 8 | Điều kiện xếp loại và khối "Vì sao xếp loại này" | Các ca bị hạ mức hiện đúng lý do |
| 9 | Lưu theo kỳ vào cơ sở dữ liệu (database) | Lưu, tải lại trang, dữ liệu còn |
| 10 | Đăng nhập, phân quyền khách, cán bộ, quản trị | Thử lần lượt bằng cả ba vai |
| 11 | Tách cột Tự đánh giá và cột Cấp duyệt | Cấp duyệt kế thừa khi chưa sửa |
| 12 | Phê duyệt; sửa điểm thì tự gỡ phê duyệt | Sửa một ô, dấu phê duyệt biến mất |
| 13 | Xuất phiếu đánh giá ra Word | Mở tệp, đối chiếu biểu mẫu |
| 14 | Trang Tổng quan, biểu đồ | Số liệu khớp bảng điểm |
| 15 | Triển khai, trang hướng dẫn, ghi nhật ký | Mở địa chỉ thật trên điện thoại |

Đồng chí không cần tự nghĩ ra bảng này. Hãy giao luôn việc lập lộ trình cho tác tử, với điều kiện nó chưa được viết dòng mã nào và mỗi bước phải có cách nghiệm thu. Sau đó đồng chí sửa lộ trình, như sửa một kế hoạch công tác do chuyên viên dự thảo.

::: {.lenhmau}
**Câu lệnh mẫu 6.3 — Lập lộ trình chia nhỏ một yêu cầu lớn**

```text
CHƯA VIẾT MÃ. Tôi muốn xây dựng [mô tả ứng dụng, 3-5 dòng], phục vụ [ai,
bao nhiêu người], theo [văn bản, biểu mẫu nào].
Hãy lập lộ trình 10-15 bước. Mỗi bước ghi: việc cần làm; sản phẩm thấy được;
cách tôi nghiệm thu trong khoảng 15 phút mà không cần đọc mã.
Yêu cầu: phần tính toán làm trước giao diện; dữ liệu và phân quyền làm trước
tiện ích; bước nào chạm dữ liệu đã lưu thì tách riêng. Đánh dấu các bước có
chỗ nghiệp vụ cần tôi quyết, kèm câu hỏi cụ thể.
```
:::

::: {.ghinho}
**Ghi nhớ**

Một bước tốt gồm: một câu mô tả, một sản phẩm thấy được, một cách nghiệm thu, một lần commit. Việc nào không viết được thành một câu như vậy thì chưa đủ nhỏ để giao.
:::
