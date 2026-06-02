import { supabase } from './supabase';

// Lấy phiên đăng nhập hiện tại (null nếu chưa đăng nhập / chưa cấu hình máy chủ)
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Đăng ký lắng nghe thay đổi trạng thái đăng nhập; trả về hàm hủy đăng ký
export function onAuthChange(cb) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

// Gửi liên kết/mã đăng nhập tới email (magic link / OTP)
export async function signInWithOtp(email) {
  if (!supabase) return { error: { message: 'Hệ thống chưa cấu hình máy chủ.' } };
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

// Lấy hồ sơ phân quyền của người đang đăng nhập
export async function getMyProfile() {
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, role, department')
    .eq('id', session.user.id)
    .maybeSingle();
  if (error) { console.warn('getMyProfile:', error.message); return null; }
  return data;
}
