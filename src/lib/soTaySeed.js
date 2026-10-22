// ============================================================================
//  BỘ KHỞI TẠO SỔ TAY AI — 06 sổ tay theo lĩnh vực + danh mục nguồn GỢI Ý
//  + ngân hàng câu hỏi mẫu + dự thảo Quy tắc sử dụng AI.
//
//  ⚠️ RẤT QUAN TRỌNG — DANH MỤC NGUỒN Ở ĐÂY LÀ "VIỆC CẦN LÀM", KHÔNG PHẢI
//     KHẲNG ĐỊNH PHÁP LÝ. Mọi văn bản đều được đặt sẵn ở trạng thái
//     hieuLuc = 'chua-ro' và kiemTra = 'chua'. Đúng theo trách nhiệm đã đăng ký
//     ("chủ trì chọn, KIỂM TRA nguồn văn bản chính thống, CÒN HIỆU LỰC"), cán bộ
//     phải mở Công báo / Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật để
//     đối chiếu số hiệu, ngày ban hành, tình trạng hiệu lực rồi mới chuyển sang
//     "Đã kiểm tra - đạt". Phần mềm KHÔNG tự gán "còn hiệu lực" cho bất kỳ văn
//     bản nào — máy không có thẩm quyền đó.
//
//  ⚠️ CHỈ NẠP VĂN BẢN CÔNG KHAI, KHÔNG MẬT (ghi chú của nhiệm vụ đăng ký).
//     Mỗi nguồn có cờ `congKhai`; chưa xác nhận công khai thì không nạp nguyên văn.
// ============================================================================
import { MOC_MAC_DINH } from './soTayAI.js';

let seq = 0;
const id = (p) => `${p}${(++seq).toString(36)}${Date.now().toString(36).slice(-3)}`;

// ---------------------------------------------------------------------------
//  06 SỔ TAY (đúng danh mục đã đăng ký trong nhiệm vụ đột phá)
// ---------------------------------------------------------------------------
export const SO_TAY_GOC = [
  {
    ma: 'ST-01', ten: 'Tổ chức và hoạt động của HĐND',
    moTa: 'Cơ cấu tổ chức HĐND, Thường trực HĐND, các Ban, Tổ đại biểu; nhiệm vụ, quyền hạn; chế độ làm việc; quan hệ công tác; điều kiện bảo đảm hoạt động.',
    doiTuong: 'Đại biểu HĐND tỉnh, Thường trực HĐND, lãnh đạo và công chức Văn phòng.',
    goiYNguon: 'Luật Tổ chức chính quyền địa phương; nghị quyết của UBTVQH hướng dẫn hoạt động của HĐND; quy chế làm việc của Thường trực HĐND tỉnh.',
  },
  {
    ma: 'ST-02', ten: 'Kỳ họp và công tác thẩm tra',
    moTa: 'Chuẩn bị, triệu tập, chương trình và trình tự kỳ họp; hồ sơ trình kỳ họp; thẩm tra của các Ban; chất vấn và trả lời chất vấn; biên bản, nghị quyết kỳ họp.',
    doiTuong: 'Các Ban của HĐND, Phòng Công tác HĐND, công chức tham mưu kỳ họp.',
    goiYNguon: 'Luật Tổ chức chính quyền địa phương; nghị quyết về quy chế kỳ họp; hướng dẫn của UBTVQH về thẩm tra, chất vấn.',
  },
  {
    ma: 'ST-03', ten: 'Hoạt động giám sát',
    moTa: 'Chương trình giám sát; giám sát chuyên đề; chất vấn; giải trình tại phiên họp Thường trực; giám sát văn bản quy phạm pháp luật; theo dõi, đôn đốc thực hiện kết luận, kiến nghị sau giám sát.',
    doiTuong: 'Thường trực HĐND, các Ban, Tổ đại biểu, Tổ giúp việc các đoàn giám sát.',
    goiYNguon: 'Luật Hoạt động giám sát của Quốc hội và HĐND; nghị quyết của UBTVQH hướng dẫn hoạt động giám sát của HĐND.',
  },
  {
    ma: 'ST-04', ten: 'Dân nguyện, khiếu nại và tố cáo',
    moTa: 'Tiếp công dân; tiếp nhận, phân loại, xử lý đơn thư; tổng hợp và đôn đốc giải quyết kiến nghị của cử tri; theo dõi kết quả trả lời; báo cáo công tác dân nguyện.',
    doiTuong: 'Thường trực HĐND, Ban Pháp chế, Phòng Tổng hợp - Thông tin - Dân nguyện.',
    goiYNguon: 'Luật Tiếp công dân; Luật Khiếu nại; Luật Tố cáo; nghị quyết của UBTVQH về tiếp công dân, xử lý đơn thư của cơ quan dân cử.',
  },
  {
    ma: 'ST-05', ten: 'Nghị quyết của HĐND tỉnh',
    moTa: 'Thẩm quyền ban hành; quy trình xây dựng, thẩm định, thẩm tra, thông qua; thể thức và kỹ thuật trình bày; hiệu lực; rà soát, hệ thống hóa, xử lý văn bản trái pháp luật.',
    doiTuong: 'Các Ban của HĐND, Văn phòng, cơ quan trình dự thảo nghị quyết.',
    goiYNguon: 'Luật Ban hành văn bản quy phạm pháp luật và nghị định quy định chi tiết; Nghị định 30/2020/NĐ-CP về công tác văn thư.',
  },
  {
    ma: 'ST-06', ten: 'Đánh giá, xếp loại cán bộ, công chức',
    moTa: 'Tiêu chí, quy trình, thẩm quyền và hồ sơ đánh giá, xếp loại; đánh giá theo OKR/KPI hằng tháng; kiểm điểm, xếp loại chất lượng hằng quý và cuối năm.',
    doiTuong: 'Toàn thể cán bộ, công chức, người lao động Văn phòng.',
    goiYNguon: 'Nghị định 335/2025/NĐ-CP; Quy định 1053-QĐ/TU; Quy định 73-QĐ/TU; Hướng dẫn 03-HD/TU.',
  },
];

// ---------------------------------------------------------------------------
//  DANH MỤC NGUỒN GỢI Ý — tất cả đều ở trạng thái "chưa kiểm tra".
//  Cột `ghiChu` nói rõ phải đối chiếu gì trước khi đưa vào sổ tay.
// ---------------------------------------------------------------------------
const NGUON_GOI_Y = {
  'ST-01': [
    ['Luật Tổ chức chính quyền địa phương', 'Quốc hội', 'Chương quy định về HĐND: cơ cấu, nhiệm vụ, quyền hạn, chế độ làm việc.'],
    ['Nghị quyết của UBTVQH hướng dẫn tổ chức, hoạt động của HĐND', 'Ủy ban Thường vụ Quốc hội', 'Đối chiếu nghị quyết đang có hiệu lực áp dụng cho nhiệm kỳ 2026 - 2031.'],
    ['Quy chế làm việc của Thường trực HĐND tỉnh Thanh Hóa', 'Thường trực HĐND tỉnh', 'Lấy bản đang áp dụng của nhiệm kỳ hiện tại.'],
    ['Quyết định quy định chức năng, nhiệm vụ của Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'Cấp có thẩm quyền', 'Kiểm tra bản mới nhất sau sắp xếp tổ chức bộ máy.'],
  ],
  'ST-02': [
    ['Luật Tổ chức chính quyền địa phương - phần kỳ họp HĐND', 'Quốc hội', 'Trình tự triệu tập, chương trình, biểu quyết tại kỳ họp.'],
    ['Nghị quyết ban hành Quy chế hoạt động của HĐND tỉnh', 'HĐND tỉnh', 'Phần về kỳ họp, thẩm tra, chất vấn.'],
    ['Hướng dẫn của UBTVQH về hoạt động thẩm tra của các Ban HĐND', 'Ủy ban Thường vụ Quốc hội', 'Đối chiếu văn bản còn hiệu lực.'],
    ['Kế hoạch tổ chức kỳ họp thường lệ của HĐND tỉnh', 'Thường trực HĐND tỉnh', 'Lấy kế hoạch kỳ họp gần nhất làm ví dụ quy trình thực tế.'],
  ],
  'ST-03': [
    ['Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân', 'Quốc hội', 'Nền tảng của toàn bộ sổ tay giám sát - kiểm tra kỹ số hiệu và hiệu lực.'],
    ['Nghị quyết của UBTVQH hướng dẫn hoạt động giám sát của HĐND', 'Ủy ban Thường vụ Quốc hội', 'Đối chiếu các nghị quyết hướng dẫn đang áp dụng.'],
    ['Nghị quyết về chương trình giám sát của HĐND tỉnh', 'HĐND tỉnh', 'Lấy nghị quyết chương trình giám sát năm hiện hành.'],
    ['Quyết định thành lập đoàn giám sát chuyên đề và kế hoạch giám sát', 'Thường trực HĐND tỉnh', 'Dùng làm mẫu quy trình, biểu mẫu giám sát.'],
  ],
  'ST-04': [
    ['Luật Tiếp công dân', 'Quốc hội', 'Trách nhiệm tiếp công dân của đại biểu và cơ quan dân cử.'],
    ['Luật Khiếu nại', 'Quốc hội', 'Trình tự, thẩm quyền giải quyết khiếu nại.'],
    ['Luật Tố cáo', 'Quốc hội', 'Trình tự, thẩm quyền giải quyết tố cáo.'],
    ['Nghị quyết của UBTVQH về tiếp công dân, xử lý đơn thư của cơ quan dân cử', 'Ủy ban Thường vụ Quốc hội', 'Đối chiếu bản còn hiệu lực.'],
    ['Quy chế tiếp công dân của Thường trực HĐND tỉnh', 'Thường trực HĐND tỉnh', 'Lịch tiếp công dân định kỳ và phân công.'],
  ],
  'ST-05': [
    ['Luật Ban hành văn bản quy phạm pháp luật', 'Quốc hội', 'Quy trình xây dựng, thẩm định, thông qua, hiệu lực của nghị quyết HĐND.'],
    ['Nghị định quy định chi tiết thi hành Luật Ban hành văn bản quy phạm pháp luật', 'Chính phủ', 'Kiểm tra nghị định đang có hiệu lực.'],
    ['Nghị định 30/2020/NĐ-CP về công tác văn thư', 'Chính phủ', 'Thể thức và kỹ thuật trình bày văn bản.'],
    ['Nghị quyết của HĐND tỉnh đã ban hành trong nhiệm kỳ', 'HĐND tỉnh', 'Chọn một số nghị quyết tiêu biểu làm ví dụ thể thức, bố cục.'],
  ],
  'ST-06': [
    ['Nghị định 335/2025/NĐ-CP về đánh giá, xếp loại chất lượng cán bộ, công chức', 'Chính phủ', 'Hiệu lực từ 01/01/2026 - đối chiếu lại trước khi dùng.'],
    ['Quy định 1053-QĐ/TU về bộ tiêu chí đánh giá, xếp loại cán bộ, công chức', 'Ban Thường vụ Tỉnh ủy Thanh Hóa', 'Phụ lục 01, 02, 03 theo nhóm đối tượng.'],
    ['Quy định 73-QĐ/TU về kiểm điểm, đánh giá, xếp loại chất lượng', 'Ban Thường vụ Tỉnh ủy Thanh Hóa', 'Điều kiện xếp loại, trần tỷ lệ hoàn thành xuất sắc.'],
    ['Hướng dẫn 03-HD/TU về đánh giá cán bộ diện Ban Thường vụ Tỉnh ủy quản lý', 'Ban Thường vụ Tỉnh ủy Thanh Hóa', 'Biểu mẫu kế hoạch quý và bản tự đánh giá.'],
  ],
};

// ---------------------------------------------------------------------------
//  NGÂN HÀNG CÂU HỎI MẪU — 54 câu (chỉ tiêu đăng ký là ≥ 50 câu ĐÃ ĐỐI CHIẾU).
//  Đặt sẵn ở trạng thái "Chưa đối chiếu nguồn": cán bộ hỏi thử trong sổ tay,
//  xem trích dẫn máy trả về, đối chiếu với văn bản gốc rồi mới xác nhận.
// ---------------------------------------------------------------------------
const CAU_HOI_GOC = {
  'ST-01': [
    'Thường trực HĐND tỉnh gồm những ai và có nhiệm vụ, quyền hạn gì?',
    'Các Ban của HĐND tỉnh có nhiệm vụ, quyền hạn như thế nào?',
    'Tổ đại biểu HĐND tỉnh được tổ chức và hoạt động ra sao?',
    'Đại biểu HĐND có những quyền gì trong thực hiện nhiệm vụ đại biểu?',
    'Trường hợp nào đại biểu HĐND bị bãi nhiệm, mất quyền đại biểu hoặc thôi làm nhiệm vụ?',
    'Phiên họp Thường trực HĐND tỉnh được tổ chức định kỳ thế nào và quyết định những nội dung gì?',
    'Văn phòng Đoàn ĐBQH và HĐND tỉnh có chức năng, nhiệm vụ gì?',
    'Quan hệ công tác giữa Thường trực HĐND tỉnh với UBND tỉnh được quy định ra sao?',
    'Điều kiện bảo đảm cho hoạt động của HĐND và đại biểu HĐND gồm những gì?',
  ],
  'ST-02': [
    'Kỳ họp HĐND tỉnh được triệu tập trong những trường hợp nào?',
    'Thời hạn gửi tài liệu kỳ họp đến đại biểu HĐND là bao lâu?',
    'Hồ sơ trình kỳ họp đối với một dự thảo nghị quyết gồm những tài liệu gì?',
    'Trình tự tiến hành một kỳ họp thường lệ của HĐND tỉnh gồm các bước nào?',
    'Ban của HĐND thẩm tra những nội dung gì và báo cáo thẩm tra phải nêu rõ điều gì?',
    'Phiên chất vấn tại kỳ họp được tiến hành theo trình tự nào?',
    'Nghị quyết của HĐND tỉnh được thông qua khi có bao nhiêu đại biểu tán thành?',
    'Kỳ họp chuyên đề khác kỳ họp thường lệ ở những điểm nào?',
    'Biên bản kỳ họp và nghị quyết kỳ họp phải hoàn thành, gửi đi trong thời hạn nào?',
  ],
  'ST-03': [
    'Chương trình giám sát hằng năm của HĐND tỉnh được xây dựng và quyết định như thế nào?',
    'Các hình thức giám sát của HĐND, Thường trực HĐND và các Ban gồm những gì?',
    'Đoàn giám sát chuyên đề có nhiệm vụ, quyền hạn gì?',
    'Trình tự tổ chức một cuộc giám sát chuyên đề gồm các bước nào?',
    'Báo cáo kết quả giám sát chuyên đề phải có những nội dung gì?',
    'Phiên giải trình tại phiên họp Thường trực HĐND được tổ chức theo trình tự nào?',
    'HĐND giám sát văn bản quy phạm pháp luật bằng cách nào và xử lý văn bản trái pháp luật ra sao?',
    'Cơ quan chịu sự giám sát có trách nhiệm gì đối với kết luận, kiến nghị sau giám sát?',
    'Việc theo dõi, đôn đốc thực hiện kiến nghị sau giám sát được thực hiện thế nào?',
  ],
  'ST-04': [
    'Đại biểu HĐND có trách nhiệm tiếp công dân như thế nào?',
    'Lịch tiếp công dân định kỳ của Thường trực HĐND tỉnh được quy định ra sao?',
    'Đơn thư gửi đến Thường trực HĐND được phân loại theo những tiêu chí nào?',
    'Thời hạn xử lý, chuyển đơn khiếu nại, tố cáo thuộc thẩm quyền là bao lâu?',
    'Khiếu nại và tố cáo khác nhau ở những điểm cơ bản nào?',
    'Trình tự, thủ tục giải quyết khiếu nại lần đầu được quy định thế nào?',
    'Người tố cáo được bảo vệ như thế nào theo quy định của pháp luật?',
    'Kiến nghị của cử tri được tổng hợp, chuyển và đôn đốc giải quyết theo quy trình nào?',
    'Báo cáo công tác dân nguyện trình kỳ họp gồm những nội dung gì?',
  ],
  'ST-05': [
    'HĐND tỉnh có thẩm quyền ban hành những loại văn bản nào?',
    'Nghị quyết quy phạm pháp luật khác nghị quyết cá biệt ở điểm nào?',
    'Quy trình xây dựng, ban hành một nghị quyết quy phạm pháp luật của HĐND tỉnh gồm các bước nào?',
    'Hồ sơ dự thảo nghị quyết trình HĐND tỉnh gồm những tài liệu gì?',
    'Cơ quan nào thẩm định dự thảo nghị quyết trước khi trình HĐND tỉnh?',
    'Thời điểm có hiệu lực của nghị quyết HĐND tỉnh được xác định thế nào?',
    'Thể thức và kỹ thuật trình bày nghị quyết HĐND gồm những thành phần bắt buộc nào?',
    'Việc rà soát, hệ thống hóa nghị quyết của HĐND được thực hiện định kỳ ra sao?',
    'Nghị quyết trái pháp luật được xử lý theo hình thức nào và do cơ quan nào quyết định?',
  ],
  'ST-06': [
    'Việc đánh giá, xếp loại chất lượng cán bộ, công chức dựa trên những nguyên tắc nào?',
    'Có mấy mức xếp loại chất lượng và tiêu chí của từng mức là gì?',
    'Thẩm quyền đánh giá, xếp loại đối với từng nhóm đối tượng được quy định thế nào?',
    'Trình tự, thủ tục đánh giá, xếp loại cán bộ, công chức gồm các bước nào?',
    'Hồ sơ đánh giá, xếp loại hằng năm gồm những tài liệu gì?',
    'Điều kiện để được xếp loại hoàn thành xuất sắc nhiệm vụ là gì?',
    'Trường hợp nào cán bộ, công chức bị xếp loại không hoàn thành nhiệm vụ?',
    'Kết quả đánh giá, xếp loại được sử dụng vào những việc gì?',
    'Cán bộ, công chức không đồng ý với kết quả đánh giá thì có quyền gì?',
  ],
};

// ---------------------------------------------------------------------------
//  DỰ THẢO QUY TẮC SỬ DỤNG AI (cán bộ đọc và cam kết trước khi dùng sổ tay)
// ---------------------------------------------------------------------------
export const QUY_TAC_GOC = {
  tieuDe: 'Quy tắc sử dụng trí tuệ nhân tạo trong tra cứu, hỏi đáp nghiệp vụ',
  banHanh: '',      // để trống tới khi Chánh Văn phòng ký ban hành
  nguoiKy: '',
  dieu: [
    { so: 1, ten: 'Phạm vi áp dụng', noiDung: 'Quy tắc này áp dụng đối với cán bộ, công chức, người lao động Văn phòng Đoàn ĐBQH và HĐND tỉnh, thành viên các Ban của HĐND tỉnh và đại biểu HĐND tỉnh khi sử dụng công cụ trí tuệ nhân tạo để tra cứu, hỏi đáp nghiệp vụ của cơ quan dân cử trong phạm vi thí điểm.' },
    { so: 2, ten: 'Chỉ nạp văn bản công khai', noiDung: 'Tuyệt đối KHÔNG nạp vào công cụ trí tuệ nhân tạo các tài liệu có độ mật, tài liệu nội bộ chưa được phép công bố, dự thảo chưa trình cấp có thẩm quyền, thông tin cá nhân (số định danh, số bảo hiểm xã hội, số điện thoại, địa chỉ, quan hệ gia đình), thông tin về người khiếu nại, tố cáo. Chỉ nạp văn bản đã được công bố công khai.' },
    { so: 3, ten: 'Kiểm tra nguồn trước khi nạp', noiDung: 'Trước khi đưa một văn bản vào sổ tay, người phụ trách phải đối chiếu số hiệu, ngày ban hành, cơ quan ban hành và TÌNH TRẠNG HIỆU LỰC trên Công báo hoặc Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật; ghi rõ người kiểm tra và thời điểm kiểm tra.' },
    { so: 4, ten: 'Người dùng chịu trách nhiệm về nội dung sử dụng', noiDung: 'Câu trả lời của trí tuệ nhân tạo chỉ có giá trị THAM KHẢO, hỗ trợ tra cứu. Người sử dụng phải mở văn bản gốc theo trích dẫn để kiểm chứng trước khi đưa nội dung vào văn bản tham mưu, báo cáo hoặc phát biểu. Không được trích dẫn trí tuệ nhân tạo làm căn cứ pháp lý.' },
    { so: 5, ten: 'Bắt buộc có trích dẫn nguồn', noiDung: 'Công cụ chỉ được trả lời dựa trên các đoạn văn bản trong sổ tay và phải ghi rõ trích dẫn đến từng điều, khoản. Trường hợp không tìm thấy căn cứ trong nguồn, công cụ phải trả lời là không có thông tin, không được suy đoán.' },
    { so: 6, ten: 'Không dùng để quyết định thay con người', noiDung: 'Không sử dụng trí tuệ nhân tạo để quyết định thay cho con người trong các việc: đánh giá, xếp loại cán bộ; kết luận giám sát; giải quyết khiếu nại, tố cáo; quyết định nhân sự. Giữ đúng nguyên tắc "máy đề xuất - người quyết định".' },
    { so: 7, ten: 'Bảo mật tài khoản và nhật ký sử dụng', noiDung: 'Không chia sẻ tài khoản truy cập cho người ngoài cơ quan. Nội dung hỏi đáp được ghi nhật ký phục vụ đánh giá thí điểm; người dùng không nhập thông tin cá nhân của người khác vào ô câu hỏi.' },
    { so: 8, ten: 'Phát hiện sai sót phải báo ngay', noiDung: 'Khi phát hiện câu trả lời sai, trích dẫn không đúng hoặc nguồn đã hết hiệu lực, người dùng đánh dấu câu hỏi là "Cần sửa lại" và báo Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng để xử lý.' },
    { so: 9, ten: 'Tổ chức thực hiện', noiDung: 'Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng chủ trì hướng dẫn, theo dõi việc thực hiện Quy tắc này; định kỳ báo cáo Chánh Văn phòng và Thường trực HĐND tỉnh kết quả thí điểm.' },
  ],
  camKet: [],
};

// ---------------------------------------------------------------------------
//  DỰNG BỘ DỮ LIỆU KHỞI TẠO
// ---------------------------------------------------------------------------
export function seedSoTay() {
  const soTay = SO_TAY_GOC.map((s) => ({
    id: id('st'), ma: s.ma, ten: s.ten, moTa: s.moTa, doiTuong: s.doiTuong,
    goiYNguon: s.goiYNguon, notebookLM: '', phuTrach: '',
    trangThai: 'xay-dung', demo: true, at: new Date().toISOString(),
  }));
  const tra = (ma) => soTay.find((s) => s.ma === ma)?.id || '';

  const nguon = [];
  for (const [ma, ds] of Object.entries(NGUON_GOI_Y)) {
    for (const [ten, coQuan, ghiChu] of ds) {
      nguon.push({
        id: id('ng'), soTayId: tra(ma), soHieu: '', ten, coQuan,
        ngayBanHanh: '', hieuLuc: 'chua-ro', lienKet: '',
        congKhai: false, kiemTra: 'chua', nguoiKiemTra: '', ngayKiemTra: '',
        ghiChu, text: '', soKyTu: 0, demo: true,
      });
    }
  }

  const cauHoi = [];
  for (const [ma, ds] of Object.entries(CAU_HOI_GOC)) {
    for (const c of ds) {
      cauHoi.push({
        id: id('ch'), soTayId: tra(ma), cauHoi: c, dapAn: '', trichDan: [],
        trangThai: 'moi', nguoiDoiChieu: '', ngayDoiChieu: '', demo: true,
      });
    }
  }

  return {
    soTay, nguon, cauHoi,
    quyTac: { ...QUY_TAC_GOC, dieu: QUY_TAC_GOC.dieu.map((d) => ({ ...d })), camKet: [] },
    huongDan: [], doThoiGian: [], nhatKy: [],
    moc: { ...MOC_MAC_DINH },
    updatedAt: '',
  };
}

export const TONG_CAU_HOI_GOC = Object.values(CAU_HOI_GOC).reduce((s, d) => s + d.length, 0);
export const TONG_NGUON_GOI_Y = Object.values(NGUON_GOI_Y).reduce((s, d) => s + d.length, 0);
