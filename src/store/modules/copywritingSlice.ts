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

// ==================== 常量定义 ====================
const STORAGE_KEYS = {
  RECORDS: 'ai_copywriting_records',
  COLLECTS: 'ai_copywriting_collects',
};

// 模拟文案数据（按场景+风格匹配）
const MOCK_COPYWRITING_DATA: Record<string, string[]> = {
  '旅行-文艺': [
    '日落跌进山海，晚风盛满温柔🌅 步履不停，奔赴下一场山海 #旅行碎片',
    '把烦恼丢进风里，让自由融进沿途的风景🌿 #奔赴山海',
    '山海自有归期，风雨自有相逢✨ 路过的都是风景，留下的才是人生 #旅行感悟',
    '耳机里的歌，窗外的云，脚下的路，都是温柔的模样🎧 #在路上',
    '不必追赶日落，我要奔向属于自己的浪漫🌄 #小众旅行',
  ],
  '美食-沙雕': [
    '火锅咕嘟咕嘟，我心扑通扑通🍲 这辈子唯一放不下的就是筷子 #干饭人',
    '人生苦短，再来一碗🍜 如果体重也能满100减20就好了 #吃货日常',
    '今天也是碌碌无为的知食分子🥢 #美食探店',
    '星河滚烫，不如麻辣烫🌶️ #深夜食堂',
    '卡路里充值成功，请查收今日份快乐🍰 #甜品控',
  ],
  '日常分享-治愈': [
    '生活边角料，快乐小证据✨ 把普通的日子过得浪漫些 #日常碎片',
    '阳光正好，微风不燥，万物可爱🌸 #今日份美好',
    '慢品人间烟火色，闲观万事岁月长☕ #生活美学',
    '小日子，小美好，小确幸💫 #治愈系',
    '今天也要做全宇宙最快乐的小朋友呀🎈 #开心每一天',
  ],
  '工作-励志': [
    '努力的意义，就是以后的日子里放眼望去，全都是自己喜欢的人和事💪 #打工人',
    '星光不问赶路人，时光不负有心人✨ 今天也要加油鸭 #职场日常',
    '没有白费的努力，也没有偶然的成功🎯 #奋斗吧少年',
    '把抱怨换成行动，让梦想照进现实🚀 #工作使我快乐',
    '每一个不曾起舞的日子，都是对生命的辜负💼 #早安打工人',
  ],
  '生日-温柔': [
    '又与这值得的人间多相处了一年🎂 感谢所有的遇见与宠爱 #生日快乐',
    '愿成长，落落大方，枯木逢春，不负众望🎈 #祝我生日快乐',
    '新的一岁，愿生活三分惊喜，七分尽兴✨ #生日愿望',
    '今天不吹牛了，吹个蜡烛🎂 #生日文案',
    '离退休又近了一年，开心🎉 #生日朋友圈',
  ],
  'emo-扎心': [
    '后来才明白，原来情绪到了点，真的可以沉默不语😔 #深夜emo',
    '有些故事没讲完，那就算了吧🍂 #情绪文案',
    '人总要咽下一些委屈，然后一字不提的擦干眼泪往前走🌧️ #成长',
    '成年人的崩溃，往往以一句"没事"结尾🥀 #emo时刻',
    '月亮失约了，太阳也下山了🌑 #伤感文案',
  ],
  '撒糖-甜蜜': [
    '遇见你之后，我的每个梦都有你的参与💕 #恋爱日常',
    '世界在下沉，我们在恋爱🌊 #情侣日常',
    '喜欢是藏不住的，风会告诉整片森林🌸 #秀恩爱',
    '你是我的今天，以及所有的明天💑 #甜蜜暴击',
    '月亮不会奔你而来，但我会🌙 #表白文案',
  ],
  '官宣-霸气': [
    '大家好，这是我的第二杯半价🥤 #官宣',
    '以后你的瓶盖都归我拧了💪 #脱单',
    '告诉桃花不用开了，我等的人已经来了🌸 #恋爱了',
    '余生不用多指教，你听我的就好😎 #官宣文案',
    '国家分配的终于到货了📦 #脱单成功',
  ],
  '吐槽-搞笑': [
    '我的钱包就像洋葱，一打开就泪流满面🧅 #穷',
    '减肥出尔反尔，干饭言出必行🍔 #真实',
    '熬夜对身体不好，建议通宵😴 #熬夜冠军',
    '我太难了，上辈子一定是道数学题📝 #生活不易',
    '贫穷限制了我那么多，为什么不限制我的体重😭 #扎心',
  ],
  '好物推荐-简约': [
    '近期爱用好物分享，提升生活幸福感✨ #好物推荐',
    '挖到宝了！这个真的好用💯 #种草',
    '亲测好用，不踩雷推荐👍 #购物分享',
    '提升生活品质的小物件🎁 #开箱',
    '性价比之王，闭眼入不亏💰 #推荐',
  ],
  '节日-复古': [
    '岁岁常欢愉，年年皆胜意🧧 #节日祝福',
    '愿新年胜旧年，愿将来胜过往🎊 #新年快乐',
    '烟火起，照人间，举杯敬此年🥂 #跨年',
    '所求皆如愿，所行皆坦途✨ #节日文案',
    '家人闲坐，灯火可亲🏮 #团圆',
  ],
};

// 默认文案（当没有匹配的场景+风格时使用）
const DEFAULT_COPYWRITING = [
  '生活明朗，万物可爱✨ 每一天都是新的开始 #今日心情',
  '保持热爱，奔赴山海🌊 愿你成为自己喜欢的样子 #正能量',
  '时光不老，我们不散💫 珍惜每一个当下 #美好时光',
  '心若向阳，无畏悲伤🌻 微笑面对每一天 #积极生活',
  '岁月漫长，值得等待🍃 所有的美好都会如期而至 #治愈系',
];

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
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 根据场景+风格获取对应的文案数据
      const key = `${params.scene}-${params.style}`;
      let contents = MOCK_COPYWRITING_DATA[key];
      
      // 如果没有精确匹配，尝试只匹配场景
      if (!contents) {
        const sceneKey = Object.keys(MOCK_COPYWRITING_DATA).find(k => 
          k.startsWith(params.scene)
        );
        contents = sceneKey ? MOCK_COPYWRITING_DATA[sceneKey] : DEFAULT_COPYWRITING;
      }
      
      // 根据参数调整文案
      const processedContents = contents.map((content, index) => {
        let processed = content;
        
        // 添加关键词（如果有）
        if (params.keywords) {
          processed = `${params.keywords} | ${processed}`;
        }
        
        // 根据字数限制截断或扩展（简化处理）
        if (params.wordCount === '10-50字' && processed.length > 50) {
          processed = processed.slice(0, 50) + '...';
        }
        
        // 如果不带emoji，移除emoji
        if (!params.withEmoji) {
          processed = processed.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        }
        
        // 如果不带话题标签，移除标签
        if (!params.withHashtag) {
          processed = processed.replace(/#[^\s]+/g, '').trim();
        }
        
        return {
          id: Date.now() + index,
          content: processed,
          isCollected: false,
        };
      });
      
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
