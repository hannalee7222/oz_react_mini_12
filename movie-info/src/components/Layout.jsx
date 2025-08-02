import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';

export default function Layout() {
  const [mode, setMode] = useState('light');
  const { getUserInfo } = useSupabaseAuth();

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

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
    <>
      <NavBar mode={mode} setMode={setMode} />
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-5 py-6">
        <Outlet />
      </main>
    </>
  );
}
