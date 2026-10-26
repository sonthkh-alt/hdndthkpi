# Chương 18. Lộ trình 30 ngày cho người mới bắt đầu

::: {.muctieu}
**Mục tiêu của chương**

- Có lịch học cụ thể 30 ngày, mỗi ngày 15–45 phút, từ lần đầu trò chuyện với AI đến một ứng dụng nhỏ có dữ liệu, chạy trên mạng, có đồng nghiệp dùng thử.
- Hình thành thói quen an toàn từ ngày đầu: tắt chế độ cho phép dùng dữ liệu để huấn luyện, phân loại vùng ĐỎ/VÀNG/XANH trước khi gõ, chỉ luyện bằng văn bản công khai và dữ liệu giả.
- Làm ra ba sản phẩm của riêng mình: một thư viện câu lệnh cá nhân, một công cụ nhỏ, một ứng dụng bản demo có cơ sở dữ liệu kèm nhật ký.
- Tự đánh giá được mình đang đứng ở bậc nào trên thang 5 bậc kiến tạo và chọn bước tiếp theo vừa sức.

Dành cho: người mới hoàn toàn với AI và cán bộ, công chức muốn tự học có hệ thống; lãnh đạo phòng, lãnh đạo Ban nên đọc phần mở đầu, mục 18.5 và hộp "Dành cho lãnh đạo".
:::

Từ khi hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh (hdndthkpi.vercel.app) có nhiều phân hệ, câu tôi được hỏi nhiều nhất là: "Tôi chưa biết gì thì bắt đầu từ đâu?". Chương này trả lời bằng một thời khóa biểu: mỗi ngày một việc nhỏ, cuối mỗi tuần nhìn lại.

Lộ trình dựa trên ba nguyên tắc. **Ít mà đều:** mỗi ngày 15–45 phút, đều đặn hơn là học dồn. **Mỗi ngày một sản phẩm và một phép tự kiểm tra:** sản phẩm có thể chỉ là một câu lệnh đã lưu hay một tệp chạy được; phép tự kiểm tra trả lời bằng "có" hoặc "chưa", trả lời "chưa" thì ghi lý do, hôm sau làm bù. **An toàn đi trước:** suốt 30 ngày chỉ dùng văn bản đã công khai (vùng XANH theo cách phân loại của Tập 1) và dữ liệu giả do mình đặt ra. Người học thường lộ dữ liệu không phải vì cố ý, mà vì tiện tay dán một bảng tính thật vào khung chat.

Bốn tuần ứng với bốn nấc của thang 5 bậc kiến tạo ở Chương 2: tuần thứ nhất dùng AI trò chuyện cho đúng cách (Bậc 0); tuần thứ hai đưa AI vào chính việc của mình; tuần thứ ba làm một bảng tính có công thức do AI viết và một trang công cụ chạy trong trình duyệt (Bậc 1–2); tuần thứ tư làm ứng dụng có cơ sở dữ liệu, có đăng nhập (Bậc 3). Hai ngày cuối dành cho tự đánh giá và trình bày. Bận kỳ họp thì lùi lịch, nhưng không bỏ phần tự kiểm tra.

::: {.thuchanh}
**Thực hành: chuẩn bị trước ngày thứ nhất (khoảng 30 phút)**

1. Tạo một **sổ tay học tập** (tệp Word hoặc trang ghi chú cá nhân). Mỗi ngày ghi ba dòng: đã làm gì; sản phẩm nằm ở đâu; tự kiểm tra đạt hay chưa, vì sao.
2. Gom một **bộ văn bản luyện tập** gồm 5–7 văn bản đã công khai thuộc lĩnh vực mình phụ trách (luật, nghị định, nghị quyết đã ban hành, báo cáo đã công bố tại kỳ họp), ưu tiên bản có lớp chữ, tránh bản chụp (scan).
3. Chuẩn bị một **địa chỉ email riêng** cho việc học AI; không dùng lại mật khẩu của tài khoản công vụ.
4. Đặt **một khung giờ cố định** 30 phút mỗi ngày, như một cuộc họp với chính mình.
5. Nếu máy cơ quan bị khóa quyền cài đặt, hỏi bộ phận quản trị mạng ngay từ bây giờ; tuần thứ ba và thứ tư sẽ cần.
:::

## 18.1. Tuần thứ nhất: làm quen AI trò chuyện an toàn (ngày 1–7)

Mục tiêu của tuần là giao việc cho AI như cho một thư ký cao cấp, đúng tinh thần Tập 1, mà không để lọt thông tin không được phép. Chọn **một** trợ lý AI trò chuyện (Claude, ChatGPT hoặc Gemini); gói miễn phí đủ cho hai tuần đầu.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 1 | Mở tài khoản, khóa quyền riêng tư (30 phút) | Đã tắt huấn luyện, bật xác thực hai lớp | Mở lại Cài đặt: mục ấy còn tắt? |
| 2 | Xếp 10 loại giấy tờ vào ba vùng (20 phút) | Bảng phân loại của mình | Có dữ liệu cá nhân nào bị xếp XANH? |
| 3 | Bài tập 1: tóm tắt theo V-B-V-D-R (30 phút) | Câu lệnh đầu tiên, bản tóm tắt | Mỗi ý chỉ được chỗ trong văn bản gốc? |
| 4 | Bài tập 2: kiểm chứng trích dẫn (30 phút) | Bảng đối chiếu 5 văn bản | Đã tự tra đủ 5 văn bản? |
| 5 | Bài tập 3: soát chính tả, thể thức (30 phút) | Danh sách lỗi đã xác minh | Bao nhiêu "lỗi" thực ra không sai? |
| 6 | Bài tập 4 và 5 (45 phút) | Bản 5 ý, bảng so sánh | Còn câu "tô hồng" nào? |
| 7 | Ôn tuần, ghi sổ (15 phút) | Trang tổng kết tuần | Trả lời được 5 câu ở hộp Ghi nhớ? |

### 18.1.1. Ngày 1: mở tài khoản và khóa cửa quyền riêng tư

Tài khoản AI giống một tủ hồ sơ đặt ở trụ sở của người khác: việc đầu tiên là xem ai được mở nó. Đồng chí đăng ký bằng email riêng, đặt mật khẩu không trùng mật khẩu công vụ, bật xác thực hai lớp, rồi vào Cài đặt, tìm mục Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt lựa chọn cho phép dùng nội dung trò chuyện để cải thiện mô hình.

Với Claude, theo thông báo của Anthropic, từ ngày 28/8/2025 người dùng các gói cá nhân Free, Pro, Max được tự chọn; bật cho huấn luyện thì dữ liệu được lưu 5 năm, tắt thì lưu 30 ngày; mục này nằm trong Settings → Privacy. Với ChatGPT, mục tương ứng theo hướng dẫn trước đây là "Improve the model for everyone"; với Gemini là "Keep Activity". Tôi chưa kiểm chứng lại được giao diện hai dịch vụ này (10/2026), nên hãy đọc kỹ chữ trong mục quyền riêng tư thay vì tìm một tên nút cố định.

Phải làm ngay ngày đầu, vì với Claude, tắt huấn luyện chỉ áp dụng từ lúc tắt trở đi; dữ liệu đã dùng để huấn luyện trước đó không được gỡ ra. Và tắt huấn luyện chỉ giảm rủi ro, không biến tài khoản cá nhân thành nơi được phép chứa tài liệu nội bộ hay tài liệu mật.

### 18.1.2. Ngày 2: tập phân loại vùng ĐỎ, VÀNG, XANH

Tập 1 chia dữ liệu thành ba vùng: ĐỎ là tài liệu mật và dữ liệu cá nhân nhạy cảm, tuyệt đối không đưa lên AI công cộng; VÀNG là tài liệu nội bộ, dự thảo chưa chốt, chỉ dùng sau khi ẩn danh và cân nhắc kỹ; XANH là thông tin đã công khai. Hôm nay đồng chí không mở AI, chỉ tự xếp 10 loại giấy tờ trên bàn làm việc vào ba vùng.

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

Bảng của đồng chí có thể khác, tùy công việc. Khi phân vân, xếp lên vùng cao hơn. Tổng hợp kiến nghị cử tri chỉ xuống vùng VÀNG sau khi đã xóa sạch họ tên, địa chỉ, số điện thoại của người kiến nghị.
:::

Danh bạ trong bảng không phải ví dụ ngẫu nhiên: vì kho mã của hệ thống là kho công khai, tệp danh bạ thật bị chặn khỏi kho mã, kèm một phép kiểm "không có số điện thoại nào trong mã nguồn".

::: {.phaply}
**Căn cứ pháp lý: vì sao phải phân loại trước khi gõ**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Quốc hội thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026) chia dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.
- Nghị định 356/2025/NĐ-CP (có hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP) liệt kê tại Điều 3 các dữ liệu cá nhân cơ bản, trong đó có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình; khoản 1 Điều 4 liệt kê dữ liệu nhạy cảm như quan điểm chính trị, tôn giáo, tín ngưỡng, tình trạng sức khỏe, đời sống riêng tư.
- Các quy định về bảo vệ bí mật nhà nước nghiêm cấm soạn thảo, lưu giữ tài liệu có nội dung bí mật nhà nước trên máy tính, thiết bị đã hoặc đang kết nối Internet, trừ trường hợp theo quy định về cơ yếu.
- Luật Trí tuệ nhân tạo số 134/2025/QH15 (có hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người."

Đối chiếu đến ngày 26/10/2026; trước khi áp dụng, tra lại nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

### 18.1.3. Ngày 3 đến ngày 6: năm bài tập với văn bản công khai

Mỗi bài tập rèn một kỹ năng của Tập 1, dùng chung bộ văn bản luyện tập; tuần thứ ba, thứ tư sẽ dùng lại các kỹ năng này khi giao việc cho tác tử AI lập trình.

**Bài tập 1 (ngày 3) — Tóm tắt có địa chỉ.** Chọn một văn bản 5–15 trang. Lần đầu gõ trơn "tóm tắt văn bản này"; lần hai dùng câu lệnh mẫu 18.1 theo khung V-B-V-D-R (Vai – Bối cảnh – Việc – Dạng – Ràng buộc), rồi so sánh. Phần ghi vị trí trong ngoặc giúp đồng chí kiểm chứng trong vài phút thay vì đọc lại cả văn bản.

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

**Bài tập 2 (ngày 4) — Bắt AI nói "không biết".** Tập 1 đã cảnh báo: AI không biết văn bản pháp luật vừa ban hành. Dùng câu lệnh mẫu 18.2, rồi tra từng văn bản AI nêu trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo, ghi kết quả: đúng, sai số hiệu, sai ngày, đã hết hiệu lực, hay không tồn tại. Trí nhớ của AI dừng ở một thời điểm, nên nó có thể coi văn bản đã bị thay thế là còn hiện hành.

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

**Bài tập 3 (ngày 5) — Soát lỗi, và soát cả người soát.** Nhờ AI soát chính tả và thể thức một văn bản hành chính đã ban hành, đã đăng công khai của cơ quan, theo Nghị định 30/2020/NĐ-CP về công tác văn thư; rồi tự xác minh từng lỗi AI nêu và đếm số "lỗi" thực ra không sai. Đề xuất sửa của AI cũng phải được thẩm định như đề xuất của một chuyên viên mới. Văn bản của tổ chức Đảng có tiêu đề, thể thức riêng; hệ thống của Văn phòng từng in nhầm tên cơ quan hành chính lên đầu bản tự kiểm điểm đảng viên.

**Bài tập 4 (ngày 6, phần đầu) — Viết cho lãnh đạo, không tô hồng.** Yêu cầu AI rút một báo cáo dài đã công bố thành đúng 5 ý để lãnh đạo đọc trong một phút: văn phong trung lập, nêu cả mặt hạn chế, cấm các cụm như "vô cùng to lớn", "bước đột phá". Gạch bỏ mọi câu khen mà văn bản gốc không có căn cứ.

**Bài tập 5 (ngày 6, phần sau) — Để AI hỏi ngược.** Thêm vào cuối một yêu cầu câu: "Trước khi làm, hãy hỏi tôi tối đa 5 câu để làm rõ yêu cầu." Trả lời xong mới cho AI làm, rồi yêu cầu lập bảng so sánh 2–3 phương án theo tiêu chí của đồng chí (kỹ thuật ma trận so sánh của Tập 1). Với trợ lý trò chuyện, yêu cầu mơ hồ cho ra một đoạn văn dở; với tác tử lập trình, nó có thể cho ra cả chục tệp sai.

### 18.1.4. Ngày 7: ôn tuần và ghi sổ

Đọc lại sổ tay, lưu các câu lệnh dùng tốt vào một tệp riêng và tự trả lời năm câu hỏi dưới đây; câu nào chưa chắc thì làm lại đúng ngày đó.

::: {.ghinho}
**Ghi nhớ: năm câu hỏi trước mỗi lần gõ vào khung chat**

1. Thông tin mình sắp dán thuộc vùng nào: ĐỎ, VÀNG hay XANH?
2. Tài khoản này đã tắt chế độ cho phép dùng dữ liệu để huấn luyện chưa?
3. Câu lệnh đã đủ năm thành phần V-B-V-D-R chưa?
4. Mình sẽ kiểm chứng kết quả bằng nguồn nào, mất bao lâu?
5. Nếu dùng kết quả này mà sai, ai chịu trách nhiệm? Câu trả lời luôn là: chính mình.
:::

## 18.2. Tuần thứ hai: đưa AI vào việc của chính mình (ngày 8–14)

Tuần thứ hai chuyển sang những việc đồng chí thật sự làm hằng tháng, với câu hỏi: việc nào nên giao cho AI, và giao đến đâu.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 8 | Lập bản đồ công việc (20 phút) | 3 việc kèm vùng dữ liệu | Làm được bằng dữ liệu XANH hoặc giả? |
| 9 | Nhờ AI viết công thức bảng tính (30 phút) | Bảng tính, 5 ca thử | Cả 5 ca khớp kết quả tính tay? |
| 10 | Tóm tắt văn bản dài theo kỹ thuật phân tầng (45 phút) | Bản tóm tắt có chỉ dẫn mục | Kiểm ngẫu nhiên 3 ý: đúng nguyên văn? |
| 11 | Rà soát nhất quán một văn bản (30 phút) | Bảng điểm nghi vấn | Đã tự đọc lại văn bản gốc? |
| 12 | Dựng thư viện câu lệnh cá nhân (30 phút) | Thư viện từ 6 câu lệnh | Câu lệnh nào cũng ghi vùng dữ liệu? |
| 13 | Gemini Notebook với văn bản công khai (45 phút) | Notebook 3–5 nguồn, 5 câu hỏi | Số trích dẫn ra đúng đoạn? |
| 14 | Ôn tuần, đo thời gian thật (20 phút) | Bảng so sánh làm tay và có AI | Đã ghi cả lần AI làm chậm hơn? |

### 18.2.1. Ngày 8 và 9: bản đồ công việc, rồi bảng tính

Ngày 8, đồng chí liệt kê khoảng 10 việc lặp lại trong tháng, rồi chọn 3 việc vừa tốn thời gian, vừa có quy tắc tương đối rõ, vừa làm được bằng văn bản công khai hoặc dữ liệu giả cùng cấu trúc. Việc chỉ làm được bằng dữ liệu vùng ĐỎ thì gạch khỏi danh sách luyện tập.

Ngày 9 là bài học quan trọng nhất của tuần: **AI viết công thức, mình giữ dữ liệu.** AI chỉ cần biết tên cột và vài dòng giả, không cần bảng tính thật có họ tên, ngày sinh.

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

Câu lệnh này mô phỏng cách chấm từng nhiệm vụ của phân hệ Đánh giá OKR/KPI (Chương 9). Ca kiểm thử đầu tiên nên là ví dụ chuẩn trong dự thảo hướng dẫn lập danh mục sản phẩm, công việc: giao 10, hoàn thành 10, đạt chuẩn, chậm ít, kết quả (100 + 100 + 80) / 3 = 93,3%.

::: {.cauchuyen}
**Câu chuyện thực tế: bảng tính trở thành thước nghiệm thu**

Trước khi có phần mềm, tôi mô phỏng cách tính điểm theo Nghị định 335/2025/NĐ-CP và quy định của Tỉnh ủy trong một tệp Excel gọi là "Engine tính điểm". Đặc tả yêu cầu phần mềm về sau ghi tệp ấy là bộ ca kiểm thử bắt buộc: với cùng đầu vào, phần mềm phải cho kết quả khớp Excel tới hai chữ số thập phân. Bảng tính nhỏ của ngày thứ chín cũng có thể thành thước nghiệm thu ứng dụng của đồng chí sau này.
:::

### 18.2.2. Ngày 10 và 11: tóm tắt phân tầng và rà soát nhất quán

Ngày 10, áp dụng kỹ thuật phân tầng của Tập 1 cho một văn bản trên 30 trang: AI lập dàn ý; đồng chí duyệt dàn ý; AI tóm tắt từng phần; cuối cùng mới ghép và hiệu đính.

Ngày 11, dùng AI soi chỗ chưa nhất quán bên trong một văn bản đã công bố: "Kiểm tra văn bản dưới đây theo ba điểm: tổng điểm thành phần so với điểm tối đa; số liệu trong bảng so với lời văn; đánh số điều, khoản. Chỉ liệt kê điểm nghi vấn kèm vị trí, không tự sửa." Những câu hỏi kiểu này từng làm lộ ra 6 chỗ chưa nhất quán trong dự thảo Khung tiêu chí đánh giá HĐND, chẳng hạn một tiêu chí 6 điểm mà các mức cộng lại thành 9 điểm (Chương 8). AI chỉ kiến nghị; quyền sửa văn bản thuộc cơ quan có thẩm quyền.

### 18.2.3. Ngày 12: thư viện câu lệnh cá nhân

Đến ngày 12, đồng chí đã có ít nhất 6 câu lệnh dùng được. Hãy cất chúng vào một tệp có cấu trúc, như sổ mẫu văn bản của phòng.

| Trường | Ghi gì |
|---|---|
| Tên | Ngắn, gợi việc, ví dụ "Tóm tắt có địa chỉ" |
| Mục đích | Dùng khi nào |
| Vùng dữ liệu | Được dùng với vùng nào, ví dụ "chỉ XANH" |
| Nội dung | Toàn văn câu lệnh, chỗ điền để trong ngoặc vuông |
| Cách kiểm chứng | Đối chiếu với nguồn nào |
| Lần sửa gần nhất | Ngày và lý do sửa |

Thư viện không lưu kèm dữ liệu thật. Theo quy tắc 20/80 của Tập 1, nếu lần nào cũng phải sửa tới 60–70% câu chữ AI trả về thì lỗi nằm ở câu lệnh: sửa câu lệnh và ghi lại lý do. Phụ lục 2 có thêm khoảng 40 câu lệnh.

### 18.2.4. Ngày 13: sổ tay hỏi đáp có trích dẫn trên Gemini Notebook

Gemini Notebook (trước đây là NotebookLM) của Google trả lời dựa trên các nguồn do người dùng nạp vào, kèm số trích dẫn bấm vào là xem được đoạn gốc. Google đổi tên sản phẩm ngày 16/7/2026; địa chỉ hiện hành là `notebook.google.com`. Phân hệ Sổ tay AI của Văn phòng dựa trên công cụ này (Chương 15).

Trong 45 phút: đăng nhập tài khoản Google của mình; tạo một notebook đặt tên theo lĩnh vực; nạp 3–5 văn bản công khai đã tự kiểm tra còn hiệu lực; đặt 5 câu hỏi theo câu lệnh mẫu 18.4; bấm từng số trích dẫn xem đoạn gốc có thật sự nói điều đó không. Theo thông báo của Google, từ ngày 02/9/2026 hạn mức tính theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ và có trần theo tuần.

::: {.lenhmau}
**Câu lệnh mẫu 18.4 — Câu hỏi buộc trả lời theo nguồn**

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

::: {.canhbao}
**Cảnh báo: sổ tay hỏi đáp không phải tủ tài liệu nội bộ**

- Nguồn tải lên được lưu trên máy chủ của Google. Chỉ nạp văn bản đã công khai; không nạp tài liệu mật, dự thảo chưa công bố, thông tin cá nhân, thông tin về người khiếu nại, tố cáo.
- Khi chia sẻ, chọn quyền người xem. Kiểu liên kết chỉ hiện khung chat không phải cơ chế bảo mật: theo trợ giúp của Google, nó không thu hồi quyền truy cập vào nội dung bị ẩn.
- Phần mềm không biết văn bản nào còn hiệu lực; kiểm tra hiệu lực là việc của người nạp nguồn. Phân hệ Sổ tay AI của Văn phòng đặt mọi nguồn gợi ý ở trạng thái "chưa xác định hiệu lực" cho tới khi có người đối chiếu xong.
:::

Ngay tên miền mới cũng là bài học: ngày 22/10/2026, tác tử AI lập trình chỉ phát hiện tên miền cũ đã chuyển hướng khi kiểm tra đường dẫn thật tôi đưa; trí nhớ của nó đã lỗi thời.

### 18.2.5. Ngày 14: đo thời gian cho trung thực

Lập bảng bốn cột cho 3 việc đã chọn ở ngày 8: tên việc; thời gian làm tay; thời gian có AI, **tính cả kiểm chứng và sửa**; ghi chú. Ghi cả những lần AI làm chậm hơn. Phân hệ Sổ tay AI đặt chỉ tiêu giảm ít nhất 30% thời gian tra cứu, nhưng đó là chỉ tiêu đã đăng ký, chưa phải kết quả. Đo đúng là nền của mọi báo cáo hiệu quả (Chương 17).

## 18.3. Tuần thứ ba: công cụ nhỏ đầu tiên (ngày 15–21)

Tuần này đồng chí lên Bậc 1 và Bậc 2: làm ra một công cụ người khác dùng được.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 15 | Viết đặc tả một trang (30 phút) | Đặc tả một trang | Có mục "những điều không làm"? |
| 16 | Bảng tính theo dõi thời hạn (45 phút) | Tệp bảng tính dữ liệu giả | Ca "hạn hôm nay", "ô trống" ra đúng? |
| 17 | Kiểm thử bằng ca biết đáp án (30 phút) | Trang "Ca kiểm thử" | Tổng số dòng trước và sau khớp? |
| 18 | Dựng xưởng hoặc chọn lối không cài đặt (45 phút) | Xưởng qua bảng kiểm mục 5.5 | Thư mục nằm ngoài OneDrive? |
| 19 | Trang tra cứu danh mục văn bản của Ban (45 phút) | Tệp `index.html` chạy được | "giám sát", "giam sat" cùng ra kết quả? |
| 20 | Đưa lên GitHub và Vercel (30 phút) | Địa chỉ web có nhãn demo | Mở trên điện thoại không tràn ngang? |
| 21 | Một đồng nghiệp dùng thử (20 phút) | Ba góp ý trong nhật ký | Đã ghi cả góp ý chê? |

### 18.3.1. Ngày 15–17: đặc tả một trang và bảng tính theo dõi thời hạn

Đặc tả một trang gồm sáu dòng: bài toán; ai dùng; dữ liệu vào và thuộc vùng nào; kết quả ra; quy tắc tính; những điều công cụ **không** làm. Trước khi viết, tự hỏi: việc này có quy tắc cố định không? Có thì một công thức hay một chương trình nhỏ là đủ, không cần AI chạy bên trong. Bản tin pháp luật hằng ngày trên Trang chủ của hệ thống lấy tin từ nguồn chính thống, vẽ ảnh theo mẫu cố định, không gọi AI; AI chỉ giúp viết ra chương trình ấy.

::: {.lenhmau}
**Câu lệnh mẫu 18.5 — Bảng tính theo dõi thời hạn có ca kiểm thử**

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

Ngày 17, đồng chí tự gõ cả sáu ca vào trang "Ca kiểm thử" và so với đáp án. Hai ca cuối có lý do: từ ngày 01/9/2026, ba phân hệ của hệ thống trắng trang vào đầu tháng, vì phần mềm luôn đọc "người đứng đầu danh sách" trong khi kỳ mới chưa có ai; bản vá được ghi nhận ngày 28/9/2026 (Chương 9). Lỗi theo lịch chỉ lộ khi sang kỳ mới. Hãy tập cả thói quen đếm tổng số dòng trước và sau mỗi lần gộp: hệ thống từng còn 27 người thay vì 28, vì hai đồng chí trùng họ tên bị ghép làm một.

Dùng Google Trang tính thì có thể nhờ AI viết thêm đoạn Apps Script gửi email nhắc hạn; khi Google hỏi cấp quyền, đọc kỹ đoạn mã xin quyền gì rồi mới đồng ý.

### 18.3.2. Ngày 18–21: trang tra cứu, khánh thành và người dùng đầu tiên

Ngày 18 có hai lối. **Lối đầy đủ** là dựng xưởng theo Chương 5. Theo trang giá của Anthropic, Claude Code không có trong gói miễn phí, gói thấp nhất là Pro 20 USD/tháng; GitHub Copilot có gói miễn phí với 2.000 gợi ý mã mỗi tháng (giá tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). **Lối không cài đặt** dành cho máy bị khóa: nhờ trợ lý AI trò chuyện viết một tệp HTML duy nhất, lưu thành `index.html`, bấm đúp là chạy. Trang Bậc 2 không cần máy chủ, nên lối này vẫn đi tiếp được.

Ngày 19, làm trang tra cứu theo mục 5.4 và câu lệnh mẫu 5.1, với danh mục văn bản công khai của Ban mình. Thử thêm: gõ một từ không có trong danh mục (trang phải báo "không tìm thấy"); gõ "báo" xem có kéo nhầm dòng chứa "bão" không. Bộ sinh bản tin của Văn phòng từng nhận "họp báo thường kỳ" thành tin bão vì bỏ dấu khi so khớp (Chương 15).

Ngày 20, đưa trang lên một kho GitHub **riêng tư**, triển khai trên Vercel, đầu trang ghi "Bản demo thử nghiệm". Ngày 21, mời một đồng nghiệp dùng thử năm phút, hỏi ba câu: tìm được thứ cần chưa, mất bao lâu; chỗ nào khó hiểu; có muốn dùng tiếp không. Ghi cả lời chê vào nhật ký.

## 18.4. Tuần thứ tư: ứng dụng có dữ liệu dùng chung (ngày 22–28)

Bậc 3 thay đổi về chất: nhiều người cùng đọc, cùng ghi một kho dữ liệu, nên xuất hiện những lỗi bảng tính không có, như người này ghi đè người kia. Mục tiêu của tuần là đi trọn một vòng Bậc 3 với dữ liệu giả và hiểu từng chốt an toàn.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 22 | Đặc tả có phân quyền (30 phút) | Bảng "ai đọc, ai ghi" | Đã ghi rõ khách thấy gì? |
| 23 | Tạo kho dữ liệu, tệp `.env`, duyệt phương án (45 phút) | Phương án đã duyệt | Tệp `.env` bị Git chặn? |
| 24 | Dựng màn hình và đăng nhập (45 phút) | Ứng dụng chạy ở máy | Lưu, tải lại trang, dữ liệu còn? |
| 25 | Kiểm thử theo vai, tình huống xấu (45 phút) | Bảng kiểm thử đã đánh dấu | Khách có ghi được dữ liệu? |
| 26 | Triển khai, khai biến môi trường (30 phút) | Địa chỉ web chạy thật | Đã kiểm trên chính địa chỉ đó? |
| 27 | Mời 2–3 đồng nghiệp dùng thử (30 phút) | Phiếu góp ý | Có ai lỡ nhập dữ liệu thật? |
| 28 | Ghi nhật ký, viết hướng dẫn (30 phút) | Nhật ký và hướng dẫn | Người khác đọc chạy lại được? |

::: {.canhbao}
**Cảnh báo: tuần thứ tư chỉ dùng dữ liệu giả**

Các dịch vụ ở mức miễn phí đặt máy chủ ở nước ngoài và có điều kiện riêng. Theo tài liệu của Supabase, gói miễn phí cho tối đa 2 dự án đang hoạt động, 500 MB mỗi dự án, và tự tạm dừng dự án sau 1 tuần không hoạt động; gói Hobby của Vercel dành cho mục đích cá nhân, phi thương mại. Ứng dụng của tuần này là bản demo để học: không nhập họ tên, số điện thoại, hồ sơ thật của bất kỳ ai.
:::

### 18.4.1. Ngày 22–24: đặc tả có phân quyền và màn hình đầu tiên

::: {.vidu}
**Ví dụ minh họa: sổ đăng ký sử dụng phòng họp**

Hãy hình dung một sổ đăng ký phòng họp dùng chung. Dữ liệu gồm tên cuộc họp, ngày, giờ, phòng, đơn vị đăng ký; không cần họ tên cá nhân. Khách xem lịch đã duyệt; người đăng nhập được đăng ký; Quản trị duyệt hoặc từ chối; phần mềm cảnh báo khi trùng giờ. Phần mềm chỉ cảnh báo, quyết định duyệt luôn là của người: máy đề xuất – người quyết định.
:::

Ngày 23, đồng chí tạo dự án Supabase và tệp `.env` theo mục 5.3. Hai điều cần thuộc lòng. Một, quyền thật nằm ở cơ sở dữ liệu: ẩn một nút chỉ là không chỉ đường, cửa vẫn mở; chính sách bảo mật theo dòng mới là "thẻ ra vào". Hai, khách và người đăng nhập đọc **cùng một nguồn**, chỉ khác quyền ghi; hệ thống của Văn phòng từng để khách dựng danh sách mẫu tại máy, thế là khách và Quản trị thấy hai danh sách cán bộ khác nhau (Chương 12).

::: {.lenhmau}
**Câu lệnh mẫu 18.6 — Giao việc Bậc 3, bắt trình phương án trước**

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

Ngày 24, sau khi duyệt phương án và để tác tử làm, phép thử đầu tiên là "lưu, tải lại trang, dữ liệu còn không", không phải nhìn dòng chữ "đã lưu". Danh bạ trong hệ thống của Văn phòng từng báo lưu thành công mà tải lại thì trống, vì hàm chuẩn hóa dữ liệu chỉ giữ những trường đã khai tên.

### 18.4.2. Ngày 25–28: kiểm thử, khánh thành, người dùng thử và nhật ký

Ngày 25, đồng chí thử ba vai khách, người đăng nhập, quản trị; bảng chưa có dòng nào; hai người cùng sửa; màn hình điện thoại. Sau đó giao tác tử một lượt rà soát chỉ đọc: "Đóng vai kiểm toán viên bảo mật, không sửa gì. Liệt kê những chỗ người chưa đăng nhập có thể đọc hoặc ghi dữ liệu, những khóa có thể lộ xuống trình duyệt, và những chỗ khác đang đọc, ghi thứ vừa đổi." Câu hỏi cuối là quy tắc "rà soát chức năng liên quan" của dự án, ra đời sau sự cố dây chuyền ngày 13/8/2026 (Chương 7).

Ngày 26, triển khai lên Vercel, khai biến môi trường, rồi nghiệm thu trên chính địa chỉ web. Dự án từng có một tác vụ được coi là chạy hằng ngày, nhưng rà soát cả 18 kho mã mới thấy chưa có ảnh bản tin nào được đẩy lên: hãy kiểm ở nơi người dùng nhìn thấy.

Ngày 27, mời 2–3 đồng nghiệp dùng thử, dặn chỉ nhập dữ liệu giả, xin góp ý theo ba câu như ngày 21. Ngày 28, ghi nhật ký theo khuôn của dự án (làm gì, vì sao, tệp nào, kiểm chứng ra sao, việc người dùng phải tự làm) và viết một trang hướng dẫn để người khác tiếp nhận được.

::: {.lenhmau}
**Câu lệnh mẫu 18.7 — Ghi nhật ký và chuẩn bị bàn giao**

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

Mỗi buổi chia bốn nhịp: đọc lại sổ tay hôm trước; làm việc của ngày; tự kiểm tra; ghi ba dòng sổ tay mới. Việc nào vượt 45 phút hai ngày liền là quá to, cần chia nhỏ. Khi AI đi lạc, sửa vòng vo hay sửa chỗ này hỏng chỗ kia, hãy dừng lại, quay về bản đã lưu gần nhất và giao một việc nhỏ hơn (Chương 6).

### 18.5.2. Ngày 29: tự đánh giá

Chấm từng dòng theo ba mức: 0 là chưa làm; 1 là đã làm nhưng chưa đủ bằng chứng; 2 là có bằng chứng, người khác kiểm lại được.

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

Ba dòng có dấu (★) là điểm liệt: dòng nào được 0 điểm thì khắc phục trước mọi việc khác, dù tổng điểm cao đến đâu. Với tổng điểm, tôi gợi ý: dưới 11, làm lại tuần thứ nhất và thứ hai với một việc khác; từ 11 đến 18, đã vững Bậc 2, nên làm thêm một hai công cụ nhỏ; từ 19 trở lên, có thể thử Bậc 3 với bài toán thật của phòng, sau khi đọc kỹ Chương 7 và Chương 19.

### 18.5.3. Ngày 30: mười phút trình bày

Ngày cuối, đồng chí trình bày mười phút với lãnh đạo phòng hoặc vài đồng nghiệp: bài toán; chạy thử; dữ liệu và các chốt an toàn; số đo thời gian, kể cả chỗ chưa đạt; đề xuất bước tiếp. Nói rõ ngay từ đầu: đây là bản demo thử nghiệm, không thay thế quy trình và văn bản chính thức.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Một cán bộ đi hết lộ trình cần khoảng 30 phút mỗi ngày trong bốn tuần; nên coi đó là thời gian học tập trong giờ làm việc.
- Cung cấp bộ văn bản công khai của lĩnh vực; không giao dữ liệu thật của cơ quan để "làm thử".
- Nghiệm thu bằng bảng tự đánh giá và buổi trình bày mười phút; hỏi về dữ liệu và an toàn trước, tính năng sau.
- Không đòi kết quả nghiệp vụ chính thức từ bản demo; khuyến khích ghi cả những lần thất bại.
- Cuối lộ trình, lãnh đạo quyết định: dừng, phát triển tiếp có kiểm soát, hay chuyển giao.
:::

## Tóm tắt chương 18

::: {.tomtat}
1. Lộ trình gồm bốn tuần ứng với Bậc 0 đến Bậc 3 và hai ngày tự đánh giá; mỗi ngày 15–45 phút, một sản phẩm, một phép tự kiểm tra.
2. Việc đầu tiên là khóa quyền riêng tư: tắt chế độ cho phép dùng dữ liệu để huấn luyện, bật xác thực hai lớp, dùng email riêng.
3. Suốt 30 ngày chỉ dùng văn bản công khai và dữ liệu giả; phân loại ĐỎ/VÀNG/XANH trước khi gõ, phân vân thì xếp lên vùng cao hơn.
4. AI viết công thức, mình giữ dữ liệu; mọi công cụ phải qua ca kiểm thử có đáp án biết trước, kể cả ca ngày đầu tháng và danh sách trống.
5. Tra cứu phải có trích dẫn, hiệu lực văn bản do người kiểm; Gemini Notebook chỉ nạp văn bản công khai.
6. Ở Bậc 3, quyền thật nằm ở cơ sở dữ liệu; khách và người đăng nhập đọc cùng một nguồn; nghiệm thu trên chính địa chỉ web.
7. Đo thời gian trung thực, ghi nhật ký, viết hướng dẫn bàn giao; bảng tự đánh giá có ba điểm liệt về an toàn.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong 10 loại giấy tờ trên bàn làm việc của đồng chí, loại nào khó xếp vùng nhất? Đồng chí sẽ hỏi ai để chốt?
2. Ở bài tập kiểm chứng trích dẫn, AI sai kiểu nào nhiều nhất? Đồng chí sẽ thêm ràng buộc gì vào câu lệnh mẫu 18.2?
3. Nếu thời gian có AI, tính cả kiểm chứng, không ngắn hơn làm tay, đồng chí kết luận gì về việc đó?
4. Viết đặc tả một trang cho một công cụ Bậc 2 phục vụ đúng công việc của phòng mình, ghi ít nhất ba điều công cụ không làm.
5. Tự chấm bảng ở mục 18.5.2. Dòng nào thấp điểm nhất, và kế hoạch hai tuần tới để nâng dòng đó là gì?
