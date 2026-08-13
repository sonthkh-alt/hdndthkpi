// ============================================================================
//  ĐỌC / GHI Supabase từ PHÍA MÁY CHỦ (Vercel Serverless Function).
//  Dùng cho bot chat (Telegram / Zalo) — KHÔNG chạy trong trình duyệt.
//
//  ⚠️ Cần KHÓA BÍ MẬT của Supabase (Project Settings -> API Keys). Chấp nhận cả hai
//     cách đặt tên, khai tên nào cũng được:
//       SUPABASE_SERVICE_ROLE_KEY  — tên cũ, giá trị JWT 'eyJ...' ở tab Legacy API keys
//       SUPABASE_SECRET_KEY        — tên mới Supabase gợi ý, giá trị 'sb_secret_...'
//     Khóa này BỎ QUA RLS nên TUYỆT ĐỐI không đặt tên có tiền tố VITE_
//     (biến VITE_ sẽ bị nhúng vào mã tải về trình duyệt).
//  Gọi REST trực tiếp bằng fetch để hàm này không phụ thuộc @supabase/supabase-js.
// ============================================================================
// Đọc biến môi trường LÚC GỌI (không phải lúc nạp module) để kiểm thử đổi được cấu hình.
const baseUrl = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const secretKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const anyKey = () => secretKey() || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const hasStore = () => !!(baseUrl() && anyKey());
export const isServiceKey = () => !!secretKey();

async function rest(path, init = {}) {
  if (!hasStore()) throw new Error('Chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  const key = anyKey();
  const r = await fetch(`${baseUrl().replace(/\/+$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', ...(init.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const txt = await r.text();
  return txt ? JSON.parse(txt) : null;
}

/** Đọc một dòng app_state theo id. Trả { data, updated_at } hoặc null. */
export async function getRow(id) {
  const rows = await rest(`app_state?id=eq.${encodeURIComponent(id)}&select=data,updated_at`);
  return (rows && rows[0]) || null;
}

/** Ghi đè một dòng app_state (upsert). */
export async function putRow(id, data) {
  await rest('app_state', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id, data, updated_at: new Date().toISOString() }),
  });
}

// Mỗi PHÂN HỆ có kho dữ liệu riêng (xem src/lib/supabase.js):
//   state_<năm>_<tháng>             -> OKR/KPI cán bộ, công chức (ns = '')
//   state_kiemdiem_<năm>_<tháng>    -> Kiểm điểm, xếp loại đảng viên (ns = 'kiemdiem')
//   state_<bộ tiêu chí>_<năm>_<tháng> -> các bản trong Phòng thử nghiệm
const PERIOD_RE = /^state_(?:([a-z]+)_)?(\d+)_(\d+)$/;

/**
 * Danh sách các kỳ đã có dữ liệu, mới nhất trước.
 * @param {string|null} ns  null = TẤT CẢ phân hệ; '' = riêng OKR/KPI; 'kiemdiem' = riêng Kiểm điểm.
 * PostgREST đổi '*' thành '%'.
 */
export async function listPeriodIds(ns = null) {
  const rows = await rest('app_state?id=like.state_*&select=id,updated_at');
  return (rows || [])
    .map((r) => {
      const m = String(r.id).match(PERIOD_RE);
      return m ? { id: r.id, ns: m[1] || '', year: Number(m[2]), month: Number(m[3]), updated_at: r.updated_at } : null;
    })
    .filter(Boolean)
    .filter((p) => ns == null || p.ns === ns)
    .sort((a, b) => (b.year - a.year) || (b.month - a.month));
}

// ---------------------------------------------------------------------------
//  TRÍ NHỚ HỘI THOẠI của bot — một dòng app_state id='bot_memory'.
//  Serverless không giữ được biến giữa các lần gọi nên phải lưu ra cơ sở dữ liệu.
// ---------------------------------------------------------------------------
const MEM_ID = 'bot_memory';
const MEM_TTL = 2 * 24 * 60 * 60 * 1000; // quên hội thoại im lặng quá 2 ngày
const MEM_TURNS = 10;                    // giữ 10 lượt gần nhất mỗi cuộc trò chuyện

export async function loadTurns(chatKey) {
  try {
    const row = await getRow(MEM_ID);
    const c = row?.data?.chats?.[chatKey];
    if (!c || Date.now() - (c.at || 0) > MEM_TTL) return [];
    return Array.isArray(c.turns) ? c.turns : [];
  } catch { return []; }
}

export async function saveTurns(chatKey, turns) {
  try {
    const row = await getRow(MEM_ID);
    const chats = { ...(row?.data?.chats || {}) };
    chats[chatKey] = { at: Date.now(), turns: turns.slice(-MEM_TURNS) };
    for (const k of Object.keys(chats)) {
      if (Date.now() - (chats[k].at || 0) > MEM_TTL) delete chats[k];
    }
    await putRow(MEM_ID, { chats });
  } catch { /* quên được thì thôi, không chặn việc trả lời */ }
}

export async function clearTurns(chatKey) {
  try {
    const row = await getRow(MEM_ID);
    const chats = { ...(row?.data?.chats || {}) };
    delete chats[chatKey];
    await putRow(MEM_ID, { chats });
  } catch { /* bỏ qua */ }
}
