// ============================================================================
//  DANH MỤC PHÂN HỆ (MODULE) CỦA HỆ THỐNG — dùng chung cho Trang chủ và bộ định tuyến.
//  Mỗi phân hệ có một đường dẫn dạng #/<route>; `target` cho biết mở gì:
//    { kind: 'app', version, tab }  → mở ứng dụng đánh giá cán bộ với bộ tiêu chí tương ứng
//    { kind: 'tieuchi' }            → mở module Đánh giá tiêu chí HĐND tỉnh, xã, phường
// ============================================================================

export const MODULES = [
  {
    id: 'okr', route: 'okr', group: 'main',
    title: 'Đánh giá OKR / KPI cán bộ, công chức',
    short: 'OKR / KPI',
    desc: 'Đánh giá, xếp loại cán bộ, công chức, người lao động hằng tháng theo OKR/KPI: Nhóm I tiêu chí chung (30đ) và Nhóm II kết quả nhiệm vụ (70đ) chấm theo Số lượng - Chất lượng - Tiến độ.',
    tags: ['Nghị định 335/2025/NĐ-CP', 'Hằng tháng', 'Danh mục sản phẩm công việc'],
    icon: 'Target', tone: 'emerald',
    target: { kind: 'app', version: 'sonha', tab: 'dash' },
  },
  {
    id: 'kiemdiem', route: 'kiemdiem', group: 'main',
    title: 'Kiểm điểm, đánh giá, xếp loại đảng viên',
    short: 'Kiểm điểm đảng viên',
    desc: 'Kiểm điểm, đánh giá, xếp loại chất lượng hằng quý đối với cán bộ diện Ban Thường vụ Tỉnh ủy quản lý: Nhóm A tiêu chí chung (30đ) và Nhóm B kết quả 6 trục công tác (70đ).',
    tags: ['HD 03-HD/TU', 'Hằng quý', 'Phụ lục 3A · 4'],
    icon: 'ShieldCheck', tone: 'rose',
    target: { kind: 'app', version: 'kiemdiem', tab: 'dash' },
  },
  {
    id: 'tieuchi', route: 'tieuchi', group: 'main',
    title: 'Đánh giá tiêu chí HĐND tỉnh, xã, phường',
    short: 'Tiêu chí HĐND',
    desc: 'HĐND cấp tỉnh và HĐND các xã, phường đăng nhập để tự đánh giá, tự chấm điểm theo Khung tiêu chí nhiệm kỳ 2026 - 2031; Thường trực HĐND tỉnh thẩm định, bình xét và xếp loại.',
    tags: ['Khung tiêu chí 2026-2031', 'Phụ lục I · II', 'Đơn vị tự đăng nhập'],
    icon: 'Landmark', tone: 'indigo', badge: 'Mới',
    target: { kind: 'tieuchi' },
  },
  {
    id: 'hr', route: 'canbo', group: 'tool',
    title: 'Quản lý cán bộ (hồ sơ 2C)',
    short: 'Quản lý cán bộ',
    desc: 'Hồ sơ cán bộ theo Mẫu 2C/TCTW-98, nhắc việc nhân sự (nâng lương, nghỉ hưu, hợp đồng, sinh nhật) và theo dõi biên chế.',
    tags: ['Chỉ Quản trị'], icon: 'Users', tone: 'amber',
    target: { kind: 'app', version: 'sonha', tab: 'hr' },
  },
  {
    id: 'guide', route: 'hotro', group: 'tool',
    title: 'Hướng dẫn & hỗ trợ sử dụng',
    short: 'Hướng dẫn',
    desc: 'Hướng dẫn toàn hệ thống: các phân hệ, tài khoản và phân quyền, cách tính điểm - xếp loại, quy trình và mốc thời gian, cơ sở pháp lý, câu hỏi thường gặp và kênh hỗ trợ.',
    tags: ['Bắt đầu nhanh', 'Cơ sở pháp lý', 'Hỏi đáp'], icon: 'BookOpen', tone: 'sky',
    target: { kind: 'huongdan' },
  },
  {
    id: 'lab', route: 'thunghiem', group: 'tool',
    title: 'Phòng thử nghiệm bộ tiêu chí',
    short: 'Thử nghiệm',
    desc: 'Các phiên bản bộ tiêu chí đang nghiên cứu, thử nghiệm (Cổ điển theo QĐ 1053, Cải tiến, mô hình khu vực công Singapore).',
    tags: ['Nghiên cứu', 'So sánh mô hình'], icon: 'FlaskConical', tone: 'violet',
    target: { kind: 'app', version: 'sg', tab: 'dash' },
    labVersions: ['classic', 'improved', 'sg'],
  },
];

export const moduleByRoute = (r) => MODULES.find((m) => m.route === r) || null;
export const moduleByVersion = (v) => MODULES.find((m) => m.target.kind === 'app' && m.target.version === v) || null;

// Cơ sở pháp lý hiển thị ở trang chủ.
export const LEGAL_BASIS = [
  { code: 'Nghị định 335/2025/NĐ-CP', desc: 'Đánh giá, xếp loại chất lượng cán bộ, công chức (hiệu lực 01/01/2026).' },
  { code: 'QĐ 1053-QĐ/TU (05/6/2026)', desc: 'Bộ tiêu chí đánh giá, xếp loại cán bộ, công chức tỉnh Thanh Hóa.' },
  { code: 'HD 03-HD/TU (02/7/2026)', desc: 'Kiểm điểm, đánh giá, xếp loại chất lượng hằng quý cán bộ diện BTV Tỉnh ủy quản lý.' },
  { code: 'Khung tiêu chí HĐND 2026 - 2031', desc: 'Đánh giá, xếp loại HĐND cấp tỉnh, cấp xã tỉnh Thanh Hóa (dự thảo).' },
  { code: 'Luật Tổ chức chính quyền địa phương 72/2025/QH15', desc: 'Tổ chức và hoạt động của HĐND các cấp.' },
  { code: 'Nghị quyết 57-NQ/TW', desc: 'Đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.' },
];
