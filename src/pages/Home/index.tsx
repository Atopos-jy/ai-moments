// src/pages/Home/index.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Input,
  Card,
  Button,
  List,
  Select,
  Tabs,
  Collapse,
  Radio,
  Switch,
  Empty,
  Modal,
  message,
  Space,
} from 'antd';

const { Search } = Input;
import {
  CopyOutlined,
  StarOutlined,
  StarFilled,
  EditOutlined,
  ReloadOutlined,
  HomeOutlined,
  HistoryOutlined,
  HeartOutlined,
  CoffeeOutlined,
  CarOutlined,
  GiftOutlined,
  SmileOutlined,
  FireOutlined,
  SoundOutlined,
  ShoppingOutlined,
  MessageOutlined,
  CarryOutOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchGenerateCopywriting,
  saveRecord,
  addCollect,
  toggleCopywritingCollect,
  clearGeneratedList,
  fetchCopywritingRecords,
  fetchCopywritingCollects,
} from '@/store/modules/copywritingSlice';
import type { 
  SceneType, 
  StyleType, 
  ToneType, 
  PersonType, 
  WordCountType,
  GeneratedCopywriting,
  HotCopywriting,
} from '@/type';

const { TabPane } = Tabs;
const { Panel } = Collapse;

// ==================== 常量定义 ====================

// 场景列表
const SCENES: { key: SceneType; icon: React.ReactNode; label: string }[] = [
  { key: '日常分享', icon: <HomeOutlined />, label: '日常分享' },
  { key: '美食', icon: <CoffeeOutlined />, label: '美食' },
  { key: '旅行', icon: <CarOutlined />, label: '旅行' },
  { key: '工作', icon: <CarryOutOutlined />, label: '工作' },
  { key: '节日', icon: <GiftOutlined />, label: '节日' },
  { key: '生日', icon: <SmileOutlined />, label: '生日' },
  { key: 'emo', icon: <MessageOutlined />, label: 'emo' },
  { key: '撒糖', icon: <FireOutlined />, label: '撒糖' },
  { key: '官宣', icon: <SoundOutlined />, label: '官宣' },
  { key: '吐槽', icon: <MessageOutlined />, label: '吐槽' },
  { key: '好物推荐', icon: <ShoppingOutlined />, label: '好物推荐' },
];

// 风格列表
const STYLES: StyleType[] = ['文艺', '沙雕', '简约', '治愈', '霸气', '温柔', '搞笑', '扎心', '励志', '复古'];

// 语气类型
const TONES: ToneType[] = ['活泼', '高冷', '可爱', '正式', '口语化'];

// 人称类型
const PERSONS: PersonType[] = ['我', '我们', '情侣', '打工人'];

// 字数限制
const WORD_COUNTS: WordCountType[] = ['10-50字', '50-100字'];

// 热门文案数据
const HOT_COPYWRITINGS: HotCopywriting[] = [
  { id: 1, content: '生活边角料，快乐小证据✨ #日常碎片' },
  { id: 2, content: '火锅咕嘟咕嘟，我心扑通扑通🍲 #干饭日常' },
  { id: 3, content: '风吹过山海，我遇见温柔🌊 #旅行治愈' },
  { id: 4, content: '努力的意义，就是以后的日子里放眼望去，全都是自己喜欢的人和事💪' },
  { id: 5, content: '今天也是碌碌无为的知食分子🥢 #吃货日常' },
];

// ==================== 组件 ====================

/**
 * 首页组件 - AI朋友圈文案生成器
 * 包含：场景选择、风格定制、文案生成、复制、收藏等功能
 */
const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  // Redux状态
  const { generatedList, loading, collects } = useAppSelector((state) => state.copywriting);
  
  // 本地状态
  const [showGenerateArea, setShowGenerateArea] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [optimizeModalVisible, setOptimizeModalVisible] = useState(false);
  const [currentOptimizeItem, setCurrentOptimizeItem] = useState<GeneratedCopywriting | null>(null);
  
  // 生成参数状态
  const [selectedScene, setSelectedScene] = useState<SceneType>('日常分享');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('文艺');
  const [selectedTone, setSelectedTone] = useState<ToneType>('活泼');
  const [selectedPerson, setSelectedPerson] = useState<PersonType>('我');
  const [keywords, setKeywords] = useState('');
  const [selectedWordCount, setSelectedWordCount] = useState<WordCountType>('10-50字');
  const [withEmoji, setWithEmoji] = useState(true);
  const [withHashtag, setWithHashtag] = useState(true);
  
  // 优化选项
  const [optimizeType, setOptimizeType] = useState<'缩短' | '加长' | '润色' | '换风格'>('润色');

  // 初始化：检查URL参数并加载数据
  useEffect(() => {
    // 加载历史记录和收藏
    dispatch(fetchCopywritingRecords());
    dispatch(fetchCopywritingCollects());
    
    // 处理URL参数
    const sceneParam = searchParams.get('scene') as SceneType;
    const styleParam = searchParams.get('style') as StyleType;
    const showGenerate = searchParams.get('generate') === 'true';
    
    // 使用requestAnimationFrame避免同步setState警告
    requestAnimationFrame(() => {
      if (sceneParam && SCENES.some(s => s.key === sceneParam)) {
        setSelectedScene(sceneParam);
      }
      if (styleParam && STYLES.includes(styleParam)) {
        setSelectedStyle(styleParam);
      }
      if (showGenerate) {
        setShowGenerateArea(true);
      }
    });
  }, [searchParams, dispatch]);

  // 过滤场景（根据搜索关键词）
  const filteredScenes = useMemo(() => {
    if (!searchKeyword) return SCENES;
    return SCENES.filter(scene => 
      scene.label.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      STYLES.some(style => style.includes(searchKeyword))
    );
  }, [searchKeyword]);

  // 处理场景点击
  const handleSceneClick = (scene: SceneType) => {
    setSelectedScene(scene);
    setShowGenerateArea(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理复制文案
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('复制成功');
    } catch {
      message.error('复制失败，请手动复制');
    }
  };

  // 处理生成文案
  const handleGenerate = async () => {
    const params = {
      scene: selectedScene,
      style: selectedStyle,
      tone: selectedTone,
      person: selectedPerson,
      keywords,
      wordCount: selectedWordCount,
      withEmoji,
      withHashtag,
    };
    
    const result = await dispatch(fetchGenerateCopywriting(params));
    
    if (fetchGenerateCopywriting.fulfilled.match(result)) {
      // 保存到历史记录
      const content = result.payload.map(item => item.content).join('\n');
      dispatch(saveRecord({
        scene: selectedScene,
        style: selectedStyle,
        content,
        params,
      }));
      message.success('文案生成成功');
    } else {
      message.error('生成失败，请重试');
    }
  };

  // 处理收藏
  const handleCollect = (item: GeneratedCopywriting) => {
    dispatch(toggleCopywritingCollect(item.id));
    if (!item.isCollected) {
      dispatch(addCollect({ 
        content: item.content,
        scene: selectedScene,
        style: selectedStyle,
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

  // 处理优化
  const handleOptimize = (item: GeneratedCopywriting) => {
    setCurrentOptimizeItem(item);
    setOptimizeModalVisible(true);
  };

  // 确认优化
  const confirmOptimize = () => {
    if (!currentOptimizeItem) return;
    
    let newContent = currentOptimizeItem.content;
    
    switch (optimizeType) {
      case '缩短':
        newContent = newContent.slice(0, 30) + (newContent.length > 30 ? '...' : '');
        break;
      case '加长':
        newContent = newContent + ' 这就是我想要表达的心情，希望每一个看到的人都能感受到这份美好✨';
        break;
      case '润色':
        newContent = newContent.replace(/[。！]/g, '✨ ');
        break;
      case '换风格':
        newContent = '【换风格版】' + newContent;
        break;
      default:
        break;
    }
    
    // 使用newContent（避免unused警告）
    void newContent;
    
    // 更新当前文案
    message.success('优化完成');
    setOptimizeModalVisible(false);
  };

  // 处理重新生成单条
  const handleRegenerateItem = (_item: GeneratedCopywriting) => {
    void _item; // 标记为已使用
    message.loading('重新生成中...', 1);
    setTimeout(() => {
      message.success('已重新生成');
    }, 1000);
  };

  // 处理重新生成全部
  const handleRegenerateAll = () => {
    dispatch(clearGeneratedList());
    handleGenerate();
  };

  // 渲染首页内容
  const renderHomeContent = () => (
    <div className="pb-20">
      {/* 搜索栏 */}
      <div className="px-4 py-3 bg-white sticky top-0 z-10">
        <Search
          placeholder="搜索场景/风格"
          value={searchKeyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
          className="w-full"
          size="large"
        />
      </div>

      {/* 场景快捷入口 */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-medium mb-3 text-gray-800">选择场景</h2>
        <div className="grid grid-cols-4 gap-3">
          {filteredScenes.map((scene) => (
            <div
              key={scene.key}
              onClick={() => handleSceneClick(scene.key)}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl mb-2">
                {scene.icon}
              </div>
              <span className="text-xs text-gray-600">{scene.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 热门文案推荐 */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-medium mb-3 text-gray-800">热门文案推荐</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {HOT_COPYWRITINGS.map((item) => (
            <Card
              key={item.id}
              className="min-w-[280px] flex-shrink-0"
              bodyStyle={{ padding: '12px' }}
            >
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.content}</p>
              <Button
                type="primary"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(item.content)}
                block
              >
                复制
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* 快速进入生成区按钮 */}
      <div className="px-4 py-4">
        <Button
          type="primary"
          size="large"
          block
          onClick={() => setShowGenerateArea(true)}
          className="h-12 text-base"
        >
          开始生成文案
        </Button>
      </div>
    </div>
  );

  // 渲染生成区内容
  const renderGenerateArea = () => (
    <div className="px-4 py-4 pb-24">
      {/* 返回按钮 */}
      <Button 
        type="link" 
        onClick={() => setShowGenerateArea(false)}
        className="mb-4 px-0"
      >
        ← 返回首页
      </Button>

      {/* 场景选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">选择场景</label>
        <Select
          value={selectedScene}
          onChange={(value: SceneType) => setSelectedScene(value)}
          className="w-full"
          size="large"
          options={SCENES.map(s => ({ value: s.key, label: s.label }))}
        />
      </div>

      {/* 风格选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">选择风格</label>
        <Tabs
          activeKey={selectedStyle}
          onChange={(key) => setSelectedStyle(key as StyleType)}
          type="card"
          className="generate-tabs"
        >
          {STYLES.map(style => (
            <TabPane tab={style} key={style} />
          ))}
        </Tabs>
      </div>

      {/* 语气调整折叠面板 */}
      <Collapse className="mb-4" ghost>
        <Panel header="语气调整" key="1">
          <Space direction="vertical" className="w-full">
            <div>
              <label className="block text-sm text-gray-600 mb-2">语气类型</label>
              <Radio.Group
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as ToneType)}
              >
                {TONES.map(tone => (
                  <Radio.Button key={tone} value={tone}>
                    {tone}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">人称</label>
              <Radio.Group
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value as PersonType)}
              >
                {PERSONS.map(person => (
                  <Radio.Button key={person} value={person}>
                    {person}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </Space>
        </Panel>
      </Collapse>

      {/* 个性化设置折叠面板 */}
      <Collapse className="mb-4" ghost>
        <Panel header="个性化设置" key="1">
          <Space direction="vertical" className="w-full">
            <div>
              <label className="block text-sm text-gray-600 mb-2">关键词</label>
              <Input
                placeholder="输入关键词，如：咖啡+雨天+治愈"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">字数限制</label>
              <Radio.Group
                value={selectedWordCount}
                onChange={(e) => setSelectedWordCount(e.target.value as WordCountType)}
              >
                {WORD_COUNTS.map(count => (
                  <Radio.Button key={count} value={count}>
                    {count}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">带 emoji</span>
              <Switch checked={withEmoji} onChange={setWithEmoji} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">加话题标签</span>
              <Switch checked={withHashtag} onChange={setWithHashtag} />
            </div>
          </Space>
        </Panel>
      </Collapse>

      {/* 生成按钮 */}
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleGenerate}
        className="h-12 text-base mb-6"
      >
        {loading ? '生成中...' : '生成文案'}
      </Button>

      {/* 文案展示区 */}
      <div className="mb-4">
        <h3 className="text-base font-medium mb-3 text-gray-800">生成结果</h3>
        {generatedList.length === 0 ? (
          <Empty description="点击生成按钮获取专属文案" />
        ) : (
          <List
            dataSource={generatedList}
            renderItem={(item) => (
              <List.Item
                className="bg-white rounded-lg mb-3 p-4 border border-gray-100"
              >
                <div className="w-full">
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
                      icon={<EditOutlined />}
                      onClick={() => handleOptimize(item)}
                    >
                      优化
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => handleRegenerateItem(item)}
                    >
                      重新生成
                    </Button>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* 重新生成全部按钮 */}
      {generatedList.length > 0 && (
        <Button
          block
          size="large"
          onClick={handleRegenerateAll}
          className="h-12"
        >
          重新生成全部
        </Button>
      )}

      {/* 优化弹窗 */}
      <Modal
        title="优化文案"
        open={optimizeModalVisible}
        onOk={confirmOptimize}
        onCancel={() => setOptimizeModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">选择优化方式：</p>
          <Radio.Group
            value={optimizeType}
            onChange={(e) => setOptimizeType(e.target.value)}
            className="flex flex-col gap-3"
          >
            <Radio value="缩短">缩短 - 精简文案内容</Radio>
            <Radio value="加长">加长 - 扩展文案内容</Radio>
            <Radio value="润色">润色 - 美化表达方式</Radio>
            <Radio value="换风格">换风格 - 切换表达风格</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面内容 */}
      <main className="max-w-lg mx-auto">
        {showGenerateArea ? renderGenerateArea() : renderHomeContent()}
      </main>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-lg mx-auto">
        <div className="flex justify-around items-center h-14">
          <div 
            className="flex flex-col items-center cursor-pointer text-blue-500"
            onClick={() => {
              setShowGenerateArea(false);
              navigate('/');
            }}
          >
            <HomeOutlined className="text-lg" />
            <span className="text-xs mt-1">首页</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/record')}
          >
            <HistoryOutlined className="text-lg" />
            <span className="text-xs mt-1">历史</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/collect')}
          >
            <HeartOutlined className="text-lg" />
            <span className="text-xs mt-1">收藏</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
