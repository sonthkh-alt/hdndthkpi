# Chương 4. Bảy nguyên tắc vàng của người kiến tạo

::: {.muctieu}
**Mục tiêu của chương**

- Nắm bảy nguyên tắc nền tảng khi cùng AI làm ra ứng dụng phục vụ công việc của cơ quan dân cử.
- Hiểu vì sao mỗi nguyên tắc ra đời, qua những sự cố có thật của hệ thống thử nghiệm của Văn phòng.
- Biết biến từng nguyên tắc thành câu hỏi kiểm tra, câu lệnh giao việc và thao tác nghiệm thu.
- Có một bảng kiểm một trang để rà soát ứng dụng trước khi mời người khác dùng.

Dành cho: mọi người đọc. Lãnh đạo nên đọc kỹ các mục 4.1, 4.4, 4.6 và 4.8.
:::

Khi bắt đầu dự án vào giữa năm 2026, tôi chưa có bộ nguyên tắc nào trong tay. Bảy nguyên tắc dưới đây hình thành dần, phần lớn sau một lần sai: một phân hệ sập ngày đầu tháng, một danh sách cán bộ bị ghi đè, một con bot trả lời hai lần, một biểu mẫu in nhầm tiêu đề. Mỗi lần như vậy, tôi cùng tác tử AI lập trình (AI coding agent) tìm nguyên nhân gốc, sửa, rồi ghi bài học thành quy tắc trong bộ nhớ dự án.

Công cụ thay đổi rất nhanh, nguyên tắc thì bền hơn. Mỗi nguyên tắc được trình bày theo bốn bước: phát biểu, vì sao, minh chứng từ dự án, cách áp dụng. Nguyên tắc thứ nhất nối dài "con người trong vòng lặp" của Tập 1; sáu nguyên tắc còn lại là những gì tôi phải học thêm khi chuyển từ người dùng AI sang người cùng AI làm ra công cụ. Với lãnh đạo, đó cũng là bảy câu hỏi để thẩm định một ứng dụng mà không cần đọc mã.

## 4.1. Nguyên tắc thứ nhất: Máy đề xuất, người quyết định

**Phát biểu.** Phần mềm được tính toán, gợi ý, cảnh báo, soạn nháp. Quyền kết luận, phê duyệt, khẳng định giá trị pháp lý luôn thuộc về người có thẩm quyền, và màn hình phải thể hiện rõ điều đó: nút "phê duyệt" là của con người, ghi tên người bấm, ngày bấm.

**Vì sao.** Thứ nhất là trách nhiệm: phần mềm không có tư cách pháp lý; khi kết quả bị thắc mắc, người giải trình là cán bộ có thẩm quyền. Thứ hai, quy trình vốn tách hai tầng: cấp trực tiếp sử dụng cán bộ đề xuất mức xếp loại, cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt. Thứ ba, khi câu chữ quy định hiểu được nhiều cách, AI hay "chọn đại" một cách. Có lúc một nhiệm vụ làm được 9/10 bị máy coi là "không hoàn thành", kéo một người điểm cao xuống mức thấp nhất; cách hiểu được chốt sau đó là chỉ dưới 50% mới là không hoàn thành. Không có người đọc lại thì lỗi ấy đã nằm yên trong phiếu.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Điều 4 cũng yêu cầu duy trì sự kiểm soát và khả năng can thiệp của con người đối với quyết định, hành vi của hệ thống AI.
- Thông tư 05/2026/TT-BKHCN ngày 10/3/2026 quy định Khung đạo đức trí tuệ nhân tạo quốc gia, áp dụng bắt buộc với cơ quan quản lý nhà nước và tổ chức, cá nhân triển khai, sử dụng AI phục vụ quản lý nhà nước, dịch vụ công; giữ nguyên tắc con người nắm thẩm quyền quyết định cuối cùng.
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương khuyến khích "ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ" (điểm 1.2), đồng thời giao việc quyết định, phê duyệt cho cấp có thẩm quyền quản lý cán bộ (điểm 2.2).

Đối chiếu đến ngày 26/10/2026; nên tra nguyên văn trước khi viện dẫn.
:::

**Minh chứng từ dự án.** Trong hệ thống thử nghiệm của Văn phòng (`https://hdndthkpi.vercel.app`):

- Ở phân hệ Đánh giá OKR/KPI và phân hệ Kiểm điểm, mỗi điểm số có hai cột Tự đánh giá và Cấp duyệt; cột Cấp duyệt mặc định lấy theo cột Tự đánh giá, người có thẩm quyền sửa khi cần, và chính nó dùng để xếp loại. Nút "Phê duyệt & xuất phiếu" chỉ hiện với người đã đăng nhập có thẩm quyền, ghi họ tên, vai trò, ngày. Sửa điểm sau khi đã phê duyệt thì phê duyệt tự gỡ; phân hệ Tiêu chí Hội đồng nhân dân (HĐND) cũng vậy.
- Ở phân hệ Sổ tay AI, 21 văn bản gợi ý đặt sẵn ở trạng thái "Chưa xác định hiệu lực", "Chưa kiểm tra". Chú thích trong mã ghi thẳng: phần mềm không tự gán "còn hiệu lực" cho văn bản nào, vì máy không có thẩm quyền đó; bốn phép kiểm tự động giữ điều này.
- Ở hệ thống Giám sát số, máy rà dấu hiệu, chấm rủi ro, xếp hạng nghị quyết cấp xã rồi trình danh mục; Thường trực HĐND tỉnh quyết định, không bốc thăm tự động.
- Sáu chỗ chưa nhất quán trong dự thảo Khung tiêu chí đánh giá HĐND được chuẩn hóa có ghi chú "dự thảo ghi gì – đã chuẩn hóa thế nào" và hiện công khai dưới dạng kiến nghị, không im lặng chọn một cách hiểu.

Cả quá trình làm phần mềm cũng theo nguyên tắc này. Khi AI chỉ ra công thức có thể cho ra trường hợp "điểm cao mà xếp loại thấp", tôi chọn giữ nguyên công thức theo văn bản, chỉ thêm giải thích và ô cảnh báo đỏ khi hai thứ chênh nhau.

**Cách áp dụng.** Trước khi nghiệm thu một màn hình, hỏi bốn câu:

1. Phần mềm đang đưa ra kết luận nào: xếp loại, đạt hay không, còn hay hết hiệu lực?
2. Kết luận ấy đã có bước xác nhận, ghi tên và ngày, của người có thẩm quyền chưa?
3. Sửa dữ liệu đầu vào sau khi đã xác nhận thì điều gì xảy ra?
4. Phần mềm có giải thích vì sao nó đề xuất như vậy không?

Khối "Vì sao xếp loại này" của phân hệ đánh giá cán bộ trả lời câu thứ tư: người duyệt cần lý do, không chỉ cần con số. Điều khoản hiểu được nhiều cách thì để AI liệt kê các cách hiểu và hệ quả; người có thẩm quyền chọn; nhật ký ghi lại.

::: {.lenhmau}
**Câu lệnh mẫu 4.1 — Rà soát những chỗ phần mềm đang quyết định thay người**

```text
CHƯA SỬA TỆP NÀO. Rà soát phân hệ [tên, đường dẫn] và lập bảng mọi chỗ
phần mềm tự đưa ra kết luận về người hoặc văn bản: xếp loại, đạt/không đạt,
hiệu lực văn bản, được chọn/bị loại, tự gửi đi, tự lưu đè. Mỗi chỗ ghi:
1. Kết luận gì, ở màn hình nào, hàm nào tính ra.
2. Đã có bước xác nhận của người có thẩm quyền, có ghi tên, ngày chưa.
3. Sửa dữ liệu đầu vào sau khi đã xác nhận thì điều gì xảy ra.
4. Giao diện có giải thích lý do cho người duyệt không.
Đề xuất cách sửa cho chỗ còn thiếu, xếp theo mức rủi ro. Chỗ nào quy định
hiểu được nhiều cách thì liệt kê các cách hiểu và hệ quả để tôi quyết.
Trả lời bằng tiếng Việt, không dán mã.
```
:::

## 4.2. Nguyên tắc thứ hai: Đúng nghiệp vụ trước, đẹp giao diện sau

**Phát biểu.** Phần mềm nghiệp vụ trước hết phải đúng văn bản gốc, đúng biểu mẫu đang dùng thật, đúng công thức, đúng thể thức. Đẹp là việc sau. Màn hình đẹp mà tính sai gây hại hơn bảng tính xấu mà đúng, vì người ta dễ tin cái đẹp.

**Vì sao.** Tác tử AI dựng giao diện rất nhanh và bắt mắt, chính điều đó đánh lừa người nghiệm thu. Sai nghiệp vụ nằm trong một hệ số, một ngưỡng, một ô bị đóng cứng, không hiện ra trên màn hình. AI không biết biểu mẫu cơ quan mình trông ra sao, con số nào cố định, con số nào do mỗi người tự đề xuất; cán bộ hiểu nghiệp vụ thì biết.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch giữa phần mềm và tờ giấy**

Phân hệ Kiểm điểm ban đầu được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy và trông đầy đủ. Ngày 28/9/2026, tôi đặt cạnh nó hai biểu mẫu giấy của chính mình, bản tự đánh giá Quý III và bản kế hoạch Quý IV/2026, rồi đối chiếu từng ô. Lộ ra bốn chỗ lệch lớn. Một, quy trình thật có hai bước: đầu quý lập kế hoạch trình tập thể lãnh đạo duyệt, cuối quý tự đánh giá ngay trên kế hoạch đó; phần mềm chỉ có một bước. Hai, điểm tối đa của sáu trục do cá nhân đề xuất: hai quý liên tiếp của tôi là 15-20-10-15-5-5 rồi 10-20-10-20-5-5, trong khi phần mềm đóng cứng 15/10/10/15/10/10. Ba, Nhóm A trên giấy chỉ đánh dấu Đảm bảo/Không đảm bảo, phần mềm lại cho nhập điểm lẻ. Bốn, mỗi nhiệm vụ trên giấy có năm cột, phần mềm chỉ có hai.

Thêm một lỗi thể thức: đây là văn bản của Đảng, tiêu đề phải là TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH, phần mềm lại in tên cơ quan hành chính. Không lỗi nào làm giao diện xấu đi; tất cả đều làm phần mềm sai.
:::

**Minh chứng khác.** Ở phân hệ Biểu quyết Online, phần dễ làm đẹp là bảng điện tử 82 ô; phần phải làm đúng là mẫu số. Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15, nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành. Vì vậy phần mềm luôn tính trên 82 chứ không trên số người đã bấm: quá nửa là từ 42/82, hai phần ba là từ 55/82. Ở phân hệ OKR/KPI, bảng tính mô phỏng có trước dòng mã đầu tiên và được coi là bộ ca kiểm thử bắt buộc: phần mềm phải khớp tới hai chữ số thập phân.

**Cách áp dụng.**

1. Đưa cho AI văn bản gốc và biểu mẫu thật đã che thông tin cá nhân; không để AI dựng theo trí nhớ.
2. Làm phần tính toán trước, giao diện sau.
3. Yêu cầu bảng đối chiếu từng mục biểu mẫu với màn hình và với tệp xuất ra.
4. In tệp Word xuất ra, đặt cạnh bản giấy, soát từng ô.
5. Nghi ngờ những gì "tưởng là cố định": đó thường là chỗ sai.
6. Nói rõ loại văn bản: văn bản của Đảng có thể thức khác văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP.

::: {.lenhmau}
**Câu lệnh mẫu 4.2 — Đối chiếu biểu mẫu giấy với phần mềm**

```text
CHƯA SỬA TỆP NÀO. Tôi gửi kèm [tên biểu mẫu] dạng [Word/PDF/ảnh, đã che
thông tin cá nhân]. Lập bảng đối chiếu 4 cột: (1) mục trên biểu mẫu giấy;
(2) ô tương ứng trên màn hình phân hệ [tên]; (3) ô tương ứng trong tệp Word
xuất ra; (4) khớp / lệch / thiếu, kèm mô tả ngắn.
Kiểm riêng: tiêu đề, thể thức (văn bản Đảng hay hành chính); cách chấm
(nhập số, đánh dấu, chọn mức); con số giấy để người dùng tự điền mà phần
mềm lại đóng cứng; tổng điểm thành phần có bằng điểm tối đa không.
Chỉ báo cáo, chưa sửa. Chỗ văn bản và biểu mẫu mâu thuẫn thì nêu để tôi quyết.
```
:::

## 4.3. Nguyên tắc thứ ba: Nhỏ trước, lớn sau; thử nghiệm có nhãn "bản demo"

**Phát biểu.** Bắt đầu từ một bài toán nhỏ, cụ thể, đo được; làm xong, dùng thử, sửa rồi mới mở rộng. Suốt thời gian thử nghiệm, sản phẩm mang nhãn "bản demo thử nghiệm" ở mọi chỗ người dùng nhìn thấy.

**Vì sao.** Lỗi thật chỉ lộ ra khi dùng thật. Lỗi sập phân hệ ngày đầu tháng không thể thấy trong một buổi thử: từ ngày 01/9/2026, ba phân hệ chấm điểm cùng ra trang trắng vì kỳ mới chưa có dữ liệu; bản vá được ghi vào nhật ký ngày 28/9/2026. Hệ thống càng nhỏ, lỗi càng dễ khoanh vùng. Hơn nữa, với tác tử AI, làm thêm rẻ đến mức nguy hiểm: một câu lệnh là có thêm một phiên bản, một tính năng. Chi phí nằm ở lúc bảo trì và tích lũy âm thầm.

**Minh chứng từ dự án.** Hệ thống của Văn phòng khởi đầu chỉ là việc chấm điểm hằng tháng cho cán bộ một cơ quan; các phân hệ khác đến sau, mỗi phân hệ một vòng nhỏ có mục nhật ký riêng. Cũng có lúc tôi để nó phình ra: cùng một logic chấm điểm từng có ba bản giao diện Cổ điển, Mới và PRO, mỗi tính năng phải làm ba lần, đổi bản là có nguy cơ ghi đè dữ liệu của nhau. Tôi gỡ hẳn hai bản (mã cũ vẫn còn trong lịch sử Git); sau đợt tối ưu ấy, gói mã chính tải về trình duyệt giảm từ 639 kB xuống khoảng 178 kB. Làm thêm thì dễ; bớt đi mới cần quyết tâm của người chủ dự án.

Dòng nhãn "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu" có ở đầu trang, trang đăng nhập và chân trang; phân hệ Biểu quyết ghi thêm rằng kết quả hiển thị không phải kết quả biểu quyết chính thức của HĐND tỉnh. Sổ tay AI là một thử nghiệm nhỏ có đo đếm: 06 sổ tay, ít nhất 50 câu hỏi mẫu, thời gian tra cứu giảm ít nhất 30%, ba mốc đến 10/12/2026. Đó là chỉ tiêu đã đăng ký, chưa phải kết quả.

::: {.canhbao}
**Cảnh báo: nhãn "bản demo" không phải tấm khiên**

Nhãn demo không cho phép đưa dữ liệu mật hay dữ liệu cá nhân chưa được bảo vệ lên hệ thống chưa đủ điều kiện. Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro; hiểu thận trọng, việc miễn, loại trừ trách nhiệm gắn với nhiệm vụ, thử nghiệm được phê duyệt và làm đúng quy trình. Ứng dụng tự làm ngoài khuôn khổ ấy không mặc nhiên được miễn; muốn dùng thật, hãy đi con đường chính thức hóa ở Chương 20.
:::

**Cách áp dụng.** Chọn bài toán đầu tiên theo bốn tiêu chí: lặp lại thường xuyên; có quy tắc rõ; dữ liệu vùng XANH hoặc VÀNG đã ẩn danh, không có vùng ĐỎ; người dùng thử ít và ở gần. Làm theo vòng: một việc, dùng thử một đến hai tuần, thu ý kiến, sửa. Gắn nhãn demo ở đầu trang, trang đăng nhập, chân trang, kèm nhãn riêng cạnh dữ liệu mô phỏng. Mỗi tháng tự hỏi tính năng nào không ai dùng, rồi gỡ bớt.

## 4.4. Nguyên tắc thứ tư: Dữ liệu là tài sản của cơ quan; quyền riêng tư được thiết kế từ đầu

**Phát biểu.** Dữ liệu sinh ra trong công việc là tài sản của cơ quan: một nguồn chính thống, có người chịu trách nhiệm, có phân quyền rõ. Quyền riêng tư được đặt vào thiết kế từ đầu, không đợi vá sau. Dữ liệu nhạy cảm không bao giờ nằm trong mã nguồn công khai.

**Vì sao.** Kho mã nguồn (repository) của hệ thống thử nghiệm để công khai, mã chạy trên trình duyệt thì ai cũng xem được. Một số điện thoại lọt vào mã là lọt lâu dài, vì lịch sử sửa đổi vẫn giữ lại. Còn mỗi phân hệ giữ một danh sách riêng thì sớm muộn các bản sẽ lệch nhau.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) phân dữ liệu cá nhân thành hai nhóm: cơ bản và nhạy cảm.
- Nghị định 356/2025/NĐ-CP (hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP): theo Điều 3, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình là dữ liệu cá nhân cơ bản; khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tôn giáo, tình trạng sức khỏe.
- Pháp luật về bảo vệ bí mật nhà nước nghiêm cấm soạn thảo, lưu giữ tài liệu có nội dung bí mật nhà nước trên thiết bị đã hoặc đang kết nối Internet; vì vậy mọi dịch vụ đám mây và dịch vụ AI nói trong sách đều không được dùng cho tài liệu mật.
:::

**Minh chứng từ dự án.** Về nguồn dữ liệu, khách và quản trị từng thấy hai danh sách cán bộ khác nhau, vì khách không được đọc máy chủ nên giao diện tự dựng danh sách mẫu tại chỗ. Dự án chốt: mọi người đọc cùng một nguồn, khách chỉ không được ghi. Danh sách cán bộ cũng về một mối là hồ sơ 2C; khi gộp, hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, còn 27 thay vì 28 người. Họ tên không phải mã định danh; nay hệ thống nhận dạng theo họ tên kèm đơn vị.

Về quyền riêng tư:

- Danh bạ điện thoại thật (111 mục) không nằm trong mã: tệp gốc bị `.gitignore` chặn, Quản trị tự nhập qua giao diện, dữ liệu nằm trên máy chủ và chỉ Quản trị đọc được. Một phép kiểm tự động bảo đảm mã nguồn không chứa số điện thoại nào.
- Hồ sơ cán bộ có số căn cước, số bảo hiểm xã hội, quan hệ gia đình. Ẩn tab không đủ, vì chính sách cũ cho mọi tài khoản đăng nhập đọc mọi dòng; quyền phải được siết ở cơ sở dữ liệu, chỉ hai email Quản trị được đọc, ghi.
- 82 đại biểu trong phân hệ Biểu quyết mang mã DB01 đến DB82, không gắn họ tên thật.
- Mã truy cập của đơn vị chỉ lưu dạng chuỗi băm (hash); khách dùng thử AI được đếm lượt bằng chuỗi băm IP và trình duyệt, không lưu IP gốc. Chuỗi băm như dấu vân tay: đủ để nhận ra, không dựng lại được bàn tay.
- Bot chat không đưa số căn cước, bảo hiểm xã hội, quan hệ gia đình vào ngữ cảnh gửi cho AI. Dặn AI "đừng nói ra" không chắc bằng không đưa vào.
- Khóa bí mật chỉ nằm trong biến môi trường máy chủ, không mang tiền tố `VITE_`, vì biến có tiền tố đó bị nhúng vào mã gửi xuống trình duyệt.
- Có lúc tôi dùng khóa của một dịch vụ AI trung gian vì rẻ. Khi đó câu hỏi cùng số liệu nạp kèm, như họ tên, điểm số, lịch công tác của lãnh đạo, đi qua máy chủ bên thứ ba với chính sách lưu trữ không rõ. Chọn dịch vụ AI là quyết định về dữ liệu, không chỉ về giá.

**Cách áp dụng.** Trước khi thêm một trường dữ liệu, hỏi năm câu: Có thật cần không? Ai được đọc, ghi, và quyền ấy nằm ở máy chủ hay chỉ ở giao diện? Dữ liệu nằm ở đâu? Có bị gửi cho dịch vụ AI hay dịch vụ trung gian nào không? Lên mặt báo thì sao? Thay đổi quyền nào cũng phải thử bằng cả vai khách lẫn vai quản trị.

## 4.5. Nguyên tắc thứ năm: Minh bạch về độ tin cậy

**Phát biểu.** Phần mềm phải nói thật về độ tin cậy của thứ nó hiển thị: số nào là mô phỏng, câu nào do AI viết, dựa trên nguồn nào, chỗ nào chưa kiểm chứng, lúc nào chưa lấy được số liệu.

**Vì sao.** AI viết trơn tru cả khi sai; Tập 1 gọi đó là ảo giác. Câu đúng và câu sai cùng một giọng tự tin thì người đọc không phân biệt được, nhất là trong bản demo, nơi dữ liệu mô phỏng được làm cho giống thật. Luật Trí tuệ nhân tạo cũng đặt ra trách nhiệm minh bạch, thông báo, gắn nhãn đối với nội dung do AI tạo ra trong những trường hợp luật định (Chương 3).

**Minh chứng từ dự án.**

- Biểu quyết Online: dưới bảng điện tử luôn có dòng cho biết bao nhiêu lá phiếu thật do người dùng bấm, số còn lại là dữ liệu mô phỏng. Bộ dữ liệu mẫu cố ý có một nghị quyết chỉ đạt 45% tán thành, không được thông qua. Bot được dặn luôn nhắc "dữ liệu mô phỏng" khi nói về biểu quyết.
- Sổ tay AI, lối tra nhanh tại chỗ, theo nguyên tắc "có nguồn mới trả lời": AI bị cấm dùng kiến thức sẵn có, chỉ trả lời từ các đoạn văn bản vừa truy hồi, mỗi ý gắn số trích dẫn [1], [2] để bấm mở nguyên văn. Không đủ căn cứ thì nói: "Không tìm thấy căn cứ trong nguồn của sổ tay này." Quên trích dẫn thì giao diện tự treo cảnh báo.
- Khi bot hỏi số liệu hệ thống Một dữ liệu, vốn chạy trên máy chủ miễn phí hay "ngủ", trần chờ là 7 giây; quá giờ, AI được dặn nói thật là chưa lấy được số liệu, không đoán.

**Cách áp dụng.** Mỗi ứng dụng cần đủ ba loại nhãn:

| Loại nhãn | Trả lời câu hỏi | Ví dụ trong hệ thống |
|---|---|---|
| Nguồn gốc | Ai tạo ra nội dung này? | "Trả lời bằng AI"; phiếu mô phỏng |
| Độ tin cậy | Đã kiểm chứng chưa? | "Chưa kiểm tra"; "Đã kiểm tra – đạt" |
| Giới hạn | Được dùng đến đâu? | "Chỉ để tham khảo, cần mở văn bản gốc" |

Thông báo lỗi cũng cần minh bạch: dòng tiếng Anh "This operation was aborted" không nói gì với người dùng, một câu tiếng Việt cho biết máy đã chờ quá lâu thì có ích.

::: {.lenhmau}
**Câu lệnh mẫu 4.3 — Gắn nhãn độ tin cậy cho một phân hệ**

```text
CHƯA SỬA TỆP NÀO. Rà soát phân hệ [tên] và liệt kê mọi chỗ đang hiển thị:
(a) dữ liệu mô phỏng hoặc dữ liệu mẫu; (b) nội dung do AI tạo; (c) số liệu
lấy từ hệ thống khác, có thể chậm hoặc lỗi; (d) kết luận chưa được người có
thẩm quyền xác nhận. Mỗi chỗ: đã có nhãn chưa; đề xuất câu chữ nhãn tiếng
Việt, ngắn, đặt ngay cạnh nội dung. Riêng phần AI trả lời: đề xuất cách buộc
trích dẫn nguồn, câu trả lời mẫu khi không đủ căn cứ, cảnh báo khi quên
trích dẫn. Liệt kê luôn thông báo lỗi còn bằng tiếng Anh. Chờ tôi duyệt.
```
:::

## 4.6. Nguyên tắc thứ sáu: Chi phí có trần, rủi ro có chốt chặn

**Phát biểu.** Thứ gì tốn tiền phải có trần, và trần do máy chủ giữ. Thao tác nào có thể gây hại phải có chốt chặn đặt trước. Thiếu cấu hình hay gặp sự cố thì hệ thống mặc định về phía an toàn: đóng chứ không mở, dừng chứ không ghi đè.

**Vì sao.** Dịch vụ AI tính tiền theo lượng chữ xử lý; mở cho khách thì chi phí tăng theo số người ghé thăm, và người không chuyên thường thấy hóa đơn khi đã muộn. Tự lưu, tự gửi tin, tự chạy theo lịch đều tiện, nhưng mỗi thứ tự động là một chỗ có thể sai hàng loạt.

::: {.cauchuyen}
**Câu chuyện thực tế: "This operation was aborted"**

Một thời gian, bot trên Zalo trả lời bằng dòng tiếng Anh ấy; có người nhận hai câu trả lời giống hệt nhau rồi hết lượt hỏi sớm. Nhật ký chẩn đoán cho thấy chuỗi nguyên nhân: dịch vụ AI trung gian trả lời chậm, chạm trần chờ 45 giây; trong lúc chờ, Zalo không nhận được tín hiệu "đã nhận" nên gửi lại nguyên tin; máy chủ không nhớ lần trước, xử lý lần nữa, trừ lượt lần nữa. Hạn mức 30 câu mỗi ngày bị đốt nhanh gấp đôi.

Cách sửa đi qua hai đợt: ghi mã tin vào cơ sở dữ liệu trước khi xử lý, mã trùng bị từ chối, nên mỗi tin chỉ được xử lý một lần; hạ trần chờ xuống 40 giây, thấp hơn giới hạn 60 giây của hàm máy chủ, để kịp báo lỗi bằng tiếng Việt; thêm lệnh để Quản trị mở lại lượt cho người bị trừ oan; ghi số đo thời gian từng khâu để lần sau biết thời gian đi đâu thay vì đoán.
:::

**Minh chứng khác.**

- Hạn mức theo ngày, đếm ở máy chủ, đặt lại lúc 0 giờ theo giờ Việt Nam: Trợ lý AI cho khách 1 lượt, người đăng nhập 5 lượt; khung chat Trang chủ 3 lượt mỗi khách; bot 30 câu mỗi người. Đếm ở trình duyệt thì xóa lịch sử duyệt web là "hồi sinh" lượt.
- Thứ tự các bước: kiểm tra yêu cầu hợp lệ, xác thực, trừ lượt, rồi mới gọi AI. Trừ trước để bấm liên tiếp không lọt trần; kiểm tra trước để không ai mất lượt oan. Khung chat Trang chủ hoàn lượt khi AI lỗi. Thành thật mà nói, khi đọc lại mã để viết sách, tôi thấy điểm nối của Trợ lý AI và Sổ tay AI chưa hoàn lượt khi AI lỗi: một nguyên tắc phải được áp đều ở mọi chỗ, và chỉ rà soát mới thấy chỗ sót.
- Thiếu khóa bí mật máy chủ, tức không đếm được lượt, thì khách bị từ chối. Trần chi phí không được mất hiệu lực chỉ vì quên một dòng cấu hình.
- Không phải việc gì cũng cần AI: câu hỏi thường gặp trả lời bằng kịch bản soạn sẵn, lệnh `/solieu` của bot đọc thẳng cơ sở dữ liệu, bản tin pháp luật vẽ ảnh bằng chương trình. Sổ tay AI chạy trên Gemini Notebook (trước đây là NotebookLM) bằng tài khoản Google của từng cán bộ, nên cơ quan không phát sinh kinh phí.
- Chốt chặn dữ liệu: chỉ ghi đè khi bản trên máy chủ chưa bị người khác sửa; mất mạng thì bản tin dừng, không ghi đè bản cũ; điểm thưởng vượt định mức có trần +5 điểm để không ai hưởng lợi từ khai khống.

**Cách áp dụng.** Bốn câu hỏi cho mọi tính năng: Tốn tiền ở đâu, trần bao nhiêu, ai giữ trần? Cùng một yêu cầu đến hai lần thì sao? Bước sau thất bại thì bước trước có được hoàn lại không? Thiếu cấu hình, mất mạng, dịch vụ ngoài chậm thì hệ thống mở hay đóng? Nhớ cả giới hạn của gói miễn phí: tại thời điểm viết (10/2026), dự án Supabase gói miễn phí bị tạm dừng sau một tuần không hoạt động, còn máy chủ gói miễn phí của Render "ngủ" khi vắng người, lần mở đầu mất 30–60 giây. Các điều kiện này có thể thay đổi.

## 4.7. Nguyên tắc thứ bảy: Ghi chép đầy đủ để người khác tiếp nhận được

**Phát biểu.** Mọi điều quan trọng về một ứng dụng phải được viết ra ở nơi người khác, và tác tử AI ở phiên sau, đọc được: bộ nhớ dự án, nhật ký thay đổi, hướng dẫn sử dụng, chú thích cảnh báo trong mã. Ứng dụng chỉ người làm ra nó hiểu là rủi ro của cơ quan, chưa phải tài sản.

**Vì sao.** Trí nhớ hội thoại của tác tử AI nằm cục bộ trên từng máy, không tự đồng bộ: máy ở nhà không biết máy cơ quan đã bàn gì. Con người cũng quên, cán bộ thì luân chuyển. Và tài liệu cũng lỗi thời: mã đổi mà tài liệu không đổi thì tài liệu nói sai một cách rất tự tin.

**Minh chứng từ dự án.** Tệp `CLAUDE.md` ở thư mục gốc dài một trang, trỏ tới bảy tệp quy tắc theo chủ đề trong `.claude/rules/`, từ tổng quan, kiến trúc, mô hình dữ liệu tới quy ước và nhật ký; tác tử tự đọc chúng đầu mỗi phiên. Bộ nhớ dự án ghi: "Mọi bối cảnh quan trọng phải nằm ở: (a) mã nguồn, (b) commit, (c) `CLAUDE.md` + `.claude/rules/`." Nhật ký thay đổi dài khoảng 24.000 từ, hơn 100 mục, mỗi mục ghi làm gì, vì sao, nguyên nhân gốc, kiểm thử bao nhiêu phép; việc người dùng phải tự làm bằng tay được đánh dấu ⚠️. Ở những dòng mã dễ gây lỗi có chú thích cảnh báo bằng tiếng Việt; chẳng hạn, sau sự cố danh bạ "lưu xong mở lại thì biến mất", hàm chuẩn hóa hồ sơ mang dòng nhắc: thêm trường mới thì phải khai ở đây.

Cũng xin thành thật về chỗ chưa đạt. Tệp kiến thức của bot từng ghi "không đọc được lịch công tác" sau khi bot đã đọc được. Trang hướng dẫn từng ghi ngưỡng xếp loại 80/65 trong khi phần mềm tính 70/50. Các bộ kiểm thử mà nhật ký nhắc nhiều lần lại nằm trong thư mục không đưa lên GitHub, nên máy khác không chạy lại được. Đó là những chỗ người tiếp nhận sẽ vấp.

**Cách áp dụng.** Ứng dụng tự làm, dù nhỏ, nên có năm thứ: trang giới thiệu (làm gì, cho ai, căn cứ nào, thử nghiệm hay chính thức); bộ nhớ dự án cho tác tử AI; nhật ký thay đổi; danh mục việc phải làm bằng tay khi dựng lại trên máy mới; hướng dẫn sử dụng theo vai kèm cách tự chẩn đoán sự cố. Phép thử: một đồng nghiệp chưa từng tham gia, chỉ cầm bộ hồ sơ, có dựng lại được ứng dụng trên máy mới trong một buổi không? Sửa mã thì sửa luôn tài liệu trong cùng lần sửa.

::: {.lenhmau}
**Câu lệnh mẫu 4.4 — Chuẩn bị hồ sơ bàn giao**

```text
Chuẩn bị hồ sơ bàn giao dự án cho một cán bộ chưa từng tham gia, không
chuyên lập trình. Đọc bộ nhớ dự án, nhật ký thay đổi, mã nguồn, rồi:
1. Viết trang giới thiệu: làm gì, cho ai, căn cứ văn bản nào, trạng thái.
2. Lập danh mục việc phải làm bằng tay khi dựng lại trên máy mới: phần mềm
   cần cài, tên biến môi trường (KHÔNG ghi giá trị khóa), lệnh cơ sở dữ
   liệu cần chạy, tài khoản dịch vụ cần có.
3. Liệt kê mọi câu trong hướng dẫn, bộ nhớ dự án, kiến thức của bot đã lỗi
   thời so với mã hiện tại.
4. Liệt kê tệp, bộ kiểm thử chỉ nằm trên máy này, chưa có trên GitHub.
Viết bằng tiếng Việt, chỉ báo cáo; việc sửa để tôi duyệt sau.
```
:::

## 4.8. Bảy nguyên tắc trên một trang

Bảy nguyên tắc đỡ lẫn nhau, nên rà cùng lúc bằng bảng kiểm dưới đây.

| Nguyên tắc | Câu hỏi kiểm tra | Dấu hiệu vi phạm |
|---|---|---|
| 1. Máy đề xuất, người quyết định | Kết luận nào chưa có người xác nhận? | Phần mềm tự xếp loại, tự gán hiệu lực |
| 2. Đúng nghiệp vụ trước | Đã đặt cạnh biểu mẫu giấy chưa? | Con số đóng cứng mà giấy để trống |
| 3. Nhỏ trước, có nhãn demo | Thử nghiệm có đo được không? | Nhiều phiên bản cùng làm một việc |
| 4. Dữ liệu là tài sản | Ai đọc, nằm ở đâu, đi đâu? | Số điện thoại trong mã; ẩn tab thay phân quyền |
| 5. Minh bạch độ tin cậy | Người xem biết số nào là mô phỏng? | AI trả lời không có trích dẫn |
| 6. Chi phí có trần | Tốn tiền ở đâu, ai giữ trần? | Đếm lượt ở trình duyệt; xử lý trùng |
| 7. Ghi chép để bàn giao | Người khác dựng lại được không? | Tài liệu nói khác mã |

::: {.lanhdao}
**Dành cho lãnh đạo**

Khi cán bộ trình một ứng dụng tự làm, đồng chí không cần đọc mã. Hãy yêu cầu trả lời bảy câu hỏi trên bằng văn bản, kèm minh chứng: ảnh màn hình bước phê duyệt, bảng đối chiếu biểu mẫu, danh sách trường dữ liệu và người được đọc, hạn mức chi phí, hồ sơ bàn giao. Ứng dụng chưa trả lời được câu 1, 4 và 6 thì chưa nên mở cho người khác dùng. Đồng thời, hãy bảo vệ người dám làm thử trong khuôn khổ: nhãn demo, dữ liệu không mật, phạm vi hẹp, có nhật ký.
:::

## Tóm tắt chương 4

::: {.tomtat}
1. Máy đề xuất, người quyết định: phê duyệt và khẳng định hiệu lực thuộc về người có thẩm quyền; sửa sau phê duyệt thì phê duyệt tự gỡ.
2. Đúng nghiệp vụ trước: đối chiếu văn bản gốc và biểu mẫu đang dùng thật; nghi ngờ những gì "tưởng là cố định".
3. Nhỏ trước, lớn sau: mỗi vòng một việc, đo được; định kỳ gỡ bớt; nhãn "bản demo thử nghiệm" ở mọi chỗ.
4. Dữ liệu là tài sản của cơ quan: một nguồn, phân quyền ở máy chủ; dữ liệu nhạy cảm không vào mã nguồn hay ngữ cảnh gửi AI.
5. Minh bạch độ tin cậy: nhãn nguồn gốc, độ tin cậy, giới hạn; AI tra cứu phải có trích dẫn.
6. Chi phí có trần do máy chủ giữ; rủi ro có chốt chặn; thiếu cấu hình thì mặc định đóng.
7. Ghi chép để người khác tiếp nhận được; sửa mã thì sửa luôn tài liệu.
:::

## Câu hỏi suy ngẫm và bài tập

1. Với một bảng tính hay phần mềm đang dùng ở phòng, Ban của đồng chí: chỗ nào nó đang "quyết định thay người", và ai nên là người xác nhận?
2. Lấy một biểu mẫu giấy đang dùng, liệt kê các ô do người dùng tự điền, rồi kiểm xem công cụ hiện có đóng cứng ô nào không.
3. Phân loại các trường dữ liệu cá nhân trong một danh sách đồng chí đang quản lý theo Nghị định 356/2025/NĐ-CP. Trường nào có thể bỏ?
4. Dùng Câu lệnh mẫu 4.3 cho một ứng dụng nhỏ của đồng chí: còn bao nhiêu chỗ thiếu nhãn?
5. Với lãnh đạo: cơ quan mình đang yếu nhất ở nguyên tắc nào, và bước đầu tiên để khắc phục là gì?
