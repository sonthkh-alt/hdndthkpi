import { newStaff, addMonths, retireAgeMonths, hesoOf, ngachOf } from './hr';

// ============================================================================
// DANH SÁCH CÁN BỘ khởi tạo cho module Quản lý cán bộ:
//   • Đại biểu Quốc hội chuyên trách và đại biểu HĐND tỉnh chuyên trách (12 đồng chí)
//   • Cán bộ, công chức, người lao động Văn phòng Đoàn ĐBQH và HĐND tỉnh (28 người)
// HỌ TÊN, CHỨC VỤ, PHÒNG là dữ liệu thật (theo docs/DU/DU.docx và docs/KPI.docx).
// ⚠ Các thông tin hồ sơ khác (ngày sinh, ngạch/bậc lương, ngày hưởng lương, hợp đồng…) là
//   DỮ LIỆU MÔ PHỎNG để minh họa chức năng nhắc việc — phải đối chiếu, cập nhật theo hồ sơ gốc.
//   Mọi bản ghi được đánh dấu sample = true cho tới khi Quản trị xác nhận.
// Ngày tháng được sinh TƯƠNG ĐỐI so với thời điểm nạp để các cảnh báo luôn có ý nghĩa khi demo.
// ============================================================================

const iso = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// [0] tên · [1] giới tính · [2] phòng/đơn vị · [3] chức vụ · [4] đối tượng · [5] ngạch
// [6] bậc · [7] tuổi (hoặc null nếu dùng retireIn) · [8] tùy chọn:
//     { retireIn: <tháng tới khi nghỉ hưu>, raiseIn: <tháng tới khi nâng lương>,
//       bdayIn: <ngày tới sinh nhật>, contractIn: <ngày tới khi hết hạn HĐ>,
//       appointIn: <tháng còn lại của nhiệm kỳ bổ nhiệm>, vk: <% vượt khung>, email }
const ROWS = [
  // ---- Đại biểu HĐND tỉnh chuyên trách & đại biểu Quốc hội chuyên trách ----
  ['Lê Tiến Lam', 'nam', 'HĐND tỉnh', 'Ủy viên Ban Thường vụ Tỉnh ủy, Phó Chủ tịch Thường trực HĐND tỉnh', 'hdnd', '01.001', 5, null, { retireIn: 4, raiseIn: 22 }],
  ['Nguyễn Quang Hải', 'nam', 'HĐND tỉnh', 'Tỉnh ủy viên, Phó Chủ tịch HĐND tỉnh', 'hdnd', '01.001', 4, 54, { raiseIn: 9, appointIn: 14 }],
  ['Hoàng Anh Tuấn', 'nam', 'Ban Kinh tế - Ngân sách', 'Tỉnh ủy viên, Trưởng Ban Kinh tế - Ngân sách HĐND tỉnh', 'hdnd', '01.001', 3, 51, { raiseIn: 2, appointIn: 8 }],
  ['Ngô Thị Hồng Hảo', 'nu', 'Ban Văn hóa - Xã hội', 'Tỉnh ủy viên, Trưởng Ban Văn hóa - Xã hội HĐND tỉnh', 'hdnd', '01.001', 3, null, { retireIn: 9, bdayIn: 12 }],
  ['Nguyễn Quốc Hải', 'nam', 'Ban Pháp chế', 'Trưởng Ban Pháp chế HĐND tỉnh', 'hdnd', '01.002', 7, 50, { raiseIn: 17 }],
  ['Lương Tiến Thành', 'nam', 'Ban Dân tộc', 'Trưởng Ban Dân tộc HĐND tỉnh', 'hdnd', '01.002', 6, 48, { raiseIn: 26, appointIn: 2 }],
  ['Đỗ Ngọc Duy', 'nam', 'Ban Kinh tế - Ngân sách', 'Phó Trưởng Ban Kinh tế - Ngân sách HĐND tỉnh', 'hdnd', '01.002', 5, 46, { raiseIn: 12 }],
  ['Lê Thị Hương', 'nu', 'Ban Pháp chế', 'Phó Trưởng Ban Pháp chế HĐND tỉnh', 'hdnd', '01.002', 4, 45, { raiseIn: 1, bdayIn: 5 }],
  ['Nguyễn Tuấn Tưởng', 'nam', 'Ban Văn hóa - Xã hội', 'Phó Trưởng Ban Văn hóa - Xã hội HĐND tỉnh', 'hdnd', '01.002', 4, 44, { raiseIn: 20 }],
  ['Cầm Bá Chái', 'nam', 'Ban Dân tộc', 'Phó Trưởng Ban Dân tộc HĐND tỉnh', 'hdnd', '01.002', 3, 47, { raiseIn: 30, ethnic: 'Thái' }],
  ['Lương Thị Hoa', 'nu', 'Đoàn ĐBQH tỉnh', 'Tỉnh ủy viên, Phó Trưởng đoàn ĐBQH tỉnh', 'dbqh', '01.001', 3, 49, { raiseIn: 15 }],
  ['Bùi Văn Dũng', 'nam', 'Đoàn ĐBQH tỉnh', 'Đại biểu Quốc hội chuyên trách tỉnh', 'dbqh', '01.002', 6, 52, { raiseIn: 6 }],
  // ---- Lãnh đạo Văn phòng ----
  ['Trần Mạnh Long', 'nam', 'Văn phòng', 'Tỉnh ủy viên, Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'cc', '01.001', 4, 53, { raiseIn: 19, appointIn: 22 }],
  ['Hà Ngọc Sơn', 'nam', 'Văn phòng', 'Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'cc', '01.002', 6, 47, { raiseIn: 3, appointIn: 17, email: 'sonthkh@gmail.com' }],
  ['Lê Văn Mạnh', 'nam', 'Văn phòng', 'Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'cc', '01.002', 5, 46, { raiseIn: 25, appointIn: 5 }],
  // ---- Trưởng, Phó Trưởng phòng ----
  ['Nguyễn Tiến Khương', 'nam', 'Phòng Công tác Hội đồng', 'Trưởng phòng', 'cc', '01.002', 4, 45, { raiseIn: 11 }],
  ['Đỗ Tuấn Vũ', 'nam', 'Phòng Tổng hợp - Thông tin - Dân nguyện', 'Phó Trưởng phòng', 'cc', '01.002', 3, 42, { raiseIn: 2, bdayIn: 9 }],
  ['Dương Anh Quân', 'nam', 'Phòng Công tác Quốc hội', 'Phó Trưởng phòng', 'cc', '01.002', 3, 41, { raiseIn: 28 }],
  ['Ngô Ngọc Quyến', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Phó Trưởng phòng', 'cc', '01.002', 2, 43, { raiseIn: 16, appointIn: 3 }],
  // ---- Chuyên viên ----
  ['Trần Thị Hiền', 'nu', 'Phòng Công tác Hội đồng', 'Chuyên viên', 'cc', '01.003', 6, 39, { raiseIn: 21 }],
  ['Đào Thùy Linh', 'nu', 'Phòng Công tác Hội đồng', 'Chuyên viên', 'cc', '01.003', 4, 34, { raiseIn: 5 }],
  ['Đinh Lê Trà My', 'nu', 'Phòng Công tác Hội đồng', 'Chuyên viên', 'cc', '01.003', 2, 29, { raiseIn: 14, bdayIn: 3 }],
  ['Doãn Ngọc Hài', 'nam', 'Phòng Công tác Hội đồng', 'Chuyên viên', 'cc', '01.003', 5, 37, { raiseIn: 8 }],
  ['Lê Thị Thu Hòa', 'nu', 'Phòng Công tác Quốc hội', 'Chuyên viên', 'cc', '01.003', 5, 38, { raiseIn: 24 }],
  ['Lê Thị Thu Hà', 'nu', 'Phòng Tổng hợp - Thông tin - Dân nguyện', 'Chuyên viên', 'cc', '01.003', 7, 40, { raiseIn: 1 }],
  ['Nguyễn Thị Hương Thảo', 'nu', 'Phòng Tổng hợp - Thông tin - Dân nguyện', 'Chuyên viên', 'cc', '01.003', 3, 33, { raiseIn: 18 }],
  ['Nguyễn Thị Tâm Phương', 'nu', 'Phòng Tổng hợp - Thông tin - Dân nguyện', 'Chuyên viên', 'cc', '01.003', 9, 44, { raiseIn: 33, vk: 5 }],
  ['Nguyễn Lương Chiến', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Chuyên viên', 'cc', '01.003', 4, 36, { raiseIn: 7 }],
  ['Lê Thị Hương', 'nu', 'Phòng Hành chính - Tổ chức - Quản trị', 'Chuyên viên', 'cc', '01.003', 3, 32, { raiseIn: 27 }],
  ['Đỗ Thị Quỳnh Trang', 'nu', 'Phòng Hành chính - Tổ chức - Quản trị', 'Chuyên viên', 'cc', '01.003', 2, 30, { raiseIn: 13, bdayIn: 14 }],
  // ---- Lao động hợp đồng (lái xe, phục vụ, bảo vệ) ----
  ['Nguyễn Hữu Chân', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 6, 48, { raiseIn: 10, contractIn: 45 }],
  ['Nguyễn Văn Từ', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 5, 45, { raiseIn: 19, contractIn: 400 }],
  ['Vũ Hoàng Quang', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 4, 40, { raiseIn: 4, contractIn: 250 }],
  ['Nguyễn Thái Dũng', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 4, 38, { raiseIn: 23, contractIn: 500 }],
  ['Dương Bảo Châu', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 3, 35, { raiseIn: 15, contractIn: 30 }],
  ['Ngô Văn Tiến', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 5, 43, { raiseIn: 9, contractIn: 320 }],
  ['Nguyễn Hữu Quyết', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Lái xe', 'hd', 'HD', 3, 36, { raiseIn: 20, contractIn: 610 }],
  ['Nguyễn Thị Thúy Vân', 'nu', 'Phòng Hành chính - Tổ chức - Quản trị', 'Nhân viên phục vụ', 'hd', 'HD', 4, 41, { raiseIn: 6, contractIn: 180 }],
  ['Lê Thị Thủy', 'nu', 'Phòng Hành chính - Tổ chức - Quản trị', 'Nhân viên phục vụ', 'hd', 'HD', 3, 37, { raiseIn: 12, contractIn: 55 }],
  ['Nguyễn Văn Huy', 'nam', 'Phòng Hành chính - Tổ chức - Quản trị', 'Bảo vệ', 'hd', 'HD', 4, 44, { raiseIn: 17, contractIn: 280 }],
];

// Chỉ tiêu biên chế được giao (mô phỏng) — Quản trị cập nhật theo quyết định giao biên chế.
export const SEED_QUOTA = {
  'HĐND tỉnh': { cc: 2, hd: 0 },
  'Đoàn ĐBQH tỉnh': { cc: 2, hd: 0 },
  'Ban Kinh tế - Ngân sách': { cc: 3, hd: 0 },
  'Ban Văn hóa - Xã hội': { cc: 3, hd: 0 },
  'Ban Pháp chế': { cc: 2, hd: 0 },
  'Ban Dân tộc': { cc: 2, hd: 0 },
  'Văn phòng': { cc: 3, hd: 0 },
  'Phòng Công tác Hội đồng': { cc: 6, hd: 0 },
  'Phòng Công tác Quốc hội': { cc: 4, hd: 0 },
  'Phòng Tổng hợp - Thông tin - Dân nguyện': { cc: 5, hd: 0 },
  'Phòng Hành chính - Tổ chức - Quản trị': { cc: 5, hd: 10 },
};

// Nhiệm vụ, báo cáo có thời hạn (mô phỏng theo công tác tổ chức cán bộ thường kỳ).
export function seedDuties(today = new Date()) {
  const mk = (title, owner, dueDate, repeat, lead, note) => ({
    id: 'd_' + Math.random().toString(36).slice(2, 8),
    title, owner, due: iso(dueDate), repeat, lead, note, done: false, doneAt: '',
  });
  return [
    mk('Báo cáo thống kê chất lượng cán bộ, công chức, người lao động', 'Phòng Hành chính - Tổ chức - Quản trị', addDays(today, 8), 'year', 20, 'Gửi Ban Tổ chức Tỉnh ủy'),
    mk('Rà soát, lập danh sách nâng bậc lương thường xuyên đợt tới', 'Phòng Hành chính - Tổ chức - Quản trị', addDays(today, 20), 'quarter', 25, 'Trình Hội đồng lương cơ quan'),
    mk('Kê khai tài sản, thu nhập hằng năm', 'Toàn thể cán bộ, công chức', addDays(today, 120), 'year', 45, 'Hoàn thành trước 31/12 theo NĐ 130/2020'),
    mk('Báo cáo kết quả đánh giá, xếp loại cán bộ, công chức hằng tháng', 'Phòng Hành chính - Tổ chức - Quản trị', addDays(today, 3), 'month', 7, 'Chốt số liệu trước ngày 25 hằng tháng'),
    mk('Rà soát quy hoạch cán bộ lãnh đạo, quản lý', 'Lãnh đạo Văn phòng', addDays(today, 60), 'year', 30, ''),
    mk('Cập nhật hồ sơ, lý lịch cán bộ (Mẫu 2C/TCTW-98) vào phần mềm', 'Phòng Hành chính - Tổ chức - Quản trị', addDays(today, -5), 'once', 15, 'Bổ sung thông tin còn thiếu, thay dữ liệu mô phỏng'),
  ];
}

// Sinh danh sách hồ sơ cán bộ.
export function seedStaff(today = new Date()) {
  return ROWS.map(([name, gender, department, position, category, ngach, bac, age, o = {}], i) => {
    const s = newStaff(name);
    const ng = ngachOf(ngach);
    // --- Ngày sinh ---
    let birth;
    if (o.retireIn != null) {
      // Tính ngược từ thời điểm nghỉ hưu mong muốn (today + retireIn tháng)
      const target = addMonths(today, o.retireIn);
      birth = addMonths(target, -retireAgeMonths(target.getFullYear(), gender));
    } else if (o.bdayIn != null) {
      const d = addDays(today, o.bdayIn);
      birth = new Date(d.getFullYear() - age, d.getMonth(), d.getDate());
    } else {
      birth = new Date(today.getFullYear() - age, (i * 7) % 12, ((i * 11) % 27) + 1);
    }
    // --- Ngày hưởng bậc lương hiện tại: lùi lại (chu kỳ − số tháng còn lại) ---
    const cycle = o.vk ? 12 : ng.cycle;
    const salary = addMonths(today, (o.raiseIn ?? 18) - cycle);
    Object.assign(s, {
      gender, department, position, category, ngach, bac,
      heso: hesoOf(ngach, bac), salaryDate: iso(salary), vuotKhungPct: o.vk || 0,
      birth: iso(birth), ethnic: o.ethnic || 'Kinh', email: o.email || '',
      hireDate: iso(addMonths(birth, 12 * 23)), hireAgency: 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa',
      mainWork: position, eduGeneral: '12/12',
      eduMajor: category === 'hd' ? 'Trung cấp nghề' : 'Đại học',
      politics: /Trưởng Ban|Phó Chủ tịch|Chánh Văn phòng|Trưởng đoàn/.test(position) ? 'Cao cấp'
        : /Phó Trưởng Ban|Phó Chánh Văn phòng|Trưởng phòng/.test(position) ? 'Trung cấp' : '',
      sample: true,
    });
    if (o.contractIn != null) {
      s.contractType = 'Hợp đồng lao động không xác định thời hạn';
      s.contractFrom = iso(addMonths(today, -36));
      s.contractTo = iso(addDays(today, o.contractIn));
    }
    if (o.appointIn != null) {
      s.appointTerm = 60;
      s.appointDate = iso(addMonths(today, o.appointIn - 60));
    }
    return s;
  });
}
