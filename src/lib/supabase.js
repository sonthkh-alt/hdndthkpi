import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Nếu chưa cấu hình env, supabase = null -> app vẫn chạy demo trong bộ nhớ.
export const supabase = url && key ? createClient(url, key) : null;

const STATE_ID = 'main';

export async function loadState() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('app_state').select('data').eq('id', STATE_ID).maybeSingle();
  if (error) { console.warn('loadState:', error.message); return null; }
  return data?.data ?? null;
}

export async function saveState(state) {
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  const { error } = await supabase.from('app_state')
    .upsert({ id: STATE_ID, data: state, updated_at: new Date().toISOString() });
  if (error) { console.warn('saveState:', error.message); return { ok: false, error }; }
  return { ok: true };
}
