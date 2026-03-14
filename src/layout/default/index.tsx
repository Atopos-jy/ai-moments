import { HomeOutlined, EditOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
const Layout = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-lg mx-auto z-50">
            <div className="flex justify-around items-center h-16">
                <div
                    className="flex flex-col items-center cursor-pointer text-blue-500"
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
                    className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => navigate('/profile')}
                >
                    <UserOutlined className="text-xl" />
                    <span className="text-xs mt-1">我的</span>
                </div>
            </div>
        </div>
    );
};

export default Layout;
