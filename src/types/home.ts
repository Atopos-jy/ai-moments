/**
 * 首页相关类型定义
 */

/**
 * 瀑布流文案项类型
 */
export interface WaterfallItem {
  /** 唯一标识 */
  id: number;
  /** 配图 URL */
  image: string;
  /** 标题 */
  title: string;
  /** 标签列表 */
  tags: string[];
  /** 作者 */
  author: string;
  /** 点赞数 */
  likes: number;
}

/**
 * 高频场景类型
 */
export interface FrequentScene {
  /** 场景名称 */
  name: string;
  /** 图标 */
  icon: string;
  /** 跳转路径 */
  path: string;
}

/**
 * 热门文案类型
 */
export interface HotCopywriting {
  /** 唯一标识 */
  id: number;
  /** 内容 */
  content: string;
  /** 热度 */
  hot: number;
}
