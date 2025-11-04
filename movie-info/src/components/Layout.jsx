import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '../supabase/useSupabaseAuth';
import { supabase } from '../supabase/supabaseClient';
import { useThemeStore } from '../store/useThemeStore';

export default function Layout() {
  const { getUserInfo } = useSupabaseAuth();
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    //세션 준비 전 확인
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      //세션 준비됐으면 실행
      if (data?.session) {
        getUserInfo();
      }
    };
    init();
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
      <NavBar />
      <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-5 py-6">
        <Outlet />
      </main>
    </>
  );
}
