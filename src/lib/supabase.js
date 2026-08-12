import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Nếu chưa cấu hình env, supabase = null -> app vẫn chạy demo trong bộ nhớ.
export const supabase = url && key ? createClient(url, key) : null;

const LOCAL_PREFIX = 'hdndthkpi_state';

// Mỗi kỳ (tháng/năm) lưu thành một bản ghi riêng -> có lịch sử, không ghi đè kỳ khác.
//
// ⚠️ MỖI PHÂN HỆ GIỮ KHO DỮ LIỆU RIÊNG qua tham số `ns` (namespace):
//    ns = ''          -> `state_2026_8`           (OKR/KPI — GIỮ NGUYÊN id cũ để không mất
//                                                  dữ liệu đã lưu và để bot chat đọc được)
//    ns = 'kiemdiem'  -> `state_kiemdiem_2026_9`  (Kiểm điểm, xếp loại đảng viên)
//    ns = 'sg'/'classic'/'improved' -> tương tự (các bản trong Phòng thử nghiệm)
// Trước đây mọi phân hệ dùng chung một id theo tháng/năm nên phân hệ mở sau ĐÈ LÊN
// danh sách cán bộ của phân hệ mở trước (Kiểm điểm mất danh sách diện BTV Tỉnh ủy quản lý).
const nsPart = (ns) => (ns ? `${ns}_` : '');
const periodId = (p, ns) => `state_${nsPart(ns)}${p.year}_${p.month}`;
const localKey = (p, ns) => `${LOCAL_PREFIX}_${nsPart(ns)}${p.year}_${p.month}`;
// Lọc đúng bản ghi của phân hệ: với ns='' phải LOẠI các id có namespace (state_kiemdiem_…).
const idRe = (ns) => new RegExp(`^state_${nsPart(ns)}(\\d+)_(\\d+)$`);

/**
 * Nạp dữ liệu của một kỳ.
 * Trả về { state, serverTs, migrated } — serverTs dùng cho khóa lạc quan khi lưu.
 */
export async function loadState(period, ns = '') {
  const id = periodId(period, ns);
  const lkey = localKey(period, ns);

  // 1) Đọc local trước (offline-first)
  let local = null;
  try {
    const raw = localStorage.getItem(lkey);
    if (raw) local = JSON.parse(raw);
  } catch (e) {
    console.warn('loadState local:', e);
  }

  if (!supabase) return { state: local, serverTs: null };

  // 2) Đọc bản ghi của kỳ trên máy chủ
  const { data, error } = await supabase
    .from('app_state').select('data, updated_at').eq('id', id).maybeSingle();

  if (error) {
    console.warn('loadState supabase:', error.message);
    return { state: local, serverTs: null };
  }

  if (data?.data) {
    const server = data.data;
    const localTs = local?._ts || 0;
    const serverTs = server._ts || 0;
    // Ưu tiên server nếu mới hơn hoặc local trống
    if (serverTs >= localTs || !local) {
      local = server;
      try { localStorage.setItem(lkey, JSON.stringify(server)); } catch (e) { console.warn(e); }
    }
    return { state: local, serverTs: data.updated_at };
  }

  // 3) Chưa có bản ghi theo kỳ — di trú dữ liệu cũ (bản 'main') nếu đúng kỳ của nó.
  //    Chỉ áp dụng cho kho mặc định (OKR/KPI); phân hệ khác không dính dữ liệu cũ này.
  if (ns) return { state: local || null, serverTs: null };
  const { data: legacy } = await supabase
    .from('app_state').select('data').eq('id', 'main').maybeSingle();
  if (legacy?.data) {
    const lp = legacy.data.period || {};
    if (String(lp.year) === String(period.year) && String(lp.month) === String(period.month)) {
      return { state: legacy.data, serverTs: null, migrated: true };
    }
  }

  // 4) Kỳ trống thật sự
  return { state: local || null, serverTs: null };
}

/**
 * Lưu dữ liệu của một kỳ với KHÓA LẠC QUAN.
 * lastServerTs = updated_at đã nạp về. Nếu trên máy chủ đã đổi -> trả { conflict:true } (không ghi đè mù).
 */
export async function saveState(period, state, lastServerTs, ns = '') {
  state._ts = Date.now();
  const id = periodId(period, ns);
  const lkey = localKey(period, ns);

  // Luôn lưu local ngay
  try { localStorage.setItem(lkey, JSON.stringify(state)); } catch (e) { console.warn('saveState local:', e); }

  if (!supabase) return { ok: false, reason: 'no-supabase' };

  const nowIso = new Date().toISOString();

  // Chưa có bản ghi kỳ -> tạo mới
  if (!lastServerTs) {
    const { data, error } = await supabase
      .from('app_state').insert({ id, data: state, updated_at: nowIso }).select('updated_at');
    if (error) {
      console.warn('saveState insert:', error.message);
      // Trùng khóa (đã có người tạo) hoặc bị chặn -> coi là xung đột để App nạp lại
      return { ok: false, conflict: true, error };
    }
    return { ok: true, serverTs: data?.[0]?.updated_at || nowIso };
  }

  // Đã có bản ghi -> chỉ ghi đè nếu updated_at chưa đổi (CAS)
  const { data, error } = await supabase
    .from('app_state')
    .update({ data: state, updated_at: nowIso })
    .eq('id', id).eq('updated_at', lastServerTs)
    .select('updated_at');

  if (error) { console.warn('saveState update:', error.message); return { ok: false, error }; }
  if (!data || data.length === 0) return { ok: false, conflict: true }; // người khác đã sửa
  return { ok: true, serverTs: data[0].updated_at };
}

/** Liệt kê các kỳ đã có dữ liệu CỦA PHÂN HỆ `ns` (cho lịch sử). */
export async function listPeriods(ns = '') {
  if (!supabase) return [];
  const re = idRe(ns);
  const { data, error } = await supabase
    .from('app_state').select('id, updated_at').like('id', `state_${nsPart(ns)}%`);
  if (error || !data) return [];
  return data
    .map((r) => { const m = r.id.match(re); return m ? { year: m[1], month: m[2], updated_at: r.updated_at } : null; })
    .filter(Boolean)
    .sort((a, b) => (Number(b.year) - Number(a.year)) || (Number(b.month) - Number(a.month)));
}

/** Nạp toàn bộ dữ liệu các kỳ CỦA PHÂN HỆ `ns` để vẽ xu hướng (quy mô văn phòng nên đủ nhẹ). */
export async function loadAllPeriods(ns = '') {
  if (!supabase) return [];
  const re = idRe(ns);
  const { data, error } = await supabase
    .from('app_state').select('id, data').like('id', `state_${nsPart(ns)}%`);
  if (error || !data) return [];
  return data
    .map((r) => { const m = r.id.match(re); return m ? { year: m[1], month: m[2], state: r.data } : null; })
    .filter(Boolean);
}
