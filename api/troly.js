// ============================================================================
//  HÀM API của phân hệ "TRỢ LÝ AI NGHIỆP VỤ DÂN CỬ" (chỉ chạy trên Vercel).
//    POST /api/troly   { viec, duLieu }            → sinh nội dung bằng AI
//    POST /api/troly   { viec: 'hoidap', turns }   → hỏi đáp tự do (có lịch sử)
//    GET  /api/troly                               → tình trạng cấu hình
//
//  ⚠️ MỖI LƯỢT GỌI ĐỀU TỐN TIỀN KHÓA API nên có HẠN MỨC theo ngày, đếm ở phía
//     máy chủ (api/_lib/hanMuc.js): khách 1 lượt/ngày, người đã đăng nhập
//     5 lượt/ngày. Người dùng gửi kèm Supabase access_token ở tiêu đề
//     Authorization thì được tính theo tài khoản; không có thẻ thì tính là khách.
// ============================================================================
import { askAI, hasAI, modelName, endpointHost } from './_lib/ai.js';
import { verifyUser, hasAuth } from './_lib/xacThuc.js';
import { VIEC, SYSTEM_HOI_DAP, docJsonVanBan, catNguCanh } from './_lib/vanBan.js';
import { gioiHanKhach, gioiHanNguoiDung, loiHetLuot, truMotLuot, xemHanMuc } from './_lib/hanMuc.js';

const MAX_TURNS = 10;          // giữ tối đa 10 lượt hội thoại gửi kèm
const MAX_TURN_CHARS = 6000;   // mỗi lượt cắt còn 6000 ký tự

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Trả kèm số lượt còn lại của CHÍNH người đang gọi để giao diện hiện ngay.
    const u = await verifyUser(req);
    const hm = await xemHanMuc(req, u);
    return res.status(200).json({
      ok: true,
      coAI: hasAI(), moHinh: hasAI() ? modelName() : '', mayChu: hasAI() ? endpointHost() : '',
      coXacThuc: hasAuth(),
      daDangNhap: !!u,
      hanMuc: { ...hm, khach: gioiHanKhach(), nguoiDung: gioiHanNguoiDung() },
      viec: Object.fromEntries(Object.entries(VIEC).map(([k, v]) => [k, v.ten])),
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST.' });

  if (!hasAI()) {
    return res.status(503).json({ error: 'Chưa cấu hình khóa AI trên máy chủ. Liên hệ Quản trị để khai biến ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY trên Vercel.' });
  }
  // Có thẻ đăng nhập hợp lệ thì tính theo tài khoản, không thì tính là khách.
  const user = await verifyUser(req);

  // Trừ lượt TRƯỚC khi gọi AI để tránh gọi vượt trần khi bấm liên tiếp.
  const hm = await truMotLuot(req, user);
  if (!hm.ok) {
    return res.status(429).json({ error: loiHetLuot(user, hm.gioiHan), hanMuc: hm, daDangNhap: !!user });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const viec = String(body.viec || '');
  const kem = { hanMuc: { daDung: hm.daDung, conLai: hm.conLai, gioiHan: hm.gioiHan }, daDangNhap: !!user };

  try {
    // ---- Hỏi đáp tự do: giữ lịch sử hội thoại do trình duyệt gửi lên --------
    if (viec === 'hoidap') {
      const turns = (Array.isArray(body.turns) ? body.turns : [])
        .slice(-MAX_TURNS)
        .map((t) => ({ role: t.role === 'assistant' ? 'assistant' : 'user', text: catNguCanh(t.text, MAX_TURN_CHARS) }))
        .filter((t) => t.text);
      if (!turns.length) return res.status(400).json({ error: 'Chưa có câu hỏi.' });
      const text = await askAI(SYSTEM_HOI_DAP, turns);
      return res.status(200).json({ text, moHinh: modelName(), ...kem });
    }

    // ---- Các việc nghiệp vụ: mỗi việc một lời nhắc -------------------------
    const def = VIEC[viec];
    if (!def) return res.status(400).json({ error: `Không có việc "${viec}".` });

    const prompt = def.build(body.duLieu || {});
    const text = await askAI(def.system, [{ role: 'user', text: prompt }]);

    if (def.json) {
      const json = docJsonVanBan(text);
      if (!json) return res.status(200).json({ text, json: null, canhBao: 'AI không trả về đúng dạng JSON — hiển thị nguyên văn để dùng tạm.', moHinh: modelName(), ...kem });
      return res.status(200).json({ json, moHinh: modelName(), ...kem });
    }
    return res.status(200).json({ text, moHinh: modelName(), ...kem });
  } catch (e) {
    console.error('troly:', e);
    return res.status(502).json({ error: `Máy chủ AI báo lỗi: ${String(e.message || e).slice(0, 300)}` });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
