# Chương 7. Bộ nhớ dự án và kỷ luật làm việc

::: {.muctieu}
**Mục tiêu của chương**

- Hiểu vì sao tác tử AI lập trình "quên" sau mỗi phiên, và biết lập bộ nhớ dự án (tệp CLAUDE.md, thư mục quy tắc) để AI tự đọc lại mỗi khi bắt đầu làm việc.
- Biết ghi nhật ký thay đổi như một cuốn sổ giao ban: làm gì, vì sao, kiểm chứng bằng gì, còn việc gì người phải tự làm.
- Làm việc trên nhiều máy với GitHub là nguồn duy nhất; ghi lịch sử bằng những lần commit nhỏ, thông điệp tiếng Việt rõ ràng, khôi phục được khi cần.
- Áp dụng quy tắc "rà soát chức năng liên quan" và một văn hóa kiểm thử vừa sức người không chuyên lập trình.
- Vạch được ranh giới ủy quyền cho AI: việc gì AI tự làm, việc gì luôn phải hỏi lại người.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ cả chương, làm theo các câu lệnh mẫu); lãnh đạo nên đọc mục 7.2, 7.7 và hộp "Dành cho lãnh đạo".
:::

Ai làm việc với tác tử AI lập trình cũng sẽ gặp chuyện này ngay trong tuần đầu. Buổi sáng, đồng chí dặn AI rất kỹ: phần mềm này của cơ quan dân cử, chữ trên giao diện phải là tiếng Việt có dấu, điểm Nhóm I tối đa 30, không được đụng vào phần xuất Word. Buổi chiều mở phiên mới, AI làm như chưa từng nghe những lời dặn ấy. Tối về nhà mở máy khác, mọi thứ còn tệ hơn: máy ở nhà không hề biết buổi sáng đã bàn những gì.

Tôi đã gặp đúng chuyện đó khi xây dựng hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa (địa chỉ hdndthkpi.vercel.app) cùng tác tử AI lập trình Claude Code trong năm 2026. Hãy hình dung tổ chuyên viên kỹ thuật mà ta giao việc, sáng nào cũng là người mới đến lần đầu. Họ giỏi, nhanh, nhưng không biết hôm qua ai đã quyết định điều gì, vì sao. Không có sổ bàn giao thì mỗi ngày ta mất nửa buổi kể lại từ đầu, và sớm muộn sẽ có ngày quên kể một điều hệ trọng.

Chương này bàn về cuốn "sổ bàn giao" ấy và những kỷ luật đi kèm: nhật ký thay đổi, quy trình làm việc trên nhiều máy, cách ghi lịch sử, quy tắc rà soát dây chuyền, văn hóa kiểm thử và ranh giới ủy quyền cho AI. Không điều nào ở đây đòi hỏi biết lập trình. Tất cả là thói quen của một người làm công tác văn phòng cẩn thận, chỉ áp vào một loại hồ sơ mới. Phần lớn các kỷ luật này không do tôi nghĩ ra từ đầu. Chúng ra đời sau một sự cố, và tôi sẽ kể cả những sự cố đó.

Chương 5 đã hướng dẫn dựng "xưởng làm việc số" (cài đặt công cụ, mở tài khoản). Chương 6 đã bàn cách giao việc cho tác tử. Chương này trả lời câu hỏi tiếp theo: làm sao để công việc tích lũy qua hàng tháng trời mà không rơi rớt, không đổ vỡ dây chuyền, và người khác tiếp nhận được.

## 7.1. Vì sao AI "quên" và cách cho AI một bộ nhớ

### 7.1.1. Ba tầng trí nhớ của tác tử AI

Muốn biết AI quên cái gì, cần phân biệt ba tầng trí nhớ.

Tầng thứ nhất là những gì AI đang "bày trên bàn" trong phiên làm việc, gọi là cửa sổ ngữ cảnh (context window). Mọi lời đồng chí dặn, mọi tệp AI vừa đọc, mọi kết quả lệnh vừa chạy đều nằm ở đây. Bàn rộng nhưng có giới hạn. Phiên càng dài, giấy tờ càng chồng lên nhau; đến lúc nào đó, lời dặn từ đầu phiên bị tóm tắt lại và rơi mất chi tiết. Đóng phiên là dọn sạch bàn.

Tầng thứ hai là lịch sử hội thoại mà công cụ lưu trên chính chiếc máy đang dùng. Nhờ nó, đồng chí mở lại được một phiên cũ. Nhưng tệp quy tắc đa máy của dự án ghi một nhận xét mà tôi phải trả giá mới hiểu: "Bộ nhớ hội thoại của Claude Code là cục bộ từng máy, KHÔNG tự đồng bộ." Dặn ở máy cơ quan thì máy ở nhà không biết.

Tầng thứ ba là bộ nhớ dự án: những tệp văn bản nằm ngay trong kho mã nguồn (repository) và được tác tử tự đọc mỗi khi mở phiên. Đây là tầng duy nhất đi theo dự án sang mọi máy, vì nó được lưu cùng mã nguồn lên GitHub. Cũng trong tệp quy tắc ấy, kết luận được viết rõ: mọi bối cảnh quan trọng phải nằm ở (a) mã nguồn, (b) lịch sử commit, (c) tệp CLAUDE.md và thư mục `.claude/rules/`.

Ví von cho dễ nhớ: tầng thứ nhất là trí nhớ trong buổi làm việc của chuyên viên; tầng thứ hai là cuốn sổ tay riêng để trong ngăn bàn ở một trụ sở; tầng thứ ba là bộ hồ sơ công việc cất trong tủ chung, ai đến làm cũng phải mở ra đọc trước.

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
- commands-and-deploy.md — lệnh npm build/dev/lint...
- ...
> Khi hoàn thành việc lớn: cập nhật changelog.md rồi push.
```

Vì sao phải ngắn? Vì tệp này được đọc ở mọi phiên, kể cả phiên chỉ sửa một dấu phẩy. Viết dài thì phiên nào AI cũng phải "đọc" hết, chiếm chỗ trên bàn làm việc mà phần lớn không dùng tới. Ban đầu tôi để mọi thứ trong một tệp CLAUDE.md. Khi dự án lớn dần, tôi giao AI tách theo chủ đề. Nhật ký dự án ghi việc này bằng một dòng: "Tổ chức bộ nhớ dự án: tách CLAUDE.md thành các file chủ đề trong .claude/rules/".

### 7.1.3. Thư mục quy tắc — bộ hồ sơ theo chủ đề

Thư mục `.claude/rules/` của dự án hiện có bảy tệp:

| Tệp | Nội dung chính | AI đọc khi nào |
|---|---|---|
| project-overview.md | Dự án là gì, công nghệ, địa chỉ, nhãn demo | Mọi phiên |
| commands-and-deploy.md | Lệnh dựng, chạy thử, triển khai | Mọi phiên |
| multi-machine-workflow.md | Quy trình cơ quan ↔ nhà | Mọi phiên |
| conventions.md | Quy ước viết mã, commit, ủy quyền | Mọi phiên |
| architecture.md | Tệp nào làm gì, sửa ở đâu | Khi sửa mã |
| data-model.md | Đối tượng, dữ liệu, công thức điểm | Khi sửa giao diện |
| changelog.md | Nhật ký các bước đã làm | Mọi phiên |

Tệp kiến trúc dài khoảng sáu nghìn chữ. Không lẽ phiên nào cũng bắt AI đọc? Cách giải quyết là khai "phạm vi đường dẫn" ở đầu tệp:

```text
---
paths:
  - "src/**"
  - "api/**"
  - "supabase/**"
---
# Kiến trúc & nơi sửa
```

Mấy dòng này có nghĩa: chỉ khi công việc chạm vào thư mục `src/`, `api/` hoặc `supabase/` thì tệp mới được đưa lên bàn. Phiên chỉ sửa tài liệu không phải gánh sáu nghìn chữ kiến trúc. Giống như hồ sơ kỹ thuật công trình chỉ mang ra khi bàn chuyện sửa trụ sở; họp về nhân sự thì để yên trong tủ.

Thư mục quy tắc phải được đưa lên GitHub thì máy khác mới đọc được. Nhưng cùng thư mục `.claude` còn có cấu hình riêng của từng máy, không nên đồng bộ. Tệp `.gitignore` (danh sách những gì Git bỏ qua) của dự án xử lý bằng ba dòng: bỏ qua mọi thứ trong `.claude`, trừ thư mục `rules`.

```text
.claude/*
!.claude/rules/
!.claude/rules/**
```

Chi tiết nhỏ nhưng quyết định. Thiếu ba dòng này, bộ nhớ dự án chỉ tồn tại trên chiếc máy đã viết ra nó.

### 7.1.4. Viết bộ nhớ thế nào để AI đọc đúng

Kinh nghiệm của tôi gói trong sáu điều.

1. **Viết như quy chế, không như tâm sự.** Mỗi quy tắc là một câu mệnh lệnh, rõ việc, rõ thời điểm: "Trước khi commit: `npm run build` phải xanh." Tránh lối "nên cố gắng nếu có thể".
2. **Kèm lý do và bài học.** Quy tắc có lý do thì AI áp dụng đúng cả trong tình huống chưa gặp. Tệp quy ước của dự án ghi luôn sự cố ngày 13/8/2026 ngay trong quy tắc rà soát (mục 7.5).
3. **Đặt cảnh báo ngay tại chỗ trong mã.** Ngoài bộ nhớ chung, chỗ nguy hiểm có dòng chú thích tiếng Việt mở đầu bằng ký hiệu ⚠️. Ở tệp lưu hồ sơ cán bộ có dòng: "normalize là DANH SÁCH TRẮNG các trường được giữ lại — thêm trường mới vào hồ sơ thì PHẢI khai ở đây, nếu không sẽ bị gọt mất ngay lúc lưu/nạp". Phiên sau, người hay AI mở tệp ấy đều thấy cảnh báo trước khi sửa.
4. **Ghi cả điều cấm và điều AI hay nói sai.** Kiến thức của bot chat từng được dặn thẳng: điểm tối đa từng trục kiểm điểm không cố định, "đừng nói là 15/10/10/15/10/10".
5. **Một sự thật, một nơi ghi.** Công thức đã nằm trong tệp mô hình dữ liệu thì tệp khác chỉ dẫn chiếu, không chép lại. Chép hai nơi thì có ngày hai nơi lệch nhau.
6. **Cập nhật cùng lúc với mã.** Đây là điều khó giữ nhất.

Điều thứ sáu khó đến mức chính dự án của tôi chưa giữ trọn. Đọc lại bộ nhớ dự án vào tháng 10/2026, tôi thấy vài chỗ đã lỗi thời. Tệp quy ước vẫn dặn sửa công thức dùng chung thì "chỉ sửa App.jsx (2 bản giao diện kia import lại từ đó)", trong khi hai bản giao diện ấy đã bị gỡ bỏ từ lâu. Dòng đầu CLAUDE.md vẫn giới thiệu "Hệ thống Đánh giá, xếp loại cán bộ, công chức theo OKR/KPI", dù hệ thống đã thành cổng nhiều phân hệ và tên trang đã đổi thành tên cơ quan. Trước đó nữa, kiến thức của bot từng ghi "trợ lý không đọc được lịch" sau khi bot đã đọc được; trang hướng dẫn từng ghi ngưỡng xếp loại 80/65 trong khi phần mềm tính theo 70/50.

Mỗi chỗ lỗi thời là một cái bẫy. AI đọc bộ nhớ, tin là đúng, rồi làm theo điều không còn đúng. Cách chữa là định kỳ giao chính AI đối chiếu bộ nhớ với mã nguồn, như một cuộc kiểm tra nội bộ. Mẫu đầy đủ của một bộ nhớ dự án cho cơ quan có ở Phụ lục 3; dưới đây là hai câu lệnh để lập mới và để kiểm tra.

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
   việc đa máy; kiến trúc (chỉ nạp khi sửa mã); quy ước; nhật ký.
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

Lịch sử commit cho biết đã đổi những gì. Nó trả lời kém câu hỏi quan trọng hơn: vì sao. Vì sao phân hệ Kiểm điểm lưu ở một chỗ riêng? Vì sao điểm thưởng vượt định mức có trần +5? Vì sao bot chống trả lời lặp theo mã tin nhắn mà không theo nội dung? Không ghi lại thì ba tháng sau chính tôi cũng quên. Còn AI phiên sau có thể "dọn cho gọn" và đưa lỗi cũ quay về.

Vì thế dự án có tệp nhật ký thay đổi (changelog) nằm ngay trong thư mục quy tắc. Đến tháng 10/2026, nhật ký dài khoảng 24.000 chữ với hơn 100 mục, mục mới nhất ở trên cùng. Tôi gọi nó là "sổ giao ban": xong mỗi việc lớn thì ghi một mục, như cuối buổi giao ban ghi kết luận.

Một mục nhật ký tốt trả lời năm câu hỏi. Bảng dưới đây lấy ví dụ từ mục ghi việc vá lỗi danh bạ điện thoại "lưu xong mở lại thì biến mất":

| Thành phần | Trả lời câu hỏi | Ví dụ trong nhật ký |
|---|---|---|
| Tiêu đề in đậm | Đã làm gì? | Vá lỗi danh bạ lưu xong thì mất |
| Nguyên nhân gốc | Vì sao hỏng? | Hàm chuẩn hóa là danh sách trắng, gọt trường mới |
| Cách sửa, tệp nào | Sửa ở đâu? | Khai trường mới vào hàm chuẩn hóa, kèm cảnh báo |
| Ký hiệu ⚠️ | Người còn phải làm gì? | Quản trị nhập lại danh bạ, lưu một lần |
| Kiểm thử | Lấy gì chứng minh? | 28 phép kiểm đạt; lint 0 lỗi; dựng xanh |

Hai thành phần cuối hay bị bỏ quên nhất, mà lại đáng giá nhất. Ký hiệu ⚠️ đánh dấu việc AI không tự làm được: chạy một đoạn lệnh trên cơ sở dữ liệu, đăng ký lại địa chỉ nhận tin của bot, nhập lại dữ liệu. Không ghi thì việc ấy rơi vào quên lãng, và phần mềm "đã sửa" mà người dùng vẫn gặp lỗi. Dòng kiểm thử thì biến lời khẳng định "đã xong" thành lời khẳng định có bằng chứng.

Nhật ký của dự án còn có một đặc điểm tôi cố ý giữ: những quyết định do tôi chọn đều ghi rõ "người dùng chốt". Ví dụ: chuyển Sổ tay AI sang chạy trên NotebookLM; để ba đồng chí lãnh đạo Văn phòng có mặt ở cả hai phân hệ chấm điểm; giữ nguyên công thức của nghị định và chỉ thêm cảnh báo khi điểm số với xếp loại chênh nhau. AI đưa phương án kèm hệ quả, người chọn, sổ ghi lại người đã chọn. Chính quy trình làm phần mềm cũng theo nguyên tắc máy đề xuất – người quyết định.

Ai đọc cuốn sổ này? Trước hết là AI ở phiên sau, vì tệp nằm trong thư mục quy tắc. Thứ đến là tôi khi chuyển sang máy khác. Sau nữa là người tiếp nhận dự án, nếu có ngày tôi chuyển công tác. Và cuối cùng là chính cuốn sách này: phần lớn ngày tháng, con số, sự cố kể trong sách được đối chiếu với nhật ký.

Có một điều cần lưu ý khi nhật ký dài ra. Tệp nằm trong thư mục quy tắc và không khai phạm vi đường dẫn, nên phiên nào cũng được nạp. Hai mươi bốn nghìn chữ là một chồng giấy dày trên bàn làm việc của AI. Đến một mức nào đó, nên tách: giữ vài chục mục gần nhất trong thư mục quy tắc, chuyển phần cũ sang một tệp lưu trữ để tra khi cần. Một chi tiết nhỏ khác: dòng hướng dẫn ở đầu tệp vẫn dặn "thêm 1 dòng vào đây", trong khi mỗi mục thực tế dài cả trăm chữ. Sổ đã lớn hơn lời dặn ban đầu, và lời dặn cũng cần cập nhật.

::: {.lenhmau}
**Câu lệnh mẫu 7.3 — Ghi nhật ký sau khi xong một việc**

```text
VIỆC: Thêm một mục MỚI lên đầu tệp .claude/rules/changelog.md
cho việc vừa làm trong phiên này.
DẠNG: một đoạn, mở đầu bằng tiêu đề in đậm, lần lượt nêu:
(1) làm gì; (2) vì sao, nguyên nhân gốc nếu là sửa lỗi;
(3) sửa ở các tệp nào; (4) quyết định nào do tôi chốt, ghi rõ
"người dùng chốt"; (5) việc tôi còn phải tự làm, đánh dấu ⚠️;
(6) kiểm thử: bao nhiêu phép kiểm, lint, bản dựng.
RÀNG BUỘC: không ghi họ tên cán bộ (dùng chức danh), không ghi
số điện thoại, khóa, mật khẩu; không sửa các mục cũ.
NGHIỆM THU: in mục vừa thêm cho tôi đọc trước khi commit.
```
:::

## 7.3. GitHub là nguồn duy nhất: quy trình đa máy cơ quan ↔ nhà

Nhắc lại hình ảnh đã dùng ở các chương trước: mã nguồn là bộ bản vẽ thiết kế, GitHub là sổ lưu trữ bản vẽ có ghi lịch sử từng lần sửa. Mỗi máy tính đang làm việc giữ một bản sao đầy đủ của bộ bản vẽ. Giữa máy và GitHub chỉ có hai động tác: kéo về (pull) là lấy những lần sửa mới nhất từ GitHub về máy; đẩy lên (push) là gửi những lần sửa đã ghi sổ trên máy lên GitHub.

Trong dự án của Văn phòng, GitHub còn quan trọng hơn thế. Mỗi lần đẩy lên nhánh chính, Vercel tự dựng lại và triển khai bản mới sau khoảng một đến hai phút. Cùng lúc, dây chuyền kiểm tra tự động trên GitHub (GitHub Actions) chạy lại bước kiểm tra mã và bước dựng. Nói cách khác, cái gì nằm trên GitHub thì cái đó là phần mềm người dùng đang thấy. Không có "bản ở máy tôi mới là bản đúng".

Từ đó ra quy tắc vàng, ghi ngay đầu CLAUDE.md: đầu phiên `git pull`, cuối phiên commit và `git push`. Lệnh `git log --oneline` liệt kê mọi lần ghi sổ, mỗi lần một dòng, nên nó cũng là nhật ký "các bước đã làm" luôn đồng bộ giữa các máy.

### 7.3.1. Vì sao không đặt dự án trong OneDrive

Nhiều cơ quan đã quen để tài liệu trong OneDrive hay Dropbox cho tiện đồng bộ. Với kho mã nguồn, tệp quy tắc của dự án nói rõ: không. Lý do ghi gọn trong ba ý: hỏng thư mục `.git`, kẹt thư mục `node_modules`, sinh bản sao xung đột.

Diễn giải bằng việc văn phòng: thư mục `.git` là cuốn sổ lịch sử, gồm rất nhiều tệp nhỏ phải khớp nhau từng trang. Dịch vụ đồng bộ chép từng tệp một ở chế độ nền; có lúc chép được nửa cuốn thì mất mạng, cuốn sổ rách trang. Thư mục `node_modules` là kho vật tư gồm rất nhiều tệp tải về tự động, xóa đi tải lại được bất cứ lúc nào; đồng bộ nó chỉ làm nghẽn đường truyền. Còn khi hai máy cùng sửa một tệp, dịch vụ đồng bộ không biết gộp nên đẻ ra bản sao mang tên máy, và đồng chí không biết bản nào là bản thật. Hai hệ thống đồng bộ cùng giữ một bộ hồ sơ, mỗi bên một cách đánh số, sớm muộn sẽ loạn.

Phải thành thật rằng chính dự án của tôi cũng có chỗ chưa theo đúng quy tắc này. Đoạn hướng dẫn đăng ký tác vụ chạy bản tin pháp luật hằng ngày vẫn trỏ tới một thư mục nằm trong OneDrive của máy cơ quan. Quy tắc ghi trên giấy, nhưng không có cơ chế nào chặn, nên thực tế trượt khỏi quy tắc lúc nào không hay. Mục 7.7 sẽ quay lại bài học này.

### 7.3.2. Máy mới và tệp .env

Bộ nhớ dự án có sẵn phần "máy mới, làm một lần" gồm bốn bước mà Chương 5 đã hướng dẫn chi tiết: cài công cụ; tải kho mã về một thư mục ngoài OneDrive; tạo tệp `.env` từ tệp mẫu `.env.example`; chạy `npm install`. Bước thứ ba hay bị quên nhất. Tệp `.env` chứa địa chỉ và khóa kết nối cơ sở dữ liệu, cố ý không đưa lên GitHub, nên máy nào cũng phải tạo lại bằng tay.

Một lưu ý riêng cho dự án có tác vụ tự động. Máy ở cơ quan của tôi tự chạy bộ sinh bản tin mỗi sáng rồi tự đẩy lên GitHub. Nghĩa là gần như ngày nào GitHub cũng có lần ghi sổ mới mà máy ở nhà chưa có. Quên kéo về mà cứ làm, đến lúc đẩy lên sẽ bị từ chối, phải gộp lại hai dòng lịch sử. Kéo về đầu phiên là cách rẻ nhất để tránh rắc rối đó.

::: {.thuchanh}
**Thực hành: một phiên làm việc chuẩn**

1. Mở thư mục dự án (ngoài OneDrive), chạy `git pull`. Báo lỗi thì dừng, nhờ AI giải thích trước khi làm gì khác.
2. Chạy `git status`. Có tệp đang sửa dở từ lần trước thì quyết định giữ hay bỏ trước khi giao việc mới.
3. Mở tác tử, giao một việc theo khung ở Chương 6.
4. Đọc phương án AI trình, duyệt rồi mới cho làm.
5. Nghiệm thu: bản dựng xanh, kiểm thử đạt, tự mở thử trên trình duyệt.
6. Yêu cầu AI cập nhật nhật ký và bộ nhớ dự án nếu có thay đổi đáng ghi.
7. Commit đúng các tệp của việc vừa làm, thông điệp tiếng Việt (mục 7.4).
8. Chạy `git push`, chờ vài phút rồi mở bản đang chạy thật để xem lại.
:::

::: {.canhbao}
**Cảnh báo**

Kho mã công khai thì ai cũng đọc được, kể cả lịch sử. Trước lần commit đầu tiên, hãy bảo AI kiểm tra `.gitignore` đã chặn `.env`, thư mục `node_modules`, thư mục nháp và mọi tệp chứa dữ liệu thật hay chưa. Dự án của Văn phòng chặn tệp danh bạ điện thoại và thư mục hồ sơ đánh giá cá nhân dùng làm mẫu bằng chính cách này.
:::

## 7.4. Commit nhỏ, thông điệp rõ ràng: lịch sử là hồ sơ khôi phục được

Mỗi lần ghi sổ (commit) là một lần chụp lại trạng thái các tệp đã chọn, kèm lời ghi chú (thông điệp commit), tên người làm, ngày giờ. Giống như mỗi lần sửa bản vẽ thì đóng dấu, ghi ngày, ghi lý do vào sổ lưu trữ bản vẽ. Từ cuốn sổ ấy, ta xem lại được bất kỳ phiên bản nào trong quá khứ.

### 7.4.1. Một việc, một lần ghi sổ, đúng các tệp liên quan

Commit nhỏ nghĩa là mỗi lần ghi sổ chỉ chứa một việc trọn vẹn. Lợi ích rất thực tế: đọc lịch sử thì hiểu ngay từng bước; muốn hoàn tác một việc thì không kéo theo việc khác; có lỗi thì khoanh vùng được nó sinh ra từ lần nào.

"Trọn vẹn" cũng có nghĩa là đủ. Lần ghi sổ ngày 22/10/2026 chuyển Sổ tay AI sang NotebookLM chạm vào bảy tệp: bốn tệp mã, tệp kiến thức của bot chat, tệp kiến trúc và tệp nhật ký. Mã, bộ nhớ dự án và kiến thức của bot được sửa cùng một lần, không để "lần sau bổ sung".

Quy ước của dự án còn dặn một điều: chỉ đưa vào sổ đúng các tệp của việc đang làm, "không vơ tệp/thay đổi lạ đang chờ của người dùng". Trong thư mục làm việc thường có những thứ tôi đang viết dở: một bản nháp tài liệu, một tệp thử. Lệnh gom tất cả (`git add .`) sẽ đưa luôn chúng lên kho công khai.

### 7.4.2. Thông điệp tiếng Việt viết cho người đọc sau

Thông điệp commit của dự án viết bằng tiếng Việt có dấu, theo khuôn: dòng đầu nêu phân hệ và việc; một dòng trống; thân gồm các gạch đầu dòng nêu nguyên nhân, cách sửa; dòng cuối ghi AI là đồng tác giả. Đây là thông điệp thật của lần vá lỗi ngày 28/9/2026, đã lược bớt và giản lược vài chữ kỹ thuật:

```text
Vá lỗi sập phân hệ đầu mỗi kỳ mới (OKR/KPI, Kiểm điểm,
Quản lý cán bộ)

- useState(people[0].id): biểu thức truyền vào useState vẫn được
  TÍNH ở mọi lần render, nên khi kỳ chưa có dữ liệu thì ném lỗi
  và cả phân hệ sập. Đổi sang hàm khởi tạo lười.
- Kỳ mới chưa có dữ liệu: tự chuyển tiếp danh sách cán bộ từ kỳ
  gần nhất thay vì để màn hình trắng.

Co-Authored-By: [tên mô hình AI] <...>
```

Đọc thông điệp này, người không biết lập trình vẫn hiểu: hỏng gì, vì sao, đã làm gì.

| Thông điệp kém | Thông điệp tốt |
|---|---|
| sửa lỗi | Vá lỗi sập phân hệ đầu mỗi kỳ mới (OKR/KPI, Kiểm điểm, Quản lý cán bộ) |
| update | Sổ tay AI: chuyển hẳn sang dùng NotebookLM |
| fix | Kiểm điểm: dựng lại phần đánh giá theo đúng hai biểu mẫu của HD 03-HD/TU |
| auto | bantin: bản tin pháp luật ngày 26/10/2026 |

Dòng cuối bảng là thông điệp do máy tự viết mỗi sáng khi đẩy bản tin lên. Tiền tố cố định "bantin:" giúp lọc riêng các lần ghi sổ tự động khỏi các lần sửa phần mềm.

### 7.4.3. Khôi phục: ba mức

Lịch sử chỉ có giá trị khi biết dùng nó. Có ba mức, từ nhẹ đến nặng:

```bash
git log --oneline -20        # xem 20 lần ghi sổ gần nhất
git show <mã>:<đường dẫn>    # xem lại một tệp ở thời điểm cũ
git revert <mã>              # hoàn tác một lần ghi sổ
```

Lệnh thứ nhất để tra cứu. Lệnh thứ hai lấy lại một tệp cũ: khi làm chức năng chọn ngày xem lại bản tin, kho lưu trữ chỉ có một ngày, AI đã khôi phục bản tin ngày 09/9/2026 từ lịch sử để kho có ngay hai ngày. Lệnh thứ ba hoàn tác bằng cách ghi thêm một lần sửa ngược lại, không xóa gì khỏi sổ. Hai bản giao diện "Mới" và "PRO" đã gỡ khỏi dự án cũng vậy: mã của chúng vẫn nằm trong lịch sử, cần thì lấy lại được.

Có những lệnh "viết lại lịch sử", xóa hẳn các lần ghi sổ. Tôi xếp chúng vào nhóm việc luôn phải hỏi người (mục 7.7).

Lịch sử Git là hồ sơ kỹ thuật của bộ bản vẽ, không thay thế hồ sơ lưu trữ theo quy định về văn thư, lưu trữ. Kết quả đánh giá, biên bản chính thức vẫn phải được ký, ban hành và lưu trữ theo quy trình của cơ quan.

### 7.4.4. Lịch sử nhớ dai — con dao hai lưỡi

Cũng vì sổ không xóa, một tệp lỡ commit rồi thì xóa ở lần sau vẫn còn trong lịch sử. Với kho công khai, điều đó nghĩa là đã công bố. Dự án của tôi từng để lọt một tệp thử trong thư mục nháp vì `.gitignore` chưa chặn thư mục đó. May là tệp chỉ chứa địa chỉ dự án và khóa công khai, vốn đã nằm trong mã trình duyệt. Nếu đó là số điện thoại hay hồ sơ cán bộ thì chuyện đã khác.

::: {.phaply}
**Căn cứ pháp lý**

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 được Quốc hội thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026. Luật phân dữ liệu cá nhân thành dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm; danh mục cụ thể do Chính phủ quy định (Nghị định 356/2025/NĐ-CP hướng dẫn thi hành Luật, có hiệu lực cùng ngày). Họ tên kèm số điện thoại, ngày sinh, số định danh, quan hệ gia đình của cán bộ đều là dữ liệu cá nhân. Đưa chúng vào một kho mã công khai là công bố dữ liệu cá nhân, và lịch sử Git sẽ giữ chúng lại ngay cả khi tệp đã bị xóa. Trước khi áp dụng, đồng chí nên tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
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

Ngày 13/8/2026, dự án làm hai việc lớn. Việc thứ nhất: tách kho dữ liệu theo phân hệ. Trước đó, phân hệ OKR/KPI (chấm theo tháng) và phân hệ Kiểm điểm (chấm theo quý) cùng ghi vào một dòng dữ liệu đặt tên theo năm và tháng. Mở phân hệ này thì cơ chế tự lưu ghi đè danh sách của phân hệ kia. AI sửa bằng cách thêm tiền tố riêng cho Kiểm điểm, giữ nguyên tên cũ cho OKR/KPI. Việc thứ hai: gộp danh sách cán bộ về một mối là hồ sơ 2C trong phân hệ Quản lý cán bộ.

Cả hai việc chạy đúng, bản dựng xanh. Nhưng bot chat trên Telegram dò tên các dòng dữ liệu bằng một mẫu so khớp riêng, chỉ nhận tên kiểu cũ. Nhật ký lúc ấy còn ghi rằng mẫu này "tự loại" các tên mới, nên bot "vẫn đọc đúng" phần OKR/KPI. Không ai hỏi ngược lại: vậy bot có cần đọc Kiểm điểm không? Kết quả là bot mất hẳn phân hệ Kiểm điểm. Còn việc gộp danh sách làm lộ một lỗi cũ: hai đồng chí trùng họ tên ở hai đơn vị bị ghép làm một, danh sách OKR/KPI còn 27 thay vì 28 người.

Sau hai sự cố, tôi yêu cầu ghi vào tệp quy ước một quy tắc bắt buộc, kèm luôn hai sự cố làm ví dụ. Tệp ghi: "cả hai đều là hệ quả dây chuyền lẽ ra phải tự thấy".
:::

Quy tắc ấy nguyên văn như sau: sửa xong một chỗ thì "chủ động kiểm tra và hoàn thiện MỌI chức năng liên quan trong cùng lần sửa, không chờ người dùng phát hiện hỏng". Câu hỏi then chốt là: "chỗ nào khác đang đọc/ghi thứ vừa đổi?". Và cách trả lời phải là "kiểm chứng THẬT (chạy thử, không đoán)".

Ví von quen thuộc: đổi số phòng của một phòng ban mà quên báo tổng đài, quên sửa bảng chỉ dẫn ở sảnh. Phòng vẫn làm việc bình thường, chỉ có khách là không tìm thấy. Lỗi dây chuyền nguy hiểm vì nó không hiện ra ở chỗ vừa sửa. Kiểm thử chỗ vừa sửa thì mọi thứ đều xanh.

Giá trị lớn nhất của quy tắc nằm ở danh mục cụ thể đi kèm. Mỗi dự án có những "đường dây" riêng. Dưới đây là bản đồ của dự án Văn phòng; ba dòng đầu ghi sẵn trong tệp quy ước, các dòng sau tôi rút từ các sự cố khác:

| Khi đổi | Phải kiểm lại |
|---|---|
| Tên, định dạng dữ liệu lưu trữ | Bot chat; các hàm xuất Word, Excel |
| Mô hình dữ liệu, luồng nghiệp vụ | Kiến thức tĩnh của bot |
| Quyền đọc, ghi | Chính sách bảo mật theo dòng; thử vai khách và quản trị |
| Thêm trường mới vào hồ sơ | Hàm chuẩn hóa dạng danh sách trắng |
| Thêm phân hệ mới | Kho dữ liệu riêng; Trang chủ; Hướng dẫn; bot |
| Công thức, ngưỡng xếp loại | Trang hướng dẫn; phiếu Word; bot |

Cách lập bản đồ cho dự án của đồng chí rất đơn giản: mỗi lần gặp một lỗi dây chuyền, thêm một dòng. Sau vài tháng, bảng này là tài sản quý nhất trong bộ nhớ dự án. Khi thêm phân hệ Sổ tay AI, bộ kiểm thử của phân hệ có hẳn một nhóm phép kiểm xác nhận phân hệ đã được "nối đủ" vào các chỗ trong hệ thống.

Cũng phải nói thật: quy tắc viết ra rồi vẫn có chỗ lọt. Khi đọc lại mã để viết sách, tôi thấy nguyên tắc "AI lỗi thì hoàn lại lượt đã trừ" mới áp ở khung chat Trang chủ. Hai lối gọi AI khác, của Trợ lý AI và Sổ tay AI, khi AI lỗi chưa hoàn lượt. Một quy tắc tốt vẫn cần được nhắc lại và cần phép kiểm để giữ.

::: {.lenhmau}
**Câu lệnh mẫu 7.5 — Rà soát dây chuyền trước khi đóng việc**

```text
VIỆC: Trước khi commit, rà soát dây chuyền cho thay đổi vừa làm.
1. Liệt kê mọi thứ vừa đổi: tên dữ liệu, định dạng, hàm, quyền,
   công thức, chữ trên giao diện.
2. Với từng thứ, tìm trong TOÀN BỘ kho mã mọi chỗ đang đọc hoặc
   ghi nó (kể cả bot chat, hàm xuất báo cáo, trang hướng dẫn,
   bộ nhớ dự án). Ghi tên tệp và lý do liên quan.
3. Đối chiếu với bảng "Khi đổi – Phải kiểm lại" trong tệp quy
   ước; nếu phát hiện đường dây mới, đề xuất thêm vào bảng.
4. Sửa các chỗ bị ảnh hưởng ngay trong lần này.
RÀNG BUỘC: kiểm chứng bằng chạy thử, không suy đoán.
NGHIỆM THU: bảng kết quả "chỗ liên quan – đã kiểm bằng cách nào
– kết quả"; chỗ nào chưa kiểm được thì ghi rõ lý do.
```
:::

## 7.6. Văn hóa kiểm thử cho người không chuyên

Người không biết lập trình không đọc được mã. Nhưng nghiệm thu một công trình cũng không bắt chủ đầu tư phải biết tính kết cấu. Chủ đầu tư cần ba thứ: tiêu chí nghiệm thu rõ ràng, biên bản thử tải, và tận mắt xem công trình. Kiểm thử phần mềm cũng vậy, gồm bốn tầng.

### 7.6.1. Tầng một: bản dựng phải xanh

Quy ước của dự án ghi: trước mọi lần commit, `npm run build` phải xanh (chạy hết, không báo lỗi) và bước kiểm tra mã tự động (lint) phải 0 lỗi. Lên GitHub, dây chuyền kiểm tra tự động chạy lại hai bước đó một lần nữa. Đây là cổng tối thiểu, rẻ và không bao giờ được bỏ. Nhưng phải nhớ: bản dựng xanh chỉ chứng minh phần mềm "lắp ráp được", chưa chứng minh nó "chạy đúng". Lỗi sập phân hệ đầu tháng (mục 7.4) đã đi qua cổng này hàng chục lần mà không ai thấy.

### 7.6.2. Tầng hai: phép kiểm viết bằng ngôn ngữ nghiệp vụ

Thiết kế xuyên suốt của dự án là tách phần "tính toán" khỏi giao diện và khỏi mạng. Công thức chấm điểm, ngưỡng biểu quyết, cách cắt văn bản theo Điều, khoản đều nằm trong các tệp thuần, chạy được bằng Node trong vài giây. Nhờ vậy mỗi đợt việc có một bộ kiểm thử tự động (test) đi kèm:

| Bộ kiểm thử | Số phép kiểm | Ví dụ điều được kiểm |
|---|---|---|
| Khung tiêu chí HĐND | 293 | Chấm tối đa đúng 100 và 110 |
| Bot chat | 199 | Tin gửi lại lần hai không được trả lời |
| Sổ tay AI | 147 | Không tự gán hiệu lực cho văn bản |
| Mẫu Kiểm điểm | 127 | Mẫu chức danh nào tổng cũng đúng 70 |
| Biểu quyết | 90 | 42/82 thì thông qua, 41/82 thiếu 1 phiếu |
| Bản tin (Python) | 42 | "Họp báo" không bị nhận là tin bão |

Đồng chí không cần đọc mã của các phép kiểm, chỉ cần đọc danh sách tên của chúng như đọc tiêu chí nghiệm thu. Thêm một nguyên tắc: mỗi lỗi thật đã gặp phải trở thành một phép kiểm hồi quy (regression test) giữ lại mãi, để lỗi đó không quay về. Các điều cấm cũng thành phép kiểm: không có số điện thoại nào trong mã nguồn; kiến thức của bot không chứa mật khẩu.

Ở đây dự án của tôi cũng có một lỗ hổng. Các bộ kiểm thử nằm trong thư mục nháp vốn không được đưa lên GitHub, nên máy khác không chạy lại được. Cách đúng là đặt chúng trong một thư mục được commit và gắn vào một lệnh chung như `npm test`.

### 7.6.3. Tầng ba: kiểm chứng trên bản dựng thật

Phép kiểm logic không thấy được giao diện. Vì vậy với các thay đổi lớn, tôi yêu cầu AI dựng bản thật rồi điều khiển một trình duyệt tự động, không giao diện (headless browser), qua giao thức gỡ lỗi của Chrome. AI mở lần lượt từng đường dẫn phân hệ, bấm qua mọi thẻ, đếm số lỗi phát sinh (phải bằng 0), đếm số cán bộ hiển thị (28 ở OKR/KPI, 15 ở Kiểm điểm). Với chức năng xuất Word, AI bấm xuất tệp thật rồi đọc lại tệp bằng chương trình để đối chiếu tiêu đề và từng bảng. Có lần đo kích thước chữ trên ảnh xem trước khi chia sẻ liên kết, AI phát hiện một dòng kết thúc ở 1.214 điểm ảnh trong khung rộng 1.200: mắt nhìn mã không thể thấy.

### 7.6.4. Tầng bốn: kiểm theo vai và kiểm các cái bẫy tiếng Việt

Một phần mềm có phân quyền phải được thử bằng từng vai. Dự án từng có hai lỗi chỉ lộ ra khi đổi vai: khách và quản trị thấy hai danh sách cán bộ khác nhau; tài khoản không phải Quản trị mở phân hệ Quản lý cán bộ thì gặp trang trắng. Quy ước nay bắt buộc: đổi quyền thì thử cả vai khách lẫn vai quản trị. Và nhớ rằng ẩn một nút trên giao diện không phải là bảo mật; quyền thật nằm ở cơ sở dữ liệu (Chương 19).

Với tiếng Việt, luôn có một nhóm phép kiểm riêng cho các cặp dễ nhầm: "quốc gia" không được khớp với từ khóa "gia"; "báo" và "bão" không được coi là một; "phó trưởng ban" phải được xét trước "trưởng ban" vì chuỗi sau nằm trọn trong chuỗi trước; chữ có dấu phải còn nguyên sau khi lưu, nạp, xuất tệp. Nhiều thói quen lập trình sinh ra cho tiếng Anh, nên AI không tự nghĩ tới những cái bẫy này. Người làm văn bản tiếng Việt phải nói ra.

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
