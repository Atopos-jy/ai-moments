import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HomeOutlined, EditOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';

/**
 * 默认布局组件
 * 包含底部导航栏，包裹所有子页面
 */
const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 根据当前路径判断激活状态
    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/' || location.pathname === '/home';
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* 页面内容区域 */}
            <main className="max-w-lg mx-auto pb-20">
                <Outlet />
            </main>
            
            {/* 底部导航 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-lg mx-auto z-50">
                <div className="flex justify-around items-center h-16">
                    <div
                        className={`flex flex-col items-center cursor-pointer transition-colors ${
                            isActive('/') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        onClick={() => navigate('/')}
                    >
                        <HomeOutlined className="text-xl" />
                        <span className="text-xs mt-1">首页</span>
                    </div>
                    <div
                        className={`flex flex-col items-center cursor-pointer transition-colors ${
                            isActive('/generate') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        onClick={() => navigate('/generate')}
                    >
                        <EditOutlined className="text-xl" />
                        <span className="text-xs mt-1">生成页</span>
                    </div>
                    <div
                        className={`flex flex-col items-center cursor-pointer transition-colors ${
                            isActive('/collection') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        onClick={() => navigate('/collection')}
                    >
                        <HeartOutlined className="text-xl" />
                        <span className="text-xs mt-1">收藏页</span>
                    </div>
                    <div
                        className={`flex flex-col items-center cursor-pointer transition-colors ${
                            isActive('/profile') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                        }`}
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

export default Layout;
