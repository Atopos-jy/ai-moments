
/** 通义千问 API 配置 */
export const DASHSCOPE_CONFIG = {
    // API 路径配置
    BASE_URL: "/api/dashscope",
    TEXT_GENERATION_ENDPOINT: "/api/v1/services/aigc/text-generation/generation",
    // 默认模型配置
    DEFAULT_MODEL: "qwen-turbo",
    // 生成参数默认值
    DEFAULT_PARAMS: {
        temperature: 0.8,
        result_format: "text" as const, // 用 const 断言确保类型安全
    },
    // 请求超时
    TIMEOUT: 30000,
};