import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContext';

export function SupabaseProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  //닉네임(상단메뉴 바) 수정 함수
  const updateUserName = useCallback((newName) => {
    setUserInfo((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, userName: newName };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      //저장 후 갱신
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ userInfo, setUserInfo, updateUserName }),
    [userInfo, updateUserName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
