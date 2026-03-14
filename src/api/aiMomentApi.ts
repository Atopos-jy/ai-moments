import http from "@/utils/http";
import { getDashscopeApiKey } from "@/utils/apiKey";
import { DASHSCOPE_CONFIG } from "@/config/dashscope";

// ==================== 类型定义 ====================

/**
 * 通义千问 API 请求参数
 */
export interface DashscopeRequestParams {
  /** 模型名称 */
  model: string;
  /** 输入参数 */
  input: {
    /** 提示词 */
    prompt: string;
  };
  /** 生成参数 */
  parameters: {
    /** 温度参数，控制随机性 */
    temperature: number;
    /** 返回格式 */
    result_format: string;
  };
}

/**
 * 通义千问 API 响应数据
 */
export interface DashscopeResponse {
  /** 输出内容 */
  output: {
    /** 生成的文本 */
    text: string;
    /** 结束原因 */
    finish_reason: string;
  };
  /** 使用统计 */
  usage: {
    /** 输入 token 数 */
    input_tokens: number;
    /** 输出 token 数 */
    output_tokens: number;
    /** 总 token 数 */
    total_tokens: number;
  };
  /** 请求 ID */
  request_id: string;
}


/**
 * 生成朋友圈文案的参数
 */
export interface GenerateMomentParams {
  /** 用户输入的生成要求 */
  prompt: string;
  /** 场景类型（可选） */
  scene?: string;
  /** 风格类型（可选） */
  style?: string;
  /** 生成数量（可选，默认1条） */
  count?: number;
  /** 是否使用 emoji（可选，默认true） */
  useEmoji?: boolean;
  /** 是否添加话题标签 #（可选，默认false） */
  useHashtag?: boolean;
  /** 字数限制（可选，默认50-100字） */
  lengthLimit?: string;
}



/**
 * 构建朋友圈生成提示词
 * @param params 生成参数
 * @returns 完整的提示词
 */
const buildPrompt = (params: GenerateMomentParams): string => {
  const { 
    prompt, 
    scene, 
    style, 
    count = 1, 
    useEmoji = true, 
    useHashtag = false,
    lengthLimit = "50-100"
  } = params;
  
  let fullPrompt = `请帮我生成${count}条朋友圈文案。\n\n要求：${prompt}`;
  
  if (scene) {
    fullPrompt += `\n场景：${scene}`;
  }
  
  if (style) {
    fullPrompt += `\n风格：${style}`;
  }
  
  // 构建控制条件说明
  fullPrompt += `\n\n生成要求：
1. 语言自然、有感染力
2. ${useEmoji ? '请使用 emoji 增加趣味性' : '请不要使用 emoji'}
3. ${useHashtag ? '请添加相关话题标签（#标签名）' : '请不要添加话题标签'}
4. 字数控制在 ${lengthLimit} 字左右
5. 直接返回文案内容，不需要额外解释`;

  // 如果生成多条，添加编号要求
  if (count > 1) {
    fullPrompt += `\n6. 请生成${count}条不同风格的文案，每条用数字编号（1. 2. 3. ...），方便我选择`;
  }

  return fullPrompt;
};


/**
 * 调用通义千问 API 生成朋友圈文案
 * @param params 生成参数
 * @returns 生成的文案
 * @throws 错误信息
 */
export const generateMoment = async (
  params: GenerateMomentParams
): Promise<string> => {
  // 1. 获取 API Key
  const apiKey = getDashscopeApiKey(); 
  console.log("API Key 存在：", !!apiKey);

  // 2. 构建请求参数
  const requestData: DashscopeRequestParams = {
    model: DASHSCOPE_CONFIG.DEFAULT_MODEL,
    input: {
      prompt: buildPrompt(params),
    },
    parameters: {
      temperature: DASHSCOPE_CONFIG.DEFAULT_PARAMS.temperature, 
      result_format: DASHSCOPE_CONFIG.DEFAULT_PARAMS.result_format, 
    },
  };

  // 3. 发送请求（使用统一封装的 http）
  // 错误处理已在 request.ts 拦截器中统一处理
  const response = await http.post<DashscopeResponse>(
    `${DASHSCOPE_CONFIG.BASE_URL}${DASHSCOPE_CONFIG.TEXT_GENERATION_ENDPOINT}`, 
    requestData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: DASHSCOPE_CONFIG.TIMEOUT,
    }
  );

  // http 封装对于第三方 API 直接返回原始数据
  const responseData = response as unknown as DashscopeResponse;
  if (responseData?.output?.text) {
    return responseData.output.text.trim();
  }

  throw new Error("API 返回数据格式异常");
};

