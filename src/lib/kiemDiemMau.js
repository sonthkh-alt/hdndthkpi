// ============================================================================
//  MẪU KẾ HOẠCH SẢN PHẨM/CÔNG VIỆC QUÝ THEO CHỨC DANH
//  (Hướng dẫn số 03-HD/TU ngày 02/7/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa)
//
//  Dựng theo ĐÚNG hai biểu mẫu đang dùng thực tế tại cơ quan:
//   • "KẾ HOẠCH sản phẩm/công việc và kết quả cần đạt được của cá nhân — Quý …"
//     (đầu kỳ: đăng ký nhiệm vụ + ĐỀ XUẤT điểm tối đa từng trục, trình tập thể
//      lãnh đạo phê duyệt);
//   • "BẢN TỰ ĐÁNH GIÁ, XẾP LOẠI CỦA CÁ NHÂN — Quý …" (cuối kỳ: ghi kết quả sản
//     phẩm thực tế + Điểm KPI cho từng trục trên chính kế hoạch đã được duyệt).
//
//  ⚠️ HAI ĐIỂM CỐT LÕI của biểu mẫu thật mà phần mềm phải tôn trọng:
//   1. ĐIỂM TỐI ĐA CỦA TỪNG TRỤC KHÔNG CỐ ĐỊNH. Cá nhân tự đề xuất theo thứ tự ưu
//      tiên công việc của mình, tổng 6 trục = 70 điểm; tập thể lãnh đạo phê duyệt.
//      (Cùng một đồng chí: Quý III là 15-20-10-15-5-5, Quý IV là 10-20-10-20-5-5.)
//   2. Mỗi trục ghi rõ là "trục chính, chủ yếu" hay "trục phụ, phối hợp, hỗ trợ",
//      vai trò này cũng thay đổi theo quý.
//
//  TỆP THUẦN LOGIC: không import React/Supabase → chạy và kiểm thử được bằng Node.
// ============================================================================

export const KD_TRUC_IDS = ['t1', 't2', 't3', 't4', 't5', 't6'];
export const KD_TONG_B = 70; // tổng điểm tối đa của Nhóm B (6 trục)

// Vai trò của trục đối với chức danh trong quý (ghi ngay dưới tên trục ở biểu mẫu).
export const KD_VAITRO = [
  { k: 'chinh', label: 'trục chính, chủ yếu', short: 'Trục chính' },
  { k: 'phu', label: 'trục phụ, phối hợp, hỗ trợ', short: 'Trục phụ' },
];
export const vaiTroOf = (k) => KD_VAITRO.find((x) => x.k === k) || KD_VAITRO[1];

// ---------------------------------------------------------------------------
//  LĨNH VỰC PHỤ TRÁCH CỦA 4 BAN HĐND TỈNH — dùng để sinh mẫu riêng cho từng Ban.
// ---------------------------------------------------------------------------
const BAN = {
  ktns: {
    ten: 'Kinh tế - Ngân sách',
    linhVuc: 'kinh tế, tài chính - ngân sách, đầu tư công, xây dựng, giao thông, tài nguyên và môi trường',
    diem: { t1: 20, t2: 20, t3: 5, t4: 10, t5: 10, t6: 5 },
    thamTra: 'thẩm tra báo cáo tình hình kinh tế - xã hội, dự toán ngân sách nhà nước năm 2027, phương án phân bổ ngân sách cấp tỉnh và kế hoạch đầu tư công',
    giamSat: 'giám sát tiến độ giải ngân vốn đầu tư công và hiệu quả các dự án trọng điểm trên địa bàn tỉnh',
    anSinh: 'giám sát việc bố trí, sử dụng nguồn lực thực hiện các chính sách an sinh xã hội và chương trình mục tiêu quốc gia',
  },
  vhxh: {
    ten: 'Văn hóa - Xã hội',
    linhVuc: 'văn hóa, giáo dục, y tế, khoa học và công nghệ, lao động, việc làm, an sinh xã hội',
    diem: { t1: 10, t2: 20, t3: 5, t4: 10, t5: 20, t6: 5 },
    thamTra: 'thẩm tra các báo cáo, tờ trình, dự thảo nghị quyết về văn hóa, giáo dục, y tế, lao động, an sinh xã hội trình kỳ họp cuối năm 2026',
    giamSat: 'giám sát việc thực hiện chính sách, pháp luật về giáo dục, y tế cơ sở sau khi vận hành chính quyền địa phương hai cấp',
    anSinh: 'giám sát việc thực hiện chính sách người có công, bảo trợ xã hội, giảm nghèo bền vững và chăm lo đời sống Nhân dân dịp cuối năm',
  },
  pc: {
    ten: 'Pháp chế',
    linhVuc: 'thi hành Hiến pháp và pháp luật, tư pháp, nội chính, quốc phòng - an ninh, xây dựng chính quyền',
    diem: { t1: 10, t2: 25, t3: 5, t4: 15, t5: 5, t6: 10 },
    thamTra: 'thẩm tra các dự thảo nghị quyết về tổ chức bộ máy, xây dựng chính quyền, nội chính, tư pháp trình kỳ họp cuối năm 2026',
    giamSat: 'giám sát công tác thi hành pháp luật, tiếp công dân, giải quyết khiếu nại, tố cáo và tính hợp pháp của văn bản quy phạm pháp luật cấp xã',
    anSinh: 'giám sát việc bảo đảm quyền, lợi ích hợp pháp của công dân trong giải quyết thủ tục hành chính',
  },
  dt: {
    ten: 'Dân tộc',
    linhVuc: 'công tác dân tộc, chính sách dân tộc, phát triển kinh tế - xã hội vùng đồng bào dân tộc thiểu số và miền núi',
    diem: { t1: 15, t2: 15, t3: 5, t4: 10, t5: 20, t6: 5 },
    thamTra: 'thẩm tra các nội dung về chính sách dân tộc, chương trình phát triển kinh tế - xã hội vùng đồng bào dân tộc thiểu số và miền núi',
    giamSat: 'giám sát việc thực hiện Chương trình mục tiêu quốc gia phát triển kinh tế - xã hội vùng đồng bào dân tộc thiểu số và miền núi',
    anSinh: 'giám sát việc thực hiện chính sách hỗ trợ đồng bào dân tộc thiểu số, giảm nghèo bền vững, bảo tồn bản sắc văn hóa dân tộc',
  },
};

// Khai gọn một nhiệm vụ: n = mục tiêu/nhiệm vụ đề ra · kq = kết quả cần đạt
// · tg = thời gian hoàn thành · tam = tầm quan trọng (trọng số khi tính KPI của trục).
const nv = (n, kq, tg, tam = 'quantrong') => ({ n, kq, tg, tam });

// Hai nhiệm vụ nền dùng lại ở trục 5, trục 6 (viết lại vai trò theo từng chức danh).
const tvVanHoa = (vaiTro) => nv(
  `${vaiTro} việc thực hiện chế độ, chính sách, chăm lo đời sống, điều kiện làm việc của cán bộ, công chức, người lao động; tổng kết phong trào thi đua, hoạt động văn hóa, thể thao năm 2026`,
  'Chế độ, chính sách được thực hiện đầy đủ, kịp thời; phong trào thi đua, hoạt động văn hóa, thể thao được tổng kết theo kế hoạch',
  'Trong quý', 'thuong');
const tvQpan = (vaiTro) => nv(
  `${vaiTro} công tác bảo vệ, phòng cháy chữa cháy mùa hanh khô, an ninh trật tự tại trụ sở và tại các kỳ họp; tham gia phục vụ hoạt động đối ngoại theo phân công`,
  'Không để xảy ra mất an toàn, mất an ninh trật tự; hoạt động đối ngoại được phục vụ chu đáo, đúng quy định',
  'Trong quý', 'thuong');

const hoa = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
//  BỘ MẪU THEO CHỨC DANH
// ---------------------------------------------------------------------------
function mauTruongBan(k) {
  const b = BAN[k];
  const trongAnSinh = k === 'vhxh' || k === 'dt';
  return {
    ten: `Trưởng Ban ${b.ten} HĐND tỉnh`,
    diem: b.diem,
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'phu', t5: trongAnSinh ? 'chinh' : 'phu', t6: k === 'pc' ? 'chinh' : 'phu' },
    nvs: {
      t1: [
        nv(`Chỉ đạo ${b.thamTra}`,
          'Báo cáo thẩm tra hoàn thành, gửi đại biểu đúng thời hạn; ý kiến thẩm tra rõ chính kiến, có căn cứ pháp lý và số liệu đối chiếu',
          'Tháng 11-12/2026', 'trongtam'),
        nv(`Chỉ đạo theo dõi, đôn đốc việc thực hiện các nghị quyết của HĐND tỉnh thuộc lĩnh vực ${b.linhVuc}`,
          'Báo cáo kết quả theo dõi và kiến nghị được gửi Thường trực HĐND tỉnh phục vụ kỳ họp thường lệ cuối năm 2026',
          'Trong quý'),
      ],
      t2: [
        nv('Chủ trì thẩm tra các dự thảo nghị quyết trình kỳ họp thường lệ cuối năm 2026 thuộc lĩnh vực Ban phụ trách, bảo đảm đúng thẩm quyền, trình tự, thủ tục',
          'Các dự thảo nghị quyết được thẩm tra, rà soát căn cứ pháp lý, thể thức trước khi trình HĐND tỉnh; không có nghị quyết phải chỉnh sửa lớn sau khi trình',
          'Tháng 11-12/2026', 'trongtam'),
        nv(`Chỉ đạo ${b.giamSat}`,
          'Kế hoạch, đề cương giám sát được ban hành; báo cáo kết quả giám sát trình Thường trực HĐND tỉnh đúng tiến độ',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Tham gia tiếp công dân định kỳ; chỉ đạo xử lý đơn thư, kiến nghị của cử tri thuộc lĩnh vực Ban phụ trách',
          '100% đơn thư, kiến nghị thuộc trách nhiệm được xem xét, chuyển và đôn đốc giải quyết, không để tồn đọng',
          'Hằng tháng'),
      ],
      t3: [
        nv('Chỉ đạo ứng dụng phần mềm quản lý hoạt động giám sát và kho dữ liệu dùng chung phục vụ thẩm tra, giám sát của Ban; sử dụng phòng họp không giấy',
          'Hồ sơ thẩm tra, giám sát của Ban được số hóa; các phiên họp Ban sử dụng tài liệu điện tử',
          'Trong quý', 'thuong'),
      ],
      t4: [
        nv('Lãnh đạo, chỉ đạo sinh hoạt chi bộ, quán triệt nghị quyết; chỉ đạo kiểm điểm, đánh giá, xếp loại chất lượng tập thể, cá nhân năm 2026 theo Quy định số 73-QĐ/TU',
          'Sinh hoạt chi bộ đầy đủ, đúng quy định; hồ sơ kiểm điểm, đánh giá năm 2026 hoàn thành đúng thời hạn',
          'Tháng 11-12/2026'),
        nv('Gương mẫu thực hành tiết kiệm, chống lãng phí, phòng, chống tham nhũng, tiêu cực; kê khai tài sản, thu nhập theo quy định',
          'Không để xảy ra vi phạm; hoàn thành kê khai tài sản, thu nhập đúng thời hạn',
          'Trong quý', 'thuong'),
      ],
      t5: [
        nv(`Chỉ đạo ${b.anSinh}`,
          'Báo cáo, kiến nghị sau giám sát được ban hành; kiến nghị của cử tri về an sinh xã hội được đôn đốc giải quyết',
          'Tháng 11-12/2026', trongAnSinh ? 'trongtam' : 'thuong'),
      ],
      t6: [tvQpan('Chỉ đạo giám sát')],
    },
  };
}

function mauPhoBan(k) {
  const b = BAN[k];
  // Phó Trưởng Ban thiên về TRỰC TIẾP thực hiện thẩm tra, giám sát nên trục 1 nặng hơn;
  // trục "xây dựng Đảng" (chỉ đạo, quản lý) nhẹ hơn so với Trưởng Ban. Tổng vẫn 70.
  const diem = { ...b.diem, t1: b.diem.t1 + 5, t4: Math.max(5, b.diem.t4 - 5) };
  const trongAnSinh = k === 'vhxh' || k === 'dt';
  return {
    ten: `Phó Trưởng Ban ${b.ten} HĐND tỉnh`,
    diem,
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'phu', t5: trongAnSinh ? 'chinh' : 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv(`Trực tiếp ${b.thamTra} theo phân công của Trưởng Ban`,
          'Dự thảo báo cáo thẩm tra hoàn thành đúng tiến độ, đủ căn cứ; số liệu được đối chiếu với cơ quan trình',
          'Tháng 11-12/2026', 'trongtam'),
        nv(`Tham gia khảo sát, nắm tình hình thực tiễn tại cơ sở về lĩnh vực ${b.linhVuc} phục vụ thẩm tra, giám sát`,
          'Báo cáo khảo sát, số liệu phục vụ thẩm tra được tổng hợp đầy đủ, kịp thời',
          'Trong quý'),
      ],
      t2: [
        nv('Tham gia Đoàn giám sát, Tổ giúp việc: trực tiếp xây dựng kế hoạch, đề cương, biểu mẫu số liệu và dự thảo báo cáo kết quả giám sát chuyên đề của Ban',
          'Kế hoạch, đề cương được ban hành; dự thảo báo cáo giám sát trình Trưởng Ban đúng tiến độ',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Trực tiếp rà soát thể thức, căn cứ pháp lý các dự thảo nghị quyết thuộc lĩnh vực Ban trước khi trình ký ban hành',
          'Không có nghị quyết phải chỉnh sửa lớn về thể thức, căn cứ pháp lý sau khi trình',
          'Tháng 11-12/2026'),
      ],
      t3: [
        nv('Ứng dụng phần mềm quản lý hoạt động giám sát, kho dữ liệu dùng chung trong xử lý công việc; sử dụng tài liệu điện tử tại các phiên họp, kỳ họp',
          'Hồ sơ công việc được xử lý trên môi trường điện tử; tài liệu được số hóa, nộp lưu đúng quy định',
          'Trong quý', 'thuong'),
      ],
      t4: [
        nv('Thực hiện nhiệm vụ đảng viên; tham gia kiểm điểm, đánh giá, xếp loại chất lượng năm 2026; thực hành tiết kiệm, chống lãng phí, kê khai tài sản, thu nhập',
          'Hoàn thành nhiệm vụ đảng viên được giao; hồ sơ kiểm điểm cá nhân hoàn thành đúng thời hạn',
          'Tháng 11-12/2026', 'thuong'),
      ],
      t5: [
        nv(`Tham gia ${b.anSinh}`,
          'Báo cáo, kiến nghị sau giám sát được tổng hợp, trình Trưởng Ban đúng tiến độ',
          'Tháng 11-12/2026', trongAnSinh ? 'quantrong' : 'thuong'),
      ],
      t6: [tvQpan('Tham gia giám sát')],
    },
  };
}

export const KD_MAU = {
  // ---------------- Lãnh đạo HĐND tỉnh ----------------
  pct_tt: {
    ten: 'Phó Chủ tịch Thường trực HĐND tỉnh',
    diem: { t1: 15, t2: 20, t3: 5, t4: 20, t5: 5, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chủ trì, điều hành hoạt động thường xuyên của Thường trực HĐND tỉnh; chỉ đạo chuẩn bị nội dung, chương trình kỳ họp chuyên đề và kỳ họp thường lệ cuối năm 2026',
          'Các phiên họp Thường trực HĐND tỉnh được tổ chức, ban hành kết luận và theo dõi thực hiện; chương trình, nội dung kỳ họp được thống nhất, thông báo đúng thời hạn',
          'Hằng tháng', 'trongtam'),
        nv('Chỉ đạo xem xét, cho ý kiến đối với các báo cáo, tờ trình về tình hình kinh tế - xã hội năm 2026, nhiệm vụ năm 2027, dự toán ngân sách và kế hoạch đầu tư công',
          'Các nội dung trình kỳ họp được cho ý kiến bảo đảm căn cứ pháp lý, khả thi, đúng tiến độ',
          'Tháng 11-12/2026', 'trongtam'),
      ],
      t2: [
        nv('Chỉ đạo xây dựng, ban hành nghị quyết của HĐND tỉnh đúng thẩm quyền, trình tự, thủ tục; rà soát nghị quyết còn hiệu lực để sửa đổi, bổ sung, bãi bỏ kịp thời sau sắp xếp đơn vị hành chính',
          'Nghị quyết được ban hành đúng quy định; danh mục nghị quyết cần sửa đổi, bãi bỏ được rà soát, báo cáo Thường trực HĐND tỉnh',
          'Trong quý', 'trongtam'),
        nv('Chỉ đạo hoạt động giám sát chuyên đề của Thường trực HĐND tỉnh về phân cấp, phân quyền, phân bổ nguồn lực gắn với vận hành chính quyền địa phương hai cấp',
          'Báo cáo kết quả giám sát và dự thảo nghị quyết về giám sát được trình HĐND tỉnh tại kỳ họp cuối năm 2026',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chủ trì tiếp công dân định kỳ; chỉ đạo xử lý đơn thư khiếu nại, tố cáo, kiến nghị của cử tri thuộc thẩm quyền',
          '100% đơn thư thuộc trách nhiệm được xử lý, theo dõi đến kết quả cuối cùng, không để tồn đọng, vượt cấp',
          'Hằng tháng'),
      ],
      t3: [
        nv('Chỉ đạo triển khai Đề án chuyển đổi số của HĐND tỉnh; thí điểm biểu quyết điện tử, mở rộng kỳ họp không giấy tới HĐND cấp xã',
          'Đề án chuyển đổi số được ban hành; kỳ họp cuối năm được phục vụ bằng phần mềm phòng họp không giấy',
          'Tháng 12/2026'),
      ],
      t4: [
        nv('Lãnh đạo, chỉ đạo Đảng ủy HĐND tỉnh thực hiện nhiệm vụ chính trị; chỉ đạo kiểm điểm, đánh giá, xếp loại chất lượng tập thể, cá nhân năm 2026 theo Quy định số 73-QĐ/TU và Hướng dẫn số 03-HD/TU',
          'Hồ sơ kiểm điểm, đánh giá, xếp loại năm 2026 của tập thể và cán bộ diện Ban Thường vụ Tỉnh ủy quản lý hoàn thành, gửi đúng thời hạn',
          'Tháng 11-12/2026', 'trongtam'),
        nv('Chỉ đạo hoàn thiện hồ sơ Nghị quyết của Ban Thường vụ Tỉnh ủy về tăng cường sự lãnh đạo của Đảng đối với việc đổi mới, nâng cao chất lượng, hiệu quả hoạt động của HĐND các cấp nhiệm kỳ 2026 - 2031',
          'Hồ sơ trình Ban Thường vụ Tỉnh ủy hoàn thiện đúng thời hạn đăng ký chương trình công tác; kế hoạch triển khai được xây dựng sau khi nghị quyết ban hành',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chỉ đạo thực hành tiết kiệm, chống lãng phí; phòng, chống tham nhũng, tiêu cực; giữ gìn đoàn kết, thống nhất nội bộ',
          'Không để xảy ra vi phạm; kinh phí năm 2026 được quản lý, quyết toán đúng quy định',
          'Trong quý', 'thuong'),
      ],
      t5: [
        nv('Chỉ đạo giám sát việc thực hiện chính sách an sinh xã hội, giảm nghèo bền vững; chăm lo đời sống Nhân dân dịp cuối năm và Tết Nguyên đán',
          'Báo cáo giám sát, kiến nghị được ban hành; chính sách đối với người có công, hộ nghèo được thực hiện đầy đủ, kịp thời',
          'Tháng 12/2026'),
      ],
      t6: [
        nv('Chỉ đạo giám sát công tác quốc phòng, an ninh, trật tự an toàn xã hội; chủ trì, tham gia hoạt động đối ngoại của HĐND tỉnh theo phân công',
          'Báo cáo giám sát được ban hành; hoạt động đối ngoại được tổ chức chu đáo, đúng quy định về quản lý thống nhất hoạt động đối ngoại',
          'Trong quý'),
      ],
    },
  },
  pct: {
    ten: 'Phó Chủ tịch HĐND tỉnh',
    diem: { t1: 15, t2: 20, t3: 5, t4: 15, t5: 10, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chỉ đạo lĩnh vực được phân công; cho ý kiến đối với các báo cáo, tờ trình, dự thảo nghị quyết trình kỳ họp thường lệ cuối năm 2026',
          'Các nội dung thuộc lĩnh vực phụ trách được xem xét, cho ý kiến đầy đủ, đúng tiến độ trình kỳ họp',
          'Tháng 11-12/2026', 'trongtam'),
        nv('Chỉ đạo theo dõi, đôn đốc việc thực hiện các nghị quyết của HĐND tỉnh và kết luận của Thường trực HĐND tỉnh thuộc lĩnh vực phụ trách',
          'Báo cáo kết quả thực hiện nghị quyết, kết luận phục vụ kỳ họp cuối năm được hoàn thành đúng hạn',
          'Trong quý'),
      ],
      t2: [
        nv('Chỉ đạo hoạt động thẩm tra của các Ban thuộc lĩnh vực phụ trách; rà soát tính hợp hiến, hợp pháp, tính thống nhất của dự thảo nghị quyết trước khi trình',
          'Các dự thảo nghị quyết được thẩm tra đúng quy trình; không có nghị quyết phải sửa đổi do sai căn cứ pháp lý',
          'Tháng 11-12/2026', 'trongtam'),
        nv('Làm Trưởng đoàn hoặc thành viên Đoàn giám sát chuyên đề của Thường trực HĐND tỉnh; chỉ đạo theo dõi, đôn đốc thực hiện kết luận sau giám sát, sau chất vấn',
          'Hoạt động giám sát hoàn thành theo kế hoạch; báo cáo kết quả thực hiện kết luận sau giám sát phục vụ kỳ họp cuối năm',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Tiếp công dân định kỳ theo phân công; chỉ đạo giải quyết, đôn đốc kiến nghị của cử tri thuộc lĩnh vực phụ trách',
          'Lịch tiếp công dân được thực hiện đầy đủ; kiến nghị cử tri được phân loại, chuyển và đôn đốc giải quyết đúng hạn',
          'Hằng tháng'),
      ],
      t3: [
        nv('Chỉ đạo ứng dụng công nghệ số trong hoạt động giám sát, tiếp xúc cử tri, xử lý kiến nghị; khai thác hệ thống điều hành và kho dữ liệu dùng chung của HĐND tỉnh',
          'Kiến nghị cử tri được theo dõi trên phần mềm; hồ sơ giám sát được số hóa, khai thác dùng chung',
          'Trong quý', 'thuong'),
      ],
      t4: [
        nv('Thực hiện nhiệm vụ cấp ủy viên; chỉ đạo kiểm điểm, đánh giá, xếp loại chất lượng năm 2026 đối với tập thể, cá nhân thuộc phạm vi phụ trách',
          'Hồ sơ kiểm điểm, đánh giá hoàn thành đúng thời hạn; sinh hoạt cấp ủy, chi bộ đầy đủ, đúng quy định',
          'Tháng 11-12/2026'),
        nv('Gương mẫu thực hành tiết kiệm, chống lãng phí, phòng, chống tham nhũng, tiêu cực; kê khai tài sản, thu nhập theo quy định',
          'Không để xảy ra vi phạm; hoàn thành kê khai tài sản, thu nhập đúng thời hạn',
          'Trong quý', 'thuong'),
      ],
      t5: [
        nv('Chỉ đạo giám sát việc thực hiện chính sách phát triển văn hóa, giáo dục, y tế, an sinh xã hội; nắm tình hình đời sống Nhân dân dịp cuối năm',
          'Báo cáo, kiến nghị sau giám sát được ban hành và đôn đốc thực hiện',
          'Tháng 11-12/2026'),
      ],
      t6: [tvQpan('Chỉ đạo giám sát')],
    },
  },

  // ---------------- 4 Ban của HĐND tỉnh ----------------
  tb_ktns: mauTruongBan('ktns'),
  tb_vhxh: mauTruongBan('vhxh'),
  tb_pc: mauTruongBan('pc'),
  tb_dt: mauTruongBan('dt'),
  pb_ktns: mauPhoBan('ktns'),
  pb_vhxh: mauPhoBan('vhxh'),
  pb_pc: mauPhoBan('pc'),
  pb_dt: mauPhoBan('dt'),

  // ---------------- Đoàn ĐBQH tỉnh ----------------
  pho_doan: {
    ten: 'Phó Trưởng đoàn đại biểu Quốc hội tỉnh',
    diem: { t1: 15, t2: 20, t3: 5, t4: 15, t5: 10, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chỉ đạo tổ chức để Đoàn đại biểu Quốc hội tỉnh tham gia kỳ họp Quốc hội; chuẩn bị ý kiến thảo luận về tình hình kinh tế - xã hội, ngân sách nhà nước',
          'Đoàn tham gia đầy đủ chương trình kỳ họp; ý kiến thảo luận, chất vấn được chuẩn bị có căn cứ, gắn với thực tiễn địa phương',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Chỉ đạo tổng hợp, theo dõi, đôn đốc việc giải quyết kiến nghị của cử tri tỉnh gửi tới Quốc hội và các bộ, ngành Trung ương',
          'Báo cáo tổng hợp kiến nghị cử tri được gửi đúng thời hạn; kiến nghị được theo dõi đến kết quả trả lời',
          'Trong quý', 'trongtam'),
      ],
      t2: [
        nv('Chỉ đạo tổ chức lấy ý kiến góp ý các dự án luật, pháp lệnh, nghị quyết trình kỳ họp Quốc hội; tổng hợp ý kiến của cơ quan, tổ chức, chuyên gia trên địa bàn',
          'Các dự án luật được lấy ý kiến đầy đủ; văn bản tổng hợp gửi Ủy ban Thường vụ Quốc hội đúng thời hạn',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Chỉ đạo hoạt động giám sát chuyên đề của Đoàn đại biểu Quốc hội tỉnh theo chương trình giám sát của Quốc hội, Ủy ban Thường vụ Quốc hội',
          'Kế hoạch, đề cương giám sát được ban hành; báo cáo kết quả giám sát gửi đúng thời hạn',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chủ trì tiếp công dân, tiếp xúc cử tri trước và sau kỳ họp Quốc hội theo quy định',
          'Các cuộc tiếp xúc cử tri được tổ chức đầy đủ; đơn thư, kiến nghị được phân loại, chuyển và đôn đốc giải quyết',
          'Trong quý'),
      ],
      t3: [
        nv('Chỉ đạo ứng dụng công nghệ số trong tổng hợp, theo dõi kiến nghị cử tri và khai thác tài liệu kỳ họp Quốc hội',
          'Kiến nghị cử tri được quản lý trên phần mềm; tài liệu kỳ họp được khai thác dưới dạng điện tử',
          'Trong quý', 'thuong'),
      ],
      t4: [
        nv('Thực hiện nhiệm vụ cấp ủy viên; tham gia kiểm điểm, đánh giá, xếp loại chất lượng năm 2026; chỉ đạo phòng, chống tham nhũng, lãng phí, tiêu cực trong phạm vi phụ trách',
          'Hồ sơ kiểm điểm, đánh giá hoàn thành đúng thời hạn; không để xảy ra vi phạm',
          'Tháng 11-12/2026'),
      ],
      t5: [
        nv('Chỉ đạo giám sát việc thực hiện chính sách, pháp luật về an sinh xã hội, giảm nghèo, người có công trên địa bàn tỉnh',
          'Báo cáo giám sát, kiến nghị được ban hành và chuyển đến cơ quan có thẩm quyền',
          'Tháng 11-12/2026'),
      ],
      t6: [tvQpan('Chỉ đạo giám sát')],
    },
  },
  dbqh: {
    ten: 'Đại biểu Quốc hội hoạt động chuyên trách',
    diem: { t1: 15, t2: 20, t3: 5, t4: 10, t5: 15, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'phu', t5: 'chinh', t6: 'phu' },
    nvs: {
      t1: [
        nv('Tham gia đầy đủ các phiên họp của Quốc hội, của Hội đồng Dân tộc, Ủy ban mà mình là thành viên; phát biểu thảo luận về kinh tế - xã hội, ngân sách nhà nước',
          'Tham gia 100% phiên họp theo triệu tập; có ý kiến phát biểu, chất vấn được ghi nhận trong biên bản kỳ họp',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Nghiên cứu, chuẩn bị nội dung chất vấn, tranh luận gắn với thực tiễn tỉnh Thanh Hóa',
          'Nội dung chất vấn, tranh luận được chuẩn bị có số liệu, dẫn chứng cụ thể',
          'Tháng 10-11/2026'),
      ],
      t2: [
        nv('Nghiên cứu, góp ý các dự án luật, pháp lệnh, nghị quyết trình kỳ họp Quốc hội thuộc lĩnh vực chuyên sâu',
          'Văn bản góp ý được gửi đúng thời hạn, có chính kiến rõ ràng, đề xuất phương án cụ thể',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Tham gia Đoàn giám sát của Quốc hội, Ủy ban Thường vụ Quốc hội và của Đoàn đại biểu Quốc hội tỉnh',
          'Tham gia đầy đủ hoạt động giám sát; có ý kiến, kiến nghị được tiếp thu trong báo cáo giám sát',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Tiếp công dân, tiếp xúc cử tri theo quy định; chuyển và đôn đốc giải quyết đơn thư, kiến nghị của cử tri',
          'Thực hiện đủ số cuộc tiếp xúc cử tri, tiếp công dân; 100% đơn thư được xử lý theo thẩm quyền',
          'Trong quý'),
      ],
      t3: [
        nv('Khai thác tài liệu, dữ liệu số phục vụ nghiên cứu, thẩm tra, giám sát; sử dụng phần mềm quản lý kiến nghị cử tri',
          'Tài liệu và kiến nghị cử tri được theo dõi, khai thác trên môi trường điện tử',
          'Trong quý', 'thuong'),
      ],
      t4: [
        nv('Thực hiện nhiệm vụ đảng viên; tham gia kiểm điểm, đánh giá, xếp loại chất lượng năm 2026; thực hành tiết kiệm, chống lãng phí, kê khai tài sản, thu nhập',
          'Hoàn thành nhiệm vụ đảng viên được giao; hồ sơ kiểm điểm cá nhân hoàn thành đúng thời hạn',
          'Tháng 11-12/2026', 'thuong'),
      ],
      t5: [
        nv('Giám sát, kiến nghị việc thực hiện chính sách an sinh xã hội, giáo dục, y tế, giảm nghèo bền vững; nắm bắt, phản ánh tâm tư, nguyện vọng của cử tri',
          'Ý kiến, kiến nghị của cử tri được phản ánh tới Quốc hội, các bộ, ngành và được theo dõi kết quả trả lời',
          'Trong quý'),
      ],
      t6: [tvQpan('Tham gia giám sát')],
    },
  },

  // ---------------- Lãnh đạo Văn phòng ----------------
  chanh_vp: {
    ten: 'Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh',
    diem: { t1: 15, t2: 15, t3: 10, t4: 20, t5: 5, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'chinh', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chỉ đạo toàn diện công tác tham mưu, phục vụ hoạt động của Đoàn đại biểu Quốc hội, Thường trực HĐND và các Ban của HĐND tỉnh; bảo đảm điều kiện tổ chức kỳ họp thường lệ cuối năm 2026',
          'Kỳ họp, các phiên họp và hoạt động giám sát được phục vụ chu đáo, đúng tiến độ; không để sai sót về hồ sơ, tài liệu',
          'Trong quý', 'trongtam'),
        nv('Chỉ đạo xây dựng báo cáo tổng kết hoạt động năm 2026 và chương trình công tác năm 2027 của Thường trực HĐND tỉnh và của cơ quan',
          'Báo cáo tổng kết và chương trình công tác năm 2027 được ban hành đúng thời hạn, bảo đảm chất lượng',
          'Tháng 12/2026', 'trongtam'),
      ],
      t2: [
        nv('Chỉ đạo rà soát, hoàn thiện quy chế làm việc, quy trình xử lý công việc của cơ quan theo hướng rõ người, rõ việc, rõ trách nhiệm, rõ thời hạn',
          'Quy chế, quy trình được ban hành, quán triệt và thực hiện thống nhất trong cơ quan',
          'Tháng 10-12/2026'),
        nv('Chỉ đạo bảo đảm chất lượng, tiến độ thẩm định thể thức, căn cứ pháp lý của văn bản trước khi trình ký ban hành',
          'Văn bản ban hành đúng thể thức, đúng thẩm quyền; tỷ lệ hồ sơ xử lý đúng hạn đạt 100%',
          'Trong quý'),
      ],
      t3: [
        nv('Chỉ đạo xây dựng, trình ban hành Đề án chuyển đổi số của HĐND tỉnh và kế hoạch chuyển đổi số năm 2027 của cơ quan',
          'Đề án và kế hoạch chuyển đổi số năm 2027 được xây dựng, trình cấp có thẩm quyền trong quý',
          'Tháng 12/2026', 'trongtam'),
        nv('Chỉ đạo đẩy mạnh xử lý văn bản trên môi trường điện tử, số hóa hồ sơ, vận hành phòng họp không giấy và các phần mềm dùng chung',
          '100% văn bản đến, đi được xử lý trên hệ thống; hồ sơ, tài liệu được số hóa, nộp lưu đúng quy định',
          'Trong quý'),
      ],
      t4: [
        nv('Lãnh đạo, chỉ đạo công tác tổ chức cán bộ: đánh giá, xếp loại Quý IV và năm 2026 theo Quy định số 73-QĐ/TU, Hướng dẫn số 03-HD/TU; đề xuất thi đua, khen thưởng năm 2026',
          'Hồ sơ đánh giá, xếp loại và hồ sơ thi đua, khen thưởng hoàn thành, trình đúng thời hạn',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chỉ đạo lập dự toán ngân sách năm 2027; quản lý, quyết toán kinh phí năm 2026 đúng chế độ, định mức; thực hành tiết kiệm, chống lãng phí',
          'Dự toán năm 2027 được lập, gửi đúng hạn; kinh phí năm 2026 được quyết toán đúng quy định, không sai phạm',
          'Trong quý', 'trongtam'),
        nv('Lãnh đạo, chỉ đạo sinh hoạt cấp ủy, chi bộ; giữ gìn đoàn kết nội bộ; phòng, chống tham nhũng, lãng phí, tiêu cực trong cơ quan',
          'Sinh hoạt cấp ủy, chi bộ đầy đủ, đúng quy định; không để xảy ra vi phạm trong cơ quan',
          'Trong quý'),
      ],
      t5: [tvVanHoa('Chỉ đạo')],
      t6: [tvQpan('Chỉ đạo')],
    },
  },
  // Phó Chánh Văn phòng phụ trách khối HĐND (Phòng Công tác HĐND; Phòng Hành chính,
  // Tổ chức, Quản trị) — dựng theo đúng bản Kế hoạch Quý IV/2026 đang áp dụng.
  pho_vp_hdnd: {
    ten: 'Phó Chánh Văn phòng (phụ trách khối HĐND)',
    diem: { t1: 10, t2: 20, t3: 10, t4: 20, t5: 5, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chỉ đạo tham mưu, phục vụ chu đáo các phiên họp của Thường trực HĐND tỉnh và hoạt động thẩm tra, khảo sát, giám sát của Thường trực HĐND tỉnh, các Ban của HĐND tỉnh',
          'Hồ sơ, tài liệu phục vụ phiên họp được chuẩn bị đầy đủ, đúng tiến độ; kết luận phiên họp được ban hành, theo dõi thực hiện',
          'Hằng tháng', 'trongtam'),
        nv('Chỉ đạo xây dựng báo cáo tháng, báo cáo quý và báo cáo tổng kết hoạt động năm 2026 của Thường trực HĐND, các Ban của HĐND tỉnh; tham mưu chương trình công tác năm 2027',
          'Báo cáo tổng kết năm 2026 và chương trình công tác năm 2027 được ban hành đúng thời hạn, bảo đảm chất lượng',
          'Tháng 12/2026', 'trongtam'),
      ],
      t2: [
        nv('Trực tiếp chỉ đạo xây dựng, hoàn thiện các văn bản phục vụ kỳ họp chuyên đề (nếu có) và kỳ họp thường lệ cuối năm 2026: dự thảo nghị quyết, tài liệu phiên chất vấn, biên bản, diễn văn, kịch bản điều hành, báo cáo kết quả kỳ họp, thông báo kết luận',
          'Văn bản kỳ họp hoàn thành đúng tiến độ, chất lượng; nghị quyết được rà soát thể thức, căn cứ pháp lý trước khi trình ký ban hành',
          'Tháng 11-12/2026', 'trongtam'),
        nv('Thành viên Đoàn giám sát của Thường trực HĐND tỉnh, Tổ trưởng Tổ giúp việc: chỉ đạo xây dựng kế hoạch, đề cương, biểu mẫu số liệu; tổ chức giám sát tại các đơn vị; tổng hợp, xây dựng dự thảo báo cáo kết quả giám sát',
          'Kế hoạch, đề cương giám sát được ban hành; hoạt động giám sát hoàn thành theo kế hoạch; dự thảo báo cáo kết quả giám sát trình Thường trực HĐND tỉnh đúng tiến độ phục vụ kỳ họp cuối năm',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chỉ đạo tham mưu theo dõi, đôn đốc việc thực hiện kết luận sau giám sát, sau chất vấn; tham mưu phiên giải trình của Thường trực HĐND tỉnh (nếu có)',
          'Báo cáo kết quả thực hiện kết luận sau giám sát, sau chất vấn phục vụ kỳ họp cuối năm; văn bản đôn đốc các nội dung chậm thực hiện',
          'Tháng 11-12/2026'),
      ],
      t3: [
        nv('Tổ trưởng Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng: ban hành kế hoạch hoạt động của Tổ, phân công nhiệm vụ và chủ động tham mưu triển khai',
          'Kế hoạch hoạt động của Tổ được ban hành; nhiệm vụ được phân công cụ thể tới từng thành viên',
          'Tháng 10-12/2026'),
        nv('Đẩy mạnh xử lý văn bản trên môi trường điện tử, số hóa hồ sơ; tham mưu triển khai Đề án chuyển đổi số của Thường trực HĐND tỉnh và kế hoạch chuyển đổi số năm 2027 của cơ quan',
          'Các văn bản triển khai của Thường trực HĐND tỉnh và kế hoạch chuyển đổi số năm 2027 được xây dựng, trình Chánh Văn phòng',
          'Trong quý'),
      ],
      t4: [
        nv('Tham mưu công tác tổ chức cán bộ: triển khai đánh giá Quý IV và kiểm điểm, đánh giá, xếp loại chất lượng tập thể, cá nhân năm 2026 theo Quy định số 73-QĐ/TU, Hướng dẫn số 03-HD/TU; tổng hợp, đề xuất thi đua, khen thưởng năm 2026',
          'Hồ sơ đánh giá Quý IV và xếp loại cuối năm hoàn thành đúng thời hạn quy định; hồ sơ thi đua, khen thưởng được trình đúng hạn',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chỉ đạo lập dự toán ngân sách năm 2027; rà soát, thực hiện các khoản chi cuối năm đúng chế độ, định mức; thực hành tiết kiệm, chống lãng phí; kê khai tài sản, thu nhập',
          'Dự toán năm 2027 được lập, gửi đúng hạn; kinh phí năm 2026 được quản lý, quyết toán đúng quy định, không sai phạm',
          'Trong quý'),
        nv('Tổ trưởng Tổ giúp việc: chủ trì hoàn thiện hồ sơ Nghị quyết của Ban Thường vụ Tỉnh ủy về tăng cường sự lãnh đạo của Đảng đối với việc đổi mới, nâng cao chất lượng, hiệu quả hoạt động của HĐND các cấp nhiệm kỳ 2026 - 2031; hoàn thiện Đề án nâng cao hiệu quả hoạt động và đổi mới, sáng tạo của HĐND các cấp và Khung tiêu chí đánh giá chất lượng hoạt động của HĐND hai cấp',
          'Hồ sơ trình Ban Thường vụ Tỉnh ủy hoàn thiện đúng thời hạn đăng ký; Đề án, Khung tiêu chí, kế hoạch thi đua được Thường trực HĐND tỉnh thông qua; dự thảo kế hoạch triển khai nghị quyết được xây dựng trong quý',
          'Tháng 10-12/2026', 'trongtam'),
      ],
      t5: [tvVanHoa('Chỉ đạo')],
      t6: [tvQpan('Chỉ đạo')],
    },
  },
  // Phó Chánh Văn phòng phụ trách khối Đoàn ĐBQH và công tác tổng hợp, dân nguyện.
  pho_vp_dbqh: {
    ten: 'Phó Chánh Văn phòng (phụ trách khối Đoàn ĐBQH, tổng hợp - dân nguyện)',
    diem: { t1: 15, t2: 20, t3: 10, t4: 15, t5: 5, t6: 5 },
    vai: { t1: 'chinh', t2: 'chinh', t3: 'phu', t4: 'chinh', t5: 'phu', t6: 'phu' },
    nvs: {
      t1: [
        nv('Chỉ đạo tham mưu, phục vụ hoạt động của Đoàn đại biểu Quốc hội tỉnh tại kỳ họp Quốc hội; bảo đảm tài liệu, điều kiện làm việc cho đại biểu',
          'Tài liệu, điều kiện phục vụ đại biểu được chuẩn bị đầy đủ, kịp thời trong suốt kỳ họp',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Chỉ đạo xây dựng báo cáo hoạt động năm 2026 và chương trình công tác năm 2027 của Đoàn đại biểu Quốc hội tỉnh',
          'Báo cáo và chương trình công tác được ban hành đúng thời hạn, bảo đảm chất lượng',
          'Tháng 12/2026', 'trongtam'),
      ],
      t2: [
        nv('Chỉ đạo tham mưu tổ chức lấy ý kiến, tổng hợp góp ý các dự án luật trình kỳ họp Quốc hội; hoàn thiện văn bản gửi Ủy ban Thường vụ Quốc hội',
          'Văn bản tổng hợp ý kiến góp ý được gửi đúng thời hạn, đủ nội dung theo yêu cầu',
          'Tháng 10-11/2026', 'trongtam'),
        nv('Chỉ đạo tham mưu, phục vụ hoạt động giám sát chuyên đề của Đoàn đại biểu Quốc hội tỉnh; tổng hợp dự thảo báo cáo kết quả giám sát',
          'Kế hoạch, đề cương và báo cáo kết quả giám sát hoàn thành đúng tiến độ',
          'Tháng 10-12/2026', 'trongtam'),
        nv('Chỉ đạo công tác dân nguyện: tổng hợp, phân loại, chuyển và đôn đốc giải quyết đơn thư, kiến nghị của cử tri; tham mưu tổ chức tiếp xúc cử tri trước và sau kỳ họp',
          'Báo cáo tổng hợp kiến nghị cử tri được gửi đúng thời hạn; 100% đơn thư được xử lý theo thẩm quyền, không để tồn đọng',
          'Trong quý'),
      ],
      t3: [
        nv('Chỉ đạo ứng dụng phần mềm quản lý kiến nghị cử tri và kho dữ liệu dùng chung; số hóa hồ sơ tiếp xúc cử tri, hồ sơ giám sát của Đoàn',
          'Kiến nghị cử tri được quản lý, theo dõi trên phần mềm; hồ sơ được số hóa, nộp lưu đúng quy định',
          'Trong quý'),
        nv('Thành viên Tổ công tác về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số của Văn phòng: tham mưu triển khai nhiệm vụ được phân công',
          'Nhiệm vụ được phân công hoàn thành theo kế hoạch hoạt động của Tổ',
          'Tháng 10-12/2026', 'thuong'),
      ],
      t4: [
        nv('Tham mưu công tác thông tin, tuyên truyền hoạt động của Đoàn đại biểu Quốc hội và HĐND tỉnh; tham gia kiểm điểm, đánh giá, xếp loại chất lượng năm 2026',
          'Nội dung tuyên truyền được đăng tải kịp thời, chính xác; hồ sơ kiểm điểm, đánh giá hoàn thành đúng thời hạn',
          'Tháng 11-12/2026'),
        nv('Gương mẫu thực hành tiết kiệm, chống lãng phí, phòng, chống tham nhũng, tiêu cực; kê khai tài sản, thu nhập; hoàn thành nhiệm vụ đảng viên được giao',
          'Không để xảy ra vi phạm; hoàn thành kê khai tài sản, thu nhập đúng thời hạn',
          'Trong quý', 'thuong'),
      ],
      t5: [tvVanHoa('Tham mưu')],
      t6: [tvQpan('Tham mưu')],
    },
  },
};

export const MAU_LIST = Object.entries(KD_MAU).map(([k, m]) => ({ k, ten: m.ten }));

// ---------------------------------------------------------------------------
//  SUY MẪU THEO CHỨC VỤ + ĐƠN VỊ (dùng khi hồ sơ chưa ghi sẵn khóa mẫu).
//  ⚠️ Thứ tự kiểm tra có chủ ý: "phó trưởng ban" phải xét TRƯỚC "trưởng ban",
//  "phó chánh văn phòng" trước "chánh văn phòng" — chuỗi sau là con của chuỗi trước.
// ---------------------------------------------------------------------------
const thuong = (s) => String(s || '').toLowerCase();
export function mauKeyFor(person) {
  if (person && person.mauKD && KD_MAU[person.mauKD]) return person.mauKD;
  const p = thuong(person?.position), d = thuong(person?.department), pd = p + ' ' + d;
  const ban = /kinh tế|ngân sách/.test(pd) ? 'ktns'
    : /văn hóa|xã hội/.test(pd) ? 'vhxh'
      : /pháp chế/.test(pd) ? 'pc'
        : /dân tộc/.test(pd) ? 'dt' : null;
  if (ban && /phó trưởng ban/.test(p)) return `pb_${ban}`;
  if (ban && /trưởng ban/.test(p)) return `tb_${ban}`;
  if (/phó chủ tịch thường trực/.test(p)) return 'pct_tt';
  if (/phó chủ tịch/.test(p)) return 'pct';
  if (/phó trưởng đoàn/.test(p)) return 'pho_doan';
  if (/đại biểu quốc hội/.test(p)) return 'dbqh';
  if (/phó chánh văn phòng/.test(p)) return 'pho_vp_hdnd';
  if (/chánh văn phòng/.test(p)) return 'chanh_vp';
  return 'pho_vp_hdnd';
}
export const tenMau = (k) => (KD_MAU[k] || {}).ten || '';

// ---------------------------------------------------------------------------
//  DỰNG KẾ HOẠCH QUÝ TỪ MẪU.
//  Trả về { trucCfg, truc } đúng cấu trúc person.kd:
//    trucCfg[tX] = { max, vaiTro }   — điểm tối đa cá nhân đề xuất + vai trò của trục
//    truc[tX]    = { note, tasks: [ { id, name, ketQuaCanDat, thoiGian, tam, … } ] }
//  Khi mới LẬP KẾ HOẠCH thì `muc` và `ketQuaThucTe` để trống (chưa đánh giá).
//  Truyền `mucPlan` (chuỗi mức luân phiên) và `ketQua` để sinh sẵn phần đã chấm
//  cho bộ dữ liệu mẫu của bản demo.
// ---------------------------------------------------------------------------
export function mauKeHoach(mauKey, { mucPlan = null, ketQua = null } = {}) {
  const m = KD_MAU[mauKey] || KD_MAU.pho_vp_hdnd;
  const trucCfg = {}, truc = {};
  let i = 0;
  KD_TRUC_IDS.forEach((id) => {
    trucCfg[id] = { max: m.diem[id] ?? 0, vaiTro: m.vai[id] || 'phu' };
    truc[id] = {
      note: '',
      tasks: (m.nvs[id] || []).map((t, k) => {
        const task = {
          id: `${id}n${k + 1}`, name: t.n, ketQuaCanDat: t.kq, thoiGian: t.tg, tam: t.tam,
          ketQuaThucTe: '', muc: '',
        };
        if (mucPlan && mucPlan.length) task.muc = mucPlan[i % mucPlan.length];
        if (ketQua) task.ketQuaThucTe = ketQua(task, i);
        i += 1;
        return task;
      }),
    };
  });
  return { trucCfg, truc };
}

// Tổng điểm tối đa đã phân bổ cho 6 trục — kế hoạch chỉ hợp lệ khi bằng 70.
export function tongDiemTruc(trucCfg) {
  return KD_TRUC_IDS.reduce((s, id) => s + (Number((trucCfg || {})[id]?.max) || 0), 0);
}

// Chia lại cho đủ 70 điểm: giữ nguyên tỷ lệ đang có, làm tròn về bội số 0,5 rồi
// dồn phần lẻ vào trục có điểm cao nhất (tránh tổng bị 69,5 hay 70,5 do làm tròn).
export function canDeuVe70(trucCfg) {
  const cur = KD_TRUC_IDS.map((id) => Math.max(0, Number((trucCfg || {})[id]?.max) || 0));
  const tong = cur.reduce((a, b) => a + b, 0);
  const base = tong > 0 ? cur.map((v) => Math.round((v / tong) * KD_TONG_B * 2) / 2)
    : KD_TRUC_IDS.map(() => Math.round((KD_TONG_B / 6) * 2) / 2);
  let du = KD_TONG_B - base.reduce((a, b) => a + b, 0);
  if (du !== 0) { const i = base.indexOf(Math.max(...base)); base[i] = Math.round((base[i] + du) * 2) / 2; }
  const out = {};
  KD_TRUC_IDS.forEach((id, i) => { out[id] = { ...((trucCfg || {})[id] || {}), max: base[i] }; });
  return out;
}

// Nhãn phần trăm mỗi trục chiếm trong 70 điểm — dùng để hiển thị thanh phân bổ.
export const tyLeTruc = (trucCfg, id) => {
  const t = tongDiemTruc(trucCfg);
  return t > 0 ? ((Number((trucCfg || {})[id]?.max) || 0) / t) * 100 : 0;
};

export { hoa };
