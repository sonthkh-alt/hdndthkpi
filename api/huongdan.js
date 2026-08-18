// ============================================================================
//  "NGƯỜI HƯỚNG DẪN" HỎI AI — điểm nối cho khung chat nổi ở Trang chủ.
//
//  Câu CÓ SẴN đã được trả lời ngay trong trình duyệt (src/lib/huongDanBot.js,
//  0 token) — chỉ câu NGOÀI kịch bản mới tới đây. Trần chi phí:
//     • Mỗi khách 3 lượt AI/ngày (đổi bằng HUONGDAN_QUOTA), đếm Ở MÁY CHỦ
//       theo chuỗi băm IP + trình duyệt (không lưu IP gốc — như hanMuc.js).
//     • Hết lượt → 429, giao diện hiện hướng dẫn đăng ký bot Zalo/Telegram.
//     • Trừ lượt TRƯỚC khi gọi AI (bấm liên tiếp không lọt trần); AI lỗi thì
//       hoàn lại lượt vừa trừ.
//  CỐ Ý không nạp facts.js: điểm nối mở cho khách, chỉ hướng dẫn sử dụng,
//  không được kèm số liệu nhân sự/đánh giá nào vào ngữ cảnh AI.
// ============================================================================
import { hasAI, askAI } from './_lib/ai.js';
import { KNOWLEDGE } from './_lib/knowledge.js';
import { getRow, putRow, hasStore, isServiceKey } from './_lib/store.js';
import { ngayVN, khoaDem, donNgayCu, trangThai } from './_lib/hanMuc.js';

const ROW_ID = 'hd_quota';
export const gioiHan = () => Number(process.env.HUONGDAN_QUOTA ?? 3);

const SYSTEM = `Bạn là "Người hướng dẫn" — khung chat nhỏ ở Trang chủ hệ thống của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa, chuyên HƯỚNG DẪN SỬ DỤNG.

QUY TẮC:
1. Trả lời tiếng Việt có dấu, lịch sự, NGẮN GỌN (tối đa 120 từ), dùng gạch đầu dòng khi liệt kê, không dùng Markdown phức tạp.
2. Bạn KHÔNG được nạp bất kỳ số liệu thật nào (điểm, xếp loại, lịch, kết quả biểu quyết). Ai hỏi số liệu thì nói thẳng là khung chat này không đọc được số liệu, mời họ chat với trợ lý AI đầy đủ trên Zalo (https://zalo.me/142053241153738721) hoặc Telegram (https://t.me/hdnd_thanhhoa_bot) — nhắn "/dangky Họ và tên - Đơn vị" một lần để đăng ký.
3. Tuyệt đối không cung cấp mật khẩu, mã truy cập, thông tin cá nhân của cán bộ.
4. Đây là bản demo thử nghiệm — kết quả dùng vào việc chính thức phải đối chiếu lại.
5. Câu hỏi ngoài phạm vi hệ thống (kiến thức chung, soạn thảo...) vẫn trả lời được bằng kiến thức của bạn, ngắn gọn.

HIỂU BIẾT VỀ HỆ THỐNG:
${KNOWLEDGE}`;

/** Xem số lượt còn lại của người gọi (KHÔNG trừ). */
async function xemLuot(req) {
  const gh = gioiHan();
  // Không đếm được thì coi như HẾT — không mở AI vô hạn cho khách vì thiếu cấu hình.
  if (!hasStore() || !isServiceKey()) return { ...trangThai(gh, gh), khongDem: true };
  try {
    const row = await getRow(ROW_ID);
    const doc = donNgayCu(row?.data, ngayVN());
    return trangThai(doc.dem[khoaDem(req, null)] || 0, gh);
  } catch { return { ...trangThai(gh, gh), khongDem: true }; }
}

/** Trừ MỘT lượt (trước khi gọi AI). */
async function truLuot(req) {
  const gh = gioiHan();
  if (!hasStore() || !isServiceKey()) return { ok: false, ...trangThai(gh, gh), khongDem: true };
  try {
    const row = await getRow(ROW_ID);
    const doc = donNgayCu(row?.data, ngayVN());
    const khoa = khoaDem(req, null);
    const daDung = doc.dem[khoa] || 0;
    if (daDung >= gh) return { ok: false, ...trangThai(daDung, gh) };
    doc.dem[khoa] = daDung + 1;
    await putRow(ROW_ID, doc);
    return { ok: true, ...trangThai(daDung + 1, gh) };
  } catch { return { ok: false, ...trangThai(gh, gh), khongDem: true }; }
}

/** AI lỗi thì hoàn lại lượt vừa trừ (cố gắng hết sức, lỗi thì thôi). */
async function hoanLuot(req) {
  try {
    const row = await getRow(ROW_ID);
    const doc = donNgayCu(row?.data, ngayVN());
    const khoa = khoaDem(req, null);
    if (doc.dem[khoa] > 0) { doc.dem[khoa] -= 1; await putRow(ROW_ID, doc); }
  } catch { /* bỏ qua */ }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, ai: hasAI(), hanMuc: await xemLuot(req) });
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { hoi, lichSu } = req.body || {};
  const cau = String(hoi || '').trim().slice(0, 500);
  if (!cau) return res.status(400).json({ ok: false, error: 'Thiếu câu hỏi.' });
  if (!hasAI()) return res.status(200).json({ ok: false, hetLuot: true, hanMuc: await xemLuot(req), error: 'Máy chủ chưa cấu hình khóa AI.' });

  // Trừ lượt TRƯỚC khi gọi AI.
  const q = await truLuot(req);
  if (!q.ok) return res.status(429).json({ ok: false, hetLuot: true, hanMuc: q });

  // Vài lượt hội thoại gần nhất để hỏi nối tiếp được; cắt gọn, lọc sạch.
  const turns = (Array.isArray(lichSu) ? lichSu.slice(-6) : [])
    .map((t) => ({ role: t?.role === 'assistant' ? 'assistant' : 'user', text: String(t?.text || '').slice(0, 600) }))
    .filter((t) => t.text);
  while (turns.length && turns[0].role === 'assistant') turns.shift(); // AI đòi lượt đầu là user

  try {
    const traLoi = await askAI(SYSTEM, [...turns, { role: 'user', text: cau }]);
    return res.status(200).json({ ok: true, traLoi: traLoi || '(AI không trả lời)', hanMuc: q });
  } catch (e) {
    await hoanLuot(req);
    return res.status(200).json({ ok: false, error: String(e.message || e).slice(0, 300), hanMuc: await xemLuot(req) });
  }
}
