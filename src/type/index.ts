// src/types/index.ts
// 文案记录类型
export interface CopywritingRecord {
  id: number;
  scene: string; // 场景：旅行/生日/撸猫等
  style: string; // 风格：文艺/沙雕/治愈等
  content: string; // 文案内容
  createTime: string;
  imageUrl?: string; // 上传的图片地址
}

// 收藏类型
export interface Collect {
  id: number;
  content: string;
  addTime: string;
}

// AI请求参数
export interface AIPromptParams {
  scene: string;
  style: string;
  imageDesc?: string; // 图片描述（可选）
}
