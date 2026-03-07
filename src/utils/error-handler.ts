/**
 * 请求错误处理工具
 */
import { message } from "antd";
import type { AxiosError } from "axios";

/**
 * 错误码映射
 */
export const ERROR_CODE_MAP: Record<number, string> = {
  400: "请求参数错误",
  401: "登录已过期，请重新登录",
  403: "没有权限访问该资源",
  404: "请求的资源不存在",
  405: "请求方法不允许",
  408: "请求超时",
  500: "服务器错误，请稍后重试",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
};

/**
 * 业务错误码映射（根据实际业务调整）
 */
export const BUSINESS_ERROR_CODE_MAP: Record<number, string> = {
  1001: "用户名或密码错误",
  1002: "用户已被禁用",
  1003: "验证码错误",
  1004: "验证码已过期",
  2001: "数据不存在",
  2002: "数据已存在",
  2003: "数据已被删除",
  3001: "文件上传失败",
  3002: "文件格式不支持",
  3003: "文件大小超出限制",
};

/**
 * 业务错误接口（自定义业务异常）
 */
export interface BusinessError {
  code: number;
  message?: string;
  isAxiosError?: never; // 排除AxiosError标识，避免类型混淆
}

/**
 * 统一错误类型（覆盖所有可能的错误类型）
 */
export type RequestError = AxiosError | BusinessError | Error;

/**
 * 类型守卫：判断是否为业务错误
 */
function isBusinessError(error: unknown): error is BusinessError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as BusinessError).code === "number" &&
    !(error as AxiosError).isAxiosError
  );
}

/**
 * 处理 HTTP 错误
 * @param error Axios 错误对象
 */
export function handleHttpError(error: AxiosError): void {
  const status = error.response?.status;

  if (!status) {
    message.error("网络错误，请检查网络连接");
    return;
  }

  const errorMessage = ERROR_CODE_MAP[status] || "请求失败";
  message.error(errorMessage);
}

/**
 * 处理业务错误
 * @param code 错误码
 * @param defaultMessage 默认错误信息
 */
export function handleBusinessError(
  code: number,
  defaultMessage?: string,
): void {
  const errorMessage =
    BUSINESS_ERROR_CODE_MAP[code] || defaultMessage || "操作失败";
  message.error(errorMessage);
}

/**
 * 处理网络错误
 */
export function handleNetworkError(): void {
  if (!window.navigator.onLine) {
    message.error("网络连接失败，请检查网络");
  } else {
    message.error("网络异常，请稍后重试");
  }
}

/**
 * 处理超时错误
 */
export function handleTimeoutError(): void {
  message.error("请求超时，请稍后重试");
}

/**
 * 统一错误处理
 * @param error 错误对象（覆盖Axios错误/业务错误/通用Error）
 */
export function handleError(error: RequestError): void {
  console.error("请求错误:", error);

  // Axios 错误
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;

    // 请求超时
    if (
      axiosError.code === "ECONNABORTED" ||
      (axiosError.message && axiosError.message.includes("timeout"))
    ) {
      handleTimeoutError();
      return;
    }

    // 网络错误（无响应）
    if (!axiosError.response) {
      handleNetworkError();
      return;
    }

    // HTTP 状态码错误
    handleHttpError(axiosError);
    return;
  }

  // 业务错误（自定义错误码）
  if (isBusinessError(error)) {
    handleBusinessError(error.code, error.message);
    return;
  }

  // 通用 Error 错误
  if (error instanceof Error) {
    message.error(error.message || "操作失败");
    return;
  }

  // 兜底错误提示
  message.error("操作失败");
}
