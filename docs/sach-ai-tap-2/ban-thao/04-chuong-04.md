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

Công cụ thay đổi nhanh, nguyên tắc bền hơn. Mỗi nguyên tắc trình bày theo bốn bước: phát biểu, vì sao, minh chứng từ dự án, cách áp dụng. Nguyên tắc thứ nhất nối dài nguyên tắc "con người trong vòng lặp" (Human-in-the-Loop) ở Tập 1, mục 7.5; sáu nguyên tắc còn lại là những gì tôi phải học thêm khi chuyển từ người dùng AI sang người cùng AI làm ra công cụ.

## 4.1. Nguyên tắc thứ nhất: Máy đề xuất, người quyết định

**Phát biểu.** Phần mềm được tính toán, gợi ý, cảnh báo, soạn nháp. Quyền kết luận, phê duyệt, khẳng định giá trị pháp lý luôn thuộc về người có thẩm quyền, và màn hình phải thể hiện rõ điều đó: nút "phê duyệt" là của con người, ghi tên người bấm, ngày bấm.

Trong ba mô hình kết hợp con người với AI mà Tập 1 (mục 7.5) đã nêu, đây chính là Mô hình 1 "AI đề xuất, con người duyệt"; Mô hình 3, AI tự động hoàn toàn, không dùng trong khu vực công. Tự làm phần mềm thì phải đúc nguyên tắc ấy vào màn hình.

**Vì sao.** Thứ nhất là trách nhiệm: phần mềm không có tư cách pháp lý; khi kết quả bị thắc mắc, người giải trình là cán bộ có thẩm quyền. Thứ hai, quy trình vốn tách hai tầng: cấp trực tiếp sử dụng cán bộ đề xuất mức xếp loại, cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt. Thứ ba, khi câu chữ quy định hiểu được nhiều cách, AI hay "chọn đại" một cách. Có lúc một nhiệm vụ làm được 9/10 bị máy coi là "không hoàn thành", kéo một người điểm cao xuống mức thấp nhất; cách hiểu được chốt sau đó là chỉ dưới 50% mới là không hoàn thành. Không có người đọc lại thì lỗi ấy đã nằm yên trong phiếu.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Thông tư 05/2026/TT-BKHCN ngày 10/3/2026 (hiệu lực cùng ngày) quy định Khung đạo đức trí tuệ nhân tạo quốc gia, áp dụng bắt buộc với cơ quan quản lý nhà nước và tổ chức, cá nhân triển khai, sử dụng AI phục vụ quản lý nhà nước, dịch vụ công; giữ nguyên tắc con người nắm thẩm quyền quyết định cuối cùng.
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương khuyến khích "ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ" (điểm 1.2), đồng thời giao việc quyết định, phê duyệt cho cấp có thẩm quyền quản lý cán bộ (điểm 2.2).

Đối chiếu đến ngày 26/10/2026; nên tra nguyên văn trước khi viện dẫn.
:::

**Minh chứng từ dự án.** Trong hệ thống thử nghiệm của Văn phòng (`https://hdndthkpi.vercel.app`):

- Ở phân hệ Đánh giá OKR/KPI và phân hệ Kiểm điểm, mỗi điểm số có hai cột Tự đánh giá và Cấp duyệt; cột Cấp duyệt mặc định lấy theo cột Tự đánh giá, người có thẩm quyền sửa khi cần, và chính nó dùng để xếp loại. Nút "Phê duyệt & xuất phiếu" chỉ hiện với người đã đăng nhập có thẩm quyền, ghi họ tên, vai trò, ngày. Sửa điểm sau khi đã phê duyệt thì phê duyệt tự gỡ; phân hệ Tiêu chí Hội đồng nhân dân (HĐND) cũng vậy.
- Ở phân hệ Sổ tay AI, 21 văn bản gợi ý đặt sẵn ở trạng thái "Chưa xác định hiệu lực", "Chưa kiểm tra". Chú thích trong mã ghi thẳng: phần mềm không tự gán "còn hiệu lực" cho văn bản nào, vì máy không có thẩm quyền đó; bốn phép kiểm tự động giữ điều này.
- Ở hệ thống Giám sát số, máy rà dấu hiệu, chấm rủi ro, xếp hạng nghị quyết cấp xã rồi trình danh mục; Thường trực HĐND tỉnh quyết định, không bốc thăm tự động.
- Sáu chỗ chưa nhất quán trong dự thảo Khung tiêu chí đánh giá HĐND được chuẩn hóa có ghi chú và hiện công khai dưới dạng kiến nghị, không im lặng chọn một cách hiểu (chi tiết ở Chương 8, mục 8.5).

**Cách áp dụng.** Trước khi nghiệm thu một màn hình, hỏi bốn câu:

1. Phần mềm đang đưa ra kết luận nào: xếp loại, đạt hay không, còn hay hết hiệu lực?
2. Kết luận ấy đã có bước xác nhận, ghi tên và ngày, của người có thẩm quyền chưa?
3. Sửa dữ liệu đầu vào sau khi đã xác nhận thì điều gì xảy ra?
4. Phần mềm có giải thích vì sao nó đề xuất như vậy không?

Khối "Vì sao ở mức này" ở phân hệ Đánh giá OKR/KPI trả lời câu thứ tư: người duyệt cần lý do, không chỉ con số.

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

Phân hệ Kiểm điểm ban đầu được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy và trông đầy đủ. Đợt sửa ghi ngày 28/9/2026 bắt đầu từ việc tôi đặt cạnh nó hai biểu mẫu giấy của chính mình: bản tự đánh giá Quý III và bản kế hoạch Quý IV/2026. Lộ ra bốn chỗ lệch lớn: quy trình thật có hai bước (lập kế hoạch đầu quý, tự đánh giá cuối quý), phần mềm chỉ có một; điểm tối đa sáu trục do cá nhân đề xuất (hai quý của tôi là 15-20-10-15-5-5 rồi 10-20-10-20-5-5), phần mềm lại đóng cứng; Nhóm A trên giấy chỉ đánh dấu Đảm bảo/Không đảm bảo, phần mềm cho nhập điểm lẻ; mỗi nhiệm vụ trên giấy có năm cột, phần mềm chỉ có hai. Thêm một lỗi thể thức: văn bản của Đảng mà phần mềm in tên cơ quan hành chính ở tiêu đề.

Không lỗi nào làm giao diện xấu đi; tất cả đều làm phần mềm sai. Cách đối chiếu từng ô được trình bày kỹ ở Chương 8, mục 8.4.
:::

**Minh chứng khác.** Ở phân hệ Biểu quyết Online, phần dễ làm đẹp là bảng điện tử 82 ô; phần phải làm đúng là mẫu số. Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15, nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành. Vì vậy phần mềm luôn tính trên 82 chứ không trên số người đã bấm: quá nửa là từ 42/82, hai phần ba là từ 55/82.

**Cách áp dụng.**

1. Đưa cho AI văn bản gốc và biểu mẫu thật đã che thông tin cá nhân; không để AI dựng theo trí nhớ.
2. Làm phần tính toán trước, giao diện sau; kết quả phải khớp bảng tính mô phỏng nếu có.
3. Yêu cầu AI lập bảng đối chiếu từng mục biểu mẫu với màn hình và tệp xuất ra (Câu lệnh mẫu 8.4 ở Chương 8), rồi in tệp Word đặt cạnh bản giấy, soát từng ô.
4. Nghi ngờ những gì "tưởng là cố định": đó thường là chỗ sai. Nói rõ loại văn bản, vì văn bản của Đảng có thể thức khác văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP.

## 4.3. Nguyên tắc thứ ba: Nhỏ trước, lớn sau; thử nghiệm có nhãn "bản demo"

**Phát biểu.** Bắt đầu từ một bài toán nhỏ, cụ thể, đo được; làm xong, dùng thử, sửa rồi mới mở rộng. Suốt thời gian thử nghiệm, sản phẩm mang nhãn "bản demo thử nghiệm" ở mọi chỗ người dùng nhìn thấy.

**Vì sao.** Lỗi thật chỉ lộ ra khi dùng thật. Lỗi sập phân hệ ngày đầu tháng không thể thấy trong một buổi thử: từ ngày 01/9/2026, ba phân hệ OKR/KPI, Kiểm điểm và Quản lý cán bộ cùng ra trang trắng vì kỳ mới chưa có dữ liệu; bản vá được ghi vào nhật ký ngày 28/9/2026. Hệ thống càng nhỏ, lỗi càng dễ khoanh vùng. Với tác tử AI, làm thêm rẻ đến mức nguy hiểm: một câu lệnh là có thêm một tính năng, còn chi phí bảo trì thì tích lũy âm thầm.

**Minh chứng từ dự án.** Hệ thống của Văn phòng khởi đầu chỉ là việc chấm điểm hằng tháng cho cán bộ một cơ quan; các phân hệ khác đến sau, mỗi phân hệ một vòng nhỏ có mục nhật ký riêng. Cũng có lúc tôi để nó phình ra: cùng một logic chấm điểm từng có ba bản giao diện Cổ điển, Mới và PRO, mỗi tính năng phải làm ba lần, đổi bản là có nguy cơ ghi đè dữ liệu của nhau. Tôi gỡ hẳn hai bản (mã cũ vẫn nằm trong lịch sử sửa đổi Git, khôi phục được khi cần); qua các đợt tối ưu và gỡ bỏ ấy, gói mã chính trình duyệt phải tải giảm từ 639 kB xuống khoảng 178 kB. Làm thêm thì dễ; bớt đi mới cần quyết tâm của người chủ dự án.

Dòng nhãn "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu" có ở đầu trang, trang đăng nhập và chân trang; phân hệ Biểu quyết ghi thêm rằng kết quả hiển thị không phải kết quả biểu quyết chính thức của HĐND tỉnh. Sổ tay AI là một thử nghiệm nhỏ có đo đếm: 06 sổ tay, ít nhất 50 câu hỏi mẫu, thời gian tra cứu giảm ít nhất 30%, ba mốc đến 10/12/2026. Đó là chỉ tiêu đã đăng ký, chưa phải kết quả.

::: {.canhbao}
**Cảnh báo: nhãn "bản demo" không phải tấm khiên**

Nhãn demo không cho phép đưa dữ liệu mật hay dữ liệu cá nhân chưa được bảo vệ lên hệ thống chưa đủ điều kiện. Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro; hiểu thận trọng, việc miễn, loại trừ trách nhiệm gắn với nhiệm vụ, thử nghiệm được phê duyệt và làm đúng quy trình. Ứng dụng tự làm ngoài khuôn khổ ấy không mặc nhiên được miễn; muốn dùng thật, hãy đi con đường chính thức hóa ở Chương 20.
:::

**Cách áp dụng.** Chọn bài toán đầu tiên theo bốn tiêu chí: lặp lại thường xuyên; có quy tắc rõ; dữ liệu chỉ ở Cấp 1 (Công khai) hoặc Cấp 2 (Nội bộ) đã ẩn danh theo phân loại 4 cấp của Tập 1 (mục 7.1–7.2), tuyệt đối không có dữ liệu Cấp 3, Cấp 4; người dùng thử ít và ở gần. Làm theo vòng: một việc, dùng thử một đến hai tuần, thu ý kiến, sửa. Gắn nhãn demo ở cả ba chỗ kể trên, kèm nhãn riêng cạnh dữ liệu mô phỏng. Mỗi tháng tự hỏi tính năng nào không ai dùng, rồi gỡ bớt.

## 4.4. Nguyên tắc thứ tư: Dữ liệu là tài sản của cơ quan; quyền riêng tư được thiết kế từ đầu

**Phát biểu.** Dữ liệu sinh ra trong công việc là tài sản của cơ quan: một nguồn chính thống, có người chịu trách nhiệm, có phân quyền rõ. Quyền riêng tư được đặt vào thiết kế từ đầu, không đợi vá sau. Dữ liệu nhạy cảm không bao giờ nằm trong mã nguồn công khai.

**Vì sao.** Kho mã nguồn (repository) của hệ thống thử nghiệm để công khai, mã chạy trên trình duyệt thì ai cũng xem được. Một số điện thoại lọt vào mã là lọt lâu dài, vì lịch sử sửa đổi vẫn giữ lại. Còn mỗi phân hệ giữ một danh sách riêng thì sớm muộn các bản sẽ lệch nhau.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) phân dữ liệu cá nhân thành hai nhóm: cơ bản và nhạy cảm.
- Nghị định 356/2025/NĐ-CP (hiệu lực từ 01/01/2026; Nghị định 13/2023/NĐ-CP mà Tập 1 dẫn đã hết hiệu lực từ ngày đó): theo Điều 3, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình là dữ liệu cá nhân cơ bản; khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tôn giáo, tình trạng sức khỏe.
- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực từ 01/3/2026): Điều 5 nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng viễn thông, mạng máy tính (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu); khoản 10 Điều 5 cấm dùng hệ thống trí tuệ nhân tạo để xâm phạm bí mật nhà nước. Vì thế dịch vụ đám mây và dịch vụ AI không được dùng cho tài liệu mật.

Phân tích đầy đủ ở Chương 3, mục 3.3 và 3.4; đối chiếu đến ngày 26/10/2026.
:::

**Minh chứng từ dự án.** Khách và quản trị từng thấy hai danh sách cán bộ khác nhau, vì giao diện tự dựng danh sách mẫu cho khách; nay mọi người đọc cùng một nguồn, khách chỉ không được ghi. Danh sách cán bộ cũng về một mối là hồ sơ 2C; khi gộp, hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, còn 27 thay vì 28 người. Họ tên không phải mã định danh; nay hệ thống nhận dạng theo họ tên kèm đơn vị.

Về quyền riêng tư:

- Danh bạ điện thoại thật (111 mục) không nằm trong mã: tệp gốc bị chặn khỏi kho mã, Quản trị tự nhập qua giao diện, dữ liệu nằm trên máy chủ, chỉ Quản trị đọc được; một phép kiểm tự động bảo đảm mã nguồn không chứa số điện thoại nào.
- Hồ sơ cán bộ có số căn cước, quan hệ gia đình. Ẩn tab trên giao diện không đủ; quyền phải siết ở cơ sở dữ liệu, chỉ hai email Quản trị được đọc, ghi.
- Mã truy cập của đơn vị chỉ lưu dạng chuỗi băm (hash); khách dùng thử AI được đếm lượt bằng chuỗi băm IP và trình duyệt, không lưu IP gốc. Chuỗi băm như dấu vân tay: đủ để nhận ra, không dựng lại được bàn tay.
- Bot chat không đưa số căn cước, bảo hiểm xã hội, quan hệ gia đình vào ngữ cảnh gửi cho AI. Dặn AI "đừng nói ra" không chắc bằng không đưa vào.
- Khóa bí mật (giống chìa khóa két của cơ quan) chỉ nằm trong phần cấu hình riêng của máy chủ, gọi là biến môi trường, không bao giờ nằm trong mã gửi xuống trình duyệt của người xem.
- Có lúc tôi dùng khóa của một dịch vụ AI trung gian vì rẻ; khi đó câu hỏi cùng số liệu nạp kèm đi qua máy chủ bên thứ ba. Chọn dịch vụ AI là quyết định về dữ liệu, không chỉ giá.

**Cách áp dụng.** Trước hết, xếp dữ liệu của ứng dụng theo phân loại 4 cấp của Tập 1 (mục 7.1–7.2): Cấp 1 Công khai dùng được với mọi AI; Cấp 2 Nội bộ chỉ dùng với AI có cam kết bảo mật cho tổ chức, sau khi ẩn danh; Cấp 3 Hạn chế tiếp cận (hồ sơ cán bộ, danh bạ, đơn thư) chỉ dùng với AI đặt máy chủ tại Việt Nam hoặc tự triển khai; Cấp 4 Bí mật nhà nước không bao giờ đưa vào AI nước ngoài, không soạn thảo, lưu giữ trên thiết bị kết nối Internet. Khi không chắc chắn, chọn cấp cao hơn. Ứng dụng chạy trên dịch vụ đám mây chỉ giữ những trường Cấp 3 thật cần, phân quyền chặt, không gửi chúng cho AI nước ngoài; Cấp 4 không bao giờ được đưa lên.

Sau đó, trước khi thêm một trường dữ liệu, hỏi năm câu: Có thật cần không? Ai được đọc, ghi, và quyền ấy nằm ở máy chủ hay chỉ ở giao diện? Dữ liệu nằm ở đâu? Có bị gửi cho dịch vụ AI hay dịch vụ trung gian nào không? Nếu lộ ra ngoài thì hậu quả thế nào? Thay đổi quyền nào cũng phải thử bằng cả vai khách lẫn vai quản trị.

## 4.5. Nguyên tắc thứ năm: Minh bạch về độ tin cậy

**Phát biểu.** Phần mềm phải nói thật về độ tin cậy của thứ nó hiển thị: số nào là mô phỏng, câu nào do AI viết, dựa trên nguồn nào, chỗ nào chưa kiểm chứng, lúc nào chưa lấy được số liệu.

**Vì sao.** AI viết trơn tru cả khi sai. Tập 1 (mục 1.3) đã cảnh báo: AI không tự kiểm tra chính xác được số liệu và không biết các quy định mới nhất. Câu đúng và câu sai cùng một giọng tự tin thì người đọc khó phân biệt, nhất là trong bản demo có dữ liệu mô phỏng giống thật. Luật Trí tuệ nhân tạo cũng đặt ra trách nhiệm minh bạch, thông báo, gắn nhãn đối với nội dung do AI tạo ra trong những trường hợp luật định (xem Chương 3, mục 3.2.1).

**Minh chứng từ dự án.**

- Biểu quyết Online: dưới bảng điện tử luôn có dòng cho biết bao nhiêu lá phiếu thật do người dùng bấm, số còn lại là dữ liệu mô phỏng; dữ liệu mẫu cố ý có một nghị quyết chỉ đạt 45% tán thành, không được thông qua. Bot được dặn luôn nhắc "dữ liệu mô phỏng" khi nói về biểu quyết.
- Sổ tay AI, lối tra nhanh tại chỗ, theo nguyên tắc "có nguồn mới trả lời": AI bị cấm dùng kiến thức sẵn có, chỉ trả lời từ các đoạn văn bản vừa truy hồi, mỗi ý gắn số trích dẫn [1], [2] để bấm mở nguyên văn. Không đủ căn cứ thì nói: "Không tìm thấy căn cứ trong nguồn của sổ tay này." Quên trích dẫn thì giao diện tự treo cảnh báo.
- Khi bot hỏi số liệu hệ thống Một dữ liệu, vốn chạy trên máy chủ miễn phí hay "ngủ", trần chờ là 7 giây; quá giờ, AI được dặn nói thật là chưa lấy được số liệu, không đoán.

**Cách áp dụng.** Mỗi ứng dụng cần đủ ba loại nhãn:

| Loại nhãn | Trả lời câu hỏi | Ví dụ trong hệ thống |
|---|---|---|
| Nguồn gốc | Ai tạo ra nội dung này? | "Trả lời bằng AI"; phiếu mô phỏng |
| Độ tin cậy | Đã kiểm chứng chưa? | "Chưa kiểm tra"; "Đã kiểm tra - đạt" |
| Giới hạn | Được dùng đến đâu? | "Chỉ để tham khảo, cần mở văn bản gốc" |

Thông báo lỗi cũng phải nói thật, bằng tiếng Việt (xem mục 4.6).

::: {.lenhmau}
**Câu lệnh mẫu 4.2 — Gắn nhãn độ tin cậy cho một phân hệ**

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

**Phát biểu.** Thứ gì tốn tiền phải có trần, do máy chủ giữ. Thao tác nào có thể gây hại phải có chốt chặn đặt trước. Thiếu cấu hình hay gặp sự cố thì hệ thống mặc định về phía an toàn: đóng chứ không mở, dừng chứ không ghi đè.

**Vì sao.** Dịch vụ AI tính tiền theo lượng chữ xử lý; mở cho khách thì chi phí tăng theo số người ghé thăm, và người không chuyên thường thấy hóa đơn khi đã muộn. Tự lưu, tự gửi tin, tự chạy theo lịch đều tiện, nhưng mỗi thứ tự động có thể sai hàng loạt.

::: {.cauchuyen}
**Câu chuyện thực tế: "This operation was aborted"**

Một thời gian, bot trên Zalo trả lời bằng dòng tiếng Anh ấy; có người nhận hai câu trả lời giống hệt nhau rồi hết lượt hỏi sớm. Nhật ký chẩn đoán cho thấy chuỗi nguyên nhân: dịch vụ AI trung gian trả lời chậm, chạm trần chờ 45 giây; trong lúc chờ, Zalo không nhận được tín hiệu "đã nhận" nên gửi lại nguyên tin; máy chủ không nhớ lần trước, xử lý lần nữa, trừ lượt lần nữa. Hạn mức 30 câu mỗi ngày bị đốt nhanh gấp đôi.

Giống như bưu tá gõ cửa chưa thấy ai ra liền gõ thêm lần nữa, trong nhà có hai người cùng ra nhận và cùng viết thư trả lời.

Cách sửa: ghi mã tin vào cơ sở dữ liệu trước khi xử lý, mã trùng bị từ chối nên mỗi tin chỉ được xử lý một lần; hạ trần chờ xuống 40 giây, thấp hơn giới hạn 60 giây của hàm máy chủ, để kịp báo lỗi bằng tiếng Việt; thêm lệnh để Quản trị mở lại lượt bị trừ oan; ghi số đo thời gian từng khâu. Chương 14 kể lại đầy đủ.
:::

**Minh chứng khác.**

- Hạn mức theo ngày, đếm ở máy chủ, đặt lại lúc 0 giờ theo giờ Việt Nam: Trợ lý AI cho khách 1 lượt, người đăng nhập 5 lượt; khung chat Trang chủ 3 lượt mỗi khách; bot 30 câu mỗi người. Đếm ở trình duyệt thì xóa lịch sử duyệt web là có lại lượt.
- Thứ tự các bước: kiểm tra yêu cầu hợp lệ, xác thực, trừ lượt, rồi mới gọi AI. Trừ trước để bấm liên tiếp không lọt trần; kiểm tra trước để không ai mất lượt oan. Khung chat Trang chủ hoàn lượt khi AI lỗi; nhưng khi đọc lại mã để viết sách, tôi thấy Trợ lý AI và Sổ tay AI chưa làm vậy. Nguyên tắc phải áp đều mọi chỗ, và chỉ rà soát mới thấy chỗ sót.
- Thiếu khóa bí mật máy chủ, tức không đếm được lượt, thì khách bị từ chối: trần chi phí không được mất hiệu lực vì quên một dòng cấu hình.
- Không phải việc gì cũng cần AI: câu hỏi thường gặp trả lời bằng kịch bản soạn sẵn, lệnh `/solieu` của bot đọc thẳng cơ sở dữ liệu, bản tin pháp luật vẽ ảnh bằng chương trình. Hỏi đáp của Sổ tay AI chạy trên Gemini Notebook (trước đây là NotebookLM, nay ở `notebook.google.com`) bằng tài khoản Google của từng cán bộ nên cơ quan không phát sinh kinh phí; nguồn nạp lên nằm trên máy chủ của Google nên chỉ nạp văn bản công khai.
- Chốt chặn dữ liệu: chỉ ghi đè khi bản trên máy chủ chưa bị người khác sửa; mất mạng thì bản tin dừng, không ghi đè bản cũ; điểm thưởng vượt định mức có trần +5 điểm để không ai hưởng lợi từ khai khống.

**Cách áp dụng.** Bốn câu hỏi cho mọi tính năng: Tốn tiền ở đâu, trần bao nhiêu, ai giữ trần? Cùng một yêu cầu đến hai lần thì sao? Bước sau thất bại thì bước trước có được hoàn lại không? Thiếu cấu hình, mất mạng, dịch vụ ngoài chậm thì hệ thống mở hay đóng? Nhớ cả giới hạn gói miễn phí: dự án Supabase gói miễn phí bị tạm dừng sau một tuần không hoạt động, gói Pro từ 25 USD/tháng (giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi). Chương 19 bàn kỹ về chi phí.

## 4.7. Nguyên tắc thứ bảy: Ghi chép đầy đủ để người khác tiếp nhận được

**Phát biểu.** Mọi điều quan trọng về một ứng dụng phải được viết ra ở nơi người khác, và tác tử AI ở phiên sau, đọc được: bộ nhớ dự án, nhật ký thay đổi, hướng dẫn sử dụng, chú thích cảnh báo trong mã. Ứng dụng chỉ người làm ra nó hiểu là rủi ro của cơ quan, chưa phải tài sản.

**Vì sao.** Trí nhớ hội thoại của tác tử AI nằm cục bộ trên từng máy: máy ở nhà không biết máy cơ quan đã bàn gì. Con người cũng quên, cán bộ thì luân chuyển. Tài liệu cũng lỗi thời: mã đổi mà tài liệu không đổi thì tài liệu nói sai một cách rất tự tin.

**Minh chứng từ dự án.** Tệp `CLAUDE.md` ở thư mục gốc dài một trang, trỏ tới bảy tệp quy tắc theo chủ đề trong `.claude/rules/`; tác tử tự đọc chúng đầu mỗi phiên. Bộ nhớ dự án ghi: "Mọi bối cảnh quan trọng phải nằm ở: (a) mã nguồn, (b) commit, (c) `CLAUDE.md` + `.claude/rules/`." Nhật ký thay đổi dài khoảng 24.000 từ, hơn 100 mục, mỗi mục ghi làm gì, vì sao, nguyên nhân gốc, kiểm thử bao nhiêu phép; việc người dùng phải tự làm bằng tay được đánh dấu ⚠️. Ở những dòng mã dễ gây lỗi có chú thích cảnh báo bằng tiếng Việt; chẳng hạn, sau sự cố danh bạ "lưu xong mở lại thì biến mất", hàm chuẩn hóa hồ sơ mang dòng nhắc: thêm trường mới thì phải khai ở đây. Cách tổ chức bộ nhớ dự án và nhật ký được hướng dẫn từng bước ở Chương 7.

Cũng xin thành thật về chỗ chưa đạt: tệp kiến thức của bot từng ghi "không đọc được lịch công tác" sau khi bot đã đọc được; trang hướng dẫn từng ghi ngưỡng xếp loại 80/65 trong khi phần mềm tính 70/50; các bộ kiểm thử nhật ký nhắc nhiều lần lại nằm trong thư mục không đưa lên GitHub, máy khác không chạy lại được. Người tiếp nhận sẽ vấp đúng những chỗ ấy.

**Cách áp dụng.** Ứng dụng tự làm, dù nhỏ, nên có năm thứ: trang giới thiệu (làm gì, cho ai, căn cứ nào, thử nghiệm hay chính thức); bộ nhớ dự án; nhật ký thay đổi; danh mục việc phải làm bằng tay khi dựng lại trên máy mới; hướng dẫn sử dụng theo vai. Phép thử: một đồng nghiệp chưa từng tham gia, chỉ cầm bộ hồ sơ, có dựng lại được ứng dụng trên máy mới trong một buổi không? Câu lệnh mẫu 6.14 ở Chương 6 giúp soạn bộ hồ sơ này. Sửa mã thì sửa luôn tài liệu trong cùng lần sửa.

## 4.8. Bảy nguyên tắc trên một trang

Bảy nguyên tắc đỡ lẫn nhau, nên rà cùng lúc bằng bảng kiểm sau.

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

Cán bộ có thể tự rà trước khi trình bằng câu lệnh dưới đây.

::: {.lenhmau}
**Câu lệnh mẫu 4.3 — Rà soát một ứng dụng theo bảy nguyên tắc**

```text
CHƯA SỬA TỆP NÀO. Rà soát ứng dụng này theo bảy nguyên tắc; mỗi nguyên tắc
ghi Đạt / Chưa đạt / Không áp dụng, kèm minh chứng (tệp, màn hình) và việc
cần làm nếu chưa đạt:
1. Kết luận quan trọng đều có bước xác nhận của người có thẩm quyền.
2. Công thức, biểu mẫu khớp văn bản gốc và biểu mẫu đang dùng.
3. Phạm vi thử nghiệm rõ; nhãn "bản demo thử nghiệm" ở đủ các chỗ.
4. Dữ liệu một nguồn; phân quyền ở máy chủ; không dữ liệu nhạy cảm trong mã.
5. Có nhãn dữ liệu mô phỏng, nhãn nội dung AI, trích dẫn nguồn.
6. Trần chi phí do máy chủ giữ; có chốt chặn khi lỗi, khi yêu cầu gửi trùng.
7. Bộ nhớ dự án, nhật ký, hướng dẫn còn khớp với mã hiện tại.
Xếp việc cần làm theo mức rủi ro. Không ghi giá trị khóa hay dữ liệu cá
nhân vào báo cáo. Trả lời bằng tiếng Việt, không dán mã.
```
:::

## Tóm tắt chương 4

::: {.tomtat}
1. Máy đề xuất, người quyết định; sửa sau phê duyệt thì phê duyệt tự gỡ.
2. Đúng nghiệp vụ trước: đối chiếu văn bản gốc và biểu mẫu đang dùng thật.
3. Nhỏ trước, lớn sau: mỗi vòng một việc, đo được, định kỳ gỡ bớt, luôn có nhãn "bản demo thử nghiệm".
4. Dữ liệu một nguồn, phân quyền ở máy chủ, xếp theo 4 cấp của Tập 1 (khi không chắc, chọn cấp cao hơn); dữ liệu nhạy cảm không vào mã nguồn hay ngữ cảnh gửi AI.
5. Minh bạch: nhãn nguồn gốc, độ tin cậy, giới hạn; AI tra cứu phải có trích dẫn.
6. Chi phí có trần do máy chủ giữ; rủi ro có chốt chặn; thiếu cấu hình thì mặc định đóng.
7. Ghi chép để người khác tiếp nhận được; sửa mã thì sửa luôn tài liệu.
:::

## Câu hỏi suy ngẫm và bài tập

1. Một bảng tính hay phần mềm đang dùng ở phòng, Ban của đồng chí đang "quyết định thay người" ở chỗ nào? Ai nên là người xác nhận?
2. Lấy một biểu mẫu giấy đang dùng, liệt kê các ô do người dùng tự điền, rồi kiểm xem công cụ hiện có đóng cứng ô nào không.
3. Phân loại các trường dữ liệu cá nhân trong một danh sách đồng chí đang quản lý theo Nghị định 356/2025/NĐ-CP. Trường nào có thể bỏ?
4. Dùng Câu lệnh mẫu 4.2 cho một ứng dụng nhỏ: còn bao nhiêu chỗ thiếu nhãn?
5. Với lãnh đạo: cơ quan mình đang yếu nhất ở nguyên tắc nào, bước khắc phục đầu tiên là gì?
