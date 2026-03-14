// src/pages/Record/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Button, Empty, message, Popconfirm, Tag } from 'antd';
import { 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  DeleteOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchCopywritingRecords,
  deleteRecord,
} from '@/store/modules/copywritingSlice';
import type { CopywritingRecord } from '@/types';

/**
 * 历史记录页组件
 * 展示历史生成的文案记录，支持重新生成和删除
 */
const Record = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 从Redux获取历史记录
  const { records } = useAppSelector((state) => state.copywriting);

  // 初始化加载历史记录
  useEffect(() => {
    dispatch(fetchCopywritingRecords());
  }, [dispatch]);

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 处理重新生成
  const handleRegenerate = (record: CopywritingRecord) => {
    // 携带历史记录的参数跳转到首页生成区
    const params = new URLSearchParams();
    params.set('scene', record.scene);
    params.set('style', record.style);
    params.set('generate', 'true');
    
    navigate(`/?${params.toString()}`);
    message.success('已跳转到生成页');
  };

  // 处理删除
  const handleDelete = (id: number) => {
    dispatch(deleteRecord(id));
    message.success('删除成功');
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
          <h1 className="text-lg font-medium text-gray-800">历史记录</h1>
        </div>
      </header>

      {/* 列表内容 */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-20">
        {records.length === 0 ? (
          <div className="pt-20">
            <Empty description="暂无历史记录" />
          </div>
        ) : (
          <List
            dataSource={records}
            renderItem={(record) => (
              <List.Item
                className="bg-white rounded-lg mb-3 p-4 border border-gray-100 shadow-sm"
              >
                <div className="w-full">
                  {/* 头部信息 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">{record.scene}</Tag>
                      <Tag color="green">{record.style}</Tag>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center">
                      <ClockCircleOutlined className="mr-1" />
                      {record.createTime}
                    </span>
                  </div>
                  
                  {/* 文案内容预览 */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                    {record.content}
                  </p>
                  
                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => handleRegenerate(record)}
                    >
                      重新生成
                    </Button>
                    <Popconfirm
                      title="确认删除"
                      description="删除后无法恢复，是否继续？"
                      onConfirm={() => handleDelete(record.id)}
                      okText="删除"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        删除
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

export default Record;
