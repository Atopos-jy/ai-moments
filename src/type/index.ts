// src/types/index.ts

// 场景类型
export type SceneType = 
  | '日常分享' 
  | '美食' 
  | '旅行' 
  | '工作' 
  | '节日' 
  | '生日' 
  | 'emo' 
  | '撒糖' 
  | '官宣' 
  | '吐槽' 
  | '好物推荐';

// 风格类型
export type StyleType = 
  | '文艺' 
  | '沙雕' 
  | '简约' 
  | '治愈' 
  | '霸气' 
  | '温柔' 
  | '搞笑' 
  | '扎心' 
  | '励志' 
  | '复古';

// 语气类型
export type ToneType = '活泼' | '高冷' | '可爱' | '正式' | '口语化';

// 人称类型
export type PersonType = '我' | '我们' | '情侣' | '打工人';

// 字数限制类型
export type WordCountType = '10-50字' | '50-100字';

// 文案记录类型
export interface CopywritingRecord {
  id: number;
  scene: SceneType; // 场景
  style: StyleType; // 风格
  content: string; // 文案内容
  createTime: string;
  // 生成参数（用于重新生成）
  params?: GenerateParams;
}

// 收藏类型
export interface Collect {
  id: number;
  content: string;
  addTime: string;
  scene?: SceneType;
  style?: StyleType;
}

// 生成参数
export interface GenerateParams {
  scene: SceneType;
  style: StyleType;
  tone: ToneType;
  person: PersonType;
  keywords: string;
  wordCount: WordCountType;
  withEmoji: boolean;
  withHashtag: boolean;
  // 新增控制参数
  count?: number;
  lengthLimit?: string;
}

// AI请求参数
export interface AIPromptParams {
  scene: SceneType;
  style: StyleType;
  tone?: ToneType;
  person?: PersonType;
  keywords?: string;
  wordCount?: WordCountType;
  withEmoji?: boolean;
  withHashtag?: boolean;
}

// 生成的文案项
export interface GeneratedCopywriting {
  id: number;
  content: string;
  isCollected?: boolean;
}

// 热门文案
export interface HotCopywriting {
  id: number;
  content: string;
}
