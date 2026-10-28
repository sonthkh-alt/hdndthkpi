# Chương 2. AI tạo ứng dụng: hiểu đúng để không sợ, không ảo tưởng

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu một ứng dụng web gồm những bộ phận nào qua hình ảnh quen thuộc của một trụ sở cơ quan, đủ để trao đổi với tác tử AI lập trình mà không bị "ngợp" thuật ngữ.
- Phân biệt trợ lý AI trò chuyện với tác tử AI lập trình; thấy được cả mặt được lẫn mặt trái của cách "lập trình bằng lời nói".
- Tự xác định bài toán của mình đang ở bậc nào trên thang 5 bậc kiến tạo và biết khi nào nên dừng ở một bậc.
- Nhận diện những việc AI làm tốt và những chỗ AI hay sai khi viết phần mềm, qua các sự cố có thật của hệ thống thử nghiệm của Văn phòng.
- Gỡ năm ngộ nhận phổ biến; nhận rõ vai trò mới của cán bộ: chủ đầu tư, tổng công trình sư, người nghiệm thu.

Dành cho: mọi người đọc. Người mới hoàn toàn nên đọc kỹ mục 2.1 và 2.3; lãnh đạo nên đọc kỹ mục 2.4, 2.5 và 2.6.
:::

Hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa đang chạy tại địa chỉ hdndthkpi.vercel.app. Nghe chuyện hệ thống ấy do một cán bộ không chuyên lập trình làm ra cùng trí tuệ nhân tạo (AI), người ta dễ rơi vào một trong hai cách nghĩ trái ngược nhau. Cách thứ nhất là ngại: phần mềm là việc của kỹ sư, mình động vào chỉ hỏng. Cách thứ hai là quá đà: cứ bảo AI làm một hệ thống quản lý cả cơ quan, mai là xong.

Cả hai cách nghĩ đều xuất phát từ một chỗ: chưa hình dung được việc "AI tạo ứng dụng" thực chất là gì. Người ngại thì tưởng phải hiểu hết từng dòng mã mới dám bắt đầu. Người hăng hái thì tưởng AI là chiếc đũa thần, không cần ai hiểu nghiệp vụ, không cần ai kiểm tra. Những tháng làm hệ thống năm 2026 cho tôi thấy cả hai đều chỉ đúng một nửa. Có lúc ba phân hệ cùng trắng trang vì một lỗi chỉ lộ ra vào ngày đầu tháng. Có lúc tác tử AI dựng xong cả một màn hình mới chỉ trong một phiên làm việc.

Chương này chưa dạy cài đặt hay gõ lệnh; việc đó dành cho Phần thứ hai. Chương này vẽ một tấm bản đồ: ứng dụng gồm những gì, tác tử AI lập trình làm được gì, con đường đi từ đâu đến đâu, và những chỗ trũng nào đã có người sa chân. Có bản đồ rồi, chúng ta sẽ không sợ, cũng không ảo tưởng.

## 2.1. Ứng dụng web là gì — nhìn qua hình ảnh trụ sở cơ quan

"Ứng dụng web" nghe xa lạ, nhưng ngày nào cán bộ cũng dùng: cổng dịch vụ công, hộp thư điện tử công vụ, trang tra cứu văn bản pháp luật. Điểm chung của chúng là mở bằng trình duyệt (Chrome, Edge, Cốc Cốc…), không phải cài gì lên máy. Để hiểu bên trong có gì, tôi mời đồng chí hình dung một trụ sở cơ quan quen thuộc.

### 2.1.1. Giao diện, máy chủ, cơ sở dữ liệu

Trụ sở nào cũng có ba khu vực. Phía trước là phòng tiếp dân: bàn ghế, biển chỉ dẫn, mẫu đơn để người đến điền. Phía sau là các phòng làm việc, nơi chuyên viên xử lý hồ sơ theo quy trình. Sâu hơn nữa là kho lưu trữ, nơi hồ sơ được đánh số, cất giữ, chỉ người có thẩm quyền mới được vào lấy.

Ứng dụng web cũng có đúng ba khu vực như vậy:

- **Giao diện (frontend)** là phòng tiếp dân. Đó là những gì hiện trên màn hình: nút bấm, ô nhập điểm, bảng kết quả, biểu đồ. Giao diện chạy ngay trên trình duyệt của người dùng, nên mọi thứ nằm ở đây đều có thể bị người dùng nhìn thấy nếu chịu khó soi.
- **Máy chủ (server)** là các phòng làm việc phía sau. Ở đó diễn ra những việc không nên làm trước mặt khách: gọi dịch vụ AI bằng khóa bí mật, đếm hạn mức sử dụng, nhận tin nhắn gửi đến từ Zalo hay Telegram.
- **Cơ sở dữ liệu (database)** là kho lưu trữ. Dữ liệu đã ghi vào đây thì tắt máy, đổi máy, sáng mai mở ra vẫn còn.

Trong hệ thống thử nghiệm của Văn phòng, giao diện được viết bằng React, một bộ công cụ dựng giao diện phổ biến. Máy chủ là các hàm nhỏ đặt trong thư mục `api/`, chạy trên dịch vụ Vercel. Cơ sở dữ liệu là Supabase. Điều ít người ngờ tới là toàn bộ dữ liệu chỉ nằm trong **một bảng** tên là `app_state`. Mỗi dòng của bảng là một "tập hồ sơ" ghi theo dạng JSON, tức một cách ghi dữ liệu có cấu trúc mà máy đọc được: một kỳ đánh giá OKR/KPI, một bộ phiên biểu quyết, bộ hồ sơ cán bộ, bộ đếm lượt truy cập. Cách tổ chức này đơn giản, hợp với bản demo, nhưng đòi hỏi đặt tên dòng thật rõ. Chính một cái tên dòng chỉ ghi tháng mà không ghi phân hệ đã gây ra sự cố hai phân hệ ghi đè lên nhau mà mục 2.4 sẽ kể.

### 2.1.2. API: cửa giao dịch một cửa

Phòng tiếp dân không tự chạy vào kho lấy hồ sơ. Muốn lấy, cán bộ tiếp nhận phải lập phiếu yêu cầu, chuyển qua cửa giao dịch. Ở đó có người kiểm tra phiếu có hợp lệ không, người yêu cầu có quyền không, rồi mới mang hồ sơ ra. Trong phần mềm, cửa giao dịch ấy gọi là **giao diện lập trình ứng dụng (API)**.

API là một "cửa" có quy định rõ: gửi yêu cầu theo mẫu nào, nhận lại kết quả ở dạng gì. Nhờ có cửa chuẩn, các bộ phận khác nhau làm việc được với nhau mà không cần biết bên trong nhau ra sao. Bot Telegram gửi câu hỏi tới dịch vụ AI qua cửa API của nhà cung cấp AI. Phân hệ Một dữ liệu – Không báo cáo lại là một hệ thống riêng nhưng có sẵn cửa dữ liệu mở, nên bot đọc được số liệu bên đó mà không cần gộp hai hệ thống.

### 2.1.3. Đăng nhập và phân quyền: thẻ ra vào chứ không phải tấm biển

Đăng nhập trả lời câu hỏi "anh là ai". Phân quyền trả lời câu hỏi "anh được làm gì". Một cơ quan có thể ngăn khách vào kho lưu trữ bằng hai cách: gỡ tấm biển "Phòng lưu trữ" để khách không biết đường, hoặc lắp khóa từ để ai có thẻ mới mở được. Cách thứ nhất chỉ là không chỉ đường; cửa vẫn mở.

Phần mềm cũng có hai lớp tương tự. Ẩn một nút, một tab trên giao diện là cách "gỡ biển". Quyền thật phải nằm ở cơ sở dữ liệu. Ở đó, mỗi yêu cầu đọc, ghi đều bị kiểm tra theo **chính sách bảo mật theo dòng (Row Level Security, viết tắt RLS)**, giống chiếc thẻ ra vào được quẹt ở từng cánh cửa.

Hệ thống của Văn phòng suýt mắc đúng lỗi "gỡ biển mà không khóa cửa". Khi dựng phân hệ Quản lý cán bộ, tác tử chỉ ra một nguy cơ: tab phân hệ chỉ hiện với Quản trị, nhưng chính sách chung ở cơ sở dữ liệu lại cho mọi tài khoản đã đăng nhập đọc mọi dòng. Nếu để nguyên, một người dùng thường gọi thẳng vào cửa API vẫn đọc được hồ sơ có ngày sinh, số định danh, quan hệ gia đình. Vì vậy tệp lược đồ cơ sở dữ liệu có thêm một bước riêng, phải chạy thì mới có hiệu lực: chỉ tài khoản Quản trị được đọc, ghi dòng hồ sơ cán bộ. Chương 19 sẽ trở lại chuyện phân quyền kỹ hơn.

### 2.1.4. Mã nguồn, kho mã nguồn, triển khai và tên miền

Muốn xây trụ sở phải có bộ bản vẽ thiết kế. Phần mềm cũng có "bản vẽ" của nó: **mã nguồn (source code)**, tức các tệp văn bản viết bằng ngôn ngữ lập trình, mô tả từng nút bấm, từng công thức, từng bước lưu dữ liệu. Đếm ngày 26/10/2026, hệ thống của Văn phòng có khoảng 21.400 dòng mã JavaScript, chưa kể lược đồ cơ sở dữ liệu và bộ sinh bản tin viết bằng Python.

Bản vẽ phải được cất giữ cẩn thận, ghi lại mỗi lần sửa: ai sửa, sửa gì, khi nào. Nơi cất giữ ấy gọi là **kho mã nguồn (repository)**, thường đặt trên GitHub. Tôi hay ví GitHub như sổ lưu trữ bản vẽ có đánh số từng lần điều chỉnh: lỡ sửa hỏng thì lật lại bản hôm qua. Mỗi lần ghi một thay đổi vào sổ gọi là một lần **ghi nhận thay đổi (commit)**.

Có bản vẽ chưa phải có trụ sở. Phải thi công, nghiệm thu rồi khánh thành, mở cửa đón khách. Bước đưa mã nguồn thành ứng dụng chạy thật trên mạng gọi là **triển khai (deploy)**. Với hệ thống của Văn phòng, mỗi lần thay đổi được đẩy lên nhánh chính của kho mã, dịch vụ Vercel tự lấy mã về và tự dựng **bản dựng (build)**. Khoảng một đến hai phút sau, phiên bản mới đã mở cửa. Cuối cùng, **tên miền (domain)** là biển số nhà: `hdndthkpi.vercel.app` là địa chỉ để mọi người tìm đến.

Bảng sau gom các khái niệm lại để đồng chí tiện tra cứu:

| Bộ phận | Hình ảnh trong trụ sở | Ở hệ thống của Văn phòng |
|---|---|---|
| Giao diện | Phòng tiếp dân | React, chạy trên trình duyệt |
| Máy chủ | Phòng làm việc phía sau | Các hàm trong thư mục `api/` |
| Cơ sở dữ liệu | Kho lưu trữ hồ sơ | Supabase, bảng `app_state` |
| API | Cửa giao dịch một cửa | Cửa của Supabase, của dịch vụ AI |
| Phân quyền | Thẻ ra vào từng cửa | Các bước trong tệp lược đồ |
| Mã nguồn | Bộ bản vẽ thiết kế | Khoảng 21.400 dòng JavaScript |
| Kho mã nguồn | Sổ lưu bản vẽ có lịch sử | GitHub |
| Triển khai | Khánh thành, mở cửa | Vercel tự dựng khi có mã mới |
| Tên miền | Biển số nhà | hdndthkpi.vercel.app |

::: {.vidu}
**Ví dụ minh họa — Một cú bấm đi qua những đâu?**

Hãy hình dung một chuyên viên đang tự đánh giá trong phân hệ Đánh giá OKR/KPI và chọn mức "Đạt chuẩn" cho chất lượng một nhiệm vụ. Giao diện tính lại điểm ngay trên trình duyệt. Khoảng 0,9 giây sau khi thôi thao tác, phần mềm tự lưu: gửi cả kỳ đánh giá qua cửa API tới Supabase, vào đúng dòng của tháng đó. Trước khi ghi, cơ sở dữ liệu "quẹt thẻ": người này đã đăng nhập chưa, có quyền ghi dòng này không. Phần mềm còn kiểm xem từ lúc mở ra đến giờ đã có ai khác lưu dòng này chưa; nếu có thì báo xung đột chứ không ghi đè mù. Tối hôm ấy, giả sử một lãnh đạo nhắn hỏi bot Telegram về tình hình chấm điểm. Bot chạy ở "phòng làm việc phía sau", đọc đúng dòng ấy kèm bảng điểm mà giao diện đã tính sẵn khi lưu, rồi mới nhờ AI diễn đạt thành câu trả lời. Một cú bấm đã đi qua đủ bốn bộ phận: giao diện, API, cơ sở dữ liệu, máy chủ.
:::

::: {.canhbao}
**Cảnh báo — Bản vẽ treo ngoài cổng**

Kho mã nguồn của hệ thống thử nghiệm để ở chế độ công khai, và mã giao diện tải về trình duyệt thì ai cũng đọc được. Vì vậy, bất cứ thứ gì nằm trong mã nguồn đều phải coi như đã dán lên bảng tin ngoài cổng cơ quan: không được có số điện thoại, hồ sơ cá nhân, mật khẩu thật hay khóa bí mật. Khóa bí mật chỉ được đặt ở "phòng làm việc phía sau" (biến môi trường của máy chủ), không bao giờ ở giao diện. Đây là điều đầu tiên đồng chí phải dặn tác tử AI trước khi giao bất kỳ việc gì có dính tới dữ liệu thật.
:::

## 2.2. Từ trợ lý trò chuyện đến tác tử AI lập trình

### 2.2.1. Trợ lý trò chuyện: người cố vấn ngồi bên kia bàn

Tập 1 đã hướng dẫn kỹ cách dùng trợ lý AI trò chuyện (chatbot) như ChatGPT, Claude, Gemini để soạn thảo, tóm tắt, rà soát văn bản. Có thể hình dung trợ lý trò chuyện như một người cố vấn giỏi ngồi bên kia bàn. Đồng chí đưa giấy tờ, cố vấn đọc rồi góp ý. Nhưng cố vấn không mở được tủ hồ sơ của đồng chí, không tự bật máy tính, không tự gửi công văn đi đâu.

Dùng trợ lý trò chuyện để viết phần mềm thì quy trình sẽ thế này: hỏi, nhận về một đoạn mã, tự chép vào tệp, tự chạy thử, thấy lỗi thì chép thông báo lỗi dán lại để hỏi tiếp. Cách đó dùng được cho một công thức Excel hay một trang nhỏ. Với một ứng dụng có vài chục tệp, người làm sẽ nhanh chóng lạc giữa các mẩu mã: không biết dán vào đâu, bản nào mới nhất, sửa chỗ này có làm hỏng chỗ kia không.

### 2.2.2. Tác tử AI lập trình: tổ chuyên viên kỹ thuật làm việc trong trụ sở

**Tác tử AI lập trình (AI coding agent)** khác ở chỗ nó được "vào trụ sở". Theo giới thiệu chính thức của Anthropic, Claude Code là công cụ lập trình dạng tác tử, chạy trong cửa sổ dòng lệnh và hiểu toàn bộ mã nguồn. Nó làm các việc lặp lại, giải thích mã và xử lý việc lưu vết trên kho mã theo câu lệnh bằng ngôn ngữ tự nhiên. Nói theo cách của cơ quan, đây là một tổ chuyên viên kỹ thuật làm theo giao việc của đồng chí. Tổ này:

- **Đọc cả kho mã** trước khi sửa, nên biết công thức tính điểm nằm ở tệp nào, bot đọc dữ liệu từ đâu.
- **Tự chạy lệnh** trên máy: cài thư viện, dựng bản dựng, khởi động ứng dụng để thử.
- **Tự kiểm thử (test)**: viết và chạy các phép kiểm tự động, mở trình duyệt không giao diện để bấm thử từng màn hình.
- **Sửa nhiều tệp trong một lần giao việc**, rồi ghi vào kho mã kèm lời giải thích.

Năm 2026, ngoài Claude Code còn nhiều tác tử cùng loại như OpenAI Codex, GitHub Copilot (bản có tác tử lập trình), Cursor; riêng Gemini CLI, theo tài liệu chính thức, đã được thay bằng Antigravity CLI đối với người dùng miễn phí từ ngày 18/6/2026. Ví dụ trong sách lấy từ Claude Code, công cụ tôi dùng cho toàn bộ dự án; cách giao việc và nghiệm thu thì dùng được cho mọi tác tử. Chương 5 sẽ hướng dẫn cài đặt và so sánh chi phí.

| Tiêu chí | Trợ lý trò chuyện | Tác tử AI lập trình |
|---|---|---|
| Nhìn thấy gì | Những gì được dán vào | Cả kho mã trên máy |
| Làm được gì | Góp ý, viết mẫu | Sửa tệp, chạy lệnh, kiểm thử |
| Rủi ro chính | Mã rời rạc, chép nhầm | Sửa lan rộng, làm quá phạm vi |
| Người dùng cần giỏi | Đặt câu hỏi | Giao việc và nghiệm thu |

Tuy vậy, tổ chuyên viên giỏi đến đâu cũng cần người giao việc rõ ràng và người nghiệm thu nghiêm túc. Tác tử không tự biết Hướng dẫn của Tỉnh ủy đòi biểu mẫu gì, không biết cơ quan mình có hai đồng chí trùng họ tên, không biết quy trình thật khác văn bản hướng dẫn ở chỗ nào. Nó chỉ biết những gì được nói, được đưa, và những gì đọc được trong kho mã.

::: {.cauchuyen}
**Câu chuyện thực tế — Hai tờ biểu mẫu giấy làm lộ bốn chỗ lệch**

Phân hệ Kiểm điểm, đánh giá, xếp loại đảng viên hằng quý ban đầu được dựng theo văn bản hướng dẫn của Tỉnh ủy. Cuối tháng 9/2026, tôi đưa cho tác tử hai biểu mẫu giấy đang dùng thật: bản tự đánh giá Quý III và kế hoạch cá nhân Quý IV của chính tôi, để trong một thư mục đã chặn khỏi kho mã công khai. Đối chiếu với màn hình đang có, bốn chỗ lệch lớn hiện ra. Quy trình thật có hai bước (lập kế hoạch đầu kỳ, tự đánh giá cuối kỳ ngay trên kế hoạch đó), phần mềm chỉ có một. Điểm tối đa từng trục không cố định mà do cá nhân đề xuất theo thứ tự ưu tiên, trong khi phần mềm đóng cứng sáu con số. Nhóm tiêu chí chung chấm bằng hai ô đánh dấu, phần mềm lại cho nhập điểm lẻ. Mỗi nhiệm vụ trên giấy có đủ năm cột, phần mềm chỉ có hai. Trong đợt sửa ghi ngày 28/9/2026, tiêu đề bản xuất Word cũng được vá: đây là văn bản của Đảng, không phải văn bản hành chính. Sau khi sửa, tác tử tự bấm xuất hai tệp Word thật rồi đọc lại từng bảng để đối chiếu. Phần thi công là của máy. Phần biết đưa đúng hai tờ giấy ấy, và chốt cách hiểu cuối cùng, là của người.
:::

### 2.2.3. "Lập trình bằng lời nói": mặt được và mặt trái

Cụm từ **lập trình bằng lời nói (vibe coding)** dùng để chỉ cách làm phần mềm chủ yếu bằng việc mô tả mong muốn bằng ngôn ngữ thường, để AI viết mã, người làm không đọc từng dòng. Hệ thống của Văn phòng được làm đúng theo cách ấy: tôi mô tả nghiệp vụ bằng tiếng Việt qua các **câu lệnh (prompt)**, tác tử viết mã. Vì thế tôi thấy rõ cả hai mặt của nó.

Mặt được:

- Người hiểu nghiệp vụ trực tiếp làm ra công cụ, không phải qua khâu "phiên dịch" yêu cầu cho người khác rồi chờ đợi.
- Thử nhanh, sửa nhanh: nhiều khi ý tưởng buổi sáng thì chiều đã có bản chạy thử để đồng nghiệp góp ý.
- Ở giai đoạn thử nghiệm, hạ tầng dùng mức miễn phí hoặc chi phí thấp, cơ quan chưa phải bỏ vốn lớn để biết ý tưởng có dùng được hay không.

Mặt trái:

- Người không đọc mã dễ "tin theo cảm giác": màn hình chạy là tưởng đúng, trong khi lỗi nằm ở chỗ chưa ai bấm tới.
- Mã sinh ra rất nhanh nên phần thừa, phần trùng cũng sinh rất nhanh. Hệ thống từng có ba bản giao diện song song cho cùng một nghiệp vụ; mỗi tính năng phải làm ba lần, cho tới khi tôi quyết định gỡ hẳn hai bản.
- Nếu người làm ra không ghi chép lại, sẽ không ai trong cơ quan hiểu được hệ thống, kể cả chính người làm sau vài tháng.

Vì vậy tôi không hiểu chữ "vibe" theo nghĩa tùy hứng. Lập trình bằng lời nói chỉ an toàn khi đi kèm ba thứ: lời giao việc rõ ràng, phép kiểm tự động viết bằng ngôn ngữ nghiệp vụ, và nhật ký ghi lại mọi quyết định. Ba thứ này lần lượt là nội dung của Chương 6 và Chương 7.

::: {.lenhmau}
**Câu lệnh mẫu 2.1 — Buổi làm quen với một kho mã**

```text
Tôi là [chức danh], không chuyên lập trình. Đây là dự án
[tên dự án] phục vụ việc [mô tả nghiệp vụ ngắn gọn].
Trước khi sửa bất cứ điều gì, hãy:
1. Đọc toàn bộ thư mục dự án (trừ thư mục [tên thư mục cần tránh]).
2. Giải thích bằng tiếng Việt, thuật ngữ nào cũng phải giải nghĩa:
   - Giao diện, máy chủ, cơ sở dữ liệu của dự án nằm ở đâu.
   - Dữ liệu được lưu vào đâu; ai được đọc, ai được ghi.
   - Trong mã có khóa bí mật, mật khẩu, số điện thoại
     hay dữ liệu cá nhân nào không.
3. Liệt kê 5 rủi ro lớn nhất nhìn thấy được, xếp theo mức độ.
Chỉ đọc và báo cáo. KHÔNG sửa tệp, KHÔNG chạy lệnh cài đặt.
```
:::

Giống như hỏi nhà thầu mô tả lại công trình trước khi cho vào thi công, câu lệnh này giúp kiểm tra tác tử có hiểu đúng dự án không trước khi cho sửa gì.

::: {.canhbao}
**Cảnh báo — Tổ chuyên viên làm việc ngay trên máy của đồng chí**

Tác tử AI lập trình đọc được mọi tệp trong thư mục nó được mở và chạy được lệnh trên máy. Đừng mở tác tử ở thư mục gốc ổ đĩa, ở thư mục "Tài liệu" chứa văn bản nội bộ hay hồ sơ cá nhân. Mỗi dự án một thư mục riêng, chỉ chứa những gì dự án cần. Nội dung tác tử đọc được sẽ được gửi lên máy chủ của nhà cung cấp AI để xử lý, nên quy tắc phân vùng dữ liệu ĐỎ/VÀNG/XANH của Tập 1 áp dụng nguyên vẹn: tài liệu mật tuyệt đối không đặt vào thư mục dự án.
:::

## 2.3. Thang 5 bậc kiến tạo

Không phải bài toán nào cũng cần "một hệ thống". Rất nhiều việc trong Văn phòng chỉ cần một công thức tốt trong bảng tính. Qua thực tế, tôi chia việc "cùng AI làm ra công cụ" thành năm bậc. Bậc càng cao, công cụ càng mạnh, nhưng rủi ro, chi phí và trách nhiệm cũng càng lớn. Mục tiêu không phải leo lên bậc cao nhất, mà là đứng đúng bậc của bài toán.

| Bậc | Sản phẩm điển hình | Dữ liệu nằm ở đâu | Rủi ro chính |
|---|---|---|---|
| 0 | Trò chuyện với AI | Trong cuộc trò chuyện | Lộ dữ liệu, tin AI quá mức |
| 1 | Công thức, macro, Apps Script | Trong tệp bảng tính | Công thức sai mà không báo |
| 2 | Trang công cụ một tệp | Trên trình duyệt từng máy | Dữ liệu không dùng chung được |
| 3 | Ứng dụng có đăng nhập | Cơ sở dữ liệu trên mạng | Phân quyền, dữ liệu cá nhân |
| 4 | Hệ thống nhiều phân hệ | Nhiều dịch vụ nối nhau | Lỗi dây chuyền, chi phí, pháp lý |

### 2.3.1. Bậc 0 — Dùng AI trò chuyện

Đây là bậc của Tập 1: soạn thảo, tóm tắt, rà soát bằng khung lệnh V-B-V-D-R, phân loại dữ liệu trước khi đưa lên AI. Bậc 0 chưa tạo ra công cụ, nhưng là nền móng của mọi bậc sau. Người chưa quen giao việc cho trợ lý trò chuyện thì rất khó giao việc cho tác tử, vì giao việc cho tác tử đòi hỏi rõ ràng hơn nhiều. Nên dừng ở Bậc 0 khi việc chỉ làm một lần và sản phẩm là văn bản để người đọc, người sửa tiếp.

### 2.3.2. Bậc 1 — Tự động hóa văn phòng

Bậc 1 là nhờ AI viết những thứ nhỏ chạy bên trong công cụ văn phòng sẵn có: công thức Excel lồng nhiều điều kiện, macro tự định dạng biểu mẫu, đoạn Apps Script trên Google Trang tính tự gom phản hồi. Người dùng vẫn làm việc trên bảng tính quen thuộc, chỉ là bảng tính ấy "biết làm" nhiều hơn.

Hệ thống của Văn phòng thực ra khởi đầu từ bậc này. Trước khi có phần mềm, cách tính điểm theo Nghị định 335/2025/NĐ-CP và quy định của Tỉnh ủy đã được mô phỏng trong một tệp Excel gọi là "Engine tính điểm". Về sau, Đặc tả yêu cầu phần mềm ghi tệp ấy là bộ ca kiểm thử bắt buộc: cùng đầu vào, phần mềm phải cho kết quả khớp Excel tới hai chữ số thập phân. Bậc 1 không bị bỏ đi khi lên bậc cao hơn; nó trở thành thước đo để nghiệm thu bậc cao hơn.

Rủi ro của Bậc 1 nằm ở chỗ công thức sai vẫn ra một con số trông hợp lý, không ai báo lỗi. Thêm nữa, nhiều người gửi nguyên bảng tính có họ tên, ngày sinh lên AI chỉ để "nhờ viết công thức", trong khi AI chỉ cần vài dòng dữ liệu giả cùng cấu trúc. Nên dừng ở Bậc 1 khi chỉ một người dùng và dữ liệu gọn trong một tệp.

::: {.lenhmau}
**Câu lệnh mẫu 2.2 — Viết công thức kèm ca kiểm thử**

```text
Vai: chuyên gia Excel, viết cho người không chuyên.
Bối cảnh: bảng theo dõi nhiệm vụ của phòng. Cột B là số lượng
được giao, C là số lượng hoàn thành, D là chất lượng ("Đạt chuẩn",
"Có sai sót nhỏ", "Chưa đạt"), E là tiến độ ("Đúng hạn",
"Chậm ít", "Trễ hạn"). Năm dòng mẫu dưới đây là dữ liệu giả:
[dán 5 dòng mẫu, không có họ tên thật]
Việc: công thức cột F = trung bình cộng ba tỷ lệ: số lượng
(C/B, tối đa 100%); chất lượng (100% / 75% / 50%);
tiến độ (100% / 80% / 50%).
Dạng: công thức cho ô F2 để kéo xuống, giải thích từng phần.
Ràng buộc: B bằng 0 hoặc để trống thì F để trống, không báo lỗi.
Cuối cùng lập 4 ca kiểm thử (đầu vào và kết quả đúng) để tôi gõ
thử; phải có ca giao 10, hoàn thành 10, Đạt chuẩn, Chậm ít
cho kết quả 93,3%.
```
:::

Ca kiểm thử cuối cùng lấy đúng ví dụ chuẩn trong dự thảo hướng dẫn lập danh mục sản phẩm, công việc: (100 + 100 + 80) / 3 = 93,3%. Thói quen đòi AI tự lập ca kiểm thử có đáp án biết trước, rồi tự tay gõ thử, nên có ngay từ Bậc 1.

### 2.3.3. Bậc 2 — Trang công cụ một tệp chạy trong trình duyệt

Bậc 2 là một trang web nhỏ gói gọn trong một tệp, mở bằng trình duyệt là chạy, không cần máy chủ, không cần cơ sở dữ liệu. Ví dụ: một trang tra cứu danh mục văn bản của Ban, gõ từ khóa là lọc ra; một trang tính thử điểm theo bộ tiêu chí; một trang đếm ngược tới các mốc thời hạn. Chương 5 sẽ hướng dẫn làm trang tra cứu đầu tiên và đưa lên mạng.

Điều cần hiểu ở Bậc 2: dữ liệu người dùng nhập chỉ nằm trong bộ nhớ trình duyệt của chính máy đó. Đổi máy hay xóa lịch sử duyệt web là mất; đồng nghiệp phòng bên không thấy. Hệ thống của Văn phòng từng vấp đúng chỗ này ở phân hệ Biểu quyết Online: trước khi có cơ chế ghi lên máy chủ, lá phiếu chỉ nằm trên máy đang bấm, mỗi máy một kết quả. Với trang tra cứu thì không sao; với biểu quyết thì không chấp nhận được. Đó là dấu hiệu bài toán phải lên Bậc 3. Nên dừng ở Bậc 2 khi dữ liệu là văn bản công khai, mỗi người dùng độc lập, không cần một kết quả chung.

### 2.3.4. Bậc 3 — Ứng dụng web có cơ sở dữ liệu và đăng nhập

Bậc 3 là lúc ứng dụng có đủ ba khu vực của "trụ sở": giao diện, máy chủ, kho lưu trữ dùng chung, cùng tài khoản đăng nhập và phân quyền. Phân hệ Đánh giá OKR/KPI ở giai đoạn đầu là ví dụ điển hình: cán bộ đăng nhập bằng email, chấm điểm, dữ liệu lưu theo từng kỳ, cấp có thẩm quyền phê duyệt rồi xuất phiếu Word.

Đây là bậc thay đổi về chất. Ở Bậc 2, sai thì một người chịu. Ở Bậc 3, nhiều người cùng đọc, cùng ghi một kho, nên xuất hiện những loại lỗi bảng tính không bao giờ có: người này ghi đè lên người kia; khách nhìn thấy một danh sách, Quản trị thấy danh sách khác; vừa đăng nhập xong thì bản đang hiển thị trên màn hình bị tự lưu đè lên dữ liệu chính thức. Hệ thống của Văn phòng đã gặp đủ cả ba chuyện ấy (Chương 9 kể chi tiết).

Bậc 3 cũng là lúc trách nhiệm pháp lý rõ hơn, vì ứng dụng lưu họ tên, chức vụ, kết quả đánh giá của người khác, tức là đang xử lý dữ liệu cá nhân. Và lần đầu xuất hiện những "điều kiện ẩn" của gói miễn phí: chẳng hạn, theo tài liệu chính thức của Supabase, dự án dùng gói miễn phí bị tạm dừng sau một tuần không hoạt động. Nên dừng ở Bậc 3 khi ứng dụng phục vụ một nghiệp vụ, một nhóm người dùng xác định, chưa cần AI chạy bên trong.

### 2.3.5. Bậc 4 — Hệ thống nhiều phân hệ, có AI bên trong, bot chat, tích hợp

Bậc 4 là chỗ hệ thống của Văn phòng đang đứng: Trang chủ dạng cổng với 12 thẻ phân hệ (ba trong số đó là hệ thống riêng được gắn bằng liên kết); bản tin pháp luật tự sinh mỗi sáng; các phân hệ có AI bên trong như Trợ lý AI nghiệp vụ dân cử, Sổ tay AI, khung chat Người hướng dẫn; bot trả lời qua Telegram và Zalo đọc số liệu thật của nhiều phân hệ. Đi kèm là hàng trăm phép kiểm tự động: riêng bot có 199 phép, phần khung tiêu chí HĐND có 293 phép kiểm logic.

Ở bậc này, thứ khó nhất không còn là viết mã, mà là giữ cho các phần ăn khớp với nhau. Sửa một chỗ có thể làm hỏng một chỗ ở rất xa. Mỗi lượt gọi AI tốn tiền nên phải có hạn mức, đếm ở máy chủ. Mỗi nền tảng bên ngoài có luật riêng: Zalo không cho lập bot trên tài khoản cá nhân mà phải dùng tài khoản chính thức (Official Account) của cơ quan, mã xác thực hết hạn phải tự làm mới. Khi đưa một ứng dụng có AI cho người khác dùng, cơ quan còn có thể trở thành "bên triển khai" hệ thống AI theo Luật Trí tuệ nhân tạo. Những nghĩa vụ đi kèm sẽ được phân tích ở Chương 3.

Bậc 4 không phải đích đến bắt buộc. Tôi lên đây vì bài toán kéo đi: có phân hệ chấm điểm thì cần danh sách cán bộ một mối; có số liệu thì lãnh đạo muốn hỏi nhanh trên điện thoại; có bot thì phải kiểm soát chi phí. Nếu đơn vị chưa có người theo được nhịp ấy, một phân hệ Bậc 3 làm tốt có giá trị hơn một hệ thống lớn không ai bảo trì.

### 2.3.6. Chọn đúng bậc trước khi bắt tay

Về thời gian, theo ước lượng chủ quan của tôi (không phải số liệu đo đạc, nhanh chậm tùy người): Bậc 0 và Bậc 1 làm quen trong vài buổi; Bậc 2 trong một, hai tuần; Bậc 3 mất vài tuần đến vài tháng; còn Bậc 4 là việc nhiều tháng và không bao giờ thật sự xong. Trước khi bắt tay, đồng chí hãy tự định vị theo năm bước dưới đây.

::: {.thuchanh}
**Thực hành — Định vị bài toán của đồng chí**

1. Viết ra một việc lặp đi lặp lại trong tháng mà đồng chí muốn có công cụ hỗ trợ.
2. Trả lời: có bao nhiêu người cùng dùng, và họ có cần nhìn thấy cùng một dữ liệu không? Một người thì nghĩ tới Bậc 1–2; nhiều người cùng một kho thì từ Bậc 3.
3. Xếp dữ liệu vào vùng ĐỎ, VÀNG hay XANH. Vùng ĐỎ không đưa lên dịch vụ đám mây công cộng ở bất kỳ bậc nào.
4. Hỏi: việc này có quy tắc cố định không? Có thì một chương trình nhỏ, không gọi AI, thường rẻ và ổn định hơn. Bản tin pháp luật của Văn phòng lấy tin từ nguồn chính thống, vẽ ảnh theo mẫu, không khóa API, không gọi AI; AI chỉ giúp viết ra chương trình ấy.
5. Hỏi: nếu mình đi công tác dài ngày, ai bảo trì? Nếu câu trả lời là "không ai", hãy hạ xuống một bậc.
:::

## 2.4. AI làm tốt gì, làm dở gì khi viết phần mềm

### 2.4.1. Những việc AI làm tốt

Theo trải nghiệm của tôi, tác tử AI lập trình làm tốt rõ rệt ở mấy việc sau:

- **Dựng khung nhanh**: màn hình nhập liệu, bảng, biểu đồ, chức năng xuất Word, Excel. Bản đầu tiên của một màn hình thường có ngay trong phiên làm việc.
- **Đọc tài liệu khó**: tệp Word, PDF; với PDF bản chụp (scan) không có lớp chữ thì chuyển từng trang thành ảnh để đọc; tệp `.doc` đời cũ thì chuyển sang `.docx` rồi trích cấu trúc.
- **Biến câu chữ thành phép tính, nhờ đó soi ra mâu thuẫn.** Khi số hóa dự thảo Khung tiêu chí đánh giá HĐND nhiệm kỳ 2026–2031, việc bắt câu chữ phải "cộng ra số" đã làm lộ 6 điểm chưa nhất quán. Chẳng hạn, một nhóm điểm thưởng có 4 nội dung cộng lại 13 điểm trong khi trần chỉ 10 điểm.
- **Viết và chạy kiểm thử hàng loạt**, kể cả kiểm trên bản dựng thật bằng trình duyệt tự động và đo bằng con số. Ảnh xem trước khi chia sẻ liên kết của hệ thống từng bị tràn khung: đo ra một dòng chữ kết thúc ở 1.214 điểm ảnh trong khung rộng 1.200; mắt thường khó thấy, máy đo thì thấy ngay.
- **Giải thích mã bằng lời** và đặt tên hàm bằng tiếng Việt (`ngayVN`, `catDoan`, `chuanHoaNLM`) để người không chuyên đọc tên là đoán được việc.

### 2.4.2. Những chỗ AI hay sai

Bảng dưới đây tóm lược năm loại sai sót đã thật sự xảy ra trong dự án và cách phòng đã áp dụng.

| Điểm yếu | Sự cố có thật | Cách phòng |
|---|---|---|
| Hiểu sai nghiệp vụ | Việc làm được 9/10 bị coi là không hoàn thành | Bắt AI liệt kê các cách hiểu để người chọn |
| Tự tin với thông tin cũ | Trí nhớ về tên miền NotebookLM đã lỗi thời | Bắt kiểm tra thực tế, không tin trí nhớ |
| Lỗi dây chuyền | Ngày 13/8/2026 bot mất hẳn phân hệ Kiểm điểm | Quy tắc rà soát chức năng liên quan |
| Quên đặc thù tiếng Việt | "Họp báo" bị nhận là tin "bão" | Giữ dấu, khớp theo từ, có phép kiểm |
| Xếp bảo mật sau tiện lợi | Hồ sơ cán bộ chỉ được "giấu" ở giao diện | Quyền thật đặt ở cơ sở dữ liệu |

**Hiểu sai nghiệp vụ.** Khi tự động áp điều kiện xếp loại, AI hiểu "không hoàn thành nhiệm vụ" là "chưa đạt đủ 100%", nên cán bộ điểm cao bị ép xuống mức thấp nhất chỉ vì những việc làm được 9/10. Cách tính được sửa lại: xét theo từng nhiệm vụ, dưới 50% mới là không hoàn thành; những chỗ còn hiểu được nhiều cách thì hỏi lại tôi rồi mới chốt. Điểm tối đa sáu trục ở phân hệ Kiểm điểm bị đóng cứng cũng thuộc loại này.

**Tự tin với thông tin cũ.** Ngày 22/10/2026, khi kiểm tra đường dẫn tôi đưa, tác tử phát hiện Google đã chuyển NotebookLM (nay đổi tên là Gemini Notebook) sang tên miền `notebook.google.com`; giả định trong trí nhớ của AI đã lỗi thời. Một ví dụ khác: khối bản tin trên Trang chủ từng được coi là "chạy hằng ngày" nhờ một tác vụ trên đám mây, nhưng quét cả 18 kho mã của tài khoản không thấy ảnh bản tin nào; bước đẩy ảnh chưa từng chạy được. AI trả lời trơn tru không có nghĩa là đúng.

**Lỗi dây chuyền.** Lúc đầu, phân hệ OKR/KPI (chấm theo tháng) và phân hệ Kiểm điểm (chấm theo quý) lưu chung vào một dòng chỉ mang tên tháng, nên phân hệ nào mở sau thì tự lưu đè lên danh sách của phân hệ kia. Ngày 13/8/2026, kho dữ liệu được tách riêng theo phân hệ. Việc tách là đúng, nhưng bot chat dò tên dòng dữ liệu bằng một quy tắc riêng, nên mất hẳn phân hệ Kiểm điểm. Cùng ngày, việc gộp danh sách cán bộ về một mối làm lộ lỗi trùng họ tên: hai đồng chí cùng họ tên ở hai đơn vị bị ghép làm một, danh sách còn 27 thay vì 28 người. Từ đó bộ nhớ dự án có quy tắc bắt buộc: sửa xong một chỗ phải tự hỏi "chỗ nào khác đang đọc, ghi thứ vừa đổi?" và kiểm chứng thật.

**Quên đặc thù tiếng Việt.** Bộ sinh bản tin từng gán tin "Phòng thủ dân sự quốc gia" vào chủ đề Tài chính, vì "quốc gia" chứa chuỗi "gia", bỏ dấu thì trùng "giá"; "họp báo thường kỳ" bị nhận là tin bão vì bỏ dấu thì "báo" và "bão" như nhau. Khi suy mẫu kế hoạch theo chức vụ, chuỗi "trưởng ban" nằm trong "phó trưởng ban", xét sai thứ tự thì Phó Trưởng Ban nhận mẫu của Trưởng Ban. Những thói quen lập trình sinh ra cho tiếng Anh không tự đúng với tiếng Việt.

**Xếp bảo mật sau tiện lợi.** Ngoài chuyện hồ sơ cán bộ chỉ được giấu ở giao diện (mục 2.1.3), tài khoản trình diễn được viết sẵn trong mã giao diện cho tiện, nên ai đọc mã cũng biết mật khẩu. Rủi ro này chỉ tạm chấp nhận vì đây là bản demo, dữ liệu máy chủ vẫn được phân quyền, và việc xóa tài khoản ấy phải làm trước khi dùng thật.

Có một loại lỗi nữa đáng nhớ riêng: **lỗi theo lịch**. Từ ngày 01/9/2026, ba phân hệ OKR/KPI, Kiểm điểm và Quản lý cán bộ cùng trắng trang, vì một dòng mã mặc định "lấy người đứng đầu danh sách", mà kỳ mới thì danh sách còn trống. Lúc thử không ai thấy lỗi, vì khi đó danh sách luôn có người. Bản vá được ghi nhận ngày 28/9/2026.

::: {.lenhmau}
**Câu lệnh mẫu 2.3 — Rà soát trước khi báo "đã xong"**

```text
Trước khi báo "đã xong", hãy tự rà soát và trả lời từng câu:
1. Những chỗ nào khác đang đọc hoặc ghi dữ liệu vừa đổi
   (bot chat, hàm xuất Word/Excel, trang hướng dẫn)?
   Đã kiểm từng chỗ chưa, kiểm bằng cách nào?
2. Danh sách trống thì sao? Ngày đầu tháng, đầu quý,
   đầu năm thì sao?
3. Hai người trùng họ tên thì sao? Cùng một yêu cầu gửi
   đến hai lần thì sao?
4. Có chỗ nào so khớp chữ tiếng Việt sau khi bỏ dấu,
   hoặc khớp chuỗi con không?
5. Khách (chưa đăng nhập) và Quản trị lần lượt thấy gì,
   làm được gì?
6. Có khóa bí mật, số điện thoại, dữ liệu cá nhân nào
   lọt vào mã nguồn không?
Chạy bản dựng và các phép kiểm liên quan, báo kết quả bằng
con số. Câu nào chưa kiểm được thì ghi "CHƯA KIỂM", không đoán.
```
:::

## 2.5. Những ngộ nhận thường gặp

**Ngộ nhận thứ nhất: "Không cần học gì, cứ nói là AI làm."** Đúng là không cần học viết mã. Nhưng cần học đủ những khái niệm ở mục 2.1 để hiểu AI đang nói gì; cần học đọc một phương án như đọc tờ trình; và trên hết cần hiểu nghiệp vụ thật kỹ. Nếu không ai nói rõ thế nào là "không hoàn thành nhiệm vụ", AI sẽ tự chọn một cách hiểu, và có thể chọn sai như ví dụ ở mục 2.4.

**Ngộ nhận thứ hai: "AI làm hết."** AI làm phần thi công, không làm phần quyết định. Nhật ký phát triển của hệ thống đầy những dòng "người dùng chốt": giữ nguyên công thức của nghị định và chỉ thêm cảnh báo khi điểm số với xếp loại chênh nhau; để ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ chấm điểm; chuyển Sổ tay AI sang chạy trên NotebookLM để cơ quan không phát sinh kinh phí. AI cũng không tự biết dừng: nó sẵn lòng làm thêm bản giao diện thứ ba, còn quyết định gỡ bớt là của người chủ dự án.

**Ngộ nhận thứ ba: "Miễn phí mãi mãi."** Theo trang giá chính thức, gói miễn phí của Claude không có Claude Code; gói thấp nhất có công cụ này là Pro, 20 USD mỗi tháng (giá tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). Các gói miễn phí của hạ tầng có điều kiện riêng: cơ sở dữ liệu tạm dừng khi lâu không dùng, máy chủ "ngủ" khiến lần mở đầu của phân hệ Một dữ liệu chậm 30 đến 60 giây. Mỗi lượt gọi AI bên trong ứng dụng đều tốn tiền, nên hệ thống phải đặt hạn mức: khách 1 lượt, người đăng nhập 5 lượt mỗi ngày ở Trợ lý AI. Và còn một khoản không ghi trên hóa đơn: thời gian của chính người làm.

**Ngộ nhận thứ tư: "Làm xong là xong."** Phần mềm giống trụ sở: khánh thành xong vẫn phải bảo trì. Lỗi sập đầu tháng chỉ lộ ra khi sang kỳ mới. Zalo không cấp mã xác thực vĩnh viễn, mỗi lần làm mới lại cấp một mã khác phải lưu lại. Google đổi tên sản phẩm và tên miền. Kiến thức nạp sẵn cho bot từng ghi "không đọc được lịch công tác" khi bot đã đọc được. Nhật ký thay đổi của dự án đã vượt 100 mục, khoảng 24.000 từ; không ít mục trong đó là sửa lỗi, cập nhật như thế.

**Ngộ nhận thứ năm: "Phần mềm tự làm thì không phải chịu trách nhiệm."** Ngược lại. Ai đưa công cụ cho người khác dùng thì chịu trách nhiệm về công cụ ấy, và dùng AI không làm trách nhiệm đó nhẹ đi. Nhãn "Bản demo thử nghiệm, sử dụng nội bộ" trên hệ thống là lời nói thật về độ tin cậy, không phải tấm bùa miễn trách. Tập 1 đã nói: trình ký văn bản lỗi do AI là lỗi của cán bộ. Với phần mềm cũng vậy.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15, được Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026 (trừ nội dung liên quan đến Điều 35). Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Điều 3 phân biệt nhà phát triển, nhà cung cấp, bên triển khai và người sử dụng hệ thống AI; cán bộ tự làm ứng dụng có gọi AI rồi đưa cho đồng nghiệp dùng cần tự xác định mình đang ở vai nào.
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, có hiệu lực từ 01/01/2026, phân dữ liệu cá nhân thành dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm. Ứng dụng lưu họ tên, kết quả đánh giá, số điện thoại của cán bộ là đang xử lý dữ liệu cá nhân.
- Chương 3 phân tích đầy đủ các văn bản này. Trước khi áp dụng, nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn).
:::

## 2.6. Vai trò mới của cán bộ: chủ đầu tư – tổng công trình sư – người nghiệm thu

Một công trình xây dựng có chủ đầu tư, người thiết kế, nhà thầu thi công và người nghiệm thu. Khi làm phần mềm cùng AI, tác tử là nhà thầu thi công làm rất nhanh. Ba vai còn lại thuộc về cán bộ.

**Chủ đầu tư** quyết định làm gì, vì sao, đến đâu: chọn bài toán, chọn bậc, khoanh phạm vi, quyết dữ liệu nào được dùng, đặt trần chi phí, và quyết khi nào gỡ bớt. Quyết định gỡ hai bản giao diện thừa là một ví dụ của vai này.

**Tổng công trình sư** giữ bản thiết kế nghiệp vụ: đưa văn bản gốc và biểu mẫu thật cho tác tử, chia việc lớn thành việc nhỏ, giữ bộ nhớ dự án và quy ước làm việc. Khi một điều khoản hiểu được nhiều cách, tổng công trình sư yêu cầu AI liệt kê các cách hiểu kèm hệ quả, chọn một cách, rồi ghi lựa chọn vào nhật ký. Đó chính là nguyên tắc máy đề xuất – người quyết định áp dụng ngay trong quá trình làm phần mềm.

**Người nghiệm thu** không tin báo cáo "đã xong" mà kiểm sản phẩm ở nơi người dùng nhìn thấy: thử bằng vai khách và vai Quản trị; lưu xong tải lại trang xem dữ liệu còn không; đếm lại tổng số sau mỗi lần gộp (27 khác 28 là tín hiệu báo động); đọc danh sách phép kiểm viết bằng tiếng Việt như đọc tiêu chí nghiệm thu.

| Vai | Câu hỏi thường trực | Sản phẩm để lại |
|---|---|---|
| Chủ đầu tư | Có đáng làm không, đến bậc nào? | Phạm vi, trần chi phí |
| Tổng công trình sư | Nghiệp vụ đúng chưa, ai chốt? | Bộ nhớ dự án, nhật ký |
| Người nghiệm thu | Đã kiểm thật chưa, bằng gì? | Bảng kiểm, phép kiểm |

::: {.lenhmau}
**Câu lệnh mẫu 2.4 — Trình phương án như một tờ trình**

```text
Tôi muốn [mô tả việc cần làm]. Chưa viết mã vội.
Hãy trình phương án như tờ trình gửi lãnh đạo, gồm:
1. Nhắc lại yêu cầu bằng lời của mình.
2. Chỗ nào hiểu được theo nhiều cách: nêu từng cách và hệ quả.
3. Tệp nào sẽ sửa; dữ liệu đã lưu có bị ảnh hưởng không.
4. Các phép kiểm sẽ viết, diễn đạt bằng tiếng Việt.
5. Rủi ro về bảo mật, dữ liệu cá nhân, chi phí.
Chờ tôi duyệt rồi mới làm.
```
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Khi cán bộ trình một ứng dụng tự làm, hãy hỏi: bài toán ở bậc mấy, vì sao không làm ở bậc thấp hơn.
- Người làm ra không nên tự nghiệm thu một mình; cần một người hiểu nghiệp vụ thử độc lập.
- Hỏi dữ liệu thuộc vùng nào, đã có nhãn "bản demo" chưa, chi phí có trần chưa, tài khoản dịch vụ đứng tên ai.
- Hỏi: nếu người làm vắng mặt, ai đọc được nhật ký và tiếp nhận?
- Khuyến khích thử nghiệm, nhưng thử có kiểm soát: tinh thần chấp nhận rủi ro trong Nghị quyết 57-NQ/TW của Bộ Chính trị đi cùng cơ chế thử nghiệm có kiểm soát, không phải làm tùy ý.
:::

## Tóm tắt chương 2

::: {.tomtat}
1. Ứng dụng web giống một trụ sở: giao diện là phòng tiếp dân, máy chủ là phòng làm việc phía sau, cơ sở dữ liệu là kho lưu trữ, API là cửa giao dịch, phân quyền là thẻ ra vào.
2. Trợ lý trò chuyện chỉ góp ý; tác tử AI lập trình đọc cả kho mã, chạy lệnh, kiểm thử, sửa nhiều tệp, nhưng vẫn cần người giao việc và nghiệm thu.
3. Lập trình bằng lời nói chỉ an toàn khi có lời giao việc rõ, phép kiểm tự động và nhật ký quyết định.
4. Thang 5 bậc giúp chọn đúng tầm: đứng đúng bậc của bài toán quan trọng hơn leo cao.
5. AI dựng nhanh, đọc giỏi, kiểm thử chăm; nhưng hay hiểu sai nghiệp vụ, tin thông tin cũ, gây lỗi dây chuyền, quên đặc thù tiếng Việt, xếp bảo mật sau tiện lợi.
6. Phần mềm không miễn phí mãi, không làm xong là xong, và người đưa công cụ cho người khác dùng phải chịu trách nhiệm.
7. Cán bộ giữ ba vai: chủ đầu tư, tổng công trình sư, người nghiệm thu.
:::

## Câu hỏi suy ngẫm và bài tập

1. Hãy mô tả một phần mềm đồng chí đang dùng hằng ngày theo hình ảnh trụ sở: đâu là phòng tiếp dân, đâu là kho lưu trữ, ai có thẻ vào kho?
2. Vì sao ẩn một tab trên giao diện không phải là bảo mật? Lấy một ví dụ trong cơ quan để giải thích cho đồng nghiệp.
3. Chọn một việc lặp lại của phòng mình, xác định bậc phù hợp theo năm bước thực hành ở mục 2.3.6 và giải thích vì sao không chọn bậc cao hơn.
4. Dùng Câu lệnh mẫu 2.2 với dữ liệu giả, tự gõ thử bốn ca kiểm thử AI đưa ra. Có ca nào sai không?
5. Trong năm ngộ nhận ở mục 2.5, ngộ nhận nào phổ biến nhất ở cơ quan đồng chí? Nên làm gì để gỡ?
