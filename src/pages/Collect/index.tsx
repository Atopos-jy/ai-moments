// src/pages/Collect/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Button, Empty, message, Popconfirm, Tag } from 'antd';
import { 
  ArrowLeftOutlined, 
  CopyOutlined, 
  StarFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchCopywritingCollects,
  removeCollect,
} from '@/store/modules/copywritingSlice';
import type { Collect } from '@/type';

/**
 * 收藏页组件
 * 展示收藏的文案，支持复制和取消收藏
 */
const Collect = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 从Redux获取收藏列表
  const { collects } = useAppSelector((state) => state.copywriting);

  // 初始化加载收藏
  useEffect(() => {
    dispatch(fetchCopywritingCollects());
  }, [dispatch]);

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 处理复制
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('复制成功');
    } catch {
      message.error('复制失败，请手动复制');
    }
  };

  // 处理取消收藏
  const handleRemoveCollect = (id: number) => {
    dispatch(removeCollect(id));
    message.success('已取消收藏');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mr-2"
          />
          <h1 className="text-lg font-medium text-gray-800">我的收藏</h1>
        </div>
      </header>

      {/* 列表内容 */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-20">
        {collects.length === 0 ? (
          <div className="pt-20">
            <Empty description="暂无收藏" />
          </div>
        ) : (
          <List
            dataSource={collects}
            renderItem={(item: Collect) => (
              <List.Item
                className="bg-white rounded-lg mb-3 p-4 border border-gray-100 shadow-sm"
              >
                <div className="w-full">
                  {/* 头部信息 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.scene && (
                        <Tag color="blue">{item.scene}</Tag>
                      )}
                      {item.style && (
                        <Tag color="green">{item.style}</Tag>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex items-center">
                      <ClockCircleOutlined className="mr-1" />
                      {item.addTime}
                    </span>
                  </div>
                  
                  {/* 文案内容 */}
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {item.content}
                  </p>
                  
                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(item.content)}
                    >
                      复制
                    </Button>
                    <Popconfirm
                      title="确认取消收藏"
                      description="确定要取消收藏这条文案吗？"
                      onConfirm={() => handleRemoveCollect(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<StarFilled className="text-yellow-500" />}
                      >
                        取消收藏
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </main>
    </div>
  );
};

export default Collect;
