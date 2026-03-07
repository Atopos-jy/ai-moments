/**
 * 主题配置文件（React + Ant Design 适配版）
 * 定义应用的主题色、明暗模式等样式配置
 */

/**
 * 主题模式类型（AntD 原生支持 light/dark）
 */
export type ThemeMode = "light" | "dark";

/**
 * 主题色配置
 */
export interface ThemeColor {
  name: string; // 主题色名称
  value: string; // 主题色值
  label: string; // 显示标签（用于国际化 key）
}

/**
 * 预设主题色列表（与 AntD 预设色值对齐）
 */
export const THEME_COLORS: ThemeColor[] = [
  {
    name: "blue",
    value: "#1890ff", // AntD 默认主色
    label: "theme.colors.blue",
  },
  {
    name: "purple",
    value: "#722ed1",
    label: "theme.colors.purple",
  },
  {
    name: "cyan",
    value: "#13c2c2",
    label: "theme.colors.cyan",
  },
  {
    name: "green",
    value: "#52c41a",
    label: "theme.colors.green",
  },
  {
    name: "magenta",
    value: "#eb2f96",
    label: "theme.colors.magenta",
  },
  {
    name: "red",
    value: "#f5222d",
    label: "theme.colors.red",
  },
  {
    name: "orange",
    value: "#fa8c16",
    label: "theme.colors.orange",
  },
];

/**
 * 默认主题色
 */
export const DEFAULT_THEME_COLOR = THEME_COLORS[0]?.value || "#1890ff";

/**
 * 默认主题模式
 */
export const DEFAULT_THEME_MODE: ThemeMode = "light";

/**
 * AntD 主题配置映射（适配 ConfigProvider 的 theme 属性）
 */
export const getAntdThemeConfig = (mode: ThemeMode, primaryColor: string) => {
  // 基础主题配置（覆盖 AntD 原生变量）
  const baseConfig = {
    token: {
      colorPrimary: primaryColor, // 主色
      borderRadius: 4, // 圆角（可选）
    },
    algorithm: mode === "dark" ? ["darkAlgorithm"] : ["defaultAlgorithm"], // 明暗模式算法
  };

  // 扩展自定义样式变量（用于全局 CSS）
  const cssVariables = {
    light: {
      "--text-color": "rgba(0, 0, 0, 0.85)",
      "--text-color-secondary": "rgba(0, 0, 0, 0.65)",
      "--background-color": "#f0f2f5",
      "--background-color-white": "#ffffff",
      "--border-color": "#d9d9d9",
    },
    dark: {
      "--text-color": "rgba(255, 255, 255, 0.85)",
      "--text-color-secondary": "rgba(255, 255, 255, 0.65)",
      "--background-color": "#141414",
      "--background-color-white": "#2a2a2a",
      "--border-color": "#434343",
    },
  };

  // 注入 CSS 变量到根节点
  const root = document.documentElement;
  Object.entries(cssVariables[mode]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  return baseConfig;
};
