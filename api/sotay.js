// ============================================================================
//  HÀM API của phân hệ "SỔ TAY AI" (chỉ chạy trên Vercel).
//    POST /api/sotay  { cauHoi, nguCanh, tenSoTay, lichSu[] } → trả lời CÓ TRÍCH DẪN
//    GET  /api/sotay                                          → tình trạng + hạn mức
//
//  ⚠️ Truy hồi đoạn văn bản chạy Ở TRÌNH DUYỆT (src/lib/soTayAI.js) chứ không ở
//     đây. Lý do: nguyên văn các văn bản đã nằm sẵn trong trình duyệt sau khi mở
//     phân hệ, truy hồi tại chỗ thì trả lời nhanh hơn và máy chủ không phải tải
//     lại cả kho văn bản cho mỗi câu hỏi. Máy chủ chỉ nhận ĐÚNG mấy đoạn đã chọn.
//
//  ⚠️ Dùng CHUNG hạn mức với Trợ lý AI (api/_lib/hanMuc.js): khách 1 lượt/ngày,
//     người đã đăng nhập 5 lượt/ngày — vì cùng tiêu tiền của một khóa API.
// ============================================================================
import { askAI, hasAI, modelName, endpointHost } from './_lib/ai.js';
import { verifyUser, hasAuth } from './_lib/xacThuc.js';
import { SYSTEM_SO_TAY, promptSoTay, catNguCanh, MAX_CAU_HOI, MAX_NGU_CANH } from './_lib/soTay.js';
import { gioiHanKhach, gioiHanNguoiDung, loiHetLuot, truMotLuot, xemHanMuc } from './_lib/hanMuc.js';

const MAX_LICH_SU = 4;     // số câu hỏi trước đó gửi kèm để hiểu ngữ cảnh

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const u = await verifyUser(req);
    const hm = await xemHanMuc(req, u);
    return res.status(200).json({
      ok: true,
      coAI: hasAI(), moHinh: hasAI() ? modelName() : '', mayChu: hasAI() ? endpointHost() : '',
      coXacThuc: hasAuth(), daDangNhap: !!u,
      hanMuc: { ...hm, khach: gioiHanKhach(), nguoiDung: gioiHanNguoiDung() },
      gioiHan: { cauHoi: MAX_CAU_HOI, nguCanh: MAX_NGU_CANH },
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST.' });

  if (!hasAI()) {
    return res.status(503).json({ error: 'Chưa cấu hình khóa AI trên máy chủ. Liên hệ Quản trị để khai biến ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY trên Vercel.' });
  }

  // Kiểm tra yêu cầu HỢP LỆ trước khi trừ lượt (tránh mất lượt oan).
  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const cauHoi = String(body.cauHoi || '').trim().slice(0, MAX_CAU_HOI);
  const nguCanh = catNguCanh(body.nguCanh || '');
  const tenSoTay = String(body.tenSoTay || '').slice(0, 200);
  const lichSu = (Array.isArray(body.lichSu) ? body.lichSu : [])
    .slice(-MAX_LICH_SU).map((s) => String(s || '').slice(0, 300)).filter(Boolean);

  if (!cauHoi) return res.status(400).json({ error: 'Chưa nhập câu hỏi.' });
  if (!nguCanh.trim()) {
    // Không có đoạn nguồn nào thì KHÔNG gọi AI — vừa đỡ tốn lượt, vừa đúng
    // nguyên tắc "không có nguồn thì không trả lời".
    return res.status(400).json({ error: 'Không có đoạn nguồn nào để tra cứu. Hãy nạp nguyên văn văn bản vào sổ tay trước.' });
  }

  const user = await verifyUser(req);
  const hm = await truMotLuot(req, user);
  if (!hm.ok) return res.status(429).json({ error: loiHetLuot(user, hm.gioiHan), hanMuc: hm, daDangNhap: !!user });
  const kem = { hanMuc: { daDung: hm.daDung, conLai: hm.conLai, gioiHan: hm.gioiHan }, daDangNhap: !!user };

  try {
    const prompt = promptSoTay({ cauHoi, nguCanh, tenSoTay, lichSu });
    const text = await askAI(SYSTEM_SO_TAY, [{ role: 'user', text: prompt }]);
    return res.status(200).json({ text, moHinh: modelName(), ...kem });
  } catch (e) {
    console.error('sotay:', e);
    return res.status(502).json({ error: `Máy chủ AI báo lỗi: ${String(e.message || e).slice(0, 300)}` });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
