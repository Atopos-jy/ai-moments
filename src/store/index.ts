import { configureStore } from "@reduxjs/toolkit";
import copywritingReducer from "./modules/copywritingSlice";

// 配置Redux仓库
export const store = configureStore({
  reducer: {
    copywriting: copywritingReducer, // 文案模块
  },
  devTools: import.meta.env.DEV, // 仅开发环境启用DevTools
});

// 导出核心类型（供Hooks使用）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
