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

## 3.2. Luật chuyên ngành về AI và công nghệ số

### 3.2.1. Luật Trí tuệ nhân tạo: những điều cốt lõi

Luật Trí tuệ nhân tạo số 134/2025/QH15 được Quốc hội thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026, trừ các nội dung liên quan đến Điều 35 về quy định chuyển tiếp. Luật gồm 8 chương, 35 điều, không điều chỉnh hoạt động AI chỉ phục vụ quốc phòng, an ninh, cơ yếu. Với người tự làm ứng dụng, tôi rút ra sáu điểm cốt lõi.

**Một, nguyên tắc con người làm trung tâm.** Điều 4 yêu cầu bảo đảm quyền con người, quyền riêng tư, lợi ích quốc gia, lợi ích công cộng, an ninh quốc gia. Khoản 2 Điều 4 ghi: "Trí tuệ nhân tạo phục vụ con người, không thay thế thẩm quyền và trách nhiệm của con người". Điều này cũng yêu cầu duy trì sự kiểm soát và khả năng can thiệp của con người đối với quyết định, hành vi của hệ thống AI.

**Hai, Nhà nước ưu tiên ứng dụng AI trong cơ quan nhà nước.** Khoản 3 Điều 5 ưu tiên ứng dụng AI trong quản lý, điều hành, cung cấp dịch vụ công và hỗ trợ ra quyết định của cơ quan nhà nước, nhằm nâng cao hiệu quả, tính minh bạch và chất lượng phục vụ người dân, doanh nghiệp. Đây là câu trả lời cho những ai còn hỏi "cơ quan nhà nước có được dùng AI không".

**Ba, quản lý theo mức độ rủi ro.** Khoản 1 Điều 6 yêu cầu việc ứng dụng AI phải tuân thủ nguyên tắc quản lý rủi ro. Luật có quy định về phân loại hệ thống AI (Điều 9), hồ sơ và thông báo phân loại (Điều 10); hệ thống rủi ro cao phải đánh giá sự phù hợp và được quản lý chặt (Điều 13, Điều 14).

**Bốn, các hành vi bị nghiêm cấm.** Điều 7 quy định các nhóm hành vi bị cấm. Khoản 2 cấm phát triển, cung cấp, triển khai, sử dụng AI để lừa dối, thao túng con người, để tạo nội dung giả mạo người thật, sự kiện thật, hoặc để lợi dụng điểm yếu của các nhóm dễ bị tổn thương như trẻ em, người cao tuổi, người khuyết tật.

**Năm, minh bạch và gắn nhãn.** Điều 11 quy định trách nhiệm minh bạch: khoản 3 về thông báo nội dung do AI tạo ra hoặc chỉnh sửa có thể gây nhầm lẫn; khoản 4 về gắn nhãn nội dung âm thanh, hình ảnh, video mô phỏng người thật.

**Sáu, một đầu mối luật về AI.** Luật Trí tuệ nhân tạo bãi bỏ toàn bộ chương về AI trong Luật Công nghiệp công nghệ số (xem mục 3.2.4). Từ 01/3/2026, khi nói căn cứ pháp lý cấp luật về AI, ta dẫn Luật Trí tuệ nhân tạo.

### 3.2.2. Tôi là ai trong chuỗi hệ thống AI?

Điều 3 của Luật phân biệt bốn vai: nhà phát triển (trực tiếp thiết kế, huấn luyện hoặc tinh chỉnh mô hình), nhà cung cấp (đưa hệ thống AI ra thị trường hoặc vào sử dụng dưới tên, nhãn hiệu của mình), bên triển khai (dùng hệ thống AI trong phạm vi kiểm soát của mình) và người sử dụng (trực tiếp tương tác với hệ thống hoặc dùng kết quả đầu ra). Một cán bộ có thể mang các vai khác nhau trong những tình huống khác nhau. Bảng dưới là cách hiểu của tôi khi đọc định nghĩa; gặp tình huống ranh giới, đồng chí nên đọc nguyên văn Điều 3 và hỏi bộ phận pháp chế.

| Tình huống | Vai (cách hiểu) | Việc nên làm |
|---|---|---|
| Dùng trợ lý AI trò chuyện soạn nháp, tóm tắt | Người sử dụng | Kiểm chứng, chịu trách nhiệm kết quả |
| Cơ quan đưa chatbot vào phục vụ cán bộ, đại biểu | Bên triển khai | Phân loại rủi ro, minh bạch, giám sát |
| Tự viết ứng dụng gọi AI cho đồng nghiệp dùng | Có thể vừa là nhà cung cấp vừa là bên triển khai | Lập hồ sơ tự phân loại, gắn nhãn, đặt trần |
| Tự huấn luyện, tinh chỉnh mô hình | Nhà phát triển | Ngoài tầm cán bộ tự làm; cần đơn vị chuyên trách |

Soi vào hệ thống của Văn phòng: khi tôi dùng tác tử AI lập trình để viết mã, tôi là người sử dụng. Nhưng phân hệ Trợ lý AI nghiệp vụ dân cử, khung chat Người hướng dẫn trên Trang chủ và bot Telegram, Zalo đều gọi dịch vụ AI để trả lời người khác. Ở đó, cơ quan đứng ở vị trí bên triển khai, và người làm ra ứng dụng phải trả lời được những câu hỏi của bên triển khai: hệ thống dùng để làm gì, dữ liệu nào đi vào, con người can thiệp ở đâu, người dùng có biết mình đang đọc câu trả lời của máy không.

Câu hỏi cuối cùng ấy là lý do mọi câu trả lời do AI sinh ra trong khung chat Người hướng dẫn đều mang nhãn "Trả lời bằng AI", tách khỏi câu trả lời soạn sẵn theo kịch bản. Ở Sổ tay AI, câu trả lời bắt buộc gắn số trích dẫn tới đoạn nguồn; quên gắn thì giao diện tự treo cảnh báo. Đó không phải trang trí, mà là cách thể hiện tinh thần minh bạch của Luật ngay trên màn hình.

### 3.2.3. Văn bản hướng dẫn: Nghị định 142, Quyết định 33 và Khung đạo đức

**Nghị định 142/2026/NĐ-CP** ngày 30/4/2026, có hiệu lực từ 01/5/2026, quy định chi tiết một số điều và biện pháp thi hành Luật Trí tuệ nhân tạo. Đối tượng áp dụng gồm nhà cung cấp, nhà phát triển, bên triển khai, người sử dụng hệ thống AI và người bị ảnh hưởng. Nghị định có nội dung về đánh giá tác động, quản lý rủi ro và giám sát việc sử dụng AI trong quản lý nhà nước, cung cấp dịch vụ công. Ba điểm thực hành cần nhớ: việc phân loại rủi ro phải làm **trước khi** đưa hệ thống vào sử dụng; nếu chưa xác định được mức rủi ro thì nhà cung cấp đề nghị Bộ Khoa học và Công nghệ hướng dẫn trên cơ sở hồ sơ kỹ thuật; khi triển khai, sửa đổi, tích hợp hoặc thay đổi chức năng, mục đích làm phát sinh rủi ro mới hoặc cao hơn, bên triển khai phải phối hợp với nhà cung cấp rà soát, phân loại lại. Nghị định còn có nội dung về cơ chế thử nghiệm có kiểm soát và quy định chi tiết cách thông báo, gắn nhãn nội dung do AI tạo ra, kể cả các trường hợp ngoại lệ. Khi làm sản phẩm truyền thông có dùng AI, đồng chí cần đọc nguyên văn phần này.

**Quyết định 33/2026/QĐ-TTg** ban hành Danh mục hệ thống trí tuệ nhân tạo có rủi ro cao, có hiệu lực từ 15/8/2026. Theo Bộ Tư pháp, danh mục thuộc 6 lĩnh vực: giáo dục; dân tộc và tôn giáo; y tế; ngân hàng; tố tụng; giao thông vận tải. Đọc các bản tóm tắt, phần lớn ứng dụng nội bộ của Văn phòng như soạn thảo, tóm tắt, tổng hợp kiến nghị cử tri, theo dõi KPI có vẻ không thuộc danh mục. Nhưng chữ "có vẻ" là quan trọng: nếu một ứng dụng phục vụ giám sát chuyên đề về dân tộc, giáo dục, y tế mà tự động chấm điểm, xếp hạng hồ sơ thụ hưởng chính sách, thì phải đọc kỹ nguyên văn danh mục trước khi làm.

**Thông tư 05/2026/TT-BKHCN** ngày 10/3/2026, có hiệu lực cùng ngày, quy định Khung đạo đức trí tuệ nhân tạo quốc gia. Phạm vi áp dụng bắt buộc gồm cơ quan quản lý nhà nước và tổ chức, cá nhân phát triển, cung cấp, triển khai hoặc sử dụng hệ thống AI phục vụ quản lý nhà nước, cung cấp dịch vụ công; các tổ chức, cá nhân khác được khuyến khích áp dụng. Như vậy, khi dùng AI trong công vụ, Văn phòng thuộc phạm vi áp dụng. Khung đạo đức giữ nguyên tắc con người có thẩm quyền quyết định cuối cùng, AI không thay thế trách nhiệm của người ra quyết định, và được rà soát, cập nhật định kỳ 03 năm một lần hoặc khi có thay đổi lớn.

::: {.thuchanh}
**Thực hành: lập phiếu tự phân loại một trang trước khi cho người khác dùng ứng dụng có AI**

1. Ghi tên ứng dụng, mục đích, ai được dùng (cán bộ, đại biểu, khách vô danh).
2. Liệt kê dữ liệu đi vào và xếp vùng ĐỎ/VÀNG/XANH theo Tập 1; ghi rõ dữ liệu nào được gửi cho AI.
3. Ghi nhà cung cấp AI, nơi đặt máy chủ, có qua dịch vụ trung gian hay không.
4. Trả lời: kết quả của AI có được dùng làm căn cứ cho quyết định ảnh hưởng đến quyền, nghĩa vụ của ai không?
5. Đối chiếu với 6 lĩnh vực của danh mục rủi ro cao; nếu có liên quan thì dừng lại, hỏi bộ phận pháp chế.
6. Ghi rõ con người can thiệp ở bước nào (duyệt, sửa, ghi đè) và nhãn minh bạch hiển thị ra sao.
7. Ghi người chịu trách nhiệm, ngày lập, ngày rà lại; lưu phiếu cùng bộ nhớ dự án. Làm lại phiếu mỗi khi đổi chức năng hay mục đích.
:::

::: {.lenhmau}
**Câu lệnh mẫu 3.1 — Soạn nháp phiếu tự phân loại rủi ro**

```text
Vai: chuyên viên pháp chế hỗ trợ cán bộ không chuyên luật.
Bối cảnh: tôi làm một ứng dụng nội bộ tên [tên], mục đích [mô tả],
người dùng là [đối tượng], dữ liệu đầu vào gồm [liệt kê, đã ẩn danh],
ứng dụng gọi AI của [nhà cung cấp] để [việc AI làm].
Việc: soạn nháp phiếu tự phân loại rủi ro theo 7 mục: mục đích; người
dùng; dữ liệu và vùng ĐỎ/VÀNG/XANH; nhà cung cấp và nơi xử lý dữ liệu;
kết quả AI có tác động đến quyền, nghĩa vụ của ai không; điểm con người
can thiệp; nhãn minh bạch.
Ràng buộc: KHÔNG tự ghi số Điều, khoản nào. Chỗ nào cần căn cứ pháp lý
thì ghi "[cần tra nguyên văn]". Chỗ nào thông tin của tôi chưa đủ để
kết luận thì ghi "CHƯA ĐỦ THÔNG TIN" và nêu câu hỏi cần làm rõ.
Dạng: bảng 2 cột (Mục – Nội dung), sau đó là danh sách câu hỏi mở.
```
:::

### 3.2.4. Luật Công nghiệp công nghệ số và Luật Chuyển đổi số

Luật Công nghiệp công nghệ số số 71/2025/QH15 được thông qua ngày 14/6/2025, có hiệu lực từ 01/01/2026, là đạo luật đầu tiên của nước ta có một chương riêng về AI (Chương IV, Điều 41–45). Chương này bị bãi bỏ toàn bộ từ 01/3/2026, khi Luật Trí tuệ nhân tạo có hiệu lực. Vì vậy, khi viết căn cứ về gắn nhãn nội dung AI, không lấy Điều 44 Luật 71 làm căn cứ hiện hành; chỉ nhắc nó như một bước chuyển tiếp lịch sử. Các phần còn lại của Luật 71 (sản phẩm công nghệ số, tài sản số, ưu đãi doanh nghiệp công nghệ số) vẫn còn hiệu lực và đáng tham khảo khi cơ quan mua sắm hoặc đặt hàng phần mềm.

Luật Chuyển đổi số số 148/2025/QH15 được thông qua ngày 11/12/2025, có hiệu lực từ 01/7/2026, thay thế Luật Công nghệ thông tin năm 2006. Đây là luật khung về chính sách chuyển đổi số, Chính phủ số, kinh tế số, xã hội số; các lĩnh vực dữ liệu, giao dịch điện tử, an ninh mạng, trí tuệ nhân tạo vẫn theo luật chuyên ngành. Văn bản thi hành đáng chú ý với người tự làm ứng dụng là Quyết định 1132/QĐ-TTg ngày 24/6/2026 ban hành tiêu chí và Danh mục nền tảng số dùng chung quốc gia trong các cơ quan thuộc hệ thống chính trị.

Hệ quả thực hành rất đơn giản: trước khi tự làm, hãy hỏi "đã có nền tảng dùng chung nào làm việc này chưa?". Văn phòng Quốc hội cũng đang thí điểm các nền tảng số dùng chung cho cơ quan dân cử địa phương, như phòng họp không giấy và phần mềm dân nguyện. Nếu đã có, ứng dụng tự làm chỉ nên đóng vai công cụ thử nghiệm, làm rõ yêu cầu, hoặc bổ trợ ở phần nền tảng chung chưa có. Và dù làm gì, dữ liệu cũng nên được thiết kế để kết nối, chia sẻ được, đừng thành "ốc đảo".

## 3.3. Dữ liệu và dữ liệu cá nhân

### 3.3.1. Luật Dữ liệu: dữ liệu là tài sản phải được phân loại

Luật Dữ liệu số 60/2024/QH15 được thông qua ngày 30/11/2024, có hiệu lực từ 01/7/2025, cùng ngày với Nghị định 165/2025/NĐ-CP quy định chi tiết. Luật đã được sửa đổi, bổ sung; Văn phòng Quốc hội đã có Văn bản hợp nhất 42/VBHN-VPQH ngày 16/3/2026, nên khi trích dẫn nên dùng văn bản hợp nhất. Luật đưa ra khái niệm dữ liệu quan trọng (có thể tác động tới quốc phòng, an ninh, đối ngoại, kinh tế vĩ mô, ổn định xã hội, sức khỏe và an toàn cộng đồng) và dữ liệu cốt lõi (dữ liệu quan trọng có tác động trực tiếp tới các lĩnh vực đó). Tiêu chí nằm ở Nghị định 165; danh mục cụ thể do Thủ tướng ban hành tại Quyết định 20/2025/QĐ-TTg ngày 01/7/2025. Dữ liệu cốt lõi không bao gồm bí mật nhà nước, vốn có luật riêng (mục 3.4).

Với cán bộ tự làm ứng dụng, Luật Dữ liệu đặt ra hai thói quen. Thứ nhất, dữ liệu cần lấy từ cơ sở dữ liệu quốc gia, cơ sở dữ liệu chuyên ngành thì khai thác qua kết nối, chia sẻ chính thức, không tự sao chép về ứng dụng của mình; cơ quan Đảng, Nhà nước khai thác Cơ sở dữ liệu tổng hợp quốc gia không phải nộp phí (Điều 38). Thứ hai, mỗi khối dữ liệu trong ứng dụng phải ghi rõ nguồn gốc và người chịu trách nhiệm. Trong hệ thống của Văn phòng, bản đồ dữ liệu được lập thành bảng: mỗi "dòng" dữ liệu là gì, ai được đọc, ai được ghi. Đó là thứ đầu tiên tôi đưa cho lãnh đạo xem khi được hỏi "dữ liệu nằm ở đâu".

### 3.3.2. Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 được thông qua ngày 26/6/2025, có hiệu lực từ 01/01/2026, gồm 05 chương, 39 điều, nâng các quy định trước đây ở Nghị định 13/2023/NĐ-CP lên thành luật. Luật chia dữ liệu cá nhân thành hai nhóm: dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm. Luật có một điều riêng về bảo vệ dữ liệu cá nhân trong dữ liệu lớn, trí tuệ nhân tạo, chuỗi khối, vũ trụ ảo, điện toán đám mây, với tinh thần: chỉ xử lý đúng mục đích, trong phạm vi cần thiết, có biện pháp bảo mật.

Nghị định 356/2025/NĐ-CP ngày 31/12/2025, có hiệu lực từ 01/01/2026, quy định chi tiết Luật và thay Nghị định 13/2023/NĐ-CP. Hai điều cán bộ nên in ra dán cạnh bàn làm việc:

- **Điều 3 (dữ liệu cá nhân cơ bản):** họ, chữ đệm, tên; ngày sinh; giới tính; nơi sinh, nơi thường trú, nơi ở hiện tại, quê quán, địa chỉ liên hệ; quốc tịch; hình ảnh cá nhân; số điện thoại, số định danh cá nhân, số hộ chiếu; tình trạng hôn nhân; quan hệ gia đình…
- **Khoản 1 Điều 4 (dữ liệu cá nhân nhạy cảm):** quan điểm chính trị; tôn giáo, tín ngưỡng; tình trạng sức khỏe; dữ liệu sinh trắc học, di truyền; đời sống riêng tư; dữ liệu về tội phạm, vi phạm pháp luật; vị trí xác định qua dịch vụ định vị; thông tin tài khoản ngân hàng; tên đăng nhập, mật khẩu tài khoản định danh điện tử…

Việc xử phạt được quy định tại Nghị định 330/2026/NĐ-CP ngày 19/8/2026, có hiệu lực ngay từ ngày ký, về xử phạt vi phạm hành chính trong lĩnh vực an ninh mạng và bảo vệ dữ liệu cá nhân. Đây là lần đầu có cơ chế xử phạt riêng cho vi phạm về bảo vệ dữ liệu cá nhân. Một ví dụ dễ gặp ở người tự làm biểu mẫu khảo sát: hành vi tự coi sự im lặng hoặc không phản hồi của chủ thể dữ liệu là đồng ý để thu thập, xử lý dữ liệu bị phạt từ 50 đến 70 triệu đồng. Ô "đồng ý" đánh dấu sẵn chính là kiểu lỗi đó.

::: {.canhbao}
**Cảnh báo: dễ nhầm số hiệu**

Có một văn bản khác mang số **356/2026/NĐ-CP** (ký ngày 14/9/2026) bãi bỏ một loạt nghị định, không liên quan đến dữ liệu cá nhân. Nghị định hướng dẫn Luật Bảo vệ dữ liệu cá nhân là **356/2025/NĐ-CP**. Ghi sai một chữ số năm là dẫn sai cả văn bản.
:::

### 3.3.3. Áp vào ứng dụng của cơ quan dân cử

Khi đối chiếu danh mục trên với hệ thống của Văn phòng, tôi giật mình nhận ra: mẫu Sơ yếu lý lịch 2C mà phân hệ Quản lý cán bộ số hóa có cả mục "Tôn giáo" và mục "Tình trạng sức khỏe", tức hai loại dữ liệu nhạy cảm, bên cạnh ngày sinh, số căn cước, số sổ bảo hiểm xã hội, quan hệ gia đình. Bảng dưới tóm tắt cách từng loại dữ liệu được xử lý.

| Dữ liệu | Nhóm | Cách xử lý trong hệ thống |
|---|---|---|
| Hồ sơ 2C | Cơ bản và nhạy cảm | Chỉ 2 email Quản trị đọc, ghi; bot không nạp số căn cước, bảo hiểm, gia đình |
| Danh bạ 111 số điện thoại | Cơ bản | Không nằm trong kho mã; Quản trị tự nhập; bot chỉ trả số của đúng người được hỏi |
| Kiến nghị có tên cử tri | Cơ bản | Dòng dữ liệu cố ý không mở đọc công khai |
| Đơn khiếu nại, tố cáo | Có thể nhạy cảm | Không đưa lên AI công cộng; chỉ dùng AI với bản đã ẩn danh |
| Địa chỉ IP của khách | Có thể nhận diện | Chỉ lưu chuỗi băm, không lưu IP gốc |

Với đơn thư, ngoài pháp luật về dữ liệu cá nhân còn có các quy định về bảo vệ người tố cáo, trong đó có việc giữ bí mật danh tính. Ranh giới ĐỎ ở đây tuyệt đối: không dán đơn có danh tính người khiếu nại, tố cáo vào bất kỳ trợ lý AI công cộng nào.

Tôi cũng phải nói thật một điểm chưa trọn vẹn. Bot Telegram, Zalo của Văn phòng nạp họ tên, chức vụ và điểm đánh giá vào lời dẫn gửi cho nhà cung cấp AI để trả lời câu hỏi. Ở bản demo, danh sách người là thật còn điểm số là dữ liệu mô phỏng; khi đã dùng điểm thật, việc gửi dữ liệu ấy ra máy chủ nước ngoài là xử lý dữ liệu cá nhân qua bên thứ ba và phải được đánh giá lại, kể cả khả năng thuộc trường hợp chuyển dữ liệu cá nhân ra nước ngoài. Nghị định 356 đã có biểu mẫu hồ sơ đánh giá tác động xử lý dữ liệu cá nhân và hồ sơ đánh giá tác động chuyển dữ liệu xuyên biên giới; đó là việc của giai đoạn chính thức hóa (Chương 20).

::: {.lenhmau}
**Câu lệnh mẫu 3.2 — Rà soát trường dữ liệu theo pháp luật về dữ liệu cá nhân**

```text
Vai: người rà soát quyền riêng tư cho một ứng dụng nội bộ.
Bối cảnh: dưới đây là danh sách các trường dữ liệu của ứng dụng
[tên] (chỉ tên trường, KHÔNG có dữ liệu thật): [liệt kê].
Việc: với từng trường, cho biết (1) có phải dữ liệu cá nhân không;
(2) thuộc nhóm cơ bản hay nhạy cảm theo danh mục tôi dán kèm
[dán danh mục Điều 3 và khoản 1 Điều 4 Nghị định 356/2025/NĐ-CP];
(3) có thật sự cần cho mục đích [mục đích] không; (4) ai nên được đọc.
Ràng buộc: chỉ dựa vào danh mục tôi dán, không dựa trí nhớ. Trường
nào không chắc thì ghi "CẦN HỎI PHÁP CHẾ".
Dạng: bảng 5 cột ngắn gọn, cuối bảng đề xuất các trường nên bỏ.
```
:::

## 3.4. Bí mật nhà nước, an ninh mạng, an toàn hệ thống thông tin theo cấp độ

### 3.4.1. Luật Bảo vệ bí mật nhà nước năm 2025: lằn ranh đỏ

Luật Bảo vệ bí mật nhà nước số 117/2025/QH15 được thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026, gồm 5 chương, 28 điều; theo Điều 27, Luật số 29/2018/QH14 hết hiệu lực từ cùng ngày. Luật được hướng dẫn bởi Nghị định 63/2026/NĐ-CP ngày 28/02/2026. Ba điểm liên quan trực tiếp đến AI và ứng dụng tự làm:

- Điều 2 bổ sung khái niệm **mạng LAN độc lập**: mạng máy tính cục bộ giới hạn trong một trụ sở cơ quan, tổ chức, không kết nối Internet, mạng viễn thông hay mạng máy tính khác có kết nối ra ngoài trụ sở, và có biện pháp chống kết nối, tấn công trái phép.
- Điều 5 quy định 10 hành vi bị nghiêm cấm, trong đó có việc soạn thảo, lưu giữ tài liệu bí mật nhà nước trên máy tính, thiết bị đang kết nối mạng máy tính (trừ mạng LAN độc lập), Internet hoặc mạng viễn thông, trừ trường hợp lưu giữ theo pháp luật về cơ yếu. Khoản 10 Điều 5 cấm **sử dụng hệ thống trí tuệ nhân tạo hoặc công nghệ mới để xâm phạm bí mật nhà nước**.
- Khoản 1 Điều 5 cấm xác định là bí mật nhà nước đối với thông tin không thuộc danh mục bí mật nhà nước. Tức là không được đóng dấu mật tùy tiện.

Chỉ thị 32/CT-TTg ngày 21/10/2025 về tăng cường bảo vệ bí mật nhà nước trong tình hình mới đề cao trách nhiệm người đứng đầu và, theo bản tóm tắt chính thống, yêu cầu kiểm định an toàn thiết bị, phần mềm trước khi đưa vào sử dụng, không để lộ bí mật khi số hóa tài liệu. Bộ luật Hình sự có tội cố ý làm lộ bí mật nhà nước (Điều 337) và tội vô ý làm lộ bí mật nhà nước, làm mất vật, tài liệu bí mật nhà nước (Điều 338). Ở tỉnh, quy chế bảo vệ bí mật nhà nước đã được xác nhận là Quyết định 05/2022/QĐ-UBND ngày 09/02/2022; tháng 8/2026, Công an tỉnh đã đăng dự thảo quy chế mới, nên đồng chí cần tra xem quy chế mới đã được ban hành chưa.

::: {.canhbao}
**Cảnh báo: những việc tuyệt đối không làm với tài liệu mật**

- Không dán, tải tài liệu, dự thảo có độ mật lên ChatGPT, Gemini, Claude, Gemini Notebook (trước đây là NotebookLM) hay bất kỳ nền tảng AI công cộng nào, kể cả chỉ để "tóm tắt giúp".
- Không đưa tài liệu mật vào ứng dụng tự làm chạy trên dịch vụ đám mây (như Vercel, Supabase, GitHub). Tài liệu mật chỉ xử lý trên máy hoặc mạng LAN độc lập theo quy chế của cơ quan.
- Phiên họp có nội dung bí mật nhà nước: theo tôi, không dùng ứng dụng ghi âm, chuyển giọng nói thành văn bản hay tóm tắt cuộc họp bằng AI trực tuyến; thực hiện đúng quy chế của cơ quan về phương tiện, thiết bị trong phòng họp.
- Pháp luật không cấm dùng AI nói chung. Điều bị cấm là đưa bí mật nhà nước lên, và dùng AI để xâm phạm bí mật nhà nước.
:::

### 3.4.2. Luật An ninh mạng năm 2025 và cấp độ hệ thống thông tin

Luật An ninh mạng số 116/2025/QH15 được thông qua ngày 10/12/2025, có hiệu lực từ 01/7/2026, gồm 8 chương, 58 điều, hợp nhất Luật An ninh mạng năm 2018 và Luật An toàn thông tin mạng năm 2015. Từ 01/7/2026, căn cứ hiện hành là luật này; không dẫn hai luật cũ như luật đang có hiệu lực.

Văn bản quan trọng nhất cho người tự làm ứng dụng là **Nghị định 331/2026/NĐ-CP** ngày 19/8/2026 về bảo vệ an ninh mạng đối với hệ thống thông tin. Nghị định quy định tiêu chí xác định cấp độ từ 1 đến 5 và biện pháp bảo vệ theo từng cấp. Cấp độ 1 gồm hệ thống phục vụ hoạt động nội bộ và chỉ xử lý "thông tin công cộng". Cấp độ 2 có nhóm hệ thống phục vụ hoạt động nội bộ, có xử lý thông tin riêng, thông tin cá nhân của người sử dụng nhưng không xử lý bí mật nhà nước. Cấp độ 3 có tiêu chí hệ thống xử lý thông tin bí mật nhà nước, cùng nhiều tiêu chí khác. Hệ thống đáp ứng tiêu chí của nhiều cấp thì áp cấp cao nhất; Nghị định cấm khoanh phạm vi hệ thống một cách hình thức để hạ cấp độ. Mỗi hệ thống phải có một chủ quản duy nhất; hệ thống đề xuất cấp độ 1, 2 do đơn vị chuyên trách về an ninh mạng của chủ quản thẩm định; cấp độ 3 thẩm định tối đa 15 ngày làm việc, cấp độ 4, 5 tối đa 25 ngày làm việc.

Nghị định 85/2016/NĐ-CP và Thông tư 12/2022/TT-BTTTT về an toàn hệ thống thông tin theo cấp độ nay nên coi là khung cũ, chỉ còn được viện dẫn cho việc chuyển tiếp; các yêu cầu kỹ thuật của chúng (tường lửa, sao lưu, nhật ký) vẫn là thực hành tốt. Nghị định 333/2026/NĐ-CP quy định chi tiết Luật An ninh mạng có yêu cầu doanh nghiệp lưu nhật ký hệ thống tối thiểu 12 tháng; con số ấy là chuẩn tham chiếu tốt cho ứng dụng nội bộ.

Bảng dưới là cách tôi định hướng khi nhìn các phân hệ của Văn phòng. Nó chỉ để tự soi, không thay việc thẩm định của đơn vị chuyên trách.

| Ứng dụng | Đặc điểm dữ liệu | Định hướng |
|---|---|---|
| Bản tin pháp luật | Chỉ tin công khai | Gần với cấp độ 1 |
| Phân hệ có tài khoản, hồ sơ cán bộ, danh bạ | Có thông tin cá nhân | Cấp độ 2 trở lên; lập hồ sơ đề xuất trước khi dùng chính thức |
| Bất cứ thứ gì chạm tới bí mật nhà nước | Bí mật nhà nước | Cấp độ 3 trở lên; không phải việc tự làm trên đám mây công cộng |

Chính kho mã của hệ thống đã ghi sẵn lời nhắc ấy. Tệp hướng dẫn ở thư mục gốc ghi: khi dùng thật với dữ liệu thật thì chuyển sang máy chủ nội bộ cơ quan. Tệp lược đồ cơ sở dữ liệu ghi rõ các chính sách cho đọc công khai chỉ dành cho bản demo, phải gỡ khi dùng thật. Cơ sở dữ liệu đang đặt ở khu vực Singapore; gói miễn phí tạm dừng dự án sau 1 tuần không hoạt động; gói miễn phí của dịch vụ triển khai, theo điều khoản tại thời điểm viết, dành cho mục đích cá nhân, phi thương mại. Những điều đó chấp nhận được cho một bản thử nghiệm với dữ liệu mô phỏng, nhưng không phải hạ tầng của một hệ thống thông tin chính thức.

## 3.5. Giao dịch điện tử, văn thư, lưu trữ

Luật Giao dịch điện tử số 20/2023/QH15, có hiệu lực từ 01/7/2024, quy định giá trị pháp lý của thông điệp dữ liệu (Điều 8), giá trị như văn bản (Điều 9), như bản gốc (Điều 10), giá trị làm chứng cứ (Điều 11), và giá trị pháp lý của chữ ký điện tử (Điều 23); Luật có quy định về chữ ký số chuyên dùng công vụ và một chương riêng về giao dịch điện tử của cơ quan nhà nước. Khi trích, nên ghi "Luật Giao dịch điện tử năm 2023 và các văn bản sửa đổi, bổ sung".

Từ đó suy ra một điều mà người tự làm ứng dụng hay quên: **tệp do phần mềm xuất ra không phải là văn bản đã ban hành**. Phiếu đánh giá Word, biên bản biểu quyết xuất từ bản demo, công văn do Trợ lý AI soạn theo khung thể thức chỉ là bản nháp. Chúng chỉ có giá trị khi người có thẩm quyền ký và ban hành theo đúng quy trình văn thư. Không bao giờ cấu hình để bot hay AI tự động dùng chữ ký số của cá nhân hoặc cơ quan.

Về thể thức, Nghị định 30/2020/NĐ-CP ngày 05/3/2020 về công tác văn thư (07 chương, 38 điều, 06 phụ lục) vẫn được các cơ quan viện dẫn trong kế hoạch năm 2026. Ứng dụng xuất Word phải kiểm quốc hiệu, tiêu ngữ, tên cơ quan, số ký hiệu, nơi nhận đúng mẫu. Riêng văn bản của tổ chức Đảng theo hướng dẫn thể thức riêng của Đảng; nghị quyết của HĐND theo pháp luật về ban hành văn bản quy phạm pháp luật. Phân hệ Kiểm điểm từng in nhầm tên cơ quan hành chính ở đầu bản tự đánh giá; đã sửa thành "TỈNH ỦY THANH HÓA / ĐẢNG ỦY HỘI ĐỒNG NHÂN DÂN TỈNH" vì đó là văn bản của Đảng.

Về lưu trữ, cơ sở dữ liệu trên dịch vụ đám mây miễn phí hay kho mã công khai không phải là "lưu trữ cơ quan". Bản lưu hợp lệ là bản trong hệ thống văn thư, lưu trữ chính thức theo pháp luật về lưu trữ. Ứng dụng tự làm muốn kết quả được dùng làm căn cứ thì phải bảo đảm toàn vẹn, truy xuất được, có nhật ký sửa đổi và xuất được để nộp lưu.

## 3.6. Sở hữu trí tuệ, mã nguồn mở, sáng kiến

### 3.6.1. Ai có quyền với mã nguồn viết cùng AI?

Luật Sở hữu trí tuệ số 50/2005/QH11 đã được sửa đổi nhiều lần, gần nhất bởi Luật số 131/2025/QH15 (hiệu lực 01/4/2026). Bốn quy định cần biết:

- Khoản 1 Điều 22: chương trình máy tính được bảo hộ như tác phẩm văn học, dù thể hiện dưới dạng mã nguồn hay mã máy. Điều 59 xếp chương trình máy tính vào nhóm không được bảo hộ với danh nghĩa sáng chế, nên phần mềm chủ yếu được bảo hộ theo quyền tác giả.
- Khoản 1 Điều 39 (câu chữ năm 2005, cần đối chiếu văn bản hợp nhất mới nhất): tổ chức giao nhiệm vụ sáng tạo cho tác giả thuộc tổ chức mình là chủ sở hữu quyền tài sản và quyền công bố, trừ trường hợp có thỏa thuận khác.
- Khoản 5 Điều 6 (bổ sung năm 2025) giao Chính phủ quy định việc xác lập quyền khi đối tượng được tạo ra có sử dụng hệ thống AI. Nghị định 134/2026/NĐ-CP ngày 06/4/2026 (hiệu lực 09/4/2026) bổ sung Điều 5a vào Nghị định 17/2023/NĐ-CP: quyền tác giả với sản phẩm có sự hỗ trợ của AI chỉ phát sinh khi con người có đóng góp sáng tạo đáng kể, mang tính quyết định và giữ vai trò chủ đạo.
- Khoản 5 Điều 7 (bổ sung năm 2025) cho phép dùng văn bản, dữ liệu đã công bố hợp pháp và công chúng được tiếp cận để nghiên cứu, thử nghiệm, huấn luyện AI, nếu không ảnh hưởng bất hợp lý đến quyền của tác giả. Ngoại lệ này không mở đường cho việc đưa tài liệu nội bộ, tài liệu mật hay dữ liệu cá nhân vào công cụ AI.

Hệ quả thực hành: phần do AI sinh ra nguyên vẹn có thể không được bảo hộ; người cán bộ phải giữ vai trò chủ đạo (tự đặt yêu cầu, lựa chọn, sửa, kiểm thử) và lưu được bằng chứng. Nhật ký thay đổi của dự án, với hàng loạt dòng "người dùng chốt" ghi lại từng quyết định, cùng lịch sử commit trên GitHub chính là bằng chứng ấy. Phần mềm làm khi được cơ quan giao nhiệm vụ thì quyền tài sản thuộc cơ quan, trừ khi có thỏa thuận khác; nên có văn bản giao nhiệm vụ, nhất là với phần việc làm ngoài giờ.

### 3.6.2. Mã nguồn mở và giấy phép

Thông tư 20/2014/TT-BTTTT quy định các sản phẩm phần mềm nguồn mở được ưu tiên mua sắm, sử dụng trong cơ quan nhà nước; danh mục ban đầu có cả PostgreSQL, chính là hệ quản trị cơ sở dữ liệu nằm dưới Supabase mà hệ thống của Văn phòng đang dùng. Dùng phần mềm nguồn mở là được khuyến khích, nhưng phải theo điều khoản của từng giấy phép: giữ nguyên thông báo bản quyền và văn bản giấy phép (MIT, Apache 2.0); thận trọng với giấy phép buộc công bố mã nguồn (GPL, AGPL); lập danh sách thành phần nguồn mở đã dùng; không dùng phần mềm bẻ khóa.

Cần phân biệt "kho công khai" với "mã nguồn mở". Kho mã của hệ thống ở chế độ công khai, ai cũng đọc được, nhưng đến thời điểm viết chưa gắn tệp giấy phép nào. Chưa có giấy phép thì người khác xem được nhưng chưa có căn cứ rõ ràng để sao chép, dùng lại. Muốn cơ quan khác dùng lại hợp pháp, cơ quan chủ sở hữu phải chọn và công bố giấy phép; đó là quyết định của cơ quan, không phải của người viết mã.

::: {.lenhmau}
**Câu lệnh mẫu 3.3 — Kiểm kê thành phần nguồn mở và giấy phép**

```text
Hãy đọc tệp package.json và thư mục node_modules của dự án này.
Lập bảng: tên gói – phiên bản – loại giấy phép – nghĩa vụ chính
(giữ thông báo bản quyền, công bố mã nguồn…). Đánh dấu gói nào có
giấy phép GPL, AGPL hoặc không rõ giấy phép. Không sửa tệp nào.
Chỗ nào không đọc được giấy phép thì ghi "KHÔNG XÁC ĐỊNH".
```
:::

### 3.6.3. Sáng kiến và tinh thần dám nghĩ, dám làm

Luật Khoa học, công nghệ và đổi mới sáng tạo số 93/2025/QH15 (hiệu lực 01/10/2025, thay Luật Khoa học và công nghệ năm 2013) có cơ chế chấp nhận rủi ro đi kèm yêu cầu quản trị rủi ro, và cơ chế thử nghiệm có kiểm soát. Cách hiểu thận trọng: việc miễn, loại trừ trách nhiệm chỉ áp dụng cho nhiệm vụ hoặc thử nghiệm được phê duyệt và tuân thủ đầy đủ quy trình. Ứng dụng cán bộ tự làm rồi đưa vào dùng ngoài khuôn khổ ấy không mặc nhiên được miễn trách nhiệm. Các quy định về sáng kiến và về khuyến khích, bảo vệ cán bộ năng động, sáng tạo vì lợi ích chung cũng cần được tra văn bản hiện hành trước khi viện dẫn.

Con đường chính danh mà tôi đã đi: hệ thống đánh giá được viết thành Báo cáo mô tả sáng kiến trình Hội đồng khoa học; Sổ tay AI được đăng ký thành nhiệm vụ đột phá, có chỉ tiêu, có mốc thời gian, có báo cáo đánh giá. Có quyết định giao nhiệm vụ, có phạm vi thử nghiệm ghi rõ, có kế hoạch quản trị rủi ro bằng văn bản: đó là "tấm khiên" thật cho người dám làm.

## 3.7. Pháp luật về tổ chức, hoạt động của cơ quan dân cử mà phần mềm phải "số hóa đúng"

Phần mềm nghiệp vụ là câu chữ quy định được viết lại thành phép tính. Viết sai một chữ "tổng số" hay quên "làm tròn lên" thì kết quả sai mà màn hình vẫn đẹp. Bảng dưới gom những chỗ hệ thống của Văn phòng phải số hóa đúng.

| Căn cứ | Câu chữ cần số hóa | Quy tắc trong phần mềm |
|---|---|---|
| Luật Tổ chức chính quyền địa phương số 72/2025/QH15 | Quá nửa tổng số đại biểu tán thành | Mẫu số là tổng số đại biểu: 82 → 42; hai phần ba → 55 |
| Nghị định 335/2025/NĐ-CP | 30 + 70 điểm; (a+b+c)/3; trừ 25% mỗi lần | Ba tỷ lệ số lượng, chất lượng, tiến độ từng nhiệm vụ |
| Nghị định 335/2025/NĐ-CP, Điều 20 | Ngưỡng 90, 70, 50 điểm | Bốn mức; điều kiện ngoài điểm tính riêng |
| Quy định 1053-QĐ/TU | Xuất sắc ≤ 20% số Hoàn thành tốt; xong trước ngày 28 | Cảnh báo vượt trần; tháng 12 xong trước 15/12 |
| Hướng dẫn 02-HD/BTCTW | Cấp trực tiếp đề xuất, cấp quản lý quyết định | Nút phê duyệt của con người |
| Nghị định 135/2020/NĐ-CP | Nghỉ hưu vào ngày cuối tháng đủ tuổi | Chỉ nhắc việc, không ra quyết định |

**Luật Tổ chức chính quyền địa phương số 72/2025/QH15** có hiệu lực từ 16/6/2025; chính quyền hai cấp vận hành từ 01/7/2025. Nghị quyết của HĐND được thông qua khi quá nửa tổng số đại biểu tán thành; mẫu số là tổng số đại biểu, không phải số người có mặt hay số người đã bấm. Với 82 đại biểu đặt trong bản demo, quá nửa là từ 42 phiếu; hai phần ba là 82 × 2/3 = 54,67, làm tròn lên thành 55. Ngưỡng hai phần ba chỉ dùng cho những trường hợp luật quy định riêng, và không được lẫn với điều kiện về số đại biểu tham dự kỳ họp. Phân hệ Biểu quyết Online vì thế đánh số đại biểu DB01 đến DB82, không gắn họ tên người thật, gắn nhãn dữ liệu mô phỏng; biểu quyết chính thức phải theo Quy chế làm việc của HĐND và hệ thống được cấp có thẩm quyền cho phép.

**Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân số 121/2025/QH15** được thông qua ngày 10/12/2025, có hiệu lực từ 01/3/2026. Số hiệu các nghị quyết hướng dẫn của Ủy ban Thường vụ Quốc hội trong các nguồn tôi đối chiếu chưa thống nhất, nên tôi không ghi ở đây; trước khi cấu hình thời hạn, trình tự trong một ứng dụng theo dõi kiến nghị sau giám sát, đồng chí phải tra văn bản gốc.

**Nghị định 335/2025/NĐ-CP** ngày 21/12/2025 (hiệu lực 01/01/2026) về đánh giá, xếp loại chất lượng cơ quan hành chính nhà nước và công chức có một nguyên tắc (Điều 4) là ứng dụng khoa học, công nghệ và chuyển đổi số trong theo dõi, đánh giá, xếp loại. Nghị định bãi bỏ các quy định về đánh giá công chức tại Nghị định 90/2020/NĐ-CP. Ví dụ chính thức hay được dẫn: 10 văn bản có 1 văn bản sai sót lớn thì điểm chất lượng là 97,5%.

**Khối Đảng:** Quy định 366-QĐ/TW ngày 30/8/2025 là căn cứ kiểm điểm năm 2026, sẽ được thay bằng Quy định 227-QĐ/TW từ 01/01/2027. Hướng dẫn 02-HD/BTCTW ngày 22/5/2026 ghi nguyên văn: "khuyến khích ứng dụng công nghệ số, quản trị trên dữ liệu theo thời gian thực để theo dõi, kiểm đếm, chấm điểm, đánh giá, xếp loại cán bộ". Ở tỉnh, khoản 4 Điều 3 Quy định 1053-QĐ/TU ngày 05/6/2026 yêu cầu "ứng dụng khoa học, công nghệ, chuyển đổi số, đo lường bằng chỉ số đánh giá hiệu quả công việc (OKR/KPI)"; Hướng dẫn 03-HD/TU ngày 02/7/2026 dùng Phụ lục 2 của chính hướng dẫn này thay cho Mẫu số 5 của Hướng dẫn 43-HD/BTCTW. Đây là căn cứ mạnh nhất để cán bộ mạnh dạn dùng công cụ số trong đánh giá. Nhưng một ứng dụng tự làm vẫn chỉ là bản thử nghiệm, không phải phần mềm dùng thống nhất do cấp có thẩm quyền quyết định.

::: {.cauchuyen}
**Câu chuyện thực tế: một nhiệm vụ làm được 9/10 có phải là "không hoàn thành"?**

Khi tự động áp điều kiện xếp loại, phiên bản đầu của phần mềm coi mọi nhiệm vụ chưa đạt đủ 100% số lượng là "không hoàn thành". Kết quả: một cán bộ điểm cao bị ép xuống mức thấp nhất chỉ vì làm 9/10 việc. AI đã "chọn đại" một cách hiểu. Bản sửa xét theo từng nhiệm vụ: dưới 50% mới là không hoàn thành, từ 50% đến dưới 100% là chưa đạt đủ số lượng, và phần giải thích nói rõ lý do hạ mức. Những chỗ hiểu được nhiều cách đều được hỏi lại, chốt và ghi vào nhật ký. Diễn giải câu chữ quy định là việc phải có người chịu trách nhiệm, không phải việc của máy.
:::

## 3.8. Mười điều tuân thủ cho cán bộ tự làm ứng dụng

| Việc phải làm | Căn cứ chính | Cách làm trong thực tế |
|---|---|---|
| 1. Phân loại dữ liệu trước khi làm | Luật 91/2025/QH15; Nghị định 356/2025/NĐ-CP | Bảng trường dữ liệu: cơ bản, nhạy cảm, ĐỎ/VÀNG/XANH |
| 2. Không đưa tài liệu mật lên AI, đám mây | Luật 117/2025/QH15, Điều 5 | Mật chỉ xử lý trên máy, mạng LAN độc lập theo quy chế |
| 3. Thu thập tối thiểu, phân quyền ở cơ sở dữ liệu | Luật 91/2025/QH15 | Chính sách theo dòng; thử cả vai khách và Quản trị |
| 4. Không để dữ liệu thật, khóa bí mật trong kho mã | Luật 91/2025/QH15; Luật 116/2025/QH15 | Chặn tệp nhạy cảm; khóa chỉ ở máy chủ |
| 5. Tự xác định vai, lập phiếu phân loại rủi ro | Luật 134/2025/QH15; Nghị định 142/2026/NĐ-CP | Phiếu một trang, đối chiếu danh mục rủi ro cao |
| 6. Minh bạch nội dung AI, không giả mạo người thật | Luật 134/2025/QH15, Điều 7, Điều 11 | Nhãn "Trả lời bằng AI"; không dựng giọng, ảnh người thật |
| 7. Máy đề xuất, người quyết định | Luật 134/2025/QH15, khoản 2 Điều 4; Công văn 2766/BKHCN-TTCNTT | Nút phê duyệt; sửa điểm tự gỡ phê duyệt |
| 8. Số hóa đúng câu chữ, tra hiệu lực | Văn bản nghiệp vụ gốc | Đối chiếu biểu mẫu giấy; phép kiểm cho từng ngưỡng |
| 9. Xác định cấp độ trước khi dùng chính thức | Luật 116/2025/QH15; Nghị định 331/2026/NĐ-CP | Hồ sơ đề xuất cấp độ với đơn vị chuyên trách |
| 10. Rõ quyền tác giả, giấy phép, đường chính danh | Luật Sở hữu trí tuệ; Nghị định 134/2026/NĐ-CP; Luật 93/2025/QH15 | Văn bản giao nhiệm vụ; nhật ký; sáng kiến, nhiệm vụ |

::: {.lanhdao}
**Dành cho lãnh đạo**

- Người đứng đầu chịu trách nhiệm về bảo vệ bí mật nhà nước trong cơ quan; cho phép dùng AI thì cần ban hành quy tắc nội bộ, tập huấn và kiểm tra định kỳ.
- Yêu cầu mỗi ứng dụng có AI trình kèm phiếu tự phân loại rủi ro và bản đồ dữ liệu trước khi cho người khác dùng.
- Phân biệt rõ bản demo với dữ liệu mô phỏng và hệ thống chính thức có hồ sơ cấp độ, hạ tầng của cơ quan.
- Muốn bảo vệ người dám làm, hãy giao nhiệm vụ bằng văn bản, có phạm vi thử nghiệm và người chịu trách nhiệm.
:::

## Tóm tắt chương 3

::: {.tomtat}
1. Năm 2026, hành lang pháp lý về số thay đổi lớn; nhiều văn bản Tập 1 dẫn đã được thay thế. Luôn tra hiệu lực trên vbpl.vn hoặc Công báo trước khi viện dẫn.
2. Chủ trương khuyến khích mạnh mẽ ứng dụng AI, nhưng "chấp nhận rủi ro" phải theo cơ chế luật định.
3. Theo Luật Trí tuệ nhân tạo, cán bộ có thể là người sử dụng, còn cơ quan đưa chatbot cho người khác dùng là bên triển khai; phải phân loại rủi ro, minh bạch và giữ quyền quyết định cho con người.
4. Dữ liệu cá nhân chia thành cơ bản và nhạy cảm; hồ sơ 2C có cả hai loại. Thu thập tối thiểu, phân quyền ở cơ sở dữ liệu, không đưa vào kho mã công khai.
5. Tài liệu mật không bao giờ lên AI công cộng hay dịch vụ đám mây; ứng dụng dùng chính thức phải xác định cấp độ hệ thống thông tin.
6. Tệp phần mềm xuất ra chỉ là bản nháp; giá trị pháp lý đến từ chữ ký và quy trình văn thư.
7. Quyền tác giả với sản phẩm có AI hỗ trợ chỉ phát sinh khi con người giữ vai trò chủ đạo; kho công khai chưa phải là mã nguồn mở.
:::

## Câu hỏi suy ngẫm và bài tập

1. Trong công việc tuần này, đồng chí đã đóng vai nào theo Luật Trí tuệ nhân tạo? Cơ quan của đồng chí có đang là bên triển khai hệ thống AI nào không?
2. Lấy một biểu mẫu của phòng, dùng Câu lệnh mẫu 3.2 với tên trường (không có dữ liệu thật) để xếp nhóm dữ liệu. Có trường nào không thật sự cần?
3. Lập phiếu tự phân loại rủi ro cho một ứng dụng có AI mà đồng chí muốn làm. Câu hỏi nào khó trả lời nhất, vì sao?
4. Vì sao một tệp Word do phần mềm xuất ra chưa phải là văn bản? Phải thêm những bước nào?
5. Tra trên vbpl.vn tình trạng hiệu lực của ba văn bản dẫn trong chương. Có văn bản nào đã thay đổi sau ngày 26/10/2026 không?
