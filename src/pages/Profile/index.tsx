// src/pages/Profile/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  message, 
  Switch, 
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  EditOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  CrownOutlined,
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  GiftOutlined,
  MoonOutlined,
  RightOutlined,
  EditFilled,
} from '@ant-design/icons';

// ==================== 组件 ====================

/**
 * 我的页组件
 * 包含：个人中心、会员中心、工具插件、暗黑模式
 */
const Profile = () => {
  const navigate = useNavigate();
  
  // 状态
  const [darkMode, setDarkMode] = useState(false);

  // 设置菜单项
  const settingsItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理设置点击
  const handleSettingClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      message.success('已退出登录');
    }
  };

  // 处理暗黑模式切换
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    message.success(checked ? '已开启暗黑模式' : '已关闭暗黑模式');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* 顶部导航 */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-end">
          <Dropdown 
            menu={{ items: settingsItems, onClick: handleSettingClick }}
            placement="bottomRight"
          >
            <SettingOutlined className="text-xl text-gray-600 cursor-pointer" />
          </Dropdown>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="max-w-lg mx-auto pb-24">
        {/* 个人信息卡片 */}
        <div className="bg-white m-4 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <UserOutlined className="text-2xl text-white" />
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => message.info('编辑头像')}
              >
                <EditFilled className="text-xs text-white" />
              </div>
            </div>
            
            {/* 信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-gray-800">创意达人Li</h2>
                <EditOutlined 
                  className="text-sm text-gray-400 cursor-pointer"
                  onClick={() => message.info('编辑昵称')}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">伲称</p>
            </div>
          </div>
        </div>

        {/* 会员中心 */}
        <div className="mx-4 mb-4">
          <div 
            className="rounded-2xl p-4 text-white relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #faad14 0%, #fa8c16 100%)',
            }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CrownOutlined className="text-3xl" />
                <div>
                  <h3 className="text-lg font-medium">会员中心</h3>
                  <p className="text-sm opacity-90">享受更多专属权益</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">2024-12-31 到期</p>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-32 h-full opacity-10">
              <CrownOutlined className="text-8xl absolute -right-4 -top-4" />
            </div>
          </div>
        </div>

        {/* 创作灵感集 & 自定义模板 */}
        <div className="grid grid-cols-2 gap-3 mx-4 mb-4">
          <div 
            className="bg-white rounded-xl p-4 cursor-pointer active:scale-95 transition-transform"
            onClick={() => message.info('创作灵感集')}
          >
            <div className="flex items-center justify-between mb-2">
              <BookOutlined className="text-2xl text-blue-500" />
              <RightOutlined className="text-xs text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">创作灵感集</h3>
          </div>
          
          <div 
            className="bg-white rounded-xl p-4 cursor-pointer active:scale-95 transition-transform"
            onClick={() => message.info('自定义模板')}
          >
            <div className="flex items-center justify-between mb-2">
              <FileTextOutlined className="text-2xl text-green-500" />
              <RightOutlined className="text-xs text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">自定义模板</h3>
          </div>
        </div>

        {/* 工具与服务 */}
        <div className="bg-white mx-4 rounded-2xl p-4 mb-4">
          <h3 className="text-base font-medium text-gray-800 mb-4">工具与服务</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 数据统计 */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => message.info('月度报告')}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <BarChartOutlined className="text-xl text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800">数据统计</h4>
                <p className="text-xs text-gray-400">月度报告</p>
              </div>
            </div>
            
            {/* 邀请好友 */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => message.info('邀请好友')}
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <GiftOutlined className="text-xl text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800">邀请好友</h4>
                <p className="text-xs text-gray-400">赢取奖励</p>
              </div>
            </div>
          </div>
        </div>

        {/* 暗黑模式 */}
        <div className="bg-white mx-4 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <MoonOutlined className="text-xl text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-800">暗黑模式</h3>
            </div>
            <Switch 
              checked={darkMode} 
              onChange={handleDarkModeChange}
            />
          </div>
        </div>
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
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/collection')}
          >
            <HeartOutlined className="text-xl" />
            <span className="text-xs mt-1">收藏页</span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer text-blue-500"
          >
            <UserOutlined className="text-xl" />
            <span className="text-xs mt-1">我的</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
