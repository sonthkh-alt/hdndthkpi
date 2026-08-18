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
// Zalo có 2 đời API gửi tin. OA nào không dùng được đời v3 sẽ trả lỗi -235
// ("This API does not support this type of OA") -> thử tiếp đời v2 rồi mới báo lỗi.
const SEND_ENDPOINTS = [
  { url: 'https://openapi.zalo.me/v3.0/oa/message/cs', ten: 'v3.0/message/cs', tokenO: 'header' },
  // v2.0 cũng đòi access_token đặt ở TIÊU ĐỀ (lỗi -216 nếu để ở tham số truy vấn).
  { url: 'https://openapi.zalo.me/v2.0/oa/message', ten: 'v2.0/message', tokenO: 'header' },
];
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
export async function accessToken(row0) {
  const row = row0 !== undefined ? row0 : await getRow(ROW).catch(() => null);
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

/** Gửi MỘT mẩu tin qua một đầu nối cụ thể. Trả về mã lỗi Zalo (0 = thành công). */
async function sendOne(ep, token, userId, part) {
  const url = ep.tokenO === 'query' ? `${ep.url}?access_token=${encodeURIComponent(token)}` : ep.url;
  const headers = { 'Content-Type': 'application/json', ...(ep.tokenO === 'header' ? { access_token: token } : {}) };
  const r = await fetch(url, {
    method: 'POST', headers,
    body: JSON.stringify({ recipient: { user_id: String(userId) }, message: { text: part } }),
  });
  const d = await r.json().catch(() => ({}));
  return { code: Number(d.error || 0), message: d.message || '' };
}

/**
 * Gửi tin nhắn tới một người dùng Zalo. Trả về TÊN đầu nối đã dùng (để ghi nhật ký).
 * Thử lần lượt các đầu nối; CHỈ khi đầu nối trả -235 (loại OA không hỗ trợ) mới thử đầu kế.
 * Đầu nối nào chạy được sẽ được nhớ lại để các mẩu sau gửi thẳng, không thử lại từ đầu.
 */
export async function sendText(userId, text) {
  // Đọc dòng zalo_token MỘT lần rồi dùng cho cả token lẫn đầu nối đã ghi nhớ.
  const row = await getRow(ROW).catch(() => null);
  const token = await accessToken(row);
  // OA của Văn phòng chỉ gửi được bằng v2.0 -> thử v3.0 trước là phí một vòng gọi mạng
  // cho MỌI câu trả lời. Nhớ đầu nối đã chạy được và ưu tiên dùng lại.
  const daBiet = row?.data?.epTen || '';
  const thuTu = daBiet ? [...SEND_ENDPOINTS].sort((a, b) => (b.ten === daBiet) - (a.ten === daBiet)) : SEND_ENDPOINTS;
  let dung = null; let loiCuoi = '';
  for (const part of zaloChunks(text)) {
    if (dung) {
      const r = await sendOne(dung, token, userId, part);
      if (r.code !== 0) throw new Error(`Zalo gửi tin lỗi ${r.code}: ${r.message} (${dung.ten})`);
      continue;
    }
    for (const ep of thuTu) {
      const r = await sendOne(ep, token, userId, part);
      if (r.code === 0) { dung = ep; loiCuoi = ''; break; }
      loiCuoi = `${r.code}: ${r.message} (${ep.ten})`;
      // CHỈ -235 ("loại OA không dùng được đầu nối này") mới thử đầu nối tiếp theo.
      // Các lỗi khác dừng NGAY: có trường hợp Zalo báo lỗi nhưng tin VẪN đi, thử tiếp
      // sẽ thành GỬI HAI LẦN — người dùng nhận hai câu trả lời giống hệt nhau.
      if (r.code !== -235) break;
    }
    if (!dung) throw new Error(`Zalo gửi tin lỗi ${loiCuoi}`);
  }
  // Ghi lại đầu nối vừa chạy được (chỉ ghi khi ĐỔI, để không thêm một lần ghi mỗi tin).
  if (dung && dung.ten !== daBiet) {
    const moi = await getRow(ROW).catch(() => null);   // đọc lại: token có thể vừa được làm mới
    await putRow(ROW, { ...(moi?.data || {}), epTen: dung.ten }).catch(() => {});
  }
  return dung?.ten || '';
}
