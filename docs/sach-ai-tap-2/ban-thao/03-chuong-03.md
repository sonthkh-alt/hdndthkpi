# Chương 3. Hành lang pháp lý khi dùng AI và tự xây dựng ứng dụng

::: {.muctieu}
**Mục tiêu của chương**

- Nắm các chủ trương, văn bản mới nhất về trí tuệ nhân tạo (AI) và chuyển đổi số, đối chiếu đến ngày 26/10/2026, kể cả văn bản đã thay thế văn bản Tập 1 từng dẫn.
- Tự xác định vai của mình và của cơ quan theo Luật Trí tuệ nhân tạo và những việc phải làm trước khi cho người khác dùng một ứng dụng có AI.
- Phân loại dữ liệu trong ứng dụng tự làm theo pháp luật và theo 4 cấp của Tập 1; hiểu vì sao tài liệu mật không bao giờ được đưa lên AI công cộng hay dịch vụ đám mây.
- Phân biệt bản demo với văn bản, hệ thống chính thức; hiểu quyền tác giả với mã viết cùng AI, giấy phép mã nguồn mở, con đường sáng kiến.
- Vận dụng mười điều tuân thủ khi tự làm ứng dụng.

Dành cho: mọi người đọc. Lãnh đạo đọc kỹ mục 3.1, 3.4, 3.8; cán bộ tự làm ứng dụng đọc kỹ toàn chương, nhất là mục 3.2–3.4.
:::

Tôi bắt tay làm hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa (hdndthkpi.vercel.app) vào mùa hè năm 2026, đúng lúc hành lang pháp lý về công nghệ số thay đổi nhiều nhất. Chỉ trong mười tháng đầu năm, lần lượt có hiệu lực Luật Bảo vệ dữ liệu cá nhân (01/01/2026), Luật Trí tuệ nhân tạo và Luật Bảo vệ bí mật nhà nước mới (01/3/2026), Luật Chuyển đổi số và Luật An ninh mạng mới (01/7/2026), kèm nhiều nghị định, thông tư hướng dẫn.

Người cán bộ tự làm ứng dụng dễ rơi vào một trong hai cái bẫy: sợ (nghe có luật về AI, có nghị định xử phạt thì không dám làm) hoặc coi nhẹ (nghĩ phần mềm "nhà làm", chỉ dùng trong phòng thì luật không với tới). Cả hai đều sai. Pháp luật hiện hành khuyến khích ứng dụng AI trong cơ quan nhà nước, nhưng đặt ra những lằn ranh rõ ràng về dữ liệu, bí mật và trách nhiệm.

Chương này là tấm bản đồ cho người không chuyên pháp lý. Mỗi mục trả lời ba câu hỏi: văn bản nào, nó đòi hỏi gì, và hệ thống của Văn phòng đã làm theo ra sao, kể cả những chỗ từng làm sai.

::: {.cauchuyen}
**Câu chuyện thực tế: căn cứ đã hết hiệu lực nằm ngay trong tài liệu của chính dự án**

Tài liệu Đặc tả yêu cầu phần mềm đánh giá KPI của dự án, đề tháng 7/2026, hai lần ghi "Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân": ở phần căn cứ và ở phần yêu cầu an toàn thông tin. Khi đối chiếu để viết cuốn sách này, tôi mới thấy nghị định ấy đã hết hiệu lực từ 01/01/2026, khi Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP cùng có hiệu lực.

Không ai cố ý dẫn sai: câu chữ được chép từ tài liệu cũ, hoặc do AI gợi ý theo trí nhớ cũ của nó. Tập 1 (mục 1.3) đã nhắc trong "Năm điều AI không phải": AI không biết các quy định mới nhất. Bài học của tôi: mỗi khi viết dòng "căn cứ", phải tra tình trạng hiệu lực ngay hôm đó, không chép lại từ tài liệu cũ, kể cả tài liệu của chính mình.
:::

::: {.canhbao}
**Cảnh báo: cách dùng chương này**

- Pháp luật trong chương được đối chiếu đến ngày 26/10/2026, qua nhiều nguồn chính thống đối chiếu chéo. Trước khi áp dụng, đồng chí cần tra nguyên văn và tình trạng hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn) hoặc Công báo.
- Sách chỉ nêu số Điều, khoản khi đã đối chiếu được; chỗ chưa chắc thì nói chung và khuyên tra lại. Đó là chủ ý, không phải sơ suất.
- Chương này giúp nhận diện vấn đề, không thay ý kiến của bộ phận pháp chế hay cơ quan có thẩm quyền.
:::

Tập 1 (mục 7.1 và 7.3) viết khi nhiều văn bản dưới đây chưa ra đời. Hộp dưới đây tóm lại những thay đổi chính, để người đã đọc Tập 1 khỏi dùng nhầm căn cứ cũ.

::: {.phaply}
**Cập nhật so với Tập 1**

- **Chiến lược quốc gia về AI:** Quyết định 127/QĐ-TTg ngày 26/01/2021 đã được thay thế bằng Quyết định 1671/QĐ-TTg ngày 28/8/2026 (hiệu lực từ ngày ký).
- **Bí mật nhà nước:** Luật số 29/2018/QH14 hết hiệu lực từ 01/3/2026, thay bằng Luật Bảo vệ bí mật nhà nước số 117/2025/QH15; Nghị định 26/2020/NĐ-CP được thay bằng Nghị định 63/2026/NĐ-CP.
- **An ninh mạng:** Luật An ninh mạng năm 2018 và Luật An toàn thông tin mạng năm 2015 hết hiệu lực từ 01/7/2026, được hợp nhất, thay thế bằng Luật An ninh mạng số 116/2025/QH15; các nghị định hướng dẫn ban hành ngày 19/8/2026.
- **Dữ liệu cá nhân:** Nghị định 13/2023/NĐ-CP hết hiệu lực từ 01/01/2026; căn cứ hiện hành là Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP; xử phạt theo Nghị định 330/2026/NĐ-CP.
- **Tiếp cận thông tin:** Luật số 104/2016/QH13 hết hiệu lực từ 01/9/2026, thay bằng Luật Tiếp cận thông tin số 01/2026/QH16.
- **Mới hoàn toàn so với Tập 1:** Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực 01/3/2026) cùng các văn bản hướng dẫn; Luật Chuyển đổi số số 148/2025/QH15 (hiệu lực 01/7/2026, thay Luật Công nghệ thông tin năm 2006).
- **Sắp thay đổi:** Quy định 366-QĐ/TW của Bộ Chính trị về kiểm điểm, đánh giá, xếp loại chất lượng vẫn là căn cứ cho năm 2026, nhưng sẽ được thay bằng Quy định 227-QĐ/TW ngày 19/10/2026 từ 01/01/2027.
:::

## 3.1. Chủ trương, định hướng: được khuyến khích, nhưng có khuôn khổ

### 3.1.1. Nghị quyết 57-NQ/TW và Chương trình hành động của Chính phủ

Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia là căn cứ chính trị cao nhất cho mọi việc kể trong cuốn sách này (Tập 1 đã giới thiệu ở mục 1.1). Nghị quyết xác định đây là "đột phá quan trọng hàng đầu"; trong các mục tiêu đến năm 2030 có: Việt Nam thuộc nhóm 3 nước dẫn đầu Đông Nam Á về nghiên cứu và phát triển trí tuệ nhân tạo; kinh tế số đạt tối thiểu 30% GDP; tỷ lệ người dân và doanh nghiệp sử dụng dịch vụ công trực tuyến trên 80%. Chính phủ cụ thể hóa bằng Nghị quyết 03/NQ-CP ngày 09/01/2025 ban hành Chương trình hành động, được sửa đổi, bổ sung, cập nhật bằng Nghị quyết 71/NQ-CP ngày 01/4/2025.

Điều có ý nghĩa nhất với người làm tham mưu là tinh thần chấp nhận rủi ro, chấp nhận đầu tư mạo hiểm và độ trễ trong nghiên cứu; có cơ chế thử nghiệm có kiểm soát; xóa bỏ tư duy "không quản được thì cấm". Nhưng "chấp nhận rủi ro" không phải tấm giấy miễn trách nhiệm phát cho mọi người; nó được thực hiện theo cơ chế luật định (mục 3.6.3). Hãy hình dung một cuộc diễn tập phòng cháy: có kịch bản được duyệt, người chỉ huy, khu vực khoanh vùng; được phép thử không có nghĩa ai muốn đốt lửa ở đâu cũng được.

### 3.1.2. Chiến lược quốc gia về trí tuệ nhân tạo năm 2026

Ngày 28/8/2026, Thủ tướng Chính phủ ban hành Quyết định 1671/QĐ-TTg phê duyệt Chiến lược quốc gia về trí tuệ nhân tạo đến năm 2030, tầm nhìn đến năm 2045, có hiệu lực từ ngày ký, thay thế Quyết định 127/QĐ-TTg năm 2021 mà Tập 1 dẫn. Trọng tâm chuyển từ "chủ yếu ứng dụng AI" sang "nghiên cứu, phát triển AI và chuyển đổi toàn diện quốc gia bằng AI"; mục tiêu đến năm 2030 có tối thiểu 5 nền tảng AI dùng chung quốc gia. Với khu vực công, theo các bản tin chính thống, có chỉ tiêu 100% cán bộ, công chức, viên chức sử dụng nền tảng AI công vụ hằng tuần và 60% quyết định chỉ đạo, điều hành được hỗ trợ bởi dữ liệu và AI.

Hàm ý kỹ thuật: khi nền tảng AI dùng chung quốc gia sẵn sàng, cơ quan nên ưu tiên dùng, nên ứng dụng tự làm không được "trói chặt" vào một nhà cung cấp. Trong hệ thống của Văn phòng, mọi lời gọi AI đi qua một tệp duy nhất ở máy chủ và đổi được nhà cung cấp hay địa chỉ dịch vụ bằng cấu hình. Giống như cơ quan có một bộ phận văn thư đầu mối: muốn đổi đơn vị chuyển phát thì chỉ sửa một hợp đồng, không phải dặn lại từng phòng.

### 3.1.3. Phong trào "Bình dân học vụ số" và yêu cầu về kỹ năng số, kỹ năng AI

Phong trào "Bình dân học vụ số" được triển khai theo Kế hoạch 01-KH/BCĐTW ngày 21/3/2025. Với cán bộ, công chức, văn bản tác động trực tiếp nhất là Chỉ thị 14/CT-TTg ngày 22/4/2026 của Thủ tướng Chính phủ về đẩy mạnh bồi dưỡng và đánh giá kiến thức, kỹ năng số: đến hết năm 2026, 100% cán bộ, công chức, viên chức có kiến thức, kỹ năng số và sử dụng tốt các nền tảng, dịch vụ số phục vụ công việc; tự học, tự bồi dưỡng là nhiệm vụ thường xuyên; người giữ chức vụ lãnh đạo, quản lý phải gương mẫu. Nền tảng "Bình dân học vụ số" do Bộ Công an vận hành, tích hợp với VNeID; cán bộ học trên đó và được xác nhận hoàn thành. Quyết định 1528/QĐ-TTg ngày 11/8/2026 phê duyệt Chương trình quốc gia phát triển nhân lực trí tuệ nhân tạo, đào tạo theo 3 tầng (phổ cập, ứng dụng, chuyên sâu), mục tiêu đến năm 2030 có ít nhất 90% cán bộ, công chức, viên chức được bồi dưỡng kỹ năng sử dụng AI an toàn, hiệu quả, có trách nhiệm.

Ở tỉnh ta, ngày 7/5/2026, Thường trực HĐND tỉnh đã tổ chức tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng. Cuốn sách này nên được hiểu là học liệu tự học bổ trợ ở tầng "phổ cập" và "ứng dụng"; muốn được xác nhận hoàn thành, cán bộ vẫn học và làm bài đánh giá trên nền tảng chung.

### 3.1.4. Các văn bản hướng dẫn cách ứng xử khi dùng AI

Các văn bản dưới đây không phải văn bản quy phạm pháp luật, nhưng là chỉ dẫn của cơ quan có thẩm quyền, rất gần với thao tác hằng ngày, mà cán bộ, đảng viên phải nghiêm túc thực hiện.

| Văn bản | Điều cán bộ cần nhớ |
|---|---|
| Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ (dùng chatbot AI trong công việc) | Không đưa lên chatbot tài liệu bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; không đặt tên, mật khẩu tài khoản AI trùng tài khoản công vụ; hủy tài khoản khi cán bộ nghỉ việc, chuyển công tác; kiểm tra kết quả trước khi dùng |
| Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 (AI hỗ trợ rà soát văn bản quy phạm pháp luật) | AI chỉ phân tích, tổng hợp, cảnh báo, gợi ý; không dùng AI tự động đưa ra kết luận pháp lý; kết quả phải đối chiếu được với căn cứ; cán bộ kiểm tra, xác nhận trước khi dùng |
| Hướng dẫn kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng | "Hỗ trợ, không thay thế"; sản phẩm AI phải được kiểm chứng, người dùng chịu trách nhiệm; ưu tiên giải pháp do Việt Nam phát triển khi xử lý dữ liệu nội bộ, nhạy cảm |
| Quy định 207-QĐ/TW ngày 26/7/2026 về những điều đảng viên không được làm | Điều 5 bổ sung: không dùng Internet, mạng xã hội, nền tảng số, trí tuệ nhân tạo để tạo lập, phát tán nội dung sai sự thật |
| Quyết định 495-QĐ/TW ngày 20/10/2026 (cải cách hành chính trong các cơ quan đảng 2026–2030) | Dữ liệu là nền tảng quản trị, AI là công cụ hỗ trợ; dùng AI phải có kiểm soát |

Văn bản của khối nhà nước lẫn khối Đảng đều ràng buộc trực tiếp cán bộ, đảng viên Văn phòng, và chúng nói cùng một ý.

::: {.ghinho}
**Ghi nhớ: bốn điểm chung của mọi văn bản hướng dẫn về AI**

1. AI hỗ trợ, không thay thế thẩm quyền và trách nhiệm của con người.
2. Mọi kết quả của AI phải được kiểm chứng; người dùng chịu trách nhiệm về sản phẩm cuối cùng.
3. Không đưa tài liệu mật, dữ liệu cá nhân, tài liệu nội bộ lên nền tảng AI công cộng.
4. Được khuyến khích thử nghiệm, nhưng phải có kiểm soát, theo cơ chế luật định.
:::

## 3.2. Luật chuyên ngành về AI và công nghệ số

### 3.2.1. Luật Trí tuệ nhân tạo: những điều cốt lõi

Luật Trí tuệ nhân tạo số 134/2025/QH15 được Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026 (trừ các nội dung liên quan đến Điều 35 về quy định chuyển tiếp), gồm 8 chương, 35 điều; Tập 1 viết khi luật này chưa có. Với người tự làm ứng dụng, có năm điểm cốt lõi.

**Một, con người làm trung tâm.** Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người"; Điều 4 cũng yêu cầu duy trì sự kiểm soát và khả năng can thiệp của con người đối với quyết định, hành vi của hệ thống AI. Đây chính là nguyên tắc con người trong vòng lặp mà Tập 1 (mục 7.5) đã nêu: các phân hệ của Văn phòng chỉ dùng Mô hình 1 "AI đề xuất, con người duyệt" hoặc Mô hình 2 "AI hỗ trợ, con người làm", không bao giờ dùng Mô hình 3 "AI tự động hoàn toàn".

**Hai, Nhà nước ưu tiên ứng dụng AI trong cơ quan nhà nước.** Khoản 3 Điều 5 ưu tiên ứng dụng AI trong quản lý, điều hành, cung cấp dịch vụ công và hỗ trợ ra quyết định của cơ quan nhà nước. Đây là câu trả lời cho câu hỏi "cơ quan nhà nước có được dùng AI không".

**Ba, quản lý theo mức độ rủi ro.** Khoản 1 Điều 6 yêu cầu ứng dụng AI tuân thủ nguyên tắc quản lý rủi ro; Luật quy định phân loại hệ thống AI (Điều 9), hồ sơ, thông báo phân loại (Điều 10), đánh giá sự phù hợp và quản lý hệ thống rủi ro cao (Điều 13, Điều 14). Giống phân loại công trình xây dựng: nhà kho một tầng và cầu lớn không cùng một thủ tục.

**Bốn, các hành vi bị nghiêm cấm.** Khoản 2 Điều 7 cấm phát triển, cung cấp, triển khai, sử dụng AI để lừa dối, thao túng con người, tạo nội dung giả mạo người thật, sự kiện thật, hoặc lợi dụng điểm yếu của các nhóm dễ bị tổn thương.

**Năm, minh bạch và gắn nhãn.** Điều 11: khoản 3 về thông báo nội dung do AI tạo ra hoặc chỉnh sửa có thể gây nhầm lẫn; khoản 4 về gắn nhãn nội dung âm thanh, hình ảnh, video mô phỏng người thật. Từ 01/3/2026, căn cứ cấp luật về AI là Luật này (xem thêm mục 3.2.4).

### 3.2.2. Tôi là ai trong chuỗi hệ thống AI?

Điều 3 của Luật phân biệt bốn vai: nhà phát triển (trực tiếp thiết kế, huấn luyện hoặc tinh chỉnh mô hình), nhà cung cấp (đưa hệ thống AI ra thị trường hoặc vào sử dụng dưới tên, nhãn hiệu của mình), bên triển khai (dùng hệ thống AI trong phạm vi kiểm soát của mình) và người sử dụng (trực tiếp tương tác với hệ thống hoặc dùng kết quả đầu ra). Bảng dưới là cách hiểu của tôi; gặp tình huống ranh giới, đồng chí nên đọc nguyên văn Điều 3 và hỏi bộ phận pháp chế.

| Tình huống | Vai (cách hiểu) | Việc nên làm |
|---|---|---|
| Dùng trợ lý AI trò chuyện soạn nháp, tóm tắt | Người sử dụng | Kiểm chứng, chịu trách nhiệm kết quả |
| Cơ quan đưa chatbot vào phục vụ cán bộ, đại biểu | Bên triển khai | Phân loại rủi ro, minh bạch, giám sát |
| Tự viết ứng dụng gọi AI cho đồng nghiệp dùng | Có thể vừa là nhà cung cấp vừa là bên triển khai | Lập hồ sơ tự phân loại, gắn nhãn, đặt trần |
| Tự huấn luyện, tinh chỉnh mô hình | Nhà phát triển | Ngoài tầm cán bộ tự làm |

Khi dùng tác tử AI lập trình để viết mã, tôi là người sử dụng. Nhưng phân hệ Trợ lý AI nghiệp vụ dân cử, khung chat Người hướng dẫn trên Trang chủ và bot Telegram, Zalo đều gọi AI để trả lời người khác; ở đó cơ quan là bên triển khai và phải trả lời được: hệ thống dùng làm gì, dữ liệu nào đi vào, con người can thiệp ở đâu, người dùng có biết mình đang đọc câu trả lời của máy không. Vì câu hỏi cuối ấy, câu trả lời do AI sinh ra trong khung chat Người hướng dẫn mang nhãn "Trả lời bằng AI", tách khỏi câu trả lời soạn sẵn theo kịch bản (Chương 13).

### 3.2.3. Văn bản hướng dẫn: Nghị định 142, Quyết định 33 và Khung đạo đức

**Nghị định 142/2026/NĐ-CP** ngày 30/4/2026 (hiệu lực từ 01/5/2026) quy định chi tiết Luật Trí tuệ nhân tạo, áp dụng cho cả nhà cung cấp, bên triển khai, người sử dụng. Ba điểm thực hành: phân loại rủi ro phải làm **trước khi** đưa hệ thống vào sử dụng; chưa xác định được mức rủi ro thì nhà cung cấp đề nghị Bộ Khoa học và Công nghệ hướng dẫn; khi sửa đổi, tích hợp hoặc đổi chức năng, mục đích làm phát sinh rủi ro mới hoặc cao hơn thì phải phân loại lại. Nghị định còn có nội dung về thử nghiệm có kiểm soát và về thông báo, gắn nhãn nội dung do AI tạo ra; làm sản phẩm truyền thông có dùng AI thì phải đọc nguyên văn phần này (Chương 16, mục 16.7).

**Quyết định 33/2026/QĐ-TTg** ban hành Danh mục hệ thống trí tuệ nhân tạo có rủi ro cao, hiệu lực từ 15/8/2026. Theo Bộ Tư pháp, danh mục thuộc 6 lĩnh vực: giáo dục; dân tộc và tôn giáo; y tế; ngân hàng; tố tụng; giao thông vận tải. Phần lớn ứng dụng nội bộ của Văn phòng (soạn thảo, tóm tắt, tổng hợp kiến nghị cử tri, theo dõi KPI) có vẻ không thuộc danh mục; nhưng ứng dụng phục vụ giám sát về dân tộc, giáo dục, y tế mà tự động chấm điểm, xếp hạng hồ sơ thụ hưởng chính sách thì phải đọc kỹ nguyên văn danh mục trước khi làm.

**Thông tư 05/2026/TT-BKHCN** ngày 10/3/2026 (hiệu lực cùng ngày) quy định Khung đạo đức trí tuệ nhân tạo quốc gia, bắt buộc với tổ chức, cá nhân phát triển, cung cấp, triển khai, sử dụng AI phục vụ quản lý nhà nước, dịch vụ công; Văn phòng dùng AI trong công vụ nên thuộc phạm vi này. Khung giữ nguyên tắc con người có thẩm quyền quyết định cuối cùng.

::: {.thuchanh}
**Thực hành: lập phiếu tự phân loại một trang trước khi cho người khác dùng ứng dụng có AI**

1. Ghi tên ứng dụng, mục đích, ai được dùng (cán bộ, đại biểu, khách vô danh).
2. Liệt kê dữ liệu đi vào, xếp theo 4 cấp của Tập 1 (mục 7.1–7.2); ghi rõ dữ liệu nào được gửi cho AI. Không chắc thì chọn cấp cao hơn.
3. Ghi nhà cung cấp AI, nơi đặt máy chủ, có qua dịch vụ trung gian hay không.
4. Trả lời: kết quả AI có làm căn cứ cho quyết định ảnh hưởng đến quyền, nghĩa vụ của ai không?
5. Đối chiếu với 6 lĩnh vực của danh mục rủi ro cao; có liên quan thì dừng lại, hỏi bộ phận pháp chế.
6. Ghi con người duyệt, sửa, ghi đè ở bước nào và nhãn minh bạch hiển thị ra sao.
7. Ghi người chịu trách nhiệm, ngày lập; lưu phiếu cùng bộ nhớ dự án và làm lại mỗi khi đổi chức năng hay mục đích.
:::

::: {.lenhmau}
**Câu lệnh mẫu 3.1 — Soạn nháp phiếu tự phân loại rủi ro**

Viết theo khung VAI-BỐI-VIỆC-DẠNG-RÀNG (Tập 1, mục 3.2), dùng với trợ lý AI trò chuyện; chỉ mô tả ứng dụng bằng lời, không dán dữ liệu thật.

```text
VAI: chuyên viên pháp chế hỗ trợ cán bộ không chuyên luật.
BỐI CẢNH: tôi làm một ứng dụng nội bộ tên [TÊN], mục đích [MÔ TẢ],
người dùng là [ĐỐI TƯỢNG], dữ liệu đầu vào gồm [LIỆT KÊ LOẠI DỮ LIỆU],
ứng dụng gọi AI của [NHÀ CUNG CẤP] để [VIỆC AI LÀM].
VIỆC: soạn nháp phiếu tự phân loại rủi ro theo 7 mục: (1) mục đích;
(2) người dùng; (3) dữ liệu và cấp dữ liệu theo 4 cấp: Công khai, Nội
bộ, Hạn chế tiếp cận, Bí mật nhà nước; (4) nhà cung cấp AI và nơi xử
lý dữ liệu; (5) kết quả AI có tác động đến quyền, nghĩa vụ của ai
không; (6) điểm con người duyệt, sửa, ghi đè; (7) nhãn minh bạch.
DẠNG: bảng 2 cột (Mục – Nội dung), sau đó là danh sách câu hỏi mở.
RÀNG BUỘC: KHÔNG tự ghi số Điều, khoản nào; chỗ cần căn cứ thì ghi
"[CẦN TRA NGUYÊN VĂN]". Dữ liệu nào chưa rõ cấp thì xếp cấp cao hơn.
Thông tin chưa đủ để kết luận thì ghi "CHƯA ĐỦ THÔNG TIN" và nêu câu
hỏi cần làm rõ.
```
:::

### 3.2.4. Luật Công nghiệp công nghệ số và Luật Chuyển đổi số

Luật Công nghiệp công nghệ số số 71/2025/QH15 (hiệu lực từ 01/01/2026) là đạo luật đầu tiên có một chương riêng về AI (Chương IV, Điều 41–45). Chương này bị bãi bỏ toàn bộ từ 01/3/2026, nên không lấy Điều 44 Luật 71 làm căn cứ hiện hành về gắn nhãn nội dung AI; các phần còn lại vẫn còn hiệu lực.

Luật Chuyển đổi số số 148/2025/QH15 (hiệu lực từ 01/7/2026) thay thế Luật Công nghệ thông tin năm 2006; đây là luật khung, còn dữ liệu, giao dịch điện tử, an ninh mạng, AI vẫn theo luật chuyên ngành. Văn bản thi hành đáng chú ý là Quyết định 1132/QĐ-TTg ngày 24/6/2026 ban hành tiêu chí và Danh mục nền tảng số dùng chung quốc gia trong các cơ quan thuộc hệ thống chính trị.

Hệ quả thực hành: trước khi tự làm, hãy hỏi "đã có nền tảng dùng chung nào làm việc này chưa?". Văn phòng Quốc hội cũng đang thí điểm nền tảng số dùng chung cho cơ quan dân cử địa phương, như phòng họp không giấy và phần mềm dân nguyện. Nếu đã có, ứng dụng tự làm chỉ nên là công cụ thử nghiệm hoặc bổ trợ phần còn thiếu, với dữ liệu kết nối, chia sẻ được, đừng thành "ốc đảo" (Chương 17, mục 17.8).

## 3.3. Dữ liệu và dữ liệu cá nhân

### 3.3.1. Luật Dữ liệu: dữ liệu là tài sản phải được phân loại

Luật Dữ liệu số 60/2024/QH15 có hiệu lực từ 01/7/2025, cùng ngày với Nghị định 165/2025/NĐ-CP quy định chi tiết; Luật đã được sửa đổi, bổ sung nên khi trích nên dùng văn bản hợp nhất mới nhất của Văn phòng Quốc hội. Luật đưa ra khái niệm dữ liệu quan trọng (có thể tác động tới quốc phòng, an ninh, đối ngoại, kinh tế vĩ mô, ổn định xã hội, sức khỏe cộng đồng) và dữ liệu cốt lõi, theo danh mục do Thủ tướng ban hành.

Luật Dữ liệu đặt ra cho người tự làm ứng dụng hai thói quen. Thứ nhất, dữ liệu cần lấy từ cơ sở dữ liệu quốc gia, chuyên ngành thì khai thác qua kết nối, chia sẻ chính thức, không tự sao chép về. Thứ hai, mỗi khối dữ liệu phải rõ nguồn gốc và người chịu trách nhiệm. Trong hệ thống của Văn phòng, bản đồ dữ liệu được lập thành bảng: mỗi "dòng" dữ liệu là gì, ai được đọc, ai được ghi, giống sổ đăng ký kho lưu trữ ghi hồ sơ nào để ở ngăn nào, ai giữ chìa khóa.

### 3.3.2. Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (thông qua ngày 26/6/2025, hiệu lực từ 01/01/2026, 05 chương, 39 điều) nâng các quy định trước đây ở Nghị định 13/2023/NĐ-CP, văn bản Tập 1 dẫn ở mục 7.1, lên thành luật. Luật chia dữ liệu cá nhân thành dữ liệu cơ bản và dữ liệu nhạy cảm, và có một điều riêng về bảo vệ dữ liệu cá nhân trong dữ liệu lớn, trí tuệ nhân tạo, điện toán đám mây: chỉ xử lý đúng mục đích, trong phạm vi cần thiết, có biện pháp bảo mật.

Nghị định 356/2025/NĐ-CP ngày 31/12/2025, có hiệu lực từ 01/01/2026, quy định chi tiết Luật và thay Nghị định 13/2023/NĐ-CP (cẩn thận: Nghị định 356/2026/NĐ-CP là một văn bản khác, không liên quan đến dữ liệu cá nhân). Hai danh mục nên in ra dán cạnh bàn làm việc:

- **Điều 3 (dữ liệu cá nhân cơ bản):** họ, chữ đệm, tên; ngày sinh; giới tính; nơi sinh, nơi thường trú, quê quán, địa chỉ liên hệ; hình ảnh cá nhân; số điện thoại, số định danh cá nhân; tình trạng hôn nhân; quan hệ gia đình…
- **Khoản 1 Điều 4 (dữ liệu cá nhân nhạy cảm):** quan điểm chính trị; tôn giáo, tín ngưỡng; tình trạng sức khỏe; dữ liệu sinh trắc học, di truyền; đời sống riêng tư; dữ liệu về tội phạm, vi phạm pháp luật; vị trí định vị; tài khoản ngân hàng; tên đăng nhập, mật khẩu tài khoản định danh điện tử…

Việc xử phạt nằm ở Nghị định 330/2026/NĐ-CP ngày 19/8/2026 (hiệu lực từ ngày ký) về xử phạt vi phạm hành chính trong lĩnh vực an ninh mạng và bảo vệ dữ liệu cá nhân. Một ví dụ dễ gặp ở người tự làm biểu mẫu khảo sát: tự coi sự im lặng hoặc không phản hồi của chủ thể dữ liệu là đồng ý để thu thập, xử lý dữ liệu bị phạt từ 50 đến 70 triệu đồng. Ô "đồng ý" đánh dấu sẵn chính là kiểu lỗi đó.

### 3.3.3. Áp vào ứng dụng của cơ quan dân cử

Luật chia dữ liệu cá nhân thành cơ bản và nhạy cảm; Tập 1 (mục 7.1–7.2, Bảng 7.1) chia mọi dữ liệu thành 4 cấp để quyết định có được đưa lên AI hay không. Khi tự làm ứng dụng, tôi dùng cả hai cách chia:

- **Cấp 1 — Công khai:** dùng được với mọi AI. Trong ứng dụng, đây là phần khách không đăng nhập cũng xem được.
- **Cấp 2 — Nội bộ:** chỉ dùng AI có cam kết bảo mật cấp doanh nghiệp, sau khi đã ẩn danh; trong ứng dụng, phải đăng nhập mới xem. Công văn 557/BKHCN-CĐSQG còn chặt hơn: không đưa tài liệu nội bộ lên chatbot AI công cộng.
- **Cấp 3 — Hạn chế tiếp cận** (có dữ liệu cá nhân, nhất là dữ liệu nhạy cảm): chỉ dùng AI có máy chủ trong nước hoặc AI tự triển khai trên hạ tầng cơ quan; trong ứng dụng, chỉ Quản trị đọc và không đưa vào lời dẫn gửi AI nước ngoài.
- **Cấp 4 — Bí mật nhà nước:** tuyệt đối không dùng AI nước ngoài; theo Luật số 117/2025/QH15, không soạn thảo, lưu giữ trên máy tính, thiết bị đang kết nối Internet, nên càng không đưa vào ứng dụng chạy trên đám mây (mục 3.4).

Khi không chắc một dữ liệu thuộc cấp nào, chọn cấp cao hơn. Đối chiếu với hệ thống của Văn phòng, tôi giật mình nhận ra: mẫu Sơ yếu lý lịch 2C mà phân hệ Quản lý cán bộ số hóa có cả mục "Tôn giáo" và "Tình trạng sức khỏe", tức hai loại dữ liệu nhạy cảm, bên cạnh ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình.

| Dữ liệu | Nhóm, cấp | Cách xử lý trong hệ thống |
|---|---|---|
| Hồ sơ 2C | Cơ bản và nhạy cảm; Cấp 3 | Chỉ tài khoản Quản trị đọc, ghi; bot không nạp số căn cước, bảo hiểm, gia đình |
| Danh bạ 111 số điện thoại | Cơ bản; Cấp 3 | Không nằm trong kho mã; Quản trị tự nhập; bot chỉ trả số của đúng người được hỏi |
| Kiến nghị có tên cử tri | Cơ bản; Cấp 3 | Dòng dữ liệu cố ý không mở đọc công khai |
| Đơn khiếu nại, tố cáo | Có thể nhạy cảm; Cấp 3 | Không đưa lên AI công cộng; chỉ dùng AI với bản đã ẩn danh |
| Địa chỉ IP của khách | Có thể nhận diện | Chỉ lưu chuỗi băm, không lưu IP gốc |

Với đơn thư, còn có quy định về bảo vệ người tố cáo, trong đó có giữ bí mật danh tính: tuyệt đối không dán đơn có danh tính người khiếu nại, tố cáo vào bất kỳ trợ lý AI công cộng nào (Chương 16, mục 16.4).

Tôi cũng phải nói thật một điểm chưa trọn vẹn. Bot Telegram, Zalo của Văn phòng nạp họ tên, chức vụ và điểm đánh giá vào lời dẫn gửi nhà cung cấp AI để trả lời câu hỏi. Ở bản demo, danh sách người là thật còn điểm số là dữ liệu mô phỏng. Khi đã có điểm thật, đó là dữ liệu Cấp 3; gửi ra máy chủ nước ngoài là xử lý dữ liệu cá nhân qua bên thứ ba, có thể thuộc trường hợp chuyển dữ liệu ra nước ngoài, nên phải dừng lại và đánh giá trước. Nghị định 356 có biểu mẫu hồ sơ đánh giá tác động xử lý dữ liệu cá nhân và chuyển dữ liệu xuyên biên giới; đó là việc của giai đoạn chính thức hóa (Chương 20).

::: {.lenhmau}
**Câu lệnh mẫu 3.2 — Rà soát trường dữ liệu theo pháp luật về dữ liệu cá nhân**

Chỉ đưa TÊN trường (ví dụ "Ngày sinh", "Tôn giáo"), không bao giờ đưa giá trị thật.

```text
VAI: người rà soát quyền riêng tư cho một ứng dụng nội bộ.
BỐI CẢNH: dưới đây là danh sách tên các trường dữ liệu của ứng dụng
[TÊN] (KHÔNG có dữ liệu thật): [LIỆT KÊ]. Kèm theo là danh mục dữ liệu
cá nhân cơ bản và nhạy cảm tôi chép từ Điều 3 và khoản 1 Điều 4 Nghị
định 356/2025/NĐ-CP: [DÁN DANH MỤC].
VIỆC: với từng trường, cho biết (1) có phải dữ liệu cá nhân không;
(2) thuộc nhóm cơ bản hay nhạy cảm theo danh mục đã dán; (3) có thật
sự cần cho mục đích [MỤC ĐÍCH] không; (4) ai nên được đọc.
DẠNG: bảng ngắn gọn, mỗi trường một dòng; cuối bảng đề xuất các
trường nên bỏ.
RÀNG BUỘC: chỉ dựa vào danh mục tôi dán, không dựa trí nhớ. Trường
nào không chắc thì ghi "CẦN HỎI PHÁP CHẾ".
```
:::

## 3.4. Bí mật nhà nước, an ninh mạng, an toàn hệ thống thông tin theo cấp độ

### 3.4.1. Luật Bảo vệ bí mật nhà nước năm 2025: lằn ranh đỏ

Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026, 5 chương, 28 điều) thay Luật số 29/2018/QH14 mà Tập 1 dẫn; theo Điều 27, luật cũ hết hiệu lực từ cùng ngày. Luật được hướng dẫn bởi Nghị định 63/2026/NĐ-CP ngày 28/02/2026. Hai điểm liên quan trực tiếp đến AI và ứng dụng tự làm:

- Điều 2 bổ sung khái niệm **mạng LAN độc lập**: mạng máy tính cục bộ trong một trụ sở, không kết nối Internet, mạng viễn thông hay mạng khác có kết nối ra ngoài, có biện pháp chống kết nối, tấn công trái phép. Hãy hình dung một phòng kín chỉ có cửa trong, không có cửa ra phố.
- Điều 5 quy định 10 hành vi bị nghiêm cấm, trong đó có soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối mạng máy tính (trừ mạng LAN độc lập), Internet hoặc mạng viễn thông, trừ trường hợp theo pháp luật về cơ yếu. Khoản 10 Điều 5 cấm **sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước**.

Chỉ thị 32/CT-TTg ngày 21/10/2025 đề cao trách nhiệm người đứng đầu và, theo bản tóm tắt chính thống, yêu cầu kiểm định an toàn thiết bị, phần mềm trước khi đưa vào sử dụng, không để lộ bí mật khi số hóa tài liệu. Bộ luật Hình sự có tội cố ý làm lộ (Điều 337) và vô ý làm lộ bí mật nhà nước (Điều 338). Ở tỉnh, quy chế hiện hành là Quyết định 05/2022/QĐ-UBND ngày 09/02/2022; tháng 8/2026 Công an tỉnh đã đăng dự thảo quy chế mới, nên cần tra xem quy chế mới đã ban hành chưa.

::: {.canhbao}
**Cảnh báo: những việc tuyệt đối không làm với tài liệu mật**

- Không dán, tải tài liệu, dự thảo có độ mật lên ChatGPT, Gemini, Claude, Gemini Notebook (trước đây là NotebookLM) hay bất kỳ nền tảng AI công cộng nào, kể cả chỉ để "tóm tắt giúp".
- Không đưa tài liệu mật vào ứng dụng tự làm chạy trên dịch vụ đám mây (như Vercel, Supabase, GitHub). Tài liệu mật chỉ xử lý trên máy tính không kết nối mạng hoặc mạng LAN độc lập, theo quy chế của cơ quan.
- Phiên họp có nội dung bí mật nhà nước: không dùng ứng dụng ghi âm, chuyển giọng nói thành văn bản hay tóm tắt cuộc họp bằng AI trực tuyến; theo đúng quy chế của cơ quan về thiết bị trong phòng họp.
- Pháp luật không cấm dùng AI nói chung. Điều bị cấm là đưa bí mật nhà nước lên và dùng AI để xâm phạm bí mật nhà nước. Ngược lại, khoản 1 Điều 5 cũng cấm xác định là bí mật nhà nước đối với thông tin không thuộc danh mục, tức không đóng dấu mật tùy tiện.
:::

### 3.4.2. Luật An ninh mạng năm 2025 và cấp độ hệ thống thông tin

Luật An ninh mạng số 116/2025/QH15 (thông qua ngày 10/12/2025, hiệu lực từ 01/7/2026, 8 chương, 58 điều) hợp nhất Luật An ninh mạng năm 2018 và Luật An toàn thông tin mạng năm 2015, hai luật Tập 1 dẫn ở mục 7.1 và 7.3. Từ 01/7/2026, không dẫn hai luật cũ như luật đang có hiệu lực.

Văn bản quan trọng nhất cho người tự làm ứng dụng là **Nghị định 331/2026/NĐ-CP** ngày 19/8/2026 về bảo vệ an ninh mạng đối với hệ thống thông tin, quy định tiêu chí xác định cấp độ từ 1 đến 5 và biện pháp bảo vệ theo từng cấp. "Cấp độ hệ thống" khác "cấp dữ liệu" của Tập 1: một bên xếp hạng cả tòa nhà, một bên xếp hạng từng tập hồ sơ cất trong đó. Cấp độ 1 gồm hệ thống phục vụ nội bộ và chỉ xử lý "thông tin công cộng"; cấp độ 2 có nhóm hệ thống phục vụ nội bộ, có xử lý thông tin cá nhân nhưng không xử lý bí mật nhà nước; cấp độ 3 có tiêu chí hệ thống xử lý thông tin bí mật nhà nước, cùng nhiều tiêu chí khác. Hệ thống đáp ứng tiêu chí của nhiều cấp thì áp cấp cao nhất, và không được khoanh phạm vi hệ thống một cách hình thức để giảm yêu cầu. Mỗi hệ thống có một chủ quản duy nhất.

Nghị định 85/2016/NĐ-CP về an toàn hệ thống thông tin theo cấp độ vẫn được Nghị định 331 nhắc tới ở quy định chuyển tiếp; các yêu cầu quen thuộc (tường lửa, sao lưu, nhật ký) vẫn là thực hành tốt. Nghị định 333/2026/NĐ-CP có quy định nhật ký hệ thống phải lưu tối thiểu 12 tháng, một chuẩn tham chiếu tốt cho ứng dụng nội bộ.

Bảng dưới chỉ để tự soi, không thay việc thẩm định của đơn vị chuyên trách.

| Ứng dụng | Đặc điểm dữ liệu | Định hướng |
|---|---|---|
| Bản tin pháp luật | Chỉ tin công khai | Gần với cấp độ 1 |
| Phân hệ có tài khoản, hồ sơ cán bộ, danh bạ | Có thông tin cá nhân | Cấp độ 2 trở lên; lập hồ sơ đề xuất trước khi dùng chính thức |
| Bất cứ thứ gì chạm tới bí mật nhà nước | Bí mật nhà nước | Cấp độ 3 trở lên; không phải việc tự làm trên đám mây công cộng |

Kho mã của hệ thống đã ghi sẵn lời nhắc: khi dùng thật với dữ liệu thật thì chuyển sang máy chủ nội bộ cơ quan; các chính sách cho đọc công khai chỉ dành cho bản demo. Cơ sở dữ liệu đang đặt ở khu vực Singapore; gói miễn phí của dịch vụ cơ sở dữ liệu tạm dừng dự án sau 1 tuần không hoạt động; gói miễn phí của dịch vụ triển khai dành cho mục đích cá nhân, phi thương mại (điều khoản tham khảo tại thời điểm viết, 10/2026). Chấp nhận được cho bản thử nghiệm với dữ liệu mô phỏng, nhưng không phải hạ tầng của hệ thống chính thức (Chương 20).

## 3.5. Giao dịch điện tử, văn thư, lưu trữ

Luật Giao dịch điện tử số 20/2023/QH15 (hiệu lực từ 01/7/2024) quy định giá trị pháp lý của thông điệp dữ liệu, của chữ ký điện tử (Điều 23), có quy định về chữ ký số chuyên dùng công vụ và về giao dịch điện tử của cơ quan nhà nước. Luật đã được sửa đổi, bổ sung, nên khi trích cần tra văn bản hợp nhất mới nhất.

Người tự làm ứng dụng hay quên một điều: **tệp do phần mềm xuất ra không phải là văn bản đã ban hành**. Phiếu đánh giá Word, biên bản biểu quyết xuất từ bản demo, công văn do Trợ lý AI soạn chỉ là bản nháp, chỉ có giá trị khi người có thẩm quyền ký và ban hành theo đúng quy trình văn thư. Không bao giờ cấu hình để bot hay AI tự động dùng chữ ký số của cá nhân hoặc cơ quan.

Về thể thức, Nghị định 30/2020/NĐ-CP ngày 05/3/2020 về công tác văn thư vẫn là căn cứ các cơ quan viện dẫn trong năm 2026; ứng dụng xuất Word phải kiểm quốc hiệu, tiêu ngữ, tên cơ quan, số ký hiệu, nơi nhận đúng mẫu. Văn bản của tổ chức Đảng theo hướng dẫn thể thức riêng của Đảng. Phân hệ Kiểm điểm từng in nhầm tên cơ quan hành chính ở đầu bản tự đánh giá; đã sửa thành "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH" vì đó là văn bản của Đảng (Chương 10, mục 10.4).

Về lưu trữ, cơ sở dữ liệu trên dịch vụ đám mây miễn phí hay kho mã công khai không phải là "lưu trữ cơ quan". Luật Lưu trữ số 33/2024/QH15 (hiệu lực từ 01/7/2025) có quy định riêng về tài liệu lưu trữ số; bản lưu hợp lệ là bản nằm trong hệ thống văn thư, lưu trữ chính thức. Ứng dụng tự làm muốn kết quả được dùng làm căn cứ thì phải bảo đảm toàn vẹn, truy xuất được, có nhật ký sửa đổi và xuất được để nộp lưu.

## 3.6. Sở hữu trí tuệ, mã nguồn mở, sáng kiến

### 3.6.1. Ai có quyền với mã nguồn viết cùng AI?

Luật Sở hữu trí tuệ số 50/2005/QH11 đã được sửa đổi nhiều lần, gần nhất bởi Luật số 131/2025/QH15 (hiệu lực 01/4/2026). Bốn quy định cần biết:

- Khoản 1 Điều 22: chương trình máy tính được bảo hộ như tác phẩm văn học, dù ở dạng mã nguồn hay mã máy; Điều 59 không bảo hộ chương trình máy tính với danh nghĩa sáng chế. Phần mềm vì thế chủ yếu được bảo hộ theo quyền tác giả.
- Khoản 1 Điều 39 (câu chữ năm 2005, cần đối chiếu văn bản hợp nhất mới nhất): tổ chức giao nhiệm vụ sáng tạo cho tác giả thuộc tổ chức mình là chủ sở hữu quyền tài sản, trừ trường hợp có thỏa thuận khác.
- Khoản 5 Điều 6 (bổ sung năm 2025) giao Chính phủ quy định việc xác lập quyền khi đối tượng được tạo ra có sử dụng AI. Nghị định 134/2026/NĐ-CP (hiệu lực 09/4/2026) bổ sung Điều 5a vào Nghị định 17/2023/NĐ-CP: quyền tác giả với sản phẩm có sự hỗ trợ của AI chỉ phát sinh khi con người có đóng góp sáng tạo đáng kể, mang tính quyết định và giữ vai trò chủ đạo.
- Khoản 5 Điều 7 (bổ sung năm 2025) cho phép dùng văn bản, dữ liệu đã công bố hợp pháp để nghiên cứu, huấn luyện AI nếu không ảnh hưởng bất hợp lý đến quyền tác giả; ngoại lệ này không áp cho tài liệu nội bộ, tài liệu mật hay dữ liệu cá nhân.

Hệ quả: phần do AI sinh ra nguyên vẹn có thể không được bảo hộ; cán bộ phải giữ vai trò chủ đạo (đặt yêu cầu, lựa chọn, sửa, kiểm thử) và lưu được bằng chứng. Nhật ký thay đổi của dự án, nơi ghi lại các quyết định do người dùng chốt, cùng lịch sử commit trên GitHub chính là bằng chứng ấy (Chương 7). Phần mềm làm theo nhiệm vụ cơ quan giao thì quyền tài sản thuộc cơ quan, trừ khi có thỏa thuận khác; nên có văn bản giao nhiệm vụ.

### 3.6.2. Mã nguồn mở và giấy phép

Thông tư 20/2014/TT-BTTTT quy định các sản phẩm phần mềm nguồn mở được ưu tiên mua sắm, sử dụng trong cơ quan nhà nước; danh mục ban đầu có cả PostgreSQL, hệ quản trị cơ sở dữ liệu mà hệ thống của Văn phòng đang dùng (qua dịch vụ Supabase). Giấy phép nguồn mở giống điều kiện kèm theo một tài sản được tặng: dùng được nhưng phải giữ đúng điều kiện, cụ thể là giữ nguyên thông báo bản quyền (MIT, Apache 2.0); thận trọng với giấy phép buộc công bố mã nguồn (GPL, AGPL); lập danh sách thành phần nguồn mở đã dùng; không dùng phần mềm bẻ khóa.

Cần phân biệt "kho công khai" với "mã nguồn mở". Kho mã của hệ thống ở chế độ công khai, nhưng đến thời điểm viết chưa gắn tệp giấy phép nào; người khác xem được mà chưa có căn cứ rõ ràng để dùng lại. Chọn giấy phép là quyết định của cơ quan chủ sở hữu, không phải của người viết mã.

::: {.lenhmau}
**Câu lệnh mẫu 3.3 — Kiểm kê thành phần nguồn mở và giấy phép**

Giao cho tác tử AI lập trình trong thư mục dự án (cách giao việc ở Chương 6).

```text
Hãy đọc tệp package.json và thư mục node_modules của dự án này.
Lập bảng: tên gói – phiên bản – loại giấy phép – nghĩa vụ chính
(giữ thông báo bản quyền, công bố mã nguồn…). Đánh dấu gói nào có
giấy phép GPL, AGPL hoặc không rõ giấy phép. Không sửa tệp nào.
Chỗ nào không đọc được giấy phép thì ghi "KHÔNG XÁC ĐỊNH".
```
:::

### 3.6.3. Sáng kiến và tinh thần dám nghĩ, dám làm

Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 (hiệu lực 01/10/2025, thay Luật Khoa học và công nghệ năm 2013) có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro, và cơ chế thử nghiệm có kiểm soát. Cách hiểu thận trọng: miễn, loại trừ trách nhiệm chỉ áp dụng cho nhiệm vụ hoặc thử nghiệm được phê duyệt và làm đúng quy trình; ứng dụng tự làm rồi đưa vào dùng ngoài khuôn khổ ấy không mặc nhiên được miễn trách nhiệm. Về sáng kiến, Nghị định 13/2012/NĐ-CP ban hành Điều lệ Sáng kiến; quy định về khuyến khích, bảo vệ cán bộ năng động, sáng tạo thì cần tra văn bản hiện hành trước khi viện dẫn.

Con đường chính danh mà tôi chọn: hệ thống đánh giá được viết thành bản mô tả sáng kiến để trình Hội đồng khoa học; Sổ tay AI được đăng ký thành nhiệm vụ đột phá, có chỉ tiêu, mốc thời gian và báo cáo đánh giá. Văn bản giao nhiệm vụ, phạm vi thử nghiệm ghi rõ, kế hoạch quản trị rủi ro bằng văn bản: đó là "tấm khiên" thật cho người dám làm (Chương 20, mục 20.2).

## 3.7. Pháp luật về tổ chức, hoạt động của cơ quan dân cử mà phần mềm phải "số hóa đúng"

Phần mềm nghiệp vụ là câu chữ quy định được viết lại thành phép tính. Đọc sai một chữ "tổng số" hay quên "làm tròn lên" thì kết quả sai mà màn hình vẫn đẹp. Bảng dưới gom những chỗ hệ thống của Văn phòng phải số hóa đúng.

| Căn cứ | Câu chữ cần số hóa | Quy tắc trong phần mềm |
|---|---|---|
| Luật Tổ chức chính quyền địa phương số 72/2025/QH15 | Quá nửa tổng số đại biểu tán thành | Mẫu số là tổng số đại biểu: 82 → 42; hai phần ba → 55 |
| Nghị định 335/2025/NĐ-CP | 30 + 70 điểm; (a+b+c)/3; trừ 25% mỗi lần | Ba tỷ lệ số lượng, chất lượng, tiến độ từng nhiệm vụ |
| Nghị định 335/2025/NĐ-CP, Điều 20 | Ngưỡng 90, 70, 50 điểm | Bốn mức; điều kiện ngoài điểm tính riêng |
| Quy định 1053-QĐ/TU | Xuất sắc ≤ 20% số Hoàn thành tốt; xong trước ngày 28 | Cảnh báo vượt trần; tháng 12 xong trước 15/12 |
| Hướng dẫn 02-HD/BTCTW | Cấp trực tiếp đề xuất, cấp quản lý quyết định | Nút phê duyệt của con người |
| Nghị định 135/2020/NĐ-CP | Nghỉ hưu vào ngày cuối tháng đủ tuổi | Chỉ nhắc việc, không ra quyết định |

**Luật Tổ chức chính quyền địa phương số 72/2025/QH15** (hiệu lực từ 16/6/2025): nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành; mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm. Hai phần ba của 82 là 54,67, làm tròn lên thành 55; ngưỡng này chỉ dùng khi luật quy định riêng, không lẫn với điều kiện về số đại biểu tham dự kỳ họp. Phân hệ Biểu quyết Online đánh số đại biểu DB01 đến DB82, không gắn họ tên người thật; biểu quyết chính thức phải theo Quy chế làm việc của HĐND (Chương 12, mục 12.3).

**Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15** (thông qua ngày 10/12/2025, hiệu lực từ 01/3/2026) là căn cứ cho ứng dụng theo dõi kiến nghị sau giám sát. Số hiệu các nghị quyết hướng dẫn trong các nguồn tôi đối chiếu chưa thống nhất, nên tôi không ghi; trước khi cấu hình thời hạn, trình tự, phải tra văn bản gốc.

**Về đánh giá cán bộ, công chức:** Luật Cán bộ, công chức số 80/2025/QH15 có hiệu lực từ 01/7/2025. Nghị định 335/2025/NĐ-CP ngày 21/12/2025 (hiệu lực 01/01/2026) có nguyên tắc (Điều 4) ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại; ví dụ hay được dẫn: 10 văn bản có 1 văn bản sai sót lớn thì điểm chất lượng là 97,5%. Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ"; ở tỉnh, khoản 4 Điều 3 Quy định 1053-QĐ/TU ngày 05/6/2026 yêu cầu "đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI)". Đây là căn cứ mạnh để dùng công cụ số trong đánh giá, nhưng ứng dụng tự làm vẫn chỉ là bản thử nghiệm, không phải phần mềm dùng thống nhất do cấp có thẩm quyền quyết định (Chương 9 và 10).

::: {.cauchuyen}
**Câu chuyện thực tế: một nhiệm vụ làm được 9/10 có phải là "không hoàn thành"?**

Phiên bản đầu của phần mềm coi mọi nhiệm vụ chưa đạt đủ 100% số lượng là "không hoàn thành", nên một cán bộ điểm cao bị ép xuống mức thấp nhất chỉ vì một nhiệm vụ làm được 9/10. AI đã "chọn đại" một cách hiểu. Bản sửa xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành, từ 50% đến dưới 100% là chưa đạt đủ số lượng, kèm giải thích lý do hạ mức. Diễn giải câu chữ quy định là việc của người chịu trách nhiệm: hỏi lại, chốt và ghi vào nhật ký.
:::

## 3.8. Mười điều tuân thủ cho cán bộ tự làm ứng dụng

| Việc phải làm | Căn cứ chính | Cách làm trong thực tế |
|---|---|---|
| 1. Phân loại dữ liệu trước khi làm | Luật 91/2025/QH15; Nghị định 356/2025/NĐ-CP | Bảng trường dữ liệu: cơ bản, nhạy cảm; xếp 4 cấp theo Tập 1, mục 7.2 |
| 2. Không đưa tài liệu mật lên AI, đám mây | Luật 117/2025/QH15, Điều 5 | Mật chỉ xử lý trên máy, mạng LAN độc lập theo quy chế |
| 3. Thu thập tối thiểu, phân quyền ở cơ sở dữ liệu | Luật 91/2025/QH15 | Chính sách theo dòng; thử cả vai khách và Quản trị |
| 4. Không để dữ liệu thật, khóa bí mật trong kho mã | Luật 91/2025/QH15; Luật 116/2025/QH15 | Chặn tệp nhạy cảm; khóa chỉ ở máy chủ (Chương 19) |
| 5. Tự xác định vai, lập phiếu phân loại rủi ro | Luật 134/2025/QH15; Nghị định 142/2026/NĐ-CP | Phiếu một trang, đối chiếu danh mục rủi ro cao |
| 6. Minh bạch nội dung AI, không giả mạo người thật | Luật 134/2025/QH15, Điều 7, Điều 11 | Nhãn "Trả lời bằng AI"; không dựng giọng, ảnh người thật |
| 7. Máy đề xuất, người quyết định | Luật 134/2025/QH15, khoản 2 Điều 4; Công văn 2766/BKHCN-TTCNTT | Nút phê duyệt; sửa điểm tự gỡ phê duyệt |
| 8. Số hóa đúng câu chữ, tra hiệu lực | Văn bản nghiệp vụ gốc | Đối chiếu biểu mẫu giấy; phép kiểm cho từng ngưỡng |
| 9. Xác định cấp độ trước khi dùng chính thức | Luật 116/2025/QH15; Nghị định 331/2026/NĐ-CP | Hồ sơ đề xuất cấp độ với đơn vị chuyên trách |
| 10. Rõ quyền tác giả, giấy phép, đường chính danh | Luật Sở hữu trí tuệ; Nghị định 134/2026/NĐ-CP; Luật 93/2025/QH15 | Văn bản giao nhiệm vụ; nhật ký; sáng kiến, nhiệm vụ |

::: {.lanhdao}
**Dành cho lãnh đạo**

- Người đứng đầu chịu trách nhiệm về bảo vệ bí mật nhà nước trong cơ quan; cho phép dùng AI thì cần ban hành quy tắc nội bộ (có thể kế thừa khung quy chế 10 điều ở Tập 1, mục 7.6; xem Chương 17), tập huấn và kiểm tra định kỳ.
- Yêu cầu mỗi ứng dụng có AI trình kèm phiếu tự phân loại rủi ro và bản đồ dữ liệu trước khi cho người khác dùng.
- Phân biệt rõ bản demo với dữ liệu mô phỏng và hệ thống chính thức có hồ sơ cấp độ, hạ tầng của cơ quan.
- Muốn bảo vệ người dám làm, hãy giao nhiệm vụ bằng văn bản, có phạm vi thử nghiệm và người chịu trách nhiệm.
:::

## Tóm tắt chương 3

::: {.tomtat}
1. Năm 2026, hành lang pháp lý về số thay đổi lớn; nhiều văn bản Tập 1 dẫn đã được thay thế. Luôn tra hiệu lực trên vbpl.vn hoặc Công báo trước khi viện dẫn.
2. Chủ trương khuyến khích mạnh mẽ ứng dụng AI, nhưng "chấp nhận rủi ro" phải theo cơ chế luật định.
3. Theo Luật Trí tuệ nhân tạo, cán bộ có thể là người sử dụng, còn cơ quan đưa chatbot cho người khác dùng là bên triển khai; phải phân loại rủi ro, minh bạch và giữ quyền quyết định cho con người.
4. Dữ liệu cá nhân chia thành cơ bản và nhạy cảm; hồ sơ 2C có cả hai loại. Xếp mọi dữ liệu theo 4 cấp của Tập 1 (không chắc thì chọn cấp cao hơn), thu thập tối thiểu, phân quyền ở cơ sở dữ liệu, không đưa vào kho mã công khai.
5. Tài liệu mật không bao giờ lên AI công cộng hay dịch vụ đám mây; ứng dụng dùng chính thức phải xác định cấp độ hệ thống thông tin.
6. Tệp phần mềm xuất ra chỉ là bản nháp; giá trị pháp lý đến từ chữ ký và quy trình văn thư.
7. Quyền tác giả với sản phẩm có AI hỗ trợ chỉ phát sinh khi con người giữ vai trò chủ đạo; kho công khai chưa phải là mã nguồn mở.
:::

## Câu hỏi suy ngẫm và bài tập

1. Tuần này đồng chí đã đóng vai nào theo Luật Trí tuệ nhân tạo? Cơ quan có đang là bên triển khai hệ thống AI nào không?
2. Lấy một biểu mẫu của phòng, dùng Câu lệnh mẫu 3.2 với tên trường (không có dữ liệu thật) để xếp nhóm và xếp cấp dữ liệu. Có trường nào không thật sự cần?
3. Lập phiếu tự phân loại rủi ro cho một ứng dụng có AI mà đồng chí muốn làm. Câu hỏi nào khó trả lời nhất, vì sao?
4. Vì sao một tệp Word do phần mềm xuất ra chưa phải là văn bản? Phải thêm những bước nào?
5. Tra trên vbpl.vn tình trạng hiệu lực của ba văn bản dẫn trong chương. Có văn bản nào đã thay đổi sau ngày 26/10/2026 không?
