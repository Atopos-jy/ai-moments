import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Card,
  Checkbox,
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { register, login } from '@/utils/auth';

/**
 * 注册页面
 */
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理注册
  const handleRegister = async (values: { 
    username: string; 
    password: string; 
    confirmPassword: string;
    agreement: boolean;
  }) => {
    if (!values.agreement) {
      message.error('请同意用户协议和隐私政策');
      return;
    }

    setLoading(true);
    
    // 注册
    const registerResult = register(values.username, values.password);
    
    if (registerResult.success) {
      message.success(registerResult.message);
      
      // 自动登录
      const loginResult = login(values.username, values.password);
      
      if (loginResult.success) {
        message.success('已自动登录');
        navigate('/', { replace: true });
      } else {
        // 注册成功但登录失败，跳转到登录页
        navigate('/login', { replace: true });
      }
    } else {
      message.error(registerResult.message);
    }
    
    setLoading(false);
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

        {/* 注册卡片 */}
        <Card className="shadow-lg rounded-2xl">
          <h2 className="text-xl font-bold mb-2">欢迎加入</h2>
          <p className="text-gray-500 mb-6">注册新账号</p>

          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名/手机号/邮箱' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="用户名/手机号/邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少6位' },
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="密码（至少6位）"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<SafetyOutlined className="text-gray-400" />} 
                placeholder="确认密码"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意
                <a href="#" className="text-blue-500 hover:text-blue-600">《用户协议》</a>
                和
                <a href="#" className="text-blue-500 hover:text-blue-600">《隐私政策》</a>
              </Checkbox>
            </Form.Item>

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
                注册
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-500">
              已有账号？
              <Link to="/login" className="text-blue-500 hover:text-blue-600 ml-1">
                立即登录
              </Link>
            </div>
          </Form>
        </Card>

        {/* 底部提示 */}
        <p className="text-center text-xs text-gray-400 mt-6">
          纯前端演示，数据存储在本地，请勿使用真实密码
        </p>
      </div>
    </div>
  );
};

export default Register;
