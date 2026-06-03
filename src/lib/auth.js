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

// Gửi liên kết/mã đăng nhập tới email (magic link / OTP) — dùng cho lần đầu kích hoạt / quên mật khẩu
export async function signInWithOtp(email) {
  if (!supabase) return { error: { message: 'Hệ thống chưa cấu hình máy chủ.' } };
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
}

// Đăng nhập bằng email + mật khẩu (các lần sau khi đã tạo mật khẩu)
export async function signInWithPassword(email, password) {
  if (!supabase) return { error: { message: 'Hệ thống chưa cấu hình máy chủ.' } };
  return supabase.auth.signInWithPassword({ email, password });
}

// Đặt / đổi mật khẩu cho người đang đăng nhập; đánh dấu pw_set=true trong user_metadata
export async function setPassword(password) {
  if (!supabase) return { error: { message: 'Hệ thống chưa cấu hình máy chủ.' } };
  return supabase.auth.updateUser({ password, data: { pw_set: true } });
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
