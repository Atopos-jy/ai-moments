// src/store/modules/copywritingSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { 
  CopywritingRecord, 
  Collect, 
  GenerateParams, 
  GeneratedCopywriting,
  SceneType,
  StyleType 
} from "@/type";

import { generateMoment } from "@/api/aiMomentApi";

// ==================== 常量定义 ====================
const STORAGE_KEYS = {
  RECORDS: 'ai_copywriting_records',
  COLLECTS: 'ai_copywriting_collects',
};

// ==================== 状态类型定义 ====================
interface CopywritingState {
  records: CopywritingRecord[]; // 历史记录
  collects: Collect[]; // 收藏列表
  loading: boolean; // 生成加载状态
  generatedList: GeneratedCopywriting[]; // 当前生成的文案列表
  currentCopywriting: string; // 当前生成的单条文案（优化用）
  error: string | null; // 错误信息
}

// ==================== 本地存储工具函数 ====================
// 从localStorage加载数据
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// 保存数据到localStorage
const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save error:', error);
  }
};

// ==================== 初始状态 ====================
const initialState: CopywritingState = {
  records: [],
  collects: [],
  loading: false,
  generatedList: [],
  currentCopywriting: "",
  error: null,
};

// ==================== 异步Actions ====================

/**
 * 异步Action：生成文案
 * 模拟AI API调用，根据场景和风格返回对应的文案列表
 */
export const fetchGenerateCopywriting = createAsyncThunk<
  GeneratedCopywriting[],
  GenerateParams,
  { rejectValue: string }
>(
  'copywriting/fetchGenerate',
  async (params, { rejectWithValue }) => {
    try {
      const singleText = await generateMoment({
        prompt: `${params.scene} ${params.style} ${params.keywords || ''}`,
        scene: params.scene,
        style: params.style,
      });

      // 把单条结果转换成组件需要的数组格式
      const processedContents = [{
        id: Date.now(),
        content: singleText,
        isCollected: false,
      }];

      return processedContents;
    } catch {
      return rejectWithValue('生成文案失败，请稍后重试');
    }
  }
);

/**
 * 异步Action：从localStorage加载历史记录
 */
export const fetchCopywritingRecords = createAsyncThunk<
  CopywritingRecord[],
  void,
  { rejectValue: string }
>(
  'copywriting/fetchRecords',
  async (_, { rejectWithValue }) => {
    try {
      const records = loadFromStorage<CopywritingRecord[]>(STORAGE_KEYS.RECORDS, []);
      return records;
    } catch {
      return rejectWithValue('加载历史记录失败');
    }
  }
);

/**
 * 异步Action：从localStorage加载收藏
 */
export const fetchCopywritingCollects = createAsyncThunk<
  Collect[],
  void,
  { rejectValue: string }
>(
  'copywriting/fetchCollects',
  async (_, { rejectWithValue }) => {
    try {
      const collects = loadFromStorage<Collect[]>(STORAGE_KEYS.COLLECTS, []);
      return collects;
    } catch {
      return rejectWithValue('加载收藏失败');
    }
  }
);

// ==================== Slice定义 ====================
export const copywritingSlice = createSlice({
  name: "copywriting",
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
    
    // 保存文案记录到Redux并同步到localStorage
    saveRecord: (state, action: PayloadAction<Omit<CopywritingRecord, "id" | "createTime">>) => {
      const newRecord: CopywritingRecord = {
        id: Date.now(),
        ...action.payload,
        createTime: new Date().toLocaleString('zh-CN'),
      };
      state.records.unshift(newRecord); // 新记录添加到头部
      saveToStorage(STORAGE_KEYS.RECORDS, state.records);
    },
    
    // 添加收藏到Redux并同步到localStorage
    addCollect: (state, action: PayloadAction<{ content: string; scene?: SceneType; style?: StyleType }>) => {
      // 检查是否已收藏
      const exists = state.collects.some(item => item.content === action.payload.content);
      if (!exists) {
        const newCollect: Collect = {
          id: Date.now(),
          content: action.payload.content,
          addTime: new Date().toLocaleString('zh-CN'),
          scene: action.payload.scene,
          style: action.payload.style,
        };
        state.collects.unshift(newCollect);
        saveToStorage(STORAGE_KEYS.COLLECTS, state.collects);
      }
    },
    
    // 取消收藏
    removeCollect: (state, action: PayloadAction<number>) => {
      state.collects = state.collects.filter(item => item.id !== action.payload);
      saveToStorage(STORAGE_KEYS.COLLECTS, state.collects);
    },
    
    // 删除历史记录
    deleteRecord: (state, action: PayloadAction<number>) => {
      state.records = state.records.filter(item => item.id !== action.payload);
      saveToStorage(STORAGE_KEYS.RECORDS, state.records);
    },
    
    // 清空生成的文案列表
    clearGeneratedList: (state) => {
      state.generatedList = [];
    },
    
    // 更新文案收藏状态
    toggleCopywritingCollect: (state, action: PayloadAction<number>) => {
      const item = state.generatedList.find(item => item.id === action.payload);
      if (item) {
        item.isCollected = !item.isCollected;
      }
    },
    
    // 清空错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置错误信息
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 生成文案
    builder
      .addCase(fetchGenerateCopywriting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenerateCopywriting.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedList = action.payload;
      })
      .addCase(fetchGenerateCopywriting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '生成失败';
      });
    
    // 加载历史记录
    builder
      .addCase(fetchCopywritingRecords.fulfilled, (state, action) => {
        state.records = action.payload;
      });
    
    // 加载收藏
    builder
      .addCase(fetchCopywritingCollects.fulfilled, (state, action) => {
        state.collects = action.payload;
      });
  },
});

// ==================== 导出Actions ====================
export const {
  setLoading,
  setCurrentCopywriting,
  saveRecord,
  addCollect,
  removeCollect,
  deleteRecord,
  clearGeneratedList,
  toggleCopywritingCollect,
  clearError,
  setError,
} = copywritingSlice.actions;

// ==================== 导出Reducer ====================
export default copywritingSlice.reducer;
