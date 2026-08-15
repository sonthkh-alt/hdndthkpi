// ============================================================================
//  POST /api/doctext  { ten, base64 }  → { text, soKyTu }
//  Trích xuất chữ từ tệp PDF / DOCX / TXT do người dùng tải lên để làm ngữ cảnh
//  cho phân hệ "Trợ lý AI". Việc này chạy bằng thư viện tại chỗ, KHÔNG gọi dịch
//  vụ AI nên không tốn tiền khóa API → mở cho cả khách, không tính vào hạn mức.
//  Trần chi phí nằm ở /api/troly (mỗi lượt gọi AI mới bị trừ lượt).
//
//  Giới hạn: Vercel nhận tối đa ~4,5 MB mỗi lượt gọi, chuỗi base64 phình thêm
//  khoảng 1/3 nên tệp gốc nên ≤ 3 MB. Tệp lớn hơn thì tách nhỏ hoặc dán chữ.
// ============================================================================
import { trichXuat, dinhDang } from './_lib/docText.js';

const GIOI_HAN = 3 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST.' });

  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const ten = String(body.ten || '');
  const b64 = String(body.base64 || '');
  if (!dinhDang(ten)) return res.status(400).json({ error: 'Chỉ nhận tệp .pdf, .docx hoặc .txt.' });
  if (!b64) return res.status(400).json({ error: 'Không nhận được nội dung tệp.' });

  let buf;
  try { buf = Buffer.from(b64, 'base64'); } catch { return res.status(400).json({ error: 'Nội dung tệp không hợp lệ.' }); }
  if (buf.length > GIOI_HAN) return res.status(413).json({ error: `Tệp ${(buf.length / 1024 / 1024).toFixed(1)} MB — vượt giới hạn 3 MB. Hãy tách nhỏ tệp hoặc dán trực tiếp nội dung cần phân tích.` });

  try {
    const text = await trichXuat(ten, buf);
    if (!text) return res.status(200).json({ text: '', soKyTu: 0, canhBao: 'Không trích được chữ nào — có thể tệp PDF là bản chụp (scan). Hãy dán nội dung trực tiếp.' });
    return res.status(200).json({ text, soKyTu: text.length });
  } catch (e) {
    console.error('doctext:', e);
    return res.status(422).json({ error: String(e.message || e).slice(0, 300) });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
