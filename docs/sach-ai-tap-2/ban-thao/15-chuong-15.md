# Chương 15. Bản tin pháp luật tự động và Sổ tay AI có trích dẫn nguồn

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu cách một bản tin pháp luật hằng ngày được dựng hoàn toàn bằng chương trình, chạy theo lịch, không gọi AI.
- Nhận diện hai cái bẫy của tiếng Việt khi cho máy "đọc" văn bản và biết dặn tác tử AI lập trình tránh chúng.
- Nắm nhiệm vụ đột phá "Sổ tay AI" và lý do chọn NotebookLM (nay là Gemini Notebook).
- Hiểu nguyên tắc "có nguồn mới trả lời" và vì sao phần mềm không tự gán hiệu lực cho văn bản.
- Tự lập được một sổ tay hỏi đáp có trích dẫn cho Ban, phòng của mình.

Dành cho: cán bộ tham mưu thường xuyên tra cứu văn bản; Tổ công tác chuyển đổi số của Văn phòng; lãnh đạo các Ban, lãnh đạo Văn phòng cần quyết định cách tổ chức việc tra cứu bằng AI.
:::

Cán bộ tham mưu ở cơ quan dân cử sống giữa văn bản. Có hai câu hỏi lặp lại gần như hằng ngày: "Hôm nay có văn bản gì mới?" và "Nội dung này quy định ở điều nào, văn bản đó còn hiệu lực không?".

Chương này kể về hai công cụ trả lời hai câu hỏi ấy trong hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh (hdndthkpi.vercel.app): khối Bản tin pháp luật hằng ngày ở đầu Trang chủ, và phân hệ Sổ tay AI (`#/sotay`) thực hiện một nhiệm vụ đột phá Văn phòng đã đăng ký.

Hai công cụ đi theo hai hướng ngược nhau, và đó chính là bài học. Bản tin không dùng AI, vì việc của nó có quy tắc cố định. Sổ tay có dùng AI, nhưng AI bị trói chặt vào nguồn: không có đoạn văn bản làm căn cứ thì không được trả lời. Người tự làm ứng dụng nên đặt trước mỗi việc câu hỏi: "Việc này có thật sự cần AI không? Nếu cần, AI được phép nói đến đâu?".

Một lưu ý về tên gọi. Nhiệm vụ đăng ký và giao diện phân hệ dùng tên NotebookLM, công cụ mà Tập 1 đã giới thiệu ở mục 5.6 và Phụ lục C. Ngày 16/7/2026, Google đổi tên sản phẩm thành Gemini Notebook. Khi nói về nhiệm vụ và màn hình phân hệ, tôi giữ tên NotebookLM như văn bản gốc; khi nói về sản phẩm hiện hành, tôi viết "Gemini Notebook (trước đây là NotebookLM)".

## 15.1. Bản tin pháp luật hằng ngày: tự động mà không cần AI

### 15.1.1. Bài toán: mỗi sáng một tờ tin đúng nguồn

Tôi muốn ngay trên lưới phân hệ của Trang chủ có một tờ tin nhỏ: vài văn bản, chính sách mới của cả nước và của tỉnh, lấy từ kênh chính thống, cập nhật mỗi sáng, không ai phải ngồi cắt dán, không phát sinh chi phí.

Bốn ràng buộc: nguồn chính thống; không lặp tin hôm trước; lỡ hỏng thì không làm hỏng thứ đang có; xem bằng điện thoại hay trình đọc màn hình đều được. Sản phẩm là một ảnh khổ A4 ngang chia 6 thẻ: 5 thẻ tin cả nước và 1 thẻ tỉnh Thanh Hóa chứa tối đa ba tin; mỗi thẻ có nhãn, màu và hình vẽ theo chủ đề.

### 15.1.2. Lần thử đầu: giao cho một tác vụ AI trên đám mây

::: {.cauchuyen}
**Câu chuyện thực tế — "đã xong" nhưng chưa từng chạy**

Phương án đầu tiên của tôi là một tác vụ định kỳ của Claude chạy trên đám mây: mỗi ngày sinh một ảnh infographic rồi đẩy lên GitHub bằng một chuỗi khóa truy cập (token). Phía Trang chủ, tôi giao tác tử AI lập trình dựng sẵn khối hiển thị, chưa có ảnh thì tự ẩn, kèm một "hợp đồng" ở tệp `public/bantin/README.md` quy định tên tệp và cấu trúc chú thích.

Khối hiển thị làm đúng phần việc của nó, nhưng Trang chủ không bao giờ có ảnh. Một đợt rà soát quét toàn bộ 18 kho mã nguồn (repository) của tài khoản, không thấy ảnh bản tin nào: bước đẩy lên GitHub thiếu cấu hình, thiếu token nên chưa từng chạy được, trong khi ai cũng tưởng tác vụ vẫn chạy đều.

Giống như văn thư báo "đã gửi công văn" mỗi sáng, nhưng sổ chuyển phát không có dòng nào.
:::

Tôi rút ra hai bài học. Một: đừng tin báo cáo "đã chạy"; hãy kiểm sản phẩm ở chính nơi người dùng nhìn thấy. Hai: việc này có quy tắc cố định — lấy tin đúng nguồn, lọc, xếp vào khuôn — nên không cần mô hình AI. Muốn có tờ tin dán bảng mỗi sáng thì không cần thuê nhà báo, chỉ cần người cắt dán đúng nguồn theo mẫu; AI có ích ở vai người viết ra chương trình cắt dán ấy.

### 15.1.3. Thiết kế lại: dây chuyền bốn khâu chạy tại chỗ

Tôi chuyển hẳn bộ sinh bản tin về máy tính của Văn phòng, nơi công cụ `git` đã đăng nhập sẵn vào kho mã: bốn tệp Python trong thư mục `tools/bantin/`, khoảng 940 dòng, không khóa API, không token, không gọi AI.

| Tệp | Việc | Ví von |
|---|---|---|
| `tin.py` | Lấy tin, làm sạch, chọn lọc, chống trùng | Người đi lấy báo, đánh dấu bài |
| `poster.py` | Vẽ ảnh bằng thư viện Pillow | Người dàn trang |
| `chay.py` | Nối cả dây, lưu kho, đẩy lên GitHub | Người phát hành |
| `kiem_thu.py` | 42 phép kiểm, không cần mạng | Người đọc soát |

Nguồn tin là các kênh tin định kỳ dạng RSS (RSS feed) — như tờ tin vắn tòa soạn phát hành sẵn ở dạng máy đọc được: mỗi mục có tiêu đề, mô tả, đường dẫn, giờ đăng. Bộ sinh đọc năm kênh: `xaydungchinhsach.chinhphu.vn/rss`, `baochinhphu.vn/rss` và ba kênh của Báo Thanh Hóa (thời sự, pháp luật, kinh tế).

Mỗi lượt chạy đi qua tám bước:

1. Đọc năm kênh; kênh nào hỏng thì ghi nhật ký rồi đọc tiếp, không làm gãy cả lượt.
2. Lọc trùng với sổ `da-dua-tin.json` (giữ 200 tin gần nhất). Sổ khóa theo **tiêu đề**, vì cùng một tin đăng lại thường giữ tiêu đề nhưng đổi đường dẫn.
3. Ưu tiên tin có một trong 25 từ khóa pháp luật như nghị định, thông tư, nghị quyết, hiệu lực, ban hành, phê duyệt; chọn 5 tin cả nước và tối đa 3 tin của tỉnh.
4. Đoán chủ đề từng tin để chọn màu và hình minh họa (mục 15.2).
5. Vẽ ảnh; lưu bản gốc PNG khoảng 1 MB và một ảnh nhẹ JPG khoảng 200 KB.
6. Ghi tệp chú thích `moi-nhat.json` chứa danh sách tin **dạng chữ**, vì trình đọc màn hình và máy tìm kiếm không đọc được chữ trong ảnh.
7. Chép một bản vào kho lưu trữ theo ngày, dọn bản quá cũ.
8. Tạo một lần lưu thay đổi (commit), đẩy lên nhánh chính; Vercel tự triển khai lại sau 1–2 phút.

Lịch chạy giao cho Task Scheduler của Windows lúc 07:30 hằng ngày; tôi chỉ coi là xong khi đã chạy thật và mở trang thật thấy ảnh đúng ngày. Phía Trang chủ, khối bản tin chia hai cột — ảnh bên trái, danh sách tin dạng chữ bên phải — chiều cao ảnh bị chặn để không đẩy lưới phân hệ khỏi màn hình đầu, bản tin cũ quá ba ngày thì tự gắn nhãn.

### 15.1.4. Những chốt chặn để "tự động" không thành "tự hỏng"

Chương trình chạy một mình lúc 7 giờ 30 phải được dạy trước cách cư xử khi gặp chuyện. Tôi giao tác tử liệt kê từng tình huống xấu, rồi viết thành mã và phép kiểm.

| Tình huống | Chương trình làm gì |
|---|---|
| Mất mạng, không đọc được kênh nào | Dừng lại, **không ghi đè** bản tin cũ |
| Chưa đủ 5 tin mới so với lần trước | Không ra bản tin hôm đó |
| Không có tin mới của tỉnh | Thẻ tỉnh lấy tin gần nhất, ghi cảnh báo vào nhật ký |
| Nội dung không đổi | Không tạo lần lưu thay đổi rỗng |
| Trang chủ chưa có ảnh | Ẩn hẳn khối bản tin, không hiện khung ảnh vỡ |

Chốt cuối có một chi tiết đáng kể. Máy chủ của ứng dụng một trang thường trả mã 200 ("có") cho cả tệp không tồn tại — như lễ tân hỏi "có ông A không?" luôn đáp "dạ có" rồi dẫn khách vào phòng trống. Vì vậy Trang chủ không chỉ hỏi "có tệp không" mà kiểm thêm loại nội dung: phải đúng là ảnh mới hiện.

Sau đó tôi bổ sung chức năng xem lại bản tin những ngày trước, và **tính trước dung lượng sau một năm**: mỗi ngày một ảnh gốc 1 MB thì một năm đã hơn 400 MB nằm trong kho mã — mà kho mã là tủ hồ sơ, không phải nhà kho. Vì vậy kho lưu trữ chỉ giữ ảnh nhẹ của 90 ngày gần nhất (khoảng 21 MB), tính theo **lịch** chứ không theo số tệp.

Đến ngày 26/10/2026, kho có 36 ngày để chọn xem lại. Có những ngày vắng bản tin; tôi không lấp chỗ trống, vì thiếu một ngày vẫn hơn một tờ tin lặp tin cũ.

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

Sáng 10/9/2026, Trang chủ không có bản tin mới, cũng không có thông báo lỗi nào vì tác vụ chạy ngầm. Rà lại cấu hình, tôi tìm ra hai nguyên nhân. Thứ nhất, tác vụ được đặt điều kiện "chỉ chạy khi có mạng"; máy vừa bật, Windows chưa kịp kết luận là có mạng nên hủy luôn lượt chạy. Thứ hai, tác vụ chỉ có một mốc 07:30; máy không bật đúng lúc đó là mất cả ngày.

Giống như dặn bảo vệ "7 giờ 30 có điện thì kéo cờ". Hôm ấy điện chập chờn, bảo vệ thôi không kéo, và không ai biết vì sao.
:::

Cách sửa: bỏ điều kiện mạng (chương trình đã tự xử lý mất mạng); thêm mốc chạy khi đăng nhập, trễ 3 phút cho mạng kịp lên, và chạy bù khi máy bật muộn; lỡ hỏng thì tự thử lại 3 lần, cách nhau 10 phút; mọi thông điệp ghi vào tệp nhật ký. Bài học gói lại thành ba chữ: **chạy bù, thử lại, nhật ký** — thiếu một trong ba, tác vụ tự động sẽ có ngày "lặng lẽ không chạy".

Cũng phải thật thà về một chỗ chưa khớp: quy tắc dự án cấm đặt kho mã trong OneDrive (mục 7.3), nhưng đoạn lệnh đăng ký tác vụ trong hướng dẫn của bộ sinh vẫn trỏ tới một thư mục OneDrive. Quy tắc ghi ra giấy mà máy không tự kiểm thì sớm muộn sẽ bị vi phạm.

### 15.1.6. Cách tôi giao việc cho tác tử AI lập trình

Câu lệnh dưới đây tái dựng theo tinh thần những gì tôi đã giao, gom lại một lần; thực tế tôi giao từng phần, nghiệm thu xong mới sang phần sau. Câu lệnh theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2), thêm dòng "Nghiệm thu" — phần mở rộng của Tập 2 (mục 6.2).

::: {.lenhmau}
**Câu lệnh mẫu 15.1 — Dựng bộ sinh bản tin chạy tại chỗ, không dùng AI**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi, trên máy Windows.
Bối cảnh: Trang chủ đã có khối bản tin đọc 3 tệp cố định trong
public/bantin/ (xem public/bantin/README.md). Tác vụ đám mây cũ chưa
đẩy được ảnh nào.
Việc: Viết bộ sinh bản tin pháp luật hằng ngày bằng Python trong
tools/bantin/: đọc các kênh RSS [danh sách địa chỉ]; lọc trùng theo
tiêu đề; ưu tiên tin có từ khóa pháp luật, chọn 5 tin cả nước, tối đa
3 tin của tỉnh; vẽ ảnh A4 ngang bằng Pillow, đủ dấu; ghi ảnh gốc, ảnh
nhẹ và tệp chú thích dạng chữ; commit rồi push bằng git của máy.
Dạng: tên hàm, thông điệp bằng tiếng Việt có dấu; ghi nhật ký ra tệp.
Ràng buộc: không khóa API, không token, không gọi AI. Chỉ MỘT hàm được
chạm tới mạng. Mất mạng thì dừng và KHÔNG ghi đè bản tin cũ. Chưa đủ
5 tin mới thì không ra bản tin. Nội dung không đổi thì không commit.
Không đụng tệp nào khác.
Nghiệm thu: bộ kiểm thử không cần mạng đều đạt; chạy thử không đẩy ra
ảnh đúng 6 thẻ; có hướng dẫn đăng ký tác vụ Windows 07:30 kèm chạy bù,
thử lại, nhật ký. Trình phương án trước khi viết mã.
```
:::

Dòng "chỉ một hàm được chạm tới mạng" tách phần "tính" khỏi phần "đi lại", nên hàng chục phép kiểm chạy trong vài giây không cần mạng — mẹo giúp người không chuyên nghiệm thu được.

::: {.canhbao}
**Cảnh báo — bản tin là tin báo, không phải văn bản**

Tin trên báo, trên cổng thông tin chỉ để biết "có gì mới". Trước khi dẫn một văn bản vào tờ trình, báo cáo hay bài phát biểu, phải tra nguyên văn trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật. Bản tin chỉ dùng tiêu đề tin và ghi rõ nguồn, không chép nguyên bài của cơ quan báo chí. Kho mã của dự án là công khai: chỉ đẩy ảnh bản tin và chú thích, không bao giờ đẩy khóa bí mật hay tài liệu nội bộ.
:::

### 15.1.7. Nếu đồng chí muốn làm phiên bản nhỏ hơn

Một phòng hay một Ban không cần ảnh infographic. Một công cụ nhỏ cỡ Bậc 1–2 của thang kiến tạo (mục 2.3) là đủ: một tệp Python đọc vài kênh RSS chính thống, lọc theo từ khóa của lĩnh vực mình, ghi ra tệp "Danh sách tin ngày …" có đường dẫn gốc vào thư mục chung; Task Scheduler chạy nó mỗi sáng. Khi giao việc, giữ ba ràng buộc của bản đầy đủ (không ghi đè khi mất mạng, không ra tệp khi thiếu tin mới, luôn ghi nhật ký) và dặn thêm: "so khớp từ khóa có dấu, theo ranh giới từ" — mục sau giải thích vì sao.

## 15.2. Hai cái bẫy của tiếng Việt khi máy "đọc" tin

Để chọn màu và hình minh họa, bộ sinh phải xếp từng tin vào một trong sáu nhóm chủ đề (Thiên tai, ứng phó · Tổ chức bộ máy · An ninh, trật tự · Tài chính, ngân sách · An sinh xã hội · Hạ tầng, giao thông), không khớp thì về nhóm "Chỉ đạo, điều hành". Bản đầu tiên làm theo lối quen thuộc: có từ khóa thì nhận, khớp nhóm nào trước thì lấy nhóm đó. Chỉ vài ngày đã lộ ra hai lỗi rất "tiếng Việt".

### 15.2.1. Bẫy thứ nhất: khớp chuỗi con

Tin "Phòng thủ dân sự quốc gia" bị gán chủ đề Tài chính. Lý do: chuỗi "quốc gia" chứa âm tiết "gia"; khi bỏ dấu để so, "gia" trùng với từ khóa "giá" của nhóm Tài chính. Máy chỉ hỏi "chuỗi này có nằm đâu đó trong tiêu đề không?", chứ không hỏi "đó có phải một từ đứng riêng không?" — như tra sổ tìm người tên "An" mà ra cả "Thanh", "Tuấn Anh" chỉ vì có chữ "an" nằm bên trong. Cùng họ lỗi này từng gặp ở phân hệ Kiểm điểm: chuỗi "trưởng ban" nằm gọn trong "phó trưởng ban", xét sai thứ tự thì Phó Trưởng Ban nhận nhầm mẫu của Trưởng Ban (mục 10.3).

### 15.2.2. Bẫy thứ hai: bỏ dấu để so cho "tiện"

Bỏ dấu trước khi so là thói quen của người lập trình, để gõ có dấu hay không dấu cũng tìm ra. Nhưng tiếng Việt bỏ dấu thì "báo" và "bão" cùng thành "bao", nên tin "họp báo thường kỳ" bị nhận là tin bão và mang màu cảnh báo thiên tai. Nguồn chính thống luôn viết đủ dấu, nên so khớp có dấu vừa đúng hơn, vừa không mất gì.

### 15.2.3. Cách chữa: giữ dấu, khớp theo ranh giới từ, chấm điểm

Bản sửa thay đổi ba chỗ:

- **Giữ nguyên dấu** khi so từ khóa.
- **Khớp theo ranh giới từ**: chỉ nhận khi hai đầu từ khóa không dính liền chữ cái hay chữ số khác.
- **Chấm điểm thay vì lấy kết quả khớp đầu tiên**: từ khóa trong tiêu đề được 3 điểm, trong mô tả được 1 điểm; nhóm nhiều điểm nhất thắng.

Bỏ dấu vẫn có chỗ dùng: so trùng cả một tiêu đề dài (chống trùng tin), hay ô tìm kiếm gõ nhanh trên giao diện; chỉ không được dùng khi chấm điểm từng từ khóa ngắn. Cả hai ca lỗi được giữ lại làm phép kiểm hồi quy ở bộ kiểm thử của bản tin lẫn của Sổ tay AI, để không tái phát.

::: {.vidu}
**Ví dụ minh họa — cùng một tin, hai cách chấm**

Giả sử tin có tiêu đề "Chính phủ họp báo thường kỳ, thông tin về điều chỉnh tiền lương", phần mô tả có cụm "người lao động".

- *Cách cũ* (bỏ dấu, lấy nhóm khớp đầu tiên): "họp báo" thành "hop bao", trùng từ khóa "bão"; nhóm Thiên tai đứng đầu danh sách nên thắng ngay. Sai.
- *Cách mới* (giữ dấu, ranh giới từ, chấm điểm): nhóm Thiên tai 0 điểm; "tiền lương" trong tiêu đề cho nhóm An sinh xã hội 3 điểm, "lao động" trong mô tả thêm 1 điểm. An sinh xã hội thắng với 4 điểm. Đúng.
:::

### 15.2.4. Tiếng Việt là ngôn ngữ âm tiết: chấm cả cặp âm tiết

Bài học thứ ba đến khi làm lối tra nhanh của Sổ tay AI. Tiếng Việt viết rời từng âm tiết, mà một âm tiết đứng riêng thường gần như vô nghĩa: "giám", "sát", "chuyên", "đề". Hỏi "giám sát chuyên đề" mà máy chỉ chấm từng âm tiết thì đoạn nói về "giám đốc" hay "chuyên viên" cũng được điểm.

Cách chữa: ngoài âm tiết đơn, máy chấm thêm **từng cặp âm tiết liền nhau** ("giám sát", "sát chuyên", "chuyên đề"), mỗi cặp nặng gấp 2,6 lần một âm tiết đơn. Đoạn có "giám đốc" chỉ khớp một âm tiết "giám"; đoạn nói đúng về giám sát chuyên đề khớp thêm hai cặp nên vượt lên rõ rệt.

Đặc điểm ngôn ngữ như vậy là tri thức nghiệp vụ người làm văn bản hiểu rõ hơn AI. Đừng chờ AI tự nghĩ ra; hãy nói cho nó.

::: {.lenhmau}
**Câu lệnh mẫu 15.2 — Bắt tác tử kiểm thử bằng các cặp từ dễ nhầm**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi.
Bối cảnh: Hàm [tên hàm] chấm điểm văn bản tiếng Việt theo từ khóa;
nguồn văn bản luôn viết đủ dấu.
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

Văn phòng đã đăng ký một nhiệm vụ đột phá tại Trục 3, Mục V.5(4) của Đề án, nguyên văn: *"Thí điểm hỏi đáp, tra cứu bằng trí tuệ nhân tạo (NotebookLM) về các lĩnh vực của cơ quan dân cử: xây dựng các sổ tay AI theo lĩnh vực để cán bộ, công chức Văn phòng, các Ban và đại biểu chat, hỏi đáp, tra cứu có trích dẫn nguồn"*. Nhiệm vụ giao trách nhiệm "chủ trì chọn, kiểm tra nguồn văn bản chính thống, còn hiệu lực", kèm hai điều kiện: chỉ dùng văn bản công khai, không mật; cơ quan không phát sinh kinh phí.

Phân hệ Sổ tay AI được dựng xong ngày 22/10/2026, gánh hai vai. Vai thứ nhất là **cổng vào**: cán bộ bấm một nút để mở đúng sổ tay của lĩnh vực mình. Vai thứ hai là **bộ quản lý thí điểm**, giữ mọi thứ nhiệm vụ cần để báo cáo: nguồn đã kiểm tra, câu hỏi mẫu, quy tắc, danh sách đã hướng dẫn, phép đo thời gian. Giao diện có 8 tab xếp theo đường đi của người dùng, từ Tổng quan, Sổ tay trên NotebookLM đến Báo cáo.

### 15.3.2. Sáu sổ tay theo lĩnh vực

| Mã | Sổ tay | Người dùng chính |
|---|---|---|
| ST-01 | Tổ chức và hoạt động của HĐND | Đại biểu, Thường trực, Văn phòng |
| ST-02 | Kỳ họp và công tác thẩm tra | Các Ban, Phòng Công tác HĐND |
| ST-03 | Hoạt động giám sát | Thường trực, các Ban, Tổ đại biểu |
| ST-04 | Dân nguyện, khiếu nại và tố cáo | Thường trực, Ban Pháp chế, phòng dân nguyện |
| ST-05 | Nghị quyết của HĐND tỉnh | Các Ban, Văn phòng, cơ quan trình |
| ST-06 | Đánh giá, xếp loại cán bộ, công chức | Toàn thể cán bộ Văn phòng |

Mỗi sổ tay có sẵn 9 câu hỏi mẫu (tổng 54 câu) và 4–5 nguồn gợi ý (tổng 21 nguồn). Câu hỏi viết bằng ngôn ngữ của người đi tra, chẳng hạn "Nghị quyết của HĐND tỉnh được thông qua khi có bao nhiêu đại biểu tán thành?" (ST-02) hay "Người tố cáo được bảo vệ như thế nào theo quy định của pháp luật?" (ST-04). Mọi câu đặt sẵn ở trạng thái "Chưa đối chiếu nguồn"; chỉ khi cán bộ đã hỏi thử, mở văn bản gốc đối chiếu từng trích dẫn và chuyển sang "Đã đối chiếu nguồn" thì câu mới được tính vào chỉ tiêu.

### 15.3.3. Bốn chỉ tiêu, ba mốc và cách đo cho trung thực

| Chỉ tiêu đăng ký | Phần mềm đếm thế nào |
|---|---|
| 06 sổ tay theo lĩnh vực | "Xong" khi đã gắn notebook, có nguồn đã kiểm tra và đã nạp, có câu hỏi mẫu đã đối chiếu |
| Ít nhất 50 câu hỏi mẫu | Chỉ đếm câu ở trạng thái "Đã đối chiếu nguồn" |
| 100% cán bộ, công chức Văn phòng được hướng dẫn | Số người có ngày hướng dẫn trên tổng số |
| Thời gian tra cứu giảm ít nhất 30% | So thời gian tra bằng sổ tay với số phút nếu tra thủ công |

Báo cáo đánh giá có thêm dòng thứ năm: Quy tắc sử dụng AI đã được ban hành hay chưa. Ba mốc thời gian: sổ tay và câu hỏi mẫu trước 15/11/2026; hướng dẫn cán bộ trước 25/11/2026; báo cáo đánh giá trước 10/12/2026. Báo cáo xuất ra Word kèm danh mục nguồn và ngân hàng câu hỏi.

Tại thời điểm viết (26/10/2026), các con số trên vẫn là **chỉ tiêu**, chưa phải kết quả. Riêng chỉ tiêu thời gian, cách đo có hai giới hạn: số phút "nếu tra thủ công" do người tra **ước lượng**, không phải bấm giờ thật; và phép đo tự động chỉ ghi được ở lối tra nhanh trong phân hệ, hỏi trên Gemini Notebook thì phải ghi tay. Muốn con số đứng được, nên đo trước – đo sau trên cùng một bộ câu hỏi, do vài người làm, và ghi rõ phương pháp đo trong báo cáo (xem thêm mục 17.4 về đo hiệu quả trung thực).

### 15.3.4. Vì sao chọn NotebookLM — nay là Gemini Notebook

Ngày 22/10/2026, phân hệ đi qua hai bản. Bản đầu là một lối tra cứu riêng hoàn chỉnh: nạp nguyên văn văn bản vào phân hệ, máy tự tìm đoạn liên quan rồi nhờ AI trả lời có trích dẫn (mục 15.4), có 120 phép kiểm đạt. Nhưng nó dùng chung khóa AI và chung hạn mức với phân hệ Trợ lý AI (khách 1 lượt, người đăng nhập 5 lượt mỗi ngày — mục 13.3). Hạn mức ấy không đủ cho cả cơ quan hỏi hằng ngày, còn nới ra thì phát sinh tiền.

Tôi chốt định hướng: hỏi đáp chạy trên NotebookLM. Mỗi sổ tay là một notebook do Văn phòng lập và chia sẻ; cán bộ tự đăng nhập tài khoản Google của mình để mở. Ba lý do: công cụ trả lời dựa trên nguồn đã nạp, kèm trích dẫn đánh số bấm vào là xem được đoạn gốc; mỗi người dùng tài khoản riêng nên hạn mức tính theo từng người; và cơ quan không phát sinh kinh phí, đúng ghi chú của nhiệm vụ.

Phân hệ vì thế chuyển thành cổng vào cộng bộ quản lý. Nạp nguyên văn vào phân hệ hạ xuống thành **tùy chọn**, chỉ phục vụ lối "Tra nhanh tại chỗ" làm dự phòng; "sổ tay xong" tính theo notebook. Bộ kiểm thử tăng lên 147 phép kiểm.

::: {.cauchuyen}
**Câu chuyện thực tế — giả định của AI đã lỗi thời**

Khi tôi đưa đường dẫn một notebook để gắn vào phân hệ, tác tử AI lập trình không tin vào trí nhớ của nó mà mở thử đường dẫn thật: địa chỉ cũ `notebooklm.google.com` trả mã chuyển hướng 301 về `notebook.google.com`. Hiểu biết sẵn có của AI đã lỗi thời.

Tác tử viết hàm chuẩn hóa địa chỉ: nhận cả hai tên miền, nhận cả khi chỉ dán mã notebook trần, luôn lưu về tên miền hiện hành, gặp tên miền lạ thì từ chối và nêu đúng dạng cần dán (13 phép kiểm riêng). Hướng dẫn ghi rõ: mở liên kết khi chưa đăng nhập sẽ bị đưa sang trang đăng nhập của Google — đó là hành vi đúng, không phải lỗi.
:::

Dữ kiện về sản phẩm, tính đến tháng 10/2026: ngày 16/7/2026, Google đổi tên NotebookLM thành Gemini Notebook, notebook và nguồn cũ được giữ nguyên. Theo một nguồn bên thứ ba, địa chỉ `notebook.google.com` hoạt động từ cuối tháng 7/2026 và địa chỉ cũ `notebooklm.google.com` (Tập 1 còn ghi địa chỉ này) tự chuyển hướng từ khoảng 01/8/2026, nên liên kết đã chia sẻ vẫn mở được. Từ 02/9/2026, Google bỏ hạn mức cố định theo ngày, chuyển sang hạn mức theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ và có trần theo tuần; vì vậy sách không ghi "mỗi ngày hỏi được bao nhiêu câu". Đây là thông tin tham khảo tại thời điểm viết (10/2026), có thể thay đổi; tình huống dịch vụ đổi địa chỉ được bàn thêm ở mục 19.5.

Chọn nền tảng có sẵn thì nhận luôn giới hạn của nó: nguồn tải lên nằm trên máy chủ của Google nên chỉ nạp văn bản công khai; cơ quan phải có hướng dẫn về tài khoản (mục 15.5); nền tảng có thể đổi tên, địa chỉ, hạn mức bất cứ lúc nào. Cách phòng của tôi là giữ phần "trí tuệ của cơ quan" — danh mục nguồn, kết quả kiểm tra hiệu lực, ngân hàng câu hỏi đã đối chiếu — trong phân hệ của Văn phòng. Mai này chuyển sang nền tảng khác — chẳng hạn các nền tảng AI dùng chung quốc gia mà Quyết định 1671/QĐ-TTg ngày 28/8/2026 về Chiến lược quốc gia về trí tuệ nhân tạo đặt mục tiêu xây dựng — thì công sức kiểm tra nguồn không mất.

## 15.4. Nguyên tắc "có nguồn mới trả lời"

### 15.4.1. Vì sao không cho AI trả lời bằng trí nhớ

Tập 1 đã cảnh báo AI có thể bịa thông tin (mục 1.5), không biết các quy định mới nhất (mục 1.3), và xếp "bịa số hiệu văn bản" vào ba lỗi nặng nhất khi AI viết văn bản hành chính (mục 4.7). Với tra cứu pháp luật, một câu trả lời trơn tru mà dẫn sai điều, sai khoản, hoặc dẫn văn bản đã hết hiệu lực thì nguy hiểm hơn là không trả lời, vì người đọc tin nó.

Vì vậy cả hai lối của Sổ tay AI — trên Gemini Notebook và lối tra nhanh tại chỗ — đều theo một nguyên tắc: **có nguồn mới trả lời**. Tập 1 đã giới thiệu kỹ thuật này dưới tên RAG — tạo sinh có truy xuất hỗ trợ (mục 5.6): tìm các đoạn liên quan trong thư viện tài liệu trước, rồi mới trả lời dựa trên các đoạn đó, có trích dẫn. Hình dung một thư ký chỉ được trả lời bằng cách mở đúng trang luật và chỉ tay vào dòng đó. Tác tử AI lập trình giúp tự xây hệ thống như vậy dễ hơn, nhưng bốn hạn chế Tập 1 đã nêu (phụ thuộc chất lượng thư viện, có thể "trộn" thông tin, vẫn phải kiểm chứng, phải cập nhật) vẫn còn nguyên.

::: {.phaply}
**Căn cứ pháp lý**

- Luật Trí tuệ nhân tạo số 134/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người".
- Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 của Bộ Khoa học và Công nghệ về ứng dụng AI hỗ trợ rà soát văn bản quy phạm pháp luật: không được dùng AI để tự động đưa ra kết luận pháp lý có giá trị quyết định; kết quả AI phải truy xuất, kiểm chứng, đối chiếu được với căn cứ pháp lý; cán bộ có trách nhiệm phải kiểm tra, xác nhận trước khi dùng.
- Thông tư 05/2026/TT-BKHCN về Khung đạo đức trí tuệ nhân tạo quốc gia (hiệu lực 10/3/2026), bắt buộc với cơ quan nhà nước dùng AI phục vụ quản lý nhà nước: con người giữ thẩm quyền quyết định cuối cùng.
:::

### 15.4.2. Ba bước: cắt đoạn, truy hồi, trả lời có trích dẫn

Ở lối tra nhanh tại chỗ, nguyên tắc ấy được viết thành ba bước trong lõi `src/lib/soTayAI.js`, một tệp logic thuần chạy và kiểm thử được bằng Node.

**Bước 1 — Cắt văn bản theo Điều, khoản.** Mỗi đoạn tự nó phải là một địa chỉ trích dẫn, như "Điều 12, khoản 2". Văn bản có từ hai chữ "Điều" đầu dòng trở lên mới cắt theo Điều (một báo cáo nhắc "Điều 5" một lần thì cắt theo đoạn văn). Điều dài quá 1.600 ký tự thì cắt tiếp theo khoản; đoạn vụn được gộp vào đoạn trước.

**Bước 2 — Truy hồi đoạn liên quan.** Máy chấm điểm từng đoạn bằng thuật toán BM25, cách chấm quen thuộc của các máy tìm kiếm. Nói theo lối văn phòng: từ khóa xuất hiện nhiều thì điểm cao nhưng có mức bão hòa; từ hiếm nặng điểm hơn từ gặp ở đâu cũng có; đoạn dài không được lợi chỉ vì dài; cộng thêm điểm cặp âm tiết (mục 15.2.4). Máy lấy tối đa 6 đoạn cao điểm nhất và chỉ tìm trong **đúng sổ tay đang hỏi**, không lẫn sang lĩnh vực khác.

**Bước 3 — Trả lời có trích dẫn.** Chỉ những đoạn ấy được gửi cho AI, đánh số [1] đến [6], kèm tên văn bản và nhãn Điều, khoản. Lời nhắc hệ thống buộc AI chỉ dựa vào các đoạn trích, không dùng kiến thức pháp luật có sẵn; mỗi ý gắn số trích dẫn; không đủ căn cứ thì nói thẳng "Không tìm thấy căn cứ trong nguồn của sổ tay này."; không bịa số hiệu, điều, khoản; các đoạn mâu thuẫn thì nêu rõ và đề nghị kiểm tra hiệu lực.

Phần mềm dò ngược các số [n] ra thẻ nguồn bên phải; đoạn nào AI thực sự dẫn thì được tô đậm để người dùng mở xem nguyên văn; câu trả lời quên gắn trích dẫn thì tự treo cảnh báo. Không có đoạn nào hợp thì phần mềm báo lỗi **trước khi** trừ lượt và không gọi AI — vừa đỡ tốn, vừa đúng "không có nguồn thì không trả lời". Đây đúng là Mô hình 1 "AI đề xuất, con người duyệt" của Tập 1 (mục 7.5): máy chỉ đưa ra đoạn trích và gợi ý, người tra mới là người kết luận.

::: {.vidu}
**Ví dụ minh họa — hình dạng một câu trả lời đạt yêu cầu**

Cán bộ hỏi trong sổ tay ST-03: "Trình tự tổ chức một cuộc giám sát chuyên đề gồm các bước nào?". Câu trả lời đạt yêu cầu có dạng: "Bước thứ nhất … [1]; bước thứ hai … [1] [2]. Báo cáo kết quả giám sát gồm … [3]", kết thúc bằng lời nhắc mở văn bản gốc. Bên phải, thẻ [1] ghi "[tên văn bản] — Điều [số], khoản [số]", bấm vào hiện nguyên văn. Nếu sổ tay chưa có văn bản nào nói về trình tự giám sát, câu trả lời đúng là "Không tìm thấy căn cứ trong nguồn của sổ tay này", chứ không phải một đoạn văn trôi chảy không có số nào.
:::

### 15.4.3. Danh mục nguồn là việc cần làm, không phải khẳng định pháp lý

Đây là chỗ tôi muốn người đọc dừng lại lâu nhất. 21 nguồn gợi ý của bộ khởi tạo đều **đặt sẵn ba trạng thái**: hiệu lực "Chưa xác định", "Chưa kiểm tra", và chưa xác nhận công khai; không văn bản nào được nhúng sẵn nguyên văn. Nhiều nguồn cố ý chỉ ghi tên chung, như "Nghị quyết của UBTVQH hướng dẫn hoạt động giám sát của HĐND", kèm ghi chú "đối chiếu các nghị quyết hướng dẫn đang áp dụng". Danh mục ấy là **danh sách việc phải làm** của người phụ trách, không phải lời khẳng định của phần mềm.

Phần mềm có bốn trạng thái hiệu lực (Còn hiệu lực · Hết hiệu lực một phần · Hết hiệu lực · Chưa xác định) và ba trạng thái kiểm tra (Chưa kiểm tra · Đã kiểm tra – đạt · Loại khỏi sổ tay), kèm người và ngày kiểm tra. Chỉ con người, sau khi tra Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản pháp luật, mới được chuyển trạng thái; bốn phép kiểm riêng chốt rằng bộ khởi tạo không tự gán hiệu lực cho văn bản nào.

Vì sao phải khắt khe đến vậy? Chỉ trong các lĩnh vực của sáu sổ tay, đến tháng 10/2026 đã có nhiều thay đổi:

- Luật Tiếp công dân số 42/2013/QH13 được sửa đổi, bổ sung bởi Luật số 136/2025/QH15 (hiệu lực 01/7/2026); Nghị quyết 116/2025/UBTVQH15 ngày 24/12/2025 về tiếp công dân, xử lý đơn của Quốc hội, HĐND thay thế Nghị quyết 759/2014/UBTVQH13. Sổ tay ST-04 nạp bản cũ là sai ngay từ gốc.
- Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15 có hiệu lực từ 01/3/2026. Khi tôi soạn sách, ngay số hiệu các nghị quyết hướng dẫn ở các nguồn thứ cấp còn chưa thống nhất — chỉ Công báo mới trả lời được.
- Quy định 366-QĐ/TW ngày 30/8/2025 về kiểm điểm, đánh giá, xếp loại chất lượng là căn cứ của năm 2026, nhưng Quy định 227-QĐ/TW ngày 19/10/2026 sẽ thay thế từ 01/01/2027; sổ tay về đánh giá, kiểm điểm như ST-06 phải cập nhật ngay đầu năm tới.
- Luật Ban hành văn bản quy phạm pháp luật số 64/2025/QH15 (sửa đổi bởi Luật số 87/2025/QH15) còn hiệu lực, nhưng một dự án luật mới dự kiến thay thế đang được trình; sổ tay ST-05 cần người theo dõi.

::: {.ghinho}
**Ghi nhớ — máy không có thẩm quyền khẳng định hiệu lực**

Phần mềm chỉ ghi lại kết quả kiểm tra của con người. "Máy đề xuất – người quyết định" áp dụng cả cho dữ liệu nguồn của AI. Sổ tay mà nguồn chưa kiểm tra hiệu lực thì chưa được đưa cho ai dùng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 15.3 — Dựng lõi tra cứu "có nguồn mới trả lời"**

```text
Vai: Tác tử AI lập trình làm việc trong kho mã của tôi.
Bối cảnh: Cần lối tra cứu có trích dẫn cho [tên sổ tay]; nguyên văn
văn bản do người dùng nạp.
Việc: Viết một thư viện logic thuần (không gọi mạng): cắt văn bản
theo Điều/khoản; chấm điểm đoạn liên quan (giữ dấu, ranh giới từ,
chấm cả cặp âm tiết); dựng ngữ cảnh đánh số [1]..[n]; đọc ngược số
trích dẫn trong câu trả lời ra thẻ nguồn.
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

Cùng với sổ tay, tôi giao tác tử soạn dự thảo "Quy tắc sử dụng trí tuệ nhân tạo trong tra cứu, hỏi đáp nghiệp vụ" gồm 9 điều. Đây là **dự thảo**: ô ngày ban hành và người ký để trống, chờ Chánh Văn phòng xem xét, ký ban hành; việc ban hành chính là dòng thứ năm trong báo cáo thí điểm.

Cần phân biệt với khung quy chế 10 điều mà Tập 1 đề xuất ở mục 7.6. Khung 10 điều là quy chế **chung** về dùng AI của cả cơ quan (phân loại dữ liệu, danh mục AI được phê duyệt, kiểm chứng đầu ra, xử lý vi phạm…); quy tắc 9 điều chỉ là quy tắc **riêng** cho việc tra cứu, hỏi đáp trong thí điểm Sổ tay AI, cụ thể hóa chứ không thay thế quy chế chung (xem mục 17.2 và Phụ lục 4).

| Điều | Nội dung cốt lõi |
|---|---|
| 1. Phạm vi | Cán bộ Văn phòng, thành viên các Ban, đại biểu HĐND tỉnh khi tra cứu trong phạm vi thí điểm |
| 2. Chỉ nạp văn bản công khai | Không nạp tài liệu mật, nội bộ, dự thảo chưa trình, thông tin cá nhân, thông tin về người khiếu nại, tố cáo |
| 3. Kiểm tra nguồn trước khi nạp | Đối chiếu số hiệu, ngày, cơ quan ban hành, hiệu lực; ghi người và ngày kiểm tra |
| 4. Người dùng chịu trách nhiệm | Câu trả lời chỉ để tham khảo; không trích dẫn AI làm căn cứ pháp lý |
| 5. Bắt buộc có trích dẫn | Dẫn tới điều, khoản; không có căn cứ thì nói là không có thông tin |
| 6. Không quyết định thay con người | Không dùng AI để đánh giá cán bộ, kết luận giám sát, giải quyết khiếu nại, tố cáo, nhân sự |
| 7. Bảo mật tài khoản | Không chia sẻ tài khoản; không nhập thông tin cá nhân của người khác |
| 8. Phát hiện sai phải báo ngay | Đánh dấu "Cần sửa lại", báo Tổ công tác |
| 9. Tổ chức thực hiện | Tổ công tác chuyển đổi số của Văn phòng chủ trì, định kỳ báo cáo |

Chín điều gom thành bốn nhóm dễ nhớ: **đầu vào** (Điều 2, 3), **đầu ra** (Điều 4, 5), **thẩm quyền** (Điều 6) và **kỷ luật** (Điều 7, 8, 9). Điều 6 chính là nguyên tắc "máy đề xuất – người quyết định" viết thành quy tắc.

::: {.phaply}
**Căn cứ pháp lý của các điều then chốt**

- *Điều 2.* Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ: không đưa lên chatbot AI dữ liệu thuộc danh mục bí mật nhà nước, thông tin nhạy cảm như dữ liệu cá nhân, tài liệu nội bộ. Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực 01/3/2026), Điều 5: cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu); khoản 10 cấm sử dụng hệ thống AI để xâm phạm bí mật nhà nước. Luật Tố cáo số 25/2018/QH14 (được sửa đổi, bổ sung bởi Luật số 136/2025/QH15), Điều 8: cấm tiết lộ thông tin làm lộ danh tính người tố cáo. Luật Tiếp cận thông tin số 01/2026/QH16 (hiệu lực 01/9/2026), Điều 15: thông tin công dân không được tiếp cận, trong đó có bí mật nhà nước, tài liệu nội bộ, dữ liệu cá nhân.
- *Điều 4, 5.* Hướng dẫn kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng: sản phẩm do AI tạo ra phải được cán bộ, đảng viên kiểm chứng, thẩm định, chỉnh sửa và chịu trách nhiệm hoàn toàn trước khi sử dụng; cùng Công văn 2766/BKHCN-TTCNTT (mục 15.4).
- *Điều 6.* Khoản 2 Điều 4 Luật Trí tuệ nhân tạo số 134/2025/QH15.

Nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi áp dụng.
:::

Điều 7 đặt ra một việc lãnh đạo phải quyết. Hướng dẫn trong phân hệ cho phép đăng nhập bằng tài khoản Google cá nhân hoặc tài khoản do cơ quan cấp, còn Công văn 557 dặn tránh tạo tài khoản AI trùng tên hoặc mật khẩu với tài khoản công vụ, cơ quan quản lý tài khoản và thu hồi khi cán bộ nghỉ việc, chuyển công tác. Văn bản ban hành nên ghi rõ dùng loại tài khoản nào và ai quản lý danh sách người được chia sẻ.

Tab "Quy tắc dùng AI" còn có **sổ cam kết**: cán bộ đọc quy tắc rồi ghi tên xác nhận. Sổ này cho Tổ công tác biết ai đã được phổ biến quy tắc, và buộc người dùng dừng lại đọc kỹ chín điều trước lần hỏi đầu tiên. Mẫu quy tắc và mẫu cam kết tham khảo in ở Phụ lục 4; mỗi cơ quan tự điều chỉnh và tự ban hành.

## 15.6. Hướng dẫn tự lập một sổ tay NotebookLM cho Ban của mình

### 15.6.1. Ba câu hỏi trước khi bắt đầu

Trước khi mở máy, hãy trả lời ba câu. *Sổ tay phục vụ ai, cho việc gì?* Chọn hẹp, chẳng hạn "thẩm tra dự thảo nghị quyết về ngân sách". *Nguồn nào chính thống và đã công khai?* Văn bản đã đăng Công báo, nghị quyết đã công bố, quy chế đã ban hành. *Ai chịu trách nhiệm kiểm tra hiệu lực và cập nhật?* Phải là một người cụ thể. Thiếu câu trả lời thứ ba thì chưa nên bắt đầu.

### 15.6.2. Mười bước lập sổ tay

::: {.thuchanh}
**Thực hành — lập một sổ tay cho Ban hoặc phòng**

1. Lập bảng danh mục nguồn: số hiệu, tên văn bản, cơ quan và ngày ban hành, tình trạng hiệu lực, đã công khai chưa, người và ngày kiểm tra.
2. Tra từng văn bản trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo; văn bản đã sửa đổi thì ưu tiên văn bản hợp nhất; chưa chắc thì để "Chưa xác định", không đoán.
3. Phân loại từng văn bản theo 4 cấp dữ liệu của Tập 1 (mục 7.1–7.2) và chỉ giữ văn bản **Cấp 1 — Công khai**. Loại ngay: tài liệu nội bộ, dự thảo chưa trình, văn bản có thông tin cá nhân, mọi hồ sơ đơn thư, tài liệu mật. Khi không chắc chắn, chọn cấp cao hơn — tức là không nạp.
4. Lấy bản điện tử gốc có lớp chữ; tránh tệp PDF chụp (scan), vì máy không đọc được chữ trong ảnh.
5. Đăng nhập `notebook.google.com` bằng loại tài khoản cơ quan quy định; tạo một notebook, đặt tên trùng mã và tên sổ tay, ví dụ "ST-03 Hoạt động giám sát".
6. Nạp các văn bản đã kiểm tra, mỗi văn bản một nguồn; chọn ngôn ngữ đầu ra tiếng Việt nếu cần.
7. Viết khoảng 9 câu hỏi mẫu; hỏi thử từng câu, bấm từng số trích dẫn, đối chiếu văn bản gốc; chỉ câu nào đúng mới đánh dấu "Đã đối chiếu nguồn".
8. Chia sẻ cho cán bộ theo quyền **Người xem** để họ hỏi được nhưng không sửa, xóa nguồn. Không coi kiểu liên kết chỉ hiện khung chat là cơ chế bảo mật: theo trợ giúp của Google, kiểu này không thu hồi quyền truy cập.
9. Dán địa chỉ notebook vào ô liên kết của sổ tay trong phân hệ; tích "Đã nạp lên NotebookLM" cho từng nguồn đã tải lên.
10. Hướng dẫn cán bộ bốn bước — đăng nhập tài khoản của mình → mở sổ tay được chia sẻ → hỏi, bấm số trích dẫn → mở văn bản gốc kiểm chứng — và ghi ngày hướng dẫn. Khi văn bản được sửa đổi, thay thế, hết hiệu lực, cập nhật cả notebook lẫn danh mục.
:::

### 15.6.3. Hỏi thế nào cho đúng tinh thần sổ tay

Gemini Notebook vốn trả lời dựa trên nguồn đã nạp và có trích dẫn. Dù vậy, khi hỏi nên dặn thêm ba điều: chỉ dựa vào nguồn trong sổ tay; mỗi ý ghi rõ tên văn bản và điều, khoản; hai nguồn quy định khác nhau thì nêu cả hai. Còn trước khi đánh dấu một câu hỏi mẫu là "Đã đối chiếu", hãy bắt sổ tay tự soi lại câu trả lời của chính nó:

::: {.lenhmau}
**Câu lệnh mẫu 15.4 — Rà một câu hỏi mẫu trước khi đánh dấu "Đã đối chiếu"**

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

AI tự soi lại vẫn không thay được việc người đối chiếu mở văn bản gốc (Tập 1, mục 3.8): câu lệnh này chỉ giúp tìm nhanh chỗ cần nhìn kỹ.

::: {.canhbao}
**Cảnh báo — khi nào không dùng sổ tay trên dịch vụ bên ngoài**

Nguồn tải lên Gemini Notebook được lưu trên máy chủ của Google, một nhà cung cấp nước ngoài. Lối tra nhanh trong phân hệ cũng gửi đoạn trích tới dịch vụ AI, và dữ liệu sổ tay mở đọc công khai. Vì vậy cả hai lối chỉ dành cho dữ liệu **Cấp 1 — Công khai** (Tập 1, mục 7.2), kể cả khi "chỉ để thử".

- Dự thảo chưa trình, biên bản họp nội bộ (Cấp 2 — Nội bộ) không đưa vào sổ tay dùng chung; nếu cần AI hỗ trợ thì chỉ dùng AI có cam kết doanh nghiệp, sau khi ẩn danh.
- Hồ sơ đơn thư, kiến nghị có tên người dân, thông tin về người khiếu nại, tố cáo (Cấp 3 — Hạn chế tiếp cận) chỉ được xử lý bằng AI có máy chủ trong nước hoặc AI tự triển khai nội bộ, theo quy định của cơ quan.
- Tài liệu bí mật nhà nước (Cấp 4) tuyệt đối không dùng AI nước ngoài, và theo Luật số 117/2025/QH15 không được soạn thảo, lưu giữ trên thiết bị đang kết nối Internet.
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Không phải việc gì cũng cần AI; việc có quy tắc cố định nên giao cho một chương trình nhỏ, rẻ, dễ kiểm chứng.
- Sổ tay AI có giá trị ở **trích dẫn kiểm chứng được**, không ở câu trả lời trơn tru. Hãy hỏi: "nguồn đã được ai kiểm tra hiệu lực, ngày nào?".
- Ba quyết định thuộc về lãnh đạo: ký ban hành Quy tắc sử dụng AI; chọn loại tài khoản và cơ chế thu hồi quyền; giao đích danh người cập nhật nguồn của từng sổ tay.
- Chỉ tiêu "giảm ít nhất 30% thời gian tra cứu" cần phương pháp đo rõ ràng; con số ước lượng phải được ghi là ước lượng trong báo cáo.
:::

## Tóm tắt chương 15

::: {.tomtat}
1. Việc có quy tắc cố định không cần AI: bản tin pháp luật chạy tại chỗ lúc 07:30, đọc 5 kênh RSS chính thống, không khóa API, không token, không AI.
2. Tác vụ tự động phải có chốt chặn (mất mạng không ghi đè, chưa đủ tin mới không ra bản tin), có chạy bù, thử lại, nhật ký, và tính trước dung lượng sau một năm.
3. Hai bẫy tiếng Việt — khớp chuỗi con và bỏ dấu — được chữa bằng giữ dấu, ranh giới từ, chấm điểm, chấm thêm cặp âm tiết; các ca lỗi thành phép kiểm hồi quy.
4. Sổ tay AI có 06 sổ tay, 54 câu hỏi mẫu, 4 chỉ tiêu, 3 mốc; đến 26/10/2026 đó vẫn là chỉ tiêu, chưa phải kết quả.
5. Hỏi đáp chạy trên Gemini Notebook (trước đây là NotebookLM) bằng tài khoản từng người; phân hệ giữ danh mục nguồn, câu hỏi mẫu, báo cáo — phần "trí tuệ của cơ quan".
6. "Có nguồn mới trả lời" (RAG, Tập 1 mục 5.6): cắt theo Điều, khoản, truy hồi đúng sổ tay, bắt buộc trích dẫn; phần mềm không tự gán hiệu lực cho văn bản.
7. Quy tắc 9 điều là quy tắc riêng của thí điểm, cụ thể hóa chứ không thay quy chế chung 10 điều (Tập 1, mục 7.6); sổ tay dùng chung chỉ nhận dữ liệu Cấp 1 — Công khai.
:::

## Câu hỏi suy ngẫm và bài tập

1. Liệt kê ba việc lặp lại hằng ngày ở phòng, Ban của đồng chí. Việc nào chỉ cần một chương trình nhỏ? Việc nào thật sự cần AI?
2. Dùng Câu lệnh mẫu 15.2, viết mười cặp từ dễ nhầm trong lĩnh vực đồng chí phụ trách. Có cặp nào bỏ dấu sẽ thành một?
3. Chọn một văn bản trong danh mục nguồn gợi ý gần với công việc của đồng chí; tra tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật, ghi người và ngày kiểm tra.
4. Làm theo mục Thực hành ở 15.6.2 với ba văn bản công khai. Viết ba câu hỏi mẫu, dùng Câu lệnh mẫu 15.4 để rà từng câu.
5. Đồng chí sẽ đo chỉ tiêu "giảm ít nhất 30% thời gian tra cứu" bằng cách nào để con số đứng vững trước một Hội đồng thẩm định?
