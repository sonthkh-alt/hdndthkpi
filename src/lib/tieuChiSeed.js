import { KHUNG } from './khungTieuChi';
import { makeUnit, evalKey } from './tieuChiStore';

// ============================================================================
//  DỮ LIỆU MẪU (MÔ PHỎNG) cho module Đánh giá tiêu chí HĐND.
//  Dùng để trình diễn: 10 đơn vị cấp xã, phường + 4 đơn vị cấp tỉnh, mỗi đơn vị
//  có sẵn phiếu tự đánh giá ở các mức khác nhau (Xuất sắc → Yếu), một số đã gửi,
//  đã thẩm định, đã phê duyệt để thấy đủ quy trình.
//  ⚠️ TÊN ĐƠN VỊ VÀ MỌI SỐ LIỆU ĐỀU LÀ MÔ PHỎNG — không phải số liệu thật.
//  Mọi đơn vị mẫu dùng chung MÃ TRUY CẬP `DEMO_PIN` để người xem thử đăng nhập.
// ============================================================================

export const DEMO_PIN = 'DEMO2026';

// Hồ sơ chấm điểm: tỷ lệ chọn được mức cao nhất ở mỗi điểm thành phần.
const PROFILES = {
  A: { rate: 0.99, bonus: 2, deduct: 0 },   // ~ Xuất sắc
  B: { rate: 0.90, bonus: 1, deduct: 0 },   // ~ Tốt
  C: { rate: 0.76, bonus: 0, deduct: 1 },   // ~ Khá
  D: { rate: 0.72, bonus: 0, deduct: 2 },   // ~ Trung bình
  E: { rate: 0.45, bonus: 0, deduct: 3 },   // ~ Yếu
};

// 10 xã, phường (tên mô phỏng theo địa danh Thanh Hóa) + trạng thái hồ sơ.
//  st: 'approved' đã phê duyệt · 'reviewed' đã thẩm định · 'sent' đã gửi · 'doing' đang làm
const XA = [
  { name: 'Phường Hạc Thành', p: 'A', st: 'approved' },
  { name: 'Phường Đông Sơn', p: 'A', st: 'approved' },
  { name: 'Phường Sầm Sơn', p: 'A', st: 'reviewed' },
  { name: 'Phường Bỉm Sơn', p: 'B', st: 'reviewed' },
  { name: 'Phường Nghi Sơn', p: 'B', st: 'sent' },
  { name: 'Xã Hoằng Hóa', p: 'B', st: 'sent' },
  { name: 'Xã Thọ Xuân', p: 'C', st: 'sent' },
  { name: 'Xã Nga Sơn', p: 'C', st: 'doing' },
  { name: 'Xã Triệu Sơn', p: 'D', st: 'doing' },
  { name: 'Xã Quan Sơn', p: 'E', st: 'sent', nqTrai: true },
];

const TINH = [
  { name: 'Thường trực HĐND tỉnh', p: 'A', st: 'reviewed' },
  { name: 'Ban Kinh tế - Ngân sách', p: 'B', st: 'sent' },
  { name: 'Ban Văn hóa - Xã hội', p: 'B', st: 'sent' },
  { name: 'Văn phòng Đoàn ĐBQH và HĐND tỉnh', p: 'C', st: 'doing' },
];

// Bộ sinh số giả ngẫu nhiên CÓ HẠT GIỐNG → dữ liệu mẫu luôn giống nhau ở mọi máy.
const lcg = (seed) => {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const PROOFS = [
  'Hồ sơ kèm theo (mô phỏng)', 'Báo cáo năm của Thường trực HĐND (mô phỏng)',
  'Kế hoạch, thông báo kết luận (mô phỏng)', 'Sổ theo dõi điện tử (mô phỏng)',
];

// Sinh câu trả lời cho một đơn vị theo hồ sơ.
function genAns(kind, prof, seed, opts = {}) {
  const K = KHUNG[kind];
  const { rate, bonus, deduct } = PROFILES[prof];
  const rnd = lcg(seed);
  const ans = {};
  const fill = (g) => g.items.forEach((it) => it.subs.forEach((sb) => {
    const t = sb.type || 'choice';
    const good = rnd() < rate;
    if (t === 'choice') {
      const order = sb.options.map((o, i) => ({ s: o.s, i })).sort((a, b) => b.s - a.s);
      const pick = good ? 0 : Math.min(order.length - 1, rnd() < 0.7 ? 1 : 2);
      ans[sb.id] = { sel: order[pick].i };
    } else if (t === 'minus') {
      ans[sb.id] = { count: good ? 0 : 1 + Math.floor(rnd() * 2) };
    } else if (t === 'ratio') {
      ans[sb.id] = { pct: Math.round(clamp(rate * 100 + (rnd() * 12 - 4), 30, 100)) };
    } else if (t === 'count') {
      const full = Math.ceil(sb.max / sb.per);
      ans[sb.id] = { count: good ? full : Math.max(0, full - 1) };
    }
    if (rnd() < 0.35) ans[sb.id].proof = PROOFS[Math.floor(rnd() * PROOFS.length)];
  }));

  // Đơn vị "đang làm" mới khai được 4/7 nhóm đầu.
  (opts.partial ? K.groups.slice(0, 4) : K.groups).forEach(fill);

  if (!opts.partial) {
    // Nhóm VIII — điểm thưởng: chỉ đơn vị khá/tốt trở lên mới có.
    K.bonus.items.slice(0, bonus).forEach((it) => it.subs.forEach((sb) => {
      if ((sb.type || 'choice') === 'choice') {
        const order = sb.options.map((o, i) => ({ s: o.s, i })).sort((a, b) => b.s - a.s);
        ans[sb.id] = { sel: order[0].i, proof: PROOFS[0] };
      } else ans[sb.id] = { count: 1, proof: PROOFS[0] };
    }));
    // Nhóm IX — điểm trừ (tránh các mục có chế tài nặng, trừ trường hợp cố ý minh họa).
    const soft = K.deduct.items.filter((it) => !it.sanction).slice(0, deduct);
    soft.forEach((it, i) => { ans[it.id] = { count: 1 + (i % 2), proof: 'Văn bản theo dõi (mô phỏng)' }; });
    // Minh họa chế tài: có nghị quyết bị kết luận trái pháp luật → không xếp loại Xuất sắc.
    if (opts.nqTrai) ans['IX.1'] = { count: 1, proof: 'Thông báo kết luận (mô phỏng)' };
  }
  return ans;
}

const NOTE = 'Dữ liệu mô phỏng phục vụ trình diễn phần mềm. Đơn vị đề nghị Thường trực HĐND tỉnh quan tâm hướng dẫn nghiệp vụ và chia sẻ dữ liệu dùng chung.';

// Tạo toàn bộ dữ liệu mẫu (bất đồng bộ vì phải băm mã truy cập).
export async function seedTieuChi(year = String(new Date().getFullYear())) {
  const units = [];
  const evals = {};
  const rows = [...XA.map((x) => ({ ...x, kind: 'xa' })), ...TINH.map((x) => ({ ...x, kind: 'tinh' }))];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const { unit } = await makeUnit({ name: r.name, kind: r.kind, pin: DEMO_PIN, contact: 'Chánh Văn phòng HĐND (mô phỏng)', phone: '02373.000.000' });
    unit.id = `demo-${r.kind}-${i + 1}`; // mã cố định để phiên đăng nhập thử không mất khi tải lại trang
    unit.demo = true;
    units.push(unit);

    const partial = r.st === 'doing';
    const ans = genAns(r.kind, r.p, 1000 + i * 77, { partial, nqTrai: r.nqTrai });
    const rec = {
      unitId: unit.id, unitName: unit.name, kind: r.kind, year: String(year), ans,
      contact: 'Nguyễn Văn A - Chánh Văn phòng HĐND (mô phỏng)', phone: '02373.000.000',
      selfNote: NOTE, demo: true,
      submitted: !partial, submittedAt: partial ? '' : `${year}-12-${String(10 + i).padStart(2, '0')}T08:00:00.000Z`,
      updatedAt: `${year}-12-${String(10 + i).padStart(2, '0')}T08:00:00.000Z`,
      review: { total: null, grade: '', note: '', by: '', at: '' },
      approved: null,
    };
    if (r.st === 'reviewed' || r.st === 'approved') {
      rec.review = {
        total: null, grade: '',
        note: 'Tổ công tác đã đối chiếu hồ sơ minh chứng, thống nhất với kết quả tự chấm của đơn vị (mô phỏng).',
        by: 'Tổ công tác thẩm định', at: `${year}-12-22T08:00:00.000Z`,
      };
    }
    if (r.st === 'approved') {
      rec.approved = { by: 'Thường trực HĐND tỉnh', at: `${year}-12-28T08:00:00.000Z` };
    }
    evals[evalKey(unit.id, year)] = rec;
  }
  return { units, evals, cfg: { year: String(year), open: true, demo: true }, updatedAt: new Date().toISOString() };
}
