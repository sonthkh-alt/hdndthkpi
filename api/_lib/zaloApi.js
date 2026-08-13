// ============================================================================
//  ĐẦU NỐI ZALO OFFICIAL ACCOUNT (OA)
//
//  Khác Telegram ở chỗ: Zalo KHÔNG cấp token vĩnh viễn. Phải xin quyền một lần
//  qua OAuth để lấy access_token (hạn ngắn, khoảng 1 giờ) + refresh_token
//  (hạn dài). Mỗi lần làm mới, Zalo trả về refresh_token MỚI nên phải lưu lại,
//  nếu không lần sau sẽ hỏng. Cặp token lưu ở dòng app_state id='zalo_token'.
//
//  BIẾN MÔI TRƯỜNG:
//    ZALO_APP_ID, ZALO_APP_SECRET   — từ developers.zalo.me (ứng dụng đã gắn OA)
//    ZALO_WEBHOOK_SECRET            — chuỗi bí mật tự đặt, gắn vào URL webhook
//    ZALO_REFRESH_TOKEN             — (tùy chọn) dán tay lần đầu thay cho OAuth
//
//  Tài liệu chính thức đổi theo thời kỳ — nếu Zalo đổi đường dẫn hoặc chính sách,
//  sửa 3 hằng số URL bên dưới là đủ.
// ============================================================================
import { createHash, randomBytes } from 'node:crypto';
import { getRow, putRow } from './store.js';

const OAUTH_TOKEN_URL = 'https://oauth.zaloapp.com/v4/oa/access_token';
const OAUTH_PERMISSION_URL = 'https://oauth.zaloapp.com/v4/oa/permission';
const OPENAPI = 'https://openapi.zalo.me/v3.0/oa';
const ROW = 'zalo_token';

export const appId = () => process.env.ZALO_APP_ID || '';
export const appSecret = () => process.env.ZALO_APP_SECRET || '';
export const hasZalo = () => !!(appId() && appSecret());

const b64url = (buf) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/**
 * Tạo cặp PKCE và đường dẫn xin quyền — mở đường dẫn này bằng tài khoản quản trị OA.
 * ⚠️ `redirectUri` phải KHÔNG có tham số truy vấn và phải thuộc domain đã xác thực
 *    ở developers.zalo.me, nếu không Zalo trả lỗi -14003 "Invalid redirect uri".
 *    Chuỗi bí mật gửi kèm qua tham số `state` (Zalo trả lại nguyên vẹn khi gọi ngược).
 */
export async function buildAuthUrl(redirectUri, state = '') {
  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash('sha256').update(verifier).digest());
  const row = await getRow(ROW).catch(() => null);
  await putRow(ROW, { ...(row?.data || {}), verifier });
  const q = new URLSearchParams({
    app_id: appId(), redirect_uri: String(redirectUri).split('?')[0],
    code_challenge: challenge, state: state || 'hdndkpi',
  });
  return `${OAUTH_PERMISSION_URL}?${q}`;
}

async function tokenRequest(form) {
  const r = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', secret_key: appSecret() },
    body: new URLSearchParams(form).toString(),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.access_token) throw new Error(`Zalo OAuth: ${JSON.stringify(d).slice(0, 300)}`);
  return d;
}

const store = async (d) => {
  await putRow(ROW, {
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    // trừ hao 5 phút để không dùng token sắp hết hạn
    expiresAt: Date.now() + (Number(d.expires_in || 3600) * 1000) - 5 * 60 * 1000,
    at: new Date().toISOString(),
  });
  return d.access_token;
};

/** Đổi mã ủy quyền (code) lấy cặp token — gọi một lần sau khi xin quyền. */
export async function exchangeCode(code) {
  const row = await getRow(ROW).catch(() => null);
  return store(await tokenRequest({
    code, app_id: appId(), grant_type: 'authorization_code',
    ...(row?.data?.verifier ? { code_verifier: row.data.verifier } : {}),
  }));
}

/** Lấy access_token còn hạn; hết hạn thì tự làm mới bằng refresh_token. */
export async function accessToken() {
  const row = await getRow(ROW).catch(() => null);
  const d = row?.data || {};
  if (d.access_token && d.expiresAt && Date.now() < d.expiresAt) return d.access_token;

  const refresh = d.refresh_token || process.env.ZALO_REFRESH_TOKEN || '';
  if (!refresh) throw new Error('Chưa có refresh_token của Zalo OA — mở /api/zalo?auth=<ZALO_WEBHOOK_SECRET> để xin quyền một lần.');
  return store(await tokenRequest({ refresh_token: refresh, app_id: appId(), grant_type: 'refresh_token' }));
}

/** Zalo giới hạn độ dài mỗi tin — cắt theo dòng cho gọn. */
export function zaloChunks(text, size = 1900) {
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

/** Gửi tin nhắn tư vấn tới một người dùng Zalo. */
export async function sendText(userId, text) {
  const token = await accessToken();
  for (const part of zaloChunks(text)) {
    const r = await fetch(`${OPENAPI}/message/cs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: token },
      body: JSON.stringify({ recipient: { user_id: String(userId) }, message: { text: part } }),
    });
    const d = await r.json().catch(() => ({}));
    // error 0 = thành công. Các mã khác thường do hết cửa sổ trả lời hoặc token hỏng.
    if (d.error && d.error !== 0) throw new Error(`Zalo gửi tin lỗi ${d.error}: ${d.message || ''}`);
  }
}
