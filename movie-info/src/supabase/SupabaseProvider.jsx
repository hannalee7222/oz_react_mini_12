import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';

export function SupabaseProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  //닉네임(상단메뉴 바) 수정 함수
  const updateUserName = (newName) => {
    setUserInfo((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, userName: newName };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      //저장 후 갱신
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}
