# Chương 11. Phân hệ đánh giá tiêu chí Hội đồng nhân dân tỉnh, xã, phường

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu cấu trúc Khung tiêu chí đánh giá, xếp loại Hội đồng nhân dân cấp tỉnh, cấp xã nhiệm kỳ 2026–2031 (dự thảo) và cách phần mềm biến từng dòng "Cách chấm điểm" thành phép tính.
- Nắm cách cho hàng chục đơn vị không có tài khoản hệ thống tự đăng nhập, tự chấm điểm mà không lộ mã truy cập, và luồng tự chấm – thẩm định – phê duyệt.
- Biết cách dùng việc số hóa như một lần "thẩm định số học" đối với dự thảo văn bản, và cách "chuẩn hóa có ghi chú" thay vì lặng lẽ chọn đại.
- Rút ra bài học về một bộ dữ liệu duy nhất cho bản trình diễn.
- Phân biệt rõ phần việc của phần mềm với thẩm quyền của Thường trực Hội đồng nhân dân tỉnh và của cơ quan thi đua, khen thưởng.

Dành cho: chuyên viên tham mưu công tác HĐND, Tổ công tác thẩm định, lãnh đạo Văn phòng và Thường trực HĐND; cán bộ muốn tự làm một công cụ chấm điểm theo bộ tiêu chí.
:::

Hai chương trước nói về đánh giá con người. Chương này chuyển sang đánh giá một tập thể dân cử: Hội đồng nhân dân (HĐND) cấp tỉnh và HĐND các xã, phường. Có ba khác biệt lớn. Người tự chấm là Thường trực HĐND hàng chục xã, phường, vốn không có tài khoản trên hệ thống. Văn bản làm căn cứ mới là dự thảo. Và kết quả đi vào bình xét thi đua, có trần số đơn vị được xếp loại cao nhất.

Phân hệ "Đánh giá tiêu chí HĐND tỉnh, xã, phường" nằm trong hệ thống thử nghiệm của Văn phòng tại địa chỉ hdndthkpi.vercel.app, đường dẫn `#/tieuchi`. Theo thứ tự các mục trong nhật ký dự án, phân hệ được dựng sau phân hệ Kiểm điểm (căn cứ Hướng dẫn 03-HD/TU ngày 02/7/2026) và trước đợt sự cố dữ liệu ngày 13/8/2026.

## 11.1. Khung tiêu chí nhiệm kỳ 2026–2031

### 11.1.1. Văn bản làm căn cứ: một dự thảo có cấu trúc chặt

Tài liệu gốc là dự thảo Quyết định của Thường trực HĐND tỉnh Thanh Hóa "Ban hành Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã tỉnh Thanh Hóa, nhiệm kỳ 2026 - 2031", lưu trong kho mã nguồn (repository) ở tệp `docs/Khung_tieu_chi.docx`. Dự thảo gồm 8 điều và hai phụ lục. Đọc nó như một bản thiết kế, tôi tách ra sáu thứ máy cần biết.

| Thành phần | Dự thảo quy định | Phần mềm phải làm |
|---|---|---|
| Chủ thể | HĐND tỉnh (Phụ lục I); HĐND xã, phường (Phụ lục II) | Hai bộ khung riêng |
| Phương pháp | Tự đánh giá, tự chấm theo cột "Cách chấm điểm" | Số hóa từng mức chấm |
| Công thức | 7 nhóm (100đ) + thưởng (≤10đ) − trừ (≤20đ) | Tổng trong khoảng 0–110 |
| Xếp loại | 5 mức, kèm điều kiện, trần 25% cấp xã | Tự áp điều kiện, nêu lý do |
| Thời hạn | Tự chấm trước ngày 25/12; công bố trong quý I năm sau | Đóng, mở đợt đánh giá |
| Thẩm quyền | Tổ công tác thẩm định; Thường trực xem xét, bình xét | Ba vai, ba quyền khác nhau |

Theo Điều 2 của dự thảo, Phụ lục I dùng để HĐND tỉnh tự đánh giá hằng năm và làm căn cứ đánh giá các Ban, các Tổ đại biểu, Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và HĐND tỉnh. Phụ lục II dùng cho HĐND các xã, phường tự đánh giá nội dung thi đua, để Thường trực HĐND tỉnh thẩm định, bình xét. Điều 8 ghi áp dụng thử nghiệm với kết quả năm 2026, chính thức từ năm 2027.

::: {.phaply}
**Căn cứ pháp lý**

Phần căn cứ của dự thảo dẫn nhiều văn bản. Sách này chỉ nêu những văn bản đã được đối chiếu trong danh mục pháp lý của sách:

- Luật Tổ chức chính quyền địa phương số 72/2025/QH15, Quốc hội thông qua ngày 16/6/2025, có hiệu lực từ ngày 16/6/2025; chính quyền địa phương tổ chức theo hai cấp (tỉnh và xã) từ 01/7/2025.
- Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15, thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026.
- Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.

Dự thảo còn dẫn các văn bản về thi đua, khen thưởng, về tiếp xúc cử tri, tiếp công dân và các nghị quyết hướng dẫn Luật Hoạt động giám sát. Sách chưa đối chiếu được số hiệu của các văn bản này nên không nêu ở đây. Trước khi trình ký, cơ quan soạn thảo cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

### 11.1.2. Bảy nhóm tiêu chí, một nhóm thưởng, một nhóm trừ

Cả hai phụ lục đều có bảy nhóm tiêu chí cộng lại đúng 100 điểm. Trọng số mỗi nhóm khác nhau theo cấp, phản ánh chức năng khác nhau của HĐND tỉnh và HĐND xã, phường.

| Nhóm | Nội dung (tóm tắt) | Cấp tỉnh | Cấp xã |
|---|---|---|---|
| I | Kỳ họp, quyết định vấn đề quan trọng, nghị quyết | 23 | 20 |
| II | Hoạt động giám sát | 20 | 20 |
| III | Tiếp xúc cử tri, tiếp công dân, dân nguyện, đơn thư | 15 | 20 |
| IV | Chuyển đổi số (cấp tỉnh có thêm trí tuệ nhân tạo) | 15 | 15 |
| V | Đổi mới sáng tạo, mô hình mới, cách làm hay | 15 | 10 |
| VI | Tỉnh: hỗ trợ HĐND cấp xã; xã: bộ máy, chế độ hoạt động | 7 | 10 |
| VII | Thông tin, báo cáo, truyền thông, phối hợp | 5 | 5 |

Ngoài bảy nhóm còn hai nhóm đặc biệt. Nhóm VIII là điểm thưởng đổi mới sáng tạo, tối đa 10 điểm: mô hình được Trung ương giới thiệu, nhân rộng; giải thưởng; tăng hạng các chỉ số; nghị quyết chuyên đề tháo gỡ điểm nghẽn. Nhóm IX là điểm trừ và chế tài, tối đa trừ 20 điểm: nghị quyết bị kết luận trái pháp luật, không hoàn thành cuộc giám sát đã ghi trong chương trình, chậm báo cáo, để đơn thư quá hạn, có người bị kỷ luật, kê khai minh chứng không trung thực.

Một chi tiết đáng chú ý với chính cuốn sách này: Nhóm IV của Phụ lục I có tiêu chí IV.3 "Ứng dụng trí tuệ nhân tạo hỗ trợ đại biểu (trợ lý ảo, tổng hợp - phân tích tài liệu kỳ họp, dữ liệu phục vụ thẩm tra)", tối đa 4 điểm. Cách chấm phân biệt "triển khai chính thức" (3 điểm) với "mới thí điểm" (1,5 điểm), cộng 1 điểm nếu có báo cáo đánh giá hiệu quả bằng số liệu. Dự thảo đã tự đặt yêu cầu đo hiệu quả của AI bằng số liệu, không chỉ bằng lời giới thiệu.

### 11.1.3. Năm kiểu chấm điểm: phần mềm phải hiểu cột "Cách chấm điểm"

Mỗi tiêu chí chia thành các "điểm thành phần", mỗi điểm có một dòng cách chấm. Đọc hết hai phụ lục, tác tử AI lập trình và tôi gom được năm kiểu chấm, mỗi kiểu một cách nhập liệu.

| Kiểu chấm | Ví dụ trong dự thảo | Màn hình hiển thị |
|---|---|---|
| Chọn một mức | I.1.c: thảo luận ≥40% thời gian kỳ họp được 2đ; 30–40% được 1đ | Các nút chọn, ghi rõ điểm từng mức |
| Trừ theo số lần | I.2.b: chậm gửi tài liệu, trừ 0,5đ mỗi kỳ họp | Ô nhập số lần |
| Tỷ lệ × điểm | III.3.b cấp xã: tỷ lệ vụ việc giải quyết dứt điểm × 1,5đ | Ô nhập phần trăm |
| Đếm số đơn vị | V.1.a cấp tỉnh: mỗi mô hình đủ 05 điều kiện được 2,5đ, tối đa 5đ | Ô nhập số mô hình |
| Trừ điểm nhóm IX | IX.1: mỗi nghị quyết trái pháp luật trừ 5đ, kèm chế tài | Ô nhập số trường hợp |

Kiểu "chọn một mức" có một biến thể quan trọng: mức làm mất điểm toàn tiêu chí. Ví dụ, tiêu chí I.1 cấp tỉnh (4 điểm) gồm ba điểm thành phần. Nếu chọn "không tổ chức đủ số kỳ họp thường lệ" ở I.1.a thì cả tiêu chí I.1 về 0, dù hai điểm thành phần kia đã chấm đủ. Mức này mang một cờ riêng trong mã nguồn, và giao diện hiện cảnh báo đỏ ngay tại tiêu chí đó.

::: {.vidu}
**Ví dụ minh họa — tiêu chí III.3 của một xã giả định**

Hãy hình dung một xã trong năm tổ chức tiếp công dân thiếu 01 kỳ so với quy định; 80% vụ việc sau tiếp công dân được giải quyết dứt điểm; còn đơn thư quá hạn. Theo cách chấm đã chuẩn hóa (xem mục 11.3):

- III.3.a (đạt yêu cầu, tối đa 1,5đ): 1,5 − 0,5 = 1,0 điểm.
- III.3.b (chất lượng, tối đa 1,5đ): 80% × 1,5 = 1,2, làm tròn đến 0,25 thành 1,25 điểm.
- III.3.c (đơn thư, tối đa 3đ): "còn đơn thư quá hạn" được 1,5 điểm.

Tiêu chí III.3 đạt 3,75/6 điểm. Mỗi con số đều truy ngược được về một dòng "Cách chấm điểm" và một ô minh chứng.
:::

### 11.1.4. Xếp loại năm mức và những điều kiện đi kèm

Điều 6 của dự thảo quy định năm mức theo tổng điểm: Xuất sắc từ 90 điểm, Tốt từ 80 đến dưới 90, Khá từ 65 đến dưới 80, Trung bình từ 50 đến dưới 65, Yếu dưới 50. Điểm chỉ là điều kiện cần. Mức Xuất sắc và Tốt còn phải "đáp ứng điều kiện về đổi mới sáng tạo". Rồi đến chế tài: có nghị quyết bị kết luận trái pháp luật, có cán bộ, đại biểu bị kỷ luật từ cảnh cáo thì không được Xuất sắc; Thường trực hoặc người đứng đầu bị kỷ luật từ khiển trách thì không được từ Tốt trở lên; kê khai không trung thực thì hạ một mức, tái phạm xếp loại Yếu.

Phần mềm tính tổng, xếp mức theo điểm, rồi lần lượt áp từng điều kiện hạ mức; mỗi lần hạ mức ghi một dòng lý do bằng tiếng Việt.

::: {.vidu}
**Ví dụ minh họa — 90 điểm nhưng xếp loại Tốt**

Hãy hình dung HĐND một phường đạt 87 điểm ở bảy nhóm, được 3 điểm thưởng, không bị trừ: tổng 90 điểm. Ở nhóm V (tối đa 10 điểm), phường có 01 mô hình mới (3 điểm) và có báo cáo đánh giá bằng số liệu (1,5 điểm): 4,5/10, tức 45%.

Điều kiện đổi mới sáng tạo cho mức Xuất sắc đã lượng hóa (mục 11.3) là nhóm V từ 60% trở lên và có ít nhất 01 mô hình với cấp xã. Phường mới đạt 45%, nên phần mềm hạ xuống Tốt. Kiểm tra tiếp điều kiện mức Tốt: nhóm V từ 40% và có ít nhất 01 mô hình. Phường đạt cả hai, nên giữ Tốt. Phiếu ghi rõ: "cần điểm nhóm V ≥ 60% (hiện 45%)".

Nếu phường có 02 mô hình (6 điểm) cộng báo cáo (1,5 điểm), nhóm V đạt 75%, các nhóm khác giữ nguyên thì tổng thành 93 và phường đủ điều kiện Xuất sắc. Khi đó còn một cửa nữa: trần 25%.
:::

Trần 25% là điểm riêng của cấp xã: số đơn vị Xuất sắc không vượt quá 25% số đơn vị được đánh giá. Vượt tỷ lệ thì chọn theo tổng điểm từ cao xuống; bằng điểm thì ưu tiên điểm thưởng nhóm VIII, rồi điểm nhóm V. Đơn vị đủ điều kiện mà không được chọn thì được xem xét xếp loại Tốt.

Bộ dữ liệu mô phỏng của phân hệ có 10 xã, phường, trong đó 5 đơn vị đủ điều kiện Xuất sắc. 25% của 10 là 2,5; "không vượt quá" nên chỉ được 2 suất. Bảng kết quả xếp 5 đơn vị theo thứ tự ưu tiên, giữ 2 đơn vị, gắn nhãn vượt trần 25% cho 3 đơn vị còn lại kèm dòng nhắc xem xét xếp loại Tốt. Phần mềm chỉ sắp xếp và đếm; quyết định thuộc Thường trực HĐND tỉnh (mục 11.5).

::: {.ghinho}
**Ghi nhớ**

Một bộ tiêu chí tốt cho máy tính là bộ tiêu chí mà mỗi dòng "Cách chấm điểm" trả lời được ba câu: nhập cái gì (mức, số lần, tỷ lệ hay số lượng), được bao nhiêu điểm, và trần là bao nhiêu. Dòng nào chưa trả lời đủ ba câu đó thì người chấm cũng sẽ lúng túng như máy.
:::

## 11.2. Đơn vị tự chấm, Tổ công tác thẩm định, Thường trực phê duyệt

### 11.2.1. Ba cửa vào cho ba vai

Phân hệ có ba cửa vào. Mở đường dẫn `#/tieuchi` là vào thẳng cửa thứ ba, chế độ khách, thấy ngay bảng kết quả mà không phải đăng nhập.

| Vai | Vào bằng | Được làm |
|---|---|---|
| Đơn vị (HĐND xã, phường; Ban, Tổ đại biểu, Văn phòng) | Mã đơn vị + mã truy cập do Thường trực cấp | Tự chấm, ghi minh chứng, gửi phiếu của chính mình |
| Thường trực HĐND tỉnh, Tổ công tác | Tài khoản quản trị của hệ thống | Thẩm định, phê duyệt, quản lý đơn vị, cấu hình đợt đánh giá |
| Khách | Không cần đăng nhập | Chỉ xem bảng kết quả, phiếu, khung tiêu chí |

Vì sao không cấp tài khoản hệ thống cho từng xã? Mỗi tài khoản là một hộp thư phải xác nhận, một mật khẩu phải quản lý; với hàng chục đơn vị, chi phí đó lớn hơn lợi ích. Cách quen thuộc hơn là Thường trực cấp cho mỗi đơn vị một "mã đơn vị" và một "mã truy cập", giống cấp số hồ sơ và mã tra cứu.

### 11.2.2. Mã truy cập chỉ lưu dạng băm

Câu hỏi khó là: lưu mã truy cập ở đâu cho an toàn, khi dòng dữ liệu của phân hệ lại được mở đọc công khai để khách xem kết quả? Câu trả lời là không lưu mã. Phần mềm chỉ lưu chuỗi băm (hash) theo thuật toán SHA-256 của chuỗi "mã đơn vị::mã truy cập".

Chuỗi băm giống vân tay. Nhìn vân tay thì xác nhận được đúng người, nhưng không dựng lại được bàn tay. Khi đơn vị gõ mã, phần mềm băm lại rồi so với chuỗi đã lưu; khớp thì cho vào. Mã truy cập do phần mềm sinh ngẫu nhiên, 8 ký tự, bỏ các ký tự dễ nhầm như chữ O với số 0. Mã chỉ hiện một lần lúc cấp; sau đó không ai xem lại được, kể cả Quản trị; quên thì cấp mã mới.

Việc ghi phiếu đi qua một "ô cửa hẹp": hàm `tc_unit_save` trên máy chủ (BƯỚC 5 trong tệp `supabase/schema.sql`). Hàm tìm đơn vị theo mã, đối chiếu chuỗi băm, kiểm tra đơn vị chưa bị khóa, rồi chỉ ghi đúng phiếu của đơn vị đó trong năm đó. Hình ảnh dễ nhớ: không giao chìa khóa kho cho khách, chỉ khoét một khe nộp hồ sơ có người soát giấy tờ.

::: {.canhbao}
**Cảnh báo — giới hạn của cơ chế này**

Cơ chế mã đơn vị, mã truy cập và chuỗi băm đủ cho một bản demo thử nghiệm: mã gốc không nằm ở đâu trên máy chủ. Nhưng nó chưa phải thiết kế an ninh cho dữ liệu thật. Trước khi đưa vào sử dụng chính thức, cần ít nhất: đóng quyền đọc công khai của dòng dữ liệu; chuyển việc xác thực đơn vị hẳn về máy chủ theo cơ chế xác thực của hạ tầng chính thức; để hàm ghi kiểm tra nội dung phiếu, đơn vị chỉ ghi được phần tự chấm, không chạm được phần thẩm định và phê duyệt. Phiếu còn có ô người liên hệ và số điện thoại; trong bản demo, không nhập số điện thoại cá nhân thật vào đó.
:::

### 11.2.3. Từ tự chấm đến phê duyệt

Luồng nghiệp vụ đi đúng Điều 5 của dự thảo, mỗi bước một trạng thái hiển thị trên bảng kết quả.

1. **Đơn vị tự chấm.** Phiếu chia theo nhóm, gập mở được. Mỗi điểm thành phần hiện dòng "Cách chấm điểm", các mức bấm chọn kèm số điểm, ô hồ sơ minh chứng và ô ghi chú. Bên phải là thẻ tổng điểm luôn hiện: điểm bảy nhóm, thưởng, trừ, xếp loại dự kiến, lý do hạ mức, tiến độ khai báo.
2. **Đơn vị gửi phiếu.** Nếu tiến độ khai báo dưới 100%, phần mềm hỏi lại trước khi gửi. Tiến độ chỉ tính trên bảy nhóm bắt buộc; nhóm VIII và IX chỉ khai khi có phát sinh nên không đưa vào mẫu số. Gửi xong, phiếu chuyển sang chỉ xem; muốn sửa phải bấm "Mở lại để sửa", và chỉ khi đợt đánh giá còn mở.
3. **Tổ công tác thẩm định.** Ghi điểm sau thẩm định, xếp loại đề xuất, người thẩm định, nhận xét. Điểm sau thẩm định, nếu có, được dùng thay điểm tự chấm khi xếp loại và áp trần.
4. **Thường trực phê duyệt.** Phê duyệt từng đơn vị ngay trên phiếu, hoặc phê duyệt hàng loạt các đơn vị đã gửi từ bảng kết quả. Xếp loại được đóng dấu là xếp loại chính thức sau khi đã áp trần 25%. Đơn vị mở phiếu sẽ thấy dòng "Kết quả đã được Thường trực HĐND tỉnh phê duyệt", kèm người phê duyệt và ngày.
5. **Sửa điểm thì tự gỡ phê duyệt.** Bất kỳ thay đổi nào ở phần chấm điểm sau khi đã phê duyệt đều làm dấu phê duyệt tự mất; muốn có kết quả chính thức phải phê duyệt lại.

Bước 5 là cơ chế đã dùng ở phân hệ OKR/KPI và Kiểm điểm (Chương 9, Chương 10). Một con dấu phê duyệt chỉ có nghĩa khi gắn với đúng con số đã được xem xét; sửa điểm mà dấu vẫn còn thì dấu ấy xác nhận một điều không còn đúng.

Cuối luồng là hai sản phẩm xuất ra: phiếu tự đánh giá dạng Word (từng tiêu chí, mức tự chấm, minh chứng, tổng hợp, chữ ký) và bảng tổng hợp Excel (tiến độ, điểm bảy nhóm, thưởng, trừ, thẩm định, xếp loại, phê duyệt, ghi chú vượt trần).

::: {.lenhmau}
**Câu lệnh mẫu 11.1 — Dựng luồng thẩm định, phê duyệt có tự gỡ phê duyệt**

```text
Vai: Đồng chí là tác tử AI lập trình đang làm việc trong kho mã của tôi.
Bối cảnh: Phân hệ đánh giá theo bộ tiêu chí đã có phiếu tự chấm của
từng đơn vị. Theo dự thảo quyết định (tệp [docs/ten-tep.docx], Điều 5),
quy trình là: đơn vị tự chấm và gửi → Tổ công tác thẩm định → Thường
trực xem xét, phê duyệt.
Việc: Bổ sung cho phiếu ba trạng thái "đã gửi", "đã thẩm định",
"đã phê duyệt" và các nút tương ứng theo vai.
Dạng: Giao diện tiếng Việt có dấu; bảng kết quả có cột trạng thái;
phiếu Word và bảng Excel xuất ra có thêm thông tin phê duyệt.
Ràng buộc:
- Đơn vị chỉ gửi và mở lại phiếu của mình khi đợt còn mở; không thấy
  nút thẩm định, phê duyệt.
- Mọi thay đổi ở phần chấm điểm sau khi phê duyệt phải TỰ GỠ phê duyệt.
- Xếp loại được phê duyệt là xếp loại sau thẩm định và sau khi áp
  trần 25% của cấp xã; dùng lại đúng hàm tính đã có, không viết công
  thức mới.
- Không đụng các phân hệ khác.
Nghiệm thu: viết phép kiểm cho các ca: phê duyệt rồi sửa một điểm
thành phần thì mất phê duyệt; khách không thấy nút phê duyệt; đơn vị
đã gửi thì không sửa được. Chạy kiểm thử, bản dựng phải xanh. Trước
khi làm, trình tôi phương án và danh sách tệp sẽ sửa.
```
:::

## 11.3. Số hóa một dự thảo: sáu điểm chưa nhất quán và cách "chuẩn hóa có ghi chú"

### 11.3.1. Khi câu chữ buộc phải thành phép tính

Người đọc có thể lướt qua chỗ mâu thuẫn nhỏ, vì trí óc tự hiểu theo ý hợp lý nhất. Máy tính thì không: mỗi dòng phải có một con số, các con số phải cộng khớp với tổng. Vì thế, số hóa một văn bản cũng là một lần thẩm định số học văn bản đó.

::: {.cauchuyen}
**Câu chuyện thực tế — "đạt kiểm thử" chưa có nghĩa là văn bản đã nhất quán**

Khi dựng phân hệ, tác tử AI lập trình chép từng mức điểm của hai phụ lục vào tệp logic. Cấu trúc của tệp buộc mỗi điểm thành phần có điểm tối đa, mỗi tiêu chí và mỗi nhóm có trần. Đến bước này, các con số không khớp tự lộ ra: có nhóm cộng ra 13 điểm trong khi trần là 10; có tiêu chí cộng ra 9 điểm trong khi trần là 6.

Ngay lần dựng đầu, phần mềm đã kẹp điểm theo trần để không bao giờ ra điểm vượt mức, và liệt kê 6 điểm chưa nhất quán thành một danh sách ghi chú để cơ quan soạn thảo rà lại. Nhật ký ghi lần đó có 270 phép kiểm logic (tổng điểm nhóm, chấm tối đa bằng 100 và 110, trần điểm trừ, chế tài, trần 25%) và đều đạt. Nhưng "đạt" chỉ có nghĩa là phần mềm không cho điểm vượt trần; nó chưa có nghĩa là văn bản đã nhất quán. Chính việc kẹp điểm còn che bớt mâu thuẫn. Vì vậy bước sau, từng điểm được chuẩn hóa có ghi chú công khai; bộ kiểm thử logic tăng lên 293 phép kiểm và đều đạt.
:::

### 11.3.2. Sáu điểm và cách xử lý từng điểm

| Vị trí | Dự thảo ghi | Phần mềm chuẩn hóa |
|---|---|---|
| Phụ lục II – III.3 (tiếp công dân) | Một điểm thành phần 3đ ghi cả "mức đạt yêu cầu 3đ" lẫn "chất lượng cộng thêm tối đa 3đ"; cộng đủ thành 9đ cho tiêu chí 6đ | III.3.a 1,5đ + III.3.b 1,5đ + III.3.c 3đ = 6đ |
| Phụ lục II – nhóm VIII | Bốn nội dung cộng 13đ (5 + 3 + 2 + 3), trần 10đ | Phân bổ lại 4 + 2 + 2 + 2 = 10đ |
| Phụ lục I – IX.7 | Cột điểm tối đa ghi −5; cách chấm ghi "tối đa trừ 10đ" | Thống nhất trần 10đ |
| Phụ lục II – IX.6 | Cột điểm tối đa ghi −3; cách chấm ghi "tối đa trừ 6đ" | Thống nhất trần 6đ |
| Điều 6 | Đòi "điều kiện đổi mới sáng tạo" nhưng không nêu ngưỡng | Lượng hóa theo câu chữ nhóm V |
| Điều 6 | Khoản 1, 2 rồi nhảy sang khoản 5, 6 | Đánh số lại liền mạch 5 khoản |

Điểm đáng bàn là cách chọn phương án: mỗi phương án đều bám vào một câu chữ khác của chính văn bản, không "chọn cho gọn".

- Với III.3, tách thành hai điểm thành phần 1,5 điểm theo cách viết của tiêu chí I.1 cùng phụ lục, giữ tiêu chí ở 6 điểm.
- Với nhóm VIII, giữ thứ tự ưu tiên của dự thảo: nhân rộng toàn tỉnh hoặc được Trung ương giới thiệu vẫn nặng nhất (5 xuống 4 điểm); khen thưởng 3 xuống 2 (biểu dương 1,5 xuống 1); nghị quyết chuyên đề 1,5 xuống 1 điểm mỗi nghị quyết, tối đa 2.
- Với IX.7 và IX.6, chọn theo cột "Cách chấm điểm", vì để trần 5 thì cụm "tối đa trừ 10đ" vô nghĩa; kèm kiến nghị sửa cột thành −10 và −6.
- Với điều kiện đổi mới sáng tạo, dựa vào câu mở đầu của nhóm V trong từng phụ lục: cấp tỉnh "có ít nhất 02 mô hình mới, cách làm hay", cấp xã "có ít nhất 01 mô hình". Từ đó: Xuất sắc cần điểm nhóm V từ 60% và đủ số mô hình tương ứng; Tốt cần từ 40% và ít nhất 01 mô hình. Hai ngưỡng 60% và 40% là đề xuất của phần mềm, ghi rõ là đề xuất.
- Với số thứ tự khoản, đánh số lại theo nội dung: (1) mức xếp loại theo điểm; (2) trần 25% cấp xã; (3) các trường hợp không xếp loại Xuất sắc; (4) kỷ luật người đứng đầu; (5) kê khai không trung thực.

### 11.3.3. "Chuẩn hóa có ghi chú" nghĩa là gì

Có ba cách xử lý một văn bản tự mâu thuẫn. Dừng lại chờ cơ quan soạn thảo sửa: an toàn nhưng phần mềm không chạy được. Lặng lẽ chọn một cách hiểu rồi viết vào mã: nhanh nhưng nguy hiểm, vì người dùng tin phần mềm làm đúng văn bản. Cách tôi chọn là chuẩn hóa để phần mềm chạy được, đồng thời công khai từng chỗ đã chuẩn hóa.

Trong mã nguồn, mỗi điểm là một mục ba phần: vị trí, "dự thảo ghi gì", "đã chuẩn hóa thế nào". Trên giao diện, chúng hiện ở hai nơi. Một là khối "Nội dung đã chuẩn hóa so với dự thảo (kiến nghị đưa vào bản chính thức)" trong mục xem Khung tiêu chí. Hai là dòng ghi chú màu xanh ngay dưới từng điểm thành phần bị ảnh hưởng, để người chấm thấy ngay tại chỗ mình đang chấm.

Cụm từ quan trọng nhất trong khối đó là "kiến nghị". Phần mềm không có thẩm quyền sửa một văn bản của Thường trực HĐND tỉnh. Nó chỉ làm cho mâu thuẫn hiện ra, đưa một phương án có lý do, và để cơ quan soạn thảo quyết định. Nếu bản ký ban hành chọn cách khác, chỉ cần sửa lại đúng mục đó trong tệp logic rồi chạy lại bộ kiểm thử.

::: {.ghinho}
**Ghi nhớ — năm bước "chuẩn hóa có ghi chú"**

1. Dùng phép kiểm số học để phát hiện: tổng thành phần có bằng điểm tối đa không, cột số có khớp lời văn không, điều khoản có đánh số liên tục không.
2. Với mỗi chỗ lệch, yêu cầu AI liệt kê các cách hiểu và hệ quả của từng cách.
3. Chọn phương án bám vào câu chữ khác của chính văn bản; người có trách nhiệm chốt, không để AI chốt.
4. Ghi "dự thảo ghi gì / đã chuẩn hóa thế nào" và hiện công khai ở nơi người dùng nhìn thấy.
5. Gọi đúng tên: đó là kiến nghị gửi cơ quan soạn thảo, không phải nội dung đã ban hành.
:::

### 11.3.4. Rà soát không bao giờ "xong hẳn"

Khi đọc lại dự thảo để viết chương này, tôi thấy thêm hai chỗ nhỏ chưa nằm trong danh sách sáu điểm. Thứ nhất, phần "Nguyên tắc chấm điểm" ở đầu mỗi phụ lục ghi "điểm lẻ làm tròn đến 0,5 điểm", trong khi cách chấm của một số tiêu chí lại ghi "làm tròn đến 0,25đ"; phần mềm làm tròn theo cách chấm của từng tiêu chí, trong khi trang xem Khung tiêu chí của chính phần mềm vẫn chép nguyên câu "0,5 điểm". Thứ hai, ở Điều 7 có hai điểm cùng đánh dấu "a)". Cả hai chưa làm sai điểm của đơn vị nào, nhưng là chỗ người chấm có thể hỏi lại.

Tôi kể điều này để nhắc một thực tế: phép kiểm chỉ bắt được loại lỗi mà người viết phép kiểm đã nghĩ tới. Sáu điểm kia lộ ra vì phải gán từng con số vào một cấu trúc có trần. Hai điểm này không làm sai tổng điểm nên không phép kiểm nào chạm tới. Mỗi lần văn bản đổi, nên giao cho AI một lượt rà soát mới, với danh sách câu hỏi rộng hơn lần trước.

::: {.lenhmau}
**Câu lệnh mẫu 11.2 — Thẩm định số học một dự thảo bộ tiêu chí**

```text
Vai: Đồng chí là chuyên viên rà soát văn bản, cẩn thận với con số.
Bối cảnh: Tôi gửi kèm dự thảo bộ tiêu chí chấm điểm [tên văn bản],
gồm các điều quy định chung và phụ lục có cột "Điểm tối đa" và cột
"Cách chấm điểm". Văn bản chưa ban hành.
Việc: Rà soát số học và tính nhất quán, KHÔNG sửa văn bản:
1. Cộng điểm tối đa các tiêu chí con, so với điểm của tiêu chí cha
   và của nhóm; so tổng các nhóm với tổng điểm quy định.
2. Với từng dòng, so con số ở cột "Điểm tối đa" với con số trong
   lời văn "Cách chấm điểm" (kể cả các cụm "tối đa trừ", "cộng thêm").
3. Kiểm tra quy tắc làm tròn chung có khớp quy tắc từng tiêu chí.
4. Kiểm tra số thứ tự điều, khoản, điểm có liên tục, có trùng không.
5. Liệt kê điều kiện nào được nêu mà không có ngưỡng đo được.
Dạng: Bảng 4 cột: Vị trí | Văn bản ghi | Vấn đề | Các cách hiểu có
thể và hệ quả. Không tự chọn phương án.
Ràng buộc: Chỉ dựa vào văn bản tôi gửi; trích nguyên văn câu chữ
liên quan; chỗ nào không chắc thì ghi "cần người soạn thảo xác nhận".
```
:::

Câu lệnh này dùng được với trợ lý AI trò chuyện, không cần tác tử lập trình. Lưu ý phân loại dữ liệu theo Tập 1: dự thảo chưa công bố là dữ liệu vùng VÀNG, chỉ đưa lên công cụ AI khi đã được phép, đã tắt chế độ dùng dữ liệu để huấn luyện và đã lược bỏ thông tin không cần thiết.

## 11.4. Một bộ dữ liệu duy nhất

### 11.4.1. Từ hai bộ dữ liệu song song đến một bộ

Để người xem thấy ngay một bảng kết quả đủ các trường hợp, phân hệ có bộ dữ liệu mô phỏng 14 đơn vị: 10 xã, phường và 4 đơn vị cấp tỉnh, gán 5 hồ sơ chất lượng từ A đến E, sinh bằng bộ số giả ngẫu nhiên có "hạt giống" cố định nên mọi máy thấy cùng một bảng. Kết quả trải từ Xuất sắc đến Yếu; có đơn vị đang làm dở, đã gửi, đã thẩm định, đã phê duyệt; có 5 đơn vị đủ điều kiện Xuất sắc để minh họa trần 2 suất; có 1 đơn vị có nghị quyết trái pháp luật để minh họa điểm trừ và chế tài.

::: {.cauchuyen}
**Câu chuyện thực tế — hai lần sửa cùng một chỗ**

Bản đầu chỉ nạp 14 đơn vị mô phỏng khi máy chủ chưa có đơn vị nào. Nhưng máy chủ đã có vài đơn vị do thử nghiệm, nên mở phân hệ chỉ thấy một đơn vị. Lần sửa thứ nhất tách hai bộ song song: dữ liệu thật trên máy chủ và 14 đơn vị mô phỏng chỉ nằm trên trình duyệt, kèm nút gạt "Dữ liệu mẫu (14) / Dữ liệu thật (N)". Mọi thao tác trên dữ liệu mẫu chạy đủ nhưng không được lưu. Người xem phải tự hiểu mình đang nhìn bộ nào.

Sau đó, ở phân hệ OKR/KPI, tôi phát hiện tài khoản khách và tài khoản quản trị thấy hai danh sách cán bộ khác nhau (Chương 9). Nguyên tắc "dữ liệu mẫu = dữ liệu chính thống" được chốt cho toàn hệ thống. Lần sửa thứ hai bỏ hẳn nút gạt, chỉ còn một bộ dữ liệu.
:::

Sau khi sửa, phân hệ chỉ còn một bộ dữ liệu, đọc từ một dòng trên máy chủ. Mỗi lần mở, phần mềm đối chiếu với danh sách đơn vị chính thống của bản demo. Thiếu đơn vị nào (so theo tên) thì bổ sung đơn vị đó kèm phiếu của nó. Phần mềm không xóa, không sửa đơn vị đã có trên máy chủ. Nếu người đang mở là Thường trực đã đăng nhập, phần bổ sung được ghi luôn lên máy chủ. Khách và quản trị nhờ vậy đọc cùng một bảng; khác nhau chỉ ở chỗ ai được ghi.

Bot chat trên Zalo, Telegram (Chương 14) cũng đọc dòng dữ liệu ấy và tính lại điểm bằng chính tệp logic của giao diện. Một con số, một nơi tính, nên bot không nói một điểm còn màn hình hiện một điểm khác.

::: {.canhbao}
**Cảnh báo — địa danh thật, điểm mô phỏng**

Tên 10 xã, phường trong bộ dữ liệu mẫu lấy theo địa danh của tỉnh để trông quen thuộc, nhưng mọi điểm số, trạng thái và xếp loại đều là mô phỏng. Phân hệ hiện nhãn "Bản demo thử nghiệm" và cảnh báo dữ liệu mô phỏng. Khi trình diễn, đồng chí không nên đọc xếp loại của một đơn vị cụ thể như thể đó là kết quả thật. Khi chuyển sang dùng thật, phải thay toàn bộ danh sách đơn vị và cấp mã truy cập mới.
:::

### 11.4.2. Câu hỏi nên đặt khi cần dữ liệu trình diễn

Mỗi khi muốn có "dữ liệu để trình diễn", hãy hỏi AI ba câu: dữ liệu này nằm ở đâu; ai đọc, ai ghi; nếu hai người thấy khác nhau thì sửa ở đâu. Câu trả lời là "hai nơi" thì sắp có hai sự thật.

### 11.4.3. Nếu đồng chí muốn làm phiên bản nhỏ hơn

Không phải cơ quan nào cũng cần một phân hệ có đăng nhập cho hàng chục đơn vị. Một Ban hay một phòng có thể bắt đầu bằng công cụ tự chấm theo một bộ tiêu chí, ở Bậc 1 hoặc Bậc 2 của thang kiến tạo (Chương 2): một bảng tính có công thức, hoặc một trang web một tệp chạy ngay trong trình duyệt, không cần máy chủ.

::: {.thuchanh}
**Thực hành — bảng tự chấm một bộ tiêu chí trong một buổi**

1. Chọn một bộ tiêu chí đã ban hành hoặc một dự thảo được phép dùng thử. Chỉ dùng phần tiêu chí, không đưa kết quả chấm của đơn vị thật lên công cụ AI công cộng.
2. Chép tiêu chí ra bảng 5 cột: Mã | Nội dung | Điểm tối đa | Kiểu chấm (chọn mức, trừ theo lần, tỷ lệ, đếm) | Cách chấm (nguyên văn).
3. Dùng Câu lệnh mẫu 11.2 để rà soát số học bảng này trước khi làm phần mềm.
4. Dùng Câu lệnh mẫu 11.3 để AI dựng trang một tệp.
5. Tự kiểm: chọn mức cao nhất ở mọi ô, tổng phải đúng điểm tối đa; chọn mức làm mất điểm toàn tiêu chí, tiêu chí đó phải về 0.
6. Gửi đồng nghiệp chấm thử một phiếu giả định, ghi lại chỗ họ lúng túng, sửa câu chữ trên màn hình.
:::

::: {.lenhmau}
**Câu lệnh mẫu 11.3 — Trang tự chấm một tệp theo bộ tiêu chí**

```text
Vai: Đồng chí là lập trình viên giao diện, viết cho người không chuyên.
Bối cảnh: Tôi gửi kèm bảng tiêu chí 5 cột (Mã, Nội dung, Điểm tối đa,
Kiểu chấm, Cách chấm). Kiểu chấm gồm: chọn một mức; trừ theo số lần;
tỷ lệ % nhân điểm; đếm số đơn vị đạt. Một số mức ghi "mất điểm toàn
tiêu chí".
Việc: Viết MỘT tệp HTML chạy ngay trong trình duyệt, không cần máy
chủ, để một đơn vị tự chấm theo bảng này.
Dạng: Tiếng Việt có dấu. Mỗi tiêu chí hiện câu "Cách chấm" nguyên văn,
ô nhập phù hợp với kiểu chấm, ô ghi minh chứng. Thẻ tổng điểm luôn
hiện, kèm xếp loại theo ngưỡng [ghi ngưỡng] và lý do nếu bị hạ mức.
Nút "Xuất kết quả" ra tệp CSV.
Ràng buộc: Tách riêng phần dữ liệu tiêu chí và phần tính điểm khỏi
phần giao diện. Điểm luôn kẹp trong khoảng 0 đến điểm tối đa. Không
gửi dữ liệu đi đâu; không dùng thư viện ngoài.
Nghiệm thu: Viết kèm hướng dẫn tự kiểm tra bằng tay cho 3 ca: chấm tối
đa mọi ô; một tiêu chí bị mất điểm toàn bộ; một ô trừ quá số lần.
```
:::

Khi phiên bản một tệp đã dùng ổn, đồng chí mới cần nghĩ đến Bậc 3: lưu lên cơ sở dữ liệu, có đăng nhập, có người thẩm định. Khi đó, hãy đọc lại mục 11.2 về mã truy cập và "ô cửa hẹp". Cũng cần biết giới hạn của gói miễn phí: theo tài liệu của Supabase, dự án gói miễn phí bị tạm dừng sau 1 tuần không hoạt động (thông tin tại thời điểm viết, 10/2026, có thể thay đổi). Một phân hệ chỉ dùng mỗi năm một lần vào tháng 12 sẽ gặp đúng tình huống này.

## 11.5. Dành cho lãnh đạo: phần mềm hỗ trợ bình xét, không thay thẩm quyền

Một phần mềm chấm điểm dễ tạo ấn tượng rằng kết quả là "của máy", khách quan và không cần bàn. Tôi muốn nói rõ điều ngược lại. Phân hệ này chỉ làm ba việc: cộng điểm theo đúng cách chấm đã số hóa, áp các điều kiện hạ mức và trần 25% để đưa ra danh sách đề xuất, và lưu vết ai đã thẩm định, ai đã phê duyệt. Mọi việc còn lại thuộc về con người có thẩm quyền.

- **Không thay thẩm quyền ban hành.** Sáu điểm chuẩn hóa chỉ là kiến nghị. Khung tiêu chí chính thức là văn bản do Thường trực HĐND tỉnh ký ban hành; phần mềm phải chạy theo văn bản đó, không phải ngược lại.
- **Không thay Tổ công tác và Thường trực.** Minh chứng có trung thực không, một mô hình có đủ 05 điều kiện không, một vụ việc có phải "nguyên nhân chủ quan" không: đó là phán đoán của người thẩm định. Phần mềm chỉ ghi lại phán đoán ấy.
- **Không thay cơ quan thi đua, khen thưởng.** Danh sách đơn vị được chọn trong trần 25% là gợi ý theo thứ tự ưu tiên của Điều 6. Việc công nhận danh hiệu, khen thưởng phải theo trình tự của pháp luật về thi đua, khen thưởng và do cấp có thẩm quyền quyết định.
- **Không phải hệ thống chính thức.** Đây là bản demo thử nghiệm trên hạ tầng miễn phí, dữ liệu mô phỏng. Muốn dùng cho đợt đánh giá thật, cần quyết định về hạ tầng, về an toàn thông tin và về người chịu trách nhiệm vận hành (Chương 20).

::: {.lanhdao}
**Dành cho lãnh đạo**

- Việc nên làm ngay: giao Văn phòng rà lại sáu điểm chuẩn hóa (và hai điểm nhỏ ở mục 11.3.4) để đưa vào bản trình ký.
- Quyết định có dùng phần mềm cho năm thử nghiệm 2026 hay không; nếu dùng, quy định rõ bản giấy hay bản điện tử là bản có giá trị.
- Chỉ định người chịu trách nhiệm cấp, thu hồi mã truy cập của đơn vị.
- Yêu cầu mọi xếp loại trên phần mềm luôn kèm dòng lý do, và luôn có chữ ký người thẩm định, người phê duyệt.
- Coi ngưỡng 60% và 40% về đổi mới sáng tạo là đề xuất kỹ thuật, cần tập thể Thường trực cân nhắc trước khi ban hành.
:::

## Tóm tắt chương 11

::: {.tomtat}
1. Khung tiêu chí HĐND nhiệm kỳ 2026–2031 (dự thảo) có bảy nhóm 100 điểm, nhóm VIII thưởng tối đa 10 điểm, nhóm IX trừ tối đa 20 điểm; tổng 0–110; xếp loại năm mức theo Điều 6.
2. Phần mềm số hóa tới từng điểm thành phần với năm kiểu chấm, có mức làm mất điểm toàn tiêu chí; mỗi lần hạ mức đều ghi lý do bằng tiếng Việt.
3. Cấp xã có trần 25% Xuất sắc; phần mềm chỉ sắp xếp, đếm và đề xuất, quyết định thuộc Thường trực.
4. Đơn vị đăng nhập bằng mã đơn vị và mã truy cập; chỉ lưu chuỗi băm; ghi phiếu qua một hàm làm đúng một việc. Đây là mức của bản demo, chưa phải thiết kế cho dữ liệu thật.
5. Luồng tự chấm – gửi – thẩm định – phê duyệt; sửa điểm thì tự gỡ phê duyệt.
6. Số hóa là một lần thẩm định số học: sáu điểm chưa nhất quán được "chuẩn hóa có ghi chú", công khai và gọi đúng tên là kiến nghị.
7. Một bộ dữ liệu duy nhất cho mọi người đọc; dữ liệu mẫu là dữ liệu chính thống của bản demo.
:::

## Câu hỏi suy ngẫm và bài tập

1. Chọn một bộ tiêu chí thi đua mà đơn vị đồng chí đang dùng. Dùng Câu lệnh mẫu 11.2 để rà soát số học. Có bao nhiêu chỗ lệch? Chỗ nào thuộc thẩm quyền của đơn vị mình sửa, chỗ nào phải kiến nghị lên trên?
2. Vì sao "đạt kiểm thử" chưa có nghĩa là văn bản đã nhất quán? Hãy tìm một ví dụ trong công việc của đồng chí, nơi một quy tắc "kẹp cho khỏi vượt" che mất một sai sót.
3. Nếu bản ký ban hành chọn cách chia III.3 khác với phần mềm, những chỗ nào trong hệ thống phải sửa theo? Gợi ý: nghĩ đến tệp logic, phiếu Word, bảng Excel, bot chat và nhãn ghi chú trên giao diện.
4. Làm theo mục Thực hành ở 11.4.3 để có một trang tự chấm một tệp. Nhờ hai đồng nghiệp chấm cùng một phiếu giả định và so kết quả.
5. Với vai trò lãnh đạo, đồng chí sẽ đặt điều kiện gì trước khi cho phép dùng phần mềm này trong một đợt bình xét thật?
