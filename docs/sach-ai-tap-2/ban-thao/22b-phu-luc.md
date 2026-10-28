# Phụ lục 3. Mẫu bộ nhớ dự án cho một dự án của cơ quan

Bộ nhớ dự án là bộ hồ sơ mà tác tử AI lập trình tự đọc mỗi khi mở phiên làm việc: tệp CLAUDE.md ngắn ở thư mục gốc và thư mục quy tắc `.claude/rules/` chia theo chủ đề (mục 7.1). Mẫu dưới đây tôi dựng lại từ bộ nhớ thật của hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app), bỏ các chi tiết riêng, giữ khung và những quy tắc đã phải trả giá mới có.

Chỗ trong [ngoặc vuông] đồng chí tự điền; dòng nào không hợp thì xóa. Tên tệp CLAUDE.md và thư mục `.claude/rules/` là quy ước của Claude Code; tác tử khác dùng tên tệp riêng, nội dung vẫn dùng lại được. Dòng mở đầu bằng `#` trong các khối dưới đây là tiêu đề trong tệp, không phải lệnh.

::: {.thuchanh}
**Thực hành: lập bộ nhớ dự án trong 30 phút**

1. Tạo thư mục dự án ở ổ thường, ngoài OneDrive, Dropbox (mục 7.3).
2. Giao tác tử lập bộ nhớ theo Câu lệnh mẫu 7.1, dán kèm mẫu này làm khuôn.
3. Tự điền phần căn cứ nghiệp vụ; không để AI tự viết phần ấy.
4. Đọc lại từng tệp: thấy khóa bí mật, mật khẩu, số điện thoại là xóa.
5. Ghi thay đổi, đẩy lên GitHub, mở trên máy thứ hai xem thư mục quy tắc đã có chưa.
6. Mỗi tháng, giao AI đối chiếu bộ nhớ với mã nguồn theo Câu lệnh mẫu 7.2.
:::

## PL3.1. Sơ đồ thư mục và tệp CLAUDE.md

```text
  [ten-du-an]/
    CLAUDE.md                     trang tóm tắt, đọc ở mọi phiên
    .gitignore                    những gì Git bỏ qua
    .env.example                  tên biến môi trường, KHÔNG có giá trị
    .claude/rules/
      project-overview.md         dự án là gì, ai dùng, nhãn demo
      commands-and-deploy.md      lệnh dựng, chạy thử, triển khai
      multi-machine-workflow.md   cơ quan và ở nhà (chép mục 7.3)
      conventions.md              quy ước, ủy quyền cho AI
      data-model.md               dữ liệu, phân loại 4 cấp, quyền
      architecture.md             tệp nào làm gì (nạp khi sửa mã)
      changelog.md                nhật ký các bước đã làm
```

Tệp CLAUDE.md được đọc ở mọi phiên, kể cả phiên chỉ sửa một dấu phẩy, nên phải ngắn; tệp thật của Văn phòng khoảng hai trăm chữ.

```text
  # CLAUDE.md — Bộ nhớ dự án (đọc tự động mỗi phiên)

  [Tên ứng dụng] — [phòng, Ban], [tên cơ quan].
  BẢN DEMO THỬ NGHIỆM, sử dụng nội bộ; không thay thế văn bản,
  quy trình chính thức. Người giao việc: [chức danh].

  > Quy tắc vàng đa máy: đầu phiên git pull; cuối phiên bản dựng
  > xanh rồi commit + git push. GitHub là nguồn duy nhất.
  > Ba điều cấm: không ghi khóa bí mật, mật khẩu, số điện thoại,
  > dữ liệu cá nhân vào kho; không đưa tài liệu mật vào dự án;
  > phần mềm không tự xếp loại, phê duyệt thay người có thẩm quyền.

  ## Quy tắc chi tiết — thư mục .claude/rules/
  - project-overview.md — dự án là gì, ai dùng, địa chỉ
  - commands-and-deploy.md — lệnh dựng, chạy thử, triển khai
  - multi-machine-workflow.md — cơ quan và ở nhà, tạo tệp .env
  - conventions.md — tiếng Việt, ghi thay đổi, ủy quyền cho AI
  - data-model.md — dữ liệu, phân loại 4 cấp, quyền đọc/ghi
  - architecture.md — tệp nào làm gì (nạp khi sửa mã)
  - changelog.md — nhật ký; xong việc lớn thêm một mục rồi push
```

## PL3.2. Tổng quan và lệnh thường dùng

```text
  # Tổng quan dự án (project-overview.md)

  [Tên ứng dụng]: [bài toán, ví dụ: theo dõi việc trả lời kiến
  nghị cử tri sau mỗi kỳ họp].
  - Người dùng: [vai 1, làm gì]; [vai 2, làm gì]; [Quản trị].
  - Căn cứ nghiệp vụ: [văn bản, biểu mẫu giấy] (bản công khai ở
    docs/). Phần mềm KHÔNG thay thế các văn bản này.
  - Địa chỉ chạy thử: [...]; kho mã: [...], [công khai/riêng tư].
  - Nhãn "Bản demo thử nghiệm", "Dữ liệu mô phỏng" giữ cho tới khi
    có quyết định đưa vào sử dụng.
  - Ngoài phạm vi, không tự làm: [liệt kê].
```

```text
  # Lệnh và triển khai (commands-and-deploy.md)

  npm run dev     chạy thử trên máy
  npm run build   tạo bản dựng — PHẢI xanh trước khi commit
  [lệnh kiểm thử] chạy bộ kiểm thử (bộ này phải nằm trong kho)
  - Triển khai = đẩy lên nhánh main; [Vercel] tự dựng lại.
  - Sau triển khai: mở địa chỉ thật, thử vai khách và vai Quản trị.
  - Đổi cơ sở dữ liệu: AI viết lệnh vào [supabase/schema.sql], ghi
    "CẦN CHẠY"; NGƯỜI tự chạy trên trang quản trị.
```

## PL3.3. Dữ liệu, phân quyền và kiến trúc

Hai tệp sau mở đầu bằng khai báo phạm vi đường dẫn (`paths`): tác tử chỉ nạp tệp khi công việc chạm vào các thư mục liệt kê, nên phiên không liên quan khỏi phải đọc.

```text
  ---
  paths:
    - "src/**"
    - "api/**"
  ---
  # Dữ liệu, phân loại và quyền (data-model.md)

  Đối tượng chính: [ví dụ: kiến nghị {mã, nội dung đã ẩn danh,
  lĩnh vực, cơ quan giải quyết, hạn trả lời, trạng thái}].
  Phân loại 4 cấp (Tập 1, mục 7.1–7.2) → quyền trong ứng dụng:
  - Cấp 1 Công khai: khách xem được; được gửi kèm câu hỏi cho AI.
  - Cấp 2 Nội bộ: phải đăng nhập; chỉ gửi AI qua công cụ có trong
    danh mục cơ quan cho phép.
  - Cấp 3 Hạn chế tiếp cận (dữ liệu cá nhân, đơn thư): chỉ Quản
    trị; KHÔNG đưa vào lời dẫn gửi AI, KHÔNG nằm trong kho mã.
  - Cấp 4 Bí mật nhà nước: KHÔNG BAO GIỜ có mặt trong hệ thống.
  Không chắc thuộc cấp nào thì chọn cấp cao hơn.
  - Quyền đặt ở cơ sở dữ liệu, không chỉ ẩn nút trên giao diện.
  - Hàm chuẩn hóa dữ liệu là DANH SÁCH TRẮNG: thêm trường mới thì
    PHẢI khai ở đó, nếu không trường bị gọt mất khi lưu.
  - Nhận dạng người theo "họ tên + đơn vị", không theo họ tên trần.
```

```text
  ---
  paths:
    - "src/**"
    - "api/**"
    - "supabase/**"
  ---
  # Kiến trúc và nơi sửa (architecture.md)

  - src/lib/[ten].js: LOGIC THUẦN (điểm, hạn, ngưỡng), chạy được
    bằng Node để kiểm thử. Một con số chỉ tính ở một nơi; giao
    diện, tệp xuất Word, Excel, bot đều gọi lại hàm này.
  - api/[ten].js: điểm nối phía máy chủ; khóa bí mật chỉ đọc ở đây.
  - supabase/schema.sql: bảng và chính sách quyền; chính sách nào
    "mở cho demo" thì có sẵn câu lệnh gỡ.
  - Chỗ nguy hiểm trong mã có chú thích "CẢNH BÁO:" kèm lý do.
```

Hai dòng cuối của tệp dữ liệu là hai bài học thật: trường danh bạ từng bị gọt mất ngay lúc lưu, và hai đồng chí trùng họ tên ở hai đơn vị từng bị ghép làm một. Dự án nhỏ đến đâu cũng nên giữ.

## PL3.4. Quy ước, nhật ký và danh sách bỏ qua

```text
  # Quy ước làm việc (conventions.md)

  RÀ SOÁT CHỨC NĂNG LIÊN QUAN (bắt buộc): sửa xong một chỗ, tự hỏi
  "chỗ nào khác đang đọc/ghi thứ vừa đổi?" rồi chạy thử để kiểm
  chứng: tệp xuất, bot chat, trang hướng dẫn, quyền đọc/ghi.
  Bài học: [ghi sự cố thật của dự án để AI hiểu lý do].
  - Tiếng Việt có dấu, UTF-8; bản dựng xanh trước khi commit.
  - Một việc, một lần ghi thay đổi, đúng các tệp của việc đó.
  Ủy quyền cho tác tử AI (mục 7.7):
  - Tự làm: sửa mã theo việc giao; chạy bản dựng, kiểm thử; commit
    đúng tệp; đẩy lên [nhánh] khi xanh; cập nhật changelog.md.
  - Làm nhưng báo rõ: thêm thư viện; đổi cấu trúc dữ liệu; sửa
    nhiều phân hệ một lúc.
  - Luôn hỏi người: đổi quyền đọc/ghi; chạy lệnh trên dữ liệu thật;
    xóa dữ liệu; khóa bí mật; cách hiểu văn bản, công thức, ngưỡng;
    phát sinh chi phí; đổi chế độ công khai của kho.
```

```text
  # Nhật ký các bước đã làm (changelog.md) — mới nhất ở trên
  > Mỗi mục: VIỆC GÌ — VÌ SAO — SỬA Ở ĐÂU — KIỂM THỬ THẾ NÀO —
  > CÒN TỒN TẠI GÌ. Việc người phải tự làm thì ghi "CẦN CHẠY".

  Ví dụ minh họa (giả định):
  - [ngày] Thêm cột "Hạn trả lời" vào bảng kiến nghị. Vì sao: Ban
    cần biết kiến nghị nào sắp quá hạn. Sửa: src/lib/kienNghi.js,
    tệp xuất Excel. Kiểm thử: các ca tính hạn qua tháng, qua năm;
    vai khách không thấy ghi chú nội bộ; bản dựng xanh.
    Tồn tại: chưa gửi nhắc việc tự động.
```

```text
  # .gitignore
  node_modules/
  dist/
  .env
  scratch/
  du-lieu-that/
  # Bỏ qua cấu hình cục bộ trong .claude, NHƯNG đồng bộ thư mục rules
  .claude/*
  !.claude/rules/
  !.claude/rules/**
```

Ba dòng cuối là chi tiết quyết định: thiếu chúng, bộ nhớ dự án chỉ tồn tại trên chiếc máy đã viết ra nó. Dòng `scratch/` thì dự án thật chưa có, nên dù quy ước ghi "không commit thư mục nháp", một tệp thử vẫn lọt lên kho (mục 7.4). Mẫu này biến quy ước thành cơ chế.

::: {.canhbao}
**Cảnh báo: bộ nhớ dự án cũng có thể bị người ngoài đọc**

Bộ nhớ dự án nằm trong kho mã; kho công khai thì ai cũng đọc được. Không ghi vào đó số điện thoại, mật khẩu tài khoản dùng thử, cách vào trang quản trị hay mô tả lỗ hổng chưa vá. Biến môi trường mang tiền tố `VITE_` được đóng vào mã chạy trên trình duyệt, tức là công khai; khóa gọi AI và khóa bí mật của cơ sở dữ liệu chỉ đọc ở phía máy chủ.
:::

::: {.ghinho}
**Ghi nhớ**

CLAUDE.md ngắn, chi tiết để ở thư mục quy tắc; mỗi quy tắc kèm một câu "vì sao"; một sự thật chỉ ghi một nơi; bộ nhớ cập nhật cùng lúc với mã. Bộ nhớ lỗi thời nguy hiểm hơn không có, vì AI tin và làm theo.
:::

# Phụ lục 4. Mẫu Quy tắc sử dụng trí tuệ nhân tạo tại cơ quan

## PL4.1. Nguồn gốc và cách dùng mẫu

Mẫu ở mục PL4.2 giữ đúng mười điều như khung quy chế tôi đề xuất ở Tập 1, mục 7.6, và lấy nhiều câu chữ từ dự thảo Quy tắc 9 điều của phân hệ Sổ tay AI (toàn văn ở mục PL4.3). Căn cứ được cập nhật theo các văn bản có hiệu lực đến ngày 26/10/2026 và ghi ngay tại điều liên quan.

So với Tập 1 có ba thay đổi. Dữ liệu cá nhân nay căn cứ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, không còn Nghị định 13/2023/NĐ-CP. Danh mục công cụ chỉ ghi nguyên tắc, không ghi tên sản phẩm, vì tên đổi nhanh: NotebookLM đã đổi tên thành Gemini Notebook từ 16/7/2026. Mẫu có thêm hai nội dung Tập 1 chưa có: minh bạch, gắn nhãn và ứng dụng do cán bộ tự xây dựng.

Một điểm cần nói thẳng. Bảng 7.1 của Tập 1 cho phép đưa dữ liệu nội bộ lên AI có cam kết doanh nghiệp sau khi ẩn danh; Công văn 557/BKHCN-CĐSQG lại khuyến cáo không đưa tài liệu nội bộ lên chatbot AI. Mẫu này chọn cách chặt hơn: mặc định không đưa, ngoại lệ phải có tên trong danh mục do cơ quan phê duyệt.

::: {.canhbao}
**Cảnh báo: đây là dự thảo tham khảo**

Mẫu không phải văn bản của Văn phòng hay của cơ quan nào. Cơ quan muốn dùng phải tự điều chỉnh theo chức năng, nhiệm vụ, lấy ý kiến các phòng, Ban, đối chiếu quy chế bảo vệ bí mật nhà nước và quy chế văn thư, trình bày theo Nghị định 30/2020/NĐ-CP, rồi trình người có thẩm quyền ban hành. Mọi căn cứ phải tra lại nguyên văn tại thời điểm ban hành.

Hướng dẫn kèm Công văn 19130-CV/VPTW áp dụng cho các cơ quan đảng. Cơ quan nhà nước không chịu ràng buộc trực tiếp, nhưng phần lớn cán bộ là đảng viên nên quy tắc của cơ quan nên đi cùng tinh thần ấy.
:::

## PL4.2. Dự thảo Quy tắc

**QUY TẮC sử dụng trí tuệ nhân tạo trong hoạt động của [tên cơ quan]**

*(Ban hành kèm theo Quyết định số …/QĐ-… ngày … của [người đứng đầu cơ quan])*

**Điều 1. Phạm vi, đối tượng áp dụng**

1. Quy tắc này áp dụng khi cán bộ, công chức, viên chức, người lao động của [tên cơ quan] và [thành viên các Ban, đại biểu] dùng công cụ trí tuệ nhân tạo (AI) hoặc ứng dụng có dùng AI trong công tác chuyên môn: soạn thảo, tổng hợp, rà soát, tra cứu, phân tích dữ liệu, bot chat, ứng dụng do cán bộ tự xây dựng.
2. Không điều chỉnh việc dùng AI cho mục đích cá nhân ngoài công vụ. Tài liệu bí mật nhà nước thực hiện theo quy chế bảo vệ bí mật nhà nước của cơ quan.

**Điều 2. Nguyên tắc chung**

1. AI phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người (khoản 2 Điều 4 Luật Trí tuệ nhân tạo số 134/2025/QH15).
2. Người sử dụng chịu trách nhiệm hoàn toàn về nội dung có AI tham gia; không lấy lý do "AI làm sai" để miễn trách nhiệm.
3. Máy đề xuất – người quyết định. Khi không chắc chắn về cấp của dữ liệu, chọn cấp cao hơn.

**Điều 3. Phân loại dữ liệu trước khi sử dụng AI**

1. Dữ liệu được phân thành bốn cấp:

| Cấp | Ví dụ ở cơ quan dân cử | Được dùng với AI |
|---|---|---|
| 1. Công khai | Văn bản đã đăng Công báo, tài liệu kỳ họp đã công bố | Công cụ trong danh mục |
| 2. Nội bộ | Dự thảo chưa trình, báo cáo nội bộ | Mặc định không; chỉ công cụ được danh mục cho phép |
| 3. Hạn chế tiếp cận | Hồ sơ cán bộ, danh bạ, đơn thư, kiến nghị có danh tính | Không dùng AI công cộng; chỉ hệ thống được phê duyệt |
| 4. Bí mật nhà nước | Tài liệu có độ mật | Tuyệt đối không |

2. Dữ liệu cấp 2, cấp 3 được phép dùng phải thay các chi tiết nhận ra cá nhân, tổ chức bằng mã như [NGƯỜI A], [CƠ QUAN A].
3. Dữ liệu cá nhân thực hiện theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (danh mục dữ liệu cơ bản tại Điều 3, nhạy cảm tại Điều 4 Nghị định).
4. Điều 5 Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 nghiêm cấm dùng hệ thống AI để xâm phạm bí mật nhà nước và cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên thiết bị đang kết nối Internet, mạng viễn thông, mạng máy tính (trừ mạng LAN độc lập và trường hợp theo pháp luật về cơ yếu).

**Điều 4. Công cụ và tài khoản**

1. [Đơn vị được giao] lập danh mục công cụ AI được dùng, ghi mục đích và cấp dữ liệu cao nhất cho từng công cụ; ưu tiên nền tảng do Việt Nam phát triển và làm chủ khi xử lý dữ liệu nội bộ, nhạy cảm. Danh mục rà soát [6 tháng] một lần.
2. Dịch vụ AI trung gian chỉ dùng với dữ liệu cấp 1 hoặc dữ liệu mô phỏng.
3. Không tạo tài khoản AI có tên đăng nhập, mật khẩu trùng tài khoản công vụ; không chia sẻ tài khoản cho người ngoài cơ quan; tắt tùy chọn cho phép dùng nội dung để huấn luyện mô hình.
4. Cán bộ nghỉ việc, chuyển công tác: thu hồi khóa bảo mật, hủy tài khoản; chuyển sổ tay, kho mã, tài khoản dịch vụ cho người được giao.

**Điều 5. Kiểm chứng trước khi sử dụng**

1. Mọi thông tin, sản phẩm do AI tạo ra phải được kiểm chứng, thẩm định, chỉnh sửa trước khi sử dụng hoặc trình ban hành.
2. Số hiệu, điều, khoản văn bản do AI nêu phải tra trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo. Không trích dẫn AI làm căn cứ pháp lý.
3. Sổ tay AI, bot tra cứu của cơ quan chỉ trả lời dựa trên nguồn đã kiểm tra hiệu lực, có trích dẫn đến điều, khoản; không có căn cứ thì trả lời là không có thông tin.

**Điều 6. Ranh giới quyết định**

1. Không dùng AI để quyết định thay con người trong đánh giá, xếp loại cán bộ, đảng viên; kết luận giám sát; giải quyết khiếu nại, tố cáo; quyết định nhân sự.
2. Ứng dụng có tính điểm, xếp loại phải để người có thẩm quyền duyệt hoặc ghi đè; sửa dữ liệu sau phê duyệt thì tự gỡ phê duyệt.

**Điều 7. Minh bạch và gắn nhãn**

1. Nội dung do AI tạo ra hoặc chỉnh sửa có thể gây nhầm lẫn phải được thông báo; âm thanh, hình ảnh, video mô phỏng người thật phải gắn nhãn (Điều 11 Luật Trí tuệ nhân tạo). Sản phẩm truyền thông mô phỏng giọng nói, hình ảnh đại biểu phải được [lãnh đạo] duyệt.
2. Không dùng AI để tạo lập, phát tán nội dung sai sự thật; với đảng viên, đây cũng là điều không được làm theo Điều 5 Quy định 207-QĐ/TW.
3. Ứng dụng chưa có quyết định đưa vào sử dụng mang nhãn "Bản demo thử nghiệm"; dữ liệu mô phỏng ghi rõ.

**Điều 8. Ứng dụng do cán bộ tự xây dựng**

1. Trước khi mời người khác dùng, người làm ứng dụng đăng ký với [đơn vị được giao] và nộp phiếu mô tả: mục đích, người dùng, dữ liệu, nơi lưu, ai đọc, ai ghi, dịch vụ bên ngoài, người chịu trách nhiệm, vai trò theo Điều 3 Luật Trí tuệ nhân tạo.
2. Kho mã không chứa khóa bí mật, dữ liệu cá nhân; quyền đặt ở cơ sở dữ liệu; mọi lối gọi AI có hạn mức đếm ở máy chủ; có bộ nhớ dự án và nhật ký thay đổi.
3. Ứng dụng có dùng AI được phân loại rủi ro theo Nghị định 142/2026/NĐ-CP trước khi đưa vào sử dụng, đối chiếu Quyết định 33/2026/QĐ-TTg.
4. Chỉ dùng dữ liệu thật khi đã có quyết định đưa vào sử dụng, hồ sơ đề xuất cấp độ theo Nghị định 331/2026/NĐ-CP và, nếu xử lý dữ liệu cá nhân, hồ sơ đánh giá tác động theo Nghị định 356/2025/NĐ-CP.

**Điều 9. Nhật ký và sự cố**

1. Công cụ, ứng dụng của cơ quan ghi nhật ký sử dụng; người dùng không nhập thông tin cá nhân của người khác vào ô câu hỏi.
2. Phát hiện câu trả lời sai, trích dẫn sai, nguồn hết hiệu lực: đánh dấu "Cần sửa lại" và báo [đơn vị được giao].
3. Nghi lộ dữ liệu cá nhân, lộ khóa, chi phí tăng bất thường: tạm dừng tính năng, báo ngay lãnh đạo và đơn vị chuyên trách.

**Điều 10. Đào tạo, xử lý vi phạm, tổ chức thực hiện**

1. Cán bộ được hướng dẫn Quy tắc trước khi được cấp quyền dùng công cụ của cơ quan, rồi ký cam kết theo mẫu ở mục PL4.4.
2. Vi phạm thì tùy mức độ: nhắc nhở; xem xét trách nhiệm theo quy định; vi phạm pháp luật thì xử lý theo pháp luật.
3. [Đơn vị được giao] chủ trì hướng dẫn, theo dõi, báo cáo định kỳ; [đơn vị công nghệ thông tin] hỗ trợ kỹ thuật. Quy tắc rà soát ít nhất mỗi năm một lần.

## PL4.3. Toàn văn dự thảo Quy tắc 9 điều của phân hệ Sổ tay AI

Dự thảo nằm trong mã nguồn phân hệ Sổ tay AI, để trống ngày ký, chờ Chánh Văn phòng xem xét ban hành. Phạm vi hẹp, chỉ cho thí điểm tra cứu, hỏi đáp; tôi in nguyên văn để đồng chí thấy một quy tắc thật trông thế nào.

**Quy tắc sử dụng trí tuệ nhân tạo trong tra cứu, hỏi đáp nghiệp vụ** (dự thảo)

1. **Phạm vi áp dụng.** Quy tắc này áp dụng đối với cán bộ, công chức, người lao động Văn phòng Đoàn ĐBQH và HĐND tỉnh, thành viên các Ban của HĐND tỉnh và đại biểu HĐND tỉnh khi sử dụng công cụ trí tuệ nhân tạo để tra cứu, hỏi đáp nghiệp vụ của cơ quan dân cử trong phạm vi thí điểm.
2. **Chỉ nạp văn bản công khai.** Tuyệt đối KHÔNG nạp vào công cụ trí tuệ nhân tạo các tài liệu có độ mật, tài liệu nội bộ chưa được phép công bố, dự thảo chưa trình cấp có thẩm quyền, thông tin cá nhân (số định danh, số bảo hiểm xã hội, số điện thoại, địa chỉ, quan hệ gia đình), thông tin về người khiếu nại, tố cáo. Chỉ nạp văn bản đã được công bố công khai.
3. **Kiểm tra nguồn trước khi nạp.** Trước khi đưa một văn bản vào sổ tay, người phụ trách phải đối chiếu số hiệu, ngày ban hành, cơ quan ban hành và TÌNH TRẠNG HIỆU LỰC trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật; ghi rõ người kiểm tra và thời điểm kiểm tra.
4. **Người dùng chịu trách nhiệm về nội dung sử dụng.** Câu trả lời của trí tuệ nhân tạo chỉ có giá trị THAM KHẢO, hỗ trợ tra cứu. Người sử dụng phải mở văn bản gốc theo trích dẫn để kiểm chứng trước khi đưa nội dung vào văn bản tham mưu, báo cáo hoặc phát biểu. Không được trích dẫn trí tuệ nhân tạo làm căn cứ pháp lý.
5. **Bắt buộc có trích dẫn nguồn.** Công cụ chỉ được trả lời dựa trên các đoạn văn bản trong sổ tay và phải ghi rõ trích dẫn đến từng điều, khoản. Trường hợp không tìm thấy căn cứ trong nguồn, công cụ phải trả lời là không có thông tin, không được suy đoán.
6. **Không dùng để quyết định thay con người.** Không sử dụng trí tuệ nhân tạo để quyết định thay cho con người trong các việc: đánh giá, xếp loại cán bộ; kết luận giám sát; giải quyết khiếu nại, tố cáo; quyết định nhân sự. Giữ đúng nguyên tắc "máy đề xuất - người quyết định".
7. **Bảo mật tài khoản và nhật ký sử dụng.** Không chia sẻ tài khoản truy cập cho người ngoài cơ quan. Nội dung hỏi đáp được ghi nhật ký phục vụ đánh giá thí điểm; người dùng không nhập thông tin cá nhân của người khác vào ô câu hỏi.
8. **Phát hiện sai sót phải báo ngay.** Khi phát hiện câu trả lời sai, trích dẫn không đúng hoặc nguồn đã hết hiệu lực, người dùng đánh dấu câu hỏi là "Cần sửa lại" và báo Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng để xử lý.
9. **Tổ chức thực hiện.** Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng chủ trì hướng dẫn, theo dõi việc thực hiện Quy tắc này; định kỳ báo cáo Chánh Văn phòng và Thường trực HĐND tỉnh kết quả thí điểm.

## PL4.4. Mẫu bản cam kết của cán bộ

Trong phân hệ Sổ tay AI, sổ cam kết là bản điện tử: cán bộ đọc quy tắc, ghi họ tên, đơn vị; hệ thống lưu kèm thời điểm xác nhận. Nơi chưa có phần mềm thì dùng bản giấy dưới đây.

```text
  [TÊN CƠ QUAN]
                     BẢN CAM KẾT
       THỰC HIỆN QUY TẮC SỬ DỤNG TRÍ TUỆ NHÂN TẠO

  Họ và tên: ................................................
  Chức vụ: .................... Phòng, Ban: ..................
  Tôi đã được hướng dẫn và đã đọc Quy tắc sử dụng trí tuệ nhân
  tạo ban hành kèm theo Quyết định số ....../QĐ-...... ngày ......
  Tôi cam kết:
  1. Phân loại dữ liệu trước khi dùng AI; không đưa tài liệu mật,
     dữ liệu cá nhân, đơn thư có danh tính lên công cụ AI công cộng.
  2. Kiểm chứng số hiệu, điều khoản, số liệu do AI đưa ra trên nguồn
     chính thống; không lấy AI làm căn cứ pháp lý.
  3. Không dùng AI để quyết định thay người có thẩm quyền.
  4. Giữ an toàn tài khoản; không dùng lại mật khẩu công vụ.
  5. Báo ngay khi phát hiện sai sót, sự cố, nghi lộ dữ liệu.
  6. Chịu trách nhiệm về mọi sản phẩm có AI hỗ trợ mà tôi sử dụng.

                  ........., ngày .... tháng .... năm ....
                              NGƯỜI CAM KẾT
                           (Ký, ghi rõ họ tên)
```

::: {.lanhdao}
**Dành cho lãnh đạo**

- Quy tắc chỉ có giá trị khi cán bộ thực sự hiểu: tập huấn trước, ký cam kết sau.
- Quy định quan trọng phải có cơ chế đi kèm: tài khoản do cơ quan cấp và thu hồi được, danh mục công cụ, kiểm tra định kỳ.
- Giao một đầu mối giữ danh mục công cụ và sổ cam kết; người đứng đầu ký ban hành.
:::

# Phụ lục 5. Danh mục văn bản pháp luật liên quan

**Danh mục đối chiếu đến ngày 26/10/2026.** Bảng chỉ gồm văn bản đã được kiểm chứng số hiệu, tên, ngày qua nhiều nguồn chính thống. Khi viết sách, môi trường tra cứu không mở trực tiếp được các cổng .vn; vì vậy trước khi áp dụng, đồng chí phải tra nguyên văn và tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn) hoặc Công báo (congbao.chinhphu.vn). Văn bản chưa xác minh được thì sách không nêu số hiệu.

Cột "Hiệu lực" ghi ngày có hiệu lực; văn bản của Đảng, văn bản hướng dẫn không ghi riêng ngày hiệu lực thì ghi ngày ban hành.

## PL5.1. Văn bản của Đảng

| Số hiệu | Tên văn bản | Hiệu lực | Liên quan |
|---|---|---|---|
| 57-NQ/TW | Nghị quyết về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia | Ban hành 22/12/2024 | Định hướng chung |
| 19130-CV/VPTW | Triển khai Hướng dẫn khai thác, sử dụng AI cho cán bộ, đảng viên trong các cơ quan đảng | Ban hành 26/11/2025 | Hỗ trợ, không thay thế |
| 207-QĐ/TW | Quy định về những điều đảng viên không được làm | 26/7/2026 | Không dùng AI phát tán tin sai |
| 495-QĐ/TW | Chương trình cải cách hành chính trong các cơ quan đảng giai đoạn 2026-2030 | Ban hành 20/10/2026 | AI có kiểm soát |
| 366-QĐ/TW | Quy định về kiểm điểm, đánh giá, xếp loại chất lượng tập thể, cá nhân trong hệ thống chính trị | 30/8/2025; thay bằng Quy định 227-QĐ/TW từ 01/01/2027 | Kiểm điểm cuối năm |
| 02-HD/BTCTW | Hướng dẫn đánh giá định kỳ hằng quý cán bộ lãnh đạo, quản lý các cấp | Ban hành 22/5/2026 | Kiểm điểm hằng quý |
| 1053-QĐ/TU | Quy định của Tỉnh ủy Thanh Hóa về đánh giá, xếp loại chất lượng gắn với đo lường kết quả công việc | Ban hành 05/6/2026 | Phân hệ OKR/KPI |
| 03-HD/TU | Hướng dẫn của Tỉnh ủy Thanh Hóa về đánh giá định kỳ hằng quý | Ban hành 02/7/2026 | Kiểm điểm hằng quý |

## PL5.2. Trí tuệ nhân tạo và chuyển đổi số

| Số hiệu | Tên văn bản | Hiệu lực | Liên quan |
|---|---|---|---|
| 134/2025/QH15 | Luật Trí tuệ nhân tạo | 01/3/2026 | Vai trò chủ thể (Điều 3); gắn nhãn (Điều 11) |
| 142/2026/NĐ-CP | Nghị định hướng dẫn Luật Trí tuệ nhân tạo | 01/5/2026 | Phân loại rủi ro |
| 33/2026/QĐ-TTg | Danh mục hệ thống AI có rủi ro cao | 15/8/2026 | Đối chiếu trước khi làm |
| 05/2026/TT-BKHCN | Khung đạo đức trí tuệ nhân tạo quốc gia | 10/3/2026 | Bắt buộc với cơ quan nhà nước |
| 1671/QĐ-TTg | Chiến lược quốc gia về trí tuệ nhân tạo đến năm 2030, tầm nhìn 2045 | 28/8/2026; thay Quyết định 127/QĐ-TTg | Định hướng quốc gia |
| 14/CT-TTg | Chỉ thị về bồi dưỡng, đánh giá kỹ năng số của cán bộ, công chức, viên chức | 22/4/2026 | Đào tạo |
| 557/BKHCN-CĐSQG | Nguyên tắc dùng chatbot AI trong cơ quan nhà nước | Ban hành 31/3/2025 | Dữ liệu, tài khoản |
| 2766/BKHCN-TTCNTT | Hướng dẫn dùng AI hỗ trợ rà soát văn bản quy phạm pháp luật | Ban hành 29/4/2026 | AI không tự kết luận pháp lý |
| 71/2025/QH15 | Luật Công nghiệp công nghệ số | 01/01/2026; Chương IV về AI bãi bỏ từ 01/3/2026 | Sản phẩm công nghệ số |
| 148/2025/QH15 | Luật Chuyển đổi số | 01/7/2026 | Khung chung |
| 45/2026/NĐ-CP | Quản lý đầu tư ứng dụng công nghệ thông tin dùng ngân sách nhà nước | 01/3/2026 | Khi chính thức hóa |
| 20/2014/TT-BTTTT | Phần mềm nguồn mở được ưu tiên mua sắm, sử dụng trong cơ quan nhà nước | 20/01/2015 | Chọn nền tảng |

## PL5.3. Dữ liệu, bí mật nhà nước, an ninh mạng

| Số hiệu | Tên văn bản | Hiệu lực | Liên quan |
|---|---|---|---|
| 60/2024/QH15 | Luật Dữ liệu (hướng dẫn: Nghị định 165/2025/NĐ-CP) | 01/7/2025 | Quản lý dữ liệu |
| 91/2025/QH15 | Luật Bảo vệ dữ liệu cá nhân | 01/01/2026 | Hồ sơ, danh bạ, đơn thư |
| 356/2025/NĐ-CP | Nghị định hướng dẫn Luật Bảo vệ dữ liệu cá nhân | 01/01/2026; thay Nghị định 13/2023/NĐ-CP | Danh mục dữ liệu; đánh giá tác động |
| 330/2026/NĐ-CP | Xử phạt vi phạm hành chính về an ninh mạng, bảo vệ dữ liệu cá nhân | 19/8/2026 | Chế tài |
| 117/2025/QH15 | Luật Bảo vệ bí mật nhà nước (hướng dẫn: Nghị định 63/2026/NĐ-CP) | 01/3/2026 | Điều 5: điều cấm |
| 116/2025/QH15 | Luật An ninh mạng | 01/7/2026 | An ninh hệ thống |
| 331/2026/NĐ-CP | Bảo vệ an ninh mạng đối với hệ thống thông tin | 19/8/2026 | Cấp độ 1–5 |
| 1121/QĐ-TTg | Chương trình chuyển đổi sang nền tảng điện toán đám mây 2025–2030 | Ban hành 11/6/2025 | Chọn hạ tầng |

## PL5.4. Cơ quan dân cử, công vụ, văn thư

| Số hiệu | Tên văn bản | Hiệu lực | Liên quan |
|---|---|---|---|
| 72/2025/QH15 | Luật Tổ chức chính quyền địa phương | 16/6/2025 | Ngưỡng biểu quyết |
| 121/2025/QH15 | Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân | 01/3/2026 | Giám sát |
| 64/2025/QH15 | Luật Ban hành văn bản quy phạm pháp luật (sửa đổi bởi Luật 87/2025/QH15) | 01/4/2025 | Thẩm tra dự thảo |
| 80/2025/QH15 | Luật Cán bộ, công chức | 01/7/2025 | Đánh giá công chức |
| 335/2025/NĐ-CP | Đánh giá, xếp loại chất lượng cơ quan hành chính nhà nước và công chức | 01/01/2026 | Phân hệ OKR/KPI |
| 135/2020/NĐ-CP | Quy định về tuổi nghỉ hưu | 01/01/2021 | Nhắc việc nghỉ hưu |
| 30/2020/NĐ-CP | Nghị định về công tác văn thư | 05/3/2020 | Thể thức văn bản xuất ra |
| 33/2024/QH15 | Luật Lưu trữ | 01/7/2025 | Tài liệu lưu trữ số |
| 20/2023/QH15 | Luật Giao dịch điện tử | 01/7/2024 | Thông điệp dữ liệu |
| 01/2026/QH16 | Luật Tiếp cận thông tin | 01/9/2026 | Công khai thông tin |
| 42/2013/QH13 | Luật Tiếp công dân (sửa đổi bởi Luật 136/2025/QH15) | Phần sửa đổi: 01/7/2026 | Tiếp công dân, xử lý đơn |
| 25/2018/QH14 | Luật Tố cáo (sửa đổi bởi Luật 136/2025/QH15) | Phần sửa đổi: 01/7/2026 | Bảo vệ người tố cáo |
| 131/2025/QH15 | Luật sửa đổi, bổ sung một số điều của Luật Sở hữu trí tuệ | 01/4/2026 | Sản phẩm có AI hỗ trợ |
| 134/2026/NĐ-CP | Sửa đổi Nghị định 17/2023/NĐ-CP về quyền tác giả, quyền liên quan | 09/4/2026 | Quyền với mã nguồn |
| 13/2012/NĐ-CP | Điều lệ Sáng kiến | 25/4/2012 | Đăng ký sáng kiến |

::: {.canhbao}
**Cảnh báo: văn bản Tập 1 đã dẫn nay đã được thay thế**

Từ khi Tập 1 hoàn thiện (tháng 5/2026) đến ngày 26/10/2026, nhiều căn cứ đã đổi. Khi dùng lại câu lệnh mẫu hay quy chế của Tập 1, đồng chí thay như sau:

- Quyết định 127/QĐ-TTg → Quyết định 1671/QĐ-TTg (từ 28/8/2026).
- Luật Bảo vệ bí mật nhà nước số 29/2018/QH14 → Luật số 117/2025/QH15 (từ 01/3/2026).
- Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015 → Luật An ninh mạng số 116/2025/QH15 (từ 01/7/2026).
- Nghị định 13/2023/NĐ-CP → Luật số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (từ 01/01/2026).
- Luật Tiếp cận thông tin số 104/2016/QH13 → Luật số 01/2026/QH16 (từ 01/9/2026).
:::

# Phụ lục 6. Bảng kiểm trước khi đưa một ứng dụng vào sử dụng

Bảng kiểm ở mục 19.6 dùng trước khi gửi đường dẫn cho đồng nghiệp dùng thử. Bảng dưới đây dùng ở bước cao hơn: trước khi trình người có thẩm quyền quyết định đưa ứng dụng vào sử dụng chính thức (Chương 20). Hình thức giống Bảng kiểm 10 điểm trước khi trình ký ở Tập 1, mục 4.7: mục nào chưa đạt thì sửa, hoặc ghi lý do, người chịu trách nhiệm và hạn khắc phục.

::: {.ghinho}
**Ghi nhớ**

Đánh dấu một ô nghĩa là có bằng chứng: tệp, biên bản thử, chữ ký. Có thể giao tác tử AI tự chấm từng mục kèm tệp làm căn cứ (Câu lệnh mẫu 19.6), nhưng người trình phải tự đối chiếu vài mục trước khi ký.
:::

## PL6.1. Nghiệp vụ

- [ ] Công thức, ngưỡng, thời hạn đã đối chiếu từng mục với văn bản gốc và biểu mẫu giấy đang dùng thật.
- [ ] Chỗ văn bản chưa nhất quán được ghi chú, báo cơ quan soạn thảo; phần mềm không tự quyết thay.
- [ ] Có bộ ca kiểm thử do người hiểu nghiệp vụ lập; kết quả phần mềm khớp từng ca.
- [ ] Phê duyệt, xếp loại, kết luận do người có thẩm quyền thực hiện; sửa sau phê duyệt thì tự gỡ phê duyệt.
- [ ] Đã thử kỳ mới chưa có dữ liệu, chuyển quý, chuyển năm, người trùng họ tên: không trắng trang, không mất người.

## PL6.2. Dữ liệu

- [ ] Có bảng mọi loại dữ liệu: nơi lưu, ai đọc, ai ghi, thuộc cấp nào trong phân loại 4 cấp.
- [ ] Dữ liệu cá nhân chỉ thu thập trường thật sự cần; hồ sơ, danh bạ chỉ Quản trị đọc được.
- [ ] Không có dữ liệu cấp 4; dữ liệu cấp 3 không đi vào lời dẫn gửi AI.
- [ ] Dữ liệu mô phỏng tách hẳn khỏi dữ liệu thật.
- [ ] Sao lưu tự động đã bật và đã thử khôi phục ít nhất một lần.

## PL6.3. Bảo mật

- [ ] Kho mã và toàn bộ lịch sử không có khóa bí mật, mật khẩu, số điện thoại, hồ sơ cá nhân.
- [ ] Khóa bí mật chỉ ở biến môi trường phía máy chủ, không mang tiền tố `VITE_`.
- [ ] Quyền đặt ở cơ sở dữ liệu; đã thử bằng vai khách, cán bộ, Quản trị.
- [ ] Chính sách "mở cho demo", tài khoản dùng thử viết sẵn và chế độ quản trị cục bộ đã được gỡ.
- [ ] Mã truy cập chỉ lưu dạng chuỗi băm; câu hỏi của khách không kéo được dữ liệu nhân sự vào AI.

## PL6.4. Pháp lý

- [ ] Có quyết định của người có thẩm quyền đưa ứng dụng vào sử dụng, ghi rõ phạm vi và chủ quản.
- [ ] Hồ sơ đề xuất cấp độ đã được thẩm định theo Luật An ninh mạng số 116/2025/QH15 và Nghị định 331/2026/NĐ-CP.
- [ ] Có xử lý dữ liệu cá nhân thì đã lập hồ sơ đánh giá tác động theo Nghị định 356/2025/NĐ-CP.
- [ ] Có dùng AI thì đã phân loại rủi ro theo Nghị định 142/2026/NĐ-CP, đối chiếu Quyết định 33/2026/QĐ-TTg và Thông tư 05/2026/TT-BKHCN; hồ sơ có người ký.
- [ ] Nội dung do AI tạo có thể gây nhầm lẫn được thông báo; nội dung mô phỏng người thật được gắn nhãn.
- [ ] Văn bản xuất ra đúng thể thức theo Nghị định 30/2020/NĐ-CP; văn bản của Đảng mang đúng tiêu đề của Đảng.
- [ ] Thư viện nguồn mở giữ nguyên thông báo bản quyền; văn bản giao nhiệm vụ làm rõ quyền đối với mã nguồn.

## PL6.5. Chi phí

- [ ] Mọi lối gọi AI có hạn mức đếm ở máy chủ; thứ tự: kiểm tra yêu cầu, trừ lượt, gọi AI, hoàn lượt khi lỗi.
- [ ] Trần thời gian chờ AI nhỏ hơn trần của nền tảng; tin nhắn bị gửi lại chỉ được xử lý một lần.
- [ ] Đã đọc điều kiện từng gói dịch vụ: tạm dừng khi lâu không dùng, máy chủ "ngủ", giới hạn mục đích cá nhân.
- [ ] Không dùng dịch vụ AI trung gian cho dữ liệu thật; khóa AI đứng tên cơ quan, có hạn mức chi tiêu.

## PL6.6. Vận hành

- [ ] Bản dựng xanh; bộ kiểm thử nằm trong kho mã, chạy được trên máy khác.
- [ ] Đã kiểm chứng trên bản triển khai thật: mọi đường dẫn mở được, không lỗi.
- [ ] Có trang chẩn đoán; quy trình sự cố viết ra giấy: ai báo ai, khi nào tạm dừng, khi nào khôi phục.
- [ ] Tác vụ chạy theo lịch có nhật ký và có người kiểm tra nó thật sự chạy.

## PL6.7. Bàn giao

- [ ] Bộ nhớ dự án và nhật ký thay đổi khớp với mã hiện tại.
- [ ] Hướng dẫn cài đặt chạy được trên thư mục sạch; danh sách biến môi trường chỉ ghi tên, công dụng.
- [ ] Người thứ hai đã tự vận hành, sửa một lỗi nhỏ và triển khai lại được.
- [ ] Người dùng đã được tập huấn và ký cam kết theo Quy tắc sử dụng AI (Phụ lục 4).
- [ ] Tài khoản dịch vụ, tên miền, kho mã đã chuyển sang đứng tên cơ quan hoặc đơn vị chuyên trách.

# Tài liệu tham khảo

Danh mục chỉ gồm nguồn có thật mà sách đã dùng. Văn bản pháp luật và văn bản của Đảng: xem đầy đủ ở Phụ lục 5. Địa chỉ trang web truy cập tháng 10/2026, có thể thay đổi.

## A. Văn bản được dẫn nhiều nhất

1. Bộ Chính trị, Nghị quyết số 57-NQ/TW ngày 22/12/2024.
2. Văn phòng Trung ương Đảng, Công văn số 19130-CV/VPTW ngày 26/11/2025 và Hướng dẫn kèm theo.
3. Quốc hội, Luật Trí tuệ nhân tạo số 134/2025/QH15; Luật Bảo vệ bí mật nhà nước số 117/2025/QH15; Luật An ninh mạng số 116/2025/QH15 (cùng thông qua ngày 10/12/2025).
4. Quốc hội, Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 ngày 26/6/2025; Chính phủ, Nghị định số 356/2025/NĐ-CP.
5. Chính phủ, Nghị định số 142/2026/NĐ-CP ngày 30/4/2026; Nghị định số 331/2026/NĐ-CP ngày 19/8/2026; Nghị định số 335/2025/NĐ-CP ngày 21/12/2025.
6. Bộ Khoa học và Công nghệ, Công văn số 557/BKHCN-CĐSQG ngày 31/3/2025; Thông tư số 05/2026/TT-BKHCN ngày 10/3/2026.

## B. Sách và tài liệu của dự án

7. Hà Ngọc Sơn (2026), *Trí tuệ nhân tạo trong công tác tham mưu*, Tập 1, 271 trang, hoàn thiện tháng 5/2026.
8. Hà Ngọc Sơn (2026), Báo cáo mô tả sáng kiến "Xây dựng phần mềm đánh giá, xếp loại cán bộ, công chức, người lao động theo OKR/KPI…".
9. Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (7/2026), Đặc tả yêu cầu phần mềm hệ thống theo dõi, đánh giá, xếp loại chất lượng theo KPI, kèm bảng tính mô phỏng Engine tính điểm; Dự thảo Quyết định ban hành Danh mục sản phẩm/công việc.
10. Thường trực HĐND tỉnh Thanh Hóa (2026), Dự thảo Quyết định ban hành Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã, nhiệm kỳ 2026-2031.
11. Ban Tổ chức Tỉnh ủy Thanh Hóa (2026), Dự thảo Hướng dẫn lập danh mục sản phẩm/công việc và đánh giá kết quả thực hiện nhiệm vụ gắn với OKR/KPI.
12. Kho mã nguồn hệ thống thử nghiệm https://github.com/sonthkh-alt/hdndthkpi (CLAUDE.md; .claude/rules/, gồm nhật ký changelog.md; supabase/schema.sql; src/lib/soTaySeed.js; docs/BOT-CHAT.md). Bản chạy thử: https://hdndthkpi.vercel.app.

## C. Tài liệu chính thức về công cụ, dịch vụ

13. Claude Code: https://code.claude.com/docs/en/setup; https://code.claude.com/docs/en/data-usage; https://github.com/anthropics/claude-code; bảng giá https://claude.com/pricing.
14. OpenAI Codex: https://github.com/openai/codex; kiểm soát dữ liệu ChatGPT: https://help.openai.com/en/articles/7730893-data-controls-faq.
15. Gemini CLI: https://github.com/google-gemini/gemini-cli; Gemini Notebook, trước đây là NotebookLM: https://workspaceupdates.googleblog.com/2026/07/notebooklm-now-gemini-notebook.html; chia sẻ sổ tay: https://support.google.com/gemininotebook/answer/16206563?hl=en.
16. GitHub: https://docs.github.com/en/get-started/learning-about-github/githubs-plans. Vercel: https://vercel.com/docs/plans/hobby. Supabase: https://supabase.com/docs/guides/platform/billing-on-supabase. Render: https://render.com/docs/free.
17. Telegram Bot API: https://core.telegram.org/bots/api. Zalo Official Account, tin tư vấn: https://oa.zalo.me/home/documents/guides/tin-tu-van.
18. Ollama: https://github.com/ollama/ollama.

## D. Tra cứu văn bản pháp luật

19. Cơ sở dữ liệu quốc gia về văn bản pháp luật: https://vbpl.vn.
20. Công báo nước Cộng hòa xã hội chủ nghĩa Việt Nam: https://congbao.chinhphu.vn.
