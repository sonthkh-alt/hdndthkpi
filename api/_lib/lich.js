// ============================================================================
//  ĐỌC LỊCH CÔNG TÁC TUẦN cho bot chat.
//
//  Phân hệ "Quản lý lịch công tác tuần" (https://calendar-beta-lac.vercel.app)
//  là ứng dụng RIÊNG, dùng dự án Supabase RIÊNG. Vì vậy bot nối bằng cặp biến
//  môi trường riêng — khai trên Vercel của hệ thống đánh giá:
//      CAL_SUPABASE_URL
//      CAL_SUPABASE_SERVICE_ROLE_KEY   (hoặc CAL_SUPABASE_SECRET_KEY)
//  Chưa khai thì bot vẫn chạy bình thường, chỉ không trả lời được câu hỏi về lịch.
//
//  Bảng bên đó: leaders · bans · vehicles · schedule_entries (xem Calendar/supabase/schema.sql).
//  Bot CHỈ ĐỌC, không ghi.
// ============================================================================
const baseUrl = () => process.env.CAL_SUPABASE_URL || '';
const anyKey = () => process.env.CAL_SUPABASE_SERVICE_ROLE_KEY || process.env.CAL_SUPABASE_SECRET_KEY || '';
export const hasLich = () => !!(baseUrl() && anyKey());

async function rest(path) {
  if (!hasLich()) throw new Error('Chưa cấu hình CAL_SUPABASE_URL / CAL_SUPABASE_SERVICE_ROLE_KEY.');
  const key = anyKey();
  const r = await fetch(`${baseUrl().replace(/\/+$/, '')}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!r.ok) throw new Error(`Supabase (lịch) ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const txt = await r.text();
  return txt ? JSON.parse(txt) : [];
}

// ---- Ngày tháng theo giờ Việt Nam (UTC+7) ---------------------------------
export const todayVN = (now = Date.now()) => new Date(now + 7 * 3600 * 1000).toISOString().slice(0, 10);
const dayObj = (iso) => new Date(`${iso}T00:00:00Z`);
export const addDays = (iso, n) => { const d = dayObj(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
/** Thứ Hai của tuần chứa ngày đã cho. */
export const mondayOf = (iso) => addDays(iso, -((dayObj(iso).getUTCDay() + 6) % 7));

const DOW = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export const dowName = (iso) => DOW[dayObj(iso).getUTCDay()];
const dmy = (iso) => { const [y, m, d] = String(iso).split('-'); return `${d}/${m}/${y}`; };

const SESSION = { sang: 'Sáng', chieu: 'Chiều', ca_ngay: 'Cả ngày', gio: 'Theo giờ' };
const STATUS = { cho_duyet: 'Chờ duyệt', da_duyet: 'Đã duyệt', da_dieu_chinh: 'Đã điều chỉnh', tu_choi: 'Từ chối' };
const GROUP = { pct: 'Lãnh đạo HĐND tỉnh', doan: 'Đoàn ĐBQH tỉnh', ban: 'Các Ban HĐND tỉnh', vanphong: 'Lãnh đạo Văn phòng' };

const hhmm = (t) => String(t || '').slice(0, 5);
const sessionText = (e) => (e.session === 'gio'
  ? `${hhmm(e.start_time)}${e.end_time ? `-${hhmm(e.end_time)}` : ''}`
  : (SESSION[e.session] || e.session));

/**
 * Nhãn của một đối tượng có lịch. PHẢI kèm TÊN BAN khi có `ban_id` — thiếu tên Ban thì
 * ngữ cảnh chỉ còn họ tên, AI không phân biệt được "Trưởng Ban Dân tộc" với
 * "Trưởng Ban Kinh tế - Ngân sách" và sẽ trả lời nhầm người.
 */
const leaderName = (l, banName = '') => {
  if (!l) return '(không rõ)';
  // Dữ liệu thật có cả hai kiểu: dòng ĐƠN VỊ (full_name = tên Ban, position rỗng)
  // và dòng ĐÍCH DANH (full_name = họ tên, position = "Trưởng ban"). Ghép chung một
  // công thức để không đánh rơi chức vụ ở kiểu thứ hai.
  const base = `${l.full_name}${l.position ? ` (${l.position})` : ''}`;
  return banName && !base.includes(banName) ? `${base} — ${banName}` : base;
};

/**
 * Phần định dạng THUẦN (không đụng mạng) — tách ra để kiểm thử bằng Node.
 * @param {object} d { leaders, vehicles, entries, from, to, today }
 */
export function fmtLich(d) {
  const { leaders = [], vehicles = [], entries = [], bans = [], from, to, today } = d || {};
  const banName = new Map(bans.map((b) => [b.id, b.name || b.short_name || '']));
  const nameOf = (l) => leaderName(l, l ? banName.get(l.ban_id) || '' : '');
  if (!entries.length) {
    return {
      meta: { from, to, count: 0 },
      text: `## Lịch công tác tuần (phân hệ riêng: calendar-beta-lac.vercel.app)\n`
        + `Từ ${dmy(from)} đến ${dmy(to)} chưa có mục lịch nào được nhập.`,
    };
  }

  const byLeader = new Map(leaders.map((l) => [l.id, l]));
  const byVehicle = new Map(vehicles.map((v) => [v.id, v]));
  const cnt = entries.reduce((a, e) => { a[e.status] = (a[e.status] || 0) + 1; return a; }, {});

  const xe = vehicles.filter((v) => v.active !== false).map((v) => {
    const own = v.vehicle_type === 'rieng' ? `xe riêng${v.assigned_leader_id ? ` của ${nameOf(byLeader.get(v.assigned_leader_id))}` : ''}` : 'xe dùng chung';
    return `${v.plate} (${own}${v.driver_name ? `, lái xe ${v.driver_name}` : ''})`;
  });

  // Gom theo ngày rồi tới từng mục, giữ nguyên thứ tự ngày → buổi.
  const days = new Map();
  for (const e of entries) {
    if (!days.has(e.date)) days.set(e.date, []);
    days.get(e.date).push(e);
  }

  const MAX = 150; // chặn ngữ cảnh phình to khi có quá nhiều mục
  let shown = 0;
  const blocks = [];
  for (const [date, list] of [...days.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const lines = [];
    for (const e of list) {
      if (shown >= MAX) break;
      shown++;
      const l = byLeader.get(e.leader_id);
      const v = e.vehicle_id ? byVehicle.get(e.vehicle_id) : null;
      lines.push(`- [${sessionText(e)}] ${GROUP[l?.leader_type] || ''} · ${nameOf(l)}: ${String(e.content || '').slice(0, 200)}`
        + `${e.location ? ` | Địa điểm: ${e.location}` : ''}`
        + `${e.participants ? ` | Thành phần: ${String(e.participants).slice(0, 120)}` : ''}`
        + ` | ${STATUS[e.status] || e.status}`
        + `${e.review_note ? ` (ghi chú: ${String(e.review_note).slice(0, 120)})` : ''}`
        + `${v ? ` | Xe ${v.plate}${v.driver_name ? ` - ${v.driver_name}` : ''}` : ''}`);
    }
    if (lines.length) blocks.push(`### ${dowName(date)} ${dmy(date)}${date === today ? ' (HÔM NAY)' : ''}\n${lines.join('\n')}`);
    if (shown >= MAX) break;
  }

  // Danh sách đối tượng có lịch — để AI khớp câu hỏi với ĐÚNG người/Ban, không suy đoán.
  const roster = Object.entries(GROUP).map(([type, title]) => {
    const ds = leaders.filter((l) => l.leader_type === type && l.active !== false).map(nameOf);
    return ds.length ? `- ${title}: ${ds.join(' · ')}` : '';
  }).filter(Boolean).join('\n');

  return {
    meta: { from, to, count: entries.length, cho_duyet: cnt.cho_duyet || 0 },
    text: `## Lịch công tác tuần (phân hệ riêng: calendar-beta-lac.vercel.app)\n`
      + `Hôm nay: ${dowName(today)} ${dmy(today)}. Số liệu lấy từ ${dmy(from)} đến ${dmy(to)} (tuần này và tuần sau).\n`
      + `${roster ? `Đối tượng có lịch (khi được hỏi về một người hoặc một Ban, chỉ lấy các mục ghi ĐÚNG tên trong danh sách này; nếu không có thì nói là không có):\n${roster}\n` : ''}`
      + `Tổng ${entries.length} mục lịch — ${Object.entries(cnt).map(([k, n]) => `${STATUS[k] || k}: ${n}`).join(' · ')}.\n`
      + `${xe.length ? `Xe ô tô: ${xe.join(' · ')}.\n` : ''}`
      + `${shown < entries.length ? `(Chỉ liệt kê ${shown}/${entries.length} mục đầu.)\n` : ''}`
      + blocks.join('\n\n'),
  };
}

/** Nạp lịch tuần này + tuần sau từ Supabase của phân hệ lịch. */
export async function lichFacts(opts = {}) {
  if (!hasLich()) return { text: '', meta: null };
  const today = opts.today || todayVN();
  const from = mondayOf(today);
  const to = addDays(from, 13);

  const [leaders, vehicles, entries] = await Promise.all([
    rest('leaders?select=id,full_name,position,leader_type,ban_id,active'),
    rest('vehicles?select=id,plate,driver_name,vehicle_type,assigned_leader_id,active'),
    rest(`schedule_entries?date=gte.${from}&date=lte.${to}`
      + '&select=id,leader_id,date,session,start_time,end_time,content,location,participants,status,review_note,vehicle_id'
      + '&order=date.asc,session.asc'),
  ]);
  return fmtLich({ leaders, vehicles, entries, from, to, today });
}
