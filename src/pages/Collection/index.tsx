// src/pages/Collection/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Popconfirm } from 'antd';
import { 
  HomeOutlined,
  EditOutlined,
  HeartOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
  StarFilled,
  FilterOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchCopywritingCollects,
  fetchCopywritingRecords,
  removeCollect,
} from '@/store/modules/copywritingSlice';
import type { Collect, CopywritingRecord } from '@/type';

// ==================== 组件 ====================

/**
 * 收藏页组件
 * 包含：收藏的文案卡片、历史生成记录
 */
const Collection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { collects, records } = useAppSelector((state) => state.copywriting);

  // 初始化加载数据
  useEffect(() => {
    dispatch(fetchCopywritingCollects());
    dispatch(fetchCopywritingRecords());
  }, [dispatch]);

  // 处理复制
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('复制成功');
    } catch {
      message.error('复制失败');
    }
  };

  // 处理取消收藏
  const handleRemoveCollect = (id: number) => {
    dispatch(removeCollect(id));
    message.success('已取消收藏');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* 顶部导航 */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center">
            <ArrowLeftOutlined 
              className="text-lg cursor-pointer mr-3" 
              onClick={() => navigate(-1)}
            />
            <h1 className="text-lg font-medium text-gray-800">收藏页</h1>
          </div>
          <FilterOutlined className="text-lg text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* 页面内容 */}
      <main className="max-w-lg mx-auto pb-24">
        {/* 收藏的文案卡片 */}
        <div className="p-4">
          {collects.length === 0 ? (
            // 空状态提示
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <HeartOutlined className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-600 mb-2">暂无收藏</h3>
              <p className="text-sm text-gray-400 mb-4">还没有收藏任何文案</p>
              <button 
                onClick={() => navigate('/generate')}
                className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
              >
                去生成文案
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {collects.map((item: Collect, index: number) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm relative"
                  style={{ 
                    marginTop: index % 2 === 1 ? '12px' : '0',
                  }}
                >
                  {/* 收藏图标 */}
                  <div className="absolute top-2 right-2 z-10">
                    <StarFilled className="text-yellow-400 text-lg" />
                  </div>
                  
                  {/* 配图 */}
                  <div className="h-24 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                  
                  {/* 内容 */}
                  <div className="p-3">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                      {item.content}
                    </p>
                    
                    {/* 操作 */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs text-blue-500 cursor-pointer"
                        onClick={() => handleCopy(item.content)}
                      >
                        <CopyOutlined className="mr-1" />
                        复制
                      </span>
                      <Popconfirm
                        title="取消收藏"
                        description="确定要取消收藏吗？"
                        onConfirm={() => handleRemoveCollect(item.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <span className="text-xs text-gray-400 cursor-pointer">
                          取消收藏
                        </span>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 历史生成 */}
        {records.length > 0 && (
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium text-gray-800">历史生成</h2>
              <span 
                className="text-xs text-gray-500 cursor-pointer"
                onClick={() => navigate('/record')}
              >
                查看更多 →
              </span>
            </div>
            
            <div className="space-y-3">
              {records.slice(0, 3).map((record: CopywritingRecord) => (
                <div 
                  key={record.id}
                  className="bg-white rounded-xl p-3 shadow-sm flex gap-3"
                >
                  {/* 配图 */}
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🍜</span>
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                      {record.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <ClockCircleOutlined className="mr-1" />
                      {record.createTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-lg mx-auto z-50">
        <div className="flex justify-around items-center h-16">
          <div 
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/')}
          >
            <HomeOutlined className="text-xl" />
            <span className="text-xs mt-1">首页</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/generate')}
          >
            <EditOutlined className="text-xl" />
            <span className="text-xs mt-1">生成页</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-blue-500"
          >
            <HeartOutlined className="text-xl" />
            <span className="text-xs mt-1">收藏页</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/profile')}
          >
            <UserOutlined className="text-xl" />
            <span className="text-xs mt-1">我的</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
