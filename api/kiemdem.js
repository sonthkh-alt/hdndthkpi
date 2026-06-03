// Vercel Serverless Function — proxy đọc "Bảng kiểm đếm, theo dõi công việc" từ Google Sheet công khai.
// Trả JSON { fetchedAt, weekTitle, persons:[{name, trackings:[...]}] }. Tránh lỗi CORS khi gọi từ trình duyệt.

const SHEET_ID = '1ML2nsQb4Vh7iB_mbBkQhngW9ftjwIvo0-ysXe2UQ6pQ';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// CSV parser dạng máy trạng thái: xử lý dấu phẩy, ngoặc kép, và xuống dòng bên trong ô.
function parseCSV(text) {
  const rows = []; let row = []; let field = ''; let i = 0; let inQ = false;
  const pushF = () => { row.push(field); field = ''; };
  const pushR = () => { rows.push(row); row = []; };
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQ = true; i++; continue; }
    if (ch === ',') { pushF(); i++; continue; }
    if (ch === '\r') { i++; continue; }
    if (ch === '\n') { pushF(); pushR(); i++; continue; }
    field += ch; i++;
  }
  if (field !== '' || row.length) { pushF(); pushR(); }
  return rows;
}

export function parseKiemDem(csv) {
  const rows = parseCSV(csv);
  if (!rows.length) return { weekTitle: '', persons: [] };
  const headerJoined = (rows[0] || []).join(' ');
  const m = headerJoined.match(/Tuần thứ\s*\d+\s*\([^)]*\)/);
  const weekTitle = m ? m[0].replace(/\s+/g, ' ').trim() : '';

  // Bỏ phần khung mẫu (mục I–VI, cột tên trống): dữ liệu thật bắt đầu từ dòng đầu tiên có TÊN.
  let startIdx = -1;
  for (let r = 1; r < rows.length; r++) {
    if ((rows[r][0] || '').trim() !== '') { startIdx = r; break; }
  }
  const persons = []; const byName = new Map();
  if (startIdx === -1) return { weekTitle, persons };
  const T = (v) => (v == null ? '' : String(v)).trim();
  let curName = '';
  for (let r = startIdx; r < rows.length; r++) {
    const row = rows[r];
    const nm = T(row[0]); if (nm) curName = nm;
    const content = T(row[2]);
    if (!content || !curName) continue; // bỏ dòng trống / dòng không có nội dung công việc
    if (!byName.has(curName)) { const p = { name: curName, trackings: [] }; byName.set(curName, p); persons.push(p); }
    byName.get(curName).trackings.push({
      content,
      coordination: T(row[3]), directive: T(row[4]), finalProduct: T(row[5]),
      startDate: T(row[6]), endDate: T(row[7]), doneWork: T(row[8]), doingWork: T(row[9]),
      difficulties: T(row[10]), proposals: T(row[11]), note: T(row[12]),
    });
  }
  return { weekTitle, persons };
}

export default async function handler(req, res) {
  try {
    const r = await fetch(CSV_URL, { redirect: 'follow', headers: { 'User-Agent': 'hdndthkpi-sync' } });
    if (!r.ok) {
      res.status(502).json({ error: `Không tải được Google Sheet (HTTP ${r.status}). Kiểm tra quyền chia sẻ "ai có link đều xem được".` });
      return;
    }
    const csv = await r.text();
    const data = parseKiemDem(csv);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ fetchedAt: new Date().toISOString(), ...data });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
