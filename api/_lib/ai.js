// ============================================================================
//  BỘ NỐI AI — dùng được với Anthropic (Claude), Google (Gemini) hoặc OpenAI.
//  Chỉ cần khai MỘT khóa API trong biến môi trường Vercel là chạy:
//     ANTHROPIC_API_KEY  |  GEMINI_API_KEY  |  OPENAI_API_KEY
//  Muốn chỉ định rõ thì đặt AI_PROVIDER = anthropic | gemini | openai
//  Muốn đổi mô hình thì đặt AI_MODEL.
// ============================================================================
const DEFAULT_MODEL = { anthropic: 'claude-sonnet-5', gemini: 'gemini-2.5-flash', openai: 'gpt-4o-mini' };

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

async function post(url, body, headers, ms = 45000) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { method: 'POST', signal: ac.signal, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
    const txt = await r.text();
    if (!r.ok) throw new Error(`AI ${r.status}: ${txt.slice(0, 300)}`);
    return JSON.parse(txt);
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
    const d = await post('https://api.anthropic.com/v1/messages',
      { model, max_tokens: 1200, system, messages: msgs },
      { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' });
    return (d.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  }

  if (p === 'gemini') {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const d = await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${key}`,
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: 1200, temperature: 0.3 },
      }, {});
    const parts = d.candidates?.[0]?.content?.parts || [];
    return parts.map((x) => x.text || '').join('').trim();
  }

  if (p === 'openai') {
    const d = await post('https://api.openai.com/v1/chat/completions',
      { model, max_tokens: 1200, temperature: 0.3, messages: [{ role: 'system', content: system }, ...msgs] },
      { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` });
    return (d.choices?.[0]?.message?.content || '').trim();
  }

  throw new Error('Chưa khai khóa API của AI (ANTHROPIC_API_KEY / GEMINI_API_KEY / OPENAI_API_KEY) trên Vercel.');
}
