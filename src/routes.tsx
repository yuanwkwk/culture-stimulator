import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import EndingPage from './pages/EndingPage';
import LibraryPage from './pages/LibraryPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />
  },
  {
    name: '游戏',
    path: '/game',
    element: <GamePage />
  },
  {
    name: '结局',
    path: '/ending',
    element: <EndingPage />
  },
  {
    name: '内容库',
    path: '/library',
    element: <LibraryPage />
  }
];

export default routes;
