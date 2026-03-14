// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 布局组件
import DefaultLayout from '@/layout/default';

// 路由守卫
import RequireAuth from '@/components/RequireAuth';

// 页面组件
import Home from '@/pages/Home';
import Generate from '@/pages/Generate';
import Collection from '@/pages/Collection';
import Profile from '@/pages/Profile';
import Record from '@/pages/Record';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

/**
 * 路由配置
 * 使用React Router v6的createBrowserRouter创建路由
 * 采用二级路由结构，所有页面共享 DefaultLayout 布局
 * 
 * 权限规则：
 * - 免登页面：/home、/generate
 * - 需登录页面：/collection、/profile、/record
 * - 登录/注册页面：/login、/register
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'generate',
        element: <Generate />,
      },
      {
        path: 'collection',
        element: (
          <RequireAuth>
            <Collection />
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
  // 登录/注册页面（不使用布局）
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // 记录页面（需登录）
  {
    path: '/record',
    element: (
      <RequireAuth>
        <Record />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

// 创建路由实例
export const router = createBrowserRouter(routes);

// 导出路由配置
export default router;