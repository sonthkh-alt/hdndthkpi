# Lời nói đầu

Tập 1 của bộ sách, "Trí tuệ nhân tạo trong công tác tham mưu — Cẩm nang thực hành cho kỷ nguyên số", hướng dẫn cán bộ dùng trí tuệ nhân tạo (AI) đúng cách, an toàn, có trách nhiệm. Cụ thể là giao việc cho trợ lý AI trò chuyện (chatbot) bằng khung lệnh V-B-V-D-R, giữ con người trong vòng lặp, phân loại dữ liệu vùng ĐỎ/VÀNG/XANH trước khi đưa lên AI. Cuốn sách đồng chí đang đọc là Tập 2. Nó không viết lại Tập 1, mà kể tiếp chặng đường sau đó.

## Vì sao có Tập 2

Năm 2026, việc đánh giá, xếp loại cán bộ, công chức thay đổi nhiều. Nghị định 335/2025/NĐ-CP của Chính phủ có hiệu lực từ 01/01/2026; ngày 05/6/2026, Ban Thường vụ Tỉnh ủy Thanh Hóa ban hành Quy định 1053-QĐ/TU. Việc chấm điểm diễn ra hằng tháng, theo thang 100 điểm, kèm những điều kiện xếp loại mà làm bằng giấy và bảng tính rời thì rất dễ sai.

Ở Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, tôi đứng trước một câu hỏi cụ thể: làm sao để mỗi tháng chấm điểm đúng quy định hơn, nhanh hơn, ít phải tranh luận về con số hơn? Lối quen là viết yêu cầu, đặt hàng phần mềm, rồi chờ. Tôi thử một lối khác: cùng tác tử AI lập trình (AI coding agent) Claude Code dựng một ứng dụng web chạy được, rồi dùng bảng tính mô phỏng và bản đặc tả để chốt lại cách tính cho chuẩn.

Cũng trong năm ấy, ngày 7/5/2026, Thường trực HĐND tỉnh tổ chức tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng. Sau những buổi như thế, một câu hỏi tự nhiên nảy ra: đã biết hỏi AI rồi, bước tiếp theo là gì? Tập 2 là câu trả lời của tôi, rút từ những gì tôi đã làm, đã vấp và đã sửa.

## Từ "hỏi AI" đến "cùng AI làm ra công cụ"

Ở Tập 1, chúng ta là người dùng: hỏi, nhận một đoạn văn, đọc, sửa rồi dùng. Ở Tập 2, chúng ta là người kiến tạo: giao việc cho một tác tử AI biết đọc cả bộ mã nguồn, tự chạy lệnh, tự kiểm thử, sửa nhiều tệp cùng lúc. Hãy hình dung đó là một tổ chuyên viên kỹ thuật làm rất nhanh, rất chăm, nhưng không biết gì về nghiệp vụ nếu ta không nói rõ. Người cán bộ vì thế đóng ba vai: chủ đầu tư nêu đúng nhu cầu, tổng công trình sư giữ đúng thiết kế, người nghiệm thu không ký khi công trình chưa đạt. Tên tập sách, "Từ người dùng đến người kiến tạo", nói về sự chuyển vai ấy.

Đến ngày 26/10/2026, hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) có 12 thẻ phân hệ, hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự động hằng ngày, khoảng 21.400 dòng mã. Tôi nêu con số ấy không phải để khoe. Mỗi dòng mã là một chỗ có thể sai, và người chịu trách nhiệm là tôi, không phải AI.

Hệ thống đã thật sự sai, thật sự sập. Ngày 13/8/2026, hai thay đổi lớn làm cùng lúc gây lỗi dây chuyền: bot trò chuyện "mất" hẳn một phân hệ, danh sách cán bộ thiếu một người vì hai đồng chí trùng họ tên bị ghép làm một. Từ ngày 01/9/2026, ba phân hệ chỉ hiện trang trắng, và lỗi ấy sẽ lặp lại mỗi đầu tháng nếu không được vá. Tôi giữ lại những chuyện đó trong sách, kèm nguyên nhân gốc và cách sửa, vì người đi sau học được từ chỗ vấp nhiều hơn từ lời khen.

Điều đáng giá nhất tôi nhận ra không nằm ở phần mềm. Không tác tử AI nào tự biết biểu mẫu giấy nào cơ quan đang thật sự dùng. Nó cũng không biết văn bản nào của Đảng phải theo thể thức của Đảng, câu chữ nào trong quy định hiểu được theo hai cách. AI viết mã rất nhanh; người hiểu nghiệp vụ mới là người làm ra công cụ tốt.

## Tinh thần Nghị quyết 57-NQ/TW

Con đường này có căn cứ chính trị, pháp lý rõ ràng, và cũng có giới hạn rõ ràng.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia xác định đây là "đột phá quan trọng hàng đầu". Nghị quyết đề cao tinh thần chấp nhận rủi ro, thử nghiệm có kiểm soát, xóa bỏ tư duy "không quản được thì cấm".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương (điểm 1.2): "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".
- Quy định 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa (khoản 4 Điều 3): "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Luật Trí tuệ nhân tạo số 134/2025/QH15, hiệu lực từ 01/3/2026 (khoản 2 Điều 4): "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
:::

Một mặt, chủ trương khuyến khích cán bộ mạnh dạn ứng dụng công nghệ. Mặt khác, chấp nhận rủi ro phải theo cơ chế, quy trình luật định, không phải một sự miễn trừ chung; và AI không thay được thẩm quyền, trách nhiệm của con người. Cả cuốn sách đi trên lằn ranh ấy, tóm trong một câu: máy đề xuất – người quyết định.

## Cuốn sách được viết như thế nào

Chất liệu của sách là những gì có thật: nhật ký thay đổi của dự án với hơn 100 mục, mã nguồn công khai, văn bản quy định và biểu mẫu gốc. Tình huống giả định đều ghi rõ "Ví dụ minh họa"; con số chưa đo được, tôi không viết. Như chính điều sách khuyên, tôi cũng dùng AI khi biên soạn: để tổng hợp nhật ký, đối chiếu văn bản, soạn bản nháp. Bản nháp của AI chỉ là gợi ý; nội dung cuối cùng do tôi rà soát và chịu trách nhiệm.

## Lời cảm ơn

Tôi chân thành cảm ơn Thường trực HĐND tỉnh, lãnh đạo Đoàn ĐBQH tỉnh, lãnh đạo Văn phòng, các Ban của HĐND tỉnh và các đồng chí đồng nghiệp; công việc hằng ngày của các đồng chí là chất liệu và là lý do để cuốn sách ra đời. Cảm ơn những người xây dựng các công cụ, thư viện mã nguồn mở mà hệ thống thử nghiệm đang dùng. Cảm ơn gia đình đã thông cảm cho những buổi tối, ngày nghỉ tôi ngồi bên máy tính.

## Mong nhận được góp ý

Sách được viết trong lúc công nghệ, pháp luật và chính hệ thống thử nghiệm vẫn đang thay đổi, nên chắc chắn còn thiếu sót. Mọi góp ý, nhất là về chỗ chưa rõ, chưa đúng hoặc đã lỗi thời, xin gửi về Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa. Đồng chí cũng có thể dùng mục Liên hệ và ô gửi góp ý trên trang Hướng dẫn & hỗ trợ của hệ thống thử nghiệm (`#/hotro`).

*Thanh Hóa, tháng 10 năm 2026*

**TS. Hà Ngọc Sơn**

# Hướng dẫn sử dụng cuốn sách

Không ai buộc phải đọc cuốn sách khoảng 300 trang này từ đầu đến cuối. Phần dưới đây giúp đồng chí chọn đường đọc và dùng sách cho hiệu quả.

## Năm phần của cuốn sách

| Phần | Chương | Nội dung chính |
|---|---|---|
| Thứ nhất — Nền tảng | 1–4 | Câu chuyện khởi đầu, AI tạo ứng dụng, pháp lý, bảy nguyên tắc |
| Thứ hai — Hành trang | 5–8 | Công cụ, giao việc cho tác tử AI, bộ nhớ dự án, đặc tả |
| Thứ ba — Thực chiến | 9–15 | Từng nhóm phân hệ của hệ thống thử nghiệm |
| Thứ tư — Việc hằng ngày | 16–18 | Quy trình AI cho nghiệp vụ, vai trò lãnh đạo, lộ trình 30 ngày |
| Thứ năm — Bền vững | 19–20 | An toàn, chi phí, chính thức hóa, bài học |

Các chương Phần thứ ba theo cùng một khuôn: bài toán và căn cứ; thiết kế giải pháp; cách tôi giao việc cho AI; sự cố và bài học; "Nếu đồng chí muốn làm phiên bản nhỏ hơn"; phần dành cho lãnh đạo. Cuối sách là Lời kết và sáu phụ lục, trong đó có thư viện câu lệnh mẫu, mẫu Quy tắc sử dụng AI và bảng kiểm trước khi đưa một ứng dụng vào sử dụng.

## Ba lộ trình đọc theo vai

| Vai | Nên đọc | Có thể lướt |
|---|---|---|
| Lãnh đạo | Chương 1, 3, 4, 17, 19, 20 | Phần cài đặt, khối mã |
| Cán bộ dùng AI hằng ngày | Chương 1, 2, 3, 16, 18; Phụ lục 2 | Chi tiết kỹ thuật |
| Cán bộ tự làm ứng dụng | Đọc tuần tự | Không nên bỏ chương nào |

**Lãnh đạo** không cần tự gõ lệnh, nhưng cần đủ hiểu để hỏi đúng, quyết đúng. Chương 17 có mười câu hỏi nên đặt ra khi cán bộ trình một ứng dụng hay quy trình AI. Ở các chương khác, đọc hộp "Dành cho lãnh đạo" là đủ.

**Cán bộ dùng AI hằng ngày** chưa chắc cần làm phần mềm. Chương 16 chỉ rõ với từng nghiệp vụ: phần AI làm, phần người làm, vùng dữ liệu được phép, điểm kiểm soát.

**Cán bộ muốn tự làm ứng dụng** nên đọc Chương 5 với máy tính bên cạnh để làm luôn dự án đầu tiên, và đọc Phần thứ ba trong lúc mở hệ thống thử nghiệm để đối chiếu.

## Các hộp nội dung

| Hộp | Dùng để |
|---|---|
| Mục tiêu của chương | Nêu điều sẽ học và ai nên đọc kỹ |
| Câu chuyện thực tế | Kể chuyện có thật của dự án, kèm nguyên nhân gốc |
| Ví dụ minh họa | Tình huống giả định, không phải chuyện đã xảy ra |
| Cảnh báo | Rủi ro pháp lý, bảo mật, chi phí; đọc kỹ trước khi làm |
| Ghi nhớ | Nguyên tắc cô đọng |
| Căn cứ pháp lý | Trích văn bản đã đối chiếu; tra nguyên văn khi áp dụng |
| Thực hành | Các bước làm ngay, theo thứ tự |
| Câu lệnh mẫu | Câu lệnh hoàn chỉnh; điều chỉnh rồi mới dùng |
| Dành cho lãnh đạo | Điều lãnh đạo cần biết, cần quyết |
| Tóm tắt chương | Các ý chính để ôn lại |

Hai hộp dễ nhầm nhất là "Câu chuyện thực tế" và "Ví dụ minh họa". Câu chuyện thực tế lấy từ nhật ký dự án, có ngày tháng khi nhật ký ghi ngày. Ví dụ minh họa là tình huống dựng ra để giải thích; tên đơn vị, con số trong đó là giả định dù nghe rất giống thật. Cuối mỗi chương có mục "Câu hỏi suy ngẫm và bài tập" để tự kiểm tra.

## Cách dùng câu lệnh mẫu

Câu lệnh mẫu được đánh số theo chương (Câu lệnh mẫu 6.3 là câu lệnh thứ ba của Chương 6). Phần lớn theo khung V-B-V-D-R: Vai – Bối cảnh – Việc – Dạng – Ràng buộc; câu lệnh giao việc cho tác tử AI lập trình có thêm Nghiệm thu, tức tiêu chí đo được để biết việc đã xong và đạt. Chỗ trong [ngoặc vuông] là chỗ điền thông tin của mình. Nên dùng theo năm bước:

1. Điền đủ chỗ trong ngoặc vuông; bỏ dòng không hợp với việc của mình.
2. Xác định vùng dữ liệu: vùng XANH dùng thẳng; vùng VÀNG ẩn danh trước; vùng ĐỎ tuyệt đối không đưa lên AI công cộng.
3. Chạy thử với dữ liệu giả hoặc văn bản công khai.
4. Đối chiếu với văn bản gốc; mọi số hiệu, điều khoản, con số AI đưa ra phải được kiểm chứng độc lập.
5. Lưu bản đã chỉnh vào thư viện câu lệnh riêng, ghi chú dùng cho việc gì, kết quả ra sao.

Chưa quen tự điều chỉnh thì có thể nhờ chính AI giúp:

::: {.lenhmau}
**Câu lệnh mẫu 0.1 — Điều chỉnh một câu lệnh mẫu cho đúng việc của mình**

```text
VAI: Anh/chị là chuyên viên tham mưu nhiều kinh nghiệm ở [tên phòng/Ban].
BỐI CẢNH: Tôi muốn dùng câu lệnh mẫu dưới đây, lấy từ một cuốn sách
hướng dẫn. Việc thực tế của tôi là [mô tả ngắn việc cần làm].
Dữ liệu sẽ dùng thuộc vùng [XANH/VÀNG]: không có tài liệu mật,
không có thông tin cá nhân.
[Dán câu lệnh mẫu vào đây]
VIỆC:
1. Chỉ ra chỗ trong câu lệnh mẫu chưa khớp với việc của tôi.
2. Đề xuất câu lệnh đã điều chỉnh, giữ đủ 5 thành phần
   Vai - Bối cảnh - Việc - Dạng - Ràng buộc.
3. Liệt kê thông tin còn thiếu mà tôi phải tự bổ sung.
DẠNG: Bảng "Chỗ cần sửa - Lý do - Đề xuất", sau đó là câu lệnh mới
trong một khối riêng.
RÀNG BUỘC: Không tự thêm số hiệu văn bản, số liệu, tên người nào mà
tôi chưa cung cấp. Chỗ nào không chắc, ghi "Cần kiểm tra".
```
:::

Dòng Ràng buộc là quan trọng nhất: AI rất dễ "điền giúp" một số hiệu văn bản hay một con số nghe hợp lý, và đó là chỗ sai nguy hiểm nhất.

## Quy ước trình bày

- **Thuật ngữ:** lần đầu trong mỗi chương viết tiếng Việt trước, tiếng Anh trong ngoặc, như kho mã nguồn (repository), triển khai (deploy); Phụ lục 1 có bảng tra.
- **Viết tắt:** ĐBQH, HĐND, UBND, CBCC chỉ dùng sau khi đã viết đầy đủ lần đầu trong chương.
- **Con người:** ngoài tác giả, không ai được nêu họ tên, chỉ nhắc theo chức danh.
- **Giá cả:** là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi.

## Đọc sách cùng hệ thống đang chạy

Hệ thống thử nghiệm ở địa chỉ `https://hdndthkpi.vercel.app`; khách xem không cần tài khoản. Mỗi phân hệ có đường dẫn riêng, như `#/okr` (Đánh giá OKR/KPI), `#/kiemdiem` (Kiểm điểm), `#/tieuchi` (Tiêu chí HĐND), `#/bieuquyet` (Biểu quyết Online), `#/sotay` (Sổ tay AI). Quản lý cán bộ chỉ dành cho Quản trị; khách không xem được là đúng thiết kế, không phải lỗi. Mã nguồn công khai tại `https://github.com/sonthkh-alt/hdndthkpi`, gồm cả bộ nhớ dự án và nhật ký thay đổi. Hệ thống vẫn được sửa sau khi sách hoàn thành; nếu màn hình khác mô tả, hãy đối chiếu nhật ký thay đổi.

::: {.thuchanh}
**Thực hành: năm việc nên làm trước khi đọc Chương 1**

1. Chọn một trong ba lộ trình đọc, đánh dấu các chương sẽ đọc.
2. Mở hệ thống thử nghiệm với tư cách khách, đi qua Trang chủ và ít nhất một phân hệ; để ý nhãn "Bản demo thử nghiệm".
3. Kiểm tra cài đặt quyền riêng tư của trợ lý AI đang dùng; tắt tùy chọn cho phép dùng nội dung trò chuyện để huấn luyện mô hình (tên mục mỗi công cụ một khác).
4. Ghi ra một việc lặp lại hằng tháng của mình muốn cải tiến; đó là "bài toán" để đối chiếu khi đọc.
5. Lập một "nhật ký học": ghi câu lệnh đã dùng, kết quả, chỗ AI sai.
:::

# Lưu ý quan trọng trước khi đọc

Năm lưu ý dưới đây giúp tránh những hiểu lầm có thể gây hậu quả thật.

## Hệ thống trong sách là bản demo thử nghiệm

Mọi trang của hệ thống đều mang nhãn "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu". Nhãn ấy có nghĩa thật:

- Hệ thống không thay thế quy trình, văn bản, hồ sơ chính thức; điểm số, xếp loại trên đó không phải kết quả đánh giá chính thức. Nó cũng không phải phần mềm do cấp có thẩm quyền ban hành để dùng thống nhất.
- Phần lớn dữ liệu là mô phỏng: 82 đại biểu ở phân hệ Biểu quyết Online chỉ mang mã DB01 đến DB82; điểm của 14 đơn vị ở phân hệ Tiêu chí HĐND không phải kết quả của địa phương nào.
- Hạ tầng là dịch vụ đám mây ở mức miễn phí, máy chủ cơ sở dữ liệu đặt tại khu vực Singapore. Không dùng bản demo cho tài liệu mật hay dữ liệu cá nhân thật; muốn dùng thật phải chuyển về hạ tầng của cơ quan và gỡ các quyền đọc công khai đang mở để trình diễn.

## Pháp luật được đối chiếu đến ngày 26/10/2026

Văn bản dẫn trong sách được đối chiếu số hiệu, ngày ban hành, hiệu lực và tình trạng đến ngày 26/10/2026. Trước khi áp dụng, hãy tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo, vì pháp luật thay đổi ngay khi sách đang viết. Ví dụ, Quy định 366-QĐ/TW ngày 30/8/2025 của Bộ Chính trị về việc kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị vẫn là căn cứ cho năm 2026. Nhưng ngày 19/10/2026, Bộ Chính trị đã ban hành Quy định 227-QĐ/TW thay thế, hiệu lực từ 01/01/2027.

Chỗ nào chưa đối chiếu được nguyên văn, sách chỉ nói chung, như "các quy định về khuyến khích, bảo vệ cán bộ dám nghĩ, dám làm", không nêu số hiệu: thà nói chung còn hơn dẫn sai. Một số văn bản được số hóa còn là dự thảo, như Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã nhiệm kỳ 2026–2031; chỗ phần mềm "chuẩn hóa" dự thảo chỉ là kiến nghị, quyền sửa văn bản thuộc cơ quan có thẩm quyền.

## Công cụ và giá cả thay đổi rất nhanh

| Thời điểm | Thay đổi | Ý nghĩa với người đọc |
|---|---|---|
| 18/6/2026 | Gemini CLI được thay bằng Antigravity CLI với người dùng miễn phí | Hướng dẫn cài đặt cũ không còn đúng |
| 16/7/2026 | Google đổi tên NotebookLM thành Gemini Notebook | Tên trong sách và trên màn hình có thể khác |
| 02/9/2026 | Hạn mức Gemini Notebook tính theo khối lượng tính toán | Không còn số lượt hỏi cố định mỗi ngày |
| 22/10/2026 | Dự án phát hiện địa chỉ đã chuyển sang notebook.google.com | Phải kiểm tra lại liên kết đã lưu |

Dòng cuối là chuyện của chính dự án: giả định cũ của AI chỉ lộ ra khi kiểm tra đường dẫn thật. Sách vẫn dùng tên NotebookLM ở chỗ gắn với nhiệm vụ đã đăng ký và giao diện phân hệ Sổ tay AI. Về giá, Claude Code không có trong gói miễn phí; trong các gói thuê bao, gói thấp nhất có nó là Pro, 20 USD/tháng, chưa gồm thuế (giá tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). Trước khi làm theo hướng dẫn cài đặt hay dựa vào mức giá nào, hãy kiểm tra lại trang chính thức của nhà cung cấp.

## Câu lệnh mẫu phải được điều chỉnh và kiểm chứng

Câu lệnh mẫu là điểm khởi đầu, không phải đơn thuốc dùng ngay. "5 KHÔNG" của Tập 1 vẫn nguyên giá trị, nhất là: AI không tự kiểm tra được số liệu, không biết văn bản vừa ban hành, không có thẩm quyền pháp lý. Tác tử AI lập trình còn hành động trên máy: sửa tệp, chạy lệnh, đẩy mã lên mạng. Vì vậy hãy lưu một mốc mã nguồn để quay lại được, giao từng việc nhỏ, nghiệm thu bằng chạy thử thật chứ không chỉ nghe AI báo "đã xong".

Cũng cần phân biệt chỉ tiêu với kết quả. "Giảm ít nhất 30% thời gian tra cứu" của nhiệm vụ Sổ tay AI là chỉ tiêu đã đăng ký, với các mốc 15/11, 25/11 và 10/12/2026, tức sau khi sách hoàn thành; nó chưa phải kết quả.

::: {.canhbao}
**Cảnh báo: ba lằn ranh không được vượt**

- Không đưa tài liệu mật, đơn thư có danh tính người khiếu nại, tố cáo, hồ sơ cá nhân lên trợ lý AI công cộng hay ứng dụng chạy trên dịch vụ đám mây công cộng. Điều 5 Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực từ 01/3/2026) nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng máy tính, mạng viễn thông. Ngoại lệ là mạng LAN độc lập và việc lưu giữ theo pháp luật về cơ yếu. Dữ liệu cá nhân thì chịu sự điều chỉnh của Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026).
- Không dùng kết quả của bản demo hay câu trả lời của AI làm căn cứ pháp lý, kết luận chính thức. Như Tập 1 đã nhắc: trình ký văn bản lỗi do AI là lỗi của cán bộ.
- Không để khóa bí mật, mật khẩu, số điện thoại, dữ liệu cá nhân nằm trong kho mã nguồn công khai. Thứ gì đã đưa lên đó coi như đã công bố.
:::

## Trách nhiệm đối với nội dung cuốn sách

Đây là sách chia sẻ kinh nghiệm cá nhân; tác giả chịu trách nhiệm về nội dung. Nhận định và cách diễn giải trong sách là của cá nhân tôi, không đại diện quan điểm chính thức của Văn phòng, Thường trực HĐND tỉnh, Đoàn ĐBQH tỉnh hay cơ quan nào. Khi khác với văn bản, hướng dẫn của cấp có thẩm quyền, xin theo văn bản, hướng dẫn đó.

Sách không nêu họ tên ai ngoài tác giả; không có số điện thoại, mật khẩu, khóa bí mật, mã truy cập hay nội dung đánh giá cá nhân. Bài học bảo mật được kể ở mức nguyên tắc để phòng tránh, không mô tả cách vượt quyền một hệ thống.

::: {.ghinho}
**Ghi nhớ**

Hãy đọc cuốn sách này với một nguyên tắc: máy đề xuất – người quyết định. AI viết nháp, tính toán, gợi ý; con người kiểm chứng, phê duyệt và chịu trách nhiệm. Mọi kỹ thuật trong sách, từ câu lệnh đầu tiên đến hệ thống nhiều phân hệ, đều phục vụ nguyên tắc ấy.
:::
