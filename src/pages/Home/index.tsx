// src/pages/Home/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, message } from 'antd';
import {
  CameraOutlined,
  FireOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '@/hooks';
import { fetchCopywritingRecords, fetchCopywritingCollects } from '@/store/modules/copywritingSlice';

const { Search } = Input;

// ==================== 常量定义 ====================

// 顶部场景分类
const TOP_CATEGORIES = [
  { key: 'moments', icon: <CameraOutlined />, label: '朋友圈', color: '#52c41a' },
  { key: 'xiaohongshu', icon: <FireOutlined />, label: '小红书', color: '#ff4d4f' },
  { key: 'video', icon: <VideoCameraOutlined />, label: '短视频', color: '#722ed1' },
  { key: 'marketing', icon: <FileTextOutlined />, label: '营销文案', color: '#fa8c16' },
];

// 瀑布流文案数据
const WATERFALL_ITEMS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=400&fit=crop',
    title: '美食打卡必备句式，让你的朋友圈更有格调',
    tags: ['复制', '收藏', '转发'],
    author: '小橘',
    likes: 19,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=350&fit=crop',
    title: '美食打卡必备句式，让你的朋友圈更有格调',
    tags: ['复制', '优化'],
    author: '创意达人',
    likes: 38,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=420&fit=crop',
    title: '周末探店文案，轻松get高点赞',
    tags: ['复制', '收藏'],
    author: '美食家',
    likes: 56,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&h=380&fit=crop',
    title: '早餐打卡文案，开启美好一天',
    tags: ['复制', '转发'],
    author: '早安君',
    likes: 42,
  },
];

// ==================== 组件 ====================

/**
 * 首页组件 - AI朋友圈文案生成器
 * 包含：搜索栏、场景分类、热门推荐横幅、瀑布流列表
 */
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [searchKeyword, setSearchKeyword] = useState('');

  // 初始化加载数据
  useEffect(() => {
    dispatch(fetchCopywritingRecords());
    dispatch(fetchCopywritingCollects());
  }, [dispatch]);

  // 处理复制
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('复制成功');
    } catch {
      message.error('复制失败');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* 页面内容 */}
      <main className="max-w-lg mx-auto pb-20">
        {/* 搜索栏 */}
        <div className="px-4 pt-4 pb-2">
          <Search
            placeholder="搜场景/风格"
            value={searchKeyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
            className="w-full"
            size="large"
            style={{ borderRadius: '24px' }}
          />
        </div>

        {/* 顶部场景分类 */}
        <div className="px-4 py-3">
          <div className="flex justify-around">
            {TOP_CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                onClick={() => navigate('/generate')}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-2"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </div>
                <span className="text-xs text-gray-600">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 热门文案推荐横幅 */}
        <div className="px-4 py-2">
          <div 
            className="rounded-2xl p-4 text-white relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1">热门文案推荐</h2>
              <p className="text-sm opacity-90">🔥 发现今日最火文案灵感</p>
            </div>
            <div className="absolute right-0 top-0 w-32 h-full opacity-20">
              <FireOutlined className="text-8xl absolute -right-4 -top-4" />
            </div>
          </div>
        </div>

        {/* 瀑布流文案列表 */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {WATERFALL_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
                style={{ 
                  marginTop: index % 2 === 1 ? '20px' : '0',
                }}
              >
                {/* 图片 */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                    style={{ minHeight: index % 2 === 0 ? '160px' : '140px' }}
                  />
                </div>
                
                {/* 内容 */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => tag === '复制' && handleCopy(item.title)}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 作者和点赞 */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HeartOutlined className="text-red-400" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
