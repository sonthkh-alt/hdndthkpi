# Chương 12. Cổng thông tin nhiều phân hệ: quản lý cán bộ, biểu quyết trực tuyến và các hệ thống liên kết

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu cách tổ chức một Trang chủ dạng cổng cho nhiều phân hệ: một danh mục khai báo dùng chung, đường dẫn chia sẻ được, chỉ tải phần cần dùng.
- Nắm nguyên tắc "một mối" cho danh sách cán bộ, và cách phân hệ Quản lý cán bộ (hồ sơ Mẫu 2C) nhắc việc nâng lương, nghỉ hưu, biên chế mà vẫn giữ kín dữ liệu cá nhân.
- Hiểu cách phân hệ Biểu quyết Online tính kết quả trên tổng số 82 đại biểu, cho bỏ phiếu không cần tài khoản mà không ai ghi đè được cả bảng kết quả.
- Biết khi nào nên gộp một ứng dụng vào hệ thống, khi nào chỉ nên gắn bằng liên kết.
- Rút ra hai nguyên tắc dữ liệu cho cả hệ thống: dữ liệu demo là dữ liệu chính thống; mỗi phân hệ một kho dữ liệu riêng.

Dành cho: cán bộ muốn tự làm một hệ thống nhiều phân hệ; người làm công tác tổ chức cán bộ, văn phòng; chuyên viên phục vụ kỳ họp; lãnh đạo Văn phòng cần quyết định phạm vi, quyền xem và điều kiện để dùng thật.
:::

Ba chương trước, mỗi chương đi sâu vào một phân hệ chấm điểm. Chương này lùi lại một bước để nhìn cả "trụ sở". Một hệ thống nhiều phân hệ cần một sảnh chung để người dùng tìm đúng cửa, một sổ nhân sự chung để các phòng không mỗi nơi giữ một danh sách, và quy ước chung về chỗ cất hồ sơ, ai được xem, ai được ghi.

Chất liệu của chương vẫn là hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, địa chỉ hdndthkpi.vercel.app. Mỗi mục có cách tôi giao việc cho AI, sự cố đã gặp, gợi ý tự làm phiên bản nhỏ và điều lãnh đạo cần quyết.

## 12.1. Trang chủ dạng cổng phân hệ và nguyên tắc "một mối"

### 12.1.1. Từ một ứng dụng chấm điểm đến một trụ sở nhiều phòng

Lúc đầu hệ thống chỉ làm một việc: chấm điểm cán bộ, công chức theo OKR/KPI. Tên trang web khi đó là "Đánh giá OKR/KPI". Khi phân hệ Tiêu chí HĐND ra đời, người dùng cần một chỗ để chọn vào đâu. Nhật ký dự án ghi việc dựng Trang chủ dạng cổng (portal) cùng đợt với phân hệ Tiêu chí HĐND.

Về sau, khi hệ thống đã có nhiều phân hệ, tôi đổi tên trang thành tên cơ quan: "Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa". Tên nghiệp vụ lùi xuống dòng phụ. Lý do được ghi rõ trong nhật ký: tên trang cũ là tên của một phân hệ, trong khi hệ thống đã thành nền tảng nhiều phân hệ.

Hãy hình dung Trang chủ như sảnh của một trụ sở: khách vừa vào cần thấy ngay bảng tin, sơ đồ các phòng, quầy hướng dẫn, số điện thoại liên hệ.

| Khu vực trên Trang chủ | Tương ứng ở trụ sở | Ghi chú |
|---|---|---|
| Bản tin pháp luật hằng ngày | Bảng tin ở sảnh | Tự sinh mỗi sáng (Chương 15) |
| Lưới thẻ phân hệ | Sơ đồ các phòng | Hai nhóm: nghiệp vụ, công cụ |
| Khung chat Người hướng dẫn | Quầy hướng dẫn | Kịch bản soạn sẵn và AI (Chương 13) |
| Liên hệ, bộ đếm lượt truy cập | Số điện thoại, sổ ghi khách | Mỗi phiên trình duyệt đếm một lần |

Thẻ đầu tiên là Biểu quyết Online, mang nhãn "Trung tâm". Nhóm nghiệp vụ còn có OKR/KPI, Kiểm điểm, Tiêu chí HĐND, Trợ lý AI, Sổ tay AI và ba hệ thống riêng: Giám sát số, Một dữ liệu, Lịch công tác tuần. Nhóm công cụ gồm Quản lý cán bộ, Hướng dẫn và hỗ trợ, Phòng thử nghiệm bộ tiêu chí. Đến ngày 25/10/2026, Trang chủ có 12 thẻ; ngày 26/10/2026 có thêm thẻ thứ 13 là Tủ sách.

### 12.1.2. Một danh mục khai báo, mọi nơi cùng đọc

Điều quan trọng nhất của một cổng nhiều phân hệ không nằm ở giao diện đẹp, mà ở chỗ mỗi phân hệ chỉ được khai báo ở đúng một nơi. Trong hệ thống của Văn phòng, nơi đó là tệp `src/lib/modules.js`. Mỗi mục ghi đường dẫn, tên, mô tả, thẻ nhãn, biểu tượng, tông màu và "đích mở". Đích mở có ba kiểu: ứng dụng chấm điểm dùng chung với một bộ tiêu chí (OKR/KPI, Kiểm điểm); phân hệ có mã riêng (Biểu quyết Online, Sổ tay AI); và "hệ thống ngoài" (external), chạy ở địa chỉ riêng với mã nguồn, cơ sở dữ liệu, tài khoản riêng.

Cứ hình dung tệp danh mục như cuốn sổ danh bạ các phòng đặt ở quầy lễ tân. Bộ định tuyến (tệp `src/Root.jsx`) là tổ lễ tân: đọc địa chỉ trên phiếu của khách, tra sổ, dẫn tới đúng phòng. Thêm một phòng chỉ cần ghi thêm một dòng vào sổ; sơ đồ ở sảnh tự vẽ lại từ chính cuốn sổ ấy.

Cách làm này đem lại năm lợi ích kiểm chứng được trong dự án:

1. **Thêm phân hệ chỉ khai một chỗ.** Thẻ Tủ sách ngày 26/10/2026 là ví dụ: một mục danh mục, một đường dẫn, một biểu tượng.
2. **Đường dẫn chia sẻ được.** Mỗi phân hệ có địa chỉ riêng dạng `#/bieuquyet`, `#/canbo`; gửi qua Zalo, đồng nghiệp bấm vào là tới thẳng. Thêm đuôi `?login=1` thì mở sẵn màn đăng nhập.
3. **Hướng dẫn không lệch thực tế.** Trang Hướng dẫn và hỗ trợ tự liệt kê phân hệ từ chính danh mục này.
4. **Quản trị ẩn, hiện được** thẻ của các bộ tiêu chí thử nghiệm; cấu hình lưu trên máy chủ nên áp dụng cho mọi người.
5. **Chỉ tải phần cần dùng.** Trang chủ chỉ tải khoảng 33 kB, trước khi tách là khoảng 180 kB; bấm vào thẻ nào mới tải mã phân hệ đó (lazy-load). Sảnh không cần chất sẵn hồ sơ của mọi phòng.

Các phân hệ ra đời ở những thời điểm khác nhau nên đầu trang từng mỗi nơi một kiểu. Sau một đợt "đồng bộ giao diện", các phân hệ dùng chung một bố cục: nút về Trang chủ, quốc huy, nhãn "Bản demo thử nghiệm", tên phân hệ, khu vực tài khoản.

### 12.1.3. Danh sách cán bộ về một mối

::: {.cauchuyen}
**Câu chuyện thực tế: một người, nhiều chỗ phải sửa**

Trước khi gộp, mỗi phân hệ chấm điểm tự giữ danh sách người của mình. Phân hệ OKR/KPI có 28 người: 25 cán bộ, công chức, người lao động các phòng và 3 lãnh đạo Văn phòng. Phân hệ Kiểm điểm có 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý. Thêm, sửa, xóa một người phải làm ở nhiều nơi; sót một nơi là các phân hệ "nói" những điều khác nhau về cùng một người.

Tôi quyết định gộp: hồ sơ Mẫu 2C ở phân hệ Quản lý cán bộ trở thành danh sách duy nhất. Các phân hệ chấm điểm chỉ đọc danh sách, không tự thêm, sửa, xóa người.
:::

Sau khi gộp, hệ thống có 40 hồ sơ, không phải 28 cộng 15. Ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ: hằng tháng chấm KPI với tư cách cán bộ Văn phòng, hằng quý kiểm điểm với tư cách cán bộ diện Ban Thường vụ Tỉnh ủy quản lý. Đây là phương án tôi chọn sau khi AI trình bày các cách làm. Vậy 28 + 15 − 3 = 40. Ai thuộc phân hệ nào được quyết định bằng thông tin trong hồ sơ, không bằng tay ở từng phân hệ:

| Câu hỏi | Cách hệ thống trả lời |
|---|---|
| Ai vào phân hệ Kiểm điểm? | Hồ sơ có trường "Diện quản lý cán bộ" là thuộc diện BTV Tỉnh ủy quản lý |
| Ai vào phân hệ OKR/KPI? | Hồ sơ có đơn vị là "Văn phòng" hoặc một phòng trực thuộc |
| Thêm người mới ở đâu? | Chỉ ở phân hệ Quản lý cán bộ |
| Người nghỉ, chuyển công tác? | Hồ sơ giữ lại, gắn cờ "ngoài danh sách", không xóa |
| Đổi chức vụ thì điểm đã chấm ra sao? | Giữ nguyên; chỉ đồng bộ họ tên, chức vụ, đơn vị, email |

Trong hai phân hệ chấm điểm, các nút thêm, xóa, nạp lại danh sách cán bộ bị ẩn; ô họ tên, đơn vị, chức vụ, email chuyển sang chỉ đọc, kèm nút mở thẳng phân hệ Quản lý cán bộ. Riêng ô vai trò vẫn sửa được, vì đó là quyền dùng phần mềm chứ không phải thông tin hồ sơ. Phải phân biệt rõ dữ liệu về con người (thuộc hồ sơ) với dữ liệu về quyền truy cập (thuộc phần mềm).

Có một điểm tinh tế. Hồ sơ 2C chỉ Quản trị đọc được (mục 12.2.4), vậy cán bộ thường lấy danh sách từ đâu? Khi Quản trị mở phân hệ, danh sách từ hồ sơ 2C được áp vào kỳ đánh giá và lưu cùng bản ghi của kỳ. Bản ghi kỳ chỉ chứa thông tin công tác (họ tên, chức vụ, đơn vị, email công vụ) và điểm, không chứa ngày sinh, số định danh hay quan hệ gia đình. Người khác đọc bản ghi kỳ, không chạm vào hồ sơ gốc.

Gộp về một mối cũng làm lộ lỗi trùng họ tên khiến phân hệ OKR/KPI còn 27 người (Chương 9, mục 9.5.4). Danh sách "một mối" chỉ an toàn khi cách nhận dạng một người cũng chặt: bằng email, hoặc họ tên kèm đơn vị, không bao giờ bằng họ tên đơn thuần.

::: {.lenhmau}
**Câu lệnh mẫu 12.1 — Gộp danh sách người về một mối**

```text
Vai: Đồng chí là tác tử AI lập trình đang làm việc trong kho mã của tôi.
Bối cảnh: Hệ thống có [số] phân hệ, mỗi phân hệ đang giữ danh sách
cán bộ riêng: [liệt kê phân hệ và số người]. Tôi muốn phân hệ
[tên phân hệ hồ sơ] là danh sách DUY NHẤT.
Việc:
1. Trình phương án trước, chưa sửa mã: các phân hệ khác đọc danh sách
   thế nào; trường nào quyết định ai thuộc phân hệ nào; người có mặt
   ở nhiều phân hệ xử lý ra sao.
2. Nêu rõ cách nhận dạng một người (mã, email, họ tên kèm đơn vị).
   KHÔNG dùng họ tên đơn thuần; liệt kê cho tôi mọi trường hợp trùng.
Ràng buộc: giữ nguyên toàn bộ điểm đã chấm; người rời danh sách thì
gắn cờ, không xóa; không đụng phân quyền hiện có.
Nghiệm thu: đếm số người trước và sau khi gộp ở từng phân hệ; phép
kiểm cho ca trùng họ tên; thử vai khách và vai quản trị; báo cáo các
chỗ khác đang đọc danh sách (xuất Word, bot chat) đã kiểm chưa.
```
:::

Xin nhấn mạnh: một mối không có nghĩa là một bảng to chứa mọi thứ. Một mối nghĩa là mỗi loại thông tin chỉ có một nơi được sửa; nơi khác chỉ đọc, và đọc đúng phần mình cần.

## 12.2. Quản lý cán bộ: hồ sơ Mẫu 2C, nhắc việc, biên chế và danh bạ

### 12.2.1. Hồ sơ Mẫu 2C trên màn hình

Phân hệ Quản lý cán bộ (`#/canbo`) chỉ mở cho Quản trị. Hồ sơ bám các mục của mẫu Sơ yếu lý lịch quen gọi là Mẫu 2C (phần mềm ghi ký hiệu 2C/TCTW-98): 37 mục cùng ba bảng đào tạo, quá trình công tác, quan hệ gia đình. Mỗi hồ sơ thuộc một trong bốn loại: ĐBQH chuyên trách, đại biểu HĐND tỉnh chuyên trách, công chức Văn phòng, hợp đồng lao động.

Màn hình chia năm khu vực: Nhắc việc, Hồ sơ cán bộ, Nhiệm vụ có hạn, Biên chế, Danh bạ điện thoại. Hồ sơ mở ra dạng ngăn trượt bảy thẻ, có thước đo "% hoàn thiện" tính trên 12 trường cốt lõi kèm danh sách mục còn thiếu, và nút xuất Sơ yếu lý lịch ra Word đúng bố cục mẫu.

Ban đầu, phân hệ được nạp sẵn 40 hồ sơ mô phỏng: tên, chức vụ, đơn vị là thật, còn ngày sinh, ngạch bậc do máy sinh, có nhãn cảnh báo. Sau đó tôi bỏ hẳn bộ mô phỏng, chuyển sang đồng bộ từ danh sách cán bộ của hệ thống: người mới có hồ sơ khung, người đã có giữ nguyên thông tin 2C đã khai. Nhìn lại, dữ liệu nhân sự mô phỏng có cái hại riêng: ngày sinh giả sinh ra nhắc việc nghỉ hưu giả, mà người xem rất dễ tin một dòng nhắc hiện trên màn hình. Với dữ liệu dẫn tới quyết định về con người, hồ sơ trống an toàn hơn hồ sơ "trông như thật".

### 12.2.2. Nhắc việc: bảy loại mốc, ba mức khẩn

Người làm tổ chức cán bộ nào cũng từng lo sót hạn nâng lương hay không kịp chuẩn bị thủ tục nghỉ hưu. Phần mềm gom bảy loại mốc về một danh sách, xếp theo mức khẩn.

| Loại mốc | Phần mềm tính từ | Báo trước (mặc định) |
|---|---|---|
| Nâng bậc lương, vượt khung | Ngày hưởng bậc, chu kỳ theo loại ngạch | 90 ngày |
| Nghỉ hưu | Ngày sinh, giới tính, lộ trình tuổi | 180 ngày |
| Sinh nhật | Ngày sinh | 15 ngày |
| Hết hạn hợp đồng | Ngày hết hạn hợp đồng | 60 ngày |
| Hết thời hạn giữ chức vụ | Ngày bổ nhiệm và thời hạn | 90 ngày |
| Nhiệm vụ định kỳ | Một lần, hằng tháng, quý, năm | 15 ngày |
| Biên chế | Chỉ tiêu giao so với số thực có | Khi lệch |

Mỗi nhắc việc mang một trong ba mức: quá hạn; cần xử lý sớm (còn không quá một phần ba thời gian báo trước, như còn 60 ngày với mốc nghỉ hưu); sắp đến hạn. Quản trị chỉnh được các ngưỡng báo trước.

Về nâng bậc lương, phần mềm mã hóa chu kỳ 36 tháng với ngạch loại A1 đến A3, 24 tháng với các ngạch thấp hơn; đến bậc cuối thì chuyển sang phụ cấp thâm niên vượt khung 5%, sau đó mỗi năm thêm 1%. Văn bản quy định chế độ này chưa nằm trong danh mục pháp lý đã đối chiếu của sách nên tôi không nêu số hiệu; ai tự làm công cụ tương tự cần tra lại văn bản hiện hành.

::: {.phaply}
**Căn cứ pháp lý**

Nghị định số 135/2020/NĐ-CP ngày 18/11/2020 của Chính phủ quy định về tuổi nghỉ hưu, có hiệu lực từ 01/01/2021:

- Khoản 1 Điều 4 (kèm Phụ lục I): từ năm 2021, tuổi nghỉ hưu trong điều kiện lao động bình thường là đủ 60 tuổi 03 tháng với nam, đủ 55 tuổi 04 tháng với nữ; sau đó mỗi năm tăng thêm 03 tháng với nam cho đến đủ 62 tuổi vào năm 2028, tăng thêm 04 tháng với nữ cho đến đủ 60 tuổi vào năm 2035. Theo lộ trình này, năm 2026 là 61 tuổi 06 tháng với nam và 57 tuổi với nữ.
- Khoản 1 Điều 3: thời điểm nghỉ hưu là kết thúc ngày cuối cùng của tháng đủ tuổi nghỉ hưu.
- Điều 3 còn quy định: hồ sơ chỉ có năm sinh, không có ngày tháng sinh, thì lấy ngày 01/01 của năm sinh làm căn cứ.

Một số nguồn ghi nghị định này đã hết hiệu lực một phần ở nội dung về thời điểm hưởng chế độ hưu trí. Phần mềm chỉ dùng các quy định nêu trên để nhắc việc. Trước khi áp dụng, cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

::: {.vidu}
**Ví dụ minh họa: ba hồ sơ giả định**

- Một đồng chí nam sinh ngày 15/4/1965. Năm 2026, tuổi nghỉ hưu của nam là 61 tuổi 06 tháng; đồng chí đủ tuổi ngày 15/10/2026. Thời điểm nghỉ hưu là hết ngày 31/10/2026.
- Một đồng chí nữ sinh ngày 20/8/1969. Năm 2026, tuổi nghỉ hưu của nữ là 57 tuổi; đồng chí đủ tuổi ngày 20/8/2026. Thời điểm nghỉ hưu là hết ngày 31/8/2026.
- Một đồng chí nam sinh ngày 10/01/1967. Đến năm 2028, tuổi nghỉ hưu của nam đã chạm trần 62 tuổi. Đồng chí đủ 62 tuổi ngày 10/01/2029, nên thời điểm nghỉ hưu là hết ngày 31/01/2029.

Ba kết quả này đã được chạy thử bằng chính hàm tính của phần mềm. Nghiệm thu đúng là lấy vài ca biết trước đáp án, có cả ca rơi đúng năm lộ trình chạm trần, rồi so.
:::

Phần mềm chỉ nhắc, không quyết định, đúng nguyên tắc máy đề xuất – người quyết định. Quyết định nghỉ hưu, nâng bậc lương do cơ quan có thẩm quyền ban hành; nhắc việc không thay cho rà soát hồ sơ gốc.

### 12.2.3. Biên chế và nhiệm vụ có hạn

Khu vực Biên chế so số người thực có của từng loại đối tượng với chỉ tiêu được giao. Khu vực Nhiệm vụ có hạn ghi việc lặp lại theo chu kỳ, như báo cáo hằng quý; phần mềm tự tính hạn kế tiếp và đưa vào nhắc việc. Gom về một chỗ, Quản trị mở một màn hình là thấy hết việc nhân sự trong tháng.

### 12.2.4. Chỉ Quản trị được xem, và vì sao ẩn thẻ chưa đủ

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026, phân dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm.
- Nghị định số 356/2025/NĐ-CP quy định chi tiết Luật này, có hiệu lực từ 01/01/2026; Nghị định 13/2023/NĐ-CP mà Tập 1 dẫn đã hết hiệu lực từ cùng ngày. Theo Điều 3, ngày sinh, giới tính, quê quán, số điện thoại, số định danh cá nhân, tình trạng hôn nhân, quan hệ gia đình là dữ liệu cá nhân cơ bản. Theo khoản 1 Điều 4, tôn giáo, tình trạng sức khỏe là dữ liệu cá nhân nhạy cảm.
:::

Hồ sơ 2C có gần như đủ các loại dữ liệu nói trên, kể cả hai trường tôn giáo và sức khỏe thuộc nhóm nhạy cảm. Theo phân loại dữ liệu 4 cấp của Tập 1 (mục 7.1–7.2), hồ sơ này thuộc Cấp 3 — Hạn chế tiếp cận; hồ sơ nào có nội dung thuộc bí mật nhà nước thì là Cấp 4 và không bao giờ được đưa vào một hệ thống thử nghiệm trên đám mây. Khi phân vân, chọn cấp cao hơn.

Ban đầu, thẻ Quản lý cán bộ chỉ hiện với Quản trị, nhưng chính sách phân quyền cũ ở cơ sở dữ liệu cho mọi tài khoản đã đăng nhập đọc mọi dòng. Người dùng thường biết gọi thẳng vào cửa giao dịch (API) vẫn đọc được hồ sơ. Ẩn thẻ chỉ là gỡ tấm biển "Phòng lưu trữ", cửa vẫn mở.

Bẫy kỹ thuật đáng nhớ: các quy tắc phân quyền theo dòng cộng dồn theo kiểu "hoặc", thêm quy tắc chặt không làm quy tắc lỏng cũ hết tác dụng, như dán thêm tờ "Cấm vào" khi tờ "Mời vào tự do" vẫn treo. Vì vậy bước thứ tư trong tệp lược đồ cơ sở dữ liệu phải sửa chính quy tắc chung để loại riêng dòng hồ sơ cán bộ, rồi mới thêm quy tắc chỉ cho hai email Quản trị đọc, ghi dòng đó, kèm cảnh báo: chưa chạy bước này thì hồ sơ không được bảo vệ.

Bot chat (Chương 14) chỉ nạp nhắc việc nhân sự khi người hỏi là Quản trị, và kể cả khi đó cũng không đưa số định danh, số bảo hiểm xã hội, quan hệ gia đình vào nội dung gửi cho AI. Lời dặn "đừng nói ra" không chắc bằng việc không đưa vào.

### 12.2.5. Danh bạ điện thoại: số thật không bao giờ vào kho mã

::: {.cauchuyen}
**Câu chuyện thực tế: tệp danh bạ và kho mã công khai**

Tôi có tệp danh bạ gồm 82 đại biểu HĐND tỉnh và 29 cán bộ các Ban, Văn phòng, toàn số thật. Cách nhanh nhất để bot tra được số là nhúng danh bạ vào mã nguồn. Nhưng kho mã ở chế độ công khai, mã chạy trên trình duyệt ai cũng xem được; nhúng vào là dán danh bạ nội bộ lên bảng tin ngoài cổng.

Cách làm được chọn: phần mềm chỉ có **bộ đọc** danh bạ, không chứa số điện thoại nào. Quản trị bấm "Nhập từ tệp" (Word, PDF hoặc văn bản thuần); phần mềm trích chữ, nhận dạng từng dòng "số thứ tự, họ tên, chức vụ, số điện thoại", rồi lưu vào hồ sơ cán bộ trên máy chủ, nơi chỉ Quản trị đọc được. Tệp `.gitignore` chặn tệp danh bạ trong thư mục tài liệu; một phép kiểm khẳng định "không có số điện thoại nào trong mã nguồn". Thử trên tệp thật, bộ đọc nhận đủ 111 trên 111 mục.

Rồi có lỗi: báo lưu thành công, tải lại trang thì danh bạ trống. Hàm chuẩn hóa hồ sơ là một "danh sách trắng", chỉ giữ các trường đã khai tên; trường danh bạ mới chưa được khai nên bị gọt mất. Sửa xong, dữ liệu đã mất không cứu được; Quản trị phải nhập lại một lần.
:::

Tôi giữ hai thói quen từ chuyện này: trước khi đặt tệp nào vào thư mục dự án, hỏi "tệp này lên mặt báo thì sao?"; và thử chức năng lưu bằng "lưu, tải lại trang, còn không?", không phải nhìn dòng chữ "đã lưu".

::: {.lenhmau}
**Câu lệnh mẫu 12.2 — Rà soát kho mã tìm dữ liệu cá nhân trước khi công khai**

```text
Vai: Đồng chí là người rà soát an toàn dữ liệu cho kho mã này.
Bối cảnh: Kho mã sẽ (hoặc đang) ở chế độ công khai trên GitHub.
Việc: Quét toàn bộ kho mã và lịch sử commit, tìm mọi thứ có thể là
dữ liệu cá nhân hoặc bí mật: số điện thoại, số định danh, số bảo hiểm,
ngày sinh gắn với họ tên, địa chỉ email cá nhân, mật khẩu, khóa bí mật,
tệp hồ sơ, danh bạ, bảng điểm cá nhân.
Dạng: bảng "tệp – dòng – loại dữ liệu – mức nguy cơ – đề xuất xử lý".
Ràng buộc: CHỈ báo cáo, chưa sửa, chưa xóa gì. Không in nguyên văn
dữ liệu tìm thấy, chỉ ghi 3 ký tự đầu rồi che phần còn lại.
Nghiệm thu: đề xuất thêm dòng nào vào .gitignore; đề xuất một phép
kiểm tự động để lần sau tự phát hiện; nêu rõ dữ liệu nào đã lọt vào
lịch sử commit (xóa tệp hiện tại không xóa được lịch sử).
```
:::

### 12.2.6. Phiên bản nhỏ: sổ nhắc mốc nhân sự trên bảng tính

Với một phòng vài chục người, một bảng tính có công thức do AI viết là đủ, và an toàn hơn vì dữ liệu nằm trên máy của cơ quan.

::: {.thuchanh}
**Thực hành: lập sổ nhắc mốc nhân sự trong một buổi**

1. Tạo các cột: Mã cán bộ, Giới tính, Ngày sinh, Ngạch, Bậc, Ngày hưởng bậc, Ngày hết hạn hợp đồng.
2. Dùng Câu lệnh mẫu 12.3 nhờ AI viết công thức. Chỉ mô tả cấu trúc cột, không dán dữ liệu thật của cán bộ vào AI công cộng: ngày sinh, giới tính gắn với một người là dữ liệu cá nhân, thuộc Cấp 3 — Hạn chế tiếp cận trong phân loại dữ liệu 4 cấp của Tập 1 (mục 7.1–7.2), chỉ được xử lý bằng AI có máy chủ tại Việt Nam hoặc AI tự triển khai nội bộ.
3. Nhập vài dòng giả định có đáp án biết trước, như ba ca ở mục 12.2.2, và so kết quả.
4. Tô màu có điều kiện: đỏ khi quá hạn, vàng khi sắp tới hạn.
5. Công thức đúng hết các ca thử mới nhập dữ liệu thật trên máy của cơ quan, đặt mật khẩu cho tệp.
:::

::: {.lenhmau}
**Câu lệnh mẫu 12.3 — Công thức tính ngày nghỉ hưu và hạn nâng lương**

```text
Tôi dùng [Excel/Google Sheets] tiếng Việt. Bảng có các cột:
B = Giới tính ("Nam"/"Nữ"), C = Ngày sinh (dd/mm/yyyy),
F = Ngày hưởng bậc hiện tại, G = Chu kỳ nâng bậc (36 hoặc 24 tháng).
Hãy viết công thức cho:
1. Cột H "Ngày nghỉ hưu" theo lộ trình: nam từ 60 tuổi 3 tháng (năm
   2021), mỗi năm +3 tháng, tối đa 62 tuổi; nữ từ 55 tuổi 4 tháng
   (năm 2021), mỗi năm +4 tháng, tối đa 60 tuổi. Mức tuổi áp dụng theo
   NĂM người đó đủ tuổi. Thời điểm nghỉ là ngày cuối của tháng đủ tuổi.
2. Cột I "Hạn nâng bậc" = F + G tháng.
3. Cột J "Còn (ngày)" = mốc gần nhất trừ ngày hôm nay.
Giải thích từng công thức bằng lời. Rồi tự kiểm với các ca:
nam 15/04/1965 → 31/10/2026; nữ 20/08/1969 → 31/08/2026;
nam 10/01/1967 → 31/01/2029. Ca nào lệch thì sửa đến khi khớp.
Không cần và không được hỏi dữ liệu thật của cán bộ.
```
:::

## 12.3. Biểu quyết trực tuyến 82 đại biểu

### 12.3.1. Bài toán và căn cứ

Phân hệ Biểu quyết Online (`#/bieuquyet`) mô phỏng việc biểu quyết của 82 đại biểu HĐND tỉnh nhiệm kỳ 2026–2031: đại biểu bấm một trong ba nút, hệ thống kiểm phiếu ngay, hiện bảng điện tử và đối chiếu điều kiện thông qua. Đây là bản demo phục vụ trình diễn, tập huấn, không thay hệ thống biểu quyết chính thức của kỳ họp.

::: {.phaply}
**Căn cứ pháp lý**

Luật Tổ chức chính quyền địa phương số 72/2025/QH15, Quốc hội thông qua ngày 16/6/2025, có hiệu lực từ 16/6/2025: nghị quyết của HĐND được thông qua khi quá nửa **tổng số** đại biểu HĐND biểu quyết tán thành. Mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm. Với 82 đại biểu, quá nửa là từ 42/82 trở lên.

Phần mềm có thêm ngưỡng "ít nhất hai phần ba tổng số đại biểu" (từ 55/82, vì 82 × 2/3 = 54,67, làm tròn lên), chỉ dùng cho nội dung luật quy định rõ. Sách chưa đối chiếu được điều khoản cụ thể về các trường hợp này, nên phải tra nguyên văn trước khi đặt ngưỡng. Cũng đừng nhầm ngưỡng biểu quyết với điều kiện về số đại biểu tham dự để tiến hành kỳ họp. Trước khi áp dụng, cần tra lại tình trạng hiệu lực và văn bản sửa đổi, bổ sung (nếu có) trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

### 12.3.2. Ba nút, một lá phiếu, mẫu số là 82

Người dùng chọn "Kỳ họp thứ …", chọn nghị quyết trong hộp chọn (nội dung đã đóng bị làm mờ, không chọn được), rồi bấm một trong ba nút lớn: Đồng ý, Không đồng ý, Có ý kiến khác. Kỳ họp có từ hai nghị quyết đang mở thì có thêm khối "Biểu quyết một lần": lá phiếu vẫn ghi cho từng nghị quyết, sau đó đổi riêng được. Mỗi đại biểu một lá phiếu cho một nội dung; bấm lại là đổi, khi phiên còn mở.

Kết quả hiện bốn thẻ số liệu (Đồng ý, Không đồng ý, Có ý kiến khác, Chưa biểu quyết), thanh tỷ lệ có vạch ngưỡng thông qua, bảng điện tử 82 ô, câu kết luận nói rõ còn thiếu bao nhiêu phiếu, và nút xuất biên bản ra Word.

::: {.vidu}
**Ví dụ minh họa: vì sao mẫu số phải là 82**

Giả sử mới có 60 đại biểu bấm nút, trong đó 40 người chọn Đồng ý. Nếu tính trên số người đã bấm, tỷ lệ tán thành là 66,7%, nghe như đã thông qua. Tính đúng trên tổng số đại biểu thì chỉ 40/82, tức 48,8%, chưa đạt 42/82. Phần mềm sẽ ghi: "Hiện có 40/82 đại biểu tán thành, còn thiếu 2 phiếu".

Hai trường hợp sát ngưỡng cũng phải thử: 41/82 là chưa thông qua, thiếu 1 phiếu; 42/82 là đủ. Với ngưỡng hai phần ba, 54/82 chưa đủ, 55/82 mới đủ.
:::

Hai ngưỡng được viết thành công thức một dòng, chạy được và kiểm thử được bằng Node:

```js
const quaNua = (tong) => Math.floor(tong / 2) + 1;      // 82 → 42
const haiPhanBa = (tong) => Math.ceil((tong * 2) / 3);  // 82 → 55
```

Toàn bộ phần tính toán nằm trong một tệp logic "thuần", không dính giao diện, không gọi mạng. Bộ kiểm thử của phân hệ có 90 phép kiểm, viết bằng ngôn ngữ nghiệp vụ như "41/82 thì thiếu 1 phiếu", "đổi lá phiếu không làm tăng số lượt". Người không đọc được mã vẫn đọc được chúng như đọc tiêu chí nghiệm thu.

### 12.3.3. Đánh số đại biểu, không gắn tên người thật

Đại biểu mang mã từ DB01 đến DB82, hiển thị là "Đại biểu số 01" đến "Đại biểu số 82", chia 10 tổ cho dễ theo dõi, không có họ tên người thật nào. Lý do ghi ngay đầu tệp logic: bản demo không được gán lá phiếu cho cá nhân cụ thể. Một bảng điện tử có tên thật cạnh lá phiếu "Không đồng ý", dù là mô phỏng, vẫn có thể bị chụp lại và hiểu sai.

Cũng phải nói thẳng một giới hạn: ở bản demo, người dùng tự chọn mã đại biểu trong một hộp chọn, hệ thống không xác thực ai là ai. Đủ cho tập huấn, hoàn toàn không đủ cho biểu quyết thật.

### 12.3.4. Bỏ phiếu không cần tài khoản qua "khe thùng phiếu"

Muốn bỏ phiếu không cần đăng nhập thì phải cho người chưa đăng nhập ghi dữ liệu; nhưng mở quyền ghi chung thì ai cũng ghi đè được cả bảng kết quả. Lời giải là một hàm trên máy chủ tên `bq_vote`, làm đúng một việc: sửa **một** lá phiếu của **một** đại biểu trong **một** phiên, từ chối lựa chọn lạ, mã sai dạng, phiên đã khóa. Không giao chìa khóa kho cho khách, chỉ khoét một khe trên thùng phiếu. Kết quả thì ai cũng xem được nhờ quyền đọc công khai riêng cho dòng dữ liệu biểu quyết.

::: {.cauchuyen}
**Câu chuyện thực tế: mỗi máy một kết quả**

Trước khi có hàm `bq_vote`, lá phiếu chỉ nằm trên máy đang bấm, mỗi máy một kết quả. Có hàm rồi vẫn còn lỗ hổng, phát hiện trong đợt rà soát đồng bộ toàn hệ thống: bộ phiên mẫu chỉ được dựng trên từng trình duyệt, máy chủ chưa hề có dòng dữ liệu biểu quyết. Khách bấm nút, hàm trên máy chủ không tìm thấy phiên để ghi, lá phiếu lại rơi về máy cục bộ.

Cách sửa theo đúng nguyên tắc "dữ liệu mẫu là dữ liệu chính thống" (mục 12.5): người đăng nhập đầu tiên mở phân hệ sẽ tự ghi bộ mẫu lên máy chủ, từ đó mọi máy bỏ phiếu vào cùng một kết quả. Thông báo lỗi được viết lại để phân biệt "máy chủ chưa có dữ liệu phiên" với "chưa bật hàm bỏ phiếu dùng chung".
:::

Mẫu "mở quyền đọc, chỉ cho ghi qua một hàm hẹp có kiểm tra" được dùng lại ba lần trong hệ thống: bộ đếm lượt truy cập chỉ cộng thêm 1; mỗi đơn vị HĐND chỉ ghi đúng phiếu tiêu chí của mình (Chương 11); đại biểu ghi đúng lá phiếu của mình.

### 12.3.5. Phiếu mô phỏng có "hạt giống" và nhãn mô phỏng

Để bản demo có sẵn bảng điện tử mà xem, phần lớn ô được điền phiếu mô phỏng bằng bộ sinh số có "hạt giống" lấy từ mã phiên. Cùng hạt giống thì cùng dãy số, nên mọi máy thấy cùng một bảng điện tử. Phiếu người thật bấm luôn đè lên phiếu mô phỏng của cùng mã và được đếm riêng thành "số phiếu thật".

Bộ mẫu gồm 3 kỳ họp, 9 nghị quyết: kỳ họp thứ 5 đang mở 4 nghị quyết, kỳ thứ 4 và thứ 3 đã xong. Tôi cố ý để một nghị quyết của kỳ thứ 3 chỉ khoảng 45% tán thành, để có cả trường hợp không được thông qua. Bot chat được dặn luôn kèm lời nhắc "dữ liệu mô phỏng". Như buổi diễn tập phòng cháy: khói có thể giả, nhưng biển "DIỄN TẬP" phải treo thật to.

::: {.lenhmau}
**Câu lệnh mẫu 12.4 — Dựng phần kiểm phiếu đúng luật và kiểm thử được**

```text
Vai: Đồng chí là tác tử AI lập trình.
Bối cảnh: Tôi cần một công cụ mô phỏng biểu quyết cho [số] đại biểu,
dùng để tập huấn. Căn cứ: nghị quyết thông qua khi quá nửa TỔNG SỐ
đại biểu tán thành; một số nội dung do luật quy định cần ít nhất hai
phần ba tổng số đại biểu.
Việc: viết một tệp logic thuần (không giao diện, không gọi mạng) gồm:
ghi phiếu (mỗi mã một lá, bấm lại là đổi, phiên đóng thì không ghi),
kiểm phiếu trên TỔNG SỐ đại biểu, câu kết luận nêu còn thiếu bao nhiêu
phiếu, nội dung biên bản.
Ràng buộc: đại biểu chỉ mang mã đánh số, không có họ tên; phiếu mô
phỏng (nếu có) dùng bộ sinh số có hạt giống và đếm tách riêng phiếu thật.
Nghiệm thu: viết phép kiểm bằng lời nghiệp vụ cho các ca 41/82, 42/82,
54/82, 55/82; 60 người bấm 40 đồng ý vẫn chưa thông qua; lựa chọn lạ
không được ghi. Chạy và báo kết quả từng phép kiểm.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Bản demo đúng luật ở phần tính toán, nhưng không xác thực đại biểu và chạy trên hạ tầng miễn phí; không dùng cho biểu quyết thật.
- Muốn tiến tới dùng thật, tối thiểu phải có: xác thực danh tính từng đại biểu, nhật ký không sửa được, quy chế làm việc của HĐND cho phép hình thức này, hạ tầng của cơ quan nhà nước và hồ sơ an ninh mạng tương ứng.
- Giá trị trước mắt của phân hệ là tập huấn, diễn tập và minh họa cách tính đúng (mẫu số là tổng số đại biểu), không phải thay thế hệ thống chính thức.
:::

## 12.4. Gắn các hệ thống riêng bằng liên kết thay vì gộp mã

### 12.4.1. Ba hệ thống, ba công nghệ

Ngoài hệ thống chính, tôi còn tự làm một số ứng dụng độc lập. Ba trong số đó được gắn vào Trang chủ bằng liên kết.

| Hệ thống | Công nghệ, dữ liệu | Nghiệp vụ chính |
|---|---|---|
| Quản lý lịch công tác tuần | Cơ sở dữ liệu riêng, tài khoản riêng | Nhập lịch tuần sau, lãnh đạo duyệt, điều xe, in lịch |
| Giám sát số Thanh Hóa | Tệp dữ liệu tĩnh, tài khoản riêng | 12 nhóm nghiệp vụ giám sát, nghị quyết cấp xã |
| Một dữ liệu – Không báo cáo lại | Máy chủ miễn phí, có lúc "ngủ" | Số liệu vào kho một lần, dữ liệu mở |

Giám sát số bám Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026), trọng tâm là giám sát nghị quyết của HĐND 166 xã, phường: máy rà dấu hiệu, chấm rủi ro, trình danh mục; Thường trực HĐND tỉnh quyết định. Một dữ liệu theo chủ trương số liệu chỉ vào kho một lần, đã có thì không yêu cầu báo cáo lại. Số liệu ở cả hai là mô phỏng.

Gộp cả ba vào một kho mã đồng nghĩa với thống nhất ngôn ngữ lập trình, cơ sở dữ liệu, hệ tài khoản: tốn công, dễ vỡ, mà người dùng không được thêm gì đáng kể.

### 12.4.2. Liên kết sao cho tử tế

Gắn bằng liên kết không phải dán một đường dẫn trơ trọi. Thẻ hệ thống ngoài là liên kết thật, mở thẻ trình duyệt mới một cách an toàn; mô tả ghi rõ "Hệ thống riêng". Thẻ Một dữ liệu nói trước: lần mở đầu có thể chậm 30 đến 60 giây do máy chủ miễn phí "ngủ". Đường dẫn dạng `#/lichcongtac` vẫn chia sẻ được; mở ra là một màn chuyển tiếp ngắn, có liên kết bấm tay phòng khi trình duyệt chặn, và nút về Trang chủ. Trang Hướng dẫn ghi rõ "tài khoản đăng nhập riêng" để người dùng không ngạc nhiên.

### 12.4.3. Đọc dữ liệu qua "cửa chỉ đọc"

Liên kết giải quyết chuyện đi lại của người; còn bot chat cần số liệu thì đi qua cửa **chỉ đọc**. Lịch công tác đọc qua cặp địa chỉ và khóa riêng, chỉ lấy hai tuần. Lưu ý: khóa này có quyền cao ở hệ thống bên kia; bot chỉ đọc là do mã được viết như vậy, nên khóa phải nằm kín ở máy chủ. Giám sát số đọc các tệp dữ liệu công khai; kiến nghị cử tri ở đó vốn được thiết kế không lưu họ tên, điện thoại, địa chỉ. Một dữ liệu đọc qua cửa dữ liệu mở, trần chờ 7 giây; quá giờ thì bot nói thật là chưa lấy được, không đoán số (Chương 14).

Một chi tiết trung thực của chính dự án: đến thời điểm viết sách, tệp mô tả kiến trúc trong bộ nhớ dự án vẫn còn câu ghi rằng bot chat không đọc được dữ liệu lịch, trong khi mục bot chat của cùng tệp đã mô tả việc đọc lịch. Mã đổi, tài liệu cho AI chưa đổi theo; đó là lý do quy tắc rà soát ở Chương 7 đòi cập nhật tài liệu cùng lúc với mã.

### 12.4.4. Khi nào tích hợp, khi nào liên kết

Không có công thức cứng, nhưng có mấy câu hỏi giúp quyết định. Các cơ quan phối hợp qua công văn và cổng thông tin, không cần sáp nhập trụ sở mới làm việc chung được.

| Câu hỏi | Nghiêng về gộp | Nghiêng về liên kết |
|---|---|---|
| Cần dùng chung đăng nhập, phân quyền? | Có | Không |
| Cần cùng ghi vào một dữ liệu? | Có | Chỉ cần đọc |
| Cùng công nghệ, cùng người duy trì? | Có | Khác nhau |
| Người dùng chính có trùng nhau? | Trùng nhiều | Khác nhau |

Phân hệ Trợ lý AI là ví dụ của phía "gộp". Nó vốn là một ứng dụng Python riêng, nhưng cần dùng chung đăng nhập và chức năng xuất Word của hệ thống, nên được chuyển hẳn sang cùng công nghệ (Chương 13). Ba hệ thống trên là ví dụ của phía "liên kết".

## 12.5. Bài học: dữ liệu demo là dữ liệu chính thống; mỗi phân hệ một kho dữ liệu riêng

### 12.5.1. Một nguồn sự thật cho mọi vai

Chương 9 đã kể sự cố tài khoản khách và tài khoản quản trị thấy hai danh sách cán bộ khác nhau, vì khách không đọc được máy chủ nên phần mềm tự dựng danh sách mẫu tại chỗ. Ở quy mô cổng nhiều phân hệ, bài học đó thành nguyên tắc chung trong bộ nhớ dự án: dữ liệu mẫu không phải "dữ liệu tạm cho khách" mà là dữ liệu chuẩn của bản demo. Khách và người đăng nhập đọc cùng một nguồn, chỉ khác ở quyền ghi; cấm thêm nhánh "khách thì dựng dữ liệu riêng tại chỗ".

Nguyên tắc ấy được áp đồng loạt: bảng điểm các kỳ, phiếu tiêu chí HĐND, phiên biểu quyết, sổ tay AI đều có quyền đọc công khai riêng; Tiêu chí HĐND bỏ hẳn nút gạt "dữ liệu mẫu / dữ liệu thật" (Chương 11); Biểu quyết tự ghi bộ mẫu lên máy chủ (mục 12.3.4). Đi kèm là kỷ luật: mở cho demo thì phải sẵn cách đóng khi dùng thật. Ngay trong chú thích của bước mở quyền đọc, tệp lược đồ cơ sở dữ liệu ghi sẵn câu lệnh gỡ quyền đó.

### 12.5.2. Mỗi phân hệ một tủ hồ sơ

Chương 10 đã kể sự cố hai phân hệ dùng chung một "bìa hồ sơ" đặt tên theo năm và tháng: Quý III của Kiểm điểm trùng tên với kỳ tháng 9 của OKR/KPI, ai mở sau ghi đè người trước. Cách sửa là thêm tiền tố riêng cho từng phân hệ, riêng OKR/KPI giữ tên cũ để không mất dữ liệu. Tài liệu kiến trúc ghi một câu bắt buộc: phân hệ mới dùng ứng dụng chấm điểm chung phải có tiền tố riêng.

Nhìn cả hệ thống, toàn bộ dữ liệu nằm trong một bảng duy nhất, mỗi dòng là một "tủ hồ sơ" có nhãn. Điều quyết định không phải số tủ, mà là mỗi tủ có một trong ba kiểu cửa.

| Kiểu cửa | Ví dụ trong hệ thống | Vì sao |
|---|---|---|
| Chỉ Quản trị đọc, ghi | Hồ sơ cán bộ, danh bạ | Dữ liệu cá nhân cơ bản và nhạy cảm |
| Chỉ người đăng nhập đọc, ghi | Kiến nghị cử tri của Trợ lý AI | Có tên người dân; cố ý không mở công khai |
| Ai cũng đọc; ghi qua hàm hẹp | Phiếu tiêu chí, lá phiếu, bộ đếm | Người không có tài khoản vẫn dùng được |

Ba kiểu cửa này chính là cách phân loại dữ liệu 4 cấp của Tập 1 (mục 7.1–7.2) được "đúc" vào phần mềm: dữ liệu Cấp 1 — Công khai thì khách đọc được; dữ liệu Cấp 2 — Nội bộ phải đăng nhập; dữ liệu Cấp 3 — Hạn chế tiếp cận như hồ sơ cán bộ, danh bạ, kiến nghị có tên người dân thì khóa chặt nhất và không đưa vào nội dung gửi cho AI công cộng; dữ liệu Cấp 4 — Bí mật nhà nước không có chỗ trong hệ thống này, vì theo Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet.

Dòng thứ hai có ghi chú riêng trong tệp lược đồ: khách vào thấy danh sách kiến nghị trống là đúng thiết kế, đừng "sửa" bằng cách mở quyền đọc công khai. Một câu dặn như vậy cứu được người duy trì sau này khỏi một sai lầm nghe rất hợp lý.

### 12.5.3. Bảng kiểm khi thêm một phân hệ vào cổng

::: {.thuchanh}
**Thực hành: mười câu hỏi trước khi bấm "triển khai" một phân hệ mới**

1. Phân hệ đã khai ở đúng một chỗ trong danh mục? Đường dẫn có trùng không?
2. Dữ liệu cất ở tủ nào, có trùng tên tủ của phân hệ khác không?
3. Tủ có kiểu cửa nào: chỉ Quản trị, chỉ người đăng nhập, hay đọc công khai và ghi qua hàm hẹp?
4. Đã thử bằng vai Khách, Cán bộ, Quản trị chưa? Ba vai có thấy cùng một sự thật?
5. Danh sách người lấy từ hồ sơ một mối hay lại tự giữ riêng?
6. Có dữ liệu cá nhân nào sắp lọt vào mã nguồn hoặc vào nội dung gửi cho AI?
7. Kỳ trống, danh sách trống, ngày đầu tháng thì màn hình ra sao?
8. Bot chat, hàm xuất báo cáo, trang Hướng dẫn đã cập nhật theo chưa?
9. Nhãn "Bản demo thử nghiệm", "dữ liệu mô phỏng" đã hiện chỗ dễ thấy chưa?
10. Nhật ký thay đổi đã ghi: làm gì, vì sao, kiểm chứng ra sao, việc gì người dùng phải tự làm?
:::

::: {.lenhmau}
**Câu lệnh mẫu 12.5 — Thêm một phân hệ mới vào cổng**

```text
Vai: Đồng chí là tác tử AI lập trình, đã đọc bộ nhớ dự án.
Bối cảnh: Tôi muốn thêm phân hệ "[tên]" phục vụ [nghiệp vụ, người dùng].
Tài liệu nghiệp vụ: [đường dẫn tệp].
Việc: CHƯA viết mã. Trình phương án gồm: (1) khai báo trong danh mục
phân hệ; (2) tủ dữ liệu riêng và kiểu cửa (ai đọc, ai ghi, vì sao);
(3) danh sách người lấy từ đâu; (4) những chỗ khác bị ảnh hưởng (bot,
xuất báo cáo, Hướng dẫn, lược đồ cơ sở dữ liệu); (5) nhãn demo.
Ràng buộc: không đụng dữ liệu của phân hệ khác; không đưa dữ liệu
cá nhân vào mã nguồn; logic tính toán viết thành tệp thuần.
Nghiệm thu: sau khi tôi duyệt phương án mới làm; trả lời đủ mười câu
hỏi của bảng kiểm; bản dựng xanh; thử ba vai; ghi nhật ký thay đổi.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Một cổng nhiều phân hệ chỉ vững khi có quy ước chung về danh sách cán bộ, nơi cất dữ liệu và quyền xem. Đó là việc của người chủ hệ thống, không thể phó mặc cho AI.
- Dữ liệu demo đọc công khai là lựa chọn có chủ đích của giai đoạn thử nghiệm. Trước khi dùng dữ liệu thật phải gỡ các quyền đọc công khai và chuyển sang hạ tầng của cơ quan.
- Mỗi hệ thống ngoài là thêm một chỗ phụ thuộc: một hạ tầng, một hệ tài khoản, một người hiểu nó. Cơ quan nên có danh mục các hệ thống, ghi rõ người chịu trách nhiệm; Nghị định về bảo vệ an ninh mạng đối với hệ thống thông tin (dòng dưới) cũng yêu cầu mỗi hệ thống có một chủ quản duy nhất.
- Gói miễn phí có điều kiện: cơ sở dữ liệu gói miễn phí của Supabase tạm dừng sau một tuần không hoạt động; máy chủ miễn phí của phân hệ Một dữ liệu "ngủ" khi không ai dùng (theo tài liệu của Supabase và ghi nhận thực tế của dự án; thông tin tham khảo tại thời điểm viết (10/2026), có thể thay đổi).
- Theo Nghị định 331/2026/NĐ-CP ngày 19/8/2026 về bảo vệ an ninh mạng đối với hệ thống thông tin (quy định chi tiết Luật An ninh mạng số 116/2025/QH15), hệ thống phục vụ hoạt động nội bộ có xử lý thông tin cá nhân của người sử dụng (không xử lý bí mật nhà nước) thuộc tiêu chí cấp độ 2. Khoản 2 Điều 6 của Nghị định quy định hệ thống đáp ứng tiêu chí của nhiều cấp độ thì áp dụng cấp độ cao nhất, và không được xác định phạm vi hệ thống một cách hình thức để giảm yêu cầu an ninh mạng. Vì vậy phân hệ hồ sơ cán bộ dùng thật phải được xác định cấp độ; tách hay gộp hệ thống phải dựa trên nghiệp vụ, không dựa trên mong muốn nhẹ thủ tục.
:::

## Tóm tắt chương 12

::: {.tomtat}
1. Trang chủ dạng cổng là "sảnh" của hệ thống; mỗi phân hệ khai báo đúng một lần trong danh mục dùng chung, có đường dẫn chia sẻ được, chỉ tải khi cần.
2. Danh sách cán bộ về một mối là hồ sơ Mẫu 2C; phân hệ chấm điểm chỉ đọc, giữ nguyên điểm đã chấm; nhận dạng người bằng email hoặc họ tên kèm đơn vị.
3. Quản lý cán bộ nhắc bảy loại mốc, nghỉ hưu tính theo Nghị định 135/2020/NĐ-CP; phần mềm chỉ nhắc, quyết định thuộc cơ quan có thẩm quyền.
4. Hồ sơ 2C có cả dữ liệu cá nhân cơ bản và nhạy cảm; quyền thật nằm ở cơ sở dữ liệu, ẩn thẻ chưa phải bảo mật; số điện thoại thật không vào kho mã.
5. Biểu quyết Online tính trên tổng số 82 đại biểu (42/82, 55/82), đánh số đại biểu, ghi phiếu qua một hàm hẹp, dán nhãn mô phỏng; là công cụ demo, không thay hệ thống chính thức.
6. Hệ thống khác công nghệ, khác tài khoản thì gắn bằng liên kết tử tế, đọc dữ liệu qua cửa chỉ đọc; cần chung đăng nhập, cùng ghi dữ liệu mới tính chuyện gộp.
7. Dữ liệu demo là dữ liệu chính thống; mỗi phân hệ một tủ hồ sơ với kiểu cửa rõ ràng; mở cho demo thì phải sẵn cách đóng khi dùng thật.
:::

## Câu hỏi suy ngẫm và bài tập

1. Ở cơ quan đồng chí, danh sách cán bộ đang nằm ở bao nhiêu nơi (bảng tính thi đua, chấm công, danh bạ)? Nơi nào nên là "một mối", vì sao?
2. Dùng Câu lệnh mẫu 12.3 lập sổ nhắc mốc với năm hồ sơ giả định. Ca nào AI tính sai lần đầu, và đồng chí phát hiện bằng cách nào?
3. Vì sao biểu quyết phải tính trên tổng số đại biểu? Giải thích cho một đồng nghiệp chưa từng phục vụ kỳ họp bằng một ví dụ con số.
4. Chọn một ứng dụng đồng chí đang dùng hoặc định làm; dùng bảng ở mục 12.4.4 để quyết định gộp hay liên kết, ghi lý do.
5. Với vai trò lãnh đạo, đồng chí cần thấy những gì trên giấy trước khi cho phép một phân hệ có hồ sơ cán bộ thật được đưa vào sử dụng?
