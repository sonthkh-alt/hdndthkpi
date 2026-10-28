# Lời kết

Tôi viết những trang cuối này vào cuối tháng 10 năm 2026. Theo lịch, 07:30 mỗi sáng, một máy tính ở Văn phòng tự lấy tin từ nguồn chính thống và vẽ bản tin pháp luật cho Trang chủ. Phân hệ Sổ tay AI, nơi cán bộ tra cứu bằng trí tuệ nhân tạo (AI) có trích dẫn nguồn, vừa hoàn thành ngày 22/10/2026. Hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) vẫn mang nhãn "Bản demo thử nghiệm, sử dụng nội bộ". Vì thế, đây không phải lời tổng kết một công trình đã xong, chỉ là đôi điều tôi muốn nói lại sau một chặng đường làm, vấp và sửa.

## Con người là trung tâm

Nếu phải chọn trong khoảng 21.400 dòng mã một dòng quan trọng nhất, tôi sẽ không chọn dòng nào là mã. Tôi chọn câu "máy đề xuất – người quyết định". Câu ấy hiện diện ở những chỗ cụ thể. Nút phê duyệt phiếu đánh giá luôn thuộc về người có thẩm quyền đã đăng nhập; sửa điểm sau khi đã phê duyệt thì phê duyệt tự động bị gỡ. Phân hệ Sổ tay AI không tự gán "còn hiệu lực" cho bất kỳ văn bản nào; người phụ trách phải đối chiếu rồi mới đánh dấu. Khi số hóa dự thảo Khung tiêu chí đánh giá Hội đồng nhân dân (HĐND), phần mềm phát hiện sáu chỗ chưa nhất quán, nhưng chỉ chuẩn hóa có ghi chú và kiến nghị, không tự sửa thay cơ quan soạn thảo. Phân hệ Giám sát số chỉ trình danh mục nghị quyết cấp xã nên giám sát; Thường trực HĐND tỉnh quyết định.

Nguyên tắc ấy cũng áp vào chính cách tôi làm việc với tác tử AI lập trình. Nhật ký dự án đầy những cụm "người dùng chốt", "người dùng chọn phương án này". Khi AI phản biện rằng cách tính có thể dẫn tới "điểm cao mà xếp loại thấp", tôi chọn giữ nguyên công thức của quy định, chỉ thêm giải thích và cảnh báo trên màn hình. AI đưa phương án kèm hệ quả; người chịu trách nhiệm chọn và ghi lại vì sao chọn.

Con người là trung tâm còn có nghĩa là tôn trọng những người đứng sau dữ liệu. Đại biểu trong phân hệ Biểu quyết Online chỉ mang mã từ DB01 đến DB82, không gắn họ tên người thật. Số điện thoại trong danh bạ không bao giờ nằm trong kho mã nguồn (repository) công khai. Kiến nghị cử tri có ghi tên người dân thì cố ý không mở cho khách xem. Mỗi con số trên màn hình là công sức, quyền lợi và danh dự của một con người cụ thể.

Luật Trí tuệ nhân tạo số 134/2025/QH15, có hiệu lực từ 01/3/2026, đặt nguyên tắc lấy con người làm trung tâm và ghi tại khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Tôi đã đi một vòng khá dài để hiểu câu ấy bằng việc làm, chứ không chỉ bằng đọc.

## Cán bộ biết kiến tạo

"Người kiến tạo" trong tên tập sách không phải là kỹ sư phần mềm. Đó là người cán bộ biết đóng ba vai đã bàn ở mục 2.6: chủ đầu tư nêu đúng nhu cầu, tổng công trình sư giữ đúng thiết kế, người nghiệm thu không ký khi công trình chưa đạt. Tác tử AI viết mã nhanh hơn tôi rất nhiều lần, nhưng những lỗi nặng nhất của dự án lại là lỗi nghiệp vụ. Phân hệ Kiểm điểm lệch biểu mẫu giấy ở bốn chỗ lớn, và chỉ lộ ra khi tôi đưa chính bản tự đánh giá, kế hoạch quý của mình vào đối chiếu. Người làm nghiệp vụ thấy ngay những điều AI không tự thấy: văn bản của Đảng phải mang tiêu đề của tổ chức Đảng; chuỗi chữ "trưởng ban" nằm gọn trong "phó trưởng ban"; "báo" và "bão" chỉ khác nhau một dấu thanh.

Kiến tạo cũng là biết bớt đi. Tôi đã gỡ hai bản giao diện thừa: ba giao diện cho cùng một logic thì mỗi thay đổi phải sửa nhiều nơi và dễ ghi đè dữ liệu của nhau. Kiến tạo còn là biết khi nào không cần AI: chính bản tin pháp luật nói trên chạy bằng một chương trình nhỏ, không gọi AI, vì việc lấy tin, vẽ ảnh có quy tắc cố định. AI vẫn có ích ở đó, trong vai người viết ra chương trình.

Kiến tạo là ghi chép để người khác tiếp nhận được. Nhật ký thay đổi của dự án có hơn 100 mục, mỗi mục ghi làm gì, vì sao, kiểm chứng thế nào. Bộ nhớ dự án nằm ngay trong kho mã, để tác tử AI tự đọc mỗi phiên và đồng nghiệp có thể nối tiếp khi tôi vắng mặt. Một ứng dụng chỉ một người hiểu thì chưa phải tài sản của cơ quan.

Tôi cũng phải nói thật những việc còn dở. Phần lớn các bộ kiểm thử tự động vẫn nằm ngoài kho mã, nên máy khác chưa chạy lại được. Hai lối gọi AI chưa trả lại lượt hỏi cho người dùng khi AI báo lỗi, dù khung chat ở Trang chủ đã làm được. Đó là những "khoản nợ" phải trả trước khi nói tới dùng thật. Hệ thống thử nghiệm giúp cơ quan biết mình cần gì; nó không thay hệ thống chính thức.

## Lời mời cùng làm

Cuốn sách không khép lại bằng một sản phẩm, mà bằng một lời mời.

Với lãnh đạo: xin chọn bài toán đầu tiên vừa sức, là việc lặp lại, có quy định rõ, có biểu mẫu sẵn, rồi giao cho một tổ nhỏ thử có kiểm soát. Chỉ thị 14/CT-TTg ngày 22/4/2026 của Thủ tướng Chính phủ coi tự học, tự bồi dưỡng kiến thức, kỹ năng số là nhiệm vụ thường xuyên và yêu cầu người lãnh đạo, quản lý phải gương mẫu. Theo tôi, sự gương mẫu ấy bắt đầu từ việc tự tay thử một lần.

Với cán bộ dùng AI hằng ngày: hãy bắt đầu từ chính việc của mình, với văn bản công khai, theo lộ trình 30 ngày ở Chương 18. Với cán bộ muốn tự làm ứng dụng: nhỏ trước, lớn sau, gắn nhãn bản demo, và nhờ đồng nghiệp thử bằng cả vai khách lẫn vai quản trị.

Còn một việc chung, có hạn cụ thể. Nhiệm vụ đột phá về Sổ tay AI đã đăng ký ba mốc: sổ tay và câu hỏi mẫu trước 15/11/2026, hướng dẫn cán bộ trước 25/11/2026, báo cáo đánh giá trước 10/12/2026. Chỉ tiêu giảm ít nhất 30% thời gian tra cứu hiện mới là chỉ tiêu. Nó chỉ thành kết quả khi chính các đồng chí ghi số phút thật, báo ngay câu trả lời sai và cùng kiểm tra hiệu lực từng văn bản nguồn.

Mọi góp ý, nhất là phản biện và chuyện thất bại, xin gửi về Văn phòng hoặc qua ô góp ý trên trang Hướng dẫn & hỗ trợ sử dụng (`#/hotro`). Mã nguồn để công khai trên GitHub; đồng nghiệp cơ quan khác cứ tham khảo, nhưng xin đối chiếu với văn bản, biểu mẫu của đơn vị mình.

## Nối lại với Tập 1

Tập 1 khép lại ở mục 7.7 bằng một suy ngẫm: AI thay đổi gì, không thay đổi gì trong văn hóa công vụ. Bốn điều không thay đổi khi ấy là: sự lãnh đạo của Đảng và vai trò chủ đạo của con người; trách nhiệm của cán bộ; mục tiêu phục vụ nhân dân; các giá trị cẩn trọng, khách quan, trách nhiệm. Sau nhiều tháng cùng AI làm ra phần mềm, tôi thấy cả bốn điều vẫn đứng nguyên. Điều mới là người làm nghiệp vụ nay có thể cùng AI tự dựng một bản chạy được trước khi đặt hàng.

Tập 1 mong đồng nghiệp "không chỉ đọc và áp dụng, mà còn nghiên cứu, sáng tạo, đóng góp", và nêu hướng AI trong các cơ quan dân cử: phân tích ý kiến cử tri, hỗ trợ chất vấn, hỗ trợ giám sát. Tập 2 là một câu trả lời thực hành, còn khiêm tốn, cho đúng dòng ấy; nó chưa phải cuốn chuyên khảo đã hẹn cho năm 2030. Chiến lược quốc gia về trí tuệ nhân tạo mà Tập 1 dẫn (Quyết định 127/QĐ-TTg) nay đã được thay bằng Quyết định 1671/QĐ-TTg ngày 28/8/2026: khung định hướng cũng đổi nhanh như công cụ.

Tập 1 viết: "Cán bộ tham mưu giỏi trong kỷ nguyên AI là người dùng AI để phục vụ nhân dân tốt hơn". Tập 2 xin thêm một vế: khi cần, biết cùng AI làm ra công cụ để phục vụ tốt hơn nữa, biết dừng ở mức vừa đủ, và biết giao lại cho hệ thống chính thức khi đến lúc.

::: {.ghinho}
**Ghi nhớ: những điều mang theo từ Tập 1 sang Tập 2**

- Vấn đề không phải ở AI, mà ở cách mình giao việc cho AI (Lời nói đầu Tập 1), và ở cách mình nghiệm thu việc AI đã làm.
- Máy đề xuất – người quyết định, đúng Mô hình 1 "AI đề xuất, con người duyệt" (Tập 1, mục 7.5); không có "đổ lỗi cho AI" (Tập 1, mục 7.7).
- Phân loại dữ liệu trước khi đưa vào AI hay vào ứng dụng; khi không chắc chắn, chọn cấp cao hơn (Tập 1, mục 7.2).
- Nói thật cả giới hạn; ghi chép để người khác tiếp nhận được.
:::

Như Tập 1 đã viết ở phần tổng kết Chương 2, công cụ sẽ đổi, kỹ năng giữ lại. Người làm nghiệp vụ cẩn trọng, trung thực, dám làm và dám chịu trách nhiệm vẫn là người không công cụ nào thay được.

*Thanh Hóa, tháng 10 năm 2026*

**TS. Hà Ngọc Sơn**
