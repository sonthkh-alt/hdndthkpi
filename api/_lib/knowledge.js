// ============================================================================
//  KIẾN THỨC TĨNH về hệ thống — nạp cho AI để trả lời câu hỏi "dùng thế nào",
//  "tính điểm ra sao", "ai được làm gì". Số liệu thật lấy riêng ở facts.js.
//  ⚠️ TUYỆT ĐỐI không ghi mật khẩu quản trị vào đây.
// ============================================================================
export const SITE = 'https://hdndthkpi.vercel.app';

export const KNOWLEDGE = `# HỆ THỐNG ĐÁNH GIÁ, XẾP LOẠI — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa
Bản demo thử nghiệm, dùng nội bộ. Địa chỉ: ${SITE}

## Các phân hệ (từ Trang chủ bấm vào thẻ để mở)
1. Đánh giá OKR/KPI cán bộ, công chức — ${SITE}/#/okr
   Chấm hằng THÁNG. Thang 100 điểm = Nhóm I "tiêu chí chung" (tối đa 30đ) + Nhóm II "kết quả nhiệm vụ" (tối đa 70đ) − điểm trừ.
   Nhóm II chấm theo 3 tiêu chí khách quan của Nghị định 335/2025/NĐ-CP: Số lượng (hoàn thành/được giao), Chất lượng (đạt chuẩn 100% · có sai sót 75% · chưa đạt 50%), Tiến độ (đúng hạn 100% · chậm ít 80% · trễ hạn 50%).
   Kết quả mỗi nhiệm vụ = (Số lượng + Chất lượng + Tiến độ)/3, từ đó suy ra Mức độ hoàn thành. Có điểm thưởng vượt định mức (+0,1đ cho mỗi 1% vượt, tối đa +5đ).
   Bốn mức xếp loại: Hoàn thành xuất sắc nhiệm vụ (≥90) · Hoàn thành tốt (≥70) · Hoàn thành (≥50) · Không hoàn thành (<50), kèm điều kiện Điều 8: muốn xuất sắc phải đạt đủ 100% số lượng mọi nhiệm vụ và có ≥30% nhiệm vụ vượt mức; bị kỷ luật thì xếp Không hoàn thành. Trần: số người xuất sắc ≤ 20% số người hoàn thành tốt.
2. Kiểm điểm, đánh giá, xếp loại đảng viên — ${SITE}/#/kiemdiem
   Chấm hằng QUÝ, cho cán bộ diện Ban Thường vụ Tỉnh ủy quản lý, theo Hướng dẫn 03-HD/TU.
   Thang 100 = Nhóm A tiêu chí chung 30đ (chấm nhị phân: đảm bảo hoặc không) + Nhóm B 70đ theo 6 trục kết quả trọng tâm.
   Mỗi trục: Điểm = KPI% × điểm tối đa của trục; KPI của trục = trung bình có trọng số các nhiệm vụ, mỗi nhiệm vụ chọn Mức độ hoàn thành (Xuất sắc 100% · Tốt 90% · Cơ bản 75% · Chưa hoàn thành 55% · Không hoàn thành 30%) và Tầm quan trọng (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2).
   Xuất Word đúng Phụ lục 3A (bản tự đánh giá cá nhân) và Phụ lục 4 (bảng tổng hợp).
3. Đánh giá tiêu chí HĐND tỉnh, xã, phường — ${SITE}/#/tieuchi
   Theo Khung tiêu chí nhiệm kỳ 2026-2031. Phụ lục I cho HĐND cấp tỉnh, Phụ lục II cho cấp xã, phường.
   Tổng = 7 nhóm tiêu chí (100đ) + nhóm VIII điểm thưởng (tối đa 10đ) − nhóm IX điểm trừ (tối đa 20đ), kẹp trong khoảng 0–110.
   Năm mức xếp loại (Điều 6): Xuất sắc ≥90 · Tốt 80–89 · Khá 65–79 · Trung bình 50–64 · Yếu <50.
   Điều kiện kèm theo: muốn Xuất sắc phải đạt điểm nhóm V ≥60% và có ≥2 mô hình mới (cấp tỉnh) hoặc ≥1 mô hình (cấp xã); muốn Tốt cần nhóm V ≥40% và ≥1 mô hình. Cấp xã còn bị trần: tối đa 25% số đơn vị được xếp Xuất sắc.
   Đơn vị đăng nhập bằng MÃ ĐƠN VỊ + MÃ TRUY CẬP do Thường trực HĐND tỉnh cấp (mã truy cập chỉ lưu dạng băm SHA-256).
   Bấm vào TÊN ĐƠN VỊ trong bảng kết quả là mở được phiếu tự đánh giá của đơn vị đó (như nút "Mở phiếu"). Khách xem được nhưng không sửa.
   Quy trình: đơn vị tự chấm → gửi → Tổ công tác thẩm định → Thường trực HĐND tỉnh phê duyệt. Sửa lại điểm sau khi đã phê duyệt thì phê duyệt tự động bị gỡ.
4. Trợ lý AI nghiệp vụ dân cử — ${SITE}/#/troly
   Tám việc trong một phân hệ: (1) Trợ lý kỳ họp — tải tài liệu kỳ họp lên rồi phân tích (so sánh số liệu tìm mâu thuẫn, đề xuất câu hỏi chất vấn, kiểm tra tuân thủ nghị quyết, phân tích điểm nghẽn ngân sách, tóm tắt rủi ro chính sách, hoặc tự đặt câu hỏi); (2) Soạn thảo văn bản hành chính theo thể thức Nghị định 30/2020/NĐ-CP, sửa từng phần rồi xuất Word; (3) Soạn bài phát biểu của lãnh đạo; (4) Soát xét, kiểm lỗi văn bản (chính tả, thể thức NĐ 30, văn phong, logic quản lý) — trả về bảng lỗi kèm đề xuất sửa; (5) Thẩm tra dự thảo nghị quyết theo 4 phần chuẩn của HĐND, xuất Word báo cáo thẩm tra; (6) Kiến nghị cử tri — nhập, phân loại, theo dõi trạng thái và nhờ AI tổng hợp từ tệp hoặc phân tích xu hướng; (7) Thư viện tài liệu dùng chung làm ngữ cảnh cho Trợ lý kỳ họp; (8) Hỏi đáp tự do.
   ⚠️ Mỗi lượt gọi AI đều tốn phí khóa dịch vụ nên phân hệ này CHỈ phục vụ người đã đăng nhập bằng tài khoản cơ quan (khách chỉ xem giao diện). Tài liệu tải lên tối đa 3 MB mỗi tệp; PDF bản chụp (scan) không trích được chữ.
   ⚠️ Nội dung do AI sinh ra chỉ để tham khảo, người dùng phải rà soát thể thức, căn cứ pháp lý và số liệu trước khi sử dụng chính thức. Trợ lý chat KHÔNG đọc được nội dung người dùng đã soạn hay tài liệu họ tải lên trong phân hệ này.
5. Giám sát số Thanh Hóa — ${SITE}/#/giamsat (mở sang https://sonthkh-alt.github.io/giamsat/)
   Quản lý hoạt động giám sát của cơ quan dân cử theo Luật Hoạt động giám sát số 121/2025/QH15 (hiệu lực 01/3/2026), Nghị quyết 114/2025/UBTVQH15 và Nghị quyết 115/2025/UBTVQH15.
   Mọi hồ sơ thuộc đúng một trong 12 nhóm nghiệp vụ GS-01 đến GS-12 (thẩm tra báo cáo · giám sát văn bản quy phạm pháp luật · chất vấn · giải trình · giám sát chuyên đề · khiếu nại, tố cáo · kiến nghị cử tri · thi hành pháp luật ở địa phương · lấy phiếu tín nhiệm · thực hiện nghị quyết về giám sát · theo dõi kết luận, kiến nghị · giám sát lại), mỗi hồ sơ gắn kèm chủ thể giám sát và cấp hành chính. Nhóm GS-09 (tín nhiệm) chưa triển khai.
   Trọng tâm đang chạy là giám sát nghị quyết của HĐND 166 xã, phường: hằng tháng hệ thống rà dấu hiệu cảnh báo, chấm điểm rủi ro, xếp hạng và TRÌNH danh mục đề xuất; quyền quyết định danh mục chính thức thuộc Thường trực HĐND tỉnh — máy đề xuất, người quyết định, không có bốc thăm tự động.
   Thẩm định thang 100 điểm (thẩm quyền và hình thức 20 · trình tự, thủ tục 20 · tính hợp hiến, hợp pháp, thống nhất 30 · thể thức, kỹ thuật trình bày 10 · tính khả thi 20). Xếp loại: Tốt ≥90 · Khá 75-89 · Đạt 60-74 · Chưa đạt <60; có nội dung trái pháp luật thì luôn là Chưa đạt, bất kể tổng điểm.
   Theo dõi sau giám sát: mỗi kết luận, kiến nghị tách thành nhiệm vụ riêng, nhắc trước hạn 15/7/3 ngày; quá hạn thì yêu cầu giải trình theo Điều 40 (15 ngày, việc phức tạp không quá 30 ngày) và đi theo bảy bước đôn đốc → kiến nghị cấp có thẩm quyền xử lý → giải trình → chất vấn → giám sát lại → báo cáo HĐND.
   ⚠️ Đây là HỆ THỐNG RIÊNG (mã nguồn, dữ liệu và tài khoản đăng nhập tách biệt với hệ thống đánh giá). Trợ lý KHÔNG đọc được số liệu của phân hệ này — chỉ đưa đường dẫn để người hỏi tự mở, tuyệt đối không đoán hay bịa số nghị quyết, điểm thẩm định, tên đơn vị bị xếp loại.
6. Quản lý lịch công tác tuần — ${SITE}/#/lichcongtac (mở sang https://calendar-beta-lac.vercel.app)
   Lịch công tác tuần của Thường trực HĐND tỉnh và lãnh đạo 4 Ban: cán bộ Văn phòng nhập lịch tuần sau (thường vào thứ Sáu), lãnh đạo duyệt hoặc điều chỉnh, Văn phòng điều xe (có cảnh báo trùng xe) và in lịch tuần.
   Đối tượng có lịch: 2 Phó Chủ tịch HĐND tỉnh, lãnh đạo Đoàn ĐBQH tỉnh, 4 Ban (Kinh tế - Ngân sách, Pháp chế, Văn hóa - Xã hội, Dân tộc) và lãnh đạo Văn phòng (trực cuối tuần).
   Buổi: Sáng · Chiều · Cả ngày · Theo giờ. Trạng thái: Chờ duyệt → Đã duyệt / Đã điều chỉnh (có ghi chú) / Từ chối (có lý do). Sửa lại mục đã bị từ chối thì tự quay về Chờ duyệt.
   Xe ô tô: xe riêng gắn với từng Phó Chủ tịch và xe dùng chung; hệ thống cảnh báo khi một xe bị xếp trùng giờ.
   ⚠️ Đây là HỆ THỐNG RIÊNG (mã nguồn, cơ sở dữ liệu và tài khoản đăng nhập tách biệt với hệ thống đánh giá) nhưng trợ lý ĐỌC ĐƯỢC lịch của tuần này và tuần sau — xem phần SỐ LIỆU HỆ THỐNG. Muốn xem xa hơn hai tuần đó thì chỉ đường dẫn cho người dùng tự mở.
7. Quản lý cán bộ (chỉ Quản trị) — ${SITE}/#/canbo
   Hồ sơ 2C/TCTW-98 và nhắc việc nhân sự: nâng bậc lương (chu kỳ 36 hoặc 24 tháng theo Thông tư 08/2013), nghỉ hưu (lộ trình Nghị định 135/2020), sinh nhật, hết hạn hợp đồng, hết nhiệm kỳ bổ nhiệm, nhiệm vụ định kỳ, biên chế.
   ĐÂY LÀ DANH SÁCH CÁN BỘ DUY NHẤT của cả hệ thống. Hai phân hệ chấm điểm không tự thêm/sửa/xóa cán bộ nữa, chỉ chấm điểm; muốn thêm người hoặc sửa họ tên, chức vụ, đơn vị thì làm ở đây.
   Mỗi hồ sơ có trường "Diện quản lý cán bộ": Thuộc diện Ban Thường vụ Tỉnh ủy quản lý / Không thuộc diện. Trường này tách danh sách giữa hai phân hệ:
   - Phân hệ Kiểm điểm lấy những người có cờ "Thuộc diện BTV Tỉnh ủy quản lý".
   - Phân hệ OKR/KPI lấy cán bộ, công chức, người lao động của Văn phòng (đơn vị là "Văn phòng" hoặc một phòng trực thuộc).
   Lãnh đạo Văn phòng vừa thuộc diện BTV vừa là cán bộ Văn phòng nên có mặt ở CẢ HAI phân hệ: hằng tháng chấm KPI, hằng quý kiểm điểm.
8. Hướng dẫn và hỗ trợ sử dụng — ${SITE}/#/hotro
   Hướng dẫn cho toàn hệ thống: bắt đầu nhanh theo vai trò, tài khoản và phân quyền, cách tính điểm, quy trình và mốc thời gian, cơ sở pháp lý, hỏi đáp, liên hệ.

## Tài khoản và phân quyền
- Khách (không cần đăng nhập): xem được mọi nội dung, thử chấm điểm nhưng KHÔNG lưu.
- Tài khoản dùng thử: user@thanhhoa.gov.vn / password.
- Cán bộ: đăng nhập bằng email cơ quan, tự chấm phần "Tự đánh giá" của mình.
- Trưởng phòng: chấm cột "Cấp duyệt" cho người trong phòng mình.
- Quản trị: toàn quyền, phê duyệt, quản lý danh mục, quản lý cán bộ. (Không cung cấp mật khẩu quản trị cho bất kỳ ai qua chat.)
- Nguyên tắc chung: cột "Tự đánh giá" do cán bộ nhập, cột "Cấp duyệt" do cấp trên rà soát và chính cột này được dùng để xếp loại. Cấp duyệt bỏ trống thì mặc định kế thừa số của cán bộ.

## Mốc thời gian
Chấm điểm OKR/KPI hằng tháng, chốt trước ngày 15/12 với kỳ tháng 12. Kiểm điểm theo quý (I–IV). Tiêu chí HĐND đánh giá theo năm.

## Liên hệ
Đồng chí Hà Ngọc Sơn, Phó Chánh Văn phòng — điện thoại 0904818886, thư điện tử sonthkh@gmail.com.

## Cơ sở pháp lý chính
Nghị định 335/2025/NĐ-CP về đánh giá, xếp loại cán bộ, công chức; Quyết định 1053-QĐ/TU ngày 05/6/2026 của Tỉnh ủy Thanh Hóa; Hướng dẫn 03-HD/TU ngày 02/7/2026; Quyết định 73-QĐ/TU ngày 14/11/2025; Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã nhiệm kỳ 2026-2031; Thông tư 08/2013/TT-BNV; Nghị định 135/2020/NĐ-CP.`;

export const SYSTEM_PROMPT = `Bạn là trợ lý của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa, trả lời qua khung chat (Telegram/Zalo).

QUY TẮC:
1. Trả lời bằng tiếng Việt có dấu, lịch sự, ngắn gọn, đi thẳng vào việc. Hợp với khung chat: dùng gạch đầu dòng, tránh bảng biểu rộng, không dùng cú pháp Markdown phức tạp (chỉ *đậm* và gạch đầu dòng).
2. Khi câu hỏi liên quan đến số liệu, CHỈ dùng số trong phần "SỐ LIỆU HỆ THỐNG" bên dưới. Không được tự bịa hay ước lượng con số. Nếu số liệu không có trong đó, nói thẳng là chưa có và chỉ đường dẫn để người hỏi tự xem.
3. Khi câu hỏi về cách dùng, cách tính điểm, quy định — dùng phần "HIỂU BIẾT VỀ HỆ THỐNG".
4. Câu hỏi ngoài phạm vi hệ thống (kiến thức chung, soạn thảo văn bản, tra cứu, dịch thuật…) thì cứ trả lời bình thường bằng kiến thức của bạn, nhưng nói rõ đó không phải số liệu của hệ thống.
5. Đây là BẢN DEMO THỬ NGHIỆM. Nếu người hỏi định dùng kết quả vào việc chính thức, nhắc họ đối chiếu lại trên phần mềm.
6. Tuyệt đối KHÔNG cung cấp mật khẩu, mã truy cập của đơn vị, số căn cước, số bảo hiểm xã hội hay thông tin gia đình của cán bộ. Nếu được hỏi, từ chối và hướng dẫn liên hệ Quản trị.
7. Trả lời gọn dưới 200 từ trừ khi người hỏi yêu cầu chi tiết.`;
