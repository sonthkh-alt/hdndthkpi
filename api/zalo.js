// ============================================================================
//  BOT ZALO OFFICIAL ACCOUNT — webhook chạy trên Vercel.
//
//  Dùng chung "bộ não" với bot Telegram (api/_lib/brain.js) và chung sổ đăng ký
//  người dùng (api/_lib/users.js). Người dùng Zalo cũng phải được Quản trị duyệt;
//  yêu cầu duyệt được gửi sang TELEGRAM cho Quản trị bấm nút.
//
//  BA ĐƯỜNG DẪN (thay <secret> bằng ZALO_WEBHOOK_SECRET):
//    GET  /api/zalo                          → xem tình trạng cấu hình
//    GET  /api/zalo?auth=<secret>            → lấy đường dẫn xin quyền OA (mở 1 lần)
//    GET  /api/zalo?setup=<secret>&code=...  → Zalo gọi lại, đổi mã lấy token
//    POST /api/zalo?secret=<secret>          → ĐỊA CHỈ WEBHOOK khai ở developers.zalo.me
// ============================================================================
import { reply } from './_lib/brain.js';
import { userKey, getUser, register, spendQuota, describe, isOpen } from './_lib/users.js';
import { notifyNewUser, tgAdmins } from './_lib/notify.js';
import { hasZalo, appId, buildAuthUrl, exchangeCode, accessToken, sendText } from './_lib/zaloApi.js';

const WELCOME = 'Xin chào! Đây là trợ lý của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.\n\n'
  + 'Để sử dụng, quý vị vui lòng đăng ký một lần bằng cách gửi:\n'
  + '/dangky Họ và tên - Đơn vị công tác\n\n'
  + 'Ví dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách\n\n'
  + 'Sau khi được duyệt, quý vị sẽ nhận được thông báo và có thể đặt câu hỏi.';

/** Tách "Họ và tên - Đơn vị" từ lệnh /dangky (giống bên Telegram). */
export function parseDangKy(text) {
  const body = String(text || '').replace(/^\/\S+\s*/, '').trim();
  if (!body) return null;
  const parts = body.split(/\s*[-–—|,]\s*/).filter(Boolean);
  const name = (parts.shift() || '').trim();
  return name ? { name, unit: parts.join(' - ').trim() } : null;
}

const selfUrl = (req) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}/api/zalo`;
};

export default async function handler(req, res) {
  const secret = process.env.ZALO_WEBHOOK_SECRET || '';

  // ---- GET: cấu hình & chẩn đoán ------------------------------------------
  if (req.method === 'GET') {
    if (!hasZalo()) return res.status(500).json({ ok: false, error: 'Chưa khai ZALO_APP_ID / ZALO_APP_SECRET trên Vercel.' });
    const q = req.query || {};

    // Bước 1: lấy đường dẫn xin quyền (mở bằng tài khoản quản trị OA)
    if (q.auth) {
      if (!secret || q.auth !== secret) return res.status(403).json({ ok: false, error: 'Sai ZALO_WEBHOOK_SECRET.' });
      const url = await buildAuthUrl(`${selfUrl(req)}?setup=${encodeURIComponent(secret)}`);
      return res.status(200).json({ ok: true, moLienKetNay: url, ghiChu: 'Mở liên kết này bằng tài khoản quản trị OA, chọn OA rồi bấm Cho phép.' });
    }

    // Bước 2: Zalo gọi lại kèm code -> đổi lấy token
    if (q.setup) {
      if (!secret || q.setup !== secret) return res.status(403).json({ ok: false, error: 'Sai ZALO_WEBHOOK_SECRET.' });
      if (!q.code) return res.status(400).json({ ok: false, error: 'Thiếu tham số code. Hãy mở /api/zalo?auth=<secret> trước.' });
      try {
        await exchangeCode(String(q.code));
        return res.status(200).json({ ok: true, message: 'Đã lấy và lưu token của Zalo OA. Giờ khai địa chỉ webhook ở developers.zalo.me.' });
      } catch (e) { return res.status(500).json({ ok: false, error: String(e.message || e) }); }
    }

    let token = null; let tokenError = null;
    try { token = !!(await accessToken()); } catch (e) { tokenError = String(e.message || e); }
    return res.status(200).json({
      ok: true, appId: appId(), token, tokenError,
      webhookUrl: `${selfUrl(req)}${secret ? `?secret=${secret}` : ''}`,
      quanTriDuyetTren: `Telegram (${tgAdmins().length} tài khoản)`,
      moCuaDangKy: isOpen(),
      huongDan: 'Chưa có token thì mở /api/zalo?auth=<ZALO_WEBHOOK_SECRET> để xin quyền OA một lần.',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  // Zalo không gửi tiêu đề bí mật như Telegram -> đặt chuỗi bí mật ngay trong địa chỉ webhook.
  if (secret && String(req.query?.secret || '') !== secret) return res.status(401).json({ ok: false });

  // Luôn trả 200 để Zalo không gửi lại liên tục.
  try {
    const ev = req.body || {};
    const from = String(ev.sender?.id || '');
    const text = ev.message?.text;
    if (!from || !text || (ev.event_name && ev.event_name !== 'user_send_text')) return res.status(200).json({ ok: true });

    const key = userKey('zalo', from);
    const cmd = text.toLowerCase().split(/\s+/)[0];
    const u = await getUser(key);

    if (cmd === '/dangky') {
      if (u?.status === 'blocked') { await sendText(from, 'Yêu cầu của quý vị trước đây chưa được chấp thuận. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
      if (!isOpen()) { await sendText(from, 'Trợ lý đang tạm đóng đăng ký. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
      const info = parseDangKy(text);
      if (!info) { await sendText(from, 'Cú pháp: /dangky Họ và tên - Đơn vị công tác\nVí dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách'); return res.status(200).json({ ok: true }); }
      const rec = await register(key, { id: from, platform: 'zalo', name: info.name, unit: info.unit });
      if (rec.status === 'approved') await sendText(from, 'Quý vị đã được duyệt từ trước. Mời đặt câu hỏi.');
      else { await notifyNewUser(rec); await sendText(from, `Đã gửi yêu cầu tới Quản trị:\n${describe(rec)}\n\nQuý vị vui lòng chờ được duyệt, trợ lý sẽ nhắn lại ngay khi có kết quả.`); }
      return res.status(200).json({ ok: true });
    }

    if (!u) { await sendText(from, isOpen() ? WELCOME : 'Xin lỗi, trợ lý này hiện chỉ phục vụ một số tài khoản được chỉ định. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).'); return res.status(200).json({ ok: true }); }
    if (u.status === 'blocked') { await sendText(from, 'Xin lỗi, tài khoản của quý vị chưa được chấp thuận sử dụng trợ lý này. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).'); return res.status(200).json({ ok: true }); }
    if (u.status !== 'approved') { await sendText(from, `⏳ Yêu cầu của quý vị đang chờ Quản trị duyệt.\n${describe(u)}`); return res.status(200).json({ ok: true }); }

    // Lệnh nhanh không gọi AI nên không tính vào hạn mức ngày.
    const q = cmd.startsWith('/') ? { ok: true } : await spendQuota(key);
    if (!q.ok) { await sendText(from, `Quý vị đã dùng hết ${q.limit} lượt hỏi của hôm nay. Mời quay lại vào ngày mai, hoặc xem trực tiếp trên web: https://hdndthkpi.vercel.app`); return res.status(200).json({ ok: true }); }

    let answer;
    // Người dùng Zalo KHÔNG được coi là Quản trị -> không đọc được hồ sơ nhân sự.
    try { answer = await reply({ text, chatKey: `zalo:${from}`, isAdmin: false }); }
    catch (e) { answer = `Xin lỗi, tôi gặp trục trặc khi xử lý: ${String(e?.message || e).slice(0, 300)}`; }
    await sendText(from, answer);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('zalo handler:', e);
    return res.status(200).json({ ok: true });
  }
}
