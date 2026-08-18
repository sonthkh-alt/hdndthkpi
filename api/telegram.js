// ============================================================================
//  BOT TELEGRAM — điểm nhận tin nhắn (webhook) chạy trên Vercel.
//
//  AI CŨNG NHẮN ĐƯỢC, NHƯNG PHẢI ĐƯỢC QUẢN TRỊ DUYỆT MỚI HỎI ĐƯỢC:
//    người lạ nhắn tới -> bot mời khai họ tên + đơn vị bằng lệnh /dangky
//    -> bot chuyển cho Quản trị kèm 2 nút [Đồng ý] [Từ chối]
//    -> Quản trị bấm nút -> bot báo lại cho người đăng ký.
//  Đặt TELEGRAM_OPEN=0 nếu muốn quay về chế độ CHỈ danh sách trắng.
//
//  BIẾN MÔI TRƯỜNG (Vercel -> Settings -> Environment Variables):
//    TELEGRAM_BOT_TOKEN        (bắt buộc) token do @BotFather cấp
//    TELEGRAM_ADMIN_IDS        (bắt buộc) ID Quản trị — người DUYỆT và được xem số liệu nhân sự
//    TELEGRAM_ALLOWED_IDS      (tùy chọn) ID được dùng ngay, không cần đăng ký
//    TELEGRAM_WEBHOOK_SECRET   (nên có)   chuỗi bí mật tự đặt, dùng để đăng ký và kiểm tra webhook
//    BOT_DAILY_LIMIT           (tùy chọn) số câu hỏi tối đa mỗi người mỗi ngày, mặc định 30
//    SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (hoặc SUPABASE_SECRET_KEY)   để đọc số liệu
//    ANTHROPIC_API_KEY | GEMINI_API_KEY | OPENAI_API_KEY   khóa AI (chọn 1)
//
//  ĐĂNG KÝ WEBHOOK: mở trình duyệt tới
//    https://<tên-miền>/api/telegram?setup=<TELEGRAM_WEBHOOK_SECRET>
//  ⚠️ Sau khi cập nhật lên bản có nút duyệt, PHẢI mở lại địa chỉ này một lần
//     để Telegram bắt đầu gửi cả sự kiện bấm nút (callback_query).
// ============================================================================
import { reply } from './_lib/brain.js';
import {
  userKey, getUser, register, approve, block, listUsers, spendQuota, resetQuota, describe, isOpen, DAILY_LIMIT,
} from './_lib/users.js';
import { notifyNewUser, notifyUser } from './_lib/notify.js';
import { claimOnce, purgeClaims } from './_lib/store.js';

// Tiền tố dòng "giành chỗ" chống xử lý lặp (xem api/_lib/store.js). Dùng chung với Zalo.
const CLAIM = 'bot_seen_tg_';
const CLAIM_ALL = 'bot_seen_';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const api = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`;
const idList = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

async function tg(method, body) {
  const r = await fetch(api(method), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.json().catch(() => ({}));
}
const say = (chatId, text, extra = {}) => tg('sendMessage', { chat_id: chatId, text, disable_web_page_preview: true, ...extra });

// Telegram giới hạn 4096 ký tự mỗi tin -> cắt theo dòng cho gọn.
function chunks(text, size = 3900) {
  const out = []; let buf = '';
  for (const line of String(text).split('\n')) {
    const piece = line.slice(0, size);
    // +1 cho ký tự xuống dòng khi nối, để mỗi mẩu chắc chắn KHÔNG vượt `size`.
    if (buf && buf.length + 1 + piece.length > size) { out.push(buf); buf = ''; }
    buf = buf ? `${buf}\n${piece}` : piece;
  }
  if (buf) out.push(buf);
  return out.length ? out : ['(trống)'];
}

const adminsOf = () => {
  const a = idList(process.env.TELEGRAM_ADMIN_IDS);
  return a.length ? a : idList(process.env.TELEGRAM_ALLOWED_IDS).slice(0, 1);
};

const WELCOME = 'Xin chào! Đây là trợ lý của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.\n\n'
  + 'Để sử dụng, đồng chí vui lòng đăng ký một lần bằng cách gửi:\n'
  + '/dangky Họ và tên - Đơn vị công tác\n\n'
  + 'Ví dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách\n\n'
  + 'Sau khi Quản trị duyệt, đồng chí sẽ nhận được thông báo và có thể hỏi bất cứ điều gì.';

/** Tách "Họ và tên - Đơn vị" từ lệnh /dangky. */
export function parseDangKy(text) {
  const body = String(text || '').replace(/^\/\S+\s*/, '').trim();
  if (!body) return null;
  const parts = body.split(/\s*[-–—|,]\s*/).filter(Boolean);
  const name = (parts.shift() || '').trim();
  if (!name) return null;
  return { name, unit: parts.join(' - ').trim() };
}

const OK_TEXT = '✅ Đồng chí đã được duyệt sử dụng trợ lý. Mời đặt câu hỏi, gõ /help để xem gợi ý.';
const NO_TEXT = '⛔ Rất tiếc, yêu cầu sử dụng trợ lý chưa được chấp thuận. Đồng chí vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).';

/**
 * Xử lý bấm nút Đồng ý / Từ chối — dùng cho người dùng của CẢ Telegram lẫn Zalo.
 * callback_data: 'ok:<nền tảng>:<id>'. Dạng cũ 'ok:<id>' vẫn hiểu là Telegram.
 */
async function onCallback(cq) {
  const from = String(cq.from?.id || '');
  const parts = String(cq.data || '').split(':');
  const act = parts[0];
  const platform = parts.length >= 3 ? parts[1] : 'tg';
  const id = parts.length >= 3 ? parts.slice(2).join(':') : parts[1];
  const ans = (text) => tg('answerCallbackQuery', { callback_query_id: cq.id, text, show_alert: false });

  if (!adminsOf().includes(from)) return ans('Chỉ Quản trị mới duyệt được.');
  if (!id || !['ok', 'no'].includes(act)) return ans('Yêu cầu không hợp lệ.');

  const key = userKey(platform, id);
  await (act === 'ok' ? approve(key, from) : block(key, from));
  const verdict = act === 'ok' ? '✅ ĐÃ DUYỆT' : '⛔ ĐÃ TỪ CHỐI';

  await ans(act === 'ok' ? 'Đã duyệt.' : 'Đã từ chối.');
  if (cq.message) {
    await tg('editMessageText', {
      chat_id: cq.message.chat.id, message_id: cq.message.message_id,
      text: `${cq.message.text}\n\n${verdict} — bởi ID ${from}`,
    });
  }
  await notifyUser(platform, id, act === 'ok' ? OK_TEXT : NO_TEXT);
}

/** Lệnh quản lý người dùng dành cho Quản trị (dự phòng khi không bấm được nút). */
async function adminCommand(cmd, text, chatId, from) {
  if (cmd === '/danhsach') {
    const all = await listUsers();
    const grp = (s) => all.filter((u) => u.status === s);
    const P = { tg: 'Telegram', zalo: 'Zalo' };
    const fmt = (list) => (list.length ? list.map((u) => `• [${P[u.platform] || u.platform}] ${describe(u)} — mã: ${u.key}`).join('\n') : '(không có)');
    await say(chatId, `👥 Người dùng trợ lý\n\nCHỜ DUYỆT (${grp('pending').length}):\n${fmt(grp('pending'))}\n\n`
      + `ĐÃ DUYỆT (${grp('approved').length}):\n${fmt(grp('approved'))}\n\n`
      + `BỊ TỪ CHỐI (${grp('blocked').length}):\n${fmt(grp('blocked'))}\n\n`
      + 'Duyệt/từ chối bằng: /duyet <mã> hoặc /tuchoi <mã> (mã dạng tg:123 hoặc zalo:abc; gõ trống nền tảng thì hiểu là Telegram).\n'
      + 'Mở lại lượt hỏi trong ngày: /moluot <mã>.');
    return true;
  }
  if (cmd === '/moluot') {
    const arg = (text.split(/\s+/)[1] || '').trim();
    if (!arg) { await say(chatId, 'Cú pháp: /moluot <mã> — ví dụ /moluot zalo:abc. Xóa bộ đếm lượt hỏi trong ngày của người đó.'); return true; }
    const [p0, ...rest0] = arg.split(':');
    const key = userKey(rest0.length ? p0 : 'tg', rest0.length ? rest0.join(':') : arg);
    const u = await resetQuota(key);
    await say(chatId, u ? `♻️ Đã mở lại ${DAILY_LIMIT} lượt hỏi hôm nay cho ${key}.` : `Không tìm thấy người dùng ${key}. Xem /danhsach.`);
    return true;
  }
  if (cmd === '/duyet' || cmd === '/tuchoi') {
    const arg = (text.split(/\s+/)[1] || '').trim();
    if (!arg) { await say(chatId, `Cú pháp: ${cmd} <mã> — ví dụ ${cmd} tg:123456789 hoặc ${cmd} zalo:abc. Xem danh sách bằng /danhsach.`); return true; }
    // Chấp nhận cả 'tg:123', 'zalo:abc' lẫn '123' (mặc định Telegram).
    const [p, ...rest] = arg.split(':');
    const platform = rest.length ? p : 'tg';
    const id = rest.length ? rest.join(':') : arg;
    const key = userKey(platform, id);
    if (cmd === '/duyet') { await approve(key, from); await say(chatId, `✅ Đã duyệt ${key}.`); await notifyUser(platform, id, OK_TEXT); }
    else { await block(key, from); await say(chatId, `⛔ Đã từ chối ${key}.`); await notifyUser(platform, id, NO_TEXT); }
    return true;
  }
  return false;
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
      // callback_query = sự kiện bấm nút Đồng ý / Từ chối.
      const r = await tg('setWebhook', { url, secret_token: secret, allowed_updates: ['message', 'callback_query'] });
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
      moCuaDangKy: isOpen(),
      hanMucMoiNgay: DAILY_LIMIT,
      soQuanTri: adminsOf().length,
      huongDan: 'Thêm ?setup=<TELEGRAM_WEBHOOK_SECRET> vào địa chỉ này để đăng ký webhook.',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  // Telegram gắn chuỗi bí mật vào tiêu đề -> chặn người lạ gọi thẳng vào hàm này.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) return res.status(401).json({ ok: false });

  // Luôn trả 200 cho Telegram, nếu không nó sẽ gửi lại liên tục.
  try {
    // Telegram gửi LẠI nguyên update khi lần trước chưa kịp trả 200 (một lượt hỏi AI mất
    // nhiều giây) -> chốt theo update_id để không trả lời/duyệt hai lần. Xem `claimOnce`.
    const upd = req.body?.update_id;
    if (upd != null) {
      let lanDau = true;
      try { lanDau = await claimOnce(`${CLAIM}${upd}`, { at: new Date().toISOString() }); }
      catch { lanDau = true; }   // kho dữ liệu trục trặc thì thà trả lời hơn là im lặng
      if (!lanDau) return res.status(200).json({ ok: true, boQua: 'update trùng' });
    }

    if (req.body?.callback_query) { await onCallback(req.body.callback_query); return res.status(200).json({ ok: true }); }

    const msg = req.body?.message;
    const text = msg?.text;
    const chatId = msg?.chat?.id;
    if (!text || !chatId) return res.status(200).json({ ok: true });

    const from = String(msg.from?.id || chatId);
    const admins = adminsOf();
    const bootstrap = idList(process.env.TELEGRAM_ALLOWED_IDS);
    const cmd = text.toLowerCase().split(/[\s@]/)[0];

    // Chưa khai Quản trị thì không ai duyệt được -> mách ID để cấu hình.
    if (!admins.length) {
      await say(chatId, `Bot chưa được cấu hình người quản trị.\n\nID Telegram của đồng chí là: ${from}\n\n`
        + 'Hãy vào Vercel → Settings → Environment Variables, đặt TELEGRAM_ADMIN_IDS = ID này '
        + '(nhiều người thì cách nhau dấu phẩy), rồi triển khai lại (Redeploy).');
      return res.status(200).json({ ok: true });
    }

    const isAdmin = admins.includes(from);
    if (isAdmin && await adminCommand(cmd, text, chatId, from)) return res.status(200).json({ ok: true });

    // ---- Kiểm soát quyền dùng ---------------------------------------------
    const key = userKey('tg', from);
    const preApproved = isAdmin || bootstrap.includes(from);
    if (!preApproved) {
      const u = await getUser(key);

      if (cmd === '/dangky') {
        if (u?.status === 'blocked') { await say(chatId, 'Yêu cầu của đồng chí trước đây chưa được chấp thuận. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
        if (!isOpen()) { await say(chatId, 'Trợ lý đang tạm đóng đăng ký. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
        const info = parseDangKy(text);
        if (!info) { await say(chatId, 'Cú pháp: /dangky Họ và tên - Đơn vị công tác\nVí dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách'); return res.status(200).json({ ok: true }); }
        const rec = await register(key, { id: from, platform: 'tg', username: msg.from?.username, ...info });
        if (rec.status === 'approved') await say(chatId, 'Đồng chí đã được duyệt từ trước. Mời đặt câu hỏi.');
        else { await notifyNewUser(rec); await say(chatId, `Đã gửi yêu cầu tới Quản trị:\n${describe(rec)}\n\nĐồng chí vui lòng chờ được duyệt, bot sẽ nhắn lại ngay khi có kết quả.`); }
        return res.status(200).json({ ok: true });
      }

      if (!u) {
        await say(chatId, isOpen() ? WELCOME
          : 'Xin lỗi, trợ lý này hiện chỉ phục vụ một số tài khoản được chỉ định. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).');
        return res.status(200).json({ ok: true });
      }
      if (u.status === 'blocked') {
        await say(chatId, 'Xin lỗi, tài khoản của đồng chí chưa được chấp thuận sử dụng trợ lý này. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).');
        return res.status(200).json({ ok: true });
      }
      if (u.status !== 'approved') {
        await say(chatId, `⏳ Yêu cầu của đồng chí đang chờ Quản trị duyệt.\n${describe(u)}\n\nKhai lại thông tin bằng: /dangky Họ và tên - Đơn vị`);
        return res.status(200).json({ ok: true });
      }

      // Hạn mức mỗi ngày — chặn chi phí AI khi mở cho nhiều người.
      // Các lệnh nhanh (/help, /solieu, /trangthai…) KHÔNG gọi AI nên không tính lượt.
      const q = cmd.startsWith('/') ? { ok: true } : await spendQuota(key);
      if (!q.ok) {
        await say(chatId, `Đồng chí đã dùng hết ${q.limit} lượt hỏi của hôm nay. Mời quay lại vào ngày mai, hoặc xem trực tiếp trên web: https://hdndthkpi.vercel.app`);
        return res.status(200).json({ ok: true });
      }
    }

    await tg('sendChatAction', { chat_id: chatId, action: 'typing' });

    let answer;
    try {
      answer = await reply({ text, chatKey: `tg:${chatId}`, isAdmin });
    } catch (e) {
      answer = `Xin lỗi, tôi gặp trục trặc khi xử lý: ${String(e?.message || e).slice(0, 300)}`;
    }
    for (const part of chunks(answer)) await say(chatId, part);
    // Dọn dòng "giành chỗ" quá 1 ngày — làm SAU khi đã trả lời nên không kéo dài chờ đợi.
    try { await purgeClaims(CLAIM_ALL); } catch { /* bỏ qua */ }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('telegram handler:', e);
    return res.status(200).json({ ok: true });
  }
}
