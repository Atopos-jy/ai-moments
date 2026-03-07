// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 页面组件
import Home from '@/pages/Home';
import Record from '@/pages/Record';
import Collect from '@/pages/Collect';

/**
 * 路由配置
 * 使用React Router v6的createBrowserRouter创建路由
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/record',
    element: <Record />,
  },
  {
    path: '/collect',
    element: <Collect />,
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