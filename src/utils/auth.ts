/**
 * 用户认证工具函数
 * 纯前端实现，使用 localStorage 模拟用户数据库
 */

// ==================== 类型定义 ====================

/**
 * 用户信息
 */
export interface User {
  /** 用户ID */
  id: string;
  /** 用户名/手机号/邮箱 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 密码（明文存储，仅用于演示） */
  password: string;
  /** 头像 */
  avatar?: string;
  /** 注册时间 */
  createdAt: string;
}

/**
 * 登录用户信息（不包含敏感信息）
 */
export interface LoginUser {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

// ==================== 常量 ====================

/** localStorage 键名 */
const STORAGE_KEYS = {
  /** 用户列表 */
  USERS: 'ai_moments_users',
  /** 当前登录用户 */
  CURRENT_USER: 'ai_moments_current_user',
  /** 登录后跳转地址 */
  REDIRECT_FROM: 'ai_moments_redirect_from',
} as const;

// ==================== 用户管理 ====================

/**
 * 获取所有用户列表
 */
const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

/**
 * 保存用户列表
 */
const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * 根据用户名查找用户
 */
const findUser = (username: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.username === username);
};

// ==================== 注册 ====================

/**
 * 用户注册
 * @param username - 用户名/手机号/邮箱
 * @param password - 密码
 * @returns 注册结果
 */
export const register = (username: string, password: string): { success: boolean; message: string } => {
  // 校验参数
  if (!username || !password) {
    return { success: false, message: '用户名和密码不能为空' };
  }

  if (password.length < 6) {
    return { success: false, message: '密码长度至少6位' };
  }

  // 检查用户是否已存在
  if (findUser(username)) {
    return { success: false, message: '用户已存在，请直接登录' };
  }

  // 创建新用户
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    nickname: username.slice(0, 3) + '***',
    createdAt: new Date().toISOString(),
  };

  // 保存用户
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  return { success: true, message: '注册成功' };
};

// ==================== 登录 ====================

/**
 * 用户登录
 * @param username - 用户名/手机号/邮箱
 * @param password - 密码
 * @returns 登录结果
 */
export const login = (username: string, password: string): { success: boolean; message: string; user?: LoginUser } => {
  // 校验参数
  if (!username || !password) {
    return { success: false, message: '用户名和密码不能为空' };
  }

  // 查找用户
  const user = findUser(username);
  if (!user) {
    return { success: false, message: '用户不存在，请先注册' };
  }

  // 校验密码
  if (user.password !== password) {
    return { success: false, message: '密码错误' };
  }

  // 保存登录状态
  const loginUser: LoginUser = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(loginUser));

  return { success: true, message: '登录成功', user: loginUser };
};

// ==================== 登录状态 ====================

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = (): LoginUser | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
  return !!getCurrentUser();
};

/**
 * 退出登录
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.REDIRECT_FROM);
};

// ==================== 重定向 ====================

/**
 * 保存登录后跳转地址
 */
export const setRedirectFrom = (path: string): void => {
  sessionStorage.setItem(STORAGE_KEYS.REDIRECT_FROM, path);
};

/**
 * 获取登录后跳转地址
 */
export const getRedirectFrom = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.REDIRECT_FROM);
};

/**
 * 清除登录后跳转地址
 */
export const clearRedirectFrom = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_FROM);
};

// ==================== 快捷登录（演示用） ====================

/**
 * 创建演示账号（如果没有用户）
 */
export const createDemoUser = (): void => {
  const users = getUsers();
  if (users.length === 0) {
    register('demo', '123456');
    console.log('已创建演示账号：用户名 demo，密码 123456');
  }
};

// ==================== 收藏/历史记录关联 ====================

/**
 * 获取当前用户的存储键名
 * @param type - 存储类型
 */
export const getUserStorageKey = (type: 'collects' | 'records'): string => {
  const user = getCurrentUser();
  const userId = user?.id || 'guest';
  return `ai_moments_${type}_${userId}`;
};

export default {
  register,
  login,
  getCurrentUser,
  isLoggedIn,
  logout,
  setRedirectFrom,
  getRedirectFrom,
  clearRedirectFrom,
  createDemoUser,
  getUserStorageKey,
};
