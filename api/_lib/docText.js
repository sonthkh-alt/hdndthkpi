// ============================================================================
//  TRÍCH XUẤT VĂN BẢN TỪ TỆP TẢI LÊN (PDF · DOCX · TXT) — chạy phía máy chủ.
//  Thay cho `utils/doc_helper.py` (pypdf + python-docx) của bản Streamlit.
//    • PDF  → thư viện `pdf-parse` (đã có sẵn trong package.json).
//    • DOCX → tự đọc: tệp .docx là một kho ZIP, lấy `word/document.xml` rồi
//             giải nén bằng zlib có sẵn của Node (không cần thư viện mới).
//  Phần ZIP/XML là LOGIC THUẦN nên kiểm thử được bằng Node.
// ============================================================================
import { inflateRawSync } from 'node:zlib';

/** Đuôi tệp đã chuẩn hóa: 'pdf' | 'docx' | 'txt' | '' (không hỗ trợ). */
export function dinhDang(ten) {
  const m = String(ten || '').toLowerCase().match(/\.([a-z0-9]+)$/);
  const e = m ? m[1] : '';
  if (e === 'pdf') return 'pdf';
  if (e === 'docx') return 'docx';
  if (e === 'txt' || e === 'md' || e === 'csv') return 'txt';
  return '';
}

// ---- ZIP: đọc mục lục trung tâm (đáng tin hơn đọc từng đầu tệp) ------------
const EOCD = 0x06054b50; // End of central directory
const CEN = 0x02014b50;  // Central directory file header

/** Lấy nội dung một mục trong kho ZIP theo tên; không có thì trả null. */
export function docMucZip(buf, ten) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  // Mục lục nằm ở cuối tệp, phần chú thích tối đa 65535 byte.
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 22 - 65535); i--) {
    if (b.readUInt32LE(i) === EOCD) { eocd = i; break; }
  }
  if (eocd < 0) return null;
  const soMuc = b.readUInt16LE(eocd + 10);
  let p = b.readUInt32LE(eocd + 16);

  for (let i = 0; i < soMuc && p + 46 <= b.length; i++) {
    if (b.readUInt32LE(p) !== CEN) return null;
    const method = b.readUInt16LE(p + 10);
    const csize = b.readUInt32LE(p + 20);
    const nameLen = b.readUInt16LE(p + 28);
    const extraLen = b.readUInt16LE(p + 30);
    const cmtLen = b.readUInt16LE(p + 32);
    const localOff = b.readUInt32LE(p + 42);
    const name = b.toString('utf8', p + 46, p + 46 + nameLen);

    if (name === ten) {
      // Đầu tệp cục bộ: phần tên và phần phụ có thể dài khác mục lục nên phải đọc lại.
      const lNameLen = b.readUInt16LE(localOff + 26);
      const lExtraLen = b.readUInt16LE(localOff + 28);
      const start = localOff + 30 + lNameLen + lExtraLen;
      const data = b.subarray(start, start + csize);
      if (method === 0) return data;            // không nén
      if (method === 8) return inflateRawSync(data); // nén deflate
      return null;                              // kiểu nén khác: không xử lý
    }
    p += 46 + nameLen + extraLen + cmtLen;
  }
  return null;
}

const THUC_THE = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };

/** Đổi XML thân văn bản của Word thành chữ thường, giữ ngắt đoạn. */
export function xmlSangChu(xml) {
  return String(xml || '')
    .replace(/<w:tab\b[^>]*\/>/g, '\t')
    .replace(/<w:br\b[^>]*\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (m) => THUC_THE[m])
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Đọc chữ trong tệp .docx. */
export function docxSangChu(buf) {
  const xml = docMucZip(buf, 'word/document.xml');
  if (!xml) throw new Error('Tệp .docx không đọc được (thiếu word/document.xml). Nếu là tệp .doc đời cũ, hãy lưu lại thành .docx.');
  return xmlSangChu(xml.toString('utf8'));
}

/** Đọc chữ trong tệp .pdf (dùng pdf-parse — chỉ chạy được phía máy chủ). */
export async function pdfSangChu(buf) {
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  try {
    const r = await parser.getText();
    return String(r?.text || '').trim();
  } finally {
    try { await parser.destroy?.(); } catch { /* bỏ qua */ }
  }
}

/** Trích xuất theo tên tệp. Ném lỗi có câu chữ tiếng Việt để hiện thẳng lên giao diện. */
export async function trichXuat(ten, buf) {
  const kieu = dinhDang(ten);
  if (kieu === 'txt') return Buffer.from(buf).toString('utf8').trim();
  if (kieu === 'docx') return docxSangChu(buf);
  if (kieu === 'pdf') return pdfSangChu(buf);
  throw new Error('Chỉ nhận tệp .pdf, .docx hoặc .txt.');
}
