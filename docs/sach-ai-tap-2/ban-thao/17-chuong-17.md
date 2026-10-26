# Chương 17. Dành cho lãnh đạo: dẫn dắt ứng dụng AI trong cơ quan

::: {.muctieu}
**Mục tiêu của chương**

- Nắm mười câu hỏi lãnh đạo nên đặt ra khi cán bộ trình một ứng dụng hay một quy trình có dùng trí tuệ nhân tạo (AI), để quyết định đúng mà không cần biết lập trình.
- Biết khung nội dung của một quy chế, quy tắc sử dụng AI trong cơ quan và các văn bản của Đảng, Nhà nước làm căn cứ.
- Hình dung lộ trình ba giai đoạn thí điểm, nhân rộng, chính thức hóa; biết chọn bài toán đầu tiên và đo hiệu quả một cách trung thực.
- Phân biệt các mô hình chi phí; nhận diện bốn nhóm rủi ro chính, trong đó có rủi ro "người duy nhất biết".
- Biết cách xây dựng đội ngũ, văn hóa thử nghiệm có kỷ luật, và dùng ma trận quyết định giữa tự làm, đặt hàng và dùng nền tảng có sẵn.

Dành cho: lãnh đạo Văn phòng, lãnh đạo các Ban, Thường trực Hội đồng nhân dân, đại biểu hoạt động chuyên trách; trưởng, phó các phòng; thành viên Tổ công tác về chuyển đổi số. Cán bộ tự làm ứng dụng cũng nên đọc để biết trước lãnh đạo sẽ hỏi gì.
:::

Các chương trước phần lớn viết cho người trực tiếp làm. Chương này viết cho người phải quyết định: cho làm hay không, làm đến đâu, ai chịu trách nhiệm, dừng lúc nào.

Tôi ở cả hai vị trí. Là Phó Chánh Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), tôi là một người trong tập thể lãnh đạo, phải ký và chịu trách nhiệm. Là người dựng hệ thống thử nghiệm của Văn phòng tại địa chỉ hdndthkpi.vercel.app, tôi giao việc hằng ngày cho tác tử AI lập trình. Đứng ở vị trí thứ hai, tôi thấy rõ những điều người ở vị trí thứ nhất cần biết mà ít khi được báo cáo: dữ liệu đang nằm ở đâu, ai xem được, mỗi tháng tốn bao nhiêu, người làm nghỉ phép thì ai sửa.

Năm 2026, định hướng đã rất rõ. Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị xác định khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là "đột phá quan trọng hàng đầu". Luật Trí tuệ nhân tạo số 134/2025/QH15, hiệu lực từ 01/3/2026, tại khoản 3 Điều 5 ưu tiên ứng dụng AI trong quản lý, điều hành, cung cấp dịch vụ công và hỗ trợ ra quyết định của cơ quan nhà nước. Ở Quốc hội, trợ lý ảo AI trên App Quốc hội 2.0 đã hỗ trợ đại biểu từ Kỳ họp thứ 9 (năm 2025); theo tin báo Đại biểu Nhân dân, Văn phòng Quốc hội đang thí điểm các nền tảng số dùng chung cho cơ quan dân cử địa phương. Tại tỉnh, ngày 7/5/2026, Thường trực HĐND tỉnh tổ chức hội nghị tập huấn sử dụng AI cho cán bộ, công chức Văn phòng.

Vì vậy, câu hỏi đặt ra với lãnh đạo không còn là "có nên dùng AI không". Câu hỏi là dùng thế nào cho đúng, cho an toàn và cho bền. Chương này không hô hào. Nó đưa ra những công cụ quản lý cụ thể: bộ câu hỏi, khung quy chế, lộ trình, thước đo, sổ rủi ro, ma trận quyết định. Tất cả rút ra từ những việc đã làm và những lần đã sai ở Văn phòng.

## 17.1. Lãnh đạo không cần biết lập trình, nhưng cần biết hỏi đúng

Một đồng chí Chánh Văn phòng không tự vẽ bản thiết kế cải tạo trụ sở. Nhưng khi duyệt tờ trình, đồng chí biết hỏi: kinh phí bao nhiêu, ai thi công, nghiệm thu thế nào, bảo hành bao lâu, hỏng thì ai sửa. Với ứng dụng có AI cũng vậy. Ở Chương 2, tôi gọi vai của cán bộ tự làm ứng dụng là chủ đầu tư, tổng công trình sư và người nghiệm thu. Lãnh đạo đứng thêm một tầng nữa: người phê duyệt chủ trương và chịu trách nhiệm cuối cùng.

Cái khó là phần mềm "trông" rất giống nhau dù bên trong khác hẳn. Một trang web đẹp có thể đang để hồ sơ cán bộ cho mọi tài khoản đọc được. Một con bot trả lời trơn tru có thể đang gửi họ tên, điểm số của cán bộ qua máy chủ của một bên thứ ba. Nhìn màn hình không thấy được những điều đó. Phải hỏi.

### 17.1.1. Mười câu hỏi nên hỏi trước khi cho dùng

Bảng dưới đây là mười câu hỏi tôi đúc rút sau năm 2026. Cột thứ ba ghi những câu trả lời nghe thì yên tâm nhưng thực ra là tín hiệu cần hỏi tiếp.

| # | Câu hỏi | Câu trả lời đáng lo |
|---|---|---|
| 1 | Giải quyết việc gì, cho ai, hiện mất bao lâu? | "Cho hiện đại" |
| 2 | Dựa trên văn bản nào, đã so với biểu mẫu đang dùng chưa? | "AI tự biết quy định" |
| 3 | Dữ liệu gì, thuộc vùng nào, nằm ở đâu? | "Chắc là trên mạng" |
| 4 | Ai được xem, ai được sửa, chặn ở tầng nào? | "Đã ẩn nút rồi" |
| 5 | Chỗ nào máy tính, chỗ nào người quyết? | "AI chấm luôn cho nhanh" |
| 6 | AI sai thì người dùng có nhận ra không? | "AI này chính xác lắm" |
| 7 | Mỗi tháng tốn bao nhiêu, trần ở đâu? | "Hiện đang miễn phí" |
| 8 | Đã thử những trường hợp nào, bằng vai nào? | "Tôi bấm thử thấy chạy" |
| 9 | Người làm vắng một tháng thì ai sửa? | "Cứ gọi tôi" |
| 10 | Dừng hoặc chuyển đi thì dữ liệu mang theo thế nào? | "Chưa nghĩ tới" |

**Câu 1 và câu 2: bài toán và căn cứ.** Ứng dụng có ích nhất của Văn phòng sinh ra từ một việc lặp lại hằng tháng và có văn bản rõ ràng: đánh giá, xếp loại cán bộ, công chức theo Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU của Tỉnh ủy. Nhưng có văn bản chưa đủ. Phân hệ Kiểm điểm dựng đúng theo Hướng dẫn 03-HD/TU vẫn lệch biểu mẫu giấy ở bốn chỗ lớn, cho đến khi tôi đối chiếu với bản tự đánh giá thật đang dùng (Chương 10). Vì vậy câu hỏi đúng không chỉ là "căn cứ văn bản nào" mà còn là "đã so với tờ giấy mọi người đang điền chưa".

**Câu 3 và câu 4: dữ liệu và quyền.** Hãy yêu cầu người trình nói rõ dữ liệu thuộc vùng ĐỎ, VÀNG hay XANH theo cách phân loại của Tập 1, lưu ở máy chủ nào, đi qua những dịch vụ nào. Rồi hỏi tiếp: quyền xem, quyền sửa được chặn ở giao diện hay ở cơ sở dữ liệu. Ẩn một nút bấm chỉ là không chỉ đường; cửa vẫn mở nếu cơ sở dữ liệu không khóa.

::: {.cauchuyen}
**Câu chuyện thực tế: tab đã ẩn, cửa vẫn mở**

Phân hệ Quản lý cán bộ có tab chỉ hiện với tài khoản Quản trị. Hồ sơ theo Mẫu 2C có ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình. Nhìn màn hình, rất dễ nghĩ ẩn tab là đủ.

Nhưng chính sách bảo mật cũ của cơ sở dữ liệu cho **mọi** tài khoản đã đăng nhập đọc **mọi** dòng dữ liệu. Một cán bộ bình thường, nếu biết cách gọi thẳng vào cửa giao dịch dữ liệu, vẫn đọc được hồ sơ. Vì vậy, ngay trong đợt dựng phân hệ, tệp lược đồ cơ sở dữ liệu phải có thêm một bước riêng: chỉ tài khoản Quản trị mới đọc, ghi được dòng hồ sơ cán bộ. Kèm theo là dòng cảnh báo: chưa chạy bước này thì hồ sơ không được bảo vệ.

Từ đó, câu hỏi số 4 luôn có vế sau: "chặn ở tầng nào?". Một người làm ứng dụng trung thực sẽ trả lời được ngay. Người chỉ nhìn giao diện sẽ trả lời "đã ẩn rồi ạ".
:::

**Câu 5 và câu 6: ranh giới giữa máy và người.** Nguyên tắc "máy đề xuất, người quyết định" phải nhìn thấy được trên màn hình. Ở hệ thống của Văn phòng, phần mềm tính điểm và gợi ý xếp loại, còn nút "Phê duyệt" thuộc về người có thẩm quyền; ai sửa điểm sau khi đã duyệt thì phê duyệt tự động bị gỡ. Ở phân hệ Sổ tay AI, phần mềm không tự gán "còn hiệu lực" cho bất kỳ văn bản nào. Câu 6 hỏi về cách AI báo khi nó không chắc: có trích dẫn tới điều, khoản không; có dám nói "không tìm thấy trong nguồn" không; dữ liệu mô phỏng có được dán nhãn không.

**Câu 7: chi phí.** "Hiện đang miễn phí" là câu trả lời đáng hỏi tiếp nhất. Miễn phí đến bao giờ, ai trả khi hết, trần chi phí đặt ở đâu và do ai giữ. Mục 17.5 bàn kỹ.

**Câu 8: kiểm thử.** Người làm thường thử trường hợp đẹp. Lãnh đạo nên hỏi về trường hợp xấu: danh sách trống, hai người trùng họ tên, ngày đầu tháng, mất mạng, hai người cùng sửa. Ngày 01/9/2026, ba phân hệ của Văn phòng cùng trắng trang chỉ vì kỳ đánh giá tháng mới chưa có dữ liệu. Lỗi ấy không lộ ra khi bấm thử trong tháng 8.

**Câu 9 và câu 10: tính bền vững.** Một ứng dụng chỉ sống được khi người làm có mặt thì chưa phải tài sản của cơ quan. Mục 17.6 gọi đây là rủi ro "người duy nhất biết". Câu 10 thường bị bỏ qua nhất: nếu mai kia tỉnh có nền tảng dùng chung tốt hơn, dữ liệu có xuất ra được không, ở định dạng nào.

### 17.1.2. Biến mười câu hỏi thành một tờ phiếu

Tôi khuyên lãnh đạo không hỏi miệng, mà yêu cầu người trình nộp kèm một "phiếu mười câu hỏi" viết ra giấy, dài không quá hai trang. Viết ra thì người trình buộc phải tự kiểm tra; lãnh đạo có văn bản để đối chiếu về sau; người tiếp nhận sau này có hồ sơ để đọc.

Điều thú vị là tác tử AI lập trình làm phần lớn việc trả lời rất tốt, vì nó đọc được toàn bộ kho mã nguồn (repository). Người trình chỉ cần giao việc đúng cách và tự kiểm chứng lại.

::: {.lenhmau}
**Câu lệnh mẫu 17.1 — Lập phiếu mười câu hỏi trước khi trình lãnh đạo**

```text
[VAI] Đóng vai kiểm toán viên nội bộ, khó tính, trung thực.
Chỉ đọc kho mã, KHÔNG sửa tệp, KHÔNG commit.
[BỐI CẢNH] Tôi sắp trình lãnh đạo cho dùng thử [tên ứng dụng],
phục vụ [nghiệp vụ], người dùng dự kiến [số người, đơn vị].
[VIỆC] Đọc toàn bộ kho mã, trả lời 10 câu: (1) việc gì, cho ai;
(2) căn cứ văn bản, biểu mẫu nào được số hóa; (3) dữ liệu gì,
lưu ở đâu, đi qua dịch vụ nào; (4) ai xem, ai sửa, chặn ở giao
diện hay cơ sở dữ liệu; (5) chỗ nào phần mềm tự quyết, nút phê
duyệt của ai; (6) khi AI không chắc thì hiển thị gì; (7) chi
phí, trần hạn mức nằm ở đâu; (8) đã có phép kiểm nào cho trường
hợp trống, trùng, đầu kỳ; (9) tài liệu nào giúp người khác tiếp
nhận; (10) cách xuất toàn bộ dữ liệu ra ngoài.
[DẠNG] Bảng 3 cột: Câu hỏi | Trả lời | Tệp làm căn cứ.
[RÀNG BUỘC] Không in khóa bí mật, mật khẩu, số điện thoại.
Không biết thì ghi "chưa có", không đoán, không tô hồng.
[NGHIỆM THU] Đủ 10 dòng; mỗi khẳng định có tệp làm căn cứ.
```

Phiếu do AI lập chỉ là bản nháp. Người trình phải tự đọc lại, đối chiếu ít nhất vài dòng với mã nguồn hoặc chạy thử, rồi mới ký tên nộp.
:::

::: {.ghinho}
**Ghi nhớ**

Câu trả lời nào chỉ nằm trong đầu người làm thì coi như chưa được trả lời. Lãnh đạo không cần hiểu mã nguồn, nhưng cần một tờ phiếu viết ra, có người ký, có căn cứ để đối chiếu.
:::
