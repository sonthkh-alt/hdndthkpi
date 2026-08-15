// ============================================================================
//  HÀM API của phân hệ "TRỢ LÝ AI NGHIỆP VỤ DÂN CỬ" (chỉ chạy trên Vercel).
//    POST /api/troly   { viec, duLieu }            → sinh nội dung bằng AI
//    POST /api/troly   { viec: 'hoidap', turns }   → hỏi đáp tự do (có lịch sử)
//    GET  /api/troly                               → tình trạng cấu hình
//
//  ⚠️ MỖI LƯỢT GỌI ĐỀU TỐN TIỀN KHÓA API nên chỉ phục vụ người ĐÃ ĐĂNG NHẬP
//     (Supabase access_token gửi kèm ở tiêu đề Authorization). Khách xem thử và
//     chế độ "Quản trị cục bộ" không có thẻ này nên bị từ chối với mã 401.
// ============================================================================
import { askAI, hasAI, modelName, endpointHost } from './_lib/ai.js';
import { verifyUser, hasAuth, bearerOf } from './_lib/xacThuc.js';
import { VIEC, SYSTEM_HOI_DAP, docJsonVanBan, catNguCanh } from './_lib/vanBan.js';

const MAX_TURNS = 10;          // giữ tối đa 10 lượt hội thoại gửi kèm
const MAX_TURN_CHARS = 6000;   // mỗi lượt cắt còn 6000 ký tự

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      coAI: hasAI(), moHinh: hasAI() ? modelName() : '', mayChu: hasAI() ? endpointHost() : '',
      coXacThuc: hasAuth(),
      viec: Object.fromEntries(Object.entries(VIEC).map(([k, v]) => [k, v.ten])),
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST.' });

  if (!hasAI()) {
    return res.status(503).json({ error: 'Chưa cấu hình khóa AI trên máy chủ. Liên hệ Quản trị để khai biến ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY trên Vercel.' });
  }
  if (!hasAuth()) {
    return res.status(503).json({ error: 'Máy chủ chưa cấu hình SUPABASE_URL để kiểm tra đăng nhập.' });
  }
  if (!bearerOf(req)) {
    return res.status(401).json({ error: 'Chức năng AI chỉ dành cho người đã đăng nhập bằng tài khoản cơ quan. Vui lòng đăng nhập rồi thử lại.' });
  }
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const viec = String(body.viec || '');

  try {
    // ---- Hỏi đáp tự do: giữ lịch sử hội thoại do trình duyệt gửi lên --------
    if (viec === 'hoidap') {
      const turns = (Array.isArray(body.turns) ? body.turns : [])
        .slice(-MAX_TURNS)
        .map((t) => ({ role: t.role === 'assistant' ? 'assistant' : 'user', text: catNguCanh(t.text, MAX_TURN_CHARS) }))
        .filter((t) => t.text);
      if (!turns.length) return res.status(400).json({ error: 'Chưa có câu hỏi.' });
      const text = await askAI(SYSTEM_HOI_DAP, turns);
      return res.status(200).json({ text, moHinh: modelName() });
    }

    // ---- Các việc nghiệp vụ: mỗi việc một lời nhắc -------------------------
    const def = VIEC[viec];
    if (!def) return res.status(400).json({ error: `Không có việc "${viec}".` });

    const prompt = def.build(body.duLieu || {});
    const text = await askAI(def.system, [{ role: 'user', text: prompt }]);

    if (def.json) {
      const json = docJsonVanBan(text);
      if (!json) return res.status(200).json({ text, json: null, canhBao: 'AI không trả về đúng dạng JSON — hiển thị nguyên văn để dùng tạm.', moHinh: modelName() });
      return res.status(200).json({ json, moHinh: modelName() });
    }
    return res.status(200).json({ text, moHinh: modelName() });
  } catch (e) {
    console.error('troly:', e);
    return res.status(502).json({ error: `Máy chủ AI báo lỗi: ${String(e.message || e).slice(0, 300)}` });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
