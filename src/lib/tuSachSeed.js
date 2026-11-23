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
  trangThai: 'gioi-thieu', noiBat: false,   // tiêu điểm đã nhường cho Tập 3
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

// ---------------------------------------------------------------------------
//  TẬP 3 — "Từ ứng dụng đến dữ liệu" (BẢN THẢO tháng 11-2026, 194 trang).
//  Đọc từ tệp tác giả đưa vào `docs/Tap_3_Tu_ung_dung_den_du_lieu_…docx`:
//  tên phần, chương, phụ lục và số trang lấy từ MỤC LỤC của bản thảo; tóm tắt,
//  đóng góp mới, bạn đọc rút từ Lời nói đầu và phần Mở đầu.
//
//  ⚠️ Trang bìa bản thảo ghi: "Bản thảo để lấy ý kiến góp ý, CHƯA PHÁT HÀNH".
//     Vì vậy cuốn này CHỈ GIỚI THIỆU: `trangThai = 'ban-thao'`, `choTai = false`,
//     `tepToanVan` để trống và KHÔNG đặt tệp nào vào `public/sach/` (tệp ở đó
//     là công khai với mọi người, bất kể cờ `choTai`). Khi tác giả quyết định
//     phát hành: đặt PDF vào `public/sach/`, điền `tepToanVan`, bật `choTai`.
// ---------------------------------------------------------------------------
export const BIA_SACH_AI_3 = '/sach/bia-ttnt-tham-muu-tap-3.svg';

export const SACH_AI_TAP_3 = {
  id: 's-ai-tham-muu-tap-3', ma: 'S-03',
  ten: 'Trí tuệ nhân tạo trong công tác tham mưu — Tập 3: Từ ứng dụng đến dữ liệu',
  phuDe: 'Phương pháp và chiến lược dữ liệu tập trung, thống nhất, dùng chung trong hệ thống chính trị cấp tỉnh',
  tacGia: 'Hà Ngọc Sơn',
  hocVi: 'Tiến sĩ Quản lý Kinh tế',
  chucDanh: 'Phó Chánh Văn phòng Đoàn Đại biểu Quốc hội và Hội đồng nhân dân tỉnh Thanh Hóa',
  theLoai: 'Chuyên khảo',
  namHoanThanh: '2026', nhaXB: '', isbn: '',
  soTrang: 194, soChuong: 20, soPhuLuc: 6,
  trangThai: 'ban-thao', noiBat: true,
  anhBia: BIA_SACH_AI_3, tepToanVan: '', choTai: false,

  tomTat: [
    'Tập 1 bàn về người làm tham mưu trong vai NGƯỜI SỬ DỤNG trí tuệ nhân tạo, Tập 2 bàn về vai NGƯỜI KIẾN TẠO. Thực tiễn của hai tập trước dẫn đến một nhận xét: công cụ nào, dù do chuyên viên tự làm hay do doanh nghiệp cung cấp, cũng dừng lại ở cùng một chỗ — dữ liệu. Phần mềm có thể thay sau vài năm, mô hình AI có thể thay sau vài tháng, còn dữ liệu của một cơ quan thì ở lại hàng chục năm. Tập 3 vì vậy chuyển trọng tâm từ ứng dụng sang dữ liệu, và được viết theo thể loại sách chuyên khảo.',
    'Câu hỏi xuyên suốt: dữ liệu "tập trung" nên được hiểu và tổ chức thế nào ở một tỉnh. Câu trả lời tác giả đề xuất là luận điểm BA TẬP TRUNG, MỘT TẠI NGUỒN — tập trung về chuẩn, tập trung về trách nhiệm, tập trung về cửa chia sẻ, còn dữ liệu gốc ở lại nơi nó sinh ra — đi cùng một thứ tự ưu tiên: làm dữ liệu trước, làm trí tuệ nhân tạo sau.',
    'Sách gồm năm phần, hai mươi chương. Ba phần đầu dành cho cơ sở lý luận, cơ sở chính trị - pháp lý, kinh nghiệm, xu hướng, thực trạng và chiến lược dữ liệu cấp tỉnh đến năm 2031. Phần thứ tư là phương pháp triển khai bảy bước, viết đủ cụ thể để dùng như một cuốn sổ tay. Phần thứ năm bàn về trách nhiệm của người đứng đầu, lộ trình và rủi ro. Tỉnh Thanh Hóa là địa bàn nghiên cứu; cơ quan dân cử có một chương riêng. Văn bản của Đảng và Nhà nước được đối chiếu đến ngày 21-11-2026.',
    'Đây là BẢN THẢO để lấy ý kiến góp ý, chưa phát hành — Tủ sách hiện chỉ giới thiệu nội dung và mục lục, chưa có bản đọc toàn văn.',
  ].join('\n\n'),

  diemNoiBat: [
    'Luận điểm "ba tập trung, một tại nguồn" làm cách hiểu thống nhất về dữ liệu tập trung ở cấp tỉnh, kèm sáu câu hỏi để quyết định khi nào gom dữ liệu về kho, khi nào để tại nguồn.',
    'Thang năm bậc trưởng thành dữ liệu và bộ sáu tiêu chí chất lượng (đúng, đủ, sạch, sống, thống nhất, dùng chung) kèm phép thử, đủ đơn giản để một cơ quan cấp xã tự đánh giá.',
    'Khung chiến lược dữ liệu cấp tỉnh đến năm 2031, mô hình quản trị cho cả bốn khối của hệ thống chính trị và kiến trúc bốn lớp, ba dòng chảy.',
    'Phương pháp bảy bước: kiểm kê, xác định chủ quản và định danh, chuẩn hóa, làm sạch, kết nối, khai thác, duy trì — cùng bộ mẫu phiếu, bảng kiểm, quy chế.',
    'Một chương riêng về dữ liệu của cơ quan dân cử: bộ cơ sở dữ liệu Hội đồng nhân dân hai cấp — lĩnh vực hầu như chưa có tài liệu riêng ở trong nước.',
    'Mười quyết định về dữ liệu của người đứng đầu và lộ trình theo ba mốc: tháng 12-2026, năm 2027 và đến năm 2031.',
    'Tác giả nêu rõ giới hạn của bản thảo: trường hợp nghiên cứu chính chưa có kết quả vận hành, đánh giá thực trạng còn định tính, tình huống giả định đều được ghi là giả định.',
  ],

  doiTuong: [
    { ten: 'Cán bộ lãnh đạo, quản lý và đại biểu dân cử', moTa: 'Người phải quyết định về dữ liệu của cơ quan: chỉ định chủ quản, bãi bỏ báo cáo khi đã có dữ liệu, và đặt câu hỏi đúng trong các cuộc họp có số liệu.' },
    { ten: 'Cán bộ tham mưu ở các cơ quan đảng, chính quyền, Mặt trận Tổ quốc', moTa: 'Người tổng hợp, kết nối và khai thác dữ liệu phục vụ lãnh đạo, chỉ đạo, quản lý và giám sát.' },
    { ten: 'Công chức cấp xã', moTa: 'Người hằng ngày tạo ra dữ liệu và chịu tải báo cáo — phần phương pháp bảy bước viết để làm được bằng công cụ sẵn có.' },
  ],

  mucLuc: [
    { loai: 'mo-dau', so: '', ten: 'Lời nói đầu', trang: 3, moTa: 'Hai con số khác nhau cho cùng một câu hỏi; vì sao Tập 3 chuyển trọng tâm từ ứng dụng sang dữ liệu.' },
    { loai: 'mo-dau', so: '', ten: 'Danh mục chữ viết tắt, bảng, hình và hộp', trang: 13, moTa: '' },
    { loai: 'mo-dau', so: '', ten: 'Mở đầu', trang: 17, moTa: 'Tính cấp thiết, tổng quan nghiên cứu, mục tiêu và câu hỏi nghiên cứu, đối tượng, phạm vi, phương pháp, đóng góp mới, kết cấu.' },
    chuong(1, 'Vấn đề dữ liệu trong hoạt động của hệ thống chính trị cấp tỉnh', 23, 'Phần thứ nhất — Cơ sở lý luận và cơ sở chính trị - pháp lý. Đường đi của một con số; có phần mềm mà chưa có dữ liệu; vì sao dữ liệu phải đi trước.'),
    chuong(2, 'Dữ liệu: khái niệm, phân loại, chất lượng và mức độ trưởng thành', 31, 'Sáu loại dữ liệu; sáu tiêu chí chất lượng và sáu phép thử; thang năm bậc trưởng thành; sáu ngộ nhận thường gặp.'),
    chuong(3, 'Dữ liệu tập trung, thống nhất, dùng chung: các mô hình tổ chức và luận điểm ba tập trung, một tại nguồn', 40, 'Ba cách tổ chức dữ liệu; pháp luật Việt Nam đã chọn hướng nào; khi nào gom, khi nào nối; bảy nguyên tắc.'),
    chuong(4, 'Chủ trương của Đảng, chính sách, pháp luật của Nhà nước về dữ liệu', 51, 'Luật Dữ liệu và văn bản hướng dẫn; kết nối, chia sẻ bắt buộc; ba lớp bảo vệ; các mốc thời hạn; mười yêu cầu tuân thủ.'),
    chuong(5, 'Kinh nghiệm quốc tế và trong nước về tổ chức dữ liệu khu vực công', 63, 'Phần thứ hai — Kinh nghiệm, xu hướng và thực tiễn. Estonia, Singapore, Đan Mạch, Hàn Quốc, Ấn Độ, Anh và EU; những thất bại cần nghiên cứu; bài học cho Thanh Hóa.'),
    chuong(6, 'Những xu hướng chủ yếu về dữ liệu giai đoạn 2027 - 2031 và hàm ý đối với cấp tỉnh', 71, 'Tám xu hướng và cách sàng lọc xu hướng ở tầm cấp tỉnh.'),
    chuong(7, 'Thực trạng dữ liệu trong hệ thống chính trị tỉnh Thanh Hóa', 78, 'Thực trạng theo bốn khối; cấp xã — nơi tạo ra dữ liệu và nơi chịu tải; đánh giá theo thang năm bậc; các điểm nghẽn.'),
    chuong(8, 'Quan điểm, mục tiêu và nội dung chiến lược dữ liệu cấp tỉnh đến năm 2031', 86, 'Phần thứ ba — Chiến lược, quản trị và kiến trúc dữ liệu cấp tỉnh. Quan điểm, tầm nhìn, năm trụ cột, thứ tự ưu tiên, nguồn lực.'),
    chuong(9, 'Quản trị dữ liệu: tổ chức, vai trò và trách nhiệm', 93, 'Các vai trò đối với một bộ dữ liệu; năm công cụ quản trị; xử lý khi dữ liệu sai hoặc hai nguồn mâu thuẫn; quy chế quản trị.'),
    chuong(10, 'Kiến trúc dữ liệu dùng chung cấp tỉnh: bốn lớp, ba dòng chảy', 100, 'Mã định danh và dữ liệu chủ; sổ chỉ tiêu: một chỉ tiêu, một công thức, một nơi tính; an toàn và phân vùng.'),
    chuong(11, 'Dữ liệu của cơ quan dân cử: bộ cơ sở dữ liệu Hội đồng nhân dân hai cấp', 107, 'Đặc thù dữ liệu cơ quan dân cử; cấu trúc bộ dữ liệu; năm quyết định thiết kế; ba làn triển khai; những vấn đề còn mở.'),
    chuong(12, 'Kiểm kê dữ liệu và xác định chủ quản', 116, 'Phần thứ tư — Phương pháp triển khai: bảy bước từ kiểm kê đến duy trì. Bản đồ dữ liệu, phiếu dữ liệu một trang, định danh, xếp bậc.'),
    chuong(13, 'Chuẩn hóa và làm sạch dữ liệu', 123, 'Sáu quy tắc của một bảng dữ liệu; danh mục và từ điển trường; sáu loại lỗi; đối soát; vai trò của AI.'),
    chuong(14, 'Từ hồ sơ giấy đến dữ liệu: hồ sơ điện tử, số hóa và lưu trữ số', 130, 'Lập hồ sơ điện tử ngay từ đầu; số hóa có chọn lọc; ba mức từ bản số hóa đến dữ liệu; nộp lưu.'),
    chuong(15, 'Kết nối và chia sẻ dữ liệu', 136, 'Chia sẻ là nghĩa vụ; bốn mức kết nối; cam kết giữa bên cung cấp và bên sử dụng; dữ liệu có thông tin cá nhân; dữ liệu mở.'),
    chuong(16, 'Khai thác dữ liệu: cảnh báo, chỉ tiêu, phân tích và trí tuệ nhân tạo', 142, 'Bốn tầng khai thác; cảnh báo thời hạn; bảng điều hành; chuẩn bị dữ liệu cho AI.'),
    chuong(17, 'Bảo vệ, lưu trữ và duy trì dữ liệu', 148, 'Giữ cho dữ liệu sống, đúng, an toàn và dùng được lâu dài; giữ con người; kinh phí duy trì.'),
    chuong(18, 'Trách nhiệm của người đứng đầu: mười quyết định về dữ liệu', 155, 'Phần thứ năm — Tổ chức thực hiện, lộ trình và tầm nhìn. Mười quyết định; năm câu hỏi trong các cuộc họp có số liệu.'),
    chuong(19, 'Lộ trình thực hiện: tháng 12-2026, năm 2027 và đến năm 2031', 161, 'Ba mươi ngày đầu; năm 2027 — năm đặt nền; 2028 - 2029 kết nối và khai thác; 2030 - 2031 sẵn sàng cho AI.'),
    chuong(20, 'Những sai lầm thường gặp, rủi ro và tầm nhìn sau năm 2031', 168, 'Hai mươi sai lầm thường gặp; rủi ro của lộ trình; những vấn đề cần tiếp tục nghiên cứu.'),
    { loai: 'cuoi-sach', so: '', ten: 'Kết luận', trang: 173, moTa: 'Trả lời năm câu hỏi nghiên cứu; nêu giới hạn của bản thảo.' },
    { loai: 'cuoi-sach', so: '', ten: 'Tài liệu tham khảo', trang: 176, moTa: '' },
    { loai: 'phu-luc', so: '1', ten: 'Thuật ngữ sử dụng thống nhất trong cuốn sách', trang: 185, moTa: '' },
    { loai: 'phu-luc', so: '2', ten: 'Câu lệnh mẫu cho công cụ trí tuệ nhân tạo trong công việc dữ liệu', trang: 186, moTa: '' },
    { loai: 'phu-luc', so: '3', ten: 'Mẫu bản đồ dữ liệu, phiếu dữ liệu và sổ chỉ tiêu', trang: 188, moTa: '' },
    { loai: 'phu-luc', so: '4', ten: 'Mẫu quy chế khung quản trị dữ liệu', trang: 189, moTa: '' },
    { loai: 'phu-luc', so: '5', ten: 'Danh mục văn bản chủ yếu về dữ liệu', trang: 191, moTa: '' },
    { loai: 'phu-luc', so: '6', ten: 'Bảng kiểm', trang: 192, moTa: '' },
  ],

  tuKhoa: ['dữ liệu', 'dữ liệu dùng chung', 'quản trị dữ liệu', 'chiến lược dữ liệu', 'trí tuệ nhân tạo', 'AI', 'tham mưu', 'Luật Dữ liệu', 'Hội đồng nhân dân', 'cơ quan dân cử', 'chuyển đổi số', 'tập 3'],

  trichLoiNoiDau: 'Câu hỏi xuyên suốt cuốn sách là: dữ liệu "tập trung" nên được hiểu và tổ chức thế nào ở một tỉnh. Câu trả lời mà chúng tôi đề xuất gồm ba vế tập trung và một vế tại nguồn: tập trung về chuẩn, tập trung về trách nhiệm, tập trung về cửa chia sẻ, còn dữ liệu gốc ở lại nơi nó sinh ra. Đi cùng luận điểm ấy là một thứ tự ưu tiên: làm dữ liệu trước, làm trí tuệ nhân tạo sau.',

  tieuSuTacGia: SACH_AI_THAM_MUU.tieuSuTacGia,

  lienKet: [
    { ten: 'Tập 1 — "Trí tuệ nhân tạo trong công tác tham mưu" (PDF)', url: TEP_SACH_AI },
    { ten: 'Tập 2 — "Từ người dùng đến người kiến tạo" (PDF)', url: TEP_SACH_AI_2 },
  ],
  capNhat: '',
};

/** Các cuốn có sẵn trong bộ khởi tạo — máy chủ thiếu cuốn nào thì `khoiTaoNeuTrong` bổ sung cuốn đó. */
export const SACH_KHOI_TAO = [SACH_AI_TAP_3, SACH_AI_TAP_2, SACH_AI_THAM_MUU];

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
