# Phụ lục 1. Thuật ngữ Việt – Anh

Phụ lục này gom 81 thuật ngữ dùng trong sách. Nó có hai việc. Việc thứ nhất là giúp người đọc tra lại một khái niệm gặp ở chương sau mà không phải lật về chỗ giải thích đầu tiên. Việc thứ hai là cho biết tên tiếng Anh tương ứng. Phần lớn tài liệu hướng dẫn, giao diện công cụ và thông báo lỗi trong năm 2026 vẫn viết bằng tiếng Anh; biết tên gốc thì tra cứu nhanh hơn, giao việc cho tác tử AI lập trình cũng ít nhầm hơn.

Ba lưu ý khi dùng bảng:

- Thuật ngữ xếp theo thứ tự chữ cái tiếng Việt (a, ă, â, b, c, d, đ, e, ê…); dấu thanh chỉ xét sau cùng. Cột "Tiếng Anh" ghi tên thường gặp nhất, có khi kèm chữ viết tắt.
- Lời giải thích chỉ để nhớ nhanh, nhiều chỗ dùng lại hình ảnh trụ sở cơ quan quen thuộc trong sách: giao diện là phòng tiếp dân, máy chủ là phòng làm việc phía sau, cơ sở dữ liệu là kho lưu trữ hồ sơ. Muốn hiểu kỹ, đồng chí đọc chương liên quan.
- Với thuật ngữ pháp lý (bên triển khai, dữ liệu cá nhân nhạy cảm, đánh giá tác động xử lý dữ liệu cá nhân), bảng chỉ tóm lược. Pháp luật trong sách được đối chiếu đến ngày 26/10/2026; khi áp dụng phải đọc nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật hoặc Công báo. Tên sản phẩm và gói dịch vụ cũng đổi nhanh: NotebookLM đã đổi tên thành Gemini Notebook từ ngày 16/7/2026.

| Thuật ngữ | Tiếng Anh | Giải thích ngắn |
|---|---|---|
| Ảo giác (của AI) | Hallucination | AI viết ra điều nghe hợp lý nhưng sai hoặc bịa: số hiệu văn bản, điều khoản, số liệu. Phải đối chiếu văn bản gốc. |
| Ẩn danh hóa | Anonymisation | Xóa hoặc thay mọi chi tiết giúp nhận ra một người (họ tên, địa chỉ, số điện thoại, số định danh) trước khi đưa dữ liệu vùng VÀNG cho AI. |
| Bản demo thử nghiệm | Demo, prototype | Phiên bản để dùng thử, chạy trên dữ liệu mô phỏng, có nhãn rõ; không thay thế văn bản, quy trình chính thức. |
| Bản dựng | Build | Bước đóng gói mã nguồn thành bộ tệp chạy được. "Bản dựng xanh" là điều kiện tối thiểu, chưa phải bằng chứng đúng nghiệp vụ. |
| Băm, chuỗi băm | Hash | Biến một chuỗi thành "vân tay" cố định: so khớp được, không dựng lại được bản gốc. Dùng lưu mã truy cập của đơn vị. |
| Bên triển khai (hệ thống AI) | Deployer | Một chủ thể được định nghĩa tại Điều 3 Luật Trí tuệ nhân tạo số 134/2025/QH15; cơ quan đưa chatbot vào phục vụ công việc thường ở vai này. |
| Biến môi trường | Environment variable | Thông số cấu hình khai ngoài mã nguồn (tệp .env, trang quản trị Vercel); nơi đúng để cất khóa bí mật. |
| Bot chat | Chatbot, bot | Chương trình tự trả lời tin nhắn trên Telegram, Zalo OA; bot của Văn phòng đọc số liệu thật từ các phân hệ. |
| Bộ nhớ dự án | Project memory | Tệp CLAUDE.md và thư mục .claude/rules/ trong kho mã, tác tử tự đọc đầu mỗi phiên; như sổ bàn giao. |
| Câu lệnh | Prompt | Lời giao việc gửi cho AI, nên theo khung V-B-V-D-R; giao cho tác tử thì thêm Nghiệm thu. |
| Chế độ lập kế hoạch | Plan mode | Tác tử chỉ đọc, phân tích, trình phương án, chưa sửa tệp nào; người duyệt như duyệt tờ trình. |
| Chỉ số đo lường kết quả | Key Performance Indicator (KPI) | Chỉ số đo kết quả công việc; phân hệ OKR/KPI dùng ba tiêu chí Số lượng, Chất lượng, Tiến độ theo Nghị định 335/2025/NĐ-CP. |
| Chính sách bảo mật theo dòng | Row Level Security (RLS) | Quy tắc trong cơ sở dữ liệu quyết định ai đọc, ghi được dòng nào; như thẻ ra vào từng phòng. |
| Cơ sở dữ liệu | Database | "Kho lưu trữ hồ sơ" của ứng dụng; hệ thống thử nghiệm dùng Supabase (PostgreSQL), mỗi khối dữ liệu là một dòng trong bảng app_state. |
| Cửa sổ ngữ cảnh | Context window | Lượng văn bản tối đa AI "nhìn thấy" trong một lượt; tài liệu quá dài phải chia nhỏ hoặc chọn đoạn liên quan. |
| Danh sách trắng | Allowlist | Chỉ chấp nhận mục đã khai sẵn. An toàn, nhưng quên khai mục mới thì dữ liệu bị gọt mất, như trường danh bạ từng bị. |
| Dịch vụ AI trung gian | AI proxy, reseller API | Bên bán lại quyền gọi mô hình AI; rẻ, tiện, nhưng câu hỏi và số liệu gửi kèm đi qua máy chủ của họ. |
| Dữ liệu cá nhân nhạy cảm | Sensitive personal data | Nhóm dữ liệu cá nhân được bảo vệ chặt hơn theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, như tình trạng sức khỏe. |
| Dữ liệu mô phỏng | Mock data | Dữ liệu giả lập để trình diễn, thử nghiệm; phải gắn nhãn, không trình bày như kết quả thật. |
| Dữ liệu vùng ĐỎ, VÀNG, XANH | Data classification | Phân loại của Tập 1: ĐỎ là mật, nhạy cảm, không đưa lên AI công cộng; VÀNG là nội bộ, phải ẩn danh; XANH là công khai. |
| Đánh giá tác động xử lý dữ liệu cá nhân | Data Protection Impact Assessment (DPIA) | Hồ sơ đánh giá rủi ro khi xử lý dữ liệu cá nhân; biểu mẫu ban hành kèm Nghị định 356/2025/NĐ-CP. |
| Đặc tả yêu cầu phần mềm | Software requirements specification | Văn bản nêu phần mềm phục vụ ai, làm gì, theo quy trình nào, nghiệm thu ra sao; viết trước khi làm. |
| Đẩy lên, kéo về | Push, pull | Đưa thay đổi từ máy lên GitHub và lấy bản mới nhất về máy; đầu phiên kéo về, cuối phiên đẩy lên. |
| Địa chỉ nhận sự kiện | Webhook | Địa chỉ mà Telegram, Zalo tự gọi tới khi có tin nhắn mới; như chuông cửa báo có khách. |
| Điểm nối | Endpoint | Một địa chỉ nhận một loại yêu cầu, như /api/troly; như một ô trong bộ phận một cửa. |
| Gắn nhãn nội dung do AI tạo | AI content labelling | Thông báo, đánh dấu nội dung do AI tạo hoặc chỉnh sửa trong các trường hợp Luật Trí tuệ nhân tạo và văn bản hướng dẫn yêu cầu. |
| Ghi thay đổi | Commit | Một lần ghi thay đổi vào lịch sử kho mã kèm lời mô tả; mỗi lần ghi là một điểm khôi phục. |
| Giao diện | User interface (UI), frontend | "Phòng tiếp dân" của ứng dụng: phần người dùng nhìn thấy và bấm vào. |
| Giao diện lập trình ứng dụng | Application Programming Interface (API) | "Cửa giao dịch một cửa" để chương trình này gửi yêu cầu, nhận kết quả từ chương trình khác theo thể thức định sẵn. |
| Gói miễn phí | Free tier | Mức dùng không mất tiền, kèm giới hạn; tại thời điểm 10/2026, Supabase Free tạm dừng dự án sau một tuần không hoạt động. |
| Hàm máy chủ | Serverless function | Đoạn mã chạy trên máy chủ Vercel khi có yêu cầu rồi tắt; không nhớ gì giữa các lần gọi, có giới hạn thời gian chạy. |
| Hạn mức | Quota, rate limit | Số lượt tối đa trong một khoảng thời gian; Trợ lý AI của hệ thống cho khách 1, người đăng nhập 5 lượt mỗi ngày. |
| Huấn luyện mô hình | Model training | Nhà cung cấp dùng dữ liệu, có thể gồm hội thoại, để cải thiện mô hình; gói cá nhân thường phải tự tắt trong mục quyền riêng tư. |
| Kho mã nguồn | Repository | "Tủ lưu bản vẽ" có lịch sử từng lần sửa; kho công khai thì ai cũng đọc được mọi tệp. |
| Khóa API | API key | Chuỗi bí mật chứng minh quyền gọi một dịch vụ, gắn với hóa đơn; lộ khóa như lộ con dấu kèm tài khoản. |
| Khóa bí mật | Secret key, service role key | Khóa vượt mọi phân quyền của cơ sở dữ liệu; chỉ đặt ở máy chủ, không bao giờ mang tiền tố VITE_. |
| Khóa lạc quan | Optimistic locking | Chỉ ghi khi dữ liệu trên máy chủ chưa bị ai sửa kể từ lúc mình mở; có người sửa thì báo xung đột. |
| Không gian tên | Namespace | Tiền tố tách dữ liệu từng phân hệ, như state_kiemdiem_…; thiếu nó, phân hệ này từng ghi đè phân hệ kia. |
| Khởi động nguội | Cold start | Lần gọi đầu sau thời gian nghỉ nên chậm; phân hệ Một dữ liệu trên gói miễn phí mở lần đầu mất 30–60 giây. |
| Khung lệnh V-B-V-D-R | Prompt framework | Vai, Bối cảnh, Việc, Dạng, Ràng buộc (Tập 1); Tập 2 thêm Nghiệm thu khi giao việc cho tác tử. |
| Kịch bản trả lời | Rule-based responses | Câu trả lời soạn sẵn theo từ khóa, chạy trong trình duyệt, không tốn chi phí AI; tầng đầu của khung chat Người hướng dẫn. |
| Kiểm thử | Test | Chạy thử có chủ đích để chứng minh phần mềm đúng; mỗi phép kiểm có đáp án biết trước, như "41/82 thì thiếu 1 phiếu". |
| Kiểm thử hồi quy | Regression test | Phép kiểm giữ lại sau mỗi lỗi đã gặp để lỗi không quay lại, như bẫy "phó trưởng ban" và "trưởng ban". |
| Lập trình bằng lời nói | Vibe coding | Mô tả tự nhiên để AI viết mã; nhanh, nhưng thiếu đặc tả và nghiệm thu thì sinh nhiều lựa chọn ẩn. |
| Lõi nghiệp vụ thuần | Pure business logic | Phần tính toán tách khỏi giao diện và mạng; nhờ vậy máy chạy hàng trăm phép kiểm trong vài giây. |
| Lời nhắc hệ thống | System prompt | Lời dặn cố định đặt trước mọi câu hỏi gửi AI: vai trò, giới hạn, điều cấm (cấm bịa số hiệu, nhắc bản demo). |
| Mã hóa ký tự UTF-8 | UTF-8 encoding | Chuẩn mã hóa giúp tiếng Việt có dấu hiển thị đúng; sai bảng mã thì chữ thành ký tự lạ. |
| Mã nguồn | Source code | "Bộ bản vẽ thiết kế" của phần mềm, viết bằng ngôn ngữ lập trình. |
| Mã nguồn mở | Open source | Mã công bố kèm giấy phép cho phép xem, dùng, sửa theo điều kiện; đọc kỹ giấy phép trước khi dùng lại. |
| Máy chủ | Server, backend | "Phòng làm việc phía sau": xử lý yêu cầu, giữ khóa bí mật, gọi AI; người dùng không nhìn thấy. |
| Mô hình chạy cục bộ | Local model | Mô hình AI chạy trên máy cơ quan, dữ liệu không rời máy; đổi lại chất lượng tiếng Việt, suy luận thấp hơn bản đám mây. |
| Mô hình ngôn ngữ lớn | Large language model (LLM) | Mô hình AI học từ khối văn bản rất lớn để sinh chữ; "bộ não" phía sau Claude, ChatGPT, Gemini. |
| Mục tiêu và kết quả then chốt | Objectives and Key Results (OKR) | Mục tiêu định hướng kèm kết quả then chốt đo được; đạt 60–70% là vùng tốt; không dùng để xếp loại cá nhân. |
| Nghiệm thu | Acceptance criteria | Thành phần thứ sáu thêm vào V-B-V-D-R: tiêu chí hoàn thành đếm được, thử được, viết trước khi giao việc. |
| Nguồn cấp tin RSS | RSS feed | Danh sách tin mới do trang báo công bố theo định dạng chuẩn; bản tin pháp luật lấy từ 5 kênh chính thống. |
| Nguyên tắc máy đề xuất – người quyết định | Human-in-the-loop | Máy tính toán, gợi ý; người có thẩm quyền duyệt, sửa, ký và chịu trách nhiệm cuối cùng. |
| Nhận dạng ký tự quang học | Optical character recognition (OCR) | Chuyển bản scan, ảnh chụp thành chữ; PDF scan không có lớp chữ nên phải qua bước này và đọc soát. |
| Nhật ký thay đổi | Changelog | "Sổ giao ban" của dự án: làm gì, vì sao, sửa tệp nào, kiểm thử ra sao. |
| Phân hệ | Module | Khối chức năng có đường dẫn riêng, như Đánh giá OKR/KPI, Kiểm điểm, Biểu quyết Online, Sổ tay AI. |
| Phân quyền | Authorization | Quy định ai được xem, sửa, phê duyệt gì; khác xác thực. |
| Phiên đăng nhập | Session | Khoảng thời gian hệ thống ghi nhận người dùng đã đăng nhập; nạp dữ liệu trước khi biết phiên từng gây ghi đè. |
| Quy luật Goodhart | Goodhart's law | Thước đo bị biến thành mục tiêu thì không còn đo tốt; lý do không lấy % đạt OKR để chấm điểm cá nhân. |
| Ranh giới từ | Word boundary | So khớp theo trọn từ thay vì chuỗi con, để "quốc gia" không bị coi là chứa "gia"; với tiếng Việt còn phải giữ dấu. |
| Sản phẩm khả dụng tối thiểu | Minimum Viable Product (MVP) | Phiên bản nhỏ nhất đủ dùng thử thật để lấy ý kiến; làm nhỏ, đo, sửa rồi mới mở rộng. |
| Soát lỗi cú pháp | Linting | Công cụ dò lỗi cú pháp, lối viết mã dễ sinh lỗi; dự án yêu cầu 0 lỗi trước mỗi lần ghi thay đổi. |
| Sổ tay AI | AI notebook | Một sổ tay trên Gemini Notebook (trước đây là NotebookLM), chỉ trả lời dựa trên nguồn đã nạp, kèm trích dẫn. |
| Tác tử AI lập trình | AI coding agent | AI tự đọc kho mã, sửa tệp, chạy lệnh, kiểm thử; như tổ chuyên viên kỹ thuật làm theo phiếu giao việc. |
| Tác vụ định kỳ | Scheduled task | Việc máy tự chạy theo lịch, như bản tin lúc 07:30; cần chạy bù, thử lại, ghi nhật ký. |
| Tên miền | Domain name | Địa chỉ dễ nhớ của trang web; có thể đổi, như NotebookLM chuyển sang notebook.google.com. |
| Thao tác nguyên tử | Atomic operation | Hoặc làm trọn, hoặc không làm gì, không bị chen giữa chừng; dùng để bot không trả lời một tin hai lần. |
| Thử nghiệm có kiểm soát | Regulatory sandbox | Cho thử giải pháp mới trong phạm vi, thời hạn được phê duyệt; ứng dụng tự làm ngoài khuôn khổ đó không mặc nhiên được miễn trách nhiệm. |
| Token | Token | Đơn vị chia nhỏ văn bản mà mô hình AI đọc, viết và tính phí; bot của Văn phòng đặt trần mỗi câu trả lời 900 token. |
| Trích dẫn nguồn | Citation, grounding | Gắn từng ý trả lời với đoạn văn bản gốc, đánh số [1], [2], để người đọc mở ra kiểm chứng. |
| Triển khai | Deploy | "Khánh thành, mở cửa đón khách": đưa bản dựng lên máy chủ cho mọi người dùng. |
| Trình duyệt không giao diện | Headless browser | Trình duyệt chạy ngầm do chương trình điều khiển, dùng bấm thử từng trang trên bản dựng thật. |
| Trợ lý AI trò chuyện | AI chatbot, AI assistant | Ứng dụng hỏi đáp như Claude, ChatGPT, Gemini; trả lời trên màn hình, không tự hành động trên máy. |
| Truy hồi tăng cường sinh | Retrieval-Augmented Generation (RAG) | Tìm đoạn tài liệu liên quan trước, rồi mới cho AI trả lời dựa trên đúng các đoạn đó, kèm trích dẫn. |
| Tự động lưu | Autosave | Tự ghi lên máy chủ sau mỗi thay đổi (hệ thống: 0,9 giây); nạp dữ liệu sai thời điểm thì có thể ghi đè. |
| Tương thích ngược | Backward compatibility | Bản mới vẫn mở đúng dữ liệu lưu theo quy tắc cũ; bắt buộc mỗi khi đổi tiêu chí, công thức. |
| Ứng dụng web | Web application | Phần mềm chạy trong trình duyệt, không cần cài đặt, dùng được trên máy tính và điện thoại. |
| Xác thực | Authentication | Bước xác minh người dùng là ai, thường bằng đăng nhập; xác thực xong vẫn phải phân quyền. |

::: {.ghinho}
**Ghi nhớ: năm cặp khái niệm hay bị nhầm**

1. **Xác thực và phân quyền.** Biết người đó là ai chưa có nghĩa là người đó được vào phòng nào.
2. **Trợ lý AI trò chuyện và tác tử AI lập trình.** Một bên viết nháp trên màn hình; một bên sửa thẳng vào hệ thống đang chạy.
3. **Bản dựng xanh và chạy đúng.** Đóng gói được chưa chắc đúng nghiệp vụ; phải nghiệm thu bằng thao tác thật trên sản phẩm thật.
4. **Ẩn trên giao diện và bảo mật.** Gỡ biển tên phòng không phải là khóa cửa; quyền thật nằm ở cơ sở dữ liệu và máy chủ.
5. **OKR và KPI.** OKR để định hướng, KPI để đánh giá; lấy % đạt OKR chấm điểm cá nhân là mời gọi đặt mục tiêu thấp.
:::

# Phụ lục 2. Thư viện câu lệnh mẫu

Thư viện gồm 40 câu lệnh, chia hai nhóm. Nhóm A (PL2.1–PL2.15) dùng khi làm việc với tác tử AI lập trình; tôi tái dựng chúng theo cách đã giao việc trong quá trình xây dựng hệ thống thử nghiệm của Văn phòng (hdndthkpi.vercel.app). Nhóm B (PL2.16–PL2.40) dùng cho nghiệp vụ của cơ quan dân cử. Đây là các mẫu soạn cho sách theo quy trình ở Chương 16, không phải bản ghi những lần dùng thật, nên đồng chí cần thử và chỉnh cho hợp việc của mình.

| Nhóm | Câu lệnh | Đọc kèm |
|---|---|---|
| A. Làm việc với tác tử AI lập trình | PL2.1–PL2.15 | Chương 6, 7, 8, 19 |
| B1. Kỳ họp, hoạt động của Đoàn ĐBQH | PL2.16–PL2.20 | Chương 13, 16 |
| B2. Thẩm tra | PL2.21–PL2.23 | Chương 8, 16 |
| B3. Giám sát | PL2.24–PL2.27 | Chương 16 |
| B4. Tiếp công dân, xử lý đơn | PL2.28–PL2.29 | Chương 3, 16 |
| B5. Tiếp xúc cử tri | PL2.30–PL2.32 | Chương 16 |
| B6. Văn bản theo Nghị định 30/2020/NĐ-CP | PL2.33–PL2.35 | Chương 3, 16 |
| B7. Thông tin, truyền thông | PL2.36–PL2.37 | Chương 15, 16 |
| B8. Công việc nội bộ | PL2.38–PL2.40 | Chương 16, 18 |

::: {.canhbao}
**Cảnh báo: đọc dòng "Vùng dữ liệu được phép" trước khi dán bất cứ thứ gì**

- **XANH** là văn bản đã ban hành, tài liệu đã công khai: dùng được với mọi công cụ.
- **VÀNG (đã ẩn danh)** là tài liệu nội bộ, dự thảo, danh sách kiến nghị, tóm tắt đơn đã bỏ hết chi tiết nhận diện người: chỉ dùng tài khoản đã tắt huấn luyện hoặc tài khoản tổ chức có cam kết không huấn luyện.
- **ĐỎ** là tài liệu mật, hồ sơ nhân sự, danh tính người khiếu nại, tố cáo, dữ liệu cá nhân nhạy cảm: không câu lệnh nào trong thư viện này cho phép dùng. Các quy định về bảo vệ bí mật nhà nước và Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 là ranh giới không thương lượng.
- Với nhóm A, tác tử đọc được mọi tệp trong thư mục dự án, nên ranh giới vùng dữ liệu áp cho cả thư mục chứ không riêng câu lệnh.
:::

::: {.thuchanh}
**Thực hành: bốn bước dùng một câu lệnh mẫu**

1. Xác định vùng dữ liệu của tài liệu định dùng; vùng ĐỎ thì dừng.
2. Thay mọi chỗ trong [ngoặc vuông]; xóa dòng không cần; giữ nguyên các dòng ràng buộc.
3. Dán tài liệu sau dòng "---", ưu tiên bản điện tử có lớp chữ, ghi rõ nguồn.
4. Đọc kết quả như đọc bản nháp của một chuyên viên mới: kiểm số liệu, đối chiếu trích dẫn với văn bản gốc, sửa văn phong rồi mới dùng. Luật Trí tuệ nhân tạo số 134/2025/QH15 (khoản 2 Điều 4) ghi rõ: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người."
:::

## Nhóm A. Câu lệnh làm việc với tác tử AI lập trình

PL2.1 là khung đầy đủ; các câu lệnh còn lại giả định bộ nhớ dự án đã ghi sẵn các ràng buộc thường trực (Chương 7). Dự án chưa có bộ nhớ thì ghép thêm phần [RÀNG BUỘC] của PL2.1 vào mỗi câu lệnh.

## PL2.1. Phiếu giao việc đủ sáu thành phần

**Mục đích:** khung chung để giao một việc cho tác tử, theo V-B-V-D-R cộng Nghiệm thu.

**Vùng dữ liệu được phép:** XANH (mô tả nghiệp vụ, văn bản đã ban hành, mã nguồn).

::: {.lenhmau}
**Câu lệnh mẫu PL2.1 — Phiếu giao việc**

```text
[VAI] Lập trình viên cẩn trọng của dự án. Tôi quyết nghiệp vụ; chỗ nào chưa
rõ thì hỏi, không tự chọn.
[BỐI CẢNH] Phân hệ [tên, đường dẫn] phục vụ [ai] theo [văn bản]. Hiện
trạng: [...]. Cần thay đổi: [...].
[VIỆC] Chỉ một việc: [động từ + đối tượng + vị trí].
[DẠNG] [Vị trí trên màn hình; tiếng Việt có dấu; dùng được trên điện thoại].
[RÀNG BUỘC] Không đổi công thức, câu chữ nghiệp vụ; không sửa phân hệ khác;
không ghi đè dữ liệu đã lưu; không đưa khóa, dữ liệu thật vào mã.
[NGHIỆM THU] (1) [tiêu chí đếm được]. (2) [thao tác thử, kết quả mong đợi].
(3) Dữ liệu cũ vẫn mở đúng. Bản dựng xanh, lint 0 lỗi.
Cuối việc báo: sửa gì, tệp nào, kiểm thế nào, việc tôi phải tự làm.
```
:::

## PL2.2. Trình phương án trước khi làm

**Mục đích:** đọc phương án như đọc tờ trình trước những việc chạm dữ liệu, quyền hoặc nhiều phân hệ.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.2 — Trình phương án**

```text
CHƯA SỬA TỆP NÀO. Việc: [mô tả]. Đọc bộ nhớ dự án, các tệp liên quan, rồi
trình: (1) yêu cầu hiểu theo lời của mình; (2) đã đọc tệp, văn bản nào;
(3) sửa gì, ở đâu, nếu có hai cách thì so sánh; (4) tác động tới dữ liệu đã
lưu, phân hệ khác, bot chat, tệp xuất, quyền đọc/ghi; (5) cách kiểm thử,
tiêu chí nghiệm thu; (6) điều đã tự giả định, câu hỏi cần tôi quyết.
Không dán mã. Chờ tôi duyệt.
```
:::

## PL2.3. Chia nhỏ một yêu cầu lớn

**Mục đích:** biến "làm cho tôi một hệ thống" thành 10–15 bước, mỗi bước nghiệm thu được trong một lần ngồi.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.3 — Lập lộ trình**

```text
CHƯA VIẾT MÃ. Tôi muốn xây dựng [mô tả 3-5 dòng] cho [ai], theo [văn bản].
Lập lộ trình 10-15 bước: Bước | Việc | Sản phẩm thấy được | Cách tôi nghiệm
thu trong khoảng 15 phút mà không đọc mã.
Thứ tự: tính toán trước giao diện; dữ liệu, phân quyền trước tiện ích; nhãn
"Bản demo thử nghiệm" từ bước đầu; bước chạm dữ liệu đã lưu tách riêng.
Đánh dấu bước có chỗ nghiệp vụ cần tôi quyết, kèm câu hỏi.
```
:::

## PL2.4. Từ văn bản quy định đến bảng đặc tả

**Mục đích:** bóc chủ thể, quy trình, công thức, biểu mẫu, thời hạn, thẩm quyền ra khỏi văn bản trước khi viết mã.

**Vùng dữ liệu được phép:** XANH (văn bản đã ban hành); dự thảo chưa công bố chỉ dùng khi được cấp có thẩm quyền đồng ý.

::: {.lenhmau}
**Câu lệnh mẫu PL2.4 — Bảng đặc tả**

```text
CHƯA VIẾT MÃ. Đọc toàn văn [tên, số hiệu] trong docs/. Lập bảng 6 phần:
chủ thể (ai chấm, ai duyệt, ai xem); quy trình; công thức, cách làm tròn,
điều kiện xếp loại; biểu mẫu và thứ tự cột; thời hạn, chu kỳ; thẩm quyền
sửa, phê duyệt. Mỗi dòng ghi điều, khoản, trang. Văn bản không nói thì ghi
"không quy định", không tự điền.
Liệt kê riêng: câu chữ hiểu được nhiều cách (kèm hệ quả) và chỗ tự mâu
thuẫn (tổng điểm, cột số so với lời văn, đánh số khoản).
```
:::

## PL2.5. Biến bảng tính mô phỏng thành ca kiểm thử

**Mục đích:** buộc phần mềm tính khớp bảng tính đã thống nhất tới hai chữ số thập phân.

**Vùng dữ liệu được phép:** XANH (bảng tính chỉ có số liệu ví dụ).

::: {.lenhmau}
**Câu lệnh mẫu PL2.5 — Ca kiểm thử từ bảng tính**

```text
Tệp [tên] trong docs/ mô phỏng cách chấm điểm đã thống nhất.
Chép từng ví dụ thành ca kiểm thử tiếng Việt (đầu vào, kết quả, dòng
nguồn), rồi thành phép kiểm chạy bằng Node; hàm tính tách khỏi giao diện.
Thêm ca biên: danh sách trống, điểm 0, điểm tối đa, đúng ngưỡng xếp loại.
Báo ca khớp, ca lệch và mức lệch. Ca lệch thì DỪNG báo tôi; không chỉnh
công thức "cho khớp" khi chưa được đồng ý.
```
:::

## PL2.6. Thêm một phân hệ mới

**Mục đích:** thêm phân hệ mà không đè dữ liệu phân hệ cũ, không làm bot và tệp xuất "mù" dữ liệu mới.

**Vùng dữ liệu được phép:** XANH; dữ liệu mẫu là dữ liệu mô phỏng có nhãn.

::: {.lenhmau}
**Câu lệnh mẫu PL2.6 — Thêm phân hệ**

```text
CHƯA SỬA. Cần thêm phân hệ [tên] tại [#/...] cho [ai], làm [việc], theo
[văn bản]. Trình phương án trả lời:
1. Dữ liệu lưu ở đâu, có không gian tên riêng, có đụng chỗ lưu cũ không?
2. Khai ở danh mục dùng chung nào để Trang chủ, Hướng dẫn tự hiện?
3. Ai đọc, ai ghi; chính sách bảo mật theo dòng thêm gì; thử hai vai thế nào?
4. Bot chat, tệp xuất, kiến thức tĩnh của bot cần sửa gì?
5. Nhãn "Bản demo thử nghiệm", nhãn dữ liệu mô phỏng đặt ở đâu?
```
:::

## PL2.7. Đối chiếu với biểu mẫu giấy

**Mục đích:** tìm chỗ màn hình và tệp Word lệch biểu mẫu đang dùng thật, như bốn chỗ lệch từng gặp ở phân hệ Kiểm điểm.

**Vùng dữ liệu được phép:** XANH (biểu mẫu trắng); mẫu đã điền phải che thông tin cá nhân và nằm ngoài kho mã công khai.

::: {.lenhmau}
**Câu lệnh mẫu PL2.7 — Đối chiếu biểu mẫu**

```text
Biểu mẫu [tên] đang dùng thật nằm ở [thư mục đã chặn bằng .gitignore], đã
che thông tin cá nhân. Đối chiếu với màn hình [phân hệ] và tệp Word xuất ra.
Bảng: Mục biểu mẫu | Phần mềm hiện có | Lệch gì | Đề xuất.
Soát: số bước quy trình; số, thứ tự, tên cột; chấm điểm hay đánh dấu (x);
con số cố định hay do người dùng đề xuất; tiêu đề văn bản Đảng hay hành
chính; khổ giấy. CHƯA SỬA. Khi sửa: xuất thử tệp thật, đọc lại, báo kết quả.
```
:::

## PL2.8. Báo lỗi theo hiện tượng

**Mục đích:** mô tả lỗi đủ để tác tử tái hiện, tìm nguyên nhân gốc và để lại phép kiểm hồi quy.

**Vùng dữ liệu được phép:** XANH; thông báo lỗi, ảnh chụp phải xóa họ tên và số liệu cá nhân.

::: {.lenhmau}
**Câu lệnh mẫu PL2.8 — Báo lỗi**

```text
Lỗi: [người dùng thấy gì] tại [#/...], vai [khách/cán bộ/quản trị], từ
[ngày, sau thay đổi nào]. Thông báo nguyên văn: [...]. Lẽ ra: [...].
Tái hiện trước; không tái hiện được thì báo, không đoán. Giải thích nguyên
nhân gốc bằng lời thường. Lỗi có lặp theo lịch (đầu tháng, kỳ mới) không?
Dữ liệu nào bị ảnh hưởng? Sửa chạm dữ liệu đã lưu thì chờ tôi đồng ý.
Sửa xong: thêm phép kiểm hồi quy đúng ca này, ghi cảnh báo tại dòng mã.
```
:::

## PL2.9. Rà soát chức năng liên quan

**Mục đích:** áp quy tắc ra đời sau chuỗi sự cố ngày 13/8/2026: chỗ nào khác đang đọc, ghi thứ vừa đổi?

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.9 — Rà soát dây chuyền**

```text
Vừa sửa: [mô tả]. Trước khi báo xong, tìm trong mã và chạy thử, không đoán:
chỗ nào khác đọc, ghi thứ vừa đổi; bot chat còn đọc đúng không; xuất thử
Word, Excel; quyền có đổi không (thử vai khách và vai quản trị); trang
hướng dẫn còn đúng không; dữ liệu cũ mở có đúng không.
Bảng: Chỗ ảnh hưởng | Kiểm thế nào | Kết quả | Đã sửa gì. Chưa kiểm được
thì ghi "chưa kiểm", không ghi "ổn".
```
:::

## PL2.10. Rà soát an toàn trước khi chia sẻ

**Mục đích:** đóng vai kiểm toán viên bảo mật, chỉ rà và báo cáo, trước khi gửi địa chỉ ứng dụng cho người khác.

**Vùng dữ liệu được phép:** XANH; báo cáo chỉ ghi tên biến, không in giá trị khóa.

::: {.lenhmau}
**Câu lệnh mẫu PL2.10 — Kiểm toán bảo mật**

```text
CHỈ RÀ SOÁT, KHÔNG SỬA. Kiểm: (1) mã, tài liệu, lịch sử ghi thay đổi có số
điện thoại, hồ sơ cá nhân, mật khẩu, khóa không; .gitignore chặn .env chưa;
(2) biến nào nhúng xuống trình duyệt (tiền tố VITE_), có khóa quyền cao
không; (3) người đã đăng nhập gọi thẳng API đọc, ghi được gì, khách thì
sao; (4) trường nào đi vào lời nhắc gửi AI, qua máy chủ của ai; (5) chỗ nào
"mở cho demo" phải đóng khi dùng thật.
Bảng: Mức độ | Vấn đề | Vị trí | Đề xuất.
```
:::

## PL2.11. Đặt trần chi phí cho tính năng gọi AI

**Mục đích:** để chi phí AI có trần, đúng các bài học về hạn mức của dự án.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.11 — Trần chi phí**

```text
CHƯA SỬA. Tính năng [tên] gọi AI tính tiền theo lượt. Trình phương án:
hạn mức ngày khách [n], người đăng nhập [m], đếm ở MÁY CHỦ, đặt lại lúc
0 giờ giờ Việt Nam; thứ tự kiểm yêu cầu hợp lệ → xác thực → trừ lượt → gọi
AI, lỗi thì hoàn lượt, áp cho MỌI điểm nối có gọi AI; nhận diện khách bằng
chuỗi băm, không lưu IP gốc; thiếu cấu hình bộ đếm thì đóng với khách; trần
chờ AI nhỏ hơn giới hạn của nền tảng, báo lỗi tiếng Việt.
Ước tính chi phí tối đa mỗi ngày theo [đơn giá tôi đưa]; không tự đoán giá.
```
:::

## PL2.12. Viết phép kiểm bằng ngôn ngữ nghiệp vụ

**Mục đích:** có bộ phép kiểm người không đọc mã vẫn đọc được như tiêu chí nghiệm thu.

**Vùng dữ liệu được phép:** XANH; họ tên trong ca kiểm là tên giả.

::: {.lenhmau}
**Câu lệnh mẫu PL2.12 — Phép kiểm nghiệp vụ**

```text
Viết phép kiểm cho [hàm, phân hệ], chạy bằng Node, không cần mạng. Mỗi phép
có một dòng mô tả nghiệp vụ, như "41/82 đồng ý thì còn thiếu 1 phiếu".
Gồm: ca chuẩn từ [văn bản, bảng tính]; ca biên (danh sách trống, đúng
ngưỡng, kỳ mới chưa có dữ liệu); ca tiếng Việt ("quốc gia"/"gia",
"báo"/"bão", "phó trưởng ban"/"trưởng ban", trùng họ tên ở hai đơn vị); ca
cấm (mã không chứa số điện thoại, mật khẩu).
Chạy, báo số đạt/không đạt, in danh sách mô tả để tôi đọc.
```
:::

## PL2.13. Kiểm chứng trên bản dựng thật

**Mục đích:** buộc tác tử chứng minh bằng thao tác thật, rồi giải thích bằng lời thường cho người nghiệm thu.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.13 — Chứng minh bằng thao tác**

```text
Chứng minh [thay đổi] chạy đúng trên bản dựng thật: mở bằng trình duyệt
không giao diện; đi qua [#/..., #/...] và mọi tab, đếm ngoại lệ (phải bằng
0); kiểm số liệu hiển thị [ví dụ 28/28 cán bộ]; thử vai khách và vai quản
trị; có xuất tệp thì xuất thật, mở lại, đối chiếu tiêu đề và bảng.
Sau đó viết một trang cho người không đọc mã: thay đổi gì, người dùng thấy
khác ở đâu, rủi ro còn lại, việc tôi phải tự làm.
```
:::

## PL2.14. Khép phiên: nhật ký và bộ nhớ dự án

**Mục đích:** giữ bối cảnh cho phiên sau và máy khác, vì trí nhớ hội thoại của tác tử chỉ nằm trên từng máy.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.14 — Khép phiên**

```text
Kết thúc phiên. (1) Thêm mục nhật ký: làm gì · vì sao · nguyên nhân gốc ·
tệp nào · kiểm thử bao nhiêu phép, kết quả; việc tôi phải tự làm ghi đầu
dòng "CẦN LÀM". (2) Đối chiếu bộ nhớ dự án, kiến thức tĩnh của bot, trang
hướng dẫn với mã hiện tại; câu nào lỗi thời thì đề xuất sửa. (3) Bản dựng
xanh; chỉ ghi đúng tệp của việc hôm nay; thông điệp tiếng Việt có dấu; đẩy
lên GitHub. Báo lại việc dở dang cho phiên sau.
```
:::

## PL2.15. Chuẩn bị hồ sơ bàn giao

**Mục đích:** để người tiếp nhận vận hành và khôi phục được hệ thống khi người làm ra nó vắng mặt.

**Vùng dữ liệu được phép:** XANH; chỉ ghi chức danh và tên biến, không ghi tên người, số điện thoại, giá trị khóa.

::: {.lenhmau}
**Câu lệnh mẫu PL2.15 — Hồ sơ bàn giao**

```text
Soạn trong docs/ hồ sơ bàn giao tiếng Việt cho [đơn vị tiếp nhận]: hệ thống
làm gì, chạy ở đâu, giới hạn của bản demo; danh mục phân hệ và nơi lưu dữ
liệu; dịch vụ đang dùng, tài khoản đứng tên đơn vị nào, gói gì, hạn dùng,
tên các biến môi trường; cách cài lại trên máy mới, triển khai, khôi phục
từ lịch sử; việc định kỳ và dấu hiệu hỏng; rủi ro còn mở, việc phải làm
trước khi dùng chính thức; chỗ quy ước lệch với thực tế kho mã.
```
:::

## Nhóm B. Câu lệnh cho nghiệp vụ cơ quan dân cử

Năm ràng buộc chung nên đặt một lần trong mục hướng dẫn tùy chỉnh của trợ lý AI trò chuyện: viết tiếng Việt có dấu, văn phong hành chính trung lập; chỉ dựa trên tài liệu được cung cấp, thiếu thì nói thiếu; không bịa số hiệu, điều, khoản, số liệu; không nêu họ tên người, chỉ ghi chức danh; mọi kết quả là bản nháp để tham khảo. Các câu lệnh dưới đây vẫn nhắc lại ràng buộc quan trọng nhất để dùng độc lập được.

## PL2.16. Tóm tắt bộ tài liệu kỳ họp

**Mục đích:** nắm nhanh nội dung, số liệu chính của các tờ trình, báo cáo trình kỳ họp.

**Vùng dữ liệu được phép:** XANH (tài liệu kỳ họp đã phát hành công khai).

::: {.lenhmau}
**Câu lệnh mẫu PL2.16 — Tóm tắt tài liệu kỳ họp**

```text
[VAI] Chuyên viên tổng hợp của Văn phòng Đoàn ĐBQH và HĐND tỉnh.
[VIỆC] Tóm tắt [số] tài liệu trình Kỳ họp thứ [n] HĐND tỉnh dán dưới đây.
[DẠNG] Bảng: Tài liệu | Cơ quan trình | Nội dung chính (3-5 ý) | Số liệu
chủ yếu (ghi trang) | Vấn đề cần lưu ý. Sau bảng: 5 vấn đề lớn của cả bộ.
[RÀNG BUỘC] Chỉ dùng thông tin trong tài liệu; số liệu chép đúng; thiếu thì
ghi "tài liệu không nêu"; không thêm nhận định chính trị.
--- TÀI LIỆU ---
[dán nội dung]
```
:::

## PL2.17. Đối chiếu số liệu giữa các báo cáo

**Mục đích:** phát hiện số liệu vênh nhau giữa các báo cáo trước khi Ban hoặc đại biểu sử dụng.

**Vùng dữ liệu được phép:** XANH.

::: {.lenhmau}
**Câu lệnh mẫu PL2.17 — Tìm mâu thuẫn số liệu**

```text
Đối chiếu số liệu giữa các báo cáo dán dưới đây.
Bảng: Chỉ tiêu | Tài liệu A (trang) | Tài liệu B (trang) | Chênh lệch | Có
thể do đâu (khác kỳ, khác phạm vi, sai sót). Kiểm thêm: tổng thành phần có
bằng số tổng; tỷ lệ % tính lại có khớp; kỳ báo cáo có đủ tháng như tên gọi.
Chỗ chỉ là nghi vấn ghi "cần xác minh với cơ quan trình". Kết thúc bằng
danh sách câu hỏi cần làm rõ.
--- TÀI LIỆU ---
[dán nội dung]
```
:::

## PL2.18. Gợi ý câu hỏi chất vấn có căn cứ

**Mục đích:** gợi ý câu hỏi bám báo cáo và kiến nghị cử tri, để đại biểu chọn và tự hoàn thiện.

**Vùng dữ liệu được phép:** XANH; VÀNG (bản tổng hợp kiến nghị cử tri đã ẩn danh).

::: {.lenhmau}
**Câu lệnh mẫu PL2.18 — Câu hỏi chất vấn**

```text
Phiên chất vấn lĩnh vực [lĩnh vực], người trả lời [chức danh]. Từ báo cáo
và bản tổng hợp kiến nghị dán dưới, gợi ý 10 câu hỏi. Mỗi câu: câu hỏi (dưới
60 chữ) · căn cứ (trích, ghi trang) · điều cần làm rõ · câu hỏi tiếp nếu trả
lời chung chung. Đúng thẩm quyền người trả lời; không quy kết; ưu tiên vấn
đề cử tri phản ánh nhiều lần, chậm xử lý. Đại biểu quyết định câu cuối cùng.
--- TÀI LIỆU ---
[dán nội dung]
```
:::

## PL2.19. Kịch bản điều hành phiên họp

**Mục đích:** dự thảo kịch bản điều hành một phiên theo chương trình kỳ họp đã thông qua.

**Vùng dữ liệu được phép:** XANH (chương trình đã công bố); không kèm danh sách đại biểu có thông tin cá nhân.

::: {.lenhmau}
**Câu lệnh mẫu PL2.19 — Kịch bản điều hành**

```text
Dự thảo kịch bản điều hành phiên [buổi, ngày] Kỳ họp thứ [n] theo chương
trình dưới đây. Mỗi nội dung: thời gian dự kiến · người điều hành (chức
danh) · lời dẫn ngắn, trang trọng · việc của Văn phòng (tài liệu, màn hình,
biểu quyết). Lời công bố kết quả biểu quyết tính trên TỔNG SỐ đại biểu,
theo quy chế làm việc của HĐND. Đánh dấu [CẦN XÁC NHẬN] chỗ phụ thuộc chủ
tọa. Không thêm nội dung ngoài chương trình.
--- CHƯƠNG TRÌNH ---
[dán nội dung]
```
:::

## PL2.20. Tổng hợp góp ý dự án luật cho Đoàn ĐBQH

**Mục đích:** gom góp ý của các cơ quan theo từng điều của dự thảo để Đoàn ĐBQH tỉnh xây dựng ý kiến.

**Vùng dữ liệu được phép:** XANH (dự thảo đã công bố); VÀNG (văn bản góp ý, đã bỏ tên người ký, người liên hệ).

::: {.lenhmau}
**Câu lệnh mẫu PL2.20 — Tổng hợp góp ý dự án luật**

```text
Tổng hợp [số] văn bản góp ý dự án [tên luật] theo từng điều của dự thảo.
Bảng: Điều, khoản | Nội dung dự thảo (tóm tắt) | Ý kiến góp ý | Cơ quan góp
ý | Số cơ quan cùng ý. Cuối bảng: vấn đề còn nhiều ý khác nhau; đề nghị bổ
sung điều mới. Giữ nguyên ý từng cơ quan, không gộp ý trái nhau; không thêm
ý của mình; góp ý không rõ điều nào thì ghi "chưa xác định điều".
--- DỰ THẢO VÀ VĂN BẢN GÓP Ý ---
[dán nội dung]
```
:::

## PL2.21. Bảng kiểm căn cứ pháp lý, thẩm quyền của dự thảo nghị quyết

**Mục đích:** lập bảng để chuyên viên Ban đối chiếu căn cứ, thẩm quyền với văn bản gốc, không phải để kết luận thẩm tra.

**Vùng dữ liệu được phép:** XANH (văn bản pháp luật đã ban hành); VÀNG (tờ trình, dự thảo đang thẩm tra).

::: {.lenhmau}
**Câu lệnh mẫu PL2.21 — Bảng kiểm căn cứ, thẩm quyền**

```text
Dưới đây là tờ trình, dự thảo nghị quyết [tên] và nguyên văn các văn bản
được viện dẫn, tải từ nguồn chính thống. Lập:
Bảng 1: Căn cứ viện dẫn | Có nguyên văn trong tài liệu không | Điều, khoản
giao thẩm quyền cho HĐND tỉnh (trích) | Nhận xét.
Bảng 2: Nội dung dự thảo | Căn cứ tương ứng | Vấn đề.
KHÔNG dùng trí nhớ để khẳng định hiệu lực hay số điều; không có thì ghi
"chưa có căn cứ trong tài liệu". Cuối cùng liệt kê căn cứ cần tra hiệu lực
trên Cơ sở dữ liệu quốc gia về văn bản pháp luật.
--- TÀI LIỆU ---
[dán nội dung]
```
:::

## PL2.22. Khung báo cáo thẩm tra bốn phần

**Mục đích:** dựng khung báo cáo thẩm tra theo bốn phần như tác vụ Thẩm tra của phân hệ Trợ lý AI, để Ban hoàn thiện.

**Vùng dữ liệu được phép:** VÀNG (tờ trình, dự thảo đang thẩm tra); tài liệu có độ mật thì không dùng.

::: {.lenhmau}
**Câu lệnh mẫu PL2.22 — Khung báo cáo thẩm tra**

```text
Dựng KHUNG báo cáo thẩm tra dự thảo nghị quyết [tên] của Ban [tên Ban]:
I. Cơ sở pháp lý và thẩm quyền ban hành; II. Sự phù hợp về nội dung (với
chủ trương, pháp luật, thực tiễn; độ nhất quán giữa tờ trình và dự thảo);
III. Khả năng cân đối nguồn lực; IV. Kết luận và kiến nghị.
Mỗi phần: các ý rút từ tài liệu (ghi trang) và chỗ trống [Ý KIẾN CỦA BAN].
Văn phong thẩm tra, trung lập; đánh số I, 1, a); không tự kết luận "thống
nhất" hay "không thống nhất", phần đó do Ban quyết định.
--- TÀI LIỆU ---
[dán nội dung]
```
:::

## PL2.23. Soát tính nhất quán nội tại của dự thảo

**Mục đích:** soát lỗi "số học" và đánh số trong dự thảo, cách đã giúp phát hiện sáu chỗ chưa nhất quán của dự thảo Khung tiêu chí HĐND.

**Vùng dữ liệu được phép:** XANH hoặc VÀNG (dự thảo nội bộ, không có thông tin cá nhân).

::: {.lenhmau}
**Câu lệnh mẫu PL2.23 — Soát nhất quán**

```text
Chỉ soát, không viết lại dự thảo [tên] dưới đây. Kiểm: tổng điểm thành phần
có bằng điểm tối đa của tiêu chí, của nhóm; điểm thưởng, điểm trừ có vượt
trần; cột số có khớp lời văn ở cột cách chấm; điều, khoản đánh số liên tục,
dẫn chiếu nội bộ trỏ đúng chỗ; điều kiện nào thiếu ngưỡng đo được; một khái
niệm có bị gọi hai tên. Bảng: Vị trí | Dự thảo ghi | Vấn đề | Phương án đề
xuất. Mọi phương án là KIẾN NGHỊ cho cơ quan soạn thảo, không tự chọn.
--- DỰ THẢO ---
[dán nội dung]
```
:::

