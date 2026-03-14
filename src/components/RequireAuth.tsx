import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn, setRedirectFrom } from '@/utils/auth';

/**
 * RequireAuth 组件
 * 路由守卫：未登录用户重定向到登录页
 * 使用方式：在路由配置中包裹需要登录的页面
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  // 如果未登录，保存当前路径并跳转到登录页
  if (!loggedIn) {
    // 保存当前路径，登录后跳转回来
    setRedirectFrom(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // 已登录，正常渲染子组件
  return <>{children}</>;
};

export default RequireAuth;
