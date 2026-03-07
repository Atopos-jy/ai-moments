/**
 * Axios 请求配置
 * 统一的请求拦截、响应处理、错误处理
 */

import { getApiBaseUrl } from "@/utils/env";

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * Token 相关配置
 */
export const TOKEN_CONFIG = {
  // Token 存储 key
  key: "ACCESS_TOKEN",
  // Token 请求头字段名
  headerKey: "Authorization",
  // Token 前缀
  prefix: "Bearer ",
};

/**
 * 请求配置
 */
export const requestConfig = {
  // API 基础路径
  baseURL: getApiBaseUrl(),

  // 请求超时时间
  timeout: REQUEST_TIMEOUT,

  // 请求头
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },

  // 是否携带 cookie
  withCredentials: true,
};

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_CONFIG.key);
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_CONFIG.key, token);
}

/**
 * 移除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_CONFIG.key);
}

/**
 * 检查 Token 是否存在
 */
export function hasToken(): boolean {
  return !!getToken();
}
