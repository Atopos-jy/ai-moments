// src/pages/Generate/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Input, 
  Button, 
  Radio, 
  Switch, 
  message,
  Card,
  Space,
  InputNumber,
} from 'antd';
import {
  CameraOutlined,
  FireOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  CopyOutlined,
  StarOutlined,
  StarFilled,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchGenerateCopywriting,
  saveRecord,
  addCollect,
  toggleCopywritingCollect,
} from '@/store/modules/copywritingSlice';
import type { SceneType, StyleType, GeneratedCopywriting } from '@/types';



// ==================== 常量定义 ====================

// 场景选择（宫格布局）
const SCENE_GRID = [
  { key: '日常分享' as SceneType, icon: <CameraOutlined />, label: '日常分享', color: '#1890ff' },
  { key: '美食' as SceneType, icon: <FireOutlined />, label: '美食探店', color: '#fa8c16' },
  { key: '旅行' as SceneType, icon: <VideoCameraOutlined />, label: '旅行游记', color: '#52c41a' },
  { key: '工作' as SceneType, icon: <FileTextOutlined />, label: '工作总结', color: '#722ed1' },
  { key: '节日' as SceneType, icon: <FireOutlined />, label: '节日祝福', color: '#eb2f96' },
  { key: '生日' as SceneType, icon: <CameraOutlined />, label: '情感文案', color: '#f5222d' },
];

// 风格选项
const STYLE_OPTIONS = ['专业', '放松', '活泼', '高冷'];

// ==================== 组件 ====================

/**
 * 生成页组件
 * 包含：宫格场景选择、细节调整面板、生成结果展示
 */
const Generate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { generatedList, loading, collects } = useAppSelector((state) => state.copywriting);
  
  // 状态
  const [selectedScene, setSelectedScene] = useState<SceneType>('日常分享');
  const [selectedStyle, setSelectedStyle] = useState('专业');
  const [keywords, setKeywords] = useState('');
  const [lengthLimit, setLengthLimit] = useState('50-100');
  const [detailEnabled, setDetailEnabled] = useState(true);
  // 新增控制条件
  const [generateCount, setGenerateCount] = useState<number>(1);
  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [useHashtag, setUseHashtag] = useState<boolean>(false);

  // 处理生成
  const handleGenerate = async () => {
    const params = {
      scene: selectedScene,
      style: selectedStyle as StyleType,
      tone: '活泼' as const,
      person: '我' as const,
      keywords,
      wordCount: '50-100字' as const,
      withEmoji: useEmoji,
      withHashtag: useHashtag,
      count: generateCount,
      lengthLimit,
    };
    
    const result = await dispatch(fetchGenerateCopywriting(params));
    
    if (fetchGenerateCopywriting.fulfilled.match(result)) {
      const content = result.payload.map(item => item.content).join('\n');
      dispatch(saveRecord({
        scene: selectedScene,
        style: selectedStyle as StyleType,
        content,
        params,
      }));
      message.success('文案生成成功');
    }
  };

  // 处理复制
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('复制成功');
    } catch {
      message.error('复制失败');
    }
  };

  // 处理收藏
  const handleCollect = (item: GeneratedCopywriting) => {
    dispatch(toggleCopywritingCollect(item.id));
    if (!item.isCollected) {
      dispatch(addCollect({ 
        content: item.content,
        scene: selectedScene,
        style: selectedStyle as StyleType,
      }));
      message.success('已收藏');
    } else {
      const collectItem = collects.find(c => c.content === item.content);
      if (collectItem) {
        dispatch({ type: 'copywriting/removeCollect', payload: collectItem.id });
      }
      message.success('已取消收藏');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* 顶部导航 */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center">
          <ArrowLeftOutlined 
            className="text-lg cursor-pointer mr-3" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-lg font-medium text-gray-800">生成文案</h1>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="max-w-lg mx-auto pb-24">
        {/* 场景选择 */}
        <div className="bg-white m-4 rounded-2xl p-4">
          <h2 className="text-base font-medium mb-4 text-gray-800">场景选择</h2>
          <div className="grid grid-cols-3 gap-3">
            {SCENE_GRID.map((scene) => (
              <div
                key={scene.key}
                onClick={() => setSelectedScene(scene.key)}
                className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${
                  selectedScene === scene.key 
                    ? 'bg-blue-50 border-2 border-blue-500' 
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mb-2"
                  style={{ backgroundColor: scene.color }}
                >
                  {scene.icon}
                </div>
                <span className={`text-xs ${
                  selectedScene === scene.key ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {scene.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 细节调整 */}
        <div className="bg-white m-4 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-800">细节调整</h2>
            <Switch 
              checked={detailEnabled} 
              onChange={setDetailEnabled}
              size="small"
            />
          </div>
          
          {detailEnabled && (
            <div className="space-y-4">
              {/* 语气风格 */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">语气风格</label>
                <Radio.Group 
                  value={selectedStyle} 
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="flex flex-wrap gap-2"
                >
                  {STYLE_OPTIONS.map(style => (
                    <Radio.Button 
                      key={style} 
                      value={style}
                      className="rounded-lg"
                    >
                      {style}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>

              {/* 关键词 */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">关键词</label>
                <Input
                  placeholder="关键词、关键词"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* 长度限制 */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">长度限制</label>
                <Input
                  placeholder="例如：50-100"
                  value={lengthLimit}
                  onChange={(e) => setLengthLimit(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* 生成数量 */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">生成数量</label>
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="请输入生成数量"
                  value={generateCount}
                  onChange={(value) => setGenerateCount(value || 1)}
                  className="rounded-lg w-full"
                />
              </div>

              {/* 使用 Emoji */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">使用 Emoji</label>
                <Switch 
                  checked={useEmoji} 
                  onChange={setUseEmoji}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </div>

              {/* 使用话题标签 */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">添加话题标签 #</label>
                <Switch 
                  checked={useHashtag} 
                  onChange={setUseHashtag}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </div>
            </div>
          )}
        </div>

        {/* 生成按钮 */}
        <div className="px-4">
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleGenerate}
            className="h-12 rounded-full text-base font-medium"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            开始生成文案
          </Button>
        </div>

        {/* 生成结果 */}
        {generatedList.length > 0 && (
          <div className="m-4">
            <h3 className="text-base font-medium mb-3 text-gray-800">生成结果</h3>
            <div className="space-y-3">
              {generatedList.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-xl shadow-sm"
                  bodyStyle={{ padding: '12px' }}
                >
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {item.content}
                  </p>
                  <Space>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(item.content)}
                    >
                      复制
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={item.isCollected ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                      onClick={() => handleCollect(item)}
                    >
                      {item.isCollected ? '已收藏' : '收藏'}
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                    >
                      重新生成
                    </Button>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default Generate;
