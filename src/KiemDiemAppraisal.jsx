// ============================================================================
// PHIÊN BẢN "KIỂM ĐIỂM" — Đánh giá định kỳ HẰNG QUÝ đối với cán bộ lãnh đạo,
// quản lý diện Ban Thường vụ Tỉnh ủy quản lý, theo HƯỚNG DẪN 03-HD/TU
// (02/7/2026) của Ban Thường vụ Tỉnh ủy Thanh Hóa.
//
// Dựng theo ĐÚNG hai biểu mẫu giấy đang dùng tại cơ quan:
//   ① "KẾ HOẠCH sản phẩm/công việc và kết quả cần đạt được của cá nhân — Quý …"
//      (đầu kỳ) — cá nhân đăng ký nhiệm vụ theo 6 trục và ĐỀ XUẤT điểm tối đa của
//      từng trục (tổng 70), trình tập thể lãnh đạo phê duyệt.
//   ② "BẢN TỰ ĐÁNH GIÁ, XẾP LOẠI CỦA CÁ NHÂN — Quý …" (cuối kỳ) — ghi kết quả sản
//      phẩm thực tế và Điểm KPI (%) cho từng trục NGAY TRÊN kế hoạch đã duyệt.
//
// Thang 100 = Nhóm A (Tiêu chí chung, 30đ) + Nhóm B (Kết quả nhiệm vụ, 70đ).
//   • Nhóm A: 3 nhóm × 10đ, chấm NHỊ PHÂN — "Đảm bảo" = đủ điểm tối đa của mục,
//     "Không đảm bảo" = 0 điểm (đúng 2 cột đánh dấu (x) của biểu mẫu).
//   • Nhóm B: 6 trục; mỗi trục Điểm đạt = Điểm KPI (%) × Điểm tối đa của trục.
//     ⚠️ ĐIỂM TỐI ĐA TỪNG TRỤC KHÔNG CỐ ĐỊNH — do cá nhân đề xuất theo thứ tự ưu
//     tiên công việc, tổng 6 trục = 70. Mỗi trục còn ghi rõ là "trục chính, chủ yếu"
//     hay "trục phụ, phối hợp, hỗ trợ"; cả hai đều thay đổi theo từng quý.
//   • Xếp loại 4 mức: HTXS / HTT / HT / KHT (điều kiện định lượng — Điều 13 QĐ 73).
// Sản phẩm xuất ra: Kế hoạch quý · Bản tự đánh giá cá nhân (Phụ lục 3A) · Bảng
// tổng hợp kết quả và đề xuất xếp loại quý của tập thể (Phụ lục 4).
// ============================================================================
import { useState } from 'react';
import { Award, Target, ShieldCheck, ClipboardCheck, FileText, Printer, Plus, Trash2, TrendingUp, Users, ChevronDown, AlertTriangle, CheckCircle2, RotateCcw, CalendarClock, Sparkles, Scale } from 'lucide-react';
import { KD_TRUC_IDS, KD_TONG_B, KD_VAITRO, vaiTroOf, mauKeHoach, mauKeyFor, tenMau, canDeuVe70 } from './lib/kiemDiemMau';

export { KD_VAITRO, vaiTroOf, mauKeyFor, KD_TONG_B };

// ---------- NHÓM A — TIÊU CHÍ CHUNG (30 điểm), chấm NHỊ PHÂN ----------
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

// ---------- NHÓM B — 6 TRỤC KẾT QUẢ TRỌNG TÂM (tổng 70 điểm) ----------
// `maxDefault` CHỈ là giá trị dự phòng cho hồ sơ chưa lập kế hoạch; điểm tối đa
// thật của từng trục nằm ở person.kd.trucCfg (do cá nhân đề xuất, lãnh đạo duyệt).
export const KD_TRUC = [
  { id: 't1', code: '1', maxDefault: 15, name: 'Thực hiện mục tiêu phát triển kinh tế - xã hội và nhiệm vụ chính trị được giao',
    indicators: ['Tốc độ tăng trưởng kinh tế GRDP', 'Thu ngân sách', 'Thu nhập bình quân đầu người', 'Tỉ lệ giải ngân vốn đầu tư công', 'Giảm tỉ lệ hộ nghèo', 'Mức độ hài lòng của người dân, doanh nghiệp', 'Hoàn thành nhiệm vụ chính trị được giao', 'Các nội dung khác (nếu có)'] },
  { id: 't2', code: '2', maxDefault: 10, name: 'Hoàn thiện thể chế, đẩy mạnh phân cấp, phân quyền gắn với kiểm tra, giám sát',
    indicators: ['Ban hành kế hoạch, chương trình hành động thực hiện các nghị quyết, chỉ thị, kết luận theo phân cấp', 'Triển khai, quán triệt chính sách phân cấp', 'Giám sát thực hiện phân quyền', 'Tỉ lệ hồ sơ giải quyết đúng hạn', 'Chỉ số cải cách hành chính (PAR Index)', 'Tổ chức tiếp dân định kỳ hằng tháng', 'Giải quyết 100% đơn, thư thuộc trách nhiệm, không để vượt cấp, kéo dài', 'Nội dung khác (nếu có)'] },
  { id: 't3', code: '3', maxDefault: 10, name: 'Thúc đẩy phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số',
    indicators: ['Triển khai chương trình, đề án chuyển đổi số', 'Ứng dụng khoa học công nghệ, đổi mới sáng tạo trong quản lý hành chính', 'Tỉ lệ dịch vụ công trực tuyến', 'Các nội dung khác (nếu có)'] },
  { id: 't4', code: '4', maxDefault: 15, name: 'Xây dựng Đảng và hệ thống chính trị trong sạch, vững mạnh; giữ gìn đoàn kết, thống nhất nội bộ; phòng, chống tham nhũng, lãng phí, tiêu cực',
    indicators: ['Xây dựng, củng cố tổ chức cơ sở đảng (thành lập mới, sắp xếp, kiện toàn các tổ chức đảng)', 'Tỷ lệ kết nạp đảng viên mới', 'Triển khai sinh hoạt, quán triệt định kỳ', 'Sắp xếp, tinh gọn tổ chức bộ máy, vận hành mô hình chính quyền hoạt động hiệu năng, hiệu lực, hiệu quả', 'Các nội dung khác (nếu có)'] },
  { id: 't5', code: '5', maxDefault: 10, name: 'Phát triển văn hóa, con người, bảo đảm an sinh xã hội, nâng cao đời sống và hạnh phúc cho Nhân dân',
    indicators: ['Triển khai các chương trình, đề án, phong trào phát triển văn hóa, xây dựng con người và hệ giá trị văn hóa, con người Việt Nam', 'Tỉ lệ trường đạt chuẩn quốc gia, phổ cập giáo dục', 'Tỉ lệ bao phủ bảo hiểm y tế, chất lượng chăm sóc sức khỏe Nhân dân', 'Tỉ lệ lao động qua đào tạo; số việc làm mới', 'Thực hiện chính sách người có công, bảo trợ xã hội, giảm nghèo bền vững', 'Xây dựng nông thôn mới; bảo tồn, phát huy giá trị di sản, bản sắc văn hóa dân tộc', 'Các nội dung khác (nếu có)'] },
  { id: 't6', code: '6', maxDefault: 10, name: 'Củng cố quốc phòng, an ninh, giữ vững ổn định chính trị - xã hội, nâng cao hiệu quả đối ngoại và hội nhập quốc tế',
    indicators: ['Xây dựng nền quốc phòng toàn dân, thế trận an ninh nhân dân vững chắc', 'Giữ vững an ninh chính trị, trật tự an toàn xã hội; không để hình thành "điểm nóng", bị động, bất ngờ', 'Hoàn thành chỉ tiêu tuyển quân, huấn luyện, diễn tập khu vực phòng thủ', 'Giảm tai nạn giao thông, tệ nạn xã hội; phòng, chống tội phạm, ma túy', 'Triển khai hiệu quả công tác đối ngoại, hợp tác quốc tế, thu hút đầu tư (FDI), xúc tiến thương mại, du lịch', 'Bảo đảm an ninh biên giới, an ninh kinh tế, an ninh mạng, an ninh tôn giáo, dân tộc', 'Các nội dung khác (nếu có)'] },
];
export const KD_TRUC_MAX = KD_TONG_B; // = 70

// ---------- Mức độ hoàn thành của từng nhiệm vụ ----------
// KPI của trục = trung bình có trọng số (%) các nhiệm vụ đã chấm. Mức độ gói gọn cả
// số lượng · chất lượng · tiến độ · năng lực điều hành vào một lựa chọn dễ hiểu.
export const KD_MUC = [
  { k: 'xuatsac', rank: 4, pct: 100, exceed: true, label: 'Hoàn thành xuất sắc, vượt yêu cầu', short: 'Xuất sắc (vượt mức)', tone: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { k: 'tot', rank: 3, pct: 90, label: 'Hoàn thành tốt, đạt yêu cầu, đúng hạn', short: 'Hoàn thành tốt', tone: 'bg-sky-50 text-sky-700 border-sky-300' },
  { k: 'dat', rank: 2, pct: 75, label: 'Cơ bản hoàn thành (còn thiếu sót nhỏ hoặc hơi chậm)', short: 'Cơ bản hoàn thành', tone: 'bg-teal-50 text-teal-700 border-teal-300' },
  { k: 'chua', rank: 1, pct: 55, label: 'Chưa hoàn thành, còn hạn chế', short: 'Chưa hoàn thành', tone: 'bg-amber-50 text-amber-700 border-amber-300' },
  { k: 'khong', rank: 0, pct: 30, fail: true, label: 'Không hoàn thành', short: 'Không hoàn thành', tone: 'bg-rose-50 text-rose-700 border-rose-300' },
];
export const KD_MUC_DEFAULT = 'tot';
export const mucOf = (k) => KD_MUC.find((m) => m.k === k) || KD_MUC[1];

// Tầm quan trọng → trọng số khi tính KPI của trục.
export const KD_TAM = [
  { k: 'thuong', heso: 1, label: 'Thường xuyên', short: 'Thường xuyên' },
  { k: 'quantrong', heso: 1.5, label: 'Quan trọng', short: 'Quan trọng' },
  { k: 'trongtam', heso: 2, label: 'Trọng tâm, khó, phạm vi rộng', short: 'Trọng tâm' },
];
export const KD_TAM_DEFAULT = 'quantrong';
export const tamOf = (k) => KD_TAM.find((x) => x.k === k) || KD_TAM[0];

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
  if (m.failRate > 0.5) { reasons.push('Trên 50% nhiệm vụ không hoàn thành → Không hoàn thành nhiệm vụ (Điều 13).'); return { code: 'KHT', reasons }; }
  if (total < 50) { reasons.push('Tổng điểm dưới 50 → Không hoàn thành nhiệm vụ.'); return { code: 'KHT', reasons }; }
  if (total >= 90 && m.full && m.exceedRate >= 0.30) return { code: 'HTXS', reasons };
  if (total >= 90) {
    if (!m.full) reasons.push('Chưa hoàn thành 100% nhiệm vụ đúng hạn nên chưa đạt Hoàn thành xuất sắc.');
    else if (m.exceedRate < 0.30) reasons.push(`Chưa đạt ≥30% nhiệm vụ vượt mức (hiện ${Math.round(m.exceedRate * 100)}%) nên chưa đạt Hoàn thành xuất sắc (Điều 13).`);
    return { code: 'HTT', reasons };
  }
  if (total >= 70) return { code: 'HTT', reasons };
  return { code: 'HT', reasons };
}

const has = (x) => x !== undefined && x !== null && x !== '';
const num = (v, def = 0) => { const n = Number(v); return isFinite(n) ? n : def; };
const clamp01 = (v) => Math.max(0, Math.min(100, num(v, 0)));

// ---------- NHÓM A: chấm NHỊ PHÂN ----------
// Giá trị lưu là 0 (Không đảm bảo) hoặc điểm tối đa của mục (Đảm bảo) — giữ kiểu SỐ để
// tương thích với dữ liệu đã lưu trước đây. Chưa chấm → mặc định ĐẢM BẢO (đủ điểm),
// cột Cấp duyệt kế thừa cột Tự ĐG.
export function aDamBao(kd, id, which) {
  const src = (which === 'self' ? kd.aSelf : kd.aMgr) || {};
  if (has(src[id])) return num(src[id], 0) > 0;
  if (which === 'mgr') { const s = (kd.aSelf || {})[id]; return has(s) ? num(s, 0) > 0 : true; }
  return true;
}
const aVal = (kd, id, max, which) => (aDamBao(kd, id, which) ? max : 0);

// ---------- NHÓM B: cấu hình trục của từng cá nhân ----------
export function trucCfgOf(kd, id) {
  const cfg = ((kd || {}).trucCfg || {})[id] || {};
  const def = KD_TRUC.find((t) => t.id === id);
  const max = Number(cfg.max);
  return {
    max: isFinite(max) && max >= 0 ? max : (def ? def.maxDefault : 0),
    vaiTro: cfg.vaiTro === 'chinh' ? 'chinh' : 'phu',
  };
}
export const tongMaxTruc = (kd) => KD_TRUC.reduce((s, t) => s + trucCfgOf(kd, t.id).max, 0);

// Danh sách nhiệm vụ của 1 trục. TƯƠNG THÍCH dữ liệu cũ: bản lưu chỉ có `products`
// (danh mục 3B kiểu cũ) được quy đổi sang nhiệm vụ đơn giản.
export function trucTasks(d) {
  if (d && Array.isArray(d.tasks)) return d.tasks;
  if (d && Array.isArray(d.products)) return d.products.map((p) => {
    const sl = num(p.soluong, 0), ht = has(p.htSL) ? num(p.htSL, 0) : sl;
    const r = sl > 0 ? ht / sl : 1;
    const muc = (ht > sl || num(p.clRate, 100) > 100 || num(p.tdRate, 100) > 100) ? 'xuatsac'
      : r >= 1 ? 'tot' : r >= 0.75 ? 'dat' : r >= 0.5 ? 'chua' : 'khong';
    const heso = num(p.heso, 1);
    return { id: p.id, name: p.name, ketQuaCanDat: p.sanpham || '', thoiGian: p.tiendo || '', ketQuaThucTe: '', muc, tam: heso >= 2 ? 'trongtam' : heso >= 1.5 ? 'quantrong' : 'thuong' };
  });
  return [];
}

// KPI TỰ TÍNH của 1 trục = trung bình có trọng số (%) các nhiệm vụ ĐÃ CHẤM mức độ.
// Chưa chấm nhiệm vụ nào (mới lập kế hoạch) → 100% để không trừ oan điểm đầu kỳ.
export function trucKPI(d) {
  const all = trucTasks(d);
  const ts = all.filter((t) => t && t.muc);
  if (!ts.length) return { kpi: 100, count: 0, planned: all.length, exceed: 0, fail: 0, full: true, hasTasks: false };
  let w = 0, wp = 0, exceed = 0, fail = 0, full = true;
  ts.forEach((t) => { const m = mucOf(t.muc), h = tamOf(t.tam).heso; w += h; wp += m.pct * h; if (m.exceed) exceed++; if (m.fail) fail++; if (m.rank < 3) full = false; });
  return { kpi: w ? Math.min(100, wp / w) : 100, count: ts.length, planned: all.length, exceed, fail, full, hasTasks: true };
}

// KPI CHÍNH THỨC của trục: cấp có thẩm quyền được điều chỉnh (kd.kpi[tX]); bỏ trống
// thì dùng KPI tự tính. Biểu mẫu giấy ghi một con số KPI cho cả trục nên phải cho sửa.
export function kpiCuaTruc(kd, id) {
  const auto = trucKPI(((kd || {}).truc || {})[id] || {}).kpi;
  const ov = ((kd || {}).kpi || {})[id];
  return { auto, kpi: has(ov) ? clamp01(ov) : auto, daSua: has(ov) };
}

// ---------- Tính điểm 1 cá nhân (đọc person.kd) ----------
export function computeKD(person) {
  const kd = (person && person.kd) || {};
  let nhomA = 0, nhomASelf = 0;
  KD_NHOMA.forEach((g) => g.items.forEach((it) => { nhomA += aVal(kd, it.id, it.max, 'mgr'); nhomASelf += aVal(kd, it.id, it.max, 'self'); }));
  nhomA = Math.min(30, nhomA); nhomASelf = Math.min(30, nhomASelf);

  const truc = kd.truc || {};
  const kpiByTruc = {}, maxByTruc = {}, diemByTruc = {};
  let nhomB = 0, totalTasks = 0, exceedTasks = 0, failTasks = 0, chuaCham = 0, allFull = true;
  KD_TRUC.forEach((t) => {
    const d = truc[t.id] || {};
    const r = trucKPI(d);
    const { kpi } = kpiCuaTruc(kd, t.id);
    const max = trucCfgOf(kd, t.id).max;
    kpiByTruc[t.id] = kpi; maxByTruc[t.id] = max; diemByTruc[t.id] = kpi / 100 * max;
    nhomB += diemByTruc[t.id];
    totalTasks += r.count; exceedTasks += r.exceed; failTasks += r.fail;
    chuaCham += Math.max(0, r.planned - r.count);
    if (!r.full) allFull = false;
  });
  nhomB = Math.min(KD_TONG_B, nhomB);

  const total = nhomA + nhomB;
  const totalSelf = nhomASelf + nhomB;
  const minKpi = Math.min(...KD_TRUC.map((t) => kpiByTruc[t.id]));
  const full = allFull && nhomA >= 30;
  const under100 = !allFull;
  const exceedRate = totalTasks ? exceedTasks / totalTasks : 0;
  const failRate = totalTasks ? failTasks / totalTasks : 0;
  const disciplined = !!kd.disciplined;
  const g = evalKDGrade(total, { full, exceedRate, failRate, disciplined });
  const grade = kd.grade || g.code;
  const tongMax = tongMaxTruc(kd);
  return {
    nhomA, nhomASelf, nhomB, kpiByTruc, maxByTruc, diemByTruc, total, totalMgr: total, totalSelf,
    minKpi, full, under100, exceedRate, failRate, disciplined,
    totalTasks, exceedTasks, failTasks, chuaCham, tongMax, keHoachHopLe: Math.abs(tongMax - KD_TONG_B) < 1e-9,
    autoGrade: g.code, gradeReasons: g.reasons, grade, selfGrade: kd.selfGrade || '', has: true,
    exemptNote: kd.exemptNote || '',
  };
}

// Bảng chi tiết Nhóm A (điểm CẤP DUYỆT từng mục) để xuất phiếu Phụ lục 3A.
export function kdNhomABreakdown(kd) {
  kd = kd || {};
  return KD_NHOMA.map((g) => ({
    id: g.id, title: g.title, max: g.max,
    sub: g.items.reduce((s, it) => s + aVal(kd, it.id, it.max, 'mgr'), 0),
    items: g.items.map((it) => ({ id: it.id, text: it.text, max: it.max, diem: aVal(kd, it.id, it.max, 'mgr'), damBao: aDamBao(kd, it.id, 'mgr') })),
  }));
}

// Câu "Kết quả chung" của mục I — soạn tự động từ số liệu đã chấm, đúng giọng văn bản.
export function tomTatKetQua(kd, c) {
  const tong = KD_TRUC.reduce((s, t) => s + trucTasks((kd.truc || {})[t.id] || {}).length, 0);
  const daCham = c.totalTasks || 0;
  const vuot = c.exceedTasks || 0, hong = c.failTasks || 0;
  if (!tong) return 'Chưa đăng ký nhiệm vụ trong kế hoạch quý.';
  const pct = tong ? Math.round((daCham - hong) / tong * 100) : 0;
  let s = `Hoàn thành ${Math.max(0, daCham - hong)}/${tong} nhiệm vụ theo kế hoạch được phê duyệt, đạt ${pct}%`;
  s += vuot ? `; trong đó ${vuot}/${tong} nhiệm vụ (${Math.round(vuot / tong * 100)}%) hoàn thành vượt mức yêu cầu.` : ', bảo đảm tiến độ, chất lượng.';
  if (hong) s += ` Còn ${hong} nhiệm vụ chưa hoàn thành trong quý.`;
  return s;
}

// ---------- Dữ liệu mẫu theo hồ sơ (A/B/C/D) + MẪU THEO CHỨC DANH ----------
const KQ_THEO_MUC = {
  xuatsac: 'Hoàn thành 100%, vượt mức yêu cầu: sản phẩm hoàn thành trước thời hạn, được cấp có thẩm quyền đánh giá cao.',
  tot: 'Hoàn thành 100%, đúng tiến độ, bảo đảm chất lượng theo kết quả cần đạt đã đăng ký.',
  dat: 'Cơ bản hoàn thành; một số nội dung phải chỉnh sửa, bổ sung trước khi trình ký ban hành.',
  chua: 'Chưa hoàn thành trong quý, đang tiếp tục thực hiện và chuyển sang quý sau.',
  khong: 'Không hoàn thành trong quý.',
};
export function defaultKD(profile, mauKey = 'pho_vp_hdnd') {
  const mucPlan = {
    A: ['xuatsac', 'tot', 'xuatsac', 'tot', 'tot', 'xuatsac'],
    B: ['tot', 'tot', 'tot', 'dat', 'tot'],
    C: ['dat', 'tot', 'dat', 'chua', 'tot'],
    D: ['chua', 'khong', 'dat', 'chua', 'khong'],
  }[profile] || ['tot'];
  const { trucCfg, truc } = mauKeHoach(mauKey, { mucPlan, ketQua: (t) => KQ_THEO_MUC[t.muc] || '' });
  // Nhóm A chấm nhị phân: mặc định ĐẢM BẢO; hồ sơ thấp bị đánh dấu không đảm bảo vài mục.
  const aMgr = {};
  if (profile === 'C') aMgr['3.3'] = 0;
  if (profile === 'D') { aMgr['3.3'] = 0; aMgr['2.2'] = 0; aMgr['3.2'] = 0; }
  const kd = {
    mauKD: mauKey, aSelf: {}, aMgr, trucCfg, truc, kpi: {},
    selfGrade: '', grade: '', disciplined: false, planApproved: false,
    ngaySinh: '', chucVuDang: 'Đảng viên, sinh hoạt tại Chi bộ trực thuộc Đảng ủy HĐND tỉnh', chucVuDoanThe: '',
    ketQuaChung: '',
    noiBat: profile === 'A'
      ? 'Chủ động, trách nhiệm cao; nhiều sản phẩm hoàn thành trước thời hạn, chất lượng tốt, được cấp có thẩm quyền ghi nhận; gương mẫu về phẩm chất chính trị, đạo đức, lối sống.'
      : 'Chấp hành tốt chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước; hoàn thành các nhiệm vụ trọng tâm được giao trong quý, bảo đảm tiến độ.',
    hanche: profile === 'C' || profile === 'D'
      ? 'Một số nhiệm vụ còn chậm tiến độ, chất lượng sản phẩm chưa cao; nguyên nhân do khối lượng công việc lớn, phát sinh nhiều nhiệm vụ đột xuất và phối hợp giữa các bộ phận chưa chặt chẽ.'
      : 'Một số dự thảo văn bản, đề án phải chỉnh sửa nhiều lần trước khi trình do nội dung mới, phức tạp, liên quan nhiều cơ quan; thời gian yêu cầu giải quyết nhanh.',
    phuonghuong: 'Xây dựng kế hoạch quý tiếp theo chi tiết, bám sát chương trình kỳ họp và tiến độ các đoàn giám sát; phân công rõ đầu mối, thời hạn từng sản phẩm; hoàn thiện quy trình thẩm định hồ sơ trước khi trình.',
    selfNote: '', mgrNote: '', mgrThenChot: '', exemptNote: '',
  };
  kd.ketQuaChung = tomTatKetQua(kd, computeKD({ kd }));
  return kd;
}

// ============================================================================
// PHIẾU ĐÁNH GIÁ (tab Đánh giá khi version = kiemdiem)
// ============================================================================
const TA = 'w-full border border-slate-200 rounded-xl px-2.5 py-2 text-[13px] text-slate-700 outline-none focus:border-red-400 disabled:bg-slate-50 disabled:text-slate-500';

export function KiemDiemAppraisal({ person, c, selfEditable, mgrEditable, onPatch, onWord, onWordKeHoach, approval, quarterLabel }) {
  const kd = person.kd || {};
  const gi = kdGradeInfo(c.grade);
  const edit = selfEditable || mgrEditable;
  const setA = (which, id, damBao, max) => { const key = which === 'self' ? 'aSelf' : 'aMgr'; onPatch({ [key]: { ...(kd[key] || {}), [id]: damBao ? max : 0 } }); };
  const setTruc = (id, patch) => onPatch({ truc: { ...(kd.truc || {}), [id]: { ...((kd.truc || {})[id] || {}), ...patch } } });
  const setCfg = (id, patch) => onPatch({ trucCfg: { ...(kd.trucCfg || {}), [id]: { ...trucCfgOf(kd, id), ...patch } } });
  const setKpi = (id, v) => onPatch({ kpi: { ...(kd.kpi || {}), [id]: v === '' ? '' : clamp01(v) } });
  const [openA, setOpenA] = useState(null);
  const [openInd, setOpenInd] = useState(null);
  const mauKey = mauKeyFor({ ...person, mauKD: kd.mauKD });

  // Nạp lại bộ nhiệm vụ mẫu theo chức danh (chỉ dùng khi LẬP kế hoạch đầu kỳ).
  const napMau = () => {
    if (!window.confirm(`Nạp mẫu kế hoạch của chức danh "${tenMau(mauKey)}"?\n\nToàn bộ danh sách nhiệm vụ và phân bổ điểm 6 trục hiện có sẽ bị THAY THẾ (phần đã chấm mức độ cũng mất).`)) return;
    const { trucCfg, truc } = mauKeHoach(mauKey);
    onPatch({ trucCfg, truc, kpi: {}, mauKD: mauKey, planApproved: false });
  };

  return (
    <div className="flex-1 space-y-5">
      {/* ---------- Tóm tắt điểm & xếp loại ---------- */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className={`${gi.cls} text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3`}>
          <div><p className="text-xs opacity-90 uppercase tracking-wider">Kết quả đánh giá {quarterLabel || 'quý'}</p><p className="text-2xl font-extrabold leading-tight mt-1">{gi.name}</p></div>
          <div className="text-right"><p className="text-xs opacity-90">Tổng điểm</p><p className="text-3xl font-extrabold">{c.total.toFixed(1)}<span className="text-sm">/100</span></p></div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
          <div className="py-3 px-2"><p className="text-[11px] text-slate-500">Nhóm A — Tiêu chí chung</p><p className="font-bold text-slate-800 text-lg">{c.nhomA.toFixed(1)}<span className="text-xs text-slate-400"> / 30</span></p></div>
          <div className="py-3 px-2"><p className="text-[11px] text-slate-500">Nhóm B — Kết quả nhiệm vụ</p><p className="font-bold text-slate-800 text-lg">{c.nhomB.toFixed(2)}<span className="text-xs text-slate-400"> / {KD_TONG_B}</span></p></div>
        </div>
        {!c.keHoachHopLe && (
          <div className="px-4 pb-3"><div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-[11px] text-rose-800 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>Phân bổ điểm 6 trục đang là <b>{c.tongMax}</b> điểm, phải bằng <b>{KD_TONG_B}</b> điểm thì kế hoạch mới hợp lệ. Sửa ở khối “Kế hoạch quý” bên dưới.</span></div></div>
        )}
        {c.under100 && (
          <div className="px-4 pb-3"><div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>Có nhiệm vụ hoàn thành <b>dưới mức tốt</b>. Theo HD 03 (Điểm 6.2), hoàn thành dưới 100% nhiệm vụ được giao trong quý thì xếp loại <b>Không hoàn thành nhiệm vụ</b>, trừ trường hợp khách quan, bất khả kháng được cấp có thẩm quyền xác nhận (ghi rõ ở ô “Lý do khách quan” bên dưới).</span></div></div>
        )}
      </section>

      {/* ---------- Thông tin theo biểu mẫu ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 flex items-center gap-2"><Users className="w-5 h-5 text-amber-300" /><h2 className="font-bold">Thông tin ghi trên biểu mẫu</h2></div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          <Field label="Họ và tên"><input value={person.name || ''} disabled className={TA} /></Field>
          <Field label="Ngày sinh"><input value={kd.ngaySinh || ''} disabled={!selfEditable} onChange={(e) => onPatch({ ngaySinh: e.target.value })} placeholder="VD: 21/12/1984" className={TA} /></Field>
          <Field label="Chức vụ Đảng (kèm chi bộ đang sinh hoạt)" full><input value={kd.chucVuDang || ''} disabled={!selfEditable} onChange={(e) => onPatch({ chucVuDang: e.target.value })} placeholder="VD: Đảng viên, sinh hoạt tại Chi bộ …" className={TA} /></Field>
          <Field label="Chức vụ chính quyền (kèm lĩnh vực phụ trách)" full><input value={kd.chucVuChinhQuyen || person.position || ''} disabled={!selfEditable} onChange={(e) => onPatch({ chucVuChinhQuyen: e.target.value })} className={TA} /></Field>
          <Field label="Chức vụ đoàn thể"><input value={kd.chucVuDoanThe || ''} disabled={!selfEditable} onChange={(e) => onPatch({ chucVuDoanThe: e.target.value })} placeholder="(nếu có)" className={TA} /></Field>
          <Field label="Đơn vị công tác"><input value={person.department || ''} disabled className={TA} /></Field>
        </div>
      </section>

      {/* ---------- KẾ HOẠCH QUÝ: phân bổ điểm tối đa 6 trục ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
          <h2 className="flex items-center gap-2 font-bold"><Scale className="w-5 h-5 text-amber-300" /> Kế hoạch quý — phân bổ điểm 6 trục</h2>
          <span className={`text-sm font-extrabold px-2.5 py-1 rounded-lg ${c.keHoachHopLe ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>{c.tongMax} / {KD_TONG_B} điểm</span>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5">
            Theo biểu mẫu Hướng dẫn 03-HD/TU, <b>cá nhân tự đề xuất số điểm cho từng trục</b> theo thứ tự ưu tiên công việc của mình (tổng 6 trục = {KD_TONG_B} điểm), ghi rõ trục nào là <b>trục chính, chủ yếu</b> — trục nào là <b>trục phụ, phối hợp, hỗ trợ</b>, rồi trình tập thể lãnh đạo phê duyệt. Điểm này giữ nguyên trong suốt quý và là mẫu số để tính Điểm đạt của trục.
          </p>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="hidden sm:flex bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase gap-2"><span className="w-8">Trục</span><span className="flex-1">Nội dung</span><span className="w-40">Vai trò của trục</span><span className="w-24 text-center">Điểm tối đa</span></div>
            {KD_TRUC.map((t) => { const cfg = trucCfgOf(kd, t.id); return (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2 border-t border-slate-100">
                <span className="shrink-0 w-8 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-extrabold">{t.code}</span>
                <span className="flex-1 text-xs text-slate-600 leading-snug">{t.name}</span>
                <select value={cfg.vaiTro} disabled={!edit} onChange={(e) => setCfg(t.id, { vaiTro: e.target.value })} className={`sm:w-40 text-xs p-1.5 rounded-lg border font-semibold outline-none disabled:opacity-70 ${cfg.vaiTro === 'chinh' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {KD_VAITRO.map((v) => <option key={v.k} value={v.k}>{v.short}</option>)}
                </select>
                <input type="number" min="0" max="70" step="0.5" value={cfg.max} disabled={!edit} onChange={(e) => setCfg(t.id, { max: Math.max(0, Math.min(70, num(e.target.value, 0))) })} className="sm:w-24 text-center text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg py-1.5 outline-none focus:border-indigo-400 disabled:opacity-60" />
              </div>
            ); })}
          </div>
          {edit && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onPatch({ trucCfg: canDeuVe70(kd.trucCfg || {}) })} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><Scale className="w-3.5 h-3.5" /> Chia lại cho đủ {KD_TONG_B} điểm</button>
              <button onClick={napMau} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800"><Sparkles className="w-3.5 h-3.5" /> Nạp mẫu nhiệm vụ theo chức danh</button>
              <span className="text-[11px] text-slate-400 self-center">Mẫu đang áp dụng: <b className="text-slate-600">{tenMau(mauKey)}</b></span>
            </div>
          )}
          <label className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 w-fit">
            <input type="checkbox" checked={!!kd.planApproved} disabled={!mgrEditable} onChange={(e) => onPatch({ planApproved: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
            <span>Kế hoạch quý đã được <b>tập thể lãnh đạo cơ quan, đơn vị phê duyệt</b>.</span>
          </label>
        </div>
      </section>

      {/* ---------- NHÓM A ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="w-5 h-5 text-amber-300" /> Nhóm A — Tiêu chí chung</h2><span className="text-amber-300 font-bold text-sm">{c.nhomA.toFixed(1)} / 30</span></div>
        <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-1"><span className="w-20 text-center">TỰ ĐG</span><span className="w-20 text-center text-red-600">CẤP DUYỆT</span></div>
        <div className="p-4 pt-2 space-y-4">
          {KD_NHOMA.map((g) => {
            const sub = g.items.reduce((s, it) => s + aVal(kd, it.id, it.max, 'mgr'), 0);
            return (
              <div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">{g.title}</p><span className="shrink-0 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{sub.toFixed(1)}/{g.max}</span></div>
                <div className="divide-y divide-slate-100">
                  {g.items.map((it) => { const sv = aDamBao(kd, it.id, 'self'), mv = aDamBao(kd, it.id, 'mgr'); const open = openA === it.id; return (
                    <div key={it.id} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 text-xs font-bold text-slate-400 w-8 pt-1.5">{it.id}</span>
                        <button onClick={() => setOpenA(open ? null : it.id)} className="flex-1 min-w-0 text-left text-sm text-slate-600 hover:text-slate-900 flex items-start gap-1 pt-1"><span className={open ? '' : 'line-clamp-2'}>{it.text}</span><ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
                        <span className="shrink-0 text-[10px] text-slate-400 pt-1.5">/{String(it.max).replace('.', ',')}đ</span>
                        <div className="shrink-0 flex gap-2">
                          <NhiPhan on={sv} disabled={!selfEditable} onChange={(v) => setA('self', it.id, v, it.max)} />
                          <NhiPhan on={mv} disabled={!mgrEditable} onChange={(v) => setA('mgr', it.id, v, it.max)} manh />
                        </div>
                      </div>
                      {open && <p className="mt-2 ml-11 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">Điểm tối đa {String(it.max).replace('.', ',')}đ — <b>Đảm bảo</b> thì tính đủ điểm, <b>Không đảm bảo</b> thì 0 điểm (không chấm điểm lẻ). {it.text}</p>}
                    </div>
                  ); })}
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-slate-400">Biểu mẫu Nhóm A chỉ có 2 ô đánh dấu (x): <b>Đảm bảo</b> → tính đủ điểm tối đa của mục; <b>Không đảm bảo</b> → 0 điểm. Cột <b>Cấp duyệt</b> mặc định kế thừa cột <b>Tự ĐG</b>; chưa chấm thì mặc định Đảm bảo (đủ 30đ).</p>
        </div>
      </section>

      {/* ---------- NHÓM B — 6 TRỤC ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Nhóm B — Kết quả thực hiện nhiệm vụ được giao</h2><span className="text-amber-300 font-bold text-sm">{c.nhomB.toFixed(2)} / {KD_TONG_B}</span></div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
            Mỗi nhiệm vụ ghi đúng 3 cột của kế hoạch — <b>Mục tiêu, nhiệm vụ đề ra</b> · <b>Kết quả cần đạt</b> · <b>Thời gian hoàn thành</b>; cuối kỳ bổ sung <b>Kết quả sản phẩm thực tế</b> và chọn <b>Mức độ hoàn thành</b>. Phần mềm tự tính <b>Điểm KPI (%)</b> của trục (trung bình có trọng số theo tầm quan trọng) và <b>Điểm đạt = KPI% × Điểm tối đa</b>; cấp có thẩm quyền được điều chỉnh lại con số KPI.
          </p>
          {KD_TRUC.map((t) => {
            const d = (kd.truc || {})[t.id] || {};
            const cfg = trucCfgOf(kd, t.id);
            const r = trucKPI(d);
            const { auto, kpi, daSua } = kpiCuaTruc(kd, t.id);
            const diem = kpi / 100 * cfg.max;
            const tasks = trucTasks(d);
            const openI = openInd === t.id;
            return (
              <div key={t.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3 py-2.5 flex items-start gap-2">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-sm font-extrabold">{t.code}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 leading-snug">Trục ({t.code}) — {t.name}</p>
                    <p className="text-[11px] text-slate-500 italic">({vaiTroOf(cfg.vaiTro).label})</p>
                    <button onClick={() => setOpenInd(openI ? null : t.id)} className="text-[11px] text-indigo-600 hover:text-indigo-800 mt-0.5 flex items-center gap-1"><ChevronDown className={`w-3 h-3 transition-transform ${openI ? 'rotate-180' : ''}`} /> Gợi ý chỉ tiêu, nội dung của trục</button>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{diem.toFixed(2)}/{cfg.max}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.hasTasks ? `${r.count}/${r.planned} việc đã chấm` : `${r.planned} việc, chưa chấm`}</p>
                  </div>
                </div>
                {openI && <ul className="px-4 py-2 bg-indigo-50/50 border-t border-indigo-100 list-disc pl-8 text-[11px] text-slate-600 space-y-0.5">{t.indicators.map((x, k) => <li key={k}>{x}</li>)}</ul>}
                <div className="p-3 space-y-2">
                  <TaskList tasks={tasks} selfEditable={selfEditable} mgrEditable={mgrEditable} onChange={(ts) => setTruc(t.id, { tasks: ts })} />
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
                    <span className="text-[11px] font-semibold text-slate-500">Điểm KPI (%) của trục:</span>
                    <span className="text-[11px] text-slate-500">tự tính <b className="text-slate-700">{auto.toFixed(1)}%</b></span>
                    <span className="text-[11px] text-slate-400">→ cấp duyệt điều chỉnh</span>
                    <input type="number" min="0" max="100" step="0.5" value={has((kd.kpi || {})[t.id]) ? (kd.kpi || {})[t.id] : ''} disabled={!mgrEditable} onChange={(e) => setKpi(t.id, e.target.value)} placeholder={auto.toFixed(0)} className="w-20 text-center text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded px-1 py-1 outline-none focus:border-red-400 disabled:opacity-60" />
                    {daSua && mgrEditable && <button onClick={() => setKpi(t.id, '')} className="text-[11px] text-slate-400 hover:text-slate-700 underline">dùng lại số tự tính</button>}
                    <span className="ml-auto text-[11px] text-slate-500">Điểm đạt = <b className="text-red-700">{kpi.toFixed(1)}%</b> × {cfg.max} = <b className="text-red-700">{diem.toFixed(2)}</b></span>
                  </div>
                  <textarea value={d.note || ''} disabled={!edit} onChange={(e) => setTruc(t.id, { note: e.target.value })} rows={2} placeholder="Ghi chú của trục (không bắt buộc) — VD: Hoàn thành 3/3 nhiệm vụ; nhiệm vụ 3 vượt mức…" className={TA} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- I. TỰ ĐÁNH GIÁ KẾT QUẢ THỰC HIỆN NHIỆM VỤ (4 mục) ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-amber-300" /><h2 className="font-bold">I. Tự đánh giá kết quả thực hiện nhiệm vụ</h2></div>
        <div className="p-4 space-y-3">
          <p className="text-[11px] text-slate-400">Bốn mục theo đúng bố cục Bản tự đánh giá: kết quả chung → kết quả nổi bật theo trục → hạn chế, khuyết điểm và nguyên nhân → phương hướng khắc phục.</p>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">1. Kết quả chung
              {selfEditable && <button onClick={() => onPatch({ ketQuaChung: tomTatKetQua(kd, c) })} className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Soạn tự động từ số liệu</button>}
            </span>
            <textarea value={kd.ketQuaChung || ''} disabled={!selfEditable} onChange={(e) => onPatch({ ketQuaChung: e.target.value })} rows={3} className={TA} placeholder="VD: Hoàn thành 12/12 nhiệm vụ (11 nhiệm vụ theo kế hoạch được phê duyệt và 01 nhiệm vụ bổ sung), đạt 100%…" />
          </label>
          <label className="block"><span className="text-xs font-semibold text-emerald-700 mb-1 block">2. Kết quả nổi bật theo trục</span><textarea value={kd.noiBat || kd.uudiem || ''} disabled={!selfEditable} onChange={(e) => onPatch({ noiBat: e.target.value })} rows={4} className={TA} placeholder="Nêu theo từng trục: (i) Trục thể chế, giám sát… (ii) Trục xây dựng Đảng… (iii) Trục chuyển đổi số…" /></label>
          <label className="block"><span className="text-xs font-semibold text-rose-700 mb-1 block">3. Hạn chế, khuyết điểm và nguyên nhân</span><textarea value={kd.hanche || ''} disabled={!selfEditable} onChange={(e) => onPatch({ hanche: e.target.value })} rows={3} className={TA} placeholder="Nêu hạn chế, khuyết điểm (nếu có) và nguyên nhân chủ quan, khách quan…" /></label>
          <label className="block"><span className="text-xs font-semibold text-indigo-700 mb-1 block">4. Phương hướng khắc phục</span><textarea value={kd.phuonghuong || ''} disabled={!selfEditable} onChange={(e) => onPatch({ phuonghuong: e.target.value })} rows={2} className={TA} placeholder="Biện pháp, cam kết khắc phục hạn chế; trọng tâm quý tới…" /></label>
        </div>
      </section>

      {/* ---------- II & III. XẾP LOẠI ---------- */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-amber-300" /><h2 className="font-bold">II. Tự đề xuất xếp loại · III. Nhận xét của cấp có thẩm quyền</h2></div>
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-500">Đề xuất theo điểm & điều kiện (Điều 13):</span>
            <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${kdGradeInfo(c.autoGrade).soft}`}>{kdGradeInfo(c.autoGrade).name}</span>
            <span className="text-[11px] text-slate-400">Vượt mức {Math.round((c.exceedRate || 0) * 100)}% · Không HT {Math.round((c.failRate || 0) * 100)}%{c.chuaCham ? ` · còn ${c.chuaCham} việc chưa chấm` : ''}</span>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 w-fit">
            <input type="checkbox" checked={!!kd.disciplined} disabled={!mgrEditable} onChange={(e) => onPatch({ disciplined: e.target.checked })} className="w-4 h-4 accent-rose-600" />
            <span>Bị <b>kỷ luật</b> (khiển trách trở lên) hoặc suy thoái trong kỳ — ép xếp loại <b>Không hoàn thành nhiệm vụ</b> (Điều 13).</span>
          </label>
          {c.gradeReasons && c.gradeReasons.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 space-y-1">{c.gradeReasons.map((r, i) => <p key={i} className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{r}</p>)}</div>
          )}
          <label className="flex flex-col gap-1 max-w-md"><span className="text-xs font-semibold text-slate-500">II. Cá nhân TỰ đề xuất xếp loại mức chất lượng</span>
            <select value={kd.selfGrade || ''} disabled={!selfEditable} onChange={(e) => onPatch({ selfGrade: e.target.value })} className={TA}><option value="">— Chọn mức tự đề xuất —</option>{KD_GRADES.map((g) => <option key={g.code} value={g.code}>{g.name}</option>)}</select>
          </label>
          <label className="flex flex-col gap-1 max-w-md"><span className="text-xs font-semibold text-slate-500">III. Cấp có thẩm quyền đề xuất xếp loại</span>
            <select value={kd.grade || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ grade: e.target.value })} className={TA}><option value="">(Theo đề xuất: {kdGradeInfo(c.autoGrade).name})</option>{KD_GRADES.map((g) => <option key={g.code} value={g.code}>{g.name}</option>)}</select>
          </label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">III. Mức độ đáp ứng đối với các mục tiêu, nhiệm vụ then chốt</span><textarea value={kd.mgrThenChot || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ mgrThenChot: e.target.value })} rows={2} className={TA} placeholder="Đánh giá của cấp có thẩm quyền về mức độ đáp ứng các mục tiêu, nhiệm vụ then chốt trong quý…" /></label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">Nhận xét chung của cấp có thẩm quyền</span><textarea value={kd.mgrNote || ''} disabled={!mgrEditable} onChange={(e) => onPatch({ mgrNote: e.target.value })} rows={2} className={TA} /></label>
          <label className="block"><span className="text-xs font-semibold text-slate-500 mb-1 block">Lý do khách quan, bất khả kháng (nếu hoàn thành dưới 100% nhiệm vụ)</span><textarea value={kd.exemptNote || ''} disabled={!edit} onChange={(e) => onPatch({ exemptNote: e.target.value })} rows={2} className={TA} placeholder="Nêu lý do cụ thể được cấp có thẩm quyền xác nhận…" /></label>

          {approval && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {approval.approved ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[12px] text-emerald-800">
                  <p className="flex items-center gap-1.5 font-semibold"><CheckCircle2 className="w-4 h-4" /> Đã được cấp có thẩm quyền phê duyệt</p>
                  <p className="mt-0.5 leading-snug">Bởi <b>{approval.by || '—'}</b>{approval.role ? ` (${approval.role})` : ''}{approval.at ? `, ngày ${approval.at}` : ''}.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[12px] text-amber-800">
                  <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="w-4 h-4" /> Chưa phê duyệt</p>
                  <p className="mt-0.5 leading-snug">Bản tự đánh giá cần cấp có thẩm quyền phê duyệt trước khi tổng hợp báo cáo.</p>
                </div>
              )}
              {approval.canApprove && (
                approval.approved
                  ? <button onClick={approval.onToggle} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl"><RotateCcw className="w-4 h-4" /> Bỏ phê duyệt</button>
                  : <button onClick={approval.onToggle} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl"><CheckCircle2 className="w-4 h-4" /> Phê duyệt bản tự đánh giá</button>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-2">
        {onWordKeHoach && <button onClick={onWordKeHoach} className="flex-1 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl"><CalendarClock className="w-4 h-4" /> Xuất KẾ HOẠCH quý (Word)</button>}
        <button onClick={onWord} className="flex-1 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất BẢN TỰ ĐÁNH GIÁ (Word)</button>
        <button onClick={() => window.print()} className="sm:w-40 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In (PDF)</button>
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return <label className={`block ${full ? 'sm:col-span-2' : ''}`}><span className="text-[11px] font-semibold text-slate-500 mb-1 block">{label}</span>{children}</label>;
}

// Ô chấm NHỊ PHÂN của Nhóm A — đúng 2 lựa chọn "Đảm bảo" / "Không đảm bảo".
function NhiPhan({ on, disabled, onChange, manh }) {
  const base = 'w-10 py-1 text-[11px] font-bold rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <div className="flex gap-1">
      <button type="button" disabled={disabled} onClick={() => onChange(true)} title="Đảm bảo — tính đủ điểm tối đa của mục"
        className={`${base} ${on ? (manh ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-100 text-emerald-700 border-emerald-300') : 'bg-white text-slate-300 border-slate-200'}`}>Đạt</button>
      <button type="button" disabled={disabled} onClick={() => onChange(false)} title="Không đảm bảo — 0 điểm"
        className={`${base} ${!on ? (manh ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-100 text-rose-700 border-rose-300') : 'bg-white text-slate-300 border-slate-200'}`}>Không</button>
    </div>
  );
}

// DANH SÁCH NHIỆM VỤ của 1 trục — đúng các cột của biểu mẫu:
//   Mục tiêu, nhiệm vụ đề ra · Kết quả cần đạt · Thời gian hoàn thành  (phần KẾ HOẠCH)
//   Kết quả sản phẩm thực tế · Mức độ hoàn thành · Tầm quan trọng      (phần ĐÁNH GIÁ)
function TaskList({ tasks, selfEditable, mgrEditable, onChange }) {
  const edit = selfEditable || mgrEditable;
  const up = (id, patch) => onChange(tasks.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const add = () => onChange([...tasks, { id: 'k_' + (tasks.reduce((m, p) => Math.max(m, +String(p.id).replace(/\D/g, '') || 0), 0) + 1), name: '', ketQuaCanDat: '', thoiGian: '', ketQuaThucTe: '', muc: '', tam: KD_TAM_DEFAULT }]);
  const del = (id) => onChange(tasks.filter((p) => p.id !== id));
  return (
    <div className="space-y-2">
      {tasks.length === 0 && <p className="text-[11px] text-slate-400 italic px-1">Chưa đăng ký nhiệm vụ nào cho trục này (KPI mặc định 100%). Bấm “Thêm nhiệm vụ” hoặc dùng nút “Nạp mẫu nhiệm vụ theo chức danh” ở khối Kế hoạch quý.</p>}
      {tasks.map((p, i) => { const m = p.muc ? mucOf(p.muc) : null; return (
        <div key={p.id} className="rounded-lg bg-slate-50 border border-slate-200 p-2 space-y-1.5">
          <div className="flex items-start gap-1.5">
            <span className="shrink-0 w-5 h-5 mt-1 rounded bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
            <textarea value={p.name || ''} disabled={!edit} onChange={(e) => up(p.id, { name: e.target.value })} rows={2} placeholder="Mục tiêu, nhiệm vụ đề ra…" className="flex-1 text-xs font-medium p-1.5 border border-slate-200 rounded outline-none focus:border-red-400 disabled:bg-white/60 bg-white" />
            {edit ? <button onClick={() => del(p.id)} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1 rounded mt-0.5"><Trash2 className="w-3.5 h-3.5" /></button> : <span className="w-5" />}
          </div>
          <div className="grid sm:grid-cols-2 gap-1.5 pl-0 sm:pl-7">
            <label className="block"><span className="text-[10px] font-semibold text-slate-400">Kết quả cần đạt</span>
              <textarea value={p.ketQuaCanDat || ''} disabled={!edit} onChange={(e) => up(p.id, { ketQuaCanDat: e.target.value })} rows={2} placeholder="Sản phẩm, tiêu chuẩn nghiệm thu…" className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white outline-none focus:border-red-400 disabled:bg-white/60" /></label>
            <label className="block"><span className="text-[10px] font-semibold text-slate-400">Thời gian hoàn thành</span>
              <input value={p.thoiGian || ''} disabled={!edit} onChange={(e) => up(p.id, { thoiGian: e.target.value })} placeholder="VD: Tháng 11-12/2026" className="w-full text-[11px] p-1.5 border border-slate-200 rounded bg-white outline-none focus:border-red-400 disabled:bg-white/60" /></label>
          </div>
          <div className="pl-0 sm:pl-7 space-y-1.5">
            <label className="block"><span className="text-[10px] font-semibold text-emerald-600">Kết quả sản phẩm thực tế (ghi khi đánh giá cuối kỳ)</span>
              <textarea value={p.ketQuaThucTe || ''} disabled={!edit} onChange={(e) => up(p.id, { ketQuaThucTe: e.target.value })} rows={2} placeholder="Đã thực hiện được gì, số lượng, chất lượng, tiến độ…" className="w-full text-[11px] p-1.5 border border-emerald-200 rounded bg-white outline-none focus:border-emerald-400 disabled:bg-white/60" /></label>
            <div className="flex flex-col sm:flex-row gap-1.5">
              <select value={p.muc || ''} disabled={!edit} onChange={(e) => up(p.id, { muc: e.target.value })} className={`sm:flex-1 text-xs p-1.5 rounded border font-semibold outline-none disabled:opacity-70 ${m ? m.tone : 'bg-white text-slate-400 border-slate-200'}`}>
                <option value="">— Chưa đánh giá mức độ —</option>
                {KD_MUC.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}
              </select>
              <select value={p.tam || KD_TAM_DEFAULT} disabled={!edit} onChange={(e) => up(p.id, { tam: e.target.value })} title="Tầm quan trọng → trọng số khi tính KPI của trục (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2)" className="sm:w-36 text-xs p-1.5 rounded border border-slate-200 bg-white text-slate-600 outline-none focus:border-red-400 disabled:bg-slate-50">
                {KD_TAM.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}
              </select>
            </div>
          </div>
        </div>
      ); })}
      {edit && <button onClick={add} className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-slate-300 rounded-md text-[11px] font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-3.5 h-3.5" /> Thêm nhiệm vụ</button>}
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
  const chuaDuyetKH = computed.filter(({ p }) => !(p.kd || {}).planApproved).length;
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
        {chuaDuyetKH > 0 && (
          <div className="mb-3 rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-[12px] text-indigo-800 flex items-start gap-2"><CalendarClock className="w-4 h-4 shrink-0 mt-0.5" /><span>Còn <b>{chuaDuyetKH}/{n}</b> đồng chí chưa được tập thể lãnh đạo <b>phê duyệt kế hoạch quý</b> (đăng ký nhiệm vụ và phân bổ điểm 6 trục). Theo Hướng dẫn 03-HD/TU, kế hoạch phải được duyệt từ đầu kỳ rồi mới lấy đó làm căn cứ tự đánh giá cuối kỳ.</span></div>
        )}
        {dist.HTXS > Math.floor((dist.HTT || 0) * 0.2) && (
          <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-[12px] text-rose-800 flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>Cảnh báo trần tỷ lệ (Điều 13 QĐ 73): đang có <b>{dist.HTXS}</b> “Hoàn thành xuất sắc” trong khi tối đa cho phép là <b>{Math.floor((dist.HTT || 0) * 0.2)}</b> (không quá 20% của {dist.HTT} người “Hoàn thành tốt”; đơn vị có thành tích nổi trội tối đa 25%).</span></div>
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
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">#</th><th className="text-left px-3 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Chức vụ</th><th className="text-center px-3 py-2.5 font-semibold">Kế hoạch</th><th className="text-center px-3 py-2.5 font-semibold">Nhóm A</th><th className="text-center px-3 py-2.5 font-semibold">Nhóm B</th><th className="text-center px-3 py-2.5 font-semibold">Tổng</th><th className="text-left px-3 py-2.5 font-semibold">Đề xuất xếp loại</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map(({ p, c }, idx) => { const gi = kdGradeInfo(c.grade); const duyet = !!(p.kd || {}).planApproved; return (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onPick && onPick(p.id)}>
                  <td className="px-4 py-3 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{p.name || '(Chưa tên)'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{p.position || '—'}</td>
                  <td className="px-3 py-3 text-center"><span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${duyet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{duyet ? 'Đã duyệt' : 'Chưa duyệt'}</span></td>
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
