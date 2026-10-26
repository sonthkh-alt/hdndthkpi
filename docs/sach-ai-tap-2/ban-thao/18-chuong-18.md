# Chương 18. Lộ trình 30 ngày cho người mới bắt đầu

::: {.muctieu}
**Mục tiêu của chương**

- Có một lịch học cụ thể trong 30 ngày, mỗi ngày 15–45 phút, đi từ lần đầu trò chuyện với AI đến một ứng dụng nhỏ có dữ liệu, chạy trên mạng, có đồng nghiệp dùng thử.
- Hình thành thói quen an toàn ngay từ ngày đầu: tắt chế độ cho phép dùng dữ liệu để huấn luyện, phân loại dữ liệu vùng ĐỎ/VÀNG/XANH trước khi gõ, chỉ luyện tập bằng văn bản công khai và dữ liệu giả.
- Làm ra ba sản phẩm của riêng mình: một thư viện câu lệnh cá nhân, một công cụ nhỏ (bảng tính hoặc trang tra cứu), một ứng dụng bản demo có cơ sở dữ liệu kèm nhật ký.
- Tự đánh giá được mình đang đứng ở bậc nào trên thang 5 bậc kiến tạo và chọn bước tiếp theo vừa sức.

Dành cho: người mới hoàn toàn với AI và cán bộ, công chức muốn tự học có hệ thống (làm theo từng ngày); lãnh đạo phòng, lãnh đạo Ban nên đọc phần mở đầu, hộp "Dành cho lãnh đạo" và mục 18.5 để biết cách hỗ trợ và nghiệm thu.
:::

Từ khi hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh (hdndthkpi.vercel.app) có nhiều phân hệ, câu tôi được hỏi nhiều nhất không phải là "phần mềm này làm bằng gì" mà là "tôi chưa biết gì thì bắt đầu từ đâu". Các chương trước là tài liệu tra cứu: đọc chương nào khi cần việc ấy. Chương này là một thời khóa biểu. Đồng chí làm theo từng ngày, mỗi ngày một việc nhỏ, cuối mỗi tuần nhìn lại.

Lộ trình dựa trên ba nguyên tắc.

**Ít mà đều.** Mỗi ngày chỉ 15–45 phút. Ba mươi phút mỗi sáng trong bốn tuần có giá trị hơn một ngày cuối tuần ngồi tám tiếng. Kỹ năng làm việc với AI giống kỹ năng soạn thảo văn bản: lên tay nhờ lặp lại, không nhờ học dồn.

**Mỗi ngày một sản phẩm cầm nắm được và một phép tự kiểm tra.** Sản phẩm có thể chỉ là một câu lệnh đã lưu, một bảng phân loại, một tệp chạy được. Phép tự kiểm tra là một câu hỏi trả lời được bằng "có" hoặc "chưa". Không có sản phẩm thì ngày đó coi như chưa học. Trả lời "chưa" thì ghi lý do, hôm sau làm bù.

**An toàn đi trước.** Suốt 30 ngày, đồng chí chỉ dùng văn bản đã công khai (vùng XANH theo cách phân loại của Tập 1) và dữ liệu giả do mình tự đặt ra. Không có ngoại lệ "chỉ thử một lần". Người học thường lộ dữ liệu không phải vì cố ý, mà vì tiện tay dán nguyên một bảng tính thật vào khung chat.

Bốn tuần ứng với bốn nấc của thang 5 bậc kiến tạo ở Chương 2. Tuần thứ nhất là Bậc 0: dùng AI trò chuyện cho đúng cách. Tuần thứ hai vẫn ở Bậc 0 nhưng đưa AI vào chính công việc của mình. Tuần thứ ba lên Bậc 1–2: một bảng tính có công thức do AI viết và một trang công cụ chạy trong trình duyệt. Tuần thứ tư chạm Bậc 3: ứng dụng có cơ sở dữ liệu, có đăng nhập, có người khác cùng dùng. Hai ngày cuối dành cho tự đánh giá và trình bày.

Ba mươi ngày là nhịp gợi ý, không phải hạn chót. Bận họp, bận kỳ họp thì lùi lịch. Điều duy nhất không được bỏ là phần tự kiểm tra.

::: {.thuchanh}
**Thực hành: chuẩn bị trước ngày thứ nhất (khoảng 30 phút)**

1. Tạo một **sổ tay học tập**: một tệp Word hoặc một trang ghi chú cá nhân, đặt tên "So-tay-30-ngay". Mỗi ngày ghi đúng ba dòng: đã làm gì; sản phẩm nằm ở đâu; tự kiểm tra đạt hay chưa, vì sao.
2. Gom một **bộ văn bản luyện tập** gồm 5–7 văn bản đã công khai thuộc lĩnh vực mình phụ trách: luật, nghị định, nghị quyết đã ban hành, báo cáo đã công bố tại kỳ họp, thông cáo báo chí. Tải từ nguồn chính thống, ưu tiên bản có lớp chữ (bôi đen được chữ), tránh bản chụp (scan).
3. Chuẩn bị một **địa chỉ email riêng** cho việc học AI. Không dùng lại mật khẩu của tài khoản công vụ.
4. Đặt **một khung giờ cố định** 30 phút trong lịch hằng ngày, như đặt một cuộc họp với chính mình.
5. Nếu máy cơ quan bị khóa quyền cài đặt, hỏi trước bộ phận quản trị mạng ngay từ bây giờ. Tuần thứ ba và thứ tư sẽ cần đến.
:::

## 18.1. Tuần thứ nhất: làm quen AI trò chuyện an toàn (ngày 1–7)

Mục tiêu của tuần là trò chuyện với AI như giao việc cho một thư ký cao cấp, đúng tinh thần Tập 1, mà không để lọt bất kỳ thông tin nào không được phép. Đồng chí chọn **một** trợ lý AI trò chuyện để bắt đầu (Claude, ChatGPT hoặc Gemini đều được) và dùng gói miễn phí là đủ cho hai tuần đầu. Học sâu một công cụ trước, so sánh với công cụ khác sau.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 1 | Mở tài khoản, khóa quyền riêng tư (30 phút) | Tài khoản đã tắt huấn luyện, bật xác thực hai lớp | Mở lại Cài đặt: mục ấy còn tắt không? |
| 2 | Xếp 10 loại giấy tờ vào ba vùng (20 phút) | Bảng phân loại của riêng mình | Có xếp nhầm dữ liệu cá nhân vào XANH không? |
| 3 | Bài tập 1: tóm tắt theo V-B-V-D-R (30 phút) | Câu lệnh đầu tiên và bản tóm tắt | Mỗi ý có chỉ được chỗ trong văn bản gốc? |
| 4 | Bài tập 2: kiểm chứng trích dẫn (30 phút) | Bảng đối chiếu 5 văn bản | Đã tự tra đủ 5 văn bản chưa? |
| 5 | Bài tập 3: soát chính tả, thể thức (30 phút) | Danh sách lỗi đã xác minh | Bao nhiêu "lỗi" AI nêu thực ra không sai? |
| 6 | Bài tập 4 và 5: viết cho lãnh đạo, hỏi ngược (45 phút) | Bản 5 ý và bảng so sánh | Còn câu nào "tô hồng" chưa xóa? |
| 7 | Ôn tuần, ghi sổ (15 phút) | Trang tổng kết tuần 1 | Trả lời được 5 câu hỏi ở hộp Ghi nhớ? |

### 18.1.1. Ngày 1: mở tài khoản và khóa cửa quyền riêng tư

Hãy coi tài khoản AI như một tủ hồ sơ đặt ở trụ sở của người khác. Việc đầu tiên khi nhận tủ là xem ai được mở nó. Đồng chí làm bốn bước: đăng ký bằng email riêng; đặt mật khẩu mạnh, không trùng mật khẩu công vụ; bật xác thực hai lớp nếu dịch vụ có; rồi vào phần Cài đặt, tìm mục Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt lựa chọn cho phép dùng nội dung trò chuyện để cải thiện mô hình.

Với Claude, theo thông báo của Anthropic, từ ngày 28/8/2025 người dùng các gói cá nhân Free, Pro, Max được tự chọn có cho dùng dữ liệu để huấn luyện hay không. Bật thì dữ liệu được lưu 5 năm, tắt thì lưu 30 ngày. Mục này nằm trong Settings → Privacy. Với ChatGPT, theo hướng dẫn trước đây của nhà cung cấp, mục tương ứng nằm trong phần Data controls, mang tên "Improve the model for everyone". Với Gemini, mục cần xem là "Keep Activity" (trước đây gọi là Gemini Apps Activity). Tôi chưa kiểm chứng lại được giao diện của ChatGPT và Gemini tại thời điểm viết (10/2026), nên đồng chí hãy đọc kỹ chữ trong mục quyền riêng tư thay vì tìm đúng một tên nút cố định.

Vì sao phải làm ngay ngày đầu? Với Claude, tắt huấn luyện chỉ áp dụng cho các cuộc trò chuyện từ lúc tắt trở đi; dữ liệu đã dùng để huấn luyện trước đó không được gỡ ra. Khóa cửa trước khi cất hồ sơ, không phải sau.

Cũng cần hiểu đúng giới hạn của việc này. Tắt huấn luyện chỉ giảm rủi ro, không biến tài khoản cá nhân thành nơi được phép chứa tài liệu nội bộ hay tài liệu mật. Dữ liệu vẫn đi qua và nằm trên máy chủ của nhà cung cấp ở nước ngoài.

### 18.1.2. Ngày 2: tập phân loại vùng ĐỎ, VÀNG, XANH

Tập 1 chia dữ liệu thành ba vùng. Vùng ĐỎ là tài liệu mật và dữ liệu cá nhân nhạy cảm, tuyệt đối không đưa lên AI công cộng. Vùng VÀNG là tài liệu lưu hành nội bộ, dự thảo chưa chốt, chỉ dùng sau khi đã ẩn danh và cân nhắc kỹ. Vùng XANH là thông tin đã công khai, dùng được. Ngày thứ hai, đồng chí không mở AI. Đồng chí lấy 10 loại giấy tờ trên bàn làm việc của mình và tự xếp vào ba vùng.

::: {.vidu}
**Ví dụ minh họa: bảng phân loại của một chuyên viên ở một Ban**

| Loại giấy tờ | Vùng | Lý do |
|---|---|---|
| Nghị quyết HĐND tỉnh đã ban hành, đã đăng tải | XANH | Đã công khai |
| Báo cáo thẩm tra đã trình tại kỳ họp, đã công bố | XANH | Đã công khai |
| Thông cáo báo chí sau kỳ họp | XANH | Đã công khai |
| Dự thảo nghị quyết chưa trình | VÀNG | Chưa chốt, chưa công bố |
| Lịch công tác tuần của lãnh đạo | VÀNG | Thông tin nội bộ |
| Tổng hợp kiến nghị cử tri còn họ tên, địa chỉ | ĐỎ | Dữ liệu cá nhân của người dân |
| Đơn khiếu nại, tố cáo | ĐỎ | Danh tính người khiếu nại, tố cáo |
| Hồ sơ cán bộ, bảng điểm đánh giá có họ tên | ĐỎ | Dữ liệu cá nhân, nội dung đánh giá |
| Danh bạ điện thoại nội bộ | ĐỎ | Số điện thoại là dữ liệu cá nhân |
| Tài liệu có đóng dấu độ mật | ĐỎ | Bí mật nhà nước |

Bảng của đồng chí có thể khác, tùy công việc. Quy tắc khi phân vân: nghi ngờ thì xếp lên vùng cao hơn. Tổng hợp kiến nghị cử tri chỉ có thể xuống vùng VÀNG sau khi đã xóa sạch họ tên, địa chỉ, số điện thoại của người kiến nghị.
:::

Danh bạ điện thoại trong bảng không phải ví dụ ngẫu nhiên. Khi dựng phân hệ Quản lý cán bộ, tôi có một tệp danh bạ thật của đại biểu và cán bộ. Cách nhanh nhất là để AI nhúng thẳng danh bạ vào mã. Nhưng kho mã của hệ thống là kho công khai, nên dự án làm ngược lại: phần mềm chỉ có bộ đọc danh bạ, không chứa một số điện thoại nào; tệp danh bạ bị chặn khỏi kho mã; dữ liệu nằm trên máy chủ, chỉ Quản trị đọc được; và có hẳn một phép kiểm "không có số điện thoại nào trong mã nguồn". Thói quen phân loại trước khi làm bắt đầu từ bài tập hôm nay.

::: {.phaply}
**Căn cứ pháp lý: vì sao phải phân loại trước khi gõ**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Quốc hội thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026) chia dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.
- Nghị định 356/2025/NĐ-CP (có hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP) liệt kê tại Điều 3 các dữ liệu cá nhân cơ bản, trong đó có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình; khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm như quan điểm chính trị, tôn giáo, tín ngưỡng, tình trạng sức khỏe, đời sống riêng tư.
- Các quy định về bảo vệ bí mật nhà nước nghiêm cấm soạn thảo, lưu giữ tài liệu có nội dung bí mật nhà nước trên máy tính, thiết bị đã hoặc đang kết nối Internet, trừ trường hợp theo quy định về cơ yếu.
- Luật Trí tuệ nhân tạo số 134/2025/QH15 (có hiệu lực từ 01/3/2026), khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người."

Danh mục pháp luật trong sách được đối chiếu đến ngày 26/10/2026. Trước khi áp dụng, đồng chí tra lại nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

### 18.1.3. Ngày 3 đến ngày 6: năm bài tập với văn bản công khai

Bốn ngày này dùng chung một bộ văn bản luyện tập đã chuẩn bị. Mỗi bài tập rèn một kỹ năng của Tập 1, và kỹ năng nào cũng sẽ được dùng lại khi đồng chí giao việc cho tác tử AI lập trình ở tuần thứ ba, thứ tư.

**Bài tập 1 (ngày 3) — Tóm tắt có địa chỉ.** Chọn một văn bản dài khoảng 5–15 trang. Lần thứ nhất, gõ trơn "tóm tắt văn bản này". Lần thứ hai, dùng câu lệnh mẫu 18.1 theo khung V-B-V-D-R (Vai – Bối cảnh – Việc – Dạng – Ràng buộc). So sánh hai bản. Điều đáng chú ý nhất ở bản thứ hai là phần ghi vị trí trong ngoặc: mỗi ý tóm tắt chỉ được về một Điều, một mục cụ thể. Nhờ vậy đồng chí kiểm chứng được trong vài phút, chứ không phải đọc lại cả văn bản.

::: {.lenhmau}
**Câu lệnh mẫu 18.1 — Tóm tắt văn bản công khai theo V-B-V-D-R**

```text
VAI: Đồng chí là chuyên viên tổng hợp nhiều kinh nghiệm của Văn phòng
Đoàn ĐBQH và HĐND tỉnh, viết văn phong hành chính trung lập.
BỐI CẢNH: Dưới đây là toàn văn [tên và số hiệu văn bản], văn bản đã
được công bố công khai. Người đọc bản tóm tắt là lãnh đạo Ban, cần
nắm nhanh nội dung trước cuộc họp.
VIỆC: Tóm tắt văn bản này.
DẠNG: Tối đa 10 gạch đầu dòng, mỗi dòng không quá 30 chữ. Cuối mỗi dòng
ghi trong ngoặc vị trí trong văn bản gốc (Điều, khoản hoặc mục).
RÀNG BUỘC: Chỉ dùng thông tin có trong văn bản dưới đây. Không thêm
nhận định, không dùng từ ngữ khen ngợi. Chỗ nào văn bản không nói rõ
thì ghi "văn bản không nêu".
[Dán toàn văn văn bản]
```
:::

**Bài tập 2 (ngày 4) — Bắt AI nói "không biết".** Tập 1 đã cảnh báo: AI không tự kiểm tra được số liệu và không biết văn bản pháp luật vừa ban hành. Bài tập này để đồng chí tự thấy điều đó bằng mắt. Dùng câu lệnh mẫu 18.2, rồi tra từng văn bản AI nêu trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo. Ghi kết quả vào bảng ba cột: văn bản AI nêu; kết quả tra (đúng, sai số hiệu, sai ngày, đã hết hiệu lực, không tồn tại); ghi chú. Nhiều khả năng đồng chí sẽ gặp ít nhất một văn bản đã được thay thế mà AI vẫn coi là hiện hành, vì trí nhớ của nó dừng ở một thời điểm.

::: {.lenhmau}
**Câu lệnh mẫu 18.2 — Kiểm tra trí nhớ của AI về văn bản pháp luật**

```text
Tôi đang tập kiểm chứng câu trả lời của AI. Hãy liệt kê tối đa 5 văn
bản quy phạm pháp luật hiện hành về [lĩnh vực, ví dụ: hoạt động giám
sát của HĐND]. Với mỗi văn bản ghi: số hiệu, tên, ngày có hiệu lực, và
mức độ chắc chắn của đồng chí (cao / trung bình / thấp).
Quy tắc bắt buộc:
- Không chắc thì ghi "không chắc", không được đoán số hiệu hay ngày.
- Nói rõ kiến thức của đồng chí cập nhật đến khoảng thời điểm nào;
  văn bản ban hành sau thời điểm đó thì đồng chí không biết.
- Không trích nguyên văn điều khoản khi không có văn bản trước mặt.
Cuối câu trả lời, nhắc tôi tra lại từng văn bản trên nguồn chính thống.
```
:::

**Bài tập 3 (ngày 5) — Soát lỗi, và soát cả người soát.** Lấy một văn bản hành chính của chính cơ quan đã ban hành, đã đăng công khai. Nhờ AI soát chính tả, ngữ pháp và thể thức theo Nghị định 30/2020/NĐ-CP về công tác văn thư. Sau đó đồng chí tự xác minh từng lỗi AI nêu, và đếm xem bao nhiêu "lỗi" thực ra không sai. Mục đích không phải để chê AI. Mục đích là tập thói quen: đề xuất sửa của AI cũng phải được thẩm định như đề xuất của một chuyên viên mới. Lưu ý thêm: văn bản của tổ chức Đảng có tiêu đề, thể thức riêng. Hệ thống của Văn phòng từng in nhầm tên cơ quan hành chính lên đầu bản tự kiểm điểm đảng viên, trong khi tiêu đề đúng phải là của tổ chức Đảng.

**Bài tập 4 (ngày 6, phần đầu) — Viết cho lãnh đạo, không tô hồng.** Chọn một báo cáo dài đã công bố, yêu cầu AI rút thành đúng 5 ý cho lãnh đạo đọc trong một phút. Thêm ràng buộc văn phong: trung lập, phản ánh đúng cả mặt được và mặt hạn chế, không dùng các cụm như "vô cùng to lớn", "bước đột phá". Đọc lại, gạch bỏ mọi câu khen mà văn bản gốc không có căn cứ.

**Bài tập 5 (ngày 6, phần sau) — Để AI hỏi ngược.** Thêm vào cuối một yêu cầu bất kỳ câu: "Trước khi làm, hãy hỏi tôi tối đa 5 câu để làm rõ yêu cầu." Trả lời các câu hỏi đó rồi mới cho AI làm. Sau đó yêu cầu AI lập bảng so sánh 2–3 phương án theo các tiêu chí đồng chí đặt ra, đúng kỹ thuật "ma trận so sánh" của Tập 1. Hỏi ngược là kỹ năng quan trọng nhất khi chuyển sang giao việc cho tác tử: một yêu cầu mơ hồ với trợ lý trò chuyện chỉ cho ra một đoạn văn dở, nhưng với tác tử lập trình có thể cho ra cả chục tệp sai.

### 18.1.4. Ngày 7: ôn tuần và ghi sổ

Ngày thứ bảy nhẹ nhàng. Đồng chí đọc lại sổ tay học tập, lưu các câu lệnh đã dùng tốt vào một tệp riêng (ngày 12 sẽ dựng thành thư viện), và tự trả lời năm câu hỏi dưới đây. Câu nào chưa trả lời chắc, quay lại đúng ngày đó làm lại.

::: {.ghinho}
**Ghi nhớ: năm câu hỏi trước mỗi lần gõ vào khung chat**

1. Thông tin mình sắp dán thuộc vùng nào: ĐỎ, VÀNG hay XANH?
2. Tài khoản này đã tắt chế độ cho phép dùng dữ liệu để huấn luyện chưa?
3. Câu lệnh đã đủ năm thành phần V-B-V-D-R chưa?
4. Mình sẽ kiểm chứng kết quả bằng nguồn nào, mất bao lâu?
5. Nếu dùng kết quả này mà sai, ai chịu trách nhiệm? Câu trả lời luôn là: chính mình.
:::

## 18.2. Tuần thứ hai: đưa AI vào việc của chính mình (ngày 8–14)

Tuần thứ nhất luyện tay trên văn bản bất kỳ. Tuần thứ hai chuyển sang những việc đồng chí thật sự làm hằng tháng. Câu hỏi của tuần không còn là "AI làm được gì" mà là "việc nào của mình nên giao cho AI, và giao đến đâu".

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 8 | Lập bản đồ công việc, chọn 3 việc (20 phút) | Danh sách 3 việc kèm vùng dữ liệu | Mỗi việc làm được bằng dữ liệu XANH hoặc dữ liệu giả? |
| 9 | Nhờ AI viết công thức bảng tính (30 phút) | Bảng tính có công thức, 5 ca thử | Cả 5 ca khớp kết quả tính tay? |
| 10 | Tóm tắt văn bản dài theo kỹ thuật phân tầng (45 phút) | Bản tóm tắt có chỉ dẫn mục | Kiểm ngẫu nhiên 3 ý: đúng nguyên văn? |
| 11 | Rà soát nhất quán một văn bản (30 phút) | Bảng các điểm nghi vấn | Mỗi điểm đã tự đọc lại văn bản gốc? |
| 12 | Dựng thư viện câu lệnh cá nhân (30 phút) | Tệp thư viện từ 6 câu lệnh | Câu lệnh nào cũng ghi vùng dữ liệu? |
| 13 | Gemini Notebook với văn bản công khai (45 phút) | Một notebook 3–5 nguồn, 5 câu hỏi | Bấm số trích dẫn có ra đúng đoạn? |
| 14 | Ôn tuần, đo thời gian thật (20 phút) | Bảng so sánh làm tay và có AI | Đã ghi cả những lần AI làm chậm hơn? |

### 18.2.1. Ngày 8 và 9: bản đồ công việc, rồi bảng tính

Ngày 8, đồng chí liệt kê khoảng 10 việc lặp lại trong một tháng của mình, rồi chọn ra 3 việc thỏa đủ bốn điều kiện: lặp lại đều; tốn thời gian; có quy tắc tương đối rõ; và làm được bằng văn bản công khai hoặc dữ liệu giả cùng cấu trúc. Việc nào chỉ làm được bằng dữ liệu vùng ĐỎ thì gạch khỏi danh sách luyện tập, dù nó tốn thời gian đến đâu.

Ngày 9 là bài học quan trọng nhất của tuần: **AI viết công thức, mình giữ dữ liệu.** Nhiều người dán nguyên bảng tính có họ tên, ngày sinh lên khung chat chỉ để "nhờ viết công thức", trong khi AI chỉ cần biết tên cột và vài dòng giả. Đồng chí tự tạo 5 dòng dữ liệu giả, mô tả cấu trúc cột, rồi giao việc như câu lệnh mẫu 18.3.

::: {.lenhmau}
**Câu lệnh mẫu 18.3 — Nhờ AI viết công thức, không gửi dữ liệu thật**

```text
Tôi có một bảng Excel với các cột: A "Tên nhiệm vụ", B "Số lượng giao",
C "Số lượng hoàn thành", D "Chất lượng" (một trong ba giá trị: Đạt
chuẩn, Có sai sót nhỏ, Chưa đạt), E "Tiến độ" (Đúng hạn, Chậm ít,
Trễ hạn). Dữ liệu dưới đây là dữ liệu GIẢ, chỉ để minh họa cấu trúc:
[dán 5 dòng giả]
Hãy viết công thức cho cột F "Kết quả (%)" = trung bình cộng của: tỷ lệ
C/B (tối đa 100%); điểm chất lượng (100 / 75 / 50); điểm tiến độ
(100 / 80 / 50). Ô trống hoặc B bằng 0 thì F để trống, không báo lỗi.
Giải thích từng phần công thức bằng tiếng Việt, rồi lập 5 ca kiểm thử
có đáp án tính tay để tôi tự gõ vào kiểm tra.
```
:::

Câu lệnh trên mô phỏng đúng cách chấm từng nhiệm vụ của phân hệ Đánh giá OKR/KPI (Chương 9). Ca kiểm thử đầu tiên nên là ví dụ chuẩn trong dự thảo hướng dẫn lập danh mục sản phẩm, công việc: giao 10, hoàn thành 10, đạt chuẩn, chậm ít, cho kết quả (100 + 100 + 80) / 3 = 93,3%. Công thức của đồng chí cho đúng con số ấy thì mới dùng tiếp.

::: {.cauchuyen}
**Câu chuyện thực tế: bảng tính trở thành thước nghiệm thu**

Trước khi có phần mềm, tôi mô phỏng toàn bộ cách tính điểm theo Nghị định 335/2025/NĐ-CP và quy định của Tỉnh ủy trong một tệp Excel gọi là "Engine tính điểm". Khi viết Đặc tả yêu cầu phần mềm, tệp ấy được ghi là bộ ca kiểm thử bắt buộc: với cùng đầu vào, phần mềm phải cho kết quả khớp Excel tới hai chữ số thập phân. Bảng tính nhỏ của ngày thứ chín vì thế không phải bài tập bỏ đi. Đến tuần thứ tư, nó có thể trở thành thước đo để đồng chí nghiệm thu chính ứng dụng của mình.
:::

### 18.2.2. Ngày 10 và 11: tóm tắt phân tầng và rà soát nhất quán

Ngày 10, đồng chí áp dụng kỹ thuật phân tầng của Tập 1 cho một văn bản dài trên 30 trang: yêu cầu AI lập dàn ý trước; duyệt dàn ý; cho AI tóm tắt từng phần theo dàn ý; cuối cùng mới ghép và hiệu đính. Đừng dán cả văn bản dài rồi đòi một bản tóm tắt hoàn chỉnh ngay lần đầu.

Ngày 11 dùng AI theo một cách ít người nghĩ tới: soi chỗ chưa nhất quán bên trong văn bản. Hãy yêu cầu AI kiểm ba điều: tổng các điểm thành phần có bằng điểm tối đa không; con số trong bảng có khớp với lời văn không; các điều, khoản có được đánh số liên tục không. Khi số hóa dự thảo Khung tiêu chí đánh giá HĐND, chính những câu hỏi kiểu này đã làm lộ ra 6 chỗ chưa nhất quán, chẳng hạn một tiêu chí 6 điểm mà các mức cộng lại thành 9 điểm, hay điều khoản đánh số nhảy từ khoản 2 sang khoản 5 (Chương 8, Chương 11). Ghi nhớ ranh giới: AI và phần mềm chỉ phát hiện và kiến nghị; quyền sửa văn bản thuộc cơ quan có thẩm quyền. Bài tập này nên làm trên văn bản đã công bố hoặc tài liệu học tập, không làm trên dự thảo chưa được phép đưa ra ngoài.

### 18.2.3. Ngày 12: thư viện câu lệnh cá nhân

Đến ngày 12, đồng chí đã có ít nhất 6 câu lệnh dùng được. Hãy cất chúng vào một tệp có cấu trúc, như cất mẫu văn bản vào sổ mẫu của phòng. Mỗi câu lệnh một mục, theo khuôn dưới đây.

| Trường | Ghi gì | Ví dụ |
|---|---|---|
| Tên | Ngắn, gợi việc | "Tóm tắt có địa chỉ" |
| Mục đích | Dùng khi nào | Trước cuộc họp của Ban |
| Vùng dữ liệu | Được dùng với vùng nào | Chỉ XANH |
| Nội dung | Toàn văn câu lệnh, chỗ điền trong ngoặc vuông | Câu lệnh mẫu 18.1 |
| Cách kiểm chứng | Đối chiếu với gì | Mở văn bản gốc theo vị trí ghi |
| Lần sửa gần nhất | Ngày và lý do sửa | Thêm ràng buộc chống tô hồng |

Thư viện không lưu kèm dữ liệu thật nào. Quy tắc 20/80 của Tập 1 dùng được để bảo trì thư viện: nếu lần nào cũng phải sửa tới 60–70% câu chữ AI trả về, lỗi nằm ở câu lệnh; hãy sửa câu lệnh và ghi vào trường "Lần sửa gần nhất". Phụ lục 2 có thêm khoảng 40 câu lệnh để đồng chí chọn bổ sung.

### 18.2.4. Ngày 13: sổ tay hỏi đáp có trích dẫn trên Gemini Notebook

Gemini Notebook (trước đây là NotebookLM) là công cụ của Google trả lời dựa trên các nguồn do chính người dùng nạp vào, kèm số trích dẫn bấm vào là xem được đoạn gốc. Google đổi tên sản phẩm ngày 16/7/2026; địa chỉ hiện hành là `notebook.google.com`, địa chỉ cũ tự chuyển hướng sang đó. Phân hệ Sổ tay AI của Văn phòng dựa trên công cụ này (Chương 15).

Các bước trong 45 phút: đăng nhập tài khoản Google của chính mình; tạo một notebook mới, đặt tên theo lĩnh vực; nạp 3–5 văn bản công khai trong bộ văn bản luyện tập, mà đồng chí đã tự kiểm tra còn hiệu lực; đặt 5 câu hỏi bằng tiếng Việt; với mỗi câu trả lời, bấm vào từng số trích dẫn để xem đoạn gốc có thật sự nói điều đó không. Về hạn mức, theo thông báo của Google, từ ngày 02/9/2026 mức dùng được tính theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ và có trần theo tuần, thay cho số lượt cố định mỗi ngày như trước.

::: {.lenhmau}
**Câu lệnh mẫu 18.5 — Câu hỏi buộc trả lời theo nguồn**

```text
Chỉ trả lời dựa trên các nguồn đã nạp trong sổ tay này, không dùng
kiến thức bên ngoài. Câu hỏi: [câu hỏi nghiệp vụ].
Yêu cầu: mỗi ý gắn trích dẫn tới nguồn; ghi rõ Điều, khoản nếu có.
Nếu các nguồn không có căn cứ, trả lời "Không tìm thấy căn cứ trong
nguồn đã nạp", không suy đoán. Nếu các nguồn mâu thuẫn nhau, nêu rõ
nguồn nào nói gì. Cuối câu trả lời, liệt kê văn bản tôi cần mở để
kiểm chứng.
```
:::

(Câu lệnh mẫu 18.4 dành cho mục rà soát nhất quán ở ngày 11 có thể viết ngắn: "Kiểm tra văn bản dưới đây theo ba điểm: tổng điểm thành phần so với điểm tối đa; số liệu trong bảng so với lời văn; đánh số điều, khoản. Chỉ liệt kê điểm nghi vấn kèm vị trí, không tự sửa.")

::: {.canhbao}
**Cảnh báo: sổ tay hỏi đáp không phải tủ tài liệu nội bộ**

- Nguồn tải lên được lưu trên máy chủ của Google. Chỉ nạp văn bản đã công khai; không nạp tài liệu mật, dự thảo chưa công bố, thông tin cá nhân, thông tin về người khiếu nại, tố cáo.
- Khi chia sẻ cho đồng nghiệp, chọn quyền người xem. Kiểu liên kết chỉ hiện khung chat không phải cơ chế bảo mật: theo trợ giúp của Google, nó không thu hồi quyền truy cập vào nội dung bị ẩn.
- Phần mềm không biết văn bản nào còn hiệu lực. Kiểm tra hiệu lực là việc của người nạp nguồn. Phân hệ Sổ tay AI của Văn phòng đặt mọi nguồn gợi ý ở trạng thái "chưa xác định hiệu lực" cho tới khi có người đối chiếu xong.
:::

Chính tên miền mới này là một bài học. Ngày 22/10/2026, khi kiểm tra đường dẫn notebook do tôi đưa, tác tử AI lập trình phát hiện tên miền cũ trả về mã chuyển hướng: giả định trong trí nhớ của AI đã lỗi thời. Dự án sửa lại để nhận cả hai tên miền và luôn lưu theo tên miền hiện hành. Thông tin về sản phẩm bên ngoài phải được kiểm bằng thực tế, không tin trí nhớ của máy.

### 18.2.5. Ngày 14: đo thời gian cho trung thực

Ngày cuối tuần, đồng chí lập một bảng bốn cột cho 3 việc đã chọn ở ngày 8: tên việc; thời gian làm tay; thời gian có AI, **tính cả thời gian kiểm chứng và sửa**; ghi chú. Hãy ghi cả những lần AI làm chậm hơn, hay kết quả phải bỏ đi. Một bảng toàn con số đẹp thường là bảng chưa trung thực. Phân hệ Sổ tay AI cũng đặt chỉ tiêu giảm ít nhất 30% thời gian tra cứu, nhưng đó là chỉ tiêu đã đăng ký và được đo bằng một ô ghi "nếu tra thủ công mất bao nhiêu phút", chưa phải kết quả đã đạt. Đo trước, đo sau, ghi đúng là nền của mọi báo cáo hiệu quả về sau (Chương 17).

## 18.3. Tuần thứ ba: công cụ nhỏ đầu tiên (ngày 15–21)

Tuần này đồng chí bước lên Bậc 1 và Bậc 2: làm ra một công cụ mà người khác dùng được, không chỉ một câu trả lời trong khung chat.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 15 | Chọn bài toán, viết đặc tả một trang (30 phút) | Đặc tả một trang | Có mục "những điều không làm"? |
| 16 | Bảng tính theo dõi thời hạn do AI viết công thức (45 phút) | Tệp bảng tính dữ liệu giả | Ca "hạn hôm nay", "ô trống" ra đúng? |
| 17 | Kiểm thử bảng tính bằng ca biết đáp án (30 phút) | Trang "ca kiểm thử" trong tệp | Tổng số dòng trước và sau khớp nhau? |
| 18 | Dựng xưởng, hoặc chọn lối không cài đặt (45 phút) | Xưởng qua bảng kiểm mục 5.5 | Thư mục dự án nằm ngoài OneDrive? |
| 19 | Trang tra cứu danh mục văn bản của Ban (45 phút) | Tệp `index.html` chạy được | "giám sát" và "giam sat" cùng ra kết quả? |
| 20 | Đưa lên GitHub và Vercel (30 phút) | Địa chỉ web có nhãn "Bản demo thử nghiệm" | Mở trên điện thoại không tràn ngang? |
| 21 | Một đồng nghiệp dùng thử, ôn tuần (20 phút) | Ba góp ý đã ghi vào nhật ký | Đã ghi cả góp ý chê? |

### 18.3.1. Ngày 15–17: đặc tả một trang và bảng tính theo dõi thời hạn

Đặc tả một trang gồm sáu dòng: bài toán; ai dùng; dữ liệu vào và thuộc vùng nào; kết quả ra; quy tắc tính; những điều công cụ **không** làm. Trước khi viết, tự hỏi: việc này có quy tắc cố định không? Nếu có, một công thức hay một chương trình nhỏ là đủ, không cần AI chạy bên trong. Bản tin pháp luật hằng ngày trên Trang chủ của hệ thống là ví dụ: nó lấy tin từ nguồn chính thống, vẽ ảnh theo mẫu cố định, không gọi AI, không cần khóa API. AI chỉ có mặt ở khâu viết ra chương trình ấy.

::: {.lenhmau}
**Câu lệnh mẫu 18.4 — Bảng tính theo dõi thời hạn có ca kiểm thử**

```text
Tôi cần một bảng tính theo dõi thời hạn các việc được giao của phòng.
Cột: Tên việc, Ngày giao, Hạn hoàn thành, Ngày hoàn thành, Ghi chú.
Tôi sẽ tự nhập 8 dòng dữ liệu GIẢ, không có họ tên người thật.
Hãy viết công thức cho: cột "Còn lại (ngày)"; cột "Trạng thái" (Đã xong,
Đúng hạn, Sắp đến hạn trong 3 ngày, Quá hạn); ô đếm số việc quá hạn;
tô màu đỏ dòng quá hạn. Ô "Hạn hoàn thành" trống thì không báo lỗi.
Lập thêm 6 ca kiểm thử có đáp án: hạn đúng hôm nay; hạn hôm qua; đã
xong trước hạn; hạn trống; ngày đầu tháng; bảng chưa có dòng nào.
Giải thích công thức bằng tiếng Việt cho người không chuyên.
```
:::

Ngày 17, đồng chí tự gõ cả sáu ca vào một trang riêng tên "Ca kiểm thử" và so với đáp án. Hai ca cuối không phải để cho đủ số. Từ ngày 01/9/2026, ba phân hệ của hệ thống thử nghiệm trắng trang vào đầu tháng, vì phần mềm luôn đọc "người đứng đầu danh sách" trong khi kỳ mới chưa có ai; bản vá được ghi nhận ngày 28/9/2026 (Chương 9). Lỗi theo lịch không lộ ra lúc thử, chỉ lộ khi sang kỳ mới. Thêm một thói quen nữa: đếm tổng số dòng trước và sau mỗi lần sắp xếp, lọc, gộp dữ liệu. Hệ thống từng còn 27 người thay vì 28 sau khi gộp danh sách, vì hai đồng chí trùng họ tên bị ghép làm một.

Nếu dùng Google Trang tính, đồng chí có thể nhờ AI viết thêm một đoạn Apps Script gửi email nhắc việc sắp đến hạn. Khi chạy lần đầu, Google sẽ hỏi cấp quyền; hãy đọc kỹ đoạn mã xin những quyền gì trước khi đồng ý.

### 18.3.2. Ngày 18–21: trang tra cứu, khánh thành và người dùng đầu tiên

Ngày 18 có hai lối. **Lối đầy đủ** là dựng xưởng theo Chương 5: VS Code, Node.js, Git, GitHub và một tác tử AI lập trình. Lưu ý chi phí: theo trang giá của Anthropic, Claude Code không có trong gói miễn phí, gói thấp nhất là Pro 20 USD/tháng (17 USD nếu trả năm); GitHub Copilot có gói miễn phí với 2.000 gợi ý mã mỗi tháng, chat và tác tử hạn chế (giá tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). **Lối không cài đặt** dành cho máy bị khóa: nhờ chính trợ lý AI trò chuyện viết một tệp HTML duy nhất, lưu thành `index.html`, bấm đúp là chạy. Trang Bậc 2 không cần máy chủ, nên lối này vẫn đi được tới ngày 19; chỉ thiếu sổ lịch sử sửa đổi của Git.

Ngày 19, đồng chí làm trang tra cứu theo mục 5.4 và câu lệnh mẫu 5.1, với danh mục văn bản công khai của chính Ban mình. Ngoài các tiêu chí nghiệm thu trong câu lệnh, thử thêm: gõ một từ không có trong danh mục (trang phải báo "không tìm thấy"); gõ "báo" xem có kéo nhầm dòng chứa "bão" không. Bộ sinh bản tin của Văn phòng từng nhận "họp báo thường kỳ" thành tin bão vì so khớp sau khi bỏ dấu (Chương 15).

Ngày 20, đưa trang lên một kho GitHub **riêng tư** rồi triển khai trên Vercel, đầu trang ghi "Bản demo thử nghiệm". Ngày 21, mời một đồng nghiệp dùng thử năm phút, hỏi ba câu: tìm được thứ cần tìm chưa, mất bao lâu; chỗ nào khó hiểu; có muốn dùng tiếp không. Ghi cả ba câu trả lời, kể cả lời chê, vào tệp nhật ký của dự án.

## 18.4. Tuần thứ tư: ứng dụng có dữ liệu dùng chung (ngày 22–28)

Bậc 3 thay đổi về chất: nhiều người cùng đọc, cùng ghi một kho dữ liệu. Những lỗi bảng tính không bao giờ có bắt đầu xuất hiện: người này ghi đè người kia; khách thấy một danh sách, Quản trị thấy danh sách khác. Mục tiêu của tuần không phải một ứng dụng hoàn chỉnh, mà là đi trọn một vòng Bậc 3 với dữ liệu giả và hiểu từng chốt an toàn.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 22 | Đặc tả có phân quyền (30 phút) | Bảng "ai đọc, ai ghi" | Đã ghi rõ khách thấy gì? |
| 23 | Tạo kho dữ liệu, tệp `.env`, duyệt phương án (45 phút) | Phương án đã duyệt | Tệp `.env` có bị Git chặn? |
| 24 | Dựng màn hình xem, thêm, sửa; đăng nhập (45 phút) | Ứng dụng chạy ở máy | Lưu, tải lại trang, dữ liệu còn? |
| 25 | Kiểm thử theo vai và tình huống xấu (45 phút) | Bảng kiểm thử đã đánh dấu | Khách có ghi được dữ liệu không? |
| 26 | Triển khai, khai biến môi trường (30 phút) | Địa chỉ web chạy thật | Đã kiểm trên chính địa chỉ đó? |
| 27 | Mời 2–3 đồng nghiệp dùng thử (30 phút) | Phiếu góp ý | Có ai lỡ nhập dữ liệu thật? |
| 28 | Ghi nhật ký, viết hướng dẫn một trang (30 phút) | Nhật ký và hướng dẫn | Người khác đọc có chạy lại được? |

::: {.canhbao}
**Cảnh báo: tuần thứ tư chỉ dùng dữ liệu giả**

Kho dữ liệu, dịch vụ triển khai ở mức miễn phí đều đặt máy chủ ở nước ngoài và có điều kiện riêng: theo tài liệu của Supabase, gói miễn phí cho tối đa 2 dự án đang hoạt động, 500 MB mỗi dự án và tự tạm dừng dự án sau 1 tuần không hoạt động; gói Hobby của Vercel dành cho mục đích cá nhân, phi thương mại. Ứng dụng của tuần này là bản demo để học. Không nhập họ tên, số điện thoại, hồ sơ thật của bất kỳ ai, kể cả của chính mình.
:::

### 18.4.1. Ngày 22–24: đặc tả có phân quyền và màn hình đầu tiên

::: {.vidu}
**Ví dụ minh họa: sổ đăng ký sử dụng phòng họp**

Hãy hình dung một sổ đăng ký phòng họp dùng chung. Dữ liệu gồm tên cuộc họp, ngày, giờ, phòng, đơn vị đăng ký; không cần họ tên cá nhân. Khách xem được lịch đã duyệt. Người đăng nhập được đăng ký. Quản trị duyệt hoặc từ chối, và phần mềm cảnh báo khi trùng giờ. Phần mềm chỉ cảnh báo; quyết định duyệt luôn là của người, đúng nguyên tắc máy đề xuất – người quyết định.
:::

Ngày 23, đồng chí tạo dự án Supabase và tệp `.env` theo mục 5.3. Hai điều cần thuộc lòng. Một, quyền thật nằm ở cơ sở dữ liệu, không ở giao diện: ẩn một nút chỉ là không chỉ đường, cửa vẫn mở; chính sách bảo mật theo dòng giống thẻ ra vào, mới là khóa thật. Hai, khách và người đăng nhập phải đọc **cùng một nguồn**, chỉ khác quyền ghi. Hệ thống của Văn phòng từng cho khách dựng danh sách mẫu ngay trên máy, thế là khách và Quản trị thấy hai danh sách cán bộ khác nhau (Chương 12).

::: {.lenhmau}
**Câu lệnh mẫu 18.5 — Giao việc Bậc 3, bắt trình phương án trước**

```text
Đọc tệp DAC-TA.md trong thư mục này (sổ đăng ký phòng họp, dữ liệu giả).
Hãy trình phương án, CHƯA sửa tệp nào: cấu trúc bảng dữ liệu; chính sách
đọc/ghi cho ba vai khách, người đăng nhập, quản trị; danh sách tệp sẽ
tạo; những gì tôi phải tự làm trên trang quản trị Supabase.
Ràng buộc: khóa bí mật không mang tiền tố VITE_ và không vào mã nguồn;
khách và người đăng nhập đọc cùng một nguồn dữ liệu; không tự lưu lên
máy chủ khi chưa xác định xong phiên đăng nhập; giao diện tiếng Việt
có dấu, UTF-8, đầu trang ghi "Bản demo thử nghiệm".
Nghiệm thu: khách không ghi được; lưu xong tải lại trang dữ liệu còn
nguyên; hai cửa sổ cùng sửa một dòng thì có cảnh báo, không ghi đè mù.
```
:::

Ngày 24, sau khi duyệt phương án và để tác tử làm, phép thử đầu tiên là "lưu, tải lại trang, dữ liệu còn không", không phải nhìn dòng chữ "đã lưu". Danh bạ trong hệ thống của Văn phòng từng báo lưu thành công, tải lại thì trống, vì hàm chuẩn hóa dữ liệu chỉ giữ những trường đã khai tên.

### 18.4.2. Ngày 25–28: kiểm thử, khánh thành, người dùng thử và nhật ký

Ngày 25 dành cho tình huống xấu. Đồng chí thử lần lượt: vai khách, vai người đăng nhập, vai quản trị; bảng chưa có dòng nào; hai người cùng sửa; đăng nhập giữa chừng khi đang xem; màn hình điện thoại, chạm vào ô nhập xem trang có tự phóng to không. Sau đó giao tác tử một lượt rà soát chỉ đọc: "Hãy đóng vai kiểm toán viên bảo mật. Không sửa gì. Liệt kê những chỗ một người chưa đăng nhập có thể đọc hoặc ghi dữ liệu, những khóa có thể lộ xuống trình duyệt, và những chỗ khác đang đọc, ghi thứ vừa đổi." Câu hỏi cuối là quy tắc "rà soát chức năng liên quan" của dự án, ra đời sau sự cố dây chuyền ngày 13/8/2026 (Chương 7).

Ngày 26, triển khai lên Vercel và khai biến môi trường. Nghiệm thu trên chính địa chỉ web, không chỉ trên máy mình. Dự án từng có một tác vụ được coi là chạy hằng ngày, nhưng khi rà soát cả 18 kho mã mới thấy chưa có ảnh bản tin nào được đẩy lên. Đừng tin báo cáo "đã chạy"; hãy kiểm ở nơi người dùng nhìn thấy.

Ngày 27, mời 2–3 đồng nghiệp dùng thử, dặn trước chỉ nhập dữ liệu giả, rồi xin góp ý theo ba câu như ngày 21.

Ngày 28, ghi nhật ký theo khuôn của dự án: làm gì; vì sao; tệp nào; kiểm chứng thế nào, kết quả ra sao; việc gì người dùng phải tự làm. Kèm một trang hướng dẫn để người khác tiếp nhận được.

::: {.lenhmau}
**Câu lệnh mẫu 18.6 — Ghi nhật ký và chuẩn bị bàn giao**

```text
Đọc lịch sử commit và các tệp trong dự án. Hãy:
1. Bổ sung NHAT-KY.md một mục cho tuần này theo khuôn: làm gì, vì sao,
   tệp nào, kiểm chứng thế nào và kết quả, việc người dùng phải tự làm.
2. Viết HUONG-DAN.md một trang cho người tiếp nhận không chuyên: chạy
   thử ở máy, triển khai lại, các tài khoản liên quan (không ghi mật
   khẩu, không ghi khóa), những giới hạn của bản demo.
3. Cập nhật CLAUDE.md nếu có quy ước mới.
Trình nội dung để tôi duyệt rồi mới commit và đẩy lên.
```
:::

## 18.5. Nhịp mỗi ngày và bảng tự đánh giá cuối lộ trình (ngày 29–30)

### 18.5.1. Nhịp của một buổi học

Mỗi buổi 15–45 phút chia làm bốn nhịp: đọc lại ba dòng sổ tay của hôm trước; làm việc của ngày; tự kiểm tra; ghi ba dòng sổ tay mới. Một việc vượt quá 45 phút hai ngày liền là dấu hiệu việc quá to, cần chia nhỏ. Khi AI đi lạc, sửa vòng vo hay sửa chỗ này hỏng chỗ kia, đồng chí dừng lại, quay về bản đã lưu gần nhất và giao lại một việc nhỏ hơn (Chương 6).

### 18.5.2. Ngày 29: tự đánh giá

Đồng chí chấm từng dòng theo ba mức: 0 là chưa làm; 1 là đã làm nhưng chưa có bằng chứng đầy đủ; 2 là có bằng chứng, người khác kiểm lại được.

| Năng lực | Bằng chứng cần chỉ ra | Điểm |
|---|---|---|
| 1. Tài khoản an toàn (★) | Đã tắt huấn luyện, bật xác thực hai lớp | 0–2 |
| 2. Phân loại dữ liệu (★) | Bảng ba vùng; 30 ngày không dán dữ liệu ĐỎ | 0–2 |
| 3. Câu lệnh V-B-V-D-R | Ba câu lệnh đủ năm thành phần | 0–2 |
| 4. Kiểm chứng trích dẫn | Bảng đối chiếu của ngày 4 | 0–2 |
| 5. Thư viện câu lệnh | Từ 6 câu lệnh đúng khuôn | 0–2 |
| 6. Hỏi đáp có trích dẫn | Notebook, 5 câu hỏi đã bấm trích dẫn | 0–2 |
| 7. Đo thời gian trung thực | Bảng so sánh của ngày 14 | 0–2 |
| 8. Bảng tính có ca kiểm thử | Trang "Ca kiểm thử" đạt cả 6 ca | 0–2 |
| 9. Trang Bậc 2 trên mạng | Địa chỉ web có nhãn demo | 0–2 |
| 10. Ứng dụng Bậc 3 | Khách không ghi được; lưu, tải lại còn | 0–2 |
| 11. Bí mật ngoài kho mã (★) | Tệp `.env` bị chặn; mã không chứa khóa | 0–2 |
| 12. Nhật ký và bàn giao | Có nhật ký và hướng dẫn một trang | 0–2 |

Ba dòng có dấu (★) là điểm liệt: một dòng được 0 điểm thì phải khắc phục trước mọi việc khác, dù tổng điểm cao đến đâu. Với tổng điểm, tôi gợi ý: dưới 11 điểm, làm lại tuần thứ nhất và thứ hai với một việc khác; từ 11 đến 18 điểm, đồng chí đã vững Bậc 2, nên làm thêm một hai công cụ nhỏ trước khi lên Bậc 3; từ 19 điểm trở lên, đồng chí sẵn sàng thử Bậc 3 với một bài toán thật của phòng, sau khi đọc kỹ Chương 7 và Chương 19.

### 18.5.3. Ngày 30: mười phút trình bày

Ngày cuối, đồng chí trình bày mười phút với lãnh đạo phòng hoặc vài đồng nghiệp: một phút nêu bài toán; ba phút chạy thử; hai phút nói về dữ liệu và các chốt an toàn; hai phút trình bày số đo thời gian, kể cả chỗ chưa đạt; hai phút đề xuất bước tiếp: dừng ở bậc hiện tại, phát triển tiếp có kiểm soát, hay đề nghị đơn vị chuyên trách tiếp nhận. Hãy nói rõ ngay từ đầu: đây là bản demo thử nghiệm, không thay thế quy trình và văn bản chính thức.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Một cán bộ đi hết lộ trình cần khoảng 30 phút mỗi ngày trong bốn tuần; nên coi đó là thời gian học tập trong giờ làm việc.
- Hãy cung cấp bộ văn bản công khai của lĩnh vực; không giao dữ liệu thật của cơ quan để cán bộ "làm thử".
- Nghiệm thu bằng bảng tự đánh giá và buổi trình bày mười phút; câu hỏi đầu tiên nên là về dữ liệu và an toàn, sau đó mới đến tính năng.
- Không đòi kết quả nghiệp vụ chính thức từ bản demo; khuyến khích cán bộ ghi cả những lần thất bại.
- Cuối lộ trình là lúc lãnh đạo quyết định: dừng, phát triển tiếp có kiểm soát, hay chuyển giao.
:::

## Tóm tắt chương 18

::: {.tomtat}
1. Lộ trình gồm bốn tuần ứng với Bậc 0 đến Bậc 3 và hai ngày tự đánh giá; mỗi ngày 15–45 phút, một sản phẩm, một phép tự kiểm tra.
2. Việc đầu tiên là khóa quyền riêng tư: tắt chế độ cho phép dùng dữ liệu để huấn luyện, bật xác thực hai lớp, dùng email riêng.
3. Suốt 30 ngày chỉ dùng văn bản công khai và dữ liệu giả; phân loại ĐỎ/VÀNG/XANH trước khi gõ, nghi ngờ thì xếp lên vùng cao hơn.
4. AI viết công thức, mình giữ dữ liệu; mọi công thức và công cụ phải qua ca kiểm thử có đáp án biết trước, kể cả ca ngày đầu tháng và danh sách trống.
5. Hỏi đáp tra cứu phải có trích dẫn và phải kiểm hiệu lực văn bản bằng người; sổ tay trên Gemini Notebook chỉ nạp văn bản công khai.
6. Ở Bậc 3, quyền thật nằm ở cơ sở dữ liệu; khách và người đăng nhập đọc cùng một nguồn; nghiệm thu trên chính địa chỉ web người dùng mở.
7. Đo thời gian trung thực, ghi nhật ký, viết hướng dẫn bàn giao; kết thúc bằng bảng tự đánh giá có ba điểm liệt về an toàn.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong 10 loại giấy tờ trên bàn làm việc của đồng chí, loại nào khó xếp vùng nhất? Đồng chí sẽ hỏi ai để chốt?
2. Ở bài tập kiểm chứng trích dẫn, AI sai kiểu nào nhiều nhất: sai số hiệu, sai ngày, hay văn bản đã hết hiệu lực? Đồng chí sẽ thêm ràng buộc gì vào câu lệnh mẫu 18.2?
3. Lập bảng đo thời gian của ngày 14 cho một việc mới. Nếu thời gian có AI, tính cả kiểm chứng, không ngắn hơn làm tay, đồng chí kết luận gì?
4. Viết đặc tả một trang cho một công cụ Bậc 2 phục vụ đúng công việc của phòng mình, trong đó ghi ít nhất ba điều công cụ không làm.
5. Tự chấm bảng ở mục 18.5.2. Dòng nào được điểm thấp nhất, và kế hoạch hai tuần tới để nâng dòng đó là gì?
