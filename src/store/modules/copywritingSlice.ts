// src/store/slices/copywritingSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CopywritingRecord, Collect } from "@/type";

// 定义状态类型
interface CopywritingState {
  records: CopywritingRecord[]; // 文案记录
  collects: Collect[]; // 收藏列表
  loading: boolean; // 加载状态
  currentCopywriting: string; // 当前生成的文案
}

// 初始状态
const initialState: CopywritingState = {
  records: [],
  collects: [],
  loading: false,
  currentCopywriting: "",
};

// 创建Slice（包含reducer和action）
export const copywritingSlice = createSlice({
  name: "copywriting", // Slice名称（唯一）
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // 设置当前生成的文案
    setCurrentCopywriting: (state, action: PayloadAction<string>) => {
      state.currentCopywriting = action.payload;
    },
    // 保存文案记录
    saveRecord: (
      state,
      action: PayloadAction<Omit<CopywritingRecord, "id">>,
    ) => {
      const newRecord: CopywritingRecord = {
        id: Date.now(), // 时间戳作为唯一ID
        ...action.payload,
        createTime: new Date().toLocaleDateString(),
      };
      state.records.push(newRecord);
    },
    // 添加收藏
    addCollect: (state, action: PayloadAction<string>) => {
      const newCollect: Collect = {
        id: Date.now(),
        content: action.payload,
        addTime: new Date().toLocaleDateString(),
      };
      state.collects.push(newCollect);
    },
    // 加载历史记录（模拟接口数据）
    loadRecords: (state, action: PayloadAction<CopywritingRecord[]>) => {
      state.records = action.payload;
    },
  },
});

// 导出Action Creator（供组件调用）
export const {
  setLoading,
  setCurrentCopywriting,
  saveRecord,
  addCollect,
  loadRecords,
} = copywritingSlice.actions;

// 导出Reducer（供Store注册）
export default copywritingSlice.reducer;
