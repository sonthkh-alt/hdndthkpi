# Lời nói đầu

Tập 1 của bộ sách, "Trí tuệ nhân tạo trong công tác tham mưu" (hoàn thiện tháng 5/2026), hướng dẫn cán bộ dùng trí tuệ nhân tạo (AI) an toàn, có trách nhiệm: giao việc cho trợ lý AI trò chuyện (chatbot) bằng khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2), phân loại dữ liệu 4 cấp trước khi đưa lên AI (mục 7.1–7.2), giữ con người trong vòng lặp (mục 7.5). Tập 1 dừng ở vai người dùng; việc tự dựng hệ thống tra cứu riêng, sách chỉ ghi là "đòi hỏi kỹ năng lập trình Python" (mục 5.6). Tập 2 không viết lại Tập 1, mà kể tiếp chặng đường sau đó.

## Vì sao có Tập 2

Năm 2026, việc đánh giá, xếp loại cán bộ, công chức thay đổi nhiều: Nghị định 335/2025/NĐ-CP của Chính phủ có hiệu lực từ 01/01/2026; ngày 05/6/2026, Ban Thường vụ Tỉnh ủy Thanh Hóa ban hành Quy định 1053-QĐ/TU. Chấm điểm hằng tháng trên thang 100 điểm, kèm nhiều điều kiện xếp loại, mà làm bằng giấy và bảng tính rời thì rất dễ sai.

Ở Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, câu hỏi của tôi rất cụ thể: làm sao chấm điểm đúng quy định hơn, nhanh hơn? Thay vì đặt hàng phần mềm rồi chờ, tôi lập bảng tính mô phỏng cách chấm điểm, viết bản đặc tả để chốt cách tính, rồi cùng tác tử AI lập trình (AI coding agent) Claude Code dựng một ứng dụng web, tức phần mềm chạy ngay trên trình duyệt.

Ngày 7/5/2026, Thường trực HĐND tỉnh tổ chức tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng. Câu hỏi tiếp theo là: đã biết hỏi AI rồi, bước sau là gì? Tập 2 là câu trả lời của tôi, rút từ những gì đã làm, đã vấp và đã sửa.

## Từ "hỏi AI" đến "cùng AI làm ra công cụ"

Ở Tập 1, chúng ta là người dùng: hỏi, nhận bản nháp, sửa rồi dùng. Ở Tập 2, chúng ta là người kiến tạo: giao việc cho một tác tử AI biết đọc cả bộ mã nguồn (bộ bản vẽ của phần mềm), tự chạy lệnh, tự kiểm thử, như một tổ kỹ thuật làm rất nhanh nhưng không biết gì về nghiệp vụ nếu ta không nói rõ. Người cán bộ vì thế đóng ba vai: chủ đầu tư nêu đúng nhu cầu, tổng công trình sư giữ đúng thiết kế, người nghiệm thu không ký khi công trình chưa đạt. Câu ở Lời nói đầu Tập 1, "vấn đề không phải ở AI, mà ở cách mình giao việc cho AI", vẫn đúng nguyên.

Đến ngày 26/10/2026, hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app) có hơn mười phân hệ trên Trang chủ, hai kênh trò chuyện qua Telegram và Zalo, một bản tin pháp luật tự động hằng ngày và hơn 21.000 dòng mã. Mỗi dòng mã đều có thể sai, và người chịu trách nhiệm là tôi, không phải AI.

Hệ thống đã thật sự sập. Ngày 13/8/2026, hai thay đổi lớn làm cùng một ngày gây lỗi dây chuyền: bot trò chuyện không còn đọc được phân hệ Kiểm điểm; hai đồng chí trùng họ tên bị ghép làm một. Từ ngày 01/9/2026, ba phân hệ chỉ hiện trang trắng; bản vá được ghi nhận ngày 28/9/2026. Sách giữ lại những chuyện đó, kèm nguyên nhân gốc và cách sửa (Chương 7, mục 7.5; Chương 9, mục 9.5), vì người đi sau học được nhiều nhất từ chỗ vấp.

Điều tôi nhận ra không nằm ở phần mềm: không tác tử AI nào tự biết cơ quan đang dùng biểu mẫu giấy nào, văn bản nào của Đảng phải theo thể thức của Đảng. AI viết mã rất nhanh; người hiểu nghiệp vụ mới là người làm ra công cụ tốt.

## Tinh thần Nghị quyết 57-NQ/TW

Con đường này có căn cứ rõ ràng, và cũng có giới hạn rõ ràng.

::: {.phaply}
**Căn cứ pháp lý**

- Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia xác định đây là "đột phá quan trọng hàng đầu", đề cao tinh thần chấp nhận rủi ro, thử nghiệm có kiểm soát, xóa bỏ tư duy "không quản được thì cấm".
- Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 của Ban Tổ chức Trung ương (điểm 1.2): "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ".
- Quy định 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa (khoản 4 Điều 3): "Thực hiện ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI) để đánh giá mức độ hoàn thành nhiệm vụ...".
- Luật Trí tuệ nhân tạo số 134/2025/QH15, hiệu lực từ 01/3/2026 (khoản 2 Điều 4): "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
:::

Chủ trương khuyến khích mạnh dạn ứng dụng công nghệ, nhưng chấp nhận rủi ro phải theo cơ chế luật định, không phải miễn trừ chung; ứng dụng tự làm ngoài nhiệm vụ, thử nghiệm đã được phê duyệt thì không mặc nhiên được miễn trách nhiệm (Chương 3, mục 3.6). Cả cuốn sách đi trên lằn ranh ấy: máy đề xuất – người quyết định, tức mô hình "AI đề xuất, con người duyệt" của Tập 1 (mục 7.5).

## Cuốn sách được viết như thế nào

Chất liệu của sách là những gì có thật: nhật ký thay đổi của dự án (hơn 100 mục), mã nguồn công khai, văn bản quy định và biểu mẫu gốc. Khác Tập 1 vốn ẩn danh mọi ví dụ, Tập 2 nêu đích danh hệ thống thật để đồng chí tự đối chiếu. Tình huống giả định đều ghi rõ "Ví dụ minh họa"; con số chưa đo được, tôi không viết. Tôi có dùng AI để tổng hợp nhật ký, đối chiếu văn bản, soạn bản nháp, và ghi chú điều đó ở đây như Tập 1 (mục 7.5) khuyên; nội dung cuối cùng do tôi rà soát và chịu trách nhiệm.

## Lời cảm ơn

Tôi chân thành cảm ơn Thường trực HĐND tỉnh, lãnh đạo Đoàn ĐBQH tỉnh, lãnh đạo Văn phòng, các Ban của HĐND tỉnh và các đồng chí đồng nghiệp; công việc hằng ngày của các đồng chí là chất liệu và lý do để cuốn sách ra đời. Cảm ơn những người làm ra các thư viện mã nguồn mở mà hệ thống đang dùng, và gia đình đã thông cảm cho những buổi tôi mang việc về nhà.

## Mong nhận được góp ý

Sách được viết khi công nghệ, pháp luật và chính hệ thống thử nghiệm còn đang thay đổi, nên chắc chắn còn thiếu sót. Mọi góp ý, nhất là về chỗ chưa đúng hoặc đã lỗi thời, xin gửi về Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa, hoặc qua ô góp ý trên trang Hướng dẫn & hỗ trợ của hệ thống thử nghiệm (`#/hotro`).

*Thanh Hóa, tháng 10 năm 2026*

**TS. Hà Ngọc Sơn**

# Hướng dẫn sử dụng cuốn sách

Không ai buộc phải đọc hết khoảng 300 trang sách này từ đầu đến cuối. Phần dưới đây giúp đồng chí chọn đường đọc phù hợp.

## Năm phần của cuốn sách

| Phần | Chương | Nội dung chính |
|---|---|---|
| Thứ nhất — Nền tảng | 1–4 | Câu chuyện khởi đầu, AI tạo ứng dụng, pháp lý, bảy nguyên tắc |
| Thứ hai — Hành trang | 5–8 | Công cụ, giao việc cho tác tử AI, bộ nhớ dự án, đặc tả |
| Thứ ba — Thực chiến | 9–15 | Từng nhóm phân hệ của hệ thống thử nghiệm |
| Thứ tư — Việc hằng ngày | 16–18 | Quy trình AI cho nghiệp vụ, vai trò lãnh đạo, lộ trình 30 ngày |
| Thứ năm — Bền vững | 19–20 | An toàn, chi phí, chính thức hóa, bài học |

Mỗi chương Phần thứ ba đi từ bài toán, thiết kế, cách giao việc cho AI, sự cố và bài học đến mục "Nếu đồng chí muốn làm phiên bản nhỏ hơn". Cuối sách là Lời kết và sáu phụ lục: thuật ngữ (Phụ lục 1), câu lệnh mẫu (Phụ lục 2), mẫu bộ nhớ dự án (Phụ lục 3), mẫu Quy tắc sử dụng AI (Phụ lục 4), văn bản pháp luật (Phụ lục 5), bảng kiểm trước khi đưa ứng dụng vào sử dụng (Phụ lục 6).

## Ba lộ trình đọc theo vai

| Vai | Nên đọc | Có thể lướt |
|---|---|---|
| Lãnh đạo | Chương 1, 3, 4, 17, 19, 20 | Phần cài đặt, khối mã |
| Cán bộ dùng AI hằng ngày | Chương 1, 2, 3, 16, 18; Phụ lục 2 | Chi tiết kỹ thuật |
| Cán bộ tự làm ứng dụng | Đọc tuần tự, kỹ nhất Phần thứ hai và thứ ba | Không nên bỏ chương nào |

**Lãnh đạo** không cần tự gõ lệnh, nhưng cần đủ hiểu để hỏi đúng, quyết đúng: Chương 17 có mười câu hỏi nên đặt ra khi cán bộ trình một ứng dụng hay quy trình AI; ở các chương khác, đọc hộp "Dành cho lãnh đạo" là đủ. **Cán bộ dùng AI hằng ngày** chưa chắc cần làm phần mềm; Chương 16 chỉ rõ với từng nghiệp vụ phần nào AI làm, phần nào người làm, cấp dữ liệu nào được phép.

## Các hộp nội dung

| Hộp | Dùng để |
|---|---|
| Mục tiêu của chương | Nêu điều sẽ học và ai nên đọc kỹ |
| Câu chuyện thực tế | Chuyện có thật của dự án, kèm nguyên nhân gốc |
| Ví dụ minh họa | Tình huống giả định, không phải chuyện đã xảy ra |
| Cảnh báo | Rủi ro pháp lý, bảo mật, chi phí |
| Ghi nhớ | Nguyên tắc cô đọng |
| Căn cứ pháp lý | Trích văn bản đã đối chiếu |
| Thực hành | Các bước làm ngay, theo thứ tự |
| Câu lệnh mẫu | Câu lệnh hoàn chỉnh; điều chỉnh rồi mới dùng |
| Dành cho lãnh đạo | Điều lãnh đạo cần biết, cần quyết |
| Tóm tắt chương | Các ý chính để ôn lại |

Cần phân biệt hộp "Câu chuyện thực tế" (chuyện đã xảy ra, lấy từ nhật ký dự án; khác hộp "Tình huống thực tế" đã ẩn danh của Tập 1) với hộp "Ví dụ minh họa" (tình huống dựng ra; tên đơn vị, con số trong đó là giả định). Cuối mỗi chương có mục "Câu hỏi suy ngẫm và bài tập".

## Cách dùng câu lệnh mẫu

Câu lệnh mẫu đánh số theo chương (Câu lệnh mẫu 6.3 là câu thứ ba của Chương 6), phần lớn viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG của Tập 1 (mục 3.2). Câu lệnh giao việc cho tác tử AI lập trình có thêm thành phần thứ sáu do Tập 2 bổ sung là Nghiệm thu: tiêu chí đo được để biết việc đã xong và đạt (Chương 6, mục 6.2). Chỗ trong [ngoặc vuông] là chỗ điền thông tin của mình. Nên dùng theo năm bước:

1. Điền đủ chỗ trong ngoặc vuông; bỏ dòng không hợp.
2. Xếp dữ liệu vào một trong bốn cấp của Tập 1 (mục 7.1–7.2): Cấp 1 Công khai dùng được với mọi AI; Cấp 2 Nội bộ chỉ dùng AI có cam kết bảo mật cho tổ chức, sau khi ẩn danh; Cấp 3 Hạn chế tiếp cận (dữ liệu cá nhân, đơn thư, hồ sơ cán bộ) chỉ dùng AI có máy chủ trong nước hoặc tự triển khai trong cơ quan; Cấp 4 Bí mật nhà nước tuyệt đối không đưa lên AI nước ngoài, và theo Luật 117/2025/QH15 không soạn thảo, lưu giữ trên thiết bị kết nối Internet. Không chắc thì chọn cấp cao hơn.
3. Chạy thử bằng dữ liệu giả hoặc văn bản công khai.
4. Kiểm chứng với văn bản gốc mọi số hiệu, điều khoản, con số AI đưa ra.
5. Lưu bản đã chỉnh vào thư viện câu lệnh riêng (như Tập 1, Phụ lục A), ghi kèm kết quả.

Phải sửa kết quả quá nhiều thì viết lại câu lệnh, theo nguyên tắc 20-80 (Tập 1, mục 3.1). Chưa quen tự điều chỉnh thì nhờ chính AI giúp:

::: {.lenhmau}
**Câu lệnh mẫu 0.1 — Điều chỉnh một câu lệnh mẫu cho đúng việc của mình**

```text
VAI: Anh/chị là chuyên viên tham mưu nhiều kinh nghiệm ở [tên phòng/Ban].
BỐI CẢNH: Tôi muốn dùng câu lệnh mẫu dưới đây, lấy từ một cuốn sách
hướng dẫn. Việc thực tế của tôi là [mô tả ngắn việc cần làm].
Dữ liệu tôi sẽ dùng thuộc [Cấp 1 Công khai / Cấp 2 Nội bộ đã ẩn danh].
Tin nhắn này không chứa tài liệu mật, không chứa thông tin cá nhân.
Câu lệnh mẫu: [dán câu lệnh mẫu vào đây]
VIỆC:
1. Chỉ ra chỗ trong câu lệnh mẫu chưa khớp với việc của tôi.
2. Đề xuất câu lệnh đã điều chỉnh, giữ đủ 5 thành phần
   Vai - Bối cảnh - Việc - Dạng - Ràng buộc.
3. Liệt kê thông tin còn thiếu mà tôi phải tự bổ sung.
4. Chỉ ra chỗ tôi phải ẩn danh trước khi dán dữ liệu thật.
DẠNG: Bảng "Chỗ cần sửa - Lý do - Đề xuất", sau đó là câu lệnh mới
trong một khối riêng.
RÀNG BUỘC: Không tự thêm số hiệu văn bản, số liệu, tên người nào mà
tôi chưa cung cấp. Chỗ nào không chắc, ghi "Cần kiểm tra".
```
:::

Dòng Ràng buộc quan trọng nhất, vì AI rất dễ "điền giúp" một số hiệu văn bản hay con số nghe hợp lý.

## Quy ước trình bày

- **Thuật ngữ:** lần đầu trong mỗi chương viết tiếng Việt trước, tiếng Anh trong ngoặc, như kho mã nguồn (repository), triển khai (deploy); Phụ lục 1 có bảng tra.
- **Nối với Tập 1:** dẫn kèm số mục, như (Tập 1, mục 7.2), và giữ đúng tên gọi của Tập 1. Toàn văn Tập 1 đọc được trong phân hệ Tủ sách (`#/tusach`) của hệ thống thử nghiệm.
- **Bảo vệ thông tin:** ngoài tác giả, không ai được nêu họ tên, chỉ nhắc theo chức danh; sách không in số điện thoại, mật khẩu, khóa bí mật, mã truy cập, và chỉ kể bài học bảo mật ở mức nguyên tắc.
- **Giá cả:** là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi.

## Đọc sách cùng hệ thống đang chạy

Hệ thống thử nghiệm ở địa chỉ `https://hdndthkpi.vercel.app`; khách xem không cần tài khoản. Mỗi phân hệ có đường dẫn riêng: `#/okr` (Đánh giá OKR/KPI), `#/kiemdiem` (Kiểm điểm đảng viên), `#/tieuchi` (Tiêu chí HĐND), `#/bieuquyet` (Biểu quyết Online), `#/sotay` (Sổ tay AI). Quản lý cán bộ (`#/canbo`) chỉ dành cho Quản trị; khách không xem được là đúng thiết kế. Mã nguồn công khai tại `https://github.com/sonthkh-alt/hdndthkpi`, gồm cả nhật ký thay đổi và bộ nhớ dự án (Chương 7). Hệ thống vẫn được sửa sau khi sách hoàn thành; màn hình khác mô tả thì xem nhật ký thay đổi.

::: {.thuchanh}
**Thực hành: năm việc nên làm trước khi đọc Chương 1**

1. Chọn một trong ba lộ trình đọc, đánh dấu các chương sẽ đọc.
2. Mở hệ thống thử nghiệm với tư cách khách, xem Trang chủ và ít nhất một phân hệ; để ý nhãn "Bản demo thử nghiệm".
3. Tắt tùy chọn cho trợ lý AI đang dùng lấy nội dung trò chuyện để huấn luyện mô hình (Tập 1, mục 2.5); nhớ rằng "không huấn luyện" không có nghĩa là "không lưu trữ" (mục 7.2).
4. Ghi ra một việc lặp lại hằng tháng muốn cải tiến, làm "bài toán" để đối chiếu khi đọc.
5. Lập "nhật ký học": câu lệnh đã dùng, kết quả, chỗ AI sai.
:::

# Lưu ý quan trọng trước khi đọc

Năm lưu ý dưới đây giúp tránh những hiểu lầm có hậu quả thật.

## Hệ thống trong sách là bản demo thử nghiệm

Đầu trang, trang đăng nhập và chân trang của hệ thống đều mang nhãn "Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu". Nhãn ấy có nghĩa thật:

- Hệ thống không thay thế quy trình, văn bản, hồ sơ chính thức, không phải phần mềm do cấp có thẩm quyền ban hành; điểm số, xếp loại trên đó không phải kết quả đánh giá chính thức.
- Phần lớn dữ liệu là mô phỏng. Họ tên, chức vụ ở các phân hệ đánh giá theo danh sách cán bộ của cơ quan, nhưng điểm số, xếp loại gắn với từng người là số liệu dựng sẵn để trình diễn. 82 đại biểu ở Biểu quyết Online chỉ mang mã DB01 đến DB82; 14 đơn vị ở Tiêu chí HĐND có tên và điểm đều là mô phỏng.
- Hạ tầng là dịch vụ đám mây ở mức miễn phí, tức máy chủ thuê của các hãng; cơ sở dữ liệu đặt tại khu vực Singapore. Vì Tập 1 (mục 7.2) chỉ cho xử lý dữ liệu Cấp 3 trên máy chủ trong nước hoặc tự triển khai, bản thử nghiệm đồng chí tự làm không được chứa dữ liệu Cấp 3, Cấp 4. Danh bạ và hồ sơ trong phân hệ Quản lý cán bộ là dữ liệu cá nhân, hiện chỉ Quản trị đọc được; đó là điểm tồn tại phải xử lý trước khi dùng chính thức, không phải cách làm để noi theo (Chương 12, Chương 19). Muốn dùng thật phải chuyển về hạ tầng của cơ quan và gỡ các quyền đọc công khai đang mở để trình diễn (Chương 20).

## Pháp luật được đối chiếu đến ngày 26/10/2026

Văn bản dẫn trong sách được đối chiếu số hiệu, ngày ban hành, hiệu lực, tình trạng đến ngày 26/10/2026 (danh mục ở Phụ lục 5). Trước khi áp dụng, hãy tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo, vì văn bản thay đổi rất nhanh. Ví dụ, Quy định 366-QĐ/TW của Bộ Chính trị về kiểm điểm, đánh giá, xếp loại chất lượng vẫn là căn cứ cho năm 2026, nhưng sẽ được Quy định 227-QĐ/TW ngày 19/10/2026 thay thế từ 01/01/2027.

Một số văn bản Tập 1 dẫn nay đã được thay thế (Chương 3 trình bày kỹ):

| Tập 1 dẫn | Nay áp dụng | Hiệu lực |
|---|---|---|
| Quyết định 127/QĐ-TTg (chiến lược AI) | Quyết định 1671/QĐ-TTg | 28/8/2026 |
| Luật số 29/2018/QH14 (bí mật nhà nước) | Luật số 117/2025/QH15 | 01/3/2026 |
| Luật An ninh mạng 2018; Luật An toàn thông tin mạng 2015 | Luật An ninh mạng số 116/2025/QH15 | 01/7/2026 |
| Nghị định 13/2023/NĐ-CP (dữ liệu cá nhân) | Luật số 91/2025/QH15; Nghị định 356/2025/NĐ-CP | 01/01/2026 |
| Luật Tiếp cận thông tin 2016 | Luật số 01/2026/QH16 | 01/9/2026 |
| Luật Ban hành văn bản quy phạm pháp luật 2015 | Luật số 64/2025/QH15, sửa đổi bởi Luật số 87/2025/QH15 | 01/4/2025 |

Chỗ nào chưa đối chiếu được nguyên văn, sách chỉ nói chung, không nêu số hiệu. Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã nhiệm kỳ 2026–2031 mà phần mềm số hóa còn là dự thảo; chỗ phần mềm "chuẩn hóa" chỉ là kiến nghị (Chương 8, mục 8.5).

## Công cụ và giá cả thay đổi rất nhanh

| Thời điểm | Thay đổi | Ý nghĩa với người đọc |
|---|---|---|
| 18/6/2026 | Gemini CLI được thay bằng Antigravity CLI với người dùng gói miễn phí | Hướng dẫn cài đặt cũ không còn đúng |
| 16/7/2026 | Google đổi tên NotebookLM thành Gemini Notebook | Tên trong sách và trên màn hình có thể khác |
| 02/9/2026 | Hạn mức Gemini Notebook tính theo khối lượng tính toán | Hết số lượt hỏi cố định mỗi ngày |
| 22/10/2026 | Dự án phát hiện địa chỉ đã chuyển sang notebook.google.com | Kiểm tra lại liên kết đã lưu |

Dòng cuối là chuyện của chính dự án: giả định cũ của AI về tên miền chỉ lộ ra khi kiểm tra đường dẫn thật. Sách gọi là Gemini Notebook (trước đây là NotebookLM), trừ khi nhắc tên nhiệm vụ đã đăng ký và giao diện phân hệ Sổ tay AI, vốn vẫn ghi NotebookLM (Chương 15). Claude Code không có trong gói miễn phí; gói thấp nhất có nó là Pro, 20 USD/tháng, chưa gồm thuế — giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi. Trước khi cài đặt hay dựa vào mức giá nào, hãy xem trang chính thức của nhà cung cấp.

## Câu lệnh mẫu phải được điều chỉnh và kiểm chứng

Câu lệnh mẫu là điểm khởi đầu, không phải đơn thuốc dùng ngay. Năm điều AI không làm được (Tập 1, mục 1.3) vẫn nguyên giá trị, nhất là: không tự kiểm tra chính xác được số liệu, không biết văn bản vừa ban hành, không có thẩm quyền pháp lý. Tác tử AI lập trình còn hành động trên máy: sửa tệp, chạy lệnh, đẩy mã lên mạng. Vì vậy hãy lưu một mốc mã nguồn để quay lại được, giao từng việc nhỏ, nghiệm thu bằng chạy thử thật chứ không chỉ nghe AI báo "đã xong" (Chương 6, Chương 7).

Cũng cần phân biệt chỉ tiêu với kết quả: "giảm ít nhất 30% thời gian tra cứu" của nhiệm vụ Sổ tay AI là chỉ tiêu đã đăng ký; ba mốc của nhiệm vụ (15/11, 25/11 và 10/12/2026) đều sau thời điểm viết, nên đó chưa phải kết quả.

::: {.canhbao}
**Cảnh báo: ba lằn ranh không được vượt**

- Không đưa dữ liệu Cấp 3 (dữ liệu cá nhân, đơn thư có danh tính người khiếu nại, tố cáo, hồ sơ cán bộ) lên trợ lý AI công cộng hay ứng dụng trên đám mây công cộng; dữ liệu Cấp 4 thì tuyệt đối không. Điều 5 Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực từ 01/3/2026) nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng máy tính, mạng viễn thông (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu). Dữ liệu cá nhân chịu sự điều chỉnh của Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (hiệu lực từ 01/01/2026).
- Không dùng kết quả bản demo hay câu trả lời của AI làm căn cứ pháp lý, kết luận chính thức. Tập 1 đã viết rõ: không có "đổ lỗi cho AI" trong công vụ (mục 7.7).
- Không để khóa bí mật, mật khẩu, số điện thoại, dữ liệu cá nhân nằm trong kho mã nguồn công khai; thứ gì đã đưa lên đó coi như đã công bố (Chương 19).
:::

## Trách nhiệm đối với nội dung cuốn sách

Đây là sách chia sẻ kinh nghiệm cá nhân; tác giả chịu trách nhiệm về nội dung. Nhận định trong sách là của cá nhân tôi, không đại diện quan điểm chính thức của Văn phòng, Thường trực HĐND tỉnh, Đoàn ĐBQH tỉnh hay cơ quan nào; khi khác với văn bản, hướng dẫn của cấp có thẩm quyền, xin theo văn bản, hướng dẫn đó.

::: {.ghinho}
**Ghi nhớ**

Máy đề xuất – người quyết định. AI viết nháp, tính toán, gợi ý; con người kiểm chứng, phê duyệt và chịu trách nhiệm. Mọi kỹ thuật trong sách, từ câu lệnh đầu tiên đến hệ thống nhiều phân hệ, đều phục vụ nguyên tắc ấy.
:::
