// src/utils/apiKey.ts
/**
 * AI 接口 API Key 管理工具
 * 支持通义千问/其他 AI 接口的 API Key 校验、获取
 */

/**
 * 获取通义千问 API Key
 * @throws 未配置时抛出错误
 */
export const getDashscopeApiKey = (): string => {
    const apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY;
    if (!apiKey) {
        throw new Error(
            "未配置通义千问 API Key，请在 .env 文件中设置 VITE_DASHSCOPE_API_KEY"
        );
    }
    // 额外校验格式（可选，通义千问 API Key 通常以 sk- 开头）
    if (!apiKey.startsWith("sk-")) {
        throw new Error("通义千问 API Key 格式错误，应以 sk- 开头");
    }
    return apiKey;
};

/**
 * 检查通义千问 API Key 是否配置
 * @returns 配置状态
 */
export const isDashscopeApiKeyConfigured = (): boolean => {
    try {
        getDashscopeApiKey();
        return true;
    } catch {
        return false;
    }
};

/**
 * 通用 API Key 校验函数（扩展用）
 * @param envKey 环境变量名
 * @param prefix 可选，Key 前缀（如 sk-）
 * @returns 校验结果
 */
export const checkApiKey = (envKey: string, prefix?: string): boolean => {
    const apiKey = import.meta.env[envKey as keyof ImportMetaEnv];
    if (!apiKey) return false;
    if (prefix && !apiKey.startsWith(prefix)) return false;
    return true;
};