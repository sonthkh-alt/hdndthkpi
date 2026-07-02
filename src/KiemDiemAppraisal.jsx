// ============================================================================
// PHIÊN BẢN "KIỂM ĐIỂM" — Đánh giá định kỳ HẰNG QUÝ đối với cán bộ lãnh đạo,
// quản lý diện Ban Thường vụ Tỉnh ủy quản lý, theo HƯỚNG DẪN 03-HD/TU
// (02/7/2026) của Tỉnh ủy Thanh Hóa.
//
// Tách biệt hoàn toàn với các bản Cổ điển/Cải tiến/Singapore/SonHa.
// Thang 100 = Nhóm A (Tiêu chí chung, 30đ) + Nhóm B (Kết quả thực hiện nhiệm vụ, 70đ).
//   • Nhóm A: 3 nhóm, chấm NHỊ PHÂN (Đảm bảo = đủ điểm / Không đảm bảo = 0).
//   • Nhóm B: 6 TRỤC KẾT QUẢ TRỌNG TÂM; mỗi trục Điểm = KPI% × điểm tối đa,
//     KPI = (A + B + C + D)/4  (A số lượng · B chất lượng · C tiến độ · D năng lực lãnh đạo).
//   • Xếp loại 4 mức: HTXS / HTT / HT / KHT.
// Sản phẩm: (cá nhân) Bản tự đánh giá xếp loại quý — Phụ lục 3A; (tập thể) Bảng
// tổng hợp kết quả & đề xuất xếp loại quý — Phụ lục 4.
// ============================================================================
import { useState } from 'react';
import { Award, Target, ShieldCheck, ClipboardCheck, FileText, Printer, Plus, Trash2, TrendingUp, Users, ChevronDown, AlertTriangle } from 'lucide-react';

const clamp100 = (v, def = 100) => { const n = Number(v); return isFinite(n) ? Math.max(0, Math.min(100, n)) : def; };

// ---------- NHÓM A — TIÊU CHÍ CHUNG (30 điểm), chấm nhị phân ----------
export const KD_NHOMA = [
  {
    id: 'A1', title: '1. Về phẩm chất chính trị, đạo đức, lối sống, thực hiện trách nhiệm nêu gương', max: 10, items: [
      { id: '1.1', max: 1, text: 'Tuyệt đối trung thành với Đảng, Tổ quốc và Nhân dân; kiên định chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh; có bản lĩnh chính trị vững vàng; bảo vệ nền tảng tư tưởng, đường lối của Đảng, pháp luật của Nhà nước; đấu tranh phản bác quan điểm sai trái, biểu hiện suy thoái, "tự diễn biến", "tự chuyển hoá".' },
      { id: '1.2', max: 1, text: 'Có tinh thần yêu nước sâu sắc, tận tụy phục vụ Nhân dân, sâu sát cơ sở; đặt lợi ích của Đảng, quốc gia - dân tộc, Nhân dân, tập thể lên trên lợi ích cá nhân.' },
      { id: '1.3', max: 1, text: 'Chấp hành nghiêm chủ trương, đường lối, nghị quyết, chỉ thị, quy định, nguyên tắc, kỷ luật của Đảng, nhất là tập trung dân chủ, tự phê bình và phê bình; chấp hành pháp luật và quy định cơ quan; tuyệt đối chấp hành sự phân công của tổ chức.' },
      { id: '1.4', max: 1, text: 'Có tinh thần tự giác, trách nhiệm cao trong nghiên cứu, học tập chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh, các nghị quyết, chỉ thị của Đảng và cập nhật kiến thức mới, đáp ứng yêu cầu nhiệm vụ.' },
      { id: '1.5', max: 1.5, text: 'Có phẩm chất đạo đức, lối sống trong sáng, trung thực, khiêm tốn, giản dị; cần, kiệm, liêm, chính, chí công vô tư; thực hiện trách nhiệm nêu gương; không vi phạm những điều đảng viên không được làm; không né tránh công việc, chạy theo thành tích.' },
      { id: '1.6', max: 1.5, text: 'Không tham vọng quyền lực; không chạy chức, chạy quyền; không tham nhũng, lãng phí, cơ hội, vụ lợi, lợi ích nhóm; không để người thân lợi dụng chức vụ trục lợi; không suy thoái, "tự diễn biến", "tự chuyển hoá"; kiên quyết đấu tranh chống tiêu cực.' },
      { id: '1.7', max: 1, text: 'Có uy tín cao, tiêu biểu về phẩm chất đạo đức và phong cách công tác; là trung tâm đoàn kết, thương yêu đồng chí, đồng nghiệp.' },
      { id: '1.8', max: 1, text: 'Có tinh thần chủ động, đổi mới sáng tạo; phấn đấu vì mục tiêu phát triển của cơ quan, đơn vị, đóng góp vào mục tiêu chung của đất nước.' },
      { id: '1.9', max: 1, text: 'Thực hiện kê khai và công khai tài sản, thu nhập theo quy định; báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác, khách quan khi được yêu cầu.' },
    ],
  },
  {
    id: 'A2', title: '2. Tư duy đổi mới, chiến lược, khát vọng cống hiến, dám nghĩ, dám làm', max: 10, items: [
      { id: '2.1', max: 4, text: 'Có tư duy đổi mới, tầm nhìn chiến lược, khả năng lãnh đạo, chỉ đạo thích ứng với sự phát triển; phương pháp làm việc khoa học, nhạy bén chính trị; có năng lực cụ thể hoá để lãnh đạo, chỉ đạo cơ quan hoàn thành tốt chức năng, nhiệm vụ.' },
      { id: '2.2', max: 2, text: 'Luôn bám sát thực tiễn, có nhiều cách làm hay, sáng tạo, hiệu quả cao trong lãnh đạo, chỉ đạo, tổ chức thực hiện nhiệm vụ; xây dựng cấp uỷ, tổ chức đảng trong sạch, vững mạnh, cơ quan vững mạnh toàn diện.' },
      { id: '2.3', max: 2, text: 'Nói đi đôi với làm, dám nghĩ, dám làm, dám chịu trách nhiệm, dám đột phá vì lợi ích chung; có khả năng phân tích, dự báo, phát hiện khó khăn, thời cơ; đề xuất, quyết định giải pháp phù hợp, kịp thời, hiệu quả.' },
      { id: '2.4', max: 2, text: 'Có khát vọng phấn đấu, cống hiến; có khả năng quy tụ và phát huy sức mạnh của tập thể, cá nhân trong cơ quan và các cơ quan liên quan.' },
    ],
  },
  {
    id: 'A3', title: '3. Về tự phê bình và phê bình, tự soi, tự sửa, khắc phục hạn chế, khuyết điểm', max: 10, items: [
      { id: '3.1', max: 4, text: 'Chủ động, nghiêm túc thực hiện tự phê bình và phê bình, có tinh thần cầu thị và tiếp thu phản biện, góp ý.' },
      { id: '3.2', max: 2, text: 'Có kế hoạch rõ ràng và quyết liệt trong khắc phục hạn chế, khuyết điểm đã được chỉ ra.' },
      { id: '3.3', max: 2, text: 'Kết quả khắc phục hoàn thành ≥ 80% nội dung, có tiến bộ rõ, được tổ chức đánh giá tốt; không để tái diễn tồn tại.' },
      { id: '3.4', max: 2, text: 'Tự soi, tự sửa trên tinh thần trách nhiệm chính trị cao, không né tránh, không đổ lỗi.' },
    ],
  },
];

// ---------- NHÓM B — 6 TRỤC KẾT QUẢ TRỌNG TÂM (70 điểm) ----------
export const KD_TRUC = [
  { id: 't1', code: '1', max: 15, name: 'Thực hiện mục tiêu phát triển kinh tế - xã hội và nhiệm vụ chính trị được giao',
    indicators: ['Tốc độ tăng trưởng kinh tế GRDP', 'Thu ngân sách', 'Thu nhập bình quân đầu người', 'Tỉ lệ giải ngân vốn đầu tư công', 'Giảm tỉ lệ hộ nghèo', 'Mức độ hài lòng của người dân, doanh nghiệp', 'Hoàn thành nhiệm vụ chính trị được giao', 'Các nội dung khác (nếu có)'] },
  { id: 't2', code: '2', max: 10, name: 'Hoàn thiện thể chế, đẩy mạnh phân cấp, phân quyền gắn với kiểm tra, giám sát',
    indicators: ['Ban hành kế hoạch, chương trình hành động thực hiện các nghị quyết, chỉ thị, kết luận theo phân cấp', 'Triển khai, quán triệt chính sách phân cấp', 'Giám sát thực hiện phân quyền', 'Tỉ lệ hồ sơ giải quyết đúng hạn', 'Chỉ số cải cách hành chính (PAR Index)', 'Tổ chức tiếp dân định kỳ hằng tháng', 'Giải quyết 100% đơn, thư thuộc trách nhiệm, không để vượt cấp, kéo dài', 'Nội dung khác (nếu có)'] },
  { id: 't3', code: '3', max: 10, name: 'Thúc đẩy phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số',
    indicators: ['Triển khai chương trình, đề án chuyển đổi số', 'Ứng dụng khoa học công nghệ, đổi mới sáng tạo trong quản lý hành chính', 'Tỉ lệ dịch vụ công trực tuyến', 'Các nội dung khác (nếu có)'] },
  { id: 't4', code: '4', max: 15, name: 'Xây dựng Đảng và hệ thống chính trị trong sạch, vững mạnh; giữ gìn đoàn kết, thống nhất nội bộ; phòng, chống tham nhũng, lãng phí, tiêu cực',
    indicators: ['Xây dựng, củng cố tổ chức cơ sở đảng (thành lập mới, sắp xếp, kiện toàn các tổ chức đảng)', 'Tỷ lệ kết nạp đảng viên mới', 'Triển khai sinh hoạt, quán triệt định kỳ', 'Sắp xếp, tinh gọn tổ chức bộ máy, vận hành mô hình chính quyền hoạt động hiệu năng, hiệu lực, hiệu quả', 'Các nội dung khác (nếu có)'] },
  { id: 't5', code: '5', max: 10, name: 'Phát triển văn hóa, con người, bảo đảm an sinh xã hội, nâng cao đời sống Nhân dân',
    indicators: ['Triển khai các chương trình, đề án, phong trào phát triển văn hóa, xây dựng con người và hệ giá trị văn hóa, con người Việt Nam', 'Tỉ lệ trường đạt chuẩn quốc gia, phổ cập giáo dục', 'Tỉ lệ bao phủ bảo hiểm y tế, chất lượng chăm sóc sức khỏe Nhân dân', 'Tỉ lệ lao động qua đào tạo; số việc làm mới', 'Thực hiện chính sách người có công, bảo trợ xã hội, giảm nghèo bền vững', 'Xây dựng nông thôn mới; bảo tồn, phát huy giá trị di sản, bản sắc văn hóa dân tộc', 'Các nội dung khác (nếu có)'] },
  { id: 't6', code: '6', max: 10, name: 'Củng cố quốc phòng, an ninh, giữ vững ổn định chính trị - xã hội, nâng cao hiệu quả đối ngoại và hội nhập quốc tế',
    indicators: ['Xây dựng nền quốc phòng toàn dân, thế trận an ninh nhân dân vững chắc', 'Giữ vững an ninh chính trị, trật tự an toàn xã hội; không để hình thành "điểm nóng", bị động, bất ngờ', 'Hoàn thành chỉ tiêu tuyển quân, huấn luyện, diễn tập khu vực phòng thủ', 'Giảm tai nạn giao thông, tệ nạn xã hội; phòng, chống tội phạm, ma túy', 'Triển khai hiệu quả công tác đối ngoại, hợp tác quốc tế, thu hút đầu tư (FDI), xúc tiến thương mại, du lịch', 'Bảo đảm an ninh biên giới, an ninh kinh tế, an ninh mạng, an ninh tôn giáo, dân tộc', 'Các nội dung khác (nếu có)'] },
];
export const KD_TRUC_MAX = KD_TRUC.reduce((s, t) => s + t.max, 0); // = 70

// Mẫu DANH MỤC SẢN PHẨM/CÔNG VIỆC theo từng trục (đặc thù cơ quan Văn phòng Đoàn ĐBQH & HĐND tỉnh),
// dựng theo cấu trúc Phụ lục 3B: Nhiệm vụ · Cấp trình · Sản phẩm · Số lượng · Tiến độ · Hệ số quy đổi.
// heso = hệ số quy đổi theo độ khó, mới, phức tạp, phạm vi tác động (công việc chuẩn = 1; tờ trình/nghị quyết ≈ 1,5; khó, tác động lớn ≈ 2).
export const KD_TRUC_SAMPLE = {
  t1: [
    { name: 'Thẩm tra báo cáo tình hình KT-XH, dự toán/quyết toán thu chi ngân sách trình kỳ họp HĐND', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo thẩm tra', soluong: 1, tiendo: 'Theo kỳ họp', heso: 1.5 },
    { name: 'Giám sát tiến độ giải ngân vốn đầu tư công, các dự án trọng điểm', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo giám sát', soluong: 1, tiendo: 'Hằng quý', heso: 1.5 },
    { name: 'Theo dõi, đôn đốc thực hiện nghị quyết HĐND về phát triển KT-XH', captrinh: 'Lãnh đạo Ban', sanpham: 'Báo cáo', soluong: 1, tiendo: 'Hằng quý', heso: 1 },
  ],
  t2: [
    { name: 'Thẩm tra dự thảo nghị quyết trình kỳ họp HĐND theo lĩnh vực phụ trách', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo thẩm tra', soluong: 2, tiendo: 'Theo kỳ họp', heso: 1.5 },
    { name: 'Tổ chức giám sát chuyên đề theo chương trình, kế hoạch giám sát', captrinh: 'HĐND tỉnh', sanpham: 'Báo cáo giám sát chuyên đề', soluong: 1, tiendo: 'Theo kế hoạch', heso: 2 },
    { name: 'Tiếp công dân định kỳ, xử lý đơn thư khiếu nại, tố cáo, kiến nghị của cử tri', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo tiếp dân, xử lý đơn thư', soluong: 3, tiendo: 'Hằng tháng', heso: 1 },
  ],
  t3: [
    { name: 'Ứng dụng chuyển đổi số trong hoạt động HĐND (họp không giấy, phần mềm quản lý văn bản)', captrinh: 'Lãnh đạo Văn phòng', sanpham: 'Kế hoạch/Báo cáo', soluong: 1, tiendo: 'Hằng quý', heso: 1.2 },
    { name: 'Chỉ đạo số hóa, khai thác dữ liệu phục vụ giám sát, quyết định', captrinh: 'Lãnh đạo Ban', sanpham: 'Báo cáo', soluong: 1, tiendo: 'Hằng quý', heso: 1 },
  ],
  t4: [
    { name: 'Lãnh đạo, chỉ đạo sinh hoạt cấp ủy, chi bộ định kỳ; quán triệt nghị quyết, chỉ thị', captrinh: 'Đảng ủy/Chi bộ', sanpham: 'Biên bản/Báo cáo', soluong: 3, tiendo: 'Hằng tháng', heso: 1 },
    { name: 'Chỉ đạo sắp xếp, kiện toàn tổ chức bộ máy, biên chế theo phân cấp', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Đề án/Tờ trình', soluong: 1, tiendo: 'Theo yêu cầu', heso: 2 },
    { name: 'Triển khai công tác phòng, chống tham nhũng, lãng phí, tiêu cực, thực hành tiết kiệm', captrinh: 'Lãnh đạo Ban', sanpham: 'Báo cáo', soluong: 1, tiendo: 'Hằng quý', heso: 1.2 },
  ],
  t5: [
    { name: 'Giám sát thực hiện chính sách an sinh xã hội, giảm nghèo bền vững, người có công', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo giám sát', soluong: 1, tiendo: 'Hằng quý', heso: 1.5 },
    { name: 'Giám sát lĩnh vực giáo dục, y tế, văn hóa, bảo hiểm y tế', captrinh: 'Lãnh đạo Ban', sanpham: 'Báo cáo giám sát', soluong: 1, tiendo: 'Theo kế hoạch', heso: 1.2 },
  ],
  t6: [
    { name: 'Giám sát công tác quốc phòng, an ninh, trật tự an toàn xã hội, an toàn giao thông', captrinh: 'Thường trực HĐND tỉnh', sanpham: 'Báo cáo giám sát', soluong: 1, tiendo: 'Hằng quý', heso: 1.2 },
    { name: 'Tham gia hoạt động đối ngoại, hợp tác của HĐND/Đoàn ĐBQH tỉnh', captrinh: 'Đoàn ĐBQH tỉnh', sanpham: 'Báo cáo', soluong: 1, tiendo: 'Theo kế hoạch', heso: 1 },
  ],
};

// 4 chỉ số KPI của mỗi trục.
export const KD_KPI_KEYS = [
  { k: 'A', name: 'A · Số lượng', hint: 'Số lượng sản phẩm/công việc hoàn thành so với kế hoạch (%). Hoàn thành 100% kế hoạch → 100%.' },
  { k: 'B', name: 'B · Chất lượng', hint: 'Chất lượng sản phẩm đầu ra (%). Trừ khi sản phẩm phải điều chỉnh, bổ sung, sửa đổi nhiều lần, không đạt yêu cầu.' },
  { k: 'C', name: 'C · Tiến độ', hint: 'Tiến độ hoàn thành (%). Trừ khi chậm tiến độ so với thời hạn được giao.' },
  { k: 'D', name: 'D · Năng lực lãnh đạo, điều hành', hint: 'Năng lực lãnh đạo, chỉ đạo, điều hành, tổ chức thực hiện nhiệm vụ trong phạm vi phụ trách (%). Trừ khi lĩnh vực/bộ phận phụ trách bị xếp loại không hoàn thành.' },
];

// ---------- 4 mức xếp loại ----------
export const KD_GRADES = [
  { code: 'HTXS', name: 'Hoàn thành xuất sắc nhiệm vụ', min: 90, soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', cls: 'bg-emerald-600', ring: 'text-emerald-600', bar: 'bg-emerald-500' },
  { code: 'HTT', name: 'Hoàn thành tốt nhiệm vụ', min: 70, soft: 'bg-sky-50 text-sky-700 border-sky-200', cls: 'bg-sky-600', ring: 'text-sky-600', bar: 'bg-sky-500' },
  { code: 'HT', name: 'Hoàn thành nhiệm vụ', min: 50, soft: 'bg-amber-50 text-amber-700 border-amber-200', cls: 'bg-amber-500', ring: 'text-amber-600', bar: 'bg-amber-500' },
  { code: 'KHT', name: 'Không hoàn thành nhiệm vụ', min: 0, soft: 'bg-rose-50 text-rose-700 border-rose-200', cls: 'bg-rose-600', ring: 'text-rose-600', bar: 'bg-rose-500' },
];
export const kdGradeInfo = (code) => KD_GRADES.find((g) => g.code === code) || KD_GRADES[KD_GRADES.length - 1];
// Xếp loại theo Điều 13 QĐ 73-QĐ/TU (điều kiện định lượng), trả về mã mức + lý do.
function evalKDGrade(total, m) {
  const reasons = [];
  if (m.disciplined) { reasons.push('Bị kỷ luật (khiển trách trở lên) trong kỳ → xếp loại Không hoàn thành nhiệm vụ (Điều 13).'); return { code: 'KHT', reasons }; }
  if (m.failRate > 0.5) { reasons.push(`Trên 50% nhiệm vụ không hoàn thành (đạt dưới 50% số lượng) → Không hoàn thành nhiệm vụ (Điều 13).`); return { code: 'KHT', reasons }; }
  if (total < 50) { reasons.push('Tổng điểm dưới 50 → Không hoàn thành nhiệm vụ.'); return { code: 'KHT', reasons }; }
  if (total >= 90 && m.full && m.exceedRate >= 0.30) return { code: 'HTXS', reasons };
  if (total >= 90) { // đủ điểm nhưng chưa đủ điều kiện HTXS
    if (!m.full) reasons.push('Chưa hoàn thành 100% nhiệm vụ đúng hạn nên chưa đạt Hoàn thành xuất sắc.');
    else if (m.exceedRate < 0.30) reasons.push(`Chưa đạt ≥30% nhiệm vụ vượt mức (hiện ${Math.round(m.exceedRate * 100)}%) nên chưa đạt Hoàn thành xuất sắc (Điều 13).`);
    return { code: 'HTT', reasons };
  }
  if (total >= 70) return { code: 'HTT', reasons };
  return { code: 'HT', reasons };
}

// Đọc ĐIỂM 1 mục Nhóm A (chấm điểm số như các phiên bản khác): mgr kế thừa self,
// mặc định = điểm tối đa của mục (cán bộ mới mặc định đủ điểm, trừ dần khi chấm).
const has = (x) => x !== undefined && x !== null && x !== '';
const clampMax = (v, max) => Math.max(0, Math.min(max, Number(v) || 0));
const aVal = (kd, id, max, which) => {
  const src = (which === 'self' ? kd.aSelf : kd.aMgr) || {};
  if (has(src[id])) return clampMax(src[id], max);
  if (which === 'mgr') { const s = (kd.aSelf || {})[id]; return has(s) ? clampMax(s, max) : max; }
  return max;
};

// Tính KPI 1 trục theo Phụ lục 3B: nếu có danh mục sản phẩm → suy A/B/C/D từ hệ số quy đổi;
// nếu chưa lập danh mục → dùng A/B/C/D nhập tay (mặc định 100).
//   planQ = Σ(số lượng × hệ số);  A = Σ(HT × hệ số)/planQ;  B/C/D = Σ(HT × hệ số × tỷ lệ chất lượng/tiến độ/lãnh đạo)/planQ.
const num = (v, def = 0) => { const n = Number(v); return isFinite(n) ? n : def; };
const rate = (v) => (v === undefined || v === null || v === '' ? 1 : num(v, 100) / 100);
export function trucKPI(d) {
  const ps = ((d && d.products) || []).filter((p) => num(p.soluong, 0) > 0);
  if (ps.length) {
    let planQ = 0, aQ = 0, bQ = 0, cQ = 0, dQ = 0;
    ps.forEach((p) => {
      const heso = num(p.heso, 1) || 1, sl = num(p.soluong, 0);
      const ht = (p.htSL === undefined || p.htSL === null || p.htSL === '') ? sl : num(p.htSL, 0);
      planQ += sl * heso; aQ += ht * heso; bQ += ht * heso * rate(p.clRate); cQ += ht * heso * rate(p.tdRate); dQ += ht * heso * rate(p.ldRate);
    });
    if (planQ > 0) {
      const A = aQ / planQ * 100, B = bQ / planQ * 100, C = cQ / planQ * 100, D = dQ / planQ * 100;
      return { A, B, C, D, kpi: Math.min(100, (A + B + C + D) / 4), hasProducts: true };
    }
  }
  const A = clamp100(d?.A), B = clamp100(d?.B), C = clamp100(d?.C), D = clamp100(d?.D);
  return { A, B, C, D, kpi: (A + B + C + D) / 4, hasProducts: false };
}

// ---------- Tính điểm 1 cá nhân (đọc person.kd) ----------
export function computeKD(person) {
  const kd = (person && person.kd) || {};
  let nhomA = 0, nhomASelf = 0;
  KD_NHOMA.forEach((g) => g.items.forEach((it) => { nhomA += aVal(kd, it.id, it.max, 'mgr'); nhomASelf += aVal(kd, it.id, it.max, 'self'); }));
  nhomA = Math.min(30, nhomA); nhomASelf = Math.min(30, nhomASelf);
  const truc = kd.truc || {};
  const kpiByTruc = {}; let nhomB = 0;
  // Thống kê nhiệm vụ (từ danh mục sản phẩm) để áp điều kiện xếp loại Điều 13.
  let totalTasks = 0, exceedTasks = 0, failTasks = 0;
  KD_TRUC.forEach((t) => {
    const d = truc[t.id] || {};
    kpiByTruc[t.id] = trucKPI(d).kpi;
    nhomB += kpiByTruc[t.id] / 100 * t.max;
    (d.products || []).filter((p) => num(p.soluong, 0) > 0).forEach((p) => {
      totalTasks++;
      const sl = num(p.soluong, 0); const ht = (p.htSL === undefined || p.htSL === null || p.htSL === '') ? sl : num(p.htSL, 0);
      if (ht > sl || rate(p.clRate) > 1 || rate(p.tdRate) > 1) exceedTasks++;   // vượt mức
      if (sl > 0 && ht < 0.5 * sl) failTasks++;                                  // không hoàn thành (<50% số lượng)
    });
  });
  nhomB = Math.min(70, nhomB);
  const total = nhomA + nhomB;
  const totalSelf = nhomASelf + nhomB;
  const minKpi = Math.min(...KD_TRUC.map((t) => kpiByTruc[t.id]));
  const full = minKpi >= 100 && nhomA >= 30;                // hoàn thành 100% nhiệm vụ + đủ Nhóm A
  const under100 = minKpi < 100;                             // có nhiệm vụ hoàn thành dưới 100% (Điều 6.2)
  const exceedRate = totalTasks ? exceedTasks / totalTasks : 0;
  const failRate = totalTasks ? failTasks / totalTasks : 0;
  const disciplined = !!kd.disciplined;
  const g = evalKDGrade(total, { full, exceedRate, failRate, disciplined });
  const grade = kd.grade || g.code;                          // cấp có thẩm quyền có thể quyết định khác
  return {
    nhomA, nhomASelf, nhomB, kpiByTruc, total, totalMgr: total, totalSelf,
    minKpi, full, under100, exceedRate, failRate, disciplined,
    autoGrade: g.code, gradeReasons: g.reasons, grade, selfGrade: kd.selfGrade || '', has: true,
    exemptNote: kd.exemptNote || '',
  };
}

// ---------- Dữ liệu mẫu theo hồ sơ A/B/C/D ----------
export function defaultKD(profile) {
  const lv = { A: { a: 100, b: 98, c: 98, d: 96 }, B: { a: 96, b: 90, c: 88, d: 85 }, C: { a: 82, b: 76, c: 74, d: 72 }, D: { a: 64, b: 58, c: 55, d: 60 } }[profile] || { a: 92, b: 88, c: 86, d: 84 };
  const truc = {};
  KD_TRUC.forEach((t) => {
    const products = (KD_TRUC_SAMPLE[t.id] || []).map((s, k) => {
      const sl = num(s.soluong, 1); const jj = k % 2 === 0 ? 0 : -3; // biến thiên nhẹ giữa các sản phẩm
      return {
        id: `${t.id}s${k + 1}`, ...s,
        htSL: Math.max(0, Math.round(sl * lv.a / 100)),   // số lượng hoàn thành thực tế
        clRate: clamp100(lv.b + jj), tdRate: clamp100(lv.c), ldRate: clamp100(lv.d + jj), // % chất lượng/tiến độ/lãnh đạo
      };
    });
    truc[t.id] = { muctieu: '', ketqua: '', products };
  });
  // Chấm điểm số Nhóm A (mặc định = tối đa; hồ sơ thấp trừ điểm vài mục)
  const aMgr = {};
  if (profile === 'C') aMgr['3.3'] = 1;              // mục 3.3 (2đ) chỉ đạt 1
  if (profile === 'D') { aMgr['3.3'] = 0.5; aMgr['2.2'] = 1; aMgr['3.2'] = 1; aMgr['1.5'] = 1; }
  return {
    aSelf: {}, aMgr, truc, selfGrade: '', grade: '', disciplined: false,
    uudiem: profile === 'A' ? 'Gương mẫu về phẩm chất chính trị, đạo đức; chủ động, trách nhiệm; hoàn thành xuất sắc các nhiệm vụ trọng tâm được giao trong quý, có sản phẩm chất lượng, vượt tiến độ.' : 'Chấp hành tốt chủ trương, đường lối của Đảng, chính sách pháp luật; hoàn thành các nhiệm vụ được giao trong quý.',
    hanche: profile === 'C' || profile === 'D' ? 'Một số nhiệm vụ còn chậm tiến độ, chất lượng chưa cao; nguyên nhân do khối lượng công việc lớn, phối hợp chưa chặt chẽ.' : 'Đôi lúc chưa chủ động sắp xếp thời gian cho một số việc; nguyên nhân do phát sinh nhiệm vụ đột xuất.',
    phuonghuong: 'Tiếp tục nâng cao chất lượng, tiến độ sản phẩm; chủ động phối hợp; khắc phục các hạn chế đã nêu trong quý tới.',
    selfNote: profile === 'A' ? 'Cơ bản hoàn thành xuất sắc các nhiệm vụ trọng tâm được giao trong quý.' : 'Cơ bản hoàn thành nhiệm vụ được giao trong quý.',
    mgrNote: '', exemptNote: '',
  };
}

// ============================================================================
// PHIẾU ĐÁNH GIÁ (tab Đánh giá khi version = kiemdiem)
// ============================================================================
export function KiemDiemAppraisal({ person, c, selfEditable, mgrEditable, onPatch, onWord }) {
  const kd = person.kd || {};
  const gi = kdGradeInfo(c.grade);
  const setA = (which, id, val, max) => { const key = which === 'self' ? 'aSelf' : 'aMgr'; onPatch({ [key]: { ...(kd[key] || {}), [id]: clampMax(val, max) } }); };
  const setTruc = (id, patch) => onPatch({ truc: { ...(kd.truc || {}), [id]: { ...((kd.truc || {})[id] || {}), ...patch } } });
  const [openA, setOpenA] = useState(null);
  const [openProd, setOpenProd] = useState(null);
  const [openInd, setOpenInd] = useState(null);

  return (
    <div className="flex-1 space-y-5">
      {/* Tóm tắt điểm & xếp loại */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className={`${gi.cls} text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3`}>
          <div><p className="text-xs opacity-90 uppercase tracking-wider">Kết quả đánh giá quý</p><p className="text-2xl font-extrabold leading-tight mt-1">{gi.name}</p></div>
          <div className="text-right"><p className="text-xs opacity-90">Tổng điểm</p><p className="text-3xl font-extrabold">{c.total.toFixed(1)}<span className="text-sm">/100</span></p></div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
          <div className="py-3 px-2"><p className="text-[11px] text-slate-500">Nhóm A — Tiêu chí chung</p><p className="font-bold text-slate-800 text-lg">{c.nhomA.toFixed(1)}<span className="text-xs text-slate-400"> / 30</span></p></div>
          <div className="py-3 px-2"><p className="text-[11px] text-slate-500">Nhóm B — Kết quả nhiệm vụ</p><p className="font-bold text-slate-800 text-lg">{c.nhomB.toFixed(1)}<span className="text-xs text-slate-400"> / 70</span></p></div>
        </div>
        {c.under100 && (
          <div className="px-4 pb-3"><div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>Có trục nhiệm vụ hoàn thành <b>dưới 100%</b>. Theo HD 03 (Điểm 6.2), hoàn thành dưới 100% nhiệm vụ được giao trong quý thì xếp loại <b>Không hoàn thành nhiệm vụ</b>, trừ trường hợp khách quan, bất khả kháng được cấp có thẩm quyền xác nhận (ghi rõ ở ô "Lý do khách quan" bên dưới).</span></div></div>
        )}
      </section>

      {/* NHÓM A */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="w-5 h-5 text-amber-300" /> Nhóm A — Tiêu chí chung</h2><span className="text-amber-300 font-bold text-sm">{c.nhomA.toFixed(1)} / 30</span></div>
        <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-1"><span className="w-14 text-center">TỰ ĐG</span><span className="w-14 text-center text-red-600">CẤP DUYỆT</span></div>
        <div className="p-4 pt-2 space-y-4">
          {KD_NHOMA.map((g) => {
            const sub = g.items.reduce((s, it) => s + aVal(kd, it.id, it.max, 'mgr'), 0);
            return (
              <div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">{g.title}</p><span className="shrink-0 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{sub.toFixed(1)}/{g.max}</span></div>
                <div className="divide-y divide-slate-100">
                  {g.items.map((it) => { const sv = aVal(kd, it.id, it.max, 'self'), mv = aVal(kd, it.id, it.max, 'mgr'); const open = openA === it.id; return (
                    <div key={it.id} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 text-xs font-bold text-slate-400 w-8 pt-1.5">{it.id}</span>
                        <button onClick={() => setOpenA(open ? null : it.id)} className="flex-1 text-left text-sm text-slate-600 hover:text-slate-900 flex items-start gap-1 pt-1"><span className={open ? '' : 'line-clamp-2'}>{it.text}</span><ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
                        <span className="shrink-0 text-[10px] text-slate-400 pt-1.5">/{it.max}đ</span>
                        <div className="shrink-0 flex gap-2">
                          <input type="number" min="0" max={it.max} step="0.25" value={sv} disabled={!selfEditable} onChange={(e) => setA('self', it.id, e.target.value, it.max)} className="w-14 text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" />
                          <input type="number" min="0" max={it.max} step="0.25" value={mv} disabled={!mgrEditable} onChange={(e) => setA('mgr', it.id, e.target.value, it.max)} className="w-14 text-center font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg py-1 text-sm outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                      {open && <p className="mt-2 ml-11 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">Điểm tối đa: {it.max}đ. {it.text}</p>}
                    </div>
                  ); })}
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-slate-400">Chấm điểm theo thang điểm của từng mục (tối đa ghi bên phải), trừ dần khi chưa đạt. Cột <b>Cấp duyệt</b> mặc định kế thừa cột <b>Tự ĐG</b>; cán bộ mới mặc định đạt tối đa (đủ 30đ).</p>
        </div>
      </section>

      {/* NHÓM B — 6 TRỤC */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Nhóm B — Kết quả thực hiện nhiệm vụ (6 trục)</h2><span className="text-amber-300 font-bold text-sm">{c.nhomB.toFixed(2)} / 70</span></div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Mỗi trục: <b>Điểm = KPI% × điểm tối đa</b>, với <b>KPI = (A + B + C + D)/4</b> (A số lượng · B chất lượng · C tiến độ · D năng lực lãnh đạo). Lập <b>danh mục sản phẩm/công việc</b> theo trục (Phụ lục 3B): mỗi việc có <b>hệ số quy đổi</b> theo độ khó/phức tạp; A/B/C/D <b>tự tính</b> từ số lượng hoàn thành và chất lượng/tiến độ/lãnh đạo đã quy đổi. Cá nhân xác định trục giữ vai trò <b>chính</b> (tỷ trọng cao) và trục <b>phối hợp, hỗ trợ</b> (tỷ trọng thấp) theo chức năng, vị trí công tác.</p>
          {KD_TRUC.map((t) => { const d = (kd.truc || {})[t.id] || {}; const r = trucKPI(d); const diem = r.kpi / 100 * t.max; const products = d.products || []; const openP = openProd === t.id; const openI = openInd === t.id; return (
            <div key={t.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2.5 flex items-start gap-2">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-sm font-extrabold">{t.code}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-700 leading-snug">Trục {t.code} — {t.name}</p><button onClick={() => setOpenInd(openI ? null : t.id)} className="text-[11px] text-indigo-600 hover:text-indigo-800 mt-0.5 flex items-center gap-1"><ChevronDown className={`w-3 h-3 transition-transform ${openI ? 'rotate-180' : ''}`} /> Chỉ tiêu, nội dung của trục (Phụ lục 1A)</button></div>
                <div className="shrink-0 text-right"><span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{diem.toFixed(2)}/{t.max}</span><p className="text-[10px] text-slate-500 mt-0.5">KPI {r.kpi.toFixed(0)}%</p></div>
              </div>
              {openI && <ul className="px-4 py-2 bg-indigo-50/50 border-t border-indigo-100 list-disc pl-8 text-[11px] text-slate-600 space-y-0.5">{t.indicators.map((x, k) => <li key={k}>{x}</li>)}</ul>}
              <div className="p-3 space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                  <textarea value={d.muctieu || ''} disabled={!selfEditable && !mgrEditable} onChange={(e) => setTruc(t.id, { muctieu: e.target.value })} rows={2} placeholder="Mục tiêu, nhiệm vụ đề ra trong quý..." className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-red-400 disabled:bg-slate-50" />
                  <textarea value={d.ketqua || ''} disabled={!selfEditable && !mgrEditable} onChange={(e) => setTruc(t.id, { ketqua: e.target.value })} rows={2} placeholder="Kết quả sản phẩm thực tế..." className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-red-400 disabled:bg-slate-50" />
                </div>
                {r.hasProducts ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[['A · Số lượng', r.A], ['B · Chất lượng', r.B], ['C · Tiến độ', r.C], ['D · Năng lực LĐ', r.D]].map(([lb, v]) => (
                      <div key={lb} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center"><p className="text-[9px] text-slate-500 leading-tight">{lb}</p><p className="text-sm font-bold text-slate-700">{v.toFixed(0)}%</p></div>
                    ))}
                    <p className="col-span-2 sm:col-span-4 text-[10px] text-slate-400">A/B/C/D tự tính từ danh mục sản phẩm bên dưới (theo hệ số quy đổi). Sửa số liệu trong danh mục để cập nhật.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {KD_KPI_KEYS.map((kk) => (
                      <label key={kk.k} className="block" title={kk.hint}><span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">{kk.name} <span className="text-slate-300">ⓘ</span></span>
                        <div className="mt-0.5 flex items-center gap-1"><input type="number" min="0" max="100" value={d[kk.k] ?? 100} disabled={!selfEditable && !mgrEditable} onChange={(e) => setTruc(t.id, { [kk.k]: e.target.value })} className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white text-center font-semibold outline-none focus:border-red-400 disabled:bg-slate-50" /><span className="text-[10px] text-slate-400">%</span></div>
                      </label>
                    ))}
                  </div>
                )}
                <button onClick={() => setOpenProd(openP ? null : t.id)} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><ChevronDown className={`w-3.5 h-3.5 transition-transform ${openP ? 'rotate-180' : ''}`} /> Danh mục sản phẩm/công việc của trục ({products.length})</button>
                {openP && <ProductList products={products} editable={selfEditable || mgrEditable} onChange={(ps) => setTruc(t.id, { products: ps })} />}
              </div>
            </div>
          ); })}
        </div>
      </section>

      {/* BẢN TỰ KIỂM ĐIỂM (tự luận — Mẫu 2A/07 QĐ 73) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-amber-300" /><h2 className="font-bold">Bản tự kiểm điểm</h2></div>
        <div className="p-4 space-y-3">
          <p className="text-[11px] text-slate-400">Phần tự luận theo Mẫu 2A/07 (QĐ 73-QĐ/TU): tự đánh giá khái quát kết quả, ưu điểm, hạn chế, nguyên nhân và phương hướng khắc phục trong quý.</p>
          <label className="block"><span className="text-xs font-semibold text-emerald-700 mb-1 block">1. Ưu điểm, kết quả nổi bật</span><textarea value={kd.uudiem || ''} disabled={!selfEditable} onChange={(e) => onPatch({ uudiem: e.target.value })} rows={3} className="kdta" placeholder="Nêu kết quả, sản phẩm nổi bật; tinh thần trách nhiệm, đổi mới; đóng góp cho tập thể..." /></label>
          <label className="block"><span className="text-xs font-semibold text-rose-700 mb-1 block">2. Hạn chế, khuyết điểm và nguyên nhân</span><textarea value={kd.hanche || ''} disabled={!selfEditable} onChange={(e) => onPatch({ hanche: e.target.value })} rows={3} className="kdta" placeholder="Nêu hạn chế, khuyết điểm (nếu có) và nguyên nhân chủ quan, khách quan..." /></label>
          <label className="block"><span className="text-xs font-semibold text-indigo-700 mb-1 block">3. Phương hướng, biện pháp khắc phục kỳ tới</span><textarea value={kd.phuonghuong || ''} disabled={!selfEditable} onChange={(e) => onPatch({ phuonghuong: e.target.value })} rows={2} className="kdta" placeholder="Biện pháp, cam kết khắc phục hạn chế; mục tiêu quý tới..." /></label>
        </div>
      </section>

      {/* XẾP LOẠI */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-amber-300" /><h2 className="font-bold">Đề xuất & quyết định xếp loại</h2></div>
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-500">Đề xuất theo điểm & điều kiện (Điều 13):</span>
            <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${kdGradeInfo(c.autoGrade).soft}`}>{kdGradeInfo(c.autoGrade).name}</span>
            <span className="text-[11px] text-slate-400">Vượt mức {Math.round((c.exceedRate || 0) * 100)}% · Không HT {Math.round((c.failRate || 0) * 100)}%</span>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 w-fit">
            <input type="checkbox" checked={!!kd.disciplined} disabled={!mgrEditable} onChange={(e) => onPatch({ disciplined: e.target.checked })} className="w-4 h-4 accent-rose-600" />
            <span>Bị <b>kỷ luật</b> (khiển trách trở lên) hoặc suy thoái trong kỳ — ép xếp loại <b>Không hoàn thành nhiệm vụ</b> (Điều 13).</span>
          </label>
          {c.gradeReasons && c.gradeReasons.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 space-y-1">{c.gradeReasons.map((r, i) => <p key={i} className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{r}</p>)}</div>
          )}
          <label className="flex flex-col gap-1 max-w-md"><span className="text-xs font-semibold text-slate-500">Cá nhân TỰ đề xuất xếp loại</span>
            <select value={kd.selfGrade || ''} disabled={!selfEditable} onChange={(e) => onPatch({ selfGrade: e.target.value })} className="text-sm p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-red-400 disabled:bg-slate-50"><option value="">— Chọn mức tự đề xuất —</option>{KD_GRADES.map((g) => <option key={g.code} value={g.code}>{g.name}</option>)}</select>
          </label>
          <label className="flex flex-col gap-1 max-w-md"><span className="text-xs font-semibold text-slate-500">Cấp có thẩm quyền QUYẾT ĐỊNH xếp loại</span>
            <select value={kd.grade || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ grade: e.target.value })} className="text-sm p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-red-400 disabled:bg-slate-50"><option value="">(Theo đề xuất: {kdGradeInfo(c.autoGrade).name})</option>{KD_GRADES.map((g) => <option key={g.code} value={g.code}>{g.name}</option>)}</select>
          </label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">Lý do khách quan, bất khả kháng (nếu hoàn thành dưới 100% nhiệm vụ)</span><textarea value={kd.exemptNote || ''} disabled={!selfEditable && !mgrEditable} onChange={(e) => onPatch({ exemptNote: e.target.value })} rows={2} className="kdta" placeholder="Nêu lý do cụ thể được cấp có thẩm quyền xác nhận..." /></label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">Cá nhân tự nhận xét, đánh giá kết quả thực hiện nhiệm vụ</span><textarea value={kd.selfNote || ''} disabled={!selfEditable} onChange={(e) => onPatch({ selfNote: e.target.value })} rows={2} className="kdta" /></label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">Nhận xét, đánh giá của cấp có thẩm quyền</span><textarea value={kd.mgrNote || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ mgrNote: e.target.value })} rows={2} className="kdta" /></label>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-2">
        <button onClick={onWord} className="flex-1 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất bản tự đánh giá (Word) — Phụ lục 3A</button>
        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In phiếu (PDF)</button>
      </div>
      <style>{`.kdta{width:100%;border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.5rem 0.625rem;font-size:0.8125rem;color:#334155;outline:none}.kdta:focus{border-color:#f87171}.kdta:disabled{background:#f8fafc;color:#64748b}`}</style>
    </div>
  );
}

// Ô nhập nhỏ có nhãn (dùng trong danh mục sản phẩm).
function PF({ label, hint, children }) { return (<label className="block" title={hint}><span className="text-[9px] text-slate-400 block leading-tight">{label}</span>{children}</label>); }
const pinp = 'mt-0.5 w-full text-[11px] p-1 border border-slate-200 rounded bg-white outline-none focus:border-red-400 disabled:bg-slate-50';

// Danh mục SẢN PHẨM/CÔNG VIỆC của 1 trục (Phụ lục 3B): kế hoạch (số lượng × hệ số quy đổi) và thực tế
// (số lượng hoàn thành + % chất lượng/tiến độ/năng lực lãnh đạo) → tự suy A/B/C/D của trục.
function ProductList({ products, editable, onChange }) {
  const up = (id, patch) => onChange(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const add = () => onChange([...products, { id: 'p_' + (products.reduce((m, p) => Math.max(m, +String(p.id).replace(/\D/g, '') || 0), 0) + 1), name: '', captrinh: '', sanpham: 'Báo cáo', soluong: 1, tiendo: '', heso: 1, htSL: 1, clRate: 100, tdRate: 100, ldRate: 100 }]);
  const del = (id) => onChange(products.filter((p) => p.id !== id));
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 space-y-2">
      {products.length === 0 && <p className="text-[11px] text-slate-400 italic px-1">Chưa có sản phẩm/công việc. Thêm để làm căn cứ tự tính A/B/C/D (hệ số quy đổi theo độ khó, phức tạp, phạm vi tác động — công việc chuẩn = 1).</p>}
      {products.map((p) => { const heso = num(p.heso, 1) || 1, sl = num(p.soluong, 0); const ht = (p.htSL === undefined || p.htSL === '') ? sl : num(p.htSL, 0); const short = ht < sl; return (
        <div key={p.id} className="bg-white rounded-md border border-slate-200 p-2 space-y-1.5">
          <div className="flex items-start gap-1.5">
            <input value={p.name || ''} disabled={!editable} onChange={(e) => up(p.id, { name: e.target.value })} placeholder="Nhiệm vụ theo quý" className="flex-1 text-[11px] font-medium p-1 border border-slate-200 rounded outline-none focus:border-red-400 disabled:bg-slate-50" />
            <span className="shrink-0 text-[9px] text-slate-400 pt-1">SL quy đổi KH: <b className="text-slate-600">{(sl * heso).toFixed(1)}</b></span>
            {editable && <button onClick={() => del(p.id)} className="shrink-0 text-rose-400 hover:bg-rose-100 p-0.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <PF label="Cấp trình"><input value={p.captrinh || ''} disabled={!editable} onChange={(e) => up(p.id, { captrinh: e.target.value })} className={pinp} /></PF>
            <PF label="Sản phẩm"><input value={p.sanpham || ''} disabled={!editable} onChange={(e) => up(p.id, { sanpham: e.target.value })} className={pinp} /></PF>
            <PF label="Tiến độ"><input value={p.tiendo || ''} disabled={!editable} onChange={(e) => up(p.id, { tiendo: e.target.value })} className={pinp} /></PF>
            <PF label="Hệ số quy đổi" hint="Theo độ khó, mới, phức tạp, phạm vi tác động. Công việc chuẩn = 1; tờ trình/nghị quyết ≈ 1,5; khó, tác động lớn ≈ 2."><input type="number" min="0" step="0.1" value={p.heso ?? 1} disabled={!editable} onChange={(e) => up(p.id, { heso: e.target.value })} className={`${pinp} text-center font-semibold`} /></PF>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded p-1.5 ${short ? 'bg-amber-50' : 'bg-slate-50'}`}>
            <PF label="SL giao (định mức)"><input type="number" min="0" value={p.soluong ?? 1} disabled={!editable} onChange={(e) => up(p.id, { soluong: e.target.value })} className={`${pinp} text-center`} /></PF>
            <PF label="SL hoàn thành" hint="Số lượng thực tế đã hoàn thành, nghiệm thu."><input type="number" min="0" value={p.htSL ?? p.soluong ?? 0} disabled={!editable} onChange={(e) => up(p.id, { htSL: e.target.value })} className={`${pinp} text-center font-semibold ${short ? 'text-amber-700' : ''}`} /></PF>
            <PF label="Chất lượng %" hint="100% = đạt yêu cầu; giảm khi phải điều chỉnh, sửa đổi nhiều lần; >100% nếu chất lượng nổi trội."><input type="number" min="0" value={p.clRate ?? 100} disabled={!editable} onChange={(e) => up(p.id, { clRate: e.target.value })} className={`${pinp} text-center`} /></PF>
            <PF label="Tiến độ %" hint="100% = đúng hạn; giảm khi chậm tiến độ; >100% nếu hoàn thành sớm, vượt tiến độ."><input type="number" min="0" value={p.tdRate ?? 100} disabled={!editable} onChange={(e) => up(p.id, { tdRate: e.target.value })} className={`${pinp} text-center`} /></PF>
            <PF label="Năng lực lãnh đạo %" hint="100% = tốt; giảm nếu lĩnh vực/bộ phận phụ trách bị xếp loại không hoàn thành."><input type="number" min="0" value={p.ldRate ?? 100} disabled={!editable} onChange={(e) => up(p.id, { ldRate: e.target.value })} className={`${pinp} text-center`} /></PF>
            {short && <p className="col-span-2 sm:col-span-4 text-[10px] text-amber-700">Hoàn thành {ht}/{sl} — chưa đạt định mức số lượng.</p>}
          </div>
        </div>
      ); })}
      {editable && <button onClick={add} className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-slate-300 rounded-md text-[11px] font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-3.5 h-3.5" /> Thêm sản phẩm/công việc</button>}
    </div>
  );
}

// ============================================================================
// DASHBOARD (tab Tổng quan khi version = kiemdiem) — gồm Bảng tổng hợp (Phụ lục 4)
// ============================================================================
export function KiemDiemDashboard({ computed, onPick, onExportAgg, quarterLabel }) {
  const n = computed.length;
  const dist = { HTXS: 0, HTT: 0, HT: 0, KHT: 0 };
  computed.forEach(({ c }) => { dist[c.grade] = (dist[c.grade] || 0) + 1; });
  const ranked = [...computed].sort((a, b) => b.c.total - a.c.total);
  const byDept = {};
  computed.forEach(({ p, c }) => { const d = p.department || '(Chưa có phòng)'; (byDept[d] = byDept[d] || []).push(c.total); });
  const depts = Object.entries(byDept).map(([dept, arr]) => ({ dept, count: arr.length, avg: arr.reduce((a, b) => a + b, 0) / arr.length })).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-800"><TrendingUp className="w-5 h-5 text-red-700" /> Phân bố xếp loại {quarterLabel ? `— ${quarterLabel}` : ''}</h2>
          {onExportAgg && <button onClick={onExportAgg} className="flex items-center gap-2 px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg"><FileText className="w-3.5 h-3.5" /> Xuất Bảng tổng hợp (Phụ lục 4)</button>}
        </div>
        {dist.HTXS > Math.floor((dist.HTT || 0) * 0.2) && (
          <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-[12px] text-rose-800 flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>Cảnh báo trần tỷ lệ (Điều 13 QĐ 73): đang có <b>{dist.HTXS}</b> "Hoàn thành xuất sắc" trong khi tối đa cho phép là <b>{Math.floor((dist.HTT || 0) * 0.2)}</b> (không quá 20% của {dist.HTT} người "Hoàn thành tốt"; đơn vị có thành tích nổi trội tối đa 25%).</span></div>
        )}
        <div className="space-y-3">
          {KD_GRADES.map((g) => { const cnt = dist[g.code] || 0; const pct = n ? cnt / n * 100 : 0; return (
            <div key={g.code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">{g.name}</span><span className="font-bold text-slate-700">{cnt}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${g.bar} transition-all`} style={{ width: `${pct}%` }} /></div></div>
          ); })}
        </div>
        <p className="text-[11px] text-slate-400 mt-3">Đối tượng: cán bộ diện Ban Thường vụ Tỉnh ủy quản lý tại cơ quan. Kết quả đánh giá hằng quý được tích lũy làm căn cứ xếp loại cuối năm; tập thể hoàn thành dưới 70% nhiệm vụ → người đứng đầu Không hoàn thành nhiệm vụ (HD 03).</p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Award className="w-5 h-5 text-amber-300" /> Bảng tổng hợp kết quả & đề xuất xếp loại quý (Phụ lục 4)</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">#</th><th className="text-left px-3 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Chức vụ</th><th className="text-center px-3 py-2.5 font-semibold">Nhóm A</th><th className="text-center px-3 py-2.5 font-semibold">Nhóm B</th><th className="text-center px-3 py-2.5 font-semibold">Tổng</th><th className="text-left px-3 py-2.5 font-semibold">Đề xuất xếp loại</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map(({ p, c }, idx) => { const gi = kdGradeInfo(c.grade); return (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onPick && onPick(p.id)}>
                  <td className="px-4 py-3 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{p.name || '(Chưa tên)'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{p.position || '—'}</td>
                  <td className="px-3 py-3 text-center text-slate-600">{c.nhomA.toFixed(1)}</td>
                  <td className="px-3 py-3 text-center text-slate-600">{c.nhomB.toFixed(1)}</td>
                  <td className="px-3 py-3 text-center font-bold text-slate-800">{c.total.toFixed(1)}</td>
                  <td className="px-3 py-3"><span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-bold ${gi.soft}`}>{gi.name}</span></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Users className="w-5 h-5 text-amber-300" /> Điểm trung bình theo Phòng/Bộ phận</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Phòng/Bộ phận</th><th className="text-center px-3 py-2.5 font-semibold">Số CB</th><th className="text-center px-3 py-2.5 font-semibold">Điểm TB</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {depts.map((d) => (<tr key={d.dept} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-700">{d.dept}</td><td className="px-3 py-3 text-center text-slate-500">{d.count}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{d.avg.toFixed(1)}</td></tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
