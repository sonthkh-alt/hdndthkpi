# Chương 4. Bảy nguyên tắc vàng của người kiến tạo

::: {.muctieu}
**Mục tiêu của chương**

- Nắm bảy nguyên tắc nền tảng khi cùng AI làm ra ứng dụng phục vụ công việc của cơ quan dân cử.
- Hiểu vì sao mỗi nguyên tắc ra đời, qua những sự cố có thật của hệ thống thử nghiệm của Văn phòng.
- Biết biến từng nguyên tắc thành câu hỏi kiểm tra, câu lệnh giao việc và thao tác nghiệm thu cụ thể.
- Có trong tay một bảng kiểm một trang để rà soát bất kỳ ứng dụng nào trước khi mời người khác dùng.

Dành cho: mọi người đọc. Lãnh đạo nên đọc kỹ các mục 4.1, 4.4, 4.6 và 4.8.
:::

Khi bắt đầu dự án vào giữa năm 2026, tôi không có trong tay một bộ nguyên tắc nào. Tôi có một bài toán chấm điểm, một tác tử AI lập trình (AI coding agent) và khá nhiều tò mò. Bảy nguyên tắc trong chương này hình thành dần, phần lớn sau một lần sai: một phân hệ sập vào ngày đầu tháng, một danh sách cán bộ bị ghi đè, một con bot trả lời hai lần, một biểu mẫu in nhầm tiêu đề. Mỗi lần như vậy, tôi cùng AI tìm nguyên nhân gốc, sửa, rồi viết bài học thành quy tắc trong bộ nhớ dự án để lần sau không lặp lại.

Công cụ thay đổi rất nhanh. Chỉ trong năm 2026, NotebookLM của Google đã đổi tên thành Gemini Notebook và chuyển sang địa chỉ mới; Gemini CLI đã được thay bằng Antigravity CLI đối với người dùng gói miễn phí. Nguyên tắc thì bền hơn công cụ. Đồng chí có thể dùng Claude Code hay một tác tử khác, dùng dịch vụ đám mây miễn phí hay máy chủ của cơ quan; bảy nguyên tắc dưới đây vẫn đúng.

Mỗi nguyên tắc được trình bày theo bốn bước: phát biểu, vì sao, minh chứng từ dự án, cách áp dụng. Nguyên tắc thứ nhất là sự nối dài của "con người trong vòng lặp" ở Tập 1. Sáu nguyên tắc còn lại là những gì tôi phải học thêm khi chuyển từ người dùng AI sang người cùng AI làm ra công cụ. Với lãnh đạo, bảy nguyên tắc còn là bảy câu hỏi để thẩm định một ứng dụng mà không cần đọc một dòng mã.

## 4.1. Nguyên tắc thứ nhất: Máy đề xuất, người quyết định

**Phát biểu.** Phần mềm được tính toán, gợi ý, cảnh báo, soạn nháp. Quyền kết luận, phê duyệt, khẳng định giá trị pháp lý luôn thuộc về người có thẩm quyền. Thiết kế phải làm cho điều đó hiện rõ trên màn hình: nút "phê duyệt" là của con người, ghi tên người bấm và ngày bấm.

**Vì sao.** Có ba lý do. Thứ nhất là trách nhiệm. Phần mềm không có tư cách pháp lý; khi một kết quả đánh giá bị thắc mắc, người phải giải trình là cán bộ có thẩm quyền, không phải chương trình. Thứ hai, quy trình nghiệp vụ vốn đã tách hai tầng. Theo Hướng dẫn 02-HD/BTCTW của Ban Tổ chức Trung ương, cấp trực tiếp sử dụng cán bộ nhận xét, đánh giá, đề xuất mức xếp loại; cấp có thẩm quyền quản lý cán bộ quyết định, phê duyệt. Phần mềm số hóa quy trình thì phải giữ đúng hai tầng ấy.

Thứ ba là thực tế làm việc với AI. Khi câu chữ quy định cho phép nhiều cách hiểu, AI hay "chọn đại" một cách. Ở phân hệ đánh giá cán bộ, có lúc một nhiệm vụ làm được 9/10 bị máy coi là "không hoàn thành", kéo một người có điểm cao xuống mức "Không hoàn thành nhiệm vụ". Cách hiểu đúng, được chốt sau đó, là xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành, từ 50% đến dưới 100% là chưa đạt đủ số lượng. Nếu không có người đọc lại và quyết định cách hiểu, lỗi ấy đã nằm yên trong phiếu đánh giá.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (Quốc hội thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Điều 4 cũng yêu cầu duy trì sự kiểm soát và khả năng can thiệp của con người đối với quyết định, hành vi của hệ thống trí tuệ nhân tạo.
- Thông tư 05/2026/TT-BKHCN ngày 10/3/2026 của Bộ Khoa học và Công nghệ quy định Khung đạo đức trí tuệ nhân tạo quốc gia, hiệu lực cùng ngày ký. Phạm vi áp dụng bắt buộc gồm cơ quan quản lý nhà nước và tổ chức, cá nhân triển khai, sử dụng hệ thống AI phục vụ quản lý nhà nước, cung cấp dịch vụ công. Khung giữ nguyên tắc con người nắm thẩm quyền quyết định cuối cùng.
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026, điểm 1.2, khuyến khích "ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ"; điểm 2.2 giao việc quyết định, phê duyệt cho cấp có thẩm quyền quản lý cán bộ.

Đối chiếu đến ngày 26/10/2026. Trước khi viện dẫn, đồng chí nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
:::

**Minh chứng từ dự án.** Nguyên tắc này có mặt ở hầu hết phân hệ của hệ thống thử nghiệm của Văn phòng (`https://hdndthkpi.vercel.app`).

- Ở phân hệ Đánh giá OKR/KPI và phân hệ Kiểm điểm, mỗi điểm số có hai cột: Tự đánh giá và Cấp duyệt. Cột Cấp duyệt mặc định lấy theo cột Tự đánh giá; người có thẩm quyền sửa khi cần, và chính cột này được dùng để xếp loại. Nút "Phê duyệt & xuất phiếu" chỉ hiện với người đã đăng nhập và có thẩm quyền. Khi bấm, phần mềm ghi họ tên, vai trò, ngày phê duyệt.
- Quan trọng hơn: nếu ai đó sửa một trường chấm điểm sau khi đã phê duyệt, phê duyệt tự động bị gỡ. Kết quả đã được người có thẩm quyền xác nhận không thể bị thay đổi lặng lẽ. Phân hệ Tiêu chí HĐND áp dụng đúng cơ chế đó cho bước phê duyệt của Thường trực Hội đồng nhân dân tỉnh.
- Ở phân hệ Sổ tay AI, danh mục 21 văn bản gợi ý được đặt sẵn ở trạng thái "Chưa xác định hiệu lực", "Chưa kiểm tra", "Chưa xác nhận công khai". Dòng chú thích đầu tệp mã viết thẳng: phần mềm không tự gán "còn hiệu lực" cho bất kỳ văn bản nào, vì máy không có thẩm quyền đó. Cán bộ phải đối chiếu Công báo hoặc Cơ sở dữ liệu quốc gia rồi mới đánh dấu "Đã kiểm tra – đạt". Bốn phép kiểm tự động giữ cho điều này không bị ai vô tình sửa mất.
- Ở hệ thống Giám sát số liên kết từ Trang chủ, máy rà dấu hiệu, chấm rủi ro, xếp hạng nghị quyết của Hội đồng nhân dân (HĐND) cấp xã rồi trình danh mục. Thường trực HĐND tỉnh quyết định chọn nội dung giám sát; không có bốc thăm tự động.
- Khi số hóa dự thảo Khung tiêu chí đánh giá HĐND, phần mềm phát hiện 6 chỗ chưa nhất quán. Nó không im lặng chọn một cách hiểu, mà chuẩn hóa có ghi chú "dự thảo ghi gì – đã chuẩn hóa thế nào", hiện công khai dưới dạng kiến nghị để cơ quan soạn thảo quyết định.

Nguyên tắc này áp dụng cả cho chính quá trình làm phần mềm. Nhật ký dự án có rất nhiều dòng "người dùng chốt". Một ví dụ: khi rà lại công thức, AI chỉ ra rằng cách tính có thể cho ra trường hợp "điểm cao mà xếp loại thấp" và đưa phương án sửa. Tôi chọn giữ nguyên công thức theo văn bản, chỉ giải thích rõ và thêm ô cảnh báo đỏ khi điểm số với xếp loại chênh nhau. AI đề xuất, tôi quyết, nhật ký ghi lại người đã quyết.

**Cách áp dụng.** Trước khi nghiệm thu bất kỳ màn hình nào, đồng chí tự hỏi bốn câu:

1. Ở đâu phần mềm đang đưa ra một kết luận: xếp loại, đạt hay không đạt, còn hay hết hiệu lực, được chọn hay bị loại?
2. Kết luận ấy đã có bước xác nhận của người có thẩm quyền chưa, có ghi tên và ngày không?
3. Nếu dữ liệu đầu vào bị sửa sau khi đã xác nhận thì điều gì xảy ra?
4. Phần mềm có giải thích được vì sao nó đề xuất như vậy không?

Với câu thứ tư, phân hệ đánh giá cán bộ có khối "Vì sao xếp loại này", liệt kê các chỉ số, ngưỡng và lý do hạ mức. Người duyệt cần lý do để quyết định, không chỉ cần con số. Còn khi gặp điều khoản hiểu được nhiều cách, đừng để AI tự chọn: yêu cầu nó liệt kê các cách hiểu và hệ quả của từng cách, người có thẩm quyền chọn, nhật ký ghi lại lựa chọn.

::: {.lenhmau}
**Câu lệnh mẫu 4.1 — Rà soát những chỗ phần mềm đang quyết định thay người**

```text
CHƯA SỬA TỆP NÀO. Hãy rà soát phân hệ [tên phân hệ, đường dẫn] và lập bảng
mọi chỗ phần mềm tự đưa ra kết luận về con người hoặc văn bản: xếp loại,
đạt/không đạt, hiệu lực văn bản, được chọn/bị loại, tự gửi đi, tự lưu đè.
Với mỗi chỗ, ghi 4 cột:
1. Kết luận gì, ở màn hình nào, hàm nào tính ra.
2. Đã có bước xác nhận của người có thẩm quyền chưa; có ghi tên, ngày không.
3. Sửa dữ liệu đầu vào sau khi đã xác nhận thì điều gì xảy ra.
4. Giao diện có giải thích lý do cho người duyệt không.
Cuối bảng, đề xuất cách sửa cho từng chỗ còn thiếu, xếp theo mức rủi ro.
Chỗ nào câu chữ quy định hiểu được nhiều cách thì liệt kê các cách hiểu và
hệ quả của từng cách để tôi quyết. Trả lời bằng tiếng Việt, không dán mã.
```
:::

## 4.2. Nguyên tắc thứ hai: Đúng nghiệp vụ trước, đẹp giao diện sau

**Phát biểu.** Phần mềm nghiệp vụ trước hết phải đúng: đúng văn bản gốc, đúng biểu mẫu đang dùng thật, đúng công thức, đúng thể thức. Đẹp là việc sau. Một màn hình đẹp mà tính sai gây hại nhiều hơn một bảng tính xấu mà đúng, vì người ta dễ tin cái đẹp.

**Vì sao.** Tác tử AI dựng giao diện rất nhanh và rất bắt mắt: thẻ màu, biểu đồ, nút cỡ lớn, chỉ trong một buổi. Chính điều đó đánh lừa người nghiệm thu. Sai nghiệp vụ không hiện ra trên màn hình; nó nằm trong một hệ số, một ngưỡng, một ô bị đóng cứng. AI không biết biểu mẫu cơ quan mình đang dùng trông ra sao, cũng không biết một con số trong văn bản là cố định hay do mỗi người tự đề xuất. Người phát hiện được những chỗ ấy là người hiểu nghiệp vụ, tức chính cán bộ đặt hàng.

::: {.cauchuyen}
**Câu chuyện thực tế: bốn chỗ lệch giữa phần mềm và tờ giấy**

Phân hệ Kiểm điểm ban đầu được dựng theo Hướng dẫn 03-HD/TU ngày 02/7/2026 của Tỉnh ủy. Trên màn hình, mọi thứ trông đầy đủ. Ngày 28/9/2026, tôi đặt cạnh nó hai biểu mẫu giấy của chính mình: bản tự đánh giá Quý III và bản kế hoạch Quý IV/2026. Đối chiếu từng ô, lộ ra bốn chỗ lệch lớn.

Một là quy trình thật có hai bước: đầu quý lập kế hoạch, trình tập thể lãnh đạo duyệt; cuối quý tự đánh giá ngay trên kế hoạch đó. Phần mềm chỉ có một bước. Hai là điểm tối đa của sáu trục không cố định mà do cá nhân đề xuất theo thứ tự ưu tiên. Hai quý liên tiếp của tôi đã khác nhau (15-20-10-15-5-5 rồi 10-20-10-20-5-5), trong khi phần mềm đóng cứng 15/10/10/15/10/10. Ba là Nhóm A trên giấy chỉ có hai ô đánh dấu Đảm bảo/Không đảm bảo, phần mềm lại cho nhập điểm lẻ. Bốn là mỗi nhiệm vụ trên giấy có năm cột, phần mềm chỉ có hai.

Còn thêm một lỗi thể thức: đây là văn bản của Đảng, tiêu đề phải là TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH, nhưng phần mềm in tên cơ quan hành chính. Không lỗi nào trong số đó làm giao diện xấu đi. Tất cả đều làm phần mềm sai.
:::

**Minh chứng khác.** Ở phân hệ Biểu quyết Online, phần dễ làm đẹp là bảng điện tử 82 ô và ba nút bấm lớn. Phần phải làm đúng là mẫu số. Theo Luật Tổ chức chính quyền địa phương số 72/2025/QH15, nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành. Mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm. Vì vậy phần mềm luôn tính trên 82: quá nửa là từ 42/82, hai phần ba là từ 55/82, và kết luận nêu rõ còn thiếu bao nhiêu phiếu.

Ở phân hệ Đánh giá OKR/KPI, trước khi có dòng mã nào, công thức đã được dựng thành bảng tính mô phỏng. Bản đặc tả yêu cầu coi bảng tính ấy là bộ ca kiểm thử bắt buộc: cùng đầu vào, phần mềm phải cho kết quả khớp tới hai chữ số thập phân.

**Cách áp dụng.**

1. Đưa cho AI văn bản gốc và biểu mẫu đang dùng thật, đã che thông tin cá nhân. Không để AI dựng theo trí nhớ của nó.
2. Làm phần tính toán trước, giao diện sau; phần tính toán tách riêng để máy kiểm thử được (Chương 7).
3. Yêu cầu AI lập bảng đối chiếu từng mục biểu mẫu với ô trên màn hình và ô trong tệp xuất ra.
4. Xuất thử tệp Word, in ra, đặt cạnh bản giấy và soát từng ô.
5. Đặc biệt nghi ngờ những gì "tưởng là cố định". Theo kinh nghiệm của tôi, đó thường là chỗ sai.
6. Nói rõ cho AI loại văn bản. Văn bản của Đảng có thể thức khác văn bản hành chính trình bày theo Nghị định 30/2020/NĐ-CP.

::: {.lenhmau}
**Câu lệnh mẫu 4.2 — Đối chiếu biểu mẫu giấy với phần mềm**

```text
CHƯA SỬA TỆP NÀO. Tôi gửi kèm [tên biểu mẫu, ví dụ Phụ lục 3A của Hướng
dẫn 03-HD/TU] dạng [Word/PDF/ảnh chụp, đã che thông tin cá nhân].
Hãy lập bảng đối chiếu 4 cột: (1) mục hoặc cột trên biểu mẫu giấy; (2) ô
tương ứng trên màn hình phân hệ [tên]; (3) ô tương ứng trong tệp Word xuất
ra; (4) khớp / lệch / thiếu, kèm mô tả ngắn.
Kiểm riêng: tiêu đề và thể thức (văn bản Đảng hay văn bản hành chính); cách
chấm (nhập số, đánh dấu, chọn mức); con số nào trên giấy để người dùng tự
điền mà phần mềm lại đóng cứng; tổng điểm thành phần có bằng điểm tối đa
không. Chỉ báo cáo, chưa sửa. Chỗ nào văn bản và biểu mẫu mâu thuẫn nhau
thì nêu rõ để tôi quyết.
```
:::

## 4.3. Nguyên tắc thứ ba: Nhỏ trước, lớn sau; thử nghiệm có nhãn "bản demo"

**Phát biểu.** Bắt đầu từ một bài toán nhỏ, cụ thể, đo được. Làm xong, dùng thử, sửa, rồi mới mở rộng. Suốt thời gian thử nghiệm, sản phẩm mang nhãn "bản demo thử nghiệm" ở mọi chỗ người dùng nhìn thấy.

**Vì sao.** Thứ nhất, lỗi thật chỉ lộ ra khi dùng thật. Lỗi sập phân hệ vào ngày đầu tháng không thể thấy trong một buổi thử; nó chỉ xuất hiện khi lịch sang kỳ mới mà kỳ đó chưa có dữ liệu. Từ ngày 01/9/2026, ba phân hệ chấm điểm cùng ra trang trắng; bản vá được ghi vào nhật ký ngày 28/9/2026. Hệ thống càng nhỏ, lỗi kiểu này càng dễ khoanh vùng. Thứ hai, với tác tử AI, làm thêm rẻ đến mức nguy hiểm. Một câu lệnh là có thêm một phiên bản, một tính năng, một màu giao diện. Chi phí không nằm ở lúc làm mà ở lúc bảo trì, và nó tích lũy âm thầm.

**Minh chứng từ dự án.** Hệ thống của Văn phòng không khởi đầu là một "hệ thống". Nó khởi đầu là việc chấm điểm hằng tháng cho cán bộ một cơ quan: bảng tính mô phỏng, bản đặc tả, rồi ứng dụng web có đăng nhập, lưu theo kỳ, xuất phiếu Word. Các phân hệ khác đến sau, mỗi phân hệ là một vòng nhỏ có mục nhật ký riêng.

Cũng có lúc tôi để nó phình ra. Cùng một logic chấm điểm từng có ba bản giao diện: Cổ điển, Mới và PRO. Mỗi tính năng phải làm ba lần; đổi bản là có nguy cơ ghi đè dữ liệu của bản kia. Tôi quyết định gỡ hẳn hai bản, mã cũ vẫn nằm trong lịch sử Git nếu cần. Sau đợt tối ưu ấy, gói mã chính tải về trình duyệt giảm từ 639 kB xuống khoảng 178 kB. Làm thêm thì dễ; bớt đi mới cần quyết tâm của người chủ dự án.

Về nhãn, dòng chữ "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu" có mặt ở đầu trang ứng dụng, trang đăng nhập và chân trang. Phân hệ Biểu quyết còn ghi thêm: kết quả hiển thị không phải kết quả biểu quyết chính thức của HĐND tỉnh. Phân hệ Sổ tay AI là ví dụ về thử nghiệm nhỏ có đo đếm: 06 sổ tay, ít nhất 50 câu hỏi mẫu đã đối chiếu nguồn, 100% cán bộ, công chức Văn phòng được hướng dẫn, thời gian tra cứu giảm ít nhất 30%, cùng ba mốc 15/11, 25/11 và 10/12/2026. Xin nói rõ: đó là các chỉ tiêu đã đăng ký, chưa phải kết quả.

::: {.canhbao}
**Cảnh báo: nhãn "bản demo" không phải tấm khiên**

Nhãn demo không cho phép đưa dữ liệu mật hay dữ liệu cá nhân chưa được bảo vệ lên một hệ thống chưa đủ điều kiện. Nó cũng không biến công cụ tự làm thành phần mềm được cấp có thẩm quyền cho dùng thống nhất. Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 có cơ chế chấp nhận rủi ro, nhưng đi kèm yêu cầu quản trị rủi ro. Theo cách hiểu thận trọng, việc miễn, loại trừ trách nhiệm gắn với nhiệm vụ hoặc thử nghiệm được phê duyệt và làm đúng quy trình; ứng dụng tự làm rồi đưa vào dùng ngoài khuôn khổ đó không mặc nhiên được miễn. Muốn dùng thật, phải đi con đường chính thức hóa ở Chương 20.
:::

**Cách áp dụng.**

- Chọn bài toán đầu tiên theo bốn tiêu chí: việc lặp lại thường xuyên; có quy tắc rõ; dữ liệu vùng XANH hoặc VÀNG đã ẩn danh, không có vùng ĐỎ; người dùng thử ít và ở gần.
- Làm theo vòng: một việc, dùng thử một đến hai tuần, thu ý kiến, sửa, rồi mới sang việc tiếp theo.
- Gắn nhãn demo ở ba chỗ: đầu trang, trang đăng nhập, chân trang. Dữ liệu mô phỏng có nhãn riêng ngay cạnh con số.
- Mỗi tháng tự hỏi một lần: tính năng nào không ai dùng, phiên bản nào thừa? Rồi gỡ bớt.
- Đặt chỉ tiêu đo được cho thử nghiệm và phân biệt rõ chỉ tiêu với kết quả.

## 4.4. Nguyên tắc thứ tư: Dữ liệu là tài sản của cơ quan; quyền riêng tư được thiết kế từ đầu

**Phát biểu.** Dữ liệu sinh ra trong công việc là tài sản của cơ quan: có một nguồn chính thống, có người chịu trách nhiệm, có phân quyền rõ ràng. Quyền riêng tư được đặt vào bản thiết kế ngay từ đầu, không đợi vá sau. Dữ liệu nhạy cảm không bao giờ nằm trong mã nguồn công khai.

**Vì sao.** Kho mã nguồn (repository) của hệ thống thử nghiệm để ở chế độ công khai, và mã chạy trên trình duyệt thì ai cũng xem được. Một số điện thoại lọt vào mã là lọt lâu dài: xóa ở bản mới thì lịch sử sửa đổi vẫn còn. Về quản trị, nếu mỗi phân hệ giữ một bản danh sách riêng, sớm muộn các bản sẽ lệch nhau và không ai biết bản nào đúng.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (thông qua ngày 26/6/2025, hiệu lực từ 01/01/2026) phân dữ liệu cá nhân thành hai nhóm: cơ bản và nhạy cảm.
- Nghị định 356/2025/NĐ-CP quy định chi tiết Luật, hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP. Theo Điều 3, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình là dữ liệu cá nhân cơ bản; khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm, trong đó có quan điểm chính trị, tôn giáo, tình trạng sức khỏe, tên đăng nhập và mật khẩu tài khoản định danh điện tử.
- Pháp luật về bảo vệ bí mật nhà nước nghiêm cấm soạn thảo, lưu giữ tài liệu có nội dung bí mật nhà nước trên máy tính, thiết bị đã hoặc đang kết nối Internet. Các dịch vụ đám mây và dịch vụ AI nói trong sách này đều thuộc diện đó.
:::

**Minh chứng từ dự án.** Về nguồn dữ liệu, hệ thống đi qua hai bài học. Một là khách và quản trị từng thấy hai danh sách cán bộ khác nhau, vì khách không được đọc máy chủ nên giao diện tự dựng danh sách mẫu tại chỗ. Từ đó dự án chốt: dữ liệu demo cũng là dữ liệu chính thống, mọi người đọc cùng một nguồn, khách chỉ khác ở chỗ không được ghi. Hai là danh sách cán bộ nay về một mối, là hồ sơ 2C ở phân hệ Quản lý cán bộ; các phân hệ chấm điểm chỉ đọc. Khi gộp, lỗi trùng họ tên lộ ra: hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, danh sách còn 27 thay vì 28 người. Họ tên không phải mã định danh; nay hệ thống nhận dạng theo họ tên kèm đơn vị.

Về quyền riêng tư, các quyết định thiết kế cụ thể như sau:

- Danh bạ điện thoại thật (111 mục) không nằm trong mã. Tệp gốc bị chặn bằng `.gitignore`; phần mềm chỉ có bộ đọc tệp; Quản trị tự nhập qua giao diện; dữ liệu nằm trên máy chủ, chỉ Quản trị đọc được. Một phép kiểm tự động bảo đảm trong mã nguồn không có số điện thoại nào.
- Hồ sơ cán bộ có ngày sinh, số căn cước, số bảo hiểm xã hội, quan hệ gia đình. Ẩn tab trên giao diện không đủ, vì chính sách cũ của cơ sở dữ liệu cho mọi tài khoản đăng nhập đọc mọi dòng. Quyền phải được siết ở tầng cơ sở dữ liệu: chỉ hai email Quản trị được đọc, ghi.
- 82 đại biểu trong phân hệ Biểu quyết mang mã DB01 đến DB82, không gắn họ tên người thật.
- Mã truy cập của các đơn vị chỉ lưu dạng chuỗi băm (hash). Khách dùng thử AI được đếm lượt bằng chuỗi băm của địa chỉ IP và trình duyệt, không lưu IP gốc. Chuỗi băm giống dấu vân tay: đủ để nhận ra, không dựng lại được bàn tay.
- Bot chat không bao giờ đưa số căn cước, bảo hiểm xã hội, quan hệ gia đình vào ngữ cảnh gửi cho AI. Đừng trông vào câu dặn AI "đừng nói ra"; cách chắc chắn là không đưa vào.
- Khóa bí mật chỉ nằm trong biến môi trường của máy chủ, không mang tiền tố `VITE_`, vì biến có tiền tố đó bị nhúng vào mã gửi xuống trình duyệt.

**Cách áp dụng.** Trước khi thêm một trường dữ liệu, hỏi năm câu: Có thật sự cần không? Ai được đọc, ai được ghi, và quyền ấy nằm ở máy chủ hay chỉ ở giao diện? Dữ liệu nằm ở đâu: trong mã, trong thư mục dự án, hay trên máy chủ có phân quyền? Nó có bị gửi đi đâu, cho dịch vụ AI hay dịch vụ trung gian nào không? Nếu nó lên mặt báo thì sao? Mọi thay đổi về quyền phải được thử bằng cả vai khách lẫn vai quản trị.

::: {.canhbao}
**Cảnh báo: chọn dịch vụ AI là quyết định về dữ liệu**

Có lúc tôi dùng khóa của một dịch vụ AI trung gian vì rẻ và tiện. Khi đó, mọi câu hỏi gửi cho bot cùng số liệu nạp kèm, như họ tên, điểm số, lịch công tác của lãnh đạo, đều đi qua máy chủ của bên trung gian, với chính sách lưu trữ không rõ ràng. Với dữ liệu thật, hãy dùng khóa của nhà cung cấp gốc hoặc hỏi rõ chính sách lưu trữ trước. Tài liệu mật thì không đưa lên bất kỳ nền tảng AI công cộng nào.
:::

## 4.5. Nguyên tắc thứ năm: Minh bạch về độ tin cậy

**Phát biểu.** Phần mềm phải nói thật với người dùng về độ tin cậy của thứ nó hiển thị: số nào là mô phỏng, câu nào do AI viết, dựa trên nguồn nào, chỗ nào chưa kiểm chứng, lúc nào chưa lấy được số liệu.

**Vì sao.** AI viết trơn tru cả khi sai; Tập 1 gọi đó là ảo giác. Khi câu đúng và câu sai cùng một giọng tự tin, người đọc không phân biệt được. Bản demo lại càng dễ gây hiểu lầm, vì dữ liệu mô phỏng được làm cho giống thật để trình diễn. Một bảng điện tử biểu quyết đầy ô màu, nếu không có nhãn, ai nhìn cũng tưởng là kết quả thật. Pháp luật cũng đi theo hướng này: Luật Trí tuệ nhân tạo đặt ra trách nhiệm minh bạch, thông báo và gắn nhãn đối với nội dung do AI tạo ra trong những trường hợp luật định (Chương 3).

**Minh chứng từ dự án.**

- Biểu quyết Online: dưới bảng điện tử luôn có dòng cho biết bao nhiêu lá phiếu thật do người dùng bấm, số còn lại là dữ liệu mô phỏng. Bộ dữ liệu mẫu cố ý có một nghị quyết chỉ đạt 45% tán thành, không được thông qua, để người xem thấy cả trường hợp không đạt. Bot chat được dặn luôn kèm lời nhắc "dữ liệu mô phỏng" khi nói về biểu quyết.
- Tiêu chí HĐND: các đơn vị mẫu mang tên địa danh trong tỉnh nhưng điểm là mô phỏng, và được ghi rõ như vậy.
- Sổ tay AI, lối tra nhanh tại chỗ, theo nguyên tắc "có nguồn mới trả lời". AI bị cấm dùng kiến thức sẵn có, chỉ được trả lời từ các đoạn văn bản vừa truy hồi; mỗi ý gắn số trích dẫn [1], [2] để người dùng bấm mở nguyên văn. Không đủ căn cứ thì phải nói: "Không tìm thấy căn cứ trong nguồn của sổ tay này." Câu trả lời quên gắn trích dẫn thì giao diện tự treo cảnh báo; câu cuối luôn nhắc nội dung chỉ để tham khảo, cần mở văn bản gốc để kiểm chứng.
- Khi bot hỏi số liệu từ hệ thống Một dữ liệu chạy trên máy chủ miễn phí hay "ngủ", trần chờ là 7 giây. Quá giờ, AI được đưa một câu giải thích để nói thật rằng lượt này chưa lấy được số liệu, không đoán.
- Khi chuyển ứng dụng trợ lý nghiệp vụ từ bản Python cũ sang React, nhật ký ghi rõ những gì bản mới không có, như tìm kiếm theo vectơ và hệ tín dụng. Nói rõ giới hạn cũng là minh bạch.

**Cách áp dụng.** Mỗi ứng dụng cần đủ ba loại nhãn:

| Loại nhãn | Trả lời câu hỏi | Ví dụ trong hệ thống |
|---|---|---|
| Nguồn gốc | Ai tạo ra nội dung này? | "Trả lời bằng AI"; phiếu mô phỏng |
| Độ tin cậy | Đã kiểm chứng chưa? | "Chưa kiểm tra"; "Đã kiểm tra – đạt" |
| Giới hạn | Được dùng đến đâu? | "Chỉ để tham khảo, cần mở văn bản gốc" |

Thông báo lỗi cũng thuộc về minh bạch. Một dòng tiếng Anh như "This operation was aborted" không nói gì với người dùng; một câu tiếng Việt cho biết máy đã chờ quá lâu và nên thử lại sau thì có ích.

::: {.lenhmau}
**Câu lệnh mẫu 4.3 — Gắn nhãn độ tin cậy cho một phân hệ**

```text
CHƯA SỬA TỆP NÀO. Rà soát phân hệ [tên] và liệt kê mọi chỗ đang hiển thị:
(a) dữ liệu mô phỏng hoặc dữ liệu mẫu; (b) nội dung do AI tạo; (c) số liệu
lấy từ hệ thống khác, có thể chậm hoặc lỗi; (d) kết luận chưa được người có
thẩm quyền xác nhận. Với mỗi chỗ, cho biết đã có nhãn chưa và đề xuất câu
chữ nhãn tiếng Việt, ngắn, đặt ngay cạnh nội dung.
Riêng phần AI trả lời: đề xuất cách buộc trích dẫn nguồn, câu trả lời mẫu
khi không đủ căn cứ, và cảnh báo khi AI quên trích dẫn.
Liệt kê luôn các thông báo lỗi còn bằng tiếng Anh. Chờ tôi duyệt rồi sửa.
```
:::

## 4.6. Nguyên tắc thứ sáu: Chi phí có trần, rủi ro có chốt chặn

**Phát biểu.** Thứ gì tốn tiền phải có trần, và trần do máy chủ giữ. Thao tác nào có thể gây hại phải có chốt chặn đặt trước nó. Khi thiếu cấu hình hoặc gặp sự cố, hệ thống mặc định về phía an toàn: đóng chứ không mở, dừng chứ không ghi đè.

**Vì sao.** Dịch vụ AI tính tiền theo lượng chữ xử lý. Khi ứng dụng mở cho khách, chi phí tăng theo số người ghé thăm, kể cả người tò mò bấm liên tục. Người không chuyên thường không thấy hóa đơn cho tới khi đã muộn. Rủi ro cũng vậy: tự lưu, tự gửi tin, tự chạy theo lịch đều tiện, nhưng mỗi thứ tự động là một chỗ có thể sai hàng loạt mà không ai đứng nhìn.

::: {.cauchuyen}
**Câu chuyện thực tế: "This operation was aborted"**

Một thời gian, bot trên Zalo trả lời bằng một dòng tiếng Anh khó hiểu: "This operation was aborted". Có người nhận hai câu trả lời giống hệt nhau, rồi hết lượt hỏi trong ngày sớm hơn bình thường. Đo thời gian từng khâu mới thấy chuỗi nguyên nhân. Dịch vụ AI trung gian trả lời chậm, chạm trần chờ 45 giây. Trong lúc chờ, Zalo không nhận được tín hiệu "đã nhận" nên gửi lại nguyên tin. Máy chủ không nhớ lần trước, nên xử lý lần nữa, trả lời lần nữa, trừ lượt lần nữa. Hạn mức 30 câu mỗi ngày bị đốt nhanh gấp đôi.

Cách sửa gồm nhiều chốt cùng lúc. Trước khi xử lý, máy chủ ghi mã tin vào cơ sở dữ liệu; mã trùng bị từ chối ngay, nên mỗi tin chỉ được xử lý một lần. Trần chờ hạ xuống 40 giây, thấp hơn hẳn giới hạn 60 giây của hàm máy chủ, để còn kịp báo lỗi bằng tiếng Việt. Quản trị có lệnh mở lại lượt cho người bị trừ oan. Từ đó, máy chủ ghi số đo thời gian từng khâu để lần sau biết thời gian đi đâu thay vì đoán.
:::

**Minh chứng khác.**

- Hạn mức lượt gọi AI theo ngày, đếm ở máy chủ: Trợ lý AI cho khách 1 lượt, người đã đăng nhập 5 lượt; khung chat ở Trang chủ 3 lượt mỗi khách; bot 30 câu mỗi người. Đếm ở trình duyệt thì xóa lịch sử duyệt web là "hồi sinh" lượt. Mốc đặt lại là 0 giờ theo giờ Việt Nam.
- Thứ tự các bước: kiểm tra yêu cầu hợp lệ, xác thực, trừ lượt, rồi mới gọi AI. Trừ trước để bấm liên tiếp không lọt trần; kiểm tra trước để không ai mất lượt oan vì gửi thiếu câu hỏi. Ở khung chat Trang chủ, AI lỗi thì lượt được hoàn lại. Thành thật mà nói, khi đọc lại mã để viết sách, tôi thấy hai điểm nối của Trợ lý AI và Sổ tay AI chưa hoàn lượt khi AI lỗi. Một nguyên tắc phải được áp đều ở mọi chỗ, và chỉ rà soát mới thấy chỗ sót.
- Thiếu khóa bí mật của máy chủ, tức không đếm được lượt, thì khách bị từ chối, người đăng nhập vẫn dùng. Trần chi phí không được mất hiệu lực chỉ vì quên một dòng cấu hình.
- Không phải việc gì cũng cần AI. Câu hỏi thường gặp được trả lời bằng kịch bản soạn sẵn, không tốn chi phí; lệnh `/solieu` của bot đọc thẳng cơ sở dữ liệu; bản tin pháp luật hằng ngày lấy tin từ nguồn RSS chính thống và vẽ ảnh bằng chương trình. Sổ tay AI chạy trên Gemini Notebook (trước đây là NotebookLM) bằng tài khoản Google của từng cán bộ, nên cơ quan không phát sinh kinh phí.
- Chốt chặn cho dữ liệu: chỉ ghi đè khi dữ liệu trên máy chủ chưa bị người khác sửa; bản tin gặp lúc mất mạng thì dừng, không ghi đè bản cũ; chưa đủ 5 tin mới thì không ra bản tin. Điểm thưởng vượt định mức có trần +5 điểm để không ai hưởng lợi từ khai khống.

**Cách áp dụng.** Bốn câu hỏi cho mọi tính năng: Tốn tiền ở đâu, trần bao nhiêu, ai giữ trần? Cùng một yêu cầu đến hai lần thì sao? Bước sau thất bại thì bước trước có được hoàn lại không? Thiếu cấu hình, mất mạng, dịch vụ ngoài chậm thì hệ thống mở hay đóng, ghi tiếp hay dừng? Nhớ cả giới hạn của gói miễn phí. Tại thời điểm viết (10/2026), dự án gói miễn phí của Supabase bị tạm dừng sau một tuần không hoạt động; hệ thống Một dữ liệu chạy gói miễn phí của Render thì "ngủ" khi vắng người dùng, lần mở đầu mất 30–60 giây. Các điều kiện này có thể thay đổi; hãy xem trang chính thức của nhà cung cấp trước khi chọn.

## 4.7. Nguyên tắc thứ bảy: Ghi chép đầy đủ để người khác tiếp nhận được

**Phát biểu.** Mọi điều quan trọng về một ứng dụng phải được viết ra ở nơi người khác, và cả tác tử AI ở phiên làm việc sau, đọc được: bộ nhớ dự án, nhật ký thay đổi, hướng dẫn sử dụng, chú thích cảnh báo ngay trong mã. Một ứng dụng chỉ người làm ra nó hiểu là rủi ro của cơ quan, chưa phải tài sản.

**Vì sao.** Trí nhớ hội thoại của tác tử AI nằm cục bộ trên từng máy, không tự đồng bộ: tôi làm ở cơ quan rồi về nhà làm tiếp, máy ở nhà không biết máy cơ quan đã bàn gì. Con người cũng quên, và cán bộ thì luân chuyển. Còn một lý do ít ai nghĩ tới: tài liệu cũng lỗi thời. Mã đổi mà tài liệu không đổi theo thì tài liệu nói sai một cách rất tự tin.

**Minh chứng từ dự án.** Tệp `CLAUDE.md` ở thư mục gốc chỉ dài một trang, trỏ tới bảy tệp quy tắc theo chủ đề trong thư mục `.claude/rules/`: tổng quan, lệnh và triển khai, làm việc đa máy, kiến trúc, mô hình dữ liệu, quy ước, nhật ký. Tác tử tự đọc chúng đầu mỗi phiên. Bộ nhớ dự án ghi rõ: "Mọi bối cảnh quan trọng phải nằm ở: (a) mã nguồn, (b) commit, (c) `CLAUDE.md` + `.claude/rules/`."

Nhật ký thay đổi dài khoảng 24.000 từ, hơn 100 mục, mỗi mục theo khuôn: làm gì, vì sao, nguyên nhân gốc nếu là lỗi, sửa ở tệp nào, kiểm thử bao nhiêu phép, kết quả ra sao. Việc người dùng phải tự làm bằng tay, như chạy một đoạn lệnh trên cơ sở dữ liệu, được đánh dấu ⚠️. Ngay tại những dòng mã dễ gây lỗi có chú thích cảnh báo bằng tiếng Việt; chẳng hạn, sau sự cố danh bạ "lưu xong mở lại thì biến mất", hàm chuẩn hóa hồ sơ mang dòng nhắc: thêm trường mới thì phải khai ở đây. Tên hàm cũng đặt bằng tiếng Việt không dấu, như `catDoan`, `truyHoi`, `ngayVN`, để người không chuyên đọc tên là đoán được việc.

Cũng xin thành thật về chỗ chưa đạt. Tệp kiến thức của bot từng ghi "không đọc được lịch công tác" sau khi bot đã đọc được. Trang hướng dẫn từng ghi ngưỡng xếp loại 80/65 trong khi phần mềm tính 70/50. Các bộ kiểm thử mà nhật ký nhắc nhiều lần lại nằm trong thư mục không đưa lên GitHub, nên máy khác không chạy lại được. Đó chính là những chỗ người tiếp nhận sẽ vấp.

**Cách áp dụng.** Mọi ứng dụng tự làm, dù nhỏ, nên có bộ hồ sơ tối thiểu gồm năm thứ: một trang giới thiệu (làm gì, cho ai, căn cứ văn bản nào, đang thử nghiệm hay chính thức); bộ nhớ dự án cho tác tử AI; nhật ký thay đổi theo khuôn "làm gì – vì sao – kiểm chứng thế nào"; danh mục việc phải làm bằng tay khi dựng lại trên máy mới; hướng dẫn sử dụng theo vai kèm cách tự chẩn đoán sự cố thường gặp. Phép thử: một đồng nghiệp chưa từng tham gia, chỉ cầm bộ hồ sơ, có dựng lại được ứng dụng trên máy mới trong một buổi không? Và mỗi lần sửa mã, sửa luôn tài liệu trong cùng lần sửa.

::: {.lenhmau}
**Câu lệnh mẫu 4.4 — Chuẩn bị hồ sơ bàn giao**

```text
Hãy chuẩn bị hồ sơ bàn giao dự án cho một cán bộ chưa từng tham gia, không
chuyên lập trình. Đọc bộ nhớ dự án, nhật ký thay đổi và mã nguồn, rồi:
1. Viết trang giới thiệu 1 trang: làm gì, cho ai, căn cứ văn bản nào, trạng
   thái hiện tại (bản demo thử nghiệm hay chính thức).
2. Lập danh mục việc phải làm bằng tay khi dựng lại trên máy mới: phần mềm
   cần cài, tên các biến môi trường (KHÔNG ghi giá trị khóa), đoạn lệnh cơ
   sở dữ liệu cần chạy, tài khoản dịch vụ cần có.
3. Đối chiếu tài liệu với mã: liệt kê mọi câu trong hướng dẫn, bộ nhớ dự án,
   kiến thức của bot đã lỗi thời so với mã hiện tại.
4. Liệt kê tệp, bộ kiểm thử chỉ nằm trên máy này, chưa có trên GitHub.
Viết bằng tiếng Việt, chỉ báo cáo; việc sửa để tôi duyệt sau.
```
:::

## 4.8. Bảy nguyên tắc trên một trang

Bảy nguyên tắc không đứng riêng mà đỡ lẫn nhau. Nhãn "dữ liệu mô phỏng" của nguyên tắc thứ năm giúp người xem không nhầm một con số demo với một kết luận đã được duyệt theo nguyên tắc thứ nhất. Bộ đếm lượt đặt ở máy chủ vừa là chốt chặn chi phí, vừa phải dùng chuỗi băm để tôn trọng quyền riêng tư. Bảng dưới đây gom cả bảy nguyên tắc để dùng như một bảng kiểm.

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

Khi cán bộ trình một ứng dụng tự làm, đồng chí không cần đọc mã. Hãy yêu cầu trả lời bảy câu hỏi trong bảng trên bằng văn bản, kèm minh chứng: ảnh màn hình bước phê duyệt, bảng đối chiếu biểu mẫu, danh sách trường dữ liệu và người được đọc, mức hạn mức chi phí, hồ sơ bàn giao. Ứng dụng nào chưa trả lời được câu 1, câu 4 và câu 6 thì chưa nên mở cho người khác dùng. Đồng thời, hãy bảo vệ người dám làm thử trong khuôn khổ: nhãn demo, dữ liệu không mật, phạm vi hẹp, có nhật ký.
:::

## Tóm tắt chương 4

::: {.tomtat}
1. Máy đề xuất, người quyết định: phần mềm tính toán, gợi ý; phê duyệt và khẳng định hiệu lực luôn thuộc về người có thẩm quyền, sửa sau phê duyệt thì phê duyệt tự gỡ.
2. Đúng nghiệp vụ trước, đẹp giao diện sau: đối chiếu với văn bản gốc và biểu mẫu đang dùng thật; nghi ngờ những gì "tưởng là cố định".
3. Nhỏ trước, lớn sau: mỗi vòng một việc, đo được; định kỳ gỡ bớt; nhãn "bản demo thử nghiệm" ở mọi chỗ người dùng nhìn thấy.
4. Dữ liệu là tài sản của cơ quan: một nguồn chính thống, phân quyền ở máy chủ; dữ liệu nhạy cảm không bao giờ vào mã nguồn công khai hay ngữ cảnh gửi cho AI.
5. Minh bạch về độ tin cậy: nhãn nguồn gốc, độ tin cậy, giới hạn; AI tra cứu phải có trích dẫn, không đủ căn cứ thì nói không tìm thấy.
6. Chi phí có trần do máy chủ giữ; rủi ro có chốt chặn đặt trước; thiếu cấu hình thì mặc định đóng.
7. Ghi chép để người khác tiếp nhận được: bộ nhớ dự án, nhật ký, hướng dẫn, chú thích tại chỗ; sửa mã thì sửa luôn tài liệu.
:::

## Câu hỏi suy ngẫm và bài tập

1. Chọn một bảng tính hoặc phần mềm đang dùng ở phòng, Ban của đồng chí. Chỉ ra những chỗ nó đang "quyết định thay người" và cho biết ai nên là người xác nhận.
2. Lấy một biểu mẫu giấy đang dùng. Liệt kê các ô do người dùng tự điền, rồi kiểm xem công cụ hiện có đóng cứng ô nào không.
3. Liệt kê các trường dữ liệu cá nhân trong một danh sách đồng chí đang quản lý; phân loại cơ bản hay nhạy cảm theo Nghị định 356/2025/NĐ-CP. Trường nào có thể bỏ?
4. Dùng Câu lệnh mẫu 4.3 cho một ứng dụng nhỏ của đồng chí. Có bao nhiêu chỗ còn thiếu nhãn?
5. Với lãnh đạo: trong bảy nguyên tắc, cơ quan mình đang yếu nhất ở nguyên tắc nào, và bước đầu tiên để khắc phục là gì?
