// ===== BẢN PRO — Cơ chế tính điểm OKR/KPI gia quyền =====
// Theo Quyết định của Thường trực HĐND tỉnh Thanh Hóa (Danh mục công việc & Bộ tiêu chí OKR/KPI)
// + NĐ 335/2025/NĐ-CP + Sổ tay Bộ Nội vụ.
//
// Khác biệt cốt lõi với bản cổ điển/mới:
//  - Nhóm II không đếm catalog mà chấm theo BỘ KPI/KR gắn TRỌNG SỐ (%), tổng = 100%/vị trí.
//  - Điểm Nhóm II = bình quân GIA QUYỀN của (số lượng a, chất lượng b, tiến độ c) theo trọng số,
//    rồi × 70%. Cán bộ: (a+b+c)/3. Lãnh đạo: (a+b+c+d+đ+e)/6 (thêm 3 thành phần lãnh đạo).
import { CRITERIA } from '../App.jsx';

const clampPro = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

let kid = 1;
export const newKpi = () => ({ id: kid++, objId: '', name: '', weight: 0, quantity: 100, quality: 100, progress: 100 });
export const bumpKpiIds = (people) => {
  const ids = (people || []).flatMap((p) => (p.kpis || []).map((k) => k.id || 0));
  kid = Math.max(kid, 0, ...ids) + 1;
};

// Lãnh đạo, quản lý -> dùng 6 thành phần (a,b,c,d,đ,e)
export const isLeaderType = (type) => type === 'leader' || type === 'hdnd';

// Điểm % của 1 KPI/KR (trung bình số lượng + chất lượng + tiến độ) — cho thanh trạng thái
export const kpiScore = (k) => ((Number(k.quantity) || 0) + (Number(k.quality) || 0) + (Number(k.progress) || 0)) / 3;

export function computePro(p) {
  // Nhóm I — Tiêu chí chung (≤30), DÙNG CHUNG với các bản khác (selfScores/mgrScores theo CRITERIA)
  let nself = 0, nmgr = 0;
  CRITERIA[p.type].groups.forEach((g) => g.items.forEach((it) => {
    const sv = p.selfScores[it.id] ?? it.max;
    nself += sv; nmgr += (p.mgrScores[it.id] ?? sv);
  }));
  nself = Math.min(nself, 30); nmgr = Math.min(nmgr, 30);

  // Nhóm II — KPI/KR gia quyền
  const kpis = (p.kpis || []).filter((k) => Number(k.weight) > 0);
  const tw = kpis.reduce((s, k) => s + Number(k.weight || 0), 0);
  let a = 0, b = 0, c = 0;
  if (tw > 0) {
    a = kpis.reduce((s, k) => s + Number(k.weight) * (Number(k.quantity) || 0), 0) / tw;
    b = kpis.reduce((s, k) => s + Number(k.weight) * (Number(k.quality) || 0), 0) / tw;
    c = kpis.reduce((s, k) => s + Number(k.weight) * (Number(k.progress) || 0), 0) / tw;
  }
  const leader = isLeaderType(p.type);
  const ls = p.leadScores || {};
  const d = ls.d ?? 100, dd = ls.dd ?? 100, e = ls.e ?? 100; // kết quả lĩnh vực / tổ chức triển khai / đoàn kết
  const val = leader ? (a + b + c + Number(d) + Number(dd) + Number(e)) / 6 : (a + b + c) / 3;
  const nhomII = (val / 100) * 70;
  const ded = Number(p.deduction || 0);

  return {
    nself, nmgr, k: { a, b, c, val }, nhomII, leader,
    weightSum: tw,
    totalSelf: clampPro(nself + nhomII - ded), totalMgr: clampPro(nmgr + nhomII - ded),
  };
}

// Gợi ý KPI/KR theo nhóm vị trí (rút gọn từ Phụ lục Quyết định) — phục vụ "Thêm nhanh từ mẫu"
export const POSITION_CATALOG = {
  leader: [
    { name: 'Hoàn thành ≥95% kế hoạch công tác đúng hạn', weight: 30 },
    { name: '≥95% văn bản do bộ phận trình đạt chất lượng, không phải làm lại', weight: 25 },
    { name: '100% hoạt động được phục vụ kịp thời, không gián đoạn', weight: 25 },
    { name: 'Đánh giá, đôn đốc, đoàn kết đội ngũ đúng quy trình, đúng hạn', weight: 20 },
  ],
  hdnd: [
    { name: '100% báo cáo thẩm tra hoàn thành đúng hạn, bảo đảm pháp lý', weight: 35 },
    { name: '100% giám sát/khảo sát đúng tiến độ, có kết luận, kiến nghị', weight: 30 },
    { name: '≥90% kiến nghị được cơ quan thẩm quyền tiếp thu', weight: 20 },
    { name: '100% tiếp xúc cử tri/tiếp công dân theo định kỳ', weight: 15 },
  ],
  staff: [
    { name: '≥95% văn bản dự thảo được duyệt ngay lần đầu, đúng thể thức', weight: 35 },
    { name: '100% nhiệm vụ được giao hoàn thành đúng tiến độ', weight: 30 },
    { name: 'Cập nhật đầy đủ tiến độ và minh chứng trên hệ thống đúng hạn', weight: 20 },
    { name: 'Ứng dụng công cụ số/AI rút ngắn ≥1 quy trình', weight: 15 },
  ],
  contract: [
    { name: '100% phương tiện/thiết bị an toàn, sẵn sàng phục vụ', weight: 40 },
    { name: '100% yêu cầu phục vụ/hậu cần được đáp ứng đúng hạn', weight: 30 },
    { name: 'Không để xảy ra mất an ninh, thất lạc, sự cố do lỗi chủ quan', weight: 20 },
    { name: 'Chấp hành kỷ luật lao động, bảo đảm chuyên cần', weight: 10 },
  ],
};
