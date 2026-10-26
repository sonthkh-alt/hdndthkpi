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
  trangThai: 'gioi-thieu', noiBat: true,
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

export const GIOI_THIEU_TU_SACH = [
  'Tủ sách giới thiệu các công trình do cán bộ, công chức của cơ quan biên soạn — sách chuyên môn, cẩm nang nghiệp vụ, tài liệu bồi dưỡng.',
  'Mỗi cuốn có phần giới thiệu, mục lục đầy đủ và thông tin tác giả; cuốn nào được tác giả cho phép thì đọc hoặc tải toàn văn ngay tại đây.',
].join(' ');

export function seedTuSach() {
  return {
    sach: [{ ...SACH_AI_THAM_MUU, capNhat: new Date().toISOString() }],
    gioiThieu: GIOI_THIEU_TU_SACH,
    capNhat: '',
  };
}
