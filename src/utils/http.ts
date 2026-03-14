/**
 * HTTP 请求方法封装
 * 提供 GET、POST、PUT、DELETE 等常用方法
 */
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import request from "./request";

/**
 * 通用响应接口
 * 兼容标准 REST API 和第三方 API（如通义千问）
 */
export interface ApiResponse<T> {
  /** 业务状态码（标准 REST API） */
  code?: number;
  /** 提示信息（标准 REST API） */
  message?: string;
  /** 数据（标准 REST API） */
  data?: T;
  /** 
   * 直接响应内容（第三方 API 如通义千问）
   * 当第三方 API 直接返回数据而不包装时，整个响应对象就是 T
   */
  [key: string]: unknown;
}

/**
 * 分页参数接口
 */
export interface PageParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应接口
 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 请求参数类型（覆盖GET的params/POST的data）
 * 限制为键值对类型，更符合HTTP请求参数规范
 */
export type RequestParams = Record<
  string,
  string | number | boolean | null | undefined | (string | number)[]
>;

/**
 * HTTP 请求类
 */
class Http {
  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数（键值对类型）
   * @param config 请求配置
   */
  get<T>(
    url: string,
    params?: RequestParams,
    config?: Omit<AxiosRequestConfig, "params">, // 排除params避免重复定义
  ): Promise<ApiResponse<T>> {
    return request.get(url, {
      params,
      ...config,
    } as InternalAxiosRequestConfig);
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据（泛型定义，支持任意结构化数据）
   * @param config 请求配置
   */
  post<T, D = unknown>( // D: 请求数据类型，默认unknown（需显式指定更安全）
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.post(url, data, config);
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.put(url, data, config);
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  delete<T>(
    url: string,
    params?: RequestParams,
    config?: Omit<AxiosRequestConfig, "params">,
  ): Promise<ApiResponse<T>> {
    return request.delete(url, {
      params,
      ...config,
    } as InternalAxiosRequestConfig);
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request.patch(url, data, config);
  }

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData 表单数据（明确FormData类型）
   * @param config 请求配置
   */
  upload<T = unknown>(
    url: string,
    formData: FormData,
    config?: Omit<AxiosRequestConfig, "headers">, // 排除headers避免覆盖
  ): Promise<ApiResponse<T>> {
    return request.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    } as InternalAxiosRequestConfig);
  }

  /**
   * 下载文件
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  download(
    url: string,
    params?: RequestParams,
    config?: Omit<AxiosRequestConfig, "params" | "responseType">,
  ): Promise<AxiosResponse<Blob>> {
    // 明确响应类型为Blob
    return request.get(url, {
      params,
      responseType: "blob",
      ...config,
    } as InternalAxiosRequestConfig);
  }

  /**
   * 分页查询
   * @param url 请求地址
   * @param params 分页参数（强制PageParams类型）
   * @param config 请求配置
   */
  getPage<T = unknown>(
    url: string,
    params: PageParams & RequestParams, // 合并分页参数和其他查询参数
    config?: Omit<AxiosRequestConfig, "params">,
  ): Promise<ApiResponse<PageResponse<T>>> {
    return request.get(url, {
      params,
      ...config,
    } as InternalAxiosRequestConfig);
  }
}

/**
 * 导出 HTTP 实例
 */
export const http = new Http();

/**
 * 导出默认实例
 */
export default http;
