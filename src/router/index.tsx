// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 布局组件
import DefaultLayout from '@/layout/default';

// 页面组件
import Home from '@/pages/Home';
import Generate from '@/pages/Generate';
import Collection from '@/pages/Collection';
import Profile from '@/pages/Profile';
import Record from '@/pages/Record';

/**
 * 路由配置
 * 使用React Router v6的createBrowserRouter创建路由
 * 采用二级路由结构，所有页面共享 DefaultLayout 布局
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
        element: <Collection />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  // 保留旧路由兼容（不使用布局）
  {
    path: '/record',
    element: <Record />,
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