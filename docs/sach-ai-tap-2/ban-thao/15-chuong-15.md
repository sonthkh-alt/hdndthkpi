# Chương 15. Bản tin pháp luật tự động và Sổ tay AI có trích dẫn nguồn

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu cách một bản tin pháp luật hằng ngày được dựng hoàn toàn bằng chương trình, chạy theo lịch trên máy của Văn phòng, không cần khóa API và không gọi AI.
- Nhận diện hai cái bẫy của tiếng Việt khi cho máy "đọc" văn bản, và biết cách dặn tác tử AI lập trình tránh chúng.
- Nắm nội dung nhiệm vụ đột phá "Sổ tay AI": 06 sổ tay, 54 câu hỏi mẫu, 4 chỉ tiêu, 3 mốc thời gian, và lý do chọn NotebookLM (nay là Gemini Notebook).
- Hiểu nguyên tắc "có nguồn mới trả lời" và vì sao phần mềm không bao giờ tự gán hiệu lực cho một văn bản.
- Tự lập được một sổ tay hỏi đáp có trích dẫn cho Ban hoặc phòng của mình, đúng Quy tắc sử dụng AI.

Dành cho: cán bộ, công chức tham mưu thường xuyên theo dõi và tra cứu văn bản; Tổ công tác chuyển đổi số của Văn phòng; lãnh đạo các Ban, lãnh đạo Văn phòng cần quyết định cách tổ chức việc tra cứu bằng AI.
:::

Cán bộ tham mưu ở cơ quan dân cử sống giữa văn bản. Sáng nào cũng có thể có nghị định mới, tuần nào cũng có nghị quyết mới, kỳ họp nào cũng có cả chồng tài liệu cần đối chiếu. Có hai câu hỏi lặp lại gần như hằng ngày: "Hôm nay có văn bản gì mới?" và "Nội dung này quy định ở điều nào, văn bản đó còn hiệu lực không?".

Chương này kể về hai công cụ trả lời hai câu hỏi ấy trong hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh, tại địa chỉ hdndthkpi.vercel.app. Công cụ thứ nhất là khối Bản tin pháp luật hằng ngày ở đầu Trang chủ. Công cụ thứ hai là phân hệ Sổ tay AI (đường dẫn `#/sotay`), thực hiện một nhiệm vụ đột phá mà Văn phòng đã đăng ký.

Hai công cụ đi theo hai hướng ngược nhau, và chính sự ngược nhau ấy là bài học. Bản tin không dùng AI, vì việc của nó có quy tắc cố định. Sổ tay có dùng AI, nhưng AI bị trói chặt vào nguồn: không có đoạn văn bản làm căn cứ thì không được trả lời. Giữa hai cực đó là một câu hỏi mà người tự làm ứng dụng nên đặt trước mỗi việc: "Việc này có thật sự cần AI không? Nếu cần, AI được phép nói đến đâu?".

Một lưu ý về tên gọi. Nhiệm vụ đăng ký và giao diện phân hệ dùng tên NotebookLM. Ngày 16/7/2026, Google đổi tên sản phẩm này thành Gemini Notebook. Trong chương, khi nói về nhiệm vụ đã đăng ký và màn hình phân hệ, tôi giữ tên NotebookLM như văn bản gốc; khi nói về sản phẩm hiện hành, tôi viết "Gemini Notebook (trước đây là NotebookLM)".

## 15.1. Bản tin pháp luật hằng ngày: tự động mà không cần AI

### 15.1.1. Bài toán: mỗi sáng một tờ tin đúng nguồn

Trang chủ là nơi cán bộ, đại biểu mở ra đầu tiên. Tôi muốn ngay phía trên lưới phân hệ có một tờ tin nhỏ: vài văn bản, chính sách mới của cả nước và của tỉnh, lấy từ kênh chính thống, cập nhật mỗi sáng. Không ai phải ngồi cắt dán, không phát sinh chi phí.

Yêu cầu nghe đơn giản nhưng có bốn ràng buộc. Nguồn phải chính thống. Không lặp lại tin hôm trước. Lỡ hỏng thì không được làm hỏng thứ đang có. Người mở bằng điện thoại vẫn xem được, người dùng trình đọc màn hình vẫn nghe được.

Sản phẩm cuối cùng là một ảnh khổ ngang 3508×2480 điểm ảnh (tỷ lệ A4 ngang), nền vàng, chia lưới 3×2 thành 6 thẻ: 5 thẻ tin cả nước nền trắng và 1 thẻ tỉnh Thanh Hóa nền xanh đậm, chứa tối đa ba tin. Mỗi thẻ tin có số thứ tự, nhãn chủ đề, màu nhấn và một hình vẽ minh họa theo chủ đề.

### 15.1.2. Lần thử đầu: giao cho một tác vụ AI trên đám mây

::: {.cauchuyen}
**Câu chuyện thực tế — "đã xong" nhưng chưa từng chạy**

Phương án đầu tiên của tôi là một tác vụ định kỳ của Claude chạy trên đám mây, tên `ban-tin-phap-luat-hang-ngay`. Mỗi ngày tác vụ sinh một ảnh infographic rồi đẩy lên GitHub bằng một chuỗi khóa truy cập (token). Phía Trang chủ, tôi giao tác tử AI lập trình dựng sẵn khối hiển thị và viết một "hợp đồng" ở tệp `public/bantin/README.md`: tên ba tệp, cấu trúc phần chú thích, cách cấu hình bước đẩy.

Khối hiển thị làm đúng phần việc của nó: chưa có ảnh thì tự ẩn. Nhưng Trang chủ không bao giờ có ảnh. Trong một đợt rà soát, toàn bộ 18 kho mã nguồn (repository) của tài khoản được quét, không thấy một ảnh bản tin nào. Bước đẩy lên GitHub thiếu cấu hình, thiếu token nên chưa từng đẩy được lần nào, trong khi ai cũng tưởng tác vụ vẫn chạy đều mỗi ngày.

Giống như văn thư báo cáo "đã gửi công văn" mỗi sáng, nhưng sổ chuyển phát của bưu điện không có dòng nào.
:::

Tôi rút ra hai bài học. Một: đừng tin vào báo cáo "đã chạy"; hãy kiểm sản phẩm ở chính nơi người dùng nhìn thấy. Hai: việc này có quy tắc cố định — lấy tin từ nguồn chính thống, lọc, xếp vào khuôn — nên không cần đến một mô hình AI. Muốn có tờ tin dán bảng mỗi sáng thì không cần thuê nhà báo; chỉ cần một người cắt dán đúng nguồn theo một mẫu cố định. AI vẫn rất có ích, nhưng ở vai người viết ra chương trình cắt dán ấy.

### 15.1.3. Thiết kế lại: dây chuyền bốn khâu chạy tại chỗ

Tôi chuyển hẳn bộ sinh bản tin về máy tính của Văn phòng, nơi công cụ `git` đã đăng nhập sẵn vào kho mã. Toàn bộ nằm trong thư mục `tools/bantin/`, gồm bốn tệp Python, tổng cộng khoảng 940 dòng. Không khóa API, không token, không gọi AI.

| Tệp | Việc | Ví von |
|---|---|---|
| `tin.py` | Lấy tin, làm sạch, chọn lọc, chống trùng | Người đi lấy báo, đánh dấu bài |
| `poster.py` | Vẽ ảnh bằng thư viện Pillow | Người trình bày maket |
| `chay.py` | Nối cả dây, lưu kho, đẩy lên GitHub | Người phát hành |
| `kiem_thu.py` | 42 phép kiểm, không cần mạng | Người đọc soát |

Nguồn tin là các kênh tin định kỳ dạng RSS (RSS feed). Có thể hình dung RSS như tờ tin vắn mà tòa soạn phát hành sẵn ở dạng máy đọc được: mỗi mục có tiêu đề, đoạn mô tả, đường dẫn và giờ đăng. Bộ sinh đọc năm kênh: hai kênh cả nước là `xaydungchinhsach.chinhphu.vn/rss` và `baochinhphu.vn/rss`; ba kênh của tỉnh là `baothanhhoa.vn/rss/thoi-su.xml`, `phap-luat.xml` và `kinh-te.xml`. Việc đọc dùng thư viện có sẵn của Python, không cần đăng nhập.

Mỗi lượt chạy đi qua tám bước:

1. Đọc năm kênh. Kênh nào hỏng thì ghi lỗi vào nhật ký rồi đọc tiếp kênh sau, không làm gãy cả lượt.
2. Xếp tin mới lên trước, rồi lọc trùng với sổ `da-dua-tin.json`. Sổ giữ 200 tin gần nhất và khóa theo **tiêu đề**, vì cùng một tin đăng lại ở kênh khác thường giữ nguyên tiêu đề nhưng đổi đường dẫn.
3. Ưu tiên tin "có dáng dấp pháp luật": tiêu đề hoặc mô tả chứa một trong 25 từ khóa như nghị định, thông tư, nghị quyết, luật, hiệu lực, ban hành, sửa đổi, phê duyệt. Chọn 5 tin cả nước và tối đa 3 tin của tỉnh.
4. Đoán chủ đề từng tin để chọn màu và hình minh họa (xem mục 15.2).
5. Vẽ ảnh; lưu bản gốc PNG khoảng 1 MB và một ảnh nhẹ JPG cỡ 1404×992, khoảng 204–220 KB.
6. Ghi tệp chú thích `moi-nhat.json` gồm ngày, tiêu đề và danh sách tin **dạng chữ**. Toàn bộ nội dung bản tin nằm trong ảnh, mà trình đọc màn hình và máy tìm kiếm thì không đọc được chữ trong ảnh.
7. Chép một bản vào kho lưu trữ theo ngày, dọn bản quá cũ.
8. Ghi sổ đã đưa tin, tạo một lần lưu thay đổi (commit) với thông điệp "bantin: bản tin pháp luật ngày …", rồi đẩy lên nhánh chính. Vercel tự triển khai lại sau khoảng 1–2 phút.

Lịch chạy giao cho Task Scheduler của Windows: tác vụ `BanTinPhapLuat` chạy lúc 07:30 hằng ngày bằng `pythonw.exe`, tức chạy ngầm, không hiện cửa sổ. Lần kiểm chứng đầu tiên gồm hai việc: chạy thật qua Task Scheduler, nhận kết quả `LastTaskResult = 0` (chạy xong bình thường); mở trang thật, thấy tệp ảnh trả mã 200, dung lượng đúng, chú thích đúng ngày, Trang chủ hiện đủ ảnh và danh sách tin.

Phía Trang chủ, khối bản tin (`src/BanTin.jsx`) bố trí hai cột: ảnh bên trái, bấm vào thì mở khổ lớn ở tab mới; danh sách tin dạng chữ bên phải. Chiều cao ảnh bị chặn, vì một ảnh khổ ngang để tràn bề rộng sẽ chiếm trọn màn hình đầu và đẩy lưới phân hệ ra khỏi tầm nhìn. Trang ưu tiên tải ảnh nhẹ; bản gốc chỉ tải khi người xem bấm vào. Bản tin cũ quá ba ngày thì tự gắn nhãn để người xem biết.

### 15.1.4. Những chốt chặn để "tự động" không thành "tự hỏng"

Một chương trình chạy một mình lúc 7 giờ 30 sáng, không ai ngồi nhìn, phải được dạy trước cách cư xử khi gặp chuyện. Tôi giao tác tử AI lập trình liệt kê từng tình huống xấu và cách xử lý, rồi viết thành mã và thành phép kiểm.

| Tình huống | Chương trình làm gì |
|---|---|
| Mất mạng, không đọc được kênh nào | Dừng lại, **không ghi đè** bản tin cũ |
| Chưa đủ 5 tin mới so với lần trước | Không ra bản tin hôm đó |
| Không có tin mới của tỉnh | Thẻ tỉnh lấy tin gần nhất, ghi cảnh báo vào nhật ký |
| Nội dung không đổi | Không tạo lần lưu thay đổi rỗng |
| Trang chủ chưa có ảnh | Ẩn hẳn khối bản tin, không hiện khung ảnh vỡ |

Chốt cuối cùng có một chi tiết đáng kể. Máy chủ của ứng dụng một trang thường trả về trang chủ với mã 200 cho cả những tệp không tồn tại. Nếu chỉ hỏi "có tệp không?" và tin vào mã 200, Trang chủ sẽ tưởng là có ảnh. Giống như hỏi lễ tân "có ông A không?", lễ tân luôn đáp "dạ có" rồi dẫn khách vào một phòng trống. Vì vậy Trang chủ dò bằng một yêu cầu chỉ lấy phần đầu (HEAD) và kiểm thêm loại nội dung: phải đúng là ảnh mới hiện.

Sau đó, tôi bổ sung chức năng xem lại bản tin của những ngày trước. Mỗi lượt chạy chép thêm `luu-tru/<ngày>.jpg` và `.json`, rồi dựng lại tệp mục lục `muc-luc.json`. Hai quyết định nhỏ ở đây xuất phát từ việc **tính trước dung lượng sau một năm**:

- Kho chỉ giữ ảnh nhẹ, không giữ bản PNG khổ lớn. Mỗi ngày một tệp 1 MB thì một năm đã hơn 400 MB nằm trong kho mã — mà kho mã là tủ hồ sơ, không phải nhà kho.
- Chỉ giữ 90 ngày gần nhất, tổng khoảng 21 MB, bản cũ hơn tự dọn. Chín mươi ngày tính theo **lịch** chứ không theo số tệp, để máy tắt vài hôm thì kho vẫn phủ đủ khoảng thời gian đó.

Khi mục lục có từ hai ngày trở lên, huy hiệu ngày trên Trang chủ biến thành một hộp chọn. Tôi dặn dùng thẻ chọn có sẵn của trình duyệt thay vì tự dựng menu: bàn phím dùng được, điện thoại hiện bộ chọn quen thuộc. Chỉ có một ngày thì giữ huy hiệu tĩnh, không tạo ra một nút bấm mà bấm vào chẳng có gì. Bản tin ngày 09/9/2026 được khôi phục từ lịch sử git để kho có ngay hai ngày khi ra mắt tính năng. Đến ngày 26/10/2026, mục lục có 36 ngày. Có những ngày vắng bản tin; tôi không lấp chỗ trống, vì thiếu một ngày vẫn hơn một tờ tin lặp lại tin cũ.

::: {.ghinho}
**Ghi nhớ — bốn đức tính của một tác vụ tự động**

1. Hỏng thì giữ nguyên thứ đang có, không ghi đè bằng thứ dở dang.
2. Chạy lại nhiều lần trong ngày cũng không gây hại.
3. Tự ghi nhật ký, vì không ai ngồi nhìn nó chạy.
4. Tính trước khối lượng tích lũy sau một năm, trước khi cho nó lưu thứ gì hằng ngày.
:::

### 15.1.5. Sáng 10/9/2026 không có bản tin

::: {.cauchuyen}
**Câu chuyện thực tế — bảo vệ thôi không kéo cờ**

Sáng 10/9/2026, Trang chủ không có bản tin mới. Không có thông báo lỗi nào, vì tác vụ chạy ngầm không cửa sổ, mọi dòng chữ chương trình in ra đều mất. Rà lại cấu hình tác vụ, tôi tìm ra hai nguyên nhân.

Thứ nhất, tác vụ được đặt điều kiện "chỉ chạy khi có mạng". Máy vừa bật, Windows chưa kịp kết luận là đã có mạng, nên hủy luôn lượt chạy và không thử lại. Thứ hai, tác vụ chỉ có đúng một mốc 07:30; máy không bật đúng lúc đó là mất cả ngày.

Giống như dặn bảo vệ "7 giờ 30 có điện thì kéo cờ". Hôm ấy điện chập chờn, bảo vệ thôi không kéo, và không ai biết vì sao.
:::

Cách sửa có bốn phần. Bỏ điều kiện mạng, vì chính chương trình đã tự xử lý mất mạng: dừng lại và không ghi đè bản tin cũ. Thêm mốc chạy khi đăng nhập, trễ 3 phút cho mạng kịp lên, cùng tùy chọn chạy bù khi máy bật muộn. Lỡ hỏng thì tự thử lại 3 lần, cách nhau 10 phút. Mọi thông điệp vừa in ra màn hình vừa ghi vào tệp `nhat-ky.log`, nhật ký tự cắt gọn để không phình mãi. Chạy nhiều lần trong ngày là vô hại, vì chương trình tự bỏ qua khi không đủ tin mới và không tạo lần lưu rỗng.

Bài học gói lại thành ba chữ: **chạy bù, thử lại, nhật ký**. Tác vụ tự động nào thiếu một trong ba thứ ấy đều sẽ có ngày "lặng lẽ không chạy".

Cũng phải thật thà về một chỗ chưa khớp. Quy tắc của dự án (Chương 7) ghi rõ không đặt kho mã trong OneDrive. Thế nhưng đoạn lệnh đăng ký tác vụ trong `tools/bantin/README.md` vẫn trỏ tới một thư mục OneDrive trên máy cơ quan. Quy tắc ghi ra giấy mà máy không thực thi thì sớm muộn sẽ bị vi phạm; việc đúng là thống nhất lại vị trí kho mã trên máy chạy tác vụ.

### 15.1.6. Cách tôi giao việc cho tác tử AI lập trình

Câu lệnh dưới đây tái dựng theo đúng tinh thần những gì tôi đã giao, gom lại thành một lần cho dễ dùng. Trong thực tế, tôi giao từng phần, mỗi phần nghiệm thu xong mới sang phần sau.

::: {.lenhmau}
**Câu lệnh mẫu 15.1 — Dựng bộ sinh bản tin chạy tại chỗ, không dùng AI**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi, trên máy Windows.
Bối cảnh: Trang chủ đã có khối bản tin đọc 3 tệp cố định trong
public/bantin/ (xem public/bantin/README.md). Tác vụ đám mây cũ chưa
đẩy được ảnh nào.
Việc: Viết bộ sinh bản tin pháp luật hằng ngày bằng Python trong
tools/bantin/:
1. Đọc các kênh RSS chính thống: [danh sách địa chỉ RSS]. Chỉ MỘT
   hàm được chạm tới mạng; mọi hàm khác là logic thuần.
2. Lọc trùng theo tiêu đề với sổ da-dua-tin.json (giữ 200 tin).
3. Ưu tiên tin có từ khóa pháp luật; chọn 5 tin cả nước, tối đa
   3 tin của tỉnh.
4. Vẽ ảnh A4 ngang bằng Pillow, phông có sẵn của Windows, đủ dấu.
5. Ghi moi-nhat.png, moi-nhat.jpg (ảnh nhẹ), moi-nhat.json (tin dạng chữ).
6. Commit đúng các tệp này rồi push bằng git đã đăng nhập của máy.
Dạng: tên hàm, biến, thông điệp bằng tiếng Việt có dấu; ghi nhật ký
ra tệp nhat-ky.log.
Ràng buộc: không khóa API, không token, không gọi AI. Mất mạng thì
dừng và KHÔNG ghi đè bản tin cũ. Chưa đủ 5 tin mới thì không ra bản
tin. Nội dung không đổi thì không commit. Không đụng tệp nào khác.
Nghiệm thu: bộ kiểm thử chạy không cần mạng đều đạt; chạy thử ở chế độ
không đẩy ra ảnh đúng 6 thẻ; hướng dẫn đăng ký tác vụ Windows 07:30 có
chạy bù, thử lại, nhật ký. Trình phương án trước khi viết mã.
```
:::

Hãy để ý dòng "chỉ một hàm được chạm tới mạng". Đó là mẹo giúp người không chuyên kiểm thử được: phần "tính" tách khỏi phần "đi lại", nên hàng chục phép kiểm chạy trong vài giây mà không cần mạng. Trong `tin.py`, chỗ duy nhất chạm mạng là hàm `doc_rss`.

::: {.canhbao}
**Cảnh báo — bản tin là tin báo, không phải văn bản**

Tin trên báo, trên cổng thông tin chỉ là nguồn tham khảo để biết "có gì mới". Trước khi dẫn một văn bản vào tờ trình, báo cáo hay bài phát biểu, phải tra nguyên văn trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật. Bản tin chỉ dùng tiêu đề tin và ghi rõ nguồn, không chép lại nguyên bài của cơ quan báo chí. Kho mã của dự án là công khai: chỉ đẩy ảnh bản tin và chú thích, tuyệt đối không đẩy khóa bí mật hay tài liệu nội bộ.
:::

### 15.1.7. Nếu đồng chí muốn làm phiên bản nhỏ hơn

Một phòng hay một Ban không cần ảnh infographic. Phiên bản ở bậc 2 trong thang kiến tạo (Chương 2) đã đủ dùng: một tệp Python đọc hai, ba kênh RSS chính thống, lọc theo vài từ khóa của lĩnh vực mình, rồi ghi ra một trang HTML hoặc một tệp Word "Danh sách tin ngày …" có đường dẫn gốc, lưu vào thư mục chung của phòng. Task Scheduler chạy nó mỗi sáng.

Khi giao việc, đồng chí chỉ cần giữ ba ràng buộc của bản đầy đủ: mất mạng thì không ghi đè tệp hôm trước; không đủ tin mới thì không ra tệp mới; mọi lần chạy đều ghi nhật ký. Và dặn thêm một câu sẽ được giải thích ngay ở mục sau: "so khớp từ khóa có dấu, theo ranh giới từ".

## 15.2. Hai cái bẫy của tiếng Việt khi máy "đọc" tin

Để chọn màu và hình minh họa, bộ sinh phải đoán chủ đề của từng tin, trong sáu nhóm: Thiên tai, ứng phó · Tổ chức bộ máy · An ninh, trật tự · Tài chính, ngân sách · An sinh xã hội · Hạ tầng, giao thông. Không khớp nhóm nào thì về nhóm mặc định "Chỉ đạo, điều hành". Bản đầu tiên làm theo lối quen thuộc: có từ khóa thì nhận, khớp nhóm nào trước thì lấy nhóm đó. Chỉ vài ngày đã lộ ra hai lỗi rất "tiếng Việt".

### 15.2.1. Bẫy thứ nhất: khớp chuỗi con

Tin "Phòng thủ dân sự quốc gia" bị gán chủ đề Tài chính. Lý do: chuỗi "quốc gia" chứa âm tiết "gia"; khi bỏ dấu để so, "gia" trùng với từ khóa "giá" của nhóm Tài chính. Máy chỉ hỏi "chuỗi này có nằm đâu đó trong tiêu đề không?", chứ không hỏi "đó có phải là một từ đứng riêng không?". Giống như tìm "Lan" trong danh sách thì ra cả "Hoa Lan" lẫn "Lanh".

Cùng họ lỗi này còn xuất hiện ở chỗ khác của dự án. Khi suy mẫu kế hoạch kiểm điểm theo chức vụ (Chương 10), chuỗi "trưởng ban" nằm gọn trong "phó trưởng ban"; xét sai thứ tự thì một đồng chí Phó Trưởng Ban nhận nhầm mẫu của Trưởng Ban. Ở Sổ tay AI, nếu so chuỗi con thì câu hỏi có "quốc gia" sẽ kéo cả những đoạn nói về "gia đình".

### 15.2.2. Bẫy thứ hai: bỏ dấu để so cho "tiện"

Bỏ dấu trước khi so là thói quen của người lập trình, để ai gõ có dấu hay không dấu cũng tìm ra. Nhưng tiếng Việt bỏ dấu thì "báo" và "bão" cùng thành "bao". Tin "họp báo thường kỳ" vì thế bị nhận là tin bão, và thẻ tin họp báo mang màu cảnh báo thiên tai. Gọi "Bão" thì cả "Báo" lẫn "Bảo" cùng đứng dậy. Nguồn chính thống luôn viết đủ dấu, nên so khớp có dấu vừa đúng hơn, vừa không mất gì.

### 15.2.3. Cách chữa: giữ dấu, khớp theo ranh giới từ, chấm điểm

Bản sửa thay đổi ba chỗ:

- **Giữ nguyên dấu** khi so từ khóa.
- **Khớp theo ranh giới từ**: từ khóa chỉ được nhận khi hai đầu của nó không dính liền một chữ cái hay chữ số khác.
- **Chấm điểm thay vì lấy kết quả khớp đầu tiên**: mỗi từ khóa có trong tiêu đề được 3 điểm, có trong đoạn mô tả được 1 điểm; nhóm nào gom được nhiều điểm nhất thì thắng.

Bỏ dấu vẫn có chỗ dùng: so trùng cả một tiêu đề dài (khóa chống trùng tin), hay ô tìm kiếm gõ nhanh trên giao diện. Chỗ không được dùng là chấm điểm từng từ khóa ngắn. Cả hai ca lỗi được giữ lại làm phép kiểm hồi quy, ở bộ kiểm thử Python của bản tin lẫn bộ kiểm thử JavaScript của Sổ tay AI, để không bao giờ tái phát.

::: {.vidu}
**Ví dụ minh họa — cùng một tin, hai cách chấm**

Giả sử có tin với tiêu đề "Chính phủ họp báo thường kỳ, thông tin về điều chỉnh tiền lương", phần mô tả có cụm "người lao động".

- *Cách cũ* (bỏ dấu, khớp chuỗi con, lấy nhóm khớp đầu tiên): "họp báo" thành "hop bao", trùng "bao" của từ khóa "bão". Nhóm Thiên tai đứng đầu danh sách nên thắng ngay. Kết quả sai.
- *Cách mới* (giữ dấu, ranh giới từ, chấm điểm): "báo" không phải "bão" nên nhóm Thiên tai được 0 điểm. "Tiền lương" có trong tiêu đề: nhóm An sinh xã hội được 3 điểm; "lao động" có trong mô tả: thêm 1 điểm. Nhóm An sinh xã hội thắng với 4 điểm. Kết quả đúng.
:::

### 15.2.4. Tiếng Việt là ngôn ngữ âm tiết: chấm cả cặp âm tiết

Bài học thứ ba đến khi làm lối tra nhanh của Sổ tay AI. Tiếng Việt viết rời từng âm tiết, mà một âm tiết đứng riêng thường gần như vô nghĩa: "giám", "sát", "chuyên", "đề". Hỏi "giám sát chuyên đề" mà máy chỉ chấm từng âm tiết thì đoạn nói về "giám đốc" hay "chuyên viên" cũng được điểm.

Cách chữa: ngoài âm tiết đơn, máy chấm thêm **từng cặp âm tiết liền nhau**, với trọng số 2,6. Câu hỏi "giám sát chuyên đề" sinh ra bốn âm tiết đơn và ba cặp: "giám sát", "sát chuyên", "chuyên đề". Đoạn có "giám đốc" chỉ khớp một âm tiết "giám"; đoạn nói đúng về giám sát chuyên đề khớp thêm hai cặp, mỗi cặp nặng gấp 2,6 lần, nên vượt lên rõ rệt. Các từ dừng như "và", "của", "thế nào", "bao nhiêu" bị loại khỏi âm tiết đơn vì câu nào cũng có, nhưng vẫn được giữ khi ghép cặp.

Đặc điểm ngôn ngữ như vậy, cùng cấu trúc Phần – Chương – Điều – khoản của văn bản hành chính, là tri thức nghiệp vụ mà người làm văn bản hiểu rõ hơn AI. Đừng chờ AI tự nghĩ ra; hãy nói cho nó.

::: {.lenhmau}
**Câu lệnh mẫu 15.2 — Bắt tác tử kiểm thử bằng các cặp từ dễ nhầm**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi.
Bối cảnh: Hàm [tên hàm] đang gán chủ đề / chấm điểm văn bản tiếng Việt
theo từ khóa. Nguồn văn bản luôn viết đủ dấu.
Việc: Rà lại cách so khớp và viết bộ phép kiểm hồi quy.
Ràng buộc:
- So khớp GIỮ NGUYÊN DẤU, theo RANH GIỚI TỪ; không dùng tìm chuỗi con.
- Bỏ dấu chỉ được dùng cho ô tìm kiếm gõ nhanh; nói rõ chỗ nào đang bỏ dấu.
- Chấm điểm (tiêu đề nặng hơn mô tả), không lấy kết quả khớp đầu tiên.
- Thêm ít nhất các ca: "quốc gia" không được khớp "gia"/"giá";
  "họp báo" không được khớp "bão"; "phó trưởng ban" không được nhận
  là "trưởng ban"; "giám sát chuyên đề" phải thắng "giám đốc".
Nghiệm thu: liệt kê từng phép kiểm bằng tiếng Việt dễ hiểu, chạy toàn bộ
và báo kết quả; không sửa chỗ nào ngoài hàm này và tệp kiểm thử.
```
:::

## 15.3. Nhiệm vụ đột phá "Sổ tay AI"

### 15.3.1. Từ một dòng đăng ký đến một phân hệ

Văn phòng đã đăng ký một nhiệm vụ đột phá tại Trục 3, Mục V.5(4) của Đề án, nguyên văn: *"Thí điểm hỏi đáp, tra cứu bằng trí tuệ nhân tạo (NotebookLM) về các lĩnh vực của cơ quan dân cử: xây dựng các sổ tay AI theo lĩnh vực để cán bộ, công chức Văn phòng, các Ban và đại biểu chat, hỏi đáp, tra cứu có trích dẫn nguồn"*. Phần trách nhiệm ghi rõ việc phải "chủ trì chọn, kiểm tra nguồn văn bản chính thống, còn hiệu lực". Ghi chú của nhiệm vụ đặt hai điều kiện: chỉ dùng văn bản công khai, không mật; và cơ quan không phát sinh kinh phí.

Phân hệ Sổ tay AI hoàn thành ngày 22/10/2026, gánh hai vai cùng lúc. Vai thứ nhất là **cổng vào**: cán bộ bấm một nút để mở đúng sổ tay của lĩnh vực mình. Vai thứ hai là **bộ quản lý thí điểm**, giữ mọi thứ mà một nhiệm vụ cần để báo cáo: nguồn đã kiểm tra, câu hỏi mẫu, quy tắc, danh sách đã hướng dẫn, phép đo thời gian. Giao diện có 8 tab theo đúng đường đi của người dùng: Tổng quan · Sổ tay trên NotebookLM · Nguồn của sổ tay · Câu hỏi mẫu · Quy tắc dùng AI · Hướng dẫn cán bộ · Tra nhanh tại chỗ · Báo cáo.

### 15.3.2. Sáu sổ tay theo lĩnh vực

| Mã | Sổ tay | Người dùng chính |
|---|---|---|
| ST-01 | Tổ chức và hoạt động của HĐND | Đại biểu, Thường trực, Văn phòng |
| ST-02 | Kỳ họp và công tác thẩm tra | Các Ban, Phòng Công tác HĐND |
| ST-03 | Hoạt động giám sát | Thường trực, các Ban, Tổ đại biểu |
| ST-04 | Dân nguyện, khiếu nại và tố cáo | Thường trực, Ban Pháp chế, phòng dân nguyện |
| ST-05 | Nghị quyết của HĐND tỉnh | Các Ban, Văn phòng, cơ quan trình |
| ST-06 | Đánh giá, xếp loại cán bộ, công chức | Toàn thể cán bộ Văn phòng |

Mỗi sổ tay có sẵn 9 câu hỏi mẫu, tổng cộng 54 câu, và 4–5 nguồn gợi ý, tổng cộng 21 nguồn. Câu hỏi mẫu được viết bằng ngôn ngữ của người đi tra, chẳng hạn: "Nghị quyết của HĐND tỉnh được thông qua khi có bao nhiêu đại biểu tán thành?" (ST-02), "Phiên giải trình tại phiên họp Thường trực HĐND được tổ chức theo trình tự nào?" (ST-03), "Người tố cáo được bảo vệ như thế nào theo quy định của pháp luật?" (ST-04).

Mọi câu hỏi mẫu đặt sẵn ở trạng thái "Chưa đối chiếu nguồn". Một câu chỉ được tính vào chỉ tiêu khi cán bộ đã hỏi thử, bấm từng trích dẫn, mở văn bản gốc đối chiếu và chuyển sang "Đã đối chiếu nguồn". Mỗi câu có nút sao chép để dán thẳng sang ô chat của sổ tay.

### 15.3.3. Bốn chỉ tiêu, ba mốc và cách đo cho trung thực

| Chỉ tiêu đăng ký | Phần mềm đếm thế nào |
|---|---|
| 06 sổ tay theo lĩnh vực | Sổ tay "xong" khi đã gắn notebook, có nguồn đã kiểm tra, nguồn đã nạp lên notebook và có câu hỏi mẫu đã đối chiếu |
| Ít nhất 50 câu hỏi mẫu | Chỉ đếm câu ở trạng thái "Đã đối chiếu nguồn" |
| 100% cán bộ, công chức Văn phòng được hướng dẫn | Số người có ngày hướng dẫn trên tổng số |
| Thời gian tra cứu giảm ít nhất 30% | So thời gian tra bằng sổ tay với số phút nếu tra thủ công |

Báo cáo đánh giá có thêm dòng thứ năm: Quy tắc sử dụng AI đã được ban hành hay chưa. Phần trăm hoàn thành chung là trung bình của năm dòng ấy. Ba mốc thời gian: sổ tay và câu hỏi mẫu trước 15/11/2026; hướng dẫn cán bộ trước 25/11/2026; báo cáo đánh giá trước 10/12/2026. Báo cáo xuất ra Word khổ ngang, gồm bảng chỉ tiêu Đạt/Chưa đạt, Phụ lục 1 danh mục nguồn từng sổ tay kèm địa chỉ notebook và cột "Đã nạp lên NotebookLM", Phụ lục 2 ngân hàng câu hỏi mẫu.

Tại thời điểm viết (26/10/2026), các con số trên vẫn là **chỉ tiêu**, chưa phải kết quả. Tôi không báo cáo trước điều chưa đo. Riêng chỉ tiêu thời gian, cần nói thẳng hai giới hạn của cách đo. Thứ nhất, số phút "nếu tra thủ công" do chính người tra **ước lượng**, không phải bấm giờ thật. Thứ hai, phép đo tự động chỉ ghi được ở lối tra nhanh trong phân hệ; hỏi trên Gemini Notebook thì phải ghi tay. Muốn con số đứng được trong báo cáo, nên đo trước – đo sau trên cùng một bộ câu hỏi, do vài người làm, và ghi rõ phương pháp đo ngay trong báo cáo.

### 15.3.4. Vì sao chọn NotebookLM — nay là Gemini Notebook

Ngay trong ngày 22/10/2026, phân hệ đi qua hai bản. Bản đầu, tôi giao tác tử dựng một lối tra cứu riêng hoàn chỉnh: nạp nguyên văn văn bản vào phân hệ, máy tự tìm đoạn liên quan rồi nhờ AI trả lời có trích dẫn (mục 15.4). Bản ấy chạy được, có 120 phép kiểm đạt. Nhưng nó dùng chung khóa AI và chung hạn mức với phân hệ Trợ lý AI: khách 1 lượt mỗi ngày, người đăng nhập 5 lượt mỗi ngày. Hạn mức ấy không đủ cho cả cơ quan hỏi hằng ngày, còn nới ra thì phát sinh tiền.

Tôi chốt định hướng: hỏi đáp chạy trên NotebookLM. Mỗi sổ tay là một notebook do Văn phòng lập và chia sẻ; cán bộ tự đăng nhập tài khoản Google của mình để mở. Có ba lý do:

1. Công cụ trả lời dựa trên các nguồn người dùng nạp vào, kèm trích dẫn đánh số, bấm vào là xem được đoạn gốc — đúng yêu cầu "có trích dẫn nguồn".
2. Mỗi người dùng tài khoản riêng nên hạn mức tính theo từng người, không ai "ăn" vào phần của ai.
3. Cơ quan không phát sinh kinh phí, đúng ghi chú của nhiệm vụ.

Phân hệ vì thế chuyển thành cổng vào cộng bộ quản lý. Nạp nguyên văn vào phân hệ hạ xuống thành **tùy chọn**, chỉ phục vụ lối "Tra nhanh tại chỗ" làm dự phòng. Định nghĩa "sổ tay xong" cũng đổi theo: tính theo notebook, không tính theo nguyên văn trong phân hệ. Bộ kiểm thử tăng lên 147 phép kiểm, trong đó có 8 phép chốt việc tiến độ phải tính theo notebook.

::: {.cauchuyen}
**Câu chuyện thực tế — giả định của AI đã lỗi thời**

Khi tôi đưa đường dẫn một notebook để gắn vào phân hệ, tác tử AI lập trình không tin vào trí nhớ của nó mà mở thử đường dẫn thật. Kết quả: địa chỉ cũ `notebooklm.google.com` trả mã chuyển hướng 301 về `notebook.google.com`. Hiểu biết sẵn có của AI về tên miền của sản phẩm này đã lỗi thời.

Tác tử viết hàm chuẩn hóa địa chỉ: nhận cả hai tên miền, nhận cả khi người dùng chỉ dán mã notebook trần hoặc thiếu `https://`, bỏ tham số thừa và khoảng trắng, luôn lưu về tên miền hiện hành; gặp tên miền lạ thì từ chối với câu báo lỗi nêu đúng dạng cần dán. Hàm có 13 phép kiểm riêng. Hướng dẫn còn ghi rõ: mở liên kết khi chưa đăng nhập sẽ bị đưa sang trang đăng nhập của Google — đó là hành vi đúng, không phải lỗi.
:::

Các dữ kiện về sản phẩm, tính đến tháng 10/2026, như sau. Ngày 16/7/2026, Google công bố đổi tên NotebookLM thành Gemini Notebook; sản phẩm vẫn là công cụ độc lập, notebook, nguồn và ghi chú cũ được giữ nguyên. Bài công bố không nhắc việc đổi tên miền; theo một nguồn bên thứ ba, địa chỉ `notebook.google.com` hoạt động từ cuối tháng 7/2026, và khoảng 01/8/2026 địa chỉ cũ bắt đầu tự chuyển hướng, nên các liên kết đã chia sẻ vẫn mở được. Trang trợ giúp chính thức nay nằm ở `support.google.com/gemininotebook`. Từ 02/9/2026, Google bỏ hạn mức cố định theo ngày, chuyển sang hạn mức theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ và có trần theo tuần. Vì vậy sách này không ghi "mỗi ngày hỏi được bao nhiêu câu" như một con số cố định. Đây là thông tin tham khảo tại thời điểm viết, có thể thay đổi.

Chọn một nền tảng có sẵn thì cũng nhận luôn giới hạn của nó. Nguồn tải lên được lưu trên máy chủ của Google, nên chỉ được nạp văn bản công khai. Mỗi cán bộ dùng tài khoản riêng, nên cơ quan phải có hướng dẫn về tài khoản (mục 15.5). Và nền tảng có thể đổi tên, đổi địa chỉ, đổi hạn mức như năm 2026 đã cho thấy. Cách phòng của tôi là giữ phần "trí tuệ của cơ quan" — danh mục nguồn, kết quả kiểm tra hiệu lực, ngân hàng câu hỏi đã đối chiếu — trong phân hệ của Văn phòng. Nếu mai này chuyển sang một nền tảng khác, chẳng hạn các nền tảng AI dùng chung quốc gia mà Chiến lược quốc gia về trí tuệ nhân tạo ban hành kèm Quyết định 1671/QĐ-TTg ngày 28/8/2026 đặt mục tiêu xây dựng, thì công sức kiểm tra nguồn không mất.

## 15.4. Nguyên tắc "có nguồn mới trả lời"

### 15.4.1. Vì sao không cho AI trả lời bằng trí nhớ

Tập 1 đã cảnh báo: mô hình AI "đoán chữ tiếp theo", nên có thể bịa số hiệu văn bản, và không biết văn bản vừa ban hành. Với tra cứu pháp luật, một câu trả lời trơn tru mà dẫn sai điều, sai khoản, hoặc dẫn văn bản đã hết hiệu lực thì nguy hiểm hơn là không trả lời. Người đọc tin vì nó nghe hợp lý.

Vì vậy cả hai lối của Sổ tay AI — trên Gemini Notebook và lối tra nhanh tại chỗ — đều theo một nguyên tắc: **có nguồn mới trả lời**. Kỹ thuật này thường được gọi là "gắn nguồn" (grounding), hay "truy hồi rồi mới sinh câu trả lời" (retrieval-augmented generation, viết tắt RAG). Hình dung một thư ký chỉ được phép trả lời bằng cách mở đúng trang luật và chỉ tay vào dòng đó.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 của Bộ Khoa học và Công nghệ hướng dẫn ứng dụng công nghệ số, AI hỗ trợ rà soát văn bản quy phạm pháp luật: AI là công cụ hỗ trợ phân tích, tổng hợp, cảnh báo, gợi ý; không được dùng AI để tự động đưa ra kết luận pháp lý có giá trị quyết định; kết quả AI phải truy xuất, kiểm chứng, đối chiếu được với căn cứ pháp lý; cán bộ có trách nhiệm phải kiểm tra, xác nhận trước khi dùng.
- Thông tư 05/2026/TT-BKHCN quy định Khung đạo đức trí tuệ nhân tạo quốc gia (hiệu lực 10/3/2026) áp dụng bắt buộc với cơ quan nhà nước sử dụng AI phục vụ quản lý nhà nước, dịch vụ công; con người giữ thẩm quyền quyết định cuối cùng.
:::

### 15.4.2. Ba bước: cắt đoạn, truy hồi, trả lời có trích dẫn

Ở lối tra nhanh tại chỗ, nguyên tắc ấy được viết thành ba bước trong lõi `src/lib/soTayAI.js`, một tệp logic thuần chạy và kiểm thử được bằng Node.

**Bước 1 — Cắt văn bản theo Điều, khoản.** Mỗi đoạn tự nó phải là một địa chỉ trích dẫn, như "Điều 12, khoản 2". Văn bản có từ hai chữ "Điều" đầu dòng trở lên mới được cắt theo Điều; một báo cáo nhắc "Điều 5" một lần không phải văn bản quy phạm, nên cắt theo đoạn văn. Điều dài quá 1.600 ký tự thì cắt tiếp theo khoản, nhãn ghi "Điều N, khoản M–K". Đoạn vụn dưới 120 ký tự được gộp vào đoạn trước, nhãn liệt kê đủ các điều có trong đoạn. Phần căn cứ ban hành trước Điều 1 giữ thành đoạn "Phần mở đầu".

**Bước 2 — Truy hồi đoạn liên quan.** Máy chấm điểm từng đoạn bằng thuật toán BM25, một cách chấm quen thuộc của các máy tìm kiếm. Nói theo lối văn phòng, nó có ba ý: từ khóa xuất hiện nhiều trong đoạn thì điểm cao, nhưng có mức bão hòa; từ hiếm trong cả sổ tay nặng điểm hơn từ gặp ở đâu cũng có; đoạn dài không được lợi chỉ vì dài. Cộng thêm cặp âm tiết với trọng số 2,6 (mục 15.2.4), và điểm thưởng khi tiêu đề của Điều khớp câu hỏi. Máy lấy tối đa 6 đoạn cao điểm nhất, bỏ đoạn có điểm dưới 15% điểm cao nhất, và chỉ tìm trong **đúng sổ tay đang hỏi**, không lẫn sang lĩnh vực khác.

**Bước 3 — Trả lời có trích dẫn.** Chỉ những đoạn ấy được gửi cho AI, đánh số [1] đến [6], kèm số hiệu, tên văn bản và nhãn Điều, khoản. Lời nhắc hệ thống có năm quy tắc bắt buộc: chỉ dựa vào các đoạn trích, tuyệt đối không dùng kiến thức pháp luật có sẵn; mỗi ý gắn số trích dẫn; không đủ căn cứ thì nói thẳng "Không tìm thấy căn cứ trong nguồn của sổ tay này." và gợi ý văn bản cần bổ sung; không bịa số hiệu, điều, khoản, ngày ban hành; các đoạn mâu thuẫn nhau thì nêu rõ và đề nghị kiểm tra hiệu lực. Câu trả lời luôn kết thúc bằng dòng "Lưu ý: nội dung trên chỉ để tham khảo, cần mở văn bản gốc để kiểm chứng."

Sau khi nhận câu trả lời, phần mềm dò ngược các số [n] ra thẻ nguồn bên phải; đoạn nào AI thực sự dẫn thì được tô đậm để người dùng mở xem nguyên văn. Câu trả lời quên gắn trích dẫn thì giao diện tự treo cảnh báo vàng. Hai chi tiết kỹ thuật cũng phục vụ nguyên tắc: việc truy hồi chạy ngay trên trình duyệt nên máy chủ chỉ nhận vài đoạn đã chọn; và nếu không có đoạn nào hợp thì phần mềm báo lỗi **trước khi** trừ lượt, không gọi AI — vừa đỡ tốn, vừa đúng "không có nguồn thì không trả lời".

::: {.vidu}
**Ví dụ minh họa — hình dạng một câu trả lời đạt yêu cầu**

Cán bộ hỏi trong sổ tay ST-03: "Trình tự tổ chức một cuộc giám sát chuyên đề gồm các bước nào?". Một câu trả lời đạt yêu cầu có dạng:

- Bước thứ nhất … [1]; bước thứ hai … [1] [2].
- Nội dung báo cáo kết quả giám sát gồm … [3].
- Lưu ý: nội dung trên chỉ để tham khảo, cần mở văn bản gốc để kiểm chứng.

Bên phải, thẻ [1] ghi "[tên văn bản] — Điều [số], khoản [số]", bấm vào hiện nguyên văn đoạn đó. Nếu sổ tay chưa nạp văn bản nào nói về trình tự giám sát, câu trả lời đúng là "Không tìm thấy căn cứ trong nguồn của sổ tay này", chứ không phải một đoạn văn trôi chảy không có số nào.
:::

### 15.4.3. Danh mục nguồn là việc cần làm, không phải khẳng định pháp lý

Đây là chỗ tôi muốn người đọc dừng lại lâu nhất. Bộ khởi tạo của phân hệ có 21 nguồn gợi ý cho 6 sổ tay. Nhưng **mọi nguồn đều đặt sẵn ba trạng thái**: hiệu lực "Chưa xác định", kiểm tra "Chưa kiểm tra", và chưa xác nhận công khai. Không văn bản nào được nhúng sẵn nguyên văn. Nhiều nguồn còn cố ý chỉ ghi tên chung, như "Nghị quyết của UBTVQH hướng dẫn hoạt động giám sát của HĐND", kèm ghi chú "đối chiếu các nghị quyết hướng dẫn đang áp dụng". Danh mục ấy là **danh sách việc phải làm** của người phụ trách, không phải lời khẳng định của phần mềm.

Phần mềm có bốn trạng thái hiệu lực (Còn hiệu lực · Hết hiệu lực một phần · Hết hiệu lực · Chưa xác định) và ba trạng thái kiểm tra (Chưa kiểm tra · Đã kiểm tra – đạt · Loại khỏi sổ tay), kèm người kiểm tra và ngày kiểm tra. Chỉ con người, sau khi tra Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật, mới được chuyển trạng thái. Có bốn phép kiểm riêng chốt rằng bộ khởi tạo không tự gán hiệu lực cho bất kỳ văn bản nào.

Vì sao phải khắt khe đến vậy? Chỉ riêng các lĩnh vực của sáu sổ tay, năm 2026 đã có nhiều thay đổi:

- Luật Tiếp công dân số 42/2013/QH13 được sửa đổi, bổ sung bởi Luật số 136/2025/QH15, phần sửa đổi có hiệu lực từ 01/7/2026. Nghị quyết 116/2025/UBTVQH15 ngày 24/12/2025 về tiếp công dân, xử lý đơn của Quốc hội, HĐND có hiệu lực từ 01/7/2026 (riêng Chương IV áp dụng từ 01/3/2026), thay thế Nghị quyết 759/2014/UBTVQH13. Sổ tay ST-04 nạp bản cũ là sai ngay từ gốc.
- Luật Hoạt động giám sát của Quốc hội và HĐND số 121/2025/QH15 có hiệu lực từ 01/3/2026. Khi soạn sách, ngay số hiệu các nghị quyết hướng dẫn, các nguồn thứ cấp chúng tôi có trong tay còn chưa thống nhất — chỉ Công báo mới trả lời được.
- Quy định 366-QĐ/TW ngày 30/8/2025 về kiểm điểm, đánh giá, xếp loại chất lượng vẫn là căn cứ của năm 2026, nhưng đã có Quy định 227-QĐ/TW ngày 19/10/2026 thay thế từ 01/01/2027. Một sổ tay về đánh giá, kiểm điểm sẽ phải cập nhật ngay đầu năm tới.
- Luật Ban hành văn bản quy phạm pháp luật số 64/2025/QH15, được sửa đổi bởi Luật số 87/2025/QH15, còn hiệu lực; nhưng một dự án luật mới dự kiến thay thế đang được trình. Sổ tay ST-05 cần người theo dõi.

::: {.ghinho}
**Ghi nhớ — máy không có thẩm quyền khẳng định hiệu lực**

Phần mềm chỉ ghi lại kết quả kiểm tra của con người: ai kiểm tra, ngày nào, kết luận gì. "Máy đề xuất – người quyết định" áp dụng cả cho chính dữ liệu nguồn của AI. Một sổ tay đẹp mà nguồn chưa kiểm tra hiệu lực thì chưa được phép đưa cho ai dùng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 15.3 — Dựng lõi tra cứu "có nguồn mới trả lời"**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi.
Bối cảnh: Cần lối tra cứu văn bản quy phạm có trích dẫn cho [tên sổ tay].
Nguyên văn văn bản do người dùng nạp; câu hỏi bằng tiếng Việt.
Việc: Viết một thư viện logic thuần (không gọi mạng) gồm: cắt văn bản
theo Điều/khoản (Điều dài cắt tiếp theo khoản, nhãn "Điều N, khoản M");
chấm điểm đoạn liên quan (giữ dấu, ranh giới từ, chấm cả cặp âm tiết);
dựng khối ngữ cảnh đánh số [1]..[n]; đọc ngược số trích dẫn trong câu
trả lời ra thẻ nguồn.
Ràng buộc:
- Lời nhắc cho AI cấm dùng kiến thức sẵn có, cấm bịa số hiệu/điều/khoản,
  buộc gắn [n], không đủ căn cứ thì nói "không tìm thấy trong nguồn".
- Không có đoạn nào thì KHÔNG gọi AI và KHÔNG trừ lượt.
- Không tự gán "còn hiệu lực" cho văn bản nào; mặc định "Chưa xác định".
Nghiệm thu: phép kiểm cho văn bản mẫu có 3 Điều; câu hỏi phải lấy đúng
Điều liên quan và không lấy nhầm sổ tay khác; câu trả lời thiếu [n]
phải bị cảnh báo. Trình phương án trước khi viết mã.
```
:::

## 15.5. Quy tắc sử dụng AI 9 điều và sổ cam kết

Công cụ tốt mà dùng sai cách thì vẫn gây hại. Cùng với sổ tay, tôi giao tác tử soạn một dự thảo "Quy tắc sử dụng trí tuệ nhân tạo trong tra cứu, hỏi đáp nghiệp vụ" gồm 9 điều. Đây là **dự thảo**: ô ngày ban hành và người ký để trống, chờ Chánh Văn phòng xem xét, ký ban hành. Việc ban hành chính là dòng thứ năm trong báo cáo thí điểm.

| Điều | Nội dung cốt lõi |
|---|---|
| 1. Phạm vi | Cán bộ Văn phòng, thành viên các Ban, đại biểu HĐND tỉnh khi tra cứu, hỏi đáp trong phạm vi thí điểm |
| 2. Chỉ nạp văn bản công khai | Không nạp tài liệu mật, tài liệu nội bộ, dự thảo chưa trình, thông tin cá nhân, thông tin về người khiếu nại, tố cáo |
| 3. Kiểm tra nguồn trước khi nạp | Đối chiếu số hiệu, ngày, cơ quan ban hành, tình trạng hiệu lực; ghi người và thời điểm kiểm tra |
| 4. Người dùng chịu trách nhiệm | Câu trả lời chỉ để tham khảo; phải mở văn bản gốc; không trích dẫn AI làm căn cứ pháp lý |
| 5. Bắt buộc có trích dẫn | Dẫn tới điều, khoản; không có căn cứ thì trả lời là không có thông tin |
| 6. Không quyết định thay con người | Không dùng AI để quyết định đánh giá cán bộ, kết luận giám sát, giải quyết khiếu nại, tố cáo, nhân sự |
| 7. Bảo mật tài khoản, nhật ký | Không chia sẻ tài khoản; không nhập thông tin cá nhân của người khác vào câu hỏi |
| 8. Phát hiện sai phải báo ngay | Đánh dấu câu hỏi "Cần sửa lại", báo Tổ công tác |
| 9. Tổ chức thực hiện | Tổ công tác chuyển đổi số của Văn phòng chủ trì, định kỳ báo cáo |

Chín điều chia thành bốn nhóm dễ nhớ: **đầu vào** (Điều 2, 3: nạp gì), **đầu ra** (Điều 4, 5: dùng câu trả lời thế nào), **thẩm quyền** (Điều 6: AI không quyết định thay ai) và **kỷ luật** (Điều 7, 8, 9: ai giữ, ai báo, ai chịu trách nhiệm). Trạng thái "Cần sửa lại" ở Điều 8 không phải hình thức: nó là cách để một trích dẫn sai không chìm mất trong ngân hàng câu hỏi.

::: {.phaply}
**Căn cứ pháp lý của các điều then chốt**

- *Điều 2.* Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ: không đưa lên chatbot AI dữ liệu thuộc danh mục bí mật nhà nước, thông tin nhạy cảm như dữ liệu cá nhân, tài liệu nội bộ. Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực 01/3/2026), Điều 5, cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet (trừ trường hợp theo pháp luật về cơ yếu); khoản 10 Điều 5 cấm sử dụng hệ thống AI để xâm phạm bí mật nhà nước. Luật Tố cáo số 25/2018/QH14 (được sửa đổi, bổ sung bởi Luật số 136/2025/QH15), Điều 8, cấm tiết lộ thông tin làm lộ danh tính người tố cáo. Luật Tiếp cận thông tin số 01/2026/QH16 (hiệu lực 01/9/2026), Điều 15, liệt kê các nhóm thông tin công dân không được tiếp cận, trong đó có thông tin thuộc bí mật nhà nước, tài liệu soạn thảo cho công việc nội bộ, dữ liệu cá nhân.
- *Điều 4, 5.* Hướng dẫn kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: thông tin, sản phẩm do AI tạo ra phải được cán bộ, đảng viên kiểm chứng, thẩm định, chỉnh sửa và chịu trách nhiệm hoàn toàn trước khi sử dụng; cùng Công văn 2766/BKHCN-TTCNTT đã nêu ở mục 15.4.
- *Điều 6.* Khoản 2 Điều 4 Luật Trí tuệ nhân tạo số 134/2025/QH15.
- *Điều 7.* Công văn 557/BKHCN-CĐSQG: tránh tạo tài khoản chatbot có tên hoặc mật khẩu trùng tài khoản công vụ; cơ quan quản lý, bảo mật tài khoản; thu hồi hoặc hủy khi cán bộ nghỉ việc, chuyển công tác.

Người đọc nên tra nguyên văn các văn bản trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi áp dụng.
:::

Điều 7 đặt ra một việc lãnh đạo phải quyết. Hướng dẫn trong phân hệ cho phép cán bộ đăng nhập bằng tài khoản Google cá nhân hoặc tài khoản do cơ quan cấp. Công văn 557 lại dặn tách tài khoản AI khỏi tài khoản công vụ và có cơ chế thu hồi. Cơ quan nên ghi rõ trong văn bản ban hành: dùng loại tài khoản nào, ai quản lý danh sách người được chia sẻ, và gỡ quyền xem ra sao khi có người chuyển công tác.

Tab "Quy tắc dùng AI" còn có **sổ cam kết**: cán bộ đọc quy tắc rồi ghi tên xác nhận. Sổ này là bằng chứng để Tổ công tác biết ai đã được phổ biến quy tắc, và cũng là một nhịp dừng nhỏ để người dùng đọc kỹ chín điều trước lần hỏi đầu tiên. Mẫu Quy tắc và mẫu cam kết dùng làm tài liệu tham khảo được in ở Phụ lục 4; mỗi cơ quan tự điều chỉnh và tự ban hành.

## 15.6. Hướng dẫn tự lập một sổ tay NotebookLM cho Ban của mình

### 15.6.1. Ba câu hỏi trước khi bắt đầu

Trước khi mở máy, hãy trả lời ba câu. *Sổ tay phục vụ ai, cho việc gì?* Chọn hẹp: một lĩnh vực, một quy trình, chẳng hạn "thẩm tra dự thảo nghị quyết về ngân sách". *Nguồn nào là chính thống và đã công khai?* Văn bản quy phạm đã đăng Công báo, nghị quyết đã thông qua và công bố, quy chế đã ban hành. *Ai chịu trách nhiệm kiểm tra hiệu lực và cập nhật?* Phải là một người cụ thể, có tên trong danh mục nguồn. Thiếu câu trả lời thứ ba thì chưa nên bắt đầu.

### 15.6.2. Mười bước lập sổ tay

::: {.thuchanh}
**Thực hành — lập một sổ tay cho Ban hoặc phòng**

1. Lập bảng danh mục nguồn gồm các cột: số hiệu, tên văn bản, cơ quan ban hành, ngày ban hành, tình trạng hiệu lực, đã công khai chưa, người kiểm tra, ngày kiểm tra.
2. Tra từng văn bản trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo. Văn bản đã được sửa đổi, bổ sung thì ưu tiên văn bản hợp nhất. Chưa chắc thì để "Chưa xác định", không đoán.
3. Loại ngay khỏi danh mục: tài liệu mật, tài liệu nội bộ, dự thảo chưa trình, văn bản có thông tin cá nhân, mọi hồ sơ đơn thư.
4. Lấy bản điện tử gốc có lớp chữ. Tránh tệp PDF chụp (scan): máy không đọc được chữ trong ảnh, trích dẫn sẽ hỏng.
5. Đăng nhập `notebook.google.com` bằng loại tài khoản cơ quan quy định; tạo một notebook, đặt tên trùng mã và tên sổ tay, ví dụ "ST-03 Hoạt động giám sát".
6. Nạp các văn bản đã kiểm tra, mỗi văn bản một nguồn; chọn ngôn ngữ đầu ra tiếng Việt nếu cần.
7. Viết khoảng 9 câu hỏi mẫu bằng ngôn ngữ của người đi tra. Hỏi thử từng câu, bấm từng số trích dẫn, đối chiếu văn bản gốc. Chỉ câu nào đúng mới đánh dấu "Đã đối chiếu nguồn".
8. Chia sẻ cho cán bộ theo quyền **Người xem**, để họ hỏi được nhưng không thêm, sửa, xóa nguồn. Không coi kiểu liên kết chỉ hiện khung chat là cơ chế bảo mật: theo trợ giúp của Google, kiểu này không thu hồi quyền truy cập.
9. Dán địa chỉ notebook vào ô liên kết của sổ tay trong phân hệ; tích "Đã nạp lên NotebookLM" cho từng nguồn đã tải lên.
10. Hướng dẫn cán bộ bốn bước: đăng nhập tài khoản của mình → mở sổ tay được chia sẻ → hỏi bằng tiếng Việt, bấm số trích dẫn → mở văn bản gốc kiểm chứng trước khi dùng. Ghi ngày hướng dẫn. Khi có văn bản sửa đổi, thay thế, hết hiệu lực, cập nhật cả notebook lẫn danh mục.
:::

### 15.6.3. Hỏi thế nào cho đúng tinh thần sổ tay

Gemini Notebook vốn trả lời dựa trên nguồn đã nạp và có trích dẫn. Dù vậy, một câu hỏi có ràng buộc rõ ràng vẫn cho kết quả dễ kiểm chứng hơn, nhất là khi các nguồn có chỗ chồng lấn.

::: {.lenhmau}
**Câu lệnh mẫu 15.4 — Hỏi có ràng buộc trong sổ tay**

```text
Vai: Trợ lý tra cứu văn bản của [tên Ban/phòng].
Việc: Trả lời câu hỏi: [câu hỏi].
Ràng buộc:
- Chỉ dựa vào các nguồn trong sổ tay này; không dùng hiểu biết bên ngoài.
- Mỗi ý ghi rõ tên văn bản và điều, khoản; không có căn cứ thì nói
  "Không tìm thấy trong nguồn của sổ tay".
- Nếu hai nguồn quy định khác nhau, nêu cả hai và nói rõ chỗ khác.
Dạng: gạch đầu dòng, không quá 300 từ, kết thúc bằng danh sách các
điều, khoản cần mở văn bản gốc để kiểm chứng.
```
:::

::: {.lenhmau}
**Câu lệnh mẫu 15.5 — Rà một câu hỏi mẫu trước khi đánh dấu "Đã đối chiếu"**

```text
Tôi đang đối chiếu câu hỏi mẫu: [câu hỏi].
Câu trả lời trước đó của sổ tay là: [dán câu trả lời].
Hãy làm ba việc, chỉ dựa trên nguồn trong sổ tay:
1. Với từng ý, trích nguyên văn câu trong nguồn làm căn cứ.
2. Chỉ ra ý nào không tìm được câu nguyên văn tương ứng.
3. Liệt kê văn bản nào trong nguồn có ngày ban hành, hiệu lực cần
   tôi kiểm tra lại trên Công báo.
Không sửa lại câu trả lời; chỉ báo cáo chỗ khớp và chỗ chưa khớp.
```
:::

::: {.canhbao}
**Cảnh báo — khi nào không dùng sổ tay trên dịch vụ bên ngoài**

Nguồn tải lên Gemini Notebook được lưu trên máy chủ của Google. Lối tra nhanh trong phân hệ cũng gửi đoạn trích tới dịch vụ AI và dữ liệu sổ tay được mở đọc công khai. Vì vậy cả hai lối chỉ dành cho văn bản thuộc **vùng XANH** (Tập 1). Hồ sơ đơn thư, kiến nghị có tên người dân, dự thảo chưa trình, biên bản họp nội bộ, mọi tài liệu có độ mật đều không được nạp, kể cả "chỉ để thử". Những việc đó xử lý thủ công hoặc bằng AI chạy nội bộ, ngắt mạng, theo đúng quy định của cơ quan.
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Bản tin pháp luật cho thấy không phải việc gì cũng cần AI; việc có quy tắc cố định nên giao cho một chương trình nhỏ, rẻ và dễ kiểm chứng.
- Sổ tay AI có giá trị ở **trích dẫn kiểm chứng được**, không ở câu trả lời trơn tru. Hãy hỏi người trình: "nguồn đã được ai kiểm tra hiệu lực, ngày nào?".
- Ba quyết định thuộc về lãnh đạo: ký ban hành Quy tắc sử dụng AI; chọn loại tài khoản và cơ chế thu hồi quyền; giao đích danh người cập nhật nguồn của từng sổ tay.
- Chỉ tiêu "giảm ít nhất 30% thời gian tra cứu" cần phương pháp đo rõ ràng; con số ước lượng phải được ghi là ước lượng trong báo cáo.
:::

## Tóm tắt chương 15

::: {.tomtat}
1. Bản tin pháp luật hằng ngày chạy tại chỗ trên máy Văn phòng: đọc 5 kênh RSS chính thống, vẽ ảnh bằng Pillow, đẩy lên GitHub lúc 07:30; không khóa API, không token, không AI.
2. Tác vụ tự động cần chốt chặn: mất mạng không ghi đè, chưa đủ 5 tin mới không ra bản tin, không commit rỗng, chưa có ảnh thì ẩn khối; cùng ba thứ chạy bù, thử lại, nhật ký.
3. Kho lưu trữ chỉ giữ ảnh nhẹ trong 90 ngày theo lịch (khoảng 21 MB), vì đã tính trước dung lượng sau một năm.
4. Hai bẫy tiếng Việt — khớp chuỗi con và bỏ dấu — được chữa bằng giữ dấu, ranh giới từ, chấm điểm và chấm thêm cặp âm tiết; các ca lỗi thành phép kiểm hồi quy.
5. Nhiệm vụ Sổ tay AI có 06 sổ tay, 54 câu hỏi mẫu, 4 chỉ tiêu và 3 mốc (15/11, 25/11, 10/12/2026); đến 26/10/2026 đó vẫn là chỉ tiêu, chưa phải kết quả.
6. Hỏi đáp chạy trên Gemini Notebook (trước đây là NotebookLM) bằng tài khoản của từng người nên cơ quan không phát sinh kinh phí; phân hệ giữ danh mục nguồn, câu hỏi mẫu và báo cáo.
7. "Có nguồn mới trả lời": cắt theo Điều, khoản, truy hồi đúng sổ tay, bắt buộc trích dẫn; phần mềm không bao giờ tự gán hiệu lực cho văn bản.
8. Quy tắc 9 điều và sổ cam kết đặt ranh giới: chỉ văn bản công khai, kiểm chứng trước khi dùng, AI không quyết định thay con người.
:::

## Câu hỏi suy ngẫm và bài tập

1. Liệt kê ba việc lặp lại hằng ngày ở phòng hoặc Ban của đồng chí. Việc nào có quy tắc cố định, chỉ cần một chương trình nhỏ? Việc nào thật sự cần AI?
2. Dùng Câu lệnh mẫu 15.2, viết mười cặp từ dễ nhầm trong lĩnh vực đồng chí phụ trách. Có cặp nào mà bỏ dấu sẽ thành một?
3. Chọn một văn bản trong danh mục nguồn gợi ý của sổ tay gần với công việc của đồng chí. Tra tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật, ghi người kiểm tra, ngày kiểm tra.
4. Làm theo mục Thực hành ở 15.6.2 với ba văn bản công khai. Viết ba câu hỏi mẫu, dùng Câu lệnh mẫu 15.5 để rà từng câu.
5. Đồng chí sẽ đo chỉ tiêu "giảm ít nhất 30% thời gian tra cứu" bằng cách nào để con số đứng vững trước một Hội đồng thẩm định?
