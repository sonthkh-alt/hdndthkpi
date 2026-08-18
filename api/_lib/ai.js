// ============================================================================
//  BỘ NỐI AI — dùng được với Anthropic (Claude), Google (Gemini) hoặc OpenAI.
//  Chỉ cần khai MỘT khóa API trong biến môi trường Vercel là chạy:
//     ANTHROPIC_API_KEY  |  GEMINI_API_KEY  |  OPENAI_API_KEY
//  Muốn chỉ định rõ thì đặt AI_PROVIDER = anthropic | gemini | openai
//  Muốn đổi mô hình thì đặt AI_MODEL.
//
//  DÙNG DỊCH VỤ TRUNG GIAN "tương thích OpenAI" (vd https://api.<nhà cung cấp>/v1):
//    AI_PROVIDER = openai
//    AI_BASE_URL = https://api.<nhà cung cấp>/v1     (mã sẽ gọi <AI_BASE_URL>/chat/completions)
//    OPENAI_API_KEY = <khóa của họ>
//    AI_MODEL = <tên mô hình theo bảng của họ>
//  ⚠️ Toàn bộ câu hỏi và số liệu nạp kèm sẽ đi qua máy chủ của bên đó.
// ============================================================================
const DEFAULT_MODEL = { anthropic: 'claude-sonnet-5', gemini: 'gemini-2.5-flash', openai: 'gpt-4o-mini' };

const noSlash = (u) => String(u || '').replace(/\/+$/, '');
// Địa chỉ endpoint — đổi được để dùng dịch vụ trung gian hoặc cổng nội bộ.
export const baseUrlOf = (p = provider()) => ({
  anthropic: noSlash(process.env.ANTHROPIC_BASE_URL || process.env.AI_BASE_URL || 'https://api.anthropic.com'),
  gemini: noSlash(process.env.GEMINI_BASE_URL || process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'),
  openai: noSlash(process.env.OPENAI_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com/v1'),
}[p] || '');
/** Tên miền endpoint để hiện trong /trangthai (không lộ khóa). */
export const endpointHost = () => { try { return new URL(baseUrlOf()).host; } catch { return '(chưa rõ)'; } };

export function provider() {
  const forced = String(process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (forced) return forced;
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return '';
}
export const hasAI = () => !!provider();
export const modelName = () => process.env.AI_MODEL || DEFAULT_MODEL[provider()] || '(chưa rõ)';

// Trần thời gian chờ AI. Vercel cắt hàm ở 60 giây (vercel.json) nên phải nhỏ hơn,
// còn chỗ để gửi câu báo lỗi về cho người hỏi. Dịch vụ trung gian chậm thì hạ xuống.
export const timeoutMs = () => Number(process.env.AI_TIMEOUT_MS || 40000);
// Câu trả lời càng dài càng lâu. Bot chat cần gọn (knowledge.js đã dặn dưới 200 từ)
// nên 900 vừa đủ; muốn dài hơn thì đặt AI_MAX_TOKENS.
export const maxTokens = () => Number(process.env.AI_MAX_TOKENS || 900);

async function post(url, body, headers, ms = timeoutMs()) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { method: 'POST', signal: ac.signal, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
    const txt = await r.text();
    if (!r.ok) throw new Error(`AI ${r.status}: ${txt.slice(0, 300)}`);
    return JSON.parse(txt);
  } catch (e) {
    // Thông báo gốc của Node là "This operation was aborted" — người dùng không hiểu gì.
    if (e?.name === 'AbortError' || /aborted/i.test(String(e?.message))) {
      throw new Error(`AI không trả lời trong ${Math.round(ms / 1000)} giây (endpoint ${endpointHost()}). `
        + 'Có thể dịch vụ AI đang quá tải — đồng chí thử hỏi lại, hoặc hỏi câu ngắn gọn hơn.');
    }
    throw e;
  } finally { clearTimeout(timer); }
}

/**
 * Hỏi AI.
 * @param {string} system  Lời dẫn hệ thống (vai trò + quy tắc + dữ liệu).
 * @param {Array}  turns   [{ role: 'user'|'assistant', text }] theo thứ tự thời gian.
 */
export async function askAI(system, turns) {
  const p = provider();
  const model = modelName();
  const msgs = turns.filter((t) => t.text).map((t) => ({ role: t.role === 'assistant' ? 'assistant' : 'user', content: t.text }));

  if (p === 'anthropic') {
    const d = await post(`${baseUrlOf('anthropic')}/v1/messages`,
      { model, max_tokens: maxTokens(), system, messages: msgs },
      { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' });
    return (d.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  }

  if (p === 'gemini') {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const d = await post(`${baseUrlOf('gemini')}/models/${encodeURIComponent(model)}:generateContent?key=${key}`,
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: maxTokens(), temperature: 0.3 },
      }, {});
    const parts = d.candidates?.[0]?.content?.parts || [];
    return parts.map((x) => x.text || '').join('').trim();
  }

  if (p === 'openai') {
    const d = await post(`${baseUrlOf('openai')}/chat/completions`,
      { model, max_tokens: maxTokens(), temperature: 0.3, messages: [{ role: 'system', content: system }, ...msgs] },
      { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` });
    // Một số dịch vụ trung gian trả nội dung dạng mảng khối thay vì chuỗi.
    const c = d.choices?.[0]?.message?.content;
    return (Array.isArray(c) ? c.map((x) => x?.text || '').join('') : (c || '')).trim();
  }

  throw new Error('Chưa khai khóa API của AI (ANTHROPIC_API_KEY / GEMINI_API_KEY / OPENAI_API_KEY) trên Vercel.');
}
