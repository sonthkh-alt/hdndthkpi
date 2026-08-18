// ============================================================================
//  BỘ TRẢ LỜI CỦA "NGƯỜI HƯỚNG DẪN" — chạy HOÀN TOÀN trong trình duyệt.
//
//  Nguyên tắc: đối chiếu TỪ KHÓA (đã bỏ dấu) của câu hỏi với kho câu trả lời
//  soạn sẵn — KHÔNG gọi AI, KHÔNG gọi máy chủ, vì vậy trả lời tức thì và
//  không tốn một token nào. Câu ngoài kịch bản thì mời sang trợ lý AI
//  (Zalo/Telegram) hoặc trang Hướng dẫn.
//
//  File này THUẦN LOGIC (không React) để kiểm thử được bằng Node.
// ============================================================================

export const CHAT_TELEGRAM = 'https://t.me/hdnd_thanhhoa_bot';
export const CHAT_ZALO = 'https://zalo.me/142053241153738721'; // OA "VP Đoàn ĐBQH và HĐND tỉnh Thanh Hóa"

const DAU = new RegExp('[\\u0300-\\u036f]', 'g');

/** Bỏ dấu tiếng Việt + về chữ thường, để so khớp "biểu quyết" ~ "bieu quyet". */
export const boDau = (s) => String(s || '').toLowerCase().normalize('NFD').replace(DAU, '').replace(/đ/g, 'd');

/** Câu hỏi gợi ý hiện thành nút bấm nhanh trong popup. */
export const GOI_Y = [
  'Hệ thống gồm những phân hệ nào?',
  'Biểu quyết online dùng thế nào?',
  'Cách tính điểm OKR/KPI?',
  'Đăng nhập bằng tài khoản nào?',
  'Liên hệ ai khi cần hỗ trợ?',
];

/** Lời chào mở đầu của người hướng dẫn. */
export const CHAO = {
  id: 'chao',
  text: 'Xin chào! Tôi là người hướng dẫn của hệ thống — trả lời tức thì ngay tại đây, miễn phí, không dùng AI.\nQuý vị gõ câu hỏi hoặc bấm một gợi ý bên dưới.',
  lienKet: [],
};

// ---------------------------------------------------------------------------
//  KHO KỊCH BẢN: mỗi mục = bộ từ khóa (đã bỏ dấu) + câu trả lời + liên kết.
//  Điểm so khớp = tổng độ dài các từ khóa tìm thấy (cụm càng dài càng "đắt"),
//  nên "biểu quyết một lần" thắng "một" của mục khác.
// ---------------------------------------------------------------------------
export const KICH_BAN = [
  {
    id: 'phanhe',
    tu: ['phan he', 'chuc nang', 'he thong gom', 'module', 'lam duoc gi', 'co nhung gi', 'gioi thieu he thong'],
    mau: 'Hệ thống gồm những phân hệ nào?',
    text: 'Hệ thống có 10 phân hệ, mở từ Trang chủ:\n'
      + '• Biểu quyết Online (trung tâm) · Đánh giá OKR/KPI · Kiểm điểm đảng viên · Tiêu chí HĐND tỉnh, xã, phường\n'
      + '• Trợ lý AI nghiệp vụ dân cử · Lịch công tác tuần · Giám sát số · Kho dữ liệu dùng chung (onedata)\n'
      + '• Quản lý cán bộ (chỉ Quản trị) · Hướng dẫn & hỗ trợ.\n'
      + 'Bấm thẻ tương ứng trên Trang chủ để vào.',
    lienKet: [{ nhan: 'Xem chi tiết từng phân hệ', url: '#/hotro' }],
  },
  {
    id: 'bieuquyet',
    tu: ['bieu quyet', 'nghi quyet', 'bo phieu', 'la phieu', 'ky hop', 'tan thanh', '82 dai bieu', 'thong qua'],
    mau: 'Biểu quyết online dùng thế nào?',
    text: 'Vào phân hệ Biểu quyết Online, chọn Kỳ họp rồi chọn nội dung, bấm một trong ba nút: Đồng ý · Không đồng ý · Có ý kiến khác. Không cần tài khoản.\n'
      + '• Mỗi đại biểu một lá phiếu, còn mở biểu quyết thì bấm lại để đổi được.\n'
      + '• Kỳ họp có nhiều nghị quyết đang mở thì dùng 3 nút tròn lớn để biểu quyết MỘT LẦN cho tất cả.\n'
      + '• Kết quả tính trên tổng số 82 đại biểu: quá nửa cần 42/82, hai phần ba cần 55/82 phiếu tán thành. Xuất được biên bản Word.',
    lienKet: [{ nhan: 'Mở Biểu quyết Online', url: '#/bieuquyet' }],
  },
  {
    id: 'okr',
    tu: ['okr', 'kpi', 'danh gia can bo', 'cham diem', 'xep loai cong chuc', 'nhom i', 'nhom ii', 'diem thang', 'hang thang'],
    mau: 'Cách tính điểm OKR/KPI?',
    text: 'Phân hệ OKR/KPI chấm hằng THÁNG, thang 100 điểm = Nhóm I tiêu chí chung (tối đa 30đ) + Nhóm II kết quả nhiệm vụ (tối đa 70đ) − điểm trừ.\n'
      + '• Mỗi nhiệm vụ chấm 3 tiêu chí: Số lượng, Chất lượng, Tiến độ → kết quả = trung bình cộng, suy ra mức độ hoàn thành.\n'
      + '• Bốn mức xếp loại: Xuất sắc ≥90 · Tốt ≥70 · Hoàn thành ≥50 · Không hoàn thành <50, kèm điều kiện Điều 8.\n'
      + 'Cán bộ nhập cột Tự đánh giá, cấp trên chấm cột Cấp duyệt (cột dùng để xếp loại).',
    lienKet: [{ nhan: 'Mở Đánh giá OKR/KPI', url: '#/okr' }, { nhan: 'Xem cách tính chi tiết', url: '#/hotro' }],
  },
  {
    id: 'kiemdiem',
    tu: ['kiem diem', 'dang vien', 'theo quy', 'hang quy', 'thuong vu', 'btv', 'tinh uy', '6 truc'],
    mau: 'Kiểm điểm đảng viên chấm thế nào?',
    text: 'Phân hệ Kiểm điểm chấm hằng QUÝ cho 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý.\n'
      + '• Thang 100 = Nhóm A tiêu chí chung 30đ (đảm bảo/không đảm bảo) + Nhóm B 70đ theo 6 trục kết quả trọng tâm.\n'
      + '• Mỗi nhiệm vụ chọn Mức độ hoàn thành và Tầm quan trọng; xuất Word đúng Phụ lục 3A và Phụ lục 4.',
    lienKet: [{ nhan: 'Mở Kiểm điểm đảng viên', url: '#/kiemdiem' }],
  },
  {
    id: 'tieuchi',
    tu: ['tieu chi hdnd', 'xa phuong', 'don vi cham', 'tham dinh', 'phu luc i', 'phu luc ii', 'phe duyet ket qua', 'xep loai hdnd'],
    mau: 'Đánh giá tiêu chí HĐND làm ở đâu?',
    text: 'Phân hệ Tiêu chí HĐND đánh giá theo NĂM, theo Khung tiêu chí nhiệm kỳ 2026-2031 (Phụ lục I cấp tỉnh, Phụ lục II cấp xã, phường).\n'
      + '• Đơn vị đăng nhập bằng mã đơn vị + mã truy cập để tự chấm; Thường trực HĐND tỉnh thẩm định, phê duyệt.\n'
      + '• Khách xem được bảng kết quả; trần Xuất sắc 25% số đơn vị. Xuất phiếu Word và bảng tổng hợp Excel.',
    lienKet: [{ nhan: 'Mở Tiêu chí HĐND', url: '#/tieuchi' }],
  },
  {
    id: 'troly',
    tu: ['tro ly ai', 'soan thao', 'tham tra du thao', 'bai phat bieu', 'kien nghi cu tri', 'luot goi', 'goi ai', 'soat xet'],
    mau: 'Trợ lý AI soạn thảo văn bản thế nào?',
    text: 'Phân hệ Trợ lý AI nghiệp vụ dân cử có 8 tab: Trợ lý kỳ họp · Soạn thảo văn bản (chuẩn NĐ 30) · Bài phát biểu · Soát xét · Thẩm tra dự thảo · Kiến nghị cử tri · Thư viện tài liệu · Hỏi đáp; kết quả xuất được ra Word.\n'
      + '• Hạn mức gọi AI mỗi ngày: khách 1 lượt, người đã đăng nhập 5 lượt (đặt lại lúc 0 giờ).\n'
      + 'Lưu ý: các chức năng đó gọi AI thật; còn tôi (người hướng dẫn) trả lời miễn phí, không tính vào hạn mức nào.',
    lienKet: [{ nhan: 'Mở Trợ lý AI', url: '#/troly' }],
  },
  {
    id: 'dangnhap',
    tu: ['dang nhap', 'tai khoan', 'mat khau', 'phan quyen', 'quyen gi', 'dung thu', 'khach'],
    mau: 'Đăng nhập bằng tài khoản nào?',
    text: 'Khách không cần đăng nhập vẫn xem được mọi nội dung và thử chấm điểm (không lưu). Tài khoản dùng thử: user@thanhhoa.gov.vn / password.\n'
      + '• Cán bộ đăng nhập bằng email cơ quan để tự đánh giá; Trưởng phòng chấm cột Cấp duyệt; Quản trị toàn quyền.\n'
      + '• Mật khẩu quản trị không được cung cấp qua kênh chat — cần thì liên hệ Văn phòng.',
    lienKet: [{ nhan: 'Đăng nhập', url: '#/okr?login=1' }],
  },
  {
    id: 'lich',
    tu: ['lich cong tac', 'lich tuan', 'lich lanh dao', 'dieu xe', 'xe cong'],
    mau: 'Xem lịch công tác tuần ở đâu?',
    text: 'Lịch công tác tuần chạy trên hệ thống riêng (tài khoản đăng nhập riêng) — bấm thẻ "Quản lý lịch công tác tuần" trên Trang chủ để mở.\n'
      + 'Mẹo: trợ lý AI trên Zalo/Telegram đọc được lịch của tuần này và tuần sau, hỏi trực tiếp bên đó rất nhanh.',
    lienKet: [{ nhan: 'Trang chủ (thẻ Lịch công tác)', url: '#/' }],
  },
  {
    id: 'giamsat',
    tu: ['giam sat'],
    mau: 'Giám sát số Thanh Hóa là gì?',
    text: 'Giám sát số Thanh Hóa là hệ thống riêng (12 nhóm nghiệp vụ giám sát theo Luật 121/2025/QH15), mở từ thẻ trên Trang chủ.\n'
      + 'Bản demo đang bật chế độ trình diễn — vào là thấy đủ chức năng, không phải đăng nhập.',
    lienKet: [{ nhan: 'Mở Giám sát số', url: 'https://sonthkh-alt.github.io/giamsat/' }],
  },
  {
    id: 'onedata',
    tu: ['onedata', 'mot du lieu', 'khong bao cao lai', 'kho du lieu'],
    mau: 'Kho dữ liệu dùng chung là gì?',
    text: 'Phân hệ "Một dữ liệu – Không báo cáo lại" là kho dữ liệu dùng chung chạy trên hệ thống riêng: trích số liệu từ văn bản, soạn 15 mẫu báo cáo NĐ 30, hỏi đáp có dẫn nguồn.\n'
      + 'Lưu ý: máy chủ gói miễn phí "ngủ" khi vắng người — lần mở đầu có thể chờ 30-60 giây.',
    lienKet: [{ nhan: 'Mở Kho dữ liệu dùng chung', url: 'https://onedata-thanhhoa.onrender.com' }],
  },
  {
    id: 'canbo',
    tu: ['ho so can bo', '2c', 'nhan su', 'bien che', 'nang luong', 'nghi huu', 'them can bo', 'sua ten', 'danh sach can bo'],
    mau: 'Thêm hoặc sửa hồ sơ cán bộ ở đâu?',
    text: 'Toàn bộ danh sách cán bộ quản lý MỘT MỐI ở phân hệ Quản lý cán bộ (hồ sơ 2C) — chỉ Quản trị mở được.\n'
      + '• Muốn thêm người, sửa họ tên/chức vụ/đơn vị thì làm ở đó; hai phân hệ chấm điểm chỉ chấm, không tự sửa danh sách.\n'
      + '• Kèm nhắc việc nhân sự: nâng bậc lương, nghỉ hưu, hết hạn hợp đồng, biên chế.',
    lienKet: [{ nhan: 'Mở Quản lý cán bộ', url: '#/canbo' }],
  },
  {
    id: 'chatbot',
    tu: ['zalo', 'telegram', 'dangky', 'dang ky bot', 'nhan tin', 'tro ly chat', 'hoi qua chat', 'so lieu that'],
    mau: 'Chat với trợ lý AI qua Zalo/Telegram thế nào?',
    text: 'Trợ lý AI trên Zalo/Telegram đọc được SỐ LIỆU THẬT của hệ thống (kỳ đánh giá, tiêu chí HĐND, lịch công tác 2 tuần).\n'
      + '• Lần đầu nhắn tin: gửi "/dangky Họ và tên - Đơn vị" rồi chờ Quản trị duyệt (một lần duy nhất).\n'
      + '• Hạn mức 30 câu hỏi/người/ngày; lệnh bắt đầu bằng "/" không tính.',
    lienKet: [{ nhan: 'Zalo OA của Văn phòng', url: CHAT_ZALO }, { nhan: 'Telegram @hdnd_thanhhoa_bot', url: CHAT_TELEGRAM }],
  },
  {
    id: 'lienhe',
    tu: ['lien he', 'ho tro', 'dien thoai', 'so may', 'email', 'ai phu trach', 'gap ai', 'hotline'],
    mau: 'Liên hệ ai khi cần hỗ trợ?',
    text: 'Đầu mối hỗ trợ: đồng chí Hà Ngọc Sơn, Phó Chánh Văn phòng — điện thoại 0904 818 886, thư điện tử sonthkh@gmail.com.\n'
      + 'Trang Hướng dẫn & hỗ trợ có đủ: bắt đầu nhanh theo vai trò, cách tính điểm, hỏi đáp thường gặp.',
    lienKet: [{ nhan: 'Gọi 0904 818 886', url: 'tel:0904818886' }, { nhan: 'Trang Hướng dẫn & hỗ trợ', url: '#/hotro' }],
  },
  {
    id: 'xuat',
    tu: ['xuat word', 'xuat excel', 'bien ban', 'tai ve', 'in phieu', 'docx', 'bao cao'],
    mau: 'Xuất phiếu, biên bản ra Word thế nào?',
    text: 'Mỗi phân hệ có nút xuất riêng, tệp tải thẳng về máy:\n'
      + '• Biểu quyết: nút "Xuất biên bản (Word)" ở khối kết quả.\n'
      + '• OKR/KPI và Kiểm điểm: phiếu đánh giá Word + bảng tổng hợp trong tab Đánh giá/Tổng quan.\n'
      + '• Tiêu chí HĐND: phiếu Word từng đơn vị + bảng tổng hợp Excel. Trợ lý AI xuất văn bản chuẩn NĐ 30.',
    lienKet: [],
  },
  {
    id: 'mienphi',
    tu: ['token', 'chi phi', 'mien phi', 'ton tien', 'tra phi', 'mat tien', 'ton phi', 'ton kem'],
    mau: 'Chat ở đây có tốn phí không?',
    text: 'Không. Người hướng dẫn trả lời từ kịch bản soạn sẵn ngay trong trình duyệt — không gọi AI, không tốn token hay lượt nào.\n'
      + 'Chỉ khi dùng Trợ lý AI (web) hoặc hỏi bot Zalo/Telegram thì mới tính vào hạn mức lượt gọi AI trong ngày.',
    lienKet: [],
  },
  {
    id: 'demo',
    tu: ['demo', 'du lieu that khong', 'mo phong', 'that hay gia', 'chinh thuc'],
    mau: 'Số liệu trên hệ thống là thật hay mô phỏng?',
    text: 'Đây là BẢN DEMO thử nghiệm nội bộ: danh sách, điểm số và phần lớn lá phiếu là dữ liệu mô phỏng để minh họa, không phải kết quả chính thức.\n'
      + 'Nếu dùng kết quả vào việc chính thức, cần đối chiếu lại với hồ sơ gốc của cơ quan.',
    lienKet: [],
  },
];

/** Câu trả lời khi không khớp kịch bản nào. */
export const NGOAI_KICH_BAN = {
  id: 'ngoai',
  text: 'Câu này nằm ngoài kịch bản soạn sẵn của tôi. Quý vị có thể:\n'
    + '• Hỏi trợ lý AI qua Zalo hoặc Telegram — bên đó trả lời được câu hỏi mở và đọc được số liệu thật;\n'
    + '• Hoặc xem trang Hướng dẫn & hỗ trợ.\n'
    + 'Quý vị cũng có thể bấm thử các gợi ý bên dưới.',
  lienKet: [
    { nhan: 'Chat Zalo', url: CHAT_ZALO },
    { nhan: 'Chat Telegram', url: CHAT_TELEGRAM },
    { nhan: 'Trang Hướng dẫn', url: '#/hotro' },
  ],
};

/**
 * Tìm câu trả lời cho một câu hỏi. Trả về {id, text, lienKet}.
 * Cách chấm: cộng ĐỘ DÀI các từ khóa xuất hiện trong câu (cụm dài, cụ thể
 * thắng cụm ngắn); không khớp từ nào thì trả lời "ngoài kịch bản".
 */
export function traLoi(cauHoi) {
  const q = ` ${boDau(cauHoi)} `;
  if (!q.trim()) return NGOAI_KICH_BAN;
  let tot = null; let diemTot = 0;
  for (const kb of KICH_BAN) {
    let diem = 0;
    for (const tu of kb.tu) if (q.includes(tu)) diem += tu.length;
    if (diem > diemTot) { diemTot = diem; tot = kb; }
  }
  if (!tot) return NGOAI_KICH_BAN;
  return { id: tot.id, text: tot.text, lienKet: tot.lienKet || [] };
}
