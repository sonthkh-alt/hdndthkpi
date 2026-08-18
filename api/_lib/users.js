// ============================================================================
//  SỔ ĐĂNG KÝ NGƯỜI DÙNG BOT — dòng app_state id='bot_users'.
//
//  Bot mở cho MỌI NGƯỜI nhắn tới, nhưng phải được Quản trị DUYỆT mới hỏi được.
//  Vòng đời một người dùng:
//     (chưa có)  →  /dangky  →  pending  →  Quản trị bấm Đồng ý  →  approved
//                                       →  Quản trị bấm Từ chối  →  blocked
//  Khóa bản ghi dạng "<nền tảng>:<id>" (vd 'tg:123456789') để sau này dùng
//  chung cho Zalo OA mà không đụng nhau.
// ============================================================================
import { getRow, putRow } from './store.js';

const ROW = 'bot_users';
export const userKey = (platform, id) => `${platform}:${id}`;

/** Số câu hỏi tối đa mỗi người mỗi ngày (chặn tốn phí AI). Quản trị không bị giới hạn. */
export const DAILY_LIMIT = Number(process.env.BOT_DAILY_LIMIT || 30);
/** Đặt TELEGRAM_OPEN=0 để quay về chế độ chỉ danh sách trắng (không cho đăng ký mới). */
export const isOpen = () => String(process.env.TELEGRAM_OPEN ?? '1') !== '0';

// Mốc đặt lại hạn mức là 0 giờ GIỜ VIỆT NAM (UTC+7) — dùng giờ UTC thì hạn mức
// đặt lại lúc 7 giờ sáng, giống cách api/_lib/hanMuc.js tính cho Trợ lý AI.
const today = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
const readAll = async () => {
  try { const row = await getRow(ROW); return (row?.data?.users && typeof row.data.users === 'object') ? row.data.users : {}; }
  catch { return {}; }
};

export async function getUser(key) {
  const users = await readAll();
  return users[key] || null;
}

export async function listUsers(status) {
  const users = await readAll();
  return Object.entries(users)
    .map(([key, u]) => ({ key, ...u }))
    .filter((u) => !status || u.status === status)
    .sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
}

/** Ghi đè/bổ sung một bản ghi người dùng (đọc – sửa – ghi cả dòng). */
export async function saveUser(key, patch) {
  const users = await readAll();
  const next = { ...(users[key] || {}), ...patch, key };
  users[key] = next;
  await putRow(ROW, { users });
  return next;
}

/** Người mới xin dùng bot. Giữ nguyên trạng thái nếu đã được duyệt/đã bị chặn. */
export async function register(key, { id, platform, name, unit, username }) {
  const cur = await getUser(key);
  if (cur && cur.status === 'blocked') return cur;
  return saveUser(key, {
    id: String(id), platform, username: username || '',
    name: String(name || '').trim(), unit: String(unit || '').trim(),
    status: cur?.status === 'approved' ? 'approved' : 'pending',
    at: new Date().toISOString(),
  });
}

export const approve = (key, by) => saveUser(key, { status: 'approved', by: String(by || ''), decidedAt: new Date().toISOString() });
export const block = (key, by) => saveUser(key, { status: 'blocked', by: String(by || ''), decidedAt: new Date().toISOString() });

/**
 * Đếm lượt hỏi trong ngày. Trả { ok, used, limit }.
 * Vượt hạn mức thì trả ok=false để nơi gọi báo lại người dùng.
 */
/** Xóa bộ đếm lượt hỏi trong ngày của một người (Quản trị dùng khi họ bị trừ oan). */
export async function resetQuota(key) {
  const u = await getUser(key);
  if (!u) return null;
  await saveUser(key, { day: '', count: 0 });
  return u;
}

export async function spendQuota(key, limit = DAILY_LIMIT) {
  const u = await getUser(key);
  const d = today();
  const used = (u?.day === d ? Number(u.count || 0) : 0) + 1;
  await saveUser(key, { day: d, count: used, lastAt: new Date().toISOString() });
  return { ok: used <= limit, used, limit };
}

/** Mô tả gọn một người dùng để hiện trong tin nhắn cho Quản trị. */
export const describe = (u) => [
  u.name || '(chưa khai tên)',
  u.unit ? `· ${u.unit}` : '',
  u.username ? `· @${u.username}` : '',
  `· ID ${u.id}`,
].filter(Boolean).join(' ');
