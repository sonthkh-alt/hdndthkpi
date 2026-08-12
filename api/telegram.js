// ============================================================================
//  BOT TELEGRAM — điểm nhận tin nhắn (webhook) chạy trên Vercel.
//
//  BIẾN MÔI TRƯỜNG (Vercel -> Settings -> Environment Variables):
//    TELEGRAM_BOT_TOKEN        (bắt buộc) token do @BotFather cấp
//    TELEGRAM_ALLOWED_IDS      (bắt buộc) danh sách ID Telegram được phép hỏi, cách nhau dấu phẩy
//    TELEGRAM_ADMIN_IDS        (nên có)   ID được xem thêm số liệu nhân sự; bỏ trống thì lấy ID đầu tiên ở trên
//    TELEGRAM_WEBHOOK_SECRET   (nên có)   chuỗi bí mật tự đặt, dùng để đăng ký và kiểm tra webhook
//    SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY   để đọc số liệu
//    ANTHROPIC_API_KEY | GEMINI_API_KEY | OPENAI_API_KEY   khóa AI (chọn 1)
//
//  ĐĂNG KÝ WEBHOOK: mở trình duyệt tới
//    https://<tên-miền>/api/telegram?setup=<TELEGRAM_WEBHOOK_SECRET>
// ============================================================================
import { reply } from './_lib/brain.js';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const api = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`;
const idList = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

async function tg(method, body) {
  const r = await fetch(api(method), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.json().catch(() => ({}));
}

// Telegram giới hạn 4096 ký tự mỗi tin -> cắt theo dòng cho gọn.
function chunks(text, size = 3900) {
  const out = []; let buf = '';
  for (const line of String(text).split('\n')) {
    if ((buf + line).length > size) { if (buf) out.push(buf); buf = ''; }
    buf += (buf ? '\n' : '') + line.slice(0, size);
  }
  if (buf) out.push(buf);
  return out.length ? out : ['(trống)'];
}

export default async function handler(req, res) {
  // ---- GET: xem tình trạng / đăng ký webhook -------------------------------
  if (req.method === 'GET') {
    if (!TOKEN) return res.status(500).json({ ok: false, error: 'Chưa khai TELEGRAM_BOT_TOKEN trên Vercel.' });
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
    const want = String(req.query?.setup || '');
    if (want) {
      if (!secret || want !== secret) return res.status(403).json({ ok: false, error: 'Sai TELEGRAM_WEBHOOK_SECRET.' });
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const url = `${proto}://${host}/api/telegram`;
      const r = await tg('setWebhook', { url, secret_token: secret, allowed_updates: ['message'] });
      return res.status(200).json({ ok: !!r.ok, url, telegram: r });
    }
    const [me, info] = await Promise.all([
      fetch(api('getMe')).then((x) => x.json()).catch(() => ({})),
      fetch(api('getWebhookInfo')).then((x) => x.json()).catch(() => ({})),
    ]);
    return res.status(200).json({
      ok: true,
      bot: me.result?.username || null,
      webhook: info.result?.url || null,
      pending: info.result?.pending_update_count ?? null,
      lastError: info.result?.last_error_message || null,
      allowedIds: idList(process.env.TELEGRAM_ALLOWED_IDS).length,
      huongDan: 'Thêm ?setup=<TELEGRAM_WEBHOOK_SECRET> vào địa chỉ này để đăng ký webhook.',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  // Telegram gắn chuỗi bí mật vào tiêu đề -> chặn người lạ gọi thẳng vào hàm này.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) return res.status(401).json({ ok: false });

  // Luôn trả 200 cho Telegram, nếu không nó sẽ gửi lại liên tục.
  try {
    const msg = req.body?.message;
    const text = msg?.text;
    const chatId = msg?.chat?.id;
    if (!text || !chatId) return res.status(200).json({ ok: true });

    const from = String(msg.from?.id || chatId);
    const allowed = idList(process.env.TELEGRAM_ALLOWED_IDS);
    const admins = idList(process.env.TELEGRAM_ADMIN_IDS);

    if (!allowed.length) {
      await tg('sendMessage', {
        chat_id: chatId,
        text: `Bot chưa được cấu hình danh sách người dùng.\n\nID Telegram của đồng chí là: ${from}\n\n`
          + 'Hãy vào Vercel → Settings → Environment Variables, đặt TELEGRAM_ALLOWED_IDS = ID này '
          + '(nhiều người thì cách nhau dấu phẩy), rồi triển khai lại (Redeploy).',
      });
      return res.status(200).json({ ok: true });
    }
    if (!allowed.includes(from)) {
      await tg('sendMessage', { chat_id: chatId, text: 'Xin lỗi, tài khoản của bạn chưa được cấp quyền sử dụng trợ lý này. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.' });
      return res.status(200).json({ ok: true });
    }

    const isAdmin = admins.length ? admins.includes(from) : from === allowed[0];
    await tg('sendChatAction', { chat_id: chatId, action: 'typing' });

    let answer;
    try {
      answer = await reply({ text, chatKey: `tg:${chatId}`, isAdmin });
    } catch (e) {
      answer = `Xin lỗi, tôi gặp trục trặc khi xử lý: ${String(e?.message || e).slice(0, 300)}`;
    }
    for (const part of chunks(answer)) {
      await tg('sendMessage', { chat_id: chatId, text: part, disable_web_page_preview: true });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('telegram handler:', e);
    return res.status(200).json({ ok: true });
  }
}
