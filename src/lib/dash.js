// Tiện ích tổng hợp cho tab Tổng quan (không phụ thuộc thư viện nặng).

const ratingCode = (t) => (t >= 90 ? 'A' : t >= 70 ? 'B' : t >= 50 ? 'C' : 'D');

// Tổng hợp & SO SÁNH theo Phòng/Bộ phận từ mảng computed [{p, c}].
// Trả: { dept, count, avg(/100), quality(Nhóm I /30), kpi(Nhóm II /70), qualityPct, kpiPct, A,B,C,D }
export function deptSummary(computed) {
  const map = new Map();
  (computed || []).forEach(({ p, c }) => {
    const dept = (p.department || '').trim() || 'Chưa phân phòng';
    if (!map.has(dept)) map.set(dept, { dept, count: 0, sum: 0, sumQ: 0, sumK: 0, A: 0, B: 0, C: 0, D: 0 });
    const g = map.get(dept);
    g.count++;
    g.sum += c.totalMgr;
    g.sumQ += Number(c.nmgr) || 0;     // Nhóm I — tiêu chí chung (chất lượng), tối đa 30
    g.sumK += Number(c.nhomII) || 0;   // Nhóm II — kết quả nhiệm vụ (KPI), tối đa 70
    g[ratingCode(c.totalMgr)]++;
  });
  return [...map.values()]
    .map((g) => {
      const quality = g.count ? g.sumQ / g.count : 0;
      const kpi = g.count ? g.sumK / g.count : 0;
      return {
        ...g,
        avg: g.count ? g.sum / g.count : 0,
        quality, kpi,
        qualityPct: quality / 30 * 100,
        kpiPct: kpi / 70 * 100,
      };
    })
    .sort((a, b) => b.avg - a.avg);
}
