// ============================================================================
//  LỜI NHẮC (PROMPT) CHO "SỔ TAY AI" — logic THUẦN, chạy và kiểm thử bằng Node.
//
//  Khác hẳn các việc khác của Trợ lý AI: ở đây AI KHÔNG ĐƯỢC dùng kiến thức sẵn
//  có của nó. Câu hỏi đi kèm một số ĐOẠN VĂN BẢN đã được trình duyệt truy hồi từ
//  đúng sổ tay đang hỏi; AI chỉ được trả lời trong phạm vi các đoạn đó và phải
//  gắn số trích dẫn [1], [2]… về đoạn nguồn.
//
//  Vì sao bắt buộc như vậy: đây là tra cứu VĂN BẢN QUY PHẠM PHÁP LUẬT. Một câu
//  trả lời nghe hợp lý nhưng dẫn sai điều, sai khoản, hoặc dẫn văn bản đã hết
//  hiệu lực thì nguy hiểm hơn là không trả lời. Thà nói "không có trong nguồn".
// ============================================================================

export const SYSTEM_SO_TAY = [
  'Bạn là trợ lý tra cứu văn bản của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.',
  'Bạn phục vụ cán bộ, công chức và đại biểu dân cử nên phải chính xác và thận trọng.',
  '',
  'QUY TẮC BẮT BUỘC — không được vi phạm trong bất kỳ trường hợp nào:',
  '1. CHỈ trả lời dựa vào các đoạn trích trong mục "NGUỒN TRA CỨU" được cung cấp ngay trong câu hỏi.',
  '   Tuyệt đối KHÔNG dùng kiến thức pháp luật có sẵn của bạn để bổ sung, suy luận hay "nhớ hộ".',
  '2. Mỗi ý trong câu trả lời phải gắn số trích dẫn của đoạn đã dùng, viết dạng [1], [2]. Được gắn nhiều số cho một ý.',
  '3. Nếu các đoạn được cung cấp KHÔNG đủ căn cứ để trả lời, hãy nói thẳng:',
  '   "Không tìm thấy căn cứ trong nguồn của sổ tay này." rồi gợi ý cán bộ bổ sung văn bản nào vào sổ tay.',
  '   KHÔNG được đoán, không được trả lời chung chung cho có.',
  '4. KHÔNG bịa số hiệu văn bản, số điều, số khoản, ngày ban hành. Chỉ nhắc lại đúng những gì có trong đoạn trích.',
  '5. Nếu các đoạn trích mâu thuẫn nhau, hãy nêu rõ sự mâu thuẫn và đề nghị kiểm tra hiệu lực của từng văn bản.',
  '',
  'CÁCH VIẾT CÂU TRẢ LỜI:',
  '- Tiếng Việt hành chính, rõ ràng, đi thẳng vào câu hỏi; không mở bài, không khách sáo.',
  '- Trả lời gọn trong khoảng 120 - 350 từ. Nhiều ý thì gạch đầu dòng.',
  '- Dẫn đúng tên gọi của điều, khoản như trong đoạn trích (ví dụ: "Điều 12, khoản 2").',
  '- Kết thúc bằng một dòng: "Lưu ý: nội dung trên chỉ để tham khảo, cần mở văn bản gốc để kiểm chứng."',
].join('\n');

/**
 * Dựng câu hỏi gửi AI: ngữ cảnh đã đánh số + câu hỏi của người dùng.
 * `nguCanh` do trình duyệt dựng sẵn bằng src/lib/soTayAI.js (dungNguCanh).
 */
export function promptSoTay({ cauHoi = '', nguCanh = '', tenSoTay = '', lichSu = [] } = {}) {
  const phan = [];
  if (tenSoTay) phan.push(`SỔ TAY ĐANG TRA CỨU: ${tenSoTay}`);
  phan.push('NGUỒN TRA CỨU (chỉ được dùng những đoạn dưới đây):');
  phan.push(nguCanh || '(không có đoạn nào)');
  if (lichSu.length) {
    phan.push('');
    phan.push('CÁC CÂU ĐÃ HỎI TRƯỚC ĐÓ (chỉ để hiểu ngữ cảnh, không phải nguồn):');
    phan.push(lichSu.map((t, i) => `${i + 1}. ${t}`).join('\n'));
  }
  phan.push('');
  phan.push(`CÂU HỎI: ${String(cauHoi).trim()}`);
  phan.push('');
  phan.push('Hãy trả lời theo đúng quy tắc đã nêu, có gắn số trích dẫn [n].');
  return phan.join('\n');
}

/** Câu trả lời dùng khi truy hồi không ra đoạn nào — khỏi tốn một lượt gọi AI. */
export function khongCoNguon(tenSoTay = '') {
  return [
    `Không tìm thấy căn cứ trong nguồn của sổ tay "${tenSoTay}".`,
    '',
    'Có thể do một trong các lý do sau:',
    '- Sổ tay chưa được nạp nguyên văn văn bản liên quan đến câu hỏi;',
    '- Câu hỏi dùng từ ngữ khác với từ ngữ trong văn bản (thử hỏi lại bằng thuật ngữ của luật);',
    '- Nội dung hỏi thuộc lĩnh vực của sổ tay khác.',
    '',
    'Đề nghị kiểm tra mục "Nguồn của sổ tay" và bổ sung văn bản còn thiếu.',
  ].join('\n');
}

/** Trần ký tự của khối ngữ cảnh nhận từ trình duyệt (chặn gửi quá nặng lên AI). */
export const MAX_NGU_CANH = 16000;
export const MAX_CAU_HOI = 600;

export function catNguCanh(s, max = MAX_NGU_CANH) {
  const t = String(s || '');
  return t.length <= max ? t : `${t.slice(0, max)}\n…(đã cắt bớt cho vừa giới hạn)`;
}
