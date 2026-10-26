# Chương 17. Dành cho lãnh đạo: dẫn dắt ứng dụng AI trong cơ quan

::: {.muctieu}
**Mục tiêu của chương**

- Nắm mười câu hỏi nên đặt ra khi cán bộ trình một ứng dụng hay quy trình có dùng trí tuệ nhân tạo (AI), để quyết định đúng mà không cần biết lập trình.
- Biết khung nội dung của quy chế sử dụng AI trong cơ quan và các văn bản của Đảng, Nhà nước làm căn cứ.
- Hình dung lộ trình thí điểm, nhân rộng, chính thức hóa; chọn bài toán đầu tiên và đo hiệu quả trung thực.
- Phân biệt các mô hình chi phí; nhận diện bốn nhóm rủi ro, trong đó có rủi ro "người duy nhất biết".
- Biết xây dựng đội ngũ, văn hóa thử nghiệm có kỷ luật, và chọn giữa tự làm, đặt hàng, dùng nền tảng có sẵn.

Dành cho: lãnh đạo Văn phòng, lãnh đạo các Ban, Thường trực Hội đồng nhân dân, đại biểu hoạt động chuyên trách; trưởng, phó các phòng; thành viên Tổ công tác về chuyển đổi số. Cán bộ tự làm ứng dụng nên đọc để biết trước lãnh đạo sẽ hỏi gì.
:::

Các chương trước phần lớn viết cho người trực tiếp làm. Chương này viết cho người phải quyết định: cho làm hay không, làm đến đâu, ai chịu trách nhiệm, dừng lúc nào.

Tôi ở cả hai vị trí. Là Phó Chánh Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa (sau đây gọi tắt là Văn phòng), tôi là một người trong tập thể lãnh đạo, phải ký và chịu trách nhiệm. Là người dựng hệ thống thử nghiệm của Văn phòng tại địa chỉ hdndthkpi.vercel.app, tôi giao việc hằng ngày cho tác tử AI lập trình. Đứng ở vị trí thứ hai, tôi thấy rõ những điều người ở vị trí thứ nhất cần biết mà ít khi được báo cáo: dữ liệu đang nằm ở đâu, ai xem được, mỗi tháng tốn bao nhiêu, người làm nghỉ phép thì ai sửa.

Năm 2026, định hướng đã rất rõ. Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị xác định khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là "đột phá quan trọng hàng đầu". Luật Trí tuệ nhân tạo số 134/2025/QH15, hiệu lực từ 01/3/2026, tại khoản 3 Điều 5 ưu tiên ứng dụng AI trong quản lý, điều hành, cung cấp dịch vụ công và hỗ trợ ra quyết định của cơ quan nhà nước. Trợ lý ảo AI trên App Quốc hội 2.0 đã hỗ trợ đại biểu Quốc hội từ Kỳ họp thứ 9 (năm 2025). Tại tỉnh, ngày 7/5/2026, Thường trực HĐND tỉnh tổ chức hội nghị tập huấn sử dụng AI cho cán bộ, công chức Văn phòng.

Câu hỏi với lãnh đạo vì thế không còn là "có nên dùng AI không", mà là dùng thế nào cho đúng, cho an toàn, cho bền. Chương này đưa ra những công cụ quản lý cụ thể: bộ câu hỏi, khung quy chế, lộ trình, thước đo, sổ rủi ro, ma trận quyết định, rút ra từ những việc đã làm và những lần đã sai ở Văn phòng.

## 17.1. Lãnh đạo không cần biết lập trình, nhưng cần biết hỏi đúng

Một đồng chí Chánh Văn phòng không tự vẽ bản thiết kế cải tạo trụ sở, nhưng khi duyệt tờ trình vẫn biết hỏi: kinh phí bao nhiêu, ai thi công, nghiệm thu thế nào, hỏng thì ai sửa. Với ứng dụng có AI cũng vậy. Chương 2 gọi vai của cán bộ tự làm ứng dụng là chủ đầu tư, tổng công trình sư và người nghiệm thu; lãnh đạo đứng thêm một tầng: người phê duyệt chủ trương và chịu trách nhiệm cuối cùng.

Cái khó là phần mềm "trông" giống nhau dù bên trong khác hẳn. Một trang web đẹp có thể đang để hồ sơ cán bộ cho mọi tài khoản đọc được; một con bot trả lời trơn tru có thể đang gửi họ tên, điểm số qua máy chủ của bên thứ ba. Nhìn màn hình không thấy. Phải hỏi.

### 17.1.1. Mười câu hỏi nên hỏi trước khi cho dùng

Cột thứ ba ghi những câu trả lời nghe thì yên tâm nhưng thực ra là tín hiệu phải hỏi tiếp.

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

**Câu 1, 2: bài toán và căn cứ.** Có văn bản chưa đủ. Phân hệ Kiểm điểm dựng đúng Hướng dẫn 03-HD/TU vẫn lệch biểu mẫu giấy ở bốn chỗ lớn, cho đến khi được đối chiếu với bản tự đánh giá thật đang dùng (Chương 10). Hãy hỏi thêm: "đã so với tờ giấy mọi người đang điền chưa?".

**Câu 3, 4: dữ liệu và quyền.** Người trình phải nói được dữ liệu thuộc vùng ĐỎ, VÀNG hay XANH theo cách phân loại của Tập 1, lưu ở đâu, đi qua dịch vụ nào, và quyền được chặn ở giao diện hay ở cơ sở dữ liệu. Ẩn một nút bấm chỉ là không chỉ đường; cửa vẫn mở.

::: {.cauchuyen}
**Câu chuyện thực tế: tab đã ẩn, cửa vẫn mở**

Phân hệ Quản lý cán bộ, nơi hồ sơ Mẫu 2C có ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình, có tab chỉ hiện với tài khoản Quản trị. Nhìn màn hình, rất dễ nghĩ ẩn tab là đủ.

Nhưng chính sách bảo mật cũ của cơ sở dữ liệu cho **mọi** tài khoản đã đăng nhập đọc **mọi** dòng dữ liệu. Một cán bộ bình thường, nếu biết cách gọi thẳng vào cửa giao dịch dữ liệu (API), vẫn đọc được hồ sơ. Vì vậy, ngay trong đợt dựng phân hệ, tệp lược đồ cơ sở dữ liệu phải có thêm một bước riêng: chỉ tài khoản Quản trị mới đọc, ghi được dòng hồ sơ cán bộ. Kèm theo là dòng cảnh báo: chưa chạy bước này thì hồ sơ không được bảo vệ.

Vì thế câu hỏi số 4 luôn có vế sau: "chặn ở tầng nào?". Người chỉ nhìn giao diện sẽ trả lời "đã ẩn rồi ạ".
:::

**Câu 5, 6: ranh giới máy và người.** Ở hệ thống của Văn phòng, phần mềm tính điểm và gợi ý xếp loại, còn nút "Phê duyệt" thuộc về người có thẩm quyền; sửa điểm sau khi đã duyệt thì phê duyệt tự động bị gỡ. Phân hệ Sổ tay AI không tự gán "còn hiệu lực" cho văn bản nào. Khi AI không chắc, nó phải trích dẫn tới điều, khoản, dám nói "không tìm thấy trong nguồn"; dữ liệu mô phỏng phải được dán nhãn.

**Câu 7, 8: chi phí và kiểm thử.** "Hiện đang miễn phí" là câu trả lời đáng hỏi tiếp nhất (mục 17.5). Về kiểm thử, người làm thường thử trường hợp đẹp; lãnh đạo nên hỏi trường hợp xấu: danh sách trống, trùng họ tên, ngày đầu tháng, mất mạng. Ngày 01/9/2026, ba phân hệ của Văn phòng cùng trắng trang chỉ vì kỳ đánh giá tháng mới chưa có dữ liệu; bấm thử trong tháng 8 không thể thấy lỗi ấy.

**Câu 9, 10: tính bền vững.** Ứng dụng chỉ sống khi người làm có mặt thì chưa phải tài sản của cơ quan (mục 17.6). Câu 10 hay bị quên nhất: khi tỉnh có nền tảng dùng chung tốt hơn, dữ liệu có xuất ra được không.

### 17.1.2. Biến mười câu hỏi thành một tờ phiếu

Tôi khuyên lãnh đạo yêu cầu người trình nộp kèm một "phiếu mười câu hỏi" viết ra, không quá hai trang. Viết ra thì người trình buộc phải tự kiểm tra, lãnh đạo có văn bản để đối chiếu, người tiếp nhận sau này có hồ sơ để đọc. Tác tử AI lập trình làm phần lớn việc này rất tốt, vì nó đọc được toàn bộ kho mã nguồn (repository).

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

Phiếu do AI lập chỉ là bản nháp; người trình tự đối chiếu vài dòng với mã nguồn hoặc chạy thử rồi mới ký nộp.
:::

::: {.ghinho}
**Ghi nhớ**

Câu trả lời nào chỉ nằm trong đầu người làm thì coi như chưa được trả lời.
:::

## 17.2. Xây dựng quy chế, quy tắc sử dụng AI của cơ quan

### 17.2.1. Vì sao người đứng đầu phải ra quy tắc

Không có quy tắc chung, mỗi cán bộ tự quyết một kiểu: người dùng tài khoản cá nhân đặt trùng mật khẩu thư công vụ, người dán nguyên dự thảo chưa trình vào trợ lý AI trò chuyện, người không dám dùng gì vì sợ sai.

Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ về nguyên tắc chung khi công chức, viên chức trong cơ quan nhà nước dùng chatbot AI nêu rõ: người đứng đầu chịu trách nhiệm hướng dẫn, công chức, viên chức chịu trách nhiệm về hành vi của mình khi dùng AI. Với bí mật nhà nước, Chỉ thị 32/CT-TTg ngày 21/10/2025 của Thủ tướng Chính phủ yêu cầu đề cao trách nhiệm người đứng đầu.

Cũng cần nói cho cân bằng: pháp luật không cấm cán bộ dùng AI nói chung. Điều bị cấm là dùng AI xâm phạm bí mật nhà nước, soạn thảo, lưu giữ tài liệu mật trên thiết bị kết nối Internet trái quy định, xử lý dữ liệu cá nhân sai luật. Quy tắc tốt vì thế là lời chỉ dẫn: được làm gì, không được làm gì, làm thế nào cho đúng.

::: {.phaply}
**Căn cứ pháp lý: những văn bản nên dẫn trong quy chế sử dụng AI**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (thông qua 10/12/2025, hiệu lực 01/3/2026). Khoản 2 Điều 4: *"Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người"*.
- Thông tư 05/2026/TT-BKHCN ngày 10/3/2026 (hiệu lực cùng ngày) quy định Khung đạo đức trí tuệ nhân tạo quốc gia, áp dụng bắt buộc với cơ quan quản lý nhà nước và tổ chức, cá nhân dùng hệ thống AI phục vụ quản lý nhà nước, cung cấp dịch vụ công.
- Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ (văn bản hướng dẫn, không phải văn bản quy phạm pháp luật): không đưa lên chatbot tài liệu mật, dữ liệu cá nhân, tài liệu nội bộ; không dùng tên, mật khẩu trùng tài khoản công vụ; thu hồi tài khoản khi cán bộ nghỉ việc, chuyển công tác; kiểm tra kết quả trước khi dùng.
- Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng, triển khai theo Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: AI hỗ trợ, không thay thế; sản phẩm do AI tạo ra phải được kiểm chứng, thẩm định, chỉnh sửa, người dùng chịu trách nhiệm hoàn toàn trước khi sử dụng hoặc ban hành; ưu tiên nền tảng do Việt Nam phát triển khi xử lý dữ liệu nội bộ, nhạy cảm.
- Quy định 207-QĐ/TW ngày 26/7/2026 của Ban Chấp hành Trung ương: Điều 5 bổ sung việc đảng viên không được dùng nền tảng số, trí tuệ nhân tạo để tạo lập, phát tán thông tin, nội dung sai sự thật.
- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực 01/3/2026): Điều 5 nghiêm cấm sử dụng hệ thống AI hoặc công nghệ mới để xâm phạm bí mật nhà nước; cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu).
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 01/01/2026) và Nghị định 356/2025/NĐ-CP (hiệu lực 01/01/2026, thay Nghị định 13/2023/NĐ-CP).

Văn bản được đối chiếu đến ngày 26/10/2026. Trước khi đưa vào quy chế, cần tra nguyên văn và tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

Văn phòng không phải cơ quan đảng nên Hướng dẫn kèm Công văn 19130-CV/VPTW không áp dụng trực tiếp; nhưng phần lớn cán bộ là đảng viên, và quy chế của cơ quan nên đi cùng tinh thần ấy.

### 17.2.2. Khung nội dung của một quy chế

Ở phân hệ Sổ tay AI, tôi đã soạn dự thảo "Quy tắc sử dụng trí tuệ nhân tạo trong tra cứu, hỏi đáp nghiệp vụ" gồm 9 điều, kèm sổ cam kết của cán bộ; dự thảo để trống ngày ký, chờ Chánh Văn phòng xem xét ban hành (toàn văn ở Phụ lục 4). Dự thảo này hẹp, chỉ phục vụ thí điểm hỏi đáp, tra cứu; quy chế đầy đủ cần bao cả soạn thảo văn bản, bot chat và ứng dụng tự làm. Khung tôi đề xuất, đặt cạnh những gì dự thảo đã có:

| Phần | Nội dung cốt lõi | Dự thảo 9 điều |
|---|---|---|
| Phạm vi | Ai, công cụ nào, việc nào | Điều 1 |
| Phân loại dữ liệu | ĐỎ, VÀNG, XANH; danh mục cấm nạp | Điều 2 |
| Công cụ, tài khoản | Công cụ được dùng; tắt huấn luyện; thu hồi | Điều 7 (một phần) |
| Kiểm chứng | Mở văn bản gốc; không lấy AI làm căn cứ | Điều 3, 4, 5 |
| Ranh giới quyết định | Máy đề xuất, người quyết định | Điều 6 |
| Minh bạch | Báo cho người đọc khi nội dung do AI tạo có thể gây nhầm lẫn | Chưa có |
| Ứng dụng tự làm | Đăng ký, phiếu mười câu hỏi, nhãn demo | Chưa có |
| Sự cố | Báo ngay, đánh dấu "Cần sửa lại" | Điều 8 |
| Tổ chức thực hiện | Tổ công tác chủ trì; báo cáo; rà soát định kỳ | Điều 9 |

Ba dòng cần giải thích thêm.

**Dòng "Minh bạch".** Điều 11 Luật Trí tuệ nhân tạo quy định thông báo nội dung do AI tạo ra hoặc chỉnh sửa có thể gây nhầm lẫn (khoản 3), gắn nhãn âm thanh, hình ảnh, video mô phỏng người thật (khoản 4). Với cơ quan dân cử, chỗ dễ vấp nhất là sản phẩm truyền thông về kỳ họp có giọng nói hay hình ảnh mô phỏng đại biểu: phải được duyệt và gắn nhãn.

**Dòng "Ứng dụng tự làm".** Đây là phần chính Văn phòng chưa có, và quan trọng nhất với độc giả cuốn sách này. Tôi đề xuất ba yêu cầu tối thiểu: đăng ký với Tổ công tác trước khi mời người khác dùng; nộp phiếu mười câu hỏi ở mục 17.1; mang nhãn "bản demo thử nghiệm" chừng nào chưa đi hết con đường chính thức hóa ở Chương 20.

**Dòng "Công cụ, tài khoản".** Quy chế nên ghi nguyên tắc, không ghi tên nút bấm: chỉ riêng năm 2026, NotebookLM đã đổi tên thành Gemini Notebook (16/7/2026), đổi tên miền và cách tính hạn mức. Hãy viết "tắt tùy chọn cho phép dùng dữ liệu để huấn luyện mô hình, theo hướng dẫn cập nhật của Tổ công tác".

### 17.2.3. Từ dự thảo đến ban hành và thực thi

Quy chế chỉ có giá trị khi đi kèm bốn việc: lấy ý kiến các phòng, các Ban, vì người dùng thật thấy những tình huống người soạn không nghĩ tới; đối chiếu với quy chế bảo vệ bí mật nhà nước và quy chế văn thư hiện hành để không chồng chéo; tập huấn rồi mới cho ký sổ cam kết; rà soát ít nhất mỗi năm một lần hoặc khi pháp luật, công cụ thay đổi lớn.

::: {.canhbao}
**Cảnh báo: quy chế trên giấy mà máy không thực thi**

Kho mã của chính hệ thống thử nghiệm là một ví dụ. Quy ước ghi "không đưa thư mục nháp lên kho", nhưng không có cơ chế nào chặn, nên một tệp thử nghiệm vẫn lọt lên. Quy tắc ghi "không đặt dự án trong OneDrive", nhưng hướng dẫn đăng ký tác vụ bản tin hằng ngày lại trỏ tới một thư mục trong OneDrive.

Quy định nào quan trọng thì phải có cơ chế đi kèm: tài khoản do cơ quan cấp và thu hồi được, danh mục công cụ được phép, kiểm tra định kỳ có biên bản. Ban hành mà không tập huấn, không kiểm tra thì quy chế chỉ là một tờ giấy đẹp.
:::

::: {.lenhmau}
**Câu lệnh mẫu 17.2 — Soạn dự thảo quy chế sử dụng AI của cơ quan**

```text
[VAI] Chuyên viên pháp chế của cơ quan dân cử cấp tỉnh, viết
văn bản hành chính trung lập, ngắn gọn.
[BỐI CẢNH] Cơ quan [tên] cần quy chế sử dụng AI. Đã có dự thảo
quy tắc 9 điều về tra cứu, hỏi đáp (dán dưới đây); cần mở rộng
cho soạn thảo văn bản, bot chat, ứng dụng do cán bộ tự làm.
[VIỆC] Soạn dự thảo quy chế 9 phần: phạm vi; phân loại dữ liệu
ĐỎ/VÀNG/XANH; công cụ và tài khoản; kiểm chứng và trách nhiệm;
ranh giới quyết định; minh bạch, gắn nhãn; ứng dụng tự làm
(đăng ký, phiếu mười câu hỏi, nhãn demo); sự cố; tổ chức thực
hiện và rà soát định kỳ.
[DẠNG] Chia điều, mỗi điều không quá 120 chữ.
[RÀNG BUỘC] KHÔNG tự điền số hiệu, ngày, điều khoản văn bản pháp
luật; chỗ cần căn cứ ghi [cần tra cứu]. Không ghi tên nút bấm
của phần mềm cụ thể. Không trái quy chế bảo vệ bí mật nhà nước.
[NGHIỆM THU] Đủ 9 phần; không số hiệu văn bản nào do AI tự đặt;
liệt kê riêng các chỗ [cần tra cứu].

[dán dự thảo 9 điều vào đây]
```

Câu lệnh này chỉ chứa nội dung vùng XANH. Phần căn cứ pháp lý đồng chí tự tra và điền theo hộp Căn cứ pháp lý ở trên.
:::

## 17.3. Lộ trình ba giai đoạn và bài toán đầu tiên

### 17.3.1. Thí điểm có kiểm soát, nhân rộng, chính thức hóa

Bản đặc tả yêu cầu phần mềm đánh giá cán bộ mà Văn phòng soạn tháng 7/2026 đã gợi ý lộ trình ba giai đoạn, bắt đầu bằng thí điểm 03 tháng. Tôi khái quát lại để dùng cho mọi ứng dụng.

| Giai đoạn | Làm gì | Điều kiện sang bước sau |
|---|---|---|
| 1. Thí điểm có kiểm soát | 1–2 bài toán, nhóm nhỏ, dữ liệu mô phỏng, nhãn demo | Có số đo trước – sau; người dùng muốn dùng tiếp |
| 2. Nhân rộng | Nhiều phòng, Ban; mỗi nơi một đầu mối | Quy chế đã ban hành; có người thứ hai vận hành được |
| 3. Chính thức hóa | Quyết định đưa vào sử dụng, hạ tầng được phép | Hồ sơ cấp độ, dữ liệu cá nhân, chuyển giao (Chương 20) |

Cột thứ ba là cửa kiểm soát: lãnh đạo không cần theo dõi từng dòng mã, chỉ cần không cho qua cửa khi chưa đủ điều kiện.

Nói trung thực: đến cuối tháng 10/2026, gần như toàn bộ hệ thống của Văn phòng vẫn ở giai đoạn 1, dữ liệu phần lớn là mô phỏng, trang nào cũng mang nhãn "Bản demo thử nghiệm, sử dụng nội bộ". Riêng Sổ tay AI là thí điểm đã đăng ký chính thức, có bốn chỉ tiêu và ba mốc 15/11, 25/11, 10/12/2026. Danh mục 48 sản phẩm, công việc của phân hệ OKR/KPI được dự thảo Hướng dẫn của Ban Tổ chức Tỉnh ủy trích làm minh họa: ý tưởng đã lan tỏa, nhưng phần mềm thì chưa được chính thức hóa.

### 17.3.2. Chọn bài toán đầu tiên

Bài toán đầu tiên quyết định niềm tin của cả cơ quan với AI. Tôi dùng sáu tiêu chí, mỗi tiêu chí chấm 0, 1 hoặc 2 điểm:

1. **Lặp lại thường xuyên**: hằng tuần, hằng tháng thì lợi ích cộng dồn.
2. **Có căn cứ rõ ràng**: văn bản quy định, biểu mẫu giấy, bảng tính đang dùng.
3. **Dữ liệu an toàn**: vùng XANH, hoặc vùng VÀNG ẩn danh được; vùng ĐỎ thì 0 điểm.
4. **Có người hiểu nghiệp vụ làm cùng**: quan trọng hơn người giỏi máy tính.
5. **Đo được trước – sau**: số phút, số lỗi, số lần phải làm lại.
6. **Sai thì hậu quả nhỏ, sửa được**: không chạm quyền lợi người dân hay quyết định nhân sự.

Bài toán từ 9 điểm trở lên đáng chọn làm bài đầu tiên; dưới 6 điểm thì để sau.

::: {.vidu}
**Ví dụ minh họa: chấm ba bài toán ứng viên**

Hãy hình dung một Ban có ba ý tưởng. (a) Sổ tay tra cứu văn bản đã công khai về hoạt động giám sát: cả sáu tiêu chí đều 2 điểm, vì sai thì người dùng vẫn mở văn bản gốc kiểm chứng; tổng 12 điểm. (b) Bảng tổng hợp kiến nghị cử tri có họ tên, địa bàn người kiến nghị: dữ liệu cá nhân được 0 điểm nếu không ẩn danh được, hậu quả được 1 điểm; tổng 9 điểm, chỉ làm khi đã có phương án ẩn danh và phân quyền. (c) Phân loại đơn tố cáo bằng AI: dữ liệu vùng ĐỎ, hậu quả lớn; không chọn, dù kỹ thuật làm được.
:::

Nhìn lại, bài toán đầu tiên của tôi, đánh giá cán bộ, không phải bài ít rủi ro nhất vì chạm tới dữ liệu cá nhân và tâm lý con người. Nó đi được nhờ ba điều: dữ liệu mô phỏng, nhãn demo ở mọi trang, mọi kết quả phải qua nút phê duyệt của người có thẩm quyền. Cơ quan mới bắt đầu nên chọn một sổ tay tra cứu văn bản công khai.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Duyệt thí điểm bằng văn bản: phạm vi, thời hạn, dữ liệu được dùng, người chịu trách nhiệm.
- Không cho qua cửa giai đoạn khi chưa có số đo và chưa có người thứ hai biết vận hành.
- Chấp nhận kết luận "dừng ở thí điểm" như một kết quả có giá trị.
:::

## 17.4. Đo hiệu quả trung thực

### 17.4.1. Ba cái bẫy khi báo cáo

Tập 1 đã cảnh báo hội chứng "tô hồng" của AI. Báo cáo về chính việc dùng AI cũng dễ mắc bệnh ấy, qua ba cái bẫy.

**Bẫy thứ nhất: lấy mục tiêu làm kết quả.** Con số "giảm 30% thời gian" có thể là chỉ tiêu đăng ký, mục tiêu của một chương trình, hoặc kết quả đã đo; ba thứ khác hẳn nhau. Nhiệm vụ Sổ tay AI có chỉ tiêu giảm ít nhất 30% thời gian tra cứu; khi viết những dòng này, đó vẫn là chỉ tiêu. Bản mô tả sáng kiến về phần mềm đánh giá theo OKR/KPI cũng để trống phần số liệu hiệu quả, chờ có số đo thật.

**Bẫy thứ hai: chỉ đo phần nhanh.** AI soạn bản nháp trong một phút, nhưng cán bộ có thể mất hai mươi phút kiểm chứng. Đo đúng phải tính cả thời gian kiểm chứng.

**Bẫy thứ ba: đếm cái dễ đếm.** Số phân hệ, số dòng mã, số lượt hỏi AI là quy mô, không phải hiệu quả. Khoảng 21.400 dòng mã của hệ thống cho biết công sức bỏ ra, không cho biết cơ quan được lợi gì.

### 17.4.2. Bộ thước đo và cách đo trước – đo sau

| Nhóm | Thước đo ví dụ | Lấy số ở đâu |
|---|---|---|
| Thời gian | Số phút cho một việc, kể cả kiểm chứng | Đo trước – sau, cùng loại việc |
| Chất lượng | Số lỗi người duyệt phát hiện; số lần trả lại | Sổ theo dõi của người duyệt |
| Sử dụng thật | Số người còn dùng sau một tháng | Nhật ký hệ thống |
| An toàn | Số sự cố, số lần nhập nhầm dữ liệu ĐỎ | Sổ sự cố |
| Chi phí | Tiền dịch vụ; giờ công bảo trì | Hóa đơn, nhật ký thay đổi |

Phân hệ Sổ tay AI có một cách đo đáng học: mỗi lần tra nhanh tại chỗ, người dùng có ô ghi "nếu tra thủ công thì mất bao nhiêu phút". Cộng dồn lại là số liệu từ chính người dùng, không phải ước lượng của người làm.

Thêm một nguyên tắc rút từ sự cố bản tin pháp luật: kiểm sản phẩm ở nơi người dùng nhìn thấy. Tác vụ sinh bản tin trên đám mây từng được coi là chạy hằng ngày, nhưng quét cả 18 kho mã của tài khoản không thấy ảnh bản tin nào. Báo cáo "đã chạy" không thay được việc mở Trang chủ ra xem.

::: {.thuchanh}
**Thực hành: đo trước – đo sau trong hai tuần**

1. Chọn một việc lặp lại đủ nhiều, ví dụ tra cứu căn cứ pháp lý cho một câu hỏi nghiệp vụ.
2. Tuần thứ nhất, làm theo cách cũ ít nhất năm lần; ghi số phút và số lỗi phát hiện khi duyệt.
3. Tuần thứ hai, làm cùng loại việc với công cụ mới; ghi số phút **cả phần kiểm chứng** và số lỗi.
4. Ghi điều kiện đo: ai làm, việc khó hay dễ, công cụ nào.
5. So sánh, viết kết luận một đoạn, nêu cả lần công cụ làm chậm hơn hoặc sai.
:::

::: {.canhbao}
**Cảnh báo: đừng biến mức sử dụng AI thành chỉ tiêu chấm điểm cán bộ**

Quy luật Goodhart: khi một thước đo trở thành mục tiêu, nó không còn là thước đo tốt. Hệ thống của Văn phòng vì thế không dùng phần trăm đạt OKR để chấm điểm cá nhân (Chương 9). Ở cấp cơ quan, nếu chỉ đếm số lượt dùng AI của từng người, cán bộ sẽ dùng cho đủ lượt. Thước đo mức sử dụng phải đi kèm thước đo chất lượng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 17.3 — Soạn báo cáo đánh giá thí điểm không tô hồng**

```text
[VAI] Chuyên viên tổng hợp, viết báo cáo trung thực, văn phong
hành chính trung lập.
[BỐI CẢNH] Cơ quan thí điểm [công cụ] cho việc [tên việc] từ
[ngày] đến [ngày], [số] người tham gia. Số đo: [dán bảng số
phút, số lỗi trước và sau; số người còn dùng; sự cố].
[VIỆC] Báo cáo 4 phần: (1) chỉ tiêu đã đăng ký; (2) kết quả đo
được, ghi Đạt hoặc Chưa đạt; (3) hạn chế, sự cố, lần công cụ
làm sai hoặc chậm hơn; (4) kiến nghị tiếp tục, điều chỉnh hay
dừng.
[DẠNG] Không quá 2 trang, có một bảng chỉ tiêu.
[RÀNG BUỘC] CHỈ dùng số liệu tôi đưa; không suy diễn phần trăm
khi không có số gốc. Phân biệt "chỉ tiêu" với "kết quả đo
được". Cấm các cụm "vô cùng hiệu quả", "đột phá".
[NGHIỆM THU] Mọi con số trong báo cáo đều có trong bảng tôi đưa.
```
:::

## 17.5. Ngân sách và mô hình chi phí

Giá dưới đây là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi. Quan trọng hơn con số là giới hạn của từng mô hình.

| Mô hình | Phù hợp khi | Giới hạn chính |
|---|---|---|
| Gói miễn phí của dịch vụ | Bản demo, dữ liệu mô phỏng hoặc công khai | Tạm dừng, "ngủ", điều khoản phi thương mại |
| Tài khoản cá nhân của cán bộ | Tự học; tra cứu văn bản công khai | Khó quản lý; phải tự tắt huấn luyện |
| Tài khoản tổ chức | Dùng chung có quản lý | Phí theo người; cần thủ tục mua sắm |
| Hạ tầng chính thức | Dữ liệu thật, nhiều đơn vị, lâu dài | Theo trình tự dự án, mất thời gian |

**Gói miễn phí** giúp hệ thống thử nghiệm của Văn phòng ra đời mà không tốn ngân sách, nhưng có giá. Theo tài liệu chính thức của Supabase, dự án ở gói miễn phí bị tạm dừng sau một tuần không hoạt động, mỗi người tối đa hai dự án đang chạy; gói trả phí thấp nhất từ 25 USD/tháng. Phân hệ Một dữ liệu chạy trên gói miễn phí của Render nên lần mở đầu chậm 30 đến 60 giây. Điều khoản của một số gói miễn phí chỉ dành cho mục đích cá nhân, phi thương mại; phải đọc kỹ trước khi dùng cho việc chính thức.

**Tài khoản cá nhân** là mô hình của Sổ tay AI: mỗi sổ tay là một notebook trên Gemini Notebook (trước đây là NotebookLM) do Văn phòng lập và chia sẻ quyền chỉ xem; cán bộ đăng nhập tài khoản Google của mình nên cơ quan không phát sinh kinh phí. Nhưng từ 02/9/2026, Google chuyển sang hạn mức theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ, có trần theo tuần. Kế hoạch dựa vào hạn mức miễn phí phải có phương án dự phòng, và tài khoản phải được quản lý như mục 17.2 đã nêu.

**Tài khoản tổ chức** có lợi thế về dữ liệu: gói Team và Enterprise của Claude mặc định không dùng nội dung để huấn luyện mô hình, còn gói cá nhân phải tự tắt. Gói Team khoảng 25 USD/chỗ/tháng (20 USD nếu trả theo năm); tác tử AI lập trình Claude Code không có trong gói miễn phí, gói Pro 20 USD/tháng. Với bot Zalo, theo bảng giá mới từ 01/6/2026 do các nguồn thứ ba tổng hợp, gói có chatbot và API khoảng 2,5 triệu đồng/năm; cần đối chiếu trang chính thức trước khi lập dự toán.

**Hạ tầng chính thức** là cần thiết khi xuất hiện một trong bốn tín hiệu: có dữ liệu thật về con người; nhiều đơn vị cùng dùng; công việc hằng ngày phụ thuộc vào hệ thống; cần cam kết vận hành, sao lưu. Thuê máy chủ, dịch vụ, đơn vị phát triển là chi tiêu ngân sách, phải theo quy định về quản lý đầu tư ứng dụng công nghệ thông tin và làm cùng đơn vị chuyên trách.

### 17.5.1. Chi phí ẩn và trần chi phí

Ba khoản chi không ghi trên hóa đơn: thời gian của người làm, công bảo trì khi nền tảng bên ngoài đổi luật, và rủi ro dữ liệu khi chọn dịch vụ rẻ. Khi hệ thống của Văn phòng dùng khóa AI của một dịch vụ trung gian giá rẻ, mọi câu hỏi và số liệu nạp kèm, kể cả họ tên, điểm, xếp loại cán bộ, đi qua máy chủ của bên thứ ba. Chọn dịch vụ AI là quyết định về dữ liệu, không chỉ về giá.

Về trần chi phí, hệ thống đặt hạn mức theo ngày, đếm ở máy chủ: Trợ lý AI cho khách 1 lượt, người đăng nhập 5 lượt; khung chat Người hướng dẫn 3 lượt AI mỗi khách; bot Zalo, Telegram 30 câu mỗi người. Lượt bị trừ trước khi gọi AI; câu hỏi thường gặp trả lời bằng kịch bản soạn sẵn; bản tin pháp luật không gọi AI. Lãnh đạo chỉ cần hỏi: trần ở đâu, ai đặt, ai xem số liệu hằng tháng.

Cuối cùng, "miễn phí" không có nghĩa là "không có chủ". Tài khoản dịch vụ miễn phí thường do một cá nhân đứng tên, kéo theo khóa bí mật, tên miền, dữ liệu; người đó chuyển công tác thì cơ quan mất quyền với chính hệ thống của mình. Trước khi nhiều người dùng, phải chuyển tài khoản sang đứng tên cơ quan.

## 17.6. Quản trị rủi ro

Rủi ro không làm việc ứng dụng AI thành sai; nó chỉ cần được nhìn thấy, ghi lại và có người theo dõi. Tôi gom thành bốn nhóm trong một "sổ rủi ro" một trang.

| Rủi ro | Dấu hiệu sớm | Biện pháp |
|---|---|---|
| Dữ liệu | Dữ liệu cá nhân trong kho mã, trong câu hỏi gửi AI | Phân vùng; chặn ở cơ sở dữ liệu; kiểm tra định kỳ |
| Pháp lý | Căn cứ chép từ tài liệu cũ, từ trí nhớ AI | Người theo dõi văn bản mới; tra hiệu lực |
| Phụ thuộc nhà cung cấp | Giá, tên, hạn mức đổi không báo trước | Tách lớp gọi AI; nguồn mở; phương án thay |
| Người duy nhất biết | Một người sửa được; tài khoản đứng tên cá nhân | Ghi chép; người thứ hai; diễn tập vắng mặt |

**Rủi ro dữ liệu** đã được bàn kỹ ở Chương 19. Lãnh đạo chỉ cần nhớ: tài liệu mật tuyệt đối không đưa lên bất kỳ nền tảng AI công cộng hay dịch vụ đám mây nào; dữ liệu cá nhân phải được thu thập tối thiểu, phân quyền chặt.

**Rủi ro pháp lý** đến từ tốc độ thay đổi. Trong hai năm 2025–2026, các luật về trí tuệ nhân tạo, bảo vệ dữ liệu cá nhân, bảo vệ bí mật nhà nước, an ninh mạng, chuyển đổi số đều được ban hành mới. Ngay bản đặc tả phần mềm của Văn phòng soạn tháng 7/2026 vẫn ghi căn cứ là Nghị định 13/2023/NĐ-CP, văn bản đã hết hiệu lực từ 01/01/2026. Theo cách tôi hiểu Luật Trí tuệ nhân tạo, khi cơ quan đưa một bot hay ứng dụng có AI vào phục vụ công việc, cơ quan có thể trở thành "bên triển khai" hệ thống AI; Nghị định 142/2026/NĐ-CP yêu cầu phân loại rủi ro trước khi đưa hệ thống vào sử dụng và phân loại lại khi thay đổi chức năng làm phát sinh rủi ro mới.

**Rủi ro phụ thuộc nhà cung cấp** hiện rõ trong năm 2026: NotebookLM đổi tên, đổi tên miền; Gemini CLI được thay bằng Antigravity CLI cho người dùng miễn phí từ 18/6/2026; Zalo đổi hệ thống gói dịch vụ từ 01/6/2026. Hệ thống của Văn phòng chống đỡ bằng thiết kế: bộ nối AI dùng được với Anthropic, Google hoặc OpenAI, chỉ cần một khóa; cơ sở dữ liệu lõi là PostgreSQL, phần mềm nguồn mở; hệ thống riêng được gắn bằng liên kết, không gộp mã. Hãy hỏi: "nhà cung cấp này đổi giá hay đóng cửa tháng sau thì mình mất gì?".

**Rủi ro "người duy nhất biết"** (giới lập trình gọi là "bus factor": số người phải vắng mặt thì dự án đứng lại) là rủi ro tôi phải thừa nhận trước tiên. Hệ thống thử nghiệm của Văn phòng hiện chỉ có một người hiểu toàn bộ là tôi, giống một phòng chỉ có một người biết mã két sắt. Đã làm: bộ nhớ dự án trong kho mã, nhật ký thay đổi hơn 100 mục ghi rõ làm gì và vì sao, trang chẩn đoán cho người không chuyên xem tình trạng bot. Chưa làm được: tài khoản dịch vụ vẫn đứng tên cá nhân; nhiều bộ kiểm thử còn nằm trong thư mục nháp không lên kho mã; chưa có người thứ hai được đào tạo để vận hành toàn bộ hệ thống.

::: {.thuchanh}
**Thực hành: diễn tập "người làm vắng một tháng"**

1. Chọn một ứng dụng đang dùng thử trong cơ quan.
2. Giao một cán bộ khác, không phải người làm, đọc tài liệu rồi tự xử lý một tình huống giả định: thêm người dùng, khôi phục một bản ghi, đổi một khóa.
3. Người làm chỉ quan sát, không nhắc.
4. Ghi lại mọi chỗ bị tắc: thiếu tài liệu, thiếu quyền, thiếu thông tin bàn giao.
5. Mỗi chỗ tắc thành một dòng trong sổ rủi ro, có người và thời hạn khắc phục.
:::

## 17.7. Xây dựng con người và văn hóa

### 17.7.1. Tổ công tác và người dẫn dắt ở từng phòng, Ban

Công cụ thay đổi theo tháng; con người mới ở lại. Dự thảo Quy tắc 9 điều giao Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng chủ trì hướng dẫn, theo dõi, định kỳ báo cáo Chánh Văn phòng và Thường trực HĐND tỉnh. Tôi đề xuất thêm một "người dẫn dắt" ở mỗi phòng, mỗi Ban với bốn việc: gom bài toán của đơn vị, chia sẻ câu lệnh mẫu dùng tốt, hướng dẫn đồng nghiệp, báo sự cố về Tổ công tác. Người dẫn dắt nên là người hiểu nghiệp vụ, được đồng nghiệp tin, không nhất thiết trẻ nhất hay giỏi máy tính nhất.

### 17.7.2. Ba tầng năng lực

Chỉ thị 14/CT-TTg ngày 22/4/2026 đặt mục tiêu đến hết năm 2026, 100% cán bộ, công chức, viên chức có hiểu biết về chuyển đổi số, có kiến thức, kỹ năng số; coi tự học là nhiệm vụ thường xuyên; người lãnh đạo, quản lý phải gương mẫu. Quyết định 1528/QĐ-TTg ngày 11/8/2026 phê duyệt Chương trình quốc gia phát triển nhân lực trí tuệ nhân tạo với ba tầng đào tạo: phổ cập, ứng dụng, chuyên sâu. Áp vào Văn phòng, tôi hình dung như sau.

| Tầng | Ai | Học gì | Chương tham khảo |
|---|---|---|---|
| Phổ cập | Mọi cán bộ | An toàn dữ liệu, V-B-V-D-R, tra cứu có trích dẫn | Ch. 1, 3, 16, 18 |
| Ứng dụng | Người dẫn dắt mỗi phòng, Ban | Bậc 1–2: bảng tính, trang công cụ | Ch. 5, 6, 18 |
| Chuyên sâu | Vài người, cùng đơn vị chuyên trách | Bậc 3–4, bảo mật, vận hành | Phần II, III; Ch. 19, 20 |

Lãnh đạo gương mẫu ở đây rất cụ thể: tự mình dùng trợ lý AI cho một việc thật, tự đọc một phiếu mười câu hỏi, tự ký sổ cam kết như mọi cán bộ.

### 17.7.3. Văn hóa thử nghiệm có kỷ luật

Tôi tóm văn hóa ấy trong một câu: **thử nhỏ, có nhãn, có người duyệt, có sổ ghi**. Nhật ký thay đổi của hệ thống thử nghiệm ghi cả lỗi lẫn nguyên nhân gốc, kể cả lỗi của chính tôi. Chuỗi sự cố ngày 13/8/2026, khi tách kho dữ liệu làm bot mất hẳn phân hệ Kiểm điểm và gộp danh sách làm lộ lỗi trùng họ tên, đã thành quy tắc bắt buộc "rà soát chức năng liên quan". Cơ quan muốn đi xa phải coi báo lỗi là đóng góp, và ghi nhận cả người dám gỡ bớt: gỡ hai bản giao diện thừa giúp mọi thay đổi về sau chỉ phải làm một lần. Trung thực cũng là ranh giới chính trị: theo Quy định 207-QĐ/TW, đảng viên không được dùng AI để tạo lập, phát tán nội dung sai sự thật.

### 17.7.4. Bảo vệ người dám làm, trong khuôn khổ

Nghị quyết 57-NQ/TW có tinh thần chấp nhận rủi ro và cơ chế thử nghiệm có kiểm soát. Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 (hiệu lực 01/10/2025) có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro. Đảng và Nhà nước cũng có chủ trương khuyến khích, bảo vệ cán bộ năng động, sáng tạo vì lợi ích chung theo các quy định hiện hành.

Nhưng sự bảo vệ ấy gắn với việc thử nghiệm được tổ chức, phê duyệt và tuân thủ quy trình. Ứng dụng tự làm rồi tự đưa vào dùng ngoài khuôn khổ đó không mặc nhiên được miễn trách nhiệm. Sổ tay AI là ví dụ khuôn khổ đúng: đăng ký thành nhiệm vụ đột phá trong Đề án (Trục 3, Mục V.5(4)), có chỉ tiêu, mốc, quy tắc, báo cáo.

::: {.ghinho}
**Ghi nhớ**

Lãnh đạo bảo vệ người dám làm tốt nhất bằng một văn bản giao việc rõ phạm vi, ký **trước** khi thử nghiệm; không phải bằng lời động viên nói **sau** khi có sự cố.
:::

## 17.8. Ra quyết định: tự làm, đặt hàng hay dùng nền tảng có sẵn

Khi một bài toán đã chín, lãnh đạo phải chọn một trong ba con đường.

| Tiêu chí | Tự làm cùng AI | Đặt hàng | Nền tảng có sẵn |
|---|---|---|---|
| Có bản dùng thử | Nhanh (ngày, tuần) | Chậm (tháng) | Nhanh nếu đã có |
| Khớp nghiệp vụ đặc thù | Cao, sửa ngay | Theo đặc tả | Thấp hơn, theo nền tảng |
| Chi phí tiền | Thấp | Cao | Thấp đến trung bình |
| Công sức người | Dồn vào ít người | Ít | Ít |
| Pháp lý, an toàn | Người làm tự lo | Theo hợp đồng | Theo chủ quản nền tảng |
| Bền vững | Rủi ro người duy nhất biết | Có bảo hành | Có chủ quản |
| Dữ liệu vùng ĐỎ | Không | Theo cấp độ | Theo cấp độ |

Ma trận không tự quyết thay ai. Tôi đi qua năm câu hỏi theo thứ tự:

1. **Đã có nền tảng dùng chung làm việc này chưa?** Quyết định 1132/QĐ-TTg ngày 24/6/2026 ban hành Danh mục nền tảng số dùng chung quốc gia trong các cơ quan thuộc hệ thống chính trị. Với cơ quan dân cử, theo tin báo Đại biểu Nhân dân, từ tháng 5/2026 Văn phòng Quốc hội triển khai thí điểm cho địa phương ba nền tảng dùng chung: phòng họp không giấy, "Bình dân học vụ số – Quốc hội số" và hệ thống phần mềm Dân nguyện. Có rồi thì ưu tiên dùng và góp ý cải thiện.
2. **Dữ liệu có thuộc vùng ĐỎ không?** Có thì không tự làm trên đám mây công cộng; làm việc với đơn vị chuyên trách.
3. **Yêu cầu nghiệp vụ đã rõ chưa?** Chưa thì tự làm bản thử với dữ liệu mô phỏng để làm rõ. Bản đặc tả phần mềm của Văn phòng ra đời như vậy, kèm tệp Excel mô phỏng làm bộ ca kiểm thử: phần mềm đặt hàng sau này phải cho kết quả khớp tới hai chữ số thập phân.
4. **Có dùng lâu dài, nhiều đơn vị, cần cam kết vận hành không?** Có thì đặt hàng theo đặc tả hoặc chuyển sang nền tảng chung.
5. **Việc có quy tắc cố định không?** Có thì một chương trình nhỏ là đủ, không cần AI, như bản tin pháp luật hằng ngày.

Hệ thống của Văn phòng đã đi cả ba con đường. Sổ tay AI chọn **nền tảng có sẵn** (Gemini Notebook) làm lối hỏi chính vì có trích dẫn nguồn và cơ quan không phát sinh kinh phí; phần mềm tự làm chỉ giữ vai cổng vào, quản lý thí điểm, tra nhanh dự phòng. Lịch công tác tuần, Giám sát số, Một dữ liệu là hệ thống riêng, gắn vào Trang chủ bằng liên kết. Phân hệ Biểu quyết chỉ là bản demo: biểu quyết chính thức tại kỳ họp phải theo quy chế đã ban hành, không thể thay bằng ứng dụng cán bộ tự làm.

::: {.lenhmau}
**Câu lệnh mẫu 17.4 — So sánh ba phương án cho một bài toán**

```text
[VAI] Chuyên viên tham mưu, lập ma trận so sánh trung lập.
[BỐI CẢNH] Bài toán: [mô tả]. Người dùng: [số người, đơn vị].
Dữ liệu: [loại, vùng ĐỎ/VÀNG/XANH]. Nền tảng đã biết: [tên].
[VIỆC] So sánh tự làm cùng AI, đặt hàng theo đặc tả, dùng nền
tảng có sẵn theo 7 tiêu chí: thời gian có bản thử, khớp nghiệp
vụ, chi phí tiền, công sức người, pháp lý và an toàn, bền vững,
dữ liệu nhạy cảm. Trả lời 5 câu hỏi ở mục 17.8.
[DẠNG] Bảng 4 cột, 5 dòng trả lời, một đoạn kiến nghị.
[RÀNG BUỘC] Không bịa giá, không bịa tên nền tảng; chưa biết
ghi [cần khảo sát]. Kiến nghị nêu rõ điều kiện kèm theo.
[NGHIỆM THU] Mỗi ô có lý do ngắn; không ô nào để trống.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Trước mọi đề xuất tự làm, hỏi câu đầu tiên: nền tảng dùng chung đã có chưa.
- Coi bản tự làm là "phòng thí nghiệm" để làm rõ yêu cầu, không mặc nhiên là sản phẩm cuối.
- Dữ liệu vùng ĐỎ thì không tự làm trên đám mây công cộng, dù bản thử chạy tốt đến đâu.
- Khi nền tảng chính thức tốt hơn xuất hiện, sẵn sàng cho ứng dụng tự làm "về nhà chung".
:::

## Tóm tắt chương 17

::: {.tomtat}
1. Lãnh đạo không cần biết lập trình nhưng cần một "phiếu mười câu hỏi" viết ra, có người ký, có căn cứ đối chiếu.
2. Người đứng đầu chịu trách nhiệm hướng dẫn việc dùng AI; quy chế dựa trên Luật Trí tuệ nhân tạo, Khung đạo đức AI quốc gia, Công văn 557/BKHCN-CĐSQG, và phải có cơ chế thực thi đi kèm.
3. Dự thảo Quy tắc 9 điều của Văn phòng là điểm xuất phát, cần mở rộng cho soạn thảo, bot chat và ứng dụng tự làm.
4. Đi theo ba giai đoạn thí điểm, nhân rộng, chính thức hóa, mỗi giai đoạn có cửa kiểm soát; chọn bài toán đầu tiên theo sáu tiêu chí.
5. Đo trước – đo sau, tính cả thời gian kiểm chứng; phân biệt chỉ tiêu với kết quả; không biến mức dùng AI thành chỉ tiêu chấm điểm cán bộ.
6. "Miễn phí" vẫn có chi phí ẩn và vẫn cần chủ sở hữu là cơ quan; bốn nhóm rủi ro cần một sổ rủi ro có người theo dõi.
7. Bảo vệ người dám làm bằng văn bản giao việc ký trước; mọi quyết định tự làm, đặt hàng hay dùng nền tảng bắt đầu từ câu hỏi: nền tảng chung đã có chưa.
:::

## Câu hỏi suy ngẫm và bài tập

1. Điền phiếu mười câu hỏi (hoặc dùng Câu lệnh mẫu 17.1) cho một ứng dụng đang dùng trong đơn vị. Câu nào chưa trả lời được?
2. Đối chiếu dự thảo Quy tắc 9 điều ở Phụ lục 4 với khung ở mục 17.2.2. Đơn vị cần bổ sung phần nào trước, vì sao?
3. Chấm ba bài toán ứng viên của đơn vị theo sáu tiêu chí ở mục 17.3.2. Bài nào nên làm đầu tiên?
4. Thiết kế phép đo trước – đo sau cho bài toán vừa chọn: đo gì, ai ghi, ghi ở đâu, trong bao lâu.
5. Lập sổ rủi ro một trang cho ứng dụng ở câu 1, mỗi nhóm ít nhất một dòng có người theo dõi.
6. Đi qua năm câu hỏi ở mục 17.8 cho một ý tưởng của đơn vị. Đồng chí chọn tự làm, đặt hàng hay dùng nền tảng có sẵn?
