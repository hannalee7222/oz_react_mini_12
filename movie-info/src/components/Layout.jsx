import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [mode, setMode] = useState('light');

  // ✅ Tailwind의 dark mode를 위해 html 태그에 직접 클래스 붙이기
  useEffect(() => {
    const root = document.documentElement; // <html> 태그
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('현재 모드:', mode); // ✅ 콘솔 위치: 상태가 바뀔 때마다 확인
  }, [mode]);

  return (
    <div className="app">
      <NavBar mode={mode} setMode={setMode} />
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
