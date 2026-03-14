// src/components/AIMomentGenerator.tsx
// AI 朋友圈文案生成器组件

import { useState, useCallback } from "react";
import { Input, Button, message, Card, Alert, Spin } from "antd";
import { CopyOutlined, SendOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  generateMoment,
  type GenerateMomentParams,
} from "@/api/aiMomentApi";
import { isDashscopeApiKeyConfigured } from "@/utils/apiKey";

const { TextArea } = Input;

// ==================== 类型定义 ====================

/**
 * 组件状态类型
 */
interface GeneratorState {
  /** 用户输入的生成要求 */
  inputText: string;
  /** 生成的结果 */
  generatedText: string;
  /** 是否正在生成中 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否已复制 */
  isCopied: boolean;
}

// ==================== 组件 ====================

/**
 * AI 朋友圈文案生成器组件
 * 提供文本输入、生成按钮、结果展示和复制功能
 */
const AIMomentGenerator = () => {
  // ==================== 状态管理 ====================
  const [state, setState] = useState<GeneratorState>({
    inputText: "",
    generatedText: "",
    isLoading: false,
    error: null,
    isCopied: false,
  });

  // ==================== 验证 ====================
  const apiKeyConfigured = isDashscopeApiKeyConfigured();

  // ==================== 事件处理 ====================

  /**
   * 处理输入变化
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setState((prev) => ({
        ...prev,
        inputText: e.target.value,
        error: null, // 清除错误
      }));
    },
    []
  );

  /**
   * 处理生成按钮点击
   */
  const handleGenerate = useCallback(async () => {
    // 验证输入
    if (!state.inputText.trim()) {
      message.warning("请输入生成要求");
      return;
    }

    // 验证 API Key
    if (!apiKeyConfigured) {
      setState((prev) => ({
        ...prev,
        error: "未配置 API Key，请在 src/env/.env 文件中设置 VITE_DASHSCOPE_API_KEY",
      }));
      return;
    }

    // 设置加载状态
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      generatedText: "",
      isCopied: false,
    }));

    try {
      // 调用 API
      const params: GenerateMomentParams = {
        prompt: state.inputText.trim(),
      };

      const result = await generateMoment(params);

      console.log(result);
      
      // 更新成功状态
      setState((prev) => ({
        ...prev,
        generatedText: result,
        isLoading: false,
      }));

      message.success("生成成功！");
    } catch (error) {
      // 更新错误状态
      const errorMessage =
        error instanceof Error ? error.message : "生成失败，请重试";
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      message.error(errorMessage);
    }
  }, [state.inputText, apiKeyConfigured]);

  /**
   * 处理复制按钮点击
   */
  const handleCopy = useCallback(async () => {
    if (!state.generatedText) return;

    try {
      await navigator.clipboard.writeText(state.generatedText);
      setState((prev) => ({ ...prev, isCopied: true }));
      message.success("已复制到剪贴板");

      // 3秒后重置复制状态
      setTimeout(() => {
        setState((prev) => ({ ...prev, isCopied: false }));
      }, 3000);
    } catch {
      message.error("复制失败，请手动复制");
    }
  }, [state.generatedText]);

  /**
   * 清空输入
   */
  const handleClear = useCallback(() => {
    setState({
      inputText: "",
      generatedText: "",
      isLoading: false,
      error: null,
      isCopied: false,
    });
  }, []);

  // ==================== 渲染 ====================

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {/* API Key 未配置警告 */}
      {!apiKeyConfigured && (
        <Alert
          message="API Key 未配置"
          description="请在 src/env/.env 文件中设置 VITE_DASHSCOPE_API_KEY，否则无法使用 AI 生成功能"
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      {/* 错误提示 */}
      {state.error && (
        <Alert
          message="生成失败"
          description={state.error}
          type="error"
          showIcon
          closable
          onClose={() => setState((prev) => ({ ...prev, error: null }))}
          className="mb-4"
        />
      )}

      {/* 输入区域 */}
      <Card className="mb-4 shadow-sm" title="📝 输入你的要求">
        <TextArea
          value={state.inputText}
          onChange={handleInputChange}
          placeholder="例如：周末和朋友去吃火锅，很开心，想要一条有趣的文案"
          rows={4}
          maxLength={200}
          showCount
          disabled={state.isLoading}
          className="mb-4"
        />

        {/* 按钮组 */}
        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={state.isLoading}
            disabled={!state.inputText.trim() || !apiKeyConfigured}
            onClick={handleGenerate}
            className="flex-1"
            size="large"
          >
            {state.isLoading ? "生成中..." : "生成文案"}
          </Button>

          {state.inputText && (
            <Button onClick={handleClear} disabled={state.isLoading}>
              清空
            </Button>
          )}
        </div>
      </Card>

      {/* 加载中 */}
      {state.isLoading && (
        <Card className="mb-4 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">AI 正在生成文案，请稍候...</p>
          </div>
        </Card>
      )}

      {/* 生成结果 */}
      {state.generatedText && !state.isLoading && (
        <Card
          className="shadow-sm"
          title="✨ 生成结果"
          extra={
            <Button
              type={state.isCopied ? "default" : "primary"}
              icon={state.isCopied ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              size="small"
            >
              {state.isCopied ? "已复制" : "复制"}
            </Button>
          }
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {state.generatedText}
            </p>
          </div>

          {/* 提示信息 */}
          <div className="mt-4 text-xs text-gray-400">
            <p>💡 提示：如果不满意，可以修改要求后重新生成</p>
          </div>
        </Card>
      )}

      {/* 使用说明 */}
      {!state.generatedText && !state.isLoading && (
        <Card className="mt-4 shadow-sm bg-blue-50 border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 使用技巧</h4>
          <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
            <li>描述具体场景，如"周末探店"、"旅行风景"、"工作感悟"</li>
            <li>说明想要的风格，如"幽默搞笑"、"文艺清新"、"正能量"</li>
            <li>可以添加关键词，如"火锅、朋友、开心"</li>
            <li>越具体的描述，生成的文案越符合预期</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default AIMomentGenerator;
