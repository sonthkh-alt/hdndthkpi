# Chương 5. Dựng "xưởng làm việc số" trong một buổi chiều

::: {.muctieu}
**Mục tiêu của chương**

- Biết cần chuẩn bị những gì (máy tính, tài khoản, chi phí) để bắt đầu làm ứng dụng cùng tác tử AI lập trình, và chọn được phương án vừa túi tiền.
- Tự cài đặt được bộ công cụ trên máy Windows: VS Code, Node.js, Git, tài khoản GitHub và tác tử AI lập trình Claude Code (hoặc một công cụ tương đương).
- Mở được tài khoản Vercel, Supabase; hiểu tệp `.env` là gì và vì sao không bao giờ được đưa lên GitHub.
- Làm xong dự án đầu tiên, "Trang tra cứu danh mục văn bản của Ban", từ câu lệnh đầu tiên đến một địa chỉ web chạy thật.
- Tự kiểm tra "xưởng" bằng bảng kiểm và tự xử lý các lỗi cài đặt hay gặp.

Dành cho: cán bộ muốn tự làm ứng dụng (đọc kỹ cả chương, làm theo từng bước); lãnh đạo nên đọc mục 5.1 và các hộp "Dành cho lãnh đạo" để nắm chi phí và rủi ro.
:::

Phần thứ nhất của cuốn sách bàn chuyện "vì sao" và "được phép đến đâu". Từ chương này, chúng ta chuyển sang chuyện "làm thế nào". Việc đầu tiên giống như khi một phòng chuyển về trụ sở mới: kê bàn, kéo điện, lắp điện thoại, nhận chìa khóa tủ hồ sơ.

Tôi gọi bộ công cụ cần có là "xưởng làm việc số": nơi đồng chí giao việc cho tác tử AI lập trình (AI coding agent), nơi cất bộ bản vẽ thiết kế (mã nguồn), nơi gửi bản vẽ đi lưu trữ có ghi lịch sử từng lần sửa (GitHub), nơi "khánh thành" ứng dụng để mọi người vào dùng (Vercel), và khi cần thì thêm một kho lưu trữ hồ sơ có cửa đăng nhập (Supabase).

"Một buổi chiều" là thời lượng hợp lý cho người làm lần đầu, với điều kiện máy được phép cài phần mềm và mạng không bị chặn. Máy cơ quan khóa quyền cài đặt thì xem phương án bản web ở mục 5.2.5. Các bước dưới đây tôi viết lại từ chính quy trình đã dùng để xây dựng hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội và Hội đồng nhân dân tỉnh (hdndthkpi.vercel.app), đối chiếu với tài liệu của nhà cung cấp tại thời điểm viết (tháng 10/2026). Giao diện phần mềm đổi khá nhanh. Thấy tên nút khác đôi chút, đồng chí cứ tìm chữ gần nghĩa nhất, hoặc chụp màn hình rồi hỏi trợ lý AI trò chuyện (chatbot) "nút này giờ nằm ở đâu".

::: {.cauchuyen}
**Câu chuyện thực tế: một xưởng, hai bàn làm việc**

Tôi làm dự án trên hai máy, ở cơ quan và ở nhà. Bộ nhớ hội thoại của Claude Code chỉ nằm trên từng máy, không tự đồng bộ, nên xưởng phải được dựng sao cho ngồi máy nào cũng làm tiếp được việc đang dở. Quy tắc vàng ghi ngay đầu tệp bộ nhớ dự án: "đầu phiên `git pull`, cuối phiên commit + `git push`. GitHub là nguồn duy nhất; KHÔNG đặt repo trong OneDrive."

Hướng dẫn "máy mới, làm một lần" trong bộ nhớ dự án chỉ có bốn bước: cài VS Code, Claude Code, Node.js, Git; tải kho mã về thư mục ngoài OneDrive; tạo lại tệp `.env` từ tệp mẫu; chạy `npm install`. Chương này mở rộng bốn bước ấy cho người bắt đầu từ con số không.
:::

## 5.1. Cần những gì: máy tính, tài khoản và chi phí

### 5.1.1. Máy tính và đường truyền

Đồng chí không cần máy đắt tiền. Tài liệu cài đặt chính thức của Claude Code (đọc ngày 26/10/2026) nêu yêu cầu tối thiểu trên Windows: Windows 10 bản 1809 trở lên hoặc Windows Server 2019, RAM từ 4 GB, chip x64 hoặc ARM64. Đó là mức tối thiểu cho riêng tác tử. Khi làm thật, đồng chí mở cùng lúc trình soạn mã, trình duyệt và cửa sổ lệnh, nên máy càng nhiều bộ nhớ càng đỡ ì. Ổ cứng cần còn chỗ trống: mỗi dự án sau khi tải thư viện có thể chiếm vài trăm MB, phần lớn nằm trong thư mục `node_modules`, một thư mục "vật tư" tải về tự động, xóa đi rồi tải lại được bằng một lệnh.

Đường truyền phải ổn định. Tác tử không "nghĩ" trên máy của đồng chí mà gửi yêu cầu lên máy chủ của nhà cung cấp AI rồi nhận kết quả về. Mất mạng là xưởng đứng.

Điều kiện hay bị quên là quyền cài đặt. Theo tài liệu chính thức, Claude Code cài không cần quyền quản trị máy (Administrator), nhưng một số bộ cài khác như Node.js có thể hỏi quyền này. Máy cơ quan thường bị khóa quyền cài đặt; khi đó đồng chí đề nghị bộ phận quản trị mạng hỗ trợ, đừng tự tìm cách vượt. Mạng cơ quan chặn địa chỉ tải phần mềm cũng vậy: nhờ đúng người mở, không tìm đường vòng.

### 5.1.2. Các tài khoản cần có

Xưởng làm việc số cần năm tài khoản, cộng một tài khoản tùy chọn. Bảng dưới đây liệt kê theo thứ tự nên đăng ký.

| Tài khoản | Dùng để làm gì | Ghi chú |
|---|---|---|
| Email riêng cho việc kiến tạo | Đăng ký các dịch vụ bên dưới | Không dùng lại mật khẩu công vụ |
| GitHub | Lưu kho mã nguồn, lịch sử sửa | Bật xác thực hai lớp |
| Claude (gói Pro trở lên) | Dùng tác tử Claude Code | Tắt mục cho phép dùng dữ liệu để huấn luyện |
| Vercel | Triển khai, có địa chỉ web | Đăng nhập bằng GitHub |
| Supabase | Cơ sở dữ liệu, đăng nhập | Đăng nhập bằng GitHub; dự án đầu tiên chưa cần |
| Google (tùy chọn) | Gemini Notebook (trước đây là NotebookLM) | Xem Chương 15 |

Ba điều cần nói thêm. Thứ nhất, Vercel và Supabase đều cho đăng nhập bằng tài khoản GitHub; hướng dẫn triển khai của hệ thống Văn phòng làm đúng như vậy. Bớt được hai mật khẩu, nhưng tài khoản GitHub thành "chìa khóa tổng", nên bắt buộc bật xác thực hai lớp.

Thứ hai, quyền riêng tư. Theo trang giá chính thức của Anthropic, các gói cá nhân Free, Pro, Max áp dụng cơ chế "tự chọn không tham gia" (opt-out): đồng chí không tự tắt thì nội dung có thể được dùng để huấn luyện mô hình. Theo điều khoản cập nhật ngày 28/8/2025, bật cho huấn luyện thì dữ liệu được lưu 5 năm, tắt thì lưu 30 ngày. Ngay sau khi đăng ký, hãy vào Cài đặt → Quyền riêng tư (Settings → Privacy), tắt mục cho phép dùng dữ liệu để cải thiện Claude; thiết lập này áp dụng cả khi dùng Claude Code bằng tài khoản đó. Tên mục có thể đổi theo phiên bản, nên hãy đọc kỹ chữ trong mục Quyền riêng tư thay vì tìm một tên nút cố định.

Thứ ba, tài khoản cá nhân hay tổ chức. Học và làm thử thì dùng tài khoản cá nhân. Dùng chính thức nên chuyển sang gói tổ chức; theo trang giá, gói Team của Claude mặc định không dùng nội dung của tổ chức để huấn luyện mô hình. Chọn gói nào là quyết định của lãnh đạo, gắn với ngân sách và quy chế (Chương 17).

### 5.1.3. Chi phí tham khảo và ba phương án

Bảng 5.1 tóm tắt chi phí của các dịch vụ chính. Tất cả là giá tham khảo tại thời điểm viết (10/2026), có thể thay đổi; giá tính bằng đô la Mỹ, chưa gồm thuế. Ô nào ghi "chưa xác nhận" nghĩa là tôi không đối chiếu được trang giá chính thức, đồng chí cần tự tra trước khi đăng ký.

| Dịch vụ | Mức miễn phí | Mức trả phí thấp | Lưu ý |
|---|---|---|---|
| Claude Code | Không có trong gói Free | Pro 20 USD/tháng (17 USD nếu trả năm) | Max từ 100 USD/tháng |
| GitHub Copilot | 2.000 gợi ý mã/tháng, chat hạn chế | Pro 10 USD/tháng | Tính theo "AI credits" |
| OpenAI Codex | Chưa xác nhận | Có trong gói ChatGPT Plus trở lên | Đăng nhập bằng tài khoản ChatGPT |
| Antigravity CLI (Google) | Có, hạn mức chưa công bố chính thức | Chưa xác nhận | Thay Gemini CLI cho người dùng miễn phí |
| GitHub | Kho riêng tư không giới hạn | Team 4 USD/người/tháng | 2.000 phút chạy tự động/tháng |
| Vercel | Gói Hobby: cá nhân, phi thương mại | Gói Pro | Đọc kỹ điều khoản sử dụng |
| Supabase | 2 dự án, 500 MB mỗi dự án | Pro từ 25 USD/tháng | Bản miễn phí tạm dừng sau 1 tuần không dùng |

Từ bảng này, tôi gợi ý ba phương án.

**Phương án 1 — Không tốn tiền.** Dùng GitHub Copilot bản miễn phí hoặc mức miễn phí của công cụ Google, cộng GitHub, Vercel Hobby, Supabase Free. Đủ để học và làm vài trang công cụ nhỏ. Nhược điểm là hạn mức thấp và thay đổi liên tục: Google đã thay Gemini CLI bằng Antigravity CLI cho người dùng miễn phí từ ngày 18/6/2026, hạn mức mới chưa được công bố chính thức. Đồng chí có thể hết lượt giữa chừng một việc đang dở.

**Phương án 2 — Một thuê bao.** Trả một gói tác tử khoảng 10–20 USD/tháng (Claude Pro, Copilot Pro, hoặc ChatGPT Plus để dùng Codex), hạ tầng vẫn ở mức miễn phí. Đây là phương án tôi khuyến nghị cho cán bộ muốn làm trọn một ứng dụng nhỏ. Hệ thống thử nghiệm của Văn phòng được xây dựng bằng Claude Code, nên các ví dụ trong sách dùng công cụ này.

**Phương án 3 — Chính thức của cơ quan.** Dùng gói tổ chức có cam kết về dữ liệu, chẳng hạn Claude Team (25 USD/chỗ/tháng, 20 USD nếu trả năm) hoặc GitHub Copilot Business (19 USD/ghế/tháng); ứng dụng chạy trên hạ tầng chính thức. Phương án này gắn với thủ tục đề xuất, kinh phí và an toàn hệ thống thông tin (Chương 17, Chương 20).

Cần phân biệt hai loại chi phí. Thuê bao tác tử là tiền để AI *viết phần mềm giúp đồng chí*. Còn nếu bản thân ứng dụng có chức năng gọi AI (trợ lý chat, trợ lý soạn thảo), mỗi lượt gọi tốn tiền theo khóa API, tính riêng. Hệ thống của Văn phòng giữ khoản này trong tầm kiểm soát bằng hạn mức lượt gọi mỗi ngày (Chương 13, Chương 19). Dự án đầu tiên trong chương này không gọi AI nên không phát sinh khoản đó.

::: {.ghinho}
**Ghi nhớ: ba câu hỏi trước khi trả tiền**

1. Việc mình định làm có vừa với mức miễn phí không? Học thử thì thường vừa; làm một ứng dụng hoàn chỉnh thì thường không.
2. Dữ liệu nào sẽ đi qua dịch vụ này? Với gói cá nhân, đã tắt mục cho phép huấn luyện chưa?
3. Khi dịch vụ đổi giá hoặc ngừng gói miễn phí, mình có đường lui không?
:::

::: {.canhbao}
**Cảnh báo: gói miễn phí có giá của nó**

- Gói Hobby của Vercel dành cho mục đích cá nhân, phi thương mại. Ứng dụng phục vụ chính thức hoạt động của cơ quan phải được cân nhắc lại về điều khoản sử dụng.
- Dự án Supabase bản miễn phí tự tạm dừng sau 1 tuần không hoạt động; ứng dụng "ngủ" cho đến khi đồng chí bấm khôi phục.
- Các dịch vụ trong bảng đều là dịch vụ của doanh nghiệp nước ngoài. Tuyệt đối không đưa tài liệu mật, hồ sơ cá nhân thật lên đó (mục 5.3 và Chương 3).
:::

::: {.lanhdao}
**Dành cho lãnh đạo**

- Một cán bộ bắt đầu học làm ứng dụng cần khoảng một thuê bao 10–20 USD/tháng (giá tham khảo 10/2026); hạ tầng thử nghiệm có thể ở mức miễn phí.
- Tài khoản cá nhân dùng để học và làm bản demo; dùng chính thức phải chuyển sang gói tổ chức và hạ tầng được phê duyệt.
- Nên hỏi cán bộ: "Đã tắt chế độ cho phép dùng dữ liệu để huấn luyện chưa? Ứng dụng lưu dữ liệu gì, ở đâu?"
- Không để một người duy nhất nắm toàn bộ tài khoản; cần người thứ hai được bàn giao (rủi ro "người duy nhất biết", Chương 17).
:::

## 5.2. Cài đặt từng bước

Phần này đi theo thứ tự tôi khuyên làm: trình soạn mã, Node.js, Git, tài khoản GitHub, tác tử AI lập trình, rồi chọn chỗ đặt thư mục làm việc. Mỗi bước có lệnh kiểm tra ngắn; kiểm tra đạt mới sang bước sau.

### 5.2.1. VS Code — bàn làm việc của xưởng

Visual Studio Code (VS Code) là trình soạn mã miễn phí của Microsoft. Hãy hình dung nó là bàn làm việc có ba khu vực: bên trái là tủ hồ sơ (cây thư mục, các tệp của dự án), ở giữa là trang giấy đang soạn, phía dưới là "cửa sổ lệnh" (terminal), nơi đồng chí gõ lệnh và nơi tác tử AI lập trình làm việc.

Cách cài:

1. Vào trang chính thức `code.visualstudio.com`, tải bản dành cho Windows.
2. Chạy tệp cài đặt. Ở bước chọn tùy chọn, nên tích hai ô: thêm VS Code vào đường dẫn hệ thống (Add to PATH) và thêm mục "Open with Code" vào menu chuột phải.
3. Mở VS Code, vào menu Terminal → New Terminal để mở cửa sổ lệnh.

Đồng chí không cần học hết VS Code: trong cả cuốn sách, chúng ta chỉ dùng nó để mở thư mục dự án, xem tệp và mở cửa sổ lệnh. Một chi tiết nên để ý từ đầu: góc dưới bên phải luôn hiện bảng mã của tệp đang mở, với dự án tiếng Việt phải là UTF-8. Dự án của Văn phòng từng có một tệp danh mục bị lỗi mã hóa, chữ có dấu biến thành ký tự lạ, phải định nghĩa lại danh mục ở tệp UTF-8 chuẩn. Từ đó quy ước dự án ghi rõ: mọi chữ giao diện phải là tiếng Việt có dấu, mã hóa UTF-8.

### 5.2.2. Node.js — "điện nước" của xưởng

Hệ thống của Văn phòng, như phần lớn ứng dụng web hiện nay, được dựng bằng các công cụ chạy trên Node.js. Có thể ví Node.js như hệ thống điện nước: không nhìn thấy khi làm việc, nhưng thiếu nó thì không máy móc nào chạy. Đi kèm là npm, "kho vật tư" để tải thư viện dựng sẵn về dự án.

Cách cài:

1. Vào trang chính thức `nodejs.org`, tải bản LTS (bản hỗ trợ dài hạn) mới nhất cho Windows.
2. Chạy tệp cài đặt, để nguyên các lựa chọn mặc định.
3. Đóng hẳn VS Code rồi mở lại, để cửa sổ lệnh nhận Node.js vừa cài.
4. Trong cửa sổ lệnh, gõ hai lệnh kiểm tra:

```bash
node -v
npm -v
```

Mỗi lệnh phải in ra một số phiên bản. Bộ nhớ dự án của Văn phòng yêu cầu Node.js từ bản 18; hệ thống kiểm tra tự động trên GitHub của dự án chạy Node.js 20; đường cài Claude Code bằng npm (mục 5.2.5) cần bản 22 trở lên. Chọn bản LTS mới nhất là cách đơn giản để thỏa cả ba.

### 5.2.3. Git — sổ đăng ký văn bản của xưởng

Git là phần mềm ghi lại lịch sử mọi lần sửa đổi trong thư mục dự án. Ở cơ quan, văn thư có sổ đăng ký văn bản đi, văn bản đến: văn bản nào, ngày nào, ai ký. Git làm việc tương tự với mã nguồn. Mỗi lần "chốt sổ" gọi là một commit, kèm một dòng mô tả đã sửa gì. Nhờ đó, khi một thay đổi làm hỏng ứng dụng, đồng chí có thể quay về bản trước đó.

Cách cài:

1. Vào trang chính thức `git-scm.com`, tải Git for Windows.
2. Chạy tệp cài đặt, để nguyên các lựa chọn mặc định. Bộ cài này có kèm công cụ quản lý đăng nhập (Git Credential Manager), về sau sẽ tự mở trình duyệt để đồng chí đăng nhập GitHub.
3. Mở lại VS Code, khai tên và email sẽ hiện trong "sổ đăng ký":

```bash
git --version
git config --global user.name "[Họ và tên]"
git config --global user.email "[email đăng ký GitHub]"
```

Lệnh thứ nhất kiểm tra Git đã cài; hai lệnh sau làm một lần trên mỗi máy. Theo tài liệu chính thức, Git for Windows không bắt buộc với Claude Code (không có Git thì tác tử chạy lệnh bằng PowerShell), nhưng chúng ta cần Git để đưa mã lên GitHub.

### 5.2.4. Tài khoản GitHub — kho lưu trữ có sổ lịch sử

GitHub là dịch vụ lưu kho mã nguồn (repository) trên mạng. Nếu Git là sổ đăng ký đặt trên bàn từng người, thì GitHub là kho lưu trữ chung của cơ quan: bản gốc nằm ở đó, ai được phân quyền thì lấy về làm, làm xong nộp lại kèm sổ ghi chép. Theo trang giá chính thức, gói miễn phí cho phép tạo kho riêng tư (private) không giới hạn số lượng.

Cách làm:

1. Vào `github.com`, bấm Sign up, đăng ký bằng email riêng đã chuẩn bị.
2. Vào phần cài đặt bảo mật của tài khoản, bật xác thực hai lớp (two-factor authentication).
3. Chưa cần tạo kho nào. Kho đầu tiên sẽ được tạo ở mục 5.4.

Một quyết định quan trọng ngay từ kho đầu tiên: riêng tư hay công khai (public). Kho mã của hệ thống Văn phòng để công khai, nên dự án phải có hàng loạt quy tắc bảo vệ dữ liệu: danh bạ điện thoại thật, hồ sơ đánh giá cá nhân dùng làm mẫu đều bị chặn không cho lên kho; khóa bí mật chỉ nằm ở máy chủ. Với người mới, tôi khuyên mặc định để **riêng tư**, cho đến khi hiểu rõ những gì không được nằm trong kho mã (Chương 19).

### 5.2.5. Tác tử AI lập trình: Claude Code và các lựa chọn khác

Đây là "tổ chuyên viên kỹ thuật" của xưởng. Theo giới thiệu chính thức trên GitHub, Claude Code là công cụ lập trình dạng tác tử, chạy trong cửa sổ lệnh, hiểu toàn bộ mã nguồn, làm các việc lặp lại, giải thích mã và xử lý quy trình Git bằng câu lệnh ngôn ngữ tự nhiên. Nói nôm na: đồng chí giao việc bằng tiếng Việt, nó đọc hồ sơ dự án, đề xuất phương án, sửa tệp, chạy kiểm tra, rồi báo cáo lại.

::: {.thuchanh}
**Thực hành: cài Claude Code trên Windows bằng trình cài đặt gốc**

1. Mở PowerShell, hoặc dùng luôn cửa sổ lệnh trong VS Code.
2. Gõ lệnh cài đặt theo tài liệu chính thức: `irm https://claude.ai/install.ps1 | iex`
3. Nếu dùng Command Prompt (CMD) thay cho PowerShell: `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`
4. Đóng cửa sổ lệnh, mở lại, gõ `claude --version` để kiểm tra, rồi `claude doctor` để công cụ tự rà cấu hình.
5. Vào một thư mục bất kỳ, gõ `claude`. Lần đầu, công cụ mở trình duyệt để đăng nhập tài khoản Claude (gói Pro trở lên) hoặc tài khoản Console dùng khóa API.
6. Gõ thử: "Hãy cho biết thư mục này đang có những tệp gì." Nhận được câu trả lời là tác tử đã sẵn sàng.
:::

Vài điều cần biết thêm về cách cài:

- **Trình cài đặt gốc (native) là cách được khuyến nghị.** Bản cài theo cách này tự cập nhật ngầm, đồng chí không phải nhớ nâng cấp.
- **WinGet** là phương án thứ hai: `winget install Anthropic.ClaudeCode`. Bản cài này *không* tự cập nhật; muốn nâng cấp phải gõ `winget upgrade Anthropic.ClaudeCode`.
- **npm** là cách cũ: `npm install -g @anthropic-ai/claude-code`. Trang giới thiệu của Claude Code trên GitHub đã ghi cách này là "không còn khuyến nghị" (deprecated); tài liệu cài đặt chính thức vẫn liệt kê nó như phương án phụ và yêu cầu Node.js từ bản 22. Người mới không nên đi đường này.
- Bản cài gốc trên Windows không có chế độ "hộp cát" (sandbox) cô lập lệnh chạy; ai cần thì cài qua WSL 2 (môi trường Linux chạy trong Windows). Vì vậy càng phải đọc kỹ từng lệnh trước khi cho phép tác tử chạy.

Nếu máy cơ quan không cho cài phần mềm, vẫn còn hai lối: ứng dụng Desktop của Anthropic cho người không quen cửa sổ lệnh, và bản chạy trên web tại `claude.ai/code` dành cho các gói Pro, Max, Team. Theo tài liệu chính thức, phiên làm việc trên web chạy trên máy ảo đám mây do Anthropic quản lý, không tính phí riêng cho máy ảo, và cần kết nối tài khoản GitHub để lấy mã, đẩy mã. Lối này tiện, nhưng toàn bộ mã nguồn nằm trên máy chủ của nhà cung cấp, nên càng phải giữ kỷ luật dữ liệu.

**Các lựa chọn khác.** Claude Code không phải lựa chọn duy nhất. Bảng sau tóm tắt các tác tử phổ biến năm 2026, theo những gì tôi đối chiếu được trong tài liệu chính thức của từng hãng.

| Công cụ | Cách cài, đăng nhập | Ghi chú (10/2026) |
|---|---|---|
| OpenAI Codex | Lệnh cài PowerShell của OpenAI hoặc npm; đăng nhập bằng tài khoản ChatGPT | Dùng trong các gói Plus, Pro, Business, Edu, Enterprise |
| Gemini CLI / Antigravity CLI | `npm install -g @google/gemini-cli` | Người dùng miễn phí đã chuyển sang Antigravity CLI từ 18/6/2026 |
| Cursor | Trình soạn mã riêng, có AI tích hợp | Giá chưa đối chiếu được trang chính thức |
| GitHub Copilot | Tiện ích trong VS Code; có Copilot CLI | Bản Free không có tác tử lập trình đám mây |

Lệnh cài Codex trên Windows theo hướng dẫn chính thức là `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`. Theo trang giới thiệu chính thức, Gemini CLI nay dành cho người dùng khóa API trả phí, Vertex AI hoặc gói Code Assist.

Lời khuyên của tôi: chọn một công cụ và dùng cho thật thạo, đừng nhảy qua nhảy lại. Các kỹ năng ở Phần thứ hai (giao việc, bộ nhớ dự án, kiểm thử, nghiệm thu) dùng được với mọi tác tử; chỉ tên tệp bộ nhớ là khác nhau đôi chút giữa các hãng.

### 5.2.6. Thư mục làm việc: đặt NGOÀI OneDrive

Bước cuối nghe đơn giản nhưng gây nhiều rắc rối nhất: chọn chỗ đặt thư mục dự án. Trên nhiều máy Windows, thư mục Documents, Desktop được cài đặt tự đồng bộ lên OneDrive. Hãy hình dung OneDrive như một nhân viên photo rất chăm, thấy tờ giấy nào trên bàn thay đổi là sao ngay một bản gửi đi. Với văn bản Word thì tiện. Nhưng dự án phần mềm có rất nhiều tệp nhỏ trong `node_modules` và một thư mục `.git` thay đổi liên tục; nhân viên photo vừa chép vừa bị chen ngang, dễ chép dở dang.

Bộ nhớ dự án của Văn phòng ghi rõ ba hậu quả khi đặt kho mã trong OneDrive hay Dropbox: hỏng thư mục `.git`, kẹt `node_modules`, sinh ra các bản sao xung đột. Vì vậy quy tắc là đặt dự án ở ổ thường, ví dụ:

```text
C:\Projects\HDNDKPI
C:\Projects\tra-cuu-van-ban
```

Việc đồng bộ giữa các máy đã có GitHub lo, theo quy tắc vàng: đầu phiên `git pull`, cuối phiên `git push`.

::: {.cauchuyen}
**Câu chuyện thực tế: quy tắc ghi trên giấy và thực tế trên máy**

Rà soát kho mã vào tháng 10/2026 để viết sách, tôi thấy chính dự án của mình chưa giữ đúng hết quy tắc. Quy tắc ghi "KHÔNG đặt repo trong OneDrive", nhưng đoạn lệnh đăng ký tác vụ tạo bản tin pháp luật hằng ngày trên máy cơ quan lại trỏ tới một thư mục trong OneDrive. Quy ước ghi "không commit thư mục nháp", nhưng tệp danh sách chặn (`.gitignore`) không chặn thư mục đó, nên một tệp thử nghiệm có chứa địa chỉ dự án và khóa công khai đã lọt vào kho.

Khóa lọt ra là khóa công khai, vốn đã nằm sẵn trong mã tải xuống trình duyệt, nên rủi ro thấp. Nhưng bài học rõ ràng: quy ước chỉ ghi bằng lời thì máy không thực thi. Quy ước nào quan trọng, hãy giao tác tử biến nó thành cơ chế tự động (một dòng trong tệp chặn, một phép kiểm), và định kỳ nhờ tác tử "đối chiếu quy ước với thực tế kho mã" như một cuộc tự kiểm tra nội bộ.
:::

## 5.3. Tài khoản dịch vụ: Vercel, Supabase và tệp `.env`

### 5.3.1. Vercel — nơi "khánh thành" ứng dụng

Vercel là dịch vụ đưa trang web lên mạng (triển khai, deploy). Nếu mã nguồn là bộ bản vẽ, Vercel là đơn vị thi công kiêm ban quản lý tòa nhà: nhận bản vẽ từ GitHub, dựng thành ứng dụng, cấp địa chỉ dạng `ten-du-an.vercel.app`, rồi mở cửa đón khách. Cách mở tài khoản: vào `vercel.com`, đăng nhập bằng GitHub, cho phép Vercel đọc các kho đồng chí chỉ định. Phần nhập dự án sẽ làm ở mục 5.4.

Điều đáng giá nhất của Vercel là triển khai tự động. Theo bộ nhớ dự án của Văn phòng, mỗi lần đẩy mã lên nhánh chính (`main`) của GitHub, Vercel tự dựng lại và đưa bản mới lên mạng sau khoảng 1–2 phút, không ai phải chép tệp bằng tay. Vercel còn chạy được các "hàm máy chủ" đặt trong thư mục `api/`, là những đoạn mã chạy ở phía sau, cầm được khóa bí mật mà trình duyệt không được thấy. Hệ thống của Văn phòng dùng chúng cho trợ lý chat, trợ lý soạn thảo. Lưu ý mà bộ nhớ dự án nhắc nhiều lần: hàm trong `api/` chỉ chạy trên Vercel, không chạy khi thử ở máy cá nhân bằng `npm run dev`.

### 5.3.2. Supabase — kho lưu trữ hồ sơ và cửa đăng nhập

Supabase cung cấp cơ sở dữ liệu (database) PostgreSQL kèm dịch vụ đăng nhập. Ví với trụ sở cơ quan, đây là kho lưu trữ hồ sơ có bảo vệ gác cửa: ai được vào kho nào, được đọc hay được ghi, đều do bảng phân quyền quyết định.

Cách mở tài khoản và tạo dự án, theo đúng hướng dẫn trong tệp README của hệ thống Văn phòng:

1. Vào `supabase.com`, đăng nhập bằng GitHub, bấm tạo dự án mới (New Project). Dự án của Văn phòng chọn khu vực máy chủ Singapore.
2. Đặt mật khẩu cơ sở dữ liệu và cất vào nơi an toàn. Đây là mật khẩu quyền cao nhất của kho.
3. Khi cần dựng bảng, mở trình soạn câu lệnh SQL (SQL Editor → New query), dán nội dung tệp lược đồ của dự án (với hệ thống Văn phòng là `supabase/schema.sql`), rồi bấm chạy (Run).
4. Vào phần cài đặt khóa API của dự án, ghi lại hai thứ: địa chỉ dự án (Project URL) và khóa công khai.

Supabase đã đổi tên các loại khóa vài lần; dự án của Văn phòng từng phải sửa mã để nhận cả tên biến mới `SUPABASE_SECRET_KEY`. Đừng học thuộc tên nút, hãy nhớ nguyên tắc: **khóa công khai** được nằm trong trình duyệt, vì việc bảo vệ dữ liệu do bảng phân quyền ở cơ sở dữ liệu đảm nhận; **khóa bí mật** bỏ qua mọi phân quyền, chỉ được nằm ở máy chủ, tuyệt đối không chia sẻ.

Theo tài liệu của Supabase (đọc ngày 26/10/2026), gói miễn phí cho tối đa 2 dự án đang hoạt động, mỗi dự án 500 MB cơ sở dữ liệu, 50.000 người dùng hoạt động mỗi tháng, 1 GB lưu trữ tệp; dự án tạm dừng sau 1 tuần không hoạt động và khôi phục được bằng một nút bấm. Với bản demo thử nghiệm, chừng ấy là dư dả. Dự án đầu tiên ở mục 5.4 chưa cần Supabase, nhưng nên mở sẵn tài khoản để khi bước sang ứng dụng có đăng nhập (Bậc 3, Chương 18) thì không phải dừng lại làm thủ tục.

### 5.3.3. Tệp `.env` và vì sao không bao giờ đưa lên GitHub

Ứng dụng cần biết địa chỉ kho dữ liệu và khóa để mở kho. Viết thẳng chúng vào mã nguồn thì chúng sẽ theo mã nguồn đi khắp nơi: lên GitHub, sang máy khác, vào tay người được xem mã. Vì vậy người ta tách chúng ra tệp riêng tên `.env` (tệp biến môi trường), như phong bì đựng chìa khóa để trong ngăn kéo riêng, không bao giờ kẹp vào bộ hồ sơ gửi đi lưu trữ.

Dự án của Văn phòng có một tệp mẫu tên `.env.example`, được đưa lên GitHub, chỉ chứa tên biến và giá trị giả để người khác biết cần khai gì. Hai dòng đầu của tệp mẫu như sau:

```text
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Về máy mới, đồng chí sao tệp mẫu thành `.env` rồi điền giá trị thật. Tệp `.env` được liệt kê trong tệp danh sách chặn `.gitignore`, nên Git không bao giờ đưa nó lên kho; hệ quả là mỗi máy phải tạo lại `.env` một lần. Trên Vercel, các giá trị tương ứng được khai ở mục biến môi trường của dự án (Settings → Environment Variables), rồi bấm triển khai lại (Redeploy) để bản mới nhận biến.

Có một cái bẫy về tên biến. Với công cụ dựng trang Vite mà dự án đang dùng, biến có tiền tố `VITE_` được nhúng vào mã tải xuống trình duyệt, ai bấm "xem nguồn trang" cũng đọc được. Theo ví von trong bài học của dự án: cùng là phong bì, nhưng phong bì có dấu "VITE_" thì bưu điện photo phát cho mọi nhà. Vì vậy chỉ khóa công khai mới được mang tiền tố này; mọi khóa bí mật (của Supabase, của dịch vụ AI) chỉ khai ở máy chủ, không có `VITE_`.

::: {.canhbao}
**Cảnh báo: khi lỡ để lộ khóa bí mật**

- Nếu một khóa bí mật đã lọt lên GitHub, xóa tệp đi là **chưa đủ**: lịch sử Git vẫn còn nguyên bản cũ. Việc phải làm ngay là vào trang quản trị của dịch vụ, thu hồi khóa cũ và tạo khóa mới.
- Không dán khóa, mật khẩu vào câu lệnh gửi cho tác tử hay trợ lý AI trò chuyện. Khi cần tác tử cấu hình, chỉ nói "giá trị nằm trong tệp `.env`".
- Trước lần đẩy mã đầu tiên của mỗi dự án, gõ `git check-ignore -v .env`. Lệnh in ra một dòng quy tắc nghĩa là `.env` đã được chặn; không in gì nghĩa là chưa chặn, phải dừng lại sửa.
:::

::: {.phaply}
**Căn cứ pháp lý**

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) và Nghị định 356/2025/NĐ-CP (hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP). Điều 3 Nghị định 356/2025/NĐ-CP xếp họ tên, ngày sinh, số điện thoại, số định danh cá nhân, quan hệ gia đình vào dữ liệu cá nhân cơ bản. Những thông tin này không được nằm trong mã nguồn, tệp mẫu hay kho mã công khai.
- Luật An ninh mạng số 116/2025/QH15 (hiệu lực từ 01/7/2026) và Nghị định 331/2026/NĐ-CP (hiệu lực từ 19/8/2026) phân hệ thống thông tin theo cấp độ. Hệ thống phục vụ hoạt động nội bộ chỉ xử lý thông tin công cộng thuộc cấp độ 1; hệ thống phục vụ hoạt động nội bộ có xử lý thông tin cá nhân của người sử dụng (không xử lý bí mật nhà nước) thuộc cấp độ 2, yêu cầu bảo vệ cao hơn.
- Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (hiệu lực từ 01/3/2026), Điều 5, nghiêm cấm soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối Internet, mạng viễn thông hoặc mạng máy tính (trừ mạng LAN độc lập), trừ trường hợp theo pháp luật về cơ yếu. Xưởng làm việc số trong chương này gắn liền với Internet và dịch vụ đám mây, nên không dùng cho tài liệu mật dưới bất kỳ hình thức nào.
:::

## 5.4. Dự án đầu tiên trong 30 phút: "Trang tra cứu danh mục văn bản của Ban"

Bài toán rất đời thường. Mỗi Ban có một danh mục văn bản hay phải tra: luật, nghị định, nghị quyết thuộc lĩnh vực phụ trách, nằm rải trong vài tệp Excel. Chúng ta sẽ làm một trang web gõ từ khóa là ra ngay, lọc được theo lĩnh vực, mở được trên điện thoại.

Đây là ứng dụng Bậc 2 trong thang 5 bậc ở Chương 2: trang công cụ chạy trong trình duyệt, chưa cần cơ sở dữ liệu, chưa cần đăng nhập. Dữ liệu chỉ gồm văn bản đã công khai, tức vùng XANH theo cách phân loại của Tập 1. Con số 30 phút là thời lượng mục tiêu khi xưởng đã cài xong; lần đầu thường lâu hơn vì đọc kỹ từng bước, điều đó hoàn toàn bình thường.

**Bước 1 (3 phút) — Chuẩn bị dữ liệu.** Mở Excel, lập bảng bốn cột rồi lưu thành tệp CSV mã hóa UTF-8 (khi lưu bằng lệnh Save As, chọn kiểu tệp "CSV UTF-8").

::: {.vidu}
**Ví dụ minh họa: bốn dòng đầu của danh mục**

| Số hiệu | Tên văn bản | Hiệu lực từ | Lĩnh vực |
|---|---|---|---|
| 72/2025/QH15 | Luật Tổ chức chính quyền địa phương | 16/6/2025 | Tổ chức HĐND |
| 121/2025/QH15 | Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân | 01/3/2026 | Giám sát |
| 335/2025/NĐ-CP | Nghị định quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức | 01/01/2026 | Cán bộ |
| 134/2025/QH15 | Luật Trí tuệ nhân tạo | 01/3/2026 | Chuyển đổi số |

Bốn dòng trên lấy từ danh mục pháp lý đã kiểm chứng của cuốn sách (đối chiếu đến 26/10/2026). Khi làm thật, đồng chí tự đối chiếu từng dòng với Cơ sở dữ liệu quốc gia về văn bản pháp luật. Trang tra cứu chỉ hiển thị những gì người nhập ghi vào; nó không tự biết văn bản nào còn hay hết hiệu lực.
:::

**Bước 2 (2 phút) — Mở xưởng.** Tạo thư mục `C:\Projects\tra-cuu-van-ban`, chép tệp CSV vào đó. Bấm chuột phải vào thư mục, chọn "Open with Code". Mở cửa sổ lệnh, gõ `claude`.

**Bước 3 (5 phút) — Giao việc.** Dán câu lệnh (prompt) mẫu dưới đây, sửa các chỗ trong ngoặc vuông. Câu lệnh theo khung V-B-V-D-R của Tập 1, thêm phần "Nghiệm thu" mà Chương 6 sẽ phân tích kỹ.

::: {.lenhmau}
**Câu lệnh mẫu 5.1 — Dựng trang tra cứu danh mục văn bản**

```text
VAI: Đồng chí là kỹ sư phần mềm giúp tôi, một cán bộ không chuyên lập trình.
BỐI CẢNH: Tôi là cán bộ [Ban ...] thuộc Văn phòng Đoàn ĐBQH và HĐND tỉnh.
Thư mục này có tệp [danh-muc.csv] gồm 4 cột: Số hiệu, Tên văn bản,
Hiệu lực từ, Lĩnh vực. Toàn bộ là văn bản đã công khai.
VIỆC: Làm một trang web tra cứu danh mục này: ô tìm kiếm (gõ có dấu hay
không dấu đều ra), hộp lọc theo lĩnh vực, bảng kết quả, dòng đếm số kết quả.
DẠNG: Chỉ dùng HTML, CSS, JavaScript thuần, không thư viện ngoài. Chuyển
dữ liệu CSV thành tệp du-lieu.js để bấm đúp index.html là chạy được ngay,
không cần máy chủ. Giao diện tiếng Việt có dấu, UTF-8, dùng tốt trên điện
thoại (ô nhập cỡ chữ từ 16px). Đầu trang ghi: "Bản demo thử nghiệm — chỉ
tra cứu danh mục, không thay thế văn bản gốc".
RÀNG BUỘC: Không tự thêm cột "còn hiệu lực/hết hiệu lực". Không gửi dữ
liệu đi đâu. Chỉ tạo tệp trong thư mục này.
NGHIỆM THU: Gõ "giám sát" và "giam sat" đều ra dòng Luật Hoạt động giám
sát; lọc "Cán bộ" chỉ còn dòng thuộc lĩnh vực đó; thu hẹp cửa sổ còn bề
ngang điện thoại không bị tràn ngang.
Trước khi sửa tệp, hãy trình phương án và danh sách tệp sẽ tạo để tôi duyệt.
```
:::

**Bước 4 (5 phút) — Duyệt phương án, cho phép làm.** Tác tử trình phương án: tạo những tệp nào, mỗi tệp làm gì. Hãy đọc như đọc một tờ trình. Hợp lý thì trả lời "Đồng ý, làm đi"; thấy lạ (ví dụ đòi cài thêm thư viện) thì hỏi lại vì sao. Trong lúc làm, mặc định Claude Code hỏi xin phép trước khi sửa tệp hoặc chạy lệnh. Đây là cơ chế "trình ký" đáng quý: đọc rồi mới cho phép. Thấy tác tử đi chệch hướng, bấm phím Esc để dừng, rồi nói rõ cần sửa gì.

**Bước 5 (5 phút) — Nghiệm thu tại máy.** Bấm đúp tệp `index.html`, kiểm đúng ba tiêu chí đã ghi trong câu lệnh. Thêm hai phép thử của riêng đồng chí: gõ một từ không có trong danh mục (trang phải báo "không tìm thấy" chứ không trắng trơn), và gõ "báo" xem có kéo nhầm dòng chứa "bão" không. Chuyện này không phải đùa: bộ sinh bản tin của Văn phòng từng nhận nhầm tin "họp báo thường kỳ" thành tin bão vì so khớp sau khi bỏ dấu (Chương 15). Với ô tìm kiếm gõ nhanh, bỏ dấu là chấp nhận được, nhưng nên biết nó có giá.

Vì sao dặn chuyển dữ liệu thành `du-lieu.js`? Vì nếu trang tải tệp CSV bằng lệnh đọc dữ liệu, trình duyệt thường chặn khi mở tệp trực tiếp từ ổ đĩa và trang hiện trống. Tác tử không phải lúc nào cũng lường trước chuyện này; nói trước trong câu lệnh đỡ được một vòng sửa.

**Bước 6 (5 phút) — Đưa lên GitHub.** Vào `github.com`, bấm tạo kho mới (New repository), đặt tên `tra-cuu-van-ban`, chọn **Private**, không tích tạo sẵn tệp README. Chép địa chỉ kho, rồi giao việc cho tác tử.

::: {.lenhmau}
**Câu lệnh mẫu 5.2 — Chốt sổ và đưa lên GitHub**

```text
Hãy làm lần lượt, mỗi bước báo kết quả:
1. Tạo tệp .gitignore chặn: .env, node_modules/, các tệp nháp.
2. Tạo tệp CLAUDE.md ngắn (dưới 20 dòng): dự án là gì, dữ liệu chỉ gồm văn
   bản công khai, quy ước tiếng Việt có dấu UTF-8, cách chạy thử.
3. Tạo tệp NHAT-KY.md, ghi dòng đầu: hôm nay làm gì, nghiệm thu thế nào.
4. Khởi tạo Git, commit với thông điệp tiếng Việt rõ ràng.
5. Nối với kho [địa chỉ kho GitHub vừa tạo], nhánh main, rồi đẩy lên.
Không đưa lên bất kỳ tệp nào chứa mật khẩu hay khóa. Liệt kê cho tôi danh
sách tệp sẽ được đẩy lên trước khi đẩy.
```
:::

Đằng sau câu lệnh trên, tác tử sẽ chạy những lệnh Git cơ bản. Đồng chí không cần thuộc, nhưng nên nhận ra chúng khi tác tử xin phép:

```bash
git init
git add .
git commit -m "Dựng trang tra cứu danh mục văn bản của Ban"
git branch -M main
git remote add origin https://github.com/[tài-khoản]/tra-cuu-van-ban.git
git push -u origin main
```

Lần đẩy đầu tiên, trình duyệt sẽ bật lên trang đăng nhập GitHub. Đó là công cụ quản lý đăng nhập đi kèm Git for Windows đang làm việc của nó, không phải lỗi.

**Bước 7 (5 phút) — Khánh thành trên Vercel.** Vào `vercel.com`, chọn Add New → Project, chọn kho `tra-cuu-van-ban`, bấm Import. Vercel tự nhận ra đây là trang tĩnh, không cần cấu hình thêm. Bấm Deploy; chừng một phút sau đồng chí có địa chỉ dạng `tra-cuu-van-ban.vercel.app`. Hãy mở bằng điện thoại, gõ thử vài từ khóa.

Từ giờ, mỗi lần tác tử sửa trang và đẩy lên GitHub, Vercel tự triển khai lại. Hãy thử ngay: bảo tác tử "thêm vào chân trang dòng: Cập nhật danh mục ngày [hôm nay]", cho nó commit và đẩy lên, đợi một hai phút rồi tải lại trang trên điện thoại. Thấy dòng chữ mới hiện ra là đồng chí đã đi trọn một vòng của xưởng: giao việc, nghiệm thu, lưu trữ, khánh thành.

Dự án này nhỏ, và nên nhỏ như vậy. Hệ thống của Văn phòng hôm nay có khoảng 21.400 dòng mã, nhưng nó bắt đầu từ một bài toán cụ thể rồi lớn dần qua từng vòng như trên. Nhỏ trước, lớn sau là nguyên tắc thứ ba trong bảy nguyên tắc vàng ở Chương 4.

## 5.5. Kiểm tra "xưởng" đã sẵn sàng: bảng kiểm

Trước khi sang các chương sau, đồng chí dành mười phút đi hết bảng kiểm dưới đây; dòng nào chưa đạt thì quay lại mục tương ứng hoặc tra mục 5.6.

| Hạng mục | Cách kiểm | Kết quả đúng |
|---|---|---|
| VS Code | Menu Terminal → New Terminal | Cửa sổ lệnh hiện ở dưới |
| Node.js | `node -v` | Bản 18 trở lên (nên là bản LTS mới nhất) |
| npm | `npm -v` | In ra số phiên bản |
| Git | `git --version`, `git config user.name` | Có phiên bản và đúng họ tên |
| Tác tử | `claude --version`, `claude doctor` | Có phiên bản, không báo lỗi |
| Thư mục | Xem đường dẫn trên thanh tiêu đề | Không chứa chữ "OneDrive" |
| GitHub | Trang cài đặt bảo mật | Đã bật xác thực hai lớp |
| Quyền riêng tư | Cài đặt → Quyền riêng tư của Claude | Đã tắt cho phép huấn luyện |
| Tệp `.env` | `git check-ignore -v .env` | In ra quy tắc chặn |
| Đẩy mã | `git push` | Không báo lỗi, kho trên GitHub có tệp mới |
| Vercel | Mở địa chỉ `.vercel.app` | Trang chạy, có nhãn "Bản demo thử nghiệm" |
| Điện thoại | Mở cùng địa chỉ | Không tràn ngang, gõ được tiếng Việt |
| Supabase | Trang quản trị dự án | Đã có dự án, đã ghi lại Project URL và khóa công khai |

Cũng có thể giao tác tử kiểm hộ, miễn là dặn rõ chỉ xem, không sửa.

::: {.lenhmau}
**Câu lệnh mẫu 5.3 — Nhờ tác tử kiểm tra xưởng**

```text
Hãy kiểm tra môi trường làm việc trên máy này và lập bảng 3 cột:
Hạng mục - Kết quả - Đạt/Chưa đạt. Gồm: phiên bản Node.js, npm, Git;
tên và email Git; thư mục hiện tại có nằm trong OneDrive không; tệp .env
có bị Git chặn không; kho có nối với GitHub chưa.
CHỈ chạy lệnh xem, không cài đặt, không sửa, không xóa tệp nào.
Không in ra giá trị của bất kỳ khóa hay mật khẩu nào.
Mục nào chưa đạt thì giải thích bằng lời dễ hiểu và đề xuất cách sửa,
chờ tôi đồng ý rồi mới làm.
```
:::

## 5.6. Xử lý các lỗi hay gặp khi cài đặt

Bảng dưới đây gom những lỗi người mới thường gặp khi cài đặt trên Windows, cùng một số lỗi đã ghi trong nhật ký dự án. Thông báo lỗi thường bằng tiếng Anh; cột đầu ghi ý chính để đồng chí nhận ra.

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Gõ `node` hay `claude` báo không nhận ra lệnh | Cửa sổ lệnh mở trước khi cài | Đóng hẳn VS Code, mở lại |
| PowerShell báo không được chạy tập lệnh khi gõ `npm` | Chính sách thực thi tập lệnh của máy | Dùng Command Prompt; đổi chính sách thì hỏi bộ phận quản trị mạng |
| Cài Claude Code bằng npm báo lỗi phiên bản | Đường npm cần Node.js 22 trở lên | Dùng trình cài đặt gốc |
| Tải bộ cài báo lỗi chứng chỉ, hết thời gian chờ | Tường lửa, proxy cơ quan | Nhờ quản trị mạng; không tắt kiểm tra chứng chỉ |
| Git báo chưa biết danh tính người commit | Chưa khai tên, email | Chạy hai lệnh `git config` ở mục 5.2.3 |
| `git push` hỏi mật khẩu rồi báo sai | GitHub không nhận mật khẩu tài khoản qua đường này | Đăng nhập qua cửa sổ trình duyệt do Git bật lên |
| Lỗi khóa tệp, `npm install` chậm hoặc hỏng | Thư mục nằm trong OneDrive | Chuyển ra `C:\Projects`, tải lại kho |
| Chữ tiếng Việt thành ký tự lạ | Tệp không lưu UTF-8 | Yêu cầu tác tử lưu lại UTF-8; kiểm góc dưới VS Code |
| Bấm đúp `index.html` thấy trang trống | Trình duyệt chặn đọc tệp dữ liệu | Đưa dữ liệu vào tệp `.js` như câu lệnh 5.1 |
| Máy mình chạy, Vercel thì trắng trang | Chưa khai biến môi trường trên Vercel | Khai ở Settings → Environment Variables, rồi Redeploy |
| Hàm trong `api/` không chạy khi thử ở máy | Hàm máy chủ chỉ chạy trên Vercel | Bình thường; thử trên bản đã triển khai |
| Trang báo không kết nối được cơ sở dữ liệu | Dự án Supabase miễn phí đã tạm dừng | Bấm khôi phục trong trang quản trị Supabase |
| iPhone tự phóng to khi chạm ô nhập | Cỡ chữ ô nhập dưới 16px | Dặn tác tử đặt cỡ chữ ô nhập từ 16px |

Dòng cuối bảng không phải lý thuyết: ứng dụng của Văn phòng từng "vỡ khung" trên điện thoại chính vì ô nhập chữ nhỏ, và đã sửa bằng quy tắc cỡ chữ từ 16px trên màn hình hẹp. Gặp lỗi không có trong bảng, cách nhanh nhất là đưa nguyên văn thông báo lỗi cho tác tử, sau khi đã xóa mọi khóa, mật khẩu, địa chỉ email có thể lẫn trong đó.

::: {.lenhmau}
**Câu lệnh mẫu 5.4 — Nhờ tác tử chẩn đoán lỗi cài đặt**

```text
Tôi gặp lỗi khi [mô tả việc đang làm, ví dụ: đẩy mã lên GitHub].
Thông báo lỗi nguyên văn (đã xóa thông tin nhạy cảm):
[dán thông báo lỗi]
Hãy: (1) giải thích bằng tiếng Việt dễ hiểu lỗi này nghĩa là gì;
(2) nêu 2-3 nguyên nhân khả dĩ, xếp theo khả năng; (3) đề xuất cách kiểm
tra từng nguyên nhân bằng lệnh chỉ xem, không sửa gì. Nếu cách xử lý cần
quyền quản trị máy hoặc đổi cấu hình bảo mật, hãy nói rõ để tôi xin ý
kiến bộ phận quản trị mạng trước.
```
:::

## Tóm tắt chương 5

::: {.tomtat}
1. Xưởng làm việc số gồm: VS Code (bàn làm việc), Node.js (điện nước), Git (sổ đăng ký), GitHub (kho lưu trữ có lịch sử), tác tử AI lập trình (tổ chuyên viên kỹ thuật), Vercel (khánh thành), Supabase (kho hồ sơ và cửa đăng nhập).
2. Claude Code không có trong gói Free; gói thấp nhất là Pro 20 USD/tháng (giá tham khảo 10/2026). Hạ tầng thử nghiệm có thể ở mức miễn phí, kèm điều kiện phải đọc kỹ.
3. Trên Windows, cài Claude Code bằng trình cài đặt gốc; WinGet không tự cập nhật; đường npm không còn được khuyến nghị.
4. Đặt thư mục dự án ngoài OneDrive; đồng bộ giữa các máy bằng GitHub: đầu phiên kéo về, cuối phiên đẩy lên.
5. Tệp `.env` không bao giờ lên GitHub; chỉ khóa công khai mới được mang tiền tố `VITE_`; lỡ lộ khóa bí mật thì thu hồi ngay.
6. Ngay sau khi đăng ký, tắt chế độ cho phép dùng dữ liệu để huấn luyện; không đưa tài liệu mật, dữ liệu cá nhân thật vào xưởng.
7. Dự án đầu tiên nên nhỏ, dữ liệu vùng XANH, đi trọn vòng: giao việc → nghiệm thu → lưu trữ → khánh thành.
:::

## Câu hỏi suy ngẫm và bài tập

1. Máy tính của đồng chí ở cơ quan có cho cài phần mềm không? Nếu không, đồng chí sẽ đề nghị bộ phận quản trị mạng hay chọn lối dùng bản web? Lối nào hợp với loại dữ liệu đồng chí định xử lý?
2. Đi hết bảng kiểm ở mục 5.5, ghi lại những dòng chưa đạt và lý do.
3. Làm trọn dự án ở mục 5.4 với danh mục của chính Ban mình (chỉ văn bản đã công khai). Thêm một tiêu chí nghiệm thu của riêng đồng chí vào câu lệnh mẫu 5.1.
4. Ngoài `.env`, loại tệp nào trong công việc của Ban tuyệt đối không được nằm trong thư mục dự án? Bổ sung chúng vào `.gitignore`.
5. Giả sử đồng nghiệp lỡ đẩy một khóa bí mật lên kho GitHub công khai. Hãy viết ba việc phải làm, theo đúng thứ tự.
