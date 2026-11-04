// ============================================================================
//  BỘ SỐ MẪU — DỮ LIỆU GIẢ, chỉ để xem phân hệ chạy thế nào
//
//  ⚠️ KHÔNG phải số liệu của đơn vị nào. Tên đơn vị là "HĐND phường Mẫu",
//  mọi mã đều mang tiền tố MAU- / .MAU. để không lẫn với mã thật. Hồ sơ kê
//  khai thật của các xã, phường KHÔNG được nhúng vào mã nguồn: repo này công
//  khai (xem `.gitignore` chặn `docs/btctw/`).
//
//  Bộ mẫu cố ý nhỏ (04 VTVL · 06 nhiệm vụ · 18 công việc) để người dùng đi
//  hết các bước nhập số trong vài phút, và cố ý đặt sẵn một dòng CHƯA ĐẠT
//  (thiếu sản lượng) để thấy phần mềm soát lỗi ra sao.
// ============================================================================

const KY = '01/10/2025–30/9/2026';
const NGUON = 'Số liệu mô phỏng của bộ số mẫu — không phải số liệu của đơn vị nào';

/** 04 vị trí việc làm mẫu. */
const VTVL = [
  ['MAU-LĐQL-01', 'Chủ tịch Hội đồng nhân dân phường (mẫu)', 'Cán bộ'],
  ['MAU-LĐQL-02', 'Phó Chủ tịch Hội đồng nhân dân phường (mẫu)', 'Cán bộ'],
  ['MAU-LĐQL-03', 'Trưởng Ban của Hội đồng nhân dân phường (mẫu)', 'Cán bộ'],
  ['MAU-CMNV-01', 'Công chức tham mưu, giúp việc Hội đồng nhân dân (mẫu)', 'Công chức'],
];

/** 06 nhiệm vụ mẫu. */
const NHIEM_VU = [
  ['NV.MAU.01', 'Tổ chức kỳ họp Hội đồng nhân dân phường'],
  ['NV.MAU.02', 'Ban hành, theo dõi nghị quyết của Hội đồng nhân dân'],
  ['NV.MAU.03', 'Hoạt động của Thường trực Hội đồng nhân dân'],
  ['NV.MAU.04', 'Giám sát chuyên đề, khảo sát của các Ban'],
  ['NV.MAU.05', 'Tiếp công dân, xử lý đơn thư, tiếp xúc cử tri'],
  ['NV.MAU.06', 'Thẩm tra nội dung trình kỳ họp'],
];

//  Mỗi công việc: [mã công việc, mã nhiệm vụ, mã VTVL, tên, sản phẩm, đơn vị tính,
//                  phút/SP chuẩn của danh mục, số SP/năm mẫu, nhóm]
const CONG_VIEC = [
  ['CV.MAU.01.01', 'NV.MAU.01', 'MAU-LĐQL-01', 'Triệu tập, chủ tọa, kết luận kỳ họp', 'Quyết định triệu tập; kết luận kỳ họp', 'Kỳ họp', 480, 8, 'V'],
  ['CV.MAU.01.02', 'NV.MAU.01', 'MAU-LĐQL-02', 'Dự kiến chương trình, kịch bản điều hành kỳ họp', 'Kế hoạch, chương trình, kịch bản', 'Kỳ họp', 1080, 8, 'V'],
  ['CV.MAU.01.03', 'NV.MAU.01', 'MAU-CMNV-01', 'Chuẩn bị tài liệu, phục vụ kỳ họp', 'Bộ tài liệu kỳ họp', 'Kỳ họp', 1440, 8, 'IV'],
  ['CV.MAU.02.01', 'NV.MAU.02', 'MAU-LĐQL-01', 'Ký chứng thực nghị quyết của Hội đồng nhân dân', 'Nghị quyết đã ký chứng thực', 'Nghị quyết', 55, 42, 'IV'],
  ['CV.MAU.02.02', 'NV.MAU.02', 'MAU-CMNV-01', 'Hoàn thiện, phát hành, công khai nghị quyết', 'Nghị quyết đã phát hành, công khai', 'Nghị quyết', 180, 42, 'III'],
  ['CV.MAU.02.03', 'NV.MAU.02', 'MAU-CMNV-01', 'Theo dõi, rà soát, hệ thống hóa nghị quyết', 'Báo cáo rà soát nghị quyết', 'Báo cáo', 960, 2, 'IV'],
  ['CV.MAU.03.01', 'NV.MAU.03', 'MAU-LĐQL-01', 'Chủ trì phiên họp Thường trực Hội đồng nhân dân', 'Kết luận phiên họp', 'Phiên họp', 240, 12, 'V'],
  ['CV.MAU.03.02', 'NV.MAU.03', 'MAU-LĐQL-02', 'Chuẩn bị nội dung phiên họp Thường trực', 'Tài liệu phiên họp', 'Phiên họp', 480, 12, 'IV'],
  ['CV.MAU.03.03', 'NV.MAU.03', 'MAU-CMNV-01', 'Phục vụ phiên họp, ghi biên bản, thông báo kết luận', 'Biên bản, thông báo kết luận', 'Phiên họp', 300, 12, 'III'],
  ['CV.MAU.04.01', 'NV.MAU.04', 'MAU-LĐQL-03', 'Chủ trì giám sát chuyên đề của Ban', 'Báo cáo kết quả giám sát', 'Cuộc giám sát', 2400, 4, 'V'],
  ['CV.MAU.04.02', 'NV.MAU.04', 'MAU-LĐQL-03', 'Khảo sát phục vụ giám sát', 'Báo cáo khảo sát', 'Cuộc khảo sát', 1200, 3, 'IV'],
  ['CV.MAU.04.03', 'NV.MAU.04', 'MAU-CMNV-01', 'Tham mưu kế hoạch, đề cương, tổng hợp giám sát', 'Kế hoạch, đề cương, báo cáo tổng hợp', 'Cuộc giám sát', 1080, 4, 'IV'],
  ['CV.MAU.05.01', 'NV.MAU.05', 'MAU-LĐQL-01', 'Tiếp công dân theo lịch', 'Sổ tiếp công dân', 'Buổi', 240, 12, 'IV'],
  ['CV.MAU.05.02', 'NV.MAU.05', 'MAU-LĐQL-02', 'Chủ trì hội nghị tiếp xúc cử tri', 'Báo cáo tổng hợp ý kiến cử tri', 'Hội nghị', 360, 10, 'IV'],
  ['CV.MAU.05.03', 'NV.MAU.05', 'MAU-CMNV-01', 'Xử lý đơn thư, theo dõi trả lời kiến nghị', 'Phiếu chuyển, báo cáo theo dõi', 'Đơn thư', 90, 36, 'III'],
  ['CV.MAU.06.01', 'NV.MAU.06', 'MAU-LĐQL-03', 'Chủ trì thẩm tra nội dung trình kỳ họp', 'Báo cáo thẩm tra', 'Báo cáo', 960, 18, 'V'],
  ['CV.MAU.06.02', 'NV.MAU.06', 'MAU-CMNV-01', 'Dự thảo báo cáo thẩm tra', 'Dự thảo báo cáo thẩm tra', 'Báo cáo', 720, 18, 'IV'],
  // ⚠️ Dòng cố ý CHƯA CÓ SẢN LƯỢNG để người dùng thấy phần mềm soát lỗi thế nào
  ['CV.MAU.06.03', 'NV.MAU.06', 'MAU-LĐQL-02', 'Cho ý kiến dự thảo báo cáo thẩm tra', 'Ý kiến bằng văn bản', 'Báo cáo', 120, '', 'III'],
];

/** Tác động mẫu: [mã công việc, loại, công đoạn, SP áp dụng, phút trước, phút sau, giờ việc mới] */
const TAC_DONG = [
  ['CV.MAU.02.01', 'Số hóa', 'Ký chứng thực nghị quyết bằng chữ ký số thay ký tay', 42, 55, 37, ''],
  ['CV.MAU.02.02', 'Số hóa', 'Phát hành, công khai nghị quyết trên phần mềm thay bản giấy', 42, 180, 120, ''],
  ['CV.MAU.01.02', 'Cải tiến quy trình', 'Dùng mẫu điện tử dùng chung cho kịch bản kỳ họp', 8, 1080, 960, ''],
  ['CV.MAU.03.03', 'Số hóa', 'Phòng họp không giấy, biên bản trên phần mềm', 12, 300, 240, ''],
  ['CV.MAU.05.03', 'Cải tiến quy trình', 'Theo dõi đơn thư trên sổ điện tử dùng chung', 36, 90, 70, ''],
];

/** Nhân lực hiện có mẫu: [mã nguồn lực, mã VTVL, loại, giờ cho VTVL, giờ việc khác, nơi tính biên chế] */
const NHAN_LUC = [
  ['KN.MAU.001', 'MAU-LĐQL-01', 'Cán bộ', 420, 1484, 'Đảng ủy phường Mẫu (chức vụ kiêm nhiệm)'],
  ['NL.MAU.001', 'MAU-LĐQL-02', 'Cán bộ', 1904, 0, 'HĐND phường Mẫu (đại biểu hoạt động chuyên trách)'],
  ['KN.MAU.002', 'MAU-LĐQL-03', 'Cán bộ', 900, 1004, 'Đảng ủy phường Mẫu (chức vụ kiêm nhiệm)'],
  ['NL.MAU.002', 'MAU-CMNV-01', 'Công chức', 1904, 0, 'Văn phòng HĐND và UBND phường Mẫu'],
];

/** Người cần bố trí mẫu theo từng VTVL: [mã VTVL, phương pháp, người PP1, người cần bố trí] */
const NHU_CAU = [
  ['MAU-LĐQL-01', 'PP1+PP2', 1, 1],
  ['MAU-LĐQL-02', 'PP1+PP2', 1, 1],
  ['MAU-LĐQL-03', 'PP1+PP2', 1, 1],
  ['MAU-CMNV-01', 'PP2', '', 2],
];

const NAM = [2027, 2028, 2029, 2030, 2031];
let stt = 0;
const d = (o) => ({ _id: `m${++stt}`, ...o });
/** Mã sản phẩm trong danh mục, suy từ mã công việc: CV.MAU.01.01 → MAU.0101.L1 */
const maSP = (maCV) => `MAU.${maCV.split('.').slice(2).join('')}.L1`;

/**
 * Dựng bộ số mẫu.
 * @returns {object} bộ biểu đầy đủ, chạy được qua `tinhToan` không lỗi
 */
export function boSoMau() {
  stt = 0;
  const bieu = {
    A1: NHIEM_VU.map(([ma, ten]) => d({
      A: ma, B: ten, C: 'Chủ trì: HĐND phường Mẫu. Tham mưu: công chức tham mưu HĐND', D: 'Luật Tổ chức chính quyền địa phương số 72/2025/QH15 (số liệu mô phỏng)',
      E: KY, F: 'Tiếp tục thực hiện', G: NGUON,
    })),
    A2: CONG_VIEC.map(([ma, nv, vt, ten, sp, dvt]) => d({
      A: ma, B: nv, C: vt, D: ten, E: sp, F: dvt, G: 'Đúng thời hạn, đủ nội dung theo quy chế', H: NGUON,
    })),
    B1: CONG_VIEC.map(([ma, , , , , , phut, soSP]) => d({
      A: ma, B: '', C: soSP, D: phut, E: '',
      // Dòng cố ý thiếu SẢN LƯỢNG vẫn có đủ nguồn, để người dùng chỉ cần NHẬP MỘT SỐ
      // là dòng chuyển sang ĐẠT và cả chuỗi C3 → dự báo → D2 tự sạch theo.
      H: soSP === '' ? 'Chưa chốt số lượng trong kỳ — cần đơn vị điền (số liệu mô phỏng)'
        : `${soSP} sản phẩm trong kỳ (số liệu mô phỏng)`,
      I: `Định mức theo danh mục sản phẩm mẫu, mã ${maSP(ma)}: ${phut} phút/SP`,
      J: 'Có định mức', K: KY, L: maSP(ma), S: '',
    })),
    B2CT: TAC_DONG.map(([ma, loai, congDoan, sp, truoc, sau, moi]) => d({
      A: ma, C: loai, D: congDoan, E: sp, F: truoc, G: sau, I: moi,
      J: `${sp} sản phẩm trong kỳ; nhật ký hệ thống (số liệu mô phỏng)`,
      K: KY, L: 'Trước thay đổi, có điều chỉnh', M: 'Đã kiểm chứng',
      Q: '', R: '', S: 'Đã đối chiếu',
    })),
    C1: VTVL.map(([ma, ten, loai]) => d({
      A: ma, B: ten, C: loai, D: 'Hồ sơ VTVL (số liệu mô phỏng)',
      F: 'Mức chung 1.904 giờ/người/năm', G: 'Đề nghị bổ sung',
      H: '', I: '', J: 'Phổ biến (40 giờ/tuần)',
    })),
    C2: VTVL.map(([ma, ten]) => d({
      A: ma, B: `Trách nhiệm của ${ten} theo Luật 72/2025/QH15 (mô phỏng)`,
      C: 'Mức 3 — theo khung năng lực của Đề án VTVL', D: 'Mức 3', E: 'Mức 3',
      F: 'Hồ sơ VTVL (mô phỏng)', G: 'Bản mô tả công việc (mô phỏng)',
    })),
    C3: NHU_CAU.map(([ma, pp, pp1, can]) => d({
      A: ma, B: pp, H: pp1, I: '', J: can,
      K: `Số liệu mô phỏng: ${pp.includes('PP1') ? 'theo cơ cấu quy định' : 'theo giờ ròng quy đổi'}`,
      L: 'Đã kiểm chứng',
    })),
    D1: NHAN_LUC.map(([ma, vt, loai, gio, khac, noi]) => d({
      A: ma, B: vt, C: loai, E: gio, F: khac, G: noi, H: NGUON, I: 'Đã kiểm chứng', K: '',
    })),
    DU: VTVL.flatMap(([ma]) => NAM.map((n) => d({
      A: ma, B: n, C: 0, D: 'Không thay đổi so với năm cơ sở (mô phỏng)',
      E: `Số liệu mô phỏng, lập ${new Date().getFullYear()}`, F: 'Đã kiểm chứng', J: '',
    }))),
    D2: VTVL.flatMap(([ma]) => NAM.map((n) => d({
      A: ma, B: n, D: ma === 'MAU-CMNV-01' ? 2 : 1, E: '',
      F: ma.includes('LĐQL-01') || ma.includes('LĐQL-03') ? 'Kiêm nhiệm, không đề nghị biên chế riêng' : 'Giữ nguyên',
      G: 0, H: 'Số liệu mô phỏng, chưa thẩm định', I: 'Đã hoàn thành ở đơn vị', N: '',
    }))),
    DM: CONG_VIEC.map(([ma, , , , sp, dvt, phut, , nhom]) => d({
      A: maSP(ma), B: sp, C: 'Khối HĐND cấp xã (bộ số mẫu)', D: nhom, E: phut,
      F: 'Danh mục sản phẩm MẪU — không phải văn bản của cơ quan nào',
      G: 'Đã xác nhận', H: 'Bộ số mẫu của phần mềm', I: '', J: `Mã công việc ${ma}; đơn vị tính ${dvt}`,
    })),
    NGNL: [
      d({ A: 'HĐND phường Mẫu', B: 'HĐND phường bầu', C: 'Cán bộ', D: 2, E: 2, F: 'Nghị quyết bầu (mô phỏng)', G: NGUON, H: '—', I: KY, J: 'Đã kiểm chứng', K: '02 đại biểu chuyên trách (mô phỏng)' }),
      d({ A: 'Văn phòng HĐND và UBND phường Mẫu', B: 'UBND phường', C: 'Công chức', D: 2, E: 2, F: 'Danh mục VTVL công chức (mô phỏng)', G: NGUON, H: '—', I: KY, J: 'Đã kiểm chứng', K: '02 công chức tham mưu (mô phỏng)' }),
    ],
    B2: [],
  };
  return { donVi: 'HĐND phường Mẫu', ky: KY, vung: 'Vùng Đô thị', tenTep: '', laMau: true, bieu };
}

export const TEN_DON_VI_MAU = 'HĐND phường Mẫu';
