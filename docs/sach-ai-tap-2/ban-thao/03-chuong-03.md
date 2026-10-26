# Chương 3. Hành lang pháp lý khi dùng AI và tự xây dựng ứng dụng

::: {.muctieu}
**Mục tiêu của chương**

- Nắm được các chủ trương, định hướng mới nhất về trí tuệ nhân tạo (AI) và chuyển đổi số, đối chiếu đến ngày 26/10/2026; biết những văn bản nào đã thay thế văn bản Tập 1 từng dẫn.
- Tự xác định vai của mình và của cơ quan theo Luật Trí tuệ nhân tạo (người sử dụng, bên triển khai hay nhà cung cấp) và những việc phải làm trước khi đưa một ứng dụng có AI cho người khác dùng.
- Phân loại được dữ liệu trong ứng dụng tự làm theo pháp luật về dữ liệu, dữ liệu cá nhân, bí mật nhà nước và an ninh mạng; hiểu vì sao tài liệu mật không bao giờ được đưa lên AI công cộng hay dịch vụ đám mây.
- Phân biệt bản demo với văn bản, hệ thống chính thức; hiểu quyền tác giả với mã nguồn viết cùng AI, giấy phép mã nguồn mở và con đường sáng kiến, nhiệm vụ.
- Vận dụng mười điều tuân thủ khi tự làm ứng dụng phục vụ cơ quan dân cử.

Dành cho: mọi người đọc. Lãnh đạo nên đọc kỹ mục 3.1, 3.4, 3.8 và các hộp "Dành cho lãnh đạo"; cán bộ tự làm ứng dụng nên đọc kỹ toàn chương, nhất là mục 3.2, 3.3 và 3.4.
:::

Tôi bắt tay làm hệ thống thử nghiệm của Văn phòng Đoàn đại biểu Quốc hội (ĐBQH) và Hội đồng nhân dân (HĐND) tỉnh Thanh Hóa, nay chạy tại địa chỉ hdndthkpi.vercel.app, vào mùa hè năm 2026. Đó cũng là lúc hành lang pháp lý về công nghệ số thay đổi nhiều nhất trong nhiều năm. Chỉ trong mười tháng đầu năm, lần lượt có hiệu lực Luật Bảo vệ dữ liệu cá nhân (01/01/2026), Luật Trí tuệ nhân tạo và Luật Bảo vệ bí mật nhà nước mới (01/3/2026), Luật Chuyển đổi số và Luật An ninh mạng mới (01/7/2026). Đi kèm là hàng chục nghị định, thông tư, quyết định hướng dẫn, nhiều văn bản ra đời chỉ vài tuần trước khi tôi viết những dòng này.

Người cán bộ tự làm ứng dụng vì thế đứng trước hai cái bẫy. Bẫy thứ nhất là sợ: nghe nói có luật về AI, có nghị định xử phạt về dữ liệu cá nhân thì thôi không dám làm gì. Bẫy thứ hai là coi nhẹ: nghĩ rằng phần mềm "nhà làm", bản thử nghiệm, chỉ dùng trong phòng thì luật không với tới. Cả hai đều sai. Pháp luật hiện hành khuyến khích mạnh mẽ việc ứng dụng AI trong cơ quan nhà nước, nhưng đặt ra những lằn ranh rõ ràng về dữ liệu, bí mật, trách nhiệm. Biết lằn ranh ở đâu thì mới yên tâm đi nhanh.

Chương này không phải giáo trình luật. Nó là tấm bản đồ để người không chuyên pháp lý biết mình đang đứng ở đâu khi dùng AI và khi tự làm một ứng dụng. Mỗi mục trả lời ba câu hỏi: văn bản nào, nó đòi hỏi gì, và trong hệ thống của Văn phòng tôi đã làm theo ra sao, kể cả những chỗ từng làm sai.

::: {.cauchuyen}
**Câu chuyện thực tế: căn cứ đã hết hiệu lực nằm ngay trong tài liệu của chính dự án**

Tài liệu Đặc tả yêu cầu phần mềm đánh giá KPI của dự án, đề tháng 7/2026, ghi ở phần căn cứ "Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân", và ở phần yêu cầu an toàn thông tin lại ghi "tuân thủ quy định bảo vệ dữ liệu cá nhân tại Nghị định số 13/2023/NĐ-CP". Khi đối chiếu để viết cuốn sách này, tôi mới thấy nghị định ấy đã hết hiệu lực từ 01/01/2026, khi Nghị định 356/2025/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 cùng có hiệu lực.

Không ai cố ý dẫn sai. Câu chữ được chép từ những tài liệu quen thuộc của các năm trước, và cũng có thể do AI gợi ý theo trí nhớ cũ của nó. Đây đúng là điều Tập 1 đã cảnh báo trong "5 KHÔNG của AI": AI không biết văn bản pháp luật vừa ban hành. Bài học của tôi: mỗi khi viết dòng "căn cứ", phải tra tình trạng hiệu lực ngay hôm đó, không chép lại từ tài liệu cũ, kể cả tài liệu của chính mình.
:::

::: {.canhbao}
**Cảnh báo: cách dùng chương này**

- Pháp luật trong chương được đối chiếu đến ngày 26/10/2026, chủ yếu qua nhiều nguồn chính thống đối chiếu chéo với nhau. Trước khi áp dụng, đồng chí cần tra nguyên văn trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn) hoặc Công báo (congbao.chinhphu.vn), xem cả mục tình trạng hiệu lực và văn bản sửa đổi.
- Sách chỉ nêu số Điều, khoản khi đã đối chiếu được. Chỗ nào chưa chắc chắn, sách nói chung ("theo quy định về…") và khuyên đồng chí tra lại. Đó là chủ ý, không phải sơ suất.
- Chương này giúp nhận diện vấn đề, không thay ý kiến của bộ phận pháp chế, đơn vị chuyên trách công nghệ thông tin hay cơ quan có thẩm quyền.
:::

Trước khi đi vào từng mục, tôi tóm lại những thay đổi quan trọng so với thời điểm viết Tập 1, để người đã đọc Tập 1 khỏi dùng nhầm căn cứ cũ.

::: {.phaply}
**Cập nhật so với Tập 1**

- **Chiến lược quốc gia về AI:** Quyết định 127/QĐ-TTg ngày 26/01/2021 đã được thay thế bằng Quyết định 1671/QĐ-TTg ngày 28/8/2026 phê duyệt Chiến lược quốc gia về trí tuệ nhân tạo đến năm 2030, tầm nhìn đến năm 2045 (có hiệu lực từ ngày ký).
- **Bí mật nhà nước:** Luật Bảo vệ bí mật nhà nước số 29/2018/QH14 hết hiệu lực từ 01/3/2026, thay bằng Luật số 117/2025/QH15; Nghị định 26/2020/NĐ-CP được thay bằng Nghị định 63/2026/NĐ-CP (hiệu lực 01/3/2026).
- **An ninh mạng:** Luật An ninh mạng năm 2018 và Luật An toàn thông tin mạng năm 2015 hết hiệu lực từ 01/7/2026, được hợp nhất, thay thế bằng Luật An ninh mạng số 116/2025/QH15. Các nghị định hướng dẫn mới ban hành ngày 19/8/2026, trong đó có Nghị định 331/2026/NĐ-CP về bảo vệ an ninh mạng đối với hệ thống thông tin.
- **Dữ liệu cá nhân:** Nghị định 13/2023/NĐ-CP hết hiệu lực từ 01/01/2026. Căn cứ hiện hành là Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (cùng hiệu lực 01/01/2026); việc xử phạt theo Nghị định 330/2026/NĐ-CP (hiệu lực 19/8/2026).
- **Mới hoàn toàn so với Tập 1:** Luật Trí tuệ nhân tạo số 134/2025/QH15 (hiệu lực 01/3/2026) cùng các văn bản hướng dẫn; Luật Chuyển đổi số số 148/2025/QH15 (hiệu lực 01/7/2026, thay Luật Công nghệ thông tin năm 2006).
- **Sắp thay đổi:** Quy định 366-QĐ/TW của Bộ Chính trị về kiểm điểm, đánh giá, xếp loại chất lượng vẫn là căn cứ cho năm 2026, nhưng sẽ được thay bằng Quy định 227-QĐ/TW ngày 19/10/2026 từ 01/01/2027.
:::

## 3.1. Chủ trương, định hướng: được khuyến khích, nhưng có khuôn khổ

### 3.1.1. Nghị quyết 57-NQ/TW và Chương trình hành động của Chính phủ

Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia là căn cứ chính trị cao nhất cho mọi việc được kể trong cuốn sách này. Nghị quyết xác định khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là "đột phá quan trọng hàng đầu". Trong các mục tiêu đến năm 2030 có ba mục tiêu cán bộ nên nhớ: Việt Nam thuộc nhóm 3 nước dẫn đầu Đông Nam Á về nghiên cứu và phát triển trí tuệ nhân tạo; kinh tế số đạt tối thiểu 30% GDP; tỷ lệ người dân và doanh nghiệp sử dụng dịch vụ công trực tuyến trên 80%.

Điều có ý nghĩa nhất với người làm tham mưu là tinh thần của Nghị quyết: chấp nhận rủi ro, chấp nhận đầu tư mạo hiểm và độ trễ trong nghiên cứu; có cơ chế thử nghiệm có kiểm soát; xóa bỏ tư duy "không quản được thì cấm". Chính phủ cụ thể hóa bằng Nghị quyết 03/NQ-CP ngày 09/01/2025 ban hành Chương trình hành động, sau đó sửa đổi, bổ sung, cập nhật bằng Nghị quyết 71/NQ-CP ngày 01/4/2025.

Cần hiểu cho đúng: "chấp nhận rủi ro" không phải tấm giấy miễn trách nhiệm phát cho mọi người. Nó được thực hiện theo cơ chế, quy trình luật định, chủ yếu qua Luật Khoa học, công nghệ và đổi mới sáng tạo mà mục 3.6 sẽ nói. Hãy hình dung một cuộc diễn tập phòng cháy: có kịch bản được duyệt, có người chỉ huy, có khu vực khoanh vùng, có biển "DIỄN TẬP". Được phép thử không có nghĩa ai muốn đốt lửa ở đâu cũng được.

### 3.1.2. Chiến lược quốc gia về trí tuệ nhân tạo năm 2026

Ngày 28/8/2026, Thủ tướng Chính phủ ban hành Quyết định 1671/QĐ-TTg phê duyệt Chiến lược quốc gia về trí tuệ nhân tạo đến năm 2030, tầm nhìn đến năm 2045, có hiệu lực từ ngày ký, thay thế Quyết định 127/QĐ-TTg năm 2021. Trọng tâm chuyển từ "chủ yếu ứng dụng AI" sang "nghiên cứu, phát triển AI và chuyển đổi toàn diện quốc gia bằng AI". Nhân lực, hạ tầng, dữ liệu là nền tảng; thể chế và quản trị AI là khâu đột phá.

Chiến lược có 9 trụ cột: nhân lực và kỹ năng AI toàn dân; dữ liệu và mô hình AI; hạ tầng AI; nghiên cứu và làm chủ công nghệ; AI trong quản trị quốc gia; AI cho các ngành; AI cho doanh nghiệp nhỏ và vừa; hệ sinh thái AI; quản trị AI an toàn, đáng tin cậy. Mục tiêu đến năm 2030 gồm có tối thiểu 5 nền tảng AI dùng chung quốc gia và 8 mô hình AI tiếng Việt. Với khu vực công, theo các bản tin chính thống, chiến lược đặt chỉ tiêu 100% cán bộ, công chức, viên chức sử dụng nền tảng AI công vụ hằng tuần và 60% quyết định chỉ đạo, điều hành được hỗ trợ bởi dữ liệu và AI; ngoài ra là 100% hồ sơ thủ tục hành chính được hỗ trợ xử lý bằng AI.

Văn phòng Đoàn ĐBQH và HĐND tỉnh chủ yếu làm công tác tham mưu, phục vụ, không giải quyết thủ tục hành chính, nên chỉ tiêu về hồ sơ thủ tục không áp thẳng vào. Nhưng hai chỉ tiêu về cán bộ dùng AI công vụ và quyết định dựa trên dữ liệu thì liên quan trực tiếp. Chiến lược còn gợi ra một hàm ý kỹ thuật mà tôi thấy nên làm ngay từ đầu: khi các nền tảng AI dùng chung quốc gia sẵn sàng, cơ quan nên ưu tiên dùng chúng. Vì vậy ứng dụng tự làm không nên "trói chặt" vào một nhà cung cấp. Trong hệ thống của Văn phòng, mọi lời gọi AI đi qua một tệp duy nhất ở máy chủ, chỉ cần một khóa và đổi được nhà cung cấp hay địa chỉ dịch vụ bằng cấu hình. Giống như cơ quan có một bộ phận văn thư đầu mối: muốn đổi đơn vị chuyển phát thì chỉ sửa một hợp đồng, không phải dặn lại từng phòng.

### 3.1.3. Phong trào "Bình dân học vụ số" và yêu cầu về kỹ năng số, kỹ năng AI

Kế hoạch 01-KH/BCĐTW ngày 21/3/2025 của Ban Chỉ đạo Trung ương về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số triển khai Phong trào "Bình dân học vụ số". Với cán bộ, công chức, văn bản tác động trực tiếp nhất là Chỉ thị 14/CT-TTg ngày 22/4/2026 của Thủ tướng Chính phủ về đẩy mạnh bồi dưỡng và đánh giá kiến thức, kỹ năng số. Chỉ thị đặt mục tiêu đến hết năm 2026, 100% cán bộ, công chức, viên chức có hiểu biết về chuyển đổi số, có kiến thức, kỹ năng số và sử dụng tốt các nền tảng, dịch vụ số phục vụ công việc; từ năm 2027, 100% hoàn thành bồi dưỡng theo chương trình, học liệu cập nhật. Việc tự học, tự bồi dưỡng là nhiệm vụ thường xuyên; người giữ chức vụ lãnh đạo, quản lý phải gương mẫu. Nền tảng "Bình dân học vụ số" do Bộ Công an vận hành, tích hợp với VNeID; cán bộ học trên đó và được đánh giá, xác nhận hoàn thành.

Ở tầng sâu hơn, Quyết định 1528/QĐ-TTg ngày 11/8/2026 phê duyệt Chương trình quốc gia phát triển nhân lực trí tuệ nhân tạo đến năm 2030, định hướng đến năm 2035. Chương trình đào tạo theo 3 tầng: phổ cập, ứng dụng, chuyên sâu; mục tiêu đến năm 2030 có ít nhất 90% cán bộ, công chức, viên chức và người lao động trong đơn vị sự nghiệp công lập được bồi dưỡng, cập nhật kỹ năng AI để sử dụng AI an toàn, hiệu quả, có trách nhiệm trong công việc. Khung năng lực trí tuệ nhân tạo quốc gia dự kiến hoàn thành trong tháng 6/2027.

Ở tỉnh ta, ngày 7/5/2026, Thường trực HĐND tỉnh đã tổ chức hội nghị tập huấn sử dụng trí tuệ nhân tạo cho cán bộ, công chức Văn phòng, với các nội dung thực hành tóm tắt, xử lý tài liệu, dùng AI chuẩn bị kỳ họp, giám sát, và cả an toàn dữ liệu, đạo đức công vụ, nhận diện rủi ro. Cuốn sách này nên được hiểu là học liệu tự học bổ trợ, đứng ở tầng "phổ cập" và "ứng dụng". Nó không thay cho chương trình chính thức; muốn được xác nhận hoàn thành, cán bộ vẫn học và làm bài đánh giá trên nền tảng chung.

### 3.1.4. Các văn bản hướng dẫn cách ứng xử khi dùng AI

Bên cạnh chủ trương lớn, đã có những văn bản hướng dẫn rất gần với thao tác hằng ngày của cán bộ. Chúng không phải văn bản quy phạm pháp luật, nhưng là chỉ dẫn của cơ quan có thẩm quyền mà cán bộ, đảng viên phải nghiêm túc thực hiện.

| Văn bản | Điều cán bộ cần nhớ |
|---|---|
| Công văn 557/BKHCN-CĐSQG ngày 31/3/2025 của Bộ Khoa học và Công nghệ (dùng chatbot AI trong công việc) | Không đưa lên chatbot tài liệu thuộc danh mục bí mật nhà nước, dữ liệu cá nhân, tài liệu nội bộ; không đặt tên, mật khẩu tài khoản AI trùng tài khoản công vụ; thu hồi, hủy tài khoản khi cán bộ nghỉ việc, chuyển công tác; không phụ thuộc hoàn toàn vào AI, kiểm tra kết quả trước khi dùng |
| Công văn 2766/BKHCN-TTCNTT ngày 29/4/2026 (AI hỗ trợ rà soát văn bản quy phạm pháp luật) | AI chỉ hỗ trợ phân tích, tổng hợp, cảnh báo, gợi ý; không dùng AI tự động đưa ra kết luận pháp lý có giá trị quyết định; kết quả phải truy xuất, kiểm chứng, đối chiếu được với căn cứ; cán bộ phải kiểm tra, xác nhận trước khi dùng |
| Hướng dẫn kèm Công văn 19130-CV/VPTW ngày 26/11/2025 của Văn phòng Trung ương Đảng (dùng AI trong cơ quan đảng) | Nguyên tắc "hỗ trợ, không thay thế"; mọi sản phẩm do AI tạo ra phải được kiểm chứng, thẩm định, chỉnh sửa và người dùng chịu trách nhiệm hoàn toàn; ưu tiên giải pháp do Việt Nam phát triển khi xử lý dữ liệu nội bộ, nhạy cảm; không đưa tài liệu mật, thông tin nhạy cảm lên nền tảng AI |
| Quy định 207-QĐ/TW ngày 26/7/2026 về những điều đảng viên không được làm | Điều 5 bổ sung: không được dùng hạ tầng Internet, mạng xã hội, nền tảng số, trí tuệ nhân tạo để tạo lập, phát tán thông tin, nội dung sai sự thật |
| Quyết định 495-QĐ/TW ngày 20/10/2026 về Chương trình cải cách hành chính trong các cơ quan đảng giai đoạn 2026–2030 | Dữ liệu là nền tảng quản trị, nền tảng số dùng chung là phương thức vận hành, AI là công cụ hỗ trợ; việc dùng AI phải có kiểm soát |

Phần lớn cán bộ, lãnh đạo Văn phòng là đảng viên, nên cả hai nhóm văn bản của khối nhà nước và khối Đảng đều ràng buộc trực tiếp. Đọc kỹ thì thấy chúng nói cùng một ý bằng những câu chữ khác nhau.

::: {.ghinho}
**Ghi nhớ: bốn điểm chung của mọi văn bản hướng dẫn về AI**

1. AI hỗ trợ, không thay thế tư duy, thẩm quyền và trách nhiệm của con người.
2. Mọi kết quả của AI phải được kiểm chứng trước khi dùng; người dùng chịu trách nhiệm về sản phẩm cuối cùng.
3. Không đưa tài liệu mật, dữ liệu cá nhân, tài liệu nội bộ lên nền tảng AI công cộng.
4. Được khuyến khích thử nghiệm, nhưng thử nghiệm phải có kiểm soát, theo cơ chế luật định.
:::
