// Tiện ích tổng hợp cho tab Tổng quan (không phụ thuộc thư viện nặng).

const ratingCode = (t) => (t >= 90 ? 'A' : t >= 70 ? 'B' : t >= 50 ? 'C' : 'D');

// Tổng hợp theo Phòng/Bộ phận từ mảng computed [{p, c}] -> [{dept, count, avg, A,B,C,D}]
export function deptSummary(computed) {
  const map = new Map();
  (computed || []).forEach(({ p, c }) => {
    const dept = (p.department || '').trim() || 'Chưa phân phòng';
    if (!map.has(dept)) map.set(dept, { dept, count: 0, sum: 0, A: 0, B: 0, C: 0, D: 0 });
    const g = map.get(dept);
    g.count++; g.sum += c.totalMgr; g[ratingCode(c.totalMgr)]++;
  });
  return [...map.values()]
    .map((g) => ({ ...g, avg: g.count ? g.sum / g.count : 0 }))
    .sort((a, b) => b.avg - a.avg);
}
