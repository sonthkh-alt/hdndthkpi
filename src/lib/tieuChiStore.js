import { supabase } from './supabase';

// ============================================================================
//  LƯU TRỮ & ĐĂNG NHẬP module "Đánh giá tiêu chí HĐND tỉnh, xã, phường".
//  • Toàn bộ dữ liệu nằm ở bảng app_state, id = 'tc_data' (KHÔNG theo kỳ tháng).
//  • Đơn vị (xã, phường / Ban, Tổ đại biểu, Văn phòng…) đăng nhập bằng
//    MÃ ĐƠN VỊ + MÃ TRUY CẬP do Thường trực HĐND tỉnh cấp.
//    Mã truy cập KHÔNG lưu dạng chữ: chỉ lưu chuỗi băm SHA-256 của "mã::mật khẩu"
//    → dòng dữ liệu có thể cho đọc công khai mà không lộ mã truy cập.
//  • Ghi dữ liệu của đơn vị đi qua hàm RPC `tc_unit_save` (security definer,
//    kiểm tra chuỗi băm ở máy chủ) — xem BƯỚC 5 trong supabase/schema.sql.
//    Chưa chạy SQL đó → module vẫn dùng được nhưng dữ liệu chỉ lưu trên máy này.
// ============================================================================
const KEY = 'hdndkpi_tc_data';
const SESS_KEY = 'hdndkpi_tc_session';
const ROW_ID = 'tc_data';

export const EMPTY_TC = { units: [], evals: {}, cfg: { year: String(new Date().getFullYear()), open: true }, updatedAt: '' };
export const evalKey = (unitId, year) => `${unitId}::${year}`;

const normalize = (d) => ({
  units: Array.isArray(d?.units) ? d.units : [],
  evals: (d && typeof d.evals === 'object' && d.evals) || {},
  cfg: { year: String(new Date().getFullYear()), open: true, ...((d && typeof d.cfg === 'object' && d.cfg) || {}) },
  updatedAt: d?.updatedAt || '',
});

// ---- Băm mã truy cập (SHA-256) --------------------------------------------
export async function hashPin(code, pin) {
  const text = `${String(code || '').trim().toLowerCase()}::${String(pin || '')}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Sinh mã truy cập ngẫu nhiên dễ đọc (8 ký tự, bỏ ký tự dễ nhầm).
export function randomPin(len = 8) {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const a = new Uint32Array(len); crypto.getRandomValues(a);
  return Array.from(a, (n) => abc[n % abc.length]).join('');
}

// Mã đơn vị gợi ý từ tên (không dấu, viết liền, tối đa 14 ký tự).
export function slugCode(name, kind = 'xa') {
  const s = String(name || '').normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/đ/gi, 'd').replace(/[^a-zA-Z0-9]+/g, '').toUpperCase().slice(0, 11);
  return `${kind === 'tinh' ? 'T' : 'X'}-${s || 'DONVI'}`;
}

// ---- Đọc / ghi -------------------------------------------------------------
export function readTC() {
  try { const raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch { /* bỏ qua */ }
  return normalize(EMPTY_TC);
}
const cache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* bỏ qua */ } return d; };

export async function fetchTC() {
  if (!supabase) return readTC();
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', ROW_ID).maybeSingle();
    if (!error && data?.data) return cache(normalize(data.data));
  } catch (e) { console.warn('fetchTC:', e); }
  return readTC();
}

// Ghi TOÀN BỘ dữ liệu — chỉ Thường trực/Quản trị (cần phiên đăng nhập Supabase).
export async function saveTC(d) {
  const doc = cache(normalize({ ...d, updatedAt: new Date().toISOString() }));
  if (!supabase) return { ok: false, reason: 'no-supabase', doc };
  const { error } = await supabase.from('app_state').upsert({ id: ROW_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveTC:', error.message); return { ok: false, error, doc }; }
  return { ok: true, doc };
}

// ---- Đăng nhập đơn vị ------------------------------------------------------
// Trả về { ok, unit } — so khớp chuỗi băm ở phía trình duyệt (dữ liệu đơn vị đọc công khai).
export async function unitLogin(doc, code, pin) {
  const c = String(code || '').trim().toLowerCase();
  const unit = (doc.units || []).find((u) => String(u.code || '').trim().toLowerCase() === c);
  if (!unit) return { ok: false, reason: 'no-unit' };
  if (unit.active === false) return { ok: false, reason: 'locked' };
  const h = await hashPin(unit.code, pin);
  if (h !== unit.hash) return { ok: false, reason: 'bad-pin' };
  return { ok: true, unit, hash: h };
}

export function readUnitSession() {
  try { const raw = localStorage.getItem(SESS_KEY); if (raw) return JSON.parse(raw); } catch { /* bỏ qua */ }
  return null;
}
export const writeUnitSession = (s) => { try { s ? localStorage.setItem(SESS_KEY, JSON.stringify(s)) : localStorage.removeItem(SESS_KEY); } catch { /* bỏ qua */ } };

// Đơn vị lưu phiếu tự đánh giá của CHÍNH MÌNH (qua RPC có kiểm tra chuỗi băm).
// Không có RPC (chưa chạy SQL) → chỉ lưu cache trên máy, báo lại để hiển thị cảnh báo.
export async function saveUnitEval(code, hash, year, record) {
  const local = readTC();
  const unit = (local.units || []).find((u) => u.code === code);
  if (unit) { local.evals[evalKey(unit.id, year)] = record; cache(local); }
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  try {
    const { error } = await supabase.rpc('tc_unit_save', { p_code: code, p_hash: hash, p_year: String(year), p_record: record });
    if (error) { console.warn('tc_unit_save:', error.message); return { ok: false, reason: 'no-rpc', error }; }
    return { ok: true };
  } catch (e) { console.warn('tc_unit_save:', e); return { ok: false, reason: 'no-rpc' }; }
}

// ---- Tiện ích quản lý đơn vị ----------------------------------------------
let seq = 1;
export const newUnitId = () => `u${Date.now().toString(36)}${(seq++).toString(36)}`;

export async function makeUnit({ name, kind = 'xa', code, pin, contact = '', phone = '' }) {
  const c = (code || slugCode(name, kind)).trim().toUpperCase();
  const p = pin || randomPin();
  return { unit: { id: newUnitId(), name: String(name || '').trim(), kind, code: c, hash: await hashPin(c, p), contact, phone, active: true }, pin: p };
}

// Nhập hàng loạt: mỗi dòng "Tên đơn vị" hoặc "Tên đơn vị | MÃ".
export async function parseUnitLines(text, kind = 'xa', existing = []) {
  const taken = new Set(existing.map((u) => String(u.code || '').toUpperCase()));
  const names = new Set(existing.filter((u) => u.kind === kind).map((u) => String(u.name || '').toLowerCase()));
  const out = [];
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const [name, code] = line.split('|').map((s) => s.trim());
    if (!name) continue;
    if (names.has(name.toLowerCase())) continue; // bỏ qua đơn vị trùng tên (kể cả trùng trong chính danh sách dán vào)
    names.add(name.toLowerCase());
    let c = (code || slugCode(name, kind)).toUpperCase();
    let i = 2; while (taken.has(c)) { c = `${(code || slugCode(name, kind)).toUpperCase()}${i++}`; }
    taken.add(c);
    const made = await makeUnit({ name, kind, code: c });
    out.push(made);
  }
  return out; // [{unit, pin}]
}
