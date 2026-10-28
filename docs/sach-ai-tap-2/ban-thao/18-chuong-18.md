# Chương 18. Lộ trình 30 ngày cho người mới bắt đầu

::: {.muctieu}
**Mục tiêu của chương**

- Có lịch học cụ thể 30 ngày, mỗi ngày 15–45 phút, từ lần đầu trò chuyện với AI đến một ứng dụng nhỏ có dữ liệu, chạy trên mạng, có đồng nghiệp dùng thử.
- Hình thành thói quen an toàn từ ngày đầu: tắt chế độ cho phép dùng dữ liệu để huấn luyện, xếp thông tin vào một trong bốn cấp dữ liệu của Tập 1 trước khi gõ, chỉ luyện bằng văn bản công khai và dữ liệu giả.
- Làm ra ba sản phẩm của riêng mình: một thư viện câu lệnh cá nhân, một công cụ nhỏ, một ứng dụng bản demo có cơ sở dữ liệu kèm nhật ký.
- Tự đánh giá được mình đang đứng ở bậc nào trên thang 5 bậc kiến tạo và chọn bước tiếp theo vừa sức.

Dành cho: người mới hoàn toàn với AI và cán bộ, công chức muốn tự học có hệ thống; lãnh đạo phòng, lãnh đạo Ban nên đọc phần mở đầu, mục 18.5 và hộp "Dành cho lãnh đạo".
:::

Từ khi hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh (hdndthkpi.vercel.app) có nhiều phân hệ, câu tôi được hỏi nhiều nhất là: "Tôi chưa biết gì thì bắt đầu từ đâu?". Chương này trả lời bằng một thời khóa biểu: mỗi ngày một việc nhỏ, cuối tuần nhìn lại.

Lộ trình dựa trên ba nguyên tắc. **Ít mà đều:** mỗi ngày 15–45 phút, đều đặn hơn là học dồn. **Mỗi ngày một sản phẩm và một phép tự kiểm tra:** sản phẩm có thể chỉ là một câu lệnh đã lưu; phép tự kiểm tra trả lời "có" hoặc "chưa", "chưa" thì ghi lý do, hôm sau làm bù. **An toàn đi trước:** suốt 30 ngày chỉ dùng văn bản đã công khai (Cấp 1 trong phân loại dữ liệu 4 cấp của Tập 1) và dữ liệu giả. Người học thường lộ dữ liệu không phải vì cố ý, mà vì tiện tay dán một bảng tính thật vào khung chat.

Bốn tuần ứng với bốn nấc của thang 5 bậc kiến tạo ở Chương 2: tuần thứ nhất và thứ hai chủ yếu dùng AI trò chuyện cho đúng cách, cho chính việc của mình (Bậc 0); tuần thứ ba làm bảng tính có công thức do AI viết và trang công cụ chạy trong trình duyệt (Bậc 1–2); tuần thứ tư làm ứng dụng có cơ sở dữ liệu (database), có đăng nhập (Bậc 3). Hai ngày cuối dành cho tự đánh giá và trình bày. Bận kỳ họp thì lùi lịch, nhưng không bỏ phần tự kiểm tra.

::: {.thuchanh}
**Thực hành: chuẩn bị trước ngày thứ nhất (khoảng 30 phút)**

1. Tạo một **sổ tay học tập** (tệp Word hoặc trang ghi chú cá nhân). Mỗi ngày ghi ba dòng: đã làm gì; sản phẩm nằm ở đâu; tự kiểm tra đạt hay chưa, vì sao.
2. Gom một **bộ văn bản luyện tập** gồm 5–7 văn bản đã công khai thuộc lĩnh vực mình phụ trách (luật, nghị định, nghị quyết, báo cáo đã công bố tại kỳ họp), ưu tiên bản có lớp chữ thay vì bản chụp (scan).
3. Đặt **một khung giờ cố định** 30 phút mỗi ngày, như một cuộc họp với chính mình.
4. Nếu máy cơ quan bị khóa quyền cài đặt, hỏi bộ phận quản trị mạng ngay từ bây giờ; tuần thứ ba và thứ tư sẽ cần.
:::

## 18.1. Tuần thứ nhất: làm quen AI trò chuyện an toàn (ngày 1–7)

Mục tiêu của tuần là giao việc cho AI như giao cho một thư ký mới (phép so sánh ở Lời nói đầu Tập 1): dặn rõ, kiểm lại, và không để lọt thông tin không được phép. Chọn **một** trợ lý AI trò chuyện (Claude, ChatGPT hoặc Gemini); gói miễn phí đủ cho hai tuần đầu.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 1 | Mở tài khoản, khóa quyền riêng tư (30 phút) | Đã tắt huấn luyện, bật xác thực hai lớp | Mở lại Cài đặt: mục ấy còn tắt? |
| 2 | Xếp 10 loại giấy tờ vào bốn cấp (20 phút) | Bảng phân loại của mình | Có dữ liệu cá nhân nào bị xếp Cấp 1? |
| 3 | Bài tập 1: tóm tắt theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (30 phút) | Câu lệnh đầu tiên, bản tóm tắt | Mỗi ý chỉ được chỗ trong văn bản gốc? |
| 4 | Bài tập 2: kiểm chứng trích dẫn (30 phút) | Bảng đối chiếu 5 văn bản | Đã tự tra đủ 5 văn bản? |
| 5 | Bài tập 3: soát chính tả, thể thức (30 phút) | Danh sách lỗi đã xác minh | Bao nhiêu "lỗi" thực ra không sai? |
| 6 | Bài tập 4 và 5 (45 phút) | Bản 5 ý, bảng so sánh | Còn câu "tô hồng" nào? |
| 7 | Ôn tuần, ghi sổ (15 phút) | Trang tổng kết tuần | Trả lời được 5 câu ở hộp Ghi nhớ? |

### 18.1.1. Ngày 1: mở tài khoản và khóa cửa quyền riêng tư

Tài khoản AI giống một tủ hồ sơ đặt ở trụ sở của người khác: việc đầu tiên là xem ai được mở nó. Đúng như Tập 1 đã khuyên (mục 2.5), đồng chí đăng ký bằng email cá nhân, không dùng email công vụ khi cơ quan chưa có chủ trương, đặt mật khẩu không trùng mật khẩu công vụ, bật xác thực hai lớp, rồi vào Cài đặt, tìm mục Quyền riêng tư hoặc Kiểm soát dữ liệu, tắt lựa chọn cho phép dùng nội dung trò chuyện để cải thiện mô hình.

Với Claude, theo thông báo ngày 28/8/2025 của Anthropic, người dùng gói cá nhân Free, Pro, Max được tự chọn; bật cho huấn luyện thì dữ liệu được lưu 5 năm, tắt thì lưu 30 ngày; mục này nằm trong Settings → Privacy. Với ChatGPT, mục tương ứng theo hướng dẫn trước đây là "Improve the model for everyone"; với Gemini là "Keep Activity". Tôi chưa kiểm chứng lại được giao diện hai dịch vụ này (10/2026), nên hãy đọc kỹ chữ trong mục quyền riêng tư thay vì tìm một tên nút cố định.

Phải làm ngay ngày đầu, vì với Claude, tắt huấn luyện chỉ áp dụng từ lúc tắt trở đi; dữ liệu đã dùng để huấn luyện trước đó không được gỡ ra. Và như Tập 1 đã nhắc (mục 7.2), "không huấn luyện" không đồng nghĩa "không lưu trữ": tài khoản cá nhân vẫn không phải nơi chứa tài liệu nội bộ, dữ liệu cá nhân hay tài liệu mật.

### 18.1.2. Ngày 2: tập phân loại dữ liệu theo bốn cấp

Tập 1 (mục 7.1–7.2, Bảng 7.1) chia dữ liệu thành bốn cấp, mỗi cấp đi kèm một giới hạn dùng AI:

- **Cấp 1 — Dữ liệu công khai:** đã công bố chính thức; dùng được với mọi công cụ AI.
- **Cấp 2 — Dữ liệu nội bộ:** dự thảo chưa chốt, thông tin điều hành nội bộ; chỉ dùng với AI có cam kết bảo mật cho tổ chức (gói doanh nghiệp), sau khi ẩn danh.
- **Cấp 3 — Dữ liệu hạn chế tiếp cận:** gồm dữ liệu cá nhân; chỉ dùng với AI có máy chủ trong nước hoặc AI do cơ quan tự triển khai.
- **Cấp 4 — Bí mật nhà nước:** tuyệt đối không dùng AI nước ngoài; theo Luật Bảo vệ bí mật nhà nước số 117/2025/QH15, không được soạn thảo, lưu giữ trên máy tính, thiết bị đang kết nối Internet.

Quy tắc của Tập 1 là: **khi không chắc chắn, chọn cấp cao hơn**. Tài khoản cá nhân miễn phí không phải "AI có cam kết doanh nghiệp", nên trong 30 ngày luyện tập đồng chí chỉ dùng Cấp 1 và dữ liệu giả. Hôm nay đồng chí không mở AI, chỉ tự xếp 10 loại giấy tờ trên bàn làm việc vào bốn cấp.

::: {.vidu}
**Ví dụ minh họa: bảng phân loại của một chuyên viên ở một Ban**

| Loại giấy tờ | Cấp | Lý do |
|---|---|---|
| Nghị quyết HĐND tỉnh đã ban hành, đã đăng tải | 1 | Đã công khai |
| Báo cáo thẩm tra đã trình tại kỳ họp, đã công bố | 1 | Đã công khai |
| Thông cáo báo chí sau kỳ họp | 1 | Đã công khai |
| Dự thảo nghị quyết chưa trình | 2 | Chưa chốt, chưa công bố |
| Lịch công tác tuần của lãnh đạo | 2 | Thông tin nội bộ |
| Tổng hợp kiến nghị cử tri còn họ tên, địa chỉ | 3 | Dữ liệu cá nhân của người dân |
| Đơn khiếu nại, tố cáo | 3 | Danh tính người khiếu nại, tố cáo |
| Hồ sơ cán bộ, bảng điểm đánh giá có họ tên | 3 | Dữ liệu cá nhân, nội dung đánh giá |
| Danh bạ điện thoại nội bộ | 3 | Số điện thoại là dữ liệu cá nhân |
| Tài liệu có đóng dấu độ mật | 4 | Bí mật nhà nước |

Tổng hợp kiến nghị cử tri chỉ hạ xuống Cấp 2 sau khi đã xóa sạch họ tên, địa chỉ, số điện thoại của người kiến nghị; dù vậy vẫn chưa được dán vào tài khoản AI cá nhân.
:::

Danh bạ trong bảng không phải ví dụ ngẫu nhiên: kho mã nguồn (repository) của hệ thống là kho công khai, nên tệp danh bạ thật bị chặn khỏi kho, kèm phép kiểm "không có số điện thoại nào trong mã nguồn" (Chương 12, mục 12.2.5).

::: {.phaply}
**Căn cứ pháp lý: vì sao phải phân loại trước khi gõ**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Quốc hội thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026) chia dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.
- Nghị định 356/2025/NĐ-CP (có hiệu lực từ 01/01/2026; Nghị định 13/2023/NĐ-CP mà Tập 1 viện dẫn đã hết hiệu lực từ cùng ngày) liệt kê tại Điều 3 dữ liệu cá nhân cơ bản (có họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình) và tại khoản 1 Điều 4 dữ liệu nhạy cảm (có quan điểm chính trị, tôn giáo, tín ngưỡng, tình trạng sức khỏe).
- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (có hiệu lực từ 01/3/2026, thay thế Luật số 29/2018/QH14 mà Tập 1 viện dẫn) tại Điều 5 nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu; khoản 10 Điều 5 cấm sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước.
- Luật Trí tuệ nhân tạo số 134/2025/QH15 (có hiệu lực từ 01/3/2026), khoản 2 Điều 4: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người."

Đối chiếu đến ngày 26/10/2026; trước khi áp dụng, tra lại nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo.
:::

### 18.1.3. Ngày 3 đến ngày 6: năm bài tập với văn bản công khai

Mỗi bài tập rèn một kỹ năng của Tập 1, dùng chung bộ văn bản luyện tập; các kỹ năng này sẽ được dùng lại khi giao việc cho tác tử AI lập trình.

**Bài tập 1 (ngày 3) — Tóm tắt có địa chỉ.** Chọn một văn bản 5–15 trang. Lần đầu gõ trơn "tóm tắt văn bản này"; lần hai dùng câu lệnh mẫu 18.1 theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2: Vai trò – Bối cảnh – Việc – Dạng đầu ra – Ràng buộc), rồi so sánh. Phần ghi vị trí trong ngoặc giúp đồng chí kiểm chứng trong vài phút thay vì đọc lại cả văn bản.

::: {.lenhmau}
**Câu lệnh mẫu 18.1 — Tóm tắt văn bản công khai theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG**

```text
[VAI TRÒ] Hãy đóng vai chuyên viên tổng hợp nhiều kinh nghiệm của Văn
phòng Đoàn ĐBQH và HĐND tỉnh, viết văn phong hành chính trung lập.
[BỐI CẢNH] Dưới đây là toàn văn [tên và số hiệu văn bản], văn bản đã
được công bố công khai. Người đọc bản tóm tắt là lãnh đạo Ban, cần
nắm nhanh nội dung trước cuộc họp.
[VIỆC] Tóm tắt văn bản này.
[DẠNG ĐẦU RA] Tối đa 10 gạch đầu dòng, mỗi dòng không quá 30 chữ. Cuối mỗi dòng
ghi trong ngoặc vị trí trong văn bản gốc (Điều, khoản hoặc mục).
[RÀNG BUỘC] Chỉ dùng thông tin có trong văn bản dưới đây. Không thêm
nhận định, không dùng từ ngữ khen ngợi. Chỗ nào văn bản không nói rõ
thì ghi "văn bản không nêu".
[Dán toàn văn văn bản]
```
:::

**Bài tập 2 (ngày 4) — Bắt AI nói "không biết".** Tập 1 đã cảnh báo (mục 1.3): AI không biết văn bản pháp luật vừa ban hành. Dùng câu lệnh mẫu 18.2, rồi tra từng văn bản AI nêu trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo, ghi kết quả: đúng, sai số hiệu, sai ngày, đã hết hiệu lực hay bị thay thế, hoặc không tồn tại.

::: {.lenhmau}
**Câu lệnh mẫu 18.2 — Kiểm tra trí nhớ của AI về văn bản pháp luật**

```text
Tôi đang tập kiểm chứng câu trả lời của AI. Hãy liệt kê tối đa 5 văn
bản quy phạm pháp luật hiện hành về [lĩnh vực, ví dụ: hoạt động giám
sát của HĐND]. Với mỗi văn bản ghi: số hiệu, tên, ngày có hiệu lực, và
mức độ chắc chắn (cao / trung bình / thấp).
Quy tắc bắt buộc:
- Không chắc thì ghi "không chắc", không được đoán số hiệu hay ngày.
- Nói rõ dữ liệu huấn luyện của mình cập nhật đến khoảng thời điểm nào;
  văn bản ban hành sau thời điểm đó thì nói thẳng là không biết.
- Không trích nguyên văn điều khoản khi không có văn bản trước mặt.
Cuối câu trả lời, nhắc tôi tra lại từng văn bản trên nguồn chính thống.
```
:::

**Bài tập 3 (ngày 5) — Soát lỗi, và soát cả người soát.** Nhờ AI soát chính tả và thể thức một văn bản hành chính đã ban hành, đã đăng công khai của cơ quan, theo Nghị định 30/2020/NĐ-CP về công tác văn thư; rồi tự xác minh từng lỗi AI nêu và đếm số "lỗi" thực ra không sai. Văn bản của tổ chức Đảng có tiêu đề, thể thức riêng; hệ thống của Văn phòng từng in nhầm tên cơ quan hành chính lên đầu bản tự kiểm điểm đảng viên (Chương 10).

**Bài tập 4 (ngày 6, phần đầu) — Viết cho lãnh đạo, không tô hồng.** Yêu cầu AI rút một báo cáo dài đã công bố thành đúng 5 ý để lãnh đạo đọc trong một phút: văn phong trung lập, nêu cả mặt hạn chế, cấm các cụm như "vô cùng to lớn", "bước đột phá". Gạch bỏ mọi câu khen không có căn cứ trong văn bản gốc (Tập 1, mục 4.7, lỗi "đánh giá quá tô hồng").

**Bài tập 5 (ngày 6, phần sau) — Để AI hỏi ngược.** Thêm vào cuối một yêu cầu câu: "Trước khi làm, hãy hỏi tôi tối đa 5 câu để làm rõ yêu cầu." Trả lời xong mới cho AI làm, rồi yêu cầu lập bảng so sánh 2–3 phương án theo tiêu chí của đồng chí (cách lập bảng so sánh phương án ở Tập 1, mục 5.5). Yêu cầu mơ hồ với trợ lý trò chuyện cho ra một đoạn văn dở; với tác tử lập trình là cả chục tệp sai.

### 18.1.4. Ngày 7: ôn tuần và ghi sổ

Đọc lại sổ tay, lưu riêng các câu lệnh dùng tốt, tự trả lời năm câu hỏi dưới đây; câu nào chưa chắc thì làm lại ngày đó.

::: {.ghinho}
**Ghi nhớ: năm câu hỏi trước mỗi lần gõ vào khung chat**

1. Thông tin mình sắp dán thuộc cấp nào trong bốn cấp? Không phải Cấp 1 thì dừng.
2. Tài khoản này đã tắt chế độ cho phép dùng dữ liệu để huấn luyện chưa?
3. Câu lệnh đã đủ năm thành phần của khung VAI-BỐI-VIỆC-DẠNG-RÀNG chưa?
4. Mình sẽ kiểm chứng kết quả bằng nguồn nào, mất bao lâu?
5. Nếu dùng kết quả này mà sai, ai chịu trách nhiệm? Câu trả lời luôn là: chính mình.
:::

## 18.2. Tuần thứ hai: đưa AI vào việc của chính mình (ngày 8–14)

Tuần thứ hai trả lời câu hỏi: trong việc mình làm hằng tháng, việc nào nên giao cho AI, và giao đến đâu.

| Ngày | Việc cần làm | Sản phẩm đầu ra | Tự kiểm tra |
|---|---|---|---|
| 8 | Lập bản đồ công việc (20 phút) | 3 việc kèm cấp dữ liệu | Làm được bằng dữ liệu Cấp 1 hoặc giả? |
| 9 | Nhờ AI viết công thức bảng tính (30 phút) | Bảng tính, 5 ca thử | Cả 5 ca khớp kết quả tính tay? |
| 10 | Tóm tắt văn bản dài theo kỹ thuật phân tầng (45 phút) | Bản tóm tắt có chỉ dẫn mục | Kiểm ngẫu nhiên 3 ý: đúng nguyên văn? |
| 11 | Rà soát nhất quán một văn bản (30 phút) | Bảng điểm nghi vấn | Đã tự đọc lại văn bản gốc? |
| 12 | Dựng thư viện câu lệnh cá nhân (30 phút) | Thư viện từ 6 câu lệnh | Câu lệnh nào cũng ghi cấp dữ liệu? |
| 13 | Gemini Notebook (trước đây là NotebookLM) với văn bản công khai (45 phút) | Notebook 3–5 nguồn, 5 câu hỏi | Số trích dẫn ra đúng đoạn? |
| 14 | Ôn tuần, đo thời gian thật (20 phút) | Bảng so sánh làm tay và có AI | Đã ghi cả lần AI làm chậm hơn? |

### 18.2.1. Ngày 8 và 9: bản đồ công việc, rồi bảng tính

Ngày 8, đồng chí liệt kê khoảng 10 việc lặp lại trong tháng, rồi chọn 3 việc vừa tốn thời gian, vừa có quy tắc tương đối rõ, vừa làm được bằng văn bản công khai hoặc dữ liệu giả cùng cấu trúc. Việc chỉ làm được bằng dữ liệu Cấp 2 trở lên (dữ liệu nội bộ, dữ liệu cá nhân, tài liệu mật) thì gạch khỏi danh sách luyện tập.

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

Câu lệnh mô phỏng cách chấm từng nhiệm vụ ở phân hệ Đánh giá OKR/KPI (Chương 9, mục 9.2.2). Ca kiểm thử (test case), tức một bộ số liệu đầu vào đã biết trước đáp án, đầu tiên nên là ví dụ chuẩn trong Dự thảo Hướng dẫn lập danh mục sản phẩm, công việc: giao 10, hoàn thành 10, đạt chuẩn, chậm ít, kết quả (100 + 100 + 80) / 3 = 93,3%. Bảng tính nhỏ này về sau có thể thành thước nghiệm thu ứng dụng của đồng chí, giống tệp Excel mô phỏng cách tính điểm từng là "bộ ca kiểm thử bắt buộc" của phần mềm Văn phòng (Chương 8, mục 8.2).

### 18.2.2. Ngày 10 và 11: tóm tắt phân tầng và rà soát nhất quán

Ngày 10, áp dụng kỹ thuật phân tầng câu lệnh và cách xử lý tài liệu dài của Tập 1 (mục 3.7 và 3.9) cho một văn bản trên 30 trang: AI lập dàn ý; đồng chí duyệt dàn ý; AI tóm tắt từng phần; cuối cùng mới ghép và hiệu đính.

Ngày 11, dùng AI soi chỗ chưa nhất quán bên trong một văn bản đã công bố: "Kiểm tra văn bản dưới đây theo ba điểm: tổng điểm thành phần so với điểm tối đa; số liệu trong bảng so với lời văn; đánh số điều, khoản. Chỉ liệt kê điểm nghi vấn kèm vị trí, không tự sửa." Cách hỏi này từng làm lộ 6 chỗ chưa nhất quán trong dự thảo Khung tiêu chí đánh giá HĐND, như một tiêu chí 6 điểm mà các mức cộng lại thành 9 (Chương 8, mục 8.5). AI chỉ kiến nghị; quyền sửa thuộc cơ quan có thẩm quyền.

### 18.2.3. Ngày 12: thư viện câu lệnh cá nhân

Cất ít nhất 6 câu lệnh dùng được vào một tệp có cấu trúc, như sổ mẫu văn bản của phòng.

| Trường | Ghi gì |
|---|---|
| Tên | Ngắn, gợi việc, ví dụ "Tóm tắt có địa chỉ" |
| Mục đích | Dùng khi nào |
| Cấp dữ liệu | Được dùng với cấp nào, ví dụ "chỉ Cấp 1" |
| Nội dung | Toàn văn câu lệnh, chỗ điền để trong ngoặc vuông |
| Cách kiểm chứng | Đối chiếu với nguồn nào |
| Lần sửa gần nhất | Ngày và lý do sửa |

Thư viện không lưu kèm dữ liệu thật. Theo nguyên tắc 20-80 của Tập 1 (mục 3.1), nếu phải dành tới 60–70% thời gian sửa kết quả AI trả về thì lỗi nằm ở câu lệnh: viết lại câu lệnh và ghi lý do. Phụ lục 2 có thêm khoảng 40 câu lệnh mẫu.

### 18.2.4. Ngày 13: sổ tay hỏi đáp có trích dẫn trên Gemini Notebook

Gemini Notebook (trước đây là NotebookLM) của Google trả lời dựa trên nguồn do người dùng nạp, kèm số trích dẫn bấm vào xem được đoạn gốc, đúng kiểu "thư viện văn bản ngành" Tập 1 đã giới thiệu (mục 5.4). Google đổi tên sản phẩm ngày 16/7/2026; địa chỉ hiện hành là `notebook.google.com`, địa chỉ cũ ghi trong Tập 1 tự chuyển hướng sang đây. Phân hệ Sổ tay AI của Văn phòng dựa trên công cụ này; cách lập sổ tay cho một Ban có ở Chương 15, mục 15.6.

Trong 45 phút: đăng nhập tài khoản Google của mình; tạo một notebook đặt tên theo lĩnh vực; nạp 3–5 văn bản công khai đã tự kiểm tra còn hiệu lực; đặt 5 câu hỏi theo câu lệnh mẫu 18.4; bấm từng số trích dẫn xem đoạn gốc có thật sự nói điều đó không. Theo thông báo của Google, từ ngày 02/9/2026 hạn mức tính theo khối lượng tính toán, làm mới khoảng mỗi 5 giờ và có trần theo tuần (thông tin tại thời điểm viết, 10/2026).

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
- Khi chia sẻ, chọn quyền người xem (Viewer). Kiểu liên kết chỉ hiện khung chat (Chat view) không phải cơ chế bảo mật: theo trợ giúp của Google, nó không thu hồi quyền truy cập vào nội dung bị ẩn.
- Phần mềm không biết văn bản nào còn hiệu lực; kiểm tra hiệu lực là việc của người nạp nguồn. Phân hệ Sổ tay AI để mọi nguồn gợi ý ở trạng thái "chưa xác định hiệu lực" cho tới khi có người đối chiếu.
:::

### 18.2.5. Ngày 14: đo thời gian cho trung thực

Lập bảng bốn cột cho 3 việc đã chọn ở ngày 8: tên việc; thời gian làm tay; thời gian có AI, **tính cả kiểm chứng và sửa**; ghi chú. Ghi cả những lần AI làm chậm hơn. Nhiệm vụ thí điểm Sổ tay AI của Văn phòng đặt chỉ tiêu giảm ít nhất 30% thời gian tra cứu; đó là chỉ tiêu, chưa phải kết quả. Cách đo trước – đo sau được bàn kỹ ở Chương 17, mục 17.4.

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

Đặc tả (bản mô tả yêu cầu, như đề cương trước khi soạn một văn bản) một trang gồm sáu dòng: bài toán; ai dùng; dữ liệu vào và thuộc cấp nào; kết quả ra; quy tắc tính; những điều công cụ **không** làm. Trước khi viết, tự hỏi: việc này có quy tắc cố định không? Có thì một công thức hay một chương trình nhỏ là đủ, không cần AI chạy bên trong. Bản tin pháp luật hằng ngày trên Trang chủ của hệ thống không gọi AI; AI chỉ giúp viết ra chương trình lấy tin và vẽ ảnh (Chương 15, mục 15.1).

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

Ngày 17, đồng chí tự gõ cả sáu ca vào trang "Ca kiểm thử" và so với đáp án. Hai ca cuối có lý do: từ ngày 01/9/2026, ba phân hệ của hệ thống trắng trang, vì phần mềm luôn đọc "người đứng đầu danh sách" trong khi kỳ mới chưa có ai (Chương 9, mục 9.5.1). Lỗi theo lịch chỉ lộ khi sang kỳ mới. Hãy tập cả thói quen đếm tổng số dòng trước và sau mỗi lần gộp: hệ thống từng còn 27 người thay vì 28, vì hai đồng chí trùng họ tên ở hai đơn vị khác nhau bị ghép làm một (mục 9.5.4).

Dùng Google Trang tính thì có thể nhờ AI viết thêm một đoạn Apps Script (chương trình nhỏ chạy kèm bảng tính) gửi email nhắc hạn; khi Google hỏi cấp quyền, đọc kỹ quyền nó xin, và nhớ rằng bảng tính trên Google cũng là dịch vụ nước ngoài, chỉ chứa dữ liệu giả hoặc Cấp 1.

### 18.3.2. Ngày 18–21: trang tra cứu, khánh thành và người dùng đầu tiên

Ngày 18 có hai lối. **Lối đầy đủ** là dựng "xưởng làm việc số" theo Chương 5 rồi tự kiểm theo bảng kiểm ở mục 5.5. Theo trang giá của Anthropic, Claude Code không có trong gói miễn phí, gói thấp nhất có Claude Code là Pro 20 USD/tháng (17 USD/tháng nếu trả theo năm); GitHub Copilot có gói miễn phí với 2.000 gợi ý mã mỗi tháng (giá tham khảo tại thời điểm viết, 10/2026, có thể thay đổi). **Lối không cài đặt** dành cho máy bị khóa: nhờ trợ lý AI trò chuyện viết một tệp HTML duy nhất, lưu thành `index.html`, bấm đúp là chạy. Trang Bậc 2 không cần máy chủ, nên lối này vẫn đi tiếp được.

Ngày 19, làm trang tra cứu theo mục 5.4 và câu lệnh mẫu 5.1, với danh mục văn bản công khai của Ban mình. Thử thêm: gõ một từ không có trong danh mục (trang phải báo "không tìm thấy"); gõ "báo" xem có kéo nhầm dòng chứa "bão" không. Bộ sinh bản tin của Văn phòng từng nhận "họp báo thường kỳ" thành tin bão vì bỏ dấu khi so khớp (Chương 15, mục 15.2.2).

Ngày 20, đưa trang lên một kho GitHub **riêng tư**, triển khai (deploy, tức "khánh thành" cho người dùng vào) trên Vercel, đầu trang ghi "Bản demo thử nghiệm". Ngày 21, mời một đồng nghiệp dùng thử năm phút, hỏi ba câu: tìm được thứ cần chưa, mất bao lâu; chỗ nào khó hiểu; có muốn dùng tiếp không. Ghi cả lời chê vào nhật ký.

## 18.4. Tuần thứ tư: ứng dụng có dữ liệu dùng chung (ngày 22–28)

Bậc 3 thay đổi về chất: nhiều người cùng đọc, cùng ghi một kho dữ liệu, nên có những lỗi bảng tính không có, như người này ghi đè người kia. Tuần này đi trọn một vòng Bậc 3 với dữ liệu giả.

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

Các dịch vụ miễn phí đặt máy chủ ở nước ngoài và có điều kiện riêng. Gói miễn phí của Supabase cho tối đa 2 dự án đang hoạt động, 500 MB mỗi dự án, tự tạm dừng dự án sau 1 tuần không hoạt động; gói Hobby của Vercel chỉ dành cho mục đích cá nhân, phi thương mại, và điều khoản cho phép Vercel dùng nội dung để huấn luyện AI (thông tin tại thời điểm viết, 10/2026, có thể thay đổi). Ứng dụng của tuần này chỉ chứa dữ liệu giả: không họ tên, số điện thoại, hồ sơ thật của bất kỳ ai, càng không tài liệu nội bộ hay tài liệu mật.
:::

### 18.4.1. Ngày 22–24: đặc tả có phân quyền và màn hình đầu tiên

::: {.vidu}
**Ví dụ minh họa: sổ đăng ký sử dụng phòng họp**

Hãy hình dung một sổ đăng ký phòng họp dùng chung. Dữ liệu gồm tên cuộc họp, ngày, giờ, phòng, đơn vị đăng ký; không cần họ tên cá nhân. Khách xem lịch đã duyệt; người đăng nhập được đăng ký; Quản trị duyệt hoặc từ chối; phần mềm cảnh báo khi trùng giờ. Phần mềm chỉ cảnh báo, quyết định duyệt là của người: máy đề xuất – người quyết định, tức Mô hình 1 "AI đề xuất, con người duyệt" ở Tập 1, mục 7.5.
:::

Ngày 23, đồng chí tạo dự án Supabase và tệp `.env` (tệp cất các khóa kết nối, nằm ngoài kho mã) theo mục 5.3. Hai điều cần thuộc lòng. Một, quyền thật nằm ở cơ sở dữ liệu: ẩn một nút chỉ là không chỉ đường, cửa vẫn mở; chính sách bảo mật theo dòng (Row Level Security, RLS) mới là "thẻ ra vào" (Chương 19, mục 19.2). Hai, khách và người đăng nhập đọc **cùng một nguồn**, chỉ khác quyền ghi; hệ thống của Văn phòng từng để khách dựng danh sách mẫu tại máy, thế là khách và Quản trị thấy hai danh sách cán bộ khác nhau (Chương 9, mục 9.5.2).

Câu lệnh dưới đây giao việc cho tác tử AI lập trình theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG phiên bản kiến tạo của Chương 6, có thêm phần "Nghiệm thu" (tiêu chí hoàn thành đo được) mà Tập 2 bổ sung, và bắt tác tử trình phương án trước khi làm (mục 6.3).

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

Ngày 24, khi tác tử làm xong, phép thử đầu tiên là "lưu, tải lại trang, dữ liệu còn không", không phải nhìn dòng chữ "đã lưu". Danh bạ trong hệ thống của Văn phòng từng báo lưu thành công mà tải lại thì trống, vì hàm chuẩn hóa dữ liệu gọt mất trường mới chưa khai tên (Chương 12, mục 12.2.5).

### 18.4.2. Ngày 25–28: kiểm thử, khánh thành, người dùng thử và nhật ký

Ngày 25, đồng chí thử ba vai (khách, người đăng nhập, quản trị), bảng trống, hai người cùng sửa, màn hình điện thoại; rồi giao tác tử một lượt rà soát chỉ đọc: "Đóng vai kiểm toán viên bảo mật, không sửa gì. Liệt kê những chỗ người chưa đăng nhập có thể đọc hoặc ghi dữ liệu, những khóa có thể lộ xuống trình duyệt, và những chỗ khác đang đọc, ghi thứ vừa đổi." Câu hỏi cuối là quy tắc "rà soát chức năng liên quan" của dự án, ra đời sau sự cố dây chuyền ngày 13/8/2026 (Chương 7, mục 7.5).

Ngày 26, triển khai lên Vercel, khai biến môi trường, rồi nghiệm thu trên chính địa chỉ web. Hãy kiểm ở nơi người dùng nhìn thấy, không tin lời báo "đã xong": tác vụ tạo bản tin của dự án từng được coi là chạy đều, trong khi chưa từng có ảnh nào lên trang (Chương 15, mục 15.1.2).

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

Mỗi buổi bốn nhịp: đọc lại sổ tay hôm trước; làm việc của ngày; tự kiểm tra; ghi ba dòng mới. Việc nào vượt 45 phút hai ngày liền là quá to, cần chia nhỏ. Khi AI đi lạc, sửa vòng vo hay sửa chỗ này hỏng chỗ kia, hãy dừng lại, quay về bản đã lưu gần nhất và giao một việc nhỏ hơn (Chương 6, mục 6.7).

### 18.5.2. Ngày 29: tự đánh giá

Chấm từng dòng theo ba mức: 0 là chưa làm; 1 là đã làm nhưng chưa đủ bằng chứng; 2 là có bằng chứng, người khác kiểm lại được.

| Năng lực | Bằng chứng cần chỉ ra | Điểm |
|---|---|---|
| 1. Tài khoản an toàn (★) | Đã tắt huấn luyện, bật xác thực hai lớp | 0–2 |
| 2. Phân loại dữ liệu (★) | Bảng bốn cấp; 30 ngày chỉ dán dữ liệu Cấp 1 | 0–2 |
| 3. Câu lệnh theo khung năm thành phần | Ba câu lệnh đủ VAI-BỐI-VIỆC-DẠNG-RÀNG | 0–2 |
| 4. Kiểm chứng trích dẫn | Bảng đối chiếu của ngày 4 | 0–2 |
| 5. Thư viện câu lệnh | Từ 6 câu lệnh đúng khuôn | 0–2 |
| 6. Hỏi đáp có trích dẫn | Notebook, 5 câu hỏi đã bấm trích dẫn | 0–2 |
| 7. Đo thời gian trung thực | Bảng so sánh của ngày 14 | 0–2 |
| 8. Bảng tính có ca kiểm thử | Trang "Ca kiểm thử" đạt cả 6 ca | 0–2 |
| 9. Trang Bậc 2 trên mạng | Địa chỉ web có nhãn demo | 0–2 |
| 10. Ứng dụng Bậc 3 | Khách không ghi được; lưu, tải lại còn | 0–2 |
| 11. Bí mật ngoài kho mã (★) | Tệp `.env` bị chặn; mã không chứa khóa | 0–2 |
| 12. Nhật ký và bàn giao | Có nhật ký và hướng dẫn một trang | 0–2 |

Ba dòng có dấu (★) là điểm liệt: được 0 điểm thì khắc phục trước, dù tổng điểm cao đến đâu. Với tổng điểm, tôi gợi ý: dưới 11, làm lại tuần thứ nhất và thứ hai với một việc khác; từ 11 đến 18, đã vững Bậc 2, nên làm thêm một hai công cụ nhỏ; từ 19 trở lên, có thể thử Bậc 3 với bài toán thật của phòng, sau khi đọc kỹ Chương 7, Chương 19 và được lãnh đạo đồng ý; dữ liệu thật vẫn phải đúng cấp được phép.

### 18.5.3. Ngày 30: mười phút trình bày

Ngày cuối, đồng chí trình bày mười phút với lãnh đạo phòng hoặc vài đồng nghiệp: bài toán; chạy thử; dữ liệu và chốt an toàn; số đo thời gian, kể cả chỗ chưa đạt; bước tiếp theo. Nói rõ ngay từ đầu: đây là bản demo thử nghiệm, không thay thế quy trình và văn bản chính thức.

::: {.lanhdao}
**Dành cho lãnh đạo**

- Một cán bộ cần khoảng 30 phút mỗi ngày trong bốn tuần; nên coi đó là thời gian học tập trong giờ làm việc.
- Cung cấp bộ văn bản công khai của lĩnh vực; không giao dữ liệu thật của cơ quan để "làm thử".
- Nghiệm thu bằng bảng tự đánh giá và buổi trình bày mười phút; hỏi về dữ liệu và an toàn trước, tính năng sau.
- Không đòi kết quả nghiệp vụ chính thức từ bản demo; khuyến khích ghi cả những lần thất bại.
- Cuối lộ trình, lãnh đạo quyết định: dừng, phát triển tiếp có kiểm soát, hay chuyển giao.
:::

## Tóm tắt chương 18

::: {.tomtat}
1. Lộ trình gồm bốn tuần ứng với Bậc 0 đến Bậc 3 và hai ngày tự đánh giá; mỗi ngày 15–45 phút, một sản phẩm, một phép tự kiểm tra.
2. Việc đầu tiên là khóa quyền riêng tư: tắt chế độ cho phép dùng dữ liệu để huấn luyện, bật xác thực hai lớp, dùng email riêng.
3. Suốt 30 ngày chỉ dùng văn bản công khai (Cấp 1) và dữ liệu giả; xếp thông tin vào bốn cấp dữ liệu của Tập 1 trước khi gõ, khi không chắc chắn thì chọn cấp cao hơn.
4. AI viết công thức, mình giữ dữ liệu; mọi công cụ phải qua ca kiểm thử có đáp án biết trước, kể cả ca ngày đầu tháng và danh sách trống.
5. Tra cứu phải có trích dẫn, hiệu lực văn bản do người kiểm; Gemini Notebook (trước đây là NotebookLM) chỉ nạp văn bản công khai, chia sẻ quyền người xem.
6. Ở Bậc 3, quyền thật nằm ở cơ sở dữ liệu; khách và người đăng nhập đọc cùng một nguồn; nghiệm thu trên chính địa chỉ web.
7. Đo thời gian trung thực, ghi nhật ký, viết hướng dẫn bàn giao; bảng tự đánh giá có ba điểm liệt về an toàn.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong 10 loại giấy tờ trên bàn làm việc của đồng chí, loại nào khó xếp cấp nhất? Đồng chí sẽ hỏi ai để chốt?
2. Ở bài tập kiểm chứng trích dẫn, AI sai kiểu nào nhiều nhất? Đồng chí sẽ thêm ràng buộc gì vào câu lệnh mẫu 18.2?
3. Nếu thời gian có AI, tính cả kiểm chứng, không ngắn hơn làm tay, đồng chí kết luận gì về việc đó?
4. Viết đặc tả một trang cho một công cụ Bậc 2 phục vụ đúng công việc của phòng mình, ghi ít nhất ba điều công cụ không làm.
5. Tự chấm bảng ở mục 18.5.2. Dòng nào thấp điểm nhất, và kế hoạch hai tuần tới để nâng dòng đó là gì?
