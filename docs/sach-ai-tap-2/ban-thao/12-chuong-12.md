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

Ba chương trước, mỗi chương đi sâu vào một phân hệ chấm điểm. Chương này lùi lại một bước để nhìn cả "trụ sở". Một hệ thống nhiều phân hệ không chỉ là nhiều ứng dụng đặt cạnh nhau. Nó cần một sảnh chung để người dùng tìm đúng cửa, một sổ nhân sự chung để các phòng không mỗi nơi giữ một danh sách, và những quy ước chung về chỗ cất hồ sơ, ai được xem, ai được ghi.

Chất liệu của chương vẫn là hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, địa chỉ hdndthkpi.vercel.app. Tôi kể theo trình tự: Trang chủ và danh sách cán bộ một mối; phân hệ Quản lý cán bộ; phân hệ Biểu quyết Online; ba hệ thống riêng được gắn bằng liên kết; và hai bài học dữ liệu áp cho toàn hệ thống. Như các chương khác của Phần này, mỗi mục có cách tôi giao việc cho AI, sự cố đã gặp, gợi ý tự làm phiên bản nhỏ và điều lãnh đạo cần quyết.

## 12.1. Trang chủ dạng cổng phân hệ và nguyên tắc "một mối"

### 12.1.1. Từ một ứng dụng chấm điểm đến một trụ sở nhiều phòng

Lúc đầu hệ thống chỉ làm một việc: chấm điểm cán bộ, công chức theo OKR/KPI. Tên trang web khi đó là "Đánh giá OKR/KPI". Khi phân hệ Tiêu chí HĐND ra đời, người dùng cần một chỗ để chọn vào đâu. Nhật ký dự án ghi việc dựng Trang chủ dạng cổng (portal) cùng đợt với phân hệ Tiêu chí HĐND.

Về sau, khi hệ thống đã có nhiều phân hệ, tôi đổi tên trang thành tên cơ quan: "Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa". Tên nghiệp vụ lùi xuống dòng phụ. Lý do được ghi rõ trong nhật ký: tên trang cũ là tên của một phân hệ, trong khi hệ thống đã thành nền tảng nhiều phân hệ. Việc đổi tên kéo theo sửa ở nhiều nơi: tiêu đề trang, dòng chữ đậm đầu Trang chủ, dòng nhận diện ở đầu mỗi phân hệ, và cả ảnh xem trước hiện ra khi chia sẻ đường dẫn.

Hãy hình dung Trang chủ như sảnh của một trụ sở. Khách vừa vào cần thấy ngay mấy thứ: bảng tin, sơ đồ các phòng, quầy hướng dẫn, số điện thoại liên hệ. Trang chủ của hệ thống được tổ chức đúng như vậy.

| Khu vực trên Trang chủ | Tương ứng ở trụ sở | Ghi chú |
|---|---|---|
| Bản tin pháp luật hằng ngày | Bảng tin ở sảnh | Tự sinh mỗi sáng (Chương 15) |
| Lưới thẻ phân hệ | Sơ đồ các phòng | Hai nhóm: nghiệp vụ, công cụ |
| Khung chat Người hướng dẫn | Quầy hướng dẫn | Kịch bản soạn sẵn và AI (Chương 13) |
| Liên hệ, bộ đếm lượt truy cập | Số điện thoại, sổ ghi khách | Mỗi phiên trình duyệt đếm một lần |

Thẻ đầu tiên là Biểu quyết Online, mang nhãn "Trung tâm". Tiếp theo là các phân hệ nghiệp vụ: OKR/KPI, Kiểm điểm, Tiêu chí HĐND, Trợ lý AI, Sổ tay AI, rồi ba hệ thống riêng là Giám sát số, Một dữ liệu và Lịch công tác tuần. Nhóm công cụ gồm Quản lý cán bộ, Hướng dẫn và hỗ trợ, Phòng thử nghiệm bộ tiêu chí. Đến ngày 25/10/2026, Trang chủ có 12 thẻ. Ngày 26/10/2026, kho mã có thêm thẻ thứ 13 là Tủ sách, nơi giới thiệu sách do cán bộ cơ quan biên soạn.

### 12.1.2. Một danh mục khai báo, mọi nơi cùng đọc

Điều quan trọng nhất của một cổng nhiều phân hệ không nằm ở giao diện đẹp. Nó nằm ở chỗ: mỗi phân hệ chỉ được khai báo ở đúng một nơi. Trong hệ thống của Văn phòng, nơi đó là tệp `src/lib/modules.js`. Mỗi phân hệ là một mục gồm: đường dẫn, tên đầy đủ, tên ngắn, mô tả, các thẻ nhãn, biểu tượng, tông màu và "đích mở".

Đích mở có ba kiểu. Kiểu thứ nhất mở ứng dụng chấm điểm dùng chung với một bộ tiêu chí cụ thể, như OKR/KPI hay Kiểm điểm. Kiểu thứ hai mở một phân hệ có mã riêng, như Biểu quyết Online hay Sổ tay AI. Kiểu thứ ba là "hệ thống ngoài" (external): phân hệ chạy ở một địa chỉ riêng, có mã nguồn, cơ sở dữ liệu và tài khoản riêng.

Cứ hình dung tệp danh mục như cuốn sổ danh bạ các phòng đặt ở quầy lễ tân. Bộ định tuyến (tệp `src/Root.jsx`) là tổ lễ tân: đọc địa chỉ khách ghi trên phiếu, tra sổ, rồi dẫn khách tới đúng phòng. Muốn thêm một phòng, chỉ cần ghi thêm một dòng vào sổ. Không ai phải sửa lại sơ đồ treo ở sảnh, vì sơ đồ được vẽ ra từ chính cuốn sổ ấy.

Cách làm này đem lại năm lợi ích có thể kiểm chứng trong dự án:

1. **Thêm phân hệ chỉ khai một chỗ.** Thẻ Tủ sách thêm ngày 26/10/2026 là một ví dụ: khai một mục trong danh mục, khai một đường dẫn, thêm một biểu tượng.
2. **Đường dẫn chia sẻ được.** Mỗi phân hệ có địa chỉ riêng dạng `#/bieuquyet`, `#/canbo`. Gửi qua Zalo cho đồng nghiệp, họ bấm vào là tới thẳng phân hệ. Thêm đuôi `?login=1` thì mở sẵn màn đăng nhập.
3. **Hướng dẫn không lệch với thực tế.** Trang Hướng dẫn và hỗ trợ tự liệt kê các phân hệ từ chính danh mục này, nên không có chuyện trang hướng dẫn thiếu một phân hệ mới.
4. **Quản trị ẩn, hiện được.** Quản trị có nút để ẩn thẻ của các bộ tiêu chí thử nghiệm. Cấu hình lưu trên máy chủ nên áp dụng cho mọi người truy cập.
5. **Chỉ tải phần cần dùng.** Trang chủ chỉ tải khoảng 33 kB, trước khi tách là khoảng 180 kB. Các phân hệ được "tải theo nhu cầu" (lazy-load): bấm vào thẻ nào mới tải mã của phân hệ đó. Sảnh không cần chất sẵn hồ sơ của mọi phòng.

Một việc nhỏ nhưng tốn công là thống nhất đầu trang. Các phân hệ ra đời ở những thời điểm khác nhau nên mỗi nơi một kiểu. Nhật ký ghi một đợt "đồng bộ giao diện giữa các phân hệ": mọi phân hệ dùng chung một bố cục đầu trang gồm nút về Trang chủ, quốc huy, nhãn "Bản demo thử nghiệm", tên phân hệ, tên cơ quan, khu vực tài khoản. Thanh chọn bộ tiêu chí trước đây hiện ở mọi phân hệ chấm điểm cũng bị bỏ, vì người dùng đã chọn phân hệ từ Trang chủ. Nó chỉ còn ở Phòng thử nghiệm, nơi việc so sánh các bộ tiêu chí là mục đích chính.

### 12.1.3. Danh sách cán bộ về một mối

::: {.cauchuyen}
**Câu chuyện thực tế: một người, ba chỗ phải sửa**

Trước khi gộp, mỗi phân hệ chấm điểm tự giữ danh sách người của mình. Phân hệ OKR/KPI có 28 người, gồm 25 cán bộ, công chức, người lao động các phòng và 3 lãnh đạo Văn phòng. Phân hệ Kiểm điểm có 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý. Phân hệ Quản lý cán bộ lại có danh sách hồ sơ riêng.

Một đồng chí đổi chức vụ thì phải sửa ở ba nơi. Sửa sót một nơi là các phân hệ "nói" ba điều khác nhau về cùng một người. Tôi quyết định gộp: hồ sơ Mẫu 2C ở phân hệ Quản lý cán bộ trở thành danh sách duy nhất của hệ thống. Các phân hệ chấm điểm chỉ đọc danh sách, không tự thêm, sửa, xóa người.
:::

Sau khi gộp, hệ thống có 40 hồ sơ. Con số này không phải cộng thẳng 28 với 15. Ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ: hằng tháng chấm KPI với tư cách cán bộ Văn phòng, hằng quý kiểm điểm với tư cách cán bộ diện Ban Thường vụ Tỉnh ủy quản lý. Đây là phương án tôi chọn sau khi AI trình bày các cách làm. Vậy 28 + 15 − 3 = 40.

Ai thuộc phân hệ nào được quyết định bằng hai thông tin trong hồ sơ, không bằng tay ở từng phân hệ:

| Câu hỏi | Cách hệ thống trả lời |
|---|---|
| Ai vào phân hệ Kiểm điểm? | Hồ sơ có trường "Diện quản lý cán bộ" là thuộc diện BTV Tỉnh ủy quản lý |
| Ai vào phân hệ OKR/KPI? | Hồ sơ có đơn vị là "Văn phòng" hoặc một phòng trực thuộc |
| Thêm người mới ở đâu? | Chỉ ở phân hệ Quản lý cán bộ |
| Người nghỉ, chuyển công tác? | Hồ sơ giữ lại, gắn cờ "ngoài danh sách", không xóa |
| Đổi chức vụ thì điểm đã chấm ra sao? | Giữ nguyên; chỉ đồng bộ họ tên, chức vụ, đơn vị, email |

Trong hai phân hệ chấm điểm, các nút "Thêm cán bộ", "Xóa cán bộ", "Nạp lại danh sách cán bộ chuẩn" bị ẩn. Ô họ tên, đơn vị, chức vụ, email chuyển sang chỉ đọc, kèm dòng nhắc và nút mở thẳng phân hệ Quản lý cán bộ. Riêng ô vai trò vẫn sửa được, vì đó là quyền dùng phần mềm chứ không phải thông tin hồ sơ. Đây là chi tiết nhỏ cho thấy phải phân biệt rõ hai loại dữ liệu: dữ liệu về con người (thuộc hồ sơ) và dữ liệu về quyền truy cập (thuộc phần mềm).

Có một điểm tinh tế. Hồ sơ 2C chỉ Quản trị đọc được (mục 12.2.4). Vậy cán bộ thường mở phân hệ OKR/KPI lấy danh sách từ đâu? Câu trả lời: mỗi khi Quản trị mở phân hệ, danh sách đã đồng bộ được ghi vào bản ghi của kỳ đánh giá. Bản ghi kỳ chỉ chứa họ tên, chức vụ, đơn vị và điểm, không chứa ngày sinh, số định danh hay quan hệ gia đình. Người khác đọc bản ghi kỳ, không bao giờ chạm vào hồ sơ gốc.

Gộp về một mối cũng làm lộ một lỗi tiềm ẩn: hai đồng chí trùng cả họ, chữ đệm và tên ở hai đơn vị bị ghép thành một, khiến phân hệ OKR/KPI chỉ còn 27 người. Chương 9 (mục 9.5.4) đã kể chi tiết. Bài học áp vào đây: một danh sách "một mối" chỉ an toàn khi cách nhận dạng một người cũng chặt. Hệ thống nay nhận dạng bằng email, hoặc bằng "họ tên kèm đơn vị", không bao giờ bằng họ tên đơn thuần.

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
Nghiệm thu: đếm tổng số người trước và sau khi gộp ở từng phân hệ;
viết phép kiểm cho ca trùng họ tên; chạy thử bằng vai khách và vai
quản trị; báo cáo những chỗ khác đang đọc danh sách (xuất Word,
bot chat, báo cáo tổng hợp) đã kiểm chưa.
```
:::

::: {.ghinho}
**Ghi nhớ**

Một mối không có nghĩa là một bảng to chứa mọi thứ. Một mối nghĩa là mỗi loại thông tin chỉ có một nơi được sửa. Nơi khác chỉ đọc, và đọc đúng phần mình cần.
:::
