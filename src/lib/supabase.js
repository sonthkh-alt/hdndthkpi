import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Nếu chưa cấu hình env, supabase = null -> app vẫn chạy demo trong bộ nhớ.
export const supabase = url && key ? createClient(url, key) : null;

const LOCAL_PREFIX = 'hdndthkpi_state';

// Mỗi kỳ (tháng/năm) lưu thành một bản ghi riêng -> có lịch sử, không ghi đè kỳ khác.
const periodId = (p) => `state_${p.year}_${p.month}`;
const localKey = (p) => `${LOCAL_PREFIX}_${p.year}_${p.month}`;

/**
 * Nạp dữ liệu của một kỳ.
 * Trả về { state, serverTs, migrated } — serverTs dùng cho khóa lạc quan khi lưu.
 */
export async function loadState(period) {
  const id = periodId(period);
  const lkey = localKey(period);

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

  // 3) Chưa có bản ghi theo kỳ — di trú dữ liệu cũ (bản 'main') nếu đúng kỳ của nó
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
export async function saveState(period, state, lastServerTs) {
  state._ts = Date.now();
  const id = periodId(period);
  const lkey = localKey(period);

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

/** Liệt kê các kỳ đã có dữ liệu (cho lịch sử). */
export async function listPeriods() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('app_state').select('id, updated_at').like('id', 'state_%');
  if (error || !data) return [];
  return data
    .map((r) => { const m = r.id.match(/^state_(\d+)_(\d+)$/); return m ? { year: m[1], month: m[2], updated_at: r.updated_at } : null; })
    .filter(Boolean)
    .sort((a, b) => (Number(b.year) - Number(a.year)) || (Number(b.month) - Number(a.month)));
}

/** Nạp toàn bộ dữ liệu các kỳ để vẽ xu hướng (quy mô văn phòng nên đủ nhẹ). */
export async function loadAllPeriods() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('app_state').select('id, data').like('id', 'state_%');
  if (error || !data) return [];
  return data
    .map((r) => { const m = r.id.match(/^state_(\d+)_(\d+)$/); return m ? { year: m[1], month: m[2], state: r.data } : null; })
    .filter(Boolean);
}
