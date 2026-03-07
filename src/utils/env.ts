/**
 * 环境变量工具类
 * 用于获取和处理环境变量
 */

/**
 * 获取环境变量
 */
export function getEnv(): ImportMetaEnv {
  return import.meta.env;
}

/**
 * 获取环境标识
 */
export function getEnvMode(): string {
  return import.meta.env.VITE_ENV;
}

/**
 * 是否为开发环境
 */
export function isDev(): boolean {
  return (
    import.meta.env.VITE_ENV === "development" ||
    import.meta.env.VITE_ENV === "local"
  );
}

/**
 * 是否为测试环境
 */
export function isTest(): boolean {
  return import.meta.env.VITE_ENV === "test";
}

/**
 * 是否为生产环境
 */
export function isProd(): boolean {
  return import.meta.env.VITE_ENV === "production";
}

/**
 * 获取 API 基础路径
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL;
}

/**
 * 获取完整的 API 地址
 * @param path API 路径
 * @returns 完整的 API 地址
 */
export function getApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * 获取应用标题
 */
export function getAppTitle(): string {
  return import.meta.env.VITE_APP_TITLE;
}

/**
 * 获取应用版本
 */
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION;
}

/**
 * 是否启用 Mock 数据
 */
export function getMock(): boolean {
  return import.meta.env.VITE_USE_MOCK;
}

/**
 * 获取 Token 存储 key
 */
export function getUserRole(): string {
  return import.meta.env.VITE_TOKEN_KEY;
}

/**
 * 获取上传文件大小限制（字节）
 */
export function getUploadSize(): number {
  return import.meta.env.VITE_UPLOAD_SIZE * 1024 * 1024;
}

/**
 * 获取 CDN 地址
 */
export function getCdnUrl(): string {
  return import.meta.env.VITE_CDN_URL || "";
}

/**
 * 打印环境信息
 */
export function printEnvInfo(): void {
  console.log(
    "%c环境信息",
    "color: #1890ff; font-weight: bold; font-size: 14px;",
  );

  console.log("环境:", getEnvMode());

  console.log("应用标题:", getAppTitle());

  console.log("应用版本:", getAppVersion());

  console.log("API 基础路径:", getApiBaseUrl());

  console.log("是否启用 Mock:", getMock());
}
