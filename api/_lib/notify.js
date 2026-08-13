// ============================================================================
//  BÁO CHO QUẢN TRỊ qua Telegram — dùng chung cho bot Telegram và bot Zalo.
//  Quản trị duyệt người dùng của CẢ HAI nền tảng ngay trong Telegram
//  (Zalo OA không có nút bấm dạng inline keyboard tiện như vậy).
// ============================================================================
import { describe } from './users.js';

export const tgAdmins = () => {
  const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
  const a = list(process.env.TELEGRAM_ADMIN_IDS);
  return a.length ? a : list(process.env.TELEGRAM_ALLOWED_IDS).slice(0, 1);
};

export async function tgCall(method, body) {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!token) return { ok: false };
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return r.json().catch(() => ({}));
}

export const tgSay = (chatId, text, extra = {}) =>
  tgCall('sendMessage', { chat_id: chatId, text, disable_web_page_preview: true, ...extra });

const PLATFORM = { tg: 'Telegram', zalo: 'Zalo' };

/** Gửi yêu cầu duyệt kèm 2 nút bấm tới mọi Quản trị. */
export async function notifyNewUser(u) {
  const text = `🔔 Có người xin sử dụng trợ lý (${PLATFORM[u.platform] || u.platform}):\n\n${describe(u)}\n\nĐồng chí duyệt giúp:`;
  const reply_markup = {
    inline_keyboard: [[
      { text: '✅ Đồng ý', callback_data: `ok:${u.platform}:${u.id}` },
      { text: '⛔ Từ chối', callback_data: `no:${u.platform}:${u.id}` },
    ]],
  };
  for (const a of tgAdmins()) await tgSay(a, text, { reply_markup });
}

/** Nhắn cho người dùng trên ĐÚNG nền tảng của họ (dùng khi báo kết quả duyệt). */
export async function notifyUser(platform, id, text) {
  if (platform === 'zalo') {
    // Nạp theo nhu cầu để luồng Telegram không phải kéo theo mã Zalo.
    try { const { sendText } = await import('./zaloApi.js'); await sendText(id, text); }
    catch (e) { console.warn('notifyUser zalo:', e?.message || e); }
    return;
  }
  await tgSay(id, text);
}
