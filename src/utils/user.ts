// 用户身份管理（使用 localStorage 模拟）

const USER_KEY = 'cultural_life_user';

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

// 生成随机用户ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 获取当前用户
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// 设置当前用户
export function setCurrentUser(name: string, isAdmin: boolean = false): User {
  const user: User = {
    id: generateUserId(),
    name,
    isAdmin
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// 更新用户信息
export function updateCurrentUser(updates: Partial<User>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  const updatedUser = { ...user, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

// 登出
export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// 检查是否是管理员
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.isAdmin || false;
}
