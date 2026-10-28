// ============================================================================
//  BỘ KHỞI TẠO TỦ SÁCH
//
//  Nội dung cuốn sách dưới đây được lấy TỪ CHÍNH BẢN THẢO tác giả cung cấp
//  (`docs/Tri_tue_nhan_tao_trong_cong_tac_tham_muu_-_Ha_Ngoc_Son.pdf`, 271 trang):
//  tên chương và số trang đọc từ mục lục thật, tóm tắt và đối tượng bạn đọc
//  rút từ Lời nói đầu, tiểu sử rút từ trang cuối sách. KHÔNG bịa thêm giải
//  thưởng, số bản in, đánh giá hay nhận xét nào.
//
//  ⚠️ `choTai` mặc định BẬT vì tác giả đã chủ động đưa bản PDF vào dự án. Trang
//     web này công khai: nếu sách chuẩn bị xuất bản hoặc có ràng buộc bản quyền
//     với nhà xuất bản, hãy TẮT công tắc "Cho phép đọc, tải toàn văn" trong
//     phân hệ — khi đó chỉ còn phần giới thiệu, bìa và mục lục.
// ============================================================================

import { chuanHoaTS } from './tuSach.js';

export const TEP_SACH_AI = '/sach/tri-tue-nhan-tao-trong-cong-tac-tham-muu.pdf';
export const BIA_SACH_AI = '/sach/bia-ttnt-tham-muu.svg';

export const SACH_AI_THAM_MUU = {
  id: 's-ai-tham-muu', ma: 'S-01',
  ten: 'Trí tuệ nhân tạo trong công tác tham mưu',
  phuDe: 'Cẩm nang thực hành dành cho cán bộ tham mưu cơ quan dân cử và hành chính',
  tacGia: 'Hà Ngọc Sơn',
  hocVi: 'Tiến sĩ Quản lý Kinh tế',
  chucDanh: 'Phó Chánh Văn phòng Đoàn Đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa',
  theLoai: 'Cẩm nang thực hành',
  namHoanThanh: '2026', nhaXB: '', isbn: '',
  soTrang: 271, soChuong: 7, soPhuLuc: 3,
  trangThai: 'gioi-thieu', noiBat: false,
  anhBia: BIA_SACH_AI, tepToanVan: TEP_SACH_AI, choTai: true,

  tomTat: [
    'Cuốn sách trả lời một câu hỏi rất cụ thể: cán bộ tham mưu ở Văn phòng các cơ quan dân cử và hành chính dùng trí tuệ nhân tạo vào công việc hằng ngày như thế nào cho đúng và an toàn.',
    'Sách đi từ nền tảng (AI là gì, prompt là gì, chọn công cụ nào) đến các ứng dụng cụ thể trong soạn thảo văn bản hành chính, rà soát - đối chiếu văn bản pháp quy, phân tích dữ liệu phản hồi và đánh giá tác động chính sách; khép lại bằng chương về an toàn thông tin, đạo đức AI và quy tắc sử dụng AI trong cơ quan nhà nước.',
    'Điểm khác biệt là tính thực hành: mỗi chương có hướng dẫn từng bước, hộp "Mẹo thực hành" - "Cảnh báo" - "Tình huống thực tế" - "Prompt mẫu", bảng kiểm trước khi trình ký và bài tập áp dụng. Cuối sách là thư viện 60 prompt mẫu sao chép dùng được ngay.',
  ].join('\n\n'),

  diemNoiBat: [
    'Viết riêng cho bối cảnh Việt Nam: bám hệ thống văn kiện và pháp luật trong nước, dùng đúng thuật ngữ hành chính - chính sách công, không dịch lại tài liệu nước ngoài.',
    'Khung prompt VAI - BỐI - VIỆC - DẠNG - RÀNG: một công thức giao việc cho AI mà cán bộ có thể áp dụng ngay cho mọi loại văn bản.',
    'Thư viện 60 prompt mẫu hoàn chỉnh, phân theo 6 nhóm chức năng tham mưu, sao chép dùng được không cần sửa nhiều.',
    'Bảng kiểm trước khi trình ký cho từng loại văn bản — chốt chặn để kết quả của AI không đi thẳng vào hồ sơ trình.',
    'Một chương riêng về an toàn thông tin và đạo đức AI: dữ liệu nào tuyệt đối không được đưa lên công cụ AI, trách nhiệm thuộc về ai khi có sai sót.',
    'Nói thẳng cả những việc AI KHÔNG làm được và các rủi ro — tác giả chủ trương "viết thật thà" thay vì giọng quảng cáo công nghệ.',
    'Mỗi chương có bài tập thực hành, dùng được làm tài liệu giảng dạy và bồi dưỡng cán bộ.',
    'Phụ lục gợi ý 15 đề tài nghiên cứu cho sinh viên năm cuối và học viên cao học.',
  ],

  doiTuong: [
    { ten: 'Cán bộ tham mưu cơ quan dân cử và hành chính cấp tỉnh', moTa: 'Văn phòng Đoàn ĐBQH và HĐND, Văn phòng UBND, Văn phòng Tỉnh ủy và các phòng tham mưu chuyên môn của sở, ngành — những người soạn báo cáo, tờ trình, dự thảo nghị quyết hằng ngày.' },
    { ten: 'Giảng viên và sinh viên quản trị công', moTa: 'Đặc biệt sinh viên năm cuối các ngành Quản lý Nhà nước, Quản lý Kinh tế, Hành chính công — những người sẽ là cán bộ tham mưu trong vài năm tới. Mỗi chương đều có bài tập phù hợp giảng dạy trên lớp.' },
    { ten: 'Cán bộ làm công tác đào tạo, bồi dưỡng', moTa: 'Trường chính trị, trung tâm bồi dưỡng cán bộ — dùng làm tài liệu tham khảo cho các khóa bồi dưỡng kỹ năng số, kỹ năng tham mưu trong điều kiện chuyển đổi số.' },
  ],

  mucLuc: [
    { loai: 'mo-dau', so: '', ten: 'Lời nói đầu', trang: 1, moTa: 'Vì sao lúc này, sách dành cho ai, cấu trúc và cách đọc, văn phong và những giới hạn của cuốn sách.' },
    { loai: 'chuong', so: '1', ten: 'Bối cảnh chuyển đổi số và yêu cầu đổi mới công tác tham mưu', trang: 7, moTa: 'Đặt vấn đề ở cấp đường lối chính sách và thực tiễn công vụ — vì sao cán bộ tham mưu cần học dùng AI lúc này.' },
    { loai: 'chuong', so: '2', ten: 'Trí tuệ nhân tạo và các công cụ AI phổ biến cho cán bộ công vụ', trang: 26, moTa: 'Giới thiệu các công cụ AI phổ biến giữa năm 2026 và cách chọn công cụ phù hợp với từng loại việc.' },
    { loai: 'chuong', so: '3', ten: 'Kỹ thuật prompt cơ bản và nâng cao cho công tác tham mưu', trang: 51, moTa: 'Kỹ năng nền cho mọi ứng dụng sau: khung VAI - BỐI - VIỆC - DẠNG - RÀNG, prompt nhiều bước, tự phản biện.' },
    { loai: 'chuong', so: '4', ten: 'Ứng dụng AI trong soạn thảo văn bản hành chính', trang: 83, moTa: 'Sáu loại văn bản phổ biến: báo cáo tổng hợp, tờ trình, công văn… đúng thể thức Nghị định 30/2020/NĐ-CP.' },
    { loai: 'chuong', so: '5', ten: 'Ứng dụng AI trong rà soát, đối chiếu văn bản pháp quy', trang: 110, moTa: 'Phát hiện trùng lặp, mâu thuẫn, dẫn chiếu sai giữa dự thảo với hệ thống văn bản hiện hành.' },
    { loai: 'chuong', so: '6', ten: 'Ứng dụng AI trong phân tích dữ liệu phản hồi và đánh giá tác động chính sách', trang: 132, moTa: 'Phân nhóm chủ đề ý kiến cử tri, phân tích định lượng phục vụ đánh giá tác động chính sách.' },
    { loai: 'chuong', so: '7', ten: 'An toàn thông tin, đạo đức AI và quy tắc sử dụng AI trong cơ quan nhà nước', trang: 155, moTa: 'Dữ liệu nào không được đưa lên AI, trách nhiệm khi có sai sót, khung quy tắc sử dụng AI cho cơ quan.' },
    { loai: 'phu-luc', so: 'A', ten: 'Thư viện 60 prompt mẫu', trang: 176, moTa: 'Sáu nhóm chức năng tham mưu, mỗi prompt viết sẵn theo khung VAI - BỐI - VIỆC - DẠNG - RÀNG, sao chép dùng ngay.' },
    { loai: 'phu-luc', so: 'B', ten: 'Định hướng 15 đề tài nghiên cứu', trang: 231, moTa: 'Gợi ý đề tài cho sinh viên năm cuối, học viên cao học ngành Quản lý Nhà nước, Quản lý Kinh tế.' },
    { loai: 'phu-luc', so: 'C', ten: 'Danh mục công cụ AI và tài nguyên tham khảo', trang: 244, moTa: 'Công cụ AI, tài nguyên học tập, cộng đồng và mạng lưới — cập nhật giữa năm 2026.' },
    { loai: 'cuoi-sach', so: '', ten: 'Thuật ngữ và các từ viết tắt', trang: 258, moTa: 'Giải thích thuật ngữ theo thứ tự chữ cái, có dẫn về chương liên quan; bảng từ viết tắt Việt - Anh.' },
    { loai: 'cuoi-sach', so: '', ten: 'Về tác giả', trang: 271, moTa: '' },
  ],

  tuKhoa: ['trí tuệ nhân tạo', 'AI', 'tham mưu', 'chuyển đổi số', 'prompt', 'văn bản hành chính', 'quản trị công', 'Nghị quyết 57-NQ/TW'],

  trichLoiNoiDau: 'Đó là điểm bước ngoặt. Tôi nhận ra: vấn đề không phải ở AI, mà ở cách mình giao việc cho AI. Cũng giống như giao việc cho một thư ký mới, nếu hướng dẫn mơ hồ thì kết quả mơ hồ; nếu mô tả rõ ràng bối cảnh, yêu cầu, ràng buộc, thì kết quả dùng được.',

  tieuSuTacGia: [
    'Tốt nghiệp Đại học Bách khoa Hà Nội chuyên ngành Điện tử Viễn thông, sau đó nhận bằng Tiến sĩ ngành Quản lý Kinh tế.',
    'Đã trải qua nhiều cương vị trong hệ thống quản lý nhà nước cấp tỉnh: chuyên viên Phòng Tổng hợp - Kế hoạch Văn phòng UBND tỉnh; nguyên Phó Chủ tịch UBND huyện Ngọc Lặc, tỉnh Thanh Hóa; hiện là Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.',
    'Lĩnh vực nghiên cứu chính: ứng dụng trí tuệ nhân tạo trong quản trị công Việt Nam; chuyển đổi số trong các cơ quan dân cử và hành chính; chính sách công và quản lý kinh tế.',
  ].join('\n\n'),

  lienKet: [],
  capNhat: '',
};

// ---------------------------------------------------------------------------
//  TẬP 2 — nội dung lấy TỪ CHÍNH BẢN THẢO `docs/sach-ai-tap-2/` (335 trang A4):
//  tên chương và số trang đọc từ bản PDF đã dàn trang, tóm tắt và đối tượng
//  bạn đọc rút từ Lời nói đầu + "Hướng dẫn sử dụng cuốn sách". Tác giả chủ
//  động đề nghị đưa vào tủ sách nên `choTai` BẬT như Tập 1.
// ---------------------------------------------------------------------------
export const TEP_SACH_AI_2 = '/sach/tri-tue-nhan-tao-trong-cong-tac-tham-muu-tap-2.pdf';
export const BIA_SACH_AI_2 = '/sach/bia-ttnt-tham-muu-tap-2.svg';

const chuong = (so, ten, trang, moTa) => ({ loai: 'chuong', so: String(so), ten, trang, moTa });

export const SACH_AI_TAP_2 = {
  id: 's-ai-tham-muu-tap-2', ma: 'S-02',
  ten: 'Trí tuệ nhân tạo trong công tác tham mưu — Tập 2: Từ người dùng đến người kiến tạo',
  phuDe: 'Cùng AI xây dựng ứng dụng và đổi mới cách làm việc tại cơ quan dân cử — Kinh nghiệm thực tiễn tại Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa',
  tacGia: 'Hà Ngọc Sơn',
  hocVi: 'Tiến sĩ Quản lý Kinh tế',
  chucDanh: 'Phó Chánh Văn phòng Đoàn Đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa',
  theLoai: 'Cẩm nang thực hành',
  namHoanThanh: '2026', nhaXB: '', isbn: '',
  soTrang: 335, soChuong: 20, soPhuLuc: 6,
  trangThai: 'gioi-thieu', noiBat: true,
  anhBia: BIA_SACH_AI_2, tepToanVan: TEP_SACH_AI_2, choTai: true,

  tomTat: [
    'Tập 1 dừng ở vai NGƯỜI DÙNG: hỏi AI, nhận bản nháp, sửa rồi dùng. Tập 2 đi tiếp sang vai NGƯỜI KIẾN TẠO: cán bộ không chuyên lập trình giao việc cho tác tử AI lập trình để cùng làm ra công cụ phục vụ chính công việc của cơ quan.',
    'Chất liệu của sách là một hệ thống có thật — hệ thống thử nghiệm của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa với hơn mười phân hệ: đánh giá, xếp loại cán bộ theo OKR/KPI, kiểm điểm đảng viên hằng quý, tiêu chí HĐND tỉnh và xã, biểu quyết trực tuyến, trợ lý AI nghiệp vụ dân cử, trợ lý chat qua Zalo và Telegram, bản tin pháp luật tự động, sổ tay AI có trích dẫn nguồn. Sách kể cả những lần hệ thống sập, nguyên nhân gốc và cách sửa, vì người đi sau học được nhiều nhất từ chỗ vấp.',
    'Năm phần đi từ nền tảng và hành lang pháp lý, qua bộ công cụ và kỷ luật làm việc, tới từng phân hệ thực chiến, AI trong nghiệp vụ hằng ngày và cách vận hành bền vững. Văn bản pháp luật được đối chiếu tình trạng hiệu lực đến ngày 26/10/2026; hệ thống mô tả trong sách là bản demo thử nghiệm, sử dụng nội bộ.',
  ].join('\n\n'),

  diemNoiBat: [
    'Nối mạch trực tiếp với Tập 1: khung VAI - BỐI - VIỆC - DẠNG - RÀNG được mở rộng thêm phần Nghiệm thu để giao việc cho tác tử AI lập trình; phân loại dữ liệu 4 cấp và quy chế sử dụng AI được áp vào việc tự làm phần mềm.',
    'Kể bằng một hệ thống có thật, nêu đích danh từng phân hệ để người đọc tự mở ra đối chiếu — không dùng ví dụ bịa; tình huống giả định đều ghi rõ "Ví dụ minh họa".',
    'Bảy nguyên tắc vàng của người kiến tạo, mở đầu bằng "máy đề xuất, người quyết định".',
    'Một chương riêng về hành lang pháp lý khi dùng AI và tự xây dựng ứng dụng: Luật Trí tuệ nhân tạo, dữ liệu cá nhân, bảo vệ bí mật nhà nước, an ninh mạng, sở hữu trí tuệ — kèm mười điều tuân thủ cho cán bộ.',
    'Những bài học xương máu từ nhật ký thay đổi của dự án: lỗi dây chuyền khi tách kho dữ liệu, trùng họ tên làm mất một hồ sơ, phân hệ sập đầu kỳ mới — nguyên nhân gốc và cách phòng.',
    'Chương riêng dành cho lãnh đạo (dẫn dắt ứng dụng AI trong cơ quan) và lộ trình 30 ngày cho người mới bắt đầu.',
    'Sáu phụ lục dùng được ngay: thuật ngữ Việt - Anh, thư viện câu lệnh mẫu, mẫu bộ nhớ dự án, mẫu Quy tắc sử dụng AI tại cơ quan, danh mục văn bản pháp luật, bảng kiểm trước khi đưa ứng dụng vào sử dụng.',
  ],

  doiTuong: [
    { ten: 'Người mới bắt đầu', moTa: 'Cán bộ chưa từng lập trình muốn tự làm một công cụ nhỏ cho công việc: có hướng dẫn dựng "xưởng làm việc số" trong một buổi chiều và lộ trình 30 ngày.' },
    { ten: 'Cán bộ, công chức tham mưu', moTa: 'Đã quen dùng AI trò chuyện theo Tập 1, nay muốn đưa AI vào quy trình nghiệp vụ: soạn thảo, thẩm tra, giám sát, tổng hợp kiến nghị cử tri, đánh giá cán bộ.' },
    { ten: 'Lãnh đạo cơ quan, đơn vị', moTa: 'Cần hiểu đúng khả năng và giới hạn của AI để đặt hàng, phân công, kiểm soát rủi ro dữ liệu, chi phí và trách nhiệm khi đưa ứng dụng vào sử dụng.' },
  ],

  mucLuc: [
    { loai: 'mo-dau', so: '', ten: 'Lời nói đầu', trang: 9, moTa: 'Vì sao có Tập 2; từ "hỏi AI" đến "cùng AI làm ra công cụ"; tinh thần Nghị quyết 57-NQ/TW.' },
    { loai: 'mo-dau', so: '', ten: 'Hướng dẫn sử dụng cuốn sách', trang: 11, moTa: 'Năm phần của cuốn sách, ba lộ trình đọc theo vai, cách dùng câu lệnh mẫu.' },
    { loai: 'mo-dau', so: '', ten: 'Lưu ý quan trọng trước khi đọc', trang: 14, moTa: 'Hệ thống là bản demo thử nghiệm; pháp luật đối chiếu đến 26/10/2026; công cụ và giá thay đổi nhanh.' },
    chuong(1, 'Câu chuyện bắt đầu từ một bảng tính chấm điểm', 18, 'Phần thứ nhất — Nền tảng. Từ bài toán đánh giá, xếp loại hằng tháng đến ứng dụng web đầu tiên.'),
    chuong(2, 'AI tạo ứng dụng: hiểu đúng để không sợ, không ảo tưởng', 30, 'Ứng dụng web là gì, tác tử AI lập trình, thang 5 bậc kiến tạo, vai trò mới của cán bộ.'),
    chuong(3, 'Hành lang pháp lý khi dùng AI và tự xây dựng ứng dụng', 43, 'Chủ trương, luật chuyên ngành về AI, dữ liệu cá nhân, bí mật nhà nước, an ninh mạng, sở hữu trí tuệ.'),
    chuong(4, 'Bảy nguyên tắc vàng của người kiến tạo', 57, 'Máy đề xuất - người quyết định; đúng nghiệp vụ trước; nhỏ trước, lớn sau; chi phí có trần.'),
    chuong(5, 'Dựng "xưởng làm việc số" trong một buổi chiều', 68, 'Phần thứ hai — Hành trang. Cài đặt từng bước và dự án đầu tiên trong 30 phút.'),
    chuong(6, 'Giao việc cho tác tử AI lập trình: khung VAI-BỐI-VIỆC-DẠNG-RÀNG phiên bản kiến tạo', 83, 'Thêm phần Nghiệm thu, chế độ lập kế hoạch, chia nhỏ công việc, nghiệm thu khi không biết lập trình.'),
    chuong(7, 'Bộ nhớ dự án và kỷ luật làm việc', 98, 'Nhật ký thay đổi, GitHub là nguồn duy nhất, quy tắc rà soát chức năng liên quan.'),
    chuong(8, 'Từ văn bản quy phạm đến đặc tả phần mềm', 111, 'Đọc văn bản, biểu mẫu giấy để chốt cách tính trước khi viết mã.'),
    chuong(9, 'Phân hệ đánh giá, xếp loại cán bộ, công chức theo OKR/KPI', 126, 'Phần thứ ba — Thực chiến. Số hóa Nghị định 335/2025/NĐ-CP và Quy định 1053-QĐ/TU.'),
    chuong(10, 'Phân hệ kiểm điểm, đánh giá, xếp loại đảng viên hằng quý', 140, 'Dựng theo đúng hai biểu mẫu giấy: kế hoạch quý và bản tự đánh giá.'),
    chuong(11, 'Phân hệ đánh giá tiêu chí HĐND tỉnh, xã, phường', 153, 'Số hóa khung tiêu chí, chuẩn hóa chỗ chưa nhất quán của dự thảo, trần 25% Xuất sắc.'),
    chuong(12, 'Cổng thông tin nhiều phân hệ: quản lý cán bộ, biểu quyết trực tuyến và các hệ thống liên kết', 165, 'Trang chủ dạng cổng, danh sách cán bộ một mối, biểu quyết 82 đại biểu.'),
    chuong(13, 'Trợ lý AI nghiệp vụ dân cử và Người hướng dẫn trên Trang chủ', 179, 'Soạn thảo, thẩm tra, kiến nghị cử tri; hạn mức lượt gọi AI để chặn chi phí.'),
    chuong(14, 'Trợ lý chat qua Zalo, Telegram: đưa số liệu đến tận tay', 191, 'Bot đọc số liệu thật, duyệt người dùng, chống trả lời lặp.'),
    chuong(15, 'Bản tin pháp luật tự động và Sổ tay AI có trích dẫn nguồn', 203, 'Hai cái bẫy của tiếng Việt khi khớp từ khóa; nguyên tắc "có nguồn mới trả lời".'),
    chuong(16, 'Quy trình AI cho các nghiệp vụ trọng tâm', 220, 'Phần thứ tư — AI trong công việc hằng ngày của cơ quan dân cử.'),
    chuong(17, 'Dành cho lãnh đạo: dẫn dắt ứng dụng AI trong cơ quan', 238, 'Đặt hàng, phân công, kiểm soát rủi ro và trách nhiệm.'),
    chuong(18, 'Lộ trình 30 ngày cho người mới bắt đầu', 253, 'Từng tuần, từng việc cụ thể.'),
    chuong(19, 'An toàn, dữ liệu và chi phí: rủi ro thật, cách phòng thật', 268, 'Phần thứ năm — Vận hành bền vững và nhìn về phía trước.'),
    chuong(20, 'Từ bản demo đến hệ thống chính thức — và những bài học xương máu', 282, 'Điều kiện để chuyển từ thử nghiệm sang sử dụng chính thức.'),
    { loai: 'cuoi-sach', so: '', ten: 'Lời kết', trang: 296, moTa: '' },
    { loai: 'phu-luc', so: '1', ten: 'Thuật ngữ Việt – Anh', trang: 299, moTa: '' },
    { loai: 'phu-luc', so: '2', ten: 'Thư viện câu lệnh mẫu', trang: 304, moTa: 'Câu lệnh mẫu cho giao việc kiến tạo và nghiệp vụ hằng ngày, có ghi cấp dữ liệu được phép.' },
    { loai: 'phu-luc', so: '3', ten: 'Mẫu bộ nhớ dự án cho một dự án của cơ quan', trang: 319, moTa: '' },
    { loai: 'phu-luc', so: '4', ten: 'Mẫu Quy tắc sử dụng trí tuệ nhân tạo tại cơ quan', trang: 323, moTa: '' },
    { loai: 'phu-luc', so: '5', ten: 'Danh mục văn bản pháp luật liên quan', trang: 328, moTa: 'Đối chiếu tình trạng hiệu lực đến 26/10/2026, nêu cả văn bản Tập 1 đã dẫn nay đã được thay thế.' },
    { loai: 'phu-luc', so: '6', ten: 'Bảng kiểm trước khi đưa một ứng dụng vào sử dụng', trang: 332, moTa: '' },
    { loai: 'cuoi-sach', so: '', ten: 'Tài liệu tham khảo', trang: 334, moTa: '' },
  ],

  tuKhoa: ['trí tuệ nhân tạo', 'AI', 'tham mưu', 'tác tử AI lập trình', 'chuyển đổi số', 'cơ quan dân cử', 'OKR/KPI', 'Luật Trí tuệ nhân tạo', 'Nghị quyết 57-NQ/TW', 'tập 2'],

  trichLoiNoiDau: 'Ở Tập 1, chúng ta là người dùng: hỏi, nhận bản nháp, sửa rồi dùng. Ở Tập 2, chúng ta là người kiến tạo: giao việc cho một tác tử AI biết đọc cả bộ mã nguồn, tự chạy lệnh, tự kiểm thử, như một tổ kỹ thuật làm rất nhanh nhưng không biết gì về nghiệp vụ nếu ta không nói rõ. Người cán bộ vì thế đóng ba vai: chủ đầu tư nêu đúng nhu cầu, tổng công trình sư giữ đúng thiết kế, người nghiệm thu không ký khi công trình chưa đạt.',

  tieuSuTacGia: SACH_AI_THAM_MUU.tieuSuTacGia,

  lienKet: [{ ten: 'Đọc trước Tập 1 — "Trí tuệ nhân tạo trong công tác tham mưu" (PDF)', url: TEP_SACH_AI }],
  capNhat: '',
};

/** Các cuốn có sẵn trong bộ khởi tạo — máy chủ thiếu cuốn nào thì `khoiTaoNeuTrong` bổ sung cuốn đó. */
export const SACH_KHOI_TAO = [SACH_AI_TAP_2, SACH_AI_THAM_MUU];

export const GIOI_THIEU_TU_SACH = [
  'Tủ sách giới thiệu các công trình do cán bộ, công chức của cơ quan biên soạn — sách chuyên môn, cẩm nang nghiệp vụ, tài liệu bồi dưỡng.',
  'Mỗi cuốn có phần giới thiệu, mục lục đầy đủ và thông tin tác giả; cuốn nào được tác giả cho phép thì đọc hoặc tải toàn văn ngay tại đây.',
].join(' ');

export function seedTuSach() {
  return {
    sach: SACH_KHOI_TAO.map((s) => ({ ...s, capNhat: new Date().toISOString() })),
    gioiThieu: GIOI_THIEU_TU_SACH,
    capNhat: '',
  };
}

/**
 * Chưa có cuốn nào thì dựng bộ khởi tạo. Theo nguyên tắc chung của hệ thống
 * ("dữ liệu mẫu = dữ liệu chính thống"), người đăng nhập đầu tiên mở phân hệ
 * sẽ ghi bộ này lên máy chủ để mọi người cùng thấy một bản.
 *
 * Máy chủ ĐÃ có sách nhưng thiếu cuốn nào của bộ khởi tạo (vd Tập 2 thêm sau)
 * thì bổ sung cuốn đó — trừ cuốn Quản trị đã chủ động xóa (`daGo`). Cuốn mới
 * bổ sung mà là tiêu điểm thì nhường tiêu điểm cho nó (chỉ một cuốn tiêu điểm).
 * Có bổ sung thì xóa `capNhat` để người đăng nhập đầu tiên ghi lại lên máy chủ.
 */
export function khoiTaoNeuTrong(doc) {
  if (!(Array.isArray(doc?.sach) && doc.sach.length)) {
    return { doc: chuanHoaTS({ ...chuanHoaTS(doc), ...seedTuSach() }), moi: true, them: 0 };
  }
  const d = chuanHoaTS(doc);
  const coSan = new Set(d.sach.map((s) => s.id));
  const thieu = SACH_KHOI_TAO.filter((s) => !coSan.has(s.id) && !d.daGo.includes(s.id));
  if (!thieu.length) return { doc: d, moi: false, them: 0 };
  const lay = new Date().toISOString();
  let sach = [...thieu.map((s) => ({ ...s, capNhat: lay })), ...d.sach];
  if (thieu.some((s) => s.noiBat)) {
    const tieuDiem = thieu.find((s) => s.noiBat).id;
    sach = sach.map((s) => ({ ...s, noiBat: s.id === tieuDiem }));
  }
  return { doc: chuanHoaTS({ ...d, sach, capNhat: '' }), moi: true, them: thieu.length };
}
