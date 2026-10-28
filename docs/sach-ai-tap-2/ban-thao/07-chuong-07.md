# Chương 7. Bộ nhớ dự án và kỷ luật làm việc

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu vì sao tác tử AI lập trình "quên" sau mỗi phiên, và biết lập bộ nhớ dự án (tệp CLAUDE.md, thư mục quy tắc) để AI tự đọc lại đầu mỗi phiên.
- Biết ghi nhật ký thay đổi như sổ giao ban: làm gì, vì sao, kiểm chứng bằng gì, người còn phải tự làm gì.
- Làm việc trên nhiều máy với GitHub là nguồn duy nhất; ghi lịch sử bằng những lần commit nhỏ, thông điệp tiếng Việt rõ ràng, khôi phục được.
- Áp dụng quy tắc "rà soát chức năng liên quan" và một văn hóa kiểm thử vừa sức người không chuyên lập trình.
- Vạch được ranh giới ủy quyền cho AI: việc gì AI tự làm, việc gì luôn phải hỏi lại người.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ cả chương, làm theo các câu lệnh mẫu); lãnh đạo nên đọc mục 7.2, 7.7 và hộp "Dành cho lãnh đạo".
:::

Ai làm việc với tác tử AI lập trình cũng sẽ gặp chuyện này ngay trong tuần đầu. Hãy hình dung: buổi sáng, đồng chí dặn AI rất kỹ: phần mềm này của cơ quan dân cử, chữ trên giao diện phải là tiếng Việt có dấu, điểm Nhóm I tối đa 30, không được đụng vào phần xuất Word. Buổi chiều mở phiên mới, AI làm như chưa từng nghe những lời dặn ấy. Tối về nhà mở máy khác, máy ở nhà càng không biết buổi sáng đã bàn gì.

Tôi đã gặp những chuyện như vậy khi xây dựng hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (địa chỉ hdndthkpi.vercel.app) cùng tác tử AI lập trình Claude Code trong năm 2026. Có thể ví tác tử như tổ chuyên viên kỹ thuật mà ta giao việc, nhưng sáng nào cũng là người mới đến lần đầu. Họ giỏi, nhanh, nhưng không biết hôm qua đã quyết định điều gì, vì sao. Không có sổ bàn giao thì ngày nào cũng phải kể lại từ đầu, và sớm muộn sẽ quên kể một điều hệ trọng.

Chương 5 đã dựng "xưởng làm việc số", Chương 6 đã bàn cách giao việc. Chương này trả lời câu hỏi tiếp theo: làm sao để công việc tích lũy qua nhiều tháng mà không rơi rớt, không đổ vỡ dây chuyền, và người khác tiếp nhận được. Không điều nào ở đây đòi hỏi biết lập trình; phần lớn các kỷ luật này ra đời sau một sự cố, và tôi sẽ kể cả những sự cố đó.

## 7.1. Vì sao AI "quên" và cách cho AI một bộ nhớ

### 7.1.1. Ba tầng trí nhớ của tác tử AI

Muốn biết AI quên cái gì, cần phân biệt ba tầng trí nhớ.

Tầng thứ nhất là những gì AI đang "bày trên bàn" trong phiên làm việc, gọi là cửa sổ ngữ cảnh (context window). Mọi lời đồng chí dặn, mọi tệp AI vừa đọc, mọi kết quả lệnh vừa chạy đều nằm ở đây. Bàn có giới hạn: phiên càng dài, lời dặn từ đầu phiên càng dễ bị tóm tắt lại và rơi mất chi tiết. Đóng phiên là dọn sạch bàn.

Tầng thứ hai là lịch sử hội thoại mà công cụ lưu trên chính chiếc máy đang dùng, nhờ đó mở lại được phiên cũ. Nhưng tệp quy tắc đa máy của dự án ghi một nhận xét rất đáng nhớ: "Bộ nhớ hội thoại của Claude Code là cục bộ từng máy, KHÔNG tự đồng bộ." Dặn ở máy cơ quan thì máy ở nhà không biết.

Tầng thứ ba là bộ nhớ dự án: những tệp văn bản nằm ngay trong kho mã nguồn (repository) và được tác tử tự đọc mỗi khi mở phiên. Đây là tầng duy nhất đi theo dự án sang mọi máy, vì nó được lưu cùng mã nguồn lên GitHub. Tệp quy tắc ấy kết luận: mọi bối cảnh quan trọng phải nằm ở (a) mã nguồn, (b) lịch sử các lần ghi sổ (commit), (c) tệp CLAUDE.md và thư mục `.claude/rules/`.

Ví von cho dễ nhớ: tầng một là trí nhớ trong buổi làm việc; tầng hai là sổ tay riêng trong ngăn bàn ở một trụ sở; tầng ba là bộ hồ sơ trong tủ chung, ai đến làm cũng phải đọc trước.

::: {.ghinho}
**Ghi nhớ**

Điều gì chỉ nói trong khung chat thì coi như chưa nói. Điều gì quan trọng phải được viết vào một trong ba nơi: mã nguồn (kể cả dòng chú thích cảnh báo), lịch sử commit, hoặc bộ nhớ dự án.
:::

### 7.1.2. Tệp CLAUDE.md — trang tóm tắt đầu hồ sơ

Claude Code tự đọc tệp có tên CLAUDE.md ở thư mục gốc của dự án mỗi khi mở phiên. Các tác tử lập trình khác cũng có cơ chế tương tự, tên tệp có thể khác; đồng chí xem tài liệu của công cụ mình dùng.

Trong dự án của Văn phòng, CLAUDE.md chỉ khoảng hai trăm chữ. Nó làm ba việc: nói dự án là gì, nhắc quy tắc vàng khi làm trên nhiều máy, và chỉ đường tới các tệp chi tiết. Phần đầu của tệp thật như sau (đã lược bớt):

```text
  # CLAUDE.md — Bộ nhớ dự án (đọc tự động mỗi phiên)

  Hệ thống Đánh giá, xếp loại cán bộ, công chức theo OKR/KPI
  — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (bản demo nội bộ).

  > Quy tắc vàng đa máy: đầu phiên git pull, cuối phiên commit
  > + git push. GitHub là nguồn duy nhất; KHÔNG đặt repo trong OneDrive.

  ## Quy tắc chi tiết — .claude/rules/ (Claude Code tự nạp)
  - project-overview.md — dự án là gì, công nghệ, URL...
  - ... (sáu tệp khác)
```

Vì sao phải ngắn? Vì tệp này được đọc ở mọi phiên, kể cả phiên chỉ sửa một dấu phẩy. Viết dài là chiếm chỗ trên bàn làm việc của AI mà phần lớn không dùng tới. Ban đầu mọi thứ nằm trong một tệp CLAUDE.md; khi dự án lớn dần, tôi giao AI tách theo chủ đề sang thư mục quy tắc.

### 7.1.3. Thư mục quy tắc — bộ hồ sơ theo chủ đề

Thư mục `.claude/rules/` của dự án hiện có bảy tệp:

| Tệp | Nội dung chính | AI đọc khi nào |
|---|---|---|
| project-overview.md | Dự án là gì, công nghệ, địa chỉ, nhãn demo | Mọi phiên |
| commands-and-deploy.md | Lệnh dựng, chạy thử, triển khai | Mọi phiên |
| multi-machine-workflow.md | Quy trình cơ quan ↔ nhà | Mọi phiên |
| conventions.md | Quy ước viết mã, commit, ủy quyền | Mọi phiên |
| architecture.md | Tệp nào làm gì, sửa ở đâu | Khi đọc, sửa tệp mã |
| data-model.md | Đối tượng, dữ liệu, công thức điểm | Khi đọc, sửa tệp trong src/ |
| changelog.md | Nhật ký các bước đã làm | Mọi phiên |

Tệp kiến trúc dài gần tám nghìn chữ (đếm tháng 10/2026). Không lẽ phiên nào cũng bắt AI đọc? Cách giải quyết là khai "phạm vi đường dẫn" ở đầu tệp:

```text
  ---
  paths:
    - "src/**"
    - "api/**"
    - "supabase/**"
  ---
  # Kiến trúc & nơi sửa
```

Mấy dòng này có nghĩa: chỉ khi AI mở đọc hoặc sửa một tệp trong thư mục `src/`, `api/` hoặc `supabase/` thì tệp mới được đưa lên bàn; tệp không khai phạm vi thì được nạp ở mọi phiên (theo tài liệu chính thức của Claude Code, tháng 10/2026). Giống như hồ sơ kỹ thuật công trình chỉ mang ra khi bàn chuyện sửa trụ sở; họp về nhân sự thì để yên trong tủ.

Thư mục quy tắc phải được đưa lên GitHub thì máy khác mới đọc được, trong khi cùng thư mục `.claude` còn có cấu hình riêng của từng máy, không nên đồng bộ. Tệp `.gitignore` (danh sách những gì Git bỏ qua) của dự án xử lý bằng ba dòng: bỏ qua mọi thứ trong `.claude`, trừ thư mục `rules`. Chi tiết nhỏ nhưng quyết định: thiếu ba dòng này, bộ nhớ dự án chỉ tồn tại trên chiếc máy đã viết ra nó.

### 7.1.4. Viết bộ nhớ thế nào để AI đọc đúng

Kinh nghiệm của tôi gói trong sáu điều.

1. **Viết như quy chế, không như tâm sự.** Mỗi quy tắc là một câu mệnh lệnh rõ việc, rõ thời điểm: "Trước khi commit: `npm run build` phải xanh", tức lệnh tạo bản dựng (build) phải chạy hết, không báo lỗi.
2. **Kèm lý do và bài học.** Quy tắc có lý do thì AI áp dụng đúng cả trong tình huống chưa gặp; tệp quy ước ghi luôn sự cố ngày 13/8/2026 vào quy tắc rà soát (mục 7.5).
3. **Đặt cảnh báo ngay tại chỗ trong mã.** Ngoài bộ nhớ chung, chỗ nguy hiểm có dòng chú thích tiếng Việt mở đầu bằng ký hiệu ⚠️. Ở tệp lưu hồ sơ cán bộ có dòng: "normalize là DANH SÁCH TRẮNG các trường được giữ lại — thêm trường mới vào hồ sơ thì PHẢI khai ở đây, nếu không sẽ bị gọt mất ngay lúc lưu/nạp". Ai mở tệp ấy cũng thấy cảnh báo trước khi sửa.
4. **Ghi cả điều cấm và điều AI hay nói sai.** Kiến thức của bot chat được dặn thẳng: điểm tối đa từng trục kiểm điểm không cố định, "đừng nói là 15/10/10/15/10/10".
5. **Một sự thật, một nơi ghi.** Công thức đã nằm ở tệp mô hình dữ liệu thì tệp khác chỉ dẫn chiếu; chép hai nơi thì có ngày hai nơi lệch nhau.
6. **Cập nhật cùng lúc với mã.** Đây là điều khó giữ nhất.

Chính dự án của tôi chưa giữ trọn điều thứ sáu. Đọc lại bộ nhớ dự án vào tháng 10/2026, tôi thấy vài chỗ lỗi thời. Tệp quy ước vẫn dặn sửa công thức dùng chung thì "chỉ sửa src/App.jsx (2 bản giao diện kia import lại từ đó)", trong khi hai bản giao diện ấy đã bị gỡ bỏ từ lâu. Câu giới thiệu ở đầu CLAUDE.md (và tệp tổng quan) vẫn ghi "Hệ thống Đánh giá, xếp loại cán bộ, công chức theo OKR/KPI", dù hệ thống đã thành cổng nhiều phân hệ và tên trang đã đổi thành tên cơ quan. Trước đó, trang hướng dẫn từng ghi ngưỡng xếp loại kiểm điểm là 80/65 trong khi phần mềm tính theo 70/50.

Mỗi chỗ lỗi thời là một cái bẫy. AI đọc bộ nhớ, tin là đúng, rồi làm theo điều không còn đúng. Cách chữa là định kỳ giao chính AI đối chiếu bộ nhớ với mã nguồn, như một cuộc kiểm tra nội bộ. Mẫu bộ nhớ dự án cho cơ quan có ở Phụ lục 3; dưới đây là hai câu lệnh để lập mới và để kiểm tra. Các câu lệnh mẫu của chương viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2), thêm phần NGHIỆM THU là phần mở rộng của Tập 2 đã trình bày ở Chương 6; thành phần nào không cần thì lược bớt.

::: {.lenhmau}
**Câu lệnh mẫu 7.1 — Lập bộ nhớ dự án cho một dự án mới**

```text
VAI: Kỹ sư phần mềm tiếp nhận dự án [tên dự án] của [phòng/Ban].
BỐI CẢNH: Tôi làm trên hai máy (cơ quan và nhà), đồng bộ qua
GitHub. Lịch sử hội thoại không theo sang máy khác, nên mọi điều
quan trọng phải nằm trong kho mã.
VIỆC: Hãy lập bộ nhớ dự án gồm:
1. Tệp CLAUDE.md ở thư mục gốc, dưới 250 chữ: dự án là gì, quy
   tắc vàng đa máy, mục lục trỏ tới các tệp quy tắc.
2. Thư mục .claude/rules/ gồm: tổng quan; lệnh và triển khai; làm
   việc đa máy; kiến trúc (chỉ nạp khi làm với tệp mã); quy ước;
   nhật ký.
3. Sửa .gitignore để commit thư mục .claude/rules/ nhưng bỏ qua
   cấu hình cục bộ khác trong .claude.
DẠNG: tiếng Việt có dấu; câu mệnh lệnh ngắn; mỗi quy tắc kèm một
câu "vì sao".
RÀNG BUỘC: không ghi khóa bí mật, mật khẩu, số điện thoại, dữ liệu
cá nhân vào bất kỳ tệp nào; không sửa mã nguồn trong lượt này.
NGHIỆM THU: liệt kê các tệp đã tạo kèm số chữ từng tệp; chạy
git status để tôi thấy thư mục rules đã được Git theo dõi.
```
:::

::: {.lenhmau}
**Câu lệnh mẫu 7.2 — Kiểm tra bộ nhớ dự án đã lỗi thời chưa**

```text
VAI: Kiểm tra viên nội bộ của dự án.
VIỆC: Đối chiếu từng câu khẳng định trong CLAUDE.md và các tệp
trong .claude/rules/ với mã nguồn hiện tại. Xếp mỗi câu vào một
trong ba loại: CÒN ĐÚNG / ĐÃ LỖI THỜI / CHƯA KIỂM CHỨNG ĐƯỢC.
DẠNG: bảng 4 cột: Tệp – Câu trong bộ nhớ – Thực tế trong mã (tên
tệp, vị trí) – Đề xuất sửa.
RÀNG BUỘC: chỉ đọc, KHÔNG sửa tệp nào. Không đoán: câu nào phải
chạy thử mới biết thì ghi "cần chạy thử".
NGHIỆM THU: cuối bảng nêu 3 chỗ lỗi thời nguy hiểm nhất (dễ khiến
phiên sau làm sai), rồi dừng lại chờ tôi duyệt mới sửa.
```
:::

## 7.2. Nhật ký thay đổi — "sổ giao ban" của dự án

Lịch sử commit cho biết đã đổi những gì, nhưng trả lời kém câu hỏi quan trọng hơn: vì sao. Vì sao phân hệ Kiểm điểm lưu ở một chỗ riêng? Vì sao điểm thưởng vượt định mức có trần +5? Không ghi lại thì ba tháng sau chính tôi cũng quên, còn AI phiên sau có thể "dọn cho gọn" và đưa lỗi cũ quay về.

Vì thế dự án có tệp nhật ký thay đổi (changelog) nằm ngay trong thư mục quy tắc. Cuối tháng 10/2026, nhật ký dài hơn 26.000 chữ với hơn 110 mục, mục mới nhất ở trên cùng. Tôi gọi nó là "sổ giao ban": xong mỗi việc lớn thì ghi một mục, như cuối buổi giao ban ghi kết luận.

Một mục nhật ký tốt trả lời năm câu hỏi. Bảng dưới đây lấy ví dụ từ mục ghi việc vá lỗi danh bạ điện thoại "lưu xong mở lại thì biến mất":

| Thành phần | Trả lời câu hỏi | Ví dụ trong nhật ký |
|---|---|---|
| Tiêu đề in đậm | Đã làm gì? | Vá lỗi danh bạ lưu xong thì mất |
| Nguyên nhân gốc | Vì sao hỏng? | Hàm chuẩn hóa là danh sách trắng, gọt trường mới |
| Cách sửa, tệp nào | Sửa ở đâu? | Khai trường mới vào hàm chuẩn hóa, kèm cảnh báo |
| Ký hiệu ⚠️ (việc người làm) | Người còn phải làm gì? | Quản trị nhập lại danh bạ, lưu một lần |
| Kiểm thử | Lấy gì chứng minh? | 28 phép kiểm đạt; lint 0 lỗi; dựng xanh |

Hai thành phần cuối hay bị quên nhất mà lại đáng giá nhất. Ký hiệu ⚠️ đánh dấu điều phải đặc biệt lưu ý, trong đó quan trọng nhất là việc AI không tự làm được: chạy một đoạn lệnh trên cơ sở dữ liệu, đăng ký lại địa chỉ nhận tin của bot, nhập lại dữ liệu. Không ghi thì phần mềm "đã sửa" mà người dùng vẫn gặp lỗi. Dòng kiểm thử biến câu "đã xong" thành câu có bằng chứng.

Nhật ký còn có một đặc điểm tôi cố ý giữ: quyết định do tôi chọn thường được ghi rõ là của người dùng ("người dùng chốt định hướng", "theo lựa chọn người dùng", "người dùng chọn phương án này"). Chẳng hạn: chuyển Sổ tay AI sang NotebookLM (nay Google đã đổi tên thành Gemini Notebook, địa chỉ notebook.google.com); giữ nguyên công thức của nghị định, chỉ thêm cảnh báo khi điểm số với xếp loại chênh nhau. Từ nay, nên thống nhất một cụm cố định như "người dùng chốt" để dễ tra. AI đưa phương án kèm hệ quả, người chọn, sổ ghi lại. Chính quy trình làm phần mềm cũng theo nguyên tắc máy đề xuất – người quyết định.

Cần lưu ý khi nhật ký dài ra. Tệp nằm trong thư mục quy tắc, không khai phạm vi đường dẫn, nên phiên nào cũng được nạp. Hơn hai mươi sáu nghìn chữ là một chồng giấy dày trên bàn làm việc của AI. Đến một mức nào đó nên tách: giữ vài chục mục gần nhất, chuyển phần cũ sang tệp lưu trữ để tra khi cần. Dòng hướng dẫn đầu tệp cũng cần sửa: nó vẫn dặn "thêm 1 dòng vào đây", trong khi mỗi mục thực tế dài cả trăm chữ.

::: {.lenhmau}
**Câu lệnh mẫu 7.3 — Ghi nhật ký sau khi xong một việc**

```text
VIỆC: Thêm một mục MỚI lên đầu .claude/rules/changelog.md cho
việc vừa làm, mở đầu bằng tiêu đề in đậm, lần lượt nêu: (1) làm
gì; (2) vì sao, nguyên nhân gốc nếu là sửa lỗi; (3) sửa ở tệp
nào; (4) quyết định tôi chốt, ghi "người dùng chốt"; (5) việc
tôi còn phải tự làm, đánh dấu ⚠️; (6) kiểm thử và bản dựng.
RÀNG BUỘC: dùng chức danh, không ghi họ tên cán bộ, số điện
thoại, khóa, mật khẩu; không sửa các mục cũ.
NGHIỆM THU: in mục vừa thêm cho tôi đọc trước khi commit.
```
:::

## 7.3. GitHub là nguồn duy nhất: quy trình đa máy cơ quan ↔ nhà

Mã nguồn là bộ bản vẽ thiết kế, GitHub là sổ lưu trữ bản vẽ có ghi lịch sử từng lần sửa. Mỗi máy đang làm việc giữ một bản sao đầy đủ của bộ bản vẽ. Giữa máy và GitHub chỉ có hai động tác: kéo về (pull) là lấy những lần sửa mới nhất từ GitHub về máy; đẩy lên (push) là gửi những lần sửa đã ghi sổ trên máy lên GitHub.

Trong dự án của Văn phòng, mỗi lần đẩy lên nhánh chính (main), Vercel tự dựng và triển khai bản mới sau khoảng một đến hai phút. Cùng lúc, dây chuyền kiểm tra tự động trên GitHub (GitHub Actions) chạy lại bước kiểm tra mã và bước dựng. Mã trên nhánh chính là mã đang chạy; không có chuyện "bản ở máy tôi mới là bản đúng". Những gì không nằm trên GitHub, như khóa khai trên Vercel hay các lệnh đã chạy trên cơ sở dữ liệu, thì phải được ghi lại trong nhật ký, nếu không sẽ không ai biết.

Từ đó ra quy tắc vàng, ghi ngay đầu CLAUDE.md: đầu phiên `git pull`, cuối phiên commit và `git push`. Lệnh `git log --oneline` liệt kê mọi lần ghi sổ, mỗi lần một dòng, nên nó cũng là nhật ký "các bước đã làm" luôn đồng bộ giữa các máy.

### 7.3.1. Vì sao không đặt dự án trong OneDrive

Nhiều cơ quan quen để tài liệu trong OneDrive hay Dropbox. Với kho mã nguồn, tệp quy tắc của dự án nói rõ: không, vì ba lẽ: hỏng thư mục `.git`, kẹt thư mục `node_modules`, sinh bản sao xung đột.

Thư mục `.git` là cuốn sổ lịch sử gồm rất nhiều tệp nhỏ phải khớp nhau từng trang. Dịch vụ đồng bộ chép từng tệp ở chế độ nền; chép được nửa cuốn thì mất mạng là sổ rách trang. Thư mục `node_modules` là kho vật tư gồm rất nhiều tệp tải về tự động, xóa đi tải lại được bất cứ lúc nào; đồng bộ nó chỉ làm nghẽn đường truyền. Hai máy cùng sửa một tệp thì dịch vụ đồng bộ không biết gộp, đẻ ra bản sao mang tên máy, không rõ bản nào là thật.

Phải thành thật rằng chính dự án của tôi cũng có chỗ chưa theo đúng quy tắc này. Đoạn hướng dẫn đăng ký tác vụ chạy bản tin pháp luật hằng ngày vẫn trỏ tới một thư mục nằm trong OneDrive của máy cơ quan. Quy tắc ghi trên giấy mà không có cơ chế nào chặn, nên thực tế trượt khỏi quy tắc lúc nào không hay (mục 7.7 sẽ quay lại bài học này).

### 7.3.2. Máy mới và tệp .env

Phần "máy mới, làm một lần" trong bộ nhớ dự án có bốn bước, Chương 5 đã hướng dẫn chi tiết. Bước hay bị quên nhất là tạo tệp `.env` từ tệp mẫu `.env.example`: tệp này chứa khóa kết nối cơ sở dữ liệu và có thể cả các khóa bí mật (khóa AI, mã bot), cố ý không đưa lên GitHub, nên máy nào cũng phải tạo lại bằng tay.

Dự án có tác vụ tự động thì càng phải chú ý. Máy ở cơ quan của tôi tự chạy bộ sinh bản tin mỗi sáng rồi tự đẩy lên, nên gần như ngày nào GitHub cũng có lần ghi sổ mới mà máy ở nhà chưa có. Quên kéo về mà cứ làm thì đến lúc đẩy lên sẽ bị từ chối, phải gộp hai dòng lịch sử.

::: {.thuchanh}
**Thực hành: một phiên làm việc chuẩn**

1. Mở thư mục dự án (ngoài OneDrive), chạy `git pull`. Báo lỗi thì dừng, nhờ AI giải thích.
2. Chạy `git status`. Có tệp sửa dở từ lần trước thì quyết định giữ hay bỏ trước khi giao việc mới.
3. Giao một việc theo khung ở Chương 6; đọc phương án AI trình, duyệt rồi mới cho làm.
4. Nghiệm thu: bản dựng xanh, kiểm thử đạt, tự mở thử trên trình duyệt.
5. Yêu cầu AI cập nhật nhật ký và bộ nhớ dự án nếu có thay đổi đáng ghi.
6. Commit đúng các tệp của việc vừa làm, thông điệp tiếng Việt (mục 7.4).
7. Chạy `git push`, chờ vài phút rồi mở bản đang chạy thật để xem lại.
:::

::: {.canhbao}
**Cảnh báo**

Kho mã công khai thì ai cũng đọc được, kể cả lịch sử. Trước lần commit đầu tiên, hãy bảo AI kiểm tra `.gitignore` đã chặn `.env`, `node_modules`, thư mục nháp và mọi tệp chứa dữ liệu thật hay chưa. Dự án của Văn phòng chặn tệp danh bạ điện thoại và hồ sơ đánh giá cá nhân dùng làm mẫu bằng cách này.
:::

## 7.4. Commit nhỏ, thông điệp rõ ràng: lịch sử là hồ sơ khôi phục được

Mỗi lần ghi sổ (commit) là một lần chụp lại trạng thái các tệp đã chọn, kèm lời ghi chú (thông điệp commit), tên người làm, ngày giờ. Giống như mỗi lần sửa bản vẽ thì đóng dấu, ghi ngày, ghi lý do vào sổ lưu trữ bản vẽ. Từ cuốn sổ ấy, ta xem lại được bất kỳ phiên bản nào trong quá khứ.

### 7.4.1. Một việc, một lần ghi sổ, đúng các tệp liên quan

Commit nhỏ nghĩa là mỗi lần ghi sổ chứa một việc trọn vẹn. Nhờ vậy, đọc lịch sử thì hiểu từng bước; hoàn tác một việc không kéo theo việc khác; có lỗi thì khoanh vùng được nó sinh ra từ lần nào.

"Trọn vẹn" cũng có nghĩa là đủ. Lần ghi sổ ngày 22/10/2026 chuyển Sổ tay AI sang NotebookLM chạm vào bảy tệp: bốn tệp mã, tệp kiến thức của bot chat, tệp kiến trúc và tệp nhật ký. Mã, bộ nhớ dự án và kiến thức của bot sửa cùng một lần, không hẹn "lần sau bổ sung".

Quy ước của dự án còn dặn một điều: chỉ đưa vào sổ đúng các tệp của việc đang làm, "không vơ tệp/thay đổi lạ đang chờ của người dùng". Thư mục làm việc thường có những thứ đang viết dở; lệnh gom tất cả (`git add .`) sẽ đưa luôn chúng lên kho công khai.

### 7.4.2. Thông điệp tiếng Việt viết cho người đọc sau

Thông điệp commit của dự án viết bằng tiếng Việt có dấu, theo khuôn: dòng đầu nêu phân hệ và việc; một dòng trống; thân gồm các gạch đầu dòng nêu nguyên nhân, cách sửa; dòng cuối ghi AI là đồng tác giả. Đây là thông điệp thật của lần vá lỗi ngày 28/9/2026, đã lược bớt và giản lược vài chữ kỹ thuật:

```text
Vá lỗi sập phân hệ đầu mỗi kỳ mới

- useState(people[0].id): biểu thức truyền vào useState vẫn được
  TÍNH ở mọi lần render, nên khi kỳ chưa có dữ liệu thì ném lỗi
  và cả phân hệ sập. Đổi sang hàm khởi tạo lười.
- Kỳ mới chưa có dữ liệu: tự chuyển tiếp danh sách cán bộ từ kỳ
  gần nhất thay vì để màn hình trắng.

Co-Authored-By: [tên mô hình AI] <...>
```

Dòng đầu thực tế dài hơn một chút nhưng vẫn nằm trên một dòng. Người không biết lập trình đọc vẫn hiểu: hỏng gì, vì sao, đã làm gì.

| Thông điệp kém | Thông điệp tốt |
|---|---|
| sửa lỗi | Vá lỗi sập phân hệ đầu mỗi kỳ mới (OKR/KPI, Kiểm điểm, Quản lý cán bộ) |
| update | Sổ tay AI: chuyển hẳn sang dùng NotebookLM |
| auto | bantin: bản tin pháp luật ngày 26/10/2026 |

Dòng cuối bảng là thông điệp do máy tự viết mỗi sáng khi đẩy bản tin lên. Tiền tố cố định "bantin:" giúp lọc riêng các lần ghi sổ tự động khỏi các lần sửa phần mềm.

### 7.4.3. Khôi phục: ba mức

Có ba mức dùng lịch sử, từ nhẹ đến nặng:

```bash
git log --oneline -20        # xem 20 lần ghi sổ gần nhất
git show <mã>:<đường dẫn>    # xem lại một tệp ở thời điểm cũ
git revert <mã>              # hoàn tác một lần ghi sổ
```

Lệnh thứ hai từng được dùng khi làm chức năng chọn ngày xem lại bản tin: kho lưu trữ mới có một ngày, AI lấy lại bản tin ngày 09/9/2026 từ lịch sử để kho có ngay hai ngày. Lệnh thứ ba hoàn tác bằng một lần sửa ngược lại, không xóa gì khỏi sổ. Hai bản giao diện "Mới" và "PRO" đã gỡ khỏi dự án cũng vậy: mã của chúng vẫn nằm trong lịch sử, cần thì lấy lại được.

Những lệnh "viết lại lịch sử", xóa hẳn các lần ghi sổ, thuộc nhóm việc luôn phải hỏi người (mục 7.7). Cũng cần phân biệt: lịch sử Git là hồ sơ kỹ thuật, không thay thế hồ sơ lưu trữ theo Luật Lưu trữ số 33/2024/QH15 và quy định về văn thư (đây là nhận định nghiệp vụ của tôi, không phải trích một điều luật). Kết quả đánh giá, biên bản chính thức vẫn phải được ký, ban hành, lưu trữ theo quy trình của cơ quan.

### 7.4.4. Lịch sử nhớ dai — con dao hai lưỡi

Cũng vì sổ không xóa, tệp lỡ commit rồi thì xóa ở lần sau vẫn còn trong lịch sử; với kho công khai là đã công bố. Dự án của tôi để lọt một tệp thử trong thư mục nháp vì `.gitignore` chưa chặn thư mục đó; khi viết sách (10/2026) tệp vẫn còn trong kho. May là tệp chỉ chứa địa chỉ dự án và khóa công khai, loại khóa vốn được thiết kế để nằm trong mã trình duyệt. Nếu đó là số điện thoại hay hồ sơ cán bộ thì chuyện đã khác.

::: {.phaply}
**Căn cứ pháp lý**

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 được Quốc hội thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026. Luật phân dữ liệu cá nhân thành dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm; danh mục cụ thể do Chính phủ quy định. Theo Điều 3 Nghị định 356/2025/NĐ-CP quy định chi tiết một số điều và biện pháp thi hành Luật Bảo vệ dữ liệu cá nhân (có hiệu lực cùng ngày 01/01/2026), họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình đều thuộc danh mục dữ liệu cá nhân cơ bản. Đưa chúng vào kho mã công khai là làm lộ dữ liệu cá nhân cho bất kỳ ai, và lịch sử Git giữ chúng lại cả khi tệp đã bị xóa. Đồng chí nên tra nguyên văn Luật trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi áp dụng.
:::

::: {.lenhmau}
**Câu lệnh mẫu 7.4 — Tìm lại và khôi phục một phiên bản cũ**

```text
BỐI CẢNH: Từ khoảng [ngày], [mô tả hiện tượng: ví dụ nút xuất
Word của phân hệ X không còn in cột Ghi chú].
VIỆC: (1) Tra lịch sử commit, tìm lần ghi sổ đã làm thay đổi
hành vi này; giải thích bằng lời thường lần đó đổi gì, vì sao.
(2) Đề xuất cách khôi phục: hoàn tác cả lần ghi sổ hay chỉ sửa
lại một phần. Nêu hệ quả của từng cách.
RÀNG BUỘC: chỉ dùng cách hoàn tác có ghi thêm lần sửa mới (như
git revert); KHÔNG dùng lệnh viết lại lịch sử, KHÔNG đẩy lên
khi chưa được tôi đồng ý.
NGHIỆM THU: sau khi tôi chọn cách, bản dựng xanh, kiểm thử đạt
và tôi mở thử thấy cột Ghi chú trở lại.
```
:::

## 7.5. Quy tắc "rà soát chức năng liên quan"

::: {.cauchuyen}
**Câu chuyện thực tế: ngày 13/8/2026, hai việc đúng, hai hậu quả sai**

Hôm đó dự án làm hai việc lớn. Việc thứ nhất: tách kho dữ liệu theo phân hệ. OKR/KPI (chấm theo tháng) và Kiểm điểm (chấm theo quý) đang ghi chung một dòng dữ liệu đặt tên theo năm và tháng; mở phân hệ này thì cơ chế tự lưu ghi đè danh sách của phân hệ kia. AI sửa bằng cách thêm tiền tố riêng cho Kiểm điểm, giữ nguyên tên cũ cho OKR/KPI. Việc thứ hai: gộp danh sách cán bộ về một mối là hồ sơ 2C trong phân hệ Quản lý cán bộ.

Cả hai việc chạy đúng, bản dựng xanh. Nhưng bot chat dò tên các dòng dữ liệu bằng một mẫu so khớp riêng, chỉ nhận tên kiểu cũ. Nhật ký lúc ấy còn ghi rằng mẫu này "tự loại" các tên mới, nên bot "vẫn đọc đúng" phần OKR/KPI. Không ai hỏi ngược lại: vậy bot có cần đọc Kiểm điểm không? Kết quả là bot mất hẳn phân hệ Kiểm điểm. Còn việc gộp danh sách làm lộ một lỗi cũ: hai đồng chí trùng họ tên ở hai đơn vị bị ghép làm một, danh sách OKR/KPI còn 27 thay vì 28 người.

Sau đó, tôi yêu cầu ghi vào tệp quy ước một quy tắc bắt buộc, kèm luôn hai sự cố làm ví dụ: "cả hai đều là hệ quả dây chuyền lẽ ra phải tự thấy".
:::

Quy tắc ấy nguyên văn như sau: sửa xong một chỗ thì "chủ động kiểm tra và hoàn thiện MỌI chức năng liên quan trong cùng lần sửa, không chờ người dùng phát hiện hỏng". Câu hỏi then chốt là: "chỗ nào khác đang đọc/ghi thứ vừa đổi?". Và cách trả lời phải là "kiểm chứng THẬT (chạy thử, không đoán)".

Giống như đổi số phòng mà quên sửa bảng chỉ dẫn ở sảnh: phòng vẫn làm việc, chỉ khách là không tìm thấy. Lỗi dây chuyền nguy hiểm vì nó không hiện ra ở chỗ vừa sửa.

Giá trị lớn nhất của quy tắc nằm ở danh mục "đường dây" cụ thể đi kèm. Dưới đây là bản đồ của dự án Văn phòng; ba dòng đầu ghi sẵn trong tệp quy ước, các dòng sau tôi rút từ các sự cố khác:

| Khi đổi | Phải kiểm lại |
|---|---|
| Tên, định dạng dữ liệu lưu trữ | Bot chat; các hàm xuất Word, Excel |
| Mô hình dữ liệu, luồng nghiệp vụ | Kiến thức tĩnh của bot |
| Quyền đọc, ghi | Chính sách bảo mật theo dòng; thử vai khách và quản trị |
| Thêm trường mới vào hồ sơ | Hàm chuẩn hóa dạng danh sách trắng |
| Thêm phân hệ mới | Kho dữ liệu riêng; Trang chủ; Hướng dẫn; bot |
| Công thức, ngưỡng xếp loại | Trang hướng dẫn; phiếu Word; bot |

Cách lập bản đồ cho dự án của đồng chí rất đơn giản: mỗi lần gặp một lỗi dây chuyền, thêm một dòng. Khi thêm phân hệ Sổ tay AI, bộ kiểm thử của phân hệ có hẳn một nhóm phép kiểm xác nhận phân hệ đã được "nối đủ" vào các chỗ trong hệ thống.

Cũng phải nói thật: quy tắc viết ra rồi vẫn có chỗ lọt. Khi đọc lại mã để viết sách, tôi thấy nguyên tắc "AI lỗi thì hoàn lại lượt đã trừ" mới áp ở khung chat Trang chủ. Hai lối gọi AI khác, của Trợ lý AI và lối tra nhanh tại chỗ của Sổ tay AI, tính đến cuối tháng 10/2026 khi AI lỗi vẫn chưa hoàn lượt. Một quy tắc tốt vẫn cần được nhắc lại và cần phép kiểm để giữ.

::: {.lenhmau}
**Câu lệnh mẫu 7.5 — Rà soát dây chuyền trước khi đóng việc**

```text
VIỆC: Trước khi commit, rà soát dây chuyền cho thay đổi vừa làm.
1. Liệt kê mọi thứ vừa đổi: tên, định dạng dữ liệu, hàm, quyền,
   công thức, chữ trên giao diện.
2. Với từng thứ, tìm trong TOÀN BỘ kho mã mọi chỗ đọc hoặc ghi
   nó (kể cả bot chat, hàm xuất báo cáo, hướng dẫn, bộ nhớ dự án).
3. Đối chiếu với bảng "Khi đổi – Phải kiểm lại" trong tệp quy
   ước; có đường dây mới thì đề xuất thêm vào bảng.
4. Sửa các chỗ bị ảnh hưởng ngay trong lần này.
RÀNG BUỘC: kiểm chứng bằng chạy thử, không suy đoán.
NGHIỆM THU: bảng kết quả "chỗ liên quan – đã kiểm bằng cách nào
– kết quả"; chỗ nào chưa kiểm được thì ghi rõ lý do.
```
:::

## 7.6. Văn hóa kiểm thử cho người không chuyên

Chủ đầu tư không cần biết tính kết cấu; họ nghiệm thu bằng tiêu chí rõ ràng, biên bản thử tải và tận mắt xem công trình. Người không biết lập trình nghiệm thu phần mềm cũng vậy, qua bốn tầng kiểm thử.

### 7.6.1. Tầng một: bản dựng phải xanh

Quy ước của dự án ghi: trước khi commit, `npm run build` phải xanh. Trong thực tế, mỗi lần còn chạy thêm bước kiểm tra mã tự động (lint) và đòi 0 lỗi. Lên GitHub, dây chuyền kiểm tra tự động chạy lại hai bước đó một lần nữa. Đây là cổng tối thiểu, rẻ, không bao giờ được bỏ. Nhưng nhớ rằng: bản dựng xanh chỉ chứng minh phần mềm "lắp ráp được", chưa chứng minh nó "chạy đúng". Lỗi sập phân hệ đầu tháng (mục 7.4.2) đã đi qua cổng này mà không ai thấy, vì bản dựng không biết rằng ngày đầu tháng danh sách sẽ rỗng.

### 7.6.2. Tầng hai: phép kiểm viết bằng ngôn ngữ nghiệp vụ

Ở các phân hệ làm về sau (Tiêu chí Hội đồng nhân dân, Biểu quyết, Sổ tay AI, mẫu Kiểm điểm, Quản lý cán bộ), phần "tính toán" được tách khỏi giao diện và khỏi mạng thành các tệp thuần, kiểm được trong vài giây. Riêng công thức OKR/KPI của phân hệ làm đầu tiên vẫn nằm chung với giao diện; đó là món nợ kỹ thuật còn phải trả. Mỗi đợt việc như vậy có một bộ kiểm thử tự động (test) đi kèm:

| Bộ kiểm thử | Số phép kiểm | Ví dụ điều được kiểm |
|---|---|---|
| Tiêu chí Hội đồng nhân dân | 293 | Chấm tối đa đúng 100 và 110 |
| Bot chat | 199 | Tin gửi lại lần hai không được trả lời |
| Sổ tay AI | 147 | Không tự gán hiệu lực cho văn bản |
| Mẫu Kiểm điểm | 127 | Mẫu chức danh nào tổng cũng đúng 70 |
| Biểu quyết | 90 | 42/82 thì thông qua, 41/82 thiếu 1 phiếu |
| Bản tin (Python) | 42 | "Họp báo" không bị nhận là tin bão |

Đồng chí không cần đọc mã của phép kiểm, chỉ cần đọc danh sách tên của chúng như đọc tiêu chí nghiệm thu. Thêm một nguyên tắc: mỗi lỗi thật đã gặp phải trở thành một phép kiểm hồi quy (regression test) giữ lại mãi, để lỗi đó không quay về. Các điều cấm cũng thành phép kiểm: không có số điện thoại nào trong mã nguồn; kiến thức của bot không chứa mật khẩu.

Dự án của tôi có một lỗ hổng ở đây: năm trong sáu bộ kiểm thử ở bảng trên (các bộ viết bằng JavaScript) nằm trong thư mục nháp, không có trên GitHub, nên máy khác không chạy lại được; riêng bộ kiểm thử bản tin nằm cùng bộ sinh bản tin và có trong kho. Cách đúng là đặt chúng trong thư mục được commit, gắn vào một lệnh chung như `npm test`.

### 7.6.3. Tầng ba: kiểm chứng trên bản dựng thật

Phép kiểm logic không nhìn thấy giao diện. Với thay đổi lớn, tôi yêu cầu AI dựng bản thật rồi điều khiển một trình duyệt tự động, không giao diện (headless browser). Trình duyệt ấy mở từng đường dẫn phân hệ, bấm qua mọi thẻ, đếm số lỗi phát sinh (phải bằng 0) và số cán bộ hiển thị (28 ở OKR/KPI, 15 ở Kiểm điểm). Với chức năng xuất Word, AI bấm xuất tệp thật rồi đọc lại tệp để đối chiếu tiêu đề và từng bảng. Có lần đo chữ trên ảnh xem trước khi chia sẻ liên kết, AI phát hiện một dòng kết thúc ở 1.214 điểm ảnh trong khung rộng 1.200, điều mà nhìn mã không thể thấy.

### 7.6.4. Tầng bốn: kiểm theo vai và kiểm các cái bẫy tiếng Việt

Một phần mềm có phân quyền phải được thử bằng từng vai. Dự án từng có hai lỗi chỉ lộ ra khi đổi vai. Khách và quản trị thấy hai danh sách cán bộ khác nhau; tài khoản không phải Quản trị mở phân hệ Quản lý cán bộ thì gặp trang trắng. Quy ước nay bắt buộc: đổi quyền thì thử cả vai khách lẫn vai quản trị. Nhớ rằng ẩn một nút trên giao diện không phải là bảo mật; quyền thật nằm ở cơ sở dữ liệu (Chương 19).

Với tiếng Việt, luôn cần một nhóm phép kiểm cho các cặp dễ nhầm. "Quốc gia" không được khớp với từ khóa "gia"; "báo" và "bão" không được coi là một. "Phó trưởng ban" phải được xét trước "trưởng ban", vì chuỗi sau nằm trọn trong chuỗi trước. Chữ có dấu phải còn nguyên sau khi lưu, nạp, xuất tệp. AI không tự nghĩ tới những cái bẫy này; người làm văn bản tiếng Việt phải nói ra.

::: {.lenhmau}
**Câu lệnh mẫu 7.6 — Viết bộ kiểm thử bằng ngôn ngữ nghiệp vụ**

```text
VIỆC: Viết bộ kiểm thử tự động cho [tên chức năng, ví dụ: chấm
điểm và xếp loại của phòng].
YÊU CẦU:
1. Tách phần tính toán ra tệp riêng nếu đang lẫn trong giao diện.
2. Mỗi phép kiểm đặt tên bằng một câu tiếng Việt nghiệp vụ, ví dụ
   "tổng 89,9 điểm thì không được xếp Hoàn thành xuất sắc".
3. Bắt buộc có: ca biên (đúng ngưỡng, dưới ngưỡng 0,1); danh sách
   rỗng; ngày đầu tháng, đầu quý; trùng họ tên khác đơn vị; cặp
   chữ dễ nhầm có dấu, không dấu.
4. Đặt bộ kiểm thử trong thư mục được commit, chạy bằng npm test.
NGHIỆM THU: in danh sách tên các phép kiểm để tôi đọc; chạy cho
tôi xem kết quả; cố ý làm sai một ngưỡng để chứng minh phép kiểm
bắt được lỗi, rồi trả lại như cũ.
```
:::

## 7.7. Ủy quyền cho AI tới đâu

Đến một lúc, ngồi bấm "đồng ý" cho từng lệnh commit, từng lệnh đẩy lên trở nên vô nghĩa. Tôi ghi vào tệp quy ước một ủy quyền lâu dài. Sau khi hoàn thành mỗi thay đổi, AI chạy bản dựng; thấy xanh thì đưa vào sổ đúng các tệp liên quan, commit và đẩy lên nhánh chính "ngay, KHÔNG cần hỏi lại". Kèm theo là điều kiện: "chỉ commit thay đổi của việc đang làm; không vơ tệp/thay đổi lạ đang chờ của người dùng".

Nghe có vẻ táo bạo, vì đẩy lên nhánh chính là phần mềm thay đổi sau một hai phút. Tôi chấp nhận được vì ủy quyền đứng trên năm điều kiện. Bản dựng xanh là cổng bắt buộc, có cả máy kiểm lại trên GitHub; chạy các bộ kiểm thử liên quan là thực hành đi kèm, dù chưa được máy ép buộc (mục 7.6.2). Mỗi lần ghi sổ nhỏ, hoàn tác được. Nhật ký ghi lại mọi việc. Hệ thống là bản demo có nhãn rõ ràng; phần chấm điểm, biểu quyết, tiêu chí dùng dữ liệu mô phỏng, còn số ít dữ liệu thật (như danh bạ điện thoại) chỉ nằm trong cơ sở dữ liệu có phân quyền, không bao giờ nằm trong mã. Dự án chỉ có một người giao việc. Vì đã có một phần dữ liệu thật, danh sách "luôn hỏi người" dưới đây phải giữ nghiêm. Thiếu một điều, chẳng hạn nhiều người cùng làm hay hệ thống đã vận hành chính thức, thì nên làm thận trọng hơn: sửa trên nhánh riêng, có người xem xét rồi mới gộp vào nhánh chính.

Điều này không trái với nguyên tắc con người trong vòng lặp (Human-in-the-Loop, Tập 1, mục 7.5), vốn không chấp nhận AI tự động hoàn toàn trong khu vực công: ủy quyền chỉ áp cho thao tác kỹ thuật trên bản demo; người vẫn giao việc, duyệt phương án và nghiệm thu. Với hệ thống chính thức, mỗi thay đổi phải có người duyệt trước khi triển khai.

Quan trọng hơn ủy quyền là ranh giới của nó. Tôi chia việc thành ba mức:

- **AI tự làm:** sửa mã theo việc đã giao; chạy bản dựng, kiểm thử; commit đúng tệp; đẩy lên khi xanh; cập nhật nhật ký.
- **AI làm nhưng phải báo rõ:** thêm thư viện mới; đổi cấu trúc dữ liệu kèm nâng cấp bản lưu cũ; sửa nhiều phân hệ một lúc.
- **Luôn hỏi người:** đổi quyền đọc, ghi; chạy lệnh trên cơ sở dữ liệu thật; xóa dữ liệu; khóa bí mật; cách hiểu văn bản, công thức, ngưỡng xếp loại; đưa dữ liệu thật vào; phát sinh chi phí; viết lại lịch sử; đổi chế độ công khai của kho.

Mức thứ ba không phải lý thuyết. Các đoạn lệnh thay đổi quyền do AI viết vào tệp lược đồ, còn chạy chúng trên dữ liệu thật thì tôi tự làm trong trang quản trị Supabase; nhật ký đánh dấu ⚠️ "CẦN CHẠY" ở những chỗ ấy. Còn lần nào AI "chọn đại" một cách hiểu văn bản mà không hỏi, như khi coi nhiệm vụ làm được 9/10 là "không hoàn thành", thì phần mềm ép xếp loại thấp sai cho cả người có điểm cao (lỗi phát hiện khi chạy thử trên dữ liệu thử nghiệm và đã được sửa bằng cách xét theo từng nhiệm vụ).

Cuối cùng, quy ước chỉ viết bằng lời thì có ngày bị trượt, như chuyện thư mục OneDrive (mục 7.3.1) hay tệp thử lọt vào kho (mục 7.4.4). Quy ước quan trọng nên được biến thành cơ chế: `.gitignore` chặn thư mục nháp; dây chuyền kiểm tra tự động báo đỏ ngay khi bản dựng hỏng; phép kiểm chặn số điện thoại trong mã; các bộ kiểm thử được gắn vào dây chuyền tự động. Máy giữ kỷ luật bền hơn trí nhớ của người, và của cả AI.

::: {.phaply}
**Căn cứ pháp lý**

Luật Trí tuệ nhân tạo số 134/2025/QH15 được Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026. Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Điều này cũng yêu cầu duy trì sự kiểm soát và khả năng can thiệp của con người đối với quyết định, hành vi của hệ thống AI. Ủy quyền cho tác tử tự commit, tự triển khai không chuyển trách nhiệm sang AI. Theo tinh thần đó, tôi cho rằng ủy quyền cho AI nên có giới hạn, có nhật ký và thu hồi được. Đồng chí nên tra nguyên văn Luật trên Cơ sở dữ liệu quốc gia về văn bản pháp luật trước khi áp dụng.
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Mọi ứng dụng cán bộ tự làm nên có bộ nhớ dự án và nhật ký thay đổi. Đó là điều kiện để người khác tiếp nhận, tránh cảnh "chỉ một người biết".
- Hỏi người làm: ủy quyền cho AI đã ghi thành văn bản chưa, ranh giới ở đâu, ai chạy các lệnh trên dữ liệu thật.
- Khi nghe "đã xong", hãy hỏi "lấy gì chứng minh": bao nhiêu phép kiểm, đã thử trên bản thật và bằng vai nào.
- Trách nhiệm về phần mềm thuộc về người giao việc và người duyệt, không thuộc về AI.
:::

::: {.lenhmau}
**Câu lệnh mẫu 7.7 — Ghi ủy quyền có điều kiện vào bộ nhớ dự án**

```text
VIỆC: Thêm vào .claude/rules/conventions.md mục "ỦY QUYỀN CHO AI"
gồm ba danh sách theo đúng ba mức tôi liệt kê dưới đây:
(1) TỰ LÀM KHÔNG HỎI: [chạy dựng, kiểm thử; xanh thì commit ĐÚNG
tệp của việc đang làm, đẩy lên nhánh [tên nhánh]; cập nhật nhật
ký].
(2) LÀM NHƯNG PHẢI BÁO: [thêm thư viện; đổi cấu trúc dữ liệu].
(3) LUÔN HỎI TRƯỚC: [đổi quyền; lệnh trên dữ liệu thật; xóa dữ
liệu; khóa bí mật, .env; cách hiểu văn bản; chi phí].
RÀNG BUỘC: ghi rõ "không vơ tệp lạ đang chờ của người dùng" và
"bản dựng đỏ thì dừng, báo lại, không đẩy lên".
NGHIỆM THU: đọc lại cho tôi duyệt trước khi commit.
```
:::

## Tóm tắt chương 7

::: {.tomtat}
1. Tác tử AI quên sau mỗi phiên; lịch sử hội thoại không theo sang máy khác. Bối cảnh quan trọng phải nằm ở mã nguồn, lịch sử commit và bộ nhớ dự án.
2. Bộ nhớ dự án gồm một tệp CLAUDE.md ngắn và các tệp quy tắc theo chủ đề; viết như quy chế, kèm lý do, và cập nhật cùng lúc với mã.
3. Nhật ký thay đổi là sổ giao ban: làm gì, vì sao, sửa ở đâu, ai chốt, người còn phải làm gì, kiểm thử bằng gì.
4. GitHub là nguồn duy nhất: đầu phiên kéo về, cuối phiên đẩy lên; không đặt kho mã trong OneDrive; tệp .env tạo lại trên từng máy.
5. Mỗi việc một lần commit, đúng tệp liên quan, thông điệp tiếng Việt rõ ràng; lịch sử khôi phục được nhưng cũng giữ mãi những gì lỡ đưa lên.
6. Sửa xong một chỗ phải hỏi "chỗ nào khác đang đọc, ghi thứ vừa đổi" và kiểm chứng bằng chạy thử.
7. Kiểm thử bốn tầng: bản dựng xanh; phép kiểm bằng ngôn ngữ nghiệp vụ; kiểm trên bản thật; kiểm theo vai và các bẫy tiếng Việt.
8. Ủy quyền cho AI phải có điều kiện, có ranh giới viết thành văn bản; trách nhiệm luôn thuộc về con người.
:::

## Câu hỏi suy ngẫm và bài tập

1. Nếu ngày mai đồng chí được điều động công tác khác, một đồng nghiệp có thể tiếp tục dự án của đồng chí chỉ bằng những gì đang nằm trong kho mã không? Còn thiếu gì?
2. Mở `git log --oneline`, đọc năm thông điệp gần nhất. Người không biết lập trình có hiểu đã làm gì không? Viết lại những thông điệp chưa đạt.
3. Lập bảng "Khi đổi – Phải kiểm lại" cho dự án của đồng chí, ít nhất bốn dòng.
4. Viết mười tên phép kiểm bằng tiếng Việt nghiệp vụ cho một chức năng đồng chí đang làm, trong đó có ít nhất hai cặp chữ dễ nhầm.
5. Liệt kê ba việc đồng chí sẽ không bao giờ ủy quyền cho AI tự làm, và giải thích vì sao.
