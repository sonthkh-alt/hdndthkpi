// ===== BẢN PRO — Tính điểm ĐÚNG theo Nghị định 335/2025/NĐ-CP + Sổ tay Bộ Nội vụ =====
// Cơ chế (Điều 14, 15, 16 NĐ335; Chương VI Sổ tay):
//  - Danh mục công việc theo PHÒNG/VỊ TRÍ, mỗi việc phân 1 trong 5 nhóm cấp độ phức tạp
//    N1..N5 (khung điểm tối đa 100/200/300/400/500). Đơn vị sản phẩm CHUẨN = 5 điểm (hệ số 1).
//  - Hệ số quy đổi = điểm của việc / điểm sản phẩm chuẩn (ẩn khi chấm, chỉ giải thích ở Hướng dẫn).
//  - Chấm đếm khách quan theo tháng/quý, cả 3 thành phần chia cho SỐ LƯỢNG GIAO (đã quy đổi):
//      a (số lượng)  = Σ(HT×hệ số) / Σ(Giao×hệ số)
//      b (chất lượng)= Σ(HT×hệ số×(1−0,25×số lần lỗi)) / Σ(Giao×hệ số)
//      c (tiến độ)   = Σ(HT×hệ số×(1−0,25×số lần/ngày chậm)) / Σ(Giao×hệ số)
//  - Cán bộ: Điểm KQ = (a+b+c)/3. Lãnh đạo, quản lý: (a+b+c+d+đ+e)/6
//      d = kết quả lĩnh vực phụ trách (100% nếu 100% CC dưới quyền ≥50đ; 50% nếu có CC <50đ)
//      đ = khả năng tổ chức triển khai (100% / 50%)
//      e = năng lực tập hợp, đoàn kết (100% / 50%)
//  - Nhóm II = Điểm KQ(%) × 70 (trong thang 100). Tổng = Nhóm I (≤30) + Nhóm II − Điểm trừ.
import { CRITERIA, clamp } from '../App.jsx';

// 5 nhóm cấp độ phức tạp + khung điểm tối đa (Sổ tay Chương II)
export const PRO_GROUPS = [
  { id: 'N1', label: 'Nhóm 1 — Đơn giản, lặp lại, bổ trợ/phục vụ', max: 100 },
  { id: 'N2', label: 'Nhóm 2 — Chuyên môn nghiệp vụ thường xuyên', max: 200 },
  { id: 'N3', label: 'Nhóm 3 — Nghiên cứu, báo cáo chuyên đề', max: 300 },
  { id: 'N4', label: 'Nhóm 4 — Xây dựng VBQPPL, đề án, thẩm tra', max: 400 },
  { id: 'N5', label: 'Nhóm 5 — Chiến lược, tầm tỉnh/quốc gia', max: 500 },
];
export const PRO_CHUAN = { name: 'Soạn thảo văn bản hành chính', diem: 5 }; // hệ số 1

// item: { id, name, sp (sản phẩm đầu ra), nhom, heso }   (heso = điểm/5)
const COMMON = [
  { id: 'c1', name: 'Soạn thảo văn bản hành chính', sp: 'Văn bản', nhom: 'N1', heso: 1 },
  { id: 'c2', name: 'Phát hành, lưu trữ văn bản, hồ sơ', sp: 'Lượt', nhom: 'N1', heso: 0.8 },
  { id: 'c3', name: 'Báo cáo định kỳ/đột xuất theo yêu cầu', sp: 'Báo cáo', nhom: 'N2', heso: 8 },
  { id: 'c4', name: 'Tham mưu, soạn thảo văn bản chuyên môn', sp: 'Văn bản', nhom: 'N3', heso: 16 },
];

const BAN = [
  { id: 'b1', name: 'Thẩm tra dự thảo nghị quyết, tờ trình, báo cáo của UBND tỉnh', sp: 'Báo cáo thẩm tra', nhom: 'N4', heso: 76 },
  { id: 'b2', name: 'Tổ chức giám sát, khảo sát chuyên đề của Ban', sp: 'Báo cáo giám sát', nhom: 'N4', heso: 76 },
  { id: 'b3', name: 'Báo cáo kết quả giám sát, kiến nghị', sp: 'Báo cáo', nhom: 'N3', heso: 50 },
  { id: 'b4', name: 'Tham mưu nội dung phục vụ kỳ họp, phiên họp', sp: 'Tài liệu', nhom: 'N3', heso: 36 },
  { id: 'b5', name: 'Tổng hợp ý kiến thẩm tra, góp ý', sp: 'Bản tổng hợp', nhom: 'N2', heso: 6 },
];

const WORK_CATALOG_PRO = {
  'HĐND tỉnh': [
    { id: 'hd1', name: 'Chỉ đạo, điều hòa hoạt động HĐND và các Ban', sp: 'Văn bản chỉ đạo', nhom: 'N5', heso: 90 },
    { id: 'hd2', name: 'Chỉ đạo nội dung, chương trình kỳ họp; chất lượng nghị quyết', sp: 'Tài liệu kỳ họp', nhom: 'N4', heso: 80 },
    { id: 'hd3', name: 'Chỉ đạo giải quyết vấn đề phát sinh giữa hai kỳ họp', sp: 'Kết luận', nhom: 'N4', heso: 76 },
  ],
  'Đoàn ĐBQH tỉnh': [
    { id: 'dq1', name: 'Chỉ đạo, tham gia xây dựng pháp luật', sp: 'Văn bản góp ý dự án luật', nhom: 'N4', heso: 80 },
    { id: 'dq2', name: 'Điều hành giám sát chuyên đề của Đoàn tại địa phương', sp: 'Báo cáo giám sát', nhom: 'N4', heso: 76 },
    { id: 'dq3', name: 'Tổng hợp, theo dõi giải quyết kiến nghị cử tri', sp: 'Báo cáo tổng hợp', nhom: 'N3', heso: 50 },
  ],
  'Ban Kinh tế - Ngân sách': BAN,
  'Ban Văn hóa - Xã hội': BAN,
  'Ban Pháp chế': BAN,
  'Ban Dân tộc': BAN,
  'Văn phòng': [
    { id: 'vp1', name: 'Quản trị, điều hành chung bộ máy giúp việc', sp: 'Báo cáo điều hành', nhom: 'N4', heso: 76 },
    { id: 'vp2', name: 'Tham mưu, tổng hợp phục vụ lãnh đạo Đoàn ĐBQH, Thường trực, các Ban', sp: 'Báo cáo', nhom: 'N3', heso: 50 },
    { id: 'vp3', name: 'Chỉ đạo số hóa, phòng họp không giấy, vận hành hệ thống OKR/KPI', sp: 'Báo cáo', nhom: 'N3', heso: 36 },
  ],
  'Phòng Công tác Hội đồng': [
    { id: 'pch1', name: 'Tham mưu, chuẩn bị nội dung, tài liệu kỳ họp HĐND', sp: 'Tài liệu kỳ họp', nhom: 'N4', heso: 56 },
    { id: 'pch2', name: 'Dự thảo nghị quyết, báo cáo của HĐND/Thường trực', sp: 'Dự thảo', nhom: 'N4', heso: 76 },
    { id: 'pch3', name: 'Theo dõi, đôn đốc thực hiện nghị quyết, kết luận giám sát', sp: 'Báo cáo', nhom: 'N3', heso: 36 },
    { id: 'pch4', name: 'Tổng hợp báo cáo công tác của HĐND', sp: 'Báo cáo tổng hợp', nhom: 'N3', heso: 50 },
    { id: 'pch5', name: 'Ghi biên bản, hoàn thiện hồ sơ kỳ họp, phiên họp', sp: 'Biên bản', nhom: 'N2', heso: 10 },
  ],
  'Phòng Công tác Quốc hội': [
    { id: 'pcq1', name: 'Tham mưu phục vụ hoạt động xây dựng pháp luật của Đoàn', sp: 'Văn bản góp ý', nhom: 'N4', heso: 76 },
    { id: 'pcq2', name: 'Phục vụ giám sát, khảo sát chuyên đề của Đoàn ĐBQH', sp: 'Báo cáo giám sát', nhom: 'N4', heso: 76 },
    { id: 'pcq3', name: 'Tổng hợp, theo dõi kiến nghị cử tri', sp: 'Báo cáo tổng hợp', nhom: 'N3', heso: 50 },
    { id: 'pcq4', name: 'Tham mưu xử lý đơn thư, trả lời kiến nghị', sp: 'Văn bản', nhom: 'N3', heso: 16 },
    { id: 'pcq5', name: 'Phục vụ tiếp xúc cử tri', sp: 'Báo cáo TXCT', nhom: 'N2', heso: 8 },
  ],
  'Phòng Tổng hợp - Thông tin - Dân nguyện': [
    { id: 'pth1', name: 'Báo cáo tổng hợp tình hình, kết quả công tác', sp: 'Báo cáo tổng hợp', nhom: 'N3', heso: 50 },
    { id: 'pth2', name: 'Tham mưu xử lý đơn thư, công tác dân nguyện', sp: 'Văn bản', nhom: 'N3', heso: 16 },
    { id: 'pth3', name: 'Theo dõi, tổng hợp trả lời kiến nghị cử tri', sp: 'Báo cáo', nhom: 'N3', heso: 36 },
    { id: 'pth4', name: 'Tiếp công dân, tổng hợp phản ánh, kiến nghị', sp: 'Báo cáo', nhom: 'N2', heso: 8 },
    { id: 'pth5', name: 'Biên tập bản tin, thông tin tuyên truyền', sp: 'Bản tin', nhom: 'N2', heso: 6 },
  ],
  'Phòng Hành chính - Tổ chức - Quản trị': [
    { id: 'phc1', name: 'Soạn thảo văn bản hành chính', sp: 'Văn bản', nhom: 'N1', heso: 1 },
    { id: 'phc2', name: 'Phát hành, quản lý văn bản đi/đến, lưu trữ', sp: 'Lượt', nhom: 'N1', heso: 0.8 },
    { id: 'phc3', name: 'Hậu cần phục vụ hội nghị, cuộc họp', sp: 'Cuộc họp', nhom: 'N1', heso: 1.6 },
    { id: 'phc4', name: 'Lập dự toán, quyết toán ngân sách', sp: 'KH dự toán', nhom: 'N2', heso: 20 },
    { id: 'phc5', name: 'Công tác tổ chức cán bộ, văn thư, quản trị', sp: 'Hồ sơ', nhom: 'N2', heso: 8 },
  ],
};

// Danh mục áp dụng cho 1 cán bộ = danh mục của Phòng/Bộ phận + danh mục dùng chung
export function getProCatalog(dept) {
  return [...(WORK_CATALOG_PRO[dept] || []), ...COMMON];
}
// Tra hệ số quy đổi theo id (id chỉ cần duy nhất trong phạm vi 1 cán bộ = dept + common)
export function proHeso(dept, catalogId) {
  const it = getProCatalog(dept).find((x) => x.id === catalogId);
  return it ? (Number(it.heso) || 1) : 1;
}

let tid = 1;
// Nhiệm vụ Pro: mặc định giao 1 / hoàn thành 1 / 0 lỗi / 0 chậm -> đạt 100 (đánh giá trừ dần)
export const newProTask = () => ({ id: tid++, catalogId: '', objId: '', assigned: 1, completed: 1, qualityIssues: 0, delays: 0, note: '' });
export const bumpProIds = (people) => {
  const ids = (people || []).flatMap((p) => (p.proTasks || []).map((t) => t.id || 0));
  tid = Math.max(tid, 0, ...ids) + 1;
};

// Lãnh đạo, quản lý -> 6 thành phần
export const isLeaderType = (type) => type === 'leader' || type === 'hdnd';

// Chỉ số "đạt" của 1 nhiệm vụ (để hiển thị màu): SL × CL × TĐ rút gọn
export const proTaskPct = (t) => {
  const as = Number(t.assigned) || 0; if (as <= 0) return 100;
  const cp = Math.min(as, Number(t.completed) || 0);
  const sl = (cp / as) * 100;
  const cl = sl * Math.max(0, 1 - 0.25 * (Number(t.qualityIssues) || 0));
  const td = sl * Math.max(0, 1 - 0.25 * (Number(t.delays) || 0));
  return (sl + cl + td) / 3;
};

export function computePro(p) {
  // Nhóm I — Tiêu chí chung (≤30), DÙNG CHUNG (selfScores/mgrScores theo CRITERIA)
  let nself = 0, nmgr = 0;
  CRITERIA[p.type].groups.forEach((g) => g.items.forEach((it) => {
    const sv = p.selfScores[it.id] ?? it.max;
    nself += sv; nmgr += (p.mgrScores[it.id] ?? sv);
  }));
  nself = Math.min(nself, 30); nmgr = Math.min(nmgr, 30);

  // Nhóm II — đếm khách quan theo hệ số quy đổi. Chưa nhập nhiệm vụ -> mặc định 100 (cán bộ mới 100/100)
  const dept = p.department || '';
  const tasks = (p.proTasks || []).filter((t) => t.catalogId);
  let TG = 0, TC = 0, TQ = 0, TD = 0;
  tasks.forEach((t) => {
    const w = proHeso(dept, t.catalogId);
    const as = Number(t.assigned) || 0;
    const cp = Math.min(as, Number(t.completed) || 0);
    const qi = Number(t.qualityIssues) || 0;
    const dl = Number(t.delays) || 0;
    TG += as * w;
    TC += cp * w;
    TQ += cp * w * Math.max(0, 1 - 0.25 * qi);
    TD += cp * w * Math.max(0, 1 - 0.25 * dl);
  });
  let a = 100, b = 100, c = 100;
  if (TG > 0) {
    a = Math.min(100, (TC / TG) * 100);
    b = Math.min(100, (TQ / TG) * 100); // chia cho GIAO theo Điều 14 NĐ335
    c = Math.min(100, (TD / TG) * 100);
  }
  const leader = isLeaderType(p.type);
  const ls = p.leadScores || {};
  const d = ls.d ?? 100, dd = ls.dd ?? 100, e = ls.e ?? 100; // mỗi thành phần 100% hoặc 50%
  const val = leader ? (a + b + c + Number(d) + Number(dd) + Number(e)) / 6 : (a + b + c) / 3;
  const nhomII = (val / 100) * 70;
  const ded = Number(p.deduction || 0);

  return {
    nself, nmgr, k: { a, b, c, val }, nhomII, leader,
    totalSelf: clamp(nself + nhomII - ded), totalMgr: clamp(nmgr + nhomII - ded),
  };
}
