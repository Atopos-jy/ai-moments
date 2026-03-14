import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Card,
  Divider,
  Space,
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  WechatOutlined,
  QqOutlined,
  AppleOutlined,
} from '@ant-design/icons';
import { login, getRedirectFrom, clearRedirectFrom, createDemoUser } from '@/utils/auth';

/**
 * 登录页面
 */
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理登录
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    const result = login(values.username, values.password);
    
    if (result.success) {
      message.success(result.message);
      
      // 获取登录前页面，跳转回去
      const redirectFrom = getRedirectFrom();
      clearRedirectFrom();
      
      if (redirectFrom && redirectFrom !== '/login') {
        navigate(redirectFrom, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      message.error(result.message);
    }
    
    setLoading(false);
  };

  // 快速登录（演示用）
  const handleDemoLogin = () => {
    // 创建演示账号
    createDemoUser();
    
    // 自动填充并登录
    form.setFieldsValue({ username: 'demo', password: '123456' });
    handleLogin({ username: 'demo', password: '123456' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">📸</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">朋友圈灵感生成器</h1>
          <p className="text-gray-500 mt-2">开启你的智能社交之旅</p>
        </div>

        {/* 登录卡片 */}
        <Card className="shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold mb-2">欢迎回来</h2>
          <p className="text-gray-500 mb-6">登录以继续使用</p>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名/手机号/邮箱' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="用户名/手机号/邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="密码"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                忘记密码？
              </Link>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                className="h-12 rounded-full text-base font-medium"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                登录
              </Button>
            </Form.Item>

            {/* 演示账号快捷登录 */}
            <Button 
              type="default"
              block
              className="h-10 rounded-full mb-4"
              onClick={handleDemoLogin}
            >
              使用演示账号登录
            </Button>

            <div className="text-center text-sm text-gray-500">
              还没有账号？
              <Link to="/register" className="text-blue-500 hover:text-blue-600 ml-1">
                立即注册
              </Link>
            </div>
          </Form>

          <Divider>或者使用以下方式快速登录</Divider>

          {/* 第三方登录 */}
          <Space className="w-full justify-center" size="large">
            <Button 
              shape="circle" 
              size="large"
              icon={<WechatOutlined className="text-green-500" />}
              onClick={() => message.info('微信登录功能开发中')}
            />
            <Button 
              shape="circle" 
              size="large"
              icon={<QqOutlined className="text-blue-500" />}
              onClick={() => message.info('QQ登录功能开发中')}
            />
            <Button 
              shape="circle" 
              size="large"
              icon={<AppleOutlined />}
              onClick={() => message.info('Apple登录功能开发中')}
            />
          </Space>
        </Card>

        {/* 底部协议 */}
        <p className="text-center text-xs text-gray-400 mt-6">
          登录即代表您同意
          <a href="#" className="text-blue-500 hover:text-blue-600">《用户协议》</a>
          和
          <a href="#" className="text-blue-500 hover:text-blue-600">《隐私政策》</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
