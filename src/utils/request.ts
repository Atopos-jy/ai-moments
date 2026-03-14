/**
 * Axios 请求封装
 * 包含请求拦截器、响应拦截器、错误处理
 */

import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { requestConfig, getToken, TOKEN_CONFIG } from "@/config/request";
import { message } from "antd";

/**
 * 创建 Axios 实例
 */
const service: AxiosInstance = axios.create(requestConfig);

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加 Token
    const token = getToken();
    if (token && config.headers) {
      config.headers[TOKEN_CONFIG.headerKey] = `${TOKEN_CONFIG.prefix}${token}`;
    }

    // 添加时间戳防止缓存（GET 请求）
    if (config.method === "get") {
      config.params = {
        ...config.params,
        // _t: Date.now(),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;

    // 如果是下载文件，直接返回
    if (config.responseType === "blob") {
      return response;
    }

    // 根据后端返回的状态码进行处理
    // 兼容标准 REST API (code) 和第三方 API (如通义千问直接返回数据)
    const code = data.code;

    // 如果没有 code 字段，说明是第三方 API 直接返回的数据
    if (code === undefined) {
      return data;
    }

    // 成功
    if (code === 200 || code === 0) {
      return data;
    }

    // Token 过期或无效
    if (code === 401) {
      message.error("登录已过期，请重新登录");
      // 清除 Token
      // removeToken()
      // 跳转到登录页
      // router.push('/login')
      return Promise.reject(new Error(data.message || "登录已过期"));
    }

    // 无权限
    if (code === 403) {
      message.error("没有权限访问该资源");
      return Promise.reject(new Error(data.message || "没有权限"));
    }

    // 其他错误
    message.error(data.message || "请求失败");
    return Promise.reject(new Error(data.message || "请求失败"));
  },
  (error: AxiosError) => {
    console.error("响应错误:", error);

    // 请求超时
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      message.error("请求超时，请稍后重试");
      return Promise.reject(new Error("请求超时"));
    }

    // 网络错误
    if (!window.navigator.onLine) {
      message.error("网络连接失败，请检查网络");
      return Promise.reject(new Error("网络连接失败"));
    }

    // HTTP 错误
    const status = error.response?.status;
    switch (status) {
      case 400:
        message.error("请求参数错误");
        break;
      case 401:
        message.error("登录已过期，请重新登录");
        // removeToken()
        // router.push('/login')
        break;
      case 403:
        message.error("没有权限访问该资源");
        break;
      case 404:
        message.error("请求的资源不存在");
        break;
      case 500:
        message.error("服务器错误，请稍后重试");
        break;
      case 502:
        message.error("网关错误");
        break;
      case 503:
        message.error("服务不可用");
        break;
      case 504:
        message.error("网关超时");
        break;
      default:
        message.error(error.message || "请求失败");
    }

    return Promise.reject(error);
  },
);

/**
 * 导出 Axios 实例
 */
export default service;
