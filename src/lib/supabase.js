import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Nếu chưa cấu hình env, supabase = null -> app vẫn chạy demo trong bộ nhớ.
export const supabase = url && key ? createClient(url, key) : null;

const STATE_ID = 'main';
const LOCAL_KEY = 'hdndthkpi_state';

export async function loadState() {
  let state = null;
  
  // 1. Đọc từ Local Storage trước (offline-first)
  try {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) state = JSON.parse(local);
  } catch (e) {
    console.warn('loadState local:', e);
  }

  // 2. Nếu có Supabase, đồng bộ từ máy chủ về
  if (supabase) {
    const { data, error } = await supabase
      .from('app_state').select('data').eq('id', STATE_ID).maybeSingle();
    if (error) { 
      console.warn('loadState supabase:', error.message); 
    } else if (data?.data) {
      const serverState = data.data;
      const localTs = state?._ts || 0;
      const serverTs = serverState._ts || 0;
      
      // Chỉ ghi đè dữ liệu local nếu dữ liệu trên server MỚI HƠN hoặc local trống
      if (serverTs >= localTs || !state) {
        state = serverState;
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
      }
    }
  }
  
  return state;
}

export async function saveState(state) {
  // Thêm mốc thời gian để đồng bộ chuẩn xác
  state._ts = Date.now();

  // Luôn lưu vào Local Storage ngay lập tức
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('saveState local:', e);
  }

  // Nếu không có kết nối cloud, chỉ báo lỗi nhẹ
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  
  // Đồng bộ ngầm lên Supabase
  const { error } = await supabase.from('app_state')
    .upsert({ id: STATE_ID, data: state, updated_at: new Date().toISOString() });
    
  if (error) { 
    console.warn('saveState supabase:', error.message); 
    return { ok: false, error }; 
  }
  
  return { ok: true };
}
