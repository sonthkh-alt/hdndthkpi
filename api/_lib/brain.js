// ============================================================================
//  "BỘ NÃO" của bot chat — dùng chung cho Telegram (api/telegram.js) và
//  sau này cho Zalo OA (api/zalo.js). Nhận câu hỏi, trả về câu trả lời.
//
//  Cách làm: nạp SỐ LIỆU THẬT từ Supabase + HIỂU BIẾT VỀ HỆ THỐNG vào lời dẫn,
//  rồi để AI diễn đạt. Nhờ vậy bot vừa trả lời đúng số của cơ quan, vừa trả lời
//  được các câu hỏi ngoài hệ thống.
// ============================================================================
import { gatherFacts, periodFacts, tieuChiFacts, nhanSuFacts } from './facts.js';
import { lichFacts, hasLich } from './lich.js';
import { KNOWLEDGE, SYSTEM_PROMPT, SITE } from './knowledge.js';
import { askAI, hasAI, provider, modelName, endpointHost } from './ai.js';
import { loadTurns, saveTurns, clearTurns, hasStore, isServiceKey } from './store.js';

const HELP = `Xin chào! Tôi là trợ lý của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.

Cứ hỏi tôi bằng tiếng Việt bình thường, ví dụ:
• "Điểm tháng này của đồng chí Hà Ngọc Sơn bao nhiêu?"
• "Phòng nào có điểm trung bình cao nhất?"
• "Kết quả kiểm điểm quý này của các đồng chí diện Ban Thường vụ Tỉnh ủy quản lý?"
• "Tuần này đồng chí Phó Chủ tịch HĐND tỉnh có lịch gì?"
• "Sáng mai có cuộc họp nào, ở đâu, đi xe nào?"
• "Còn mục lịch nào đang chờ duyệt không?"
• "Còn ai chưa được phê duyệt?"
• "Phường Hạc Thành xếp loại gì, vì sao chưa đạt Xuất sắc?"
• "Muốn xếp loại Xuất sắc thì cần điều kiện gì?"
Ngoài số liệu của hệ thống, tôi cũng trả lời được các câu hỏi chung khác.

Lệnh nhanh:
/solieu — đọc thẳng số liệu hệ thống, không qua AI
/quen — xóa ngữ cảnh cuộc trò chuyện, hỏi lại từ đầu
/trangthai — kiểm tra tình trạng kết nối
/help — bảng hướng dẫn này

Xem đầy đủ trên web: ${SITE}
⚠️ Đây là bản demo thử nghiệm — số liệu cần đối chiếu lại trên phần mềm trước khi dùng chính thức.`;

async function statusText() {
  const lines = [
    `Kết nối cơ sở dữ liệu: ${hasStore() ? (isServiceKey() ? '✅ có (khóa bí mật)' : '⚠️ có nhưng dùng khóa công khai (anon) — có thể không đọc được kỳ đánh giá') : '❌ chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'}`,
    `Bộ não AI: ${hasAI() ? `✅ ${provider()} · mô hình ${modelName()} · endpoint ${endpointHost()}` : '❌ chưa khai khóa API của AI'}`,
  ];
  if (hasStore()) {
    try {
      const p = await periodFacts();
      if (p.modules?.length) {
        p.modules.forEach((m) => lines.push(`${m.title}: kỳ mới nhất ${m.meta.ky}`));
      } else lines.push('Kỳ đánh giá cán bộ: chưa có dữ liệu');
      const t = await tieuChiFacts();
      lines.push(`Tiêu chí HĐND: ${t.meta ? `${t.meta.units} đơn vị, năm ${t.meta.year}` : 'chưa có dữ liệu'}`);
    } catch (e) { lines.push(`Lỗi đọc dữ liệu: ${e.message}`); }
  }
  if (!hasLich()) lines.push('Lịch công tác tuần: ❌ chưa cấu hình CAL_SUPABASE_URL / CAL_SUPABASE_SERVICE_ROLE_KEY');
  else {
    try { const l = await lichFacts(); lines.push(`Lịch công tác tuần: ✅ ${l.meta?.count ?? 0} mục (tuần này và tuần sau), chờ duyệt ${l.meta?.cho_duyet ?? 0}`); }
    catch (e) { lines.push(`Lịch công tác tuần: lỗi đọc — ${e.message}`); }
  }
  return lines.join('\n');
}

/**
 * Trả lời một tin nhắn.
 * @param {string}  text     nội dung người dùng gửi
 * @param {string}  chatKey  khóa cuộc trò chuyện (để nhớ ngữ cảnh)
 * @param {boolean} isAdmin  người hỏi có phải Quản trị không (mở dữ liệu nhân sự)
 */
export async function reply({ text, chatKey, isAdmin = false, moc = {} }) {
  const q = String(text || '').trim();
  if (!q) return 'Đồng chí gửi câu hỏi giúp tôi nhé. Gõ /help để xem gợi ý.';

  const cmd = q.toLowerCase().split(/[\s@]/)[0];
  if (['/start', '/help', '/huongdan'].includes(cmd)) {
    return isAdmin
      ? `${HELP}\n\nDành riêng cho Quản trị:\n/danhsach — xem người đăng ký dùng trợ lý\n/duyet <ID> · /tuchoi <ID> — duyệt thủ công khi không bấm được nút
/moluot <ID> — mở lại lượt hỏi trong ngày cho một người`
      : HELP;
  }
  if (['/trangthai', '/status'].includes(cmd)) return await statusText();
  if (['/quen', '/reset', '/moi'].includes(cmd)) { await clearTurns(chatKey); return 'Đã xóa ngữ cảnh. Mời đồng chí hỏi lại từ đầu.'; }

  if (['/solieu', '/sl'].includes(cmd)) {
    const parts = await Promise.all([
      periodFacts().catch((e) => ({ text: `(lỗi: ${e.message})` })),
      tieuChiFacts().catch(() => ({ text: '' })),
      lichFacts().catch(() => ({ text: '' })),
      isAdmin ? nhanSuFacts().catch(() => ({ text: '' })) : Promise.resolve({ text: '' }),
    ]);
    // Có tới 3 khối số liệu (2 phân hệ chấm điểm + tiêu chí HĐND); telegram.js tự cắt thành nhiều tin.
    const out = parts.map((p) => p.text).filter(Boolean).join('\n\n');
    return out ? out.slice(0, 9000) : 'Chưa đọc được số liệu nào. Gõ /trangthai để kiểm tra kết nối.';
  }

  if (!hasAI()) {
    return 'Bot chưa được gắn khóa API của AI nên chỉ trả lời được lệnh /solieu.\n'
      + 'Cách khắc phục: vào Vercel → Settings → Environment Variables, thêm ANTHROPIC_API_KEY (hoặc GEMINI_API_KEY / OPENAI_API_KEY) rồi triển khai lại.';
  }

  // Nạp số liệu và ngữ cảnh hội thoại SONG SONG — hai việc không phụ thuộc nhau,
  // chạy nối tiếp là cộng thêm một vòng gọi mạng vào thời gian người dùng phải chờ.
  const t0 = Date.now();
  const [facts, turns] = await Promise.all([
    hasStore() ? gatherFacts(q, { isAdmin }).catch((e) => `(Không đọc được số liệu: ${e.message})`) : Promise.resolve(''),
    loadTurns(chatKey),
  ]);
  moc.msSoLieu = Date.now() - t0;

  const system = `${SYSTEM_PROMPT}

# HIỂU BIẾT VỀ HỆ THỐNG
${KNOWLEDGE}

# SỐ LIỆU HỆ THỐNG (đọc trực tiếp từ cơ sở dữ liệu lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' })})
${facts || '(Lượt hỏi này không nạp số liệu nào. Nếu người dùng hỏi số cụ thể, đề nghị họ hỏi lại rõ hơn hoặc gõ /solieu.)'}

# NGƯỜI HỎI
${isAdmin ? 'Là Quản trị hệ thống — được xem cả số liệu nhân sự tổng hợp.' : 'Là người dùng thường — KHÔNG được xem hồ sơ nhân sự, chỉ xem kết quả đánh giá và tiêu chí.'}`;

  moc.coChu = system.length;   // độ dài lời dẫn — càng dài AI càng lâu trả lời
  const t1 = Date.now();
  const answer = await askAI(system, [...turns, { role: 'user', text: q }]);
  moc.msAI = Date.now() - t1;
  const out = (answer || '').trim() || 'Xin lỗi, tôi chưa trả lời được câu này.';
  await saveTurns(chatKey, [...turns, { role: 'user', text: q }, { role: 'assistant', text: out }]);
  return out;
}
