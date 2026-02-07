import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 获取带有用户ID的Supabase客户端
export function getSupabaseWithUser() {
  const userStr = localStorage.getItem('cultural_life_user');
  let userId = '';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId = user.id || '';
    } catch {
      // 忽略解析错误
    }
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-user-id': userId
      }
    }
  });
}
